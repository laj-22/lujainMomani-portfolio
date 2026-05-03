# Lujain Almomani – Portfolio Website ( Maintainer Guide )

This repository is a **single-page portfolio** built with **Vite + React + TypeScript**. There is **no traditional backend**. The live site on GitHub Pages is the **compiled static output** in `dist/` produced by CI from `main`.

Use this README as an operations manual: file layout, where content lives, how to add sections, assets, tags, links, builds, deployments, and what is safe versus exposed in the browser.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Architecture at a glance](#architecture-at-a-glance)
3. [Repository layout (every important path)](#repository-layout-every-important-path)
4. [How the page is assembled](#how-the-page-is-assembled)
5. [Sections: what each one does & which file owns it](#sections-what-each-one-does--which-file-owns-it)
6. [Adding or editing content](#adding-or-editing-content)
7. [Images: where to put them, sizing, cropping](#images-where-to-put-them-sizing-cropping)
8. [Hyperlinks (internal anchors vs external URLs)](#hyperlinks-internal-anchors-vs-external-urls)
9. [Tags, badges & categories](#tags-badges--categories)
10. [Adding a new major section](#adding-a-new-major-section-checklist)
11. [Adding a new route (multi-page, optional)](#adding-a-new-route-multi-page-optional)
12. [Styling vs data-only files](#styling-vs-data-only-files)
13. [GitHub Actions & deploying the live site](#github-actions--deploying-the-live-site)
14. [Git branches & workflows](#git-branches--workflows)
15. [Security, “backend,” and developer tools inspection](#security-backend-and-developer-tools-inspection)
16. [Environment variables](#environment-variables)

---

## Quick start

```sh
npm install          # install dependencies (or npm ci in CI)
npm run dev          # local dev server (default port 8080 in vite.config)
npm run build        # production build → dist/
npm run preview      # preview the production build locally
npm run lint         # ESLint
```

Live site URL pattern for this repo setup:

`https://<user>.github.io/lujainMomani-portfolio/`

(Exact URL is shown after a successful Pages deploy in GitHub → Actions.)

---

## Architecture at a glance

| Layer | What it is |
|-------|-------------|
| **Runtime** | React 18 SPA: one main page (`src/pages/Index.tsx`) composed of sections as components |
| **Routing** | React Router with `basename={import.meta.env.BASE_URL}` so paths work under GitHub Pages subfolder |
| **Build** | Vite emits static HTML/JS/CSS + hashed assets under `dist/` |
| **Deploy** | GitHub Actions builds on every push to **`main`** and publishes `dist/` to GitHub Pages |
| **Data** | Almost all content is **constants inside TSX files** or **static files in `public/`** (no CMS, no REST API hosted here) |

There is **no Node server** in production visitors hit only static files and any **third-party** APIs you intentionally call from the browser (currently: contact form → Web3Forms).

---

## Repository layout (every important path)

```
.
├── .github/workflows/deploy.yml   # CI: npm ci → build → deploy Pages
├── index.html                     # HTML shell; Vite injects the React bundle
├── package.json                   # Scripts & dependencies
├── vite.config.ts                 # Base path for GH Pages, aliases, build outDir
├── tailwind.config.ts             # Tailwind theme extensions (colors, animations)
├── postcss.config.js              # PostCSS pipeline for Tailwind
├── eslint.config.js               # Lint rules
├── components.json                # shadcn/ui generator config (if you add more UI primitives)
├── tsconfig*.json                  # TypeScript project references & path `@/*` → `src/*`
├── public/                        # Static files copied as-is into dist root (URLs are important)
│   ├── LujainCV.pdf               # CV served at /<base>/LujainCV.pdf
│   ├── pictures/                  # Project images referenced by URL in Projects.tsx
│   ├── favicon.svg, robots.txt, 404.html, spa-redirect.js
├── src/
│   ├── main.tsx                   # React root mount + global styles import
│   ├── App.tsx                    # Router, providers, routes
│   ├── index.css, App.css         # Global CSS + Tailwind layers / custom utilities
│   ├── vite-env.d.ts              # Vite client types
│   ├── assets/                    # Images imported into JS (bundled, hashed filenames)
│   ├── pages/
│   │   ├── Index.tsx              # **Homepage composition** (order of sections)
│   │   └── NotFound.tsx           # 404 route
│   ├── components/                # **All section content & layout**
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── ProjectOfTheMonth.tsx # “Graduation / featured spotlight”
│   │   ├── Projects.tsx
│   │   ├── Publications.tsx
│   │   ├── Activities.tsx
│   │   ├── Contact.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── RecentProjects.tsx     # Present but **not imported** on Index (dead section)
│   │   └── ui/                    # shadcn primitives (mostly presentational)
│   ├── hooks/                     # scroll spy, toast, responsive helpers, theme
│   └── lib/utils.ts               # `cn()` class name helper used across UI
├── thesis.png                     # Imported by spotlight/projects (bundled asset)
├── LujainCV.pdf, LujainCv old.pdf # Duplicates/backups at repo root; **About uses `public/LujainCV.pdf`**
└── README.md                       # You are here
```

**Note:** `dist/` is in `.gitignore`. The website on GitHub Pages is rebuilt from source in CI — you do **not** commit `dist/` unless you change that workflow deliberately.

---

## How the page is assembled

### 1. Entry

- `src/main.tsx` renders `<App />` into `#root` from `index.html`.
- `src/App.tsx`:
  - Wraps the app with React Query, tooltips, toasters.
  - `<BrowserRouter basename={import.meta.env.BASE_URL}>`
  - Routes: `/` → `Index.tsx`, anything else → `NotFound.tsx`.

### 2. Homepage

- `src/pages/Index.tsx` **imports sections in vertical order**:

  `Hero` → `About` → `Skills` → `ProjectOfTheMonth` → `Projects` → `Publications` → `Activities` → `Contact`.

  To reorder the page: **edit this file only.**

### 3. Navigation & scroll highlighting

- `src/components/Navigation.tsx` defines the top nav buttons and maps them to **`document.getElementById(sectionId)`** scroll targets.
- `src/hooks/useActiveSection.ts` watches scroll position against the **same id list**.

**Critical:** Whenever you add a new top-level scroll section, update **three** places:

1. The new component’s `<section id="yourId">`.
2. `sections` array in `Navigation.tsx`.
3. `sections` array in `useActiveSection.ts`.

**Current quirk:** `ProjectOfTheMonth` uses `id="featured"`, but the nav jumps to **`projects`** and does **not** list `featured`. The spotlight sits between Skills and Projects; users scroll through it naturally. To add “Featured” to the navbar, extend both lists above with `featured`.

---

## Sections: what each one does & which file owns it

| Section component | DOM `id` (scroll target) | Primary content location |
|------------------|--------------------------|---------------------------|
| `Hero.tsx` | `home` | Intro text, portrait (`src/assets/`), background image, CTAs scroll to `#projects` etc. |
| `About.tsx` | `about` | Bio paragraphs, **Download CV** link → `public/LujainCV.pdf` |
| `Skills.tsx` | `skills` | Skill groups; links/skills wired to `#projects` filters where applicable |
| `ProjectOfTheMonth.tsx` | `featured` | Single “hero” project object at top of file; expandable details |
| `Projects.tsx` | `projects` | Large `projects` array + category filters + modal |
| `Publications.tsx` | `publications`, plus `experience` subsection | Publication cards, timelines, Professional Experience |
| `Activities.tsx` | `activities` | Competitions, certifications, extracurriculars |
| `Contact.tsx` | `contact` | Contact info, social links, **Web3Forms** submit |

**Unused but present**

- `RecentProjects.tsx` defines `id="recent"` — **not** mounted in `Index.tsx`. Either remove or import it in `Index.tsx` if you want it live.

---

## Adding or editing content

### Spotlight / graduation block

- Edit **`featuredProject`** in `src/components/ProjectOfTheMonth.tsx**.
- Fields: title, description, longDescription, image, github URL, tags, achievements, tech stack rows.

### All other projects grid

- Edit the **`projects: Project[]`** array in **`src/components/Projects.tsx`**.
- Each project object supports: id, title, description, longDescription, **category**, **tags**, image path, optional **github** / **demo**, **featured**, timeline, team, impact bullets, dates for sorting.

**Featured filter:** Anything with `featured: true` appears when users click **Featured** in the category chips.

### Publications & experience

- **`src/components/Publications.tsx`**: Arrays/objects for published vs under-review items and the Professional Experience timeline.

### Activities

- **`src/components/Activities.tsx`**: Structured blocks (competitions, certs, etc.).

### Footer text

- Inline in **`src/pages/Index.tsx`** at the bottom (copyright line).

---

## Images: where to put them, sizing, cropping

### Option A — `src/assets/` (recommended for bundled images)

1. Drop file under `src/assets/`.
2. `import heroImg from '@/assets/hero-img.jpg'` (or relative path).
3. Use `<img src={heroImg} className="w-full h-48 object-cover" />`.

Vite emits a **hashed filename** (`assets/foo-ABC123.jpg`), which avoids stale browser cache after deploy.

**Sizing (Tailwind):**

- Width/height: `w-full`, `max-w-xl`, `h-48`, `min-h-[200px]`, etc.
- Crop / focal point: `object-cover` + `object-center` or `object-[50%_20%]`.
- Aspect ratio wrappers: Tailwind classes like `aspect-video`, `aspect-[4/3]`, or wrap in `<div className="aspect-video overflow-hidden rounded-lg">`.

### Option B — `public/pictures/` (URL-based, matches existing project thumbnails)

Projects use URLs like `` `${publicBase}pictures/Your Title Here.jpg` `` plus **fallback** logic that tries variants of the filename. Easiest workflow:

1. Add `public/pictures/My Project Title.jpg` (match the **`title`** string or one of the normalized variants generated in `getTitleBases`).
2. Set project `image` to that `${publicBase}pictures/...` URL.

If extension or spacing differs, the `onError` handler cycles `.jpg`/`.jpeg`/`.png`/`.webp` and path variants until it hides the image (“No image provided”).

### Option C — `public/` root (PDFs, favicon)

- **`public/LujainCV.pdf`** is served at:
  **`${import.meta.env.BASE_URL}LujainCV.pdf`**  
  (On GitHub Pages with this repo name, BASE_URL is `/lujainMomani-portfolio/`.)

**Rule of thumb:**

- Logo, hero PNG in React → often `assets/`.
- Bulk project photos with stable paths → `public/pictures/`.
- CV and legal docs → **`public/`** with a stable filename so you only replace the file.

---

## Hyperlinks (internal anchors vs external URLs)

### Internal (same page)

Use hash targets that match **`id`** on `<section>`:

```tsx
<a href={`${import.meta.env.BASE_URL}#projects`}>Projects</a>
```

Or programmatic scroll (already used in `Hero`, `Navigation`):

```tsx
document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
```

Always prefix with **`import.meta.env.BASE_URL`** when building URLs for GH Pages subdirectory hosting.

### External

```tsx
<a href="https://github.com/laj-22/AstraIPS" target="_blank" rel="noopener noreferrer">
  Repository
</a>
```

Buttons can use **`window.open(url, '_blank', 'noopener,noreferrer')`** (see `Projects` modal CTAs).

### Mail / phone / LinkedIn

- `mailto:`, `tel:`, external HTTPS — same rules; add `rel` on `target="_blank"` links.

---

## Tags, badges & categories

### Projects

- **`category`**: Must match one of the **filter chip ids** in `categories` in `Projects.tsx` (`'iot'`, `'security'`, `'ml'`, etc.). Wrong string = project hidden for that filter.
- **`tags`**: String array rendered as **`Badge`** components; purely descriptive.
- **`featured`**: Boolean; drives the **Featured** filter and badge overlay on cards.

### Spotlight (`ProjectOfTheMonth`)

- `tags.map(...)` renders secondary badges — free-form strings.

### Publications / Activities

- Each card often has its own small tag/badge lists in local data structures inside those files.

---

## Adding a new major section checklist

Assume you create `src/components/NewSection.tsx`.

1. **Create the component** with a landmark:
   ```tsx
   export default function NewSection() {
     return (
       <section id="news" className="py-20 px-4 sm:px-6 lg:px-8">
         ...
       </section>
     );
   }
   ```

2. **Mount it** in `src/pages/Index.tsx` in the desired order:
   ```tsx
   import NewSection from '@/components/NewSection';
   // ...
   <NewSection />
   ```

3. **Wire navigation:** add `{ id: 'news', label: 'News' }` to **`Navigation.tsx`** `sections` array.

4. **Wire scroll spy:** add `'news'` to the list in **`useActiveSection.ts`**.

5. **Optional:** Link from Hero buttons or Skills using `#news`.

6. **Run** `npm run build` locally to catch TS/ESLint issues.

---

## Adding a new route (multi-page, optional)

1. Create `src/pages/YourPage.tsx`.
2. In `App.tsx`:
   ```tsx
   import YourPage from "./pages/YourPage";
   // Above the "*" route:
   <Route path="your-path" element={<YourPage />} />
   ```
3. Remember all in-app `<Link>` / `navigate()` paths are under **`basename`** (e.g. `/lujainMomani-portfolio/your-path` on GH Pages).

`public/spa-redirect.js` and `404.html` exist for classic GitHub Pages SPA refresh patterns — keep them if you rely on deep links.

---

## Styling vs data-only files

| Area | Role |
|------|------|
| `tailwind.config.ts`, `src/index.css` | Theme tokens (CSS variables), animations, `@layer` additions |
| `src/components/ui/*` | shadcn primitives: mostly **presentation** (Button, Card, Badge, Dialog). Rarely edited unless changing design system |
| `src/lib/utils.ts` | **`cn(...)`** for merging Tailwind class names safely |
| `src/hooks/useTheme.ts`, `ThemeToggle.tsx` | Light/dark mode |
| **Section TSX files** | **Content + layout** live together |
| `RecentProjects.tsx` | Example/legacy gallery — **not on homepage** |

---

## GitHub Actions & deploying the live site

Workflow file: `.github/workflows/deploy.yml`

**Triggers**

- Push to **`main`**
- Manual **workflow_dispatch**

**Jobs**

1. **build** (`ubuntu-latest`): `npm ci` → `npm run build` → upload **`dist`** as Pages artifact  
2. **deploy**: publishes that artifact to the **github-pages** environment

**Updating the live website**

1. Commit and **`git push origin main`**.
2. Open **GitHub → Actions → “Deploy to GitHub Pages”** and confirm the run is green.
3. Pages can take **1–10 minutes**. Hard refresh (`Ctrl+F5`) or incognito.

**Changing the deployed subpath**

- Update **`base`** in `vite.config.ts` to match the GitHub Pages path (typically `/<repository-name>/`).

---

## Git branches & workflows

| Practice | Recommendation |
|----------|----------------|
| **Production branch** | `main` |
| Feature work | `feature/your-topic` branches, PR into `main` |
| Hotfix | branch from `main`, merge after review |

There is nothing special server-side — “release” equals **successful Pages deploy** after `main` updates.

Avoid force-push to `shared`/`main` unless you understand history rewrite implications.

---

## Security, backend, and developer tools inspection

### There is no first-party backend

- Users download HTML/JS/CSS. **All frontend code is visible** — this is normal for any website. “Inspect / Sources” shows bundled JS.

### Secrets do not belong in client code

- Anything shipped in the bundle **is public**.
- **`Contact.tsx`** currently supports `VITE_WEB3FORMS_KEY` but historically may ship a fallback constant. **Treat form keys like passwords:**
  - Create **`.env.local`** locally (ignored by Git) with:
    `VITE_WEB3FORMS_KEY=your_key_here`
  - In production builds (GitHub Actions), add **`VITE_WEB3FORMS_KEY`** as an **encrypted repository secret** / **environment variable**, and expose it at build time to Vite (`env:` in workflow or Configure variables in Actions).
  - **Rotate** any key that ever appeared committed in Git history.

### What attackers can/can’t do

- They can **call the same Web3Forms endpoint** anyone can call from curl if they steal your browser bundle key — mitigation is rotation, quotas, CAPTCHA upstream, IP rules on Web3Forms side.
- **No database** means no SQL injection against this repo; risk is misuse of exposed third-party keys and scraped email addresses printed in JSX.

### PDFs / public assets

Anything in `public/` is **world-readable** if someone guesses the URL. Do not upload private scans.

---

## Environment variables

Vite exposes only vars prefixed with **`VITE_`** to client code via `import.meta.env`.

| Variable | Purpose |
|---------|---------|
| `VITE_WEB3FORMS_KEY` | Contact form submissions to Web3Forms |

Locally: `.env.local`  
CI: Repository **Settings → Secrets and variables → Actions** (same name).

---

## Need help extending this doc?

Keep this invariant in mind:

> **Composition order**: `src/pages/Index.tsx`  
> **Content data**: neighboring `*.tsx` in `src/components/`  
> **Static URLs**: `public/`  
> **Bundled assets**: `src/assets/` + imports  

If you stick to those rules, builds stay predictable and GitHub Actions keeps deploying a fresh `dist/` on every **`main`** push.
