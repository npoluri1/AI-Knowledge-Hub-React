"""Embedding service supporting multiple providers."""
import numpy as np
from typing import Optional
from app.core.config import settings
import structlog

logger = structlog.get_logger()


class EmbeddingService:
    """Generate and manage embeddings from multiple providers."""

    def __init__(self):
        self._model = None
        self._openai_client = None

    async def _get_model(self):
        """Lazy-load sentence-transformers model."""
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(settings.embedding_model)
        return self._model

    async def _get_openai_client(self):
        """Lazy-load OpenAI client."""
        if self._openai_client is None:
            from openai import AsyncOpenAI
            self._openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
        return self._openai_client

    async def embed(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts."""
        provider = settings.embedding_provider.value

        if provider == "sentence-transformers":
            return await self._embed_sentence_transformers(texts)
        elif provider == "openai":
            return await self._embed_openai(texts)
        elif provider == "voyage":
            return await self._embed_voyage(texts)
        elif provider == "cohere":
            return await self._embed_cohere(texts)
        else:
            raise ValueError(f"Unknown embedding provider: {provider}")

    async def embed_query(self, query: str) -> list[float]:
        """Generate embedding for a single query."""
        result = await self.embed([query])
        return result[0]

    async def _embed_sentence_transformers(self, texts: list[str]) -> list[list[float]]:
        """Embed using sentence-transformers."""
        model = await self._get_model()
        embeddings = model.encode(texts, show_progress_bar=False)
        return embeddings.tolist()

    async def _embed_openai(self, texts: list[str]) -> list[list[float]]:
        """Embed using OpenAI."""
        client = await self._get_openai_client()
        response = await client.embeddings.create(
            model=settings.embedding_model or "text-embedding-3-small",
            input=texts,
        )
        return [item.embedding for item in response.data]

    async def _embed_voyage(self, texts: list[str]) -> list[list[float]]:
        """Embed using Voyage AI."""
        import httpx
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.voyageai.com/v1/embeddings",
                headers={"Authorization": f"Bearer {settings.voyage_api_key}"},
                json={
                    "model": settings.embedding_model or "voyage-2",
                    "input": texts,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return [item["embedding"] for item in data["data"]]

    async def _embed_cohere(self, texts: list[str]) -> list[list[float]]:
        """Embed using Cohere."""
        import httpx
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.cohere.ai/v1/embed",
                headers={"Authorization": f"Bearer {settings.cohere_api_key}"},
                json={
                    "model": settings.embedding_model or "embed-english-v3.0",
                    "texts": texts,
                    "input_type": "search_document",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["embeddings"]

    async def store_chunks(
        self,
        document_id: str,
        chunks: list[dict],
        metadata: dict = None,
    ):
        """Generate embeddings and store chunks in vector store."""
        from app.services.vectorstore_service import VectorStoreService

        texts = [chunk["text"] for chunk in chunks]
        embeddings = await self.embed(texts)

        vectorstore = VectorStoreService()
        await vectorstore.upsert(
            document_id=document_id,
            texts=texts,
            embeddings=embeddings,
            metadatas=[{**chunk.get("metadata", {}), **(metadata or {})} for chunk in chunks],
        )

        logger.info(
            "Chunks stored",
            document_id=document_id,
            count=len(chunks),
            embedding_dim=len(embeddings[0]) if embeddings else 0,
        )

    async def search(self, query: str, top_k: int = 5) -> list[dict]:
        """Search for similar documents."""
        from app.services.vectorstore_service import VectorStoreService

        query_embedding = await self.embed_query(query)
        vectorstore = VectorStoreService()
        return await vectorstore.search(query_embedding, top_k=top_k)

    async def delete_document(self, document_id: str):
        """Delete all chunks for a document."""
        from app.services.vectorstore_service import VectorStoreService

        vectorstore = VectorStoreService()
        await vectorstore.delete(document_id)

    def cosine_similarity(self, a: list[float], b: list[float]) -> float:
        """Compute cosine similarity between two vectors."""
        a_np = np.array(a)
        b_np = np.array(b)
        return float(np.dot(a_np, b_np) / (np.linalg.norm(a_np) * np.linalg.norm(b_np)))
