import React, { useState } from 'react';
import { 
  Bookmark, 
  Bell, 
  Newspaper, 
  ListTree, 
  Flame, 
  CalendarDays, 
  MessageSquare, 
  Layers, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Gauge
} from 'lucide-react';
import { Asset, PriceAlert, Position, Broker } from '../../types/trading';
import { NEWS_FEED, ECONOMIC_CALENDAR, COMMUNITY_IDEAS } from '../../data/tradingViewFeeds';
import { Watchlist } from '../Watchlist';
import { OrderBook } from '../OrderBook';
import { OrderTicket } from '../OrderTicket';
import { TechnicalGauge } from './TechnicalGauge';

export type RightWidgetType = 
  | 'watchlist' 
  | 'orderticket'
  | 'alerts' 
  | 'technicals'
  | 'news' 
  | 'datawindow' 
  | 'hotlists' 
  | 'calendar' 
  | 'ideas' 
  | 'orderbook';

interface RightWidgetBarProps {
  activeWidget: RightWidgetType | null;
  setActiveWidget: (widget: RightWidgetType | null) => void;
  assets: Asset[];
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  alerts: PriceAlert[];
  onOpenAlertModal: (asset: Asset) => void;
  positions: Position[];
  brokers?: Broker[];
  onExecuteTrade?: (position: Omit<Position, 'id' | 'timestamp' | 'unrealizedPnl' | 'unrealizedPnlPercent' | 'status' | 'holdingPeriod' | 'taxYear'>) => void;
  cashBalance?: number;
}

export const RightWidgetBar: React.FC<RightWidgetBarProps> = ({
  activeWidget,
  setActiveWidget,
  assets,
  selectedAsset,
  onSelectAsset,
  alerts,
  onOpenAlertModal,
  positions,
  brokers = [],
  onExecuteTrade,
  cashBalance = 50000,
}) => {
  const widgets = [
    { id: 'watchlist' as RightWidgetType, icon: Bookmark, title: 'Watchlist & Details' },
    { id: 'orderticket' as RightWidgetType, icon: Zap, title: 'Order Execution Ticket' },
    { id: 'alerts' as RightWidgetType, icon: Bell, title: 'Alerts Manager' },
    { id: 'technicals' as RightWidgetType, icon: Gauge, title: 'Technical Analysis Gauge' },
    { id: 'news' as RightWidgetType, icon: Newspaper, title: 'Breaking News Feed' },
    { id: 'datawindow' as RightWidgetType, icon: ListTree, title: 'Data Window' },
    { id: 'hotlists' as RightWidgetType, icon: Flame, title: 'Hotlists & Movers' },
    { id: 'calendar' as RightWidgetType, icon: CalendarDays, title: 'Economic Calendar' },
    { id: 'ideas' as RightWidgetType, icon: MessageSquare, title: 'Community Ideas' },
    { id: 'orderbook' as RightWidgetType, icon: Layers, title: 'Order Book (DOM)' },
  ];

  const handleToggleWidget = (id: RightWidgetType) => {
    setActiveWidget(activeWidget === id ? null : id);
  };

  const topGainers = [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const topLosers = [...assets].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

  return (
    <div className="flex h-full shrink-0 z-30 select-none">
      {/* Expanded Widget Drawer */}
      {activeWidget && (
        <div className="w-80 lg:w-88 bg-[#0c101a] border-l border-[#1f293d] flex flex-col h-full overflow-hidden text-xs font-sans animate-fadeIn">
          {/* Drawer Header */}
          <div className="h-10 px-3 bg-[#0f1422] border-b border-[#1f293d] flex items-center justify-between font-mono">
            <span className="font-bold text-white text-xs">
              {widgets.find(w => w.id === activeWidget)?.title}
            </span>
            <button
              onClick={() => setActiveWidget(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto">
            {activeWidget === 'watchlist' && (
              <Watchlist
                assets={assets}
                selectedAssetId={selectedAsset.id}
                onSelectAsset={onSelectAsset}
                onSetAlert={onOpenAlertModal}
              />
            )}

            {activeWidget === 'orderticket' && (
              <div className="p-3">
                <OrderTicket
                  asset={selectedAsset}
                  brokers={brokers}
                  onExecuteTrade={onExecuteTrade || (() => {})}
                  cashBalance={cashBalance}
                />
              </div>
            )}

            {activeWidget === 'technicals' && (
              <div className="p-1">
                <TechnicalGauge asset={selectedAsset} />
              </div>
            )}

            {activeWidget === 'alerts' && (
              <div className="p-3 space-y-3 font-mono">
                <button
                  onClick={() => onOpenAlertModal(selectedAsset)}
                  className="w-full py-2 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold rounded text-xs transition-colors"
                >
                  + Create Alert on {selectedAsset.symbol}
                </button>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase block">Active Trigger Watch ({alerts.length})</span>
                  {alerts.map(a => (
                    <div key={a.id} className="p-2.5 rounded bg-[#111726] border border-[#1f293d] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{a.symbol}</span>
                        <span className={`text-[11px] block ${a.direction === 'above' ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                          {a.direction === 'above' ? '≥' : '≤'} ${a.targetPrice}
                        </span>
                        {a.note && <span className="text-[10px] text-slate-400">{a.note}</span>}
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                        a.triggered ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {a.triggered ? 'Triggered' : 'Armed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeWidget === 'news' && (
              <div className="p-3 space-y-2.5 font-sans">
                {NEWS_FEED.map(news => (
                  <div key={news.id} className="p-2.5 rounded bg-[#111726] border border-[#1f293d] hover:border-slate-600 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>{news.source}</span>
                      <span>{news.timeAgo}</span>
                    </div>
                    <h5 className="font-semibold text-slate-200 text-xs leading-snug hover:text-[#00d2ff] transition-colors">
                      {news.headline}
                    </h5>
                    <div className="flex items-center gap-1.5 mt-2">
                      {news.relatedSymbols.map(sym => (
                        <span key={sym} className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-[#00d2ff]">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeWidget === 'datawindow' && (
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="pb-3 border-b border-[#1f293d]">
                  <h4 className="font-bold text-white text-sm">{selectedAsset.symbol}</h4>
                  <span className="text-slate-400 text-[11px]">{selectedAsset.name}</span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-[#141c2c]">
                    <span className="text-slate-500">Last Price</span>
                    <span className="text-white font-bold">${selectedAsset.price}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#141c2c]">
                    <span className="text-slate-500">24h High</span>
                    <span className="text-slate-200">${selectedAsset.high24h}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#141c2c]">
                    <span className="text-slate-500">24h Low</span>
                    <span className="text-slate-200">${selectedAsset.low24h}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#141c2c]">
                    <span className="text-slate-500">24h Volume</span>
                    <span className="text-slate-200">{selectedAsset.volume24h}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#141c2c]">
                    <span className="text-slate-500">Market Cap</span>
                    <span className="text-slate-200">{selectedAsset.marketCap}</span>
                  </div>
                </div>
              </div>
            )}

            {activeWidget === 'hotlists' && (
              <div className="p-3 space-y-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1 text-[#10b981]">
                    <TrendingUp className="w-3.5 h-3.5" /> Top Gainers
                  </span>
                  <div className="space-y-1">
                    {topGainers.map(g => (
                      <div 
                        key={g.id} 
                        onClick={() => onSelectAsset(g)}
                        className="flex items-center justify-between p-2 rounded bg-[#111726] hover:bg-[#141d2d] cursor-pointer"
                      >
                        <span className="font-bold text-white">{g.symbol}</span>
                        <span className="text-[#10b981] font-semibold tabular-nums">+{g.change24h.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1 text-[#f43f5e]">
                    <TrendingDown className="w-3.5 h-3.5" /> Top Losers
                  </span>
                  <div className="space-y-1">
                    {topLosers.map(l => (
                      <div 
                        key={l.id} 
                        onClick={() => onSelectAsset(l)}
                        className="flex items-center justify-between p-2 rounded bg-[#111726] hover:bg-[#141d2d] cursor-pointer"
                      >
                        <span className="font-bold text-white">{l.symbol}</span>
                        <span className="text-[#f43f5e] font-semibold tabular-nums">{l.change24h.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeWidget === 'calendar' && (
              <div className="p-3 space-y-2 font-mono text-xs">
                {ECONOMIC_CALENDAR.map(ev => (
                  <div key={ev.id} className="p-2.5 rounded bg-[#111726] border border-[#1f293d]">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-[#00d2ff]">{ev.country} · {ev.time}</span>
                      <span className={`px-1 rounded uppercase font-semibold ${
                        ev.impact === 'high' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {ev.impact}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-200 text-xs">{ev.event}</div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 mt-2">
                      <div>Act: <span className="text-white">{ev.actual || '—'}</span></div>
                      <div>Frc: <span className="text-slate-300">{ev.forecast || '—'}</span></div>
                      <div>Prev: <span className="text-slate-400">{ev.previous || '—'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeWidget === 'ideas' && (
              <div className="p-3 space-y-3 font-sans">
                {COMMUNITY_IDEAS.map(idea => (
                  <div key={idea.id} className="p-3 rounded bg-[#111726] border border-[#1f293d]">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span className="font-bold text-slate-300">{idea.author}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[10px] ${
                        idea.bias === 'Long' ? 'bg-emerald-950 text-[#10b981]' : 'bg-rose-950 text-[#f43f5e]'
                      }`}>
                        {idea.bias}
                      </span>
                    </div>
                    <h5 className="font-semibold text-white text-xs mb-1.5 leading-snug">{idea.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{idea.summary}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono border-t border-[#1a2336] pt-1.5">
                      <span>❤️ {idea.likes}</span>
                      <span>💬 {idea.comments}</span>
                      <span className="ml-auto">{idea.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeWidget === 'orderbook' && (
              <div className="p-3">
                <OrderBook asset={selectedAsset} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vertical Icon Strip */}
      <div className="w-11 bg-[#0c101a] border-l border-[#1f293d] flex flex-col items-center py-2 gap-1.5 shrink-0">
        {widgets.map(w => {
          const Icon = w.icon;
          const isActive = activeWidget === w.id;

          return (
            <button
              key={w.id}
              onClick={() => handleToggleWidget(w.id)}
              title={w.title}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-[#182236] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2a]'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
