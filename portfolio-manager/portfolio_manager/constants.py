"""Shared constants loaded from portfolio content."""

from __future__ import annotations

import json
from functools import lru_cache

from .assets import list_all_images
from .paths import CONTENT_DIR

ICON_OPTIONS = [
    "Activity",
    "Award",
    "BookOpen",
    "Bot",
    "Code",
    "Cog",
    "Cpu",
    "Gauge",
    "Medal",
    "Radio",
    "Shield",
    "Star",
    "Terminal",
    "Trophy",
    "Users",
    "Wifi",
    "Wrench",
]

COLOR_OPTIONS = ["primary", "secondary", "accent"]

PUBLICATION_STATUS = ["published", "under-review", "in-progress"]

ACTIVITY_CATEGORIES = [
    "Competitions",
    "Certifications & Programs",
    "Involvements",
    "Extracurricular",
    "Academic Involvement",
]

ACTIVITY_CATEGORY_DEFAULTS: dict[str, dict[str, str]] = {
    "Competitions": {"icon": "Trophy", "color": "primary"},
    "Certifications & Programs": {"icon": "Award", "color": "secondary"},
    "Involvements": {"icon": "Medal", "color": "accent"},
    "Extracurricular": {"icon": "Users", "color": "primary"},
    "Academic Involvement": {"icon": "BookOpen", "color": "secondary"},
}


@lru_cache
def load_categories() -> list[dict]:
    path = CONTENT_DIR / "project-categories.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return [c for c in data if c.get("id") not in ("all", "featured")]


def clear_categories_cache() -> None:
    load_categories.cache_clear()


@lru_cache
def load_project_titles() -> list[str]:
    projects = json.loads((CONTENT_DIR / "projects.json").read_text(encoding="utf-8"))
    return [p.get("title", "") for p in projects if p.get("title")]


def all_image_options() -> list[str]:
    return [""] + list_all_images()
