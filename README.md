# Abdul Rehman — Graphic Designer Portfolio

Animated editorial portfolio built with Next.js (App Router), React 19, Tailwind CSS v4, GSAP and Lenis.

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev` → http://localhost:3000

## Scripts

| Command         | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Dev server with hot reload on port 3000   |
| `npm run build` | Production build (static prerender)       |
| `npm run start` | Serve the production build on port 3000   |
| `npm run lint`  | Type-check with `tsc --noEmit`            |

## Structure

- `src/app/` — Next.js entry: `layout.tsx` (metadata, fonts, global CSS), `page.tsx`, `icon.svg`
- `src/App.tsx` — client root that composes every section
- `src/components/` — sections and effects (cursor, liquid ripple, smooth scroll, …)
- `src/data/portfolio.ts` — all copy, projects, experience and tools
- `public/` — static files served from `/` (images in `public/images/`, the CV PDF)
