/// <reference types="vitest" />
import { fileURLToPath } from 'url';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react(), vanillaExtractPlugin()],
    server: {
      host: 'localhost',
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8081',
          changeOrigin: true,
        },
        '/ws': {
          target: env.VITE_WS_BASE_URL || 'ws://localhost:8081',
          ws: true,
        },
      },
    },
    preview: {
      host: 'localhost',
      port: 3000,
      open: true,
    },
    build: {
      cssCodeSplit: false,
      target: 'esnext',
      modulePreload: false,
      outDir: 'build',
      assetsDir: '',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      css: false,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/vite-env.d.ts', 'src/shared/types/**/*'],
      },
    },
    resolve: {
      alias: [
        {
          find: '@app',
          replacement: fileURLToPath(new URL('./src/app', import.meta.url)),
        },
        {
          find: '@pages',
          replacement: fileURLToPath(new URL('./src/pages', import.meta.url)),
        },
        {
          find: '@widgets',
          replacement: fileURLToPath(new URL('./src/widgets', import.meta.url)),
        },
        {
          find: '@features',
          replacement: fileURLToPath(new URL('./src/features', import.meta.url)),
        },
        {
          find: '@entities',
          replacement: fileURLToPath(new URL('./src/entities', import.meta.url)),
        },
        {
          find: '@shared',
          replacement: fileURLToPath(new URL('./src/shared', import.meta.url)),
        },
        {
          find: '@api',
          replacement: fileURLToPath(new URL('./src/shared/api', import.meta.url)),
        },
      ],
    },
  };
});
