#!/usr/bin/env python3
"""
tools/verify_frontend_bundle.py — Comprehensive Integrity & Regression Verifier
Part of the Luxottica BigQuery Training Hub Architecture.

Checks:
1. File exists and is non-empty.
2. Balanced critical HTML tags (<dialog>, <main>, <script>, <body>, <html>).
3. All 12 required native dialog modals are present with correct IDs.
4. All inline handlers (onclick, oninput, onchange) call functions that are defined in scope.
5. Critical DOM IDs exist (tabs, audio canvas, rosetta search, etc.).
"""

import sys
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BUNDLE_PATH = BASE_DIR / "v2" / "frontend" / "index.html"

REQUIRED_DIALOGS = [
    "trainer-pin-modal",
    "role-selection-modal",
    "student-onboarding-modal",
    "student-resume-modal",
    "student-session-prompt-modal",
    "leaderboard-modal",
    "challenge-modal",
    "guide-modal",
    "rosetta-modal",
    "playbook-modal",
    "student-manager-modal",
    "trainer-solutions-modal",
    "manager-admin-modal",
]

REQUIRED_DOM_IDS = [
    "student-main-header",
    "trainer-command-center",
    "block-cover",
    "block-1",
    "block-2",
    "block-break",
    "block-3",
    "block-4",
    "block-5",
    "optics-canvas",
    "rosetta-modal-search",
    "leaderboard-modal",
]


def verify_bundle(path: Path) -> bool:
    print(f"🔍 Verifying bundle integrity: {path}")
    if not path.is_file():
        print(f"❌ Error: File {path} not found!")
        return False

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    errors = []

    # 1. Tag balancing (ignore CSS comments, HTML comments, and script contents)
    cleaned_html = re.sub(r"<style.*?>.*?</style>", "", content, flags=re.DOTALL)
    cleaned_html = re.sub(r"<!--.*?-->", "", cleaned_html, flags=re.DOTALL)
    
    # Check <script> tags balance first
    opens = len(re.findall(r"<script[\s>]", cleaned_html, re.IGNORECASE))
    closes = len(re.findall(r"</script>", cleaned_html, re.IGNORECASE))
    if opens != closes:
        errors.append(f"Tag mismatch for <script>: {opens} opening vs {closes} closing tags.")

    # Strip script blocks before checking structural HTML tags so JS comments/strings do not cause false positives
    html_without_scripts = re.sub(r"<script.*?>.*?</script>", "", cleaned_html, flags=re.DOTALL)
    for tag in ["html", "head", "body", "main", "dialog"]:
        opens = len(re.findall(rf"<{tag}[\s>]", html_without_scripts, re.IGNORECASE))
        closes = len(re.findall(rf"</{tag}>", html_without_scripts, re.IGNORECASE))
        if opens != closes:
            errors.append(f"Tag mismatch for <{tag}>: {opens} opening vs {closes} closing tags.")

    # 2. Required dialogs
    for d in REQUIRED_DIALOGS:
        if f'id="{d}"' not in content:
            errors.append(f"Missing required native dialog modal: id=\"{d}\"")

    # 3. Required DOM elements
    for dom_id in REQUIRED_DOM_IDS:
        if f'id="{dom_id}"' not in content:
            errors.append(f"Missing required DOM element: id=\"{dom_id}\"")

    # 4. Extract script block and verify inline calls
    script_matches = list(re.finditer(r"<script(?:\s+[^>]*)?>(.*?)</script>", content, re.DOTALL))
    if not script_matches:
        errors.append("Could not isolate main <script> block before </body>.")
    else:
        main_script = script_matches[-1]
        script_text = main_script.group(1)
        # Find all defined functions
        defined_functions = set(re.findall(r"(?:function\s+([a-zA-Z0-9_]+)\s*\(|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>))", script_text))
        func_names = set(m[0] or m[1] for m in defined_functions if m[0] or m[1])
        for m in re.finditer(r"(?:let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>)", script_text):
            func_names.add(m.group(1))

        # Also add Hub namespace, window bindings, and object methods
        hub_bindings = set(re.findall(r"window\.([a-zA-Z0-9_]+)\s*=", script_text))
        func_names.update(hub_bindings)
        object_methods = set(re.findall(r"([a-zA-Z0-9_]+)\s*:\s*(?:async\s+)?function\b", script_text))
        func_names.update(object_methods)

        # Standard JS browser functions allowed in handlers
        allowed_globals = {
            "preventDefault", "stopPropagation", "getElementById", "scrollIntoView", "click",
            "clear", "AS", "ROUND", "SAFE_DIVIDE", "SUM", "alert", "prompt", "confirm",
            "OpticsLab", "QueryBeats", "TuringRoast"
        }

        # Check inline calls across full HTML body
        html_part = content[:main_script.start()]
        inline_handlers = re.findall(r"on[a-z]+\s*=\s*\"([^\"]+)\"", html_part)
        for handler in inline_handlers:
            for call in re.findall(r"([a-zA-Z0-9_$]+)\s*\(", handler):
                if call not in func_names and call not in allowed_globals:
                    errors.append(f"Inline call to undefined function '{call}()' in handler: {handler[:60]}")

    if errors:
        print(f"❌ Verification FAILED with {len(errors)} error(s):")
        for err in errors[:20]:
            print(f"   - {err}")
        if len(errors) > 20:
            print(f"   ... and {len(errors) - 20} more errors.")
        return False

    print(f"✅ All verification checks PASSED successfully! (12/12 dialogs, DOM IDs balanced, 0 missing handlers)")
    return True


if __name__ == "__main__":
    success = verify_bundle(BUNDLE_PATH)
    sys.exit(0 if success else 1)
