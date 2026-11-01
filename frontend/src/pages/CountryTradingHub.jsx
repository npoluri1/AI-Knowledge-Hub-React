import React, { useState, useEffect } from 'react';
import { useLang } from '../i18n';

const COUNTRIES = [
  {
    key: 'sg', flag: '🇸🇬', name: 'Singapore', currency: 'SGD',
    market: 'SGX', hours: '9:00 AM - 5:00 PM SGT',
    broker: 'Moomoo, Tiger Brokers, Saxo, SCB',
    localBroker: 'Moomoo (SG)',
    brokerLink: '#',
    highlights: ['CPF-OA eligible ETFs', 'No capital gains tax', 'SRS tax relief'],
    popularStocks: [
      { symbol: 'D05.SI', name: 'DBS Group', why: '#1 SG bank, 4-5% dividend' },
      { symbol: 'O39.SI', name: 'OCBC Bank', why: 'Strong ASEAN exposure' },
      { symbol: 'U11.SI', name: 'UOB', why: 'Thai/Vietnam growth' },
      { symbol: 'Z74.SI', name: 'Singtel', why: '5%+ yield, defensive' },
      { symbol: 'A17U.SI', name: 'Mapletree Industrial', why: '6%+ REIT yield' },
      { symbol: 'C38U.SI', name: 'CapitaLand Integrated', why: 'Retail REIT giant' },
    ],
    etfs: ['ES3 (STI ETF)', 'CSPX.L (S&P 500)', 'VWRA.L (All-World)', 'ABF.SI (SG Bond)'],
    bonds: ['Singapore Savings Bonds (~3%)', 'T-Bills (3-4%)', 'SGS Bonds'],
    commodities: ['Lion-OCBC Gold ETF', 'GLD via Moomoo', 'SGB (Sovereign Gold Bond)'],
    tips: [
      'Use CPF-OA to buy ES3 (STI ETF) — tax-free returns!',
      'SRS can buy SG stocks/REITs for tax savings up to S$8,000/year',
      'SG dividends under S$20K/year are tax-free for individuals',
      'Moomoo offers zero-commission SGX trades',
    ],
    riskNote: 'SG market is small (~800 stocks). Diversify with global ETFs.',
  },
  {
    key: 'us', flag: '🇺🇸', name: 'United States', currency: 'USD',
    market: 'NYSE / NASDAQ', hours: '9:30 PM - 4:00 AM SGT',
    broker: 'Moomoo, Interactive Brokers, Tiger',
    localBroker: 'Moomoo / IBKR',
    brokerLink: '#',
    highlights: ['World\'s biggest market', 'Most liquid', 'Cutting-edge companies'],
    popularStocks: [
      { symbol: 'NVDA', name: 'NVIDIA', why: 'AI chip king, explosive growth' },
      { symbol: 'AAPL', name: 'Apple', why: 'iPhone ecosystem, buybacks' },
      { symbol: 'MSFT', name: 'Microsoft', why: 'Cloud + AI + Office bundle' },
      { symbol: 'GOOGL', name: 'Alphabet', why: 'Search + YouTube + Cloud' },
      { symbol: 'AMZN', name: 'Amazon', why: 'AWS cloud + e-commerce' },
      { symbol: 'TSLA', name: 'Tesla', why: 'EV leader, robotics play' },
      { symbol: 'META', name: 'Meta', why: 'Social + AI + Metaverse' },
      { symbol: 'BRK-B', name: 'Berkshire', why: 'Buffett\'s value empire' },
    ],
    etfs: ['VOO (S&P 500)', 'QQQ (Nasdaq 100)', 'VTI (Total Market)', 'SCHD (Dividends)', 'GLD (Gold)'],
    bonds: ['US Treasury (4-5%)', 'I-Bonds (inflation-protected)', 'Corporate Bonds via ETFs'],
    commodities: ['GLD, IAU (Gold)', 'SLV (Silver)', 'USO (Oil)', 'PDBC (Multi)'],
    tips: [
      'Buy CSPX on LSE (not VOO) to avoid 30% US dividend tax!',
      'SG investors: Use CSPX.VWRA combo for 15% withholding only',
      'Dollar-cost average into VOO/CSPX monthly — most reliable strategy',
      'Pre-market 4-9:30 PM SGT, after-hours 4-8 AM SGT',
    ],
    riskNote: '15-30% withholding tax on dividends for SG residents. Use LSE-listed ETFs.',
  },
  {
    key: 'in', flag: '🇮🇳', name: 'India', currency: 'INR',
    market: 'NSE / BSE', hours: '11:45 AM - 6:00 PM SGT',
    broker: 'Zerodha Kite, Groww, Upstox, Angel One',
    localBroker: 'Zerodha Kite',
    brokerLink: '#',
    highlights: ['Fastest growing major economy', '1.4B population', 'Digital India boom'],
    popularStocks: [
      { symbol: 'RELIANCE.NS', name: 'Reliance Industries', why: 'Oil + Telecom + Retail giant' },
      { symbol: 'TCS.NS', name: 'Tata Consultancy', why: 'IT outsourcing leader' },
      { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', why: '#1 private bank' },
      { symbol: 'INFY.NS', name: 'Infosys', why: 'IT services, global clients' },
      { symbol: 'ITC.NS', name: 'ITC', why: 'FMCG + Hotels + Dividends' },
      { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', why: 'Consumer finance boom' },
      { symbol: 'TITAN.NS', name: 'Titan', why: 'Jewelry + Watches, branded' },
      { symbol: 'SBIN.NS', name: 'SBI', why: '#1 PSU bank, 6%+ yield' },
    ],
    etfs: ['Nifty 50 ETF (NSEIF)', 'Nifty Next 50 ETF', 'Nifty Bank ETF', 'Gold ETF', 'Bharat 22 ETF'],
    bonds: ['G-Sec (7%+)', 'SGB (Sovereign Gold Bond, 2.5% + gold)', 'T-Bills', 'RBI Bonds (7.15%)'],
    commodities: ['SGB (Gold + 2.5% interest!)', 'Gold ETFs on NSE', 'Silver ETFs', 'Digital gold on PhonePe'],
    tips: [
      'SGB is the BEST gold investment — 2.5% interest + gold price gains!',
      'Use Zerodha Kite for NSE/BSE trades — ₹0 brokerage on delivery',
      'STT of 0.1% on sell side for delivery trades',
      'Crypto taxed at 30% flat + 1% TDS — trade carefully!',
      'SIP (Systematic Investment Plan) into mutual funds is the easiest route',
    ],
    riskNote: 'SEBI restricts direct foreign stock purchases. Use LRS ($250K/year limit).',
  },
  {
    key: 'hk', flag: '🇭🇰', name: 'Hong Kong', currency: 'HKD',
    market: 'HKEX', hours: '9:30 AM - 4:00 PM SGT',
    broker: 'Moomoo HK, Tiger, Futu, IBKR',
    localBroker: 'Moomoo (HK)',
    brokerLink: '#',
    highlights: ['Gateway to China', 'Tech giants', 'Higher yields'],
    popularStocks: [
      { symbol: '0700.HK', name: 'Tencent', why: 'WeChat + Gaming + Cloud' },
      { symbol: '9988.HK', name: 'Alibaba', why: 'E-commerce + Cloud (cheap)' },
      { symbol: '1211.HK', name: 'BYD', why: '#1 Chinese EV maker' },
      { symbol: '2318.HK', name: 'Ping An', why: 'Insurance + Fintech' },
      { symbol: '3690.HK', name: 'Meituan', why: 'Food delivery + Local services' },
      { symbol: '0005.HK', name: 'HSBC', why: 'Global bank, 5%+ dividend' },
    ],
    etfs: ['2800.HK (Tracker Fund)', '3032.HK (Hang Seng Tech)', '3067.HK (MSCI China)', '3140.HK (CSI 300)'],
    bonds: ['iBonds (3-4%)', 'Silver Bonds', 'Green Bonds', 'HK government bonds'],
    commodities: ['GLD via HK brokers', 'Gold ETFs', 'Commodity futures on HKEX'],
    tips: [
      'HK stocks under Moomoo are commission-free for SG users!',
      'Track Fund (2800.HK) = cheapest HK market exposure',
      'Hang Seng Tech ETF (3032.HK) = pure Chinese tech play',
      'Watch out for China regulatory risk — diversify!',
    ],
    riskNote: 'China policy changes can cause 20%+ swings overnight. Size positions carefully.',
  },
  {
    key: 'global', flag: '🌍', name: 'Global Markets', currency: 'Multiple',
    market: 'Multiple Exchanges', hours: 'Varies',
    broker: 'Interactive Brokers (best for global)',
    localBroker: 'IBKR',
    brokerLink: '#',
    highlights: ['Diversify across 30+ countries', 'Reduce single-country risk'],
    popularStocks: [
      { symbol: 'ASML.AS', name: 'ASML (Netherlands)', why: 'Only EUV chip lithography' },
      { symbol: 'NOVO-B.CO', name: 'Novo Nordisk (Denmark)', why: 'Ozempic obesity drug' },
      { symbol: 'MC.PA', name: 'LVMH (France)', why: 'Luxury goods conglomerate' },
      { symbol: '7203.T', name: 'Toyota (Japan)', why: '#1 auto maker, hybrid leader' },
      { symbol: '005930.KS', name: 'Samsung (Korea)', why: '#1 memory chips' },
      { symbol: 'BHP.AX', name: 'BHP (Australia)', why: '#1 mining, iron ore' },
    ],
    etfs: ['VWRA.L (All-World)', 'IWDA.L (Developed)', 'EEM (Emerging Markets)', 'EWJ (Japan)', 'EWY (Korea)'],
    bonds: ['Global bond ETFs (AGG, BND)', 'iBonds (HK)', 'UK Gilts', 'German Bunds', 'Japanese JGBs'],
    commodities: ['GLD (Gold)', 'SLV (Silver)', 'PDBC (Broad Commodities)', 'URA (Uranium)'],
    tips: [
      'VWRA.L gives you 8,700+ stocks across 47 countries in ONE ETF',
      'IWDA.L + EEM = developed + emerging split (more control)',
      'IBKR supports 33 markets — best for serious global investors',
      'Use USD-hedged ETFs if you want to avoid currency risk',
    ],
    riskNote: 'Multiple currencies add complexity. VWRA auto-hedges via USD base.',
  },
];

export default function CountryTradingHub() {
  const { t } = useLang();
  const [activeCountry, setActiveCountry] = useState('sg');
  const [liveQuotes, setLiveQuotes] = useState({});
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  const country = COUNTRIES.find(c => c.key === activeCountry) || COUNTRIES[0];

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoadingQuotes(true);
      const symbols = country.popularStocks.map(s => s.symbol).join(',');
      try {
        const res = await fetch(`/api/market/quotes?symbols=${symbols}`);
        if (res.ok) {
          const json = await res.json();
          const map = {};
          (json.quotes || []).forEach(q => { map[q.symbol] = q; });
          setLiveQuotes(map);
        }
      } catch (e) {
        console.error('Failed to fetch quotes:', e);
      } finally {
        setLoadingQuotes(false);
      }
    };
    fetchQuotes();
  }, [activeCountry, country.popularStocks]);

  return (
    <div className="country-trading-hub">
      {/* Hero */}
      <div className="cth-hero">
        <div className="cth-hero-glow" />
        <div className="cth-hero-content">
          <h1>🌍 {t('Country Trading Hub')}</h1>
          <p>AI-powered insights for trading in every major market — broker guides, top picks, tax tips, and live prices</p>
        </div>
      </div>

      {/* Country Tabs */}
      <div className="cth-tabs">
        {COUNTRIES.map(c => (
          <button
            key={c.key}
            className={`cth-tab ${activeCountry === c.key ? 'active' : ''}`}
            onClick={() => setActiveCountry(c.key)}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {/* Country Content */}
      <div className="cth-content">
        {/* Market Info Card */}
        <div className="cth-market-card">
          <div className="cth-market-header">
            <h2>{country.flag} {country.name} Trading Guide</h2>
            <span className="cth-market-badge">{country.currency}</span>
          </div>
          <div className="cth-market-info-grid">
            <div className="cth-info-item">
              <span className="cth-info-label">📈 {t('Market')}</span>
              <span className="cth-info-value">{country.market}</span>
            </div>
            <div className="cth-info-item">
              <span className="cth-info-label">🕐 {t('Hours')}</span>
              <span className="cth-info-value">{country.hours}</span>
            </div>
            <div className="cth-info-item">
              <span className="cth-info-label">📱 {t('Best Broker')}</span>
              <span className="cth-info-value">{country.localBroker}</span>
            </div>
            <div className="cth-info-item">
              <span className="cth-info-label">🌐 {t('Also')}</span>
              <span className="cth-info-value">{country.broker}</span>
            </div>
          </div>
          <div className="cth-highlights">
            {country.highlights.map((h, i) => (
              <span key={i} className="cth-highlight-badge">✅ {h}</span>
            ))}
          </div>
        </div>

        {/* Popular Stocks with Live Prices */}
        <div className="cth-section">
          <h3>🌟 {t('Top Stocks')} — {country.name} {loadingQuotes && <span className="cth-loading-badge">Loading live...</span>}</h3>
          <div className="cth-stocks-grid">
            {country.popularStocks.map((stock, i) => {
              const q = liveQuotes[stock.symbol] || {};
              const isUp = (q.changePct || 0) >= 0;
              return (
                <div key={i} className="cth-stock-card">
                  <div className="cth-stock-top">
                    <span className="cth-stock-symbol">{stock.symbol}</span>
                    {q.changePct != null && (
                      <span className={`cth-stock-change ${isUp ? 'up' : 'down'}`}>
                        {isUp ? '▲' : '▼'} {Math.abs(q.changePct).toFixed(2)}%
                      </span>
                    )}
                  </div>
                  <div className="cth-stock-name">{q.name || stock.name}</div>
                  <div className="cth-stock-price">
                    {q.price ? `$${q.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                  </div>
                  <div className="cth-stock-why">{stock.why}</div>
                  <div className="cth-stock-meta">
                    {q.marketCap && <span>MCap: {q.marketCap >= 1e12 ? `$${(q.marketCap/1e12).toFixed(1)}T` : q.marketCap >= 1e9 ? `$${(q.marketCap/1e9).toFixed(1)}B` : `$${(q.marketCap/1e6).toFixed(0)}M`}</span>}
                    {q.pe && <span>P/E: {q.pe}</span>}
                    {q.dividendYield && <span>Yield: {(q.dividendYield * 100).toFixed(1)}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ETFs, Bonds, Commodities */}
        <div className="cth-trio-grid">
          <div className="cth-section cth-trio-card">
            <h3>📦 {t('Best ETFs')}</h3>
            <ul className="cth-list">
              {country.etfs.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
          <div className="cth-section cth-trio-card">
            <h3>🏛️ {t('Bonds & Fixed Income')}</h3>
            <ul className="cth-list">
              {country.bonds.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          <div className="cth-section cth-trio-card">
            <h3>🪙 {t('Gold, Oil & Commodities')}</h3>
            <ul className="cth-list">
              {country.commodities.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>

        {/* Trading Tips */}
        <div className="cth-section cth-tips-card">
          <h3>🤖 {t('AI Trading Tips')} — {country.name}</h3>
          <div className="cth-tips-grid">
            {country.tips.map((tip, i) => (
              <div key={i} className="cth-tip-item">
                <span className="cth-tip-num">{i + 1}</span>
                <span className="cth-tip-text">{tip}</span>
              </div>
            ))}
          </div>
          <div className="cth-risk-note">
            ⚠️ <strong>Risk Note:</strong> {country.riskNote}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="cth-section cth-quickstart-card">
          <h3>🚀 {t('Quick Start — How to Invest in')} {country.name}</h3>
          <div className="cth-steps">
            {[
              { step: 1, title: 'Open Broker Account', desc: `Sign up on ${country.localBroker}. Complete KYC (1-2 days).` },
              { step: 2, title: 'Fund Your Account', desc: 'Transfer via bank wire or PayNow/FAST. Wait 1-2 business days.' },
              { step: 3, title: 'Start with ETFs', desc: `Buy a diversified ETF first (${country.etfs[0]}). This is your core holding.` },
              { step: 4, title: 'Add Individual Stocks', desc: `Pick 2-3 top stocks from the list above. Max 10% per stock.` },
              { step: 5, title: 'Set Alerts & Monitor', desc: 'Set price alerts at ±10% from entry. Check weekly, not daily.' },
              { step: 6, title: 'Reinvest Dividends', desc: 'Turn on DRIP (dividend reinvestment) for compound growth.' },
            ].map(s => (
              <div key={s.step} className="cth-step">
                <div className="cth-step-num">{s.step}</div>
                <div className="cth-step-content">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
