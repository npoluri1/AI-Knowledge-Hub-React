// Auto-generated enhanced data for Web/Spring/Graphics topics
// Contains "why" explanations and real-world code examples for ALL topics
// DO NOT EDIT MANUALLY - regenerate from source data

export const WEB_SPRING_TOPICS_ENHANCED = {
  "Path/query/body params auto docs /docs swagger": {
    why: "FastAPI automatically generates interactive Swagger UI from your type hints and Pydantic models. Without proper parameter annotations, you lose free API documentation and clients guess request formats.",
    code: 'from fastapi import FastAPI, Query\n\napp = FastAPI()\n\n@app.get("/items/{item_id}")\nasync def read_item(\n    item_id: int,\n    q: str | None = Query(default=None, description="Search filter"),\n    skip: int = Query(default=0, ge=0),\n    limit: int = Query(default=10, le=100),\n):\n    """Path param is int-validated. Query params have docs."""\n    return {"item_id": item_id, "q": q, "skip": skip, "limit": limit}\n# Visit /docs for auto-generated Swagger UI'
  },
  "Pydantic v2 models Field validators constr ge/le/pattern": {
    why: "Pydantic v2 catches malformed input at the API boundary before it touches your business logic. Without field-level constraints, bad data silently propagates into your database.",
    code: 'from pydantic import BaseModel, Field, field_validator\n\nclass ProductCreate(BaseModel):\n    name: str = Field(..., min_length=1, max_length=200)\n    price: float = Field(..., gt=0, description="Price in SGD")\n    sku: str = Field(..., pattern=r"^[A-Z]{3}-\\\\d{4}$")\n    tags: list[str] = Field(default_factory=list, max_length=10)\n\n    @field_validator("name")\n    @classmethod\n    def strip_name(cls, v: str) -> str:\n        return v.strip()'
  },
  "Response models output filtering exclude_unset": {
    why: "Response models filter what clients receive, preventing internal fields like password hashes from leaking. Without exclude_unset, clients see all default values instead of only what was explicitly set.",
    code: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass UserOut(BaseModel):\n    id: int\n    name: str\n    email: str\n    is_active: bool = True\n\nclass UserDB(UserOut):\n    hashed_password: str  # never sent to client\n\n@app.get("/users/{user_id}", response_model=UserOut)\nasync def get_user(user_id: int):\n    db_user = UserDB(id=1, name="Ada", email="a@x.com",\n                     hashed_password="bcrypt...", is_active=True)\n    return db_user  # response_model strips hashed_password'
  },
  "Status codes & HTTPException proper verbs semantics": {
    why: "Correct HTTP status codes let clients, proxies, and monitoring tools reason about your API. Returning 200 for errors breaks caching, retry logic, and frontend error handling.",
    code: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\nTODOS: dict[int, dict] = {}\n\n@app.post("/todos", status_code=201)\nasync def create_todo(todo: dict):\n    todo_id = len(TODOS) + 1\n    TODOS[todo_id] = {**todo, "id": todo_id, "done": False}\n    return TODOS[todo_id]\n\n@app.get("/todos/{todo_id}")\nasync def get_todo(todo_id: int):\n    if todo_id not in TODOS:\n        raise HTTPException(status_code=404,\n            detail=f"Todo {todo_id} not found",\n            headers={"X-Error-Code": "NOT_FOUND"})\n    return TODOS[todo_id]\n\n@app.delete("/todos/{todo_id}", status_code=204)\nasync def delete_todo(todo_id: int):\n    if todo_id not in TODOS:\n        raise HTTPException(404)\n    del TODOS[todo_id]'
  },
  "Annotated dependencies modern DI style": {
    why: "Annotated-based dependencies let FastAPI parse complex request parameters from headers, cookies, and query strings without manual extraction. This centralizes auth checks and reusable logic.",
    code: 'from typing import Annotated\nfrom fastapi import FastAPI, Depends, Header, Query\n\napp = FastAPI()\n\ndef verify_token(authorization: Annotated[str, Header()]) -> str:\n    if not authorization.startswith("Bearer "):\n        raise HTTPException(status_code=401, detail="Invalid token")\n    return authorization[7:]\n\ndef common_params(\n    page: Annotated[int, Query(ge=1)] = 1,\n    size: Annotated[int, Query(ge=1, le=100)] = 20,\n) -> dict:\n    return {"skip": (page - 1) * size, "limit": size}\n\n@app.get("/protected/items")\nasync def list_items(\n    token: Annotated[str, Depends(verify_token)],\n    params: Annotated[dict, Depends(common_params)],\n):\n    return {"token_prefix": token[:6], "pagination": params}'
  },
  "Query param lists aliases pagination skip/limit": {
    why: "Pagination is mandatory for any endpoint returning collections. Without skip/limit, a single request can dump your entire database. Query param lists let you filter by multiple values.",
    code: 'from fastapi import FastAPI, Query\n\napp = FastAPI()\n\n@app.get("/products")\nasync def list_products(\n    status: list[str] | None = Query(default=None),\n    min_price: float = Query(default=0, ge=0),\n    max_price: float = Query(default=10_000, le=1_000_000),\n    skip: int = Query(default=0, ge=0),\n    limit: int = Query(default=20, le=100),\n):\n    """Filter: /products?status=active&status=pending&min_price=10"""\n    return {\n        "filters": {"status": status, "price_range": [min_price, max_price]},\n        "pagination": {"skip": skip, "limit": limit},\n    }'
  },
  "Routers APIRouter prefix/tags modular apps": {
    why: "APIRouter splits your app into logical modules so multiple developers work independently without merge conflicts. Without routers, all endpoints live in one unmanageable file.",
    code: 'from fastapi import APIRouter\n\nusers = APIRouter(prefix="/users", tags=["users"])\nitems = APIRouter(prefix="/items", tags=["items"])\n\n@users.get("/")\nasync def list_users():\n    return [{"id": 1, "name": "Alice"}]\n\n@users.get("/{user_id}")\nasync def get_user(user_id: int):\n    return {"id": user_id}\n\n@items.get("/")\nasync def list_items():\n    return [{"id": 1, "name": "Widget"}]\n\n@items.post("/", status_code=201)\nasync def create_item(item: dict):\n    return {"id": 2, **item}\n\n# In main.py: app.include_router(users); app.include_router(items)'
  },
  "Nested models & examples schema richness for clients": {
    why: "Nested Pydantic models with Field examples generate accurate OpenAPI schemas that frontend teams can auto-generate typed clients from.",
    code: 'from fastapi import FastAPI\nfrom pydantic import BaseModel, Field\n\napp = FastAPI()\n\nclass Address(BaseModel):\n    street: str = Field(..., examples=["10 Backend Rd"])\n    city: str = Field(default="Singapore", examples=["Singapore"])\n\nclass CreateOrder(BaseModel):\n    customer_name: str = Field(..., examples=["Alice"])\n    items: list[str] = Field(..., examples=[["Widget", "Gadget"]])\n    shipping: Address = Field(..., examples=[{"street": "10 Backend Rd", "city": "Singapore"}])\n\n@app.post("/orders", response_model=CreateOrder, status_code=201)\nasync def create_order(order: CreateOrder):\n    return order'
  },
  "Depends dependency injection chains overrides in tests": {
    why: "FastAPI's dependency injection lets you swap real databases for mocks in tests without touching route code. Chained dependencies compose auth + DB + rate limiting cleanly.",
    code: 'from fastapi import FastAPI, Depends\n\napp = FastAPI()\n\ndef get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\ndef get_current_user(db = Depends(get_db)):\n    return db.query(User).first()\n\n@app.get("/profile")\nasync def profile(user = Depends(get_current_user)):\n    return {"name": user.name, "email": user.email}\n\n# In tests: override the dependency\ndef fake_get_user():\n    return User(name="Test", email="test@test.com")\n\napp.dependency_overrides[get_current_user] = fake_get_user'
  },
  "Security OAuth2PasswordBearer scopes role gates": {
    why: "OAuth2 with scopes lets you enforce fine-grained access control at the route level. Without scopes, every authenticated user has identical permissions.",
    code: 'from fastapi import FastAPI, Depends, Security\nfrom fastapi.security import OAuth2PasswordBearer, SecurityScopes\n\noauth2 = OAuth2PasswordBearer(\n    tokenUrl="/token",\n    scopes={"read": "Read access", "write": "Write access", "admin": "Admin"},\n)\napp = FastAPI()\n\nasync def get_current_user(token: str = Depends(oauth2)):\n    return {"sub": "alice", "scopes": ["read", "write"]}\n\n@app.get("/reports", dependencies=[Security(get_current_user, scopes=["read"])])\nasync def read_reports():\n    return [{"id": 1, "title": "Q4 Report"}]\n\n@app.post("/reports", dependencies=[Security(get_current_user, scopes=["write"])])\nasync def create_report(report: dict):\n    return {"id": 2, **report}'
  },
  "JWT issue/verify patterns access+refresh rotation": {
    why: "Access tokens should be short-lived (15min) to limit blast radius. Refresh tokens rotate on use, so a stolen refresh token is detected when the original user's next refresh fails.",
    code: 'import time, hmac, hashlib, base64, json\nfrom fastapi import FastAPI, HTTPException\n\napp = FastAPI()\nSECRET = b"change-me-in-prod"\n\ndef b64enc(data: bytes) -> str:\n    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()\n\ndef create_token(sub: str, role: str, minutes: int = 15) -> str:\n    header = b64enc(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())\n    payload = b64enc(json.dumps({"sub": sub, "role": role, "exp": int(time.time()) + minutes * 60}).encode())\n    sig = b64enc(hmac.new(SECRET, f"{header}.{payload}".encode(), hashlib.sha256).digest())\n    return f"{header}.{payload}.{sig}"\n\ndef verify_token(token: str) -> dict:\n    try:\n        h, p, s = token.split(".")\n        expected = b64enc(hmac.new(SECRET, f"{h}.{p}".encode(), hashlib.sha256).digest())\n        assert hmac.compare_digest(s, expected)\n        payload = json.loads(base64.urlsafe_b64decode(p + "=="))\n        assert payload["exp"] > time.time()\n        return payload\n    except Exception:\n        raise HTTPException(401, "Invalid or expired token")'
  },
  "Middleware request timing/CORS/GZip ordering matters": {
    why: "Middleware order determines what sees the raw request versus the processed one. CORS must come before your routes. Request timing logs slow endpoints before GZip compresses the response.",
    code: 'from fastapi import FastAPI, Request\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.middleware.gzip import GZipMiddleware\nimport time\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def timing_middleware(request: Request, call_next):\n    start = time.perf_counter()\n    response = await call_next(request)\n    response.headers["X-Process-Time"] = f"{time.perf_counter() - start:.4f}"\n    return response\n\napp.add_middleware(CORSMiddleware, allow_origins=["https://myapp.com"],\n                   allow_methods=["*"], allow_headers=["*"])\napp.add_middleware(GZipMiddleware, minimum_size=500)'
  },
  "Lifespan startup/shutdown pools clients close cleanly": {
    why: "Database connections created at import time never get closed, causing pool exhaustion in production. Lifespan handlers ensure resources are created on startup and released on shutdown.",
    code: 'from contextlib import asynccontextmanager\nfrom fastapi import FastAPI\nimport httpx\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    app.state.http_client = httpx.AsyncClient(base_url="https://api.partner.com", timeout=10)\n    app.state.db_pool = create_pool(min_size=5, max_size=20)\n    yield\n    await app.state.http_client.aclose()\n    app.state.db_pool.close()\n\napp = FastAPI(lifespan=lifespan)\n\n@app.get("/proxy")\nasync def proxy_data(request: Request):\n    client = request.app.state.http_client\n    resp = await client.get("/data")\n    return resp.json()'
  },
  "BackgroundTasks vs queues fire-forget limits": {
    why: "BackgroundTasks runs in-process and dies with your server, making it unsuitable for critical work like sending emails. Task queues (Celery, RQ) persist jobs across restarts but add infrastructure.",
    code: 'from fastapi import FastAPI, BackgroundTasks\nimport logging\n\napp = FastAPI()\nlogger = logging.getLogger(__name__)\n\ndef send_email(to: str, subject: str, body: str):\n    logger.info(f"Sending email to {to}: {subject}")\n    smtp_client.send(to, subject, body)\n\n@app.post("/orders", status_code=202)\nasync def create_order(order: dict, background: BackgroundTasks):\n    order_id = save_order(order)\n    background.add_task(send_email, order["email"],\n                        "Order Confirmed", f"ID: {order_id}")\n    return {"order_id": order_id, "status": "processing"}'
  },
  "WebSockets endpoint manager broadcast rooms": {
    why: "WebSockets maintain persistent bidirectional connections for chat, live dashboards, and collaborative editing. Without a connection manager, you cannot broadcast to all clients or route messages to specific rooms.",
    code: 'from fastapi import FastAPI, WebSocket, WebSocketDisconnect\nfrom dataclasses import dataclass, field\n\napp = FastAPI()\n\n@dataclass\nclass ConnectionManager:\n    rooms: dict[str, list[WebSocket]] = field(default_factory=dict)\n\n    async def connect(self, ws: WebSocket, room: str):\n        await ws.accept()\n        self.rooms.setdefault(room, []).append(ws)\n\n    def disconnect(self, ws: WebSocket, room: str):\n        self.rooms[room].remove(ws)\n\n    async def broadcast(self, message: str, room: str):\n        for ws in self.rooms.get(room, []):\n            await ws.send_text(message)\n\nmanager = ConnectionManager()\n\n@app.websocket("/ws/{room}")\nasync def websocket_endpoint(ws: WebSocket, room: str):\n    await manager.connect(ws, room)\n    try:\n        while True:\n            data = await ws.receive_text()\n            await manager.broadcast(f"[{room}] {data}", room)\n    except WebSocketDisconnect:\n        manager.disconnect(ws, room)'
  },
  "Server-Sent Events StreamingResponse LLM token streams": {
    why: "LLM APIs generate tokens over seconds; waiting for the full response creates terrible UX. SSE streams tokens as they are generated, letting the frontend display text progressively.",
    code: 'from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\nimport asyncio, json\n\napp = FastAPI()\n\nasync def llm_stream(prompt: str):\n    tokens = ["The", " answer", " is", " 42", ".", " Hope", " that", " helps!"]\n    for i, token in enumerate(tokens):\n        await asyncio.sleep(0.15)\n        chunk = json.dumps({"delta": token, "index": i})\n        yield f"data: {chunk}\\\\n\\\\n"\n    yield "data: [DONE]\\\\n\\\\n"\n\n@app.get("/chat/stream")\nasync def chat_stream(q: str = "What is 6*7?"):\n    return StreamingResponse(llm_stream(q),\n        media_type="text/event-stream",\n        headers={"Cache-Control": "no-cache"})'
  },
  "Settings pydantic-settings env/.env 12-factor": {
    why: "Hardcoded secrets are a security disaster and make deployment impossible across environments. Pydantic-settings validates your .env file at startup, catching missing variables before serving traffic.",
    code: 'from pydantic_settings import BaseSettings\nfrom functools import lru_cache\n\nclass Settings(BaseSettings):\n    app_name: str = "MyAPI"\n    debug: bool = False\n    database_url: str\n    redis_url: str = "redis://localhost:6379"\n    secret_key: str  # required - server wont start without it\n\n    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}\n\n@lru_cache\ndef get_settings() -> Settings:\n    return Settings()'
  },
  "Async SQLAlchemy 2.0 sessions asyncpg pooling": {
    why: "Synchronous database calls block the async event loop, killing throughput. Async SQLAlchemy with asyncpg lets each request hold a connection only during the actual query.",
    code: 'from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\n\nengine = create_async_engine("postgresql+asyncpg://user:pass@localhost/mydb",\n                              pool_size=10, max_overflow=20)\nasync_session = async_sessionmaker(engine, class_=AsyncSession)\n\nclass Base(DeclarativeBase): pass\n\nclass User(Base):\n    __tablename__ = "users"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str]\n\nasync def create_user(name: str) -> User:\n    async with async_session() as session:\n        user = User(name=name)\n        session.add(user)\n        await session.commit()\n        await session.refresh(user)\n        return user'
  },
  "File uploads UploadFile streaming spooled temp files": {
    why: "UploadFile streams large files to disk instead of loading them into memory, preventing OOM crashes. Without streaming, 10 concurrent 500MB uploads kill your server instantly.",
    code: 'from fastapi import FastAPI, UploadFile, File\nimport aiofiles, hashlib\n\napp = FastAPI()\n\n@app.post("/upload")\nasync def upload_file(file: UploadFile = File(...)):\n    hasher = hashlib.sha256()\n    size = 0\n    async with aiofiles.open(f"uploads/{file.filename}", "wb") as out:\n        while chunk := await file.read(8192):\n            await out.write(chunk)\n            hasher.update(chunk)\n            size += len(chunk)\n    return {"filename": file.filename, "size_bytes": size, "sha256": hasher.hexdigest()}'
  },
  "StaticFiles mounting SPA serving fallback": {
    why: "Serving a React SPA from FastAPI means your frontend builds into one directory. Without index.html fallback, deep-linking to /dashboard/abc returns 404 instead of your app.",
    code: 'from fastapi import FastAPI\nfrom fastapi.staticfiles import StaticFiles\nfrom fastapi.responses import FileResponse\n\napp = FastAPI()\n\n@app.get("/api/health")\nasync def health():\n    return {"status": "ok"}\n\napp.mount("/assets", StaticFiles(directory="dist/assets"), name="static")\n\n@app.get("/{full_path:path}")\nasync def spa_fallback(full_path: str):\n    return FileResponse("dist/index.html")'
  },
  "Error handlers custom JSON problem-details RFC7807": {
    why: "Default error responses do not follow RFC 7807, making it harder for clients to handle errors programmatically. Custom handlers ensure consistent error shapes with trace IDs.",
    code: 'from fastapi import FastAPI, Request\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\nclass AppError(Exception):\n    def __init__(self, status, title, detail, type_uri="about:blank"):\n        self.status, self.title, self.detail, self.type_uri = status, title, detail, type_uri\n\n@app.exception_handler(AppError)\nasync def app_error_handler(request: Request, exc: AppError):\n    return JSONResponse(status_code=exc.status, content={\n        "type": exc.type_uri, "title": exc.title,\n        "detail": exc.detail, "instance": str(request.url),\n    })\n\n@app.get("/items/{item_id}")\nasync def get_item(item_id: int):\n    if item_id > 100:\n        raise AppError(404, "Not Found", f"Item {item_id} does not exist")\n    return {"id": item_id}'
  },
  "TestClient/AsyncClient fixture app testing auth overrides": {
    why: "Without dependency overrides, testing authenticated endpoints requires a real auth server. TestClient and AsyncClient hit endpoints in-process with zero network overhead.",
    code: 'import pytest\nfrom httpx import AsyncClient, ASGITransport\nfrom fastapi import FastAPI, Depends\n\napp = FastAPI()\n\ndef get_user():\n    return {"id": 1, "name": "RealUser"}\n\n@app.get("/me")\nasync def me(user=Depends(get_user)):\n    return user\n\ndef fake_user():\n    return {"id": 99, "name": "TestUser"}\n\n@pytest.fixture\nasync def client():\n    app.dependency_overrides[get_user] = fake_user\n    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:\n        yield ac\n    app.dependency_overrides.clear()\n\n@pytest.mark.anyio\nasync def test_me_returns_fake_user(client):\n    resp = await client.get("/me")\n    assert resp.json()["name"] == "TestUser"'
  },
  "OpenAPI customization versioning servers security schemes": {
    why: "Out-of-the-box OpenAPI docs use localhost URLs and have no auth info. Customizing servers, versioning, and security schemes tells API consumers exactly how to authenticate.",
    code: 'from fastapi import FastAPI\n\napp = FastAPI(\n    title="Order Service", version="2.1.0",\n    servers=[\n        {"url": "https://api.example.com/v2", "description": "Production"},\n        {"url": "http://localhost:8000", "description": "Local dev"},\n    ],\n    openapi_tags=[{"name": "orders", "description": "Order CRUD"}],\n)\n\napp.openapi_schema["components"]["securitySchemes"] = {\n    "bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"},\n}\napp.openapi_schema["security"] = [{"bearerAuth": []}]'
  },

  "JSX rules className fragments keys stability": {
    why: "JSX compiles to JavaScript, not HTML. Using class instead of className crashes. Without stable keys, React cannot track list items correctly, causing UI bugs like inputs losing focus.",
    code: 'function UserList({ users }) {\n  return (\n    <>\n      <h2>Team Members</h2>\n      <ul>\n        {users.map((user) => (\n          <li key={user.id}>\n            <span className="name">{user.name}</span>\n            <span className="role">{user.role}</span>\n          </li>\n        ))}\n      </ul>\n    </>\n  );\n}'
  },
  "Props immutability one-way data flow discipline": {
    why: "React re-renders by comparing old and new props. If you mutate a prop object directly, React cannot detect the change. One-way data flow makes your app predictable.",
    code: 'function TodoItem({ todo, onToggle }) {\n  return (\n    <li onClick={() => onToggle({ ...todo, done: !todo.done })}>\n      <input type="checkbox" checked={todo.done} readOnly />\n      {todo.title}\n    </li>\n  );\n}\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([{ id: 1, title: "Learn React", done: false }]);\n  const toggleTodo = (updated) => {\n    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));\n  };\n  return todos.map((t) => <TodoItem key={t.id} todo={t} onToggle={toggleTodo} />);\n}'
  },
  "useState updater fn setS(s=>s+1) batch semantics": {
    why: "Without functional updates, calling setState multiple times uses a stale closure. React 18+ batches state updates automatically, so functional updates are essential for correct multi-step state changes.",
    code: 'function Counter() {\n  const [count, setCount] = useState(0);\n  const bad = () => {\n    setCount(count + 1); // stale: 0+1=1\n    setCount(count + 1); // stale: 0+1=1 - still 1!\n  };\n  const good = () => {\n    setCount((c) => c + 1); // 0->1\n    setCount((c) => c + 1); // 1->2 - correct!\n  };\n  return <button onClick={good}>Count: {count}</button>;\n}'
  },
  "Controlled inputs forms value+onChange pairs": {
    why: "Controlled inputs let React be the single source of truth for form state, enabling instant validation and conditional submission. Uncontrolled inputs bypass React entirely.",
    code: 'function SignupForm() {\n  const [form, setForm] = useState({ email: "", password: "" });\n  const [errors, setErrors] = useState({});\n  const update = (field) => (e) =>\n    setForm((prev) => ({ ...prev, [field]: e.target.value }));\n  const validate = () => {\n    const errs = {};\n    if (!form.email.includes("@")) errs.email = "Invalid email";\n    if (form.password.length < 8) errs.password = "Min 8 characters";\n    setErrors(errs);\n    return Object.keys(errs).length === 0;\n  };\n  return (\n    <form onSubmit={(e) => { e.preventDefault(); if (validate()) submitToApi(form); }}>\n      <input value={form.email} onChange={update("email")} />\n      {errors.email && <span className="error">{errors.email}</span>}\n      <input type="password" value={form.password} onChange={update("password")} />\n      {errors.password && <span className="error">{errors.password}</span>}\n      <button type="submit">Sign Up</button>\n    </form>\n  );\n}'
  },
  "Lifting state up shared ownership minimal common ancestor": {
    why: "When two sibling components need to share state, lifting it to their closest common parent keeps data synchronized. Forgetting this leads to duplicated state and desynchronization bugs.",
    code: 'function TemperatureConverter() {\n  const [celsius, setCelsius] = useState("");\n  const fahrenheit = celsius ? (parseFloat(celsius) * 9) / 5 + 32 : "";\n  return (\n    <div>\n      <TemperatureInput scale="Celsius" value={celsius} onChange={setCelsius} />\n      <TemperatureInput scale="Fahrenheit" value={fahrenheit} onChange={setFahrenheit} />\n    </div>\n  );\n}\nfunction TemperatureInput({ scale, value, onChange }) {\n  return (\n    <fieldset>\n      <legend>Enter {scale}:</legend>\n      <input value={value} onChange={(e) => onChange(e.target.value)} />\n    </fieldset>\n  );\n}'
  },
  "Composition children slots over inheritance always": {
    why: "React has no inheritance model. Composition with children and render props gives you all the flexibility of inheritance without the coupling.",
    code: 'function Card({ children, className = "" }) {\n  return <div className={`card ${className}`}>{children}</div>;\n}\nfunction PageLayout({ sidebar, children }) {\n  return (\n    <div className="layout">\n      <aside className="sidebar">{sidebar}</aside>\n      <main className="content">{children}</main>\n    </div>\n  );\n}\nfunction Dashboard() {\n  return (\n    <PageLayout sidebar={<NavMenu />}>\n      <Card className="wide"><h1>Dashboard</h1><StatsWidget /></Card>\n      <Card><RecentActivity /></Card>\n    </PageLayout>\n  );\n}'
  },
  "Lists & keys reconciliation index-keys pitfall": {
    why: "React uses keys to match old DOM nodes with new ones. Using array index as key breaks when items are reordered or deleted, causing inputs to show wrong values.",
    code: 'function TodoList({ todos, onDelete }) {\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <TodoItem key={todo.id} todo={todo} onDelete={() => onDelete(todo.id)} />\n      ))}\n    </ul>\n  );\n}\n// With index keys: React thinks item 2->3, item 1->2 (mismatched DOM reuse)\n// With id keys: React knows exactly which DOM node to remove'
  },
  "useReducer complex state machines actions typed": {
    why: "useState gets messy with 5+ related state variables. useReducer centralizes state transitions in pure functions, making impossible states impossible and complex logic testable.",
    code: 'const initialState = { items: [], loading: false, error: null };\nfunction reducer(state, action) {\n  switch (action.type) {\n    case "FETCH_START": return { ...state, loading: true, error: null };\n    case "FETCH_SUCCESS": return { ...state, loading: false, items: action.payload };\n    case "FETCH_ERROR": return { ...state, loading: false, error: action.payload };\n    case "ADD_ITEM": return { ...state, items: [...state.items, action.payload] };\n    case "REMOVE_ITEM": return { ...state, items: state.items.filter((i) => i.id !== action.id) };\n    default: throw new Error(`Unknown action: ${action.type}`);\n  }\n}'
  },
  "useContext provider drilling cure re-render costs note": {
    why: "Passing props through 5+ layers is verbose and fragile. useContext provides values to any depth, but every consumer re-renders when the provider value changes.",
    code: 'const AuthContext = createContext(null);\nfunction AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const login = (credentials) => fetch("/api/login", { method: "POST", body: JSON.stringify(credentials) })\n    .then((r) => r.json()).then(setUser);\n  const logout = () => setUser(null);\n  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;\n}\nfunction DeepChild() {\n  const { user } = useContext(AuthContext);\n  return <div>{user?.name ?? "Guest"}</div>;\n}'
  },
  "Custom hooks extracting logic useFetch/useDebounce/useLocalStorage": {
    why: "Custom hooks extract component logic into reusable functions, eliminating copy-paste. A custom useFetch hook encapsulates loading/error/data states so every fetching component has identical behavior.",
    code: 'function useFetch(url, options = {}) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n  useEffect(() => {\n    const controller = new AbortController();\n    setLoading(true);\n    fetch(url, { ...options, signal: controller.signal })\n      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })\n      .then(setData)\n      .catch((e) => { if (e.name !== "AbortError") setError(e); })\n      .finally(() => setLoading(false));\n    return () => controller.abort();\n  }, [url]);\n  return { data, loading, error };\n}'
  },
  "useRef DOM handles mutable boxes no re-render": {
    why: "useRef stores mutable values that persist across renders without triggering re-renders. Perfect for timer IDs, previous values, and direct DOM access.",
    code: 'function Stopwatch() {\n  const [elapsed, setElapsed] = useState(0);\n  const intervalRef = useRef(null);\n  const start = () => {\n    if (intervalRef.current) return;\n    const start_time = Date.now() - elapsed;\n    intervalRef.current = setInterval(() => setElapsed(Date.now() - start_time), 10);\n  };\n  const stop = () => { clearInterval(intervalRef.current); intervalRef.current = null; };\n  const reset = () => { stop(); setElapsed(0); };\n  useEffect(() => () => clearInterval(intervalRef.current), []);\n  return (\n    <div>\n      <span>{(elapsed / 1000).toFixed(2)}s</span>\n      <button onClick={start}>Start</button>\n      <button onClick={stop}>Stop</button>\n      <button onClick={reset}>Reset</button>\n    </div>\n  );\n}'
  },
  "useEffect lifecycle deps cleanup abort fetch race fix": {
    why: "Without cleanup, useEffect leaks subscriptions and aborts stale requests. The cleanup function prevents memory leaks and race conditions where an old response overwrites a newer one.",
    code: 'function SearchResults({ query }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    if (!query) return setResults([]);\n    const controller = new AbortController();\n    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })\n      .then((r) => r.json()).then(setResults)\n      .catch((e) => { if (e.name !== "AbortError") console.error(e); });\n    return () => controller.abort();\n  }, [query]);\n  return results.map((r) => <Result key={r.id} {...r} />);\n}'
  },
  "useMemo/useCallback referential equality memoized children": {
    why: "Without useMemo/useCallback, functions and objects are recreated every render, breaking React.memo and causing unnecessary re-renders. This is the #1 performance issue in medium React apps.",
    code: 'const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {\n  return items.map((item) => (\n    <div key={item.id} onClick={() => onSelect(item.id)}>{item.name}</div>\n  ));\n});\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  const items = useMemo(\n    () => Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` })), []);\n  const handleSelect = useCallback((id) => console.log(id), []);\n  return (\n    <div>\n      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>\n      <ExpensiveList items={items} onSelect={handleSelect} />\n    </div>\n  );\n}'
  },
  "React.memo pure components props compare shallow": {
    why: "React.memo skips re-rendering when props haven't changed via shallow comparison. Without it, parent re-renders cascade to every child, even if the child's data is identical.",
    code: 'const MemoizedRow = React.memo(function Row({ name, score, onEdit }) {\n  return (\n    <tr><td>{name}</td><td>{score}</td>\n      <td><button onClick={() => onEdit(name)}>Edit</button></td></tr>\n  );\n});\nfunction Leaderboard({ players, onEditPlayer }) {\n  return (\n    <table><tbody>\n      {players.map((p) => (\n        <MemoizedRow key={p.id} name={p.name} score={p.score} onEdit={onEditPlayer} />\n      ))}\n    </tbody></table>\n  );\n}'
  },
  "Error boundaries class or library recovery UI": {
    why: "Without error boundaries, a single JavaScript error crashes the entire app. Error boundaries catch render errors and show fallback UI, keeping the rest functional.",
    code: 'class ErrorBoundary extends React.Component {\n  state = { hasError: false, error: null };\n  static getDerivedStateFromError(error) { return { hasError: true, error }; }\n  componentDidCatch(error, info) { console.error("ErrorBoundary caught:", error); }\n  render() {\n    if (this.state.hasError) {\n      return (<div className="error-fallback"><h2>Something went wrong</h2>\n        <p>{this.state.error?.message}</p>\n        <button onClick={() => this.setState({ hasError: false })}>Try again</button></div>);\n    }\n    return this.props.children;\n  }\n}'
  },
  "Suspense streaming ready loading states": {
    why: "Suspense lets components pause rendering while waiting for async data, showing a fallback UI automatically. Without it, every component needs its own loading state.",
    code: 'import { Suspense } from "react";\nconst UserProfile = lazy(() => import("./UserProfile"));\nfunction App() {\n  return (\n    <Layout>\n      <Suspense fallback={<Skeleton />}><UserProfile /></Suspense>\n      <Suspense fallback={<p>Loading dashboard...</p>}><Dashboard /></Suspense>\n    </Layout>\n  );\n}'
  },
  "Portals modals outside DOM hierarchy stacking": {
    why: "Modals inside a component inherit parent z-index and overflow constraints. Portals render into a different DOM node, solving z-index stacking and click-outside behavior.",
    code: 'function Modal({ isOpen, onClose, children }) {\n  if (!isOpen) return null;\n  return createPortal(\n    <div className="modal-overlay" onClick={onClose}>\n      <div className="modal-content" onClick={(e) => e.stopPropagation()}>\n        <button className="close" onClick={onClose}>&times;</button>\n        {children}\n      </div>\n    </div>, document.body\n  );\n}'
  },
  "Context+reducer mini global store pattern": {
    why: "For small-to-medium apps, Context + useReducer gives you 80% of Redux with zero dependencies. Full Redux is overkill for apps with 5-10 state variables.",
    code: 'const StoreContext = createContext(null);\nfunction storeReducer(state, action) {\n  switch (action.type) {\n    case "ADD_TODO": return { ...state, todos: [...state.todos, { id: Date.now(), text: action.text, done: false }] };\n    case "TOGGLE_TODO": return { ...state, todos: state.todos.map((t) => t.id === action.id ? { ...t, done: !t.done } : t) };\n    case "FILTER": return { ...state, filter: action.filter };\n    default: return state;\n  }\n}\nfunction StoreProvider({ children }) {\n  const [state, dispatch] = useReducer(storeReducer, { todos: [], filter: "all" });\n  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;\n}\nconst useStore = () => useContext(StoreContext);'
  },
  "TanStack Query server-state caching retries invalidation": {
    why: "Without a server-state cache, every navigation re-fetches data. TanStack Query caches responses, deduplicates simultaneous requests, auto-retries failures, and refetches on window focus.",
    code: 'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";\nfunction useTodos() {\n  return useQuery({\n    queryKey: ["todos"],\n    queryFn: async () => { const res = await fetch("/api/todos"); if (!res.ok) throw new Error("Failed"); return res.json(); },\n    staleTime: 30_000, retry: 2,\n  });\n}\nfunction useAddTodo() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: (newTodo) => fetch("/api/todos", { method: "POST", body: JSON.stringify(newTodo) }).then((r) => r.json()),\n    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),\n  });\n}'
  },
  "Zustand/Redux slices selectors devtools comparison": {
    why: "Zustand gives you a minimal store with no boilerplate. Redux requires actions, reducers, dispatchers, and selectors. For most apps under 50 components, Zustand is simpler and faster.",
    code: 'import { create } from "zustand";\nconst useTodoStore = create((set, get) => ({\n  todos: [],\n  addTodo: (text) => set((s) => ({ todos: [...s.todos, { id: Date.now(), text, done: false }] })),\n  toggleTodo: (id) => set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),\n  completedCount: () => get().todos.filter((t) => t.done).length,\n}));\nfunction TodoApp() {\n  const todos = useTodoStore((s) => s.todos);\n  const add = useTodoStore((s) => s.addTodo);\n  return (\n    <div>\n      {todos.map((t) => <TodoItem key={t.id} todo={t} />)}\n      <button onClick={() => add("New task")}>Add</button>\n    </div>\n  );\n}'
  },
  "Router v6 loaders nested routes outlets params": {
    why: "React Router v6 loaders fetch data before rendering, eliminating loading spinners inside components. Nested routes with outlets share layouts without manual wrapping.",
    code: 'import { createBrowserRouter, RouterProvider, Outlet, useLoaderData, Link } from "react-router-dom";\nfunction Layout() {\n  return (<div>\n    <nav><Link to="/dashboard">Dashboard</Link> <Link to="/settings">Settings</Link></nav>\n    <Outlet />\n  </div>);\n}\nfunction Dashboard() {\n  const stats = useLoaderData();\n  return <h1>Users: {stats.userCount}</h1>;\n}\nasync function dashboardLoader() { return (await fetch("/api/stats")).json(); }\nconst router = createBrowserRouter([\n  { path: "/", element: <Layout />, children: [\n    { path: "dashboard", element: <Dashboard />, loader: dashboardLoader },\n    { path: "settings", element: <Settings /> },\n  ]},\n]);\nfunction App() { return <RouterProvider router={router} />; }'
  },
  "React Hook Form zod validation perf forms": {
    why: "React Hook Form uses uncontrolled inputs with refs, so typing does not trigger re-renders. Combined with Zod, you get type-safe validation that is 10x faster than controlled form libraries.",
    code: 'import { useForm } from "react-hook-form";\nimport { zodResolver } from "@hookform/resolvers/zod";\nimport { z } from "zod";\nconst schema = z.object({\n  name: z.string().min(1, "Name is required").max(100),\n  email: z.string().email("Invalid email"),\n  password: z.string().min(8, "Min 8 characters"),\n});\nfunction SignupForm() {\n  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });\n  return (\n    <form onSubmit={handleSubmit(async (data) => { await fetch("/api/signup", { method: "POST", body: JSON.stringify(data) }); })}>\n      <input {...register("name")} placeholder="Name" />\n      {errors.name && <span>{errors.name.message}</span>}\n      <input {...register("email")} placeholder="Email" />\n      {errors.email && <span>{errors.email.message}</span>}\n      <input {...register("password")} type="password" />\n      {errors.password && <span>{errors.password.message}</span>}\n      <button disabled={isSubmitting}>Sign Up</button>\n    </form>\n  );\n}'
  },
  "Accessibility semantic HTML aria labels keyboard paths": {
    why: "Without accessibility attributes, your app is unusable for keyboard-only and screen reader users. Semantic HTML and ARIA labels are also a legal requirement in many jurisdictions.",
    code: 'function AccessibleNav({ items }) {\n  return (\n    <nav aria-label="Main navigation">\n      <ul role="menubar">\n        {items.map((item) => (\n          <li key={item.id} role="none">\n            <a href={item.href} role="menuitem" aria-current={item.active ? "page" : undefined}>\n              {item.label}\n            </a>\n          </li>\n        ))}\n      </ul>\n    </nav>\n  );\n}'
  },
  "Vite tooling HMR env import.meta.env proxies": {
    why: "Vite HMR updates CSS and React components in milliseconds without full page reloads. Without proxy setup, API calls from the dev server hit CORS errors.",
    code: '// vite.config.js\nimport { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: { "/api": { target: "http://localhost:8000", changeOrigin: true } },\n  },\n});\nconst apiUrl = import.meta.env.VITE_API_URL || "/api";'
  },
  "Testing Library query priority userEvent fake timers": {
    why: "Testing Library enforces querying by what users see, not implementation details. getByRole over getByTestId ensures tests verify accessibility. fake timers prevent flaky tests.",
    code: 'import { render, screen } from "@testing-library/react";\nimport userEvent from "@testing-library/user-event";\ndescribe("Counter", () => {\n  it("increments on click", async () => {\n    const user = userEvent.setup();\n    render(<Counter />);\n    expect(screen.getByText("Count: 0")).toBeInTheDocument();\n    await user.click(screen.getByRole("button", { name: /increment/i }));\n    expect(screen.getByText("Count: 1")).toBeInTheDocument();\n  });\n});'
  },
  // --- NextJS topics ---
  "Server Components default zero-JS data-close fetching": {
    why: "Server Components run on the server and ship zero JavaScript to the client. Without use client, your component dependencies and data-fetching stay server-side, reducing bundle size.",
    code: '// app/dashboard/page.tsx - Server Component (no "use client")\nimport { db } from "@/lib/database";\nasync function getStats() {\n  const [users, orders] = await Promise.all([\n    db.user.count(),\n    db.order.aggregate({ _sum: { total: true } }),\n  ]);\n  return { userCount: users, revenue: orders._sum.total ?? 0 };\n}\nexport default async function DashboardPage() {\n  const stats = await getStats();\n  return (<main><h1>Dashboard</h1><p>Users: {stats.userCount}</p><p>Revenue: ${stats.revenue.toLocaleString()}</p></main>);\n}'
  },
  "'use client' boundary smallest possible islands interactivity": {
    why: "Every 'use client' adds that component and its imports to the client bundle. Marking a layout as 'use client' makes your entire app client-rendered. Use the smallest possible island.",
    code: '// app/LikeButton.tsx - Client Component (tiny island)\n"use client";\nimport { useState } from "react";\nexport function LikeButton({ productId }) {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(!liked)}>{liked ? "heart" : "no-heart"} Like</button>;\n}\n// Product data stays server-rendered; only the button is client JS'
  },
  "async/await in RSC direct DB/API calls no useEffect needed": {
    why: "Server Components can directly await async operations without useEffect, loading states, or client-side fetching. This eliminates waterfalls where useEffect triggers more useEffect calls.",
    code: '// app/products/[id]/page.tsx\nimport { db } from "@/lib/database";\nimport { notFound } from "next/navigation";\nexport default async function ProductPage({ params }) {\n  const product = await db.product.findUnique({\n    where: { id: params.id },\n    include: { reviews: { take: 5, orderBy: { createdAt: "desc" } } },\n  });\n  if (!product) notFound();\n  return (<article><h1>{product.name}</h1><p>{product.description}</p><Reviews productId={product.id} /></article>);\n}'
  },
  "fetch caching defaults force-cache/no-store/revalidate tags": {
    why: "Next.js caches fetch responses by default. Without understanding caching directives, data may be stale for days, or you may accidentally disable caching and kill performance.",
    code: 'const cached = await fetch("https://api.example.com/products"); // cached forever\nconst fresh = await fetch("https://api.example.com/stocks", { cache: "no-store" });\nconst revalidated = await fetch("https://api.example.com/prices", { next: { revalidate: 60 } });\nconst products = await fetch("https://api.example.com/products", { next: { tags: ["products"] } });\n// Later: revalidateTag("products") invalidates ALL fetches with this tag'
  },
  "revalidatePath/revalidateTag on-demand invalidation webhooks": {
    why: "Without on-demand revalidation, cached pages show stale data until the timer expires. Webhooks from your CMS can trigger instant revalidation so content changes appear immediately.",
    code: '// app/api/webhook/revalidate/route.ts\nimport { revalidateTag, revalidatePath } from "next/cache";\nimport { NextResponse } from "next/server";\nexport async function POST(request) {\n  const { secret, tag, path } = await request.json();\n  if (secret !== process.env.REVALIDATE_SECRET) {\n    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });\n  }\n  if (tag) revalidateTag(tag);\n  if (path) revalidatePath(path);\n  return NextResponse.json({ revalidated: true, now: Date.now() });\n}'
  },
  "Static vs dynamic rendering heuristics cookies/headers opt-out": {
    why: "Next.js statically renders pages by default. Using cookies() or headers() forces dynamic rendering. Not understanding this causes cache misses or stale data.",
    code: 'import { cookies } from "next/headers";\nexport default async function DashboardPage() {\n  const cookieStore = await cookies();\n  const session = cookieStore.get("session");\n  if (!session) redirect("/login");\n  const user = await db.user.findUnique({ where: { session: session.value } });\n  return <h1>Welcome, {user.name}</h1>;\n}\nexport const dynamic = "force-dynamic";'
  },
  "Streaming Suspense shells instant skeletons PPR future": {
    why: "Without Suspense streaming, the entire page waits for the slowest data fetch. Streaming sends fast parts instantly while slower parts load behind skeleton placeholders.",
    code: 'import { Suspense } from "react";\nexport default function DashboardPage() {\n  return (\n    <main>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<div className="skeleton">Loading stats...</div>}><Stats /></Suspense>\n      <Suspense fallback={<div className="skeleton">Loading orders...</div>}><RecentOrders /></Suspense>\n    </main>\n  );\n}'
  },
  "loading.tsx/error.tsx/not-found.tsx convention files UX": {
    why: "Convention files provide automatic loading and error states without wrapper code. Without them, every async component needs manual handling, creating inconsistent UX.",
    code: '// app/dashboard/loading.tsx\nexport default function Loading() { return <div className="animate-pulse">Loading dashboard...</div>; }\n// app/dashboard/error.tsx\n"use client";\nexport default function Error({ error, reset }) {\n  return (<div role="alert"><h2>Dashboard error</h2><p>{error.message}</p><button onClick={reset}>Try again</button></div>);\n}'
  },
  "Route handlers app/api GET/POST Response.json edge-ready": {
    why: "Route handlers replace API routes from Pages Router. They run on the Edge runtime by default. Without understanding this, you may use Node.js-only APIs that crash on Edge.",
    code: '// app/api/products/route.ts\nimport { NextResponse } from "next/server";\nimport { db } from "@/lib/database";\nexport async function GET(request) {\n  const { searchParams } = new URL(request.url);\n  const category = searchParams.get("category");\n  const products = await db.product.findMany({ where: category ? { category } : undefined, take: 50 });\n  return NextResponse.json(products);\n}\nexport async function POST(request) {\n  const body = await request.json();\n  const product = await db.product.create({ data: body });\n  return NextResponse.json(product, { status: 201 });\n}'
  },
  "Server Actions 'use server' mutations progressive enhancement": {
    why: "Server Actions eliminate manual API routes for mutations. They work without JavaScript - a form can submit even if JS fails to load, making your app more resilient.",
    code: '// app/todos/actions.ts\n"use server";\nimport { revalidatePath } from "next/cache";\nimport { db } from "@/lib/database";\nexport async function addTodo(formData) {\n  const title = formData.get("title");\n  if (!title) throw new Error("Title is required");\n  await db.todo.create({ data: { title } });\n  revalidatePath("/todos");\n}\n// app/todos/page.tsx\nimport { addTodo } from "./actions";\nexport default async function TodosPage() {\n  const todos = await db.todo.findMany();\n  return (<main><form action={addTodo}><input name="title" required /><button>Add Todo</button></form>\n    <ul>{todos.map((t) => <li key={t.id}>{t.title}</li>)}</ul></main>);\n}'
  },
  "middleware.ts redirects/auth gating matcher config": {
    why: "Middleware runs before the route renders, ideal for authentication checks. Without middleware, you need auth checks in every page component.",
    code: '// middleware.ts\nimport { NextResponse } from "next/server";\nimport { jwtVerify } from "jose";\nexport async function middleware(request) {\n  const token = request.cookies.get("session")?.value;\n  if (request.nextUrl.pathname.startsWith("/dashboard")) {\n    if (!token) return NextResponse.redirect(new URL("/login", request.url));\n    try { await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)); }\n    catch { return NextResponse.redirect(new URL("/login", request.url)); }\n  }\n  return NextResponse.next();\n}\nexport const config = { matcher: ["/dashboard/:path*", "/login"] };'
  },
  "layouts nested persist across navigations state preserved": {
    why: "Layouts persist across route navigations, so expensive components like maps and sidebars do not re-mount. Without layouts, every navigation unmounts and remounts the entire page.",
    code: '// app/dashboard/layout.tsx\nimport { Sidebar } from "./Sidebar";\nexport default function DashboardLayout({ children }) {\n  return (<div className="flex"><Sidebar /><main className="flex-1 p-6">{children}</main></div>);\n}'
  },
  "Parallel routes @slot dashboards independent loading": {
    why: "Parallel routes render multiple pages simultaneously in the same layout, each with its own loading state. Without them, you need complex conditional rendering.",
    code: '// app/dashboard/layout.tsx\nexport default function DashboardLayout({ children, analytics, team }) {\n  return (<div className="grid grid-cols-2 gap-4"><div>{analytics}</div><div>{team}</div></div>);\n}\n// Each slot loads independently - slow analytics does not block team list'
  },
  "Intercepting routes (.)modal-over-page patterns": {
    why: "Intercepting routes show a modal over the current page while the URL changes, maintaining deep-linkability. Without this, modals lose URL state.",
    code: '// app/feed/@modal/(.)feed/[id]/page.tsx\n"use client";\nimport { useRouter } from "next/navigation";\nexport default function PhotoModal({ params }) {\n  const router = useRouter();\n  return (\n    <div onClick={() => router.back()} className="modal-overlay">\n      <div className="modal" onClick={(e) => e.stopPropagation()}>\n        <img src={`/photos/${params.id}.jpg`} />\n        <button onClick={() => router.back()}>Close</button>\n      </div>\n    </div>\n  );\n}'
  },
  "Image component optimization sizes/priority CLS kill": {
    why: "next/image prevents layout shift by reserving space and lazy-loading automatically. Without sizes, the browser downloads full-resolution on mobile. Without priority, above-the-fold images load after below-the-fold.",
    code: 'import Image from "next/image";\n<Image src="/hero.jpg" alt="Product" width={1200} height={600} priority />\n<Image src={product.image} alt={product.name} width={400} height={300}\n  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />'
  },
  "next/font self-host zero-layout-shift typography": {
    why: "Google Fonts loaded via link cause layout shift. next/font downloads fonts at build time and self-hosts them, eliminating CLS from typography changes.",
    code: 'import { Inter, JetBrains_Mono } from "next/font/google";\nconst inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });\nconst mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });\nexport default function RootLayout({ children }) {\n  return (<html lang="en" className={`${inter.variable} ${mono.variable}`}>\n    <body className="font-sans">{children}</body></html>);\n}'
  },
  "Metadata API generateMetadata SEO per-route OG images": {
    why: "Without proper metadata, search engines cannot index pages correctly and social media links show blank previews. generateMetadata sets dynamic titles and OG images per route.",
    code: 'export async function generateMetadata({ params }) {\n  const product = await db.product.findUnique({ where: { id: params.id } });\n  return {\n    title: product.name, description: product.description.slice(0, 160),\n    openGraph: { title: product.name, description: product.description,\n      images: [{ url: product.image, width: 1200, height: 630 }] },\n  };\n}'
  },
  "ISR revalidate seconds scale static freshness blend": {
    why: "ISR serves static pages from CDN but revalidates periodically. Without ISR, you choose between fully static (stale) or fully dynamic (slow, expensive).",
    code: 'export const revalidate = 60;\nexport default async function ProductsPage() {\n  const products = await fetch("https://api.example.com/products", {\n    next: { revalidate: 60 },\n  }).then((r) => r.json());\n  return (<ul>{products.map((p) => <li key={p.id}>{p.name} - ${p.price}</li>)}</ul>);\n}'
  },
  "Auth patterns cookie sessions vs JWT middleware+layout guards": {
    why: "Without understanding cookie vs JWT tradeoffs, you may store JWTs in localStorage (XSS vulnerable) or use sessions without httpOnly. Middleware guards ensure no unauthenticated page renders.",
    code: 'import { NextResponse } from "next/server";\nimport { jwtVerify } from "jose";\nexport async function middleware(request) {\n  const token = request.cookies.get("session")?.value;\n  if (request.nextUrl.pathname.startsWith("/dashboard")) {\n    if (!token) return NextResponse.redirect(new URL("/login", request.url));\n    try { await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)); }\n    catch { return NextResponse.redirect(new URL("/login", request.url)); }\n  }\n  return NextResponse.next();\n}\nresponse.cookies.set("session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60 });'
  },
  "Env NEXT_PUBLIC_ prefix exposure discipline server secrets safe": {
    why: "Only variables prefixed with NEXT_PUBLIC_ are exposed to the client bundle. Accidentally putting API keys in client env vars leaks them to every user's browser.",
    code: '// .env.local\nDATABASE_URL=postgresql://user:pass@localhost/mydb   # server only\nAPI_SECRET=super-secret-key                          # server only\nNEXT_PUBLIC_API_URL=https://api.example.com           # exposed to client\n// const secret = process.env.API_SECRET;  // undefined on client!'
  },
  "Deployment standalone output Docker Vercel adapters": {
    why: "Without standalone output, Next.js requires the entire node_modules (1GB+ Docker images). Standalone mode produces a self-contained 30-50MB output.",
    code: '// next.config.js\nmodule.exports = { output: "standalone" };\n# Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/public ./public\nEXPOSE 3000\nCMD ["node", "server.js"]'
  },

  "ChatClient fluent builder prompt().user().call().content()": {
    why: "ChatClient's fluent API eliminates boilerplate for prompt construction, response parsing, and error handling. Without it, you manually build request objects and parse responses for every LLM provider.",
    code: 'import org.springframework.ai.chat.client.ChatClient;\n@Service\npublic class ChatService {\n    private final ChatClient chatClient;\n    public ChatService(ChatClient.Builder builder) {\n        this.chatClient = builder\n            .defaultSystem("You are a helpful assistant for Acme Corp.")\n            .defaultOptions(OpenAiChatOptions.builder().model("gpt-4o").build())\n            .build();\n    }\n    public String ask(String question) {\n        return chatClient.prompt().user(question).call().content();\n    }\n}'
  },
  "ChatModel abstraction OpenAI/Ollama/Azure starters swap-free": {
    why: "ChatModel lets you switch between OpenAI, Ollama, Azure, and other providers by changing a single property. Without this abstraction, switching providers requires rewriting all your LLM integration code.",
    code: '# application.yml - switch providers by changing config only\nspring:\n  ai:\n    openai:\n      api-key: ${OPENAI_API_KEY}\n      chat:\n        options:\n          model: gpt-4o\n          temperature: 0.7\n# Your Java code stays identical - ChatClient uses whichever provider is active'
  },
  "Prompt templates {} variables TemplateRenderer": {
    why: "Hardcoded prompts make it impossible to test, version, or reuse prompt logic. Prompt templates let you store prompts externally and test with different inputs.",
    code: 'import org.springframework.ai.chat.prompt.PromptTemplate;\npublic String explain(String topic, String audience) {\n    String template = "Explain {topic} to a {audience}. Use concrete examples.";\n    PromptTemplate pt = new PromptTemplate(template);\n    var prompt = pt.create(Map.of("topic", topic, "audience", audience));\n    return chatClient.prompt(prompt).call().content();\n}'
  },
  "System/default text per-client personas configured once": {
    why: "Without a system prompt, the LLM has no context about your domain, tone, or constraints. Setting it once on the builder ensures every request inherits the persona.",
    code: '@Bean\npublic ChatClient chatClient(ChatClient.Builder builder) {\n    return builder\n        .defaultSystem("You are a senior financial analyst at Acme Corp. Be concise.")\n        .defaultOptions(OpenAiChatOptions.builder().model("gpt-4o").temperature(0.3).build())\n        .build();\n}'
  },
  "Structured OutputConverter BeanOutputConverter records mapping": {
    why: "LLMs return free-form text that is hard to parse. Structured output forces the LLM to respond as JSON matching a Java record, giving you typed, validated data.",
    code: 'record StockAnalysis(String ticker, double currentPrice, String recommendation, double targetPrice, List<String> risks, int confidenceScore) {}\npublic StockAnalysis analyzeStock(String ticker, String news) {\n    var converter = new BeanOutputConverter<>(StockAnalysis.class);\n    return chat.prompt()\n        .system("Respond ONLY in valid JSON matching: " + converter.getSchema())\n        .user("Analyze {ticker} based on: {news}")\n        .call().entity(StockAnalysis.class);\n}'
  },
  "Advisors chain QuestionAnswererMessageChatMemoryAdvisor RAG plug-ins": {
    why: "Advisors are middleware for your LLM pipeline - they intercept requests to add RAG context, chat memory, logging, or guardrails. Without them, you manually inject context into every prompt.",
    code: 'this.chatClient = builder\n    .defaultSystem("Answer using ONLY the provided context.")\n    .defaultAdvisors(\n        new QuestionAnswerAdvisor(vectorStore),\n        new MessageChatMemoryAdvisor(new InMemoryChatMemory(), "session-123", 10)\n    )\n    .build();\n// Pipeline: retrieve docs (RAG) -> inject context -> add history -> LLM'
  },
  "Function calling @Tool beans FunctionCallback registry": {
    why: "Function calling lets the LLM invoke your Java methods when it determines they are needed. Without it, the LLM can only generate text about what it would do.",
    code: '@Tool(description = "Search available restaurant reservations")\npublic List<Booking> searchAvailable(\n        @ToolParam(description = "Date YYYY-MM-DD") String date,\n        @ToolParam(description = "Party size") int partySize) {\n    return repo.findAvailable(LocalDate.parse(date), partySize);\n}\n// chatClient.prompt().user(msg).tools(this).call().content() -> LLM calls searchAvailable'
  },
  "EmbeddingModel client dimensions batch embed": {
    why: "Embeddings convert text to vectors for semantic search. Without batch embedding, converting 10,000 documents one-by-one takes hours. EmbeddingModel handles batching and rate limits.",
    code: 'public float[] embed(String text) { return embeddingModel.embed(text); }\npublic List<float[]> embedBatch(List<String> texts) {\n    var request = new EmbeddingRequest(texts.stream().map(EmbeddingPrompt::new).toList(), null);\n    return embeddingModel.call(request).getResults().stream().map(Embedding::getOutput).toList();\n}\npublic int getDimensions() { return embeddingModel.dimensions(); }'
  },
  "VectorStore interface add/similaritySearch implementations galore": {
    why: "VectorStore provides a unified API for storing and searching embeddings across different backends. Switching from Pinecone to pgvector requires rewriting all search logic without this abstraction.",
    code: 'public void indexDocument(String id, String content, Map<String, Object> metadata) {\n    var doc = new Document(content, metadata); doc.setId(id);\n    vectorStore.add(List.of(doc));\n}\npublic List<Document> search(String query, int topK, double threshold) {\n    return vectorStore.similaritySearch(\n        SearchRequest.query(query).withTopK(topK).withSimilarityThreshold(threshold));\n}'
  },
  "PGVector/Redis/Pinecone/Milvus starters config properties": {
    why: "Different vector databases have vastly different performance characteristics. PGVector leverages existing Postgres; Pinecone is managed; Milvus scales to billions of vectors.",
    code: '# PGVector: spring.ai.vectorstore.pgvector.index-type=HNSW\n# Pinecone: spring.ai.vectorstore.pinecone.api-key=${PINECONE_API_KEY}\n# Application code is identical regardless of backend:\nvectorStore.add(List.of(new Document("content")));\nvectorStore.similaritySearch(SearchRequest.query("search term"));'
  },
  "ETL DocumentReader/Transformer/Writer PDF/Tika text-split pipeline": {
    why: "Raw documents cannot be directly embedded. The ETL pipeline reads diverse formats, splits them into embedding-sized chunks with overlap, and writes to vector stores.",
    code: 'public int ingestDocument(String filePath) {\n    var reader = new TikaDocumentReader(new FileSystemResource(filePath));\n    List<Document> rawDocs = reader.get();\n    List<Document> chunks = new TokenTextSplitter(200, 20, 5, 10000, true).apply(rawDocs);\n    chunks.forEach(doc -> doc.getMetadata().put("source", filePath));\n    vectorStore.add(chunks);\n    return chunks.size();\n}'
  },
  "RAG flow retrieval-augmentation advisor auto-inject context": {
    why: "Without RAG, LLMs hallucinate on your proprietary data. RAG retrieves relevant documents and injects them into the prompt, grounding responses in actual knowledge with source citations.",
    code: 'this.chatClient = builder\n    .defaultSystem("Answer ONLY based on provided context. Cite sources.")\n    .defaultAdvisors(new QuestionAnswerAdvisor(vectorStore,\n        SearchRequest.defaults().withTopK(5).withSimilarityThreshold(0.7)))\n    .build();\npublic String ask(String question) {\n    return chatClient.prompt().user(question).call().content();\n}'
  },
  "Chat memory MessageWindowChatMemory JDBC repository persistence": {
    why: "Without chat memory, every LLM request is stateless. InMemoryChatMemory works for demos; JDBC-backed memory persists conversations across restarts and supports multi-user sessions.",
    code: 'ChatMemory chatMemory = JdbcChatMemory.builder()\n    .dataSource(dataSource)\n    .chatConversationTable("chat_history")\n    .build();\nthis.chatClient = builder\n    .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory, "user-123", 20))\n    .build();\n// Conversation history is automatically loaded and injected per session'
  },
  "Observability micrometer traces metrics actuator endpoints": {
    why: "Without observability, you cannot diagnose why your AI service is slow. Micrometer traces show the full lifecycle (embed -> search -> LLM call), while actuator exposes health checks.",
    code: '# management.endpoints.web.exposure.include=health,metrics,prometheus\n# management.tracing.sampling.probability=1.0\n# Each trace shows:\n# /ai/ask -> [VectorSearch: 45ms] -> [LLM Call: 1.2s] -> [Total: 1.25s]'
  },
  "Evaluation ScoringModel/Re2E basics testing prompts JUnit style": {
    why: "Prompt engineering without evaluation is guesswork. Spring AI evaluation APIs let you systematically test prompts against golden datasets, measuring answer quality before production.",
    code: '@ParameterizedTest\n@CsvSource({"What is Spring AI?, Spring AI is a framework"})\nvoid shouldAnswerAccurately(String question, String expected) {\n    String response = chatClient.prompt().user(question).call().content();\n    var evaluator = new RelevancyEvaluator(chatClient);\n    var result = evaluator.evaluate(new EvaluationRequest(question, List.of(), response));\n    assertTrue(result.isPass());\n}'
  },
  "MCP client/server boot starters tools over stdio/SSE": {
    why: "MCP standardizes how AI tools communicate across languages. Without MCP, each tool integration is custom; with MCP, a Java tool server can be used by Python, TypeScript, or any MCP client.",
    code: '# spring.ai.mcp.client.stdio.servers.filesystem.command=npx\n@Tool(description = "Execute a read-only SQL query")\npublic List<Map<String, Object>> queryDatabase(\n        @ToolParam(description = "SQL query") String sql) {\n    if (sql.toLowerCase().contains("drop")) throw new IllegalArgumentException("Only SELECT allowed");\n    return jdbcTemplate.queryForList(sql);\n}'
  },
  // --- Graphics Engineering ---
  "Coordinate systems world/camera/NDC transforms chain": {
    why: "Every vertex passes through three coordinate spaces: world, camera, and NDC. Without understanding the transform chain, objects appear in wrong positions or are invisible.",
    code: 'import numpy as np\ndef look_at(eye, target, up):\n    forward = np.array(target) - np.array(eye)\n    forward /= np.linalg.norm(forward)\n    right = np.cross(forward, np.array(up))\n    right /= np.linalg.norm(right)\n    up = np.cross(right, forward)\n    return np.column_stack([right, up, -forward, -np.eye(4)[:3, 3]])\ndef world_to_screen(vertex, model, view, projection, width, height):\n    clip = projection @ view @ model @ np.array([*vertex, 1.0])\n    ndc = clip[:3] / clip[3]\n    return (ndc[0]+1)*width/2, (1-ndc[1])*height/2, ndc[2]'
  },
  "Matrices translation/rotation/scale order TRS pitfalls": {
    why: "Matrix multiplication order matters. Applying TRS in the wrong order produces shearing instead of rotation, and scaling before rotating changes the rotation axis.",
    code: 'import numpy as np\ndef translation_matrix(tx, ty, tz):\n    return np.array([[1,0,0,tx],[0,1,0,ty],[0,0,1,tz],[0,0,0,1]])\ndef rotation_z_matrix(angle_deg):\n    a = np.radians(angle_deg)\n    return np.array([[np.cos(a),-np.sin(a),0,0],[np.sin(a),np.cos(a),0,0],[0,0,1,0],[0,0,0,1]])\ndef scale_matrix(sx, sy, sz):\n    return np.diag([sx, sy, sz, 1])\n# CORRECT: Scale -> Rotate -> Translate (read right to left)\nmodel = translation_matrix(5,0,0) @ rotation_z_matrix(45) @ scale_matrix(2,2,2)'
  },
  "Projections orthographic vs perspective FOV/z-fighting near planes": {
    why: "Orthographic preserves parallel lines (CAD), while perspective mimics vision. Z-fighting happens when surfaces are too close for the depth buffer. Moving the near plane further out reduces this.",
    code: 'import numpy as np\ndef orthographic(left, right, bottom, top, near, far):\n    return np.array([[2/(right-left),0,0,-(right+left)/(right-left)],\n        [0,2/(top-bottom),0,-(top+bottom)/(top-bottom)],\n        [0,0,-2/(far-near),-(far+near)/(far-near)],[0,0,0,1]])\ndef perspective_projection(fov_y_deg, aspect, near, far):\n    f = 1.0 / np.tan(np.radians(fov_y_deg) / 2)\n    # near=0.001 causes z-fighting precision issues\n    return np.array([[f/aspect,0,0,0],[0,f,0,0],\n        [0,0,(far+near)/(near-far),2*far*near/(near-far)],[0,0,-1,0]])'
  },
  "Rasterization pipeline vertex\u2192frag interpolation stages": {
    why: "The GPU pipeline converts triangles to pixels in fixed stages: vertex shading, primitive assembly, rasterization, fragment shading. Understanding each stage is essential for writing shaders.",
    code: '# Stage 1: Vertex Shader - runs per vertex\ndef vertex_shader(vertex, mvp_matrix):\n    clip_pos = mvp_matrix @ [*vertex.position, 1.0]\n    return clip_pos[:2] / clip_pos[3], vertex.normal, vertex.uv\n# Stage 2: Primitive Assembly - clips triangles outside view frustum\n# Stage 3: Rasterization - determines which pixels are inside each triangle\ndef rasterize(v0, v1, v2, width, height):\n    for pixel in bounding_box(v0, v1, v2):\n        bary = compute_barycentric(pixel, v0, v1, v2)\n        if all(b >= 0 for b in bary): yield pixel, bary\n# Stage 4: Fragment Shader - runs per pixel\ndef fragment_shader(bary, v0_data, v1_data, v2_data):\n    uv = bary[0]*v0_data.uv + bary[1]*v1_data.uv + bary[2]*v2_data.uv\n    return sample_texture(uv)'
  },
  "Shaders GLSL vertex/fragment uniforms/varyings data flow": {
    why: "Shaders run on the GPU. Without understanding data flow from uniforms to vertex shader to varyings to fragment shader, your lighting and textures will be wrong.",
    code: '// Vertex Shader\n#version 330 core\nlayout(location = 0) in vec3 aPos;\nlayout(location = 1) in vec3 aNormal;\nuniform mat4 uModel, uView, uProjection;\nout vec3 vNormal, vFragPos;\nvoid main() {\n    vFragPos = vec3(uModel * vec4(aPos, 1.0));\n    vNormal = mat3(transpose(inverse(uModel))) * aNormal;\n    gl_Position = uProjection * uView * vec4(vFragPos, 1.0);\n}\n// Fragment Shader\n#version 330 core\nin vec3 vNormal, vFragPos;\nuniform vec3 uLightPos;\nout vec4 FragColor;\nvoid main() {\n    float diff = max(dot(normalize(vNormal), normalize(uLightPos - vFragPos)), 0.0);\n    FragColor = vec4(vec3(diff), 1.0);\n}'
  },
  "Buffers VBO/VAO/index buffers draw calls batching cost model": {
    why: "Each draw call sends geometry from CPU to GPU, which is expensive. Without batching and index buffers, you hit draw call limits and frame rate drops to single digits.",
    code: 'import numpy as np\nfrom OpenGL.GL import *\nvertices = np.array([-0.5,-0.5,0.0,0,0,1, 0.5,-0.5,0.0,0,0,1, 0.0,0.5,0.0,0,0,1], dtype=np.float32)\nvao = glGenVertexArrays(1)\nvbo = glGenBuffers(1)\nglBindVertexArray(vao)\nglBindBuffer(GL_ARRAY_BUFFER, vbo)\nglBufferData(GL_ARRAY_BUFFER, vertices.nbytes, vertices, GL_STATIC_DRAW)\nglVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 32, ctypes.c_void_p(0))\nglEnableVertexAttribArray(0)\nglDrawArrays(GL_TRIANGLES, 0, 3)  # 1 draw call renders the triangle'
  },
  "Textures UV mapping filtering mipmaps anisotropy": {
    why: "Textures without mipmaps cause aliasing at distance. Without anisotropic filtering, textures viewed at angles look blurry. Wrong UV coordinates map textures incorrectly.",
    code: 'from OpenGL.GL import *\ntex_id = glGenTextures(1)\nglBindTexture(GL_TEXTURE_2D, tex_id)\nglTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image)\nglGenerateMipmap(GL_TEXTURE_2D)  # pre-computed downsampled versions\nglTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR)\nglTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)\nmax_aniso = glGetFloatv(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT)\nglTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAX_ANISOTROPY_EXT, min(4.0, max_aniso))'
  },
  "Lighting Phong/Blinn-Phong/PBR metallic-roughness workflow": {
    why: "Without lighting, your 3D scene looks flat. Phong gives basic shading; Blinn-Phong is faster; PBR (metallic-roughness) is the modern standard for photorealistic rendering.",
    code: '// Blinn-Phong fragment shader\n#version 330 core\nin vec3 vNormal, vFragPos;\nuniform vec3 uLightPos, uViewPos, uLightColor, uObjectColor;\nuniform sampler2D uDiffuseMap;\nuniform float uShininess;\nout vec4 FragColor;\nvoid main() {\n    vec3 norm = normalize(vNormal);\n    vec3 lightDir = normalize(uLightPos - vFragPos);\n    vec3 viewDir = normalize(uViewPos - vFragPos);\n    vec3 halfDir = normalize(lightDir + viewDir);\n    float diff = max(dot(norm, lightDir), 0.0);\n    float spec = pow(max(dot(norm, halfDir), 0.0), uShininess);\n    vec3 ambient = 0.1 * uLightColor;\n    FragColor = vec4((ambient + diff*uLightColor + spec*uLightColor) * uObjectColor, 1.0);\n}'
  },
  "Color spaces sRGB vs linear gamma correctness blending artifacts": {
    why: "Blending in sRGB produces incorrect results - two half-bright lights add to white instead of being twice as bright. Linear space blending is physically correct.",
    code: '# In GLSL:\n# vec3 color = texture(uAlbedo, vTexCoord).rgb;\n# color = pow(color, vec3(2.2));  // sRGB -> linear\n# vec3 lit = computeLighting(color, normal, lightDir);\n# lit = pow(lit, vec3(1.0/2.2)); // linear -> sRGB\n# In OpenGL, use GL_SRGB8_ALPHA8 for automatic conversion'
  },
  "Depth/stencil tests transparency sorting back-to-front": {
    why: "Without depth testing, objects render in arbitrary order. Transparent objects cannot use depth writes, so they MUST be sorted back-to-front and rendered after opaque geometry.",
    code: 'from OpenGL.GL import *\nglEnable(GL_DEPTH_TEST)\nglDepthFunc(GL_LESS)\nglDepthMask(GL_TRUE)\nfor obj in opaque_objects: render(obj)  # any order is fine\nglDepthMask(GL_FALSE)  # transparent: no depth write\nglEnable(GL_BLEND)\nglBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)\ntransparent_objects.sort(key=lambda o: -distance_to_camera(o))\nfor obj in transparent_objects: render(obj)\nglDepthMask(GL_TRUE)'
  },
  "Frame pacing delta-time physics decoupling fixed timestep": {
    why: "Without delta-time, physics runs faster on 120Hz monitors and slower on 30fps devices. Fixed timestep decouples physics from rendering for consistent behavior.",
    code: 'import time\nclass FixedTimestep:\n    def __init__(self, fixed_dt=1/60):\n        self.fixed_dt, self.accumulator, self.last = fixed_dt, 0.0, time.perf_counter()\n    def update(self, physics_update, render):\n        now = time.perf_counter()\n        self.accumulator += min(now - self.last, 0.25)\n        self.last = now\n        while self.accumulator >= self.fixed_dt:\n            physics_update(self.fixed_dt)  # always same dt -> deterministic\n            self.accumulator -= self.fixed_dt\n        render(self.accumulator / self.fixed_dt)  # alpha for interpolation'
  },
  "Ray tracing ray-sphere/triangle intersections Whitted intro": {
    why: "Ray tracing simulates light paths for realistic reflections, refractions, and shadows. Every visual effect builds on knowing where a ray hits a surface.",
    code: 'import numpy as np\ndef ray_sphere_intersect(ray_origin, ray_dir, center, radius):\n    oc = ray_origin - center\n    a = np.dot(ray_dir, ray_dir)\n    b = 2.0 * np.dot(oc, ray_dir)\n    c = np.dot(oc, oc) - radius ** 2\n    discriminant = b * b - 4 * a * c\n    if discriminant < 0: return None\n    t = (-b - np.sqrt(discriminant)) / (2.0 * a)\n    if t < 0: t = (-b + np.sqrt(discriminant)) / (2.0 * a)\n    if t < 0: return None\n    hit = ray_origin + t * ray_dir\n    return hit, (hit - center) / radius, t'
  },
  "LOD & culling frustum/occlusion performance survival kit": {
    why: "Rendering all objects at full detail wastes GPU work. LOD reduces polygon count for distant objects. Frustum culling skips objects outside camera view. Together they 10x frame rate.",
    code: 'def frustum_cull(self, camera_frustum):\n    return [obj for obj in self.objects if camera_frustum.intersects(obj.bounding_sphere)]\ndef select_lod(self, obj, cam_pos, distances=[10, 30, 80]):\n    dist = np.linalg.norm(obj.position - cam_pos)\n    if dist < distances[0]: return obj.mesh_high    # 10,000 tris\n    elif dist < distances[1]: return obj.mesh_medium  # 2,000 tris\n    elif dist < distances[2]: return obj.mesh_low     # 500 tris\n    else: return obj.mesh_billboard                   # 2 tris'
  },
  "pygame game loop events/draw/flip sprites groups collisions": {
    why: "Pygame provides the fastest path from Python to a playable game. Without a proper game loop (event->update->draw->flip), your game stutters, eats CPU, or ignores input.",
    code: 'import pygame, random, sys\nW, H = 800, 500\npygame.init()\nscreen = pygame.display.set_mode((W, H))\nclock = pygame.time.Clock()\nclass Ball:\n    def __init__(self):\n        self.r = random.randint(12, 26)\n        self.x = random.randint(self.r, W-self.r)\n        self.y = random.randint(self.r, H-self.r)\n        ang = random.uniform(0, 6.283)\n        speed = random.uniform(120, 260)\n        self.vx, self.vy = speed*random.cos(ang), speed*random.sin(ang)\n    def step(self, dt): self.x += self.vx*dt; self.y += self.vy*dt\n    def draw(self, surf): pygame.draw.circle(surf, (200,100,50), (int(self.x),int(self.y)), self.r)\nballs = [Ball() for _ in range(14)]\nwhile True:\n    dt = clock.tick(60) / 1000.0\n    for e in pygame.event.get():\n        if e.type == pygame.QUIT: sys.exit()\n    screen.fill((15, 18, 32))\n    for b in balls: b.step(dt); b.draw(screen)\n    pygame.display.flip()'
  },
  "matplotlib 3D surfaces/scatter wireframes publication figures": {
    why: "Matplotlib is the standard for scientific visualization and publication-quality figures. Required for ML loss landscape visualization and spatial data communication.",
    code: 'import numpy as np\nimport matplotlib.pyplot as plt\nx = np.linspace(-4, 4, 200)\nX, Y = np.meshgrid(x, x)\nZ = np.sinc(np.sqrt(X**2 + Y**2))\nfig = plt.figure(figsize=(11, 5))\nax1 = fig.add_subplot(121, projection="3d")\nax1.plot_surface(X, Y, Z, cmap="viridis", linewidth=0, antialiased=True)\nax2 = fig.add_subplot(122, projection="3d")\nax2.plot_wireframe(X[::8,::8], Y[::8,::8], Z[::8,::8], color="#7c3aed", linewidth=0.6)\nplt.savefig("surface.png", dpi=130)'
  },
  "plotly interactive 3D meshes camera controls export HTML": {
    why: "Matplotlib figures are static images. Plotly generates interactive 3D visualizations with zoom, rotate, and hover tooltips that embed in web apps for data dashboards.",
    code: 'import plotly.graph_objects as go\nimport numpy as np\nx = np.linspace(-5, 5, 50)\nX, Y = np.meshgrid(x, x)\nZ = np.sin(np.sqrt(X**2 + Y**2))\nfig = go.Figure(data=[go.Surface(x=x, y=x, z=Z, colorscale="Viridis")])\nfig.update_layout(title="Interactive 3D Surface", width=800, height=600)\nfig.write_html("surface_interactive.html")'
  },
  "OpenGL via PyModernGL raw GL pythonic buffers shaders": {
    why: "PyModernGL wraps OpenGL in Pythonic APIs while keeping full GPU access. Raw OpenGL in Python is verbose; PyModernGL eliminates boilerplate while preserving shader and buffer control.",
    code: 'import moderngl\nimport numpy as np\nctx = moderngl.create_standalone_context()\nprog = ctx.program(\n    vertex_shader="""#version 330\n    in vec2 in_vert; in vec3 in_color; out vec3 v_color;\n    void main() { gl_Position = vec4(in_vert, 0.0, 1.0); v_color = in_color; }""",\n    fragment_shader="""#version 330\n    in vec3 v_color; out vec4 fragColor;\n    void main() { fragColor = vec4(v_color, 1.0); }""",)\nvertices = np.array([-0.5,-0.5,1,0,0, 0.5,-0.5,0,1,0, 0.0,0.5,0,0,1], dtype="f4")\nvbo = ctx.buffer(vertices)\nvao = ctx.simple_vertex_array(prog, vbo, "in_vert", "in_color")\nfbo = ctx.simple_framebuffer((800, 600))\nfbo.use()\nfbo.clear(0.1, 0.1, 0.1)\nvao.render(moderngl.TRIANGLES)'
  },
  "Three.js scene/mesh/material/light renderer animation loop JS": {
    why: "Three.js is the dominant 3D library for the web. Without it, WebGL development requires hundreds of lines of boilerplate. Three.js provides materials, lights, cameras, and loaders out of the box.",
    code: 'import * as THREE from "three";\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias: true });\nrenderer.setSize(innerWidth, innerHeight);\ndocument.body.appendChild(renderer.domElement);\nconst geometry = new THREE.BoxGeometry(1, 1, 1);\nconst material = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.3, roughness: 0.7 });\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\nscene.add(new THREE.AmbientLight(0xffffff, 0.4));\ncamera.position.z = 3;\nfunction animate() {\n    requestAnimationFrame(animate);\n    cube.rotation.x += 0.01; cube.rotation.y += 0.01;\n    renderer.render(scene, camera);\n}\nanimate();'
  },
  "WebGL2 from scratch triangle program compile/link ceremony": {
    why: "Understanding raw WebGL2 teaches you what Three.js does under the hood. Without this knowledge, debugging shader compilation errors or optimizing draw calls is impossible.",
    code: 'const gl = document.getElementById("c").getContext("webgl2");\nconst vs = gl.createShader(gl.VERTEX_SHADER);\ngl.shaderSource(vs, `#version 300 es\nin vec2 aPosition; in vec3 aColor; out vec3 vColor;\nvoid main() { gl_Position = vec4(aPosition,0,1); vColor = aColor; }`);\ngl.compileShader(vs);\nconst fs = gl.createShader(gl.FRAGMENT_SHADER);\ngl.shaderSource(fs, `#version 300 es\nin vec3 vColor; out vec4 fragColor;\nvoid main() { fragColor = vec4(vColor,1); }`);\ngl.compileShader(fs);\nconst prog = gl.createProgram();\ngl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);\ngl.useProgram(prog);\nconst vbo = gl.createBuffer();\ngl.bindBuffer(gl.ARRAY_BUFFER, vbo);\ngl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5,-0.5,1,0,0, 0.5,-0.5,0,1,0, 0,0.5,0,0,1]), gl.STATIC_DRAW);\nconst posLoc = gl.getAttribLocation(prog,"aPosition");\ngl.enableVertexAttribArray(posLoc);\ngl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,20,0);\ngl.drawArrays(gl.TRIANGLES,0,3);'
  },
  "Canvas 2D paths/gradients/composites charts games light": {
    why: "Canvas 2D is the simplest graphics API in the browser - no shaders, no GPU setup, just immediate-mode drawing. Perfect for data visualizations, simple games, and animated backgrounds.",
    code: 'const canvas = document.getElementById("canvas");\nconst ctx = canvas.getContext("2d");\nconst gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 100);\ngradient.addColorStop(0, "#7c3aed");\ngradient.addColorStop(1, "#3b82f6");\nctx.beginPath();\nctx.arc(200, 200, 100, 0, Math.PI * 2);\nctx.fillStyle = gradient;\nctx.fill();'
  },
  "Manim math animations scenes transform explanations": {
    why: "Manim generates mathematical animations programmatically, creating visualizations popularized by 3Blue1Brown. Without it, explaining calculus or algorithms visually requires hours of After Effects work.",
    code: 'from manim import *\nclass FourierCircles(Scene):\n    def construct(self):\n        title = Text("Fourier Series Visualization").to_edge(UP)\n        self.play(Write(title))\n        circles = VGroup()\n        for i in range(1, 8):\n            radius = 1 / (i * 2 - 1)\n            circle = Circle(radius=radius, color=BLUE, stroke_width=1)\n            if i > 1: circle.move_to(circles[-1].get_end())\n            circles.add(circle)\n        self.play(Create(circles), run_time=2)'
  },
  "Blender Python scripting bpy procedural geometry automation": {
    why: "Blender Python API (bpy) lets you generate 3D models, materials, and animations programmatically. Manual modeling does not scale - bpy creates thousands of variations for game assets.",
    code: 'import bpy\nbpy.ops.mesh.primitive_torus_add(major_radius=2, minor_radius=0.5, major_segments=100)\ntorus = bpy.context.active_object\ntorus.name = "ProceduralKnot"\nmat = bpy.data.materials.new(name="ProceduralMat")\nmat.use_nodes = True\nnodes = mat.node_tree.nodes\nnoise = nodes.new("ShaderNodeTexNoise")\nnoise.inputs["Scale"].default_value = 4.0\ntorus.data.materials.append(mat)'
  },
  "Shader toys SDFs raymarching distance functions art": {
    why: "Signed Distance Functions define 3D shapes mathematically. Raymarching renders SDFs without geometry, enabling complex scenes in a single shader with infinite resolution.",
    code: 'float sdSphere(vec3 p, float r) { return length(p) - r; }\nfloat sdBox(vec3 p, vec3 b) {\n    vec3 q = abs(p) - b;\n    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);\n}\nfloat opSmoothUnion(float d1, float d2, float k) {\n    float h = clamp(0.5 + 0.5*(d2-d1)/k, 0.0, 1.0);\n    return mix(d2, d1, h) - k*h*(1.0-h);\n}\nfloat scene(vec3 p) {\n    return opSmoothUnion(sdSphere(p, 1.0), sdBox(p - vec3(1.5,0,0), vec3(0.8)), 0.5);\n}'
  },
  "Compute shaders GPU parallel intro dispatch/workgroups": {
    why: "Compute shaders run arbitrary parallel computations on the GPU - 10,000x faster than CPU for suitable workloads. Used for particle systems, physics, image processing, and ML preprocessing.",
    code: '#version 310 es\nlayout(local_size_x = 256) in;\nlayout(std430, binding = 0) buffer InputBuffer { float values[]; };\nlayout(std430, binding = 1) buffer OutputBuffer { float results[]; };\nuniform float uScale;\nvoid main() {\n    uint idx = gl_GlobalInvocationID.x;\n    if (idx >= values.length()) return;\n    results[idx] = values[idx] * uScale;  // each GPU thread processes one element\n}\n// glDispatchCompute(ceil(num_elements / 256.0), 1, 1);'
  },
  "Game math quaternions gimbal-lock-free rotation slerp": {
    why: "Euler angles suffer from gimbal lock - rotating 90 on one axis causes two axes to align, losing a degree of freedom. Quaternions avoid this and interpolate smoothly (SLERP).",
    code: 'import numpy as np\ndef axis_angle_to_quaternion(axis, angle_rad):\n    axis = np.array(axis, dtype=float)\n    axis /= np.linalg.norm(axis)\n    half = angle_rad / 2\n    return np.array([np.cos(half), *(axis * np.sin(half))])\ndef slerp(q1, q2, t):\n    dot = np.dot(q1, q2)\n    if dot < 0: q2 = -q2; dot = -dot  # take shortest path\n    if dot > 0.9995: return q1 + t * (q2 - q1)  # nearly parallel\n    theta = np.arccos(np.clip(dot, -1, 1))\n    return (np.sin((1-t)*theta)*q1 + np.sin(t*theta)*q2) / np.sin(theta)\nq_start = axis_angle_to_quaternion([0,1,0], 0)\nq_end = axis_angle_to_quaternion([0,1,0], np.pi/2)\nq_interp = slerp(q_start, q_end, 0.5)  # smooth halfway rotation'
  },
};
