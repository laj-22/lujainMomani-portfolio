# CMS Integration Guide

This document describes the plan to transform the portfolio from manually edited React components into a **data-driven site** managed by a **private desktop application**.

## Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Audit existing components and content | Complete |
| 2 | Extract content to `src/content/*.json` | Complete |
| 3 | Verify build and visual parity | Complete |
| 4 | Build Portfolio Manager (PySide6) | Complete |
| 5 | Asset management (images, PDFs) | Complete |
| 6 | Local preview via Vite dev server | Complete |
| 7 | Git publish workflow | Complete |

Update this table as phases complete.

## Goal

```text
Today:  Edit Projects.tsx, Skills.tsx, etc. → commit → deploy
Target: Open Portfolio Manager → edit in GUI → preview → publish → deploy
```

The **website design stays identical**. Only the content workflow changes.

## Architecture

```text
┌─────────────────────────┐     ┌──────────────────────────┐
│  portfolio-manager/     │     │  lujainMomani-portfolio/ │
│  (Python + PySide6)     │     │  (Vite + React SPA)      │
│  Private desktop app    │────▶│  src/content/*.json      │
│  CRUD, validate, git    │     │  public/pictures/        │
└─────────────────────────┘     └──────────────────────────┘
           │                                │
           │  git commit + push             │  npm run build
           ▼                                ▼
                    GitHub Actions → GitHub Pages
```

- **Public site:** static JSON + React (no backend, no admin routes)
- **Manager:** local only, writes JSON and assets, handles git publish
- **Content store:** JSON files in Git (not a database)

## Content files (planned)

```text
src/content/
  projects.json       ← Projects.tsx
  skills.json         ← Skills.tsx
  thesis.json         ← ProjectOfTheMonth.tsx featuredProject
  publications.json   ← Publications.tsx
  activities.json     ← Activities.tsx
  achievements.json   ← if needed
  education.json      ← if split from Publications
  experience.json     ← if split from Publications
  site.json           ← Hero, Contact, footer metadata
```

Exact files are finalized during Phase 1 audit. See [audit checklist](../.cursor/skills/portfolio-cms/audit-checklist.md).

## Portfolio Manager

Location: `portfolio-manager/` (sibling or subfolder — to be created in Phase 4)

Stack: Python 3 + PySide6

Features:

- Dashboard with content counts and git status
- CRUD for projects, skills, publications, activities, thesis
- Featured project selector
- Drag-and-drop image upload to `public/pictures/`
- Validate JSON and asset references
- Preview via `npm run dev` (port 8080)
- Publish: show diff → confirm → commit → push

## Rules (non-negotiable)

1. Do not redesign the website
2. Inspect components before modifying
3. Use `import.meta.env.BASE_URL` for all asset URLs
4. No `/admin` in the public React app
5. No secrets in the public repository
6. Never `git reset --hard` or `git push --force` from the manager

## Cursor skill

An agent skill lives at `.cursor/skills/portfolio-cms/` with workflows, schemas, and the full specification.

Use it in Cursor:

```text
@portfolio-cms implement phase 2 content extraction
```

Skill files:

- [SKILL.md](../.cursor/skills/portfolio-cms/SKILL.md) — agent instructions
- [reference.md](../.cursor/skills/portfolio-cms/reference.md) — full spec
- [schemas.md](../.cursor/skills/portfolio-cms/schemas.md) — JSON schemas
- [audit-checklist.md](../.cursor/skills/portfolio-cms/audit-checklist.md) — Phase 1 template

## Verification

After each phase:

```bash
npm run lint
npm run build
npm run dev   # manual check: desktop, mobile, filters, images, links
```

Visual output must match the pre-CMS site.

## Acceptance test

1. Open Portfolio Manager
2. Create a new project with image, skills, tags, links
3. Save → Preview → see project in existing card design
4. Publish → git push → GitHub Actions green → live site updated

No manual edits to section TSX files for routine content changes.

## See also

- [README.md](../README.md) — current maintainer guide (pre-CMS workflow)
- [AUDIT.md](./AUDIT.md) — Phase 1 findings (create during audit)
