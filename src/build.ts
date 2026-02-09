import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { runChecks } from './check';
import { buildNavigation, renderHeader } from './utils';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content');
const DIST_ROOT = path.resolve(process.cwd(), 'dist');
const VALID_SEGMENT_RE = /^[a-z0-9-_]+$/;

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

async function generateDirectoryIndex(node: DirNode, dirs: Map<string, DirNode>): Promise<void> {
  const subdirs = Array.from(node.subdirs).sort();
  const pages = Array.from(node.pages.keys()).sort();

  const dirUrl = dirRelToUrl(node.dirRel);
  const segments = dirUrl === '/' ? [] : dirUrl.replace(/^\//, '').replace(/\/$/, '').split('/');
  const navigation = buildNavigation(segments);

  let parsed: ParsedContent = { body: '' };
  if (node.indexFile) {
    parsed = await readContent(node.indexFile);
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
    '**Subdirectories:** Folders under this directory.',
    renderList(subdirLinks),
    '',
    '**Pages:** Content pages in this directory.',
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

async function generatePage(dirRel: string, slug: string, filePath: string): Promise<void> {
  const parsed = await readContent(filePath);
  const title = parsed.title || slug;
  const summary = parsed.summary || truncateSummary(`Documentation for ${title}.`);
  const body = parsed.body.trim();

  const url = pageRelToUrl(dirRel, slug);
  const segments = url.replace(/^\//, '').replace(/\/$/, '').split('/');
  const navigation = buildNavigation(segments);
  const header = renderHeader(title, navigation, summary);

  const content = body ? `${header}\n${body}` : header;
  const distPath = path.join(DIST_ROOT, dirRel, `${slug}.md`);
  await writeFile(distPath, content);
}

async function main(): Promise<void> {
  const dirs = await buildTree();

  await fs.rm(DIST_ROOT, { recursive: true, force: true });
  await fs.mkdir(DIST_ROOT, { recursive: true });

  const dirList = Array.from(dirs.values()).sort((a, b) => a.dirRel.localeCompare(b.dirRel));
  for (const node of dirList) {
    await generateDirectoryIndex(node, dirs);
  }

  for (const node of dirList) {
    for (const [slug, filePath] of node.pages.entries()) {
      await generatePage(node.dirRel, slug, filePath);
    }
  }

  await runChecks(DIST_ROOT);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
