import { EXTRA_FRUIT_CROPS } from './extraCropsFruits';
import { EXTRA_VEG_AND_FIELD_CROPS } from './extraCropsVegAndMore';
import type { CropCategory, CropGuideProfile } from './cropTypes';

export type { CropCategory, CropGuideProfile };

export const CROP_CATEGORIES: Array<{
  id: 'all' | CropCategory;
  emoji: string;
  labels: { en: string; te: string; hi: string };
}> = [
  { id: 'all', emoji: '🌱', labels: { en: 'All Crops', te: 'అన్ని పంటలు', hi: 'सभी फसलें' } },
  { id: 'vegetables', emoji: '🍅', labels: { en: 'Vegetables', te: 'కూరగాయలు', hi: 'सब्जियाँ' } },
  { id: 'fruits', emoji: '🥭', labels: { en: 'Fruits', te: 'పండ్లు', hi: 'फल' } },
  { id: 'cereals', emoji: '🌾', labels: { en: 'Grains & Millets', te: 'ధాన్యాలు', hi: 'अनाज और बाजरा' } },
  { id: 'pulses_oilseeds', emoji: '🥜', labels: { en: 'Pulses & Oilseeds', te: 'పప్పులు & నూనె గింజలు', hi: 'दालें और तिलहन' } },
  { id: 'spices', emoji: '🌶️', labels: { en: 'Spices', te: 'సుగంధ ద్రవ్యాలు', hi: 'मसाले' } },
  { id: 'cash_crops', emoji: '🎋', labels: { en: 'Cash Crops', te: 'వాణిజ్య పంటలు', hi: 'नकदी फसलें' } },
];

const BASE_CROP_CATEGORY_MAP: Record<string, CropCategory> = {
  paddy: 'cereals',
  chili: 'spices',
  cotton: 'cash_crops',
  maize: 'cereals',
  turmeric: 'spices',
  tomato: 'vegetables',
  wheat: 'cereals',
  groundnut: 'pulses_oilseeds',
  sugarcane: 'cash_crops',
  onion: 'vegetables',
  potato: 'vegetables',
  soybean: 'pulses_oilseeds',
};

const BASE_CROP_GUIDES: CropGuideProfile[] = [
  {
    id: 'paddy',
    emoji: '🌾',
    names: { en: 'Paddy (Rice)', te: 'వరి (బియ్యం)', hi: 'धान (चावल)' },
    defaultVariety: 'BPT-5204 Samba Masuri',
    bestSeason: {
      en: 'Kharif (Jun–Nov) & Rabi (Dec–Apr)',
      te: 'ఖరీఫ్ (జూన్–నవం) & రబీ (డిసెం–ఏప్రి)',
      hi: 'खरीफ (जून–नवंबर) और रबी (दिसंबर–अप्रैल)',
    },
    plantation: {
      seedRateKgPerAcre: 25,
      spacing: '20 cm × 15 cm',
      depthCm: '2–3 cm',
      tip: {
        en: 'Prepare a smooth leveled field. Soak seeds for 24 hours before nursery sowing, then transplant healthy 21-day seedlings.',
        te: 'పొలాన్ని సమంగా తయారు చేయండి. విత్తనాలను 24 గంటలు నానబెట్టి నారుమడిలో చల్లి, 21 రోజుల తర్వాత నాట్లు వేయండి.',
        hi: 'खेत को समतल बनाएं। बुवाई से पहले बीज को 24 घंटे भिगोएं और 21 दिन की स्वस्थ पौध की रोपाई करें।',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 8000,
      method: 'Canal Flood',
      tip: {
        en: 'Keep 2–5 cm shallow standing water during active growth. Drain water 10 days before harvesting.',
        te: 'పెరుగుదల సమయంలో 2–5 సెం.మీ నీరు ఉంచండి. కోతకు 10 రోజుల ముందు నీటిని బయటకు పంపండి.',
        hi: 'बढ़वार के समय 2–5 सेमी पानी बनाए रखें। कटाई से 10 दिन पहले खेत से पानी निकाल दें।',
      },
    },
    fertilizers: [
      { stage: 'At Planting (Basal)', name: 'DAP + Potash', kgPerAcre: 45, timing: 'Day 0–3' },
      { stage: 'Vegetative Growth', name: 'Urea (46% N)', kgPerAcre: 35, timing: 'Day 25–30' },
      { stage: 'Panicle / Flowering', name: 'Urea + Potash', kgPerAcre: 30, timing: 'Day 50–55' },
    ],
    pests: [
      {
        name: 'Stem Borer',
        observationSign: {
          en: 'Central leaf shoots dry up and turn yellow ("dead heart") or white empty earheads.',
          te: 'మధ్య ఆకులు ఎండిపోయి పసుపు రంగులోకి మారడం లేదా తెల్ల కంకులు రావడం.',
          hi: 'बीच की कोंपल सूखकर पीली पड़ना या सफेद खाली बालियाँ दिखना।',
        },
        treatment: {
          en: 'Install pheromone traps (4 per acre) and spray Neem oil or recommended biological control.',
          te: 'ఎకరాకు 4 లింగాకర్షక బుట్టలు పెట్టండి మరియు వేప నూనె పిచికారీ చేయండి.',
          hi: 'प्रति एकड़ 4 फेरोमोन ट्रैप लगाएं और नीम तेल का छिड़काव करें।',
        },
      },
      {
        name: 'Brown Planthopper',
        observationSign: {
          en: 'Small brown insects at plant base causing circular yellow dried patches ("hopper burn").',
          te: 'మొక్క మొదట్లో గోధుమ రంగు పురుగులు ఉండి పొలం గుండ్రంగా ఎండిపోవడం.',
          hi: 'पौधे के निचले हिस्से में भूरे कीड़े दिखना और फसल का गोल पैच में सूखना।',
        },
        treatment: {
          en: 'Drain standing water for 3–4 days to let sunlight hit the base and spray safe recommended control.',
          te: '3–4 రోజులు నీటిని తీసివేసి మొక్కల మొదళ్ళకు ఎండ తగిలేలా చేయండి.',
          hi: '3–4 दिन खेत से पानी निकालें ताकि जड़ों तक धूप पहुंचे और सुरक्षित दवा का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '120–135 days',
      expectedYieldKgPerAcre: 2400,
      readinessSigns: {
        en: '80–85% of grains turn golden yellow and feel hard when pressed between fingers.',
        te: '80–85% గింజలు బంగారు పసుపు రంగులోకి మారి గట్టిపడినప్పుడు కోతకు సిద్ధం.',
        hi: 'जब 80–85% दाने सुनहरे पीले हो जाएं और दबाने पर सख्त लगें तो कटाई करें।',
      },
      storageTip: {
        en: 'Sun-dry paddy grains until moisture drops below 14% before bagging.',
        te: 'సంచులలో నింపే ముందు గింజల తేమ 14% కంటే తక్కువయ్యే వరకు ఎండలో ఆరబెట్టండి.',
        hi: 'बोरों में भरने से पहले दानों को धूप में सुखाकर नमी 14% से कम करें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid spraying during heavy rain or wind over 20 km/h. Maintain bund height during monsoon.',
      te: 'భారీ వర్షం లేదా ఎక్కువ గాలి ఉన్నప్పుడు మందులు చల్లవద్దు. వర్షాకాలంలో గట్లు బలంగా ఉంచండి.',
      hi: 'तेज बारिश या हवा के समय छिड़काव न करें। बारिश में मेड़ें मजबूत रखें।',
    },
    stagesInfo: {
      land_preparation: {
        days: 'Day 1–10',
        action: { en: 'Plough twice, puddle soil, and level the field evenly.', te: 'రెండు సార్లు దున్ని, బురద చేసి పొలాన్ని సమం చేయండి.', hi: 'दो बार जुताई करें, कीचड़ मचाएं और खेत समतल करें।' },
      },
      sowing: {
        days: 'Day 11–25',
        action: { en: 'Sow treated seeds in nursery or transplant 21-day seedlings.', te: 'నారుమడిలో విత్తనాలు చల్లండి లేదా 21 రోజుల నారు నాటండి.', hi: 'नर्सरी में बीज बोएं या 21 दिन की पौध लगाएं।' },
      },
      germination: {
        days: 'Day 26–35',
        action: { en: 'Keep soil moist (not flooded) so young roots grip firmly.', te: 'మొక్కలు వేర్లు పట్టే వరకు నేలను తేమగా ఉంచండి.', hi: 'जड़ें जमने तक खेत में हल्की नमी रखें, ज्यादा पानी न भरें।' },
      },
      vegetative_growth: {
        days: 'Day 36–65',
        action: { en: 'Remove weeds, apply Urea top-dressing, and check for leaf pests.', te: 'కలుపు తీసి, యూరియా వేసి ఆకు పురుగులను గమనించండి.', hi: 'खरपतवार निकालें, यूरिया डालें और पत्तियों की जांच करें।' },
      },
      flowering: {
        days: 'Day 66–95',
        action: { en: 'Keep steady 3 cm water; never let the field dry during flowering.', te: 'పూత దశలో 3 సెం.మీ నీరు నిరంతరం ఉండేలా చూడండి.', hi: 'फूल आने पर 3 सेमी पानी बनाए रखें; खेत को सूखने न दें।' },
      },
      maturity: {
        days: 'Day 96–115',
        action: { en: 'Grains fill and turn golden. Drain field water 10 days before harvest.', te: 'గింజలు బంగారు రంగులోకి మారుతాయి. కోతకు 10 రోజుల ముందు నీరు ఆపండి.', hi: 'दाने सुनहरे होने लगते हैं। कटाई से 10 दिन पहले पानी बंद करें।' },
      },
      harvesting: {
        days: 'Day 116–135',
        action: { en: 'Cut crop, thresh grains cleanly, and sun-dry before storing.', te: 'పంట కోసి, నూర్పిడి చేసి, గింజలను బాగా ఆరబెట్టి నిల్వ చేయండి.', hi: 'फसल काटें, मड़ाई करें और सुखाकर भंडारण करें।' },
      },
    },
  },
  {
    id: 'chili',
    emoji: '🌶️',
    names: { en: 'Chili Pepper', te: 'మిరప', hi: 'मिर्च' },
    defaultVariety: 'Guntur Sannam S4',
    bestSeason: {
      en: 'Kharif (Jul–Aug planting) & Rabi',
      te: 'ఖరీఫ్ (జూలై–ఆగస్టు) & రబీ',
      hi: 'खरीफ (जुलाई–अगस्त) और रबी',
    },
    plantation: {
      seedRateKgPerAcre: 1,
      spacing: '60 cm × 45 cm',
      depthCm: '1–2 cm',
      tip: {
        en: 'Raise seedlings on raised nursery beds for 35 days. Transplant in the evening and water immediately.',
        te: 'ఎత్తైన నారుమడిలో 35 రోజులు నారు పెంచండి. సాయంత్రం వేళ నాట్లు వేసి వెంటనే నీరు పెట్టండి.',
        hi: 'ऊंची क्यारियों में 35 दिन तक पौध तैयार करें। शाम के समय रोपाई कर तुरंत पानी दें।',
      },
    },
    irrigation: {
      frequencyDays: 4,
      litersPerAcre: 3600,
      method: 'Drip',
      tip: {
        en: 'Chili hates waterlogging! Use drip or light furrow irrigation every 3–5 days.',
        te: 'మిరపకు నీరు నిలవకూడదు! డ్రిప్ ద్వారా ప్రతి 3–5 రోజులకు ఒకసారి తేలికపాటి నీరు పెట్టండి.',
        hi: 'मिर्च में पानी बिल्कुल न भरने दें! हर 3–5 दिन में ड्रिप से हल्की सिंचाई करें।',
      },
    },
    fertilizers: [
      { stage: 'Basal Bed Prep', name: 'Vermicompost + DAP', kgPerAcre: 120, timing: 'At planting' },
      { stage: 'Branching Stage', name: 'NPK 19-19-19', kgPerAcre: 20, timing: 'Day 25 & 45' },
      { stage: 'Flowering & Fruit', name: 'Potassium Nitrate + Boron', kgPerAcre: 15, timing: 'Day 65 & 85' },
    ],
    pests: [
      {
        name: 'Chili Thrips (Leaf Curl)',
        observationSign: {
          en: 'Young top leaves curl upward like small boats and look silvery underneath.',
          te: 'చిగురు ఆకులు పైకి ముడుచుకుని, కింది భాగం వెండి రంగులో కనిపిస్తాయి.',
          hi: 'ऊपरी नई पत्तियाँ ऊपर की ओर मुड़ने लगती हैं और नीचे चांदी जैसी चमक दिखती है।',
        },
        treatment: {
          en: 'Place 8 blue sticky traps per acre and spray Neem oil 1500ppm early morning.',
          te: 'ఎకరాకు 8 నీలం జిగురు అట్టలు పెట్టి ఉదయాన్నే వేప నూనె పిచికారీ చేయండి.',
          hi: 'प्रति एकड़ 8 नीले चिपचिपे ट्रैप लगाएं और सुबह नीम तेल का छिड़काव करें।',
        },
      },
      {
        name: 'Fruit Rot / Dieback',
        observationSign: {
          en: 'Dark sunken water-soaked spots on ripe pods and drying of branch tips.',
          te: 'పండు కాయలపై నల్లని గుంట మచ్చలు రావడం మరియు కొమ్మల చివర్లు ఎండిపోవడం.',
          hi: 'पकी मिर्च पर काले धंसे हुए धब्बे पड़ना और टहनियों का ऊपर से सूखना।',
        },
        treatment: {
          en: 'Pick and destroy infected pods immediately; avoid overhead watering during humid evenings.',
          te: 'తెగులు సోకిన కాయలను వెంటనే తీసి నాశనం చేయండి; సాయంత్రం నీరు చల్లవద్దు.',
          hi: 'संक्रमित फलों को तुरंत हटाएं और अधिक नमी में ऊपर से पानी न दें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '130–160 days (multiple pickings)',
      expectedYieldKgPerAcre: 1800,
      readinessSigns: {
        en: 'Pick green chilies at full firm size or wait until pods turn deep bright red for dry chili.',
        te: 'పచ్చిమిర్చి కోసం కాయలు గట్టిపడినప్పుడు, ఎండుమిర్చి కోసం పూర్తిగా ఎర్రబడిన తర్వాత కోయండి.',
        hi: 'हरी मिर्च के लिए पूरी बड़ी होने पर, और सूखी मिर्च के लिए गहरा लाल रंग आने पर तुड़ाई करें।',
      },
      storageTip: {
        en: 'Dry red chilies on clean tarpaulin sheets for 7–10 days until stems snap cleanly.',
        te: 'ఎర్ర మిరపకాయలను శుభ్రమైన పట్టాలపై 7–10 రోజులు ఎండబెట్టి నిల్వ చేయండి.',
        hi: 'लाल मिर्च को साफ तिरपाल पर 7–10 दिन सुखाएं जब तक डंठल आसानी से न टूटें।',
      },
    },
    weatherAdvice: {
      en: 'High humidity increases fungal spots and thrips. Ensure good drainage after heavy rain.',
      te: 'అధిక తేమ వల్ల మచ్చ తెగులు, తామర పురుగులు పెరుగుతాయి. వర్షం తర్వాత నీరు బయటకు పంపండి.',
      hi: 'अधिक नमी से फफूंद और थ्रिप्स बढ़ते हैं। भारी बारिश के बाद पानी तुरंत निकालें।',
    },
    stagesInfo: {
      land_preparation: {
        days: 'Day 1–12',
        action: { en: 'Plough deeply, mix compost, and make raised ridges for drainage.', te: 'లోతుగా దున్ని కంపోస్టు వేసి బోదెలు చేయండి.', hi: 'गहरी जुताई कर खाद मिलाएं और जल निकासी के लिए मेड़ें बनाएं।' },
      },
      sowing: {
        days: 'Day 13–35',
        action: { en: 'Grow seedlings in protected nursery, then transplant onto ridges.', te: 'నారుమడిలో పెంచి 35 రోజుల తర్వాత బోదెలపై నాటండి.', hi: 'नर्सरी में पौध उगाकर मेड़ों पर रोपाई करें।' },
      },
      germination: {
        days: 'Day 36–45',
        action: { en: 'Give light daily moisture until transplanted seedlings stand firm.', te: 'నాటిన మొక్కలు నిలబడే వరకు ప్రతిరోజూ తేలికపాటి తేమ ఉంచండి.', hi: 'रोपाई के बाद पौधे जमने तक हल्की नमी बनाए रखें।' },
      },
      vegetative_growth: {
        days: 'Day 46–75',
        action: { en: 'Weed between rows, earth up soil around stems, and watch for leaf curl.', te: 'కలుపు తీసి, మొక్కల చుట్టూ మట్టి ఎగదోసి ఆకు ముడుతను గమనించండి.', hi: 'निराई-गुड़ाई करें, तनों पर मिट्टी चढ़ाएं और पत्तियों की जांच करें।' },
      },
      flowering: {
        days: 'Day 76–105',
        action: { en: 'Avoid water stress during flowering so flowers do not drop.', te: 'పూత రాలకుండా ఈ దశలో సరైన తేమ ఉండేలా నీరు ఇవ్వండి.', hi: 'फूल झड़ने से रोकने के लिए सिंचाई में नियमितता रखें।' },
      },
      maturity: {
        days: 'Day 106–130',
        action: { en: 'Pods swell and change from green to bright red.', te: 'కాయలు పెరిగి ఆకుపచ్చ నుండి ఎరుపు రంగులోకి మారుతాయి.', hi: 'मिर्च पूरी विकसित होकर हरी से चमकदार लाल होने लगती है।' },
      },
      harvesting: {
        days: 'Day 131–165',
        action: { en: 'Pick ripe pods every 10–12 days and dry cleanly on mats.', te: 'ప్రతి 10–12 రోజులకు పండిన కాయలు కోసి శుభ్రంగా ఎండబెట్టండి.', hi: 'हर 10–12 दिन में पकी मिर्च तोड़ें और साफ सतह पर सुखाएं।' },
      },
    },
  },
  {
    id: 'cotton',
    emoji: '☁️',
    names: { en: 'Cotton', te: 'పత్తి', hi: 'कपास' },
    defaultVariety: 'Mallika Bt-II',
    bestSeason: {
      en: 'Kharif (June–July onset of monsoon)',
      te: 'ఖరీఫ్ (జూన్–జూలై తొలకరి వర్షాలు)',
      hi: 'खरीफ (जून–जुलाई मानसून की शुरुआत)',
    },
    plantation: {
      seedRateKgPerAcre: 2,
      spacing: '90 cm × 60 cm',
      depthCm: '3–4 cm',
      tip: {
        en: 'Sow 1–2 seeds per hill after good soaking rain. Thin weak extra plants at 15 days.',
        te: 'మంచి వర్షం పడిన తర్వాత గుంటకు 1–2 విత్తనాలు నాటండి. 15 రోజులకు బలహీన మొక్కలను తీసేయండి.',
        hi: 'अच्छी बारिश के बाद 1–2 बीज प्रति स्थान बोएं। 15 दिन में कमजोर पौधे हटा दें।',
      },
    },
    irrigation: {
      frequencyDays: 10,
      litersPerAcre: 4200,
      method: 'Sprinkler / Furrow',
      tip: {
        en: 'Critical watering times are flowering and boll development. Stop watering when 50% bolls open.',
        te: 'పూత మరియు కాయ దశలలో నీరు చాలా అవసరం. 50% కాయలు పగిలిన తర్వాత నీరు ఆపండి.',
        hi: 'फूल और टिंडे बनते समय सिंचाई जरूरी है। 50% टिंडे खिलने पर पानी बंद कर दें।',
      },
    },
    fertilizers: [
      { stage: 'Basal Dose', name: 'DAP + Potash', kgPerAcre: 50, timing: 'At sowing' },
      { stage: 'Square Formation', name: 'Urea + Magnesium', kgPerAcre: 35, timing: 'Day 35–40' },
      { stage: 'Boll Filling', name: 'Urea + Boron', kgPerAcre: 30, timing: 'Day 65–75' },
    ],
    pests: [
      {
        name: 'Pink Bollworm / Sucking Pests',
        observationSign: {
          en: 'Rosette-shaped flowers or small holes in green bolls; sticky honeydew on leaves.',
          te: 'గులాబీ పువ్వులా ముడుచుకున్న పూలు, కాయలపై రంధ్రాలు లేదా ఆకులపై జిగురు.',
          hi: 'फूलों का गुलाब जैसा मुड़ना या टिंडों में छोटे छेद; पत्तियों पर चिपचिपा पदार्थ।',
        },
        treatment: {
          en: 'Use pheromone traps and yellow sticky traps; destroy rosette flowers early.',
          te: 'లింగాకర్షక బుట్టలు, పసుపు జిగురు అట్టలు పెట్టి ముడుచుకున్న పూలను నాశనం చేయండి.',
          hi: 'फेरोमोन और पीले चिपचिपे ट्रैप लगाएं; मुड़े हुए फूलों को शुरुआती दौर में हटाएं।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '150–175 days',
      expectedYieldKgPerAcre: 1100,
      readinessSigns: {
        en: 'Pick only fully burst dry fluffy white bolls after morning dew dries.',
        te: 'ఉదయం మంచు ఆరిన తర్వాత పూర్తిగా పగిలి తెల్లగా ఉన్న పత్తిని మాత్రమే తీయండి.',
        hi: 'सुबह की ओस सूखने के बाद पूरी तरह खिले हुए सूखे सफेद टिंडों की ही चुगाई करें।',
      },
      storageTip: {
        en: 'Store clean dry cotton lint away from plastic twine or leaf trash for top market grade.',
        te: 'మంచి ధర కోసం ఆకులు, చెత్త లేకుండా శుభ్రమైన పొడి పత్తిని నిల్వ చేయండి.',
        hi: 'बेहतर बाजार भाव के लिए पत्तियों और प्लास्टिक कचरे से दूर साफ सूखी कपास रखें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid picking cotton before rain or when wet; wet lint loses color and market price.',
      te: 'వర్షానికి ముందు లేదా తడిగా ఉన్నప్పుడు పత్తి తీయవద్దు; తడి పత్తికి ధర తగ్గుతుంది.',
      hi: 'बारिश या नमी में कपास की चुगाई न करें; भीगी कपास का रंग और दाम कम हो जाता है।',
    },
    stagesInfo: {
      land_preparation: {
        days: 'Day 1–10',
        action: { en: 'Deep summer plough to expose soil pests and level black cotton soil.', te: 'వేసవిలో లోతు దుక్కి దున్ని నేలను సిద్ధం చేయండి.', hi: 'गहरी जुताई करें ताकि मिट्टी के कीट नष्ट हों और खेत समतल हो।' },
      },
      sowing: {
        days: 'Day 11–18',
        action: { en: 'Sow seeds in straight rows 90 cm apart for easy weeding.', te: 'కలుపు తీయడానికి వీలుగా 90 సెం.మీ వరుసలలో విత్తండి.', hi: 'निराई की सुविधा के लिए 90 सेमी की कतारों में बुवाई करें।' },
      },
      germination: {
        days: 'Day 19–28',
        action: { en: 'Gap-fill missing hills within 10 days of emergence.', te: 'మొక్కలు రాని చోట 10 రోజుల్లోగా మళ్ళీ విత్తండి.', hi: 'उगाव के 10 दिन के अंदर खाली जगहों पर दोबारा बीज लगाएं।' },
      },
      vegetative_growth: {
        days: 'Day 29–60',
        action: { en: 'Inter-cultivate between rows and monitor whiteflies and aphids.', te: 'వరుసల మధ్య గొర్రు తోలి రసం పీల్చే పురుగులను గమనించండి.', hi: 'कतारों के बीच गुड़ाई करें और सफेद मक्खी व माहू पर नजर रखें।' },
      },
      flowering: {
        days: 'Day 61–100',
        action: { en: 'Square & flower formation: keep soil evenly moist and apply foliar nutrients.', te: 'పూత మరియు గూడ దశలో తేమ సరిగ్గా ఉండేలా చూడండి.', hi: 'फूल व बोंड बनने पर नमी बनाए रखें और पोषक तत्व दें।' },
      },
      maturity: {
        days: 'Day 101–145',
        action: { en: 'Bolls mature and begin splitting open; stop heavy irrigation.', te: 'కాయలు పక్వానికి వచ్చి పగులుతాయి; నీరు పెట్టడం తగ్గించండి.', hi: 'टिंडे पककर खिलने लगते हैं; भारी सिंचाई बंद करें।' },
      },
      harvesting: {
        days: 'Day 146–175',
        action: { en: 'Pick dry clean white cotton in 2–3 passes.', te: 'శుభ్రమైన పొడి పత్తిని 2–3 విడతలలో తీయండి.', hi: '2–3 बार में साफ और सूखी कपास की चुगाई करें।' },
      },
    },
  },
  {
    id: 'maize',
    emoji: '🌽',
    names: { en: 'Maize (Corn)', te: 'మొక్కజొన్న', hi: 'मक्का' },
    defaultVariety: 'Sugar-75 / Hybrid Maize',
    bestSeason: {
      en: 'Kharif & Rabi (Year-round with irrigation)',
      te: 'ఖరీఫ్ & రబీ (నీటిపారుదలతో ఏడాది పొడవునా)',
      hi: 'खरीफ और रबी (सिंचाई के साथ पूरे वर्ष)',
    },
    plantation: {
      seedRateKgPerAcre: 8,
      spacing: '60 cm × 20 cm',
      depthCm: '3–4 cm',
      tip: {
        en: 'Sow on the side of ridges in heavy soils so rainwater never rots emerging seeds.',
        te: 'బరువు నేలల్లో బోదెల పక్కన విత్తండి; దీనివల్ల వర్షపు నీటికి విత్తనాలు కుళ్ళిపోవు.',
        hi: 'भारी मिट्टी में मेड़ों के किनारे बुवाई करें ताकि बारिश के पानी से बीज न सड़ें।',
      },
    },
    irrigation: {
      frequencyDays: 7,
      litersPerAcre: 3800,
      method: 'Drip / Furrow',
      tip: {
        en: 'Knee-high stage, tasseling, and grain filling are must-water stages.',
        te: 'మోకాలు ఎత్తు దశ, జుట్టు వచ్చే దశ మరియు గింజ పాలు పోసుకునే దశలో నీరు తప్పనిసరి.',
        hi: 'घुटने तक ऊंचाई, मंजरी निकलते समय और दाने भरते समय सिंचाई बहुत जरूरी है।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP + Potash', kgPerAcre: 50, timing: 'At sowing' },
      { stage: 'Knee-High Stage', name: 'Urea', kgPerAcre: 40, timing: 'Day 25–30' },
      { stage: 'Tasseling Stage', name: 'Urea', kgPerAcre: 35, timing: 'Day 45–50' },
    ],
    pests: [
      {
        name: 'Fall Armyworm',
        observationSign: {
          en: 'Window-pane holes on young whorl leaves and sawdust-like frass inside the funnel.',
          te: 'సుడి ఆకులపై రంధ్రాలు మరియు సుడి లోపల రంపపు పొట్టు లాంటి విసర్జన.',
          hi: 'पौधे की गोभ में छेद और पत्तियों के बीच बुरादे जैसी गंदगी दिखना।',
        },
        treatment: {
          en: 'Inspect whorls early at Day 15–30 and apply neem/sand-lime whorl treatment or bio-pesticide.',
          te: '15–30 రోజుల మధ్య సుడిని గమనించి వేప మందు లేదా సిఫార్సు చేసిన జీవ మందు వేయండి.',
          hi: '15–30 दिन पर गोभ की जांच करें और नीम या जैविक कीटनाशक का उपयोग करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '90–110 days',
      expectedYieldKgPerAcre: 2600,
      readinessSigns: {
        en: 'Cob husks turn dry pale brown and kernels show a black layer at the tip (or milky sweet for sweet corn).',
        te: 'కంకి పై పొర ఎండి లేత గోధుమ రంగులోకి మారి గింజలు గట్టిపడినప్పుడు కోయండి.',
        hi: 'भुट्टे का छिलका सूखकर भूरा हो जाए और दाने सख्त हो जाएं तो कटाई करें।',
      },
      storageTip: {
        en: 'De-husk cobs and dry until kernels snap cleanly before shelling.',
        te: 'కంకుల పొర తీసి గింజలు గట్టిపడే వరకు ఎండబెట్టి నూర్పిడి చేయండి.',
        hi: 'छिलका उतारकर भुट्टों को अच्छे से सुखाएं और फिर दाने निकालें।',
      },
    },
    weatherAdvice: {
      en: 'Strong winds near maturity can lodge tall stalks—earth up soil around stem base at Day 30.',
      te: 'బలమైన గాలులకు మొక్కలు పడిపోకుండా 30వ రోజున మొక్క మొదళ్ళకు మట్టి ఎగదోయండి.',
      hi: 'तेज हवा से फसल गिरने से बचाने के लिए 30 दिन पर पौधों के पास मिट्टी चढ़ाएं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–7', action: { en: 'Plough cleanly and make ridges 60 cm apart.', te: 'పొలాన్ని దున్ని 60 సెం.మీ దూరంలో బోదెలు చేయండి.', hi: 'खेत जोतकर 60 सेमी दूरी पर मेड़ें बनाएं।' } },
      sowing: { days: 'Day 8–12', action: { en: 'Plant hybrid seeds 3–4 cm deep along ridges.', te: 'బోదెలపై 3–4 సెం.మీ లోతులో విత్తనాలు నాటండి.', hi: 'मेड़ों पर 3–4 सेमी गहराई में बीज बोएं।' } },
      germination: { days: 'Day 13–20', action: { en: 'Check emergence and protect seedlings from birds.', te: 'మొలకలు సరిగ్గా వచ్చాయో చూసి పక్షుల నుండి కాపాడండి.', hi: 'अंकुरण जांचें और पक्षियों से पौधों की रक्षा करें।' } },
      vegetative_growth: { days: 'Day 21–45', action: { en: 'Apply Urea at knee-high stage and check whorl for armyworm.', te: 'మోకాలు ఎత్తులో యూరియా వేసి కత్తెర పురుగును గమనించండి.', hi: 'घुटने की ऊंचाई पर यूरिया दें और गोभ में कीट देखें।' } },
      flowering: { days: 'Day 46–70', action: { en: 'Tassel & silk emergence—keep soil moist for full cob filling.', te: 'జుట్టు మరియు కంకి వచ్చే సమయంలో నీటి ఎద్దడి రాకుండా చూడండి.', hi: 'मंजरी व रेशे निकलने पर खेत में नमी बनाए रखें।' } },
      maturity: { days: 'Day 71–90', action: { en: 'Kernels harden and outer husks begin drying.', te: 'గింజలు గట్టిపడి కంకి పొర ఎండటం ప్రారంభమవుతుంది.', hi: 'दाने सख्त होते हैं और भुट्टे का छिलका सूखने लगता है।' } },
      harvesting: { days: 'Day 91–110', action: { en: 'Harvest cobs, dry thoroughly, and shell cleanly.', te: 'కంకులు కోసి బాగా ఆరబెట్టి గింజలు తీయండి.', hi: 'भुट्टे तोड़कर सुखाएं और दाने अलग करें।' } },
    },
  },
  {
    id: 'turmeric',
    emoji: '🌿',
    names: { en: 'Turmeric', te: 'పసుపు', hi: 'हल्दी' },
    defaultVariety: 'Duggirala Red / Salem',
    bestSeason: {
      en: 'May–July planting (Long 8-month crop)',
      te: 'మే–జూలై నాట్లు (8 నెలల పంట)',
      hi: 'मई–जुलाई बुवाई (8 महीने की फसल)',
    },
    plantation: {
      seedRateKgPerAcre: 800,
      spacing: '45 cm × 20 cm',
      depthCm: '5–7 cm',
      tip: {
        en: 'Plant healthy disease-free rhizome bits (25–30g each) on raised beds and mulch immediately with dry leaves.',
        te: 'ఆరోగ్యకరమైన విత్తన దుంపలను ఎత్తైన మడులపై నాటి వెంటనే ఎండు ఆకులతో మల్చింగ్ చేయండి.',
        hi: 'स्वस्थ कंद के टुकड़े ऊंची क्यारियों में लगाकर तुरंत सूखी पत्तियों से ढक दें (मल्चिंग)।',
      },
    },
    irrigation: {
      frequencyDays: 7,
      litersPerAcre: 3400,
      method: 'Drip / Sprinkler',
      tip: {
        en: 'Avoid standing water at all costs—rhizome rot spreads fast in soggy soil.',
        te: 'నీరు అస్సలు నిలవకూడదు—తేమ ఎక్కువైతే దుంప కుళ్ళు తెగులు వస్తుంది.',
        hi: 'पानी बिल्कुल न जमा होने दें—गीली मिट्टी में कंद सड़न तेजी से फैलती है।',
      },
    },
    fertilizers: [
      { stage: 'Basal Compost', name: 'Well-rotted FYM + Neem Cake', kgPerAcre: 200, timing: 'At planting' },
      { stage: 'Tillering', name: 'NPK + Urea', kgPerAcre: 40, timing: 'Day 45 & 90' },
      { stage: 'Rhizome Bulking', name: 'Potash', kgPerAcre: 30, timing: 'Day 120' },
    ],
    pests: [
      {
        name: 'Rhizome Rot',
        observationSign: {
          en: 'Lower leaves turn yellow, collar becomes soft and watery, and plant pulls out easily.',
          te: 'కింది ఆకులు పసుపు రంగులోకి మారి, మొదలు మెత్తబడి కుళ్ళిపోవడం.',
          hi: 'निचली पत्तियाँ पीली पड़ना, तना नरम व गीला होना और पौधे का आसानी से उखड़ना।',
        },
        treatment: {
          en: 'Improve drainage immediately, remove affected clumps, and drench soil around nearby plants.',
          te: 'వెంటనే నీటిని బయటకు పంపి, కుళ్ళిన మొక్కలను తీసివేసి మందు ద్రావణం పోయండి.',
          hi: 'तुरंत जल निकासी सुधारें, रोगग्रस्त पौधे हटाएं और पास के पौधों में जड़ उपचार करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '210–250 days',
      expectedYieldKgPerAcre: 2200,
      readinessSigns: {
        en: 'Leaves and stems turn completely yellow and dry flat onto the soil.',
        te: 'ఆకులు మరియు కాండాలు పూర్తిగా పసుపు రంగులోకి మారి ఎండి వాలిపోయినప్పుడు తవ్వకానికి సిద్ధం.',
        hi: 'जब पत्तियाँ और तने पूरी तरह पीले पड़कर सूख जाएं तो खुदाई करें।',
      },
      storageTip: {
        en: 'Boil, sun-dry for 10–15 days, and polish cured fingers for storage.',
        te: 'దుంపలను ఉడకబెట్టి, 10–15 రోజులు ఎండబెట్టి శుభ్రంగా నిల్వ చేయండి.',
        hi: 'हल्दी को उबालकर 10–15 दिन धूप में सुखाएं और साफ करके रखें।',
      },
    },
    weatherAdvice: {
      en: 'High rainfall requires clean drainage trenches around every raised bed.',
      te: 'ఎక్కువ వర్షాలు పడినప్పుడు ప్రతి మడి చుట్టూ నీరు పోయే కాలువలు శుభ్రంగా ఉంచండి.',
      hi: 'अधिक बारिश में हर क्यारी के चारों ओर जल निकासी की नाली साफ रखें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–15', action: { en: 'Prepare raised beds 15 cm high with rich organic compost.', te: 'సేంద్రీయ ఎరువుతో 15 సెం.మీ ఎత్తైన మడులు తయారు చేయండి.', hi: 'जैविक खाद मिलाकर 15 सेमी ऊंची क्यारियाँ तैयार करें।' } },
      sowing: { days: 'Day 16–25', action: { en: 'Plant treated seed rhizomes and cover with leaf mulch.', te: 'శుద్ధి చేసిన విత్తన దుంపలు నాటి ఎండు ఆకులతో కప్పండి.', hi: 'उपचारित कंद बोएं और सूखी पत्तियों से ढक दें।' } },
      germination: { days: 'Day 26–50', action: { en: 'Shoots emerge slowly over 3–4 weeks; keep lightly moist.', te: 'మొలకలు 3–4 వారాలలో వస్తాయి; తేలికపాటి తేమ ఉంచండి.', hi: 'अंकुरण में 3–4 सप्ताह लगते हैं; हल्की नमी बनाए रखें।' } },
      vegetative_growth: { days: 'Day 51–120', action: { en: 'Weed gently, earth up beds, and apply split NPK doses.', te: 'కలుపు తీసి, మట్టి ఎగదోసి ఎరువులు వేయండి.', hi: 'निराई करें, मिट्टी चढ़ाएं और उर्वरक की खुराक दें।' } },
      flowering: { days: 'Day 121–170', action: { en: 'Underground rhizomes expand rapidly; add Potash.', te: 'భూమిలో దుంపలు వేగంగా ఊరుతాయి; పొటాష్ వేయండి.', hi: 'जमीन के नीचे कंद तेजी से बढ़ते हैं; पोटाश डालें।' } },
      maturity: { days: 'Day 171–215', action: { en: 'Leaves begin yellowing; stop watering 2–3 weeks before digging.', te: 'ఆకులు పసుపు రంగులోకి మారుతాయి; తవ్వకానికి 2 వారాల ముందు నీరు ఆపండి.', hi: 'पत्तियाँ पीली होने लगती हैं; खुदाई से 2–3 सप्ताह पहले सिंचाई बंद करें।' } },
      harvesting: { days: 'Day 216–250', action: { en: 'Dig rhizomes carefully without cutting fingers, boil and cure.', te: 'దుంపలకు దెబ్బ తగలకుండా తవ్వి, ఉడకబెట్టి ఎండబెట్టండి.', hi: 'बिना कटे सावधानी से कंद खोदें, उबालें और सुखाएं।' } },
    },
  },
  {
    id: 'tomato',
    emoji: '🍅',
    names: { en: 'Tomato', te: 'టమాటా', hi: 'टमाटर' },
    defaultVariety: 'Arka Rakshak / Hybrid',
    bestSeason: {
      en: 'Jun–Jul, Oct–Nov & Jan–Feb',
      te: 'జూన్–జూలై, అక్టో–నవం & జన–ఫిబ్ర',
      hi: 'जून–जुलाई, अक्टूबर–नवंबर और जनवरी–फरवरी',
    },
    plantation: {
      seedRateKgPerAcre: 0.15,
      spacing: '75 cm × 45 cm',
      depthCm: '1 cm (nursery)',
      tip: {
        en: 'Transplant 25-day seedlings and stake plants with bamboo/wire support before flowering.',
        te: '25 రోజుల నారును నాటి, పూతకు ముందే వెదురు కర్రలతో ఊతం ఇవ్వండి.',
        hi: '25 दिन की पौध लगाएं और फूल आने से पहले बांस या तार से सहारा दें।',
      },
    },
    irrigation: {
      frequencyDays: 4,
      litersPerAcre: 3500,
      method: 'Drip',
      tip: {
        en: 'Keep soil evenly moist. Sudden dry-then-heavy watering causes tomatoes to crack.',
        te: 'నేల తేమ సమానంగా ఉండాలి. ఎండిపోయిన తర్వాత ఒక్కసారిగా ఎక్కువ నీరు పెడితే కాయలు పగులుతాయి.',
        hi: 'नमी एक समान रखें। सूखने के बाद अचानक ज्यादा पानी देने से टमाटर फट जाते हैं।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP', kgPerAcre: 100, timing: 'At planting' },
      { stage: 'Vegetative', name: 'NPK 19-19-19', kgPerAcre: 20, timing: 'Day 20 & 35' },
      { stage: 'Fruit Set', name: 'Calcium Nitrate + Potash', kgPerAcre: 20, timing: 'Day 50 & 70' },
    ],
    pests: [
      {
        name: 'Early Blight / Fruit Borer',
        observationSign: {
          en: 'Brown target-ring spots on lower leaves or tiny round holes bored into green tomatoes.',
          te: 'కింది ఆకులపై గోధుమ రంగు వలయ మచ్చలు లేదా కాయలపై చిన్న రంధ్రాలు.',
          hi: 'निचली पत्तियों पर भूरे गोल धब्बे या कच्चे टमाटर में छोटे छेद।',
        },
        treatment: {
          en: 'Remove bottom diseased leaves, use pheromone traps, and spray recommended fungicide/Neem.',
          te: 'కింది తెగులు ఆకులను తీసివేసి వేప నూనె లేదా తగిన మందు పిచికారీ చేయండి.',
          hi: 'नीचे की रोगग्रस्त पत्तियाँ हटाएं, ट्रैप लगाएं और सुरक्षित दवा का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '65–95 days',
      expectedYieldKgPerAcre: 9000,
      readinessSigns: {
        en: 'Harvest at breaker/pink stage for distant markets, or full red for local sale.',
        te: 'దూరపు మార్కెట్‌కు లేత ఎరుపు దశలో, స్థానిక అమ్మకాలకు పూర్తి ఎరుపు రంగులో కోయండి.',
        hi: 'दूर के बाजार के लिए हल्का लाल होने पर, और स्थानीय बिक्री के लिए पूरा लाल होने पर तोड़ें।',
      },
      storageTip: {
        en: 'Pack in ventilated plastic crates in shade—never heap tomatoes on hot ground.',
        te: 'నీడలో గాలి ఆడే ప్లాస్టిక్ క్రేట్లలో సర్దండి—ఎండలో కుప్పగా వేయవద్దు.',
        hi: 'छाया में हवादार प्लास्टिक क्रेट में पैक करें—गर्म जमीन पर ढेर न लगाएं।',
      },
    },
    weatherAdvice: {
      en: 'Protect from heavy rain splash with plastic mulch; extreme heat >36°C reduces flower set.',
      te: 'వర్షపు మట్టి తుంపర్లు ఆకులపై పడకుండా మల్చింగ్ వాడండి; 36°C దాటితే పూత తగ్గుతుంది.',
      hi: 'बारिश के छींटों से बचाने के लिए मल्चिंग करें; 36°C से अधिक गर्मी में फल कम बनते हैं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–10', action: { en: 'Make raised beds with drip lines and compost.', te: 'కంపోస్టు మరియు డ్రిప్ పైపులతో ఎత్తైన మడులు చేయండి.', hi: 'खाद और ड्रिप लाइन के साथ ऊंची क्यारियाँ बनाएं।' } },
      sowing: { days: 'Day 11–25', action: { en: 'Raise healthy seedlings in tray/nursery and transplant.', te: 'ట్రేలలో ఆరోగ్యకరమైన నారు పెంచి పొలంలో నాటండి.', hi: 'ट्रे में स्वस्थ पौध तैयार कर खेत में रोपाई करें।' } },
      germination: { days: 'Day 26–32', action: { en: 'Light morning watering until plants establish.', te: 'మొక్కలు నిలబడే వరకు ఉదయాన్నే తేలికపాటి నీరు ఇవ్వండి.', hi: 'पौधे जमने तक सुबह हल्की सिंचाई करें।' } },
      vegetative_growth: { days: 'Day 33–48', action: { en: 'Tie plants to stakes and pinch unwanted side suckers.', te: 'కర్రలకు కట్టి, అనవసరమైన పక్క కొమ్మలను తీసేయండి.', hi: 'पौधों को सहारा दें और अनावश्यक कल्ले हटाएं।' } },
      flowering: { days: 'Day 49–64', action: { en: 'Maintain steady drip moisture and apply Calcium + Boron.', te: 'పూత సమయంలో క్రమం తప్పకుండా డ్రిప్ నీరు, కాల్షియం ఇవ్వండి.', hi: 'फूल आने पर नियमित पानी और कैल्शियम-बोरॉन दें।' } },
      maturity: { days: 'Day 65–78', action: { en: 'Fruits size up and start turning pink-red.', te: 'కాయలు పెద్దవై ఎరుపు రంగులోకి మారడం మొదలవుతుంది.', hi: 'फल बड़े होकर गुलाबी-लाल होने लगते हैं।' } },
      harvesting: { days: 'Day 79–110', action: { en: 'Pick gently every 3–4 days into ventilated crates.', te: 'ప్రతి 3–4 రోజులకు కోసి గాలి ఆడే క్రేట్లలో సర్దండి.', hi: 'हर 3–4 दिन में सावधानी से तुड़ाई कर क्रेट में रखें।' } },
    },
  },
  {
    id: 'wheat',
    emoji: '🌾',
    names: { en: 'Wheat', te: 'గోధుమ', hi: 'गेहूं' },
    defaultVariety: 'HD-2967 / Lok-1',
    bestSeason: {
      en: 'Rabi (November sowing)',
      te: 'రబీ (నవంబర్ విత్తనాలు)',
      hi: 'रबी (नवंबर की बुवाई)',
    },
    plantation: {
      seedRateKgPerAcre: 40,
      spacing: '22.5 cm row-to-row',
      depthCm: '4–5 cm',
      tip: {
        en: 'Sow on time in November using a seed drill for uniform germination and better tillering.',
        te: 'సమానంగా మొలకెత్తడానికి నవంబర్ నెలలో వరుసలలో విత్తనాలు వేయండి.',
        hi: 'एक समान अंकुरण और अधिक कल्लों के लिए नवंबर में सीड ड्रिल से कतार में बुवाई करें।',
      },
    },
    irrigation: {
      frequencyDays: 20,
      litersPerAcre: 6500,
      method: 'Flood / Sprinkler',
      tip: {
        en: 'First irrigation at 21 days (Crown Root Initiation) is the most important watering.',
        te: 'విత్తిన 21వ రోజున ఇచ్చే మొదటి నీరు పంటకు అత్యంత ముఖ్యం.',
        hi: 'बुवाई के 21 दिन बाद (जड़ जमने की अवस्था) पहली सिंचाई सबसे महत्वपूर्ण है।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP + Potash', kgPerAcre: 55, timing: 'At sowing' },
      { stage: 'First Irrigation', name: 'Urea', kgPerAcre: 35, timing: 'Day 21' },
      { stage: 'Second Irrigation', name: 'Urea', kgPerAcre: 30, timing: 'Day 45' },
    ],
    pests: [
      {
        name: 'Yellow Rust / Aphids',
        observationSign: {
          en: 'Yellow powdery stripes on leaves or sticky clusters of green aphids on earheads.',
          te: 'ఆకులపై పసుపు పొడి చారలు లేదా కంకులపై ఆకుపచ్చ పేనుబంక.',
          hi: 'पत्तियों पर पीली पाउडर जैसी धारियाँ या बालियों पर हरे माहू के झुंड।',
        },
        treatment: {
          en: 'Spray recommended fungicide immediately on first yellow rust patches; keep border weeds clean.',
          te: 'మొదటి మచ్చలు కనిపించగానే వెంటనే తగిన మందు పిచికారీ చేయండి.',
          hi: 'पीला रतुआ दिखते ही तुरंत अनुशंसित फफूंदनाशी का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '115–130 days',
      expectedYieldKgPerAcre: 1900,
      readinessSigns: {
        en: 'Stalks turn dry golden straw and grains crack cleanly under teeth.',
        te: 'కాండాలు పూర్తిగా బంగారు రంగులోకి మారి గింజలు గట్టిపడినప్పుడు కోయండి.',
        hi: 'फसल सुनहरे भूसे जैसी सूख जाए और दाने दांत से कटने पर सख्त लगें तो कटाई करें।',
      },
      storageTip: {
        en: 'Cool and sun-dry wheat down to 12% moisture before sealing in dry bins.',
        te: 'తేమ 12% తగ్గే వరకు ఆరబెట్టి పొడి డబ్బాలలో నిల్వ చేయండి.',
        hi: 'अनाज को 12% नमी तक सुखाकर सूखे भंडार में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid irrigation if strong winds are forecast after earhead emergence to prevent lodging.',
      te: 'కంకులు వచ్చిన తర్వాత బలమైన గాలులు ఉంటే నీరు పెట్టకండి—పంట పడిపోవచ్చు.',
      hi: 'बालियाँ निकलने के बाद तेज हवा की संभावना हो तो सिंचाई न करें, वरना फसल गिर सकती है।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–8', action: { en: 'Plough and plank soil to create a fine firm seedbed.', te: 'మట్టిని మెత్తగా దున్ని సమం చేయండి.', hi: 'खेत की जुताई कर भुरभुरी व समतल क्यारी बनाएं।' } },
      sowing: { days: 'Day 9–12', action: { en: 'Drill seeds 4–5 cm deep with basal DAP.', te: 'డీఏపీ ఎరువుతో పాటు 4–5 సెం.మీ లోతులో విత్తండి.', hi: 'डीएपी के साथ 4–5 सेमी गहराई में सीड ड्रिल से बुवाई करें।' } },
      germination: { days: 'Day 13–24', action: { en: 'Give crucial first irrigation at Day 21 (CRI stage).', te: '21వ రోజున మొదటి ముఖ్యమైన నీరు ఇవ్వండి.', hi: '21वें दिन पहली सबसे जरूरी सिंचाई करें।' } },
      vegetative_growth: { days: 'Day 25–55', action: { en: 'Apply Urea split dose and control broadleaf weeds.', te: 'యూరియా వేసి వెడల్పాకు కలుపును నియంత్రించండి.', hi: 'यूरिया डालें और चौड़ी पत्ती वाले खरपतवार हटाएं।' } },
      flowering: { days: 'Day 56–85', action: { en: 'Booting & earhead emergence—ensure timely moisture.', te: 'కంకి బయటకు వచ్చే దశలో సరైన తేమ ఉంచండి.', hi: 'बालियाँ निकलते समय खेत में नमी बनाए रखें।' } },
      maturity: { days: 'Day 86–115', action: { en: 'Grains harden to golden amber; stop watering.', te: 'గింజలు గట్టిపడి బంగారు రంగులోకి మారుతాయి; నీరు ఆపండి.', hi: 'दाने सुनहरे होकर पकते हैं; सिंचाई बंद कर दें।' } },
      harvesting: { days: 'Day 116–130', action: { en: 'Harvest, thresh, winnow, and dry grains below 12% moisture.', te: 'పంట కోసి, నూర్పిడి చేసి, బాగా ఆరబెట్టి నిల్వ చేయండి.', hi: 'कटाई व मड़ाई कर 12% नमी तक सुखाकर भंडारण करें।' } },
    },
  },
  {
    id: 'groundnut',
    emoji: '🥜',
    names: { en: 'Groundnut (Peanut)', te: 'వేరుశనగ', hi: 'मूंगफली' },
    defaultVariety: 'K-6 / Kadiri Lepakshi',
    bestSeason: {
      en: 'Kharif (Jun–Jul) & Rabi (Nov–Dec)',
      te: 'ఖరీఫ్ (జూన్–జూలై) & రబీ (నవం–డిసెం)',
      hi: 'खरीफ (जून–जुलाई) और रबी (नवंबर–दिसंबर)',
    },
    plantation: {
      seedRateKgPerAcre: 45,
      spacing: '30 cm × 10 cm',
      depthCm: '4–5 cm',
      tip: {
        en: 'Shell pods only 1 week before sowing so seeds keep high germination power.',
        te: 'విత్తే వారం ముందు మాత్రమే కాయల నుండి గింజలు తీయండి.',
        hi: 'बुवाई से केवल 1 सप्ताह पहले ही फलियों से दाने निकालें ताकि अंकुरण अच्छा हो।',
      },
    },
    irrigation: {
      frequencyDays: 8,
      litersPerAcre: 3400,
      method: 'Sprinkler',
      tip: {
        en: 'Keep soil loose and lightly moist during pegging and pod filling.',
        te: 'ఊడలు దిగే దశ మరియు కాయ పట్టే దశలో మట్టి గుల్లగా, తేమగా ఉండాలి.',
        hi: 'सूइयाँ जमीन में जाते समय और फली बनते समय मिट्टी नरम व हल्की नम रखें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'SSP + Potash', kgPerAcre: 50, timing: 'At sowing' },
      { stage: 'Flowering / Pegging', name: 'Gypsum (Calcium + Sulfur)', kgPerAcre: 150, timing: 'Day 35–40' },
    ],
    pests: [
      {
        name: 'Tikka Leaf Spot / Leaf Miner',
        observationSign: {
          en: 'Dark brown circular spots with yellow halos on leaves or folded mined leaves.',
          te: 'ఆకులపై పసుపు అంచుతో కూడిన ముదురు గోధుమ మచ్చలు.',
          hi: 'पत्तियों पर पीले घेरे वाले गहरे भूरे गोल धब्बे या मुड़ी हुई पत्तियाँ।',
        },
        treatment: {
          en: 'Apply Gypsum at flowering and spray recommended fungicide/Neem on early leaf spots.',
          te: 'పూత సమయంలో జిప్సం వేసి ఆకు మచ్చలు రాగానే మందు చల్లండి.',
          hi: 'फूल आने पर जिप्सम डालें और शुरुआती धब्बों पर सुरक्षित दवा का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '105–120 days',
      expectedYieldKgPerAcre: 1100,
      readinessSigns: {
        en: 'Pull 3 sample plants: inner shell turns dark veined and kernels turn pink-red.',
        te: '3 మొక్కలు పీకి చూడండి: కాయ లోపలి పొర నల్లబడి గింజలు గులాబీ రంగులో ఉన్నప్పుడు కోయండి.',
        hi: '3 पौधे उखाड़कर देखें: फली के अंदर का छिलका गहरा हो और दाने गुलाबी-लाल हों तो खुदाई करें।',
      },
      storageTip: {
        en: 'Dry pods in shade/sun to 8–9% moisture to prevent mold.',
        te: 'బూజు పట్టకుండా కాయలను 8–9% తేమ వచ్చే వరకు ఆరబెట్టండి.',
        hi: 'फफूंद से बचाने के लिए फलियों को 8–9% नमी तक सुखाएं।',
      },
    },
    weatherAdvice: {
      en: 'Avoid rain on pulled drying pods in the field; move harvested plants under cover.',
      te: 'పొలంలో ఆరబెట్టిన కాయలు వర్షంలో తడవకుండా జాగ్రత్త పడండి.',
      hi: 'खेत में सूख रही उखाड़ी गई फलियों को बारिश से बचाकर रखें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–8', action: { en: 'Loosen sandy loam soil deeply for easy pegging.', te: 'ఊడలు సులభంగా దిగేలా నేలను గుల్లగా దున్నండి.', hi: 'सूइयों के आसानी से जाने के लिए मिट्टी भुरभुरी करें।' } },
      sowing: { days: 'Day 9–12', action: { en: 'Sow treated kernels 4–5 cm deep in rows.', te: 'శుద్ధి చేసిన విత్తనాలను వరుసలలో 4–5 సెం.మీ లోతులో వేయండి.', hi: 'उपचारित दानों को कतार में 4–5 सेमी गहराई पर बोएं।' } },
      germination: { days: 'Day 13–22', action: { en: 'Keep field weed-free during the first 3 weeks.', te: 'మొదటి 3 వారాలు కలుపు లేకుండా శుభ్రంగా ఉంచండి.', hi: 'पहले 3 सप्ताह खेत को खरपतवार मुक्त रखें।' } },
      vegetative_growth: { days: 'Day 23–40', action: { en: 'Inter-cultivate lightly before flowers appear.', te: 'పూత రాకముందే తేలికపాటి గొర్రు తోలండి.', hi: 'फूल आने से पहले हल्की निराई-गुड़ाई करें।' } },
      flowering: { days: 'Day 41–65', action: { en: 'Apply Gypsum near root zone so pods fill cleanly—do not disturb pegs!', te: 'మొక్క మొదట్లో జిప్సం వేయండి—ఊడలు కదపకండి!', hi: 'जड़ों के पास जिप्सम डालें—अब गुड़ाई करके सूइयों को न छेड़ें!' } },
      maturity: { days: 'Day 66–100', action: { en: 'Pods develop underground; keep light sprinkler moisture.', te: 'భూమిలో కాయలు ఊరుతాయి; తేలికపాటి తేమ ఉంచండి.', hi: 'जमीन के अंदर फलियां पकती हैं; हल्की नमी बनाए रखें।' } },
      harvesting: { days: 'Day 101–120', action: { en: 'Pull plants when 75% pods mature, strip pods, and dry well.', te: '75% కాయలు ముదిరిన తర్వాత మొక్కలు పీకి కాయలు బాగా ఆరబెట్టండి.', hi: '75% फलियां पकने पर पौधे उखाड़ें और फलियां सुखाएं।' } },
    },
  },
  {
    id: 'sugarcane',
    emoji: '🎋',
    names: { en: 'Sugarcane', te: 'చెరకు', hi: 'गन्ना' },
    defaultVariety: 'Co-86032 / Co-0238',
    bestSeason: {
      en: 'Jan–Mar (Spring) & Oct–Nov (Adsali/Autumn)',
      te: 'జనవరి–మార్చి & అక్టోబర్–నవంబర్',
      hi: 'जनवरी–मार्च (बसंत) और अक्टूबर–नवंबर (शरद)',
    },
    plantation: {
      seedRateKgPerAcre: 2800,
      spacing: '90 cm × 30 cm',
      depthCm: '5–8 cm',
      tip: {
        en: 'Use healthy 2-bud or 3-bud cane setts from 8-month crop and dip in fungicide solution before planting.',
        te: '8 నెలల ఆరోగ్యకరమైన చెరకు నుండి 2 లేదా 3 కన్నుల ముక్కలను తీసుకుని శుద్ధి చేసి నాటండి.',
        hi: '8 महीने की स्वस्थ फसल से 2–3 आँख वाले टुकड़े लें और बुवाई से पहले बीज उपचार करें।',
      },
    },
    irrigation: {
      frequencyDays: 8,
      litersPerAcre: 6500,
      method: 'Furrow / Drip',
      tip: {
        en: 'Keep furrows moist during tillering and grand growth. Stop watering 3 weeks before cutting.',
        te: 'పిలకలు మరియు పెరుగుదల దశలో తేమ ఉంచండి. నరికే 3 వారాల ముందు నీరు ఆపండి.',
        hi: 'कल्ले निकलते और बढ़ते समय नमी रखें। कटाई से 3 सप्ताह पहले सिंचाई बंद करें।',
      },
    },
    fertilizers: [
      { stage: 'At Planting', name: 'DAP + Potash', kgPerAcre: 60, timing: 'Day 0' },
      { stage: 'Tillering', name: 'Urea', kgPerAcre: 55, timing: 'Day 45 & 90' },
      { stage: 'Grand Growth', name: 'Urea + Potash', kgPerAcre: 50, timing: 'Day 120' },
    ],
    pests: [
      {
        name: 'Early Shoot Borer / Red Rot',
        observationSign: {
          en: 'Central leaf whorl dries into dead-heart or cut cane shows red streaks inside.',
          te: 'మధ్య ఆకు ఎండిపోవడం లేదా చెరకు కోసినప్పుడు లోపల ఎర్ర చారలు కనిపించడం.',
          hi: 'बीच की पत्तियाँ सूखना या गन्ने को काटने पर अंदर लाल धारियाँ दिखना।',
        },
        treatment: {
          en: 'Trash mulch between rows, earth up soil at Day 45, and remove red-rot clumps early.',
          te: 'వరుసల మధ్య చెత్త ఆకులతో మల్చింగ్ చేసి, 45వ రోజున మట్టి ఎగదోయండి.',
          hi: 'कतारों के बीच सूखी पत्तियों की मल्चिंग करें और 45 दिन पर मिट्टी चढ़ाएं।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '300–360 days',
      expectedYieldKgPerAcre: 38000,
      readinessSigns: {
        en: 'Lower leaves dry up, cane produces metallic ringing sound when tapped, and juice tastes very sweet.',
        te: 'కింది ఆకులు ఎండి, చెరకును తట్టినప్పుడు లోహపు శబ్దం వస్తే కోతకు సిద్ధం.',
        hi: 'निचली पत्तियाँ सूख जाएं, ठोकने पर धातु जैसी आवाज आए और रस मीठा हो तो कटाई करें।',
      },
      storageTip: {
        en: 'Send cut cane to the sugar mill within 24 hours so sugar weight does not drop.',
        te: 'బరువు మరియు చక్కెర శాతం తగ్గకుండా కోసిన 24 గంటలలోగా ఫ్యాక్టరీకి పంపండి.',
        hi: 'वजन और मिठास कम न हो इसके लिए कटाई के 24 घंटे के भीतर गन्ना मिल भेजें।',
      },
    },
    weatherAdvice: {
      en: 'Tie tall canes together before strong monsoon winds so stalks do not lodge.',
      te: 'బలమైన గాలులకు చెరకు పడిపోకుండా మొక్కలను కలిపి కట్టండి.',
      hi: 'तेज हवा से गन्ने को गिरने से बचाने के लिए आपस में बांध दें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–15', action: { en: 'Deep plough and open ridges 90 cm apart.', te: 'లోతుగా దున్ని 90 సెం.మీ దూరంలో కాలువలు తీయండి.', hi: 'गहरी जुताई कर 90 सेमी पर नालियाँ बनाएं।' } },
      sowing: { days: 'Day 16–20', action: { en: 'Place treated cane setts end-to-end in furrows and cover lightly.', te: 'శుద్ధి చేసిన చెరకు ముక్కలను వరుసగా పెట్టి మట్టితో కప్పండి.', hi: 'उपचारित टुकड़ों को नालियों में रखकर हल्की मिट्टी से ढकें।' } },
      germination: { days: 'Day 21–50', action: { en: 'Keep soil lightly moist for even sprouting.', te: 'సమానంగా మొలకెత్తడానికి తేలికపాటి తేమ ఉంచండి.', hi: 'अच्छे अंकुरण के लिए हल्की नमी बनाए रखें।' } },
      vegetative_growth: { days: 'Day 51–140', action: { en: 'Apply Urea split doses and earth up ridges.', te: 'యూరియా వేసి బోదెలకు మట్టి ఎగదోయండి.', hi: 'यूरिया की खुराक दें और मिट्टी चढ़ाएं।' } },
      flowering: { days: 'Day 141–250', action: { en: 'Grand cane elongation—irrigate steadily and tie lodging canes.', te: 'చెరకు పొడవు పెరిగే దశ—క్రమంగా నీరు పెట్టి పడిపోకుండా కట్టండి.', hi: 'गन्ना तेजी से बढ़ता है—नियमित सिंचाई करें और गन्ने बांधें।' } },
      maturity: { days: 'Day 251–310', action: { en: 'Sugar builds in stalks; stop irrigation 3 weeks prior.', te: 'చెరకులో తీపి పెరుగుతుంది; కోతకు 3 వారాల ముందు నీరు ఆపండి.', hi: 'गन्ने में मिठास बढ़ती है; कटाई से 3 सप्ताह पहले पानी बंद करें।' } },
      harvesting: { days: 'Day 311–360', action: { en: 'Cut close to ground level and deliver promptly.', te: 'నేల మట్టానికి దగ్గరగా నరికి వెంటనే మిల్లుకు పంపండి.', hi: 'जमीन की सतह के पास से कटाई करें और तुरंत मिल भेजें।' } },
    },
  },
  {
    id: 'onion',
    emoji: '🧅',
    names: { en: 'Onion', te: 'ఉల్లి', hi: 'प्याज' },
    defaultVariety: 'Bhima Super / Agrifound Light Red',
    bestSeason: {
      en: 'Kharif (Jun–Jul) & Rabi (Nov–Dec)',
      te: 'ఖరీఫ్ (జూన్–జూలై) & రబీ (నవం–డిసెం)',
      hi: 'खरीफ (जून–जुलाई) और रबी (नवंबर–दिसंबर)',
    },
    plantation: {
      seedRateKgPerAcre: 3.5,
      spacing: '15 cm × 10 cm',
      depthCm: '1–2 cm',
      tip: {
        en: 'Grow seedlings in raised nursery beds for 45 days, clip top 1/3 leaf tip, and transplant into flat beds.',
        te: '45 రోజులు నారు పెంచి, పై ఆకు చివర కత్తిరించి సమమైన మడులలో నాటండి.',
        hi: '45 दिन नर्सरी में पौध उगाएं, ऊपर की पत्तियाँ हल्की काटकर समतल क्यारियों में लगाएं।',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 3200,
      method: 'Drip / Sprinkler',
      tip: {
        en: 'Stop watering 15 days before harvest once necks soften so bulbs store longer without rotting.',
        te: 'దుంపలు కుళ్ళకుండా ఉండాలంటే కోతకు 15 రోజుల ముందు నీరు పెట్టడం పూర్తిగా ఆపండి.',
        hi: 'प्याज को सड़ने से बचाने के लिए कटाई से 15 दिन पहले सिंचाई बिल्कुल बंद कर दें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Sulfur', kgPerAcre: 80, timing: 'At transplanting' },
      { stage: 'Vegetative', name: 'Urea + Potash', kgPerAcre: 35, timing: 'Day 30 & 45' },
    ],
    pests: [
      {
        name: 'Purple Blotch / Thrips',
        observationSign: {
          en: 'Silvery streaks on tubular leaves or purple sunken spots.',
          te: 'ఆకులపై వెండి చారలు లేదా ఊదా రంగు మచ్చలు.',
          hi: 'पत्तियों पर चांदी जैसी धारियाँ या बैंगनी रंग के धब्बे।',
        },
        treatment: {
          en: 'Spray Neem oil or recommended control early morning with sticking agent.',
          te: 'ఉదయాన్నే వేప నూనె లేదా తగిన మందును జిగురుతో కలిపి పిచికారీ చేయండి.',
          hi: 'सुबह के समय चिपको मिलाकर नीम तेल या सुरक्षित दवा का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '100–120 days',
      expectedYieldKgPerAcre: 8500,
      readinessSigns: {
        en: '50–70% of plant tops soften at the neck and fall over naturally.',
        te: '50–70% ఆకుల మెడలు మెత్తబడి సహజంగా కిందికి వాలిపోయినప్పుడు తవ్వండి.',
        hi: 'जब 50–70% पौधों की गर्दन नरम होकर अपने आप झुक जाए तो खुदाई करें।',
      },
      storageTip: {
        en: 'Cure bulbs in shade with leaves covering bulbs for 5–7 days before trimming necks.',
        te: 'ఆకులతో సహా 5–7 రోజులు నీడలో ఆరబెట్టిన తర్వాతే ఆకులు కత్తిరించి నిల్వ చేయండి.',
        hi: 'पत्तियों के साथ 5–7 दिन छाया में सुखाने के बाद ही डंठल काटकर भंडारण करें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid overhead rain/sprinkler water right before harvest to protect bulb skin color.',
      te: 'కోత సమయంలో నీరు తగిలితే ఉల్లి రంగు దెబ్బతింటుంది మరియు నిల్వ తగ్గుతుంది.',
      hi: 'कटाई के समय बारिश या फव्वारे के पानी से बचाएं वरना प्याज की गुणवत्ता घटती है।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–10', action: { en: 'Prepare fine leveled beds with well-rotted compost.', te: 'మంచి కంపోస్టు వేసి సమమైన మడులు తయారు చేయండి.', hi: 'सड़ी हुई गोबर खाद मिलाकर समतल क्यारियाँ बनाएं।' } },
      sowing: { days: 'Day 11–45', action: { en: 'Raise nursery seedlings and transplant 15×10 cm apart.', te: 'నారు పెంచి 15×10 సెం.మీ దూరంలో నాట్లు వేయండి.', hi: 'नर्सरी से पौध लेकर 15×10 सेमी की दूरी पर लगाएं।' } },
      germination: { days: 'Day 46–55', action: { en: 'Give light watering every 3–4 days until roots establish.', te: 'వేర్లు పట్టే వరకు ప్రతి 3–4 రోజులకు తేలికపాటి నీరు ఇవ్వండి.', hi: 'जड़ जमने तक हर 3–4 दिन में हल्का पानी दें।' } },
      vegetative_growth: { days: 'Day 56–75', action: { en: 'Hand-weed gently and apply Urea + Sulfur.', te: 'కలుపు తీసి యూరియా మరియు సల్ఫర్ వేయండి.', hi: 'निराई करें और यूरिया व सल्फर डालें।' } },
      flowering: { days: 'Day 76–90', action: { en: 'Bulbs start swelling—remove any early seed stalks.', te: 'గడ్డలు ఊరడం మొదలవుతుంది—పూత కాడలు వస్తే తుంచేయండి.', hi: 'कंद फूलने लगते हैं—कोई डंठल निकले तो तोड़ दें।' } },
      maturity: { days: 'Day 91–105', action: { en: 'Stop watering 15 days before harvest as tops bend.', te: 'ఆకులు వాలడం మొదలవగానే కోతకు 15 రోజుల ముందు నీరు ఆపండి.', hi: 'पत्तियाँ झुकने लगें तो कटाई से 15 दिन पहले पानी बंद करें।' } },
      harvesting: { days: 'Day 106–120', action: { en: 'Pull bulbs, cure in shade, trim necks, and grade.', te: 'ఉల్లిని తీసి, నీడలో ఆరబెట్టి, ఆకులు కత్తిరించి నిల్వ చేయండి.', hi: 'प्याज उखाड़ें, छाया में सुखाएं, डंठल काटें और ग्रेडिंग करें।' } },
    },
  },
  {
    id: 'potato',
    emoji: '🥔',
    names: { en: 'Potato', te: 'బంగాళాదుంప (ఆలుగడ్డ)', hi: 'आलू' },
    defaultVariety: 'Kufri Jyoti / Kufri Bahar',
    bestSeason: {
      en: 'Rabi (Oct–Nov cool planting)',
      te: 'రబీ (అక్టోబర్–నవంబర్)',
      hi: 'रबी (अक्टूबर–नवंबर ठंड की बुवाई)',
    },
    plantation: {
      seedRateKgPerAcre: 800,
      spacing: '60 cm × 20 cm',
      depthCm: '5–7 cm',
      tip: {
        en: 'Plant whole small seed tubers (30–40g) with 2–3 sprouted eyes on ridges.',
        te: '2–3 కన్నులు మొలకెత్తిన చిన్న విత్తన గడ్డలను బోదెలపై నాటండి.',
        hi: '2–3 अंकुरित आँखों वाले स्वस्थ छोटे बीज आलू मेड़ों पर लगाएं।',
      },
    },
    irrigation: {
      frequencyDays: 7,
      litersPerAcre: 3600,
      method: 'Furrow / Drip',
      tip: {
        en: 'Keep water below 2/3 ridge height so tubers stay airy. Stop 12 days before digging.',
        te: 'బోదెలో 2/3 వంతు ఎత్తు వరకు మాత్రమే నీరు పెట్టండి. తవ్వకానికి 12 రోజుల ముందు నీరు ఆపండి.',
        hi: 'नाली में मेड़ के 2/3 हिस्से तक ही पानी दें। खुदाई से 12 दिन पहले पानी बंद करें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP + Potash', kgPerAcre: 85, timing: 'At planting' },
      { stage: 'Earthing Up', name: 'Urea', kgPerAcre: 40, timing: 'Day 25–30' },
    ],
    pests: [
      {
        name: 'Late Blight',
        observationSign: {
          en: 'Dark water-soaked patches on leaf edges with white mold underneath during foggy mornings.',
          te: 'మంచు కురిసే ఉదయాలలో ఆకుల అంచులపై నల్లని నీటి మచ్చలు, కింద తెల్ల బూజు.',
          hi: 'कोहरे वाली सुबह में पत्तियों के किनारों पर काले गीले धब्बे और नीचे सफेद फफूंद।',
        },
        treatment: {
          en: 'Inspect daily during cold foggy days and spray protective fungicide immediately.',
          te: 'చలి, పొగమంచు రోజుల్లో రోజూ చూసి వెంటనే తగిన మందు పిచికారీ చేయండి.',
          hi: 'कोहरे के दिनों में रोज जांच करें और तुरंत सुरक्षित फफूंदनाशी का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '85–105 days',
      expectedYieldKgPerAcre: 9500,
      readinessSigns: {
        en: 'Haulms turn yellow and tuber skin does not peel when rubbed with thumb.',
        te: 'ఆకులు పసుపు రంగులోకి మారి, దుంప పై తొక్క బొటనవేలితో రుద్దితే ఊడిరాకుండా గట్టిపడినప్పుడు తవ్వండి.',
        hi: 'पौधे पीले पड़ जाएं और अंगूठे से रगड़ने पर आलू का छिलका न उतरे तो खुदाई करें।',
      },
      storageTip: {
        en: 'Dry potatoes in shade for 7 days to harden skins before bagging.',
        te: 'సంచులలో నింపే ముందు తొక్క గట్టిపడేలా 7 రోజులు నీడలో ఆరబెట్టండి.',
        hi: 'बोरों में भरने से पहले छिलका सख्त होने के लिए 7 दिन छाया में सुखाएं।',
      },
    },
    weatherAdvice: {
      en: 'Foggy cool weather triggers Late Blight; watch Weather Alerts for high humidity.',
      te: 'పొగమంచు మరియు అధిక తేమ వల్ల ఆకు మాడు తెగులు వస్తుంది—వాతావరణ హెచ్చరికలు చూడండి.',
      hi: 'कोहरे और नमी में झुलसा रोग तेजी से फैलता है—मौसम अलर्ट पर ध्यान दें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–8', action: { en: 'Pulverize soil deeply and mix compost.', te: 'నేలను లోతుగా గుల్లగా దున్ని కంపోస్టు కలపండి.', hi: 'मिट्टी को गहरा और भुरभुरा बनाकर खाद मिलाएं।' } },
      sowing: { days: 'Day 9–12', action: { en: 'Plant sprouted seed tubers and cover into ridges.', te: 'మొలకెత్తిన విత్తన గడ్డలను నాటి బోదెలు కట్టండి.', hi: 'अंकुरित बीज आलू लगाकर मेड़ें बना दें।' } },
      germination: { days: 'Day 13–25', action: { en: 'Shoots emerge; keep light furrow moisture.', te: 'మొలకలు వస్తాయి; కాలువలలో తేలికపాటి తేమ ఉంచండి.', hi: 'पौधे निकलते हैं; हल्की सिंचाई बनाए रखें।' } },
      vegetative_growth: { days: 'Day 26–45', action: { en: 'Apply Urea and earth up soil high around stems so tubers stay covered.', te: 'యూరియా వేసి దుంపలు బయటకు కనబడకుండా మట్టి ఎగదోయండి.', hi: 'यूरिया दें और कंद ढके रखने के लिए ऊंची मिट्टी चढ़ाएं।' } },
      flowering: { days: 'Day 46–65', action: { en: 'Tubers bulk rapidly; watch closely for blight spots.', te: 'దుంపలు వేగంగా ఊరుతాయి; ఆకు మచ్చల కోసం జాగ్రత్తగా చూడండి.', hi: 'कंद तेजी से बढ़ते हैं; झुलसा रोग के धब्बों की जांच करें।' } },
      maturity: { days: 'Day 66–85', action: { en: 'Leaves yellow; cut haulms and stop watering 12 days early.', te: 'ఆకులు పసుపు రంగులోకి మారుతాయి; 12 రోజుల ముందు నీరు ఆపండి.', hi: 'पत्तियाँ पीली पड़ने पर 12 दिन पहले पानी बंद करें।' } },
      harvesting: { days: 'Day 86–105', action: { en: 'Dig carefully, cure in shade, and sort bruised tubers out.', te: 'జాగ్రత్తగా తవ్వి, నీడలో ఆరబెట్టి దెబ్బతిన్న వాటిని వేరు చేయండి.', hi: 'सावधानी से खुदाई करें, छाया में सुखाएं और कटे आलू अलग करें।' } },
    },
  },
  {
    id: 'soybean',
    emoji: '🫘',
    names: { en: 'Soybean', te: 'సోయాబీన్', hi: 'सोयाबीन' },
    defaultVariety: 'JS-9560 / JS-335',
    bestSeason: {
      en: 'Kharif (June–July monsoon sowing)',
      te: 'ఖరీఫ్ (జూన్–జూలై)',
      hi: 'खरीफ (जून–जुलाई मानसून बुवाई)',
    },
    plantation: {
      seedRateKgPerAcre: 30,
      spacing: '45 cm × 5 cm',
      depthCm: '3 cm',
      tip: {
        en: 'Treat seeds gently with Rhizobium bio-fertilizer before sowing; do not sow deeper than 3–4 cm.',
        te: 'విత్తే ముందు రైజోబియం జీవ ఎరువుతో శుద్ధి చేయండి; 3–4 సెం.మీ కంటే లోతుగా నాటకండి.',
        hi: 'बुवाई से पहले राइजोबियम से बीज उपचार करें; 3–4 सेमी से ज्यादा गहरा न बोएं।',
      },
    },
    irrigation: {
      frequencyDays: 10,
      litersPerAcre: 3200,
      method: 'Sprinkler / Rainfed',
      tip: {
        en: 'Mostly rainfed, but give protective watering if dry spell hits during flowering or pod filling.',
        te: 'వర్షాధార పంట అయినప్పటికీ, పూత మరియు కాయ దశలో వర్షం లేకపోతే నీరు ఇవ్వండి.',
        hi: 'फूल व फली बनते समय सूखा पड़े तो एक हल्की सिंचाई जरूर करें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'SSP + Potash + Sulfur', kgPerAcre: 55, timing: 'At sowing' },
      { stage: 'Pod Fill', name: 'NPK 19-19-19 Foliar', kgPerAcre: 3, timing: 'Day 45' },
    ],
    pests: [
      {
        name: 'Girdle Beetle / Caterpillar',
        observationSign: {
          en: 'Two ring cuts around stems causing top leaves to droop or chewed holes on leaves.',
          te: 'కాండం చుట్టూ రెండు వలయ కోతలు ఉండి పై ఆకులు వాడిపోవడం.',
          hi: 'तने पर दो गोल कटाव दिखना जिससे ऊपर की पत्तियाँ मुरझा जाती हैं।',
        },
        treatment: {
          en: 'Remove girdled drooping twigs early and install bird perches (15 per acre).',
          te: 'వాడిపోయిన కొమ్మలను వెంటనే తీసివేసి, పక్షులు వాలడానికి ఎకరాకు 15 కర్రలు పాతండి.',
          hi: 'मुरझाई टहनियाँ तोड़कर हटाएं और प्रति एकड़ 15 बर्ड पर्च (टी-आकार की लकड़ी) लगाएं।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '90–105 days',
      expectedYieldKgPerAcre: 950,
      readinessSigns: {
        en: 'Leaves drop off and 90% of pods turn brown and rattle when shaken.',
        te: 'ఆకులు రాలిపోయి 90% కాయలు గోధుమ రంగులోకి మారి గలగల శబ్దం వచ్చినప్పుడు కోయండి.',
        hi: 'पत्तियाँ झड़ जाएं और 90% फलियां भूरी होकर हिलाने पर खनखनाएं तो कटाई करें।',
      },
      storageTip: {
        en: 'Thresh gently at slow speed so soybean seeds do not split, and dry to 10% moisture.',
        te: 'గింజలు పగలకుండా తక్కువ వేగంతో నూర్పిడి చేసి, 10% తేమ వరకు ఆరబెట్టండి.',
        hi: 'दाने न टूटें इसलिए धीमी गति से थ्रेशिंग करें और 10% नमी तक सुखाएं।',
      },
    },
    weatherAdvice: {
      en: 'Avoid waterlogging in black soils; cut prompt drainage furrows.',
      te: 'నల్ల రేగడి నేలల్లో వర్షపు నీరు నిలవకుండా కాలువలు తీయండి.',
      hi: 'काली मिट्टी में पानी जमा न होने दें; जल निकासी नालियाँ बनाएं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–7', action: { en: 'Prepare leveled ridges/broadbed furrows for drainage.', te: 'నీరు పోయేలా ఎత్తు మడులు తయారు చేయండి.', hi: 'जल निकासी के लिए चौड़ी क्यारियाँ व नालियाँ बनाएं।' } },
      sowing: { days: 'Day 8–10', action: { en: 'Sow Rhizobium-treated seed 3 cm deep after monsoon rain.', te: 'తొలకరి వర్షం తర్వాత రైజోబియం కలిపిన విత్తనాలు 3 సెం.మీ లోతులో వేయండి.', hi: 'पहली अच्छी बारिश के बाद 3 सेमी गहराई पर बुवाई करें।' } },
      germination: { days: 'Day 11–18', action: { en: 'Check uniform stand and avoid crusting.', te: 'మొలకలు సమానంగా వచ్చాయో చూడండి.', hi: 'एक समान अंकुरण की जांच करें।' } },
      vegetative_growth: { days: 'Day 19–38', action: { en: 'Keep field weed-free for the first 35 days.', te: 'మొదటి 35 రోజులు కలుపు లేకుండా శుభ్రంగా ఉంచండి.', hi: 'पहले 35 दिन खेत को खरपतवार से साफ रखें।' } },
      flowering: { days: 'Day 39–60', action: { en: 'Protect flowers from caterpillars; water if dry spell.', te: 'పూతను లద్దె పురుగు నుండి కాపాడి, వర్షం లేకపోతే నీరు ఇవ్వండి.', hi: 'फूलों को इल्लियों से बचाएं; सूखे में सिंचाई करें।' } },
      maturity: { days: 'Day 61–88', action: { en: 'Pods fill plumply and leaves begin yellowing.', te: 'కాయలు నిండి ఆకులు పసుపు రంగులోకి మారుతాయి.', hi: 'फलियां भरती हैं और पत्तियाँ पीली पड़ने लगती हैं।' } },
      harvesting: { days: 'Day 89–105', action: { en: 'Harvest promptly before pods shatter in hot sun.', te: 'ఎండకు కాయలు పగిలిపోకముందే కోసి నూర్పిడి చేయండి.', hi: 'धूप में फलियां चटकने से पहले कटाई और मड़ाई करें।' } },
    },
  },
];

export const CROP_GUIDES: CropGuideProfile[] = [
  ...BASE_CROP_GUIDES.map((crop) => ({
    ...crop,
    category: crop.category || BASE_CROP_CATEGORY_MAP[crop.id] || 'cereals',
  })),
  ...EXTRA_VEG_AND_FIELD_CROPS,
  ...EXTRA_FRUIT_CROPS,
];
