// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', 
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.API_BASE_URL, 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
