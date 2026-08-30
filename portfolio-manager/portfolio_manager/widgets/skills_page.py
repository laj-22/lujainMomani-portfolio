"""Skills editor — category + skill manager, save-only draft."""

from __future__ import annotations

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

from ..constants import COLOR_OPTIONS, ICON_OPTIONS
from ..store import ContentStore
from .form_page import FormPage


class SkillsPage(FormPage):
    def __init__(self, store: ContentStore, parent=None):
        super().__init__("Skills", "skills", parent)
        self.store = store
        self._data: dict = {"categories": [], "relatedProjects": {}}
        self._loading = False
        self._build_ui()
        self.set_save_handler(self.save)
        self.reload_from_disk()

    def _build_ui(self) -> None:
        hint = QLabel(
            "Edit categories and skills below. Changes show in the JSON preview — click Save to update the site."
        )
        hint.setWordWrap(True)
        hint.setStyleSheet("color: #666; font-size: 11px;")
        self.form_layout.addWidget(hint)

        cat_row = QHBoxLayout()
        cat_row.addWidget(QLabel("<b>Categories</b>"))
        cat_row.addStretch()
        cat_row.addWidget(QPushButton("+ Category", clicked=self.add_category))
        self.form_layout.addLayout(cat_row)

        self.cat_list = QListWidget()
        self.cat_list.setMaximumHeight(120)
        self.cat_list.currentItemChanged.connect(self._on_category_selected)
        self.form_layout.addWidget(self.cat_list)

        skill_row = QHBoxLayout()
        skill_row.addWidget(QLabel("<b>Skills in category</b>"))
        skill_row.addStretch()
        skill_row.addWidget(QPushButton("+ Skill", clicked=self.add_skill))
        self.form_layout.addLayout(skill_row)

        self.skill_list = QListWidget()
        self.skill_list.setMaximumHeight(160)
        self.skill_list.currentItemChanged.connect(self._on_skill_selected)
        self.form_layout.addWidget(self.skill_list)

        form = QFormLayout()
        self.cat_title = QLineEdit()
        self.cat_title.textChanged.connect(self._on_cat_title_live)
        self.cat_icon = QComboBox()
        self.cat_icon.addItems(ICON_OPTIONS)
        self.cat_color = QComboBox()
        self.cat_color.addItems(COLOR_OPTIONS)
        self.skill_name = QLineEdit()
        self.skill_name.textChanged.connect(self._on_skill_name_live)
        self.skill_icon = QComboBox()
        self.skill_icon.addItems(ICON_OPTIONS)
        self.related = QLineEdit()
        self.related.setPlaceholderText("Comma-separated project titles linked to this skill")
        form.addRow("Category title", self.cat_title)
        form.addRow("Category icon", self.cat_icon)
        form.addRow("Category color", self.cat_color)
        form.addRow("Skill name *", self.skill_name)
        form.addRow("Skill icon", self.skill_icon)
        form.addRow("Related projects", self.related)
        self.form_layout.addLayout(form)

        del_row = QHBoxLayout()
        del_row.addStretch()
        self.delete_cat_btn = QPushButton("Delete this category…")
        self.delete_cat_btn.clicked.connect(self.delete_category)
        self.delete_skill_btn = QPushButton("Delete selected skill…")
        self.delete_skill_btn.clicked.connect(self.delete_skill)
        del_row.addWidget(self.delete_skill_btn)
        del_row.addWidget(self.delete_cat_btn)
        self.form_layout.addLayout(del_row)

    def reload_from_disk(self) -> None:
        self._data = self.store.read("skills")
        self._refresh_categories()

    def _cat_index(self) -> int:
        return self.cat_list.currentRow()

    def _skill_index(self) -> int:
        return self.skill_list.currentRow()

    def _current_category(self) -> dict | None:
        cats = self._data.get("categories", [])
        i = self._cat_index()
        return cats[i] if 0 <= i < len(cats) else None

    def _current_skill(self) -> dict | None:
        cat = self._current_category()
        if not cat:
            return None
        skills = cat.get("skills", [])
        i = self._skill_index()
        return skills[i] if 0 <= i < len(skills) else None

    def _refresh_categories(self, select_index: int | None = None) -> None:
        self.cat_list.blockSignals(True)
        self.cat_list.clear()
        for cat in self._data.get("categories", []):
            count = len(cat.get("skills", []))
            self.cat_list.addItem(f"{cat.get('title', '?')} ({count} skills)")
        self.cat_list.blockSignals(False)
        if self._data.get("categories"):
            idx = select_index if select_index is not None else 0
            self.cat_list.setCurrentRow(min(idx, len(self._data["categories"]) - 1))
            self._refresh_skills()
        else:
            self._clear_form()
        self._preview()

    def _refresh_skills(self, select_index: int | None = None) -> None:
        cat = self._current_category()
        self.skill_list.blockSignals(True)
        self.skill_list.clear()
        if cat:
            for skill in cat.get("skills", []):
                item = QListWidgetItem(skill.get("name", "?"))
                self.skill_list.addItem(item)
        self.skill_list.blockSignals(False)
        if cat and cat.get("skills"):
            idx = select_index if select_index is not None else 0
            self.skill_list.setCurrentRow(min(idx, len(cat["skills"]) - 1))
            self._load_skill_fields()
        self._update_category_label()
        self._preview()

    def _update_category_label(self) -> None:
        ci = self._cat_index()
        cat = self._current_category()
        if ci >= 0 and cat and ci < self.cat_list.count():
            count = len(cat.get("skills", []))
            self.cat_list.item(ci).setText(f"{cat.get('title', '?')} ({count} skills)")

    def _on_category_selected(self, current: QListWidgetItem | None, _prev) -> None:
        if self._loading or not current:
            return
        self._stash_form()
        self._refresh_skills()

    def _on_skill_selected(self, current: QListWidgetItem | None, _prev) -> None:
        if self._loading or not current:
            return
        self._stash_form()
        self._load_skill_fields()

    def _stash_form(self) -> None:
        cat = self._current_category()
        skill = self._current_skill()
        if not cat:
            return
        cat["title"] = self.cat_title.text().strip() or cat.get("title", "Category")
        cat["icon"] = self.cat_icon.currentText()
        cat["color"] = self.cat_color.currentText()
        if skill:
            old_name = skill.get("name", "")
            new_name = self.skill_name.text().strip() or old_name or "New Skill"
            skill["name"] = new_name
            skill["icon"] = self.skill_icon.currentText()
            rel = [x.strip() for x in self.related.text().split(",") if x.strip()]
            related = self._data.setdefault("relatedProjects", {})
            if old_name and old_name != new_name and old_name in related:
                related.pop(old_name, None)
            related[new_name] = rel
            si = self._skill_index()
            if si >= 0 and si < self.skill_list.count():
                self.skill_list.item(si).setText(new_name)

    def _load_skill_fields(self) -> None:
        cat = self._current_category()
        skill = self._current_skill()
        if not cat:
            self._clear_form()
            return
        self._loading = True
        self.cat_title.setText(cat.get("title", ""))
        self.cat_icon.setCurrentText(cat.get("icon", "Cpu"))
        self.cat_color.setCurrentText(cat.get("color", "primary"))
        if skill:
            self.skill_name.setText(skill.get("name", ""))
            self.skill_icon.setCurrentText(skill.get("icon", "Terminal"))
            rel = self._data.get("relatedProjects", {}).get(skill.get("name", ""), [])
            self.related.setText(", ".join(rel))
        else:
            self.skill_name.clear()
            self.skill_icon.setCurrentIndex(0)
            self.related.clear()
        self._loading = False

    def _clear_form(self) -> None:
        self._loading = True
        self.cat_title.clear()
        self.skill_name.clear()
        self.related.clear()
        self._loading = False

    def _on_cat_title_live(self, text: str) -> None:
        if self._loading:
            return
        cat = self._current_category()
        if cat:
            cat["title"] = text.strip() or "Category"
            self._update_category_label()

    def _on_skill_name_live(self, text: str) -> None:
        if self._loading:
            return
        skill = self._current_skill()
        if skill:
            skill["name"] = text.strip() or "New Skill"
            si = self._skill_index()
            if si >= 0 and si < self.skill_list.count():
                self.skill_list.item(si).setText(skill["name"])
        self._preview()

    def _preview(self) -> None:
        self.refresh_json_preview(self._data)

    def save(self) -> None:
        self._stash_form()
        cats = self._data.get("categories", [])
        for cat in cats:
            for skill in cat.get("skills", []):
                if not skill.get("name", "").strip():
                    QMessageBox.warning(self, "Save", "Every skill needs a name.")
                    return
        self.store.write("skills", self._data)
        self.refresh_json_preview(self._data)
        QMessageBox.information(self, "Saved", "skills.json updated — refresh site preview to see changes.")

    def add_category(self) -> None:
        self._stash_form()
        self._data.setdefault("categories", []).append(
            {"title": "New Category", "icon": "Cpu", "color": "primary", "skills": []}
        )
        self._refresh_categories(select_index=len(self._data["categories"]) - 1)
        self._load_skill_fields()

    def add_skill(self) -> None:
        cat = self._current_category()
        if not cat:
            QMessageBox.information(self, "Add skill", "Select or create a category first.")
            return
        self._stash_form()
        cat.setdefault("skills", []).append({"name": "New Skill", "icon": "Terminal"})
        self._data.setdefault("relatedProjects", {})["New Skill"] = []
        self._refresh_skills(select_index=len(cat["skills"]) - 1)
        self._load_skill_fields()

    def delete_skill(self) -> None:
        cat = self._current_category()
        si = self._skill_index()
        if not cat or si < 0 or si >= len(cat.get("skills", [])):
            QMessageBox.information(self, "Delete skill", "Select a skill from the list first.")
            return
        name = cat["skills"][si].get("name", "?")
        if (
            QMessageBox.question(
                self,
                "Delete skill?",
                f'Delete skill "{name}"?\n\nClick Save to remove it from the website.',
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                QMessageBox.StandardButton.No,
            )
            != QMessageBox.StandardButton.Yes
        ):
            return
        cat["skills"].pop(si)
        self._data.get("relatedProjects", {}).pop(name, None)
        new_idx = min(si, len(cat["skills"]) - 1) if cat["skills"] else -1
        self._refresh_skills(select_index=new_idx if new_idx >= 0 else None)
        if new_idx >= 0:
            self._load_skill_fields()
        else:
            self.skill_name.clear()
            self.related.clear()
        self._preview()

    def delete_category(self) -> None:
        ci = self._cat_index()
        cat = self._current_category()
        if not cat or ci < 0:
            return
        title = cat.get("title", "?")
        count = len(cat.get("skills", []))
        if (
            QMessageBox.question(
                self,
                "Delete category?",
                f'Delete category "{title}" and all {count} skill(s) in it?\n\n'
                "Click Save to remove from the website.",
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                QMessageBox.StandardButton.No,
            )
            != QMessageBox.StandardButton.Yes
        ):
            return
        for skill in cat.get("skills", []):
            self._data.get("relatedProjects", {}).pop(skill.get("name", ""), None)
        self._data["categories"].pop(ci)
        new_ci = min(ci, len(self._data["categories"]) - 1) if self._data["categories"] else -1
        self._refresh_categories(select_index=new_ci if new_ci >= 0 else None)
        if new_ci >= 0:
            self._refresh_skills()
            self._load_skill_fields()
        else:
            self._clear_form()
        self._preview()
