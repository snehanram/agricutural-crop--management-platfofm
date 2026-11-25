-- MySQL 8.0 Reference Schema & Sample Seed Data
-- Agricultural Crop Management Platform (KrishiField)

CREATE DATABASE IF NOT EXISTS agricultural_crop_platform
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agricultural_crop_platform;

CREATE TABLE IF NOT EXISTS farmers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(30) DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  preferred_language ENUM('en', 'te', 'hi') NOT NULL DEFAULT 'en',
  location VARCHAR(160) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(160) NOT NULL,
  latitude DECIMAL(9, 6) NULL,
  longitude DECIMAL(9, 6) NULL,
  total_area_acres DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  soil_type VARCHAR(80) DEFAULT 'Loamy',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_farms_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  farm_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(160) DEFAULT '',
  area_acres DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  soil_type VARCHAR(80) DEFAULT 'Loamy',
  irrigation_method VARCHAR(80) DEFAULT 'Drip',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fields_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  CONSTRAINT fk_fields_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  field_id INT NOT NULL,
  crop_name VARCHAR(120) NOT NULL,
  variety VARCHAR(120) DEFAULT '',
  planting_date DATE NOT NULL,
  cultivation_stage ENUM(
    'land_preparation',
    'sowing',
    'germination',
    'vegetative_growth',
    'flowering',
    'maturity',
    'harvesting'
  ) NOT NULL DEFAULT 'land_preparation',
  status ENUM('active', 'harvested') NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_crops_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  CONSTRAINT fk_crops_field FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS irrigations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  field_id INT NOT NULL,
  crop_id INT NULL,
  irrigation_date DATE NOT NULL,
  water_quantity_liters DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  frequency_days INT NOT NULL DEFAULT 7,
  next_scheduled_date DATE NOT NULL,
  method VARCHAR(80) DEFAULT 'Drip',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_irrigations_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  CONSTRAINT fk_irrigations_field FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  CONSTRAINT fk_irrigations_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS fertilizers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  field_id INT NOT NULL,
  crop_id INT NULL,
  fertilizer_name VARCHAR(120) NOT NULL,
  quantity_kg DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  application_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fertilizers_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  CONSTRAINT fk_fertilizers_field FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  CONSTRAINT fk_fertilizers_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pest_observations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  field_id INT NOT NULL,
  crop_id INT NULL,
  observation_date DATE NOT NULL,
  pest_or_disease VARCHAR(160) NOT NULL,
  severity ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  observation_notes TEXT,
  treatment_details TEXT,
  status ENUM('active', 'treated', 'resolved') NOT NULL DEFAULT 'active',
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pests_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  CONSTRAINT fk_pests_field FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  CONSTRAINT fk_pests_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS harvests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  field_id INT NOT NULL,
  crop_id INT NULL,
  status ENUM('planned', 'in_progress', 'completed') NOT NULL DEFAULT 'planned',
  harvest_date DATE NOT NULL,
  quantity_kg DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  quality_grade VARCHAR(60) DEFAULT 'Grade A',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_harvests_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  CONSTRAINT fk_harvests_field FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  CONSTRAINT fk_harvests_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS weather_alert_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL UNIQUE,
  max_temp_c DECIMAL(5, 2) NOT NULL DEFAULT 36.00,
  min_temp_c DECIMAL(5, 2) NOT NULL DEFAULT 7.00,
  heavy_rain_mm DECIMAL(6, 2) NOT NULL DEFAULT 15.00,
  high_wind_kmh DECIMAL(6, 2) NOT NULL DEFAULT 25.00,
  high_humidity_pct INT NOT NULL DEFAULT 82,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_weather_settings_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- Sample Seed Data
INSERT INTO farmers (id, full_name, email, phone, password_hash, preferred_language, location)
VALUES (1, 'Farmer', 'demo@krishifield.app', '+91 98480 12345', '$2b$10$sampleBcryptHashPlaceholder', 'en', 'Guntur, Andhra Pradesh');

INSERT INTO farms (id, farmer_id, name, location, latitude, longitude, total_area_acres, soil_type, notes)
VALUES
  (1, 1, 'Green Valley Farm', 'Guntur, Andhra Pradesh', 16.306700, 80.436500, 12.50, 'Alluvial Clay Loam', 'Main irrigated paddy and chili farm'),
  (2, 1, 'Krishna Delta Plot', 'Vijayawada, Andhra Pradesh', 16.506200, 80.648000, 8.00, 'Black Cotton Soil', 'Upland cotton and turmeric plot');

INSERT INTO fields (id, farmer_id, farm_id, name, location, area_acres, soil_type, irrigation_method)
VALUES
  (1, 1, 1, 'North Paddy Block', 'Sector A - Canal Side', 5.50, 'Clay Loam', 'Canal Flood'),
  (2, 1, 1, 'East Chili Terrace', 'Sector B - Borewell 1', 4.00, 'Red Sandy Loam', 'Drip'),
  (3, 1, 1, 'Orchard Drip Plot', 'Sector C - South Gate', 3.00, 'Loamy', 'Drip'),
  (4, 1, 2, 'South Cotton Acre', 'Delta Block 2', 8.00, 'Black Cotton', 'Sprinkler');
