#!/usr/bin/env python3
"""Point projects.json image paths at real files in public/pictures/."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PICTURES = ROOT / "public" / "pictures"
ROOT_PICTURES = ROOT / "pictures"
PROJECTS_JSON = ROOT / "src" / "content" / "projects.json"
THESIS_JSON = ROOT / "src" / "content" / "thesis.json"
CV_PUBLIC = ROOT / "public" / "LujainCV.pdf"
CV_ROOT = ROOT / "LujainCV.pdf"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def normalize_key(name: str) -> str:
    s = Path(name).stem.lower()
    s = re.sub(r"[()]", "", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def ensure_pictures_merged() -> None:
    """Copy any root-level pictures/ files into public/pictures/ (idempotent)."""
    PUBLIC_PICTURES.mkdir(parents=True, exist_ok=True)
    if ROOT_PICTURES.exists():
        for f in ROOT_PICTURES.iterdir():
            if f.is_file() and f.suffix.lower() in IMAGE_EXTS:
                dest = PUBLIC_PICTURES / f.name
                if not dest.exists() or f.stat().st_mtime > dest.stat().st_mtime:
                    shutil.copy2(f, dest)


def build_file_index() -> dict[str, str]:
    ensure_pictures_merged()
    index: dict[str, str] = {}
    for f in PUBLIC_PICTURES.iterdir():
        if f.is_file() and f.suffix.lower() in IMAGE_EXTS:
            index[normalize_key(f.name)] = f"pictures/{f.name}"
            index[normalize_key(f.stem)] = f"pictures/{f.name}"
    return index


def match_image(title: str, current: str, index: dict[str, str]) -> str:
    if current in ("thesis.png",) or current.startswith("src/assets/"):
        return current
    if current:
        key = normalize_key(Path(current).name)
        if key in index:
            return index[key]
    title_key = normalize_key(title)
    if title_key in index:
        return index[title_key]
    for k, path in index.items():
        if title_key and (title_key in k or k in title_key):
            return path
    return current


def sync_cv() -> None:
    """Ensure public/LujainCV.pdf exists (prefer newest source)."""
    sources = [p for p in (CV_PUBLIC, CV_ROOT) if p.exists()]
    if not sources:
        return
    newest = max(sources, key=lambda p: p.stat().st_mtime)
    if not CV_PUBLIC.exists() or newest != CV_PUBLIC:
        shutil.copy2(newest, CV_PUBLIC)
    site_path = ROOT / "src" / "content" / "site.json"
    if site_path.exists():
        site = json.loads(site_path.read_text(encoding="utf-8"))
        site["cvPath"] = "LujainCV.pdf"
        site_path.write_text(json.dumps(site, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    ensure_pictures_merged()
    sync_cv()
    index = build_file_index()

    projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
    fixed = 0
    for p in projects:
        old = p.get("image", "")
        new = match_image(p.get("title", ""), old, index)
        if new != old:
            p["image"] = new
            fixed += 1
            print(f"  {p.get('title', '?')[:50]}")
            print(f"    {old or '(empty)'} -> {new}")
    PROJECTS_JSON.write_text(json.dumps(projects, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if THESIS_JSON.exists():
        thesis = json.loads(THESIS_JSON.read_text(encoding="utf-8"))
        if not thesis.get("image") or thesis.get("image") == "thesis.png":
            thesis["image"] = "thesis.png"
            THESIS_JSON.write_text(json.dumps(thesis, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"\nSynced {fixed} project image path(s). CV: {CV_PUBLIC.exists()}")
    print(f"Pictures in public/pictures/: {len(list(PUBLIC_PICTURES.glob('*')))}")


if __name__ == "__main__":
    main()
