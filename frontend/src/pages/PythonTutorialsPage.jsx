import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PYTHON_TUTORIALS } from '../data/pythonTutorialsData'
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: {
    background: '#161b22', borderRadius: 12, border: '1px solid #30363d', padding: 20,
    cursor: 'pointer', transition: 'all 0.2s ease', textDecoration: 'none', color: 'inherit',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  cardIcon: { fontSize: 28, marginBottom: 4 },
  cardName: { fontSize: 16, fontWeight: 700, color: '#f0f6fc' },
  cardDesc: { fontSize: 12, color: '#8b949e', lineHeight: 1.5 },
  cardTags: { display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto', paddingTop: 8 },
  tag: { padding: '2px 8px', borderRadius: 4, fontSize: 10, background: '#21262d', color: '#8b949e', border: '1px solid #30363d' },
  noResults: { textAlign: 'center', padding: 60, color: '#8b949e' },
}

const DIFFICULTY_COLORS = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#ef4444' }
const CATEGORIES = ['all', 'basics', 'data', 'web', 'ml', 'gui', 'testing', 'networking', 'tools']
const CAT_LABELS = { all: 'All', basics: 'Basics', data: 'Data Science', web: 'Web', ml: 'ML/AI', gui: 'GUI', testing: 'Testing', networking: 'Networking', tools: 'Tools' }

export default function PythonTutorialsPage() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    let list = PYTHON_TUTORIALS
    if (cat !== 'all') list = list.filter(t => t.category === cat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)))
    }
    return list
  }, [search, cat])

  return (
    <div style={s.page}>
      <Link to="/technologies" style={s.back}>← {t('Back to Technologies')}</Link>
      <div style={s.hero}>
        <h1 style={s.title}>🐍 {t('Python Technologies')}</h1>
        <p style={s.subtitle}>56 tutorials • ML, Django, Flask, Data Science & more</p>
        <div style={s.statsRow}>
          <div style={s.statItem}><div style={s.statNum}>56</div><div style={s.statLabel}>{t('Tutorials')}</div></div>
          <div style={s.statItem}><div style={s.statNum}>9</div><div style={s.statLabel}>{t('Categories')}</div></div>
          <div style={s.statItem}><div style={s.statNum}>3</div><div style={s.statLabel}>{t('Difficulty Levels')}</div></div>
        </div>
        <div style={s.controls}>
          <input style={s.searchInput} placeholder="Search Python tutorials..." value={search} onChange={e => setSearch(e.target.value)} />
          <FetchButton onFetch={() => { setSearch(''); setCat('all') }} label="Reset" />
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} style={s.filterBtn(cat === c)} onClick={() => setCat(c)}>{CAT_LABELS[c]}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={s.noResults}><div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div><h3>{t('No tutorials found')}</h3></div>
      ) : (
        <div style={s.grid}>
          {filtered.map(t => (
            <div key={t.id} style={s.card} onClick={() => navigate(`/python-tutorials/${t.id}`)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3776ab'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.transform = 'none' }}>
              <div style={s.cardIcon}>{t.icon}</div>
              <div style={s.cardName}>{t.name}</div>
              <div style={s.cardDesc}>{t.description}</div>
              <div style={s.cardTags}>
                <span style={{ ...s.tag, background: `${DIFFICULTY_COLORS[t.difficulty]}22`, color: DIFFICULTY_COLORS[t.difficulty], borderColor: `${DIFFICULTY_COLORS[t.difficulty]}44` }}>{t.difficulty}</span>
                {t.tags.slice(0, 3).map((tag, i) => <span key={i} style={s.tag}>{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
