import fs from 'node:fs/promises';
import path from 'node:path';
import { getTokenCount } from './tokens';

const DIST_ROOT = path.resolve(process.cwd(), 'dist');
const TOKEN_TARGET_MIN = 2000;
const TOKEN_TARGET_MAX = 5000;
const TOKEN_BUDGET_EXEMPT_URLS = new Set(['/skill/']);

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

type TokenBudgetStatus = 'within-target' | 'under-target' | 'over-target' | 'unavailable' | 'exempt';

type TokenBudgetRecord = {
  url: string;
  tokens: number | null;
  status: TokenBudgetStatus;
};

function formatBudgetStatus(status: TokenBudgetStatus): string {
  switch (status) {
    case 'within-target':
      return 'within target';
    case 'under-target':
      return 'under target';
    case 'over-target':
      return 'over target';
    case 'unavailable':
      return 'tokenizer unavailable';
    case 'exempt':
      return 'exempt';
  }
}

function summarizeBudgets(records: TokenBudgetRecord[]): string {
  const within = records.filter((record) => record.status === 'within-target').length;
  const under = records.filter((record) => record.status === 'under-target').length;
  const over = records.filter((record) => record.status === 'over-target').length;
  const unavailable = records.filter((record) => record.status === 'unavailable').length;
  const exempt = records.filter((record) => record.status === 'exempt').length;
  const lines = [
    `Token budget report (target ${TOKEN_TARGET_MIN}-${TOKEN_TARGET_MAX} tokens, fetched markdown):`,
    `- within target: ${within}`,
    `- under target: ${under}`,
    `- over target: ${over}`,
    `- exempt: ${exempt}`,
  ];
  if (unavailable > 0) lines.push(`- tokenizer unavailable: ${unavailable}`);
  for (const record of records) {
    const tokenLabel = record.tokens === null ? 'n/a' : String(record.tokens);
    lines.push(`- ${record.url}: ${tokenLabel} (${formatBudgetStatus(record.status)})`);
  }
  return lines.join('\n');
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
  const tokenBudgets: TokenBudgetRecord[] = [];

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

    const tokens = await getTokenCount(content);
    let status: TokenBudgetStatus;
    if (TOKEN_BUDGET_EXEMPT_URLS.has(url)) {
      status = 'exempt';
    } else if (tokens === null) {
      status = 'unavailable';
    } else if (tokens < TOKEN_TARGET_MIN) {
      status = 'under-target';
    } else if (tokens > TOKEN_TARGET_MAX) {
      status = 'over-target';
    } else {
      status = 'within-target';
    }
    tokenBudgets.push({ url, tokens, status });
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

  process.stdout.write(`${summarizeBudgets(tokenBudgets.sort((a, b) => a.url.localeCompare(b.url)))}\n`);
}

if (require.main === module) {
  runChecks().then(() => {
    process.stdout.write('OK\n');
  }).catch((err) => {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
}
