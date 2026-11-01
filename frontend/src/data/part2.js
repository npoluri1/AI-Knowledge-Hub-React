// Part 2: ReactJS + NextJS topics
export const PART2 = {
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
};
