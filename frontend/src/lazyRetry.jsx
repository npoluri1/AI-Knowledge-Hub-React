import React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// lazyRetry — drop-in replacement for React.lazy that survives redeploys.
//
// Problem: a long-lived tab runs an old bundle whose lazy chunks are
// content-hashed (e.g. StudyByDoingView-KeWYNWIN.js). After a rebuild the file
// no longer exists → "Failed to fetch dynamically imported module" → the whole
// route crashes with a white screen.
//
// Fix: on a chunk-load failure, reload the page ONCE (sessionStorage-guarded so
// it can never loop) to pick up the fresh index.html and its new hashes. If a
// second failure happens in the same session, fall back to React.lazy behavior.
// ─────────────────────────────────────────────────────────────────────────────

const RETRY_FLAG = 'chunk-reloaded-for'

function markReloaded() {
  try { sessionStorage.setItem(RETRY_FLAG, String(Date.now())) } catch { /* private mode */ }
}
function alreadyReloaded() {
  try {
    const ts = Number(sessionStorage.getItem(RETRY_FLAG) || 0)
    // Consider the flag stale after 10 s — a normal navigation clears the way.
    return ts > 0 && (Date.now() - ts) < 10000
  } catch { return false }
}

export function lazyRetry(factory) {
  return React.lazy(() =>
    factory().catch(err => {
      const msg = String(err && (err.message || err) || '')
      const isChunkError =
        /Failed to fetch dynamically imported module/i.test(msg) ||
        /error loading dynamically imported module/i.test(msg) ||
        /Importing a module script failed/i.test(msg) ||
        /Loading chunk \d+ failed/i.test(msg) ||
        /dynamically imported module/i.test(msg) ||
        /Unable to preload CSS/i.test(msg)
      if (isChunkError && !alreadyReloaded()) {
        markReloaded()
        // Preserve the current route so the user lands back where they were.
        try { sessionStorage.setItem('last-path', window.location.pathname + window.location.search) } catch { /* ignore */ }
        window.location.reload()
      }
      throw err
    })
  )
}
