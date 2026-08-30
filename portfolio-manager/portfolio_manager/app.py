import sys

from PySide6.QtWidgets import QApplication

from .widgets.main_window import MainWindow


def run() -> None:
    # Ensure existing repo images/CV are wired to JSON before UI opens
    import subprocess
    from pathlib import Path

    script = Path(__file__).resolve().parents[2] / "scripts" / "sync_assets.py"
    if script.exists():
        subprocess.run(["python3", str(script)], cwd=script.parents[1], capture_output=True)

    app = QApplication(sys.argv)
    app.setApplicationName("Portfolio Manager")
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
