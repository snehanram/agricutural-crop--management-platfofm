import { useState, type FormEvent } from 'react';
import { ArrowRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CultivationTracker } from '../components/CultivationTracker';
import { CROP_CATEGORIES, CROP_GUIDES, type CropCategory } from '../data/cropKnowledge';
import { api } from '../lib/api';
import type { NavSection } from '../components/AppShell';
import { CULTIVATION_STAGES, type Crop, type CultivationStage, type Field } from '../types';
import {
  findCropGuideByName,
  getLocalizedCategoryLabel,
  getLocalizedCropName,
  getLocalizedGuideCropName,
  matchesCropSearch,
} from '../utils/cropDisplay';

interface CropsPageProps {
  crops: Crop[];
  fields: Field[];
  onRefresh: () => Promise<void>;
  onNavigate: (section: NavSection) => void;
}

export function CropsPage({ crops, fields, onRefresh, onNavigate }: CropsPageProps) {
  const { t, i18n } = useTranslation();
  const rawLang = i18n.language?.slice(0, 2);
  const lang: 'en' | 'te' | 'hi' = rawLang === 'te' || rawLang === 'hi' ? rawLang : 'en';
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'harvested'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [cropPickCategory, setCropPickCategory] = useState<'all' | CropCategory>('all');
  const [cropPickSearch, setCropPickSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const [fieldId, setFieldId] = useState(fields[0]?.id ? String(fields[0].id) : '');
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().slice(0, 10));
  const [stage, setStage] = useState<CultivationStage>('land_preparation');
  const [status, setStatus] = useState<'active' | 'harvested'>('active');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [needFieldNotice, setNeedFieldNotice] = useState(false);

  const openAdd = () => {
    if (fields.length === 0) {
      setNeedFieldNotice(true);
      return;
    }
    setNeedFieldNotice(false);
    setEditingCrop(null);
    setFieldId(fields[0]?.id ? String(fields[0].id) : '');
    setCropName('');
    setVariety('');
    setPlantingDate(new Date().toISOString().slice(0, 10));
    setStage('land_preparation');
    setStatus('active');
    setNotes('');
    setShowForm(true);
    setError('');
  };

  const openEdit = (c: Crop) => {
    setEditingCrop(c);
    setFieldId(String(c.field_id));
    setCropName(c.crop_name);
    setVariety(c.variety);
    setPlantingDate(c.planting_date);
    setStage(c.cultivation_stage);
    setStatus(c.status);
    setNotes(c.notes);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        field_id: Number(fieldId),
        crop_name: cropName,
        variety,
        planting_date: plantingDate,
        cultivation_stage: stage,
        status,
        notes,
      };
      if (editingCrop) {
        await api.updateCrop(editingCrop.id, payload);
      } else {
        await api.createCrop(payload);
      }
      setShowForm(false);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save crop');
    }
  };

  const handleStageSelect = async (crop: Crop, nextStage: CultivationStage) => {
    setError('');
    try {
      await api.updateCropStage(crop.id, nextStage, crop.status);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cultivation stage');
    }
  };

  const handleAdvanceNext = async (crop: Crop) => {
    const idx = CULTIVATION_STAGES.indexOf(crop.cultivation_stage);
    if (idx < CULTIVATION_STAGES.length - 1) {
      setError('');
      try {
        await api.updateCropStage(crop.id, CULTIVATION_STAGES[idx + 1], crop.status);
        await onRefresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to advance cultivation stage');
      }
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await api.deleteCrop(id);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete crop');
    }
  };

  const filtered = crops.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const localizedCrop = getLocalizedCropName(t, c.crop_name).toLowerCase();
    const matchesSearch =
      !q ||
      c.crop_name.toLowerCase().includes(q) ||
      localizedCrop.includes(q) ||
      c.variety.toLowerCase().includes(q) ||
      (c.field_name || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('crops.title')}</h1>
        <button
          type="button"
          onClick={openAdd}
          className="min-h-[42px] inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t('crops.addCrop')}</span>
        </button>
      </div>

      {(fields.length === 0 || needFieldNotice) && fields.length === 0 && (
        <div className="rounded-xl border border-[#CBE2D0] bg-[#F2F9F4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-medium text-[#14221B]">{t('common.needFieldTitle')}</p>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('farms')}
              className="min-h-[38px] rounded-lg bg-[#15803D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#166534] cursor-pointer whitespace-nowrap"
            >
              {t('common.goToFieldsBtn')}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('guide')}
              className="min-h-[38px] rounded-lg border border-[#15803D] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#ECFDF3] cursor-pointer whitespace-nowrap"
            >
              {t('common.useGuideBtn')}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#CBD5E1] bg-white p-5 space-y-4">
          <h2 className="font-display text-base font-bold text-[#14221B]">
            {editingCrop ? `${t('common.edit')} ${getLocalizedCropName(t, editingCrop.crop_name)}` : t('crops.addCrop')}
          </h2>

          {/* Searchable Visual Crop Type Chooser */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs font-medium text-[#52635A]">{t('crops.cropName')}</p>
              <div className="relative w-full sm:w-72">
                <Search className="h-3.5 w-3.5 text-[#66786E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={cropPickSearch}
                  onChange={(e) => setCropPickSearch(e.target.value)}
                  placeholder={t('guide.searchCropPlaceholder')}
                  className="w-full min-h-[38px] rounded-lg border border-[#D7DED4] bg-[#F8F9F7] pl-8 pr-3 py-1 text-xs text-[#14221B] focus:border-[#15803D] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CROP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCropPickCategory(cat.id)}
                  className={`min-h-[34px] inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                    cropPickCategory === cat.id
                      ? 'border-[#15803D] bg-[#15803D] text-white'
                      : 'border-[#D7DED4] bg-white text-[#42544B] hover:border-[#15803D]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{getLocalizedCategoryLabel(t, cat.id, cat.labels.en)}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
              {CROP_GUIDES.filter((g) => {
                if (cropPickCategory !== 'all' && g.category !== cropPickCategory) return false;
                return matchesCropSearch(g, cropPickSearch, t);
              }).map((g) => {
                const localized = getLocalizedGuideCropName(t, g);
                return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setCropName(g.names.en);
                    setVariety(g.defaultVariety);
                  }}
                  className={`min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                    cropName.toLowerCase().includes(g.id) ||
                    cropName === g.names.en ||
                    cropName === localized
                      ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                      : 'border-[#D7DED4] bg-[#F8F9F7] text-[#14221B] hover:border-[#15803D]'
                  }`}
                >
                  <span>{g.emoji}</span>
                  <span>{localized}</span>
                </button>
                );
              })}
              {cropPickSearch.trim() && (
                <button
                  type="button"
                  onClick={() => setCropName(cropPickSearch.trim())}
                  className="min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#15803D] bg-white px-3 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#ECFDF3] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{cropPickSearch.trim()}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('crops.field')}</label>
              <select
                required
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
              >
                {fields.map((fl) => (
                  <option key={fl.id} value={fl.id}>
                    {fl.name} ({fl.farm_name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('crops.cropName')}</label>
              <input
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="Paddy (Rice)"
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('crops.variety')}</label>
              <input
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="BPT-5204"
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('crops.plantingDate')}</label>
              <input
                type="date"
                required
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('crops.stage')}</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as CultivationStage)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
              >
                {CULTIVATION_STAGES.map((st) => (
                  <option key={st} value={st}>
                    {t(`stages.${st}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('crops.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'harvested')}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
              >
                <option value="active">{t('crops.active')}</option>
                <option value="harvested">{t('crops.harvested')}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1">{t('common.notes')}</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] cursor-pointer"
            >
              {t('common.save')}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-[40px] rounded-lg border border-[#D7DED4] px-4 py-2 text-sm font-semibold text-[#52635A] cursor-pointer"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-lg border border-[#E2E7E0] bg-[#F3F6F1] p-1 self-start">
          {(['active', 'harvested', 'all'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                statusFilter === tab ? 'bg-white text-[#14221B] shadow-xs' : 'text-[#52635A] hover:text-[#14221B]'
              }`}
            >
              {t(`crops.${tab}`)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="h-4 w-4 text-[#66786E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search')}
            className="min-h-[40px] w-full sm:w-64 rounded-lg border border-[#D7DED4] bg-white pl-9 pr-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* Crop Cards with Visual 7-Stage Cultivation Tracker */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#E2E7E0] bg-white p-10 text-center text-sm text-[#52635A]">
          {t('crops.noCrops')}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((crop) => {
            const canAdvance = CULTIVATION_STAGES.indexOf(crop.cultivation_stage) < CULTIVATION_STAGES.length - 1;
            return (
              <div key={crop.id} className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#14221B]">
                      {getLocalizedCropName(t, crop.crop_name)}
                      {crop.variety ? ` (${crop.variety})` : ''}
                    </h2>
                    <p className="text-xs text-[#52635A] mt-0.5 font-mono tabular-nums">
                      {crop.field_name} · {crop.farm_name} · {t('crops.plantedLabel')} {crop.planting_date} ·{' '}
                      <span className={crop.status === 'active' ? 'text-[#15803D] font-semibold' : 'text-[#52635A]'}>
                        {t(`crops.${crop.status}`)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canAdvance && crop.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => void handleAdvanceNext(crop)}
                        className="min-h-[36px] inline-flex items-center gap-1.5 rounded-lg border border-[#15803D] bg-[#ECFDF3] px-3 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#DCFCE7] cursor-pointer whitespace-nowrap"
                      >
                        <span>{t('crops.advanceStage')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(crop)}
                      className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg border border-[#E2E7E0] text-[#42544B] hover:bg-[#F3F6F1] cursor-pointer"
                      aria-label={`${t('common.edit')} ${getLocalizedCropName(t, crop.crop_name)}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(crop.id)}
                      className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg border border-[#E2E7E0] text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                      aria-label={`${t('common.delete')} ${getLocalizedCropName(t, crop.crop_name)}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <CultivationTracker
                  currentStage={crop.cultivation_stage}
                  onSelectStage={(st) => void handleStageSelect(crop, st)}
                />

                {(() => {
                  const matchedGuide = findCropGuideByName(crop.crop_name);
                  const stageTip = matchedGuide?.stagesInfo[crop.cultivation_stage];
                  if (!stageTip) return null;
                  return (
                    <div className="rounded-lg border border-[#DCEAE0] bg-[#F6FAF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#14532D]">
                      <span className="font-semibold">{t('guide.stageTipLabel')} ({stageTip.days}): </span>
                      <span>{stageTip.action[lang] || stageTip.action.en}</span>
                    </div>
                  );
                })()}

                {crop.notes && <p className="text-xs text-[#52635A]">{crop.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
