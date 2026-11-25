import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The app is a static single-page site. HashRouter keeps deep links working
// when the built files are opened from a file:// URL or a plain static host.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});
