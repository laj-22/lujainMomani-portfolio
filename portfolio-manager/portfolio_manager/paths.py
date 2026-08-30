from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_DIR = REPO_ROOT / "src" / "content"
PUBLIC_DIR = REPO_ROOT / "public"
PICTURES_DIR = PUBLIC_DIR / "pictures"

CONTENT_FILES = {
    "projects": CONTENT_DIR / "projects.json",
    "categories": CONTENT_DIR / "project-categories.json",
    "thesis": CONTENT_DIR / "thesis.json",
    "publications": CONTENT_DIR / "publications.json",
    "experience": CONTENT_DIR / "experience.json",
    "activities": CONTENT_DIR / "activities.json",
    "skills": CONTENT_DIR / "skills.json",
    "about": CONTENT_DIR / "about.json",
    "site": CONTENT_DIR / "site.json",
}
