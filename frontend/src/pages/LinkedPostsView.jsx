import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchDailyLinkedInPosts,
  fetchDailyLinkedInRange,
  fetchLinkedInProfiles,
  fetchLiveLinkedInPosts,
  LINKEDIN_DAILY_TOPICS,
} from '../api'
import fileManifest from '../fileManifest.json'
import { linkedinImgProxy } from '../api'
import { lpHeader, lpFooter } from '../data/linkedPostsData'
import { LINKEDIN_POSTS, LINKEDIN_POST_CATEGORIES, LINKEDIN_POSTS_STATS } from '../data/linkedinPostsCollection'
import { PAPER_COUNTRIES, COUNTRY_PAPERS, COUNTRY_PAPERS_STATS, papersByCountry } from '../data/countryPapersData'
import { linkedinBookMeta } from '../data/linkedinBookData'
import LinkedInBookReader from '../components/LinkedInBookReader'
import LinkedInAiBlogReader from '../components/LinkedInAiBlogReader'
import './LinkedPostsView.css'
import { useLang } from '../i18n'

const ARCHIVE_KEY = 'lp-daily-archive-v1'
const SCHEDULE_KEY = 'lp-scheduled-dates-v1'
const ZOOM_KEY = 'lp-zoom-v1'
const PERSIST_DAY_CAP = 366   // localStorage pruning: keep the newest ~1 year of fetched days
const LIVE_PAGE_SIZE = 8      // live feed "load more" step
const DAILY_PAGE_SIZE = 5     // day-groups per page in the daily feed
const PAPER_PAGE_SIZE = 12
const COLL_PAGE_SIZE = 12

// Keep localStorage under quota: persist only the newest PERSIST_DAY_CAP days.
function pruneForPersist(byDate) {
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a))
  const kept = {}
  for (const d of dates.slice(0, PERSIST_DAY_CAP)) kept[d] = byDate[d]
  return kept
}

function todayIso() { return isoOf(new Date()) }
function isFuture(iso) { return !!iso && iso > todayIso() }

// Image fallback chain: Go accelerator proxy → Python proxy → hide.
function handleImgError(e, originalUrl) {
  const img = e.currentTarget
  const src = img.currentSrc || img.src || ''
  if (src.includes('/api/li/img')) {
    img.src = `/api/linkedin-posts/img?url=${encodeURIComponent(originalUrl)}`
  } else if (src.includes('/api/linkedin-posts/img')) {
    const wrap = img.closest('.lpc-media-item')
    if (wrap) wrap.style.display = 'none'
    else img.style.display = 'none'
  } else {
    img.style.display = 'none'
  }
}

// Parse a raw post into structured reading blocks for the full-page reader.
function parseStructured(content) {
  const lines = String(content || '').split('\n')
  const blocks = []
  let para = []
  const flush = () => { if (para.length) { blocks.push({ type: 'para', text: para.join(' ') }); para = [] } }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flush(); continue }
    if (/^[▸•\-*]\s+/.test(line)) { flush(); blocks.push({ type: 'bullet', text: line.replace(/^[▸•\-*]\s+/, '') }); continue }
    if (/^#{1,3}\s+/.test(line)) { flush(); blocks.push({ type: 'h', text: line.replace(/^#{1,3}\s+/, '') }); continue }
    if (/^(🔹|🚀|📌|🔥|💡|✅|⚠️|🧠|🔗|📊|🎯|⚙️)/.test(line)) {
      flush()
      blocks.push({ type: 'h', text: line.replace(/^[^A-Za-z0-9]+/, '').trim() || line })
      continue
    }
    if (line.length <= 60 && /[:：]$/.test(line)) { flush(); blocks.push({ type: 'h', text: line.replace(/[:：]$/, '') }); continue }
    para.push(line)
  }
  flush()
  return blocks
}

// Frontend topic list for the live feed (mirrors backend catalog).
const LIVE_TOPICS = [
  'ai', 'ml', 'agents', 'multi_agents', 'python', 'fastapi', 'reactjs', 'nextjs',
  'rag', 'mcp', 'langchain', 'langgraph', 'vectordb', 'workflows', 'crewai',
  'tool_calling', 'memory', 'agent_gateway', 'agent_loops', 'ai_graphs', 'spring_ai',
  'evaluations', 'observability', 'awareness', 'guardrails', 'react', 'design_patterns',
  'autogen', 'lora', 'mlops', 'embeddings', 'llamaindex', 'llms', 'prompting',
  'fine_tuning', 'governance', 'looping', 'graphics', 'quantum', 'semiconductor',
  'iot', 'agi', 'asi', 'super_ai',
]
const LIVE_TOPIC_LABELS = {
  ai: 'AI', ml: 'ML', agents: 'AI Agents', multi_agents: 'Multi-Agents', python: 'Python',
  fastapi: 'FastAPI', reactjs: 'ReactJS', nextjs: 'NextJS', rag: 'RAG', mcp: 'MCP',
  langchain: 'LangChain', langgraph: 'LangGraph', vectordb: 'VectorDB', workflows: 'AI Workflows',
  crewai: 'CrewAI', tool_calling: 'Tool/Function Calling', memory: 'Memory Management',
  agent_gateway: 'Agent Gateway', agent_loops: 'Agent Loops', ai_graphs: 'AI Graphs',
  spring_ai: 'Spring AI', evaluations: 'Evaluations', observability: 'Observability',
  awareness: 'Agent Awareness', guardrails: 'GuardRails', react: 'REAct Patterns',
  design_patterns: 'AI Design Patterns', autogen: 'AutoGen', lora: 'LORA/QLORA', mlops: 'MLOps',
  embeddings: 'Embeddings', llamaindex: 'LlamaIndex', llms: 'LLMs', prompting: 'Prompting',
  fine_tuning: 'Fine-Tuning', governance: 'Governance', looping: 'Looping',
  graphics: 'Graphics Engineering', quantum: 'Quantum Computing', semiconductor: 'Semiconductor & Chips',
  iot: 'IoT', agi: 'AGI', asi: 'ASI', super_ai: 'Super AI',
}

const AVATAR_PALETTE = ['#89b4fa', '#a6e3a1', '#f9e2af', '#cba6f7', '#f38ba8', '#94e2d5', '#fab387', '#89dceb']

function hashString(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  return h
}

function avatarColor(name) {
  return AVATAR_PALETTE[hashString(name || '?') % AVATAR_PALETTE.length]
}

function formatDate(iso) {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function formatDayShort(iso) {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch {
    return iso
  }
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function isoOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Deterministic image per post id from the LinkedIn tech-stack folder.
function imageFor(postId, pool) {
  if (!pool.length) return null
  return pool[hashString(String(postId)) % pool.length]
}

export default function LinkedPostsView() {
  const { t } = useLang()
  // ── Post image pool (bundled LinkedIn tech-stack inventory) ──
  const imagePool = useMemo(() => (fileManifest.images || [])
    .filter(f => f.folder === 'linkedin_ai_techstack_images' && f.url && f.name)
    .sort((a, b) => (b.mtime || 0) - (a.mtime || 0)), [])

  // ── Daily archive ──
  const [archive, setArchive] = useState(() => {
    try {
      const raw = localStorage.getItem(ARCHIVE_KEY)
      const parsed = raw ? JSON.parse(raw) : null
      if (parsed && parsed.byDate) return parsed.byDate
    } catch { /* fresh start */ }
    return {}
  })
  const [dailyDate, setDailyDate] = useState(() => isoOf(new Date()))
  const [dailyTopic, setDailyTopic] = useState('all')
  const [dailyProfile, setDailyProfile] = useState('all')
  const [perDay, setPerDay] = useState(4)
  const [profiles, setProfiles] = useState([])
  const [dailyFetching, setDailyFetching] = useState(false)
  const [fetchAllMode, setFetchAllMode] = useState(false)
  const [dailyError, setDailyError] = useState('')
  const [dailyStatus, setDailyStatus] = useState('')
  const [dateFilter, setDateFilter] = useState(null) // null = show all fetched days

  // NOTE: these must be declared BEFORE the memos/effects below that reference
  // them (TDZ — "Cannot access before initialization" otherwise).
  const [livePage, setLivePage] = useState(1)
  const [scheduledDates, setScheduledDates] = useState(() => { try { return JSON.parse(localStorage.getItem(SCHEDULE_KEY)) || [] } catch { return [] } })
  const [rangeDays, setRangeDays] = useState(30)
  const [rangeFetching, setRangeFetching] = useState(false)
  const [rangeProgress, setRangeProgress] = useState('')
  const [dailyPage, setDailyPage] = useState(1)
  const [paperPage, setPaperPage] = useState(1)
  const [collPage, setCollPage] = useState(1)

  // Calendar month navigation
  const [calMonth, setCalMonth] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1) })

  const persistArchive = useCallback((next) => {
    setArchive(next)
    try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify({ version: 1, byDate: pruneForPersist(next) })) } catch { /* quota */ }
  }, [])

  const mergePosts = useCallback((posts) => {
    if (!posts?.length) return
    setArchive(prev => {
      const byId = new Map((prev[posts[0].date] || []).map(p => [p.id, p]))
      for (const p of posts) byId.set(p.id, p)
      const next = { ...prev, [posts[0].date]: [...byId.values()] }
      try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify({ version: 1, byDate: pruneForPersist(next) })) } catch { /* quota */ }
      return next
    })
  }, [])

  useEffect(() => {
    fetchLinkedInProfiles().then(list => { if (list.length) setProfiles(list) })
  }, [])

  // ── Fetch one day ──
  const handleFetchDay = async (date = dailyDate) => {
    setDailyFetching(true); setDailyError(''); setDailyStatus(''); setFetchAllMode(false)
    try {
      const data = await fetchDailyLinkedInPosts(date, dailyTopic, { profile: dailyProfile, perDay })
      mergePosts(data.posts || [])
      setDailyStatus(`Fetched ${data.posts.length} post${data.posts.length === 1 ? '' : 's'} for ${formatDate(data.date)}`)
    } catch (err) {
      setDailyError(err?.message || 'Failed to fetch daily posts')
    } finally {
      setDailyFetching(false)
    }
  }

  // ── Fetch ALL days of the visible month ──
  const handleFetchAll = async () => {
    setDailyFetching(true); setDailyError(''); setDailyStatus(''); setFetchAllMode(true)
    const y = calMonth.getFullYear(), m = calMonth.getMonth()
    const start = isoOf(new Date(y, m, 1))
    const end = isoOf(new Date(y, m + 1, 0))
    try {
      const data = await fetchDailyLinkedInRange(start, end, dailyTopic, { profile: dailyProfile, perDay })
      setArchive(prev => {
        const next = { ...prev }
        for (const day of data.days || []) {
          const byId = new Map((next[day.date] || []).map(p => [p.id, p]))
          for (const p of day.posts || []) byId.set(p.id, p)
          next[day.date] = [...byId.values()]
        }
        try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify({ version: 1, byDate: pruneForPersist(next) })) } catch { /* quota */ }
        return next
      })
      setDateFilter(null)
      setDailyStatus(`Fetched ALL posts for ${start} → ${end} (${data.total} posts across ${data.days.length} days)`)
    } catch (err) {
      setDailyError(err?.message || 'Failed to fetch month posts')
    } finally {
      setDailyFetching(false)
    }
  }

  // ── Calendar grid ──
  const calendarCells = useMemo(() => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth()
    const firstDow = (new Date(y, m, 1).getDay() + 6) % 7 // Monday-first
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(isoOf(new Date(y, m, d)))
    return cells
  }, [calMonth])

  const archivedCountFor = (iso) => (archive[iso] || []).length
  const totalArchived = useMemo(() => Object.values(archive).reduce((n, arr) => n + arr.length, 0), [archive])

  // ── Feed: date-grouped posts ──
  const feedDays = useMemo(() => {
    const dates = Object.keys(archive).sort((a, b) => b.localeCompare(a))
    return dates
      .filter(d => !dateFilter || d === dateFilter)
      .map(d => ({ date: d, posts: archive[d] }))
  }, [archive, dateFilter])
  useEffect(() => { setDailyPage(1) }, [dateFilter, totalArchived])
  const dailyTotalPages = Math.max(1, Math.ceil(feedDays.length / DAILY_PAGE_SIZE))
  const pagedFeedDays = useMemo(
    () => feedDays.slice((dailyPage - 1) * DAILY_PAGE_SIZE, dailyPage * DAILY_PAGE_SIZE),
    [feedDays, dailyPage],
  )

  const clearArchive = () => {
    if (!window.confirm('Clear the entire fetched daily archive?')) return
    persistArchive({})
    setDateFilter(null)
    setDailyStatus('Archive cleared.')
  }

  // ── Range fetch: 30 days → 5 years, batched year-by-year so one request
  // never blocks the UI. Posts stay date-wise in the archive. ──
  const handleFetchRange = async (days = rangeDays) => {
    setRangeFetching(true); setDailyError(''); setDailyStatus(''); setFetchAllMode(true)
    const end = todayIso()
    const startDate = new Date(); startDate.setDate(startDate.getDate() - (days - 1))
    const overallStart = isoOf(startDate)
    let cursorEnd = new Date(startDate)
    let total = 0, batches = 0
    try {
      while (true) {
        const batchStart = isoOf(cursorEnd)
        const batchEndDate = new Date(cursorEnd); batchEndDate.setDate(batchEndDate.getDate() + 364)
        const batchEnd = isoOf(batchEndDate > new Date() ? new Date() : batchEndDate)
        const data = await fetchDailyLinkedInRange(batchStart, batchEnd, dailyTopic, { profile: dailyProfile, perDay })
        setArchive(prev => {
          const next = { ...prev }
          for (const day of data.days || []) {
            const byId = new Map((next[day.date] || []).map(p => [p.id, p]))
            for (const p of day.posts || []) byId.set(p.id, p)
            next[day.date] = [...byId.values()]
          }
          try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify({ version: 1, byDate: pruneForPersist(next) })) } catch { /* quota */ }
          return next
        })
        total += data.total || 0
        batches += 1
        setRangeProgress(`${batches} batch${batches === 1 ? '' : 'es'} · ${total} posts · up to ${batchEnd}`)
        if (batchEnd >= end) break
        cursorEnd = new Date(batchEnd); cursorEnd.setDate(cursorEnd.getDate() + 1)
      }
      setDateFilter(null)
      setDailyStatus(`Fetched ${total} posts from ${overallStart} → ${end} (${batches} batch${batches === 1 ? '' : 'es'})`)
    } catch (err) {
      setDailyError(err?.message || 'Range fetch failed')
    } finally {
      setRangeFetching(false); setFetchAllMode(false); setRangeProgress('')
    }
  }

  // ── Future dates: schedule auto-fetch — when the day arrives, the real
  // posts are pulled automatically into the date-wise archive. ──
  const scheduleAutoFetch = (iso) => {
    if (!isFuture(iso) || scheduledDates.includes(iso)) return
    const next = [...scheduledDates, iso].sort()
    setScheduledDates(next)
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(next)) } catch { /* quota */ }
    setDailyStatus(`⏰ Scheduled: on ${fmtDayShort(iso)} the live feed will auto-fetch that day's posts.`)
  }
  const uncheduleAutoFetch = (iso) => {
    const next = scheduledDates.filter(d => d !== iso)
    setScheduledDates(next)
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(next)) } catch { /* quota */ }
  }
  // Fire any scheduled date that has arrived (and isn't already archived).
  useEffect(() => {
    const due = scheduledDates.filter(d => !isFuture(d) && !(archive[d] || []).some(p => p.category === 'live'))
    if (!due.length) return
    let cancelled = false
    ;(async () => {
      for (const d of due) {
        try {
          const data = await fetchLiveLinkedInPosts('mixed', 6, false, false, 'any', d)
          if (cancelled) return
          if (data.posts?.length) {
            mergePosts(data.posts.map(p => ({
              ...p,
              date: d,
              profile: p.author || 'LinkedIn live',
              profileTagline: p.authorHeadline || 'Live LinkedIn tech-stack post',
            })))
          }
        } catch { /* keep the schedule for next visit */ }
        uncheduleAutoFetch(d)
      }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduledDates])

  // ── Curated collection ──
  const [postCat, setPostCat] = useState('all')
  const [postQuery, setPostQuery] = useState('')
  const [expandedPosts, setExpandedPosts] = useState(() => new Set())
  const [likedPosts, setLikedPosts] = useState(() => new Set())

  const filteredPosts = useMemo(() => {
    const needle = postQuery.trim().toLowerCase()
    return LINKEDIN_POSTS.filter(p => {
      if (postCat !== 'all' && p.category !== postCat) return false
      if (needle && !(p.title.toLowerCase().includes(needle) || p.content.toLowerCase().includes(needle) || p.tags.some(t => t.toLowerCase().includes(needle)))) return false
      return true
    })
  }, [postCat, postQuery])
  useEffect(() => { setCollPage(1) }, [postCat, postQuery])
  const collTotalPages = Math.max(1, Math.ceil(filteredPosts.length / COLL_PAGE_SIZE))
  const collPageItems = useMemo(
    () => filteredPosts.slice((collPage - 1) * COLL_PAGE_SIZE, collPage * COLL_PAGE_SIZE),
    [filteredPosts, collPage],
  )

  const togglePost = (id) => {
    setExpandedPosts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleLike = (id) => {
    setLikedPosts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const postsByCat = useMemo(() => {
    const counts = { all: LINKEDIN_POSTS.length }
    LINKEDIN_POSTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return counts
  }, [])

  // ── Zoom (post text size, persisted) + live-feed calendar state ──
  const [zoom, setZoom] = useState(() => { const v = Number(localStorage.getItem(ZOOM_KEY)); return v >= 0.85 && v <= 1.5 ? v : 1 })
  useEffect(() => { try { localStorage.setItem(ZOOM_KEY, String(zoom)) } catch { /* quota */ } }, [zoom])
  const [liveCalMonth, setLiveCalMonth] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1) })
  const [liveDateFilter, setLiveDateFilter] = useState(null)
  const zoomIn = () => setZoom(z => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))
  const zoomOut = () => setZoom(z => Math.max(0.85, Math.round((z - 0.1) * 10) / 10))
  const zoomReset = () => setZoom(1)
  const [livePosts, setLivePosts] = useState([])
  const [liveTopic, setLiveTopic] = useState('mixed')
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveError, setLiveError] = useState('')
  const [liveFetchedAt, setLiveFetchedAt] = useState(null)
  const [liveNote, setLiveNote] = useState('')
  const [liveTimeRange, setLiveTimeRange] = useState('month')
  const [liveDate, setLiveDate] = useState('')
  const [liveDateMode, setLiveDateMode] = useState(false)
  const [openPost, setOpenPost] = useState(null) // LinkedIn-style detail view
  const [readerPost, setReaderPost] = useState(null) // full-page structured reader
  const [expandedLive, setExpandedLive] = useState(() => new Set())
  const [expandedMedia, setExpandedMedia] = useState(() => new Set())
  const [copiedUrl, setCopiedUrl] = useState('')

  // Keep live posts date-wise in the daily archive (today's bucket).
  const persistLivePosts = useCallback((posts) => {
    if (!posts?.length) return
    const today = isoOf(new Date())
    setArchive(prev => {
      const byId = new Map((prev[today] || []).map(p => [p.id, p]))
      for (const p of posts) {
        byId.set(p.id, {
          ...p,
          date: today,
          profile: p.author || 'LinkedIn live',
          profileTagline: p.authorHeadline || 'Live LinkedIn tech-stack post',
          topic: p.topic || 'live',
        })
      }
      const next = { ...prev, [today]: [...byId.values()] }
      try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify({ version: 1, byDate: pruneForPersist(next) })) } catch { /* quota */ }
      return next
    })
  }, [])

  const loadLivePosts = useCallback(async ({ topic = liveTopic, refresh = false, all = false, timeRange = liveTimeRange, date = '' } = {}) => {
    setLiveLoading(true)
    setLiveError('')
    setLiveNote('')
    try {
      const data = await fetchLiveLinkedInPosts(topic, 6, refresh, all, timeRange, date)
      const posts = data.posts || []
      setLivePosts(posts)
      setLiveFetchedAt(data.fetchedAt || null)
      setLiveNote(data.note || '')
      if (data.errors?.length) setLiveError(data.errors[0])
      if (posts.length) persistLivePosts(posts)
    } catch (err) {
      setLiveError(err?.message || 'Live fetch failed')
    } finally {
      setLiveLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveTopic, persistLivePosts])

  const toggleLiveExpand = (id) => setExpandedLive(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })
  const toggleMediaExpand = (id) => setExpandedMedia(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })
  const copyPostUrl = (url) => {
    try {
      navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(''), 1500)
    } catch { /* clipboard unavailable */ }
  }

  // Live-feed calendar: count posts per day, filter feed by clicking a day.
  const liveDayCounts = useMemo(() => {
    const counts = {}
    for (const p of livePosts) {
      const key = (p.published || '').slice(0, 10)
      if (key) counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [livePosts])
  const liveCalendarCells = useMemo(() => {
    const y = liveCalMonth.getFullYear(), m = liveCalMonth.getMonth()
    const firstDow = (new Date(y, m, 1).getDay() + 6) % 7 // Monday-first
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(isoOf(new Date(y, m, d)))
    return cells
  }, [liveCalMonth])
  const visibleLivePosts = useMemo(() => (
    liveDateFilter ? livePosts.filter(p => (p.published || '').startsWith(liveDateFilter)) : livePosts
  ), [livePosts, liveDateFilter])

  // Initial load + reload on topic change.
  useEffect(() => {
    loadLivePosts({ topic: liveTopic })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveTopic])

  // ── Live feed pagination (load-more style) ──
  const [liveVisible, setLiveVisible] = useState(LIVE_PAGE_SIZE)
  useEffect(() => { setLiveVisible(LIVE_PAGE_SIZE) }, [visibleLivePosts.length, liveDateFilter])
  const shownLivePosts = useMemo(() => visibleLivePosts.slice(0, liveVisible), [visibleLivePosts, liveVisible])

  const renderLiveCard = (post) => {
    const liked = likedPosts.has(post.id)
    const author = post.author || 'LinkedIn member'
    const images = post.images || []
    const isContentExpanded = expandedLive.has(post.id)
    const text = post.content || post.title || ''
    const isLong = text.length > 420
    const shown = isContentExpanded || !isLong ? text : `${text.slice(0, 420)}…`
    const isMediaExpanded = expandedMedia.has(post.id)
    const shownImages = isMediaExpanded || images.length <= 1 ? images : images.slice(0, 1)
    const avatarUrl = post.avatar ? linkedinImgProxy(post.avatar) : ''
    const futureDated = isFuture((post.published || '').slice(0, 10))
    return (
      <article key={post.id} className="lpc live" onClick={() => setOpenPost(post)} style={{ cursor: 'pointer' }}>
        <header className="lpc-head">
          {avatarUrl
            ? <img className="lpc-avatar live photo" src={avatarUrl} alt={author} loading="lazy" decoding="async" />
            : <span className="lpc-avatar live">{author.charAt(0).toUpperCase()}</span>}
          <div className="lpc-id">
            <div className="lpc-name-row">
              <strong className="lpc-name">{author}</strong>
            </div>
            <span className="lpc-sub">
              {post.authorHeadline ? `${post.authorHeadline} · ` : ''}
              {post.topicLabel || LIVE_TOPIC_LABELS[post.topic] || 'Tech Stack'}
              {post.published ? ` · ${post.published.slice(0, 10)}` : ''} · Live
            </span>
          </div>
          {futureDated && <span className="lpc-badge future" title="Auto-fetched for a scheduled date">⏰ Scheduled</span>}
          <span className="lpc-badge live" title="Fetched live from LinkedIn via Tavily">🟢 Live</span>
        </header>
        <div className="lpc-body">
          <pre className={`lpc-text ${isContentExpanded ? 'expanded' : 'clamped'}`}>{shown}</pre>
          {isLong && (
            <button type="button" className="lpc-see-more" onClick={e => { e.stopPropagation(); toggleLiveExpand(post.id) }}>
              {isContentExpanded ? 'see less' : 'see more'}
            </button>
          )}
          <button type="button" className="lpc-see-more" onClick={e => { e.stopPropagation(); setReaderPost(post) }} title="Open the structured full-page reader">
            📖 Reader view
          </button>
        </div>
        {shownImages.length > 0 && (
          <div className={`lpc-media ${isMediaExpanded ? 'expanded' : ''}`}>
            {shownImages.map((url, i) => (
              <a
                key={`${post.id}-img-${i}`}
                className="lpc-media-item"
                href={post.url || url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Image ${i + 1} of ${images.length} — open original on LinkedIn`}
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={linkedinImgProxy(url)}
                  alt={`Post image ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  onError={e => handleImgError(e, url)}
                />
              </a>
            ))}
            {images.length > 1 && (
              <button type="button" className="lpc-media-more" onClick={e => { e.stopPropagation(); toggleMediaExpand(post.id) }}>
                {isMediaExpanded ? '− Show less' : `+ ${images.length - 1} more image${images.length > 2 ? 's' : ''}`}
              </button>
            )}
          </div>
        )}
        {post.url && (
          <div className="lpc-url-row" title="Original LinkedIn URL of this exact post">
            <a className="lpc-url" href={post.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>🔗 {post.url}</a>
            <button type="button" className="lpc-url-copy" onClick={e => { e.stopPropagation(); copyPostUrl(post.url) }}>
              {copiedUrl === post.url ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        )}
        <div className="lpc-actions">
          <button type="button" className={`lpc-action ${liked ? 'liked' : ''}`} onClick={e => { e.stopPropagation(); toggleLike(post.id) }}>
            👍 {liked ? 'Liked' : 'Like'} · {liked ? 1 : 0}
          </button>
          {post.url && (
            <a className="lpc-action lpc-action-link" href={post.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} title="Read the original LinkedIn post">
              ↗ Read on LinkedIn
            </a>
          )}
        </div>
      </article>
    )
  }

  // ── LinkedIn-style detail view (opens when a card is clicked) ──
  const renderPostDetail = () => {
    if (!openPost) return null
    const post = openPost
    const author = post.author || post.profile || 'LinkedIn member'
    const images = post.images || []
    const liked = likedPosts.has(post.id)
    const color = '#0a66c2'
    return (
      <div className="lp-modal-overlay" onClick={() => setOpenPost(null)}>
        <div className="lp-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
          <header className="lp-modal-head">
            <span className="lp-modal-title">Post</span>
            <button type="button" className="lp-modal-close" onClick={() => setOpenPost(null)} title="Close">✕</button>
          </header>
          <div className="lp-modal-body">
            <div className="lp-modal-author">
              {post.avatar
                ? <img className="lpc-avatar live photo big" src={linkedinImgProxy(post.avatar)} alt={author} />
                : <span className="lpc-avatar live big">{author.charAt(0).toUpperCase()}</span>}
              <div>
                <strong className="lp-modal-name">{author}</strong>
                <span className="lp-modal-sub">
                  {post.authorHeadline || post.profileTagline || 'AI tech-stack post'}
                  {post.published ? ` · ${post.published.slice(0, 10)}` : post.date ? ` · ${formatDayShort(post.date)}` : ' · recent'}
                </span>
              </div>
            </div>
            <pre className="lp-modal-text">{post.content || post.title}</pre>
            {images.length > 0 && (
              <div className="lp-modal-media">
                {images.map((url, i) => (
                  <a key={`m-${i}`} className="lpc-media-item" href={post.url || url} target="_blank" rel="noopener noreferrer">
                    <img src={linkedinImgProxy(url)} alt={`Post image ${i + 1}`} onError={e => handleImgError(e, url)} />
                  </a>
                ))}
              </div>
            )}
            <div className="lp-modal-actions">
              <button type="button" className={`lpc-action ${liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                👍 {liked ? 'Liked' : 'Like'} · {liked ? 1 : 0}
              </button>
              {post.url && (
                <a className="lpc-action lpc-action-link" href={post.url} target="_blank" rel="noopener noreferrer">
                  ↗ Open original on LinkedIn
                </a>
              )}
              <button type="button" className="lpc-action" onClick={() => copyPostUrl(post.url || '')} disabled={!post.url}>
                {copiedUrl === post.url ? '✓ Link copied' : '🔗 Copy link'}
              </button>
              <button type="button" className="lpc-action" onClick={() => { setReaderPost(post); setOpenPost(null) }}>
                📖 Reader view
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Full-page structured reader (zoom + wide + readable blocks) ──
  const renderReaderModal = () => {
    if (!readerPost) return null
    const post = readerPost
    const author = post.author || post.profile || 'LinkedIn member'
    const blocks = parseStructured(post.content || post.title || '')
    const images = post.images || []
    const liked = likedPosts.has(post.id)
    return (
      <div className="lp-reader-overlay" onClick={() => setReaderPost(null)}>
        <div className="lp-reader" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
          <header className="lp-reader-head">
            <div>
              <strong className="lp-reader-title">{post.title || 'Post'}</strong>
              <span className="lp-reader-sub">{author} · {post.topicLabel || LIVE_TOPIC_LABELS[post.topic] || post.topic || 'Tech Stack'}{post.published ? ` · ${post.published.slice(0, 10)}` : post.date ? ` · ${post.date}` : ''}</span>
            </div>
            <button type="button" className="lp-modal-close" onClick={() => setReaderPost(null)} title="Close">✕</button>
          </header>
          <div className="lp-reader-body">
            {images.length > 0 && (
              <div className="lp-reader-media">
                {images.map((url, i) => (
                  <img key={`r-${i}`} src={linkedinImgProxy(url)} alt={`Post image ${i + 1}`} loading="lazy" onError={e => handleImgError(e, url)} />
                ))}
              </div>
            )}
            {blocks.map((b, i) => b.type === 'h'
              ? <h3 key={i} className="lp-reader-h">{b.text}</h3>
              : b.type === 'bullet'
                ? <div key={i} className="lp-reader-bullet"><span className="lp-reader-dot">▸</span><span>{b.text}</span></div>
                : <p key={i} className="lp-reader-para">{b.text}</p>)}
          </div>
          <footer className="lp-reader-foot">
            {post.url && <a className="lpc-action lpc-action-link" href={post.url} target="_blank" rel="noopener noreferrer">↗ Open original on LinkedIn</a>}
            <button type="button" className={`lpc-action ${liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
              👍 {liked ? 'Liked' : 'Like'}
            </button>
          </footer>
        </div>
      </div>
    )
  }

  // ── Country papers ──
  const [paperCountry, setPaperCountry] = useState('all')
  const [paperQuery, setPaperQuery] = useState('')
  const papersMap = useMemo(() => papersByCountry(), [])
  const filteredPapers = useMemo(() => {
    const needle = paperQuery.trim().toLowerCase()
    return COUNTRY_PAPERS.filter(p => {
      if (paperCountry !== 'all' && p.country !== paperCountry) return false
      if (needle && !(`${p.title} ${p.publisher} ${p.tags.join(' ')} ${p.summary}`.toLowerCase().includes(needle))) return false
      return true
    })
  }, [paperCountry, paperQuery])
  useEffect(() => { setPaperPage(1) }, [paperCountry, paperQuery])
  const paperTotalPages = Math.max(1, Math.ceil(filteredPapers.length / PAPER_PAGE_SIZE))
  const paperPageItems = useMemo(
    () => filteredPapers.slice((paperPage - 1) * PAPER_PAGE_SIZE, paperPage * PAPER_PAGE_SIZE),
    [filteredPapers, paperPage],
  )

  const paperCounts = useMemo(() => {
    const counts = { all: COUNTRY_PAPERS.length }
    for (const p of COUNTRY_PAPERS) counts[p.country] = (counts[p.country] || 0) + 1
    return counts
  }, [])

  const paperCountryMeta = (key) => PAPER_COUNTRIES.find(c => c.key === key) || { label: key, flag: '🏳️', color: '#89b4fa' }

  // ── LinkedIn-style card sub-components (inline) ──
  const renderPostImage = (post) => {
    const img = imageFor(post.id, imagePool)
    if (!img) return null
    return (
      <a className="lpc-image" href={post.url || img.url} target="_blank" rel="noopener noreferrer" title={`Open image: ${img.name}`}>
        <img src={img.url} alt={img.name} loading="lazy" decoding="async" />
      </a>
    )
  }

  const renderActions = (post, liked) => (
    <div className="lpc-actions" onClick={e => e.stopPropagation()}>
      <button
        type="button"
        className={`lpc-action ${liked ? 'liked' : ''}`}
        onClick={() => toggleLike(post.id)}
        title="Like (local)"
      >
        👍 {liked ? 'Liked' : 'Like'} · {liked ? 1 : 0}
      </button>
      <span className="lpc-action lpc-action-static" title="Comments open on the original post">💬 Comment</span>
      {post.url && (
        <a className="lpc-action lpc-action-link" href={post.url} target="_blank" rel="noopener noreferrer" title="Open the original LinkedIn post section">
          ↗ Open on LinkedIn
        </a>
      )}
      {post.profileUrl && post.profileUrl !== post.url && (
        <a className="lpc-action lpc-action-link" href={post.profileUrl} target="_blank" rel="noopener noreferrer" title="Open the author/company profile">
          👤 Profile
        </a>
      )}
    </div>
  )

  const renderDailyCard = (post) => {
    const liked = likedPosts.has(post.id)
    const color = avatarColor(post.profile)
    const poolImg = imageFor(post.id, imagePool)
    return (
      <article
        key={post.id}
        className="lpc"
        style={{ '--post-accent': color, cursor: 'pointer' }}
        onClick={() => setOpenPost({ ...post, images: post.images || (poolImg ? [poolImg.url] : []) })}
      >
        <header className="lpc-head">
          <span className="lpc-avatar" style={{ background: color + '26', color, borderColor: color + '66' }}>
            {(post.profile || 'L').charAt(0)}
          </span>
          <div className="lpc-id">
            <div className="lpc-name-row">
              <strong className="lpc-name">{post.profile || 'LinkedIn'}</strong>
              {post.profileUrl && (
                <a className="lpc-follow" href={post.profileUrl} target="_blank" rel="noopener noreferrer">· Follow ↗</a>
              )}
            </div>
            <span className="lpc-sub">
              {post.profileTagline || 'AI tech-stack daily note'} · {formatDayShort(post.date)}
              {post.topic ? ` · ${String(post.topic).replace(/_/g, ' ')}` : ''}
            </span>
          </div>
          <span className="lpc-badge" title="Fetched daily post">📅 Daily</span>
          {isFuture(post.date) && <span className="lpc-badge future" title="Generated preview for a future date">🔮 Preview</span>}
        </header>
        <div className="lpc-body">
          <pre className="lpc-text">{post.content}</pre>
        </div>
        {renderPostImage(post)}
        {renderActions(post, liked)}
      </article>
    )
  }

  const renderCollectionCard = (post) => {
    const isExpanded = expandedPosts.has(post.id)
    const catMeta = LINKEDIN_POST_CATEGORIES.find(c => c.key === post.category) || {}
    const color = catMeta.color || '#89b4fa'
    const liked = likedPosts.has(`c-${post.id}`)
    const searchUrl = `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(post.title)}`
    return (
      <article key={post.id} className="lpc" style={{ '--post-accent': color }}>
        <header className="lpc-head" onClick={() => setOpenPost({
          ...post,
          author: post.author || catMeta.label || 'AI LinkedIn',
          images: post.images || (imageFor(post.id, imagePool) ? [imageFor(post.id, imagePool).url] : []),
          url: post.url || searchUrl,
        })} style={{ cursor: 'pointer' }}>
          <span className="lpc-avatar" style={{ background: color + '26', color, borderColor: color + '66' }}>
            {catMeta.icon || '📝'}
          </span>
          <div className="lpc-id">
            <div className="lpc-name-row">
              <strong className="lpc-name">{catMeta.label || 'AI LinkedIn'}</strong>
            </div>
            <span className="lpc-sub">{post.title}</span>
          </div>
          <span className="lpc-badge" style={{ background: color + '1f', color, borderColor: color + '44' }}>
            {isExpanded ? '▾ Collapse' : '▸ Expand'}
          </span>
        </header>
        <div className="lpc-body">
          <pre className="lpc-text">{post.content}</pre>
        </div>
        {renderPostImage(post)}
        <div className="lpc-actions">
          <button type="button" className={`lpc-action ${liked ? 'liked' : ''}`} onClick={e => { e.stopPropagation(); toggleLike(`c-${post.id}`) }}>
            👍 {liked ? 'Liked' : 'Like'} · {liked ? 1 : 0}
          </button>
          <a
            className="lpc-action lpc-action-link"
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Find "${post.title}" on LinkedIn`}
            onClick={e => e.stopPropagation()}
          >
            ↗ Open original on LinkedIn
          </a>
          <span className="lpc-tag-row">
            {post.tags.slice(0, 4).map((t, i) => <span key={i} className="lpc-tag">{t}</span>)}
            {post.tags.length > 4 && <span className="lpc-tag lpc-tag-more">+{post.tags.length - 4}</span>}
          </span>
        </div>
      </article>
    )
  }

  return (
    <div className="lp-page" style={{ '--zoom': zoom }}>
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <div className="lp-hero">
        <div className="lp-title-row">
          <div className="page-header-row">
            <h1>🔗 {lpHeader.title}</h1>
          </div>
          <div className="lp-chips">
            {lpHeader.chips.map((c, i) => <span key={i} className="lp-chip">{c}</span>)}
          </div>
        </div>
        <p className="lp-subtitle">{lpHeader.subtitle}</p>
      </div>

      {/* ═══ LIVE FEED (real LinkedIn posts) ═══ */}
      <section className="lp-card lp-live-section" id="live">
        <div className="lp-section-head">
          <h3>🟢 Live LinkedIn Feed — Real Tech-Stack Posts</h3>
          <p className="lp-card-sub">
            Real posts fetched live from LinkedIn for all 40 tech-stack topics — AI, ML, AI Agents, Python, FastAPI, ReactJS, NextJS,
            Multi-Agents, RAG, MCP, LangChain, LangGraph, VectorDB, Workflows, CrewAI, Tool Calling, Memory, Gateways, Loops, Graphs,
            Spring AI, Evals, Observability, GuardRails, ReAct, Patterns, AutoGen, LoRA, MLOps, Embeddings, LlamaIndex, LLMs, Prompting,
            Fine-Tuning, Governance, Looping, Graphics, Quantum, Chips, IoT, AGI, ASI, Super AI.
          </p>
        </div>

        <div className="lpl-toolbar">
          <select className="lpd-input" value={liveTopic} onChange={e => setLiveTopic(e.target.value)} title="Tech-stack topic">
            <option value="mixed">🔀 Mixed topics</option>
            {LIVE_TOPICS.map(t => (
              <option key={t} value={t}>{LIVE_TOPIC_LABELS[t] || t}</option>
            ))}
          </select>
          <select
            className="lpd-input"
            value={liveTimeRange}
            onChange={e => { setLiveTimeRange(e.target.value); setLiveDateMode(false) }}
            title="How recent should posts be"
          >
            <option value="latest">🟢 Latest (this week)</option>
            <option value="month">🗓 Past month</option>
            <option value="any">♾ Any time</option>
          </select>
          <button
            type="button"
            className={`lpd-fetch-btn ${liveDateMode ? 'active' : ''}`}
            onClick={() => setLiveDateMode(v => !v)}
            title="Show posts from one specific date"
          >
            📅 {t('By date')}
          </button>
          {liveDateMode && (
            <input
              type="date"
              className="lpd-input"
              value={liveDate}
              onChange={e => setLiveDate(e.target.value)}
              title="Pick the date"
            />
          )}
          {liveDateMode && liveDate && (
            <button
              type="button"
              className="lpd-fetch-btn"
              onClick={() => loadLivePosts({ date: liveDate, refresh: true })}
              disabled={liveLoading}
            >
              {liveLoading ? '⏳ …' : t('Fetch date')}
            </button>
          )}
          <button
            type="button"
            className="lpd-fetch-btn"
            onClick={() => loadLivePosts({ refresh: true })}
            disabled={liveLoading}
            title="Pull the freshest posts from LinkedIn"
          >
            {liveLoading ? '⏳ Fetching…' : t('🔄 Refresh Live')}
          </button>
          <button
            type="button"
            className="lpd-fetch-btn wide"
            onClick={() => loadLivePosts({ topic: '__all__', all: true })}
            disabled={liveLoading}
            title="Fetch every tech-stack topic (quota-protected batches — press again for the next batch)"
          >
            {liveLoading ? '⏳ Fetching topics…' : t('⚡ Fetch All Topics')}
          </button>
          <div className="lpl-zoom" title="Zoom the reading size">
            <span className="lpl-zoom-label">🔍 {t('Zoom')}</span>
            <button type="button" className="lpl-zoom-btn" onClick={zoomOut} disabled={zoom <= 0.85} aria-label="Zoom out">−</button>
            <span className="lpl-zoom-value">{Math.round(zoom * 100)}%</span>
            <button type="button" className="lpl-zoom-btn" onClick={zoomIn} disabled={zoom >= 1.5} aria-label="Zoom in">+</button>
            <button type="button" className="lpl-zoom-btn reset" onClick={zoomReset} title="Reset zoom">↺</button>
          </div>
          {liveFetchedAt && <span className="lpl-updated">Updated {new Date(liveFetchedAt).toLocaleTimeString()}</span>}
          {liveError && <span className="lpd-status err">⚠️ {liveError}</span>}
          {liveNote && <span className="lpd-status ok">💡 {liveNote}</span>}
        </div>

        {/* ── Live-feed calendar (date-wise feed view) ── */}
        <div className="lpl-cal-wrap">
          <div className="lpl-cal">
            <div className="lpd-cal-nav">
              <button type="button" className="lpd-cal-btn" onClick={() => setLiveCalMonth(new Date(liveCalMonth.getFullYear(), liveCalMonth.getMonth() - 1, 1))} title="Previous month">‹</button>
              <strong>{liveCalMonth.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</strong>
              <button type="button" className="lpd-cal-btn" onClick={() => setLiveCalMonth(new Date(liveCalMonth.getFullYear(), liveCalMonth.getMonth() + 1, 1))} title="Next month">›</button>
            </div>
            <div className="lpd-cal-grid">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <span key={d} className="lpd-cal-dow">{d}</span>)}
              {liveCalendarCells.map((iso, i) => {
                if (!iso) return <span key={`pad-${i}`} className="lpd-cal-cell lpd-cal-pad" />
                const count = liveDayCounts[iso] || 0
                const isFiltered = liveDateFilter === iso
                const isToday = iso === isoOf(new Date())
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`lpd-cal-cell ${isFiltered ? 'filtered' : ''} ${isToday ? 'today' : ''} ${count ? 'has-posts' : ''}`}
                    onClick={() => setLiveDateFilter(prev => (prev === iso ? null : iso))}
                    title={count ? `${iso} — ${count} live post${count === 1 ? '' : 's'}` : iso}
                  >
                    <span className="lpd-cal-day">{Number(iso.slice(-2))}</span>
                    {count > 0 && <span className="lpd-cal-count">{count}</span>}
                  </button>
                )
              })}
            </div>
            {liveDateFilter && (
              <button type="button" className="lpd-clear-filter" onClick={() => setLiveDateFilter(null)}>
                ✕ Showing {liveDateFilter} — show all
              </button>
            )}
          </div>
        </div>

        {liveLoading && livePosts.length === 0 ? (
          <div className="lpd-empty"><span className="lpd-empty-icon">🛰️</span><strong>Fetching live LinkedIn posts…</strong></div>
        ) : visibleLivePosts.length === 0 ? (
          <div className="lpd-empty">
            <span className="lpl-empty-icon">📡</span>
            <strong>{liveDateFilter ? `No live posts on ${liveDateFilter}` : 'No live posts yet'}</strong>
            <p>Press <em>Refresh Live</em> to pull the latest tech-stack posts from LinkedIn.</p>
          </div>
        ) : (
          <>
            <div className="lpc-grid" style={{ '--zoom': zoom }}>
              {shownLivePosts.map(renderLiveCard)}
            </div>
            {visibleLivePosts.length > shownLivePosts.length && (
              <div className="lp-pager">
                <span>{shownLivePosts.length} of {visibleLivePosts.length} live posts</span>
                <button type="button" className="lpd-fetch-btn" onClick={() => setLiveVisible(n => n + LIVE_PAGE_SIZE)}>{t('Load more ↓')}</button>
                <button type="button" className="lpd-fetch-btn wide" onClick={() => setLiveVisible(visibleLivePosts.length)}>{t('Show all')}</button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ═══ DAILY POSTS · CALENDAR + FEED ═══ */}
      <section className="lp-card lp-daily-section" id="daily">
        <div className="lp-section-head">
          <h3>📅 Daily LinkedIn Posts — Calendar & Archive</h3>
          <p className="lp-card-sub">
            Pick a date (or fetch the whole month), then read every post date-wise in a LinkedIn-style feed.
            Fetched days persist in this browser — {totalArchived} post{totalArchived === 1 ? '' : 's'} archived so far.
          </p>
        </div>

        <div className="lpd-layout">
          {/* ── Calendar column ── */}
          <aside className="lpd-calendar">
            <div className="lpd-cal-nav">
              <button type="button" className="lpd-cal-btn" onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))} title="Previous month">‹</button>
              <strong>{calMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</strong>
              <button type="button" className="lpd-cal-btn" onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))} title="Next month">›</button>
            </div>
            <div className="lpd-cal-grid">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <span key={d} className="lpd-cal-dow">{d}</span>)}
              {calendarCells.map((iso, i) => {
                if (!iso) return <span key={`pad-${i}`} className="lpd-cal-cell lpd-cal-pad" />
                const count = archivedCountFor(iso)
                const isSelected = iso === dailyDate
                const isFiltered = iso === dateFilter
                const isToday = iso === isoOf(new Date())
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`lpd-cal-cell ${isSelected ? 'selected' : ''} ${isFiltered ? 'filtered' : ''} ${isToday ? 'today' : ''} ${count ? 'has-posts' : ''}`}
                    onClick={() => { setDailyDate(iso); setDateFilter(prev => (prev === iso ? null : iso)) }}
                    title={count ? `${iso} — ${count} post${count === 1 ? '' : 's'} archived` : `${iso} — no posts yet, click to fetch`}
                  >
                    <span className="lpd-cal-day">{Number(iso.slice(-2))}</span>
                    {count > 0 && <span className="lpd-cal-count">{count}</span>}
                  </button>
                )
              })}
            </div>
            <div className="lpd-cal-legend">
              <span><i className="dot has-posts" /> fetched</span>
              <span><i className="dot today" /> today</span>
              <span><i className="dot filtered" /> filtered</span>
            </div>
            {dateFilter && (
              <button type="button" className="lpd-clear-filter" onClick={() => setDateFilter(null)}>
                ✕ Showing only {formatDayShort(dateFilter)} — show all dates
              </button>
            )}
          </aside>

          {/* ── Fetch toolbar + feed column ── */}
          <div className="lpd-main">
            <div className="lpd-toolbar">
              <div className="lpd-toolbar-row">
                <span className="lpd-label">📅 {t('Fetch by date')}</span>
                <input
                  type="date"
                  className={`lpd-input ${isFuture(dailyDate) ? 'future-date' : ''}`}
                  value={dailyDate}
                  onChange={e => { setDailyDate(e.target.value); if (dateFilter) setDateFilter(e.target.value) }}
                />
                {isFuture(dailyDate) && (
                  <button
                    type="button"
                    className="lpd-fetch-btn"
                    onClick={() => scheduleAutoFetch(dailyDate)}
                    disabled={scheduledDates.includes(dailyDate)}
                    title="Auto-fetch this date's real posts when the day arrives"
                  >
                    {scheduledDates.includes(dailyDate) ? t('⏰ Scheduled') : t('⏰ Auto-fetch on day')}
                  </button>
                )}
                <button
                  type="button"
                  className="lpd-fetch-btn"
                  onClick={() => handleFetchDay(dailyDate)}
                  disabled={dailyFetching}
                  title="Fetch the posts for the selected date (future dates get generated previews)"
                >
                  {dailyFetching && !fetchAllMode ? '⏳ Fetching…' : isFuture(dailyDate) ? t('🔮 Preview This Date') : t('🔄 Fetch This Date')}
                </button>
              </div>
              <div className="lpd-toolbar-row">
                <span className="lpd-label">🌐 {t('Fetch range')}</span>
                <select className="lpd-input" value={rangeDays} onChange={e => setRangeDays(Number(e.target.value))} title="How far back to fetch (date-wise, all posts kept)">
                  <option value={30}>Last month</option>
                  <option value={90}>Last 3 months</option>
                  <option value={182}>Last 6 months</option>
                  <option value={365}>Last 1 year</option>
                  <option value={730}>Last 2 years</option>
                  <option value={1826}>Last 5 years</option>
                </select>
                <button
                  type="button"
                  className="lpd-fetch-btn wide"
                  onClick={() => handleFetchRange(rangeDays)}
                  disabled={rangeFetching || dailyFetching}
                  title={`Fetch every day of the last ${rangeDays} days (batched, all posts kept date-wise)`}
                >
                  {rangeFetching ? '⏳ Fetching range…' : `⚡ Fetch ${rangeDays >= 365 ? `${Math.round(rangeDays / 365)} year${rangeDays >= 730 ? 's' : ''}` : `${rangeDays} days`}`}
                </button>
                <button
                  type="button"
                  className="lpd-fetch-btn"
                  onClick={handleFetchAll}
                  disabled={dailyFetching || rangeFetching}
                  title={`Fetch every day of ${calMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
                >
                  {dailyFetching && fetchAllMode ? '⏳ …' : `📅 ${calMonth.toLocaleDateString('en-GB', { month: 'short' })}`}
                </button>
              </div>
              {rangeFetching && rangeProgress && <div className="lpd-status ok">⏳ {rangeProgress}</div>}
              <div className="lpd-toolbar-row">
                <span className="lpd-label">🎚 {t('Options')}</span>
                <select className="lpd-input lpd-topic" value={dailyTopic} onChange={e => setDailyTopic(e.target.value)} title="Tech-stack topic (All = mixed daily set)">
                  <option value="all">All topics</option>
                  {LINKEDIN_DAILY_TOPICS.map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <select className="lpd-input" value={perDay} onChange={e => setPerDay(Number(e.target.value))} title="Posts per day">
                  <option value={4}>4 / day</option>
                  <option value={6}>6 / day</option>
                  <option value={8}>8 / day</option>
                </select>
                {profiles.length > 0 && (
                  <select className="lpd-input" value={dailyProfile} onChange={e => setDailyProfile(e.target.value)} title="Attribute posts to a profile">
                    <option value="all">All profiles</option>
                    {profiles.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
                  </select>
                )}
              </div>
              {dailyStatus && <div className="lpd-status ok">{dailyStatus}</div>}
              {dailyError && <div className="lpd-status err">⚠️ {dailyError}</div>}
            </div>

            <div className="lpd-feed-head">
              <h4>
                {dateFilter ? `📡 Feed — ${formatDate(dateFilter)}` : '📡 Feed — all fetched dates'}
              </h4>
              <div className="lpd-feed-meta">
                <span>{feedDays.reduce((n, d) => n + d.posts.length, 0)} posts · {feedDays.length} day{feedDays.length === 1 ? '' : 's'}</span>
                <button type="button" className="lpd-clear-btn" onClick={clearArchive} title="Remove all archived posts">🗑 {t('Clear archive')}</button>
              </div>
            </div>

            {feedDays.length === 0 ? (
              <div className="lpd-empty">
                <span className="lpd-empty-icon">📭</span>
                <strong>No posts archived yet</strong>
                <p>Pick a date and press <em>Fetch This Date</em>, or grab the whole month with <em>Fetch All</em>.</p>
              </div>
            ) : (
              pagedFeedDays.map(day => (
                <div key={day.date} className="lpd-day-group">
                  <div className="lpd-day-head">
                    <span className="lpd-day-date">📅 {formatDate(day.date)}</span>
                    <span className="lpd-day-count">{day.posts.length} post{day.posts.length === 1 ? '' : 's'}</span>
                    <button
                      type="button"
                      className="lpd-day-refetch"
                      onClick={() => handleFetchDay(day.date)}
                      disabled={dailyFetching}
                      title="Re-fetch this date"
                    >
                      🔄
                    </button>
                  </div>
                  <div className="lpc-grid">
                    {day.posts.map(renderDailyCard)}
                  </div>
                </div>
              ))
            )}

            {feedDays.length > 0 && (() => {
              const totalPages = Math.max(1, Math.ceil(feedDays.length / DAILY_PAGE_SIZE))
              return (
                <div className="lp-pager">
                  <button type="button" className="lpd-fetch-btn" disabled={dailyPage <= 1} onClick={() => setDailyPage(p => p - 1)}>‹ {t('Prev')}</button>
                  <span>Page {dailyPage} of {totalPages} · {feedDays.length} day{feedDays.length === 1 ? '' : 's'}</span>
                  <button type="button" className="lpd-fetch-btn" disabled={dailyPage >= totalPages} onClick={() => setDailyPage(p => p + 1)}>{t('Next ›')}</button>
                </div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* ═══ COUNTRY PAPERS ═══ */}
      <section className="lp-card lp-papers-section" id="papers">
        <div className="lp-section-head">
          <h3>🏛️ AI Papers & Policy by Country</h3>
          <p className="lp-card-sub">
            {COUNTRY_PAPERS_STATS.total} key papers, regulations, frameworks and strategy documents across {COUNTRY_PAPERS_STATS.countries} countries/regions —
            the governance layer of the AI tech stack. Every card links to the original source.
          </p>
        </div>

        <div className="lpp-toolbar">
          <input
            type="text"
            className="lp-gallery-search"
            placeholder={`Search ${COUNTRY_PAPERS.length} papers by title, publisher, or tag…`}
            value={paperQuery}
            onChange={e => setPaperQuery(e.target.value)}
          />
          <div className="lp-gallery-filters">
            <button
              className={`lp-filter ${paperCountry === 'all' ? 'active' : ''}`}
              onClick={() => setPaperCountry('all')}
            >
              🌍 All ({paperCounts.all})
            </button>
            {PAPER_COUNTRIES.filter(c => c.key !== 'global' || paperCounts[c.key]).map(c => (
              <button
                key={c.key}
                className={`lp-filter ${paperCountry === c.key ? 'active' : ''}`}
                onClick={() => setPaperCountry(c.key)}
                style={paperCountry === c.key ? { background: c.color + '22', borderColor: c.color, color: c.color } : undefined}
              >
                {c.flag} {c.label} ({paperCounts[c.key] || 0})
              </button>
            ))}
          </div>
        </div>

        {filteredPapers.length === 0 ? (
          <div className="lp-empty">No papers match your search.</div>
        ) : (
          <>
          {paperPageItems.length > 0 && (
            <div className="lp-pager" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="lp-filter" disabled={paperPage <= 1} onClick={() => setPaperPage(p => p - 1)}>‹ {t('Prev')}</button>
              <span style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,.6)', alignSelf: 'center' }}>Papers page {paperPage} of {paperTotalPages} · {filteredPapers.length} total</span>
              <button type="button" className="lp-filter" disabled={paperPage >= paperTotalPages} onClick={() => setPaperPage(p => p + 1)}>{t('Next ›')}</button>
            </div>
          )}
          <div className="lpp-grid">
            {paperPageItems.map(p => {
              const meta = paperCountryMeta(p.country)
              return (
                <article key={p.id} className="lpp-card" style={{ '--paper-accent': meta.color }}>
                  <div className="lpp-top">
                    <span className="lpp-flag">{meta.flag}</span>
                    <span className="lpp-country">{meta.label}</span>
                    <span className="lpp-type">{p.type}</span>
                  </div>
                  <h4 className="lpp-title">{p.title}</h4>
                  <p className="lpp-summary">{p.summary}</p>
                  <div className="lpp-meta">
                    <span className="lpp-publisher">🏢 {p.publisher}</span>
                    <span className="lpp-date">📆 {formatDayShort(p.date)}</span>
                  </div>
                  <div className="lpp-bottom">
                    <span className="lpp-tags">
                      {p.tags.slice(0, 3).map((t, i) => <span key={i} className="lpc-tag">{t}</span>)}
                    </span>
                    <a className="lpp-link" href={p.url} target="_blank" rel="noopener noreferrer" title={`Open: ${p.title}`}>
                      📄 Read paper ↗
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="lp-pager">
            <button type="button" className="lp-filter" disabled={paperPage <= 1} onClick={() => setPaperPage(p => p - 1)}>‹ {t('Prev')}</button>
            <span style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,.6)', alignSelf: 'center' }}>Page {paperPage} of {paperTotalPages} · {filteredPapers.length} papers</span>
            <button type="button" className="lp-filter" disabled={paperPage >= paperTotalPages} onClick={() => setPaperPage(p => p + 1)}>{t('Next ›')}</button>
          </div>
          </>
        )}
      </section>

      {/* ═══ CURATED COLLECTION (LinkedIn-style cards) ═══ */}
      <section className="lp-card lp-posts-section">
        <div className="lp-section-head">
          <h3>📝 AI LinkedIn Posts Collection</h3>
          <p className="lp-card-sub">{LINKEDIN_POSTS_STATS.total} curated posts across {LINKEDIN_POSTS_STATS.categories} topics — rendered like the original LinkedIn feed.</p>
        </div>

        <div className="lp-posts-toolbar">
          <input
            type="text"
            className="lp-gallery-search"
            placeholder={`Search ${LINKEDIN_POSTS.length} posts by title, content, or tag…`}
            value={postQuery}
            onChange={e => setPostQuery(e.target.value)}
          />
          <div className="lp-gallery-filters lp-posts-filters">
            {LINKEDIN_POST_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`lp-filter ${postCat === cat.key ? 'active' : ''}`}
                onClick={() => setPostCat(cat.key)}
                style={postCat === cat.key ? { background: cat.color + '22', borderColor: cat.color, color: cat.color } : undefined}
              >
                {cat.icon} {cat.label} ({postsByCat[cat.key] || 0})
              </button>
            ))}
          </div>
        </div>

        <div className="lp-posts-status">
          <span>Showing {filteredPosts.length} of {LINKEDIN_POSTS.length} curated posts</span>
        </div>

        <div className="lpc-grid">
          {collPageItems.map(renderCollectionCard)}
        </div>

        {filteredPosts.length > COLL_PAGE_SIZE && (
          <div className="lp-pager">
            <button type="button" className="lp-filter" disabled={collPage <= 1} onClick={() => setCollPage(p => p - 1)}>‹ {t('Prev')}</button>
            <span style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,.6)', alignSelf: 'center' }}>Page {collPage} of {collTotalPages} · {filteredPosts.length} posts</span>
            <button type="button" className="lp-filter" disabled={collPage >= collTotalPages} onClick={() => setCollPage(p => p + 1)}>{t('Next ›')}</button>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="lp-empty">No posts match your search. Try different keywords.</div>
        )}
      </section>

      <section className="lp-card">
        <div className="lp-book-head">
          <h3>📖 {linkedinBookMeta.title}</h3>
          <p className="lp-card-sub" style={{ margin: 0 }}>{linkedinBookMeta.subtitle} <span className="lp-tab-note">{linkedinBookMeta.readingTime}</span></p>
        </div>
        <LinkedInBookReader />
      </section>

      <LinkedInAiBlogReader />

      {renderPostDetail()}

      {renderReaderModal()}

      <div className="lp-footer">— {lpFooter} —</div>
    </div>
  )
}
