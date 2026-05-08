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
- `BaseLayout.astro` accepts `ogType` prop (default: `"website"`) — pass `ogType="book"` on book page, `ogType="article"` on blog posts if needed
- `BaseLayout.astro` has `<slot name="head" />` just before `</head>` — use to inject page-specific `<link rel="preload">` or other head elements
- `public/og-book.png` — stable book cover OG image (267KB PNG, 1931×2775). Used by /book/ page. Predictable URL regardless of Astro build hashing.
- `public/llms.txt` — AI crawler guidance file. Lists all 7 blog posts, book info, newsletter, key pages, and content use policy. Update when new blog posts are published.

## SEO Infrastructure (as of May 6, 2026)

- **Google Search Console**: Verified via HTML meta tag (`Ss2oF61TWvXnYwq2J2ppQrUax4YMvRrHPagmRBNgQLU`) in `BaseLayout.astro`. Sitemap submitted: `sitemap-index.xml`. Do NOT remove the GSC meta tag from BaseLayout.
- **Article schema**: All 7 blog posts have post-specific Article schema (ImageObject uses per-post image at 1200x630, not global fallback). BreadcrumbList also present on all posts. Eligible for Google rich results.
- **Blog featured images**: All 7 posts have inline featured images (visible in article body). Images at `public/images/blog/`. Article schema, og:image, and inline render all use the post-specific image. See Blog Frontmatter Schema below for the `image` field.
- **og:type**: Blog posts declare `og:type="article"` via `ogType` prop in BlogPostLayout. og:image is post-specific. Book page uses `ogType="book"`. All others default to `website`.
- **GEO readiness**: Scored 74/100 (May 6, 2026). llms.txt live at /llms.txt. All AI crawlers allowed. Inline images + multi-modal signals complete. Remaining ceiling: Wikipedia entity, Reddit presence (off-site builds).
- **LCP optimizations**: Homepage book cover has `loading="eager"`. /book/ hero uses `loading="eager"` + `<link rel="preload">` injected via head slot using `getImage()` to resolve the hashed WebP URL at build time.
- **301 redirect**: Non-www to www redirect is permanent (301) via `vercel.json`.
- **Security headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy set via `vercel.json`.
- **llms.txt**: `public/llms.txt` — lists all 7 blog posts, book, newsletter, key pages, and content use policy. Update when new blog posts are published.

## Author Bio System (added May 8, 2026)

- **Author bio block**: Rendered by `BlogPostLayout.astro` — replaces the old "DR" initials placeholder. Uses real headshot. Consistent across all blog posts automatically.
- **Headshot files**: `public/assets/authors/drew-reitzel.webp` (20KB) and `drew-reitzel.jpg` (48KB), 400x400px, sourced from `03_blog/close_up_professional_portrait.png`.
- **Author bio CSS**: `.author-bio` class in `global.css` — 96px×96px desktop, 72px×72px at max-640px, `aspect-ratio: 1/1`, `object-fit: cover`, `border-radius: 8px`. Overrides global `img { height: auto }` via class-level specificity.
- **Bio text**: "Drew Reitzel is the author of *You Can't Serve Two Masters* and founder of Undivided Allegiance. His writing focuses on Scripture, divided allegiance, conviction, cultural compromise, repentance, and the call for Christians to live under the authority of Christ with clarity and unwavering loyalty."
- **Do NOT add `## About the Author` blocks to markdown content** — the layout handles it automatically. Any hand-written bio blocks in markdown will create duplicates.

## Blog Frontmatter Schema (use this for all new blog posts)

When writing or publishing blog posts for this site, always use this exact frontmatter format. The blog-write skill generates different field names — map them as shown below.

```yaml
---
title: "Post Title Here"
excerpt: "Human-readable subtitle shown on the blog card and post header. 1-2 sentences, no stats required. This is what readers see on the page."
publishDate: 2026-05-05
updatedDate: 2026-05-05        # optional, only include if updating an existing post
category: "Scripture"          # examples: Scripture, Church, Culture, Faith, Allegiance
tags: ["tag-one", "tag-two", "tag-three"]
featured: false
draft: false
seo:
  title: "SEO-Optimized Title — can differ from main title for keyword targeting"
  description: "150-160 char search snippet. Include 1 statistic with source. This is what appears in Google results."
  pageType: "article"
---
```

### Mapping from blog-write skill output
| blog-write field | Site field |
|---|---|
| `description` | move to `seo.description` |
| `title` | keep as `title`; copy to `seo.title` if you want a keyword variant |
| `date` | rename to `publishDate` |
| `lastUpdated` | rename to `updatedDate` (optional) |
| `author` | omit, hardcoded to Drew Reitzel in the layout |
| `coverImage` | omit — use `image` field instead (see below) |
| `tags` | keep as-is |

Write `excerpt` separately. It is the on-page subtitle, not the SEO description.

### Blog featured images (added May 6, 2026)

Every blog post should have an `image` field. This renders as an inline featured image in the article body, sets the post-specific `og:image` for social sharing, and populates the Article schema ImageObject (replacing the old static `og-book.png` fallback).

```yaml
image:
  src: /images/blog/your-post-slug.png
  alt: Descriptive alt text for the image (what it actually shows)
```

- Images live in `public/images/blog/` (served as `/images/blog/filename.png`)
- Target dimensions: 1200x630 (16:9, blog featured image standard); portrait images also work (see note below)
- All 7 posts have images as of May 8, 2026
- Generate new images with nano-banana for each new blog post
- Without `image` field, Article schema falls back to `/og-book.png`
- **Portrait images:** Add `portrait: true` to the `image` field in frontmatter. BlogPostLayout conditionally applies `flex justify-center max-w-md` for portrait, `w-full` for landscape. `book-church-needs.png` is a portrait photo (836x1152) and has `portrait: true` set. All other posts default to full-width landscape. Do not remove `portrait: true` from that post.

## Content Pipeline

- **Google Sheet**: Manages social content queue with Status column (Ready / Scheduled / Posted)
- **Low-Inventory Monitor**: Google Apps Script checks daily (8–9 AM) if Ready rows drop below 5, emails drew.reitzel@undividedallegiance.com
- **Posting Automation**: Zapier + Buffer handle scheduled posting from the sheet
- **Google Drive**: Content documents and filing system for pipeline assets
- **Campaigns**: Two active content campaigns — book promotion ("You Can't Serve Two Masters") and newsletter signup
- **Site Health Monitor**: Google Apps Script checks all pages + Beehiiv endpoints 4x/day (every 6 hours), sends status email every run (subject shows pass/fail at a glance). Script file: `~/Desktop/01_scripts/SiteHealthMonitor.gs`. Contact page check updated to "We Would Love to Hear From You" (Apr 2).

## Book Launch — KINDLE LIVE (April 30, 2026)

- **Book**: "You Can't Serve Two Masters" — ISBN 979-8-2786-09926, $9.99 Kindle / $16.99 Print
- **Kindle**: LIVE as of April 30, 2026 at https://www.amazon.com/dp/B0FGY9PL66
- **Paperback**: ASIN B0GYLHSBR3 ($16.99) — LIVE May 2, 2026 at amazon.com/dp/B0GYLHSBR3
- **Site copy (updated May 2)**: Both formats live. Announcement bar: "Now available in Kindle ($9.99) and Paperback ($16.99)." Homepage hero: "Available now in Kindle and Paperback." Book page hero: single "Order Now" button → scrolls to #order section. Order section: two buttons — "Kindle — $9.99" + "Paperback — $16.99". Schema: InStock for both. Blog: "Also available in paperback for $16.99."
- **Site CTA Strategy**: Ads point to /book/ page (not direct Amazon link) to capture both buyers and non-buyers (newsletter signup).
- **Announcement Bar**: Red bar at top of every page (BaseLayout.astro) linking to **/book/**
- **Homepage Hero CTA**: Points to **/book/**
- **Homepage popup**: "Stand With Us" modal — uses `sessionStorage` flag (`ua_popup_seen`). Shows once per browser session; does not re-trigger on same-session return visits. Clears on tab close.
- **Meta Pixel**: Installed in BaseLayout.astro with ID `1289553056416593`
- **Conversion Events** (added Apr 5):
  - `PageView` — fires site-wide via BaseLayout
  - `ViewContent` — fires on `/book/` page load (book.astro)
  - `AddToCart` — fires on both Amazon order buttons in book.astro (content_name: `YCSTM Kindle Order`), value $9.99 USD
  - `Lead` — fires from site forms on all 3 email signup forms (homepage popup, book page, newsletter page)
- **TikTok Pixel**: Live as of Apr 16, 2026 — ID `D7CGUT3C77UA7GO31OO0` in BaseLayout.astro. Conversion events: `ViewContent` on /book/ load, `AddToCart` on order buttons, `CompleteRegistration` on all 3 email forms.
- **Paid Ads**: Meta + TikTok, $10-20/day budget
- **Email**: The Remnant (Beehiiv) — Issue #3 "Two Masters" scheduled Apr 30 7 AM ET (post ID: 509c8319). Issues #1 + #2 sent.
- **30-day launch plan**: Approved Mar 31, 3 phases (Foundation → Build → Launch)
- **/book/ SEO state (May 5, 2026):** Hero image `loading="eager"` (LCP fix). og:image = `/og-book.png` (book cover). og:type = `book`. Meta description 156 chars with CTA and prices. BreadcrumbList schema added. Two new body sections: "Who This Book Is For" and "What This Book Will Do" (with anonymous "Pastor, Orlando, FL" endorsement — John Dillon's name removed). Page word count ~725.

## Meta Ads — Active Campaigns (as of Apr 1, 2026)

### Account
- **Account**: Undivided Allegiance — ID: 920678984196514
- **Meta Pixel ID**: 1289553056416593
- **Destination (newsletter)**: https://undividedallegiance.com/newsletter/

### Newsletter Campaign — "Newsletter — April 2026"
- **Ad Set**: Newsletter — Pair 01 | Budget: $15/day total | End date: April 4, 2026
- **Objective**: Traffic | Placements: Advantage+ | Geography: United States only
- **Status**: LIVE (published April 1, 2026) — 3-day test ends April 4, then assess

#### Pair 01-A — "You Already Know Something Is Off" (hook image)
- **Image**: `01_newsletter/ads-feed/newsletter-01A-feed.jpg` (1500×1500px). Cinematic variant: `newsletter-01A-feed-cinematic.jpg`
- **Primary Text**: "Something has gone wrong in the American Church. You've felt it. You just haven't had words for it. The Remnant is a newsletter for believers who refuse to pretend otherwise. Join us."
- **Headline**: "You're Not Alone In This"
- **Description**: "The Remnant — Truth for those who are done pretending"
- **CTA**: Subscribe
- **Status**: Processing (published Apr 1)

#### Pair 01-B — "When Scripture Loses Authority..." (call image)
- **Image**: `01_newsletter/ads-feed/newsletter-01B-feed.jpg` (1500×1500px). Cinematic variant: `newsletter-01B-feed-cinematic.jpg`
- **Primary Text**: "The Church isn't losing people to atheism. It's losing them to comfort. If you're tired of sermons that never cost anyone anything — this is for you. Join The Remnant."
- **Headline**: "The Remnant Refuses to Pretend"
- **Description**: "The Remnant — Truth for those who are done pretending"
- **CTA**: Subscribe
- **Status**: Processing (published Apr 1)

### A/B Test Logic
- Both ads run in same ad set — Meta auto-splits the $15/day (~$7.50 each)
- Headlines do different work than image text (image = statement, headline = emotional bridge)
- April 4: review CPR, CTR, cost-per-subscriber → scale winner, pause loser

### Next Pairs Queued
- Pairs 02–09 in `01_newsletter/ads-feed/` (newsletter-NNX-feed.jpg). Story/TikTok format in `01_newsletter/ads-story/`. **Every pair (01–09) now has both A and B cinematic photographic variants** with `-cinematic.jpg` suffix (18 total cinematic files generated 2026-04-07 via Gemini gemini-2.5-flash-image, composited with Playfair Display headlines via Pillow).
- Rotate in weekly after initial A/B assessment

## Mobile Menu

- Mobile menu `<div>` lives OUTSIDE `<header>` in Header.astro to escape the header's stacking context (z-50)
- Menu overlay: `z-[9998]`, close button: `z-[9999]`, hamburger toggle: `z-[9999]`
- Scrollable container with two-column grid layout on landscape mobile
- Dedicated SVG close button (fixed position) separate from hamburger

## Hero Sections

- All interior pages use `section-padding bg-black` with identical structure: label + h1 + divider + paragraph
- Hero height is determined by content length, NOT by min-h/h-[vh] values (those broke the layout)
- Do NOT change hero padding or height values. If heroes look different, adjust content length instead.
- Blog page hero is a separate section from the posts grid (posts are in `section-padding bg-charcoal`)

## Email Capture System (Apr 14, 2026)

Beehiiv iframe on /newsletter/ has been REMOVED and replaced with a native form. All three signup forms route through a Cloudflare Worker proxy to the Beehiiv API.

### Forms
- **Homepage popup** (`index.astro`) — "Stand With Us" modal, 1.5s delay, first name + email, opens `/free-preview.pdf` on success
- **Book page** (`book.astro`) — email only, opens `/free-preview.pdf` on success, resets form
- **Newsletter page** (`newsletter.astro`) — native form (no iframe), first name + email, shows "Check your inbox." on success, resets form

### Cloudflare Worker
- **URL**: `https://subscribe.drewreitzel.workers.dev`
- **Code**: `~/Desktop/undivided-allegiance/ops/scripts/subscribe-worker.js`
- **Already-subscribed check**: uses `/subscriptions?email=` endpoint (NOT `/subscribers?email=` — returns 404)
- All forms fire Meta Pixel `Lead` event and show duplicate-email error message

### Meta Pixel Lead event
- `Lead` now fires from site code on all three forms (popup, book, newsletter)
- Previously was only firing from Beehiiv iframe — update any campaign notes that reference Beehiiv as the Lead event source

### Site Health Monitor
- `SiteHealthMonitor.gs` checks newsletter page for `beehiiv-embed` — needs updating to `newsletter-form`

## Cowork Integration

- **Rules file**: `~/Desktop/undivided-allegiance/CLAUDE.md` — Cowork reads this before every task
- **Outputs folder**: `~/Desktop/undivided-allegiance/outputs/` — all Cowork deliverables go here
- **Source of truth**: Claude Code owns CLAUDE.md, memory files, git, deploys. Cowork owns browser tasks and Meta Ads Manager.
- **Locked files**: Memory files, root CLAUDE.md, and REMNANT_TEMPLATE.md are locked with macOS `uchg` flag. To update: `chflags nouchg <path>` → edit → `chflags uchg <path>`
- **Sync flow**: Cowork logs work to `ops/cowork/memory-sync-log.md` → Claude Code reads it and syncs into CLAUDE.md and memory files
- **If conflict**: Claude Code's version wins

## File System (reorganized April 10, 2026)

- **Desktop**: `01_scripts/`, `02_docs/`, `03_screenshots/`, `04_content/`, `undivided-allegiance/`, `YCSTM_KDP/`
- **Documents**: `01_businesses/` through `09_recipes/`, `_archive/`, `_config/`
- **Project root** (`~/Desktop/undivided-allegiance/`):
  - `01_book-launch/` — book launch assets by platform (images/, reels/, meta/, tiktok/, x/, linkedin/, youtube/, docs/)
  - `02_newsletter/` — newsletter assets by platform (images/, reels/, meta/, tiktok/, x/, linkedin/, youtube/, issues/, templates/)
  - `03_blog/` — blog posts and strategy
  - `04_audiobook/` — manuscript, chapters, production files
  - `ops/` — briefings/, cowork/, seo/, scripts/, social/, production/
  - `undivided-allegiance-site/` — website repo (Claude Code only)
- **Image naming**: `[campaign]-[pair][variant]_[type]_[platform].[ext]` (e.g. `01_book-launch/images/meta-ig-feed/book-02A_feed_meta-ig.jpg`). Types: `feed`, `story`, `cinematic`. Platforms: `meta-ig`, `tiktok`, `x`, `linkedin`, `youtube`.
- **New image rule**: Every new image must be created for ALL platforms: meta-ig-feed, meta-ig-story, tiktok, x, linkedin, youtube
- **Reel naming**: `[campaign]-reel-[NN]-[slug].[ext]` inside campaign/reels/[platform]/
- **Site Health Monitor**: `~/Desktop/01_scripts/SiteHealthMonitor.gs`

## Rules

### MANDATORY: Answer Questions Directly

When Drew asks a question, answer it and do nothing else. Do not execute any action, write any file, or call any tool until Drew explicitly instructs you to proceed. A question is not a command.

### MANDATORY: Universal Save Protocol

When Drew signals end of session, asks to save, or asks to "update everything," execute ALL of the following in one pass without waiting to be asked twice:

1. **Local (site repo)** — Update this file if any code/architecture/ad-strategy changed. Run `npm run build`. `git add` specific files, commit, **`git push` immediately**.
2. **Global (memory)** — Update relevant project memory file(s), MEMORY.md index, feedback/user/reference memories. Files at `~/.claude/projects/-Users-drewr4/memory/` are `uchg`-locked — unlock, edit, re-lock.
3. **Cowork** — Update `~/Desktop/undivided-allegiance/CLAUDE.md` (Cowork rules) for any campaign/conversion/routing change. Append session entry to `~/Desktop/undivided-allegiance/ops/cowork/memory-sync-log.md`. Update `meta-ads-copy.md` for any ad copy/destination/status change.
4. **Re-lock** — All `uchg` files (memory files, both CLAUDE.md files, REMNANT_TEMPLATE.md) must be re-locked after edit.
5. **Push immediately** — Site repo: `git push origin main`. Note any Drew action items for external systems (Buffer, Beehiiv, Ads Manager) explicitly.

Full protocol in memory file `feedback_end_of_session.md`. The cost of redundancy is zero; the cost of missing context is a broken next session.

### MANDATORY: Content Approval Pipeline

**All public-facing content MUST be approved by Drew before publishing.** No exceptions.

#### Draft Locations (staging — NOT live)
- **Blog posts:** `~/Desktop/undivided-allegiance/03_blog/drafts/`
- **Newsletter issues:** `~/Desktop/undivided-allegiance/02_newsletter/issues/`
- **Ad copy (book):** `~/Desktop/undivided-allegiance/01_book-launch/docs/`
- **Ad copy (newsletter):** `~/Desktop/undivided-allegiance/02_newsletter/meta/`

#### Process
1. **Draft** — Write to the appropriate drafts/ folder. NEVER to `src/content/blog/` directly.
2. **Review** — Show the full text to Drew in the conversation.
3. **Approval** — Wait for Drew to explicitly say "approved," "go," "publish it," or "looks good, post it."
4. **Publish** — Only after approval: move to `src/content/blog/`, set publishDate to current date, build, and deploy.

#### What counts as approval
- Explicit: "approved," "go," "post it," "looks good" = publish
- Silence, "let me think," or no response = NOT approved
- "Change X" = edit draft, re-show for review

#### Applies to
- Blog posts
- Newsletter issues
- Ad copy
- Social media posts
- Any content with Drew's name or voice on it

### Development Rules

- Verify changes work by running `npm run build` before calling it done
- Fix bugs autonomously - don't ask, just fix
- Keep changes minimal and simple
- Check in before starting large refactors
- If a CSS/layout change doesn't look right on first attempt, REVERT immediately. Do not stack fixes on top of broken changes.
- For visual changes: make one change, deploy, get confirmation before touching anything else
