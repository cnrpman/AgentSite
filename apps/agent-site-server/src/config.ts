import path from 'node:path';

export const DIST_ROOT = path.resolve(process.cwd(), 'dist');
export const HOST = process.env.HOST || '0.0.0.0';
export const MARKDOWN_PORT = Number(process.env.MARKDOWN_PORT || process.env.PORT || 3000);
export const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 15000);
export const CONNECTION_TIMEOUT_MS = Number(process.env.CONNECTION_TIMEOUT_MS || 10000);
export const KEEP_ALIVE_TIMEOUT_MS = Number(process.env.KEEP_ALIVE_TIMEOUT_MS || 72000);
export const MAX_PARAMS_LENGTH = Number(process.env.MAX_PARAMS_LENGTH || 256);

export const CACHE_CONTROL = 'public, max-age=60, s-maxage=86400, stale-while-revalidate=604800';
export const HTML_CACHE_CONTROL = 'no-store';
export const VIEWER_FETCH_TIMEOUT_MS = Number(process.env.VIEWER_FETCH_TIMEOUT_MS || 8000);
export const VIEWER_CACHE_TTL_MS = Number(process.env.VIEWER_CACHE_TTL_MS || 30000);
export const VIEWER_CACHE_MAX_ENTRIES = Number(process.env.VIEWER_CACHE_MAX_ENTRIES || 256);

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const MARKDOWN_BASE_URL = normalizeBaseUrl(
  process.env.MARKDOWN_BASE_URL || `http://localhost:${MARKDOWN_PORT}`,
);
