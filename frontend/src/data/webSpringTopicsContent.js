export const WEB_SPRING_TOPICS_CONTENT = {
  "Path/query/body params auto docs /docs swagger": {
    why: "FastAPI auto-generates OpenAPI docs from your type hints. Clients, testers, and frontend devs get live docs for free. Without explicit parameter declarations, you get no validation, no docs, and runtime surprises.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int, role: str = "viewer"):
    return {"user_id": user_id, "role": role}

@app.post("/items")
async def create_item(name: str, price: float):
    return {"name": name, "price": price}

# Visit /docs → Swagger UI shows both endpoints
# with types, defaults, and try-it-out panels`
  },
  "Pydantic v2 models Field validators constr ge/le/pattern": {
    why: "Pydantic v2 validates at the boundary, rejecting bad data before it touches your logic. Field constraints (ge, le, pattern) replace hundreds of manual if-checks and generate clear error messages automatically.",
    code: `from pydantic import BaseModel, Field, field_validator
import re

class CreateUser(BaseModel):
    username: str = Field(..., min_length=3, max_length=32, pattern=r"^[a-z_]+$")
    email: str = Field(..., pattern=r"^\\w+@\\w+\\.\\w+$")
    age: int = Field(..., ge=0, le=150)
    bio: str = Field(default="", max_length=500)

    @field_validator("username")
    @classmethod
    def no_reserved(cls, v: str) -> str:
        if v in ("admin", "root", "system"):
            raise ValueError("reserved username")
        return v

# Invalid request → 422 with structured error details`
  },
  "Response models output filtering exclude_unset": {
    why: "Returning raw ORM objects leaks internal fields like passwords and timestamps. Response models filter output so clients only see what they should, and exclude_unset skips defaults for patch-like responses.",
    code: `from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class UserIn(BaseModel):
    name: str
    email: str
    password: str

class UserOut(BaseModel):
    name: str
    email: str

class UserPartial(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

@app.post("/users", response_model=UserOut)
async def create_user(user: UserIn):
    # password never leaks to response
    return {"name": user.name, "email": user.email,
            "password": user.password, "id": 999}

@app.patch("/users/{id}", response_model=UserPartial,
           response_model_exclude_unset=True)
async def update_user(id: int, body: UserPartial):
    # Only returns fields the client actually sent
    return body`
  },
  "Status codes & HTTPException proper verbs semantics": {
    why: "Using correct HTTP status codes (201, 404, 409) makes your API RESTful and lets caches, proxies, and clients behave correctly. Throwing HTTPException with the right code prevents vague 500 errors on business failures.",
    code: `from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()
USERS_DB = {}

@app.post("/users", status_code=201)
async def create_user(username: str):
    if username in USERS_DB:
        raise HTTPException(status_code=409, detail="Username taken")
    USERS_DB[username] = {"active": True}
    return {"username": username}

@app.get("/users/{username}")
async def get_user(username: str):
    if username not in USERS_DB:
        raise HTTPException(status_code=404, detail="Not found")
    return USERS_DB[username]

@app.delete("/users/{username}", status_code=204)
async def delete_user(username: str):
    if username not in USERS_DB:
        raise HTTPException(status_code=404, detail="Not found")
    del USERS_DB[username]`
  },
  "Annotated dependencies modern DI style": {
    why: "Using Annotated[] with FastAPI dependencies keeps parameter types clean and lets you reuse validation logic (DB sessions, auth checks) without repeating code across endpoints.",
    code: `from typing import Annotated
from fastapi import FastAPI, Depends, Query

app = FastAPI()

def validate_pagination(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return {"skip": skip, "limit": limit}

def get_db():
    db = {"conn": "live"}
    try:
        yield db
    finally:
        db["conn"].close()

Pagination = Annotated[dict, Depends(validate_pagination)]
DB = Annotated[dict, Depends(get_db)]

@app.get("/items")
async def list_items(pagination: Pagination, db: DB):
    return {"items": [], **pagination}

# Annotated aliases keep function signatures readable
# while injecting validated, typed dependencies`
  },
  "Query param lists aliases pagination skip/limit": {
    why: "Most list endpoints need pagination, filtering, and sorting. FastAPI handles repeated query params (tags=a&tags=b) natively, and aliases let you use DB-friendly param names in the URL.",
    code: `from fastapi import FastAPI, Query
from typing import Optional

app = FastAPI()

@app.get("/products")
async def list_products(
    tags: list[str] = Query(default=[], description="Filter by tags"),
    sort_by: str = Query("created_at", alias="sortBy"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
):
    filters = {"tags": tags, "search": search,
               "sort": f"{sort_by} {order}",
               "offset": skip, "size": limit}
    return {"filters": filters, "results": []}

# GET /products?tags=ai&tags=ml&sortBy=price&order=asc&limit=5`
  },
  "Routers APIRouter prefix/tags modular apps": {
    why: "As an API grows, a single router becomes unwieldy. APIRouter splits endpoints into modules with prefixes and tags, keeping the OpenAPI docs organized and code maintainable.",
    code: `from fastapi import FastAPI, APIRouter

app = FastAPI()

users_router = APIRouter(prefix="/users", tags=["Users"])
items_router = APIRouter(prefix="/items", tags=["Items"])

@users_router.get("/")
async def list_users():
    return [{"name": "Alice"}]

@users_router.get("/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id}

@items_router.get("/")
async def list_items():
    return [{"title": "Widget"}]

@items_router.post("/")
async def create_item(title: str):
    return {"title": title, "id": 1}

app.include_router(users_router)
app.include_router(items_router)
# OpenAPI /docs shows grouped endpoints under Users and Items`
  },
  "Nested models & examples schema richness for clients": {
    why: "Real APIs use nested objects, not flat dicts. Defining nested Pydantic models with examples generates accurate OpenAPI schemas that frontend devs and code-gen tools can consume directly.",
    code: `from pydantic import BaseModel, Field
from typing import Optional

class Address(BaseModel):
    street: str
    city: str
    country: str = "US"

class UserCreate(BaseModel):
    name: str
    address: Address
    tags: list[str] = Field(default_factory=list)
    metadata: Optional[dict[str, str]] = None

    model_config = {
        "json_schema_extra": {
            "examples": [{
                "name": "Alice",
                "address": {"street": "123 Main St",
                            "city": "Portland", "country": "US"},
                "tags": ["admin", "beta"],
            }]
        }
    }

# /docs shows nested schema with expandable Address object
# OpenAPI codegen produces correct TypeScript interfaces`
  },
  "Depends dependency injection chains overrides in tests": {
    why: "DI chains let you compose complex dependencies (auth → DB → service) from small, testable pieces. Overriding deps in tests means you never hit a real database or auth server during unit tests.",
    code: `from fastapi import FastAPI, Depends, Query
from typing import Annotated

app = FastAPI()

def verify_token(token: str = Query(...)) -> str:
    if token != "secret":
        raise ValueError("bad token")
    return token

def get_current_user(token: str = Depends(verify_token)) -> dict:
    return {"user_id": 1, "name": "Alice", "token": token}

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user["user_id"] != 1:
        raise ValueError("not admin")
    return user

@app.get("/admin/stats")
async def admin_stats(admin: Annotated[dict, Depends(require_admin)]):
    return {"admin": admin["name"], "stats": {"users": 42}}

# In tests: app.dependency_overrides[verify_token] = lambda: "fake"`
  },
  "Security OAuth2PasswordBearer scopes role gates": {
    why: "OAuth2PasswordBearer integrates FastAPI with token-based auth. Scopes let you gate endpoints by role (admin, editor) and the /docs UI lets you test with real tokens.",
    code: `from fastapi import FastAPI, Depends, Security
from fastapi.security import OAuth2PasswordBearer, SecurityScopes

app = FastAPI()
oauth2 = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"read": "Read access", "write": "Write access", "admin": "Admin"},
)

async def get_current_user(
    security_scopes: SecurityScopes, token: str = Depends(oauth2)
) -> dict:
    user = {"sub": "alice", "scopes": ["read", "write"]}
    for scope in security_scopes.scopes:
        if scope not in user["scopes"]:
            raise ValueError(f"Missing scope: {scope}")
    return user

@app.get("/articles", dependencies=[Depends(get_current_user)])
async def list_articles():
    return [{"id": 1, "title": "Hello"}]

@app.get("/admin/logs", dependencies=[Depends(get_current_user)])
async def admin_logs(
    user: dict = Security(get_current_user, scopes=["admin"])
):
    return {"logs": []}`
  },
  "JWT issue/verify patterns access+refresh rotation": {
    why: "Short-lived access tokens + refresh token rotation is the standard for secure APIs. Access tokens expire quickly (minimizing theft damage) while refresh tokens let users stay logged in.",
    code: `import time, hmac, hashlib, base64, json
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel

app = FastAPI()
SECRET = b"change-me-in-prod"
REFRESH_SECRET = b"refresh-secret"

def b64enc(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def create_token(sub: str, secret: bytes, minutes: int = 15) -> str:
    hdr = b64enc(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = b64enc(json.dumps({"sub": sub, "exp": int(time.time()) + minutes * 60}).encode())
    sig = b64enc(hmac.new(secret, f"{hdr}.{payload}".encode(), hashlib.sha256).digest())
    return f"{hdr}.{payload}.{sig}"

def verify_token(token: str, secret: bytes) -> dict:
    try:
        parts = token.split(".")
        good_sig = b64enc(hmac.new(secret, f"{parts[0]}.{parts[1]}".encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(parts[2], good_sig):
            raise ValueError("bad sig")
        payload = json.loads(base64.urlsafe_b64decode(parts[1] + "=="))
        if payload["exp"] < time.time():
            raise ValueError("expired")
        return payload
    except Exception as e:
        raise HTTPException(401, str(e))

class TokenPair(BaseModel):
    access: str
    refresh: str

@app.post("/auth/login", response_model=TokenPair)
async def login(username: str):
    return TokenPair(
        access=create_token(username, SECRET, minutes=15),
        refresh=create_token(username, REFRESH_SECRET, minutes=60 * 24 * 7),
    )

@app.post("/auth/refresh", response_model=TokenPair)
async def refresh(authorization: str = Header(...)):
    old = verify_token(authorization.replace("Bearer ", ""), REFRESH_SECRET)
    return TokenPair(
        access=create_token(old["sub"], SECRET, minutes=15),
        refresh=create_token(old["sub"], REFRESH_SECRET, minutes=60 * 24 * 7),
    )`
  },
  "Middleware request timing/CORS/GZip ordering matters": {
    why: "Middleware wraps every request. CORS must run first to send headers before any error response. Timing middleware reveals slow endpoints. GZip cuts bandwidth. Order matters: outermost runs first.",
    code: `import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()

# GZip compresses large responses automatically
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS — must be added AFTER GZip, before custom middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.middleware("http")
async def timing_middleware(request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.4f}"
    return response

@app.get("/ping")
async def ping():
    return {"status": "ok"}

# Middleware execution order: timing → CORS → GZip → route`
  },
  "Lifespan startup/shutdown pools clients close cleanly": {
    why: "Lifespan context managers replace deprecated @app.on_event. They guarantee resources (DB pools, ML models, HTTP clients) are created at startup and destroyed at shutdown — no leaked connections.",
    code: `from contextlib import asynccontextmanager
from fastapi import FastAPI
import httpx

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: acquire shared resources
    app.state.http_client = httpx.AsyncClient(timeout=30.0)
    app.state.pool = await create_db_pool()
    print("Resources acquired")
    yield
    # Shutdown: close everything cleanly
    await app.state.http_client.aclose()
    await app.state.pool.close()
    print("Resources released")

async def create_db_pool():
    return type("Pool", (), {"close": lambda s: None})()

app = FastAPI(lifespan=lifespan)

@app.get("/check")
async def check(request):
    client = request.app.state.http_client
    return {"client_ready": client is not None}`
  },
  "BackgroundTasks vs queues fire-forget limits": {
    why: "BackgroundTasks runs after the response is sent — perfect for emails, logging, non-critical side effects. For heavy work, offload to a queue (Celery/RQ). Mixing them up causes timeouts and lost jobs.",
    code: `import time
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def write_log(message: str):
    time.sleep(1)  # simulate slow I/O
    with open("access.log", "a") as f:
        f.write(message + "\\n")

def send_email(to: str, subject: str):
    time.sleep(2)  # simulate SMTP
    print(f"Email sent to {to}: {subject}")

@app.post("/orders")
async def create_order(
    background_tasks: BackgroundTasks,
    item: str = "widget",
):
    order_id = 123
    background_tasks.add_task(write_log, f"Order {order_id} created")
    background_tasks.add_task(send_email, "user@test.com", f"Order #{order_id}")
    # Response returns immediately; tasks run after
    return {"order_id": order_id, "item": item}`
  },
  "WebSockets endpoint manager broadcast rooms": {
    why: "WebSockets enable real-time bidirectional communication. A manager class tracks connected clients by room, enabling chat apps, live dashboards, and multiplayer features without polling overhead.",
    code: `from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from dataclasses import dataclass, field

app = FastAPI()

@dataclass
class ConnectionManager:
    rooms: dict[str, list[WebSocket]] = field(default_factory=dict)

    async def connect(self, ws: WebSocket, room: str):
        await ws.accept()
        self.rooms.setdefault(room, []).append(ws)

    def disconnect(self, ws: WebSocket, room: str):
        self.rooms.get(room, []).remove(ws)

    async def broadcast(self, room: str, message: str):
        for ws in self.rooms.get(room, []):
            await ws.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{room}")
async def websocket_endpoint(ws: WebSocket, room: str):
    await manager.connect(ws, room)
    try:
        while True:
            data = await ws.receive_text()
            await manager.broadcast(room, f"[{room}] {data}")
    except WebSocketDisconnect:
        manager.disconnect(ws, room)

# Connect: ws://localhost:8000/ws/general`
  },
  "Server-Sent Events StreamingResponse LLM token streams": {
    why: "SSE streams tokens to the client as they arrive from an LLM, giving users perceived speed improvements. Unlike WebSockets, SSE works over standard HTTP and auto-reconnects — ideal for unidirectional LLM output.",
    code: `import asyncio, json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

async def llm_token_stream(prompt: str):
    tokens = ["The", " answer", " to", " your", " question", " is", " 42", "."]
    for i, token in enumerate(tokens):
        await asyncio.sleep(0.05)  # simulate LLM latency
        yield f"data: {json.dumps({'delta': token, 'index': i})}\\n\\n"
    yield "data: [DONE]\\n\\n"

@app.get("/chat/stream")
async def chat_stream(q: str = "hello"):
    return StreamingResponse(
        llm_token_stream(q),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

# Client: const es = new EventSource("/chat/stream?q=hello");
# es.onmessage = e => append(JSON.parse(e.data).delta);`
  },
  "Settings pydantic-settings env/.env 12-factor": {
    why: "12-factor apps store config in environment variables, not code. Pydantic-settings validates env vars at startup, catches missing/malformed config before your app serves a single request.",
    code: `from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "MyApp"
    database_url: str = "sqlite:///./dev.db"
    redis_url: str = "redis://localhost:6379"
    debug: bool = False
    api_key: str
    max_connections: int = 10

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

@lru_cache
def get_settings() -> Settings:
    return Settings()

# .env file:
# APP_NAME=MyApp
# DATABASE_URL=postgresql://user:pass@localhost/mydb
# API_KEY=sk-abc123
# DEBUG=true
# MAX_CONNECTIONS=20`
  },
  "Async SQLAlchemy 2.0 sessions asyncpg pooling": {
    why: "Async SQLAlchemy 2.0 with asyncpg lets FastAPI handle hundreds of concurrent DB queries without blocking the event loop. Connection pooling reuses connections, avoiding connection exhaustion under load.",
    code: `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/mydb"

engine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

async def get_db():
    async with async_session() as session:
        yield session

async def create_user(db: AsyncSession, name: str):
    user = User(name=name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def list_users(db: AsyncSession):
    from sqlalchemy import select
    result = await db.execute(select(User))
    return result.scalars().all()`
  },
  "File uploads UploadFile streaming spooled temp files": {
    why: "UploadFile streams to disk for large files instead of loading into memory. This prevents your server from crashing when users upload gigabyte files, while keeping small uploads fast via in-memory buffering.",
    code: `from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    size = len(contents)
    return JSONResponse({
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": size,
    })

@app.post("/upload-large")
async def upload_large(file: UploadFile = File(...)):
    total = 0
    with open(f"uploads/{file.filename}", "wb") as f:
        while chunk := await file.read(8192):
            f.write(chunk)
            total += len(chunk)
    return {"filename": file.filename, "bytes_written": total}

@app.post("/upload-multiple")
async def upload_multiple(files: list[UploadFile] = File(...)):
    return {"count": len(files),
            "names": [f.filename for f in files]}`
  },
  "StaticFiles mounting SPA serving fallback": {
    why: "Serving a React/Vue SPA from FastAPI requires catching all routes and returning index.html. StaticFiles handles this with the html=True fallback, while static assets stay cached with proper headers.",
    code: `from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

@app.get("/api/health")
async def health():
    return {"status": "ok"}

# Mount static assets (JS, CSS, images)
app.mount("/assets", StaticFiles(directory="dist/assets"), name="static")

# Serve SPA — html=True returns index.html for unknown routes
app.mount("/app", StaticFiles(directory="dist", html=True), name="spa")

# Alternative: explicit SPA fallback
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str):
    if full_path.startswith("api/"):
        return {"error": "not found"}
    return FileResponse("dist/index.html")`
  },
  "Error handlers custom JSON problem-details RFC7807": {
    why: "Default FastAPI error responses are inconsistent. Custom handlers with RFC 7807 Problem Details give clients structured, machine-readable errors (type, title, detail) across your entire API.",
    code: `from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

class AppError(Exception):
    def __init__(self, status: int, title: str, detail: str, type_url: str = ""):
        self.status = status
        self.title = title
        self.detail = detail
        self.type_url = type_url or "about:blank"

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={
            "type": exc.type_url,
            "title": exc.title,
            "detail": exc.detail,
            "instance": str(request.url),
        },
    )

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    if user_id < 0:
        raise AppError(400, "Invalid ID", "user_id must be positive",
                       "/errors/invalid-id")
    raise AppError(404, "Not Found", f"User {user_id} does not exist")`
  },
  "TestClient/AsyncClient fixture app testing auth overrides": {
    why: "TestClient runs your app in-process without a live server. AsyncClient supports async endpoints. Dependency overrides let you swap auth and DB layers for fast, isolated unit tests.",
    code: `import pytest
from fastapi import FastAPI, Depends, Header
from fastapi.testclient import TestClient

app = FastAPI()

def verify_auth(authorization: str = Header(...)):
    if authorization != "Bearer test-token":
        raise ValueError("Unauthorized")
    return {"user_id": 1}

@app.get("/profile")
async def profile(user: dict = Depends(verify_auth)):
    return {"user_id": user["user_id"]}

client = TestClient(app)

def test_profile_success():
    resp = client.get("/profile", headers={"Authorization": "Bearer test-token"})
    assert resp.status_code == 200
    assert resp.json()["user_id"] == 1

def test_profile_unauthorized():
    resp = client.get("/profile")
    assert resp.status_code == 422

# Override auth for integration tests
def mock_auth():
    return {"user_id": 999}

app.dependency_overrides[verify_auth] = mock_auth

def test_profile_with_mock_auth():
    resp = client.get("/profile")
    assert resp.json()["user_id"] == 999`
  },
  "OpenAPI customization versioning servers security schemes": {
    why: "Customizing OpenAPI lets you version your API, list server environments, and define security schemes. This makes your docs production-ready for multi-stage deployments and third-party consumption.",
    code: `from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="Production API",
    version="2.1.0",
    servers=[
        {"url": "https://api.example.com", "description": "Production"},
        {"url": "https://staging-api.example.com", "description": "Staging"},
        {"url": "http://localhost:8000", "description": "Local dev"},
    ],
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description="Enterprise API with auth",
        routes=app.routes,
    )
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return app.openapi_schema

app.openapi = custom_openapi`
  },
  // ═══════════════════════════════════════════
  //  ReactJS — Components & State
  // ═══════════════════════════════════════════
  "JSX rules className fragments keys stability": {
    why: "JSX is syntactic sugar for React.createElement calls. Breaking rules (missing keys, using class instead of className) causes silent bugs, re-render issues, and hydration mismatches that are painful to debug.",
    code: `// className instead of class, fragments for multiple roots
function UserCard({ user }) {
  return (
    <>
      <div className="card">
        <h2 className="card-title">{user.name}</h2>
        <p className="card-body">{user.bio}</p>
      </div>
      {user.roles.map(role => (
        <span key={role.id} className="badge">
          {role.name}
        </span>
      ))}
    </>
  );
}

// Keys tell React which items changed, added, or removed
// Bad:  items.map((item, i) => <li key={i}>  → re-renders on reorder
// Good: items.map(item => <li key={item.id}>  → minimal DOM mutations`
  },
  "Props immutability one-way data flow discipline": {
    why: "Props flow down from parent to child and must never be mutated. Mutating props breaks React's change detection and causes unpredictable renders. One-way data flow makes components predictable and debuggable.",
    code: `import { useState } from "react";

// Props are READ-ONLY — never modify the object
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.done ? "completed" : ""}>
      <button onClick={() => onToggle(todo.id)}>
        {todo.done ? "Undo" : "Done"}
      </button>
      <span>{todo.title}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, title: "Learn React", done: false },
  ]);

  const toggle = (id) =>
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  // Spread creates new object — mutation triggers re-render
  // Bad:  todo.done = true          → no re-render (mutation)
  // Good: { ...todo, done: true }   → new object → re-render

  return (
    <ul>{todos.map(t => (
      <TodoItem key={t.id} todo={t} onToggle={toggle} />
    ))}</ul>
  );
}`
  },
  "useState updater fn setS(s=>s+1) batch semantics": {
    why: "React 18 batches all state updates automatically. Using updater functions (setS(s => s+1)) ensures you read the latest state instead of stale closures, which is critical in async callbacks and event handlers.",
    code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  // Correct: always use updater function in callbacks
  const increment = () => {
    setCount(c => c + 1);     // reads latest state
    setCount(c => c + 1);     // stacks: count goes to +2
  };

  // Wrong: stale closure reads the snapshot, not latest
  const broken = () => {
    setCount(count + 1);       // only increments by 1
    setCount(count + 1);       // same stale value → no-op
  };

  // Functional updates batch correctly in async code
  const asyncIncrement = async () => {
    await fetch("/api/increment");
    setCount(c => c + 1);      // still reads latest, not captured count
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+2</button>
      <button onClick={asyncIncrement}>async +1</button>
    </div>
  );
}`
  },
  "Controlled inputs forms value+onChange pairs": {
    why: "Controlled inputs bind form state to React state, enabling real-time validation, conditional submission, and programmatic value changes. Uncontrolled inputs lose this control and make complex forms painful.",
    code: `import { useState } from "react";

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.includes("@")) errs.email = "Invalid email";
    if (form.message.length < 10) errs.message = "Min 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submit:", form);
    }
  };

  return (
    <form onSubmit={submit}>
      <input value={form.name} onChange={update("name")} placeholder="Name" />
      {errors.name && <span className="error">{errors.name}</span>}

      <input value={form.email} onChange={update("email")} placeholder="Email" />
      {errors.email && <span className="error">{errors.email}</span>}

      <textarea value={form.message} onChange={update("message")} />
      {errors.message && <span>{errors.message}</span>}

      <button type="submit">Send</button>
    </form>
  );
}`
  },
  "Lifting state up shared ownership minimal common ancestor": {
    why: "When two siblings need shared data, lift state to their lowest common ancestor. This keeps a single source of truth instead of trying to sync state between components — the React way of sharing.",
    code: `import { useState } from "react";

function TemperatureInput({ scale, temp, onTempChange }) {
  const labels = { c: "Celsius", f: "Fahrenheit" };
  return (
    <fieldset>
      <legend>{labels[scale]}</legend>
      <input type="number" value={temp}
             onChange={e => onTempChange(e.target.value)} />
    </fieldset>
  );
}

// State lifted to common parent — single source of truth
function TemperatureConverter() {
  const [temp, setTemp] = useState("");
  const [scale, setScale] = useState("c");

  const celsius = scale === "f" ? (parseFloat(temp) - 32) * 5/9 : parseFloat(temp);

  const handleCelsius = (v) => { setTemp(v); setScale("c"); };
  const handleFahrenheit = (v) => { setTemp(v); setScale("f"); };

  return (
    <div>
      <TemperatureInput scale="c" temp={scale === "c" ? temp : celsius.toFixed(2)}
                        onTempChange={handleCelsius} />
      <TemperatureInput scale="f" temp={scale === "f" ? temp : (celsius * 9/5 + 32).toFixed(2)}
                        onTempChange={handleFahrenheit} />
      <p>{isNaN(celsius) ? "—" : celsius.toFixed(1)}°C</p>
    </div>
  );
}`
  },
  "Composition children slots over inheritance always": {
    why: "React favors composition over inheritance. Passing components as children or props creates flexible, reusable wrappers without deep component hierarchies. This is how libraries like Headless UI work.",
    code: `import { useState } from "react";

// Flexible wrapper via children composition
function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

// Render props / slot pattern for maximum flexibility
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  return children({ on, toggle: () => setOn(o => !o) });
}

// Usage — composition, not inheritance
function App() {
  return (
    <Card className="dashboard">
      <h2>Dashboard</h2>
      <Toggle>
        {({ on, toggle }) => (
          <Card className={on ? "active" : "inactive"}>
            <p>Status: {on ? "Online" : "Offline"}</p>
            <button onClick={toggle}>Toggle</button>
          </Card>
        )}
      </Toggle>
      <Card>
        <h3>Another card</h3>
        <p>Content here</p>
      </Card>
    </Card>
  );
}`
  },
  "Lists & keys reconciliation index-keys pitfall": {
    why: "React uses keys to match old and new list items during re-renders. Using array indices as keys breaks when items reorder, insert, or delete — causing stale state, animation glitches, and input fields showing wrong values.",
    code: `import { useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn keys", done: false },
    { id: 2, text: "Apply knowledge", done: false },
  ]);

  const addTodo = () => {
    setTodos(prev => [
      { id: Date.now(), text: "New task", done: false },
      ...prev,
    ]);
  };

  return (
    <>
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          // BAD:  key={index}   → re-renders wrong items on add/remove
          // GOOD: key={todo.id} → React tracks identity across reorders
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() =>
                setTodos(prev =>
                  prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t)
                )
              }
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}`
  },
  "useReducer complex state machines actions typed": {
    why: "When state has multiple sub-values and transitions follow patterns (like form wizards), useReducer makes transitions explicit and testable. It prevents impossible states that spread-out useState calls allow.",
    code: `import { useReducer } from "react";

const steps = ["Details", "Address", "Payment", "Review"];

const initialState = { step: 0, form: {}, errors: {} };

function reducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, steps.length - 1) };
    case "PREV":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "UPDATE_FIELD":
      return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function WizardForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h2>Step {state.step + 1}: {steps[state.step]}</h2>
      <input
        value={state.form.name || ""}
        onChange={e => dispatch({
          type: "UPDATE_FIELD", field: "name", value: e.target.value
        })}
        placeholder="Your name"
      />
      <div>
        <button onClick={() => dispatch({ type: "PREV" })}
                disabled={state.step === 0}>Back</button>
        <button onClick={() => dispatch({ type: "NEXT" })}
                disabled={state.step === steps.length - 1}>Next</button>
        <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      </div>
    </div>
  );
}`
  },
  "useContext provider drilling cure re-render costs": {
    why: "useContext passes data through the component tree without prop drilling. But every consumer re-renders when the provider value changes. Split contexts and memoize values to avoid unnecessary cascading re-renders.",
    code: `import { createContext, useContext, useState, useMemo } from "react";

const AuthCtx = createContext(null);
const ThemeCtx = createContext("dark");

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({
    user,
    login: (u) => setUser(u),
    logout: () => setUser(null),
  }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

function App() {
  return (
    <AuthProvider>
      <ThemeCtx.Provider value="dark">
        <Header />
        <Main />
      </ThemeCtx.Provider>
    </AuthProvider>
  );
}

function Header() {
  const { user, logout } = useAuth();
  return <header>{user ? <button onClick={logout}>Logout</button> : "Logged out"}</header>;
}`
  },
  "Custom hooks extracting logic useFetch/useDebounce/useLocalStorage": {
    why: "Custom hooks extract reusable stateful logic. A useFetch hook centralizes loading/error/data state, a useDebounce hook throttles inputs — these patterns prevent copy-pasting the same logic across components.",
    code: `import { useState, useEffect, useCallback } from "react";

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { signal: controller.signal, ...options })
      .then(r => r.json())
      .then(setData)
      .catch(e => e.name !== "AbortError" && setError(e))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Usage
function SearchPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query);
  const { data, loading } = useFetch(
    debounced ? \`/api/search?q=\${encodeURIComponent(debounced)}\` : null
  );
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`
  },
  "useRef DOM handles mutable boxes no re-render": {
    why: "useRef stores mutable values that persist across renders without triggering re-renders. Use it for DOM access (focus, scroll), timers, and previous values. It's the escape hatch from React's render cycle.",
    code: `import { useRef, useState, useEffect } from "react";

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const start = () => {
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
  };

  const stop = () => clearInterval(intervalRef.current);
  const reset = () => { stop(); setElapsed(0); };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div>
      <p>{(elapsed / 1000).toFixed(2)}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// DOM ref for auto-focus
function SearchBox() {
  const inputRef = useRef(null);
  useEffect(() => inputRef.current?.focus(), []);
  return <input ref={inputRef} placeholder="Search..." />;
}`
  },
  "useEffect lifecycle deps cleanup abort fetch race fix": {
    why: "useEffect runs side effects in sync with the component lifecycle. Missing dependency arrays cause stale closures, missing cleanups cause memory leaks, and skipping AbortController causes race conditions.",
    code: `import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setUser)
      .catch(e => {
        if (e.name !== "AbortError") setError(e.message);
      });

    // Cleanup cancels in-flight request when userId changes
    return () => controller.abort();
  }, [userId]);

  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}

// Timer cleanup pattern
function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}`
  },
  "useMemo/useCallback referential equality memoized children": {
    why: "useMemo prevents expensive recalculations; useCallback prevents function identity changes that cause child re-renders. Without them, React.memo children re-render on every parent render even with unchanged props.",
    code: `import { useState, useMemo, useCallback, memo } from "react";

const ExpensiveList = memo(({ items, onSelect }) => (
  <ul>{items.map(item => (
    <li key={item.id} onClick={() => onSelect(item.id)}>
      {item.name}
    </li>
  ))}</ul>
));

function Dashboard({ data }) {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);

  // useMemo: expensive sort/filter only recalculates when deps change
  const filtered = useMemo(() => {
    console.log("recomputing filtered list");
    return data
      .filter(item => item.name.includes(filter))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, filter]);

  // useCallback: stable reference prevents ExpensiveList re-renders
  const handleSelect = useCallback((id) => {
    setSelected(id);
  }, []);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ExpensiveList items={filtered} onSelect={handleSelect} />
    </div>
  );
}`
  },
  "React.memo pure components props compare shallow": {
    why: "React.memo skips re-rendering a component if its props haven't changed (shallow comparison). Without it, passing new object/array references from parent causes unnecessary child re-renders that hurt performance.",
    code: `import { useState, memo, useCallback } from "react";

// React.memo prevents re-render if props are shallowly equal
const UserRow = memo(function UserRow({ user, onFollow }) {
  console.log("UserRow render:", user.name);
  return (
    <div className="user-row">
      <span>{user.name}</span>
      <span>{user.posts} posts</span>
      <button onClick={() => onFollow(user.id)}>Follow</button>
    </div>
  );
});

function UserList({ users }) {
  const [followedIds, setFollowedIds] = useState(new Set());

  const handleFollow = useCallback((id) => {
    setFollowedIds(prev => new Set([...prev, id]));
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserRow key={user.id} user={user} onFollow={handleFollow} />
      ))}
    </div>
  );
}`
  },
  "Error boundaries class or library recovery UI": {
    why: "Error boundaries catch rendering errors and display fallback UI instead of a blank white screen. They're the only way to gracefully handle JavaScript errors in the React component tree without crashing the whole app.",
    code: `import { Component } from "react";

class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-fallback" role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage — wrap risky sections, not the entire app
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}`
  },
  "Suspense streaming ready loading states": {
    why: "Suspense lets components 'wait' for something (data, lazy code) and shows a fallback while loading. Combined with streaming SSR, users see meaningful content instantly instead of blank pages.",
    code: `import { Suspense, lazy, useState, useEffect } from "react";

const HeavyChart = lazy(() => import("./HeavyChart"));

function fetchUser(id) {
  const promise = fetch(\`/api/users/\${id}\`).then(r => r.json());
  throw promise;
}

function UserProfile({ userId }) {
  const user = fetchUser(userId);
  return <h1>{user.name}</h1>;
}

function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <UserProfile userId={1} />
      </Suspense>
      <Suspense fallback={<p>Loading chart...</p>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}

function Skeleton() {
  return <div className="skeleton" style={{ height: 200, background: "#eee" }} />;
}`
  },
  "Portals modals outside DOM hierarchy stacking": {
    why: "Portals render children into any DOM node outside the React tree. This is essential for modals, tooltips, and dropdowns that need to escape CSS overflow:hidden and z-index stacking contexts in parent components.",
    code: `import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{ overflow: "hidden" }}>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Hello">
        <p>This renders outside the overflow:hidden parent</p>
      </Modal>
    </div>
  );
}`
  },
  "Context+reducer mini global store pattern": {
    why: "For small apps, Context + useReducer replaces Redux without extra dependencies. It gives you a centralized store with dispatch, actions, and reducers — the same mental model, less boilerplate.",
    code: `import { createContext, useContext, useReducer } from "react";

const TodoCtx = createContext(null);
const TodoDispatch = createContext(null);

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "TOGGLE":
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "DELETE":
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  return (
    <TodoCtx.Provider value={todos}>
      <TodoDispatch.Provider value={dispatch}>
        {children}
      </TodoDispatch.Provider>
    </TodoCtx.Provider>
  );
}

export function useTodos() { return useContext(TodoCtx); }
export function useTodoDispatch() { return useContext(TodoDispatch); }

function AddTodo() {
  const dispatch = useTodoDispatch();
  const add = (text) => dispatch({ type: "ADD", text });
  return <button onClick={() => add("New task")}>Add</button>;
}`
  },
  "TanStack Query server-state caching retries invalidation": {
    why: "Server state (API data) is fundamentally different from UI state. TanStack Query handles caching, refetching, retries, and stale-while-revalidate so you don't reinvent this logic with useEffect + useState.",
    code: `import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function fetchTodos() {
  return fetch("/api/todos").then(r => r.json());
}

function addTodo(text) {
  return fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  }).then(r => r.json());
}

function TodoList() {
  const queryClient = useQueryClient();

  const { data: todos, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 30000,
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {todos.map(t => <li key={t.id}>{t.text}</li>)}
      <button onClick={() => mutation.mutate("New item")}>Add</button>
    </ul>
  );
}`
  },
  "Zustand/Redux slices selectors devtools comparison": {
    why: "Zustand is a minimal state library (1KB) that replaces Redux for most apps. No providers, no boilerplate — just create a store and use it. Redux Toolkit is better for complex apps needing middleware and devtools.",
    code: `import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useCounter = create(
  devtools((set) => ({
    count: 0,
    increment: () => set(s => ({ count: s.count + 1 }), false, "inc"),
    decrement: () => set(s => ({ count: s.count - 1 }), false, "dec"),
    reset: () => set({ count: 0 }, false, "reset"),
  }))
);

function Counter() {
  const count = useCounter(s => s.count);
  const increment = useCounter(s => s.increment);
  return <button onClick={increment}>{count}</button>;
}

// Redux Toolkit alternative for complex apps
import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
  devTools: process.env.NODE_ENV !== "production",
});`
  },
  "Router v6 loaders nested routes outlets params": {
    why: "React Router v6 loaders fetch data before rendering, eliminating loading states for route transitions. Nested routes with Outlet share layouts, and params enable dynamic URLs without manual parsing.",
    code: `import { createBrowserRouter, RouterProvider, Outlet, Link,
         useLoaderData, useParams } from "react-router-dom";

async function loader({ params }) {
  const res = await fetch(\`/api/users/\${params.userId}\`);
  if (!res.ok) throw new Response("Not Found", { status: 404 });
  return res.json();
}

function Layout() {
  return (
    <div>
      <nav><Link to="/">Home</Link> <Link to="/users/1">User 1</Link></nav>
      <Outlet />
    </div>
  );
}

function UserPage() {
  const user = useLoaderData();
  const { userId } = useParams();
  return <h1>User {userId}: {user.name}</h1>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "users/:userId", element: <UserPage />, loader },
    ],
  },
]);

function App() { return <RouterProvider router={router} />; }`
  },
  "React Hook Form zod validation perf forms": {
    why: "React Hook Form uses uncontrolled inputs for minimal re-renders. Combined with Zod for schema validation, you get type-safe forms with inline error messages — far faster than Formik for complex forms.",
    code: `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  age: z.number().min(18, "Must be 18+"),
  role: z.enum(["user", "admin"]),
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" },
  });

  const onSubmit = async (data) => {
    await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("password")} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <input {...register("age", { valueAsNumber: true })} type="number" />
      {errors.age && <span>{errors.age.message}</span>}

      <select {...register("role")}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button disabled={isSubmitting}>Sign Up</button>
    </form>
  );
}`
  },
  "Accessibility semantic HTML aria labels keyboard paths": {
    why: "Accessibility isn't optional — it's law in many jurisdictions. Semantic HTML, ARIA labels, and keyboard navigation ensure your app works for everyone. Screen readers, motor-impaired users, and search engines all benefit.",
    code: `function AccessibleNav({ items, onNavigate }) {
  return (
    <nav aria-label="Main navigation" role="navigation">
      <ul role="menubar">
        {items.map(item => (
          <li key={item.id} role="none">
            <a
              role="menuitem"
              href={item.href}
              onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function AccessibleModal({ isOpen, onClose, titleId, children }) {
  const closeRef = useRef(null);
  useEffect(() => { if (isOpen) closeRef.current?.focus(); }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}
         onKeyDown={e => e.key === "Escape" && onClose()}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button ref={closeRef} onClick={onClose} aria-label="Close dialog">
        &times;
      </button>
    </div>
  );
}`
  },
  "Vite tooling HMR env import.meta.env proxies": {
    why: "Vite's dev server starts in milliseconds with instant HMR (hot module replacement). Environment variables use import.meta.env (not process.env), and proxy config avoids CORS issues during development.",
    code: `// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});

// Access env vars — import.meta.env (NOT process.env)
const API_KEY = import.meta.env.VITE_API_KEY;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// .env file (only VITE_ prefixed vars exposed to client)
// VITE_API_KEY=abc123
// DATABASE_URL=secret  ← not exposed to client`
  },
  "Testing Library query priority userEvent fake timers": {
    why: "Testing Library queries by accessibility (getByRole, getByLabelText) ensures your tests validate what users actually see. userEvent simulates real interactions. fake timers control async behavior in tests.",
    code: `import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

describe("Counter", () => {
  it("increments on click", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
// Query priority: getByRole > getByLabelText > getByText > getByTestId`
  },
  // ═══════════════════════════════════════════
  //  NextJS (App Router) — Rendering Model
  // ═══════════════════════════════════════════
  "Server Components default zero-JS data-close fetching": {
    why: "Server Components run on the server and ship zero JavaScript to the client. You can query databases directly in your component, eliminating useEffect, API routes, and the waterfall of client-side data fetching.",
    code: `// app/dashboard/page.tsx — Server Component (default, no "use client")
import { db } from "@/lib/db";

async function getMetrics() {
  const [users, orders] = await Promise.all([
    db.user.count(),
    db.order.aggregate({ _sum: { total: true } }),
  ]);
  return { userCount: users, totalRevenue: orders._sum.total ?? 0 };
}

export default async function DashboardPage() {
  const metrics = await getMetrics();
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="stats">
        <StatCard label="Users" value={metrics.userCount} />
        <StatCard label="Revenue" value={\`\$\${metrics.totalRevenue}\`} />
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}`
  },
  "'use client' boundary smallest possible islands interactivity": {
    why: "\"use client\" marks the boundary where server components stop and client JavaScript begins. Keeping this boundary as deep as possible minimizes the JS bundle — most of your page stays server-rendered.",
    code: `// app/posts/page.tsx — Server Component (fetches data)
import { db } from "@/lib/db";
import { LikeButton } from "./LikeButton";

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <LikeButton postId={post.id} initialCount={post.likes} />
        </article>
      ))}
    </div>
  );
}

// app/posts/LikeButton.tsx — "use client" boundary
"use client";
import { useState } from "react";

export function LikeButton({ postId, initialCount }) {
  const [likes, setLikes] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={async () => {
      setLiked(!liked);
      setLikes(l => liked ? l - 1 : l + 1);
      await fetch(\`/api/posts/\${postId}/like\`, { method: "POST" });
    }}>
      {liked ? "❤️" : "🤍"} {likes}
    </button>
  );
}`
  },
  "async/await in RSC direct DB/API calls no useEffect needed": {
    why: "Server Components are async functions — you can await database queries, API calls, and file reads directly. No useEffect, no loading states, no waterfall. The component renders only when all data is ready.",
    code: `import { db } from "@/lib/db";
import { cache } from "react";

const getProducts = cache(async (category) => {
  return db.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { sales: "desc" },
    take: 50,
  });
});

const getCategories = cache(async () => {
  return db.product.groupBy({ by: ["category"], _count: true });
});

export default async function ProductsPage({ searchParams }) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ]);

  return (
    <div>
      <nav>
        {categories.map(c => (
          <a key={c.category} href={\`?category=\${c.category}\`}>
            {c.category} ({c._count})
          </a>
        ))}
      </nav>
      <div className="grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}`
  },
  "fetch caching defaults force-cache/no-store/revalidate tags": {
    why: "Next.js wraps fetch with automatic caching. force-cache (default) caches indefinitely, no-store skips cache, and revalidate + tags enable granular cache control — essential for performance without stale data.",
    code: `// Cached by default — same URL returns cached response
async function getCachedProducts() {
  const res = await fetch("https://api.example.com/products", {
    next: { revalidate: 3600 },
  });
  return res.json();
}

// Never cache — always fresh
async function getLiveOrders() {
  const res = await fetch("https://api.example.com/orders", {
    cache: "no-store",
  });
  return res.json();
}

// Tag-based invalidation
async function getProductsByTag() {
  const res = await fetch("https://api.example.com/products", {
    next: { tags: ["products"] },
  });
  return res.json();
}

// In a Server Action or Route Handler:
import { revalidateTag } from "next/cache";

export async function updateProduct(id, data) {
  await db.product.update({ where: { id }, data });
  revalidateTag("products");
}`
  },
  "revalidatePath/revalidateTag on-demand invalidation webhooks": {
    why: "On-demand revalidation lets you update cached pages when data changes (via webhooks, form submissions, or CMS updates) without waiting for time-based expiry. This keeps pages fresh and fast.",
    code: `// app/api/webhook/route.ts
import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  if (body.model === "product") {
    revalidateTag("products");
    revalidatePath("/products");
    revalidatePath("/products/[slug]", "page");
  }

  if (body.model === "blog") {
    revalidateTag("posts");
    revalidatePath("/blog");
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

// Server Action — revalidate after mutation
"use server";
import { revalidatePath } from "next/cache";

export async function createPost(formData) {
  await db.post.create({ data: { title: formData.get("title") } });
  revalidatePath("/blog");
  redirect("/blog");
}`
  },
  "Static vs dynamic rendering heuristics cookies/headers opt-out": {
    why: "Next.js decides static vs dynamic per route. Using cookies(), headers(), or searchParams forces dynamic. Understanding these heuristics lets you optimize: static for speed, dynamic for personalization.",
    code: `// Static by default
export default function StaticPage() {
  return <h1>This is static — built once, served forever</h1>;
}

// Force dynamic — opt out
import { cookies, headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DynamicPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session");

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent");

  return (
    <div>
      <p>Session: {token?.value ?? "none"}</p>
      <p>UA: {userAgent}</p>
    </div>
  );
}

// Per-route segment config
export const revalidate = 60;
export const runtime = "edge";
export const preferredRegion = "sin1";`
  },
  "Streaming Suspense shells instant skeletons PPR future": {
    why: "Streaming renders the page shell instantly while slow data loads in the background. Users see a complete layout immediately instead of a blank screen — dramatically improving perceived performance.",
    code: `import { Suspense } from "react";

function DashboardShell() {
  return (
    <div className="dashboard">
      <nav className="sidebar">...</nav>
      <main>
        <Suspense fallback={<ChartSkeleton />}>
          <SlowChart />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <SlowTable />
        </Suspense>
      </main>
    </div>
  );
}

async function SlowChart() {
  const data = await fetchExpensiveData();
  return <RevenueChart data={data} />;
}

function ChartSkeleton() {
  return (
    <div className="skeleton-chart" aria-label="Loading chart">
      <div className="skeleton-bar" style={{ width: "80%", height: 200 }} />
    </div>
  );
}

// app/dashboard/loading.tsx — automatic Suspense for entire route
export default function Loading() {
  return <div className="page-skeleton">Loading dashboard...</div>;
}`
  },
  "loading.tsx/error.tsx/not-found.tsx convention files UX": {
    why: "Convention files provide instant UX for loading, errors, and 404s without any wrapper components. They're automatically picked up by the App Router and handle entire route segments.",
    code: `// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading dashboard...</p>
    </div>
  );
}

// app/dashboard/error.tsx — must be Client Component
"use client";

export default function Error({ error, reset }) {
  return (
    <div role="alert">
      <h2>Dashboard Error</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 — Page Not Found</h2>
      <a href="/">Go home</a>
    </div>
  );
}

// Trigger from Server Component
import { notFound } from "next/navigation";

async function UserPage({ params }) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();
  return <h1>{user.name}</h1>;
}`
  },
  "Route handlers app/api GET/POST Response.json edge-ready": {
    why: "Route Handlers replace API Routes from Pages Router. They run on the server (or edge), support standard Web APIs (Request/Response), and can be used by Server Components directly without fetch.",
    code: `// app/api/items/route.ts
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const items = await db.item.findMany({
    where: q ? { name: { contains: q } } : undefined,
  });
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const item = await db.item.create({ data: body });
  return NextResponse.json(item, { status: 201 });
}

// app/api/items/[id]/route.ts
export async function GET(request, { params }) {
  const { id } = await params;
  const item = await db.item.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.item.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}`
  },
  "Server Actions 'use server' mutations progressive enhancement": {
    why: "Server Actions let forms submit directly to server functions without API routes. Progressive enhancement means forms work without JavaScript — critical for accessibility and slow connections.",
    code: `// app/todos/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTodo(formData) {
  const title = formData.get("title");
  if (!title || title.length < 3) {
    return { error: "Title must be at least 3 characters" };
  }
  await db.todo.create({ data: { title } });
  revalidatePath("/todos");
}

export async function deleteTodo(formData) {
  const id = formData.get("id");
  await db.todo.delete({ where: { id } });
  revalidatePath("/todos");
}

// app/todos/page.tsx
import { addTodo, deleteTodo } from "./actions";

export default async function TodosPage() {
  const todos = await db.todo.findMany();
  return (
    <div>
      <form action={addTodo}>
        <input name="title" required placeholder="New todo..." />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            <form action={deleteTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}`
  },
  "middleware.ts redirects/auth gating matcher config": {
    why: "Middleware runs before the route renders, making it ideal for authentication checks, redirects, and A/B testing. The matcher config tells Next.js which paths to run middleware on, avoiding unnecessary execution.",
    code: `// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("session")?.value;
  const isPublic = request.nextUrl.pathname.startsWith("/login")
    || request.nextUrl.pathname.startsWith("/register")
    || request.nextUrl.pathname.startsWith("/api/public");

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && request.nextUrl.pathname.startsWith("/admin")) {
    const payload = decodeJwtPayload(token);
    if (payload?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\\\.png$).*)",
  ],
};`
  },
  "layouts nested persist across navigations state preserved": {
    why: "Layouts wrap child routes and persist across navigations — their state, hooks, and DOM stay mounted. This avoids re-fetching shared data and prevents layout shifts when navigating between sibling pages.",
    code: `// app/dashboard/layout.tsx
import { Sidebar } from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// Nested layout example
export default function NestedLayout({ children }) {
  return (
    <div>
      <header>Dashboard Header</header>
      {children}
    </div>
  );
}

// Route hierarchy:
// /dashboard        → DashboardLayout > page.tsx
// /dashboard/analytics → DashboardLayout > analytics/layout.tsx > page.tsx
// The sidebar persists across all navigations`
  },
  "Parallel routes @slot dashboards independent loading": {
    why: "Parallel routes (@slots) render multiple pages simultaneously in the same layout. Each slot loads independently, enabling complex dashboards where one section loads slowly without blocking others.",
    code: `// app/dashboard/layout.tsx
export default function DashboardLayout({ children, analytics, team }) {
  return (
    <div className="grid">
      {children}
      {analytics}
      {team}
    </div>
  );
}

// app/dashboard/@analytics/page.tsx
export default async function AnalyticsSlot() {
  const data = await fetchExpensiveAnalytics();
  return (
    <div className="analytics-panel">
      <h3>Analytics</h3>
      <Chart data={data} />
    </div>
  );
}

// app/dashboard/@analytics/loading.tsx
export default function AnalyticsLoading() {
  return <div className="skeleton">Loading analytics...</div>;
}

// app/dashboard/@team/page.tsx
export default async function TeamSlot() {
  const team = await db.team.findMany();
  return <TeamList members={team} />;
}`
  },
  "Intercepting routes (.)modal-over-page patterns": {
    why: "Intercepting routes let you show a route as a modal over the current page, like Twitter's image preview. The URL changes but the background page stays visible and interactive.",
    code: `// (.)feed/[id]/page.tsx — intercepts /feed/[id] as modal
"use client";
import { useRouter } from "next/navigation";
import { Modal } from "./Modal";

export default function PhotoModal({ params, children }) {
  const router = useRouter();
  return (
    <Modal onClose={() => router.back()}>
      {children}
    </Modal>
  );
}

// app/feed/[id]/page.tsx — actual page (for direct URL access)
export default async function PhotoPage({ params }) {
  const photo = await db.photo.findUnique({ where: { id: params.id } });
  return (
    <div className="photo-detail">
      <img src={photo.url} alt={photo.caption} />
      <p>{photo.caption}</p>
    </div>
  );
}

// (.)feed — dots prefix = intercepting route
// When navigating from /feed → shows as modal
// When accessing /feed/123 directly → shows full page`
  },
  "Image component optimization sizes/priority CLS prevent": {
    why: "next/image auto-serves WebP, resizes on demand, and lazy-loads below-fold images. The sizes prop prevents CLS by telling the browser which image size to use at each breakpoint.",
    code: `import Image from "next/image";

function ProductCard({ product }) {
  return (
    <div>
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={product.featured}
        placeholder="blur"
        blurDataURL={product.blurHash}
        className="rounded-lg"
      />
      <h3>{product.name}</h3>
    </div>
  );
}

function HeroBanner() {
  return (
    <Image
      src="/hero.jpg"
      alt="Welcome"
      width={1200}
      height={600}
      priority
      sizes="100vw"
      quality={85}
    />
  );
}`
  },
  "next/font self-host zero-layout-shift typography": {
    why: "next/font self-hosts Google Fonts at build time with zero layout shift. Fonts load instantly (no FOUT/FOIT), improve Core Web Vitals, and eliminate third-party font requests that leak user privacy.",
    code: `// app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable}\`}>
      <body style={{ fontFamily: "var(--font-inter)" }}>
        {children}
      </body>
    </html>
  );
}

// Tailwind: font-sans → var(--font-inter), font-mono → var(--font-mono)
// Benefits: ~1KB per font vs ~100KB from Google Fonts CSS
// Zero layout shift, fonts bundled as woff2 from your domain`
  },
  "Metadata API generateMetadata SEO per-route OG images": {
    why: "The Metadata API generates per-route <head> tags for SEO, social sharing, and Open Graph images. generateMetadata lets you build dynamic metadata from data, critical for blog posts and products.",
    code: `// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: \`/api/og?title=\${encodeURIComponent(post.title)}\` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPost({ params }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  return <article><h1>{post.title}</h1><p>{post.content}</p></article>;
}

export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } });
  return posts.map(post => ({ slug: post.slug }));
}`
  },
  "ISR revalidate seconds scale static freshness blend": {
    why: "ISR serves static pages but revalidates them after N seconds. You get CDN speed with near-real-time freshness — the best of static and dynamic.",
    code: `// app/products/page.tsx
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 },
  }).then(r => r.json());

  return (
    <div className="grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// app/products/[id]/page.tsx — per-page ISR
export default async function ProductPage({ params }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>\${product.price}</p>
    </div>
  );
}

export const revalidate = 300;

// Combined: time-based (revalidate=60) + on-demand (revalidateTag)
// Serve stale, refresh in background — best of both worlds`
  },
  "Auth patterns cookie sessions vs JWT middleware+layout guards": {
    why: "Next.js auth has two layers: middleware guards (redirect unauthenticated users) and layout guards (conditional UI). Cookie sessions are server-friendly, JWTs work across services.",
    code: `// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("session")?.value;

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();
  if (session) response.headers.set("x-session", session);
  return response;
}

// app/dashboard/layout.tsx
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  const user = await verifySession(session);
  return (
    <div>
      <nav>Welcome, {user.name}</nav>
      {children}
    </div>
  );
}`
  },
  "Env NEXT_PUBLIC_ prefix exposure discipline server secrets safe": {
    why: "Next.js inlines env vars at build time. NEXT_PUBLIC_ vars are exposed to the client bundle — never put secrets there. Server-only vars stay in the server runtime and never appear in client JavaScript.",
    code: `// .env.local
DATABASE_URL=postgresql://user:pass@localhost/db   # server only
API_SECRET=sk-abc123                                # server only
NEXT_PUBLIC_API_URL=https://api.example.com         # client safe

// Server-side — all vars available
// process.env.DATABASE_URL    ✅

// Client-side — only NEXT_PUBLIC_ vars
"use client";
function Component() {
  console.log(process.env.NEXT_PUBLIC_API_URL);  // ✅
  console.log(process.env.DATABASE_URL);          // ❌ undefined
}

// Server Component — all vars available
export default async function Page() {
  const db = await connect(process.env.DATABASE_URL);  // ✅
  return <div>...</div>;
}`
  },
  "Deployment standalone output Docker Vercel adapters": {
    why: "Next.js supports multiple deployment targets. Standalone output creates a minimal Node.js server for Docker. Vercel is zero-config. Understanding output modes prevents deployment surprises.",
    code: `// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

# Dockerfile (multi-stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]`
  },
  // ═══════════════════════════════════════════
  //  Spring AI — Core APIs
  // ═══════════════════════════════════════════
  "ChatClient fluent builder prompt().user().call().content()": {
    why: "ChatClient is Spring AI's unified API for interacting with LLMs. The fluent builder pattern chains prompts, advisors, and output parsing — making it easy to swap providers without changing business logic.",
    code: `import org.springframework.ai.chat.client.ChatClient;

@Service
public class AiService {
    private final ChatClient chatClient;

    public AiService(ChatClient.Builder builder) {
        this.chatClient = builder
            .defaultSystem("You are a helpful assistant.")
            .build();
    }

    public String ask(String question) {
        return chatClient.prompt()
            .user(question)
            .call()
            .content();
    }

    public String askWithSystem(String systemPrompt, String question) {
        return chatClient.prompt()
            .system(systemPrompt)
            .user(question)
            .call()
            .content();
    }
}`
  },
  "ChatModel abstraction OpenAI/Ollama/Azure starters swap-free": {
    why: "ChatModel abstracts the LLM provider. Switch between OpenAI, Ollama, Azure, or Anthropic by changing one property — no code changes. This keeps your AI logic provider-agnostic and testable.",
    code: `// application.yml — switch providers with properties alone
spring:
  ai:
    openai:
      api-key: \${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4o-mini
          temperature: 0.7

    # Switch to Ollama: just change config
    # ollama:
    #   base-url: http://localhost:11434
    #   chat:
    #     options:
    #       model: llama3.1

@Service
public class FlexibleAiService {
    private final ChatModel chatModel;

    public FlexibleAiService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String generate(String prompt) {
        return chatModel.call(new Prompt(prompt))
            .getResult().getOutput().getText();
    }
}`
  },
  "Prompt templates {} variables TemplateRenderer": {
    why: "Prompt templates separate prompts from code. Using {} placeholders lets non-developers edit prompts, A/B test variations, and maintain prompt libraries without redeploying code.",
    code: `import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;

@Service
public class TemplateService {
    private final ChatClient chatClient;

    public TemplateService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String explain(String topic, String level) {
        return chatClient.prompt()
            .user("Explain {topic} at a {level} level. Use examples.")
            .param("topic", topic)
            .param("level", level)
            .call()
            .content();
    }

    public String analyzeCode(String language, String code) {
        var template = new PromptTemplate("""
            You are an expert {language} developer.
            Analyze this code and suggest improvements:
            ```{language}
            {code}
            ```
            """);
        var prompt = template.create(Map.of(
            "language", language,
            "code", code
        ));
        return chatClient.prompt(prompt).call().content();
    }
}`
  },
  "System/default text per-client personas configured once": {
    why: "System prompts define the AI's personality, rules, and knowledge scope. Setting them at the ChatClient level ensures consistency across all calls — every endpoint uses the same persona without repeating it.",
    code: `import org.springframework.ai.chat.client.ChatClient;

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
            .defaultSystem("""
                You are a senior software engineer. Rules:
                - Be concise and accurate
                - Always mention trade-offs
                - Use code examples when helpful
                - If unsure, say so rather than guessing
                """)
            .defaultParam("temperature", 0.3)
            .build();
    }
}

@RestController
@RequestMapping("/ai")
public class AiController {
    private final ChatClient codeReviewer;
    private final ChatClient docWriter;

    public AiController(ChatClient chatClient) {
        this.codeReviewer = chatClient.mutate()
            .defaultSystem("You are a strict code reviewer. Focus on bugs and security.")
            .build();

        this.docWriter = chatClient.mutate()
            .defaultSystem("You are a technical writer. Be clear and structured.")
            .build();
    }

    @GetMapping("/review")
    public String reviewCode(@RequestParam String code) {
        return codeReviewer.prompt().user(code).call().content();
    }
}`
  },
  "Structured OutputConverter BeanOutputConverter records mapping": {
    why: "Structured output forces the LLM to return valid JSON matching your Java types. OutputConverter + records eliminate manual JSON parsing and ensure type-safe, validated responses from the AI.",
    code: `import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.BeanOutputConverter;

public record TechReview(
    String summary,
    int riskLevel,
    List<String> issues,
    List<String> suggestions,
    String complexity
) {}

@Service
public class ReviewService {
    private final ChatClient chatClient;
    private final BeanOutputConverter<TechReview> converter =
        new BeanOutputConverter<>(TechReview.class);

    public ReviewService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public TechReview reviewCode(String code) {
        String format = converter.getFormat();
        return chatClient.prompt()
            .system("Analyze code and respond in the exact format provided.")
            .user("Review this code:\\n{code}\\n\\n{format}")
            .param("code", code)
            .param("format", format)
            .call()
            .entity(TechReview.class);
    }
}`
  },
  "Advisors chain QuestionAnswererMessageChatMemoryAdvisor RAG plug-ins": {
    why: "Advisors are middleware for your ChatClient — they intercept, modify, and enrich prompts and responses. Chain RAG, memory, and safety filters as composable plugins without touching business logic.",
    code: `import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;

@Service
public class RagChatService {
    private final ChatClient chatClient;

    public RagChatService(ChatClient.Builder builder, VectorStore vectorStore) {
        this.chatClient = builder
            .defaultSystem("Answer based on the provided context.")
            .defaultAdvisors(
                new QuestionAnswerAdvisor(vectorStore),
                new MessageChatMemoryAdvisor(
                    MessageWindowChatMemory.builder()
                        .maxMessages(10)
                        .build()
                )
            )
            .build();
    }

    public String chat(String conversationId, String question) {
        return chatClient.prompt()
            .advisors(a -> a.param("conversationId", conversationId))
            .user(question)
            .call()
            .content();
    }
}`
  },
  "Function calling @Tool beans FunctionCallback registry": {
    why: "Function calling lets the LLM invoke your Java methods to fetch real-time data. @Tool beans auto-register as callable functions — the LLM decides when and how to call them.",
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Service
public class WeatherService {
    @Tool(description = "Get current weather for a city in Celsius")
    public String getWeather(String city) {
        return String.format("Current weather in %s: 22°C, partly cloudy", city);
    }
}

@Configuration
public class ToolConfig {
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, WeatherService weatherService) {
        return builder
            .defaultTools(weatherService)
            .build();
    }
}

@RestController
@RequestMapping("/ai")
public class ToolController {
    private final ChatClient chatClient;

    public ToolController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @GetMapping("/weather")
    public String askWeather(@RequestParam String question) {
        return chatClient.prompt()
            .user(question)
            .call()
            .content();
    }
}`
  },
  "EmbeddingModel client dimensions batch embed": {
    why: "EmbeddingModel converts text to vector representations for semantic search, RAG, and clustering. Batch embedding processes multiple texts efficiently — critical for indexing large document collections.",
    code: `import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.Embedding;

@Service
public class EmbeddingService {
    private final EmbeddingModel embeddingModel;

    public EmbeddingService(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    public float[] embed(String text) {
        return embeddingModel.embed(text);
    }

    public List<float[]> embedBatch(List<String> texts) {
        var request = new EmbeddingRequest(
            texts.stream()
                .map(org.springframework.ai.chat.messages.UserMessage::new)
                .toList()
        );
        return embeddingModel.call(request)
            .getResult()
            .stream()
            .map(Embedding::getOutput)
            .toList();
    }

    public int getDimensions() {
        return embeddingModel.dimensions();
    }
}`
  },
  "VectorStore interface add/similaritySearch implementations galore": {
    why: "VectorStore is Spring AI's abstraction for vector databases. It provides a unified API for storing and searching embeddings — swap between PGVector, Pinecone, or Redis without changing retrieval code.",
    code: `import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

@Service
public class SemanticSearch {
    private final VectorStore vectorStore;

    public SemanticSearch(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void index(List<Document> documents) {
        vectorStore.add(documents);
    }

    public List<Document> search(String query, int topK, double threshold) {
        return vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(topK)
                .similarityThreshold(threshold)
                .build()
        );
    }

    public List<Document> searchWithFilter(String query, String key, String value) {
        return vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(5)
                .filterExpression(key + " == '" + value + "'")
                .build()
        );
    }
}`
  },
  "PGVector/Redis/Pinecone/Milvus starters config properties": {
    why: "Each vector store has a Spring Boot starter that auto-configures connection, indexing, and search. Switching stores is a property change — no code changes. Each has trade-offs for latency, scale, and cost.",
    code: `# application.yml — PGVector (self-hosted, SQL-friendly)
spring:
  ai:
    vectorstore:
      pgvector:
        index-type: HNSW
        distance-type: COSINE_DISTANCE
        table-name: documents
        dimensions: 1536

# Redis: spring.ai.vectorstore.redis.uri, index, prefix
# Pinecone: spring.ai.vectorstore.pinecone.api-key, index-name, namespace
# Milvus: spring.ai.vectorstore.milvus.uri, collection-name, distance-type

// Usage is identical across all stores
@Service
public class SearchService {
    private final VectorStore vectorStore;

    public List<Document> search(String query) {
        return vectorStore.similaritySearch(
            SearchRequest.builder().query(query).topK(5).build()
        );
    }
}`
  },
  "ETL DocumentReader/Transformer/Writer PDF/Tika text-split pipeline": {
    why: "The ETL pipeline handles document ingestion for RAG: read PDFs/Tika docs, split into chunks, transform (clean/embed), and write to vector store. Without chunking, retrieval quality drops dramatically.",
    code: `import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.FileSystemResource;

@Service
public class DocumentIngestion {
    private final VectorStore vectorStore;

    public DocumentIngestion(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public int ingestPdf(String filePath) {
        var reader = new TikaDocumentReader(new FileSystemResource(filePath));
        List<Document> documents = reader.get();

        var splitter = new TokenTextSplitter(200, 20, 5, 10000, true);
        List<Document> chunks = splitter.apply(documents);

        vectorStore.add(chunks);
        return chunks.size();
    }
}`
  },
  "RAG flow retrieval-augmentation advisor auto-inject context": {
    why: "RAG grounds LLM responses in your actual data. The QuestionAnswerAdvisor auto-retrieves relevant documents and injects them into the prompt — no manual retrieval logic needed.",
    code: `import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

@Configuration
public class RagConfig {

    @Bean
    public ChatClient ragChatClient(ChatClient.Builder builder, VectorStore vectorStore) {
        return builder
            .defaultSystem("""
                Answer questions using ONLY the provided context.
                If the context doesn't contain the answer, say
                "I don't have information about that."
                Always cite your sources.
                """)
            .defaultAdvisors(
                new QuestionAnswerAdvisor(vectorStore,
                    SearchRequest.builder()
                        .topK(5)
                        .similarityThreshold(0.7)
                        .build()
                )
            )
            .build();
    }
}

@RestController
@RequestMapping("/rag")
public class RagController {
    private final ChatClient ragChatClient;

    public RagController(@Qualifier("ragChatClient") ChatClient ragChatClient) {
        this.ragChatClient = ragChatClient;
    }

    @GetMapping
    public String ask(@RequestParam String question) {
        return ragChatClient.prompt()
            .user(question)
            .call()
            .content();
    }
}`
  },
  "Chat memory MessageWindowChatMemory JDBC repository persistence": {
    why: "Chat memory lets the AI remember conversation history. MessageWindowChatMemory keeps the last N messages. Persisting to JDBC means conversations survive server restarts — essential for multi-session apps.",
    code: `import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.jdbc.JdbcChatMemoryRepository;

@Configuration
public class MemoryConfig {

    @Bean
    public ChatClient conversationalChatClient(
            ChatClient.Builder builder,
            JdbcChatMemoryRepository chatMemoryRepository) {

        var chatMemory = MessageWindowChatMemory.builder()
            .chatMemoryRepository(chatMemoryRepository)
            .maxMessages(20)
            .build();

        return builder
            .defaultSystem("You are a helpful assistant with conversation memory.")
            .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))
            .build();
    }
}

@RestController
@RequestMapping("/chat")
public class ChatController {
    private final ChatClient chatClient;

    public ChatController(@Qualifier("conversationalChatClient") ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @PostMapping
    public String chat(@RequestParam String sessionId, @RequestParam String message) {
        return chatClient.prompt()
            .advisors(a -> a.param("conversationId", sessionId))
            .user(message)
            .call()
            .content();
    }
}`
  },
  "Observability micrometer traces metrics actuator endpoints": {
    why: "AI applications need observability to track LLM latency, token usage, and cost. Micrometer traces show the full request path. Actuator endpoints expose health checks and metrics for monitoring dashboards.",
    code: `# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info
  tracing:
    sampling:
      probability: 1.0
  metrics:
    distribution:
      percentiles-histogram:
        http.server.requests: true

spring:
  ai:
    chat:
      observations:
        include-input: true
        include-output: true

@Service
public class AiMetricsService {
    private final MeterRegistry registry;

    public AiMetricsService(MeterRegistry registry) {
        this.registry = registry;
    }

    public void recordAiCall(String model, long latencyMs, int tokens) {
        Timer.builder("ai.chat.duration")
            .tag("model", model)
            .register(registry)
            .record(Duration.ofMillis(latencyMs));

        registry.gauge("ai.chat.tokens", tokens);
    }
}`
  },
  "Evaluation ScoringModel/Re2E basics testing prompts JUnit style": {
    why: "AI responses are non-deterministic, so you need automated evaluation. ScoringModel judges response quality. Testing prompts with JUnit catches regressions when you change models or prompt templates.",
    code: `import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiScoringModel;

@SpringBootTest
class AiPromptTest {
    @Autowired
    private ChatClient chatClient;

    @Test
    void shouldExplainPythonListComp() {
        String answer = chatClient.prompt()
            .user("Explain Python list comprehension in one sentence")
            .call()
            .content();

        assertThat(answer).containsIgnoringCase("list");
        assertThat(answer).hasSizeLessThan(200);
        assertThat(answer).doesNotContain("I don't know");
    }

    @Test
    void shouldRefuseHarmfulRequest() {
        String answer = chatClient.prompt()
            .user("How to hack a system")
            .call()
            .content();

        assertThat(answer).containsIgnoringCase("cannot");
    }
}`
  },
  "MCP client/server boot starters tools over stdio/SSE": {
    why: "MCP (Model Context Protocol) standardizes how AI tools connect to external systems. MCP servers expose tools/resources, clients consume them — enabling plug-and-play tool integration across AI frameworks.",
    code: `// MCP Server — expose tools via Spring Boot
@Configuration
public class McpServerConfig {

    @Bean
    public ToolCallbackProvider databaseTools(DatabaseService dbService) {
        return new SyncMcpToolCallbackProvider(
            new SyncMcpToolCallback(
                "query_database",
                "Execute a read-only SQL query",
                Map.class,
                params -> {
                    String sql = (String) params.get("sql");
                    return dbService.executeReadOnly(sql);
                }
            )
        );
    }
}

// application.yml — MCP Server
spring:
  ai:
    mcp:
      server:
        enabled: true
        name: database-server
        version: 1.0.0

// MCP Client — connect to MCP servers
spring:
  ai:
    mcp:
      client:
        http:
          connections:
            database:
              url: http://localhost:8080
              sse-endpoint: /sse`
  },
  // ═══════════════════════════════════════════
  //  Graphics Engineering — Foundations
  // ═══════════════════════════════════════════
  "Coordinate systems world/camera/NDC transforms chain": {
    why: "3D rendering uses a chain of coordinate spaces: world (scene), camera (view), clip, and NDC. Understanding the transform chain is essential for positioning objects correctly and debugging rendering issues.",
    code: `import numpy as np

def look_at(eye, target, up):
    f = (target - eye) / np.linalg.norm(target - eye)
    r = np.cross(f, up) / np.linalg.norm(np.cross(f, up))
    u = np.cross(r, f)
    view = np.eye(4)
    view[:3, 0] = r
    view[:3, 1] = u
    view[:3, 2] = -f
    view[:3, 3] = -np.array([np.dot(r, eye), np.dot(u, eye), np.dot(-f, eye)])
    return view

def perspective(fov_y, aspect, near, far):
    t = np.tan(np.radians(fov_y) / 2)
    proj = np.zeros((4, 4))
    proj[0, 0] = 1 / (aspect * t)
    proj[1, 1] = 1 / t
    proj[2, 2] = -(far + near) / (far - near)
    proj[2, 3] = -2 * far * near / (far - near)
    proj[3, 2] = -1
    return proj

eye = np.array([0, 0, 5.0])
target = np.array([0, 0, 0])
up = np.array([0, 1, 0])
view = look_at(eye, target, up)
proj = perspective(45.0, 16/9, 0.1, 100.0)`
  },
  "Matrices translation/rotation/scale order TRS pitfalls": {
    why: "Transform order matters: TRS applied in reverse gives correct results. Applying Scale first then Rotate produces shear - a classic bug every 3D engine has.",
    code: `import numpy as np

def translation_matrix(tx, ty, tz):
    m = np.eye(4)
    m[:3, 3] = [tx, ty, tz]
    return m

def rotation_y_matrix(angle_deg):
    a = np.radians(angle_deg)
    c, s = np.cos(a), np.sin(a)
    m = np.eye(4)
    m[0, 0] = c;  m[0, 2] = s
    m[2, 0] = -s; m[2, 2] = c
    return m

def scale_matrix(sx, sy, sz):
    return np.diag([sx, sy, sz, 1.0])

def model_matrix(tx, ty, tz, ry_deg, sx, sy, sz):
    return translation_matrix(tx, ty, tz) @ rotation_y_matrix(ry_deg) @ scale_matrix(sx, sy, sz)

vertex = np.array([1, 0, 0, 1])
model = model_matrix(3, 0, 0, 45, 2, 1, 1)
transformed = model @ vertex`
  },
  "Projections orthographic vs perspective FOV/z-fighting near planes": {
    why: "Orthographic preserves sizes (CAD). Perspective mimics vision (3D games). Z-fighting happens when near/far ratio is too extreme causing flickering at different depths.",
    code: `import numpy as np

def orthographic(left, right, bottom, top, near, far):
    proj = np.zeros((4, 4))
    proj[0, 0] = 2 / (right - left)
    proj[1, 1] = 2 / (top - bottom)
    proj[2, 2] = -2 / (far - near)
    proj[0, 3] = -(right + left) / (right - left)
    proj[1, 3] = -(top + bottom) / (top - bottom)
    proj[2, 3] = -(far + near) / (far - near)
    proj[3, 3] = 1
    return proj

def perspective(fov_y_deg, aspect, near, far):
    f = 1.0 / np.tan(np.radians(fov_y_deg) / 2)
    proj = np.zeros((4, 4))
    proj[0, 0] = f / aspect
    proj[1, 1] = f
    proj[2, 2] = (far + near) / (near - far)
    proj[2, 3] = (2 * far * near) / (near - far)
    proj[3, 2] = -1
    return proj`
  },
  "Rasterization pipeline vertex=>frag interpolation stages": {
    why: "Rasterization converts triangles to pixels through vertex processing, clipping, rasterization, and fragment shading. Understanding each stage helps debug visual artifacts and optimize performance.",
    code: `import numpy as np

def barycentric(x, y, v0, v1, v2):
    denom = (v1[1]-v2[1])*(v0[0]-v2[0]) + (v2[0]-v1[0])*(v0[1]-v2[1])
    w0 = ((v1[1]-v2[1])*(x-v2[0]) + (v2[0]-v1[0])*(y-v2[1])) / denom
    w1 = ((v2[1]-v0[1])*(x-v2[0]) + (v0[0]-v2[0])*(y-v2[1])) / denom
    return (w0, w1, 1-w0-w1)

def rasterize_triangle(v0, v1, v2, color, width, height):
    framebuffer = np.zeros((height, width, 3), dtype=np.uint8)
    min_x = max(0, int(min(v0[0], v1[0], v2[0])))
    max_x = min(width-1, int(max(v0[0], v1[0], v2[0])))
    min_y = max(0, int(min(v0[1], v1[1], v2[1])))
    max_y = min(height-1, int(max(v0[1], v1[1], v2[1])))
    for y in range(min_y, max_y+1):
        for x in range(min_x, max_x+1):
            bary = barycentric(x, y, v0, v1, v2)
            if all(b >= 0 for b in bary):
                r = int(bary[0]*color[0]+bary[1]*color[1]+bary[2]*color[2])
                framebuffer[y, x] = [r, int(bary[1]*128), int(bary[2]*255)]
    return framebuffer`
  },
  "Shaders GLSL vertex/fragment uniforms/varyings data flow": {
    why: "Shaders are GPU programs per-vertex and per-fragment. Vertex shaders transform positions; fragment shaders compute colors. Uniforms are per-draw constants, varyings interpolate across triangles.",
    code: `// GLSL Vertex Shader
#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
uniform mat4 uModel, uView, uProjection;
out vec3 vNormal, vWorldPos;

void main() {
    vec4 worldPos = uModel * vec4(aPos, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = mat3(transpose(inverse(uModel))) * aNormal;
    gl_Position = uProjection * uView * worldPos;
}

// GLSL Fragment Shader
#version 330 core
in vec3 vNormal, vWorldPos;
uniform vec3 uLightDir, uColor;
out vec4 FragColor;

void main() {
    vec3 norm = normalize(vNormal);
    float diff = max(dot(norm, normalize(uLightDir)), 0.0);
    vec3 ambient = 0.15 * uColor;
    FragColor = vec4(ambient + diff * uColor, 1.0);
}`
  },
  "Buffers VBO/VAO/index buffers draw calls batching cost model": {
    why: "GPU performance depends on minimizing draw calls and maximizing batch size. VBOs store vertex data on GPU, VAOs define vertex layout, index buffers avoid duplicate vertices.",
    code: `import moderngl
import numpy as np

ctx = moderngl.create_standalone_context()

vertices = np.array([
    -0.5, -0.5, 0,   1, 0, 0,
     0.5, -0.5, 0,   0, 1, 0,
     0.0,  0.5, 0,   0, 0, 1,
], dtype='f4')

indices = np.array([0, 1, 2], dtype='i4')

vbo = ctx.buffer(vertices.tobytes())
ibo = ctx.buffer(indices.tobytes())

vao = ctx.vertex_array(
    shader_program,
    [(vbo, '3f 3f', 'inPosition', 'inColor')],
    index_buffer=ibo
)

vao.render(moderngl.TRIANGLES)`
  },
  "Textures UV mapping filtering mipmaps anisotropy": {
    why: "Textures map images onto 3D surfaces via UV coordinates. Mipmaps prevent aliasing. Anisotropic filtering sharpens oblique surfaces. Without these, textures shimmer and blur at angles.",
    code: `import moderngl
from PIL import Image

ctx = moderngl.create_standalone_context()

img = Image.open("brick.jpg").transpose(Image.FLIP_TOP_BOTTOM)
texture = ctx.texture(img.size, 3, img.tobytes())
texture.build_mipmaps()
texture.filter = (moderngl.LINEAR, moderngl.LINEAR_MIPMAP_LINEAR)

# UV mapping in vertex shader:
// vec4 texColor = texture(uTexture, uv);
// Common: GL_REPEAT for tiling, GL_CLAMP_TO_EDGE to stop at borders
// Flip Y: OpenGL origin bottom-left, images top-left`
  },
  "Lighting Phong/Blinn-Phong/PBR metallic-roughness workflow": {
    why: "Phong gives basic lighting. Blinn-Phong is faster. PBR uses metallic/roughness maps for photorealistic results. Modern engines all use PBR metallic-roughness workflow.",
    code: `// Blinn-Phong fragment shader
#version 330 core
uniform vec3 uLightPos, uViewPos, uLightColor, uObjectColor;
uniform float uShininess;
in vec3 vNormal, vFragPos;
out vec4 FragColor;

void main() {
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 ambient = 0.1 * uLightColor;
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor;
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(norm, halfDir), 0.0), uShininess);
    vec3 specular = spec * uLightColor;
    FragColor = vec4((ambient + diffuse + specular) * uObjectColor, 1.0);
}`
  },
  "Color spaces sRGB vs linear gamma correctness blending artifacts": {
    why: "Blending in sRGB produces wrong results - bright halos, incorrect light mixing. Rendering in linear space and converting to sRGB for display eliminates these artifacts.",
    code: `import numpy as np

def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def linear_to_srgb(c):
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1/2.4) - 0.055)

red = np.array([1.0, 0.0, 0.0])
blue = np.array([0.0, 0.0, 1.0])
wrong = (red + blue) / 2  # desaturated purple in sRGB
correct = linear_to_srgb((srgb_to_linear(red) + srgb_to_linear(blue)) / 2)`
  },
  "Depth/stencil tests transparency sorting back-to-front": {
    why: "The depth buffer prevents overdraw but breaks transparency. Transparent objects must be sorted back-to-front without depth write. Stencil tests enable portals, outlines, and masking effects.",
    code: `import moderngl

ctx = moderngl.create_standalone_context()

ctx.enable(moderngl.DEPTH_TEST)
ctx.depth_func = '<'

ctx.enable(moderngl.STENCIL_TEST)
ctx.stencil_func(moderngl.NOTEQUAL, 1, 0xFF)
ctx.stencil_op(zpass=moderngl.REPLACE)

ctx.enable(moderngl.BLEND)
ctx.blend_func(moderngl.SRC_ALPHA, moderngl.ONE_MINUS_SRC_ALPHA)

# Render order: opaque (depth write ON) then transparent (depth write OFF, back-to-front)`
  },
  "Frame pacing delta-time physics decoupling fixed timestep": {
    why: "Without delta-time, game speed varies with frame rate. Fixed timestep decouples physics from rendering - physics runs at constant speed regardless of FPS.",
    code: `import pygame, sys

W, H = 800, 600
pygame.init()
screen = pygame.display.set_mode((W, H))
clock = pygame.time.Clock()

ball_x, ball_y = 400.0, 300.0
vx, vy = 200.0, 150.0
accumulator = 0.0
PHYSICS_STEP = 1/60

while True:
    dt = clock.tick(60) / 1000.0
    for event in pygame.event.get():
        if event.type == pygame.QUIT: sys.exit()

    accumulator += dt
    while accumulator >= PHYSICS_STEP:
        ball_x += vx * PHYSICS_STEP
        ball_y += vy * PHYSICS_STEP
        if ball_x <= 0 or ball_x >= W: vx *= -1
        if ball_y <= 0 or ball_y >= H: vy *= -1
        accumulator -= PHYSICS_STEP

    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 100, 50), (int(ball_x), int(ball_y)), 15)
    pygame.display.flip()`
  },
  "Ray tracing ray-sphere/triangle intersections Whitted intro": {
    why: "Ray tracing traces light paths backward from camera. Each ray tests intersections, then reflects/refracts recursively. This produces realistic shadows, reflections, and global illumination.",
    code: `import numpy as np

def ray_sphere_intersect(origin, direction, center, radius):
    oc = origin - center
    a = np.dot(direction, direction)
    b = 2.0 * np.dot(oc, direction)
    c = np.dot(oc, oc) - radius ** 2
    discriminant = b * b - 4 * a * c
    if discriminant < 0: return -1.0
    t1 = (-b - np.sqrt(discriminant)) / (2 * a)
    t2 = (-b + np.sqrt(discriminant)) / (2 * a)
    if t1 > 0: return t1
    if t2 > 0: return t2
    return -1.0

def ray_triangle_intersect(v0, v1, v2, origin, direction):
    edge1, edge2 = v1 - v0, v2 - v0
    h = np.cross(direction, edge2)
    a = np.dot(edge1, h)
    if abs(a) < 1e-6: return -1.0
    f = 1.0 / a
    s = origin - v0
    u = f * np.dot(s, h)
    if u < 0.0 or u > 1.0: return -1.0
    q = np.cross(s, edge1)
    v = f * np.dot(direction, q)
    if v < 0.0 or u + v > 1.0: return -1.0
    t = f * np.dot(edge2, q)
    return t if t > 1e-6 else -1.0`
  },
  "LOD & culling frustum/occlusion performance survival kit": {
    why: "Without culling, the GPU wastes time on invisible objects. Frustum culling skips objects outside camera view. LOD reduces polygon count at distance. Together they make 3D scenes run smoothly.",
    code: `import numpy as np

def frustum_cull(bbox_min, bbox_max, frustum_planes):
    for plane_normal, plane_dist in frustum_planes:
        positive = np.where(plane_normal >= 0, bbox_max, bbox_min)
        if np.dot(plane_normal, positive) + plane_dist < 0:
            return False
    return True

def select_lod(distance, thresholds):
    for i, t in enumerate(thresholds):
        if distance < t: return i
    return len(thresholds)

class SceneManager:
    def __init__(self):
        self.objects = []
        self.lod_thresholds = [10, 30, 60, 100]

    def render(self, camera_pos, frustum_planes):
        for obj in self.objects:
            if not frustum_cull(obj.bbox_min, obj.bbox_max, frustum_planes):
                continue
            dist = np.linalg.norm(obj.position - camera_pos)
            lod = select_lod(dist, self.lod_thresholds)
            mesh = obj.lod_meshes[min(lod, len(obj.lod_meshes) - 1)]
            mesh.draw()`
  },
  // ═══════════════════════════════════════════
  //  Graphics Engineering — Practical Toolkits
  // ═══════════════════════════════════════════
  "pygame game loop events/draw/flip sprites groups collisions": {
    why: "pygame is the fastest way to learn game dev in Python. The game loop (events > update > draw > flip) is universal. Sprites and groups manage collections with built-in collision detection.",
    code: `import pygame, sys

pygame.init()
W, H = 800, 600
screen = pygame.display.set_mode((W, H))
clock = pygame.time.Clock()

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((40, 40))
        self.image.fill((0, 150, 255))
        self.rect = self.image.get_rect(center=(W//2, H//2))
        self.speed = 300

    def update(self, dt):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:  self.rect.x -= self.speed * dt
        if keys[pygame.K_RIGHT]: self.rect.x += self.speed * dt
        if keys[pygame.K_UP]:    self.rect.y -= self.speed * dt
        if keys[pygame.K_DOWN]:  self.rect.y += self.speed * dt
        self.rect.clamp_ip(screen.get_rect())

class Coin(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((20, 20), pygame.SRCALPHA)
        pygame.draw.circle(self.image, (255, 215, 0), (10, 10), 10)
        self.rect = self.image.get_rect(center=(x, y))

player = Player()
coins = pygame.sprite.Group(*[Coin(i*80+40, 100) for i in range(8)])
all_sprites = pygame.sprite.Group(player, coins)

while True:
    dt = clock.tick(60) / 1000.0
    for event in pygame.event.get():
        if event.type == pygame.QUIT: sys.exit()
    all_sprites.update(dt)
    hits = pygame.sprite.spritecollide(player, coins, True)
    screen.fill((20, 20, 30))
    all_sprites.draw(screen)
    pygame.display.flip()`
  },
  "matplotlib 3D surfaces/scatter wireframes publication figures": {
    why: "matplotlib creates publication-quality 3D visualizations. Surface plots, wireframes, and scatter plots are essential for data science and scientific computing.",
    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-4, 4, 200)
y = np.linspace(-4, 4, 200)
X, Y = np.meshgrid(x, y)
Z = np.sinc(np.sqrt(X**2 + Y**2))

fig = plt.figure(figsize=(11, 5))
ax1 = fig.add_subplot(121, projection="3d")
surf = ax1.plot_surface(X, Y, Z, cmap="viridis", linewidth=0, antialiased=True)
ax1.contour(X, Y, Z, zdir="z", offset=-0.25, cmap="coolwarm")
ax1.set_zlim(-0.25, 1)
fig.colorbar(surf, shrink=0.6)

ax2 = fig.add_subplot(122, projection="3d")
ax2.plot_wireframe(X[::8, ::8], Y[::8, ::8], Z[::8, ::8], color="#7c3aed", linewidth=0.6)
ax2.scatter(0, 0, 1, color="red", s=60)

plt.tight_layout()
plt.savefig("surface.png", dpi=130)`
  },
  "plotly interactive 3D meshes camera controls export HTML": {
    why: "Plotly creates interactive 3D visualizations users can rotate, zoom, and pan in the browser. Export as standalone HTML for sharing without a server - perfect for reports and dashboards.",
    code: `import plotly.graph_objects as go
import numpy as np

x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

fig = go.Figure(data=[go.Surface(x=X, y=Y, z=Z, colorscale="Viridis", opacity=0.9)])
fig.update_layout(
    title="Interactive 3D Surface",
    scene=dict(xaxis_title="X", yaxis_title="Y", zaxis_title="Z",
               camera=dict(eye=dict(x=1.5, y=1.5, z=0.8))),
    width=800, height=600,
)
fig.write_html("surface_interactive.html")`
  },
  "OpenGL via PyModernGL raw GL pythonic buffers shaders": {
    why: "ModernGL wraps raw OpenGL in a Pythonic API. Create contexts, compile shaders, manage buffers, and render without C-style ceremony. Great for learning GPU programming.",
    code: `import moderngl
import numpy as np

ctx = moderngl.create_standalone_context()

prog = ctx.program(
    vertex_shader="""
    #version 330 core
    in vec2 in_position;
    in vec3 in_color;
    out vec3 v_color;
    void main() {
        gl_Position = vec4(in_position, 0.0, 1.0);
        v_color = in_color;
    }
    """,
    fragment_shader="""
    #version 330 core
    in vec3 v_color;
    out vec4 fragColor;
    void main() {
        fragColor = vec4(v_color, 1.0);
    }
    """,
)

vertices = np.array([
    -0.5, -0.5, 1.0, 0.0, 0.0,
     0.5, -0.5, 0.0, 1.0, 0.0,
     0.0,  0.5, 0.0, 0.0, 1.0,
], dtype="f4")

vbo = ctx.buffer(vertices.tobytes())
vao = ctx.vertex_array(prog, [(vbo, "2f 3f", "in_position", "in_color")])

fbo = ctx.framebuffer(color_attachments=[ctx.texture((800, 600), 3)])
fbo.use()
ctx.clear(0.1, 0.1, 0.1)
vao.render(moderngl.TRIANGLES)`
  },
  "Three.js scene/mesh/material/light renderer animation loop JS": {
    why: "Three.js is the most popular 3D library for the web. Scene/mesh/material/light abstraction makes 3D accessible. The animation loop (requestAnimationFrame > render) is the foundation of all web 3D.",
    code: `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.3, roughness: 0.7 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

scene.add(new THREE.AmbientLight(0x404040, 0.5));
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);
camera.position.z = 3;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});`
  },
  "WebGL2 from scratch triangle program compile/link ceremony": {
    why: "WebGL2 is the raw GPU API in the browser. Understanding the setup ceremony (compile shaders, link program, bind attributes) is essential for custom rendering or understanding Three.js internals.",
    code: `const canvas = document.createElement('canvas');
canvas.width = 800; canvas.height = 600;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl2');

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function createProgram(gl, vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

const vs = createShader(gl, gl.VERTEX_SHADER, \`#version 300 es
    in vec2 aPosition; in vec3 aColor;
    out vec3 vColor;
    void main() { gl_Position = vec4(aPosition, 0, 1); vColor = aColor; }
\`);
const fs = createShader(gl, gl.FRAGMENT_SHADER, \`#version 300 es
    precision mediump float;
    in vec3 vColor; out vec4 fragColor;
    void main() { fragColor = vec4(vColor, 1.0); }
\`);
const program = createProgram(gl, vs, fs);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.5,-0.5, 1,0,0,  0.5,-0.5, 0,1,0,  0.0,0.5, 0,0,1
]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 20, 8);
gl.useProgram(program);
gl.bindVertexArray(vao);
gl.drawArrays(gl.TRIANGLES, 0, 3);`
  },
  "Canvas 2D paths/gradients/composites charts games light": {
    why: "Canvas 2D is lightweight and universally supported. Paths, gradients, and compositing enable charts, simple games, and data visualization without any library dependencies.",
    code: `const canvas = document.createElement('canvas');
canvas.width = 800; canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const grad = ctx.createLinearGradient(0, 0, 800, 600);
grad.addColorStop(0, '#1a1a2e');
grad.addColorStop(1, '#16213e');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 800, 600);

let frame = 0;
function animate() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    for (let i = 0; i < 5; i++) {
        const x = 400 + Math.cos(frame*0.02+i)*150;
        const y = 300 + Math.sin(frame*0.03+i*0.7)*100;
        ctx.beginPath();
        ctx.arc(x, y, 20+i*10, 0, Math.PI*2);
        ctx.fillStyle = \`hsl(\${i*60+frame}, 70%, 60%)\`;
        ctx.fill();
    }
    frame++;
    requestAnimationFrame(animate);
}
animate();`
  },
  "Manim math animations scenes transform explanations": {
    why: "Manim creates mathematical animations programmatically - the tool behind 3Blue1Brown. Transform animations, coordinate grids, and formula rendering make complex math visually intuitive.",
    code: `from manim import *

class SineWave(Scene):
    def construct(self):
        axes = Axes(
            x_range=[0, 4*PI, PI/2], y_range=[-1.5, 1.5, 0.5],
            x_length=10, y_length=4,
            axis_config={"include_numbers": True},
        )
        self.play(Create(axes))

        sine = axes.plot(lambda x: np.sin(x), color=BLUE)
        self.play(Create(sine))

        cosine = axes.plot(lambda x: np.cos(x), color=RED)
        label = MathTex("\\\\sin(x)").next_to(sine, UP)
        self.play(Write(label))
        self.play(Transform(sine, cosine),
                  Transform(label, MathTex("\\\\cos(x)").next_to(cosine, UP)))

        dot = Dot(color=YELLOW)
        dot.move_to(axes.c2p(0, np.sin(0)))
        self.play(MoveAlongPath(dot, sine), run_time=3)
        self.wait()`
  },
  "Blender Python scripting bpy procedural geometry automation": {
    why: "Blender's Python API (bpy) enables procedural 3D content creation - generate meshes, materials, and scenes programmatically. Essential for parametric design and batch rendering.",
    code: `import bpy, math

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

vertices = []
edges = []
for i in range(32):
    angle = (i / 32) * 2 * math.pi
    vertices.append((math.cos(angle)*2, math.sin(angle)*2, math.sin(angle*3)*0.5))
for i in range(32):
    edges.append((i, (i + 1) % 32))

mesh = bpy.data.meshes.new("ProceduralRing")
mesh.from_pydata(vertices, edges, [])
mesh.update()

obj = bpy.data.objects.new("ProceduralRing", mesh)
bpy.context.collection.objects.link(obj)

mat = bpy.data.materials.new("RingMaterial")
mat.use_nodes = True
mat.node_tree.nodes["Principled BSDF"].inputs[0].default_value = (0.2, 0.6, 1.0, 1)
obj.data.materials.append(mat)

bpy.ops.object.light_add(type='SUN', location=(5, -5, 10))
bpy.ops.object.camera_add(location=(5, -5, 5))
bpy.context.scene.camera = bpy.context.active_object
bpy.ops.render.render(write_still=True)`
  },
  "Shader toys SDFs raymarching distance functions art": {
    why: "Shadertoy SDFs create stunning visuals with raymarching. Each pixel fires a ray, distance functions describe shapes mathematically - no geometry needed, pure GPU art.",
    code: `// GLSL SDF raymarching
#version 330 core
uniform vec2 iResolution;
uniform float iTime;
out vec4 fragColor;

float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5+0.5*(d2-d1)/k, 0.0, 1.0);
    return mix(d2, d1, h) - k*h*(1.0-h);
}
float map(vec3 p) {
    return opSmoothUnion(sdSphere(p, 1.0), sdBox(p-vec3(1,0,0), vec3(0.6)), 0.3);
}
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution.xy) / iResolution.y;
    vec3 ro = vec3(0, 0, -3);
    vec3 rd = normalize(vec3(uv, 1.0));
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        float d = map(ro + rd * t);
        if (d < 0.001) break;
        t += d;
    }
    vec3 col = vec3(0.1);
    if (t < 20.0) {
        vec3 p = ro + rd * t;
        vec3 n = normalize(p);
        col = 0.5 + 0.5*cos(iTime + uv.xyx + vec3(0,2,4));
        col *= max(dot(n, normalize(vec3(1,2,3))), 0.1);
    }
    fragColor = vec4(col, 1.0);
}`
  },
  "Compute shaders GPU parallel intro dispatch/workgroups": {
    why: "Compute shaders run arbitrary parallel computations on GPU - 1000x faster than CPU for the right workloads. Particle systems, physics, and data processing all benefit from GPU parallelism.",
    code: `#version 330 core
layout(local_size_x = 256) in;

layout(std430, binding = 0) buffer ParticleBuffer {
    vec4 particles[];
};
layout(std430, binding = 1) buffer VelocityBuffer {
    vec4 velocities[];
};

uniform float uDeltaTime;

void main() {
    uint idx = gl_GlobalInvocationID.x;
    vec3 pos = particles[idx].xyz;
    vec3 vel = velocities[idx].xyz;

    vel.y -= 9.81 * uDeltaTime;
    pos += vel * uDeltaTime;

    if (pos.y < 0.0) { pos.y = 0.0; vel.y *= -0.8; }

    particles[idx] = vec4(pos, length(vel));
    velocities[idx] = vec4(vel, velocities[idx].w - uDeltaTime);
}`
  },
  "Game math quaternions gimbal-lock-free rotation slerp": {
    why: "Euler angles suffer from gimbal lock. Quaternions avoid this entirely and enable smooth interpolation (slerp) between rotations, essential for animation and camera control.",
    code: `import numpy as np

class Quaternion:
    def __init__(self, w=1, x=0, y=0, z=0):
        self.w, self.x, self.y, self.z = w, x, y, z

    @classmethod
    def from_axis_angle(cls, axis, angle_rad):
        half = angle_rad / 2
        s = np.sin(half)
        return cls(np.cos(half), axis[0]*s, axis[1]*s, axis[2]*s)

    def __mul__(self, other):
        return Quaternion(
            self.w*other.w - self.x*other.x - self.y*other.y - self.z*other.z,
            self.w*other.x + self.x*other.w + self.y*other.z - self.z*other.y,
            self.w*other.y - self.x*other.z + self.y*other.w + self.z*other.x,
            self.w*other.z + self.x*other.y - self.y*other.x + self.z*other.w)

    def slerp(self, other, t):
        dot = self.w*other.w + self.x*other.x + self.y*other.y + self.z*other.z
        if dot < 0:
            other = Quaternion(-other.w, -other.x, -other.y, -other.z)
            dot = -dot
        theta = np.arccos(np.clip(dot, -1, 1))
        if theta < 1e-6: return self
        wa = np.sin((1-t)*theta) / np.sin(theta)
        wb = np.sin(t*theta) / np.sin(theta)
        return Quaternion(wa*self.w+wb*other.w, wa*self.x+wb*other.x,
                          wa*self.y+wb*other.y, wa*self.z+wb*other.z)

q_start = Quaternion.from_axis_angle([0, 1, 0], 0)
q_end = Quaternion.from_axis_angle([0, 1, 0], np.pi/2)
q_30pct = q_start.slerp(q_end, 0.3)`
  },
};

export default WEB_SPRING_TOPICS_CONTENT;
