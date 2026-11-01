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
  Static: 'docs', Node: 'node', Python: 'python', Docker: 'docker', Go: 'go', Java: 'java',
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

const BLOCKING = new Set(['install', 'build', 'test'])
const ALL_ACTIONS = [
  { id: 'install', label: 'Install', icon: '📥', hint: 'Install dependencies' },
  { id: 'build', label: 'Build', icon: '🏗️', hint: 'Install + compile / bundle' },
  { id: 'test', label: 'Test', icon: '🧪', hint: 'Run the test suite' },
  { id: 'run', label: 'Run', icon: '▶️', hint: 'Start the dev server in the background' },
  { id: 'deploy', label: 'Deploy', icon: '🚀', hint: 'Production build + start locally (or Docker)' },
]
const BATCH_ACTIONS = ALL_ACTIONS.filter(a => BLOCKING.has(a.id))

async function postJson(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const json = await res.json().catch(() => ({}))
  if (!res.ok && !json.stderr) throw new Error(json.error || json.detail || `HTTP ${res.status}`)
  return json
}

function Elapsed({ since }) {
  const [, tick] = useState(0)
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 1000); return () => clearInterval(t) }, [])
  return <>{Math.max(0, Math.round((Date.now() - since) / 1000))}s</>
}

function RunResult({ result, onClose }) {
  const { t } = useLang()
  if (!result) return null
  const status = result.noCommand
    ? { label: 'No command', cls: 'skip' }
    : result.toolMissing
      ? { label: `Missing ${result.toolMissing}`, cls: 'fail' }
      : result.timedOut
        ? { label: 'Timed out', cls: 'timeout' }
        : result.noTests
          ? { label: 'No tests found', cls: 'skip' }
          : result.ok ? { label: 'Success', cls: 'ok' } : { label: `Failed (${result.exitCode ?? 'err'})`, cls: 'fail' }
  const out = [result.error, result.stdout, result.stderr].filter(Boolean).join('\n')
  return (
    <div className={`pj-result pj-result-${status.cls}`}>
      <div className="pj-result-head">
        <span className={`pj-badge pj-badge-${status.cls}`}>{status.label}</span>
        <span className="pj-result-action">{result.action}</span>
        {result.command && <code className="pj-result-cmd">{result.command}</code>}
        {result.duration != null && <span className="pj-result-meta">{result.duration}s</span>}
        {onClose && <button type="button" className="pj-x" onClick={onClose} aria-label="Dismiss">✕</button>}
      </div>
      {out && (
        <details className="pj-result-body" open={!result.ok}>
          <summary>{t('View output')}</summary>
          <pre className={`pj-pre ${result.ok ? '' : 'pj-pre-err'}`}>{out.slice(-6000)}</pre>
        </details>
      )}
    </div>
  )
}

function ProcessPanel({ proc, onStop, onRefresh }) {
  const [log, setLog] = useState(proc.log || '')
  const [open, setOpen] = useState(proc.status !== 'running' || !proc.url)
  useEffect(() => {
    if (!open) return undefined
    let live = true
    const pull = () => fetch(`/api/projects/logs?path=${encodeURIComponent(proc.path)}`).then(r => r.json()).then(d => {
      if (!live) return
      if (d.log != null) setLog(d.log)
      onRefresh(d)
    }).catch(() => {})
    pull()
    const t = setInterval(pull, 2500)
    return () => { live = false; clearInterval(t) }
  }, [open, proc.path]) // eslint-disable-line react-hooks/exhaustive-deps
  const running = proc.status === 'running'
  return (
    <div className={`pj-proc ${running ? 'live' : 'ended'}`}>
      <div className="pj-proc-head">
        <span className="pj-proc-dot" />
        <b>{proc.action === 'deploy' ? 'Deployed' : 'Running'}</b>
        <span className="pj-proc-state">
          {running ? (proc.url ? 'live' : 'starting…') : proc.status === 'stopped' ? 'stopped' : `exited (${proc.exitCode})`}
        </span>
        {running && proc.url && <a className="pj-open" href={proc.url} target="_blank" rel="noreferrer">Open {proc.url.replace(/^https?:\/\//, '')} ↗</a>}
        <span className="pj-spacer" />
        <button type="button" className="pj-mini" onClick={() => setOpen(o => !o)}>{open ? 'Hide logs' : 'Logs'}</button>
        {running && <button type="button" className="pj-mini pj-mini-stop" onClick={onStop}>■ Stop</button>}
      </div>
      <code className="pj-proc-cmd">{proc.command}</code>
      {open && <pre className="pj-pre pj-log">{log || 'Waiting for output…'}</pre>}
    </div>
  )
}

function ProjectCard({ p, expanded, onToggle, onRun, busy, results, proc, onStop, onProcUpdate, onDismiss }) {
  const { t } = useLang()
  const actions = ALL_ACTIONS.filter(a => p.commands?.[a.id])
  const running = proc && proc.status === 'running'
  return (
    <div className={`pj-card ${expanded ? 'pj-card-expanded' : ''} ${running ? 'pj-card-live' : ''}`}>
      <div className="pj-card-head">
        <div className="pj-card-title">
          <h3>{p.title}</h3>
          {p.name !== p.title && <span className="pj-card-slug">{p.name}</span>}
        </div>
        {running && <span className="pj-live-pill">● {proc.url ? `:${proc.port}` : 'starting'}</span>}
      </div>

      <p className="pj-scope" title={p.scope}>{p.scope || t('— no description detected —')}</p>

      <div className="pj-stacks">
        {p.stacks.map(s => <Badge key={s} label={s} cls={STACK_COLORS[s] || 'unknown'} />)}
      </div>

      <Issues issues={p.issues} />

      <div className="pj-actions">
        {actions.length ? actions.map(a => (
          <button
            key={a.id}
            type="button"
            className={`pj-action pj-action-${a.id}`}
            disabled={!!busy || (running && !BLOCKING.has(a.id))}
            onClick={() => onRun(p.path, a.id)}
            title={`${a.hint}\n$ ${p.commands[a.id]}`}
          >
            {busy?.action === a.id ? <>⏳ <Elapsed since={busy.since} /></> : `${a.icon} ${a.label}`}
          </button>
        )) : p.kind === 'docs' ? (
          <span className="pj-no-cmds">📚 Documentation project — read it in Details</span>
        ) : (
          <span className="pj-no-cmds">{t('No auto-detected commands')}</span>
        )}
      </div>

      {proc && <ProcessPanel proc={proc} onStop={() => onStop(p.path)} onRefresh={d => onProcUpdate(p.path, d)} />}
      {ALL_ACTIONS.filter(a => BLOCKING.has(a.id) || !proc).map(a => results[`${p.path}::${a.id}`] && (
        <RunResult key={a.id} result={results[`${p.path}::${a.id}`]} onClose={() => onDismiss(`${p.path}::${a.id}`)} />
      ))}

      <div className="pj-card-foot">
        <span className="pj-path" title={p.path}>📍 {p.path}</span>
        <div className="pj-card-head-btns">
          <Link to={`/project/${p.id}`} className="pj-zoom-btn" title="Open full project page + agent crew">🔍 {t('Zoom')}</Link>
          <button type="button" className="pj-details-btn" onClick={() => onToggle(p.path)}>
            {expanded ? `▲ ${t('Close')}` : `▼ ${t('Details')}`}
          </button>
        </div>
      </div>
    </div>
  )
}

function BatchPanel({ scopePaths, scopeLabel }) {
  const { t } = useLang()
  const [action, setAction] = useState('build')
  const [job, setJob] = useState(null)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('problems')

  useEffect(() => {
    if (!job || job.status !== 'running') return undefined
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/projects/batch?id=${job.id}&since=${job.next || 0}`)
        const d = await r.json()
        if (!r.ok) throw new Error(d.error)
        setResults(prev => [...prev, ...(d.results || [])])
        setJob(d)
      } catch (e) { setError(e.message) }
    }, 2000)
    return () => clearInterval(t)
  }, [job])

  const start = async () => {
    setError(''); setResults([])
    try { setJob(await postJson('/api/projects/run-batch', { action, paths: scopePaths })) } catch (e) { setError(e.message) }
  }
  const cancel = async () => { try { setJob(await postJson('/api/projects/batch/cancel', { id: job.id })) } catch (e) { setError(e.message) } }
  const running = job?.status === 'running'
  const pct = job ? Math.round((job.done / Math.max(1, job.total)) * 100) : 0
  const shown = results.filter(r => filter === 'all' || (filter === 'problems' ? !r.ok && !r.noCommand : r.ok))
    .sort((a, b) => Number(a.ok) - Number(b.ok))

  return (
    <section className="pj-batch">
      <div className="pj-batch-head">
        <div>
          <span className="pj-batch-title">⚡ {t('Batch operations')}</span>
          <span className="pj-batch-note">Runs 3 at a time in the background · scope: {scopeLabel} ({scopePaths.length})</span>
        </div>
        <div className="pj-batch-controls">
          <div className="pj-seg" role="group" aria-label="Batch action">
            {BATCH_ACTIONS.map(a => (
              <button key={a.id} type="button" className={action === a.id ? 'on' : ''} disabled={running} onClick={() => setAction(a.id)}>{a.icon} {a.label}</button>
            ))}
          </div>
          {running
            ? <button type="button" className="pj-batch-run pj-batch-cancel" onClick={cancel}>■ Cancel</button>
            : <button type="button" className="pj-batch-run" onClick={start} disabled={!scopePaths.length}>▶ {t('Run batch')} ({scopePaths.length})</button>}
        </div>
      </div>
      {error && <p className="pj-error">⚠️ {error}</p>}
      {job && (
        <div className="pj-batch-results">
          <div className="pj-progress"><i style={{ width: `${pct}%` }} /></div>
          <div className="pj-batch-summary">
            <span className="pj-badge pj-badge-run">{job.status === 'running' ? `${job.action} · ${job.done}/${job.total}` : `${job.action} ${job.status} · ${job.elapsed}s`}</span>
            <span className="pj-badge pj-badge-ok">✓ {job.ok}</span>
            <span className="pj-badge pj-badge-fail">✗ {job.failed}</span>
            <span className="pj-badge pj-badge-skip">– {job.skipped} no command</span>
            {job.current?.length > 0 && <span className="pj-batch-meta">now: {job.current.join(', ')}</span>}
            <span className="pj-spacer" />
            <div className="pj-seg pj-seg-sm">
              {[['problems', 'Failures'], ['ok', 'Passed'], ['all', 'All']].map(([k, l]) => (
                <button key={k} type="button" className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="pj-batch-list">
            {shown.slice(0, 300).map(r => (
              <details key={r.path} className={`pj-batch-item ${r.ok ? 'ok' : 'fail'}`}>
                <summary>
                  <span className={`pj-badge pj-badge-${r.ok ? 'ok' : r.noCommand ? 'skip' : 'fail'}`}>{r.ok ? '✓' : r.noCommand ? '–' : '✗'}</span>
                  <span className="pj-batch-item-name">{r.name}</span>
                  {r.noTests && <span className="pj-batch-tag">no tests</span>}
                  {r.toolMissing && <span className="pj-batch-tag">missing: {r.toolMissing}</span>}
                  {r.timedOut && <span className="pj-batch-tag">timed out</span>}
                  <em>{r.duration ?? '–'}s</em>
                </summary>
                {r.command && <code className="pj-result-cmd">{r.command}</code>}
                <pre className="pj-pre">{r.output || '(no output)'}</pre>
              </details>
            ))}
            {!shown.length && <p className="pj-empty">{filter === 'problems' ? 'No failures so far.' : 'Nothing yet.'}</p>}
          </div>
        </div>
      )}
    </section>
  )
}

export default function ProjectsView() {
  const { t } = useLang()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('all')
  const [stack, setStack] = useState('All')
  const [runnableOnly, setRunnableOnly] = useState(false)

  const [expanded, setExpanded] = useState({})
  const [details, setDetails] = useState({})
  const [detailLoading, setDetailLoading] = useState({})
  const [busy, setBusy] = useState({})       // path -> { action, since }
  const [results, setResults] = useState({}) // "path::action" -> result
  const [procs, setProcs] = useState({})     // path -> process info

  const loadProjects = useCallback(async (force = false) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/projects${force ? '?force=1' : ''}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || json.detail || 'Failed to load projects')
      setData(json)
      return `Rescanned ${json.total} projects`
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const loadProcs = useCallback(async () => {
    try {
      const d = await (await fetch('/api/projects/processes')).json()
      const map = {}
      for (const pr of d.processes || []) map[pr.path] = pr
      setProcs(prev => {
        const next = { ...map }
        // keep ended entries the user hasn't dismissed
        for (const [k, v] of Object.entries(prev)) if (!next[k] && v.status !== 'running') next[k] = v
        return next
      })
    } catch { /* backend restarting */ }
  }, [])

  useEffect(() => {
    loadProjects().catch(() => {})
    loadProcs()
    const onRefresh = () => loadProjects(true).catch(() => {})
    window.addEventListener('pj-refresh', onRefresh)
    return () => window.removeEventListener('pj-refresh', onRefresh)
  }, [loadProjects, loadProcs])

  const liveCount = Object.values(procs).filter(p => p.status === 'running').length
  useEffect(() => {
    if (!liveCount) return undefined
    const t = setInterval(loadProcs, 4000)
    return () => clearInterval(t)
  }, [liveCount, loadProcs])

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
    setBusy(prev => ({ ...prev, [path]: { action, since: Date.now() } }))
    try {
      const json = await postJson('/api/projects/run', { path, action })
      if (json.background) setProcs(prev => ({ ...prev, [path]: json }))
      else setResults(prev => ({ ...prev, [`${path}::${action}`]: { ...json, action } }))
    } catch (e) {
      setResults(prev => ({ ...prev, [`${path}::${action}`]: { ok: false, action, error: e.message } }))
    } finally {
      setBusy(prev => { const next = { ...prev }; delete next[path]; return next })
    }
  }, [])

  const stopProc = useCallback(async (path) => {
    try {
      const d = await postJson('/api/projects/stop', { path: procs[path]?.path || path })
      setProcs(prev => ({ ...prev, [path]: d }))
    } catch (e) { setError(e.message) }
  }, [procs])
  const updateProc = useCallback((path, d) => { if (d && d.status) setProcs(prev => ({ ...prev, [path]: { ...prev[path], ...d } })) }, [])
  const dismiss = useCallback(key => setResults(prev => { const n = { ...prev }; delete n[key]; return n }), [])

  const allStacks = useMemo(() => {
    const c = {}
    data?.groups.forEach(g => g.projects.forEach(p => p.stacks.forEach(s => { c[s] = (c[s] || 0) + 1 })))
    return Object.entries(c).sort((a, b) => b[1] - a[1])
  }, [data])

  const visibleGroups = useMemo(() => {
    if (!data) return []
    const needle = q.trim().toLowerCase()
    let groups = data.groups
    if (location !== 'all') groups = groups.filter(g => String(g.index) === location)
    return groups.map(g => ({
      ...g,
      projects: g.projects.filter(p =>
        (!needle || (p.name + ' ' + p.title + ' ' + p.scope + ' ' + p.stacks.join(' ')).toLowerCase().includes(needle)) &&
        (stack === 'All' || p.stacks.includes(stack)) &&
        (!runnableOnly || p.commands?.run || p.commands?.deploy)),
    }))
  }, [data, q, location, stack, runnableOnly])

  const visiblePaths = useMemo(() => visibleGroups.flatMap(g => g.projects.map(p => p.path)), [visibleGroups])
  const runnable = useMemo(() => data ? data.groups.reduce((n, g) => n + g.projects.filter(p => p.commands?.run || p.commands?.deploy).length, 0) : 0, [data])
  const liveProcs = Object.values(procs).filter(p => p.status === 'running')

  return (
    <div className="pj-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <IdeaBrain />

      <div className="pj-hero">
        <div className="page-header-row">
          <h1>🗂️ {t('All Projects')}</h1>
          <FetchButton onFetch={() => loadProjects(true)} label="Fetch Latest" />
        </div>
        <p className="pj-sub">Build, test, run and deploy every project in your workspace — commands run locally on this machine.</p>
        <div className="pj-kpis">
          <div><b>{data?.total ?? '—'}</b><span>projects</span></div>
          <div><b>{data?.groups.length ?? '—'}</b><span>locations</span></div>
          <div><b>{runnable || '—'}</b><span>runnable</span></div>
          <div className={liveProcs.length ? 'live' : ''}><b>{liveProcs.length}</b><span>running now</span></div>
        </div>
        <div className="pj-toolbar">
          <div className="pj-search">
            <input type="text" placeholder="Search projects, scopes, stacks…" value={q} onChange={e => setQ(e.target.value)} />
            {q && <button className="pj-search-clear" onClick={() => setQ('')}>✕</button>}
          </div>
          <label className="pj-loc-label">
            {t('Location')}
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value="all">All locations ({data?.total ?? 0})</option>
              {data?.groups.map(g => <option key={g.index} value={String(g.index)}>{g.index}. {g.rootName} ({g.count})</option>)}
            </select>
          </label>
          <label className="pj-check"><input type="checkbox" checked={runnableOnly} onChange={e => setRunnableOnly(e.target.checked)} /> Runnable only</label>
          <button className="pj-refresh" onClick={() => loadProjects(true).catch(() => {})} disabled={loading}>↻ {loading ? 'Scanning…' : t('Rescan')}</button>
        </div>
        {allStacks.length > 0 && (
          <div className="pj-stack-filter">
            {[['All', data?.total || 0], ...allStacks].map(([s, n]) => (
              <button key={s} type="button" className={`pj-stack-chip ${stack === s ? 'on' : ''} pj-stack-${STACK_COLORS[s] || 'unknown'}`} onClick={() => setStack(s)}>{s} <em>{n}</em></button>
            ))}
          </div>
        )}
        {error && <p className="pj-error">⚠️ {error}</p>}
        {data?.tools && <ToolsBanner tools={data.tools} />}
      </div>

      {liveProcs.length > 0 && (
        <section className="pj-running">
          <h2>🟢 Running now <em>{liveProcs.length}</em></h2>
          <div className="pj-running-list">
            {liveProcs.map(pr => (
              <div key={pr.path} className="pj-running-item">
                <b>{pr.path.split(/[\\/]/).pop()}</b>
                <span>{pr.action} · :{pr.port} · {Math.round(pr.uptime / 60)}m</span>
                {pr.url ? <a href={pr.url} target="_blank" rel="noreferrer">Open ↗</a> : <span className="pj-dim">starting…</span>}
                <button type="button" className="pj-mini pj-mini-stop" onClick={() => stopProc(pr.path)}>■ Stop</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <BatchPanel scopePaths={visiblePaths} scopeLabel={location === 'all' && stack === 'All' && !q && !runnableOnly ? 'all projects' : 'current filters'} />

      <p className="pj-visible-count">
        Showing <strong>{visiblePaths.length}</strong> project{visiblePaths.length === 1 ? '' : 's'}
        {q.trim() ? ` matching “${q.trim()}”` : ''}{stack !== 'All' ? ` · ${stack}` : ''}
        {location !== 'all' ? ` in ${data?.groups.find(g => String(g.index) === location)?.rootName ?? ''}` : ''}
      </p>

      {visibleGroups.filter(g => g.projects.length).map(group => (
        <section key={group.index} className="pj-group">
          <h2 className="pj-group-head">
            <span className="pj-group-num">{group.index}</span>
            <span className="pj-group-name">{group.rootName}</span>
            <span className="pj-group-count">{group.projects.length} project{group.projects.length === 1 ? '' : 's'}</span>
            <span className="pj-group-root" title={group.root}>📍 {group.root}</span>
          </h2>
          <div className="pj-grid">
            {group.projects.map(p => (
              <div key={p.id} className="pj-cell">
                <ProjectCard
                  p={p}
                  expanded={!!expanded[p.path]}
                  onToggle={toggleDetail}
                  onRun={runAction}
                  busy={busy[p.path]}
                  results={results}
                  proc={procs[p.path]}
                  onStop={stopProc}
                  onProcUpdate={updateProc}
                  onDismiss={dismiss}
                />
                {expanded[p.path] && <DetailPanel p={p} detail={details[p.path]} loading={detailLoading[p.path]} />}
              </div>
            ))}
          </div>
        </section>
      ))}

      {!loading && data && visiblePaths.length === 0 && <p className="pj-empty">{t('No projects match your search.')}</p>}

      <div className="pj-footer">— All Projects · install / build / test / run / deploy from one screen · commands execute locally —</div>
    </div>
  )
}
