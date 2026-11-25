import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CROP_CATEGORIES,
  CROP_GUIDES,
  type CropCategory,
} from '../data/cropKnowledge';
import {
  formatLocationString,
  INDIAN_STATES_DISTRICTS,
  parseLocationParts,
} from '../data/indianLocations';
import { api } from '../lib/api';
import type { DemoLocationOption, Farmer } from '../types';
import {
  getLocalizedCategoryLabel,
  getLocalizedCropName,
  getLocalizedGuideCropName,
  matchesCropSearch,
} from '../utils/cropDisplay';

interface FarmSetupWizardProps {
  farmer: Farmer;
  demoLocation?: DemoLocationOption | null;
  onCompleted: (updatedLocation: string) => Promise<void>;
  onSkip: () => void;
}

const ACRE_PRESETS = [0.5, 1, 2, 3, 5, 10];
const OTHER_VALUE = '__other__';

export function FarmSetupWizard({
  farmer,
  demoLocation,
  onCompleted,
  onSkip,
}: FarmSetupWizardProps) {
  const { t } = useTranslation();

  const initialParts = useMemo(() => {
    if (demoLocation) {
      return {
        state: demoLocation.state,
        district: demoLocation.district,
        village: demoLocation.village,
      };
    }
    return parseLocationParts(farmer.location);
  }, [demoLocation, farmer.location]);

  const matchedInitialState = INDIAN_STATES_DISTRICTS.find(
    (s) => s.state.toLowerCase() === initialParts.state.toLowerCase()
  );

  const [stateSelect, setStateSelect] = useState<string>(
    matchedInitialState
      ? matchedInitialState.state
      : initialParts.state
      ? OTHER_VALUE
      : ''
  );
  const [customState, setCustomState] = useState<string>(
    matchedInitialState ? '' : initialParts.state
  );

  const initialDistrictList = matchedInitialState?.districts ?? [];
  const matchedInitialDistrict = initialDistrictList.find(
    (d) => d.toLowerCase() === initialParts.district.toLowerCase()
  );

  const [districtSelect, setDistrictSelect] = useState<string>(
    matchedInitialDistrict
      ? matchedInitialDistrict
      : initialParts.district
      ? OTHER_VALUE
      : ''
  );
  const [customDistrict, setCustomDistrict] = useState<string>(
    matchedInitialDistrict ? '' : initialParts.district
  );
  const [village, setVillage] = useState<string>(initialParts.village);

  const [farmName, setFarmName] = useState<string>(
    farmer.full_name && farmer.full_name !== 'Farmer'
      ? `${farmer.full_name}'s Farm`
      : 'My Farm'
  );
  const [fieldName, setFieldName] = useState<string>('Main Field');
  const [acres, setAcres] = useState<number>(2);
  const [soilType, setSoilType] = useState<string>('Loamy');
  const [irrigationMethod, setIrrigationMethod] = useState<string>('Drip');

  // Zero random pre-selected crops — farmer picks their own crops/fruits/vegetables
  const [selectedCrops, setSelectedCrops] = useState<Array<{ name: string; variety: string }>>([]);
  const [category, setCategory] = useState<'all' | CropCategory>('all');
  const [cropSearch, setCropSearch] = useState<string>('');
  const [customCropInput, setCustomCropInput] = useState<string>('');

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const activeStateGroup = useMemo(
    () => INDIAN_STATES_DISTRICTS.find((s) => s.state === stateSelect),
    [stateSelect]
  );

  const resolvedState =
    stateSelect === OTHER_VALUE ? customState.trim() : stateSelect.trim();
  const resolvedDistrict =
    stateSelect === OTHER_VALUE || districtSelect === OTHER_VALUE
      ? customDistrict.trim()
      : districtSelect.trim();

  const handleStateChange = (nextState: string) => {
    setStateSelect(nextState);
    setDistrictSelect('');
    setCustomDistrict('');
    if (nextState !== OTHER_VALUE) {
      setCustomState('');
    }
  };

  const filteredCrops = useMemo(() => {
    return CROP_GUIDES.filter((crop) => {
      const catMatch = category === 'all' || crop.category === category;
      if (!catMatch) return false;
      return matchesCropSearch(crop, cropSearch, t);
    });
  }, [category, cropSearch, t]);

  const toggleGuideCrop = (cropNameEn: string, variety: string) => {
    setSelectedCrops((prev) => {
      const exists = prev.some((c) => c.name.toLowerCase() === cropNameEn.toLowerCase());
      if (exists) {
        return prev.filter((c) => c.name.toLowerCase() !== cropNameEn.toLowerCase());
      }
      return [...prev, { name: cropNameEn, variety }];
    });
  };

  const handleAddCustomCrop = () => {
    const clean = customCropInput.trim();
    if (!clean) return;
    setSelectedCrops((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === clean.toLowerCase())) {
        return prev;
      }
      return [...prev, { name: clean, variety: 'Local Variety' }];
    });
    setCustomCropInput('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resolvedState || !resolvedDistrict || !village.trim()) {
      setError(t('setup.needLocationError'));
      return;
    }

    if (selectedCrops.length === 0) {
      setError(t('setup.needCropError'));
      return;
    }

    const fullLocation = formatLocationString(village, resolvedDistrict, resolvedState);
    const today = new Date().toISOString().slice(0, 10);

    setSaving(true);
    try {
      await api.updatePreferences({ location: fullLocation });

      const farmRes = await api.createFarm({
        name: farmName.trim() || 'My Farm',
        location: fullLocation,
        total_area_acres: acres,
        soil_type: soilType,
        notes: '',
      });

      const fieldRes = await api.createField({
        farm_id: farmRes.farm.id,
        name: fieldName.trim() || 'Main Field',
        location: fullLocation,
        area_acres: acres,
        soil_type: soilType,
        irrigation_method: irrigationMethod,
      });

      for (const crop of selectedCrops) {
        await api.createCrop({
          field_id: fieldRes.field.id,
          crop_name: crop.name,
          variety: crop.variety,
          planting_date: today,
          cultivation_stage: 'land_preparation',
          status: 'active',
          notes: `Selected during setup for ${acres} acres at ${fullLocation}`,
        });
      }

      await onCompleted(fullLocation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save farm setup');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border border-[#CBE2D0] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2E7E0] pb-5">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold text-[#14221B]">
              {t('setup.welcomeTitle')}
            </h1>
            <p className="text-sm text-[#52635A] max-w-2xl">
              {t('setup.welcomeSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="min-h-[40px] self-start rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-4 py-2 text-xs font-semibold text-[#52635A] hover:bg-[#EDF1EB] hover:text-[#14221B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t('setup.skipBtn')}
          </button>
        </div>

        {demoLocation && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[#CBE2D0] bg-[#F2F9F4] px-4 py-3 text-xs sm:text-sm text-[#14532D]">
            <Sparkles className="h-4 w-4 text-[#15803D] shrink-0 mt-0.5" />
            <span>{t('setup.demoRandomBadge')}</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Location (State, District, Village) & Field Size */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#15803D]" />
              <h2 className="font-display text-lg font-bold text-[#14221B]">
                {t('setup.locationSectionTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-[#14221B] mb-1.5">
                  {t('setup.stateLabel')} *
                </label>
                <select
                  required
                  value={stateSelect}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                >
                  <option value="">{t('setup.selectStatePlaceholder')}</option>
                  {INDIAN_STATES_DISTRICTS.map((item) => (
                    <option key={item.state} value={item.state}>
                      {item.state}
                    </option>
                  ))}
                  <option value={OTHER_VALUE}>{t('setup.otherCustomOption')}</option>
                </select>
                {stateSelect === OTHER_VALUE && (
                  <input
                    type="text"
                    required
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder={t('setup.customStatePlaceholder')}
                    className="mt-2 w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                  />
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-[#14221B] mb-1.5">
                  {t('setup.districtLabel')} *
                </label>
                {activeStateGroup && stateSelect !== OTHER_VALUE ? (
                  <>
                    <select
                      required
                      value={districtSelect}
                      onChange={(e) => {
                        setDistrictSelect(e.target.value);
                        if (e.target.value !== OTHER_VALUE) {
                          setCustomDistrict('');
                        }
                      }}
                      className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                    >
                      <option value="">{t('setup.selectDistrictPlaceholder')}</option>
                      {activeStateGroup.districts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                      <option value={OTHER_VALUE}>{t('setup.otherCustomOption')}</option>
                    </select>
                    {districtSelect === OTHER_VALUE && (
                      <input
                        type="text"
                        required
                        value={customDistrict}
                        onChange={(e) => setCustomDistrict(e.target.value)}
                        placeholder={t('setup.customDistrictPlaceholder')}
                        className="mt-2 w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                      />
                    )}
                  </>
                ) : (
                  <input
                    type="text"
                    required
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    placeholder={t('setup.customDistrictPlaceholder')}
                    className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                  />
                )}
              </div>

              {/* Village / Town / Mandal */}
              <div>
                <label className="block text-xs font-semibold text-[#14221B] mb-1.5">
                  {t('setup.villageLabel')} *
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t('setup.villagePlaceholder')}
                  className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#52635A] mb-1.5">
                  {t('setup.farmNameLabel')}
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#52635A] mb-1.5">
                  {t('setup.fieldNameLabel')}
                </label>
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#52635A] mb-1.5">
                  {t('setup.soilLabel')}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Black Cotton">Black Cotton</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#52635A] mb-1.5">
                  {t('setup.irrigationLabel')}
                </label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
                >
                  <option value="Drip">Drip</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Canal Flood">Canal Flood</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Furrow">Furrow</option>
                </select>
              </div>
            </div>

            {/* Acres Picker */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-[#14221B]">
                {t('setup.acresLabel')}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {ACRE_PRESETS.map((ac) => (
                  <button
                    key={ac}
                    type="button"
                    onClick={() => setAcres(ac)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-lg border text-sm font-mono font-semibold transition-colors cursor-pointer ${
                      acres === ac
                        ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                        : 'border-[#D7DED4] bg-[#F8F9F7] text-[#42544B] hover:bg-[#EDF1EB]'
                    }`}
                  >
                    {ac}
                  </button>
                ))}
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={acres}
                  onChange={(e) => setAcres(Math.max(0.1, Number(e.target.value) || 1))}
                  aria-label={t('setup.acresLabel')}
                  className="w-24 min-h-[40px] rounded-lg border border-[#D7DED4] bg-white px-3 py-1.5 text-sm font-mono font-semibold tabular-nums text-[#14221B] focus:border-[#15803D] focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Step 2: Select Crops, Fruits, Vegetables */}
          <section className="space-y-4 border-t border-[#E2E7E0] pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-[#15803D]" />
                  <h2 className="font-display text-lg font-bold text-[#14221B]">
                    {t('setup.cropsSectionTitle')}
                  </h2>
                </div>
                <p className="text-xs text-[#52635A] mt-0.5">
                  {t('setup.cropsSectionSubtitle')}
                </p>
              </div>
              <span className="inline-flex items-center self-start rounded-lg bg-[#ECFDF3] border border-[#CBE2D0] px-3 py-1.5 text-xs font-semibold text-[#14532D] whitespace-nowrap">
                {t('setup.selectedCount', { count: selectedCrops.length })}
              </span>
            </div>

            {selectedCrops.length > 0 && (
              <div className="flex flex-wrap gap-2 rounded-xl border border-[#CBE2D0] bg-[#F2F9F4] p-3">
                {selectedCrops.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      setSelectedCrops((prev) => prev.filter((c) => c.name !== item.name))
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#15803D] bg-white px-3 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#FEF2F2] hover:border-[#FECACA] hover:text-[#991B1B] transition-colors cursor-pointer"
                  >
                    <span>{getLocalizedCropName(t, item.name)}</span>
                    <X className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Category Tabs + Search */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 text-[#52635A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={cropSearch}
                  onChange={(e) => setCropSearch(e.target.value)}
                  placeholder={t('setup.searchCropsPlaceholder')}
                  className="w-full min-h-[44px] rounded-xl border border-[#D7DED4] bg-white pl-10 pr-4 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CROP_CATEGORIES.map((cat) => {
                  const active = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`min-h-[36px] inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                          : 'border-[#E2E7E0] bg-white text-[#52635A] hover:bg-[#F3F6F1]'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{getLocalizedCategoryLabel(t, cat.id, cat.labels.en)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Crop / Fruit / Vegetable Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredCrops.map((crop) => {
                const isSelected = selectedCrops.some(
                  (c) => c.name.toLowerCase() === crop.names.en.toLowerCase()
                );
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => toggleGuideCrop(crop.names.en, crop.defaultVariety)}
                    className={`min-h-[56px] flex items-center justify-between gap-2 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                        : 'border-[#E2E7E0] bg-white text-[#14221B] hover:border-[#B8C7BC] hover:bg-[#FAFBF9]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{crop.emoji}</span>
                      <span className="text-xs font-semibold truncate">
                        {getLocalizedGuideCropName(t, crop)}
                      </span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-[#15803D] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Crop/Fruit Add */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customCropInput}
                onChange={(e) => setCustomCropInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomCrop();
                  }
                }}
                placeholder={t('setup.customCropPlaceholder')}
                className="flex-1 min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomCrop}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#15803D] bg-[#F2F9F4] px-4 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#E4F4E8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{t('setup.addCustomBtn')}</span>
              </button>
            </div>
          </section>

          {/* Submit Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-[#E2E7E0] pt-5">
            <button
              type="button"
              onClick={onSkip}
              className="min-h-[46px] rounded-xl border border-[#D7DED4] bg-white px-5 py-2.5 text-sm font-semibold text-[#52635A] hover:bg-[#F3F6F1] transition-colors cursor-pointer"
            >
              {t('setup.skipBtn')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors cursor-pointer"
            >
              <span>{saving ? t('setup.savingBtn') : t('setup.saveSetupBtn')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
