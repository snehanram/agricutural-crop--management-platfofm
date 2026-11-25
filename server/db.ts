import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'crop_platform.db');
export const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS farmers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT DEFAULT '',
      password_hash TEXT NOT NULL,
      preferred_language TEXT NOT NULL DEFAULT 'en',
      location TEXT DEFAULT '',
      auth_provider TEXT NOT NULL DEFAULT 'email',
      provider_id TEXT DEFAULT '',
      phone_normalized TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS farms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      total_area_acres REAL NOT NULL DEFAULT 0,
      soil_type TEXT DEFAULT 'Loamy',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      farm_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      location TEXT DEFAULT '',
      area_acres REAL NOT NULL DEFAULT 0,
      soil_type TEXT DEFAULT 'Loamy',
      irrigation_method TEXT DEFAULT 'Drip',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      variety TEXT DEFAULT '',
      planting_date TEXT NOT NULL,
      cultivation_stage TEXT NOT NULL DEFAULT 'land_preparation' CHECK (
        cultivation_stage IN (
          'land_preparation',
          'sowing',
          'germination',
          'vegetative_growth',
          'flowering',
          'maturity',
          'harvesting'
        )
      ),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'harvested')),
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS irrigations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      crop_id INTEGER,
      irrigation_date TEXT NOT NULL,
      water_quantity_liters REAL NOT NULL DEFAULT 0,
      frequency_days INTEGER NOT NULL DEFAULT 7,
      next_scheduled_date TEXT NOT NULL,
      method TEXT DEFAULT 'Drip',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
      FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS fertilizers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      crop_id INTEGER,
      fertilizer_name TEXT NOT NULL,
      quantity_kg REAL NOT NULL DEFAULT 0,
      application_date TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
      FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS pest_observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      crop_id INTEGER,
      observation_date TEXT NOT NULL,
      pest_or_disease TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
      observation_notes TEXT DEFAULT '',
      treatment_details TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'treated', 'resolved')),
      image_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
      FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS harvests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      crop_id INTEGER,
      status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
      harvest_date TEXT NOT NULL,
      quantity_kg REAL NOT NULL DEFAULT 0,
      quality_grade TEXT DEFAULT 'Grade A',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
      FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS weather_alert_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL UNIQUE,
      max_temp_c REAL NOT NULL DEFAULT 36,
      min_temp_c REAL NOT NULL DEFAULT 7,
      heavy_rain_mm REAL NOT NULL DEFAULT 15,
      high_wind_kmh REAL NOT NULL DEFAULT 25,
      high_humidity_pct INTEGER NOT NULL DEFAULT 82,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS acknowledged_weather_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      alert_key TEXT NOT NULL,
      acknowledged_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(farmer_id, alert_key),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
    );
  `);

  const farmerColumns = db.prepare(`PRAGMA table_info(farmers)`).all() as Array<{ name: string }>;
  const existingCols = new Set(farmerColumns.map((c) => c.name));
  if (!existingCols.has('auth_provider')) {
    db.exec(`ALTER TABLE farmers ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'email'`);
  }
  if (!existingCols.has('provider_id')) {
    db.exec(`ALTER TABLE farmers ADD COLUMN provider_id TEXT DEFAULT ''`);
  }
  if (!existingCols.has('phone_normalized')) {
    db.exec(`ALTER TABLE farmers ADD COLUMN phone_normalized TEXT DEFAULT ''`);
  }

  // Migrate legacy 3-language CHECK constraint on farmers table so any alphabetical language code can be saved
  const tableDef = db
    .prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'farmers'`)
    .get() as { sql?: string } | undefined;
  if (tableDef?.sql && tableDef.sql.includes("CHECK (preferred_language IN ('en', 'te', 'hi'))")) {
    db.pragma('foreign_keys = OFF');
    const migrateTx = db.transaction(() => {
      db.exec(`
        CREATE TABLE farmers_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT DEFAULT '',
          password_hash TEXT NOT NULL,
          preferred_language TEXT NOT NULL DEFAULT 'en',
          location TEXT DEFAULT '',
          auth_provider TEXT NOT NULL DEFAULT 'email',
          provider_id TEXT DEFAULT '',
          phone_normalized TEXT DEFAULT '',
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        INSERT INTO farmers_new (id, full_name, email, phone, password_hash, preferred_language, location, auth_provider, provider_id, phone_normalized, created_at)
        SELECT id, full_name, email, phone, password_hash, preferred_language, location,
               COALESCE(auth_provider, 'email'), COALESCE(provider_id, ''), COALESCE(phone_normalized, ''), created_at
        FROM farmers;
        DROP TABLE farmers;
        ALTER TABLE farmers_new RENAME TO farmers;
      `);
    });
    migrateTx();
    db.pragma('foreign_keys = ON');
  }

  // Backfill phone_normalized for existing rows
  const rowsToBackfill = db
    .prepare(`SELECT id, phone, phone_normalized FROM farmers WHERE phone != '' AND (phone_normalized IS NULL OR phone_normalized = '')`)
    .all() as Array<{ id: number; phone: string }>;
  for (const r of rowsToBackfill) {
    const digits = r.phone.replace(/\D/g, '');
    if (digits) {
      db.prepare(`UPDATE farmers SET phone_normalized = ? WHERE id = ?`).run(digits, r.id);
    }
  }

  ensureDemoFarmerSeeded();
}

export interface DemoLocationOption {
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  soilType: string;
  irrigationMethod: string;
}

export const DEMO_RANDOM_LOCATIONS: DemoLocationOption[] = [
  { state: 'Andhra Pradesh', district: 'Guntur', village: 'Tenali', latitude: 16.2428, longitude: 80.64, soilType: 'Alluvial', irrigationMethod: 'Canal Flood' },
  { state: 'Telangana', district: 'Warangal', village: 'Narsampet', latitude: 17.9285, longitude: 79.8942, soilType: 'Black Cotton', irrigationMethod: 'Drip' },
  { state: 'Maharashtra', district: 'Nashik', village: 'Niphad', latitude: 20.0751, longitude: 74.1072, soilType: 'Black Cotton', irrigationMethod: 'Drip' },
  { state: 'Punjab', district: 'Ludhiana', village: 'Jagraon', latitude: 30.7885, longitude: 75.473, soilType: 'Alluvial', irrigationMethod: 'Canal Flood' },
  { state: 'Karnataka', district: 'Mysuru', village: 'Nanjangud', latitude: 12.119, longitude: 76.682, soilType: 'Red Sandy Loam', irrigationMethod: 'Drip' },
  { state: 'Tamil Nadu', district: 'Thanjavur', village: 'Papanasam', latitude: 10.9278, longitude: 79.269, soilType: 'Clay Loam', irrigationMethod: 'Canal Flood' },
  { state: 'Madhya Pradesh', district: 'Indore', village: 'Depalpur', latitude: 22.8511, longitude: 75.5419, soilType: 'Black Cotton', irrigationMethod: 'Sprinkler' },
  { state: 'Gujarat', district: 'Anand', village: 'Petlad', latitude: 22.4783, longitude: 72.8015, soilType: 'Loamy', irrigationMethod: 'Drip' },
  { state: 'Uttar Pradesh', district: 'Lucknow', village: 'Malihabad', latitude: 26.9204, longitude: 80.7131, soilType: 'Alluvial', irrigationMethod: 'Drip' },
  { state: 'Rajasthan', district: 'Jaipur', village: 'Chomu', latitude: 27.1636, longitude: 75.7219, soilType: 'Red Sandy Loam', irrigationMethod: 'Sprinkler' },
];

interface DemoCropTemplate {
  name: string;
  variety: string;
  group: 'staple' | 'vegetable' | 'fruit_spice';
  notes: string;
  waterLiters: number;
  fertilizerName: string;
  fertilizerKg: number;
  pestIssue: string;
  pestTreatment: string;
  harvestKg: number;
}

const DEMO_CROP_POOL: DemoCropTemplate[] = [
  {
    name: 'Paddy (Rice)',
    variety: 'BPT-5204 Samba Masuri',
    group: 'staple',
    notes: 'Sample grain crop — open My Crops to tap growth stages forward',
    waterLiters: 7500,
    fertilizerName: 'Urea + DAP Basal',
    fertilizerKg: 45,
    pestIssue: 'Leaf Folder Caterpillar',
    pestTreatment: 'Spray Neem oil 3 ml/L and maintain thin standing water',
    harvestKg: 2150,
  },
  {
    name: 'Wheat',
    variety: 'HD-2967 / Lokwan',
    group: 'staple',
    notes: 'Sample winter cereal crop — check Crop & Acre Guide for seed rates',
    waterLiters: 5200,
    fertilizerName: 'NPK 12:32:16 + Urea',
    fertilizerKg: 40,
    pestIssue: 'Aphids on Flag Leaf',
    pestTreatment: 'Apply yellow sticky traps or neem-based foliar spray',
    harvestKg: 1850,
  },
  {
    name: 'Maize (Corn)',
    variety: 'DHM-117 Hybrid',
    group: 'staple',
    notes: 'Sample cereal plot — ideal for practicing stage updates',
    waterLiters: 4800,
    fertilizerName: 'DAP + Potash',
    fertilizerKg: 35,
    pestIssue: 'Fall Armyworm (Early)',
    pestTreatment: 'Spot-apply sand/neem cake mix into leaf whorls',
    harvestKg: 1950,
  },
  {
    name: 'Groundnut (Peanut)',
    variety: 'Kadiri-6 / TAG-24',
    group: 'staple',
    notes: 'Sample oilseed crop — inspect gypsum & pod moisture tips',
    waterLiters: 3800,
    fertilizerName: 'Gypsum + SSP',
    fertilizerKg: 50,
    pestIssue: 'Tikka Leaf Spot',
    pestTreatment: 'Remove affected lower leaves and improve field drainage',
    harvestKg: 1240,
  },
  {
    name: 'Cotton',
    variety: 'Bt Bunny / RCH-2',
    group: 'staple',
    notes: 'Sample cash crop — monitor boll formation and sap pests',
    waterLiters: 4400,
    fertilizerName: 'NPK 19:19:19 + Urea',
    fertilizerKg: 38,
    pestIssue: 'Whitefly / Jassids',
    pestTreatment: 'Install yellow sticky traps and spray neem kernel extract',
    harvestKg: 1320,
  },
  {
    name: 'Sunflower',
    variety: 'KBSH-44 Hybrid',
    group: 'staple',
    notes: 'Sample oilseed crop — tracks watering at flowering stage',
    waterLiters: 3400,
    fertilizerName: 'NPK + Boron Micronutrient',
    fertilizerKg: 28,
    pestIssue: 'Head Borer Larvae',
    pestTreatment: 'Hand-pick early larvae and place bird perches in plot',
    harvestKg: 1120,
  },
  {
    name: 'Tomato',
    variety: 'Arka Rakshak F1',
    group: 'vegetable',
    notes: 'Sample vegetable crop — check Pests & Photos to report leaf spots',
    waterLiters: 2600,
    fertilizerName: 'NPK 19:19:19 Water Soluble',
    fertilizerKg: 18,
    pestIssue: 'Early Blight Leaf Spots',
    pestTreatment: 'Prune lower infected leaves and avoid overhead evening watering',
    harvestKg: 2650,
  },
  {
    name: 'Onion',
    variety: 'Bhima Super / N-53',
    group: 'vegetable',
    notes: 'Sample bulb vegetable — view drip watering schedule below',
    waterLiters: 2200,
    fertilizerName: 'MOP Potash + Sulphur',
    fertilizerKg: 20,
    pestIssue: 'Thrips on Leaf Tips',
    pestTreatment: 'Use blue sticky traps and light sprinkler wash',
    harvestKg: 2400,
  },
  {
    name: 'Potato',
    variety: 'Kufri Jyoti',
    group: 'vegetable',
    notes: 'Sample tuber crop — check Weather page for cool-night alerts',
    waterLiters: 2800,
    fertilizerName: 'DAP + MOP Ridge Dressing',
    fertilizerKg: 25,
    pestIssue: 'Late Blight Watch',
    pestTreatment: 'Keep ridges well-drained and inspect undersides after fog',
    harvestKg: 2850,
  },
  {
    name: "Okra (Lady's Finger)",
    variety: 'Arka Anamika',
    group: 'vegetable',
    notes: 'Fast-growing vegetable — great for logging daily harvests',
    waterLiters: 2100,
    fertilizerName: 'Vermicompost + Urea Split',
    fertilizerKg: 22,
    pestIssue: 'Shoot & Fruit Borer',
    pestTreatment: 'Remove wilted shoot tips and install pheromone traps',
    harvestKg: 1580,
  },
  {
    name: 'Brinjal (Eggplant)',
    variety: 'Pusa Purple Long',
    group: 'vegetable',
    notes: 'Sample vegetable plot — test adding fertilizer or pest photos',
    waterLiters: 2300,
    fertilizerName: 'Compost + NPK 20:20:0',
    fertilizerKg: 20,
    pestIssue: 'Fruit Borer / Aphids',
    pestTreatment: 'Clip damaged shoots and spray neem oil early morning',
    harvestKg: 2100,
  },
  {
    name: 'Cucumber',
    variety: 'Malini Hybrid',
    group: 'vegetable',
    notes: 'Short-cycle vine crop — needs light frequent drip watering',
    waterLiters: 1950,
    fertilizerName: 'NPK 13:0:45 + Micronutrients',
    fertilizerKg: 15,
    pestIssue: 'Powdery Mildew Patches',
    pestTreatment: 'Increase spacing airflow and remove heavily coated leaves',
    harvestKg: 1750,
  },
  {
    name: 'Mango',
    variety: 'Banganapalli / Alphonso',
    group: 'fruit_spice',
    notes: 'Sample orchard crop — check fruit-setting and mandi markets',
    waterLiters: 3600,
    fertilizerName: 'FYM Compost + Potash',
    fertilizerKg: 35,
    pestIssue: 'Mango Hopper on Panicles',
    pestTreatment: 'Keep orchard floor clean and spray neem-based protectant',
    harvestKg: 1900,
  },
  {
    name: 'Banana',
    variety: 'Grand Naine (G-9)',
    group: 'fruit_spice',
    notes: 'Sample fruit crop — requires steady drip moisture and potash',
    waterLiters: 4200,
    fertilizerName: 'Urea + MOP Drip Fertigation',
    fertilizerKg: 32,
    pestIssue: 'Sigatoka Leaf Streak',
    pestTreatment: 'Trim spotted old leaves and clear standing drainage channels',
    harvestKg: 3400,
  },
  {
    name: 'Watermelon',
    variety: 'Sugar Baby / Kiran',
    group: 'fruit_spice',
    notes: 'Sample fruit vine — watch 7-day rain forecast before harvest',
    waterLiters: 2700,
    fertilizerName: 'Calcium Nitrate + Potash',
    fertilizerKg: 18,
    pestIssue: 'Fruit Fly Stings',
    pestTreatment: 'Hang cue-lure fruit fly traps around plot perimeter',
    harvestKg: 2950,
  },
  {
    name: 'Papaya',
    variety: 'Red Lady 786',
    group: 'fruit_spice',
    notes: 'Sample fruit plot — check drainage alerts during heavy rain',
    waterLiters: 2500,
    fertilizerName: 'Organic Compost + Boron',
    fertilizerKg: 24,
    pestIssue: 'Mealybugs on Stem',
    pestTreatment: 'Wash clusters with mild soap-neem spray and control ants',
    harvestKg: 2600,
  },
  {
    name: 'Chili Pepper',
    variety: 'Teja S-17',
    group: 'fruit_spice',
    notes: 'Sample spice crop — inspect leaf curl and mandi market prices',
    waterLiters: 2400,
    fertilizerName: 'NPK 19:19:19 + Magnesium',
    fertilizerKg: 20,
    pestIssue: 'Leaf Curl Mites / Thrips',
    pestTreatment: 'Install sticky traps and apply wettable sulphur/neem spray',
    harvestKg: 1450,
  },
  {
    name: 'Turmeric',
    variety: 'Salem / Duggirala',
    group: 'fruit_spice',
    notes: 'Sample spice plot — mulched beds with steady soil moisture',
    waterLiters: 3100,
    fertilizerName: 'Vermicompost + Neem Cake',
    fertilizerKg: 40,
    pestIssue: 'Rhizome Rot Watch',
    pestTreatment: 'Ensure raised beds drain excess rainwater quickly',
    harvestKg: 2250,
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickThreeRandomDemoCrops(): [DemoCropTemplate, DemoCropTemplate, DemoCropTemplate] {
  const staples = shuffleArray(DEMO_CROP_POOL.filter((c) => c.group === 'staple'));
  const vegetables = shuffleArray(DEMO_CROP_POOL.filter((c) => c.group === 'vegetable'));
  const fruitsSpices = shuffleArray(DEMO_CROP_POOL.filter((c) => c.group === 'fruit_spice'));
  return [staples[0], vegetables[0], fruitsSpices[0]];
}

function dateDaysFromToday(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function dateMonthsAgo(monthsAgo: number, preferredDay = 12): string {
  const now = new Date();
  const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, preferredDay));
  if (monthsAgo === 0 && target > now) {
    return now.toISOString().slice(0, 10);
  }
  return target.toISOString().slice(0, 10);
}

export function ensureDemoFarmerSeeded(): number {
  const existing = db
    .prepare('SELECT id, full_name FROM farmers WHERE email = ?')
    .get('demo@krishifield.app') as { id: number; full_name: string } | undefined;

  if (existing) {
    if (existing.full_name === 'Ramesh Reddy' || !existing.full_name.trim()) {
      db.prepare('UPDATE farmers SET full_name = ? WHERE id = ?').run('Farmer', existing.id);
    }
    return existing.id;
  }

  const passwordHash = bcrypt.hashSync('farmer123', 10);
  const firstLoc = DEMO_RANDOM_LOCATIONS[0];

  const insertTransaction = db.transaction(() => {
    const farmerRes = db
      .prepare(
        `INSERT INTO farmers (full_name, email, phone, phone_normalized, password_hash, preferred_language, location, auth_provider)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'email')`
      )
      .run(
        'Farmer',
        'demo@krishifield.app',
        '+91 98480 12345',
        '919848012345',
        passwordHash,
        'en',
        `${firstLoc.village}, ${firstLoc.district}, ${firstLoc.state}`
      );

    const farmerId = Number(farmerRes.lastInsertRowid);

    db.prepare(
      `INSERT INTO weather_alert_settings (farmer_id, max_temp_c, min_temp_c, heavy_rain_mm, high_wind_kmh, high_humidity_pct)
       VALUES (?, 35, 8, 12, 24, 80)`
    ).run(farmerId);

    return farmerId;
  });

  return insertTransaction();
}

export function resetDemoFarmerForSession(preferredLanguage?: string): {
  farmerId: number;
  demoLocation: DemoLocationOption;
} {
  const demoId = ensureDemoFarmerSeeded();
  const currentRow = db
    .prepare('SELECT location, preferred_language FROM farmers WHERE id = ?')
    .get(demoId) as { location: string; preferred_language: string } | undefined;

  const candidates = DEMO_RANDOM_LOCATIONS.filter(
    (loc) => `${loc.village}, ${loc.district}, ${loc.state}` !== currentRow?.location
  );
  const pool = candidates.length > 0 ? candidates : DEMO_RANDOM_LOCATIONS;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const locationText = `${picked.village}, ${picked.district}, ${picked.state}`;
  const cleanLang =
    typeof preferredLanguage === 'string' && /^[a-z]{2,8}(-[A-Za-z0-9]+)?$/.test(preferredLanguage.trim())
      ? preferredLanguage.trim()
      : currentRow?.preferred_language || 'en';

  const [cropA, cropB, cropC] = pickThreeRandomDemoCrops();
  const today = dateDaysFromToday(0);

  const resetTx = db.transaction(() => {
    db.prepare('DELETE FROM farms WHERE farmer_id = ?').run(demoId);
    db.prepare('DELETE FROM acknowledged_weather_alerts WHERE farmer_id = ?').run(demoId);
    db.prepare(
      `UPDATE farmers SET full_name = 'Farmer', location = ?, preferred_language = ? WHERE id = ?`
    ).run(locationText, cleanLang, demoId);

    const farmRes = db
      .prepare(
        `INSERT INTO farms (farmer_id, name, location, latitude, longitude, total_area_acres, soil_type, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        demoId,
        `${picked.village} Demo Farm`,
        locationText,
        picked.latitude,
        picked.longitude,
        4,
        picked.soilType,
        'Randomly assigned location and sample crops for exploring the website'
      );

    const farmId = Number(farmRes.lastInsertRowid);
    const insertFieldStmt = db.prepare(
      `INSERT INTO fields (farmer_id, farm_id, name, location, area_acres, soil_type, irrigation_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    const fieldARes = insertFieldStmt.run(
      demoId,
      farmId,
      'Plot A - Main Field',
      locationText,
      2.5,
      picked.soilType,
      picked.irrigationMethod
    );
    const fieldAId = Number(fieldARes.lastInsertRowid);

    const fieldBRes = insertFieldStmt.run(
      demoId,
      farmId,
      'Plot B - Garden & Orchard',
      locationText,
      1.5,
      'Loamy',
      'Drip'
    );
    const fieldBId = Number(fieldBRes.lastInsertRowid);

    const insertCropStmt = db.prepare(
      `INSERT INTO crops (farmer_id, field_id, crop_name, variety, planting_date, cultivation_stage, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`
    );

    const cropARes = insertCropStmt.run(
      demoId,
      fieldAId,
      cropA.name,
      cropA.variety,
      dateDaysFromToday(-38),
      'vegetative_growth',
      cropA.notes
    );
    const cropAId = Number(cropARes.lastInsertRowid);

    const cropBRes = insertCropStmt.run(
      demoId,
      fieldBId,
      cropB.name,
      cropB.variety,
      dateDaysFromToday(-9),
      'sowing',
      cropB.notes
    );
    const cropBId = Number(cropBRes.lastInsertRowid);

    const cropCRes = insertCropStmt.run(
      demoId,
      fieldBId,
      cropC.name,
      cropC.variety,
      dateDaysFromToday(-76),
      'maturity',
      cropC.notes
    );
    const cropCId = Number(cropCRes.lastInsertRowid);

    // Sample watering logs: Plot A is due today so first-time users can test "Mark Watered" right away
    const insertIrrigationStmt = db.prepare(
      `INSERT INTO irrigations (farmer_id, field_id, crop_id, irrigation_date, water_quantity_liters, frequency_days, next_scheduled_date, method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    insertIrrigationStmt.run(
      demoId,
      fieldAId,
      cropAId,
      dateDaysFromToday(-5),
      cropA.waterLiters,
      5,
      today,
      picked.irrigationMethod,
      'Watering due today — tap Mark Watered to update this schedule'
    );
    insertIrrigationStmt.run(
      demoId,
      fieldBId,
      cropBId,
      dateDaysFromToday(-6),
      Math.round(cropB.waterLiters * 0.8),
      4,
      dateDaysFromToday(-2),
      'Drip',
      'Earlier nursery drip watering'
    );
    insertIrrigationStmt.run(
      demoId,
      fieldBId,
      cropCId,
      dateDaysFromToday(-1),
      cropC.waterLiters,
      4,
      dateDaysFromToday(3),
      'Drip',
      'Scheduled drip cycle completed yesterday'
    );

    // Sample fertilizer logs
    const insertFertStmt = db.prepare(
      `INSERT INTO fertilizers (farmer_id, field_id, crop_id, fertilizer_name, quantity_kg, application_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    insertFertStmt.run(
      demoId,
      fieldAId,
      cropAId,
      cropA.fertilizerName,
      cropA.fertilizerKg,
      dateDaysFromToday(-14),
      'Sample top-dressing application for healthy leaf growth'
    );
    insertFertStmt.run(
      demoId,
      fieldBId,
      cropBId,
      cropB.fertilizerName,
      cropB.fertilizerKg,
      dateDaysFromToday(-4),
      'Sample basal nutrient application'
    );

    // Sample pest observation so Pests & Photos shows a beginner example
    db.prepare(
      `INSERT INTO pest_observations (farmer_id, field_id, crop_id, observation_date, pest_or_disease, severity, observation_notes, treatment_details, status)
       VALUES (?, ?, ?, ?, ?, 'low', ?, ?, 'active')`
    ).run(
      demoId,
      fieldBId,
      cropBId,
      dateDaysFromToday(-3),
      cropB.pestIssue,
      'Sample field check — open Pests & Photos to upload a photo or describe a problem',
      cropB.pestTreatment
    );

    // Sample harvest records across 3 distinct months so charts and Harvests page are populated
    const insertHarvestStmt = db.prepare(
      `INSERT INTO harvests (farmer_id, field_id, crop_id, status, harvest_date, quantity_kg, quality_grade, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    insertHarvestStmt.run(
      demoId,
      fieldAId,
      cropAId,
      'completed',
      dateMonthsAgo(2, 14),
      cropA.harvestKg,
      'Grade A',
      'Sample previous harvest for production trend chart'
    );
    insertHarvestStmt.run(
      demoId,
      fieldBId,
      cropCId,
      'completed',
      dateMonthsAgo(1, 16),
      cropC.harvestKg,
      'Grade A',
      'Sample last-month picking'
    );
    insertHarvestStmt.run(
      demoId,
      fieldBId,
      cropCId,
      'in_progress',
      dateMonthsAgo(0, 5),
      Math.round(cropC.harvestKg * 0.45),
      'Grade A',
      'Current harvest batch in progress'
    );
    insertHarvestStmt.run(
      demoId,
      fieldBId,
      cropCId,
      'planned',
      dateDaysFromToday(10),
      Math.round(cropC.harvestKg * 0.6),
      'Grade A',
      'Upcoming planned harvest'
    );
  });

  resetTx();
  return { farmerId: demoId, demoLocation: picked };
}
