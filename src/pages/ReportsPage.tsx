import { useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';
import '../lib/charts';
import type {
  Crop,
  DashboardData,
  Farmer,
  FertilizerRecord,
  Field,
  HarvestRecord,
  IrrigationRecord,
  PestObservation,
} from '../types';

interface ReportsPageProps {
  farmer: Farmer;
  dashboard: DashboardData | null;
  fields: Field[];
  crops: Crop[];
  irrigations: IrrigationRecord[];
  fertilizers: FertilizerRecord[];
  pests: PestObservation[];
  harvests: HarvestRecord[];
}

export function ReportsPage({
  farmer,
  dashboard,
  fields,
  crops,
  irrigations,
  fertilizers,
  pests,
  harvests,
}: ReportsPageProps) {
  const { t } = useTranslation();
  const [selectedFieldId, setSelectedFieldId] = useState<string>('all');

  const filterByField = <T extends { field_id: number }>(rows: T[]) =>
    selectedFieldId === 'all' ? rows : rows.filter((r) => String(r.field_id) === selectedFieldId);

  const filteredIrrigations = filterByField(irrigations);
  const filteredFertilizers = filterByField(fertilizers);
  const filteredPests = filterByField(pests);
  const filteredHarvests = filterByField(harvests);

  const handleExportCsv = () => {
    const rows: string[][] = [
      ['Module', 'Date', 'Field', 'Crop', 'Metric / Item', 'Value / Quantity', 'Status / Notes'],
    ];

    filteredIrrigations.forEach((i) =>
      rows.push([
        'Irrigation',
        i.irrigation_date,
        i.field_name || '',
        i.crop_name || '',
        i.method,
        `${i.water_quantity_liters} L`,
        `Next: ${i.next_scheduled_date}`,
      ])
    );
    filteredFertilizers.forEach((f) =>
      rows.push([
        'Fertilizer',
        f.application_date,
        f.field_name || '',
        f.crop_name || '',
        f.fertilizer_name,
        `${f.quantity_kg} kg`,
        f.notes,
      ])
    );
    filteredPests.forEach((p) =>
      rows.push([
        'Pest & Disease',
        p.observation_date,
        p.field_name || '',
        p.crop_name || '',
        p.pest_or_disease,
        p.severity,
        `${p.status} - ${p.treatment_details}`,
      ])
    );
    filteredHarvests.forEach((h) =>
      rows.push([
        'Harvest',
        h.harvest_date,
        h.field_name || '',
        h.crop_name || '',
        h.quality_grade,
        `${h.quantity_kg} kg`,
        h.status,
      ])
    );

    const escapeCell = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
    const csvContent = '\uFEFF' + rows.map((r) => r.map(escapeCell).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `krishifield-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('KrishiField — Farm Activity Report', 14, 18);
    doc.setFontSize(10);
    doc.text(
      `Farmer: ${farmer.full_name}  |  Generated: ${new Date().toISOString().slice(0, 10)}  |  Fields: ${fields.length}  |  Active Crops: ${crops.filter((c) => c.status === 'active').length}`,
      14,
      26
    );

    const tableBody: string[][] = [
      ...filteredIrrigations.map((i) => [
        'Irrigation',
        i.irrigation_date,
        i.field_name || '',
        `${i.water_quantity_liters} L (${i.method})`,
        `Next ${i.next_scheduled_date}`,
      ]),
      ...filteredFertilizers.map((f) => [
        'Fertilizer',
        f.application_date,
        f.field_name || '',
        `${f.fertilizer_name} (${f.quantity_kg} kg)`,
        f.notes || 'Applied',
      ]),
      ...filteredPests.map((p) => [
        'Pest/Disease',
        p.observation_date,
        p.field_name || '',
        `${p.pest_or_disease} (${p.severity})`,
        p.status,
      ]),
      ...filteredHarvests.map((h) => [
        'Harvest',
        h.harvest_date,
        h.field_name || '',
        `${h.quantity_kg} kg (${h.quality_grade})`,
        h.status,
      ]),
    ];

    autoTable(doc, {
      startY: 32,
      head: [['Activity', 'Date', 'Field', 'Details', 'Status / Note']],
      body: tableBody.length > 0 ? tableBody : [['—', '—', '—', 'No farm activity records yet', '—']],
      styles: { fontSize: 8.5 },
      headStyles: { fillColor: [21, 128, 61] },
    });

    doc.save(`krishifield-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const irrigationChartData = {
    labels: (dashboard?.irrigationByField ?? []).map((f) => f.field_name),
    datasets: [
      {
        label: 'Liters',
        data: (dashboard?.irrigationByField ?? []).map((f) => f.total_liters),
        backgroundColor: '#15803D',
        borderRadius: 6,
      },
    ],
  };

  const productionChartData = {
    labels: (dashboard?.productionHistory ?? []).map((p) => p.month),
    datasets: [
      {
        label: 'Harvest Yield (kg)',
        data: (dashboard?.productionHistory ?? []).map((p) => p.total_kg),
        borderColor: '#B45309',
        backgroundColor: 'rgba(180, 83, 9, 0.14)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const stageChartData = {
    labels: (dashboard?.stageBreakdown ?? []).map((s) => t(`stages.${s.cultivation_stage}`)),
    datasets: [
      {
        data: (dashboard?.stageBreakdown ?? []).map((s) => s.count),
        backgroundColor: ['#15803D', '#22C55E', '#84CC16', '#CA8A04', '#D97706', '#0D9488', '#166534'],
      },
    ],
  };

  const upcomingFeatures = [
    {
      title: 'Weather-Based Irrigation Automation',
      description: 'Automatically adjusts field watering schedules using soil evapotranspiration and local rainfall forecasts.',
    },
    {
      title: 'AI Disease Detection from Crop Photos',
      description: 'Analyze uploaded leaf images to classify blight, mildew, and nutrient deficiencies with treatment guidance.',
    },
    {
      title: 'Smart NPK Fertilizer Recommendations',
      description: 'Stage-specific dosage guidance tailored to crop variety, soil type, and field acreage.',
    },
    {
      title: 'Estimated Harvest Date Forecasting',
      description: 'Predicts optimal harvest windows from planting date, crop variety, and growing degree days.',
    },
    {
      title: 'Yield & Expense Financial Reports',
      description: 'Track input costs (seeds, water, fertilizer, labor) alongside market revenue per acre.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#14221B]">{t('reports.title')}</h1>
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(e.target.value)}
            className="min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-sm"
          >
            <option value="all">{t('farms.allFarms')} / {t('common.field')}</option>
            {fields.map((fl) => (
              <option key={fl.id} value={String(fl.id)}>
                {fl.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleExportCsv}
            className="min-h-[42px] inline-flex items-center gap-2 rounded-lg border border-[#D7DED4] bg-white px-4 py-2 text-sm font-semibold text-[#14221B] hover:bg-[#F3F6F1] cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="h-4 w-4 text-[#15803D]" />
            <span>{t('reports.exportCsv')}</span>
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="min-h-[42px] inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] cursor-pointer whitespace-nowrap"
          >
            <FileText className="h-4 w-4" />
            <span>{t('reports.exportPdf')}</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[#E2E7E0] bg-white p-5">
          <h2 className="font-display text-sm font-bold text-[#14221B] mb-3">
            {t('dashboard.irrigationChart')}
          </h2>
          <div className="h-56">
            {(dashboard?.irrigationByField ?? []).length > 0 ? (
              <Bar
                data={irrigationChartData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#52635A] text-center">
                {t('irrigation.noRecords')}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E7E0] bg-white p-5">
          <h2 className="font-display text-sm font-bold text-[#14221B] mb-3">
            {t('dashboard.productionChart')}
          </h2>
          <div className="h-56">
            {(dashboard?.productionHistory ?? []).length > 0 ? (
              <Line
                data={productionChartData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#52635A] text-center">
                {t('harvests.noRecords')}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E7E0] bg-white p-5">
          <h2 className="font-display text-sm font-bold text-[#14221B] mb-3">
            {t('reports.activeCropsByStage')}
          </h2>
          <div className="h-56">
            {(dashboard?.stageBreakdown ?? []).length > 0 ? (
              <Doughnut
                data={stageChartData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#52635A] text-center">
                {t('crops.noCrops')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Activity Summary Table */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-[#14221B]">{t('reports.activitySummary')}</h2>
          <span className="text-xs text-[#52635A] font-mono tabular-nums">
            <Download className="h-3.5 w-3.5 inline mr-1" />
            {t('reports.recordsReady', {
              count:
                filteredIrrigations.length +
                filteredFertilizers.length +
                filteredPests.length +
                filteredHarvests.length,
            })}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="rounded-lg bg-[#F8F9F7] border border-[#EEF2EC] p-3.5">
            <p className="text-xs text-[#52635A]">{t('nav.irrigation')}</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#14221B]">
              {filteredIrrigations.length}
            </p>
          </div>
          <div className="rounded-lg bg-[#F8F9F7] border border-[#EEF2EC] p-3.5">
            <p className="text-xs text-[#52635A]">{t('nav.fertilizers')}</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#14221B]">
              {filteredFertilizers.length}
            </p>
          </div>
          <div className="rounded-lg bg-[#F8F9F7] border border-[#EEF2EC] p-3.5">
            <p className="text-xs text-[#52635A]">{t('nav.pests')}</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#14221B]">
              {filteredPests.length}
            </p>
          </div>
          <div className="rounded-lg bg-[#F8F9F7] border border-[#EEF2EC] p-3.5">
            <p className="text-xs text-[#52635A]">{t('nav.harvests')}</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#14221B]">
              {filteredHarvests.length}
            </p>
          </div>
        </div>
      </section>

      {/* Clearly Marked Coming Soon Features */}
      <section className="rounded-xl border border-[#E2E7E0] bg-white p-5 space-y-4">
        <div>
          <h2 className="font-display text-base font-bold text-[#14221B]">{t('reports.comingSoonTitle')}</h2>
          <p className="text-xs text-[#52635A] mt-0.5">{t('reports.comingSoonDesc')}</p>
        </div>

        <div className="divide-y divide-[#EEF2EC]">
          {upcomingFeatures.map((feat) => (
            <div key={feat.title} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#14221B]">{feat.title}</p>
                <p className="text-xs text-[#52635A] mt-0.5">{feat.description}</p>
              </div>
              <span className="text-xs font-semibold text-[#B45309] shrink-0">
                {t('reports.comingSoonBadge')}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
