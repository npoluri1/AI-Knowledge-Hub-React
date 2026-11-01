// App.jsx — core hook patterns every React dev must know
import React, { createContext, useContext, useEffect, useMemo,
               useRef, useState, useCallback } from "react";

const ThemeCtx = createContext("dark");
export const useTheme = () => useContext(ThemeCtx);

function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);            // cleanup cancels stale timers
  }, [value, ms]);
  return v;
}

function SearchUsers() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const dq = useDebounced(q);                 // don't hit API on every keystroke

  useEffect(() => {
    if (!dq) return setRows([]);
    const ac = new AbortController();
    fetch(`/api/users?q=${encodeURIComponent(dq)}`, { signal: ac.signal })
      .then(r => r.json()).then(setRows)
      .catch(e => e.name !== "AbortError" && console.error(e));
    return () => ac.abort();                  // kill in-flight on new query
  }, [dq]);

  const count = useMemo(() => rows.filter(r => r.active).length, [rows]);
  return (
    <>
      <input value={q} onChange={e => setQ(e.target.value)}
             placeholder="search users…" />
      <p>{count} active of {rows.length}</p>
      <ul>{rows.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  );
}

function Timer() {
  const ticks = useRef(0);                    // mutable, no re-render
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { ticks.current++; force(x => x + 1); }, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>ticks: {ticks.current}</span>;
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const toggle = useCallback(() => setTheme(t => t === "dark" ? "light" : "dark"), []);
  return (
    <ThemeCtx.Provider value={theme}>
      <button onClick={toggle}>theme: {theme}</button>
      <Timer />
      <SearchUsers />
    </ThemeCtx.Provider>
  );
}