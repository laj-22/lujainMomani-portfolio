# Portfolio Manager

Private **PySide6** desktop app for managing portfolio content without editing React or raw JSON by hand.

## Setup

```bash
cd portfolio-manager
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## How it works

Every content tab has:

- **Left:** normal forms — dropdowns, text fields, rich text (fonts & colors)
- **Right:** read-only JSON preview + file picker + **Open folder** button

You edit like a human; the app writes valid `src/content/*.json` for you.

## Tabs

| Tab | What you can do |
|-----|-----------------|
| **Projects** | Select project dropdown → edit all fields like thesis (category dropdown, image picker, tags, impact bullets, rich descriptions) |
| **Thesis / Spotlight** | Graduation bar — title, tech stack, achievements, rich text |
| **Skills** | Category + skill dropdowns, icons, colors, link related projects |
| **Featured Project** | Pick which project gets the Featured filter |
| **Publications** | Published vs under-review sections, paper dropdown |
| **Activities** | Category + activity dropdown, full form |
| **Experience** | Role dropdown, bullets list |
| **Site Information** | Name, email, LinkedIn, about rich text |
| **Assets** | Upload images → `public/pictures/` |
| **Validate** | Errors (block publish) vs warnings (missing images, etc.) |
| **Preview** | Starts Vite dev server, waits until ready, opens browser |
| **Publish** | Git diff → commit message → push → GitHub Actions → Pages |

## Rich text editor

Font family, size, **bold / italic / underline**, text color, highlight, headings — like a mini Word processor.

## Preview tips

- URL: `http://127.0.0.1:8080/lujainMomani-portfolio/` (or next free port if 8080 is busy)
- Click **Start / Open Preview** — wait a few seconds if the page is blank, then refresh
- Many project images use the site's fallback loader; upload images via **Assets** to fix warnings

## Publish workflow

1. **Validate** — fix any red errors
2. **Preview** — check the site locally
3. **Publish** — review git diff, enter commit message, confirm
4. GitHub Actions on `main` builds and deploys to Pages

Never runs `git reset --hard` or `git push --force`.

## Content files

```
src/content/
  projects.json
  project-categories.json
  thesis.json
  skills.json
  publications.json
  activities.json
  experience.json
  about.json
  site.json
```
