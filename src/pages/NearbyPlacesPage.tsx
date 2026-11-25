import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Building2,
  Clock,
  ExternalLink,
  FlaskConical,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShoppingBag,
  Store,
  Warehouse,
  Wrench,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { Farm, LanguageCode, NearbyPlacesResponse } from '../types';

interface NearbyPlacesPageProps {
  farms: Farm[];
  farmerLocation?: string;
  isDemoFarmer?: boolean;
  farmerPhone?: string;
  isAuthenticated?: boolean;
  onUpdatePhone?: (phone: string) => void;
}

function renderFormattedLines(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, idx) => {
    const clean = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^#+\s*/, '');
    const isBullet = clean.startsWith('* ') || clean.startsWith('- ') || /^\d+\.\s/.test(clean);
    const display = clean.replace(/^[-*]\s+/, '');
    return (
      <p
        key={`${idx}-${display.slice(0, 12)}`}
        className={isBullet ? 'text-sm text-[#14221B] pl-2' : 'text-sm text-[#34443B]'}
      >
        {isBullet ? `• ${display}` : display}
      </p>
    );
  });
}

export function NearbyPlacesPage({
  farms,
  farmerLocation,
  isDemoFarmer = false,
  farmerPhone,
  isAuthenticated = true,
  onUpdatePhone,
}: NearbyPlacesPageProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.trim() || 'en') as LanguageCode;

  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id ? String(farms[0].id) : '');
  const [publicLocation, setPublicLocation] = useState<string>(farmerLocation || 'Guntur, Andhra Pradesh');
  const [appliedPublicLocation, setAppliedPublicLocation] = useState<string>(
    farmerLocation || 'Guntur, Andhra Pradesh'
  );
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showGpsPhonePrompt, setShowGpsPhonePrompt] = useState(false);
  const [gpsPhoneVerified, setGpsPhoneVerified] = useState(false);
  const [gpsPhoneInput, setGpsPhoneInput] = useState(isDemoFarmer ? '' : farmerPhone || '');
  const [gpsPhoneError, setGpsPhoneError] = useState('');
  const [gpsPhoneSaving, setGpsPhoneSaving] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('mandi');
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<NearbyPlacesResponse | null>(null);

  useEffect(() => {
    if (farms.length === 0) {
      if (selectedFarmId) setSelectedFarmId('');
      return;
    }
    const stillExists = farms.some((f) => String(f.id) === selectedFarmId);
    if (!selectedFarmId || !stillExists) {
      setSelectedFarmId(String(farms[0].id));
    }
  }, [farms, selectedFarmId]);

  const runSearch = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;
      setLoading(true);
      setError('');
      try {
        const res = isAuthenticated
          ? await api.searchNearbyPlaces({
              query: queryText.trim(),
              farmId: !gpsCoords && selectedFarmId ? Number(selectedFarmId) : undefined,
              latitude: gpsCoords?.latitude,
              longitude: gpsCoords?.longitude,
              language: lang,
            })
          : await api.searchPublicNearbyPlaces({
              query: queryText.trim(),
              locationText: !gpsCoords ? appliedPublicLocation : undefined,
              latitude: gpsCoords?.latitude,
              longitude: gpsCoords?.longitude,
              language: lang,
            });
        setResult(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to search nearby places');
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, gpsCoords, selectedFarmId, appliedPublicLocation, lang]
  );

  // Auto-load active category when page opens, location changes, or language changes
  useEffect(() => {
    const activeQuery =
      activeCategoryId === 'custom' && customQuery.trim()
        ? customQuery.trim()
        : t(`nearby.queries.${activeCategoryId === 'custom' ? 'mandi' : activeCategoryId}`);
    void runSearch(activeQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarmId, appliedPublicLocation, gpsCoords, lang, isAuthenticated]);

  const requestBrowserGps = () => {
    if (!('geolocation' in navigator)) {
      setError(t('nearby.gpsNotAvailable'));
      return;
    }
    setGpsLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setGpsLoading(false);
      },
      () => {
        setError(t('nearby.gpsFallbackNotice'));
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleUseGps = () => {
    setError('');
    if (isAuthenticated && (isDemoFarmer || !farmerPhone?.trim()) && !gpsPhoneVerified) {
      setGpsPhoneError('');
      setShowGpsPhonePrompt(true);
      return;
    }
    requestBrowserGps();
  };

  const handleConfirmGpsPhone = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = gpsPhoneInput.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      setGpsPhoneError(t('nearby.gpsPhoneInvalid'));
      return;
    }

    setGpsPhoneSaving(true);
    setGpsPhoneError('');
    try {
      if (isAuthenticated) {
        await api.updatePreferences({ phone: trimmed });
      }
      onUpdatePhone?.(trimmed);
      setGpsPhoneVerified(true);
      setShowGpsPhonePrompt(false);
      requestBrowserGps();
    } catch (err) {
      setGpsPhoneError(err instanceof Error ? err.message : t('nearby.gpsPhoneInvalid'));
    } finally {
      setGpsPhoneSaving(false);
    }
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    setActiveCategoryId('custom');
    void runSearch(customQuery);
  };

  const quickCategories = [
    {
      id: 'mandi',
      label: t('nearby.categories.mandi'),
      query: t('nearby.queries.mandi'),
      icon: Store,
    },
    {
      id: 'seeds',
      label: t('nearby.categories.seeds'),
      query: t('nearby.queries.seeds'),
      icon: ShoppingBag,
    },
    {
      id: 'coldStorage',
      label: t('nearby.categories.coldStorage'),
      query: t('nearby.queries.coldStorage'),
      icon: Warehouse,
    },
    {
      id: 'kvk',
      label: t('nearby.categories.kvk'),
      query: t('nearby.queries.kvk'),
      icon: FlaskConical,
    },
    {
      id: 'tractor',
      label: t('nearby.categories.tractor'),
      query: t('nearby.queries.tractor'),
      icon: Wrench,
    },
  ];

  const activeCategoryLabel =
    quickCategories.find((c) => c.id === activeCategoryId)?.label || customQuery || t('nearby.categories.mandi');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('nearby.title')}</h1>
        <p className="text-sm text-[#52635A] mt-1">{t('nearby.subtitle')}</p>
      </div>

      {/* Location Bar + Quick Farmer Category Buttons */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#42544B]">
              <MapPin className="h-4 w-4 text-[#15803D]" />
              <span>{t('nearby.useFarmLocation')}:</span>
            </span>

            {isAuthenticated && farms.length > 0 && !gpsCoords && (
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                aria-label={t('farms.selectFarm')}
                className="min-h-[40px] rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3 py-1.5 text-sm font-medium text-[#14221B]"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.location})
                  </option>
                ))}
              </select>
            )}

            {isAuthenticated && farms.length === 0 && !gpsCoords && (
              <span className="inline-flex items-center rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#14221B]">
                {farmerLocation || result?.locationLabel || 'Guntur, Andhra Pradesh'}
              </span>
            )}

            {!isAuthenticated && !gpsCoords && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (publicLocation.trim()) {
                    setAppliedPublicLocation(publicLocation.trim());
                  }
                }}
                className="flex flex-wrap items-center gap-2"
              >
                <input
                  type="text"
                  value={publicLocation}
                  onChange={(e) => setPublicLocation(e.target.value)}
                  placeholder={t('website.publicNearbyPlaceholder')}
                  className="min-h-[38px] w-56 sm:w-64 rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3 py-1.5 text-xs sm:text-sm text-[#14221B] focus:border-[#15803D] focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[38px] rounded-lg border border-[#D7DED4] bg-white px-3 py-1.5 text-xs font-semibold text-[#14221B] hover:border-[#15803D] hover:bg-[#ECFDF3] cursor-pointer"
                >
                  {t('nearby.searchBtn')}
                </button>
              </form>
            )}

            {gpsCoords && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#86EFAC] bg-[#ECFDF3] px-3 py-1.5 text-xs font-semibold text-[#14532D]">
                <Navigation className="h-3.5 w-3.5" />
                <span>{t('nearby.gpsReady')}</span>
                <button
                  type="button"
                  onClick={() => setGpsCoords(null)}
                  className="ml-1 underline cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={gpsLoading}
            onClick={handleUseGps}
            className="min-h-[40px] inline-flex items-center justify-center gap-2 rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3.5 py-1.5 text-xs font-semibold text-[#14221B] hover:border-[#15803D] hover:bg-[#ECFDF3] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Navigation className="h-3.5 w-3.5 text-[#15803D]" />
            <span>{gpsLoading ? t('common.loading') : t('nearby.usePhoneGps')}</span>
          </button>
        </div>

        {/* Inline Phone Number Prompt when clicking Use My Phone GPS in Demo */}
        {showGpsPhonePrompt && (
          <form
            onSubmit={handleConfirmGpsPhone}
            className="rounded-xl border border-[#86EFAC] bg-[#F2F9F4] p-4 space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#15803D] text-white">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold text-[#14221B]">
                  {t('nearby.gpsPhonePromptTitle')}
                </h2>
                <p className="text-xs text-[#42544B] mt-0.5">{t('nearby.gpsPhonePromptDesc')}</p>
              </div>
            </div>

            {gpsPhoneError && (
              <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#991B1B]">
                {gpsPhoneError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 sm:items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-[#42544B] mb-1">
                  {t('nearby.gpsPhoneLabel')}
                </label>
                <input
                  type="tel"
                  required
                  autoFocus
                  value={gpsPhoneInput}
                  onChange={(e) => setGpsPhoneInput(e.target.value)}
                  placeholder={t('nearby.gpsPhonePlaceholder')}
                  className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm font-mono tabular-nums text-[#14221B] focus:border-[#15803D] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={gpsPhoneSaving}
                  className="min-h-[42px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {gpsPhoneSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                  <span>{t('nearby.gpsPhoneConfirmBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGpsPhonePrompt(false);
                    setGpsPhoneError('');
                  }}
                  className="min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-xs font-semibold text-[#52635A] hover:bg-[#F8F9F7] cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 1-Tap Farmer Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                disabled={loading}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setCustomQuery('');
                  void runSearch(cat.query);
                }}
                className={`min-h-[68px] rounded-xl border p-3 text-left flex items-center gap-3 transition-colors disabled:opacity-60 cursor-pointer ${
                  isSelected
                    ? 'border-[#15803D] bg-[#ECFDF3] ring-1 ring-[#15803D]/30'
                    : 'border-[#D7DED4] bg-[#FAFBF9] hover:border-[#15803D] hover:bg-[#ECFDF3]'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? 'bg-[#15803D] text-white' : 'bg-[#ECFDF3] text-[#15803D]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#14221B] leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Free-text Search */}
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-[#66786E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder={t('nearby.searchPlaceholder')}
              className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-[#F8F9F7] pl-10 pr-4 py-2 text-sm text-[#14221B] placeholder:text-[#66786E] focus:border-[#15803D] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customQuery.trim()}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>{t('nearby.searchBtn')}</span>
          </button>
        </form>
      </section>

      {error && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-[#E2E7E0] bg-white p-8 flex items-center justify-center gap-3 text-sm text-[#52635A]">
          <Loader2 className="h-5 w-5 animate-spin text-[#15803D]" />
          <span>{t('nearby.searching')}</span>
        </div>
      )}

      {!loading && !result && !error && (
        <div className="rounded-xl border border-[#E2E7E0] bg-white p-10 text-center text-sm text-[#52635A]">
          {t('nearby.noPlacesYet')}
        </div>
      )}

      {!loading && result && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Nearby Markets & Agri Centers Cards */}
          <section className="lg:col-span-3 rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4 self-start">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEF2EC] pb-3">
              <div>
                <h2 className="font-display text-base font-bold text-[#14221B]">
                  {activeCategoryLabel}
                </h2>
                <p className="text-xs text-[#52635A] mt-0.5">
                  {result.locationLabel} ({result.latitude.toFixed(3)}, {result.longitude.toFixed(3)})
                </p>
              </div>
              <span className="rounded-lg bg-[#ECFDF3] border border-[#CBE2D0] px-2.5 py-1 font-mono text-xs font-semibold tabular-nums text-[#14532D]">
                {result.places.length}{' '}
                {result.places.length === 1 ? t('nearby.placeSingular') : t('nearby.placePlural')}
              </span>
            </div>

            {result.places.length === 0 ? (
              <p className="text-sm text-[#52635A] py-4">{t('nearby.noPlacesYet')}</p>
            ) : (
              <div className="space-y-3">
                {result.places.map((place) => (
                  <div
                    key={`${place.title}-${place.uri}`}
                    className="rounded-xl border border-[#D7DED4] bg-[#FAFBF9] p-4 space-y-2.5 hover:border-[#15803D] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Building2 className="h-4 w-4 text-[#15803D] shrink-0 mt-1" />
                        <div className="min-w-0">
                          <h3 className="font-display text-sm sm:text-base font-bold text-[#14221B] break-words">
                            {place.title}
                          </h3>
                          {place.address && (
                            <p className="text-xs text-[#52635A] mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span>{place.address}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {typeof place.distanceKm === 'number' && (
                        <span className="shrink-0 rounded-md border border-[#D7DED4] bg-white px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-[#14532D]">
                          ~{place.distanceKm} km
                        </span>
                      )}
                    </div>

                    {place.services && (
                      <p className="text-xs sm:text-sm text-[#34443B] leading-relaxed">
                        {place.services}
                      </p>
                    )}

                    {place.hours && (
                      <p className="text-xs text-[#52635A] flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#15803D] shrink-0" />
                        <span>{place.hours}</span>
                      </p>
                    )}

                    {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                      <p className="text-xs text-[#52635A] italic">
                        “{place.reviewSnippets[0]}”
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[36px] inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#166534] transition-colors"
                      >
                        <span>{t('nearby.openInMaps')}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                      {place.directionsUri && (
                        <a
                          href={place.directionsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[36px] inline-flex items-center gap-1.5 rounded-lg border border-[#D7DED4] bg-white px-3 py-1.5 text-xs font-semibold text-[#14221B] hover:border-[#15803D] hover:bg-[#ECFDF3] transition-colors"
                        >
                          <Navigation className="h-3.5 w-3.5 text-[#15803D] shrink-0" />
                          <span>{t('nearby.directions')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Details Summary */}
          <section className="lg:col-span-2 rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-3 self-start">
            <h2 className="font-display text-base font-bold text-[#14221B]">
              {t('nearby.answerTitle')}
            </h2>
            <div className="space-y-2.5 leading-relaxed">{renderFormattedLines(result.answer)}</div>
          </section>
        </div>
      )}
    </div>
  );
}
