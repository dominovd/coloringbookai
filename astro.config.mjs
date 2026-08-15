import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the production domain so canonical URLs and the sitemap
// resolve correctly.
export default defineConfig({
  site: 'https://coloringbookai.net',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
