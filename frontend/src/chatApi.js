// Streaming chat API — connects to scan-server /api/chat endpoint
// Falls back to local keyword responses when server is offline

async function readStream(res, onToken, onDone) {
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

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
        if (parsed.type === 'token') {
          onToken(parsed.content)
        } else if (parsed.type === 'done') {
          onDone()
          return
        }
      } catch { /* skip */ }
    }
  }

  onDone()
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

    await readStream(res, onToken, onDone)
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

    await readStream(res, onToken, onDone)
  } catch (err) {
    onError(err.message || 'Connection failed')
  }
}
