# Riham Elmakki — Interior Design Portfolio

A Vite + TypeScript static site for Riham Elmakki's interior-design portfolio
(residential & commercial), imported from a Claude Design project.

## Stack
- **Vite 5** (multi-page static build) + **TypeScript**
- No UI framework — hand-authored HTML with typed vanilla-JS enhancements
- `qrcode-generator` (bundled, not a CDN) for the contact vCard QR

## Scripts
```bash
npm install        # install dependencies
npm run dev        # dev server with HMR  → http://localhost:5173
npm run build      # production build      → dist/
npm run preview    # serve the built dist/
npm run typecheck  # tsc --noEmit
```

## Structure
```
index.html              # portfolio page (entry)
contact-card.html       # business card page (entry)
src/
  main.ts               # portfolio bootstrap (imports styles.css)
  contact-card.ts       # card bootstrap (imports card.css)
  animations.ts         # style-hover + scroll parallax / reveal / back-to-top
  lightbox.ts           # clickable gallery lightbox
  qr.ts                 # vCard QR renderer
  styles.css            # portfolio styles (base, lightbox, annotated plan)
  card.css              # contact-card styles
public/
  assets/               # all images (served at /assets/...)
  robots.txt
  sitemap.xml
vite.config.ts          # MPA config; bundled JS/CSS -> dist/static, images -> dist/assets
```

## Features
- **Clickable gallery** — every project photo opens a full-screen lightbox with
  prev/next (arrow buttons, ← → keys, swipe), a counter, and Esc / tap-to-close.
- **Scroll animations** — parallax, reveal-on-scroll, back-to-top. Respects
  `prefers-reduced-motion`.
- **Annotated plan** — Project 01 includes a keyed top-view furniture plan with
  numbered markers, labelled callouts and a materials legend.
- **SEO** — title/description, Open Graph + Twitter cards, canonical URL,
  JSON-LD (`Person`, `ProfessionalService`, `WebSite`), descriptive `alt` text,
  `sitemap.xml` + `robots.txt`.
- **QR contact** — generated client-side, bundled (no external request).

## ⚠️ Before going live: set the real domain
The site uses the placeholder **`https://www.rihamelmakki.com`**. Find-and-replace
it in `index.html`, `contact-card.html`, `public/sitemap.xml`, `public/robots.txt`,
then submit the sitemap in [Google Search Console](https://search.google.com/search-console).

## Deploy
`npm run build` produces a fully static `dist/` — deploy it to any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, …). No server required.
