// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.undividedallegiance.com',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/book-landing/'),
      serialize(item) {
        return { ...item, lastmod: new Date().toISOString().split('T')[0] };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
