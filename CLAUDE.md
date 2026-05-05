# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # first-time setup
npm run dev          # dev server at http://localhost:8080 (live reload)
npm run build        # production build → _site/
npm run build:prod   # same, with NODE_ENV=production
vercel dev           # run dev server + Vercel Functions locally (requires Vercel CLI)
```

**Deploy:** GitHub → Vercel. Connect the repo in the Vercel dashboard; build command and output directory are read from `vercel.json`. Set env vars (`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) in Vercel project settings.

## Architecture

**Static site generator:** Eleventy 3.x with Nunjucks templates. Input is `src/`, output is `_site/`. No React, no JS framework — the deployed site is plain HTML/CSS/JS.

**Content is data-driven:**
- `src/_data/site.js` — single source of truth for NAP (name/address/phone), business hours, schema.org seed data, social links, tracking IDs.
- `src/_data/nav.js` — drives both the desktop and mobile nav menus; add/reorder items here.
- `src/_data/services.json` — drives both the services index page and individual service pages via Eleventy pagination in `src/services/service.njk`.
- `src/_data/areas.json` — drives service-area pages via `src/service-areas/area.njk`.
- `src/_data/reviews.json`, `faqs.json`, `regions.json` — seed content for the home page sections.
- Blog posts live as Markdown in `src/blog/posts/` with YAML front matter.

**Eleventy collections** (available in all templates as globals):
- `collections.posts` — blog posts, reverse-chronological
- `collections.services` — all service pages (from `services.json` pagination)
- `collections.areas` — all service-area pages
- `collections.allPages` — every page not marked `excludeFromSitemap: true` (used by sitemap)

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

**Shortcodes** (defined in `.eleventy.js`):
- `{% image src, alt, sizes, widths, classes %}` — responsive `<picture>` with AVIF/WebP/JPEG, lazy-loaded.
- `{% heroImage src, alt, sizes %}` — same but `loading="eager" fetchpriority="high"` for LCP images.
- `{% icon name, classes, size %}` — inlines a Lucide SVG by name (from `lucide-static`). Example: `{% icon "phone", "btn__icon", 20 %}`.
- `{% year %}` — current year string.

**Filters** (defined in `.eleventy.js`):
- `dateISO` / `dateHuman` / `dateYear` — date formatting for blog post metadata.
- `json` — `JSON.stringify` wrapper used in schema partials.

**Images:**
- Add source images to `src/assets/img/`.
- Use the `{% image %}` or `{% heroImage %}` shortcodes — they auto-generate AVIF/WebP/JPEG `srcset` via `@11ty/eleventy-img`.

**AI image generation (optional):**
- Set your key once per shell: `$env:OPENAI_API_KEY="sk-..."` (PowerShell).
- Run `npm run generate:images` to fill missing slots, `-- --force` to regenerate all, or `-- <slot>` for one (slots: `hero`, `trust`, `quote-band`, `faq`, `blog-default`).
- Default model is `gpt-image-2` (highest quality, may require OpenAI org verification). Fall back with `$env:OPENAI_IMAGE_MODEL="gpt-image-1"` or `="dall-e-3"`.
- After generation run `npm run build` — eleventy-img regenerates AVIF/WebP/JPEG variants from the new source files.

**URL conventions:** `vercel.json` sets `cleanUrls: true` and `trailingSlash: true`. All internal links must end with `/` (e.g. `/services/furnace-installation/`). Eleventy permalinks follow the same pattern.

**Client-side JavaScript** (passthrough-copied, no bundler):
- `src/assets/js/main.js` — mobile nav toggle, submenu accordion, scroll-reveal via IntersectionObserver.
- `src/assets/js/form.js` — phone number formatter, fetch-based form submission with progressive enhancement (falls back to plain HTML POST if JS is unavailable). Forms are identified by the `data-form` attribute; errors use `[data-error="fieldname"]` elements.

**WordPress migration path:**
Every partial in `src/_includes/partials/` is designed to port 1:1 to a WP `template-parts/*.php` file. `services.json` → WP Custom Post Type `service`. URL slugs are preserved.
