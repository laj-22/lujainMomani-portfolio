"""Link types and JSON helpers — shared by manager forms and validation."""

from __future__ import annotations

import re
from urllib.parse import urlparse

LINK_TYPES: list[tuple[str, str]] = [
    ("github", "GitHub"),
    ("youtube", "YouTube"),
    ("linkedin", "LinkedIn"),
    ("demo", "Live Demo"),
    ("website", "Website"),
    ("paper", "Paper / Article"),
    ("doi", "DOI"),
    ("twitter", "Twitter / X"),
    ("instagram", "Instagram"),
    ("email", "Email"),
    ("other", "Other"),
]

LINK_ICONS: dict[str, str] = {
    "github": "🐙",
    "youtube": "▶",
    "linkedin": "💼",
    "demo": "🚀",
    "website": "🌐",
    "paper": "📄",
    "doi": "📑",
    "twitter": "🐦",
    "instagram": "📷",
    "email": "✉",
    "other": "🔗",
}


def infer_link_type(url: str) -> str:
    u = (url or "").strip().lower()
    if u.startswith("mailto:"):
        return "email"
    if "github.com" in u:
        return "github"
    if "youtube.com" in u or "youtu.be" in u:
        return "youtube"
    if "linkedin.com" in u:
        return "linkedin"
    if "twitter.com" in u or "x.com" in u:
        return "twitter"
    if "instagram.com" in u:
        return "instagram"
    if "doi.org" in u:
        return "doi"
    return "website"


def _clean_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    if url.startswith("mailto:"):
        return url
    if not re.match(r"^https?://", url, re.I) and "@" not in url:
        return f"https://{url.lstrip('/')}"
    return url


def _clean_links(links: list[dict]) -> list[dict]:
    cleaned: list[dict] = []
    for item in links:
        url = _clean_url(str(item.get("url", "")))
        if not url:
            continue
        link_type = str(item.get("type", "other")).strip() or infer_link_type(url)
        if link_type not in dict(LINK_TYPES):
            link_type = infer_link_type(url)
        label = str(item.get("label", "")).strip()
        entry: dict[str, str] = {"type": link_type, "url": url}
        if label:
            entry["label"] = label
        cleaned.append(entry)
    return cleaned


def coerce_links(data: dict, legacy_map: dict[str, str] | None = None) -> list[dict]:
    """Read links array or build from legacy single fields (github, demo, link, …)."""
    raw = data.get("links")
    if isinstance(raw, list) and raw:
        return _clean_links(raw)

    legacy_map = legacy_map or {}
    result: list[dict] = []
    for field, link_type in legacy_map.items():
        url = (data.get(field) or "").strip()
        if url:
            result.append({"type": link_type, "url": _clean_url(url)})
    return result


def sync_links(
    data: dict,
    links: list[dict],
    legacy_map: dict[str, str] | None = None,
) -> None:
    """Write links array and keep legacy fields in sync for the live site."""
    cleaned = _clean_links(links)
    if cleaned:
        data["links"] = cleaned
    elif "links" in data:
        del data["links"]

    if not legacy_map:
        return

    for field in legacy_map:
        data.pop(field, None)

    used: set[str] = set()
    for link in cleaned:
        link_type = link["type"]
        url = link["url"]
        for field, expected in legacy_map.items():
            if field in used:
                continue
            if link_type == expected:
                data[field] = url
                used.add(field)
                break

    if "link" in legacy_map and "link" not in data and cleaned:
        data["link"] = cleaned[0]["url"]


PROJECT_LEGACY = {"github": "github", "demo": "demo"}
THESIS_LEGACY = {"github": "github"}
ACTIVITY_LEGACY = {"link": "website"}
PUBLICATION_LEGACY = {"link": "paper"}
SITE_LEGACY = {"linkedin": "linkedin"}


def valid_url(url: str) -> bool:
    if url.startswith("mailto:"):
        return "@" in url[7:]
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
