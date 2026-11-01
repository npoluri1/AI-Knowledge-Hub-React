import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PYTHON_TECHNOLOGIES } from '../data/pythonTechnologiesData'
import { TECHNOLOGY_USE_CASES } from '../data/technologyUseCases'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'

const s = {
  page: { minHeight: '100vh', background: '#0d1117', color: '#c9d1d9', padding: '24px', maxWidth: 1400, margin: '0 auto' },
  back: { color: '#58a6ff', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 },
  hero: { textAlign: 'center', marginBottom: 32, padding: '24px 0' },
  title: { fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px' },
  subtitle: { color: '#8b949e', fontSize: 16, marginBottom: 20 },
  statsRow: { display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 20, flexWrap: 'wrap' },
  statItem: { textAlign: 'center' },
  statNum: { fontSize: '1.5rem', fontWeight: 700, color: '#3776ab' },
  statLabel: { fontSize: 12, color: '#8b949e' },
  controls: { display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' },
  searchInput: { padding: '10px 14px', borderRadius: 8, border: '1px solid #30363d', background: '#161b22', color: '#c9d1d9', fontSize: 14, width: 320, outline: 'none' },
  filterBtn: (active) => ({
    padding: '6px 14px', borderRadius: 20, border: `1px solid ${active ? '#3776ab' : '#30363d'}`,
    background: active ? '#3776ab22' : 'transparent', color: active ? '#58a6ff' : '#8b949e',
    fontSize: 12, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
  }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
  card: {
    background: '#161b22', borderRadius: 12, border: '1px solid #30363d',
    padding: 0, overflow: 'hidden', transition: 'all 0.2s ease',
  },
  cardHeader: { padding: '20px 20px 12px', borderBottom: '1px solid #21262d' },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardName: { fontSize: 18, fontWeight: 700, color: '#f0f6fc', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#8b949e', lineHeight: 1.5 },
  cardMeta: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  badge: (color) => ({ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: `${color}22`, color, border: `1px solid ${color}44` }),
  cardBody: { padding: '12px 20px 20px' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#58a6ff', marginBottom: 8, marginTop: 16 },
  tutorialItem: { padding: '10px 12px', background: '#0d1117', borderRadius: 8, marginBottom: 8, border: '1px solid #21262d', cursor: 'pointer', transition: 'all 0.15s' },
  tutorialTitle: { fontSize: 13, fontWeight: 600, color: '#f0f6fc', marginBottom: 4 },
  tutorialWhy: { fontSize: 11, color: '#8b949e', lineHeight: 1.4 },
  useCaseItem: { padding: '8px 12px', background: '#1a2332', borderRadius: 6, marginBottom: 6, borderLeft: '3px solid #3776ab' },
  useCaseTitle: { fontSize: 12, fontWeight: 600, color: '#58a6ff', marginBottom: 2 },
  useCaseDesc: { fontSize: 11, color: '#8b949e', lineHeight: 1.4 },
  codeBlock: { background: '#0d1117', border: '1px solid #21262d', borderRadius: 8, padding: 12, marginTop: 8, overflowX: 'auto' },
  code: { fontFamily: "'Fira Code', Consolas, monospace", fontSize: 11, lineHeight: 1.5, color: '#e6edf3', whiteSpace: 'pre', margin: 0 },
  expandBtn: { background: 'none', border: 'none', color: '#58a6ff', fontSize: 12, cursor: 'pointer', padding: '4px 0', fontWeight: 600 },
  noResults: { textAlign: 'center', padding: 60, color: '#8b949e' },
}

const DIFF_COLORS = { Beginner: '#22c55e', Intermediate: '#f59e0b', Advanced: '#ef4444' }
const CATEGORIES = ['all', ...new Set(PYTHON_TECHNOLOGIES.map(t => t.category))]

export default function PythonTechHubPage() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [expanded, setExpanded] = useState({})
  const [showCode, setShowCode] = useState({})

  const filtered = useMemo(() => {
    let list = PYTHON_TECHNOLOGIES
    if (cat !== 'all') list = list.filter(t => t.category === cat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [search, cat])

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleCode = (key) => setShowCode(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div style={s.page}>
      <Link to="/technologies" style={s.back}>← {t('Back to Technologies')}</Link>
      <div style={s.hero}>
        <h1 style={s.title}>🐍 {t('Python Technologies')}</h1>
        <p style={s.subtitle}>56 tutorials • ML, Django, Flask, Data Science & more</p>
        <div style={s.statsRow}>
          <div style={s.statItem}><div style={s.statNum}>56</div><div style={s.statLabel}>{t('Tutorials')}</div></div>
          <div style={s.statItem}><div style={s.statNum}>{PYTHON_TECHNOLOGIES.filter(t => TECHNOLOGY_USE_CASES[t.id]).length}</div><div style={s.statLabel}>{t('With Use Cases')}</div></div>
          <div style={s.statItem}><div style={s.statNum}>{PYTHON_TECHNOLOGIES.reduce((sum, t) => sum + t.tutorials.length, 0)}</div><div style={s.statLabel}>{t('Code Examples')}</div></div>
        </div>
        <div style={s.controls}>
          <input style={s.searchInput} placeholder="Search Python technologies..." value={search} onChange={e => setSearch(e.target.value)} />
          <FetchButton onFetch={() => { setSearch(''); setCat('all') }} label="Reset" />
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} style={s.filterBtn(cat === c)} onClick={() => setCat(c)}>
              {c === 'all' ? t('All') : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={s.noResults}><div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div><h3>{t('No tutorials found')}</h3></div>
      ) : (
        <div style={s.grid}>
          {filtered.map(tech => {
            const isExpanded = expanded[tech.id]
            const useCases = TECHNOLOGY_USE_CASES[tech.id] || []

            return (
              <div key={tech.id} style={s.card}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3776ab' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d' }}>
                
                <div style={s.cardHeader}>
                  <div style={s.cardIcon}>{tech.icon}</div>
                  <div style={s.cardName}>{tech.name}</div>
                  <div style={s.cardDesc}>{tech.description}</div>
                  <div style={s.cardMeta}>
                    <span style={s.badge(DIFF_COLORS[tech.difficulty] || '#8b949e')}>{tech.difficulty}</span>
                    <span style={s.badge('#3776ab')}>{tech.category}</span>
                    {useCases.length > 0 && <span style={s.badge('#22c55e')}>{useCases.length} Use Cases</span>}
                  </div>
                </div>

                <div style={s.cardBody}>
                  <button style={s.expandBtn} onClick={() => toggleExpand(tech.id)}>
                    {isExpanded ? `▲ ${t('Hide Details')}` : `▼ ${t('Show Details')}`}
                  </button>

                  {isExpanded && (
                    <>
                      {/* Tutorials */}
                      <div style={s.sectionTitle}>📖 {t('Tutorials')} ({tech.tutorials.length})</div>
                      {tech.tutorials.map((tut, i) => (
                        <div key={i} style={s.tutorialItem}>
                          <div style={s.tutorialTitle}>{tut.title}</div>
                          <div style={s.tutorialWhy}>{tut.why}</div>
                          <button style={s.expandBtn} onClick={() => toggleCode(`${tech.id}-${i}`)}>
                            {showCode[`${tech.id}-${i}`] ? t('Hide Code') : t('View Code')}
                          </button>
                          {showCode[`${tech.id}-${i}`] && (
                            <div style={s.codeBlock}>
                              <pre style={s.code}>{tut.code}</pre>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Use Cases */}
                      {useCases.length > 0 && (
                        <>
                          <div style={s.sectionTitle}>🎯 {t('Use Cases')} ({useCases.length})</div>
                          {useCases.map((uc, i) => (
                            <div key={i}>
                              <div style={s.useCaseItem}>
                                <div style={s.useCaseTitle}>{uc.title}</div>
                                <div style={s.useCaseDesc}>{uc.description}</div>
                              </div>
                              <button style={s.expandBtn} onClick={() => toggleCode(`uc-${tech.id}-${i}`)}>
                                {showCode[`uc-${tech.id}-${i}`] ? t('Hide Code') : t('View Code')}
                              </button>
                              {showCode[`uc-${tech.id}-${i}`] && (
                                <div style={s.codeBlock}>
                                  <pre style={s.code}>{uc.code}</pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
