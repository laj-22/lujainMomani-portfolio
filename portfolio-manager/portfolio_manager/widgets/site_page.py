"""Site / contact / about editor."""

from __future__ import annotations

from PySide6.QtWidgets import QFormLayout, QLineEdit, QMessageBox

from ..links import SITE_LEGACY, sync_links
from ..store import ContentStore
from .form_helpers import LinksEditor
from .cv_panel import CvReplacePanel
from .form_page import FormPage
from .rich_editor import RichTextEditor


class SitePage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Site Information", "site", parent)
        self.store = store
        self._build_ui()
        self.set_save_handler(self.save)
        self.load()

    def _build_ui(self) -> None:
        form = QFormLayout()
        self.name = QLineEdit()
        self.title = QLineEdit()
        self.email = QLineEdit()
        self.social_links = LinksEditor("Social & profile links", SITE_LEGACY)
        self.location = QLineEdit()
        self.footer = QLineEdit()
        self.cv_panel = CvReplacePanel(self.store)
        self.about = RichTextEditor("About paragraphs (separate with blank lines)")
        form.addRow("Name *", self.name)
        form.addRow("Job title", self.title)
        form.addRow("Email", self.email)
        form.addRow(self.social_links)
        form.addRow("Location", self.location)
        form.addRow("Footer text", self.footer)
        form.addRow(self.cv_panel)
        form.addRow("About section", self.about)
        self.form_layout.addLayout(form)

    def load(self) -> None:
        site = self.store.read("site")
        self.name.setText(site.get("name", ""))
        self.title.setText(site.get("title", ""))
        self.email.setText(site.get("email", ""))
        self.social_links.set_from_data(site)
        self.location.setText(site.get("location", ""))
        self.footer.setText(site.get("footer", ""))
        paragraphs = site.get("aboutParagraphs", [])
        self.about.setHtml("\n\n".join(paragraphs))
        self.cv_panel.refresh()
        self.refresh_json_preview(site)

    def save(self) -> None:
        if not self.name.text().strip():
            QMessageBox.warning(self, "Save", "Name is required.")
            return
        about_text = self.about.toPlainText()
        paragraphs = [p.strip() for p in about_text.split("\n\n") if p.strip()]
        site = self.store.read("site")
        site.update(
            {
                "name": self.name.text().strip(),
                "title": self.title.text().strip(),
                "email": self.email.text().strip(),
                "location": self.location.text().strip(),
                "footer": self.footer.text().strip(),
                "cvPath": "LujainCV.pdf",
                "aboutParagraphs": paragraphs,
            }
        )
        sync_links(site, self.social_links.get_links(), SITE_LEGACY)
        self.store.write("site", site)
        about = self.store.read("about")
        about["paragraphs"] = paragraphs
        self.store.write("about", about)
        self.refresh_json_preview(site)
        QMessageBox.information(self, "Saved", "site.json updated.")
