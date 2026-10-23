import React, { useState } from 'react';
import { Asset, WorldMarketIndex, BillingCycle } from '../../types/trading';
import { NEWS_FEED, COMMUNITY_IDEAS, ECONOMIC_CALENDAR } from '../../data/tradingViewFeeds';
import { SUBSCRIPTION_TIERS_CONFIG, BILLING_CYCLES_CONFIG } from '../../data/subscriptionPlans';
import { LiveMarketNewsSidebar } from './LiveMarketNewsSidebar';
import { 
  LineChart, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Globe2, 
  Layers, 
  LayoutGrid, 
  ShieldCheck, 
  Zap, 
  Check, 
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Terminal,
  Clock,
  Download,
  Radio
} from 'lucide-react';
import { PWAInstallButton } from '../PWAInstallButton';

interface TradingViewHomepageProps {
  assets: Asset[];
  onOpenSupercharts: (assetId?: string) => void;
  onOpenSectors: () => void;
  onOpenWorldMap: () => void;
  onOpenWorldMonitor?: () => void;
  onOpenSubscription: () => void;
  onOpenBrokers: () => void;
  onOpenAuth: () => void;
  onOpenPublish?: () => void;
}

export const TradingViewHomepage: React.FC<TradingViewHomepageProps> = ({
  assets,
  onOpenSupercharts,
  onOpenSectors,
  onOpenWorldMap,
  onOpenWorldMonitor,
  onOpenSubscription,
  onOpenBrokers,
  onOpenAuth,
  onOpenPublish,
}) => {
  const [heroAssetId, setHeroAssetId] = useState<string>('nvda');
  const [marketTab, setMarketTab] = useState<'stocks' | 'crypto' | 'forex' | 'commodities'>('stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [homepageCycle, setHomepageCycle] = useState<BillingCycle>('monthly');

  const heroAsset = assets.find(a => a.id === heroAssetId) || assets[0];
  const marketFilteredAssets = assets.filter(a => a.category === marketTab);

  const topGainers = [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const topLosers = [...assets].sort((a, b) => a.change24h - b.change24h).slice(0, 4);

  return (
    <div className="flex flex-col w-full bg-[#080b12] text-slate-100 overflow-x-hidden select-none">
      {/* 1. Hero Section (TradingView signature: "Where the world does markets") */}
      <section className="relative px-4 sm:px-6 lg:px-12 pt-12 pb-20 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#00d2ff]/10 via-[#10b981]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111726] border border-[#1f293d] text-xs font-mono text-slate-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse"></span>
          <span>Look first / Then leap.</span>
          <span className="text-slate-500">·</span>
          <span className="text-[#00d2ff]">60M+ Traders Worldwide</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display max-w-4xl leading-[1.1] mb-6">
          Where the world does <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#10b981]">markets</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-sans mb-8 leading-relaxed">
          The highest-rated charting platform and social network for active traders and investors. Analyze candlestick patterns, run pine scripts, and execute paper trades globally.
        </p>

        {/* Global Search Omnibox */}
        <div className="w-full max-w-xl relative mb-10">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search symbols, stocks, crypto or ideas (e.g. NVDA, BTC, AAPL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const match = assets.find(a => a.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
                  onOpenSupercharts(match ? match.id : 'nvda');
                }
              }}
              className="w-full bg-[#0e1422] border border-[#1f293d] hover:border-slate-500 focus:border-[#00d2ff] rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 font-mono outline-none shadow-2xl transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              <span className="text-[11px] font-mono bg-[#162033] text-slate-400 px-2 py-1 rounded border border-[#1f293d]">
                Ctrl K
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-4 flex-wrap justify-center mb-16">
          <button
            onClick={() => onOpenSupercharts(heroAssetId)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold text-sm font-mono transition-all shadow-xl shadow-cyan-950/50 hover:scale-[1.02]"
          >
            <LineChart className="w-4 h-4" />
            <span>Launch Supercharts</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSectors}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#131b2a] hover:bg-[#1a2538] text-white border border-[#1f293d] hover:border-slate-600 text-sm font-mono transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-[#00d2ff]" />
            <span>Sector Heatmap</span>
          </button>

          <button
            onClick={onOpenWorldMap}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#131b2a] hover:bg-[#1a2538] text-white border border-[#1f293d] hover:border-slate-600 text-sm font-mono transition-all"
          >
            <Globe2 className="w-4 h-4 text-[#10b981]" />
            <span>World Market Map</span>
          </button>

          <button
            onClick={onOpenWorldMonitor}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#131b2a] hover:bg-[#1a2538] text-white border border-red-500/40 hover:border-red-400 text-sm font-mono transition-all group shadow-lg shadow-red-950/20"
          >
            <Radio className="w-4 h-4 text-red-400 group-hover:animate-pulse" />
            <span>World Monitor (OSINT)</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
              LIVE
            </span>
          </button>
        </div>

        {/* World Monitor Breaking OSINT Ticker Banner */}
        <div 
          onClick={onOpenWorldMonitor}
          className="w-full max-w-5xl mb-4 bg-gradient-to-r from-red-950/40 via-[#101726] to-cyan-950/40 border border-red-500/30 hover:border-red-400 p-3 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-xl"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 shrink-0">
              WORLD MONITOR ALERT
            </span>
            <p className="text-xs text-slate-300 font-mono truncate">
              Pentagon Pizza Index surge (+245%) & Red Sea maritime chokepoints active • 435+ global news feeds synced
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#00d2ff] group-hover:underline shrink-0">
            <span>Open Intelligence Radar</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* PWA App Store & Offline-Ready Quick Banner */}
        <div className="w-full max-w-5xl mb-6">
          <PWAInstallButton variant="banner" onOpenPublishModal={onOpenPublish} />
        </div>

        {/* 2. Live Interactive Hero Chart Card */}
        <div className="w-full bg-[#0c101a] border border-[#1f293d] rounded-2xl p-4 sm:p-6 shadow-2xl text-left font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f293d]">
            {/* Quick Hero Asset Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {['nvda', 'btc', 'aapl', 'gold', 'tsla', 'eurusd'].map(id => {
                const a = assets.find(x => x.id === id);
                if (!a) return null;
                const isSelected = heroAsset.id === id;

                return (
                  <button
                    key={id}
                    onClick={() => setHeroAssetId(id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#182236] text-[#00d2ff] font-bold border border-[#00d2ff]/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#121927]'
                    }`}
                  >
                    <span>{a.symbol}</span>
                    <span className={a.change24h >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}>
                      {a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(1)}%
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onOpenSupercharts(heroAsset.id)}
              className="flex items-center gap-1.5 text-xs text-[#00d2ff] hover:underline"
            >
              <span>Open in Supercharts</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hero Live Quotes */}
          <div className="flex items-baseline gap-4 py-4">
            <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
              ${heroAsset.price < 10 ? heroAsset.price.toFixed(4) : heroAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-base font-semibold flex items-center tabular-nums ${
              heroAsset.change24h >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'
            }`}>
              {heroAsset.change24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1 inline" /> : <TrendingDown className="w-4 h-4 mr-1 inline" />}
              {heroAsset.change24h >= 0 ? '+' : ''}{heroAsset.change24h.toFixed(2)}% Today
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Market Cap: {heroAsset.marketCap} · 24h Vol: {heroAsset.volume24h}
            </span>
          </div>

          {/* Live SVG Sparkline / Mini Chart */}
          <div className="w-full h-44 sm:h-56 relative bg-[#070a10] rounded-xl border border-[#172030] p-3 overflow-hidden">
            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Candles / Line Path */}
              {(() => {
                const c = heroAsset.candles;
                if (!c || c.length === 0) return null;
                const min = Math.min(...c.map(x => x.low));
                const max = Math.max(...c.map(x => x.high));
                const range = (max - min) || 1;
                const step = 800 / (c.length - 1);

                const points = c.map((bar, i) => {
                  const x = i * step;
                  const y = 180 - ((bar.close - min) / range) * 160;
                  return `${x},${y}`;
                });

                const lineD = `M ${points.join(' L ')}`;
                const areaD = `${lineD} L 800,200 L 0,200 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#heroGrad)" />
                    <path d={lineD} fill="none" stroke="#00d2ff" strokeWidth="2.5" />
                  </>
                );
              })()}
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono">
              Real-time tick engine running · 5-minute intervals
            </div>
          </div>
        </div>
      </section>

      {/* 3. Market Overview & Live Market News Sidebar Layout */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 max-w-7xl mx-auto w-full border-t border-[#1f293d]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Section: Markets at a Glance & Top Movers (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            {/* Markets at a Glance Header & Selector */}
            <div className="bg-[#0c101a] border border-[#1f293d] rounded-2xl p-5 sm:p-6 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Markets at a Glance
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    Real-time quotes, technical volumes, and valuations across major global exchanges.
                  </p>
                </div>

                {/* Market Category Selector */}
                <div className="flex items-center gap-1 bg-[#101625] p-1 rounded-xl border border-[#1f293d] text-xs">
                  {(['stocks', 'crypto', 'forex', 'commodities'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMarketTab(cat)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        marketTab === cat
                          ? 'bg-[#182236] text-[#00d2ff] font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {marketFilteredAssets.map(asset => {
                  const isUp = asset.change24h >= 0;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => onOpenSupercharts(asset.id)}
                      className="p-4 rounded-xl bg-[#080b12] border border-[#172030] hover:border-[#00d2ff] hover:bg-[#101625] transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-white text-base group-hover:text-[#00d2ff] transition-colors">
                            {asset.symbol}
                          </span>
                          <span className={`text-xs font-semibold tabular-nums ${isUp ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                            {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate mb-3 font-sans">
                          {asset.name}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#141b29] flex items-baseline justify-between text-xs">
                        <span className="text-base font-bold text-slate-100 tabular-nums">
                          ${asset.price < 10 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">
                          Vol {asset.volume24h}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Gainers & Losers Bento Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {/* Top Gainers */}
              <div className="p-5 bg-[#0c101a] border border-[#1f293d] rounded-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#1f293d] mb-3">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2 text-[#10b981]">
                    <TrendingUp className="w-4 h-4" /> Top Market Gainers
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">24H High</span>
                </div>
                <div className="space-y-1.5">
                  {topGainers.map(g => (
                    <div
                      key={g.id}
                      onClick={() => onOpenSupercharts(g.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#141d2d] cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white text-xs">{g.symbol}</span>
                        <span className="text-slate-400 text-[10px] block font-sans truncate max-w-[120px]">{g.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">${g.price}</span>
                        <span className="text-xs font-bold text-[#10b981] tabular-nums">+{g.change24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Losers */}
              <div className="p-5 bg-[#0c101a] border border-[#1f293d] rounded-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#1f293d] mb-3">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2 text-[#f43f5e]">
                    <TrendingDown className="w-4 h-4" /> Top Pullbacks
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Oversold</span>
                </div>
                <div className="space-y-1.5">
                  {topLosers.map(l => (
                    <div
                      key={l.id}
                      onClick={() => onOpenSupercharts(l.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#141d2d] cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white text-xs">{l.symbol}</span>
                        <span className="text-slate-400 text-[10px] block font-sans truncate max-w-[120px]">{l.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">${l.price}</span>
                        <span className="text-xs font-bold text-[#f43f5e] tabular-nums">{l.change24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Live Market News Sidebar (4 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
            <LiveMarketNewsSidebar onOpenSupercharts={onOpenSupercharts} />
          </div>
        </div>
      </section>

      {/* 5. Community Ideas & Technical Setups */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 max-w-7xl mx-auto w-full border-t border-[#1f293d]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Trade Ideas & Market Setups
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curated technical analyses, Elliott wave counts, and harmonic patterns from top community analysts.
            </p>
          </div>

          <button
            onClick={() => onOpenSupercharts()}
            className="text-xs text-[#00d2ff] hover:underline font-mono hidden sm:inline"
          >
            Explore all setups →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {COMMUNITY_IDEAS.map(idea => (
            <div
              key={idea.id}
              onClick={() => onOpenSupercharts(idea.symbol.toLowerCase().replace('/', ''))}
              className="p-5 rounded-2xl bg-[#0c101a] border border-[#1f293d] hover:border-[#00d2ff] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#182236] text-[#00d2ff] flex items-center justify-center font-bold text-[10px]">
                      {idea.author.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-slate-300 font-bold">{idea.author}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    idea.bias === 'Long' ? 'bg-emerald-950 text-[#10b981]' : 'bg-rose-950 text-[#f43f5e]'
                  }`}>
                    {idea.bias}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm mb-2 leading-snug">
                  {idea.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {idea.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#172030] flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-bold text-[#00d2ff]">{idea.symbol}</span>
                <div className="flex items-center gap-3">
                  <span>❤️ {idea.likes}</span>
                  <span>💬 {idea.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Verified Broker Connections */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 max-w-7xl mx-auto w-full border-t border-[#1f293d]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Trade Directly via Integrated Brokers
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect your favorite broker accounts for sub-millisecond execution directly from Supercharts.
            </p>
          </div>

          <button
            onClick={onOpenBrokers}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#141b2b] hover:bg-[#1a2336] text-[#00d2ff] border border-[#00d2ff]/40 rounded-xl text-xs font-mono transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Connect Broker Gateway</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
          {[
            { name: 'Alpaca Markets', code: 'US Equities', latency: '14ms', status: 'Connected' },
            { name: 'Zerodha Kite', code: 'NSE/BSE India', latency: '38ms', status: 'Connected' },
            { name: 'Binance Global', code: 'Crypto & Futures', latency: '22ms', status: 'Connected' },
            { name: 'Interactive Brokers', code: 'Global Multi-Asset', latency: '19ms', status: 'Connected' },
            { name: 'MetaTrader 5', code: 'Forex & CFD', latency: '45ms', status: 'Available' },
          ].map(broker => (
            <div key={broker.name} className="p-3.5 bg-[#0c101a] border border-[#1f293d] rounded-xl text-center">
              <h5 className="font-bold text-white text-xs mb-1">{broker.name}</h5>
              <span className="text-[10px] text-slate-500 block mb-2">{broker.code}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                {broker.latency} · {broker.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TradingView Pricing Tiers with 5 Duration Cycles */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full border-t border-[#1f293d]">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-3">
            <Zap className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>5 DURATION PASSES: WEEKLY TO ANNUAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mb-3">
            Trading plans for every ambition.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Choose your flexible trading rhythm: weekly passes, monthly agility, 3-month & 6-month seasonal packages, or the maximum-discount annual VIP license.
          </p>
        </div>

        {/* 5 Duration Tabs Switcher */}
        <div className="flex justify-center mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-[#0c101a] border border-[#1f293d] rounded-2xl max-w-2xl w-full">
            {BILLING_CYCLES_CONFIG.map(cycle => (
              <button
                key={cycle.id}
                onClick={() => setHomepageCycle(cycle.id)}
                className={`px-3 py-2 rounded-xl text-center font-mono text-xs transition-all relative ${
                  homepageCycle === cycle.id
                    ? 'bg-[#00d2ff] text-slate-950 font-bold shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-white hover:bg-[#162136]'
                }`}
              >
                {cycle.badge && (
                  <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.2 rounded-full font-bold whitespace-nowrap shadow-sm ${
                    homepageCycle === cycle.id
                      ? 'bg-slate-950 text-cyan-300 border border-cyan-800'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {cycle.badge}
                  </span>
                )}
                <div className="font-semibold text-[11px] sm:text-xs">{cycle.shortLabel}</div>
                <div className={`text-[9px] ${homepageCycle === cycle.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {cycle.days} Days
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4 Plans Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
          {SUBSCRIPTION_TIERS_CONFIG.map(tier => {
            const price = tier.pricing[homepageCycle];
            const activeCycle = BILLING_CYCLES_CONFIG.find(c => c.id === homepageCycle) || BILLING_CYCLES_CONFIG[1];

            return (
              <div
                key={tier.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between relative transition-all ${
                  tier.popular
                    ? 'bg-[#0e1526] border-2 border-[#00d2ff] shadow-2xl shadow-cyan-950/40 ring-1 ring-[#00d2ff]/40'
                    : 'bg-[#0c101a] border-[#1f293d] hover:border-slate-600'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-[#00d2ff] text-slate-950 font-bold text-[10px] uppercase">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-white block mb-1">
                    {tier.name}
                  </span>
                  <div className="text-3xl font-bold text-white my-2">
                    ${price} <span className="text-xs text-slate-500 font-normal">{activeCycle.periodLabel}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mb-4 min-h-[32px] leading-tight">
                    {tier.description}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onOpenSubscription}
                  className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1 ${
                    tier.popular
                      ? 'bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 shadow-lg shadow-cyan-950/50'
                      : tier.id === 'institutional'
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'
                      : tier.id === 'free'
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-[#182338] hover:bg-[#202e48] text-[#00d2ff] border border-[#243452]'
                  }`}
                >
                  <span>{tier.id === 'free' ? 'Start Free' : `Get ${tier.name}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Institutional Footer (TradingView style) */}
      <footer className="border-t border-[#1f293d] bg-[#070a10] px-4 sm:px-6 lg:px-12 py-12 text-xs font-sans text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 pb-10 border-b border-[#172030]">
          <div>
            <span className="font-bold text-white uppercase text-[11px] block mb-3 font-mono">Products</span>
            <ul className="space-y-2">
              <li><button onClick={() => onOpenSupercharts()} className="hover:text-white">Supercharts</button></li>
              <li><button onClick={onOpenSectors} className="hover:text-white">Sector Heatmaps</button></li>
              <li><button onClick={onOpenWorldMap} className="hover:text-white">World Market Map</button></li>
              <li><button onClick={() => onOpenSupercharts()} className="hover:text-white">Pine Script Editor</button></li>
              <li><button onClick={() => onOpenSupercharts()} className="hover:text-white">Stock Screener</button></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase text-[11px] block mb-3 font-mono">Community</span>
            <ul className="space-y-2">
              <li><button onClick={() => onOpenSupercharts()} className="hover:text-white">Trade Ideas</button></li>
              <li><button onClick={() => onOpenSupercharts()} className="hover:text-white">Community Scripts</button></li>
              <li><button onClick={() => onOpenSupercharts()} className="hover:text-white">House Rules</button></li>
              <li><button onClick={() => onOpenSupercharts()} className="hover:text-white">Moderators</button></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase text-[11px] block mb-3 font-mono">Markets</span>
            <ul className="space-y-2">
              <li><button onClick={() => onOpenSupercharts('aapl')} className="hover:text-white">US Stocks</button></li>
              <li><button onClick={() => onOpenSupercharts('btc')} className="hover:text-white">Cryptocurrency</button></li>
              <li><button onClick={() => onOpenSupercharts('eurusd')} className="hover:text-white">Forex Pairs</button></li>
              <li><button onClick={() => onOpenSupercharts('gold')} className="hover:text-white">Commodities & Futures</button></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase text-[11px] block mb-3 font-mono">Brokers & Security</span>
            <ul className="space-y-2">
              <li><button onClick={onOpenBrokers} className="hover:text-white">Alpaca Integration</button></li>
              <li><button onClick={onOpenBrokers} className="hover:text-white">Zerodha Kite Sync</button></li>
              <li><button onClick={onOpenBrokers} className="hover:text-white">Interactive Brokers</button></li>
              <li><button onClick={onOpenSubscription} className="hover:text-white">AES-GCM Encryption</button></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase text-[11px] block mb-3 font-mono">Apps & Access</span>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Experience responsive trading across web, tablet, iOS and Android with cloud synchronization.
            </p>
            <div className="flex flex-col gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-1 bg-[#111726] rounded border border-[#1f293d] text-slate-300">📱 Mobile & PWA Ready</span>
              <span className="px-2 py-1 bg-[#111726] rounded border border-[#1f293d] text-slate-300">💻 Desktop Terminal</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            REALTRADE VIEW © 2026 · Look first / Then leap.
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Risk Disclosure</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
