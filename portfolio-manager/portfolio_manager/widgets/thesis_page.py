"""Thesis / graduation spotlight editor — matches ProjectOfTheMonth fields."""

from __future__ import annotations

from pathlib import Path

from PySide6.QtWidgets import (
    QComboBox,
    QFormLayout,
    QHBoxLayout,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QWidget,
)

from ..links import THESIS_LEGACY, sync_links
from ..store import ContentStore
from .form_helpers import ImagePreview, KeyValueEditor, LinksEditor, ListEditor
from .form_page import FormPage
from .rich_editor import RichTextEditor


class ThesisPage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Thesis / Graduation Spotlight", "thesis", parent)
        self.store = store
        self._build_ui()
        self.set_save_handler(self.save)
        self.load()

    def _build_ui(self) -> None:
        form = QFormLayout()
        self.title = QLineEdit()
        self.date = QLineEdit()
        self.date.setPlaceholderText("2026")
        self.links = LinksEditor("Links (GitHub, YouTube, paper, …)", THESIS_LEGACY)
        self.image = QComboBox()
        self.image.setEditable(True)
        self.image_preview = ImagePreview()
        self.image.currentTextChanged.connect(self._update_image_preview)
        self.linked_project = QComboBox()
        self._refresh_link_targets()
        img_row = QWidget()
        img_l = QHBoxLayout(img_row)
        img_l.setContentsMargins(0, 0, 0, 0)
        img_col = QWidget()
        img_col_l = QHBoxLayout(img_col)
        img_col_l.setContentsMargins(0, 0, 0, 0)
        img_col_l.addWidget(self.image, 1)
        up = QPushButton("Upload…")
        up.clicked.connect(self._upload_image)
        img_col_l.addWidget(up)
        img_l.addWidget(img_col, 1)
        img_l.addWidget(self.image_preview)
        self._refresh_images()
        self.tags = QLineEdit()
        self.tags.setPlaceholderText("Featured, Cybersecurity, IoT")
        self.description = RichTextEditor("Spotlight summary")
        self.long_description = RichTextEditor("Technical overview")
        self.achievements = ListEditor("Key achievements")
        self.tech = KeyValueEditor("Technology", "Role")

        form.addRow("Title *", self.title)
        form.addRow("Year badge", self.date)
        form.addRow(self.links)
        form.addRow("Image", img_row)
        form.addRow(
            "View Details opens project",
            self.linked_project,
        )
        form.addRow("Tags (comma-separated)", self.tags)
        form.addRow("Description", self.description)
        form.addRow("Long description", self.long_description)
        form.addRow(self.achievements)
        form.addRow("Technology stack", self.tech)
        self.form_layout.addLayout(form)

    def _refresh_link_targets(self) -> None:
        current = self.linked_project.currentData()
        self.linked_project.clear()
        self.linked_project.addItem("(use thesis id)", "")
        for p in self.store.read("projects"):
            pid = p.get("id", "")
            self.linked_project.addItem(f"{p.get('title', '?')} ({pid})", pid)
        if current:
            i = self.linked_project.findData(current)
            if i >= 0:
                self.linked_project.setCurrentIndex(i)

    def _update_image_preview(self) -> None:
        if not hasattr(self, "image_preview"):
            return
        self.image_preview.set_image_path(self.image.currentText())

    def _refresh_images(self) -> None:
        current = self.image.currentText()
        if current.startswith("(no image"):
            current = ""
        self.image.clear()
        self.image.addItem("(no image)")
        for opt in self.store.list_images():
            self.image.addItem(opt)
        if current:
            i = self.image.findText(current)
            if i >= 0:
                self.image.setCurrentIndex(i)
            else:
                self.image.setEditText(current)
        self._update_image_preview()

    def _upload_image(self) -> None:
        from PySide6.QtWidgets import QFileDialog

        path, _ = QFileDialog.getOpenFileName(self, "Upload image", "", "Images (*.png *.jpg *.jpeg *.webp)")
        if path:
            rel = self.store.save_image(Path(path), self.title.text() or "thesis")
            self._refresh_images()
            self.image.setEditText(rel)
            self._update_image_preview()

    def load(self) -> None:
        self._refresh_link_targets()
        t = self.store.read("thesis")
        self.title.setText(t.get("title", ""))
        self.date.setText(t.get("date", "2026"))
        self.links.set_from_data(t)
        img = t.get("image", "")
        i = self.image.findText(img)
        if i >= 0:
            self.image.setCurrentIndex(i)
        else:
            self.image.setEditText(img)
        self._update_image_preview()
        link_id = t.get("linkedProjectId", "")
        li = self.linked_project.findData(link_id)
        self.linked_project.setCurrentIndex(li if li >= 0 else 0)
        self.tags.setText(", ".join(t.get("tags", [])))
        self.description.setHtml(t.get("description", ""))
        self.long_description.setHtml(t.get("longDescription", ""))
        self.achievements.set_lines(t.get("achievements", []))
        self.tech.set_items(t.get("tech", []))
        self.refresh_json_preview(t)

    def save(self) -> None:
        if not self.title.text().strip():
            QMessageBox.warning(self, "Save", "Title is required.")
            return
        img = self.image.currentText()
        if img.startswith("(no image"):
            img = ""
        data = self.store.read("thesis")
        data.update(
            {
                "title": self.title.text().strip(),
                "date": self.date.text().strip(),
                "image": img.strip(),
                "linkedProjectId": self.linked_project.currentData()
                or data.get("id")
                or data.get("linkedProjectId"),
                "tags": [x.strip() for x in self.tags.text().split(",") if x.strip()],
                "description": self.description.toPlainText(),
                "longDescription": self.long_description.toPlainText(),
                "achievements": self.achievements.get_lines(),
                "tech": self.tech.get_items(),
            }
        )
        sync_links(data, self.links.get_links(), THESIS_LEGACY)
        self.store.write("thesis", data)
        added = self.store.ensure_thesis_project_in_grid(data)
        self.refresh_json_preview(data)
        msg = "thesis.json updated."
        if added:
            msg += "\n\nA matching project card was added to projects.json for the grid."
        QMessageBox.information(self, "Saved", msg)
