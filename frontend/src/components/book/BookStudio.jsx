import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { LANGUAGES, useLang } from '../../i18n'
import COUNTRY_LANG from '../../countryLang.json'
import { getBookCoverUrl, getBookLinkGroups, isFreeBook } from '../../data/bookHelpers'
import { getOutline, getChapterText, askBook } from './bookAi'
import { splitSentences, useNarrator, useVoices, voicesFor, useDictation, ttsSupported, sttSupported } from './speech'
import './BookStudio.css'

const TABS = [
  { key: 'chapters', icon: '🧭', label: 'Chapters' },
  { key: 'audio', icon: '🎧', label: 'Audio Podcast' },
  { key: 'video', icon: '🎬', label: 'Video Podcast' },
  { key: 'read', icon: '📖', label: 'Reader' },
  { key: 'ask', icon: '💬', label: 'Ask the Book' },
]

const BOOK_LANGS = LANGUAGES.filter(l => l.code !== 'auto')
const LANG_MAP = Object.fromEntries(BOOK_LANGS.map(l => [l.code.toLowerCase(), l]))

const flagOf = cc => (/^[a-z]{2}$/i.test(cc) ? cc.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0))) : '🌐')
const COUNTRIES = (() => {
  let dn = null
  try { dn = new Intl.DisplayNames(['en'], { type: 'region' }) } catch { /* old browser */ }
  return Object.entries(COUNTRY_LANG)
    .filter(([cc]) => /^[a-z]{2}$/i.test(cc))
    .map(([cc, lang]) => {
      let name = cc.toUpperCase()
      try { name = dn?.of(cc.toUpperCase()) || name } catch { /* unknown region */ }
      return { cc, lang, name, flag: flagOf(cc) }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
})()

const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const mins = text => Math.max(1, Math.round(String(text).split(/\s+/).length / 150))

function Wave({ active, color }) {
  return (
    <span className={`bs-wave ${active ? 'on' : ''}`} style={{ '--wc': color }} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />)}
    </span>
  )
}

export default function BookStudio({ book, cat, cover = null, readUrl = '' }) {
  const coverSrc = size => (cover && cover[size]) || getBookCoverUrl(book, size)
  const { resolved } = useLang()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some(x => x.key === params.get('studio')) ? params.get('studio') : 'chapters'
  const setTab = key => {
    const next = new URLSearchParams(params)
    next.set('studio', key)
    setParams(next, { replace: true })
  }

  // ---- language / country ----
  const initialLang = lsGet('bs.lang', null) || (LANG_MAP[String(resolved).toLowerCase()] ? resolved : 'en')
  const [lang, setLang] = React.useState(initialLang)
  const [country, setCountry] = React.useState(lsGet('bs.country', ''))
  const L = LANG_MAP[String(lang).toLowerCase()] || LANG_MAP.en
  const langName = `${L.name} (${L.native})`
  const dir = L.rtl ? 'rtl' : 'ltr'
  const pickLang = code => { setLang(code); lsSet('bs.lang', code) }
  const pickCountry = cc => {
    setCountry(cc); lsSet('bs.country', cc)
    const c = COUNTRIES.find(x => x.cc === cc)
    if (c && LANG_MAP[c.lang.toLowerCase()]) pickLang(c.lang)
  }

  // ---- outline ----
  const [outline, setOutline] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [progress, setProgress] = React.useState([0, 0])
  const [retry, setRetry] = React.useState(null)
  const loadOutline = React.useCallback(async force => {
    setLoading(true)
    setProgress([0, 0]); setRetry(null)
    const o = await getOutline(book, lang, langName, { force, onProgress: (done, total) => setProgress([done, total]), onRetry: (n, of) => { setRetry([n, of]); setProgress([0, 0]) } })
    setOutline(o)
    setLoading(false)
  }, [book, lang, langName])
  React.useEffect(() => { setOutline(null); setFullText({}); loadOutline(false) }, [loadOutline])

  // ---- full chapter text (reader + deep podcasts) ----
  const [fullText, setFullText] = React.useState({})
  const [generating, setGenerating] = React.useState(null)
  const ensureChapter = React.useCallback(async idx => {
    if (!outline) return ''
    if (fullText[idx]) return fullText[idx]
    setGenerating(idx)
    try {
      const txt = await getChapterText(book, outline, idx, lang, langName, partial => setFullText(f => ({ ...f, [idx]: partial })))
      setFullText(f => ({ ...f, [idx]: txt }))
      return txt
    } catch (e) {
      setFullText(f => ({ ...f, [idx]: `⚠️ Could not generate this chapter right now (${e.message}). Try again in a moment.` }))
      return ''
    } finally { setGenerating(null) }
  }, [book, outline, fullText, lang, langName])

  // ---- speech ----
  const narrator = useNarrator()
  const voices = useVoices()
  const langVoices = React.useMemo(() => voicesFor(voices, lang), [voices, lang])
  const [voiceIdx, setVoiceIdx] = React.useState(0)
  const [twoHosts, setTwoHosts] = React.useState(true)
  const [deep, setDeep] = React.useState(false)
  const [autoplay, setAutoplay] = React.useState(true)
  React.useEffect(() => { setVoiceIdx(0) }, [lang])
  React.useEffect(() => { narrator.stop() }, [tab, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const voicePool = React.useMemo(() => {
    if (!langVoices.length) return []
    const first = langVoices[voiceIdx] || langVoices[0]
    return [first, ...langVoices.filter(v => v !== first)]
  }, [langVoices, voiceIdx])

  const episodes = React.useMemo(() => {
    if (!outline) return []
    const en = String(lang).toLowerCase().startsWith('en')
    const intro = { title: book.title, kicker: en ? 'Introduction' : '✦', text: `${book.title}. ${book.author}. ${outline.overview || book.desc}`, points: [] }
    return [intro, ...outline.chapters.map((c, i) => ({
      title: c.title,
      kicker: `${en ? 'Chapter' : '§'} ${i + 1}`,
      chapter: i,
      points: c.points,
      takeaway: c.takeaway,
      text: deep && fullText[i] && generating !== i
        ? `${c.title}. ${fullText[i]}`
        : [c.title, c.precis, ...(c.points || []), c.takeaway].filter(Boolean).map(s => s.replace(/[.!?。]?$/, m => m || '.')).join(' '),
    }))]
  }, [outline, book, deep, fullText, generating, lang])

  const epSentences = React.useMemo(() => episodes.map(e => splitSentences(e.text, lang)), [episodes, lang])
  const [mode, curEp] = (narrator.trackId || ':-1').split(':')
  const currentEp = Number(curEp)

  const playEpisode = React.useCallback(async (m, idx, startAt = 0) => {
    if (idx < 0 || idx >= episodes.length) return
    let sentences = epSentences[idx]
    const ep = episodes[idx]
    if (deep && ep.chapter != null && !fullText[ep.chapter]) {
      const txt = await ensureChapter(ep.chapter)
      if (txt) sentences = splitSentences(`${ep.title}. ${txt}`, lang)
    }
    narrator.play({
      sentences, lang, voices: voicePool, twoHosts, trackId: `${m}:${idx}`, startAt,
      onEnd: () => { if (autoplay && idx + 1 < episodes.length) playEpisode(m, idx + 1) },
    })
  }, [episodes, epSentences, deep, fullText, ensureChapter, lang, narrator, voicePool, twoHosts, autoplay])

  const togglePlay = m => {
    if (mode === m && narrator.status === 'playing') narrator.pause()
    else if (mode === m && narrator.status === 'paused') narrator.resume()
    else playEpisode(m, Math.max(0, mode === m ? currentEp : 0))
  }

  const jump = (key, epIdx) => {
    setTab(key)
    if (key === 'read') setReadIdx(epIdx - 1)
    if (key === 'audio' || key === 'video') setTimeout(() => playEpisode(key, epIdx), 60)
  }

  // ---- reader ----
  const [readIdx, setReadIdx] = React.useState(() => lsGet(`bs.pos.${book.id}`, 0))
  const [readMode, setReadMode] = React.useState('full') // 'precis' | 'full' | 'book'
  const [prefs, setPrefs] = React.useState(() => lsGet('bs.readerPrefs', { size: 18, theme: 'night', serif: true }))
  const setPref = patch => setPrefs(p => { const n = { ...p, ...patch }; lsSet('bs.readerPrefs', n); return n })
  React.useEffect(() => { lsSet(`bs.pos.${book.id}`, readIdx) }, [book.id, readIdx])
  React.useEffect(() => {
    if (tab === 'read' && readMode === 'full' && outline && !fullText[readIdx] && generating == null) ensureChapter(readIdx)
  }, [tab, readMode, readIdx, outline]) // eslint-disable-line react-hooks/exhaustive-deps
  const [bookGen, setBookGen] = React.useState(false)
  const generateWholeBook = async () => {
    setBookGen(true)
    for (let i = 0; i < (outline?.chapters.length || 0); i++) {
      if (!fullText[i]) await ensureChapter(i) // eslint-disable-line no-await-in-loop
    }
    setBookGen(false)
  }
  const listenText = (text, id) => narrator.play({ sentences: splitSentences(text, lang), lang, voices: voicePool, twoHosts: false, trackId: `read:${id}` })

  // ---- ask ----
  const [chat, setChat] = React.useState([])
  const [question, setQuestion] = React.useState('')
  const [asking, setAsking] = React.useState(false)
  const [speakAnswers, setSpeakAnswers] = React.useState(true)
  const chatEnd = React.useRef(null)
  const send = React.useCallback(async q => {
    const text = String(q || '').trim()
    if (!text || asking || !outline) return
    setQuestion('')
    setAsking(true)
    const history = chat.map(m => ({ role: m.role, content: m.content }))
    setChat(c => [...c, { role: 'user', content: text }, { role: 'assistant', content: '' }])
    try {
      const answer = await askBook(book, outline, history, text, langName, partial => {
        setChat(c => { const n = [...c]; n[n.length - 1] = { role: 'assistant', content: partial }; return n })
      })
      if (speakAnswers && answer) narrator.play({ sentences: splitSentences(answer, lang), lang, voices: voicePool, twoHosts: false, trackId: 'ask:0' })
    } catch (e) {
      setChat(c => { const n = [...c]; n[n.length - 1] = { role: 'assistant', content: `⚠️ ${e.message}` }; return n })
    } finally { setAsking(false) }
  }, [asking, outline, chat, book, langName, speakAnswers, narrator, lang, voicePool])
  React.useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [chat])
  const dictation = useDictation(lang, txt => { if (tab === 'ask') send(txt) })

  // ---- video ----
  const stageRef = React.useRef(null)
  const goFullscreen = () => {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)
  }

  const free = isFreeBook(book)
  const links = getBookLinkGroups(book)
  const accent = cat.color
  const playingMode = narrator.status !== 'idle' ? mode : null

  // ---------- render helpers ----------
  const controls = m => {
    const on = mode === m && narrator.status === 'playing'
    const idx = mode === m ? currentEp : 0
    return (
      <div className="bs-controls">
        <button type="button" className="bs-ctl" onClick={() => playEpisode(m, Math.max(0, idx - 1))} aria-label="Previous episode">⏮</button>
        <button type="button" className="bs-ctl bs-ctl-main" onClick={() => togglePlay(m)} aria-label={on ? 'Pause' : 'Play'}>{on ? '⏸' : '▶'}</button>
        <button type="button" className="bs-ctl" onClick={() => playEpisode(m, Math.min(episodes.length - 1, idx + 1))} aria-label="Next episode">⏭</button>
        <button type="button" className="bs-ctl" onClick={narrator.stop} aria-label="Stop">⏹</button>
        <label className="bs-select-sm">
          <span>Speed</span>
          <select value={narrator.rate} onChange={e => narrator.setRate(Number(e.target.value))}>
            {[0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2].map(r => <option key={r} value={r}>{r}×</option>)}
          </select>
        </label>
      </div>
    )
  }

  const voiceBar = () => (
    <div className="bs-voicebar">
      {langVoices.length > 0 ? (
        <label className="bs-select-sm">
          <span>Voice</span>
          <select value={voiceIdx} onChange={e => setVoiceIdx(Number(e.target.value))}>
            {langVoices.map((v, i) => <option key={v.voiceURI} value={i}>{v.name} · {v.lang}</option>)}
          </select>
        </label>
      ) : (
        <span className="bs-warn">
          {ttsSupported
            ? `No ${L.name} voice is installed on this device — add one in iPhone/Mac Settings › Accessibility › Spoken Content › Voices, or Windows Settings › Time & language › Speech.`
            : 'This browser has no speech engine — try Safari, Chrome or Edge.'}
        </span>
      )}
      <label className="bs-toggle"><input type="checkbox" checked={twoHosts} onChange={e => setTwoHosts(e.target.checked)} /> Two-host podcast</label>
      <label className="bs-toggle"><input type="checkbox" checked={deep} onChange={e => setDeep(e.target.checked)} /> Deep dive (full chapters)</label>
      <label className="bs-toggle"><input type="checkbox" checked={autoplay} onChange={e => setAutoplay(e.target.checked)} /> Autoplay next</label>
    </div>
  )

  const curEpisode = episodes[Math.max(0, mode === 'video' ? currentEp : 0)] || episodes[0]
  const videoSentences = mode === 'video' && currentEp >= 0 ? (narrator.trackId && epSentences[currentEp]) || [] : []
  const caption = mode === 'video' && narrator.index >= 0 ? videoSentences[narrator.index] : ''
  const videoProgress = videoSentences.length ? (narrator.index + 1) / videoSentences.length : 0

  const readerText = readMode === 'full' ? fullText[readIdx] : null
  const ch = outline?.chapters[readIdx]

  return (
    <section className="bs" style={{ '--bs-accent': accent }} aria-label="Book Studio">
      <div className="bs-head">
        <div className="bs-title">
          <span className="bs-logo" aria-hidden="true">◐</span>
          <div>
            <h2>Book Studio</h2>
            <p>Audio &amp; video podcasts, chapter précis, full reader and voice Q&amp;A — in {BOOK_LANGS.length} languages across {COUNTRIES.length} countries.</p>
          </div>
        </div>
        <div className="bs-lang">
          <label className="bs-field">
            <span>🌍 Country</span>
            <select value={country} onChange={e => pickCountry(e.target.value)}>
              <option value="">Any country</option>
              {COUNTRIES.map(c => <option key={c.cc} value={c.cc}>{c.flag} {c.name}</option>)}
            </select>
          </label>
          <label className="bs-field">
            <span>🗣️ Language</span>
            <select value={lang} onChange={e => pickLang(e.target.value)}>
              {BOOK_LANGS.map(l => <option key={l.code} value={l.code}>{l.native} — {l.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      <nav className="bs-tabs" role="tablist">
        {TABS.map(x => (
          <button key={x.key} type="button" role="tab" aria-selected={tab === x.key} className={`bs-tab ${tab === x.key ? 'on' : ''}`} onClick={() => setTab(x.key)}>
            <span aria-hidden="true">{x.icon}</span> {x.label}
            {playingMode === x.key && <Wave active={narrator.status === 'playing'} color={accent} />}
          </button>
        ))}
      </nav>

      {loading && (
        <div className="bs-loading">
          <span className="bs-spinner" />
          <div>
            Preparing the {L.name} study companion for <b>{book.title}</b>…
            <div className="bs-loading-sub">{progress[1] ? `Chapter ${progress[0]} of ${progress[1]} written` : retry ? `The free AI service is busy — retrying (attempt ${retry[0]} of ${retry[1]})…` : 'Contacting the AI writer — this takes about 30–60 seconds the first time, then it is cached.'}</div>
            {progress[1] > 0 && <div className="bs-progress bs-loading-bar"><i style={{ width: `${(progress[0] / progress[1]) * 100}%` }} /></div>}
          </div>
        </div>
      )}

      {!loading && outline && (
        <div className="bs-body" dir={dir}>
          {outline.source === 'template' && (
            <div className="bs-note">The free AI service is unavailable right now (its daily free quota resets at midnight UTC), so a basic guide is shown. <button type="button" onClick={() => loadOutline(true)}>Retry</button></div>
          )}

          {/* ===== CHAPTERS ===== */}
          {tab === 'chapters' && (
            <div className="bs-chapters">
              <div className="bs-overview">
                <h3>Overview</h3>
                <p>{outline.overview || book.desc}</p>
                <div className="bs-overview-actions">
                  <button type="button" className="bs-btn bs-btn-primary" onClick={() => jump('audio', 0)}>🎧 Listen to the podcast</button>
                  <button type="button" className="bs-btn" onClick={() => jump('video', 0)}>🎬 Watch the video</button>
                  <button type="button" className="bs-btn" onClick={() => { setReadMode('book'); setTab('read') }}>📖 Read complete book</button>
                  <button type="button" className="bs-btn" onClick={() => setTab('ask')}>💬 Ask a question</button>
                  <button type="button" className="bs-btn bs-btn-ghost" onClick={() => loadOutline(true)} title="Generate a fresh outline">↻ Regenerate</button>
                </div>
              </div>
              <div className="bs-ch-grid">
                {outline.chapters.map((c, i) => (
                  <article key={i} className="bs-ch-card">
                    <div className="bs-ch-num">{String(i + 1).padStart(2, '0')}</div>
                    <h4>{c.title}</h4>
                    <p>{c.precis}</p>
                    {c.points?.length > 0 && <ul>{c.points.map((p, k) => <li key={k}>{p}</li>)}</ul>}
                    {c.takeaway && <div className="bs-takeaway">💡 {c.takeaway}</div>}
                    <div className="bs-ch-actions">
                      <button type="button" onClick={() => jump('audio', i + 1)}>🎧 Listen</button>
                      <button type="button" onClick={() => jump('video', i + 1)}>🎬 Watch</button>
                      <button type="button" onClick={() => { setReadMode('full'); jump('read', i + 1) }}>📖 Read</button>
                      <button type="button" onClick={() => { setTab('ask'); send(`Explain chapter ${i + 1} ("${c.title}") simply, with one example.`) }}>💬 Ask</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ===== AUDIO ===== */}
          {tab === 'audio' && (
            <div className="bs-audio">
              <div className="bs-player">
                <div className="bs-player-art">
                  <img src={coverSrc('M')} alt="" onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
                  <Wave active={mode === 'audio' && narrator.status === 'playing'} color={accent} />
                </div>
                <div className="bs-player-info">
                  <div className="bs-kicker">{mode === 'audio' && currentEp >= 0 ? episodes[currentEp]?.kicker : 'Audio podcast'} · {L.native}</div>
                  <h3>{mode === 'audio' && currentEp >= 0 ? episodes[currentEp]?.title : book.title}</h3>
                  <div className="bs-progress"><i style={{ width: `${mode === 'audio' && epSentences[currentEp]?.length ? ((narrator.index + 1) / epSentences[currentEp].length) * 100 : 0}%` }} /></div>
                  {controls('audio')}
                </div>
              </div>
              {voiceBar()}
              {generating != null && deep && <div className="bs-note">Writing the full text of chapter {generating + 1} for the deep-dive episode…</div>}
              <div className="bs-audio-cols">
                <ol className="bs-episodes">
                  {episodes.map((e, i) => (
                    <li key={i}>
                      <button type="button" className={`bs-episode ${mode === 'audio' && currentEp === i ? 'on' : ''}`} onClick={() => playEpisode('audio', i)}>
                        <span className="bs-ep-play">{mode === 'audio' && currentEp === i && narrator.status === 'playing' ? '▮▮' : '▶'}</span>
                        <span className="bs-ep-main"><small>{e.kicker}</small><b>{e.title}</b></span>
                        <span className="bs-ep-time">{mins(e.text)} min</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="bs-transcript">
                  <h4>Transcript</h4>
                  {(mode === 'audio' && currentEp >= 0 ? epSentences[currentEp] : epSentences[0] || []).map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      ref={el => { if (el && mode === 'audio' && i === narrator.index) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }}
                      className={`bs-sentence ${mode === 'audio' && i === narrator.index ? 'on' : ''}`}
                      onClick={() => (mode === 'audio' ? narrator.seek(i) : playEpisode('audio', 0, i))}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== VIDEO ===== */}
          {tab === 'video' && (
            <div className="bs-video">
              <div className="bs-stage" ref={stageRef} style={{ '--bs-accent': accent }}>
                <div className="bs-stage-bg" aria-hidden="true"><i /><i /><i /></div>
                <div className="bs-stage-top">
                  <span className="bs-live">● {L.native}</span>
                  <span>{book.title}</span>
                </div>
                <div className="bs-stage-main">
                  <div className="bs-stage-cover">
                    <img src={coverSrc('L')} alt="" onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
                  </div>
                  <div className="bs-stage-text">
                    <div className="bs-stage-kicker">{curEpisode?.kicker}</div>
                    <h3 key={`t${currentEp}`}>{curEpisode?.title}</h3>
                    <div className="bs-stage-points">
                      {(curEpisode?.points || []).map((p, i) => (
                        <span key={`${currentEp}-${i}`} className={videoProgress > (i + 1) / ((curEpisode.points.length || 1) + 1) ? 'show' : ''}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bs-stage-caption" key={caption}>{caption || (narrator.status === 'idle' ? '▶ Press play to start the video podcast' : '')}</div>
                <div className="bs-stage-host"><Wave active={mode === 'video' && narrator.status === 'playing'} color="#fff" /></div>
                <div className="bs-stage-bar"><i style={{ width: `${videoProgress * 100}%` }} /></div>
                <button type="button" className="bs-stage-play" onClick={() => togglePlay('video')} aria-label="Play or pause">
                  {mode === 'video' && narrator.status === 'playing' ? '' : '▶'}
                </button>
                <button type="button" className="bs-stage-fs" onClick={goFullscreen} aria-label="Fullscreen">⛶</button>
              </div>
              {controls('video')}
              {voiceBar()}
              <div className="bs-scenes">
                {episodes.map((e, i) => (
                  <button key={i} type="button" className={`bs-scene ${mode === 'video' && currentEp === i ? 'on' : ''}`} onClick={() => playEpisode('video', i)}>
                    <small>{e.kicker}</small>
                    <b>{e.title}</b>
                    <span>{mins(e.text)} min</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== READER ===== */}
          {tab === 'read' && (
            <div className={`bs-reader theme-${prefs.theme}`}>
              <aside className="bs-toc">
                <div className="bs-seg">
                  {[['precis', 'Précis'], ['full', 'Chapter'], ['book', 'Complete book']].map(([k, label]) => (
                    <button key={k} type="button" className={readMode === k ? 'on' : ''} onClick={() => setReadMode(k)}>{label}</button>
                  ))}
                </div>
                <ol>
                  {outline.chapters.map((c, i) => (
                    <li key={i}>
                      <button type="button" className={readIdx === i && readMode !== 'book' ? 'on' : ''} onClick={() => { setReadIdx(i); if (readMode === 'book') setReadMode('full') }}>
                        <span>{i + 1}</span>{c.title}{fullText[i] && generating !== i ? <em title="Ready">✓</em> : null}
                      </button>
                    </li>
                  ))}
                </ol>
                {(free || readUrl) && <a className="bs-orig" href={readUrl || links.free[0].url} target="_blank" rel="noreferrer">🏛️ Read the original book ↗</a>}
              </aside>
              <div className="bs-page-wrap">
                <div className="bs-reader-tools">
                  <button type="button" onClick={() => setPref({ size: Math.max(14, prefs.size - 1) })} aria-label="Smaller text">A−</button>
                  <button type="button" onClick={() => setPref({ size: Math.min(28, prefs.size + 1) })} aria-label="Larger text">A+</button>
                  <button type="button" onClick={() => setPref({ serif: !prefs.serif })}>{prefs.serif ? 'Serif' : 'Sans'}</button>
                  {['night', 'sepia', 'paper'].map(th => (
                    <button key={th} type="button" className={`bs-swatch sw-${th} ${prefs.theme === th ? 'on' : ''}`} onClick={() => setPref({ theme: th })} aria-label={`${th} theme`} />
                  ))}
                  <span className="bs-spacer" />
                  {readMode !== 'book' && ch && (
                    <button type="button" onClick={() => (narrator.trackId === `read:${readIdx}` && narrator.status === 'playing' ? narrator.pause() : listenText(readMode === 'full' && readerText ? `${ch.title}. ${readerText}` : `${ch.title}. ${ch.precis} ${ch.points.join('. ')} ${ch.takeaway}`, readIdx))}>
                      {narrator.trackId === `read:${readIdx}` && narrator.status === 'playing' ? '⏸ Pause' : '🔊 Listen'}
                    </button>
                  )}
                </div>
                <article className={`bs-page ${prefs.serif ? 'serif' : ''}`} style={{ fontSize: prefs.size }}>
                  {readMode === 'book' ? (
                    <>
                      <h1>{book.title}</h1>
                      <p className="bs-byline">{book.author} · {L.native}</p>
                      <p className="bs-ai-note">AI-written reader&apos;s edition based on the book&apos;s themes — not the author&apos;s original text.{free ? ' The original is free at Project Gutenberg.' : ''}</p>
                      {outline.chapters.some((_, i) => !fullText[i]) && (
                        <button type="button" className="bs-btn bs-btn-primary" disabled={bookGen} onClick={generateWholeBook}>
                          {bookGen ? `Writing chapter ${(generating ?? 0) + 1} of ${outline.chapters.length}…` : `✍ Write all ${outline.chapters.length} chapters`}
                        </button>
                      )}
                      {outline.chapters.map((c, i) => (
                        <section key={i} className="bs-book-ch">
                          <h2><span>{i + 1}</span> {c.title}</h2>
                          {fullText[i]
                            ? fullText[i].split(/\n{2,}/).map((p, k) => <p key={k}>{p}</p>)
                            : <p className="bs-muted">{c.precis}</p>}
                        </section>
                      ))}
                    </>
                  ) : ch && (
                    <>
                      <div className="bs-page-kicker">{readIdx + 1} / {outline.chapters.length}</div>
                      <h1>{ch.title}</h1>
                      {readMode === 'precis' ? (
                        <>
                          <p>{ch.precis}</p>
                          {ch.points.length > 0 && <ul>{ch.points.map((p, k) => <li key={k}>{p}</li>)}</ul>}
                          {ch.takeaway && <blockquote>{ch.takeaway}</blockquote>}
                        </>
                      ) : (
                        <>
                          {!readerText && <p className="bs-muted"><span className="bs-spinner" /> Writing this chapter…</p>}
                          {readerText && readerText.split(/\n{2,}/).map((p, k) => <p key={k}>{p}</p>)}
                          {generating === readIdx && readerText && <span className="bs-caret" />}
                        </>
                      )}
                      <div className="bs-page-nav">
                        <button type="button" disabled={readIdx === 0} onClick={() => setReadIdx(readIdx - 1)}>← Previous</button>
                        <button type="button" disabled={readIdx >= outline.chapters.length - 1} onClick={() => setReadIdx(readIdx + 1)}>Next chapter →</button>
                      </div>
                    </>
                  )}
                </article>
              </div>
            </div>
          )}

          {/* ===== ASK ===== */}
          {tab === 'ask' && (
            <div className="bs-ask">
              <div className="bs-chat">
                {chat.length === 0 && (
                  <div className="bs-chat-empty">
                    <span>🎙️</span>
                    <p>Ask anything about <b>{book.title}</b> — type or tap the mic and speak in {L.native}. Answers can be read aloud.</p>
                  </div>
                )}
                {chat.map((m, i) => (
                  <div key={i} className={`bs-msg ${m.role}`}>
                    {m.content || <span className="bs-typing"><i /><i /><i /></span>}
                    {m.role === 'assistant' && m.content && (
                      <button type="button" className="bs-msg-speak" onClick={() => listenText(m.content, `a${i}`)} aria-label="Read answer aloud">🔊</button>
                    )}
                  </div>
                ))}
                <div ref={chatEnd} />
              </div>
              <div className="bs-suggest">
                {['What is the main idea of this book?', 'Summarize every chapter in one line each', 'Give me 3 actions I can take today', 'Explain it like I am 12 years old', 'Make a 5-question quiz for me'].map(s => (
                  <button key={s} type="button" onClick={() => send(s)} disabled={asking}>{s}</button>
                ))}
              </div>
              <form className="bs-ask-bar" onSubmit={e => { e.preventDefault(); send(question) }}>
                <button
                  type="button"
                  className={`bs-mic ${dictation.listening ? 'on' : ''}`}
                  onClick={() => (dictation.listening ? dictation.stop() : dictation.start())}
                  disabled={!sttSupported}
                  title={sttSupported ? `Speak your question (${L.native})` : 'Voice input needs Safari, Chrome or Edge'}
                  aria-label="Speak your question"
                >🎙️</button>
                <input
                  value={dictation.listening ? dictation.interim || 'Listening…' : question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder={`Ask about this book in ${L.native}…`}
                  readOnly={dictation.listening}
                />
                <label className="bs-toggle"><input type="checkbox" checked={speakAnswers} onChange={e => setSpeakAnswers(e.target.checked)} /> 🔊</label>
                <button type="submit" className="bs-btn bs-btn-primary" disabled={asking || !question.trim()}>{asking ? '…' : 'Ask'}</button>
              </form>
            </div>
          )}
          <p className="bs-foot">✦ Study companion generated by AI from the book&apos;s description and themes; voices come from your device. Always check the original book for exact wording.</p>
        </div>
      )}
    </section>
  )
}
