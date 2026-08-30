from __future__ import annotations

import json

from .assets import image_exists
from .constants import COLOR_OPTIONS, ICON_OPTIONS
from .links import PROJECT_LEGACY, coerce_links, valid_url
from .paths import CONTENT_DIR
from .store import ContentStore


def validate_all(store: ContentStore) -> tuple[list[str], list[str]]:
    """Return (errors, warnings). Errors block publish; warnings are informational."""
    errors: list[str] = []
    warnings: list[str] = []
    projects = store.read("projects")
    ids: set[str] = set()
    featured_count = 0

    for project in projects:
        pid = project.get("id", "")
        title = project.get("title") or pid or "?"
        if not project.get("title"):
            errors.append(f'Project "{pid or "?"}" has no title.')
        if pid in ids:
            errors.append(f"Duplicate project id: {pid}")
        ids.add(pid)
        if project.get("featured"):
            featured_count += 1
        if not project.get("description"):
            warnings.append(f'Project "{title}" has no short description.')
        image = (project.get("image") or "").strip()
        if image and not image_exists(image):
            warnings.append(
                f'Project "{title}" image not found: {image} (run: python scripts/sync_assets.py)'
            )
        for link in coerce_links(project, PROJECT_LEGACY):
            url = link.get("url", "")
            if url and not valid_url(url):
                errors.append(f'Project "{title}" has invalid link ({link.get("type", "?")}).')

    if featured_count > 1:
        warnings.append(
            f"{featured_count} projects marked featured — use Featured Project tab "
            "or check Featured on one project and save to keep only one."
        )

    thesis = store.read("thesis")
    if not thesis.get("title"):
        warnings.append("Thesis spotlight has no title.")

    activities = store.read("activities")
    seen_cats: set[str] = set()
    for block in activities:
        cat_name = block.get("category", "")
        if cat_name in seen_cats:
            errors.append(f'Duplicate activities category: "{cat_name}"')
        seen_cats.add(cat_name)
        icon = block.get("icon", "")
        if icon and icon not in ICON_OPTIONS:
            warnings.append(f'Activities "{cat_name}" uses unknown icon "{icon}" — pick from the icon dropdown.')
        color = block.get("color", "")
        if color and color not in COLOR_OPTIONS:
            warnings.append(f'Activities "{cat_name}" has invalid color "{color}" (use primary, secondary, or accent).')

    site = store.read("site")
    if not site.get("name"):
        errors.append("site.json: name is required.")
    cv = store.cv_status()
    if not cv.get("exists"):
        warnings.append("CV not found at public/LujainCV.pdf — upload in Site or Assets tab.")

    for key in CONTENT_DIR.glob("*.json"):
        try:
            json.loads(key.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid JSON: {key.name} ({exc})")

    return errors, warnings
