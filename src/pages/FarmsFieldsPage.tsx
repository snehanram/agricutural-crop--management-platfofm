import { useState, type FormEvent } from 'react';
import { MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  formatLocationString,
  INDIAN_STATES_DISTRICTS,
  parseLocationParts,
} from '../data/indianLocations';
import { api } from '../lib/api';
import type { Farm, Field } from '../types';

const OTHER_VALUE = '__other__';

interface FarmsFieldsPageProps {
  farms: Farm[];
  fields: Field[];
  onRefresh: () => Promise<void>;
}

export function FarmsFieldsPage({ farms, fields, onRefresh }: FarmsFieldsPageProps) {
  const { t } = useTranslation();
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Farm Form State
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [farmName, setFarmName] = useState('');
  const [farmState, setFarmState] = useState('');
  const [farmCustomState, setFarmCustomState] = useState('');
  const [farmDistrict, setFarmDistrict] = useState('');
  const [farmCustomDistrict, setFarmCustomDistrict] = useState('');
  const [farmVillage, setFarmVillage] = useState('');
  const [farmArea, setFarmArea] = useState('');
  const [farmSoil, setFarmSoil] = useState('Clay Loam');
  const [farmNotes, setFarmNotes] = useState('');

  // Field Form State
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [fieldFarmId, setFieldFarmId] = useState<string>(farms[0]?.id ? String(farms[0].id) : '');
  const [fieldName, setFieldName] = useState('');
  const [fieldLocation, setFieldLocation] = useState('');
  const [fieldArea, setFieldArea] = useState('');
  const [fieldSoil, setFieldSoil] = useState('Loamy');
  const [fieldIrrigation, setFieldIrrigation] = useState('Drip');

  const [error, setError] = useState('');

  const activeStateGroup = INDIAN_STATES_DISTRICTS.find((s) => s.state === farmState);
  const resolvedFarmState = farmState === OTHER_VALUE ? farmCustomState.trim() : farmState.trim();
  const resolvedFarmDistrict =
    farmState === OTHER_VALUE || farmDistrict === OTHER_VALUE
      ? farmCustomDistrict.trim()
      : farmDistrict.trim();

  const applyLocationToForm = (locationStr: string) => {
    const parts = parseLocationParts(locationStr);
    const matchedState = INDIAN_STATES_DISTRICTS.find(
      (s) => s.state.toLowerCase() === parts.state.toLowerCase()
    );
    if (matchedState) {
      setFarmState(matchedState.state);
      setFarmCustomState('');
      const matchedDistrict = matchedState.districts.find(
        (d) => d.toLowerCase() === parts.district.toLowerCase()
      );
      if (matchedDistrict) {
        setFarmDistrict(matchedDistrict);
        setFarmCustomDistrict('');
      } else {
        setFarmDistrict(parts.district ? OTHER_VALUE : '');
        setFarmCustomDistrict(parts.district);
      }
    } else {
      setFarmState(parts.state ? OTHER_VALUE : '');
      setFarmCustomState(parts.state);
      setFarmDistrict(parts.district ? OTHER_VALUE : '');
      setFarmCustomDistrict(parts.district);
    }
    setFarmVillage(parts.village);
  };

  const openAddFarm = () => {
    setEditingFarm(null);
    setFarmName('');
    applyLocationToForm('');
    setFarmArea('');
    setFarmSoil('Clay Loam');
    setFarmNotes('');
    setShowFarmForm(true);
    setError('');
  };

  const openEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setFarmName(farm.name);
    applyLocationToForm(farm.location);
    setFarmArea(String(farm.total_area_acres));
    setFarmSoil(farm.soil_type);
    setFarmNotes(farm.notes);
    setShowFarmForm(true);
    setError('');
  };

  const handleSaveFarm = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const formattedLocation = formatLocationString(farmVillage, resolvedFarmDistrict, resolvedFarmState);
    if (!formattedLocation) {
      setError(t('setup.needLocationError'));
      return;
    }
    try {
      const payload = {
        name: farmName,
        location: formattedLocation,
        total_area_acres: Number(farmArea) || 0,
        soil_type: farmSoil,
        notes: farmNotes,
      };
      if (editingFarm) {
        await api.updateFarm(editingFarm.id, payload);
      } else {
        await api.createFarm(payload);
      }
      setShowFarmForm(false);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save farm');
    }
  };

  const handleDeleteFarm = async (id: number) => {
    setError('');
    try {
      await api.deleteFarm(id);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete farm');
    }
  };

  const openAddField = () => {
    if (farms.length === 0) {
      openAddFarm();
      setError(t('farms.noFarms'));
      return;
    }
    setEditingField(null);
    setFieldFarmId(farms[0]?.id ? String(farms[0].id) : '');
    setFieldName('');
    setFieldLocation('');
    setFieldArea('');
    setFieldSoil('Loamy');
    setFieldIrrigation('Drip');
    setShowFieldForm(true);
    setError('');
  };

  const openEditField = (field: Field) => {
    setEditingField(field);
    setFieldFarmId(String(field.farm_id));
    setFieldName(field.name);
    setFieldLocation(field.location);
    setFieldArea(String(field.area_acres));
    setFieldSoil(field.soil_type);
    setFieldIrrigation(field.irrigation_method);
    setShowFieldForm(true);
    setError('');
  };

  const handleSaveField = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        farm_id: Number(fieldFarmId),
        name: fieldName,
        location: fieldLocation,
        area_acres: Number(fieldArea) || 0,
        soil_type: fieldSoil,
        irrigation_method: fieldIrrigation,
      };
      if (editingField) {
        await api.updateField(editingField.id, payload);
      } else {
        await api.createField(payload);
      }
      setShowFieldForm(false);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save field');
    }
  };

  const handleDeleteField = async (id: number) => {
    setError('');
    try {
      await api.deleteField(id);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete field');
    }
  };

  const filteredFields = fields.filter((fl) => {
    const matchesFarm = selectedFarmFilter === 'all' || String(fl.farm_id) === selectedFarmFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      fl.name.toLowerCase().includes(q) ||
      (fl.farm_name || '').toLowerCase().includes(q) ||
      fl.soil_type.toLowerCase().includes(q) ||
      fl.location.toLowerCase().includes(q);
    return matchesFarm && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('farms.title')}</h1>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openAddFarm}
            className="min-h-[42px] inline-flex items-center gap-1.5 rounded-lg border border-[#D7DED4] bg-white px-4 py-2 text-sm font-semibold text-[#14221B] hover:bg-[#F3F6F1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('farms.addFarm')}</span>
          </button>
          <button
            type="button"
            onClick={openAddField}
            className="min-h-[42px] inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('farms.addField')}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
          {error}
        </div>
      )}

      {/* Add/Edit Farm Form */}
      {showFarmForm && (
        <form onSubmit={handleSaveFarm} className="rounded-xl border border-[#CBD5E1] bg-white p-5 space-y-4">
          <h2 className="font-display text-base font-bold text-[#14221B]">
            {editingFarm ? `${t('farms.edit')} ${editingFarm.name}` : t('farms.addFarm')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.farmName')}</label>
              <input
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Green Valley Farm"
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('setup.stateLabel')}</label>
              <select
                required
                value={farmState}
                onChange={(e) => {
                  setFarmState(e.target.value);
                  setFarmDistrict('');
                  setFarmCustomDistrict('');
                  if (e.target.value !== OTHER_VALUE) setFarmCustomState('');
                }}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
              >
                <option value="">{t('setup.selectStatePlaceholder')}</option>
                {INDIAN_STATES_DISTRICTS.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state}
                  </option>
                ))}
                <option value={OTHER_VALUE}>{t('setup.otherCustomOption')}</option>
              </select>
              {farmState === OTHER_VALUE && (
                <input
                  required
                  value={farmCustomState}
                  onChange={(e) => setFarmCustomState(e.target.value)}
                  placeholder={t('setup.customStatePlaceholder')}
                  className="mt-2 w-full min-h-[40px] rounded-lg border border-[#D7DED4] px-3 py-1.5 text-sm"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('setup.districtLabel')}</label>
              {activeStateGroup && farmState !== OTHER_VALUE ? (
                <>
                  <select
                    required
                    value={farmDistrict}
                    onChange={(e) => {
                      setFarmDistrict(e.target.value);
                      if (e.target.value !== OTHER_VALUE) setFarmCustomDistrict('');
                    }}
                    className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
                  >
                    <option value="">{t('setup.selectDistrictPlaceholder')}</option>
                    {activeStateGroup.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                    <option value={OTHER_VALUE}>{t('setup.otherCustomOption')}</option>
                  </select>
                  {farmDistrict === OTHER_VALUE && (
                    <input
                      required
                      value={farmCustomDistrict}
                      onChange={(e) => setFarmCustomDistrict(e.target.value)}
                      placeholder={t('setup.customDistrictPlaceholder')}
                      className="mt-2 w-full min-h-[40px] rounded-lg border border-[#D7DED4] px-3 py-1.5 text-sm"
                    />
                  )}
                </>
              ) : (
                <input
                  required
                  value={farmCustomDistrict}
                  onChange={(e) => setFarmCustomDistrict(e.target.value)}
                  placeholder={t('setup.customDistrictPlaceholder')}
                  className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('setup.villageLabel')}</label>
              <input
                required
                value={farmVillage}
                onChange={(e) => setFarmVillage(e.target.value)}
                placeholder={t('setup.villagePlaceholder')}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.areaAcres')}</label>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {[1, 2, 3, 5, 10].map((ac) => (
                  <button
                    key={ac}
                    type="button"
                    onClick={() => setFarmArea(String(ac))}
                    className={`px-2 py-0.5 text-xs rounded border font-mono cursor-pointer ${
                      farmArea === String(ac)
                        ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D] font-semibold'
                        : 'border-[#D7DED4] bg-[#F8F9F7] text-[#52635A]'
                    }`}
                  >
                    {ac}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                value={farmArea}
                onChange={(e) => setFarmArea(e.target.value)}
                placeholder="12.5"
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.soilType')}</label>
              <input
                value={farmSoil}
                onChange={(e) => setFarmSoil(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.notes')}</label>
            <input
              value={farmNotes}
              onChange={(e) => setFarmNotes(e.target.value)}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] cursor-pointer"
            >
              {t('farms.save')}
            </button>
            <button
              type="button"
              onClick={() => setShowFarmForm(false)}
              className="min-h-[40px] rounded-lg border border-[#D7DED4] px-4 py-2 text-sm font-semibold text-[#52635A] hover:bg-[#F3F6F1] cursor-pointer"
            >
              {t('farms.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* Add/Edit Field Form */}
      {showFieldForm && (
        <form onSubmit={handleSaveField} className="rounded-xl border border-[#CBD5E1] bg-white p-5 space-y-4">
          <h2 className="font-display text-base font-bold text-[#14221B]">
            {editingField ? `${t('farms.edit')} ${editingField.name}` : t('farms.addField')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.selectFarm')}</label>
              <select
                required
                value={fieldFarmId}
                onChange={(e) => setFieldFarmId(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.fieldName')}</label>
              <input
                required
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="North Paddy Block"
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.location')}</label>
              <input
                value={fieldLocation}
                onChange={(e) => setFieldLocation(e.target.value)}
                placeholder="Sector A - Canal Side"
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.areaAcres')}</label>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {[0.5, 1, 2, 3, 5, 10].map((ac) => (
                  <button
                    key={ac}
                    type="button"
                    onClick={() => setFieldArea(String(ac))}
                    className={`px-2 py-0.5 text-xs rounded border font-mono cursor-pointer ${
                      fieldArea === String(ac)
                        ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D] font-semibold'
                        : 'border-[#D7DED4] bg-[#F8F9F7] text-[#52635A]'
                    }`}
                  >
                    {ac}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                required
                value={fieldArea}
                onChange={(e) => setFieldArea(e.target.value)}
                placeholder="4.5"
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.soilType')}</label>
              <input
                value={fieldSoil}
                onChange={(e) => setFieldSoil(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('farms.irrigationMethod')}</label>
              <select
                value={fieldIrrigation}
                onChange={(e) => setFieldIrrigation(e.target.value)}
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
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] cursor-pointer"
            >
              {t('farms.save')}
            </button>
            <button
              type="button"
              onClick={() => setShowFieldForm(false)}
              className="min-h-[40px] rounded-lg border border-[#D7DED4] px-4 py-2 text-sm font-semibold text-[#52635A] hover:bg-[#F3F6F1] cursor-pointer"
            >
              {t('farms.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* Farm Profiles Grid */}
      <section className="space-y-3">
        <h2 className="font-display text-base font-bold text-[#14221B]">
          {t('farms.farmProfilesTitle')} ({farms.length})
        </h2>
        {farms.length === 0 ? (
          <div className="rounded-xl border border-[#E2E7E0] bg-white p-8 text-center text-sm text-[#52635A]">
            {t('farms.noFarms')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farms.map((farm) => (
              <div key={farm.id} className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#14221B]">{farm.name}</h3>
                    <p className="text-xs text-[#52635A] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{farm.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditFarm(farm)}
                      aria-label={`Edit ${farm.name}`}
                      className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg border border-[#E2E7E0] text-[#42544B] hover:bg-[#F3F6F1] cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteFarm(farm.id)}
                      aria-label={`Delete ${farm.name}`}
                      className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg border border-[#E2E7E0] text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#42544B] font-mono tabular-nums">
                  {farm.total_area_acres} {t('farms.acresUnit')} · {farm.soil_type} · {farm.field_count ?? 0}{' '}
                  {t('farms.fieldsUnit')}
                </p>
                {farm.notes && <p className="text-xs text-[#52635A] leading-relaxed">{farm.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All Fields List */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display text-base font-bold text-[#14221B]">
            {t('farms.allFieldsTitle')} ({filteredFields.length})
          </h2>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative">
              <Search className="h-4 w-4 text-[#66786E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="min-h-[40px] w-full sm:w-56 rounded-lg border border-[#D7DED4] pl-9 pr-3 py-1.5 text-sm"
              />
            </div>
            <select
              value={selectedFarmFilter}
              onChange={(e) => setSelectedFarmFilter(e.target.value)}
              className="min-h-[40px] rounded-lg border border-[#D7DED4] bg-white px-3 py-1.5 text-sm"
            >
              <option value="all">{t('farms.allFarms')}</option>
              {farms.map((f) => (
                <option key={f.id} value={String(f.id)}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredFields.length === 0 ? (
          <p className="text-sm text-[#52635A] py-6 text-center">{t('farms.noFields')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E7E0] text-xs font-semibold text-[#52635A]">
                  <th className="py-2.5 pr-4">{t('farms.fieldName')}</th>
                  <th className="py-2.5 pr-4">{t('farms.farmCol')}</th>
                  <th className="py-2.5 pr-4">{t('farms.location')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('farms.areaAcres')}</th>
                  <th className="py-2.5 pr-4">{t('farms.soilType')}</th>
                  <th className="py-2.5 pr-4">{t('farms.irrigationMethod')}</th>
                  <th className="py-2.5 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2EC]">
                {filteredFields.map((fl) => (
                  <tr key={fl.id} className="hover:bg-[#FAFBF9]">
                    <td className="py-3 pr-4 font-semibold text-[#14221B]">{fl.name}</td>
                    <td className="py-3 pr-4 text-[#42544B]">{fl.farm_name}</td>
                    <td className="py-3 pr-4 text-[#52635A]">{fl.location || '—'}</td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums text-[#14221B]">
                      {fl.area_acres}
                    </td>
                    <td className="py-3 pr-4 text-[#42544B]">{fl.soil_type}</td>
                    <td className="py-3 pr-4 text-[#42544B]">{fl.irrigation_method}</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditField(fl)}
                        className="p-1.5 text-[#42544B] hover:text-[#14221B] cursor-pointer"
                        aria-label={`Edit ${fl.name}`}
                      >
                        <Pencil className="h-4 w-4 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteField(fl.id)}
                        className="p-1.5 text-[#B91C1C] hover:text-[#991B1B] cursor-pointer ml-1"
                        aria-label={`Delete ${fl.name}`}
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
