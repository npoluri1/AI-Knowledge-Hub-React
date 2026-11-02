// Trading in Plain English — every idea explained with an everyday analogy and a real-number example.
// Educational only — not financial advice.

export const PE_CATS = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'basics', label: 'Money basics', icon: '🌱' },
  { id: 'market', label: 'How the market works', icon: '🏪' },
  { id: 'assets', label: 'Things you can buy', icon: '🧺' },
  { id: 'charts', label: 'Charts & signals', icon: '🕯️' },
  { id: 'company', label: 'Judging a company', icon: '🏢' },
  { id: 'risk', label: 'Risk & safety', icon: '🛡️' },
  { id: 'advanced', label: 'Advanced made simple', icon: '🎯' },
]

// t = term, e = emoji, c = category, lay = one-line plain meaning, like = everyday analogy, ex = real-number example
export const TERMS = [
  // money basics
  { t: 'Investing', e: '🌳', c: 'basics', lay: 'Putting money into something today so it grows into more money later.', like: 'Planting a mango seed. You wait years, but then it gives fruit every season.', ex: '$1,000 in an S&P 500 fund in 2010 grew to roughly $5,000+ by 2025.' },
  { t: 'Trading', e: '🏃', c: 'basics', lay: 'Buying and selling quickly to profit from short price moves.', like: 'Buying concert tickets on release day and reselling them the week of the show.', ex: 'Buy a stock at $50 on Monday, sell at $53 on Thursday → $3 profit per share.' },
  { t: 'Compound interest', e: '❄️', c: 'basics', lay: 'Your earnings start earning money too.', like: 'A snowball rolling downhill picks up more snow the bigger it gets.', ex: '$10,000 at 8% a year: $21,600 after 10 years, $46,600 after 20, $100,600 after 30.' },
  { t: 'Rule of 72', e: '⏱️', c: 'basics', lay: 'Divide 72 by your yearly return to see how many years it takes to double.', like: 'A quick mental shortcut, like knowing 100 km at 50 km/h takes 2 hours.', ex: 'At 8% a year: 72 ÷ 8 = 9 years to double. At 12%: 6 years.' },
  { t: 'Inflation', e: '🎈', c: 'basics', lay: 'Prices slowly go up, so the same money buys less each year.', like: 'Your favourite coffee cost $3 five years ago and now costs $4 — your $3 shrank.', ex: 'At 3% inflation, $100,000 in cash buys only ~$74,000 of goods after 10 years.' },
  { t: 'Emergency fund', e: '🧯', c: 'basics', lay: 'Savings you never invest, kept for job loss or surprises.', like: 'A spare tyre — boring until the day you really need it.', ex: 'Monthly costs $3,000 → keep $18,000 (6 months) in a high-yield account.' },
  { t: 'DCA (dollar-cost averaging)', e: '📅', c: 'basics', lay: 'Invest the same amount every month, no matter the price.', like: 'Buying groceries every week — some weeks prices are high, some low, it evens out.', ex: '$500 a month: when price is $50 you get 10 shares, when it is $25 you get 20 shares automatically.' },
  { t: 'Net worth', e: '⚖️', c: 'basics', lay: 'Everything you own minus everything you owe.', like: 'If you sold everything and paid all debts, what would be left in your pocket.', ex: 'Home $800k + investments $100k − mortgage $500k = $400k net worth.' },

  // market
  { t: 'Stock market', e: '🏪', c: 'market', lay: 'A huge marketplace where people buy and sell small pieces of companies.', like: 'A giant farmers’ market, but instead of vegetables, people trade pieces of companies.', ex: 'NYSE, NASDAQ (US), SGX (Singapore), NSE (India) are stock markets.' },
  { t: 'Share / stock', e: '🍕', c: 'market', lay: 'A tiny slice of ownership in a company.', like: 'If a company is a pizza cut into 1 million slices, one share is one slice.', ex: 'Own 1 Apple share = you own a tiny part of Apple and its future profits.' },
  { t: 'Broker', e: '🚪', c: 'market', lay: 'The app or company that lets you buy and sell on the market.', like: 'A travel agent who books the flight for you — you do not deal with the airline directly.', ex: 'Moomoo, Interactive Brokers, Tiger, Zerodha, Groww.' },
  { t: 'Bid & ask', e: '🤝', c: 'market', lay: 'Bid = highest price buyers will pay. Ask = lowest price sellers will accept.', like: 'A used-car lot: you offer $9,500 (bid), the dealer wants $10,000 (ask).', ex: 'Bid $100.00 / Ask $100.05 → the 5-cent gap is the spread.' },
  { t: 'Market order', e: '⚡', c: 'market', lay: 'Buy or sell right now at whatever price is available.', like: 'Grabbing the first taxi in the queue, whatever it costs.', ex: 'Fast, but in a fast-moving stock you might pay $101 instead of $100.' },
  { t: 'Limit order', e: '🎯', c: 'market', lay: 'Buy or sell only at your price or better.', like: 'Telling the shop: “Call me if this TV drops to $500.”', ex: 'Limit buy at $95 — it waits and only fills if the price falls to $95.' },
  { t: 'Stop-loss', e: '🛑', c: 'market', lay: 'An automatic sell if the price falls to a level you choose.', like: 'A fuse box — it cuts power before the whole house burns.', ex: 'Buy at $100, stop at $92 → maximum loss about 8%.' },
  { t: 'Bull market', e: '🐂', c: 'market', lay: 'A period when prices keep rising (usually +20% from a low).', like: 'A bull attacks by thrusting its horns UP.', ex: 'US stocks 2009–2020 was one of the longest bull markets in history.' },
  { t: 'Bear market', e: '🐻', c: 'market', lay: 'Prices fall 20% or more from a recent high.', like: 'A bear attacks by swiping its paws DOWN.', ex: '2022: the Nasdaq fell about 33%.' },
  { t: 'Market cap', e: '🏷️', c: 'market', lay: 'The total price tag of a company = share price × number of shares.', like: 'The price you would pay to buy every single slice of the pizza.', ex: '$200 share × 5 billion shares = $1 trillion company.' },
  { t: 'Liquidity', e: '💧', c: 'market', lay: 'How fast you can turn something into cash without losing value.', like: 'Cash is water (flows instantly); a house is ice (takes months to melt into cash).', ex: 'You can sell Apple shares in 1 second; selling a flat can take 3 months.' },
  { t: 'Volatility', e: '🎢', c: 'market', lay: 'How wildly the price swings up and down.', like: 'A calm lake vs a roller coaster.', ex: 'A bond fund moves ~0.3% a day; Bitcoin can move 5–10% in a day.' },

  // assets
  { t: 'Bond', e: '📜', c: 'assets', lay: 'You lend money to a government or company; they pay you interest and return it later.', like: 'Lending your friend $1,000; they pay you $40 a year and give the $1,000 back in 5 years.', ex: 'Singapore Savings Bond ~3% a year, US 10-year Treasury ~4%.' },
  { t: 'ETF', e: '🧺', c: 'assets', lay: 'One share that holds many stocks or bonds at once.', like: 'A fruit basket — one purchase, many fruits inside.', ex: 'Buy 1 VOO share → you own a slice of all 500 biggest US companies.' },
  { t: 'Index fund', e: '📋', c: 'assets', lay: 'A fund that simply copies a market list like the S&P 500 or Nifty 50.', like: 'Instead of picking the best players, you buy the whole league.', ex: 'Low cost (~0.03% a year) and beats most professional fund managers over 15 years.' },
  { t: 'Mutual fund', e: '🤝', c: 'assets', lay: 'Many people pool money and a manager invests it for them.', like: 'Friends sharing a taxi — everyone pays a bit, one driver steers.', ex: 'SIP of ₹5,000/month into an index mutual fund in India.' },
  { t: 'Dividend', e: '💵', c: 'assets', lay: 'A share of profits a company pays to its shareholders, usually every quarter.', like: 'Rent you receive just for owning a piece of the building.', ex: 'Own 1,000 DBS shares × ~$0.54 a quarter ≈ $2,160 a year.' },
  { t: 'REIT', e: '🏢', c: 'assets', lay: 'A company that owns property (malls, offices) and pays out most of its rent.', like: 'Being a landlord without fixing toilets.', ex: 'Singapore REITs often pay 5–7% a year in dividends.' },
  { t: 'Gold', e: '🪙', c: 'assets', lay: 'A metal people buy as safety when they are scared.', like: 'An umbrella — not exciting, but you are glad to have it in a storm.', ex: 'In 2008 stocks fell ~37% while gold rose ~5%.' },
  { t: 'Crypto', e: '₿', c: 'assets', lay: 'Digital money that runs on a public computer ledger (blockchain) not controlled by a bank.', like: 'A shared Google Sheet of who owns what that thousands of computers check.', ex: 'Bitcoin has had several 70–80% drops — only invest what you can afford to lose.' },
  { t: 'Forex', e: '💱', c: 'assets', lay: 'Trading one currency for another.', like: 'Changing SGD to USD before a holiday — but trying to profit from the rate moving.', ex: 'USD/SGD moves from 1.35 to 1.36 — tiny moves, so traders use leverage (risky).' },

  // charts
  { t: 'Candlestick', e: '🕯️', c: 'charts', lay: 'A bar showing the open, high, low and close price for a period.', like: 'A daily weather report: morning temp, hottest, coldest, evening temp.', ex: 'Green candle: opened $100, closed $104. Red: opened $104, closed $100.' },
  { t: 'Trend', e: '📈', c: 'charts', lay: 'The general direction the price is heading.', like: 'Climbing stairs: up, small step back, up again = uptrend.', ex: 'Higher highs and higher lows for 6 months = uptrend.' },
  { t: 'Support', e: '🧱', c: 'charts', lay: 'A price where buyers keep stepping in to stop falls.', like: 'A floor the ball keeps bouncing off.', ex: 'Stock bounced at $100 in March, June and September — $100 is support.' },
  { t: 'Resistance', e: '🪟', c: 'charts', lay: 'A price where sellers keep appearing to stop rises.', like: 'A ceiling the ball keeps hitting.', ex: 'Failed to break $150 three times — $150 is resistance.' },
  { t: 'Moving average', e: '〰️', c: 'charts', lay: 'The average price over the last N days, drawn as a smooth line.', like: 'Your average marks this term — smooths out one bad test.', ex: 'Price above the 200-day average = long-term healthy.' },
  { t: 'RSI', e: '🌡️', c: 'charts', lay: 'A 0–100 thermometer of how fast price has been rising or falling.', like: 'A car’s RPM gauge — redlining above 70 can’t last forever.', ex: 'RSI 80 = overheated; RSI 25 = oversold and often due a bounce.' },
  { t: 'Volume', e: '📢', c: 'charts', lay: 'How many shares were traded.', like: 'How loud the crowd is — a goal with a full stadium cheering is more convincing.', ex: 'Breakout on 3× normal volume is far more reliable than on low volume.' },
  { t: 'Breakout', e: '🚀', c: 'charts', lay: 'Price pushes through resistance and keeps going.', like: 'A crowd finally breaking through the stadium gate.', ex: 'Stuck under $50 for 6 months, then closes at $53 on big volume.' },

  // company
  { t: 'Revenue', e: '🧾', c: 'company', lay: 'All the money a company takes in from sales.', like: 'Everything that goes into a lemonade stand’s cash box.', ex: 'Sold 1,000 cups at $2 = $2,000 revenue.' },
  { t: 'Profit (earnings)', e: '💰', c: 'company', lay: 'What is left after all costs are paid.', like: 'Cash box minus lemons, sugar, cups and rent.', ex: '$2,000 revenue − $1,400 costs = $600 profit.' },
  { t: 'P/E ratio', e: '🔢', c: 'company', lay: 'Price ÷ yearly profit per share — how many years of profit you are paying for.', like: 'Buying a lemonade stand earning $600 a year for $9,000 = P/E 15.', ex: 'P/E 15 is average; P/E 60 means investors expect fast growth.' },
  { t: 'Free cash flow', e: '🚰', c: 'company', lay: 'Real cash left over after running and investing in the business.', like: 'Salary left after rent, bills and fixing the car.', ex: 'Apple generates ~$100B+ of free cash flow a year.' },
  { t: 'Debt-to-equity', e: '🏋️', c: 'company', lay: 'How much the company borrowed compared to what it owns.', like: 'A house with a small mortgage vs one with a huge mortgage.', ex: 'D/E 0.3 = light debt. D/E 3 = heavy — dangerous in a recession.' },
  { t: 'Moat', e: '🏰', c: 'company', lay: 'A strong advantage that keeps competitors away.', like: 'A castle protected by a wide moat.', ex: 'Visa/Mastercard: every shop accepts them, so new rivals struggle.' },
  { t: 'Earnings season', e: '📣', c: 'company', lay: 'The weeks when companies report their quarterly results.', like: 'School report-card day — prices jump or drop on the grades.', ex: 'A company beats profit estimates by 10% → stock can jump 8% next day.' },

  // risk
  { t: 'Diversification', e: '🥚', c: 'risk', lay: 'Spreading money across many different investments.', like: 'Not putting all your eggs in one basket.', ex: 'Own 500 companies via an ETF — one bankrupt company barely hurts.' },
  { t: 'Risk vs reward', e: '⚖️', c: 'risk', lay: 'Bigger possible gains always come with bigger possible losses.', like: 'A higher diving board: bigger splash, bigger chance of a belly flop.', ex: 'Savings: 3%, never drops. Stocks: ~10%, can fall 50% in a bad year.' },
  { t: 'Position sizing', e: '📏', c: 'risk', lay: 'Deciding how much to put into one trade.', like: 'Never betting your whole salary on one football match.', ex: 'Risk only 1% of a $20,000 account = $200 maximum loss per trade.' },
  { t: 'Drawdown', e: '📉', c: 'risk', lay: 'How far your money fell from its highest point.', like: 'Hiking down from a peak before climbing the next one.', ex: '$10,000 → $7,000 = 30% drawdown. You now need +43% to get back.' },
  { t: 'Leverage', e: '🪝', c: 'risk', lay: 'Borrowing to make a bigger bet.', like: 'Buying a house with 20% deposit — great if price rises, painful if it falls.', ex: '10× leverage: a 10% drop wipes out 100% of your money.' },
  { t: 'FOMO', e: '😱', c: 'risk', lay: 'Fear Of Missing Out — buying because everyone else is.', like: 'Joining a long queue just because it is long.', ex: 'Buying a coin after it went up 500% in a month — often near the top.' },
  { t: 'Rebalancing', e: '🔄', c: 'risk', lay: 'Resetting your mix back to plan once a year.', like: 'Trimming a hedge so one side does not overgrow.', ex: 'Plan 60/40, stocks grew to 70/30 → sell 10% stocks, buy bonds.' },

  // advanced
  { t: 'Call option', e: '📞', c: 'advanced', lay: 'The right (not duty) to BUY at a set price before a date.', like: 'Paying a $500 deposit to lock a house price for 3 months.', ex: 'Pay $3 for the right to buy at $100. Stock goes to $110 → worth ~$10.' },
  { t: 'Put option', e: '🛡️', c: 'advanced', lay: 'The right to SELL at a set price — like insurance.', like: 'Car insurance: you pay a premium, and it pays out if there is a crash.', ex: 'Own stock at $100, buy a $95 put — losses below $95 are covered.' },
  { t: 'Short selling', e: '🔻', c: 'advanced', lay: 'Betting a price will fall by selling borrowed shares and buying back cheaper.', like: 'Borrow a friend’s book, sell it for $20, buy it back for $12, return it, keep $8.', ex: 'Risky: if the price doubles instead, losses keep growing.' },
  { t: 'Futures', e: '📆', c: 'advanced', lay: 'A contract to buy or sell something at a fixed price on a future date.', like: 'A farmer agreeing today to sell next year’s wheat at a set price.', ex: 'Airlines buy oil futures to lock fuel costs.' },
  { t: 'Backtesting', e: '🔁', c: 'advanced', lay: 'Testing a strategy on past data before using real money.', like: 'Practising a recipe before cooking it for guests.', ex: 'Check how a strategy did from 2000 to 2025, including 2008 and 2020 crashes.' },
  { t: 'Algorithmic trading', e: '🤖', c: 'advanced', lay: 'Computers place trades automatically following rules.', like: 'A washing machine programme: set the rules once, it runs by itself.', ex: '“Buy when 50-day average crosses above 200-day, sell when it crosses below.”' },
]

// A full trade told as a story, step by step
export const TRADE_STORY = {
  hero: 'Meet Priya, a nurse in Singapore with $20,000 saved',
  steps: [
    { e: '🧯', t: 'Safety first', s: 'She keeps $12,000 as an emergency fund in a high-yield account. She only invests the other $8,000 — money she will not need for 5+ years.', lesson: 'Never invest money you might need soon.' },
    { e: '🧺', t: 'Build the core', s: 'She puts $6,000 into a world ETF and plans $500 every month (DCA). This is her “boring but powerful” long-term money.', lesson: '75% core in index funds is the backbone.' },
    { e: '🔍', t: 'Pick one idea', s: 'With $2,000 she wants to try one stock. She likes a bank that pays a 5% dividend, has steady profits and a P/E of 10.', lesson: 'Research the business, not just the chart.' },
    { e: '📏', t: 'Plan the trade', s: 'Price $40. Support at $37, so her stop-loss is $36.80. Target $46 (last high). Risk $3.20 to make $6 — about 1 : 2.', lesson: 'Decide entry, stop and target BEFORE buying.' },
    { e: '🎯', t: 'Place a limit order', s: 'She enters a limit buy at $40 for 50 shares ($2,000). It fills the next morning.', lesson: 'Limit orders protect you from surprise prices.' },
    { e: '🎢', t: 'The scary week', s: 'Bad news: price drops to $37.50. She feels fear but does nothing — her stop at $36.80 is not hit and her reason for buying has not changed.', lesson: 'Follow the plan, not the feeling.' },
    { e: '💵', t: 'Getting paid', s: 'Two months later she receives a dividend: 50 × $0.50 = $25, straight into her account.', lesson: 'Dividends pay you while you wait.' },
    { e: '🏁', t: 'Taking profit', s: 'Price reaches $46. She sells 25 shares (+$150) and moves her stop up to $42 for the rest — now she cannot lose on this trade.', lesson: 'Lock in some profit, let the rest run safely.' },
    { e: '📓', t: 'Write it down', s: 'In her journal: “Bought at support with a clear plan. Felt fear at $37.50 but stuck to it. Next time: size the same, same 1:2 rule.”', lesson: 'A journal turns trades into lessons.' },
  ],
}

export const MYTHS = [
  { m: 'You need a lot of money to start.', f: 'Many apps let you buy fractional shares from $1, and SIPs in India start at ₹100–500.' },
  { m: 'Investing is gambling.', f: 'Gambling odds are against you over time. A diversified index fund has historically risen over every 20-year period in the US.' },
  { m: 'I should wait for the perfect time to buy.', f: 'Nobody can time the market reliably. Missing just the 10 best days in 20 years roughly halves your return.' },
  { m: 'A stock that fell a lot must be cheap.', f: 'A stock down 90% can still fall another 90%. Cheap means good value for the business, not a low price.' },
  { m: 'High dividend = safe investment.', f: 'A very high yield (10%+) often means the price fell because investors fear the dividend will be cut.' },
  { m: 'Day traders get rich quickly.', f: 'Studies show most retail day traders lose money over a year. Long-term investing builds most wealth.' },
  { m: 'Crypto/AI stocks only go up.', f: 'Every hot theme has had crashes of 50–80% (dot-com 2000, crypto 2018 & 2022).' },
  { m: 'Gold and bonds are pointless.', f: 'They often rise or hold steady when stocks crash, cushioning your portfolio.' },
]

export const FAQ = [
  { q: 'The market is crashing — should I sell everything?', a: 'Usually no. Crashes are normal (roughly one big drop every 5–7 years). If your money is long-term and diversified, selling locks in the loss. Many investors keep their monthly DCA going and buy more cheaply.' },
  { q: 'How much should I invest each month?', a: 'A common starting rule: save 20% of take-home pay. After the emergency fund is full, invest most of that 20% automatically on payday.' },
  { q: 'Stocks or ETFs first?', a: 'ETFs first. They give instant diversification. Add individual stocks only with money you are happy to learn with (5–20% of your portfolio).' },
  { q: 'How do I know if a stock is expensive?', a: 'Compare its P/E with its own history and with similar companies, and check whether profits are growing fast enough to justify it.' },
  { q: 'When should I sell?', a: 'Sell when your reason for buying is no longer true, when it hits your stop-loss, when it grows too big in your portfolio, or when you need the money for its planned goal.' },
  { q: 'What is a good return?', a: 'Over decades, a global stock portfolio has averaged roughly 7–10% a year before inflation. Anyone promising 5% a month is a red flag.' },
  { q: 'How do I avoid scams?', a: 'Use regulated brokers (check MAS in Singapore, SEBI in India, SEC/FINRA in the US). Never send money to someone who contacted you first promising guaranteed returns.' },
]

export const GOLDEN_RULES = [
  ['🧯', 'Emergency fund before investing'],
  ['🧺', 'Index funds as the core'],
  ['📅', 'Invest automatically every month'],
  ['🥚', 'Diversify across assets and countries'],
  ['🛑', 'Always know your exit before entry'],
  ['📏', 'Risk 1–2% per trade, never more'],
  ['🧘', 'Ignore the noise, follow the plan'],
  ['⏳', 'Time in the market beats timing the market'],
]
