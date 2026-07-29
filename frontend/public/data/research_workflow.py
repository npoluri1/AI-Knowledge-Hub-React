"""
workflows/research_workflow.py
LangGraph workflow orchestrating all agents in a state machine.

Flow:
  START → research → analyze → write → review → [approve | revise] → END

State is passed between nodes and persisted throughout the workflow.
"""
import json
import logging
import os
from datetime import datetime
from enum import Enum
from typing import Annotated, Any, Optional, TypedDict

from crewai import Crew, Process, Task
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

from agents import (
    create_analysis_agent,
    create_research_agent,
    create_review_agent,
    create_writing_agent,
)
from config.prompts import (
    ANALYSIS_TASK_TEMPLATE,
    RESEARCH_TASK_TEMPLATE,
    REVIEW_TASK_TEMPLATE,
    WRITING_TASK_TEMPLATE,
)
from config.settings import get_settings
from tools.pdf_tool import get_pdf_generator

logger = logging.getLogger(__name__)
settings = get_settings()


# ─── State Schema ─────────────────────────────────────────────────────────────

class WorkflowStatus(str, Enum):
    PENDING = "pending"
    RESEARCHING = "researching"
    ANALYZING = "analyzing"
    WRITING = "writing"
    REVIEWING = "reviewing"
    REVISING = "revising"
    COMPLETED = "completed"
    FAILED = "failed"


class ResearchState(TypedDict):
    """State that flows through the entire research workflow."""
    # Input
    topic: str
    research_depth: str                    # quick / standard / comprehensive

    # Agent outputs
    research_data: str                     # Raw research from Research Agent
    analysis_data: str                     # Structured analysis from Analysis Agent
    report_content: str                    # Written report from Writing Agent
    review_feedback: str                   # QA feedback from Review Agent
    quality_score: float                   # Overall quality score (0-10)

    # Metadata
    status: WorkflowStatus
    iteration: int                         # Revision iteration counter
    max_iterations: int                    # Max allowed revisions
    messages: Annotated[list[BaseMessage], add_messages]  # Conversation log
    errors: list[str]                      # Error log
    started_at: str
    completed_at: Optional[str]

    # Output
    pdf_path: Optional[str]               # Path to generated PDF
    report_title: str


# ─── Node Functions ───────────────────────────────────────────────────────────

def research_node(state: ResearchState) -> ResearchState:
    """
    Node 1: Research Agent gathers information from the web.
    """
    logger.info(f"[RESEARCH] Starting research on: {state['topic']}")
    
    num_queries = {
        "quick": 3,
        "standard": 5,
        "comprehensive": 8,
    }.get(state["research_depth"], 5)

    agent = create_research_agent(verbose=True)
    task = Task(
        description=RESEARCH_TASK_TEMPLATE.format(
            topic=state["topic"],
            num_queries=num_queries,
        ),
        agent=agent,
        expected_output=(
            "Comprehensive research summary with key findings, statistics, "
            "expert opinions, and a complete source list with credibility ratings."
        ),
    )

    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    
    try:
        result = crew.kickoff()
        research_data = str(result)
        logger.info(f"[RESEARCH] Completed. Data length: {len(research_data)} chars")
        
        return {
            **state,
            "research_data": research_data,
            "status": WorkflowStatus.ANALYZING,
            "messages": [AIMessage(content=f"✅ Research complete. Found {len(research_data.split())} words of data.")],
        }
    except Exception as e:
        logger.error(f"[RESEARCH] Failed: {e}")
        return {
            **state,
            "status": WorkflowStatus.FAILED,
            "errors": state["errors"] + [f"Research error: {str(e)}"],
        }


def analysis_node(state: ResearchState) -> ResearchState:
    """
    Node 2: Analysis Agent synthesizes research into structured insights.
    """
    logger.info("[ANALYSIS] Starting data synthesis")
    
    agent = create_analysis_agent(verbose=True)
    task = Task(
        description=ANALYSIS_TASK_TEMPLATE.format(
            topic=state["topic"],
            research_data=state["research_data"][:8000],  # Context window safety
        ),
        agent=agent,
        expected_output=(
            "Structured analysis with executive summary, key insights, "
            "patterns, gaps, and a clear report outline."
        ),
    )

    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    
    try:
        result = crew.kickoff()
        analysis_data = str(result)
        logger.info(f"[ANALYSIS] Completed. Analysis length: {len(analysis_data)} chars")
        
        return {
            **state,
            "analysis_data": analysis_data,
            "status": WorkflowStatus.WRITING,
            "messages": [AIMessage(content="✅ Analysis complete. Key insights extracted and report outline created.")],
        }
    except Exception as e:
        logger.error(f"[ANALYSIS] Failed: {e}")
        return {
            **state,
            "status": WorkflowStatus.FAILED,
            "errors": state["errors"] + [f"Analysis error: {str(e)}"],
        }


def writing_node(state: ResearchState) -> ResearchState:
    """
    Node 3: Writing Agent produces the polished report.
    """
    logger.info("[WRITING] Starting report writing")
    
    target_words = {
        "quick": 1500,
        "standard": 3000,
        "comprehensive": 5000,
    }.get(state["research_depth"], 3000)

    agent = create_writing_agent(verbose=True)
    task = Task(
        description=WRITING_TASK_TEMPLATE.format(
            topic=state["topic"],
            analysis_data=state["analysis_data"][:6000],
            num_sections=5,
            target_words=target_words,
        ),
        agent=agent,
        expected_output=(
            f"Complete professional report in Markdown format, approximately "
            f"{target_words} words, with title, executive summary, {5} main sections, "
            "conclusion, recommendations, and references."
        ),
    )

    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    
    try:
        result = crew.kickoff()
        report_content = str(result)
        
        # Extract title from first H1 heading
        title = state["topic"]
        for line in report_content.split("\n"):
            if line.startswith("# "):
                title = line[2:].strip()
                break
        
        logger.info(f"[WRITING] Completed. Report: '{title}' ({len(report_content)} chars)")
        
        return {
            **state,
            "report_content": report_content,
            "report_title": title,
            "status": WorkflowStatus.REVIEWING,
            "messages": [AIMessage(content=f"✅ Report written: '{title}' (~{len(report_content.split())} words)")],
        }
    except Exception as e:
        logger.error(f"[WRITING] Failed: {e}")
        return {
            **state,
            "status": WorkflowStatus.FAILED,
            "errors": state["errors"] + [f"Writing error: {str(e)}"],
        }


def review_node(state: ResearchState) -> ResearchState:
    """
    Node 4: Review Agent quality-checks the report.
    """
    logger.info("[REVIEW] Starting quality review")
    
    agent = create_review_agent(verbose=True)
    task = Task(
        description=REVIEW_TASK_TEMPLATE.format(
            topic=state["topic"],
            report_content=state["report_content"][:8000],
        ),
        agent=agent,
        expected_output=(
            "Quality evaluation with scores for each dimension, list of issues found "
            "with severity ratings, specific improvement suggestions, and a final "
            "approval decision (Yes/No)."
        ),
    )

    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    
    try:
        result = crew.kickoff()
        review_feedback = str(result)
        
        # Parse quality score from review output
        quality_score = _extract_quality_score(review_feedback)
        approved = quality_score >= 7.0
        
        logger.info(f"[REVIEW] Score: {quality_score}/10 | Approved: {approved}")
        
        new_status = WorkflowStatus.COMPLETED if approved else WorkflowStatus.REVISING
        
        return {
            **state,
            "review_feedback": review_feedback,
            "quality_score": quality_score,
            "status": new_status,
            "messages": [AIMessage(
                content=f"{'✅' if approved else '⚠️'} Review complete. "
                        f"Score: {quality_score:.1f}/10. "
                        f"{'Approved for publication.' if approved else 'Revision requested.'}"
            )],
        }
    except Exception as e:
        logger.error(f"[REVIEW] Failed: {e}")
        # Don't fail the whole workflow on review error — just approve and continue
        return {
            **state,
            "quality_score": 7.5,  # Default pass score
            "status": WorkflowStatus.COMPLETED,
            "errors": state["errors"] + [f"Review error (non-fatal): {str(e)}"],
        }


def revision_node(state: ResearchState) -> ResearchState:
    """
    Node 5: Writing Agent revises the report based on review feedback.
    Only triggered when quality score < 7.0.
    """
    iteration = state["iteration"] + 1
    logger.info(f"[REVISION] Iteration {iteration} — applying review feedback")

    agent = create_writing_agent(verbose=True)
    task = Task(
        description=(
            f"Revise the following research report on '{state['topic']}' based on "
            f"the quality review feedback below.\n\n"
            f"ORIGINAL REPORT:\n{state['report_content'][:5000]}\n\n"
            f"REVIEW FEEDBACK (address all issues marked Critical or Major):\n"
            f"{state['review_feedback'][:3000]}\n\n"
            f"Produce an improved version of the report addressing all feedback. "
            f"Maintain the same overall structure but fix identified issues."
        ),
        agent=agent,
        expected_output="Revised, improved version of the report in Markdown format.",
    )

    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    
    try:
        result = crew.kickoff()
        revised_report = str(result)
        
        return {
            **state,
            "report_content": revised_report,
            "iteration": iteration,
            "status": WorkflowStatus.REVIEWING,  # Go back for another review
            "messages": [AIMessage(content=f"✅ Revision {iteration} complete. Re-submitting for review.")],
        }
    except Exception as e:
        # If revision fails, accept current report
        return {
            **state,
            "iteration": iteration,
            "status": WorkflowStatus.COMPLETED,
            "errors": state["errors"] + [f"Revision error: {str(e)}"],
        }


def pdf_generation_node(state: ResearchState) -> ResearchState:
    """
    Node 6: Generate the final PDF report.
    """
    logger.info("[PDF] Generating PDF report")
    
    try:
        generator = get_pdf_generator()
        pdf_path = generator.generate(
            content=state["report_content"],
            title=state["report_title"],
            topic=state["topic"],
            metadata={
                "author": "Multi-Agent AI Research System",
                "quality_score": f"{state.get('quality_score', 0):.1f}/10",
            },
        )
        
        logger.info(f"[PDF] Generated: {pdf_path}")
        return {
            **state,
            "pdf_path": pdf_path,
            "completed_at": datetime.now().isoformat(),
            "status": WorkflowStatus.COMPLETED,
            "messages": [AIMessage(content=f"✅ PDF report saved to: {pdf_path}")],
        }
    except Exception as e:
        logger.error(f"[PDF] Generation failed: {e}")
        return {
            **state,
            "completed_at": datetime.now().isoformat(),
            "errors": state["errors"] + [f"PDF error: {str(e)}"],
        }


# ─── Conditional Edge Functions ───────────────────────────────────────────────

def route_after_review(state: ResearchState) -> str:
    """Decide whether to approve, revise, or fail after review."""
    if state["status"] == WorkflowStatus.FAILED:
        return "failed"
    
    score = state.get("quality_score", 0)
    iteration = state.get("iteration", 0)
    max_iter = state.get("max_iterations", 2)
    
    if score >= 7.0:
        return "approved"
    elif iteration < max_iter:
        return "revise"
    else:
        # Max iterations reached — accept as-is
        logger.warning(f"Max revisions reached ({max_iter}). Accepting with score {score}")
        return "approved"


def route_after_research(state: ResearchState) -> str:
    """Route after research — fail fast if research failed."""
    if state["status"] == WorkflowStatus.FAILED:
        return "failed"
    return "continue"


# ─── Graph Builder ────────────────────────────────────────────────────────────

def build_research_graph() -> StateGraph:
    """
    Build and compile the LangGraph research workflow.
    
    Returns:
        Compiled StateGraph ready to run
    """
    graph = StateGraph(ResearchState)

    # Add nodes
    graph.add_node("research", research_node)
    graph.add_node("analyze", analysis_node)
    graph.add_node("write", writing_node)
    graph.add_node("review", review_node)
    graph.add_node("revise", revision_node)
    graph.add_node("generate_pdf", pdf_generation_node)

    # Entry point
    graph.add_edge(START, "research")

    # Research → conditional
    graph.add_conditional_edges(
        "research",
        route_after_research,
        {"continue": "analyze", "failed": END},
    )

    # Linear flow
    graph.add_edge("analyze", "write")
    graph.add_edge("write", "review")

    # Review → conditional (approve, revise, or fail)
    graph.add_conditional_edges(
        "review",
        route_after_review,
        {
            "approved": "generate_pdf",
            "revise": "revise",
            "failed": END,
        },
    )

    # Revision loops back to review
    graph.add_edge("revise", "review")

    # PDF → END
    graph.add_edge("generate_pdf", END)

    return graph.compile()


# ─── Main Runner ──────────────────────────────────────────────────────────────

class ResearchWorkflow:
    """High-level interface for running the research workflow."""

    def __init__(self):
        self.graph = build_research_graph()
        self._setup_tracing()

    def _setup_tracing(self):
        """Configure LangSmith tracing if available."""
        if settings.langsmith_enabled:
            os.environ["LANGCHAIN_TRACING_V2"] = "true"
            os.environ["LANGCHAIN_API_KEY"] = settings.langsmith_api_key
            os.environ["LANGCHAIN_PROJECT"] = settings.langchain_project
            logger.info(f"LangSmith tracing enabled: project={settings.langchain_project}")

    def run(
        self,
        topic: str,
        research_depth: str = "comprehensive",
        max_iterations: int = 2,
    ) -> dict[str, Any]:
        """
        Run the full research and report generation workflow.

        Args:
            topic: Research topic to investigate
            research_depth: "quick" | "standard" | "comprehensive"
            max_iterations: Max revision cycles

        Returns:
            Final state with report content, PDF path, quality score, etc.
        """
        initial_state: ResearchState = {
            "topic": topic,
            "research_depth": research_depth,
            "research_data": "",
            "analysis_data": "",
            "report_content": "",
            "review_feedback": "",
            "quality_score": 0.0,
            "status": WorkflowStatus.PENDING,
            "iteration": 0,
            "max_iterations": max_iterations,
            "messages": [HumanMessage(content=f"Research topic: {topic}")],
            "errors": [],
            "started_at": datetime.now().isoformat(),
            "completed_at": None,
            "pdf_path": None,
            "report_title": topic,
        }

        logger.info(f"Starting research workflow: '{topic}' | depth={research_depth}")

        try:
            final_state = self.graph.invoke(initial_state)
            
            duration = None
            if final_state.get("completed_at") and final_state.get("started_at"):
                start = datetime.fromisoformat(final_state["started_at"])
                end = datetime.fromisoformat(final_state["completed_at"])
                duration = str(end - start)

            logger.info(
                f"Workflow complete | Status: {final_state.get('status')} | "
                f"Score: {final_state.get('quality_score', 0):.1f}/10 | "
                f"Duration: {duration}"
            )

            return {
                "success": final_state.get("status") != WorkflowStatus.FAILED,
                "topic": topic,
                "title": final_state.get("report_title", topic),
                "report_content": final_state.get("report_content", ""),
                "pdf_path": final_state.get("pdf_path"),
                "quality_score": final_state.get("quality_score", 0),
                "status": final_state.get("status"),
                "iterations": final_state.get("iteration", 0),
                "errors": final_state.get("errors", []),
                "started_at": final_state.get("started_at"),
                "completed_at": final_state.get("completed_at"),
                "duration": duration,
            }
        except Exception as e:
            logger.error(f"Workflow failed with exception: {e}", exc_info=True)
            return {
                "success": False,
                "topic": topic,
                "error": str(e),
                "status": WorkflowStatus.FAILED,
            }

    async def run_async(self, topic: str, **kwargs) -> dict[str, Any]:
        """Async wrapper — runs sync workflow in thread pool."""
        import asyncio
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: self.run(topic, **kwargs))


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _extract_quality_score(review_text: str) -> float:
    """Extract overall quality score from review agent output."""
    import re
    
    patterns = [
        r"Overall Score:\s*(\d+(?:\.\d+)?)/10",
        r"overall score[:\s]+(\d+(?:\.\d+)?)",
        r"(\d+(?:\.\d+)?)/10",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, review_text, re.IGNORECASE)
        if match:
            score = float(match.group(1))
            return min(max(score, 0.0), 10.0)  # Clamp 0-10
    
    # Default: pass if we can't parse the score
    logger.warning("Could not parse quality score from review — defaulting to 7.5")
    return 7.5
