import { api } from '../lib/api';
import type { LanguageCode } from '../types';

const BCP47_BY_LANG: Record<string, string> = {
  ar: 'ar-SA',
  as: 'as-IN',
  bn: 'bn-IN',
  bho: 'hi-IN',
  zh: 'zh-CN',
  doi: 'hi-IN',
  en: 'en-IN',
  fr: 'fr-FR',
  de: 'de-DE',
  gu: 'gu-IN',
  hi: 'hi-IN',
  id: 'id-ID',
  ja: 'ja-JP',
  kn: 'kn-IN',
  ks: 'ur-PK',
  kok: 'mr-IN',
  ko: 'ko-KR',
  mai: 'hi-IN',
  ml: 'ml-IN',
  mni: 'bn-IN',
  mr: 'mr-IN',
  ne: 'ne-NP',
  or: 'or-IN',
  pt: 'pt-BR',
  pa: 'pa-IN',
  ru: 'ru-RU',
  sa: 'hi-IN',
  sat: 'hi-IN',
  sd: 'ur-PK',
  es: 'es-ES',
  sw: 'sw-KE',
  ta: 'ta-IN',
  te: 'te-IN',
  ur: 'ur-PK',
};

export function resolveSpeechLocale(lang: LanguageCode): string {
  const short = (lang || 'en').trim().split('-')[0].toLowerCase();
  return BCP47_BY_LANG[short] || lang || 'en-US';
}

export interface ActiveSpeechController {
  stop: () => void;
}

export async function playTextInLanguage(params: {
  text: string;
  language: LanguageCode;
  onLoadingChange: (loading: boolean) => void;
  onSpeakingChange: (speaking: boolean) => void;
  audioRef: { current: HTMLAudioElement | null };
  abortRef?: { current: boolean };
}): Promise<void> {
  const { text, language, onLoadingChange, onSpeakingChange, audioRef, abortRef } = params;
  const cleanText = text.trim();
  if (!cleanText) return;

  if (abortRef) abortRef.current = false;
  onLoadingChange(true);

  try {
    const { audioBase64, mimeType } = await api.speakDiagnosis(cleanText, language);
    if (abortRef?.current) {
      onLoadingChange(false);
      onSpeakingChange(false);
      return;
    }

    const audio = new Audio(`data:${mimeType || 'audio/wav'};base64,${audioBase64}`);
    audioRef.current = audio;
    audio.onended = () => {
      onSpeakingChange(false);
      audioRef.current = null;
    };
    audio.onerror = () => {
      onSpeakingChange(false);
      audioRef.current = null;
    };
    onLoadingChange(false);
    onSpeakingChange(true);
    await audio.play();
  } catch {
    onLoadingChange(false);
    if (abortRef?.current) {
      onSpeakingChange(false);
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const targetLocale = resolveSpeechLocale(language);
      const shortCode = (language || 'en').split('-')[0].toLowerCase();
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === targetLocale.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(`${shortCode}-`) || v.lang.toLowerCase() === shortCode);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = targetLocale;
      if (matchedVoice) utterance.voice = matchedVoice;
      utterance.rate = 0.92;
      utterance.onend = () => onSpeakingChange(false);
      utterance.onerror = () => onSpeakingChange(false);
      onSpeakingChange(true);
      window.speechSynthesis.speak(utterance);
    }
  }
}

export function stopActiveSpeech(params: {
  audioRef: { current: HTMLAudioElement | null };
  abortRef?: { current: boolean };
  onLoadingChange: (loading: boolean) => void;
  onSpeakingChange: (speaking: boolean) => void;
}): void {
  if (params.abortRef) params.abortRef.current = true;
  if (params.audioRef.current) {
    params.audioRef.current.pause();
    params.audioRef.current.currentTime = 0;
    params.audioRef.current = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  params.onLoadingChange(false);
  params.onSpeakingChange(false);
}
