import crypto from 'node:crypto';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { marked } from 'marked';
import { HTML_CACHE_CONTROL, MARKDOWN_BASE_URL } from './config';
import { computeEtag } from './utils';

const MODEL_NAME = 'gpt-5';
const FALLBACK_ENCODING = 'o200k_base';

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const markdownRenderer = new marked.Renderer();
markdownRenderer.link = (href, title, text) => {
  const safeHref = href || '';
  let resolved = safeHref;
  if (safeHref.startsWith('/') && safeHref.endsWith('/')) {
    resolved = `/viewer${safeHref}`;
  }
  const titleAttr = title ? ` title="${escapeHtmlAttr(title)}"` : '';
  return `<a href="${escapeHtmlAttr(resolved)}"${titleAttr}>${text}</a>`;
};
markdownRenderer.image = (href, title, text) => {
  const safeHref = href || '';
  let resolved = safeHref;
  if (safeHref.startsWith('/') && safeHref.endsWith('/')) {
    resolved = `/viewer${safeHref}`;
  }
  const titleAttr = title ? ` title="${escapeHtmlAttr(title)}"` : '';
  const alt = escapeHtmlAttr(text || '');
  return `<img src="${escapeHtmlAttr(resolved)}" alt="${alt}"${titleAttr} />`;
};

marked.setOptions({
  renderer: markdownRenderer,
  mangle: false,
  headerIds: false,
});

type TokenizerState = {
  encode: (text: string) => number[];
  label: string;
  note?: string;
};

let tokenizerState: TokenizerState | null = null;
let tokenizerInitFailed = false;

async function getTokenizer(): Promise<TokenizerState | null> {
  if (tokenizerState || tokenizerInitFailed) return tokenizerState;
  try {
    const mod = await import('tiktoken');
    const encodingForModel = (mod as { encoding_for_model?: (model: string) => { encode: (text: string) => number[] } }).encoding_for_model;
    const getEncoding = (mod as { get_encoding?: (name: string) => { encode: (text: string) => number[] } }).get_encoding;

    if (encodingForModel) {
      try {
        const enc = encodingForModel(MODEL_NAME);
        tokenizerState = { encode: enc.encode.bind(enc), label: MODEL_NAME };
        return tokenizerState;
      } catch {
        // fall through to fallback encoding
      }
    }

    if (getEncoding) {
      try {
        const enc = getEncoding(FALLBACK_ENCODING);
        tokenizerState = { encode: enc.encode.bind(enc), label: MODEL_NAME, note: `fallback ${FALLBACK_ENCODING}` };
        return tokenizerState;
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
  tokenizerInitFailed = true;
  return null;
}

async function countTokens(markdown: string): Promise<string | null> {
  const tokenizer = await getTokenizer();
  if (!tokenizer) return null;
  const count = tokenizer.encode(markdown).length;
  return tokenizer.note ? `${count} (${MODEL_NAME}, ${tokenizer.note})` : `${count} (${MODEL_NAME})`;
}

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Markdown';
}

function wrapHtml(title: string, markdownPath: string, bodyHtml: string, tokenLabel: string | null): string {
  const tokenLine = tokenLabel ? `<span class="meta">Tokens: ${escapeHtmlAttr(tokenLabel)}</span>` : `<span class="meta">Tokens: unavailable</span>`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtmlAttr(title)}</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        background: #f6f4ef;
        color: #1b1b1b;
      }
      header {
        position: sticky;
        top: 0;
        background: #fff7e8;
        border-bottom: 1px solid #e7dcc3;
        padding: 12px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      header a {
        color: #0a4ea3;
        text-decoration: none;
        font-weight: 600;
      }
      main {
        max-width: 960px;
        margin: 24px auto 72px;
        padding: 0 20px;
        line-height: 1.6;
      }
      pre, code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      }
      pre {
        background: #111827;
        color: #f9fafb;
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
      }
      code {
        background: #f0e7d8;
        padding: 2px 6px;
        border-radius: 4px;
      }
      pre code {
        background: transparent;
        padding: 0;
        border-radius: 0;
        color: inherit;
      }
      h1, h2, h3 { line-height: 1.2; }
      a { color: #0a4ea3; }
      ul { padding-left: 20px; }
      .meta { color: #5c4b2a; font-size: 0.9rem; }
    </style>
  </head>
  <body>
    <header>
      <a href="/viewer/">Viewer Home</a>
      <span>·</span>
      <a href="${escapeHtmlAttr(markdownPath)}">Raw Markdown</a>
      <span>·</span>
      ${tokenLine}
    </header>
    <main>
${bodyHtml}
    </main>
  </body>
</html>`;
}

async function sendHtml(reply: FastifyReply, requestEtag: string | undefined, html: string, statusCode = 200): Promise<void> {
  const buffer = Buffer.from(html);
  const etag = computeEtag(buffer);
  reply.code(statusCode);
  reply.header('Content-Type', 'text/html; charset=utf-8');
  reply.header('Cache-Control', HTML_CACHE_CONTROL);
  reply.header('ETag', etag);
  // Always send HTML body; no-store responses should not return 304.
  reply.send(buffer);
}

async function fetchMarkdown(markdownPath: string): Promise<{ status: number; text: string }> {
  const url = `${MARKDOWN_BASE_URL}${markdownPath}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'text/markdown',
      'Accept-Encoding': 'identity',
    },
  });
  const text = await response.text();
  return { status: response.status, text };
}

async function renderMarkdownPath(markdownPath: string, reply: FastifyReply, requestEtag?: string): Promise<void> {
  try {
    const { status, text } = await fetchMarkdown(markdownPath);
    const title = extractTitle(text);
    const bodyHtml = await marked.parse(text);
    const tokenLabel = await countTokens(text);
    const html = wrapHtml(title, markdownPath, bodyHtml, tokenLabel);
    await sendHtml(reply, requestEtag, html, status);
  } catch {
    const html = wrapHtml('Viewer Error', markdownPath, `<p>Failed to fetch markdown from ${escapeHtmlAttr(MARKDOWN_BASE_URL)}.</p>`, null);
    await sendHtml(reply, requestEtag, html, 502);
  }
}

export function registerViewer(app: FastifyInstance): void {
  app.get('/viewer', async (_request, reply) => {
    reply.redirect(301, '/viewer/');
  });

  app.get('/viewer/', async (request, reply) => {
    await renderMarkdownPath('/', reply, request.headers['if-none-match'] as string | undefined);
  });

  app.get('/viewer/*', async (request, reply) => {
    const rawUrl = request.raw.url || request.url;
    const parsed = new URL(rawUrl, 'http://localhost');
    const pathname = parsed.pathname;

    if (!pathname.endsWith('/')) {
      reply.redirect(301, `${pathname}/${parsed.search}`);
      return;
    }

    const markdownPath = pathname.replace(/^\/viewer\//, '/');
    await renderMarkdownPath(markdownPath, reply, request.headers['if-none-match'] as string | undefined);
  });
}
