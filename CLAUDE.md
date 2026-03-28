# Undivided Allegiance Site

## Project

- **Stack**: Astro 6, TypeScript, Tailwind CSS v4, MDX
- **Site**: https://undividedallegiance.com
- **Deploy**: GitHub Pages via Actions (push to `main` triggers build)
- **Dev server**: `npm run dev` (localhost:4321)
- **Build**: `npm run build` (outputs to `dist/`)
- **No test or lint commands configured**

## Architecture

- `src/pages/` - File-based routing (Astro pages)
- `src/components/` - Reusable Astro components
- `src/layouts/` - BaseLayout, BlogPostLayout
- `src/content/blog/` - MDX blog posts with frontmatter schema
- `src/data/site-config.ts` - Nav links, social links, metadata
- `src/styles/global.css` - Tailwind directives
- `middleware.ts` - Vercel edge: `book.` subdomain rewrites to `/book-landing/`
- Path alias: `@/*` maps to `src/*`

## Rules

- Verify changes work by running `npm run build` before calling it done
- Fix bugs autonomously - don't ask, just fix
- Keep changes minimal and simple
- Check in before starting large refactors
