from __future__ import annotations

import shutil
import socket
import subprocess
import time
import urllib.error
import urllib.request
import webbrowser

from .paths import REPO_ROOT

_preview_proc: subprocess.Popen | None = None
_preview_port: int | None = None
_preview_log: list[str] = []


def _npm_cmd() -> str:
    return shutil.which("npm") or "npm"


def _port_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("127.0.0.1", port)) != 0


def _pick_port(preferred: int = 8080) -> int:
    if _port_free(preferred):
        return preferred
    for port in range(preferred + 1, preferred + 20):
        if _port_free(port):
            return port
    return preferred


def _wait_for_server(url: str, timeout: float = 30.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as resp:
                if resp.status < 500:
                    return True
        except (urllib.error.URLError, TimeoutError):
            time.sleep(0.5)
    return False


def start_preview(port: int = 8080) -> tuple[str, str]:
    """Start dev server. Returns (url, status_message)."""
    global _preview_proc, _preview_port, _preview_log

    base_path = "/lujainMomani-portfolio/"
    port = _pick_port(port)

    if _preview_proc and _preview_proc.poll() is None and _preview_port == port:
        url = f"http://127.0.0.1:{port}{base_path}"
        webbrowser.open(url)
        return url, f"Preview already running at {url}"

    if _preview_proc and _preview_proc.poll() is None:
        _preview_proc.terminate()

    log_path = REPO_ROOT / "portfolio-manager" / ".preview.log"
    log_file = open(log_path, "w", encoding="utf-8")

    _preview_proc = subprocess.Popen(
        [_npm_cmd(), "run", "dev", "--", "--host", "127.0.0.1", "--port", str(port)],
        cwd=REPO_ROOT,
        stdout=log_file,
        stderr=subprocess.STDOUT,
    )
    _preview_port = port
    url = f"http://127.0.0.1:{port}{base_path}"

    if _wait_for_server(url):
        webbrowser.open(url)
        return url, f"Preview ready: {url}"
    log_file.close()
    tail = log_path.read_text(encoding="utf-8")[-1500:] if log_path.exists() else ""
    return url, f"Server started but not responding yet.\nTry: {url}\n\nLog:\n{tail}"


def stop_preview() -> None:
    global _preview_proc, _preview_port
    if _preview_proc and _preview_proc.poll() is None:
        _preview_proc.terminate()
    _preview_proc = None
    _preview_port = None
