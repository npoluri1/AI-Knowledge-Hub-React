import React, { useState, useEffect, useCallback } from 'react';
import InvestmentPlaybook from './InvestmentPlaybook';
import LiveFinancialAdvisor from './LiveFinancialAdvisor';
import LiveInvestments from './LiveInvestments';
import DailyTrading from './DailyTrading';
import CountryTradingHub from './CountryTradingHub';
import GlobalInvestmentResearch from './GlobalInvestmentResearch';
import TaxSavingFunds from './TaxSavingFunds';
import TradingTerminal from './TradingTerminal';
import TradingAcademy from './TradingAcademy';
import InvestmentUniverse from './InvestmentUniverse';
import PlainEnglish from './PlainEnglish';
import TradingPhotos, { SECTION_PHOTO, photoUrl } from './TradingPhotos';
const SIDEBAR_PHOTO = { ...SECTION_PHOTO, terminal: 'screen', plain: 'study', academy: 'trader', universe: 'portfolio' };
import './TradingPage.css';
import './TradingNewSections.css';
import { useLang } from '../i18n';

const SECTIONS = [
  { id: 'terminal', icon: '🖥️', label: 'Real-Time Terminal & Forecast', color: '#ef4444' },
  { id: 'plain', icon: '🗣️', label: 'Trading in Plain English', color: '#ffd24a' },
  { id: 'academy', icon: '🧭', label: 'Trading Academy (8 stages)', color: '#2ee6a8' },
  { id: 'universe', icon: '🧺', label: 'Every Way to Invest', color: '#3987e5' },
  { id: 'basics', icon: '🎓', label: 'Trading Basics', color: '#ffd24a' },
  { id: 'research', icon: '🌐', label: 'Global Research Workbook', color: '#10b981' },
  { id: 'taxsaving', icon: '💸', label: 'Tax-Saving & Retirement Funds', color: '#22c55e' },
  { id: 'topstocks', icon: '🌟', label: 'Top Stocks to Watch', color: '#ff6b9d' },
  { id: 'categories', icon: '🗂️', label: 'Trading Categories', color: '#35e0ff' },
  { id: 'stocks', icon: '📈', label: 'Stocks & Shares', color: '#4da6ff' },
  { id: 'bonds', icon: '🏛️', label: 'Bonds', color: '#b388ff' },
  { id: 'countryfunds', icon: '🏦', label: 'Country Funds & Bonds', color: '#ff8c42' },
  { id: 'etfs', icon: '📦', label: 'ETFs & Funds', color: '#2ee6a8' },
  { id: 'etfdirectory', icon: '📚', label: 'Global ETF Directory', color: '#ffd24a' },
  { id: 'mutual', icon: '🤝', label: 'Mutual Funds', color: '#35e0ff' },
  { id: 'commodities', icon: '🪙', label: 'Gold, Oil & Commodities', color: '#ffd24a' },
  { id: 'crypto', icon: '₿', label: 'Crypto', color: '#ff8c42' },
  { id: 'forex', icon: '💱', label: 'Forex', color: '#ff6b9d' },
  { id: 'indices', icon: '📊', label: 'Indices & Futures', color: '#2ee6a8' },
  { id: 'options', icon: '🎯', label: 'Options', color: '#ffd24a' },
  { id: 'countries', icon: '🌍', label: 'Country Markets', color: '#4da6ff' },
  { id: 'advanced', icon: '⚡', label: 'Advanced Topics', color: '#b388ff' },
  { id: 'sixmonth', icon: '🗓️', label: '6-Month Buy/Sell Plan', color: '#2ee6a8' },
  { id: 'rankings', icon: '🏆', label: 'Rankings & Fund Houses', color: '#ff6b9d' },
  { id: 'strategies', icon: '🎯', label: 'Strategies', color: '#ffd24a' },
  { id: 'apps', icon: '📱', label: 'Broker Apps', color: '#b388ff' },
  { id: 'liveticker', icon: '🔴', label: 'Live Market Data', color: '#ff4444' },
  { id: 'compare', icon: '⚔️', label: 'Stock Comparison', color: '#35e0ff' },
  { id: 'playbook', icon: '📋', label: 'Investment Playbook', color: '#ffd24a' },
  { id: 'advisor', icon: '🤖', label: 'Live Financial Advisor', color: '#6366f1' },
  { id: 'liveinv', icon: '💰', label: 'Live Investments', color: '#22c55e' },
  { id: 'daily', icon: '📊', label: 'Daily Trading', color: '#f59e0b' },
  { id: 'hub', icon: '🌍', label: 'Country Trading Hub', color: '#3b82f6' },
];

/* ═══════════════ TRADING BASICS ═══════════════ */
function TradingBasics() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🎓 Trading & Investing Basics</h2>
        <p>Everything a complete beginner needs — explained like youre having coffee with a friend.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is Trading?</h3>
        <div className="tp-concept-box">
          <h5>🛒 In Plain English:</h5>
          <p>Trading is simply <strong>buying something cheap and selling it later for more money</strong>. That's it. Whether its stocks, gold, or sneakers — the concept is the same.</p>
          <div className="tp-analogy">
            💡 <strong>Analogy:</strong> You buy a limited-edition sneaker for $100. A week later, people want it badly and you sell it for $150. You just "traded" — you made a $50 profit.
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>⚔️ Investing vs Trading</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box">
            <h5>🏦 Investing (Long-term)</h5>
            <p>You buy something and <strong>hold it for months or years</strong>.</p>
            <ul className="tp-list" style={{ marginTop: 12 }}>
              <li>Time: <strong>1 to 30+ years</strong></li>
              <li>Check: <strong>Once a week or month</strong></li>
              <li>Stress: <strong>Low</strong> 😌</li>
              <li>Typical return: <strong>7-10% per year</strong></li>
            </ul>
          </div>
          <div className="tp-concept-box">
            <h5>⚡ Trading (Short-term)</h5>
            <p>You buy and <strong>sell within days, hours, or minutes</strong>.</p>
            <ul className="tp-list" style={{ marginTop: 12 }}>
              <li>Time: <strong>Seconds to weeks</strong></li>
              <li>Check: <strong>Multiple times per day</strong></li>
              <li>Stress: <strong>High</strong> 😰</li>
              <li>Typical result: <strong>70-90% of day traders LOSE money</strong></li>
            </ul>
          </div>
        </div>
        <div className="tp-alert tp-alert-success" style={{ marginTop: 16 }}>
          ✅ <strong>Beginner Advice:</strong> Start with INVESTING, not trading. Buy good ETFs and hold them.
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>🏟️ How Markets Work</h3>
        <div className="tp-concept-box">
          <p>The stock market is like a <strong>giant online marketplace</strong> where people buy and sell tiny pieces of companies.</p>
          <div className="tp-analogy">
            💡 Imagine a lemonade stand owned by 100 friends. Buy 1 share = own 1%. If the stand makes $1,000, your 1% = $10!
          </div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>🇺🇸 US Markets</h5><p>9:30 AM - 4:00 PM ET<br/><span className="tp-muted">= 9:30 PM - 4:00 AM SGT</span></p></div>
          <div className="tp-concept-box"><h5>🇸🇬 SGX (Singapore)</h5><p>9:00 AM - 5:00 PM SGT<br/><span className="tp-muted">With 12-1pm lunch break</span></p></div>
          <div className="tp-concept-box"><h5>🇮🇳 India (NSE/BSE)</h5><p>9:15 AM - 3:30 PM IST<br/><span className="tp-muted">= 11:45 AM - 6:00 PM SGT</span></p></div>
        </div>
        <div className="tp-grid-2" style={{ marginTop: 12 }}>
          <div className="tp-concept-box"><h5>🇭🇰 HKEX (Hong Kong)</h5><p>9:30 AM - 4:00 PM HKT<br/><span className="tp-muted">= 9:30 AM - 4:00 PM SGT</span></p></div>
          <div className="tp-concept-box"><h5>🇯🇵 TSE (Japan)</h5><p>9:00 AM - 3:00 PM JST<br/><span className="tp-muted">= 8:00 AM - 2:00 PM SGT</span></p></div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>📊 All Trading Types at a Glance</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Type</th><th>What It Is</th><th>Risk</th><th>Best For</th></tr></thead>
            <tbody>
              {[
                { t: 'Stocks/Shares', w: 'Own a piece of a company', r: 'Medium', b: 'Growth & dividends' },
                { t: 'Bonds', w: 'Lend money to govts/companies', r: 'Low', b: 'Safety & steady income' },
                { t: 'ETFs', w: 'Basket of stocks in one purchase', r: 'Low-Med', b: 'Diversification' },
                { t: 'Mutual Funds', w: 'Professional manages a pool of money', r: 'Low-Med', b: 'Hands-off investing' },
                { t: 'Commodities', w: 'Physical goods: gold, oil, wheat', r: 'High', b: 'Inflation hedge' },
                { t: 'Crypto', w: 'Digital currencies on blockchain', r: 'Very High', b: 'High risk/reward' },
                { t: 'Forex', w: 'Trading currencies against each other', r: 'Very High', b: 'Currency speculation' },
                { t: 'Options', w: 'Right to buy/sell at set price', r: 'Very High', b: 'Leveraged bets' },
                { t: 'Futures', w: 'Obligation to buy/sell at set date', r: 'Very High', b: 'Hedging & speculating' },
                { t: 'Structured Products', w: 'Packaged investment tied to assets', r: 'Medium-High', b: 'Tailored returns' },
              ].map(r => (
                <tr key={r.t}><td><strong>{r.t}</strong></td><td>{r.w}</td><td className="tp-example-cell">{r.r}</td><td>{r.b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-cyan">
        <h3>📖 Essential Glossary</h3>
        <div className="tp-grid-2">
          {[
            { w: 'Bull Market', m: 'Market going UP 📈', e: 'S&P 500 rose from 3,800 to 5,800 in 2023-2024.' },
            { w: 'Bear Market', m: 'Market going DOWN 20%+ 📉', e: 'S&P 500 fell from 4,800 to 3,500 in 2022.' },
            { w: 'Market Cap', m: 'Total value = Price × Shares', e: 'Apple: $325 × 15B shares = $4.8 trillion.' },
            { w: 'P/E Ratio', m: 'How much you pay per $1 of profit', e: 'P/E of 15 = you pay $15 for every $1 annual profit.' },
            { w: 'Dividend', m: 'Cash companies pay to shareholders', e: 'DBS pays S$1.50/yr. Own 100 shares = S$150/yr free!' },
            { w: 'Volatility', m: 'How wildly prices swing', e: 'Bitcoin: 10% daily. SG REITs: 0.5% daily.' },
            { w: 'Stop Loss', m: 'Auto-sell if price drops to a level', e: 'Buy at $217, stop loss at $195. Max loss = $22/share.' },
            { w: 'Long Position', m: 'Own stock, profit when it goes UP', e: 'Buy Apple $300, sell $350 = $50 profit.' },
            { w: 'Short Selling', m: 'Bet AGAINST stock — profit when DOWN', e: 'Borrow at $350, sell, buy back at $300 = $50 profit.' },
            { w: 'RSI', m: 'Overbought (>70) or oversold (<30)', e: 'RSI 75 = "went up too fast, might drop."' },
          ].map((g, i) => (
            <div key={i} className="tp-concept-box">
              <h5><span className="tp-badge tp-badge-flat">{g.w}</span></h5>
              <p><strong>{g.m}</strong></p>
              <p className="tp-muted" style={{ marginTop: 4 }}>💡 {g.e}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ STOCKS & SHARES ═══════════════ */
function StocksGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>📈 Stocks & Shares — Complete Guide</h2>
        <p>Every type of stock explained with real examples from SG, US, HK, and India.</p>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>📏 Stock Size Categories</h3>
        <div className="tp-grid-4">
          {[
            { icon: '🏛️', name: 'Large Cap', price: '$200B+', ex: 'Apple $3T, MSFT $3.6T, DBS S$120B', risk: 'LOW 🟢', color: '#ffd24a', pct: '90%' },
            { icon: '🏢', name: 'Mid Cap', price: '$10B-$200B', ex: 'Snap, Roblox, CrowdStrike, Sea Ltd', risk: 'MEDIUM 🟡', color: '#4da6ff', pct: '65%' },
            { icon: '🏠', name: 'Small Cap', price: '$300M-$10B', ex: 'Biotech startups, regional banks', risk: 'HIGH 🟠', color: '#ff8c42', pct: '45%' },
            { icon: '🎰', name: 'Micro Cap', price: '<$300M', ex: 'Stocks under $5, shell companies', risk: 'VERY HIGH 🔴', color: '#ff6b9d', pct: '20%' },
          ].map(s => (
            <div key={s.name} className="tp-compare-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="tp-emoji">{s.icon}</div>
              <h4>{s.name}</h4>
              <p className="tp-price" style={{ color: s.color }}>{s.price}</p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.ex}</p>
              <div className="tp-meter"><div className="tp-meter-fill" style={{ width: s.pct, background: s.color }} /></div>
              <p className="tp-muted" style={{ marginTop: 8, fontSize: '0.72rem' }}>Risk: {s.risk}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>🎨 Stock Investment Styles</h3>
        <div className="tp-grid-3">
          <div className="tp-learn-card gold"><div className="tp-learn-card-icon">🚀</div><h4>Growth Stocks</h4><p>Companies growing REVENUE fast. No dividends — all profits reinvested.</p><div className="tp-analogy">💡 Like a young athlete training to become a champion.</div><ul className="tp-list" style={{ marginTop: 10 }}><li><strong>US:</strong> NVIDIA, Tesla, Amazon</li><li><strong>SG:</strong> Sea Ltd (SE), Grab</li><li><strong>HK:</strong> Meituan, Alibaba</li><li><strong>India:</strong> Zomato, Paytm, Nykaa</li></ul><span className="tp-tag tp-tag-intermediate">Higher Risk</span></div>
          <div className="tp-learn-card green"><div className="tp-learn-card-icon">💰</div><h4>Value Stocks</h4><p>Companies that seem CHEAP compared to their actual worth.</p><div className="tp-analogy">💡 Like buying a $100 shirt on sale for $40.</div><ul className="tp-list" style={{ marginTop: 10 }}><li><strong>US:</strong> Berkshire, JPMorgan, J&J</li><li><strong>SG:</strong> DBS, Singtel, CapitaLand</li><li><strong>India:</strong> SBI, Infosys, TCS</li><li><strong>HK:</strong> HSBC, AIA Group</li></ul><span className="tp-tag tp-tag-beginner">Lower Risk</span></div>
          <div className="tp-learn-card blue"><div className="tp-learn-card-icon">🏠</div><h4>Dividend Stocks</h4><p>Companies that pay you CASH every quarter.</p><div className="tp-analogy">💡 Like owning an apartment that pays you rent.</div><ul className="tp-list" style={{ marginTop: 10 }}><li><strong>SG:</strong> DBS 4.5%, Singtel 5.2%, Mapletree 6%+</li><li><strong>US:</strong> Coca-Cola, J&J, Realty Income</li><li><strong>India:</strong> ITC, ONGC, Coal India</li><li><strong>HK:</strong> CLP Holdings, Hong Kong Telecom</li></ul><span className="tp-tag tp-tag-beginner">Lower Risk</span></div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>🏭 Stock Sectors — Which to Pick?</h3>
        <div className="tp-grid-3">
          {[
            { icon: '💻', name: 'Technology', us: 'Apple, NVDA, MSFT, Google', sg: 'Venture Corp, FST', hk: 'Tencent, Lenovo', in_: 'TCS, Infosys, Wipro', risk: 'Higher', color: '#4da6ff' },
            { icon: '🏥', name: 'Healthcare', us: 'J&J, Pfizer, UnitedHealth', sg: 'Raffles Medical', hk: 'WuXi AppTec', in_: 'Sun Pharma, Dr Reddy\'s', risk: 'Medium', color: '#2ee6a8' },
            { icon: '🏦', name: 'Finance', us: 'JPMorgan, BofA, Goldman', sg: 'DBS, OCBC, UOB', hk: 'HSBC, AIA, Ping An', in_: 'SBI, HDFC Bank, ICICI', risk: 'Medium', color: '#ffd24a' },
            { icon: '⚡', name: 'Energy', us: 'ExxonMobil, Chevron', sg: 'Keppel Corp', hk: 'CNOOC, PetroChina', in_: 'Reliance, ONGC', risk: 'Higher', color: '#ff8c42' },
            { icon: '🏗️', name: 'REITs/Property', us: 'Prologis, American Tower', sg: 'CapitaLand, Mapletree', hk: 'Link REIT, Sun Hung Kai', in_: 'Embassy REIT, Mindspace', risk: 'Medium', color: '#b388ff' },
            { icon: '🛒', name: 'Consumer', us: 'Amazon, Costco, Nike', sg: 'Thai Beverage, Jardine', hk: 'Li Ning, ANTA Sports', in_: 'Titan, Hindustan Unilever', risk: 'Lower', color: '#ff6b9d' },
            { icon: '🚗', name: 'Auto/EV', us: 'Tesla, Rivian, GM', sg: '-', hk: 'BYD, NIO, XPeng', in_: 'Tata Motors, M&M', risk: 'Higher', color: '#35e0ff' },
            { icon: '⛏️', name: 'Mining/Resources', us: 'Freeport-McMoRan', sg: 'Keppel, Sembcorp', hk: 'China Shenhua', in_: 'Tata Steel, Vedanta', risk: 'Higher', color: '#ffd24a' },
            { icon: '🎮', name: 'Entertainment', us: 'Disney, Netflix, Spotify', sg: '-', hk: 'Bilibili, iQIYI', in_: 'Zee Entertainment', risk: 'Medium', color: '#ff6b9d' },
          ].map(s => (
            <div key={s.name} className="tp-concept-box" style={{ borderLeft: `3px solid ${s.color}` }}>
              <h5>{s.icon} {s.name}</h5>
              <p style={{ fontSize: '0.8rem' }}>🇺🇸 {s.us}</p>
              <p style={{ fontSize: '0.8rem' }}>🇸🇬 {s.sg}</p>
              <p style={{ fontSize: '0.8rem' }}>🇭🇰 {s.hk}</p>
              <p style={{ fontSize: '0.8rem' }}>🇮🇳 {s.in_}</p>
              <p className="tp-muted" style={{ marginTop: 6 }}>Risk: {s.risk}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>🌟 Special Stock Types</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box"><h5>🔷 IPO Stocks</h5><p>When a company sells shares publicly for the FIRST time.</p><div className="tp-analogy">💡 Google IPO at $85 in 2004 → now $346. But most IPOs DROP after listing!</div></div>
          <div className="tp-concept-box"><h5>🔄 Blue Chip Stocks</h5><p>Big, established, financially strong companies.</p><div className="tp-analogy">💡 Like the Hilton Hotel of investing — reliable, rarely lets you down.</div></div>
          <div className="tp-concept-box"><h5>📊 REIT Stocks</h5><p>Companies that own buildings and pay you rent from tenants.</p><div className="tp-analogy">💡 100 people pool money to buy a mall. Rent is shared proportionally.</div><p style={{ marginTop: 8, fontSize: '0.8rem' }}>🇸🇬 Best: Mapletree Industrial Trust (6%+ yield), CapitaLand Integrated</p></div>
          <div className="tp-concept-box"><h5>⚠️ Penny Stocks</h5><p>Stocks under $5 — like lottery tickets. Most fail.</p><div className="tp-alert tp-alert-danger" style={{ marginTop: 8 }}>🔴 95% of penny stock investors LOSE money. Stay away!</div></div>
          <div className="tp-concept-box"><h5>🏦 Penny Stocks (SG)</h5><p>SGX has many penny stocks under S$0.50.</p><div className="tp-alert tp-alert-warning" style={{ marginTop: 8 }}>🟡 Very illiquid — hard to sell. Spread can eat your profit.</div></div>
          <div className="tp-concept-box"><h5>💎 SUSS/Privatised Stocks</h5><p>Companies being taken private by owners.</p><div className="tp-analogy">💡 Like an owner buying back all shares from the public. Price usually jumps 30-50%.</div></div>
        </div>
      </div>

      <div className="tp-card tp-card-cyan">
        <h3>🔍 How to Pick Stocks — Checklist</h3>
        <div className="tp-steps">
          <div className="tp-step tp-step-green"><div className="tp-step-num">1</div><div><h4>Understand What It Does</h4><p>Can you explain it in ONE sentence? If not, dont buy it.</p></div></div>
          <div className="tp-step tp-step-blue"><div className="tp-step-num">2</div><div><h4>Check if It Makes Money</h4><p>Revenue and profit should be GROWING year after year.</p></div></div>
          <div className="tp-step tp-step-purple"><div className="tp-step-num">3</div><div><h4>Check Valuation</h4><p>P/E {'>'}40 = expensive. {'<'}20 = generally cheap. Use PEG ratio too.</p></div></div>
          <div className="tp-step tp-step-orange"><div className="tp-step-num">4</div><div><h4>Check Dividends</h4><p>Growing dividends = healthy company. Check dividend yield AND payout ratio.</p></div></div>
          <div className="tp-step tp-step-pink"><div className="tp-step-num">5</div><div><h4>Diversify</h4><p>No single stock {'>'}10% of your portfolio. Spread across sectors and countries.</p></div></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ BONDS ═══════════════ */
function BondsGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🏛️ Bonds — The Safe Stuff</h2>
        <p>Lend money to governments/companies. Get it back with interest.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is a Bond?</h3>
        <div className="tp-concept-box">
          <h5>🤝 The Lending Analogy:</h5>
          <p>A bond is when you <strong>lend money</strong> and they promise to pay you back with interest.</p>
          <div className="tp-analogy">💡 Your friend borrows $1,000, promises $1,100 back in 2 years. The extra $100 = interest. Bonds = same, but with governments/companies.</div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>📊 Types of Bonds</h3>
        <div className="tp-grid-3">
          {[
            { icon: '🇺🇸', name: 'US Treasury Bonds', yield: '4-5%', risk: 'Very Low', desc: 'Backed by US government. Safest in the world.' },
            { icon: '🇸🇬', name: 'SG Savings Bonds (SSB)', yield: '~3%', risk: 'Zero', desc: 'Min $500, max $200K. Buy at DBS/OCBC/UOB ATM.' },
            { icon: '🏢', name: 'Corporate Bonds', yield: '4-7%', risk: 'Low-Med', desc: 'Companies borrow from you. Higher yield = higher risk.' },
            { icon: '🌍', name: 'Municipal Bonds', yield: '3-5%', risk: 'Low', desc: 'Cities/states borrow. Often tax-free income!' },
            { icon: '📈', name: 'High-Yield (Junk) Bonds', yield: '6-10%', risk: 'High', desc: 'Risky companies pay more interest. Can default!' },
            { icon: '🌐', name: 'Global Bonds', yield: '3-6%', risk: 'Med', desc: 'Diversify across countries. SGD-hedged options exist.' },
          ].map(b => (
            <div key={b.name} className="tp-concept-box">
              <h5>{b.icon} {b.name}</h5>
              <p><strong>Yield: {b.yield}/year</strong> | Risk: {b.risk}</p>
              <p className="tp-muted" style={{ marginTop: 6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>💰 How Bonds Work (Layman Example)</h3>
        <div className="tp-concept-box">
          <h5>📖 Step by Step:</h5>
          <div className="tp-example-box">
            You buy a 5-year US Treasury Bond for $1,000 at 4.5% yield.<br/><br/>
            ✅ Every 6 months, the US government pays you $22.50 (half of 4.5%)<br/>
            ✅ After 5 years, you get your $1,000 back<br/>
            ✅ Total earned: $225 in interest over 5 years<br/>
            ✅ Risk: Almost ZERO — US government rarely defaults
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>🏦 Best Bonds for Each Country</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Country</th><th>Best Option</th><th>Yield</th><th>How to Buy</th></tr></thead>
            <tbody>
              <tr><td>🇸🇬 Singapore</td><td><strong>SSB + T-bills</strong></td><td>~3%</td><td>DBS ATM / OCBC / UOB</td></tr>
              <tr><td>🇺🇸 USA</td><td><strong>US Treasury (I-Bonds)</strong></td><td>~4.5%</td><td>TreasuryDirect.gov / Moomoo</td></tr>
              <tr><td>🇮🇳 India</td><td><strong>G-Sec + SGB</strong></td><td>~7%</td><td>Zerodha Kite / Groww</td></tr>
              <tr><td>🇭🇰 HK</td><td><strong>iBonds + Silver Bonds</strong></td><td>~3-4%</td><td>HSBC / Standard Chartered</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ ETFs & FUNDS ═══════════════ */
function ETFsGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>📦 ETFs — The Best Investment for Most People</h2>
        <p>Why 90% of financial advisors tell beginners to buy ETFs.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is an ETF?</h3>
        <div className="tp-concept-box">
          <h5>🍕 The Pizza Analogy:</h5>
          <p>An <strong>ETF</strong> is like buying a whole pizza instead of one topping. Instead of one company, you buy MANY companies at once.</p>
          <div className="tp-analogy">💡 CSPX ETF = tiny piece of 500 companies (Apple, MSFT, NVDA, Amazon, Google + 495 more) in ONE purchase!</div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>⭐ Best ETFs by Category</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Category</th><th>ETF</th><th>Ticker</th><th>What It Tracks</th><th>Why Good</th></tr></thead>
            <tbody>
              {[
                { cat: '🏆 S&P 500', t: 'iShares S&P 500', tk: 'CSPX', tracks: 'Top 500 US', why: 'BEST for SG: 15% tax, no estate tax' },
                { cat: '🌍 Global', t: 'Vanguard All-World', tk: 'VWRA', tracks: '8,700+ stocks', why: 'Own the ENTIRE world in 1 ETF' },
                { cat: '🇺🇸 US Tech', t: 'Invesco QQQ', tk: 'QQQ', tracks: 'Top 100 tech', why: 'NVDA, AAPL, MSFT heavy' },
                { cat: '🇸🇬 SG', t: 'STI ETF', tk: 'ES3', tracks: 'Top 30 SG', why: 'CPF-OA eligible, local exposure' },
                { cat: '🇮🇳 India', t: 'Nippon India Nifty 50', tk: 'NSEIF', tracks: 'Top 50 India', why: 'India growth story' },
                { cat: '🇭🇰 HK', t: 'Tracker Fund', tk: '2800.HK', tracks: 'Hang Seng', why: 'Cheapest HK exposure' },
                { cat: '🇯🇵 Japan', t: 'iShares MSCI Japan', tk: 'EWJ', tracks: 'Top Japan', why: 'Japan recovery play' },
                { cat: '🇰🇷 Korea', t: 'iShares MSCI Korea', tk: 'EWY', tracks: 'Top Korea', why: 'Samsung, SK Hynix exposure' },
                { cat: '🪙 Gold', t: 'SPDR Gold Shares', tk: 'GLD', tracks: 'Gold price', why: 'Inflation hedge' },
                { cat: '🛢️ Oil', t: 'United States Oil Fund', tk: 'USO', tracks: 'Oil price', why: 'Oil exposure without futures' },
                { cat: '📦 Bonds', t: 'iShares Core US Agg Bond', tk: 'AGG', tracks: 'US bonds', why: 'Stable income' },
                { cat: '🏠 REITs', t: 'Vanguard REIT ETF', tk: 'VNQ', tracks: 'US REITs', why: 'Real estate without buying property' },
              ].map(e => (
                <tr key={e.tk}>
                  <td>{e.cat}</td>
                  <td><strong>{e.t}</strong></td>
                  <td className="tp-ticker">{e.tk}</td>
                  <td>{e.tracks}</td>
                  <td className="tp-example-cell">{e.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>⚡ Special ETF Types</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ff6b9d' }}>
            <h5>🔥 High Dividend ETFs</h5>
            <ul className="tp-list"><li><strong>SCHD</strong> — Schwab US Dividend (3.5% yield)</li><li><strong>VYM</strong> — Vanguard High Dividend (2.8%)</li><li><strong>RETL</strong> — Global REIT ETF (5%+ yield)</li></ul>
            <p className="tp-muted" style={{ marginTop: 8 }}>Best for: Income seekers, retirees</p>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ff8c42' }}>
            <h5>🚀 Leveraged ETFs (HIGH RISK)</h5>
            <ul className="tp-list"><li><strong>TQQQ</strong> — 3x Nasdaq returns (and losses!)</li><li><strong>SSO</strong> — 2x S&P 500</li><li><strong>UPRO</strong> — 3x S&P 500</li></ul>
            <div className="tp-alert tp-alert-danger" style={{ marginTop: 8 }}>🔴 Can LOSE 3x as fast! NOT for beginners!</div>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #2ee6a8' }}>
            <h5>📊 Single Stock ETFs</h5>
            <ul className="tp-list"><li><strong>TSLL</strong> — 2x Tesla</li><li><strong>NVDL</strong> — 2x NVIDIA</li><li><strong>FNGU</strong> — 3x FANG+ stocks</li></ul>
            <div className="tp-alert tp-alert-warning" style={{ marginTop: 8 }}>🟡 Very risky. Only for short-term trades.</div>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #4da6ff' }}>
            <h5>🏠 Stable Income Index ETFs</h5>
            <ul className="tp-list"><li><strong>SCHD</strong> — Dividend aristocrats</li><li><strong>VIG</strong> — Vanguard Dividend Growth</li><li><strong>DGRO</strong> — iShares Dividend Growth</li></ul>
            <p className="tp-muted" style={{ marginTop: 8 }}>Best for: Long-term passive income</p>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #b388ff' }}>
            <h5>🌍 High Return Leveraged ETFs</h5>
            <ul className="tp-list"><li><strong>TQQQ</strong> — 3x Nasdaq</li><li><strong>SOXL</strong> — 3x Semiconductors</li><li><strong>FNGU</strong> — 3x FANG+</li><li><strong>TNA</strong> — 3x Russell 2000</li></ul>
            <div className="tp-alert tp-alert-danger" style={{ marginTop: 8 }}>🔴 Can drop 90%+ in bear markets!</div>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ffd24a' }}>
            <h5>🏗️ High Return Leveraged ETFs (SG Available)</h5>
            <ul className="tp-list"><li><strong>QQQ</strong> on Moomoo (no leverage)</li><li><strong>CSPX</strong> on LSE via Moomoo</li><li><strong>EWJ</strong> for Japan via IBKR</li></ul>
            <p className="tp-muted" style={{ marginTop: 8 }}>SG investors: Use Moomoo or IBKR for global leveraged ETFs</p>
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>💰 ETF Fees Explained</h3>
        <div className="tp-concept-box">
          <h5>🤔 Why Fees Matter:</h5>
          <div className="tp-example-box">
            VOO fee: 0.03% → Pay $3 per $10,000 invested per year<br/>
            Some mutual funds: 1.5% → Pay $150 per $10,000 per year<br/><br/>
            Over 30 years at 8% growth, the 1.5% fee costs you <strong>$300,000+</strong> on a $500/month investment!
          </div>
        </div>
        <div className="tp-highlight tp-highlight-gold" style={{ marginTop: 16 }}>🏆 <strong>RECOMMENDED:</strong> CSPX (LSE) + VWRA + ES3 — simple 3-ETF portfolio for Singaporeans!</div>
      </div>
    </div>
  );
}

/* ═══════════════ MUTUAL FUNDS ═══════════════ */
function MutualFundsGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🤝 Mutual Funds</h2>
        <p>Let professionals manage your money — for a fee.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is a Mutual Fund?</h3>
        <div className="tp-concept-box">
          <h5>🏦 The Pool Analogy:</h5>
          <p>A mutual fund pools money from thousands of investors and a <strong>professional fund manager</strong> invests it for you.</p>
          <div className="tp-analogy">💡 Like a group of friends pooling $100 each to hire a chef to cook for everyone — instead of each cooking alone.</div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>📊 Types of Mutual Funds</h3>
        <div className="tp-grid-3">
          {[
            { icon: '📈', name: 'Equity Funds', risk: 'Medium-High', desc: 'Invest in stocks. Most common type.', ex: 'Vanguard 500 Index Fund' },
            { icon: '📦', name: 'Bond Funds', risk: 'Low-Med', desc: 'Invest in bonds. More stable income.', ex: 'PIMCO Total Return Fund' },
            { icon: '⚖️', name: 'Balanced Funds', risk: 'Medium', desc: 'Mix of stocks AND bonds.', ex: 'Vanguard Balanced Index' },
            { icon: '🌍', name: 'Global Funds', risk: 'Medium', desc: 'Invest across many countries.', ex: 'Fidelity Global Fund' },
            { icon: '🪙', name: 'Gold Funds', risk: 'Med-High', desc: 'Track gold price.', ex: 'Lion-OCBC Securities Gold' },
            { icon: '🏠', name: 'REIT Funds', risk: 'Medium', desc: 'Invest in real estate companies.', ex: 'Mapletree Logistics Trust' },
          ].map(f => (
            <div key={f.name} className="tp-concept-box">
              <h5>{f.icon} {f.name}</h5>
              <p><strong>Risk:</strong> {f.risk}</p>
              <p className="tp-muted">{f.desc}</p>
              <p style={{ marginTop: 6, fontSize: '0.8rem', color: '#4da6ff' }}>Example: {f.ex}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>⚠️ Mutual Funds vs ETFs</h3>
        <div className="tp-grid-2">
          <div className="tp-pros">
            <h5>✅ Mutual Fund Pros</h5>
            <ul><li>Professional management</li><li>Automatic rebalancing</li><li>Can invest exact dollar amounts</li><li>Some have no minimum</li></ul>
          </div>
          <div className="tp-cons">
            <h5>❌ Mutual Fund Cons</h5>
            <ul><li>Higher fees (0.5-2% per year)</li><li>Can't trade during the day</li><li>May have minimum investment</li><li>Tax less efficient than ETFs</li></ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ COMMODITIES ═══════════════ */
function CommoditiesGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🪙 Gold, Oil, Minerals & Commodities</h2>
        <p>Physical goods that drive the global economy — and your portfolio.</p>
        <div className="tp-commodity-launch">
          <span>🌐 Explore the dedicated live commodities desk with separate sections, fresh quotes, futures terms and a profit scenario calculator.</span>
          <a href="/commodities">Open Commodities Command Center →</a>
        </div>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🥇 Gold — The Ultimate Safe Haven</h3>
        <div className="tp-concept-box">
          <h5>🤔 Why Gold Matters:</h5>
          <p>Gold has been valuable for <strong>5,000 years</strong>. When everything else crashes, gold usually holds or goes UP.</p>
          <div className="tp-analogy">💡 Gold is like a financial fire extinguisher — you hope you never need it, but when things burn, it saves you.</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>📊 Gold Price Today</h5><p className="tp-price gold" style={{ fontSize: '1.5rem' }}>$3,200+</p><p className="tp-muted">Up 40%+ from 2024</p></div>
          <div className="tp-concept-box"><h5>🇸🇬 How to Buy Gold</h5>
            <ul className="tp-list"><li><strong>GLD ETF</strong> via Moomoo</li><li><strong>Lion-OCBC Gold ETF</strong> (SGX)</li><li><strong>SGB</strong> (Singapore Gold Bonds)</li><li><strong>Physical gold</strong> at UOB</li></ul>
          </div>
          <div className="tp-concept-box"><h5>🇮🇳 How to Buy Gold</h5>
            <ul className="tp-list"><li><strong>Sovereign Gold Bonds (SGB)</strong></li><li><strong>Gold ETFs</strong> on NSE</li><li><strong>Digital gold</strong> on PhonePe</li><li><strong>Physical gold</strong> at Tanishq</li></ul>
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>🛢️ Oil & Energy</h3>
        <div className="tp-concept-box">
          <h5>🤔 Why Oil Matters:</h5>
          <p>Oil powers <strong>everything</strong> — cars, planes, plastics, heating. When oil prices rise, everything gets more expensive.</p>
          <div className="tp-analogy">💡 Oil is the blood of the global economy. When it flows smoothly, things work. When its disrupted, chaos follows.</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>📊 Brent Crude</h5><p className="tp-price orange" style={{ fontSize: '1.3rem' }}>$70-80/barrel</p><p className="tp-muted">Watch OPEC decisions</p></div>
          <div className="tp-concept-box"><h5>🇺🇸 Oil ETFs</h5><ul className="tp-list"><li><strong>USO</strong> — United States Oil Fund</li><li><strong>XLE</strong> — Energy Select Sector</li><li><strong>OIH</strong> — Oil Services ETF</li></ul></div>
          <div className="tp-concept-box"><h5>🇸🇬 Oil Exposure</h5><ul className="tp-list"><li><strong>Keppel Corp</strong> — Offshore rigs</li><li><strong>Sembcorp</strong> — Energy & utilities</li><li><strong>ExxonMobil</strong> via Moomoo</li></ul></div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>⛏️ Minerals & Rare Earth Materials</h3>
        <div className="tp-concept-box">
          <h5>🤔 Why Rare Earths Matter:</h5>
          <p>Rare earth minerals are used in <strong>every smartphone, EV battery, wind turbine, and military jet</strong>. China controls 60% of mining and 90% of processing.</p>
          <div className="tp-analogy">💡 Rare earths are the "vitamins" of technology — you need tiny amounts, but without them, nothing works.</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          {[
            { icon: '⚡', name: 'Lithium', use: 'EV batteries', ticker: 'LIT (Global X Lithium ETF)', risk: 'High' },
            { icon: '🧲', name: 'Cobalt', use: 'Batteries, alloys', ticker: 'COBA (London)', risk: 'High' },
            { icon: '💎', name: 'Neodymium', use: 'Magnets, wind turbines', ticker: 'REMX (VanEck Rare Earth ETF)', risk: 'High' },
          ].map(m => (
            <div key={m.name} className="tp-concept-box">
              <h5>{m.icon} {m.name}</h5>
              <p><strong>Used in:</strong> {m.use}</p>
              <p style={{ marginTop: 4, fontSize: '0.8rem', color: '#4da6ff' }}>ETF: {m.ticker}</p>
              <p className="tp-muted" style={{ marginTop: 4 }}>Risk: {m.risk}</p>
            </div>
          ))}
        </div>
        <div className="tp-grid-3" style={{ marginTop: 12 }}>
          {[
            { icon: '🔩', name: 'Copper', use: 'Wiring, electronics, EVs', ticker: 'CPER (US Copper Index)', risk: 'Medium' },
            { icon: '🧱', name: 'Uranium', use: 'Nuclear power', ticker: 'URA (Global X Uranium ETF)', risk: 'Very High' },
            { icon: '🌾', name: 'Agricultural', use: 'Wheat, corn, soybeans', ticker: 'DBA (Invesco Agriculture)', risk: 'Medium' },
          ].map(m => (
            <div key={m.name} className="tp-concept-box">
              <h5>{m.icon} {m.name}</h5>
              <p><strong>Used in:</strong> {m.use}</p>
              <p style={{ marginTop: 4, fontSize: '0.8rem', color: '#4da6ff' }}>ETF: {m.ticker}</p>
              <p className="tp-muted" style={{ marginTop: 4 }}>Risk: {m.risk}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>🪙 Best Way to Invest in Commodities</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Method</th><th>What You Get</th><th>Fee</th><th>Best For</th></tr></thead>
            <tbody>
              <tr><td><strong>Commodity ETFs</strong></td><td>Track price without owning physical</td><td>0.2-0.7%</td><td>Most investors</td></tr>
              <tr><td><strong>Commodity Stocks</strong></td><td>Mining/oil company shares</td><td>0% (stock only)</td><td>Higher risk/reward</td></tr>
              <tr><td><strong>Physical Gold/Silver</strong></td><td>Actual metal in your hand</td><td>Premium 3-8%</td><td>Safety seekers</td></tr>
              <tr><td><strong>Futures</strong></td><td>Direct price bet</td><td>Commission</td><td>Advanced traders only</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ CRYPTO ═══════════════ */
function CryptoGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>₿ Cryptocurrency — Digital Money</h2>
        <p>Bitcoin, Ethereum, and everything else — explained simply.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is Crypto?</h3>
        <div className="tp-concept-box">
          <h5>🎮 Digital Gold Analogy:</h5>
          <p><strong>Digital money that exists only on computers.</strong> No bank controls it. It runs on a technology called blockchain.</p>
          <div className="tp-analogy">💡 Bitcoin = digital gold (21M max supply). Ethereum = digital oil (powers apps and smart contracts).</div>
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>🔷 Major Cryptocurrencies</h3>
        <div className="tp-grid-3">
          {[
            { icon: '₿', name: 'Bitcoin (BTC)', price: '$110K+', desc: 'Digital gold. Store of value. Most established. Best for beginners.', color: '#ffd24a' },
            { icon: '⟠', name: 'Ethereum (ETH)', price: '$4,000+', desc: 'Digital oil. Powers DeFi, NFTs, smart contracts. #2 by market cap.', color: '#4da6ff' },
            { icon: '🔗', name: 'Solana (SOL)', price: '$180+', desc: 'Fast, cheap blockchain. Competing with Ethereum. High risk/reward.', color: '#b388ff' },
            { icon: '🔵', name: 'XRP (Ripple)', price: '$3+', desc: 'Fast cross-border payments. Banks use it. SEC lawsuit resolved.', color: '#2ee6a8' },
            { icon: '🔷', name: 'BNB', price: '$600+', desc: 'Binance exchange token. Used for trading fee discounts.', color: '#ffd24a' },
            { icon: '🟢', name: 'Cardano (ADA)', price: '$0.80+', desc: 'Academic approach to blockchain. Slow but methodical.', color: '#2ee6a8' },
            { icon: '🟣', name: 'Polkadot (DOT)', price: '$8+', desc: 'Connects different blockchains together.', color: '#b388ff' },
            { icon: '🤖', name: 'Chainlink (LINK)', price: '$18+', desc: 'Connects smart contracts to real-world data.', color: '#4da6ff' },
            { icon: '🎭', name: 'Polygon (MATIC)', price: '$0.50+', desc: 'Makes Ethereum faster and cheaper.', color: '#ff6b9d' },
          ].map(c => (
            <div key={c.name} className="tp-concept-box" style={{ borderLeft: `3px solid ${c.color}` }}>
              <h5>{c.icon} {c.name}</h5>
              <p className="tp-price" style={{ color: c.color, fontSize: '1.1rem' }}>{c.price}</p>
              <p className="tp-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>🏆 Which Crypto to Buy? (Layman's Guide)</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #2ee6a8' }}>
            <h5>✅ Safe Bets (Best for Beginners)</h5>
            <ul className="tp-list">
              <li><strong>Bitcoin (BTC)</strong> — 60-70% of crypto portfolio</li>
              <li><strong>Ethereum (ETH)</strong> — 20-30% of crypto portfolio</li>
            </ul>
            <div className="tp-analogy">💡 If youre new, just buy BTC + ETH. That's it. 90% of experts agree.</div>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ff8c42' }}>
            <h5>🚀 Higher Risk/Reward (5-10% max)</h5>
            <ul className="tp-list">
              <li><strong>Solana (SOL)</strong> — Fastest growing ecosystem</li>
              <li><strong>Chainlink (LINK)</strong> — Essential infrastructure</li>
              <li><strong>Polkadot (DOT)</strong> — Interoperability play</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-red">
        <h3>⚠️ Crypto Risks</h3>
        <div className="tp-grid-2">
          <div className="tp-alert tp-alert-danger">🔴 <strong>Volatility:</strong> BTC dropped 77% in 2022 ($69K→$16K). Can happen again.</div>
          <div className="tp-alert tp-alert-warning">🟡 <strong>No Regulation:</strong> FTX collapsed, $8B vanished overnight.</div>
          <div className="tp-alert tp-alert-info">🔵 <strong>Scams:</strong> If someone promises 100% returns, its a scam. Period.</div>
          <div className="tp-alert tp-alert-success">🟢 <strong>Smart Play:</strong> Max 5-10% of total portfolio. BTC + ETH only for beginners.</div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>📱 How to Buy Crypto in Each Country</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box"><h5>🇸🇬 Singapore</h5><ul className="tp-list"><li><strong>SGX:</strong> Bitcoin ETF (ODEX, ABF)</li><li><strong>Moomoo:</strong> BTC/ETH via ETFs</li><li><strong>Binance SG:</strong> Direct crypto</li><li><strong>Coinbase:</strong> Global option</li></ul></div>
          <div className="tp-concept-box"><h5>🇺🇸 USA</h5><ul className="tp-list"><li><strong>Coinbase:</strong> Most popular</li><li><strong>Robinhood:</strong> Zero fee trades</li><li><strong>Bitcoin ETFs:</strong> IBIT, FBTC</li><li><strong>Ethereum ETFs:</strong> ETHA, FETH</li></ul></div>
          <div className="tp-concept-box"><h5>🇮🇳 India</h5><ul className="tp-list"><li><strong>WazirX:</strong> Most popular</li><li><strong>CoinDCX:</strong> Indian exchange</li><li><strong>Giottus:</strong> Low fees</li><li>⚠️ 30% tax on crypto gains!</li></ul></div>
          <div className="tp-concept-box"><h5>🇭🇰 Hong Kong</h5><ul className="tp-list"><li><strong>HashKey:</strong> Licensed exchange</li><li><strong>OSL:</strong> Institutional grade</li><li><strong>Interactive Brokers:</strong> BTC futures</li><li>⚠️ Regulated environment</li></ul></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ FOREX ═══════════════ */
function ForexGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>💱 Forex — Currency Trading</h2>
        <p>The world's biggest market — $7.5 trillion traded every day!</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is Forex?</h3>
        <div className="tp-concept-box">
          <h5>🌏 Currency Exchange Analogy:</h5>
          <p>You've done forex when exchanging SGD for USD before a trip!</p>
          <div className="tp-analogy">💡 1 USD = 1.35 SGD. Buy USD. Later 1 USD = 1.40 SGD. Sell USD. Profit = 5 cents per dollar!</div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>💱 Major Currency Pairs</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Pair</th><th>Meaning</th><th>Why It Matters</th><th>Typical Spread</th></tr></thead>
            <tbody>
              {[
                { pair: 'EUR/USD', meaning: 'Euro vs Dollar', why: 'Most traded pair in the world', spread: '1 pip' },
                { pair: 'USD/SGD', meaning: 'Dollar vs SGD', why: 'Affects all SG investors directly', spread: '1.5 pips' },
                { pair: 'USD/JPY', meaning: 'Dollar vs Yen', why: 'Risk sentiment gauge — yen is "safe haven"', spread: '1 pip' },
                { pair: 'USD/CNY', meaning: 'Dollar vs Yuan', why: 'China economy indicator', spread: '2 pips' },
                { pair: 'GBP/USD', meaning: 'Pound vs Dollar', why: 'UK economy & Brexit effects', spread: '1.5 pips' },
                { pair: 'USD/INR', meaning: 'Dollar vs Rupee', why: 'India economy & remittances', spread: '3 pips' },
                { pair: 'AUD/USD', meaning: 'Aussie vs Dollar', why: 'Commodity currency — moves with gold/iron', spread: '1 pip' },
              ].map(f => (
                <tr key={f.pair}>
                  <td><strong className="tp-ticker">{f.pair}</strong></td>
                  <td>{f.meaning}</td>
                  <td className="tp-example-cell">{f.why}</td>
                  <td>{f.spread}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>⚠️ Forex Warning</h3>
        <div className="tp-highlight tp-highlight-gold">
          <p><strong>95% of retail forex traders LOSE money.</strong> Banks and hedge funds dominate with billion-dollar algorithms. Don't try to time currencies.</p>
          <p style={{ marginTop: 8 }}>✅ <strong>What to do instead:</strong> Invest in global ETFs (VWRA, CSPX) — you automatically get currency diversification without trading forex!</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ INDICES & FUTURES ═══════════════ */
function IndicesGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>📊 Indices & Futures</h2>
        <p>Benchmarks that track entire markets — and contracts to bet on the future.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is a Stock Index?</h3>
        <div className="tp-concept-box">
          <h5>📏 The Report Card Analogy:</h5>
          <p>An index is like a <strong>report card for a group of stocks</strong>. It tells you if the overall market is doing well or poorly.</p>
          <div className="tp-analogy">💡 S&P 500 is like a report card for the 500 biggest US companies. If its up, most companies are doing well!</div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>📊 Major Global Indices</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Index</th><th>Country</th><th>What It Tracks</th><th>Top Holdings</th><th>How to Invest</th></tr></thead>
            <tbody>
              {[
                { idx: 'S&P 500', country: '🇺🇸 US', tracks: 'Top 500 US companies', top: 'NVDA, AAPL, MSFT, AMZN, META', how: 'CSPX, VOO, SPY ETFs' },
                { idx: 'Nasdaq 100', country: '🇺🇸 US', tracks: 'Top 100 tech companies', top: 'NVDA, AAPL, MSFT, META, GOOG', how: 'QQQ, NDX ETFs' },
                { idx: 'Dow Jones', country: '🇺🇸 US', tracks: '30 blue-chip companies', top: 'UNH, MSFT, GS, CAT, HD', how: 'DIA ETF' },
                { idx: 'Russell 2000', country: '🇺🇸 US', tracks: '2000 small US companies', top: 'Small-cap exposure', how: 'IWM ETF' },
                { idx: 'STI', country: '🇸🇬 SG', tracks: 'Top 30 SG companies', top: 'DBS, UOB, OCBC, Keppel', how: 'ES3 (STI ETF) on SGX' },
                { idx: 'FTSE STI', country: '🇸🇬 SG', tracks: 'Full SG market', top: 'All SGX-listed stocks', how: 'STI ETF on SGX' },
                { idx: 'Nifty 50', country: '🇮🇳 India', tracks: 'Top 50 Indian companies', top: 'Reliance, TCS, HDFC, Infosys', how: 'NSEIF ETF via Kite' },
                { idx: 'Sensex', country: '🇮🇳 India', tracks: 'Top 30 BSE companies', top: 'Same as Nifty but fewer', how: 'Directly on BSE' },
                { idx: 'Hang Seng', country: '🇭🇰 HK', tracks: 'Top HK companies', top: 'Tencent, Alibaba, AIA, HSBC', how: '2800.HK (Tracker Fund)' },
                { idx: 'Hang Seng Tech', country: '🇭🇰 HK', tracks: 'Top 30 HK tech', top: 'Tencent, Alibaba, Meituan, BYD', how: '3032.HK ETF' },
                { idx: 'Nikkei 225', country: '🇯🇵 Japan', tracks: 'Top 225 Japanese companies', top: 'Toyota, Sony, Mitsubishi', how: 'EWJ ETF' },
                { idx: 'KOSPI', country: '🇰🇷 Korea', tracks: 'Top Korean companies', top: 'Samsung, SK Hynix, Hyundai', how: 'EWY ETF' },
                { idx: 'FTSE 100', country: '🇬🇧 UK', tracks: 'Top 100 UK companies', top: 'Shell, AstraZeneca, HSBC', how: 'EWU ETF' },
                { idx: 'CSI 300', country: '🇨🇳 China', tracks: 'Top 300 Chinese companies', top: 'Kweichow Moutai, CATL', how: 'MCHI ETF' },
              ].map(i => (
                <tr key={i.idx}>
                  <td><strong>{i.idx}</strong></td>
                  <td>{i.country}</td>
                  <td>{i.tracks}</td>
                  <td className="tp-example-cell">{i.top}</td>
                  <td style={{ fontSize: '0.8rem' }}>{i.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>🔮 Futures — What Are They?</h3>
        <div className="tp-concept-box">
          <h5>📦 The Pre-Order Analogy:</h5>
          <p>A future is like <strong>pre-ordering something at today's price for delivery later</strong>.</p>
          <div className="tp-analogy">💡 You agree to buy 100 barrels of oil at $75 each, to be delivered in 3 months. If oil goes to $90, you profit $15/barrel!</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>📊 Stock Index Futures</h5><ul className="tp-list"><li><strong>ES</strong> — S&P 500 E-mini ($50 × index)</li><li><strong>NQ</strong> — Nasdaq E-mini ($20 × index)</li><li><strong>YM</strong> — Dow E-mini ($5 × index)</li></ul></div>
          <div className="tp-concept-box"><h5>🪙 Commodity Futures</h5><ul className="tp-list"><li><strong>CL</strong> — Crude Oil ($1,000/barrel)</li><li><strong>GC</strong> — Gold ($100/point)</li><li><strong>SI</strong> — Silver ($5,000/contract)</li></ul></div>
          <div className="tp-concept-box"><h5>💱 Currency Futures</h5><ul className="tp-list"><li><strong>6E</strong> — Euro futures</li><li><strong>6J</strong> — Yen futures</li><li><strong>6S</strong> — Swiss Franc futures</li></ul></div>
        </div>
        <div className="tp-alert tp-alert-danger" style={{ marginTop: 16 }}>🔴 <strong>Warning:</strong> Futures require margin accounts and can result in losses EXCEEDING your initial investment. Only for experienced traders!</div>
      </div>
    </div>
  );
}

/* ═══════════════ OPTIONS ═══════════════ */
function OptionsGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🎯 Options — Advanced Trading</h2>
        <p>The right to buy or sell at a set price — like insurance for stocks.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🤔 What is an Option?</h3>
        <div className="tp-concept-box">
          <h5>🏠 The Real Estate Analogy:</h5>
          <p>An option is like paying a <strong>small deposit to lock in a house price for 3 months</strong>. If the price goes up, you buy at the old price. If it drops, you walk away (losing only the deposit).</p>
          <div className="tp-analogy">💡 Put down $1,000 to lock Apple at $300 for 3 months. If Apple goes to $350, you exercise and buy at $300! If it drops to $250, you walk away (lose only $1,000).</div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>📊 Call vs Put Options</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #2ee6a8' }}>
            <h5>📈 CALL Option (Bullish)</h5>
            <p><strong>Right to BUY at set price</strong></p>
            <ul className="tp-list"><li>Buy when you think price will go UP</li><li>Example: Buy AAPL $320 Call for $8</li><li>If AAPL hits $350 → profit $22/share</li><li>If AAPL stays below $320 → lose $8 premium</li></ul>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ff6b6b' }}>
            <h5>📉 PUT Option (Bearish)</h5>
            <p><strong>Right to SELL at set price</strong></p>
            <ul className="tp-list"><li>Buy when you think price will go DOWN</li><li>Example: Buy AAPL $280 Put for $6</li><li>If AAPL drops to $250 → profit $24/share</li><li>If AAPL stays above $280 → lose $6 premium</li></ul>
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>⚡ Active Options (Most Traded)</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Stock</th><th>Why Popular</th><th>Avg Daily Volume</th><th>Best For</th></tr></thead>
            <tbody>
              {[
                { s: 'SPY (S&P 500 ETF)', why: 'Most liquid options market in world', vol: '10M+ contracts/day', best: 'Day traders, hedgers' },
                { s: 'QQQ (Nasdaq ETF)', why: 'Tech-heavy, high volatility', vol: '5M+ contracts/day', best: 'Growth traders' },
                { s: 'AAPL (Apple)', why: 'Largest company, very liquid', vol: '2M+ contracts/day', best: 'Beginner options traders' },
                { s: 'NVDA (NVIDIA)', why: 'AI leader, big moves', vol: '1.5M+ contracts/day', best: 'Momentum traders' },
                { s: 'TSLA (Tesla)', why: 'Elon tweets = instant moves', vol: '1M+ contracts/day', best: 'High-risk traders' },
                { s: 'AMD', why: 'Semiconductor competitor', vol: '500K+ contracts/day', best: 'Tech-focused traders' },
              ].map(o => (
                <tr key={o.s}>
                  <td><strong>{o.s}</strong></td>
                  <td>{o.why}</td>
                  <td className="tp-ticker">{o.vol}</td>
                  <td className="tp-example-cell">{o.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>📊 High IV (Implied Volatility) Options</h3>
        <div className="tp-concept-box">
          <h5>🤔 What is IV?</h5>
          <p>IV measures <strong>how much the market EXPECTS a stock to move</strong>. High IV = expensive options = big potential moves.</p>
          <div className="tp-analogy">💡 IV is like weather forecast uncertainty. High IV = "storm coming" — options cost more because big moves are expected.</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>🔴 High IV Stocks</h5><ul className="tp-list"><li>TSLA (earnings)</li><li>MEME stocks</li><li>Biotech before FDA</li><li>Small caps with news</li></ul></div>
          <div className="tp-concept-box"><h5>🟢 Low IV Stocks</h5><ul className="tp-list"><li>PG (Procter & Gamble)</li><li>JNJ (Johnson & Johnson)</li><li>KO (Coca-Cola)</li><li>Utilities sector</li></ul></div>
          <div className="tp-concept-box"><h5>💡 Strategy</h5><ul className="tp-list"><li><strong>High IV:</strong> Sell options (collect premium)</li><li><strong>Low IV:</strong> Buy options (cheap bets)</li><li>Check IV rank before trading</li><li>IV rank {'>'} 50% = sell, {'<'} 30% = buy</li></ul></div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>⚠️ Options Risks for Beginners</h3>
        <div className="tp-alert tp-alert-danger" style={{ marginBottom: 12 }}>🔴 <strong>YOU CAN LOSE 100% of your money with options.</strong> Most beginners lose money.</div>
        <div className="tp-pros-cons">
          <div className="tp-pros"><h5>✅ Options Pros</h5><ul><li>Leverage: Control $100K with $5K</li><li>Hedge your stock portfolio</li><li>Generate income (selling covered calls)</li><li>Defined risk (when buying)</li></ul></div>
          <div className="tp-cons"><h5>❌ Options Cons</h5><ul><li>Complex — many variables</li><li>Time decay eats value daily</li><li>Can expire worthless (total loss)</li><li>Selling naked = unlimited risk</li></ul></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ COUNTRY MARKETS ═══════════════ */
function CountryMarkets() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🌍 Country Markets — SG, USA, India, HK</h2>
        <p>What to buy and where — country by country breakdown.</p>
      </div>

      {/* Singapore */}
      <div className="tp-card tp-card-blue">
        <h3>🇸🇬 Singapore Market (SGX)</h3>
        <div className="tp-concept-box">
          <h5>🏦 Your Platform: Moomoo SG</h5>
          <p>SGX has ~700 listed companies. Focus on REITs, banks, and transport.</p>
        </div>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Stock/ETF</th><th>Ticker</th><th>Sector</th><th>Why Buy</th><th>Div Yield</th></tr></thead>
            <tbody>
              {[
                { s: 'DBS Group', t: 'D05', sec: '🏦 Banking', why: 'Largest SE Asian bank, growing dividends', y: '5.5%' },
                { s: 'OCBC', t: 'O39', sec: '🏦 Banking', why: 'Strong wealth management, steady grower', y: '5.2%' },
                { s: 'UOB', t: 'U11', sec: '🏦 Banking', why: 'Regional expansion, solid fundamentals', y: '5.0%' },
                { s: 'CapitaLand Investment', t: '9CI', sec: '🏠 REITs', why: 'Global real estate manager', y: '4.8%' },
                { s: 'Mapletree Logistics', t: 'M44U', sec: '🏠 REITs', why: 'Asia logistics, growing DPU', y: '6.2%' },
                { s: 'Singtel', t: 'Z74', sec: '📡 Telecom', why: 'Telco + digital bank play', y: '5.5%' },
                { s: 'Venture Corp', t: 'V03', sec: '💻 Tech', why: 'Global EMS, high margins', y: '4.0%' },
                { s: 'STI ETF', t: 'ES3', sec: '📦 ETF', why: 'Own all top 30 SG stocks', y: '3.2%' },
                { s: 'Keppel Corp', t: 'BN4', sec: '🛢️ Energy', why: 'Infrastructure + renewables', y: '4.5%' },
                { s: 'Thai Beverage', t: 'Y92', sec: '🛒 Consumer', why: 'SE Asia FMCG leader', y: '4.2%' },
              ].map(r => (
                <tr key={r.t}><td><strong>{r.s}</strong></td><td className="tp-ticker">{r.t}</td><td>{r.sec}</td><td className="tp-example-cell">{r.why}</td><td className="green">{r.y}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USA */}
      <div className="tp-card tp-card-green">
        <h3>🇺🇸 US Market (NYSE/NASDAQ)</h3>
        <div className="tp-concept-box">
          <h5>🏦 Your Platform: Moomoo SG (US stocks available)</h5>
          <p>World's largest market. Best for tech, growth, and dividend stocks.</p>
        </div>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Stock/ETF</th><th>Ticker</th><th>Sector</th><th>Why Buy</th><th>Price</th></tr></thead>
            <tbody>
              {[
                { s: 'NVIDIA', t: 'NVDA', sec: '💻 Tech/AI', why: 'AI chip king, insane growth', p: '$180+' },
                { s: 'Apple', t: 'AAPL', sec: '💻 Tech', why: 'Best brand, services growing', p: '$320+' },
                { s: 'Microsoft', t: 'MSFT', sec: '💻 Tech', why: 'Cloud + AI + enterprise', p: '$480+' },
                { s: 'Amazon', t: 'AMZN', sec: '🛒 Consumer', why: 'E-commerce + AWS cloud', p: '$220+' },
                { s: 'CSPX (S&P 500)', t: 'CSPX', sec: '📦 ETF', why: 'Best for SG investors (15% US tax)', p: '$620+' },
                { s: 'Coca-Cola', t: 'KO', sec: '🛒 Dividend', why: '60+ years of dividend growth', p: '$60+' },
                { s: 'Realty Income', t: 'O', sec: '🏠 REIT', why: 'Monthly dividends! 5%+ yield', p: '$55+' },
                { s: 'JPMorgan', t: 'JPM', sec: '🏦 Finance', why: '#1 US bank, Jamie Dimon', p: '$260+' },
                { s: 'Berkshire', t: 'BRK.B', sec: '💼 Conglom', why: 'Warren Buffett company', p: '$460+' },
                { s: 'Palantir', t: 'PLTR', sec: '💻 AI/Defense', why: 'AI for government + enterprise', p: '$160+' },
              ].map(r => (
                <tr key={r.t}><td><strong>{r.s}</strong></td><td className="tp-ticker">{r.t}</td><td>{r.sec}</td><td className="tp-example-cell">{r.why}</td><td>{r.p}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hong Kong */}
      <div className="tp-card tp-card-orange">
        <h3>🇭🇰 Hong Kong Market (HKEX)</h3>
        <div className="tp-concept-box">
          <h5>🏦 Access via: Moomoo SG or Interactive Brokers</h5>
          <p>Gateway to China. Tech giants + financials. Chinese government policy matters a lot.</p>
        </div>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Stock/ETF</th><th>Ticker</th><th>Sector</th><th>Why Buy</th><th>Div Yield</th></tr></thead>
            <tbody>
              {[
                { s: 'Tencent', t: '0700.HK', sec: '💻 Tech', why: 'WeChat + gaming + fintech', y: '1.5%' },
                { s: 'Alibaba', t: '9988.HK', sec: '💻 Tech', why: 'E-commerce + cloud, cheap P/E', y: '2.0%' },
                { s: 'AIA Group', t: '1299.HK', sec: '🏦 Finance', why: 'Largest Asian insurer', y: '2.5%' },
                { s: 'HSBC', t: '0005.HK', sec: '🏦 Banking', why: 'Global bank, SG presence', y: '5.0%' },
                { s: 'BYD', t: '1211.HK', sec: '🚗 EV', why: 'Teslas #1 competitor in China', y: '0.5%' },
                { s: 'Meituan', t: '3690.HK', sec: '🛒 Consumer', why: 'Chinas UberEats + more', y: '-' },
                { s: 'Tracker Fund', t: '2800.HK', sec: '📦 ETF', why: 'Own Hang Seng Index', y: '3.0%' },
                { s: 'Hang Seng Tech', t: '3032.HK', sec: '📦 ETF', why: 'Top 30 HK tech companies', y: '0.8%' },
              ].map(r => (
                <tr key={r.t}><td><strong>{r.s}</strong></td><td className="tp-ticker">{r.t}</td><td>{r.sec}</td><td className="tp-example-cell">{r.why}</td><td>{r.y}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* India */}
      <div className="tp-card tp-card-purple">
        <h3>🇮🇳 India Market (NSE/BSE)</h3>
        <div className="tp-concept-box">
          <h5>🏦 Your Platform: Zerodha Kite</h5>
          <p>World's fastest growing major economy. Tech, finance, and consumer sectors booming.</p>
        </div>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Stock/ETF</th><th>Ticker</th><th>Sector</th><th>Why Buy</th><th>Div Yield</th></tr></thead>
            <tbody>
              {[
                { s: 'Reliance Industries', t: 'RELIANCE', sec: '🛢️ Energy/Tech', why: 'Jio + Retail + O2C — Indias biggest company', y: '0.3%' },
                { s: 'TCS', t: 'TCS', sec: '💻 IT', why: 'Largest Indian IT company', y: '1.2%' },
                { s: 'HDFC Bank', t: 'HDFCBANK', sec: '🏦 Banking', why: 'Indias #1 private bank', y: '1.1%' },
                { s: 'Infosys', t: 'INFY', sec: '💻 IT', why: 'IT services giant, good dividends', y: '2.3%' },
                { s: 'ITC', t: 'ITC', sec: '🛒 FMCG', why: 'Diversified: cigarettes + hotels + FMCG', y: '3.5%' },
                { s: 'Bajaj Finance', t: 'BAJFINANCE', sec: '🏦 Finance', why: 'Consumer finance leader, high growth', y: '0.5%' },
                { s: 'Nifty 50 ETF', t: 'NSEIF', sec: '📦 ETF', why: 'Own top 50 Indian companies', y: '1.5%' },
                { s: 'SBI', t: 'SBIN', sec: '🏦 Banking', why: 'Largest Indian bank, government-backed', y: '2.0%' },
                { s: 'Titan Company', t: 'TITAN', sec: '🛒 Consumer', why: 'Jewelry + watches — luxury India', y: '0.3%' },
                { s: 'Zomato', t: 'ZOMATO', sec: '🍽️ Food Tech', why: 'Indias DoorDash, turning profitable', y: '-' },
              ].map(r => (
                <tr key={r.t}><td><strong>{r.s}</strong></td><td className="tp-ticker">{r.t}</td><td>{r.sec}</td><td className="tp-example-cell">{r.why}</td><td>{r.y}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Japan & Korea */}
      <div className="tp-card tp-card-cyan">
        <h3>🇯🇵 Japan & 🇰🇷 Korea Markets</h3>
        <div className="tp-grid-2">
          <div>
            <h4>🇯🇵 Japan (Nikkei/TSE)</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Stock/ETF</th><th>Ticker</th></tr></thead><tbody>
                <tr><td>Toyota</td><td className="tp-ticker">7203.T</td></tr>
                <tr><td>Sony Group</td><td className="tp-ticker">6758.T</td></tr>
                <tr><td>Keyence</td><td className="tp-ticker">6861.T</td></tr>
                <tr><td>SoftBank Group</td><td className="tp-ticker">9984.T</td></tr>
                <tr><td>iShares MSCI Japan ETF</td><td className="tp-ticker">EWJ</td></tr>
              </tbody></table>
            </div>
          </div>
          <div>
            <h4>🇰🇷 Korea (KOSPI)</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Stock/ETF</th><th>Ticker</th></tr></thead><tbody>
                <tr><td>Samsung Electronics</td><td className="tp-ticker">005930.KS</td></tr>
                <tr><td>SK Hynix</td><td className="tp-ticker">000660.KS</td></tr>
                <tr><td>Hyundai Motor</td><td className="tp-ticker">005380.KS</td></tr>
                <tr><td>LG Chem</td><td className="tp-ticker">051910.KS</td></tr>
                <tr><td>iShares MSCI Korea ETF</td><td className="tp-ticker">EWY</td></tr>
              </tbody></table>
            </div>
          </div>
        </div>
        <div className="tp-highlight tp-highlight-blue" style={{ marginTop: 16 }}>
          💡 <strong>How to access:</strong> Japan & Korea stocks via Interactive Brokers (cheapest) or Moomoo SG (limited). ETFs like EWJ and EWY are easier via Moomoo.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ ADVANCED TOPICS ═══════════════ */
function AdvancedTopics() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>⚡ Advanced Topics</h2>
        <p>Dividends, leverage, growth, MA, options strategies, structured products, and more.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>💰 Dividends — Earning While You Hold</h3>
        <div className="tp-concept-box">
          <h5>🏠 The Rent Analogy:</h5>
          <p>Dividends are like <strong>rent from your stocks</strong>. Companies share their profits with you just for owning shares.</p>
          <div className="tp-analogy">💡 DBS pays S$1.50/year per share. Own 100 shares = S$150/year for doing nothing!</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>🏦 Best Dividend Stocks (SG)</h5><ul className="tp-list"><li><strong>DBS:</strong> 5.5% yield</li><li><strong>Singtel:</strong> 5.5% yield</li><li><strong>Mapletree Industrial:</strong> 6.2% yield</li><li><strong>Keppel DC REIT:</strong> 5.8% yield</li></ul></div>
          <div className="tp-concept-box"><h5>🇺🇸 Best Dividend Stocks (US)</h5><ul className="tp-list"><li><strong>Realty Income (O):</strong> 5%+ monthly</li><li><strong>Coca-Cola (KO):</strong> 3% — 60yr growth</li><li><strong>Johnson & Johnson:</strong> 3% — 60yr growth</li><li><strong>SCHD ETF:</strong> 3.5% — diversified</li></ul></div>
          <div className="tp-concept-box"><h5>🇮🇳 Best Dividend Stocks (India)</h5><ul className="tp-list"><li><strong>ITC:</strong> 3.5% yield</li><li><strong>Coal India:</strong> 5%+ yield</li><li><strong>ONGC:</strong> 4%+ yield</li><li><strong>SBI:</strong> 2% — growing fast</li></ul></div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>🔧 Leverage — Amplify Your Returns (and Losses!)</h3>
        <div className="tp-concept-box">
          <h5>🏎️ The Gear Analogy:</h5>
          <p>Leverage is like <strong>putting your car in a higher gear</strong> — you go faster, but crash harder.</p>
          <div className="tp-analogy">💡 2x leverage: Invest $10K, control $20K. Stock goes up 10% → you make 20%. But stock goes DOWN 10% → you lose 20%!</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>📈 Leveraged ETFs</h5><ul className="tp-list"><li><strong>TQQQ:</strong> 3x Nasdaq</li><li><strong>SSO:</strong> 2x S&P 500</li><li><strong>SOXL:</strong> 3x Semiconductors</li></ul><div className="tp-alert tp-alert-danger" style={{ marginTop: 8 }}>🔴 Decay kills long-term returns!</div></div>
          <div className="tp-concept-box"><h5>💰 Margin Trading</h5><ul className="tp-list"><li>Borrow from broker to buy more</li><li>Moomoo: 2-4x leverage</li><li>IBKR: Up to 50% margin</li></ul><div className="tp-alert tp-alert-danger" style={{ marginTop: 8 }}>🔴 Can be forced to sell at a loss!</div></div>
          <div className="tp-concept-box"><h5>📊 Options Leverage</h5><ul className="tp-list"><li>Control $100K with $5K premium</li><li>10-20x potential leverage</li><li>Defined risk (when buying)</li></ul><div className="tp-alert tp-alert-warning" style={{ marginTop: 8 }}>🟡 Complex but can be safer than margin</div></div>
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>🚀 Growth, High Profile & Large Cap</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box"><h5>🎯 High Profile Stocks</h5><p>Stocks everyone talks about — high attention, high volume.</p><ul className="tp-list"><li><strong>NVDA:</strong> AI revolution leader</li><li><strong>TSLA:</strong> EV + Elon factor</li><li><strong>AAPL:</strong> World's most valuable company</li><li><strong>PLTR:</strong> AI for government</li></ul></div>
          <div className="tp-concept-box"><h5>🏗️ Large Cap & Long-term Bullish</h5><p>Companies that have been growing for DECADES.</p><ul className="tp-list"><li><strong>MSFT:</strong> 40+ years of growth</li><li><strong>JNJ:</strong> 60+ years of dividend growth</li><li><strong>KO:</strong> 60+ years of dividend growth</li><li><strong>V:</strong> Global payments infrastructure</li></ul></div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>📊 Moving Averages (MA) — Trend Following</h3>
        <div className="tp-concept-box">
          <h5>🤔 What are Moving Averages?</h5>
          <p>A moving average <strong>smooths out price data</strong> to show the overall trend. If the stock is ABOVE the MA → uptrend. BELOW → downtrend.</p>
          <div className="tp-analogy">💡 Think of it as a "trend GPS" — it tells you which direction the market is heading.</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>📉 50-Day MA (Short-term)</h5><p>Shows trend over last 2 months.</p><ul className="tp-list"><li>Stock ABOVE {'='}short-term bullish</li><li>Stock BELOW {'='}short-term bearish</li><li>"Golden Cross" = 50MA crosses above 200MA = BUY signal</li></ul></div>
          <div className="tp-concept-box"><h5>📈 200-Day MA (Long-term)</h5><p>The most important trend line.</p><ul className="tp-list"><li>Stock ABOVE {'='}long-term bullish</li><li>Stock BELOW {'='}long-term bearish</li><li>Used by institutions to decide allocation</li></ul></div>
          <div className="tp-concept-box"><h5>💡 How to Use MA</h5><ul className="tp-list"><li><strong>Buy:</strong> Stock crosses above 200MA</li><li><strong>Sell:</strong> Stock crosses below 200MA</li><li><strong>Best for:</strong> Large cap stocks</li><li><strong>Works for:</strong> S&P 500, NVDA, AAPL</li></ul></div>
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>🔄 Structured Products, CashPlus & Alternatives</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box"><h5>📦 Structured Products</h5><p>Pre-packaged investments tied to a stock/index with a floor and cap.</p><ul className="tp-list"><li>Example: "CSPX Double Return" — if S&P up, you get 2x; if down, you get 0%</li><li>Popular in SG banks (DBS, OCBC)</li><li>Look for: capital-protected notes</li></ul><div className="tp-analogy">💡 Like a bet with a safety net — you cant lose more than a set amount.</div></div>
          <div className="tp-concept-box"><h5>💵 CashPlus / Money Market</h5><p>High-interest cash management — better than bank savings.</p><ul className="tp-list"><li><strong>SG:</strong> Moomoo CashPlus 3.5%+</li><li><strong>US:</strong> Treasury bills (T-Bills) 4.5%</li><li><strong>India:</strong> Liquid funds 6-7%</li></ul><div className="tp-analogy">💡 Like a savings account on steroids — higher interest, still accessible.</div></div>
          <div className="tp-concept-box"><h5>🎨 Alternatives</h5><p>Non-traditional investments.</p><ul className="tp-list"><li><strong>Art:</strong> Masterworks (fractional art)</li><li><strong>Wine:</strong> Vinovest</li><li><strong>Real Estate:</strong> REITs, Fundrise</li><li><strong>Private Equity:</strong> Accredited only</li></ul></div>
          <div className="tp-concept-box"><h5>🏦 Fund Houses</h5><p>Major asset managers.</p><ul className="tp-list"><li><strong>Vanguard:</strong> Cheapest index funds</li><li><strong>BlackRock (iShares):</strong> Most ETFs</li><li><strong>Fidelity:</strong> Great research</li><li><strong>PIMCO:</strong> Bond specialist</li><li><strong>Lion-OCBC:</strong> SG-focused funds</li></ul></div>
        </div>
      </div>

      <div className="tp-card tp-card-cyan">
        <h3>📊 RSP (Regular Savings Plan)</h3>
        <div className="tp-concept-box">
          <h5>💡 Automate Your Investments:</h5>
          <p>RSP = <strong>automatically invest a fixed amount every month</strong>. Like DCA on autopilot.</p>
          <div className="tp-analogy">💡 Set up $200/month into CSPX on Moomoo → you never miss a month, never worry about timing!</div>
        </div>
        <div className="tp-grid-3" style={{ marginTop: 16 }}>
          <div className="tp-concept-box"><h5>🇸🇬 SG RSP Options</h5><ul className="tp-list"><li><strong>Moomoo:</strong> Auto-invest (limited)</li><li><strong>Syfe:</strong> Robo-advisor, auto DCA</li><li><strong>StashAway:</strong> Auto portfolio</li><li><strong>FSMOne:</strong> RSP for ETFs</li></ul></div>
          <div className="tp-concept-box"><h5>🇮🇳 India SIP</h5><ul className="tp-list"><li><strong>Zerodha Kite:</strong> SIP in mutual funds</li><li><strong>Groww:</strong> Easy SIP setup</li><li><strong>ICICI Direct:</strong> Direct mutual funds</li><li><strong>India Post:</strong> RD + mutual funds</li></ul></div>
          <div className="tp-concept-box"><h5>💡 Best RSP Portfolio</h5><ul className="tp-list"><li>40% CSPX (S&P 500)</li><li>30% VWRA (Global)</li><li>20% QQQ (Tech)</li><li>10% Bond ETF (AGG)</li></ul><p className="tp-muted" style={{ marginTop: 8 }}>Total fee: ~0.1% per year</p></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ 6-MONTH PLAN ═══════════════ */
function SixMonthPlan() {
  const [month, setMonth] = useState('oct2026');
  const plans = {
    oct2026: {
      theme: 'Q3 Earnings + Fed Decision',
      buy: [
        { s: 'CSPX (S&P 500 ETF)', why: 'Always buy dips, long-term core', platform: 'Moomoo SG', action: 'BUY / ADD' },
        { s: 'DBS (D05)', why: 'SG banks strong, 5.5% dividend', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'NVDA', why: 'AI demand relentless, post-earnings dip', platform: 'Moomoo SG', action: 'BUY on dip' },
        { s: 'VWRA (Global ETF)', why: 'Diversify globally', platform: 'Moomoo SG', action: 'ADD' },
        { s: 'GLD (Gold ETF)', why: 'Hedge against uncertainty', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'BTC/ETH', why: 'Crypto bull market ongoing', platform: 'Moomoo/Coinbase', action: 'BUY (5-10% only)' },
      ],
      sell: [
        { s: 'Overvalued tech (>50 P/E)', why: 'Take some profits', action: 'TRIM 20%' },
        { s: 'Leveraged ETFs (if held 6mo+)', why: 'Decay risk, lock in gains', action: 'SELL HALF' },
      ],
      hold: ['QQQ', 'AAPL', 'TCS', 'Reliance', 'ES3'],
    },
    nov2026: {
      theme: 'Year-End Rally + Holiday Spending',
      buy: [
        { s: 'CSPX', why: 'Seasonal strength Nov-Dec', platform: 'Moomoo SG', action: 'ADD' },
        { s: 'AMZN', why: 'Holiday sales + AWS growth', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'HDFC Bank (India)', why: 'India growth story, cheap valuation', platform: 'Zerodha Kite', action: 'BUY' },
        { s: 'Mapletree Logistics (M44U)', why: '6%+ yield, Asia logistics boom', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'QQQ', why: 'Tech seasonal strength', platform: 'Moomoo SG', action: 'ADD' },
      ],
      sell: [
        { s: 'Speculative penny stocks', why: 'Clean up portfolio', action: 'SELL ALL' },
        { s: 'Underperformers (>1yr)', why: 'Reallocate to winners', action: 'SELL' },
      ],
      hold: ['NVDA', 'MSFT', 'Tencent', 'ITC', 'GLD'],
    },
    dec2026: {
      theme: 'Santa Rally + Tax-Loss Harvesting',
      buy: [
        { s: 'CSPX', why: 'Tax-loss harvesting creates buying opportunity', platform: 'Moomoo SG', action: 'ADD' },
        { s: 'SCHD (Dividend ETF)', why: 'Lock in dividend income for 2027', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'Singtel', why: '5.5% yield, undervalued', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'SSB (Singapore Savings Bonds)', why: 'Safe parking for 2027', platform: 'DBS ATM', action: 'BUY S$5K' },
      ],
      sell: [
        { s: 'Losers for tax benefits', why: 'Book losses to offset gains', action: 'SELL' },
        { s: 'Any crypto >10% of portfolio', why: 'Rebalance before year end', action: 'TRIM' },
      ],
      hold: ['DBS', 'AAPL', 'BHarti Airtel', 'Alibaba'],
    },
    jan2027: {
      theme: 'New Year Reset + January Effect',
      buy: [
        { s: 'CSPX + VWRA', why: 'Fresh year DCA restart', platform: 'Moomoo SG', action: 'ADD' },
        { s: 'Small Cap ETF (IWM)', why: 'January effect — small caps rally', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'Reliance (India)', why: 'Jio IPO catalyst in 2027', platform: 'Zerodha Kite', action: 'BUY' },
        { s: 'Tencent (0700.HK)', why: 'China stimulus + cheap valuation', platform: 'Moomoo SG', action: 'BUY' },
      ],
      sell: [
        { s: 'Overextended momentum stocks', why: 'January often sees corrections', action: 'TRIM' },
      ],
      hold: ['NVDA', 'DBS', 'QQQ', 'Nifty 50 ETF'],
    },
    feb2027: {
      theme: 'Q4 Earnings Season + China New Year',
      buy: [
        { s: 'NVDA', why: 'Q4 earnings — AI spending acceleration', platform: 'Moomoo SG', action: 'BUY on dip' },
        { s: 'Alibaba (9988.HK)', why: 'China recovery play post-CNY', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'Gold (GLD)', why: 'Geopolitical uncertainty hedge', platform: 'Moomoo SG', action: 'ADD' },
        { s: 'Vanguard FTSE All-World (VWRA)', why: 'Core DCA', platform: 'Moomoo SG', action: 'ADD' },
      ],
      sell: [
        { s: 'Bonds (if yields drop <3%)', why: 'Rotate to equities', action: 'TRIM' },
      ],
      hold: ['MSFT', 'AMZN', 'TCS', 'Mapletree'],
    },
    mar2027: {
      theme: 'Q1 Outlook + Spring Rally',
      buy: [
        { s: 'CSPX', why: 'Core position — never stop buying', platform: 'Moomoo SG', action: 'ADD' },
        { s: 'BYD (1211.HK)', why: 'EV leader, global expansion', platform: 'Moomoo SG', action: 'BUY' },
        { s: 'IWM (Small Caps)', why: 'Spring small-cap rally', platform: 'Moomoo SG', action: 'ADD' },
        { s: 'Bitcoin', why: 'Halving cycle momentum (post-2024 halving)', platform: 'Moomoo/Coinbase', action: 'ADD' },
        { s: 'Sovereign Gold Bond (India)', why: 'SGB with 2.5% interest + gold upside', platform: 'Zerodha Kite', action: 'BUY' },
      ],
      sell: [
        { s: 'Overweight positions (>15%)', why: 'Rebalance portfolio', action: 'TRIM to 10%' },
      ],
      hold: ['QQQ', 'DBS', 'AAPL', 'ITC', 'GLD'],
    },
  };
  const p = plans[month];
  return (
    <div>
      <div className="tp-section-header">
        <h2>🗓️ 6-Month Buy & Sell Plan</h2>
        <p>Your roadmap from October 2026 to March 2027 — what to buy, sell, and hold.</p>
      </div>

      <div className="tp-card tp-card-gold" style={{ marginBottom: 20 }}>
        <div className="tp-month-tabs" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
          {[
            ['oct2026', 'Oct 2026'], ['nov2026', 'Nov 2026'], ['dec2026', 'Dec 2026'],
            ['jan2027', 'Jan 2027'], ['feb2027', 'Feb 2027'], ['mar2027', 'Mar 2027'],
          ].map(([k, label]) => (
            <button key={k} className={`tp-month-tab ${month === k ? 'active' : ''}`} onClick={() => setMonth(k)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="tp-highlight tp-highlight-gold" style={{ marginBottom: 20 }}>
        <strong>📊 Theme: {p.theme}</strong>
      </div>

      <div className="tp-card tp-card-green">
        <h3>✅ What to BUY</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Stock/Asset</th><th>Action</th><th>Why</th><th>Platform</th></tr></thead>
            <tbody>
              {p.buy.map((b, i) => (
                <tr key={i}>
                  <td><strong>{b.s}</strong></td>
                  <td><span className="tp-badge tp-badge-up">{b.action}</span></td>
                  <td className="tp-example-cell">{b.why}</td>
                  <td>{b.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-red" style={{ borderLeftColor: '#ff6b6b' }}>
        <h3>❌ What to SELL / TRIM</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Asset</th><th>Action</th><th>Why</th></tr></thead>
            <tbody>
              {p.sell.map((s, i) => (
                <tr key={i}>
                  <td><strong>{s.s}</strong></td>
                  <td><span className="tp-badge tp-badge-down">{s.action}</span></td>
                  <td className="tp-example-cell">{s.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>⏸️ HOLD</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {p.hold.map(h => (
            <span key={h} className="tp-badge tp-badge-flat" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>{h}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ RANKINGS & FUND HOUSES ═══════════════ */
function RankingsGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🏆 Rankings & Fund Houses</h2>
        <p>Best funds, ETFs, and asset managers — ranked by performance.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🏦 Top Fund Houses (Asset Managers)</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Fund House</th><th>AUM</th><th>Best Products</th><th>Fee</th><th>Best For</th></tr></thead>
            <tbody>
              {[
                { f: 'Vanguard', aum: '$9T+', best: 'VOO, VWRA, VTI', fee: '0.03-0.10%', for: ' cheapest index investing' },
                { f: 'BlackRock (iShares)', aum: '$10T+', best: 'CSPX, IWDA, AGG', fee: '0.03-0.20%', for: 'most ETF choices' },
                { f: 'Fidelity', aum: '$4.5T+', best: 'FZROX, FXAIX', fee: '0.00-0.10%', for: 'zero-fee funds' },
                { f: 'State Street (SPDR)', aum: '$4T+', best: 'SPY, GLD, XLF', fee: '0.10-0.40%', for: 'most liquid ETFs' },
                { f: 'PIMCO', aum: '$1.8T+', best: 'Total Return Bond', fee: '0.40-0.70%', for: 'bond specialists' },
                { f: 'Lion-OCBC', aum: '$5B+', best: 'SG Gold ETF, STI ETF', fee: '0.30-0.80%', for: 'SG-focused' },
                { f: 'Nippon India', aum: '$50B+', best: 'Nifty 50 ETF', fee: '0.10-0.50%', for: 'India exposure' },
                { f: 'Mirae Asset', aum: '$200B+', best: 'Nifty Next 50 ETF', fee: '0.20%', for: 'India growth' },
              ].map(r => (
                <tr key={r.f}><td><strong>{r.f}</strong></td><td>{r.aum}</td><td className="tp-ticker">{r.best}</td><td>{r.fee}</td><td className="tp-example-cell">{r.for}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>📊 Best ETFs by Category (Ranked)</h3>
        <div className="tp-grid-3">
          <div className="tp-concept-box"><h5>🏆 Best Equity ETFs</h5><ul className="tp-list"><li>#1 <strong>CSPX</strong> — S&P 500 (0.07%)</li><li>#2 <strong>VWRA</strong> — All-World (0.22%)</li><li>#3 <strong>QQQ</strong> — Nasdaq 100 (0.20%)</li><li>#4 <strong>IWDA</strong> — MSCI World (0.20%)</li></ul></div>
          <div className="tp-concept-box"><h5>🏠 Best Bond ETFs</h5><ul className="tp-list"><li>#1 <strong>AGG</strong> — US Agg Bond (0.03%)</li><li>#2 <strong>BND</strong> — Vanguard Total Bond (0.03%)</li><li>#3 <strong>TLT</strong> — 20+ Year Treasury (0.15%)</li><li>#4 <strong>LQD</strong> — Corporate Bond (0.14%)</li></ul></div>
          <div className="tp-concept-box"><h5>💰 Best Dividend ETFs</h5><ul className="tp-list"><li>#1 <strong>SCHD</strong> — Schwab Dividend (0.06%)</li><li>#2 <strong>VYM</strong> — Vanguard High Div (0.06%)</li><li>#3 <strong>DGRO</strong> — iShares Div Growth (0.08%)</li><li>#4 <strong>DGRW</strong> — WisdomTree Growth (0.28%)</li></ul></div>
          <div className="tp-concept-box"><h5>🪙 Best Commodity ETFs</h5><ul className="tp-list"><li>#1 <strong>GLD</strong> — SPDR Gold (0.40%)</li><li>#2 <strong>IAU</strong> — iShares Gold (0.25%)</li><li>#3 <strong>USO</strong> — Oil Fund (0.60%)</li><li>#4 <strong>PDBC</strong> — Broad Commodity (0.59%)</li></ul></div>
          <div className="tp-concept-box"><h5>🏗️ Best REIT ETFs</h5><ul className="tp-list"><li>#1 <strong>VNQ</strong> — Vanguard REIT (0.12%)</li><li>#2 <strong>SCHH</strong> — Schwab REIT (0.07%)</li><li>#3 <strong>IYR</strong> — iShares US REIT (0.39%)</li><li>#4 <strong>ES3</strong> — STI ETF (SG REITs included)</li></ul></div>
          <div className="tp-concept-box"><h5>🌍 Best Regional ETFs</h5><ul className="tp-list"><li>#1 <strong>EWJ</strong> — Japan (0.50%)</li><li>#2 <strong>EWY</strong> — Korea (0.59%)</li><li>#3 <strong>MCHI</strong> — China (0.59%)</li><li>#4 <strong>INDA</strong> — India (0.64%)</li></ul></div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>📈 Bond Funds (Mutual Fund Style)</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Fund</th><th>Type</th><th>Yield</th><th>Min Investment</th><th>Best For</th></tr></thead>
            <tbody>
              {[
                { f: 'PIMCO Total Return', t: 'Aggregate Bond', y: '4.5%', min: '$1,000', for: 'Core bond holding' },
                { f: 'Vanguard Total Bond (BND)', t: 'US Bond Index', y: '4.3%', min: '$3,000', for: 'Low-cost bond exposure' },
                { f: 'Lion-OCBC SG Bond', t: 'SG Government', y: '3.0%', min: 'S$100', for: 'SG investors' },
                { f: 'Fidelity US Bond', t: 'Investment Grade', y: '4.2%', min: '$2,500', for: 'Quality bonds' },
                { f: 'PIMCO Income Fund', t: 'Multi-Sector', y: '5.5%', min: '$1,000', for: 'Higher income' },
              ].map(r => (
                <tr key={r.f}><td><strong>{r.f}</strong></td><td>{r.t}</td><td className="green">{r.y}</td><td>{r.min}</td><td className="tp-example-cell">{r.for}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>💼 Portfolio Recommendations</h3>
        <div className="tp-grid-3">
          {[
            { label: 'Conservative', icon: '🛡️', color: '#2ee6a8', items: ['50% SSB/T-Bills', '30% AGG (Bond ETF)', '20% CSPX'], ret: '4-6%/yr', risk: 'Very Low' },
            { label: 'Balanced', icon: '⚖️', color: '#ffd24a', items: ['40% CSPX', '20% VWRA', '15% DBS/REITs', '15% Bonds', '10% Gold'], ret: '7-9%/yr', risk: 'Medium' },
            { label: 'Aggressive', icon: '🚀', color: '#ff6b9d', items: ['40% NVDA/QQQ', '20% CSPX', '15% Crypto', '15% India', '10% Small Caps'], ret: '10-15%/yr', risk: 'High' },
          ].map(a => (
            <div key={a.label} className="tp-compare-card" style={{ borderTop: `3px solid ${a.color}` }}>
              <div className="tp-emoji">{a.icon}</div><h4>{a.label}</h4>
              <ul className="tp-list" style={{ textAlign: 'left', marginTop: 10 }}>{a.items.map(i => <li key={i}>{i}</li>)}</ul>
              <p className="tp-muted" style={{ marginTop: 10, fontSize: '0.75rem' }}>Expected: {a.ret} | Risk: {a.risk}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ STRATEGIES ═══════════════ */
function StrategiesGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🎯 Investment Strategies</h2>
        <p>Proven methods to grow your money — from beginner to advanced.</p>
      </div>

      <div className="tp-card tp-card-green">
        <h3>💎 Dollar-Cost Averaging (DCA)</h3>
        <div className="tp-concept-box">
          <h5>🗓️ Invest FIXED amount every month, rain or shine.</h5>
          <div className="tp-analogy">💡 Like buying $20 of groceries every week — sometimes bananas are $1, sometimes $1.50. Over time you get a good average.</div>
        </div>
        <div className="tp-example-box" style={{ marginTop: 16 }}>
          <strong>$500/month into CSPX for 30 years at 8%:</strong><br/>
          You put in: $180,000<br/>
          Market gives you: $565,000<br/>
          <strong>Total: $745,000</strong> — that's the power of compound interest! 🤯
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>📋 Beginner's Action Plan</h3>
        <div className="tp-steps">
          <div className="tp-step tp-step-green"><div className="tp-step-num">1</div><div><h4>Emergency Fund (3-6 months expenses)</h4><p>Before investing ANYTHING, save this first. Put in Moomoo CashPlus.</p></div></div>
          <div className="tp-step tp-step-blue"><div className="tp-step-num">2</div><div><h4>Open Moomoo SG + Zerodha Kite</h4><p>SG account for US/SG/HK stocks. India account for NSE/BSE.</p></div></div>
          <div className="tp-step tp-step-purple"><div className="tp-step-num">3</div><div><h4>Buy CSPX (S&P 500 ETF)</h4><p>Own 500 companies in one purchase. The #1 most recommended ETF.</p></div></div>
          <div className="tp-step tp-step-orange"><div className="tp-step-num">4</div><div><h4>Add VWRA (All-World ETF)</h4><p>Now you own the entire global stock market!</p></div></div>
          <div className="tp-step tp-step-pink"><div className="tp-step-num">5</div><div><h4>Set Monthly DCA ($300-1,000)</h4><p>Automate it. Never miss a month. Buy during crashes — those are sales!</p></div></div>
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>🥧 Asset Allocation by Age</h3>
        <div className="tp-grid-3">
          {[
            { age: '20-30', icon: '👨‍🎓', items: ['50% CSPX', '20% QQQ', '10% VWRA', '10% Crypto', '10% Cash'], tag: 'High Growth', color: '#ff6b9d' },
            { age: '30-50', icon: '👨‍💼', items: ['35% CSPX', '15% VWRA', '15% SG Dividends', '15% Bonds', '10% Gold', '10% Crypto'], tag: 'Balanced', color: '#ffd24a' },
            { age: '50-65', icon: '👴', items: ['30% CSPX', '25% Bonds/SSB', '20% SG Dividends', '10% REITs', '10% Gold', '5% Cash'], tag: 'Conservative', color: '#2ee6a8' },
          ].map(p => (
            <div key={p.age} className="tp-compare-card" style={{ borderTop: `3px solid ${p.color}` }}>
              <div className="tp-emoji">{p.icon}</div><h4>Age {p.age}</h4>
              <ul className="tp-list" style={{ textAlign: 'left', marginTop: 10 }}>{p.items.map(i => <li key={i}>{i}</li>)}</ul>
              <span className="tp-tag tp-tag-beginner">{p.tag}</span>
            </div>
          ))}
        </div>
        <div className="tp-alert tp-alert-info" style={{ marginTop: 14 }}>💡 <strong>Rule of thumb:</strong> 100 - your age = % in stocks. Age 25 = 75% stocks, 25% bonds.</div>
      </div>
    </div>
  );
}

/* ═══════════════ BROKER APPS ═══════════════ */
function AppsGuide() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>📱 Broker Apps — Your Trading Platforms</h2>
        <p>Which app to use for each market — Moomoo SG + Zerodha Kite.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🏆 Top Brokers Comparison</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Broker</th><th>Markets</th><th>US Fees</th><th>Best For</th><th>App Quality</th></tr></thead>
            <tbody>
              {[
                { n: '🏆 Moomoo SG', m: 'US, SG, HK, AU', f: '$0 US', b: 'Your main broker!', a: '⭐⭐⭐⭐⭐' },
                { n: '🏆 Zerodha Kite', m: 'India (NSE/BSE)', f: '₹20/order', b: 'India investing', a: '⭐⭐⭐⭐⭐' },
                { n: 'Interactive Brokers', m: 'Global (33 countries)', f: '$0 (Lite)', b: 'Global ETFs', a: '⭐⭐⭐⭐' },
                { n: 'Tiger Brokers', m: 'US, SG, HK, AU', f: '~$1.99', b: 'CPF/SRS investing', a: '⭐⭐⭐⭐' },
                { n: 'Webull SG', m: 'US, SG, HK', f: '$0 US', b: 'Zero-cost', a: '⭐⭐⭐⭐' },
                { n: 'Syfe', m: 'Managed portfolios', f: '$0', b: 'Hands-off investing', a: '⭐⭐⭐⭐' },
                { n: 'StashAway', m: 'Managed portfolios', f: '$0', b: 'Auto rebalancing', a: '⭐⭐⭐⭐' },
              ].map(b => (
                <tr key={b.n}>
                  <td><strong>{b.n}</strong></td>
                  <td>{b.m}</td>
                  <td>{b.f}</td>
                  <td className="tp-example-cell">{b.b}</td>
                  <td>{b.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>🏦 Your Setup: Moomoo SG + Zerodha Kite</h3>
        <div className="tp-grid-2">
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ffd24a' }}>
            <h5>🏆 Moomoo SG — Your Global Platform</h5>
            <ul className="tp-list">
              <li><strong>US Stocks:</strong> AAPL, NVDA, MSFT, CSPX, QQQ</li>
              <li><strong>SG Stocks:</strong> DBS, Singtel, ES3, Mapletree</li>
              <li><strong>HK Stocks:</strong> Tencent, Alibaba, BYD</li>
              <li><strong>ETFs:</strong> VWRA, GLD, VNQ, AGG</li>
              <li><strong>Crypto:</strong> Via ETFs (IBIT, FBTC)</li>
              <li><strong>Commodities:</strong> GLD, USO</li>
            </ul>
            <div className="tp-highlight tp-highlight-gold" style={{ marginTop: 12 }}>💰 <strong>Zero commission on US stocks!</strong></div>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #4da6ff' }}>
            <h5>🏆 Zerodha Kite — Your India Platform</h5>
            <ul className="tp-list">
              <li><strong>NSE Stocks:</strong> Reliance, TCS, HDFC, Infosys</li>
              <li><strong>BSE Stocks:</strong> All BSE-listed companies</li>
              <li><strong>Mutual Funds:</strong> SIP in Nifty 50, Nifty Next 50</li>
              <li><strong>ETFs:</strong> Nifty ETF, Gold ETF, Bharat 22</li>
              <li><strong>Bonds:</strong> G-Sec, SGB, T-Bills</li>
              <li><strong>F&O:</strong> Nifty futures and options</li>
            </ul>
            <div className="tp-highlight tp-highlight-blue" style={{ marginTop: 12 }}>💰 <strong>₹20 per order (flat fee)!</strong></div>
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>🔑 Quick Start Checklist</h3>
        <div className="tp-steps">
          <div className="tp-step tp-step-green"><div className="tp-step-num">1</div><div><h4>Open Moomoo SG Account</h4><p>Download app → Sign up → Verify identity (takes 1-2 days)</p></div></div>
          <div className="tp-step tp-step-blue"><div className="tp-step-num">2</div><div><h4>Open Zerodha Kite Account</h4><p>zerodha.com → Sign up → Complete KYC → Fund account</p></div></div>
          <div className="tp-step tp-step-purple"><div className="tp-step-num">3</div><div><h4>Fund Your Accounts</h4><p>Moomoo: Transfer SGD. Zerodha: Transfer INR via UPI/netbanking.</p></div></div>
          <div className="tp-step tp-step-orange"><div className="tp-step-num">4</div><div><h4>Start with CSPX on Moomoo</h4><p>Your first investment — own 500 US companies for as low as $1.</p></div></div>
          <div className="tp-step tp-step-pink"><div className="tp-step-num">5</div><div><h4>Buy Nifty 50 ETF on Kite</h4><p>Indias top 50 companies in one purchase.</p></div></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ TOP STOCKS TO WATCH ═══════════════ */
function TopStocksWatch() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🌟 Top Stocks to Watch — Global Picks</h2>
        <p>The best-performing, highest-potential stocks across every major market. Updated with 2026 data.</p>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🇺🇸 United States — Must-Own Stocks</h3>
        <div className="tp-grid-3">
          {[
            { icon: '💻', name: 'NVIDIA', ticker: 'NVDA', price: '$180+', sector: 'AI/Semiconductors', why: 'AI chip monopoly. Revenue up 200% YoY.', color: '#76b900', rating: '⭐⭐⭐⭐⭐', risk: 'Medium' },
            { icon: '🍎', name: 'Apple', ticker: 'AAPL', price: '$320+', sector: 'Consumer Tech', why: 'Best brand loyalty. Services growing 20%+.', color: '#a2aaad', rating: '⭐⭐⭐⭐⭐', risk: 'Low' },
            { icon: '☁️', name: 'Microsoft', ticker: 'MSFT', price: '$480+', sector: 'Cloud/AI', why: 'Azure + Copilot AI. Most diversified tech.', color: '#00a4ef', rating: '⭐⭐⭐⭐⭐', risk: 'Low' },
            { icon: '🛒', name: 'Amazon', ticker: 'AMZN', price: '$220+', sector: 'E-commerce/Cloud', why: 'AWS #1 cloud + dominant retail.', color: '#ff9900', rating: '⭐⭐⭐⭐⭐', risk: 'Medium' },
            { icon: '🔍', name: 'Alphabet', ticker: 'GOOGL', price: '$200+', sector: 'Search/AI', why: 'Search monopoly + Gemini AI.', color: '#4285f4', rating: '⭐⭐⭐⭐⭐', risk: 'Low' },
            { icon: '🤖', name: 'Palantir', ticker: 'PLTR', price: '$160+', sector: 'AI/Defense', why: 'AI for government + enterprise. Explosive growth.', color: '#101113', rating: '⭐⭐⭐⭐', risk: 'High' },
            { icon: '🤖', name: 'Broadcom', ticker: 'AVGO', price: '$190+', sector: 'Semiconductors', why: 'AI networking chips + VMware cloud.', color: '#cc0000', rating: '⭐⭐⭐⭐⭐', risk: 'Medium' },
            { icon: '🏠', name: 'Realty Income', ticker: 'O', price: '$55+', sector: 'REITs', why: 'Monthly dividends. 60+ years of dividend growth.', color: '#2ee6a8', rating: '⭐⭐⭐⭐⭐', risk: 'Low' },
            { icon: '💳', name: 'Visa', ticker: 'V', price: '$300+', sector: 'Payments', why: 'Global payments infrastructure. 5%+ revenue growth.', color: '#1a1f71', rating: '⭐⭐⭐⭐⭐', risk: 'Low' },
            { icon: '🏭', name: 'Berkshire', ticker: 'BRK.B', price: '$460+', sector: 'Conglomerate', why: 'Warren Buffett. Best long-term track record.', color: '#003b5c', rating: '⭐⭐⭐⭐⭐', risk: 'Low' },
          ].map(s => (
            <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="tp-top-stock-header">
                <span className="tp-top-stock-icon">{s.icon}</span>
                <div>
                  <h4>{s.name}</h4>
                  <span className="tp-ticker">{s.ticker}</span>
                </div>
                <span className="tp-top-stock-price" style={{ color: s.color }}>{s.price}</span>
              </div>
              <p className="tp-muted" style={{ fontSize: '0.78rem' }}>{s.sector}</p>
              <p style={{ fontSize: '0.82rem', marginTop: 6, color: '#c8d6e5' }}>{s.why}</p>
              <div className="tp-top-stock-footer">
                <span>{s.rating}</span>
                <span className="tp-badge" style={{ fontSize: '0.7rem' }}>{s.risk} Risk</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-green">
        <h3>🇸🇬 Singapore — Best Dividend Kings</h3>
        <div className="tp-grid-3">
          {[
            { icon: '🏦', name: 'DBS Group', ticker: 'D05', price: 'S$48+', sector: 'Banking', why: '#1 SE Asian bank. 5.5% dividend yield.', color: '#ffd24a', yield: '5.5%' },
            { icon: '🏦', name: 'OCBC', ticker: 'O39', price: 'S$16+', sector: 'Banking', why: 'Wealth management leader. 5.2% yield.', color: '#4da6ff', yield: '5.2%' },
            { icon: '🏦', name: 'UOB', ticker: 'U11', price: 'S$38+', sector: 'Banking', why: 'Regional expansion. Solid 5.0% yield.', color: '#ff8c42', yield: '5.0%' },
            { icon: '📡', name: 'Singtel', ticker: 'Z74', price: 'S$3+', sector: 'Telecom', why: 'Telco + digital bank play. 5.5% yield.', color: '#2ee6a8', yield: '5.5%' },
            { icon: '🏠', name: 'Mapletree Logistics', ticker: 'M44U', price: 'S$2+', sector: 'REITs', why: 'Asia logistics. Growing DPU. 6.2% yield.', color: '#b388ff', yield: '6.2%' },
            { icon: '🏠', name: 'Keppel DC REIT', ticker: 'AJBU', price: 'S$2+', sector: 'REITs', why: 'Data center REIT. 5.8% yield.', color: '#35e0ff', yield: '5.8%' },
            { icon: '💻', name: 'Venture Corp', ticker: 'V03', price: 'S$17+', sector: 'Tech', why: 'Global EMS. High margins. 4.0% yield.', color: '#ffd24a', yield: '4.0%' },
            { icon: '🛢️', name: 'Keppel Corp', ticker: 'BN4', price: 'S$7+', sector: 'Energy', why: 'Infrastructure + renewables. 4.5% yield.', color: '#ff8c42', yield: '4.5%' },
            { icon: '🛒', name: 'Thai Beverage', ticker: 'Y92', price: 'S$0.60+', sector: 'Consumer', why: 'SE Asia FMCG leader. 4.2% yield.', color: '#ff6b9d', yield: '4.2%' },
          ].map(s => (
            <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="tp-top-stock-header">
                <span className="tp-top-stock-icon">{s.icon}</span>
                <div>
                  <h4>{s.name}</h4>
                  <span className="tp-ticker">{s.ticker}</span>
                </div>
                <span className="tp-top-stock-price" style={{ color: s.color }}>{s.price}</span>
              </div>
              <p style={{ fontSize: '0.82rem', marginTop: 6, color: '#c8d6e5' }}>{s.why}</p>
              <div className="tp-top-stock-footer">
                <span className="tp-badge" style={{ background: 'rgba(46,230,168,0.15)', color: '#2ee6a8', fontSize: '0.78rem' }}>💰 {s.yield}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-purple">
        <h3>🇮🇳 India — Growth & Value Picks</h3>
        <div className="tp-grid-3">
          {[
            { icon: '🛢️', name: 'Reliance', ticker: 'RELIANCE', price: '₹3,000+', sector: 'Energy/Retail/Telecom', why: 'Jio 5G + Retail + O2C. Indias biggest company.', color: '#ffd24a' },
            { icon: '💻', name: 'TCS', ticker: 'TCS', price: '₹4,000+', sector: 'IT Services', why: 'Largest Indian IT company. Global contracts.', color: '#4da6ff' },
            { icon: '🏦', name: 'HDFC Bank', ticker: 'HDFCBANK', price: '₹1,700+', sector: 'Banking', why: 'Indias #1 private bank. Strong growth.', color: '#004c8f' },
            { icon: '💻', name: 'Infosys', ticker: 'INFY', price: '₹1,800+', sector: 'IT Services', why: 'IT giant. Good dividends. AI push.', color: '#007cc3' },
            { icon: '🛒', name: 'ITC', ticker: 'ITC', price: '₹460+', sector: 'FMCG', why: 'Diversified: cigarettes + hotels + FMCG.', color: '#2ee6a8' },
            { icon: '🏦', name: 'Bajaj Finance', ticker: 'BAJFINANCE', price: '₹7,000+', sector: 'Consumer Finance', why: 'Consumer finance leader. High growth.', color: '#b388ff' },
            { icon: '🚗', name: 'Tata Motors', ticker: 'TATAMOTORS', price: '₹1,000+', sector: 'Auto/EV', why: 'JLR + EV pivot. Global ambitions.', color: '#ff8c42' },
            { icon: '🏛️', name: 'SBI', ticker: 'SBIN', price: '₹800+', sector: 'Banking', why: 'Largest Indian bank. Government-backed.', color: '#ffd24a' },
            { icon: '💎', name: 'Titan Company', ticker: 'TITAN', price: '₹3,500+', sector: 'Consumer Luxury', why: 'Jewelry + watches. Brand India.', color: '#ff6b9d' },
          ].map(s => (
            <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="tp-top-stock-header">
                <span className="tp-top-stock-icon">{s.icon}</span>
                <div>
                  <h4>{s.name}</h4>
                  <span className="tp-ticker">{s.ticker}</span>
                </div>
                <span className="tp-top-stock-price" style={{ color: s.color }}>{s.price}</span>
              </div>
              <p style={{ fontSize: '0.82rem', marginTop: 6, color: '#c8d6e5' }}>{s.why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-orange">
        <h3>🇭🇰 Hong Kong — Tech Giants</h3>
        <div className="tp-grid-3">
          {[
            { icon: '💬', name: 'Tencent', ticker: '0700.HK', price: 'HK$420+', sector: 'Tech/Gaming', why: 'WeChat + gaming + fintech empire.', color: '#00c853' },
            { icon: '🛒', name: 'Alibaba', ticker: '9988.HK', price: 'HK$90+', sector: 'E-commerce/Cloud', why: 'Cheap P/E. Cloud growth. Buyback program.', color: '#ff6a00' },
            { icon: '🚗', name: 'BYD', ticker: '1211.HK', price: 'HK$450+', sector: 'EV/Auto', why: 'Teslas #1 competitor. Global expansion.', color: '#2ee6a8' },
            { icon: '🏦', name: 'AIA Group', ticker: '1299.HK', price: 'HK$75+', sector: 'Insurance', why: 'Largest Asian insurer. Long-term growth.', color: '#ffd24a' },
            { icon: '🍔', name: 'Meituan', ticker: '3690.HK', price: 'HK$160+', sector: 'Food Delivery', why: 'Chinas DoorDash + more. Profitable now.', color: '#ff8c42' },
            { icon: '🎮', name: 'NetEase', ticker: '9999.HK', price: 'HK$160+', sector: 'Gaming', why: 'Top gaming company. Global game hits.', color: '#b388ff' },
          ].map(s => (
            <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="tp-top-stock-header">
                <span className="tp-top-stock-icon">{s.icon}</span>
                <div>
                  <h4>{s.name}</h4>
                  <span className="tp-ticker">{s.ticker}</span>
                </div>
                <span className="tp-top-stock-price" style={{ color: s.color }}>{s.price}</span>
              </div>
              <p style={{ fontSize: '0.82rem', marginTop: 6, color: '#c8d6e5' }}>{s.why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-card tp-card-cyan">
        <h3>🇯🇵 Japan & 🇰🇷 Korea — Tech & Autos</h3>
        <div className="tp-grid-2">
          <div>
            <h4>🇯🇵 Japan</h4>
            <div className="tp-grid-2" style={{ gap: 10 }}>
              {[
                { name: 'Toyota', ticker: '7203.T', why: 'Worlds largest automaker. EV + hydrogen.', color: '#eb0a1e' },
                { name: 'Sony Group', ticker: '6758.T', why: 'Gaming + entertainment + semiconductors.', color: '#000000' },
                { name: 'Keyence', ticker: '6861.T', why: 'Automation leader. High margins.', color: '#ffd24a' },
                { name: 'Hitachi', ticker: '6501.T', why: 'Diversified tech conglomerate.', color: '#e60012' },
              ].map(s => (
                <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}`, padding: '12px' }}>
                  <div className="tp-top-stock-header" style={{ gap: 8 }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem' }}>{s.name}</h4>
                      <span className="tp-ticker" style={{ fontSize: '0.7rem' }}>{s.ticker}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', marginTop: 4, color: '#c8d6e5' }}>{s.why}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4>🇰🇷 South Korea</h4>
            <div className="tp-grid-2" style={{ gap: 10 }}>
              {[
                { name: 'Samsung Electronics', ticker: '005930.KS', why: 'Memory chips + displays. AI chip maker.', color: '#1428a0' },
                { name: 'SK Hynix', ticker: '000660.KS', why: 'HBM chips for AI. NVIDIA supplier.', color: '#0066cc' },
                { name: 'Hyundai Motor', ticker: '005380.KS', why: 'Global EV push. Ioniq series.', color: '#002c5f' },
                { name: 'LG Chem', ticker: '051910.KS', why: 'EV batteries. Materials science.', color: '#a50034' },
              ].map(s => (
                <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}`, padding: '12px' }}>
                  <div className="tp-top-stock-header" style={{ gap: 8 }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem' }}>{s.name}</h4>
                      <span className="tp-ticker" style={{ fontSize: '0.7rem' }}>{s.ticker}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', marginTop: 4, color: '#c8d6e5' }}>{s.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-blue">
        <h3>🇬🇧 UK & 🇦🇺 Australia</h3>
        <div className="tp-grid-2">
          <div>
            <h4>🇬🇧 UK (LSE)</h4>
            <div className="tp-grid-2" style={{ gap: 10 }}>
              {[
                { name: 'AstraZeneca', ticker: 'AZN', why: 'Global pharma giant. Cancer pipeline.', color: '#5f259f' },
                { name: 'Shell', ticker: 'SHEL', why: 'Energy transition leader. 4%+ yield.', color: '#fbce07' },
                { name: 'HSBC Holdings', ticker: 'HSBA', why: 'Global banking. 5%+ yield.', color: '#db0011' },
                { name: 'Unilever', ticker: 'ULVR', why: 'Consumer staples. Global brand portfolio.', color: '#1f36c7' },
              ].map(s => (
                <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}`, padding: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem' }}>{s.name}</h4>
                  <span className="tp-ticker" style={{ fontSize: '0.7rem' }}>{s.ticker}</span>
                  <p style={{ fontSize: '0.78rem', marginTop: 4, color: '#c8d6e5' }}>{s.why}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4>🇦🇺 Australia (ASX)</h4>
            <div className="tp-grid-2" style={{ gap: 10 }}>
              {[
                { name: 'BHP Group', ticker: 'BHP', why: 'Worlds largest miner. Iron ore + copper.', color: '#e31937' },
                { name: 'CBA', ticker: 'CBA', why: 'Australias largest bank. 4% yield.', color: '#ffcd00' },
                { name: 'CSL Limited', ticker: 'CSL', why: 'Global biotech leader. Plasma therapies.', color: '#0065ba' },
                { name: 'Fortescue', ticker: 'FMG', why: 'Iron ore giant. Green energy pivot.', color: '#e8232a' },
              ].map(s => (
                <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}`, padding: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem' }}>{s.name}</h4>
                  <span className="tp-ticker" style={{ fontSize: '0.7rem' }}>{s.ticker}</span>
                  <p style={{ fontSize: '0.78rem', marginTop: 4, color: '#c8d6e5' }}>{s.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tp-card tp-card-red" style={{ borderLeftColor: '#ff6b6b' }}>
        <h3>🇪🇺 Europe — Continental Champions</h3>
        <div className="tp-grid-3">
          {[
            { name: 'ASML', country: '🇳🇱', ticker: 'ASML', why: 'Only EUV chip lithography maker. Monopoly.', color: '#00a3e0' },
            { name: 'Novo Nordisk', country: '🇩🇰', ticker: 'NVO', why: 'Ozempic/Wegovy. Obesity drug leader.', color: '#0066a1' },
            { name: 'LVMH', country: '🇫🇷', ticker: 'MC.PA', why: 'Luxury goods king. Louis Vuitton + Dior.', color: '#5c2d2d' },
            { name: 'SAP', country: '🇩🇪', ticker: 'SAP', why: 'Enterprise software. Cloud transition.', color: '#0070c0' },
            { name: 'Nestlé', country: '🇨🇭', ticker: 'NESN', why: 'Consumer staples. 30+ years of dividend growth.', color: '#8b0000' },
            { name: 'Siemens', country: '🇩🇪', ticker: 'SIE.DE', why: 'Industrial automation + energy.', color: '#009999' },
          ].map(s => (
            <div key={s.ticker} className="tp-top-stock-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="tp-top-stock-header">
                <span className="tp-top-stock-icon">{s.country}</span>
                <div>
                  <h4>{s.name}</h4>
                  <span className="tp-ticker">{s.ticker}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', marginTop: 6, color: '#c8d6e5' }}>{s.why}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ TRADING CATEGORIES HUB ═══════════════ */
function TradingCategoriesHub() {
  const categories = [
    { icon: '📈', name: 'Stocks & Shares', desc: 'Own pieces of companies. Buy low, sell high.', risk: 'Medium', return: '7-12%/yr', color: '#4da6ff', examples: 'AAPL, NVDA, DBS, TCS' },
    { icon: '🏛️', name: 'Government Bonds', desc: 'Lend money to governments. Safest investments.', risk: 'Very Low', return: '3-5%/yr', color: '#2ee6a8', examples: 'US Treasury, SG SSB, G-Sec' },
    { icon: '🏢', name: 'Corporate Bonds', desc: 'Lend to companies. Higher yield, higher risk.', risk: 'Low-Med', return: '4-7%/yr', color: '#b388ff', examples: 'Apple Bonds, Tesla Bonds' },
    { icon: '📦', name: 'ETFs', desc: 'Baskets of stocks/bonds in one purchase.', risk: 'Low-Med', return: '7-10%/yr', color: '#ffd24a', examples: 'CSPX, VWRA, QQQ, GLD' },
    { icon: '🤝', name: 'Mutual Funds', desc: 'Professional money management for a fee.', risk: 'Low-Med', return: '5-10%/yr', color: '#35e0ff', examples: 'Vanguard 500, Fidelity' },
    { icon: '🏠', name: 'REITs', desc: 'Real estate without buying property.', risk: 'Medium', return: '5-8%/yr', color: '#ff8c42', examples: 'VNQ, Mapletree, CapitaLand' },
    { icon: '🪙', name: 'Gold & Commodities', desc: 'Physical goods that drive the economy.', risk: 'Medium-High', return: '5-15%/yr', color: '#ffd24a', examples: 'GLD, Silver, Copper, Oil' },
    { icon: '₿', name: 'Cryptocurrency', desc: 'Digital currencies on blockchain.', risk: 'Very High', return: '?? -50 to +500%', color: '#ff8c42', examples: 'Bitcoin, Ethereum, Solana' },
    { icon: '💱', name: 'Forex', desc: 'Trade currencies against each other.', risk: 'Very High', return: 'Varies wildly', color: '#ff6b9d', examples: 'EUR/USD, USD/SGD' },
    { icon: '📊', name: 'Indices', desc: 'Track entire market performance.', risk: 'Low-Med', return: '7-10%/yr', color: '#2ee6a8', examples: 'S&P 500, STI, Nifty 50' },
    { icon: '🎯', name: 'Options', desc: 'Right to buy/sell at set price.', risk: 'Very High', return: 'Unlimited/Limited', color: '#ffd24a', examples: 'AAPL Calls, SPY Puts' },
    { icon: '📅', name: 'Futures', desc: 'Obligation to buy/sell at set date.', risk: 'Very High', return: 'Leveraged', color: '#b388ff', examples: 'S&P Futures, Crude Oil' },
    { icon: '⚡', name: 'Leveraged ETFs', desc: 'Amplified returns (2x-3x).', risk: 'Very High', return: '2-3x daily', color: '#ff6b9d', examples: 'TQQQ, SOXL, UPRO' },
    { icon: '🔄', name: 'Penny Stocks', desc: 'Stocks under $5. Lottery tickets.', risk: 'Extreme', return: '95% lose', color: '#ff4444', examples: 'Avoid!' },
    { icon: '🎨', name: 'Alternatives', desc: 'Art, wine, collectibles, private equity.', risk: 'High', return: '5-20%/yr', color: '#35e0ff', examples: 'Masterworks, Vinovest' },
    { icon: '💵', name: 'Cash & Money Market', desc: 'High-interest cash. Safe parking.', risk: 'None', return: '3-5%/yr', color: '#2ee6a8', examples: 'Moomoo CashPlus, T-Bills' },
    { icon: '🏗️', name: 'Structured Products', desc: 'Packaged investments with floor & cap.', risk: 'Medium-High', return: '8-15% possible', color: '#ffd24a', examples: 'DBS Capital Notes' },
    { icon: '📦', name: 'Index Funds', desc: 'Mutual fund tracking an index. Low fees.', risk: 'Low-Med', return: '7-10%/yr', color: '#4da6ff', examples: 'VOO, FZROX, FXAIX' },
  ];

  return (
    <div>
      <div className="tp-section-header">
        <h2>🗂️ All Trading Categories</h2>
        <p>Every type of investment at a glance — from safest to highest risk.</p>
      </div>

      <div className="tp-categories-grid">
        {categories.map(cat => (
          <div key={cat.name} className="tp-category-card" style={{ borderTop: `4px solid ${cat.color}`, background: `linear-gradient(135deg, ${cat.color}08, ${cat.color}03)` }}>
            <div className="tp-category-icon" style={{ background: `${cat.color}18`, color: cat.color }}>{cat.icon}</div>
            <h4 style={{ color: cat.color }}>{cat.name}</h4>
            <p className="tp-category-desc">{cat.desc}</p>
            <div className="tp-category-meta">
              <span className="tp-badge" style={{ background: `${cat.color}18`, color: cat.color }}>Risk: {cat.risk}</span>
              <span className="tp-badge" style={{ background: 'rgba(46,230,168,0.12)', color: '#2ee6a8' }}>Return: {cat.return}</span>
            </div>
            <p className="tp-category-examples">Examples: {cat.examples}</p>
          </div>
        ))}
      </div>

      <div className="tp-card tp-card-green" style={{ marginTop: 20 }}>
        <h3>🎯 Risk Scale — Which Is Right For You?</h3>
        <div className="tp-risk-scale">
          <div className="tp-risk-level" style={{ background: 'rgba(46,230,168,0.15)', borderLeft: '4px solid #2ee6a8' }}>
            <h5>🟢 Very Low Risk</h5>
            <p>SSB, T-Bills, Fixed Deposits</p>
            <span className="tp-muted">For: Emergency fund, conservative investors</span>
          </div>
          <div className="tp-risk-level" style={{ background: 'rgba(77,166,255,0.12)', borderLeft: '4px solid #4da6ff' }}>
            <h5>🔵 Low Risk</h5>
            <p>Government Bonds, Bond ETFs, SSB</p>
            <span className="tp-muted">For: Income seekers, retirees</span>
          </div>
          <div className="tp-risk-level" style={{ background: 'rgba(255,210,74,0.12)', borderLeft: '4px solid #ffd24a' }}>
            <h5>🟡 Medium Risk</h5>
            <p>S&P 500 ETF, Blue Chips, REITs</p>
            <span className="tp-muted">For: Most investors (5+ year horizon)</span>
          </div>
          <div className="tp-risk-level" style={{ background: 'rgba(255,140,66,0.12)', borderLeft: '4px solid #ff8c42' }}>
            <h5>🟠 High Risk</h5>
            <p>Growth Stocks, Small Caps, Crypto</p>
            <span className="tp-muted">For: Aggressive investors (10+ year horizon)</span>
          </div>
          <div className="tp-risk-level" style={{ background: 'rgba(255,107,107,0.12)', borderLeft: '4px solid #ff6b6b' }}>
            <h5>🔴 Very High Risk</h5>
            <p>Options, Leveraged ETFs, Forex, Penny Stocks</p>
            <span className="tp-muted">For: Experienced traders only (10% of portfolio max)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ COUNTRY FUNDS & BONDS ═══════════════ */
function CountryBondsFunds() {
  return (
    <div>
      <div className="tp-section-header">
        <h2>🏦 Country-Specific Funds & Bonds</h2>
        <p>Government bonds, sovereign funds, and country-specific mutual funds — organized by nation.</p>
      </div>

      {/* Singapore */}
      <div className="tp-card tp-card-green">
        <h3>🇸🇬 Singapore — Government Securities & Funds</h3>
        <div className="tp-grid-2">
          <div>
            <h4>🏛️ Government Bonds</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Instrument</th><th>Yield</th><th>Min</th><th>How to Buy</th></tr></thead><tbody>
                <tr><td><strong>Singapore Savings Bonds (SSB)</strong></td><td className="green">~3.0%</td><td>S$500</td><td>DBS/OCBC/UOB ATM</td></tr>
                <tr><td><strong>SG Treasury Bills (T-Bills)</strong></td><td className="green">~3.2%</td><td>S$1,000</td><td>DBS/OCBC/UOB</td></tr>
                <tr><td><strong>SG Government Securities (SGS)</strong></td><td className="green">~3.1%</td><td>S$1,000</td><td>Monetary Authority of SG</td></tr>
                <tr><td><strong>Singapore Gold Bonds (SGB)</strong></td><td className="green">2.5% + gold</td><td>S$1,000</td><td>DBS/OCBC/UOB</td></tr>
              </tbody></table>
            </div>
          </div>
          <div>
            <h4>📦 SG-Focused Funds</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Fund</th><th>Type</th><th>Fee</th></tr></thead><tbody>
                <tr><td><strong>Lion-OCBC STI ETF</strong></td><td>Equity</td><td>0.30%</td></tr>
                <tr><td><strong>Lion-OCBC Gold ETF</strong></td><td>Commodity</td><td>0.40%</td></tr>
                <tr><td><strong>Nikko AM STI ETF</strong></td><td>Equity</td><td>0.28%</td></tr>
                <tr><td><strong>Lion-OCBC Hang Seng TECH ETF</strong></td><td>Equity</td><td>0.55%</td></tr>
                <tr><td><strong>Frasers Logistics Trust</strong></td><td>REIT</td><td>6.1% yield</td></tr>
                <tr><td><strong>Mapletree Industrial Trust</strong></td><td>REIT</td><td>6.2% yield</td></tr>
              </tbody></table>
            </div>
          </div>
        </div>
      </div>

      {/* USA */}
      <div className="tp-card tp-card-blue">
        <h3>🇺🇸 United States — Treasury & Funds</h3>
        <div className="tp-grid-2">
          <div>
            <h4>🏛️ US Treasury Securities</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Instrument</th><th>Yield</th><th>Term</th><th>How to Buy</th></tr></thead><tbody>
                <tr><td><strong>US Treasury Bills</strong></td><td className="green">~4.5%</td><td>4-52 weeks</td><td>TreasuryDirect.gov</td></tr>
                <tr><td><strong>US Treasury Notes</strong></td><td className="green">~4.2%</td><td>2-10 years</td><td>TreasuryDirect.gov</td></tr>
                <tr><td><strong>US Treasury Bonds</strong></td><td className="green">~4.5%</td><td>20-30 years</td><td>TreasuryDirect.gov</td></tr>
                <tr><td><strong>I-Bonds (Inflation)</strong></td><td className="green">~3.1%</td><td>30 years (lock 1yr)</td><td>TreasuryDirect.gov</td></tr>
                <tr><td><strong>TIPS (Inflation-Protected)</strong></td><td className="green">~2.0% + CPI</td><td>5-30 years</td><td>Brokerage (IBKR)</td></tr>
              </tbody></table>
            </div>
          </div>
          <div>
            <h4>📦 US Bond & Sector Funds</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Fund</th><th>Type</th><th>Yield/Fee</th></tr></thead><tbody>
                <tr><td><strong>Vanguard Total Bond (BND)</strong></td><td>Bond Index</td><td>4.3% yield</td></tr>
                <tr><td><strong>iShares Core US Agg (AGG)</strong></td><td>Bond Index</td><td>0.03% fee</td></tr>
                <tr><td><strong>PIMCO Total Return</strong></td><td>Active Bond</td><td>4.5% yield</td></tr>
                <tr><td><strong>SCHD (Dividend)</strong></td><td>Dividend</td><td>3.5% yield</td></tr>
                <tr><td><strong>VYM (High Dividend)</strong></td><td>Dividend</td><td>2.8% yield</td></tr>
                <tr><td><strong>VNQ (REITs)</strong></td><td>Real Estate</td><td>4.0% yield</td></tr>
              </tbody></table>
            </div>
          </div>
        </div>
      </div>

      {/* India */}
      <div className="tp-card tp-card-orange">
        <h3>🇮🇳 India — Government Securities & Debt Funds</h3>
        <div className="tp-grid-2">
          <div>
            <h4>🏛️ Indian Government Instruments</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Instrument</th><th>Yield</th><th>Min</th><th>How to Buy</th></tr></thead><tbody>
                <tr><td><strong>G-Sec (Govt Securities)</strong></td><td className="green">~7.0%</td><td>₹10,000</td><td>Zerodha Kite</td></tr>
                <tr><td><strong>Sovereign Gold Bonds (SGB)</strong></td><td className="green">2.5% + gold</td><td>₹1,000</td><td>Zerodha / Groww</td></tr>
                <tr><td><strong>Treasury Bills (T-Bills)</strong></td><td className="green">~6.8%</td><td>₹10,000</td><td>Zerodha Kite</td></tr>
                <tr><td><strong>RBI Floating Rate Bonds</strong></td><td className="green">~8.05%</td><td>₹1,000</td><td>Post Office / Banks</td></tr>
                <tr><td><strong>NPS (National Pension)</strong></td><td className="green">~9-10%</td><td>₹1,000/yr</td><td>Zerodha / Groww</td></tr>
              </tbody></table>
            </div>
          </div>
          <div>
            <h4>📦 Indian Debt & Equity Funds</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Fund</th><th>Type</th><th>Return</th></tr></thead><tbody>
                <tr><td><strong>HDFC Short Term Debt</strong></td><td>Short Duration</td><td>7.5%</td></tr>
                <tr><td><strong>ICICI Pru Gilt Fund</strong></td><td>Gilt</td><td>7.2%</td></tr>
                <tr><td><strong>Nippon India Gilt</strong></td><td>Govt Bond</td><td>7.0%</td></tr>
                <tr><td><strong>Axis Bluechip Fund</strong></td><td>Large Cap Equity</td><td>12-15%</td></tr>
                <tr><td><strong>Parag Parikh Flexi Cap</strong></td><td>Flexi Cap</td><td>18-22%</td></tr>
                <tr><td><strong>Motilal Oswal Nasdaq 100</strong></td><td>US Tech Index</td><td>20%+ (3yr)</td></tr>
              </tbody></table>
            </div>
          </div>
        </div>
      </div>

      {/* Hong Kong */}
      <div className="tp-card tp-card-purple">
        <h3>🇭🇰 Hong Kong — Bonds & Funds</h3>
        <div className="tp-grid-2">
          <div>
            <h4>🏛️ HK Government Instruments</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Instrument</th><th>Yield</th><th>How to Buy</th></tr></thead><tbody>
                <tr><td><strong>iBonds</strong></td><td className="green">~3-4%</td><td>HSBC / StanChart</td></tr>
                <tr><td><strong>Silver Bonds (65+)</strong></td><td className="green">~4%</td><td>HSBC / StanChart</td></tr>
                <tr><td><strong>HKSAR Govt Green Bonds</strong></td><td className="green">~3.5%</td><td>Brokerage</td></tr>
                <tr><td><strong>Hang Seng Index Tracking Fund</strong></td><td>ETF</td><td>Moomoo / IBKR</td></tr>
              </tbody></table>
            </div>
          </div>
          <div>
            <h4>📦 HK/China Funds</h4>
            <div className="tp-table-wrap">
              <table><thead><tr><th>Fund</th><th>Type</th><th>Fee</th></tr></thead><tbody>
                <tr><td><strong>Tracker Fund (2800.HK)</strong></td><td>Hang Seng ETF</td><td>0.09%</td></tr>
                <tr><td><strong>Hang Seng TECH ETF (3032.HK)</strong></td><td>Tech Index</td><td>0.55%</td></tr>
                <tr><td><strong>CSI 300 ETF (2846.HK)</strong></td><td>China A-Shares</td><td>0.50%</td></tr>
                <tr><td><strong>Dimensional HK Value Fund</strong></td><td>Value Equity</td><td>0.75%</td></tr>
              </tbody></table>
            </div>
          </div>
        </div>
      </div>

      {/* Japan, Korea, Europe, Australia */}
      <div className="tp-card tp-card-cyan">
        <h3>🇯🇵 🇰🇷 🇪🇺 🇦🇺 Global Government Bonds & Country Funds</h3>
        <div className="tp-table-wrap">
          <table>
            <thead><tr><th>Country</th><th>Instrument</th><th>Yield</th><th>Best Fund/ETF</th><th>Fee</th></tr></thead>
            <tbody>
              {[
                { flag: '🇯🇵 Japan', inst: 'JGB (Japan Govt Bonds)', y: '~1.0%', fund: 'EWJ (iShares MSCI Japan)', fee: '0.50%' },
                { flag: '🇯🇵 Japan', inst: 'J-REITs', y: '~4.0%', fund: 'IJR (iShares Core Japan REIT)', fee: '0.49%' },
                { flag: '🇰🇷 Korea', inst: 'Korean Treasury Bonds', y: '~3.2%', fund: 'EWY (iShares MSCI Korea)', fee: '0.59%' },
                { flag: '🇰🇷 Korea', inst: 'Korean Corporate Bonds', y: '~4.5%', fund: 'Korea Bond ETFs on KRX', fee: '0.15%' },
                { flag: '🇬🇧 UK', inst: 'UK Gilts', y: '~4.2%', fund: 'VGLT (Vanguard Long-Term Gilt)', fee: '0.12%' },
                { flag: '🇬🇧 UK', inst: 'UK Corporate Bonds', y: '~5.0%', fund: 'iShares £ Corp Bond ETF', fee: '0.19%' },
                { flag: '🇩🇪 Germany', inst: 'Bunds (German Govt)', y: '~2.5%', fund: 'Euro Govt Bond ETFs', fee: '0.10%' },
                { flag: '🇦🇺 Australia', inst: 'Aussie Govt Bonds', y: '~4.0%', fund: 'VAF (Vanguard Aust. Fixed Interest)', fee: '0.20%' },
                { flag: '🇦🇺 Australia', inst: 'Aussie REITs', y: '~4.5%', fund: 'VAP (Vanguard Aust. Property)', fee: '0.23%' },
                { flag: '🇨🇦 Canada', inst: 'Canadian Govt Bonds', y: '~3.5%', fund: 'XBB (iShares Canadian Bond)', fee: '0.20%' },
                { flag: '🇨🇳 China', inst: 'Chinese Govt Bonds', y: '~2.8%', fund: 'CNYB (Xtrackers China Govt Bond)', fee: '0.35%' },
              ].map((r, i) => (
                <tr key={i}><td><strong>{r.flag}</strong></td><td>{r.inst}</td><td className="green">{r.y}</td><td className="tp-ticker">{r.fund}</td><td>{r.fee}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tp-card tp-card-gold">
        <h3>🏆 Best Bond Allocation by Country</h3>
        <div className="tp-grid-3">
          {[
            { country: '🇸🇬 Singapore', icon: '🇸🇬', alloc: ['50% SSB (3.0%)', '20% T-Bills (3.2%)', '15% AGG Bond ETF', '15% Corporate Bonds'], color: '#ffd24a' },
            { country: '🇺🇸 USA', icon: '🇺🇸', alloc: ['40% Treasury Bills (4.5%)', '25% I-Bonds (3.1%)', '20% AGG (Bond ETF)', '15% Corporate Bonds'], color: '#4da6ff' },
            { country: '🇮🇳 India', icon: '🇮🇳', alloc: ['30% G-Sec (7.0%)', '25% SGB (2.5% + gold)', '25% Debt Mutual Funds', '20% NPS (9-10%)'], color: '#ff8c42' },
          ].map(c => (
            <div key={c.country} className="tp-compare-card" style={{ borderTop: `3px solid ${c.color}` }}>
              <h4>{c.icon} {c.country}</h4>
              <ul className="tp-list" style={{ textAlign: 'left', marginTop: 10 }}>{c.alloc.map(a => <li key={a}>{a}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ GLOBAL ETF DIRECTORY ═══════════════ */
function GlobalETFDirectory() {
  const etfSections = [
    {
      title: '🌍 Broad Market Index ETFs',
      color: '#4da6ff',
      etfs: [
        { name: 'Vanguard S&P 500', ticker: 'VOO', fee: '0.03%', tracks: 'S&P 500', ytd: '+12%', best: 'Cheapest S&P ETF' },
        { name: 'iShares Core S&P 500', ticker: 'CSPX', fee: '0.07%', tracks: 'S&P 500 (LSE)', ytd: '+11%', best: 'Best for SG (15% tax)' },
        { name: 'Vanguard All-World', ticker: 'VWRA', fee: '0.22%', tracks: 'FTSE All-World', ytd: '+10%', best: 'Own the world' },
        { name: 'iShares MSCI World', ticker: 'IWDA', fee: '0.20%', tracks: 'MSCI World', ytd: '+10%', best: 'Developed markets' },
        { name: 'Vanguard Total Stock', ticker: 'VTI', fee: '0.03%', tracks: 'Total US Market', ytd: '+11%', best: 'All US stocks' },
        { name: 'Vanguard FTSE Emerging', ticker: 'VWO', fee: '0.08%', tracks: 'Emerging Markets', ytd: '+5%', best: 'China, India, Brazil' },
      ]
    },
    {
      title: '💻 Sector & Thematic ETFs',
      color: '#b388ff',
      etfs: [
        { name: 'Invesco QQQ', ticker: 'QQQ', fee: '0.20%', tracks: 'Nasdaq 100', ytd: '+15%', best: 'Tech heavy' },
        { name: 'Vanguard Info Tech', ticker: 'VGT', fee: '0.10%', tracks: 'US Tech', ytd: '+14%', best: 'Broad tech exposure' },
        { name: 'iShares Semiconductor', ticker: 'SOXX', fee: '0.35%', tracks: 'US Chips', ytd: '+20%', best: 'AI chip boom' },
        { name: 'Global X AI & Tech', ticker: 'AIQ', fee: '0.68%', tracks: 'AI companies', ytd: '+25%', best: 'AI theme bet' },
        { name: 'ARK Innovation', ticker: 'ARKK', fee: '0.75%', tracks: 'Disruptive tech', ytd: '+18%', best: 'Cathie Wood picks' },
        { name: 'Vanguard Health Care', ticker: 'VHT', fee: '0.10%', tracks: 'US Healthcare', ytd: '+8%', best: 'Defensive sector' },
      ]
    },
    {
      title: '🏦 Bond & Fixed Income ETFs',
      color: '#2ee6a8',
      etfs: [
        { name: 'iShares Core US Agg', ticker: 'AGG', fee: '0.03%', tracks: 'US Bond Index', ytd: '+2%', best: 'Core bond holding' },
        { name: 'Vanguard Total Bond', ticker: 'BND', fee: '0.03%', tracks: 'Total US Bond', ytd: '+2%', best: 'Lowest cost bond ETF' },
        { name: 'iShares 20+ Treasury', ticker: 'TLT', fee: '0.15%', tracks: 'Long-term Treasuries', ytd: '+5%', best: 'Rate cut bet' },
        { name: 'iShares Corp Bond', ticker: 'LQD', fee: '0.14%', tracks: 'Investment Grade', ytd: '+3%', best: 'Corporate debt' },
        { name: 'Vanguard Interm Corp', ticker: 'VCIT', fee: '0.04%', tracks: 'Int-term Corporate', ytd: '+3%', best: 'Corporate income' },
        { name: 'iShares High Yield', ticker: 'HYG', fee: '0.49%', tracks: 'Junk Bonds', ytd: '+4%', best: 'Higher yield/risk' },
      ]
    },
    {
      title: '💰 Dividend & Income ETFs',
      color: '#ffd24a',
      etfs: [
        { name: 'Schwab US Dividend', ticker: 'SCHD', fee: '0.06%', tracks: 'Dividend Aristocrats', ytd: '+8%', best: '#1 dividend ETF' },
        { name: 'Vanguard High Dividend', ticker: 'VYM', fee: '0.06%', tracks: 'High Dividend Yield', ytd: '+7%', best: 'Broad dividend' },
        { name: 'iShares Div Growth', ticker: 'DGRO', fee: '0.08%', tracks: 'Dividend Growth', ytd: '+9%', best: 'Growing dividends' },
        { name: 'Vanguard Div Appreciation', ticker: 'VIG', fee: '0.06%', tracks: 'Dividend Growers', ytd: '+10%', best: 'Quality dividend' },
        { name: 'Global X SuperDiv', ticker: 'SDIV', fee: '1.11%', tracks: '100 High Yield', ytd: '+6%', best: '10%+ yield' },
        { name: 'iShares Intl Select Div', ticker: 'IDV', fee: '0.50%', tracks: 'Intl Dividends', ytd: '+5%', best: 'Global dividends' },
      ]
    },
    {
      title: '🪙 Commodity & Gold ETFs',
      color: '#ff8c42',
      etfs: [
        { name: 'SPDR Gold Shares', ticker: 'GLD', fee: '0.40%', tracks: 'Gold Price', ytd: '+25%', best: 'Gold standard' },
        { name: 'iShares Gold Trust', ticker: 'IAU', fee: '0.25%', tracks: 'Gold Price', ytd: '+25%', best: 'Cheaper gold ETF' },
        { name: 'United States Oil', ticker: 'USO', fee: '0.60%', tracks: 'WTI Crude', ytd: '-5%', best: 'Oil exposure' },
        { name: 'Invesco DB Commod', ticker: 'PDBC', fee: '0.59%', tracks: 'Broad Commodities', ytd: '+3%', best: 'Diversified commodities' },
        { name: 'iShares Silver Trust', ticker: 'SLV', fee: '0.50%', tracks: 'Silver Price', ytd: '+20%', best: 'Silver bet' },
        { name: 'Invesco Agriculture', ticker: 'DBA', fee: '0.85%', tracks: 'Agricultural', ytd: '+2%', best: 'Wheat, corn, soybeans' },
      ]
    },
    {
      title: '🌍 Regional & Country ETFs',
      color: '#ff6b9d',
      etfs: [
        { name: 'iShares Japan', ticker: 'EWJ', fee: '0.50%', tracks: 'MSCI Japan', ytd: '+12%', best: 'Japan exposure' },
        { name: 'iShares Korea', ticker: 'EWY', fee: '0.59%', tracks: 'MSCI Korea', ytd: '+8%', best: 'Samsung, SK Hynix' },
        { name: 'iShares China', ticker: 'MCHI', fee: '0.59%', tracks: 'MSCI China', ytd: '+5%', best: 'China bet' },
        { name: 'iShares India', ticker: 'INDA', fee: '0.64%', tracks: 'MSCI India', ytd: '+10%', best: 'India growth' },
        { name: 'iShares Brazil', ticker: 'EWZ', fee: '0.60%', tracks: 'MSCI Brazil', ytd: '+3%', best: 'Brazil exposure' },
        { name: 'Vanguard FTSE Europe', ticker: 'VGK', fee: '0.10%', tracks: 'FTSE Europe', ytd: '+9%', best: 'European stocks' },
      ]
    },
    {
      title: '🏠 REIT ETFs',
      color: '#35e0ff',
      etfs: [
        { name: 'Vanguard REIT', ticker: 'VNQ', fee: '0.12%', tracks: 'US REITs', ytd: '+5%', best: 'Best REIT ETF' },
        { name: 'Schwab US REIT', ticker: 'SCHH', fee: '0.07%', tracks: 'US REITs', ytd: '+5%', best: 'Lowest fee REIT' },
        { name: 'iShares US Real Estate', ticker: 'IYR', fee: '0.39%', tracks: 'US REITs', ytd: '+4%', best: 'Broad REIT exposure' },
        { name: 'Vanguard Global ex-US REIT', ticker: 'VNQI', fee: '0.12%', tracks: 'Global REITs', ytd: '+6%', best: 'Intl REITs' },
      ]
    },
    {
      title: '🚀 Leveraged & Inverse ETFs',
      color: '#ff4444',
      etfs: [
        { name: 'ProShares UltraPro QQQ', ticker: 'TQQQ', fee: '0.88%', tracks: '3x Nasdaq', ytd: '+50%', best: '3x daily Nasdaq' },
        { name: 'ProShares Ultra S&P', ticker: 'SSO', fee: '0.89%', tracks: '2x S&P 500', ytd: '+22%', best: '2x daily S&P' },
        { name: 'Direxion Semi Bull 3x', ticker: 'SOXL', fee: '0.76%', tracks: '3x Semiconductors', ytd: '+60%', best: '3x chip boom' },
        { name: 'ProShares UltraPro SP500', ticker: 'UPRO', fee: '0.89%', tracks: '3x S&P 500', ytd: '+33%', best: '3x daily S&P' },
      ]
    },
  ];

  return (
    <div>
      <div className="tp-section-header">
        <h2>📚 Global ETF Directory</h2>
        <p>Every major ETF organized by category — with fees, what they track, and best use cases.</p>
      </div>

      {etfSections.map(section => (
        <div key={section.title} className="tp-card" style={{ borderLeft: `4px solid ${section.color}` }}>
          <h3>{section.title}</h3>
          <div className="tp-table-wrap">
            <table>
              <thead><tr><th>ETF Name</th><th>Ticker</th><th>Fee</th><th>Tracks</th><th>YTD</th><th>Best For</th></tr></thead>
              <tbody>
                {section.etfs.map(etf => (
                  <tr key={etf.ticker}>
                    <td><strong>{etf.name}</strong></td>
                    <td className="tp-ticker">{etf.ticker}</td>
                    <td>{etf.fee}</td>
                    <td>{etf.tracks}</td>
                    <td className={etf.ytd.startsWith('+') ? 'green' : 'tp-example-cell'} style={etf.ytd.startsWith('+') ? { color: '#2ee6a8' } : { color: '#ff6b6b' }}>{etf.ytd}</td>
                    <td className="tp-example-cell">{etf.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="tp-card tp-card-gold" style={{ marginTop: 20 }}>
        <h3>💡 ETF Selection Cheat Sheet</h3>
        <div className="tp-grid-3">
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #2ee6a8' }}>
            <h5>🛡️ Conservative (Income)</h5>
            <ul className="tp-list"><li><strong>AGG</strong> — Core bonds</li><li><strong>SCHD</strong> — Dividend income</li><li><strong>VNQ</strong> — REIT income</li><li><strong>GLD</strong> — Gold hedge</li></ul>
            <p className="tp-muted" style={{ marginTop: 6 }}>Fee: ~0.08% avg</p>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ffd24a' }}>
            <h5>⚖️ Balanced (Growth)</h5>
            <ul className="tp-list"><li><strong>CSPX</strong> — 40% S&P 500</li><li><strong>VWRA</strong> — 30% All-World</li><li><strong>QQQ</strong> — 20% Tech</li><li><strong>AGG</strong> — 10% Bonds</li></ul>
            <p className="tp-muted" style={{ marginTop: 6 }}>Fee: ~0.10% avg</p>
          </div>
          <div className="tp-concept-box" style={{ borderLeft: '3px solid #ff6b9d' }}>
            <h5>🚀 Aggressive (Max Growth)</h5>
            <ul className="tp-list"><li><strong>QQQ</strong> — 40% Nasdaq</li><li><strong>SOXX</strong> — 20% Semiconductors</li><li><strong>INDA</strong> — 15% India</li><li><strong>ARKK</strong> — 15% Disruption</li><li><strong>GLD</strong> — 10% Gold</li></ul>
            <p className="tp-muted" style={{ marginTop: 6 }}>Fee: ~0.30% avg</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ LIVE MARKET TICKER ═══════════════ */
function LiveMarketTicker() {
  const { t } = useLang();
  const [quotes, setQuotes] = useState([]);
  const [indices, setIndices] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchQuotes = useCallback(async () => {
    try {
      const [quotesRes, indicesRes] = await Promise.all([
        fetch(`/api/market/popular/quotes?country=${selectedCountry}`),
        fetch('/api/market/indices')
      ]);
      const quotesData = await quotesRes.json();
      const indicesData = await indicesRes.json();
      setQuotes(quotesData.quotes || []);
      setIndices(indicesData.indices || []);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    setLoading(true);
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchQuotes]);

  const countries = [
    { code: 'US', label: '🇺🇸 US', color: '#4da6ff' },
    { code: 'SG', label: '🇸🇬 Singapore', color: '#ff6b9d' },
    { code: 'IN', label: '🇮🇳 India', color: '#ff8c42' },
    { code: 'HK', label: '🇭🇰 Hong Kong', color: '#b388ff' },
    { code: 'JP', label: '🇯🇵 Japan', color: '#ffd24a' },
    { code: 'KR', label: '🇰🇷 Korea', color: '#2ee6a8' },
    { code: 'GB', label: '🇬🇧 UK', color: '#35e0ff' },
    { code: 'AU', label: '🇦🇺 Australia', color: '#ff6b9d' },
    { code: 'EU', label: '🇪🇺 Europe', color: '#b388ff' },
  ];

  const formatNum = (n) => {
    if (n == null) return '—';
    if (Math.abs(n) >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
    if (Math.abs(n) >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
    return n.toLocaleString();
  };

  return (
    <div>
      <div className="tp-section-header">
        <h2>🔴 Live Market Data — Real-Time Quotes</h2>
        <p>Auto-refreshing live prices powered by Yahoo Finance. Click any country to see top stocks.</p>
      </div>

      {/* Controls */}
      <div className="tp-live-controls">
        <div className="tp-live-country-tabs">
          {countries.map(c => (
            <button key={c.code}
              className={`tp-live-tab ${selectedCountry === c.code ? 'active' : ''}`}
              style={{ '--tab-color': c.color }}
              onClick={() => setSelectedCountry(c.code)}
            >{c.label}</button>
          ))}
        </div>
        <div className="tp-live-info">
          <span className="tp-live-dot" />
          <span>{lastUpdate ? `Last: ${lastUpdate}` : 'Loading...'}</span>
          <button className="tp-live-refresh-btn" onClick={() => { setLoading(true); fetchQuotes(); }}>⟳ {t('Refresh')}</button>
          <label className="tp-live-toggle">
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
            <span>{t('Auto-refresh')} 30s</span>
          </label>
        </div>
      </div>

      {/* Global Indices Ticker */}
      <div className="tp-card" style={{ borderLeft: '4px solid #ffd24a', marginBottom: 20 }}>
        <h3>📊 Global Market Indices</h3>
        <div className="tp-ticker-strip">
          {indices.map(idx => (
            <div key={idx.symbol} className="tp-ticker-item">
              <span className="tp-ticker-name">{idx.name}</span>
              <span className="tp-ticker-price">{idx.price != null ? idx.price.toLocaleString(undefined, {maximumFractionDigits: 2}) : '—'}</span>
              {idx.changePct != null && (
                <span className={`tp-ticker-change ${idx.changePct >= 0 ? 'green' : 'red'}`}>
                  {idx.changePct >= 0 ? '▲' : '▼'} {Math.abs(idx.changePct).toFixed(2)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Country Stocks Table */}
      <div className="tp-card" style={{ borderLeft: '4px solid #4da6ff' }}>
        <h3>{countries.find(c => c.code === selectedCountry)?.label} Top Stocks — Live Prices</h3>
        {loading ? (
          <div className="tp-live-loading">
            <div className="tp-spinner" /> Loading live market data...
          </div>
        ) : (
          <div className="tp-table-wrap">
            <table>
              <thead>
                <tr><th>Symbol</th><th>Name</th><th>Price</th><th>Change</th><th>Change %</th><th>Day Range</th><th>52W Range</th><th>Market Cap</th><th>P/E</th><th>Yield</th></tr>
              </thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.symbol}>
                    <td><span className="tp-ticker">{q.symbol}</span></td>
                    <td><strong>{q.name}</strong></td>
                    <td className="tp-price-cell" style={{ color: q.changePct >= 0 ? '#2ee6a8' : '#ff6b6b' }}>
                      {q.price != null ? `${q.currency || ''} ${q.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '—'}
                    </td>
                    <td style={{ color: q.changePct >= 0 ? '#2ee6a8' : '#ff6b6b' }}>
                      {q.change != null ? `${q.change >= 0 ? '+' : ''}${q.change.toFixed(2)}` : '—'}
                    </td>
                    <td>
                      {q.changePct != null ? (
                        <span className={`tp-badge ${q.changePct >= 0 ? 'tp-badge-green' : 'tp-badge-red'}`}>
                          {q.changePct >= 0 ? '+' : ''}{q.changePct.toFixed(2)}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="tp-muted">{q.low != null && q.high != null ? `${q.low.toFixed(2)} — ${q.high.toFixed(2)}` : '—'}</td>
                    <td className="tp-muted">{q.week52Low != null && q.week52High != null ? `${q.week52Low.toFixed(2)} — ${q.week52High.toFixed(2)}` : '—'}</td>
                    <td>{q.marketCap != null ? formatNum(q.marketCap) : '—'}</td>
                    <td>{q.pe != null ? q.pe.toFixed(1) : '—'}</td>
                    <td>{q.dividendYield != null ? `${(q.dividendYield * 100).toFixed(2)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="tp-alert tp-alert-info" style={{ marginTop: 16 }}>
        ℹ️ <strong>Data Source:</strong> Yahoo Finance (free tier). Prices may be delayed 15-20 minutes for some exchanges. Auto-refreshes every 30 seconds.
      </div>
    </div>
  );
}

/* ═══════════════ STOCK COMPARISON ═══════════════ */
function StockCompare() {
  const [sym1, setSym1] = useState('NVDA');
  const [sym2, setSym2] = useState('AAPL');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doCompare = async () => {
    if (!sym1.trim() || !sym2.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/market/compare?symbol1=${encodeURIComponent(sym1.trim())}&symbol2=${encodeURIComponent(sym2.trim())}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('Failed to fetch comparison data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { doCompare(); }, []);

  const quickPairs = [
    { a: 'NVDA', b: 'AMD', label: 'NVIDIA vs AMD', desc: 'GPU giants' },
    { a: 'AAPL', b: 'MSFT', label: 'Apple vs Microsoft', desc: 'Biggest companies' },
    { a: 'TSLA', b: 'BYD', label: 'Tesla vs BYD', desc: 'EV leaders' },
    { a: 'AMZN', b: 'GOOGL', label: 'Amazon vs Google', desc: 'Cloud & tech' },
    { a: 'VOO', b: 'QQQ', label: 'VOO vs QQQ', desc: 'Index ETFs' },
    { a: 'BTC-USD', b: 'ETH-USD', label: 'Bitcoin vs Ethereum', desc: 'Crypto titans' },
    { a: 'GLD', b: 'SLV', label: 'Gold vs Silver', desc: 'Precious metals' },
    { a: 'D05.SI', b: 'O39.SI', label: 'DBS vs OCBC', desc: 'SG banks' },
    { a: 'RELIANCE.NS', b: 'TCS.NS', label: 'Reliance vs TCS', desc: 'India blue chips' },
    { a: 'TSM', b: 'ASML', label: 'TSMC vs ASML', desc: 'Semiconductor' },
  ];

  const formatPrice = (v) => v != null ? v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
  const formatMcap = (v) => {
    if (v == null) return '—';
    if (Math.abs(v) >= 1e12) return `$${(v/1e12).toFixed(2)}T`;
    if (Math.abs(v) >= 1e9) return `$${(v/1e9).toFixed(1)}B`;
    return `$${(v/1e6).toFixed(0)}M`;
  };

  return (
    <div>
      <div className="tp-section-header">
        <h2>⚔️ Stock Comparison — Side by Side</h2>
        <p>Compare any two stocks, ETFs, or crypto assets head-to-head with real-time data.</p>
      </div>

      {/* Quick Pairs */}
      <div className="tp-card" style={{ borderLeft: '4px solid #35e0ff', marginBottom: 20 }}>
        <h3>⚡ Quick Compare</h3>
        <div className="tp-quick-pairs">
          {quickPairs.map(p => (
            <button key={p.a + p.b} className="tp-quick-pair-btn" onClick={() => { setSym1(p.a); setSym2(p.b); }}>
              <span className="tp-quick-pair-label">{p.label}</span>
              <span className="tp-quick-pair-desc">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Inputs */}
      <div className="tp-card" style={{ borderLeft: '4px solid #b388ff' }}>
        <h3>🔍 Compare Any Two Assets</h3>
        <div className="tp-compare-inputs">
          <div className="tp-compare-input-group">
            <label>Asset 1</label>
            <input type="text" value={sym1} onChange={e => setSym1(e.target.value)} placeholder="e.g. NVDA, BTC-USD" className="tp-compare-input" onKeyDown={e => e.key === 'Enter' && doCompare()} />
          </div>
          <div className="tp-compare-vs">VS</div>
          <div className="tp-compare-input-group">
            <label>Asset 2</label>
            <input type="text" value={sym2} onChange={e => setSym2(e.target.value)} placeholder="e.g. AAPL, ETH-USD" className="tp-compare-input" onKeyDown={e => e.key === 'Enter' && doCompare()} />
          </div>
          <button className="tp-compare-btn" onClick={doCompare} disabled={loading}>
            {loading ? '⏳ Comparing...' : '⚔️ Compare Now'}
          </button>
        </div>
        <p className="tp-muted" style={{ marginTop: 8, fontSize: '0.8rem' }}>
          💡 Use Yahoo Finance symbols: US stocks (NVDA), SG (D05.SI), India (.NS), HK (.HK), Japan (.T), Korea (.KS), ETFs (CSPX, VWRA), Crypto (BTC-USD)
        </p>
      </div>

      {error && <div className="tp-alert tp-alert-danger" style={{ marginTop: 12 }}>{error}</div>}

      {/* Comparison Result */}
      {data && data.stock1 && data.stock2 && (
        <div className="tp-compare-result">
          {/* Header Cards */}
          <div className="tp-compare-cards">
            {[data.stock1, data.stock2].map((stock, idx) => (
              <div key={idx} className="tp-compare-header-card">
                <div className="tp-compare-card-flag">
                  {stock.symbol?.includes('.SI') ? '🇸🇬' : stock.symbol?.includes('.NS') ? '🇮🇳' : stock.symbol?.includes('.HK') ? '🇭🇰' : stock.symbol?.includes('.T') ? '🇯🇵' : stock.symbol?.includes('.KS') ? '🇰🇷' : stock.symbol?.includes('.L') ? '🇬🇧' : stock.symbol?.includes('.AX') ? '🇦🇺' : stock.symbol?.includes('BTC') || stock.symbol?.includes('ETH') ? '₿' : '🇺🇸'}
                </div>
                <h3>{stock.name}</h3>
                <div className="tp-compare-symbol">{stock.symbol}</div>
                <div className="tp-compare-price" style={{ color: (stock.changePct || 0) >= 0 ? '#2ee6a8' : '#ff6b6b' }}>
                  {stock.currency} {formatPrice(stock.price)}
                </div>
                {stock.changePct != null && (
                  <div className="tp-compare-change" style={{ color: stock.changePct >= 0 ? '#2ee6a8' : '#ff6b6b' }}>
                    {stock.changePct >= 0 ? '▲' : '▼'} {Math.abs(stock.change || 0).toFixed(2)} ({stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%)
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {data.metrics && (
            <div className="tp-card" style={{ borderLeft: '4px solid #ffd24a', marginTop: 20 }}>
              <h3>📊 Head-to-Head Comparison</h3>
              <div className="tp-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th style={{ textAlign: 'center' }}>{data.stock1.symbol}</th>
                      <th style={{ textAlign: 'center' }}>{data.stock2.symbol}</th>
                      <th style={{ textAlign: 'center' }}>Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.metrics.map((m, i) => (
                      <tr key={i}>
                        <td><strong>{m.label}</strong></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={m.winner === 'stock1' ? 'tp-compare-winner' : ''}>
                            {m.label.includes('Market Cap') ? formatMcap(m.stock1) : m.label.includes('Yield') && m.stock1 != null ? `${(m.stock1 * 100).toFixed(2)}%` : m.label.includes('Price') || m.label.includes('High') || m.label.includes('Low') || m.label.includes('Open') ? formatPrice(m.stock1) : m.label.includes('Volume') ? (m.stock1 != null ? m.stock1.toLocaleString() : '—') : m.stock1 != null ? (typeof m.stock1 === 'number' ? m.stock1.toFixed(2) : m.stock1) : '—'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={m.winner === 'stock2' ? 'tp-compare-winner' : ''}>
                            {m.label.includes('Market Cap') ? formatMcap(m.stock2) : m.label.includes('Yield') && m.stock2 != null ? `${(m.stock2 * 100).toFixed(2)}%` : m.label.includes('Price') || m.label.includes('High') || m.label.includes('Low') || m.label.includes('Open') ? formatPrice(m.stock2) : m.label.includes('Volume') ? (m.stock2 != null ? m.stock2.toLocaleString() : '—') : m.stock2 != null ? (typeof m.stock2 === 'number' ? m.stock2.toFixed(2) : m.stock2) : '—'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {m.winner === 'stock1' && <span className="tp-badge tp-badge-green">{data.stock1.symbol}</span>}
                          {m.winner === 'stock2' && <span className="tp-badge tp-badge-blue">{data.stock2.symbol}</span>}
                          {m.winner === 'tie' && <span className="tp-badge tp-badge-gold">TIE</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Visual Bar Comparison */}
          {data.metrics && (
            <div className="tp-card" style={{ borderLeft: '4px solid #2ee6a8', marginTop: 20 }}>
              <h3>📈 Visual Comparison</h3>
              {data.metrics.filter(m => m.stock1 != null && m.stock2 != null && m.label !== 'Volume').map((m, i) => {
                const maxVal = Math.max(Math.abs(m.stock1 || 0), Math.abs(m.stock2 || 0));
                const pct1 = maxVal > 0 ? (Math.abs(m.stock1 || 0) / maxVal) * 100 : 50;
                const pct2 = maxVal > 0 ? (Math.abs(m.stock2 || 0) / maxVal) * 100 : 50;
                return (
                  <div key={i} className="tp-compare-bar-row">
                    <div className="tp-compare-bar-label">{m.label}</div>
                    <div className="tp-compare-bar-container">
                      <div className="tp-compare-bar-wrapper left">
                        <div className="tp-compare-bar" style={{ width: `${pct1}%`, background: m.winner === 'stock1' ? '#2ee6a8' : '#4da6ff' }} />
                        <span className="tp-compare-bar-val">{formatPrice(m.stock1)}</span>
                      </div>
                      <div className="tp-compare-bar-divider" />
                      <div className="tp-compare-bar-wrapper right">
                        <div className="tp-compare-bar" style={{ width: `${pct2}%`, background: m.winner === 'stock2' ? '#ff6b9d' : '#b388ff' }} />
                        <span className="tp-compare-bar-val">{formatPrice(m.stock2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="tp-alert tp-alert-info" style={{ marginTop: 16 }}>
        ℹ️ <strong>How to use:</strong> Enter any valid Yahoo Finance ticker symbol. For SG stocks use .SI suffix, India .NS, HK .HK, Japan .T, Korea .KS. ETFs: CSPX, VWRA, QQQ. Crypto: BTC-USD, ETH-USD.
      </div>
    </div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function TradingPage() {
  const { t } = useLang();
  const [activeSection, setActiveSection] = useState(() => { try { return localStorage.getItem('tp.section') || 'terminal'; } catch { return 'terminal'; } });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'terminal': return <TradingTerminal />;
      case 'plain': return <PlainEnglish />;
      case 'academy': return <TradingAcademy />;
      case 'universe': return <InvestmentUniverse />;
      case 'basics': return <TradingBasics />;
      case 'research': return <GlobalInvestmentResearch />;
      case 'taxsaving': return <TaxSavingFunds />;
      case 'topstocks': return <TopStocksWatch />;
      case 'categories': return <TradingCategoriesHub />;
      case 'stocks': return <StocksGuide />;
      case 'bonds': return <BondsGuide />;
      case 'countryfunds': return <CountryBondsFunds />;
      case 'etfs': return <ETFsGuide />;
      case 'etfdirectory': return <GlobalETFDirectory />;
      case 'mutual': return <MutualFundsGuide />;
      case 'commodities': return <CommoditiesGuide />;
      case 'crypto': return <CryptoGuide />;
      case 'forex': return <ForexGuide />;
      case 'indices': return <IndicesGuide />;
      case 'options': return <OptionsGuide />;
      case 'countries': return <CountryMarkets />;
      case 'advanced': return <AdvancedTopics />;
      case 'sixmonth': return <SixMonthPlan />;
      case 'rankings': return <RankingsGuide />;
      case 'strategies': return <StrategiesGuide />;
      case 'apps': return <AppsGuide />;
      case 'liveticker': return <LiveMarketTicker />;
      case 'compare': return <StockCompare />;
      case 'playbook': return <InvestmentPlaybook />;
      case 'advisor': return <LiveFinancialAdvisor />;
      case 'liveinv': return <LiveInvestments />;
      case 'daily': return <DailyTrading />;
      case 'hub': return <CountryTradingHub />;
      default: return <TradingBasics />;
    }
  };

  return (
    <div className="tp-page">
      {/* Hero */}
      <div className="tp-hero">
        <div className="tp-hero-orbs">
          <div className="tp-orb tp-orb-1" /><div className="tp-orb tp-orb-2" /><div className="tp-orb tp-orb-3" /><div className="tp-orb tp-orb-4" />
        </div>
        <div className="tp-hero-content">
          <div className="tp-kicker">📈 TRADING MASTER HUB — REAL-TIME EDITION</div>
          <h1 className="tp-hero-title">Complete Trading & Investing<br /><span className="tp-hero-accent">From Zero to Confident Investor</span></h1>
          <p className="tp-hero-sub">Stocks, Bonds, ETFs, Crypto, Forex, Options, Futures, Commodities — everything explained in plain English with real examples for SG, US, India, HK, Japan, Korea, UK, Europe & Australia markets.</p>
          <div className="tp-hero-stats">
            <div className="tp-hero-stat"><div className="tp-hero-stat-val">{SECTIONS.length}</div><div className="tp-hero-stat-label">{t('Sections')}</div></div>
            <div className="tp-hero-stat"><div className="tp-hero-stat-val">500+</div><div className="tp-hero-stat-label">{t('Topics')}</div></div>
            <div className="tp-hero-stat"><div className="tp-hero-stat-val">250+</div><div className="tp-hero-stat-label">{t('Examples')}</div></div>
            <div className="tp-hero-stat"><div className="tp-hero-stat-val">10+</div><div className="tp-hero-stat-label">{t('Markets')}</div></div>
          </div>
          <div className="tp-warning">⚠️ NOT FINANCIAL ADVICE — For educational purposes only. | Live quotes refresh every 15–60s</div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button className="tp-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? '✕' : '☰'} {t('Menu')}
      </button>

      {/* Layout: Sidebar + Content */}
      <div className="tp-layout">
        {/* Sidebar */}
        <aside className={`tp-sidebar ${mobileMenuOpen ? 'tp-sidebar-mobile-open' : ''}`}>
          <div className="tp-sidebar-header">
            <span className="tp-sidebar-title">📖 {t('Topics')}</span>
            <button className="tp-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? '◀' : '▶'}</button>
          </div>
          {SECTIONS.map(sec => (
            <div key={sec.id} className={`tp-sidebar-item ${activeSection === sec.id ? 'active' : ''}`} onClick={() => { setActiveSection(sec.id); setMobileMenuOpen(false); try { localStorage.setItem('tp.section', sec.id); } catch { /* storage unavailable */ } }}>
              <div className="tp-sidebar-item-main">
                <span className="tp-sidebar-icon photo-icon" data-pi="1" data-emoji={sec.icon} style={{ '--pi': `url("${photoUrl(SIDEBAR_PHOTO[sec.id] || 'dashboard', 160, 160)}")`, '--pi-size': '34px', '--pi-badge': '13px' }}>{sec.icon}</span>
                <span className="tp-sidebar-label">{sec.label}</span>
                <span className="tp-sidebar-arrow">›</span>
              </div>
            </div>
          ))}
        </aside>

        {/* Overlay for mobile */}
        {mobileMenuOpen && <div className="tp-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}

        {/* Main Content */}
        <main className="tp-main-content" key={activeSection}>
          <TradingPhotos section={activeSection} />
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <div className="tp-footer">
        <p>Trading Master Hub — Educational Content Only</p>
        <p className="tp-muted">Built with ❤️ | Your Platforms: Moomoo SG + Zerodha Kite | Live data via Yahoo Finance (may be delayed)</p>
      </div>
    </div>
  );
}
