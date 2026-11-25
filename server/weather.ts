export interface WeatherAlertSettings {
  max_temp_c: number;
  min_temp_c: number;
  heavy_rain_mm: number;
  high_wind_kmh: number;
  high_humidity_pct: number;
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

export interface GeneratedWeatherAlert {
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
  alerts: GeneratedWeatherAlert[];
}

interface GeoCoords {
  latitude: number;
  longitude: number;
}

const KNOWN_LOCATIONS: Record<string, GeoCoords> = {
  guntur: { latitude: 16.3067, longitude: 80.4365 },
  tenali: { latitude: 16.2428, longitude: 80.64 },
  vijayawada: { latitude: 16.5062, longitude: 80.648 },
  hyderabad: { latitude: 17.385, longitude: 78.4867 },
  warangal: { latitude: 17.9689, longitude: 79.5941 },
  narsampet: { latitude: 17.9285, longitude: 79.8942 },
  kurnool: { latitude: 15.8281, longitude: 78.0373 },
  tirupati: { latitude: 13.6288, longitude: 79.4192 },
  visakhapatnam: { latitude: 17.6868, longitude: 83.2185 },
  rajahmundry: { latitude: 17.0005, longitude: 81.804 },
  nellore: { latitude: 14.4426, longitude: 79.9865 },
  nizamabad: { latitude: 18.6725, longitude: 78.0941 },
  nagpur: { latitude: 21.1458, longitude: 79.0882 },
  pune: { latitude: 18.5204, longitude: 73.8567 },
  nashik: { latitude: 19.9975, longitude: 73.7898 },
  niphad: { latitude: 20.0751, longitude: 74.1072 },
  ludhiana: { latitude: 30.901, longitude: 75.8573 },
  jagraon: { latitude: 30.7885, longitude: 75.473 },
  patiala: { latitude: 30.3398, longitude: 76.3869 },
  karnal: { latitude: 29.6857, longitude: 76.9905 },
  indore: { latitude: 22.7196, longitude: 75.8577 },
  depalpur: { latitude: 22.8511, longitude: 75.5419 },
  bhopal: { latitude: 23.2599, longitude: 77.4126 },
  anand: { latitude: 22.5645, longitude: 72.9289 },
  petlad: { latitude: 22.4783, longitude: 72.8015 },
  ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
  surat: { latitude: 21.1702, longitude: 72.8311 },
  rajkot: { latitude: 22.3039, longitude: 70.8022 },
  jaipur: { latitude: 26.9124, longitude: 75.7873 },
  chomu: { latitude: 27.1636, longitude: 75.7219 },
  lucknow: { latitude: 26.8467, longitude: 80.9462 },
  malihabad: { latitude: 26.9204, longitude: 80.7131 },
  kanpur: { latitude: 26.4499, longitude: 80.3319 },
  varanasi: { latitude: 25.3176, longitude: 82.9739 },
  patna: { latitude: 25.5941, longitude: 85.1376 },
  bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  mysuru: { latitude: 12.2958, longitude: 76.6394 },
  nanjangud: { latitude: 12.119, longitude: 76.682 },
  coimbatore: { latitude: 11.0168, longitude: 76.9558 },
  madurai: { latitude: 9.9252, longitude: 78.1198 },
  thanjavur: { latitude: 10.787, longitude: 79.1378 },
  papanasam: { latitude: 10.9278, longitude: 79.269 },
  thrissur: { latitude: 10.5276, longitude: 76.2144 },
  raipur: { latitude: 21.2514, longitude: 81.6296 },
  cuttack: { latitude: 20.4625, longitude: 85.883 },
  guwahati: { latitude: 26.1445, longitude: 91.7362 },
};

const geocodeCache = new Map<string, GeoCoords>();
const weatherCache = new Map<string, { timestamp: number; data: { current: CurrentWeather; daily: DailyForecast[]; source: 'open-meteo' | 'fallback' } }>();
const WEATHER_TTL_MS = 15 * 60 * 1000;

export function describeWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Morning Fog';
  if (code >= 51 && code <= 57) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Moderate to Heavy Rain';
  if (code >= 66 && code <= 67) return 'Freezing Rain';
  if (code >= 71 && code <= 77) return 'Snow / Frost';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Fair Conditions';
}

export async function resolveLocationCoordinates(
  location: string,
  existingLat?: number | null,
  existingLon?: number | null
): Promise<GeoCoords> {
  if (typeof existingLat === 'number' && typeof existingLon === 'number' && !Number.isNaN(existingLat) && !Number.isNaN(existingLon)) {
    return { latitude: existingLat, longitude: existingLon };
  }

  const normalized = location.trim().toLowerCase();
  if (geocodeCache.has(normalized)) {
    return geocodeCache.get(normalized)!;
  }

  for (const [city, coords] of Object.entries(KNOWN_LOCATIONS)) {
    if (normalized.includes(city)) {
      geocodeCache.set(normalized, coords);
      return coords;
    }
  }

  const parts = location
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(part)}&count=1&language=en&format=json`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok) {
        const json = (await resp.json()) as { results?: Array<{ latitude: number; longitude: number }> };
        if (json.results && json.results.length > 0) {
          const coords = {
            latitude: Number(json.results[0].latitude.toFixed(4)),
            longitude: Number(json.results[0].longitude.toFixed(4)),
          };
          geocodeCache.set(normalized, coords);
          return coords;
        }
      }
    } catch {
      // Try next location part or fall back
    }
  }

  return KNOWN_LOCATIONS.guntur;
}

function buildFallbackForecast(lat: number, lon: number): { current: CurrentWeather; daily: DailyForecast[]; source: 'fallback' } {
  const seed = Math.abs(Math.round((lat + lon) * 10));
  const today = new Date();
  const daily: DailyForecast[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const wave = Math.sin((seed + i) * 0.9);
    const tempMax = Number((31 + wave * 4.5).toFixed(1));
    const tempMin = Number((22 + wave * 2.5).toFixed(1));
    const isRainy = (seed + i) % 5 === 2;
    const precipitationMm = isRainy ? Number((14 + (i % 3) * 4).toFixed(1)) : Number((i % 2 === 0 ? 0 : 1.2).toFixed(1));
    const weatherCode = isRainy ? 63 : i % 3 === 0 ? 1 : 0;
    daily.push({
      date: d.toISOString().slice(0, 10),
      weatherCode,
      condition: describeWeatherCode(weatherCode),
      tempMax,
      tempMin,
      precipitationMm,
      precipitationProb: isRainy ? 78 : 15,
      windMaxKmh: Number((12 + ((seed + i) % 15)).toFixed(1)),
    });
  }

  return {
    source: 'fallback',
    current: {
      temperatureC: daily[0].tempMax - 3,
      humidityPct: 68 + (seed % 16),
      windSpeedKmh: daily[0].windMaxKmh - 2,
      precipitationMm: daily[0].precipitationMm,
      weatherCode: daily[0].weatherCode,
      condition: daily[0].condition,
      observedAt: new Date().toISOString(),
    },
    daily,
  };
}

export async function fetchForecastForCoords(
  latitude: number,
  longitude: number
): Promise<{ current: CurrentWeather; daily: DailyForecast[]; source: 'open-meteo' | 'fallback' }> {
  const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < WEATHER_TTL_MS) {
    return cached.data;
  }

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=auto&forecast_days=7`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (resp.ok) {
      const json = (await resp.json()) as {
        current?: {
          time: string;
          temperature_2m: number;
          relative_humidity_2m: number;
          precipitation: number;
          weather_code: number;
          wind_speed_10m: number;
        };
        daily?: {
          time: string[];
          weather_code: number[];
          temperature_2m_max: number[];
          temperature_2m_min: number[];
          precipitation_sum: number[];
          precipitation_probability_max: number[];
          wind_speed_10m_max: number[];
        };
      };

      if (json.current && json.daily && json.daily.time.length > 0) {
        const daily: DailyForecast[] = json.daily.time.map((date, idx) => {
          const code = json.daily!.weather_code[idx] ?? 0;
          return {
            date,
            weatherCode: code,
            condition: describeWeatherCode(code),
            tempMax: Number((json.daily!.temperature_2m_max[idx] ?? 30).toFixed(1)),
            tempMin: Number((json.daily!.temperature_2m_min[idx] ?? 20).toFixed(1)),
            precipitationMm: Number((json.daily!.precipitation_sum[idx] ?? 0).toFixed(1)),
            precipitationProb: Math.round(json.daily!.precipitation_probability_max[idx] ?? 0),
            windMaxKmh: Number((json.daily!.wind_speed_10m_max[idx] ?? 10).toFixed(1)),
          };
        });

        const currentCode = json.current.weather_code ?? 0;
        const result = {
          source: 'open-meteo' as const,
          current: {
            temperatureC: Number((json.current.temperature_2m ?? 28).toFixed(1)),
            humidityPct: Math.round(json.current.relative_humidity_2m ?? 65),
            windSpeedKmh: Number((json.current.wind_speed_10m ?? 10).toFixed(1)),
            precipitationMm: Number((json.current.precipitation ?? 0).toFixed(1)),
            weatherCode: currentCode,
            condition: describeWeatherCode(currentCode),
            observedAt: json.current.time || new Date().toISOString(),
          },
          daily,
        };

        weatherCache.set(cacheKey, { timestamp: Date.now(), data: result });
        return result;
      }
    }
  } catch {
    // Fall through to deterministic offline weather model
  }

  const fallback = buildFallbackForecast(latitude, longitude);
  weatherCache.set(cacheKey, { timestamp: Date.now(), data: fallback });
  return fallback;
}

export function evaluateFarmWeatherAlerts(params: {
  farmId: number;
  farmName: string;
  current: CurrentWeather;
  daily: DailyForecast[];
  settings: WeatherAlertSettings;
  fieldNames: string[];
  dueIrrigationFieldNames: string[];
  activeCropNames: string[];
}): GeneratedWeatherAlert[] {
  const { farmId, farmName, current, daily, settings, fieldNames, dueIrrigationFieldNames, activeCropNames } = params;
  const alerts: GeneratedWeatherAlert[] = [];
  const nextThreeDays = daily.slice(0, 3);

  // 1. Heavy Rain Alert
  const rainyDay = nextThreeDays.find((d) => d.precipitationMm >= settings.heavy_rain_mm);
  if (rainyDay) {
    const affected = dueIrrigationFieldNames.length > 0 ? dueIrrigationFieldNames : fieldNames;
    alerts.push({
      alertKey: `heavy_rain:${farmId}:${rainyDay.date}`,
      farmId,
      farmName,
      alertType: 'heavy_rain',
      severity: rainyDay.precipitationMm >= settings.heavy_rain_mm * 2 ? 'critical' : 'warning',
      title: `Heavy rainfall expected (${rainyDay.precipitationMm} mm)`,
      message: `Forecast predicts ${rainyDay.precipitationMm} mm rain (${rainyDay.precipitationProb}% probability) on ${rainyDay.date} at ${farmName}.`,
      recommendedAction:
        dueIrrigationFieldNames.length > 0
          ? `Delay scheduled irrigation on ${dueIrrigationFieldNames.join(', ')} and clear field drainage bunds.`
          : 'Check field drainage channels and avoid basal fertilizer application right before downpour.',
      alertDate: rainyDay.date,
      affectedFields: affected,
    });
  }

  // 2. Heat Stress Alert
  const hotDay = nextThreeDays.find((d) => d.tempMax >= settings.max_temp_c);
  if (hotDay) {
    alerts.push({
      alertKey: `heat_stress:${farmId}:${hotDay.date}`,
      farmId,
      farmName,
      alertType: 'heat_stress',
      severity: hotDay.tempMax >= settings.max_temp_c + 3 ? 'critical' : 'warning',
      title: `High temperature alert (${hotDay.tempMax}°C)`,
      message: `Peak daytime temperature reaches ${hotDay.tempMax}°C on ${hotDay.date}. High evapotranspiration may stress ${activeCropNames.slice(0, 2).join(' & ') || 'active crops'}.`,
      recommendedAction: 'Schedule drip or sprinkler irrigation before 8:00 AM or after 5:30 PM to minimize evaporation.',
      alertDate: hotDay.date,
      affectedFields: fieldNames,
    });
  }

  // 3. Frost / Cold Snap Alert
  const coldDay = nextThreeDays.find((d) => d.tempMin <= settings.min_temp_c);
  if (coldDay) {
    alerts.push({
      alertKey: `frost_risk:${farmId}:${coldDay.date}`,
      farmId,
      farmName,
      alertType: 'frost_risk',
      severity: coldDay.tempMin <= 2 ? 'critical' : 'warning',
      title: `Low temperature / frost risk (${coldDay.tempMin}°C)`,
      message: `Nighttime temperatures could drop to ${coldDay.tempMin}°C on ${coldDay.date} at ${farmName}.`,
      recommendedAction: 'Protect young nursery beds or newly germinated plots with mulch or evening light irrigation.',
      alertDate: coldDay.date,
      affectedFields: fieldNames,
    });
  }

  // 4. High Wind Spraying Warning
  const windyDay = nextThreeDays.find((d) => d.windMaxKmh >= settings.high_wind_kmh);
  if (windyDay) {
    alerts.push({
      alertKey: `high_wind:${farmId}:${windyDay.date}`,
      farmId,
      farmName,
      alertType: 'high_wind',
      severity: 'warning',
      title: `Strong wind advisory (${windyDay.windMaxKmh} km/h)`,
      message: `Gusts up to ${windyDay.windMaxKmh} km/h forecasted on ${windyDay.date} at ${farmName}.`,
      recommendedAction: 'Postpone foliar fertilizer or pesticide spraying to prevent spray drift and uneven coverage.',
      alertDate: windyDay.date,
      affectedFields: fieldNames,
    });
  }

  // 5. Fungal / Disease Humidity Alert
  if (current.humidityPct >= settings.high_humidity_pct && current.temperatureC >= 18) {
    const todayStr = daily[0]?.date || new Date().toISOString().slice(0, 10);
    alerts.push({
      alertKey: `fungal_risk:${farmId}:${todayStr}`,
      farmId,
      farmName,
      alertType: 'fungal_risk',
      severity: 'info',
      title: `Elevated humidity (${current.humidityPct}%) — Pest & fungal watch`,
      message: `Warm and humid conditions (${current.humidityPct}% RH, ${current.temperatureC}°C) favor leaf blight, mildew, and sap-sucking pests.`,
      recommendedAction: 'Inspect lower leaves across active fields and log any early spots in Pest & Disease Monitoring.',
      alertDate: todayStr,
      affectedFields: fieldNames,
    });
  }

  // 6. Dry Spell + Due Irrigation Alert
  const weekRain = daily.reduce((sum, d) => sum + d.precipitationMm, 0);
  if (weekRain < 2 && dueIrrigationFieldNames.length > 0) {
    const todayStr = daily[0]?.date || new Date().toISOString().slice(0, 10);
    alerts.push({
      alertKey: `dry_spell:${farmId}:${todayStr}`,
      farmId,
      farmName,
      alertType: 'dry_spell',
      severity: 'info',
      title: 'Dry 7-day outlook with pending irrigation',
      message: `Minimal rainfall (${weekRain.toFixed(1)} mm) expected this week while ${dueIrrigationFieldNames.length} field(s) have irrigation due.`,
      recommendedAction: `Prioritize scheduled watering for ${dueIrrigationFieldNames.join(', ')}.`,
      alertDate: todayStr,
      affectedFields: dueIrrigationFieldNames,
    });
  }

  return alerts;
}
