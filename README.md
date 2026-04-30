# Queensway Heating & Cooling — Website

SEO-optimized static site for Queensway Heating and Cooling, serving the GTA.
Built with [Eleventy](https://www.11ty.dev/) · Hosted on [Vercel](https://vercel.com).

## Development

```bash
npm install
npm run dev        # http://localhost:8080 with live reload
npm run build      # builds to _site/
```

## Deploying

Push to `main` on GitHub. Vercel auto-deploys on every push. Build settings live in `vercel.json`.

## Adding / editing content

| What | Where |
|---|---|
| Phone, address, hours, social links | `src/_data/site.js` |
| Services list | `src/_data/services.json` |
| Service-area pages | `src/_data/areas.json` |
| Testimonials | `src/_data/reviews.json` |
| Home-page FAQs | `src/_data/faqs.json` |
| "Regions We Serve" city list | `src/_data/regions.json` |
| Blog posts | `src/blog/posts/*.md` (Markdown front matter) |
| Pages (About, Contact, etc.) | `src/*.njk` |

## Environment variables

Copy `.env.example` → `.env` for local dev. Set the same vars in the Vercel dashboard under **Project → Settings → Environment Variables**.

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from resend.com |
| `LEAD_TO_EMAIL` | Inbox that receives leads |
| `LEAD_FROM_EMAIL` | Verified sending address on Resend |

## Migrating to WordPress (future)

Each Nunjucks partial in `src/_includes/partials/` maps 1:1 to a WordPress `template-parts/*.php` file. Services and areas use data-driven pagination that translates to Custom Post Types. See `src/_data/*.json` for the content structure.
