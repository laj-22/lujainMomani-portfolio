# Lujain Portfolio — CMS Integration Specification (Full Reference)

This document is the complete specification for the portfolio CMS modernization project. The agent skill [`SKILL.md`](SKILL.md) summarizes workflows; this file contains full requirements.

---

## Existing Repository

GitHub repository: `laj-22/lujainMomani-portfolio`

Repository: `https://github.com/laj-22/lujainMomani-portfolio`

This is an existing, functioning portfolio. **Do not rebuild it from scratch.**

The repository is currently a:

* Vite application
* React 18 SPA
* TypeScript
* Tailwind CSS
* React Router
* shadcn/ui components
* GitHub Actions deployment
* GitHub Pages hosting

The production site is static. There is currently no traditional backend/database.

The current architecture and existing visual design MUST be preserved.

---

## PRIMARY GOAL

Transform the existing portfolio from a manually maintained portfolio into a **data-driven portfolio with a private local content-management application**.

Currently, adding or editing portfolio content requires manually editing React/TypeScript source files.

Instead: a private GUI manages portfolio content. After Save, the manager updates structured content files and assets. No manual React/TypeScript editing for normal content.

---

## CRITICAL RULE #1 — DO NOT REDESIGN THE EXISTING WEBSITE

Do NOT:

* redesign the UI
* replace Tailwind, React, Vite, or shadcn/ui
* rewrite existing components unnecessarily
* change animations, colors, typography, spacing, navigation
* change responsive behavior or existing filtering behavior
* remove existing sections or functionality

The objective is to change **where content comes from**, not how the website looks.

---

## CRITICAL RULE #2 — INSPECT BEFORE MODIFYING

Before changing any code, inspect:

```text
src/main.tsx, src/App.tsx, src/pages/Index.tsx
src/components/Hero.tsx, About.tsx, Skills.tsx, ProjectOfTheMonth.tsx
src/components/Projects.tsx, Publications.tsx, Activities.tsx, Contact.tsx
src/components/ui/*, src/hooks/*, src/lib/*
public/*, pictures/*
package.json, vite.config.ts, tailwind.config.ts
.github/workflows/deploy.yml
```

Determine: where content lives, component field expectations, project/skill representation, filtering, featured project, image/PDF references, Vite vs public assets, presentation-only components, files that must remain untouched.

---

## CURRENT PAGE STRUCTURE

```text
Hero → About → Skills → Project of the Month → Projects → Publications → Activities → Contact
```

Preserve this order unless explicitly requested otherwise.

---

## NEW CONTENT ARCHITECTURE

```text
src/content/
  projects.json, skills.json, publications.json, activities.json
  achievements.json, thesis.json, education.json, experience.json, site.json
```

Do not blindly create this exact structure — inspect first and choose the safest equivalent.

Key requirement: **Content must be separated from presentation.**

---

## PROJECT DATA

Fields (adapt to existing `Project` interface in `Projects.tsx`):

`id`, `title`, `description`, `shortDescription`, `image`, `skills`, `tags`, `category`, `date`, `github`, `demo`, `documentation`, `publication`, `featured`, `order`

Current interface also includes: `longDescription`, `timeline`, `team`, `impact`, `gallery`, `startDate`, `endDate`.

---

## PROJECT FILTERING

Preserve existing category chips in `Projects.tsx`. New skills/tags in content must auto-appear in filters without manual filter-code updates.

---

## FEATURED PROJECT

`ProjectOfTheMonth.tsx` — single featured project from structured content. Manager provides dropdown to select featured project. Enforce single-featured rule.

---

## SKILLS

Manager supports: add, edit, delete, rename, categorize, reorder, associate with projects.

Categories should reflect existing portfolio (Programming, Engineering, Cybersecurity, Networking, IoT, Software, Hardware, Tools, Operating Systems, Other).

---

## PUBLICATIONS

Fields: `id`, `title`, `authors`, `description`, `venue`, `date`, `doi`, `url`, `pdf`, `project`, `skills`, `featured`, `order`

---

## ACTIVITIES

Fields matching current `Activities.tsx`: `id`, `title`, `description`, `date`, `category`, `skills`, `image`, `url`, `project`, `order`

---

## ACHIEVEMENTS

If applicable: `id`, `title`, `description`, `organization`, `date`, `category`, `image`, `certificate`, `url`, `featured`, `order`

---

## THESIS

Dedicated `thesis.json`: `title`, `subtitle`, `abstract`, `description`, `researchArea`, `keywords`, `supervisor`, `university`, `date`, `methodology`, `technologies`, `image`, `pdf`, `github`, `publication`, `featured`

Existing thesis presentation in `ProjectOfTheMonth.tsx` must remain unchanged visually.

---

## IMAGES

Manager supports drag-and-drop upload:

1. Validate image
2. Generate safe filename
3. Place in correct public asset directory
4. Update content record
5. Ensure GitHub Pages base path compatibility
6. Do not break existing asset URLs

Prefer WebP where appropriate; do not blindly convert existing assets.

---

## GITHUB PAGES BASE PATH

Use `import.meta.env.BASE_URL` and React Router `basename={import.meta.env.BASE_URL}`.

Do not hard-code root-relative URLs that break under `/lujainMomani-portfolio/`.

---

## PRIVATE PORTFOLIO MANAGER

Separate app: **Python + PySide6** in `portfolio-manager/`. NOT part of the public React application.

### Manager navigation

```text
Dashboard
Content: Projects, Skills, Featured Project, Thesis, Publications, Activities, Achievements, Education, Experience, Site Information
Assets: Images, Documents
Tools: Preview, Validate, Publish
```

### Dashboard

Show counts (projects, skills, publications, activities, achievements), git status, last commit, last publish.

Buttons: + New Project, + New Achievement, Edit Thesis, Preview Portfolio, Validate, Publish.

### Local preview

Connect to existing Vite dev server (`npm run dev`, port 8080). Do not create a second frontend copy.

### Publishing

```text
Edit → Save → Validate → Preview → Git diff → User confirms → git add → commit → push → GitHub Actions → GitHub Pages
```

### Git safety

Never: `git reset --hard`, `git push --force`. Never delete unrelated files. Show changes before publish.

### Validation

JSON validity, unique IDs, required fields, valid URLs, existing images/PDFs, no broken references, project/skill relationships, featured constraints.

### Security

No `/admin` routes in public app. No passwords/tokens in public repo. Manager uses local Git authentication.

### Database

No MySQL/PostgreSQL/MongoDB for public site. Optional SQLite inside manager only — public build must not depend on it.

---

## IMPLEMENTATION PHASES

1. **Audit** — document current state (no code changes)
2. **Extract content** — move data to JSON, components import JSON
3. **Verify** — lint, build, visual parity
4. **Build manager** — PySide6, start with Projects/Skills/Featured/Thesis/Publications/Activities/Achievements
5. **Asset management** — drag-drop, safe filenames, PDFs
6. **Preview** — Vite dev server integration
7. **Git publishing** — status, diff, commit, push with confirmation

---

## FINAL ACCEPTANCE TEST

```text
Open Portfolio Manager → Projects → New Project → drag image → enter title/description
→ select skills/tags → enter GitHub/demo → choose Featured → Save → Preview
→ see NEW project in EXISTING design → Publish → git commit + push → GitHub Actions → Pages updates
```

Never require manual edits to `Projects.tsx`, `Skills.tsx`, `ProjectOfTheMonth.tsx`, `Publications.tsx`, `Activities.tsx` for normal content.

---

## NON-NEGOTIABLE PRINCIPLE

Existing portfolio modernization — NOT a new portfolio.

Preserve: UI, design, animations, filtering, navigation, responsive behavior, deployment, GitHub Pages setup.

Change workflow from **MANUALLY EDIT REACT CODE** to **OPEN PRIVATE MANAGER → EDIT → PREVIEW → PUBLISH**.

If a proposed change could alter visual design or functionality, stop and explain before making the change.
