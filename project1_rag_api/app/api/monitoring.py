"""Monitoring and metrics API endpoints."""
from fastapi import APIRouter, Request
from app.core.config import settings
import time

router = APIRouter()

# Simple in-memory metrics
metrics = {
    "total_requests": 0,
    "total_tokens": 0,
    "total_latency_ms": 0,
    "errors": 0,
    "start_time": time.time(),
}


@router.get("/health")
async def health_check():
    """Detailed health check."""
    uptime = time.time() - metrics["start_time"]
    return {
        "status": "healthy",
        "uptime_seconds": round(uptime, 2),
        "version": settings.app_version,
        "llm_provider": settings.llm_provider.value,
        "vectordb": settings.vectordb_provider.value,
        "embedding": settings.embedding_provider.value,
    }


@router.get("/metrics")
async def get_metrics():
    """Get API metrics."""
    uptime = time.time() - metrics["start_time"]
    avg_latency = (
        metrics["total_latency_ms"] / metrics["total_requests"]
        if metrics["total_requests"] > 0
        else 0
    )
    return {
        "total_requests": metrics["total_requests"],
        "total_tokens": metrics["total_tokens"],
        "average_latency_ms": round(avg_latency, 2),
        "errors": metrics["errors"],
        "uptime_seconds": round(uptime, 2),
        "requests_per_minute": round(
            metrics["total_requests"] / (uptime / 60) if uptime > 0 else 0, 2
        ),
    }


@router.post("/metrics/reset")
async def reset_metrics():
    """Reset metrics counters."""
    metrics.update(
        {
            "total_requests": 0,
            "total_tokens": 0,
            "total_latency_ms": 0,
            "errors": 0,
            "start_time": time.time(),
        }
    )
    return {"status": "metrics reset"}


def track_request(latency_ms: float, tokens: int = 0, error: bool = False):
    """Track a request for metrics."""
    metrics["total_requests"] += 1
    metrics["total_latency_ms"] += latency_ms
    metrics["total_tokens"] += tokens
    if error:
        metrics["errors"] += 1
