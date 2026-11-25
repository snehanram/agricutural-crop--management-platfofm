import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CULTIVATION_STAGES, type CultivationStage } from '../types';

interface CultivationTrackerProps {
  currentStage: CultivationStage;
  onSelectStage?: (stage: CultivationStage) => void;
  disabled?: boolean;
}

export function CultivationTracker({
  currentStage,
  onSelectStage,
  disabled = false,
}: CultivationTrackerProps) {
  const { t } = useTranslation();
  const activeIdx = Math.max(0, CULTIVATION_STAGES.indexOf(currentStage));
  const progressPct = Math.round(((activeIdx + 1) / CULTIVATION_STAGES.length) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[#52635A]">
        <span className="font-medium text-[#14221B]">
          {t(`stages.${currentStage}`)}
        </span>
        <span className="font-mono tabular-nums">
          {activeIdx + 1}/{CULTIVATION_STAGES.length} · {progressPct}%
        </span>
      </div>

      {/* Continuous progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8EDE5]">
        <div
          className="h-full rounded-full bg-[#15803D] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Interactive 7-step stage buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {CULTIVATION_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          return (
            <button
              key={stage}
              type="button"
              disabled={disabled || !onSelectStage}
              onClick={() => onSelectStage?.(stage)}
              className={`min-h-[40px] px-2 py-1.5 rounded-lg border text-left transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#15803D] ${
                isCurrent
                  ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D] font-semibold'
                  : isCompleted
                  ? 'border-[#CBE2D0] bg-[#F6FAF7] text-[#166534]'
                  : 'border-[#E2E7E0] bg-white text-[#52635A] hover:border-[#B8C7BC] hover:text-[#14221B]'
              } ${disabled || !onSelectStage ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-mono tabular-nums ${
                  isCurrent
                    ? 'bg-[#15803D] text-white'
                    : isCompleted
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-[#E8EDE5] text-[#52635A]'
                }`}
              >
                {isCompleted ? <Check className="h-2.5 w-2.5" /> : idx + 1}
              </span>
              <span className="truncate text-[11px] leading-tight">
                {t(`stages.${stage}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
