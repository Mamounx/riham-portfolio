import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Multi-page static site: the portfolio and the contact card.
  appType: 'mpa',
  build: {
    // Keep bundled JS/CSS under /static so they never clash with /assets images.
    assetsDir: 'static',
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        contact: resolve(root, 'contact-card.html'),
      },
    },
  },
});
