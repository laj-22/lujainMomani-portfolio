"""Reusable small form helpers."""

from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import (
    QComboBox,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from ..assets import resolve_image_file
from ..constants import ICON_OPTIONS
from ..links import LINK_ICONS, LINK_TYPES, coerce_links, infer_link_type


def lines_to_list(widget: QListWidget) -> list[str]:
    return [
        widget.item(i).text().strip()
        for i in range(widget.count())
        if widget.item(i).text().strip()
    ]


def set_list_lines(widget: QListWidget, lines: list[str]) -> None:
    widget.clear()
    for line in lines:
        widget.addItem(line)


class ListEditor(QWidget):
    def __init__(self, label: str = "Items", parent=None):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(QLabel(label))
        self.list = QListWidget()
        layout.addWidget(self.list)
        row = QHBoxLayout()
        self.input = QLineEdit()
        self.input.setPlaceholderText("Type and press Add…")
        add = QPushButton("Add")
        add.clicked.connect(self._add)
        remove = QPushButton("Remove")
        remove.clicked.connect(self._remove)
        row.addWidget(self.input, 1)
        row.addWidget(add)
        row.addWidget(remove)
        layout.addLayout(row)

    def _add(self) -> None:
        text = self.input.text().strip()
        if text:
            self.list.addItem(text)
            self.input.clear()

    def _remove(self) -> None:
        for item in self.list.selectedItems():
            self.list.takeItem(self.list.row(item))

    def set_lines(self, lines: list[str]) -> None:
        set_list_lines(self.list, lines)

    def get_lines(self) -> list[str]:
        return lines_to_list(self.list)


class KeyValueEditor(QWidget):
    def __init__(self, name_label: str = "Name", role_label: str = "Role", parent=None):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        self.rows: list[tuple[QLineEdit, QLineEdit, QWidget]] = []
        self.name_label = name_label
        self.role_label = role_label
        self.container = QVBoxLayout()
        layout.addLayout(self.container)
        add = QPushButton(f"+ Add {name_label}")
        add.clicked.connect(lambda: self.add_row())
        layout.addWidget(add)

    def clear_rows(self) -> None:
        while self.container.count():
            item = self.container.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        self.rows.clear()

    def add_row(self, name: str = "", role: str = "") -> None:
        row_w = QWidget()
        row = QHBoxLayout(row_w)
        name_edit = QLineEdit(name)
        role_edit = QLineEdit(role)
        del_btn = QPushButton("✕")
        del_btn.setFixedWidth(32)
        del_btn.clicked.connect(lambda: row_w.deleteLater())
        row.addWidget(name_edit, 1)
        row.addWidget(role_edit, 1)
        row.addWidget(del_btn)
        self.container.addWidget(row_w)
        self.rows.append((name_edit, role_edit, row_w))

    def set_items(self, items: list[dict]) -> None:
        self.clear_rows()
        for item in items:
            self.add_row(item.get("name", ""), item.get("role", ""))

    def get_items(self) -> list[dict]:
        result = []
        for name_edit, role_edit, _ in self.rows:
            if not name_edit.parent():
                continue
            name = name_edit.text().strip()
            role = role_edit.text().strip()
            if name or role:
                result.append({"name": name, "role": role})
        return result


class ImagePreview(QLabel):
    """Thumbnail preview for project/thesis image paths."""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setFixedSize(220, 140)
        self.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.setStyleSheet("border: 1px solid #ccc; background: #f8f8f8; color: #666;")
        self.setText("No preview")

    def set_image_path(self, rel: str) -> None:
        rel = (rel or "").strip()
        if not rel or rel.startswith("(no image"):
            self.clear()
            self.setText("No preview")
            self.setToolTip("")
            return
        from ..assets import merge_root_pictures

        merge_root_pictures()
        path = resolve_image_file(rel)
        if not path:
            self.clear()
            self.setText(f"Not found:\n{rel}")
            self.setToolTip(f"Expected under public/pictures/ or pictures/\n{rel}")
            return
        pixmap = QPixmap(str(path))
        if pixmap.isNull():
            self.clear()
            self.setText("Cannot load image")
            self.setToolTip(str(path))
            return
        self.setPixmap(
            pixmap.scaled(
                self.width(),
                self.height(),
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation,
            )
        )
        self.setToolTip(f"{rel}\n{path}")


class _LinkRow(QWidget):
    def __init__(self, on_remove, parent=None):
        super().__init__(parent)
        row = QHBoxLayout(self)
        row.setContentsMargins(0, 0, 0, 0)
        self.type_combo = QComboBox()
        self.type_combo.setMinimumWidth(150)
        for key, label in LINK_TYPES:
            icon = LINK_ICONS.get(key, "🔗")
            self.type_combo.addItem(f"{icon} {label}", key)
        self.url_edit = QLineEdit()
        self.url_edit.setPlaceholderText("https://github.com/… or paste any URL")
        self.url_edit.editingFinished.connect(self._auto_type)
        self.label_edit = QLineEdit()
        self.label_edit.setPlaceholderText("Label (optional)")
        self.label_edit.setMaximumWidth(140)
        remove = QPushButton("✕")
        remove.setFixedWidth(32)
        remove.setToolTip("Remove link")
        remove.clicked.connect(lambda: on_remove(self))
        row.addWidget(self.type_combo)
        row.addWidget(self.url_edit, 1)
        row.addWidget(self.label_edit)
        row.addWidget(remove)

    def _auto_type(self) -> None:
        url = self.url_edit.text().strip()
        if not url:
            return
        inferred = infer_link_type(url)
        idx = self.type_combo.findData(inferred)
        if idx >= 0:
            self.type_combo.setCurrentIndex(idx)

    def set_link(self, link: dict) -> None:
        link_type = link.get("type", "other")
        idx = self.type_combo.findData(link_type)
        self.type_combo.setCurrentIndex(idx if idx >= 0 else self.type_combo.findData("other"))
        self.url_edit.setText(link.get("url", ""))
        self.label_edit.setText(link.get("label", ""))

    def get_link(self) -> dict | None:
        url = self.url_edit.text().strip()
        if not url:
            return None
        link_type = self.type_combo.currentData() or "other"
        label = self.label_edit.text().strip()
        result = {"type": link_type, "url": url}
        if label:
            result["label"] = label
        return result


class LinksEditor(QWidget):
    """Add links with type dropdown (GitHub, YouTube, LinkedIn, …) → saved to JSON `links` array."""

    def __init__(
        self,
        label: str = "Links",
        legacy_map: dict[str, str] | None = None,
        parent=None,
    ):
        super().__init__(parent)
        self.legacy_map = legacy_map or {}
        self._rows: list[_LinkRow] = []

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(QLabel(label))
        hint = QLabel("Pick a type, paste the URL — icons show on your site automatically.")
        hint.setStyleSheet("color: #666; font-size: 11px;")
        hint.setWordWrap(True)
        layout.addWidget(hint)
        self.container = QVBoxLayout()
        layout.addLayout(self.container)
        add = QPushButton("+ Add link")
        add.clicked.connect(lambda: self.add_row())
        layout.addWidget(add)

    def clear_rows(self) -> None:
        while self.container.count():
            item = self.container.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        self._rows.clear()

    def _remove_row(self, row: _LinkRow) -> None:
        if row in self._rows:
            self._rows.remove(row)
        row.deleteLater()

    def add_row(self, link: dict | None = None) -> None:
        row = _LinkRow(self._remove_row, self)
        if link:
            row.set_link(link)
        self._rows.append(row)
        self.container.addWidget(row)

    def set_from_data(self, data: dict) -> None:
        links = coerce_links(data, self.legacy_map)
        self.clear_rows()
        if links:
            for link in links:
                self.add_row(link)
        else:
            self.add_row()

    def get_links(self) -> list[dict]:
        result: list[dict] = []
        for row in self._rows:
            if not row.parent():
                continue
            link = row.get_link()
            if link:
                result.append(link)
        return result


def icon_combo(current: str = "Cpu") -> QComboBox:
    combo = QComboBox()
    combo.addItems(ICON_OPTIONS)
    idx = combo.findText(current)
    combo.setCurrentIndex(idx if idx >= 0 else 0)
    return combo
