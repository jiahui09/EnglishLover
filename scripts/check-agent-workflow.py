#!/usr/bin/env python3
"""Validate EnglishLover agent workflow assets.

This check is intentionally dependency-light. It validates the project-level
workflow contract, repo-local skill frontmatter, and the optional plugin manifest
without requiring PyYAML or Codex runtime state.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    ROOT / "AGENTS.md",
    ROOT / "docs" / "agent-workflow-architecture.md",
    ROOT / ".agents" / "skills" / "prompt-factory" / "SKILL.md",
    ROOT / ".agents" / "skills" / "content-critic" / "SKILL.md",
    ROOT / "plugins" / "workflow-core" / ".codex-plugin" / "plugin.json",
]
SKILL_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$")


def main() -> int:
    errors: list[str] = []
    for path in REQUIRED_FILES:
        if not path.is_file():
            errors.append(f"missing required workflow file: {path.relative_to(ROOT)}")

    if not errors:
        validate_contract(errors)
        validate_skills(errors)
        validate_plugin(errors)

    if errors:
        print("Agent workflow validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Agent workflow validation passed.")
    return 0


def validate_contract(errors: list[str]) -> None:
    agents = read(ROOT / "AGENTS.md")
    architecture = read(ROOT / "docs" / "agent-workflow-architecture.md")
    for term in (
        "fact pack",
        "independent critique",
        "verification gate",
        "prompt-factory",
        "content-critic",
    ):
        if term not in agents:
            errors.append(f"AGENTS.md does not mention `{term}`")
    for term in (
        "Fact Pack -> Slice Plan -> Draft Pass -> Critic Pass -> Verifier Gate -> Promote",
        "Quality rubrics",
        "Recommended staffing patterns",
        "Done definition",
    ):
        if term not in architecture:
            errors.append(f"agent-workflow-architecture.md does not mention `{term}`")


def validate_skills(errors: list[str]) -> None:
    for skill_dir in (
        ROOT / ".agents" / "skills" / "prompt-factory",
        ROOT / ".agents" / "skills" / "content-critic",
        ROOT / "plugins" / "workflow-core" / "skills" / "prompt-factory",
        ROOT / "plugins" / "workflow-core" / "skills" / "content-critic",
    ):
        skill_md = skill_dir / "SKILL.md"
        metadata = parse_frontmatter(skill_md, errors)
        if metadata is None:
            continue
        name = metadata.get("name", "")
        description = metadata.get("description", "")
        if not SKILL_NAME_RE.fullmatch(name):
            errors.append(f"{skill_md.relative_to(ROOT)} has invalid skill name `{name}`")
        if not description:
            errors.append(f"{skill_md.relative_to(ROOT)} is missing description")


def validate_plugin(errors: list[str]) -> None:
    plugin_path = ROOT / "plugins" / "workflow-core" / ".codex-plugin" / "plugin.json"
    try:
        manifest = json.loads(plugin_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        errors.append(f"plugin.json is invalid JSON: {exc}")
        return
    required = ["name", "version", "description", "author", "skills", "interface"]
    for key in required:
        if key not in manifest:
            errors.append(f"plugin.json missing `{key}`")
    if manifest.get("name") != "workflow-core":
        errors.append("plugin.json name must be `workflow-core`")
    if manifest.get("skills") != "./skills/":
        errors.append("plugin.json skills must be `./skills/`")
    interface = manifest.get("interface")
    if not isinstance(interface, dict):
        errors.append("plugin.json interface must be an object")
    else:
        for key in ("displayName", "shortDescription", "longDescription", "developerName", "category", "capabilities", "defaultPrompt"):
            if key not in interface:
                errors.append(f"plugin.json interface missing `{key}`")


def parse_frontmatter(path: Path, errors: list[str]) -> dict[str, str] | None:
    text = read(path)
    if not text.startswith("---\n"):
        errors.append(f"{path.relative_to(ROOT)} must start with YAML frontmatter")
        return None
    end = text.find("\n---", 4)
    if end == -1:
        errors.append(f"{path.relative_to(ROOT)} frontmatter is not closed")
        return None
    metadata: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if not line.strip():
            continue
        if ":" not in line:
            errors.append(f"{path.relative_to(ROOT)} invalid frontmatter line `{line}`")
            return None
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip('"')
    return metadata


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main())
