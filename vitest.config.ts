import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // `e2e/**` holds Playwright specs — they use @playwright/test's runner and
    // must never be collected by Vitest (they fail at import time and starve
    // the worker pool, which used to make real jsdom suites time out).
    exclude: ['**/node_modules/**', '**/dist/**', 'supabase/**', 'e2e/**', '**/*.spec.ts'],
    // Full-route render tests mount whole calculator pages; 15s is not always
    // enough on a cold/loaded worker.
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // jsdom has no real canvas → lottie-web crashes on import. Use a stub
      // for tests; production still gets the real player via LazyLottie.
      'lottie-react': path.resolve(__dirname, './src/test/lottie-react-stub.tsx'),
    },
  },
});