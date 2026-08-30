# portfolio-cms Skill

Cursor Agent Skill for modernizing the Lujain portfolio with a JSON content layer and private Portfolio Manager.

## What this skill does

Teaches the agent how to:

1. Audit the existing portfolio without redesigning it
2. Extract hard-coded TSX content into `src/content/*.json`
3. Build a private PySide6 `portfolio-manager/` desktop app
4. Validate, preview, and publish changes via Git

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill — workflows, rules, phases (loaded by Cursor) |
| `reference.md` | Full CMS integration specification |
| `audit-checklist.md` | Phase 1 inspection template |
| `schemas.md` | Target JSON schemas for content files |
| `README.md` | This file |

## How to use

### In Cursor

Attach or mention the skill when working on CMS tasks:

```text
@portfolio-cms extract projects content to JSON
```

Or reference the skill path:

```text
.cursor/skills/portfolio-cms
```

### Trigger scenarios

- Extracting content from `Projects.tsx`, `Skills.tsx`, etc.
- Creating `src/content/` JSON files
- Building `portfolio-manager/` (Python + PySide6)
- Adding/editing projects, skills, publications without touching React
- Git publish workflow from the manager

## Related documentation

- [docs/CMS-INTEGRATION.md](../../docs/CMS-INTEGRATION.md) — project-level overview
- [README.md](../../README.md) — maintainer guide for the live site

## Important constraints

- **Never redesign** the existing portfolio UI
- **Never add** `/admin` routes to the public React app
- **Always preserve** GitHub Pages `BASE_URL` asset paths
- **Always inspect** before modifying components
