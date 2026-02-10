import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { runChecks } from './check';
import { buildNavigation, renderHeader } from './utils';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content');
const DIST_ROOT = path.resolve(process.cwd(), 'dist');
const VALID_SEGMENT_RE = /^[a-z0-9-_]+$/;
const INTERNAL_LINK_RE = /\]\((\/[^)\s]+)\)/g;

type DirNode = {
  dirRel: string;
  indexFile?: string;
  pages: Map<string, string>;
  subdirs: Set<string>;
};

type ParsedContent = {
  title?: string;
  summary?: string;
  body: string;
};

function toPosix(p: string): string {
  return p.split(path.sep).join('/');
}

function joinRel(dirRel: string, name: string): string {
  return dirRel ? `${dirRel}/${name}` : name;
}

function dirRelToUrl(dirRel: string): string {
  if (!dirRel) return '/';
  return `/${dirRel}/`;
}

function pageRelToUrl(dirRel: string, slug: string): string {
  const rel = joinRel(dirRel, slug);
  return `/${rel}/`;
}

function truncateSummary(text: string, max = 240): string {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, Math.max(0, max - 3))}...`;
}

function parseFrontmatterValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  return undefined;
}

function extractTitleFromBody(body: string): { title?: string; body: string } {
  const lines = body.split(/\r?\n/);
  let idx = 0;
  while (idx < lines.length && lines[idx].trim() === '') idx += 1;
  if (idx < lines.length && lines[idx].startsWith('# ')) {
    const title = lines[idx].slice(2).trim();
    const rest = [...lines.slice(0, idx), ...lines.slice(idx + 1)].join('\n').trim();
    return { title, body: rest };
  }
  return { body: body.trim() };
}

function stripNavSections(body: string): string {
  let result = body;
  // Remove legacy heading-based blocks
  result = result.replace(/^## Subdirectories\\n[\\s\\S]*?(?=^## Pages\\n)/gm, '');
  result = result.replace(/^## Pages\\n[\\s\\S]*?(?=^## |\\Z)/gm, '');
  // Remove label-based blocks
  result = result.replace(/^\\*\\*Subdirectories:\\*\\*.*\\n(?:- .*(?:\\n|$))+/gm, '');
  result = result.replace(/^\\*\\*Pages:\\*\\*.*\\n(?:- .*(?:\\n|$))+/gm, '');
  return result.trim();
}

function parseInternalLinks(markdown: string): string[] {
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = INTERNAL_LINK_RE.exec(markdown)) !== null) {
    const url = match[1];
    if (url.startsWith('/')) links.push(url);
  }
  return links;
}

function normalizeLink(url: string): string {
  const trimmed = url.split('#')[0].split('?')[0];
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}

async function readContent(filePath: string): Promise<ParsedContent> {
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = matter(raw);
  const frontmatterTitle = parseFrontmatterValue(parsed.data?.title);
  const frontmatterSummary = parseFrontmatterValue(parsed.data?.summary);
  const extracted = extractTitleFromBody(parsed.content);
  return {
    title: frontmatterTitle || extracted.title,
    summary: frontmatterSummary,
    body: extracted.body,
  };
}

function ensureValidSegment(segment: string, context: string): void {
  if (!VALID_SEGMENT_RE.test(segment)) {
    throw new Error(`Invalid path segment "${segment}" in ${context}. Use [a-z0-9-_].`);
  }
}

async function buildTree(): Promise<Map<string, DirNode>> {
  const dirs = new Map<string, DirNode>();

  function getNode(dirRel: string): DirNode {
    const existing = dirs.get(dirRel);
    if (existing) return existing;
    const node: DirNode = { dirRel, pages: new Map(), subdirs: new Set() };
    dirs.set(dirRel, node);
    return node;
  }

  async function walk(dirAbs: string, dirRel: string): Promise<void> {
    const node = getNode(dirRel);
    const entries = await fs.readdir(dirAbs, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dirAbs, entry.name);
      if (entry.isDirectory()) {
        ensureValidSegment(entry.name, full);
        node.subdirs.add(entry.name);
        const childRel = joinRel(dirRel, entry.name);
        await walk(full, childRel);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const slug = entry.name.slice(0, -3);
        ensureValidSegment(slug, full);
        if (slug === 'index') {
          node.indexFile = full;
        } else {
          node.pages.set(slug, full);
        }
      }
    }
  }

  await walk(CONTENT_ROOT, '');
  return dirs;
}

function buildKnownUrls(dirs: Map<string, DirNode>): Set<string> {
  const urls = new Set<string>();
  for (const node of dirs.values()) {
    urls.add(dirRelToUrl(node.dirRel));
    for (const slug of node.pages.keys()) {
      urls.add(pageRelToUrl(node.dirRel, slug));
    }
  }
  return urls;
}

function buildDirectorySummary(subdirs: string[], pages: string[], dirRel: string): string {
  const base = `This directory contains ${subdirs.length} subdirectories and ${pages.length} pages.`;
  let suggestion = '';
  if (pages.includes('overview')) {
    suggestion = `[overview](${pageRelToUrl(dirRel, 'overview')})`;
  } else if (pages.length > 0) {
    suggestion = `[${pages[0]}](${pageRelToUrl(dirRel, pages[0])})`;
  } else if (subdirs.length > 0) {
    suggestion = `[${subdirs[0]}](${dirRelToUrl(joinRel(dirRel, subdirs[0]))})`;
  }
  const extra = suggestion ? ` Start with ${suggestion}.` : '';
  return truncateSummary(`${base}${extra}`);
}

async function writeFile(targetPath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content.trimEnd() + '\n', 'utf8');
}

function renderList(items: string[]): string {
  if (items.length === 0) return '- (none)';
  return items.map((item) => `- ${item}`).join('\n');
}

type BacklinkState = {
  backlinks: Map<string, Set<string>>;
  sourceTitles: Map<string, string>;
  pageUrls: Set<string>;
  knownUrls: Set<string>;
};

function recordLinks(sourceUrl: string, body: string, state: BacklinkState): void {
  const links = parseInternalLinks(body);
  for (const rawLink of links) {
    const link = normalizeLink(rawLink);
    if (!link.endsWith('/')) continue;
    if (link.includes('.md')) continue;
    if (!state.knownUrls.has(link)) continue;
    if (link === sourceUrl) continue;
    const set = state.backlinks.get(link) || new Set<string>();
    set.add(sourceUrl);
    state.backlinks.set(link, set);
  }
}

async function generateDirectoryIndex(
  node: DirNode,
  dirs: Map<string, DirNode>,
  getParsed: (filePath: string) => Promise<ParsedContent>,
  _state: BacklinkState,
): Promise<void> {
  const subdirs = Array.from(node.subdirs).sort();
  const pages = Array.from(node.pages.keys()).sort();

  const dirUrl = dirRelToUrl(node.dirRel);
  const segments = dirUrl === '/' ? [] : dirUrl.replace(/^\//, '').replace(/\/$/, '').split('/');
  const navigation = buildNavigation(segments);

  let parsed: ParsedContent = { body: '' };
  if (node.indexFile) {
    parsed = await getParsed(node.indexFile);
  }

  const title = parsed.title || (node.dirRel || 'Home');
  const summary = parsed.summary || buildDirectorySummary(subdirs, pages, node.dirRel);

  let body = parsed.body.trim();
  if (body) {
    body = stripNavSections(body);
  }

  const subdirLinks = subdirs.map((name) => `[${name}](${dirRelToUrl(joinRel(node.dirRel, name))})`);
  const pageLinks = pages.map((name) => `[${name}](${pageRelToUrl(node.dirRel, name)})`);

  const navBlock = [
    '**Subdirectories** under this directory:',
    renderList(subdirLinks),
    '',
    '**Pages** in this directory:',
    renderList(pageLinks),
  ].join('\n');

  const header = renderHeader(title, navigation, summary);
  const content = body ? `${header}\n${body}\n\n${navBlock}` : `${header}\n${navBlock}`;

  const distPath = node.dirRel ? path.join(DIST_ROOT, node.dirRel, 'index.md') : path.join(DIST_ROOT, 'index.md');
  await writeFile(distPath, content);

  for (const subdir of subdirs) {
    if (!dirs.has(joinRel(node.dirRel, subdir))) {
      dirs.set(joinRel(node.dirRel, subdir), {
        dirRel: joinRel(node.dirRel, subdir),
        indexFile: undefined,
        pages: new Map(),
        subdirs: new Set(),
      });
    }
  }
}

async function generatePage(
  dirRel: string,
  slug: string,
  filePath: string,
  getParsed: (filePath: string) => Promise<ParsedContent>,
  state: BacklinkState,
): Promise<void> {
  const parsed = await getParsed(filePath);
  const title = parsed.title || slug;
  const summary = parsed.summary || truncateSummary(`Documentation for ${title}.`);
  const url = pageRelToUrl(dirRel, slug);
  const body = parsed.body.trim();

  const segments = url.replace(/^\//, '').replace(/\/$/, '').split('/');
  const navigation = buildNavigation(segments);
  const header = renderHeader(title, navigation, summary);

  let backlinksBlock = '';
  const backlinks = state.backlinks.get(url);
  if (backlinks && backlinks.size > 0 && state.pageUrls.has(url)) {
    const items = Array.from(backlinks).sort().map((sourceUrl) => {
      const label = state.sourceTitles.get(sourceUrl) || sourceUrl;
      return `- [${label}](${sourceUrl})`;
    });
    // Backlinks section format can be adjusted here.
    backlinksBlock = `**Backlinks:** Pages linking here.\n${items.join('\n')}`;
  }

  const content = body
    ? `${header}\n${body}${backlinksBlock ? `\n\n${backlinksBlock}` : ''}`
    : `${header}${backlinksBlock ? `\n${backlinksBlock}` : ''}`;
  const distPath = path.join(DIST_ROOT, dirRel, `${slug}.md`);
  await writeFile(distPath, content);
}

async function main(): Promise<void> {
  const dirs = await buildTree();

  await fs.rm(DIST_ROOT, { recursive: true, force: true });
  await fs.mkdir(DIST_ROOT, { recursive: true });

  const dirList = Array.from(dirs.values()).sort((a, b) => a.dirRel.localeCompare(b.dirRel));
  const parsedCache = new Map<string, ParsedContent>();
  const getParsed = async (filePath: string): Promise<ParsedContent> => {
    const cached = parsedCache.get(filePath);
    if (cached) return cached;
    const parsed = await readContent(filePath);
    parsedCache.set(filePath, parsed);
    return parsed;
  };

  const knownUrls = buildKnownUrls(dirs);
  const backlinks: Map<string, Set<string>> = new Map();
  const sourceTitles = new Map<string, string>();
  const pageUrls = new Set<string>();
  const state: BacklinkState = {
    backlinks,
    sourceTitles,
    pageUrls,
    knownUrls,
  };

  for (const node of dirList) {
    const dirUrl = dirRelToUrl(node.dirRel);
    sourceTitles.set(dirUrl, node.dirRel || 'Home');
    if (node.indexFile) {
      const parsed = await getParsed(node.indexFile);
      const title = parsed.title || (node.dirRel || 'Home');
      sourceTitles.set(dirUrl, title);
      const body = stripNavSections(parsed.body.trim());
      if (body) recordLinks(dirUrl, body, state);
    }
    for (const [slug, filePath] of node.pages.entries()) {
      const pageUrl = pageRelToUrl(node.dirRel, slug);
      pageUrls.add(pageUrl);
      const parsed = await getParsed(filePath);
      sourceTitles.set(pageUrl, parsed.title || slug);
      const body = parsed.body.trim();
      if (body) recordLinks(pageUrl, body, state);
    }
  }

  for (const node of dirList) {
    await generateDirectoryIndex(node, dirs, getParsed, state);
  }

  for (const node of dirList) {
    for (const [slug, filePath] of node.pages.entries()) {
      await generatePage(node.dirRel, slug, filePath, getParsed, state);
    }
  }

  await runChecks(DIST_ROOT);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
