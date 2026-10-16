#!/usr/bin/env python3
"""
tools/build_frontend.py — High-Performance Zero-Dependency Deterministic Frontend Assembler
Part of the Luxottica BigQuery Training Hub Architecture.

Compiles modular sources from `v2/frontend/src/` into the production atomic single-file:
`v2/frontend/index.html`.

Execution constraints:
- Pure Python 3 standard library (no pip, no node, no npm).
- Execution time < 100ms.
- Preserves 100% of browser runtime compatibility (Tailwind JIT, Alpine/native dialogs).
"""

import os
import sys
import time
import argparse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = BASE_DIR / "v2" / "frontend" / "src"
OUT_FILE = BASE_DIR / "v2" / "frontend" / "index.html"


def read_file(path: Path) -> str:
    """Read a UTF-8 text file cleanly."""
    if not path.is_file():
        raise FileNotFoundError(f"Missing required source module: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def build_bundle(src_dir: Path, out_file: Path, verbose: bool = False) -> dict:
    """
    Assemble template by resolving:
    <!-- @include "relative/path/to/part.html" -->
    or <!-- @include_js "path.js" -->
    or <!-- @include_css "path.css" -->
    """
    t0 = time.perf_counter()
    index_template = src_dir / "index.template.html"
    
    if not index_template.is_file():
        raise FileNotFoundError(f"Template entrypoint not found: {index_template}")

    content = read_file(index_template)
    
    # Recursive inclusion with loop guard
    included_files = set()

    def replace_includes(text: str, parent_dir: Path, depth: int = 0) -> str:
        if depth > 10:
            raise RecursionError("Max include depth exceeded (circular include detected).")

        lines = text.splitlines(keepends=True)
        out_lines = []
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("<!-- @include") and stripped.endswith("-->"):
                # Extract quoted path
                parts = stripped.split('"')
                if len(parts) >= 2:
                    rel_path = parts[1]
                    target = (parent_dir / rel_path).resolve()
                    
                    # Security check: must reside inside src_dir (prevent path traversal / prefix collision)
                    try:
                        target.relative_to(src_dir.resolve())
                    except ValueError:
                        raise PermissionError(f"Include path traversal outside src: {rel_path}")

                    included_files.add(str(target))
                    if verbose:
                        print(f"  [include] {target.relative_to(src_dir)}")
                    
                    sub_content = read_file(target)
                    # Recursively resolve nested includes
                    resolved_sub = replace_includes(sub_content, target.parent, depth + 1)
                    out_lines.append(resolved_sub)
                    if not resolved_sub.endswith("\n"):
                        out_lines.append("\n")
                else:
                    out_lines.append(line)
            else:
                out_lines.append(line)

        return "".join(out_lines)

    result = replace_includes(content, src_dir)

    # Ensure parent directory exists and write
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(result)

    elapsed_ms = (time.perf_counter() - t0) * 1000
    line_count = result.count("\n") + 1
    size_kb = len(result.encode("utf-8")) / 1024

    return {
        "status": "success",
        "output": str(out_file),
        "lines": line_count,
        "size_kb": size_kb,
        "modules_included": len(included_files),
        "elapsed_ms": elapsed_ms
    }


def main():
    parser = argparse.ArgumentParser(description="Deterministic Python Frontend Assembler for Luxottica Hub")
    parser.add_argument("--src", type=str, default=str(SRC_DIR), help="Source directory (defaults to v2/frontend/src)")
    parser.add_argument("--out", type=str, default=str(OUT_FILE), help="Output index.html path")
    parser.add_argument("--verbose", "-v", action="store_true", help="Print included files")
    args = parser.parse_args()

    src_path = Path(args.src).resolve()
    out_path = Path(args.out).resolve()

    try:
        stats = build_bundle(src_path, out_path, verbose=args.verbose)
        print(f"✅ Frontend assembled successfully in {stats['elapsed_ms']:.2f}ms")
        print(f"   Destination : {stats['output']}")
        print(f"   Size        : {stats['size_kb']:.1f} KB ({stats['lines']} lines)")
        print(f"   Modules     : {stats['modules_included']} modular partials included")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error during frontend assembly: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
