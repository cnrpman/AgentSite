/**
 * Serves protected content and login. Run in production after build, or
 * alongside Vite (proxy /api and /content here) in dev.
 *
 */
import express from 'express';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3080;
const SITE_PASSWORD = (process.env.SITE_PASSWORD || '').trim();
const CONTENT_DIR = path.resolve(process.cwd(), process.env.CONTENT_DIR || 'content');
const COOKIE_NAME = 'agent_site_auth';

/** Cookie value is the same secret as login (simple match; replace with signed token later if you want). */
function verifyCookie(cookieHeader) {
  if (!cookieHeader || !SITE_PASSWORD) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  let got = match[1].trim();
  try {
    got = decodeURIComponent(got);
  } catch {
    return false;
  }
  return got === SITE_PASSWORD;
}

/** Same value as login password; use HTTPS in production. RFC 7235 scheme is case-insensitive. */
function verifyBearerAuth(authHeader) {
  if (!SITE_PASSWORD || typeof authHeader !== 'string') return false;
  const token = authHeader.replace(/^\s*Bearer\s+/, '');
  return token === SITE_PASSWORD;
}

function canReadContent(req) {
  const authHeader = req.get('Authorization');
  return verifyCookie(req.headers.cookie) || verifyBearerAuth(authHeader ?? '');
}

const app = express();
app.use(express.json({ limit: '1kb' }));

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
}

app.post('/api/login', (req, res) => {
  const password = req.body?.password;
  if (!SITE_PASSWORD) {
    res.status(503).json({ error: 'Server auth not configured (SITE_PASSWORD).' });
    return;
  }
  if (password !== SITE_PASSWORD) {
    res.status(401).json({ error: 'Incorrect password.' });
    return;
  }
  res
    .cookie(COOKIE_NAME, SITE_PASSWORD, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })
    .status(200)
    .json({ ok: true });
});

app.post('/api/logout', (_req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ ok: true });
});

app.get('/content/*', async (req, res) => {
  if (!canReadContent(req)) {
    res.status(401).set('Content-Type', 'text/plain').send('Unauthorized');
    return;
  }
  // path like "/content/soul/index.md" -> "soul/index.md"
  const subPath = req.params[0] || '';
  if (subPath.includes('..') || path.isAbsolute(subPath)) {
    res.status(400).send('Bad path');
    return;
  }
  const filePath = path.join(CONTENT_DIR, subPath);
  try {
    const st = await stat(filePath);
    if (!st.isFile()) {
      res.status(404).send('Not found');
      return;
    }
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    createReadStream(filePath).pipe(res);
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).send('Not found');
      return;
    }
    console.error(err);
    res.status(500).send('Error');
  }
});

// Static SPA when dist exists (production or after yarn build)
const distPath = path.join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((_req, res) => res.status(404).send(`Not found: ${distPath}`));
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  if (!SITE_PASSWORD) console.warn('SITE_PASSWORD not set — login will return 503.');
});
