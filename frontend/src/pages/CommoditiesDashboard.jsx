import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLang } from '../i18n';
import './CommoditiesDashboard.css';

const GUIDE_CARDS = [
  { icon: '🥇', title: 'Precious metals', text: 'Gold and silver can diversify a portfolio, but prices still move with rates, currencies, inflation expectations and risk sentiment.', color: '#fbbf24' },
  { icon: '🛢️', title: 'Energy', text: 'Oil and gas react quickly to inventories, production decisions, transport disruptions, weather and geopolitics.', color: '#fb7185' },
  { icon: '🔩', title: 'Industrial metals', text: 'Copper and aluminium are often watched as economic signals because factories, construction and power networks consume them.', color: '#38bdf8' },
  { icon: '🌾', title: 'Agriculture', text: 'Grains and soft commodities are seasonal markets. Weather, acreage, exports and storage can change the outlook fast.', color: '#4ade80' },
];

const FUTURE_NOTES = [
  ['Contango', 'Futures price is above spot; rolling contracts may create a cost.'],
  ['Backwardation', 'Futures price is below spot; rolling contracts may be supportive.'],
  ['Margin', 'A deposit that controls a larger futures position; losses can exceed the deposit.'],
  ['Contract size', 'Each futures contract represents a fixed quantity, so a small price move can have a large dollar impact.'],
];

const CHIP_VARIATIONS = [
  { icon: '🧠', name: 'AI accelerators', examples: 'GPU · TPU · NPU · AI ASIC', use: 'LLM training, inference, recommendation and computer vision', color: '#a78bfa' },
  { icon: '💾', name: 'Memory chips', examples: 'DRAM · NAND · HBM', use: 'Servers, phones, SSDs and high-bandwidth AI systems', color: '#38bdf8' },
  { icon: '⚙️', name: 'Processors', examples: 'CPU · MCU · SoC · RISC-V', use: 'Computers, vehicles, appliances and embedded controllers', color: '#4ade80' },
  { icon: '📡', name: 'Connectivity chips', examples: '5G · Wi-Fi · RF · Bluetooth', use: 'Telecom, satellites, connected devices and industrial gateways', color: '#fb7185' },
  { icon: '🔋', name: 'Power semiconductors', examples: 'SiC · GaN · MOSFET · IGBT', use: 'EV inverters, chargers, renewable energy and power supplies', color: '#fbbf24' },
  { icon: '📷', name: 'Sensors & mixed-signal', examples: 'CMOS · LiDAR · ADC · PMIC', use: 'Cameras, robotics, medical devices and factory instrumentation', color: '#fb923c' },
];

const CHIP_INDUSTRIES = [
  ['🚗 Automotive', 'ADAS perception, battery management, radar, infotainment and vehicle compute.', 'A factory gateway detects a sensor fault in milliseconds and sends only the relevant event to the cloud.'],
  ['🏥 Healthcare', 'Imaging, wearable monitoring, portable diagnostics and medical-device control.', 'An edge device flags an abnormal heart-rate pattern locally while preserving patient privacy.'],
  ['🏭 Manufacturing', 'Machine vision, predictive maintenance, robotics and wafer-fab process control.', 'A vibration model warns the maintenance team before a spindle failure stops the production line.'],
  ['📱 Consumer electronics', 'Phones, laptops, cameras, smart appliances and on-device generative AI.', 'An NPU summarizes a message on the phone without uploading the private text.'],
  ['☁️ Cloud & data centers', 'GPU clusters, networking, HBM memory, storage and high-efficiency power delivery.', 'Telemetry tracks GPU temperature, memory errors and power draw to route workloads safely.'],
  ['⚡ Energy & utilities', 'Inverters, smart meters, grid monitoring, battery storage and power conversion.', 'A SiC inverter adjusts switching behavior as load changes across a solar-storage site.'],
  ['🛰️ Aerospace & defense', 'Radiation-tolerant electronics, secure communications, navigation and autonomy.', 'Redundant compute lanes continue flight-control processing when one lane reports an error.'],
  ['🌾 Agriculture & logistics', 'Autonomous equipment, cold-chain sensors, asset tracking and route optimization.', 'A low-power sensor reports temperature excursions before a shipment spoils.'],
];

const CHIP_PROJECTS = [
  {
    title: 'Real-time wafer yield monitor',
    text: 'Stream wafer-test results, create a die map, calculate rolling yield, and alert when a tool or lot drifts from its baseline.',
    code: `from collections import deque\n\n# Toy stream: (lot, tool, pass_flag)\nstream = [('L1', 'ETCH-03', True), ('L1', 'ETCH-03', True),\n          ('L1', 'ETCH-03', False), ('L2', 'ETCH-03', True)]\nwindow = deque(maxlen=20)\nfor lot, tool, passed in stream:\n    window.append(passed)\n    yield_rate = sum(window) / len(window)\n    alert = len(window) >= 3 and yield_rate < 0.80\n    print(lot, tool, f'yield={yield_rate:.1%}', 'ALERT' if alert else 'OK')`,
  },
  {
    title: 'Edge chip health monitor',
    text: 'Collect temperature, power and error counters from an AI device; use thresholds and cooldowns for safe operator alerts.',
    code: `from time import time\n\ndef evaluate_chip(sample, limits):\n    alarms = []\n    if sample['temp_c'] > limits['temp_c']:\n        alarms.append('thermal-limit')\n    if sample['correctable_errors'] > limits['correctable_errors']:\n        alarms.append('memory-health')\n    return {'ts': time(), 'device': sample['device'], 'alarms': alarms}\n\nprint(evaluate_chip(\n    {'device': 'EDGE-07', 'temp_c': 81, 'correctable_errors': 4},\n    {'temp_c': 80, 'correctable_errors': 10}))`,
  },
  {
    title: 'Chip demand and capacity planner',
    text: 'Compare expected demand with wafer starts, packaging capacity and tested-good output before promising supply to a product team.',
    code: `demand = {'phone': 80000, 'ev': 25000, 'server': 12000}\ncapacity = {'phone': 60000, 'ev': 30000, 'server': 10000}\nyield_rate = 0.92\nfor product, required in demand.items():\n    good_units = capacity[product] * yield_rate\n    gap = required - good_units\n    print(product, 'shortfall' if gap > 0 else 'surplus', round(gap))`,
  },
];

function formatPrice(item) {
  if (item?.price == null) return '—';
  const currency = item.currency === 'USD' || !item.currency ? '$' : `${item.currency} `;
  return `${currency}${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

function QuoteCard({ item, accent }) {
  const change = item.changePct;
  const positive = change >= 0;
  return (
    <article className="commodity-quote-card" style={{ '--commodity-accent': accent }}>
      <div className="commodity-quote-top">
        <span className="commodity-symbol">{item.symbol}</span>
        {change == null ? <span className="commodity-change neutral">No change</span> : <span className={`commodity-change ${positive ? 'up' : 'down'}`}>{positive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%</span>}
      </div>
      <h3>{item.name || item.symbol}</h3>
      <div className="commodity-price">{formatPrice(item)}</div>
      <div className="commodity-metrics">
        <span>Open <b>{item.open == null ? '—' : item.open}</b></span>
        <span>High <b>{item.high == null ? '—' : item.high}</b></span>
        <span>Low <b>{item.low == null ? '—' : item.low}</b></span>
      </div>
      {item.error && <div className="commodity-data-note">Quote unavailable from provider</div>}
    </article>
  );
}

export default function CommoditiesDashboard() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [capital, setCapital] = useState('10000');
  const [entry, setEntry] = useState('75');
  const [exit, setExit] = useState('82');

  const fetchQuotes = useCallback(async (force = false) => {
    setError('');
    if (force) setRefreshing(true); else setLoading(true);
    try {
      const response = await fetch(`/api/trading/commodities${force ? '?refresh=true' : ''}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Live data returned HTTP ${response.status}`);
      setData(await response.json());
    } catch (err) {
      setError(`${err.message}. The guide remains available; try Refresh again when the market feed is reachable.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);
  useEffect(() => {
    if (!autoRefresh) return undefined;
    const timer = window.setInterval(() => fetchQuotes(true), 60000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, fetchQuotes]);

  const profit = useMemo(() => {
    const money = Number(capital) || 0;
    const buy = Number(entry) || 0;
    const sell = Number(exit) || 0;
    const units = buy > 0 ? money / buy : 0;
    const gross = units * (sell - buy);
    return { units, gross, percent: buy > 0 ? ((sell - buy) / buy) * 100 : 0 };
  }, [capital, entry, exit]);

  const groups = data?.groups || [];
  const visibleGroups = activeGroup === 'all' ? groups : groups.filter(group => group.id === activeGroup);

  return (
    <div className="commodities-page">
      <header className="commodities-hero">
        <div className="commodities-hero-glow" />
        <div className="commodities-kicker">{t('MARKET DESK · LIVE COMMODITIES')}</div>
        <div className="commodities-hero-row">
          <div>
            <h1>{t('Commodities Command Center')}</h1>
            <p>Explore precious metals, energy, industrial metals, agriculture and livestock in separate market sections.</p>
            <div className="commodities-status-row">
              <span className="live-pill"><i /> {t('LIVE FEED')}</span>
              <span>{data?.fetchedAt ? `Updated ${new Date(data.fetchedAt).toLocaleTimeString()}` : 'Connecting to market feed…'}</span>
              <span className="delayed-note">{t('Quotes may be delayed')}</span>
            </div>
          </div>
          <div className="commodities-actions">
            <button className="commodity-refresh" onClick={() => fetchQuotes(true)} disabled={refreshing}>{refreshing ? t('⏳ Updating…') : t('↻ Refresh live data')}</button>
            <button className={`commodity-auto ${autoRefresh ? 'active' : ''}`} onClick={() => setAutoRefresh(value => !value)}>{autoRefresh ? t('⏸ Auto-refresh on') : t('▶ Auto-refresh off')}</button>
          </div>
        </div>
      </header>

      <nav className="commodity-section-nav" aria-label="Commodity sections">
        <button className={activeGroup === 'all' ? 'active' : ''} onClick={() => setActiveGroup('all')}>🌐 {t('All markets')}</button>
        {groups.map(group => <button key={group.id} className={activeGroup === group.id ? 'active' : ''} onClick={() => setActiveGroup(group.id)}>{group.icon} {group.label}</button>)}
      </nav>

      {error && <div className="commodity-alert">⚠️ {error}</div>}
      {loading && !data && <div className="commodity-loading"><span />Loading the latest commodity quotes…</div>}

      <main>
        <section className="commodity-overview-grid">
          {GUIDE_CARDS.map(card => <div className="commodity-guide-card" key={card.title} style={{ '--guide-color': card.color }}><span>{card.icon}</span><div><h2>{card.title}</h2><p>{card.text}</p></div></div>)}
        </section>

        <section className="commodity-market-panel">
          <div className="commodity-panel-heading"><div><span className="eyebrow">LIVE MARKET BOARD</span><h2>{activeGroup === 'all' ? 'All commodity markets' : visibleGroups[0]?.label || 'Commodity market'}</h2></div><span className="quote-source">Source: {data?.source || 'market provider'}</span></div>
          {visibleGroups.map(group => <div className="commodity-group" key={group.id}><div className="commodity-group-heading" style={{ '--group-color': group.accent }}><div><h3>{group.icon} {group.label}</h3><p>{group.description}</p></div><span>{group.items?.length || 0} contracts</span></div><div className="commodity-quotes">{group.items?.map(item => <QuoteCard key={item.symbol} item={item} accent={group.accent} />)}</div></div>)}
          {!loading && !visibleGroups.length && <div className="commodity-empty">No group data is available yet. Press Refresh live data to try again.</div>}
        </section>

        {activeGroup === 'all' || activeGroup === 'semiconductor-chips' ? (
          <>
            <section className="chip-learning-panel">
              <div className="commodity-panel-heading"><div><span className="eyebrow">CHIP KNOWLEDGE LAB</span><h2>Semiconductor & Chips: all major variations</h2></div><a className="chip-library-link" href="/semiconductors">Open full semiconductor learning library →</a></div>
              <p className="chip-intro">A chip is a tiny factory of switches and circuits. The variation you choose depends on compute, memory, power, speed, heat, reliability, cost and the industry scenario.</p>
              <div className="chip-variation-grid">{CHIP_VARIATIONS.map(item => <article className="chip-variation-card" key={item.name} style={{ '--chip-color': item.color }}><span className="chip-variation-icon">{item.icon}</span><h3>{item.name}</h3><b>{item.examples}</b><p>{item.use}</p></article>)}</div>
            </section>
            <section className="chip-industries-panel">
              <div className="commodity-panel-heading"><div><span className="eyebrow">REAL-TIME INDUSTRY SCENARIOS</span><h2>Where semiconductor systems work today</h2></div><span className="quote-source">Edge + cloud + factory examples</span></div>
              <div className="chip-industry-grid">{CHIP_INDUSTRIES.map(([industry, use, realtime]) => <article key={industry}><h3>{industry}</h3><p><b>Use case:</b> {use}</p><p className="chip-realtime"><b>⚡ Live scenario:</b> {realtime}</p></article>)}</div>
            </section>
            <section className="chip-project-panel">
              <div className="commodity-panel-heading"><div><span className="eyebrow">BUILDABLE PROJECTS</span><h2>Code examples for chip intelligence</h2></div><span className="quote-source">Python · simulation · observability</span></div>
              <div className="chip-project-grid">{CHIP_PROJECTS.map(project => <article key={project.title}><h3>{project.title}</h3><p>{project.text}</p><pre><code>{project.code}</code></pre></article>)}</div>
            </section>
          </>
        ) : null}

        <section className="commodity-tools-grid">
          <div className="commodity-tool-card profit-tool"><span className="eyebrow">EDUCATIONAL SCENARIO</span><h2>{t('What if I buy?')}</h2><p className="tool-subtitle">A simple long-position illustration before fees, spread, financing and contract multiplier.</p><div className="profit-inputs"><label>Capital<input type="number" min="0" value={capital} onChange={event => setCapital(event.target.value)} /></label><label>Entry price<input type="number" min="0" step="0.01" value={entry} onChange={event => setEntry(event.target.value)} /></label><label>Exit price<input type="number" min="0" step="0.01" value={exit} onChange={event => setExit(event.target.value)} /></label></div><div className={`profit-result ${profit.gross >= 0 ? 'positive' : 'negative'}`}><strong>{profit.gross >= 0 ? '+' : ''}${profit.gross.toFixed(2)}</strong><span>{profit.percent >= 0 ? '+' : ''}{profit.percent.toFixed(2)}% illustrative gross result · {profit.units.toFixed(2)} units</span></div></div>
          <div className="commodity-tool-card"><span className="eyebrow">FUTURES IN PLAIN ENGLISH</span><h2>{t('Important words')}</h2><div className="future-notes">{FUTURE_NOTES.map(([term, meaning]) => <div key={term}><b>{term}</b><p>{meaning}</p></div>)}</div></div>
        </section>

        <section className="commodity-risk-banner"><div><span className="eyebrow">RISK CHECKLIST</span><h2>Use live data as information, not a promise.</h2></div><p>Commodities can gap sharply and futures use leverage. Check contract size, expiry, margin, currency conversion, fees, liquidity and your maximum loss. This page is educational and is not financial advice.</p></section>
      </main>
    </div>
  );
}
