import React, { useState, useRef, useEffect, useCallback } from 'react'
import { streamChat } from '../chatApi'

function TypingIndicator() {
  return (
    <div className="chat-typing">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  )
}

function ChatMessage({ msg }) {
  return (
    <div className={`chat-message ${msg.role}`}>
      <div className="chat-avatar">{msg.role === 'assistant' ? '🧠' : '👤'}</div>
      <div className="chat-bubble">
        <div className="chat-text">{msg.content}</div>
        {msg.timestamp && <div className="chat-time">{msg.timestamp}</div>}
      </div>
    </div>
  )
}

const WELCOME_MSG = {
  role: 'assistant',
  content: '👋 Hi! I\'m your AI Knowledge Hub assistant powered by real-time LLM. Ask me anything about RAG pipelines, AI agents, vector databases, system design, GRC compliance, prompt engineering, or any other AI topic!',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

const quickQuestions = [
  'What is RAG?',
  'Compare vector databases',
  'Explain ReAct agent pattern',
  'What is the EU AI Act?',
  'Best embedding models?',
  'Prompt injection defense?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, scrollToBottom])

  function stopStreaming() {
    if (abortRef.current) {
      abortRef.current()
      abortRef.current = null
    }
    if (streamingContent) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: streamingContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
      setStreamingContent('')
    }
    setLoading(false)
  }

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setStreamingContent('')

    let cancelled = false
    abortRef.current = () => { cancelled = true }

    const chatMessages = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content
    }))

    let accumulated = ''

    await streamChat(
      chatMessages,
      (token) => {
        if (cancelled) return
        accumulated += token
        setStreamingContent(accumulated)
      },
      () => {
        if (cancelled) return
        if (accumulated) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: accumulated,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])
        }
        setStreamingContent('')
        setLoading(false)
      },
      (err) => {
        if (cancelled) return
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ ${err}. Please make sure the scan-server is running.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
        setStreamingContent('')
        setLoading(false)
      }
    )
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <>
      <button
        className={`chat-fab ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        title="AI Knowledge Assistant"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header" onClick={() => setOpen(false)}>
            <span className="chat-header-icon">🧠</span>
            <div className="chat-header-info">
              <h4>AI Knowledge Assistant</h4>
              <p>Ask about any AI topic</p>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <ChatMessage key={i} msg={msg} />
            ))}
            {streamingContent && (
              <div className="chat-message assistant">
                <div className="chat-avatar">🧠</div>
                <div className="chat-bubble">
                  <div className="chat-text">{streamingContent}</div>
                </div>
              </div>
            )}
            {loading && !streamingContent && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && !loading && (
            <div className="chat-quick-questions">
              <span className="quick-label">Try asking:</span>
              <div className="quick-buttons">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="quick-btn"
                    onClick={() => { setInput(q); inputRef.current?.focus() }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about RAG, agents, vector DBs, GRC…"
              disabled={loading}
            />
            {loading ? (
              <button type="button" className="chat-stop-btn" onClick={stopStreaming} title="Stop generating">
                ⏹
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()}>
                ➤
              </button>
            )}
          </form>
        </div>
      )}
    </>
  )
}
