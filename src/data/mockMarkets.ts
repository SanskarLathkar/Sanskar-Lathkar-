import { Asset, Broker, Candle, Position, WorldMarketIndex } from '../types/trading';

/**
 * Generate synthetic realistic candlestick histories
 */
function generateCandles(basePrice: number, count = 60, volatility = 0.008): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  const interval = 5 * 60 * 1000; // 5 minute bars
  let currentClose = basePrice;

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * interval;
    const delta = (Math.random() - 0.49) * 2 * (currentClose * volatility);
    const open = currentClose;
    const close = Math.max(open + delta, 0.01);
    const high = Math.max(open, close) + Math.random() * (currentClose * volatility * 0.8);
    const low = Math.min(open, close) - Math.random() * (currentClose * volatility * 0.8);
    const volume = Math.floor(10000 + Math.random() * 90000);

    candles.push({
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });

    currentClose = close;
  }
  return candles;
}

export const INITIAL_ASSETS: Asset[] = [
  // --- EQUITIES ---
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stocks',
    price: 234.85,
    change24h: 1.45,
    high24h: 236.10,
    low24h: 231.50,
    volume24h: '58.4M',
    marketCap: '$3.58T',
    candles: generateCandles(230, 60, 0.006)
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'stocks',
    price: 138.25,
    change24h: 3.82,
    high24h: 140.10,
    low24h: 134.60,
    volume24h: '112.8M',
    marketCap: '$3.40T',
    candles: generateCandles(132, 60, 0.014)
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'stocks',
    price: 218.40,
    change24h: -1.74,
    high24h: 224.50,
    low24h: 216.10,
    volume24h: '74.2M',
    marketCap: '$698B',
    candles: generateCandles(222, 60, 0.016)
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    category: 'stocks',
    price: 422.60,
    change24h: 0.92,
    high24h: 425.00,
    low24h: 419.80,
    volume24h: '22.1M',
    marketCap: '$3.14T',
    candles: generateCandles(418, 60, 0.005)
  },
  {
    id: 'reliance',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    category: 'stocks',
    price: 33.15, // converted equivalent in USD
    change24h: 2.15,
    high24h: 33.80,
    low24h: 32.40,
    volume24h: '18.9M',
    marketCap: '$242B',
    candles: generateCandles(32.2, 60, 0.008)
  },

  // --- CRYPTO ---
  {
    id: 'btc',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    price: 67840.00,
    change24h: 4.25,
    high24h: 68450.00,
    low24h: 64920.00,
    volume24h: '$34.2B',
    marketCap: '$1.34T',
    candles: generateCandles(65200, 60, 0.012)
  },
  {
    id: 'eth',
    symbol: 'ETH/USD',
    name: 'Ethereum',
    category: 'crypto',
    price: 2640.50,
    change24h: 2.80,
    high24h: 2685.00,
    low24h: 2550.00,
    volume24h: '$16.8B',
    marketCap: '$318B',
    candles: generateCandles(2560, 60, 0.015)
  },
  {
    id: 'sol',
    symbol: 'SOL/USD',
    name: 'Solana',
    category: 'crypto',
    price: 154.20,
    change24h: 6.45,
    high24h: 158.00,
    low24h: 144.50,
    volume24h: '$4.1B',
    marketCap: '$72.5B',
    candles: generateCandles(145, 60, 0.02)
  },
  {
    id: 'usdt',
    symbol: 'USDT/USD',
    name: 'Tether USD',
    category: 'crypto',
    price: 1.0002,
    change24h: 0.02,
    high24h: 1.0008,
    low24h: 0.9996,
    volume24h: '$52.9B',
    marketCap: '$119B',
    candles: generateCandles(1.0001, 60, 0.0004)
  },

  // --- FOREX ---
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    price: 1.0885,
    change24h: -0.22,
    high24h: 1.0920,
    low24h: 1.0865,
    volume24h: '$480B',
    marketCap: 'FX Spot',
    candles: generateCandles(1.091, 60, 0.002)
  },
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'forex',
    price: 1.3045,
    change24h: 0.35,
    high24h: 1.3080,
    low24h: 1.2995,
    volume24h: '$320B',
    marketCap: 'FX Spot',
    candles: generateCandles(1.300, 60, 0.0025)
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    price: 149.65,
    change24h: 0.58,
    high24h: 150.10,
    low24h: 148.80,
    volume24h: '$410B',
    marketCap: 'FX Spot',
    candles: generateCandles(148.8, 60, 0.003)
  },

  // --- COMMODITIES ---
  {
    id: 'gold',
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    category: 'commodities',
    price: 2724.80,
    change24h: 1.12,
    high24h: 2735.00,
    low24h: 2698.00,
    volume24h: '$98B',
    marketCap: '$16.2T',
    candles: generateCandles(2695, 60, 0.004)
  },
  {
    id: 'oil',
    symbol: 'WTI/USD',
    name: 'Crude Oil WTI',
    category: 'commodities',
    price: 71.40,
    change24h: -1.85,
    high24h: 73.10,
    low24h: 70.80,
    volume24h: '$44B',
    marketCap: 'Energy Future',
    candles: generateCandles(72.8, 60, 0.012)
  },
  {
    id: 'silver',
    symbol: 'XAG/USD',
    name: 'Silver Spot',
    category: 'commodities',
    price: 33.45,
    change24h: 2.65,
    high24h: 33.90,
    low24h: 32.50,
    volume24h: '$26B',
    marketCap: '$1.88T',
    candles: generateCandles(32.5, 60, 0.008)
  }
];

export const INITIAL_BROKERS: Broker[] = [
  {
    id: 'alpaca',
    name: 'Alpaca Markets',
    code: 'ALPC-PRO',
    country: 'United States',
    status: 'connected',
    balance: 54200.00,
    currency: 'USD',
    latencyMs: 14,
    accountType: 'Paper Trading',
    apiKeyMask: 'PK_LIVE_••••••••789A',
    supportedAssets: ['stocks', 'crypto']
  },
  {
    id: 'zerodha',
    name: 'Zerodha Kite',
    code: 'ZKITE-IND',
    country: 'India',
    status: 'connected',
    balance: 24800.00,
    currency: 'USD',
    latencyMs: 38,
    accountType: 'Paper Trading',
    apiKeyMask: 'ZRD_PUB_••••••••412B',
    supportedAssets: ['stocks', 'forex', 'commodities']
  },
  {
    id: 'binance',
    name: 'Binance Global',
    code: 'BNCE-PRO',
    country: 'Global',
    status: 'connected',
    balance: 31500.00,
    currency: 'USDT',
    latencyMs: 22,
    accountType: 'Paper Trading',
    apiKeyMask: 'BN_API_••••••••902F',
    supportedAssets: ['crypto']
  },
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    code: 'IBKR-INST',
    country: 'United States',
    status: 'connected',
    balance: 108400.00,
    currency: 'USD',
    latencyMs: 19,
    accountType: 'Live Sandbox',
    apiKeyMask: 'IBKR_TWS_••••••••551D',
    supportedAssets: ['stocks', 'forex', 'commodities', 'crypto']
  },
  {
    id: 'mt5',
    name: 'MetaTrader 5',
    code: 'MT5-ECN',
    country: 'Cyprus / UK',
    status: 'disconnected',
    balance: 0.00,
    currency: 'USD',
    latencyMs: 45,
    accountType: 'Paper Trading',
    apiKeyMask: 'MT5_DEMO_••••••••0000',
    supportedAssets: ['forex', 'commodities']
  }
];

export const INITIAL_POSITIONS: Position[] = [
  {
    id: 'pos-1',
    assetId: 'nvda',
    symbol: 'NVDA',
    side: 'buy',
    orderType: 'market',
    entryPrice: 128.50,
    currentPrice: 138.25,
    amount: 150,
    totalCost: 19275.00,
    stopLoss: 124.00,
    takeProfit: 150.00,
    unrealizedPnl: 1462.50,
    unrealizedPnlPercent: 7.59,
    timestamp: Date.now() - 4 * 24 * 3600 * 1000,
    broker: 'Alpaca Markets',
    status: 'open',
    holdingPeriod: 'short_term',
    taxYear: 2026,
    fees: 4.50
  },
  {
    id: 'pos-2',
    assetId: 'btc',
    symbol: 'BTC/USD',
    side: 'buy',
    orderType: 'limit',
    entryPrice: 62400.00,
    currentPrice: 67840.00,
    amount: 0.65,
    totalCost: 40560.00,
    stopLoss: 60000.00,
    takeProfit: 72000.00,
    unrealizedPnl: 3536.00,
    unrealizedPnlPercent: 8.72,
    timestamp: Date.now() - 12 * 24 * 3600 * 1000,
    broker: 'Binance Global',
    status: 'open',
    holdingPeriod: 'short_term',
    taxYear: 2026,
    fees: 18.20
  },
  {
    id: 'pos-3',
    assetId: 'gold',
    symbol: 'XAU/USD',
    side: 'buy',
    orderType: 'market',
    entryPrice: 2680.00,
    currentPrice: 2724.80,
    amount: 10,
    totalCost: 26800.00,
    stopLoss: 2640.00,
    takeProfit: 2780.00,
    unrealizedPnl: 448.00,
    unrealizedPnlPercent: 1.67,
    timestamp: Date.now() - 2 * 24 * 3600 * 1000,
    broker: 'Interactive Brokers',
    status: 'open',
    holdingPeriod: 'short_term',
    taxYear: 2026,
    fees: 8.00
  },
  // Closed trades for immediate tax season demonstration
  {
    id: 'tax-closed-1',
    assetId: 'aapl',
    symbol: 'AAPL',
    side: 'buy',
    orderType: 'market',
    entryPrice: 185.00,
    currentPrice: 228.00,
    amount: 80,
    totalCost: 14800.00,
    unrealizedPnl: 0,
    unrealizedPnlPercent: 0,
    timestamp: Date.now() - 410 * 24 * 3600 * 1000, // > 1 year ago (Long-term)
    broker: 'Interactive Brokers',
    status: 'closed',
    exitPrice: 228.00,
    exitTimestamp: Date.now() - 18 * 24 * 3600 * 1000,
    realizedPnl: 3440.00,
    holdingPeriod: 'long_term',
    taxYear: 2026,
    fees: 3.50
  },
  {
    id: 'tax-closed-2',
    assetId: 'tsla',
    symbol: 'TSLA',
    side: 'buy',
    orderType: 'limit',
    entryPrice: 242.00,
    currentPrice: 215.00,
    amount: 60,
    totalCost: 14520.00,
    unrealizedPnl: 0,
    unrealizedPnlPercent: 0,
    timestamp: Date.now() - 45 * 24 * 3600 * 1000, // Short-term loss
    broker: 'Alpaca Markets',
    status: 'closed',
    exitPrice: 215.00,
    exitTimestamp: Date.now() - 8 * 24 * 3600 * 1000,
    realizedPnl: -1620.00,
    holdingPeriod: 'short_term',
    taxYear: 2026,
    fees: 2.80
  },
  {
    id: 'tax-closed-3',
    assetId: 'sol',
    symbol: 'SOL/USD',
    side: 'buy',
    orderType: 'market',
    entryPrice: 110.00,
    currentPrice: 148.00,
    amount: 50,
    totalCost: 5500.00,
    unrealizedPnl: 0,
    unrealizedPnlPercent: 0,
    timestamp: Date.now() - 32 * 24 * 3600 * 1000, // Short-term gain
    broker: 'Binance Global',
    status: 'closed',
    exitPrice: 148.00,
    exitTimestamp: Date.now() - 5 * 24 * 3600 * 1000,
    realizedPnl: 1900.00,
    holdingPeriod: 'short_term',
    taxYear: 2026,
    fees: 5.50
  }
];

export const WORLD_MARKET_INDICES: WorldMarketIndex[] = [
  {
    id: 'nyse',
    code: 'NYSE',
    name: 'New York Stock Exchange',
    city: 'New York',
    country: 'United States',
    region: 'Americas',
    lat: 40.7128,
    lng: -74.0060,
    value: 19842.60,
    change: 0.88,
    status: 'open',
    timezone: 'EST (UTC-5)',
    tradingHours: '09:30 - 16:00 EST',
    volumeToday: '$74.5B'
  },
  {
    id: 'nasdaq',
    code: 'NASDAQ',
    name: 'Nasdaq Composite',
    city: 'New York',
    country: 'United States',
    region: 'Americas',
    lat: 40.7589,
    lng: -73.9851,
    value: 18518.20,
    change: 1.24,
    status: 'open',
    timezone: 'EST (UTC-5)',
    tradingHours: '09:30 - 16:00 EST',
    volumeToday: '$88.2B'
  },
  {
    id: 'tsx',
    code: 'TSX',
    name: 'Toronto Stock Exchange',
    city: 'Toronto',
    country: 'Canada',
    region: 'Americas',
    lat: 43.6532,
    lng: -79.3832,
    value: 24712.10,
    change: 0.42,
    status: 'open',
    timezone: 'EST (UTC-5)',
    tradingHours: '09:30 - 16:00 EST',
    volumeToday: '$14.2B'
  },
  {
    id: 'b3',
    code: 'B3',
    name: 'Brasil Bolsa Balcão (Bovespa)',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'Americas',
    lat: -23.5505,
    lng: -46.6333,
    value: 131840.00,
    change: -0.65,
    status: 'open',
    timezone: 'BRT (UTC-3)',
    tradingHours: '10:00 - 17:00 BRT',
    volumeToday: '$5.4B'
  },
  {
    id: 'lse',
    code: 'LSE / FTSE',
    name: 'London Stock Exchange (FTSE 100)',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    lat: 51.5074,
    lng: -0.1278,
    value: 8295.40,
    change: 0.31,
    status: 'open',
    timezone: 'BST (UTC+1)',
    tradingHours: '08:00 - 16:30 BST',
    volumeToday: '$22.8B'
  },
  {
    id: 'dax',
    code: 'DAX 40',
    name: 'Frankfurt Stock Exchange',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'Europe',
    lat: 50.1109,
    lng: 8.6821,
    value: 19540.80,
    change: 0.58,
    status: 'open',
    timezone: 'CEST (UTC+2)',
    tradingHours: '09:00 - 17:30 CEST',
    volumeToday: '$19.4B'
  },
  {
    id: 'cac',
    code: 'CAC 40',
    name: 'Euronext Paris',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    lat: 48.8566,
    lng: 2.3522,
    value: 7578.60,
    change: -0.18,
    status: 'open',
    timezone: 'CEST (UTC+2)',
    tradingHours: '09:00 - 17:30 CEST',
    volumeToday: '$15.1B'
  },
  {
    id: 'nikkei',
    code: 'NIKKEI 225',
    name: 'Tokyo Stock Exchange',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia-Pacific',
    lat: 35.6762,
    lng: 139.6503,
    value: 39605.80,
    change: 1.15,
    status: 'closed',
    timezone: 'JST (UTC+9)',
    tradingHours: '09:00 - 15:00 JST',
    volumeToday: '$38.2B'
  },
  {
    id: 'hsi',
    code: 'HANG SENG',
    name: 'Hong Kong Stock Exchange',
    city: 'Hong Kong',
    country: 'Hong Kong',
    region: 'Asia-Pacific',
    lat: 22.3193,
    lng: 114.1694,
    value: 20638.70,
    change: -1.02,
    status: 'closed',
    timezone: 'HKT (UTC+8)',
    tradingHours: '09:30 - 16:00 HKT',
    volumeToday: '$26.7B'
  },
  {
    id: 'nifty',
    code: 'NIFTY 50',
    name: 'National Stock Exchange (NSE)',
    city: 'Mumbai',
    country: 'India',
    region: 'Asia-Pacific',
    lat: 19.0760,
    lng: 72.8777,
    value: 25127.90,
    change: 0.72,
    status: 'closed',
    timezone: 'IST (UTC+5:30)',
    tradingHours: '09:15 - 15:30 IST',
    volumeToday: '$21.5B'
  },
  {
    id: 'sse',
    code: 'SSE COMPOSITE',
    name: 'Shanghai Stock Exchange',
    city: 'Shanghai',
    country: 'China',
    region: 'Asia-Pacific',
    lat: 31.2304,
    lng: 121.4737,
    value: 3284.30,
    change: 1.60,
    status: 'closed',
    timezone: 'CST (UTC+8)',
    tradingHours: '09:30 - 15:00 CST',
    volumeToday: '$62.1B'
  },
  {
    id: 'asx',
    code: 'ASX 200',
    name: 'Australian Securities Exchange',
    city: 'Sydney',
    country: 'Australia',
    region: 'Asia-Pacific',
    lat: -33.8688,
    lng: 151.2093,
    value: 8252.80,
    change: 0.47,
    status: 'closed',
    timezone: 'AEST (UTC+10)',
    tradingHours: '10:00 - 16:00 AEST',
    volumeToday: '$8.9B'
  }
];
