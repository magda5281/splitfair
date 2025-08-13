import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: { port: 3000 },
  test: {
    environment: 'jsdom',
    globals: true, // <-- gives you describe/it/expect globals
    setupFiles: ['./src/tests/setup.js'], // optional
  },
});
