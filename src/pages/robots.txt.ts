import type { APIRoute } from 'astro';
import { SITE } from '@/data/site-config';

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

Sitemap: ${SITE.website}/sitemap-index.xml
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
