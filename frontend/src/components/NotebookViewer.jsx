import React, { useState, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Lightweight .ipynb renderer — no external dependencies.
//
// Parses the notebook JSON, renders each cell:
//   - markdown  → simple HTML conversion
//   - code      → syntax-highlighted <pre><code> block
//   - outputs   → inline display (images, text, HTML, error tracebacks)
//
// Falls back to raw JSON display if the file isn't a valid notebook.
// ---------------------------------------------------------------------------

function simpleMarkdown(md) {
  if (!md) return ''
  let html = md
    // code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // horizontal rules
    .replace(/^---+$/gm, '<hr/>')
    // images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%"/>')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // unordered lists
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    // line breaks (double newline → paragraph)
    .replace(/\n\n+/g, '</p><p>')
    // single newline → <br/>
    .replace(/\n/g, '<br/>\n')
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
  return `<p>${html}</p>`
}

function OutputDisplay({ output }) {
  if (!output) return null

  const { output_type, data, text, ename, evalue, traceback } = output

  // Stream output (print statements)
  if (output_type === 'stream') {
    return (
      <div className="nb-output nb-output-stream">
        <pre>{Array.isArray(text) ? text.join('') : text}</pre>
      </div>
    )
  }

  // Error output
  if (output_type === 'error') {
    const tb = (traceback || []).join('\n')
    return (
      <div className="nb-output nb-output-error">
        <pre dangerouslySetInnerHTML={{ __html: tb }} />
        <div className="nb-error-name">{ename}: {evalue}</div>
      </div>
    )
  }

  // execute_result or display_data
  if (data) {
    //优先 render HTML
    if (data['text/html']) {
      const html = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html']
      return (
        <div className="nb-output nb-output-html">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )
    }
    // Image output
    if (data['image/png'] || data['image/jpeg'] || data['image/svg+xml']) {
      const imgData = data['image/png'] || data['image/jpeg']
      const mime = data['image/png'] ? 'image/png' : 'image/jpeg'
      if (imgData) {
        const src = `data:${mime};base64,${imgData}`
        return (
          <div className="nb-output nb-output-image">
            <img src={src} alt="notebook output" style={{ maxWidth: '100%' }} />
          </div>
        )
      }
      // SVG
      const svg = data['image/svg+xml']
      const svgStr = Array.isArray(svg) ? svg.join('') : svg
      return (
        <div className="nb-output nb-output-image">
          <div dangerouslySetInnerHTML={{ __html: svgStr }} />
        </div>
      )
    }
    // Plain text fallback
    if (data['text/plain']) {
      const plain = Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain']
      return (
        <div className="nb-output nb-output-text">
          <pre>{plain}</pre>
        </div>
      )
    }
  }

  return null
}

function CellView({ cell }) {
  const cellType = cell.cell_type
  const source = Array.isArray(cell.source) ? cell.source.join('') : (cell.source || '')
  const outputs = cell.outputs || []

  if (cellType === 'markdown') {
    return (
      <div className="nb-cell nb-cell-markdown">
        <div className="nb-cell-content" dangerouslySetInnerHTML={{ __html: simpleMarkdown(source) }} />
      </div>
    )
  }

  if (cellType === 'code') {
    return (
      <div className="nb-cell nb-cell-code">
        <div className="nb-cell-input">
          <span className="nb-cell-badge">In [{cell.execution_count || '*'}]</span>
          <pre><code>{source}</code></pre>
        </div>
        {outputs.length > 0 && (
          <div className="nb-cell-outputs">
            {outputs.map((out, j) => (
              <OutputDisplay key={j} output={out} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Raw or unknown cell type
  return (
    <div className="nb-cell nb-cell-raw">
      <pre><code>{source}</code></pre>
    </div>
  )
}

export default function NotebookViewer({ url, fileName, fallbackLabel }) {
  const [notebook, setNotebook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setError('No URL provided for notebook')
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    setNotebook(null)

    fetch(url, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (cancelled) return
        // Validate it looks like a notebook
        if (!json.cells && !json.worksheets) {
          throw new Error('Not a valid .ipynb file (no cells found)')
        }
        setNotebook(json)
        setLoading(false)
      })
      .catch(e => {
        if (cancelled) return
        setError(e.message || 'Failed to load notebook')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [url])

  if (loading) {
    return <div className="nb-loading">Loading notebook…</div>
  }

  if (error) {
    return (
      <div className="nb-error">
        <div className="nb-error-icon">📓</div>
        <p className="nb-error-msg">{error}</p>
        <p className="nb-error-hint">File: {fallbackLabel || fileName}</p>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="nb-open-btn">
            ↗ Open in new tab
          </a>
        )}
      </div>
    )
  }

  // Handle both modern format (cells array) and legacy format (worksheets)
  const cells = notebook.cells || (notebook.worksheets?.[0]?.cells) || []
  const metadata = notebook.metadata || {}
  const kernel = metadata.kernelspec?.display_name || metadata.language_info?.name || ''

  return (
    <div className="nb-notebook">
      {(kernel || fileName) && (
        <div className="nb-header">
          {kernel && <span className="nb-kernel">{kernel}</span>}
          <span className="nb-cells-count">{cells.length} cells</span>
        </div>
      )}
      <div className="nb-cells">
        {cells.map((cell, i) => (
          <CellView key={i} cell={cell} />
        ))}
      </div>
    </div>
  )
}
