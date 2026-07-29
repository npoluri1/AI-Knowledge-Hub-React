"""RAG service combining retrieval and generation."""
from typing import AsyncGenerator, Optional
from app.services.llm_service import LLMService
from app.services.embedding_service import EmbeddingService
from app.services.vectorstore_service import VectorStoreService
import structlog

logger = structlog.get_logger()

RAG_SYSTEM_PROMPT = """You are a helpful assistant that answers questions based on the provided context.
Rules:
1. Only answer based on the provided context. If the context doesn't contain enough information, say so.
2. Cite your sources by referencing the document names when possible.
3. Be concise and accurate.
4. If the user asks something unrelated to the context, you may answer generally but note that it's not from the provided documents.

Context:
{context}"""

QUERY_SYSTEM_PROMPT = """You are a helpful assistant. Answer the user's question based on the provided context.
If the context is empty or insufficient, say "I don't have enough information to answer this question."
Always be helpful and concise."""


class RAGService:
    """Complete RAG pipeline: retrieve, augment, generate."""

    def __init__(self, vectorstore: VectorStoreService, llm: LLMService):
        self.vectorstore = vectorstore
        self.llm = llm
        self.embedding_service = EmbeddingService()

    async def query(
        self,
        query: str,
        top_k: int = 5,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
    ) -> dict:
        """Execute a RAG query."""
        # Retrieve relevant documents
        results = await self._retrieve(query, top_k)

        # Build context
        context = self._build_context(results)

        # Generate response
        system_prompt = RAG_SYSTEM_PROMPT.format(context=context)
        response = await self.llm.generate(
            prompt=query,
            model=model,
            temperature=temperature,
            system_prompt=system_prompt,
        )

        return {
            "response": response["response"],
            "model": response.get("model", "unknown"),
            "sources": [
                {
                    "text": r["text"][:200] + "..." if len(r["text"]) > 200 else r["text"],
                    "score": r.get("score", 0),
                    "metadata": r.get("metadata", {}),
                }
                for r in results
            ],
            "tokens_used": response.get("tokens_used", 0),
        }

    async def query_stream(
        self,
        query: str,
        top_k: int = 5,
        model: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """Stream a RAG response."""
        results = await self._retrieve(query, top_k)
        context = self._build_context(results)

        system_prompt = RAG_SYSTEM_PROMPT.format(context=context)
        async for chunk in self.llm.generate_stream(
            prompt=query,
            model=model,
            system_prompt=system_prompt,
        ):
            yield chunk

    async def _retrieve(self, query: str, top_k: int) -> list[dict]:
        """Retrieve relevant documents."""
        query_embedding = await self.embedding_service.embed_query(query)
        results = await self.vectorstore.search(query_embedding, top_k=top_k)

        # Filter by score threshold
        filtered = [r for r in results if r.get("score", 0) >= 0.3]

        logger.info(
            "RAG retrieval",
            query=query[:50],
            total_results=len(results),
            filtered_results=len(filtered),
        )

        return filtered if filtered else results[:3]

    def _build_context(self, results: list[dict]) -> str:
        """Build context string from retrieval results."""
        if not results:
            return "No relevant documents found."

        context_parts = []
        for i, result in enumerate(results, 1):
            score = result.get("score", 0)
            text = result["text"]
            source = result.get("metadata", {}).get("filename", "unknown")
            context_parts.append(f"[Source {i}: {source} (relevance: {score:.2f})]\n{text}")

        return "\n\n".join(context_parts)
