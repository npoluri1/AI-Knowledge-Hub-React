import React, { useState, useEffect, useCallback } from 'react';
import { useLang } from '../i18n';

const CATEGORIES = [
  { key: 'all', label: '🌟 All Picks', icon: '🌟' },
  { key: 'stocks-us', label: '🇺🇸 US Stocks', icon: '🇺🇸' },
  { key: 'stocks-sg', label: '🇸🇬 Singapore', icon: '🇸🇬' },
  { key: 'stocks-in', label: '🇮🇳 India', icon: '🇮🇳' },
  { key: 'stocks-hk', label: '🇭🇰 Hong Kong', icon: '🇭🇰' },
  { key: 'etfs', label: '📦 ETFs', icon: '📦' },
  { key: 'crypto', label: '₿ Crypto', icon: '₿' },
  { key: 'commodities', label: '🪙 Commodities', icon: '🪙' },
  { key: 'forex', label: '💱 Forex', icon: '💱' },
];

function formatNum(n) {
  if (n == null) return '—';
  if (Math.abs(n) >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n/1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatPrice(p, currency) {
  if (p == null) return '—';
  if (currency === 'USD' || !currency) return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === 'SGD') return `S$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === 'INR') return `₹${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function LiveInvestments() {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const url = cat === 'all'
        ? '/api/trading/live-investments?category=all'
        : `/api/trading/live-investments?category=${cat}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeCategory);
  }, [activeCategory, fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => fetchData(activeCategory), 45000);
    return () => clearInterval(id);
  }, [autoRefresh, activeCategory, fetchData]);

  const ChangeBadge = ({ changePct }) => {
    if (changePct == null) return <span className="li-badge li-badge-neutral">—</span>;
    const isUp = changePct >= 0;
    return (
      <span className={`li-badge ${isUp ? 'li-badge-up' : 'li-badge-down'}`}>
        {isUp ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
      </span>
    );
  };

  const MiniCard = ({ item }) => (
    <div className="li-mini-card">
      <div className="li-mini-top">
        <span className="li-mini-symbol">{item.symbol}</span>
        <ChangeBadge changePct={item.changePct} />
      </div>
      <div className="li-mini-name">{item.name}</div>
      <div className="li-mini-price">{formatPrice(item.price, item.currency)}</div>
      <div className="li-mini-stats">
        {item.marketCap && <span>MCap: {formatNum(item.marketCap)}</span>}
        {item.pe && <span>P/E: {item.pe}</span>}
        {item.dividendYield && <span>Yield: {(item.dividendYield * 100).toFixed(1)}%</span>}
        {item.volume && <span>Vol: {formatNum(item.volume)}</span>}
      </div>
      {item.week52High && item.week52Low && item.price && (
        <div className="li-mini-range">
          <div className="li-range-bar">
            <div className="li-range-track">
              <div
                className="li-range-fill"
                style={{
                  left: `${Math.max(0, Math.min(100, ((item.price - item.week52Low) / (item.week52High - item.week52Low)) * 100))}%`
                }}
              />
            </div>
          </div>
          <div className="li-range-labels">
            <span>52W Low: {formatPrice(item.week52Low, item.currency)}</span>
            <span>52W High: {formatPrice(item.week52High, item.currency)}</span>
          </div>
        </div>
      )}
    </div>
  );

  const CategorySection = ({ cat }) => (
    <div className="li-category-section">
      <div className="li-category-header">
        <h3>{cat.country} {cat.title}</h3>
        <span className="li-category-count">{cat.items.length} items</span>
      </div>
      <div className="li-grid">
        {cat.items.map((item, i) => (
          <MiniCard key={`${item.symbol}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="live-investments">
      {/* Hero */}
      <div className="li-hero">
        <div className="li-hero-glow" />
        <div className="li-hero-content">
          <h1>{t('💰 Live Investment Dashboard')}</h1>
          <p>Real-time prices across stocks, ETFs, crypto, commodities & forex — auto-refreshing from Yahoo Finance</p>
          <div className="li-hero-badges">
            <span className="li-live-dot" />
            <span className="li-badge-hero">{t('LIVE DATA')}</span>
            {lastRefresh && (
              <span className="li-refresh-time">
                Last: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="li-hero-controls">
          <button
            className={`li-auto-btn ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? t('⏸️ Pause Auto-Refresh') : t('▶️ Enable Auto-Refresh')}
          </button>
          <button className="li-refresh-btn" onClick={() => fetchData(activeCategory)}>
            {t('🔄 Refresh Now')}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="li-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`li-tab ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && !data ? (
        <div className="li-loading">
          <div className="li-spinner" />
          <p>Fetching live market data from Yahoo Finance...</p>
        </div>
      ) : error ? (
        <div className="li-error">
          <p>⚠️ {error}</p>
          <button onClick={() => fetchData(activeCategory)}>{t('Retry')}</button>
        </div>
      ) : data ? (
        <div className="li-content">
          {activeCategory === 'all' && data.categories ? (
            data.categories.map(cat => (
              <CategorySection key={cat.category} cat={cat} />
            ))
          ) : data.items ? (
            <div className="li-category-section">
              <div className="li-category-header">
                <h3>{data.country} {data.title}</h3>
                <span className="li-category-count">{data.items.length} items</span>
              </div>
              <div className="li-grid">
                {data.items.map((item, i) => (
                  <MiniCard key={`${item.symbol}-${i}`} item={item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Legend */}
      <div className="li-legend">
        <span>📊 Data from Yahoo Finance</span>
        <span>⏱️ Auto-refreshes every 45s</span>
        <span>🔴 Prices may be delayed 15min for some markets</span>
      </div>
    </div>
  );
}
