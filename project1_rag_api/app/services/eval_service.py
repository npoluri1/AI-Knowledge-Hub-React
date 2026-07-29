"""Evaluation service for RAG quality metrics."""
from typing import Optional
import structlog

logger = structlog.get_logger()


class EvalService:
    """Evaluate RAG pipeline quality using Ragas and DeepEval."""

    def __init__(self):
        self._ragas_available = False
        self._deepeval_available = False

    async def check_availability(self):
        """Check if evaluation frameworks are available."""
        try:
            import ragas
            self._ragas_available = True
        except ImportError:
            logger.warning("Ragas not installed")

        try:
            import deepeval
            self._deepeval_available = True
        except ImportError:
            logger.warning("DeepEval not installed")

    async def evaluate_rag(
        self,
        query: str,
        response: str,
        context: list[str],
        ground_truth: Optional[str] = None,
    ) -> dict:
        """Evaluate RAG quality."""
        metrics = {}

        # Basic metrics (always available)
        metrics["context_relevance"] = await self._context_relevance(query, context)
        metrics["response_relevancy"] = await self._response_relevancy(query, response)
        metrics["faithfulness"] = await self._faithfulness(response, context)

        if ground_truth:
            metrics["answer_correctness"] = await self._answer_correctness(response, ground_truth)

        # Ragas metrics
        if self._ragas_available:
            ragas_metrics = await self._ragas_evaluate(query, response, context, ground_truth)
            metrics["ragas"] = ragas_metrics

        # DeepEval metrics
        if self._deepeval_available:
            deepeval_metrics = await self._deepeval_evaluate(query, response, context, ground_truth)
            metrics["deepeval"] = deepeval_metrics

        return metrics

    async def _context_relevance(self, query: str, context: list[str]) -> float:
        """Check if context is relevant to the query."""
        from app.services.llm_service import LLMService

        llm = LLMService()
        context_text = "\n".join(context[:3])

        response = await llm.generate(
            prompt=f"Rate the relevance of this context to the query (0-1):\n\nQuery: {query}\n\nContext: {context_text[:1000]}\n\nScore (0-1):",
            system_prompt="You are an evaluation assistant. Return only a number between 0 and 1.",
        )

        try:
            return float(response["response"].strip())
        except ValueError:
            return 0.5

    async def _response_relevancy(self, query: str, response: str) -> float:
        """Check if response is relevant to the query."""
        from app.services.llm_service import LLMService

        llm = LLMService()
        eval_response = await llm.generate(
            prompt=f"Rate how well this response answers the query (0-1):\n\nQuery: {query}\n\nResponse: {response[:1000]}\n\nScore (0-1):",
            system_prompt="You are an evaluation assistant. Return only a number between 0 and 1.",
        )

        try:
            return float(eval_response["response"].strip())
        except ValueError:
            return 0.5

    async def _faithfulness(self, response: str, context: list[str]) -> float:
        """Check if response is faithful to the context."""
        from app.services.llm_service import LLMService

        llm = LLMService()
        context_text = "\n".join(context[:3])

        eval_response = await llm.generate(
            prompt=f"Check if this response is supported by the context (0-1):\n\nResponse: {response[:1000]}\n\nContext: {context_text[:1000]}\n\nScore (0-1):",
            system_prompt="You are an evaluation assistant. Return only a number between 0 and 1.",
        )

        try:
            return float(eval_response["response"].strip())
        except ValueError:
            return 0.5

    async def _answer_correctness(self, response: str, ground_truth: str) -> float:
        """Check if response matches ground truth."""
        from app.services.llm_service import LLMService

        llm = LLMService()
        eval_response = await llm.generate(
            prompt=f"Rate how correct this response is compared to the ground truth (0-1):\n\nResponse: {response[:500]}\n\nGround Truth: {ground_truth[:500]}\n\nScore (0-1):",
            system_prompt="You are an evaluation assistant. Return only a number between 0 and 1.",
        )

        try:
            return float(eval_response["response"].strip())
        except ValueError:
            return 0.5

    async def _ragas_evaluate(self, query, response, context, ground_truth) -> dict:
        """Run Ragas evaluation."""
        try:
            from ragas import evaluate
            from ragas.metrics import faithfulness, answer_relevancy, context_precision
            from datasets import Dataset

            data = {
                "question": [query],
                "answer": [response],
                "contexts": [context],
                "ground_truth": [ground_truth] if ground_truth else [response],
            }

            dataset = Dataset.from_dict(data)
            result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_precision])

            return {
                "faithfulness": result["faithfulness"],
                "answer_relevancy": result["answer_relevancy"],
                "context_precision": result["context_precision"],
            }
        except Exception as e:
            logger.error("Ragas evaluation failed", error=str(e))
            return {"error": str(e)}

    async def _deepeval_evaluate(self, query, response, context, ground_truth) -> dict:
        """Run DeepEval evaluation."""
        try:
            from deepeval import evaluate
            from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
            from deepeval.test_case import LLMTestCase

            test_case = LLMTestCase(
                input=query,
                actual_output=response,
                retrieval_context=context,
            )

            relevancy_metric = AnswerRelevancyMetric(threshold=0.7)
            faithfulness_metric = FaithfulnessMetric(threshold=0.7)

            result = evaluate(
                test_cases=[test_case],
                metrics=[relevancy_metric, faithfulness_metric],
            )

            return {"result": str(result)}
        except Exception as e:
            logger.error("DeepEval evaluation failed", error=str(e))
            return {"error": str(e)}
