import { ref } from 'vue';
import { marked } from 'marked';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const CONTENT_BASE = '/content';

/**
 * Strip leading and trailing slashes from a path.
 * Used so we can safely join with CONTENT_BASE and "/index.md" or ".md"
 * without producing double slashes (e.g. "/tool/foo" → "tool/foo").
 * If the path is only slashes (e.g. "/" or "///"), returns "".
 */
function removeSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, '') || '';
}

/** Parse frontmatter (title, summary) and body from markdown. Browser-safe, no Node/Buffer. */
function parseFrontmatter(raw: string): { title: string; summary: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { title: '', summary: '', body: raw.trim() };
  const [, yaml, body] = match;
  let title = '';
  let summary = '';
  const titleMatch = yaml.match(/^title:\s*(.+)$/m);
  const summaryMatch = yaml.match(/^summary:\s*(.+)$/m);
  if (titleMatch) title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
  if (summaryMatch) summary = summaryMatch[1].trim().replace(/^['"]|['"]$/g, '');
  return { title, summary, body: body.trim() };
}

/** Resolve path to .md URL. All content lives in folders as index.md. */
export function getMarkdownUrl(path: string): string {
  const normalized = removeSlashes(path);
  if (!normalized) return `${CONTENT_BASE}/index.md`;
  return `${CONTENT_BASE}/${normalized}/index.md`;
}

export function useContent() {
  const store = useStore();
  const router = useRouter();
  const html = ref('');
  const title = ref('');
  const summary = ref('');
  const rawFileUrl = ref('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load(path: string) {
    loading.value = true;
    error.value = null;
    html.value = '';
    title.value = '';
    summary.value = '';
    rawFileUrl.value = '';
    try {
      const url = getMarkdownUrl(path);
      const res = await fetch(url, { credentials: 'include' });
      if (res.status === 401) {
        store.dispatch('logout');
        await router.push({ name: 'Login', query: { redirect: path ? `/${path}` : '/' } });
        return;
      }
      if (!res.ok) {
        error.value = `Failed to load: ${res.status}`;
        return;
      }
      rawFileUrl.value = url;
      const raw = await res.text();
      const { title: t, summary: s, body } = parseFrontmatter(raw);
      title.value = t;
      summary.value = s;
      let out = marked.parse(body) as string;
      // Rewrite internal links to in-app routes so clicking shows the page
      out = out.replace(/ href="(\/[^"]*?)"/g, (_, href) => {
        const linkPath = href === '/' ? '/' : href.replace(/\/$/, '').trim();
        return ` href="${linkPath}"`;
      });
      html.value = out;
      
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  return { html, title, summary, rawFileUrl, loading, error, load };
}
