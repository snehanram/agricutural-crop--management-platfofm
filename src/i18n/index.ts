import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslation, type TranslationSchema } from './locales/en';
import { teTranslation } from './locales/te';
import { hiTranslation } from './locales/hi';
import { taTranslation, knTranslation, mlTranslation } from './locales/indianSouth';
import { bnTranslation, asTranslation, orTranslation } from './locales/indianEast';
import { mrTranslation, guTranslation, paTranslation } from './locales/indianWestNorth1';
import { urTranslation, neTranslation, sdTranslation } from './locales/indianWestNorth2';
import { bhoTranslation, doiTranslation, maiTranslation, saTranslation } from './locales/indianRegional1';
import { ksTranslation, kokTranslation, mniTranslation, satTranslation } from './locales/indianRegional2';
import { arTranslation, zhTranslation, frTranslation, deTranslation, idTranslation } from './locales/worldAtoI';
import { jaTranslation, koTranslation, ptTranslation, ruTranslation } from './locales/worldJtoR';
import { esTranslation, swTranslation } from './locales/worldStoZ';
import type { WebsiteTranslationBlock } from './websiteLocalesA';
import { WEBSITE_TRANSLATIONS } from './websiteLocalesB';

export type FullTranslationSchema = TranslationSchema & { website: WebsiteTranslationBlock };

const baseResources: Record<string, TranslationSchema> = {
  ar: arTranslation,
  as: asTranslation,
  bn: bnTranslation,
  bho: bhoTranslation,
  zh: zhTranslation,
  doi: doiTranslation,
  en: enTranslation,
  fr: frTranslation,
  de: deTranslation,
  gu: guTranslation,
  hi: hiTranslation,
  id: idTranslation,
  ja: jaTranslation,
  kn: knTranslation,
  ks: ksTranslation,
  kok: kokTranslation,
  ko: koTranslation,
  mai: maiTranslation,
  ml: mlTranslation,
  mni: mniTranslation,
  mr: mrTranslation,
  ne: neTranslation,
  or: orTranslation,
  pt: ptTranslation,
  pa: paTranslation,
  ru: ruTranslation,
  sa: saTranslation,
  sat: satTranslation,
  sd: sdTranslation,
  es: esTranslation,
  sw: swTranslation,
  ta: taTranslation,
  te: teTranslation,
  ur: urTranslation,
};

export const resources: Record<string, { translation: FullTranslationSchema }> = Object.fromEntries(
  Object.entries(baseResources).map(([code, translation]) => [
    code,
    {
      translation: {
        ...translation,
        website: WEBSITE_TRANSLATIONS[code] || WEBSITE_TRANSLATIONS.en,
      },
    },
  ])
);

const RTL_LANGS = new Set(['ar', 'ur']);

export function applyDocumentLanguageAttributes(lang: string): void {
  if (typeof document === 'undefined') return;
  const normalized = (lang || 'en').trim().split('-')[0].toLowerCase();
  document.documentElement.lang = normalized;
  document.documentElement.dir = RTL_LANGS.has(normalized) ? 'rtl' : 'ltr';
}

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('krishifield_lang') : null;
const candidateLang = savedLang ? savedLang.trim() : 'en';
const initialLang = Object.prototype.hasOwnProperty.call(resources, candidateLang) ? candidateLang : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

applyDocumentLanguageAttributes(i18n.language || initialLang);

i18n.on('languageChanged', (lng) => {
  applyDocumentLanguageAttributes(lng);
  if (typeof window !== 'undefined' && lng) {
    try {
      localStorage.setItem('krishifield_lang', lng);
    } catch {
      // ignore storage errors
    }
  }
});

export default i18n;
