import json
import re
import shutil
import uuid
from pathlib import Path
from typing import Any

from .assets import cv_info, list_all_images, merge_root_pictures, save_cv
from .paths import CONTENT_FILES, PICTURES_DIR


class ContentStore:
    def read(self, key: str) -> Any:
        path = CONTENT_FILES[key]
        return json.loads(path.read_text(encoding="utf-8"))

    def write(self, key: str, data: Any) -> None:
        path = CONTENT_FILES[key]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    def save_image(self, source: Path, title_hint: str = "asset") -> str:
        merge_root_pictures()
        PICTURES_DIR.mkdir(parents=True, exist_ok=True)
        from .image_utils import prepare_image

        prepared = prepare_image(source)
        original_name = prepared.name
        if re.match(r"^[\w\s().-]+\.(jpg|jpeg|png|webp|gif)$", original_name, re.I):
            dest = PICTURES_DIR / original_name
        else:
            safe = re.sub(r"[^a-zA-Z0-9._-]+", "-", title_hint.strip())[:80] or "asset"
            ext = prepared.suffix.lower() or ".jpg"
            dest = PICTURES_DIR / f"{safe}{ext}"
        if dest.exists() and dest.resolve() != prepared.resolve():
            counter = 1
            stem, ext = dest.stem, dest.suffix
            while dest.exists():
                dest = PICTURES_DIR / f"{stem}-{counter}{ext}"
                counter += 1
        shutil.copy2(prepared, dest)
        return f"pictures/{dest.name}"

    def save_cv_pdf(self, source: Path) -> str:
        return save_cv(source)

    def list_images(self) -> list[str]:
        return list_all_images()

    def cv_status(self) -> dict:
        return cv_info()

    def new_project_id(self) -> str:
        return f"project-{uuid.uuid4().hex[:8]}"

    def blank_project(self, project_id: str | None = None) -> dict:
        """Default shape matching existing projects.json entries."""
        return {
            "id": project_id or self.new_project_id(),
            "title": "New Project",
            "description": "",
            "longDescription": "",
            "category": "iot",
            "tags": [],
            "image": "",
            "featured": False,
            "timeline": "",
            "team": "",
            "startDate": "",
            "endDate": "",
            "impact": [],
            "gallery": [],
            "links": [],
        }

    def set_only_featured(self, project_id: str) -> None:
        projects = self.read("projects")
        for project in projects:
            project["featured"] = project.get("id") == project_id
        self.write("projects", projects)

    def set_featured_project(self, project_id: str) -> None:
        self.set_only_featured(project_id)
        projects = self.read("projects")
        featured = next((p for p in projects if p.get("id") == project_id), None)
        if not featured:
            return
        thesis = self.read("thesis")
        thesis.update(
            {
                "id": featured.get("id"),
                "title": featured.get("title"),
                "description": featured.get("description"),
                "longDescription": featured.get("longDescription"),
                "image": featured.get("image"),
                "linkedProjectId": featured.get("id"),
                "tags": featured.get("tags", []),
            }
        )
        if featured.get("links"):
            thesis["links"] = featured["links"]
        elif featured.get("github"):
            thesis["github"] = featured["github"]
        self.write("thesis", thesis)

    def ensure_thesis_project_in_grid(self, thesis: dict | None = None) -> bool:
        """Ensure thesis spotlight has a matching project card in projects.json."""
        thesis = thesis or self.read("thesis")
        project_id = thesis.get("linkedProjectId") or thesis.get("id")
        if not project_id:
            return False

        projects = self.read("projects")
        existing = next((p for p in projects if p.get("id") == project_id), None)
        if existing:
            if not existing.get("featured"):
                for project in projects:
                    project["featured"] = project.get("id") == project_id
                self.write("projects", projects)
            return False

        entry = self.blank_project(project_id)
        entry.update(
            {
                "title": thesis.get("title", "Thesis Project"),
                "description": thesis.get("description", ""),
                "longDescription": thesis.get("longDescription", ""),
                "category": thesis.get("category", "security"),
                "tags": thesis.get("tags", []),
                "image": thesis.get("image", "thesis.png"),
                "featured": True,
                "timeline": thesis.get("date", "Graduation Thesis"),
                "team": "1 person",
                "impact": thesis.get("achievements", []),
                "startDate": thesis.get("startDate", "2025-10-01"),
                "endDate": thesis.get("endDate", "2026-04-30"),
            }
        )
        if thesis.get("links"):
            entry["links"] = thesis["links"]
        elif thesis.get("github"):
            entry["github"] = thesis["github"]

        for project in projects:
            project["featured"] = False
        projects.insert(0, entry)
        self.write("projects", projects)
        return True

    def counts(self) -> dict[str, int]:
        return {
            "projects": len(self.read("projects")),
            "skills": sum(
                len(c.get("skills", [])) for c in self.read("skills").get("categories", [])
            ),
            "publications": len(self.read("publications").get("published", []))
            + len(self.read("publications").get("underReview", [])),
            "activities": sum(len(c.get("items", [])) for c in self.read("activities")),
            "experience": len(self.read("experience")),
        }
