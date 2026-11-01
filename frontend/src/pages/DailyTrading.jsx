import React, { useState, useEffect, useCallback } from 'react';
import { useLang } from '../i18n';

function formatNum(n) {
  if (n == null) return '—';
  if (Math.abs(n) >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${(n/1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n/1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatPrice(p) {
  if (p == null) return '—';
  return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DailyTrading() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/trading/daily-trading');
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
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchData]);

  const SentimentGauge = ({ sentiment }) => {
    if (!sentiment) return null;
    const colors = {
      'Extreme Greed': '#22c55e',
      'Greed': '#86efac',
      'Neutral': '#fbbf24',
      'Fear': '#f87171',
      'Extreme Fear': '#ef4444',
    };
    return (
      <div className="dt-sentiment-card">
        <div className="dt-sentiment-icon">{sentiment.emoji}</div>
        <div className="dt-sentiment-label">Market Sentiment</div>
        <div className="dt-sentiment-value" style={{ color: colors[sentiment.label] || '#fff' }}>
          {sentiment.label}
        </div>
        <div className="dt-sentiment-detail">
          Avg Change: <strong style={{ color: sentiment.avgChange >= 0 ? '#22c55e' : '#f87171' }}>
            {sentiment.avgChange >= 0 ? '+' : ''}{sentiment.avgChange}%
          </strong>
        </div>
        <div className="dt-sentiment-bar">
          <div
            className="dt-sentiment-fill"
            style={{
              width: `${Math.max(5, Math.min(95, 50 + sentiment.avgChange * 15))}%`,
              background: `linear-gradient(90deg, #ef4444 0%, #fbbf24 50%, #22c55e 100%)`
            }}
          />
          <div className="dt-sentiment-needle" style={{ left: `${Math.max(5, Math.min(95, 50 + sentiment.avgChange * 15))}%` }} />
        </div>
        <div className="dt-sentiment-scale">
          <span>🔴 Extreme Fear</span>
          <span>⚪ Neutral</span>
          <span>🟢 Extreme Greed</span>
        </div>
      </div>
    );
  };

  const BreadthCard = ({ breadth }) => {
    if (!breadth) return null;
    const total = breadth.up + breadth.down + breadth.flat;
    const upPct = total > 0 ? (breadth.up / total) * 100 : 0;
    const downPct = total > 0 ? (breadth.down / total) * 100 : 0;
    return (
      <div className="dt-breadth-card">
        <h3>📊 Market Breadth</h3>
        <div className="dt-breadth-bar">
          <div className="dt-breadth-up" style={{ width: `${upPct}%` }}>{breadth.up} ↑</div>
          <div className="dt-breadth-flat" style={{ width: `${total > 0 ? (breadth.flat / total) * 100 : 0}%` }}>{breadth.flat} —</div>
          <div className="dt-breadth-down" style={{ width: `${downPct}%` }}>{breadth.down} ↓</div>
        </div>
        <div className="dt-breadth-legend">
          <span style={{ color: '#22c55e' }}>🟢 Up: {breadth.up} ({upPct.toFixed(0)}%)</span>
          <span style={{ color: '#94a3b8' }}>⚪ Flat: {breadth.flat}</span>
          <span style={{ color: '#f87171' }}>🔴 Down: {breadth.down} ({downPct.toFixed(0)}%)</span>
        </div>
      </div>
    );
  };

  const SectorCard = ({ sectors }) => {
    if (!sectors || !sectors.length) return null;
    return (
      <div className="dt-sectors-card">
        <h3>🏭 Sector Performance</h3>
        <div className="dt-sector-list">
          {sectors.map((s, i) => {
            const isUp = s.avgChange >= 0;
            return (
              <div key={i} className="dt-sector-row">
                <span className="dt-sector-name">{s.name}</span>
                <div className="dt-sector-bar-wrap">
                  <div
                    className="dt-sector-bar"
                    style={{
                      width: `${Math.min(100, Math.abs(s.avgChange) * 20 + 5)}%`,
                      background: isUp ? '#22c55e' : '#f87171',
                    }}
                  />
                </div>
                <span className={`dt-sector-change ${isUp ? 'up' : 'down'}`}>
                  {isUp ? '+' : ''}{s.avgChange}%
                </span>
                <span className="dt-sector-count">{s.stockCount} stocks</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MoversTable = ({ title, icon, items, colorClass }) => (
    <div className="dt-movers-card">
      <h3>{icon} {title}</h3>
      <div className="dt-movers-table-wrap">
        <table className="dt-movers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Symbol</th>
              <th>Name</th>
              <th>Price</th>
              <th>Change</th>
              <th>Volume</th>
              <th>MCap</th>
              <th>52W Range</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const isUp = (item.changePct || 0) >= 0;
              const range52Pos = item.week52High && item.week52Low && item.price
                ? ((item.price - item.week52Low) / (item.week52High - item.week52Low)) * 100
                : 50;
              return (
                <tr key={`${item.symbol}-${i}`} className={isUp ? 'row-up' : 'row-down'}>
                  <td className="dt-rank">{i + 1}</td>
                  <td><span className="dt-symbol">{item.symbol}</span></td>
                  <td className="dt-name">{item.name}</td>
                  <td className="dt-price">{formatPrice(item.price)}</td>
                  <td>
                    <span className={`dt-change ${isUp ? 'up' : 'down'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(item.changePct || 0).toFixed(2)}%
                    </span>
                  </td>
                  <td className="dt-volume">{formatNum(item.volume)}</td>
                  <td className="dt-mcap">{formatNum(item.marketCap)}</td>
                  <td className="dt-range-cell">
                    <div className="dt-mini-range">
                      <div className="dt-mini-range-bar">
                        <div className="dt-mini-range-fill" style={{ left: `${Math.max(0, Math.min(100, range52Pos))}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="daily-trading">
      {/* Hero */}
      <div className="dt-hero">
        <div className="dt-hero-glow" />
        <div className="dt-hero-content">
          <h1>📊 {t('Daily Trading Dashboard')}</h1>
          <p>Today's market movers — top gainers, losers, most active, sector performance & market sentiment</p>
          <div className="dt-hero-badges">
            <span className="dt-live-dot" />
            <span className="dt-badge-hero">{t('LIVE MARKET DATA')}</span>
            {lastRefresh && (
              <span className="dt-refresh-time">
                Last: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="dt-hero-controls">
          <button
            className={`dt-auto-btn ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? t('⏸️ Pause') : t('▶️ Auto-Refresh')}
          </button>
          <button className="dt-refresh-btn" onClick={fetchData}>
            🔄 {t('Refresh')}
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="dt-tabs">
        {[
          { key: 'overview', label: t('📊 Overview') },
          { key: 'gainers', label: t('🟢 Top Gainers') },
          { key: 'losers', label: t('🔴 Top Losers') },
          { key: 'active', label: t('⚡ Most Active') },
          { key: 'sectors', label: t('🏭 Sectors') },
        ].map(tab => (
          <button
            key={tab.key}
            className={`dt-tab ${activeView === tab.key ? 'active' : ''}`}
            onClick={() => setActiveView(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && !data ? (
        <div className="dt-loading">
          <div className="dt-spinner" />
          <p>Scanning 80+ stocks for today's movers...</p>
        </div>
      ) : error ? (
        <div className="dt-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchData}>{t('Retry')}</button>
        </div>
      ) : data ? (
        <div className="dt-content">
          {(activeView === 'overview' || activeView === 'gainers') && data.sentiment && (
            <div className="dt-overview-top">
              <SentimentGauge sentiment={data.sentiment} />
              <BreadthCard breadth={data.marketBreadth} />
              <SectorCard sectors={data.sectors?.slice(0, 6)} />
            </div>
          )}

          {(activeView === 'overview' || activeView === 'gainers') && data.gainers && (
            <MoversTable title="Top Gainers" icon="🟢" items={data.gainers} colorClass="up" />
          )}

          {(activeView === 'overview' || activeView === 'losers') && data.losers && (
            <MoversTable title="Top Losers" icon="🔴" items={data.losers} colorClass="down" />
          )}

          {(activeView === 'overview' || activeView === 'active') && data.mostActive && (
            <MoversTable title="Most Active" icon="⚡" items={data.mostActive} colorClass="active" />
          )}

          {(activeView === 'overview' || activeView === 'sectors') && data.sectors && (
            <SectorCard sectors={data.sectors} />
          )}
        </div>
      ) : null}

      <div className="dt-legend">
        <span>📊 Scanned 80+ US stocks from Yahoo Finance</span>
        <span>⏱️ Auto-refreshes every 60s</span>
        <span>🔴 Market hours: 9:30 AM - 4:00 PM ET</span>
      </div>
    </div>
  );
}
