import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Bug,
  Camera,
  FileText,
  Loader2,
  Pencil,
  Square,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { NavSection } from '../components/AppShell';
import { PlantDoctorAgent } from '../components/PlantDoctorAgent';
import type { Crop, Field, LanguageCode, PestObservation, PlantPhotoDiagnosis } from '../types';
import { getLocalizedCropName } from '../utils/cropDisplay';
import { playTextInLanguage, stopActiveSpeech } from '../utils/voiceSpeech';

interface PestPageProps {
  pests: PestObservation[];
  fields: Field[];
  crops: Crop[];
  onRefresh: () => Promise<void>;
  onNavigate: (section: NavSection) => void;
}

type PestReportMode = 'photo' | 'describe';

export function PestPage({ pests, fields, crops, onRefresh, onNavigate }: PestPageProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').trim() as LanguageCode;

  const [showForm, setShowForm] = useState(false);
  const [reportMode, setReportMode] = useState<PestReportMode>('photo');
  const [editing, setEditing] = useState<PestObservation | null>(null);

  const [fieldId, setFieldId] = useState(fields[0]?.id ? String(fields[0].id) : '');
  const [cropId, setCropId] = useState('');
  const [observationDate, setObservationDate] = useState(new Date().toISOString().slice(0, 10));
  const [pestName, setPestName] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'active' | 'treated' | 'resolved'>('active');
  const [obsNotes, setObsNotes] = useState('');
  const [treatment, setTreatment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<PlantPhotoDiagnosis | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [needFieldNotice, setNeedFieldNotice] = useState(false);

  // Live translation state for displayed pest cards & active form inputs
  const [translatedRecords, setTranslatedRecords] = useState<
    Record<number, { pest_or_disease: string; field_name: string; observation_notes: string; treatment_details: string }>
  >({});
  const [translatingCards, setTranslatingCards] = useState(false);
  const recordCacheRef = useRef<
    Record<string, Record<number, { sig: string; pest_or_disease: string; field_name: string; observation_notes: string; treatment_details: string }>>
  >({});
  const formLangRef = useRef<string>(currentLang);

  // Voice playback state (shared across header guide & saved pest cards)
  const [activeVoiceKey, setActiveVoiceKey] = useState<string | null>(null);
  const [voiceLoadingKey, setVoiceLoadingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechAbortRef = useRef<boolean>(false);

  const stopVoice = () => {
    stopActiveSpeech({
      audioRef,
      abortRef: speechAbortRef,
      onLoadingChange: (loading) => {
        if (!loading) setVoiceLoadingKey(null);
      },
      onSpeakingChange: (speaking) => {
        if (!speaking) setActiveVoiceKey(null);
      },
    });
  };

  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, []);

  // Stop any active speech and translate pest cards whenever language or pest records change
  useEffect(() => {
    stopVoice();

    if (pests.length === 0) {
      setTranslatedRecords({});
      setTranslatingCards(false);
      return;
    }

    const cacheForLang = recordCacheRef.current[currentLang] || (recordCacheRef.current[currentLang] = {});
    const resolved: Record<
      number,
      { pest_or_disease: string; field_name: string; observation_notes: string; treatment_details: string }
    > = {};
    const missing: Array<{
      id: number;
      pest_or_disease: string;
      field_name: string;
      observation_notes: string;
      treatment_details: string;
    }> = [];

    for (const rec of pests) {
      const safeFieldName = rec.field_name || '';
      const sig = `${rec.pest_or_disease}||${safeFieldName}||${rec.observation_notes}||${rec.treatment_details}`;
      const cached = cacheForLang[rec.id];
      if (cached && cached.sig === sig) {
        resolved[rec.id] = cached;
      } else {
        const hasNonAscii = /[^\x00-\x7F]/.test(sig);
        if (currentLang === 'en' && !hasNonAscii) {
          const identity = {
            sig,
            pest_or_disease: rec.pest_or_disease,
            field_name: safeFieldName,
            observation_notes: rec.observation_notes,
            treatment_details: rec.treatment_details,
          };
          cacheForLang[rec.id] = identity;
          resolved[rec.id] = identity;
        } else {
          missing.push({
            id: rec.id,
            pest_or_disease: rec.pest_or_disease,
            field_name: safeFieldName,
            observation_notes: rec.observation_notes,
            treatment_details: rec.treatment_details,
          });
        }
      }
    }

    setTranslatedRecords(resolved);
    if (missing.length === 0) {
      setTranslatingCards(false);
      return;
    }

    let cancelled = false;
    setTranslatingCards(true);

    api
      .translatePestRecords(missing, currentLang)
      .then((res) => {
        if (cancelled) return;
        const nextResolved = { ...resolved };
        for (const item of missing) {
          const tr = res.translations[item.id];
          if (tr) {
            const sig = `${item.pest_or_disease}||${item.field_name}||${item.observation_notes}||${item.treatment_details}`;
            const entry = {
              sig,
              pest_or_disease: tr.pest_or_disease || item.pest_or_disease,
              field_name: tr.field_name || item.field_name,
              observation_notes: tr.observation_notes || item.observation_notes,
              treatment_details: tr.treatment_details || item.treatment_details,
            };
            cacheForLang[item.id] = entry;
            nextResolved[item.id] = entry;
          }
        }
        setTranslatedRecords(nextResolved);
      })
      .catch(() => {
        // Keep original records if network translation fails transiently
      })
      .finally(() => {
        if (!cancelled) setTranslatingCards(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pests, currentLang]);

  // Translate in-progress form fields if user changes language mid-editing (in Describe mode)
  useEffect(() => {
    const prevLang = formLangRef.current;
    formLangRef.current = currentLang;
    if (!showForm || prevLang === currentLang) return;
    if (reportMode !== 'describe' && !editing) return;
    if (!pestName.trim() && !obsNotes.trim() && !treatment.trim()) return;

    let cancelled = false;
    api
      .translatePestRecords(
        [
          {
            id: -1,
            pest_or_disease: pestName,
            field_name: '',
            observation_notes: obsNotes,
            treatment_details: treatment,
          },
        ],
        currentLang
      )
      .then((res) => {
        if (cancelled) return;
        const tr = res.translations[-1];
        if (!tr) return;
        if (pestName.trim() && tr.pest_or_disease) setPestName(tr.pest_or_disease);
        if (obsNotes.trim() && tr.observation_notes) setObsNotes(tr.observation_notes);
        if (treatment.trim() && tr.treatment_details) setTreatment(tr.treatment_details);
      })
      .catch(() => {
        // Ignore transient failure
      });

    return () => {
      cancelled = true;
    };
  }, [currentLang, showForm, reportMode, editing, pestName, obsNotes, treatment]);

  const toggleVoiceForKey = async (key: string, textToSpeak: string) => {
    if (activeVoiceKey === key || voiceLoadingKey === key) {
      stopVoice();
      return;
    }
    stopVoice();
    await playTextInLanguage({
      text: textToSpeak,
      language: currentLang,
      onLoadingChange: (loading) => setVoiceLoadingKey(loading ? key : null),
      onSpeakingChange: (speaking) => setActiveVoiceKey(speaking ? key : null),
      audioRef,
      abortRef: speechAbortRef,
    });
  };

  const openAdd = (mode: PestReportMode) => {
    if (mode === 'describe' && fields.length === 0) {
      setNeedFieldNotice(true);
      return;
    }
    setNeedFieldNotice(false);
    setEditing(null);
    setReportMode(mode);
    setFieldId(fields[0]?.id ? String(fields[0].id) : '');
    setCropId('');
    setObservationDate(new Date().toISOString().slice(0, 10));
    setPestName('');
    setSeverity('medium');
    setStatus('active');
    setObsNotes('');
    setTreatment('');
    setImageFile(null);
    setPreviewUrl(null);
    setDiagnosis(null);
    setAnalyzing(false);
    formLangRef.current = currentLang;
    setShowForm(true);
    setError('');
  };

  const openEdit = (rec: PestObservation) => {
    const tr = translatedRecords[rec.id];
    setEditing(rec);
    setReportMode(rec.image_url && !rec.observation_notes ? 'photo' : 'describe');
    setFieldId(String(rec.field_id));
    setCropId(rec.crop_id ? String(rec.crop_id) : '');
    setObservationDate(rec.observation_date);
    setPestName(tr?.pest_or_disease || rec.pest_or_disease);
    setSeverity(rec.severity);
    setStatus(rec.status);
    setObsNotes(tr?.observation_notes || rec.observation_notes);
    setTreatment(tr?.treatment_details || rec.treatment_details);
    setImageFile(null);
    setPreviewUrl(rec.image_url);
    setDiagnosis(null);
    setAnalyzing(false);
    formLangRef.current = currentLang;
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (fields.length === 0 || !fieldId) {
      setNeedFieldNotice(true);
      setError(t('common.needFieldTitle'));
      return;
    }

    if (reportMode === 'photo' && !imageFile && !previewUrl) {
      setError(t('pests.chooseImage'));
      return;
    }

    if (reportMode === 'describe' && !pestName.trim() && !obsNotes.trim()) {
      setError(t('website.pestDescribePlaceholder'));
      return;
    }

    const derivedTitle =
      pestName.trim() ||
      diagnosis?.problemName ||
      (reportMode === 'photo'
        ? t('website.pestUploadPicBtn')
        : obsNotes.trim().slice(0, 60));

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('field_id', fieldId);
      if (cropId) fd.append('crop_id', cropId);
      fd.append('observation_date', observationDate);
      fd.append('pest_or_disease', derivedTitle);
      fd.append('severity', severity);
      fd.append('status', status);
      fd.append('observation_notes', obsNotes.trim());
      fd.append('treatment_details', treatment.trim());
      if (imageFile) {
        fd.append('image', imageFile);
      }

      if (editing) {
        await api.updatePest(editing.id, fd);
      } else {
        await api.createPest(fd);
      }
      setShowForm(false);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pest observation');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await api.deletePest(id);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pest observation');
    }
  };

  const fieldCrops = crops.filter((c) => String(c.field_id) === fieldId);
  const selectedField = fields.find((fl) => String(fl.id) === fieldId);
  const selectedCrop = crops.find((c) => String(c.id) === cropId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('pests.title')}</h1>
          <p className="text-xs sm:text-sm text-[#14532D] mt-1">{t('pests.helperTip')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => void toggleVoiceForKey('guide', `${t('pests.title')}. ${t('website.pestVoiceGuideIntro')}`)}
            className="min-h-[42px] inline-flex items-center gap-2 rounded-lg border border-[#CBE2D0] bg-white px-3.5 py-2 text-sm font-semibold text-[#14532D] hover:bg-[#ECFDF3] transition-colors whitespace-nowrap cursor-pointer"
          >
            {voiceLoadingKey === 'guide' ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#15803D]" />
            ) : activeVoiceKey === 'guide' ? (
              <Square className="h-3.5 w-3.5 text-[#15803D]" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#15803D]" />
            )}
            <span>
              {voiceLoadingKey === 'guide'
                ? t('website.pestVoiceLoading')
                : activeVoiceKey === 'guide'
                ? t('website.pestStopListenBtn')
                : t('website.pestVoiceGuideBtn')}
            </span>
          </button>
          <button
            type="button"
            onClick={() => openAdd('photo')}
            className="min-h-[42px] inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Camera className="h-4 w-4 shrink-0" />
            <span>{t('website.pestUploadPicBtn')}</span>
          </button>
          <button
            type="button"
            onClick={() => openAdd('describe')}
            className="min-h-[42px] inline-flex items-center gap-2 rounded-lg border border-[#15803D] bg-[#F2F9F4] px-4 py-2 text-sm font-semibold text-[#14532D] hover:bg-[#DCFCE7] transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileText className="h-4 w-4 shrink-0 text-[#15803D]" />
            <span>{t('website.pestDescribeBtn')}</span>
          </button>
        </div>
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

      {/* Two Clear Options Picker Card when Form is Closed */}
      {!showForm && (
        <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-3">
          <h2 className="font-display text-base font-bold text-[#14221B]">
            {t('website.pestChooseModeTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => openAdd('photo')}
              className="rounded-xl border border-[#CBE2D0] bg-[#F2F9F4] p-5 text-left hover:border-[#15803D] hover:bg-[#E7F6EC] transition-colors flex items-start gap-4 cursor-pointer"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15803D] text-white">
                <Camera className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-base font-bold text-[#14221B]">
                  {t('website.pestUploadPicBtn')}
                </p>
                <p className="text-xs sm:text-sm text-[#42544B] leading-relaxed">
                  {t('website.pestUploadPicDesc')}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => openAdd('describe')}
              className="rounded-xl border border-[#D7DED4] bg-[#FAFBF9] p-5 text-left hover:border-[#15803D] hover:bg-[#F2F9F4] transition-colors flex items-start gap-4 cursor-pointer"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#CBE2D0] text-[#15803D]">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-base font-bold text-[#14221B]">
                  {t('website.pestDescribeBtn')}
                </p>
                <p className="text-xs sm:text-sm text-[#42544B] leading-relaxed">
                  {t('website.pestDescribeDesc')}
                </p>
              </div>
            </button>
          </div>
        </section>
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#CBD5E1] bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF2EC] pb-3">
            <h2 className="font-display text-base font-bold text-[#14221B]">
              {editing ? t('common.edit') : t('website.pestChooseModeTitle')}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
              }}
              aria-label={t('common.cancel')}
              className="min-h-[34px] min-w-[34px] inline-flex items-center justify-center rounded-lg text-[#52635A] hover:bg-[#F3F6F1] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Two Mode Tabs Inside Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setReportMode('photo');
                setError('');
              }}
              className={`min-h-[54px] rounded-xl border p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                reportMode === 'photo'
                  ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                  : 'border-[#E2E7E0] bg-[#FAFBF9] text-[#42544B] hover:border-[#15803D]'
              }`}
            >
              <Camera className={`h-5 w-5 shrink-0 ${reportMode === 'photo' ? 'text-[#15803D]' : 'text-[#66786E]'}`} />
              <div>
                <p className="font-display text-sm font-bold">{t('website.pestUploadPicBtn')}</p>
                <p className="text-xs text-[#52635A] line-clamp-1">{t('website.pestUploadPicDesc')}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportMode('describe');
                setError('');
              }}
              className={`min-h-[54px] rounded-xl border p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                reportMode === 'describe'
                  ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                  : 'border-[#E2E7E0] bg-[#FAFBF9] text-[#42544B] hover:border-[#15803D]'
              }`}
            >
              <FileText className={`h-5 w-5 shrink-0 ${reportMode === 'describe' ? 'text-[#15803D]' : 'text-[#66786E]'}`} />
              <div>
                <p className="font-display text-sm font-bold">{t('website.pestDescribeBtn')}</p>
                <p className="text-xs text-[#52635A] line-clamp-1">{t('website.pestDescribeDesc')}</p>
              </div>
            </button>
          </div>

          {/* OPTION 1: UPLOAD A PIC -> INSTANT PHOTO ANALYSIS & SIMPLE PESTICIDE GUIDE */}
          {reportMode === 'photo' && (
            <div className="space-y-5">
              {fields.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#52635A] mb-1">{t('common.field')}</label>
                    <select
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
                    <label className="block text-xs font-medium text-[#52635A] mb-1">{t('common.crop')}</label>
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
                </div>
              )}

              <PlantDoctorAgent
                mode="portal"
                cropNameHint={selectedCrop?.crop_name}
                fieldAcresHint={selectedField?.area_acres}
                fieldSoilTypeHint={selectedField?.soil_type}
                initialPreviewUrl={previewUrl}
                onAnalysisStateChange={setAnalyzing}
                onImageSelected={(file, nextUrl) => {
                  setImageFile(file);
                  setPreviewUrl(nextUrl);
                  setError('');
                }}
                onDiagnosisReady={({ diagnosis: d, file, previewUrl: nextUrl }) => {
                  if (file) setImageFile(file);
                  if (nextUrl) setPreviewUrl(nextUrl);
                  setDiagnosis(d);
                  setPestName(d.problemName);
                  setSeverity(d.severity);
                  setObsNotes(d.whatIsHappening || d.simpleSummaryText);
                  const combinedTreatment = [
                    d.recommendedPesticide,
                    d.howMuchToMix,
                    d.treatmentCalculation,
                  ]
                    .filter(Boolean)
                    .join(' — ');
                  setTreatment(combinedTreatment);
                }}
              />

              {/* Compact editable record details when saving */}
              {(diagnosis || editing) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#EEF2EC] pt-4">
                  <div>
                    <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.pestName')}</label>
                    <input
                      value={pestName}
                      onChange={(e) => setPestName(e.target.value)}
                      className="w-full min-h-[40px] rounded-lg border border-[#D7DED4] px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.severity')}</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full min-h-[40px] rounded-lg border border-[#D7DED4] bg-white px-3 py-1.5 text-sm"
                    >
                      <option value="low">{t('pests.low')}</option>
                      <option value="medium">{t('pests.medium')}</option>
                      <option value="high">{t('pests.high')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.status')}</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'active' | 'treated' | 'resolved')}
                      className="w-full min-h-[40px] rounded-lg border border-[#D7DED4] bg-white px-3 py-1.5 text-sm"
                    >
                      <option value="active">{t('pests.active')}</option>
                      <option value="treated">{t('pests.treated')}</option>
                      <option value="resolved">{t('pests.resolved')}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OPTION 2: DESCRIBE YOUR PROBLEM */}
          {reportMode === 'describe' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="block text-xs font-medium text-[#52635A] mb-1">{t('common.crop')}</label>
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
                  <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.date')}</label>
                  <input
                    type="date"
                    required
                    value={observationDate}
                    onChange={(e) => setObservationDate(e.target.value)}
                    className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.severity')}</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
                  >
                    <option value="low">{t('pests.low')}</option>
                    <option value="medium">{t('pests.medium')}</option>
                    <option value="high">{t('pests.high')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.pestName')}</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      t('website.pestChipLeafCurl'),
                      t('website.pestChipStemBorer'),
                      t('website.pestChipLeafSpot'),
                      t('website.pestChipAphids'),
                      t('website.pestChipBollworm'),
                      t('website.pestChipYellowWilt'),
                    ].map((pn) => (
                      <button
                        key={pn}
                        type="button"
                        onClick={() => setPestName(pn)}
                        className={`px-2.5 py-1 text-xs rounded-lg border cursor-pointer ${
                          pestName === pn
                            ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D] font-semibold'
                            : 'border-[#D7DED4] bg-[#F8F9F7] text-[#52635A]'
                        }`}
                      >
                        {pn}
                      </button>
                    ))}
                  </div>
                  <input
                    value={pestName}
                    onChange={(e) => setPestName(e.target.value)}
                    placeholder={t('website.pestNamePlaceholder')}
                    className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.status')}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'treated' | 'resolved')}
                    className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
                  >
                    <option value="active">{t('pests.active')}</option>
                    <option value="treated">{t('pests.treated')}</option>
                    <option value="resolved">{t('pests.resolved')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#52635A] mb-1">
                    {t('website.pestDescribeBtn')}
                  </label>
                  <textarea
                    rows={3}
                    required={!pestName.trim()}
                    value={obsNotes}
                    onChange={(e) => setObsNotes(e.target.value)}
                    placeholder={t('website.pestDescribePlaceholder')}
                    className="w-full rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#52635A] mb-1">{t('pests.treatment')}</label>
                  <textarea
                    rows={3}
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder={t('website.pestTreatmentPlaceholder')}
                    className="w-full rounded-lg border border-[#D7DED4] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {(reportMode === 'describe' || previewUrl || editing) && (
              <button
                type="submit"
                disabled={saving || analyzing}
                className="min-h-[42px] rounded-lg bg-[#15803D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 cursor-pointer"
              >
                {reportMode === 'photo' ? t('website.pestSaveRecordBtn') : t('common.save')}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
              }}
              className="min-h-[42px] rounded-lg border border-[#D7DED4] px-4 py-2 text-sm font-semibold text-[#52635A] cursor-pointer"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {translatingCards && (
        <div className="rounded-lg border border-[#CBE2D0] bg-[#ECFDF3] px-3.5 py-2 flex items-center gap-2 text-xs font-medium text-[#14532D]">
          <Loader2 className="h-4 w-4 animate-spin text-[#15803D]" />
          <span>{t('website.pestTranslatingText')}</span>
        </div>
      )}

      {pests.length === 0 ? (
        <div className="rounded-xl border border-[#E2E7E0] bg-white p-10 text-center text-sm text-[#52635A] space-y-2">
          <Bug className="h-8 w-8 mx-auto text-[#8EA194]" />
          <p>{t('pests.noRecords')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pests.map((rec) => {
            const tr = translatedRecords[rec.id];
            const displayTitle = tr?.pest_or_disease || rec.pest_or_disease;
            const displayField = tr?.field_name || rec.field_name;
            const displayNotes = tr?.observation_notes ?? rec.observation_notes;
            const displayTreatment = tr?.treatment_details ?? rec.treatment_details;
            const localizedCrop = rec.crop_name ? getLocalizedCropName(t, rec.crop_name) : '';
            const cardVoiceKey = `card-${rec.id}`;
            const cardSpokenText = [
              localizedCrop ? `${t('common.crop')}: ${localizedCrop}` : '',
              `${t('common.field')}: ${displayField}`,
              `${t('pests.pestName')}: ${displayTitle}`,
              `${t('pests.severity')}: ${t(`pests.${rec.severity}`)}`,
              displayNotes || '',
              displayTreatment ? `${t('pests.treatment')}: ${displayTreatment}` : '',
            ]
              .filter(Boolean)
              .join('. ');

            const severityColor =
              rec.severity === 'high'
                ? 'text-[#B91C1C]'
                : rec.severity === 'medium'
                ? 'text-[#B45309]'
                : 'text-[#15803D]';
            return (
              <div key={rec.id} className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#14221B]">{displayTitle}</h2>
                    <p className="text-xs text-[#52635A] mt-0.5 font-mono tabular-nums">
                      {displayField}
                      {localizedCrop ? ` · ${localizedCrop}` : ''}
                      {' · '}
                      {rec.observation_date}
                      {' · '}
                      <span className={`font-semibold ${severityColor}`}>
                        {t(`pests.${rec.severity}`)}
                      </span>
                      {' · '}
                      <span className="capitalize">{t(`pests.${rec.status}`)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => void toggleVoiceForKey(cardVoiceKey, cardSpokenText)}
                      className="min-h-[36px] inline-flex items-center gap-1.5 rounded-lg border border-[#CBE2D0] bg-[#F2F9F4] px-2.5 py-1 text-xs font-semibold text-[#14532D] hover:bg-[#DCFCE7] cursor-pointer"
                      aria-label={t('website.pestListenBtn')}
                    >
                      {voiceLoadingKey === cardVoiceKey ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#15803D]" />
                      ) : activeVoiceKey === cardVoiceKey ? (
                        <Square className="h-3 w-3 text-[#15803D]" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5 text-[#15803D]" />
                      )}
                      <span>
                        {voiceLoadingKey === cardVoiceKey
                          ? t('website.pestVoiceLoading')
                          : activeVoiceKey === cardVoiceKey
                          ? t('website.pestStopListenBtn')
                          : t('website.pestListenBtn')}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(rec)}
                      className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg border border-[#E2E7E0] text-[#42544B] hover:bg-[#F3F6F1] cursor-pointer"
                      aria-label={t('common.edit')}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(rec.id)}
                      className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg border border-[#E2E7E0] text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                      aria-label={t('common.delete')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {rec.image_url && (
                  <div className="overflow-hidden rounded-lg border border-[#E2E7E0] bg-[#F8F9F7]">
                    <img
                      src={rec.image_url}
                      alt={displayTitle}
                      referrerPolicy="no-referrer"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                )}

                {displayNotes && (
                  <p className="text-sm text-[#42544B] leading-relaxed">{displayNotes}</p>
                )}
                {displayTreatment && (
                  <p className="text-xs text-[#14221B] bg-[#F6FAF7] border border-[#DCEAE0] rounded-lg px-3 py-2">
                    <span className="font-semibold">{t('pests.treatment')}:</span> {displayTreatment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
