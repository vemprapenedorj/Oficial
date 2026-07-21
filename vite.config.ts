import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Pre-compress assets into Gzip and Brotli formats
      compression()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssMinify: true,
      modulePreload: {
        resolveDependencies: () => [],
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'animation';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
