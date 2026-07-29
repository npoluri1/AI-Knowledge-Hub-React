"""Chat API endpoints."""
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_service import RAGService
from app.services.llm_service import LLMService
import time
import uuid
import structlog

logger = structlog.get_logger()
router = APIRouter()

# In-memory session store (use Redis in production)
sessions: dict[str, list[dict]] = {}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, req: Request):
    """Chat with RAG-powered LLM."""
    start_time = time.time()
    session_id = request.session_id or str(uuid.uuid4())

    try:
        if request.use_rag:
            rag_service = RAGService(
                vectorstore=req.app.state.vectorstore,
                llm=req.app.state.llm,
            )
            result = await rag_service.query(
                query=request.message,
                top_k=request.top_k,
                model=request.model,
                temperature=request.temperature,
            )
        else:
            llm = req.app.state.llm
            result = await llm.generate(
                prompt=request.message,
                model=request.model,
                temperature=request.temperature,
            )

        # Store in session
        if session_id not in sessions:
            sessions[session_id] = []
        sessions[session_id].append({"role": "user", "content": request.message})
        sessions[session_id].append({"role": "assistant", "content": result["response"]})

        latency = (time.time() - start_time) * 1000

        return ChatResponse(
            response=result["response"],
            session_id=session_id,
            model=result.get("model", "unknown"),
            sources=result.get("sources", []),
            tokens_used=result.get("tokens_used", 0),
            latency_ms=round(latency, 2),
            cached=result.get("cached", False),
        )

    except Exception as e:
        logger.error("Chat error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest, req: Request):
    """Stream chat response token by token."""
    async def generate():
        if request.use_rag:
            rag_service = RAGService(
                vectorstore=req.app.state.vectorstore,
                llm=req.app.state.llm,
            )
            async for chunk in rag_service.query_stream(
                query=request.message,
                top_k=request.top_k,
                model=request.model,
            ):
                yield f"data: {chunk}\n\n"
        else:
            llm = req.app.state.llm
            async for chunk in llm.generate_stream(
                prompt=request.message,
                model=request.model,
            ):
                yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.get("/chat/sessions/{session_id}")
async def get_session(session_id: str):
    """Get conversation history for a session."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "messages": sessions[session_id]}


@router.delete("/chat/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a conversation session."""
    if session_id in sessions:
        del sessions[session_id]
    return {"status": "deleted"}
