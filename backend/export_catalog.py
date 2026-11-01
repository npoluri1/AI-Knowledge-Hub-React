# export_catalog.py — dump the deterministic LinkedIn daily catalog to JSON.
# The Go accelerator service (../linkedin-service) reads this file so both the
# Python backend and the Go service generate IDENTICAL daily posts (same ids,
# same content) from one single source of truth.

import json
import os

import linkedin_daily as ld

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "linkedin_catalog.json")


def main():
    catalog = {
        "topics": ld.TOPICS,
        "profiles": ld.PROFILES,
        "template": ld.POST_TEMPLATE,
        "apply": ld.APPLY,
        "experiments": ld.EXPERIMENTS,
    }
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(catalog, fh, ensure_ascii=False, indent=1)
    print(f"Wrote {OUT}: {len(catalog['topics'])} topics, {len(catalog['profiles'])} profiles")


if __name__ == "__main__":
    main()
