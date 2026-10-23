# REALTRADE VIEW — Pro Trading Terminal & Portfolio Platform

An institutional-grade trading terminal and portfolio management platform designed for active traders. Delivers real-time multi-asset market analytics, customizable technical indicators, interactive simulated broker execution, an interactive global market world map, client-side AES-GCM encrypted persistence, WebAuthn biometric security, offline data entry queueing, tax reporting exports, and multi-rail subscription checkout.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions have been aligned based on user feedback:
> - **Asset Coverage**: Multi-Asset coverage spanning Global Equities, Crypto (BTC/ETH/USDT), Forex pairs, and Commodities with unified live telemetry simulation.
> - **Broker Connect & Execution**: Interactive paper trading with simulated high-fidelity broker sync (Alpaca, Zerodha, Binance, Interactive Brokers) featuring live order execution (Market, Limit, Stop-Loss, Take-Profit).
> - **Layout & Visual Density**: Pro TradingView multi-panel terminal layout with dockable chart controls, technical indicator ribbons, collapsible watchlists, and quick-order ticket dock.

- **Confirmed Decision 1 (Markets)**: Multi-asset support spanning US/Global Stocks, Cryptocurrencies, FX, and Commodities.
- **Confirmed Decision 2 (Brokers)**: Real-time paper trading engine with simulated multi-broker authentication and live portfolio reconciliation.
- **Confirmed Decision 3 (UX Theme)**: Pro dark mode interface with high-contrast tabular typography, interactive canvas charting, and responsive mobile bottom-sheet ergonomics.

---

## 1. Overview & Core Concept

- **What It Does**: REALTRADE VIEW provides traders with a real-time trading station and portfolio control room. Users can analyze candlestick and line charts across timeframes, overlay standard financial indicators (RSI, MACD, Bollinger Bands, EMA 20/50/200, Volume, ATR, SuperTrend), execute paper trades across connected brokers, monitor live global stock exchanges on an interactive world map, log trades offline with seamless encrypted syncing, unlock account access via biometrics, and export tax season capital-gain reports.
- **Target Audience / Persona**: Day traders, swing traders, crypto enthusiasts, and portfolio managers who require low-latency analytics, secure self-custodied encrypted trade logs, and cross-platform flexibility.
- **Key Value**: Combines the depth of TradingView charts, the portfolio oversight of Bloomberg terminals, and bank-grade privacy through client-side Web Crypto encryption and biometrics.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Trading Terminal & Charting**: User selects an asset from the searchable multi-market watchlist (Equities, Crypto, Forex, Commodities). The interactive multi-timeframe chart updates in real-time with tick simulations, candlestick drawing, crosshairs, and dynamic technical indicator overlays (RSI, MACD, Bollinger Bands, Volume, EMAs).
2. **Order Execution & Broker Connect**: The user connects or switches brokers (Alpaca, Zerodha, Binance, IBKR), sets order parameters (Market/Limit/SL/TP), and executes. Orders immediately reflect in Open Positions, Order History, and Realized/Unrealized P&L calculations.
3. **World Market Map**: The user views an interactive global market heat map highlighting open/closed statuses and live percentage trends across major stock exchanges (NYSE, NASDAQ, LSE, DAX, Nikkei, Hang Seng, NIFTY 50, ASX, B3). Clicking an exchange reveals top movers and macro volume.
4. **Offline Mode & Encrypted Storage**: If connectivity drops, an offline status indicator appears; the user can continue logging manual transactions or paper orders into an AES-GCM encrypted IndexedDB queue, which automatically syncs and verifies integrity upon reconnection.
5. **Biometric Security & Authentication**: Seamless Sign In / Sign Up with biometric WebAuthn prompt (with instant passcode fallback). Sensitive portfolio balances can be blurred with a Privacy Mode toggle.
6. **Subscription & Multi-Rail Checkout**: Users can explore Free, Pro Trader ($29/mo), and Institutional ($99/mo) tiers and pay via Credit/Debit Card, UPI (with QR & VPA), Crypto USDT/BTC, Net Banking, PayPal, or Bank Transfer.
7. **Tax & Trend Export**: One-click generation of IRS/HMRC-compliant CSV/JSON reports separating short-term and long-term capital gains, cost basis, transaction fees, and net profit.

### Visual Identity & Theme
- **Aesthetic Direction**: Professional financial terminal (inspired by TradingView Pro & Bloomberg Terminal), ultra-dark obsidian canvas, surgical visual hierarchy, zero visual clutter or cartoon badges.
- **Color Palette**:
  - Neutral Canvas: `#0a0d14` (Deep Trading Obsidian)
  - Surface & Panels: `#111622` (Graphite Plate), Border Hairline: `#1f293d`
  - Bullish / Profit Accent: `#10b981` (Vibrant Emerald)
  - Bearish / Loss Accent: `#f43f5e` (Precision Crimson)
  - Interactive Accent / Focus: `#00d2ff` (Cyber Blue)
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` font for sharp, authoritative section headers.
  - Body & Labels: `DM Sans` for high legibility at dense 12px–14px sizes.
  - Financial Data & Telemetry: `font-mono tabular-nums` (`JetBrains Mono` / monospace) strictly applied across all prices, percentage deltas, timestamps, and order books.
- **Component Styling & Layout**:
  - Full-width desktop terminal with collapsible watchlist on right, indicator toolbar on top, dockable order book / quick trade ticket on left/bottom.
  - Responsive mobile drawer and bottom navigation tabs for handheld trading.
  - Zero pill badges on static metadata; clean unboxed typography with typographic separators (`·` or `/`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Real-Time Price Engine Simulation**
  - *Chosen Approach*: Multi-frequency deterministic tick engine generating realistic geometric Brownian motion price fluctuations with volume spikes and candlestick formation for all 4 asset classes.
  - *Why*: Provides fluid, realistic live trading without external rate limits, API quotas, or latency hangs, ensuring instant responsiveness in web evaluation environments.
- **Decision 2: Security & Local Database Encryption**
  - *Chosen Approach*: Web Crypto API utilizing PBKDF2 key derivation and AES-GCM 256-bit encryption for all local portfolio logs, trade history, and custom alert thresholds stored in `localStorage` / `IndexedDB`.
  - *Why*: Guarantees zero sensitive portfolio data leaks even on shared computers, fully satisfying user privacy and local encryption criteria.
- **Decision 3: Biometric Authentication Integration**
  - *Chosen Approach*: Native WebAuthn API (`navigator.credentials.create` and `get`) with automatic graceful fallback to device PIN / passkey simulator when hardware authenticator is unavailable or in sandbox iframe.
  - *Why*: Delivers an authentic biometric experience across modern laptops and mobile phones without breaking in restricted sandbox environments.
- **Decision 4: Multi-Payment Gateway Flow**
  - *Chosen Approach*: Unified interactive checkout modal supporting instant simulation and validation for all requested methods: Crypto (USDT TRC20/ERC20 with simulated address generator), Credit/Debit Card (Luhn validation, CVC, expiry), UPI (dynamic QR code generation & VPA ID), Net Banking, PayPal, and Bank Transfer with instant receipt generation.
  - *Why*: Allows traders to test full subscription activation across all regional payment rails.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             REALTRADE VIEW CORE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Navigation: Brand · Asset Ticker Strip · Quick Metrics · Sync Status   │
│  Account Profile · Biometric Lock · Privacy Mask · Subscription Tier Button │
├───────────────────────────────┬─────────────────────────────────────────────┤
│  LEFT / MAIN STAGE            │  RIGHT SIDEBAR (COLLAPSIBLE)                │
│  ┌──────────────────────────┐ │  ┌────────────────────────────────────────┐ │
│  │ Active Asset Bar & Range │ │  │ Multi-Asset Watchlist                  │ │
│  │ (1M, 5M, 15M, 1H, 1D, 1W)│ │  │ - Stocks (AAPL, TSLA, NVDA, RELIANCE)  │ │
│  ├──────────────────────────┤ │  │ - Crypto (BTC, ETH, SOL, USDT)         │ │
│  │ Canvas Candlestick Chart │ │  │ - Forex (EUR/USD, GBP/USD, USD/JPY)    │ │
│  │ + Bollinger / EMA / MA   │ │  │ - Commodities (Gold, Oil, Silver)      │ │
│  ├──────────────────────────┤ │  ├────────────────────────────────────────┤ │
│  │ Secondary Indicator Pane │ │  │ Live Order Book / Depth Visualizer     │ │
│  │ (RSI, MACD, Volume, ATR) │ │  ├────────────────────────────────────────┤ │
│  ├──────────────────────────┤ │  │ Custom Price Alerts Desk               │ │
│  │ Trade Ticket / Broker Bar│ │  │ + Triggered Notifications Logs         │ │
│  └──────────────────────────┘ │  └────────────────────────────────────────┘ │
├───────────────────────────────┴─────────────────────────────────────────────┤
│  TABBED WORKSPACE VIEWPORT:                                                 │
│  [Chart Terminal] · [World Market Map] · [Portfolio & P&L] ·                │
│  [Tax & Audit Reports] · [Brokers Connect] · [Security & Encrypted Vault]   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
  ┌───────────────────────────┐                 ┌───────────────────────────┐
  │   Web Crypto AES-GCM 256  │                 │    Offline State Sync     │
  │   - Encrypted Vault Key   │                 │    - Queueing Pending     │
  │   - WebAuthn Biometrics   │                 │    - Auto-Reconciliation  │
  └───────────────────────────┘                 └───────────────────────────┘
```

### Key Data Entities
- **Asset**: `{ id, symbol, name, category: 'stocks'|'crypto'|'forex'|'commodities', price, change24h, high24h, low24h, volume, candles: Candle[] }`
- **Candle**: `{ timestamp, open, high, low, close, volume }`
- **Order / Position**: `{ id, assetId, symbol, type: 'buy'|'sell', orderType: 'market'|'limit', price, amount, stopLoss?, takeProfit?, timestamp, status: 'open'|'filled'|'closed', pnl, broker }`
- **Broker**: `{ id, name, logo, status: 'connected'|'disconnected', accountBalance, currency, latency }`
- **World Market Index**: `{ code, name, country, region, lat, lng, value, change, status: 'open'|'closed'|'pre-market' }`
- **Encrypted Vault**: `{ ciphertext, iv, salt, lastSynced, checksum }`
- **User Subscription**: `{ tier: 'free'|'pro'|'institutional', paymentMethod, expiresAt, features }`

---

## 5. Verification & Acceptance Criteria
- **Chart & Technical Indicators**: Real-time candlestick charts with active toggleable indicators (RSI, MACD, Bollinger Bands, Volume, EMAs) updating smoothly.
- **Broker Paper Execution**: Ability to connect brokers and submit buy/sell orders that update portfolio equity and positions in real-time.
- **World Market Heat Map**: Interactive global map displaying major stock exchanges worldwide with live status and trend metrics.
- **Encryption & Offline Resilience**: Data persisted with client-side AES-GCM encryption; simulated network offline toggle allows queueing and seamless reconnection reconciliation.
- **Biometric Security**: Biometric login simulation and screen lock protecting sensitive portfolio views.
- **Tax Season Export**: Working CSV and JSON exports formatting capital gains, fees, and trade histories.
- **Multi-Rail Checkout**: Working payment modal for Credit/Debit, UPI, USDT/Crypto, Net Banking, PayPal, and Bank Transfer with instant tier activation.
