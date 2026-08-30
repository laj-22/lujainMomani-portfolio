"""Auto-resize uploaded images for web use."""

from __future__ import annotations

import tempfile
from pathlib import Path

MAX_DIMENSION = 1920
JPEG_QUALITY = 85


def prepare_image(source: Path) -> Path:
    """Return path to an image ready to copy (resized if Pillow is available)."""
    try:
        from PIL import Image
    except ImportError:
        return source

    try:
        with Image.open(source) as opened:
            img = opened.convert("RGB") if opened.mode in ("RGBA", "P", "LA") else opened.copy()
            w, h = img.size
            if max(w, h) > MAX_DIMENSION:
                scale = MAX_DIMENSION / max(w, h)
                img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

            suffix = source.suffix.lower()
            if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
                suffix = ".jpg"

            tmp = Path(tempfile.gettempdir()) / f"portfolio-upload-{source.stem}{suffix}"
            save_kwargs: dict = {}
            if suffix in {".jpg", ".jpeg"}:
                save_kwargs["quality"] = JPEG_QUALITY
                save_kwargs["optimize"] = True
                img.save(tmp, format="JPEG", **save_kwargs)
            elif suffix == ".png":
                img.save(tmp, format="PNG", optimize=True)
            else:
                img.save(tmp)
            return tmp
    except OSError:
        return source
