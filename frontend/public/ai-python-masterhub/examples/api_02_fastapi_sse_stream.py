"""pip install fastapi uvicorn  -> uvicorn api_02_fastapi_sse_stream:app --reload"""
import asyncio, json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI(title="SSE demo")

TOKENS = ["Agents", " ", "stream", " ", "tokens", " ", "for", " ",
          "perceived", " ", "speed", "."]

async def token_gen(prompt: str):
    for i, tok in enumerate(TOKENS):
        await asyncio.sleep(0.08)                        # simulate model latency
        evt = {"i": i, "delta": tok}
        yield f"data: {json.dumps(evt)}\n\n"
    yield "data: [DONE]\n\n"

@app.get("/chat/stream")
async def chat_stream(q: str = "hi"):
    return StreamingResponse(token_gen(q), media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

# Browser side:
# const es = new EventSource('/chat/stream?q=hello');
# es.onmessage = e => e.data === '[DONE]' ? es.close() : append(JSON.parse(e.data).delta);