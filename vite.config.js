import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/element-plus') || id.includes('@element-plus/icons-vue')) {
            return 'vendor-element';
          }

          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router')) {
            return 'vendor-vue';
          }

          if (id.includes('node_modules/crypto-js')) {
            return 'vendor-crypto';
          }

          if (id.includes('node_modules/qrcode')) {
            return 'vendor-qrcode';
          }

          if (id.includes('node_modules/dayjs') || id.includes('node_modules/highlight.js')) {
            return 'vendor-utils';
          }

          return undefined;
        },
      },
    },
  },
});
