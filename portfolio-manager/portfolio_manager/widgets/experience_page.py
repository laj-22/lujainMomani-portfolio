"""Professional experience editor — save-only draft."""

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

from ..draft import new_id
from ..store import ContentStore
from .form_helpers import ListEditor
from .form_page import FormPage


class ExperiencePage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Experience", "experience", parent)
        self.store = store
        self._data: list[dict] = []
        self._current_id: str | None = None
        self._loading = False
        self._build_ui()
        self.set_save_handler(self.save)
        self.reload_from_disk()

    def _build_ui(self) -> None:
        row = QHBoxLayout()
        row.addWidget(QLabel("<b>Roles</b> (changes apply only when you click Save)"))
        row.addStretch()
        row.addWidget(QPushButton("+ New role", clicked=self.add_item))
        row.addWidget(QPushButton("Delete", clicked=self.delete_item))
        self.form_layout.addLayout(row)

        self.role_list = QListWidget()
        self.role_list.setMaximumHeight(160)
        self.role_list.currentItemChanged.connect(self._on_select)
        self.form_layout.addWidget(self.role_list)

        form = QFormLayout()
        self.title = QLineEdit()
        self.title.textChanged.connect(self._on_title_live)
        self.meta = QLineEdit()
        self.meta.setPlaceholderText("Dubai, UAE • Sept 2025 - Present")
        self.bullets = ListEditor("Responsibilities / bullets")
        form.addRow("Job title *", self.title)
        form.addRow("Meta line", self.meta)
        form.addRow(self.bullets)
        self.form_layout.addLayout(form)

    def reload_from_disk(self) -> None:
        self._data = list(self.store.read("experience"))
        self._refresh_list(self._current_id)

    def _refresh_list(self, select_id: str | None = None) -> None:
        self.role_list.blockSignals(True)
        self.role_list.clear()
        for item in self._data:
            li = QListWidgetItem(item.get("title", "?"))
            li.setData(Qt.ItemDataRole.UserRole, item.get("id"))
            self.role_list.addItem(li)
        self.role_list.blockSignals(False)
        if select_id:
            for i in range(self.role_list.count()):
                if self.role_list.item(i).data(Qt.ItemDataRole.UserRole) == select_id:
                    self.role_list.setCurrentRow(i)
                    return
        if self.role_list.count():
            self.role_list.setCurrentRow(0)

    def _current(self) -> dict | None:
        if not self._current_id:
            return None
        return next((x for x in self._data if x.get("id") == self._current_id), None)

    def _on_select(self, current: QListWidgetItem | None, _prev) -> None:
        if self._loading or not current:
            return
        self._stash()
        self._current_id = current.data(Qt.ItemDataRole.UserRole)
        item = self._current()
        if item:
            self._load(item)

    def _stash(self) -> None:
        item = self._current()
        if not item:
            return
        item.update(
            {
                "title": self.title.text().strip() or item.get("title", "New Role"),
                "meta": self.meta.text().strip(),
                "bullets": self.bullets.get_lines(),
            }
        )

    def _load(self, item: dict) -> None:
        self._loading = True
        self.title.setText(item.get("title", ""))
        self.meta.setText(item.get("meta", ""))
        self.bullets.set_lines(item.get("bullets", []))
        self._loading = False
        self.refresh_json_preview(self._data)

    def _on_title_live(self, text: str) -> None:
        if self._loading:
            return
        item = self._current()
        if not item:
            return
        item["title"] = text.strip() or "New Role"
        row = self.role_list.currentRow()
        if row >= 0:
            self.role_list.item(row).setText(item["title"])
        self.refresh_json_preview(self._data)

    def save(self) -> None:
        self._stash()
        if not self.title.text().strip():
            QMessageBox.warning(self, "Save", "Job title is required.")
            return
        for i, item in enumerate(self._data):
            item["order"] = i + 1
        self.store.write("experience", self._data)
        self.refresh_json_preview(self._data)
        QMessageBox.information(self, "Saved", "experience.json updated.")

    def add_item(self) -> None:
        self._stash()
        item = {
            "id": new_id("exp"),
            "title": "New Role",
            "meta": "",
            "bullets": [],
            "order": len(self._data) + 1,
        }
        self._data.append(item)
        self._current_id = item["id"]
        self._refresh_list(item["id"])
        self._load(item)

    def delete_item(self) -> None:
        item = self._current()
        if not item:
            return
        if (
            QMessageBox.question(
                self,
                "Delete role?",
                f'Remove "{item.get("title")}"?\n\nClick Save to update experience.json.',
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                QMessageBox.StandardButton.No,
            )
            != QMessageBox.StandardButton.Yes
        ):
            return
        self._data = [x for x in self._data if x.get("id") != self._current_id]
        self._current_id = self._data[-1]["id"] if self._data else None
        self._refresh_list(self._current_id)
        if self._current_id:
            self._load(self._current())
        self.refresh_json_preview(self._data)
