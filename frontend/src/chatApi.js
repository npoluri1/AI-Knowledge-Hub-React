// Streaming chat API — connects to scan-server /api/chat endpoint
// Falls back to local keyword responses when server is offline

async function readStream(res, onToken, onDone, onError) {
  if (!res.body) throw new Error('The chat server returned an empty response.')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let settled = false

  const finish = () => {
    if (settled) return
    settled = true
    onDone()
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue

      try {
        const parsed = JSON.parse(trimmed.slice(6))
        if (parsed.type === 'token' && parsed.content) {
          onToken(parsed.content)
        } else if (parsed.type === 'error') {
          settled = true
          onError(parsed.message || 'The model provider returned an error.')
          return
        } else if (parsed.type === 'done') {
          finish()
          return
        }
      } catch {
        // Ignore comments and incomplete SSE frames; the next chunk completes them.
      }
    }
  }

  finish()
}

export async function streamChat(messages, onToken, onDone, onError) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    })

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`)
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('text/event-stream')) {
      // Not the scan-server SSE stream (e.g. the request hit a different
      // backend that answered with JSON). Surface that instead of streaming nothing.
      let detail = `Unexpected response (${contentType.split(';')[0] || 'unknown'}) — is the scan-server on :9001 running?`
      try {
        const payload = await res.json()
        if (payload?.error) detail = payload.error
        else if (payload?.answer) detail = payload.answer
      } catch { /* non-JSON body */ }
      throw new Error(detail)
    }

    await readStream(res, onToken, onDone, onError)
  } catch (err) {
    onError(err.message || 'Connection failed')
  }
}

// Chat with attached files — posts multipart/form-data (message + files) to
// /api/chat/upload. The server extracts text from Word/PDF/text attachments and
// sends images to a vision model, then streams the answer back as SSE tokens.
export async function streamChatWithFiles(message, files, history, onToken, onDone, onError) {
  try {
    const formData = new FormData()
    formData.append('message', message)
    formData.append('history', JSON.stringify(history))
    for (const file of files) {
      formData.append('files', file.file, file.name)
    }

    const res = await fetch('/api/chat/upload', {
      method: 'POST',
      body: formData
    })

    if (!res.ok) {
      let message = `Server returned ${res.status}`
      try {
        const payload = await res.json()
        if (payload.error) message = payload.error
      } catch { /* non-JSON error body */ }
      throw new Error(message)
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('text/event-stream')) {
      let detail = `Unexpected response (${contentType.split(';')[0] || 'unknown'}) — is the scan-server on :9001 running?`
      try {
        const payload = await res.json()
        if (payload?.error) detail = payload.error
      } catch { /* non-JSON body */ }
      throw new Error(detail)
    }

    await readStream(res, onToken, onDone, onError)
  } catch (err) {
    onError(err.message || 'Connection failed')
  }
}
