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
- **Site Health Monitor**: Google Apps Script checks all pages + Beehiiv endpoints 4x/day (every 6 hours), emails alerts on failure and recovery

## Book Launch (April 30, 2026)

- **Book**: "You Can't Serve Two Masters" — ISBN 979-8-2786-09926, $9.99 Kindle / $16.99 Print
- **Preorder**: Kindle preorder submitted Mar 31, Amazon link pending (~72 hours)
- **Meta Pixel**: Installed in BaseLayout.astro with placeholder ID `REPLACE_WITH_META_PIXEL_ID` — swap when Events Manager provides real ID
- **TikTok Pixel**: Not yet installed — pending TikTok Ads Manager setup
- **Paid Ads**: Meta + TikTok, $10-20/day budget, 70/30 preorder/email split weeks 1-2, 90/10 weeks 3-4
- **Email**: The Remnant (Beehiiv) — 4 issues planned before launch (Apr 2, 9, 16, 23) + launch day issue Apr 30
- **30-day launch plan**: Approved Mar 31, 3 phases (Foundation → Build → Launch)

## Rules

- Verify changes work by running `npm run build` before calling it done
- Fix bugs autonomously - don't ask, just fix
- Keep changes minimal and simple
- Check in before starting large refactors
