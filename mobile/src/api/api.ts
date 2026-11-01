/**
 * Typed wrappers for every backend endpoint the mobile app consumes.
 * All of these already exist in backend/ — the mobile app adds ZERO backend code.
 *
 * Backend source references:
 *   - backend/main.py            (chapters, search, chat, news, files, jobs, linkedin)
 *   - backend/market_api.py      (/api/market/*)
 *   - backend/trading_api.py     (/api/trading/*)
 *   - backend/financial_advisor_api.py (/api/advisor/*)
 *   - backend/video_hub_api.py   (/api/videos/*)
 */
import { api, qs } from "./client";

// ── Shared types (matching backend response shapes) ─────────────────────────

export interface Quote {
  symbol: string;
  name: string;
  currency?: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  previousClose?: number | null;
  week52High?: number | null;
  week52Low?: number | null;
  volume?: number | null;
  marketCap?: number | null;
  pe?: number | null;
  error?: string;
  indexCountry?: string;
}

export interface ChapterSection {
  heading?: string;
  text?: string;
  insight?: string;
  concept?: string;
  scenario?: string;
  warning?: string;
  sections?: ChapterSection[];
}

export interface Chapter {
  id: string;
  title: string;
  preview?: string;
  tags?: string[];
  sections?: ChapterSection[];
}

export interface SearchResult {
  type: "chapter" | "deep-dive";
  chapter_id: string;
  chapter_title: string;
  section_heading: string | null;
  snippet: string;
  score: number;
}

export interface ChatResponse {
  answer: string;
  sources: { type: string; id: string; title: string }[];
}

export interface LinkedInPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  topic: string;
  profile: string;
  profileType?: string;
  profileTagline?: string;
  profileUrl?: string;
  url?: string;
}

export interface NewsSource {
  key: string;
  name: string;
  url: string;
  rss?: string;
  category: string;
  country: string;
  hasRss: boolean;
  isFetchable: boolean;
  feedType: "rss" | "scraped";
}

export interface NewsItem {
  title: string;
  link?: string;
  published?: string;
  summary?: string;
}

export interface VideoTopic {
  key: string;
  label: string;
}

export interface VideoItem {
  videoId?: string;
  id?: string;
  title: string;
  url?: string;
  channel?: string;
  published?: string;
  thumbnail?: string;
  duration?: string;
  kind?: string;
  topic?: string;
  topicLabel?: string;
  embedUrl?: string;
}

// ── Chapters / Learning ──────────────────────────────────────────────────────

export const getChapters = () => api.get<Chapter[]>("/api/chapters");
export const getChapter = (id: string) =>
  api.get<Chapter | { error: string }>(`/api/chapters/${encodeURIComponent(id)}`);
export const getDeepDives = () => api.get<Chapter[]>("/api/deep-dive");
export const getDeepDive = (id: string) =>
  api.get<Chapter | { error: string }>(`/api/deep-dive/${encodeURIComponent(id)}`);

// ── Search + Chat ────────────────────────────────────────────────────────────

export const searchAll = (q: string) =>
  api.get<{ results: SearchResult[]; total: number }>(`/api/search${qs({ q })}`);
export const chat = (message: string) => api.post<ChatResponse>("/api/chat", { message });

// ── Market / Trading ─────────────────────────────────────────────────────────

export const getIndices = () =>
  api.get<{ indices: Quote[] }>("/api/market/indices", 60000);
export const getQuotes = (symbols: string[]) =>
  api.get<{ quotes: Quote[] }>(`/api/market/quotes${qs({ symbols: symbols.join(",") })}`, 60000);
export const getQuote = (symbol: string) => api.get<Quote>(`/api/market/quote${qs({ symbol })}`, 60000);
export const getPopularQuotes = (country: string) =>
  api.get<{ country: string; quotes: Quote[] }>(
    `/api/market/popular/quotes${qs({ country })}`, 90000
  );
export const getCommodities = () =>
  api.get<Record<string, unknown>>("/api/trading/commodities", 60000);
export const getDailyTrading = () =>
  api.get<Record<string, unknown>>("/api/trading/daily-trading", 60000);
export const getLiveInvestments = (category: string) =>
  api.get<LiveInvestmentsAll | LiveInvestmentsCategory>(
    `/api/trading/live-investments${qs({ category })}`,
    90000
  );

export interface LiveInvestmentsAll {
  categories: {
    category: string;
    title: string;
    type: string;
    country: string;
    items: Quote[];
  }[];
  fetchedAt: string;
}
export interface LiveInvestmentsCategory {
  category: string;
  title: string;
  type: string;
  country: string;
  items: Quote[];
  fetchedAt: string;
}

// ── Financial advisor ────────────────────────────────────────────────────────

export interface AdvisorSection {
  title: string;
  facts: string[];
  highlights: string[];
}
export interface AdvisorAnalysis {
  sections: AdvisorSection[];
  quickStats: {
    price: number | null;
    changePct: number | null;
    marketCap: string | null;
    pe: number | null;
    dividendYield: string | null;
    week52High: number | null;
    week52Low: number | null;
    beta: number | null;
    recommendation: string | null;
    score: number | null;
    verdict: string | null;
  };
  symbol?: string;
  name?: string;
  fetchedAt?: string;
  error?: string;
}
export const analyzeStock = (symbol: string) =>
  api.get<AdvisorAnalysis>(`/api/advisor/analyze${qs({ symbol })}`, 90000);

export interface AdvisorNewsItem {
  title: string;
  url: string;
  publisher: string;
  symbol: string;
  thumbnail: string | null;
  publishedAt: number | string | null;
}
export const getAdvisorNews = (topic: string) =>
  api.get<{
    topic: string;
    topicName: string;
    count: number;
    news: AdvisorNewsItem[];
    fetchedAt: string;
  }>(`/api/advisor/news${qs({ topic })}`, 90000);

export const ADVISOR_NEWS_TOPICS = [
  { key: "general", label: "🌐 General" },
  { key: "us", label: "🇺🇸 US" },
  { key: "asia", label: "🌏 Asia" },
  { key: "crypto", label: "₿ Crypto" },
  { key: "commodities", label: "🪙 Commodities" },
  { key: "tech", label: "💻 Tech" },
  { key: "finance", label: "🏦 Finance" },
  { key: "energy", label: "⚡ Energy" },
] as const;

// ── News ─────────────────────────────────────────────────────────────────────

export const getNewsSources = (country?: string, category?: string) =>
  api.get<{ sources: NewsSource[]; total: number; countries: string[]; categories: string[] }>(
    `/api/news/sources${qs({ country, category })}`
  );
export const fetchNews = (sources: string, limit = 10) =>
  api.get<{
    results: { key: string; name: string; items: NewsItem[]; error?: string }[];
    total_items: number;
    fetched_at: string;
  }>(`/api/news/fetch${qs({ sources, limit })}`, 120000);

// ── LinkedIn posts ───────────────────────────────────────────────────────────

export const getDailyPosts = (date?: string, topic?: string, perDay = 4) =>
  api.get<{ date: string; count: number; posts: LinkedInPost[] }>(
    `/api/linkedin-posts/daily${qs({ date, topic, per_day: perDay })}`
  );
export const getPostTopics = () =>
  api.get<{ count: number; topics: string[] }>("/api/linkedin-posts/topics");

// ── Video hub ────────────────────────────────────────────────────────────────

export const getVideoTopics = () =>
  api.get<{ count: number; topics: VideoTopic[] }>("/api/videos/topics");
export const discoverVideos = (opts: {
  topic?: string;
  max_results?: number;
  kind?: "all" | "shorts" | "long";
  country?: string;
  lang?: string;
}) =>
  api.get<{ topic: string; count: number; items: VideoItem[]; error?: string }>(
    `/api/videos/discover${qs({ ...opts })}`,
    90000
  );
export const discoverAllNetworks = (opts: {
  max_per_network?: number;
  per_topic?: number;
  start?: string;
  end?: string;
}) =>
  api.get<{ count: number; items: VideoItem[] }>(
    `/api/videos/discover-all-networks${qs({ ...opts })}`,
    120000
  );

// ── Jobs ─────────────────────────────────────────────────────────────────────

export interface Job {
  id?: string | number;
  title?: string;
  company?: string;
  location?: string;
  url?: string;
  source?: string;
  [k: string]: unknown;
}
export const getJobs = (limit = 200) =>
  api.get<{ total: number; generatedAt: string | null; jobs: Job[] }>(
    `/api/jobs${qs({ limit })}`,
    60000
  );

// ── Files / Gallery ──────────────────────────────────────────────────────────

export interface FileRecord {
  name: string;
  display_name: string;
  url: string;
  size: string;
  bytes: number;
  type: string;
  bucket: "images" | "pdfs" | "documents" | "dataFiles";
  folder: string;
  source_label: string;
  mtime_display: string;
}
export const getFiles = () =>
  api.get<{
    images: FileRecord[];
    pdfs: FileRecord[];
    documents: FileRecord[];
    dataFiles: FileRecord[];
    totals: { images: number; pdfs: number; documents: number; dataFiles: number; total: number };
  }>("/api/files", 90000);

// ── Catalog engine (web-parity datasets served by backend) ───────────────────

export interface CatalogMeta {
  key: string;
  title: string;
  icon: string;
  desc: string;
  count: number;
  type: "list" | "object";
  paginated: boolean;
  exportedAt?: string;
}
export interface CatalogSummary {
  count: number;
  catalogs: CatalogMeta[];
}
export const getCatalogs = () => api.get<CatalogSummary>("/api/catalog", 30000);

export interface CatalogResultItem {
  idx: number;
  id: string;
  title: string;
  subtitle: string;
  category: string;
  item: Record<string, unknown>;
}
export interface CatalogSearchResponse {
  key: string;
  total: number;
  page: number;
  page_size: number;
  pages: number;
  results: CatalogResultItem[];
}
export const searchCatalog = (
  key: string,
  opts: { q?: string; category?: string; page?: number; page_size?: number }
) =>
  api.get<CatalogSearchResponse>(
    `/api/catalog/${encodeURIComponent(key)}/search${qs({
      q: opts.q,
      category: opts.category,
      page: opts.page,
      page_size: opts.page_size ?? 40,
    })}`,
    60000
  );

export interface CatalogCategory {
  name: string;
  count: number;
}
export const getCatalogCategories = (key: string) =>
  api.get<{ key: string; count: number; categories: CatalogCategory[] }>(
    `/api/catalog/${encodeURIComponent(key)}/categories`,
    60000
  );

export const getCatalogFull = (key: string) =>
  api.get<{
    key: string;
    count: number;
    data: unknown;
    error?: string;
  }>(`/api/catalog/${encodeURIComponent(key)}`, 60000);
