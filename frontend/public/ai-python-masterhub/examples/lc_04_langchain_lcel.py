"""pip install -U langchain-core langchain-openai"""
import os
if not os.getenv("OPENAI_API_KEY"):
    print("Set OPENAI_API_KEY to run against a live model."); raise SystemExit

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# --- classic string chain ---
chain = (ChatPromptTemplate.from_template(
            "Give 3 concise tips about {topic}. One line each.")
         | llm | StrOutputParser())
print(chain.invoke({"topic": "vector databases"}))

# --- structured output chain ---
class Idea(BaseModel):
    title: str
    effort_days: int

schain = (ChatPromptTemplate.from_messages([
            ("system", "Return JSON for: {fmt}"),
            ("human", "{goal}")])
          | llm.with_structured_output(Idea))
print(schain.invoke({"fmt": "project idea", "goal": "weekend RAG demo"}))

# --- branching with RunnableLambda ---
from langchain_core.runnables import RunnableLambda
route = RunnableLambda(lambda x: "short" if len(x) < 40 else "long")
print(route.invoke("hello world")) 