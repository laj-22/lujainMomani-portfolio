# Content Schemas

Adapt field names to match existing component interfaces after Phase 1 audit. These are target schemas for `src/content/`.

## projects.json

Array of project objects.

```json
{
  "id": "vanet-ids",
  "title": "VANET Intrusion Detection System",
  "description": "Short card description.",
  "longDescription": "Full modal description.",
  "category": "security",
  "tags": ["Cybersecurity", "Networking", "Research"],
  "skills": ["Python", "Machine Learning", "NS-3"],
  "image": "/lujainMomani-portfolio/pictures/vanet-ids.webp",
  "github": "https://github.com/...",
  "demo": "",
  "featured": false,
  "timeline": "2026",
  "team": "Solo",
  "impact": ["Bullet one", "Bullet two"],
  "gallery": [],
  "startDate": "2025-09-01",
  "endDate": "2026-05-01",
  "order": 1
}
```

**Notes:**

- `category` must match filter chip `id` values in `Projects.tsx` (`iot`, `security`, `embedded`, etc.)
- `image` paths must work with `import.meta.env.BASE_URL`
- Only one project should have `featured: true` if using boolean; featured spotlight may also reference `thesis.json`

## skills.json

```json
{
  "categories": [
    {
      "id": "programming",
      "label": "Programming",
      "order": 1,
      "skills": [
        { "id": "python", "name": "Python", "order": 1, "projectFilter": "python" }
      ]
    }
  ]
}
```

## thesis.json

Maps to `featuredProject` in `ProjectOfTheMonth.tsx`.

```json
{
  "id": "astraips-thesis-2026",
  "title": "Graduation Project Thesis: AstraIPS",
  "subtitle": "",
  "description": "Short spotlight text.",
  "longDescription": "Full expandable text.",
  "abstract": "",
  "researchArea": "IoT Cybersecurity",
  "keywords": ["MQTT", "Intrusion Prevention"],
  "supervisor": "",
  "university": "",
  "date": "2026",
  "methodology": "",
  "technologies": [],
  "image": "thesis.png",
  "pdf": "",
  "github": "https://github.com/laj-22/AstraIPS",
  "publication": "Under review — IEEE Access",
  "featured": true,
  "tags": ["Featured", "Cybersecurity", "IoT"],
  "achievements": ["98% mean detection accuracy"],
  "tech": [
    { "name": "Snort 3", "role": "Signature-based detection" }
  ]
}
```

## publications.json

```json
[
  {
    "id": "pub-1",
    "title": "Paper title",
    "authors": "L. Almomani et al.",
    "description": "",
    "venue": "IEEE Access",
    "date": "2026",
    "status": "under-review",
    "doi": "",
    "url": "",
    "pdf": "",
    "project": "astraips-thesis-2026",
    "skills": [],
    "featured": false,
    "order": 1
  }
]
```

## activities.json

```json
[
  {
    "id": "activity-1",
    "title": "Competition name",
    "description": "",
    "date": "2025",
    "category": "competition",
    "skills": [],
    "image": "",
    "url": "",
    "project": "",
    "order": 1
  }
]
```

## achievements.json

```json
[
  {
    "id": "achievement-1",
    "title": "",
    "description": "",
    "organization": "",
    "date": "2025",
    "category": "",
    "image": "",
    "certificate": "",
    "url": "",
    "featured": false,
    "order": 1
  }
]
```

## education.json / experience.json

Create only if audit finds distinct data in `Publications.tsx` or other components that should be split.

## site.json

```json
{
  "name": "Lujain Almomani",
  "title": "Portfolio tagline",
  "email": "",
  "linkedin": "",
  "github": "",
  "cvPath": "LujainCV.pdf",
  "footer": "© 2026 Lujain Almomani"
}
```

## Validation rules

| Rule | Check |
|------|-------|
| Unique IDs | No duplicate `id` within each file |
| Required fields | `id`, `title` minimum for content items |
| Category match | Project `category` exists in filter definitions or is derivable |
| Image exists | File present under `public/` or valid bundled import path |
| URLs | `github`, `demo`, `url` are valid HTTPS or empty |
| Featured | At most one featured thesis/spotlight selection |
| Base path | Public image paths respect `BASE_URL` |
