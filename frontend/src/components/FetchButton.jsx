import React, { useState, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { staticMessage } from '../api'
import { refreshLatest } from '../data/latestFeed'

export default function FetchButton({ onFetch, label = 'Fetch Latest', className = '', doneLabel = 'Updated!', staticMode = false }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const msgTimer = useRef(null)
  const { pathname } = useLocation()

  const handleClick = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setMsg(null)
    try {
      // Run the page's own refresh and a real-time pull of this page's live
      // feed (new repos + headlines) in parallel.
      const [pageRes, liveRes] = await Promise.allSettled([
        Promise.resolve(onFetch ? onFetch() : undefined),
        refreshLatest(pathname),
      ])
      if (pageRes.status === 'rejected' && liveRes.status !== 'fulfilled') throw pageRes.reason
      const result = pageRes.status === 'fulfilled' ? pageRes.value : undefined
      const live = liveRes.status === 'fulfilled' ? liveRes.value : null
      let text
      if (staticMode) {
        text = live || staticMessage(label)
      } else if (typeof result === 'string') {
        text = result
      } else if (result && typeof result.message === 'string') {
        text = result.message
      } else {
        text = doneLabel
      }
      if (!staticMode && live && text !== live) text = `${text} · ${live}`
      setMsg({ ok: true, text })
    } catch (err) {
      setMsg({ ok: false, text: `⚠️ ${(err && err.message) ? err.message : 'Fetch failed'}` })
    } finally {
      setLoading(false)
      if (msgTimer.current) clearTimeout(msgTimer.current)
      msgTimer.current = setTimeout(() => setMsg(null), 6000)
    }
  }, [onFetch, loading, staticMode, label, doneLabel, pathname])

  return (
    <button
      type="button"
      className={`fetch-btn ${loading ? 'fetch-btn-loading' : ''} ${msg && !msg.ok ? 'fetch-btn-error' : ''} ${msg && msg.ok ? 'fetch-btn-done' : ''} ${className}`}
      onClick={handleClick}
      disabled={loading}
      title={msg ? msg.text : label}
    >
      <span className="fetch-btn-icon">{loading ? '⏳' : msg ? (msg.ok ? '✅' : '⚠️') : '🔄'}</span>
      <span className="fetch-btn-text">{loading ? 'Fetching…' : msg ? msg.text : label}</span>
    </button>
  )
}