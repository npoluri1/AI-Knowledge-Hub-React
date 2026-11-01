import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PYTHON_TUTORIALS } from '../data/pythonTutorialsData'
import { getUseCaseCodes } from '../data/useCaseCodes'
import { useLang } from '../i18n'

const s = {
  page: { minHeight: '100vh', background: '#0d1117', color: '#c9d1d9', padding: '24px', maxWidth: 1100, margin: '0 auto' },
  back: { color: '#58a6ff', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 },
  hero: { marginBottom: 32, padding: '24px 0', borderBottom: '1px solid #21262d' },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: '2rem', fontWeight: 800, color: '#f0f6fc', margin: '0 0 8px' },
  desc: { color: '#8b949e', fontSize: 15, lineHeight: 1.6, marginBottom: 16 },
  meta: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  badge: (color) => ({ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44` }),
  tag: { padding: '3px 10px', borderRadius: 4, fontSize: 11, background: '#21262d', color: '#8b949e', border: '1px solid #30363d' },
  nav: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  navBtn: (active) => ({
    padding: '8px 16px', borderRadius: 8, border: `1px solid ${active ? '#3776ab' : '#30363d'}`,
    background: active ? '#3776ab22' : '#161b22', color: active ? '#58a6ff' : '#8b949e',
    fontSize: 13, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
  }),
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#f0f6fc', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #21262d' },
  theory: { lineHeight: 1.8, color: '#c9d1d9', fontSize: 14 },
  theoryH3: { color: '#f0f6fc', fontSize: 16, fontWeight: 700, marginTop: 20, marginBottom: 8 },
  theoryP: { marginBottom: 12 },
  theoryUl: { paddingLeft: 20, marginBottom: 12 },
  theoryLi: { marginBottom: 4, lineHeight: 1.6 },
  codeBlock: { background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16, overflowX: 'auto', marginBottom: 16, position: 'relative' },
  codeLabel: { position: 'absolute', top: 8, right: 12, fontSize: 10, color: '#8b949e', background: '#21262d', padding: '2px 8px', borderRadius: 4 },
  code: { fontFamily: "'Fira Code', 'Consolas', monospace", fontSize: 13, lineHeight: 1.6, color: '#e6edf3', whiteSpace: 'pre', margin: 0 },
  useCaseCard: { background: '#161b22', border: '1px solid #30363d', borderRadius: 10, padding: 16, marginBottom: 12 },
  useCaseTitle: { fontWeight: 700, color: '#58a6ff', marginBottom: 6, fontSize: 14 },
  useCaseDesc: { fontSize: 13, color: '#8b949e', lineHeight: 1.6 },
  conceptGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 },
  conceptCard: { background: '#161b22', border: '1px solid #30363d', borderRadius: 10, padding: 16 },
  conceptTitle: { fontWeight: 700, color: '#f0f6fc', marginBottom: 6, fontSize: 14 },
  conceptDesc: { fontSize: 12, color: '#8b949e', lineHeight: 1.5 },
  prevNext: { display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 20, borderTop: '1px solid #21262d' },
  link: { color: '#58a6ff', textDecoration: 'none', fontSize: 14, fontWeight: 600 },
}

const DIFF_COLORS = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#ef4444' }

function UseCaseCode({ example }) {
  const { t } = useLang()
  const [expanded, setExpanded] = useState(false)
  const codeLines = example.code.split('\n').length
  
  return (
    <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f6fc' }}>{example.title}</div>
          <div style={{ fontSize: 11, color: '#8b949e' }}>{example.description}</div>
        </div>
        <span style={{ fontSize: 11, color: '#58a6ff', whiteSpace: 'nowrap' }}>
          {expanded ? `▲ ${t('Hide')}` : `▶ ${t('View')}`} ({codeLines} lines)
        </span>
      </div>
      {expanded && (
        <div style={{ padding: '0 12px 12px' }}>
          <pre style={{ fontFamily: "'Fira Code', Consolas, monospace", fontSize: 12, lineHeight: 1.5, color: '#e6edf3', whiteSpace: 'pre', margin: 0, overflowX: 'auto' }}>
            {example.code}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function PythonTutorialPage() {
  const { t } = useLang()
  const { tutorialId } = useParams()
  const tutorial = PYTHON_TUTORIALS.find(t => t.id === tutorialId)

  if (!tutorial) {
    return (
      <div style={s.page}>
        <Link to="/python-tutorials" style={s.back}>← {t('Back to Python Tutorials')}</Link>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ color: '#f0f6fc' }}>{t('Tutorial Not Found')}</h2>
          <p style={{ color: '#8b949e' }}>The tutorial "{tutorialId}" doesn't exist.</p>
        </div>
      </div>
    )
  }

  const idx = PYTHON_TUTORIALS.findIndex(t => t.id === tutorialId)
  const prev = idx > 0 ? PYTHON_TUTORIALS[idx - 1] : null
  const next = idx < PYTHON_TUTORIALS.length - 1 ? PYTHON_TUTORIALS[idx + 1] : null

  return (
    <div style={s.page}>
      <Link to="/python-tutorials" style={s.back}>← {t('Back to Python Tutorials')}</Link>

      <div style={s.hero}>
        <div style={s.icon}>{tutorial.icon}</div>
        <h1 style={s.title}>{tutorial.name}</h1>
        <p style={s.desc}>{tutorial.description}</p>
        <div style={s.meta}>
          <span style={s.badge(DIFF_COLORS[tutorial.difficulty])}>{tutorial.difficulty}</span>
          {tutorial.tags.map((tag, i) => <span key={i} style={s.tag}>{tag}</span>)}
        </div>
      </div>

      {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>📋 {t('Prerequisites')}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tutorial.prerequisites.map((p, i) => <span key={i} style={s.tag}>{p}</span>)}
          </div>
        </div>
      )}

      <div style={s.section}>
        <h2 style={s.sectionTitle}>📖 {t('Theory & Concepts')}</h2>
        <div style={s.theory}>
          {tutorial.theory.map((block, i) => {
            if (block.type === 'heading') return <h3 key={i} style={s.theoryH3}>{block.text}</h3>
            if (block.type === 'paragraph') return <p key={i} style={s.theoryP}>{block.text}</p>
            if (block.type === 'list') return (
              <ul key={i} style={s.theoryUl}>
                {block.items.map((item, j) => <li key={j} style={s.theoryLi}>{item}</li>)}
              </ul>
            )
            return null
          })}
        </div>
      </div>

      {tutorial.concepts && tutorial.concepts.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>🧩 {t('Key Concepts')}</h2>
          <div style={s.conceptGrid}>
            {tutorial.concepts.map((c, i) => (
              <div key={i} style={s.conceptCard}>
                <div style={s.conceptTitle}>{c.name}</div>
                <div style={s.conceptDesc}>{c.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tutorial.codeExamples && tutorial.codeExamples.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>💻 {t('Code Examples')}</h2>
          {tutorial.codeExamples.map((ex, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <h3 style={{ ...s.theoryH3, fontSize: 14, marginBottom: 8 }}>{ex.title}</h3>
              {ex.description && <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>{ex.description}</p>}
              <div style={s.codeBlock}>
                <span style={s.codeLabel}>{ex.language || 'python'}</span>
                <pre style={s.code}>{ex.code}</pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {tutorial.useCases && tutorial.useCases.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>🎯 {t('Use Cases')}</h2>
          {tutorial.useCases.map((uc, i) => {
            const codes = getUseCaseCodes(tutorial.id, uc.title)
            return (
              <div key={i} style={s.useCaseCard}>
                <div style={s.useCaseTitle}>{uc.title}</div>
                <div style={s.useCaseDesc}>{uc.description}</div>
                {codes.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#3fb950', marginBottom: 6 }}>
                      💻 {codes.length} Code Example{codes.length > 1 ? 's' : ''}
                    </div>
                    {codes.map((codeEx, j) => (
                      <UseCaseCode key={j} example={codeEx} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tutorial.bestPractices && tutorial.bestPractices.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>✅ {t('Best Practices')}</h2>
          <ul style={{ paddingLeft: 20 }}>
            {tutorial.bestPractices.map((bp, i) => <li key={i} style={{ marginBottom: 6, fontSize: 13, lineHeight: 1.6 }}>{bp}</li>)}
          </ul>
        </div>
      )}

      {tutorial.commonErrors && tutorial.commonErrors.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>⚠️ {t('Common Errors & Fixes')}</h2>
          {tutorial.commonErrors.map((err, i) => (
            <div key={i} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 14, marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: '#f85149', fontSize: 13, marginBottom: 4 }}>❌ {err.error}</div>
              <div style={{ fontSize: 13, color: '#3fb950' }}>✅ {err.fix}</div>
            </div>
          ))}
        </div>
      )}

      <div style={s.prevNext}>
        {prev ? <Link to={`/python-tutorials/${prev.id}`} style={s.link}>← {prev.name}</Link> : <div />}
        {next ? <Link to={`/python-tutorials/${next.id}`} style={s.link}>{next.name} →</Link> : <div />}
      </div>
    </div>
  )
}
