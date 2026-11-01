import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TECHNOLOGY_CATEGORIES, getTotalTutorials, getTotalTechnologies } from '../data/technologiesData'
import TechnologyDetail from '../components/TechnologyDetail'
import '../pages/TechnologyDetail.css'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'

const s = {
  page: { minHeight: '100vh', background: '#0d1117', color: '#c9d1d9', padding: '24px', maxWidth: 1400, margin: '0 auto' },
  back: { color: '#58a6ff', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 },
  hero: { textAlign: 'center', marginBottom: 40, padding: '32px 0' },
  title: { fontSize: '2.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #58a6ff 0%, #bc8cff 50%, #f778ba 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px' },
  subtitle: { color: '#8b949e', fontSize: 18, marginBottom: 24 },
  statsRow: { display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 24, flexWrap: 'wrap' },
  statItem: { textAlign: 'center' },
  statNum: { fontSize: '1.8rem', fontWeight: 700, color: '#58a6ff' },
  statLabel: { fontSize: 13, color: '#8b949e', marginTop: 2 },
  searchBox: { position: 'relative', maxWidth: 500, margin: '0 auto' },
  searchInput: { width: '100%', padding: '12px 16px 12px 42px', borderRadius: 10, border: '1px solid #30363d', background: '#161b22', color: '#c9d1d9', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
  searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))', gap: 20, marginTop: 24 },
  card: (grad, isExpanded) => ({
    background: '#161b22',
    borderRadius: 14,
    border: `1px solid ${isExpanded ? '#58a6ff' : '#30363d'}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    transform: isExpanded ? 'none' : undefined,
  }),
  cardTop: (color) => ({
    background: `linear-gradient(135deg, ${color}22, ${color}08)`,
    padding: '20px 24px',
    borderBottom: `1px solid ${color}33`,
  }),
  cardHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 },
  cardIcon: (color) => ({ fontSize: 32, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: `${color}22` }),
  cardTitleArea: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: 700, color: '#f0f6fc' },
  cardDesc: { fontSize: 13, color: '#8b949e', marginTop: 2 },
  cardBadge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    color: '#f0f6fc',
    background: color,
  }),
  cardBody: { padding: '16px 24px' },
  exploreBtn: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 8,
    background: `${color}22`,
    color: color,
    border: `1px solid ${color}44`,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  expandedSection: { padding: '16px 24px', borderTop: '1px solid #30363d' },
  tutorialGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tutorialChip: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px',
    borderRadius: 6,
    background: '#21262d',
    border: '1px solid #30363d',
    fontSize: 12,
    color: '#c9d1d9',
    cursor: 'default',
    transition: 'all 0.15s',
  }),
  noResults: { textAlign: 'center', padding: 60, color: '#8b949e' },
  backToTop: { position: 'fixed', bottom: 24, right: 24, width: 44, height: 44, borderRadius: '50%', background: '#58a6ff', color: '#fff', border: 'none', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', zIndex: 100 },
}

export default function TechnologiesPage() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [expandedCat, setExpandedCat] = useState(null)
  const selectedCategory = TECHNOLOGY_CATEGORIES.find(cat => cat.id === expandedCat)
  const displayCategories = TECHNOLOGY_CATEGORIES.filter(cat => !['selected-reading', 'famous-monuments'].includes(cat.id))

  const totalTutorials = useMemo(() => getTotalTutorials(), [])
  const totalTechs = useMemo(() => getTotalTechnologies(), [])

  const filtered = useMemo(() => {
    if (!search.trim()) return displayCategories
    const q = search.toLowerCase()
    return displayCategories.filter(cat =>
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.tutorials.some(t => t.name.toLowerCase().includes(q))
    ).map(cat => ({
      ...cat,
      tutorials: cat.tutorials.filter(t =>
        t.name.toLowerCase().includes(q) ||
        cat.name.toLowerCase().includes(q)
      )
    }))
  }, [search])

  const handleFetch = () => {
    setSearch('')
    setExpandedCat(null)
  }

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← {t('Back to Home')}</Link>

      <div style={s.hero}>
        <h1 style={s.title}>{t('Technologies & Tutorials')}</h1>
        <p style={s.subtitle}>{displayCategories.length} categories • {totalTutorials.toLocaleString()} tutorials • {totalTechs.toLocaleString()} unique technologies</p>
        <div style={s.statsRow}>
          <div style={s.statItem}>
            <div style={s.statNum}>{displayCategories.length}</div>
            <div style={s.statLabel}>{t('Categories')}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statNum}>{totalTutorials.toLocaleString()}</div>
            <div style={s.statLabel}>{t('Tutorials')}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statNum}>{totalTechs.toLocaleString()}</div>
            <div style={s.statLabel}>{t('Technologies')}</div>
          </div>
        </div>
        <div style={s.searchBox}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Search technologies, tutorials, categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <FetchButton onFetch={handleFetch} label="Reset Filters" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={s.noResults}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3>{t('No matching categories found')}</h3>
          <p>{t('Try a different search term')}</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(cat => {
            const isExpanded = expandedCat === cat.id
            return (
              <div
                key={cat.id}
                style={s.card(cat.gradient, isExpanded)}
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
              >
                <div style={s.cardTop(cat.color)}>
                  <div style={s.cardHeader}>
                    <div style={s.cardIcon(cat.color)}>{cat.icon}</div>
                    <div style={s.cardTitleArea}>
                      <div style={s.cardName}>{cat.name}</div>
                      <div style={s.cardDesc}>{cat.description}</div>
                    </div>
                    <div style={s.cardBadge(cat.color)}>{cat.tutorialCount} Tutorials</div>
                  </div>
                </div>
                <div style={s.cardBody}>
                  <div style={s.exploreBtn(cat.color)}>
                    {isExpanded ? `${t('Collapse')} ↑` : `${t('Explore')} →`}
                  </div>
                </div>
                {isExpanded && (
                  <div style={s.expandedSection}>
                    <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 4 }}>
                      {cat.tutorials.length} technologies in this category:
                    </div>
                    <div style={s.tutorialGrid}>
                      {cat.tutorials.map((t, i) => (
                        <Link key={i} to={`/learning/${cat.id}/${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} onClick={event => event.stopPropagation()} style={{ ...s.tutorialChip(cat.color), textDecoration: 'none' }}>
                          <span>{t.icon}</span>
                          <span>{t.name}</span>
                          <span style={{ color: cat.color }}>→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {selectedCategory && <TechnologyDetail category={selectedCategory} onClose={() => setExpandedCat(null)} />}
    </div>
  )
}
