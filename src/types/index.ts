export type LanguageCode = string;

export interface DemoLocationOption {
  state: string;
  district: string;
  village: string;
}

export type CultivationStage =
  | 'land_preparation'
  | 'sowing'
  | 'germination'
  | 'vegetative_growth'
  | 'flowering'
  | 'maturity'
  | 'harvesting';

export const CULTIVATION_STAGES: CultivationStage[] = [
  'land_preparation',
  'sowing',
  'germination',
  'vegetative_growth',
  'flowering',
  'maturity',
  'harvesting',
];

export type AuthProviderType = 'email' | 'google' | 'apple' | 'phone';

export interface Farmer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  preferred_language: LanguageCode;
  location: string;
  auth_provider?: AuthProviderType;
  created_at?: string;
}

export interface AuthProvidersStatus {
  google: {
    configured: boolean;
    callbackUrl: string;
  };
  apple: {
    configured: boolean;
    callbackUrl: string;
  };
  phone: {
    configured: boolean;
  };
  email: {
    configured: boolean;
  };
}

export interface Farm {
  id: number;
  farmer_id: number;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  total_area_acres: number;
  soil_type: string;
  notes: string;
  field_count?: number;
  created_at: string;
}

export interface Field {
  id: number;
  farmer_id: number;
  farm_id: number;
  farm_name?: string;
  farm_location?: string;
  name: string;
  location: string;
  area_acres: number;
  soil_type: string;
  irrigation_method: string;
  active_crops_count?: number;
  created_at: string;
}

export interface Crop {
  id: number;
  farmer_id: number;
  field_id: number;
  field_name?: string;
  farm_name?: string;
  farm_id?: number;
  crop_name: string;
  variety: string;
  planting_date: string;
  cultivation_stage: CultivationStage;
  status: 'active' | 'harvested';
  notes: string;
  created_at: string;
}

export interface IrrigationRecord {
  id: number;
  farmer_id: number;
  field_id: number;
  crop_id: number | null;
  field_name?: string;
  farm_name?: string;
  crop_name?: string | null;
  irrigation_date: string;
  water_quantity_liters: number;
  frequency_days: number;
  next_scheduled_date: string;
  method: string;
  notes: string;
  created_at: string;
}

export interface FertilizerRecord {
  id: number;
  farmer_id: number;
  field_id: number;
  crop_id: number | null;
  field_name?: string;
  farm_name?: string;
  crop_name?: string | null;
  fertilizer_name: string;
  quantity_kg: number;
  application_date: string;
  notes: string;
  created_at: string;
}

export interface PestObservation {
  id: number;
  farmer_id: number;
  field_id: number;
  crop_id: number | null;
  field_name?: string;
  farm_name?: string;
  crop_name?: string | null;
  observation_date: string;
  pest_or_disease: string;
  severity: 'low' | 'medium' | 'high';
  observation_notes: string;
  treatment_details: string;
  status: 'active' | 'treated' | 'resolved';
  image_url: string | null;
  created_at: string;
}

export interface HarvestRecord {
  id: number;
  farmer_id: number;
  field_id: number;
  crop_id: number | null;
  field_name?: string;
  farm_name?: string;
  crop_name?: string | null;
  status: 'planned' | 'in_progress' | 'completed';
  harvest_date: string;
  quantity_kg: number;
  quality_grade: string;
  notes: string;
  created_at: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  condition: string;
  tempMax: number;
  tempMin: number;
  precipitationMm: number;
  precipitationProb: number;
  windMaxKmh: number;
}

export interface CurrentWeather {
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  precipitationMm: number;
  weatherCode: number;
  condition: string;
  observedAt: string;
}

export interface WeatherAlert {
  alertKey: string;
  farmId: number;
  farmName: string;
  alertType: 'heavy_rain' | 'heat_stress' | 'frost_risk' | 'high_wind' | 'fungal_risk' | 'dry_spell';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  recommendedAction: string;
  alertDate: string;
  affectedFields: string[];
}

export interface FarmWeatherReport {
  farmId: number;
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  source: 'open-meteo' | 'fallback';
  current: CurrentWeather;
  daily: DailyForecast[];
  alerts: WeatherAlert[];
  acknowledgedKeys: string[];
}

export interface WeatherAlertSettings {
  max_temp_c: number;
  min_temp_c: number;
  heavy_rain_mm: number;
  high_wind_kmh: number;
  high_humidity_pct: number;
}

export interface DashboardData {
  summary: {
    totalFields: number;
    activeCrops: number;
    irrigationDueCount: number;
    readyToHarvestCount: number;
  };
  upcomingIrrigations: Array<{
    id: number;
    field_id: number;
    crop_id?: number | null;
    field_name: string;
    farm_name: string;
    crop_name: string | null;
    next_scheduled_date: string;
    water_quantity_liters: number;
    frequency_days: number;
    method: string;
  }>;
  recentActivities: Array<{
    type: 'irrigation' | 'fertilizer' | 'pest' | 'harvest';
    id: number;
    activity_date: string;
    field_name: string;
    crop_name: string | null;
    detail: string;
  }>;
  irrigationByField: Array<{
    field_name: string;
    total_liters: number;
  }>;
  productionHistory: Array<{
    month: string;
    total_kg: number;
  }>;
  stageBreakdown: Array<{
    cultivation_stage: CultivationStage;
    count: number;
  }>;
}

export interface GroundedPlace {
  title: string;
  uri: string;
  placeId?: string;
  reviewSnippets?: string[];
  category?: string;
  address?: string;
  distanceKm?: number;
  services?: string;
  hours?: string;
  directionsUri?: string;
}

export interface NearbyPlacesResponse {
  answer: string;
  places: GroundedPlace[];
  latitude: number;
  longitude: number;
  locationLabel: string;
}

export interface PlantPhotoDiagnosis {
  problemName: string;
  detectedPlant: string;
  detectedFieldType: string;
  severity: 'low' | 'medium' | 'high';
  whatIsHappening: string;
  recommendedPesticide: string;
  howMuchToMix: string;
  treatmentCalculation: string;
  bestTimeAndMethod: string;
  stepByStepSpraying: string[];
  plantPrecautions: string;
  recoverySchedule: string;
  safetyTips: string;
  simpleSummaryText: string;
}

