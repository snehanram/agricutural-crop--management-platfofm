import type { CropGuideProfile } from './cropTypes';

export const EXTRA_VEG_AND_FIELD_CROPS: CropGuideProfile[] = [
  // ============ VEGETABLES ============
  {
    id: 'brinjal',
    category: 'vegetables',
    emoji: '🍆',
    names: { en: 'Brinjal (Eggplant)', te: 'వంకాయ', hi: 'बैंगन' },
    defaultVariety: 'Pusa Purple Long / Bhagyamathi / Hybrid',
    bestSeason: {
      en: 'Jun–Jul, Oct–Nov & Jan–Feb',
      te: 'జూన్–జూలై, అక్టో–నవం & జన–ఫిబ్ర',
      hi: 'जून–जुलाई, अक्टूबर–नवंबर और जनवरी–फरवरी',
    },
    plantation: {
      seedRateKgPerAcre: 0.2,
      spacing: '75 cm × 60 cm',
      depthCm: '1 cm (nursery)',
      tip: {
        en: 'Grow seedlings on raised nursery beds for 30 days, then transplant onto ridges in the evening.',
        te: '30 రోజులు నారు పెంచి సాయంత్రం వేళ బోదెలపై నాటండి.',
        hi: '30 दिन नर्सरी में पौध उगाकर शाम के समय मेड़ों पर रोपाई करें।',
      },
    },
    irrigation: {
      frequencyDays: 4,
      litersPerAcre: 3500,
      method: 'Drip / Furrow',
      tip: {
        en: 'Keep soil evenly moist during flowering and fruiting; waterlogging invites bacterial wilt.',
        te: 'పూత మరియు కాయ దశలో సమాన తేమ ఉంచండి; నీరు నిలిస్తే వడలు తెగులు వస్తుంది.',
        hi: 'फूल व फल बनते समय बराबर नमी रखें; पानी भरने पर पौधे मुरझा जाते हैं।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Potash', kgPerAcre: 110, timing: 'At transplanting' },
      { stage: 'Flowering', name: 'Urea + NPK 19-19-19', kgPerAcre: 30, timing: 'Day 30 & 55' },
    ],
    pests: [
      {
        name: 'Shoot & Fruit Borer',
        observationSign: {
          en: 'Drooping wilted top shoots or small holes inside brinjals.',
          te: 'లేత కొమ్మల చివర్లు వాడి వాలిపోవడం లేదా కాయలో పురుగు రంధ్రాలు.',
          hi: 'ऊपरी नई टहनियों का मुरझाकर झुकना या बैंगन के अंदर छेद दिखना।',
        },
        treatment: {
          en: 'Snap off and bury wilted shoots daily; install pheromone traps (5 per acre) and spray Neem oil.',
          te: 'వాడిన కొమ్మలను రోజూ తుంచి నాశనం చేయండి; ఎకరాకు 5 లింగాకర్షక బుట్టలు పెట్టండి.',
          hi: 'मुरझाई टहनियों को रोज तोड़कर मिट्टी में दबाएं; प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '65–140 days (multiple pickings)',
      expectedYieldKgPerAcre: 11000,
      readinessSigns: {
        en: 'Pick glossy tender fruits before skin dulls and seeds turn hard inside.',
        te: 'కాయ నిగనిగలాడుతూ లేతగా ఉన్నప్పుడే కోయండి—ముదిరితే విత్తనాలు గట్టిపడతాయి.',
        hi: 'फल चमकदार व नरम रहें तभी तोड़ें—देर करने पर बीज सख्त हो जाते हैं।',
      },
      storageTip: {
        en: 'Keep in cool shade in woven baskets and market within 24 hours.',
        te: 'కోసిన కాయలను చల్లని నీడలో బుట్టలలో ఉంచి వెంటనే మార్కెట్‌కు పంపండి.',
        hi: 'छाया में टोकरियों में रखकर 24 घंटे के भीतर मंडी भेजें।',
      },
    },
    weatherAdvice: {
      en: 'Use raised beds in monsoon to protect roots from standing water.',
      te: 'వర్షాకాలంలో వేరు కుళ్ళు రాకుండా ఎత్తు బోదెలపై నాటండి.',
      hi: 'बारिश में जड़ सड़न से बचने के लिए ऊंची मेड़ों पर लगाएं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–10', action: { en: 'Mix compost deeply and form 75 cm ridges.', te: 'కంపోస్టు కలిపి 75 సెం.మీ దూరంలో బోదెలు చేయండి.', hi: 'खाद मिलाकर 75 सेमी दूरी पर मेड़ें बनाएं।' } },
      sowing: { days: 'Day 11–35', action: { en: 'Raise nursery for 30 days and transplant healthy seedlings.', te: '30 రోజుల నారును పొలంలో నాటండి.', hi: '30 दिन की स्वस्थ पौध खेत में लगाएं।' } },
      germination: { days: 'Day 36–45', action: { en: 'Light irrigation until transplants anchor firmly.', te: 'మొక్కలు నిలబడే వరకు తేలికగా నీరు ఇవ్వండి.', hi: 'पौधे जमने तक हल्की सिंचाई करें।' } },
      vegetative_growth: { days: 'Day 46–60', action: { en: 'Weed, earth up soil, and remove borer-wilted shoots.', te: 'కలుపు తీసి, మట్టి ఎగదోసి వాడిన చిగుళ్ళను తీసేయండి.', hi: 'निराई करें और कीट वाली मुरझाई टहनियाँ हटाएं।' } },
      flowering: { days: 'Day 61–75', action: { en: 'Install pheromone traps and feed balanced NPK.', te: 'లింగాకర్షక బుట్టలు పెట్టి NPK ఎరువు ఇవ్వండి.', hi: 'फेरोमोन ट्रैप लगाएं और संतुलित NPK दें।' } },
      maturity: { days: 'Day 76–90', action: { en: 'Glossy fruits develop quickly every 4–5 days.', te: 'నిగనిగలాడే కాయలు త్వరగా పెరుగుతాయి.', hi: 'चमकदार फल तेजी से तैयार होते हैं।' } },
      harvesting: { days: 'Day 91–150', action: { en: 'Pick tender glossy fruits twice a week with calyx.', te: 'వారానికి రెండుసార్లు లేత కాయలను తొడిమతో కోయండి.', hi: 'सप्ताह में दो बार डंठल सहित नरम बैंगन तोड़ें।' } },
    },
  },
  {
    id: 'okra',
    category: 'vegetables',
    emoji: '🫛',
    names: { en: "Okra (Lady's Finger)", te: 'బెండకాయ', hi: 'भिंडी' },
    defaultVariety: 'Arka Anamika / Mahyco Hybrid',
    bestSeason: {
      en: 'Feb–Mar (Summer) & Jun–Jul (Kharif)',
      te: 'ఫిబ్రవరి–మార్చి & జూన్–జూలై',
      hi: 'फरवरी–मार्च (गर्मी) और जून–जुलाई (खरीफ)',
    },
    plantation: {
      seedRateKgPerAcre: 3.5,
      spacing: '45 cm × 20 cm',
      depthCm: '2–3 cm',
      tip: {
        en: 'Soak okra seeds in water for 12 hours before sowing for fast, even sprouting.',
        te: 'త్వరగా మొలకెత్తడానికి విత్తే ముందు గింజలను 12 గంటలు నీటిలో నానబెట్టండి.',
        hi: 'तेज और एक समान अंकुरण के लिए बुवाई से पहले बीज को 12 घंटे पानी में भिगोएं।',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 3000,
      method: 'Drip / Furrow',
      tip: {
        en: 'Water every 4–5 days in hot summer; skip watering during rains.',
        te: 'వేసవిలో ప్రతి 4–5 రోజులకు నీరు పెట్టండి; వర్షాలలో అవసరం లేదు.',
        hi: 'गर्मी में हर 4–5 दिन में पानी दें; बारिश में सिंचाई रोक दें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Potash', kgPerAcre: 80, timing: 'At sowing' },
      { stage: 'First Picking', name: 'Urea', kgPerAcre: 25, timing: 'Day 30 & 50' },
    ],
    pests: [
      {
        name: 'Yellow Vein Mosaic & Whitefly',
        observationSign: {
          en: 'Leaves turn bright yellow with green veins and pods stay pale/stunted.',
          te: 'ఆకుల ఈనెలు పసుపు రంగులోకి మారి కాయలు చిన్నగా వస్తాయి.',
          hi: 'पत्तियों की नसें पीली पड़ना और भिंडी का रंग हल्का व छोटा रह जाना।',
        },
        treatment: {
          en: 'Choose YVMV-resistant hybrid seed, place yellow sticky traps, and uproot early infected plants.',
          te: 'తట్టుకునే రకం విత్తనాలు వాడి, పసుపు జిగురు అట్టలు పెట్టండి.',
          hi: 'रोगरोधी किस्म बोएं, पीले चिपचिपे ट्रैप लगाएं और रोगी पौधे उखाड़ें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '45–95 days (pick every 2 days!)',
      expectedYieldKgPerAcre: 4800,
      readinessSigns: {
        en: 'Pick young tender pods (7–9 cm long) whose tips snap crisply when bent.',
        te: '7–9 సెం.మీ పొడవు ఉండి చివర వంచితే టప్‌మని విరిగే లేత బెండకాయలు కోయండి.',
        hi: '7–9 सेमी लंबी नरम भिंडी तोड़ें जिसका सिरा मोड़ने पर आसानी से टूट जाए।',
      },
      storageTip: {
        en: 'Wear light gloves while picking to avoid skin itch; keep in shaded gunny/crates.',
        te: 'కోసేటప్పుడు చేతులకు దురద రాకుండా గ్లౌజులు వేసుకుని చల్లని నీడలో సర్దండి.',
        hi: 'तुड़ाई में खुजली से बचने के लिए दस्ताने पहनें और छाया में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Warm sunny weather gives best yield; avoid sowing in severe cold below 15°C.',
      te: 'వెచ్చని ఎండలో దిగుబడి బాగుంటుంది; చలి 15°C కంటే తక్కువగా ఉన్నప్పుడు విత్తకండి.',
      hi: 'गर्म मौसम में अच्छी पैदावार मिलती है; 15°C से कम ठंड में बुवाई न करें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–6', action: { en: 'Plough soil well and mix organic compost.', te: 'నేలను బాగా దున్ని సేంద్రీయ ఎరువు కలపండి.', hi: 'खेत जोतकर गोबर खाद मिलाएं।' } },
      sowing: { days: 'Day 7–9', action: { en: 'Sow water-soaked seeds 2–3 cm deep in rows.', te: 'నానబెట్టిన విత్తనాలను వరుసలలో నాటండి.', hi: 'भीगे हुए बीज कतार में 2–3 सेमी गहराई पर बोएं।' } },
      germination: { days: 'Day 10–16', action: { en: 'Seedlings sprout in 5–7 days; gap-fill misses.', te: '5–7 రోజుల్లో మొలకలు వస్తాయి.', hi: '5–7 दिन में अंकुरण होता है; खाली जगह भरें।' } },
      vegetative_growth: { days: 'Day 17–32', action: { en: 'Weed at Day 20 and top-dress Urea.', te: '20వ రోజున కలుపు తీసి యూరియా వేయండి.', hi: '20 दिन पर निराई कर यूरिया डालें।' } },
      flowering: { days: 'Day 33–44', action: { en: 'Yellow blooms appear; hang yellow sticky traps.', te: 'పసుపు పూలు వస్తాయి; పసుపు జిగురు అట్టలు పెట్టండి.', hi: 'पीले फूल आने पर पीले चिपचिपे ट्रैप लगाएं।' } },
      maturity: { days: 'Day 45–50', action: { en: 'Pods reach picking size just 5–6 days after flower!', te: 'పూత వచ్చిన 5–6 రోజుల్లోనే కాయ కోతకు వస్తుంది!', hi: 'फूल से केवल 5–6 दिन में भिंडी तोड़ने लायक हो जाती है!' } },
      harvesting: { days: 'Day 46–95', action: { en: 'Pick every alternate day so plants keep bearing new pods.', te: 'ప్రతి రెండు రోజులకు కోస్తే మొక్కలు నిరంతరం కాపునిస్తాయి.', hi: 'हर दूसरे दिन तुड़ाई करें ताकि लगातार नई फलियां निकलें।' } },
    },
  },
  {
    id: 'cabbage',
    category: 'vegetables',
    emoji: '🥬',
    names: { en: 'Cabbage', te: 'క్యాబేజీ', hi: 'पत्तागोभी' },
    defaultVariety: 'Golden Acre / Green Express',
    bestSeason: {
      en: 'Rabi (Sep–Nov planting)',
      te: 'రబీ (సెప్టెంబర్–నవంబర్)',
      hi: 'रबी (सितंबर–नवंबर)',
    },
    plantation: {
      seedRateKgPerAcre: 0.25,
      spacing: '45 cm × 45 cm',
      depthCm: '1 cm (nursery)',
      tip: {
        en: 'Transplant 25-day seedlings in cool evening hours onto moist ridges.',
        te: '25 రోజుల నారును సాయంత్రం చల్లబడిన తర్వాత తడి బోదెలపై నాటండి.',
        hi: '25 दिन की पौध को शाम के समय नम मेड़ों पर रोपें।',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 3200,
      method: 'Drip / Furrow',
      tip: {
        en: 'Keep soil evenly moist during head formation; sudden heavy water after dryness splits heads.',
        te: 'గడ్డ కట్టేటప్పుడు తేమ సమానంగా ఉండాలి—ఎండిన తర్వాత ఎక్కువ నీరు పెడితే క్యాబేజీ పగులుతుంది.',
        hi: 'गांठ बनते समय बराबर नमी रखें—अचानक ज्यादा पानी देने से गोभी फट सकती है।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Boron', kgPerAcre: 90, timing: 'At planting' },
      { stage: 'Head Formation', name: 'Urea + Potash', kgPerAcre: 40, timing: 'Day 25 & 45' },
    ],
    pests: [
      {
        name: 'Diamondback Moth / Aphids',
        observationSign: {
          en: 'Tiny green caterpillars eating window holes in outer wrapper leaves.',
          te: 'చిన్న ఆకుపచ్చ పురుగులు ఆకులలో రంధ్రాలు చేయడం.',
          hi: 'छोटी हरी इल्लियाँ पत्तियों में छोटे-छोटे छेद करती दिखें।',
        },
        treatment: {
          en: 'Grow mustard trap rows along borders and spray Neem oil or Bt bio-spray.',
          te: 'పొలం చుట్టూ ఆవాలు పంట వేసి వేప నూనె లేదా బీటీ మందు చల్లండి.',
          hi: 'मेड़ पर सरसों की ट्रैप कतार लगाएं और नीम तेल या बीटी जैविक छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '70–90 days',
      expectedYieldKgPerAcre: 14000,
      readinessSigns: {
        en: 'Press head gently with palm—when firm, tight, and compact, cut cleanly.',
        te: 'గడ్డ గట్టిగా, బిగుతుగా తయారైనప్పుడు కత్తితో కోయండి.',
        hi: 'जब गोभी दबाने पर सख्त और ठोस लगे तो नीचे से काट लें।',
      },
      storageTip: {
        en: 'Leave 2–3 outer wrapper leaves attached to cushion cabbage heads during transport.',
        te: 'రవాణాలో దెబ్బతగలకుండా బయటి 2–3 ఆకులు అలాగే ఉంచండి.',
        hi: 'ढुलाई में सुरक्षा के लिए बाहर की 2–3 हरी पत्तियाँ साथ रखें।',
      },
    },
    weatherAdvice: {
      en: 'Thrives in cool 15–25°C weather; high heat prevents tight head formation.',
      te: '15–25°C చల్లని వాతావరణంలో గడ్డలు గట్టిగా, పెద్దగా వస్తాయి.',
      hi: '15–25°C ठंडे मौसम में बढ़िया ठोस गोभी बनती है; तेज गर्मी में गांठ नहीं बनती।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–8', action: { en: 'Prepare fine composted ridges 45 cm apart.', te: 'కంపోస్టు వేసి 45 సెం.మీ దూరంలో బోదెలు చేయండి.', hi: 'खाद डालकर 45 सेमी पर मेड़ें बनाएं।' } },
      sowing: { days: 'Day 9–30', action: { en: 'Grow nursery seedlings and transplant carefully.', te: 'నారు పెంచి పొలంలో నాట్లు వేయండి.', hi: 'नर्सरी में पौध उगाकर रोपाई करें।' } },
      germination: { days: 'Day 31–38', action: { en: 'Water lightly every 3 days until leaves perk up.', te: 'మొక్కలు నిలబడే వరకు ప్రతి 3 రోజులకు నీరు ఇవ్వండి.', hi: 'पौधे जमने तक हर 3 दिन में हल्का पानी दें।' } },
      vegetative_growth: { days: 'Day 39–55', action: { en: 'Weed, earth up stems, and apply Urea.', te: 'కలుపు తీసి మట్టి ఎగదోసి యూరియా వేయండి.', hi: 'निराई करें, मिट्टी चढ़ाएं और यूरिया दें।' } },
      flowering: { days: 'Day 56–70', action: { en: 'Wrapper leaves cup inward to start head formation.', te: 'ఆకులు లోపలికి ముడుచుకుని గడ్డ కట్టడం మొదలవుతుంది.', hi: 'पत्तियाँ अंदर मुड़कर गांठ बनना शुरू होती है।' } },
      maturity: { days: 'Day 71–80', action: { en: 'Heads tighten firmly; inspect for caterpillars.', te: 'గడ్డ గట్టిపడుతుంది; పురుగులను గమనించండి.', hi: 'गोभी सख्त होती है; इल्लियों की जांच करें।' } },
      harvesting: { days: 'Day 81–90', action: { en: 'Cut firm heads with 2–3 protective wrapper leaves.', te: '2–3 బయటి ఆకులతో సహా గట్టి గడ్డలను కోయండి.', hi: '2–3 बाहरी पत्तियों सहित सख्त गोभी काटें।' } },
    },
  },
  {
    id: 'cauliflower',
    category: 'vegetables',
    emoji: '🥦',
    names: { en: 'Cauliflower', te: 'కాలీఫ్లవర్', hi: 'फूलगोभी' },
    defaultVariety: 'Snowball-16 / Pusa Snowball',
    bestSeason: {
      en: 'Sep–Nov cool planting',
      te: 'సెప్టెంబర్–నవంబర్',
      hi: 'सितंबर–नवंबर (सर्दी)',
    },
    plantation: {
      seedRateKgPerAcre: 0.25,
      spacing: '45 cm × 45 cm',
      depthCm: '1 cm (nursery)',
      tip: {
        en: 'Never let seedlings become overgrown (>30 days) in nursery—old transplants produce tiny "button" curds.',
        te: 'నారు 30 రోజులు దాటకముందే నాటండి—ముదిరిన నారు వేస్తే పువ్వులు చాలా చిన్నగా వస్తాయి.',
        hi: '30 दिन से ज्यादा पुरानी पौध न लगाएं—पुरानी पौध से फूल बहुत छोटे रह जाते हैं।',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 3200,
      method: 'Drip / Furrow',
      tip: {
        en: 'Steady moisture + Boron micronutrient prevents hollow stems and brown curd spots.',
        te: 'సరైన తేమ మరియు బోరాన్ వాడితే పువ్వు తెల్లగా, గట్టిగా ఉంటుంది.',
        hi: 'नियमित नमी और बोरॉन से फूल सफेद रहता है और तना खोखला नहीं होता।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Boron', kgPerAcre: 95, timing: 'At planting' },
      { stage: 'Curd Initiation', name: 'Urea + Potash', kgPerAcre: 35, timing: 'Day 25 & 45' },
    ],
    pests: [
      {
        name: 'Black Rot & Caterpillars',
        observationSign: {
          en: 'V-shaped yellow dry patches from leaf margins or chewed leaves.',
          te: 'ఆకు అంచుల నుండి V ఆకారంలో పసుపు ఎండు మచ్చలు.',
          hi: 'पत्तियों के किनारे से V-आकार में पीला सूखना या पत्तियों में छेद।',
        },
        treatment: {
          en: 'Treat seeds in warm water (50°C for 25 min) before sowing and spray Neem oil early.',
          te: 'విత్తే ముందు గోరువెచ్చని నీటిలో శుద్ధి చేసి వేప నూనె చల్లండి.',
          hi: 'बुवाई से पहले गुनगुने पानी से बीज उपचार करें और नीम तेल छिड़कें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '75–100 days',
      expectedYieldKgPerAcre: 10000,
      readinessSigns: {
        en: 'Cut compact snow-white curds while florets are tight—before they loosen and turn yellowish.',
        te: 'పువ్వు గట్టిగా, మంచులా తెల్లగా ఉన్నప్పుడే కోయండి.',
        hi: 'जब फूल ठोस और दूध जैसा सफेद रहे तभी काटें—ढीला या पीला न होने दें।',
      },
      storageTip: {
        en: 'Fold 2–3 inner leaves lightly over young white curds ("blanching") 5 days before harvest to keep them snow-white.',
        te: 'కోతకు 5 రోజుల ముందు ఆకులను పువ్వుపైకి మడిచి కడితే పువ్వు తెల్లగా ఉంటుంది.',
        hi: 'कटाई से 5 दिन पहले अंदर की पत्तियों से फूल को ढक दें ताकि वह बिल्कुल सफेद रहे।',
      },
    },
    weatherAdvice: {
      en: 'Ideal curd temperature is 15–22°C; bright direct sun turns exposed curds yellow.',
      te: '15–22°C చలిలో పువ్వు చాలా బాగా పెరుగుతుంది; నేరుగా ఎండ తగిలితే రంగు మారుతుంది.',
      hi: '15–22°C तापमान सबसे अच्छा है; तेज धूप से फूल पीला पड़ सकता है।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–8', action: { en: 'Mix compost & Boron cleanly into raised beds.', te: 'కంపోస్టు, బోరాన్ కలిపి బోదెలు చేయండి.', hi: 'खाद व बोरॉन मिलाकर मेड़ें तैयार करें।' } },
      sowing: { days: 'Day 9–30', action: { en: 'Raise nursery for 25–28 days and transplant promptly.', te: '25–28 రోజుల నారును ఆలస్యం చేయకుండా నాటండి.', hi: '25–28 दिन की ताजी पौध तुरंत रोपें।' } },
      germination: { days: 'Day 31–38', action: { en: 'Water gently so delicate roots grip soil.', te: 'వేర్లు పట్టే వరకు తేలికగా నీరు పెట్టండి.', hi: 'जड़ें जमने तक हल्की सिंचाई दें।' } },
      vegetative_growth: { days: 'Day 39–60', action: { en: 'Apply Urea split dose and keep leaf caterpillars away.', te: 'యూరియా వేసి ఆకు పురుగులను నివారించండి.', hi: 'यूरिया डालें और पत्तियों को कीड़ों से बचाएं।' } },
      flowering: { days: 'Day 61–75', action: { en: 'Curd forms in center; do not disturb plants.', te: 'మధ్యలో తెల్ల పువ్వు ఏర్పడటం మొదలవుతుంది.', hi: 'बीच में सफेद फूल बनना शुरू होता है।' } },
      maturity: { days: 'Day 76–88', action: { en: 'Tie/fold inner leaves gently over curd for white color.', te: 'పువ్వు తెల్లగా ఉండటానికి ఆకులను పైకి కట్టండి.', hi: 'सफेद रंग बनाए रखने के लिए पत्तियों से फूल ढकें।' } },
      harvesting: { days: 'Day 89–100', action: { en: 'Cut compact white curds with jacket leaves.', te: 'రక్షణ ఆకులతో సహా గట్టి పువ్వులను కోయండి.', hi: 'बाहरी पत्तियों सहित ठोस सफेद फूल काटें।' } },
    },
  },
  {
    id: 'cucumber',
    category: 'vegetables',
    emoji: '🥒',
    names: { en: 'Cucumber', te: 'దోసకాయ / కీరా', hi: 'खीरा' },
    defaultVariety: 'Pusa Uday / Malini Hybrid',
    bestSeason: {
      en: 'Feb–Mar (Summer) & Jun–Jul (Kharif)',
      te: 'ఫిబ్రవరి–మార్చి & జూన్–జూలై',
      hi: 'फरवरी–मार्च और जून–जुलाई',
    },
    plantation: {
      seedRateKgPerAcre: 0.6,
      spacing: '1.5 m × 0.45 m',
      depthCm: '2 cm',
      tip: {
        en: 'Grow on vertical bamboo-net trellis for straight, spotless, crisp green cucumbers.',
        te: 'వెదురు పందిరి లేదా వలపై పెంచితే కాయలు తిన్నగా, మచ్చలు లేకుండా వస్తాయి.',
        hi: 'बांस व जाली के सहारे चढ़ाने पर खीरे सीधे, चमकदार और बेदाग आते हैं।',
      },
    },
    irrigation: {
      frequencyDays: 3,
      litersPerAcre: 2800,
      method: 'Drip',
      tip: {
        en: 'Never skip irrigation during fruiting—dry stress makes cucumbers taste bitter.',
        te: 'కాయ దశలో నీరు తగ్గితే దోసకాయలు చేదుగా మారతాయి.',
        hi: 'फल बनते समय पानी की कमी से खीरे कड़वे हो जाते हैं—नियमित सिंचाई रखें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Potash', kgPerAcre: 80, timing: 'At sowing' },
      { stage: 'Flowering & Pick', name: 'NPK 19-19-19', kgPerAcre: 20, timing: 'Day 25 & 40' },
    ],
    pests: [
      {
        name: 'Fruit Fly & Powdery Mildew',
        observationSign: {
          en: 'White talcum-like powder on upper leaves or curved punctured fruits.',
          te: 'ఆకులపై తెల్ల పొడి లేదా కాయలపై రంధ్రాలు.',
          hi: 'पत्तियों पर सफेद पाउडर जैसा धब्बा या मुड़े हुए छेद वाले फल।',
        },
        treatment: {
          en: 'Hang Cue-lure fruit fly traps early and spray Neem oil or wettable sulfur.',
          te: 'ఫ్రూట్ ఫ్లై బుట్టలు కట్టి వేప నూనె చల్లండి.',
          hi: 'फ्रूट फ्लाई ट्रैप लगाएं और नीम तेल या घुलनशील सल्फर छिड़कें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '45–75 days',
      expectedYieldKgPerAcre: 8500,
      readinessSigns: {
        en: 'Pick crisp young green cucumbers every 2 days before seeds swell inside.',
        te: 'లోపల విత్తనాలు ముదరకముందే ప్రతి 2 రోజులకు లేత కీరా కోయండి.',
        hi: 'बीज बड़े होने से पहले हर 2 दिन में हरे और ताजे खीरे तोड़ें।',
      },
      storageTip: {
        en: 'Keep harvested cucumbers cool and damp in shade—never expose to hot afternoon sun.',
        te: 'కోసిన తర్వాత ఎండలో పెట్టకుండా చల్లని నీడలో ఉంచండి.',
        hi: 'तुड़ाई के बाद तेज धूप से बचाकर छाया में ठंडी जगह रखें।',
      },
    },
    weatherAdvice: {
      en: 'Give extra light drip in dry summer winds to avoid bitter fruit taste.',
      te: 'వేసవి వడగాలులలో తేమ తగ్గకుండా డ్రిప్ నీరు ఇవ్వండి.',
      hi: 'लू चलने पर हल्की नियमित सिंचाई करें ताकि खीरा कड़वा न हो।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–6', action: { en: 'Form raised beds with drip and trellis poles.', te: 'డ్రిప్ మరియు పందిరి కర్రలతో ఎత్తు బెడ్లు చేయండి.', hi: 'ड्रिप और मचान के खंभों के साथ क्यारियाँ बनाएं।' } },
      sowing: { days: 'Day 7–9', action: { en: 'Sow 2 seeds per spot 2 cm deep.', te: 'చోటుకు 2 విత్తనాలు 2 సెం.మీ లోతులో వేయండి.', hi: 'हर स्थान पर 2 बीज 2 सेमी गहरे बोएं।' } },
      germination: { days: 'Day 10–16', action: { en: 'Protect young cotyledons from beetles.', te: 'లేత ఆకులను పెంకు పురుగుల నుండి కాపాడండి.', hi: 'नए पौधों को कीटों से बचाएं।' } },
      vegetative_growth: { days: 'Day 17–30', action: { en: 'Train tendrils onto nylon trellis net.', te: 'తీగలను వల పైకి ఎక్కించండి.', hi: 'बेलों को जाली पर चढ़ाएं।' } },
      flowering: { days: 'Day 31–44', action: { en: 'Hang fruit fly traps and spray Neem oil in evening.', te: 'ఫ్రూట్ ఫ్లై బుట్టలు కట్టి సాయంత్రం వేప నూనె చల్లండి.', hi: 'फ्रूट फ्लाई ट्रैप लगाएं और शाम को नीम तेल छिड़कें।' } },
      maturity: { days: 'Day 45–50', action: { en: 'Keep daily moisture steady so fruits stay sweet & crisp.', te: 'కాయలు చేదు రాకుండా తేమ క్రమంగా ఉంచండి.', hi: 'फल मीठे व कुरकुरे रहें इसलिए नमी बनाए रखें।' } },
      harvesting: { days: 'Day 48–75', action: { en: 'Pick crisp tender cucumbers every 2 days.', te: 'ప్రతి 2 రోజులకు లేత కీరా దోసకాయలు కోయండి.', hi: 'हर 2 दिन में ताजे नरम खीरे तोड़ें।' } },
    },
  },
  {
    id: 'bottle_gourd',
    category: 'vegetables',
    emoji: '🫑',
    names: { en: 'Bottle Gourd (Lauki / Sorakaya)', te: 'సొరకాయ (ఆనపకాయ)', hi: 'लौकी' },
    defaultVariety: 'Pusa Naveen / Warad Hybrid',
    bestSeason: {
      en: 'Feb–Mar (Summer) & Jun–Jul (Kharif)',
      te: 'ఫిబ్రవరి–మార్చి & జూన్–జూలై',
      hi: 'फरवरी–मार्च और जून–जुलाई',
    },
    plantation: {
      seedRateKgPerAcre: 1.5,
      spacing: '2.5 m × 0.8 m',
      depthCm: '3 cm',
      tip: {
        en: 'Pinch main vine tip at 7–8 leaves ("3G cutting") to grow side branches that carry mostly female flowers and double the yield!',
        te: '7–8 ఆకుల వద్ద ప్రధాన తీగ చివర తుంచితే పక్క కొమ్మలపై ఎక్కువ ఆడ పూలు వచ్చి దిగుబడి రెట్టింపు అవుతుంది!',
        hi: '7–8 पत्ती पर मुख्य बेल का सिरा काट दें—इससे निकली शाखाओं में ज्यादा फल आते हैं!',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 3400,
      method: 'Drip / Basin',
      tip: {
        en: 'Water steadily once vines spread onto the pandal (trellis).',
        te: 'తీగలు పందిరి ఎక్కిన తర్వాత క్రమంగా నీరు ఇవ్వండి.',
        hi: 'बेल मचान पर फैलने के बाद नियमित सिंचाई करें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Potash', kgPerAcre: 100, timing: 'At sowing' },
      { stage: 'Flowering', name: 'Urea + Micronutrients', kgPerAcre: 25, timing: 'Day 35 & 60' },
    ],
    pests: [
      {
        name: 'Fruit Fly & Red Pumpkin Beetle',
        observationSign: {
          en: 'Orange-red beetles chewing young leaves or maggot-rotten gourds.',
          te: 'లేత ఆకులను తినే ఎర్ర పెంకు పురుగులు లేదా కాయలో పురుగులు.',
          hi: 'नए पत्तों को खाने वाले लाल भृंग या फल में इल्ली का सड़न।',
        },
        treatment: {
          en: 'Hang Cue-lure traps and wrap/remove punctured young fruits promptly.',
          te: 'ఫ్రూట్ ఫ్లై బుట్టలు కట్టి పురుగు పడిన కాయలను తీసేయండి.',
          hi: 'फ्रूट फ्लाई ट्रैप लगाएं और खराब फलों को तुरंत हटा दें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '55–120 days',
      expectedYieldKgPerAcre: 13000,
      readinessSigns: {
        en: 'Skin is bright light-green with soft fuzz and easily punctured by a fingernail.',
        te: 'కాయ లేత ఆకుపచ్చగా ఉండి గోరుతో నొక్కితే సులభంగా దిగితే కోతకు సిద్ధం.',
        hi: 'लौकी हल्की हरी व मुलायम हो और नाखून आसानी से धंस जाए तो तोड़ लें।',
      },
      storageTip: {
        en: 'Pack straight gourds carefully in crates lined with paddy straw.',
        te: 'వెంకలు లేని కాయలను గడ్డి పరచిన క్రేట్లలో జాగ్రత్తగా సర్దండి.',
        hi: 'सीधी लौकियों को पुआल बिछे क्रेट में सुरक्षित रखें।',
      },
    },
    weatherAdvice: {
      en: 'Trellis farming keeps bottle gourds clean off muddy monsoon soil.',
      te: 'పందిరి సాగు వల్ల వర్షాకాలంలో కాయలు బురదలో కుళ్ళిపోకుండా ఉంటాయి.',
      hi: 'मचान विधि से बारिश में भी लौकी कीचड़ से खराब नहीं होती।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–10', action: { en: 'Build bamboo/wire overhead pandal (trellis).', te: 'వెదురు కర్రలు, తీగలతో పందిరి వేయండి.', hi: 'बांस व तार से मजबूत मचान बनाएं।' } },
      sowing: { days: 'Day 11–14', action: { en: 'Sow 2–3 seeds per basin 3 cm deep.', te: 'గుంటకు 2–3 విత్తనాలు 3 సెం.మీ లోతులో వేయండి.', hi: 'थालों में 2–3 बीज 3 सेमी गहरे बोएं।' } },
      germination: { days: 'Day 15–22', action: { en: 'Keep tender sprouts safe from beetles.', te: 'మొలకలను పెంకు పురుగుల నుండి కాపాడండి.', hi: 'अंकुरों को लाल भृंग से बचाएं।' } },
      vegetative_growth: { days: 'Day 23–40', action: { en: 'Guide main stem onto trellis and pinch tip at 8 leaves.', te: 'తీగను పందిరి ఎక్కించి 8 ఆకుల వద్ద చిగురు తుంచండి.', hi: 'मुख्य बेल को मचान पर चढ़ाकर सिरा काटें।' } },
      flowering: { days: 'Day 41–55', action: { en: 'Hang fruit fly traps; evening flowers attract pollinators.', te: 'ఫ్రూట్ ఫ్లై బుట్టలు కట్టండి.', hi: 'फल मक्खी के ट्रैप लटकाएं।' } },
      maturity: { days: 'Day 56–65', action: { en: 'Gourds elongate rapidly in 8–10 days after fruit set.', te: 'పిందె వేసిన 8–10 రోజుల్లో కాయ కోతకు వస్తుంది.', hi: 'फल लगने के 8–10 दिन में लौकी तुड़ाई लायक हो जाती है।' } },
      harvesting: { days: 'Day 60–125', action: { en: 'Cut tender light-green gourds every 3 days.', te: 'ప్రతి 3 రోజులకు లేత సొరకాయలు కోయండి.', hi: 'हर 3 दिन में नरम हरी लौकी काटें।' } },
    },
  },
  {
    id: 'carrot',
    category: 'vegetables',
    emoji: '🥕',
    names: { en: 'Carrot', te: 'క్యారెట్', hi: 'गाजर' },
    defaultVariety: 'Pusa Rudhira / Nantes / Kuroda',
    bestSeason: {
      en: 'Sep–Nov (Rabi cool winter)',
      te: 'సెప్టెంబర్–నవంబర్',
      hi: 'सितंबर–नवंबर (सर्दी)',
    },
    plantation: {
      seedRateKgPerAcre: 2.5,
      spacing: '30 cm × 8 cm',
      depthCm: '1–1.5 cm',
      tip: {
        en: 'Mix tiny carrot seeds with fine dry sand for even sowing, and thin crowded seedlings at 20 days so roots grow thick and straight.',
        te: 'సన్నని క్యారెట్ విత్తనాలను ఇసుకతో కలిపి చల్లండి; 20 రోజులకు ఒత్తుగా ఉన్న మొక్కలు తీసేయండి.',
        hi: 'बारीक बीजों को सूखी रेत में मिलाकर बोएं और 20 दिन पर घने पौधे छांटें ताकि गाजर मोटी बने।',
      },
    },
    irrigation: {
      frequencyDays: 6,
      litersPerAcre: 2600,
      method: 'Sprinkler / Furrow',
      tip: {
        en: 'Give light watering right after sowing so crust does not block delicate sprouts.',
        te: 'విత్తిన వెంటనే తేలికపాటి నీరు ఇస్తే మొలకలు సులభంగా పైకి వస్తాయి.',
        hi: 'बुवाई के तुरंत बाद हल्का पानी दें ताकि मिट्टी की परत सख्त न हो।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Well-rotted Compost + Potash + SSP', kgPerAcre: 90, timing: 'Before sowing' },
      { stage: 'Day 25', name: 'Urea (light dose)', kgPerAcre: 20, timing: 'After thinning' },
    ],
    pests: [
      {
        name: 'Forked Roots / Leaf Blight',
        observationSign: {
          en: 'Roots splitting into two branches (caused by fresh unrotted dung) or brown leaf spots.',
          te: 'దుంపలు రెండుగా చీలడం లేదా ఆకులపై గోధుమ మచ్చలు.',
          hi: 'गाजर की जड़ का दो भागों में बंटना (कच्चे गोबर से) या पत्तियों पर भूरे धब्बे।',
        },
        treatment: {
          en: 'Never apply fresh raw manure right before carrot sowing; use only well-rotted compost.',
          te: 'క్యారెట్‌కు ముందు పచ్చి పేడ వేయకండి—బాగా మాగిన కంపోస్టు మాత్రమే వాడండి.',
          hi: 'बुवाई से पहले कभी कच्चा गोबर न डालें—केवल पूरी सड़ी खाद का उपयोग करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '75–90 days',
      expectedYieldKgPerAcre: 8500,
      readinessSigns: {
        en: 'Top crown shoulder reaches 2.5–3 cm wide with bright orange/red color.',
        te: 'పై భాగం 2.5–3 సెం.మీ వెడల్పుతో ప్రకాశవంతమైన నారింజ/ఎరుపు రంగు వచ్చినప్పుడు తీయండి.',
        hi: 'ऊपरी सिरा 2.5–3 सेमी चौड़ा और चमकीला लाल-नारंगी दिखे तो उखाड़ लें।',
      },
      storageTip: {
        en: 'Wash soil gently in cool water, trim green tops to 2 cm, and pack cleanly.',
        te: 'మట్టిని చల్లని నీటితో కడిగి, ఆకులు కత్తిరించి శుభ్రంగా ప్యాక్ చేయండి.',
        hi: 'ताजे पानी से मिट्टी धोकर, ऊपर की पत्तियाँ काटकर साफ बोरों में भरें।',
      },
    },
    weatherAdvice: {
      en: 'Cool 15–22°C produces deep orange-red color and sweet taste.',
      te: '15–22°C చలిలో క్యారెట్ మంచి రంగు మరియు తీపితో వస్తుంది.',
      hi: '15–22°C ठंड में गाजर का रंग गहरा और स्वाद बहुत मीठा होता है।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–10', action: { en: 'Plough deeply 30 cm into fine loose stone-free ridges.', te: 'రాళ్ళు లేకుండా 30 సెం.మీ లోతు వరకు మెత్తగా దున్నండి.', hi: 'बिना पत्थर के 30 सेमी गहरी भुरभुरी मिट्टी और मेड़ें बनाएं।' } },
      sowing: { days: 'Day 11–13', action: { en: 'Mix seeds with sand and sow shallow 1 cm deep.', te: 'విత్తనాలను ఇసుకతో కలిపి 1 సెం.మీ లోతులో వేయండి.', hi: 'बीज को रेत में मिलाकर 1 सेमी गहराई में बोएं।' } },
      germination: { days: 'Day 14–24', action: { en: 'Keep top 2 cm moist until feathery leaves emerge.', te: 'ఆకులు వచ్చే వరకు పై మట్టిని తేమగా ఉంచండి.', hi: 'अंकुरण होने तक ऊपरी मिट्टी नम रखें।' } },
      vegetative_growth: { days: 'Day 25–45', action: { en: 'Thin plants to 8 cm spacing and weed carefully.', te: 'మొక్కల మధ్య 8 సెం.మీ దూరం ఉండేలా పల్చన చేయండి.', hi: 'पौधों के बीच 8 सेमी दूरी रखकर छंटाई व निराई करें।' } },
      flowering: { days: 'Day 46–60', action: { en: 'Roots elongate downward; avoid waterlogging.', te: 'దుంపలు కిందికి పెరుగుతాయి; నీరు నిలవనీయకండి.', hi: 'जड़ें तेजी से बढ़ती हैं; पानी न जमा होने दें।' } },
      maturity: { days: 'Day 61–75', action: { en: 'Give light watering before pulling so roots do not snap.', te: 'తీసే ముందు తేలికగా తడిపితే దుంపలు విరగకుండా వస్తాయి.', hi: 'उखाड़ने से पहले हल्की सिंचाई करें ताकि गाजर न टूटे।' } },
      harvesting: { days: 'Day 76–90', action: { en: 'Pull bright roots, wash clean, and trim tops.', te: 'క్యారెట్లు తీసి కడిగి ఆకులు కత్తిరించండి.', hi: 'गाजर उखाड़ें, धोएं और ऊपर की पत्तियाँ काटें।' } },
    },
  },
  {
    id: 'spinach',
    category: 'vegetables',
    emoji: '🥬',
    names: { en: 'Spinach (Palak)', te: 'పాలకూర', hi: 'पालक' },
    defaultVariety: 'All Green / Pusa Bharati',
    bestSeason: {
      en: 'Year-round (Best Sep–Feb)',
      te: 'ఏడాది పొడవునా (సెప్టెం–ఫిబ్ర ఉత్తమం)',
      hi: 'पूरे वर्ष (सितंबर–फरवरी सबसे अच्छा)',
    },
    plantation: {
      seedRateKgPerAcre: 8,
      spacing: '20 cm × 5 cm',
      depthCm: '1.5–2 cm',
      tip: {
        en: 'Sow in small flat beds divided by channels so you can harvest fresh cuttings every 15 days!',
        te: 'చిన్న మడులుగా చేసి విత్తితే ప్రతి 15 రోజులకు తాజా ఆకుకూర కోసుకోవచ్చు!',
        hi: 'छोटी समतल क्यारियों में बुवाई करें ताकि हर 15 दिन में ताजी कटाई मिल सके!',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 2400,
      method: 'Sprinkler / Light Flood',
      tip: {
        en: 'Water lightly right after each leaf cutting so new tender leaves bounce back fast.',
        te: 'ప్రతిసారి ఆకుకూర కోసిన వెంటనే నీరు పెడితే కొత్త ఆకులు త్వరగా వస్తాయి.',
        hi: 'हर कटाई के तुरंत बाद हल्की सिंचाई करें ताकि नई पत्तियाँ तेजी से उगें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Well-rotted Compost + SSP', kgPerAcre: 100, timing: 'At sowing' },
      { stage: 'After Each Cut', name: 'Urea / Vermiwash', kgPerAcre: 15, timing: 'Every cutting' },
    ],
    pests: [
      {
        name: 'Leaf Eating Caterpillar & Leaf Spot',
        observationSign: {
          en: 'Holes chewed in broad green leaves or white-brown pinhead spots.',
          te: 'ఆకులపై రంధ్రాలు లేదా చిన్న తెల్ల మచ్చలు.',
          hi: 'पत्तियों में छेद या सफेद-भूरे छोटे धब्बे।',
        },
        treatment: {
          en: 'Use safe Neem oil spray at least 7 days before cutting; avoid harsh chemical sprays on leafy greens!',
          te: 'ఆకుకూరలపై తీవ్రమైన రసాయనాలు వాడకండి—కోతకు 7 రోజుల ముందు వేప నూనె మాత్రమే వాడండి.',
          hi: 'पत्तेदार सब्जियों पर तेज रासायनिक दवा न डालें—कटाई से 7 दिन पहले केवल नीम तेल छिड़कें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '28–35 days first cut (4–5 cuts total)',
      expectedYieldKgPerAcre: 4500,
      readinessSigns: {
        en: 'Cut tender dark-green leaves 5 cm above soil using a sharp sickle so crown regrows.',
        te: 'మొక్క మొదలుకు 5 సెం.మీ పైన పదునైన కొడవలితో కోస్తే మళ్ళీ చిగురిస్తుంది.',
        hi: 'जमीन से 5 सेमी ऊपर से तेज दरांती से काटें ताकि पौधा फिर से उगे।',
      },
      storageTip: {
        en: 'Tie into neat clean bunches, sprinkle cool water lightly, and sell the same morning.',
        te: 'కట్టలుగా కట్టి చల్లని నీరు చిలకరించి అదే ఉదయం మార్కెట్‌కు పంపండి.',
        hi: 'साफ गड्डियाँ बांधें, हल्का ठंडा पानी छिड़कें और उसी सुबह मंडी भेजें।',
      },
    },
    weatherAdvice: {
      en: 'Fast 30-day cash income crop—use shade net in peak May heat.',
      te: '30 రోజుల్లో ఆదాయం ఇచ్చే పంట—మే నెల ఎండల్లో షేడ్ నెట్ వాడవచ్చు.',
      hi: '30 दिन में कमाई देने वाली फसल—तेज गर्मी में छाया जाली लगा सकते हैं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–4', action: { en: 'Make smooth flat seedbeds with compost.', te: 'కంపోస్టుతో సమమైన చిన్న మడులు చేయండి.', hi: 'खाद मिलाकर समतल छोटी क्यारियाँ बनाएं।' } },
      sowing: { days: 'Day 5–6', action: { en: 'Sow seeds in shallow lines 20 cm apart.', te: '20 సెం.మీ దూరంలో గీతలలో విత్తనాలు చల్లండి.', hi: '20 सेमी की कतारों में बीज बोएं।' } },
      germination: { days: 'Day 7–14', action: { en: 'Sprouts appear in 6 days; keep beds moist.', te: '6 రోజుల్లో మొలకలు వస్తాయి; తేమ ఉంచండి.', hi: '6 दिन में अंकुरण होता है; हल्की नमी रखें।' } },
      vegetative_growth: { days: 'Day 15–27', action: { en: 'Pull tiny weeds by hand and feed light Urea.', te: 'చేతితో కలుపు తీసి కొద్దిగా యూరియా వేయండి.', hi: 'हाथ से निराई कर हल्का यूरिया डालें।' } },
      flowering: { days: 'Day 28–35', action: { en: 'First lush dark-green leaf canopy is ready!', te: 'మొదటి పచ్చని ఆకుకూర కోతకు సిద్ధం!', hi: 'पहली हरी-भरी कटाई तैयार है!' } },
      maturity: { days: 'Day 36–70', action: { en: 'Irrigate and feed light nitrogen after every cut.', te: 'ప్రతి కోత తర్వాత నీరు, కొద్దిపాటి నత్రజని ఇవ్వండి.', hi: 'हर कटाई के बाद पानी और हल्की खाद दें।' } },
      harvesting: { days: 'Day 30–80', action: { en: 'Harvest 4–5 fresh cuttings every 15 days.', te: 'ప్రతి 15 రోజులకు 4–5 సార్లు కోసుకోవచ్చు.', hi: 'हर 15 दिन में 4–5 बार ताजी कटाई करें।' } },
    },
  },

  // ============ SPICES ============
  {
    id: 'ginger',
    category: 'spices',
    emoji: '🫚',
    names: { en: 'Ginger', te: 'అల్లం', hi: 'अदरक' },
    defaultVariety: 'Maran / Nadia / Rio-de-Janeiro',
    bestSeason: {
      en: 'Apr–May pre-monsoon planting',
      te: 'ఏప్రిల్–మే నాట్లు',
      hi: 'अप्रैल–मई बुवाई',
    },
    plantation: {
      seedRateKgPerAcre: 650,
      spacing: '30 cm × 20 cm',
      depthCm: '5 cm',
      tip: {
        en: 'Plant healthy plumpy rhizomes (25–30g) on raised beds and cover deeply with green/dry leaf mulch.',
        te: 'ఎత్తైన మడులపై ఆరోగ్యకరమైన విత్తన అల్లం నాటి ఆకులతో మల్చింగ్ చేయండి.',
        hi: 'ऊंची क्यारियों में स्वस्थ कंद लगाकर पत्तियों से अच्छी तरह ढक दें (मल्चिंग)।',
      },
    },
    irrigation: {
      frequencyDays: 7,
      litersPerAcre: 3200,
      method: 'Drip / Sprinkler',
      tip: {
        en: 'Zero waterlogging tolerance—ensure sloped drainage around every bed.',
        te: 'నీరు అస్సలు నిలవకూడదు—ప్రతి మడి చుట్టూ నీరు పోయే కాలువ ఉండాలి.',
        hi: 'पानी बिल्कुल जमा न होने दें—हर क्यारी के किनारे नाली जरूर बनाएं।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'FYM + Neem Cake + SSP', kgPerAcre: 200, timing: 'At planting' },
      { stage: 'Earthing Up', name: 'Urea + Potash', kgPerAcre: 40, timing: 'Day 45 & 90' },
    ],
    pests: [
      {
        name: 'Soft Rot & Shoot Borer',
        observationSign: {
          en: 'Yellowing leaves starting from bottom collar that smells soft and rotten.',
          te: 'కింది ఆకులు పసుపు రంగులోకి మారి మొదలు మెత్తబడి వాసన రావడం.',
          hi: 'निचली पत्तियाँ पीली पड़ना और जड़ के पास का हिस्सा नरम व बदबूदार होकर सड़ना।',
        },
        treatment: {
          en: 'Dig out infected clumps immediately and drench adjacent beds with Trichoderma/recommended control.',
          te: 'కుళ్ళిన దుబ్బులను తీసివేసి పక్క మడులలో ట్రైకోడెర్మా ద్రావణం పోయండి.',
          hi: 'सड़े पौधे उखाड़कर हटाएं और पास के पौधों में ट्राइकोडर्मा का घोल डालें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '210–240 days',
      expectedYieldKgPerAcre: 6500,
      readinessSigns: {
        en: 'Leaves turn yellow and dry down cleanly onto soil.',
        te: 'ఆకులు పసుపు రంగులోకి మారి ఎండిపోయినప్పుడు తవ్వండి.',
        hi: 'पत्तियाँ पीली होकर सूखने लगें तब अदरक की खुदाई करें।',
      },
      storageTip: {
        en: 'Wash mud cleanly, dry in shade for 2–3 days, and sell fresh or store in cool pits.',
        te: 'మట్టి కడిగి 2–3 రోజులు నీడలో ఆరబెట్టి అమ్మండి.',
        hi: 'मिट्टी धोकर 2–3 दिन छाया में सुखाएं और बेचें या ठंडे गड्ढे में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Keep drains open before heavy monsoon rain; mulch prevents soil erosion.',
      te: 'వర్షాలకు ముందే కాలువలు శుభ్రం చేయండి; మల్చింగ్ మట్టిని కాపాడుతుంది.',
      hi: 'भारी बारिश से पहले नालियाँ साफ रखें; मल्चिंग से मिट्टी नहीं बहती।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–12', action: { en: 'Build 15 cm raised beds with plenty of compost.', te: 'కంపోస్టుతో 15 సెం.మీ ఎత్తు మడులు చేయండి.', hi: 'खाद मिलाकर 15 सेमी ऊंची क्यारियाँ बनाएं।' } },
      sowing: { days: 'Day 13–18', action: { en: 'Plant treated seed rhizomes and mulch immediately.', te: 'విత్తన అల్లం నాటి వెంటనే ఆకులతో కప్పండి.', hi: 'उपचारित कंद बोकर तुरंत पत्तियों से ढकें।' } },
      germination: { days: 'Day 19–45', action: { en: 'Shoots emerge in 3–4 weeks under moist mulch.', te: '3–4 వారాలలో మొలకలు వస్తాయి.', hi: 'मल्च के नीचे 3–4 सप्ताह में अंकुरण होता है।' } },
      vegetative_growth: { days: 'Day 46–120', action: { en: 'Apply split mulch, urea, and earth up soil.', te: 'మట్టి ఎగదోసి ఎరువు మరియు మల్చింగ్ వేయండి.', hi: 'खाद डालकर मिट्टी चढ़ाएं और दोबारा मल्चिंग करें।' } },
      flowering: { days: 'Day 121–170', action: { en: 'Rhizomes bulk thickly underground; feed Potash.', te: 'భూమిలో అల్లం ఊరుతుంది; పొటాష్ వేయండి.', hi: 'जमीन में अदरक मोटा होता है; पोटाश दें।' } },
      maturity: { days: 'Day 171–210', action: { en: 'Stop irrigation 3 weeks before digging.', te: 'తవ్వకానికి 3 వారాల ముందు నీరు ఆపండి.', hi: 'खुदाई से 3 सप्ताह पहले सिंचाई बंद करें।' } },
      harvesting: { days: 'Day 211–240', action: { en: 'Dig carefully with fork, wash, and shade-dry.', te: 'దెబ్బతగలకుండా తవ్వి, కడిగి నీడలో ఆరబెట్టండి.', hi: 'सावधानी से खोदें, धोएं और छाया में सुखाएं।' } },
    },
  },
  {
    id: 'garlic',
    category: 'spices',
    emoji: '🧄',
    names: { en: 'Garlic', te: 'వెల్లుల్లి', hi: 'लहसुन' },
    defaultVariety: 'Yamuna Safed (G-1) / G-282',
    bestSeason: {
      en: 'Oct–Nov (Rabi cool sowing)',
      te: 'అక్టోబర్–నవంబర్',
      hi: 'अक्टूबर–नवंबर',
    },
    plantation: {
      seedRateKgPerAcre: 200,
      spacing: '15 cm × 10 cm',
      depthCm: '3 cm (point up)',
      tip: {
        en: 'Plant healthy outer big cloves upright with pointed tip facing UP!',
        te: 'బయటి పెద్ద వెల్లుల్లి పాయలను మొన పైకి ఉండేలా నిలువుగా నాటండి!',
        hi: 'बाहर की बड़ी स्वस्थ कलियाँ चुनें और नोक ऊपर की तरफ रखकर बोएं!',
      },
    },
    irrigation: {
      frequencyDays: 8,
      litersPerAcre: 2800,
      method: 'Sprinkler / Light Flood',
      tip: {
        en: 'Stop irrigation 15 days before harvesting so bulbs do not split or rot in storage.',
        te: 'నిల్వలో కుళ్ళిపోకుండా కోతకు 15 రోజుల ముందు నీరు ఆపండి.',
        hi: 'भंडारण में सड़न रोकने के लिए कटाई से 15 दिन पहले पानी बंद करें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Sulfur', kgPerAcre: 85, timing: 'At planting' },
      { stage: 'Bulb Init', name: 'Urea + Potash', kgPerAcre: 30, timing: 'Day 35 & 60' },
    ],
    pests: [
      {
        name: 'Thrips & Purple Blotch',
        observationSign: {
          en: 'Silvery leaf tips drying early or purple spots on stalks.',
          te: 'ఆకుల చివర్లు వెండి రంగులో ఎండడం లేదా ఊదా మచ్చలు.',
          hi: 'पत्तियों के सिरे चांदी जैसे सूखना या बैंगनी धब्बे।',
        },
        treatment: {
          en: 'Spray Neem oil with sticking agent in cool morning hours.',
          te: 'ఉదయాన్నే జిగురుతో కలిపి వేప నూనె పిచికారీ చేయండి.',
          hi: 'सुबह चिपको मिलाकर नीम तेल का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '130–150 days',
      expectedYieldKgPerAcre: 3500,
      readinessSigns: {
        en: '50% of tops turn yellowish-brown and bend downward.',
        te: '50% ఆకులు పసుపు గోధుమ రంగులోకి మారి వాలిపోయినప్పుడు తవ్వండి.',
        hi: 'जब 50% पत्तियाँ पीली-भूरी होकर झुक जाएं तो खुदाई करें।',
      },
      storageTip: {
        en: 'Tie into small bundles and dry in airy shade for 10 days before hanging or bagging.',
        te: 'చిన్న కట్టలుగా కట్టి 10 రోజులు నీడలో ఆరబెట్టి నిల్వ చేయండి.',
        hi: 'छोटे बंडल बांधकर 10 दिन हवादार छाया में सुखाकर रखें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid rain or irrigation on mature drying bulbs before pulling.',
      te: 'కోత సమయంలో పొలం తడవకుండా చూడండి.',
      hi: 'कटाई के समय खेत को नमी और बारिश से बचाएं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–8', action: { en: 'Make fine flat beds with compost & sulfur.', te: 'సల్ఫర్, కంపోస్టు కలిపి సమమైన మడులు చేయండి.', hi: 'खाद व सल्फर मिलाकर समतल क्यारियाँ बनाएं।' } },
      sowing: { days: 'Day 9–12', action: { en: 'Press big cloves upright 3 cm deep, tip up.', te: 'పెద్ద పాయలను మొన పైకి ఉంచి నాటండి.', hi: 'बड़ी कलियों को नोक ऊपर रखकर 3 सेमी गहरा बोएं।' } },
      germination: { days: 'Day 13–24', action: { en: 'Give light moisture so roots anchor down.', te: 'వేర్లు పట్టడానికి తేలికగా నీరు ఇవ్వండి.', hi: 'जड़ें जमने के लिए हल्की नमी रखें।' } },
      vegetative_growth: { days: 'Day 25–65', action: { en: 'Weed gently and apply Urea + Sulfur.', te: 'కలుపు తీసి యూరియా, సల్ఫర్ వేయండి.', hi: 'निराई कर यूरिया और सल्फर डालें।' } },
      flowering: { days: 'Day 66–95', action: { en: 'Cloves start dividing inside underground bulb.', te: 'భూమిలో గడ్డ పాయలుగా విడిపోవడం మొదలవుతుంది.', hi: 'जमीन के नीचे गांठ में कलियाँ बनने लगती हैं।' } },
      maturity: { days: 'Day 96–130', action: { en: 'Tops yellow; stop watering 15 days early.', te: 'ఆకులు పసుపు రంగుకు రాగానే 15 రోజుల ముందు నీరు ఆపండి.', hi: 'पत्तियाँ पीली पड़ने पर 15 दिन पहले सिंचाई बंद करें।' } },
      harvesting: { days: 'Day 131–150', action: { en: 'Pull bulbs, shade-cure for 10 days, and clean.', te: 'వెల్లుల్లి తీసి 10 రోజులు నీడలో ఆరబెట్టండి.', hi: 'लहसुन उखाड़ें और 10 दिन छाया में सुखाएं।' } },
    },
  },
  {
    id: 'coriander',
    category: 'spices',
    emoji: '🌿',
    names: { en: 'Coriander (Dhaniya)', te: 'కొత్తిమీర / ధనియాలు', hi: 'धनिया' },
    defaultVariety: 'Pant Haritima / Sadhana',
    bestSeason: {
      en: 'Oct–Nov (Grain & Leaf) & Year-round for green leaf',
      te: 'అక్టోబర్–నవంబర్ (ధనియాలు), కొత్తిమీర ఏడాది పొడవునా',
      hi: 'अक्टूबर–नवंबर (दाने), हरी पत्ती पूरे वर्ष',
    },
    plantation: {
      seedRateKgPerAcre: 6,
      spacing: '25 cm × 10 cm',
      depthCm: '2 cm',
      tip: {
        en: 'Gently rub whole round seeds with a wooden plank to split each seed into two halves before sowing—doubles sprouting speed!',
        te: 'విత్తే ముందు ధనియాలను బద్దలుగా నలిపి నానబెట్టి వేస్తే త్వరగా, రెండు రెట్లు మొలకెత్తుతాయి!',
        hi: 'बुवाई से पहले साबुत धनिये को हल्के से रगड़कर दो दाल कर लें—अंकुरण दोगुना तेज होता है!',
      },
    },
    irrigation: {
      frequencyDays: 7,
      litersPerAcre: 2400,
      method: 'Sprinkler / Light Flood',
      tip: {
        en: 'Keep soil gently moist for the first 12 days until slow sprouts emerge.',
        te: 'మొలకలు వచ్చే వరకు మొదటి 12 రోజులు నేలను తేమగా ఉంచండి.',
        hi: 'शुरुआती 12 दिन तक अंकुरण होने तक हल्की नमी बनाए रखें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP', kgPerAcre: 60, timing: 'At sowing' },
      { stage: 'Day 30', name: 'Urea', kgPerAcre: 20, timing: 'Vegetative flush' },
    ],
    pests: [
      {
        name: 'Aphids & Powdery Mildew',
        observationSign: {
          en: 'Sticky green aphids on umbrella flowers or white powder on stems.',
          te: 'పూతపై ఆకుపచ్చ పేనుబంక లేదా కొమ్మలపై తెల్ల బూడిద.',
          hi: 'फूलों के गुच्छों पर हरे माहू या तनों पर सफेद पाउडर।',
        },
        treatment: {
          en: 'Spray Neem oil early morning (safe for leaves) or wettable sulfur for grain crop.',
          te: 'ఉదయాన్నే వేప నూనె పిచికారీ చేయండి.',
          hi: 'सुबह नीम तेल का सुरक्षित छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '35–45 days (leaves) / 100–115 days (seeds)',
      expectedYieldKgPerAcre: 650,
      readinessSigns: {
        en: 'For fresh leaf: cut at 15 cm height. For spice seeds: harvest when 75% grains turn light brown.',
        te: 'కొత్తిమీర కోసం 15 సెం.మీ ఎత్తులో, ధనియాల కోసం 75% గింజలు గోధుమ రంగులోకి మారినప్పుడు కోయండి.',
        hi: 'हरी पत्ती 15 सेमी पर काटें; मसाले के दाने के लिए 75% दाने भूरे होने पर काटें।',
      },
      storageTip: {
        en: 'Dry seed bundles in shade for bright green-gold aromatic dhaniya grains.',
        te: 'సువాసన పోకుండా ధనియాలను నీడలో ఆరబెట్టి నూర్పిడి చేయండి.',
        hi: 'सुगंध और रंग बनाए रखने के लिए छाया में सुखाकर दाने निकालें।',
      },
    },
    weatherAdvice: {
      en: 'Shade nets help grow lush green coriander leaves even in hot summer.',
      te: 'వేసవిలో షేడ్ నెట్ కింద కొత్తిమీర సాగు చేస్తే మంచి ధర వస్తుంది.',
      hi: 'गर्मियों में छाया जाली से हरी पत्ती वाली धनिया बहुत अच्छी उगती है।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–5', action: { en: 'Prepare fine smooth flat beds.', te: 'మట్టిని మెత్తగా చేసి సమమైన మడులు చేయండి.', hi: 'भुरभुरी समतल क्यारियाँ तैयार करें।' } },
      sowing: { days: 'Day 6–8', action: { en: 'Split seeds into halves, soak 8 hrs, and sow 2 cm deep.', te: 'ధనియాలను బద్దలు చేసి నానబెట్టి 2 సెం.మీ లోతులో వేయండి.', hi: 'बीज को दो दाल कर भिगोएं और 2 सेमी गहरा बोएं।' } },
      germination: { days: 'Day 9–20', action: { en: 'Keep soil moist until feathery sprouts appear.', te: 'మొలకలు వచ్చే వరకు తడి ఆరనీయకండి.', hi: 'अंकुरण तक मिट्टी को नम रखें।' } },
      vegetative_growth: { days: 'Day 21–45', action: { en: 'Cut fresh green coriander leaves or leave to grow for seeds.', te: 'తాజా కొత్తిమీర కోయండి లేదా ధనియాల కోసం ఉంచండి.', hi: 'हरी पत्ती काटें या बीज के लिए बढ़ने दें।' } },
      flowering: { days: 'Day 46–75', action: { en: 'White umbel flowers attract friendly bees.', te: 'తెల్లని పూలు వస్తాయి; తేనెటీగలను రక్షించండి.', hi: 'सफेद फूल आते हैं; मधुमक्खियों को बचाएं।' } },
      maturity: { days: 'Day 76–98', action: { en: 'Seeds swell green then turn aromatic tan.', te: 'గింజలు ఊరి లేత గోధుమ రంగులోకి మారుతాయి.', hi: 'दाने भरकर सुनहरे-भूरे होने लगते हैं।' } },
      harvesting: { days: 'Day 99–115', action: { en: 'Harvest before shattering, shade-dry, and thresh.', te: 'గింజలు రాలకముందే కోసి నీడలో ఆరబెట్టి నూర్పిడి చేయండి.', hi: 'दाने झड़ने से पहले काटें, छाया में सुखाएं और मड़ाई करें।' } },
    },
  },

  // ============ PULSES, OILSEEDS & MILLETS ============
  {
    id: 'red_gram',
    category: 'pulses_oilseeds',
    emoji: '🫘',
    names: { en: 'Red Gram (Tur / Arhar)', te: 'కందులు', hi: 'अरहर (तूर दाल)' },
    defaultVariety: 'ICPL-87119 (Asha) / PRG-176',
    bestSeason: {
      en: 'Kharif (June–July)',
      te: 'ఖరీఫ్ (జూన్–జూలై)',
      hi: 'खरीफ (जून–जुलाई)',
    },
    plantation: {
      seedRateKgPerAcre: 5,
      spacing: '90 cm × 30 cm',
      depthCm: '4 cm',
      tip: {
        en: 'Nip top growing bud at Day 35–40 for bushy branching and 20% more pods!',
        te: '35–40 రోజులకు పై చిగురు తుంచితే ఎక్కువ కొమ్మలు, కాయలు వస్తాయి!',
        hi: '35–40 दिन पर ऊपर की कोंपल तोड़ने से ज्यादा शाखाएँ और 20% अधिक फलियां आती हैं!',
      },
    },
    irrigation: {
      frequencyDays: 14,
      litersPerAcre: 3000,
      method: 'Furrow / Rainfed',
      tip: {
        en: 'Drought-hardy crop, but one life-saving watering at flowering & pod fill boosts yield dramatically.',
        te: 'పూత మరియు కాయ దశలో వర్షం లేకపోతే ఒక్కసారి నీరు పెడితే దిగుబడి బాగా పెరుగుతుంది.',
        hi: 'फूल और फली बनते समय सूखा हो तो एक सिंचाई करने से पैदावार काफी बढ़ जाती है।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP + Sulfur', kgPerAcre: 40, timing: 'At sowing' },
      { stage: 'Pod Set', name: '19-19-19 + Boron foliar', kgPerAcre: 3, timing: 'Flowering' },
    ],
    pests: [
      {
        name: 'Pod Borer (Maruca / Helicoverpa)',
        observationSign: {
          en: 'Webbed flowers stuck together or round holes bored into green pods.',
          te: 'పూలు గూడు కట్టుకుని అతుక్కోవడం లేదా కాయలపై రంధ్రాలు.',
          hi: 'फूलों का जाले में लिपटना या हरी फलियों में गोल छेद दिखना।',
        },
        treatment: {
          en: 'Install bird perches (15/acre) and pheromone traps; spray Neem oil at 50% flowering.',
          te: 'ఎకరాకు 15 పక్షి కర్రలు, లింగాకర్షక బుట్టలు పెట్టి పూతలో వేప నూనె చల్లండి.',
          hi: 'खेत में 15 बर्ड पर्च व फेरोमोन ट्रैप लगाएं और 50% फूल पर नीम तेल छिड़कें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '150–175 days',
      expectedYieldKgPerAcre: 750,
      readinessSigns: {
        en: '75–80% of pods turn brown and dry while stems still have a few green leaves.',
        te: '75–80% కాయలు గోధుమ రంగులోకి మారి ఎండినప్పుడు కోయండి.',
        hi: 'जब 75–80% फलियां भूरी होकर सूख जाएं तो कटाई करें।',
      },
      storageTip: {
        en: 'Sun-dry threshed seeds well and mix with a pinch of Neem leaf powder/oil to prevent store weevils.',
        te: 'పురుగు పట్టకుండా గింజలను బాగా ఎండబెట్టి ఎండు వేపాకులతో నిల్వ చేయండి.',
        hi: 'घुन से बचाने के लिए दानों को धूप में सुखाकर सूखी नीम की पत्तियों के साथ रखें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid waterlogged low fields; cut drainage furrows in heavy monsoon.',
      te: 'నీరు నిలిచే లోతట్టు పొలాలలో వేయకండి—కాలువలు తీయండి.',
      hi: 'जलभराव वाले खेतों में न बोएं; बारिश के पानी की निकासी रखें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–7', action: { en: 'Plough deeply and open furrows for monsoon drainage.', te: 'లోతుగా దున్ని నీరు పోయే కాలువలు తీయండి.', hi: 'गहरी जुताई कर जल निकासी की नालियाँ बनाएं।' } },
      sowing: { days: 'Day 8–12', action: { en: 'Sow Rhizobium-treated seed in wide 90 cm rows.', te: 'రైజోబియం కలిపిన విత్తనాలు 90 సెం.మీ వరుసల్లో వేయండి.', hi: 'राइजोबियम से उपचारित बीज 90 सेमी कतारों में बोएं।' } },
      germination: { days: 'Day 13–22', action: { en: 'Keep young weeds down during slow early growth.', te: 'ప్రారంభంలో కలుపు లేకుండా శుభ్రంగా ఉంచండి.', hi: 'शुरुआती धीमी बढ़वार में खरपतवार निकालें।' } },
      vegetative_growth: { days: 'Day 23–60', action: { en: 'Nip top shoot at Day 35–40 to promote branching.', te: '35–40 రోజులకు పై చిగురు తుంచి కొమ్మలు పెంచండి.', hi: '35–40 दिन पर शीर्ष कोंपल काटकर शाखाएँ बढ़ाएं।' } },
      flowering: { days: 'Day 61–110', action: { en: 'Monitor pod borer closely and put bird perches.', te: 'కాయ తొలుచు పురుగును గమనించి పక్షి కర్రలు పాతండి.', hi: 'फली छेदक की जांच करें और बर्ड पर्च लगाएं।' } },
      maturity: { days: 'Day 111–145', action: { en: 'Pods fill and dry from green to tan-brown.', te: 'కాయలు నిండి గోధుమ రంగులోకి మారుతాయి.', hi: 'फलियां भरकर भूरे रंग की होने लगती हैं।' } },
      harvesting: { days: 'Day 146–175', action: { en: 'Cut dry stalks, sun-dry 4 days, and thresh.', te: 'కోసి 4 రోజులు ఎండబెట్టి నూర్పిడి చేయండి.', hi: 'कटाई कर 4 दिन धूप में सुखाएं और मड़ाई करें।' } },
    },
  },
  {
    id: 'chickpea',
    category: 'pulses_oilseeds',
    emoji: '🫘',
    names: { en: 'Chickpea (Bengal Gram)', te: 'శనగలు', hi: 'चना' },
    defaultVariety: 'JG-11 / NBeG-3 / Kabuli',
    bestSeason: {
      en: 'Rabi (Oct–Nov post-monsoon)',
      te: 'రబీ (అక్టోబర్–నవంబర్)',
      hi: 'रबी (अक्टूबर–नवंबर)',
    },
    plantation: {
      seedRateKgPerAcre: 30,
      spacing: '30 cm × 10 cm',
      depthCm: '5–6 cm',
      tip: {
        en: 'Sow into deep soil moisture; nip tender shoot tips at Day 30 for extra branching.',
        te: 'నేలలో తేమ ఉన్నప్పుడు విత్తి, 30వ రోజున లేత చిగురు తుంచితే ఎక్కువ కాయలు వస్తాయి.',
        hi: 'पर्याप्त नमी में बुवाई करें और 30 दिन पर हल्की खुटाई करें ताकि ज्यादा शाखाएँ निकलें।',
      },
    },
    irrigation: {
      frequencyDays: 25,
      litersPerAcre: 2600,
      method: 'Sprinkler / Light Furrow',
      tip: {
        en: 'Do NOT over-irrigate chickpea—just 1 light sprinkler irrigation at branching/pod initiation if soil is very dry.',
        te: 'శనగకు ఎక్కువ నీరు పెట్టకండి—నేల బాగా ఎండితే పూత ముందు ఒక్క తేలికపాటి తడి ఇవ్వండి.',
        hi: 'चने में ज्यादा पानी न दें—बहुत सूखा हो तो केवल फूल से पहले एक हल्की सिंचाई करें।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP + Sulfur', kgPerAcre: 35, timing: 'At sowing' },
      { stage: 'Pod Fill', name: '2% Urea / NPK Foliar', kgPerAcre: 3, timing: 'Pre-flowering' },
    ],
    pests: [
      {
        name: 'Pod Borer & Wilt',
        observationSign: {
          en: 'Green caterpillars eating pods or sudden drying of seedlings in patches.',
          te: 'కాయలను తినే ఆకుపచ్చ లద్దె పురుగు లేదా మొక్కలు ఎండిపోవడం.',
          hi: 'फलियां खाने वाली हरी इल्ली या पौधों का सूखकर उखड़ना (उकठा)।',
        },
        treatment: {
          en: 'Treat seed with Trichoderma against wilt and put 15 T-shaped bird perches per acre for borers.',
          te: 'విత్తనాలను ట్రైకోడెర్మాతో శుద్ధి చేసి, ఎకరాకు 15 పక్షి కర్రలు పాతండి.',
          hi: 'बीज को ट्राइकोडर्मा से उपचारित करें और प्रति एकड़ 15 बर्ड पर्च लगाएं।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '95–115 days',
      expectedYieldKgPerAcre: 750,
      readinessSigns: {
        en: 'Leaves turn reddish-brown and pods feel dry and crisp.',
        te: 'ఆకులు ఎరుపు గోధుమ రంగులోకి మారి కాయలు ఎండినప్పుడు కోయండి.',
        hi: 'पत्तियाँ लाल-भूरी हो जाएं और फलियां सूखकर खनखनाएं तो कटाई करें।',
      },
      storageTip: {
        en: 'Dry below 10% moisture before bagging cleanly.',
        te: 'గింజలను 10% తేమ కంటే తక్కువగా ఎండబెట్టి సంచులలో నింపండి.',
        hi: '10% से कम नमी तक सुखाकर साफ बोरों में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid heavy watering before rain; stagnant water causes root wilt.',
      te: 'వర్షానికి ముందు నీరు పెట్టకండి—నీరు నిలిస్తే ఎండు తెగులు వస్తుంది.',
      hi: 'बारिश से पहले सिंचाई न करें; पानी रुकने से उकठा रोग लग जाता है।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–6', action: { en: 'Prepare cloddy-to-medium seedbed to hold moisture.', te: 'తేమ నిలిచేలా నేలను సిద్ధం చేయండి.', hi: 'नमी बनाए रखने के लिए खेत तैयार करें।' } },
      sowing: { days: 'Day 7–10', action: { en: 'Treat seed with Trichoderma & Rhizobium; sow 5 cm deep.', te: 'ట్రైకోడెర్మాతో శుద్ధి చేసిన విత్తనాలను 5 సెం.మీ లోతులో వేయండి.', hi: 'ट्राइकोडर्मा व राइजोबियम से उपचारित बीज 5 सेमी गहरा बोएं।' } },
      germination: { days: 'Day 11–18', action: { en: 'Check emergence; avoid crusting rain.', te: 'మొలకలు సమానంగా వచ్చాయో చూడండి.', hi: 'समान अंकुरण की जांच करें।' } },
      vegetative_growth: { days: 'Day 19–45', action: { en: 'Nip shoot tips at Day 30 and weed once.', te: '30వ రోజున చిగుళ్ళు తుంచి కలుపు తీయండి.', hi: '30 दिन पर खुटाई करें और एक बार निराई करें।' } },
      flowering: { days: 'Day 46–70', action: { en: 'Install bird perches and spray Neem oil.', te: 'పక్షి కర్రలు పాతి వేప నూనె చల్లండి.', hi: 'बर्ड पर्च लगाएं और नीम तेल छिड़कें।' } },
      maturity: { days: 'Day 71–95', action: { en: 'Pods swell and dry golden-tan.', te: 'కాయలు నిండి ఎండటం మొదలవుతుంది.', hi: 'फलियां भरकर सूखने लगती हैं।' } },
      harvesting: { days: 'Day 96–115', action: { en: 'Pull/cut dry crop, dry 3 days, and thresh.', te: 'పంట కోసి 3 రోజులు ఎండబెట్టి నూర్పిడి చేయండి.', hi: 'फसल काटें, 3 दिन सुखाएं और मड़ाई करें।' } },
    },
  },
  {
    id: 'mustard',
    category: 'pulses_oilseeds',
    emoji: '🌼',
    names: { en: 'Mustard (Sarson / Avalu)', te: 'ఆవాలు', hi: 'सरसों' },
    defaultVariety: 'Pusa Bold / RH-749',
    bestSeason: {
      en: 'Rabi (Oct–early Nov)',
      te: 'రబీ (అక్టోబర్–నవంబర్)',
      hi: 'रबी (अक्टूबर–नवंबर)',
    },
    plantation: {
      seedRateKgPerAcre: 2,
      spacing: '30 cm × 12 cm',
      depthCm: '2–3 cm',
      tip: {
        en: 'Thin extra seedlings at 15–20 days so each mustard plant gets sunlight to branch widely.',
        te: '15–20 రోజులకు ఒత్తుగా ఉన్న మొక్కలను తీసేస్తే ఎక్కువ కొమ్మలు వస్తాయి.',
        hi: '15–20 दिन पर घने पौधे छांटें ताकि हर पौधे को फैलने की जगह मिले।',
      },
    },
    irrigation: {
      frequencyDays: 25,
      litersPerAcre: 2800,
      method: 'Light Flood / Sprinkler',
      tip: {
        en: 'Two key waterings only: one at Day 30 (pre-flowering) and one at pod filling (Day 60).',
        te: '30వ రోజు (పూత ముందు) మరియు 60వ రోజు (కాయ దశ)లో 2 నీటి తడులు సరిపోతాయి.',
        hi: 'सिर्फ दो मुख्य सिंचाई करें: पहली 30 दिन पर (फूल से पहले) और दूसरी 60 दिन पर (फली भरते समय)।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'SSP + Urea + Sulfur', kgPerAcre: 55, timing: 'At sowing' },
      { stage: 'Day 30', name: 'Urea', kgPerAcre: 25, timing: 'First irrigation' },
    ],
    pests: [
      {
        name: 'Mustard Aphid (Chepa)',
        observationSign: {
          en: 'Thousands of tiny green/white aphids clustered on flowering shoots sucking sap.',
          te: 'పూత కొమ్మలపై గుంపులుగా ఉన్న చిన్న ఆకుపచ్చ పేనుబంక.',
          hi: 'फूलों की टहनियों पर चिपके हुए हजारों छोटे हरे माहू (चेपा)।',
        },
        treatment: {
          en: 'Sow on time in October to escape aphids; pinch early infested tips or spray Neem oil.',
          te: 'అక్టోబర్‌లో సకాలంలో విత్తండి; పేనుబంక కనిపిస్తే వేప నూనె చల్లండి.',
          hi: 'अक्टूबर में समय पर बुवाई करें; माहू दिखने पर प्रभावित सिरे तोड़ें या नीम तेल छिड़कें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '115–130 days',
      expectedYieldKgPerAcre: 850,
      readinessSigns: {
        en: '75–80% of siliquae (pods) turn yellow while lower pods start drying—harvest early morning to avoid shattering.',
        te: '75–80% కాయలు పసుపు రంగులోకి మారినప్పుడు ఉదయాన్నే కోయండి.',
        hi: 'जब 75–80% फलियां पीली पड़ जाएं तो दाने झड़ने से बचाने के लिए सुबह कटाई करें।',
      },
      storageTip: {
        en: 'Dry threshed black/brown seeds down to 8% moisture before oil extraction or storage.',
        te: 'తేమ 8% తగ్గే వరకు ఎండబెట్టి పొడి సంచులలో నిల్వ చేయండి.',
        hi: '8% नमी तक धूप में सुखाकर साफ बोरों में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Watch for frost alerts in cold January nights—give light smoke or evening irrigation.',
      te: 'జనవరి చలిలో మంచు హెచ్చరిక ఉంటే సాయంత్రం తేలికగా నీరు పెట్టండి.',
      hi: 'जनवरी में पाले की चेतावनी हो तो शाम को हल्की सिंचाई करें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–6', action: { en: 'Prepare fine firm moist seedbed.', te: 'నేలను మెత్తగా దున్ని సిద్ధం చేయండి.', hi: 'भुरभुरी और नम क्यारी तैयार करें।' } },
      sowing: { days: 'Day 7–9', action: { en: 'Sow 2 kg/acre seeds 2–3 cm deep with Sulfur.', te: 'సల్ఫర్‌తో పాటు 2–3 సెం.మీ లోతులో విత్తండి.', hi: 'सल्फर के साथ 2–3 सेमी गहराई में बुवाई करें।' } },
      germination: { days: 'Day 10–18', action: { en: 'Thin crowded plants cleanly at Day 18.', te: '18వ రోజున ఒత్తు మొక్కలను తీసేయండి.', hi: '18 दिन पर घने पौधों की छंटाई करें।' } },
      vegetative_growth: { days: 'Day 19–38', action: { en: 'Give first irrigation at Day 30 and apply Urea.', te: '30వ రోజున మొదటి నీరు పెట్టి యూరియా వేయండి.', hi: '30 दिन पर पहली सिंचाई कर यूरिया दें।' } },
      flowering: { days: 'Day 39–70', action: { en: 'Bright yellow flowers bloom; check tips for aphids.', te: 'పసుపు పూలు వస్తాయి; పేనుబంకను గమనించండి.', hi: 'पीले फूल आने पर चेपा (माहू) की जांच करें।' } },
      maturity: { days: 'Day 71–112', action: { en: 'Pods fill with oil-rich seeds and turn yellow.', te: 'కాయలు గింజలతో నిండి పసుపు రంగుకు వస్తాయి.', hi: 'फलियों में दाने भरकर पीली होने लगती हैं।' } },
      harvesting: { days: 'Day 113–130', action: { en: 'Cut early morning, stack 4 days, and thresh.', te: 'ఉదయాన్నే కోసి 4 రోజులు కుప్ప వేసి నూర్పిడి చేయండి.', hi: 'सुबह कटाई कर 4 दिन सुखाएं और मड़ाई करें।' } },
    },
  },
  {
    id: 'sunflower',
    category: 'pulses_oilseeds',
    emoji: '🌻',
    names: { en: 'Sunflower', te: 'పొద్దుతిరుగుడు', hi: 'सूरजमुखी' },
    defaultVariety: 'KBSH-44 / DRSH-1',
    bestSeason: {
      en: 'Kharif, Rabi & Summer (Zaid)',
      te: 'ఖరీఫ్, రబీ & వేసవి',
      hi: 'खरीफ, रबी और जायद (गर्मी)',
    },
    plantation: {
      seedRateKgPerAcre: 2.5,
      spacing: '60 cm × 30 cm',
      depthCm: '3–4 cm',
      tip: {
        en: 'During flowering, gently rub sunflower heads face-to-face with a soft muslin cloth around your hand in the morning—fills 25% more seeds in the center!',
        te: 'పూత సమయంలో ఉదయాన్నే మెత్తటి గుడ్డతో పూలను సున్నితంగా రుద్దితే మధ్యలో గింజలు నిండుగా వస్తాయి!',
        hi: 'फूल आने पर सुबह मुलायम कपड़े से फूलों को हल्का स्पर्श करने से बीच में दाने 25% ज्यादा भरते हैं!',
      },
    },
    irrigation: {
      frequencyDays: 10,
      litersPerAcre: 3200,
      method: 'Furrow / Sprinkler',
      tip: {
        en: 'Star-bud stage, flowering, and seed-filling are must-water stages.',
        te: 'మొగ్గ దశ, పూత మరియు గింజ కట్టే దశలో నీరు తప్పనిసరి.',
        hi: 'कली बनने, फूल आने और दाने भरते समय सिंचाई जरूरी है।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP + Potash + Sulfur + Boron', kgPerAcre: 55, timing: 'At sowing' },
      { stage: 'Bud Stage', name: 'Urea', kgPerAcre: 25, timing: 'Day 30' },
    ],
    pests: [
      {
        name: 'Capitulum Borer & Birds',
        observationSign: {
          en: 'Caterpillars chewing flower heads or parrots eating maturing seeds.',
          te: 'పువ్వును తినే పురుగు లేదా గింజలను తినే చిలుకలు.',
          hi: 'फूल को खाने वाली इल्ली या पके दाने खाने वाले पक्षी (तोते)।',
        },
        treatment: {
          en: 'Use reflective bird ribbons along rows and spray Neem oil at bud stage (never on open blooms when bees feed).',
          te: 'పక్షులను తరిమే రిబ్బన్లు కట్టి, మొగ్గ దశలో వేప నూనె చల్లండి.',
          hi: 'खेत में चमकीले रिबन बांधें और कली अवस्था में ही नीम तेल छिड़कें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '90–105 days',
      expectedYieldKgPerAcre: 850,
      readinessSigns: {
        en: 'Back of flower head turns lemon yellow, outer petals dry brown, and seeds turn plump black.',
        te: 'పువ్వు వెనుక భాగం పసుపు రంగులోకి మారి గింజలు నల్లగా గట్టిపడినప్పుడు కోయండి.',
        hi: 'फूल के पीछे का हिस्सा पीला पड़ जाए और दाने काले व सख्त हो जाएं तो काटें।',
      },
      storageTip: {
        en: 'Dry cut heads for 3–4 days before beating out seeds; dry seeds below 9% moisture.',
        te: 'కోసిన పూలను 3–4 రోజులు ఎండబెట్టి గింజలు తీసి ఆరబెట్టండి.',
        hi: 'कटे फूलों को 3–4 दिन सुखाकर दाने निकालें और 9% नमी तक सुखाएं।',
      },
    },
    weatherAdvice: {
      en: 'Earth up soil around stems at Day 35 so tall flower heads do not fall in wind.',
      te: 'గాలికి మొక్కలు వాలకుండా 35వ రోజున మొదళ్ళకు మట్టి ఎగదోయండి.',
      hi: 'तेज हवा से पौधे गिरें नहीं इसलिए 35 दिन पर मिट्टी चढ़ाएं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–6', action: { en: 'Make 60 cm ridges with basal DAP + Boron.', te: 'బోరాన్, డీఏపీ వేసి 60 సెం.మీ బోదెలు చేయండి.', hi: 'बोरॉन व डीएपी डालकर 60 सेमी की मेड़ें बनाएं।' } },
      sowing: { days: 'Day 7–9', action: { en: 'Plant 1–2 seeds every 30 cm along ridges.', te: 'బోదెలపై 30 సెం.మీ దూరానికి 1–2 విత్తనాలు వేయండి.', hi: 'मेड़ों पर हर 30 सेमी में 1–2 बीज बोएं।' } },
      germination: { days: 'Day 10–18', action: { en: 'Thin to 1 strong plant per hill.', te: 'గుంటకు ఒక బలమైన మొక్కను ఉంచండి.', hi: 'हर स्थान पर एक स्वस्थ पौधा रखें।' } },
      vegetative_growth: { days: 'Day 19–40', action: { en: 'Apply Urea, weed, and earth up stems.', te: 'యూరియా వేసి, కలుపు తీసి మట్టి ఎగదోయండి.', hi: 'यूरिया डालें, निराई करें और मिट्टी चढ़ाएं।' } },
      flowering: { days: 'Day 41–65', action: { en: 'Keep bees safe; do hand-rub pollination at 8 AM.', te: 'ఉదయం 8 గంటలకు మెత్తగా పరపరాగ సంపర్కం చేయండి.', hi: 'मधुमक्खियों को बचाएं और सुबह हल्का परागण करें।' } },
      maturity: { days: 'Day 66–88', action: { en: 'Tie reflective ribbons against parrots as seeds harden.', te: 'పక్షుల నుండి కాపాడటానికి మెరిసే రిబ్బన్లు కట్టండి.', hi: 'पक्षियों से बचाव के लिए चमकीले रिबन बांधें।' } },
      harvesting: { days: 'Day 89–105', action: { en: 'Cut lemon-yellow heads, sun-dry, and thresh seeds.', te: 'పసుపు రంగుకు మారిన పూలను కోసి ఎండబెట్టి గింజలు తీయండి.', hi: 'पीले हुए फूल काटें, सुखाएं और दाने अलग करें।' } },
    },
  },
  {
    id: 'sorghum',
    category: 'cereals',
    emoji: '🌾',
    names: { en: 'Sorghum (Jowar)', te: 'జొన్న', hi: 'ज्वार' },
    defaultVariety: 'CSH-16 / Maldandi M-35-1',
    bestSeason: {
      en: 'Kharif (Jun–Jul) & Rabi (Sep–Oct)',
      te: 'ఖరీఫ్ (జూన్–జూలై) & రబీ (సెప్టెం–అక్టో)',
      hi: 'खरीफ (जून–जुलाई) और रबी (सितंबर–अक्टूबर)',
    },
    plantation: {
      seedRateKgPerAcre: 4,
      spacing: '45 cm × 15 cm',
      depthCm: '3–4 cm',
      tip: {
        en: 'Sow early at monsoon onset to escape sorghum shoot fly.',
        te: 'కాండం ఈగ నుండి తప్పించుకోవడానికి వర్షాలు పడగానే సకాలంలో విత్తండి.',
        hi: 'तना मक्खी से बचने के लिए मानसून की शुरुआत में ही समय पर बुवाई करें।',
      },
    },
    irrigation: {
      frequencyDays: 14,
      litersPerAcre: 2800,
      method: 'Rainfed / Furrow',
      tip: {
        en: 'Very drought-tolerant; give protective water at flowering and grain-milk stage if dry.',
        te: 'వర్షాభావంలో కూడా తట్టుకుంటుంది; పూత, పాలు పోసుకునే దశలో నీరు ఉంటే మంచి దిగుబడి వస్తుంది.',
        hi: 'सूखा सहनशील फसल; फूल व दाने में दूध भरते समय सिंचाई करने से उपज बढ़ती है।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP + Potash', kgPerAcre: 35, timing: 'At sowing' },
      { stage: 'Day 30', name: 'Urea', kgPerAcre: 25, timing: 'Knee-high' },
    ],
    pests: [
      {
        name: 'Shoot Fly & Stem Borer',
        observationSign: {
          en: 'Dead central shoot in young 2-week seedlings or pinholes in whorl leaves.',
          te: '2 వారాల మొక్కల్లో మధ్య మొవ్వ ఎండిపోవడం.',
          hi: '2 सप्ताह के पौधे की बीच की कोंपल सूख जाना (डेड हार्ट)।',
        },
        treatment: {
          en: 'Pull and destroy dead-heart seedlings early and keep field border clean.',
          te: 'ఎండిన మొక్కలను తీసి నాశనం చేయండి.',
          hi: 'प्रभावित सूखे पौधे उखाड़कर नष्ट करें और खेत साफ रखें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '105–120 days',
      expectedYieldKgPerAcre: 1400,
      readinessSigns: {
        en: 'Earhead grains turn hard and ivory/pearly white-yellow with dry leaves.',
        te: 'కంకి గింజలు గట్టిపడి ఆకులు ఎండినప్పుడు కోయండి.',
        hi: 'भुट्टे के दाने सख्त हो जाएं और पत्तियाँ सूखने लगें तो कटाई करें।',
      },
      storageTip: {
        en: 'Dry grains below 12% moisture; green stalks also make nutritious cattle fodder.',
        te: 'గింజలను బాగా ఎండబెట్టి నిల్వ చేయండి; చొప్ప పశువులకు మంచి మేత.',
        hi: 'दाने 12% नमी तक सुखाएं; कड़बी पशुओं के लिए बढ़िया चारा है।',
      },
    },
    weatherAdvice: {
      en: 'Watch out for heavy rain right when grains mature to avoid blackened earheads.',
      te: 'గింజలు ముదిరే సమయంలో వర్షం పడితే కంకులు నల్లబడే అవకాశం ఉంటుంది—త్వరగా కోయండి.',
      hi: 'दाने पकते समय बारिश हो तो काला पड़ने से बचाने के लिए समय पर कटाई करें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–6', action: { en: 'Plough and harrow field cleanly.', te: 'పొలాన్ని దున్ని చదును చేయండి.', hi: 'खेत जोतकर पाटा लगाकर समतल करें।' } },
      sowing: { days: 'Day 7–9', action: { en: 'Drill seeds 3–4 cm deep in 45 cm rows.', te: '45 సెం.మీ వరుసల్లో 3–4 సెం.మీ లోతులో విత్తండి.', hi: '45 सेमी कतार में 3–4 सेमी गहराई में बोएं।' } },
      germination: { days: 'Day 10–18', action: { en: 'Check shoot fly dead hearts and thin seedlings.', te: 'మొలకలను గమనించి ఒత్తు మొక్కలు తీయండి.', hi: 'अंकुरण जांचें और घने पौधे छांटें।' } },
      vegetative_growth: { days: 'Day 19–45', action: { en: 'Weed once at Day 25 and top-dress Urea.', te: '25వ రోజున కలుపు తీసి యూరియా వేయండి.', hi: '25 दिन पर निराई कर यूरिया डालें।' } },
      flowering: { days: 'Day 46–75', action: { en: 'Panicles emerge—irrigate if soil is dry.', te: 'కంకులు బయటకు వస్తాయి—తేమ లేకపోతే నీరు ఇవ్వండి.', hi: 'भुट्टे निकलते समय सूखा हो तो सिंचाई करें।' } },
      maturity: { days: 'Day 76–102', action: { en: 'Grains fill and harden; scare away birds.', te: 'గింజలు గట్టిపడతాయి; పక్షుల నుండి కాపాడండి.', hi: 'दाने सख्त होते हैं; पक्षियों से रक्षा करें।' } },
      harvesting: { days: 'Day 103–120', action: { en: 'Cut earheads, sun-dry, and thresh cleanly.', te: 'కంకులు కోసి ఎండబెట్టి నూర్పిడి చేయండి.', hi: 'भुट्टे काटें, धूप में सुखाएं और मड़ाई करें।' } },
    },
  },
  {
    id: 'millet',
    category: 'cereals',
    emoji: '🌾',
    names: { en: 'Pearl Millet (Bajra / Sajjalu)', te: 'సజ్జలు', hi: 'बाजरा' },
    defaultVariety: 'HHB-67 Improved / ICMV-221',
    bestSeason: {
      en: 'Kharif (June–July) & Summer',
      te: 'ఖరీఫ్ (జూన్–జూలై) & వేసవి',
      hi: 'खरीफ (जून–जुलाई) और गर्मी',
    },
    plantation: {
      seedRateKgPerAcre: 1.5,
      spacing: '45 cm × 12 cm',
      depthCm: '2–3 cm',
      tip: {
        en: 'Never sow deeper than 3 cm—tiny bajra seeds fail to push through deep heavy soil.',
        te: 'సజ్జ విత్తనాలను 3 సెం.మీ కంటే లోతుగా వేయకండి—లోతుకు పోతే మొలకెత్తవు.',
        hi: 'बाजरे के छोटे बीज 3 सेमी से ज्यादा गहरे न बोएं वरना उगाव नहीं होगा।',
      },
    },
    irrigation: {
      frequencyDays: 14,
      litersPerAcre: 2400,
      method: 'Rainfed / Sprinkler',
      tip: {
        en: 'India’s toughest drought crop; needs water only during long dry spells at flowering.',
        te: 'కరువును తట్టుకునే పంట; పూత సమయంలో ఎక్కువ రోజులు వర్షం లేకపోతే మాత్రమే నీరు అవసరం.',
        hi: 'सबसे कम पानी में होने वाली फसल; केवल फूल आने पर लंबे सूखे में ही सिंचाई चाहिए।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'DAP', kgPerAcre: 30, timing: 'At sowing' },
      { stage: 'Day 25', name: 'Urea', kgPerAcre: 25, timing: 'After weeding' },
    ],
    pests: [
      {
        name: 'Downy Mildew & Ergot',
        observationSign: {
          en: 'Yellowish stunted leaves with white undersides or sticky pink drops on earheads.',
          te: 'ఆకులు పసుపు రంగులోకి మారి కింద తెల్ల బూజు లేదా కంకులపై జిగురు చుక్కలు.',
          hi: 'पत्तियों के नीचे सफेद फफूंद या सिट्टे पर चिपचिपा गुलाबी रस दिखना।',
        },
        treatment: {
          en: 'Use certified mildew-resistant hybrid seed and pull out early infected plants immediately.',
          te: 'తెగులు తట్టుకునే విత్తనాలు వాడి వ్యాధి మొక్కలను తీసేయండి.',
          hi: 'रोगरोधी प्रमाणित बीज बोएं और संक्रमित पौधे तुरंत उखाड़कर नष्ट करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '80–90 days',
      expectedYieldKgPerAcre: 1100,
      readinessSigns: {
        en: 'Compact candle-like spikes dry brown and grey-pearly grains pop cleanly when rubbed.',
        te: 'కంకులు ఎండి బూడిద రంగు గింజలు సులభంగా రాలివచ్చినప్పుడు కోయండి.',
        hi: 'सिट्टे सूख जाएं और हाथ से मसलने पर मोती जैसे दाने आसानी से निकलें तो कटाई करें।',
      },
      storageTip: {
        en: 'Sun-dry well to 10–12% moisture and store in airtight dry drums.',
        te: '10–12% తేమకు ఆరబెట్టి గాలి చొరబడని డబ్బాలలో నిల్వ చేయండి.',
        hi: '10–12% नमी तक सुखाकर सूखे डिब्बों या बोरों में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Thrives even in 38–40°C dry heat; keep drains clear during sudden heavy rain.',
      te: '38–40°C ఎండలో కూడా బాగా పెరుగుతుంది; భారీ వర్షంలో నీరు నిలవనీయకండి.',
      hi: '38–40°C गर्मी में भी बढ़िया उगता है; तेज बारिश में पानी न रुकने दें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–5', action: { en: 'Plough lightly and level field.', te: 'తేలికగా దున్ని పొలాన్ని చదును చేయండి.', hi: 'हल्की जुताई कर खेत समतल करें।' } },
      sowing: { days: 'Day 6–8', action: { en: 'Sow shallow 2–3 cm deep in 45 cm rows.', te: '45 సెం.మీ వరుసల్లో 2–3 సెం.మీ లోతులో వేయండి.', hi: '45 सेमी कतार में 2–3 सेमी गहरा बोएं।' } },
      germination: { days: 'Day 9–14', action: { en: 'Sprouts fast in 4–5 days; gap-fill by transplanting.', te: '4–5 రోజుల్లో మొలకలు వస్తాయి.', hi: '4–5 दिन में तेजी से अंकुरण होता है।' } },
      vegetative_growth: { days: 'Day 15–35', action: { en: 'Weed at Day 20 and apply light Urea.', te: '20వ రోజున కలుపు తీసి యూరియా వేయండి.', hi: '20 दिन पर निराई कर हल्का यूरिया दें।' } },
      flowering: { days: 'Day 36–55', action: { en: 'Spikes emerge; inspect for sticky ergot drops.', te: 'కంకులు వస్తాయి; జిగురు మచ్చలు ఉన్నాయో చూడండి.', hi: 'सिट्टे निकलने पर चिपचिपे रस की जांच करें।' } },
      maturity: { days: 'Day 56–78', action: { en: 'Grains plump up and stalks turn straw-yellow.', te: 'గింజలు నిండి గట్టిపడతాయి.', hi: 'दाने भरते हैं और पौधे सुनहरे होते हैं।' } },
      harvesting: { days: 'Day 79–90', action: { en: 'Cut mature spikes, sun-dry 3 days, and thresh.', te: 'కంకులు కోసి 3 రోజులు ఎండబెట్టి నూర్పిడి చేయండి.', hi: 'सिट्टे काटकर 3 दिन धूप में सुखाएं और मड़ाई करें।' } },
    },
  },
];
