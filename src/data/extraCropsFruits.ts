import type { CropGuideProfile } from './cropTypes';

export const EXTRA_FRUIT_CROPS: CropGuideProfile[] = [
  {
    id: 'mango',
    category: 'fruits',
    emoji: '🥭',
    names: { en: 'Mango', te: 'మామిడి', hi: 'आम' },
    defaultVariety: 'Banganapalli / Alphonso / Dasheri',
    bestSeason: {
      en: 'July–August planting (Monsoon orchard setup)',
      te: 'జూలై–ఆగస్టు నాట్లు (వర్షాకాలం)',
      hi: 'जुलाई–अगस्त रोपाई (मानसून)',
    },
    plantation: {
      seedRateKgPerAcre: 40,
      seedNote: {
        en: '40 grafted saplings per acre (1 kg unit = 1 grafted sapling)',
        te: 'ఎకరాకు 40 అంటు మొక్కలు',
        hi: 'प्रति एकड़ 40 कलमी पौधे',
      },
      spacing: '10 m × 10 m (or 5 m × 5 m high density)',
      depthCm: '45–60 cm pit',
      tip: {
        en: 'Dig 60×60×60 cm pits in summer, fill with topsoil + 15 kg compost, and plant healthy grafted saplings in July.',
        te: 'వేసవిలో 60 సెం.మీ గుంతలు తవ్వి కంపోస్టు మట్టి నింపి జూలైలో అంటు మొక్కలు నాటండి.',
        hi: 'गर्मियों में गड्ढे खोदकर गोबर खाद व मिट्टी भरें और जुलाई में स्वस्थ कलमी पौधे लगाएं।',
      },
    },
    irrigation: {
      frequencyDays: 10,
      litersPerAcre: 4000,
      method: 'Drip / Basin',
      tip: {
        en: 'Stop watering 2 months before flowering (Oct–Nov) to encourage heavy flowers. Water regularly from marble fruit size to harvest.',
        te: 'పూతకు 2 నెలల ముందు నీరు ఆపి, పిందె కట్టిన తర్వాత క్రమం తప్పకుండా నీరు ఇవ్వండి.',
        hi: 'फूल आने से 2 महीने पहले पानी बंद करें, फिर फल बनने से पकने तक नियमित सिंचाई करें।',
      },
    },
    fertilizers: [
      { stage: 'Post-Harvest / June', name: 'FYM Compost + SSP', kgPerAcre: 250, timing: 'June–July' },
      { stage: 'Before Flowering', name: 'Potash + Micronutrients', kgPerAcre: 30, timing: 'September' },
      { stage: 'Marble Fruit Stage', name: 'Potassium Nitrate Spray', kgPerAcre: 4, timing: 'March' },
    ],
    pests: [
      {
        name: 'Mango Hopper & Powdery Mildew',
        observationSign: {
          en: 'Tiny hopping insects on flower panicles with sticky honeydew or white powder on blossoms.',
          te: 'పూతపై తేనెమంచు పురుగులు లేదా తెల్లని బూడిద పొడి కనిపించడం.',
          hi: 'बौर पर छोटे फुदकने वाले कीड़े, चिपचिपा रस या फूलों पर सफेद पाउडर दिखना।',
        },
        treatment: {
          en: 'Spray Neem oil or recommended sulfur/control at panicle emergence and avoid spraying during peak bee pollination.',
          te: 'పూత ప్రారంభంలో వేప నూనె లేదా తగిన గంధకపు మందు పిచికారీ చేయండి.',
          hi: 'बौर निकलते समय नीम तेल या अनुशंसित फफूंदनाशी का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '100–120 days after flowering',
      expectedYieldKgPerAcre: 3800,
      readinessSigns: {
        en: 'Shoulders near stem rise above stalk pit, skin dulls slightly, and 1–2 ripe fruits fall naturally.',
        te: 'కాయ భుజాలు పైకి లేచి సహజంగా ఒకటి రెండు పండ్లు రాలినప్పుడు కోతకు సిద్ధం.',
        hi: 'जब फल का डंठल के पास का हिस्सा भर जाए और 1–2 पके आम अपने आप गिरने लगें।',
      },
      storageTip: {
        en: 'Cut mangoes with a 2 cm stalk to prevent sap burn on skin; pack in ventilated boxes.',
        te: 'సొన తగలకుండా 2 సెం.మీ కాడతో కోసి గాలి ఆడే పెట్టెలలో సర్దండి.',
        hi: 'फल के ऊपर दाग से बचने के लिए 2 सेमी डंठल के साथ तोड़ें और हवादार बक्सों में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Unseasonal rain or fog during flowering spreads powdery mildew—shake wet panicles gently and protect blooms.',
      te: 'పూత సమయంలో అకాల వర్షం లేదా మంచు కురిస్తే బూడిద తెగులు వస్తుంది.',
      hi: 'बौर के समय बेमौसम बारिश या कोहरे से भभूतिया रोग फैलता है—तुरंत बचाव करें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Month 1', action: { en: 'Dig orchard pits and fill with well-rotted compost.', te: 'గుంతలు తవ్వి ఎరువు మట్టితో నింపండి.', hi: 'गड्ढे खोदकर खाद व मिट्टी भरें।' } },
      sowing: { days: 'Month 2', action: { en: 'Plant grafted saplings with graft joint 15 cm above ground.', te: 'అంటు భాగం భూమికి 15 సెం.మీ పైన ఉండేలా నాటండి.', hi: 'कलम का जोड़ जमीन से 15 सेमी ऊपर रखकर पौधा लगाएं।' } },
      germination: { days: 'Year 1', action: { en: 'Stake young saplings and remove shoots growing below graft.', te: 'కర్ర ఊతం ఇచ్చి అంటు కింద వచ్చే కొమ్మలు కత్తిరించండి.', hi: 'सहारा दें और कलम के नीचे से निकलने वाली टहनियाँ हटाएं।' } },
      vegetative_growth: { days: 'June–Oct', action: { en: 'Prune crowded inner branches for good sunlight inside canopy.', te: 'లోపలికి ఎండ తగిలేలా అదనపు కొమ్మలు కత్తిరించండి.', hi: 'अंदर धूप आने के लिए घनी टहनियों की छंटाई करें।' } },
      flowering: { days: 'Dec–Feb', action: { en: 'Keep soil dry until full bloom; watch for mango hoppers.', te: 'పూత వచ్చే వరకు నీరు తగ్గించి తేనెమంచు పురుగును గమనించండి.', hi: 'पूरे फूल आने तक सिंचाई रोकें और भुनगा कीट से बचाएं।' } },
      maturity: { days: 'Mar–Apr', action: { en: 'Irrigate every 10 days as fruits swell and turn sweet.', te: 'కాయలు పెరిగేటప్పుడు ప్రతి 10 రోజులకు నీరు పెట్టండి.', hi: 'फल बढ़ते समय हर 10 दिन में सिंचाई करें।' } },
      harvesting: { days: 'Apr–Jun', action: { en: 'Harvest mature fruits carefully with long-pole net pickers.', te: 'వల ఉన్న కోత కర్రతో పండ్లు దెబ్బతినకుండా కోయండి.', hi: 'जालीदार डंडे से बिना गिराए सावधानी से आम तोड़ें।' } },
    },
  },
  {
    id: 'banana',
    category: 'fruits',
    emoji: '🍌',
    names: { en: 'Banana', te: 'అరటి', hi: 'केला' },
    defaultVariety: 'Grand Naine (G-9) / Karpura Chakkarakeli',
    bestSeason: {
      en: 'Jun–Aug or Jan–Feb (Tissue culture)',
      te: 'జూన్–ఆగస్టు లేదా జనవరి–ఫిబ్రవరి',
      hi: 'जून–अगस्त या जनवरी–फरवरी',
    },
    plantation: {
      seedRateKgPerAcre: 1200,
      seedNote: {
        en: '1,200 tissue culture plants per acre (6 ft × 6 ft)',
        te: 'ఎకరాకు 1,200 టిష్యూ కల్చర్ మొక్కలు',
        hi: 'प्रति एकड़ 1,200 टिश्यू कल्चर पौधे',
      },
      spacing: '1.8 m × 1.8 m (6 ft × 6 ft)',
      depthCm: '30 cm pit',
      tip: {
        en: 'Use disease-free tissue culture G-9 plants. Keep field bunds weed-free and install drip lines before planting.',
        te: 'తెగులు లేని టిష్యూ కల్చర్ మొక్కలను నాటడానికి ముందే డ్రిప్ పైపులు అమర్చండి.',
        hi: 'रोगमुक्त टिश्यू कल्चर पौधे लगाएं और रोपाई से पहले ही ड्रिप लाइन बिछा लें।',
      },
    },
    irrigation: {
      frequencyDays: 3,
      litersPerAcre: 5500,
      method: 'Drip',
      tip: {
        en: 'Banana loves steady moisture—never let soil crack dry, and never leave water standing around roots.',
        te: 'అరటికి తేమ నిరంతరం ఉండాలి, కానీ మొదళ్ళ దగ్గర నీరు నిలవకూడదు.',
        hi: 'केले को लगातार नमी चाहिए, लेकिन जड़ों के पास पानी जमा न होने दें।',
      },
    },
    fertilizers: [
      { stage: 'Month 1–3', name: 'Urea + DAP + Micronutrients', kgPerAcre: 70, timing: 'Every 15 days via drip' },
      { stage: 'Month 4–6', name: 'Potash (MOP) + Urea', kgPerAcre: 90, timing: 'Vegetative growth' },
      { stage: 'Bunch Emergence', name: '13-0-45 Potassium Nitrate', kgPerAcre: 35, timing: 'Month 7–9' },
    ],
    pests: [
      {
        name: 'Sigatoka Leaf Spot / Pseudostem Weevil',
        observationSign: {
          en: 'Yellow-brown dry streaks along leaves or gummy holes on the trunk.',
          te: 'ఆకులపై పసుపు గోధుమ చారలు లేదా కాండంపై జిగురు రంధ్రాలు.',
          hi: 'पत्तियों पर पीली-भूरी सूखी धारियाँ या तने पर चिपचिपे छेद दिखना।',
        },
        treatment: {
          en: 'Trim severely diseased old leaves, keep suckers pruned, and treat affected trunks promptly.',
          te: 'వ్యాధి సోకిన పాత ఆకులు కత్తిరించి, పక్క పిలకలను ఎప్పటికప్పుడు తీసేయండి.',
          hi: 'रोगग्रस्त पुरानी पत्तियाँ काटकर हटाएं और अतिरिक्त कल्ले समय पर निकालें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '300–330 days',
      expectedYieldKgPerAcre: 24000,
      readinessSigns: {
        en: 'Angles/ridges on fingers round out smoothly and dried flower tips drop easily.',
        te: 'కాయల అంచులు గుండ్రంగా మారి చివరి పువ్వులు రాలిపోయినప్పుడు గెల కోయండి.',
        hi: 'जब केले की धारियाँ गोल हो जाएं और सिरे के सूखे फूल आसानी से गिर जाएं तो कटाई करें।',
      },
      storageTip: {
        en: 'Cover growing bunches with perforated blue plastic sleeves to prevent insect scars and sunburn.',
        te: 'గెలలపై నీలం కవర్లు కడితే మచ్చలు లేకుండా మంచి ధర వస్తుంది.',
        hi: 'दाग-धब्बों से बचाने और चमकदार रंग के लिए घौंद को नीली जालीदार थैली से ढकें।',
      },
    },
    weatherAdvice: {
      en: 'Prop heavy bunching plants with bamboo or nylon ropes before high winds above 25 km/h.',
      te: 'బలమైన గాలుల నుండి గెలలు పడిపోకుండా వెదురు కర్రలు లేదా తాళ్ళతో ఊతం ఇవ్వండి.',
      hi: 'तेज हवा में पौधों को गिरने से बचाने के लिए बांस या रस्सी से सहारा दें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–15', action: { en: 'Plough deeply, lay drip lines, and dig pits at 6×6 ft.', te: 'లోతుగా దున్ని 6×6 అడుగుల దూరంలో గుంతలు తీయండి.', hi: 'गहरी जुताई कर ड्रिप बिछाएं और 6×6 फीट पर गड्ढे बनाएं।' } },
      sowing: { days: 'Day 16–20', action: { en: 'Plant tissue culture saplings upright and irrigate.', te: 'టిష్యూ కల్చర్ మొక్కలు నాటి వెంటనే నీరు పెట్టండి.', hi: 'टिश्यू कल्चर पौधे सीधे लगाकर तुरंत सिंचाई करें।' } },
      germination: { days: 'Day 21–45', action: { en: 'Shade tender plants in hot sun and keep soil moist.', te: 'ఎండ ఎక్కువగా ఉంటే మొక్కలకు నీడ ఇచ్చి తేమ ఉంచండి.', hi: 'तेज धूप में हल्की छाया व नमी बनाए रखें।' } },
      vegetative_growth: { days: 'Day 46–180', action: { en: 'Remove side suckers every month and feed Potash regularly.', te: 'ప్రతి నెలా పక్క పిలకలను కోసి పొటాష్ ఎరువు ఇవ్వండి.', hi: 'हर महीने अतिरिक्त कल्ले हटाएं और नियमित खाद दें।' } },
      flowering: { days: 'Day 181–240', action: { en: 'Bunch emerges—prop trunk and remove male flower bud after 10 hands.', te: 'గెల వచ్చిన తర్వాత కర్ర ఊతం ఇచ్చి చివరి పువ్వు కత్తిరించండి.', hi: 'घौंद निकलने पर पौधे को सहारा दें और नीचे का नर फूल काटें।' } },
      maturity: { days: 'Day 241–300', action: { en: 'Cover bunches with sleeves so fingers fill plump and spotless.', te: 'కాయలు నిండుగా పెరగడానికి గెలలకు కవర్లు కట్టండి.', hi: 'फल मोटे और चमकदार बनने के लिए घौंद पर कवर चढ़ाएं।' } },
      harvesting: { days: 'Day 301–330', action: { en: 'Cut mature green bunches cleanly and avoid bruising.', te: 'పక్వానికి వచ్చిన పచ్చని గెలలను దెబ్బతగలకుండా కోయండి.', hi: 'पकी हुई हरी घौंद को बिना चोट लगाए काटें।' } },
    },
  },
  {
    id: 'papaya',
    category: 'fruits',
    emoji: '🍈',
    names: { en: 'Papaya', te: 'బొప్పాయి', hi: 'पपीता' },
    defaultVariety: 'Red Lady 786',
    bestSeason: {
      en: 'Feb–Mar & Jun–Sep planting',
      te: 'ఫిబ్రవరి–మార్చి & జూన్–సెప్టెంబర్',
      hi: 'फरवरी–मार्च और जून–सितंबर',
    },
    plantation: {
      seedRateKgPerAcre: 1000,
      seedNote: {
        en: '1,000 seedlings per acre (~100g hybrid seed)',
        te: 'ఎకరాకు 1,000 మొక్కలు (~100 గ్రా విత్తనం)',
        hi: 'प्रति एकड़ 1,000 पौधे (~100 ग्राम बीज)',
      },
      spacing: '2 m × 2 m',
      depthCm: 'Raised bed (15 cm)',
      tip: {
        en: 'Always plant on raised mounds so rainwater never touches the stem collar—papaya dies quickly in waterlogging.',
        te: 'మొక్క మొదలు వద్ద నీరు నిలవకుండా ఎల్లప్పుడూ ఎత్తైన గట్లపై నాటండి.',
        hi: 'पपीता हमेशा ऊंची मेड़ पर लगाएं ताकि तने के पास पानी न रुके—पानी भरने से पौधा सड़ जाता है।',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 3600,
      method: 'Drip (Ring basin)',
      tip: {
        en: 'Keep drip emitters 30 cm away from the trunk so the collar stays dry.',
        te: 'డ్రిప్ పైపును కాండం నుండి 30 సెం.మీ దూరంలో ఉంచండి.',
        hi: 'ड्रिप को तने से 30 सेमी दूर रखें ताकि तना सूखा रहे और सड़न न हो।',
      },
    },
    fertilizers: [
      { stage: 'Monthly Cycle', name: 'NPK 19-19-19 + Boron', kgPerAcre: 30, timing: 'Every 30 days' },
      { stage: 'Fruiting', name: 'Potash + Micronutrients', kgPerAcre: 35, timing: 'Month 5 onward' },
    ],
    pests: [
      {
        name: 'Papaya Ringspot Virus / Mealybug',
        observationSign: {
          en: 'Mosaic yellow-green mottled leaves with stunted top or white cottony bugs under leaves.',
          te: 'ఆకులపై పసుపు ఆకుపచ్చ మచ్చలు, ఎదుగుదల ఆగడం లేదా తెల్ల పిండి పురుగు.',
          hi: 'पत्तियों पर पीला-हरा चितकबरापन और सिकुड़न या सफेद चूर्णी कीड़ा।',
        },
        treatment: {
          en: 'Install yellow sticky traps, control aphids early with Neem oil, and remove virus-infected plants promptly.',
          te: 'పసుపు జిగురు అట్టలు పెట్టి వేప నూనె చల్లండి; వైరస్ సోకిన మొక్కలను తీసేయండి.',
          hi: 'पीले चिपचिपे ट्रैप लगाएं, नीम तेल छिड़कें और वायरस वाले पौधे तुरंत हटा दें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '240–270 days (continuous picking)',
      expectedYieldKgPerAcre: 22000,
      readinessSigns: {
        en: 'Harvest when yellow streaks cover 25–30% of fruit skin from blossom end.',
        te: 'కాయ కింది భాగంలో 25–30% పసుపు రంగు కనిపించినప్పుడు కోయండి.',
        hi: 'फल के निचले हिस्से से 25–30% पीली धारियाँ दिखने पर तुड़ाई करें।',
      },
      storageTip: {
        en: 'Wrap each papaya in soft paper/foam net inside crates to prevent skin bruising.',
        te: 'కాయలకు దెబ్బ తగలకుండా పేపర్ లేదా ఫోమ్ నెట్ వేసి క్రేట్లలో సర్దండి.',
        hi: 'खरोंच से बचाने के लिए हर पपीते को कागज या फोम नेट में लपेटकर रखें।',
      },
    },
    weatherAdvice: {
      en: 'Cut deep drainage channels before monsoon; stagnant water for 24 hours can kill papaya roots.',
      te: 'వర్షాకాలంలో 24 గంటలు నీరు నిలిచినా బొప్పాయి వేర్లు కుళ్ళిపోతాయి—కాలువలు తీయండి.',
      hi: 'बारिश से पहले जल निकासी नालियाँ बनाएं; 24 घंटे पानी रुकने पर जड़ें गल जाती हैं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–10', action: { en: 'Build 30 cm high raised beds with drainage trenches.', te: 'నీరు పోయే కాలువలతో 30 సెం.మీ ఎత్తైన బెడ్లు చేయండి.', hi: 'जल निकासी के साथ 30 सेमी ऊंची मेड़ें बनाएं।' } },
      sowing: { days: 'Day 11–45', action: { en: 'Raise seedlings in polybags and transplant at 6-leaf stage.', te: 'పాలీబ్యాగ్‌లో నారు పెంచి 6 ఆకుల దశలో నాటండి.', hi: 'पॉलीबैग में पौध तैयार कर 6 पत्ती होने पर रोपाई करें।' } },
      germination: { days: 'Day 46–65', action: { en: 'Protect young seedlings from damping-off with light drip only.', te: 'మొలక కుళ్ళు రాకుండా తక్కువ నీరు మాత్రమే ఇవ్వండి.', hi: 'गलन से बचाने के लिए बहुत हल्की सिंचाई दें।' } },
      vegetative_growth: { days: 'Day 66–130', action: { en: 'Feed balanced NPK + Boron monthly for thick stems.', te: 'కాండం బలంగా పెరగడానికి ప్రతి నెలా NPK మరియు బోరాన్ వేయండి.', hi: 'मजबूत तने के लिए हर महीने संतुलित NPK व बोरॉन दें।' } },
      flowering: { days: 'Day 131–170', action: { en: 'Flowers appear—thin extra crowded fruits from same node.', te: 'ఒకే చోట ఎక్కువ కాయలు ఉంటే నాణ్యత కోసం అదనపువి తీసేయండి.', hi: 'एक गांठ पर ज्यादा फल हों तो छोटे फल छांट दें।' } },
      maturity: { days: 'Day 171–240', action: { en: 'Fruits reach full size and show first yellow stripe.', te: 'కాయలు పూర్తిగా పెరిగి పసుపు చార కనిపించడం మొదలవుతుంది.', hi: 'फल पूरे आकार के होकर पीली धारियाँ दिखाने लगते हैं।' } },
      harvesting: { days: 'Day 241–360', action: { en: 'Pick twice weekly and pack carefully in padded crates.', te: 'వారానికి రెండుసార్లు కోసి మెత్తటి క్రేట్లలో సర్దండి.', hi: 'सप्ताह में दो बार तुड़ाई कर गद्देदार क्रेट में रखें।' } },
    },
  },
  {
    id: 'watermelon',
    category: 'fruits',
    emoji: '🍉',
    names: { en: 'Watermelon', te: 'పుచ్చకాయ', hi: 'तरबूज' },
    defaultVariety: 'Sugar Baby / Melody Hybrid',
    bestSeason: {
      en: 'Jan–Mar (Summer crop) & Nov–Dec',
      te: 'జనవరి–మార్చి (వేసవి) & నవం–డిసెం',
      hi: 'जनवरी–मार्च (गर्मी) और नवंबर–दिसंबर',
    },
    plantation: {
      seedRateKgPerAcre: 0.6,
      spacing: '2 m × 0.6 m',
      depthCm: '2–3 cm',
      tip: {
        en: 'Use silver-black plastic mulch with drip irrigation—keeps weeds away, saves water, and gives sweeter, cleaner melons.',
        te: 'డ్రిప్ మరియు సిల్వర్ మల్చింగ్ షీట్ వాడితే కలుపు లేకుండా పెద్ద, తియ్యని కాయలు వస్తాయి.',
        hi: 'ड्रिप के साथ सिल्वर मल्चिंग शीट का उपयोग करें—खरपतवार नहीं उगते और फल मीठे होते हैं।',
      },
    },
    irrigation: {
      frequencyDays: 3,
      litersPerAcre: 3200,
      method: 'Drip',
      tip: {
        en: 'Reduce water gradually 7–10 days before harvest so fruit sugar (sweetness) shoots up and melons do not burst.',
        te: 'కోతకు 7–10 రోజుల ముందు నీరు తగ్గిస్తే కాయలో తీపి పెరుగుతుంది, పగలవు.',
        hi: 'कटाई से 7–10 दिन पहले पानी कम कर दें ताकि तरबूज ज्यादा मीठे हों और फटें नहीं।',
      },
    },
    fertilizers: [
      { stage: 'Basal', name: 'Compost + DAP + Potash', kgPerAcre: 90, timing: 'Before mulch' },
      { stage: 'Vine & Flower', name: 'NPK 19-19-19 + Boron', kgPerAcre: 20, timing: 'Day 20 & 35' },
      { stage: 'Fruit Enlargement', name: '0-0-50 Potash', kgPerAcre: 20, timing: 'Day 50–65' },
    ],
    pests: [
      {
        name: 'Fruit Fly & Downy Mildew',
        observationSign: {
          en: 'Small dimples with oozing gum on young fruits or angular yellow spots on leaves.',
          te: 'పిందెలపై రంధ్రాలు చేసి జిగురు కారడం లేదా ఆకులపై పసుపు మచ్చలు.',
          hi: 'छोटे फलों पर छेद व गोंद निकलना या पत्तियों पर पीले कोणीय धब्बे।',
        },
        treatment: {
          en: 'Hang Cue-lure fruit fly traps (6 per acre) at flowering and avoid evening leaf wetness.',
          te: 'పూత దశలో ఎకరాకు 6 ఫ్రూట్ ఫ్లై బుట్టలు కట్టండి.',
          hi: 'फूल आते ही प्रति एकड़ 6 फ्रूट फ्लाई ट्रैप लगाएं और शाम को सिंचाई न करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '75–90 days',
      expectedYieldKgPerAcre: 14000,
      readinessSigns: {
        en: 'Tendril nearest the fruit stem dries brown, belly spot on ground turns creamy yellow, and tapping gives a dull thud.',
        te: 'కాయ దగ్గరి తీగ ఎండిపోయి, నేలకు తగిలే భాగం లేత పసుపుగా మారి, తట్టితే బోలు శబ్దం వస్తే కోతకు సిద్ధం.',
        hi: 'फल के पास की लता सूखकर भूरी हो जाए, जमीन से लगा हिस्सा पीला हो और थपथपाने पर भारी आवाज आए।',
      },
      storageTip: {
        en: 'Keep harvested melons on straw cushions in shade; do not stack more than 3 high.',
        te: 'కోసిన కాయలను నీడలో గడ్డిపై ఉంచండి—3 కంటే ఎక్కువ ఎత్తుగా పేర్చకండి.',
        hi: 'तुड़ाई के बाद तरबूजों को छाया में पुआल पर रखें—3 परत से ऊंचा ढेर न लगाएं।',
      },
    },
    weatherAdvice: {
      en: 'Bees do the pollination—never spray insecticides before 10 AM when honeybees are active on flowers.',
      te: 'తేనెటీగలు పూత సమయంలో వస్తాయి—ఉదయం వేళ పురుగు మందులు పిచికారీ చేయకండి.',
      hi: 'मधुमक्खियाँ सुबह परागण करती हैं—फूल आने पर दोपहर बाद ही दवा छिड़कें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Day 1–8', action: { en: 'Make raised beds, lay drip, and cover with mulch film.', te: 'ఎత్తు బెడ్లు చేసి డ్రిప్, మల్చింగ్ షీట్ వేయండి.', hi: 'ऊंची मेड़ें बनाकर ड्रिप और मल्चिंग बिछाएं।' } },
      sowing: { days: 'Day 9–12', action: { en: 'Sow 1–2 seeds per hole 2 cm deep.', te: 'రంద్రానికి 1–2 విత్తనాలు 2 సెం.మీ లోతులో వేయండి.', hi: 'हर छेद में 1–2 बीज 2 सेमी गहराई में बोएं।' } },
      germination: { days: 'Day 13–20', action: { en: 'Protect emerging seedlings from red pumpkin beetle.', te: 'మొలకలను ఎర్ర పెంకు పురుగు నుండి కాపాడండి.', hi: 'नए पौधों को लाल कद्दू भृंग से बचाएं।' } },
      vegetative_growth: { days: 'Day 21–35', action: { en: 'Guide vines cleanly along beds.', te: 'తీగలను మడులపైకి సరిగా మళ్ళించండి.', hi: 'बेलों को क्यारी पर सही दिशा में फैलाएं।' } },
      flowering: { days: 'Day 36–50', action: { en: 'Hang fruit fly traps; keep bees safe for high fruit set.', te: 'ఫ్రూట్ ఫ్లై బుట్టలు కట్టండి; తేనెటీగలను రక్షించండి.', hi: 'फ्रूट फ्लाई ट्रैप लगाएं और मधुमक्खियों को बचाएं।' } },
      maturity: { days: 'Day 51–72', action: { en: 'Feed 0-0-50 Potash and cut water 1 week before harvest.', te: 'పొటాష్ ఇచ్చి కోతకు వారం ముందు నీరు తగ్గించండి.', hi: 'पोटाश दें और कटाई से 1 सप्ताह पहले पानी कम करें।' } },
      harvesting: { days: 'Day 73–90', action: { en: 'Cut ripe melons with 3 cm stem in the morning.', te: 'ఉదయాన్నే 3 సెం.మీ కాడతో పండిన కాయలు కోయండి.', hi: 'सुबह 3 सेमी डंठल के साथ पके तरबूज काटें।' } },
    },
  },
  {
    id: 'pomegranate',
    category: 'fruits',
    emoji: '🍎',
    names: { en: 'Pomegranate', te: 'దానిమ్మ', hi: 'अनार' },
    defaultVariety: 'Bhagwa',
    bestSeason: {
      en: 'Jun–Aug planting (Bahar crop regulation)',
      te: 'జూన్–ఆగస్టు నాట్లు',
      hi: 'जून–अगस्त रोपाई',
    },
    plantation: {
      seedRateKgPerAcre: 300,
      seedNote: {
        en: '300 air-layered saplings per acre',
        te: 'ఎకరాకు 300 దానిమ్మ మొక్కలు',
        hi: 'प्रति एकड़ 300 अनार के पौधे',
      },
      spacing: '4.5 m × 3 m',
      depthCm: '60 cm pit',
      tip: {
        en: 'Maintain 3–4 main healthy stems per bush and remove ground suckers regularly.',
        te: 'మొక్కకు 3–4 బలమైన కొమ్మలను ఉంచి కింది నుండి వచ్చే పిలకలను తీసేయండి.',
        hi: 'पौधे में 3–4 मुख्य तने रखें और जमीन से निकलने वाले कल्ले हटाते रहें।',
      },
    },
    irrigation: {
      frequencyDays: 5,
      litersPerAcre: 3200,
      method: 'Drip',
      tip: {
        en: 'Maintain steady drip moisture during fruit growth—irregular watering causes fruit cracking.',
        te: 'కాయలు పెరిగేటప్పుడు నీరు సమానంగా ఇవ్వండి—హెచ్చుతగ్గులు ఉంటే కాయలు పగులుతాయి.',
        hi: 'फल बढ़ते समय सिंचाई नियमित रखें—कमी-ज्यादती से अनार फट जाते हैं।',
      },
    },
    fertilizers: [
      { stage: 'Bahar Start', name: 'Compost + Neem Cake + SSP', kgPerAcre: 200, timing: 'After pruning' },
      { stage: 'Fruit Set & Fill', name: '12-61-0 & 0-0-50 Potash + Boron', kgPerAcre: 30, timing: 'Monthly via drip' },
    ],
    pests: [
      {
        name: 'Fruit Borer & Bacterial Blight',
        observationSign: {
          en: 'Black angular oily spots on leaves/fruits or holes bored inside fruits.',
          te: 'కాయలపై నల్లని నూనె మచ్చలు లేదా కాయలో పురుగు రంధ్రాలు.',
          hi: 'फल व पत्तियों पर काले तैलीय धब्बे या फलों में तितली की इल्ली के छेद।',
        },
        treatment: {
          en: 'Prune and burn infected twigs cleanly; bag fruits or spray recommended bactericide/neem.',
          te: 'తెగులు కొమ్మలు కత్తిరించి కాల్చేయండి; కాయలకు రక్షణ సంచులు కట్టండి.',
          hi: 'संक्रमित टहनियाँ काटकर जलाएं और फलों की सुरक्षा के लिए बैगिंग करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '150–170 days after flowering',
      expectedYieldKgPerAcre: 5000,
      readinessSigns: {
        en: 'Skin turns deep glossy Bhagwa red and tapping fruit gives a metallic ringing sound.',
        te: 'కాయ పూర్తి ఎరుపు రంగులోకి మారి తట్టినప్పుడు లోహపు శబ్దం వస్తే కోతకు సిద్ధం.',
        hi: 'छिलका चमकदार लाल हो जाए और थपथपाने पर धातु जैसी आवाज आए तो कटाई करें।',
      },
      storageTip: {
        en: 'Clip fruits cleanly with secateurs so sharp stems do not puncture other fruits.',
        te: 'కత్తెరతో కాడను దగ్గరగా కత్తిరించి గ్రేడ్ చేసి పెట్టెలలో సర్దండి.',
        hi: 'कटर से डंठल छोटा काटें ताकि पैकिंग में दूसरे फलों को न चुभे।',
      },
    },
    weatherAdvice: {
      en: 'Dry moderate weather produces bright clean fruit skin; watch humidity for fungal fruit spots.',
      te: 'పొడి వాతావరణంలో కాయ రంగు బాగుంటుంది; వర్షాలలో మచ్చల నుండి కాపాడండి.',
      hi: 'शुष्क मौसम में फल का रंग सुंदर रहता है; नमी में धब्बा रोग से बचाएं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Month 1', action: { en: 'Dig 60 cm pits and enrich with compost & neem cake.', te: '60 సెం.మీ గుంతలు తవ్వి కంపోస్టు, వేప పిండి కలపండి.', hi: '60 सेमी गड्ढे खोदकर खाद व नीम खली मिलाएं।' } },
      sowing: { days: 'Month 2', action: { en: 'Plant certified Bhagwa saplings and install drip.', te: 'భగ్వా రకం మొక్కలు నాటి డ్రిప్ ఏర్పాటు చేయండి.', hi: 'प्रमाणित भगवा पौधे लगाकर ड्रिप सिस्टम चालू करें।' } },
      germination: { days: 'Year 1', action: { en: 'Train 3–4 main stems and remove lower shoots.', te: '3–4 ప్రధాన కొమ్మలను పెంచి కింది పిలకలు తీయండి.', hi: '3–4 मुख्य तने विकसित करें और नीचे के कल्ले हटाएं।' } },
      vegetative_growth: { days: 'Bahar Prep', action: { en: 'Lightly prune orchard and apply basal organic manure.', te: 'పొదలను తేలికగా కత్తిరించి సేంద్రీయ ఎరువు వేయండి.', hi: 'हल्की छंटाई कर जैविक खाद डालें।' } },
      flowering: { days: 'Day 1–45', action: { en: 'Release light irrigation to trigger uniform bloom.', te: 'సమాన పూత కోసం తేలికగా నీరు ఇవ్వండి.', hi: 'समान फूल आने के लिए हल्की सिंचाई शुरू करें।' } },
      maturity: { days: 'Day 46–145', action: { en: 'Keep moisture steady to avoid cracking; add Potash.', te: 'కాయలు పగలకుండా నీరు సమంగా ఇచ్చి పొటాష్ వేయండి.', hi: 'फल फटने से रोकने के लिए नियमित पानी व पोटाश दें।' } },
      harvesting: { days: 'Day 146–170', action: { en: 'Clip glossy deep red fruits with secateurs.', te: 'మెరిసే ఎర్రని కాయలను కత్తెరతో కోయండి.', hi: 'गहरे लाल चमकदार अनार कटर से तोड़ें।' } },
    },
  },
  {
    id: 'guava',
    category: 'fruits',
    emoji: '🍐',
    names: { en: 'Guava', te: 'జామ', hi: 'अमरूद' },
    defaultVariety: 'Allahabad Safeda / Lucknow-49 / Taiwan Pink',
    bestSeason: {
      en: 'Jul–Aug planting',
      te: 'జూలై–ఆగస్టు నాట్లు',
      hi: 'जुलाई–अगस्त रोपाई',
    },
    plantation: {
      seedRateKgPerAcre: 160,
      seedNote: {
        en: '160–400 grafted/layered saplings per acre',
        te: 'ఎకరాకు 160–400 జామ మొక్కలు',
        hi: 'प्रति एकड़ 160–400 अमरूद के पौधे',
      },
      spacing: '5 m × 5 m (or 3 m × 3 m)',
      depthCm: '60 cm pit',
      tip: {
        en: 'Pinch tips after 60 cm height so plants branch low and produce reachable fruits.',
        te: '60 సెం.మీ ఎత్తులో చిగుళ్ళు తుంచితే తక్కువ ఎత్తులోనే ఎక్కువ కొమ్మలు, కాయలు వస్తాయి.',
        hi: '60 सेमी ऊंचाई पर ऊपर से कटाई करें ताकि पौधा नीचे ही फैले और तुड़ाई आसान रहे।',
      },
    },
    irrigation: {
      frequencyDays: 8,
      litersPerAcre: 3600,
      method: 'Drip / Basin',
      tip: {
        en: 'Winter crop (Mrig Bahar) tastes sweetest and has fewest fruit flies.',
        te: 'శీతాకాలపు జామ పంట చాలా తియ్యగా ఉండి పురుగు తక్కువగా ఉంటుంది.',
        hi: 'सर्दियों की फसल (मृग बहार) सबसे मीठी होती है और इसमें कीट भी कम लगते हैं।',
      },
    },
    fertilizers: [
      { stage: 'Post-Pruning', name: 'FYM Compost + NPK', kgPerAcre: 150, timing: 'June & October' },
      { stage: 'Fruit Growth', name: 'Potash + Zinc Sulfate', kgPerAcre: 25, timing: 'Pre-harvest' },
    ],
    pests: [
      {
        name: 'Fruit Fly & Wilt',
        observationSign: {
          en: 'Maggots inside soft ripe fruits or sudden yellowing and drying of whole branch.',
          te: 'పండు లోపల పురుగులు లేదా కొమ్మ ఒక్కసారిగా పసుపు రంగులోకి మారి ఎండిపోవడం.',
          hi: 'पके फल के अंदर सफेद कीड़े या पूरी टहनी का अचानक सूख जाना।',
        },
        treatment: {
          en: 'Bag young Taiwan guavas with foam+polythene sleeves and hang Methyl Eugenol traps (6 per acre).',
          te: 'కాయలకు సంచులు కట్టి ఎకరాకు 6 మిథైల్ యూజినాల్ బుట్టలు పెట్టండి.',
          hi: 'फलों पर थैली चढ़ाएं और प्रति एकड़ 6 मिथाइल यूजीनॉल ट्रैप लगाएं।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '110–130 days after flowering',
      expectedYieldKgPerAcre: 7500,
      readinessSigns: {
        en: 'Skin changes from dark green to pale greenish-yellow and gives slightly when gently pressed.',
        te: 'కాయ ముదురు ఆకుపచ్చ నుండి లేత పసుపు ఆకుపచ్చలోకి మారినప్పుడు కోయండి.',
        hi: 'फल गहरा हरा से हल्का पीला-हरा हो जाए और हल्का दबाने पर नरम लगे तो तोड़ें।',
      },
      storageTip: {
        en: 'Pick in early morning cool hours and sell within 2–3 days.',
        te: 'ఉదయాన్నే చల్లని వేళలో కోసి 2–3 రోజులలోగా మార్కెట్‌కు పంపండి.',
        hi: 'सुबह की ठंडक में तुड़ाई करें और 2–3 दिन में बाजार भेजें।',
      },
    },
    weatherAdvice: {
      en: 'Avoid heavy irrigation during ripening so fruits stay crunchy and sweet.',
      te: 'పండ్లు పండే సమయంలో నీరు ఎక్కువ పెడితే తీపి తగ్గి మెత్తబడతాయి.',
      hi: 'फल पकते समय ज्यादा पानी न दें वरना मिठास कम हो जाती है।',
    },
    stagesInfo: {
      land_preparation: { days: 'Month 1', action: { en: 'Prepare 60 cm pits with compost & neem cake.', te: 'కంపోస్టు వేపపిండితో గుంతలు సిద్ధం చేయండి.', hi: 'खाद व नीम खली के साथ गड्ढे तैयार करें।' } },
      sowing: { days: 'Month 2', action: { en: 'Plant layered/grafted saplings during rains.', te: 'వర్షాకాలంలో అంటు మొక్కలు నాటండి.', hi: 'मानसून में कलमी पौधे लगाएं।' } },
      germination: { days: 'Year 1', action: { en: 'Prune main stem at 60 cm to form wide framework.', te: '60 సెం.మీ వద్ద కత్తిరించి కొమ్మలు పెంచండి.', hi: '60 सेमी पर छंटाई कर मजबूत ढांचा बनाएं।' } },
      vegetative_growth: { days: 'May–Jun', action: { en: 'Prune side tips by 50% to stimulate new flowering shoots.', te: 'కొత్త పూత కోసం కొమ్మల చివర్లు కత్తిరించండి.', hi: 'नए फूल वाले कल्लों के लिए हल्की छंटाई करें।' } },
      flowering: { days: 'Jul–Aug', action: { en: 'Hang fruit fly pheromone traps cleanly.', te: 'ఫ్రూట్ ఫ్లై బుట్టలను తోటలో కట్టండి.', hi: 'बाग में फल मक्खी के ट्रैप लटकाएं।' } },
      maturity: { days: 'Sep–Nov', action: { en: 'Bag marble-sized fruits for blemish-free export quality.', te: 'నాణ్యమైన కాయల కోసం పిందెలకు కవర్లు కట్టండి.', hi: 'बेदाग फलों के लिए छोटे फलों पर थैलियाँ बांधें।' } },
      harvesting: { days: 'Nov–Feb', action: { en: 'Pick crisp pale-green/yellow guavas every 2–3 days.', te: 'ప్రతి 2–3 రోజులకు కాయలను జాగ్రత్తగా కోయండి.', hi: 'हर 2–3 दिन में हल्के पीले अमरूद तोड़ें।' } },
    },
  },
  {
    id: 'grapes',
    category: 'fruits',
    emoji: '🍇',
    names: { en: 'Grapes', te: 'ద్రాక్ష', hi: 'अंगूर' },
    defaultVariety: 'Thompson Seedless / Sonaka',
    bestSeason: {
      en: 'Oct–Jan (Fruit pruning) & Apr (Foundation pruning)',
      te: 'అక్టోబర్–జనవరి & ఏప్రిల్ కత్తిరింపు',
      hi: 'अक्टूबर–जनवरी और अप्रैल छंटाई',
    },
    plantation: {
      seedRateKgPerAcre: 650,
      seedNote: {
        en: '650 rooted cuttings/grafts on Dogridge rootstock per acre',
        te: 'ఎకరాకు 650 ద్రాక్ష అంటు మొక్కలు',
        hi: 'प्रति एकड़ 650 अंगूर के पौधे',
      },
      spacing: '3 m × 2 m (Y-trellis)',
      depthCm: '60 cm trench',
      tip: {
        en: 'Train vines on sturdy Y-trellis wires so bunches hang freely with good air flow.',
        te: 'మంచి గాలి, వెలుతురు తగిలేలా పందిరి తీగలపై తీగలను పెంచండి.',
        hi: 'बेलों को मजबूत तार वाले मचान पर चढ़ाएं ताकि गुच्छे हवादार रहें।',
      },
    },
    irrigation: {
      frequencyDays: 3,
      litersPerAcre: 3500,
      method: 'Drip',
      tip: {
        en: 'Cut back water 12 days before harvest to boost berry sweetness (Brix).',
        te: 'పండ్లలో తీపి పెరగడానికి కోతకు 12 రోజుల ముందు నీరు తగ్గించండి.',
        hi: 'मिठास बढ़ाने के लिए कटाई से 12 दिन पहले पानी कम कर दें।',
      },
    },
    fertilizers: [
      { stage: 'Post-Pruning', name: 'FYM + SSP + Magnesium', kgPerAcre: 180, timing: 'At pruning' },
      { stage: 'Berry Growth', name: '0-52-34 & 0-0-50 Potash', kgPerAcre: 35, timing: 'Drip fertigation' },
    ],
    pests: [
      {
        name: 'Downy Mildew & Thrips',
        observationSign: {
          en: 'Oily yellow patches on upper leaf with white fuzz underneath, or scabby marks on berries.',
          te: 'ఆకు పైభాగంలో నూనె మచ్చలు, కింద తెల్ల బూజు లేదా కాయలపై గీతలు.',
          hi: 'पत्तियों के ऊपर पीले तैलीय धब्बे व नीचे सफेद रुई जैसा चूर्ण, या दानों पर खुरदरे निशान।',
        },
        treatment: {
          en: 'Spray preventive control immediately after morning dew or unseasonal drizzle.',
          te: 'తుంపర వర్షం లేదా మంచు పడిన వెంటనే తగిన నివారణ మందు పిచికారీ చేయండి.',
          hi: 'ओस या हल्की बारिश के तुरंत बाद अनुशंसित फफूंदनाशी का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '130–145 days after October pruning',
      expectedYieldKgPerAcre: 9000,
      readinessSigns: {
        en: 'Berries turn translucent amber/gold-green, taste sweet, and stems turn slightly woody.',
        te: 'కాయలు పారదర్శకంగా, తియ్యగా మారినప్పుడు గుత్తులను కోయండి.',
        hi: 'दाने हल्के पारदर्शी और पूरी तरह मीठे हो जाएं तो गुच्छे काटें।',
      },
      storageTip: {
        en: 'Harvest cool before 9 AM and pack gently in lined boxes without rubbing off natural white bloom.',
        te: 'ఉదయం 9 గంటలలోపు కోసి పెట్టెలలో జాగ్రత్తగా ప్యాక్ చేయండి.',
        hi: 'सुबह 9 बजे से पहले तोड़ें और बिना रगड़े बक्सों में पैक करें।',
      },
    },
    weatherAdvice: {
      en: 'High humidity triggers Downy Mildew rapidly—keep canopy open and watch Weather Alerts.',
      te: 'అధిక తేమ వల్ల బూజు తెగులు వేగంగా వస్తుంది—పందిరిలో గాలి ఆడేలా చూడండి.',
      hi: 'अधिक नमी से मृदुरोमिल आसिता तेजी से फैलता है—मौसम अलर्ट देखते रहें।',
    },
    stagesInfo: {
      land_preparation: { days: 'Month 1', action: { en: 'Install Y-trellis poles/wires and dig planting trenches.', te: 'పందిరి స్తంభాలు, తీగలు వేసి కాలువలు తీయండి.', hi: 'मचान के खंभे व तार लगाएं और नालियाँ बनाएं।' } },
      sowing: { days: 'Month 2', action: { en: 'Plant Dogridge rootstocks and graft desired variety.', te: 'వేరు మొక్కలు నాటి మేలైన రకం అంటు కట్టండి.', hi: 'रूटस्टॉक लगाकर अच्छी किस्म की कलम बांधें।' } },
      germination: { days: 'Day 1–20', action: { en: 'After pruning, bud break starts; keep drip steady.', te: 'కత్తిరింపు తర్వాత మొగ్గలు వస్తాయి; డ్రిప్ నీరు ఇవ్వండి.', hi: 'छंटाई के बाद कल्ले निकलते हैं; नियमित ड्रिप दें।' } },
      vegetative_growth: { days: 'Day 21–45', action: { en: 'Thin weak shoots and tie fruiting canes onto trellis.', te: 'బలహీన కొమ్మలు తీసి మంచి తీగలను పందిరికి కట్టండి.', hi: 'कमजोर कल्ले हटाएं और अच्छी टहनियों को तार से बांधें।' } },
      flowering: { days: 'Day 46–70', action: { en: 'Protect blossoms from thrips and mildew.', te: 'పూతను తామర పురుగు, బూజు నుండి కాపాడండి.', hi: 'फूलों को थ्रिप्स और फफूंद से बचाएं।' } },
      maturity: { days: 'Day 71–125', action: { en: 'Berry thinning & Potash feed for sweet plump bunches.', te: 'చిన్న కాయలు తీసేసి పొటాష్ ఇస్తే గుత్తులు పెద్దవవుతాయి.', hi: 'गुच्छों की छंटाई करें और पोटाश दें।' } },
      harvesting: { days: 'Day 126–145', action: { en: 'Snip sweet clean bunches in cool morning hours.', te: 'ఉదయం చల్లని వేళలో తియ్యని ద్రాక్ష గుత్తులను కోయండి.', hi: 'सुबह की ठंडक में मीठे गुच्छे काटें।' } },
    },
  },
  {
    id: 'citrus',
    category: 'fruits',
    emoji: '🍊',
    names: { en: 'Sweet Orange / Citrus', te: 'బత్తాయి / నిమ్మ', hi: 'मौसंबी / संतरा' },
    defaultVariety: 'Sathgudi / Nagpur Mandarin / Kagzi Lime',
    bestSeason: {
      en: 'Jul–Aug orchard planting',
      te: 'జూలై–ఆగస్టు నాట్లు',
      hi: 'जुलाई–अगस्त रोपाई',
    },
    plantation: {
      seedRateKgPerAcre: 110,
      seedNote: {
        en: '110 budded saplings per acre (6 m × 6 m)',
        te: 'ఎకరాకు 110 అంటు మొక్కలు',
        hi: 'प्रति एकड़ 110 कलमी पौधे',
      },
      spacing: '6 m × 6 m',
      depthCm: '60 cm pit',
      tip: {
        en: 'Keep bud union 20 cm above soil and never let irrigation water directly touch the trunk.',
        te: 'అంటు కట్టిన భాగం నేలకు 20 సెం.మీ పైన ఉంచి, కాండానికి నీరు తగలకుండా రింగ్ పద్ధతిలో నీరు పెట్టండి.',
        hi: 'कलम का जोड़ जमीन से 20 सेमी ऊपर रखें और पानी सीधे तने को न छूने दें।',
      },
    },
    irrigation: {
      frequencyDays: 8,
      litersPerAcre: 3800,
      method: 'Drip (Double ring)',
      tip: {
        en: 'Rest trees with 30 days of dry stress before watering to trigger heavy flowering.',
        te: 'మంచి పూత కోసం నీరు ఇవ్వడానికి ముందు 30 రోజులు చెట్టుకు తడి ఆరనివ్వండి.',
        hi: 'अच्छे फूल आने के लिए सिंचाई से पहले 30 दिन का हल्का सूखा (बहार तनाव) दें।',
      },
    },
    fertilizers: [
      { stage: 'Bahar Start', name: 'FYM + Neem Cake + NPK', kgPerAcre: 180, timing: 'June & January' },
      { stage: 'Fruit Fill', name: 'Potash + Zinc + Magnesium', kgPerAcre: 25, timing: 'Foliar / Drip' },
    ],
    pests: [
      {
        name: 'Citrus Leaf Miner & Canker',
        observationSign: {
          en: 'Silvery zig-zag tunnels on young tender leaves or raised brown corky spots on fruits.',
          te: 'లేత ఆకులపై వెండి గీతలు లేదా కాయలపై గోధుమ గరుకు మచ్చలు.',
          hi: 'नई पत्तियों पर चांदी जैसी टेढ़ी-मेढ़ी लकीरें या फलों पर भूरे खुरदरे धब्बे।',
        },
        treatment: {
          en: 'Spray Neem oil on new flushes every 10 days and prune cankered twigs.',
          te: 'కొత్త చిగుళ్ళు వచ్చినప్పుడు ప్రతి 10 రోజులకు వేప నూనె చల్లండి.',
          hi: 'नई पत्तियाँ निकलते समय हर 10 दिन में नीम तेल का छिड़काव करें।',
        },
      },
    ],
    harvest: {
      daysToHarvest: '210–240 days after bloom',
      expectedYieldKgPerAcre: 8500,
      readinessSigns: {
        en: 'Fruit skin turns glossy green-yellow/orange, feels heavy with juice, and tastes sweet.',
        te: 'కాయ తొక్క మెరుస్తూ లేత పసుపు/నారింజ రంగులోకి మారి రసంతో నిండినప్పుడు కోయండి.',
        hi: 'फल का छिलका चमकदार पीला-नारंगी हो जाए और रस भर जाए तो तुड़ाई करें।',
      },
      storageTip: {
        en: 'Clip fruits cleanly with no sharp stem stubs that poke neighboring citrus.',
        te: 'కత్తెరతో కాడ లేకుండా కోసి గాలి ఆడే క్రేట్లలో సర్దండి.',
        hi: 'कटर से डंठल छोटा काटकर हवादार क्रेट में रखें।',
      },
    },
    weatherAdvice: {
      en: 'Zinc & Magnesium foliar spray keeps leaves dark green before summer heat.',
      te: 'వేసవి ఎండలకు ముందు జింక్, మెగ్నీషియం పిచికారీ చేస్తే ఆకులు పచ్చగా ఉంటాయి.',
      hi: 'गर्मियों से पहले जिंक और मैग्नीशियम के छिड़काव से पत्ते हरे-भरे रहते हैं।',
    },
    stagesInfo: {
      land_preparation: { days: 'Month 1', action: { en: 'Dig 60 cm pits at 6×6 m and fill with manure.', te: '6×6 మీ దూరంలో గుంతలు తవ్వి ఎరువు వేయండి.', hi: '6×6 मीटर पर गड्ढे खोदकर खाद भरें।' } },
      sowing: { days: 'Month 2', action: { en: 'Plant certified budded saplings upright.', te: 'ఆరోగ్యకరమైన అంటు మొక్కలు నాటండి.', hi: 'प्रमाणित कलमी पौधे लगाएं।' } },
      germination: { days: 'Year 1', action: { en: 'Protect tender flushes from leaf miner with Neem oil.', te: 'కొత్త చిగుళ్ళను వేప నూనెతో కాపాడండి.', hi: 'नई कोपलों को नीम तेल से बचाएं।' } },
      vegetative_growth: { days: 'Pre-Bahar', action: { en: 'Prune dry inner twigs and clear orchard weeds.', te: 'ఎండిన లోపలి కొమ్మలను కత్తిరించి కలుపు తీయండి.', hi: 'सूखी टहनियाँ काटें और बगीचा साफ रखें।' } },
      flowering: { days: 'Month 1–2', action: { en: 'Resume watering smoothly after rest period to burst blooms.', te: 'విశ్రాంతి తర్వాత నీరు ఇచ్చి పూత రప్పించండి.', hi: 'तनाव के बाद पानी शुरू कर फूल लाएं।' } },
      maturity: { days: 'Month 3–7', action: { en: 'Feed Potash + Zinc for juicy, sweet, large fruits.', te: 'రసం, తీపి కోసం పొటాష్ మరియు జింక్ ఇవ్వండి.', hi: 'मीठे और बड़े फलों के लिए पोटाश व जिंक दें।' } },
      harvesting: { days: 'Month 8', action: { en: 'Clip ripe fruits carefully and sort by size.', te: 'పండిన కాయలను కత్తెరతో కోసి సైజు వారీగా వేరు చేయండి.', hi: 'पके फल कटर से काटें और आकार के अनुसार छांटें।' } },
    },
  },
];
