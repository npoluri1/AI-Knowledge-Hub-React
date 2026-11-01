const safe = value => String(value || 'AI system').replace(/[^A-Za-z0-9]/g, '')
const codeName = value => String(value || 'step').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'step'

function agentStepCode(step, agentName, industryName) {
  const fn = codeName(step)
  return `def ${fn}(request: dict, context: dict) -> dict:\n    """Execute the ${step} boundary for ${agentName}."""\n    if not request or not context.get("authorized"):\n        return {"status": "rejected", "reason": "invalid_or_unauthorized"}\n\n    # Validate inputs, call only allow-listed ${industryName} services,\n    # and emit an audit event before returning a result.\n    result = {"step": "${step}", "request_id": request.get("request_id")}\n    return {"status": "verified", "result": result, "audit": "${fn}_completed"}\n\nprint(${fn}({"request_id": "demo-001"}, {"authorized": True}))`
}

function projectCode(title, task) {
  return `from dataclasses import dataclass\n\n@dataclass\nclass DemoEvent:\n    project: str\n    task: str\n    status: str\n\ndef run_demo(input_text: str) -> DemoEvent:\n    if not input_text.strip():\n        raise ValueError("input_text is required")\n    # Replace this deterministic adapter with an authenticated service.\n    return DemoEvent("${title}", "${task}", "verified")\n\nprint(run_demo("sample ${task.toLowerCase()} request"))`
}

export function getAgentImplementation(agent, country, industry) {
  const name = agent?.name || 'AI Agent'
  const task = agent?.tasks?.[0] || 'business request'
  const functionName = `run_${safe(name).toLowerCase()}`
  const workflowSteps = [
    ['Receive request', 'Validate the payload, request ID, tenant, and required task fields.'],
    ['Authorize', 'Verify identity, tenant boundaries, permissions, and regional policy before tools.'],
    ['Plan task', 'Choose a bounded plan, tool budget, timeout, and explicit stop condition.'],
    ['Call tools', 'Invoke only allow-listed tools with schema-validated inputs and outputs.'],
    ['Verify result', 'Check freshness, confidence, business rules, and side-effect safety.'],
    ['Act or escalate', 'Return a structured result or transfer high-risk and uncertain work to a human.'],
  ].map(([stepName, explanation]) => ({ name: stepName, explanation, code: agentStepCode(stepName, name, industry?.name || 'business') }))
  const projectDetails = [
    `Build a ${task} simulator with mock tools, approval checkpoints, and replayable traces.`,
    `Create a country-aware policy service for ${country?.name || 'each market'} and compare outcomes by locale.`,
    `Add an evaluation dashboard for task success, escalation rate, latency, and cost per completed job.`,
  ].map(title => ({ title, code: projectCode(title, task) }))
  return {
    workflowSteps,
    projectDetails,
    behavior: `This ${agent?.type === 'multi' ? 'multi-agent system' : 'task agent'} receives a ${task.toLowerCase()} request, validates the caller, retrieves only approved ${industry?.name || 'industry'} context, executes bounded tools, verifies the result, and escalates high-impact decisions. It is a design blueprint, not a claim that this exact deployment is live.`,
    runtimeScenarios: [
      `${country?.name || 'A local market'} customer submits a ${task.toLowerCase()} request in the ${industry?.name || 'business'} workflow; the agent applies regional policy and returns a traceable result.`,
      `A burst of requests arrives during peak hours; the worker queue applies backpressure and idempotency so a payment, claim, or order is never duplicated.`,
      `A tool returns incomplete data; the verifier blocks the action, records the failure, and routes the case to an operator instead of guessing.`,
    ],
    projects: projectDetails.map(item => item.title),
    code: `from dataclasses import dataclass\nfrom typing import Callable\n\n@dataclass\nclass AgentResult:\n    status: str\n    answer: str\n    needs_human: bool\n    audit_event: str\n\nclass PolicyError(Exception):\n    pass\n\ndef ${functionName}(request: str, *, user_id: str, tool: Callable[[str], str]) -> AgentResult:\n    request = request.strip()\n    if not request or not user_id:\n        raise ValueError("request and user_id are required")\n\n    # Keep tools allow-listed and reject high-impact actions by default.\n    risky = any(word in request.lower() for word in (\n        "approve", "transfer", "delete", "fraud", "urgent"\n    ))\n    if risky:\n        return AgentResult(\n            status="needs_human",\n            answer="A specialist must approve this request.",\n            needs_human=True,\n            audit_event="risk_gate",\n        )\n\n    result = tool(request)\n    if not result.strip():\n        raise PolicyError("tool returned no verified result")\n    return AgentResult("completed", result, False, "completed")\n\n\ndef mock_tool(request: str) -> str:\n    return f"Verified ${task} result for: {request}"\n\nprint(${functionName}("${task}", user_id="user-123", tool=mock_tool))`,
    apiCode: `from fastapi import FastAPI, Header, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass AgentRequest(BaseModel):\n    user_id: str\n    request: str\n    idempotency_key: str\n\n@app.post("/v1/agent/run")\ndef run(payload: AgentRequest, x_tenant_id: str = Header(...)):\n    if not payload.request.strip() or not x_tenant_id:\n        raise HTTPException(422, "invalid request")\n    # Production: verify JWT, authorize tenant tools, enqueue work,\n    # persist the idempotency key, and return a job ID.\n    return {"accepted": True, "job_id": "job_demo_001", "tenant": x_tenant_id}`, 
  }
}

export function getChatbotImplementation(bot, country, industry) {
  const name = bot?.name || 'AI Chatbot'
  const safeName = safe(name)
  const workflowSteps = [
    ['Receive message', 'Validate the channel payload, conversation ID, user identity, and message limits.'],
    ['Classify intent', 'Route the message to an approved intent, risk policy, or human handoff.'],
    ['Retrieve context', 'Fetch current, authorized knowledge or account data from approved sources.'],
    ['Generate response', 'Produce a grounded answer with citations, limits, and a clear next action.'],
    ['Run workflow', 'Perform only authenticated, idempotent business actions requested by the user.'],
    ['Handoff and trace', 'Escalate sensitive conversations and record resolution, latency, and feedback.'],
  ].map(([stepName, explanation]) => ({ name: stepName, explanation, code: agentStepCode(stepName, `${name} chatbot`, industry?.name || 'business') }))
  const projectDetails = [
    `Build a local simulator for ${name} with intent routing, mocked business APIs, and an escalation inbox.`,
    `Add retrieval evaluation using real anonymized questions and measure grounded-answer rate.`,
    `Create an operator console showing conversations, handoffs, failed tools, and unresolved intents.`,
  ].map(title => ({ title, code: projectCode(title, bot?.useCases?.[0] || 'chat request') }))
  return {
    workflowSteps,
    projectDetails,
    behavior: `${name} is a conversational interface for ${bot?.company || 'the organization'}'s ${industry?.name || 'business'} workflow in ${country?.name || 'its market'}. It classifies intent, retrieves current approved information, answers low-risk questions, starts authenticated workflows, and transfers uncertain or sensitive conversations to a human.`,
    runtimeScenarios: [
      `A customer asks about ${bot?.useCases?.[0] || 'an account'}; the chatbot checks current system data before responding rather than relying on stale model memory.`,
      `A traffic spike causes provider latency; requests are queued, timeouts are surfaced honestly, and retries use an idempotency key.`,
      `A user asks for a sensitive action; the chatbot verifies identity and requires a human approval gate before changing records.`,
    ],
    projects: projectDetails.map(item => item.title),
    code: `from dataclasses import dataclass\n\n@dataclass\nclass ChatReply:\n    text: str\n    intent: str\n    needs_human: bool\n    source: str\n\ndef route_${safeName.toLowerCase()}(message: str, user_id: str) -> ChatReply:\n    message = message.strip()\n    if not message or not user_id:\n        raise ValueError("message and user_id are required")\n\n    lowered = message.lower()\n    if any(word in lowered for word in ("fraud", "complaint", "legal", "delete")):\n        return ChatReply(\n            "I am transferring this to a specialist.",\n            "escalation", True, "policy_gate"\n        )\n    if "status" in lowered or "track" in lowered:\n        return ChatReply(\n            "Your request is being checked against current account data.",\n            "status_lookup", False, "business_api"\n        )\n    return ChatReply(\n        "I can help route that request to the right workflow.",\n        "general_help", False, "approved_knowledge"\n    )\n\nprint(route_${safeName.toLowerCase()}("How can I check status?", "user-123"))`,
    apiCode: `from fastapi import FastAPI, Header, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Message(BaseModel):\n    user_id: str\n    message: str\n    conversation_id: str\n\n@app.post("/v1/chat/message")\ndef message(payload: Message, x_signature: str = Header(...)):\n    if not payload.message.strip() or not x_signature:\n        raise HTTPException(422, "message and signature are required")\n    # Production: verify the webhook signature, authenticate the user,\n    # redact PII, enqueue the turn, and persist conversation state.\n    return {"accepted": True, "conversation_id": payload.conversation_id, "status": "queued"}`, 
  }
}
