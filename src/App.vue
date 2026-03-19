<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
:root { color-scheme: light; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  background: #f6f4ef;
  color: #1b1b1b;
}
.app { min-height: 100vh; }
a { color: #0a4ea3; }
code { background: #f0e7d8; padding: 2px 6px; border-radius: 4px; }
pre { background: #111827; color: #f9fafb; padding: 16px; border-radius: 8px; overflow-x: auto; }
pre code { background: transparent; padding: 0; }
</style>
