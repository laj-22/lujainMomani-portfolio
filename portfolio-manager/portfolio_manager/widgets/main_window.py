"""Main Portfolio Manager window."""

from __future__ import annotations

from pathlib import Path

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QComboBox,
    QDialog,
    QDialogButtonBox,
    QFileDialog,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QSplitter,
    QStackedWidget,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

from ..constants import clear_categories_cache
from ..git_ops import git_diff, git_publish, git_status
from ..preview import start_preview, stop_preview
from ..store import ContentStore
from ..validate import validate_all
from .activities_page import ActivitiesPage
from .categories_page import CategoriesPage
from .cv_panel import CvReplacePanel
from .experience_page import ExperiencePage
from .projects_page import ProjectsPage
from .publications_page import PublicationsPage
from .site_page import SitePage
from .skills_page import SkillsPage
from .thesis_page import ThesisPage


class PublishDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Publish to GitHub")
        layout = QVBoxLayout(self)
        layout.addWidget(QLabel("Changes that will be committed:"))
        self.diff = QTextEdit()
        self.diff.setReadOnly(True)
        self.diff.setPlainText(git_diff())
        layout.addWidget(self.diff)
        layout.addWidget(QLabel("Commit message:"))
        self.message = QLineEdit()
        self.message.setPlaceholderText("Add new project and update skills")
        layout.addWidget(self.message)
        buttons = QDialogButtonBox(QDialogButtonBox.Cancel | QDialogButtonBox.Ok)
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        layout.addWidget(buttons)


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.store = ContentStore()
        self.setWindowTitle("Portfolio Manager")
        self.resize(1400, 900)

        self.nav = QListWidget()
        self.nav.addItems(
            [
                "Dashboard",
                "Projects",
                "Project Categories",
                "Thesis / Spotlight",
                "Skills",
                "Featured Project",
                "Publications",
                "Activities",
                "Experience",
                "Site Information",
                "Assets",
                "Validate",
                "Preview",
                "Publish",
            ]
        )
        self.nav.currentRowChanged.connect(self._show_page)

        self.stack = QStackedWidget()
        self.projects_page = ProjectsPage(self.store)
        self.categories_page = CategoriesPage(self.store)
        self.thesis_page = ThesisPage(self.store)
        self.skills_page = SkillsPage(self.store)
        self.pubs_page = PublicationsPage(self.store)
        self.act_page = ActivitiesPage(self.store)
        self.exp_page = ExperiencePage(self.store)
        self.site_page = SitePage(self.store)

        self.pages = [
            self._build_dashboard(),
            self.projects_page,
            self.categories_page,
            self.thesis_page,
            self.skills_page,
            self._build_featured(),
            self.pubs_page,
            self.act_page,
            self.exp_page,
            self.site_page,
            self._build_assets(),
            self._build_validate(),
            self._build_preview(),
            self._build_publish(),
        ]
        for page in self.pages:
            self.stack.addWidget(page)

        splitter = QSplitter()
        splitter.addWidget(self.nav)
        splitter.addWidget(self.stack)
        splitter.setSizes([200, 1200])
        self.setCentralWidget(splitter)
        self.nav.setCurrentRow(0)

    def _show_page(self, index: int) -> None:
        self.stack.setCurrentIndex(index)
        if index == 0:
            self._refresh_dashboard()
        if index == 10 and hasattr(self, "assets_cv"):
            self.assets_cv.refresh()
        if index in (1, 2):
            clear_categories_cache()
            self.projects_page.reload_categories()

    def _build_dashboard(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("<h2>Portfolio Manager</h2>"))
        layout.addWidget(QLabel("Edit content with forms on the left. JSON preview on the right of each tab."))
        self.dash_counts = QLabel()
        self.dash_git = QLabel()
        self.dash_git.setWordWrap(True)
        layout.addWidget(self.dash_counts)
        layout.addWidget(self.dash_git)
        self.dashboard_cv = CvReplacePanel(self.store)
        layout.addWidget(self.dashboard_cv)
        row = QHBoxLayout()
        for label, slot in (
            ("+ New Project", lambda: self.nav.setCurrentRow(1)),
            ("Preview", self._do_preview),
            ("Validate", lambda: (self.nav.setCurrentRow(11), self._do_validate())),
            ("Publish", self._open_publish),
        ):
            btn = QPushButton(label)
            btn.clicked.connect(slot)
            row.addWidget(btn)
        layout.addLayout(row)
        layout.addStretch()
        return w

    def _refresh_dashboard(self) -> None:
        c = self.store.counts()
        self.dash_counts.setText(
            f"Projects: {c['projects']} | Skills: {c['skills']} | "
            f"Publications: {c['publications']} | Activities: {c['activities']}"
        )
        self.dash_git.setText(f"Git status:\n{git_status()}")
        if hasattr(self, "dashboard_cv"):
            self.dashboard_cv.refresh()

    def _build_featured(self) -> QWidget:
        w = QWidget()
        layout = QFormLayout(w)
        layout.addRow(QLabel("Pick which project appears in the Projects 'Featured' filter."))
        layout.addRow(QLabel("The graduation spotlight bar is edited under Thesis / Spotlight."))
        self.featured_combo = QComboBox()
        self._reload_featured_combo()
        save = QPushButton("Save featured flag on project")
        save.clicked.connect(self._save_featured)
        layout.addRow("Featured project", self.featured_combo)
        layout.addRow(save)
        return w

    def _reload_featured_combo(self) -> None:
        self.featured_combo.clear()
        for p in self.store.read("projects"):
            self.featured_combo.addItem(p.get("title", "?"), p.get("id"))

    def _save_featured(self) -> None:
        pid = self.featured_combo.currentData()
        if not pid:
            return
        self.store.set_only_featured(pid)
        self.projects_page.reload()
        self._reload_featured_combo()
        QMessageBox.information(
            self,
            "Saved",
            "Only one project is now marked featured. It will appear first in the projects list.",
        )

    def _build_assets(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("<b>Images</b> — stored in public/pictures/ (your existing project photos)"))
        img_btn = QPushButton("Upload project image")
        img_btn.clicked.connect(self._upload_asset)
        self.asset_result = QLabel()
        layout.addWidget(img_btn)
        layout.addWidget(self.asset_result)

        self.assets_cv = CvReplacePanel(self.store)
        layout.addWidget(self.assets_cv)
        sync_btn = QPushButton("Sync all assets (fix image paths in JSON)")
        sync_btn.clicked.connect(self._sync_assets)
        layout.addWidget(sync_btn)
        layout.addStretch()
        return w

    def _sync_assets(self) -> None:
        import subprocess
        script = Path(__file__).resolve().parents[3] / "scripts" / "sync_assets.py"
        repo = Path(__file__).resolve().parents[3]
        result = subprocess.run(
            ["python3", str(script)], cwd=repo, capture_output=True, text=True
        )
        self.projects_page.reload()
        self.thesis_page.load()
        QMessageBox.information(
            self,
            "Asset sync",
            (result.stdout or "Done.") + ("\n" + result.stderr if result.stderr else ""),
        )

    def _upload_asset(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, "Upload image", "", "Images (*.png *.jpg *.jpeg *.webp)")
        if path:
            rel = self.store.save_image(Path(path), Path(path).stem)
            self.asset_result.setText(f"Uploaded: {rel}\nUse this path in Projects → Image dropdown.")

    def _build_validate(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("Errors block publish. Warnings are suggestions only."))
        btn = QPushButton("Run validation")
        btn.clicked.connect(self._do_validate)
        fix_featured = QPushButton("Fix: keep only first featured project")
        fix_featured.clicked.connect(self._fix_featured)
        self.validate_output = QTextEdit()
        self.validate_output.setReadOnly(True)
        layout.addWidget(btn)
        layout.addWidget(fix_featured)
        layout.addWidget(self.validate_output)
        return w

    def _fix_featured(self) -> None:
        projects = self.store.read("projects")
        featured = [p for p in projects if p.get("featured")]
        if not featured:
            QMessageBox.information(self, "Featured", "No featured projects to fix.")
            return
        keep_id = featured[0].get("id")
        if keep_id:
            self.store.set_only_featured(keep_id)
            self.projects_page.reload()
            self._reload_featured_combo()
            self._do_validate()
            QMessageBox.information(
                self,
                "Fixed",
                f'Kept "{featured[0].get("title", "?")}" as the only featured project.',
            )

    def _do_validate(self) -> None:
        errors, warnings = validate_all(self.store)
        lines = []
        if errors:
            lines.append("ERRORS (fix before publish):")
            lines.extend(f"  ❌ {e}" for e in errors)
        if warnings:
            lines.append("\nWARNINGS:")
            lines.extend(f"  ⚠ {w}" for w in warnings)
        if not errors and not warnings:
            lines.append("✅ All checks passed. Ready to preview and publish.")
        text = "\n".join(lines)
        if hasattr(self, "validate_output"):
            self.validate_output.setPlainText(text)
        if errors:
            QMessageBox.warning(self, "Validation", text)
        elif not hasattr(self, "validate_output"):
            QMessageBox.information(self, "Validation", text)

    def _build_preview(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("Starts npm run dev and opens your portfolio in the browser."))
        layout.addWidget(QLabel("URL: http://127.0.0.1:PORT/lujainMomani-portfolio/"))
        row = QHBoxLayout()
        start = QPushButton("Start / Open Preview")
        start.clicked.connect(self._do_preview)
        stop = QPushButton("Stop Preview Server")
        stop.clicked.connect(lambda: (stop_preview(), self.preview_status.setText("Preview stopped.")))
        row.addWidget(start)
        row.addWidget(stop)
        layout.addLayout(row)
        self.preview_status = QLabel()
        self.preview_status.setWordWrap(True)
        layout.addWidget(self.preview_status)
        layout.addStretch()
        return w

    def _do_preview(self) -> None:
        url, msg = start_preview()
        if hasattr(self, "preview_status"):
            self.preview_status.setText(f"{msg}\n\nIf the page is blank, wait a few seconds and refresh.")

    def _build_publish(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("Workflow: Validate → Preview → Publish → GitHub Actions deploys to Pages"))
        self.pub_status = QTextEdit()
        self.pub_status.setReadOnly(True)
        self.pub_status.setPlainText(git_status())
        refresh = QPushButton("Refresh git status")
        refresh.clicked.connect(lambda: self.pub_status.setPlainText(git_status()))
        validate = QPushButton("Validate first")
        validate.clicked.connect(self._do_validate)
        publish = QPushButton("Publish…")
        publish.clicked.connect(self._open_publish)
        layout.addWidget(refresh)
        layout.addWidget(validate)
        layout.addWidget(self.pub_status)
        layout.addWidget(publish)
        return w

    def _open_publish(self) -> None:
        errors, warnings = validate_all(self.store)
        if errors:
            QMessageBox.warning(
                self,
                "Cannot publish",
                "Fix these errors first:\n\n" + "\n".join(errors),
            )
            return
        if warnings:
            proceed = QMessageBox.question(
                self,
                "Warnings",
                "Warnings (you can still publish):\n\n" + "\n".join(warnings[:8])
                + ("\n…" if len(warnings) > 8 else "")
                + "\n\nContinue?",
            )
            if proceed != QMessageBox.Yes:
                return
        dlg = PublishDialog(self)
        if dlg.exec() == QDialog.Accepted:
            ok, msg = git_publish(dlg.message.text())
            if ok:
                QMessageBox.information(self, "Published", msg + "\n\nGitHub Actions will deploy to Pages.")
            else:
                QMessageBox.warning(self, "Publish failed", msg)
