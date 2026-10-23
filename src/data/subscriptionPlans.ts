import { BillingCycle, SubscriptionTier } from '../types/trading';

export interface PlanPricing {
  weekly: number;
  monthly: number;
  '3months': number;
  '6months': number;
  yearly: number;
}

export interface PlanTierConfig {
  id: SubscriptionTier;
  name: string;
  badge?: string;
  popular?: boolean;
  highlightColor: string;
  description: string;
  pricing: PlanPricing;
  features: string[];
  limits: {
    chartsPerLayout: number | string;
    indicatorsPerChart: number | string;
    alerts: number | string;
    brokersConnected: number | string;
    barReplay: boolean;
    orderBookDepth: string;
    pineScriptEditor: boolean;
    taxReportingCSV: boolean;
    vipExecution: boolean;
  };
}

export const BILLING_CYCLES_CONFIG: {
  id: BillingCycle;
  name: string;
  shortLabel: string;
  periodLabel: string;
  days: number;
  badge?: string;
  discountText?: string;
}[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    shortLabel: 'Weekly',
    periodLabel: '/week',
    days: 7,
    badge: 'Short Term',
    discountText: '7-Day Full Access'
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    shortLabel: 'Monthly',
    periodLabel: '/mo',
    days: 30,
    badge: 'Flexible',
    discountText: 'Standard 30 Days'
  },
  {
    id: '3months',
    name: '3 Months (Quarterly)',
    shortLabel: '3 Months',
    periodLabel: '/3 mos',
    days: 90,
    badge: 'Save 10%',
    discountText: 'Quarterly Discount'
  },
  {
    id: '6months',
    name: '6 Months (Semi-Annual)',
    shortLabel: '6 Months',
    periodLabel: '/6 mos',
    days: 180,
    badge: 'Save 15%',
    discountText: 'Popular Semi-Annual'
  },
  {
    id: 'yearly',
    name: 'Yearly (Annual)',
    shortLabel: 'Yearly',
    periodLabel: '/yr',
    days: 365,
    badge: 'Save 25% • 2 Mos Free',
    discountText: 'Best Value • 2 Months Free'
  }
];

export const SUBSCRIPTION_TIERS_CONFIG: PlanTierConfig[] = [
  {
    id: 'free',
    name: 'Free Basic',
    highlightColor: '#64748b',
    description: 'Essential real-time charts and paper trading for beginners.',
    pricing: {
      weekly: 0,
      monthly: 0,
      '3months': 0,
      '6months': 0,
      yearly: 0
    },
    features: [
      'Basic Candlestick & Line Charts',
      '1 Chart Layout per View',
      'Up to 3 Active Technical Indicators',
      '1 Paper Trading Broker Bridge',
      '3 Custom Price Alerts',
      'End-of-day market summaries'
    ],
    limits: {
      chartsPerLayout: 1,
      indicatorsPerChart: 3,
      alerts: 3,
      brokersConnected: 1,
      barReplay: false,
      orderBookDepth: 'Level 1 (Top of book)',
      pineScriptEditor: false,
      taxReportingCSV: false,
      vipExecution: false
    }
  },
  {
    id: 'pro',
    name: 'Pro Trader',
    popular: true,
    badge: 'Most Popular',
    highlightColor: '#00d2ff',
    description: 'Complete technical indicator suite, multi-chart grids, and broker sync.',
    pricing: {
      weekly: 9,
      monthly: 29,
      '3months': 78,    // $26/mo (Save 10%)
      '6months': 148,   // $24.6/mo (Save 15%)
      yearly: 261       // $21.75/mo (Save 25%)
    },
    features: [
      'All 10+ Technical Indicators (EMA, RSI, MACD, BB, SuperTrend)',
      '4 Charts per Layout Grid',
      'Unlimited Audio-Chime Price Alerts',
      '5 Connected Brokers (Alpaca, Zerodha, Binance, IBKR)',
      'Bar Replay Historical Market Simulator',
      'IRS Form 8949 Tax CSV Reports & Gain Audits'
    ],
    limits: {
      chartsPerLayout: 4,
      indicatorsPerChart: 'Unlimited',
      alerts: 'Unlimited',
      brokersConnected: 5,
      barReplay: true,
      orderBookDepth: 'Level 2 Depth (10 Bids/Asks)',
      pineScriptEditor: true,
      taxReportingCSV: true,
      vipExecution: false
    }
  },
  {
    id: 'pro_plus',
    name: 'Pro+ Advanced',
    highlightColor: '#38bdf8',
    description: 'High-frequency traders needing multi-monitor grids and deep volume analytics.',
    pricing: {
      weekly: 18,
      monthly: 59,
      '3months': 159,   // $53/mo (Save 10%)
      '6months': 299,   // $49.8/mo (Save 15%)
      yearly: 529       // $44/mo (Save 25%)
    },
    features: [
      '8 Charts per Layout Grid',
      'Pine Script Custom Editor & Strategy Backtester',
      'Tick-by-Tick High Frequency Data Feeds',
      '10 Connected Brokers & Multi-Routing',
      'Volume Profile & Heatmap Market Breadth',
      'Export unlimited historical tick CSVs'
    ],
    limits: {
      chartsPerLayout: 8,
      indicatorsPerChart: 'Unlimited',
      alerts: 'Unlimited Fast Push',
      brokersConnected: 10,
      barReplay: true,
      orderBookDepth: 'Full L2 Depth (25 Bids/Asks)',
      pineScriptEditor: true,
      taxReportingCSV: true,
      vipExecution: false
    }
  },
  {
    id: 'institutional',
    name: 'Institutional VIP',
    badge: 'Enterprise Tier',
    highlightColor: '#a855f7',
    description: 'Ultra-low latency sub-millisecond FIX gateway with client-side AES-GCM encrypted vaults.',
    pricing: {
      weekly: 32,
      monthly: 99,
      '3months': 267,   // $89/mo (Save 10%)
      '6months': 499,   // $83/mo (Save 16%)
      yearly: 889       // $74/mo (Save 25%)
    },
    features: [
      'Unlimited Charts per Layout & Multi-Screen Workspace',
      'Sub-millisecond FIX Protocol Trading Gateway',
      'Client-side AES-GCM 256-bit Encrypted Private Vault',
      'Unlimited Institutional Broker Connections',
      'Level 3 Order Book & Dark Pool Liquidity Telemetry',
      'Dedicated 24/7 VIP Quant Support & Custom Webhooks'
    ],
    limits: {
      chartsPerLayout: 'Unlimited',
      indicatorsPerChart: 'Unlimited',
      alerts: 'Zero-Latency Webhook',
      brokersConnected: 'Unlimited',
      barReplay: true,
      orderBookDepth: 'Level 3 Depth + Dark Pools',
      pineScriptEditor: true,
      taxReportingCSV: true,
      vipExecution: true
    }
  }
];

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', rate: 0.77, label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', rate: 84.0, label: 'INR (₹)' },
  { code: 'USDT', symbol: '₮', rate: 1.0, label: 'USDT (₮)' }
];
