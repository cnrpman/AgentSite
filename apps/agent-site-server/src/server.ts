import fs from 'node:fs/promises';
import path from 'node:path';
import fastify, { FastifyReply } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import {
  CACHE_CONTROL,
  CONNECTION_TIMEOUT_MS,
  DIST_ROOT,
  HOST,
  KEEP_ALIVE_TIMEOUT_MS,
  MARKDOWN_PORT,
  MAX_PARAMS_LENGTH,
  REQUEST_TIMEOUT_MS,
} from './config';
import { buildNavigation, computeEtag, renderHeader } from './utils';
import { registerViewer } from './viewer';

const VALID_SEGMENT_RE = /^[a-z0-9-_]+$/;
const contentCache = new Map<string, Buffer>();
let routeToFile = new Map<string, string>();
let directoryRoutes = new Set<string>();

function isClientAbortError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const withCode = error as Error & { code?: string };
  return error.message === 'premature close'
    || withCode.code === 'ERR_STREAM_PREMATURE_CLOSE'
    || withCode.code === 'ECONNRESET';
}

function parsePathSegments(pathname: string): string[] {
  if (pathname === '/') return [];
  return pathname.replace(/^\//, '').replace(/\/$/, '').split('/');
}

function isValidSegments(segments: string[]): boolean {
  return segments.every((seg) => VALID_SEGMENT_RE.test(seg));
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function routePathFromRel(rel: string): string {
  if (rel === 'index.md') return '/';
  if (rel.endsWith('/index.md')) return `/${rel.slice(0, -'/index.md'.length)}/`;
  return `/${rel.slice(0, -'.md'.length)}/`;
}

async function listMarkdownFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        out.push(abs);
      }
    }
  }
  await walk(root);
  return out;
}

async function buildRouteIndex(): Promise<void> {
  const nextRouteToFile = new Map<string, string>();
  const nextDirectoryRoutes = new Set<string>();
  const files = await listMarkdownFiles(DIST_ROOT);
  for (const abs of files) {
    const rel = toPosix(path.relative(DIST_ROOT, abs));
    const route = routePathFromRel(rel);
    nextRouteToFile.set(route, abs);
    if (rel === 'index.md' || rel.endsWith('/index.md')) {
      nextDirectoryRoutes.add(route);
    }
  }
  routeToFile = nextRouteToFile;
  directoryRoutes = nextDirectoryRoutes;
}

function resolveDistFile(pathname: string): string | null {
  return routeToFile.get(pathname) || null;
}

async function readContent(filePath: string): Promise<Buffer> {
  const cached = contentCache.get(filePath);
  if (cached) return cached;
  const content = await fs.readFile(filePath);
  contentCache.set(filePath, content);
  return content;
}

async function findDeepestExistingDirIndex(segments: string[]): Promise<number> {
  let lastIndex = -1;
  let route = '/';
  for (let i = 0; i < segments.length; i += 1) {
    route = route === '/' ? `/${segments[i]}/` : `${route}${segments[i]}/`;
    if (directoryRoutes.has(route)) lastIndex = i;
  }
  return lastIndex;
}

async function renderNotFound(pathname: string): Promise<string> {
  const segments = parsePathSegments(pathname);
  const deepestIndex = await findDeepestExistingDirIndex(segments);
  const navigation = buildNavigation(segments, deepestIndex + 1);
  const parentRel = deepestIndex >= 0 ? segments.slice(0, deepestIndex + 1).join('/') : '';
  const parentUrl = parentRel ? `/${parentRel}/` : '/';
  const parentLabel = deepestIndex >= 0 ? segments[deepestIndex] : 'Home';
  const parentLink = `[${parentLabel}](${parentUrl})`;
  const summary = `The requested page was not found. Use navigation above or go up to ${parentLink}.`;

  return renderHeader('Not Found', navigation, summary);
}

async function sendMarkdown(reply: FastifyReply, requestEtag: string | undefined, content: Buffer, status = 200): Promise<void> {
  const etag = computeEtag(content);
  reply.header('Content-Type', 'text/markdown; charset=utf-8');
  reply.header('Cache-Control', CACHE_CONTROL);
  reply.header('ETag', etag);
  reply.code(status);
  reply.send(content);
}

async function start(): Promise<void> {
  await buildRouteIndex();
  if (!routeToFile.has('/')) {
    throw new Error('dist/index.md not found');
  }

  const app = fastify({
    logger: true,
    trustProxy: true,
    requestTimeout: REQUEST_TIMEOUT_MS,
    connectionTimeout: CONNECTION_TIMEOUT_MS,
    keepAliveTimeout: KEEP_ALIVE_TIMEOUT_MS,
    maxParamLength: MAX_PARAMS_LENGTH,
    bodyLimit: 1024 * 1024,
  });

  await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
  });

  app.setErrorHandler((error, request, reply) => {
    if (isClientAbortError(error)) {
      request.log.warn({ err: error }, 'Client disconnected before response completed');
      if (!reply.sent) {
        reply.code(499).send('Client Closed Request');
      }
      return;
    }
    request.log.error({ err: error }, 'Unhandled request error');
    if (!reply.sent) {
      reply.code(500).send('Internal Server Error');
    }
  });

  app.get('/healthz', async (_request, reply) => {
    reply.header('Content-Type', 'text/plain; charset=utf-8');
    reply.send('OK');
  });

  app.get('/llms.txt', async (request, reply) => {
    const filePath = routeToFile.get('/');
    if (!filePath) {
      reply.code(500).send('dist/index.md not found');
      return;
    }
    const content = await readContent(filePath);
    await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, content);
  });

  registerViewer(app);

  app.get('/*', async (request, reply) => {
    const rawUrl = request.raw.url || request.url;
    const parsed = new URL(rawUrl, 'http://localhost');
    const pathname = parsed.pathname;

    if (pathname !== '/' && !pathname.endsWith('/')) {
      reply.redirect(`${pathname}/${parsed.search}`, 301);
      return;
    }

    const segments = parsePathSegments(pathname);
    if (!isValidSegments(segments)) {
      const notFound = await renderNotFound(pathname);
      reply.code(404);
      await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, Buffer.from(notFound), 404);
      return;
    }

    const filePath = resolveDistFile(pathname);
    if (!filePath) {
      const notFound = await renderNotFound(pathname);
      reply.code(404);
      await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, Buffer.from(notFound), 404);
      return;
    }

    const content = await readContent(filePath);
    await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, content, 200);
  });

  await app.listen({ port: MARKDOWN_PORT, host: HOST });

  const shutdown = async (signal: string): Promise<void> => {
    app.log.info({ signal }, 'Shutting down server');
    try {
      await app.close();
      process.exit(0);
    } catch (error) {
      app.log.error({ error }, 'Shutdown failed');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
}

start().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
