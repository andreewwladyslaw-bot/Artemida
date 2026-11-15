import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: { environment: 'jsdom', globals: true },
    // The backend URL is opt-in. With no backend, the UI loads but cannot authenticate.
    server: {
      proxy: env.VITE_API_TARGET
        ? {
            '/api': {
              target: env.VITE_API_TARGET,
              changeOrigin: true,
              rewrite: (path: string) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
  };
});
