import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true, // Enable Cross-Origin Resource Sharing (CORS)
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy requests starting with /api to localhost:3000
      },
      '/auth': {
        target: 'http://localhost:4000', // Proxy requests starting with /auth to localhost:4000
      },
    },
  },
  // Add Vitest configuration
  test: {
    globals: true, // Enable Vitest's global APIs (e.g., describe, test)
    environment: 'jsdom', // Set the test environment to jsdom
    setupFiles: './src/test/setup.js', // Specify the path to the global setup file
    include: ['**/test/**/*.{test,spec}.{js,ts,jsx,tsx}'], // Specify patterns to match test files
  },
});
