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
- **Site Health Monitor**: Google Apps Script checks all pages + Beehiiv endpoints 4x/day (every 6 hours), sends status email every run (subject shows pass/fail at a glance). Script file: `~/Desktop/01_scripts/SiteHealthMonitor.gs`. Contact page check updated to "We Would Love to Hear From You" (Apr 2).

## Book Launch (April 30, 2026)

- **Book**: "You Can't Serve Two Masters" — ISBN 979-8-2786-09926, $9.99 Kindle / $16.99 Print
- **Preorder**: Kindle preorder live at https://www.amazon.com/dp/B0FGY9PL66
- **Site CTA Strategy**: Ads point to /book/ page (not direct Amazon link) to capture both buyers (preorder button) and non-buyers (newsletter signup). After Apr 30, update buttons to reflect both Kindle and print being live.
- **Announcement Bar**: Red bar at top of every page (BaseLayout.astro) linking to **/book/** (was Amazon — changed Apr 5 to funnel through book page)
- **Homepage Hero CTA**: Also points to **/book/** (was Amazon — changed Apr 5)
- **Meta Pixel**: Installed in BaseLayout.astro with ID `1289553056416593`
- **Conversion Events** (added Apr 5):
  - `PageView` — fires site-wide via BaseLayout
  - `ViewContent` — fires on `/book/` page load (book.astro)
  - `AddToCart` — fires on both Amazon preorder buttons in book.astro, value $9.99 USD
  - `Lead` — fires from Beehiiv iframe on newsletter signup (configured in Beehiiv dashboard, not site code)
- **TikTok Pixel**: Not yet installed — pending TikTok Ads Manager setup
- **Paid Ads**: Meta + TikTok, $10-20/day budget, 70/30 preorder/email split weeks 1-2, 90/10 weeks 3-4
- **Email**: The Remnant (Beehiiv) — 4 issues planned before launch (Apr 2, 9, 16, 23) + launch day issue Apr 30
- **30-day launch plan**: Approved Mar 31, 3 phases (Foundation → Build → Launch)

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

## Newsletter Embed (Beehiiv)

- Iframe height: 420px for screens <400px, 340px for 400-479px, 291px for 480px+
- Styles duplicated in EmailCapture.astro and newsletter.astro

## Cowork Integration

- **Rules file**: `~/Desktop/undivided-allegiance/COWORK_RULES.md` — Cowork reads this before every task
- **Outputs folder**: `~/Desktop/undivided-allegiance/outputs/` — all Cowork deliverables go here
- **Source of truth**: Claude Code owns CLAUDE.md, memory files, git, deploys. Cowork owns browser tasks and Meta Ads Manager.
- **Locked files**: Memory files, COWORK_RULES.md, and REMNANT_TEMPLATE.md are locked with macOS `uchg` flag. To update: `chflags nouchg <path>` → edit → `chflags uchg <path>`
- **Sync flow**: Cowork logs work to `outputs/memory-sync-log.md` → Claude Code reads it and syncs into CLAUDE.md and memory files
- **If conflict**: Claude Code's version wins

## File System (reorganized April 2, 2026)

- **Desktop**: `01_scripts/`, `02_docs/`, `03_screenshots/`, `04_content/`, `undivided-allegiance/`, `YCSTM_KDP/`
- **Documents**: `01_businesses/` through `09_recipes/`, `_archive/`, `_config/`
- **Project root** (`~/Desktop/undivided-allegiance/`): `01_newsletter/`, `02_book_campaign/`, `outputs/`, `meta-ads-copy.md`, `COWORK_RULES.md`, site repo
- **Site Health Monitor**: `~/Desktop/01_scripts/SiteHealthMonitor.gs` (moved from Desktop root)

## Rules

### MANDATORY: Universal Save Protocol

When Drew signals end of session, asks to save, or asks to "update everything," execute ALL of the following in one pass without waiting to be asked twice:

1. **Local (site repo)** — Update this file if any code/architecture/ad-strategy changed. Run `npm run build`. `git add` specific files, commit, **`git push` immediately**.
2. **Global (memory)** — Update relevant project memory file(s), MEMORY.md index, feedback/user/reference memories. Files at `~/.claude/projects/-Users-drewr4/memory/` are `uchg`-locked — unlock, edit, re-lock.
3. **Cowork** — Update `~/Desktop/undivided-allegiance/CLAUDE.md` (Cowork rules) for any campaign/conversion/routing change. Append session entry to `~/Desktop/undivided-allegiance/outputs/memory-sync-log.md`. Update `meta-ads-copy.md` for any ad copy/destination/status change.
4. **Re-lock** — All `uchg` files (memory files, both CLAUDE.md files, REMNANT_TEMPLATE.md) must be re-locked after edit.
5. **Push immediately** — Site repo: `git push origin main`. Note any Drew action items for external systems (Buffer, Beehiiv, Ads Manager) explicitly.

Full protocol in memory file `feedback_end_of_session.md`. The cost of redundancy is zero; the cost of missing context is a broken next session.

### MANDATORY: Content Approval Pipeline

**All public-facing content MUST be approved by Drew before publishing.** No exceptions.

#### Draft Locations (staging — NOT live)
- **Blog posts:** `~/Desktop/undivided-allegiance/outputs/02_blog/drafts/`
- **Newsletter issues:** `~/Desktop/undivided-allegiance/outputs/04_newsletter/drafts/`
- **Ad copy:** `~/Desktop/undivided-allegiance/outputs/03_campaign/drafts/`

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
