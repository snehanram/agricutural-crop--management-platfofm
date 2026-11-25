import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bug,
  CheckCircle2,
  CloudSun,
  Compass,
  Droplets,
  FlaskConical,
  Info,
  MapPin,
  RefreshCw,
  Sprout,
  Store,
  Tractor,
} from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import '../lib/charts';
import { api } from '../lib/api';
import type { NavSection } from '../components/AppShell';
import type { Crop, DashboardData, FarmWeatherReport } from '../types';
import { findCropGuideByName, getLocalizedCropName } from '../utils/cropDisplay';

interface DashboardPageProps {
  data: DashboardData | null;
  weatherReports: FarmWeatherReport[];
  crops?: Crop[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onNavigate: (section: NavSection) => void;
  hasFields?: boolean;
  onOpenSetup?: () => void;
  isDemoFarmer?: boolean;
  onRerollDemo?: () => Promise<void>;
  rerollingDemo?: boolean;
}

export function DashboardPage({
  data,
  weatherReports,
  crops = [],
  loading,
  onRefresh,
  onNavigate,
  hasFields = true,
  onOpenSetup,
  isDemoFarmer = false,
  onRerollDemo,
  rerollingDemo = false,
}: DashboardPageProps) {
  const { t, i18n } = useTranslation();
  const [loggingId, setLoggingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  const handleQuickLogIrrigation = async (item: DashboardData['upcomingIrrigations'][number]) => {
    setLoggingId(item.id);
    setActionError('');
    try {
      await api.createIrrigation({
        field_id: item.field_id,
        crop_id: item.crop_id ?? null,
        irrigation_date: today,
        water_quantity_liters: item.water_quantity_liters,
        frequency_days: item.frequency_days,
        method: item.method,
        notes: 'Logged directly from dashboard schedule',
      });
      await onRefresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to log irrigation');
    } finally {
      setLoggingId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="h-28 rounded-xl border border-[#E2E7E0] bg-white animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-xl border border-[#E2E7E0] bg-white animate-pulse" />
      </div>
    );
  }

  const summary = data?.summary ?? {
    totalFields: 0,
    activeCrops: 0,
    irrigationDueCount: 0,
    readyToHarvestCount: 0,
  };

  const unackAlerts = weatherReports.flatMap((r) =>
    r.alerts.filter((a) => !r.acknowledgedKeys.includes(a.alertKey))
  );
  const primaryWeather = weatherReports[0];

  const irrigationChartData = {
    labels: (data?.irrigationByField ?? []).map((f) => f.field_name),
    datasets: [
      {
        label: t('dashboard.irrigationChart'),
        data: (data?.irrigationByField ?? []).map((f) => f.total_liters),
        backgroundColor: '#15803D',
        borderRadius: 6,
      },
    ],
  };

  const productionChartData = {
    labels: (data?.productionHistory ?? []).map((p) => p.month),
    datasets: [
      {
        label: t('dashboard.productionChart'),
        data: (data?.productionHistory ?? []).map((p) => p.total_kg),
        borderColor: '#B45309',
        backgroundColor: 'rgba(180, 83, 9, 0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#B45309',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  };

  const quickActions: Array<{ id: NavSection; label: string; icon: typeof BookOpen }> = [
    { id: 'guide', label: t('nav.guide'), icon: BookOpen },
    { id: 'nearby', label: t('nav.nearby'), icon: Store },
    { id: 'farms', label: t('nav.farms'), icon: MapPin },
    { id: 'crops', label: t('nav.crops'), icon: Sprout },
    { id: 'weather', label: t('nav.weather'), icon: CloudSun },
    { id: 'irrigation', label: t('nav.irrigation'), icon: Droplets },
    { id: 'fertilizers', label: t('nav.fertilizers'), icon: FlaskConical },
    { id: 'pests', label: t('nav.pests'), icon: Bug },
    { id: 'harvests', label: t('nav.harvests'), icon: Tractor },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('dashboard.title')}</h1>
          <p className="text-sm text-[#52635A] mt-0.5">
            {new Date().toLocaleDateString(i18n.language || undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {hasFields && onOpenSetup && (
            <button
              type="button"
              onClick={onOpenSetup}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-[#15803D] bg-[#ECFDF3] px-4 py-2 text-sm font-semibold text-[#14532D] hover:bg-[#DCFCE7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MapPin className="h-4 w-4" />
              <span>{t('setup.dashboardBannerBtn')}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('guide')}
            className="min-h-[44px] inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>{t('dashboard.quickGuideBtn')}</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]"
        >
          {actionError}
        </div>
      )}

      {!hasFields && onOpenSetup && (
        <section className="rounded-xl border border-[#15803D]/35 bg-[#ECFDF3] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#15803D] text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#14221B]">
                {t('setup.dashboardBannerTitle')}
              </h2>
              <p className="text-xs text-[#42544B] mt-0.5">
                {t('setup.welcomeSubtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSetup}
            className="min-h-[42px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sprout className="h-4 w-4" />
            <span>{t('setup.dashboardBannerBtn')}</span>
          </button>
        </section>
      )}

      {isDemoFarmer && (
        <section
          aria-label={t('website.demoGuideTitle')}
          className="rounded-xl border border-[#CBE2D0] bg-white p-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF3] text-[#15803D]">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-[#14221B]">
                  {t('website.demoGuideTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-[#42544B] mt-0.5 leading-relaxed">
                  {t('website.demoGuideSubtitle')}
                </p>
              </div>
            </div>
            {onRerollDemo && (
              <button
                type="button"
                disabled={rerollingDemo}
                onClick={() => void onRerollDemo()}
                className="min-h-[40px] inline-flex items-center justify-center gap-2 rounded-lg border border-[#15803D] bg-[#ECFDF3] px-3.5 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#DCFCE7] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${rerollingDemo ? 'animate-spin' : ''}`} />
                <span>{t('website.demoRerollBtn')}</span>
              </button>
            )}
          </div>

          {crops.length > 0 && (
            <div className="space-y-2 border-t border-[#EEF2EC] pt-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#52635A]">
                {t('website.demoSampleCropsLabel')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {crops
                  .filter((c) => c.status === 'active')
                  .slice(0, 6)
                  .map((crop) => {
                    const guide = findCropGuideByName(crop.crop_name);
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => onNavigate('crops')}
                        className="text-left rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3.5 py-2.5 hover:border-[#15803D] hover:bg-[#ECFDF3] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#14221B] truncate">
                            {guide?.emoji ? `${guide.emoji} ` : ''}
                            {getLocalizedCropName(t, crop.crop_name)}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#15803D] shrink-0" />
                        </div>
                        <p className="text-xs text-[#52635A] mt-1 truncate">
                          {crop.field_name} · {t(`stages.${crop.cultivation_stage}`)}
                        </p>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 border-t border-[#EEF2EC] pt-3.5">
            <button
              type="button"
              onClick={() => onNavigate('crops')}
              className="text-left rounded-lg border border-[#E2E7E0] bg-[#F8F9F7] p-3 hover:border-[#15803D] hover:bg-[#F2F9F4] transition-colors cursor-pointer"
            >
              <p className="text-xs font-bold text-[#14532D]">{t('website.demoStep1Title')}</p>
              <p className="text-xs text-[#42544B] mt-1 leading-relaxed">{t('website.demoStep1Desc')}</p>
            </button>
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById('upcoming-watering-section')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="text-left rounded-lg border border-[#E2E7E0] bg-[#F8F9F7] p-3 hover:border-[#15803D] hover:bg-[#F2F9F4] transition-colors cursor-pointer"
            >
              <p className="text-xs font-bold text-[#14532D]">{t('website.demoStep2Title')}</p>
              <p className="text-xs text-[#42544B] mt-1 leading-relaxed">{t('website.demoStep2Desc')}</p>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('guide')}
              className="text-left rounded-lg border border-[#E2E7E0] bg-[#F8F9F7] p-3 hover:border-[#15803D] hover:bg-[#F2F9F4] transition-colors cursor-pointer"
            >
              <p className="text-xs font-bold text-[#14532D]">{t('website.demoStep3Title')}</p>
              <p className="text-xs text-[#42544B] mt-1 leading-relaxed">{t('website.demoStep3Desc')}</p>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('pests')}
              className="text-left rounded-lg border border-[#E2E7E0] bg-[#F8F9F7] p-3 hover:border-[#15803D] hover:bg-[#F2F9F4] transition-colors cursor-pointer"
            >
              <p className="text-xs font-bold text-[#14532D]">{t('website.demoStep4Title')}</p>
              <p className="text-xs text-[#42544B] mt-1 leading-relaxed">{t('website.demoStep4Desc')}</p>
            </button>
          </div>
        </section>
      )}

      {/* Simple Large Tap Buttons for Any Farmer Task */}
      <section className="rounded-xl border border-[#CBE2D0] bg-[#F2F9F4] p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="font-display text-base font-bold text-[#14221B]">
            {t('dashboard.quickActionsTitle')}
          </h2>
          <span className="text-xs text-[#42544B]">{t('dashboard.quickGuideTitle')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onNavigate(act.id)}
                className="min-h-[72px] rounded-xl border border-[#D7DED4] bg-white p-3 flex flex-col items-center justify-center gap-1.5 text-center hover:border-[#15803D] hover:bg-[#ECFDF3] transition-colors cursor-pointer"
              >
                <Icon className="h-5 w-5 text-[#15803D] shrink-0" />
                <span className="text-xs font-semibold text-[#14221B] leading-tight">{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4 Summary KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Farm key metrics">
        <button
          type="button"
          onClick={() => onNavigate('farms')}
          className="text-left rounded-xl border border-[#E2E7E0] bg-white p-5 hover:border-[#B8C7BC] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-[#52635A]">
            <span>{t('dashboard.totalFields')}</span>
            <MapPin className="h-4 w-4 text-[#15803D]" />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[#14221B]">
            {summary.totalFields}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('crops')}
          className="text-left rounded-xl border border-[#E2E7E0] bg-white p-5 hover:border-[#B8C7BC] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-[#52635A]">
            <span>{t('dashboard.activeCrops')}</span>
            <Sprout className="h-4 w-4 text-[#15803D]" />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[#14221B]">
            {summary.activeCrops}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('irrigation')}
          className={`text-left rounded-xl border p-5 transition-colors cursor-pointer ${
            summary.irrigationDueCount > 0
              ? 'border-[#FCD34D] bg-[#FFFBEB] hover:border-[#F59E0B]'
              : 'border-[#E2E7E0] bg-white hover:border-[#B8C7BC]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-[#52635A]">
            <span>{t('dashboard.irrigationDue')}</span>
            <Droplets className={`h-4 w-4 ${summary.irrigationDueCount > 0 ? 'text-[#B45309]' : 'text-[#15803D]'}`} />
          </div>
          <p
            className={`mt-3 font-mono text-3xl font-semibold tabular-nums ${
              summary.irrigationDueCount > 0 ? 'text-[#92400E]' : 'text-[#14221B]'
            }`}
          >
            {summary.irrigationDueCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('harvests')}
          className="text-left rounded-xl border border-[#E2E7E0] bg-white p-5 hover:border-[#B8C7BC] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-[#52635A]">
            <span>{t('dashboard.readyToHarvest')}</span>
            <Tractor className="h-4 w-4 text-[#15803D]" />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[#14221B]">
            {summary.readyToHarvestCount}
          </p>
        </button>
      </section>

      {/* Live Weather Monitoring & Alerts Strip */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF3] text-[#15803D]">
              <CloudSun className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#14221B]">
                {t('dashboard.weatherBannerTitle')}
              </h2>
              {primaryWeather ? (
                <p className="text-sm text-[#52635A] mt-0.5 tabular-nums">
                  {primaryWeather.farmName} ({primaryWeather.location}) ·{' '}
                  <span className="font-semibold text-[#14221B]">{primaryWeather.current.temperatureC}°C</span> ·{' '}
                  {primaryWeather.current.condition} · {t('weather.humidity')} {primaryWeather.current.humidityPct}% ·{' '}
                  {t('weather.wind')} {primaryWeather.current.windSpeedKmh} km/h
                </p>
              ) : (
                <p className="text-sm text-[#52635A] mt-0.5">{t('common.loading')}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('weather')}
            className="min-h-[40px] inline-flex items-center gap-2 rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3.5 py-2 text-xs font-semibold text-[#14221B] hover:bg-[#EDF1EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{t('dashboard.viewWeather')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {unackAlerts.length > 0 && (
          <div className="mt-4 border-t border-[#E2E7E0] pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {unackAlerts.slice(0, 2).map((alert) => {
              const isCritical = alert.severity === 'critical';
              const isWarning = alert.severity === 'warning';
              return (
                <div
                  key={alert.alertKey}
                  className={`rounded-lg border p-3.5 flex items-start gap-3 ${
                    isCritical
                      ? 'border-[#FECACA] bg-[#FEF2F2]'
                      : isWarning
                      ? 'border-[#FCD34D] bg-[#FFFBEB]'
                      : 'border-[#BFDBFE] bg-[#EFF6FF]'
                  }`}
                >
                  {isCritical || isWarning ? (
                    <AlertTriangle
                      className={`h-4 w-4 shrink-0 mt-0.5 ${isCritical ? 'text-[#DC2626]' : 'text-[#B45309]'}`}
                    />
                  ) : (
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#1D4ED8]" />
                  )}
                  <div className="min-w-0 text-xs space-y-1">
                    <p className="font-semibold text-[#14221B]">
                      {alert.farmName} · {alert.title}
                    </p>
                    <p className="text-[#42544B] leading-relaxed">{alert.recommendedAction}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#E2E7E0] bg-white p-5">
          <h2 className="font-display text-base font-bold text-[#14221B] mb-4">
            {t('dashboard.irrigationChart')}
          </h2>
          <div className="h-64">
            {(data?.irrigationByField ?? []).length > 0 ? (
              <Bar data={irrigationChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#52635A]">
                {t('irrigation.noRecords')}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E7E0] bg-white p-5">
          <h2 className="font-display text-base font-bold text-[#14221B] mb-4">
            {t('dashboard.productionChart')}
          </h2>
          <div className="h-64">
            {(data?.productionHistory ?? []).length > 0 ? (
              <Line data={productionChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#52635A]">
                {t('harvests.noRecords')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Irrigation Tasks + Recent Activities Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="upcoming-watering-section" className="rounded-xl border border-[#E2E7E0] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-bold text-[#14221B]">
              {t('dashboard.upcomingTasks')}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('irrigation')}
              className="text-xs font-semibold text-[#15803D] hover:underline cursor-pointer"
            >
              {t('nav.irrigation')}
            </button>
          </div>

          {(data?.upcomingIrrigations ?? []).length === 0 ? (
            <p className="text-sm text-[#52635A] py-6 text-center">{t('dashboard.noTasks')}</p>
          ) : (
            <div className="divide-y divide-[#EEF2EC]">
              {data!.upcomingIrrigations.map((item) => {
                const isOverdue = item.next_scheduled_date < today;
                const isDueToday = item.next_scheduled_date === today;
                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#14221B] truncate">
                        {item.field_name}
                        {item.crop_name ? ` · ${getLocalizedCropName(t, item.crop_name)}` : ''}
                      </p>
                      <p className="text-xs text-[#52635A] font-mono tabular-nums mt-0.5">
                        <span className={isOverdue ? 'text-[#B91C1C] font-semibold' : isDueToday ? 'text-[#B45309] font-semibold' : ''}>
                          {isOverdue
                            ? `${t('dashboard.overdue')} (${item.next_scheduled_date})`
                            : isDueToday
                            ? `${t('dashboard.dueToday')} (${item.next_scheduled_date})`
                            : `${t('dashboard.scheduled')} ${item.next_scheduled_date}`}
                        </span>
                        {' · '}
                        {item.water_quantity_liters.toLocaleString()} L · {item.method}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={loggingId === item.id}
                      onClick={() => handleQuickLogIrrigation(item)}
                      className="min-h-[38px] inline-flex items-center gap-1.5 rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3 py-1.5 text-xs font-semibold text-[#14532D] hover:bg-[#ECFDF3] hover:border-[#15803D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{t('dashboard.markWatered')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#E2E7E0] bg-white p-5">
          <h2 className="font-display text-base font-bold text-[#14221B] mb-4">
            {t('dashboard.recentActivities')}
          </h2>

          {(data?.recentActivities ?? []).length === 0 ? (
            <p className="text-sm text-[#52635A] py-6 text-center">{t('dashboard.noActivities')}</p>
          ) : (
            <div className="divide-y divide-[#EEF2EC]">
              {data!.recentActivities.map((act) => (
                <div key={`${act.type}-${act.id}`} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#14221B] truncate">
                      <span className="capitalize font-semibold">{act.type}</span> · {act.field_name}
                      {act.crop_name ? ` (${getLocalizedCropName(t, act.crop_name)})` : ''}
                    </p>
                    <p className="text-xs text-[#52635A] mt-0.5 truncate">{act.detail}</p>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-[#52635A] shrink-0">
                    {act.activity_date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
