import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { findDirectoryPlaces } from './agriDirectory.ts';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function formatGeminiError(err: unknown, fallback: string): string {
  const raw = err instanceof Error ? err.message : fallback;
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; status?: string } };
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // Raw message is plain text
  }
  return raw || fallback;
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

export interface NearbyPlacesResult {
  answer: string;
  places: GroundedPlace[];
  latitude: number;
  longitude: number;
  locationLabel: string;
}

const LANG_LABEL: Record<string, string> = {
  ar: 'Arabic (العربية)',
  as: 'Assamese (অসমীয়া)',
  bn: 'Bengali (বাংলা)',
  bho: 'Bhojpuri (भोजपुरी)',
  zh: 'Chinese (中文)',
  doi: 'Dogri (डोगरी)',
  en: 'English',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  gu: 'Gujarati (ગુજરાતી)',
  hi: 'Hindi (हिन्दी)',
  id: 'Indonesian (Bahasa Indonesia)',
  ja: 'Japanese (日本語)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ks: 'Kashmiri (कॉशुर)',
  kok: 'Konkani (कोंकणी)',
  ko: 'Korean (한국어)',
  mai: 'Maithili (मैथिली)',
  ml: 'Malayalam (മലയാളം)',
  mni: 'Manipuri (মৈতৈলোন্)',
  mr: 'Marathi (मराठी)',
  ne: 'Nepali (नेपाली)',
  or: 'Odia (ଓଡ଼ିଆ)',
  pt: 'Portuguese (Português)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  ru: 'Russian (Русский)',
  sa: 'Sanskrit (संस्कृतम्)',
  sat: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)',
  sd: 'Sindhi (सिन्धी)',
  es: 'Spanish (Español)',
  sw: 'Swahili (Kiswahili)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  ur: 'Urdu (اردو)',
};

function formatDirectorySummary(params: {
  places: GroundedPlace[];
  locationLabel: string;
  language: string;
  query: string;
}): string {
  const lines = params.places.map((p, idx) => {
    const dist = typeof p.distanceKm === 'number' ? ` (~${p.distanceKm} km)` : '';
    const details = [p.address, p.services, p.hours].filter(Boolean).join(' · ');
    return `${idx + 1}. ${p.title}${dist}\n   ${details}`;
  });

  const n = params.places.length;
  const loc = params.locationLabel;
  const q = params.query;

  const introByLang: Record<string, string> = {
    ar: `عرض ${n} أماكن قريبة لـ "${q}" بالقرب من ${loc}:`,
    as: `${loc} ৰ ওচৰত "${q}" ৰ বাবে ${n} টা স্থান:`,
    bn: `${loc}-এর কাছে "${q}"-এর জন্য ${n}টি কাছাকাছি স্থান:`,
    bho: `${loc} के नजदीक "${q}" खातिर ${n} गो जगह:`,
    zh: `在 ${loc} 附近为您找到 ${n} 个与“${q}”相关的地点：`,
    doi: `${loc} दे नेड़े "${q}" लेई ${n} थ्हान:`,
    en: `Showing ${n} nearby places for "${q}" around ${loc}:`,
    fr: `${n} lieux à proximité pour « ${q} » autour de ${loc} :`,
    de: `${n} Orte in der Nähe für „${q}“ bei ${loc}:`,
    gu: `${loc} નજીક "${q}" માટે ${n} નજીકના સ્થળો:`,
    hi: `${loc} के पास "${q}" के लिए ${n} नजदीकी स्थान:`,
    id: `Menampilkan ${n} lokasi terdekat untuk "${q}" di sekitar ${loc}:`,
    ja: `${loc} 周辺で「${q}」に一致する ${n} 件の場所：`,
    kn: `${loc} ಹತ್ತಿರ "${q}" ಗಾಗಿ ${n} ಸ್ಥಳಗಳು:`,
    ks: `${loc} نؠبر "${q}" باپتھ ${n} جاینہِ:`,
    kok: `${loc} लागसार "${q}" खातीर ${n} सुवाती:`,
    ko: `${loc} 주변 "${q}" 관련 ${n}개 장소:`,
    mai: `${loc} लग "${q}" लेल ${n} टा स्थान:`,
    ml: `${loc} സമീപം "${q}" നായുള്ള ${n} സ്ഥലങ്ങൾ:`,
    mni: `${loc} নক্নবা "${q}" গীদমক ${n} মফম:`,
    mr: `${loc} जवळ "${q}" साठी ${n} ठिकाणे:`,
    ne: `${loc} नजिक "${q}" का लागि ${n} स्थानहरू:`,
    or: `${loc} ନିକଟରେ "${q}" ପାଇଁ ${n}ଟି ସ୍ଥାନ:`,
    pt: `Mostrando ${n} locais próximos para "${q}" perto de ${loc}:`,
    pa: `${loc} ਦੇ ਨੇੜੇ "${q}" ਲਈ ${n} ਨੇੜਲੀਆਂ ਥਾਵਾਂ:`,
    ru: `Найдено ${n} ближайших мест по запросу «${q}» рядом с ${loc}:`,
    sa: `${loc} समीपे "${q}" कृते ${n} स्थानानि:`,
    sat: `${loc} ᱥᱩᱨ ᱨᱮ "${q}" ᱞᱟᱹᱜᱤᱫ ${n} ᱡᱟᱭᱜᱟ:`,
    sd: `${loc} جي ويجهو "${q}" لاءِ ${n} ويجهو جايون:`,
    es: `Mostrando ${n} lugares cercanos para "${q}" cerca de ${loc}:`,
    sw: `Inaonyesha maeneo ${n} ya karibu ya "${q}" karibu na ${loc}:`,
    ta: `${loc} அருகில் "${q}" தொடர்பான ${n} இடங்கள்:`,
    te: `${loc} దగ్గర "${q}" కోసం ${n} ప్రదేశాలు:`,
    ur: `${loc} کے قریب "${q}" کے لیے ${n} قریبی مقامات:`,
  };

  const intro = introByLang[params.language] || introByLang.en;
  return `${intro}\n\n${lines.join('\n\n')}`;
}

function buildDirectoryPlacesResult(params: {
  query: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  language: string;
}): NearbyPlacesResult {
  const { places: dirPlaces } = findDirectoryPlaces({
    query: params.query,
    locationLabel: params.locationLabel,
    latitude: params.latitude,
    longitude: params.longitude,
  });

  const places: GroundedPlace[] = dirPlaces.map((p) => ({
    title: p.title,
    uri: p.uri,
    directionsUri: p.directionsUri,
    category: p.category,
    address: p.address,
    distanceKm: p.distanceKm,
    services: p.services,
    hours: p.hours,
  }));

  return {
    answer: formatDirectorySummary({
      places,
      locationLabel: params.locationLabel,
      language: params.language,
      query: params.query,
    }),
    places,
    latitude: params.latitude,
    longitude: params.longitude,
    locationLabel: params.locationLabel,
  };
}

export async function findNearbyAgriPlaces(params: {
  query: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  language: string;
}): Promise<NearbyPlacesResult> {
  const directoryResult = buildDirectoryPlacesResult(params);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return directoryResult;
  }

  try {
    const ai = getGeminiClient();
    const langName = LANG_LABEL[params.language] || params.language || 'English';

    const prompt = [
      `The user is a farmer near ${params.locationLabel} (latitude ${params.latitude}, longitude ${params.longitude}).`,
      `Find accurate, currently operating agricultural places nearby for this request: "${params.query}".`,
      `Reply clearly in simple ${langName} so a farmer can easily understand addresses, distances or landmarks, and practical notes.`,
      `Do not invent place names or phone numbers; only mention real places found via Google Maps.`,
    ].join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: params.latitude,
              longitude: params.longitude,
            },
          },
        },
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const groundedPlaces: GroundedPlace[] = [];
    const seenUris = new Set<string>();

    for (const chunk of chunks) {
      const mapsInfo = (
        chunk as {
          maps?: {
            uri?: string;
            title?: string;
            placeId?: string;
            placeAnswerSources?: {
              reviewSnippets?: Array<{ reviewSnippet?: string } | string>;
            };
          };
        }
      ).maps;

      if (!mapsInfo?.uri) continue;
      if (seenUris.has(mapsInfo.uri)) continue;
      seenUris.add(mapsInfo.uri);

      const rawSnippets = mapsInfo.placeAnswerSources?.reviewSnippets ?? [];
      const snippets = rawSnippets
        .map((s) => (typeof s === 'string' ? s : s?.reviewSnippet || ''))
        .filter(Boolean);

      groundedPlaces.push({
        title: mapsInfo.title || 'Agricultural Location',
        uri: mapsInfo.uri,
        placeId: mapsInfo.placeId,
        reviewSnippets: snippets.length > 0 ? snippets : undefined,
      });
    }

    if (groundedPlaces.length === 0) {
      return directoryResult;
    }

    return {
      answer: response.text || directoryResult.answer,
      places: [...groundedPlaces, ...directoryResult.places.slice(0, 3)],
      latitude: params.latitude,
      longitude: params.longitude,
      locationLabel: params.locationLabel,
    };
  } catch {
    return directoryResult;
  }
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

function normalizeImageMimeType(rawMime?: string): string {
  const mime = (rawMime || '').trim().toLowerCase();
  if (mime === 'image/jpg' || mime === 'image/pjpeg') return 'image/jpeg';
  if (
    mime === 'image/jpeg' ||
    mime === 'image/png' ||
    mime === 'image/webp' ||
    mime === 'image/gif' ||
    mime === 'image/heic' ||
    mime === 'image/heif'
  ) {
    return mime;
  }
  return 'image/jpeg';
}

function parseDiagnosisJson(raw: string): Partial<PlantPhotoDiagnosis> {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  return JSON.parse(cleaned) as Partial<PlantPhotoDiagnosis>;
}

export async function analyzePlantPhotoWithGemini(params: {
  imageBase64: string;
  mimeType: string;
  cropName?: string;
  fieldAcres?: number;
  fieldSoilType?: string;
  language: string;
}): Promise<PlantPhotoDiagnosis> {
  const ai = getGeminiClient();
  const langName = LANG_LABEL[params.language] || params.language || 'English';
  const safeMimeType = normalizeImageMimeType(params.mimeType);
  const hints = [
    params.cropName?.trim() ? `The farmer says the crop may be: ${params.cropName.trim()}.` : '',
    params.fieldSoilType?.trim() ? `The field soil type is: ${params.fieldSoilType.trim()}.` : '',
    typeof params.fieldAcres === 'number' && Number.isFinite(params.fieldAcres) && params.fieldAcres > 0
      ? `The farmer's field size is ${params.fieldAcres} acres — please compute exact spray tanks and total medicine needed for ${params.fieldAcres} acres (plus per 1 acre reference).`
      : `Please give exact spray pump tank and total medicine calculations for 1 acre (and show how to scale per acre).`,
  ]
    .filter(Boolean)
    .join(' ');

  const isEnglish = params.language === 'en';
  const systemInstruction = [
    `You are an expert agricultural scientist and warm village plant doctor advising a farmer who may not have completed formal schooling.`,
    `Write EVERY single field strictly in simple, warm, everyday spoken ${langName} with thorough, actionable detail.`,
    !isEnglish
      ? `CRITICAL LANGUAGE RULE: Write 100% of every sentence, crop name, field type, step, calculation, and explanation exclusively in ${langName} script and words. Do NOT include English translations, English parentheticals, or English sentences. Write chemical/medicine names phonetically in ${langName} script so the voice reader speaks smoothly in ${langName} without switching to English.`
      : `Write in plain everyday English that any farmer can immediately understand.`,
    `Use practical village measurements: milliliters (ml), grams (g), bottle caps, or teaspoons per 15-liter spray pump tank and per 1 liter of water, plus exact total water liters, tanks, and total medicine needed for the field acreage.`,
    `Include exact best spraying hours (cool morning 6-9 AM or late afternoon 4-6 PM), spraying technique, and clear plant-protection precautions so leaves are never scorched or damaged.`,
    `If the photo shows a healthy plant or is slightly unclear, explain gently what you see, identify the crop and field type, and give safe preventive care or ask for a closer clear daylight photo of the leaf/stem.`,
  ].join(' ');

  const promptText = [
    `Look carefully at this uploaded plant photo. ${hints}`,
    `Act as an expert agricultural advisor and respond 100% in detailed yet easy-to-understand ${langName} covering all 6 parts:`,
    `1) Identify the specific crop/plant and the visible field/growing type (open irrigated row crop, paddy wetland, orchard, black/red soil rainfed plot, vegetable bed, or shade-net) and what disease, pest, or nutrient problem is present.`,
    `2) Recommend the appropriate medicine and exact dosage to treat the condition (why it helps and exact dose per 15-liter tank & per 1 liter water).`,
    `3) Suggest the correct pesticide/fungicide name and exact amount to use (plus organic neem option if suitable).`,
    `4) Provide a clear step-by-step calculation for the treatment (how many liters of water, how many 15-liter pump tanks, and total medicine to buy for 1 acre or the selected field acres).`,
    `5) Advise on the best time of day and method for spraying (morning/evening hours, nozzle mist, leaf undersides, step-by-step spraying).`,
    `6) List necessary precautions to prevent damage to the plant (avoiding midday leaf burn, no overdosing, soil moisture check, incompatible mixes) plus family/cattle safety and recovery care.`,
  ].join('\n');

  const attempts: Array<{ model: string; timeoutMs: number; thinkingLevel?: ThinkingLevel }> = [
    { model: 'gemini-4-hydrogen', timeoutMs: 12000, thinkingLevel: ThinkingLevel.LOW },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 16000, thinkingLevel: ThinkingLevel.MINIMAL },
    { model: 'gemini-2.5-flash', timeoutMs: 20000 },
  ];

  let parsed: Partial<PlantPhotoDiagnosis> | null = null;
  let lastError: unknown;

  for (let i = 0; i < attempts.length; i++) {
    const { model, timeoutMs, thinkingLevel } = attempts[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: safeMimeType,
                data: params.imageBase64,
              },
            },
            { text: promptText },
          ],
        },
        config: {
          abortSignal: AbortSignal.timeout(timeoutMs),
          systemInstruction,
          ...(thinkingLevel ? { thinkingConfig: { thinkingLevel } } : {}),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problemName: {
                type: Type.STRING,
                description: 'Short, clear name of the plant disease, pest, or health condition.',
              },
              detectedPlant: {
                type: Type.STRING,
                description: 'Specific crop/plant name and approximate growth stage seen in the photo.',
              },
              detectedFieldType: {
                type: Type.STRING,
                description:
                  'Field and growing environment type visible or inferred (e.g. Open Irrigated Vegetable Plot, Paddy Wetland, Rainfed Cotton/Pulse Field, Orchard, or Raised Bed).',
              },
              severity: {
                type: Type.STRING,
                description: 'Severity level: must be exactly one of low, medium, or high.',
              },
              whatIsHappening: {
                type: Type.STRING,
                description:
                  'Detailed expert explanation in simple words (3-5 sentences) describing what is affecting the plant and why the leaves/stems look like this.',
              },
              recommendedPesticide: {
                type: Type.STRING,
                description:
                  'Appropriate medicine & correct pesticide name(s) to buy at the farm shop (specific shop medicine + organic option if suitable) and why each treats the condition.',
              },
              howMuchToMix: {
                type: Type.STRING,
                description:
                  'Exact dosage per 15-liter backpack spray pump tank and per 1 liter of water using simple measures (ml, grams, bottle caps, or teaspoons).',
              },
              treatmentCalculation: {
                type: Type.STRING,
                description:
                  'Complete treatment math: total water liters, number of 15-liter spray tanks, and total ml/grams of medicine to buy per 1 acre (or for the farmer’s selected acres).',
              },
              bestTimeAndMethod: {
                type: Type.STRING,
                description:
                  'Best time of day to spray (e.g. 6-9 AM or 4-6 PM), weather check (no strong wind/rain), and spraying method summary.',
              },
              stepByStepSpraying: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  '4 to 5 crystal-clear step-by-step instructions on mixing in a bucket, filling the pump, and spraying under leaves & stems. Do not include leading step numbers.',
              },
              plantPrecautions: {
                type: Type.STRING,
                description:
                  'Necessary precautions specifically to prevent damage to the plant: avoid spraying in hot noon sun (prevents leaf scorching), do not exceed recommended dose, ensure soil has light moisture before spraying, and do not mix incompatible chemicals.',
              },
              recoverySchedule: {
                type: Type.STRING,
                description:
                  'Practical plant recovery timeline: removing badly diseased leaves, watering/drainage care, when to repeat spray (e.g. 7-10 days), and when healthy new growth appears.',
              },
              safetyTips: {
                type: Type.STRING,
                description:
                  'Farmer, family, and livestock safety: cloth over nose/mouth, soap handwashing, keeping cattle/children away, and pre-harvest waiting days.',
              },
              simpleSummaryText: {
                type: Type.STRING,
                description: 'Short 2-sentence plain summary of the crop, problem, and medicine for saving in farm records.',
              },
            },
            required: [
              'problemName',
              'detectedPlant',
              'detectedFieldType',
              'severity',
              'whatIsHappening',
              'recommendedPesticide',
              'howMuchToMix',
              'treatmentCalculation',
              'bestTimeAndMethod',
              'stepByStepSpraying',
              'plantPrecautions',
              'recoverySchedule',
              'safetyTips',
              'simpleSummaryText',
            ],
          },
        },
      });

      const rawText = (response.text || '').trim();
      if (!rawText) {
        throw new Error('Empty response received from plant analysis model.');
      }
      parsed = parseDiagnosisJson(rawText);
      break;
    } catch (err) {
      lastError = err;
      const errName = err instanceof Error ? err.name : '';
      const msg = formatGeminiError(err, '').toLowerCase();
      console.error(`[analyzePlantPhotoWithGemini] attempt ${i + 1} (${model}) failed:`, errName, msg || err);

      const isTransient =
        errName === 'TimeoutError' ||
        errName === 'AbortError' ||
        err instanceof SyntaxError ||
        msg.includes('high demand') ||
        msg.includes('unavailable') ||
        msg.includes('overloaded') ||
        msg.includes('503') ||
        msg.includes('429') ||
        msg.includes('rate') ||
        msg.includes('quota') ||
        msg.includes('timeout') ||
        msg.includes('timed out') ||
        msg.includes('abort') ||
        msg.includes('temporarily') ||
        msg.includes('fetch failed') ||
        msg.includes('empty response');

      if (!isTransient || i === attempts.length - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  if (!parsed) {
    if (lastError) throw lastError;
    throw new Error('Could not read diagnosis from Gemini response.');
  }

  const safeSeverity =
    parsed.severity === 'low' || parsed.severity === 'medium' || parsed.severity === 'high'
      ? parsed.severity
      : 'medium';

  return {
    problemName: String(parsed.problemName || 'Crop Leaf / Pest Problem').trim(),
    detectedPlant: String(parsed.detectedPlant || params.cropName || 'Crop Plant').trim(),
    detectedFieldType: String(parsed.detectedFieldType || params.fieldSoilType || 'Open Agricultural Field').trim(),
    severity: safeSeverity,
    whatIsHappening: String(parsed.whatIsHappening || '').trim(),
    recommendedPesticide: String(parsed.recommendedPesticide || '').trim(),
    howMuchToMix: String(parsed.howMuchToMix || '').trim(),
    treatmentCalculation: String(parsed.treatmentCalculation || '').trim(),
    bestTimeAndMethod: String(parsed.bestTimeAndMethod || '').trim(),
    stepByStepSpraying: Array.isArray(parsed.stepByStepSpraying)
      ? parsed.stepByStepSpraying
          .map((s) => String(s).trim().replace(/^\d+[.)]\s*/, ''))
          .filter(Boolean)
      : [],
    plantPrecautions: String(parsed.plantPrecautions || '').trim(),
    recoverySchedule: String(parsed.recoverySchedule || '').trim(),
    safetyTips: String(parsed.safetyTips || '').trim(),
    simpleSummaryText: String(parsed.simpleSummaryText || parsed.whatIsHappening || '').trim(),
  };
}

function isTransientGeminiError(err: unknown): boolean {
  const errName = err instanceof Error ? err.name : '';
  const msg = formatGeminiError(err, '').toLowerCase();
  return (
    errName === 'TimeoutError' ||
    errName === 'AbortError' ||
    err instanceof SyntaxError ||
    msg.includes('high demand') ||
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('rate') ||
    msg.includes('quota') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('abort') ||
    msg.includes('temporarily') ||
    msg.includes('fetch failed') ||
    msg.includes('empty response')
  );
}

export async function translateDiagnosisWithGemini(params: {
  diagnosis: PlantPhotoDiagnosis;
  targetLanguage: string;
}): Promise<PlantPhotoDiagnosis> {
  const ai = getGeminiClient();
  const langName = LANG_LABEL[params.targetLanguage] || params.targetLanguage || 'English';
  const isEnglish = params.targetLanguage === 'en';

  const attempts: Array<{ model: string; timeoutMs: number; thinkingLevel?: ThinkingLevel }> = [
    { model: 'gemini-4-hydrogen', timeoutMs: 10000, thinkingLevel: ThinkingLevel.LOW },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 14000, thinkingLevel: ThinkingLevel.MINIMAL },
    { model: 'gemini-2.5-flash', timeoutMs: 18000 },
  ];

  const prompt = [
    `Translate EVERY text value in this plant diagnosis JSON into natural, simple, everyday spoken ${langName} for a farmer.`,
    !isEnglish
      ? `CRITICAL: Write 100% of every field strictly in ${langName} script and everyday farmer words. Do NOT keep any English headings, sentences, or English parenthetical explanations. Phoneticize medicine/chemical names naturally in ${langName} script so text-to-speech speaks smoothly in ${langName}.`
      : `Write 100% in clear, simple, everyday English.`,
    `Keep severity strictly as one of: "low", "medium", or "high". Keep all numbers, liters, acres, tanks, and dosages accurate.`,
    JSON.stringify(params.diagnosis),
  ].join('\n\n');

  let parsed: Partial<PlantPhotoDiagnosis> | null = null;
  let lastError: unknown;

  for (let i = 0; i < attempts.length; i++) {
    const { model, timeoutMs, thinkingLevel } = attempts[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          abortSignal: AbortSignal.timeout(timeoutMs),
          ...(thinkingLevel ? { thinkingConfig: { thinkingLevel } } : {}),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problemName: { type: Type.STRING },
              detectedPlant: { type: Type.STRING },
              detectedFieldType: { type: Type.STRING },
              severity: { type: Type.STRING },
              whatIsHappening: { type: Type.STRING },
              recommendedPesticide: { type: Type.STRING },
              howMuchToMix: { type: Type.STRING },
              treatmentCalculation: { type: Type.STRING },
              bestTimeAndMethod: { type: Type.STRING },
              stepByStepSpraying: { type: Type.ARRAY, items: { type: Type.STRING } },
              plantPrecautions: { type: Type.STRING },
              recoverySchedule: { type: Type.STRING },
              safetyTips: { type: Type.STRING },
              simpleSummaryText: { type: Type.STRING },
            },
            required: [
              'problemName',
              'detectedPlant',
              'detectedFieldType',
              'severity',
              'whatIsHappening',
              'recommendedPesticide',
              'howMuchToMix',
              'treatmentCalculation',
              'bestTimeAndMethod',
              'stepByStepSpraying',
              'plantPrecautions',
              'recoverySchedule',
              'safetyTips',
              'simpleSummaryText',
            ],
          },
        },
      });
      const rawText = (response.text || '').trim();
      if (!rawText) throw new Error('Empty response received during diagnosis translation.');
      parsed = parseDiagnosisJson(rawText);
      break;
    } catch (err) {
      lastError = err;
      if (!isTransientGeminiError(err) || i === attempts.length - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  if (!parsed) {
    throw lastError || new Error('Could not translate diagnosis.');
  }

  return {
    problemName: String(parsed.problemName || params.diagnosis.problemName).trim(),
    detectedPlant: String(parsed.detectedPlant || params.diagnosis.detectedPlant).trim(),
    detectedFieldType: String(parsed.detectedFieldType || params.diagnosis.detectedFieldType).trim(),
    severity: params.diagnosis.severity,
    whatIsHappening: String(parsed.whatIsHappening || params.diagnosis.whatIsHappening).trim(),
    recommendedPesticide: String(parsed.recommendedPesticide || params.diagnosis.recommendedPesticide).trim(),
    howMuchToMix: String(parsed.howMuchToMix || params.diagnosis.howMuchToMix).trim(),
    treatmentCalculation: String(parsed.treatmentCalculation || params.diagnosis.treatmentCalculation).trim(),
    bestTimeAndMethod: String(parsed.bestTimeAndMethod || params.diagnosis.bestTimeAndMethod).trim(),
    stepByStepSpraying: Array.isArray(parsed.stepByStepSpraying) && parsed.stepByStepSpraying.length > 0
      ? parsed.stepByStepSpraying.map((s) => String(s).trim().replace(/^\d+[.)]\s*/, '')).filter(Boolean)
      : params.diagnosis.stepByStepSpraying,
    plantPrecautions: String(parsed.plantPrecautions || params.diagnosis.plantPrecautions).trim(),
    recoverySchedule: String(parsed.recoverySchedule || params.diagnosis.recoverySchedule).trim(),
    safetyTips: String(parsed.safetyTips || params.diagnosis.safetyTips).trim(),
    simpleSummaryText: String(parsed.simpleSummaryText || params.diagnosis.simpleSummaryText).trim(),
  };
}

export interface PestRecordTranslationInput {
  id: number;
  pest_or_disease: string;
  field_name: string;
  observation_notes: string;
  treatment_details: string;
}

export interface PestRecordTranslatedFields {
  id: number;
  pest_or_disease: string;
  field_name: string;
  observation_notes: string;
  treatment_details: string;
}

export async function translatePestRecordsWithGemini(params: {
  items: PestRecordTranslationInput[];
  targetLanguage: string;
}): Promise<Record<number, PestRecordTranslatedFields>> {
  if (params.items.length === 0) return {};
  const ai = getGeminiClient();
  const langName = LANG_LABEL[params.targetLanguage] || params.targetLanguage || 'English';
  const isEnglish = params.targetLanguage === 'en';

  const attempts: Array<{ model: string; timeoutMs: number; thinkingLevel?: ThinkingLevel }> = [
    { model: 'gemini-4-hydrogen', timeoutMs: 10000, thinkingLevel: ThinkingLevel.LOW },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 14000, thinkingLevel: ThinkingLevel.MINIMAL },
    { model: 'gemini-2.5-flash', timeoutMs: 18000 },
  ];

  const prompt = [
    `Translate every pest observation item's text fields (pest_or_disease, field_name, observation_notes, treatment_details) into simple, natural everyday ${langName} for a farmer.`,
    !isEnglish
      ? `Write 100% in ${langName} script and simple words. Keep empty strings empty. Preserve exact id numbers.`
      : `Write 100% in clear simple English. Keep empty strings empty. Preserve exact id numbers.`,
    JSON.stringify(params.items),
  ].join('\n\n');

  let parsedList: PestRecordTranslatedFields[] | null = null;
  let lastError: unknown;

  for (let i = 0; i < attempts.length; i++) {
    const { model, timeoutMs, thinkingLevel } = attempts[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          abortSignal: AbortSignal.timeout(timeoutMs),
          ...(thinkingLevel ? { thinkingConfig: { thinkingLevel } } : {}),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                pest_or_disease: { type: Type.STRING },
                field_name: { type: Type.STRING },
                observation_notes: { type: Type.STRING },
                treatment_details: { type: Type.STRING },
              },
              required: ['id', 'pest_or_disease', 'field_name', 'observation_notes', 'treatment_details'],
            },
          },
        },
      });
      const rawText = (response.text || '').trim();
      if (!rawText) throw new Error('Empty response received during record translation.');
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      parsedList = JSON.parse(cleaned) as PestRecordTranslatedFields[];
      break;
    } catch (err) {
      lastError = err;
      if (!isTransientGeminiError(err) || i === attempts.length - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  if (!parsedList || !Array.isArray(parsedList)) {
    throw lastError || new Error('Could not translate pest records.');
  }

  const map: Record<number, PestRecordTranslatedFields> = {};
  for (const item of parsedList) {
    if (typeof item.id === 'number') {
      map[item.id] = {
        id: item.id,
        pest_or_disease: String(item.pest_or_disease || '').trim(),
        field_name: String(item.field_name || '').trim(),
        observation_notes: String(item.observation_notes || '').trim(),
        treatment_details: String(item.treatment_details || '').trim(),
      };
    }
  }
  return map;
}

const LATIN_SCRIPT_LANGS = new Set(['en', 'fr', 'de', 'es', 'pt', 'id', 'sw']);

async function normalizeSpokenScriptForLanguage(text: string, targetLanguage: string): Promise<string> {
  const isLatinTarget = LATIN_SCRIPT_LANGS.has(targetLanguage);
  const hasEnglishWords = /[A-Za-z]{2,}/.test(text);
  const hasNonAscii = /[^\x00-\x7F]/.test(text);

  // Skip LLM normalization only when text clearly already matches pure target script:
  // - Pure English when target is 'en' and no non-ASCII scripts
  // - Non-Latin language (te, hi, ta, etc.) with zero Latin English words
  if ((targetLanguage === 'en' && !hasNonAscii) || (!isLatinTarget && hasNonAscii && !hasEnglishWords)) {
    return text;
  }

  const ai = getGeminiClient();
  const langName = LANG_LABEL[targetLanguage] || targetLanguage || 'English';

  const attempts: Array<{ model: string; timeoutMs: number; thinkingLevel?: ThinkingLevel }> = [
    { model: 'gemini-4-hydrogen', timeoutMs: 8000, thinkingLevel: ThinkingLevel.LOW },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 10000, thinkingLevel: ThinkingLevel.MINIMAL },
  ];

  const prompt = [
    `Convert and translate the following farming advice into 100% pure, warm, natural spoken ${langName} script so a farmer understands every word clearly when read aloud.`,
    targetLanguage !== 'en'
      ? `CRITICAL: Do NOT leave ANY English words, abbreviations like "ml" or "L", or English pesticide names in Roman letters — write everything (including numbers/units like milliliters, liters, acres, and medicine names) naturally in ${langName} script so the voice speaker speaks exclusively in ${langName}.`
      : `Write 100% in natural, easy-to-follow spoken English.`,
    `Return ONLY the clean spoken paragraph text, with no markdown or quotes.`,
    text,
  ].join('\n\n');

  for (const { model, timeoutMs, thinkingLevel } of attempts) {
    try {
      const resp = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          abortSignal: AbortSignal.timeout(timeoutMs),
          ...(thinkingLevel ? { thinkingConfig: { thinkingLevel } } : {}),
        },
      });
      const cleaned = (resp.text || '').trim();
      if (cleaned) return cleaned;
    } catch {
      // Try next fallback or return original text
    }
  }
  return text;
}

export async function synthesizeSpeechWithGemini(params: {
  text: string;
  language: string;
}): Promise<{ audioBase64: string; mimeType: string; spokenText: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  const ai = new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  const trimmed = params.text.trim().slice(0, 3200);
  if (!trimmed) {
    throw new Error('Text is required for audio readout.');
  }
  const langName = LANG_LABEL[params.language] || params.language || 'English';
  const spokenText = (await normalizeSpokenScriptForLanguage(trimmed, params.language)).slice(0, 3400);

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: spokenText,
            speechMetadata: {
              style: `Speak exclusively in natural, warm, clear, unhurried ${langName} like a helpful agricultural advisor talking directly to a farmer`,
            },
          },
        ],
      },
    ],
    config: {
      abortSignal: AbortSignal.timeout(25000),
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error('Could not generate spoken audio for this explanation.');
  }

  return {
    audioBase64: base64Audio,
    mimeType: 'audio/wav',
    spokenText,
  };
}
