import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

const DIST_ROOT = path.resolve(process.cwd(), 'dist');
const OUTPUT_ROOT = path.resolve(process.cwd(), 'gh-pages-dist');
const BASE_PATH = normalizeBasePath(process.env.GH_PAGES_BASE_PATH || `/${path.basename(path.resolve(process.cwd(), '..', '..'))}`);

type PageInfo = {
  sourceAbs: string;
  sourceRel: string;
  routePath: string;
  rawRel: string;
  viewerRel: string;
  rawUrl: string;
  viewerUrl: string;
};

function normalizeBasePath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed || trimmed === '/') return '';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading.slice(0, -1) : withLeading;
}

function joinUrl(base: string, rel: string): string {
  if (!base) return `/${rel}`.replace(/\/+/g, '/');
  return `${base}/${rel}`.replace(/\/+/g, '/');
}

function toPosix(p: string): string {
  return p.split(path.sep).join('/');
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
  return out.sort();
}

function routePathFromSourceRel(rel: string): string {
  if (rel === 'index.md') return '/';
  if (rel.endsWith('/index.md')) {
    return `/${rel.slice(0, -'/index.md'.length)}/`;
  }
  return `/${rel.slice(0, -'.md'.length)}/`;
}

function viewerRelFromRoute(routePath: string): string {
  if (routePath === '/') return 'viewer/index.html';
  return `viewer${routePath}index.html`.replace(/^\//, '');
}

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Markdown';
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rewriteRawMarkdownLinks(markdown: string, pagesByRoute: Map<string, PageInfo>): string {
  return markdown.replace(/\]\((\/[^)\s]+)\)/g, (_full, href: string) => {
    const clean = href.split('#')[0].split('?')[0];
    const page = pagesByRoute.get(clean);
    if (!page) return `](${href})`;
    return `](${page.rawUrl})`;
  });
}

function createViewerRenderer(pagesByRoute: Map<string, PageInfo>) {
  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) => {
    const safeHref = href || '';
    const clean = safeHref.split('#')[0].split('?')[0];
    const targetPage = clean.startsWith('/') ? pagesByRoute.get(clean) : undefined;
    const resolved = targetPage ? targetPage.viewerUrl : safeHref;
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a href="${escapeHtml(resolved)}"${titleAttr}>${text}</a>`;
  };
  renderer.image = (href, title, text) => {
    const safeHref = href || '';
    const clean = safeHref.split('#')[0].split('?')[0];
    const targetPage = clean.startsWith('/') ? pagesByRoute.get(clean) : undefined;
    const resolved = targetPage ? targetPage.viewerUrl : safeHref;
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<img src="${escapeHtml(resolved)}" alt="${escapeHtml(text || '')}"${titleAttr} />`;
  };
  return renderer;
}

function wrapHtml(title: string, rawUrl: string, bodyHtml: string): string {
  const viewerHome = joinUrl(BASE_PATH, 'viewer/');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: #f6f4ef; color: #1b1b1b; }
      header { position: sticky; top: 0; background: #fff7e8; border-bottom: 1px solid #e7dcc3; padding: 12px 20px; display: flex; gap: 12px; align-items: center; }
      main { max-width: 960px; margin: 24px auto 72px; padding: 0 20px; line-height: 1.6; }
      a { color: #0a4ea3; }
      pre { background: #111827; color: #f9fafb; padding: 16px; border-radius: 8px; overflow-x: auto; }
      code { background: #f0e7d8; padding: 2px 6px; border-radius: 4px; }
      pre code { background: transparent; padding: 0; }
      .meta { color: #5c4b2a; font-size: 0.95rem; }
    </style>
  </head>
  <body>
    <header>
      <a href="${escapeHtml(viewerHome)}">Viewer Home</a>
      <span>·</span>
      <a href="${escapeHtml(rawUrl)}">Raw Markdown</a>
      <span>·</span>
      <span class="meta">Static GitHub Pages export</span>
    </header>
    <main>
${bodyHtml}
    </main>
  </body>
</html>`;
}

function renderLandingPage(): string {
  const viewerHome = joinUrl(BASE_PATH, 'viewer/');
  const rawHome = joinUrl(BASE_PATH, 'index.md');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Agent Site</title>
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: #f6f4ef; color: #1b1b1b; }
      main { max-width: 840px; margin: 72px auto; padding: 0 20px; }
      .card { background: white; border: 1px solid #e7dcc3; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
      a { color: #0a4ea3; }
      code { background: #f0e7d8; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Agent Site</h1>
      <p>This GitHub Pages export preserves both halves of the project: raw Markdown for agents and a readable viewer for humans.</p>
      <div class="card">
        <h2>Readable Viewer</h2>
        <p>Browse the rendered version at <a href="${escapeHtml(viewerHome)}">${escapeHtml(viewerHome)}</a>.</p>
      </div>
      <div class="card">
        <h2>Raw Markdown</h2>
        <p>Fetch the raw Markdown entrypoint at <a href="${escapeHtml(rawHome)}">${escapeHtml(rawHome)}</a>.</p>
        <p>All internal Markdown links in this export point to other <code>.md</code> files so agents can continue traversing the site directly.</p>
      </div>
    </main>
  </body>
</html>`;
}

async function ensureCleanDir(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function writeFile(target: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, 'utf8');
}

async function main(): Promise<void> {
  const markdownFiles = await listMarkdownFiles(DIST_ROOT);
  const pages = markdownFiles.map((sourceAbs) => {
    const sourceRel = toPosix(path.relative(DIST_ROOT, sourceAbs));
    const routePath = routePathFromSourceRel(sourceRel);
    const rawRel = sourceRel;
    const viewerRel = viewerRelFromRoute(routePath);
    return {
      sourceAbs,
      sourceRel,
      routePath,
      rawRel,
      viewerRel,
      rawUrl: joinUrl(BASE_PATH, rawRel),
      viewerUrl: routePath === '/' ? joinUrl(BASE_PATH, 'viewer/') : joinUrl(BASE_PATH, `viewer${routePath}`.replace(/^\//, '')),
    } satisfies PageInfo;
  });

  const pagesByRoute = new Map(pages.map((page) => [page.routePath, page]));
  await ensureCleanDir(OUTPUT_ROOT);
  const viewerRenderer = createViewerRenderer(pagesByRoute);

  for (const page of pages) {
    const originalMarkdown = await fs.readFile(page.sourceAbs, 'utf8');
    const rawMarkdown = rewriteRawMarkdownLinks(originalMarkdown, pagesByRoute);
    await writeFile(path.join(OUTPUT_ROOT, page.rawRel), rawMarkdown);

    const bodyHtml = await marked.parse(originalMarkdown, { renderer: viewerRenderer, mangle: false, headerIds: false });
    const html = wrapHtml(extractTitle(originalMarkdown), page.rawUrl, bodyHtml);
    await writeFile(path.join(OUTPUT_ROOT, page.viewerRel), html);
  }

  const rootPage = pagesByRoute.get('/');
  if (rootPage) {
    await writeFile(path.join(OUTPUT_ROOT, 'llms.txt'), await fs.readFile(path.join(OUTPUT_ROOT, rootPage.rawRel), 'utf8'));
  }

  await writeFile(path.join(OUTPUT_ROOT, 'index.html'), renderLandingPage());
  await writeFile(path.join(OUTPUT_ROOT, '.nojekyll'), '');
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
  process.exit(1);
});