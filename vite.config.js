import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain (www.sgia.works) serves from root, so base is '/'.
// Files placed in `public/` are copied verbatim into `dist/` at build time
// (this is how the CNAME file gets into the deploy artifact).
//
// The site has three .jsx source files (app, pipeline, tweaks-panel) that were
// originally loaded by Babel-standalone. They're now ESM modules under `src/`,
// imported from `src/main.jsx`.
export default defineConfig({
  base: '/',
  plugins: [react()],
  // Vite treats files with .jsx and .js extensions as JSX-capable by default
  // when using @vitejs/plugin-react, so no extra esbuild loader config needed.
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Keep one CSS file and reasonable chunk names — the site is small.
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
