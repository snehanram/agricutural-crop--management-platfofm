import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { db, ensureDemoFarmerSeeded, initDatabase, resetDemoFarmerForSession } from './server/db.ts';
import {
  hashPassword,
  requireAuth,
  signToken,
  verifyPassword,
  type AuthenticatedRequest,
} from './server/auth.ts';
import { imageStorage, pestAnalyzeUpload, pestImageUpload, UPLOADS_ROOT } from './server/storage.ts';
import {
  evaluateFarmWeatherAlerts,
  fetchForecastForCoords,
  resolveLocationCoordinates,
  type FarmWeatherReport,
  type WeatherAlertSettings,
} from './server/weather.ts';
import {
  analyzePlantPhotoWithGemini,
  findNearbyAgriPlaces,
  formatGeminiError,
  synthesizeSpeechWithGemini,
  translateDiagnosisWithGemini,
  translatePestRecordsWithGemini,
} from './server/gemini.ts';

initDatabase();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(UPLOADS_ROOT));

function addDaysToIso(dateStr: string, days: number): string {
  const base = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(base.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

interface FarmerDbRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  password_hash?: string;
  preferred_language: string;
  location: string;
  auth_provider?: 'email' | 'google' | 'apple' | 'phone';
  provider_id?: string;
  phone_normalized?: string;
  created_at: string;
}

function normalizeLanguageCode(raw: unknown): string {
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (/^[a-z]{2,8}(-[A-Za-z0-9]+)?$/.test(trimmed)) {
      return trimmed;
    }
  }
  return 'en';
}

function getAppBaseUrl(): string {
  const envUrl = process.env.APP_URL;
  if (envUrl && envUrl !== 'MY_APP_URL') {
    return envUrl.replace(/\/+$/, '');
  }
  return `http://localhost:${PORT}`;
}

function normalizePhoneInput(rawPhone: string): { display: string; digits: string; last10: string } {
  const display = rawPhone.trim();
  const digits = display.replace(/\D/g, '');
  const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
  return { display, digits, last10 };
}

function sanitizeFarmer(row: FarmerDbRow) {
  const isSyntheticPhoneEmail = row.email.endsWith('@phone.krishifield.local');
  return {
    id: row.id,
    full_name: row.full_name,
    email: isSyntheticPhoneEmail ? '' : row.email,
    phone: row.phone,
    preferred_language: row.preferred_language,
    location: row.location,
    auth_provider: row.auth_provider || 'email',
    created_at: row.created_at,
  };
}

function issueFarmerSession(row: FarmerDbRow) {
  const farmer = sanitizeFarmer(row);
  const token = signToken({
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    preferred_language: row.preferred_language,
  });
  return { token, farmer };
}

function upsertOAuthFarmer(params: {
  provider: 'google' | 'apple';
  providerId: string;
  email: string;
  fullName: string;
  preferredLanguage?: string;
}) {
  const lang = normalizeLanguageCode(params.preferredLanguage);
  const normalizedEmail = params.email.trim().toLowerCase();

  let row = db
    .prepare('SELECT * FROM farmers WHERE auth_provider = ? AND provider_id = ?')
    .get(params.provider, params.providerId) as FarmerDbRow | undefined;

  if (!row && normalizedEmail) {
    row = db.prepare('SELECT * FROM farmers WHERE email = ?').get(normalizedEmail) as FarmerDbRow | undefined;
  }

  if (row) {
    if (!row.provider_id && params.providerId) {
      db.prepare('UPDATE farmers SET provider_id = ?, auth_provider = ? WHERE id = ?').run(
        params.providerId,
        params.provider,
        row.id
      );
      row = db.prepare('SELECT * FROM farmers WHERE id = ?').get(row.id) as FarmerDbRow;
    }
    return issueFarmerSession(row);
  }

  const finalEmail = normalizedEmail || `${params.provider}_${params.providerId}@oauth.krishifield.local`;
  const finalName = params.fullName.trim() || (params.provider === 'apple' ? 'Apple Farmer' : 'Google Farmer');
  const randomPasswordHash = hashPassword(crypto.randomBytes(24).toString('hex'));

  const result = db
    .prepare(
      `INSERT INTO farmers (full_name, email, phone, password_hash, preferred_language, location, auth_provider, provider_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(finalName, finalEmail, '', randomPasswordHash, lang, '', params.provider, params.providerId);

  const farmerId = Number(result.lastInsertRowid);
  db.prepare(`INSERT INTO weather_alert_settings (farmer_id) VALUES (?)`).run(farmerId);

  const created = db.prepare('SELECT * FROM farmers WHERE id = ?').get(farmerId) as FarmerDbRow;
  return issueFarmerSession(created);
}

function serializeForInlineScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function renderOAuthCallbackHtml(payload: { type: 'OAUTH_AUTH_SUCCESS'; token: string; farmer: unknown } | { type: 'OAUTH_AUTH_ERROR'; error: string }): string {
  const safeJson = serializeForInlineScript(payload);
  const message =
    payload.type === 'OAUTH_AUTH_SUCCESS'
      ? 'Sign-in successful. Returning to KrishiField...'
      : `Sign-in could not be completed: ${payload.error}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KrishiField Sign In</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; background: #F8F9F7; color: #14221B; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
      .card { max-width: 420px; background: #fff; border: 1px solid #E2E7E0; border-radius: 14px; padding: 24px; }
    </style>
  </head>
  <body>
    <div class="card">
      <p>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    </div>
    <script>
      (function () {
        var data = ${safeJson};
        try {
          if (data.type === 'OAUTH_AUTH_SUCCESS' && data.token) {
            localStorage.setItem('krishifield_token', data.token);
          }
        } catch (e) {}
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(data, '*');
          window.close();
        } else if (data.type === 'OAUTH_AUTH_SUCCESS') {
          window.location.href = '/';
        }
      })();
    </script>
  </body>
</html>`;
}

// ================= AUTH ROUTES =================
app.get('/api/auth/providers', (_req, res) => {
  const baseUrl = getAppBaseUrl();
  res.json({
    google: {
      configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      callbackUrl: `${baseUrl}/api/auth/oauth/google/callback`,
    },
    apple: {
      configured: Boolean(
        process.env.APPLE_CLIENT_ID &&
          process.env.APPLE_TEAM_ID &&
          process.env.APPLE_KEY_ID &&
          process.env.APPLE_PRIVATE_KEY
      ),
      callbackUrl: `${baseUrl}/api/auth/oauth/apple/callback`,
    },
    phone: { configured: true },
    email: { configured: true },
  });
});

app.post('/api/auth/oauth/direct', (req, res) => {
  const { provider, email, full_name, preferred_language } = req.body ?? {};
  if (provider !== 'google' && provider !== 'apple') {
    res.status(400).json({ error: 'Invalid account provider' });
    return;
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Please enter a valid email address' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const fallbackName = normalizedEmail.split('@')[0] || (provider === 'apple' ? 'Apple Farmer' : 'Google Farmer');
  const session = upsertOAuthFarmer({
    provider,
    providerId: `direct_${normalizedEmail}`,
    email: normalizedEmail,
    fullName: typeof full_name === 'string' && full_name.trim() ? full_name.trim() : fallbackName,
    preferredLanguage: typeof preferred_language === 'string' ? preferred_language : 'en',
  });

  res.json(session);
});

app.post('/api/auth/phone', (req, res) => {
  const { phone, full_name, preferred_language, location, mode } = req.body ?? {};
  if (!phone || typeof phone !== 'string') {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  const { display, digits, last10 } = normalizePhoneInput(phone);
  if (digits.length < 7 || digits.length > 15) {
    res.status(400).json({ error: 'Please enter a valid mobile number (7 to 15 digits)' });
    return;
  }

  let row = db
    .prepare('SELECT * FROM farmers WHERE phone_normalized = ?')
    .get(digits) as FarmerDbRow | undefined;

  if (!row && last10.length === 10) {
    row = db
      .prepare(
        `SELECT * FROM farmers
         WHERE length(phone_normalized) >= 10
           AND substr(phone_normalized, length(phone_normalized) - 9, 10) = ?
         LIMIT 1`
      )
      .get(last10) as FarmerDbRow | undefined;
  }

  if (mode === 'register') {
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      res.status(400).json({ error: 'Your full name is required (at least 2 characters)' });
      return;
    }
    if (row) {
      res.status(409).json({ error: 'An account with this phone number already exists. Please use Sign In.' });
      return;
    }
  }

  if (row) {
    if (typeof full_name === 'string' && full_name.trim().length >= 2 && row.full_name.startsWith('Farmer ')) {
      db.prepare('UPDATE farmers SET full_name = ? WHERE id = ?').run(full_name.trim(), row.id);
      row = db.prepare('SELECT * FROM farmers WHERE id = ?').get(row.id) as FarmerDbRow;
    }
    const session = issueFarmerSession(row);
    res.json({ ...session, isNew: false });
    return;
  }

  if (mode === 'login' && (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2)) {
    res.status(404).json({ error: 'No account found for this phone number. Switch to Create Account and enter your name.' });
    return;
  }

  const lang = normalizeLanguageCode(preferred_language);
  const cleanName =
    typeof full_name === 'string' && full_name.trim().length >= 2
      ? full_name.trim()
      : `Farmer ${last10.slice(-4) || digits.slice(-4)}`;
  const syntheticEmail = `phone_${digits}@phone.krishifield.local`;
  const randomPasswordHash = hashPassword(crypto.randomBytes(24).toString('hex'));

  const result = db
    .prepare(
      `INSERT INTO farmers (full_name, email, phone, phone_normalized, password_hash, preferred_language, location, auth_provider, provider_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'phone', ?)`
    )
    .run(
      cleanName,
      syntheticEmail,
      display,
      digits,
      randomPasswordHash,
      lang,
      typeof location === 'string' ? location.trim() : '',
      digits
    );

  const farmerId = Number(result.lastInsertRowid);
  db.prepare(`INSERT INTO weather_alert_settings (farmer_id) VALUES (?)`).run(farmerId);

  const created = db.prepare('SELECT * FROM farmers WHERE id = ?').get(farmerId) as FarmerDbRow;
  const session = issueFarmerSession(created);
  res.status(201).json({ ...session, isNew: true });
});

app.get('/api/auth/oauth/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${getAppBaseUrl()}/api/auth/oauth/google/callback`;

  if (!clientId || !clientSecret) {
    res.status(503).json({
      error: 'Google login requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment secrets.',
      callbackUrl: redirectUri,
    });
    return;
  }

  const lang = typeof req.query.lang === 'string' ? req.query.lang : 'en';
  const state = Buffer.from(JSON.stringify({ lang })).toString('base64url');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  });

  res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
});

app.get(['/api/auth/oauth/google/callback', '/api/auth/oauth/google/callback/'], async (req, res) => {
  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const oauthError = typeof req.query.error === 'string' ? req.query.error : '';
  let lang = 'en';
  if (typeof req.query.state === 'string') {
    try {
      const parsed = JSON.parse(Buffer.from(req.query.state, 'base64url').toString('utf8')) as { lang?: string };
      if (parsed.lang) lang = parsed.lang;
    } catch {
      // ignore invalid state
    }
  }

  if (oauthError || !code) {
    res.status(400).send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_ERROR', error: oauthError || 'Missing authorization code' }));
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${getAppBaseUrl()}/api/auth/oauth/google/callback`;

  if (!clientId || !clientSecret) {
    res.status(503).send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_ERROR', error: 'Google OAuth credentials are missing on server' }));
    return;
  }

  try {
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });
    const tokenData = (await tokenResp.json()) as { access_token?: string; error_description?: string; error?: string };
    if (!tokenResp.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange Google code');
    }

    const userResp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = (await userResp.json()) as { id?: string; email?: string; name?: string };
    if (!userResp.ok || !userInfo.id) {
      throw new Error('Could not read Google account profile');
    }

    const session = upsertOAuthFarmer({
      provider: 'google',
      providerId: userInfo.id,
      email: userInfo.email || '',
      fullName: userInfo.name || 'Google Farmer',
      preferredLanguage: lang,
    });

    res.send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_SUCCESS', token: session.token, farmer: session.farmer }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Google sign-in failed';
    res.status(400).send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_ERROR', error: msg }));
  }
});

app.get('/api/auth/oauth/apple/url', (req, res) => {
  const clientId = process.env.APPLE_CLIENT_ID;
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY;
  const redirectUri = `${getAppBaseUrl()}/api/auth/oauth/apple/callback`;

  if (!clientId || !teamId || !keyId || !privateKey) {
    res.status(503).json({
      error: 'Apple / Mac login requires APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY in environment secrets.',
      callbackUrl: redirectUri,
    });
    return;
  }

  const lang = typeof req.query.lang === 'string' ? req.query.lang : 'en';
  const state = Buffer.from(JSON.stringify({ lang })).toString('base64url');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    response_mode: 'form_post',
    scope: 'name email',
    state,
  });

  res.json({ url: `https://appleid.apple.com/auth/authorize?${params.toString()}` });
});

app.all(
  ['/api/auth/oauth/apple/callback', '/api/auth/oauth/apple/callback/'],
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const code = typeof req.body?.code === 'string' ? req.body.code : typeof req.query.code === 'string' ? req.query.code : '';
    const oauthError = typeof req.body?.error === 'string' ? req.body.error : typeof req.query.error === 'string' ? req.query.error : '';
    const stateRaw = typeof req.body?.state === 'string' ? req.body.state : typeof req.query.state === 'string' ? req.query.state : '';

    let lang = 'en';
    if (stateRaw) {
      try {
        const parsed = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf8')) as { lang?: string };
        if (parsed.lang) lang = parsed.lang;
      } catch {
        // ignore invalid state
      }
    }

    if (oauthError || !code) {
      res.status(400).send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_ERROR', error: oauthError || 'Missing Apple authorization code' }));
      return;
    }

    const clientId = process.env.APPLE_CLIENT_ID;
    const teamId = process.env.APPLE_TEAM_ID;
    const keyId = process.env.APPLE_KEY_ID;
    const privateKeyRaw = process.env.APPLE_PRIVATE_KEY;
    const redirectUri = `${getAppBaseUrl()}/api/auth/oauth/apple/callback`;

    if (!clientId || !teamId || !keyId || !privateKeyRaw) {
      res.status(503).send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_ERROR', error: 'Apple Sign-In credentials are missing on server' }));
      return;
    }

    try {
      const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
      const clientSecret = jwt.sign(
        {
          iss: teamId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 300,
          aud: 'https://appleid.apple.com',
          sub: clientId,
        },
        privateKey,
        { algorithm: 'ES256', header: { alg: 'ES256', kid: keyId } }
      );

      const tokenResp = await fetch('https://appleid.apple.com/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }).toString(),
      });

      const tokenData = (await tokenResp.json()) as { id_token?: string; error?: string };
      if (!tokenResp.ok || !tokenData.id_token) {
        throw new Error(tokenData.error || 'Failed to exchange Apple authorization code');
      }

      const decoded = jwt.decode(tokenData.id_token) as { sub?: string; email?: string } | null;
      if (!decoded?.sub) {
        throw new Error('Could not decode Apple identity token');
      }

      let fullName = '';
      if (typeof req.body?.user === 'string') {
        try {
          const parsedUser = JSON.parse(req.body.user) as { name?: { firstName?: string; lastName?: string } };
          fullName = [parsedUser.name?.firstName, parsedUser.name?.lastName].filter(Boolean).join(' ').trim();
        } catch {
          // ignore malformed optional user object
        }
      }

      const session = upsertOAuthFarmer({
        provider: 'apple',
        providerId: decoded.sub,
        email: decoded.email || '',
        fullName: fullName || 'Apple Farmer',
        preferredLanguage: lang,
      });

      res.send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_SUCCESS', token: session.token, farmer: session.farmer }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Apple sign-in failed';
      res.status(400).send(renderOAuthCallbackHtml({ type: 'OAUTH_AUTH_ERROR', error: msg }));
    }
  }
);

app.post('/api/auth/register', (req, res) => {
  const { full_name, email, phone, password, preferred_language, location } = req.body ?? {};
  if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
    res.status(400).json({ error: 'Full name is required (min 2 characters)' });
    return;
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM farmers WHERE email = ?').get(normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const lang = normalizeLanguageCode(preferred_language);
  const passwordHash = hashPassword(password);
  const phoneInfo = typeof phone === 'string' ? normalizePhoneInput(phone) : { display: '', digits: '', last10: '' };

  const result = db
    .prepare(
      `INSERT INTO farmers (full_name, email, phone, phone_normalized, password_hash, preferred_language, location, auth_provider)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'email')`
    )
    .run(
      full_name.trim(),
      normalizedEmail,
      phoneInfo.display,
      phoneInfo.digits,
      passwordHash,
      lang,
      typeof location === 'string' ? location.trim() : ''
    );

  const farmerId = Number(result.lastInsertRowid);
  db.prepare(`INSERT INTO weather_alert_settings (farmer_id) VALUES (?)`).run(farmerId);

  const farmerRow = db.prepare('SELECT * FROM farmers WHERE id = ?').get(farmerId) as FarmerDbRow;
  const session = issueFarmerSession(farmerRow);
  res.status(201).json(session);
});

app.post('/api/auth/demo', (req, res) => {
  const { preferred_language } = req.body ?? {};
  const { farmerId, demoLocation } = resetDemoFarmerForSession(preferred_language);
  const row = db.prepare('SELECT * FROM farmers WHERE id = ?').get(farmerId) as FarmerDbRow;
  res.json({ ...issueFarmerSession(row), demoLocation });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const rawIdentifier = String(email).trim().toLowerCase();
  const lookupEmail =
    rawIdentifier === 'farmer' || rawIdentifier === 'demo' ? 'demo@krishifield.app' : rawIdentifier;

  const row = db
    .prepare('SELECT * FROM farmers WHERE email = ?')
    .get(lookupEmail) as FarmerDbRow | undefined;

  if (!row || !row.password_hash || !verifyPassword(String(password), row.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  res.json(issueFarmerSession(row));
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const row = db.prepare('SELECT * FROM farmers WHERE id = ?').get(req.farmer!.id) as FarmerDbRow | undefined;
  res.json({ farmer: row ? sanitizeFarmer(row) : null });
});

app.patch('/api/auth/preferences', requireAuth, (req: AuthenticatedRequest, res) => {
  const { preferred_language, full_name, phone, location } = req.body ?? {};
  const existing = db.prepare('SELECT * FROM farmers WHERE id = ?').get(req.farmer!.id) as FarmerDbRow;

  const nextLang =
    typeof preferred_language === 'string' && /^[a-z]{2,8}(-[A-Za-z0-9]+)?$/.test(preferred_language.trim())
      ? preferred_language.trim()
      : existing.preferred_language;

  const phoneInfo =
    typeof phone === 'string'
      ? normalizePhoneInput(phone)
      : { display: existing.phone, digits: existing.phone_normalized || existing.phone.replace(/\D/g, '') };

  db.prepare(
    `UPDATE farmers SET full_name = ?, phone = ?, phone_normalized = ?, preferred_language = ?, location = ? WHERE id = ?`
  ).run(
    typeof full_name === 'string' && full_name.trim() ? full_name.trim() : existing.full_name,
    phoneInfo.display,
    phoneInfo.digits,
    nextLang,
    typeof location === 'string' ? location.trim() : existing.location,
    req.farmer!.id
  );

  const updated = db.prepare('SELECT * FROM farmers WHERE id = ?').get(req.farmer!.id) as FarmerDbRow;
  res.json({ farmer: sanitizeFarmer(updated) });
});

// ================= FARMS =================
app.get('/api/farms', requireAuth, (req: AuthenticatedRequest, res) => {
  const farms = db
    .prepare(
      `SELECT f.*,
        (SELECT COUNT(*) FROM fields fl WHERE fl.farm_id = f.id) as field_count
       FROM farms f
       WHERE f.farmer_id = ?
       ORDER BY f.created_at DESC`
    )
    .all(req.farmer!.id);
  res.json({ farms });
});

app.post('/api/farms', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, location, total_area_acres, soil_type, notes, latitude, longitude } = req.body ?? {};
  if (!name || !location) {
    res.status(400).json({ error: 'Farm name and location are required' });
    return;
  }

  const coords = await resolveLocationCoordinates(
    String(location),
    typeof latitude === 'number' ? latitude : undefined,
    typeof longitude === 'number' ? longitude : undefined
  );

  const result = db
    .prepare(
      `INSERT INTO farms (farmer_id, name, location, latitude, longitude, total_area_acres, soil_type, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.farmer!.id,
      String(name).trim(),
      String(location).trim(),
      coords.latitude,
      coords.longitude,
      Number(total_area_acres) || 0,
      String(soil_type || 'Loamy').trim(),
      String(notes || '').trim()
    );

  const farm = db.prepare('SELECT * FROM farms WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ farm });
});

app.put('/api/farms/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM farms WHERE id = ? AND farmer_id = ?').get(id, req.farmer!.id) as
    | { location: string; latitude: number | null; longitude: number | null }
    | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }

  const { name, location, total_area_acres, soil_type, notes } = req.body ?? {};
  if (!name || !location) {
    res.status(400).json({ error: 'Farm name and location are required' });
    return;
  }

  const locationChanged = String(location).trim() !== existing.location;
  const coords = locationChanged
    ? await resolveLocationCoordinates(String(location))
    : await resolveLocationCoordinates(String(location), existing.latitude, existing.longitude);

  db.prepare(
    `UPDATE farms SET name = ?, location = ?, latitude = ?, longitude = ?, total_area_acres = ?, soil_type = ?, notes = ?
     WHERE id = ? AND farmer_id = ?`
  ).run(
    String(name).trim(),
    String(location).trim(),
    coords.latitude,
    coords.longitude,
    Number(total_area_acres) || 0,
    String(soil_type || 'Loamy').trim(),
    String(notes || '').trim(),
    id,
    req.farmer!.id
  );

  const farm = db.prepare('SELECT * FROM farms WHERE id = ?').get(id);
  res.json({ farm });
});

app.delete('/api/farms/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM farms WHERE id = ? AND farmer_id = ?').run(id, req.farmer!.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }
  res.json({ success: true });
});

// ================= FIELDS =================
app.get('/api/fields', requireAuth, (req: AuthenticatedRequest, res) => {
  const fields = db
    .prepare(
      `SELECT fl.*, fm.name as farm_name, fm.location as farm_location,
        (SELECT COUNT(*) FROM crops c WHERE c.field_id = fl.id AND c.status = 'active') as active_crops_count
       FROM fields fl
       JOIN farms fm ON fm.id = fl.farm_id
       WHERE fl.farmer_id = ?
       ORDER BY fl.created_at DESC`
    )
    .all(req.farmer!.id);
  res.json({ fields });
});

app.post('/api/fields', requireAuth, (req: AuthenticatedRequest, res) => {
  const { farm_id, name, location, area_acres, soil_type, irrigation_method } = req.body ?? {};
  const farm = db.prepare('SELECT id FROM farms WHERE id = ? AND farmer_id = ?').get(Number(farm_id), req.farmer!.id);
  if (!farm) {
    res.status(400).json({ error: 'Valid farm selection is required' });
    return;
  }
  if (!name || String(name).trim().length === 0) {
    res.status(400).json({ error: 'Field name is required' });
    return;
  }

  const result = db
    .prepare(
      `INSERT INTO fields (farmer_id, farm_id, name, location, area_acres, soil_type, irrigation_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.farmer!.id,
      Number(farm_id),
      String(name).trim(),
      String(location || '').trim(),
      Number(area_acres) || 0,
      String(soil_type || 'Loamy').trim(),
      String(irrigation_method || 'Drip').trim()
    );

  const field = db
    .prepare(
      `SELECT fl.*, fm.name as farm_name FROM fields fl JOIN farms fm ON fm.id = fl.farm_id WHERE fl.id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json({ field });
});

app.put('/api/fields/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT id FROM fields WHERE id = ? AND farmer_id = ?').get(id, req.farmer!.id);
  if (!existing) {
    res.status(404).json({ error: 'Field not found' });
    return;
  }

  const { farm_id, name, location, area_acres, soil_type, irrigation_method } = req.body ?? {};
  const farm = db.prepare('SELECT id FROM farms WHERE id = ? AND farmer_id = ?').get(Number(farm_id), req.farmer!.id);
  if (!farm) {
    res.status(400).json({ error: 'Valid farm is required' });
    return;
  }
  if (!name) {
    res.status(400).json({ error: 'Field name is required' });
    return;
  }

  db.prepare(
    `UPDATE fields SET farm_id = ?, name = ?, location = ?, area_acres = ?, soil_type = ?, irrigation_method = ?
     WHERE id = ? AND farmer_id = ?`
  ).run(
    Number(farm_id),
    String(name).trim(),
    String(location || '').trim(),
    Number(area_acres) || 0,
    String(soil_type || 'Loamy').trim(),
    String(irrigation_method || 'Drip').trim(),
    id,
    req.farmer!.id
  );

  const field = db
    .prepare(
      `SELECT fl.*, fm.name as farm_name FROM fields fl JOIN farms fm ON fm.id = fl.farm_id WHERE fl.id = ?`
    )
    .get(id);
  res.json({ field });
});

app.delete('/api/fields/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM fields WHERE id = ? AND farmer_id = ?').run(id, req.farmer!.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Field not found' });
    return;
  }
  res.json({ success: true });
});

// ================= CROPS =================
const VALID_STAGES = [
  'land_preparation',
  'sowing',
  'germination',
  'vegetative_growth',
  'flowering',
  'maturity',
  'harvesting',
];

app.get('/api/crops', requireAuth, (req: AuthenticatedRequest, res) => {
  const crops = db
    .prepare(
      `SELECT c.*, fl.name as field_name, fm.name as farm_name, fm.id as farm_id
       FROM crops c
       JOIN fields fl ON fl.id = c.field_id
       JOIN farms fm ON fm.id = fl.farm_id
       WHERE c.farmer_id = ?
       ORDER BY c.created_at DESC`
    )
    .all(req.farmer!.id);
  res.json({ crops });
});

app.post('/api/crops', requireAuth, (req: AuthenticatedRequest, res) => {
  const { field_id, crop_name, variety, planting_date, cultivation_stage, status, notes } = req.body ?? {};
  const field = db.prepare('SELECT id FROM fields WHERE id = ? AND farmer_id = ?').get(Number(field_id), req.farmer!.id);
  if (!field) {
    res.status(400).json({ error: 'Valid field is required' });
    return;
  }
  if (!crop_name || !planting_date) {
    res.status(400).json({ error: 'Crop name and planting date are required' });
    return;
  }

  const stage = VALID_STAGES.includes(cultivation_stage) ? cultivation_stage : 'land_preparation';
  const cropStatus = status === 'harvested' ? 'harvested' : 'active';

  const result = db
    .prepare(
      `INSERT INTO crops (farmer_id, field_id, crop_name, variety, planting_date, cultivation_stage, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.farmer!.id,
      Number(field_id),
      String(crop_name).trim(),
      String(variety || '').trim(),
      String(planting_date).slice(0, 10),
      stage,
      cropStatus,
      String(notes || '').trim()
    );

  const crop = db
    .prepare(
      `SELECT c.*, fl.name as field_name, fm.name as farm_name FROM crops c
       JOIN fields fl ON fl.id = c.field_id JOIN farms fm ON fm.id = fl.farm_id WHERE c.id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json({ crop });
});

app.put('/api/crops/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT id FROM crops WHERE id = ? AND farmer_id = ?').get(id, req.farmer!.id);
  if (!existing) {
    res.status(404).json({ error: 'Crop not found' });
    return;
  }

  const { field_id, crop_name, variety, planting_date, cultivation_stage, status, notes } = req.body ?? {};
  const field = db.prepare('SELECT id FROM fields WHERE id = ? AND farmer_id = ?').get(Number(field_id), req.farmer!.id);
  if (!field) {
    res.status(400).json({ error: 'Valid field is required' });
    return;
  }

  const stage = VALID_STAGES.includes(cultivation_stage) ? cultivation_stage : 'land_preparation';
  const cropStatus = status === 'harvested' ? 'harvested' : 'active';

  db.prepare(
    `UPDATE crops SET field_id = ?, crop_name = ?, variety = ?, planting_date = ?, cultivation_stage = ?, status = ?, notes = ?
     WHERE id = ? AND farmer_id = ?`
  ).run(
    Number(field_id),
    String(crop_name).trim(),
    String(variety || '').trim(),
    String(planting_date).slice(0, 10),
    stage,
    cropStatus,
    String(notes || '').trim(),
    id,
    req.farmer!.id
  );

  const crop = db
    .prepare(
      `SELECT c.*, fl.name as field_name, fm.name as farm_name FROM crops c
       JOIN fields fl ON fl.id = c.field_id JOIN farms fm ON fm.id = fl.farm_id WHERE c.id = ?`
    )
    .get(id);
  res.json({ crop });
});

app.patch('/api/crops/:id/stage', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const { cultivation_stage, status } = req.body ?? {};
  if (!VALID_STAGES.includes(cultivation_stage)) {
    res.status(400).json({ error: 'Invalid cultivation stage' });
    return;
  }

  const existing = db.prepare('SELECT status FROM crops WHERE id = ? AND farmer_id = ?').get(id, req.farmer!.id) as
    | { status: string }
    | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Crop not found' });
    return;
  }

  const nextStatus = status === 'harvested' || status === 'active' ? status : existing.status;

  db.prepare('UPDATE crops SET cultivation_stage = ?, status = ? WHERE id = ? AND farmer_id = ?').run(
    cultivation_stage,
    nextStatus,
    id,
    req.farmer!.id
  );

  const crop = db
    .prepare(
      `SELECT c.*, fl.name as field_name, fm.name as farm_name FROM crops c
       JOIN fields fl ON fl.id = c.field_id JOIN farms fm ON fm.id = fl.farm_id WHERE c.id = ?`
    )
    .get(id);
  res.json({ crop });
});

app.delete('/api/crops/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM crops WHERE id = ? AND farmer_id = ?').run(id, req.farmer!.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Crop not found' });
    return;
  }
  res.json({ success: true });
});

// ================= IRRIGATIONS =================
app.get('/api/irrigations', requireAuth, (req: AuthenticatedRequest, res) => {
  const irrigations = db
    .prepare(
      `SELECT i.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM irrigations i
       JOIN fields fl ON fl.id = i.field_id
       JOIN farms fm ON fm.id = fl.farm_id
       LEFT JOIN crops c ON c.id = i.crop_id
       WHERE i.farmer_id = ?
       ORDER BY i.irrigation_date DESC, i.id DESC`
    )
    .all(req.farmer!.id);
  res.json({ irrigations });
});

app.post('/api/irrigations', requireAuth, (req: AuthenticatedRequest, res) => {
  const { field_id, crop_id, irrigation_date, water_quantity_liters, frequency_days, next_scheduled_date, method, notes } =
    req.body ?? {};
  const field = db.prepare('SELECT id FROM fields WHERE id = ? AND farmer_id = ?').get(Number(field_id), req.farmer!.id);
  if (!field) {
    res.status(400).json({ error: 'Valid field is required' });
    return;
  }

  const dateStr = String(irrigation_date || new Date().toISOString().slice(0, 10)).slice(0, 10);
  const freq = Math.max(1, Number(frequency_days) || 7);
  const nextDate = next_scheduled_date ? String(next_scheduled_date).slice(0, 10) : addDaysToIso(dateStr, freq);

  const result = db
    .prepare(
      `INSERT INTO irrigations (farmer_id, field_id, crop_id, irrigation_date, water_quantity_liters, frequency_days, next_scheduled_date, method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.farmer!.id,
      Number(field_id),
      crop_id ? Number(crop_id) : null,
      dateStr,
      Number(water_quantity_liters) || 0,
      freq,
      nextDate,
      String(method || 'Drip').trim(),
      String(notes || '').trim()
    );

  const irrigation = db
    .prepare(
      `SELECT i.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM irrigations i JOIN fields fl ON fl.id = i.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = i.crop_id
       WHERE i.id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json({ irrigation });
});

app.put('/api/irrigations/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT id FROM irrigations WHERE id = ? AND farmer_id = ?').get(id, req.farmer!.id);
  if (!existing) {
    res.status(404).json({ error: 'Irrigation record not found' });
    return;
  }

  const { field_id, crop_id, irrigation_date, water_quantity_liters, frequency_days, next_scheduled_date, method, notes } =
    req.body ?? {};
  const dateStr = String(irrigation_date).slice(0, 10);
  const freq = Math.max(1, Number(frequency_days) || 7);
  const nextDate = next_scheduled_date ? String(next_scheduled_date).slice(0, 10) : addDaysToIso(dateStr, freq);

  db.prepare(
    `UPDATE irrigations
     SET field_id = ?, crop_id = ?, irrigation_date = ?, water_quantity_liters = ?, frequency_days = ?, next_scheduled_date = ?, method = ?, notes = ?
     WHERE id = ? AND farmer_id = ?`
  ).run(
    Number(field_id),
    crop_id ? Number(crop_id) : null,
    dateStr,
    Number(water_quantity_liters) || 0,
    freq,
    nextDate,
    String(method || 'Drip').trim(),
    String(notes || '').trim(),
    id,
    req.farmer!.id
  );

  const irrigation = db
    .prepare(
      `SELECT i.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM irrigations i JOIN fields fl ON fl.id = i.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = i.crop_id
       WHERE i.id = ?`
    )
    .get(id);
  res.json({ irrigation });
});

app.delete('/api/irrigations/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM irrigations WHERE id = ? AND farmer_id = ?').run(id, req.farmer!.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Irrigation record not found' });
    return;
  }
  res.json({ success: true });
});

// ================= FERTILIZERS =================
app.get('/api/fertilizers', requireAuth, (req: AuthenticatedRequest, res) => {
  const fertilizers = db
    .prepare(
      `SELECT f.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM fertilizers f
       JOIN fields fl ON fl.id = f.field_id
       JOIN farms fm ON fm.id = fl.farm_id
       LEFT JOIN crops c ON c.id = f.crop_id
       WHERE f.farmer_id = ?
       ORDER BY f.application_date DESC, f.id DESC`
    )
    .all(req.farmer!.id);
  res.json({ fertilizers });
});

app.post('/api/fertilizers', requireAuth, (req: AuthenticatedRequest, res) => {
  const { field_id, crop_id, fertilizer_name, quantity_kg, application_date, notes } = req.body ?? {};
  const field = db.prepare('SELECT id FROM fields WHERE id = ? AND farmer_id = ?').get(Number(field_id), req.farmer!.id);
  if (!field) {
    res.status(400).json({ error: 'Valid field is required' });
    return;
  }
  if (!fertilizer_name || !application_date) {
    res.status(400).json({ error: 'Fertilizer name and application date are required' });
    return;
  }

  const result = db
    .prepare(
      `INSERT INTO fertilizers (farmer_id, field_id, crop_id, fertilizer_name, quantity_kg, application_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.farmer!.id,
      Number(field_id),
      crop_id ? Number(crop_id) : null,
      String(fertilizer_name).trim(),
      Number(quantity_kg) || 0,
      String(application_date).slice(0, 10),
      String(notes || '').trim()
    );

  const fertilizer = db
    .prepare(
      `SELECT f.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM fertilizers f JOIN fields fl ON fl.id = f.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = f.crop_id
       WHERE f.id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json({ fertilizer });
});

app.put('/api/fertilizers/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT id FROM fertilizers WHERE id = ? AND farmer_id = ?').get(id, req.farmer!.id);
  if (!existing) {
    res.status(404).json({ error: 'Fertilizer record not found' });
    return;
  }

  const { field_id, crop_id, fertilizer_name, quantity_kg, application_date, notes } = req.body ?? {};
  db.prepare(
    `UPDATE fertilizers SET field_id = ?, crop_id = ?, fertilizer_name = ?, quantity_kg = ?, application_date = ?, notes = ?
     WHERE id = ? AND farmer_id = ?`
  ).run(
    Number(field_id),
    crop_id ? Number(crop_id) : null,
    String(fertilizer_name).trim(),
    Number(quantity_kg) || 0,
    String(application_date).slice(0, 10),
    String(notes || '').trim(),
    id,
    req.farmer!.id
  );

  const fertilizer = db
    .prepare(
      `SELECT f.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM fertilizers f JOIN fields fl ON fl.id = f.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = f.crop_id
       WHERE f.id = ?`
    )
    .get(id);
  res.json({ fertilizer });
});

app.delete('/api/fertilizers/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM fertilizers WHERE id = ? AND farmer_id = ?').run(id, req.farmer!.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Fertilizer record not found' });
    return;
  }
  res.json({ success: true });
});

// ================= PEST & DISEASE MONITORING =================
app.get('/api/pests', requireAuth, (req: AuthenticatedRequest, res) => {
  const pests = db
    .prepare(
      `SELECT p.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM pest_observations p
       JOIN fields fl ON fl.id = p.field_id
       JOIN farms fm ON fm.id = fl.farm_id
       LEFT JOIN crops c ON c.id = p.crop_id
       WHERE p.farmer_id = ?
       ORDER BY p.observation_date DESC, p.id DESC`
    )
    .all(req.farmer!.id);
  res.json({ pests });
});

function resolveUploadedImageMime(file: Express.Multer.File): string {
  const raw = (file.mimetype || '').trim().toLowerCase();
  if (raw.startsWith('image/')) return raw === 'image/jpg' ? 'image/jpeg' : raw;
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.heic') return 'image/heic';
  if (ext === '.heif') return 'image/heif';
  return 'image/jpeg';
}

app.post('/api/pests/analyze', requireAuth, pestAnalyzeUpload.single('image'), async (req: AuthenticatedRequest, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Please upload a plant photo first.' });
    return;
  }

  const language = normalizeLanguageCode(req.body?.language || req.farmer!.preferred_language);
  const cropName = typeof req.body?.crop_name === 'string' ? req.body.crop_name.trim() : '';
  const rawAcres = Number(req.body?.field_acres);
  const fieldAcres = Number.isFinite(rawAcres) && rawAcres > 0 ? rawAcres : undefined;
  const fieldSoilType = typeof req.body?.soil_type === 'string' ? req.body.soil_type.trim() : undefined;

  try {
    const diagnosis = await analyzePlantPhotoWithGemini({
      imageBase64: req.file.buffer.toString('base64'),
      mimeType: resolveUploadedImageMime(req.file),
      cropName,
      fieldAcres,
      fieldSoilType,
      language,
    });
    res.json({ diagnosis });
  } catch (err) {
    const message = formatGeminiError(err, 'Failed to analyze plant photo.');
    const status = message.includes('GEMINI_API_KEY') || message.includes('API key') ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

app.post('/api/pests', requireAuth, pestImageUpload.single('image'), (req: AuthenticatedRequest, res) => {
  const { field_id, crop_id, observation_date, pest_or_disease, severity, observation_notes, treatment_details, status } =
    req.body ?? {};

  const field = db.prepare('SELECT id FROM fields WHERE id = ? AND farmer_id = ?').get(Number(field_id), req.farmer!.id);
  if (!field) {
    res.status(400).json({ error: 'Valid field is required' });
    return;
  }
  const resolvedPestName =
    typeof pest_or_disease === 'string' && pest_or_disease.trim()
      ? pest_or_disease.trim()
      : req.file
      ? 'Crop Photo Observation'
      : '';

  if (!resolvedPestName || !observation_date) {
    res.status(400).json({ error: 'Pest/disease description or crop photo and observation date are required' });
    return;
  }

  const safeSeverity = ['low', 'medium', 'high'].includes(severity) ? severity : 'medium';
  const safeStatus = ['active', 'treated', 'resolved'].includes(status) ? status : 'active';
  const imageUrl = req.file ? imageStorage.getPublicUrl(req.file.filename) : null;

  const result = db
    .prepare(
      `INSERT INTO pest_observations
       (farmer_id, field_id, crop_id, observation_date, pest_or_disease, severity, observation_notes, treatment_details, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.farmer!.id,
      Number(field_id),
      crop_id ? Number(crop_id) : null,
      String(observation_date).slice(0, 10),
      resolvedPestName,
      safeSeverity,
      String(observation_notes || '').trim(),
      String(treatment_details || '').trim(),
      safeStatus,
      imageUrl
    );

  const pest = db
    .prepare(
      `SELECT p.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM pest_observations p JOIN fields fl ON fl.id = p.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = p.crop_id
       WHERE p.id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json({ pest });
});

app.put('/api/pests/:id', requireAuth, pestImageUpload.single('image'), async (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db
    .prepare('SELECT id, image_url FROM pest_observations WHERE id = ? AND farmer_id = ?')
    .get(id, req.farmer!.id) as { id: number; image_url: string | null } | undefined;

  if (!existing) {
    res.status(404).json({ error: 'Pest observation not found' });
    return;
  }

  const { field_id, crop_id, observation_date, pest_or_disease, severity, observation_notes, treatment_details, status } =
    req.body ?? {};
  const safeSeverity = ['low', 'medium', 'high'].includes(severity) ? severity : 'medium';
  const safeStatus = ['active', 'treated', 'resolved'].includes(status) ? status : 'active';

  let nextImageUrl = existing.image_url;
  if (req.file) {
    await imageStorage.deleteByUrl(existing.image_url);
    nextImageUrl = imageStorage.getPublicUrl(req.file.filename);
  }

  db.prepare(
    `UPDATE pest_observations
     SET field_id = ?, crop_id = ?, observation_date = ?, pest_or_disease = ?, severity = ?, observation_notes = ?, treatment_details = ?, status = ?, image_url = ?
     WHERE id = ? AND farmer_id = ?`
  ).run(
    Number(field_id),
    crop_id ? Number(crop_id) : null,
    String(observation_date).slice(0, 10),
    String(pest_or_disease).trim(),
    safeSeverity,
    String(observation_notes || '').trim(),
    String(treatment_details || '').trim(),
    safeStatus,
    nextImageUrl,
    id,
    req.farmer!.id
  );

  const pest = db
    .prepare(
      `SELECT p.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM pest_observations p JOIN fields fl ON fl.id = p.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = p.crop_id
       WHERE p.id = ?`
    )
    .get(id);
  res.json({ pest });
});

app.delete('/api/pests/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db
    .prepare('SELECT image_url FROM pest_observations WHERE id = ? AND farmer_id = ?')
    .get(id, req.farmer!.id) as { image_url: string | null } | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Pest observation not found' });
    return;
  }

  await imageStorage.deleteByUrl(existing.image_url);
  db.prepare('DELETE FROM pest_observations WHERE id = ? AND farmer_id = ?').run(id, req.farmer!.id);
  res.json({ success: true });
});

// ================= HARVESTS =================
app.get('/api/harvests', requireAuth, (req: AuthenticatedRequest, res) => {
  const harvests = db
    .prepare(
      `SELECT h.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM harvests h
       JOIN fields fl ON fl.id = h.field_id
       JOIN farms fm ON fm.id = fl.farm_id
       LEFT JOIN crops c ON c.id = h.crop_id
       WHERE h.farmer_id = ?
       ORDER BY h.harvest_date DESC, h.id DESC`
    )
    .all(req.farmer!.id);
  res.json({ harvests });
});

app.post('/api/harvests', requireAuth, (req: AuthenticatedRequest, res) => {
  const { field_id, crop_id, status, harvest_date, quantity_kg, quality_grade, notes } = req.body ?? {};
  const field = db.prepare('SELECT id FROM fields WHERE id = ? AND farmer_id = ?').get(Number(field_id), req.farmer!.id);
  if (!field) {
    res.status(400).json({ error: 'Valid field is required' });
    return;
  }
  if (!harvest_date) {
    res.status(400).json({ error: 'Harvest date is required' });
    return;
  }

  const safeStatus = ['planned', 'in_progress', 'completed'].includes(status) ? status : 'planned';

  const result = db
    .prepare(
      `INSERT INTO harvests (farmer_id, field_id, crop_id, status, harvest_date, quantity_kg, quality_grade, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.farmer!.id,
      Number(field_id),
      crop_id ? Number(crop_id) : null,
      safeStatus,
      String(harvest_date).slice(0, 10),
      Number(quantity_kg) || 0,
      String(quality_grade || 'Grade A').trim(),
      String(notes || '').trim()
    );

  if (safeStatus === 'completed' && crop_id) {
    db.prepare(`UPDATE crops SET status = 'harvested', cultivation_stage = 'harvesting' WHERE id = ? AND farmer_id = ?`).run(
      Number(crop_id),
      req.farmer!.id
    );
  }

  const harvest = db
    .prepare(
      `SELECT h.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM harvests h JOIN fields fl ON fl.id = h.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = h.crop_id
       WHERE h.id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json({ harvest });
});

app.put('/api/harvests/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT id FROM harvests WHERE id = ? AND farmer_id = ?').get(id, req.farmer!.id);
  if (!existing) {
    res.status(404).json({ error: 'Harvest record not found' });
    return;
  }

  const { field_id, crop_id, status, harvest_date, quantity_kg, quality_grade, notes } = req.body ?? {};
  const safeStatus = ['planned', 'in_progress', 'completed'].includes(status) ? status : 'planned';

  db.prepare(
    `UPDATE harvests SET field_id = ?, crop_id = ?, status = ?, harvest_date = ?, quantity_kg = ?, quality_grade = ?, notes = ?
     WHERE id = ? AND farmer_id = ?`
  ).run(
    Number(field_id),
    crop_id ? Number(crop_id) : null,
    safeStatus,
    String(harvest_date).slice(0, 10),
    Number(quantity_kg) || 0,
    String(quality_grade || 'Grade A').trim(),
    String(notes || '').trim(),
    id,
    req.farmer!.id
  );

  if (safeStatus === 'completed' && crop_id) {
    db.prepare(`UPDATE crops SET status = 'harvested', cultivation_stage = 'harvesting' WHERE id = ? AND farmer_id = ?`).run(
      Number(crop_id),
      req.farmer!.id
    );
  }

  const harvest = db
    .prepare(
      `SELECT h.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM harvests h JOIN fields fl ON fl.id = h.field_id JOIN farms fm ON fm.id = fl.farm_id LEFT JOIN crops c ON c.id = h.crop_id
       WHERE h.id = ?`
    )
    .get(id);
  res.json({ harvest });
});

app.delete('/api/harvests/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM harvests WHERE id = ? AND farmer_id = ?').run(id, req.farmer!.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Harvest record not found' });
    return;
  }
  res.json({ success: true });
});

// ================= WEATHER MONITORING & ALERTS =================
function getOrCreateWeatherSettings(farmerId: number): WeatherAlertSettings {
  let settings = db
    .prepare(
      'SELECT max_temp_c, min_temp_c, heavy_rain_mm, high_wind_kmh, high_humidity_pct FROM weather_alert_settings WHERE farmer_id = ?'
    )
    .get(farmerId) as WeatherAlertSettings | undefined;

  if (!settings) {
    db.prepare('INSERT INTO weather_alert_settings (farmer_id) VALUES (?)').run(farmerId);
    settings = {
      max_temp_c: 36,
      min_temp_c: 7,
      heavy_rain_mm: 15,
      high_wind_kmh: 25,
      high_humidity_pct: 82,
    };
  }
  return settings;
}

app.get('/api/weather/settings', requireAuth, (req: AuthenticatedRequest, res) => {
  const settings = getOrCreateWeatherSettings(req.farmer!.id);
  res.json({ settings });
});

app.put('/api/weather/settings', requireAuth, (req: AuthenticatedRequest, res) => {
  const { max_temp_c, min_temp_c, heavy_rain_mm, high_wind_kmh, high_humidity_pct } = req.body ?? {};
  getOrCreateWeatherSettings(req.farmer!.id);
  db.prepare(
    `UPDATE weather_alert_settings
     SET max_temp_c = ?, min_temp_c = ?, heavy_rain_mm = ?, high_wind_kmh = ?, high_humidity_pct = ?, updated_at = datetime('now')
     WHERE farmer_id = ?`
  ).run(
    Number(max_temp_c) || 36,
    Number(min_temp_c) ?? 7,
    Number(heavy_rain_mm) || 15,
    Number(high_wind_kmh) || 25,
    Number(high_humidity_pct) || 82,
    req.farmer!.id
  );
  const settings = getOrCreateWeatherSettings(req.farmer!.id);
  res.json({ settings });
});

app.post('/api/weather/alerts/acknowledge', requireAuth, (req: AuthenticatedRequest, res) => {
  const { alertKey } = req.body ?? {};
  if (!alertKey || typeof alertKey !== 'string') {
    res.status(400).json({ error: 'alertKey is required' });
    return;
  }
  db.prepare(
    `INSERT OR IGNORE INTO acknowledged_weather_alerts (farmer_id, alert_key) VALUES (?, ?)`
  ).run(req.farmer!.id, alertKey);
  res.json({ success: true });
});

app.get('/api/weather', requireAuth, async (req: AuthenticatedRequest, res) => {
  const farmerId = req.farmer!.id;
  const settings = getOrCreateWeatherSettings(farmerId);

  const farms = db
    .prepare('SELECT id, name, location, latitude, longitude FROM farms WHERE farmer_id = ? ORDER BY id ASC')
    .all(farmerId) as Array<{
    id: number;
    name: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
  }>;

  const farmerRow = db.prepare('SELECT location FROM farmers WHERE id = ?').get(farmerId) as { location: string } | undefined;

  const targetLocations =
    farms.length > 0
      ? farms
      : [
          {
            id: 0,
            name: 'Primary Farm Region',
            location: farmerRow?.location || 'Guntur, Andhra Pradesh',
            latitude: null,
            longitude: null,
          },
        ];

  const today = new Date().toISOString().slice(0, 10);
  const ackRows = db
    .prepare('SELECT alert_key FROM acknowledged_weather_alerts WHERE farmer_id = ?')
    .all(farmerId) as Array<{ alert_key: string }>;
  const ackSet = new Set(ackRows.map((r) => r.alert_key));

  const fieldsByFarm = db
    .prepare('SELECT id, farm_id, name FROM fields WHERE farmer_id = ?')
    .all(farmerId) as Array<{ id: number; farm_id: number; name: string }>;

  const cropsByField = db
    .prepare(`SELECT field_id, crop_name FROM crops WHERE farmer_id = ? AND status = 'active'`)
    .all(farmerId) as Array<{ field_id: number; crop_name: string }>;

  const dueIrrigations = db
    .prepare(
      `SELECT DISTINCT fl.farm_id, fl.name as field_name
       FROM irrigations i
       JOIN fields fl ON fl.id = i.field_id
       WHERE i.farmer_id = ? AND i.next_scheduled_date <= ?`
    )
    .all(farmerId, addDaysToIso(today, 2)) as Array<{ farm_id: number; field_name: string }>;

  const reports: Array<FarmWeatherReport & { acknowledgedKeys: string[] }> = [];

  for (const farm of targetLocations) {
    const coords = await resolveLocationCoordinates(farm.location, farm.latitude, farm.longitude);
    if (farm.id > 0 && (farm.latitude === null || farm.longitude === null)) {
      db.prepare('UPDATE farms SET latitude = ?, longitude = ? WHERE id = ?').run(coords.latitude, coords.longitude, farm.id);
    }

    const forecast = await fetchForecastForCoords(coords.latitude, coords.longitude);
    const farmFields = fieldsByFarm.filter((fl) => fl.farm_id === farm.id);
    const farmFieldIds = new Set(farmFields.map((fl) => fl.id));
    const activeCropNames = Array.from(
      new Set(cropsByField.filter((c) => farmFieldIds.has(c.field_id)).map((c) => c.crop_name))
    );
    const dueFieldNames = dueIrrigations.filter((d) => d.farm_id === farm.id).map((d) => d.field_name);

    const alerts = evaluateFarmWeatherAlerts({
      farmId: farm.id,
      farmName: farm.name,
      current: forecast.current,
      daily: forecast.daily,
      settings,
      fieldNames: farmFields.map((fl) => fl.name),
      dueIrrigationFieldNames: dueFieldNames,
      activeCropNames,
    });

    reports.push({
      farmId: farm.id,
      farmName: farm.name,
      location: farm.location,
      latitude: coords.latitude,
      longitude: coords.longitude,
      source: forecast.source,
      current: forecast.current,
      daily: forecast.daily,
      alerts,
      acknowledgedKeys: alerts.filter((a) => ackSet.has(a.alertKey)).map((a) => a.alertKey),
    });
  }

  res.json({ reports, settings });
});

// ================= DASHBOARD SUMMARY =================
app.get('/api/dashboard', requireAuth, (req: AuthenticatedRequest, res) => {
  const farmerId = req.farmer!.id;
  const today = new Date().toISOString().slice(0, 10);

  const totalFields = (
    db.prepare('SELECT COUNT(*) as count FROM fields WHERE farmer_id = ?').get(farmerId) as { count: number }
  ).count;

  const activeCrops = (
    db.prepare(`SELECT COUNT(*) as count FROM crops WHERE farmer_id = ? AND status = 'active'`).get(farmerId) as {
      count: number;
    }
  ).count;

  // Latest irrigation per field to accurately reflect current irrigation due count
  const latestIrrigations = db
    .prepare(
      `SELECT i.*, fl.name as field_name, fm.name as farm_name, c.crop_name
       FROM irrigations i
       JOIN fields fl ON fl.id = i.field_id
       JOIN farms fm ON fm.id = fl.farm_id
       LEFT JOIN crops c ON c.id = i.crop_id
       WHERE i.farmer_id = ?
         AND i.id = (
           SELECT i2.id FROM irrigations i2
           WHERE i2.field_id = i.field_id AND i2.farmer_id = i.farmer_id
           ORDER BY i2.irrigation_date DESC, i2.id DESC LIMIT 1
         )
       ORDER BY i.next_scheduled_date ASC`
    )
    .all(farmerId) as Array<{
    id: number;
    field_id: number;
    field_name: string;
    farm_name: string;
    crop_name: string | null;
    next_scheduled_date: string;
    water_quantity_liters: number;
    frequency_days: number;
    method: string;
  }>;

  const irrigationDueList = latestIrrigations.filter((i) => i.next_scheduled_date <= today);
  const upcomingIrrigations = latestIrrigations.slice(0, 6);

  const readyToHarvest = (
    db
      .prepare(
        `SELECT COUNT(*) as count FROM crops
         WHERE farmer_id = ? AND status = 'active' AND cultivation_stage IN ('maturity', 'harvesting')`
      )
      .get(farmerId) as { count: number }
  ).count;

  const irrigationByField = db
    .prepare(
      `SELECT fl.name as field_name, COALESCE(SUM(i.water_quantity_liters), 0) as total_liters
       FROM fields fl
       LEFT JOIN irrigations i ON i.field_id = fl.id
       WHERE fl.farmer_id = ?
       GROUP BY fl.id, fl.name
       ORDER BY total_liters DESC`
    )
    .all(farmerId);

  const productionHistory = db
    .prepare(
      `SELECT strftime('%Y-%m', harvest_date) as month,
              SUM(quantity_kg) as total_kg
       FROM harvests
       WHERE farmer_id = ? AND status IN ('completed', 'in_progress')
       GROUP BY strftime('%Y-%m', harvest_date)
       ORDER BY month ASC`
    )
    .all(farmerId);

  const stageBreakdown = db
    .prepare(
      `SELECT cultivation_stage, COUNT(*) as count
       FROM crops
       WHERE farmer_id = ? AND status = 'active'
       GROUP BY cultivation_stage`
    )
    .all(farmerId);

  // Recent farm activities across all modules
  const recentActivities = db
    .prepare(
      `SELECT * FROM (
         SELECT 'irrigation' as type, i.id, i.irrigation_date as activity_date, fl.name as field_name,
                c.crop_name, (CAST(i.water_quantity_liters AS TEXT) || ' L · ' || i.method) as detail, i.created_at
         FROM irrigations i
         JOIN fields fl ON fl.id = i.field_id
         LEFT JOIN crops c ON c.id = i.crop_id
         WHERE i.farmer_id = ?
         UNION ALL
         SELECT 'fertilizer' as type, f.id, f.application_date as activity_date, fl.name as field_name,
                c.crop_name, (f.fertilizer_name || ' · ' || CAST(f.quantity_kg AS TEXT) || ' kg') as detail, f.created_at
         FROM fertilizers f
         JOIN fields fl ON fl.id = f.field_id
         LEFT JOIN crops c ON c.id = f.crop_id
         WHERE f.farmer_id = ?
         UNION ALL
         SELECT 'pest' as type, p.id, p.observation_date as activity_date, fl.name as field_name,
                c.crop_name, (p.pest_or_disease || ' (' || p.severity || ')') as detail, p.created_at
         FROM pest_observations p
         JOIN fields fl ON fl.id = p.field_id
         LEFT JOIN crops c ON c.id = p.crop_id
         WHERE p.farmer_id = ?
         UNION ALL
         SELECT 'harvest' as type, h.id, h.harvest_date as activity_date, fl.name as field_name,
                c.crop_name, (CAST(h.quantity_kg AS TEXT) || ' kg · ' || h.status) as detail, h.created_at
         FROM harvests h
         JOIN fields fl ON fl.id = h.field_id
         LEFT JOIN crops c ON c.id = h.crop_id
         WHERE h.farmer_id = ?
       )
       ORDER BY activity_date DESC, created_at DESC
       LIMIT 10`
    )
    .all(farmerId, farmerId, farmerId, farmerId);

  res.json({
    summary: {
      totalFields,
      activeCrops,
      irrigationDueCount: irrigationDueList.length,
      readyToHarvestCount: readyToHarvest,
    },
    upcomingIrrigations,
    recentActivities,
    irrigationByField,
    productionHistory,
    stageBreakdown,
  });
});

// ================= GOOGLE MAPS GROUNDED AGRI PLACES =================
app.post('/api/maps/nearby', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { query, farmId, latitude, longitude, language } = req.body ?? {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    res.status(400).json({ error: 'Search query is required' });
    return;
  }

  const farmerId = req.farmer!.id;
  const lang = normalizeLanguageCode(language || req.farmer!.preferred_language);

  let targetLat = typeof latitude === 'number' && Number.isFinite(latitude) ? latitude : null;
  let targetLng = typeof longitude === 'number' && Number.isFinite(longitude) ? longitude : null;
  let locationLabel = 'My Current Location';

  if (targetLat === null || targetLng === null) {
    const farm = farmId
      ? (db
          .prepare('SELECT id, name, location, latitude, longitude FROM farms WHERE id = ? AND farmer_id = ?')
          .get(Number(farmId), farmerId) as
          | { id: number; name: string; location: string; latitude: number | null; longitude: number | null }
          | undefined)
      : (db
          .prepare('SELECT id, name, location, latitude, longitude FROM farms WHERE farmer_id = ? ORDER BY id ASC LIMIT 1')
          .get(farmerId) as
          | { id: number; name: string; location: string; latitude: number | null; longitude: number | null }
          | undefined);

    if (farm) {
      const coords = await resolveLocationCoordinates(farm.location, farm.latitude, farm.longitude);
      targetLat = coords.latitude;
      targetLng = coords.longitude;
      locationLabel = `${farm.name} (${farm.location})`;
    } else {
      const farmerRow = db.prepare('SELECT location FROM farmers WHERE id = ?').get(farmerId) as
        | { location: string }
        | undefined;
      const fallbackLoc = farmerRow?.location?.trim() || 'Guntur, Andhra Pradesh';
      const coords = await resolveLocationCoordinates(fallbackLoc);
      targetLat = coords.latitude;
      targetLng = coords.longitude;
      locationLabel = fallbackLoc;
    }
  }

  try {
    const result = await findNearbyAgriPlaces({
      query: query.trim(),
      locationLabel,
      latitude: targetLat,
      longitude: targetLng,
      language: lang,
    });
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: formatGeminiError(err, 'Unable to search nearby places') });
  }
});

// ================= PUBLIC WEBSITE ROUTES (NO LOGIN REQUIRED) =================
app.get('/api/public/weather', async (req, res) => {
  const rawLocation = typeof req.query.location === 'string' && req.query.location.trim()
    ? req.query.location.trim()
    : 'Guntur, Andhra Pradesh';

  try {
    const coords = await resolveLocationCoordinates(rawLocation);
    const forecast = await fetchForecastForCoords(coords.latitude, coords.longitude);
    const defaultSettings: WeatherAlertSettings = {
      max_temp_c: 36,
      min_temp_c: 7,
      heavy_rain_mm: 15,
      high_wind_kmh: 25,
      high_humidity_pct: 82,
    };
    const alerts = evaluateFarmWeatherAlerts({
      farmId: 0,
      farmName: rawLocation,
      current: forecast.current,
      daily: forecast.daily,
      settings: defaultSettings,
      fieldNames: [],
      dueIrrigationFieldNames: [],
      activeCropNames: [],
    });

    const report: FarmWeatherReport & { acknowledgedKeys: string[] } = {
      farmId: 0,
      farmName: rawLocation,
      location: rawLocation,
      latitude: coords.latitude,
      longitude: coords.longitude,
      source: forecast.source,
      current: forecast.current,
      daily: forecast.daily,
      alerts,
      acknowledgedKeys: [],
    };

    res.json({ reports: [report], settings: defaultSettings });
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : 'Unable to load regional weather' });
  }
});

app.post('/api/public/nearby', async (req, res) => {
  const { query, locationText, latitude, longitude, language } = req.body ?? {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    res.status(400).json({ error: 'Search query is required' });
    return;
  }

  const lang = normalizeLanguageCode(language);
  let targetLat = typeof latitude === 'number' && Number.isFinite(latitude) ? latitude : null;
  let targetLng = typeof longitude === 'number' && Number.isFinite(longitude) ? longitude : null;
  let locationLabel =
    typeof locationText === 'string' && locationText.trim()
      ? locationText.trim()
      : 'Guntur, Andhra Pradesh';

  if (targetLat === null || targetLng === null) {
    const coords = await resolveLocationCoordinates(locationLabel);
    targetLat = coords.latitude;
    targetLng = coords.longitude;
  } else {
    locationLabel = 'My Current Location';
  }

  try {
    const result = await findNearbyAgriPlaces({
      query: query.trim(),
      locationLabel,
      latitude: targetLat,
      longitude: targetLng,
      language: lang,
    });
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: formatGeminiError(err, 'Unable to search nearby places') });
  }
});

app.post('/api/public/plant-doctor/analyze', pestAnalyzeUpload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Please upload a plant photo first.' });
    return;
  }

  const language = normalizeLanguageCode(req.body?.language);
  const cropName = typeof req.body?.crop_name === 'string' ? req.body.crop_name.trim() : '';
  const rawAcres = Number(req.body?.field_acres);
  const fieldAcres = Number.isFinite(rawAcres) && rawAcres > 0 ? rawAcres : undefined;
  const fieldSoilType = typeof req.body?.soil_type === 'string' ? req.body.soil_type.trim() : undefined;

  try {
    const diagnosis = await analyzePlantPhotoWithGemini({
      imageBase64: req.file.buffer.toString('base64'),
      mimeType: resolveUploadedImageMime(req.file),
      cropName,
      fieldAcres,
      fieldSoilType,
      language,
    });
    res.json({ diagnosis });
  } catch (err) {
    const message = formatGeminiError(err, 'Failed to analyze plant photo.');
    const status = message.includes('GEMINI_API_KEY') || message.includes('API key') ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

app.post('/api/public/plant-doctor/translate', async (req, res) => {
  const { diagnosis, targetLanguage } = req.body ?? {};
  if (!diagnosis || typeof diagnosis !== 'object') {
    res.status(400).json({ error: 'Diagnosis payload is required for translation.' });
    return;
  }

  try {
    const translated = await translateDiagnosisWithGemini({
      diagnosis,
      targetLanguage: normalizeLanguageCode(targetLanguage),
    });
    res.json({ diagnosis: translated });
  } catch (err) {
    const message = formatGeminiError(err, 'Unable to translate plant diagnosis.');
    const status = message.includes('GEMINI_API_KEY') || message.includes('API key') ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

app.post('/api/public/plant-doctor/translate-records', async (req, res) => {
  const { items, targetLanguage } = req.body ?? {};
  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'Items array is required for translation.' });
    return;
  }

  try {
    const cleanItems = items
      .slice(0, 30)
      .map((item) => ({
        id: Number(item?.id),
        pest_or_disease: String(item?.pest_or_disease || ''),
        field_name: String(item?.field_name || ''),
        observation_notes: String(item?.observation_notes || ''),
        treatment_details: String(item?.treatment_details || ''),
      }))
      .filter((item) => Number.isFinite(item.id));

    const translations = await translatePestRecordsWithGemini({
      items: cleanItems,
      targetLanguage: normalizeLanguageCode(targetLanguage),
    });
    res.json({ translations });
  } catch (err) {
    const message = formatGeminiError(err, 'Unable to translate farm pest records.');
    const status = message.includes('GEMINI_API_KEY') || message.includes('API key') ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

app.post('/api/public/plant-doctor/speak', async (req, res) => {
  const { text, language } = req.body ?? {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Explanation text is required to read aloud.' });
    return;
  }

  try {
    const audio = await synthesizeSpeechWithGemini({
      text,
      language: normalizeLanguageCode(language),
    });
    res.json(audio);
  } catch (err) {
    const message = formatGeminiError(err, 'Unable to generate spoken audio.');
    const status = message.includes('GEMINI_API_KEY') || message.includes('API key') ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

// ================= API ERROR HANDLER =================
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.path.startsWith('/api/')) {
    next(err);
    return;
  }
  const maybeMulter = err as { code?: string; message?: string };
  if (maybeMulter?.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'Photo file is too large. Please choose a smaller photo under 15 MB.' });
    return;
  }
  const msg = err instanceof Error ? err.message : 'Unexpected server error';
  res.status(400).json({ error: msg });
});

// ================= VITE / STATIC SERVING =================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        next();
        return;
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KrishiField server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
