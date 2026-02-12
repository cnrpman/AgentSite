import fs from 'node:fs/promises';
import path from 'node:path';

const DIST_ROOT = path.resolve(process.cwd(), 'dist');

const INTERNAL_LINK_RE = /\]\((\/[^)\s]+)\)/g;
const H1_RE = /^#\s+.+/m;

function toPosix(p: string): string {
  return p.split(path.sep).join('/');
}

function urlFromDistPath(distPath: string): string {
  const rel = toPosix(path.relative(DIST_ROOT, distPath));
  if (rel === 'index.md') return '/';
  if (rel.endsWith('/index.md')) {
    const dirRel = rel.replace(/\/index\.md$/, '');
    return `/${dirRel}/`;
  }
  if (rel.endsWith('.md')) {
    const pageRel = rel.slice(0, -3);
    return `/${pageRel}/`;
  }
  return '';
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

function ensureTrailingSlash(url: string): boolean {
  return url.endsWith('/');
}

function hasMarkdownHeaderContract(content: string): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!H1_RE.test(content)) errors.push('missing H1');
  if (!content.includes('**Navigation:**')) errors.push('missing Navigation');
  if (!content.includes('**Summary:**')) errors.push('missing Summary');
  if (!content.includes('\n---\n')) errors.push('missing separator');
  return { ok: errors.length === 0, errors };
}

function hasDirectorySections(content: string): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!content.includes('**Subdirectories**')) errors.push('missing Subdirectories section');
  if (!content.includes('**Pages**')) errors.push('missing Pages section');
  return { ok: errors.length === 0, errors };
}

async function listMarkdownFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(full);
      }
    }
  }
  await walk(root);
  return files;
}

export async function runChecks(distRoot = DIST_ROOT): Promise<void> {
  const errors: string[] = [];
  let files: string[] = [];
  try {
    files = await listMarkdownFiles(distRoot);
  } catch (err) {
    throw new Error(`Failed to read dist directory at ${distRoot}: ${String(err)}`);
  }

  const urlToFile = new Map<string, string>();
  for (const file of files) {
    const url = urlFromDistPath(file);
    if (!url) continue;
    urlToFile.set(url, file);
  }

  const allLinksByUrl = new Map<string, string[]>();

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const url = urlFromDistPath(file);

    const contract = hasMarkdownHeaderContract(content);
    if (!contract.ok) {
      errors.push(`${url || file}: ${contract.errors.join(', ')}`);
    }

    if (file.endsWith(`${path.sep}index.md`) || file.endsWith('/index.md')) {
      const dirSections = hasDirectorySections(content);
      if (!dirSections.ok) {
        errors.push(`${url || file}: ${dirSections.errors.join(', ')}`);
      }
    }

    const links = parseInternalLinks(content);
    allLinksByUrl.set(url, links);

    for (const link of links) {
      if (link.includes('.md')) {
        errors.push(`${url}: link should not include .md -> ${link}`);
      }
      if (!ensureTrailingSlash(link)) {
        errors.push(`${url}: link missing trailing slash -> ${link}`);
      }
      if (!urlToFile.has(link)) {
        errors.push(`${url}: broken link -> ${link}`);
      }
    }
  }

  const reachable = new Set<string>();
  const queue: string[] = ['/'];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || reachable.has(current)) continue;
    reachable.add(current);
    const links = allLinksByUrl.get(current) || [];
    for (const link of links) {
      if (urlToFile.has(link) && !reachable.has(link)) queue.push(link);
    }
  }

  for (const url of urlToFile.keys()) {
    if (!reachable.has(url)) {
      errors.push(`unreachable from / -> ${url}`);
    }
  }

  if (errors.length > 0) {
    const message = `Content checks failed (${errors.length}):\n- ${errors.join('\n- ')}`;
    throw new Error(message);
  }
}

if (require.main === module) {
  runChecks().then(() => {
    process.stdout.write('OK\n');
  }).catch((err) => {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
}
