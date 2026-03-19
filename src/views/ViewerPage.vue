<template>
  <div class="viewer-page">
    <div v-if="loading" class="meta">Loading…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="viewer-content">
      <h1 v-if="title" class="page-title">{{ title }}</h1>
      <p v-if="summary" class="page-summary">{{ summary }}</p>
      <div class="content prose" v-html="html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useContent } from '@/composables/useContent';

const route = useRoute();
const { html, title, summary, loading, error, load } = useContent();

function pathFromRoute(): string {
  const path = route.path.replace(/^\/+|\/+$/g, '');
  return path;
}

function refresh() {
  load(pathFromRoute());
}

onMounted(refresh);
watch(() => route.path, refresh);
</script>

<style scoped>
.viewer-page { min-height: 40vh; }
.error { color: #b91c1c; }
.meta { color: #5c4b2a; font-size: 0.95rem; }
.page-title { margin: 0 0 0.5rem; font-size: 1.75rem; font-weight: 700; color: #1b1b1b; }
.page-summary { margin: 0 0 1.25rem; font-size: 1.05rem; line-height: 1.5; color: #5c4b2a; }
.prose :deep(table) { border-collapse: collapse; width: 100%; }
.prose :deep(th), .prose :deep(td) { border: 1px solid #e7dcc3; padding: 8px 12px; text-align: left; }
.prose :deep(th) { background: #fff7e8; }
</style>
