"""Split-panel page: human-friendly form + live JSON preview."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any, Callable

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QComboBox,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QScrollArea,
    QSplitter,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

from ..paths import CONTENT_DIR


class FormPage(QWidget):
    """Base page with form (left) and JSON preview (right)."""

    def __init__(self, title: str, json_key: str, parent=None):
        super().__init__(parent)
        self.title = title
        self.json_key = json_key
        self.json_filename = self._filename_for_key(json_key)
        self._on_save: Callable[[], None] | None = None

        root = QVBoxLayout(self)
        header = QHBoxLayout()
        header.addWidget(QLabel(f"<b>{title}</b>"))
        header.addStretch()
        self.save_btn = QPushButton("Save")
        self.save_btn.clicked.connect(self._save_clicked)
        header.addWidget(self.save_btn)
        root.addLayout(header)

        splitter = QSplitter(Qt.Horizontal)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        self.form_host = QWidget()
        self.form_layout = QVBoxLayout(self.form_host)
        self.form_layout.setAlignment(Qt.AlignTop)
        scroll.setWidget(self.form_host)
        splitter.addWidget(scroll)

        json_panel = QWidget()
        json_layout = QVBoxLayout(json_panel)
        json_layout.addWidget(QLabel("JSON file (read-only preview)"))

        file_row = QHBoxLayout()
        self.file_combo = QComboBox()
        for f in sorted(CONTENT_DIR.glob("*.json")):
            self.file_combo.addItem(f.name, str(f))
        idx = self.file_combo.findText(self.json_filename)
        if idx >= 0:
            self.file_combo.setCurrentIndex(idx)
        self.file_combo.currentIndexChanged.connect(self._load_selected_json_file)
        file_row.addWidget(self.file_combo, 1)
        open_btn = QPushButton("Open folder")
        open_btn.clicked.connect(self._open_content_folder)
        file_row.addWidget(open_btn)
        json_layout.addLayout(file_row)

        self.json_preview = QTextEdit()
        self.json_preview.setReadOnly(True)
        self.json_preview.setPlaceholderText("Save to refresh JSON preview…")
        json_layout.addWidget(self.json_preview)
        splitter.addWidget(json_panel)
        splitter.setSizes([700, 400])

        root.addWidget(splitter, 1)
        self.refresh_json_preview()

    @staticmethod
    def _filename_for_key(key: str) -> str:
        mapping = {"categories": "project-categories.json"}
        return mapping.get(key, f"{key}.json")

    def set_save_handler(self, handler: Callable[[], None]) -> None:
        self._on_save = handler

    def _save_clicked(self) -> None:
        if self._on_save:
            self._on_save()

    def refresh_json_preview(self, data: Any | None = None) -> None:
        if data is not None:
            self.json_preview.setPlainText(json.dumps(data, indent=2, ensure_ascii=False))
            return
        path = CONTENT_DIR / self.json_filename
        if path.exists():
            self.json_preview.setPlainText(path.read_text(encoding="utf-8"))

    def _load_selected_json_file(self) -> None:
        path = self.file_combo.currentData()
        if path:
            self.json_preview.setPlainText(Path(path).read_text(encoding="utf-8"))

    def _open_content_folder(self) -> None:
        subprocess.Popen(["xdg-open", str(CONTENT_DIR)])
