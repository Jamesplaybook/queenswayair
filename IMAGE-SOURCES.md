# Image Sources & Attribution

All photos sourced from [Picsum Photos](https://picsum.photos) (random photos from Unsplash/Pexels contributors).
Picsum License: free for commercial use, no attribution required.
**Replace all placeholder photos with real business photography before launch.**

---

## hero/hero-home.jpg
Source:       AI-generated via scripts/generate-images.js (gpt-image-2 / fallback gpt-image-1 or dall-e-3)
License:      OpenAI generated content — usable per OpenAI's terms; replace with real photography before launch
Used in:      src/index.njk hero section
Dimensions:   1536×1024 (3:2)
Replace with: Real on-site photo or a styled studio lineup of Queensway-installed equipment

## sections/trust-tech-photo.jpg
Source:       https://picsum.photos/seed/hvac-tech/800/600
License:      Picsum / Unsplash License
Used in:      src/index.njk trust strip (right column)
Dimensions:   800×600 (4:3)
Replace with: Real photo of Queensway technician in uniform, tool bag, smiling

## sections/quote-band-bg.jpg
Source:       https://picsum.photos/seed/home-interior/1920/960
License:      Picsum / Unsplash License
Used in:      src/index.njk quote/form band background
Dimensions:   1920×960 (2:1)
Replace with: Warm, moody home interior — living room or kitchen, darker tones work better under the overlay

## sections/faq-bg.jpg
Source:       https://picsum.photos/seed/warm-home/1920/960
License:      Picsum / Unsplash License
Used in:      src/index.njk FAQ section background
Dimensions:   1920×960 (2:1)
Replace with: Warm home heating scene — fireplace, cozy living room, or winter exterior of a house

## blog/post-default.jpg
Source:       https://picsum.photos/seed/hvac-blog/1200/675
License:      Picsum / Unsplash License
Used in:      src/blog/index.njk — fallback when a post has no image: frontmatter
Dimensions:   1200×675 (16:9)
Replace with: Generic HVAC/home comfort image, or a branded blog header graphic

## og/og-home.jpg
Source:       https://picsum.photos/seed/queensway-og/1200/630
License:      Picsum / Unsplash License
Used in:      src/_data/site.js ogImage, og:image meta tag
Dimensions:   1200×630
Replace with: Custom Figma export — navy #1B2A6B bg, wordmark top-left, tagline centered, phone bottom-right. Export ≤120 KB at 85% JPEG quality

---

## Logos (generated placeholders — replace before launch)

## logos/logo-wordmark.svg
Source:       Generated placeholder SVG (text-based)
Used in:      footer, schema JSON-LD
Replace with: Real brand wordmark from designer (convert text to paths in Inkscape before committing)

## logos/logo-icon.svg
Source:       Generated placeholder SVG (Q mark geometric)
Used in:      header, favicon source
Replace with: Real brand icon from designer

## logos/logo-mono-white.svg
Source:       Generated placeholder SVG
Used in:      (available for dark backgrounds where CSS filter isn't sufficient)
Replace with: Monochrome version of real logo

## brand-marks/google-reviews.svg
Source:       Generated placeholder SVG
Used in:      src/index.njk, src/reviews.njk review-platform strip
Replace with: Official Google Reviews badge from https://marketingkit.withgoogle.com/

## brand-marks/homestars.svg
Source:       Generated placeholder SVG
Used in:      src/index.njk, src/reviews.njk review-platform strip
Replace with: Official HomeStars badge from https://homestars.com/companies (your business profile → badges)

## favicon/icon.svg, favicon.ico, apple-touch-icon.png
Source:       Generated placeholders
Used in:      <link rel="icon"> in base.njk
Replace with: Run logos/logo-icon.svg through https://realfavicongenerator.net — drop entire output into src/assets/img/favicon/
