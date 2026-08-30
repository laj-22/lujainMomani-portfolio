import subprocess
from pathlib import Path

from .paths import REPO_ROOT


def git_status() -> str:
    result = subprocess.run(
        ["git", "status", "--short"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    return result.stdout.strip() or "No changes"


def git_diff() -> str:
    result = subprocess.run(
        ["git", "diff", "--stat"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    stat = result.stdout.strip()
    result2 = subprocess.run(
        ["git", "diff"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    body = result2.stdout.strip()
    return (stat + "\n\n" + body).strip() or "No diff"


def git_publish(message: str) -> tuple[bool, str]:
    if not message.strip():
        return False, "Commit message is required."

    add = subprocess.run(["git", "add", "-A"], cwd=REPO_ROOT, capture_output=True, text=True)
    if add.returncode != 0:
        return False, add.stderr or add.stdout

    commit = subprocess.run(
        ["git", "commit", "-m", message.strip()],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    if commit.returncode != 0:
        return False, commit.stderr or commit.stdout or "Nothing to commit"

    push = subprocess.run(["git", "push"], cwd=REPO_ROOT, capture_output=True, text=True)
    if push.returncode != 0:
        return False, push.stderr or push.stdout

    return True, "Published successfully (commit + push)."
