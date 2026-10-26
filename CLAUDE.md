# Undivided Allegiance Site

Repo rules only. Project-wide rules (Cowork, content approval, folder maps, brand voice, campaign state) live in `~/Desktop/undivided-allegiance/CLAUDE.md`; global rules in `~/.claude/CLAUDE.md`. Do not duplicate them here.

## Project

- **Stack**: Astro 6 (`astro ^6.0.8`), TypeScript, Tailwind CSS v4. `@astrojs/mdx` is installed; blog posts are `.md` files.
- **Site**: https://www.undividedallegiance.com (www is canonical; `vercel.json` 301-redirects the bare apex).
- **Deploy**: Vercel, from `main`. GitHub Pages is not used; `.github/workflows/deploy.yml.disabled` stays disabled.
- **Dev**: `npm run dev` (localhost:4321). **Build**: `npm run build` (outputs to `dist/`).
- No test or lint commands.

## Architecture

- `src/pages/`: file-based routing. Pages: `index`, `about`, `book`, `book-landing`, `contact`, `newsletter`, `speaking`, `links`, `podcast`, `video`, `privacy`, `404`, `blog/index`, `blog/[...slug]`.
- `src/components/`: `Header`, `Footer`, `BlogCard`, `EmailCapture`, `ImageCarousel`, `SocialIcon`, `VideoBackground`. `src/layouts/`: `BaseLayout`, `BlogPostLayout`.
- `src/content/blog/`: blog posts (10 today). Schema in `src/content.config.ts`.
- `src/data/site-config.ts`: nav links, social links, site metadata.
- `src/styles/global.css`: Tailwind directives and custom classes (`.author-bio`, `section-padding`).
- `middleware.ts` (repo root): Vercel edge; `book.undividedallegiance.com` rewrites to `/book-landing/`.
- `astro.config.mjs`: sitemap config including the noindex filter.
- `vercel.json`: apex to www redirect; security headers including a Content-Security-Policy. Any new third-party script or endpoint must be added to the CSP or it is blocked.
- Path alias `@/*` maps to `src/*`.
- `public/`: `og-book.png` (book OG image), `free-preview.pdf` (free chapter), `assets/authors/drew-reitzel.webp|.jpg` (headshot), `images/blog/` (featured images), `llms.txt` (AI crawler guidance listing every post; update it when a post is published).

### BaseLayout props

- `ogType` (default `"website"`): `/book/` passes `"book"`, `BlogPostLayout` passes `"article"`.
- `noindex` (default `false`): renders `noindex, nofollow`. Set today on `404`, `book-landing`, `links`, `podcast`, `video`.
- `appendSiteName` (default `true`): `BlogPostLayout` passes `false` so a post's `<title>` has no `| Undivided Allegiance` suffix. Every other page keeps it.
- `<slot name="head" />` before `</head>` for page-specific preloads or head tags; `/book/` uses it to preload the hero cover.
- The Google Search Console verification meta tag, the red announcement bar (links to `/book/`), and both pixels load from BaseLayout on every page. Do not remove the GSC tag.

### Page notes

- `podcast.astro`: Coming Soon placeholder. `video.astro`: single section pointing to YouTube, noindexed until it has real content. `404.astro`: branded, links to Home and `/book/`.
- `speaking.astro`: copy comes from the approved WNTH media kit (bio, three topics, three interview angles). **The H1 "Bring the Message to Your Community" is asserted by the Site Health Monitor; do not change it without updating `ops/scripts/sitehealthmonitor.gs`.**
- `book-landing.astro`: the `book.` subdomain page. Its Order Now buttons link to `/book/`, not Amazon.

## SEO rules

- **Noindex and sitemap move together.** Any page given `noindex` must also be added to the sitemap filter in `astro.config.mjs` (today: `/book-landing/`, `/links/`, `/podcast/`, `/video/`). Sitemap is 18 entries, all indexable.
- **Schema and body URLs use www**, matching the canonical tag BaseLayout builds from `Astro.site`.
- **One H1 per post.** The layout renders the title as H1. Body headings start at `## `.
- **One Article entity per post.** The layout generates Article and BreadcrumbList schema with the post image as ImageObject. Never hand-write `BlogPosting` or `BreadcrumbList` in markdown. A hand-written `FAQPage` block is fine.
- **FAQ schema needs a 120 word answer.** `FAQPage` goes in only where a question-form H2 is followed by at least 120 words. Skip, never pad. Supersedes `03_blog/blog-standards.md` (40 to 80 words). Serves Bing and AI search, not Google.
- **`seo.title` at 60 characters or fewer.** It may differ from the display title, which the H1, Article `headline`, and breadcrumb leaf use.
- **Body links get a page crawled.** Nav and footer do not count. New pages and posts need body-text inbound links.
- **Article-body links open in new tabs** automatically (`[data-article-body]` script in the layout).
- **LCP**: homepage cover and `/book/` hero use `loading="eager"`; `/book/` preloads the hero through the head slot.

## Author bio

`BlogPostLayout.astro` renders the headshot and bio on every post, styled by `.author-bio` in `global.css`. **Never add `## About the Author` to post markdown.**

Bio text: "Drew Reitzel is the author of *You Can't Serve Two Masters* and founder of Undivided Allegiance. His writing focuses on Scripture, divided allegiance, conviction, cultural compromise, repentance, and the call for Christians to live under the authority of Christ with clarity and unwavering loyalty."

## Blog frontmatter (every new post)

```yaml
---
title: "Post Title Here"
excerpt: "On-page subtitle for the card and post header. 1 to 2 sentences."
publishDate: 2026-05-05
updatedDate: 2026-05-05        # optional, only when updating
category: "Scripture"          # Scripture, Church, Culture, Faith, Allegiance
tags: ["tag-one", "tag-two"]
featured: false
draft: false
image:
  src: /images/blog/your-post-slug.png
  alt: What the image actually shows
  # portrait: true           # portrait images only; layout centers at max-w-md
seo:
  title: "SEO title, 60 chars or fewer"
  description: "150 to 160 char snippet with one sourced statistic."
  pageType: "article"
---
```

- `excerpt` is the on-page subtitle, not the SEO description. Write both.
- `image` sets the inline featured image, the post `og:image`, and the Article ImageObject (fallback `/og-book.png`). Target 1200x630, generated with nano-banana.
- `why-you-cant-serve-two-masters-is-the-book-the-church-needs-now.md` has `portrait: true`. Keep it.
- blog-write skill mapping: `description` to `seo.description`, `date` to `publishDate`, `lastUpdated` to `updatedDate`, `coverImage` to `image`; drop `author`.

## Copy rules for this repo

- **Zero em dashes (U+2014)** in `src/` and `public/`. Before committing copy, run `grep -rn $'\u2014' src public` (zsh) and keep it at zero. En dashes in ranges are fine.
- **No membership language.** Never write "join," "membership," or "member" about the church. Write about believers gathering, the gathered church, the body (Hebrews 10:24-25). Drop a statistic worded around joining rather than rewording it.
- **Monitored strings must survive edits.** `ops/scripts/sitehealthmonitor.gs` (PAGES list) asserts text such as the speaking H1, "The Remnant" and `newsletter-form` on `/newsletter/`, "We Would Love to Hear From You" on `/contact/`. Check it before changing a heading.

## Book, funnel, and tracking

- **Book**: "You Can't Serve Two Masters." Kindle ASIN `B0FGY9PL66`, $9.99. Paperback ASIN `B0GYLHSBR3`, $16.99. Two ISBNs are correct: `979-8-2786-09926` (Amazon KDP) and `9798996417605` (IngramSpark print).
- **Order buttons on `src/pages/book.astro`**: the hero shows "Kindle $9.99" and "Paperback $16.99" as text labels with ONE "Order Now" button to the Kindle page. The bottom `#order` section has TWO buttons, "Order on Kindle ($9.99)" and "Order Paperback ($16.99)". All three fire `AddToCart`. Schema marks both formats InStock.
- **Funnel**: announcement bar, homepage hero CTA, and all paid ads point to `/book/`, never to Amazon, so the page captures buyers and non-buyers (signup form). Organic social bios point to `/links/`.
- **Homepage popup** (`index.astro`): "Stand With Us" modal, `sessionStorage` flag `ua_popup_seen`, once per browser session.
- **Meta Pixel** `1289553056416593` in `BaseLayout.astro`. Events: `PageView` site-wide; `ViewContent` on `/book/` load; `AddToCart` on the Amazon order buttons; `Lead` on every signup form.
- **Meta CAPI**: the subscribe worker sends a server-side `Lead` on every successful subscription (email hashed SHA-256; token is a Cloudflare secret).
- **TikTok Pixel** `D7CGUT3C77UA7GO31OO0` in `BaseLayout.astro`. Events: `ViewContent` on `/book/`, `AddToCart` on order buttons, `CompleteRegistration` on every signup form.
- **Meta ad account** `920678984196514`. Live campaign state is in `outputs/daily-snapshot.md` and Ads Manager, never in this file.

## Email capture

All signup forms are native (no Beehiiv iframe) and post to the Cloudflare Worker.

| Form | File | Fields | On success |
|---|---|---|---|
| Homepage popup | `index.astro` | first name + email | "Check your inbox" message; chapter arrives by Beehiiv welcome email only |
| Book page | `book.astro` | email | opens `/free-preview.pdf` (intentional; its copy promises an instant preview) |
| Newsletter page | `newsletter.astro` | first name + email | "Check your inbox." |
| Links hub | `links.astro` | email | "Check your inbox" message; no instant PDF |

- **Worker**: `https://subscribe.drewreitzel.workers.dev`; `GET /health` returns 200 `{ok:true}` or 503.
- **Source**: `~/Desktop/undivided-allegiance/ops/scripts/subscribe-worker.js`, config `ops/scripts/wrangler.toml` (`name = "subscribe"`). Not a git repo; Cloudflare runs the deployed copy. Deploy with `npx wrangler deploy` from `ops/scripts/`; if auth fails, `npx wrangler login`.
- **Already-subscribed check** uses `/subscriptions?email=` (not `/subscribers?email=`, which 404s). Forms show a duplicate-email message.
- **Site Health Monitor** (Apps Script, source `ops/scripts/sitehealthmonitor.gs`) checks 10 pages plus the worker `/health` every 6 hours.

## Layout rules

- **Mobile menu**: the menu `<div>` lives outside `<header>` in `Header.astro` to escape the header's `z-50` stacking context. Overlay `z-[9998]`; close button and hamburger `z-[9999]`.
- **Hero sections**: every interior hero uses `section-padding bg-black` with label + h1 + divider + paragraph. Height comes from content length, not `min-h` or `h-[vh]` (those broke the layout). Never change hero padding or height; adjust content length. The blog hero is separate from the posts grid (`bg-charcoal`).

## Rules

### MANDATORY: Answer questions directly

When Drew asks a question, answer it and do nothing else. No action, file write, or tool call until Drew explicitly says to proceed. A question is not a command.

### MANDATORY: Universal Save Protocol

When Drew signals end of session, asks to save, or asks to "update everything," do all of this in one pass:

1. **Site repo**: update this file if code, architecture, or tracking changed. `npm run build`. `git add` specific files, commit, `git push origin main` immediately.
2. **Memory**: update the relevant memory files and MEMORY.md at `~/.claude/projects/-Users-drewr4/memory/` (`uchg`-locked: unlock, edit, re-lock).
3. **Project file**: update `~/Desktop/undivided-allegiance/CLAUDE.md` for any campaign, conversion, or routing change. Append to `ops/cowork/memory-sync-log.md`. Update `meta-ads-copy.md` for any ad copy, destination, or status change.
4. **Re-lock** every `uchg` file touched (memory files, both CLAUDE.md files, REMNANT_TEMPLATE.md).
5. **Name Drew's action items** for external systems (Buffer, Beehiiv, Ads Manager).

Full protocol in memory file `feedback_end_of_session.md`.

### Content approval

All public-facing content is approved by Drew before publishing. Pipeline, draft locations, and what counts as approval: `~/Desktop/undivided-allegiance/CLAUDE.md` (Content Approval Pipeline). In this repo: never write a draft to `src/content/blog/`; move a post there only after explicit approval, then set `publishDate`, build, and deploy.

### Development rules

- Verify changes with `npm run build` before calling them done.
- Fix bugs autonomously; do not ask, just fix.
- Keep changes minimal and simple. Check in before large refactors.
- If a CSS or layout change does not look right on the first attempt, revert immediately. Do not stack fixes on broken changes.
- Visual changes: one change, deploy, confirm, then next.
