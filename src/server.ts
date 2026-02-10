import fs from 'node:fs/promises';
import path from 'node:path';
import fastify, { FastifyReply } from 'fastify';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import { CACHE_CONTROL, DIST_ROOT, HOST, MARKDOWN_PORT } from './config';
import { buildNavigation, computeEtag, renderHeader } from './utils';
import { registerViewer } from './viewer';

const VALID_SEGMENT_RE = /^[a-z0-9-_]+$/;

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

async function resolveDistFile(pathname: string): Promise<string | null> {
  const rel = pathname === '/' ? '' : pathname.replace(/^\//, '').replace(/\/$/, '');
  const dirIndex = rel ? path.join(DIST_ROOT, rel, 'index.md') : path.join(DIST_ROOT, 'index.md');
  if (await fileExists(dirIndex)) return dirIndex;
  if (!rel) return null;
  const pageFile = path.join(DIST_ROOT, `${rel}.md`);
  if (await fileExists(pageFile)) return pageFile;
  return null;
}

async function findDeepestExistingDirIndex(segments: string[]): Promise<number> {
  let acc = '';
  let lastIndex = -1;
  for (let i = 0; i < segments.length; i += 1) {
    acc = acc ? `${acc}/${segments[i]}` : segments[i];
    const dirIndex = path.join(DIST_ROOT, acc, 'index.md');
    if (await fileExists(dirIndex)) lastIndex = i;
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
  if (requestEtag && requestEtag === etag) {
    reply.code(304).send();
    return;
  }
  reply.send(content);
}

async function start(): Promise<void> {
  const app = fastify({ logger: true });

  await app.register(compress, { global: false });
  await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
  });

  app.get('/healthz', async (_request, reply) => {
    reply.header('Content-Type', 'text/plain; charset=utf-8');
    reply.send('OK');
  });

  app.get('/llms.txt', async (request, reply) => {
    const filePath = path.join(DIST_ROOT, 'index.md');
    if (!(await fileExists(filePath))) {
      reply.code(500).send('dist/index.md not found');
      return;
    }
    const content = await fs.readFile(filePath);
    await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, content);
  });

  registerViewer(app);

  app.get('/*', async (request, reply) => {
    const rawUrl = request.raw.url || request.url;
    const parsed = new URL(rawUrl, 'http://localhost');
    const pathname = parsed.pathname;

    if (pathname !== '/' && !pathname.endsWith('/')) {
      reply.redirect(301, `${pathname}/${parsed.search}`);
      return;
    }

    const segments = parsePathSegments(pathname);
    if (!isValidSegments(segments)) {
      const notFound = await renderNotFound(pathname);
      reply.code(404);
      await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, Buffer.from(notFound), 404);
      return;
    }

    const filePath = await resolveDistFile(pathname);
    if (!filePath) {
      const notFound = await renderNotFound(pathname);
      reply.code(404);
      await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, Buffer.from(notFound), 404);
      return;
    }

    const content = await fs.readFile(filePath);
    await sendMarkdown(reply, request.headers['if-none-match'] as string | undefined, content, 200);
  });

  await app.listen({ port: MARKDOWN_PORT, host: HOST });
}

start().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
