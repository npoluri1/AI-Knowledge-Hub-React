import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CHANNEL_CATEGORIES, CHANNELS, CHANNEL_STATS } from '../data/communicationChannelsData'
import FetchButton from '../components/FetchButton'
import CommunicationChannelDetail from '../components/CommunicationChannelDetail'
import { useLang } from '../i18n'
import './CommunicationChannelDetail.css'

const BG = '#0d1117'
const CARD = '#181825'
const BORDER = '#313244'
const TEXT = '#cdd6f4'
const MUTED = '#a6adc8'
const DIM = '#6c7086'

export default function CommunicationChannelsPage() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const gridCols = useGridCols()
  const statsCols = useStatsCols()

  const catMap = useMemo(() => {
    const m = {}
    CHANNEL_CATEGORIES.forEach(c => { m[c.id] = c })
    return m
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return CHANNELS.filter(ch => {
      const matchesCat = !activeCat || ch.category === activeCat
      if (!matchesCat) return false
      if (!q) return true
      return (
        ch.name.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        (ch.useCases || []).some(u => u.toLowerCase().includes(q)) ||
        (ch.industries || []).some(i => i.toLowerCase().includes(q))
      )
    })
  }, [search, activeCat])

  const grouped = useMemo(() => {
    const groups = {}
    CHANNEL_CATEGORIES.forEach(c => { groups[c.id] = [] })
    filtered.forEach(ch => {
      if (groups[ch.category]) groups[ch.category].push(ch)
    })
    return groups
  }, [filtered])

  const activeStats = useMemo(() => {
    if (!activeCat) return CHANNEL_STATS
    const list = CHANNELS.filter(ch => ch.category === activeCat)
    return {
      total: list.length,
      categories: 1,
      active: list.filter(c => c.status === 'active').length,
      countries: [...new Set(list.flatMap(c => c.countries))].length,
    }
  }, [activeCat])

  const page = {
    background: `radial-gradient(1200px 500px at 15% -10%, ${'#7C3AED'}22, transparent 60%),
                 radial-gradient(1000px 480px at 90% 0%, ${'#2D8CFF'}1f, transparent 55%),
                 linear-gradient(180deg, #0f1420 0%, ${BG} 40%)`,
  }

  return (
    <div style={pageContainer}>
      <div style={page}>
        <Link to="/" style={backLink}>← {t('Back to Home')}</Link>
        <Hero
          search={search}
          setSearch={setSearch}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          catMap={catMap}
          activeStats={activeStats}
          gridCols={gridCols}
          statsCols={statsCols}
        />
        <div style={body}>
          {activeCat ? (
            <SingleCategory
              cat={catMap[activeCat]}
              channels={grouped[activeCat] || []}
              expanded={expanded}
              setExpanded={setExpanded}
              gridCols={gridCols}
            />
          ) : (
            foundSections(grouped, catMap).map(cat => (
              <CategorySection
                key={cat.id}
                cat={catMap[cat.id]}
                channels={grouped[cat.id]}
                expanded={expanded}
                setExpanded={setExpanded}
                gridCols={gridCols}
              />
            ))
          )}

          {filtered.length === 0 && (
            <div style={emptyBox}>
              <div style={{ fontSize: 44 }}>🔍</div>
              <p style={emptyText}>
                No channels match{activeCat ? ' this category and' : ''} your search "{search}".
                Try different keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function foundSections(grouped) {
  return CHANNEL_CATEGORIES.filter(c => (grouped[c.id] || []).length > 0)
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    setMatches(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

function useGridCols() {
  const isDesktop = useMediaQuery('(min-width: 1100px)')
  const isTablet = useMediaQuery('(min-width: 768px)')
  if (isDesktop) return 'repeat(3, 1fr)'
  if (isTablet) return 'repeat(2, 1fr)'
  return '1fr'
}

function useStatsCols() {
  const isWide = useMediaQuery('(min-width: 768px)')
  if (isWide) return 'repeat(4, 1fr)'
  return 'repeat(2, 1fr)'
}

function Hero({ search, setSearch, activeCat, setActiveCat, catMap, activeStats, gridCols, statsCols }) {
  const { t } = useLang()
  return (
    <header style={hero}>
      <div style={heroTopRow}>
        <div>
          <div style={eyebrow}>
            <span style={eyebrowDot} />
            AI Knowledge Hub · Communication Ecosystem
          </div>
          <h1 style={title}>
            {t('Communication')} <span style={{ background: titleGrad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{t('Channels')}</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <FetchButton
            onFetch={() => { setSearch(''); setActiveCat(null) }}
            label={t('Reset View')}
          />
        </div>
      </div>
      <p style={subtitle}>
        Explore the {CHANNEL_STATS.total}+ communication channels powering modern connection —
        spanning {CHANNEL_STATS.categories} categories from global messaging giants to AI-native chat platforms.
      </p>

      <div style={{ ...statsRow, gridTemplateColumns: statsCols }}>
        <Stat label={t('Channels')} value={activeStats.total} icon="🛰️" accent="#2D8CFF" />
        <Stat label={t('Categories')} value={activeStats.categories} icon="🗂️" accent="#7C3AED" />
        <Stat label={t('Active')} value={activeStats.active} icon="🟢" accent="#1DB954" />
        <Stat label={t('Countries')} value={activeStats.countries} icon="🌍" accent="#E4405F" />
      </div>

      <SearchInput search={search} setSearch={setSearch} />

      <div style={pillsWrap}>
        <CategoryPill
          active={!activeCat}
          label={t('All')}
          icon="🌐"
          color="#2D8CFF"
          onClick={() => setActiveCat(null)}
          count={CHANNEL_STATS.total}
        />
        {CHANNEL_CATEGORIES.map(cat => (
          <CategoryPill
            key={cat.id}
            active={activeCat === cat.id}
            label={cat.name}
            icon={cat.icon}
            color={cat.color}
            onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
            count={CHANNELS.filter(ch => ch.category === cat.id).length}
          />
        ))}
      </div>
    </header>
  )
}

function Stat({ icon, value, label, accent }) {
  return (
    <div style={statCard}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
      </div>
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 14,
          background: `linear-gradient(135deg, ${accent}18, transparent 60%)`,
          zIndex: 0,
        }}
      />
    </div>
  )
}

function SearchInput({ search, setSearch }) {
  return (
    <div style={searchBox}>
      <span style={{ fontSize: 18, opacity: 0.8 }}>🔍</span>
      <input
        type="text"
        placeholder="Search by name, description, use case, or industry…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchInput}
      />
      {search && (
        <button style={searchClear} onClick={() => setSearch('')}>✕</button>
      )}
    </div>
  )
}

function CategoryPill({ active, label, icon, color, onClick, count }) {  return (
    <button
      onClick={onClick}
      style={{
        ...pill,
        ...(active ? {
          background: `linear-gradient(135deg, ${color}33, ${color}18)`,
          borderColor: `${color}99`,
          boxShadow: `0 0 0 1px ${color}33, 0 8px 24px -10px ${color}66`,
          color: '#ffffff',
        } : {
          background: 'rgba(24,24,37,0.7)',
          borderColor: BORDER,
          color: MUTED,
        }),
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontWeight: active ? 700 : 600 }}>{label}</span>
      <span style={{ ...pillCount, ...(active ? { background: `${color}2b`, borderColor: `${color}55` } : {}) }}>
        {count}
      </span>
    </button>
  )
}

function CategorySection({ cat, channels, expanded, setExpanded, gridCols }) {
  if (!channels || channels.length === 0) return null
  return (
    <section style={{ ...categorySection, borderTop: `3px solid ${cat.color}` }}>
      <CategoryHeader cat={cat} count={channels.length} />
      <div style={{ ...grid, gridTemplateColumns: gridCols }}>
        {channels.map((ch, i) => (
          <ChannelCard
            key={`${cat.id}-${i}`}
            ch={ch}
            color={ch.color || cat.color}
            expanded={expanded === ch.name}
            setExpanded={setExpanded}
          />
        ))}
      </div>
    </section>
  )
}

function SingleCategory({ cat, channels, expanded, setExpanded, gridCols }) {
  return (
    <section style={{ ...categorySection, borderTop: `3px solid ${cat.color}`, boxShadow: `0 30px 80px -30px ${cat.color}22` }}>
      <CategoryHeader cat={cat} count={channels.length} />
      {channels.length > 0 ? (
        <div style={{ ...grid, gridTemplateColumns: gridCols }}>
          {channels.map((ch, i) => (
            <ChannelCard
              key={`${cat.id}-${i}`}
              ch={ch}
              color={ch.color || cat.color}
              expanded={expanded === ch.name}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      ) : (
        <div style={emptyBox}>
          <p style={emptyText}>No channels in this category match your search.</p>
        </div>
      )}
    </section>
  )
}

function CategoryHeader({ cat, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
      <div
        style={{
          width: 46, height: 46, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, background: `linear-gradient(135deg, ${cat.color}40, ${cat.color}18)`,
          border: `1px solid ${cat.color}55`, color: '#ffffff',
        }}
      >
        {cat.icon}
      </div>
      <div style={{ flex: 1, minWidth: 180 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
          {cat.name}
        </h2>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{cat.description}</div>
      </div>
      <span
        style={{
          fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999,
          background: `${cat.color}1a`, color: cat.color, border: `1px solid ${cat.color}40`,
          letterSpacing: '0.03em',
        }}
      >
        {count} {count === 1 ? 'channel' : 'channels'}
      </span>
    </div>
  )
}

function ChannelCard({ ch, color, expanded, setExpanded }) {
  const toggle = () => setExpanded(expanded ? null : ch.name)
  const statusColor = ch.status === 'active' ? '#1DB954' : '#f9a825'

  return (
    <div
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggle() }}
      style={{
        ...card,
        position: 'relative',
        background: `linear-gradient(160deg, ${CARD} 40%, #1b1b2e 100%)`,
        cursor: 'pointer',
        transform: expanded ? 'translateY(-4px)' : 'none',
        borderColor: expanded ? `${color}88` : BORDER,
        boxShadow: expanded ? `0 22px 50px -18px ${color}55` : '0 10px 30px -20px rgba(0,0,0,0.7)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = expanded ? 'translateY(-4px)' : 'translateY(-4px)'; e.currentTarget.style.borderColor = `${color}66` }}
      onMouseLeave={e => { e.currentTarget.style.transform = expanded ? 'translateY(-4px)' : 'none'; e.currentTarget.style.borderColor = expanded ? `${color}88` : BORDER }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}66)`, margin: -1, borderRadius: '12px 12px 0 0' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 18px 0' }}>
        <div
          style={{
            width: 52, height: 52, borderRadius: 14, fontSize: 26, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `radial-gradient(circle at 30% 25%, ${color}33, ${color}12)`,
            border: `1px solid ${color}44`,
          }}
        >
          {ch.icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>{ch.name}</h3>
            <span
              style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', padding: '2px 8px', borderRadius: 999,
                color: statusColor, background: `${statusColor}1a`, border: `1px solid ${statusColor}40`,
                textTransform: 'uppercase',
              }}
            >
              {ch.status}
            </span>
          </div>
          <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>
            {ch.users} users · Founded {ch.founded}
          </div>
        </div>
      </div>

      <p style={{ margin: '14px 18px 0', fontSize: 13, lineHeight: 1.55, color: MUTED }}>{ch.description}</p>

      <div style={{ padding: '14px 18px 18px' }}>
        <div style={sectionLabel}>Use cases</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(ch.useCases || []).slice(0, expanded ? ch.useCases.length : 3).map(u => (
            <span key={u} style={{ ...chip, color, background: `${color}12`, border: `1px solid ${color}33` }}>{u}</span>
          ))}
          {!expanded && ch.useCases.length > 3 && <span style={{ fontSize: 11, color: DIM, alignSelf: 'center' }}>+{ch.useCases.length - 3}</span>}
        </div>

        <div style={{ ...sectionLabel, marginTop: 12 }}>Industries</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {(ch.industries || []).slice(0, expanded ? ch.industries.length : 4).map(i => (
            <span key={i} style={tag}>{i}</span>
          ))}
        </div>

        <div style={{ ...sectionLabel, marginTop: 12 }}>Regions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {(ch.countries || []).map(c => (
            <span key={c} style={{ fontSize: 11, color: TEXT, background: '#11111b', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '2px 8px' }}>🌍 {c}</span>
          ))}
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: color, fontWeight: 700 }} className="cc-detail-toggle">
          {expanded ? '▲ Show less' : '▼ Show details'}
        </div>
        {expanded && <CommunicationChannelDetail channel={ch} color={color} />}
      </div>
    </div>
  )
}

const pageContainer = {
  minHeight: '100vh',
  background: BG,
  fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif",
  color: TEXT,
}

const body = {
  maxWidth: 1280,
  margin: '0 auto',
  padding: '0 24px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

const backLink = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  color: MUTED,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  padding: '8px 14px',
  borderRadius: 10,
  background: 'rgba(24,24,37,0.6)',
  border: `1px solid ${BORDER}`,
  transition: 'all .2s ease',
}

const hero = {
  maxWidth: 1280,
  margin: '0 auto',
  padding: '30px 24px 8px',
}

const heroTopRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 20,
  flexWrap: 'wrap',
}

const eyebrow = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#7fe0b0',
  marginBottom: 10,
}

const eyebrowDot = {
  width: 8, height: 8, borderRadius: '50%',
  background: '#1DB954',
  boxShadow: '0 0 12px #1DB954',
}

const title = {
  margin: 0,
  fontSize: 'clamp(34px, 5.5vw, 56px)',
  fontWeight: 900,
  letterSpacing: '-0.03em',
  color: '#ffffff',
  lineHeight: 1.05,
}

const titleGrad = 'linear-gradient(90deg, #2D8CFF, #7C3AED, #E4405F)'

const subtitle = {
  maxWidth: 760,
  margin: '16px 0 0',
  fontSize: 16,
  lineHeight: 1.6,
  color: MUTED,
}

const statsRow = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 14,
  marginTop: 26,
}

const statCard = {
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '16px 18px',
  borderRadius: 14,
  background: 'rgba(24,24,37,0.75)',
  border: `1px solid ${BORDER}`,
  backdropFilter: 'blur(10px)',
  zIndex: 1,
}

const searchBox = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginTop: 26,
  padding: '6px 16px',
  borderRadius: 14,
  background: 'rgba(24,24,37,0.75)',
  border: `1px solid ${BORDER}`,
  transition: 'border-color .2s ease, box-shadow .2s ease',
}

const searchInput = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: TEXT,
  fontSize: 15,
  padding: '10px 0',
  fontFamily: 'inherit',
}

const searchClear = {
  background: 'transparent',
  border: 'none',
  color: DIM,
  fontSize: 15,
  cursor: 'pointer',
  padding: 4,
}

const pillsWrap = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 18,
}

const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  padding: '8px 14px',
  borderRadius: 999,
  border: '1px solid',
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all .2s ease',
  fontFamily: 'inherit',
}

const pillCount = {
  fontSize: 11,
  fontWeight: 700,
  background: '#11111b',
  border: `1px solid ${BORDER}`,
  color: MUTED,
  padding: '1px 7px',
  borderRadius: 999,
}

const categorySection = {
  borderRadius: 20,
  background: `linear-gradient(180deg, ${CARD}, #151522)`,
  border: `1px solid ${BORDER}`,
  overflow: 'hidden',
  padding: '22px 22px 26px',
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 16,
}

const sectionLabel = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: DIM,
  marginBottom: 8,
}

const chip = {
  fontSize: 11,
  fontWeight: 600,
  padding: '3px 10px',
  borderRadius: 999,
}

const tag = {
  fontSize: 11,
  color: MUTED,
  background: '#11111b',
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '2px 8px',
}

const card = {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 14,
  border: '1px solid',
  overflow: 'hidden',
  transition: 'all .25s ease',
  fontFamily: 'inherit',
}

const emptyBox = {
  textAlign: 'center',
  padding: '60px 20px',
  borderRadius: 20,
  background: CARD,
  border: `1px solid ${BORDER}`,
}

const emptyText = {
  color: MUTED,
  fontSize: 15,
  marginTop: 12,
}
