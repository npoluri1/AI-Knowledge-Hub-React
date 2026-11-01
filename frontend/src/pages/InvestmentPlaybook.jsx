import React, { useState } from 'react';
import './TradingPage.css';
import { useLang } from '../i18n';

/* ═══════════════════════════════════════════════════════════════════════════
   INVESTMENT PLAYBOOK — Complete End-to-End Guide for Every Asset Class
   Covers: Buy/Sell steps, Conditions, Moomoo SG, Zerodha Kite India
   ═══════════════════════════════════════════════════════════════════════════ */

const BROKER_INFO = {
  moomoo: {
    name: 'Moomoo (Singapore)',
    icon: '🟠',
    color: '#ff8c42',
    fees: 'SG stocks: S$0 (promo) / US stocks: US$0 (promo)',
    minDeposit: 'S$0 (but need funds to trade)',
    markets: ['SGX', 'US (NYSE, NASDAQ)', 'HK (HKEX)', 'AU (ASX)', 'JP (TSE)', 'CN (SSE/SZSE)'],
    accountTypes: ['Cash Account', 'Margin Account'],
    kyc: 'Passport/IC + Proof of Address. 1-2 day approval.',
    pros: ['Commission-free promo', 'Real-time quotes', 'Paper trading', 'Good UI'],
    cons: ['Limited SG stocks vs local brokers', 'US stock settlement in USD'],
  },
  zerodha: {
    name: 'Zerodha Kite (India)',
    icon: '🔵',
    color: '#4da6ff',
    fees: 'Equity: 0.03% or ₹20 (whichever lower)',
    minDeposit: '₹0 (need funds to trade)',
    markets: ['NSE', 'BSE', 'MCX (commodities)', 'Mutual Funds'],
    accountTypes: ['Demat + Trading Account'],
    kyc: 'Aadhaar + PAN card + Bank account. eKYC online.',
    pros: ['Lowest brokerage in India', 'Best charting (Kite)', 'Coin for MFs', 'Excellent API'],
    cons: ['India only', 'No international stocks', '0.03% delivery brokerage'],
  },
};

const PLAYBOOK_DATA = [
  /* ═══════════════════════════════════════════════════════════════════════
     1. STOCKS & SHARES
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'stocks',
    icon: '📈',
    title: 'Stocks & Shares — Complete Investment Guide',
    subtitle: 'How to buy/sell stocks on Moomoo (SG) and Zerodha Kite (India) with full steps',
    color: '#4da6ff',
    sections: [
      {
        heading: '🤔 What You Need Before Starting',
        content: null,
        cards: [
          { title: '🇸🇬 Moomoo Requirements', items: [
            'Age: 18+ years old',
            'Documents: Passport or Singapore IC',
            'Proof of Address: Utility bill or bank statement (within 3 months)',
            'Bank account: Singapore bank account (DBS/OCBC/UOB)',
            'Minimum deposit: S$0 (but you need funds to actually buy)',
            'Account approval: 1-2 business days',
            'Funding: Bank transfer from SG bank to Moomoo account',
            'Currency: SGD for SGX stocks, USD for US stocks',
          ]},
          { title: '🇮🇳 Zerodha Kite Requirements', items: [
            'Age: 18+ years old',
            'Documents: PAN card (mandatory), Aadhaar card',
            'Bank account: Indian bank account linked to your PAN',
            'eKYC: Complete online with Aadhaar OTP',
            'Minimum deposit: ₹0 (need funds to trade)',
            'Account approval: Same day if KYC is complete',
            'Funding: UPI / Net Banking / NEFT to Zerodha account',
            'Currency: INR only',
          ]},
          { title: '⚠️ Key Conditions to Understand', items: [
            'Market hours: SG 9am-5pm SGT, US 9:30pm-4am SGT, India 11:45am-6pm SGT',
            'T+2 settlement: Stock trade settles in 2 business days',
            'Lot sizes: SG = 1 share minimum, US = 1 share, India = varies (1 for most)',
            'Circuit limits: Stocks can hit upper/lower circuit and stop trading',
            'Margin trading: Requires separate margin account (higher risk)',
            'Dividends: Automatically credited to your account',
            'Capital gains tax: SG = 0%, India = 10% above ₹1L (STT applies)',
          ]},
        ],
      },
      {
        heading: '🟢 How to BUY Stocks — Step by Step',
        content: null,
        brokers: {
          moomoo: [
            'Step 1: Open Moomoo app → Tap "Trade" or "Markets"',
            'Step 2: Search for stock by name or ticker (e.g., "DBS", "NVDA", "RELIANCE")',
            'Step 3: Tap the stock → You\'ll see the chart, price, and company info',
            'Step 4: Tap "Buy" button (green button)',
            'Step 5: Choose order type:',
            '   • Market Order: Buy immediately at current market price',
            '   • Limit Order: Set your own price — only executes when market hits your price',
            '   • Stop-Loss Order: Buy only if price rises above a trigger point',
            'Step 6: Enter quantity (number of shares)',
            'Step 7: Review order → Tap "Confirm" or "Place Order"',
            'Step 8: Order fills! Shares appear in your portfolio',
            '',
            '💡 TIP: For SG stocks, use Limit Order at slightly above current price.',
            '💡 TIP: For US stocks, place orders during US market hours (9:30 PM - 4:00 AM SGT)',
          ],
          zerodha: [
            'Step 1: Open Kite app → Go to "Marketwatch" tab',
            'Step 2: Tap "Search" icon → Type stock name or NSE/BSE code',
            'Step 3: Tap the stock → See chart, depth, and fundamentals',
            'Step 4: Tap "B" (Buy) button',
            'Step 5: Choose order type:',
            '   • Market: Buy at current best available price',
            '   • Limit: Set your own price — executes only at that price or better',
            '   • SL (Stop Loss): Trigger buy when price reaches your level',
            '   • SL-M: Market order triggered at a stop-loss price',
            'Step 6: Enter quantity and product type:',
            '   • CNC (Cash & Carry): Delivery — you hold shares long-term',
            '   • MIS (Intraday): Must sell same day — uses margin/leverage',
            'Step 7: Set validity: Day / IOC (Immediate or Cancel)',
            'Step 8: Tap "Buy" → Order placed!',
            'Step 9: Check "Orders" tab → "Executed" to see filled orders',
            'Step 10: Shares appear in "Portfolio" → "Holdings"',
            '',
            '💡 TIP: For long-term, always use CNC (delivery). Avoid MIS unless experienced.',
            '💡 TIP: Place GTT (Good Till Triggered) orders for price targets.',
          ],
        },
      },
      {
        heading: '🔴 How to SELL Stocks — Step by Step',
        content: null,
        brokers: {
          moomoo: [
            'Step 1: Open Moomoo → Tap "Portfolio" or "Assets"',
            'Step 2: Find the stock you want to sell in your holdings',
            'Step 3: Tap on the stock → Tap "Sell" button (red)',
            'Step 4: Choose order type (Market or Limit)',
            'Step 5: Enter quantity to sell (max = your holdings)',
            'Step 6: Review → Confirm to place sell order',
            'Step 7: Shares sold! Money credited after T+2 settlement',
            '',
            '⚠️ SG stocks: Settlement in 2 business days (T+2)',
            '⚠️ US stocks: Settlement in 1 business day (T+1)',
            '💡 TIP: You can sell shares you bought today (intraday) on Moomoo',
          ],
          zerodha: [
            'Step 1: Open Kite → Go to "Portfolio" → "Holdings"',
            'Step 2: Find the stock you want to sell',
            'Step 3: Tap "S" (Sell) button next to the stock',
            'Step 4: Choose order type:',
            '   • Market: Sell immediately',
            '   • Limit: Set your target sell price',
            '   • SL/SL-M: Stop-loss sell',
            'Step 5: Select product type:',
            '   • CNC: Selling delivery shares (held in Demat)',
            '   • MIS: Intraday sell',
            'Step 6: Enter quantity → Tap "Sell"',
            'Step 7: Check "Orders" → "Executed"',
            '',
            '⚠️ T+2 settlement: Money available after 2 days',
            '⚠️ STT (Securities Transaction Tax): 0.1% on sell side',
            '💡 TIP: Use GTT sell orders to automatically sell at your target price.',
          ],
        },
      },
      {
        heading: '📊 Stock Price Highs, Lows & Key Metrics (Live Reference)',
        content: null,
        stockData: [
          { region: '🇺🇸 US Top Stocks', stocks: [
            { name: 'NVIDIA (NVDA)', price: '~$228', yearHigh: '$236.54', yearLow: '$164.07', pe: '28.8', sector: 'AI/Semiconductors', rating: 'Strong Buy', dividendYield: '0.04%', marketCap: '$5.5T' },
            { name: 'Apple (AAPL)', price: '~$329', yearHigh: '$344.57', yearLow: '$225.95', pe: '37.8', sector: 'Technology', rating: 'Buy', dividendYield: '0.33%', marketCap: '$4.8T' },
            { name: 'Microsoft (MSFT)', price: '~$500', yearHigh: '$530+', yearLow: '$345+', pe: '36+', sector: 'Technology', rating: 'Strong Buy', dividendYield: '0.7%', marketCap: '$3.6T' },
            { name: 'Amazon (AMZN)', price: '~$225', yearHigh: '$245+', yearLow: '$160+', pe: '45+', sector: 'E-Commerce/Cloud', rating: 'Buy', dividendYield: '0%', marketCap: '$2.4T' },
            { name: 'Alphabet (GOOGL)', price: '~$195', yearHigh: '$210+', yearLow: '$140+', pe: '25+', sector: 'Tech/AI', rating: 'Buy', dividendYield: '0.4%', marketCap: '$2.4T' },
            { name: 'Meta (META)', price: '~$750', yearHigh: '$780+', yearLow: '$440+', pe: '28+', sector: 'Social/AI', rating: 'Buy', dividendYield: '0.3%', marketCap: '$1.9T' },
            { name: 'Tesla (TSLA)', price: '~$340', yearHigh: '$490+', yearLow: '$138+', pe: '120+', sector: 'EV/Energy', rating: 'Hold', dividendYield: '0%', marketCap: '$1.1T' },
            { name: 'Berkshire (BRK-B)', price: '~$520', yearHigh: '$540+', yearLow: '$380+', pe: '22+', sector: 'Diversified', rating: 'Buy', dividendYield: '0%', marketCap: '$1.1T' },
            { name: 'Palantir (PLTR)', price: '~$160', yearHigh: '$175+', yearLow: '$20+', pe: '400+', sector: 'AI/Data', rating: 'Hold', dividendYield: '0%', marketCap: '$370B' },
            { name: 'Broadcom (AVGO)', price: '~$260', yearHigh: '$275+', yearLow: '$120+', pe: '55+', sector: 'Semiconductors', rating: 'Buy', dividendYield: '1.2%', marketCap: '$1.2T' },
          ]},
          { region: '🇸🇬 Singapore Top Stocks', stocks: [
            { name: 'DBS Group (D05.SI)', price: 'S$50+', yearHigh: 'S$52+', yearLow: 'S$32+', pe: '11', sector: 'Banking', rating: 'Strong Buy', dividendYield: '5.5%', marketCap: 'S$130B' },
            { name: 'OCBC Bank (O39.SI)', price: 'S$16+', yearHigh: 'S$17+', yearLow: 'S$11+', pe: '9', sector: 'Banking', rating: 'Buy', dividendYield: '5.8%', marketCap: 'S$72B' },
            { name: 'UOB (U11.SI)', price: 'S$33+', yearHigh: 'S$35+', yearLow: 'S$25+', pe: '10', sector: 'Banking', rating: 'Buy', dividendYield: '5.2%', marketCap: 'S$56B' },
            { name: 'Singtel (Z74.SI)', price: 'S$3.50+', yearHigh: 'S$3.80+', yearLow: 'S$2.40+', pe: '16', sector: 'Telecom', rating: 'Buy', dividendYield: '4.5%', marketCap: 'S$46B' },
            { name: 'Mapletree Industrial (ME8U.SI)', price: 'S$2.60+', yearHigh: 'S$2.90+', yearLow: 'S$2.00+', pe: '18', sector: 'REITs', rating: 'Buy', dividendYield: '5.5%', marketCap: 'S$9B' },
            { name: 'CapitaLand Integrated (C38U.SI)', price: 'S$6.50+', yearHigh: 'S$7.20+', yearLow: 'S$5.00+', pe: '15', sector: 'REITs', rating: 'Buy', dividendYield: '5.0%', marketCap: 'S$21B' },
            { name: 'Thai Beverage (Y92.SI)', price: 'S$0.55+', yearHigh: 'S$0.62+', yearLow: 'S$0.45+', pe: '19', sector: 'Consumer', rating: 'Hold', dividendYield: '3.8%', marketCap: 'S$33B' },
            { name: 'Venture Corp (V03.SI)', price: 'S$15+', yearHigh: 'S$19+', yearLow: 'S$11+', pe: '13', sector: 'Electronics', rating: 'Buy', dividendYield: '5.0%', marketCap: 'S$4.4B' },
          ]},
          { region: '🇮🇳 India Top Stocks', stocks: [
            { name: 'Reliance (RELIANCE.NS)', price: '₹2,900+', yearHigh: '₹3,200+', yearLow: '₹2,200+', pe: '27', sector: 'Conglomerate', rating: 'Strong Buy', dividendYield: '0.35%', marketCap: '₹19.8T' },
            { name: 'TCS (TCS.NS)', price: '₹4,100+', yearHigh: '₹4,600+', yearLow: '₹3,400+', pe: '33', sector: 'IT Services', rating: 'Buy', dividendYield: '1.2%', marketCap: '₹14.8T' },
            { name: 'HDFC Bank (HDFCBANK.NS)', price: '₹1,750+', yearHigh: '₹1,900+', yearLow: '₹1,400+', pe: '19', sector: 'Banking', rating: 'Strong Buy', dividendYield: '1.1%', marketCap: '₹13.4T' },
            { name: 'Infosys (INFY.NS)', price: '₹1,850+', yearHigh: '₹2,000+', yearLow: '₹1,400+', pe: '28', sector: 'IT Services', rating: 'Buy', dividendYield: '2.3%', marketCap: '₹7.7T' },
            { name: 'ITC (ITC.NS)', price: '₹480+', yearHigh: '₹520+', yearLow: '₹400+', pe: '26', sector: 'Consumer/FMCG', rating: 'Buy', dividendYield: '3.0%', marketCap: '₹5.9T' },
            { name: 'Bajaj Finance (BAJFINANCE.NS)', price: '₹7,200+', yearHigh: '₹7,800+', yearLow: '₹5,500+', pe: '33', sector: 'NBFC', rating: 'Buy', dividendYield: '0.4%', marketCap: '₹4.5T' },
            { name: 'Tata Motors (TATAMOTORS.NS)', price: '₹950+', yearHigh: '₹1,100+', yearLow: '₹600+', pe: '10', sector: 'Auto/EV', rating: 'Strong Buy', dividendYield: '0.5%', marketCap: '₹3.5T' },
            { name: 'SBI (SBIN.NS)', price: '₹800+', yearHigh: '₹920+', yearLow: '₹580+', pe: '10', sector: 'Banking', rating: 'Buy', dividendYield: '1.8%', marketCap: '₹7.2T' },
            { name: 'Titan (TITAN.NS)', price: '₹3,500+', yearHigh: '₹3,900+', yearLow: '₹2,800+', pe: '72', sector: 'Jewellery/Retail', rating: 'Hold', dividendYield: '0.3%', marketCap: '₹3.1T' },
          ]},
          { region: '🇭🇰 Hong Kong Top Stocks', stocks: [
            { name: 'Tencent (0700.HK)', price: 'HK$530+', yearHigh: 'HK$580+', yearLow: 'HK$260+', pe: '22', sector: 'Tech/Gaming', rating: 'Strong Buy', dividendYield: '0.7%', marketCap: 'HK$4.9T' },
            { name: 'Alibaba (9988.HK)', price: 'HK$110+', yearHigh: 'HK$130+', yearLow: 'HK$65+', pe: '14', sector: 'E-Commerce', rating: 'Buy', dividendYield: '1.5%', marketCap: 'HK$2.2T' },
            { name: 'BYD (1211.HK)', price: 'HK$350+', yearHigh: 'HK$390+', yearLow: 'HK$180+', pe: '22', sector: 'EV', rating: 'Strong Buy', dividendYield: '0.6%', marketCap: 'HK$1.0T' },
            { name: 'Meituan (3690.HK)', price: 'HK$170+', yearHigh: 'HK$200+', yearLow: 'HK$80+', pe: '25', sector: 'Food Delivery', rating: 'Buy', dividendYield: '0%', marketCap: 'HK$1.0T' },
          ]},
        ],
      },
      {
        heading: '💰 Dividend Stocks — How to Earn Passive Income',
        content: 'Dividend stocks pay you CASH every quarter just for owning shares. Here\'s how to build a dividend portfolio:',
        steps: [
          '1. Choose high-dividend stocks (yield > 3-5%)',
          '2. Buy before the "ex-dividend date" (you must own shares BEFORE this date to get the dividend)',
          '3. Dividends are automatically credited to your broker account',
          '4. Reinvest dividends (DRIP) or withdraw as cash',
          '',
          '🏆 TOP DIVIDEND STOCKS BY COUNTRY:',
          '🇸🇬 SG: DBS (5.5%), OCBC (5.8%), Singtel (4.5%), Mapletree REITs (5-6%)',
          '🇺🇸 US: Realty Income (5.5%), Coca-Cola (3.0%), J&J (3.0%), AT&T (5.0%)',
          '🇮🇳 India: ITC (3.0%), Coal India (5.5%), ONGC (5.0%), Power Grid (4.0%)',
          '🇭🇰 HK: CLP Holdings (4.0%), Hong Kong Telecom (5.5%)',
        ],
      },
      {
        heading: '🎯 Stock Screening — How to Pick Winners',
        content: null,
        checklist: [
          { step: '1. Understand the Business', desc: 'Can you explain what the company does in ONE sentence? If not, don\'t buy it.' },
          { step: '2. Check Revenue Growth', desc: 'Revenue should be GROWING year over year. Look for 10%+ annual growth.' },
          { step: '3. Check Profit Margins', desc: 'Net profit margin > 10% is good. > 20% is excellent.' },
          { step: '4. Check P/E Ratio', desc: 'P/E < 20 = cheap, 20-40 = fair, > 40 = expensive. Compare to sector average.' },
          { step: '5. Check Debt', desc: 'Debt-to-Equity < 1.0 is healthy. > 2.0 is risky.' },
          { step: '6. Check Dividends', desc: 'Growing dividends every year = healthy company. Check payout ratio < 60%.' },
          { step: '7. Check Management', desc: 'CEO/Founder still running? Insider buying = bullish signal.' },
          { step: '8. Check Competition', desc: 'Does the company have a moat (competitive advantage) that\'s hard to copy?' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     2. BONDS
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'bonds',
    icon: '🏛️',
    title: 'Bonds — Complete Investment Guide',
    subtitle: 'How to invest in government & corporate bonds step by step',
    color: '#b388ff',
    sections: [
      {
        heading: '🤔 What Are Bonds & Why Invest?',
        content: 'Bonds are like lending money to a government or company. They pay you back with interest. Bonds are SAFER than stocks but give lower returns. Think of them as the "slow and steady" part of your portfolio.',
        cards: [
          { title: '📊 Bond Risk vs Return', items: [
            'Government Bonds (T-Bills, S-Bills): Risk: Almost Zero. Return: 3-5%',
            'Corporate Bonds (Good Companies): Risk: Low. Return: 4-7%',
            'High-Yield (Junk) Bonds: Risk: High. Return: 6-10%',
            'Zero-Coupon Bonds: Buy at discount, get full value at maturity',
            'Inflation-Linked Bonds: Returns adjust with inflation (I-Bonds, TIPS)',
          ]},
          { title: '🇸🇬 Moomoo — How to Buy SG/US Bonds', items: [
            'SG Savings Bonds (SSB): Go to DBS/OCBC/UOB ATM or internet banking',
            '   → Minimum S$500, Maximum S$200,000',
            '   → 10-year maturity, can redeem after 1 year',
            '   → Interest paid every 6 months',
            'T-Bills: Buy through MAS (monetary-authority.sg) or banks',
            '   → Minimum S$1,000',
            'US Treasury Bonds: Buy through Moomoo under "Bonds" section',
            '   → Search "US Treasury" in the app',
            '   → Minimum varies (usually US$1,000)',
            '   → Yields 4-5% currently',
          ]},
          { title: '🇮🇳 Zerodha Kite — How to Buy Indian Bonds', items: [
            'G-Sec (Government Securities):',
            '   → Go to "Coin" app by Zerodha or RBI Retail Direct',
            '   → Minimum ₹10,000 (face value)',
            '   → Yield ~7% for 10-year G-Sec',
            'Sovereign Gold Bonds (SGB):',
            '   → Buy through RBI Retail Direct or banks',
            '   → Minimum 1 gram, Maximum 4kg/year',
            '   → 2.5% annual interest + gold price appreciation',
            'T-Bills: Buy through RBI Retail Direct (retail.direct.rbi.org.in)',
            '   → 91-day, 182-day, 364-day options',
            '   → Minimum ₹10,000',
            'NPS (National Pension Scheme):',
            '   → Available on Kite under "Mutual Funds"',
            '   → Tax benefits under Section 80C & 80CCD(1B)',
          ]},
        ],
      },
      {
        heading: '🟢 How to BUY Bonds — Step by Step',
        content: null,
        brokers: {
          moomoo: [
            'For US Treasury Bonds on Moomoo:',
            'Step 1: Open Moomoo → Tap "Markets" → Search for bond ETF (e.g., "TLT", "IEF", "BND")',
            'Step 2: These are bond ETFs — easiest way to invest in bonds',
            'Step 3: Tap "Buy" → Enter quantity → Confirm',
            '',
            'For SG Savings Bonds (SSB):',
            'Step 1: Log in to DBS/OCBC/UOB internet banking',
            'Step 2: Go to "Investments" or "Singapore Government Securities"',
            'Step 3: Select "Singapore Savings Bonds"',
            'Step 4: Enter amount (min S$500, multiples of S$500)',
            'Step 5: Confirm purchase',
            'Step 6: Bonds credited to your CDP account in 2 business days',
          ],
          zerodha: [
            'For Government Bonds on Kite:',
            'Step 1: Open Kite → Go to "Mutual Funds" tab',
            'Step 2: Search for "Gilt Fund" or "Government Bond Fund"',
            'Step 3: Examples: "HDFC Gilt Fund", "ICICI Prudential Gilt Fund"',
            'Step 4: Tap "Buy" → Enter amount → Confirm',
            '',
            'For Direct Government Securities:',
            'Step 1: Register at retail.direct.rbi.org.in',
            'Step 2: Complete KYC with Aadhaar',
            'Step 3: Browse available G-Secs and T-Bills',
            'Step 4: Place bid with minimum ₹10,000',
            'Step 5: Allotment within 2-3 business days',
            '',
            'For SGB via Coin:',
            'Step 1: Open Zerodha Coin → Search "Sovereign Gold Bond"',
            'Step 2: Select the current series',
            'Step 3: Enter quantity (min 1 gram)',
            'Step 4: Pay online → Bonds credited to Demat account',
          ],
        },
      },
      {
        heading: '📊 Bond Prices, Yields & Highs/Lows',
        content: null,
        bondData: [
          { name: 'US 10-Year Treasury', yield: '~4.2%', price: 'Fluctuates inversely', safety: '★★★★★', maturity: '10 years' },
          { name: 'SG Savings Bonds (SSB)', yield: '~3.0%', price: 'Always at par (S$1)', safety: '★★★★★', maturity: '10 years (exit after 1)' },
          { name: 'SG T-Bills', yield: '~3.2%', price: 'Bought at discount', safety: '★★★★★', maturity: '6 months or 1 year' },
          { name: 'India G-Sec 10Y', yield: '~7.0%', price: 'Bought at discount', safety: '★★★★★', maturity: '10 years' },
          { name: 'India SGB', yield: '~2.5% + gold', price: 'Linked to gold price', safety: '★★★★☆', maturity: '8 years (exit after 5)' },
          { name: 'BND (Vanguard Total Bond ETF)', yield: '~4.5%', price: '~$72', safety: '★★★★☆', maturity: 'N/A (ETF)' },
          { name: 'TLT (iShares 20+ Year Treasury)', yield: '~4.3%', price: '~$87', safety: '★★★★☆', maturity: 'N/A (ETF)' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     3. ETFs
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'etfs',
    icon: '📦',
    title: 'ETFs — Complete Investment Guide',
    subtitle: 'The BEST investment for most people. How to buy ETFs step by step',
    color: '#2ee6a8',
    sections: [
      {
        heading: '🤔 Why ETFs Are Perfect for Beginners',
        content: null,
        cards: [
          { title: '✅ ETF Advantages', items: [
            'Instant diversification: Own 100s or 1000s of stocks in ONE purchase',
            'Low fees: 0.03-0.30% per year vs 1-2% for mutual funds',
            'No stock-picking needed: Buy the whole market',
            'Transparent: You know exactly what\'s in the ETF',
            'Tax efficient: Better than mutual funds for taxes',
            'Trade like stocks: Buy/sell anytime during market hours',
          ]},
          { title: '📊 Best ETFs for Each Goal', items: [
            '🏆 SAFEST START: CSPX (S&P 500) or VOO — Own top 500 US companies',
            '🌍 GLOBAL: VWRA — Own the ENTIRE world (8,700+ stocks)',
            '🇺🇸 US TECH: QQQ — Top 100 tech companies',
            '🇸🇬 SG: ES3 (STI ETF) — Top 30 Singapore companies',
            '🇮🇳 India: NIFTYBEES or NSEIF — Top 50 Indian companies',
            '🪙 Gold: GLD or IAU — Track gold price',
            '📦 Bonds: AGG or BND — US bond market',
            '🏠 REITs: VNQ — US real estate investment trusts',
            '💰 Dividends: SCHD — High-dividend US stocks',
          ]},
        ],
      },
      {
        heading: '🟢 How to BUY ETFs — Step by Step',
        content: null,
        brokers: {
          moomoo: [
            'Step 1: Open Moomoo → Tap "Markets" or "Search"',
            'Step 2: Search by ticker: "CSPX", "VWRA", "QQQ", "VOO", "GLD"',
            'Step 3: Tap the ETF → See chart, holdings, fees, performance',
            'Step 4: Tap "Buy" button',
            'Step 5: Choose Market or Limit order',
            'Step 6: Enter number of shares (fractional shares available for some)',
            'Step 7: Review → Confirm → Order placed!',
            '',
            '💡 SG投资者 IMPORTANT:',
            '   • CSPX on London Stock Exchange = 15% tax (vs 30% for VOO)',
            '   • VWRA = Global + Tax efficient for SG investors',
            '   • ES3 = CPF-OA eligible (can use CPF to buy!)',
            '   • Search "CSPX.L" for London-listed version',
            '',
            '💡 US ETF Alternative:',
            '   • VOO = Vanguard S&P 500 (0.03% fee)',
            '   • SPY = SPDR S&P 500 (0.09% fee, most liquid)',
            '   • QQQ = Invesco Nasdaq 100 (0.20% fee)',
          ],
          zerodha: [
            'For Indian ETFs on Kite:',
            'Step 1: Open Kite → Search for ETF ticker',
            'Step 2: Examples: "NIFTYBEES" (Nifty 50), "JUNIORBEES" (Nifty Next 50)',
            '   • "GOLDBEES" — Gold ETF',
            '   • "SILVERBEES" — Silver ETF',
            '   • "BANKBEES" — Bank Nifty ETF',
            '   • "MOM100" — Momentum 100 ETF',
            'Step 3: Tap "Buy" → Enter quantity → Confirm',
            'Step 4: Use CNC for delivery, MIS for intraday',
            '',
            'For Global ETFs (international mutual funds):',
            'Step 1: Open "Coin" by Zerodha',
            'Step 2: Search "Motilal Oswal S&P 500" or "Edelweiss US Tech"',
            'Step 3: These are fund-of-fund that track US/global ETFs',
            'Step 4: Enter SIP amount or one-time investment',
            'Step 5: Confirm → Auto-debit from bank',
            '',
            '💡 IMPORTANT: Indian residents can invest up to $250,000/year in foreign assets under RBI LRS.',
          ],
        },
      },
      {
        heading: '📊 ETF Comparison — Price, Fees, Returns',
        content: null,
        etfData: [
          { name: 'CSPX (iShares S&P 500)', ticker: 'CSPX.L', fee: '0.07%', return1y: '+25%', return5y: '+85%', risk: 'Medium', bestFor: 'US exposure for SG investors' },
          { name: 'VWRA (Vanguard All-World)', ticker: 'VWRA.L', fee: '0.22%', return1y: '+18%', return5y: '+60%', risk: 'Medium', bestFor: 'Own the entire world' },
          { name: 'QQQ (Invesco Nasdaq 100)', ticker: 'QQQ', fee: '0.20%', return1y: '+30%', return5y: '+120%', risk: 'Higher', bestFor: 'US tech focus' },
          { name: 'VOO (Vanguard S&P 500)', ticker: 'VOO', fee: '0.03%', return1y: '+25%', return5y: '+85%', risk: 'Medium', bestFor: 'Cheapest US exposure' },
          { name: 'GLD (SPDR Gold)', ticker: 'GLD', fee: '0.40%', return1y: '+30%', return5y: '+55%', risk: 'Medium', bestFor: 'Gold price tracking' },
          { name: 'ES3 (STI ETF)', ticker: 'ES3.SI', fee: '0.30%', return1y: '+5%', return5y: '+15%', risk: 'Medium', bestFor: 'SG market + CPF eligible' },
          { name: 'NIFTYBEES', ticker: 'NIFTYBEES', fee: '0.05%', return1y: '+15%', return5y: '+80%', risk: 'Medium-High', bestFor: 'Indian market exposure' },
          { name: 'GOLDBEES', ticker: 'GOLDBEES', fee: '0.50%', return1y: '+28%', return5y: '+50%', risk: 'Medium', bestFor: 'Gold in INR' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     4. GOLD, OIL, SILVER & COMMODITIES
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'commodities',
    icon: '🪙',
    title: 'Gold, Oil, Silver — Complete Commodities Investment Guide',
    subtitle: 'Every way to invest in gold, oil, silver, and commodities in SG and India',
    color: '#ffd24a',
    sections: [
      {
        heading: '🥇 GOLD — Every Way to Invest',
        content: null,
        cards: [
          { title: '🇸🇬 Gold on Moomoo (Singapore)', items: [
            '1. GLD ETF (SPDR Gold Shares):',
            '   → Search "GLD" on Moomoo → Buy like a stock',
            '   → Fee: 0.40%/year, Min: 1 share (~US$230)',
            '   → Tracks gold price directly',
            '2. Lion-OCBC Securities Gold ETF:',
            '   → Search "O87.SI" on Moomoo',
            '   → SG-listed, trades in SGD',
            '   → Fee: 0.35%/year',
            '3. Singapore Gold Bonds (SGB):',
            '   → Buy through DBS/OCBC/UOB',
            '   → 2.5% annual interest + gold price gain',
            '   → Min 1 gram (~S$100), hold 8 years for full benefit',
            '4. Physical Gold at UOB Bank:',
            '   → Buy gold bars/coins from UOB',
            '   → Premium: 3-8% above spot price',
            '   → Stored in UOB safe deposit box',
          ]},
          { title: '🇮🇳 Gold on Zerodha Kite (India)', items: [
            '1. GOLDBEES ETF:',
            '   → Search "GOLDBEES" on Kite → Buy like a stock',
            '   → Fee: 0.50%/year, Min: 1 unit (~₹55)',
            '   → Tracks domestic gold price in INR',
            '2. Sovereign Gold Bonds (SGB):',
            '   → Register at retail.direct.rbi.org.in',
            '   → Or buy on Kite → "WGB" series',
            '   → 2.5% annual interest + gold price appreciation',
            '   → Min 1 gram (~₹7,000), no storage cost!',
            '   → Tax-free capital gains if held to maturity (8 years)',
            '3. Gold Mutual Funds:',
            '   → Search "Gold" on Coin app',
            '   → Examples: "HDFC Gold Fund", "ICICI Pru Gold Fund"',
            '   → SIP option available from ₹100/month',
            '4. Digital Gold (PhonePe/Google Pay):',
            '   → Buy directly on PhonePe app',
            '   → Min ₹1, stored digitally',
            '   → Can convert to physical gold or coins',
          ]},
        ],
      },
      {
        heading: '🛢️ OIL — Every Way to Invest',
        content: null,
        cards: [
          { title: '🇸🇬 Oil on Moomoo (Singapore)', items: [
            '1. USO ETF (United States Oil Fund):',
            '   → Search "USO" on Moomoo → Buy like a stock',
            '   → Fee: 0.60%/year',
            '   → Tracks WTI crude oil price',
            '2. XLE (Energy Select Sector ETF):',
            '   → Search "XLE" on Moomoo',
            '   → Invests in oil companies (Exxon, Chevron)',
            '   → Fee: 0.09%/year, less volatile than oil itself',
            '3. Energy Stocks:',
            '   → SG: Keppel Corp (BN4.SI), Sembcorp (U96.SI)',
            '   → US: ExxonMobil (XOM), Chevron (CVX)',
            '   → Higher risk but potential for dividends + growth',
          ]},
          { title: '🇮🇳 Oil on Zerodha Kite (India)', items: [
            '1. MCX Crude Oil Futures:',
            '   → Available on Kite under "Commodities"',
            '   → Requires MCX commodity account',
            '   → Lot size: 100 barrels',
            '   → Margin: ~₹1,00,000+ (leverage available)',
            '   ⚠️ Risky — only for experienced traders!',
            '2. Energy Sector Funds:',
            '   → Search "Energy" on Coin',
            '   → "SBI Energy Fund", "ICICI Pru Energy Fund"',
            '   → Invests in Reliance, ONGC, etc.',
            '3. Direct Energy Stocks:',
            '   → Reliance Industries (RELIANCE.NS) — Oil + Telecom + Retail',
            '   → ONGC (ONGC.NS) — Oil exploration',
            '   → Indian Oil (IOC.NS) — Oil refining & distribution',
            '   → BPCL (BPCL.NS) — Bharat Petroleum',
          ]},
        ],
      },
      {
        heading: '⬜ SILVER — Every Way to Invest',
        content: null,
        cards: [
          { title: '🇸🇬 Silver on Moomoo', items: [
            '1. SLV ETF (iShares Silver Trust):',
            '   → Search "SLV" on Moomoo → Buy like a stock',
            '   → Fee: 0.50%/year, Min: 1 share (~US$25)',
            '   → Tracks silver price directly',
            '2. SIVR (Aberdeen Standard Physical Silver):',
            '   → Lower fee alternative to SLV',
          ]},
          { title: '🇮🇳 Silver on Zerodha', items: [
            '1. SILVERBEES ETF:',
            '   → Search "SILVERBEES" on Kite → Buy like a stock',
            '   → Tracks domestic silver price in INR',
            '   → Min: 1 unit (~₹75)',
            '2. MCX Silver Futures:',
            '   → Available on Kite → Commodities section',
            '   → Lot size: 30 kg',
            '   ⚠️ High margin requirement, very risky!',
            '3. Silver Mutual Funds:',
            '   → Search "Silver" on Coin',
          ]},
        ],
      },
      {
        heading: '⚡ Other Commodities — Copper, Uranium, Agriculture',
        content: null,
        commodityList: [
          { name: 'Copper', etf: 'CPER (US Copper Index)', use: 'Electronics, EVs, wiring', risk: 'Medium', howToBuy: 'Moomoo: Search "CPER"' },
          { name: 'Uranium', etf: 'URA (Global X Uranium ETF)', use: 'Nuclear power', risk: 'Very High', howToBuy: 'Moomoo: Search "URA"' },
          { name: 'Lithium', etf: 'LIT (Global X Lithium ETF)', use: 'EV batteries', risk: 'High', howToBuy: 'Moomoo: Search "LIT"' },
          { name: 'Agriculture', etf: 'DBA (Invesco Agriculture)', use: 'Wheat, corn, soybeans', risk: 'Medium', howToBuy: 'Moomoo: Search "DBA"' },
          { name: 'Platinum', etf: 'PPLT (Aberdeen Platinum)', use: 'Jewelry, catalysts', risk: 'Medium-High', howToBuy: 'Moomoo: Search "PPLT"' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     5. CRYPTO
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'crypto',
    icon: '₿',
    title: 'Crypto — Complete Investment Guide',
    subtitle: 'How to buy Bitcoin, Ethereum, and other crypto safely',
    color: '#ff8c42',
    sections: [
      {
        heading: '🤔 What You Need to Start',
        content: null,
        cards: [
          { title: '🇸🇬 Singapore Crypto Setup', items: [
            '1. Choose a regulated exchange:',
            '   → Coinbase (global, beginner-friendly)',
            '   → Binance SG (local, low fees)',
            '   → Crypto.com (SG regulated)',
            '   → SGX Bitcoin ETF (if available via Moomoo)',
            '2. KYC Requirements:',
            '   → Passport or Singapore IC',
            '   → Proof of address',
            '   → Bank account verification',
            '3. Funding:',
            '   → Bank transfer (FAST/PayNow)',
            '   → Credit/Debit card (higher fees)',
            '4. Tax: NO capital gains tax in Singapore!',
          ]},
          { title: '🇮🇳 India Crypto Setup', items: [
            '1. Choose a regulated exchange:',
            '   → WazirX (most popular, owned by Binance)',
            '   → CoinDCX (Indian, insured)',
            '   → Giottus (low fees)',
            '   → Unocoin (oldest Indian exchange)',
            '2. KYC Requirements:',
            '   → PAN card (mandatory)',
            '   → Aadhaar card',
            '   → Selfie verification',
            '3. Funding:',
            '   → UPI transfer (instant)',
            '   → Bank transfer (NEFT/RTGS)',
            '4. Tax: 30% tax on crypto gains + 1% TDS!',
            '   ⚠️ India has STRICT crypto taxes!',
          ]},
        ],
      },
      {
        heading: '🟢 How to BUY Crypto — Step by Step',
        content: null,
        steps: [
          'Step 1: Download exchange app (Coinbase/WazirX)',
          'Step 2: Create account and complete KYC (1-2 days)',
          'Step 3: Link bank account or UPI',
          'Step 4: Deposit funds',
          'Step 5: Search for crypto (BTC, ETH, SOL)',
          'Step 6: Tap "Buy" → Enter amount in your currency',
          'Step 7: Confirm → Crypto appears in your wallet',
          '',
          '💡 BEGINNER STRATEGY: Buy only BTC (60%) + ETH (40%) and hold for 1+ years.',
          '⚠️ WARNING: Crypto can lose 50-80% in bear markets. Only invest money you can afford to lose!',
        ],
      },
      {
        heading: '📊 Major Crypto Prices & Stats',
        content: null,
        cryptoData: [
          { name: 'Bitcoin (BTC)', price: '$110,000+', yearHigh: '$124,000+', yearLow: '$54,000', marketCap: '$2.1T', risk: 'High', buyPercent: '60% of crypto portfolio' },
          { name: 'Ethereum (ETH)', price: '$4,400+', yearHigh: '$4,900+', yearLow: '$1,800', marketCap: '$530B', risk: 'High', buyPercent: '30% of crypto portfolio' },
          { name: 'Solana (SOL)', price: '$210+', yearHigh: '$290+', yearLow: '$80', marketCap: '$100B', risk: 'Very High', buyPercent: '5% of crypto portfolio' },
          { name: 'XRP (Ripple)', price: '$3.00+', yearHigh: '$3.80+', yearLow: '$0.50', marketCap: '$170B', risk: 'Very High', buyPercent: '5% of crypto portfolio' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     6. FOREX
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'forex',
    icon: '💱',
    title: 'Forex — Complete Investment Guide',
    subtitle: 'Currency trading explained with SG and India specific tips',
    color: '#ff6b9d',
    sections: [
      {
        heading: '🤔 Forex Investing for Normal People',
        content: 'You don\'t need to "trade forex" to benefit from currencies. Here are the SMART ways:',
        cards: [
          { title: '✅ Smart Forex Strategies', items: [
            '1. Currency Diversification (via ETFs):',
            '   → Buy global ETFs (VWRA) — automatically diversifies currencies',
            '   → No need to manually trade forex',
            '2. Hold Multiple Currencies:',
            '   → Keep some savings in USD, SGD, INR',
            '   → Moomoo allows multi-currency account',
            '3. Forex ETFs (for advanced):',
            '   → UUP (US Dollar Index)',
            '   → FXE (Euro ETF)',
            '   → FXY (Japanese Yen ETF)',
            '⚠️ WARNING: 95% of retail forex traders LOSE money!',
          ]},
          { title: '🇸🇬 Currency Tips for SG Investors', items: [
            '• SGD/USD exchange rate affects your US stock returns',
            '• When USD strengthens vs SGD → your US stocks worth more in SGD',
            '• When USD weakens → your US stocks worth less in SGD',
            '• Moomoo allows you to hold USD in your account',
            '• Wise/Revolut can get better exchange rates than banks',
            '• TIP: Convert SGD to USD when rate is favorable (e.g., 1.25+)',
          ]},
          { title: '🇮🇳 Currency Tips for India', items: [
            '• INR has been depreciating vs USD (~3-5% per year)',
            '• This means US stocks give EXTRA returns in INR terms!',
            '• Example: S&P 500 returns 15% in USD + 4% currency gain = 19% in INR',
            '• Zerodha allows USD investments via international MFs',
            '• RBI LRS limit: $250,000/year for overseas investments',
          ]},
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     7. INDICES & FUTURES
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'indices',
    icon: '📊',
    title: 'Indices & Futures — Complete Investment Guide',
    subtitle: 'How to invest in market indices and understand futures contracts',
    color: '#2ee6a8',
    sections: [
      {
        heading: '📏 Major Global Indices — How to Invest',
        content: 'You CAN\'T buy an index directly. But you can buy ETFs that TRACK the index. This is the best way!',
        stockData: [
          { region: '🌍 Index ETFs to Buy', stocks: [
            { name: 'S&P 500 → CSPX/VOO/SPY', yearHigh: 'All-time high', yearLow: 'March 2020 low', sector: 'US Top 500', rating: 'Best first investment!', dividendYield: '1.3%', marketCap: 'Tracks $50T' },
            { name: 'Nasdaq 100 → QQQ/NDX', yearHigh: 'All-time high', yearLow: 'March 2020 low', sector: 'US Tech 100', rating: 'Higher growth, higher risk', dividendYield: '0.6%', marketCap: 'Tracks $25T' },
            { name: 'STI → ES3 ETF', yearHigh: '3,500+', yearLow: '2,200+', sector: 'SG Top 30', rating: 'SG local exposure', dividendYield: '3.5%', marketCap: 'SGX market' },
            { name: 'Nifty 50 → NIFTYBEES', yearHigh: '26,000+', yearLow: '15,700+', sector: 'India Top 50', rating: 'India growth story', dividendYield: '1.2%', marketCap: 'NSE market' },
            { name: 'Hang Seng → 2800.HK', yearHigh: '23,000+', yearLow: '14,000+', sector: 'HK Top 50', rating: 'China exposure', dividendYield: '3.5%', marketCap: 'HKEX market' },
            { name: 'Nikkei 225 → EWJ', yearHigh: '42,000+', yearLow: '24,000+', sector: 'Japan Top 225', rating: 'Japan recovery play', dividendYield: '2.0%', marketCap: 'TSE market' },
            { name: 'FTSE 100 → EWU', yearHigh: '8,400+', yearLow: '6,400+', sector: 'UK Top 100', rating: 'UK/GBP exposure', dividendYield: '3.8%', marketCap: 'LSE market' },
            { name: 'DAX → EWG', yearHigh: '20,000+', yearLow: '11,800+', sector: 'Germany Top 40', rating: 'European exposure', dividendYield: '2.8%', marketCap: 'XETRA market' },
          ]},
        ],
        steps: [
          'HOW TO INVEST IN INDICES:',
          'Step 1: Open your broker (Moomoo or Kite)',
          'Step 2: Search the ETF ticker (e.g., "CSPX", "QQQ", "NIFTYBEES")',
          'Step 3: Buy like a regular stock',
          'Step 4: Hold for 5+ years for best returns',
          'Step 5: Set up auto-invest (SIP) for regular investing',
          '',
          '💰 RECOMMENDED PORTFOLIO FOR BEGINNERS:',
          '• 60% CSPX (S&P 500)',
          '• 20% VWRA (Global)',
          '• 10% QQQ (Tech)',
          '• 10% AGG (Bonds)',
          '• Rebalance once a year',
        ],
      },
      {
        heading: '🔮 Futures — What They Are (Advanced)',
        content: '⚠️ Futures are VERY RISKY. They use leverage (borrowed money) and you can LOSE MORE than you invest. Only for experienced traders.',
        futuresData: [
          { name: 'ES (S&P 500 E-mini)', exchange: 'CME', margin: '~$13,000', multiplier: '$50 × Index', risk: 'Very High' },
          { name: 'NQ (Nasdaq E-mini)', exchange: 'CME', margin: '~$16,000', multiplier: '$20 × Index', risk: 'Very High' },
          { name: 'CL (Crude Oil)', exchange: 'NYMEX', margin: '~$6,000', multiplier: '1,000 barrels', risk: 'Very High' },
          { name: 'GC (Gold)', exchange: 'COMEX', margin: '~$10,000', multiplier: '100 oz', risk: 'High' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     8. OPTIONS
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'options',
    icon: '🎯',
    title: 'Options — Complete Investment Guide',
    subtitle: 'Understanding options trading — calls, puts, and strategies',
    color: '#ffd24a',
    sections: [
      {
        heading: '🤔 Options Explained Simply',
        content: null,
        cards: [
          { title: '📦 Call Option (Bullish)', items: [
            '• Right to BUY a stock at a set price (strike price)',
            '• You profit if the stock goes UP above the strike',
            '• Example: Buy NVDA $220 Call for $5/share',
            '  → If NVDA hits $250, your call is worth $30+',
            '  → Profit: ($30 - $5) × 100 shares = $2,500!',
            '  → If NVDA stays below $220, you lose the $5 premium',
          ]},
          { title: '📦 Put Option (Bearish)', items: [
            '• Right to SELL a stock at a set price (strike price)',
            '• You profit if the stock goes DOWN below the strike',
            '• Example: Buy AAPL $310 Put for $8/share',
            '  → If AAPL drops to $280, your put is worth $30+',
            '  → Profit: ($30 - $8) × 100 shares = $2,200!',
            '  → If AAPL stays above $310, you lose the $8 premium',
          ]},
          { title: '⚠️ Options Risks', items: [
            '• You can lose 100% of your premium (the cost of the option)',
            '• Options expire — you MUST sell before expiry or they become worthless',
            '• Not available on all brokers in SG/India',
            '• Moomoo: Options available for US stocks (need approval)',
            '• Zerodha Kite: Does NOT support options on stocks (only on Nifty/BankNifty via Sensibull)',
            '• Only risk money you can afford to lose completely!',
          ]},
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     9. BROKER APPS — Complete Setup
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'apps',
    icon: '📱',
    title: 'Broker Apps — Complete Setup & Usage Guide',
    subtitle: 'Step-by-step setup for Moomoo (SG) and Zerodha Kite (India)',
    color: '#b388ff',
    sections: [
      {
        heading: '🟠 Moomoo Singapore — Complete Setup',
        content: null,
        brokers: {
          moomoo: [
            '📱 DOWNLOAD & INSTALL:',
            'Step 1: Download "Moomoo" from App Store / Google Play',
            'Step 2: Open app → Tap "Sign Up"',
            'Step 3: Enter phone number → Verify with OTP',
            'Step 4: Set password → Done with basic registration!',
            '',
            '🪪 KYC VERIFICATION:',
            'Step 5: Tap "Me" → "Account" → "Complete Verification"',
            'Step 6: Select account type: "Cash Account" (for beginners)',
            'Step 7: Upload passport or Singapore IC (front + back)',
            'Step 8: Upload proof of address (utility bill, bank statement)',
            'Step 9: Complete selfie verification',
            'Step 10: Wait 1-2 business days for approval',
            '',
            '💰 FUNDING YOUR ACCOUNT:',
            'Step 11: Tap "Deposit" or "Transfer"',
            'Step 12: Select "Bank Transfer" → Choose your bank (DBS/OCBC/UOB)',
            'Step 13: Transfer SGD (for SGX stocks) or USD (for US stocks)',
            'Step 14: Funds arrive in 1-2 business days',
            '',
            '📈 YOUR FIRST TRADE:',
            'Step 15: Tap "Markets" → Search "DBS" or "NVDA"',
            'Step 16: Tap "Buy" → Choose "Limit Order"',
            'Step 17: Enter price and quantity → Tap "Confirm"',
            'Step 18: Check "Orders" → "Filled" to see your trade!',
            '',
            '💡 PRO TIPS:',
            '• Enable "Paper Trading" first to practice with fake money',
            '• Set price alerts for stocks you\'re watching',
            '• Use the "Screener" to find stocks by criteria',
            '• Check "Portfolio" → "Analysis" for performance tracking',
          ],
          zerodha: [
            '📱 DOWNLOAD & INSTALL:',
            'Step 1: Download "Kite by Zerodha" from App Store / Google Play',
            'Step 2: Also download "Coin" for mutual funds',
            'Step 3: Go to zerodha.com → Click "Open Account"',
            '',
            '🪪 KYC & ACCOUNT SETUP:',
            'Step 4: Enter PAN number → Verify with Aadhaar OTP',
            'Step 5: Fill personal details (name, DOB, address)',
            'Step 6: Upload PAN card photo',
            'Step 7: Upload bank statement (last 6 months)',
            'Step 8: Complete e-sign with Aadhaar',
            'Step 9: Pay account opening fee: ₹200 (one-time)',
            'Step 10: Account activated in 24-48 hours!',
            '',
            '💰 FUNDING YOUR ACCOUNT:',
            'Step 11: Open Kite → Go to "Funds" tab',
            'Step 12: Tap "Add Funds"',
            'Step 13: Enter amount → Select UPI or Net Banking',
            'Step 14: Complete payment → Funds available instantly!',
            '',
            '📈 YOUR FIRST TRADE:',
            'Step 15: Open Kite → Tap search icon → Type "RELIANCE"',
            'Step 16: Tap on "RELIANCE" → See chart and info',
            'Step 17: Tap "B" (Buy) button',
            'Step 18: Select "CNC" (delivery) for long-term holding',
            'Step 19: Enter quantity → Tap "Buy"',
            'Step 20: Check "Orders" → "Executed" → Shares in "Portfolio"!',
            '',
            '💡 PRO TIPS:',
            '• Use "GTT" orders to buy at your target price',
            '• Use "Sensibull" for options trading (separate app)',
            '• Use "Coin" app for SIP in mutual funds',
            '• Set up "Console" for tax reports and P&L',
            '• Kite Connect API for algo trading (paid)',
          ],
        },
      },
      {
        heading: '📊 What You Can Trade on Each Platform',
        content: null,
        platformComparison: [
          { feature: 'SG Stocks (SGX)', moomoo: '✅ Full access', zerodha: '❌ Not available' },
          { feature: 'US Stocks (NYSE/NASDAQ)', moomoo: '✅ Full access', zerodha: '❌ Use international MFs' },
          { feature: 'HK Stocks (HKEX)', moomoo: '✅ Full access', zerodha: '❌ Not available' },
          { feature: 'India Stocks (NSE/BSE)', moomoo: '❌ Not available', zerodha: '✅ Full access' },
          { feature: 'India Mutual Funds', moomoo: '❌ Not available', zerodha: '✅ via Coin app' },
          { feature: 'ETFs (Global)', moomoo: '✅ 100+ ETFs', zerodha: '✅ Indian ETFs + MFs' },
          { feature: 'Options', moomoo: '✅ US options', zerodha: '✅ Index options only' },
          { feature: 'Futures', moomoo: '✅ US futures', zerodha: '✅ MCX commodities' },
          { feature: 'Crypto', moomoo: '❌ Not available', zerodha: '❌ Not available' },
          { feature: 'Commodities', moomoo: '✅ via ETFs', zerodha: '✅ MCX direct' },
          { feature: 'Fractional Shares', moomoo: '✅ US stocks', zerodha: '❌ Not available' },
          { feature: 'Paper Trading', moomoo: '✅ Built-in', zerodha: '❌ Use Sensibull' },
          { feature: 'Brokerage Fee', moomoo: 'S$0 (promo)', zerodha: '0.03% or ₹20' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     10. 6-MONTH INVESTMENT PLAN
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'sixmonth',
    icon: '🗓️',
    title: '6-Month Buy/Sell Plan — Your Action Schedule',
    subtitle: 'Month-by-month plan for building your portfolio from scratch',
    color: '#2ee6a8',
    sections: [
      {
        heading: '🗓️ Your 6-Month Investment Roadmap',
        content: null,
        plan: [
          { month: 'Month 1: Setup & Foundation', tasks: [
            '✅ Open Moomoo account (SG) + Zerodha Kite (India)',
            '✅ Complete KYC on both platforms',
            '✅ Fund accounts with initial capital',
            '✅ Buy your first ETF: CSPX or VOO (S&P 500)',
            '✅ Start with 30% of your total investment budget',
            '✅ Read this guide 3 times to understand all options',
          ]},
          { month: 'Month 2: Diversify', tasks: [
            '✅ Buy VWRA (global ETF) — 20% of budget',
            '✅ Buy 1-2 dividend stocks (DBS for SG, ITC for India)',
            '✅ Buy GLD or GOLDBEES for gold exposure — 10% of budget',
            '✅ Set up auto-invest (SIP) for monthly contributions',
            '✅ Track your portfolio weekly',
          ]},
          { month: 'Month 3: Sector Allocation', tasks: [
            '✅ Add QQQ (tech) — 15% of budget',
            '✅ Add 2-3 individual stocks from different sectors',
            '✅ Consider adding bonds (AGG or BND) — 10% of budget',
            '✅ Review and rebalance if any position > 25%',
            '✅ Learn about stop-loss orders',
          ]},
          { month: 'Month 4: International Exposure', tasks: [
            '✅ Add HK stocks if interested (Tencent, BYD)',
            '✅ Consider Japan ETF (EWJ) or Korea ETF (EWY)',
            '✅ Add commodity exposure (USO for oil, SLV for silver)',
            '✅ Review your risk tolerance',
            '✅ Start learning about options (paper trade first)',
          ]},
          { month: 'Month 5: Optimization', tasks: [
            '✅ Tax-loss harvesting (sell losing positions for tax benefits)',
            '✅ Rebalance portfolio to target allocation',
            '✅ Add to positions that are underweight',
            '✅ Consider adding REITs (VNQ or SG REITs)',
            '✅ Set up price alerts for key levels',
          ]},
          { month: 'Month 6: Review & Scale', tasks: [
            '✅ Full portfolio review — compare vs benchmarks',
            '✅ Calculate total returns and fees paid',
            '✅ Increase monthly SIP amount if possible',
            '✅ Plan for the next 6 months',
            '✅ Share knowledge with friends/family!',
          ]},
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     11. STRATEGIES
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'strategies',
    icon: '🎯',
    title: 'Investment Strategies — Proven Methods That Work',
    subtitle: 'From beginner to advanced — pick the strategy that suits you',
    color: '#ffd24a',
    sections: [
      {
        heading: '🎯 Investment Strategies by Experience Level',
        content: null,
        cards: [
          { title: '🟢 Beginner Strategy (1-2 years)', items: [
            '• 80% Index ETFs (CSPX + VWRA)',
            '• 10% Bond ETF (AGG)',
            '• 10% Gold ETF (GLD)',
            '• Invest fixed amount monthly (SIP/DCA)',
            '• Never check portfolio more than once a week',
            '• Expected return: 8-12% per year',
            '• Risk: Low-Medium',
          ]},
          { title: '🟡 Intermediate Strategy (2-5 years)', items: [
            '• 50% Index ETFs (CSPX + VWRA)',
            '• 20% Individual stocks (5-8 picks)',
            '• 10% Bonds (AGG + TLT)',
            '• 10% Gold/Silver (GLD + SLV)',
            '• 5% REITs (VNQ)',
            '• 5% Speculative (high-growth stocks)',
            '• Rebalance quarterly',
            '• Expected return: 10-15% per year',
          ]},
          { title: '🔴 Advanced Strategy (5+ years)', items: [
            '• 40% Index ETFs',
            '• 25% Individual stocks (10-15 picks)',
            '• 10% International (HK, Japan, India)',
            '• 10% Alternatives (Gold, Oil, Crypto)',
            '• 10% Options strategies (covered calls)',
            '• 5% Speculative/venture',
            '• Use options for income generation',
            '• Expected return: 12-20% per year',
          ]},
        ],
      },
      {
        heading: '📈 Dollar-Cost Averaging (DCA) — The Best Strategy',
        content: null,
        steps: [
          'DCA = Invest the SAME amount every month, regardless of market price.',
          '',
          'WHY IT WORKS:',
          '• When prices are HIGH → your fixed amount buys FEWER shares',
          '• When prices are LOW → your fixed amount buys MORE shares',
          '• Over time, your average cost per share is LOW and SMOOTH',
          '',
          'HOW TO DO IT:',
          '1. Set up automatic bank transfer to your broker every month',
          '2. Buy the same ETF(s) every month on the same date',
          '3. Never skip a month, even when market is down (especially then!)',
          '4. Review after 12 months and increase amount if salary increased',
          '',
          'EXAMPLE:',
          '• Monthly investment: S$500 into CSPX',
          '• Month 1: CSPX = S$80 → Buy 6.25 shares',
          '• Month 2: CSPX = S$75 → Buy 6.67 shares',
          '• Month 3: CSPX = S$85 → Buy 5.88 shares',
          '• Month 4: CSPX = S$70 → Buy 7.14 shares',
          '• Total: 25.94 shares at avg cost S$77.35',
          '• Current price S$80 → You\'re UP S$69!',
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     12. COUNTRY MARKETS
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'countries',
    icon: '🌍',
    title: 'Country Markets — How to Invest in Each Country',
    subtitle: 'Complete guide to investing in SG, India, US, HK, Japan, Korea, UK, Australia, Europe',
    color: '#4da6ff',
    sections: [
      {
        heading: '🌍 How to Invest in Every Major Market',
        content: null,
        countryGuides: [
          { country: '🇸🇬 Singapore', broker: 'Moomoo SG', market: 'SGX', hours: '9am-5pm SGT', howToInvest: [
            '1. Buy SGX stocks directly on Moomoo (DBS, Singtel, REITs)',
            '2. Buy SGX ETFs: ES3 (STI), Lion-OCBC China Leaders',
            '3. Buy SG Savings Bonds via DBS/OCBC/UOB ATM',
            '4. Buy SG REITs for 5-7% dividend yields',
            '5. CPF-OA can buy approved ETFs (ES3)',
            'Min investment: 1 share (as low as S$0.50 for some)',
            'Currency: SGD — no forex risk for SG investors',
          ]},
          { country: '🇮🇳 India', broker: 'Zerodha Kite', market: 'NSE/BSE', hours: '9:15am-3:30pm IST', howToInvest: [
            '1. Buy NSE/BSE stocks directly on Kite (RELIANCE, TCS, HDFC)',
            '2. Buy Indian ETFs: NIFTYBEES, GOLDBEES, BANKBEES',
            '3. Buy mutual funds via Coin app (SIP from ₹100)',
            '4. Buy G-Sec via RBI Retail Direct',
            '5. Buy MCX commodities (Gold, Silver, Crude)',
            '6. IPOs via Kite (apply using UPI)',
            'Min investment: 1 share or ₹100 SIP',
            'Currency: INR',
          ]},
          { country: '🇺🇸 United States', broker: 'Moomoo SG', market: 'NYSE/NASDAQ', hours: '9:30pm-4am SGT', howToInvest: [
            '1. Buy US stocks directly on Moomoo (NVDA, AAPL, TSLA)',
            '2. Buy US ETFs: VOO, QQQ, SCHD, GLD',
            '3. Fractional shares available — buy with as little as US$1',
            '4. US dividend stocks for passive income',
            '5. US bond ETFs (AGG, BND, TLT)',
            'Currency: USD — convert SGD to USD via Moomoo or Wise',
            'Tax: 15% withholding on dividends (no capital gains tax for SG)',
          ]},
          { country: '🇭🇰 Hong Kong', broker: 'Moomoo SG', market: 'HKEX', hours: '9:30am-4pm HKT', howToInvest: [
            '1. Buy HK stocks on Moomoo (Tencent, Alibaba, BYD)',
            '2. Buy Tracker Fund (2800.HK) for Hang Seng exposure',
            '3. Buy Hang Seng TECH ETF (3032.HK) for tech',
            '4. HK stocks trade in HKD',
            'Currency: HKD (pegged to USD at 7.8)',
          ]},
          { country: '🇯🇵 Japan', broker: 'Moomoo SG', market: 'TSE', hours: '8am-2pm JST', howToInvest: [
            '1. Buy Japan ETFs on Moomoo: EWJ (MSCI Japan)',
            '2. Buy individual TSE stocks (Toyota, Sony)',
            '3. Japan small-cap ETF: SCJ',
            'Currency: JPY',
          ]},
          { country: '🇰🇷 South Korea', broker: 'Moomoo SG', market: 'KOSPI', hours: '9am-3:30pm KST', howToInvest: [
            '1. Buy Korea ETF: EWY (MSCI Korea)',
            '2. Individual stocks: Samsung (005930.KS), SK Hynix',
            'Currency: KRW',
          ]},
          { country: '🇬🇧 United Kingdom', broker: 'Moomoo SG', market: 'LSE', hours: '4pm-11:30pm GMT', howToInvest: [
            '1. Buy UK ETFs: EWU (MSCI UK)',
            '2. London-listed ETFs: CSPX.L, VWRA.L (tax-efficient for SG!)',
            '3. Individual UK stocks: Shell, AstraZeneca',
            'Currency: GBP',
          ]},
          { country: '🇦🇺 Australia', broker: 'Moomoo SG', market: 'ASX', hours: '8am-4pm AEST', howToInvest: [
            '1. Buy ASX stocks: BHP, CBA, CSL',
            '2. Buy ASX ETFs: STW (S&P/ASX 200)',
            '3. ASX is available on Moomoo',
            'Currency: AUD',
          ]},
          { country: '🇪🇺 Europe', broker: 'Moomoo SG', market: 'XETRA/Euronext', hours: 'Varies', howToInvest: [
            '1. Buy Europe ETF: VGK (Vanguard FTSE Europe)',
            '2. Buy Germany ETF: EWG (MSCI Germany)',
            '3. Individual: ASML (ASML.AS), LVMH (MC.PA)',
            'Currency: EUR',
          ]},
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     13. RANKINGS & FUND HOUSES
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'rankings',
    icon: '🏆',
    title: 'Rankings & Fund Houses — Top Fund Managers',
    subtitle: 'Best fund houses, ETF providers, and their top products',
    color: '#ff6b9d',
    sections: [
      {
        heading: '🏆 Top ETF/Fund Providers Ranked',
        content: null,
        fundHouses: [
          { rank: 1, name: 'Vanguard', country: '🇺🇸 US', aum: '$8.5T', topETFs: 'VOO, VWRA, VTI, VNQ, VYM', fee: '0.03-0.22%', why: 'Lowest fees, best for long-term' },
          { rank: 2, name: 'BlackRock (iShares)', country: '🇺🇸 US', aum: '$10T+', topETFs: 'CSPX, AGG, GLD, EWJ, EWY', fee: '0.03-0.50%', why: 'Most ETFs available, huge liquidity' },
          { rank: 3, name: 'State Street (SPDR)', country: '🇺🇸 US', aum: '$4T+', topETFs: 'SPY, GLD, XLE, MDY', fee: '0.03-0.40%', why: 'SPY = most traded ETF in world' },
          { rank: 4, name: 'Nippon AM', country: '🇮🇳 India', aum: '₹5T+', topETFs: 'NIFTYBEES, JUNIORBEES, GOLDBEES', fee: '0.05-0.50%', why: 'Largest Indian ETF provider' },
          { rank: 5, name: 'HDFC AMC', country: '🇮🇳 India', aum: '₹7T+', topETFs: 'HDFC Nifty 50, HDFC Gold', fee: '0.10-1.0%', why: 'Best Indian mutual fund house' },
          { rank: 6, name: 'Lion Global', country: '🇸🇬 SG', aum: 'S$50B+', topETFs: 'STI ETF, Lion-OCBC Gold', fee: '0.30-0.50%', why: 'Main SG ETF provider' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     14. ADVANCED TOPICS
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'advanced',
    icon: '⚡',
    title: 'Advanced Topics — Beyond the Basics',
    subtitle: 'Tax optimization, portfolio theory, margin trading, and more',
    color: '#b388ff',
    sections: [
      {
        heading: '⚡ Advanced Investment Concepts',
        content: null,
        cards: [
          { title: '📊 Portfolio Theory', items: [
            '• Don\'t put all eggs in one basket (diversification)',
            '• Asset allocation determines 90% of your returns',
            '• Correlation: Assets that move differently = better diversification',
            '• Rebalancing: Sell winners, buy losers to maintain target allocation',
            '• Sharpe Ratio: Return per unit of risk (higher = better)',
          ]},
          { title: '💰 Tax Optimization', items: [
            '• SG: No capital gains tax — trade freely!',
            '• India: 10% LTCG tax above ₹1L, 15% STCG for <1 year',
            '• India: 30% crypto tax + 1% TDS',
            '• SG investors: Use London-listed ETFs (CSPX.L) for 15% dividend tax vs 30%',
            '• Tax-loss harvesting: Sell losses to offset gains',
            '• Keep records of all trades for tax filing',
          ]},
          { title: '⚠️ Margin Trading & Leverage', items: [
            '• Margin = borrowing money from broker to trade',
            '• Moomoo: Up to 2x leverage (margin account)',
            '• Zerodha: Up to 5x intraday (MIS)',
            '• Amplifies both gains AND losses',
            '• Risk of margin call: Forced to sell if losses too high',
            '• ONLY for experienced traders with risk management',
            '• NEVER use margin for long-term investing',
          ]},
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     15. MUTUAL FUNDS
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'mutual',
    icon: '🤝',
    title: 'Mutual Funds — Complete Investment Guide',
    subtitle: 'How to invest in mutual funds via Zerodha Coin and Moomoo',
    color: '#35e0ff',
    sections: [
      {
        heading: '🤝 How to Invest in Mutual Funds',
        content: null,
        cards: [
          { title: '🇮🇳 Zerodha Coin (India MFs)', items: [
            'Step 1: Download "Coin by Zerodha" app',
            'Step 2: Login with Kite credentials',
            'Step 3: Browse or search funds',
            'Step 4: Choose "SIP" (monthly) or "Lumpsum" (one-time)',
            'Step 5: Enter amount (min ₹100 for SIP)',
            'Step 6: Select date for auto-debit',
            'Step 7: Set up SIP mandate via UPI',
            'Step 8: Auto-debit every month → Units allocated!',
            '',
            '🏆 TOP INDIAN MFs:',
            '• Mirae Asset Large Cap — Best large-cap fund',
            '• Parag Parikh Flexi Cap — Best flexi-cap (international exposure)',
            '• HDFC Mid-Cap Opportunities — Best mid-cap',
            '• Axis Bluechip — Best blue-chip fund',
            '• UTI Nifty Index Fund — Best index fund (lowest cost)',
            '• SBI Gold Fund — Best gold fund',
          ]},
          { title: '🇸🇬 Mutual Funds on Moomoo', items: [
            'Moomoo primarily offers ETFs (not traditional mutual funds).',
            'For SG investors, ETFs are generally BETTER than mutual funds:',
            '• Lower fees (0.03-0.30% vs 1-2%)',
            '• More transparent',
            '• Can trade anytime',
            '',
            '🏆 SG ETFs as "Mutual Fund" Alternative:',
            '• CSPX/L — Like investing in US index fund',
            '• VWRA.L — Like a global balanced fund',
            '• ES3 — Like a SG equity fund',
            '• GLD — Like a gold fund',
          ]},
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     16. COUNTRY FUNDS & BONDS
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'countryfunds',
    icon: '🏦',
    title: 'Country Funds & Bonds — Complete Guide',
    subtitle: 'Government bonds and funds available in each country',
    color: '#ff8c42',
    sections: [
      {
        heading: '🏦 Country-by-Country Bond & Fund Options',
        content: null,
        countryFunds: [
          { country: '🇸🇬 Singapore', products: [
            { name: 'Singapore Savings Bonds (SSB)', yield: '~3.0%', risk: 'Zero', howToBuy: 'DBS/OCBC/UOB ATM or internet banking', min: 'S$500' },
            { name: 'SG T-Bills (6-month)', yield: '~3.2%', risk: 'Zero', howToBuy: 'MAS website or banks', min: 'S$1,000' },
            { name: 'SGS Bonds (10-year)', yield: '~3.0%', risk: 'Zero', howToBuy: 'MAS website', min: 'S$1,000' },
            { name: 'STI ETF (ES3)', yield: '~3.5% div', risk: 'Medium', howToBuy: 'Moomoo or SGX brokers', min: '1 share (~S$3)' },
          ]},
          { country: '🇮🇳 India', products: [
            { name: 'G-Sec (Government Securities)', yield: '~7.0%', risk: 'Zero', howToBuy: 'RBI Retail Direct', min: '₹10,000' },
            { name: 'Sovereign Gold Bond (SGB)', yield: '2.5% + gold', risk: 'Zero', howToBuy: 'RBI or Zerodha Coin', min: '₹1,000 (1 gram)' },
            { name: 'T-Bills', yield: '~6.5-7%', risk: 'Zero', howToBuy: 'RBI Retail Direct', min: '₹10,000' },
            { name: 'NPS (National Pension)', yield: '~9-10%', risk: 'Low', howToBuy: 'Zerodha Kite', min: '₹1,000/month' },
            { name: 'Nifty 50 Index Fund', yield: '~12-15%', risk: 'Medium', howToBuy: 'Coin by Zerodha', min: '₹100 SIP' },
          ]},
          { country: '🇺🇸 United States', products: [
            { name: 'US Treasury Bonds', yield: '~4.2%', risk: 'Very Low', howToBuy: 'Moomoo or TreasuryDirect.gov', min: 'US$1,000' },
            { name: 'I-Bonds (Inflation)', yield: '~4.2%', risk: 'Zero', howToBuy: 'TreasuryDirect.gov', min: 'US$25' },
            { name: 'BND ETF (Total Bond)', yield: '~4.5%', risk: 'Low', howToBuy: 'Moomoo', min: '1 share (~US$72)' },
            { name: 'VOO ETF (S&P 500)', yield: '~1.3% div', risk: 'Medium', howToBuy: 'Moomoo', min: '1 share (~US$530)' },
          ]},
          { country: '🇭🇰 Hong Kong', products: [
            { name: 'iBonds', yield: '~4-5%', risk: 'Zero', howToBuy: 'HSBC/StanChart', min: 'HK$10,000' },
            { name: 'Silver Bonds', yield: '~4%', risk: 'Zero', howToBuy: 'Banks', min: 'HK$10,000' },
            { name: 'Tracker Fund (2800.HK)', yield: '~3.5% div', risk: 'Medium', howToBuy: 'Moomoo', min: '1 share (~HK$28)' },
            { name: 'Hang Seng TECH (3032.HK)', yield: '~0.5%', risk: 'High', howToBuy: 'Moomoo', min: '1 share' },
          ]},
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════════
     17. GLOBAL ETF DIRECTORY
     ═══════════════════════════════════════════════════════════════════════ */
  {
    id: 'etfdirectory',
    icon: '📚',
    title: 'Global ETF Directory — Complete Reference',
    subtitle: 'Every major ETF organized by category with fees, returns, and how to buy',
    color: '#ffd24a',
    sections: [
      {
        heading: '📚 Complete ETF Reference Guide',
        content: 'How to use this directory: Find your goal → Pick the ETF → Buy on Moomoo/Kite → Hold for 5+ years',
        etfDirectory: [
          { category: '🏆 Beginner Starters Pack', etfs: [
            { name: 'CSPX', full: 'iShares S&P 500 (LSE)', fee: '0.07%', return5y: '+85%', buy: 'Moomoo → Search CSPX.L', risk: 'Medium' },
            { name: 'VWRA', full: 'Vanguard All-World (LSE)', fee: '0.22%', return5y: '+60%', buy: 'Moomoo → Search VWRA.L', risk: 'Medium' },
            { name: 'VOO', full: 'Vanguard S&P 500 (NYSE)', fee: '0.03%', return5y: '+85%', buy: 'Moomoo → Search VOO', risk: 'Medium' },
          ]},
          { category: '🇺🇸 US Market', etfs: [
            { name: 'QQQ', full: 'Invesco Nasdaq 100', fee: '0.20%', return5y: '+120%', buy: 'Moomoo → QQQ', risk: 'Higher' },
            { name: 'SPY', full: 'SPDR S&P 500', fee: '0.09%', return5y: '+85%', buy: 'Moomoo → SPY', risk: 'Medium' },
            { name: 'VTI', full: 'Vanguard Total US Market', fee: '0.03%', return5y: '+80%', buy: 'Moomoo → VTI', risk: 'Medium' },
            { name: 'IWM', full: 'iShares Russell 2000 (Small Cap)', fee: '0.19%', return5y: '+35%', buy: 'Moomoo → IWM', risk: 'Higher' },
          ]},
          { category: '🌍 Global/International', etfs: [
            { name: 'VXUS', full: 'Vanguard Total International', fee: '0.07%', return5y: '+25%', buy: 'Moomoo → VXUS', risk: 'Medium' },
            { name: 'EWJ', full: 'iShares MSCI Japan', fee: '0.50%', return5y: '+30%', buy: 'Moomoo → EWJ', risk: 'Medium' },
            { name: 'EWY', full: 'iShares MSCI Korea', fee: '0.59%', return5y: '+20%', buy: 'Moomoo → EWY', risk: 'Higher' },
            { name: 'INDA', full: 'iShares MSCI India', fee: '0.64%', return5y: '+50%', buy: 'Moomoo → INDA', risk: 'Higher' },
            { name: 'MCHI', full: 'iShares MSCI China', fee: '0.59%', return5y: '-10%', buy: 'Moomoo → MCHI', risk: 'Very High' },
          ]},
          { category: '🪙 Commodities', etfs: [
            { name: 'GLD', full: 'SPDR Gold Shares', fee: '0.40%', return5y: '+55%', buy: 'Moomoo → GLD', risk: 'Medium' },
            { name: 'IAU', full: 'iShares Gold Trust', fee: '0.25%', return5y: '+55%', buy: 'Moomoo → IAU', risk: 'Medium' },
            { name: 'SLV', full: 'iShares Silver Trust', fee: '0.50%', return5y: '+30%', buy: 'Moomoo → SLV', risk: 'Higher' },
            { name: 'USO', full: 'United States Oil Fund', fee: '0.60%', return5y: '+40%', buy: 'Moomoo → USO', risk: 'High' },
            { name: 'PDBC', full: 'Invesco Optimum Yield Diversified', fee: '0.59%', return5y: '+35%', buy: 'Moomoo → PDBC', risk: 'Medium-High' },
          ]},
          { category: '📦 Bonds & Fixed Income', etfs: [
            { name: 'AGG', full: 'iShares US Aggregate Bond', fee: '0.03%', return5y: '-5%', buy: 'Moomoo → AGG', risk: 'Low' },
            { name: 'BND', full: 'Vanguard Total Bond Market', fee: '0.03%', return5y: '-4%', buy: 'Moomoo → BND', risk: 'Low' },
            { name: 'TLT', full: 'iShares 20+ Year Treasury', fee: '0.15%', return5y: '-30%', buy: 'Moomoo → TLT', risk: 'Medium' },
            { name: 'LQD', full: 'iShares Investment Grade Corporate', fee: '0.14%', return5y: '-5%', buy: 'Moomoo → LQD', risk: 'Low-Medium' },
            { name: 'HYG', full: 'iShares High Yield Corporate', fee: '0.49%', return5y: '+10%', buy: 'Moomoo → HYG', risk: 'Medium' },
          ]},
          { category: '💰 Dividend & Income', etfs: [
            { name: 'SCHD', full: 'Schwab US Dividend Equity', fee: '0.06%', return5y: '+45%', buy: 'Moomoo → SCHD', risk: 'Medium' },
            { name: 'VYM', full: 'Vanguard High Dividend Yield', fee: '0.06%', return5y: '+35%', buy: 'Moomoo → VYM', risk: 'Medium' },
            { name: 'DGRO', full: 'iShares Dividend Growth', fee: '0.08%', return5y: '+40%', buy: 'Moomoo → DGRO', risk: 'Medium' },
            { name: 'VIG', full: 'Vanguard Dividend Appreciation', fee: '0.06%', return5y: '+50%', buy: 'Moomoo → VIG', risk: 'Medium' },
          ]},
          { category: '🏠 REITs', etfs: [
            { name: 'VNQ', full: 'Vanguard Real Estate ETF', fee: '0.12%', return5y: '-5%', buy: 'Moomoo → VNQ', risk: 'Medium' },
            { name: 'SCHH', full: 'Schwab US REIT ETF', fee: '0.07%', return5y: '-3%', buy: 'Moomoo → SCHH', risk: 'Medium' },
            { name: 'IYR', full: 'iShares US Real Estate', fee: '0.39%', return5y: '-2%', buy: 'Moomoo → IYR', risk: 'Medium' },
          ]},
        ],
      },
    ],
  },
];


/* ═══════════════════════════════════════════════════════════════════════════
   RENDER COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function InfoCards({ cards }) {
  return (
    <div className="tp-grid-3">
      {cards.map((card, i) => (
        <div key={i} className="tp-concept-box">
          <h5>{card.title}</h5>
          <ul className="tp-list" style={{ marginTop: 8 }}>
            {card.items.map((item, j) => (
              <li key={j} style={{ fontSize: '0.82rem', lineHeight: '1.6', color: item.startsWith('   ') ? '#94a3b8' : '#cbd5e1' }}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function StepList({ steps }) {
  return (
    <div className="tp-example-box" style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '0.85rem' }}>
      {steps.join('\n')}
    </div>
  );
}

function BrokerSteps({ brokers }) {
  return (
    <div className="tp-grid-2">
      {brokers.moomoo && (
        <div className="tp-concept-box" style={{ borderLeft: '3px solid #ff8c42' }}>
          <h5>🟠 Moomoo Singapore</h5>
          <div style={{ marginTop: 8, fontSize: '0.82rem', lineHeight: '1.7', color: '#cbd5e1' }}>
            {brokers.moomoo.map((line, i) => (
              <div key={i} style={{ color: line.startsWith('💡') ? '#ffd24a' : line.startsWith('⚠️') ? '#ff6b6b' : line.startsWith('   ') ? '#94a3b8' : '#cbd5e1' }}>{line || <br />}</div>
            ))}
          </div>
        </div>
      )}
      {brokers.zerodha && (
        <div className="tp-concept-box" style={{ borderLeft: '3px solid #4da6ff' }}>
          <h5>🔵 Zerodha Kite India</h5>
          <div style={{ marginTop: 8, fontSize: '0.82rem', lineHeight: '1.7', color: '#cbd5e1' }}>
            {brokers.zerodha.map((line, i) => (
              <div key={i} style={{ color: line.startsWith('💡') ? '#ffd24a' : line.startsWith('⚠️') ? '#ff6b6b' : line.startsWith('   ') ? '#94a3b8' : '#cbd5e1' }}>{line || <br />}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StockDataTable({ stockData }) {
  return (
    <div>
      {stockData.map((region, ri) => (
        <div key={ri} className="tp-card" style={{ borderLeft: `4px solid ${['#4da6ff', '#ff6b9d', '#ff8c42', '#b388ff'][ri % 4]}`, marginBottom: 16 }}>
          <h3>{region.region}</h3>
          <div className="tp-table-wrap">
            <table>
              <thead>
                <tr><th>Stock</th><th>Price</th><th>52W High</th><th>52W Low</th><th>P/E</th><th>Market Cap</th><th>Div Yield</th><th>Sector</th><th>Rating</th></tr>
              </thead>
              <tbody>
                {region.stocks.map(s => (
                  <tr key={s.name}>
                    <td><strong>{s.name}</strong></td>
                    <td className="tp-ticker">{s.price}</td>
                    <td style={{ color: '#2ee6a8' }}>{s.yearHigh}</td>
                    <td style={{ color: '#ff6b6b' }}>{s.yearLow}</td>
                    <td>{s.pe}</td>
                    <td>{s.marketCap}</td>
                    <td>{s.dividendYield}</td>
                    <td className="tp-muted">{s.sector}</td>
                    <td><span className={`tp-badge ${s.rating.includes('Strong') ? 'tp-badge-green' : s.rating === 'Buy' ? 'tp-badge-blue' : 'tp-badge-gold'}`}>{s.rating}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function BondDataTable({ bondData }) {
  return (
    <div className="tp-card tp-card-blue" style={{ borderLeft: '4px solid #4da6ff' }}>
      <h3>📊 Bond Prices & Yields Reference</h3>
      <div className="tp-table-wrap">
        <table>
          <thead><tr><th>Bond/ETF</th><th>Current Yield</th><th>Price</th><th>Safety Rating</th><th>Maturity</th></tr></thead>
          <tbody>
            {bondData.map(b => (
              <tr key={b.name}>
                <td><strong>{b.name}</strong></td>
                <td style={{ color: '#2ee6a8', fontWeight: 700 }}>{b.yield}</td>
                <td>{b.price}</td>
                <td>{b.safety}</td>
                <td className="tp-muted">{b.maturity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ETFDataTable({ etfData }) {
  return (
    <div className="tp-card" style={{ borderLeft: '4px solid #2ee6a8' }}>
      <h3>📊 ETF Comparison Table</h3>
      <div className="tp-table-wrap">
        <table>
          <thead><tr><th>ETF</th><th>Ticker</th><th>Fee</th><th>1Y Return</th><th>5Y Return</th><th>Risk</th><th>Best For</th></tr></thead>
          <tbody>
            {etfData.map(e => (
              <tr key={e.ticker}>
                <td><strong>{e.name}</strong></td>
                <td className="tp-ticker">{e.ticker}</td>
                <td>{e.fee}</td>
                <td style={{ color: '#2ee6a8' }}>{e.return1y}</td>
                <td style={{ color: '#2ee6a8' }}>{e.return5y}</td>
                <td>{e.risk}</td>
                <td className="tp-example-cell">{e.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChecklistComponent({ checklist }) {
  return (
    <div className="tp-steps">
      {checklist.map((item, i) => (
        <div key={i} className="tp-step" style={{ borderLeftColor: ['#2ee6a8', '#4da6ff', '#b388ff', '#ff8c42', '#ffd24a', '#ff6b9d', '#35e0ff', '#b388ff'][i % 8] }}>
          <div className="tp-step-num">{i + 1}</div>
          <div>
            <h4>{item.step}</h4>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommodityList({ commodityList }) {
  return (
    <div className="tp-grid-3">
      {commodityList.map(c => (
        <div key={c.name} className="tp-concept-box">
          <h5>{c.name}</h5>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ETF: <span className="tp-ticker">{c.etf}</span></p>
          <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Used in: {c.use}</p>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Risk: {c.risk}</p>
          <p style={{ fontSize: '0.75rem', color: '#4da6ff', marginTop: 4 }}>{c.howToBuy}</p>
        </div>
      ))}
    </div>
  );
}

function CryptoDataTable({ cryptoData }) {
  return (
    <div className="tp-card tp-card-orange" style={{ borderLeft: '4px solid #ff8c42' }}>
      <h3>📊 Crypto Prices & Allocation Guide</h3>
      <div className="tp-table-wrap">
        <table>
          <thead><tr><th>Coin</th><th>Price</th><th>52W High</th><th>52W Low</th><th>Market Cap</th><th>Risk</th><th>Allocation</th></tr></thead>
          <tbody>
            {cryptoData.map(c => (
              <tr key={c.name}>
                <td><strong>{c.name}</strong></td>
                <td className="tp-ticker" style={{ color: '#ffd24a' }}>{c.price}</td>
                <td style={{ color: '#2ee6a8' }}>{c.yearHigh}</td>
                <td style={{ color: '#ff6b6b' }}>{c.yearLow}</td>
                <td>{c.marketCap}</td>
                <td>{c.risk}</td>
                <td><span className="tp-badge tp-badge-green">{c.buyPercent}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FuturesTable({ futuresData }) {
  return (
    <div className="tp-card tp-card-red" style={{ borderLeft: '4px solid #ff6b6b', marginTop: 16 }}>
      <h3>⚠️ Futures Contracts Reference</h3>
      <div className="tp-alert tp-alert-danger" style={{ marginBottom: 12 }}>
        🔴 <strong>WARNING:</strong> Futures use leverage. You can lose MORE than your initial investment. Only for experienced traders!
      </div>
      <div className="tp-table-wrap">
        <table>
          <thead><tr><th>Contract</th><th>Exchange</th><th>Margin Required</th><th>Multiplier</th><th>Risk</th></tr></thead>
          <tbody>
            {futuresData.map(f => (
              <tr key={f.name}>
                <td><strong>{f.name}</strong></td>
                <td>{f.exchange}</td>
                <td className="tp-ticker">{f.margin}</td>
                <td>{f.multiplier}</td>
                <td style={{ color: '#ff6b6b' }}>{f.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlatformComparison({ platformComparison }) {
  return (
    <div className="tp-card" style={{ borderLeft: '4px solid #b388ff' }}>
      <h3>📱 Platform Comparison — What You Can Trade</h3>
      <div className="tp-table-wrap">
        <table>
          <thead><tr><th>Feature</th><th>🟠 Moomoo (SG)</th><th>🔵 Zerodha Kite (India)</th></tr></thead>
          <tbody>
            {platformComparison.map(p => (
              <tr key={p.feature}>
                <td><strong>{p.feature}</strong></td>
                <td style={{ color: p.moomoo.startsWith('✅') ? '#2ee6a8' : '#ff6b6b' }}>{p.moomoo}</td>
                <td style={{ color: p.zerodha.startsWith('✅') ? '#2ee6a8' : '#ff6b6b' }}>{p.zerodha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SixMonthPlan({ plan }) {
  return (
    <div>
      {plan.map((p, i) => (
        <div key={i} className="tp-card" style={{ borderLeft: `4px solid ${['#2ee6a8', '#4da6ff', '#b388ff', '#ff8c42', '#ffd24a', '#ff6b9d'][i % 6]}`, marginBottom: 16 }}>
          <h3>📅 {p.month}</h3>
          <div className="tp-steps">
            {p.tasks.map((task, j) => (
              <div key={j} className="tp-step tp-step-green">
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>{task}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CountryGuides({ countryGuides }) {
  return (
    <div className="tp-grid-3">
      {countryGuides.map(c => (
        <div key={c.country} className="tp-concept-box">
          <h5>{c.country}</h5>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Broker: {c.broker} | Market: {c.market}</p>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Hours: {c.hours}</p>
          <ul className="tp-list" style={{ marginTop: 8 }}>
            {c.howToInvest.map((step, j) => (
              <li key={j} style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5' }}>{step}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FundHouses({ fundHouses }) {
  return (
    <div className="tp-table-wrap">
      <table>
        <thead><tr><th>#</th><th>Fund House</th><th>Country</th><th>AUM</th><th>Top ETFs</th><th>Avg Fee</th><th>Why Good</th></tr></thead>
        <tbody>
          {fundHouses.map(f => (
            <tr key={f.name}>
              <td><span className="tp-badge tp-badge-gold">#{f.rank}</span></td>
              <td><strong>{f.name}</strong></td>
              <td>{f.country}</td>
              <td className="tp-ticker">{f.aum}</td>
              <td style={{ fontSize: '0.8rem' }}>{f.topETFs}</td>
              <td>{f.fee}</td>
              <td className="tp-example-cell">{f.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CountryFundsTable({ countryFunds }) {
  return (
    <div>
      {countryFunds.map(c => (
        <div key={c.country} className="tp-card" style={{ borderLeft: '4px solid #ff8c42', marginBottom: 16 }}>
          <h3>{c.country}</h3>
          <div className="tp-table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Yield</th><th>Risk</th><th>Min Amount</th><th>How to Buy</th></tr></thead>
              <tbody>
                {c.products.map(p => (
                  <tr key={p.name}>
                    <td><strong>{p.name}</strong></td>
                    <td style={{ color: '#2ee6a8', fontWeight: 700 }}>{p.yield}</td>
                    <td>{p.risk}</td>
                    <td>{p.min}</td>
                    <td className="tp-example-cell">{p.howToBuy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function ETFCategoryDirectory({ etfDirectory }) {
  return (
    <div>
      {etfDirectory.map((cat, ci) => (
        <div key={ci} className="tp-card" style={{ borderLeft: `4px solid ${['#ffd24a', '#4da6ff', '#2ee6a8', '#ffd24a', '#b388ff', '#ff6b9d', '#ff8c42'][ci % 7]}`, marginBottom: 16 }}>
          <h3>{cat.category}</h3>
          <div className="tp-table-wrap">
            <table>
              <thead><tr><th>Ticker</th><th>Full Name</th><th>Fee</th><th>5Y Return</th><th>Risk</th><th>How to Buy</th></tr></thead>
              <tbody>
                {cat.etfs.map(e => (
                  <tr key={e.name}>
                    <td><span className="tp-ticker">{e.name}</span></td>
                    <td><strong>{e.full}</strong></td>
                    <td>{e.fee}</td>
                    <td style={{ color: e.return5y.startsWith('+') ? '#2ee6a8' : '#ff6b6b' }}>{e.return5y}</td>
                    <td>{e.risk}</td>
                    <td className="tp-example-cell">{e.buy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function InvestmentPlaybook() {
  const { t } = useLang();
  const [activeTopic, setActiveTopic] = useState(PLAYBOOK_DATA[0].id);

  const activeData = PLAYBOOK_DATA.find(p => p.id === activeTopic) || PLAYBOOK_DATA[0];

  const renderSection = (section, si) => {
    const cards = [];
    if (section.heading) cards.push(<h3 key={`h-${si}`} style={{ marginBottom: 12 }}>{section.heading}</h3>);
    if (section.content) cards.push(<p key={`c-${si}`} style={{ color: '#94a3b8', marginBottom: 16, fontSize: '0.9rem', lineHeight: '1.6' }}>{section.content}</p>);
    if (section.cards) cards.push(<InfoCards key={`cards-${si}`} cards={section.cards} />);
    if (section.steps) cards.push(<StepList key={`steps-${si}`} steps={section.steps} />);
    if (section.brokers) cards.push(<BrokerSteps key={`broker-${si}`} brokers={section.brokers} />);
    if (section.stockData) cards.push(<StockDataTable key={`stock-${si}`} stockData={section.stockData} />);
    if (section.bondData) cards.push(<BondDataTable key={`bond-${si}`} bondData={section.bondData} />);
    if (section.etfData) cards.push(<ETFDataTable key={`etf-${si}`} etfData={section.etfData} />);
    if (section.checklist) cards.push(<ChecklistComponent key={`cl-${si}`} checklist={section.checklist} />);
    if (section.commodityList) cards.push(<CommodityList key={`com-${si}`} commodityList={section.commodityList} />);
    if (section.cryptoData) cards.push(<CryptoDataTable key={`crypto-${si}`} cryptoData={section.cryptoData} />);
    if (section.futuresData) cards.push(<FuturesTable key={`fut-${si}`} futuresData={section.futuresData} />);
    if (section.platformComparison) cards.push(<PlatformComparison key={`plat-${si}`} platformComparison={section.platformComparison} />);
    if (section.plan) cards.push(<SixMonthPlan key={`plan-${si}`} plan={section.plan} />);
    if (section.countryGuides) cards.push(<CountryGuides key={`cg-${si}`} countryGuides={section.countryGuides} />);
    if (section.fundHouses) cards.push(<FundHouses key={`fh-${si}`} fundHouses={section.fundHouses} />);
    if (section.countryFunds) cards.push(<CountryFundsTable key={`cf-${si}`} countryFunds={section.countryFunds} />);
    if (section.etfDirectory) cards.push(<ETFCategoryDirectory key={`ed-${si}`} etfDirectory={section.etfDirectory} />);
    return <div key={si} style={{ marginBottom: 24 }}>{cards}</div>;
  };

  return (
    <div>
      {/* Playbook Header */}
      <div className="tp-section-header" style={{ textAlign: 'center', padding: '30px 20px 20px' }}>
        <h2>📋 {t('Investment Playbook — Complete End-to-End Guide')}</h2>
        <p style={{ maxWidth: 700, margin: '8px auto', color: '#94a3b8' }}>
          Every step to invest in every asset class — with Moomoo (Singapore) and Zerodha Kite (India) specific instructions.
          Click any topic below for complete buy/sell guides, conditions, and step-by-step instructions.
        </p>
      </div>

      {/* Quick Nav */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 24, padding: '0 16px' }}>
        {PLAYBOOK_DATA.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveTopic(p.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${activeTopic === p.id ? p.color : '#1e293b'}`,
              background: activeTopic === p.id ? p.color : 'transparent',
              color: activeTopic === p.id ? '#fff' : '#94a3b8',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: activeTopic === p.id ? 700 : 400,
            }}
          >
            {p.icon} {p.title.split('—')[0].trim()}
          </button>
        ))}
      </div>

      {/* Active Topic Content */}
      <div className="tp-section-header" style={{ borderTop: `3px solid ${activeData.color}`, paddingTop: 20 }}>
        <h2>{activeData.icon} {activeData.title}</h2>
        <p>{activeData.subtitle}</p>
      </div>

      <div style={{ padding: '0 4px' }}>
        {activeData.sections.map((section, si) => renderSection(section, si))}
      </div>

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, padding: '20px 0', borderTop: '1px solid #1e293b' }}>
        {(() => {
          const idx = PLAYBOOK_DATA.findIndex(p => p.id === activeTopic);
          const prev = idx > 0 ? PLAYBOOK_DATA[idx - 1] : null;
          const next = idx < PLAYBOOK_DATA.length - 1 ? PLAYBOOK_DATA[idx + 1] : null;
          return (
            <>
              {prev ? (
                <button onClick={() => setActiveTopic(prev.id)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #1e293b', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}>
                  ← {prev.icon} {prev.title.split('—')[0].trim()}
                </button>
              ) : <div />}
              {next ? (
                <button onClick={() => setActiveTopic(next.id)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #1e293b', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}>
                  {next.icon} {next.title.split('—')[0].trim()} →
                </button>
              ) : <div />}
            </>
          );
        })()}
      </div>

      <div className="tp-alert tp-alert-info" style={{ marginTop: 16 }}>
        ℹ️ <strong>Disclaimer:</strong> This is educational content only — not financial advice. Always do your own research before investing. Past performance does not guarantee future results.
      </div>
    </div>
  );
}
