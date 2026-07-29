import React, { useState, useEffect, useCallback } from 'react'
import RichText from './RichText'
import DocxViewer from './DocxViewer'
import NotebookViewer from './NotebookViewer'

// File viewer modal with left/right navigation.
//
// Renders different content types:
//   - .txt / .md / .py / .js / .jsx  → RichText formatted preview
//   - .html                          → sandboxed iframe
//   - .png / .jpg / .jpeg / .gif / .svg → <img> with broken-image fallback
//   - .pdf                           → <embed>
//   - .docx / .doc                   → DocxViewer (mammoth.js) — full content in-app
//
// Any other extension shows an info placeholder with a Download / Open link.
export default function FileViewer({ files, currentIndex, onClose, getFileUrl, categoryTitle }) {
  const [idx, setIdx] = useState(currentIndex)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const currentFile = files[idx]

  // Navigate left/right
  const goPrev = useCallback(() => {
    if (idx > 0) setIdx(idx - 1)
  }, [idx])

  const goNext = useCallback(() => {
    if (idx < files.length - 1) setIdx(idx + 1)
  }, [idx, files.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext, onClose])

  // Reset image-error state when switching files
  useEffect(() => {
    setImgErr(false)
  }, [idx])

  // Load file content
  useEffect(() => {
    if (!currentFile) return
    setContent(null)
    setLoading(true)
    setZoom(false)

    const name = (currentFile.name || '').toLowerCase()
    const isText = name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.py') ||
                   name.endsWith('.js') || name.endsWith('.jsx') || name.endsWith('.ts') ||
                   name.endsWith('.tsx') || name.endsWith('.css') || name.endsWith('.json') ||
                   name.endsWith('.xml') || name.endsWith('.yaml') || name.endsWith('.yml') ||
                   name.endsWith('.sh') || name.endsWith('.bat') || name.endsWith('.csv') ||
                   name.endsWith('.log') || name.endsWith('.cfg') || name.endsWith('.ini') ||
                   name.endsWith('.env') || name.endsWith('.toml')
    const isHtml = name.endsWith('.html') || name.endsWith('.htm')
    const isImage = name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.svg')
    const isPdf = name.endsWith('.pdf')
    const isDocx = name.endsWith('.docx') || name.endsWith('.doc')
    const isNotebook = name.endsWith('.ipynb')

    if (isText || isHtml) {
      // Try to fetch file content from the data directory
      const url = getFileUrl ? getFileUrl(currentFile) : null
      if (url) {
        fetch(url)
          .then(res => res.ok ? res.text() : null)
          .then(text => {
            setContent({ type: isHtml ? 'html' : 'text', data: text || `// Content preview not available for ${currentFile.name}` })
            setLoading(false)
          })
          .catch(() => {
            setContent({ type: 'text', data: `// Click to open the source file: ${currentFile.name}` })
            setLoading(false)
          })
      } else {
        setContent({ type: 'text', data: `// File: ${currentFile.name}\n// Summary: ${currentFile.summary || 'N/A'}\n// Type: ${currentFile.type || 'N/A'}\n// Size: ${currentFile.size || 'N/A'}` })
        setLoading(false)
      }
    } else if (isImage) {
      setContent({ type: 'image' })
      setLoading(false)
    } else if (isPdf) {
      setContent({ type: 'pdf' })
      setLoading(false)
    } else if (isDocx) {
      // DocxViewer fetches the file itself; we just mark the type.
      setContent({ type: 'docx' })
      setLoading(false)
    } else if (isNotebook) {
      setContent({ type: 'notebook' })
      setLoading(false)
    } else {
      setContent({ type: 'info' })
      setLoading(false)
    }
  }, [currentFile, getFileUrl])

  if (!currentFile) return null

  const hasPrev = idx > 0
  const hasNext = idx < files.length - 1

  const fileUrl = currentFile?.url || (getFileUrl ? getFileUrl(currentFile) : null)

  return (
    <div className="file-viewer-overlay" onClick={onClose}>
      <div className="file-viewer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="fv-header">
          <div className="fv-header-info">
            <span className="fv-file-icon">{getFileIcon(currentFile.name)}</span>
            <div>
              <h3 className="fv-file-name">{currentFile.name}</h3>
              <span className="fv-file-meta">
                {categoryTitle} · {currentFile.type || 'File'} · {currentFile.size || '—'}
                · {idx + 1} / {files.length}
              </span>
            </div>
          </div>
          <div className="fv-header-actions">
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="fv-open-btn" onClick={e => e.stopPropagation()} download={currentFile.display_name || currentFile.name}>
                ↗ Open
              </a>
            )}
            <button className="fv-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Navigation + Content */}
        <div className="fv-body">
          {/* Left Arrow */}
          <button
            className={`fv-nav-btn fv-nav-prev ${hasPrev ? '' : 'disabled'}`}
            onClick={goPrev}
            disabled={!hasPrev}
            title="Previous (←)"
          >
            ‹
          </button>

          {/* Content */}
          <div className="fv-content">
            {loading && <div className="fv-loading">Loading…</div>}

            {/* Summary info */}
            <div className="fv-summary">
              {currentFile.summary && <p className="fv-summary-text">{currentFile.summary}</p>}
            </div>

            {/* Text content */}
            {content?.type === 'text' && (
              <div className="fv-rich-text-wrapper">
                <RichText content={content.data} />
              </div>
            )}

            {/* HTML content */}
            {content?.type === 'html' && (
              <div className="fv-html-content">
                <iframe
                  srcDoc={content.data}
                  title={currentFile.name}
                  className="fv-iframe"
                  sandbox="allow-same-origin"
                />
              </div>
            )}

            {/* Image content (with broken fallback) */}
            {content?.type === 'image' && fileUrl && !imgErr && (
              <div className={`fv-image-container ${zoom ? 'zoomed' : ''}`} onClick={() => setZoom(!zoom)}>
                <img
                  src={fileUrl}
                  alt={currentFile.name}
                  className="fv-image"
                  onError={() => setImgErr(true)}
                />
                <div className="fv-image-hint">{zoom ? 'Click to zoom out' : 'Click to zoom'}</div>
              </div>
            )}
            {content?.type === 'image' && (imgErr || !fileUrl) && (
              <div className="fv-placeholder">
                <div className="fv-placeholder-icon">📁</div>
                <p className="fv-placeholder-text">{imgErr ? 'Image unavailable' : `Image file: ${currentFile.name}`}</p>
                <p className="fv-placeholder-hint">
                  {imgErr
                    ? 'The image URL returned an error. Open in a new tab to load directly.'
                    : `Available at: D:\\WorkSpace\\Claude_Code\\AI_Stuff_Data\\${currentFile.name}`}
                </p>
                {fileUrl && (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="fv-download-btn" onClick={e => e.stopPropagation()}>
                    📥 Download / Open
                  </a>
                )}
              </div>
            )}

            {/* DOCX content — render in-app via mammoth */}
            {content?.type === 'docx' && fileUrl && (
              <DocxViewer
                url={fileUrl}
                fileName={currentFile.name}
                fallbackLabel={currentFile.display_name || currentFile.name}
              />
            )}
            {content?.type === 'docx' && !fileUrl && (
              <div className="fv-placeholder">
                <div className="fv-placeholder-icon">📝</div>
                <p className="fv-placeholder-text">DOCX: {currentFile.name}</p>
                <p className="fv-placeholder-hint">{currentFile.summary || 'No URL available for this file.'}</p>
              </div>
            )}

            {/* Notebook (.ipynb) content */}
            {content?.type === 'notebook' && fileUrl && (
              <NotebookViewer
                url={fileUrl}
                fileName={currentFile.name}
                fallbackLabel={currentFile.display_name || currentFile.name}
              />
            )}
            {content?.type === 'notebook' && !fileUrl && (
              <div className="fv-placeholder">
                <div className="fv-placeholder-icon">📓</div>
                <p className="fv-placeholder-text">Notebook: {currentFile.name}</p>
                <p className="fv-placeholder-hint">{currentFile.summary || 'No URL available for this file.'}</p>
              </div>
            )}

            {/* PDF */}
            {content?.type === 'pdf' && fileUrl && (
              <div className="fv-pdf-container">
                <embed src={fileUrl} type="application/pdf" className="fv-pdf" />
              </div>
            )}
            {content?.type === 'pdf' && !fileUrl && (
              <div className="fv-placeholder">
                <div className="fv-placeholder-icon">📄</div>
                <p className="fv-placeholder-text">PDF: {currentFile.name}</p>
                <p className="fv-placeholder-hint">{currentFile.summary || 'Click Open to view full document'}</p>
              </div>
            )}

            {/* Info / other files */}
            {content?.type === 'info' && (
              <div className="fv-placeholder">
                <div className="fv-placeholder-icon">{getFileIcon(currentFile.name)}</div>
                <p className="fv-placeholder-text">{currentFile.name}</p>
                <p className="fv-placeholder-hint">{currentFile.summary || currentFile.type || 'File'}</p>
                {fileUrl && (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="fv-download-btn">
                    📥 Download / Open
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Arrow */}
          <button
            className={`fv-nav-btn fv-nav-next ${hasNext ? '' : 'disabled'}`}
            onClick={goNext}
            disabled={!hasNext}
            title="Next (→)"
          >
            ›
          </button>
        </div>

        {/* Footer with file list */}
        <div className="fv-footer">
          <div className="fv-file-tabs">
            {files.map((f, i) => (
              <button
                key={i}
                className={`fv-file-tab ${i === idx ? 'active' : ''}`}
                onClick={() => setIdx(i)}
                title={f.name}
              >
                {getFileIcon(f.name)} {truncateName(f.name, 18)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getFileIcon(name) {
  if (!name) return '📄'
  const n = name.toLowerCase()
  if (n.endsWith('.txt')) return '📝'
  if (n.endsWith('.md')) return '📘'
  if (n.endsWith('.py')) return '🐍'
  if (n.endsWith('.js') || n.endsWith('.jsx')) return '⚡'
  if (n.endsWith('.html')) return '🌐'
  if (n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.gif') || n.endsWith('.svg')) return '🖼️'
  if (n.endsWith('.pdf')) return '📕'
  if (n.endsWith('.docx') || n.endsWith('.doc')) return '📝'
  if (n.endsWith('.xlsx') || n.endsWith('.xls')) return '📊'
  if (n.endsWith('.json')) return '📦'
  if (n.endsWith('.ipynb')) return '📓'
  return '📄'
}

function truncateName(name, max) {
  if (!name) return ''
  if (name.length <= max) return name
  return name.slice(0, max - 3) + '…'
}
