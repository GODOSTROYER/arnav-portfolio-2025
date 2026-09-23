# arnav-portfolio-2025

Personal portfolio of Arnav Bule: a single-page, fully static Next.js site with its
own mobile composition, an inline resume viewer, and proxied routes for the projects
it showcases.

**Live:** https://www.arnavbule.in (auto-deploys from `main` via Vercel)

## What's on the site

- **Hero** - a scroll-linked "Welcome to Arnav's Portfolio" letter animation over a
  cursor-tracked hairline canvas grid, plus a site-wide cursor aura.
- **About, Experience and Projects** as vertical timelines with a tracing beam that
  follows the scroll; project cards carry screenshot banners (`public/projects/*.webp`)
  rendered at their natural aspect ratio and linking to the live demo or repo.
- **Technologies** tile grid and a signature section (a giant "ARNAV" SVG with a
  draw-in stroke and a cursor-revealed gradient).
- **Connect**, a resume call-to-action and footer; `/resume` renders the PDF inline
  with react-pdf and offers a download.
- **Mobile experience** (below the `md` breakpoint) - same content, different
  composition: a bento about grid, Apple-cards style swipe decks for experience and
  projects with tap-to-expand detail sheets, a hexagonal certification honeycomb,
  counter-scrolling tech marquees, and snap chapters with a progress-dot rail.
- **Dark theme by default** with a circular View Transition reveal on toggle, Lenis
  inertial smooth scrolling, and a floating dock for navigation.
- **Static export** with `robots.txt`, `sitemap.xml`, an Open Graph image and Vercel
  Analytics / Speed Insights; `/dev` proxies a noindex preview build of the next
  version (a separate Vercel project, see Deployment and routing).

## Projects showcased

Rows come from the `projects` array in
[components/main-content-section.tsx](components/main-content-section.tsx).

| Project | Live | Code |
|---|---|---|
| Cadence | https://www.arnavbule.in/hiver-assignment | https://github.com/GODOSTROYER/cadence |
| Parakh | https://www.arnavbule.in/parakh | https://github.com/GODOSTROYER/parakh |
| Sentinel | https://huggingface.co/spaces/GODOSTROYER/sentinel | https://github.com/GODOSTROYER/sentinel-vad |
| QR Studio | https://qr-studio.arnavbule.in | https://github.com/GODOSTROYER/qr-tree-studio |
| Mini Task Tracker | https://www.arnavbule.in/task-tracker | https://github.com/GODOSTROYER/task-tracker |
| Email Digital Twin | - | - |
| Sicklesense | https://huggingface.co/spaces/GODOSTROYER/Sicklesense | https://github.com/GODOSTROYER/sicklesense |
| Road Extraction On Satellite Images | - | - |
| ERP Exerciser | - | - |
| Prisma | - | - |

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) with `output: "export"` - a fully static site; React 19; TypeScript 5 |
| Styling | Tailwind CSS 3 (`darkMode: "class"`) plus `app/globals.css` for typography helpers, keyframes and dark-mode overrides |
| Animation | framer-motion (hero letters, scroll reveals, dock, decks, detail-sheet morphs); one styled-jsx keyframe for the tech tiles |
| Icons | lucide-react for UI, react-icons for brand logos and the dock's Phosphor duotone icons |
| Theme | next-themes (pre-paint script only) plus a custom context in `components/theme-provider.tsx` |
| Scrolling | Lenis via `components/smooth-scroll.tsx`, mounted in the root layout |
| PDF | react-pdf; the pdf.js worker is served from `public/pdf.worker.min.mjs` |
| Analytics | @vercel/analytics and @vercel/speed-insights, injected in `app/layout.tsx` |
| Tooling | npm, ESLint 9 (`eslint-config-next`), PostCSS + autoprefixer |

## Repository layout

```text
app/
  layout.tsx              Root layout: Poppins font, ThemeProvider, smooth scroll, analytics, site metadata
  page.tsx                Home - one composition, two experiences: desktop sections on md+, the mobile
                          experience below md (the desktop HTML is what the export ships to crawlers)
  globals.css             Tailwind directives, theme-reveal keyframes, typography, dark-mode overrides,
                          mobile utilities (dev-snap, dev-glass-pill, dev-marquee)
  resume/page.tsx         /resume - PDF viewer + download link
  robots.ts, sitemap.ts   Static robots.txt and sitemap.xml
  icon.svg                Favicon
components/
  main-content-section.tsx   THE content file: about text and skills; exports experiences[],
                             projects[], certifications[] and timelineColors[]
  hero-section.tsx, hero-grid.tsx          Letter animation + cursor-tracked canvas grid
  timeline-energy.tsx, ambient-glow.tsx    Tracing beam along the timelines + the cursor aura that merges into it
  header.tsx, floating-dock.tsx            Fixed header (slides away past the hero on md+) and the dock with the theme toggle
  technologies-section.tsx   Tech tile grid; exports techStack
  text-hover-effect.tsx      Signature "ARNAV" SVG section
  connect-section.tsx, resume-section.tsx, footer.tsx
  mobile-*.tsx               Mobile experience: bento (about), decks (experience/projects), certs (honeycomb),
                             tech-marquee, chapters (snap + progress rail), tail (connect/resume/footer)
  smooth-scroll.tsx          Lenis wrapper
  theme-provider.tsx         Theme context + animated theme switching
  PdfResumeViewer.tsx        Client-only react-pdf wrapper
public/
  Arnav - Resume.pdf, mypic.jpeg, og.png, pdf.worker.min.mjs
  projects/                  Project screenshots (cadence.webp, parakh.webp, sentinel.webp, qr-studio.webp)
vercel.json                  Redirects and rewrites (see Deployment and routing)
next.config.mjs              output: "export", images.unoptimized
ARCHITECTURE.md              Design notes, theme system, conventions and cautions
```

## Editing content

All portfolio copy lives in
[components/main-content-section.tsx](components/main-content-section.tsx). Edit the
data arrays at the top of the file - `experiences`, `projects`, `certifications` (and
the `timelineColors` node palette) - and both the desktop timeline and the mobile decks
and honeycomb pick the change up, since they import the same exports.

A project entry takes `name`, `period`, `team` (the tech line), a lucide `icon`,
`highlight[]` bullets, and optional `github` / `live` links. It can also carry a
screenshot: put a `.webp` under `public/projects/` and set `image`, `imageAlt`,
`imageWidth` and `imageHeight`. The image renders at its natural aspect ratio (no
cropping) as a banner on the desktop card and as the hero of the mobile detail sheet;
the pixel size reserves the slot before the lazy image loads.

Other content lives where you would expect: the tech tiles in
[components/technologies-section.tsx](components/technologies-section.tsx)
(`techStack`), the resume at `public/Arnav - Resume.pdf`, the photo at
`public/mypic.jpeg`, and the site metadata (title, description, Open Graph image) in
[app/layout.tsx](app/layout.tsx).

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-checked static export to out/
npm run lint     # eslint .
```

[.claude/launch.json](.claude/launch.json) defines a `dev` configuration
(`npm run dev` on port 3000 with `autoPort`) for the Claude Code browser preview.

The site is a static export (`output: "export"` in
[next.config.mjs](next.config.mjs)), so:

- Route handlers, ISR, middleware, server actions and server-side image optimization
  are unavailable; `images.unoptimized: true` is required, and anything that needs a
  server fails only at build time.
- `next start` does not serve an export. To check a build locally, serve `out/` with
  any static file server (for example `npx serve out`).
- Type errors fail the build; `tsc` is clean and no build-time checks are suppressed.

## Deployment and routing

Every push to `main` deploys to production on Vercel; there are no pull requests in the
workflow. Vercel runs `next build` and serves `out/`. Routing rules live in
[vercel.json](vercel.json) and are applied by Vercel - they are not part of the Next.js
build and do not run under `npm run dev`:

| Source | Destination | Rule |
|---|---|---|
| `/` and `/:path*` when the host is `arnav-portfolio-2025.vercel.app` | `https://www.arnavbule.in/:path*` | permanent redirect (308) to the canonical host |
| `/task-tracker` | `https://task-tracker-godostroyers-projects.vercel.app` | temporary redirect (307) |
| `/ai-exam-checker` | `https://www.arnavbule.in/parakh` | temporary redirect (307) - legacy name for Parakh |
| `/portfolio-2023` and `/portfolio-2023/:path*` | `https://arnav-portfolio-2023.vercel.app/...` | temporary redirect (307) - the first portfolio (2023), [GODOSTROYER/My-Portfolio-Website](https://github.com/GODOSTROYER/My-Portfolio-Website) |
| `/hiver-assignment` and `/hiver-assignment/:path*` | `https://cadence-hiver.vercel.app/hiver-assignment/...` | rewrite - Cadence is proxied; the URL stays on arnavbule.in |
| `/parakh` and `/parakh/:path*` | `https://parakh-eta.vercel.app/parakh/...` | rewrite - Parakh is proxied; the URL stays on arnavbule.in |
| `/dev` and `/dev/:path*` | `https://arnav-portfolio-dev.vercel.app/dev/...` | rewrite - noindex preview of the next version: the `dev` branch built with `NEXT_PUBLIC_BASE_PATH=/dev` and deployed as the static Vercel project `arnav-portfolio-dev` |

Redirects change the address bar; rewrites proxy the upstream deployment so Cadence and
Parakh appear as pages of this site.

## Notes

- The theme system is the most intricate part of the codebase: dark by default,
  persisted in `localStorage["theme"]`, with a circular View Transition reveal driven by
  a CSS keyframe whose geometry is passed in percentages. Two providers share that
  storage key, the dock guards against phantom hover events during the sweep, and a few
  `.dark .<utility>` overrides in `app/globals.css` are load-bearing. Read
  [ARCHITECTURE.md](ARCHITECTURE.md) before changing any of it.
- CSS `scroll-behavior` must stay `auto` everywhere - a `smooth` rule fights Lenis.
- Commits are authored by Arnav Bule only; no co-author trailers.
- Originally scaffolded with v0.dev; cleaned up in Aug 2026 to only the code that
  actually ships.

## Author

Arnav Bule

- https://www.arnavbule.in
- https://github.com/GODOSTROYER
