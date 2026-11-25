# KrishiField — Agricultural Crop Management Platform

A responsive full-stack web application for farmers to manage multiple farms, fields, crop cultivation stages, irrigation schedules, fertilizer applications, pest & disease monitoring with photo uploads, harvest yields, live weather monitoring & agricultural alerts, and exportable PDF/CSV reports.

## Key Features

- **JWT Farmer Authentication**: Registration & login with `bcryptjs` password hashing and per-farmer data isolation.
- **Multilingual UI (`react-i18next`)**: Instant switching between **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)** from both the login page and workspace header.
- **Farms & Fields**: Manage multiple farms and field plots with acreage, soil type, and irrigation method.
- **Crop & 7-Stage Cultivation Tracker**: Visual progress tracking across Land Preparation, Sowing, Germination, Vegetative Growth, Flowering, Maturity, and Harvesting.
- **Irrigation & Fertilizer Logs**: Track water volume, irrigation frequency, upcoming due dates, and full fertilizer application history.
- **Pest & Disease Monitoring**: Log symptoms, severity, treatments, and crop photos (local disk upload structured behind `ImageStorageProvider` for easy Firebase Storage migration).
- **Weather Monitoring & Alerts**: Live 7-day Open-Meteo forecasts per farm location with customizable thresholds for heavy rain, heat stress, frost risk, high wind spraying advisories, and fungal humidity watch.
- **Harvest & Exportable Reports**: Chart.js analytics (`react-chartjs-2`), UTF-8 CSV export, and formatted PDF reports (`jsPDF`).

## Project Structure

- `server.ts` — Express REST API + Vite middleware entry point on port `3000`
- `server/db.ts` — SQLite schema (`better-sqlite3`) and demo seed data
- `server/auth.ts` — JWT token signing, verification, and `requireAuth` middleware
- `server/storage.ts` — `ImageStorageProvider` local upload handler (`uploads/pests/`)
- `server/weather.ts` — Open-Meteo geocoding, 7-day forecast, and agronomic alert evaluator
- `database/mysql_schema.sql` — MySQL 8.0 reference schema & sample seed data
- `src/` — React 19 + Tailwind CSS + Chart.js + `react-i18next` frontend

## Setup & Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use **Try Demo Farm (Ramesh Reddy)** or register a new farmer account.
