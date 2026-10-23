export type AssetCategory = 'all' | 'stocks' | 'crypto' | 'forex' | 'commodities';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: 'stocks' | 'crypto' | 'forex' | 'commodities';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
  candles: Candle[];
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export type ChartType = 'candles' | 'line' | 'area';

export interface TechnicalIndicatorConfig {
  showEMA20: boolean;
  showEMA50: boolean;
  showEMA200: boolean;
  showBollinger: boolean;
  showRSI: boolean;
  showMACD: boolean;
  showVolume: boolean;
  showATR: boolean;
  showSuperTrend: boolean;
}

export type OrderType = 'market' | 'limit';
export type OrderSide = 'buy' | 'sell';

export interface Position {
  id: string;
  assetId: string;
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  entryPrice: number;
  currentPrice: number;
  amount: number;
  totalCost: number;
  stopLoss?: number;
  takeProfit?: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  timestamp: number;
  broker: string;
  status: 'open' | 'closed';
  exitPrice?: number;
  exitTimestamp?: number;
  realizedPnl?: number;
  holdingPeriod: 'short_term' | 'long_term';
  taxYear: number;
  fees: number;
}

export interface PriceAlert {
  id: string;
  assetId: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggered: boolean;
  triggeredAt?: number;
  note?: string;
}

export interface Broker {
  id: string;
  name: string;
  code: string;
  country: string;
  status: 'connected' | 'disconnected';
  balance: number;
  currency: string;
  latencyMs: number;
  accountType: 'Paper Trading' | 'Live Sandbox';
  apiKeyMask: string;
  supportedAssets: ('stocks' | 'crypto' | 'forex' | 'commodities')[];
  description?: string;
  type?: string;
}

export interface WorldMarketIndex {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Global';
  lat: number;
  lng: number;
  value: number;
  change: number;
  status: 'open' | 'closed' | 'pre-market';
  timezone: string;
  tradingHours: string;
  volumeToday: string;
}

export type BillingCycle = 'weekly' | 'monthly' | '3months' | '6months' | 'yearly';

export type SubscriptionTier = 'free' | 'pro' | 'pro_plus' | 'institutional';

export type PaymentMethod = 
  | 'crypto_usdt' 
  | 'credit_card' 
  | 'debit_card' 
  | 'net_banking' 
  | 'upi' 
  | 'paypal' 
  | 'bank_transfer';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  tier: SubscriptionTier;
  billingCycle?: BillingCycle;
  subscriptionExpiresAt?: number;
  biometricRegistered: boolean;
  encryptedVaultActive: boolean;
  isOfflineMode: boolean;
  cashBalance: number;
  createdAt: number;
  lastSyncTimestamp: number;
}

