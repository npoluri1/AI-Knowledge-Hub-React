import React, { useEffect, useState } from 'react'

/**
 * Client-side DOCX → HTML renderer using mammoth.js.
 *
 * `mammoth` is loaded lazily via dynamic `import('mammoth/mammoth.browser')` so
 * it never lands in the initial JS bundle — only users who actually click a
 * `.docx` file pay the ~80 KB download cost.
 *
 * Flow:
 *   1. fetch the .docx as ArrayBuffer (browser-native, works with any URL
 *      vite serves — `/images/…`, `/linkedin_ai_techstack_images/…`, etc.)
 *   2. hand the buffer to mammoth.convertToHtml with image handler returning
 *      data: URIs so embedded images render inline.
 *   3. dangerouslySetInnerHTML the result into a styled wrapper that re-uses
 *      our existing `.fv-rich-text-wrapper` class for tables/lists/headings.
 *
 * Error / edge paths:
 *   - HTTP / mammoth throw      → "Couldn't render DOCX" + download fallback
 *   - successfully rendered but empty html       → "Empty document" note
 *   - starts processing                          → "Loading DOCX…" spinner
 *
 * SECURITY: mammoth's output IS sanitized against basic threats but is NOT
 * a DomPurify-grade sanitizer. Word hyperlinks round-trip to <a href="…">;
 * a hostile .docx could plant `data:` URLs in those anchors. For the user's
 * own .docx files in `AI_stuff_docs/` this is acceptable. For untrusted
 * input, route the result through DOMPurify before dangerouslySetInnerHTML.
 */
export default function DocxViewer({ url, fileName, fallbackLabel }) {
  // phase drives the spinner / success / error UI. `html` is the rendered
  // HTML when phase==='ready'. `html === ''` from mammoth is a valid
  // (empty document) outcome — distinguishable from `null` (no data) which
  // we use to mean "render failed".
  const [state, setState] = useState({
    phase: 'loading',      // 'loading' | 'ready' | 'error'
    html: null,
    warnings: null,
    error: null,
  })

  useEffect(() => {
    let active = true
    setState({ phase: 'loading', html: null, warnings: null, error: null })

    ;(async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching .docx`)
        const buffer = await res.arrayBuffer()
        if (!active) return

        // Lazy bundle import — keeps initial page load fast (vite code-splits
        // mammoth into its own chunk, only fetched when this component runs).
        const mammoth = (await import('mammoth/mammoth.browser')).default

        const result = await mammoth.convertToHtml(
          { arrayBuffer: buffer },
          {
            // Inline images as base64 data: URIs so they render inside our HTML.
            // Without convertImage, <img> tags would reference non-existent paths.
            convertImage: (mammoth.images && mammoth.images.imgElement)
              ? mammoth.images.imgElement((image) =>
                  image.read('base64').then((data) => ({
                    src: `data:${image.contentType};base64,${data}`,
                  }))
                )
              : undefined,
          }
        )
        if (!active) return
        setState({
          phase: 'ready',
          html: result.value || '',          // mammoth may return '' for empty docx
          warnings: result.messages || [],
          error: null,
        })
      } catch (err) {
        if (!active) return
        setState({
          phase: 'error',
          html: null,
          warnings: null,
          error: err?.message || String(err),
        })
      }
    })()

    return () => { active = false }
  }, [url])

  if (state.phase === 'loading') {
    return <div className="fv-loading">📝 Loading DOCX content…</div>
  }

  if (state.phase === 'error') {
    return (
      <div className="fv-placeholder">
        <div className="fv-placeholder-icon">📝</div>
        <p className="fv-placeholder-text">{fallbackLabel || fileName || 'Word document'}</p>
        <p className="fv-placeholder-hint">
          Couldn't render DOCX in browser ({state.error || 'unknown error'}).
          Open the original in Word / Office for the authoritative layout.
        </p>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="fv-download-btn"
            download={fileName || undefined}
          >
            📥 Open in new tab / Download
          </a>
        )}
      </div>
    )
  }

  // phase === 'ready'. Distinguish a legitimately empty document ('') from
  // a nonexistent render (null) so the user can tell "no content" from
  // "fatal error". `state.html` for ready phase is always a string.
  const warningCount = (state.warnings || []).length
  if (state.html === '') {
    return (
      <div className="docx-content">
        <div className="fv-rich-text-wrapper docx-html" style={{ color: 'var(--text-muted)' }}>
          <p>📄 The document rendered successfully but contains no text content (empty docx, or text-only-inside-images).</p>
        </div>
        {url && (
          <div className="fv-summary" style={{ marginTop: 12 }}>
            <p className="fv-summary-text">
              <a href={url} target="_blank" rel="noopener noreferrer">Open in Word</a> to inspect raw content.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="docx-content">
      <div
        className="fv-rich-text-wrapper docx-html"
        // See top-of-file SECURITY note — fine for trusted input, needs
        // DOMPurify for untrusted.
        dangerouslySetInnerHTML={{ __html: state.html }}
      />
      {warningCount > 0 && (
        <div className="fv-summary" style={{ marginTop: 12 }}>
          <p className="fv-summary-text">
            ⚠ {warningCount} DOCX element{warningCount === 1 ? '' : 's'} skipped
            {warningCount > 0 ? ' (e.g. shapes, textboxes, complex layouts)' : ''}.{' '}
            <a href={url} target="_blank" rel="noopener noreferrer">Open in Word</a>{' '}
            for full fidelity.
          </p>
        </div>
      )}
    </div>
  )
}
