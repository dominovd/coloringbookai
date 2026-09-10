import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { ORIGIN } from './site.config.mjs';

export default defineConfig({
  // Domain lives in site.config.mjs — see the note there.
  site: ORIGIN,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
