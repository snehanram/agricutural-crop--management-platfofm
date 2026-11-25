import { useEffect, useState } from 'react';
import {
  BookOpen,
  Bug,
  CheckCircle2,
  CloudSun,
  Droplets,
  FlaskConical,
  Minus,
  Plus,
  Search,
  Sprout,
  Tractor,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CROP_CATEGORIES,
  CROP_GUIDES,
  type CropCategory,
  type CropGuideProfile,
} from '../data/cropKnowledge';
import { api } from '../lib/api';
import { CULTIVATION_STAGES, type Farm } from '../types';
import type { NavSection } from '../components/AppShell';
import {
  getLocalizedCategoryLabel,
  getLocalizedGuideCropName,
  matchesCropSearch,
} from '../utils/cropDisplay';

interface CropGuidePageProps {
  farms: Farm[];
  onRefresh: () => Promise<void>;
  onNavigate: (section: NavSection) => void;
  initialCategory?: 'all' | CropCategory;
  isAuthenticated?: boolean;
  onRequireAuth?: (mode: 'demo' | 'auth') => void;
}

type GuideTab =
  | 'plantation'
  | 'stages'
  | 'irrigation'
  | 'fertilizer'
  | 'pests'
  | 'harvest'
  | 'weather';

const ACRE_PRESETS = [0.5, 1, 2, 3, 5, 10];

export function CropGuidePage({
  farms,
  onRefresh,
  onNavigate,
  initialCategory = 'all',
  isAuthenticated = true,
  onRequireAuth,
}: CropGuidePageProps) {
  const { t, i18n } = useTranslation();
  const rawLang = i18n.language?.slice(0, 2);
  const lang: 'en' | 'te' | 'hi' = rawLang === 'te' || rawLang === 'hi' ? rawLang : 'en';

  const [acres, setAcres] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState<'all' | CropCategory>(initialCategory);
  const [selectedCropId, setSelectedCropId] = useState<string>(CROP_GUIDES[0].id);
  const [cropSearch, setCropSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<GuideTab>('plantation');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [guestPrompt, setGuestPrompt] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedCategory(initialCategory);
    if (initialCategory !== 'all') {
      const firstInCategory = CROP_GUIDES.find((g) => g.category === initialCategory);
      if (firstInCategory) {
        setSelectedCropId(firstInCategory.id);
      }
    }
  }, [initialCategory]);

  const filteredCropGuides = CROP_GUIDES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCategory) return false;
    const q = cropSearch.trim().toLowerCase();
    if (!q) return true;
    const categoryMeta = CROP_CATEGORIES.find((cat) => cat.id === item.category);
    const localizedCat = categoryMeta
      ? getLocalizedCategoryLabel(t, categoryMeta.id, categoryMeta.labels.en).toLowerCase()
      : '';
    return (
      matchesCropSearch(item, q, t) ||
      localizedCat.includes(q) ||
      (categoryMeta?.labels.en.toLowerCase().includes(q) ?? false) ||
      (categoryMeta?.labels.te.toLowerCase().includes(q) ?? false) ||
      (categoryMeta?.labels.hi.toLowerCase().includes(q) ?? false)
    );
  });

  const crop: CropGuideProfile = CROP_GUIDES.find((c) => c.id === selectedCropId) || CROP_GUIDES[0];
  const cropDisplayName = getLocalizedGuideCropName(t, crop);

  const adjustAcres = (delta: number) => {
    setAcres((prev) => Math.max(0.5, Number((prev + delta).toFixed(1))));
    setSavedMsg('');
  };

  const handleAddToFarm = async () => {
    if (!isAuthenticated) {
      setGuestPrompt(true);
      setSavedMsg('');
      setError('');
      return;
    }

    setGuestPrompt(false);
    setSaving(true);
    setSavedMsg('');
    setError('');
    try {
      let targetFarmId = farms[0]?.id;
      if (!targetFarmId) {
        const farmRes = await api.createFarm({
          name: 'My Main Farm',
          location: 'Guntur, Andhra Pradesh',
          total_area_acres: acres,
          soil_type: 'Loamy',
          notes: 'Created from Crop & Acre Guide',
        });
        targetFarmId = farmRes.farm.id;
      }

      const fieldRes = await api.createField({
        farm_id: targetFarmId,
        name: `${crop.names.en} Plot (${acres} ac)`,
        location: farms[0]?.location || 'Main Sector',
        area_acres: acres,
        soil_type: farms[0]?.soil_type || 'Loamy',
        irrigation_method: crop.irrigation.method,
      });

      await api.createCrop({
        field_id: fieldRes.field.id,
        crop_name: crop.names.en,
        variety: crop.defaultVariety,
        planting_date: new Date().toISOString().slice(0, 10),
        cultivation_stage: 'land_preparation',
        status: 'active',
        notes: `${acres} acres · Seed: ${Math.round(crop.plantation.seedRateKgPerAcre * acres)} kg`,
      });

      await onRefresh();
      setSavedMsg(t('guide.addedSuccess', { acres, crop: cropDisplayName }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add crop to farm');
    } finally {
      setSaving(false);
    }
  };

  const tabs: Array<{ id: GuideTab; label: string; icon: typeof Sprout }> = [
    { id: 'plantation', label: t('guide.tabs.plantation'), icon: Sprout },
    { id: 'stages', label: t('guide.tabs.stages'), icon: BookOpen },
    { id: 'irrigation', label: t('guide.tabs.irrigation'), icon: Droplets },
    { id: 'fertilizer', label: t('guide.tabs.fertilizer'), icon: FlaskConical },
    { id: 'pests', label: t('guide.tabs.pests'), icon: Bug },
    { id: 'harvest', label: t('guide.tabs.harvest'), icon: Tractor },
    { id: 'weather', label: t('guide.tabs.weather'), icon: CloudSun },
  ];

  const totalSeedsKg = Number((crop.plantation.seedRateKgPerAcre * acres).toFixed(1));
  const totalWaterLiters = Math.round(crop.irrigation.litersPerAcre * acres);
  const totalYieldKg = Math.round(crop.harvest.expectedYieldKgPerAcre * acres);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('guide.title')}</h1>
        <p className="text-sm text-[#52635A] mt-1">{t('guide.subtitle')}</p>
      </div>

      {/* Step 1: Acres Picker */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
        <h2 className="font-display text-base font-bold text-[#14221B]">{t('guide.step1')}</h2>

        <div className="flex flex-wrap items-center gap-2.5">
          {ACRE_PRESETS.map((preset) => {
            const active = acres === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAcres(preset);
                  setSavedMsg('');
                }}
                className={`min-h-[48px] px-4 py-2 rounded-xl border text-base font-semibold font-mono tabular-nums transition-colors cursor-pointer ${
                  active
                    ? 'border-[#15803D] bg-[#15803D] text-white'
                    : 'border-[#D7DED4] bg-[#F8F9F7] text-[#14221B] hover:border-[#15803D]'
                }`}
              >
                {preset} {t('guide.acresLabel')}
              </button>
            );
          })}

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => adjustAcres(-0.5)}
              aria-label="Decrease acres"
              className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-xl border border-[#D7DED4] bg-white text-[#14221B] hover:bg-[#F3F6F1] cursor-pointer"
            >
              <Minus className="h-5 w-5" />
            </button>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={acres}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v) && v > 0) setAcres(v);
              }}
              aria-label="Acres input"
              className="min-h-[48px] w-24 rounded-xl border border-[#D7DED4] bg-white px-3 text-center font-mono text-lg font-bold tabular-nums text-[#14221B]"
            />
            <button
              type="button"
              onClick={() => adjustAcres(0.5)}
              aria-label="Increase acres"
              className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-xl border border-[#D7DED4] bg-white text-[#14221B] hover:bg-[#F3F6F1] cursor-pointer"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Step 2: Prominent Searchable Visual Crop, Fruit & Vegetable Picker */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-base font-bold text-[#14221B]">{t('guide.step2')}</h2>
          <span className="font-mono text-xs font-semibold tabular-nums text-[#52635A]">
            {t('guide.cropCount', { count: filteredCropGuides.length })}
          </span>
        </div>

        {/* Prominent Farmer-Friendly Search Bar */}
        <div className="relative">
          <Search className="h-5 w-5 text-[#15803D] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={cropSearch}
            onChange={(e) => setCropSearch(e.target.value)}
            placeholder={t('guide.searchCropPlaceholder')}
            aria-label={t('guide.searchCropPlaceholder')}
            className="w-full min-h-[54px] rounded-xl border-2 border-[#CBD5CC] bg-[#F8F9F7] pl-12 pr-24 py-3 text-base font-medium text-[#14221B] placeholder:text-[#66786E] focus:border-[#15803D] focus:bg-white focus:outline-none transition-colors"
          />
          {cropSearch && (
            <button
              type="button"
              onClick={() => setCropSearch('')}
              aria-label={t('guide.clearSearch')}
              className="min-h-[38px] absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-lg border border-[#D7DED4] bg-white px-2.5 py-1 text-xs font-semibold text-[#14221B] hover:bg-[#F3F6F1] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t('guide.clearSearch')}</span>
            </button>
          )}
        </div>

        {/* Category Filter Tabs (All, Vegetables, Fruits, Grains, Pulses, Spices, Cash Crops) */}
        <div className="flex flex-wrap gap-2">
          {CROP_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const catCount =
              cat.id === 'all'
                ? CROP_GUIDES.length
                : CROP_GUIDES.filter((g) => g.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'border-[#15803D] bg-[#15803D] text-white'
                    : 'border-[#D7DED4] bg-[#F8F9F7] text-[#34443B] hover:border-[#15803D]'
                }`}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                <span>{getLocalizedCategoryLabel(t, cat.id, cat.labels.en)}</span>
                <span className={`font-mono tabular-nums text-[11px] ${active ? 'text-white/90' : 'text-[#52635A]'}`}>
                  ({catCount})
                </span>
              </button>
            );
          })}
        </div>

        {filteredCropGuides.length === 0 ? (
          <div className="rounded-xl border border-[#E2E7E0] bg-[#FAFBF9] p-6 text-center space-y-3">
            <p className="text-sm text-[#52635A]">
              {t('guide.noCropMatches', { query: cropSearch })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="min-h-[40px] rounded-lg border border-[#15803D] bg-[#ECFDF3] px-4 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#DCFCE7] cursor-pointer"
                >
                  {t('guide.showAllCategories')}
                </button>
              )}
              {cropSearch && (
                <button
                  type="button"
                  onClick={() => setCropSearch('')}
                  className="min-h-[40px] rounded-lg border border-[#D7DED4] bg-white px-4 py-2 text-xs font-semibold text-[#14221B] hover:bg-[#F3F6F1] cursor-pointer"
                >
                  {t('guide.clearSearch')}
                </button>
              )}
              {cropSearch.trim() && (
                <button
                  type="button"
                  onClick={() => (isAuthenticated ? onNavigate('crops') : onRequireAuth?.('auth'))}
                  className="min-h-[40px] rounded-lg bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#166534] cursor-pointer"
                >
                  {t('guide.useCustomCrop', { query: cropSearch.trim() })}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCropGuides.map((item) => {
              const active = item.id === selectedCropId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedCropId(item.id);
                    setSavedMsg('');
                  }}
                  className={`min-h-[76px] rounded-xl border p-3.5 text-left transition-colors flex items-center gap-3 cursor-pointer ${
                    active
                      ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                      : 'border-[#E2E7E0] bg-[#FAFBF9] text-[#14221B] hover:border-[#B8C7BC]'
                  }`}
                >
                  <span className="text-3xl leading-none shrink-0" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm sm:text-base font-bold truncate">
                      {getLocalizedGuideCropName(t, item)}
                    </p>
                    <p className="text-xs text-[#52635A] truncate">{item.defaultVariety}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Summary Action Bar */}
      <section className="rounded-xl border border-[#CBE2D0] bg-[#F2F9F4] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {crop.emoji}
          </span>
          <div>
            <p className="font-display text-base sm:text-lg font-bold text-[#14221B]">
              {t('guide.selectedSummary', { acres, crop: cropDisplayName })}
            </p>
            <p className="text-xs text-[#42544B] mt-0.5">
              {t('guide.bestSeason')}: {crop.bestSeason[lang] || crop.bestSeason.en}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => void handleAddToFarm()}
          className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t('guide.addToMyFarm')}</span>
        </button>
      </section>

      {guestPrompt && !isAuthenticated && (
        <div className="rounded-xl border border-[#86EFAC] bg-[#F2F9F4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#14221B]">
          <span className="font-medium">{t('website.signInToSaveCrop')}</span>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onRequireAuth?.('demo')}
              className="min-h-[38px] rounded-lg border border-[#15803D] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#DCFCE7] cursor-pointer whitespace-nowrap"
            >
              {t('website.heroSecondaryCta')}
            </button>
            <button
              type="button"
              onClick={() => onRequireAuth?.('auth')}
              className="min-h-[38px] rounded-lg bg-[#15803D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#166534] cursor-pointer whitespace-nowrap"
            >
              {t('website.navSignIn')}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]"
        >
          {error}
        </div>
      )}

      {savedMsg && (
        <div className="rounded-xl border border-[#86EFAC] bg-[#ECFDF3] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#14532D]">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#15803D]" />
            <span>{savedMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('crops')}
            className="min-h-[38px] rounded-lg border border-[#15803D] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#DCFCE7] cursor-pointer whitespace-nowrap"
          >
            {t('nav.crops')}
          </button>
        </div>
      )}

      {/* Step 3: All Required Information Tabs */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white overflow-hidden">
        <div className="border-b border-[#E2E7E0] bg-[#FAFBF9] p-2 flex flex-wrap gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#15803D] text-white'
                    : 'bg-white border border-[#E2E7E0] text-[#42544B] hover:text-[#14221B]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-5 sm:p-6">
          {/* 1. PLANTATION & SEEDS */}
          {activeTab === 'plantation' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('guide.seedNeeded')} ({acres} {t('guide.acresLabel')})</p>
                  <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#15803D]">
                    {crop.plantation.seedNote ? `${Math.round(totalSeedsKg)}` : `${totalSeedsKg} kg`}
                  </p>
                  <p className="text-xs text-[#52635A] mt-0.5 tabular-nums">
                    {crop.plantation.seedNote
                      ? crop.plantation.seedNote[lang] || crop.plantation.seedNote.en
                      : `(${crop.plantation.seedRateKgPerAcre} kg / acre)`}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('guide.spacing')}</p>
                  <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#14221B]">
                    {crop.plantation.spacing}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('guide.depth')}</p>
                  <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#14221B]">
                    {crop.plantation.depthCm}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#E2E7E0] bg-white p-4 text-base leading-relaxed text-[#14221B]">
                {crop.plantation.tip[lang] || crop.plantation.tip.en}
              </div>
            </div>
          )}

          {/* 2. 7 CULTIVATION STAGES */}
          {activeTab === 'stages' && (
            <div className="divide-y divide-[#EEF2EC]">
              {CULTIVATION_STAGES.map((stageKey, idx) => {
                const info = crop.stagesInfo[stageKey];
                return (
                  <div key={stageKey} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 sm:w-64 shrink-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF3] border border-[#15803D] font-mono text-sm font-bold text-[#14532D]">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-[#14221B]">
                          {t(`stages.${stageKey}`)}
                        </p>
                        <p className="font-mono text-xs tabular-nums text-[#52635A]">{info.days}</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-[#34443B] leading-relaxed">
                      {info.action[lang] || info.action.en}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. IRRIGATION */}
          {activeTab === 'irrigation' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('guide.waterEvery')}</p>
                  <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#14221B]">
                    {crop.irrigation.frequencyDays} {t('guide.days')}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('guide.waterAmount')} ({acres} {t('guide.acresLabel')})</p>
                  <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#15803D]">
                    {totalWaterLiters.toLocaleString()} L
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('farms.irrigationMethod')}</p>
                  <p className="mt-1 font-display text-xl font-bold text-[#14221B]">
                    {crop.irrigation.method}
                  </p>
                </div>
              </div>

              <p className="text-base leading-relaxed text-[#14221B]">
                {crop.irrigation.tip[lang] || crop.irrigation.tip.en}
              </p>

              <button
                type="button"
                onClick={() => (isAuthenticated ? onNavigate('irrigation') : onRequireAuth?.('auth'))}
                className="min-h-[42px] inline-flex items-center gap-2 rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-4 py-2 text-sm font-semibold text-[#14221B] hover:bg-[#EDF1EB] cursor-pointer"
              >
                <Droplets className="h-4 w-4 text-[#15803D]" />
                <span>{t('irrigation.addRecord')}</span>
              </button>
            </div>
          )}

          {/* 4. FERTILIZERS */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-4">
              <div className="divide-y divide-[#EEF2EC]">
                {crop.fertilizers.map((fert) => {
                  const totalKg = Math.round(fert.kgPerAcre * acres);
                  return (
                    <div key={fert.stage} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-base font-bold text-[#14221B]">{fert.name}</p>
                        <p className="text-xs text-[#52635A] mt-0.5">
                          {fert.stage} · {fert.timing}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-mono text-xl font-bold tabular-nums text-[#15803D]">
                          {totalKg} kg
                        </p>
                        <p className="font-mono text-xs tabular-nums text-[#52635A]">
                          ({fert.kgPerAcre} kg × {acres} acres)
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => (isAuthenticated ? onNavigate('fertilizers') : onRequireAuth?.('auth'))}
                className="min-h-[42px] inline-flex items-center gap-2 rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-4 py-2 text-sm font-semibold text-[#14221B] hover:bg-[#EDF1EB] cursor-pointer"
              >
                <FlaskConical className="h-4 w-4 text-[#15803D]" />
                <span>{t('fertilizers.addRecord')}</span>
              </button>
            </div>
          )}

          {/* 5. PESTS & OBSERVATIONS */}
          {activeTab === 'pests' && (
            <div className="space-y-4">
              {crop.pests.map((pest) => (
                <div key={pest.name} className="rounded-xl border border-[#E2E7E0] bg-[#FAFBF9] p-4 space-y-2.5">
                  <h3 className="font-display text-base font-bold text-[#14221B]">{pest.name}</h3>
                  <p className="text-sm text-[#34443B]">
                    <span className="font-semibold text-[#14221B]">{t('guide.whatToLookFor')}: </span>
                    {pest.observationSign[lang] || pest.observationSign.en}
                  </p>
                  <p className="text-sm text-[#14532D] bg-[#ECFDF3] border border-[#CBE2D0] rounded-lg px-3 py-2">
                    <span className="font-semibold">{t('guide.whatToDo')}: </span>
                    {pest.treatment[lang] || pest.treatment.en}
                  </p>
                </div>
              ))}

              <button
                type="button"
                onClick={() => (isAuthenticated ? onNavigate('pests') : onRequireAuth?.('auth'))}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] cursor-pointer"
              >
                <Bug className="h-4 w-4" />
                <span>{t('guide.logPestShortcut')}</span>
              </button>
            </div>
          )}

          {/* 6. HARVESTING */}
          {activeTab === 'harvest' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('guide.harvestTime')}</p>
                  <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#14221B]">
                    {crop.harvest.daysToHarvest}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2E7E0] bg-[#F8F9F7] p-4">
                  <p className="text-xs text-[#52635A]">{t('guide.totalYield')} ({acres} {t('guide.acresLabel')})</p>
                  <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#15803D]">
                    {totalYieldKg.toLocaleString()} kg
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm sm:text-base text-[#14221B]">
                <p>
                  <span className="font-semibold">{t('guide.whatToLookFor')}: </span>
                  {crop.harvest.readinessSigns[lang] || crop.harvest.readinessSigns.en}
                </p>
                <p className="text-[#42544B]">
                  {crop.harvest.storageTip[lang] || crop.harvest.storageTip.en}
                </p>
              </div>
            </div>
          )}

          {/* 7. WEATHER ADVICE */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-[#14221B]">
                {crop.weatherAdvice[lang] || crop.weatherAdvice.en}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('weather')}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] cursor-pointer"
              >
                <CloudSun className="h-4 w-4" />
                <span>{t('dashboard.viewWeather')}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
