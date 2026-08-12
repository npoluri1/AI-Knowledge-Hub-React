"""Generate browser-loadable GitHub repository batches from the crawler CSV.

The generated files are intentionally kept outside src/ so the large catalog can
be loaded progressively instead of being bundled into the initial JavaScript.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

URL_RE = re.compile(r"https://github\.com/[^'\"\s,}]+")
OUTPUT_FIELDS = [
    "repo",
    "html_url",
    "stars",
    "language",
    "description",
    "topics",
    "source_keyword",
    "source_industry",
]


def existing_urls(catalog_path: Path) -> set[str]:
    """Collect URLs from the main catalog and its sibling data supplements."""
    paths = sorted(catalog_path.parent.glob("githubRepos*.js"))
    if catalog_path not in paths:
        paths.append(catalog_path)
    urls: set[str] = set()
    for path in paths:
        text = path.read_text(encoding="utf-8", errors="replace")
        urls.update(URL_RE.findall(text))
    return urls


def write_batches(source: Path, catalog: Path, output_dir: Path, batch_size: int) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    for old in output_dir.glob("batch-*.csv"):
        old.unlink()

    occupied = existing_urls(catalog)
    seen: set[str] = set(occupied)
    batches: list[dict] = []
    rows: list[dict[str, str]] = []
    skipped_existing = 0
    skipped_duplicate = 0
    source_rows = 0

    def flush() -> None:
        if not rows:
            return
        number = len(batches) + 1
        name = f"batch-{number:03d}.csv"
        target = output_dir / name
        with target.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=OUTPUT_FIELDS, lineterminator="\n")
            writer.writeheader()
            writer.writerows(rows)
        batches.append({"file": name, "rows": len(rows)})
        rows.clear()

    with source.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for raw in reader:
            source_rows += 1
            url = (raw.get("html_url") or "").strip()
            repo = (raw.get("repo") or "").strip()
            if not repo or not url.startswith("https://github.com/"):
                continue
            if url in occupied:
                skipped_existing += 1
                continue
            if url in seen:
                skipped_duplicate += 1
                continue
            seen.add(url)
            rows.append({field: (raw.get(field) or "").strip() for field in OUTPUT_FIELDS})
            if len(rows) >= batch_size:
                flush()
    flush()

    manifest = {
        "version": 1,
        "source": source.name,
        "batchSize": batch_size,
        "sourceRows": source_rows,
        "existingCatalogUrls": len(occupied),
        "skippedExisting": skipped_existing,
        "skippedDuplicate": skipped_duplicate,
        "importedRows": sum(batch["rows"] for batch in batches),
        "batches": batches,
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--catalog", type=Path, default=Path("frontend/src/data/githubRepos.js"))
    parser.add_argument("--output", type=Path, default=Path("frontend/public/github-repos-batches"))
    parser.add_argument("--batch-size", type=int, default=5000)
    args = parser.parse_args()
    manifest = write_batches(args.source, args.catalog, args.output, args.batch_size)
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
