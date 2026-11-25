import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  Check,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  RefreshCw,
  SlidersHorizontal,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { FarmWeatherReport, WeatherAlertSettings } from '../types';

interface WeatherPageProps {
  reports: FarmWeatherReport[];
  settings: WeatherAlertSettings | null;
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export function WeatherPage({ reports, settings, loading, onRefresh }: WeatherPageProps) {
  const { t, i18n } = useTranslation();
  const [formSettings, setFormSettings] = useState<WeatherAlertSettings>(
    settings || {
      max_temp_c: 36,
      min_temp_c: 7,
      heavy_rain_mm: 15,
      high_wind_kmh: 25,
      high_humidity_pct: 82,
    }
  );
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormSettings(settings);
    }
  }, [settings]);

  const allAlerts = reports.flatMap((r) =>
    r.alerts.map((a) => ({
      ...a,
      acknowledged: r.acknowledgedKeys.includes(a.alertKey),
    }))
  );

  const handleAcknowledge = async (alertKey: string) => {
    setError('');
    try {
      await api.acknowledgeWeatherAlert(alertKey);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert');
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSavedNotice(false);
    setError('');
    try {
      await api.updateWeatherSettings(formSettings);
      await onRefresh();
      setSavedNotice(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save weather settings');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('weather.title')}</h1>
          <p className="text-sm text-[#52635A] mt-0.5">{t('weather.subtitle')}</p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void onRefresh()}
          className="min-h-[42px] inline-flex items-center gap-2 rounded-lg border border-[#D7DED4] bg-white px-4 py-2 text-sm font-semibold text-[#14221B] hover:bg-[#F3F6F1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('weather.refreshWeather')}</span>
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]"
        >
          {error}
        </div>
      )}

      {/* Active Agricultural Alerts */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
        <h2 className="font-display text-base font-bold text-[#14221B]">
          {t('weather.activeAlerts')} ({allAlerts.filter((a) => !a.acknowledged).length})
        </h2>

        {allAlerts.length === 0 ? (
          <p className="text-sm text-[#52635A] py-4">{t('weather.noAlerts')}</p>
        ) : (
          <div className="space-y-3">
            {allAlerts.map((alert) => {
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
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    alert.acknowledged
                      ? 'border-[#E2E7E0] bg-[#F8F9F7] opacity-75'
                      : isCritical
                      ? 'border-[#FECACA] bg-[#FEF2F2]'
                      : isWarning
                      ? 'border-[#FCD34D] bg-[#FFFBEB]'
                      : 'border-[#BFDBFE] bg-[#EFF6FF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
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
                        <span className={isCritical ? 'text-[#B91C1C] font-semibold' : isWarning ? 'text-[#B45309] font-semibold' : 'text-[#1D4ED8] font-semibold'}>
                          {severityLabel}
                        </span>
                        {' · '}
                        {alert.farmName}
                        {' · '}
                        <span className="font-mono tabular-nums">{alert.alertDate}</span>
                      </p>
                      <h3 className="font-display font-bold text-[#14221B]">{alert.title}</h3>
                      <p className="text-[#42544B]">{alert.message}</p>
                      <p className="text-xs text-[#14221B] pt-1">
                        <span className="font-semibold">{t('weather.recommendedAction')}:</span>{' '}
                        {alert.recommendedAction}
                      </p>
                      {alert.affectedFields.length > 0 && (
                        <p className="text-xs text-[#52635A]">
                          {t('weather.affectedFields')}: {alert.affectedFields.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={alert.acknowledged}
                    onClick={() => handleAcknowledge(alert.alertKey)}
                    className={`min-h-[38px] inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 ${
                      alert.acknowledged
                        ? 'border-[#D7DED4] bg-white text-[#52635A] cursor-default'
                        : 'border-[#D7DED4] bg-white text-[#14221B] hover:bg-[#F3F6F1] cursor-pointer'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{alert.acknowledged ? t('weather.acknowledged') : t('weather.acknowledge')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Per-Farm Live Weather & 7-Day Forecasts */}
      <div className="space-y-5">
        {reports.map((report) => (
          <section key={report.farmId} className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF2EC] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#14221B]">{report.farmName}</h2>
                <p className="text-xs text-[#52635A] mt-0.5 tabular-nums">
                  {report.location} · {report.latitude.toFixed(2)}°, {report.longitude.toFixed(2)}° ·{' '}
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

            {/* Current Conditions Grid */}
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

            {/* 7-Day Forecast */}
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
        ))}
      </div>

      {/* Alert Threshold Settings */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-[#15803D]" />
          <h2 className="font-display text-base font-bold text-[#14221B]">{t('weather.settingsTitle')}</h2>
        </div>
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1.5">{t('weather.maxTemp')}</label>
            <input
              type="number"
              step="0.5"
              value={formSettings.max_temp_c}
              onChange={(e) => setFormSettings({ ...formSettings, max_temp_c: Number(e.target.value) })}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1.5">{t('weather.minTemp')}</label>
            <input
              type="number"
              step="0.5"
              value={formSettings.min_temp_c}
              onChange={(e) => setFormSettings({ ...formSettings, min_temp_c: Number(e.target.value) })}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1.5">{t('weather.heavyRain')}</label>
            <input
              type="number"
              step="1"
              value={formSettings.heavy_rain_mm}
              onChange={(e) => setFormSettings({ ...formSettings, heavy_rain_mm: Number(e.target.value) })}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1.5">{t('weather.highWind')}</label>
            <input
              type="number"
              step="1"
              value={formSettings.high_wind_kmh}
              onChange={(e) => setFormSettings({ ...formSettings, high_wind_kmh: Number(e.target.value) })}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#52635A] mb-1.5">{t('weather.highHumidity')}</label>
            <input
              type="number"
              step="1"
              value={formSettings.high_humidity_pct}
              onChange={(e) => setFormSettings({ ...formSettings, high_humidity_pct: Number(e.target.value) })}
              className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-mono tabular-nums"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={savingSettings}
              className="min-h-[42px] rounded-lg bg-[#15803D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors cursor-pointer"
            >
              {t('weather.saveSettings')}
            </button>
            {savedNotice && (
              <span className="text-xs font-medium text-[#15803D]">{t('weather.thresholdsUpdated')}</span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
