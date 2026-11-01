import React, { useState, useRef, useEffect } from 'react';
import './LiveFinancialAdvisor.css';
import { useLang } from '../i18n';

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE FINANCIAL ADVISOR — Redesigned with professional card layout
   Tabs: Stock Analysis | Trading News
   ═══════════════════════════════════════════════════════════════════════════ */

const QUICK_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA', emoji: '🟢', sector: 'AI/Semis' },
  { symbol: 'AAPL', name: 'Apple', emoji: '🍎', sector: 'Tech' },
  { symbol: 'MSFT', name: 'Microsoft', emoji: '🪟', sector: 'Tech' },
  { symbol: 'TSLA', name: 'Tesla', emoji: '🚗', sector: 'EV' },
  { symbol: 'AMZN', name: 'Amazon', emoji: '📦', sector: 'Cloud' },
  { symbol: 'GOOGL', name: 'Alphabet', emoji: '🔍', sector: 'Tech' },
  { symbol: 'META', name: 'Meta', emoji: '📘', sector: 'Social' },
  { symbol: 'D05.SI', name: 'DBS', emoji: '🏦', sector: 'SG Banking' },
  { symbol: 'RELIANCE.NS', name: 'Reliance', emoji: '🇮🇳', sector: 'India' },
  { symbol: 'TCS.NS', name: 'TCS', emoji: '🇮🇳', sector: 'India IT' },
  { symbol: '0700.HK', name: 'Tencent', emoji: '🇨🇳', sector: 'China Tech' },
  { symbol: '005930.KS', name: 'Samsung', emoji: '🇰🇷', sector: 'Korea' },
  { symbol: 'BTC-USD', name: 'Bitcoin', emoji: '₿', sector: 'Crypto' },
  { symbol: 'GLD', name: 'Gold', emoji: '🥇', sector: 'Commodity' },
  { symbol: 'VOO', name: 'S&P 500', emoji: '📊', sector: 'Index' },
  { symbol: 'QQQ', name: 'Nasdaq', emoji: '💻', sector: 'Tech Index' },
];

const NEWS_TOPICS = [
  { id: 'general', icon: '🌐', label: 'General Market' },
  { id: 'us', icon: '🇺🇸', label: 'US Market' },
  { id: 'asia', icon: '🌏', label: 'Asia Pacific' },
  { id: 'crypto', icon: '₿', label: 'Crypto' },
  { id: 'commodities', icon: '🪙', label: 'Commodities' },
  { id: 'tech', icon: '💻', label: 'Technology' },
  { id: 'finance', icon: '🏦', label: 'Banking' },
  { id: 'energy', icon: '⚡', label: 'Energy' },
];

/* ── Score Gauge (SVG ring) ──────────────────────────────────────────── */
function ScoreGauge({ score, verdict }) {
  if (score === null || score === undefined) return null;
  const color = score >= 70 ? '#22c55e' : score >= 55 ? '#84cc16' : score >= 45 ? '#eab308' : score >= 30 ? '#f97316' : '#ef4444';
  const circ = 2 * Math.PI * 44;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="lfa-score">
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="50" y="48" textAnchor="middle" fill={color} fontSize="24" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{score}</text>
        <text x="50" y="62" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter, sans-serif">/ 100</text>
      </svg>
      <div className="lfa-score-label" style={{ color }}>{verdict?.replace(/\*\*/g, '').replace(/^🟢 |^🟡 |^🟠 |^🔴 /, '')}</div>
    </div>
  );
}

/* ── Analysis Section Card ────────────────────────────────────────────── */
function AnalysisSection({ section, index }) {
  const [open, setOpen] = useState(index < 3);
  return (
    <div className={`lfa-section ${open ? 'open' : ''}`}>
      <button className="lfa-section-head" onClick={() => setOpen(!open)}>
        <span className="lfa-section-num">{index + 1}</span>
        <span className="lfa-section-title">{section.title}</span>
        <span className={`lfa-section-arrow ${open ? 'rotated' : ''}`}>›</span>
      </button>
      {open && (
        <div className="lfa-section-body">
          {section.facts?.length > 0 && (
            <div className="lfa-facts">
              {section.facts.filter(Boolean).map((f, i) => (
                <div key={i} className="lfa-fact"
                  dangerouslySetInnerHTML={{ __html: f.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
            </div>
          )}
          {section.highlights?.length > 0 && (
            <div className="lfa-badges">
              {section.highlights.map((h, i) => (
                <span key={i} className="lfa-badge">{h}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── News Card ────────────────────────────────────────────────────────── */
function NewsCard({ item }) {
  const timeAgo = (ts) => {
    if (!ts) return '';
    const diff = Date.now() / 1000 - ts;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <a className="lfa-news-card" href={item.url} target="_blank" rel="noopener noreferrer">
      {item.thumbnail && (
        <div className="lfa-news-thumb">
          <img src={item.thumbnail} alt="" loading="lazy" />
        </div>
      )}
      <div className="lfa-news-body">
        <h4 className="lfa-news-title">{item.title}</h4>
        <div className="lfa-news-meta">
          {item.publisher && <span className="lfa-news-pub">{item.publisher}</span>}
          {item.symbol && <span className="lfa-news-ticker">{item.symbol}</span>}
          {item.publishedAt && <span className="lfa-news-time">{timeAgo(item.publishedAt)}</span>}
        </div>
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LiveFinancialAdvisor() {
  const { t } = useLang();
  const [tab, setTab] = useState('analysis');
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // News state
  const [newsTopic, setNewsTopic] = useState('general');
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  const inputRef = useRef(null);

  // ── Stock Analysis ──────────────────────────────────────────────────
  const analyzeStock = async (ticker) => {
    const sym = ticker.trim().toUpperCase();
    if (!sym) return;
    setSymbol(sym);
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const res = await fetch(`/api/advisor/analyze?symbol=${encodeURIComponent(sym)}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
      setRecentSearches(prev => {
        const updated = [{ symbol: sym, name: data.name }, ...prev.filter(s => s.symbol !== sym)];
        return updated.slice(0, 6);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    analyzeStock(symbol);
  };

  // ── News ────────────────────────────────────────────────────────────
  const fetchNews = async (topic) => {
    setNewsTopic(topic);
    setNewsLoading(true);
    setNewsError('');
    setNews([]);
    try {
      const res = await fetch(`/api/advisor/news?topic=${topic}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setNews(data.news || []);
    } catch (err) {
      setNewsError(err.message);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'news') fetchNews(newsTopic);
  }, [tab]);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="lfa-wrap">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="lfa-hero">
        <div className="lfa-hero-glow" />
        <div className="lfa-hero-inner">
          <div className="lfa-hero-badge">{t('LIVE DATA')}</div>
          <h1 className="lfa-hero-title">
            <span className="lfa-hero-icon">🤖</span>
            {t('Live Financial Advisor')}
          </h1>
          <p className="lfa-hero-sub">
            Real-time stock analysis with company financials, valuation, risk assessment,
            investment recommendations, and live market news — all powered by Yahoo Finance.
          </p>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="lfa-tabs">
        <button className={`lfa-tab ${tab === 'analysis' ? 'active' : ''}`} onClick={() => setTab('analysis')}>
          📊 {t('Stock Analysis')}
        </button>
        <button className={`lfa-tab ${tab === 'news' ? 'active' : ''}`} onClick={() => setTab('news')}>
          📰 {t('Trading News')}
        </button>
      </div>

      {/* ═══════════════════ TAB: STOCK ANALYSIS ═══════════════════════ */}
      {tab === 'analysis' && (
        <div className="lfa-analysis-tab">
          {/* Search */}
          <form className="lfa-search" onSubmit={handleSearch}>
            <div className="lfa-search-box">
              <span className="lfa-search-icon">🔍</span>
              <input ref={inputRef} type="text" className="lfa-search-input"
                placeholder="Enter ticker — NVDA, TSLA, D05.SI, RELIANCE.NS, BTC-USD..."
                value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())}
                disabled={loading} />
              <button type="submit" className="lfa-search-go" disabled={loading || !symbol.trim()}>
                {loading ? '⏳' : '⚡'} {t('Analyze')}
              </button>
            </div>
          </form>

          {/* Quick picks */}
          <div className="lfa-picks">
            {QUICK_STOCKS.map(s => (
              <button key={s.symbol} className="lfa-pick" onClick={() => { setSymbol(s.symbol); analyzeStock(s.symbol); }}
                disabled={loading} title={s.sector}>
                <span className="lfa-pick-emoji">{s.emoji}</span>
                <span className="lfa-pick-name">{s.name}</span>
              </button>
            ))}
          </div>

          {/* Recent */}
          {recentSearches.length > 0 && (
            <div className="lfa-recent">
              <span className="lfa-recent-label">Recent:</span>
              {recentSearches.map(s => (
                <button key={s.symbol} className="lfa-recent-chip" onClick={() => analyzeStock(s.symbol)} disabled={loading}>
                  {s.symbol}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="lfa-loading">
              <div className="lfa-spinner" />
              <p>Analyzing {symbol}...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="lfa-error">
              <span>❌</span>
              <p>{error}</p>
              <p className="lfa-error-hint">Try: NVDA, AAPL, D05.SI, RELIANCE.NS, BTC-USD, GLD</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && !analysis && (
            <div className="lfa-empty">
              <div className="lfa-empty-icon">📊</div>
              <h3>Select a stock to analyze</h3>
              <p>Click any quick pick above or type a ticker to get a comprehensive financial analysis.</p>
              <div className="lfa-empty-grid">
                <div className="lfa-empty-card">
                  <h4>🇺🇸 US Stocks</h4>
                  <span>NVDA · AAPL · MSFT · TSLA · AMZN</span>
                </div>
                <div className="lfa-empty-card">
                  <h4>🇸🇬 Singapore</h4>
                  <span>D05.SI · O39.SI · U11.SI · Z74.SI</span>
                </div>
                <div className="lfa-empty-card">
                  <h4>🇮🇳 India</h4>
                  <span>RELIANCE.NS · TCS.NS · HDFCBANK.NS</span>
                </div>
                <div className="lfa-empty-card">
                  <h4>🇭🇰🇰🇷 Asia</h4>
                  <span>0700.HK · 005930.KS · 7203.T</span>
                </div>
                <div className="lfa-empty-card">
                  <h4>🪙 ETFs & Crypto</h4>
                  <span>VOO · QQQ · GLD · BTC-USD</span>
                </div>
              </div>
            </div>
          )}

          {/* Analysis results */}
          {analysis && !loading && (
            <div className="lfa-result">
              {/* Header card */}
              <div className="lfa-result-hero">
                <div className="lfa-result-left">
                  <h2 className="lfa-result-name">{analysis.name}</h2>
                  <span className="lfa-result-sym">{analysis.symbol}</span>
                  {analysis.quickStats?.price && (
                    <div className={`lfa-result-price ${analysis.quickStats.changePct >= 0 ? 'up' : 'down'}`}>
                      <span className="lfa-price-val">${analysis.quickStats.price}</span>
                      {analysis.quickStats.changePct != null && (
                        <span className="lfa-price-change">
                          {analysis.quickStats.changePct >= 0 ? '+' : ''}{analysis.quickStats.changePct}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ScoreGauge score={analysis.quickStats?.score} verdict={analysis.quickStats?.verdict} />
              </div>

              {/* Stats row */}
              {analysis.quickStats && (
                <div className="lfa-stats">
                  {[
                    { label: 'Market Cap', val: analysis.quickStats.marketCap },
                    { label: 'P/E Ratio', val: analysis.quickStats.pe },
                    { label: 'Div Yield', val: analysis.quickStats.dividendYield },
                    { label: '52W High', val: analysis.quickStats.week52High ? `$${analysis.quickStats.week52High}` : null },
                    { label: '52W Low', val: analysis.quickStats.week52Low ? `$${analysis.quickStats.week52Low}` : null },
                    { label: 'Beta', val: analysis.quickStats.beta },
                    { label: 'Analyst', val: analysis.quickStats.recommendation?.toUpperCase() },
                  ].filter(s => s.val && s.val !== 'N/A').map(s => (
                    <div key={s.label} className="lfa-stat">
                      <span className="lfa-stat-lbl">{s.label}</span>
                      <span className="lfa-stat-val">{s.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sections */}
              <div className="lfa-sections">
                {analysis.sections?.map((section, i) => (
                  <AnalysisSection key={i} section={section} index={i} />
                ))}
              </div>

              {/* Disclaimer */}
              <div className="lfa-disclaimer">
                ⚠️ <strong>Disclaimer:</strong> For educational purposes only — not financial advice.
                Always do your own research. Data from Yahoo Finance.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════ TAB: TRADING NEWS ═════════════════════════ */}
      {tab === 'news' && (
        <div className="lfa-news-tab">
          <div className="lfa-news-topics">
            {NEWS_TOPICS.map(t => (
              <button key={t.id} className={`lfa-topic-btn ${newsTopic === t.id ? 'active' : ''}`}
                onClick={() => fetchNews(t.id)} disabled={newsLoading}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {newsLoading && (
            <div className="lfa-loading">
              <div className="lfa-spinner" />
              <p>Fetching latest market news...</p>
            </div>
          )}

          {newsError && (
            <div className="lfa-error">
              <span>❌</span><p>{newsError}</p>
            </div>
          )}

          {!newsLoading && !newsError && news.length === 0 && (
            <div className="lfa-empty">
              <div className="lfa-empty-icon">📰</div>
              <h3>No news available</h3>
              <p>Select a topic above to load the latest market news.</p>
            </div>
          )}

          {!newsLoading && news.length > 0 && (
            <div className="lfa-news-grid">
              {news.map((item, i) => (
                <NewsCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
