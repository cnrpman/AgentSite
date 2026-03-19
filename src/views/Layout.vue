<template>
  <div class="layout">
    <header class="site-header">
      <nav>
        <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
        <span>·</span>
        <RouterLink to="/soul">Soul</RouterLink>
        <span>·</span>
        <RouterLink to="/memory">Memory</RouterLink>
        <span>·</span>
        <RouterLink to="/tool">Tool</RouterLink>
        <span>·</span>
        <RouterLink to="/skill">Skill</RouterLink>
        <span>·</span>
        <a :href="rawMarkdownUrl" :download="rawMarkdownDownloadFilename" class="nav-link">Raw Markdown</a>
      </nav>
    </header>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getMarkdownUrl } from '@/composables/useContent';

const route = useRoute();

const rawMarkdownUrl = computed(() => {
  const p = route.params.pathMatch;
  const path = p == null ? '' : Array.isArray(p) ? p.join('/') : String(p);
  return getMarkdownUrl(path);
});

const rawMarkdownDownloadFilename = computed(() => {
  const p = route.params.pathMatch;
  const path = p == null ? '' : Array.isArray(p) ? p.join('/') : String(p);
  // getMarkdownUrl already ends with .md (e.g. /content/memory/index.md); avoid leading dash and double .md
  return getMarkdownUrl(path).split('/').filter(Boolean).join('-');
});
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  background: #fff7e8;
  border-bottom: 1px solid #e7dcc3;
  padding: 12px 20px;
}
.site-header nav {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.nav-link { color: #0a4ea3; text-decoration: none; }
.nav-link:hover { text-decoration: underline; }
.main {
  max-width: 960px;
  margin: 24px auto 72px;
  padding: 0 20px;
  line-height: 1.6;
}
</style>
