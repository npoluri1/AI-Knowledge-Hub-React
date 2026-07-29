"""Hybrid search combining dense and sparse retrieval."""
from typing import Optional
import numpy as np
from app.services.embedding_service import EmbeddingService
from app.services.vectorstore_service import VectorStoreService
import structlog

logger = structlog.get_logger()


class HybridSearch:
    """Combine semantic (dense) and keyword (sparse) search."""

    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vectorstore = VectorStoreService()

    async def search(
        self,
        query: str,
        top_k: int = 5,
        dense_weight: float = 0.7,
        sparse_weight: float = 0.3,
    ) -> list[dict]:
        """Execute hybrid search."""
        # Dense search (semantic)
        dense_results = await self._dense_search(query, top_k * 2)

        # Sparse search (keyword/BM25)
        sparse_results = await self._sparse_search(query, top_k * 2)

        # Reciprocal Rank Fusion
        combined = self._rrf_fusion(
            dense_results,
            sparse_results,
            dense_weight,
            sparse_weight,
        )

        return combined[:top_k]

    async def _dense_search(self, query: str, top_k: int) -> list[dict]:
        """Semantic search using embeddings."""
        query_embedding = await self.embedding_service.embed_query(query)
        return await self.vectorstore.search(query_embedding, top_k=top_k)

    async def _sparse_search(self, query: str, top_k: int) -> list[dict]:
        """Keyword-based search (simplified BM25)."""
        # Get all documents from vector store
        # In production, use a dedicated BM25 index
        query_terms = query.lower().split()

        # Search with each term and combine
        all_results = {}
        for term in query_terms:
            results = await self.vectorstore.search(
                await self.embedding_service.embed_query(term),
                top_k=top_k,
            )
            for r in results:
                text_lower = r["text"].lower()
                # Simple term frequency scoring
                score = sum(1 for t in query_terms if t in text_lower) / len(query_terms)
                if r["text"] not in all_results or all_results[r["text"]]["score"] < score:
                    all_results[r["text"]] = {**r, "score": score}

        return sorted(all_results.values(), key=lambda x: x["score"], reverse=True)

    def _rrf_fusion(
        self,
        dense_results: list[dict],
        sparse_results: list[dict],
        dense_weight: float,
        sparse_weight: float,
        k: int = 60,
    ) -> list[dict]:
        """Reciprocal Rank Fusion of dense and sparse results."""
        scores = {}

        # Score dense results
        for rank, result in enumerate(dense_results):
            key = result["text"][:100]
            rrf_score = dense_weight / (k + rank + 1)
            scores[key] = {
                **result,
                "dense_score": result.get("score", 0),
                "sparse_score": 0,
                "rrf_score": rrf_score,
            }

        # Score sparse results
        for rank, result in enumerate(sparse_results):
            key = result["text"][:100]
            rrf_score = sparse_weight / (k + rank + 1)
            if key in scores:
                scores[key]["sparse_score"] = result.get("score", 0)
                scores[key]["rrf_score"] += rrf_score
            else:
                scores[key] = {
                    **result,
                    "dense_score": 0,
                    "sparse_score": result.get("score", 0),
                    "rrf_score": rrf_score,
                }

        # Sort by combined score
        results = sorted(scores.values(), key=lambda x: x["rrf_score"], reverse=True)
        return results
