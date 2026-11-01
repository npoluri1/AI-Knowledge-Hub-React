import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FILE_CATEGORIES, CATEGORY_ICONS, searchFiles } from '../data/appData'
import FileViewer from '../components/FileViewer'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'
import { refreshFileCatalog } from '../api'

// File URL resolver - every manifest file already carries its own url
function getFileUrl(file) {
  return file?.url || null
}

function getFileIcon(name) {
  if (!name) return '📄'
  const n = name.toLowerCase()
  if (n.endsWith('.txt')) return '📝'
  if (n.endsWith('.md')) return '📘'
  if (n.endsWith('.py')) return '🐍'
  if (n.endsWith('.js') || n.endsWith('.jsx') || n.endsWith('.ts') || n.endsWith('.tsx')) return '⚡'
  if (n.endsWith('.html') || n.endsWith('.htm')) return '🌐'
  if (n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.gif') || n.endsWith('.svg') || n.endsWith('.webp')) return '🖼️'
  if (n.endsWith('.pdf')) return '📕'
  if (n.endsWith('.docx') || n.endsWith('.doc')) return '📋'
  if (n.endsWith('.xlsx') || n.endsWith('.xls') || n.endsWith('.csv')) return '📊'
  if (n.endsWith('.json')) return '📦'
  if (n.endsWith('.ipynb')) return '📓'
  return '📄'
}

function getFileColor(name) {
  if (!name) return '#89b4fa'
  const n = name.toLowerCase()
  if (n.endsWith('.txt')) return '#a6e3a1'
  if (n.endsWith('.md')) return '#89b4fa'
  if (n.endsWith('.py') || n.endsWith('.js') || n.endsWith('.jsx') || n.endsWith('.ts')) return '#cba6f7'
  if (n.endsWith('.html')) return '#fab387'
  if (n.endsWith('.ipynb')) return '#89b4fa'
  if (n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.gif') || n.endsWith('.svg') || n.endsWith('.webp')) return '#94e2d5'
  if (n.endsWith('.pdf')) return '#f38ba8'
  if (n.endsWith('.docx') || n.endsWith('.doc')) return '#89b4fa'
  if (n.endsWith('.xlsx') || n.endsWith('.xls') || n.endsWith('.csv')) return '#a6e3a1'
  if (n.endsWith('.json')) return '#f9e2af'
  return '#585b70'
}

function isImageFile(name) {
  return /\.(png|jpg|jpeg|gif|svg|webp|bmp)$/i.test(name || '')
}

function isPdfFile(name) {
  return /\.pdf$/i.test(name || '')
}

function isTextFile(name) {
  return /\.(txt|md|py|js|jsx|ts|html|json|css|csv|ipynb)$/i.test(name || '')
}

function isOfficeFile(name) {
  return /\.(docx|doc|xlsx|xls)$/i.test(name || '')
}

export default function FileReferenceView() {
  const { t } = useLang()
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [expandedCat, setExpandedCat] = useState(null)
  const [viewerState, setViewerState] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim().length < 2) { setSearchResults(null); return }
    setSearchResults(searchFiles(searchQ))
  }

  const openFileViewer = useCallback((files, idx, catTitle) => {
    setViewerState({ files, idx, catTitle })
  }, [])

  const totalFiles = FILE_CATEGORIES.reduce((s, c) => s + c.files.length, 0)

  return (
    <div className="file-reference">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      {/* Header */}
      <div className="ref-header">
        <div className="page-header-row">
          <h2 className="chapter-title">📂 {t('AI Master Reference — All Files by Folder')}</h2>
          <FetchButton onFetch={() => { setSearchQ(''); setSearchResults(null); return refreshFileCatalog('File reference vault') }} label={t('Fetch Latest')} />
        </div>
        <p className="chapter-preview">
          Complete file catalog from <strong>public/data</strong> and <strong>public/images</strong> ·
          {totalFiles}+ files across {FILE_CATEGORIES.length} categories ·
          <strong> Click any file row to view content</strong> ·
          Use <kbd>←</kbd> <kbd>→</kbd> to navigate
        </p>
      </div>

      {/* Search */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="🔍 Search across all files, categories, descriptions…"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <button type="submit">{t('Search')}</button>
        {searchResults && (
          <button type="button" className="clear-btn" onClick={() => { setSearchResults(null); setSearchQ('') }}>✕</button>
        )}
      </form>

      {/* Search Results */}
      {searchResults && (
        <div className="search-results">
          <div className="section-title">🔎 Search Results ({searchResults.length})</div>
          {searchResults.length === 0 && <p className="empty-state">No results found.</p>}
          {searchResults.map((r, i) => (
            <div key={i} className="search-result-item" style={{ cursor: 'pointer' }} onClick={() => {
              const cat = FILE_CATEGORIES.find(c => c.id === r.category)
              if (cat) {
                const idx = cat.files.findIndex(f => f.name === r.file.name)
                if (idx >= 0) { setExpandedCat(cat.id); openFileViewer(cat.files, idx, cat.title) }
              }
            }}>
              <span className="sr-type">{getFileIcon(r.file.name)}</span>
              <div className="sr-info">
                <span className="sr-title">{r.categoryTitle} — {r.file.name}</span>
                <span className="sr-snippet">{r.file.summary || r.file.type || ''}</span>
              </div>
              <span className="sr-score" style={{ background: 'rgba(137,180,250,0.1)', color: 'var(--accent-blue)' }}>Open ›</span>
            </div>
          ))}
        </div>
      )}

      {/* Category Sections */}
      <div className="ref-categories">
        {FILE_CATEGORIES.map((cat) => {
          const isExpanded = expandedCat === cat.id
          return (
            <div key={cat.id} className={`ref-category ${isExpanded ? 'expanded' : ''}`}>
              {/* Category Header */}
              <div className="ref-cat-header" onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                style={{ borderLeft: `4px solid ${cat.color || '#89b4fa'}` }}>
                <span className="ref-cat-icon">{CATEGORY_ICONS[cat.id] || '📁'}</span>
                <div className="ref-cat-info">
                  <h3>{cat.heading}</h3>
                  <span className="ref-cat-summary">{cat.summary.slice(0, 150)}</span>
                </div>
                <span className="ref-cat-count">{cat.files.length} file{cat.files.length !== 1 ? 's' : ''}</span>
                <span className={`ref-cat-chevron ${isExpanded ? 'open' : ''}`}>▼</span>
              </div>

              {/* File Table */}
              {isExpanded && (
                <div className="ref-file-table-wrapper">
                  <table className="ref-file-table">
                    <thead>
                      <tr>
                        <th className="col-num">#</th>
                        <th className="col-thumb">Preview</th>
                        <th className="col-name">Name</th>
                        <th className="col-type">Type</th>
                        <th className="col-folder">Folder</th>
                        <th className="col-size">Size</th>
                        <th className="col-summary">Summary</th>
                        <th className="col-open">Open</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.files.map((f, i) => {
                        const fileUrl = getFileUrl(f)
                        const image = isImageFile(f.name)
                        const pdf = isPdfFile(f.name)
                        const text = isTextFile(f.name)
                        const office = isOfficeFile(f.name)

                        return (
                          <tr key={i} className="ref-file-row" onClick={() => openFileViewer(cat.files, i, cat.title)}>
                            <td className="col-num">{i + 1}</td>
                            <td className="col-thumb">
                              {image ? (
                                <img src={fileUrl} alt={f.name} className="ref-thumb" loading="lazy" />
                              ) : pdf ? (
                                <div className="ref-pdf-thumb" title="PDF document">
                                  <span className="ref-pdf-icon">📕</span>
                                  <span className="ref-pdf-ext">PDF</span>
                                </div>
                              ) : (
                                <span className="ref-file-icon">{getFileIcon(f.name)}</span>
                              )}
                            </td>
                            <td className="col-name">
                              <span className="ref-file-name">{f.name}</span>
                            </td>
                            <td className="col-type">
                              <span className="ref-type-tag" style={{ background: getFileColor(f.name) + '20', color: getFileColor(f.name) }}>
                                {f.type || extFromName(f.name)}
                              </span>
                            </td>
                            <td className="col-folder">
                              <span className="ref-folder-tag">{f.folder || 'data'}</span>
                            </td>
                            <td className="col-size">{f.size || '—'}</td>
                            <td className="col-summary">{f.summary ? f.summary.slice(0, 100) + (f.summary.length > 100 ? '…' : '') : '—'}</td>
                            <td className="col-open">
                              <button className="ref-open-btn" onClick={(e) => { e.stopPropagation(); openFileViewer(cat.files, i, cat.title) }}
                                title={`Open ${f.name}`}>
                                {image ? '🖼️' : pdf ? '📕' : text ? '📝' : office ? '📋' : '>'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div className="ref-footer-hint">
                    <span>Total: {cat.files.length} files</span>
                    <span>Click any row or press Open to view content</span>
                    <span>Use ← → arrow keys to browse</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* File Viewer Modal */}
      {viewerState && (
        <FileViewer
          files={viewerState.files}
          currentIndex={viewerState.idx}
          onClose={() => setViewerState(null)}
          getFileUrl={getFileUrl}
          categoryTitle={viewerState.catTitle}
        />
      )}
    </div>
  )
}

function extFromName(name) {
  if (!name) return 'File'
  const ext = name.split('.').pop()
  return ext ? ext.toUpperCase() : 'File'
}
