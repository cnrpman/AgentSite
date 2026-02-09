import path from 'node:path';

export const DIST_ROOT = path.resolve(process.cwd(), 'dist');
export const HOST = process.env.HOST || '0.0.0.0';
export const MARKDOWN_PORT = Number(process.env.MARKDOWN_PORT || process.env.PORT || 3000);

export const CACHE_CONTROL = 'public, max-age=60, s-maxage=86400, stale-while-revalidate=604800';
export const HTML_CACHE_CONTROL = 'no-store';

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const MARKDOWN_BASE_URL = normalizeBaseUrl(
  process.env.MARKDOWN_BASE_URL || `http://localhost:${MARKDOWN_PORT}`,
);
