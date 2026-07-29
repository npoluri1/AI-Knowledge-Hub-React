"""Query transformation service for advanced RAG."""
from typing import Optional
from app.services.llm_service import LLMService
import structlog

logger = structlog.get_logger()


class QueryTransformer:
    """Transform queries for better retrieval."""

    def __init__(self):
        self.llm = LLMService()

    async def hyde(self, query: str, model: Optional[str] = None) -> str:
        """Hypothetical Document Embedding: generate a hypothetical answer, then use it for retrieval."""
        response = await self.llm.generate(
            prompt=f"Write a detailed answer to this question as if you were answering it:\n\n{query}",
            system_prompt="You are an expert writer. Write a comprehensive answer that would be found in a document.",
            model=model,
        )
        hypothetical_doc = response["response"]
        logger.info("HyDE transformation", original=query[:50], generated=hypothetical_doc[:50])
        return hypothetical_doc

    async def multi_query(self, query: str, num_queries: int = 3, model: Optional[str] = None) -> list[str]:
        """Generate multiple variations of the query for better coverage."""
        response = await self.llm.generate(
            prompt=f"""Generate {num_queries} different versions of this query that would retrieve similar but diverse information.
Query: {query}

Return ONLY a JSON array of strings, like: ["version1", "version2", "version3"]""",
            system_prompt="You are a query reformulation expert. Return only a JSON array.",
            model=model,
        )

        import json
        import re
        try:
            queries = json.loads(re.search(r'\[.*\]', response["response"]).group())
            logger.info("Multi-query generated", original=query[:50], variations=len(queries))
            return queries[:num_queries]
        except (json.JSONDecodeError, AttributeError):
            return [query]

    async def step_back(self, query: str, model: Optional[str] = None) -> str:
        """Step-back prompting: generate a more general question."""
        response = await self.llm.generate(
            prompt=f"""Given this specific question, generate a more general, higher-level question
that would help answer the original question through context retrieval.

Original question: {query}

General question:""",
            system_prompt="You are an expert at identifying underlying concepts. Generate a broader question.",
            model=model,
        )
        logger.info("Step-back transformation", original=query[:50], general=response["response"][:50])
        return response["response"]

    async def decompose(self, query: str, model: Optional[str] = None) -> list[str]:
        """Decompose a complex query into sub-questions."""
        response = await self.llm.generate(
            prompt=f"""Break down this complex question into simpler sub-questions that can be answered independently.

Question: {query}

Return ONLY a JSON array of sub-questions, like: ["sub-question 1", "sub-question 2"]""",
            system_prompt="You are a query decomposition expert. Break complex questions into simpler parts.",
            model=model,
        )

        import json
        import re
        try:
            sub_queries = json.loads(re.search(r'\[.*\]', response["response"]).group())
            logger.info("Query decomposed", original=query[:50], sub_queries=len(sub_queries))
            return sub_queries
        except (json.JSONDecodeError, AttributeError):
            return [query]

    async def rewrite(self, query: str, style: str = "concise", model: Optional[str] = None) -> str:
        """Rewrite query for better retrieval."""
        styles = {
            "concise": "Rewrite this query to be more concise and focused for document retrieval.",
            "verbose": "Rewrite this query to be more detailed and specific for document retrieval.",
            "technical": "Rewrite this query using technical terminology for better matching.",
        }

        instruction = styles.get(style, styles["concise"])

        response = await self.llm.generate(
            prompt=f"{instruction}\n\nOriginal query: {query}\n\nRewritten query:",
            system_prompt="You are a query rewriting expert. Only return the rewritten query.",
            model=model,
        )
        return response["response"]
