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

## Content Pipeline

- **Google Sheet**: Manages social content queue with Status column (Ready / Scheduled / Posted)
- **Low-Inventory Monitor**: Google Apps Script checks daily (8–9 AM) if Ready rows drop below 5, emails drew.reitzel@undividedallegiance.com
- **Posting Automation**: Zapier + Buffer handle scheduled posting from the sheet
- **Google Drive**: Content documents and filing system for pipeline assets
- **Campaigns**: Two active content campaigns — book promotion ("You Can't Serve Two Masters") and newsletter signup

## Rules

- Verify changes work by running `npm run build` before calling it done
- Fix bugs autonomously - don't ask, just fix
- Keep changes minimal and simple
- Check in before starting large refactors
