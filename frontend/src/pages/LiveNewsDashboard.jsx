import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'
import './LiveNewsDashboard.css'

const CATEGORY_COLORS = {
  'Cloud AI Platforms': '#3b82f6',
  'Serverless ML': '#60a5fa',
  'Container Orchestration': '#2563eb',
  'GPU Infrastructure': '#1d4ed8',
  'Model Hubs': '#3b82f6',
  'Vector DB Cloud': '#0ea5e9',
  'API Gateways': '#8b5cf6',
  'Message Queues': '#a78bfa',
  'Streaming': '#7c3aed',
  'Data Lakes': '#2dd4bf',
  'Feature Stores': '#14b8a6',
  'Experiment Tracking': '#10b981',
  'CI/CD for ML': '#22c55e',
  'Monitoring': '#84cc16',
  'LLM APIs': '#f59e0b',
  'Embedding APIs': '#eab308',
  'Speech-to-Text': '#f97316',
  'Text-to-Speech': '#fb923c',
  'Image Generation': '#ef4444',
  'Video AI': '#f43f5e',
  'Search & RAG': '#ec4899',
  'Auth for AI': '#d946ef',
  'CDN & Edge AI': '#8b5cf6',
  'Databases': '#06b6d4',
  'Low-Code AI': '#64748b',
  'AI IDEs': '#10b981',
  'Prompt Management': '#f59e0b',
  'Evaluation': '#ef4444',
  'Cost Optimization': '#22c55e',
  'Compliance & Governance': '#3b82f6',
  'AI & ML News': '#3b82f6',
  'AI Agents': '#10b981',
  'Cybersecurity': '#ef4444',
  'Quantum Computing': '#6366f1',
  'Quantum AI': '#818cf8',
  'AGI & AI Futures': '#a855f7',
  'Robotics': '#f97316',
  'Space Technology': '#8b5cf6',
  'Healthcare AI': '#06b6d4',
  'Developer News': '#14b8a6',
  'Semiconductors': '#eab308',
  'Messaging/Integration': '#a855f7',
  'Cloud/DevOps': '#22d3ee',
  'Enterprise IT': '#64748b',
  'AI Policy/Governance': '#0891b2',
  'Newsletters': '#84cc16',
  'Podcasts': '#e11d48',
  'News Aggregators': '#f59e0b',
  'Country: USA': '#3b82f6',
  'Country: China': '#ef4444',
  'Country: UK': '#1d4ed8',
  'Country: EU': '#2563eb',
  'Country: India': '#f97316',
  'Country: Japan': '#ec4899',
  'Country: South Korea': '#8b5cf6',
  'Country: UAE': '#10b981',
  'Country: Israel': '#06b6d4',
  'Country: Canada': '#ef4444',
  'Country: Singapore': '#f59e0b',
}

// Backend returns `status` codes per failed source. Map them to user-friendly
// labels + icons so the dashboard surfaces 'dead feed' / 'cooling down' instead
// of raw HTTP error strings.
const STATUS_BADGES = {
  OK:            { icon: '✅', label: 'Healthy' },
  COOLING:       { icon: '⏸️', label: 'Cooling down (retry later)' },
  DEAD:          { icon: '☠️', label: 'Feed unavailable (404/403/410)' },
  DNS:           { icon: '🌐', label: 'DNS lookup failed' },
  TIMEOUT:       { icon: '⏱️', label: 'Request timed out' },
  RATE_LIMITED:  { icon: '🚦', label: 'Rate limited (429)' },
  NOT_XML:       { icon: '📄', label: 'URL returned non-XML' },
  NO_FEED:       { icon: '❓', label: 'No RSS feed exposed' },
  REDIRECT:      { icon: '↪️', label: 'Redirected (no feed)' },
  HEALTHY:       { icon: '✅', label: 'Healthy' },
  cooldown:      { icon: '⏸️', label: 'Cooling down (retry later)' },
  'feed-unavailable': { icon: '☠️', label: 'Feed unavailable (404/403/410)' },
  'no-dns':      { icon: '🌐', label: 'DNS lookup failed' },
  timeout:       { icon: '⏱️', label: 'Request timed out' },
  'rate-limited': { icon: '🚦', label: 'Rate limited (429)' },
  'not-xml':     { icon: '📄', label: 'URL returned non-XML' },
  'no-feed':     { icon: '❓', label: 'No RSS feed exposed' },
  redirect:      { icon: '↪️', label: 'Redirected (no feed)' },
}

const CATEGORY_ICONS = {
  'AI News by Country': '🌍',
  'World Tech News': '🗞️',
  'Cloud AI Platforms': '☁️',
  'Serverless ML': '⚡',
  'Container Orchestration': '📦',
  'GPU Infrastructure': '🖥️',
  'Model Hubs': '🧠',
  'Vector DB Cloud': '🗄️',
  'API Gateways': '🚪',
  'Message Queues': '📨',
  'Streaming': '📡',
  'Data Lakes': '🏞️',
  'Feature Stores': '🏷️',
  'Experiment Tracking': '📊',
  'CI/CD for ML': '🔄',
  'Monitoring': '📈',
  'LLM APIs': '🤖',
  'Embedding APIs': '🔢',
  'Speech-to-Text': '🎤',
  'Text-to-Speech': '🔊',
  'Image Generation': '🎨',
  'Video AI': '🎬',
  'Search & RAG': '🔍',
  'Auth for AI': '🔐',
  'CDN & Edge AI': '🌐',
  'Databases': '💾',
  'Low-Code AI': '🖱️',
  'AI IDEs': '💻',
  'Prompt Management': '✏️',
  'Evaluation': '✅',
  'Cost Optimization': '💰',
  'Compliance & Governance': '⚖️',
  'AI & ML News': '🧠',
  'AI Agents': '🤖',
  'Cybersecurity': '🔒',
  'Quantum Computing': '⚛️',
  'Quantum AI': '⚛️',
  'AGI & AI Futures': '🔮',
  'Robotics': '🦾',
  'Space Technology': '🚀',
  'Healthcare AI': '🏥',
  'Developer News': '💻',
  'Semiconductors': '🔧',
  'Messaging/Integration': '📨',
  'Cloud/DevOps': '☁️',
  'Enterprise IT': '🏢',
  'AI Policy/Governance': '⚖️',
  'Newsletters': '📧',
  'Podcasts': '🎙️',
  'News Aggregators': '📰',
  'Country: USA': '🇺🇸',
  'Country: China': '🇨🇳',
  'Country: UK': '🇬🇧',
  'Country: EU': '🇪🇺',
  'Country: India': '🇮🇳',
  'Country: Japan': '🇯🇵',
  'Country: South Korea': '🇰🇷',
  'Country: UAE': '🇦🇪',
  'Country: Israel': '🇮🇱',
  'Country: Canada': '🇨🇦',
  'Country: Singapore': '🇸🇬',
}

const COUNTRY_FLAGS = {
  'All': '🌍',
  'Global': '🌐',
  'USA': '🇺🇸',
  'China': '🇨🇳',
  'UK': '🇬🇧',
  'EU': '🇪🇺',
  'India': '🇮🇳',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'UAE': '🇦🇪',
  'Israel': '🇮🇱',
  'Canada': '🇨🇦',
  'Singapore': '🇸🇬',
  'Germany': '🇩🇪',
  'Switzerland': '🇨🇭',
  'Norway': '🇳🇴',
  'Taiwan': '🇹🇼',
  'South Africa': '🇿🇦',
  'Australia': '🇦🇺',
}

// Flags for any country name in the catalog: explicit overrides first, then a
// reverse lookup of English region names → ISO code → regional-indicator emoji.
const COUNTRY_ALIASES = { USA: 'US', UK: 'GB', UAE: 'AE', 'South Korea': 'KR', Czechia: 'CZ', Russia: 'RU', Vietnam: 'VN', Taiwan: 'TW', 'Hong Kong': 'HK', Turkey: 'TR' }
const REGION_CODE_BY_NAME = (() => {
  const map = {}
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' })
    for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b)
      try { const name = dn.of(code); if (name && name !== code) map[name] = code } catch { /* not a region */ }
    }
  } catch { /* Intl.DisplayNames unavailable */ }
  return map
})()
const flagFor = country => {
  if (COUNTRY_FLAGS[country]) return COUNTRY_FLAGS[country]
  if (country === 'Africa') return '🌍'
  const code = COUNTRY_ALIASES[country] || REGION_CODE_BY_NAME[country]
  return code ? code.replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0))) : '🏳️'
}
// Countries shown first in the tab strip; every other catalog country follows by source count.
const PINNED_COUNTRIES = ['All', 'Global', 'USA', 'China', 'UK', 'EU', 'India', 'Japan']

const TOC_BASE_CATEGORIES = [
  'AI News by Country', 'World Tech News', 'AI & ML News', 'Quantum AI', 'Quantum Computing', 'Semiconductors',
  'Robotics', 'AGI & AI Futures', 'AI Agents', 'Cybersecurity',
  'AI Policy/Governance', 'News Aggregators', 'Newsletters',
  'Cloud AI Platforms', 'Serverless ML', 'Container Orchestration',
  'GPU Infrastructure', 'Model Hubs', 'Vector DB Cloud',
  'API Gateways', 'Message Queues', 'Streaming',
  'Data Lakes', 'Feature Stores', 'Experiment Tracking',
  'CI/CD for ML', 'Monitoring', 'LLM APIs',
  'Embedding APIs', 'Speech-to-Text', 'Text-to-Speech',
  'Image Generation', 'Video AI', 'Search & RAG',
  'Auth for AI', 'CDN & Edge AI', 'Databases',
  'Low-Code AI', 'AI IDEs', 'Prompt Management',
  'Evaluation', 'Cost Optimization', 'Compliance & Governance',
]

const QUICK_PRESETS = [
  { label: '🌍 World AI sweep', categories: ['AI News by Country'] },
  { label: '🗞️ World tech press', categories: ['World Tech News'] },
  { label: '⚛️ Quantum', categories: ['Quantum AI', 'Quantum Computing'] },
  { label: '🔧 Chips & Semis', categories: ['Semiconductors'] },
  { label: '🤖 Robotics', categories: ['Robotics'] },
  { label: '🔮 AGI & Future', categories: ['AGI & AI Futures'] },
  { label: '🧠 AI News', categories: ['AI & ML News'] },
  { label: '🗺️ World Tech', categories: ['News Aggregators', 'Developer News'] },
]

const FEATURED_TOPICS = [
  { label: 'All Topics', category: 'All' },
  { label: '🧠 Latest AI', category: 'AI & ML News' },
  { label: '⚛️ Quantum AI', category: 'Quantum AI' },
  { label: '🧮 Quantum Computing', category: 'Quantum Computing' },
  { label: '🔧 Chips & Semis', category: 'Semiconductors' },
  { label: '🤖 Robotics', category: 'Robotics' },
  { label: '🔮 AGI & Future', category: 'AGI & AI Futures' },
  { label: '🦾 AI Agents', category: 'AI Agents' },
  { label: '🔒 Cybersecurity', category: 'Cybersecurity' },
  { label: '📰 Aggregators', category: 'News Aggregators' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr.slice(0, 25)
    const now = new Date()
    const diffMs = now - d
    const diffHrs = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffHrs < 1) return 'Just now'
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  } catch {
    return dateStr.slice(0, 25)
  }
}

function isLowQualityEntry(item) {
  if (!item) return true
  const t = (item.title || '').trim()
  if (!t || t.length < 4) return true
  if (!item.url) return true
  const lower = t.toLowerCase()
  if (lower.split(' ').length <= 1 && !lower.includes('ai') && !lower.includes('ml') && !lower.includes('llm')) return true
  if (/^(by |author|posted |published )/.test(lower)) return true
  if (/^(click|read more|learn more|see all|view all|home|index|about|contact|privacy|terms|faq|help|login|sign up|subscribe)$/i.test(t)) return true
  return false
}

function shade(hex, amt) {
  if (!hex || !hex.startsWith('#')) hex = '#60a5fa'
  const c = hex.replace('#', '')
  const full = c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c
  const n = parseInt(full, 16)
  let r = (n >> 16) & 255
  let g = (n >> 8) & 255
  let b = n & 255
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  r = Math.round((t - r) * p + r)
  g = Math.round((t - g) * p + g)
  b = Math.round((t - b) * p + b)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function ArticleCover({ image, category, sourceName }) {
  const [failed, setFailed] = useState(false)
  const base = CATEGORY_COLORS[category] || '#60a5fa'
  const style = {
    '--cov1': shade(base, -0.55),
    '--cov2': shade(base, 0.18),
    '--cov3': shade(base, -0.78),
  }
  return (
    <div className="lnd-article-cover" style={style}>
      {image && !failed ? (
        <img
          className="lnd-article-cover-img"
          src={image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="lnd-article-cover-emoji" aria-hidden="true">
          {CATEGORY_ICONS[category] || '🤖'}
        </span>
      )}
      <span className="lnd-article-cover-shade" />
      <span className="lnd-article-cover-chip">
        {CATEGORY_ICONS[category] || '📰'} {sourceName}
      </span>
    </div>
  )
}

export default function LiveNewsDashboard() {
  const { t } = useLang();
  const [sources, setSources] = useState([])
  const [sourcesLoading, setSourcesLoading] = useState(true)
  const [selectedSources, setSelectedSources] = useState(new Set())
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchedAt, setFetchedAt] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [expandedSources, setExpandedSources] = useState(new Set())
  const [totalItems, setTotalItems] = useState(0)
  const [activeCountry, setActiveCountry] = useState('All')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTocItem, setActiveTocItem] = useState(null)
  const [fetchProgress, setFetchProgress] = useState(null) // { done, total, articles }
  const [showContributeModal, setShowContributeModal] = useState(false)
  const [contributeUrl, setContributeUrl] = useState('')
  const [contributeMessage, setContributeMessage] = useState('')
  const resultsContainerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setSourcesLoading(true)
    ;(async () => {
      // 1) Try the live FastAPI backend first (has status/cooldown info for
      //    individual feeds: COOLING, DEAD, RATE_LIMITED, etc.).
      try {
        const r = await fetch('/api/news/sources')
        if (r.ok) {
          const data = await r.json()
          if (cancelled) return
          setSources(data.sources || [])
          return
        }
      } catch (_e) { /* fall through to static fallback */ }

      // 2) Fall back to the static snapshot shipped with the build, so the
      //    dashboard is browseable when running only the frontend (no FastAPI
      //    backend on :9000). Sources here won't have live COOLING/DEAD
      //    status badges — those still require the live /api/news/sources
      //    response — but the catalog is complete.
      try {
        const r = await fetch('/data/ai_news_sources.json')
        if (r.ok) {
          const data = await r.json()
          if (cancelled) return
          setSources(data.sources || [])
          return
        }
      } catch (_e) { /* fall through to empty state */ }

      // 3) No catalog available — leave sources empty so the UI renders its
      //    empty-state copy.
      if (!cancelled) setSources([])
    })().finally(() => { if (!cancelled) setSourcesLoading(false) })
    return () => { cancelled = true }
  }, [])

  const scrollToSection = useCallback((category) => {
    setActiveCategory(category)
    setActiveTocItem(category)
    const sectionId = `lnd-section-${category.replace(/[^a-zA-Z0-9]/g, '-')}`
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    if (!resultsContainerRef.current) return
    const container = resultsContainerRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cat = entry.target.getAttribute('data-category')
            if (cat) setActiveTocItem(cat)
          }
        })
      },
      { root: container, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    const sections = container.querySelectorAll('[data-category]')
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [results])

  const tocItems = useMemo(() => {
    const resultCounts = {}
    results.forEach(r => {
      const src = sources.find(s => s.key === r.key)
      if (src) {
        const cat = src.category || 'Other'
        const quality = r.items?.filter(i => !isLowQualityEntry(i)).length || 0
        resultCounts[cat] = (resultCounts[cat] || 0) + quality
      }
    })
    // Prefer a stable curated ordering, then append any other categories that
    // surfaced in the results (Quantum, AGI, Robotics, Semiconductors, etc.)
    const extras = Object.keys(resultCounts)
      .filter(cat => !TOC_BASE_CATEGORIES.includes(cat))
      .sort()
    const ordered = [...TOC_BASE_CATEGORIES, ...extras]
    return ordered
      .filter(name => resultCounts[name] > 0)
      .map(name => ({ name, count: resultCounts[name] || 0 }))
  }, [results, sources])

  const activeTocItems = useMemo(
    () => tocItems.filter(item => item.count > 0),
    [tocItems]
  )

  const groupedResults = useMemo(() => {
    const groups = {}
    results.forEach(r => {
      const src = sources.find(s => s.key === r.key)
      const cat = src?.category || 'Other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(r)
    })
    return groups
  }, [results, sources])

  // Derived data (declare BEFORE any handler that closes over it, to avoid TDZ on first render)
  const sourceCountsByCountry = useMemo(() => {
    const counts = { All: sources.length }
    sources.forEach(s => {
      const country = s.country || 'Global'
      counts[country] = (counts[country] || 0) + 1
    })
    return counts
  }, [sources])

  const countryList = useMemo(() => {
    const rest = Object.keys(sourceCountsByCountry)
      .filter(c => !PINNED_COUNTRIES.includes(c))
      .sort((a, b) => (sourceCountsByCountry[b] - sourceCountsByCountry[a]) || a.localeCompare(b))
    return [...PINNED_COUNTRIES.filter(c => c === 'All' || sourceCountsByCountry[c]), ...rest]
  }, [sourceCountsByCountry])

  const heroStats = useMemo(() => {
    const countries = new Set(sources.map(s => s.country || 'Global'))
    const categories = new Set(sources.map(s => s.category || 'Other'))
    const rss = sources.filter(s => s.feedType === 'rss' || s.hasRss).length
    return {
      countries: countries.size,
      categories: categories.size,
      rss,
      scraped: sources.length - rss,
    }
  }, [sources])

  const visibleSources = useMemo(() => {
    return sources.filter(s => {
      if (activeCountry !== 'All') {
        const srcCountry = s.country || 'Global'
        if (srcCountry !== activeCountry) return false
      }
      if (activeCategory !== 'All' && s.category !== activeCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return s.name.toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q)
      }
      return true
    })
  }, [sources, activeCountry, activeCategory, searchQuery])

  // All sources are now fetchable via our multi-strategy fallback chain
  // (RSS → sitemap → HTML scraping). Track which use RSS vs scraping.
  const fetchableVisibleCount = useMemo(
    () => visibleSources.filter(s => s.isFetchable !== false).length,
    [visibleSources]
  )
  const scrapedCount = useMemo(
    () => visibleSources.filter(s => s.feedType === 'scraped').length,
    [visibleSources]
  )
  const rssCount = useMemo(
    () => visibleSources.filter(s => s.feedType === 'rss').length,
    [visibleSources]
  )
  const rssTooltip = 'This source provides an RSS/Atom feed for structured fetching.'
  const scrapedTooltip = 'This source has no RSS feed — articles are extracted via sitemap or HTML scraping.'

  const toggleSource = useCallback((key) => {
    setSelectedSources(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const selectAllVisible = useCallback(() => {
    setSelectedSources(prev => {
      const next = new Set(prev)
      // All sources are now selectable — they all support fetching via our
      // multi-strategy fallback chain (RSS → sitemap → HTML scraping).
      visibleSources.forEach(s => { if (s.isFetchable !== false) next.add(s.key) })
      return next
    })
  }, [visibleSources])

  const deselectAll = useCallback(() => {
    setSelectedSources(new Set())
  }, [])

  // Client-side RSS fetcher: used as fallback when FastAPI backend is not running.
  // Fetches RSS feeds through public CORS proxies and parses XML in the browser.
  // Public proxies are unreliable, so we try several in order (fastest/most
  // reliable first) and move on quickly when one fails.
  const CORS_PROXIES = [
    url => `https://cors.eu.org/${url}`,
    url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  ]

  const unwrapProxyResponse = (text) => {
    const s = text.trim()
    if (s.startsWith('{')) {
      try {
        const parsed = JSON.parse(s)
        if (typeof parsed.contents === 'string') return parsed.contents
      } catch { /* not JSON — treat as raw feed text */ }
    }
    return text
  }

  const parseRssItems = (xmlText, limit = 10) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'text/xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) throw new Error('Invalid RSS XML')
    const items = doc.querySelectorAll('item, entry')
    return Array.from(items).slice(0, limit).map(item => {
      const title = item.querySelector('title')?.textContent?.trim() || ''
      const link = item.querySelector('link')?.getAttribute('href')
        || item.querySelector('link')?.textContent?.trim()
        || item.querySelector('id')?.textContent?.trim()
        || ''
      const pubDate = item.querySelector('pubDate, published, updated, date')?.textContent?.trim() || ''
      const description = item.querySelector('description, summary, content')?.textContent?.trim() || ''

      let image = ''
      const enc = item.querySelector('enclosure')
      if (enc && (enc.getAttribute('type') || '').startsWith('image') && enc.getAttribute('url')) {
        image = enc.getAttribute('url')
      }
      if (!image) {
        const mediaThumb = item.querySelector('thumbnail[url]')
        if (mediaThumb) image = mediaThumb.getAttribute('url')
      }
      if (!image) {
        const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i)
        if (imgMatch) image = imgMatch[1]
      }

      // Strip HTML tags then decode entities (e.g. &#8217; -> ')
      const stripped = description.replace(/<[^>]+>/g, '')
      const snippet = stripped.replace(/&#?\w+;/g, match => {
        const el = document.createElement('span')
        el.innerHTML = match
        return el.textContent
      }).slice(0, 200)
      return { title, url: link, date: pubDate, snippet, image }
    }).filter(item => item.title && item.url)
  }

  const fetchRssClientSide = async (selectedKeys, limit = 10) => {
    const keys = Array.isArray(selectedKeys)
      ? selectedKeys
      : (selectedKeys instanceof Set
          ? Array.from(selectedKeys)
          : (typeof selectedKeys === 'string' ? selectedKeys.split(',').map(s => s.trim()).filter(Boolean) : []))
    const selectedSrcs = keys
      .map(k => sources.find(s => s.key === k))
      .filter(s => s && (s.rss || s.hasRss || s.feedType === 'rss'))
    if (selectedSrcs.length === 0) {
      return { results: [], error: 'No sources with RSS feeds selected. Select sources that have RSS feeds enabled (green dot).' }
    }
    const results = []
    const errors = []
    // Fetch up to 20 feeds concurrently for speed
    const batches = []
    for (let i = 0; i < selectedSrcs.length; i += 20) {
      batches.push(selectedSrcs.slice(i, i + 20))
    }
    for (const batch of batches) {
      const promises = batch.map(async (src) => {
        let lastErr = null
        const rssUrl = src.rss || src.url
        for (const proxyFn of CORS_PROXIES) {
          try {
            const proxyUrl = proxyFn(rssUrl)
            const controller = new AbortController()
            const tid = setTimeout(() => controller.abort(), 20000)
            const res = await fetch(proxyUrl, { signal: controller.signal })
            clearTimeout(tid)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const text = unwrapProxyResponse(await res.text())
            const items = parseRssItems(text, limit)
            return { key: src.key, name: src.name, items, feedType: 'rss', status: 'OK' }
          } catch (e) {
            lastErr = e
          }
        }
        return { key: src.key, name: src.name, items: [], error: lastErr?.message || 'Failed to fetch', status: 'ERROR' }
      })
      const batchResults = await Promise.all(promises)
      results.push(...batchResults)
      // Update UI progressively
      setResults([...results])
      setTotalItems(results.reduce((sum, r) => sum + (r.items?.length || 0), 0))
    }
    const errCount = results.filter(r => r.error).length
    const error = errCount > 0
      ? `${errCount} of ${results.length} sources failed (CORS or network issue). ${results.length - errCount} succeeded.`
      : null
    return { results, error }
  }

  // Client-side per-article image enrichment: for articles whose feed had no
  // image, fetch the article page and read its og:image tag (the publisher's
  // own thumbnail for that exact story). Runs silently in the background with
  // a small worker pool; proxy failures are ignored so the console stays clean.
  const enrichMissingImages = async (resultsArr) => {
    const jobs = []
    resultsArr.forEach(r => (r.items || []).forEach(it => {
      if (!it.image && /^https?:\/\//.test(it.url || '')) jobs.push(it)
    }))
    if (jobs.length === 0) return
    const proxyPool = CORS_PROXIES.slice(0, 3)
    const metaRe = /<meta[^>]+(?:property|name)=["'](?:og:image|og:image:url|og:image:secure_url|twitter:image|twitter:image:src)["'][^>]*>/gi
    const htmlImgRe = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi
    const queue = [...jobs]
    let done = 0
    const worker = async () => {
      while (queue.length) {
        const item = queue.shift()
        if (item.image) continue
        for (const proxyFn of proxyPool) {
          if (item.image) break
          try {
            const ctrl = new AbortController()
            const tid = setTimeout(() => ctrl.abort(), 7000)
            const res = await fetch(proxyFn(item.url), { signal: ctrl.signal })
            clearTimeout(tid)
            if (!res.ok) continue
            const html = await res.text()
            let img = ''
            const metas = html.match(metaRe) || []
            for (const m of metas) {
              const c = m.match(/content=["']([^"']+)["']/i)
              if (c && /^https?:\/\//.test(c[1])) { img = c[1]; break }
            }
            if (!img) {
              const src = html.match(htmlImgRe)
              if (src) img = src[1]
            }
            if (img) item.image = img
          } catch { /* proxy killed/slow — try next, keep console clean */ }
        }
        done += 1
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]).catch(() => {})
    setResults(prev => prev.map(r => ({ ...r })))
  }

  const fetchNews = useCallback(async (overrideKeys = null) => {
    // Normalize whatever came in to a flat array of source keys. Guards
    // against strings, Sets, and stray arguments (e.g. a React event object
    // passed by `onClick={fetchNews}`) so every selection path is safe.
    const normalizeKeys = (input, fallback) => {
      if (!input) return fallback
      if (Array.isArray(input)) return input
      if (input instanceof Set) return Array.from(input)
      if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean)
      return fallback
    }
    const selectedKeys = normalizeKeys(overrideKeys, Array.from(selectedSources))
    if (!Array.isArray(selectedKeys) || selectedKeys.length === 0) return
    setLoading(true)
    setError(null)
    setResults([])
    // Fetch through the FastAPI backend in small parallel batches. The server
    // fetches feeds itself (no browser CORS), and batching means results stream
    // into the page as each batch lands instead of one long all-or-nothing call.
    // Public CORS proxies are only a last resort for batches the backend
    // cannot serve (backend down / unreachable).
    const BATCH = 12
    const CONCURRENCY = 4
    const batches = []
    for (let i = 0; i < selectedKeys.length; i += BATCH) batches.push(selectedKeys.slice(i, i + BATCH))
    const merged = []
    const needClientSide = []
    let progressDone = 0
    setFetchProgress({ done: 0, total: selectedKeys.length, articles: 0 })

    const publish = () => {
      const sorted = [...merged].sort((x, y) => (y.items?.length || 0) - (x.items?.length || 0))
      setResults(sorted)
      const articles = merged.reduce((sum, r) => sum + (r.items?.length || 0), 0)
      setTotalItems(articles)
      setFetchProgress({ done: progressDone, total: selectedKeys.length, articles })
    }

    const fetchBatch = async (keys) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        const ctrl = new AbortController()
        const tid = setTimeout(() => ctrl.abort(), 75000)
        try {
          const res = await fetch(`/api/news/fetch?sources=${encodeURIComponent(keys.join(','))}&limit=10`, { signal: ctrl.signal })
          clearTimeout(tid)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          if (data.error && !(data.results || []).length) throw new Error(data.error)
          return data.results || []
        } catch (_e) {
          clearTimeout(tid)
          if (attempt === 0) await new Promise(r => setTimeout(r, 800))
        }
      }
      return null
    }

    const queue = [...batches]
    const worker = async () => {
      while (queue.length) {
        const keys = queue.shift()
        const got = await fetchBatch(keys)
        if (got) {
          const seen = new Set(got.map(r => r.key))
          merged.push(...got)
          // Keys the server silently skipped still get a visible row.
          keys.filter(k => !seen.has(k)).forEach(k => {
            const src = sources.find(x => x.key === k)
            merged.push({ key: k, name: src?.name || k, items: [], status: 'ERROR', error: 'No response from source' })
          })
        } else {
          needClientSide.push(...keys)
        }
        progressDone += keys.length
        publish()
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, batches.length) }, worker))
    setFetchedAt(new Date().toLocaleTimeString())
    setExpandedSources(new Set(merged.filter(r => r.items?.length > 0).map(r => r.key)))

    if (needClientSide.length) {
      try {
        const { results: clientResults } = await fetchRssClientSide(needClientSide)
        merged.push(...clientResults)
        publish()
        setExpandedSources(new Set(merged.filter(r => r.items?.length > 0).map(r => r.key)))
        enrichMissingImages(merged)
      } catch (_e) { /* keep what we have */ }
    }

    // Plain-language summary instead of a generic "CORS" error.
    const failedRows = merged.filter(r => !(r.items?.length) && (r.error || (r.status && r.status !== 'OK')))
    if (failedRows.length) {
      const reasons = {}
      failedRows.forEach(r => {
        const raw = String(r.status && r.status !== 'ERROR' ? r.status : (r.error || 'unavailable'))
        const label = /RATE|429/i.test(raw) ? 'rate-limited (retry in a few minutes)'
          : /COOL/i.test(raw) ? 'cooling down after repeated failures'
          : /TIMEOUT|timed out/i.test(raw) ? 'timed out'
          : /403|FORBIDDEN|BLOCK/i.test(raw) ? 'blocked by the publisher'
          : /DEAD|404|NO_FEED|NOT_XML/i.test(raw) ? 'feed moved or removed'
          : 'temporarily unavailable'
        reasons[label] = (reasons[label] || 0) + 1
      })
      const ok = merged.length - failedRows.length
      setError(`${ok} of ${merged.length} sources delivered news. Skipped: ` +
        Object.entries(reasons).map(([k, v]) => `${v} ${k}`).join(' · ') +
        (needClientSide.length ? ' — backend unreachable for some batches, used browser fallback.' : ''))
    }
    setFetchProgress(null)
    setLoading(false)
  }, [selectedSources, sources])

  const quickFetch = useCallback(async (cats) => {
    const keys = sources
      .filter(s => cats.includes(s.category) && s.isFetchable !== false)
      .map(s => s.key)
    if (keys.length === 0) return
    setSelectedSources(new Set(keys))
    setActiveCategory('All')
    await fetchNews(keys)
  }, [sources, fetchNews])

  const toggleExpand = useCallback((key) => {
    setExpandedSources(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const collapseAll = useCallback(() => {
    setExpandedSources(new Set())
  }, [])

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const src = sources.find(s => s.key === r.key)
      if (activeCountry !== 'All') {
        const srcCountry = src?.country || 'Global'
        if (srcCountry !== activeCountry) return false
      }
      if (activeCategory !== 'All' && src?.category !== activeCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchName = r.name.toLowerCase().includes(q)
        const matchItems = r.items?.some(i =>
          i.title?.toLowerCase().includes(q) || i.snippet?.toLowerCase().includes(q)
        )
        return matchName || matchItems
      }
      return true
    })
  }, [results, sources, activeCountry, activeCategory, searchQuery])

  const expandAll = useCallback(() => {
    setExpandedSources(new Set(filteredResults.filter(r => r.items?.some(i => !isLowQualityEntry(i))).map(r => r.key)))
  }, [filteredResults])

  const stats = useMemo(() => {
    let sourcesWithResults = 0
    let sourcesWithErrors = 0
    let sourcesWithNoData = 0
    let qualityArticles = 0
    filteredResults.forEach(r => {
      if (r.error) sourcesWithErrors++
      else if (r.items && r.items.length > 0) {
        const quality = r.items.filter(i => !isLowQualityEntry(i)).length
        if (quality > 0) {
          sourcesWithResults++
          qualityArticles += quality
        } else {
          sourcesWithNoData++
        }
      } else sourcesWithNoData++
    })
    return {
      totalArticles: qualityArticles,
      sourcesWithResults,
      sourcesWithErrors,
      sourcesWithNoData,
    }
  }, [filteredResults])

  return (
    <div className="lnd-root">
      <div className="lnd-back-container">
        <Link to="/" className="lnd-back-link">← {t('Back to Home')}</Link>
      </div>

      <div className="lnd-header">
        <div className="lnd-header-top">
          <div>
            <div className="page-header-row">
              <div className="lnd-title-wrap">
                <h1 className="lnd-title">{t('📡 Live AI News Dashboard')}</h1>
                <span className="lnd-live-pill"><span className="lnd-live-dot" />{t('LIVE')}</span>
              </div>
              <FetchButton onFetch={async () => {
              if (selectedSources.size === 0) return 'Select news sources, then press Fetch again'
              await fetchNews()
              return 'News refreshed from live RSS feeds'
            }} label={t('Fetch Latest')} />
            </div>
            <p className="lnd-subtitle">
              Fetch real-time news from {sources.length} AI sources across {heroStats.countries} countries.
              Track {heroStats.categories} topics — AI, Quantum (incl. Quantum AI), Robotics, AGI, Semiconductors &amp; chips, and more.
            </p>
            <div className="lnd-hero-stats">
              <div className="lnd-hero-stat">
                <span className="lnd-hero-stat-value">{sources.length}</span>
                <span className="lnd-hero-stat-label">{t('Sources')}</span>
              </div>
              <div className="lnd-hero-stat">
                <span className="lnd-hero-stat-value">{heroStats.countries}</span>
                <span className="lnd-hero-stat-label">{t('Countries')}</span>
              </div>
              <div className="lnd-hero-stat">
                <span className="lnd-hero-stat-value">{heroStats.categories}</span>
                <span className="lnd-hero-stat-label">{t('Topics')}</span>
              </div>
              <div className="lnd-hero-stat">
                <span className="lnd-hero-stat-value lnd-hero-stat-green">{heroStats.rss}</span>
                <span className="lnd-hero-stat-label">{t('RSS')}</span>
              </div>
              <div className="lnd-hero-stat">
                <span className="lnd-hero-stat-value lnd-hero-stat-amber">{heroStats.scraped}</span>
                <span className="lnd-hero-stat-label">{t('Scraped')}</span>
              </div>
            </div>
          </div>
          <div className="lnd-search-container">
            <span className="lnd-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search sources or articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="lnd-search-input"
            />
            {searchQuery && (
              <button className="lnd-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="lnd-topic-tabs-container">
        <div className="lnd-topic-tabs">
          {FEATURED_TOPICS.map(topic => {
            const isActive = activeCategory === topic.category
            const color = topic.category === 'All'
              ? '#60a5fa'
              : (CATEGORY_COLORS[topic.category] || '#60a5fa')
            return (
              <button
                key={topic.label}
                className={`lnd-topic-tab ${isActive ? 'lnd-active' : ''}`}
                style={isActive ? undefined : { '--lnd-topic-accent': color }}
                onClick={() => setActiveCategory(topic.category)}
              >
                <span>{topic.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="lnd-country-tabs-container">
        <div className="lnd-country-head">
          <span>🌍 {countryList.length - 1} countries &amp; regions</span>
          {activeCountry !== 'All' && (
            <button
              type="button"
              className="lnd-country-fetch"
              disabled={loading}
              onClick={() => {
                const keys = sources.filter(x => (x.country || 'Global') === activeCountry).map(x => x.key)
                setSelectedSources(new Set(keys))
                fetchNews(keys)
              }}
            >
              ⚡ Fetch all {sourceCountsByCountry[activeCountry] || 0} {flagFor(activeCountry)} {activeCountry} sources
            </button>
          )}
        </div>
        <div className="lnd-country-tabs">
          {countryList.map(country => {
            const count = sourceCountsByCountry[country] || 0
            const isActive = activeCountry === country
            return (
              <button
                key={country}
                className={`lnd-country-tab ${isActive ? 'lnd-active' : ''}`}
                onClick={() => setActiveCountry(country)}
              >
                <span className="lnd-country-tab-flag">{country === 'All' ? '🌍' : flagFor(country)}</span>
                <span>{country}</span>
                <span className="lnd-country-tab-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="lnd-main-layout">
        <aside className={`lnd-sidebar ${activeTocItems.length === 0 ? 'lnd-sidebar-collapsed' : ''}`}>
          <div className="lnd-sidebar-header">
            <h3 className="lnd-sidebar-title">📑 Table of Contents</h3>
          </div>
          {activeTocItems.length > 0 && (
            <div className="lnd-sidebar-scrollable">
              {activeTocItems.map(item => {
                const isActive = activeTocItem === item.name
                const color = CATEGORY_COLORS[item.name] || '#64748b'
                return (
                  <button
                    key={item.name}
                    className={`lnd-toc-item ${isActive ? 'lnd-active' : ''}`}
                    style={isActive ? { borderLeftColor: color } : undefined}
                    onClick={() => scrollToSection(item.name)}
                  >
                    <span className="lnd-toc-icon">{CATEGORY_ICONS[item.name] || '📁'}</span>
                    <span className="lnd-toc-label">{item.name}</span>
                    <span
                      className="lnd-toc-badge"
                      style={isActive ? { background: color, color: '#fff' } : undefined}
                    >
                      {item.count}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </aside>

        <div className="lnd-main-content">
          <section className="lnd-source-section">
            <div className="lnd-source-section-header">
              <div>
                <h3 className="lnd-section-title">
                  📋 Sources ({visibleSources.length} total · {rssCount} RSS · {scrapedCount} scraped · {selectedSources.size} selected)
                </h3>
                <span className="lnd-section-subtitle">
                  Click any card to select a source for news fetching — sources without RSS are fetched via sitemap/scraping
                </span>
              </div>
              <div className="lnd-source-actions">
                <button className="lnd-action-btn" onClick={selectAllVisible}>{t('Select All Visible')}</button>
                <button className="lnd-action-btn" onClick={deselectAll}>{t('Deselect All')}</button>
              </div>
            </div>
            <div className="lnd-source-grid">
              {visibleSources.map(src => {
                const isSelected = selectedSources.has(src.key)
                const color = CATEGORY_COLORS[src.category] || '#64748b'
                // All sources are now fetchable via our multi-strategy fallback chain.
                // Sources with RSS use the 'rss' feedType, others are fetched via
                // sitemap.xml or HTML scraping.
                const feedType = src.feedType || (src.hasRss ? 'rss' : 'scraped')
                const isRss = feedType === 'rss'
                const wrapperProps = { className: `lnd-source-card ${isSelected ? 'lnd-selected' : ''}`,
                      style: { '--lnd-source-accent': color },
                      onClick: () => toggleSource(src.key),
                      role: 'button',
                      tabIndex: 0,
                      onKeyDown: (e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault()
                          toggleSource(src.key)
                        }
                      } }
                return (
                  <div
                    key={src.key}
                    {...wrapperProps}
                  >
                    <div className="lnd-source-card-top">
                      <div
                        className="lnd-checkbox"
                        style={isSelected ? { background: color } : undefined}
                      >
                        {isSelected && <span className="lnd-checkmark">✓</span>}
                      </div>
                      {isRss ? (
                        <span
                          className="lnd-rss-dot"
                          style={{ background: '#10b981' }}
                          title={rssTooltip}
                          aria-label="RSS feed"
                        />
                      ) : (
                        <span
                          className="lnd-scraped-pill"
                          title={scrapedTooltip}
                          aria-label="Scraped content"
                        >
                          <span className="lnd-scraped-icon" aria-hidden="true">🕸️</span>
                          Scraped
                        </span>
                      )}
                    </div>
                    <div className="lnd-source-name">{src.name}</div>
                    <div className="lnd-source-badges">
                      <span
                        className="lnd-badge"
                        style={{
                          background: `${color}1f`,
                          color,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        {CATEGORY_ICONS[src.category] || '📁'} {src.category}
                      </span>
                      {src.country && (
                        <span
                          className="lnd-badge"
                          style={{
                            background: 'rgba(148,163,184,0.10)',
                            color: '#94a3b8',
                            border: '1px solid rgba(148,163,184,0.20)',
                          }}
                        >
                          {COUNTRY_FLAGS[src.country] || '🌐'} {src.country}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
              {visibleSources.length === 0 && (
                <div className="lnd-empty-state">
                  {sourcesLoading ? (
                    <>
                      <div className="lnd-spinner-large" />
                      <p className="lnd-empty-text">Loading sources from catalog…</p>
                    </>
                  ) : (
                    <>
                      <span className="lnd-empty-state-icon">🔍</span>
                      <p className="lnd-empty-text">
                        {sources.length === 0
                          ? 'No sources available right now. The news catalog service may be unreachable.'
                          : 'No sources match your current filters. Try clearing the search or changing country.'}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          <div className="lnd-fetch-section">
            <div className="lnd-preset-row">
              <span className="lnd-preset-label">⚡ {t('Quick Fetch:')}</span>
              {QUICK_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  className="lnd-preset-btn"
                  onClick={() => quickFetch(preset.categories)}
                  disabled={loading}
                  title={`Select all ${preset.label.replace(/^[^\s]+\s/, '')} sources and fetch the latest news`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <button
              className="lnd-fetch-btn"
              onClick={() => fetchNews()}
              disabled={loading || selectedSources.size === 0}
            >
              {loading ? (
                <span className="lnd-fetch-btn-content">
                  <span className="lnd-spinner" />
                  Fetching from {selectedSources.size} {selectedSources.size === 1 ? 'source' : 'sources'}…
                </span>
              ) : (
                <span className="lnd-fetch-btn-content">
                  🔄 Fetch News from {selectedSources.size} {selectedSources.size === 1 ? 'source' : 'sources'}
                </span>
              )}
            </button>
            {fetchProgress && (
              <div className="lnd-fetch-progress" role="progressbar" aria-valuemin={0} aria-valuemax={fetchProgress.total} aria-valuenow={fetchProgress.done}>
                <div className="lnd-fetch-progress-bar"><i style={{ width: `${(fetchProgress.done / Math.max(1, fetchProgress.total)) * 100}%` }} /></div>
                <span>{fetchProgress.done} / {fetchProgress.total} sources checked · {fetchProgress.articles} articles so far</span>
              </div>
            )}
            <p className="lnd-fetch-hint">
              {selectedSources.size === 0
                ? 'Select one or more sources above to enable fetching.'
                : `Ready to fetch from ${selectedSources.size} ${selectedSources.size === 1 ? 'source' : 'sources'}. Results stream in batch by batch.`}
            </p>
          </div>

          {(results.length > 0 || loading || error) && (
            <section className="lnd-results-section">
              <div className="lnd-stats-bar">
                <div className="lnd-stat-item">
                  <span className="lnd-stat-value">{stats.totalArticles}</span>
                  <span className="lnd-stat-label">{t('Articles')}</span>
                </div>
                <div className="lnd-stat-item lnd-stat-success">
                  <span className="lnd-stat-value">{stats.sourcesWithResults}</span>
                  <span className="lnd-stat-label">{t('With Data')}</span>
                </div>
                <div className="lnd-stat-item lnd-stat-error">
                  <span className="lnd-stat-value">{stats.sourcesWithErrors}</span>
                  <span className="lnd-stat-label">{t('Errors')}</span>
                </div>
                <div className="lnd-stat-item lnd-stat-muted">
                  <span className="lnd-stat-value">{stats.sourcesWithNoData}</span>
                  <span className="lnd-stat-label">{t('No Data')}</span>
                </div>
                {fetchedAt && (
                  <div className="lnd-stat-item" style={{ marginLeft: 'auto' }}>
                    <span className="lnd-stat-label">Fetched: {fetchedAt}</span>
                  </div>
                )}
              </div>

              <div className="lnd-results-header">
                <h3 className="lnd-section-title">
                  📰 Results ({filteredResults.length} sources · {stats.totalArticles} articles)
                </h3>
                <div className="lnd-source-actions">
                  <button className="lnd-action-btn" onClick={expandAll}>{t('Expand All')}</button>
                  <button className="lnd-action-btn" onClick={collapseAll}>{t('Collapse All')}</button>
                </div>
              </div>

              {error && (
                <div className="lnd-error-banner">⚠️ {error}</div>
              )}

              {loading ? (
                <div className="lnd-loading-container">
                  <div className="lnd-spinner-large" />
                  <p className="lnd-loading-text">
                    Fetching news from {selectedSources.size} {selectedSources.size === 1 ? 'source' : 'sources'}…
                  </p>
                  <p className="lnd-loading-hint">This may take up to 30 seconds</p>
                </div>
              ) : (
                <div className="lnd-results-list" ref={resultsContainerRef}>
                  {Object.entries(groupedResults).map(([category, catSources]) => {
                    const sectionId = `lnd-section-${category.replace(/[^a-zA-Z0-9]/g, '-')}`
                    const color = CATEGORY_COLORS[category] || '#64748b'
                    return (
                      <div key={category} id={sectionId} data-category={category} className="lnd-category-section">
                        <div className="lnd-category-section-header">
                          <span className="lnd-category-dot" style={{ background: color, color }} />
                          <h3 className="lnd-category-title">
                            {CATEGORY_ICONS[category] || '📁'} {category}
                          </h3>
                          <span className="lnd-category-count">
                            {catSources.length} {catSources.length === 1 ? 'source' : 'sources'}
                          </span>
                        </div>
                        {catSources.map(src => {
                          const isExpanded = expandedSources.has(src.key)
                          return (
                            <div key={src.key} className="lnd-result-group">
                              <div
                                className="lnd-result-header"
                                style={{ '--lnd-result-accent': color }}
                                onClick={() => src.items?.length > 0 && toggleExpand(src.key)}
                                role="button"
                                tabIndex={0}
                                aria-expanded={isExpanded}
                                aria-controls={`lnd-result-items-${src.key}`}
                                onKeyDown={(e) => {
                                  if ((e.key === ' ' || e.key === 'Enter') && src.items?.length > 0) {
                                    e.preventDefault()
                                    toggleExpand(src.key)
                                  }
                                }}
                              >
                                <div className="lnd-result-header-left">
                                  {src.items?.length > 0 ? (
                                    <span className="lnd-expand-icon">{isExpanded ? '▼' : '▶'}</span>
                                  ) : (
                                    <span className="lnd-expand-icon" style={{ opacity: 0.3 }}>—</span>
                                  )}
                                  <span className="lnd-result-name">{src.name}</span>
                                  <span className="lnd-result-count">
                                    {src.items?.filter(i => !isLowQualityEntry(i)).length || 0} {src.items?.filter(i => !isLowQualityEntry(i)).length === 1 ? 'article' : 'articles'}
                                  </span>
                                </div>
                                <div className="lnd-result-header-right">
                                  {/* Fetch method badge */}
                                  {src.feedType && (
                                    <span
                                      className={`lnd-fetch-method-pill lnd-fetch-method-pill-${src.feedType}`}
                                      title={`Articles fetched via ${src.feedType}`}
                                    >
                                      {src.feedType === 'rss' && '📡 RSS'}
                                      {src.feedType === 'sitemap' && '🗺️ Sitemap'}
                                      {src.feedType === 'scraped' && '🕸️ Scraped'}
                                    </span>
                                  )}
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="lnd-visit-link"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    Visit Site ↗
                                  </a>
                                </div>
                              </div>
                              {src.error && (
                                <div className={`lnd-result-error lnd-result-error-${src.status || 'unknown'}`}>
                                  {STATUS_BADGES[src.status]?.icon || '⚠️'}{' '}
                                  {STATUS_BADGES[src.status]?.label || src.error}
                                </div>
                              )}
                              {isExpanded && src.items && src.items.length > 0 && (
                                <div className="lnd-result-items" id={`lnd-result-items-${src.key}`}>
                                  {src.items.filter(item => !isLowQualityEntry(item)).length === 0 && (
                                    <div className="lnd-article-card" style={{ cursor: 'default', opacity: 0.6 }}>
                                      <div className="lnd-article-title" style={{ color: 'var(--lnd-text-muted)' }}>
                                        This source returned non-article content (page titles, navigation, etc.)
                                      </div>
                                    </div>
                                  )}
                                  {src.items.filter(item => !isLowQualityEntry(item)).map((item, i) => {
                                    const matchesSearch = searchQuery && (
                                      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      item.snippet?.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    return (
                                      <a
                                        key={i}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`lnd-article-card ${matchesSearch ? 'lnd-highlight' : ''}`}
                                      >
                                        <ArticleCover
                                          image={item.image}
                                          category={category}
                                          sourceName={src.name}
                                        />
                                        <div className="lnd-article-body">
                                          <div className="lnd-article-meta">
                                            <span className="lnd-article-date">🕘 {formatDate(item.date) || 'Latest'}</span>
                                            <span className="lnd-read-more">Read ↗</span>
                                          </div>
                                          <div className="lnd-article-title">{item.title}</div>
                                          {item.snippet && (
                                            <div className="lnd-article-snippet">{item.snippet.slice(0, 250)}…</div>
                                          )}
                                        </div>
                                      </a>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                  {Object.keys(groupedResults).length === 0 && !loading && (
                    <div className="lnd-empty-state">
                      <span className="lnd-empty-state-icon">📭</span>
                      <p className="lnd-empty-text">No results found. Try fetching news or adjusting filters.</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* RSS Contribution Button */}
      <div className="lnd-rss-contribute-bar">
        <button
          className="lnd-rss-contribute-btn"
          onClick={() => setShowContributeModal(true)}
        >
          📡 {t('Suggest RSS Feed')}
        </button>
        <span className="lnd-rss-contribute-hint">
          Know an AI news source with an RSS feed? Submit it to help improve the catalog.
        </span>
      </div>

      {/* Contribution Modal */}
      {showContributeModal && (
        <div className="lnd-contribute-modal" onClick={() => setShowContributeModal(false)}>
          <div className="lnd-contribute-content" onClick={e => e.stopPropagation()}>
            <h3>📡 Suggest an RSS Feed</h3>
            <p>
              Know an AI news source that's missing from our catalog? Submit the RSS feed URL
              below and it will be added to the source list.
            </p>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              Source Name (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., AI Weekly Blog"
              value={contributeMessage}
              onChange={e => setContributeMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: 12,
                marginBottom: 10,
                fontFamily: 'inherit',
              }}
            />
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
              RSS Feed URL
            </label>
            <textarea
              placeholder="https://example.com/rss.xml"
              value={contributeUrl}
              onChange={e => setContributeUrl(e.target.value)}
            />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '8px 0' }}>
              The RSS URL will be copied to your clipboard as a config template you can add to the backend.
            </p>
            <div className="lnd-contribute-actions">
              <button className="lnd-contribute-cancel" onClick={() => setShowContributeModal(false)}>
                {t('Cancel')}
              </button>
              <button
                className="lnd-contribute-submit"
                onClick={() => {
                  const name = contributeMessage.trim() || 'New Source'
                  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30)
                  const template = `Add to AI_NEWS_SOURCES in backend/main.py:\n"${key}": {\n  name: "${name}",\n  url: "",\n  rss: "${contributeUrl.trim()}",\n  category: "AI & ML News",\n  country: "Global",\n}`
                  navigator.clipboard.writeText(template).then(() => {
                    setShowContributeModal(false)
                    setContributeUrl('')
                    setContributeMessage('')
                    alert('✅ Config template copied! Paste it into backend/main.py AI_NEWS_SOURCES.')
                  }).catch(() => {
                    alert('Could not copy automatically. Here is the template:\n\n' + template)
                  })
                }}
                disabled={!contributeUrl.trim()}
              >
                {t('📋 Copy Config Template')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
