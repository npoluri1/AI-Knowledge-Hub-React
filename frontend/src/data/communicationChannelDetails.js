const safe = value => String(value || '').replace(/[^A-Za-z0-9]/g, '') || 'Channel'

export function getChannelDetails(channel) {
  const name = channel.name
  const slug = safe(name)
  const code = `// ${name}: normalize an incoming message before routing\nfunction normalize${slug}(event) {\n  if (!event || !event.text?.trim()) {\n    throw new Error('A non-empty message is required')\n  }\n\n  return {\n    channel: '${name}',\n    text: event.text.trim(),\n    userId: event.userId ?? 'anonymous',\n    receivedAt: new Date().toISOString(),\n  }\n}\n\nconsole.log(normalize${slug}({ text: '  Hello support  ', userId: 'u-42' }))`
  const apiCode = `from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Message(BaseModel):\n    text: str\n    user_id: str\n\n@app.post('/webhooks/${slug.toLowerCase()}')\nasync def receive(message: Message):\n    if not message.text.strip():\n        raise HTTPException(422, 'text is required')\n    # Verify the provider signature before this point in production.\n    return {'accepted': True, 'channel': '${name}', 'user_id': message.user_id}`
  return {
    summary: `${name} is most useful when its audience, delivery guarantees, privacy model, and operational ownership are explicit. This page turns the directory entry into an implementation plan.`,
    concepts: ['Audience and message intent', 'Provider API, webhook, or SDK boundary', 'Identity, consent, moderation, and retention', 'Delivery status, retries, rate limits, and observability'],
    scenarios: [
      `A customer sends a high-priority request through ${name}; the system verifies the event, creates a support case, and acknowledges it quickly.`,
      `A marketing or operations team sends a notification through ${name}; preferences, quiet hours, deduplication, and delivery status are checked before sending.`,
      `A community or internal team uses ${name}; moderation, abuse reporting, retention, and escalation are handled by a documented policy.`,
    ],
    codeExamples: [{ title: 'Event normalization', language: 'javascript', description: 'Convert provider payloads into one internal message contract.', code }, { title: 'Backend webhook boundary', language: 'python', description: 'Validate the message before handing it to a queue or workflow.', code: apiCode }],
    projectIdeas: [`Build a ${name} support intake adapter with a retry queue.`, `Create a multi-channel notification router that falls back when ${name} is unavailable.`, `Build a moderation and analytics dashboard for ${name} conversations.`],
    advantages: [`Reach users in the context where they already communicate.`, 'Use delivery events and feedback to measure engagement and reliability.', 'Integrate with support, CRM, commerce, and internal workflows.'],
    disadvantages: ['Provider limits, policy changes, and outages create dependency risk.', 'Privacy, consent, retention, and regional compliance must be designed explicitly.', 'Poor retry or deduplication logic can send duplicate or misleading messages.'],
    production: ['Verify webhook signatures and authenticate every management action.', 'Use queues, idempotency keys, exponential backoff, and dead-letter handling.', 'Protect PII, encrypt secrets, and define retention and deletion procedures.', 'Track delivery, response time, bounce/failure rate, abuse signals, and cost.', 'Use feature flags and provider fallback for critical communication paths.'],
  }
}
