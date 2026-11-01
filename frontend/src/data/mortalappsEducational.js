const cleanTitle = value => String(value || 'this topic').replace(/\s+/g, ' ').trim()

const slugify = value => cleanTitle(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_|_$/g, '')
  .slice(0, 36) || 'topic'

function domainFor(title, context = {}) {
  const text = `${title} ${context.category || ''} ${context.section || ''}`.toLowerCase()
  if (/semiconductor|chip|wafer|transistor|lithograph|fabricat|packag|yield|euv|hbm/.test(text)) return 'semiconductor'
  if (/quantum|qubit|gate|entangl|grover|shor/.test(text)) return 'quantum'
  if (/agent|mcp|react pattern|orchestrat|tool call/.test(text)) return 'agents'
  if (/gpu|cuda|triton|inference|tensor|memory hierarchy|quantiz/.test(text)) return 'infrastructure'
  if (/python|async|pandas|fastapi|dataclass|module/.test(text)) return 'python'
  if (/system design|architecture|distributed|queue|cache|reliab|event|database|api/.test(text)) return 'systems'
  return 'ai'
}

const DOMAIN_CONTENT = {
  ai: {
    useCases: [
      'Classify, rank, or predict something from incoming data.',
      'Add an assistant that explains results instead of returning a black-box answer.',
      'Monitor model quality and send uncertain cases to a human reviewer.'
    ],
    realtimeUseCases: [
      'Score a new event as it arrives and respond within the same request.',
      'Detect an unusual image, message, or transaction and raise an alert immediately.',
      'Stream model confidence and latency to an operations dashboard.'
    ],
    project: 'Build a small prediction service with a health check, input validation, confidence threshold, and human-review queue.'
  },
  systems: {
    useCases: [
      'Separate services so one change does not require redeploying the whole product.',
      'Handle bursts of traffic with queues, caches, retries, and clear failure boundaries.',
      'Record events and metrics so engineers can explain what happened after an incident.'
    ],
    realtimeUseCases: [
      'Process an order, payment, or notification event without blocking the user request.',
      'Push live status changes to a dashboard through a stream or WebSocket.',
      'Apply a timeout and fallback when a downstream service is slow or unavailable.'
    ],
    project: 'Build a small event-driven service with an in-memory queue, idempotency key, retry limit, and observable status endpoint.'
  },
  python: {
    useCases: [
      'Automate a repeated data, file, API, or reporting task.',
      'Turn the idea into a tested command-line tool or small web endpoint.',
      'Use explicit types, errors, and logs so another developer can safely maintain it.'
    ],
    realtimeUseCases: [
      'Accept a request, validate it, and return a useful result without blocking unrelated requests.',
      'Watch a folder, queue, or API stream and process each new item as it arrives.',
      'Expose timing and error information so a running service can be diagnosed quickly.'
    ],
    project: 'Build a typed Python service with a small domain function, validation, structured logging, and a testable entry point.'
  },
  agents: {
    useCases: [
      'Let a model choose a safe tool instead of asking it to invent every answer.',
      'Break a long task into reviewable steps with clear state and a maximum step count.',
      'Escalate risky, expensive, or ambiguous actions to a person.'
    ],
    realtimeUseCases: [
      'Route a live support request to search, account, or human-escalation tools.',
      'Stream each agent step and tool result so users can see progress and stop the run.',
      'Pause before an external side effect such as sending, purchasing, or deleting.'
    ],
    project: 'Build a deterministic tool-calling loop with an allow-list, timeout, audit log, and human approval gate.'
  },
  infrastructure: {
    useCases: [
      'Measure where compute, memory, bandwidth, or latency is being spent.',
      'Choose an execution strategy that fits the model size, throughput, and budget.',
      'Add capacity planning and safeguards before serving production traffic.'
    ],
    realtimeUseCases: [
      'Adapt batch size or concurrency as request traffic changes.',
      'Watch GPU memory, queue depth, token rate, and tail latency in real time.',
      'Fail over or shed load before an overloaded worker takes down the service.'
    ],
    project: 'Build a lightweight serving scheduler that reports queue depth, worker utilization, latency, and rejected requests.'
  },
  quantum: {
    useCases: [
      'Model a small quantum circuit and compare its measured distribution with a classical simulation.',
      'Study how gates, noise, or measurement change a computation.',
      'Prototype an algorithm before mapping it to real quantum hardware.'
    ],
    realtimeUseCases: [
      'Submit circuit jobs to a queue and stream job status as a backend becomes available.',
      'Compare results from multiple simulators or hardware targets as runs finish.',
      'Track calibration and error metrics before accepting a result.'
    ],
    project: 'Build a circuit playground that validates gates, simulates small states, and displays measurement counts.'
  },
  semiconductor: {
    useCases: [
      'Explain how a design moves from transistor logic to a manufactured and tested die.',
      'Track wafer lots, process steps, equipment, defects, and yield.',
      'Connect chip architecture decisions to power, performance, cost, and reliability.'
    ],
    realtimeUseCases: [
      'Stream sensor readings from a fab tool and flag drift before a lot fails.',
      'Inspect wafer images as they arrive and route suspect dies for review.',
      'Update yield, cycle time, and equipment-health dashboards during production.'
    ],
    project: 'Build a wafer-lot simulator that emits process readings, calculates yield, flags defects, and exposes a live status feed.'
  }
}

function starterCode(title, domain, context = {}) {
  const name = slugify(title)
  const topic = cleanTitle(title)
  if (domain === 'semiconductor') {
    return `"""Educational wafer inspection simulator for: ${topic}"""\nfrom dataclasses import dataclass\nfrom random import random\n\n@dataclass\nclass DieResult:\n    die_id: int\n    passed: bool\n    defect_probability: float\n\ndef inspect_wafer(die_count: int = 12) -> list[DieResult]:\n    results = []\n    for die_id in range(1, die_count + 1):\n        defect_probability = round(random() * 0.12, 3)\n        results.append(DieResult(die_id, defect_probability < 0.05, defect_probability))\n    return results\n\nresults = inspect_wafer()\nyield_rate = sum(item.passed for item in results) / len(results)\nprint(f"${name}: yield={yield_rate:.1%}")\nfor item in results:\n    if not item.passed:\n        print(f"Review die {item.die_id}: defect probability={item.defect_probability:.1%}")`
  }
  if (domain === 'agents') {
    return `"""Safe, deterministic starter loop for: ${topic}"""\nfrom dataclasses import dataclass\n\n@dataclass\nclass ToolResult:\n    output: str\n    needs_approval: bool = False\n\nALLOWED_TOOLS = {"lookup": lambda value: f"Found: {value}"}\n\ndef run_${name}(request: str, max_steps: int = 3) -> ToolResult:\n    if not request.strip():\n        raise ValueError("request is required")\n    tool = "lookup"\n    if tool not in ALLOWED_TOOLS or max_steps < 1:\n        return ToolResult("Stopped by safety policy", True)\n    return ToolResult(ALLOWED_TOOLS[tool](request))\n\nprint(run_${name}("${topic}"))`
  }
  if (domain === 'systems') {
    return `"""Tiny event-driven project skeleton for: ${topic}"""\nfrom collections import deque\n\nqueue = deque()\nseen = set()\n\ndef publish(event_id: str, payload: dict) -> None:\n    if event_id not in seen:\n        queue.append((event_id, payload))\n\ndef process_once() -> dict | None:\n    if not queue:\n        return None\n    event_id, payload = queue.popleft()\n    seen.add(event_id)\n    return {"event_id": event_id, "status": "processed", "payload": payload}\n\npublish("demo-1", {"topic": "${topic}"})\nprint(process_once())`
  }
  if (domain === 'infrastructure') {
    return `"""Simple capacity monitor for: ${topic}"""\nfrom statistics import mean\n\nlatencies_ms = [42, 39, 51, 47, 44]\nqueue_depth = 3\n\np95_approx = sorted(latencies_ms)[round(len(latencies_ms) * 0.95) - 1]\nstatus = "scale out" if queue_depth > 10 or p95_approx > 100 else "healthy"\nprint({"topic": "${topic}", "average_ms": mean(latencies_ms), "p95_ms": p95_approx, "status": status})`
  }
  if (domain === 'quantum') {
    return `"""Classical toy simulation for: ${topic}"""\nfrom collections import Counter\nfrom random import choice\n\nstates = ["0", "1"]\nmeasurements = Counter(choice(states) for _ in range(1000))\nprobabilities = {state: count / 1000 for state, count in measurements.items()}\nprint("${topic}")\nprint(probabilities)\n# Replace this toy model with a quantum SDK when studying real hardware.`
  }
  if (domain === 'python') {
    return `"""Small, testable Python project starter for: ${topic}"""\nfrom dataclasses import dataclass\n\n@dataclass\nclass Result:\n    topic: str\n    ok: bool\n    message: str\n\ndef run_${name}(value: str) -> Result:\n    value = value.strip()\n    if not value:\n        return Result("${topic}", False, "input is required")\n    return Result("${topic}", True, f"processed {value!r}")\n\nprint(run_${name}("demo input"))`
  }
  return `"""Minimal model-service starter for: ${topic}"""\nfrom dataclasses import dataclass\n\n@dataclass\nclass Prediction:\n    label: str\n    confidence: float\n\ndef predict_${name}(value: str) -> Prediction:\n    if not value.strip():\n        raise ValueError("input is required")\n    # Replace this deterministic rule with a trained model and validation set.\n    confidence = min(0.99, 0.55 + len(value) / 100)\n    return Prediction(label="review", confidence=round(confidence, 3))\n\nprint(predict_${name}("demo input"))`
}

export function enrichMortalAppsTopic(topic = {}, context = {}) {
  const title = cleanTitle(topic.title)
  const domain = domainFor(title, context)
  const defaults = DOMAIN_CONTENT[domain]
  const originalTldr = cleanTitle(topic.tldr)
  const plainEnglish = topic.plainEnglish || (
    originalTldr && originalTldr.toLowerCase() !== title.toLowerCase()
      ? `In plain words: ${originalTldr}`
      : `In plain words: ${title} is a practical idea that helps a computer or team do one focused job more reliably. Start with the small example, then add production safeguards.`
  )

  return {
    ...topic,
    plainEnglish,
    useCases: topic.useCases?.length ? topic.useCases : defaults.useCases,
    realtimeUseCases: topic.realtimeUseCases?.length ? topic.realtimeUseCases : defaults.realtimeUseCases,
    projectIdeas: topic.projectIdeas?.length ? topic.projectIdeas : [defaults.project, `Create a small dashboard that measures ${title.toLowerCase()} quality, latency, failures, and cost.`, `Add a test suite with normal, slow, invalid, and failure inputs for ${title.toLowerCase()}.`],
    projectCode: topic.projectCode || {
      language: 'Python',
      title: `Starter project: ${title}`,
      code: starterCode(title, domain, context)
    }
  }
}

export function enrichMortalAppsCategories(categories = [], context = {}) {
  return categories.map(category => ({
    ...category,
    concepts: (category.concepts || []).map(topic => enrichMortalAppsTopic(topic, {
      ...context,
      category: category.name
    }))
  }))
}
