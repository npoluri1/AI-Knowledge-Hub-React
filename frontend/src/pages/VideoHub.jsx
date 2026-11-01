import React, { useCallback, useEffect, useMemo, useRef, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import './VideoHub.css'
import COUNTRIES_FULL from '../countriesFull.json'
import { LANGUAGES as LANGUAGES_FULL, useLang } from '../i18n'
import {
  fetchVideoTopics,
  fetchVideoCountries,
  fetchVideoLanguages,
  fetchVideoDiscover,
  fetchVideoDiscoverAll,
  fetchVideoDiscoverAllTiktok,
  fetchVideoDiscoverAllFacebook,
  fetchVideoDiscoverAllNetworks,
  fetchVideoDiscoverAllInstagram,
  fetchVideoDiscoverInstagram,
  fetchVideoDiscoverX,
  fetchVideoDiscoverAllX,
  fetchVideoDiscoverTiktok,
  fetchVideoDiscoverFacebook,
  fetchVideoMetadata,
  startVideoDownload,
  fetchVideoDownloadStatus,
  fetchVideoDownloads,
} from '../api'

const LS_KEY = 'vh-prefs-v1'
const DOWNLOAD_POLL_MS = 1200

function isoOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return isoOf(d)
}
function fmtDay(iso) {
  if (!iso || iso === 'unknown') return 'Date not reported'
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return 'Date not reported'
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return 'Date not reported'
  }
}
function relativeTime(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  try {
    const then = new Date(`${iso}T00:00:00`)
    const days = Math.floor((Date.now() - then.getTime()) / 86400000)
    if (days <= 0) return 'today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`
    if (days < 365) return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''} ago`
    return `${Math.floor(days / 365)} year${days >= 730 ? 's' : ''} ago`
  } catch {
    return iso
  }
}
function fmtViews(n) {
  if (!n) return ''
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M views`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K views`
  return `${n} views`
}
function fmtDur(sec) {
  if (!sec) return ''
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

const AVATAR_COLORS = ['#ff4d4d', '#f4a300', '#2fb457', '#06b6d4', '#4f7cff', '#a855f7', '#ec4899', '#14b8a6']
function hashStr(str) {
  let h = 5381
  for (let i = 0; i < String(str).length; i++) h = ((h << 5) + h + String(str).charCodeAt(i)) >>> 0
  return h
}
function channelColor(name) {
  return AVATAR_COLORS[hashStr(name || '?') % AVATAR_COLORS.length]
}
function channelInitial(name) {
  return (name || '?').trim().charAt(0).toUpperCase()
}

const PLATFORM_META = {
  youtube: { label: 'YouTube', icon: '▶️', color: '#ff0000' },
  instagram: { label: 'Instagram', icon: '📸', color: '#e1306c' },
  tiktok: { label: 'TikTok', icon: '🎵', color: '#25f4ee' },
  facebook: { label: 'Facebook', icon: '👥', color: '#1877f2' },
  x: { label: 'X', icon: '𝕏', color: '#000000' },
}

const RANGES = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '1m', label: 'Last month', days: 30 },
  { key: '3m', label: 'Last 3 months', days: 90 },
  { key: '6m', label: 'Last 6 months', days: 182 },
  { key: '1y', label: 'Last 1 year', days: 365 },
  { key: '2y', label: 'Last 2 years', days: 730 },
  { key: '5y', label: 'Last 5 years', days: 1826 },
  { key: 'custom', label: 'Custom range', days: 0 },
]

const PAGE_SIZE = 18

// Offline fallback so the country picker ALWAYS shows every market even when
// /api/videos/countries is unreachable. The full 200-country list is generated
// from the backend catalog (video_hub_api.py) so both sides always agree.
const FALLBACK_COUNTRIES = COUNTRIES_FULL

export default function VideoHub() {
  // ── Preferences (persisted) ──
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {} } catch { return {} }
  })
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(prefs)) } catch { /* quota */ }
  }, [prefs])

  // ── Back-to-top visibility ──
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Keyboard paging: ← → move between pages when not typing in a field ──
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (isOtherPlatformRef.current) setSocialPage(p => Math.min(p + 1, socialTotalPagesRef.current))
        else setPage(p => Math.min(p + 1, totalPagesRef.current))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (isOtherPlatformRef.current) setSocialPage(p => Math.max(1, p - 1))
        else setPage(p => Math.max(1, p - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const [topics, setTopics] = useState([])
  const [topic, setTopic] = useState(prefs.topic || 'ai')
  const [platform, setPlatform] = useState('youtube')
  const [kind, setKind] = useState('all') // all | shorts | long
  const [rangeKey, setRangeKey] = useState('1m')
  const [customStart, setCustomStart] = useState(daysAgo(30))
  const [customEnd, setCustomEnd] = useState(isoOf(new Date()))
  const [zoom, setZoom] = useState(prefs.zoom || 1)

  // ── Country (market) selection — biases discovery on every network ──
  const [countries, setCountries] = useState(FALLBACK_COUNTRIES)
  const [country, setCountry] = useState(prefs.country || 'global')
  const [countryOpen, setCountryOpen] = useState(false)
  const [countryQuery, setCountryQuery] = useState('')

  // ── Language selection — biases content discovery + auto mode follows country ──
  // Picking a language here ALSO sets the app-wide UI language (via i18n).
  const [languages, setLanguages] = useState(LANGUAGES_FULL)
  const [lang, setLangLocal] = useState(prefs.lang || 'auto')
  const { t, setLang: setAppLang } = useLang()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nextPageToken, setNextPageToken] = useState('')
  const [page, setPage] = useState(1)
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState('date') // date | views
  const [loadingAll, setLoadingAll] = useState(false)
  const [allSteps, setAllSteps] = useState(() =>
    Object.keys(PLATFORM_META).map(key => ({ key, status: 'idle', count: 0 }))
  )
  const markStep = (key, status, count) =>
    setAllSteps(s => s.map(st => (st.key === key ? { ...st, status, count: count ?? st.count } : st)))
  const stepDone = allSteps.filter(s => s.status === 'done' || s.status === 'error').length
  const youtubeGridItems = useMemo(
    () => [...items].sort((a, b) => (b.published || '').localeCompare(a.published || '')),
    [items]
  )
  const [allNote, setAllNote] = useState('')
  const [tiktokItems, setTiktokItems] = useState([])
  const [tiktokLoading, setTiktokLoading] = useState(false)
  const [tiktokError, setTiktokError] = useState('')
  const [fbItems, setFbItems] = useState([])
  const [fbLoading, setFbLoading] = useState(false)
  const [fbError, setFbError] = useState('')
  const [igItems, setIgItems] = useState([])
  const [igLoading, setIgLoading] = useState(false)
  const [igError, setIgError] = useState('')
  const [xItems, setXItems] = useState([])
  const [xLoading, setXLoading] = useState(false)
  const [xError, setXError] = useState('')
  // Social-tab pagination + fetch depth (TikTok / Instagram / Facebook)
  const [socialPage, setSocialPage] = useState(1)
  const [socialLimit, setSocialLimit] = useState(24)

  // ── Flexibility & freshness controls ──
  const [viewMode, setViewMode] = useState(prefs.viewMode || 'day') // day | grid
  const [autoRefresh, setAutoRefresh] = useState(prefs.autoRefresh !== false)
  const [lastUpdated, setLastUpdated] = useState(0)
  const [showTop, setShowTop] = useState(false)
  const [jumpYt, setJumpYt] = useState('')
  const [jumpSoc, setJumpSoc] = useState('')

  // ── Player modal ──
  const [player, setPlayer] = useState(null)
  const [descOpen, setDescOpen] = useState(false)

  // ── Broken-thumbnail tracking: 404s (removed/private videos, stale keyless
  // IDs) swap the broken <img> for the card's platform tile automatically. ──
  const [brokenThumbs, setBrokenThumbs] = useState(() => new Set())
  const onThumbError = useCallback((e, it) => {
    if (e.currentTarget) e.currentTarget.style.display = 'none'
    if (!it) return
    const key = `${it.platform || 'youtube'}:${it.videoId || it.id}`
    setBrokenThumbs(prev => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }, [])

  // ── Paste-URL section ──
  const [pasteUrl, setPasteUrl] = useState('')
  const [meta, setMeta] = useState(null)
  const [metaLoading, setMetaLoading] = useState(false)
  const [metaError, setMetaError] = useState('')

  // ── Downloads ──
  const [dlJob, setDlJob] = useState(null)
  const [dlPollRef, setDlPollRef] = useState(null)
  const [library, setLibrary] = useState([])
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [libPlayer, setLibPlayer] = useState(null)
  const [quality, setQuality] = useState('720p')
  const jobRef = useRef(null)

  const range = useMemo(() => {
    const r = RANGES.find(r => r.key === rangeKey) || RANGES[1]
    if (r.key === 'custom') return { start: customStart, end: customEnd }
    return { start: daysAgo(r.days), end: isoOf(new Date()) }
  }, [rangeKey, customStart, customEnd])

  useEffect(() => {
    fetchVideoTopics().then(setTopics).catch(() => {})
    fetchVideoCountries().then(d => {
      if (Array.isArray(d.countries) && d.countries.length) setCountries(d.countries)
    }).catch(() => {})
    fetchVideoLanguages().then(l => {
      if (Array.isArray(l) && l.length) setLanguages(l)
    }).catch(() => {})
  }, [])

  // ── Discovery (YouTube — all platforms supported with country + language biasing) ──
  const load = useCallback(async (token = '', append = false) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchVideoDiscover(topic, range.start, range.end, 40, token, kind, country, lang)
      setItems(prev => (append ? [...prev, ...(data.items || [])] : (data.items || [])))
      setNextPageToken(data.nextPageToken || '')
      setLastUpdated(Date.now())
      if (data.error && !append) setError(data.error)
    } catch (err) {
      setError(err?.message || 'Discovery failed')
      if (!append) setItems([])
    } finally {
      setLoading(false)
    }
  }, [topic, range.start, range.end, kind, country, lang])

  // Fetch another slice of YouTube results (keyless mode has no page token —
  // this deepens the search so more videos keep arriving).
  const fetchMoreFromYouTube = useCallback(async () => {
    setFetchMoreLoading(true)
    try {
      const data = await fetchVideoDiscover(topic, range.start, range.end, 40, '', kind, country, lang)
      const fresh = (data.items || []).filter(nv => !items.some(v => v.videoId === nv.videoId))
      setItems(prev => [...prev, ...fresh])
      if (data.error && items.length === 0) setError(data.error)
    } catch (err) {
      setError(err?.message || 'Could not fetch more videos')
    } finally {
      setFetchMoreLoading(false)
    }
  }, [topic, range.start, range.end, kind, items, country, lang])

  // Load videos for EVERY topic + EVERY network progressively (YouTube first,
  // then X, then TikTok, then Instagram, then Facebook — each batch appends as
  // it lands).
  const loadAllTopics = async () => {
    setLoadingAll(true)
    setError('')
    setAllNote('')
    setAllSteps(states => states.map(s => ({ ...s, status: 'idle', count: 0 })))
    const merge = (newItems) => setItems(prev => {
      const seen = new Set(prev.map(v => `${v.platform || 'youtube'}:${v.videoId}`))
      return [...prev, ...(newItems || []).filter(v => !seen.has(`${v.platform || 'youtube'}:${v.videoId}`))]
    })
    try {
      const cName = (countries.find(c => c.code === country)?.name || '🌍 Worldwide').split(' ').slice(1).join(' ') || 'Worldwide'
      setAllNote(`⏳ Step 1/5 — YouTube: all 44 topics for ${cName}…`)
      markStep('youtube', 'running')
      const yt = await fetchVideoDiscoverAll(range.start, range.end, kind, 240, country, lang)
      merge(yt.items)
      setNextPageToken('')
      markStep('youtube', 'done', yt.count || 0)
      setAllNote(`✅ YouTube ready (${yt.count || 0} videos) — ⏳ Step 2/5: X (Twitter) across all topics (${cName})…`)

      let xCount = 0
      try {
        markStep('x', 'running')
        const xx = await fetchVideoDiscoverAllX(150, 6, range.start, range.end, country, lang)
        xCount = xx.count || 0
        merge(xx.items)
        markStep('x', 'done', xCount)
      } catch { markStep('x', 'error', xCount) /* X flaky — continue to TikTok */ }

      setAllNote(`✅ YouTube + X (${xCount} posts) — ⏳ Step 3/5: TikTok across all topics…`)
      let ttCount = 0
      try {
        markStep('tiktok', 'running')
        const tt = await fetchVideoDiscoverAllTiktok(200, 8, range.start, range.end, country, lang)
        ttCount = tt.count || 0
        merge(tt.items)
        markStep('tiktok', 'done', ttCount)
      } catch { markStep('tiktok', 'error', ttCount) /* TikTok flaky — continue to Instagram */ }

      setAllNote(`✅ YouTube + X + TikTok (${ttCount} shorts) — ⏳ Step 4/5: Instagram reels across all topics…`)
      let igCount = 0
      try {
        markStep('instagram', 'running')
        const ig = await fetchVideoDiscoverAllInstagram(150, 6, range.start, range.end, country, lang)
        igCount = ig.count || 0
        merge(ig.items)
        markStep('instagram', 'done', igCount)
      } catch { markStep('instagram', 'error', igCount) /* keep whatever landed */ }

      setAllNote(`✅ YouTube + X + TikTok + Instagram (${igCount} reels) — ⏳ Step 5/5: Facebook across all topics…`)
      let fbCount = 0
      try {
        markStep('facebook', 'running')
        const fb = await fetchVideoDiscoverAllFacebook(200, 8, range.start, range.end, country, lang)
        fbCount = fb.count || 0
        merge(fb.items)
        markStep('facebook', 'done', fbCount)
      } catch { markStep('facebook', 'error', fbCount) /* keep whatever landed */ }

      setAllNote(`🌍 All 5 networks loaded for ${cName} — YouTube ${yt.count || 0} · X ${xCount} · TikTok ${ttCount} · Instagram ${igCount} · Facebook ${fbCount}`)
    } catch (err) {
      setError(err?.message || 'Load-all failed')
    } finally {
      setLoadingAll(false)
    }
  }

  // Real TikTok videos via public tag feeds (plays via official embed).
  const loadTiktok = useCallback(async (tagKey) => {
    setTiktokLoading(true)
    setTiktokError('')
    setSocialPage(1)
    try {
      const t = topics.find(t => t.key === (tagKey || topic))
      const tag = (t?.label || 'AI').toLowerCase().replace(/[^a-z0-9]/g, '') || 'ai'
      const data = await fetchVideoDiscoverTiktok(tag, socialLimit, range.start, range.end, country, lang)
      setTiktokItems(data.items || [])
      setLastUpdated(Date.now())
      if (data.error) setTiktokError(data.error)
    } catch (err) {
      setTiktokError(err?.message || 'TikTok discovery failed')
      setTiktokItems([])
    } finally {
      setTiktokLoading(false)
    }    }, [topics, topic, range.start, range.end, socialLimit, country, lang])

  // Real Facebook public videos (search engines + official oEmbed).
  const loadFacebook = useCallback(async (tagKey) => {
    setFbLoading(true)
    setFbError('')
    setSocialPage(1)
    try {
      const t = topics.find(t => t.key === (tagKey || topic))
      const tag = (t?.label || 'AI').toLowerCase().replace(/[^a-z0-9]/g, '') || 'ai'
      const data = await fetchVideoDiscoverFacebook(tag, socialLimit, range.start, range.end, country, lang)
      setFbItems(data.items || [])
      setLastUpdated(Date.now())
      if (data.error) setFbError(data.error)
    } catch (err) {
      setFbError(err?.message || 'Facebook discovery failed')
      setFbItems([])
    } finally {
      setFbLoading(false)
    }    }, [topics, topic, range.start, range.end, socialLimit, country, lang])

  // Real Instagram reels via public search indexes (plays via official embed).
  const loadInstagram = useCallback(async (tagKey) => {
    setIgLoading(true)
    setIgError('')
    setSocialPage(1)
    try {
      const t = topics.find(t => t.key === (tagKey || topic))
      const tag = (t?.label || 'AI').toLowerCase().replace(/[^a-z0-9]/g, '') || 'ai'
      const data = await fetchVideoDiscoverInstagram(tag, socialLimit, range.start, range.end, country, lang)
      setIgItems(data.items || [])
      setLastUpdated(Date.now())
      if (data.error) setIgError(data.error)
    } catch (err) {
      setIgError(err?.message || 'Instagram discovery failed')
      setIgItems([])
    } finally {
      setIgLoading(false)
    }    }, [topics, topic, range.start, range.end, socialLimit, country, lang])

  // Real X (Twitter) video posts via public search indexes (official oEmbed embed).
  const loadX = useCallback(async (tagKey) => {
    setXLoading(true)
    setXError('')
    setSocialPage(1)
    try {
      const t = topics.find(t => t.key === (tagKey || topic))
      const tag = (t?.label || 'AI').toLowerCase().replace(/[^a-z0-9]/g, '') || 'ai'
      const data = await fetchVideoDiscoverX(tag, socialLimit, range.start, range.end, country, lang)
      setXItems(data.items || [])
      setLastUpdated(Date.now())
      if (data.error) setXError(data.error)
    } catch (err) {
      setXError(err?.message || 'X discovery failed')
      setXItems([])
    } finally {
      setXLoading(false)
    }    }, [topics, topic, range.start, range.end, socialLimit, country])

  // Social tabs: (re)fetch whenever the tab, topic, date range, fetch depth,
  // country OR language changes — date-wise, market- and language-wise
  // discovery on every network. Selection instantly triggers an auto refresh.
  const lastSocialKey = useRef('')
  useEffect(() => {
    if (platform === 'youtube') return
    const key = `${platform}|${topic}|${range.start}|${range.end}|${kind}|${socialLimit}|${country}|${lang}`
    if (lastSocialKey.current === key) return
    lastSocialKey.current = key
    if (platform === 'tiktok') loadTiktok()
    else if (platform === 'instagram') loadInstagram()
    else if (platform === 'facebook') loadFacebook()
    else if (platform === 'x') loadX()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, topic, range.start, range.end, kind, socialLimit, country, lang])

  useEffect(() => {
    if (platform === 'youtube') { setPage(1); load('', false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, topic, range.start, range.end, kind, country, lang])

  // ── Date-wise grouping + pagination (sort applies inside groups) ──
  const byDate = useMemo(() => {
    const list = [...items]
    if (sortOrder === 'views') list.sort((a, b) => (b.views || 0) - (a.views || 0))
    const map = new Map()
    for (const it of list) {
      const key = it.published || 'unknown'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(it)
    }
    return [...map.entries()].sort((a, b) => {
      // Undated (multi-platform) items always sink to the end.
      if (a[0] === 'unknown') return 1
      if (b[0] === 'unknown') return -1
      return b[0].localeCompare(a[0])
    })
  }, [items])

  const totalPages = Math.max(1, Math.ceil(byDate.length / PAGE_SIZE))
  const pageDates = useMemo(
    () => byDate.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [byDate, page],
  )

  // Stats reflect the ACTIVE tab's dataset (YouTube feed or the social tab's).
  // (platform-based selection inline — the oth* selectors are declared later)
  const activeItems = platform === 'tiktok' ? tiktokItems
    : platform === 'instagram' ? igItems
    : platform === 'facebook' ? fbItems
    : platform === 'x' ? xItems
    : items
  const stats = useMemo(() => ({
    total: activeItems.length,
    shorts: activeItems.filter(i => i.isShort).length,
    channels: new Set(activeItems.map(i => i.channel).filter(Boolean)).size,
    networks: new Set(activeItems.map(i => i.platform || 'youtube')).size,
  }), [activeItems])

  // ── Paste URL metadata ──
  const handleFetchMeta = async () => {
    if (!pasteUrl.trim()) return
    setMetaLoading(true); setMetaError(''); setMeta(null)
    try {
      const data = await fetchVideoMetadata(pasteUrl.trim())
      if (data.error && !data.embedUrl) setMetaError(data.error)
      setMeta(data)
    } catch (err) {
      setMetaError(err?.message || 'Metadata fetch failed')
    } finally {
      setMetaLoading(false)
    }
  }

  // ── Downloads ──
  const refreshLibrary = useCallback(async () => {
    setLibraryLoading(true)
    try { setLibrary((await fetchVideoDownloads()).files || []) } catch { /* backend down */ } finally { setLibraryLoading(false) }
  }, [])
  useEffect(() => { refreshLibrary() }, [refreshLibrary])

  const pollStatus = useCallback((jobId) => {
    jobRef.current = jobId
    const timer = setInterval(async () => {
      try {
        const job = await fetchVideoDownloadStatus(jobId)
        setDlJob(job)
        if (job.status === 'done' || job.status === 'error') {
          clearInterval(timer)
          if (job.status === 'done') refreshLibrary()
        }
      } catch { clearInterval(timer) }
    }, DOWNLOAD_POLL_MS)
    setDlPollRef(timer)
  }, [refreshLibrary])
  useEffect(() => () => { if (dlPollRef) clearInterval(dlPollRef) }, [dlPollRef])

  const handleDownload = async (url, q = quality) => {
    if (dlPollRef) clearInterval(dlPollRef)
    try {
      const job = await startVideoDownload(url, q)
      if (job.error) { setError(job.error); return }
      setDlJob(job)
      if (job.id) pollStatus(job.id)
    } catch (err) {
      setError(err?.message || 'Download failed to start')
    }
  }

  const platformSearchUrl = (p) => {
    const t = topics.find(t => t.key === topic)
    const q = encodeURIComponent(t ? `${t.label} tutorial` : topic)
    if (p === 'instagram') return `https://www.instagram.com/explore/tags/${(t?.label || 'ai').toLowerCase().replace(/[^a-z]/g, '')}/`
    if (p === 'tiktok') return `https://www.tiktok.com/search?q=${q}`
    if (p === 'facebook') return `https://www.facebook.com/search/videos/?q=${q}`
    if (p === 'x') return `https://x.com/search?q=${q}%20filter%3Avideo&f=live`
    return `https://www.youtube.com/results?search_query=${q}&sp=CAI%253D`
  }

  const zoomIn = () => setZoom(z => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))
  const zoomOut = () => setZoom(z => Math.max(0.85, Math.round((z - 0.1) * 10) / 10))

  const openPlayer = (it) => { setPlayer(it); setDescOpen(false) }

  // ── YouTube-style long-video card ──
  const renderLongCard = (it) => (
    <article key={it.id} className="yt-card" onClick={() => openPlayer(it)}>
      <div className="yt-thumb">
        {it.thumbnail && !brokenThumbs.has(`${it.platform || 'youtube'}:${it.videoId || it.id}`)
          ? <img src={it.thumbnail} alt={it.title} loading="lazy" decoding="async" onError={e => onThumbError(e, it)} />
          : <div className="yt-thumb-fallback">{PLATFORM_META[it.platform]?.icon || '🎬'}</div>}
        <span className="yt-dur">{fmtDur(it.durationSec) || '—'}</span>
        <div className="yt-hover-play"><span>▶ Play</span></div>
      </div>
      <div className="yt-row">
        <span className="yt-avatar" style={{ background: channelColor(it.channel) + '22', color: channelColor(it.channel), borderColor: channelColor(it.channel) + '55' }}>
          {channelInitial(it.channel)}
        </span>
        <div className="yt-info">
          <h4 className="yt-title" style={{ fontSize: `calc(0.9rem * ${zoom})` }}>{it.title}</h4>
          <span className="yt-channel">
            {it.channel || 'Unknown channel'}
            <svg className="yt-verified" viewBox="0 0 24 24" title="Channel"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".15" /><path d="M10.5 15.2 7.8 12.5l1.1-1.1 1.6 1.6 4.5-4.5 1.1 1.1z" fill="currentColor" /></svg>
          </span>
          <span className="yt-meta">{fmtViews(it.views) || 'Views unavailable'}{it.published ? ` · ${relativeTime(it.published)}` : ''}</span>
        </div>
      </div>
      <div className="yt-card-foot" onClick={e => e.stopPropagation()}>
        {it.topicLabel && <span className="vh-topic-chip">{it.topicLabel}</span>}
        <div className="yt-actions">
          <button type="button" className="vh-pill primary" onClick={() => openPlayer(it)}>▶ Watch</button>
          <button type="button" className="vh-pill" onClick={() => handleDownload(it.url)} title="Download to your library">⬇</button>
          <a className="vh-pill" href={it.url} target="_blank" rel="noopener noreferrer" title="Open on YouTube">↗</a>
        </div>
      </div>
    </article>
  )

  // ── TikTok-style shorts card (vertical, side action rail) ──
  const renderShortCard = (it) => (
    <article key={it.id} className="tk-card" onClick={() => openPlayer(it)}>
      <div className="tk-media">
        {it.thumbnail && !brokenThumbs.has(`${it.platform || 'youtube'}:${it.videoId || it.id}`)
          ? <img src={it.thumbnail} alt={it.title} loading="lazy" decoding="async" onError={e => onThumbError(e, it)} />
          : <div className="tk-thumb-fallback">🎵</div>}
        <span className="tk-short-flag">SHORT</span>
        <div className="tk-shade" />
        <div className="tk-overlay">
          <span className="tk-author">@{(it.channel || 'creator').toLowerCase().replace(/\s+/g, '')}</span>
          <span className="tk-caption" style={{ fontSize: `calc(0.78rem * ${zoom})` }}>{it.title}</span>
        </div>
        <div className="tk-rail" onClick={e => e.stopPropagation()}>
          <button type="button" className="tk-rail-btn" onClick={() => openPlayer(it)} title="Play">▶</button>
          <button type="button" className="tk-rail-btn" onClick={() => handleDownload(it.url)} title="Download">⬇</button>
          <a className="tk-rail-btn" href={it.url} target="_blank" rel="noopener noreferrer" title="Open on platform">↗</a>
        </div>
      </div>
      <div className="tk-foot">
        <span className="tk-views">{fmtViews(it.views) || 'Short'}</span>
        {it.published && <span className="tk-when">{relativeTime(it.published)}</span>}
        {it.topicLabel && <span className="vh-topic-chip small">{it.topicLabel}</span>}
      </div>
    </article>
  )

  const renderVideoCard = (it) => (it.isShort ? renderShortCard(it) : renderLongCard(it))

  // Shared selectors for the non-YouTube discovery tabs (X / TikTok / Instagram / FB)
  const isOtherPlatform = platform === 'tiktok' || platform === 'instagram' || platform === 'facebook' || platform === 'x'
  const othItems = platform === 'tiktok' ? tiktokItems : platform === 'instagram' ? igItems : platform === 'facebook' ? fbItems : xItems
  const othLoading = platform === 'tiktok' ? tiktokLoading : platform === 'instagram' ? igLoading : platform === 'facebook' ? fbLoading : xLoading
  const othError = platform === 'tiktok' ? tiktokError : platform === 'instagram' ? igError : platform === 'facebook' ? fbError : xError
  const othLoader = platform === 'tiktok' ? loadTiktok : platform === 'instagram' ? loadInstagram : platform === 'facebook' ? loadFacebook : loadX

  // ── Social-tab pagination: same date-group paging as YouTube ──
  const socialByDate = useMemo(() => {
    const list = [...othItems]
    if (sortOrder === 'views') list.sort((a, b) => (b.views || 0) - (a.views || 0))
    const map = new Map()
    for (const it of list) {
      const key = it.published || 'unknown'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(it)
    }
    return [...map.entries()].sort((a, b) => {
      if (a[0] === 'unknown') return 1
      if (b[0] === 'unknown') return -1
      return b[0].localeCompare(a[0])
    })
  }, [othItems, sortOrder])

  const socialTotalPages = Math.max(1, Math.ceil(socialByDate.length / PAGE_SIZE))
  const socialPageDates = useMemo(
    () => socialByDate.slice((socialPage - 1) * PAGE_SIZE, socialPage * PAGE_SIZE),
    [socialByDate, socialPage],
  )
  const socialCanDeepen = othItems.length >= socialLimit && socialLimit < 120
  const loadMoreSocial = () => setSocialLimit(n => Math.min(n + 24, 120))

  // Grid-mode grouping for social tabs: all items in one page, newest first
  const socialGridItems = useMemo(() => {
    const list = [...othItems]
    list.sort((a, b) => (b.views || 0) - (a.views || 0))
    return list
  }, [othItems])

  // Refs so the keyboard-paging effect reads the latest values without re-binding
  // (single declaration — YouTube + social refs live together here)
  const totalPagesRef = useRef(1); totalPagesRef.current = totalPages
  const socialTotalPagesRef = useRef(1); socialTotalPagesRef.current = socialTotalPages
  const isOtherPlatformRef = useRef(false); isOtherPlatformRef.current = platform !== 'youtube'
  // Auto-refresh loader for the active social tab
  const othLoaderRef = useRef(null); othLoaderRef.current = othLoader

  // ── Country picker: search-filtered list + selected entry, grouped by region ──
  const countryList = countries.length ? countries : FALLBACK_COUNTRIES
  const selectedCountry = countryList.find(c => c.code === country) || countryList[0]
  const countryMatches = useMemo(() => {
    const q = countryQuery.trim().toLowerCase()
    if (!q) return countryList
    return countryList.filter(c => c.name.toLowerCase().includes(q) || c.code.includes(q))
  }, [countryList, countryQuery])

  const countryGroups = useMemo(() => {
    const map = new Map()
    for (const c of countryMatches) {
      const region = c.region || '🌐 Worldwide'
      if (!map.has(region)) map.set(region, [])
      map.get(region).push(c)
    }
    return [...map.entries()]
  }, [countryMatches])

  // ── Language picker: search-filtered + region-grouped, mirrors the country picker ──
  const [langOpen, setLangOpen] = useState(false)
  const [langQuery, setLangQuery] = useState('')
  const langList = languages.length ? languages : LANGUAGES_FULL
  const selectedLang = langList.find(l => l.code === lang) || langList[0]
  const langMatches = useMemo(() => {
    const q = langQuery.trim().toLowerCase()
    if (!q) return langList
    return langList.filter(l =>
      l.name.toLowerCase().includes(q) || (l.native || '').toLowerCase().includes(q) || l.code.toLowerCase() === q
    )
  }, [langList, langQuery])
  const langGroups = useMemo(() => {
    const map = new Map()
    for (const l of langMatches) {
      const region = l.region || 'Other'
      if (!map.has(region)) map.set(region, [])
      map.get(region).push(l)
    }
    return [...map.entries()]
  }, [langMatches])

  // ── Auto-refresh: quietly re-fetch the active tab's latest every 2 minutes ──
  // (declared AFTER all state + loaders so the deps array never touches TDZ)
  const AUTO_MS = 120000
  useEffect(() => {
    if (!autoRefresh || loadingAll) return undefined
    const t = setInterval(() => {
      if (document.hidden) return
      if (platform === 'youtube') { if (!loading) load('', false) }
      else othLoaderRef.current && othLoaderRef.current()
    }, AUTO_MS)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, platform, loadingAll])

  return (
    <div className="vh-page">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="vh-hero">
        <div className="vh-hero-glow" />
        <div className="vh-hero-top">
          <div>
            <h1>🎬 {t('AI Tech-Stack Video Hub')}</h1>
            <p>
              Short + long videos across all 44 AI tech-stack topics — AI, ML, AI Agents, Python, FastAPI, ReactJS,
              NextJS, RAG, MCP, LangChain, LangGraph, VectorDB, CrewAI, AutoGen, LoRA, MLOps, Embeddings, LLMs,
              Prompting, Fine-Tuning, Governance, Quantum, Chips, IoT, AGI, ASI and more — discovered date-wise
              (up to 5 years back) on every market, playable in-app, and downloadable to your local library.
              Pick a country → its YouTube / X / Instagram / TikTok / Facebook creators load automatically;
              hit “⚡ Fetch latest” any time for a fresh dynamic pull.
            </p>
          </div>
          <div className="vh-zoom">
            <span>🔍 Zoom</span>
            <button type="button" onClick={zoomOut} disabled={zoom <= 0.85}>−</button>
            <span className="vh-zoom-val">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={zoomIn} disabled={zoom >= 1.5}>+</button>
          </div>
        </div>
        <div className="vh-hero-stats">
          <span className="vh-stat"><strong>{topics.length || 44}</strong> {t('topics')}</span>
          <span className="vh-stat"><strong>{stats.total}</strong> {t('videos loaded')}</span>
          <span className="vh-stat"><strong>{stats.networks}</strong> {t('networks')}</span>
          <span className="vh-stat"><strong>{stats.shorts}</strong> {t('shorts')}</span>
          <span className="vh-stat"><strong>{stats.channels}</strong> {t('channels')}</span>
          <span className="vh-stat"><strong>{library.length}</strong> {t('downloaded')}</span>
          {lastUpdated > 0 && (
            <span className="vh-stat fresh" title="Data refreshed from live sources">
              <span className="vh-fresh-dot" /> {Math.max(1, Math.round((Date.now() - lastUpdated) / 60000))} min ago
            </span>
          )}
        </div>
      </div>

      {/* ── Paste any post URL (all platforms) — FB composer style ── */}
      <section className="vh-section fb-card">
        <h3>🔗 Open any video post</h3>
        <p className="vh-sub">Paste a YouTube / X / Instagram / TikTok / Facebook video or Shorts/Reel URL — play it right here or download it.</p>
        <div className="vh-paste-row">
          <div className="fb-composer">
            <span className="fb-composer-icon">🔗</span>
            <input
              type="text"
              className="vh-input grow"
              placeholder="https://www.youtube.com/watch?v=… or x.com/…/status/… or instagram.com/reel/… or tiktok.com/…/video/…"
              value={pasteUrl}
              onChange={e => setPasteUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFetchMeta()}
            />
          </div>
          <button type="button" className="vh-btn primary" onClick={handleFetchMeta} disabled={metaLoading}>
            {metaLoading ? '⏳ …' : 'Fetch'}
          </button>
        </div>
        {metaError && <div className="vh-status err">⚠️ {metaError}</div>}
        {meta && (
          <div className="fb-paste-meta">
            <span className="yt-avatar big" style={{ background: channelColor(meta.uploader) + '22', color: channelColor(meta.uploader), borderColor: channelColor(meta.uploader) + '55' }}>
              {channelInitial(meta.uploader)}
            </span>
            <div className="fb-paste-info">
              <strong>{meta.title || 'Video'}</strong>
              <span className="fb-paste-meta-row">
                <b className="fb-channel">{meta.uploader || 'Unknown uploader'}</b>
                · {PLATFORM_META[meta.platform]?.label}
                {meta.published ? ` · ${meta.published}` : ''}
                {meta.durationSec ? ` · ${fmtDur(meta.durationSec)}` : ''}
                {meta.isShort ? ' · ⚡ Short' : ''}
              </span>
              {meta.description && <p className="fb-paste-desc">{meta.description.slice(0, 220)}{meta.description.length > 220 ? '…' : ''}</p>}
              <div className="vh-paste-actions">
                {meta.embedUrl && <button type="button" className="vh-btn primary" onClick={() => openPlayer(meta)}>▶ Play here</button>}
                <button type="button" className="vh-btn" onClick={() => handleDownload(pasteUrl.trim())}>⬇ Download</button>
                <a className="vh-btn ghost" href={pasteUrl} target="_blank" rel="noopener noreferrer">↗ Open on platform</a>
              </div>
            </div>
            {meta.thumbnail && <img className="fb-paste-thumb" src={meta.thumbnail} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} />}
          </div>
        )}
      </section>

      {/* ── Discovery ── */}
      <section className="vh-section">
        <div className="vh-loadall-row">
          <button type="button" className="vh-btn primary" onClick={loadAllTopics} disabled={loadingAll}>
            {loadingAll ? `⏳ ${t('Loading all networks…')}` : `🌍 ${t('Load ALL videos — every network (YT + X + IG + TikTok + FB), all 44 topics')}`}
          </button>
          <button
            type="button"
            className="vh-btn"
            onClick={() => {
              if (platform === 'youtube') { setPage(1); load('', false) }
              else othLoader()
            }}
            disabled={loading || othLoading || loadingAll}
            title="Fetch the freshest videos for this topic right now"
          >
            {loading || othLoading ? `⏳ ${t('Fetching…')}` : `⚡ ${t('Fetch latest')}`}
          </button>
          <label className="vh-switch" title="Quietly refresh the active tab every 2 minutes">
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
            <span className="vh-switch-track"><span className="vh-switch-knob" /></span>
            <span className="vh-switch-label">{t('Auto-refresh')}</span>
          </label>
          <div className="vh-viewtoggle" role="group" aria-label="View mode">
            <button type="button" className={viewMode === 'day' ? 'on' : ''} onClick={() => { setViewMode('day'); setPrefs(p => ({ ...p, viewMode: 'day' })) }} title="Feed grouped by day (like Facebook)">{t('Days')} 📅</button>
            <button type="button" className={viewMode === 'grid' ? 'on' : ''} onClick={() => { setViewMode('grid'); setPrefs(p => ({ ...p, viewMode: 'grid' })) }} title="Dense wall of videos (like YouTube)">{t('Grid')} ▦</button>
          </div>
          {allNote && <span className="vh-all-note">{allNote}</span>}
        </div>
        {allSteps.some(s => s.status !== 'idle') && (
          <div className="vh-all-progress" role="status" aria-live="polite">
            <div className="vh-all-top">
              <span className="vh-all-pct">
                {loadingAll ? `⏳ ${t('Loading all networks…')}` : `🌍 ${stepDone}/${Object.keys(PLATFORM_META).length} ${t('networks')}`} · {Math.round((stepDone / Object.keys(PLATFORM_META).length) * 100)}%
              </span>
              <button type="button" className="vh-btn ghost" onClick={() => setAllSteps(s => s.map(st => ({ ...st, status: 'idle', count: 0 })))}>✕</button>
            </div>
            <div className="vh-all-track"><div className="vh-all-fill" style={{ width: `${(stepDone / Object.keys(PLATFORM_META).length) * 100}%` }} /></div>
            <div className="vh-all-steps">
              {allSteps.map(s => (
                <span key={s.key} className={`vh-step ${s.status}`}>
                  {s.status === 'running' ? '⏳' : s.status === 'done' ? '✅' : s.status === 'error' ? '⚠️' : '⚪'} {PLATFORM_META[s.key].icon} {PLATFORM_META[s.key].label}
                  {s.count ? ` · ${s.count}` : ''}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="vh-toolbar">
          <div className="vh-tool-row">
            <span className="vh-tool-label">🌍 {t('Market & language')}</span>
            {/* ── Country (market) picker — biases discovery on every network ── */}
            <div className="vh-country">
            <button
              type="button"
              className={`vh-country-btn ${country !== 'global' ? 'active' : ''}`}
              onClick={() => { setCountryOpen(o => !o); setCountryQuery('') }}
              title="Bias video discovery to a country's creators and market"
            >
              <span className="vh-country-flag">{(selectedCountry?.name || '🌍').split(' ')[0]}</span>
              <span className="vh-country-name">{(selectedCountry?.name || '🌍 Worldwide').split(' ').slice(1).join(' ') || 'Worldwide'}</span>
              <span className="vh-country-caret">▾</span>
            </button>
            {countryOpen && (
              <>
                <div className="vh-country-overlay" onClick={() => setCountryOpen(false)} />
                <div className="vh-country-pop">
                  <div className="vh-country-search">
                    <input
                      autoFocus
                      type="text"
                      className="vh-input"
                      placeholder={`🔍 ${t('Search country…')}`}
                      value={countryQuery}
                      onChange={e => setCountryQuery(e.target.value)}
                    />
                    <button type="button" className="vh-pill" onClick={() => setCountryOpen(false)}>✕</button>
                  </div>
                  <div className="vh-country-grid">
                    {countryGroups.map(([region, list]) => (
                      <Fragment key={region}>
                        <div className="vh-region-label">{region}</div>
                        {list.map(c => (
                          <button
                            key={c.code}
                            type="button"
                            className={`vh-country-item ${c.code === country ? 'on' : ''}`}
                            onClick={() => { setCountry(c.code); setPrefs(p => ({ ...p, country: c.code })); setCountryOpen(false) }}
                          >
                            <span className="vh-country-flag">{c.name.split(' ')[0]}</span>
                            <span>{c.name.split(' ').slice(1).join(' ') || 'Worldwide'}</span>
                          </button>
                        ))}
                      </Fragment>
                    ))}
                    {countryMatches.length === 0 && <div className="vh-country-none">No country matches “{countryQuery}”</div>}
                  </div>
                  <div className="vh-country-foot">
                    {countryList.length} countries · discovery biased per country + language on all 5 networks
                  </div>
                </div>
              </>
            )}
          </div>
          {/* ── Language picker — app-level content + UI language ── */}
          <div className="vh-country vh-lang">
            <button
              type="button"
              className={`vh-country-btn ${lang !== 'auto' ? 'active' : ''}`}
              onClick={() => { setLangOpen(o => !o); setLangQuery('') }}
              title="Bias discovery to a language (100+ languages) — Auto follows the selected country"
            >
              <span className="vh-country-flag">🌐</span>
              <span className="vh-country-name">{(selectedLang?.native || selectedLang?.name || 'Auto')}</span>
              <span className="vh-country-caret">▾</span>
            </button>
            {langOpen && (
              <>
                <div className="vh-country-overlay" onClick={() => setLangOpen(false)} />
                <div className="vh-country-pop vh-lang-pop">
                  <div className="vh-country-search">
                    <input
                      autoFocus
                      type="text"
                      className="vh-input"
                      placeholder={`🔍 ${t('Search language…')}`}
                      value={langQuery}
                      onChange={e => setLangQuery(e.target.value)}
                    />
                    <button type="button" className="vh-pill" onClick={() => setLangOpen(false)}>✕</button>
                  </div>
                  <div className="vh-country-grid">
                    {langGroups.map(([region, list]) => (
                      <Fragment key={region}>
                        <div className="vh-region-label">{region}</div>
                        {list.map(l => (
                          <button
                            key={l.code}
                            type="button"
                            className={`vh-country-item ${l.code === lang ? 'on' : ''}`}
                            onClick={() => { setLangLocal(l.code); setAppLang(l.code); setPrefs(p => ({ ...p, lang: l.code })); setLangOpen(false) }}
                          >
                            <span className="vh-country-flag">{l.rtl ? '⇄' : '🌐'}</span>
                            <span>{l.native}</span>
                            <span className="vh-lang-sub">{l.name}</span>
                          </button>
                        ))}
                      </Fragment>
                    ))}
                    {langMatches.length === 0 && <div className="vh-country-none">No language matches “{langQuery}”</div>}
                  </div>
                  <div className="vh-country-foot">
                    {langList.length} languages · Auto follows the selected country · UI language applies app-wide
                  </div>
                </div>
              </>
            )}
          </div>
          </div>
          <div className="vh-tool-row vh-tool-row-filters">
            <span className="vh-tool-label">🎯 {t('Topic · length · order · period')}</span>
          <select className="vh-input" value={topic} onChange={e => { setTopic(e.target.value); setPrefs(p => ({ ...p, topic: e.target.value })) }} title="Tech-stack topic">
            <option value="ai">🔀 {t('Mixed / AI')}</option>
            {topics.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          <select className="vh-input" value={kind} onChange={e => setKind(e.target.value)} title="Video length">
            <option value="all">{t('All lengths')}</option>
            <option value="shorts">⚡ {t('Shorts (≤60s)')}</option>
            <option value="long">🎬 {t('Long-form')}</option>
          </select>
          <select className="vh-input" value={sortOrder} onChange={e => setSortOrder(e.target.value)} title="Sort order">
            <option value="date">📅 {t('Latest first')}</option>
            <option value="views">🔥 {t('Most viewed')}</option>
          </select>
          <select className="vh-input" value={rangeKey} onChange={e => setRangeKey(e.target.value)} title="Date range">
            {RANGES.map(r => <option key={r.key} value={r.key}>{t(r.label)}</option>)}
          </select>
          {rangeKey === 'custom' && (
            <>
              <input type="date" className="vh-input" value={customStart} onChange={e => setCustomStart(e.target.value)} />
              <input type="date" className="vh-input" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
            </>
          )}
          {rangeKey !== 'custom' && (
            <div className="vh-chips" title="Quick date jumps">
              {[['7d', 7], ['1m', 30], ['3m', 90], ['1y', 365]].map(([k, d]) => (
                <button key={k} type="button" className={`vh-chip ${rangeKey === k ? 'on' : ''}`} onClick={() => setRangeKey(k)}>
                  {k === '7d' ? '7d' : k === '1m' ? '1m' : k === '3m' ? '3m' : '1y'}
                </button>
))}
            </div>
          )}
          </div>
          <div className="vh-tool-row vh-tool-row-networks">
            <span className="vh-tool-label">📺 {t('Network')}</span>
            <div className="vh-platform-tabs">
            {['youtube', 'x', 'instagram', 'tiktok', 'facebook'].map(p => (
              <button
                key={p}
                type="button"
                className={`vh-ptab ${platform === p ? 'active' : ''}`}
                style={platform === p ? { borderColor: PLATFORM_META[p].color, color: PLATFORM_META[p].color, background: PLATFORM_META[p].color + '14' } : undefined}
                onClick={() => setPlatform(p)}
                title={p === 'youtube' ? 'Full date-wise discovery' : 'Real public videos via official embeds + paste-URL playback'}
              >
                {PLATFORM_META[p].icon} {PLATFORM_META[p].label}
              </button>
            ))}
          </div>
          </div>
        </div>

        {isOtherPlatform ? (
          <>
            <div className="vh-tt-head">
              <span className="vh-sub">
                {PLATFORM_META[platform].icon} Real {PLATFORM_META[platform].label} videos for{' '}
                <strong>#{(topics.find(t => t.key === topic)?.label || 'AI').toLowerCase().replace(/[^a-z0-9]/g, '')}</strong> —
                public videos via official embeds, playable in-app and downloadable.
              </span>
              <button type="button" className="vh-btn ghost" onClick={() => othLoader()} disabled={othLoading}>
                {othLoading ? `⏳ ${t('Loading…')}` : `🔄 ${t('Refresh')}`}
              </button>
            </div>
            {othError && <div className="vh-status warn">💡 {othError}</div>}
            {othLoading && othItems.length === 0 ? (
              <div className="vh-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="yt-card skeleton">
                    <div className="yt-thumb sk" />
                    <div className="yt-row">
                      <span className="yt-avatar sk" />
                      <div className="yt-info"><div className="sk-line w80" /><div className="sk-line w50" /></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : socialByDate.length === 0 ? (
              <div className="vh-empty rich">
                <span className="vh-empty-icon">{PLATFORM_META[platform].icon}</span>
                <strong>{t('No videos in this date range for this topic yet')}</strong>
                <p>{t('Widen the date range, try another tech-stack topic — or search directly:')}</p>
                <div className="vh-empty-actions">
                  <button type="button" className="vh-btn" onClick={() => othLoader()} disabled={othLoading}>🔄 {t('Retry now')}</button>
                  <a className="vh-btn primary" href={platformSearchUrl(platform)} target="_blank" rel="noopener noreferrer">🔍 Search {PLATFORM_META[platform].label} ↗</a>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <>
                <div className="vh-grid">
                  {socialGridItems.map(renderVideoCard)}
                </div>
                <div className="vh-pager">
                  <button type="button" className="vh-btn ghost" disabled={socialPage <= 1} onClick={() => setSocialPage(p => p - 1)}>‹ Prev</button>
                  <span>Page {socialPage} of {socialTotalPages} · {socialByDate.length} date groups · {othItems.length} videos</span>
                  <button type="button" className="vh-btn ghost" disabled={socialPage >= socialTotalPages} onClick={() => setSocialPage(p => p + 1)}>Next ›</button>
                  <form className="vh-jump" onSubmit={e => { e.preventDefault(); const n = parseInt(jumpSoc, 10); if (n >= 1 && n <= socialTotalPages) setSocialPage(n) }}>
                    <input type="number" min="1" max={socialTotalPages} placeholder={`1–${socialTotalPages}`} value={jumpSoc} onChange={e => setJumpSoc(e.target.value)} />
                    <button type="submit">Go</button>
                  </form>
                  {socialCanDeepen && (
                    <button type="button" className="vh-btn" onClick={loadMoreSocial} disabled={othLoading}>
                      ＋ Load more ({othItems.length} loaded)
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {socialPageDates.map(([date, dateItems]) => {
                  const dayShorts = dateItems.filter(i => i.isShort)
                  const dayLongs = dateItems.filter(i => !i.isShort)
                  return (
                    <div key={date} className="fb-day">
                      <div className="fb-day-head">
                        <span className="fb-day-avatar">📅</span>
                        <div className="fb-day-titles">
                          <strong>{fmtDay(date)}</strong>
                          <span>{dateItems.length} video{dateItems.length === 1 ? '' : 's'}{dayShorts.length ? ` · ${dayShorts.length} short${dayShorts.length === 1 ? '' : 's'}` : ''}</span>
                        </div>
                      </div>
                      {dayLongs.length > 0 && <div className="vh-grid">{dayLongs.map(renderLongCard)}</div>}
                      {dayShorts.length > 0 && (
                        <div className="tk-strip-wrap">
                          <span className="tk-strip-label">⚡ Shorts</span>
                          <div className="tk-strip">{dayShorts.map(renderShortCard)}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div className="vh-pager">
                  <button type="button" className="vh-btn ghost" disabled={socialPage <= 1} onClick={() => setSocialPage(p => p - 1)}>‹ Prev</button>
                  <span>Page {socialPage} of {socialTotalPages} · {socialByDate.length} date groups · {othItems.length} videos</span>
                  <button type="button" className="vh-btn ghost" disabled={socialPage >= socialTotalPages} onClick={() => setSocialPage(p => p + 1)}>Next ›</button>
                  <form className="vh-jump" onSubmit={e => { e.preventDefault(); const n = parseInt(jumpSoc, 10); if (n >= 1 && n <= socialTotalPages) setSocialPage(n) }}>
                    <input type="number" min="1" max={socialTotalPages} placeholder={`1–${socialTotalPages}`} value={jumpSoc} onChange={e => setJumpSoc(e.target.value)} />
                    <button type="submit">Go</button>
                  </form>
                  {socialCanDeepen && (
                    <button type="button" className="vh-btn" onClick={loadMoreSocial} disabled={othLoading}>
                      ＋ Load more ({othItems.length} loaded)
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        ) : platform !== 'youtube' ? (
          <div className="vh-empty rich">
            <span className="vh-empty-icon">{PLATFORM_META[platform].icon}</span>
            <strong>{PLATFORM_META[platform].label} has no public discovery API</strong>
            <p>
              Instagram, TikTok and Facebook don't allow unauthenticated bulk search. Use the one-click topic
              search below, or paste any post URL above — it plays right here via the official embed.
            </p>
            <a className="vh-btn primary" href={platformSearchUrl(platform)} target="_blank" rel="noopener noreferrer">
              🔍 Search {PLATFORM_META[platform].label} for this topic ↗
            </a>
          </div>
        ) : loading && items.length === 0 ? (
          <div className="vh-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="yt-card skeleton">
                <div className="yt-thumb sk" />
                <div className="yt-row">
                  <span className="yt-avatar sk" />
                  <div className="yt-info"><div className="sk-line w80" /><div className="sk-line w50" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {error && <div className="vh-status warn">💡 {error}</div>}
            {pageDates.length === 0 && !loading ? (
              <>
                <div className="vh-empty rich">
                  <span className="vh-empty-icon">📭</span>
                  <strong>{t('No videos in this date range for this topic yet')}</strong>
                  <p>{t('Widen the date range, try another tech-stack topic — or search directly:')}</p>
                  <div className="vh-empty-actions">
                    <button type="button" className="vh-btn" onClick={() => { setPage(1); load('', false) }} disabled={loading}>🔄 {t('Retry now')}</button>
                    {['youtube', 'x', 'instagram', 'tiktok', 'facebook'].map(p => (
                      <a key={p} className="vh-pill" href={platformSearchUrl(p)} target="_blank" rel="noopener noreferrer">
                        {PLATFORM_META[p].icon} {PLATFORM_META[p].label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="vh-quickrow">
                  {[['7d', 7], ['1m', 30], ['3m', 90], ['1y', 365]].map(([k, d]) => (
                    <button key={k} type="button" className={`vh-chip ${rangeKey === k ? 'on' : ''}`} onClick={() => setRangeKey(k)}>{k}</button>
                  ))}
                </div>
              </>
            ) : viewMode === 'grid' ? (
              <div className="vh-grid">{youtubeGridItems.map(renderVideoCard)}</div>
            ) : pageDates.map(([date, dateItems]) => {
              const dayShorts = dateItems.filter(i => i.isShort)
              const dayLongs = dateItems.filter(i => !i.isShort)
              return (
                <div key={date} className="fb-day">
                  <div className="fb-day-head">
                    <span className="fb-day-avatar">📅</span>
                    <div className="fb-day-titles">
                      <strong>{fmtDay(date)}</strong>
                      <span>{dateItems.length} video{dateItems.length === 1 ? '' : 's'}{dayShorts.length ? ` · ${dayShorts.length} short${dayShorts.length === 1 ? '' : 's'}` : ''}</span>
                    </div>
                  </div>
                  {dayLongs.length > 0 && <div className="vh-grid">{dayLongs.map(renderLongCard)}</div>}
                  {dayShorts.length > 0 && (
                    <div className="tk-strip-wrap">
                      <span className="tk-strip-label">⚡ Shorts</span>
                      <div className="tk-strip">{dayShorts.map(renderShortCard)}</div>
                    </div>
                  )}
                </div>
              )
            })}
            <div className="vh-pager">
              <button type="button" className="vh-btn ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
              <span>Page {page} of {totalPages} · {byDate.length} date groups</span>
              <button type="button" className="vh-btn ghost" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
              {nextPageToken && (
                <button type="button" className="vh-btn" onClick={() => load(nextPageToken, true)} disabled={loading}>
                  {loading ? '⏳ …' : '＋ Load more from YouTube'}
                </button>
              )}
              {!nextPageToken && items.length > 0 && (
                <button type="button" className="vh-btn" onClick={fetchMoreFromYouTube} disabled={fetchMoreLoading}>
                  {fetchMoreLoading ? '⏳ Fetching more…' : `＋ Load more (${items.length} loaded)`}
                </button>
              )}
            </div>
          </>
        )}
      </section>

      {/* ── Downloads library — FB style rows ── */}
      <section className="vh-section fb-card" id="downloads">
        <div className="vh-lib-head">
          <h3>⬇️ My Video Library</h3>
          <button type="button" className="vh-btn ghost" onClick={refreshLibrary} disabled={libraryLoading}>
            {libraryLoading ? '⏳ …' : `🔄 ${t('Refresh')}`}
          </button>
        </div>
        <p className="vh-sub">
          Downloads save to <code>exports/videos/</code>. Only download content you have the rights to keep —
          your own uploads, Creative Commons, or platform-offered downloads.
        </p>
        {dlJob && (
          <div className={`vh-dl-job ${dlJob.status}`}>
            <span className="vh-dl-spinner" />
            <strong>
              {dlJob.status === 'downloading' && `Downloading… ${dlJob.progress || 0}%`}
              {dlJob.status === 'processing' && 'Processing…'}
              {dlJob.status === 'done' && `Done: ${dlJob.title}`}
              {dlJob.status === 'error' && `Failed: ${dlJob.error}`}
              {dlJob.status === 'queued' && 'Queued…'}
            </strong>
            {dlJob.speedMBs ? <span className="vh-dl-speed">{dlJob.speedMBs} MB/s</span> : null}
            <div className="vh-dl-bar"><div className="vh-dl-bar-fill" style={{ width: `${dlJob.progress || 0}%` }} /></div>
          </div>
        )}
        {library.length === 0 ? (
          <div className="vh-empty rich">
            <span className="vh-empty-icon">📼</span>
            <strong>Nothing downloaded yet</strong>
            <p>Hit ⬇ Download on any video above — it lands here with playback and quality selection.</p>
          </div>
        ) : (
          <div className="fb-lib-list">
            {library.map(f => (
              <div key={f.name} className="fb-lib-row">
                <span className={`fb-lib-icon ${f.isAudio ? 'audio' : ''}`}>{f.isAudio ? '🎧' : '🎬'}</span>
                <div className="fb-lib-info">
                  <strong title={f.name}>{f.name}</strong>
                  <span>{f.sizeMB} MB · {new Date(f.modified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="fb-lib-actions">
                  {!f.isAudio && <button type="button" className="vh-pill primary" onClick={() => setLibPlayer(f)}>▶ Play</button>}
                  <a className="vh-pill" href={f.serveUrl} download={f.name}>⬇ Save</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Theater player modal (YouTube-theater style) ── */}
      {(player || libPlayer) && (
        <div className="vh-modal-overlay" onClick={() => { setPlayer(null); setLibPlayer(null) }}>
          <div className="vh-modal theater" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="vh-theater-stage">
              {libPlayer ? (
                <video controls autoPlay src={libPlayer.serveUrl} />
              ) : player?.embedUrl ? (
                <iframe
                  src={player.embedUrl}
                  title={player.title || 'video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="vh-theater-fallback">
                  <p>This post doesn't support embedding.</p>
                  <a className="vh-btn primary" href={player?.url} target="_blank" rel="noopener noreferrer">Open it on the platform ↗</a>
                </div>
              )}
            </div>
            <div className="vh-theater-info">
              <h3 className="vh-theater-title" style={{ fontSize: `calc(1.02rem * ${zoom})` }}>{player?.title || libPlayer?.name}</h3>
              {player && (
                <>
                  <div className="vh-theater-meta-row">
                    <span className="yt-avatar" style={{ background: channelColor(player.channel || player.uploader) + '22', color: channelColor(player.channel || player.uploader), borderColor: channelColor(player.channel || player.uploader) + '55' }}>
                      {channelInitial(player.channel || player.uploader)}
                    </span>
                    <div className="vh-theater-chan">
                      <strong>{player.channel || player.uploader || 'Unknown'}</strong>
                      <span>
                        {fmtViews(player.views)}
                        {player.published ? ` · ${player.published}` : ''}
                        {player.durationSec ? ` · ${fmtDur(player.durationSec)}` : ''}
                      </span>
                    </div>
                    <div className="vh-theater-actions">
                      <button type="button" className="vh-btn" onClick={() => handleDownload(player.url)}>⬇ Download</button>
                      {player.url && <a className="vh-btn ghost" href={player.url} target="_blank" rel="noopener noreferrer">↗ Platform</a>}
                    </div>
                  </div>
                  {player.description && (
                    <div className={`vh-theater-desc ${descOpen ? 'open' : ''}`} onClick={() => setDescOpen(v => !v)}>
                      <p>{player.description}</p>
                      <span className="vh-desc-toggle">{descOpen ? 'Show less' : 'Show more'}</span>
                    </div>
                  )}
                </>
              )}
              {libPlayer && (
                <div className="vh-theater-actions" style={{ marginTop: 10 }}>
                  <a className="vh-btn" href={libPlayer.serveUrl} download={libPlayer.name}>⬇ Save file</a>
                </div>
              )}
            </div>
            <button type="button" className="vh-theater-close" onClick={() => { setPlayer(null); setLibPlayer(null) }} title="Close">✕</button>
          </div>
        </div>
      )}

      <div className="vh-footer">— {t('AI Tech-Stack Video Hub')} · date-wise discovery, in-app playback, local library —</div>
    </div>
  )
}
