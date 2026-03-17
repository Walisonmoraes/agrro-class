import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': './',
    },
  },
  server: {
    port: 5173,
    host: true
  }
});
