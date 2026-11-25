import { useState, type FormEvent } from 'react';
import { Droplets, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { NavSection } from '../components/AppShell';
import type { Crop, Field, IrrigationRecord } from '../types';
import { getLocalizedCropName } from '../utils/cropDisplay';

interface IrrigationPageProps {
  irrigations: IrrigationRecord[];
  fields: Field[];
  crops: Crop[];
  onRefresh: () => Promise<void>;
  onNavigate: (section: NavSection) => void;
}

export function IrrigationPage({ irrigations, fields, crops, onRefresh, onNavigate }: IrrigationPageProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IrrigationRecord | null>(null);
  const [fieldId, setFieldId] = useState(fields[0]?.id ? String(fields[0].id) : '');
  const [cropId, setCropId] = useState('');
  const [irrigationDate, setIrrigationDate] = useState(new Date().toISOString().slice(0, 10));
  const [waterLiters, setWaterLiters] = useState('12000');
  const [frequencyDays, setFrequencyDays] = useState('5');
  const [nextDate, setNextDate] = useState('');
  const [method, setMethod] = useState('Drip');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [needFieldNotice, setNeedFieldNotice] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const openAdd = () => {
    if (fields.length === 0) {
      setNeedFieldNotice(true);
      return;
    }
    setNeedFieldNotice(false);
    setEditing(null);
    setFieldId(fields[0]?.id ? String(fields[0].id) : '');
    setCropId('');
    setIrrigationDate(today);
    setWaterLiters('12000');
    setFrequencyDays('5');
    setNextDate('');
    setMethod('Drip');
    setNotes('');
    setShowForm(true);
    setError('');
  };

  const openEdit = (rec: IrrigationRecord) => {
    setEditing(rec);
    setFieldId(String(rec.field_id));
    setCropId(rec.crop_id ? String(rec.crop_id) : '');
    setIrrigationDate(rec.irrigation_date);
    setWaterLiters(String(rec.water_quantity_liters));
    setFrequencyDays(String(rec.frequency_days));
    setNextDate(rec.next_scheduled_date);
    setMethod(rec.method);
    setNotes(rec.notes);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        field_id: Number(fieldId),
        crop_id: cropId ? Number(cropId) : null,
        irrigation_date: irrigationDate,
        water_quantity_liters: Number(waterLiters) || 0,
        frequency_days: Math.max(1, Number(frequencyDays) || 7),
        next_scheduled_date: nextDate || undefined,
        method,
        notes,
      };
      if (editing) {
        await api.updateIrrigation(editing.id, payload);
      } else {
        await api.createIrrigation(payload);
      }
      setShowForm(false);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save irrigation record');
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await api.deleteIrrigation(id);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete irrigation record');
    }
  };

  const fieldCrops = crops.filter((c) => String(c.field_id) === fieldId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('irrigation.title')}</h1>
          <p className="text-xs sm:text-sm text-[#14532D] mt-1">{t('irrigation.helperTip')}</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="min-h-[42px] inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t('irrigation.addRecord')}</span>
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
            {editing ? t('common.edit') : t('irrigation.addRecord')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('common.field')}</label>
              <select
                required
                value={fieldId}
                onChange={(e) => {
                  setFieldId(e.target.value);
                  setCropId('');
                }}
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
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('irrigation.cropOptional')}</label>
              <select
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
              >
                <option value="">—</option>
                {fieldCrops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getLocalizedCropName(t, c.crop_name)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('irrigation.date')}</label>
              <input
                type="date"
                required
                value={irrigationDate}
                onChange={(e) => setIrrigationDate(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('irrigation.waterLiters')}</label>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {['4000', '8000', '12000', '20000'].map((liters) => (
                  <button
                    key={liters}
                    type="button"
                    onClick={() => setWaterLiters(liters)}
                    className={`px-2 py-0.5 text-xs rounded border font-mono cursor-pointer ${
                      waterLiters === liters
                        ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D] font-semibold'
                        : 'border-[#D7DED4] bg-[#F8F9F7] text-[#52635A]'
                    }`}
                  >
                    {Number(liters).toLocaleString()} L
                  </button>
                ))}
              </div>
              <input
                type="number"
                required
                min="0"
                value={waterLiters}
                onChange={(e) => setWaterLiters(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('irrigation.frequencyDays')}</label>
              <input
                type="number"
                required
                min="1"
                value={frequencyDays}
                onChange={(e) => setFrequencyDays(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('irrigation.nextDate')}</label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('irrigation.method')}</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
              >
                <option value="Drip">Drip</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Canal Flood">Canal Flood</option>
                <option value="Furrow">Furrow</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#52635A] mb-1">{t('common.notes')}</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
              />
            </div>
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

      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5">
        {irrigations.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#52635A] space-y-2">
            <Droplets className="h-8 w-8 mx-auto text-[#8EA194]" />
            <p>{t('irrigation.noRecords')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E7E0] text-xs font-semibold text-[#52635A]">
                  <th className="py-2.5 pr-4">{t('irrigation.date')}</th>
                  <th className="py-2.5 pr-4">{t('common.field')}</th>
                  <th className="py-2.5 pr-4">{t('common.crop')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('irrigation.waterLiters')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('irrigation.frequencyDays')}</th>
                  <th className="py-2.5 pr-4">{t('irrigation.nextDate')}</th>
                  <th className="py-2.5 pr-4">{t('irrigation.method')}</th>
                  <th className="py-2.5 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2EC]">
                {irrigations.map((rec) => {
                  const isDue = rec.next_scheduled_date <= today;
                  return (
                    <tr key={rec.id} className="hover:bg-[#FAFBF9]">
                      <td className="py-3 pr-4 font-mono tabular-nums text-[#14221B]">{rec.irrigation_date}</td>
                      <td className="py-3 pr-4 font-semibold text-[#14221B]">{rec.field_name}</td>
                      <td className="py-3 pr-4 text-[#42544B]">{rec.crop_name ? getLocalizedCropName(t, rec.crop_name) : '—'}</td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums text-[#14221B]">
                        {rec.water_quantity_liters.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums text-[#52635A]">
                        {rec.frequency_days}d
                      </td>
                      <td
                        className={`py-3 pr-4 font-mono tabular-nums ${
                          isDue ? 'text-[#B45309] font-semibold' : 'text-[#42544B]'
                        }`}
                      >
                        {rec.next_scheduled_date}
                      </td>
                      <td className="py-3 pr-4 text-[#42544B]">{rec.method}</td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEdit(rec)}
                          className="p-1.5 text-[#42544B] hover:text-[#14221B] cursor-pointer"
                          aria-label={t('common.edit')}
                        >
                          <Pencil className="h-4 w-4 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(rec.id)}
                          className="p-1.5 text-[#B91C1C] hover:text-[#991B1B] cursor-pointer ml-1"
                          aria-label={t('common.delete')}
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
