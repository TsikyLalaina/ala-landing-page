# 🌳 Ala — Regenerate Madagascar's Future

Investor-focused landing page for Ala, a tech-enabled ecosystem uniting Madagascar’s mining and agricultural sectors for regenerative impact.

## 🧰 Stack

- React 19 + Vite
- Framer Motion (cinematic fades, reduced-motion aware)
- React Parallax (hero parallax effect)
- i18next + react-i18next (EN/MG)
- Leaflet (OpenStreetMap tiles, no API key)
- Progressive Web App (manifest, service worker with offline fallback)
- Plain CSS marquee carousels (no slider lib)

## ✨ Features

- Cinematic hero: 11s foreground video fading to parallax background image with gradient tint
- Investor-focused benefits section
- Impact stats marquee with CountUp animation
- How It Works timeline (horizontal scroll, snap)
- Testimonials marquee
- Interactive map of Madagascar with random hub pins (replace with real data)
- Language toggle (EN/MG) persisted to localStorage
- Install App prompt + offline support
- Voice narration via Web Speech API

## 🚀 Quick Start

- Install
  - `npm install`
- Develop
  - `npm run dev` → open the local URL
- Production
  - `npm run build`
  - `npm run preview`
  - For PWA updates, hard-refresh twice to activate the new service worker

## 📁 Project Structure

- `src/components/`
  - `Hero.jsx` — video → image fade with parallax
  - `Features.jsx`, `Impact.jsx`, `HowItWorks.jsx`, `Testimonials.jsx`, `Header.jsx`, `Footer.jsx`, `AnnouncementBar.jsx`, `MapPreview.jsx`, `OfflineIndicator.jsx`
- `src/hooks/` — `useSpeech.js`, `usePWAInstall.js`
- `src/i18n.js` — i18n init and copy (EN/MG)
- `src/index.css` — theme + marquee carousel styles
- `public/` — `manifest.webmanifest`, `sw.js`, icons, media

## 🖼️ Media

Hero assets live in `public/images`:

- 🎬 Foreground video: `Before.mp4`
- 🌿 Background image: `After.png`

Recommended formats: WebP/AVIF for images, H.264 MP4 for video. Use widescreen (16:9 or 21:9) and keep sizes optimized.

## 🎠 Carousels

- CSS marquee carousel (`.ala-carousel`) replaces slider libraries for performance.
- Configure via CSS variables in `src/index.css`:
  - `--carousel-item-width`, `--carousel-item-height`, `--carousel-item-gap`, `--carousel-duration`

## 🗺️ Map (OpenStreetMap via Leaflet)

- No API key required; attribution included.
- Random pins are generated for preview. Replace with real coords in `MapPreview.jsx`:
  ```js
  const hubs = [
    { id: 1, lat: -18.91, lon: 47.53 },
    // ...
  ]
  ```

## 📱 PWA

- Manifest at `public/manifest.webmanifest`
- Service worker at `public/sw.js` with:
  - Precache of core assets (offline.html, icons, hero media)
  - Navigation fallback to offline page
  - Cache-first for images, stale-while-revalidate for CSS/JS

## ♿️⚡ Accessibility & Performance

- Mobile-first, high contrast
- Respects prefers-reduced-motion
- Preload LCP media in `index.html`
- Avoids heavy third-party UI libs (CSS marquee, Leaflet only)

## 🧰 Troubleshooting

- React 19 + react-leaflet: react-leaflet currently peers React 18. This project uses plain Leaflet to avoid conflicts.
- Video won’t autoplay: ensure `muted` and `playsInline` are set (they are), and the file path matches case-sensitive filename.
- SW caching stale assets: run production preview, then refresh twice (or do a hard reload) to activate the new SW.

## 🚀 Deployment

Static hosting supported (Vercel, Netlify, Cloudflare Pages, S3/CloudFront). Serve `dist/` at the site root; ensure `sw.js` is available at `/<sw>`. Configure a SPA fallback to `index.html` if needed.
