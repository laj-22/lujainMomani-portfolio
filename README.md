# Lujain Almomani – Portfolio Website ( Maintainer Guide )

This repository is a **single-page portfolio** built with **Vite + React + TypeScript**. There is **no traditional backend**. The live site on GitHub Pages is the **compiled static output** in `dist/` produced by CI from `main`.

Use this README as an operations manual: file layout, where content lives, how to add sections, assets, tags, links, builds, deployments, and what is safe versus exposed in the browser.

---

## Table of contents

0. [Handoff notes (read first)](#handoff-notes-read-first)
1. [CMS integration (planned)](#cms-integration-planned)
2. [Quick start](#quick-start)
3. [Architecture at a glance](#architecture-at-a-glance)
4. [Repository layout (every important path)](#repository-layout-every-important-path)
5. [How the page is assembled](#how-the-page-is-assembled)
6. [Sections: what each one does & which file owns it](#sections-what-each-one-does--which-file-owns-it)
7. [Adding or editing content](#adding-or-editing-content)
8. [Images: where to put them, sizing, cropping](#images-where-to-put-them-sizing-cropping)
9. [Hyperlinks (internal anchors vs external URLs)](#hyperlinks-internal-anchors-vs-external-urls)
10. [Tags, badges & categories](#tags-badges--categories)
11. [Adding a new major section](#adding-a-new-major-section-checklist)
12. [Adding a new route (multi-page, optional)](#adding-a-new-route-multi-page-optional)
13. [Styling vs data-only files](#styling-vs-data-only-files)
14. [GitHub Actions & deploying the live site](#github-actions--deploying-the-live-site)
15. [Git branches & workflows](#git-branches--workflows)
16. [Security, “backend,” and developer tools inspection](#security-backend-and-developer-tools-inspection)
17. [Environment variables](#environment-variables)

---

## Handoff notes (read first)

State as of **8 November 2026**. If you are a person or an AI picking this up, start here instead of from scratch.

### What changed in the Nov 2026 update

- **Content:** new projects *From Clicks to Collision* (CSAW'25 Hack My Robot, 2nd place, with the full 3-phase write-up and poster link) and *MACH::GO* (Bosch Future Mobility Challenge 2026); real photos for Batterly and the Voice-Controlled Chair; honours badges, "Accepted" publication status, Top Graduate and First Class Honours certificates.
- **Redesign:** calm theme (warm off-white / soft charcoal, one deep-teal accent, contrast checked against WCAG), Geist font self-hosted, follows the visitor's light/dark setting, no stock hero photo, no gradients/glows/bouncing.
- **Layout:** skills as chips in packed columns, publications and About cards in grids, certificates beside the About text, compact project cards, and swipe rows on phones (`.mobile-rail`). Measured page length: phone 12.3 screens (was 19.2), tablet 11.6 (13.8), desktop 10.7 (11.1).
- **Fixes:** literal `\n` showing in project descriptions; invisible Activities icons; ORCID shown with its official iD logo instead of a globe.

### Owner's decisions (keep these unless she says otherwise)

- **MACH::GO:** her role is **"AI Lead"**, listed under Activities → Extracurricular, **not** Professional Experience. Do not describe it as V2X work.
- **No under-review or in-progress papers** anywhere on the site.
- **About section:** no V2X or 5G cards; plain, natural tone; business sense shown implicitly (B2B positioning, explaining systems to people), never a job title like "pre-sales". Don't name JoPACC in the About text. Conference talks: say "international conferences" with no locations (one was online).
- **Writing style:** avoid stock phrases ("innovative solutions", "push the boundaries", "passionate", "seamless") and exclamation marks. Never invent facts; every claim should trace back to the CV, LinkedIn or a project.

### Gotchas

- Images must be in **`public/pictures/`** (served). The top-level `pictures/` folder holds the owner's originals and is not served.
- `--secondary` and `--accent` are **subtle surface colours** (shadcn convention). For coloured text or icons use `text-primary` or `text-muted-foreground`, never `text-secondary` / `text-accent` (they are nearly invisible).
- The CSP in `index.html` only allows self-hosted fonts and scripts. Add fonts through `@fontsource-variable/*` npm packages, not Google Fonts links.
- Deploys need `package-lock.json` updated (CI runs `npm ci`). Install with `npm install --save-exact <pkg>@<version>`.
- `npx tsc --noEmit -p tsconfig.app.json` and `npm run lint` are both clean (0 errors) as of Nov 2026; keep them that way. The Vite build itself does not type-check, so run them yourself before committing. Content JSON link `type`s are plain strings; `resolveLinks()` normalises them.
- Do not commit personal source files (e.g. LinkedIn PDF exports) dropped in the project folder.

### How to check your work

1. `npm run dev` → http://localhost:8080/lujainMomani-portfolio/ (the path suffix is required).
2. Look at it at phone width (~390px), tablet (768px) and desktop, in light and dark.
3. `npm run build:prod` must end with `verify-dist: OK`.
4. Push to `main` deploys to GitHub Pages (see below).

---

## CMS integration (planned)

**CMS is implemented.** Content lives in `src/content/*.json`. Use the Portfolio Manager desktop app to edit — no need to touch React files for routine updates.

| Resource | Path |
|----------|------|
| Integration guide | [`docs/CMS-INTEGRATION.md`](docs/CMS-INTEGRATION.md) |
| Audit (structural) | [`docs/AUDIT.md`](docs/AUDIT.md) |
| Portfolio Manager | [`portfolio-manager/README.md`](portfolio-manager/README.md) |
| Cursor agent skill | [`.cursor/skills/portfolio-cms/`](.cursor/skills/portfolio-cms/) |

**Workflow:**

```text
cd portfolio-manager && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py
→ edit content (rich text, fonts, colors) → Preview → Publish
```

**Legacy workflow** (still works): edit `src/content/*.json` directly, then `git push`.

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
├── .cursor/skills/portfolio-cms/  # Cursor agent skill for CMS modernization
├── docs/
│   ├── CMS-INTEGRATION.md         # CMS project overview and phases
│   └── AUDIT.md                   # Phase 1 audit findings (to be completed)
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

All text lives in **`src/content/*.json`**. The `.tsx` components only lay it out, so most edits never touch code. `src/lib/content.ts` loads the JSON and holds the TypeScript types.

| Section component | DOM `id` | Content file(s) |
|------------------|----------|-----------------|
| `Hero.tsx` | `home` | `site.json` (`name`, `title`, `location`, `honours`, `links`), portrait `src/assets/mypicNew.jpeg` |
| `About.tsx` | `about` | `about.json` (`paragraphs`, `highlights`), certificate images in `public/certificates/`, CV `public/LujainCV.pdf` (`site.cvPath`) |
| `Skills.tsx` | `skills` | `skills.json` (`categories`, `relatedProjects`) |
| `ProjectOfTheMonth.tsx` | `featured` | `thesis.json` |
| `Projects.tsx` | `projects` | `projects.json`, `project-categories.json` |
| `Publications.tsx` | `publications` + `experience` | `publications.json`, `experience.json` |
| `Activities.tsx` | `activities` | `activities.json` |
| `Contact.tsx` | `contact` | `site.json` (`email`, `location`, `links`), Web3Forms |
| Footer (`Index.tsx`) | — | `site.json` → `footer` |

**Unused but present:** `RecentProjects.tsx` (`id="recent"`) is not mounted in `Index.tsx`.

---

## Adding or editing content

General rules for every JSON file:

- **Line breaks:** write a real newline in the string (`"\n"` in JSON). Never a double-escaped `"\\n"`; that prints a literal `\n` on the page (this bug was fixed site-wide in Nov 2026).
- **Bold / links in text:** short HTML is allowed (`<strong>…</strong>`). Plain text is wrapped in paragraphs automatically (`RichText.tsx`).
- **Images:** put the file in `public/pictures/` and reference it as `"pictures/<exact file name>"`. Files in the top-level `pictures/` folder are **not** served.
- After editing, run `npm run build:prod` (build + safety check) before committing.

### Add a project (`src/content/projects.json`)

Copy an existing entry and change it. Fields:

```json
{
  "id": "unique-kebab-id",
  "title": "Project name",
  "description": "One sentence for the card (2 lines are shown).",
  "longDescription": "Paragraph.\n\nKey Features & Technical Details:\n• point\n• point",
  "category": "security",
  "tags": ["Tag", "Tag"],
  "image": "pictures/<file in public/pictures>",
  "featured": false,
  "timeline": "Team project",
  "team": "4 people",
  "impact": ["Short outcome", "Short outcome"],
  "links": [{ "type": "github", "url": "https://…", "label": "Code" }],
  "gallery": [],
  "startDate": "2025-01-01",
  "endDate": "2025-06-30"
}
```

- **`category`** must be an `id` from `project-categories.json` (`embedded`, `iot`, `security`, `robotics`, `robotics-sim`, `autonomy`, `dsp`, `analog`, `ml`, `neteng`, `tools`). Filter chips only appear for categories that have projects.
- **Order:** `featured: true` first, then newest `endDate` (or `startDate`). Array order does not matter.
- Cards show the first 2 tags; the detail modal shows all tags, `impact`, `longDescription` and `links`.
- `gallery` is stored but **not rendered** yet; only `image` is shown.

### Graduation spotlight (`src/content/thesis.json`)

Single object for the "Graduation Project Spotlight" block. The same thesis also exists as a normal project in `projects.json` (`astraips-thesis-2026`); update both.

### Add a publication (`src/content/publications.json`)

Add to the `published` array: `title`, `authors` (start with "Lujain…" to count as first author), `conference`, `year`, `status` (`"published"` or `"accepted"`), optional `abstract`, `doi`, `links`. The stats bar (paper count, first-author count, latest year) is computed automatically. **`underReview` is intentionally empty**: the owner asked that under-review/in-progress papers not be shown.

### Add experience (`src/content/experience.json`)

`{ "id", "title", "meta": "Organisation, place • dates", "bullets": [...], "order": n }`. Lower `order` shows first. Student-team roles (e.g. MACH::GO) belong in **Activities → Extracurricular**, not here.

### Add an award / certificate / activity (`src/content/activities.json`)

Pick the category block (`Honours, Awards & Competitions`, `Certifications & Programs`, `Involvements`, `Extracurricular`, `Academic Involvement`) and add an item: `title`, `role`, `date`, `location`, `achievement`, `description`, `tags`, and either `link` or `links`. A certificate image can be linked with `{ "type": "other", "url": "certificates/<file>.jpg", "label": "View Certificate" }` (file in `public/certificates/`).

### Add a skill (`src/content/skills.json`)

Add `{ "name": "…", "icon": "Code" }` to a category's `skills`. To make it clickable with a project count, add `"<skill name>": ["Project title", …]` under `relatedProjects`. Icon names must exist in `src/lib/icons.tsx`.

### About cards & text (`src/content/about.json`)

`paragraphs` (3 short paragraphs) and `highlights` (6 cards: `icon`, `title`, `description`). Keep the tone plain and specific; see the handoff notes below.

### Site-wide links (`src/content/site.json` → `links`)

Shown in the hero and Contact. Types: `github`, `linkedin`, `email` (`mailto:`), `orcid` (official ORCID iD logo), `website`, `youtube`, `paper`, `doi`, `other`. Any `orcid.org` URL gets the ORCID logo automatically.

### Footer text

`site.json` → `footer`.

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

- **Projects:** `category` must match an id in `project-categories.json`; `tags` are free text; `featured: true` adds the badge and the Featured filter.
- **Publications:** the badge comes from `status` (`accepted` / `published`).
- **Activities:** free-text `tags` and an `achievement` label per item.

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
| `src/hooks/useTheme.ts`, `ThemeToggle.tsx` | Light/dark mode. Follows the visitor's system setting until they use the toggle; the choice is then remembered |
| **Section TSX files** | **Content + layout** live together |
| `RecentProjects.tsx` | Example/legacy gallery — **not on homepage** |

### Design system (calm theme)

- **Palette:** warm off-white paper (light) and soft charcoal (dark), with a single deep-teal accent (`--primary`). Every text/background pair was checked against WCAG contrast (body text 13:1+, secondary text 7:1+), base size 17px. `--secondary` and `--accent` are subtle tinted surfaces (shadcn convention), not extra brand colours: use `text-primary` or `text-muted-foreground` for coloured text. All tokens are HSL in `src/index.css` (`:root` and `.dark`).
- **Fonts:** Geist (body) and Geist Mono (labels, counts), self-hosted through `@fontsource-variable/*` and imported in `src/main.tsx`. No Google Fonts request, so the page's CSP (`font-src 'self' data:`) stays strict and the fonts work on GitHub Pages.
- **Utility classes:** `.btn-hero` (filled), `.btn-cyber` / `.btn-forest` (outline), `.project-card`, `.section-header`, `.eyebrow` (small mono label).
- **Motion:** short colour/translate transitions only; everything is switched off for visitors with "reduce motion" enabled.
- **Phones (`.mobile-rail`):** below 640px, the About cards, Skills, Publications and Experience become a sideways swipe row (cards 85% wide so the next one peeks in) to keep the page short. From 640px up they are normal grids. Add the class to any grid/column container to get the same behaviour.
- **Link types:** besides `github`, `linkedin`, `email`, etc., there is an `orcid` type that shows the official ORCID iD mark (`src/lib/OrcidIcon.tsx`). Any `orcid.org` URL gets it automatically.

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
