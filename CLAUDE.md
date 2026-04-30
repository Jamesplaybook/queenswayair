# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # first-time setup
npm run dev          # dev server at http://localhost:8080 (live reload)
npm run build        # production build → _site/
vercel dev           # run dev server + Vercel Functions locally (requires Vercel CLI)
```

**Deploy:** GitHub → Vercel. Connect the repo in the Vercel dashboard; build command and output directory are read from `vercel.json`. Set env vars (`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) in Vercel project settings.

## Architecture

**Static site generator:** Eleventy 3.x with Nunjucks templates. Input is `src/`, output is `_site/`. No React, no JS framework — the deployed site is plain HTML/CSS/JS.

**Content is data-driven:**
- `src/_data/site.js` — single source of truth for NAP (name/address/phone), business hours, schema.org seed data, social links, tracking IDs.
- `src/_data/services.json` — drives both the services index page and 8 individual service pages via Eleventy pagination in `src/services/service.njk`.
- `src/_data/areas.json` — drives 7 service-area pages via `src/service-areas/area.njk`.
- `src/_data/reviews.json`, `faqs.json`, `regions.json` — seed content for the home page sections.
- Blog posts live as Markdown in `src/blog/posts/` with YAML front matter.

**Layouts / templates flow:**
`base.njk` (HTML shell, head, sticky-call-bar) → `page.njk` / `service.njk` / `area.njk` / `post.njk` → individual `.njk` page files.

**CSS architecture:**
- `tokens.css` — CSS custom properties only (colors, type scale, spacing, radii). Change brand here.
- `reset.css` — minimal reset.
- `style.css` — all site styles, BEM-ish naming, ~25 KB total. No Tailwind, no Bootstrap.

**SEO:**
- JSON-LD schema emitted in `<head>` from Nunjucks partials in `src/_includes/schema/`. The `local-business.njk` schema partial renders a full `@graph` block from `site.js`.
- Sitemap auto-generated at `src/sitemap.njk` from `allPages` collection.
- Each page sets `title`, `description`, `canonical`, OG, and Twitter Card via front-matter or layout defaults.

**Forms:**
- All forms POST to `/api/lead` (Vercel Function at `api/lead.js`).
- Forms also work without JavaScript (standard HTML form POST fallback).
- Honeypot field: `<input name="bot-field" tabindex="-1">` — server rejects if populated.

**Images:**
- Add source images to `src/assets/img/`.
- Use the `{% image %}` or `{% heroImage %}` shortcodes (defined in `.eleventy.js`) — they auto-generate AVIF/WebP/JPEG `srcset` via `@11ty/eleventy-img`.

**WordPress migration path:**
Every partial in `src/_includes/partials/` is designed to port 1:1 to a WP `template-parts/*.php` file. `services.json` → WP Custom Post Type `service`. URL slugs are preserved.
