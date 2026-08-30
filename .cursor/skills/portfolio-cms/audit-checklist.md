# Phase 1 — Portfolio Audit Checklist

Complete this audit **before modifying any code**. Document findings in `docs/AUDIT.md`.

## Components to inspect

```text
[ ] src/main.tsx
[ ] src/App.tsx
[ ] src/pages/Index.tsx
[ ] src/components/Hero.tsx
[ ] src/components/About.tsx
[ ] src/components/Skills.tsx
[ ] src/components/ProjectOfTheMonth.tsx
[ ] src/components/Projects.tsx
[ ] src/components/Publications.tsx
[ ] src/components/Activities.tsx
[ ] src/components/Contact.tsx
[ ] src/components/Navigation.tsx
[ ] src/hooks/useActiveSection.ts
[ ] src/hooks/*
[ ] src/lib/utils.ts
```

## Build & deploy

```text
[ ] package.json scripts and dependencies
[ ] vite.config.ts (base path, port, aliases)
[ ] tailwind.config.ts
[ ] .github/workflows/deploy.yml
[ ] public/* (robots.txt, 404.html, spa-redirect.js)
```

## Assets

```text
[ ] src/assets/* (bundled imports)
[ ] public/pictures/* (URL-based project images)
[ ] public/LujainCV.pdf
[ ] thesis.png (root, imported by components)
[ ] Image fallback logic in Projects.tsx (getTitleBases, onError)
```

## Document for each section

| Section | Component | DOM id | Data location | Fields used | Image strategy |
|---------|-----------|--------|---------------|-------------|----------------|
| Hero | | | | | |
| About | | | | | |
| Skills | | | | | |
| Featured | | | | | |
| Projects | | | | | |
| Publications | | | | | |
| Activities | | | | | |
| Contact | | | | | |

## Projects deep dive

```text
[ ] Count of projects in Projects.tsx
[ ] Project interface fields (id, title, description, longDescription, category, tags, image, github, demo, featured, timeline, team, impact, gallery, startDate, endDate)
[ ] Category filter ids in categories[] (all, featured, embedded, iot, security, robotics, ...)
[ ] How featured filter works (featured: boolean)
[ ] Modal/detail view fields
[ ] Sort order logic (startDate/endDate)
[ ] publicBase usage for image URLs
```

## Featured / thesis

```text
[ ] featuredProject object in ProjectOfTheMonth.tsx
[ ] Relationship to thesis.png and AstraIPS project
[ ] achievements[] and tech[] sub-structures
[ ] Whether featured project duplicates a Projects.tsx entry
```

## Skills

```text
[ ] Skill groups and categories in Skills.tsx
[ ] Links to #projects filters
[ ] Icons or badges used
```

## Publications & experience

```text
[ ] Publication card fields
[ ] Under-review vs published distinction
[ ] Professional experience timeline structure
[ ] DOM ids (publications, experience)
```

## Activities

```text
[ ] Block types (competitions, certifications, extracurriculars)
[ ] Fields per activity item
```

## Files to leave untouched (unless required)

```text
[ ] src/components/ui/* (shadcn primitives)
[ ] src/lib/utils.ts
[ ] public/spa-redirect.js, public/404.html
[ ] Theme hooks and ThemeToggle
```

## Navigation & scroll

```text
[ ] sections[] in Navigation.tsx
[ ] sections[] in useActiveSection.ts
[ ] ProjectOfTheMonth uses id="featured" but nav may not list it
```

## Output

Save audit results to `docs/AUDIT.md` with:

1. Content inventory (what exists today)
2. Proposed `src/content/*.json` file list
3. Field mapping (TSX field → JSON field)
4. Asset migration plan (bundled vs public)
5. Risks and files that must not change
