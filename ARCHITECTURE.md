# Architecture — arnav-portfolio-2025

Personal portfolio of Arnav Bule. Live at **https://arnav-portfolio-2025.vercel.app** — every push to `main` auto-deploys via Vercel (no PRs used).

## Overview

A single-page portfolio (hero → about/experience/projects → technologies → connect → resume CTA → footer) plus a `/resume` route that renders the PDF inline. Originally scaffolded with v0.dev; cleaned up in Aug 2026 to only the code that actually ships.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19 | **`output: "export"`** — fully static site, no server features. Route handlers/ISR/middleware will NOT work; failures surface only at build. |
| Styling | Tailwind CSS 3 (`darkMode: "class"`) + `app/globals.css` | Global CSS carries typography helpers (`hero-text`, `section-heading`, …) and a small set of `.dark .<utility>` overrides — see cautions. |
| Animation | framer-motion (hero letters, scroll reveals), one styled-jsx `float` keyframe (tech tiles) | No GSAP — it was removed as unused. |
| Icons | lucide-react (UI), react-icons (brand logos in Technologies) | Don't add a third icon lib. |
| Theme | next-themes (pre-paint script only) + custom context in `components/theme-provider.tsx` | See "Theme system" below. |
| PDF | react-pdf; worker at `public/pdf.worker.min.mjs` | Worker is string-referenced (`workerSrc = "/pdf.worker.min.mjs"`); re-copy it from react-pdf's bundled pdfjs-dist when upgrading react-pdf. |
| Analytics | @vercel/analytics, @vercel/speed-insights | Injected in `app/layout.tsx`. |

Package manager: **npm** (`package-lock.json`). Dependencies are intentionally minimal (10 runtime deps); most are pinned loosely (`latest`) from the v0 scaffold.

## Structure

```
app/
  layout.tsx          Root layout: Poppins font (weights 400–800), ThemeProvider, analytics
  page.tsx            Home — composes the section components
  globals.css         Tailwind directives, theme-reveal keyframes, typography, dark-mode overrides
  resume/page.tsx     /resume — PDF viewer + download link
components/
  header.tsx          Fixed header; nav + toggle. On md+ it slides away past the hero
                      (the floating dock takes over); "Connect" links to #contact
  floating-dock.tsx   Aceternity-style dock (framer-motion + Phosphor duotone icons via
                      react-icons). Mobile <md: always-on collapsible, bottom-right.
                      Desktop md+: magnifying dock, bottom-center, shown past the hero;
                      carries the theme toggle there. Gradient hover/tap effects.
  hero-grid.tsx       Canvas hairline grid behind the hero; cursor/touch-tracked
                      spectrum highlight. All math in buffer px, cursor mapped by
                      visual fraction of the canvas box (immune to zoom/transforms);
                      device-pixel snapped lines; additive blending in dark mode.
  hero-section.tsx    "Welcome to Arnav's Portfolio" letter animation (scroll-linked)
  main-content-section.tsx  THE CONTENT FILE: about text, experiences[], projects[], education, certs
  technologies-section.tsx  Tech tile grid (react-icons), floating bob animation
  text-hover-effect.tsx  Signature section: staggered tagline + giant "ARNAV" SVG with
                      draw-in stroke and cursor-revealed gradient (auto-sweep on touch)
  connect-section.tsx / resume-section.tsx / footer.tsx
  PdfResumeViewer.tsx Client-only react-pdf wrapper (breakpoint-scaled)
  theme-provider.tsx  Theme context + animated theme switching
public/
  Arnav - Resume.pdf  mypic.jpeg  pdf.worker.min.mjs   (all three are referenced — keep)
```

To edit portfolio content (jobs, projects, skills text), edit the data arrays at the top of `components/main-content-section.tsx`.

## Theme system (the most intricate part — change with care)

- Default theme is **dark**; choice persists in `localStorage["theme"]`.
- `NextThemesProvider` exists **only** for its pre-paint inline script (sets `.dark` on `<html>` before hydration → no flash). Nothing consumes its React context — the custom context in `theme-provider.tsx` is what `useTheme()` consumers get. They share the `"theme"` storage key; keep them in sync if touching either.
- **Toggle animation**: a circular reveal via the View Transition API. The sweep is a **CSS keyframe animation** (`theme-reveal` in `globals.css`) on `::view-transition-new(root)` — deliberately not JS-driven (mobile Chrome tore down JS-driven transitions early). Geometry is passed as `--reveal-x/y/r` custom properties in **percentages**, never px — px coordinates broke under display scaling / devicePixelRatio (sweep stopped at 50–90% then snapped). Keep it percentage-based.
- During the sweep, `html.theme-transitioning` suspends all CSS transitions and pauses page animations so the reveal edge stays crisp.
- Browsers without View Transitions (or `prefers-reduced-motion`) get an instant switch.

## Conventions & cautions

- **`.dark .<utility>` overrides in `globals.css`**: a legacy v0 pattern that re-maps some Tailwind classes in dark mode instead of `dark:` variants. The surviving rules are all load-bearing — notably `.dark .bg-white\/80` (intentionally beats the `dark:bg-gray-900/80` on the timeline cards) and `.dark .text-blue-600` / `.dark .text-cyan-600` (non-default colors). Don't "clean these up" without visually checking dark mode; prefer `dark:` variants for NEW code.
- **A global `* { transition: background-color/color/border-color 0.3s }`** in `globals.css` provides theme-change fades everywhere. Many components also carry `transition-colors duration-300` classes — harmless duplication, but the global rule is the one that matters.
- **Smooth scrolling** comes from `* { scroll-behavior: smooth }` in `globals.css` plus `scroll-smooth` on `<html>` (layout.tsx). The `<html>` class currently defeats the reduced-motion override — a known wart, kept to preserve behavior.
- **Hero animation**: per-letter random values are memoized (`useMemo(..., [])`); `useTransform` hooks run in `.map()` over fixed-length arrays — array lengths must stay deterministic per render or React's hook order breaks.
- **Type checking is enforced at build** (`tsc` is clean; `ignoreBuildErrors` was removed). ESLint is still skipped during builds (`ignoreDuringBuilds: true`).
- **Static export**: `next build` writes `out/`. `images.unoptimized: true` is required for export mode.
- Commits are authored by Arnav Bule only — no co-author trailers.

## Build & run

```bash
npm run dev     # dev server
npm run build   # static export → out/ (type-checked)
```
