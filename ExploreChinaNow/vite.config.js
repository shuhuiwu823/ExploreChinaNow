import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export the Vite configuration
export default defineConfig({
  // Add the React plugin for handling React files
  plugins: [react()],
  build: {
    outDir: "./dist", // Output directory for built files
  },

  // Configure the development server
  server: {
    cors: true, // Enable Cross-Origin Resource Sharing (CORS)
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy requests from /api to localhost:3000
      },
      '/auth': {
        target: 'http://localhost:4000', // Proxy requests from /auth to localhost:4000
      },
    },
  },

  // Add Vitest configuration for testing
  test: {
    globals: true, // Enable Vitest's global APIs (e.g., `describe`, `test`)
    environment: 'jsdom', // Set the test environment to jsdom (browser-like environment)
    setupFiles: './src/test/setup.js', // Specify a global setup file for initialization
    include: ['**/test/**/*.{test,spec}.{js,ts,jsx,tsx}'], // Define patterns to include test files
  },
});
