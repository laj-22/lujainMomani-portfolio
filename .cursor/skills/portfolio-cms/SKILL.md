---
name: portfolio-cms
description: Modernizes the Lujain portfolio from hard-coded React content to JSON-driven content with a private PySide6 Portfolio Manager. Preserves existing UI, design, animations, filtering, and GitHub Pages deployment. Use when editing portfolio content, extracting data from TSX components, building the portfolio-manager app, adding projects/skills/publications, or implementing CMS workflows in lujainMomani-portfolio.
---

# Portfolio CMS Integration

Transform this portfolio from **manually edited React/TypeScript** to **structured JSON content + private local manager** — without changing how the site looks.

## Non-negotiable rules

1. **Do NOT redesign the website.** Change where content comes from, not presentation.
2. **Inspect before modifying.** Read current components and assets first; do not guess schemas.
3. **Preserve GitHub Pages compatibility.** Use `import.meta.env.BASE_URL`; never hard-code root-relative asset paths.
4. **No admin routes in the public SPA.** The manager is a separate private app (`portfolio-manager/`).
5. **No database on the public site.** Content = JSON/YAML + Git. Static Vite build only.

## Repository context

| Item | Value |
|------|-------|
| Repo | `laj-22/lujainMomani-portfolio` |
| Stack | Vite, React 18, TypeScript, Tailwind, shadcn/ui, React Router |
| Dev server | `npm run dev` on port **8080** (`vite.config.ts`) |
| Base path | `/lujainMomani-portfolio/` |
| Deploy | GitHub Actions → GitHub Pages on push to `main` |

### Homepage section order (preserve)

`Hero` → `About` → `Skills` → `ProjectOfTheMonth` → `Projects` → `Publications` → `Activities` → `Contact`

Composition lives in `src/pages/Index.tsx`.

### Content currently lives in

| Section | File | Notes |
|---------|------|-------|
| Featured / thesis spotlight | `src/components/ProjectOfTheMonth.tsx` | `featuredProject` object |
| Projects grid + filters | `src/components/Projects.tsx` | `projects[]`, `categories[]` |
| Skills | `src/components/Skills.tsx` | Inline skill groups |
| Publications + experience | `src/components/Publications.tsx` | Publications, timelines |
| Activities | `src/components/Activities.tsx` | Competitions, certs |
| Hero, About, Contact | respective `src/components/*.tsx` | Mixed inline content |
| Site metadata | `src/pages/Index.tsx` footer | Copyright line |

### Assets

- **Bundled imports:** `src/assets/`, `thesis.png` (Vite hashed output)
- **Public URLs:** `public/pictures/`, `public/LujainCV.pdf`
- Projects use `publicBase` + fallback image resolution in `Projects.tsx`

## Implementation phases

Copy this checklist and track progress:

```
Phase 1 — Audit
- [ ] Document components, content, assets, filters, featured project, build, deploy
- [ ] See audit-checklist.md

Phase 2 — Extract content
- [ ] Move hard-coded data to src/content/*.json
- [ ] Components import JSON; rendering logic unchanged

Phase 3 — Verify
- [ ] npm run lint && npm run build
- [ ] Visual parity: desktop, mobile, filters, images, links, animations

Phase 4 — Build manager (PySide6)
- [ ] Projects, Skills, Featured, Thesis, Publications, Activities, Achievements

Phase 5 — Asset management
- [ ] Drag-drop images, safe filenames, PDF handling

Phase 6 — Preview
- [ ] Launch/connect to existing Vite dev server (port 8080)

Phase 7 — Git publishing
- [ ] status → diff → user confirms → commit → push
```

## Content architecture

Preferred layout (adapt after audit — do not blindly create unused files):

```text
src/content/
  projects.json
  skills.json
  publications.json
  activities.json
  achievements.json
  thesis.json
  education.json
  experience.json
  site.json
```

Components handle layout/styling/filtering/rendering. JSON holds titles, descriptions, tags, skills, dates, links, images.

### Project fields (adapt to existing `Project` interface)

`id`, `title`, `description`, `longDescription`, `category`, `tags`, `image`, `github`, `demo`, `featured`, `timeline`, `team`, `impact`, `gallery`, `startDate`, `endDate`, `order`

### Filtering rule

Filters must derive from content data. Adding a project with new skills/tags must auto-appear in filters — never require manual filter-code edits.

### Featured project rule

Single featured project. `ProjectOfTheMonth.tsx` renders from structured data; manager lets user pick which project is featured.

## Portfolio Manager (`portfolio-manager/`)

Separate **Python + PySide6** desktop app — NOT part of the React bundle.

### Navigation

```text
Dashboard
Content → Projects, Skills, Featured Project, Thesis, Publications, Activities, Achievements, Education, Experience, Site Information
Assets → Images, Documents
Tools → Preview, Validate, Publish
```

Implement only sections relevant to existing portfolio content.

### CRUD requirements

Every content type: Create, Read, Update, Delete, Reorder, Duplicate, Search, Filter, Preview. GUI is primary — not raw JSON editing.

### Publishing workflow

```text
Edit → Save → Validate → Preview → Show git diff → User confirms → git add → commit → push → GitHub Actions → GitHub Pages
```

### Git safety

Never run `git reset --hard` or `git push --force`. Show changed files before publish. Preserve unrelated local modifications.

### Validation (before publish)

- JSON validity, unique IDs, required fields
- Valid URLs, existing image/PDF files, no broken references
- Valid project/skill relationships, single-featured constraint

## Acceptance test

```text
Open Portfolio Manager → Projects → New Project → drag image → enter fields → Save
→ Preview → see new project in EXISTING design → Publish → commit + push → Pages updates
```

At no point should normal content edits require opening `Projects.tsx`, `Skills.tsx`, `ProjectOfTheMonth.tsx`, `Publications.tsx`, or `Activities.tsx`.

## When a change might alter the UI

Stop and explain to the user before proceeding.

## Additional resources

- Full specification: [reference.md](reference.md)
- Phase 1 audit template: [audit-checklist.md](audit-checklist.md)
- Data schemas: [schemas.md](schemas.md)
- Maintainer docs: [docs/CMS-INTEGRATION.md](../../../docs/CMS-INTEGRATION.md)
