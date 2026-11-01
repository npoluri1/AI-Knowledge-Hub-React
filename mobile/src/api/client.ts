import Constants from "expo-constants";

/**
 * Central API configuration for the mobile app.
 *
 * The mobile app REUSES the existing FastAPI backend (backend/main.py).
 * Nothing is duplicated — one backend serves web + iOS + Android.
 *
 * Priority order for the base URL:
 *   1. `EXPO_PUBLIC_API_URL` env var (set at build/dev time)
 *   2. Value saved by the user in Settings (stored on device)
 *   3. app.json `extra.defaultApiUrl` (http://localhost:9000)
 *
 * For a real device use your PC's LAN IP, e.g.:
 *   EXPO_PUBLIC_API_URL=http://192.168.1.20:9000 npx expo start
 */
let _savedApiUrl: string | null = null;

export function setSavedApiUrl(url: string | null) {
  _savedApiUrl = url;
}

/**
 * Derive the API base URL from how the app was actually launched (Expo Go).
 *
 * - Tunnel mode: debuggerHost is like `xxxx-anonymous.exp.direct` → the Metro
 *   tunnel also serves `/api/*` (see metro.config.js enhanceMiddleware), so
 *   the backend is reachable at the SAME https tunnel URL.
 * - LAN mode: debuggerHost is like `10.130.1.44:8081` → backend lives on the
 *   same IP at port 9000.
 * - localhost/emulator: debuggerHost `localhost:8081` → localhost:9000.
 */
function autoDevApiUrl(): string | null {
  const goConfig = (Constants as any)?.expoGoConfig as
    | { debuggerHost?: string }
    | undefined;
  const debuggerHost: string | undefined = goConfig?.debuggerHost;
  if (!debuggerHost) return null;
  const [host, port] = debuggerHost.split(":");
  if (!host) return null;
  if (host.includes("exp.direct")) return `https://${host}`;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return `http://${host}:9000`;
  if (host === "localhost" || host === "127.0.0.1") {
    return `http://${port && port !== "8081" ? host : "localhost"}:9000`;
  }
  return null;
}

function isTunnelHost(url: string | null): boolean {
  return !!url && url.includes("exp.direct");
}

function defaultUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL as string | undefined;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim().replace(/\/+$/, "");
  const fromExtra = (Constants as any)?.expoConfig?.extra?.defaultApiUrl;
  if (typeof fromExtra === "string" && fromExtra.trim()) {
    return fromExtra.trim().replace(/\/+$/, "");
  }
  return "http://localhost:9000";
}

export function getApiBaseUrl(): string {
  const auto = autoDevApiUrl();
  // Tunnel wins over everything except an explicit env var: the tunnel host
  // changes on every `expo start`, and any saved/LAN URL cannot work through it.
  if (isTunnelHost(auto) && !process.env.EXPO_PUBLIC_API_URL) return auto!;
  const saved = _savedApiUrl;
  const base = saved && saved.trim() ? saved : auto || defaultUrl();
  return base.replace(/\/+$/, "");
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const TIMEOUT_MS = 45000; // news fan-out + market quotes can be slow

async function request<T>(path: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init?.timeoutMs ?? TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body?.error) detail = String(body.error);
        else if (body?.detail) detail = String(body.detail);
      } catch {
        /* ignore body parse errors */
      }
      throw new ApiError(detail, res.status);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T>(path: string, timeoutMs?: number) => request<T>(path, { method: "GET", timeoutMs }),
  post: <T>(path: string, body?: unknown, timeoutMs?: number) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
      timeoutMs,
    }),
};

export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  const s = parts.join("&");
  return s ? `?${s}` : "";
}
