import React, { useState, useRef, useEffect, useCallback } from 'react'
import { streamChat, streamChatWithFiles } from '../chatApi'

const ACCEPTED_TYPES = '.doc,.docx,.pdf,.txt,.md,.csv,.json,.log,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg'
const MAX_FILES = 6
const MAX_FILE_BYTES = 12 * 1024 * 1024

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
  content: '👋 Hi! I\'m your AI Knowledge Hub assistant powered by real-time LLM. Ask me anything about RAG pipelines, AI agents, vector databases, system design, GRC compliance, prompt engineering, or any other AI topic!\n\n📎 You can also attach Word, PDF, text, or image files and I\'ll read them for you.',
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

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  return `${(bytes / (k ** i)).toFixed(bytes >= k ? 1 : 0)} ${sizes[i]}`
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
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

  function addFiles(e) {
    const selected = Array.from(e.target.files || [])
    setFileError('')
    const valid = []
    for (const file of selected) {
      if (file.size > MAX_FILE_BYTES) {
        setFileError(`"${file.name}" exceeds the ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB limit and was skipped.`)
        continue
      }
      valid.push({ name: file.name, size: file.size, type: file.type, file })
    }
    setFiles(prev => {
      const merged = [...prev, ...valid]
      if (merged.length > MAX_FILES) {
        setFileError(`You can attach up to ${MAX_FILES} files at once.`)
        return prev
      }
      return merged
    })
    e.target.value = ''
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setFileError('')
  }

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if ((!text && files.length === 0) || loading) return

    const displayText = text || (files.length ? 'Please read the attached files.' : '')
    const userMsg = {
      role: 'user',
      content: files.length ? `${displayText}\n\n📎 ${files.map(f => f.name).join(', ')}` : displayText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const chatMessages = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content
    }))

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setFiles([])
    setFileError('')
    setLoading(true)
    setStreamingContent('')

    let cancelled = false
    abortRef.current = () => { cancelled = true }

    let accumulated = ''
    const onToken = (token) => {
      if (cancelled) return
      accumulated += token
      setStreamingContent(accumulated)
    }
    const onDone = () => {
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
    }
    const onError = (err) => {
      if (cancelled) return
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err}\n\nThe chat has a local knowledge fallback. For live free-model answers, start the scan server and set OPENROUTER_API_KEY in frontend/.env.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
      setStreamingContent('')
      setLoading(false)
    }

    const filesSnapshot = files.map(f => ({ ...f }))
    if (filesSnapshot.length > 0) {
      await streamChatWithFiles(text, filesSnapshot, chatMessages, onToken, onDone, onError)
    } else {
      await streamChat(chatMessages, onToken, onDone, onError)
    }
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
              <p>Free OpenRouter models · attach files</p>
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

          {files.length > 0 && (
            <div className="chat-attachments">
              {files.map((file, i) => (
                <span key={`${file.name}-${i}`} className="chat-file-chip" title={file.name}>
                  <span className="chat-file-icon">{file.file?.type?.startsWith('image/') ? '🖼️' : '📄'}</span>
                  <span className="chat-file-name">{file.name}</span>
                  <span className="chat-file-size">{formatBytes(file.size)}</span>
                  <button className="chat-file-remove" onClick={() => removeFile(i)} aria-label="Remove file">✕</button>
                </span>
              ))}
            </div>
          )}
          {fileError && <div className="chat-file-error">{fileError}</div>}

          <form className="chat-input-area" onSubmit={handleSend}>
            <button type="button" className="chat-attach-btn" onClick={() => fileInputRef.current?.click()} title="Attach Word, PDF, text or image files" disabled={loading}>
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES}
              onChange={addFiles}
              style={{ display: 'none' }}
            />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={files.length ? 'Ask a question about the attached files…' : 'Ask about RAG, agents, vector DBs, GRC…'}
              disabled={loading}
            />
            {loading ? (
              <button type="button" className="chat-stop-btn" onClick={stopStreaming} title="Stop generating">
                ⏹
              </button>
            ) : (
              <button type="submit" disabled={!input.trim() && files.length === 0}>
                ➤
              </button>
            )}
          </form>
        </div>
      )}
    </>
  )
}
