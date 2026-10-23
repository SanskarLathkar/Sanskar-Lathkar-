export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  relatedSymbols: string[];
  category?: 'stocks' | 'crypto' | 'forex' | 'commodities' | 'tech';
  importance?: 'breaking' | 'standard';
  summary?: string;
  readTime?: string;
  timestamp?: number;
}

export interface EconomicEvent {
  id: string;
  country: string;
  event: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface CommunityIdea {
  id: string;
  author: string;
  title: string;
  symbol: string;
  bias: 'Long' | 'Short';
  likes: number;
  comments: number;
  timeAgo: string;
  summary: string;
}

export const NEWS_FEED: NewsItem[] = [
  {
    id: 'news-1',
    headline: 'NVIDIA Expands Blackwell Ultra GPU Supply Line as Enterprise AI Demand Surges',
    source: 'Bloomberg Tech',
    timeAgo: '4m ago',
    sentiment: 'bullish',
    relatedSymbols: ['NVDA', 'MSFT', 'TSM'],
    category: 'tech',
    importance: 'breaking',
    summary: 'Cloud hyperscalers accelerate server deployments, prompting contract expansions across advanced packaging foundries.',
    readTime: '2 min read',
    timestamp: Date.now() - 4 * 60 * 1000
  },
  {
    id: 'news-2',
    headline: 'Bitcoin Breaches $71,000 as Spot ETF Inflows Reach Three-Week Peak of $820M',
    source: 'CoinDesk Pro',
    timeAgo: '11m ago',
    sentiment: 'bullish',
    relatedSymbols: ['BTC', 'ETH', 'SOL'],
    category: 'crypto',
    importance: 'breaking',
    summary: 'Institutional asset managers post net positive inflows across all major registered spot exchange-traded funds.',
    readTime: '3 min read',
    timestamp: Date.now() - 11 * 60 * 1000
  },
  {
    id: 'news-3',
    headline: 'Federal Reserve Signals Measured Interest Rate Path Ahead of Upcoming FOMC Session',
    source: 'Reuters Macro',
    timeAgo: '24m ago',
    sentiment: 'neutral',
    relatedSymbols: ['SPY', 'QQQ', 'EUR/USD'],
    category: 'forex',
    importance: 'standard',
    summary: 'Policy officials highlight ongoing wage normalization alongside steady labor market metrics in pre-blackout speeches.',
    readTime: '4 min read',
    timestamp: Date.now() - 24 * 60 * 1000
  },
  {
    id: 'news-4',
    headline: 'Tesla Deploys FSD V13 Architecture with End-to-End Neural Highway Reasoning',
    source: 'CNBC Auto',
    timeAgo: '38m ago',
    sentiment: 'bullish',
    relatedSymbols: ['TSLA', 'AAPL'],
    category: 'stocks',
    importance: 'standard',
    summary: 'Full self-driving fleet rollout demonstrates 4x reduction in critical interventions across complex urban corridors.',
    readTime: '3 min read',
    timestamp: Date.now() - 38 * 60 * 1000
  },
  {
    id: 'news-5',
    headline: 'Gold Bullion Consolidates Near Record Highs as Central Banks Boost Reserves',
    source: 'Financial Times',
    timeAgo: '52m ago',
    sentiment: 'bullish',
    relatedSymbols: ['XAU/USD', 'WTI/USD'],
    category: 'commodities',
    importance: 'standard',
    summary: 'Sovereign wealth funds and monetary authorities continue monthly gold accumulation to diversify reserves.',
    readTime: '3 min read',
    timestamp: Date.now() - 52 * 60 * 1000
  },
  {
    id: 'news-6',
    headline: 'Crude Oil Pulls Back 1.8% Following EIA Inventory Build and Tanker Supply Flows',
    source: 'Wall Street Journal',
    timeAgo: '1h ago',
    sentiment: 'bearish',
    relatedSymbols: ['WTI/USD', 'XOM', 'CVX'],
    category: 'commodities',
    importance: 'standard',
    summary: 'Domestic commercial crude stockpiles rose by 2.4 million barrels against expectations of a modest draw.',
    readTime: '2 min read',
    timestamp: Date.now() - 65 * 60 * 1000
  },
  {
    id: 'news-7',
    headline: 'Apple Partners with TSMC for Custom 2nm M5 Silicon Foundry Allocation',
    source: 'Nikkei Asia',
    timeAgo: '2h ago',
    sentiment: 'bullish',
    relatedSymbols: ['AAPL', 'TSM', 'NVDA'],
    category: 'tech',
    importance: 'standard',
    summary: 'Next-generation system-on-chip enters trial tape-outs with enhanced neural engine capabilities targeted for pro line.',
    readTime: '3 min read',
    timestamp: Date.now() - 120 * 60 * 1000
  },
  {
    id: 'news-8',
    headline: 'European Central Bank Holds Benchmarks Steady While Monitoring Services Inflation',
    source: 'Bloomberg Markets',
    timeAgo: '2h ago',
    sentiment: 'neutral',
    relatedSymbols: ['EUR/USD', 'SPY'],
    category: 'forex',
    importance: 'standard',
    summary: 'Governing Council reaffirms data-dependent approach without committing to a pre-set rate reduction trajectory.',
    readTime: '4 min read',
    timestamp: Date.now() - 140 * 60 * 1000
  },
  {
    id: 'news-9',
    headline: 'Ethereum L2 Transaction Velocity Hits Record 35,000 TPS Post-Pectra Hardfork',
    source: 'Blockworks',
    timeAgo: '3h ago',
    sentiment: 'bullish',
    relatedSymbols: ['ETH', 'BTC', 'SOL'],
    category: 'crypto',
    importance: 'standard',
    summary: 'Data availability optimizations lower average settlement costs for DeFi rollups below one cent.',
    readTime: '2 min read',
    timestamp: Date.now() - 180 * 60 * 1000
  }
];

export const STREAMING_NEWS_POOL: Omit<NewsItem, 'id' | 'timeAgo' | 'timestamp'>[] = [
  {
    headline: 'BREAKING: S&P 500 Touches Fresh Intraday High Led by Semiconductor & Cloud Outperformance',
    source: 'Reuters Flash',
    sentiment: 'bullish',
    relatedSymbols: ['SPY', 'NVDA', 'QQQ'],
    category: 'stocks',
    importance: 'breaking',
    summary: 'Broad market breadth widens as tech momentum spills over into regional banking and capital goods sectors.',
    readTime: '1 min read'
  },
  {
    headline: 'Solana Ecosystem DEX Volume Outpaces Competitors as Liquid Staking Crosses $6.2B',
    source: 'The Block',
    sentiment: 'bullish',
    relatedSymbols: ['SOL', 'ETH', 'BTC'],
    category: 'crypto',
    importance: 'standard',
    summary: 'On-chain liquidity depth deepens across automated market makers with perpetual swap volumes rising 22%.',
    readTime: '2 min read'
  },
  {
    headline: 'Natural Gas Futures Spike 4.2% on Early Cold Front Projections in Northern Corridor',
    source: 'Bloomberg Energy',
    sentiment: 'bullish',
    relatedSymbols: ['WTI/USD', 'XOM'],
    category: 'commodities',
    importance: 'standard',
    summary: 'Weather models signal below-average temperatures driving heating demand across eastern industrial hubs.',
    readTime: '2 min read'
  },
  {
    headline: 'BOJ Governor Affirms Gradual Normalization If Realized Core Wages Meet Outlook',
    source: 'Kyodo News',
    sentiment: 'neutral',
    relatedSymbols: ['USD/JPY', 'EUR/USD'],
    category: 'forex',
    importance: 'standard',
    summary: 'Japanese monetary stance continues progressive departure from negative yield policies.',
    readTime: '3 min read'
  },
  {
    headline: 'Alphabet Expands Tensor TPU G6 Data Centers into European High-Density Zones',
    source: 'TechCrunch Wire',
    sentiment: 'bullish',
    relatedSymbols: ['GOOGL', 'NVDA', 'MSFT'],
    category: 'tech',
    importance: 'standard',
    summary: 'Multi-billion dollar infrastructure deployment focuses on sovereign AI compute capabilities for institutional clients.',
    readTime: '2 min read'
  },
  {
    headline: 'Treasury Yields Stabilize Near 4.18% Following Well-Received 10-Year Bond Auction',
    source: 'CNBC Markets',
    sentiment: 'neutral',
    relatedSymbols: ['SPY', 'QQQ'],
    category: 'forex',
    importance: 'standard',
    summary: 'Direct bidders take down 21.4% of the issuance amid robust international appetite for sovereign debt.',
    readTime: '2 min read'
  }
];

export const ECONOMIC_CALENDAR: EconomicEvent[] = [
  {
    id: 'econ-1',
    country: 'US',
    event: 'Core CPI (MoM)',
    time: '08:30 EST',
    impact: 'high',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.2%'
  },
  {
    id: 'econ-2',
    country: 'US',
    event: 'FOMC Interest Rate Decision',
    time: '14:00 EST',
    impact: 'high',
    forecast: '4.75%',
    previous: '5.00%'
  },
  {
    id: 'econ-3',
    country: 'EU',
    event: 'ECB Monetary Policy Statement',
    time: '13:45 CET',
    impact: 'high',
    forecast: '3.25%',
    previous: '3.50%'
  },
  {
    id: 'econ-4',
    country: 'US',
    event: 'Initial Jobless Claims',
    time: '08:30 EST',
    impact: 'medium',
    actual: '218K',
    forecast: '224K',
    previous: '220K'
  },
  {
    id: 'econ-5',
    country: 'JP',
    event: 'BoJ Governor Ueda Press Briefing',
    time: '15:30 JST',
    impact: 'medium',
    previous: '0.25%'
  }
];

export const COMMUNITY_IDEAS: CommunityIdea[] = [
  {
    id: 'idea-1',
    author: 'QuantumWave_Alpha',
    title: 'NVDA: Ascending Triangle Breakout Targeting $152 Extension',
    symbol: 'NVDA',
    bias: 'Long',
    likes: 342,
    comments: 48,
    timeAgo: '3h ago',
    summary: 'Daily consolidation range has tightened right at the 0.618 Fib retracement. Clean risk/reward with invalidation below 132.'
  },
  {
    id: 'idea-2',
    author: 'Satoshi_Chartist',
    title: 'BTC/USD: Macro Bull Flag Continuation Towards $74,000 ATH',
    symbol: 'BTC/USD',
    bias: 'Long',
    likes: 890,
    comments: 112,
    timeAgo: '5h ago',
    summary: 'Weekly close above 66k confirmed volume breakout. Funding rates reset nicely, opening path for continuation rally.'
  },
  {
    id: 'idea-3',
    author: 'ForexViper_FX',
    title: 'EUR/USD: Bearish Head & Shoulders Neckline Retest',
    symbol: 'EUR/USD',
    bias: 'Short',
    likes: 175,
    comments: 29,
    timeAgo: '6h ago',
    summary: 'Right shoulder rejected at 1.0920 zone with bearish RSI divergence on the 4H timeframe. Target 1.0780.'
  }
];

export const INITIAL_PINE_SCRIPT = `//@version=5
indicator("TradingView SuperTrend + EMA Ribbon [PRO]", overlay=true)

// User Inputs
emaShortLength = input.int(20, "EMA Short Length")
emaLongLength  = input.int(50, "EMA Long Length")
atrPeriod      = input.int(10, "Supertrend ATR Period")
multiplier     = input.float(3.0, "Supertrend Multiplier")

// Calculations
emaShort = ta.ema(close, emaShortLength)
emaLong  = ta.ema(close, emaLongLength)
[supertrend, direction] = ta.supertrend(multiplier, atrPeriod)

// Plot Overlays
plot(emaShort, "Short EMA", color=color.cyan, linewidth=2)
plot(emaLong, "Long EMA", color=color.orange, linewidth=2)

// Supertrend Plotting
bodyMiddle = plot((open + close) / 2, display=display.none)
upTrend = plot(direction < 0 ? supertrend : na, "Up Trend", color=color.green, style=plot.style_linebr)
downTrend = plot(direction < 0 ? na : supertrend, "Down Trend", color=color.red, style=plot.style_linebr)

fill(bodyMiddle, upTrend, color.new(color.green, 90), fillgaps=false)
fill(bodyMiddle, downTrend, color.new(color.red, 90), fillgaps=false)

// Alert conditions
alertcondition(ta.crossover(emaShort, emaLong), "Golden Cross", "EMA 20 crossed above EMA 50")
alertcondition(ta.crossunder(emaShort, emaLong), "Death Cross", "EMA 20 crossed below EMA 50")
`;
