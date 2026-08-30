"""Word-style rich text editor with font, size, color, and formatting."""

from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QColor, QFont, QTextCharFormat, QTextCursor
from PySide6.QtWidgets import (
    QColorDialog,
    QComboBox,
    QFontComboBox,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QSpinBox,
    QTextEdit,
    QToolButton,
    QVBoxLayout,
    QWidget,
)


class RichTextEditor(QWidget):
    htmlChanged = Signal(str)

    def __init__(self, placeholder: str = "", parent=None):
        super().__init__(parent)
        self.editor = QTextEdit()
        self.editor.setAcceptRichText(True)
        self.editor.setPlaceholderText(placeholder)
        self.editor.textChanged.connect(self._emit_html)

        toolbar = QHBoxLayout()
        self.font_combo = QFontComboBox()
        self.font_combo.currentFontChanged.connect(self._set_font_family)

        self.size_spin = QSpinBox()
        self.size_spin.setRange(8, 72)
        self.size_spin.setValue(12)
        self.size_spin.valueChanged.connect(self._set_font_size)

        self.bold_btn = self._mk_btn("B", "Bold", self._toggle_bold)
        self.italic_btn = self._mk_btn("I", "Italic", self._toggle_italic)
        self.underline_btn = self._mk_btn("U", "Underline", self._toggle_underline)

        self.text_color_btn = QPushButton("A")
        self.text_color_btn.setToolTip("Text color")
        self.text_color_btn.clicked.connect(self._pick_text_color)

        self.highlight_btn = QPushButton("🖍")
        self.highlight_btn.setToolTip("Highlight color")
        self.highlight_btn.clicked.connect(self._pick_highlight)

        self.heading_combo = QComboBox()
        self.heading_combo.addItems(["Normal", "Heading 1", "Heading 2", "Heading 3"])
        self.heading_combo.currentIndexChanged.connect(self._apply_heading)

        for widget in (
            QLabel("Font"),
            self.font_combo,
            QLabel("Size"),
            self.size_spin,
            self.bold_btn,
            self.italic_btn,
            self.underline_btn,
            self.text_color_btn,
            self.highlight_btn,
            QLabel("Style"),
            self.heading_combo,
        ):
            toolbar.addWidget(widget)
        toolbar.addStretch()

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addLayout(toolbar)
        layout.addWidget(self.editor)

    def _mk_btn(self, text: str, tip: str, slot) -> QToolButton:
        btn = QToolButton()
        btn.setText(text)
        btn.setToolTip(tip)
        btn.setCheckable(True)
        btn.clicked.connect(slot)
        return btn

    def _emit_html(self) -> None:
        self.htmlChanged.emit(self.editor.toHtml())

    def setHtml(self, html: str) -> None:
        if not html:
            self.editor.clear()
            return
        if "<" in html and ">" in html:
            self.editor.setHtml(html)
        else:
            self.editor.setPlainText(html)

    def toHtml(self) -> str:
        return self.editor.toHtml()

    def toPlainText(self) -> str:
        return self.editor.toPlainText()

    def _merge_format(self, updater) -> None:
        cursor = self.editor.textCursor()
        fmt = QTextCharFormat()
        updater(fmt)
        if cursor.hasSelection():
            cursor.mergeCharFormat(fmt)
        else:
            self.editor.mergeCurrentCharFormat(fmt)

    def _set_font_family(self, font: QFont) -> None:
        self._merge_format(lambda f: f.setFontFamilies([font.family()]))

    def _set_font_size(self, size: int) -> None:
        self._merge_format(lambda f: f.setFontPointSize(size))

    def _toggle_bold(self) -> None:
        weight = QFont.Bold if self.bold_btn.isChecked() else QFont.Normal
        self._merge_format(lambda f: f.setFontWeight(weight))

    def _toggle_italic(self) -> None:
        self._merge_format(lambda f: f.setFontItalic(self.italic_btn.isChecked()))

    def _toggle_underline(self) -> None:
        self._merge_format(lambda f: f.setFontUnderline(self.underline_btn.isChecked()))

    def _pick_text_color(self) -> None:
        color = QColorDialog.getColor(QColor("#111111"), self, "Text color")
        if color.isValid():
            self._merge_format(lambda f: f.setForeground(color))

    def _pick_highlight(self) -> None:
        color = QColorDialog.getColor(QColor("#fff59d"), self, "Highlight color")
        if color.isValid():
            self._merge_format(lambda f: f.setBackground(color))

    def _apply_heading(self, index: int) -> None:
        sizes = {0: 12, 1: 24, 2: 20, 3: 16}
        weight = QFont.Bold if index else QFont.Normal
        size = sizes.get(index, 12)

        def apply(fmt: QTextCharFormat) -> None:
            fmt.setFontPointSize(size)
            fmt.setFontWeight(weight)

        self._merge_format(apply)
