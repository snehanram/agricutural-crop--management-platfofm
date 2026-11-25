import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  AlertTriangle,
  Bug,
  Calculator,
  CheckCircle2,
  Clock,
  Droplets,
  FlaskConical,
  HeartPulse,
  ImagePlus,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Sprout,
  Square,
  Volume2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { LanguageCode, PlantPhotoDiagnosis } from '../types';
import { playTextInLanguage, stopActiveSpeech } from '../utils/voiceSpeech';

export async function prepareImageForUpload(file: File): Promise<File> {
  if (typeof document === 'undefined' || !file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('decode_failed'));
      el.src = objectUrl;
    });

    const maxDim = 1280;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
    const width = Math.max(1, Math.round((img.naturalWidth || 1) * scale));
    const height = Math.max(1, Math.round((img.naturalHeight || 1) * scale));

    if (
      scale === 1 &&
      file.size <= 900 * 1024 &&
      (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')
    ) {
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86));
    if (!blob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'plant-photo';
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

interface PlantDoctorAgentProps {
  mode: 'public' | 'portal';
  cropNameHint?: string;
  fieldAcresHint?: number;
  fieldSoilTypeHint?: string;
  initialPreviewUrl?: string | null;
  onDiagnosisReady?: (result: {
    diagnosis: PlantPhotoDiagnosis;
    file: File | null;
    previewUrl: string;
  }) => void;
  onImageSelected?: (file: File, previewUrl: string) => void;
  onAnalysisStateChange?: (analyzing: boolean) => void;
}

export function PlantDoctorAgent({
  mode,
  cropNameHint,
  fieldAcresHint,
  fieldSoilTypeHint,
  initialPreviewUrl = null,
  onDiagnosisReady,
  onImageSelected,
  onAnalysisStateChange,
}: PlantDoctorAgentProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').trim() as LanguageCode;

  const [publicCropName, setPublicCropName] = useState('');
  const [publicAcres, setPublicAcres] = useState('1');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);
  const [analyzing, setAnalyzing] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [diagnosis, setDiagnosis] = useState<PlantPhotoDiagnosis | null>(null);
  const [diagnosisLang, setDiagnosisLang] = useState<string>(currentLang);
  const [error, setError] = useState('');

  const [voiceLoading, setVoiceLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechAbortRef = useRef<boolean>(false);
  const diagnosisSessionRef = useRef<number>(0);
  const translationCacheRef = useRef<Record<string, PlantPhotoDiagnosis>>({});
  const onDiagnosisReadyRef = useRef(onDiagnosisReady);
  onDiagnosisReadyRef.current = onDiagnosisReady;

  useEffect(() => {
    setPreviewUrl(initialPreviewUrl);
  }, [initialPreviewUrl]);

  const stopAudio = () => {
    stopActiveSpeech({
      audioRef,
      abortRef: speechAbortRef,
      onLoadingChange: setVoiceLoading,
      onSpeakingChange: setSpeaking,
    });
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Automatically convert active diagnosis whenever user switches language mid-session
  useEffect(() => {
    stopAudio();
    if (!diagnosis || !currentLang || diagnosisLang === currentLang) {
      return;
    }

    const sessionId = diagnosisSessionRef.current;
    const cacheKey = `${sessionId}:${currentLang}`;
    const cached = translationCacheRef.current[cacheKey];
    if (cached) {
      setDiagnosis(cached);
      setDiagnosisLang(currentLang);
      onDiagnosisReadyRef.current?.({
        diagnosis: cached,
        file: imageFile,
        previewUrl: previewUrl || '',
      });
      return;
    }

    let cancelled = false;
    setTranslating(true);
    setError('');

    api
      .translateDiagnosis(diagnosis, currentLang)
      .then((res) => {
        if (cancelled || diagnosisSessionRef.current !== sessionId) return;
        translationCacheRef.current[cacheKey] = res.diagnosis;
        setDiagnosis(res.diagnosis);
        setDiagnosisLang(currentLang);
        onDiagnosisReadyRef.current?.({
          diagnosis: res.diagnosis,
          file: imageFile,
          previewUrl: previewUrl || '',
        });
      })
      .catch(() => {
        // Keep current diagnosis if translation request fails transiently
      })
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentLang, diagnosis, diagnosisLang, imageFile, previewUrl]);

  const runAnalysis = async (file: File, currentPreview: string) => {
    stopAudio();
    const nextSession = diagnosisSessionRef.current + 1;
    diagnosisSessionRef.current = nextSession;
    const analysisLang = currentLang;

    setAnalyzing(true);
    onAnalysisStateChange?.(true);
    setError('');
    setDiagnosis(null);

    try {
      const preparedFile = await prepareImageForUpload(file);
      setImageFile(preparedFile);

      const fd = new FormData();
      fd.append('image', preparedFile);
      fd.append('language', analysisLang);

      const resolvedCrop = mode === 'portal' ? cropNameHint : publicCropName.trim();
      if (resolvedCrop) {
        fd.append('crop_name', resolvedCrop);
      }

      const resolvedAcres = mode === 'portal' ? fieldAcresHint : Number(publicAcres);
      if (typeof resolvedAcres === 'number' && Number.isFinite(resolvedAcres) && resolvedAcres > 0) {
        fd.append('field_acres', String(resolvedAcres));
      }

      if (mode === 'portal' && fieldSoilTypeHint) {
        fd.append('soil_type', fieldSoilTypeHint);
      }

      const res =
        mode === 'portal' ? await api.analyzePestPhoto(fd) : await api.analyzePublicPlantPhoto(fd);

      translationCacheRef.current[`${nextSession}:${analysisLang}`] = res.diagnosis;
      setDiagnosis(res.diagnosis);
      setDiagnosisLang(analysisLang);
      onDiagnosisReady?.({
        diagnosis: res.diagnosis,
        file: preparedFile,
        previewUrl: currentPreview,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze plant photo');
    } finally {
      setAnalyzing(false);
      onAnalysisStateChange?.(false);
    }
  };

  const handleSelectedFile = (file: File | null) => {
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setImageFile(file);
    setPreviewUrl(nextUrl);
    onImageSelected?.(file, nextUrl);
    void runAnalysis(file, nextUrl);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    e.target.value = '';
    handleSelectedFile(file);
  };

  const handleDropFile = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    handleSelectedFile(file);
  };

  const handleToggleSpeak = async () => {
    if (!diagnosis || translating) return;
    if (speaking || voiceLoading) {
      stopAudio();
      return;
    }

    const spokenText = [
      `${t('website.pestFieldTypeLabel')}: ${diagnosis.detectedPlant}. ${diagnosis.detectedFieldType}`,
      `${t('website.pestProblemLabel')}: ${diagnosis.problemName}. ${diagnosis.whatIsHappening}`,
      `${t('website.pestMedicineLabel')}: ${diagnosis.recommendedPesticide}`,
      `${t('website.pestMixingLabel')}: ${diagnosis.howMuchToMix}`,
      diagnosis.treatmentCalculation
        ? `${t('website.pestCalcLabel')}: ${diagnosis.treatmentCalculation}`
        : '',
      diagnosis.bestTimeAndMethod
        ? `${t('website.pestTimeMethodLabel')}: ${diagnosis.bestTimeAndMethod}`
        : '',
      diagnosis.stepByStepSpraying.length > 0
        ? `${t('website.pestStepsLabel')}: ${diagnosis.stepByStepSpraying.join('. ')}`
        : '',
      diagnosis.plantPrecautions
        ? `${t('website.pestPlantPrecautionsLabel')}: ${diagnosis.plantPrecautions}`
        : '',
      diagnosis.recoverySchedule ? `${t('website.pestRecoveryLabel')}: ${diagnosis.recoverySchedule}` : '',
      diagnosis.safetyTips ? `${t('website.pestSafetyLabel')}: ${diagnosis.safetyTips}` : '',
    ]
      .filter(Boolean)
      .join('. ');

    await playTextInLanguage({
      text: spokenText,
      language: currentLang,
      onLoadingChange: setVoiceLoading,
      onSpeakingChange: setSpeaking,
      audioRef,
      abortRef: speechAbortRef,
    });
  };

  return (
    <div className="space-y-5">
      {mode === 'public' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-[#E2E7E0] bg-white p-4">
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1">
              {t('common.crop')}
            </label>
            <input
              type="text"
              value={publicCropName}
              onChange={(e) => setPublicCropName(e.target.value)}
              placeholder={t('website.pestCropPlaceholder')}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1">
              {t('farms.acres')}
            </label>
            <input
              type="number"
              min="0.25"
              step="0.25"
              value={publicAcres}
              onChange={(e) => setPublicAcres(e.target.value)}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
            />
          </div>
        </div>
      )}

      {/* Big Tap-Friendly Photo Upload Area */}
      <div>
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropFile}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#15803D]/50 bg-[#F2F9F4] p-7 text-center hover:bg-[#E7F6EC] transition-colors cursor-pointer"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded crop preview"
              referrerPolicy="no-referrer"
              className="max-h-64 rounded-lg object-contain border border-[#CBE2D0] bg-white"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#15803D] text-white">
              <ImagePlus className="h-7 w-7" />
            </div>
          )}
          <div className="space-y-1">
            <p className="font-display text-base font-bold text-[#14532D]">
              {imageFile ? imageFile.name : t('website.pestTapToUpload')}
            </p>
            <p className="text-xs sm:text-sm text-[#42544B]">{t('website.pestUploadPicDesc')}</p>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
        </label>

        {imageFile && !analyzing && (
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={() => void runAnalysis(imageFile, previewUrl || '')}
              className="min-h-[38px] inline-flex items-center gap-2 rounded-lg border border-[#15803D] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#ECFDF3] cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t('website.pestReanalyzeBtn')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Analyzing Spinner */}
      {analyzing && (
        <div className="rounded-xl border border-[#CBE2D0] bg-[#ECFDF3] p-5 flex items-center gap-4">
          <Loader2 className="h-7 w-7 text-[#15803D] animate-spin shrink-0" />
          <div>
            <p className="font-display text-base font-bold text-[#14221B]">{t('website.pestAnalyzingTitle')}</p>
            <p className="text-xs sm:text-sm text-[#42544B] mt-0.5">{t('website.pestAnalyzingDesc')}</p>
          </div>
        </div>
      )}

      {/* Inline Retry Alert */}
      {error && !analyzing && (
        <div
          role="alert"
          className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#991B1B]"
        >
          <span>{error}</span>
          {imageFile && (
            <button
              type="button"
              onClick={() => void runAnalysis(imageFile, previewUrl || '')}
              className="min-h-[38px] inline-flex items-center gap-2 rounded-lg border border-[#DC2626] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#991B1B] hover:bg-[#FEE2E2] cursor-pointer shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t('website.pestReanalyzeBtn')}</span>
            </button>
          )}
        </div>
      )}

      {/* Complete 6-Part AI Plant Advisor & Recovery Report */}
      {diagnosis && !analyzing && (
        <section className="rounded-xl border border-[#CBE2D0] bg-[#FAFDFB] p-5 space-y-4">
          {translating && (
            <div className="rounded-lg border border-[#CBE2D0] bg-[#ECFDF3] px-3.5 py-2 flex items-center gap-2.5 text-xs font-medium text-[#14532D]">
              <Loader2 className="h-4 w-4 animate-spin shrink-0 text-[#15803D]" />
              <span>{t('website.pestTranslatingText')}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCEAE0] pb-3.5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#15803D] mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('website.pestDiagnosisHeader')}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#14221B]">{diagnosis.problemName}</h3>
              <p className="text-xs sm:text-sm text-[#52635A] mt-0.5">
                {diagnosis.detectedPlant} · {diagnosis.detectedFieldType} ·{' '}
                <span className="font-semibold text-[#14532D]">{t(`pests.${diagnosis.severity}`)}</span>
              </p>
            </div>
            <button
              type="button"
              disabled={translating}
              onClick={() => void handleToggleSpeak()}
              className="min-h-[42px] inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 cursor-pointer shrink-0"
            >
              {voiceLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : speaking ? (
                <Square className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span>
                {voiceLoading
                  ? t('website.pestVoiceLoading')
                  : speaking
                  ? t('website.pestStopListenBtn')
                  : t('website.pestListenBtn')}
              </span>
            </button>
          </div>

          {/* 1. Crop & Field Type + What is wrong */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-[#CBE2D0] bg-white p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#14532D]">
                <Sprout className="h-4 w-4 text-[#15803D]" />
                <span>{t('website.pestFieldTypeLabel')}</span>
              </div>
              <p className="font-display text-sm sm:text-base font-bold text-[#14221B]">
                {diagnosis.detectedPlant}
              </p>
              <p className="text-xs sm:text-sm text-[#42544B] leading-relaxed">{diagnosis.detectedFieldType}</p>
            </div>

            <div className="md:col-span-2 rounded-lg border border-[#E2E7E0] bg-white p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#52635A]">
                <Bug className="h-4 w-4 text-[#B45309]" />
                <span>{t('website.pestProblemLabel')}</span>
              </div>
              <p className="font-display text-base font-bold text-[#14221B]">{diagnosis.problemName}</p>
              <p className="text-sm text-[#32423A] leading-relaxed">{diagnosis.whatIsHappening}</p>
            </div>
          </div>

          {/* 2. Medicine & Pesticide + 3. Dosage + 4. Treatment Calculation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF3] p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#14532D]">
                <FlaskConical className="h-4 w-4 text-[#15803D]" />
                <span>{t('website.pestMedicineLabel')}</span>
              </div>
              <p className="text-sm font-semibold text-[#14221B] leading-relaxed">
                {diagnosis.recommendedPesticide}
              </p>
            </div>

            <div className="rounded-lg border border-[#CBE2D0] bg-white p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#14532D]">
                <Droplets className="h-4 w-4 text-[#15803D]" />
                <span>{t('website.pestMixingLabel')}</span>
              </div>
              <p className="text-sm text-[#14221B] leading-relaxed">{diagnosis.howMuchToMix}</p>
            </div>

            {diagnosis.treatmentCalculation && (
              <div className="rounded-lg border border-[#CBE2D0] bg-white p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#14532D]">
                  <Calculator className="h-4 w-4 text-[#15803D]" />
                  <span>{t('website.pestCalcLabel')}</span>
                </div>
                <p className="text-sm text-[#14221B] leading-relaxed font-medium">
                  {diagnosis.treatmentCalculation}
                </p>
              </div>
            )}
          </div>

          {/* 5. Best Time & Method + Step-by-Step Spraying */}
          <div className="rounded-lg border border-[#E2E7E0] bg-white p-4 space-y-3">
            {diagnosis.bestTimeAndMethod && (
              <div className="rounded-lg border border-[#DCEAE0] bg-[#F6FAF7] p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#14532D]">
                  <Clock className="h-4 w-4 text-[#15803D]" />
                  <span>{t('website.pestTimeMethodLabel')}</span>
                </div>
                <p className="text-sm text-[#14221B] leading-relaxed">{diagnosis.bestTimeAndMethod}</p>
              </div>
            )}

            {diagnosis.stepByStepSpraying.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#14532D]">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  <span>{t('website.pestStepsLabel')}</span>
                </div>
                <ol className="space-y-2">
                  {diagnosis.stepByStepSpraying.map((stepText, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#14221B] leading-relaxed">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#ECFDF3] text-xs font-bold text-[#15803D] border border-[#CBE2D0]">
                        {idx + 1}
                      </span>
                      <span>{stepText}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* 6. Precautions to Prevent Plant Damage & Farmer Safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosis.plantPrecautions && (
              <div className="rounded-lg border border-[#FDBA74] bg-[#FFF7ED] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#9A3412]">
                  <AlertTriangle className="h-4 w-4 text-[#EA580C]" />
                  <span>{t('website.pestPlantPrecautionsLabel')}</span>
                </div>
                <p className="text-sm text-[#7C2D12] leading-relaxed">{diagnosis.plantPrecautions}</p>
              </div>
            )}

            {diagnosis.safetyTips && (
              <div className="rounded-lg border border-[#FCD34D] bg-[#FFFBEB] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#92400E]">
                  <ShieldAlert className="h-4 w-4 text-[#B45309]" />
                  <span>{t('website.pestSafetyLabel')}</span>
                </div>
                <p className="text-sm text-[#78350F] leading-relaxed">{diagnosis.safetyTips}</p>
              </div>
            )}
          </div>

          {/* Plant Recovery Care Plan */}
          {diagnosis.recoverySchedule && (
            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#1E40AF]">
                <HeartPulse className="h-4 w-4 text-[#2563EB]" />
                <span>{t('website.pestRecoveryLabel')}</span>
              </div>
              <p className="text-sm text-[#1E3A8A] leading-relaxed">{diagnosis.recoverySchedule}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
