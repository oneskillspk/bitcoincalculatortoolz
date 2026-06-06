import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'supabase/**'],
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