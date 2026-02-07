import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const site = process.env.DEPLOY_SITE || 'http://localhost:4321';
const base = process.env.DEPLOY_BASE || '/';

export default defineConfig({
  site,
  base,
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    preact({
      compat: true,
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  prefetch: {
    prefetchAll: true,
  },
});
