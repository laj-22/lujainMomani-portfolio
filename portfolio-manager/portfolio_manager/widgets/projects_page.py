"""Projects editor — project manager list + full form."""

from __future__ import annotations

from pathlib import Path

from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QCheckBox,
    QComboBox,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMessageBox,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from ..constants import clear_categories_cache, load_categories
from ..links import PROJECT_LEGACY, sync_links
from ..store import ContentStore
from .form_helpers import ImagePreview, LinksEditor, ListEditor
from .form_page import FormPage
from .rich_editor import RichTextEditor


class _ProjectRow(QWidget):
    """Single row in the project manager — title + delete X."""

    delete_clicked = Signal(str)

    def __init__(self, project: dict, parent=None):
        super().__init__(parent)
        self.project_id = project.get("id", "")
        layout = QHBoxLayout(self)
        layout.setContentsMargins(6, 4, 6, 4)

        featured = "★ " if project.get("featured") else ""
        category = project.get("category", "iot")
        title = project.get("title", "Untitled")
        self.label = QLabel(f"{featured}{title}")
        self.label.setToolTip(f"{title}\nCategory: {category}\nID: {project.get('id', '')}")
        self.label.setStyleSheet("font-weight: 500;")

        meta = QLabel(category)
        meta.setStyleSheet("color: #888; font-size: 11px;")
        meta.setFixedWidth(72)

        delete_btn = QPushButton("✕")
        delete_btn.setFixedSize(28, 28)
        delete_btn.setToolTip("Delete this project")
        delete_btn.setStyleSheet(
            "QPushButton { color: #b00020; font-weight: bold; border: 1px solid #ddd; border-radius: 4px; }"
            "QPushButton:hover { background: #ffebee; border-color: #b00020; }"
        )
        delete_btn.clicked.connect(self._on_delete)

        layout.addWidget(self.label, 1)
        layout.addWidget(meta)
        layout.addWidget(delete_btn)

    def _on_delete(self) -> None:
        self.delete_clicked.emit(self.project_id)


class ProjectManagerPanel(QWidget):
    """Scrollable list of all projects — click to select, ✕ to delete."""

    project_selected = Signal(str)
    delete_requested = Signal(str)

    def __init__(self, parent=None):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)

        header = QHBoxLayout()
        header.addWidget(QLabel("<b>Project Manager</b>"))
        header.addStretch()
        self.new_btn = QPushButton("+ New")
        self.duplicate_btn = QPushButton("Duplicate")
        header.addWidget(self.new_btn)
        header.addWidget(self.duplicate_btn)
        layout.addLayout(header)

        hint = QLabel("Click a project to edit. Use ✕ to delete (asks for confirmation).")
        hint.setStyleSheet("color: #666; font-size: 11px;")
        hint.setWordWrap(True)
        layout.addWidget(hint)

        self.list = QListWidget()
        self.list.setMinimumHeight(180)
        self.list.setMaximumHeight(260)
        self.list.setSpacing(2)
        self.list.itemSelectionChanged.connect(self._on_selection)
        layout.addWidget(self.list)

        self._id_to_item: dict[str, QListWidgetItem] = {}

    def set_projects(self, projects: list[dict], select_id: str | None = None) -> None:
        self.list.blockSignals(True)
        self.list.clear()
        self._id_to_item.clear()

        ordered = sorted(
            projects,
            key=lambda p: (not bool(p.get("featured")), p.get("title", "").lower()),
        )
        for project in ordered:
            pid = project.get("id", "")
            item = QListWidgetItem()
            item.setData(Qt.ItemDataRole.UserRole, pid)
            row = _ProjectRow(project)
            row.delete_clicked.connect(self.delete_requested.emit)
            item.setSizeHint(row.sizeHint())
            self.list.addItem(item)
            self.list.setItemWidget(item, row)
            self._id_to_item[pid] = item

        if select_id and select_id in self._id_to_item:
            self.list.setCurrentItem(self._id_to_item[select_id])
        elif ordered:
            self.list.setCurrentRow(0)

        self.list.blockSignals(False)

    def _select_id(self, project_id: str) -> None:
        item = self._id_to_item.get(project_id)
        if item:
            self.list.setCurrentItem(item)

    def current_project_id(self) -> str | None:
        item = self.list.currentItem()
        return item.data(Qt.ItemDataRole.UserRole) if item else None

    def _on_selection(self) -> None:
        pid = self.current_project_id()
        if pid:
            self.project_selected.emit(pid)


class ProjectsPage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Projects", "projects", parent)
        self.store = store
        self._projects: list[dict] = []
        self._active_id: str | None = None
        self._loading_form = False
        self._build_ui()
        self.set_save_handler(self.save)
        self.reload_from_disk()

    def _build_ui(self) -> None:
        self.manager = ProjectManagerPanel()
        self.manager.new_btn.clicked.connect(self.new_project)
        self.manager.duplicate_btn.clicked.connect(self.duplicate)
        self.manager.project_selected.connect(self._on_manager_select)
        self.manager.delete_requested.connect(self._handle_delete_request)
        self.form_layout.addWidget(self.manager)

        hint = QLabel("Edits update the preview immediately. Click Save to write projects.json.")
        hint.setWordWrap(True)
        hint.setStyleSheet("color: #666; font-size: 11px;")
        self.form_layout.addWidget(hint)

        form = QFormLayout()
        self.title = QLineEdit()
        self.title.textChanged.connect(self._on_title_live)
        self.category = QComboBox()
        self.reload_categories()
        self.image = QComboBox()
        self.image.setEditable(True)
        self.image_preview = ImagePreview()
        self.image.currentTextChanged.connect(self._update_image_preview)
        img_row = QWidget()
        img_layout = QHBoxLayout(img_row)
        img_layout.setContentsMargins(0, 0, 0, 0)
        img_col = QWidget()
        img_col_layout = QHBoxLayout(img_col)
        img_col_layout.setContentsMargins(0, 0, 0, 0)
        img_col_layout.addWidget(self.image, 1)
        browse = QPushButton("Upload image…")
        browse.clicked.connect(self._upload_image)
        img_col_layout.addWidget(browse)
        img_layout.addWidget(img_col, 1)
        img_layout.addWidget(self.image_preview)
        self._refresh_images()
        self.linked_project = QComboBox()
        self._refresh_link_targets()
        self.links = LinksEditor("Links (GitHub, YouTube, demo, …)", PROJECT_LEGACY)
        self.featured = QCheckBox("Featured project (only one — appears first on site)")
        self.timeline = QLineEdit()
        self.team = QLineEdit()
        self.start_date = QLineEdit()
        self.start_date.setPlaceholderText("YYYY-MM-DD")
        self.end_date = QLineEdit()
        self.end_date.setPlaceholderText("YYYY-MM-DD")
        self.tags = QLineEdit()
        self.tags.setPlaceholderText("IoT, Cybersecurity, Research")
        self.description = RichTextEditor("Short card description")
        self.long_description = RichTextEditor("Full project details (modal)")
        self.impact = ListEditor("Impact bullets")

        form.addRow("Title *", self.title)
        form.addRow("Category", self.category)
        form.addRow("Image", img_row)
        links_hint = QLabel(
            "<b>How to add links:</b> In <i>Links</i> below, click <b>+ Add link</b> → "
            "pick type (GitHub, YouTube, Live Demo…) → paste the full URL → <b>Save</b>.<br>"
            "<i>Cross-link</i> is only for linking to another project card on your site (optional)."
        )
        links_hint.setWordWrap(True)
        links_hint.setStyleSheet("color: #444; font-size: 11px;")
        form.addRow(links_hint)
        form.addRow(
            "Cross-link to another project",
            self.linked_project,
        )
        form.addRow(self.links)
        form.addRow("", self.featured)
        form.addRow("Timeline label", self.timeline)
        form.addRow("Team", self.team)
        form.addRow("Start date", self.start_date)
        form.addRow("End date", self.end_date)
        form.addRow("Tags (comma-separated)", self.tags)
        form.addRow("Description", self.description)
        form.addRow("Long description", self.long_description)
        form.addRow(self.impact)
        self.form_layout.addLayout(form)

    def reload_categories(self) -> None:
        clear_categories_cache()
        current = self.category.currentData() if hasattr(self, "category") else None
        self.category.blockSignals(True)
        self.category.clear()
        for cat in load_categories():
            self.category.addItem(cat["label"], cat["id"])
        if current is not None:
            idx = self.category.findData(current)
            if idx >= 0:
                self.category.setCurrentIndex(idx)
        self.category.blockSignals(False)

    def _project_by_id(self, project_id: str | None) -> dict | None:
        if not project_id:
            return None
        return next((p for p in self._projects if p.get("id") == project_id), None)

    def _stash_form_for(self, project_id: str | None) -> None:
        """Save the open form into the project that owns it (not whichever row is selected)."""
        if self._loading_form or not project_id:
            return
        project = self._project_by_id(project_id)
        if not project:
            return
        idx = next((i for i, p in enumerate(self._projects) if p.get("id") == project_id), -1)
        if idx < 0:
            return
        self._projects[idx] = self._read_form(project)

    def _refresh_link_targets(self) -> None:
        current = self.linked_project.currentData()
        self.linked_project.clear()
        self.linked_project.addItem("(none)", "")
        current_id = self._active_id
        for p in self._projects:
            pid = p.get("id", "")
            if pid == current_id:
                continue
            self.linked_project.addItem(f"{p.get('title', '?')} ({pid})", pid)
        if current:
            li = self.linked_project.findData(current)
            if li >= 0:
                self.linked_project.setCurrentIndex(li)

    def _update_image_preview(self) -> None:
        if not hasattr(self, "image_preview"):
            return
        text = self.image.currentText()
        self.image_preview.set_image_path(text)

    def _refresh_images(self, keep: str | None = None) -> None:
        current = keep if keep is not None else self.image.currentText()
        if current.startswith("(no image"):
            current = ""
        self.image.blockSignals(True)
        self.image.clear()
        self.image.addItem("(no image — uses title fallback)")
        for opt in self.store.list_images():
            self.image.addItem(opt)
        if current:
            idx = self.image.findText(current)
            if idx >= 0:
                self.image.setCurrentIndex(idx)
            else:
                self.image.setEditText(current)
        self.image.blockSignals(False)
        self._update_image_preview()

    def _upload_image(self) -> None:
        from PySide6.QtWidgets import QFileDialog

        path, _ = QFileDialog.getOpenFileName(
            self, "Upload project image", "", "Images (*.png *.jpg *.jpeg *.webp)"
        )
        if path:
            rel = self.store.save_image(Path(path), self.title.text() or "project")
            self._refresh_images(keep=rel)
            idx = self.image.findText(rel)
            if idx >= 0:
                self.image.setCurrentIndex(idx)
            else:
                self.image.setEditText(rel)
            self._update_image_preview()
            if self._active_id:
                self._stash_form_for(self._active_id)

    def reload_from_disk(self) -> None:
        keep_id = self._active_id or self.manager.current_project_id()
        self._projects = self.store.read("projects")
        if keep_id and not self._project_by_id(keep_id):
            keep_id = self._projects[0].get("id") if self._projects else None
        self._show_project(keep_id, stash=False)

    def reload(self) -> None:
        self.reload_from_disk()

    def _on_title_live(self, text: str) -> None:
        if self._loading_form or not self._active_id:
            return
        project = self._project_by_id(self._active_id)
        if not project:
            return
        title = text.strip() or "New Project"
        project["title"] = title
        item = self.manager._id_to_item.get(self._active_id)
        if item:
            row = self.manager.list.itemWidget(item)
            if isinstance(row, _ProjectRow):
                featured = "★ " if project.get("featured") else ""
                row.label.setText(f"{featured}{title}")
        self.refresh_json_preview(self._projects)

    def _stash_form(self) -> None:
        self._stash_form_for(self._active_id)

    def _current_index(self) -> int:
        if not self._active_id:
            return -1
        for i, p in enumerate(self._projects):
            if p.get("id") == self._active_id:
                return i
        return -1

    def _show_project(self, project_id: str | None, *, stash: bool = True) -> None:
        if stash and self._active_id and self._active_id != project_id:
            self._stash_form_for(self._active_id)
        self._active_id = project_id
        self.manager.set_projects(self._projects, select_id=project_id)
        self._refresh_link_targets()
        project = self._project_by_id(project_id)
        if project:
            self._apply_to_form(project)
        self.refresh_json_preview(self._projects)

    def _on_manager_select(self, project_id: str) -> None:
        if self._loading_form:
            return
        self._show_project(project_id)

    def _handle_delete_request(self, project_id: str) -> None:
        """✕ can change list selection — keep editing the project that owns the form."""
        if self._active_id and self.manager.current_project_id() != self._active_id:
            self.manager.list.blockSignals(True)
            self.manager._select_id(self._active_id)
            self.manager.list.blockSignals(False)
        self._confirm_delete(project_id)

    def _confirm_delete(self, project_id: str) -> None:
        project = next((p for p in self._projects if p.get("id") == project_id), None)
        if not project:
            return
        title = project.get("title", "Untitled")
        reply = QMessageBox.question(
            self,
            "Delete project?",
            f'Delete "{title}"?\n\nRemoved from draft until you click Save.',
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            QMessageBox.StandardButton.No,
        )
        if reply != QMessageBox.StandardButton.Yes:
            return
        if project_id != self._active_id:
            self._stash_form_for(self._active_id)
        self._delete_project(project_id)

    def _delete_project(self, project_id: str) -> None:
        project = self._project_by_id(project_id)
        if not project:
            return
        self._projects = [p for p in self._projects if p.get("id") != project_id]
        if self._active_id == project_id:
            self._active_id = self._projects[0].get("id") if self._projects else None
        self._show_project(self._active_id, stash=False)
        QMessageBox.information(
            self,
            "Removed",
            f'"{project.get("title", "Project")}" removed from draft.\nClick Save to update projects.json.',
        )

    def _load_current(self) -> None:
        idx = self._current_index()
        if idx >= 0:
            self._apply_to_form(self._projects[idx])

    def _apply_to_form(self, p: dict) -> None:
        self._loading_form = True
        self.title.blockSignals(True)
        self.image.blockSignals(True)
        self.linked_project.blockSignals(True)
        self.title.setText(p.get("title", ""))
        cat = p.get("category", "iot")
        cidx = self.category.findData(cat)
        self.category.setCurrentIndex(cidx if cidx >= 0 else 0)
        img = (p.get("image") or "").strip()
        self._refresh_images(keep=img)
        if img:
            iidx = self.image.findText(img)
            if iidx >= 0:
                self.image.setCurrentIndex(iidx)
            else:
                self.image.setEditText(img)
        else:
            self.image.setCurrentIndex(0)
        self._update_image_preview()
        link_id = p.get("linkedProjectId", "")
        li = self.linked_project.findData(link_id)
        self.linked_project.setCurrentIndex(li if li >= 0 else 0)
        self.links.set_from_data(p)
        self.featured.setChecked(bool(p.get("featured")))
        self.timeline.setText(p.get("timeline", ""))
        self.team.setText(p.get("team", ""))
        self.start_date.setText(p.get("startDate", ""))
        self.end_date.setText(p.get("endDate", ""))
        self.tags.setText(", ".join(p.get("tags", [])))
        self.description.setHtml(p.get("description", ""))
        self.long_description.setHtml(p.get("longDescription", ""))
        self.impact.set_lines(p.get("impact", []))
        self.title.blockSignals(False)
        self.image.blockSignals(False)
        self.linked_project.blockSignals(False)
        self._loading_form = False

    def _read_form(self, base: dict | None = None) -> dict:
        data = dict(base or {})
        img = self.image.currentText()
        if img.startswith("(no image"):
            img = ""
        link = self.linked_project.currentData() or ""
        data.update(
            {
                "id": data.get("id") or self.store.new_project_id(),
                "title": self.title.text().strip(),
                "category": self.category.currentData() or "iot",
                "image": img.strip(),
                "featured": self.featured.isChecked(),
                "timeline": self.timeline.text().strip(),
                "team": self.team.text().strip(),
                "startDate": self.start_date.text().strip(),
                "endDate": self.end_date.text().strip(),
                "tags": [t.strip() for t in self.tags.text().split(",") if t.strip()],
                "description": self.description.toPlainText(),
                "longDescription": self.long_description.toPlainText(),
                "impact": self.impact.get_lines(),
                "gallery": data.get("gallery", []),
            }
        )
        if link:
            data["linkedProjectId"] = link
        else:
            data.pop("linkedProjectId", None)
        sync_links(data, self.links.get_links(), PROJECT_LEGACY)
        return data

    def save(self) -> None:
        idx = self._current_index()
        if idx < 0:
            QMessageBox.warning(self, "Save", "No project selected.")
            return
        if not self.title.text().strip():
            QMessageBox.warning(self, "Save", "Title is required.")
            return
        self._stash_form_for(self._active_id)
        if self._projects[idx].get("featured"):
            for i, project in enumerate(self._projects):
                project["featured"] = i == idx
        self.store.write("projects", self._projects)
        self.reload_from_disk()
        QMessageBox.information(self, "Saved", "projects.json updated.")

    def new_project(self) -> None:
        self._stash_form_for(self._active_id)
        new_entry = self.store.blank_project()
        new_entry["category"] = self.category.currentData() or "iot"
        self._projects.append(new_entry)
        self._show_project(new_entry["id"], stash=False)

    def _save_current_to_memory(self) -> None:
        self._stash_form()

    def duplicate(self) -> None:
        self._stash_form_for(self._active_id)
        idx = self._current_index()
        if idx < 0:
            return
        copy = dict(self._projects[idx])
        copy["id"] = self.store.new_project_id()
        copy["title"] = f"{copy.get('title', 'Project')} (copy)"
        copy["featured"] = False
        self._projects.append(copy)
        self._show_project(copy["id"], stash=False)

    def delete(self) -> None:
        """Legacy entry point — deletes currently selected project."""
        pid = self.manager.current_project_id()
        if pid:
            self._confirm_delete(pid)
