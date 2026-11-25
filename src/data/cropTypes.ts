import type { CultivationStage } from '../types';

export type CropCategory =
  | 'vegetables'
  | 'fruits'
  | 'cereals'
  | 'pulses_oilseeds'
  | 'spices'
  | 'cash_crops';

export interface CropGuideProfile {
  id: string;
  category?: CropCategory;
  emoji: string;
  names: {
    en: string;
    te: string;
    hi: string;
  };
  defaultVariety: string;
  bestSeason: {
    en: string;
    te: string;
    hi: string;
  };
  plantation: {
    seedRateKgPerAcre: number;
    seedNote?: { en: string; te: string; hi: string };
    spacing: string;
    depthCm: string;
    tip: { en: string; te: string; hi: string };
  };
  irrigation: {
    frequencyDays: number;
    litersPerAcre: number;
    method: string;
    tip: { en: string; te: string; hi: string };
  };
  fertilizers: Array<{
    stage: string;
    name: string;
    kgPerAcre: number;
    timing: string;
  }>;
  pests: Array<{
    name: string;
    observationSign: { en: string; te: string; hi: string };
    treatment: { en: string; te: string; hi: string };
  }>;
  harvest: {
    daysToHarvest: string;
    expectedYieldKgPerAcre: number;
    readinessSigns: { en: string; te: string; hi: string };
    storageTip: { en: string; te: string; hi: string };
  };
  weatherAdvice: {
    en: string;
    te: string;
    hi: string;
  };
  stagesInfo: Record<CultivationStage, { days: string; action: { en: string; te: string; hi: string } }>;
}
