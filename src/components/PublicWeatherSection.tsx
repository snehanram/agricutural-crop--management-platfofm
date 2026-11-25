import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  Loader2,
  MapPin,
  Search,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { FarmWeatherReport } from '../types';

const PRESET_REGIONS = [
  'Guntur, Andhra Pradesh',
  'Nashik, Maharashtra',
  'Ludhiana, Punjab',
  'Thanjavur, Tamil Nadu',
  'Indore, Madhya Pradesh',
];

export function PublicWeatherSection() {
  const { t, i18n } = useTranslation();
  const [locationQuery, setLocationQuery] = useState('Guntur, Andhra Pradesh');
  const [report, setReport] = useState<FarmWeatherReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (target: string) => {
    const clean = target.trim();
    if (!clean) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.getPublicWeather(clean);
      setReport(res.reports[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchWeather('Guntur, Andhra Pradesh');
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void fetchWeather(locationQuery);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('weather.title')}</h1>
        <p className="text-sm text-[#52635A] mt-1">{t('weather.subtitle')}</p>
      </div>

      {/* Location Search Box */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
        <p className="text-sm font-medium text-[#14221B]">{t('website.publicWeatherPrompt')}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <MapPin className="h-4 w-4 text-[#15803D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder={t('website.publicWeatherPlaceholder')}
              className="w-full min-h-[46px] rounded-xl border border-[#D7DED4] bg-[#F8F9F7] pl-10 pr-4 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !locationQuery.trim()}
            className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>{t('website.checkWeatherBtn')}</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {PRESET_REGIONS.map((city) => {
            const active = report?.location?.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setLocationQuery(city);
                  void fetchWeather(city);
                }}
                className={`min-h-[34px] rounded-lg border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D] font-semibold'
                    : 'border-[#E2E7E0] bg-[#FAFBF9] text-[#42544B] hover:border-[#15803D]'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </section>

      {error && (
        <div role="alert" className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
          {error}
        </div>
      )}

      {loading && !report && (
        <div className="rounded-xl border border-[#E2E7E0] bg-white p-10 flex items-center justify-center gap-3 text-sm text-[#52635A]">
          <Loader2 className="h-5 w-5 animate-spin text-[#15803D]" />
          <span>{t('common.loading')}</span>
        </div>
      )}

      {report && (
        <>
          {/* Alerts */}
          <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
            <h2 className="font-display text-base font-bold text-[#14221B]">
              {t('weather.activeAlerts')} ({report.alerts.length})
            </h2>

            {report.alerts.length === 0 ? (
              <p className="text-sm text-[#52635A] py-2">{t('weather.noAlerts')}</p>
            ) : (
              <div className="space-y-3">
                {report.alerts.map((alert) => {
                  const isCritical = alert.severity === 'critical';
                  const isWarning = alert.severity === 'warning';
                  const severityLabel = isCritical
                    ? t('weather.criticalAlert')
                    : isWarning
                    ? t('weather.warningAlert')
                    : t('weather.advisoryAlert');
                  return (
                    <div
                      key={alert.alertKey}
                      className={`rounded-xl border p-4 flex items-start gap-3 ${
                        isCritical
                          ? 'border-[#FECACA] bg-[#FEF2F2]'
                          : isWarning
                          ? 'border-[#FCD34D] bg-[#FFFBEB]'
                          : 'border-[#BFDBFE] bg-[#EFF6FF]'
                      }`}
                    >
                      {isCritical || isWarning ? (
                        <AlertTriangle
                          className={`h-5 w-5 shrink-0 mt-0.5 ${
                            isCritical ? 'text-[#DC2626]' : 'text-[#B45309]'
                          }`}
                        />
                      ) : (
                        <Info className="h-5 w-5 shrink-0 mt-0.5 text-[#1D4ED8]" />
                      )}
                      <div className="space-y-1 text-sm">
                        <p className="text-xs font-medium text-[#52635A]">
                          <span
                            className={
                              isCritical
                                ? 'text-[#B91C1C] font-semibold'
                                : isWarning
                                ? 'text-[#B45309] font-semibold'
                                : 'text-[#1D4ED8] font-semibold'
                            }
                          >
                            {severityLabel}
                          </span>
                          {' · '}
                          {report.location}
                          {' · '}
                          <span className="font-mono tabular-nums">{alert.alertDate}</span>
                        </p>
                        <h3 className="font-display font-bold text-[#14221B]">{alert.title}</h3>
                        <p className="text-[#42544B]">{alert.message}</p>
                        <p className="text-xs text-[#14221B] pt-1">
                          <span className="font-semibold">{t('weather.recommendedAction')}:</span>{' '}
                          {alert.recommendedAction}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Forecast & Conditions */}
          <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF2EC] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#14221B]">{report.location}</h2>
                <p className="text-xs text-[#52635A] mt-0.5 tabular-nums">
                  {report.latitude.toFixed(2)}°, {report.longitude.toFixed(2)}° ·{' '}
                  {report.source === 'open-meteo' ? t('weather.liveSource') : t('weather.fallbackSource')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CloudSun className="h-6 w-6 text-[#15803D]" />
                  <span className="font-mono text-2xl font-bold tabular-nums text-[#14221B]">
                    {report.current.temperatureC}°C
                  </span>
                </div>
                <span className="text-sm font-medium text-[#42544B]">{report.current.condition}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-[#F8F9F7] p-3 border border-[#EEF2EC]">
                <div className="flex items-center gap-1.5 text-xs text-[#52635A]">
                  <Thermometer className="h-3.5 w-3.5" />
                  <span>{t('weather.temperature')}</span>
                </div>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#14221B]">
                  {report.current.temperatureC}°C
                </p>
              </div>
              <div className="rounded-lg bg-[#F8F9F7] p-3 border border-[#EEF2EC]">
                <div className="flex items-center gap-1.5 text-xs text-[#52635A]">
                  <Droplets className="h-3.5 w-3.5" />
                  <span>{t('weather.humidity')}</span>
                </div>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#14221B]">
                  {report.current.humidityPct}%
                </p>
              </div>
              <div className="rounded-lg bg-[#F8F9F7] p-3 border border-[#EEF2EC]">
                <div className="flex items-center gap-1.5 text-xs text-[#52635A]">
                  <Wind className="h-3.5 w-3.5" />
                  <span>{t('weather.wind')}</span>
                </div>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#14221B]">
                  {report.current.windSpeedKmh} km/h
                </p>
              </div>
              <div className="rounded-lg bg-[#F8F9F7] p-3 border border-[#EEF2EC]">
                <div className="flex items-center gap-1.5 text-xs text-[#52635A]">
                  <CloudRain className="h-3.5 w-3.5" />
                  <span>{t('weather.rain')}</span>
                </div>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#14221B]">
                  {report.current.precipitationMm} mm
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#52635A] mb-3">{t('weather.sevenDay')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {report.daily.map((day) => (
                  <div
                    key={day.date}
                    className="rounded-lg border border-[#E2E7E0] bg-[#FAFBF9] p-3 text-xs space-y-1.5"
                  >
                    <p className="font-mono font-semibold tabular-nums text-[#14221B]">
                      {new Date(`${day.date}T00:00:00`).toLocaleDateString(i18n.language || undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-[#42544B] truncate" title={day.condition}>
                      {day.condition}
                    </p>
                    <p className="font-mono tabular-nums text-[#14221B] font-semibold">
                      {day.tempMax}° / {day.tempMin}°
                    </p>
                    <p className="font-mono tabular-nums text-[#52635A]">
                      {day.precipitationMm} mm · {day.precipitationProb}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
