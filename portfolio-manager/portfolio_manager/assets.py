"""Resolve image/PDF paths against files that exist in the repo."""

from __future__ import annotations

import re
import shutil
from datetime import datetime
from pathlib import Path

from .paths import PICTURES_DIR, PUBLIC_DIR, REPO_ROOT

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
CV_FILENAME = "LujainCV.pdf"
CV_ARCHIVE_DIR = PUBLIC_DIR / "archive" / "cv"


def normalize_key(name: str) -> str:
    s = Path(name).stem.lower()
    s = re.sub(r"[()]", "", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def merge_root_pictures() -> None:
    root_pictures = REPO_ROOT / "pictures"
    PICTURES_DIR.mkdir(parents=True, exist_ok=True)
    if root_pictures.exists():
        for f in root_pictures.iterdir():
            if f.is_file() and f.suffix.lower() in IMAGE_EXTS:
                dest = PICTURES_DIR / f.name
                if not dest.exists():
                    shutil.copy2(f, dest)


def list_all_images() -> list[str]:
    merge_root_pictures()
    paths: list[str] = []
    if (REPO_ROOT / "thesis.png").exists():
        paths.append("thesis.png")
    assets = REPO_ROOT / "src" / "assets"
    if assets.exists():
        for f in sorted(assets.iterdir()):
            if f.suffix.lower() in IMAGE_EXTS:
                paths.append(f"src/assets/{f.name}")
    if PICTURES_DIR.exists():
        for f in sorted(PICTURES_DIR.iterdir()):
            if f.suffix.lower() in IMAGE_EXTS:
                paths.append(f"pictures/{f.name}")
    return paths


def resolve_image_file(rel: str) -> Path | None:
    """Map JSON image path to a file on disk (for manager preview)."""
    if not rel or rel.startswith("(no image"):
        return None
    if rel == "thesis.png":
        p = REPO_ROOT / "thesis.png"
        return p if p.exists() else None
    if rel.startswith("src/assets/"):
        p = REPO_ROOT / rel
        return p if p.exists() else None
    if rel.startswith("pictures/"):
        p = PICTURES_DIR / Path(rel).name
        if p.exists():
            return p
        # Also try repo-root pictures/ folder
        p3 = REPO_ROOT / "pictures" / Path(rel).name
        return p3 if p3.exists() else None
    p = REPO_ROOT / rel
    if p.exists():
        return p
    p2 = PUBLIC_DIR / rel
    return p2 if p2.exists() else None


def image_exists(path: str) -> bool:
    return resolve_image_file(path) is not None or (
        bool(path) and path.startswith("http")
    )


def list_cv_archives() -> list[str]:
    if not CV_ARCHIVE_DIR.exists():
        return []
    return sorted(
        [f.name for f in CV_ARCHIVE_DIR.glob("*.pdf")],
        reverse=True,
    )


def cv_info() -> dict:
    public_cv = PUBLIC_DIR / CV_FILENAME
    root_cv = REPO_ROOT / CV_FILENAME
    path = public_cv if public_cv.exists() else root_cv
    if not path.exists():
        return {
            "exists": False,
            "path": str(public_cv),
            "size_kb": 0,
            "archives": list_cv_archives(),
        }
    return {
        "exists": True,
        "path": str(public_cv),
        "size_kb": round(path.stat().st_size / 1024, 1),
        "modified": path.stat().st_mtime,
        "archives": list_cv_archives(),
    }


def save_cv(source: Path) -> str:
    """Replace live CV; archive previous copy with timestamp."""
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    CV_ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    dest = PUBLIC_DIR / CV_FILENAME
    stamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")

    archive_name = f"LujainCV_{stamp}.pdf"
    if dest.exists():
        shutil.copy2(dest, CV_ARCHIVE_DIR / archive_name)
    elif (REPO_ROOT / CV_FILENAME).exists():
        shutil.copy2(REPO_ROOT / CV_FILENAME, CV_ARCHIVE_DIR / archive_name)

    shutil.copy2(source, dest)
    shutil.copy2(source, REPO_ROOT / CV_FILENAME)
    return CV_FILENAME
