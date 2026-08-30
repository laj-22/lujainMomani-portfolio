"""CV upload / replace panel — reused on Dashboard, Site, and Assets tabs."""

from __future__ import annotations

from pathlib import Path

from PySide6.QtWidgets import QFileDialog, QHBoxLayout, QLabel, QMessageBox, QPushButton, QVBoxLayout, QWidget

from ..store import ContentStore


class CvReplacePanel(QWidget):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__(parent)
        self.store = store

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)

        title = QLabel("<b>CV / Resume (PDF)</b>")
        layout.addWidget(title)

        hint = QLabel(
            "Replaces the file used by the Download CV button on your site. "
            "The previous PDF is archived automatically."
        )
        hint.setWordWrap(True)
        hint.setStyleSheet("color: #666; font-size: 11px;")
        layout.addWidget(hint)

        row = QHBoxLayout()
        self.status = QLabel()
        self.status.setWordWrap(True)
        self.btn = QPushButton("Choose PDF to replace CV…")
        self.btn.clicked.connect(self.replace_cv)
        row.addWidget(self.status, 1)
        row.addWidget(self.btn)
        layout.addLayout(row)

        self.refresh()

    def refresh(self) -> None:
        cv = self.store.cv_status()
        if cv.get("exists"):
            archives = cv.get("archives") or []
            archive_note = f" · {len(archives)} archived" if archives else ""
            self.status.setText(f"✓ public/LujainCV.pdf ({cv.get('size_kb', 0)} KB){archive_note}")
        else:
            self.status.setText("No CV uploaded yet — add your PDF here")

    def replace_cv(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, "Select CV PDF", "", "PDF (*.pdf)")
        if not path:
            return

        self.store.save_cv_pdf(Path(path))
        site = self.store.read("site")
        site["cvPath"] = "LujainCV.pdf"
        self.store.write("site", site)
        self.refresh()

        cv = self.store.cv_status()
        archives = cv.get("archives") or []
        archive_msg = ""
        if archives:
            archive_msg = f"\n\nPrevious copy archived to:\npublic/archive/cv/{archives[0]}"

        QMessageBox.information(
            self,
            "CV updated",
            f"Saved to public/LujainCV.pdf.{archive_msg}\n\n"
            "The Download CV button on your site will use this file.",
        )
