#!/usr/bin/env python3
"""Extract portfolio content from TSX into src/content/*.json (structure only)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
OUT = SRC / "content"


def extract_balanced(text: str, start: int, open_c: str, close_c: str) -> str:
    depth = 0
    i = start
    while i < len(text):
        c = text[i]
        if c == open_c:
            depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
        elif c in ('"', "'", "`"):
            quote = c
            i += 1
            while i < len(text):
                if text[i] == "\\":
                    i += 2
                    continue
                if text[i] == quote:
                    break
                i += 1
        i += 1
    raise ValueError("Unbalanced brackets")


def parse_import_map(content: str) -> dict[str, str]:
    mapping: dict[str, str] = {}
    for m in re.finditer(
        r"import\s+(\w+)\s+from\s+['\"]([^'\"]+)['\"]", content
    ):
        name, path = m.group(1), m.group(2)
        if path.startswith("@/"):
            path = "src/" + path[2:]
        elif path.startswith("../../"):
            path = path.replace("../../", "")
        elif path.startswith("../"):
            path = "src/" + path[3:]
        mapping[name] = path
    return mapping


def strip_jsx(value: str) -> str:
    value = re.sub(r"<[^>]+>", '""', value)
    value = re.sub(r"icon:\s*\"\"", 'icon: null', value)
    return value


def normalize_ts_object(block: str, import_map: dict[str, str]) -> str:
    s = block
    s = re.sub(r"//.*?$", "", s, flags=re.MULTILINE)
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.DOTALL)
    s = strip_jsx(s)
    for name, path in import_map.items():
        s = re.sub(rf"\b{name}\b", json.dumps(path), s)
    s = re.sub(
        r"`\$\{publicBase\}([^`]+)`",
        lambda m: json.dumps(f"pictures/{m.group(1).lstrip('/')}"),
        s,
    )
    s = re.sub(r"\bpublicBase\b", '""', s)
    s = re.sub(r"(\w+)\s*:", r'"\1":', s)
    s = re.sub(r",\s*}", "}", s)
    s = re.sub(r",\s*]", "]", s)
    s = re.sub(r"'", '"', s)
    s = re.sub(r"(\w+):", r'"\1":', s)
    s = re.sub(r'""(\w+)""', r'"\1"', s)
    return s


def extract_const_array(text: str, pattern: str) -> list | None:
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return None
    start = m.end() - 1
    block = extract_balanced(text, start, "[", "]")
    import_map = parse_import_map(text)
    cleaned = normalize_ts_object(block, import_map)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


def extract_const_object(text: str, pattern: str) -> dict | None:
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return None
    start = m.end() - 1
    block = extract_balanced(text, start, "{", "}")
    import_map = parse_import_map(text)
    cleaned = normalize_ts_object(block, import_map)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


def manual_extract_projects() -> list:
    """Fallback: run tsx evaluator."""
    return []


def run_tsx_extract() -> None:
    extractor = ROOT / "scripts" / "extract-content.ts"
    extractor.write_text(
        """
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/content');
mkdirSync(out, { recursive: true });

// Dynamic import of compiled data via vite-node style eval
const modules = [
  '../src/components/Projects.tsx',
];

console.log('Use Python fallback or manual JSON');
"""
    )


def extract_via_regex() -> dict:
    projects_text = (SRC / "components" / "Projects.tsx").read_text(encoding="utf-8")
    skills_text = (SRC / "components" / "Skills.tsx").read_text(encoding="utf-8")
    pom_text = (SRC / "components" / "ProjectOfTheMonth.tsx").read_text(encoding="utf-8")
    pub_text = (SRC / "components" / "Publications.tsx").read_text(encoding="utf-8")
    act_text = (SRC / "components" / "Activities.tsx").read_text(encoding="utf-8")
    about_text = (SRC / "components" / "About.tsx").read_text(encoding="utf-8")
    hero_text = (SRC / "components" / "Hero.tsx").read_text(encoding="utf-8")
    contact_text = (SRC / "components" / "Contact.tsx").read_text(encoding="utf-8")
    index_text = (SRC / "pages" / "Index.tsx").read_text(encoding="utf-8")

    import_map = parse_import_map(projects_text)

    # Extract projects array manually with bracket matching + eval-like cleanup
    m = re.search(r"const projects: Project\[\] = \[", projects_text)
    projects = []
    if m:
        block = extract_balanced(projects_text, m.end() - 1, "[", "]")
        projects = parse_ts_array(block, import_map)

    m2 = re.search(r"const categories = \[", projects_text)
    categories = []
    if m2:
        block = extract_balanced(projects_text, m2.end() - 1, "[", "]")
        categories = parse_ts_array(block, import_map, icons=True)

    m3 = re.search(r"const featuredProject = \{", pom_text)
    thesis = {}
    if m3:
        block = extract_balanced(pom_text, m3.end() - 1, "{", "}")
        thesis = parse_ts_object(block, parse_import_map(pom_text))

    m4 = re.search(r"const published: Publication\[\] = \[", pub_text)
    published = []
    if m4:
        block = extract_balanced(pub_text, m4.end() - 1, "[", "]")
        published = parse_ts_array(block, {})

    m5 = re.search(r"const underReview: Publication\[\] = \[", pub_text)
    under_review = []
    if m5:
        block = extract_balanced(pub_text, m5.end() - 1, "[", "]")
        under_review = parse_ts_array(block, {})

    m6 = re.search(r'id="experience"[\s\S]*?</section>', pub_text)
    experience = []
    if m6:
        section = m6.group(0)
        cards = re.findall(
            r'<Card className="[^"]*">\s*<h4[^>]*>([^<]+)</h4>\s*'
            r'<div className="[^"]*">([^<]+)</div>\s*'
            r'<ul className="[^"]*">([\s\S]*?)</ul>',
            section,
        )
        for i, (title, meta, bullets_html) in enumerate(cards):
            bullets = re.findall(r"<li>([^<]+)</li>", bullets_html)
            experience.append(
                {
                    "id": f"exp-{i + 1}",
                    "title": title.strip(),
                    "meta": meta.strip(),
                    "bullets": [b.strip() for b in bullets],
                    "order": i + 1,
                }
            )

    m7 = re.search(r"const activities = \[", act_text)
    activities = []
    if m7:
        block = extract_balanced(act_text, m7.end() - 1, "[", "]")
        activities = parse_ts_array(block, {}, icons=True)

    m8 = re.search(r"const skillCategories = \[", skills_text)
    skill_categories = []
    if m8:
        block = extract_balanced(skills_text, m8.end() - 1, "[", "]")
        skill_categories = parse_ts_array(block, {}, icons=True)

    m9 = re.search(r"const relatedProjects: Record<string, string\[\]> = \{", skills_text)
    related_projects = {}
    if m9:
        block = extract_balanced(skills_text, m9.end() - 1, "{", "}")
        related_projects = parse_ts_object(block, {})

    m10 = re.search(r"const highlights = \[", about_text)
    highlights = []
    if m10:
        block = extract_balanced(about_text, m10.end() - 1, "[", "]")
        highlights = parse_ts_array(block, {}, icons=True)

    site = parse_site(hero_text, contact_text, index_text, about_text)

    return {
        "projects": projects,
        "categories": categories,
        "thesis": thesis,
        "publications": {"published": published, "underReview": under_review},
        "experience": experience,
        "activities": activities,
        "skills": {"categories": skill_categories, "relatedProjects": related_projects},
        "about": {"highlights": highlights, "paragraphs": site.get("aboutParagraphs", [])},
        "site": site,
    }


def parse_icon_from_jsx(fragment: str) -> str | None:
    m = re.search(r"<(\w+)", fragment)
    return m.group(1) if m else None


def parse_ts_value(val: str, import_map: dict[str, str]) -> object:
    val = val.strip()
    if not val:
        return ""
    if val.startswith("<"):
        return parse_icon_from_jsx(val)
    if val in import_map:
        return import_map[val]
    if val == "true":
        return True
    if val == "false":
        return False
    if val == "null":
        return None
    if val.startswith("`") and val.endswith("`"):
        inner = val[1:-1]
        inner = re.sub(r"\$\{publicBase\}", "", inner)
        return inner.strip()
    if (val.startswith('"') and val.endswith('"')) or (
        val.startswith("'") and val.endswith("'")
    ):
        return val[1:-1]
    if val.startswith("[") and val.endswith("]"):
        return parse_ts_array(val, import_map)
    if val.startswith("{") and val.endswith("}"):
        return parse_ts_object(val, import_map)
    try:
        if "." in val:
            return float(val)
        return int(val)
    except ValueError:
        return val


def split_top_level(s: str, sep: str) -> list[str]:
    parts: list[str] = []
    depth = 0
    current: list[str] = []
    in_str: str | None = None
    i = 0
    while i < len(s):
        c = s[i]
        if in_str:
            current.append(c)
            if c == "\\" and i + 1 < len(s):
                i += 1
                current.append(s[i])
            elif c == in_str:
                in_str = None
            i += 1
            continue
        if c in ('"', "'", "`"):
            in_str = c
            current.append(c)
        elif c in "[{":
            depth += 1
            current.append(c)
        elif c in "]}":
            depth -= 1
            current.append(c)
        elif c == sep and depth == 0:
            parts.append("".join(current).strip())
            current = []
        else:
            current.append(c)
        i += 1
    if current:
        parts.append("".join(current).strip())
    return parts


def strip_ts_comments(s: str) -> str:
    result: list[str] = []
    i = 0
    in_str: str | None = None
    while i < len(s):
        c = s[i]
        if in_str:
            result.append(c)
            if c == "\\" and i + 1 < len(s):
                i += 1
                result.append(s[i])
            elif c == in_str:
                in_str = None
            i += 1
            continue
        if c in ('"', "'", "`"):
            in_str = c
            result.append(c)
            i += 1
            continue
        if c == "/" and i + 1 < len(s):
            nxt = s[i + 1]
            if nxt == "/":
                while i < len(s) and s[i] != "\n":
                    i += 1
                continue
            if nxt == "*":
                i += 2
                while i + 1 < len(s) and not (s[i] == "*" and s[i + 1] == "/"):
                    i += 1
                i += 2
                continue
        result.append(c)
        i += 1
    return "".join(result)


def parse_ts_object(block: str, import_map: dict[str, str]) -> dict:
    inner = strip_ts_comments(block.strip())
    if inner.startswith("{"):
        inner = inner[1:-1]
    result: dict = {}
    for part in split_top_level(inner, ","):
        if not part or ":" not in part:
            continue
        key, _, val = part.partition(":")
        key = key.strip().strip('"').strip("'")
        if key:
            result[key] = parse_ts_value(val.strip(), import_map)
    return result


def parse_ts_array(block: str, import_map: dict[str, str], icons: bool = False) -> list:
    inner = strip_ts_comments(block.strip())
    if inner.startswith("["):
        inner = inner[1:-1]
    items: list = []
    for part in split_top_level(inner, ","):
        part = part.strip()
        if not part:
            continue
        if part.startswith("{"):
            obj = parse_ts_object(part, import_map)
            if icons:
                for k, v in list(obj.items()):
                    if k == "icon" and isinstance(v, str) and v.startswith("<"):
                        obj[k] = parse_icon_from_jsx(v)
            items.append(obj)
        else:
            items.append(parse_ts_value(part, import_map))
    return items


def parse_site(hero: str, contact: str, index: str, about: str) -> dict:
    name_m = re.search(r"<span className=\"block text-white[^\"]*\">([^<]+)</span>", hero)
    title_m = re.search(
        r"font-light text-white[^\"]*\"[^>]*>\s*([^<]+)\s*</span>", hero
    )
    linkedin_m = re.search(r'href="(https://www\.linkedin\.com/[^"]+)"', hero)
    email_m = re.search(r'href="mailto:([^"?]+)"', hero)
    footer_m = re.search(r"©[^<]+", index)
    paragraphs = re.findall(
        r'<p className="text-base[^"]*"[^>]*>\s*([\s\S]*?)\s*</p>', about
    )
    clean_paragraphs = []
    for p in paragraphs[:3]:
        text = re.sub(r"<[^>]+>", "", p)
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            clean_paragraphs.append(text)

    contact_block_m = re.search(r"const contactInfo = \[([\s\S]*?)\];", contact)
    email = ""
    location = ""
    if contact_block_m:
        block = contact_block_m.group(1)
        email_m2 = re.search(
            r"title:\s*'Email'[\s\S]*?value:\s*'([^']+)'", block
        )
        loc_m2 = re.search(
            r"title:\s*'Location'[\s\S]*?value:\s*'([^']+)'", block
        )
        if email_m2:
            email = email_m2.group(1)
        if loc_m2:
            location = loc_m2.group(1)

    social_linkedin = re.search(r"url:\s*'(https://www\.linkedin\.com/[^']+)'", contact)
    location_m = re.search(r"Abu Dhabi|Dubai|UAE", contact)

    return {
        "name": name_m.group(1).strip() if name_m else "Portfolio Owner",
        "title": title_m.group(1).strip() if title_m else "",
        "linkedin": (
            linkedin_m.group(1)
            if linkedin_m
            else (social_linkedin.group(1) if social_linkedin else "")
        ),
        "email": email,
        "location": location or (location_m.group(0) if location_m else ""),
        "footer": footer_m.group(0).strip() if footer_m else "",
        "aboutParagraphs": clean_paragraphs,
        "heroImage": "src/assets/hero-bg.jpg",
        "profileImage": "src/assets/mypicNew.jpeg",
        "cvPath": "LujainCV.pdf",
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    data = extract_via_regex()

    files = {
        "projects.json": data["projects"],
        "project-categories.json": data["categories"],
        "thesis.json": data["thesis"],
        "publications.json": data["publications"],
        "experience.json": data["experience"],
        "activities.json": data["activities"],
        "skills.json": data["skills"],
        "about.json": data["about"],
        "site.json": data["site"],
    }

    for name, content in files.items():
        path = OUT / name
        path.write_text(
            json.dumps(content, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {path} ({len(json.dumps(content))} bytes)")


if __name__ == "__main__":
    main()
