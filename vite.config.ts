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
    proxy: {
      '/api': {
        target: 'http://localhost:3080',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq, req) => {
            const a = req.headers.authorization;
            const val = Array.isArray(a) ? a[0] : a;
            if (val) proxyReq.setHeader('Authorization', val);
          });
        },
      },
      '/content': {
        target: 'http://localhost:3080',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq, req) => {
            const a = req.headers.authorization;
            const val = Array.isArray(a) ? a[0] : a;
            if (val) proxyReq.setHeader('Authorization', val);
          });
        },
      },
    },
  },
});
