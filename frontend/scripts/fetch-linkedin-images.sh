#!/usr/bin/env bash
# fetch-linkedin-images.sh
# Pull the LinkedIn AI TechStack image library into the app so the Images
# Gallery and the sidebar card load automatically, right from the folder you
# pointed at (or straight from its GitHub repo), with the latest each run.
#
# Defaults:
#   SOURCE_DIR   D:/WorkSpace/LinkedIn_AI_TechStack_Images
#   IMG_DIR      ../frontend/public/linkedin_ai_techstack_images
#   REPO_URL     https://github.com/<you>/linkedin-ai-techstack-images.git
#   COMMIT_MSG   "chore(img): pull LinkedIn AI TechStack images"
#
# Usage:
#   ./scripts/fetch-linkedin-images.sh            # from the local folder
#   SOURCE_DIR=/other/path ./scripts/fetch-linkedin-images.sh
#   REPO_URL=https://github.com/you/foo.git ./scripts/fetch-linkedin-images.sh
#   REPO_BRANCH=main ./scripts/fetch-linkedin-images.sh
#
set -u

SOURCE_DIR="${SOURCE_DIR:-D:/WorkSpace/LinkedIn_AI_TechStack_Images}"
IMG_DIR="${IMG_DIR:-../frontend/public/linkedin_ai_techstack_images}"
REPO_URL="${REPO_URL:-}"
REPO_BRANCH="${REPO_BRANCH:-main}"
COMMIT_MSG="${COMMIT_MSG:-chore(img): pull LinkedIn AI TechStack images}"
SKIP_SUBFOLDERS="${SKIP_SUBFOLDERS:-0}"

# Resolve img_dir relative to this script's folder (scripts/).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMG_DIR="$(cd "$IMG_DIR" 2>/dev/null && pwd)" || IMG_DIR=""

say() { printf '%s\n' "$*"; }

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || { say "ERROR: missing command '$1'"; exit 1; }
}

need_cmd "mkdir"
need_cmd "cp"      # use cp for portable local copies
need_cmd "rsync"   # optional but preferred for large image trees
need_cmd "git"

if [ -z "$SOURCE_DIR" ] || [ ! -d "$SOURCE_DIR" ]; then
  say "ERROR: source folder not found: $SOURCE_DIR"
  say "Set SOURCE_DIR to the LinkedIn AI TechStack image folder (or use REPO_URL to pull from git)."
  exit 1
fi

# --- 1. Fresh checkout or pull of the image repo --------------------------------
if [ -n "$REPO_URL" ] && [ -d "$IMG_DIR/.git" ]; then
  say ">>> Updating existing git clone at $IMG_DIR ..."
  git -C "$IMG_DIR" fetch --all --prune
  git -C "$IMG_DIR" checkout "$REPO_BRANCH" 2>/dev/null || git -C "$IMG_DIR" switch "$REPO_BRANCH" 2>/dev/null || true
  git -C "$IMG_DIR" reset --hard "origin/$REPO_BRANCH" 2>/dev/null || true
  git -C "$IMG_DIR" pull --ff-only origin "$REPO_BRANCH" 2>&1 | tail -3
elif [ -n "$REPO_URL" ]; then
  say ">>> Cloning $REPO_URL into $IMG_DIR ..."
  rm -rf "$IMG_DIR"
  git clone --branch "$REPO_BRANCH" --depth 1 "$REPO_URL" "$IMG_DIR" 2>&1 | tail -4
elif [ -d "$SOURCE_DIR" ]; then
  rm -rf "$IMG_DIR"
  mkdir -p "$IMG_DIR"
  # Mirror the whole folder so every sub-folder (incl. the Inference Engine
  # sub-folder with the 1674 images) is available.
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "$SOURCE_DIR/" "$IMG_DIR/" 2>&1 | tail -6
  else
    cp -a "$SOURCE_DIR/." "$IMG_DIR/" 2>&1 | tail -6
  fi
else
  say "ERROR: neither SOURCE_DIR ($SOURCE_DIR) nor REPO_URL ($REPO_URL) is usable."
  exit 1
fi

if [ ! -d "$IMG_DIR" ] || [ -z "$(ls -A "$IMG_DIR" 2>/dev/null)" ]; then
  say "ERROR: image folder is empty after fetch: $IMG_DIR"
  exit 1
fi

# --- 2. Refresh the file manifest so the app / Images Gallery picks up the   ---
#      new images. The manifest is generated from the public/ sources only
#      (frontend/scripts/generateManifest.js), which scans BACKEND_HEADERS,
#      images/, data/, and EXTRA_SCAN_PATHS. We therefore run the generator
#      for the two relevant roots:
#        - public/images  (built-in, already scanned)
#        - public/linkedin_ai_techstack_images (extra source, via the vite proxy)
#
# NOTE: the GitHub daily-sync scripts (refreshGithubRepos.mjs, etc.) already
# handle /api/github; this script only refreshes the static file manifest so
# the new images are discoverable. If the backend is running it will also pick
# the folder up via /api/raw/linkedin_ai_techstack_images automatically.

say ">>> Refreshing file manifest for the LinkedIn image source ..."

# Run the manifest generator from the frontend dir if present.
FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST_SCRIPT="$FRONTEND_DIR/scripts/generateManifest.js"

if [ -f "$MANIFEST_SCRIPT" ]; then
  # Re-run the generator: it re-scans all sources and rewrites src/fileManifest.json.
  (cd "$FRONTEND_DIR" && node scripts/generateManifest.js 2>&1) | tail -8
else
  say "NOTE: manifest script not found at $MANIFEST_SCRIPT; manifest not regenerated."
  say "      Run 'npm run manifest' from the frontend folder to refresh src/fileManifest.json."
fi

# --- 3. Summary ---------------------------------------------------------------
IMG_COUNT="$(find "$IMG_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.webp' \) 2>/dev/null | wc -l)"
say "\nDone."
say "  Source : $SOURCE_DIR"
say "  Images : $IMG_DIR"
say "  Image files copied: $IMG_COUNT"
say "  Manifest refreshed from: $FRONTEND_DIR/src/fileManifest.json"
say "  Serve at: http://localhost:4173/linkedin_ai_techstack_images/"
