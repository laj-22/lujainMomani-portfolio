"""Activities editor — save-only draft with live list labels."""

from __future__ import annotations

from PySide6.QtWidgets import (
    QComboBox,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
)

from ..constants import (
    ACTIVITY_CATEGORIES,
    ACTIVITY_CATEGORY_DEFAULTS,
    COLOR_OPTIONS,
    ICON_OPTIONS,
)
from ..links import ACTIVITY_LEGACY, sync_links
from ..store import ContentStore
from .form_helpers import LinksEditor
from .form_page import FormPage
from .rich_editor import RichTextEditor


class ActivitiesPage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Activities", "activities", parent)
        self.store = store
        self._data: list[dict] = []
        self._loading = False
        self._active_cat = 0
        self._active_item = 0
        self._build_ui()
        self.set_save_handler(self.save)
        self.reload_from_disk()

    def _build_ui(self) -> None:
        row = QHBoxLayout()
        self.cat_select = QComboBox()
        self.cat_select.currentIndexChanged.connect(self._on_cat_change)
        self.item_select = QComboBox()
        self.item_select.currentIndexChanged.connect(self._on_item_change)
        row.addWidget(QLabel("Category:"))
        row.addWidget(self.cat_select, 1)
        row.addWidget(QLabel("Activity:"))
        row.addWidget(self.item_select, 1)
        row.addWidget(QPushButton("+ Item", clicked=self.add_item))
        row.addWidget(QPushButton("+ Category", clicked=self.add_category))
        row.addWidget(QPushButton("Delete", clicked=self.delete_item))
        self.form_layout.addLayout(row)

        hint = QLabel("Edits update the lists above immediately but are only saved to JSON when you click Save.")
        hint.setWordWrap(True)
        hint.setStyleSheet("color: #666; font-size: 11px;")
        self.form_layout.addWidget(hint)

        form = QFormLayout()
        self.cat_name = QComboBox()
        self.cat_name.setEditable(True)
        self.cat_name.addItems(ACTIVITY_CATEGORIES)
        self.cat_name.currentTextChanged.connect(self._on_cat_name_live)
        self.cat_icon = QComboBox()
        self.cat_icon.addItems(ICON_OPTIONS)
        self.cat_color = QComboBox()
        self.cat_color.addItems(COLOR_OPTIONS)
        self.title = QLineEdit()
        self.title.textChanged.connect(self._on_title_live)
        self.role = QLineEdit()
        self.date = QLineEdit()
        self.location = QLineEdit()
        self.achievement = QLineEdit()
        self.links = LinksEditor("Links (LinkedIn, YouTube, …)", ACTIVITY_LEGACY)
        self.tags = QLineEdit()
        self.description = RichTextEditor("Activity description")
        form.addRow("Category name", self.cat_name)
        form.addRow("Category icon", self.cat_icon)
        form.addRow("Category color", self.cat_color)
        form.addRow("Title *", self.title)
        form.addRow("Role / subtitle", self.role)
        form.addRow("Date", self.date)
        form.addRow("Location", self.location)
        form.addRow("Achievement badge", self.achievement)
        form.addRow(self.links)
        form.addRow("Tags (comma-separated)", self.tags)
        form.addRow("Description", self.description)
        self.form_layout.addLayout(form)

    def reload_from_disk(self) -> None:
        self._data = list(self.store.read("activities"))
        self._refresh_categories(keep_cat_index=self.cat_select.currentIndex())

    def _cat_index(self) -> int:
        return self.cat_select.currentIndex()

    def _item_index(self) -> int:
        return self.item_select.currentIndex()

    def _refresh_categories(self, keep_cat_index: int = 0) -> None:
        self.cat_select.blockSignals(True)
        self.cat_select.clear()
        for c in self._data:
            self.cat_select.addItem(c.get("category", "?"))
        self.cat_select.blockSignals(False)
        if self._data:
            idx = min(max(keep_cat_index, 0), len(self._data) - 1)
            self.cat_select.setCurrentIndex(idx)
            self._reload_items()

    def _on_cat_change(self) -> None:
        if self._loading:
            return
        new_cat = self._cat_index()
        if new_cat != self._active_cat:
            self._stash_form_for(self._active_cat, self._active_item)
        self._active_cat = new_cat
        self._active_item = 0
        self._reload_items(select_index=0)

    def _on_item_change(self) -> None:
        if self._loading:
            return
        new_item = self._item_index()
        if new_item != self._active_item:
            self._stash_form_for(self._active_cat, self._active_item)
        self._active_item = new_item
        self._load_form()

    def _stash_category_meta(self, cat_index: int) -> None:
        if self._loading or cat_index < 0 or cat_index >= len(self._data):
            return
        cat = self._data[cat_index]
        name = self.cat_name.currentText().strip() or cat.get("category", "Category")
        icon = self.cat_icon.currentText().strip() or cat.get("icon", "Trophy")
        if icon not in ICON_OPTIONS:
            icon = cat.get("icon", "Trophy")
        color = self.cat_color.currentText().strip() or cat.get("color", "primary")
        if color not in COLOR_OPTIONS:
            color = cat.get("color", "primary")
        cat["category"] = name
        cat["icon"] = icon
        cat["color"] = color

    def _stash_item_fields(self, cat_index: int, item_index: int) -> None:
        if self._loading or cat_index < 0 or cat_index >= len(self._data):
            return
        items = self._data[cat_index].get("items", [])
        if item_index < 0 or item_index >= len(items):
            return
        items[item_index].update(
            {
                "title": self.title.text().strip() or items[item_index].get("title", "New Activity"),
                "role": self.role.text().strip(),
                "date": self.date.text().strip(),
                "location": self.location.text().strip(),
                "achievement": self.achievement.text().strip(),
                "tags": [t.strip() for t in self.tags.text().split(",") if t.strip()],
                "description": self.description.toPlainText(),
            }
        )
        sync_links(items[item_index], self.links.get_links(), ACTIVITY_LEGACY)

    def _stash_form_for(self, cat_index: int, item_index: int) -> None:
        """Save the open form into the category/item that owns it."""
        if cat_index == self._active_cat:
            self._stash_category_meta(cat_index)
        self._stash_item_fields(cat_index, item_index)

    def _stash_form(self) -> None:
        self._stash_form_for(self._active_cat, self._active_item)

    def _load_form(self) -> None:
        if self._loading:
            return
        ci, ii = self._cat_index(), self._item_index()
        if ci < 0 or ci >= len(self._data):
            return
        cat = self._data[ci]
        self._loading = True
        self.cat_name.blockSignals(True)
        self.cat_name.setCurrentText(cat.get("category", ""))
        self.cat_name.blockSignals(False)
        self.cat_icon.blockSignals(True)
        self.cat_icon.setCurrentText(cat.get("icon", "Trophy"))
        self.cat_icon.blockSignals(False)
        self.cat_color.blockSignals(True)
        self.cat_color.setCurrentText(cat.get("color", "primary"))
        self.cat_color.blockSignals(False)
        items = cat.get("items", [])
        if ii < 0 or ii >= len(items):
            self._loading = False
            return
        item = items[ii]
        self.title.setText(item.get("title", ""))
        self.role.setText(item.get("role", ""))
        self.date.setText(item.get("date", ""))
        self.location.setText(item.get("location", ""))
        self.achievement.setText(item.get("achievement", ""))
        self.links.set_from_data(item)
        self.tags.setText(", ".join(item.get("tags", [])))
        self.description.setHtml(item.get("description", ""))
        self._loading = False
        self._active_cat = ci
        self._active_item = ii
        self.refresh_json_preview(self._data)

    def _reload_items(self, select_index: int | None = None) -> None:
        ci = self._cat_index()
        cat = self._data[ci] if 0 <= ci < len(self._data) else None
        self.item_select.blockSignals(True)
        self.item_select.clear()
        if cat:
            for item in cat.get("items", []):
                self.item_select.addItem(item.get("title", "?"))
        self.item_select.blockSignals(False)
        if cat and cat.get("items"):
            idx = select_index if select_index is not None else self._active_item
            idx = min(max(idx, 0), len(cat["items"]) - 1)
            self.item_select.setCurrentIndex(idx)
            self._active_item = idx
        elif cat:
            self._active_item = 0
        self._active_cat = ci
        self._load_form()

    def _on_title_live(self, text: str) -> None:
        if self._loading:
            return
        ci, ii = self._active_cat, self._active_item
        if ci < 0 or ii < 0:
            return
        items = self._data[ci].setdefault("items", [])
        if ii >= len(items):
            return
        items[ii]["title"] = text.strip() or "New Activity"
        self.item_select.setItemText(ii, items[ii]["title"])
        self.refresh_json_preview(self._data)

    def _on_cat_name_live(self, text: str) -> None:
        if self._loading:
            return
        ci = self._active_cat
        if ci < 0 or ci >= len(self._data):
            return
        name = text.strip() or "Category"
        self._data[ci]["category"] = name
        defaults = ACTIVITY_CATEGORY_DEFAULTS.get(name)
        if defaults:
            self._data[ci]["icon"] = defaults["icon"]
            self._data[ci]["color"] = defaults["color"]
            self.cat_icon.blockSignals(True)
            self.cat_icon.setCurrentText(defaults["icon"])
            self.cat_icon.blockSignals(False)
            self.cat_color.blockSignals(True)
            self.cat_color.setCurrentText(defaults["color"])
            self.cat_color.blockSignals(False)
        self.cat_select.blockSignals(True)
        self.cat_select.setItemText(ci, name)
        self.cat_select.blockSignals(False)
        self.refresh_json_preview(self._data)

    def save(self) -> None:
        self._stash_form_for(self._active_cat, self._active_item)
        if not self.title.text().strip():
            QMessageBox.warning(self, "Save", "Activity title is required.")
            return
        self.store.write("activities", self._data)
        self.refresh_json_preview(self._data)
        QMessageBox.information(self, "Saved", "activities.json updated.")

    def add_category(self) -> None:
        self._stash_form_for(self._active_cat, self._active_item)
        used = {c.get("category", "") for c in self._data}
        name = "New Category"
        n = 2
        while name in used:
            name = f"New Category {n}"
            n += 1
        defaults = ACTIVITY_CATEGORY_DEFAULTS.get(name, {"icon": "Trophy", "color": "primary"})
        self._data.append(
            {
                "category": name,
                "icon": defaults.get("icon", "Trophy"),
                "color": defaults.get("color", "primary"),
                "items": [],
            }
        )
        self._active_cat = len(self._data) - 1
        self._active_item = 0
        self._refresh_categories(keep_cat_index=self._active_cat)

    def add_item(self) -> None:
        self._stash_form_for(self._active_cat, self._active_item)
        ci = self._cat_index()
        if ci < 0:
            self.add_category()
            ci = self._active_cat
        self._data[ci].setdefault("items", []).append(
            {"title": "New Activity", "role": "", "date": "", "tags": [], "description": ""}
        )
        self._active_item = len(self._data[ci]["items"]) - 1
        self._reload_items(select_index=self._active_item)

    def delete_item(self) -> None:
        ci, ii = self._active_cat, self._active_item
        if ci < 0 or ii < 0:
            return
        title = self._data[ci]["items"][ii].get("title", "?")
        if (
            QMessageBox.question(
                self,
                "Delete activity?",
                f'Remove "{title}"?\n\nClick Save to update activities.json.',
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                QMessageBox.StandardButton.No,
            )
            != QMessageBox.StandardButton.Yes
        ):
            return
        self._data[ci]["items"].pop(ii)
        self._active_item = min(ii, len(self._data[ci]["items"]) - 1) if self._data[ci]["items"] else 0
        self._reload_items(select_index=self._active_item)
