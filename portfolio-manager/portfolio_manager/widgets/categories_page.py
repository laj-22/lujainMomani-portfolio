"""Project filter categories editor (projects grid tabs)."""

from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QComboBox,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMessageBox,
    QPushButton,
)

from ..constants import ICON_OPTIONS, clear_categories_cache
from ..draft import new_id
from ..store import ContentStore
from .form_page import FormPage


class CategoriesPage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Project Categories", "categories", parent)
        self.store = store
        self._categories: list[dict] = []
        self._current_id: str | None = None
        self._loading = False
        self._build_ui()
        self.set_save_handler(self.save)
        self.reload_from_disk()

    def _build_ui(self) -> None:
        row = QHBoxLayout()
        row.addWidget(QLabel("<b>Categories</b> (Save to update project filters on site)"))
        row.addStretch()
        row.addWidget(QPushButton("+ New category", clicked=self.add_category))
        row.addWidget(QPushButton("Delete", clicked=self.delete_category))
        self.form_layout.addLayout(row)

        self.cat_list = QListWidget()
        self.cat_list.setMaximumHeight(200)
        self.cat_list.currentItemChanged.connect(self._on_select)
        self.form_layout.addWidget(self.cat_list)

        form = QFormLayout()
        self.label = QLineEdit()
        self.label.textChanged.connect(self._on_label_live)
        self.slug = QLineEdit()
        self.slug.setPlaceholderText("e.g. iot, security (no spaces)")
        self.icon = QComboBox()
        self.icon.addItems(ICON_OPTIONS)
        form.addRow("Display name *", self.label)
        form.addRow("Category id (slug)", self.slug)
        form.addRow("Icon", self.icon)
        self.form_layout.addLayout(form)

        hint = QLabel(
            "Built-in filters “All Projects” and “Featured” cannot be deleted. "
            "Assign categories to projects on the Projects tab."
        )
        hint.setWordWrap(True)
        hint.setStyleSheet("color: #666; font-size: 11px;")
        self.form_layout.addWidget(hint)

    def reload_from_disk(self) -> None:
        self._categories = list(self.store.read("categories"))
        self._refresh_list(self._current_id)

    def _refresh_list(self, select_id: str | None = None) -> None:
        self.cat_list.blockSignals(True)
        self.cat_list.clear()
        for cat in self._categories:
            if cat.get("id") in ("all", "featured"):
                continue
            item = QListWidgetItem(cat.get("label", cat.get("id", "?")))
            item.setData(Qt.ItemDataRole.UserRole, cat.get("id"))
            self.cat_list.addItem(item)
        self.cat_list.blockSignals(False)
        if select_id:
            for i in range(self.cat_list.count()):
                if self.cat_list.item(i).data(Qt.ItemDataRole.UserRole) == select_id:
                    self.cat_list.setCurrentRow(i)
                    return
        if self.cat_list.count():
            self.cat_list.setCurrentRow(0)
        self._preview()

    def _current(self) -> dict | None:
        if not self._current_id:
            return None
        return next((c for c in self._categories if c.get("id") == self._current_id), None)

    def _on_select(self, current: QListWidgetItem | None, _prev) -> None:
        if self._loading or not current:
            return
        self._stash()
        self._current_id = current.data(Qt.ItemDataRole.UserRole)
        cat = self._current()
        if cat:
            self._load(cat)

    def _stash(self) -> None:
        cat = self._current()
        if not cat or cat.get("id") in ("all", "featured"):
            return
        label = self.label.text().strip() or cat.get("label", "Category")
        cat["label"] = label
        slug = self.slug.text().strip() or cat.get("id", "")
        if slug and slug != cat.get("id"):
            cat["id"] = slug
            self._current_id = slug
        cat["icon"] = self.icon.currentText()

    def _load(self, cat: dict) -> None:
        self._loading = True
        self.label.setText(cat.get("label", ""))
        self.slug.setText(cat.get("id", ""))
        self.icon.setCurrentText(cat.get("icon", "Cpu"))
        self._loading = False

    def _on_label_live(self, text: str) -> None:
        if self._loading:
            return
        row = self.cat_list.currentRow()
        if row >= 0:
            self.cat_list.item(row).setText(text.strip() or "New Category")
        cat = self._current()
        if cat:
            cat["label"] = text.strip() or "New Category"
        self._preview()

    def _preview(self) -> None:
        self.refresh_json_preview(self._categories)

    def save(self) -> None:
        self._stash()
        if not self.label.text().strip() and self._current_id not in (None, "all", "featured"):
            QMessageBox.warning(self, "Save", "Display name is required.")
            return
        self.store.write("categories", self._categories)
        clear_categories_cache()
        self.reload_from_disk()
        QMessageBox.information(self, "Saved", "project-categories.json updated.")

    def add_category(self) -> None:
        self._stash()
        slug = new_id("cat")
        cat = {"id": slug, "label": "New Category", "icon": "Cpu"}
        self._categories.append(cat)
        self._current_id = slug
        self._refresh_list(slug)
        self._load(cat)

    def delete_category(self) -> None:
        cat = self._current()
        if not cat or cat.get("id") in ("all", "featured"):
            QMessageBox.information(self, "Delete", "This category cannot be removed.")
            return
        if (
            QMessageBox.question(
                self,
                "Delete category?",
                f'Delete "{cat.get("label")}"?\n\nProjects using this category keep their id — update them on the Projects tab.',
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                QMessageBox.StandardButton.No,
            )
            != QMessageBox.StandardButton.Yes
        ):
            return
        cid = cat.get("id")
        self._categories = [c for c in self._categories if c.get("id") != cid]
        self._current_id = None
        self._refresh_list()
        self._preview()
