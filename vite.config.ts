import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  build: { sourcemap: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    sourcemapIgnoreList: false,
  },
});
