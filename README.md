# 🌳 Ala — Regenerate Madagascar's Future

A comprehensive, tech-enabled community platform uniting Madagascar’s mining and agricultural sectors. The application facilitates regeneration efforts, empowers communities, and provides an ecosystem for social engagement, marketplace transactions, grievance management, and crisis alerting.

## 🧰 Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Backend as a Service:** Supabase (Authentication, PostgreSQL Database)
- **Internationalization:** i18next + react-i18next (EN/MG)
- **Maps:** Leaflet & react-leaflet
- **Animations:** Framer Motion
- **PWA:** Progressive Web App configuration (manifest, service worker)

## ✨ Core Features

- **Authentication & Profiles:** Secure login, signup, and onboarding flows using Supabase Auth.
- **Social Feed & Groups:** Interactive community feeds, ability to create and join groups, and post updates.
- **Marketplace:** Platform for users to create product/service listings, view details, and manage orders.
- **Resource Hub:** Centralized repository to upload and view educational or community resources.
- **Grievance Mechanism:** Dedicated portal for filing grievances, with an admin interface for resolution and tracking.
- **Crisis Alerts & Compliance:** Real-time crisis reporting and compliance tracking.
- **Direct Messaging:** Private chat between platform users.
- **Events & Analytics:** Event scheduling and platform analytics dashboard.
- **Admin Dashboards:** Role-based access for managing grievances and platform users.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- Supabase Project (Database & Auth configured)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file referencing your Supabase project keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Production Build
To create a production-ready build:
```bash
npm run build
npm run preview
```

## 📁 Project Structure

- `src/components/` — Reusable UI components.
- `src/pages/` — Main application routes (e.g., Feed, Landing, Marketplace, Admin, etc.).
- `src/contexts/` — React contexts for global state (e.g., `AuthContext`, `ToastContext`).
- `src/hooks/` — Custom React hooks.
- `src/lib/` — Library configurations like Supabase client initialization.
- `src/i18n.js` — Internationalization configuration (English & Malagasy).
- `supabase/` — Supabase database schemas, SQL definitions, and migrations.
- `public/` — Static assets, Web manifest, and service worker for PWA.

## 🗺️ Map Integration

- Uses OpenStreetMap via Leaflet.
- Interactive and performant map components for geographical features of the platform.

## 📱 Progressive Web App (PWA)

- Preconfigured manifest at `public/manifest.webmanifest`.
- Service worker caching strategy for offline support and faster load times.

## 🧰 Troubleshooting

- **Supabase Connectivity:** Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are both correctly typed in your `.env` file.
- **Service Worker Stale Cache:** If you don't see updates in production, perform a hard refresh or unregister the service worker in browser DevTools.

## 🚀 Deployment

The `dist/` folder built via `npm run build` can be deployed to static hosting providers like Vercel, Netlify, or Cloudflare Pages. Ensure SPA fallback routing (rewriting all requests to `index.html`) is enabled on your hosting platform.
