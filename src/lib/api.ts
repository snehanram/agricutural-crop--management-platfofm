import type {
  AuthProvidersStatus,
  Crop,
  CultivationStage,
  DashboardData,
  DemoLocationOption,
  Farm,
  Farmer,
  FarmWeatherReport,
  FertilizerRecord,
  Field,
  HarvestRecord,
  IrrigationRecord,
  LanguageCode,
  NearbyPlacesResponse,
  PestObservation,
  PlantPhotoDiagnosis,
  WeatherAlertSettings,
} from '../types';

const TOKEN_KEY = 'krishifield_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

let onUnauthorizedHandler: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorizedHandler = fn;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const resp = await fetch(url, { ...options, headers });
  const data = await resp.json().catch(() => ({}));

  const isAuthAttempt =
    url.includes('/api/auth/login') ||
    url.includes('/api/auth/phone') ||
    url.includes('/api/auth/demo') ||
    url.includes('/api/auth/register') ||
    url.includes('/api/auth/oauth/direct');
  const isNonFatalSync = url.includes('/api/auth/preferences');

  if (resp.status === 401 && !isAuthAttempt && !isNonFatalSync) {
    setAuthToken(null);
    if (onUnauthorizedHandler) onUnauthorizedHandler();
  }

  if (!resp.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${resp.status})`);
  }

  return data as T;
}

export const api = {
  // Auth
  getAuthProviders: () => request<AuthProvidersStatus>('/api/auth/providers'),

  login: (email: string, password: string) =>
    request<{ token: string; farmer: Farmer }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  demoLogin: (preferred_language?: LanguageCode) =>
    request<{ token: string; farmer: Farmer; demoLocation?: DemoLocationOption }>('/api/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ preferred_language }),
    }),

  loginWithPhone: (payload: {
    phone: string;
    full_name?: string;
    preferred_language: LanguageCode;
    location?: string;
    mode?: 'register' | 'login';
  }) =>
    request<{ token: string; farmer: Farmer; isNew?: boolean }>('/api/auth/phone', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getGoogleAuthUrl: (lang: LanguageCode) =>
    request<{ url: string }>(`/api/auth/oauth/google/url?lang=${encodeURIComponent(lang)}`),

  getAppleAuthUrl: (lang: LanguageCode) =>
    request<{ url: string }>(`/api/auth/oauth/apple/url?lang=${encodeURIComponent(lang)}`),

  oauthDirectLogin: (payload: {
    provider: 'google' | 'apple';
    email: string;
    full_name?: string;
    preferred_language: LanguageCode;
  }) =>
    request<{ token: string; farmer: Farmer }>('/api/auth/oauth/direct', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    preferred_language: LanguageCode;
    location: string;
  }) =>
    request<{ token: string; farmer: Farmer }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => request<{ farmer: Farmer }>('/api/auth/me'),

  updatePreferences: (payload: Partial<Pick<Farmer, 'preferred_language' | 'full_name' | 'phone' | 'location'>>) =>
    request<{ farmer: Farmer }>('/api/auth/preferences', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  // Dashboard
  getDashboard: () => request<DashboardData>('/api/dashboard'),

  // Farms
  getFarms: () => request<{ farms: Farm[] }>('/api/farms'),
  createFarm: (payload: Omit<Farm, 'id' | 'farmer_id' | 'created_at' | 'latitude' | 'longitude'>) =>
    request<{ farm: Farm }>('/api/farms', { method: 'POST', body: JSON.stringify(payload) }),
  updateFarm: (id: number, payload: Partial<Farm>) =>
    request<{ farm: Farm }>(`/api/farms/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteFarm: (id: number) => request<{ success: boolean }>(`/api/farms/${id}`, { method: 'DELETE' }),

  // Fields
  getFields: () => request<{ fields: Field[] }>('/api/fields'),
  createField: (payload: {
    farm_id: number;
    name: string;
    location: string;
    area_acres: number;
    soil_type: string;
    irrigation_method: string;
  }) => request<{ field: Field }>('/api/fields', { method: 'POST', body: JSON.stringify(payload) }),
  updateField: (id: number, payload: Partial<Field>) =>
    request<{ field: Field }>(`/api/fields/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteField: (id: number) => request<{ success: boolean }>(`/api/fields/${id}`, { method: 'DELETE' }),

  // Crops
  getCrops: () => request<{ crops: Crop[] }>('/api/crops'),
  createCrop: (payload: {
    field_id: number;
    crop_name: string;
    variety: string;
    planting_date: string;
    cultivation_stage: CultivationStage;
    status: 'active' | 'harvested';
    notes: string;
  }) => request<{ crop: Crop }>('/api/crops', { method: 'POST', body: JSON.stringify(payload) }),
  updateCrop: (id: number, payload: Partial<Crop>) =>
    request<{ crop: Crop }>(`/api/crops/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateCropStage: (id: number, cultivation_stage: CultivationStage, status?: 'active' | 'harvested') =>
    request<{ crop: Crop }>(`/api/crops/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ cultivation_stage, status }),
    }),
  deleteCrop: (id: number) => request<{ success: boolean }>(`/api/crops/${id}`, { method: 'DELETE' }),

  // Irrigations
  getIrrigations: () => request<{ irrigations: IrrigationRecord[] }>('/api/irrigations'),
  createIrrigation: (payload: {
    field_id: number;
    crop_id: number | null;
    irrigation_date: string;
    water_quantity_liters: number;
    frequency_days: number;
    next_scheduled_date?: string;
    method: string;
    notes: string;
  }) => request<{ irrigation: IrrigationRecord }>('/api/irrigations', { method: 'POST', body: JSON.stringify(payload) }),
  updateIrrigation: (id: number, payload: Partial<IrrigationRecord>) =>
    request<{ irrigation: IrrigationRecord }>(`/api/irrigations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteIrrigation: (id: number) => request<{ success: boolean }>(`/api/irrigations/${id}`, { method: 'DELETE' }),

  // Fertilizers
  getFertilizers: () => request<{ fertilizers: FertilizerRecord[] }>('/api/fertilizers'),
  createFertilizer: (payload: {
    field_id: number;
    crop_id: number | null;
    fertilizer_name: string;
    quantity_kg: number;
    application_date: string;
    notes: string;
  }) => request<{ fertilizer: FertilizerRecord }>('/api/fertilizers', { method: 'POST', body: JSON.stringify(payload) }),
  updateFertilizer: (id: number, payload: Partial<FertilizerRecord>) =>
    request<{ fertilizer: FertilizerRecord }>(`/api/fertilizers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteFertilizer: (id: number) => request<{ success: boolean }>(`/api/fertilizers/${id}`, { method: 'DELETE' }),

  // Pests
  getPests: () => request<{ pests: PestObservation[] }>('/api/pests'),
  analyzePestPhoto: (formData: FormData) =>
    request<{ diagnosis: PlantPhotoDiagnosis }>('/api/pests/analyze', { method: 'POST', body: formData }),
  createPest: (formData: FormData) =>
    request<{ pest: PestObservation }>('/api/pests', { method: 'POST', body: formData }),
  updatePest: (id: number, formData: FormData) =>
    request<{ pest: PestObservation }>(`/api/pests/${id}`, { method: 'PUT', body: formData }),
  deletePest: (id: number) => request<{ success: boolean }>(`/api/pests/${id}`, { method: 'DELETE' }),

  // Harvests
  getHarvests: () => request<{ harvests: HarvestRecord[] }>('/api/harvests'),
  createHarvest: (payload: {
    field_id: number;
    crop_id: number | null;
    status: 'planned' | 'in_progress' | 'completed';
    harvest_date: string;
    quantity_kg: number;
    quality_grade: string;
    notes: string;
  }) => request<{ harvest: HarvestRecord }>('/api/harvests', { method: 'POST', body: JSON.stringify(payload) }),
  updateHarvest: (id: number, payload: Partial<HarvestRecord>) =>
    request<{ harvest: HarvestRecord }>(`/api/harvests/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteHarvest: (id: number) => request<{ success: boolean }>(`/api/harvests/${id}`, { method: 'DELETE' }),

  // Weather & Alerts
  getWeather: () => request<{ reports: FarmWeatherReport[]; settings: WeatherAlertSettings }>('/api/weather'),
  updateWeatherSettings: (settings: WeatherAlertSettings) =>
    request<{ settings: WeatherAlertSettings }>('/api/weather/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  acknowledgeWeatherAlert: (alertKey: string) =>
    request<{ success: boolean }>('/api/weather/alerts/acknowledge', {
      method: 'POST',
      body: JSON.stringify({ alertKey }),
    }),

  // Google Maps Grounded Nearby Places
  searchNearbyPlaces: (payload: {
    query: string;
    farmId?: number;
    latitude?: number;
    longitude?: number;
    language?: LanguageCode;
  }) =>
    request<NearbyPlacesResponse>('/api/maps/nearby', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Public Website Endpoints (No Auth Required)
  getPublicWeather: (location: string) =>
    request<{ reports: FarmWeatherReport[]; settings: WeatherAlertSettings }>(
      `/api/public/weather?location=${encodeURIComponent(location)}`
    ),

  searchPublicNearbyPlaces: (payload: {
    query: string;
    locationText?: string;
    latitude?: number;
    longitude?: number;
    language?: LanguageCode;
  }) =>
    request<NearbyPlacesResponse>('/api/public/nearby', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  analyzePublicPlantPhoto: (formData: FormData) =>
    request<{ diagnosis: PlantPhotoDiagnosis }>('/api/public/plant-doctor/analyze', {
      method: 'POST',
      body: formData,
    }),

  translateDiagnosis: (diagnosis: PlantPhotoDiagnosis, targetLanguage: LanguageCode) =>
    request<{ diagnosis: PlantPhotoDiagnosis }>('/api/public/plant-doctor/translate', {
      method: 'POST',
      body: JSON.stringify({ diagnosis, targetLanguage }),
    }),

  translatePestRecords: (
    items: Array<{
      id: number;
      pest_or_disease: string;
      field_name: string;
      observation_notes: string;
      treatment_details: string;
    }>,
    targetLanguage: LanguageCode
  ) =>
    request<{
      translations: Record<
        number,
        {
          id: number;
          pest_or_disease: string;
          field_name: string;
          observation_notes: string;
          treatment_details: string;
        }
      >;
    }>('/api/public/plant-doctor/translate-records', {
      method: 'POST',
      body: JSON.stringify({ items, targetLanguage }),
    }),

  speakDiagnosis: (text: string, language: LanguageCode) =>
    request<{ audioBase64: string; mimeType: string; spokenText?: string }>('/api/public/plant-doctor/speak', {
      method: 'POST',
      body: JSON.stringify({ text, language }),
    }),
};
