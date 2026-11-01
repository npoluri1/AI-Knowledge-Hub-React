import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { parseBlocks, renderBlocks } from '../components/MarkdownView'
import FetchButton from '../components/FetchButton'
import './ProjectsView.css'
import { useLang } from '../i18n'

const ACTIONS = [
  { id: 'build', label: 'Build', icon: '🏗️' },
  { id: 'deploy', label: 'Deploy', icon: '🚀' },
  { id: 'run', label: 'Run', icon: '▶️' },
  { id: 'test', label: 'Test', icon: '🧪' },
]

const STACK_COLORS = {
  Node: 'node', Python: 'python', Docker: 'docker', Go: 'go', Java: 'java',
  Rust: 'rust', '.NET': 'net', Make: 'make', Docs: 'docs', Unknown: 'unknown',
}

const TOOL_LABELS = [
  ['Node.js', 'node'], ['npm', 'npm'], ['Python', 'python'], ['pip', 'pip'],
  ['Docker CLI', 'docker'], ['Go', 'go'], ['Maven', 'mvn'], ['Gradle', 'gradle'],
  ['Cargo (Rust)', 'cargo'], ['.NET SDK', 'dotnet'], ['Make', 'make'], ['Git', 'git'],
]

function fileUrl(path, name) {
  return `/api/projects/file?path=${encodeURIComponent(path)}&name=${encodeURIComponent(name)}`
}

function IdeaBrain() {
  const { t } = useLang()
  const [industries, setIndustries] = useState([])
  const [models, setModels] = useState([])
  const [industry, setIndustry] = useState('healthcare')
  const [model, setModel] = useState('')
  const [count, setCount] = useState(4)
  const [ideas, setIdeas] = useState([])
  const [generating, setGenerating] = useState(false)
  const [scaffolding, setScaffolding] = useState({})
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('/api/brain/industries').then(r => r.json()).then(d => {
      setIndustries(d.industries || [])
    }).catch(() => {})
    fetch('/api/agents/models').then(r => r.json()).then(d => {
      setModels(d.models || [])
      setModel(d.default || (d.models?.[0]?.id) || '')
    }).catch(() => {})
  }, [])

  const generate = useCallback(async () => {
    setGenerating(true)
    setError('')
    setIdeas([])
    try {
      const res = await fetch('/api/brain/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, model, count }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || json.detail || 'Failed to generate ideas')
      setIdeas(json.ideas || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }, [industry, model, count])

  const scaffold = useCallback(async (idea) => {
    setScaffolding(prev => ({ ...prev, [idea.name]: true }))
    setError('')
    try {
      const res = await fetch('/api/brain/scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, model }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || json.detail || 'Failed to scaffold')
      // refresh projects list so the new project shows up
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('pj-refresh'))
      setScaffolding(prev => ({ ...prev, [idea.name]: { done: true, path: json.path, id: json.id } }))
    } catch (e) {
      setError(e.message)
      setScaffolding(prev => ({ ...prev, [idea.name]: false }))
    }
  }, [model])

  const currentIndustry = industries.find(i => i.id === industry)

  return (
    <section className="pj-brain">
      <button className="pj-brain-toggle" onClick={() => setOpen(!open)}>
        <span className="pj-brain-title">🧠 {t('Idea Brain')}</span>
        <span className="pj-brain-note">generate projects from real 2026 industry problems, scaffold them, then run the agent crews</span>
        <span className="pj-brain-caret">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="pj-brain-body">
          <div className="pj-brain-controls">
            <label>
              {t('Industry')}
              <select value={industry} onChange={e => setIndustry(e.target.value)}>
                {industries.map(i => (
                  <option key={i.id} value={i.id}>{i.icon} {i.label}</option>
                ))}
              </select>
            </label>
            <label>
              {t('Model')}
              <select value={model} onChange={e => setModel(e.target.value)}>
                {models.map(m => <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>)}
              </select>
            </label>
            <label>
              {t('Ideas')}
              <select value={count} onChange={e => setCount(Number(e.target.value))}>
                {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <button className="pj-batch-run" onClick={generate} disabled={generating}>
              {generating ? t('Thinking…') : `⚡ ${t('Generate ideas')}`}
            </button>
          </div>

          {currentIndustry && (
            <div className="pj-brain-pains">
              <span className="pj-brain-pains-title">📌 {currentIndustry.label} pain points (2026):</span>
              {currentIndustry.pains.map((p, i) => <span key={i} className="pj-brain-pain">{p}</span>)}
            </div>
          )}

          {error && <p className="pj-error">⚠️ {error}</p>}

          {ideas.length > 0 && (
            <div className="pj-brain-ideas">
              {ideas.map((idea, i) => {
                const sc = scaffolding[idea.name]
                return (
                  <div key={i} className="pj-idea">
                    <div className="pj-idea-head">
                      <h4>{idea.name}</h4>
                      <span className="pj-idea-tagline">{idea.tagline}</span>
                    </div>
                    {idea.problem && <p className="pj-idea-text"><strong>Problem:</strong> {idea.problem}</p>}
                    {idea.solution && <p className="pj-idea-text"><strong>Solution:</strong> {idea.solution}</p>}
                    {idea.stack && <div className="pj-idea-stack">🛠️ {idea.stack}</div>}
                    {idea.features?.length > 0 && (
                      <ul className="pj-idea-features">
                        {idea.features.map((f, j) => <li key={j}>{f}</li>)}
                      </ul>
                    )}
                    <div className="pj-idea-actions">
                      {sc?.done ? (
                        <>
                          <Link to={`/project/${sc.id}`} className="pj-zoom-btn">🔍 {t('Open project')}</Link>
                          <span className="pj-idea-done">✓ {t('Scaffolded')}</span>
                        </>
                      ) : (
                        <button
                          className="pj-action pj-action-build"
                          onClick={() => scaffold(idea)}
                          disabled={!!sc}
                        >
                          {sc ? `⏳ ${t('Scaffolding…')}` : `🏗️ ${t('Scaffold project')}`}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function Badge({ label, cls }) {
  return <span className={`pj-stack pj-stack-${cls}`}>{label}</span>
}

function ToolsBanner({ tools }) {
  const { t } = useLang()
  const installed = []
  const missing = []
  for (const [label, key] of TOOL_LABELS) {
    if (tools[key]) installed.push(label)
    else missing.push(label)
  }
  if (tools.docker && !tools.docker_running) {
    // docker CLI exists but daemon isn't up
    installed.splice(installed.indexOf('Docker CLI'), 1)
    missing.push('Docker daemon (not running)')
  }
  return (
    <div className="pj-tools-banner">
      <span className="pj-tools-banner-title">🛠️ {t('Toolchain on this machine')}</span>
      <div className="pj-tools-line">
        <span className="pj-tools-ok">✓ {t('Installed')}: {installed.join(', ') || '—'}</span>
      </div>
      <div className="pj-tools-line">
        <span className="pj-tools-miss">✗ {t('Missing')}: {missing.join(', ') || '—'}</span>
      </div>
      <p className="pj-tools-note">
        Projects whose Build / Deploy / Run / Test depends on a missing tool will fail — each project card below lists exactly why.
      </p>
    </div>
  )
}

function Issues({ issues }) {
  if (!issues || issues.length === 0) return null
  return (
    <div className="pj-issues">
      <span className="pj-issues-title">⚠️ {issues.length} issue{issues.length > 1 ? 's' : ''} on this machine</span>
      <ul className="pj-issues-list">
        {issues.map((iss, i) => <li key={i}>{iss}</li>)}
      </ul>
    </div>
  )
}

function RunResult({ result }) {
  const { t } = useLang()
  if (!result) return null
  const status = result.timedOut
    ? { label: 'Timed out', cls: 'timeout' }
    : result.ok
      ? { label: 'Success', cls: 'ok' }
      : { label: `Failed (${result.exitCode ?? 'err'})`, cls: 'fail' }
  return (
    <div className="pj-result">
      <div className="pj-result-head">
        <span className={`pj-badge pj-badge-${status.cls}`}>{status.label}</span>
        <code className="pj-result-cmd">{result.command}</code>
        <span className="pj-result-meta">{result.duration}s</span>
      </div>
      {(result.stdout || result.stderr || result.error) && (
        <details className="pj-result-body">
          <summary>{t('View output')}</summary>
          {result.error && <pre className="pj-pre pj-pre-err">{result.error}</pre>}
          {result.stdout && <pre className="pj-pre">{result.stdout}</pre>}
          {result.stderr && <pre className="pj-pre pj-pre-err">{result.stderr}</pre>}
          {result.timedOut && (
            <p className="pj-note">⚠️ Command exceeded the timeout and was stopped. Long-running servers will always show this — that's expected.</p>
          )}
        </details>
      )}
    </div>
  )
}

function DetailPanel({ p, detail, loading }) {
  const { t } = useLang()
  const [tab, setTab] = useState('readme')

  if (loading) {
    return <div className="pj-detail pj-detail-loading">Loading {p.name}…</div>
  }
  if (!detail) {
    return <div className="pj-detail pj-detail-loading">{t('Could not load project detail.')}</div>
  }

  const tabs = [
    { id: 'readme', label: `📘 ${t('README')}`, count: detail.readme ? 1 : 0 },
    { id: 'source', label: `💻 ${t('Source')}`, count: detail.source?.length || 0 },
    { id: 'tree', label: `🌳 ${t('Tree')}`, count: detail.tree?.length || 0 },
    { id: 'images', label: `🖼️ ${t('Images')}`, count: detail.images?.length || 0 },
  ]

  return (
    <div className="pj-detail">
      <div className="pj-detail-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`pj-tab ${tab === t.id ? 'pj-tab-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label} <span className="pj-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="pj-detail-body">
        {tab === 'readme' && (
          detail.readme ? (
            <div className="pj-md">{renderBlocks(parseBlocks(detail.readme))}</div>
          ) : (
            <p className="pj-empty">{t('No README / DOCUMENTATION found in this project.')}</p>
          )
        )}

        {tab === 'source' && (
          detail.source?.length ? (
            <div className="pj-source-list">
              {detail.source.map(f => (
                <details key={f.name} className="pj-source" open={detail.source.length === 1}>
                  <summary className="pj-source-summary">{f.name}</summary>
                  <pre className="pj-pre">{f.content || '// (empty or binary file)'}</pre>
                </details>
              ))}
            </div>
          ) : (
            <p className="pj-empty">{t('No key source files detected.')}</p>
          )
        )}

        {tab === 'tree' && (
          detail.tree?.length ? (
            <pre className="pj-pre pj-tree">{detail.tree.join('\n')}</pre>
          ) : (
            <p className="pj-empty">{t('Empty folder.')}</p>
          )
        )}

        {tab === 'images' && (
          detail.images?.length ? (
            <div className="pj-images">
              {detail.images.map(img => (
                <figure key={img.name} className="pj-fig">
                  <img src={fileUrl(p.path, img.name)} alt={img.name} loading="lazy" />
                  <figcaption>{img.name}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="pj-empty">{t('No images found.')}</p>
          )
        )}
      </div>
    </div>
  )
}

function ProjectCard({ p, expanded, onToggle, onRun, running, results }) {
  const { t } = useLang()
  const actions = ACTIONS.filter(a => p.commands?.[a.id])
  return (
    <div className={`pj-card ${expanded ? 'pj-card-expanded' : ''}`}>
      <div className="pj-card-head">
        <div className="pj-card-title">
          <h3>{p.title}</h3>
          {p.name !== p.title && <span className="pj-card-slug">{p.name}</span>}
        </div>
        <div className="pj-card-head-btns">
          <Link to={`/project/${p.id}`} className="pj-zoom-btn" title="Open full project page + agent crew">🔍 {t('Zoom')}</Link>
          <button className="pj-details-btn" onClick={() => onToggle(p.path)}>
            {expanded ? `▲ ${t('Close')}` : `▼ ${t('Details')}`}
          </button>
        </div>
      </div>

      <p className="pj-scope" title={p.scope}>
        {p.scope || t('— no description detected —')}
      </p>

      <div className="pj-stacks">
        {p.stacks.map(s => (
          <Badge key={s} label={s} cls={STACK_COLORS[s] || 'unknown'} />
        ))}
      </div>

      <Issues issues={p.issues} />

      <div className="pj-path" title={p.path}>📍 {p.path}</div>

      <div className="pj-actions">
        {actions.length ? (
          actions.map(a => (
            <button
              key={a.id}
              className={`pj-action pj-action-${a.id}`}
              disabled={!!running}
              onClick={() => onRun(p.path, a.id)}
            >
              {running === a.id ? '⏳ …' : `${a.icon} ${a.label}`}
            </button>
          ))
        ) : p.kind === 'docs' ? (
          <span className="pj-no-cmds">📚 Documentation project — no build/run commands</span>
        ) : (
          <span className="pj-no-cmds">{t('No auto-detected commands')}</span>
        )}
      </div>

      {ACTIONS.filter(a => running === a.id || results[`${p.path}::${a.id}`]).map(a => (
        <RunResult key={a.id} result={results[`${p.path}::${a.id}`]} />
      ))}
    </div>
  )
}

export default function ProjectsView() {
  const { t } = useLang()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('all')

  const [expanded, setExpanded] = useState({})
  const [details, setDetails] = useState({})
  const [detailLoading, setDetailLoading] = useState({})

  const [running, setRunning] = useState({})     // path -> action id
  const [results, setResults] = useState({})      // "path::action" -> result

  const [batchAction, setBatchAction] = useState('build')
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchResult, setBatchResult] = useState(null)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/projects')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || json.detail || 'Failed to load projects')
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
    const onRefresh = () => loadProjects()
    window.addEventListener('pj-refresh', onRefresh)
    return () => window.removeEventListener('pj-refresh', onRefresh)
  }, [loadProjects])

  const toggleDetail = useCallback((path) => {
    const willOpen = !expanded[path]
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }))
    if (willOpen && !details[path] && !detailLoading[path]) {
      setDetailLoading(prevL => ({ ...prevL, [path]: true }))
      fetch(`/api/projects/detail?path=${encodeURIComponent(path)}`)
        .then(r => r.json())
        .then(d => setDetails(prevD => ({ ...prevD, [path]: d })))
        .catch(() => setDetails(prevD => ({ ...prevD, [path]: null })))
        .finally(() => setDetailLoading(prevL => ({ ...prevL, [path]: false })))
    }
  }, [expanded, details, detailLoading])

  const runAction = useCallback(async (path, action) => {
    setRunning(prev => ({ ...prev, [path]: action }))
    try {
      const res = await fetch('/api/projects/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, action }),
      })
      const json = await res.json()
      setResults(prev => ({ ...prev, [`${path}::${action}`]: json }))
    } catch (e) {
      setResults(prev => ({ ...prev, [`${path}::${action}`]: { ok: false, error: e.message } }))
    } finally {
      setRunning(prev => {
        const next = { ...prev }
        delete next[path]
        return next
      })
    }
  }, [])

  const runBatch = useCallback(async () => {
    setBatchRunning(true)
    setBatchResult(null)
    try {
      let paths = []
      if (location !== 'all' && data) {
        const group = data.groups.find(g => String(g.index) === location)
        paths = group ? group.projects.map(p => p.path) : []
      }
      const res = await fetch('/api/projects/run-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: batchAction, paths }),
      })
      const json = await res.json()
      setBatchResult(json)
    } catch (e) {
      setBatchResult({ error: e.message })
    } finally {
      setBatchRunning(false)
    }
  }, [batchAction, location, data])

  // Filter by location first, then by search text.
  const visibleGroups = useMemo(() => {
    if (!data) return []
    const needle = q.trim().toLowerCase()
    let groups = data.groups
    if (location !== 'all') {
      groups = groups.filter(g => String(g.index) === location)
    }
    if (!needle) return groups
    return groups.map(g => ({
      ...g,
      projects: g.projects.filter(p =>
        (p.name + ' ' + p.title + ' ' + p.scope + ' ' + p.stacks.join(' ')).toLowerCase().includes(needle)
      ),
    }))
  }, [data, q, location])

  const visibleCount = useMemo(
    () => visibleGroups.reduce((n, g) => n + g.projects.length, 0),
    [visibleGroups]
  )

  return (
    <div className="pj-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <IdeaBrain />

      <div className="pj-hero">
        <div className="page-header-row">
          <h1>🗂️ {t('All Projects')}</h1>
          <FetchButton onFetch={async () => { await loadProjects(); return 'Projects re-fetched from backend' }} label="Fetch Latest" />
        </div>
        <p className="pj-sub">
          {loading ? t('Scanning workspace…') : data ? `${data.total} projects across ${data.groups.length} workspace locations` : ''}
        </p>
        <div className="pj-toolbar">
          <div className="pj-search">
            <input
              type="text"
              placeholder="Search projects, scopes, stacks…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            {q && <button className="pj-search-clear" onClick={() => setQ('')}>✕</button>}
          </div>
          <label className="pj-loc-label">
            {t('Location')}
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value="all">All locations ({data?.total ?? 0})</option>
              {data?.groups.map(g => (
                <option key={g.index} value={String(g.index)}>{g.index}. {g.rootName} ({g.count})</option>
              ))}
            </select>
          </label>
          <button className="pj-refresh" onClick={loadProjects} disabled={loading}>↻ {t('Refresh')}</button>
        </div>
        {error && <p className="pj-error">⚠️ {error}</p>}
        {data?.tools && <ToolsBanner tools={data.tools} />}
      </div>

      <section className="pj-batch">
        <div className="pj-batch-head">
          <span className="pj-batch-title">⚡ {t('Batch operations')}</span>
          <span className="pj-batch-note">
            runs one action sequentially across {location === 'all' ? 'all' : 'the selected'} projects — scope follows the Location dropdown
          </span>
        </div>
        <div className="pj-batch-controls">
          <label>
            Action
            <select value={batchAction} onChange={e => setBatchAction(e.target.value)}>
              {ACTIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </label>
          <button className="pj-batch-run" onClick={runBatch} disabled={batchRunning}>
            {batchRunning ? t('Running…') : `▶ ${t('Run batch')} (${visibleCount} ${t('projects')})`}
          </button>
        </div>
        {batchResult && (
          <div className="pj-batch-results">
            <div className="pj-batch-summary">
              {batchResult.error ? (
                <span className="pj-badge pj-badge-fail">Error: {batchResult.error}</span>
              ) : (
                <>
                  <span className={`pj-badge ${batchResult.failed ? 'pj-badge-fail' : 'pj-badge-ok'}`}>
                    {batchResult.ok}/{batchResult.total} succeeded
                  </span>
                  <span className="pj-batch-meta">action: {batchResult.action}</span>
                </>
              )}
            </div>
            {batchResult.results && (
              <div className="pj-batch-list">
                {batchResult.results.map(r => (
                  <details key={r.path} className={`pj-batch-item ${r.ok ? 'ok' : 'fail'}`}>
                    <summary>
                      <span className={`pj-badge pj-badge-${r.ok ? 'ok' : 'fail'}`}>{r.ok ? '✓' : '✗'}</span>
                      <span className="pj-batch-item-name">{r.path}</span>
                      {r.noCommand && <span className="pj-batch-tag">{t('no command')}</span>}
                      {r.toolMissing && <span className="pj-batch-tag">missing: {r.toolMissing}</span>}
                      <em>{r.duration}s</em>
                    </summary>
                    <pre className="pj-pre">{r.stdout || r.stderr || r.error || '(no output)'}</pre>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <p className="pj-visible-count">
        Showing <strong>{visibleCount}</strong> project{visibleCount === 1 ? '' : 's'}
        {q.trim() ? ` matching “${q.trim()}”` : ''}
        {location !== 'all' ? ` in ${data?.groups.find(g => String(g.index) === location)?.rootName ?? ''}` : ''}
      </p>

      {visibleGroups.map(group => (
        <section key={group.index} className="pj-group">
          <h2 className="pj-group-head">
            <span className="pj-group-num">{group.index}</span>
            <span className="pj-group-name">{group.rootName}</span>
            <span className="pj-group-count">{group.projects.length} project{group.projects.length === 1 ? '' : 's'}</span>
            <span className="pj-group-root" title={group.root}>📍 {group.root}</span>
          </h2>
          {group.projects.length === 0 ? (
            <p className="pj-empty">{t('No projects match your search.')}</p>
          ) : (
            <div className="pj-grid">
              {group.projects.map(p => (
                <div key={p.id} className="pj-cell">
                  <ProjectCard
                    p={p}
                    expanded={!!expanded[p.path]}
                    onToggle={toggleDetail}
                    onRun={runAction}
                    running={running[p.path]}
                    results={results}
                  />
                  {expanded[p.path] && (
                    <DetailPanel p={p} detail={details[p.path]} loading={detailLoading[p.path]} />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {!loading && !error && data && data.total === 0 && (
        <p className="pj-empty">{t('No projects found in any configured location.')}</p>
      )}

      <div className="pj-footer">
        — All Projects · build / deploy / run / test from one screen · backend executes commands locally —
      </div>
    </div>
  )
}
