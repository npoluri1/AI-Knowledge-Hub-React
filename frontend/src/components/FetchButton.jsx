import React, { useState, useCallback, useRef } from 'react'
import { staticMessage } from '../api'

export default function FetchButton({ onFetch, label = 'Fetch Latest', className = '', doneLabel = 'Updated!', staticMode = false }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const msgTimer = useRef(null)

  const handleClick = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setMsg(null)
    try {
      let result
      if (onFetch) result = await onFetch()
      let text
      if (staticMode) {
        text = staticMessage(label)
      } else if (typeof result === 'string') {
        text = result
      } else if (result && typeof result.message === 'string') {
        text = result.message
      } else {
        text = doneLabel
      }
      setMsg({ ok: true, text })
    } catch (err) {
      setMsg({ ok: false, text: `⚠️ ${(err && err.message) ? err.message : 'Fetch failed'}` })
    } finally {
      setLoading(false)
      if (msgTimer.current) clearTimeout(msgTimer.current)
      msgTimer.current = setTimeout(() => setMsg(null), 4000)
    }
  }, [onFetch, loading, staticMode, label, doneLabel])

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