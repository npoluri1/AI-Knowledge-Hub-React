import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getImages, refreshFiles } from '../api'
import DocxViewer from '../components/DocxViewer'
import NotebookViewer from '../components/NotebookViewer'
import RichText from '../components/RichText'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 5
const ZOOM_STEP = 0.25

// ---------------------------------------------------------------------------
// Card-level <img> wrapper with broken-image fallback.
//
// Each card renders its own component, so its `err` state is isolated — a
// missing thumbnail on one card doesn't affect the rest of the grid.
// ---------------------------------------------------------------------------
function ImageCard({ img, sub, onClick }) {
  const [err, setErr] = useState(false)
  return (
    <div className="image-card" onClick={onClick}>
      {err ? (
        <div className="image-card-broken" role="img" aria-label={`${img.name} unavailable`}>
          📁
          <div className="image-card-broken-label">unavailable</div>
        </div>
      ) : (
        <img src={img.url} alt={img.name} loading="lazy" onError={() => setErr(true)} />
      )}
      {sub && <div className="image-card-subfolder" title={`Located in /${sub}/ inside the scan source`}>📁 {sub}/</div>}
      <div className="image-card-label">{img.display_name || img.name}</div>
      <div className="image-card-meta">{img.mtime_display || img.size} · {img.type}</div>
    </div>
  )
}

// Type-specific styling helpers ----------------------------------------------
function getTypeColor(type) {
  const t = (type || '').toUpperCase()
  if (t === 'PDF') return 'linear-gradient(135deg, #f38ba8 0%, #f5c2e7 100%)'
  if (t === 'GIF') return 'linear-gradient(135deg, #a6e3a1 0%, #94e2d5 100%)'
  if (t === 'PNG') return 'linear-gradient(135deg, #89b4fa 0%, #cba6f7 100%)'
  if (t === 'SVG') return 'linear-gradient(135deg, #f9e2af 0%, #fab387 100%)'
  if (t === 'JPG' || t === 'JPEG') return 'linear-gradient(135deg, #74c7ec 0%, #89b4fa 100%)'
  // Office documents
  if (t === 'DOC' || t === 'DOCX') return 'linear-gradient(135deg, #4f8ef7 0%, #89b4fa 100%)' // Word - blue
  if (t === 'XLS' || t === 'XLSX') return 'linear-gradient(135deg, #2faa6a 0%, #a6e3a1 100%)' // Excel - green
  if (t === 'PPT' || t === 'PPTX') return 'linear-gradient(135deg, #f77942 0%, #f9e2af 100%)' // PowerPoint - orange
  if (t === 'ODT') return 'linear-gradient(135deg, #5fafff 0%, #89b4fa 100%)'
  if (t === 'ODS') return 'linear-gradient(135deg, #3fb950 0%, #a6e3a1 100%)'
  if (t === 'ODP') return 'linear-gradient(135deg, #ff7b3f 0%, #f9e2af 100%)'
  if (t === 'RTF') return 'linear-gradient(135deg, #b4befe 0%, #cba6f7 100%)'
  return 'linear-gradient(135deg, #cba6f7 0%, #f5c2e7 100%)'
}

function getFileIcon(type) {
  const t = (type || '').toUpperCase()
  if (t === 'PDF') return '📕'
  if (t === 'GIF') return '🎞️'
  if (t === 'PNG') return '🖼️'
  if (t === 'SVG') return '🎨'
  if (t === 'JPG' || t === 'JPEG') return '🖼️'
  if (t === 'DOC' || t === 'DOCX' || t === 'ODT' || t === 'RTF') return '📝' // Word
  if (t === 'XLS' || t === 'XLSX' || t === 'ODS') return '📊' // Excel
  if (t === 'PPT' || t === 'PPTX' || t === 'ODP') return '📈' // PowerPoint
  if (t === 'HTML' || t === 'HTM') return '🌐'
  if (t === 'IPYNB') return '📓'
  if (t === 'JSON') return '📦'
  if (t === 'CSV') return '📋'
  if (t === 'PY') return '🐍'
  if (t === 'JS' || t === 'JSX') return '⚡'
  if (t === 'MD') return '📘'
  return '📄'
}

function getFileFamily(type) {
  const t = (type || '').toUpperCase()
  if (['DOC', 'DOCX', 'ODT', 'RTF'].includes(t)) return 'Word'
  if (['XLS', 'XLSX', 'ODS'].includes(t)) return 'Excel'
  if (['PPT', 'PPTX', 'ODP'].includes(t)) return 'PowerPoint'
  return 'Document'
}

// Group documents by family (Word / Excel / PowerPoint / Other) for visibility.
function groupDocumentsByFamily(docs) {
  const groups = { Word: [], Excel: [], PowerPoint: [], Other: [] }
  for (const d of docs) {
    const fam = getFileFamily(d.type)
    groups[fam].push(d)
  }
  return groups
}

function sortByMtimeDesc(arr) {
  return [...arr].sort((a, b) => (b.mtime || 0) - (a.mtime || 0))
}

export default function ImagesGallery() {
  const [images, setImages] = useState([])
  const [pdfs, setPdfs] = useState([])
  const [documents, setDocuments] = useState([])
  const [dataFiles, setDataFiles] = useState([])
  const [count, setCount] = useState(0)
  const [pdfCount, setPdfCount] = useState(0)
  const [docCount, setDocCount] = useState(0)
  const [dataCount, setDataCount] = useState(0)
  const [scanPaths, setScanPaths] = useState([])
  const [source, setSource] = useState(null)             // 'backend' | 'manifest'
  const [generatedAt, setGeneratedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastToast, setLastToast] = useState(null)        // { kind: 'ok'|'warn'|'err', text: string }
  const toastTimer = useRef(null)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [tab, setTab] = useState('images')                // 'images' | 'documents' | 'pdfs' | 'data'
  const [zoom, setZoom] = useState(1)
  const [isFs, setIsFs] = useState(false)
  const [modalImgErr, setModalImgErr] = useState(false)   // tracks failed <img> load in the modal viewer
  const [sourceFilter, setSourceFilter] = useState('all') // 'all' | <slug>
  const [perSource, setPerSource] = useState({})          // slug -> { images, pdfs, documents, dataFiles, label, kind }
  const [textContent, setTextContent] = useState(null)    // fetched text/code content for inline viewing
  const [searchQuery, setSearchQuery] = useState('')      // global search across all file types
  const modalRef = useRef(null)

  const showToast = useCallback((kind, text) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setLastToast({ kind, text })
    toastTimer.current = setTimeout(() => setLastToast(null), 5000)
  }, [])

  const loadData = useCallback(async ({ fromButton = false } = {}) => {
    try {
      const data = await getImages()
      setImages(sortByMtimeDesc(data.images || []))
      setPdfs(sortByMtimeDesc(data.pdfs || []))
      setDocuments(sortByMtimeDesc(data.documents || []))
      setDataFiles(sortByMtimeDesc(data.dataFiles || []))
      setCount(data.total || 0)
      setPdfCount(data.pdf_count || 0)
      setDocCount(data.doc_count || 0)
      setDataCount((data.dataFiles || []).length)
      setScanPaths(data.scanPaths || [])
      setPerSource(data.perSource || {})
      setSource(data.source || null)
      setGeneratedAt(data.generatedAt || null)
      setLoading(false)
      if (fromButton) {
        showToast('ok', `Synced ${(data.totals?.total ?? (data.images.length + data.pdfs.length + data.documents.length))} files from ${data.source === 'backend' ? 'backend scan' : 'embedded manifest'}.`)
      }
    } catch (e) {
      setLoading(false)
      if (fromButton) showToast('err', 'Failed to load file list.')
    }
  }, [showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFetchFiles = useCallback(async () => {
    setRefreshing(true)
    // Close any open modal first: after the items arrays are replaced, the old
    // selectedIdx may point at a different file (or out of range), which would
    // surface as a "modal showing the wrong file" race on slow browsers.
    setSelectedIdx(null)
    try {
      const result = await refreshFiles()
      const d = result?.data || {}
      setImages(sortByMtimeDesc(d.images || []))
      setPdfs(sortByMtimeDesc(d.pdfs || []))
      setDocuments(sortByMtimeDesc(d.documents || []))
      setDataFiles(sortByMtimeDesc(d.dataFiles || []))
      setScanPaths(d.scanPaths || [])
      setPerSource(d.perSource || {})
      const imagesCount = (d.images || []).length
      const pdfsCount = (d.pdfs || []).length
      const docsCount = (d.documents || []).length
      const dataFilesCount = (d.dataFiles || []).length
      setCount(imagesCount)
      setPdfCount(pdfsCount)
      setDocCount(docsCount)
      setDataCount(dataFilesCount)
      setSource(result.source)
      setGeneratedAt(d.generatedAt || result.fetchedAt)
      const total = imagesCount + pdfsCount + docsCount + dataFilesCount
      if (result.source === 'backend') {
        if (result.persisted?.ok) {
          showToast('ok', `Refreshed: ${total} files found and manifest updated.`)
        } else {
          showToast('warn', `Refreshed: ${total} files found. Manifest write skipped${result.persisted?.error ? ` (${result.persisted.error})` : ''}.`)
        }
      } else {
        showToast('warn', 'Backend offline. Showing cached manifest files.')
      }
    } catch (e) {
      showToast('err', 'Refresh failed - see console.')
      // eslint-disable-next-line no-console
      console.error('refreshFiles failed', e)
    } finally {
      setRefreshing(false)
    }
  }, [showToast])

  const items = tab === 'images' ? images : tab === 'documents' ? documents : tab === 'data' ? dataFiles : pdfs
  const filteredItems = items.filter(f => {
    // Source filter
    if (sourceFilter !== 'all') {
      const folder = f.folder || (f.source_label === 'images' ? 'images' : (f.source_label === 'data' ? 'data' : ''))
      if (folder !== sourceFilter) return false
    }
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const name = (f.name || '').toLowerCase()
      const displayName = (f.display_name || '').toLowerCase()
      const type = (f.type || '').toLowerCase()
      const ext = (f.ext || '').toLowerCase()
      return name.includes(q) || displayName.includes(q) || type.includes(q) || ext.includes(q)
    }
    return true
  })

  // Cache the immediate parent folder for items that came from a subfolder.
  // Used by the small `📁 /subfolder/` pill on cards so users can see WHERE
  // a file lives within an extra scan source (e.g. AI_stuff_docs/foo.docx vs foo.docx).
  // Plain function (no WeakMap): relativeParent is just `name.lastIndexOf('/')`,
  // a single string scan per render — cheaper than maintaining a per-file memo.
  function relativeParent(file) {
    if (!file || !file.name) return ''
    const rel = file.name
    const lastSlash = rel.lastIndexOf('/')
    return lastSlash >= 0 ? rel.slice(0, lastSlash) : ''
  }
  const currentItem = selectedIdx !== null ? filteredItems[selectedIdx] : null

  // Fetch text content for code/text files when modal opens
  useEffect(() => {
    setTextContent(null)
    if (selectedIdx === null || !currentItem) return
    const name = (currentItem.name || '').toLowerCase()
    const isText = name.endsWith('.py') || name.endsWith('.js') || name.endsWith('.jsx') ||
                   name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.txt') ||
                   name.endsWith('.md') || name.endsWith('.css') || name.endsWith('.html') ||
                   name.endsWith('.json') || name.endsWith('.xml') || name.endsWith('.yaml') ||
                   name.endsWith('.yml') || name.endsWith('.sh') || name.endsWith('.bat') ||
                   name.endsWith('.csv') || name.endsWith('.log') || name.endsWith('.cfg') ||
                   name.endsWith('.ini') || name.endsWith('.env') || name.endsWith('.toml') ||
                   name.endsWith('.ipynb')
    if (!isText || !currentItem.url) return
    fetch(currentItem.url)
      .then(r => r.ok ? r.text() : null)
      .then(text => { if (text) setTextContent(text) })
      .catch(() => {})
  }, [selectedIdx, currentItem])

  const goPrev = useCallback(() => {
    setSelectedIdx(prev => (prev !== null && prev > 0) ? prev - 1 : prev)
  }, [])

  const goNext = useCallback(() => {
    setSelectedIdx(prev => (prev !== null && prev < filteredItems.length - 1) ? prev + 1 : prev)
  }, [filteredItems.length])

  const zoomIn = useCallback(() => setZoom(z => Math.min(+(z + ZOOM_STEP).toFixed(2), MAX_ZOOM)), [])
  const zoomOut = useCallback(() => setZoom(z => Math.max(+(z - ZOOM_STEP).toFixed(2), MIN_ZOOM)), [])
  const zoomReset = useCallback(() => setZoom(1), [])

  const toggleFullscreen = useCallback(() => {
    const el = modalRef.current
    if (!el) return
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
    if (!document.fullscreenElement) {
      if (req) req.call(el)
    } else {
      if (exit) exit.call(document)
    }
  }, [])

  // Reset zoom & exit fullscreen when changing items or closing
  useEffect(() => {
    if (selectedIdx === null) {
      setZoom(1)
      setModalImgErr(false)   // also clear broken-image state when modal closes
      if (document.fullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
        if (exit) exit.call(document)
      }
    } else {
      setZoom(1)
      setModalImgErr(false)   // clear when navigating to a new asset so the next try gets a fresh slate
    }
  }, [selectedIdx])

  // Track fullscreen state (handles Esc / F11 / browser-exit)
  useEffect(() => {
    const onFsChange = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    document.addEventListener('mozfullscreenchange', onFsChange)
    document.addEventListener('MSFullscreenChange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
      document.removeEventListener('mozfullscreenchange', onFsChange)
      document.removeEventListener('MSFullscreenChange', onFsChange)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (selectedIdx === null) return
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      else if (e.key === 'Escape') setSelectedIdx(null)
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn() }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomOut() }
      else if (e.key === '0') { e.preventDefault(); zoomReset() }
      else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedIdx, goPrev, goNext, zoomIn, zoomOut, zoomReset, toggleFullscreen])

  const countsByExt = documents.reduce((acc, d) => {
    const k = (d.type || '').toUpperCase()
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
  const docFamiliesList = Object.entries(countsByExt).sort((a, b) => b[1] - a[1])

  const hasPrev = selectedIdx !== null && selectedIdx > 0
  const hasNext = selectedIdx !== null && selectedIdx < items.length - 1

  if (loading) return <div className="loading">Loading images…</div>

  return (
    <div className="images-gallery">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h2 className="chapter-title">🖼️ Reference Images & Documents Gallery</h2>
      <p className="chapter-preview">
        <strong>{count} images</strong> · {pdfCount} PDFs · <strong>{docCount} office documents</strong> · {dataCount} data files.
        {searchQuery ? (
          <> Showing <strong>{filteredItems.length}</strong> results for "<em>{searchQuery}</em>"</>
        ) : (
          <> Click any item to view full size. Use <kbd>←</kbd> <kbd>→</kbd> keys to browse. Sorted newest first.</>
        )}
      </p>

      {/* Toolbar: tabs + search + fetch-files button + status */}
      <div className="gallery-toolbar-row">
        <div className="gallery-tabs">
          <button className={`gallery-tab ${tab === 'images' ? 'active' : ''}`} onClick={() => { setTab('images'); setSelectedIdx(null); setSearchQuery('') }}>
            🖼️ Images ({count})
          </button>
          <button className={`gallery-tab ${tab === 'documents' ? 'active' : ''}`} onClick={() => { setTab('documents'); setSelectedIdx(null); setSearchQuery('') }}>
            📋 Documents ({docCount})
          </button>
          <button className={`gallery-tab ${tab === 'pdfs' ? 'active' : ''}`} onClick={() => { setTab('pdfs'); setSelectedIdx(null); setSearchQuery('') }}>
            📕 PDFs ({pdfCount})
          </button>
          <button className={`gallery-tab ${tab === 'data' ? 'active' : ''}`} onClick={() => { setTab('data'); setSelectedIdx(null); setSearchQuery('') }}>
            📂 Data ({dataCount})
          </button>
        </div>
        <div className="gallery-search-box">
          <span className="gallery-search-icon">🔍</span>
          <input
            type="text"
            className="gallery-search-input"
            placeholder={`Search ${tab}… (name, type, extension)`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') setSearchQuery('') }}
          />
          {searchQuery && (
            <button className="gallery-search-clear" onClick={() => setSearchQuery('')} title="Clear search">✕</button>
          )}
        </div>
        <button
          className={`gallery-fetch-btn ${refreshing ? 'is-loading' : ''}`}
          onClick={handleFetchFiles}
          disabled={refreshing}
          title="Re-scan the configured folders for images, PDFs, and Office documents"
          aria-label="Fetch all files"
        >
          {refreshing ? (
            <>
              <span className="gallery-fetch-spinner" aria-hidden="true" /> Fetching…
            </>
          ) : (
            <>🔄 Fetch Files</>
          )}
        </button>
      </div>

      {/* Status line: where the data came from + scan paths */}
      <div className="gallery-status">
        {source && (
          <span className={`gallery-source-badge source-${source}`}>
            {source === 'backend' ? '🟢 Live backend scan' : '🟡 Embedded manifest'}
          </span>
        )}
        {generatedAt && (
          <span className="gallery-generated">Last sync: {new Date(generatedAt).toLocaleString()}</span>
        )}
        {scanPaths.length > 0 && (
          <span className="gallery-paths">
            Paths: {scanPaths
              .map(p => {
                // scanPaths can be either a string (legacy manifest) OR an object
                // `{slug, dir, kind, label}` (new manifest). Normalize both shapes.
                let raw
                if (typeof p === 'string') {
                  raw = p
                } else if (p && typeof p === 'object') {
                  raw = p.dir || p.label || p.slug || ''
                } else {
                  raw = ''
                }
                if (!raw) return null
                const parts = raw.replace(/\\/g, '/').split('/').filter(Boolean)
                return parts.slice(-2).join('/') || raw
              })
              .filter(Boolean)
              .join(' · ')}
          </span>
        )}
      </div>

      {/* Toast for refresh results */}
      {lastToast && (
        <div className={`gallery-toast gallery-toast-${lastToast.kind}`}>
          {lastToast.text}
        </div>
      )}

      {/* Source filters: pill chips for each scanned folder. */}
      {Object.keys(perSource || {}).length > 0 && (
        <div className="gallery-source-chips" role="tablist" aria-label="Filter by source folder">
          <span className="gallery-source-chips-label">📁 Sources:</span>
          <button
            type="button"
            role="tab"
            aria-selected={sourceFilter === 'all'}
            className={`gallery-source-chip ${sourceFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setSourceFilter('all')}
          >
            🌐 All ({count + pdfCount + docCount + dataCount})
          </button>
          {Object.entries(perSource).map(([slug, info]) => {
            const total = (info.images || 0) + (info.pdfs || 0) + (info.documents || 0) + (info.dataFiles || 0)
            const kindIcon = info.kind === 'extra' ? '🔗' : '🗂️'
            return (
              <button
                key={slug}
                type="button"
                role="tab"
                aria-selected={sourceFilter === slug}
                className={`gallery-source-chip ${sourceFilter === slug ? 'is-active' : ''} kind-${info.kind || 'public'}`}
                onClick={() => setSourceFilter(slug)}
                title={`${info.label} — ${total} files`}
              >
                {kindIcon} {info.label} · {total}
              </button>
            )
          })}
        </div>
      )}

      {/* Fullscreen Modal with Navigation */}
      {selectedIdx !== null && currentItem && (
        <div
          ref={modalRef}
          className={`image-modal ${isFs ? 'image-modal-fullscreen' : ''}`}
          onClick={() => setSelectedIdx(null)}
        >
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setSelectedIdx(null)} title="Close (Esc)">✕</button>

            <button
              className={`gallery-nav-btn gallery-nav-prev ${hasPrev ? '' : 'disabled'}`}
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              disabled={!hasPrev}
            >
              ‹
            </button>

            <div className="gallery-nav-content">
              <div className="gallery-toolbar" role="toolbar" aria-label="Viewer toolbar">
                {tab === 'images' && (
                  <>
                    <button
                      className="gallery-tool-btn"
                      onClick={(e) => { e.stopPropagation(); zoomOut() }}
                      disabled={zoom <= MIN_ZOOM}
                      title="Zoom out (−)"
                      aria-label="Zoom out"
                    >−</button>
                    <span className="gallery-zoom-level" aria-live="polite" title="Current zoom">{Math.round(zoom * 100)}%</span>
                    <button
                      className="gallery-tool-btn"
                      onClick={(e) => { e.stopPropagation(); zoomIn() }}
                      disabled={zoom >= MAX_ZOOM}
                      title="Zoom in (+)"
                      aria-label="Zoom in"
                    >+</button>
                    <button
                      className="gallery-tool-btn"
                      onClick={(e) => { e.stopPropagation(); zoomReset() }}
                      disabled={zoom === 1}
                      title="Reset zoom (0)"
                      aria-label="Reset zoom"
                    >⌂</button>
                    <span className="gallery-tool-divider" aria-hidden="true"></span>
                  </>
                )}
                <button
                  className="gallery-tool-btn gallery-tool-btn-fs"
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen() }}
                  title={isFs ? 'Exit fullscreen (F or Esc)' : 'Maximize (F)'}
                  aria-label={isFs ? 'Exit fullscreen' : 'Maximize'}
                >{isFs ? '⤢' : '⛶'}</button>
                <span className="gallery-zoom-hint" aria-hidden="true">
                  {tab === 'images' && '+ / − zoom · scroll to pan when zoomed'}
                  {tab === 'documents' && ((currentItem?.name || '').toLowerCase().endsWith('.py') || (currentItem?.name || '').toLowerCase().endsWith('.js') || (currentItem?.name || '').toLowerCase().endsWith('.txt') || (currentItem?.name || '').toLowerCase().endsWith('.md') ? 'Code/text rendered inline with syntax formatting' : (currentItem?.name || '').toLowerCase().endsWith('.ipynb') ? 'Jupyter notebook rendered in-app' : 'Office documents open in a new tab for full layout fidelity')}
                  {tab === 'pdfs' && 'Use the PDF viewer toolbar to zoom'}
                  {tab === 'data' && ((currentItem?.name || '').toLowerCase().endsWith('.html') ? 'HTML rendered in sandboxed iframe' : (currentItem?.name || '').toLowerCase().endsWith('.ipynb') ? 'Jupyter notebook rendered in-app' : 'Open in new tab for full rendering')}
                </span>
              </div>

              <div className="gallery-zoom-viewport">
                {tab === 'images' ? (
                  modalImgErr ? (
                    // The <img> failed to load (404 or proxy unreachable) — show
                    // a clear fallback so the user isn't staring at a blank box.
                    <div className="fv-image-broken" role="img" aria-label={`${currentItem.name} unavailable`}>
                      📁
                      <div className="fv-image-broken-label">Image unavailable — open in new tab to view</div>
                      {currentItem.url && (
                        <a
                          href={currentItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-modal-open"
                          onClick={e => e.stopPropagation()}
                        >
                          ↗ Open
                        </a>
                      )}
                    </div>
                  ) : currentItem.url ? (
                    <img
                      src={currentItem.url}
                      alt={currentItem.name}
                      className="image-modal-img"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                      draggable={false}
                      onError={() => setModalImgErr(true)}
                    />
                  ) : (
                    <div className="doc-modal-placeholder">
                      <div className="doc-modal-icon" style={{ background: getTypeColor(currentItem.type) }}>{getFileIcon(currentItem.type)}</div>
                      <div className="doc-modal-name">{currentItem.name}</div>
                      <div className="doc-modal-meta">{currentItem.size} · {currentItem.type}</div>
                    </div>
                  )
                ) : tab === 'documents' ? (
                  // For .docx we render the actual content via DocxViewer (mammoth).
                  // For .py/.js/.txt/.md etc we fetch and render inline with RichText.
                  // For .ipynb we render via NotebookViewer.
                  (currentItem.name || '').toLowerCase().endsWith('.docx') && currentItem.url ? (
                    <DocxViewer
                      url={currentItem.url}
                      fileName={currentItem.name}
                      fallbackLabel={currentItem.display_name || currentItem.name}
                    />
                  ) : (currentItem.name || '').toLowerCase().endsWith('.ipynb') && currentItem.url ? (
                    <NotebookViewer
                      url={currentItem.url}
                      fileName={currentItem.name}
                      fallbackLabel={currentItem.display_name || currentItem.name}
                    />
                  ) : textContent ? (
                    <div className="fv-rich-text-wrapper">
                      <RichText content={textContent} />
                    </div>
                  ) : currentItem.url && (
                    <div className="doc-modal-placeholder">
                      <div className="doc-modal-icon" style={{ background: getTypeColor(currentItem.type) }}>{getFileIcon(currentItem.type)}</div>
                      <h3 className="doc-modal-name">{currentItem.name}</h3>
                      <div className="doc-modal-meta">{currentItem.size} · {currentItem.type} · {getFileFamily(currentItem.type)}</div>
                      <p className="doc-modal-hint">
                        {getFileFamily(currentItem.type)} files render best in their native application.
                        Click <strong>Open File</strong> to download or open it in a new tab.
                      </p>
                      {currentItem.url && (
                        <a
                          className="doc-modal-open"
                          href={currentItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                        >
                          📥 Open File
                        </a>
                      )}
                    </div>
                  )
                ) : tab === 'data' ? (
                  // Data files: render inline based on type
                  (currentItem.name || '').toLowerCase().endsWith('.html') && currentItem.url ? (
                    <div className="fv-html-content">
                      <iframe
                        src={currentItem.url}
                        title={currentItem.name}
                        className="fv-iframe"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  ) : (currentItem.name || '').toLowerCase().endsWith('.ipynb') && currentItem.url ? (
                    <NotebookViewer
                      url={currentItem.url}
                      fileName={currentItem.name}
                      fallbackLabel={currentItem.display_name || currentItem.name}
                    />
                  ) : textContent ? (
                    <div className="fv-rich-text-wrapper">
                      <RichText content={textContent} />
                    </div>
                  ) : currentItem.url && (
                    <div className="doc-modal-placeholder">
                      <div className="doc-modal-icon" style={{ background: getTypeColor(currentItem.type) }}>{getFileIcon(currentItem.type)}</div>
                      <h3 className="doc-modal-name">{currentItem.name}</h3>
                      <div className="doc-modal-meta">{currentItem.size} · {currentItem.type}</div>
                      <p className="doc-modal-hint">
                        Loading content… or click <strong>Open File</strong> to download.
                      </p>
                      {currentItem.url && (
                        <a
                          className="doc-modal-open"
                          href={currentItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                        >
                          📥 Open File
                        </a>
                      )}
                    </div>
                  )
                ) : currentItem.url ? (
                  <embed src={currentItem.url} type="application/pdf" className="image-modal-pdf" />
                ) : (
                  <div className="doc-modal-placeholder">
                    <div className="doc-modal-icon" style={{ background: getTypeColor(currentItem.type) }}>{getFileIcon(currentItem.type)}</div>
                    <div className="doc-modal-name">{currentItem.name}</div>
                    <div className="doc-modal-meta">{currentItem.size} · {currentItem.type}</div>
                  </div>
                )}
              </div>

              <div className="image-modal-name">
                {(() => {
                  const sub = relativeParent(currentItem)
                  if (!sub) return null
                  return <span className="image-modal-subfolder">📁 {sub}/</span>
                })()}
                <span className="image-modal-displayname">{currentItem.display_name || currentItem.name}</span>
                <span className="image-modal-meta">{currentItem.mtime_display ? `${currentItem.mtime_display} · ` : ''}{currentItem.size} · {currentItem.type}</span>
                <span className="image-modal-counter">{selectedIdx + 1} / {filteredItems.length}</span>
              </div>
            </div>

            <button
              className={`gallery-nav-btn gallery-nav-next ${hasNext ? '' : 'disabled'}`}
              onClick={(e) => { e.stopPropagation(); goNext() }}
              disabled={!hasNext}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {tab === 'images' && (
        <div className="images-grid">
          {filteredItems.map((img, i) => (
            // Use `folder + '/' + name` as the React key so each ImageCard's
            // useState(broken) is bound to the *actual* file, not the array
            // index. Otherwise a source-filter change keeps key=0 mapped to a
            // different file but the previous broken-state leaks across.
            <ImageCard
              key={`${img.folder || ''}/${img.name}`}
              img={img}
              sub={relativeParent(img)}
              onClick={() => setSelectedIdx(i)}
            />
          ))}
          {filteredItems.length === 0 && <p className="empty-state">No images available. Drop image files into <code>frontend/public/images/</code> or add a folder to <code>EXTRA_SCAN_PATHS</code>, then click <strong>🔄 Fetch Files</strong>.</p>}
        </div>
      )}

      {/* Documents Grid (Office docs - Word / Excel / PPT) */}
      {tab === 'documents' && (
        <>
          {docFamiliesList.length > 0 && (
            <div className="doc-families-chips">
              <span className="doc-families-label">📦 Types:</span>
              {docFamiliesList.map(([type, n]) => (
                <span key={type} className="doc-family-chip" style={{ background: getTypeColor(type) }}>
                  {getFileIcon(type)} {type} · {n}
                </span>
              ))}
            </div>
          )}
          <div className="docs-grid">
            {filteredItems.map((doc, i) => {
              const sub = relativeParent(doc)
              return (
                <div
                  key={i}
                  className="doc-card"
                  onClick={() => setSelectedIdx(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="doc-thumbnail" style={{ background: getTypeColor(doc.type) }}>
                    <span className="doc-thumbnail-icon">{getFileIcon(doc.type)}</span>
                    <span className="doc-thumbnail-ext">{doc.ext?.replace('.', '') || doc.type}</span>
                  </div>
                  {sub && <div className="doc-subfolder" title={`Located in /${sub}/ inside the scan source`}>📁 {sub}/</div>}
                  <div className="doc-info">
                    <div className="doc-name">{doc.display_name || doc.name}</div>
                    <div className="doc-meta">{doc.mtime_display || doc.size} · {doc.type} · {getFileFamily(doc.type)}</div>
                  </div>
                  <div className="doc-hint">Click to view · Open in new tab to render in Office</div>
                </div>
              )
            })}
            {filteredItems.length === 0 && (
              <p className="empty-state">
                No office documents found. Drop <code>.docx</code> / <code>.xlsx</code> / <code>.pptx</code> files
                into <code>frontend/public/images/</code> or <code>frontend/public/data/</code> then click <strong>🔄 Fetch Files</strong>.
              </p>
            )}
          </div>
        </>
      )}

      {/* PDF Grid */}
      {tab === 'pdfs' && (
        <div className="pdfs-grid">
          {filteredItems.map((pdf, i) => {
            const sub = relativeParent(pdf)
            return (
              <div key={i} className="pdf-card" onClick={() => setSelectedIdx(i)} style={{ cursor: 'pointer' }}>
                <div className="pdf-thumbnail" style={{ background: getTypeColor(pdf.type) }}>
                  <span className="pdf-thumbnail-icon">{getFileIcon(pdf.type)}</span>
                  <span className="pdf-thumbnail-ext">{pdf.ext?.replace('.', '') || 'PDF'}</span>
                </div>
                {sub && <div className="pdf-subfolder" title={`Located in /${sub}/ inside the scan source`}>📁 {sub}/</div>}
                <div className="pdf-info">
                  <div className="pdf-name">{pdf.display_name || pdf.name}</div>
                  <div className="pdf-meta">{pdf.mtime_display || pdf.size} · {pdf.type}</div>
                </div>
                <div className="pdf-hint">Click to view</div>
              </div>
            )
          })}
          {filteredItems.length === 0 && <p className="empty-state">No PDFs available. Drop PDF files into <code>frontend/public/images/</code> and click <strong>🔄 Fetch Files</strong>.</p>}
        </div>
      )}

      {/* Data Files Grid (HTML, ipynb, JSON, CSV, etc.) */}
      {tab === 'data' && (
        <>
          {(() => {
            const htmlCount = filteredItems.filter(f => (f.type || '').toUpperCase() === 'HTML' || (f.type || '').toUpperCase() === 'HTM').length
            const ipynbCount = filteredItems.filter(f => (f.type || '').toUpperCase() === 'IPYNB').length
            const otherCount = filteredItems.length - htmlCount - ipynbCount
            const chips = []
            if (htmlCount > 0) chips.push({ label: '🌐 HTML', count: htmlCount, color: '#fab387' })
            if (ipynbCount > 0) chips.push({ label: '📓 Notebooks', count: ipynbCount, color: '#89b4fa' })
            if (otherCount > 0) chips.push({ label: '📄 Other', count: otherCount, color: '#cba6f7' })
            if (chips.length === 0) return null
            return (
              <div className="doc-families-chips">
                <span className="doc-families-label">📦 Types:</span>
                {chips.map(c => (
                  <span key={c.label} className="doc-family-chip" style={{ background: c.color }}>
                    {c.label} · {c.count}
                  </span>
                ))}
              </div>
            )
          })()}
          <div className="docs-grid">
            {filteredItems.map((file, i) => {
              const sub = relativeParent(file)
              const ext = (file.type || '').toUpperCase()
              const isHtml = ext === 'HTML' || ext === 'HTM'
              const isNotebook = ext === 'IPYNB'
              return (
                <div
                  key={i}
                  className={`doc-card ${isNotebook ? 'doc-card-notebook' : isHtml ? 'doc-card-html' : ''}`}
                  onClick={() => setSelectedIdx(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="doc-thumbnail" style={{ background: getTypeColor(file.type) }}>
                    <span className="doc-thumbnail-icon">{getFileIcon(file.type)}</span>
                    <span className="doc-thumbnail-ext">{ext || file.type}</span>
                  </div>
                  {sub && <div className="doc-subfolder" title={`Located in /${sub}/ inside the scan source`}>📁 {sub}/</div>}
                  <div className="doc-info">
                    <div className="doc-name">{file.display_name || file.name}</div>
                    <div className="doc-meta">{file.mtime_display || file.size} · {ext || file.type}</div>
                  </div>
                  <div className="doc-hint">
                    {isNotebook ? 'Click to render notebook' : isHtml ? 'Click to preview HTML' : 'Click to view · Open in new tab'}
                  </div>
                </div>
              )
            })}
            {filteredItems.length === 0 && (
              <p className="empty-state">
                No data files found. Drop <code>.html</code> / <code>.ipynb</code> / <code>.json</code> / <code>.csv</code> files
                into <code>frontend/public/data/</code> or <code>EXTRA_SCAN_PATHS</code>, then click <strong>🔄 Fetch Files</strong>.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
