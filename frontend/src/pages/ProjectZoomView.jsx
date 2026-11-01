import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { parseBlocks, renderBlocks } from '../components/MarkdownView'
import './ProjectZoomView.css'
import { useLang } from '../i18n'

const STACK_COLORS = {
  Node: 'node', Python: 'python', Docker: 'docker', Go: 'go', Java: 'java',
  Rust: 'rust', '.NET': 'net', Make: 'make', Docs: 'docs', Unknown: 'unknown',
}

const PHASE_LABELS = {
  planner: '🧭 Planner', tasker: '📋 Tasker', builder: '🏗️ Builder',
  deployer: '🚀 Deployer', runner: '▶️ Runner', done: '✅ Done',
}

function fileUrl(path, name) {
  return `/api/projects/file?path=${encodeURIComponent(path)}&name=${encodeURIComponent(name)}`
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
    <div className="pz-result">
      <div className="pz-result-head">
        <span className={`pz-badge pz-badge-${status.cls}`}>{status.label}</span>
        <code>{result.command}</code>
        <span className="pz-result-meta">{result.duration}s</span>
      </div>
      {(result.stdout || result.stderr || result.error) && (
        <details className="pz-result-body">
          <summary>{t('View output')}</summary>
          {result.error && <pre className="pz-pre pz-pre-err">{result.error}</pre>}
          {result.stdout && <pre className="pz-pre">{result.stdout}</pre>}
          {result.stderr && <pre className="pz-pre pz-pre-err">{result.stderr}</pre>}
        </details>
      )}
    </div>
  )
}

function CrewPanel({ project }) {
  const { t } = useLang()
  const [models, setModels] = useState([])
  const [model, setModel] = useState('')
  const [crew, setCrew] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const logRef = useRef(null)

  useEffect(() => {
    fetch('/api/agents/models')
      .then(r => r.json())
      .then(d => {
        setModels(d.models || [])
        setModel(d.default || (d.models?.[0]?.id) || '')
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [crew?.transcript?.length])

  const start = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/agents/crew/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path, model }),
      })
      setCrew(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }, [project.path, model])

  const step = useCallback(async () => {
    if (!crew?.id) return
    setBusy(true)
    try {
      const res = await fetch('/api/agents/crew/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: crew.id }),
      })
      setCrew(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }, [crew?.id])

  const approve = useCallback(async (ok) => {
    if (!crew?.id) return
    setBusy(true)
    try {
      const res = await fetch('/api/agents/crew/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: crew.id, approve: ok }),
      })
      setCrew(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }, [crew?.id])

  const runAll = useCallback(async () => {
    // Step repeatedly until done or awaiting approval.
    let current = crew
    setBusy(true)
    try {
      for (let i = 0; i < 10; i++) {
        if (current?.status === 'done' || current?.status === 'awaiting_approval' || current?.status === 'error') break
        const res = await fetch('/api/agents/crew/step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: current.id }),
        })
        current = await res.json()
        setCrew(current)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }, [crew])

  const phaseIndex = useMemo(() => {
    const idx = ['planner', 'tasker', 'builder', 'deployer', 'runner', 'done'].indexOf(crew?.phase)
    return idx === -1 ? 0 : idx
  }, [crew?.phase])

  return (
    <div className="pz-crew">
      <div className="pz-crew-head">
        <h3>🤖 {t('Agent Crew')}</h3>
        <span className="pz-crew-sub">Multi-agent A2A — each phase is handled by a specialist agent on a free model</span>
      </div>

      <div className="pz-crew-controls">
        <label>
          Model
          <select value={model} onChange={e => setModel(e.target.value)}>
            {models.length === 0 && <option value="">{t('(detecting free models…)')}</option>}
            {models.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.provider}{m.free ? ' (free)' : ''}
              </option>
            ))}
          </select>
        </label>
        {!crew && (
          <button className="pz-btn pz-btn-primary" onClick={start} disabled={busy || !model}>
            {busy ? t('Planning…') : `🚀 ${t('Start crew')}`}
          </button>
        )}
        {crew && crew.status !== 'done' && (
          <>
            <button className="pz-btn" onClick={step} disabled={busy || crew.status === 'awaiting_approval'}>
              {busy ? t('Working…') : `⏭️ ${t('Next phase')}`}
            </button>
            <button className="pz-btn" onClick={runAll} disabled={busy || crew.status === 'awaiting_approval'}>
              ▶▶ {t('Run to end')}
            </button>
          </>
        )}
        {crew && (
          <span className={`pz-status pz-status-${crew.status}`}>
            {crew.status === 'awaiting_approval' ? `⏸️ ${t('Awaiting approval')}` : crew.status === 'done' ? `✅ ${t('Done')}` : crew.status === 'error' ? `⚠️ ${t('Error')}` : `● ${crew.phase}`}
          </span>
        )}
      </div>

      {error && <p className="pz-error">⚠️ {error}</p>}

      {crew && (
        <div className="pz-phases">
          {['planner', 'tasker', 'builder', 'deployer', 'runner', 'done'].map((ph, i) => (
            <div key={ph} className={`pz-phase ${i < phaseIndex ? 'done' : i === phaseIndex ? 'active' : ''}`}>
              <span className="pz-phase-dot" />
              {PHASE_LABELS[ph]}
            </div>
          ))}
        </div>
      )}

      {crew?.pendingChange && (
        <div className="pz-pending">
          <div className="pz-pending-title">⚠️ Agent wants to change a file — your approval required</div>
          <div className="pz-pending-meta">
            <code>{crew.pendingChange.file}</code>
            <span className="pz-pending-reason">{crew.pendingChange.reason}</span>
          </div>
          <pre className="pz-pre pz-diff">{crew.pendingChange.content}</pre>
          <div className="pz-pending-actions">
            <button className="pz-btn pz-btn-approve" onClick={() => approve(true)} disabled={busy}>✓ {t('Approve & apply')}</button>
            <button className="pz-btn pz-btn-reject" onClick={() => approve(false)} disabled={busy}>✗ {t('Reject')}</button>
          </div>
        </div>
      )}

      {(crew?.plan || crew?.tasks) && (
        <div className="pz-plan">
          {crew.plan && (
            <details open>
              <summary>🧭 {t('Plan')}</summary>
              <div className="pz-md">{renderBlocks(parseBlocks(crew.plan))}</div>
            </details>
          )}
          {crew.tasks && (
            <details>
              <summary>📋 {t('Tasks')}</summary>
              <div className="pz-md">{renderBlocks(parseBlocks(crew.tasks))}</div>
            </details>
          )}
        </div>
      )}

      {crew && Object.keys(crew.results || {}).length > 0 && (
        <div className="pz-results">
          {Object.entries(crew.results).map(([k, r]) => (
            <RunResult key={k} result={r} />
          ))}
        </div>
      )}

      {crew && (
        <div className="pz-log" ref={logRef}>
          {(crew.transcript || []).map((t, i) => (
            <div key={i} className={`pz-log-line pz-log-${t.role}`}>
              <span className="pz-log-agent">{t.agent}</span>
              <div className="pz-log-text">{t.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailTabs({ project, detail }) {
  const { t } = useLang()
  const [tab, setTab] = useState('readme')
  const tabs = [
    { id: 'readme', label: `📘 ${t('README')}`, count: detail?.readme ? 1 : 0 },
    { id: 'source', label: `💻 ${t('Source')}`, count: detail?.source?.length || 0 },
    { id: 'tree', label: `🌳 ${t('Tree')}`, count: detail?.tree?.length || 0 },
    { id: 'images', label: `🖼️ ${t('Images')}`, count: detail?.images?.length || 0 },
  ]
  if (!detail) return <div className="pz-detail-loading">{t('Loading project detail…')}</div>
  return (
    <div className="pz-detail">
      <div className="pz-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`pz-tab ${tab === t.id ? 'pz-tab-active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label} <span className="pz-tab-count">{t.count}</span>
          </button>
        ))}
      </div>
      <div className="pz-detail-body">
        {tab === 'readme' && (detail.readme ? <div className="pz-md">{renderBlocks(parseBlocks(detail.readme))}</div> : <p className="pz-empty">{t('No README found.')}</p>)}
        {tab === 'source' && (detail.source?.length ? (
          <div className="pz-source-list">
            {detail.source.map(f => (
              <details key={f.name} className="pz-source" open={detail.source.length === 1}>
                <summary className="pz-source-summary">{f.name}</summary>
                <pre className="pz-pre">{f.content || '// (empty or binary file)'}</pre>
              </details>
            ))}
          </div>
        ) : <p className="pz-empty">{t('No source files detected.')}</p>)}
        {tab === 'tree' && (detail.tree?.length ? <pre className="pz-pre pz-tree">{detail.tree.join('\n')}</pre> : <p className="pz-empty">{t('Empty folder.')}</p>)}
        {tab === 'images' && (detail.images?.length ? (
          <div className="pz-images">
            {detail.images.map(img => (
              <figure key={img.name} className="pz-fig">
                <img src={fileUrl(project.path, img.name)} alt={img.name} loading="lazy" />
                <figcaption>{img.name}</figcaption>
              </figure>
            ))}
          </div>
        ) : <p className="pz-empty">{t('No images found.')}</p>)}
      </div>
    </div>
  )
}

export default function ProjectZoomView() {
  const { t } = useLang()
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [project, setProject] = useState(null)
  const [detail, setDetail] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/projects')
        const json = await res.json()
        if (cancelled) return
        setData(json)
        for (const g of json.groups) {
          const p = g.projects.find(x => x.id === id)
          if (p) {
            setProject(p)
            break
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!project) return
    let cancelled = false
    fetch(`/api/projects/detail?path=${encodeURIComponent(project.path)}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setDetail(d) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [project])

  if (error) return <div className="pz-page"><Link to="/projects" className="back-link">← {t('Back to All Projects')}</Link><p className="pz-error">⚠️ {error}</p></div>
  if (!project) return <div className="pz-page"><Link to="/projects" className="back-link">← {t('Back to All Projects')}</Link><p className="pz-empty">{t('Loading project…')}</p></div>

  return (
    <div className="pz-page">
      <Link to="/projects" className="back-link">← {t('Back to All Projects')}</Link>

      <div className="pz-hero">
        <div className="pz-hero-top">
          <h1>{project.title}</h1>
          {project.name !== project.title && <span className="pz-slug">{project.name}</span>}
        </div>
        <p className="pz-scope">{project.scope || t('— no description —')}</p>
        <div className="pz-stacks">
          {project.stacks.map(s => <span key={s} className={`pz-stack pz-stack-${STACK_COLORS[s] || 'unknown'}`}>{s}</span>)}
        </div>
        <div className="pz-path" title={project.path}>📍 {project.path}</div>
        {project.issues?.length > 0 && (
          <div className="pz-issues">
            <span className="pz-issues-title">⚠️ {project.issues.length} issue{project.issues.length > 1 ? 's' : ''} on this machine</span>
            <ul>{project.issues.map((iss, i) => <li key={i}>{iss}</li>)}</ul>
          </div>
        )}
      </div>

      <CrewPanel project={project} />

      <DetailTabs project={project} detail={detail} />
    </div>
  )
}
