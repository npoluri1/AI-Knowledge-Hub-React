"""Vector store service supporting ChromaDB, Qdrant, and pgvector."""
from typing import Optional
from app.core.config import settings
import structlog

logger = structlog.get_logger()


class VectorStoreService:
    """Unified interface for vector databases."""

    def __init__(self):
        self._client = None
        self._collection = None

    async def _get_chroma(self):
        """Get or create ChromaDB client and collection."""
        if self._client is None:
            import chromadb
            self._client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
            self._collection = self._client.get_or_create_collection(
                name=settings.chroma_collection,
                metadata={"hnsw:space": "cosine"},
            )
        return self._collection

    async def _get_qdrant(self):
        """Get Qdrant client."""
        if self._client is None:
            from qdrant_client import QdrantClient
            self._client = QdrantClient(url=settings.qdrant_url)
        return self._client

    async def upsert(
        self,
        document_id: str,
        texts: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict] = None,
    ):
        """Upsert documents into vector store."""
        provider = settings.vectordb_provider.value

        if provider == "chroma":
            await self._upsert_chroma(document_id, texts, embeddings, metadatas)
        elif provider == "qdrant":
            await self._upsert_qdrant(document_id, texts, embeddings, metadatas)
        else:
            raise ValueError(f"Unknown vector DB: {provider}")

    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        filter_metadata: dict = None,
    ) -> list[dict]:
        """Search vector store."""
        provider = settings.vectordb_provider.value

        if provider == "chroma":
            return await self._search_chroma(query_embedding, top_k, filter_metadata)
        elif provider == "qdrant":
            return await self._search_qdrant(query_embedding, top_k, filter_metadata)
        else:
            raise ValueError(f"Unknown vector DB: {provider}")

    async def delete(self, document_id: str):
        """Delete all chunks for a document."""
        provider = settings.vectordb_provider.value

        if provider == "chroma":
            await self._delete_chroma(document_id)
        elif provider == "qdrant":
            await self._delete_qdrant(document_id)

    # --- ChromaDB ---
    async def _upsert_chroma(self, document_id, texts, embeddings, metadatas):
        collection = await self._get_chroma()
        ids = [f"{document_id}_{i}" for i in range(len(texts))]
        metadatas = metadatas or [{} for _ in texts]
        for m in metadatas:
            m["document_id"] = document_id

        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
        )
        logger.info("ChromaDB upsert", count=len(ids))

    async def _search_chroma(self, query_embedding, top_k, filter_metadata):
        collection = await self._get_chroma()
        where = None
        if filter_metadata:
            where = filter_metadata

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"],
        )

        formatted = []
        if results["documents"] and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                formatted.append({
                    "text": doc,
                    "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                    "score": 1 - results["distances"][0][i] if results["distances"] else 0,
                })
        return formatted

    async def _delete_chroma(self, document_id):
        collection = await self._get_chroma()
        try:
            collection.delete(where={"document_id": document_id})
            logger.info("ChromaDB delete", document_id=document_id)
        except Exception as e:
            logger.warning("ChromaDB delete warning", error=str(e))

    # --- Qdrant ---
    async def _upsert_qdrant(self, document_id, texts, embeddings, metadatas):
        from qdrant_client.models import VectorStruct, PointStruct

        client = await self._get_qdrant()
        metadatas = metadatas or [{} for _ in texts]

        points = []
        for i, (text, embedding, metadata) in enumerate(zip(texts, embeddings, metadatas)):
            metadata["document_id"] = document_id
            metadata["text"] = text
            points.append(
                PointStruct(
                    id=hash(f"{document_id}_{i}") % (2**63),
                    vector=embedding,
                    payload=metadata,
                )
            )

        client.upsert(
            collection_name=settings.chroma_collection,
            points=points,
        )
        logger.info("Qdrant upsert", count=len(points))

    async def _search_qdrant(self, query_embedding, top_k, filter_metadata):
        from qdrant_client.models import Filter, FieldCondition, MatchValue

        client = await self._get_qdrant()
        query_filter = None
        if filter_metadata:
            conditions = [
                FieldCondition(key=k, match=MatchValue(value=v))
                for k, v in filter_metadata.items()
            ]
            query_filter = Filter(must=conditions)

        results = client.search(
            collection_name=settings.chroma_collection,
            query_vector=query_embedding,
            limit=top_k,
            query_filter=query_filter,
        )

        return [
            {
                "text": hit.payload.get("text", ""),
                "metadata": {k: v for k, v in hit.payload.items() if k != "text"},
                "score": hit.score,
            }
            for hit in results
        ]

    async def _delete_qdrant(self, document_id):
        from qdrant_client.models import Filter, FieldCondition, MatchValue

        client = await self._get_qdrant()
        client.delete(
            collection_name=settings.chroma_collection,
            points_selector=Filter(
                must=[FieldCondition(key="document_id", match=MatchValue(value=document_id))]
            ),
        )
        logger.info("Qdrant delete", document_id=document_id)
