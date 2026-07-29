// Streaming chat API — connects to scan-server /api/chat endpoint
// Falls back to local keyword responses when server is offline

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
  } catch (err) {
    onError(err.message || 'Connection failed')
  }
}
