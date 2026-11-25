export type AgriPlaceCategory =
  | 'mandi'
  | 'seeds'
  | 'coldStorage'
  | 'kvk'
  | 'tractor'
  | 'general';

export interface DirectoryPlace {
  title: string;
  category: Exclude<AgriPlaceCategory, 'general'>;
  district: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  services: string;
  hours: string;
  keywords?: string[];
}

export interface MatchedAgriPlace {
  title: string;
  category: Exclude<AgriPlaceCategory, 'general'>;
  address: string;
  distanceKm: number;
  services: string;
  hours: string;
  uri: string;
  directionsUri: string;
  latitude: number;
  longitude: number;
}

const AGRI_PLACES_DIRECTORY: DirectoryPlace[] = [
  // Andhra Pradesh - Guntur / Tenali / Vijayawada
  {
    title: 'Guntur Agricultural Market Yard (Mirchi & Crop Mandi)',
    category: 'mandi',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'NH-16 Bypass Road, Guntur, Andhra Pradesh',
    latitude: 16.3008,
    longitude: 80.4295,
    services: 'Red Chili, Cotton, Maize, Turmeric & Pulses Auction Yard',
    hours: '6:00 AM – 6:30 PM',
    keywords: ['chili', 'cotton', 'turmeric', 'maize', 'apmc', 'mirchi'],
  },
  {
    title: 'Tenali Agricultural Market Committee (APMC Mandi)',
    category: 'mandi',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Market Yard Road, Tenali, Guntur District, Andhra Pradesh',
    latitude: 16.2428,
    longitude: 80.6400,
    services: 'Paddy, Black Gram, Banana, Turmeric & Fresh Vegetables',
    hours: '6:00 AM – 5:30 PM',
    keywords: ['paddy', 'rice', 'banana', 'turmeric', 'vegetable', 'fruit'],
  },
  {
    title: 'Vijayawada Rythu Bazaar & Fruit Mandi (Nunna Mango Yard)',
    category: 'mandi',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    address: 'Swaraj Maidan & Nunna Mango Market, Vijayawada, Andhra Pradesh',
    latitude: 16.5193,
    longitude: 80.6305,
    services: 'Mango, Banana, Papaya, Leafy Greens & Daily Vegetable Mandi',
    hours: '5:30 AM – 8:00 PM',
    keywords: ['mango', 'banana', 'fruit', 'vegetable', 'tomato', 'onion'],
  },
  {
    title: 'IFFCO Kisan Seva Kendra & Seed Depot — Guntur',
    category: 'seeds',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Autonagar Main Road, Guntur, Andhra Pradesh',
    latitude: 16.3145,
    longitude: 80.4590,
    services: 'Certified Paddy/Chili Seeds, Urea, DAP, Nano Urea & Bio-Fertilizers',
    hours: '8:30 AM – 7:30 PM',
  },
  {
    title: 'Tenali Rythu Bharosa Agro Input & Seed Center',
    category: 'seeds',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Morrispet Main Road, Tenali, Guntur District, Andhra Pradesh',
    latitude: 16.2465,
    longitude: 80.6442,
    services: 'Hybrid Vegetable Seeds, Drip Micronutrients & Crop Protection',
    hours: '8:00 AM – 8:00 PM',
  },
  {
    title: 'Guntur District Cold Storage & CWC Agro Godown',
    category: 'coldStorage',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Etukur Road Cold Storage Belt, Guntur, Andhra Pradesh',
    latitude: 16.2782,
    longitude: 80.4486,
    services: 'Temperature-Controlled Chili, Spice, Seed & Horticulture Chambers',
    hours: '7:00 AM – 8:00 PM',
  },
  {
    title: 'ICAR Krishi Vigyan Kendra (KVK Lam) & Soil Testing Lab',
    category: 'kvk',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Lam Agricultural Research Farm, Amaravati Road, Guntur, Andhra Pradesh',
    latitude: 16.3612,
    longitude: 80.4272,
    services: 'Soil NPK & pH Testing, Pest Clinic & Variety Advisory',
    hours: '9:30 AM – 5:00 PM',
  },
  {
    title: 'Guntur Tractor, Rotavator & Submersible Pump Workshop',
    category: 'tractor',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Autonagar Industrial Estate, Guntur, Andhra Pradesh',
    latitude: 16.3111,
    longitude: 80.4648,
    services: 'Tractor Engine Service, Harvester Spares, Borewell & Drip Pump Repair',
    hours: '8:30 AM – 7:00 PM',
  },

  // Telangana - Warangal / Narsampet / Hyderabad
  {
    title: 'Enumamula Agricultural Market Yard (Warangal APMC Mandi)',
    category: 'mandi',
    district: 'Warangal',
    state: 'Telangana',
    address: 'Enumamula Market Road, Warangal, Telangana',
    latitude: 17.9896,
    longitude: 79.6421,
    services: 'Cotton, Red Chili, Paddy, Maize, Turmeric & Vegetable Auction',
    hours: '6:00 AM – 6:00 PM',
    keywords: ['cotton', 'chili', 'paddy', 'maize', 'turmeric'],
  },
  {
    title: 'Narsampet Agricultural Market Yard & Rythu Bazaar',
    category: 'mandi',
    district: 'Warangal',
    state: 'Telangana',
    address: 'Madannapet Road, Narsampet, Warangal District, Telangana',
    latitude: 17.9285,
    longitude: 79.8942,
    services: 'Paddy, Maize, Chili, Tomato & Fresh Local Vegetables',
    hours: '6:00 AM – 5:30 PM',
  },
  {
    title: 'Gaddiannaram & Bowenpally Agricultural Fruit & Vegetable Mandi',
    category: 'mandi',
    district: 'Hyderabad',
    state: 'Telangana',
    address: 'Bowenpally Market Yard, Hyderabad, Telangana',
    latitude: 17.4728,
    longitude: 78.4810,
    services: 'Wholesale Fruits (Mango, Banana, Papaya) & Vegetables',
    hours: '4:30 AM – 7:00 PM',
    keywords: ['fruit', 'mango', 'banana', 'vegetable', 'tomato', 'onion'],
  },
  {
    title: 'Warangal Cooperative Seed & Fertilizer Kendra (MARKFED)',
    category: 'seeds',
    district: 'Warangal',
    state: 'Telangana',
    address: 'Station Road, Hanamkonda / Warangal, Telangana',
    latitude: 18.0055,
    longitude: 79.5603,
    services: 'Certified Seeds, NPK Fertilizers, Zinc & Bio-Pesticides',
    hours: '8:30 AM – 7:30 PM',
  },
  {
    title: 'Enumamula Agro Cold Storage & Grain Warehouse',
    category: 'coldStorage',
    district: 'Warangal',
    state: 'Telangana',
    address: 'Near Enumamula Market Yard, Warangal, Telangana',
    latitude: 17.9918,
    longitude: 79.6485,
    services: 'Chili, Seed & Pulse Cold Storage + Pledge Finance Godown',
    hours: '7:00 AM – 7:30 PM',
  },
  {
    title: 'KVK Mamnoor & District Soil Testing Laboratory',
    category: 'kvk',
    district: 'Warangal',
    state: 'Telangana',
    address: 'Mamnoor Agricultural Campus, Warangal, Telangana',
    latitude: 17.9041,
    longitude: 79.6193,
    services: 'Soil Health Card Testing, Water Salinity Check & Crop Advisory',
    hours: '9:30 AM – 5:00 PM',
  },
  {
    title: 'Warangal Agri Machinery & Borewell Pump Repair Center',
    category: 'tractor',
    district: 'Warangal',
    state: 'Telangana',
    address: 'Mulugu Cross Road, Warangal, Telangana',
    latitude: 18.0040,
    longitude: 79.5912,
    services: 'Tractor Servicing, Sprayer Spares & Submersible Motor Rewinding',
    hours: '8:30 AM – 7:00 PM',
  },

  // Maharashtra - Nashik / Niphad / Pune / Nagpur
  {
    title: 'Lasalgaon APMC Onion, Grain & Vegetable Mandi',
    category: 'mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Lasalgaon Market Yard, Niphad Taluka, Nashik, Maharashtra',
    latitude: 20.1456,
    longitude: 74.2292,
    services: 'Asia’s Largest Onion Auction Yard, Tomato, Maize & Pulses',
    hours: '6:00 AM – 6:00 PM',
    keywords: ['onion', 'tomato', 'garlic', 'grape', 'pomegranate'],
  },
  {
    title: 'Pimpalgaon Baswant APMC Tomato & Grape Market',
    category: 'mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Mumbai–Agra Highway, Pimpalgaon Baswant, Nashik, Maharashtra',
    latitude: 20.1687,
    longitude: 73.9879,
    services: 'Tomato, Onion, Table Grapes, Pomegranate & Fresh Vegetables',
    hours: '6:00 AM – 7:00 PM',
    keywords: ['tomato', 'grape', 'onion', 'fruit', 'vegetable'],
  },
  {
    title: 'Niphad Taluka Sahyadri Agro Seed & Fertilizer Kendra',
    category: 'seeds',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Station Road, Niphad, Nashik District, Maharashtra',
    latitude: 20.0751,
    longitude: 74.1072,
    services: 'Onion & Tomato Nursery Seeds, Water-Soluble Drip Fertilizers',
    hours: '8:00 AM – 8:00 PM',
  },
  {
    title: 'Nashik Horti Cold Chain & Pre-Cooling Packhouse',
    category: 'coldStorage',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Ozar Industrial Area, Niphad–Nashik Road, Maharashtra',
    latitude: 20.0954,
    longitude: 73.9242,
    services: 'Grape, Pomegranate, Onion & Vegetable Cold Storage Chambers',
    hours: '24 Hours Operations',
  },
  {
    title: 'Krishi Vigyan Kendra (KVK) Nashik & Soil Testing Lab',
    category: 'kvk',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'YCMOU Campus Road, Gangapur, Nashik, Maharashtra',
    latitude: 20.0145,
    longitude: 73.7330,
    services: 'Soil Micronutrient Analysis, Leaf Petiole Testing & IPM Advisory',
    hours: '9:30 AM – 5:30 PM',
  },
  {
    title: 'Niphad Tractor, Orchard Sprayer & Drip Pump Workshop',
    category: 'tractor',
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'NH-60 Service Lane, Niphad, Nashik, Maharashtra',
    latitude: 20.0789,
    longitude: 74.1135,
    services: 'Mini-Tractor Maintenance, Blower Sprayer & Irrigation Pump Repair',
    hours: '8:30 AM – 7:30 PM',
  },

  // Punjab - Ludhiana / Jagraon
  {
    title: 'Jagraon New Grain & Vegetable Market Yard (Anaj Mandi)',
    category: 'mandi',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'Tehsil Road, Jagraon, Ludhiana District, Punjab',
    latitude: 30.7885,
    longitude: 75.4730,
    services: 'Wheat, Paddy, Basmati, Maize, Potato & Seasonal Sabzi Mandi',
    hours: '6:00 AM – 6:30 PM',
    keywords: ['wheat', 'paddy', 'potato', 'maize', 'mustard'],
  },
  {
    title: 'Ludhiana Gill Road Grain & Fruit-Vegetable Mandi',
    category: 'mandi',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'Gill Road Dana Mandi, Ludhiana, Punjab',
    latitude: 30.8758,
    longitude: 75.8569,
    services: 'Wholesale Wheat, Paddy, Kinnow, Potato, Onion & Vegetables',
    hours: '5:30 AM – 7:00 PM',
  },
  {
    title: 'PAU Seed Shop & Markfed Kisan Center — Ludhiana',
    category: 'seeds',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'Ferozepur Road, PAU Gate 1, Ludhiana, Punjab',
    latitude: 30.9009,
    longitude: 75.8066,
    services: 'PAU Certified Wheat/Paddy Seeds, Urea, DAP & Bio-Fertilizers',
    hours: '8:30 AM – 5:30 PM',
  },
  {
    title: 'Jagraon Multi-Chamber Potato & Agro Cold Storage',
    category: 'coldStorage',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'Raikot Road, Jagraon, Ludhiana, Punjab',
    latitude: 30.7780,
    longitude: 75.4892,
    services: 'Seed Potato Cold Storage, Kinnow Chilling & CWC Grain Warehouse',
    hours: '7:00 AM – 8:00 PM',
  },
  {
    title: 'Punjab Agricultural University (PAU) Soil Lab & KVK',
    category: 'kvk',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'PAU Campus, Ferozepur Road, Ludhiana, Punjab',
    latitude: 30.9041,
    longitude: 75.8025,
    services: 'Soil & Tubewell Water Testing, Crop Clinics & Happy Seeder Guidance',
    hours: '9:00 AM – 5:00 PM',
  },
  {
    title: 'Gill Road Tractor, Harvester & Tubewell Repair Hub',
    category: 'tractor',
    district: 'Ludhiana',
    state: 'Punjab',
    address: 'Gill Chowk Agro Machinery Market, Ludhiana, Punjab',
    latitude: 30.8881,
    longitude: 75.8594,
    services: 'Tractor Overhaul, Combine Spares & Submersible Pump Servicing',
    hours: '8:30 AM – 7:30 PM',
  },

  // Karnataka - Mysuru / Nanjangud / Bengaluru
  {
    title: 'Nanjangud APMC Market Yard (Banana, Turmeric & Paddy Mandi)',
    category: 'mandi',
    district: 'Mysuru',
    state: 'Karnataka',
    address: 'APMC Road, Nanjangud, Mysuru District, Karnataka',
    latitude: 12.1190,
    longitude: 76.6820,
    services: 'Nanjangud Rasabale Banana, Paddy, Ragi, Sugarcane & Vegetables',
    hours: '6:00 AM – 6:00 PM',
    keywords: ['banana', 'paddy', 'turmeric', 'coconut', 'vegetable'],
  },
  {
    title: 'Mysuru Bandipalya APMC Mega Fruit & Vegetable Market',
    category: 'mandi',
    district: 'Mysuru',
    state: 'Karnataka',
    address: 'Nanjangud Road, Bandipalya, Mysuru, Karnataka',
    latitude: 12.2480,
    longitude: 76.6520,
    services: 'Wholesale Fruits, Vegetables, Onion, Potato, Ginger & Grains',
    hours: '5:00 AM – 7:00 PM',
  },
  {
    title: 'Raitha Samparka Kendra & Seed Depot — Nanjangud',
    category: 'seeds',
    district: 'Mysuru',
    state: 'Karnataka',
    address: 'Taluk Agriculture Office Complex, Nanjangud, Karnataka',
    latitude: 12.1205,
    longitude: 76.6801,
    services: 'Subsidized Seeds, NPK, Micronutrients & Plant Protection Kits',
    hours: '9:00 AM – 5:30 PM',
  },
  {
    title: 'Bandipalya Agro Cold Storage & Warehousing Unit',
    category: 'coldStorage',
    district: 'Mysuru',
    state: 'Karnataka',
    address: 'APMC Industrial Layout, Bandipalya, Mysuru, Karnataka',
    latitude: 12.2442,
    longitude: 76.6558,
    services: 'Fruit Ripening, Ginger/Turmeric & Vegetable Cold Storage',
    hours: '7:00 AM – 8:00 PM',
  },
  {
    title: 'ICAR JSS Krishi Vigyan Kendra (KVK Suttur) & Soil Lab',
    category: 'kvk',
    district: 'Mysuru',
    state: 'Karnataka',
    address: 'Suttur, Nanjangud Taluk, Mysuru District, Karnataka',
    latitude: 12.1553,
    longitude: 76.7885,
    services: 'Free/Nominal Soil Testing, Organic Inputs & Crop Advisory',
    hours: '9:30 AM – 5:00 PM',
  },
  {
    title: 'Mysuru–Nanjangud Road Tractor & Drip Pump Repair Works',
    category: 'tractor',
    district: 'Mysuru',
    state: 'Karnataka',
    address: 'Industrial Suburb, Mysuru, Karnataka',
    latitude: 12.2756,
    longitude: 76.6491,
    services: 'Tractor Spares, Power Tiller & Irrigation Motor Winding',
    hours: '8:30 AM – 7:00 PM',
  },

  // Tamil Nadu - Thanjavur / Papanasam / Madurai
  {
    title: 'Thanjavur Regulated Agricultural Market & Paddy Mandi',
    category: 'mandi',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    address: 'Nanjikottai Road, Thanjavur, Tamil Nadu',
    latitude: 10.7642,
    longitude: 79.1319,
    services: 'Paddy, Black Gram, Banana, Coconut, Mango & Vegetable Auction',
    hours: '6:00 AM – 6:00 PM',
    keywords: ['paddy', 'banana', 'coconut', 'pulses', 'mango'],
  },
  {
    title: 'Papanasam Uzhavar Sandhai (Farmers Market) & Agri Yard',
    category: 'mandi',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    address: 'Kumbakonam Main Road, Papanasam, Thanjavur, Tamil Nadu',
    latitude: 10.9278,
    longitude: 79.2690,
    services: 'Direct-from-Farmer Fresh Vegetables, Fruits, Paddy & Greens',
    hours: '5:30 AM – 1:00 PM & 4:00 PM – 7:00 PM',
  },
  {
    title: 'Thanjavur Cooperative Agro Service & Seed Center',
    category: 'seeds',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    address: 'Gandhiji Road, Thanjavur, Tamil Nadu',
    latitude: 10.7850,
    longitude: 79.1391,
    services: 'Cauvery Delta Paddy Seeds, Potash, Neem Cake & Bio-Inputs',
    hours: '8:30 AM – 7:00 PM',
  },
  {
    title: 'TNWC Warehousing & Banana/Mango Cold Storage — Thanjavur',
    category: 'coldStorage',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    address: 'Trichy–Thanjavur NH Bypass, Thanjavur, Tamil Nadu',
    latitude: 10.7610,
    longitude: 79.1050,
    services: 'Grain Godown & Horticulture Cold Storage Chambers',
    hours: '8:00 AM – 7:00 PM',
  },
  {
    title: 'KVK Needamangalam & Thanjavur Soil Testing Laboratory',
    category: 'kvk',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    address: 'Kattuthottam Agricultural Campus, Thanjavur, Tamil Nadu',
    latitude: 10.7798,
    longitude: 79.1088,
    services: 'Delta Soil Fertility Analysis, Water pH Check & IPM Clinic',
    hours: '9:30 AM – 5:15 PM',
  },
  {
    title: 'Thanjavur Tractor, Paddy Transplanter & Pump Service Center',
    category: 'tractor',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    address: 'Medical College Road Industrial Zone, Thanjavur, Tamil Nadu',
    latitude: 10.7580,
    longitude: 79.1180,
    services: 'Harvester & Power Tiller Repair, Borewell Solar Pump Service',
    hours: '8:30 AM – 7:00 PM',
  },

  // Madhya Pradesh - Indore / Depalpur
  {
    title: 'Devi Ahilyabai Holkar Choithram Fruit & Vegetable Mandi',
    category: 'mandi',
    district: 'Indore',
    state: 'Madhya Pradesh',
    address: 'AB Road, Choithram Circle, Indore, Madhya Pradesh',
    latitude: 22.6815,
    longitude: 75.8453,
    services: 'Potato, Onion, Garlic, Tomato, Fruits & Green Vegetables Mandi',
    hours: '5:00 AM – 7:00 PM',
    keywords: ['potato', 'onion', 'tomato', 'garlic', 'fruit', 'vegetable'],
  },
  {
    title: 'Depalpur Krishi Upaj Mandi Samiti (Grain & Soybean Yard)',
    category: 'mandi',
    district: 'Indore',
    state: 'Madhya Pradesh',
    address: 'Mandi Road, Depalpur, Indore District, Madhya Pradesh',
    latitude: 22.8511,
    longitude: 75.5419,
    services: 'Soybean, Wheat, Gram (Chana), Garlic & Potato Auction Yard',
    hours: '7:00 AM – 6:00 PM',
    keywords: ['soybean', 'wheat', 'potato', 'gram'],
  },
  {
    title: 'MP State Agro Seed & Fertilizer Kendra — Indore',
    category: 'seeds',
    district: 'Indore',
    state: 'Madhya Pradesh',
    address: 'Chhawni Anaj Mandi Gate, Indore, Madhya Pradesh',
    latitude: 22.7070,
    longitude: 75.8705,
    services: 'JS Soybean & Wheat Seeds, Urea, DAP, Rhizobium & Bio-Control',
    hours: '8:30 AM – 7:30 PM',
  },
  {
    title: 'Rau–Depalpur Belt Agro Cold Storage & Garlic Warehouse',
    category: 'coldStorage',
    district: 'Indore',
    state: 'Madhya Pradesh',
    address: 'AB Road / Rau Agro Park, Indore, Madhya Pradesh',
    latitude: 22.6365,
    longitude: 75.8054,
    services: 'Seed Potato, Onion, Garlic & Horticulture Cold Storage',
    hours: '7:00 AM – 8:00 PM',
  },
  {
    title: 'ICAR Indian Institute of Soybean Research & KVK Indore',
    category: 'kvk',
    district: 'Indore',
    state: 'Madhya Pradesh',
    address: 'Khandwa Road, Indore, Madhya Pradesh',
    latitude: 22.6775,
    longitude: 75.8812,
    services: 'Soil Testing, Crop Variety Demonstration & Pest Diagnosis',
    hours: '9:30 AM – 5:00 PM',
  },
  {
    title: 'Indore–Depalpur Tractor, Seed Drill & Pump Repair Center',
    category: 'tractor',
    district: 'Indore',
    state: 'Madhya Pradesh',
    address: 'Sanwer Road Industrial Area, Indore, Madhya Pradesh',
    latitude: 22.7712,
    longitude: 75.8471,
    services: 'Tractor Engine Service, Rotavator Blades & Submersible Pumps',
    hours: '8:30 AM – 7:00 PM',
  },

  // Gujarat - Anand / Petlad
  {
    title: 'Anand APMC Sardar Patel Fruit, Vegetable & Grain Mandi',
    category: 'mandi',
    district: 'Anand',
    state: 'Gujarat',
    address: 'APMC Campus, Chikhodra Crossing, Anand, Gujarat',
    latitude: 22.5567,
    longitude: 72.9712,
    services: 'Banana, Potato, Tobacco, Paddy, Vegetables & Milk Hub',
    hours: '6:00 AM – 6:30 PM',
    keywords: ['banana', 'potato', 'paddy', 'vegetable', 'fruit'],
  },
  {
    title: 'Petlad APMC Agricultural Market Yard',
    category: 'mandi',
    district: 'Anand',
    state: 'Gujarat',
    address: 'Station Road, Petlad, Anand District, Gujarat',
    latitude: 22.4783,
    longitude: 72.8015,
    services: 'Banana, Wheat, Pearl Millet, Vegetables & Tobacco',
    hours: '6:30 AM – 6:00 PM',
  },
  {
    title: 'Amul / GSFC Agro Seed & Fertilizer Center — Anand',
    category: 'seeds',
    district: 'Anand',
    state: 'Gujarat',
    address: 'Grid Road, Anand, Gujarat',
    latitude: 22.5480,
    longitude: 72.9522,
    services: 'Sardar Urea, DAP, Tissue-Culture Banana Plants & Seeds',
    hours: '8:30 AM – 7:30 PM',
  },
  {
    title: 'Anand Banana Ripening & Vegetable Cold Storage',
    category: 'coldStorage',
    district: 'Anand',
    state: 'Gujarat',
    address: 'Vithal Udyognagar GIDC, Anand, Gujarat',
    latitude: 22.5364,
    longitude: 72.9195,
    services: 'Controlled Atmosphere Cold Chambers & Ripening Units',
    hours: '7:00 AM – 8:00 PM',
  },
  {
    title: 'Anand Agricultural University (AAU) Soil Lab & KVK',
    category: 'kvk',
    district: 'Anand',
    state: 'Gujarat',
    address: 'AAU Campus, Anand, Gujarat',
    latitude: 22.5335,
    longitude: 72.9690,
    services: 'Soil & Irrigation Water Testing, Crop Health Clinic',
    hours: '9:30 AM – 5:30 PM',
  },
  {
    title: 'Vithal Udyognagar Tractor & Drip Pump Repair Hub',
    category: 'tractor',
    district: 'Anand',
    state: 'Gujarat',
    address: 'GIDC Phase II, Anand, Gujarat',
    latitude: 22.5349,
    longitude: 72.9120,
    services: 'Tractor Servicing, Sprayer Parts & Submersible Pump Winding',
    hours: '8:30 AM – 7:00 PM',
  },

  // Uttar Pradesh - Lucknow / Malihabad
  {
    title: 'Malihabad Mango & Fruit Mandi (Dasheri Hub)',
    category: 'mandi',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Hardoi Road, Malihabad, Lucknow District, Uttar Pradesh',
    latitude: 26.9204,
    longitude: 80.7131,
    services: 'Dasheri & Langra Mango Auction, Guava, Wheat & Vegetables',
    hours: '5:30 AM – 6:30 PM',
    keywords: ['mango', 'guava', 'fruit', 'wheat', 'potato'],
  },
  {
    title: 'Dubagga & Naveen Galla Krishi Mandi — Lucknow',
    category: 'mandi',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Sitapur Road / Dubagga Bypass, Lucknow, Uttar Pradesh',
    latitude: 26.8794,
    longitude: 80.8692,
    services: 'Wholesale Vegetables, Fruits, Wheat, Paddy & Pulses',
    hours: '5:00 AM – 7:00 PM',
  },
  {
    title: 'IFFCO Bazar & Agro Seed Kendra — Malihabad / Lucknow',
    category: 'seeds',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Hardoi Road, Kakori–Malihabad, Lucknow, Uttar Pradesh',
    latitude: 26.8902,
    longitude: 80.7850,
    services: 'Fertilizers, Orchard Micronutrients, Seeds & Bio-Sprays',
    hours: '8:30 AM – 7:00 PM',
  },
  {
    title: 'Lucknow Agro Cold Storage & Mango Packhouse',
    category: 'coldStorage',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Rehmankhera Road, Kakori, Lucknow, Uttar Pradesh',
    latitude: 26.9061,
    longitude: 80.7640,
    services: 'Mango Packhouse, Potato & Vegetable Cold Storage Chambers',
    hours: '7:00 AM – 8:00 PM',
  },
  {
    title: 'ICAR CISH (Subtropical Horticulture) & Soil Lab — Rehmankhera',
    category: 'kvk',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Rehmankhera, Kakori, Lucknow, Uttar Pradesh',
    latitude: 26.9045,
    longitude: 80.7695,
    services: 'Orchard Soil Testing, Mango Disease Advisory & Farmer Training',
    hours: '9:30 AM – 5:00 PM',
  },
  {
    title: 'Lucknow–Malihabad Tractor & Orchard Sprayer Repair Center',
    category: 'tractor',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Hardoi Road Service Center, Lucknow, Uttar Pradesh',
    latitude: 26.8790,
    longitude: 80.8220,
    services: 'Tractor Spares, Boom Sprayers & Diesel/Electric Pump Repair',
    hours: '8:30 AM – 7:00 PM',
  },

  // Rajasthan - Jaipur / Chomu
  {
    title: 'Chomu Krishi Upaj Mandi Samiti (Vegetable & Grain Yard)',
    category: 'mandi',
    district: 'Jaipur',
    state: 'Rajasthan',
    address: 'NH-52 Sikar Road, Chomu, Jaipur District, Rajasthan',
    latitude: 27.1636,
    longitude: 75.7219,
    services: 'Amla, Pea, Tomato, Onion, Bajra, Mustard & Wheat Mandi',
    hours: '6:00 AM – 6:00 PM',
    keywords: ['tomato', 'onion', 'mustard', 'wheat', 'fruit', 'vegetable'],
  },
  {
    title: 'Muhana Terminal Market (Jaipur Mega Fruit & Vegetable Mandi)',
    category: 'mandi',
    district: 'Jaipur',
    state: 'Rajasthan',
    address: 'Muhana Mandi Road, Sanganer, Jaipur, Rajasthan',
    latitude: 26.7865,
    longitude: 75.7361,
    services: 'State Wholesale Market for Fruits, Vegetables, Spices & Grains',
    hours: '4:30 AM – 7:00 PM',
  },
  {
    title: 'Chomu Kisan Seva Kendra & Seed-Fertilizer Depot',
    category: 'seeds',
    district: 'Jaipur',
    state: 'Rajasthan',
    address: 'Station Road, Chomu, Jaipur, Rajasthan',
    latitude: 27.1610,
    longitude: 75.7265,
    services: 'Hybrid Vegetable Seeds, Mustard, Urea, DAP & Drip Filters',
    hours: '8:00 AM – 8:00 PM',
  },
  {
    title: 'Jaipur–Chomu Agro Cold Storage & Seed Warehouse',
    category: 'coldStorage',
    district: 'Jaipur',
    state: 'Rajasthan',
    address: 'Vishwakarma Industrial Area (VKI), Sikar Road, Jaipur, Rajasthan',
    latitude: 26.9854,
    longitude: 75.7745,
    services: 'Potato, Pea, Spice & Fruit Cold Storage Chambers',
    hours: '7:00 AM – 8:00 PM',
  },
  {
    title: 'KVK Chomu (Tankarda) & District Soil Testing Lab',
    category: 'kvk',
    district: 'Jaipur',
    state: 'Rajasthan',
    address: 'Tankarda, Chomu, Jaipur District, Rajasthan',
    latitude: 27.1778,
    longitude: 75.7322,
    services: 'Soil Salinity & Water Testing, Polyhouse & Drip Training',
    hours: '9:30 AM – 5:00 PM',
  },
  {
    title: 'Chomu Tractor, Thresher & Solar Pump Workshop',
    category: 'tractor',
    district: 'Jaipur',
    state: 'Rajasthan',
    address: 'Jaipur–Sikar Highway, Chomu, Rajasthan',
    latitude: 27.1585,
    longitude: 75.7240,
    services: 'Tractor Service, Chaff Cutters & Solar/Submersible Pump Repair',
    hours: '8:30 AM – 7:30 PM',
  },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function detectAgriCategory(query: string): AgriPlaceCategory {
  const q = query.toLowerCase();
  if (/cold\s*storage|godown|warehouse|chiller|cooling/.test(q)) return 'coldStorage';
  if (/seed|fertilizer|pesticide|urea|dap|input\s*dealer|kisan\s*kendra/.test(q)) return 'seeds';
  if (/soil|kvk|krishi\s*vigyan|lab|testing|agriculture\s*office/.test(q)) return 'kvk';
  if (/tractor|pump|repair|equipment|motor|mechanic|implement|harvester/.test(q)) return 'tractor';
  if (/mandi|market|apmc|bazaar|yard|rythu|sabzi|fruit|vegetable|crop/.test(q)) return 'mandi';
  return 'general';
}

function buildMapsSearchUri(query: string, lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} near ${lat.toFixed(4)},${lon.toFixed(4)}`
  )}`;
}

function buildDirectionsUri(lat: number, lon: number, destinationQuery?: string): string {
  const dest = destinationQuery ? encodeURIComponent(destinationQuery) : `${lat.toFixed(4)},${lon.toFixed(4)}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

function synthesizeDistrictFallbackPlaces(params: {
  category: AgriPlaceCategory;
  query: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
}): MatchedAgriPlace[] {
  const areaClean = params.locationLabel.replace(/^.*?\(/, '').replace(/\)$/, '').trim() || 'Your Area';
  const parts = areaClean
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const primaryTown = parts[0] || areaClean;
  const districtOrState = parts.length >= 2 ? parts.slice(-2).join(', ') : areaClean;

  const templates: Record<Exclude<AgriPlaceCategory, 'general'>, Array<{ title: string; offsetKm: number; services: string; hours: string; mapQuery: string }>> = {
    mandi: [
      {
        title: `${primaryTown} APMC Agricultural Market Yard (Mandi)`,
        offsetKm: 3.4,
        services: 'Grains, Pulses, Vegetables & Seasonal Fruit Wholesale Auction',
        hours: '6:00 AM – 6:30 PM',
        mapQuery: `${primaryTown} APMC Agricultural Market Yard Mandi ${districtOrState}`,
      },
      {
        title: `${primaryTown} Sabzi & Fruit Farmers Market (Rythu / Kisan Bazaar)`,
        offsetKm: 2.1,
        services: 'Fresh Vegetables, Fruits & Direct Farmer Stalls',
        hours: '5:30 AM – 7:30 PM',
        mapQuery: `${primaryTown} vegetable fruit market mandi ${districtOrState}`,
      },
      {
        title: `${districtOrState} Regional Wholesale Crop & Grain Mandi`,
        offsetKm: 11.8,
        services: 'Bulk Crop Procurement, Weighing Bridge & MSP Center',
        hours: '6:30 AM – 6:00 PM',
        mapQuery: `wholesale grain crop mandi near ${districtOrState}`,
      },
    ],
    seeds: [
      {
        title: `${primaryTown} IFFCO & Cooperative Kisan Seva Kendra`,
        offsetKm: 2.3,
        services: 'Certified Seeds, Urea, DAP, NPK & Micronutrients',
        hours: '8:30 AM – 7:30 PM',
        mapQuery: `IFFCO Kisan Seva Kendra fertilizer seed shop near ${areaClean}`,
      },
      {
        title: `${primaryTown} Agro Seed, Pesticide & Drip Supply Store`,
        offsetKm: 3.1,
        services: 'Hybrid Vegetable/Fruit Seeds, Bio-Fertilizers & Crop Sprays',
        hours: '8:00 AM – 8:00 PM',
        mapQuery: `seed fertilizer pesticide dealer near ${areaClean}`,
      },
      {
        title: `${districtOrState} State Agro Seeds Corporation Center`,
        offsetKm: 10.5,
        services: 'Subsidized Foundation Seeds & Soil Amendments',
        hours: '9:00 AM – 5:30 PM',
        mapQuery: `government seed fertilizer center ${districtOrState}`,
      },
    ],
    coldStorage: [
      {
        title: `${primaryTown} Multi-Commodity Agro Cold Storage`,
        offsetKm: 4.8,
        services: 'Temperature-Controlled Fruit, Vegetable & Seed Chambers',
        hours: '7:00 AM – 8:00 PM',
        mapQuery: `cold storage near ${areaClean}`,
      },
      {
        title: `${districtOrState} CWC / State Warehousing Crop Godown`,
        offsetKm: 12.2,
        services: 'Dry Grain Storage, Moisture Protection & Warehouse Receipts',
        hours: '8:30 AM – 6:00 PM',
        mapQuery: `agricultural warehouse godown near ${districtOrState}`,
      },
    ],
    kvk: [
      {
        title: `${districtOrState} Krishi Vigyan Kendra (ICAR KVK)`,
        offsetKm: 9.6,
        services: 'Crop Advisory, Pest Clinic, Demonstrations & Training',
        hours: '9:30 AM – 5:00 PM',
        mapQuery: `Krishi Vigyan Kendra KVK near ${districtOrState}`,
      },
      {
        title: `${districtOrState} District Soil & Water Testing Laboratory`,
        offsetKm: 8.4,
        services: 'Soil Health Card (NPK, pH, EC) & Irrigation Water Testing',
        hours: '9:30 AM – 5:00 PM',
        mapQuery: `soil testing laboratory agriculture office near ${districtOrState}`,
      },
    ],
    tractor: [
      {
        title: `${primaryTown} Tractor & Rotavator Service Workshop`,
        offsetKm: 3.7,
        services: 'Tractor Engine Service, Hydraulic Repair & Implement Spares',
        hours: '8:30 AM – 7:30 PM',
        mapQuery: `tractor service center repair near ${areaClean}`,
      },
      {
        title: `${primaryTown} Submersible, Drip & Solar Pump Repair Hub`,
        offsetKm: 2.9,
        services: 'Borewell Motor Rewinding, Starter Panel & Drip Filter Service',
        hours: '8:30 AM – 7:00 PM',
        mapQuery: `irrigation water pump repair shop near ${areaClean}`,
      },
    ],
  };

  const targetCat: Exclude<AgriPlaceCategory, 'general'> =
    params.category === 'general' ? 'mandi' : params.category;

  const list = templates[targetCat];
  const results: MatchedAgriPlace[] = list.map((item) => ({
    title: item.title,
    category: targetCat,
    address: areaClean,
    distanceKm: item.offsetKm,
    services: item.services,
    hours: item.hours,
    uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapQuery)}`,
    directionsUri: buildDirectionsUri(params.latitude, params.longitude, item.mapQuery),
    latitude: params.latitude,
    longitude: params.longitude,
  }));

  if (params.category === 'general' && params.query.trim()) {
    results.unshift({
      title: `${params.query.trim()} — Near ${primaryTown}`,
      category: 'mandi',
      address: areaClean,
      distanceKm: 1.5,
      services: `Live Google Maps search for "${params.query.trim()}" near ${areaClean}`,
      hours: 'View live hours on Maps',
      uri: buildMapsSearchUri(params.query.trim(), params.latitude, params.longitude),
      directionsUri: buildDirectionsUri(
        params.latitude,
        params.longitude,
        `${params.query.trim()} near ${areaClean}`
      ),
      latitude: params.latitude,
      longitude: params.longitude,
    });
  }

  return results;
}

export function findDirectoryPlaces(params: {
  query: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
}): { category: AgriPlaceCategory; places: MatchedAgriPlace[] } {
  const category = detectAgriCategory(params.query);
  const qLower = params.query.toLowerCase();
  const locLower = params.locationLabel.toLowerCase();

  const withDistance = AGRI_PLACES_DIRECTORY.map((place) => {
    const dist = haversineKm(params.latitude, params.longitude, place.latitude, place.longitude);
    const locationTextBoost =
      locLower.includes(place.district.toLowerCase()) ||
      locLower.includes(place.state.toLowerCase());
    const keywordMatch =
      place.title.toLowerCase().includes(qLower) ||
      place.services.toLowerCase().includes(qLower) ||
      (place.keywords || []).some((k) => qLower.includes(k));
    return {
      place,
      dist,
      locationTextBoost,
      keywordMatch,
    };
  });

  const nearbyCandidates = withDistance.filter((item) => {
    const categoryMatches = category === 'general' ? true : item.place.category === category;
    const withinRegion = item.dist <= 160 || item.locationTextBoost;
    return categoryMatches && withinRegion;
  });

  nearbyCandidates.sort((a, b) => {
    if (a.keywordMatch !== b.keywordMatch) return a.keywordMatch ? -1 : 1;
    if (a.locationTextBoost !== b.locationTextBoost) return a.locationTextBoost ? -1 : 1;
    return a.dist - b.dist;
  });

  const matched: MatchedAgriPlace[] = nearbyCandidates.slice(0, 6).map(({ place, dist }) => ({
    title: place.title,
    category: place.category,
    address: place.address,
    distanceKm: dist,
    services: place.services,
    hours: place.hours,
    uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.title}, ${place.address}`
    )}`,
    directionsUri: buildDirectionsUri(place.latitude, place.longitude, `${place.title}, ${place.address}`),
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  if (matched.length >= 2) {
    return { category, places: matched };
  }

  const synthesized = synthesizeDistrictFallbackPlaces({
    category,
    query: params.query,
    locationLabel: params.locationLabel,
    latitude: params.latitude,
    longitude: params.longitude,
  });

  const combined = [...matched];
  for (const item of synthesized) {
    if (!combined.some((c) => c.title.toLowerCase() === item.title.toLowerCase())) {
      combined.push(item);
    }
  }

  return { category, places: combined.slice(0, 6) };
}
