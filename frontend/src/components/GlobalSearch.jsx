import React, { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from './DesignLang'
import {
  FLAGSHIP_INDUSTRIES, ALL_INDUSTRIES, COUNTRIES, SECTORS, DESIGN_PATTERNS, TECH_FLOWS, slugify,
} from '../data/aiDesignSpace'

// Unified search across industries, countries, sectors, patterns, technologies.
function buildIndex() {
  const items = []
  FLAGSHIP_INDUSTRIES.forEach(f => items.push({ type: 'industry', label: f.name, icon: f.icon, sub: f.sectorName, to: `/design-space/${f.slug}`, hay: `${f.name} ${f.sectorName} ${f.tagline} ${f.summary}` }))
  ALL_INDUSTRIES.forEach(i => items.push({ type: 'industry', label: i.name, icon: '🏭', sub: i.sector, to: `/design-space/${slugify(i.name)}`, hay: `${i.name} ${i.sector}` }))
  COUNTRIES.forEach(c => items.push({ type: 'country', label: c.name, icon: '🌍', sub: c.region, to: `/design-space/country/${slugify(c.name)}`, hay: `${c.name} ${c.region} ${c.industries}` }))
  SECTORS.forEach(s => items.push({ type: 'sector', label: s.name, icon: s.icon, sub: 'Sector', to: `/design-space/sector/${s.id}`, hay: `${s.name} ${s.blurb}` }))
  DESIGN_PATTERNS.forEach(p => items.push({ type: 'pattern', label: p.name, icon: p.icon, sub: p.tag, to: `/design-space/pattern/${p.id}`, hay: `${p.name} ${p.tag} ${p.hld.map(l => l.title).join(' ')}` }))
  TECH_FLOWS.forEach(t => items.push({ type: 'technology', label: t.name, icon: t.icon, sub: t.tag, to: `/design-space/technology/${t.id}`, hay: `${t.name} ${t.tag} ${t.layman} ${t.role}` }))
  return items
}

const TYPE_LABELS = {
  industry: '🏭 Industry', country: '🌍 Country', sector: '🏗️ Sector',
  pattern: '🧩 Pattern', technology: '⚙️ Technology',
}

export default function GlobalSearch({ size = 'lg' }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const index = useMemo(buildIndex, [])

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (query.length < 2) return []
    const scored = index.map(item => {
      const hay = item.hay.toLowerCase()
      let score = 0
      if (hay.includes(query)) score = 10
      if (item.label.toLowerCase().startsWith(query)) score += 20
      if (item.label.toLowerCase().includes(query)) score += 12
      if (item.sub && item.sub.toLowerCase().includes(query)) score += 5
      return { item, score }
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score)
    const grouped = {}
    scored.slice(0, 40).forEach(r => {
      if (!grouped[r.item.type]) grouped[r.item.type] = []
      if (grouped[r.item.type].length < 5) grouped[r.item.type].push(r.item)
    })
    return Object.entries(grouped).map(([type, list]) => ({ type, list }))
  }, [q, index])

  const go = item => {
    setQ('')
    setOpen(false)
    navigate(item.to)
  }

  return (
    <div className={`ads-gsearch ${size}`} ref={boxRef}>
      <div className="ads-gsearch-bar">
        <span className="ads-gsearch-icon">🔎</span>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={t('searchEverything')}
          aria-label={t('searchEverything')}
        />
        {q && <button type="button" className="ads-gsearch-clear" onClick={() => { setQ(''); setOpen(false) }}>✕</button>}
      </div>
      {open && q.trim().length >= 2 && (
        <div className="ads-gsearch-drop">
          {results.length === 0 && <div className="ads-gsearch-empty">{t('showing')} 0 — try “banking”, “india”, “rag”, “fastapi”</div>}
          {results.map(group => (
            <div className="ads-gsearch-group" key={group.type}>
              <div className="ads-gsearch-group-label">{TYPE_LABELS[group.type]}</div>
              {group.list.map(item => (
                <button type="button" key={item.to} className="ads-gsearch-item" onMouseDown={() => go(item)}>
                  <span className="ads-gsearch-item-icon">{item.icon}</span>
                  <span className="ads-gsearch-item-meta">
                    <strong>{item.label}</strong>
                    <small>{item.sub}</small>
                  </span>
                  <span className="ads-gsearch-item-go">→</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
