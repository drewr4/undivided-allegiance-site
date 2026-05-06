// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

function buildLastmodMap() {
  const map = {
    'https://www.undividedallegiance.com/': '2026-05-06',
    'https://www.undividedallegiance.com/about/': '2026-05-06',
    'https://www.undividedallegiance.com/blog/': '2026-05-06',
    'https://www.undividedallegiance.com/book/': '2026-05-05',
    'https://www.undividedallegiance.com/newsletter/': '2026-04-14',
    'https://www.undividedallegiance.com/contact/': '2026-04-02',
    'https://www.undividedallegiance.com/podcast/': '2026-04-01',
    'https://www.undividedallegiance.com/privacy/': '2026-04-01',
    'https://www.undividedallegiance.com/speaking/': '2026-04-01',
    'https://www.undividedallegiance.com/video/': '2026-04-01',
  };
  const blogDir = resolve('./src/content/blog');
  for (const file of readdirSync(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))) {
    const content = readFileSync(join(blogDir, file), 'utf-8');
    const slug = file.replace(/\.(mdx?)$/, '');
    const updated = content.match(/updatedDate:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    const published = content.match(/publishDate:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    if (updated || published) {
      map[`https://www.undividedallegiance.com/blog/${slug}/`] = updated || published;
    }
  }
  return map;
}

const lastmodMap = buildLastmodMap();

export default defineConfig({
  site: 'https://www.undividedallegiance.com',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/book-landing/'),
      serialize(item) {
        const lastmod = lastmodMap[item.url] || '2026-05-06';
        return { ...item, lastmod };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
