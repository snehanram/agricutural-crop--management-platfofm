import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  CloudSun,
  LogIn,
  MapPin,
  Sprout,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CROP_CATEGORIES, CROP_GUIDES, type CropCategory } from '../data/cropKnowledge';
import type { Farmer } from '../types';
import { getLocalizedCategoryLabel, getLocalizedGuideCropName } from '../utils/cropDisplay';
import type { WebsitePage } from './WebsiteLayout';

interface WebsiteHomeProps {
  farmer: Farmer | null;
  demoLoading?: boolean;
  onNavigatePage: (page: WebsitePage, options?: { category?: 'all' | CropCategory }) => void;
  onStartDemo: () => void;
  onOpenAuth: () => void;
  onOpenPortal: () => void;
}

export function WebsiteHome({
  farmer,
  demoLoading = false,
  onNavigatePage,
  onStartDemo,
  onOpenAuth,
  onOpenPortal,
}: WebsiteHomeProps) {
  const { t } = useTranslation();
  const [heroImgError, setHeroImgError] = useState(false);
  const [orchardImgError, setOrchardImgError] = useState(false);
  const [fieldImgError, setFieldImgError] = useState(false);

  const visibleCategories = CROP_CATEGORIES.filter((cat) => cat.id !== 'all');

  const capabilities: Array<{
    key: string;
    title: string;
    desc: string;
    icon: typeof BookOpen;
    action: () => void;
  }> = [
    {
      key: 'cap1',
      title: t('website.cap1Title'),
      desc: t('website.cap1Desc'),
      icon: BookOpen,
      action: () => onNavigatePage('guide'),
    },
    {
      key: 'cap2',
      title: t('website.cap2Title'),
      desc: t('website.cap2Desc'),
      icon: MapPin,
      action: () => onNavigatePage('nearby'),
    },
    {
      key: 'cap3',
      title: t('website.cap3Title'),
      desc: t('website.cap3Desc'),
      icon: CloudSun,
      action: () => onNavigatePage('weather'),
    },
    {
      key: 'cap4',
      title: t('website.cap4Title'),
      desc: t('website.cap4Desc'),
      icon: ClipboardList,
      action: farmer ? onOpenPortal : onStartDemo,
    },
  ];

  const steps = [
    { title: t('website.step1Title'), desc: t('website.step1Desc') },
    { title: t('website.step2Title'), desc: t('website.step2Desc') },
    { title: t('website.step3Title'), desc: t('website.step3Desc') },
    { title: t('website.step4Title'), desc: t('website.step4Desc') },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-[#E2E7E0] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#52635A]">
                {t('website.heroEyebrow')}
              </p>

              <h1 className="font-display font-bold text-[#14221B] text-[clamp(2.15rem,4vw,3.5rem)] leading-[1.08] tracking-[-0.02em] [text-wrap:balance]">
                {t('website.heroTitle')}
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-[#42544B] max-w-[54ch]">
                {t('website.heroDesc')}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!farmer ? (
                  <>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#166534] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <LogIn className="h-4 w-4 shrink-0" />
                      <span>{t('website.navSignIn')}</span>
                    </button>

                    <button
                      type="button"
                      disabled={demoLoading}
                      onClick={onStartDemo}
                      className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#15803D] bg-[#F2F9F4] px-5 py-3 text-sm sm:text-base font-semibold text-[#14532D] hover:bg-[#DCFCE7] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                    >
                      <Sprout className="h-4 w-4 shrink-0 text-[#15803D]" />
                      <span>{t('website.heroSecondaryCta')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onOpenPortal}
                      className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#166534] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{t('website.openPortalBtn')}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigatePage('guide')}
                      className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#CBD5CC] bg-[#F8F9F7] px-5 py-3 text-sm sm:text-base font-semibold text-[#14221B] hover:border-[#15803D] hover:bg-[#ECFDF3] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{t('website.heroPrimaryCta')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#E2E7E0] bg-[#14221B]">
                {!heroImgError ? (
                  <img
                    src="/src/assets/images/website_hero_harvest_1795084842281.jpg"
                    alt="Green agricultural farm fields irrigated at golden sunrise"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#14532D] via-[#1B4332] to-[#0B1F16]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Asymmetric Grid */}
      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20 space-y-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#14221B] [text-wrap:balance]">
            {t('website.capabilitiesTitle')}
          </h2>
          <p className="text-base text-[#52635A] leading-relaxed">
            {t('website.capabilitiesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            const spanClass =
              index === 0 || index === 3 ? 'lg:col-span-7' : 'lg:col-span-5';
            return (
              <button
                key={cap.key}
                type="button"
                onClick={cap.action}
                className={`${spanClass} text-left rounded-2xl border border-[#E2E7E0] bg-white p-6 sm:p-7 space-y-4 hover:border-[#15803D] transition-colors group cursor-pointer`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#15803D]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#66786E] group-hover:text-[#15803D] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-bold text-[#14221B]">
                    {cap.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#52635A] leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Field & Harvest Visual Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <button
            type="button"
            onClick={() => onNavigatePage('guide')}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E2E7E0] bg-[#14221B] text-left cursor-pointer"
          >
            {!orchardImgError ? (
              <img
                src="/src/assets/images/crops_orchard_produce_1795084841133.jpg"
                alt="Freshly harvested grain, tomatoes, chili, and mangoes"
                referrerPolicy="no-referrer"
                onError={() => setOrchardImgError(true)}
                className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#166534] via-[#1B4332] to-[#14221B]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A13]/90 via-[#0D1A13]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1">
              <p className="font-display text-lg font-bold">{t('website.categoriesTitle')}</p>
              <p className="text-sm text-[#E3ECE5]">
                {farmer ? t('website.heroPrimaryCta') : t('website.navGuide')} →
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePage('weather')}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E2E7E0] bg-[#14221B] text-left cursor-pointer"
          >
            {!fieldImgError ? (
              <img
                src="/src/assets/images/farmer_field_inspection_1795084841712.jpg"
                alt="Farmer checking healthy green crops in sunlight"
                referrerPolicy="no-referrer"
                onError={() => setFieldImgError(true)}
                className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#15803D] via-[#1B4332] to-[#0B1F16]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A13]/90 via-[#0D1A13]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1">
              <p className="font-display text-lg font-bold">{t('website.navWeather')}</p>
              <p className="text-sm text-[#E3ECE5]">{t('website.cap3Title')} →</p>
            </div>
          </button>
        </div>
      </section>

      {/* Crop Categories Directory */}
      <section className="border-y border-[#E2E7E0] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#14221B]">
                {t('website.categoriesTitle')}
              </h2>
              <p className="text-base text-[#52635A]">{t('website.categoriesSubtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigatePage('guide', { category: 'all' })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D] hover:text-[#166534] whitespace-nowrap cursor-pointer"
            >
              <span>{farmer ? t('website.heroPrimaryCta') : t('website.navGuide')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCategories.map((cat) => {
              const matchingCrops = CROP_GUIDES.filter((g) => g.category === cat.id);
              const sampleNames = matchingCrops
                .slice(0, 4)
                .map((g) => getLocalizedGuideCropName(t, g))
                .join(' · ');
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigatePage('guide', { category: cat.id })}
                  className="rounded-xl border border-[#E2E7E0] bg-[#FAFBF9] p-5 text-left hover:border-[#15803D] hover:bg-[#F2F9F4] transition-colors space-y-2.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl leading-none" aria-hidden="true">
                        {cat.emoji}
                      </span>
                      <h3 className="font-display text-base font-bold text-[#14221B] truncate">
                        {getLocalizedCategoryLabel(t, cat.id, cat.labels.en)}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-semibold tabular-nums text-[#15803D] shrink-0">
                      {matchingCrops.length}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#52635A] truncate">
                    {sampleNames}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow + Closing CTA Band */}
      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20 space-y-12">
        <div className="space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#14221B]">
            {t('website.workflowTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-2"
              >
                <h3 className="font-display text-base font-bold text-[#14221B]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#52635A] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#CBE2D0] bg-[#14221B] text-white p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white [text-wrap:balance]">
              {t('website.ctaBannerTitle')}
            </h2>
            <p className="text-sm sm:text-base text-[#D8E7DC] leading-relaxed">
              {t('website.ctaBannerDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={demoLoading}
              onClick={farmer ? onOpenPortal : onStartDemo}
              className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <span>{farmer ? t('website.openPortalBtn') : t('website.heroSecondaryCta')}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>

            {!farmer && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="min-h-[46px] inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('website.navSignIn')}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
