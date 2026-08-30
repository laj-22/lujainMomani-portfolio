"""Publications editor — flat paper list, save-only persistence."""

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
    QWidget,
)

from ..constants import PUBLICATION_STATUS
from ..draft import new_id
from ..links import PUBLICATION_LEGACY, sync_links
from ..store import ContentStore
from .form_helpers import LinksEditor
from .form_page import FormPage
from .rich_editor import RichTextEditor


class PublicationsPage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Publications", "publications", parent)
        self.store = store
        self._papers: list[dict] = []
        self._current_id: str | None = None
        self._loading_form = False
        self._build_ui()
        self.set_save_handler(self.save)
        self.reload_from_disk()

    def _build_ui(self) -> None:
        row = QHBoxLayout()
        row.addWidget(QLabel("<b>Papers</b> (click to edit — nothing is written until Save)"))
        row.addStretch()
        row.addWidget(QPushButton("+ New paper", clicked=self.add_pub))
        row.addWidget(QPushButton("Delete", clicked=self.delete_pub))
        self.form_layout.addLayout(row)

        self.paper_list = QListWidget()
        self.paper_list.setMinimumHeight(140)
        self.paper_list.setMaximumHeight(220)
        self.paper_list.currentItemChanged.connect(self._on_paper_selected)
        self.form_layout.addWidget(self.paper_list)

        form = QFormLayout()
        self.title = QLineEdit()
        self.title.textChanged.connect(self._on_title_live)
        self.authors = QLineEdit()
        self.conference = QLineEdit()
        self.year = QLineEdit()
        self.status = QComboBox()
        self.status.addItems(PUBLICATION_STATUS)
        self.status.currentTextChanged.connect(self._on_status_live)
        self.links = LinksEditor("Links (paper, DOI, PDF, …)", PUBLICATION_LEGACY)
        self.doi = QLineEdit()
        self.abstract = RichTextEditor("Abstract (optional)")
        form.addRow("Title *", self.title)
        form.addRow("Authors", self.authors)
        form.addRow("Venue / Journal", self.conference)
        form.addRow("Year", self.year)
        form.addRow("Status", self.status)
        form.addRow(self.links)
        form.addRow("DOI", self.doi)
        form.addRow("Abstract", self.abstract)
        self.form_layout.addLayout(form)

    def reload_from_disk(self) -> None:
        raw = self.store.read("publications")
        self._papers = []
        seen: set[str] = set()
        for key in ("published", "underReview"):
            for paper in raw.get(key, []):
                pid = paper.get("id") or new_id("pub")
                if pid in seen:
                    continue
                seen.add(pid)
                self._papers.append(dict(paper))
        self._refresh_paper_list(self._current_id)

    def _refresh_paper_list(self, select_id: str | None = None) -> None:
        self.paper_list.blockSignals(True)
        self.paper_list.clear()
        for paper in self._papers:
            status = paper.get("status", "published")
            badge = {"published": "✓", "under-review": "⏳", "in-progress": "…"}.get(status, "?")
            item = QListWidgetItem(f"{badge} {paper.get('title', 'Untitled')}")
            item.setData(Qt.ItemDataRole.UserRole, paper.get("id"))
            self.paper_list.addItem(item)
        self.paper_list.blockSignals(False)

        if select_id:
            for i in range(self.paper_list.count()):
                if self.paper_list.item(i).data(Qt.ItemDataRole.UserRole) == select_id:
                    self.paper_list.setCurrentRow(i)
                    break
        elif self.paper_list.count() and self.paper_list.currentRow() < 0:
            self.paper_list.setCurrentRow(0)

        self._preview_draft()

    def _current_paper(self) -> dict | None:
        if not self._current_id:
            return None
        return next((p for p in self._papers if p.get("id") == self._current_id), None)

    def _on_paper_selected(self, current: QListWidgetItem | None, _previous) -> None:
        if self._loading_form or current is None:
            return
        self._stash_form()
        self._current_id = current.data(Qt.ItemDataRole.UserRole)
        paper = self._current_paper()
        if paper:
            self._load_form(paper)

    def _stash_form(self) -> None:
        paper = self._current_paper()
        if not paper:
            return
        paper.update(
            {
                "title": self.title.text().strip() or paper.get("title", "Untitled"),
                "authors": self.authors.text().strip(),
                "conference": self.conference.text().strip(),
                "year": self.year.text().strip(),
                "status": self.status.currentText(),
                "doi": self.doi.text().strip(),
                "abstract": self.abstract.toPlainText(),
            }
        )
        sync_links(paper, self.links.get_links(), PUBLICATION_LEGACY)

    def _load_form(self, paper: dict) -> None:
        self._loading_form = True
        self.title.setText(paper.get("title", ""))
        self.authors.setText(paper.get("authors", ""))
        self.conference.setText(paper.get("conference", ""))
        self.year.setText(paper.get("year", ""))
        self.status.setCurrentText(paper.get("status", "published"))
        self.links.set_from_data(paper)
        self.doi.setText(paper.get("doi", ""))
        self.abstract.setHtml(paper.get("abstract", ""))
        self._loading_form = False

    def _on_title_live(self, text: str) -> None:
        if self._loading_form:
            return
        paper = self._current_paper()
        if not paper:
            return
        paper["title"] = text.strip() or "Untitled"
        row = self.paper_list.currentRow()
        if row >= 0:
            status = paper.get("status", "published")
            badge = {"published": "✓", "under-review": "⏳", "in-progress": "…"}.get(status, "?")
            self.paper_list.item(row).setText(f"{badge} {paper['title']}")
        self._preview_draft()

    def _on_status_live(self, status: str) -> None:
        if self._loading_form:
            return
        paper = self._current_paper()
        if not paper:
            return
        paper["status"] = status
        row = self.paper_list.currentRow()
        if row >= 0:
            badge = {"published": "✓", "under-review": "⏳", "in-progress": "…"}.get(status, "?")
            self.paper_list.item(row).setText(f"{badge} {paper.get('title', 'Untitled')}")
        self._preview_draft()

    def _clear_form(self) -> None:
        self._loading_form = True
        self.title.clear()
        self.authors.clear()
        self.conference.clear()
        self.year.clear()
        self.doi.clear()
        self.abstract.setHtml("")
        self.links.set_from_data({})
        self._loading_form = False

    def _preview_draft(self) -> None:
        published, under = self._split_papers(self._papers)
        self.refresh_json_preview({"published": published, "underReview": under})

    @staticmethod
    def _split_papers(papers: list[dict]) -> tuple[list[dict], list[dict]]:
        published: list[dict] = []
        under: list[dict] = []
        seen: set[str] = set()
        for paper in papers:
            pid = paper.get("id")
            if not pid or pid in seen:
                continue
            seen.add(pid)
            if paper.get("status") == "published":
                published.append(paper)
            else:
                under.append(paper)
        return published, under

    def save(self) -> None:
        self._stash_form()
        if not self.title.text().strip() and self._current_id:
            QMessageBox.warning(self, "Save", "Title is required.")
            return
        published, under = self._split_papers(self._papers)
        data = {"published": published, "underReview": under}
        self.store.write("publications", data)
        self._papers = published + under
        self.refresh_json_preview(data)
        QMessageBox.information(
            self,
            "Saved",
            f"publications.json updated.\n{len(published)} published, {len(under)} under review / in progress.",
        )

    def add_pub(self) -> None:
        self._stash_form()
        paper = {
            "id": new_id("pub"),
            "title": "New Publication",
            "authors": "",
            "conference": "",
            "year": "2026",
            "status": "under-review",
            "doi": "",
            "abstract": "",
            "links": [],
        }
        self._papers.append(paper)
        self._current_id = paper["id"]
        self._refresh_paper_list(paper["id"])
        self._load_form(paper)

    def delete_pub(self) -> None:
        paper = self._current_paper()
        if not paper:
            return
        title = paper.get("title", "Untitled")
        if (
            QMessageBox.question(
                self,
                "Delete paper?",
                f'Remove "{title}" from the list?\n\nClick Save to write this to publications.json.',
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                QMessageBox.StandardButton.No,
            )
            != QMessageBox.StandardButton.Yes
        ):
            return
        self._papers = [p for p in self._papers if p.get("id") != self._current_id]
        self._current_id = self._papers[-1]["id"] if self._papers else None
        self._refresh_paper_list(self._current_id)
        if self._current_id:
            self._load_form(self._current_paper())
        else:
            self._clear_form()
        self._preview_draft()
