"""Reranking service for improving retrieval quality."""
from typing import Optional
import structlog

logger = structlog.get_logger()


class Reranker:
    """Rerank search results using cross-encoder or LLM."""

    def __init__(self, top_n: int = 3):
        self.top_n = top_n
        self._cross_encoder = None

    async def _get_cross_encoder(self):
        """Lazy-load cross-encoder model."""
        if self._cross_encoder is None:
            try:
                from sentence_transformers import CrossEncoder
                self._cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
            except Exception as e:
                logger.warning("Cross-encoder not available, using LLM reranking", error=str(e))
        return self._cross_encoder

    async def rerank(
        self,
        query: str,
        results: list[dict],
        top_n: Optional[int] = None,
    ) -> list[dict]:
        """Rerank results."""
        top_n = top_n or self.top_n

        if len(results) <= top_n:
            return results

        # Try cross-encoder first
        cross_encoder = await self._get_cross_encoder()
        if cross_encoder:
            return await self._rerank_cross_encoder(query, results, top_n)

        # Fallback to LLM reranking
        return await self._rerank_llm(query, results, top_n)

    async def _rerank_cross_encoder(
        self,
        query: str,
        results: list[dict],
        top_n: int,
    ) -> list[dict]:
        """Rerank using cross-encoder model."""
        pairs = [(query, r["text"]) for r in results]
        scores = self._cross_encoder.predict(pairs)

        for i, score in enumerate(scores):
            results[i]["rerank_score"] = float(score)

        reranked = sorted(results, key=lambda x: x.get("rerank_score", 0), reverse=True)

        logger.info("Cross-encoder reranking", input_count=len(results), output_count=top_n)
        return reranked[:top_n]

    async def _rerank_llm(
        self,
        query: str,
        results: list[dict],
        top_n: int,
    ) -> list[dict]:
        """Rerank using LLM (slower but more accurate)."""
        from app.services.llm_service import LLMService

        llm = LLMService()

        rerank_prompt = f"""Given the query: "{query}"

Rank the following {len(results)} passages by relevance (most relevant first).
Return ONLY a JSON array of indices, e.g. [2, 0, 1, 3, 4]

Passages:
"""
        for i, r in enumerate(results):
            rerank_prompt += f"\n[{i}] {r['text'][:200]}..."

        try:
            response = await llm.generate(
                prompt=rerank_prompt,
                system_prompt="You are a relevance ranking assistant. Return only a JSON array of indices.",
            )

            import json
            import re
            indices = json.loads(re.search(r'\[.*\]', response["response"]).group())

            reranked = [results[i] for i in indices if i < len(results)]
            logger.info("LLM reranking", input_count=len(results), output_count=top_n)
            return reranked[:top_n]

        except Exception as e:
            logger.warning("LLM reranking failed, returning original order", error=str(e))
            return results[:top_n]
