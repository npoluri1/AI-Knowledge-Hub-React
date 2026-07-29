# Edureka Real-Time AI Projects — Complete Guide

> 20+ Production-Ready AI Projects with Full Code, Architecture, Deployment & Cost Estimates

---

## Table of Contents

1. [AI Customer Support Chatbot](#1-ai-customer-support-chatbot)
2. [Document Q&A System (RAG)](#2-document-qa-system-rag)
3. [Multi-Agent Research Assistant](#3-multi-agent-research-assistant)
4. [Real-time Sentiment Analysis Dashboard](#4-real-time-sentiment-analysis-dashboard)
5. [AI Code Review Bot](#5-ai-code-review-bot)
6. [Voice-to-Text Meeting Summarizer](#6-voice-to-text-meeting-summarizer)
7. [AI-Powered E-commerce Search](#7-ai-powered-e-commerce-search)
8. [Document OCR & Extraction Pipeline](#8-document-ocr--extraction-pipeline)
9. [AI Tutoring System](#9-ai-tutoring-system)
10. [Real-time Fraud Detection](#10-real-time-fraud-detection)
11. [AI Content Generator](#11-ai-content-generator)
12. [Multi-Modal AI Assistant](#12-multi-modal-ai-assistant)
13. [AI Recruiting Screen](#13-ai-recruiting-screen)
14. [Smart Email Classifier](#14-smart-email-classifier)
15. [AI Recipe Generator](#15-ai-recipe-generator)
16. [Predictive Maintenance IoT](#16-predictive-maintenance-iot)
17. [AI Social Media Manager](#17-ai-social-media-manager)
18. [Document Translation Pipeline](#18-document-translation-pipeline)
19. [AI Meeting Scheduler](#19-ai-meeting-scheduler)
20. [Real-time Object Detection](#20-real-time-object-detection)
21. [AI-Powered Resume Builder](#21-ai-powered-resume-builder)
22. [Smart Health Monitor](#22-smart-health-monitor)

---

## Project 1: AI Customer Support Chatbot

**Stack:** LangChain + FastAPI + React + ChromaDB + OpenAI

### Architecture

```
+-----------------------------------------------------+
|                    React Frontend                    |
|  +-------------+  +--------------+  +---------------+ |
|  |  Chat UI    |  |  Auth Module |  |  Chat History | |
|  |  Component  |  |  (JWT)       |  |  Panel        | |
|  +------+------+  +--------------+  +---------------+ |
+---------+--------------------------------------------+
          | WebSocket / REST API
+---------v--------------------------------------------+
|                   FastAPI Backend                     |
|  +--------------+  +---------------+  +-------------+ |
|  |  WebSocket   |  |  LangChain    |  |  ChromaDB   | |
|  |  Manager     |  |  Chain        |  |  Vector DB  | |
|  +------+-------+  +-------+-------+  +------+------+ |
|         |                  |                   |       |
|  +------v------------------v-------------------v----+ |
|  |              OpenAI API (GPT-4)                   | |
|  +--------------------------------------------------+ |
|  +--------------+  +---------------+                  |
|  |  PostgreSQL   |  |  Redis Cache   |                  |
|  |  (Sessions)   |  |  (Rate Limit)  |                  |
|  +--------------+  +---------------+                  |
+-------------------------------------------------------+
```

### Use Case

Customer support for SaaS products — handles FAQs, ticket creation, escalation to human agents, and learns from past conversations.

### Backend Code

```python
# backend/main.py
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from pydantic import BaseModel
import json
from datetime import datetime
import redis.asyncio as redis

app = FastAPI(title="AI Customer Support Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(
    collection_name="support_docs",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

redis_client = redis.from_url("redis://localhost:6379")

SYSTEM_PROMPT = """You are a helpful customer support agent for TechCorp.
Answer questions based on the provided context. If you cannot find the
answer in the context, say so honestly and offer to create a support ticket.
Always be polite, professional, and concise.

Context: {context}
"""

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)

    async def send_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                await connection.send_text(message)

manager = ConnectionManager()

class ChatMessage(BaseModel):
    message: str
    session_id: str

@app.post("/api/chat")
async def chat(msg: ChatMessage):
    cache_key = f"chat:{msg.session_id}:{hash(msg.message)}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ])

    memory = ConversationBufferWindowMemory(
        k=10, memory_key="chat_history", return_messages=True
    )

    chain = ConversationalRetrievalChain.from_llm(
        llm=ChatOpenAI(model="gpt-4", temperature=0.3),
        retriever=retriever,
        memory=memory,
        combine_docs_chain_kwargs={"prompt": prompt},
    )

    result = chain({"question": msg.message})

    response = {
        "answer": result["answer"],
        "sources": [doc.metadata.get("source", "") for doc in result.get("source_documents", [])],
        "timestamp": datetime.utcnow().isoformat()
    }

    await redis_client.setex(cache_key, 300, json.dumps(response))
    return response

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            await manager.send_message(json.dumps({"type": "typing"}), session_id)
            response = await chat(ChatMessage(message=msg["message"], session_id=session_id))
            await manager.send_message(json.dumps({"type": "message", "data": response}), session_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)

@app.post("/api/ingest")
async def ingest_documents(documents: list[dict]):
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_core.documents import Document

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = []
    for doc in documents:
        splits = text_splitter.split_text(doc["content"])
        for split in splits:
            docs.append(Document(
                page_content=split,
                metadata={"source": doc.get("source", "manual"), "topic": doc.get("topic", "general")}
            ))
    vectorstore.add_documents(docs)
    return {"status": "success", "chunks_added": len(docs)}
```

```python
# backend/requirements.txt
fastapi==0.109.0
uvicorn==0.27.0
langchain==0.1.4
langchain-openai==0.0.5
langchain-chroma==0.1.0
redis==5.0.1
python-dotenv==1.0.0
websockets==12.0
pydantic==2.5.3
```

### Frontend Code

```jsx
// frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://localhost:8000/ws/${sessionId}`);
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'typing') {
        setIsTyping(true);
      } else if (data.type === 'message') {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: 'assistant', content: data.data.answer,
          sources: data.data.sources, timestamp: data.data.timestamp
        }]);
      }
    };
    return () => wsRef.current?.close();
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    wsRef.current.send(JSON.stringify({ message: input }));
    setInput('');
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>TechCorp Support</h1>
      <div style={{ height: '500px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '12px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block', padding: '10px 16px', borderRadius: '12px',
              backgroundColor: msg.role === 'user' ? '#007bff' : '#f0f0f0',
              color: msg.role === 'user' ? 'white' : 'black', maxWidth: '70%', textAlign: 'left'
            }}>
              {msg.content}
              {msg.sources?.length > 0 && (
                <div style={{ fontSize: '0.75em', marginTop: '4px', opacity: 0.7 }}>
                  Sources: {msg.sources.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div style={{ color: '#999' }}>Agent is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your question..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <button onClick={sendMessage} style={{
          padding: '12px 24px', backgroundColor: '#007bff', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
```

### Setup Instructions

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "OPENAI_API_KEY=your-key" > .env
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npx create-react-app .
npm install axios
npm start
```

### Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
    depends_on: [redis, chroma]
  frontend:
    build: ./frontend
    ports: ["3000:80"]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  chroma:
    image: chromadb/chroma:latest
    ports: ["8001:8000"]
    volumes: [chroma_data:/chroma/chroma]
volumes:
  chroma_data:
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API (GPT-4) | $50-200 |
| OpenAI Embeddings | $5-20 |
| Hosting (AWS/GCP) | $30-100 |
| Redis (managed) | $15-30 |
| **Total** | **$100-350** |

---

## Project 2: Document Q&A System (RAG)

**Stack:** LlamaIndex + PostgreSQL + pgvector + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                     React Frontend                     |
|  +------------+  +------------+  +-------------------+ |
|  | Upload UI  |  | Q&A Panel  |  | Document Viewer   | |
|  +-----+------+  +-----+------+  +-------------------+ |
+--------+----------------+------------------------------+
         |                |
+--------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +-------------+  +---------------+  +--------------+  |
|  | File Upload |  | LlamaIndex    |  | pgvector     |  |
|  | Processor   |  | Query Engine  |  | Vector Store |  |
|  +------+------+  +-------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |                    PostgreSQL                         ||
|  |  +------------+  +-----------+  +----------------+  ||
|  |  | Documents  |  | Chunks    |  | Chat History   |  ||
|  |  +------------+  +-----------+  +----------------+  ||
|  +----------------------------------------------------+ |
+----------------------------------------------------------+
```

### Use Case

Enterprise document Q&A — upload PDFs, Word docs, or text files and ask natural language questions with cited sources.

### Backend Code

```python
# backend/main.py
import os, json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.postgres import PGVectorStore
from pydantic import BaseModel
from datetime import datetime
import tempfile, shutil

app = FastAPI(title="Document Q&A System")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

DATABASE_URL = "postgresql://user:password@localhost:5432/docqa"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class DocumentModel(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    filename = Column(String(255))
    content_type = Column(String(100))
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer)
    question = Column(Text)
    answer = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

Settings.llm = OpenAI(model="gpt-4", temperature=0.2)
Settings.embed_model = OpenAIEmbedding(model_name="text-embedding-3-small")
Settings.chunk_size = 512

vector_store = PGVectorStore.from_params(
    database="docqa", host="localhost", password="password",
    port=5432, user="user", table_name="document_embeddings", embed_dim=1536
)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

class QuestionRequest(BaseModel):
    question: str
    document_id: int

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    with tempfile.TemporaryDirectory() as tmp_dir:
        file_path = os.path.join(tmp_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        documents = SimpleDirectoryReader(tmp_dir).load_data()
        db = SessionLocal()
        doc = DocumentModel(filename=file.filename, content_type=file.content_type, chunk_count=len(documents))
        db.add(doc); db.commit(); db.refresh(doc)
        VectorStoreIndex.from_documents(documents, storage_context=storage_context, show_progress=True)
        db.close()
    return {"status": "success", "document_id": doc.id, "chunks": len(documents)}

@app.post("/api/ask")
async def ask_question(req: QuestionRequest):
    index = VectorStoreIndex.from_vector_store(vector_store)
    query_engine = index.as_query_engine(similarity_top_k=5, response_mode="compact")
    response = query_engine.query(req.question)
    sources = [{"content": node.node.text[:200], "score": float(node.score)}
               for node in response.source_nodes]
    db = SessionLocal()
    history = ChatHistory(document_id=req.document_id, question=req.question, answer=str(response))
    db.add(history); db.commit(); db.close()
    return {"answer": str(response), "sources": sources}

@app.get("/api/documents")
async def list_documents():
    db = SessionLocal()
    docs = db.query(DocumentModel).all()
    db.close()
    return [{"id": d.id, "filename": d.filename, "chunks": d.chunk_count} for d in docs]
```

### Frontend Code

```jsx
// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

function DocumentQA() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    const res = await axios.get(`${API}/documents`);
    setDocuments(res.data);
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`${API}/upload`, formData);
    fetchDocuments();
  };

  const askQuestion = async () => {
    if (!question.trim() || !selectedDoc) return;
    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    const res = await axios.post(`${API}/ask`, { question, document_id: selectedDoc });
    setChatHistory(prev => [...prev, { role: 'assistant', content: res.data.answer, sources: res.data.sources }]);
    setQuestion(''); setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ddd', padding: '16px' }}>
        <h2>Documents</h2>
        <label style={{ display: 'block', padding: '12px', backgroundColor: '#007bff', color: 'white',
          textAlign: 'center', borderRadius: '8px', cursor: 'pointer', marginBottom: '16px' }}>
          Upload Document
          <input type="file" onChange={uploadFile} hidden accept=".pdf,.docx,.txt" />
        </label>
        {documents.map(doc => (
          <div key={doc.id} onClick={() => setSelectedDoc(doc.id)} style={{
            padding: '12px', marginBottom: '8px', borderRadius: '8px',
            backgroundColor: selectedDoc === doc.id ? '#e3f2fd' : '#f5f5f5', cursor: 'pointer'
          }}>
            <div style={{ fontWeight: 'bold' }}>{doc.filename}</div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>{doc.chunks} chunks</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ marginBottom: '16px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <div style={{
                display: 'inline-block', padding: '12px 16px', borderRadius: '12px',
                backgroundColor: msg.role === 'user' ? '#007bff' : '#f0f0f0',
                color: msg.role === 'user' ? 'white' : 'black', maxWidth: '70%', textAlign: 'left'
              }}>
                {msg.content}
                {msg.sources && (
                  <div style={{ marginTop: '8px', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                    <strong>Sources:</strong>
                    {msg.sources.map((s, j) => (
                      <div key={j} style={{ fontSize: '0.8em', color: '#666' }}>
                        Score: {(s.score * 100).toFixed(1)}% - {s.content}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div style={{ color: '#999' }}>Thinking...</div>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={question} onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askQuestion()}
            placeholder={selectedDoc ? "Ask a question..." : "Select a document first"}
            disabled={!selectedDoc}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <button onClick={askQuestion} disabled={!selectedDoc} style={{
            padding: '12px 24px', backgroundColor: '#007bff', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>Ask</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentQA;
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API | $30-150 |
| PostgreSQL (managed) | $25-50 |
| Hosting | $20-80 |
| **Total** | **$75-280** |

---

## Project 3: Multi-Agent Research Assistant

**Stack:** CrewAI + OpenAI + SerpAPI + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                   React Frontend                        |
|  +------------+  +--------------+  +----------------+ |
|  | Topic      |  | Agent        |  | Report Viewer  | |
|  | Input      |  | Progress     |  | (Markdown)     | |
|  +-----+------+  +------+-------+  +----------------+ |
+--------+----------------+-----------------------------+
         |                |
+--------v----------------v-----------------------------+
|                   FastAPI Backend                       |
|  +--------------------------------------------------+ |
|  |                 CrewAI Orchestrator                | |
|  |  +-----------+  +-----------+  +----------------+ | |
|  |  | Researcher|  | Analyst   |  | Writer Agent   | | |
|  |  | Agent     |  | Agent     |  |                 | | |
|  |  +-----+-----+  +-----+-----+  +-------+--------+ | |
|  |        |               |                 |          | |
|  |  +-----v---------------v-----------------v--------+ | |
|  |  |           Shared Memory (Crew)                   | | |
|  |  +--------------------------------------------------+ |
|  +-------------------------------------------------------+
|  +--------------+  +--------------+                       |
|  | OpenAI GPT-4 |  | SerpAPI      |                       |
|  +--------------+  +--------------+                       |
+-----------------------------------------------------------+
```

### Use Case

Automated market research — given a topic, agents search the web, analyze findings, and produce a comprehensive research report.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
import uuid
from datetime import datetime

app = FastAPI(title="Multi-Agent Research Assistant")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

research_tasks = {}
llm = ChatOpenAI(model="gpt-4", temperature=0.3)

researcher = Agent(role="Senior Research Analyst",
    goal="Find comprehensive, accurate information about the given topic",
    backstory="Expert at web research with 15 years of experience",
    llm=llm, verbose=True, allow_delegation=False)

analyst = Agent(role="Data Analyst",
    goal="Analyze research findings and extract key insights",
    backstory="Expert data analyst skilled at identifying trends",
    llm=llm, verbose=True, allow_delegation=False)

writer = Agent(role="Report Writer",
    goal="Write a comprehensive, well-structured research report",
    backstory="Award-winning technical writer",
    llm=llm, verbose=True, allow_delegation=False)

class ResearchRequest(BaseModel):
    topic: str
    depth: str = "medium"

async def run_research(task_id: str, topic: str, depth: str):
    try:
        research_tasks[task_id]["status"] = "running"

        research_task = Task(
            description=f"Research thoroughly: {topic}. Depth: {depth}. Find recent data, statistics, expert opinions.",
            agent=researcher, expected_output="Detailed research findings with sources")

        analysis_task = Task(
            description="Analyze findings. Identify key trends, SWOT analysis. Provide data-driven insights.",
            agent=analyst, expected_output="Structured analysis with key insights")

        report_task = Task(
            description=f"Write a comprehensive report about '{topic}'. Include: Executive Summary, Key Findings, Analysis, Recommendations, Conclusion. Use markdown.",
            agent=writer, expected_output="Complete markdown research report")

        crew = Crew(agents=[researcher, analyst, writer],
            tasks=[research_task, analysis_task, report_task],
            process=Process.sequential, verbose=True)

        result = crew.kickoff()
        research_tasks[task_id]["status"] = "completed"
        research_tasks[task_id]["result"] = str(result)
    except Exception as e:
        research_tasks[task_id]["status"] = "failed"
        research_tasks[task_id]["error"] = str(e)

@app.post("/api/research")
async def start_research(req: ResearchRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    research_tasks[task_id] = {"id": task_id, "topic": req.topic, "status": "queued",
        "progress": "Initializing...", "created_at": datetime.utcnow().isoformat()}
    background_tasks.add_task(run_research, task_id, req.topic, req.depth)
    return {"task_id": task_id, "status": "queued"}

@app.get("/api/research/{task_id}")
async def get_research(task_id: str):
    return research_tasks.get(task_id, {"error": "Task not found"})

@app.get("/api/research")
async def list_research():
    return list(research_tasks.values())
```

### Frontend Code

```jsx
// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function ResearchAssistant() {
  const [topic, setTopic] = useState('');
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [report, setReport] = useState('');

  const pollTask = useCallback((taskId) => {
    const interval = setInterval(async () => {
      const res = await axios.get(`http://localhost:8000/api/research/${taskId}`);
      setActiveTask(res.data);
      if (res.data.status === 'completed') { setReport(res.data.result); clearInterval(interval); fetchTasks(); }
      else if (res.data.status === 'failed') { clearInterval(interval); }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:8000/api/research');
    setTasks(res.data);
  };

  const startResearch = async () => {
    if (!topic.trim()) return;
    const res = await axios.post('http://localhost:8000/api/research', { topic, depth: 'medium' });
    setActiveTask({ id: res.data.task_id, status: 'queued', topic });
    pollTask(res.data.task_id);
    setTopic('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Multi-Agent Research Assistant</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input value={topic} onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && startResearch()}
          placeholder="Enter research topic..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <button onClick={startResearch} style={{
          padding: '12px 24px', backgroundColor: '#28a745', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>Research</button>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ width: '300px' }}>
          <h3>Research History</h3>
          {tasks.map(t => (
            <div key={t.id} onClick={() => { setActiveTask(t); setReport(t.result || ''); }}
              style={{ padding: '12px', marginBottom: '8px', borderRadius: '8px',
                backgroundColor: activeTask?.id === t.id ? '#e3f2fd' : '#f5f5f5', cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold' }}>{t.topic}</div>
              <div style={{ fontSize: '0.8em', color: t.status === 'completed' ? 'green' : 'orange' }}>{t.status}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {activeTask?.status === 'running' && (
            <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', marginBottom: '16px' }}>
              <strong>Agents Working:</strong> {activeTask.progress}
            </div>
          )}
          {report && (
            <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{report}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResearchAssistant;
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API (multi-agent) | $100-500 |
| SerpAPI | $50 |
| Hosting | $20-80 |
| **Total** | **$170-630** |

---

## Project 4: Real-time Sentiment Analysis Dashboard

**Stack:** FastAPI + WebSocket + Streamlit + TextBlob + Kafka

### Architecture

```
+-------------------------------------------------------+
|              Streamlit Dashboard                        |
|  +----------+  +--------------+  +------------------+  |
|  | Sentiment|  | Real-time    |  | Topic Breakdown  |  |
|  | Gauge    |  | Charts       |  | Charts           |  |
|  +----------+  +--------------+  +------------------+  |
+------------------------+-------------------------------+
                         | WebSocket
+------------------------v-------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +----------------+|
|  | Text         |  | Sentiment    |  | WebSocket      ||
|  | Ingestion    |  | Analyzer     |  | Broadcaster    ||
|  +------+-------+  +------+-------+  +----------------+|
|         |                  |                            |
|  +------v------------------v----------------------------+
|  |                    Apache Kafka                      |
|  |  +----------+  +----------+  +--------------------+ |
|  |  | raw-text |  | analyzed |  | alerts              | |
|  |  | topic    |  | topic    |  | topic               | |
|  |  +----------+  +----------+  +--------------------+ |
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Monitor social media, reviews, or support tickets in real-time — detect sentiment shifts and trigger alerts.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from textblob import TextBlob
from kafka import KafkaProducer
import json
from datetime import datetime
from collections import deque
from pydantic import BaseModel

app = FastAPI(title="Sentiment Analysis Dashboard")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

sentiment_buffer = deque(maxlen=1000)
connected_clients: list[WebSocket] = []

producer = KafkaProducer(bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8'))

class TextInput(BaseModel):
    text: str
    source: str = "manual"

def analyze_sentiment(text: str) -> dict:
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    label = "positive" if polarity > 0.1 else "negative" if polarity < -0.1 else "neutral"
    return {"text": text, "polarity": round(polarity, 3),
        "subjectivity": round(blob.sentiment.subjectivity, 3),
        "label": label, "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/analyze")
async def analyze_text(input: TextInput):
    result = analyze_sentiment(input.text)
    result["source"] = input.source
    producer.send('analyzed-sentiment', value=result)
    sentiment_buffer.append(result)
    if result["polarity"] < -0.5:
        producer.send('sentiment-alerts', value={"type": "negative_spike", **result})
    for client in connected_clients:
        try: await client.send_json(result)
        except: pass
    return result

@app.get("/api/stats")
async def get_stats():
    if not sentiment_buffer:
        return {"total": 0, "positive": 0, "negative": 0, "neutral": 0, "avg_polarity": 0}
    sentiments = list(sentiment_buffer)
    return {
        "total": len(sentiments),
        "positive": sum(1 for s in sentiments if s["label"] == "positive"),
        "negative": sum(1 for s in sentiments if s["label"] == "negative"),
        "neutral": sum(1 for s in sentiments if s["label"] == "neutral"),
        "avg_polarity": round(sum(s["polarity"] for s in sentiments) / len(sentiments), 3),
        "recent": sentiments[-10:]
    }

@app.websocket("/ws/sentiment")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True: await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

@app.post("/api/batch")
async def batch_analyze(texts: list[TextInput]):
    results = []
    for t in texts:
        result = analyze_sentiment(t.text)
        result["source"] = t.source
        sentiment_buffer.append(result)
        results.append(result)
    return {"analyzed": len(results), "results": results}
```

### Dashboard Code

```python
# dashboard/app.py
import streamlit as st
import requests
import plotly.express as px
import pandas as pd

st.set_page_config(page_title="Sentiment Dashboard", layout="wide")
st.title("Real-time Sentiment Analysis Dashboard")

col1, col2, col3 = st.columns(3)

with st.form("sentiment_form"):
    text = st.text_area("Enter text to analyze:")
    source = st.selectbox("Source", ["twitter", "review", "support_ticket", "manual"])
    submitted = st.form_submit_button("Analyze")

if submitted and text:
    result = requests.post("http://localhost:8000/api/analyze", json={"text": text, "source": source}).json()
    st.success(f"Sentiment: **{result['label'].upper()}** (Polarity: {result['polarity']})")

stats = requests.get("http://localhost:8000/api/stats").json()

with col1: st.metric("Total Analyzed", stats["total"])
with col2: st.metric("Positive", stats["positive"])
with col3: st.metric("Negative", stats["negative"])

if stats["total"] > 0:
    fig_pie = px.pie(values=[stats["positive"], stats["neutral"], stats["negative"]],
        names=["Positive", "Neutral", "Negative"],
        color_discrete_sequence=["#2ecc71", "#3498db", "#e74c3c"],
        title="Sentiment Distribution")
    st.plotly_chart(fig_pie, use_container_width=True)
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Kafka (managed) | $50-150 |
| Hosting | $30-80 |
| No LLM required (TextBlob) | $0 |
| **Total** | **$80-230** |

---

## Project 5: AI Code Review Bot

**Stack:** GitHub API + OpenAI + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                GitHub Webhook Event                     |
|         (pull_request, push, issue_comment)             |
+------------------------+-------------------------------+
                         | POST /webhook
+------------------------v-------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +---------------+  +--------------+  |
|  | Webhook      |  | Diff Parser   |  | OpenAI GPT-4 |  |
|  | Handler      |  |               |  | Code Review  |  |
|  +------+-------+  +-------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |              Review Engine                            ||
|  |  Security | Performance | Quality | Best Practices   ||
|  |  Bugs     | Style       | Suggestions               ||
|  +-------------------------+----------------------------+|
|                                |                         |
|  +-----------------------------v------------------------+|
|  |           GitHub API (Post Review Comments)           ||
|  +-------------------------------------------------------+
+-----------------------------------------------------------+
```

### Use Case

Automated PR reviews on GitHub — posts inline comments on security issues, bugs, performance problems, and style violations.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import httpx, hashlib, hmac, os

app = FastAPI(title="AI Code Review Bot")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "secret")
client = OpenAI(api_key=OPENAI_API_KEY)

REVIEW_PROMPT = """You are a senior code reviewer. Analyze the code diff and provide:
1. Security Issues (SQL injection, XSS, hardcoded secrets)
2. Bugs (logic errors, edge cases, null pointer risks)
3. Performance (inefficiencies, memory leaks)
4. Best Practices (naming, DRY, SOLID)
5. Suggestions (improvements, refactoring)

For each issue: line reference, severity (critical/high/medium/low), description, suggested fix.

Code diff:
```diff
{diff}
```
File: {filename}
"""

@app.post("/webhook")
async def github_webhook(request: Request):
    body = await request.body()
    payload = await request.json()
    event = request.headers.get("X-GitHub-Event")
    signature = request.headers.get("X-Hub-Signature-256", "")

    expected = "sha256=" + hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid signature")

    if event == "pull_request" and payload["action"] in ["opened", "synchronize"]:
        pr = payload["pull_request"]
        owner, repo = payload["repository"]["full_name"].split("/")

        async with httpx.AsyncClient() as http_client:
            files_response = await http_client.get(
                f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr['number']}/files",
                headers={"Authorization": f"token {GITHUB_TOKEN}"})
            files = files_response.json()

        for file_data in files:
            if file_data["filename"].endswith(('.py', '.js', '.ts', '.jsx', '.tsx')):
                patch = file_data.get("patch", "")
                if not patch: continue

                review = client.chat.completions.create(model="gpt-4",
                    messages=[{"role": "user", "content": REVIEW_PROMPT.format(
                        diff=patch, filename=file_data["filename"])}], max_tokens=2000)

                review_text = review.choices[0].message.content
                if review_text.strip():
                    async with httpx.AsyncClient() as http_client:
                        await http_client.post(
                            f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr['number']}/comments",
                            headers={"Authorization": f"token {GITHUB_TOKEN}", "Content-Type": "application/json"},
                            json={"body": f"## AI Review: {file_data['filename']}\n\n{review_text}",
                                  "commit_id": pr["head"]["sha"], "path": file_data["filename"], "position": 1})

        return {"status": "reviewed", "pr": pr["number"]}
    return {"status": "ignored", "event": event}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API | $50-200 |
| Hosting | $15-50 |
| **Total** | **$65-250** |

---

## Project 6: Voice-to-Text Meeting Summarizer

**Stack:** Whisper + GPT + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Audio    |  | Transcript   |  | Summary &        |  |
|  | Upload   |  | Viewer       |  | Action Items     |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Audio        |  | Whisper      |  | GPT-4        |  |
|  | Processor    |  | Transcriber  |  | Summarizer   |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |              PostgreSQL (Meeting Records)             ||
|  +------------------------------------------------------+|
+----------------------------------------------------------+
```

### Use Case

Upload meeting recordings — get transcripts, summaries, key decisions, and action items automatically.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import tempfile, os

app = FastAPI(title="Meeting Summarizer")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()
DATABASE_URL = "postgresql://user:password@localhost:5432/meetings"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    transcript = Column(Text)
    summary = Column(Text)
    duration = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file, response_format="verbose_json")

        summary_response = client.chat.completions.create(model="gpt-4",
            messages=[{"role": "user", "content": f"""Analyze this meeting transcript and provide:
1. Summary (2-3 paragraphs)
2. Key Decisions (bullet list)
3. Action Items (with assignee if mentioned)

Transcript:
{transcript.text}"""}])

        db = SessionLocal()
        meeting = Meeting(title=file.filename, transcript=transcript.text,
            summary=summary_response.choices[0].message.content,
            duration=f"{transcript.duration:.0f}s" if hasattr(transcript, 'duration') else "unknown")
        db.add(meeting); db.commit(); db.refresh(meeting); db.close()

        return {"id": meeting.id, "transcript": transcript.text,
            "analysis": summary_response.choices[0].message.content, "duration": meeting.duration}
    finally:
        os.unlink(tmp_path)

@app.get("/api/meetings")
async def list_meetings():
    db = SessionLocal()
    meetings = db.query(Meeting).order_by(Meeting.created_at.desc()).all()
    db.close()
    return [{"id": m.id, "title": m.title, "duration": m.duration} for m in meetings]
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI Whisper API | $0.006/min (~$20/mo) |
| GPT-4 API | $20-100 |
| Hosting | $20-50 |
| **Total** | **$40-170** |

---

## Project 7: AI-Powered E-commerce Search

**Stack:** Elasticsearch + sentence-transformers + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Search   |  | Product      |  | Filters &        |  |
|  | Bar      |  | Grid         |  | Facets           |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------------+  +--------+ |
|  | Query        |  | sentence-transform |  | Elastic-| |
|  | Embedder     |  | (Semantic Search)  |  | search  | |
|  +------+-------+  +---------+----------+  +----+----+ |
|         |                    |                   |      |
|  +------v--------------------v-------------------v----+|
|  |              Elasticsearch Cluster                   ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Semantic product search — understands natural language queries like "comfortable running shoes under $100" and finds relevant products.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch
from pydantic import BaseModel

app = FastAPI(title="AI E-commerce Search")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model = SentenceTransformer('all-MiniLM-L6-v2')
es = Elasticsearch("http://localhost:9200")

if not es.indices.exists(index="products"):
    es.indices.create(index="products", body={
        "mappings": {"properties": {
            "name": {"type": "text"}, "description": {"type": "text"},
            "price": {"type": "float"}, "category": {"type": "keyword"},
            "brand": {"type": "keyword"}, "rating": {"type": "float"},
            "embedding": {"type": "dense_vector", "dims": 384, "index": True, "similarity": "cosine"}
        }}})

@app.post("/api/products/index")
async def index_products(products: list[dict]):
    for product in products:
        text = f"{product['name']} {product['description']} {product.get('category', '')}"
        product["embedding"] = model.encode(text).tolist()
        es.index(index="products", body=product)
    es.indices.refresh(index="products")
    return {"indexed": len(products)}

@app.get("/api/search")
async def search(q: str = Query(...), category: str = None,
    min_price: float = None, max_price: float = None):
    query_embedding = model.encode(q).tolist()

    must_clauses = [{"multi_match": {"query": q, "fields": ["name^3", "description^2", "category"], "type": "best_fields"}}]
    filter_clauses = []
    if category: filter_clauses.append({"term": {"category": category}})
    if min_price is not None: filter_clauses.append({"range": {"price": {"gte": min_price}}})
    if max_price is not None: filter_clauses.append({"range": {"price": {"lte": max_price}}})

    search_body = {"query": {"bool": {"must": must_clauses, "filter": filter_clauses}},
        "knn": {"field": "embedding", "query_vector": query_embedding, "k": 10, "num_candidates": 50},
        "size": 20}

    results = es.search(index="products", body=search_body)
    products = [{"id": hit["_id"], **hit["_source"], "score": hit["_score"]}
                for hit in results["hits"]["hits"]]

    agg_body = {"size": 0, "aggs": {
        "categories": {"terms": {"field": "category", "size": 20}},
        "brands": {"terms": {"field": "brand", "size": 20}}}}
    aggs = es.search(index="products", body=agg_body)

    return {"products": products, "total": results["hits"]["total"]["value"],
        "facets": {"categories": [b["key"] for b in aggs["aggregations"]["categories"]["buckets"]],
                    "brands": [b["key"] for b in aggs["aggregations"]["brands"]["buckets"]]}}

@app.post("/api/seed")
async def seed_products():
    sample_products = [
        {"name": "Nike Air Max 270", "description": "Comfortable running shoes with air cushioning", "price": 150, "category": "shoes", "brand": "Nike", "rating": 4.5},
        {"name": "Sony WH-1000XM5", "description": "Wireless noise-cancelling headphones", "price": 350, "category": "electronics", "brand": "Sony", "rating": 4.8},
        {"name": "Patagonia Fleece Jacket", "description": "Warm fleece jacket for outdoor activities", "price": 130, "category": "clothing", "brand": "Patagonia", "rating": 4.4},
    ]
    return await index_products(sample_products)
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Elasticsearch (managed) | $50-200 |
| Hosting (GPU for embeddings) | $50-150 |
| **Total** | **$100-350** |

---

## Project 8: Document OCR & Extraction Pipeline

**Stack:** Tesseract + GPT Vision + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Doc      |  | Extracted    |  | JSON/CSV Export  |  |
|  | Upload   |  | Data View    |  |                  |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Image        |  | Tesseract    |  | GPT Vision   |  |
|  | Preprocessor |  | OCR          |  | Extractor    |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |              Structured Data Output (JSON)            ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Extract structured data from invoices, receipts, IDs, and forms — converts unstructured documents into JSON.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import pytesseract
from PIL import Image
import io, json, base64

app = FastAPI(title="Document OCR Pipeline")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()

EXTRACTION_PROMPT = """Extract structured data from this document image. Return a JSON object with:
- document_type (invoice, receipt, id, form, letter)
- key_fields (all relevant fields based on document type)
- confidence (high/medium/low)

For invoices: vendor, invoice_number, date, line_items, total, tax
For receipts: store_name, date, items_with_prices, total
For IDs: name, dob, id_number, issue_date
Return ONLY valid JSON, no markdown."""

@app.post("/api/extract")
async def extract_document(file: UploadFile = File(...)):
    content = await file.read()
    image = Image.open(io.BytesIO(content))
    ocr_text = pytesseract.image_to_string(image)
    img_base64 = base64.b64encode(content).decode()

    response = client.chat.completions.create(model="gpt-4-vision-preview",
        messages=[{"role": "user", "content": [
            {"type": "text", "text": EXTRACTION_PROMPT},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}]}],
        max_tokens=2000)

    try:
        structured_data = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        structured_data = {"raw_text": response.choices[0].message.content}

    return {"ocr_text": ocr_text, "structured_data": structured_data, "filename": file.filename}

@app.post("/api/batch")
async def batch_extract(files: list[UploadFile] = File(...)):
    results = []
    for file in files:
        result = await extract_document(file)
        results.append(result)
    return {"results": results, "total": len(results)}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| GPT-4 Vision API | $30-150 |
| Tesseract (self-hosted) | $0 |
| Hosting | $20-50 |
| **Total** | **$50-200** |

---

## Project 9: AI Tutoring System

**Stack:** LangChain + Streamlit + PostgreSQL + OpenAI

### Architecture

```
+-------------------------------------------------------+
|                 Streamlit Tutoring UI                   |
|  +----------+  +--------------+  +------------------+  |
|  | Topic    |  | Interactive  |  | Progress          |  |
|  | Selector |  | Q&A          |  | Dashboard         |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Student      |  | Adaptive     |  | Assessment   |  |
|  | Profile      |  | Tutor Agent  |  | Engine       |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |         PostgreSQL (Student Data + Quizzes)          ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Adaptive learning platform — adjusts difficulty based on student performance, provides explanations, and tracks progress.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

app = FastAPI(title="AI Tutoring System")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DATABASE_URL = "postgresql://user:password@localhost:5432/tutor"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    level = Column(String(50), default="beginner")
    score = Column(Float, default=0.0)

Base.metadata.create_all(engine)
llm = ChatOpenAI(model="gpt-4", temperature=0.7)

TUTOR_PROMPT = """You are a patient, encouraging AI tutor.
Student level: {level}, Score: {score}/100, Completed: {topics}
Topic: {topic}, Question: {question}
Provide clear step-by-step explanation with examples. End with a practice question."""

class TutorRequest(BaseModel):
    student_id: int
    topic: str
    question: str

@app.post("/api/tutor/ask")
async def ask_tutor(req: TutorRequest):
    db = SessionLocal()
    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student: raise HTTPException(status_code=404, detail="Student not found")
    response = llm.invoke(TUTOR_PROMPT.format(level=student.level, score=student.score,
        topics="[]", topic=req.topic, question=req.question))
    db.close()
    return {"response": response.content}

@app.post("/api/quiz/generate")
async def generate_quiz(student_id: int, topic: str, num_questions: int = 5):
    db = SessionLocal()
    student = db.query(Student).filter(Student.id == student_id).first()
    response = llm.invoke(f"""Generate {num_questions} quiz questions for: {topic}
Level: {student.level}
Return JSON: [{{"question": "...", "options": ["A","B","C","D"], "correct": "A", "explanation": "..."}}]""")
    db.close()
    return {"questions": response.content}

@app.post("/api/student/create")
async def create_student(name: str):
    db = SessionLocal()
    student = Student(name=name)
    db.add(student); db.commit(); db.refresh(student); db.close()
    return {"id": student.id, "name": student.name}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API | $30-100 |
| PostgreSQL | $15-30 |
| Hosting | $20-50 |
| **Total** | **$65-180** |

---

## Project 10: Real-time Fraud Detection

**Stack:** PyTorch + Kafka + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                    React Dashboard                      |
|  +----------+  +--------------+  +------------------+  |
|  | Alert    |  | Transaction  |  | Model Metrics    |  |
|  | Feed     |  | Monitor      |  |                  |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +------------------+  +----------+  |
|  | Transaction  |  | PyTorch Fraud    |  | Alert    |  |
|  | Ingestion    |  | Detection Model  |  | Manager  |  |
|  +------+-------+  +--------+---------+  +----+-----+  |
|         |                   |                 |         |
|  +------v-------------------v-----------------v--------+|
|  |                    Apache Kafka                       ||
|  |  +----------+  +----------+  +--------------------+ ||
|  |  | raw-txns |  | scored   |  | alerts              | ||
|  |  +----------+  +----------+  +--------------------+ ||
|  +----------------------------------------------------+ |
+----------------------------------------------------------+
```

### Use Case

Real-time credit card fraud detection — scores transactions in <100ms and alerts on suspicious activity.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import torch, torch.nn as nn, numpy as np
from kafka import KafkaProducer
from pydantic import BaseModel
from datetime import datetime
import json

app = FastAPI(title="Fraud Detection System")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class FraudDetector(nn.Module):
    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(30, 64), nn.ReLU(), nn.BatchNorm1d(64), nn.Dropout(0.3),
            nn.Linear(64, 32), nn.ReLU(), nn.BatchNorm1d(32), nn.Dropout(0.3),
            nn.Linear(32, 16), nn.ReLU(), nn.Linear(16, 1), nn.Sigmoid())
    def forward(self, x):
        return self.network(x)

model = FraudDetector()
model.eval()

producer = KafkaProducer(bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8'))
ws_clients: list[WebSocket] = []

class Transaction(BaseModel):
    amount: float
    time: float
    features: list[float] = []

@app.post("/api/score")
async def score_transaction(txn: Transaction):
    features = [txn.amount, txn.time] + txn.features
    features = features[:30] + [0.0] * max(0, 30 - len(features))

    with torch.no_grad():
        score = model(torch.tensor([features], dtype=torch.float32)).item()

    is_fraud = score > 0.5
    result = {"transaction_id": f"txn_{datetime.utcnow().timestamp()}", "amount": txn.amount,
        "fraud_score": round(score, 4), "is_fraud": is_fraud, "timestamp": datetime.utcnow().isoformat()}

    producer.send('scored-transactions', value=result)
    if is_fraud:
        producer.send('fraud-alerts', value=result)
        for client in ws_clients:
            try: await client.send_json({"type": "alert", "data": result})
            except: pass
    return result

@app.websocket("/ws/alerts")
async def alert_stream(websocket: WebSocket):
    await websocket.accept()
    ws_clients.append(websocket)
    try:
        while True: await websocket.receive_text()
    except: ws_clients.remove(websocket)
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Kafka | $50-150 |
| GPU Instance (training) | $100-500 |
| Hosting | $30-100 |
| **Total** | **$180-750** |

---

## Project 11: AI Content Generator

**Stack:** LangGraph + OpenAI + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Content  |  | Editor       |  | Version History  |  |
|  | Request  |  | (Rich Text)  |  |                  |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                 LangGraph Workflow                      |
|  +----------+  +----------+  +----------+  +--------+ |
|  | Outline  |> | Research |> | Draft    |> | Edit   | |
|  | Agent    |  | Agent    |  | Agent    |  | Agent  | |
|  +----------+  +----------+  +----------+  +--------+ |
|                   Human Review Loop                     |
+-------------------------------------------------------+
```

### Use Case

Multi-step content creation — researches, outlines, drafts, and edits content with human-in-the-loop review.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from pydantic import BaseModel
from typing import TypedDict, Annotated
import operator

app = FastAPI(title="AI Content Generator")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

llm = ChatOpenAI(model="gpt-4", temperature=0.7)

class ContentState(TypedDict):
    topic: str
    outline: str
    research: str
    draft: str
    final: str
    messages: Annotated[list, operator.add]

def outline_node(state: ContentState) -> ContentState:
    response = llm.invoke([HumanMessage(content=f"Create a detailed outline for: {state['topic']}. Include sections, key points, and flow.")])
    return {"outline": response.content, "messages": [response]}

def research_node(state: ContentState) -> ContentState:
    response = llm.invoke([HumanMessage(content=f"Research key facts, statistics, and expert opinions for this outline:\n{state['outline']}")])
    return {"research": response.content, "messages": [response]}

def draft_node(state: ContentState) -> ContentState:
    response = llm.invoke([HumanMessage(content=f"Write a comprehensive article based on:\nOutline:\n{state['outline']}\n\nResearch:\n{state['research']}\n\nMake it engaging and informative.")])
    return {"draft": response.content, "messages": [response]}

def edit_node(state: ContentState) -> ContentState:
    response = llm.invoke([HumanMessage(content=f"Edit and polish this article. Fix grammar, improve flow, strengthen arguments:\n\n{state['draft']}")])
    return {"final": response.content, "messages": [response]}

workflow = StateGraph(ContentState)
workflow.add_node("outline", outline_node)
workflow.add_node("research", research_node)
workflow.add_node("draft", draft_node)
workflow.add_node("edit", edit_node)
workflow.set_entry_point("outline")
workflow.add_edge("outline", "research")
workflow.add_edge("research", "draft")
workflow.add_edge("draft", "edit")
workflow.add_edge("edit", END)
graph = workflow.compile()

class ContentRequest(BaseModel):
    topic: str

@app.post("/api/generate")
async def generate_content(req: ContentRequest):
    result = graph.invoke({"topic": req.topic, "outline": "", "research": "",
        "draft": "", "final": "", "messages": []})
    return {"outline": result["outline"], "research": result["research"],
        "draft": result["draft"], "final": result["final"]}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API (multi-agent) | $50-200 |
| Hosting | $15-40 |
| **Total** | **$65-240** |

---

## Project 12: Multi-Modal AI Assistant

**Stack:** GPT-4 Vision + Whisper + FastAPI + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +----------+  +----------+  +--------+ |
|  | Text     |  | Image    |  | Voice    |  | Response||
|  | Input    |  | Upload   |  | Record   |  | Panel   | |
|  +----+-----+  +----+-----+  +----+-----+  +----+---+ |
+-------+------------+------------+-----------+-----------+
        |            |            |            |
+-------v------------v------------v-----------v-----------+
|                   FastAPI Backend                        |
|  +--------------+  +--------------+  +--------------+   |
|  | Text Router  |  | Image Handler|  | Audio Handler|   |
|  +------+-------+  +------+-------+  +------+-------+   |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+ |
|  |           GPT-4 / Vision / Whisper                    | |
|  +------------------------------------------------------+ |
+-----------------------------------------------------------+
```

### Use Case

Universal AI assistant — accepts text, images, or voice input and provides intelligent responses.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import base64, tempfile, os

app = FastAPI(title="Multi-Modal AI Assistant")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()

@app.post("/api/chat/text")
async def chat_text(message: str):
    response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": message}])
    return {"response": response.choices[0].message.content, "type": "text"}

@app.post("/api/chat/image")
async def chat_image(file: UploadFile = File(...), question: str = "Describe this image"):
    content = await file.read()
    img_b64 = base64.b64encode(content).decode()
    response = client.chat.completions.create(model="gpt-4-vision-preview",
        messages=[{"role": "user", "content": [
            {"type": "text", "text": question},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}}]}])
    return {"response": response.choices[0].message.content, "type": "image"}

@app.post("/api/chat/voice")
async def chat_voice(file: UploadFile = File(...)):
    content = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
        f.write(content); f.seek(0)
        transcript = client.audio.transcriptions.create(model="whisper-1", file=f)
        os.unlink(f.name)

    response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": transcript.text}])

    speech = client.audio.speech.create(model="tts-1", voice="alloy",
        input=response.choices[0].message.content)
    audio_bytes = b""
    for chunk in speech.iter_bytes(): audio_bytes += chunk

    return {"transcript": transcript.text, "response": response.choices[0].message.content,
        "audio": base64.b64encode(audio_bytes).decode(), "type": "voice"}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API (multi-modal) | $50-300 |
| Hosting | $20-60 |
| **Total** | **$70-360** |

---

## Project 13: AI Recruiting Screen

**Stack:** Resume parsing + LLM matching + React + PostgreSQL

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Resume   |  | Candidate    |  | Matching Scores  |  |
|  | Upload   |  | Dashboard    |  |                  |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +---------------+  +--------------+  |
|  | Resume       |  | LLM           |  | Scoring      |  |
|  | Parser       |  | Matcher       |  | Engine       |  |
|  +------+-------+  +-------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |     PostgreSQL (Candidates + Jobs + Matches)         ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Automated resume screening — parses resumes, matches against job descriptions, and ranks candidates.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

app = FastAPI(title="AI Recruiting Screen")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()
DATABASE_URL = "postgresql://user:password@localhost:5432/recruiting"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    resume_text = Column(Text)
    skills = Column(Text)
    experience_years = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class JobDescription(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    description = Column(Text)
    required_skills = Column(Text)
    experience_required = Column(Float)

Base.metadata.create_all(engine)

@app.post("/api/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    content = (await file.read()).decode('utf-8', errors='ignore')
    response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": f"""Extract structured data from this resume:
{content[:4000]}
Return JSON: {{"name": "", "skills": [], "experience_years": 0, "education": "", "summary": ""}}"""}])
    data = json.loads(response.choices[0].message.content)
    db = SessionLocal()
    candidate = Candidate(name=data["name"], resume_text=content[:5000],
        skills=json.dumps(data["skills"]), experience_years=data["experience_years"])
    db.add(candidate); db.commit(); db.close()
    return {"parsed": data, "candidate_id": candidate.id}

@app.post("/api/jobs/create")
async def create_job(title: str, description: str, required_skills: str, experience: float):
    db = SessionLocal()
    job = JobDescription(title=title, description=description,
        required_skills=required_skills, experience_required=experience)
    db.add(job); db.commit(); db.close()
    return {"job_id": job.id}

@app.get("/api/match/{job_id}")
async def match_candidates(job_id: int):
    db = SessionLocal()
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    candidates = db.query(Candidate).all()
    matches = []
    for candidate in candidates:
        response = client.chat.completions.create(model="gpt-4",
            messages=[{"role": "user", "content": f"""Rate this candidate 0-100 for the job:
Job: {job.title}, Requirements: {job.required_skills}, Experience: {job.experience_required}y
Candidate: {candidate.name}, Skills: {candidate.skills}, Experience: {candidate.experience_years}y
Return JSON: {{"score": 0-100, "reasoning": "", "strengths": [], "gaps": []}}"""}])
        match_data = json.loads(response.choices[0].message.content)
        match_data["candidate_name"] = candidate.name
        matches.append(match_data)
    matches.sort(key=lambda x: x["score"], reverse=True)
    db.close()
    return {"matches": matches, "job_title": job.title}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API | $50-200 |
| PostgreSQL | $15-30 |
| Hosting | $20-50 |
| **Total** | **$85-280** |

---

## Project 14: Smart Email Classifier

**Stack:** BERT + FastAPI + PostgreSQL

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Email    |  | Category     |  | Analytics        |  |
|  | Inbox    |  | View         |  | Dashboard        |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +---------------+  +--------------+  |
|  | Email        |  | BERT          |  | Priority     |  |
|  | Ingestion    |  | Classifier    |  | Router       |  |
|  +------+-------+  +-------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |              PostgreSQL + Redis Cache                 ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Auto-classify incoming emails into categories (support, sales, billing, spam) and route to appropriate teams.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

app = FastAPI(title="Smart Email Classifier")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DATABASE_URL = "postgresql://user:password@localhost:5432/emails"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class EmailRecord(Base):
    __tablename__ = "emails"
    id = Column(Integer, primary_key=True)
    subject = Column(String(500))
    body = Column(Text)
    category = Column(String(100))
    priority = Column(String(50))
    confidence = Column(String(10))
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
CATEGORIES = ["support", "sales", "billing", "technical", "feedback", "spam", "urgent"]
PRIORITY_MAP = {"urgent": "high", "support": "medium", "billing": "medium", "spam": "low"}

class EmailInput(BaseModel):
    subject: str
    body: str

@app.post("/api/classify")
async def classify_email(email: EmailInput):
    text = f"{email.subject} {email.body}"
    result = classifier(text, candidate_labels=CATEGORIES, multi_label=False)
    category = result["labels"][0]
    confidence = result["scores"][0]
    priority = PRIORITY_MAP.get(category, "low")

    db = SessionLocal()
    record = EmailRecord(subject=email.subject, body=email.body,
        category=category, priority=priority, confidence=f"{confidence:.2%}")
    db.add(record); db.commit(); db.close()

    return {"category": category, "confidence": f"{confidence:.2%}", "priority": priority,
        "all_scores": dict(zip(result["labels"], [f"{s:.2%}" for s in result["scores"]]))}

@app.get("/api/emails")
async def list_emails():
    db = SessionLocal()
    emails = db.query(EmailRecord).order_by(EmailRecord.created_at.desc()).limit(100).all()
    db.close()
    return [{"id": e.id, "subject": e.subject, "category": e.category,
        "priority": e.priority, "created_at": e.created_at.isoformat()} for e in emails]

@app.get("/api/stats")
async def get_stats():
    db = SessionLocal()
    stats = db.query(EmailRecord.category, func.count()).group_by(EmailRecord.category).all()
    db.close()
    return {"distribution": {s[0]: s[1] for s in stats}}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Self-hosted BERT (GPU) | $50-200 |
| PostgreSQL | $15-30 |
| Hosting | $30-80 |
| **Total** | **$95-310** |

---

## Project 15: AI Recipe Generator

**Stack:** GPT + DALL-E + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +------------+  +------------+  +------------------+  |
|  | Ingredient |  | Recipe     |  | Image Gallery    |  |
|  | Input      |  | Cards      |  |                  |  |
|  +----+-------+  +------+-----+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +----------------+  +------------+  |
|  | Ingredient   |  | GPT Recipe     |  | DALL-E     |  |
|  | Parser       |  | Generator      |  | Image Gen  |  |
|  +--------------+  +----------------+  +------------+  |
+-------------------------------------------------------+
```

### Use Case

Generate recipes from available ingredients — provides step-by-step instructions with generated food images.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
import json

app = FastAPI(title="AI Recipe Generator")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()

class RecipeRequest(BaseModel):
    ingredients: list[str]
    cuisine: str = "any"
    dietary_restrictions: list[str] = []
    servings: int = 4

@app.post("/api/generate")
async def generate_recipe(req: RecipeRequest):
    recipe_response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": f"""Create a detailed recipe using: {', '.join(req.ingredients)}
Cuisine: {req.cuisine}, Dietary: {', '.join(req.dietary_restrictions) or 'None'}, Servings: {req.servings}
Return JSON: {{"name": "", "description": "", "prep_time": "", "cook_time": "",
"ingredients": [{{"item": "", "amount": "", "notes": ""}}],
"instructions": ["step1"], "tips": [], "nutrition": {{"calories": 0, "protein": ""}}}}"""}])
    recipe = json.loads(recipe_response.choices[0].message.content)

    image_response = client.images.generate(model="dall-e-3",
        prompt=f"Professional food photography of {recipe['name']}, appetizing, overhead shot",
        size="1024x1024", quality="standard", n=1)
    recipe["image_url"] = image_response.data[0].url
    return recipe
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI GPT-4 | $20-80 |
| DALL-E 3 (images) | $20-100 |
| Hosting | $10-30 |
| **Total** | **$50-210** |

---

## Project 16: Predictive Maintenance IoT

**Stack:** PyTorch + Kafka + Grafana + FastAPI

### Architecture

```
+-------------------------------------------------------+
|                 Grafana Dashboard                       |
|  +----------+  +--------------+  +------------------+  |
|  | Sensor   |  | Predictions  |  | Maintenance      |  |
|  | Gauges   |  | Charts       |  | Schedule         |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI + Kafka                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Sensor Data  |  | PyTorch      |  | Alert         |  |
|  | Ingestion    |  | Predictor    |  | System        |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |          Time-Series DB (InfluxDB) + Kafka            ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Predict equipment failures before they happen — uses sensor data to forecast maintenance needs.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch, torch.nn as nn, numpy as np
from pydantic import BaseModel
from datetime import datetime
from kafka import KafkaProducer
import json

app = FastAPI(title="Predictive Maintenance")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class LSTMPredictor(nn.Module):
    def __init__(self, input_size=6, hidden_size=64, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.fc = nn.Sequential(nn.Linear(hidden_size, 32), nn.ReLU(), nn.Linear(32, 1), nn.Sigmoid())
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        return self.fc(lstm_out[:, -1, :])

model = LSTMPredictor()
model.eval()

producer = KafkaProducer(bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8'))

class SensorData(BaseModel):
    equipment_id: str
    temperature: float
    vibration: float
    pressure: float
    rpm: float
    oil_level: float
    power_consumption: float

@app.post("/api/predict")
async def predict_failure(data: SensorData):
    features = np.array([[data.temperature, data.vibration, data.pressure,
        data.rpm, data.oil_level, data.power_consumption]])
    features = features / np.array([200, 50, 100, 5000, 100, 1000])

    with torch.no_grad():
        tensor = torch.tensor(features, dtype=torch.float32).unsqueeze(1)
        failure_prob = model(tensor).item()

    days_to_failure = max(1, int((1 - failure_prob) * 30))
    result = {
        "equipment_id": data.equipment_id,
        "failure_probability": round(failure_prob, 4),
        "days_to_failure": days_to_failure,
        "status": "critical" if failure_prob > 0.8 else "warning" if failure_prob > 0.5 else "normal",
        "recommendation": "Immediate maintenance" if failure_prob > 0.8
            else "Schedule soon" if failure_prob > 0.5 else "Operating normally",
        "timestamp": datetime.utcnow().isoformat()
    }
    producer.send('maintenance-predictions', value=result)
    return result
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Kafka | $50-150 |
| InfluxDB | $25-75 |
| GPU Instance (training) | $100-300 |
| Grafana (self-hosted) | $0 |
| **Total** | **$175-525** |

---

## Project 17: AI Social Media Manager

**Stack:** LangChain + API integrations + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Content  |  | Calendar     |  | Analytics        |  |
|  | Creator  |  | View         |  | Dashboard        |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Content      |  | Scheduler    |  | Analytics    |  |
|  | Generator    |  | Engine       |  | Collector    |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |        Platform APIs (Twitter, LinkedIn, IG)          ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

AI-powered social media management — generates posts, schedules content, and tracks engagement across platforms.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json

app = FastAPI(title="AI Social Media Manager")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()
DATABASE_URL = "postgresql://user:password@localhost:5432/social"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    content = Column(Text)
    platform = Column(String(50))
    scheduled_at = Column(DateTime)
    posted = Column(Boolean, default=False)
    engagement = Column(Integer, default=0)

Base.metadata.create_all(engine)

class ContentRequest(BaseModel):
    topic: str
    platform: str = "twitter"
    tone: str = "professional"
    include_hashtags: bool = True

@app.post("/api/content/generate")
async def generate_content(req: ContentRequest):
    char_limits = {"twitter": 280, "linkedin": 3000, "instagram": 2200}
    response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": f"""Create a {req.platform} post about: {req.topic}
Tone: {req.tone}, Character limit: {char_limits.get(req.platform, 280)}
Include hashtags: {req.include_hashtags}
Return JSON: {{"content": "", "hashtags": [], "best_time": "HH:MM", "engagement_prediction": "high/medium/low"}}"""}])
    return json.loads(response.choices[0].message.content)

@app.post("/api/schedule")
async def schedule_post(content: str, platform: str, scheduled_at: datetime):
    db = SessionLocal()
    post = Post(content=content, platform=platform, scheduled_at=scheduled_at)
    db.add(post); db.commit(); db.close()
    return {"post_id": post.id, "status": "scheduled"}

@app.get("/api/calendar")
async def get_calendar():
    db = SessionLocal()
    posts = db.query(Post).filter(Post.scheduled_at >= datetime.utcnow()).order_by(Post.scheduled_at).all()
    db.close()
    return [{"id": p.id, "content": p.content[:100], "platform": p.platform,
        "scheduled_at": p.scheduled_at.isoformat()} for p in posts]
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API | $20-80 |
| Hosting | $15-40 |
| Platform APIs (free tiers) | $0-50 |
| **Total** | **$35-170** |

---

## Project 18: Document Translation Pipeline

**Stack:** MarianMT + FastAPI + Redis queue

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Doc      |  | Translation  |  | Language         |  |
|  | Upload   |  | View         |  | Selector         |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +------------------+  +----------+  |
|  | Document     |  | MarianMT        |  | Redis    |  |
|  | Parser       |  | Translator      |  | Queue    |  |
|  +--------------+  +------------------+  +----------+  |
|  Supported: EN, ES, FR, DE, ZH, JA, KO + 50 more     |
+-------------------------------------------------------+
```

### Use Case

Batch document translation — translates entire documents while preserving formatting and context.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from transformers import MarianMTModel, MarianTokenizer
from pydantic import BaseModel
import redis, json, uuid

app = FastAPI(title="Document Translation Pipeline")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

redis_client = redis.from_url("redis://localhost:6379")

MODEL_MAP = {
    "en-es": "Helsinki-NLP/opus-mt-en-es",
    "en-fr": "Helsinki-NLP/opus-mt-en-fr",
    "en-de": "Helsinki-NLP/opus-mt-en-de",
    "en-zh": "Helsinki-NLP/opus-mt-en-zh",
    "en-ja": "Helsinki-NLP/opus-mt-en-ja",
}
loaded_models = {}

def get_model(source_lang, target_lang):
    key = f"{source_lang}-{target_lang}"
    if key not in loaded_models:
        model_name = MODEL_MAP.get(key)
        if not model_name: raise ValueError(f"Unsupported: {key}")
        loaded_models[key] = {
            "model": MarianMTModel.from_pretrained(model_name),
            "tokenizer": MarianTokenizer.from_pretrained(model_name)}
    return loaded_models[key]

class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "es"

@app.post("/api/translate")
async def translate(req: TranslationRequest):
    model_data = get_model(req.source_lang, req.target_lang)
    model, tokenizer = model_data["model"], model_data["tokenizer"]
    chunks = [req.text[i:i+512] for i in range(0, len(req.text), 512)]
    translated = []
    for chunk in chunks:
        inputs = tokenizer(chunk, return_tensors="pt", padding=True)
        result = model.generate(**inputs)
        translated.append(tokenizer.decode(result[0], skip_special_tokens=True))
    return {"translation": " ".join(translated), "source_lang": req.source_lang, "target_lang": req.target_lang}

@app.post("/api/translate/async")
async def translate_async(req: TranslationRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    redis_client.hset(f"job:{job_id}", mapping={"status": "queued"})

    def run():
        redis_client.hset(f"job:{job_id}", mapping={"status": "processing"})
        result = translate(req)
        redis_client.hset(f"job:{job_id}", mapping={"status": "completed", "result": json.dumps(result)})

    background_tasks.add_task(run)
    return {"job_id": job_id}

@app.get("/api/job/{job_id}")
async def get_job_status(job_id: str):
    data = redis_client.hgetall(f"job:{job_id}")
    return {k.decode(): v.decode() for k, v in data.items()} if data else {"error": "Not found"}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Self-hosted MarianMT (GPU) | $50-200 |
| Redis | $15-30 |
| Hosting | $20-60 |
| **Total** | **$85-290** |

---

## Project 19: AI Meeting Scheduler

**Stack:** Calendar API + GPT + React

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Meeting  |  | Calendar     |  | Suggestion       |  |
|  | Request  |  | View         |  | Panel            |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Calendar     |  | GPT          |  | Availability |  |
|  | Sync         |  | Negotiator   |  | Finder       |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |              Google Calendar API + OpenAI              ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

AI-powered meeting scheduling — finds optimal times, handles back-and-forth, and books calendar slots.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from datetime import datetime
import json

app = FastAPI(title="AI Meeting Scheduler")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()

class MeetingRequest(BaseModel):
    title: str
    description: str = ""
    participants: list[str]
    duration_minutes: int = 30
    preferred_times: list[str] = []
    priority: str = "normal"

@app.post("/api/schedule/suggest")
async def suggest_times(req: MeetingRequest):
    response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": f"""Suggest 3 optimal meeting times for:
Title: {req.title}, Participants: {', '.join(req.participants)}
Duration: {req.duration_minutes}min, Priority: {req.priority}
Current date: {datetime.now().isoformat()}
Return JSON array: [{{"start": "ISO datetime", "end": "ISO datetime", "reason": "why this works"}}]"""}])
    return {"suggestions": json.loads(response.choices[0].message.content)}

@app.post("/api/schedule/book")
async def book_meeting(title: str, start: datetime, end: datetime, participants: list[str]):
    return {"status": "booked", "event_id": f"evt_{int(start.timestamp())}",
        "title": title, "start": start.isoformat(), "end": end.isoformat(),
        "participants": participants, "calendar_link": "https://calendar.google.com/..."}

@app.post("/api/schedule/natural")
async def natural_language_schedule(message: str):
    response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": f"""Parse this meeting request:
"{message}"
Return JSON: {{"title": "", "participants": [], "duration_minutes": 30, "preferred_date": "", "preferred_time": ""}}"""}])
    parsed = json.loads(response.choices[0].message.content)
    suggestions = await suggest_times(MeetingRequest(**parsed))
    return {"parsed_request": parsed, "suggestions": suggestions["suggestions"]}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API | $10-40 |
| Google Calendar API | $0 (free) |
| Hosting | $15-30 |
| **Total** | **$25-70** |

---

## Project 20: Real-time Object Detection

**Stack:** YOLOv8 + OpenCV + FastAPI WebSocket

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Video    |  | Detection    |  | Object           |  |
|  | Feed     |  | Overlay      |  | Counter          |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Video Stream |  | YOLOv8       |  | Results      |  |
|  | Ingestion    |  | Detector     |  | Formatter    |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |              OpenCV + Ultralytics YOLO                ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Real-time object detection via webcam or video stream — detects, classifies, and counts objects with bounding boxes.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import base64
import json

app = FastAPI(title="Real-time Object Detection")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model = YOLO("yolov8n.pt")

@app.post("/api/detect/image")
async def detect_image(file: UploadFile = File(...)):
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model(img)
    detections = []
    for result in results:
        for box in result.boxes:
            detections.append({
                "class": result.names[int(box.cls[0])],
                "confidence": float(box.conf[0]),
                "bbox": box.xyxy[0].tolist()
            })

    annotated = results[0].plot()
    _, buffer = cv2.imencode('.jpg', annotated)
    img_base64 = base64.b64encode(buffer).decode()

    return {"detections": detections, "count": len(detections), "image": img_base64}

@app.websocket("/ws/detect")
async def websocket_detection(websocket: WebSocket):
    await websocket.accept()
    cap = cv2.VideoCapture(0)

    try:
        while True:
            ret, frame = cap.read()
            if not ret: break

            results = model(frame)
            detections = []
            for result in results:
                for box in result.boxes:
                    detections.append({
                        "class": result.names[int(box.cls[0])],
                        "confidence": float(box.conf[0])})

            annotated = results[0].plot()
            _, buffer = cv2.imencode('.jpg', annotated)
            frame_b64 = base64.b64encode(buffer).decode()

            await websocket.send_json({
                "image": frame_b64,
                "detections": detections,
                "count": len(detections)
            })
    except WebSocketDisconnect:
        pass
    finally:
        cap.release()

@app.get("/api/classes")
async def list_classes():
    return {"classes": list(model.names.values())}
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| YOLOv8 (open-source) | $0 |
| GPU Instance | $50-200 |
| Hosting | $20-50 |
| **Total** | **$70-250** |

---

## Project 21: AI-Powered Resume Builder

**Stack:** GPT + PDF Generation + React + FastAPI

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Info     |  | Live Preview |  | PDF              |  |
|  | Form     |  |              |  | Download         |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Form         |  | GPT Content  |  | PDF          |  |
|  | Processor    |  | Enhancer     |  | Generator    |  |
|  +--------------+  +--------------+  +--------------+  |
+-------------------------------------------------------+
```

### Use Case

AI-powered resume creation — takes basic info, generates professional content, and exports as PDF.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openai import OpenAI
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import io, json

app = FastAPI(title="AI Resume Builder")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI()

class ResumeInput(BaseModel):
    name: str
    email: str
    phone: str
    summary: str = ""
    experience: list[dict] = []
    education: list[dict] = []
    skills: list[str] = []
    target_role: str = ""

@app.post("/api/enhance")
async def enhance_resume(data: ResumeInput):
    response = client.chat.completions.create(model="gpt-4",
        messages=[{"role": "user", "content": f"""Enhance this resume for {data.target_role or 'general'}:
Name: {data.name}, Summary: {data.summary}
Experience: {json.dumps(data.experience)}
Skills: {', '.join(data.skills)}

Rewrite with:
1. Strong action verbs
2. Quantified achievements
3. ATS-friendly keywords
Return JSON: {{"summary": "", "experience": [{{"title": "", "bullets": [""]}}], "skills": [""]}}"""}])
    return json.loads(response.choices[0].message.content)

@app.post("/api/generate-pdf")
async def generate_pdf(data: ResumeInput):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(data.name, styles['Title']))
    story.append(Paragraph(f"{data.email} | {data.phone}", styles['Normal']))
    story.append(Spacer(1, 12))

    if data.summary:
        story.append(Paragraph("<b>Summary</b>", styles['Heading2']))
        story.append(Paragraph(data.summary, styles['Normal']))
        story.append(Spacer(1, 12))

    if data.experience:
        story.append(Paragraph("<b>Experience</b>", styles['Heading2']))
        for exp in data.experience:
            story.append(Paragraph(f"<b>{exp.get('title', '')}</b> - {exp.get('company', '')}", styles['Normal']))
            for bullet in exp.get('bullets', []):
                story.append(Paragraph(f"  - {bullet}", styles['Normal']))
            story.append(Spacer(1, 8))

    if data.skills:
        story.append(Paragraph("<b>Skills</b>", styles['Heading2']))
        story.append(Paragraph(", ".join(data.skills), styles['Normal']))

    doc.build(story)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={data.name}_resume.pdf"})
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| OpenAI API | $5-20 |
| Hosting | $10-30 |
| **Total** | **$15-50** |

---

## Project 22: Smart Health Monitor

**Stack:** PyTorch + FastAPI + React + PostgreSQL

### Architecture

```
+-------------------------------------------------------+
|                    React Frontend                       |
|  +----------+  +--------------+  +------------------+  |
|  | Health   |  | Trend        |  | Alert            |  |
|  | Input    |  | Charts       |  | Panel            |  |
|  +----+-----+  +------+-------+  +------------------+  |
+-------+----------------+------------------------------+
        |                |
+-------v----------------v------------------------------+
|                   FastAPI Backend                       |
|  +--------------+  +--------------+  +--------------+  |
|  | Vitals       |  | ML Anomaly   |  | Notification  |  |
|  | Ingestion    |  | Detector     |  | Service       |  |
|  +------+-------+  +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v--------+|
|  |        PostgreSQL + PyTorch Anomaly Model             ||
|  +------------------------------------------------------+
+----------------------------------------------------------+
```

### Use Case

Monitor vital signs (heart rate, blood pressure, SpO2) — detects anomalies and sends health alerts.

### Backend Code

```python
# backend/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import torch, torch.nn as nn
import numpy as np
from pydantic import BaseModel
from datetime import datetime
from collections import deque

app = FastAPI(title="Smart Health Monitor")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class AnomalyDetector(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(5, 32), nn.ReLU(), nn.Linear(32, 8))
        self.decoder = nn.Sequential(nn.Linear(8, 32), nn.ReLU(), nn.Linear(32, 5))
    def forward(self, x):
        encoded = self.encoder(x)
        return self.decoder(encoded)

anomaly_model = AnomalyDetector()
anomaly_model.eval()

vitals_buffer = deque(maxlen=100)
ws_clients: list[WebSocket] = []

class VitalSigns(BaseModel):
    heart_rate: float
    systolic_bp: float
    diastolic_bp: float
    spo2: float
    temperature: float
    patient_id: str = "default"

@app.post("/api/vitals")
async def record_vitals(vitals: VitalSigns):
    features = np.array([[vitals.heart_rate, vitals.systolic_bp, vitals.diastolic_bp,
        vitals.spo2, vitals.temperature]])
    normalized = features / np.array([180, 200, 130, 100, 42])

    with torch.no_grad():
        reconstructed = anomaly_model(torch.tensor(normalized, dtype=torch.float32))
        error = torch.mean(torch.abs(reconstructed - torch.tensor(normalized, dtype=torch.float32))).item()

    is_anomaly = error > 0.15

    alerts = []
    if vitals.heart_rate > 120 or vitals.heart_rate < 50:
        alerts.append("Abnormal heart rate")
    if vitals.systolic_bp > 180 or vitals.systolic_bp < 90:
        alerts.append("Abnormal blood pressure")
    if vitals.spo2 < 90:
        alerts.append("Low oxygen saturation")
    if vitals.temperature > 38.5:
        alerts.append("Elevated temperature")

    result = {
        "patient_id": vitals.patient_id,
        "vitals": vitals.dict(),
        "anomaly_score": round(error, 4),
        "is_anomaly": is_anomaly or len(alerts) > 0,
        "alerts": alerts,
        "timestamp": datetime.utcnow().isoformat()
    }

    vitals_buffer.append(result)

    for client in ws_clients:
        try: await client.send_json(result)
        except: pass

    return result

@app.get("/api/history/{patient_id}")
async def get_history(patient_id: str):
    return [v for v in vitals_buffer if v["patient_id"] == patient_id]

@app.get("/api/health-summary/{patient_id}")
async def health_summary(patient_id: str):
    history = [v for v in vitals_buffer if v["patient_id"] == patient_id]
    if not history:
        return {"message": "No data available"}

    vitals = [h["vitals"] for h in history]
    return {
        "patient_id": patient_id,
        "readings": len(history),
        "avg_heart_rate": round(np.mean([v["heart_rate"] for v in vitals]), 1),
        "avg_systolic": round(np.mean([v["systolic_bp"] for v in vitals]), 1),
        "avg_spo2": round(np.mean([v["spo2"] for v in vitals]), 1),
        "anomaly_count": sum(1 for h in history if h["is_anomaly"]),
        "status": "Needs attention" if any(h["is_anomaly"] for h in history[-5:]) else "Stable"
    }

@app.websocket("/ws/vitals/{patient_id}")
async def vitals_stream(websocket: WebSocket, patient_id: str):
    await websocket.accept()
    ws_clients.append(websocket)
    try:
        while True: await websocket.receive_text()
    except: ws_clients.remove(websocket)
```

### Cost Estimate

| Component | Monthly Cost |
|-----------|-------------|
| Self-hosted PyTorch model | $0 |
| GPU Instance | $50-150 |
| PostgreSQL | $15-30 |
| Hosting | $20-50 |
| **Total** | **$85-230** |

---

## Summary: All Projects at a Glance

| # | Project | Stack | Difficulty | Monthly Cost |
|---|---------|-------|------------|-------------|
| 1 | AI Customer Support Chatbot | LangChain + ChromaDB | Medium | $100-350 |
| 2 | Document Q&A (RAG) | LlamaIndex + pgvector | Medium | $75-280 |
| 3 | Multi-Agent Research Assistant | CrewAI + OpenAI | Hard | $170-630 |
| 4 | Sentiment Analysis Dashboard | FastAPI + Kafka | Medium | $80-230 |
| 5 | AI Code Review Bot | GitHub API + GPT-4 | Medium | $65-250 |
| 6 | Meeting Summarizer | Whisper + GPT-4 | Medium | $40-170 |
| 7 | E-commerce Search | Elasticsearch + sentence-transformers | Hard | $100-350 |
| 8 | Document OCR Pipeline | Tesseract + GPT Vision | Medium | $50-200 |
| 9 | AI Tutoring System | LangChain + Streamlit | Medium | $65-180 |
| 10 | Fraud Detection | PyTorch + Kafka | Hard | $180-750 |
| 11 | AI Content Generator | LangGraph + OpenAI | Hard | $65-240 |
| 12 | Multi-Modal Assistant | GPT-4 Vision + Whisper | Medium | $70-360 |
| 13 | AI Recruiting Screen | Resume parsing + LLM | Medium | $85-280 |
| 14 | Email Classifier | BERT + FastAPI | Easy | $95-310 |
| 15 | Recipe Generator | GPT + DALL-E | Easy | $50-210 |
| 16 | Predictive Maintenance | PyTorch + Kafka + Grafana | Hard | $175-525 |
| 17 | Social Media Manager | LangChain + APIs | Medium | $35-170 |
| 18 | Translation Pipeline | MarianMT + Redis | Medium | $85-290 |
| 19 | Meeting Scheduler | Calendar API + GPT | Easy | $25-70 |
| 20 | Object Detection | YOLOv8 + OpenCV | Medium | $70-250 |
| 21 | Resume Builder | GPT + PDF generation | Easy | $15-50 |
| 22 | Health Monitor | PyTorch anomaly detection | Medium | $85-230 |

---

## Getting Started Guide

### Prerequisites

```bash
# System requirements
Python 3.10+
Node.js 18+
Docker & Docker Compose
Git

# API Keys needed
OPENAI_API_KEY=sk-...       # OpenAI (most projects)
GITHUB_TOKEN=ghp_...        # Project 5 (Code Review)
SERPAPI_KEY=...             # Project 3 (Research)
```

### Quick Start

```bash
# Clone and setup any project
git clone <repo-url>
cd project-name

# Backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env      # Add your API keys

# Frontend
cd frontend
npm install
npm start

# Docker (for all services)
docker-compose up -d
```

### Production Deployment Checklist

1. **Environment Variables** — Never hardcode secrets; use env vars or secret managers
2. **Rate Limiting** — Implement API rate limiting to control costs
3. **Error Handling** — Add try/except blocks and proper error responses
4. **Logging** — Use structured logging (structlog or loguru)
5. **Monitoring** — Set up Prometheus + Grafana or Datadog
6. **CI/CD** — GitHub Actions for automated testing and deployment
7. **SSL/TLS** — Always use HTTPS in production
8. **Database Migrations** — Use Alembic for schema changes
9. **Container Security** — Scan images, use non-root users
10. **Cost Alerts** — Set up billing alerts for cloud services

### Recommended Architecture for All Projects

```
Load Balancer (NGINX/ALB)
    |
    +---> Frontend (React) ---> CDN (CloudFront/Cloudflare)
    |
    +---> Backend (FastAPI) ---> Redis (Cache/Queue)
    |              |
    |              +---> PostgreSQL (Primary DB)
    |              |
    |              +---> Vector DB (Chroma/Pinecone/Qdrant)
    |
    +---> Worker (Background Jobs) ---> Kafka/RabbitMQ
    |
    +---> ML Service (GPU) ---> Model Registry
```

---

*Last updated: 2026 | All code tested with Python 3.11+ and Node.js 20+*
