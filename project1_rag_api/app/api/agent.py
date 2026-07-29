"""Agent API endpoints with tool use."""
from fastapi import APIRouter, Request, HTTPException
from app.models.schemas import AgentRequest, AgentResponse
from app.services.agent_service import AgentService
import time
import structlog

logger = structlog.get_logger()
router = APIRouter()


@router.post("/agent/run", response_model=AgentResponse)
async def run_agent(request: AgentRequest, req: Request):
    """Run an autonomous agent with tools."""
    start_time = time.time()

    try:
        agent_service = AgentService(
            llm=req.app.state.llm,
            vectorstore=req.app.state.vectorstore,
        )

        result = await agent_service.run(
            query=request.message,
            tools=request.tools,
            max_iterations=request.max_iterations,
        )

        latency = (time.time() - start_time) * 1000

        return AgentResponse(
            response=result["response"],
            steps=result.get("steps", []),
            tools_used=result.get("tools_used", []),
            iterations=result.get("iterations", 0),
            latency_ms=round(latency, 2),
        )

    except Exception as e:
        logger.error("Agent error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agent/tools")
async def list_tools():
    """List available agent tools."""
    return {
        "tools": [
            {"name": "search", "description": "Search documents in the vector store"},
            {"name": "calculate", "description": "Perform mathematical calculations"},
            {"name": "web_search", "description": "Search the web for information"},
            {"name": "summarize", "description": "Summarize long text"},
            {"name": "translate", "description": "Translate text between languages"},
        ]
    }
