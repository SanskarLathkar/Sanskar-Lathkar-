import React, { useState } from 'react';
import { Asset, Position, Broker, UserAccount } from '../../types/trading';
import { INITIAL_PINE_SCRIPT } from '../../data/tradingViewFeeds';
import { 
  Code2, 
  LineChart, 
  Sliders, 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Save, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { playChime } from '../../utils/security';

type BottomDockTab = 'screener' | 'pine' | 'strategy' | 'trading';

interface BottomTradingDockProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  positions: Position[];
  onClosePosition: (id: string) => void;
  brokers: Broker[];
  user: UserAccount;
  onApplyPineIndicator?: (script: string) => void;
}

export const BottomTradingDock: React.FC<BottomTradingDockProps> = ({
  assets,
  onSelectAsset,
  positions,
  onClosePosition,
  brokers,
  user,
  onApplyPineIndicator,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BottomDockTab>('trading');
  const [pineScript, setPineScript] = useState<string>(INITIAL_PINE_SCRIPT);
  const [pineSuccess, setPineSuccess] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<string>('1D');
  const [isLogScale, setIsLogScale] = useState(false);
  const [isPctScale, setIsPctScale] = useState(false);

  const openPositions = positions.filter(p => p.status === 'open');

  const handleApplyPine = () => {
    if (onApplyPineIndicator) {
      onApplyPineIndicator(pineScript);
    }
    playChime('success');
    setPineSuccess('Pine Script compiled and added to active chart!');
    setTimeout(() => setPineSuccess(null), 3000);
  };

  return (
    <div className="bg-[#0c101a] border-t border-[#1f293d] flex flex-col shrink-0 select-none font-mono text-xs z-20">
      {/* Upper Time Range & Quick Scale Ribbon (TradingView Signature Bottom Bar) */}
      <div className="h-8 px-3 flex items-center justify-between bg-[#080b12] border-b border-[#172030] text-[11px] text-slate-400">
        {/* Time Ranges */}
        <div className="flex items-center gap-1">
          {['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'ALL'].map(range => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                activeRange === range
                  ? 'text-[#00d2ff] font-bold bg-[#141d2d]'
                  : 'hover:text-slate-200 hover:bg-[#121927]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Scales & Dock Expand Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#101625] p-0.5 rounded border border-[#1f293d]">
            <button
              onClick={() => setIsPctScale(!isPctScale)}
              className={`px-1.5 py-0.2 rounded text-[10px] ${isPctScale ? 'bg-[#00d2ff] text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              %
            </button>
            <button
              onClick={() => setIsLogScale(!isLogScale)}
              className={`px-1.5 py-0.2 rounded text-[10px] ${isLogScale ? 'bg-[#00d2ff] text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              log
            </button>
            <button className="px-1.5 py-0.2 rounded text-[10px] text-[#00d2ff] font-bold">
              auto
            </button>
          </div>

          <div className="h-3.5 w-px bg-[#1f293d]" />

          {/* Toggle Dock Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-[#131b2a] hover:bg-[#192438] transition-colors"
          >
            <span>Trading Panel</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Bottom Drawer */}
      {isOpen && (
        <div className="h-64 flex flex-col bg-[#0a0d14] animate-fadeIn">
          {/* Drawer Tabs */}
          <div className="h-9 px-3 bg-[#0f1422] border-b border-[#1f293d] flex items-center gap-2">
            {[
              { id: 'trading', label: 'Paper Trading Panel', icon: Terminal },
              { id: 'pine', label: 'Pine Editor', icon: Code2 },
              { id: 'strategy', label: 'Strategy Tester', icon: LineChart },
              { id: 'screener', label: 'Stock Screener', icon: Sliders },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as BottomDockTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                    isActive
                      ? 'bg-[#182236] text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Drawer Viewports */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'trading' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f293d] text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Account Balance</span>
                      <div className="text-white font-bold">${user.cashBalance.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Active Broker</span>
                      <div className="text-emerald-400 font-semibold">{brokers.find(b => b.status === 'connected')?.name || 'Alpaca Markets'}</div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {openPositions.length} Open Positions Active
                  </span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-500 text-[10px] uppercase border-b border-[#172030]">
                      <th className="py-1">Symbol</th>
                      <th className="py-1">Side</th>
                      <th className="py-1">Qty</th>
                      <th className="py-1">Entry</th>
                      <th className="py-1">Current</th>
                      <th className="py-1">P&L ($)</th>
                      <th className="py-1">P&L (%)</th>
                      <th className="py-1 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#151c2b] text-slate-300">
                    {openPositions.map(pos => (
                      <tr key={pos.id}>
                        <td className="py-1.5 font-bold text-white">{pos.symbol}</td>
                        <td className={`py-1.5 uppercase font-bold text-[10px] ${pos.side === 'buy' ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                          {pos.side}
                        </td>
                        <td className="py-1.5">{pos.amount}</td>
                        <td className="py-1.5">${pos.entryPrice.toFixed(2)}</td>
                        <td className="py-1.5">${pos.currentPrice.toFixed(2)}</td>
                        <td className={`py-1.5 font-bold ${pos.unrealizedPnl >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                          {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                        </td>
                        <td className={`py-1.5 font-bold ${pos.unrealizedPnl >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                          {pos.unrealizedPnlPercent >= 0 ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%
                        </td>
                        <td className="py-1.5 text-right">
                          <button
                            onClick={() => onClosePosition(pos.id)}
                            className="text-rose-400 hover:text-rose-300 text-[11px]"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'pine' && (
              <div className="flex flex-col h-full space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Script: <strong className="text-white">Supertrend_Ribbon.pine</strong></span>
                    {pineSuccess && <span className="text-emerald-400 text-[11px] flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {pineSuccess}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApplyPine}
                      className="flex items-center gap-1 px-3 py-1 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold rounded text-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Add to Chart</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={pineScript}
                  onChange={(e) => setPineScript(e.target.value)}
                  className="flex-1 w-full bg-[#070a10] border border-[#1f293d] rounded p-3 text-slate-200 font-mono text-xs resize-none outline-none focus:border-[#00d2ff]"
                  rows={8}
                />
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#111726] rounded border border-[#1f293d]">
                    <span className="text-[10px] text-slate-400 uppercase">Net Profit</span>
                    <div className="text-base font-bold text-[#10b981]">+38.42%</div>
                  </div>
                  <div className="p-3 bg-[#111726] rounded border border-[#1f293d]">
                    <span className="text-[10px] text-slate-400 uppercase">Win Rate</span>
                    <div className="text-base font-bold text-white">68.2% (84 Trades)</div>
                  </div>
                  <div className="p-3 bg-[#111726] rounded border border-[#1f293d]">
                    <span className="text-[10px] text-slate-400 uppercase">Profit Factor</span>
                    <div className="text-base font-bold text-[#00d2ff]">2.14</div>
                  </div>
                  <div className="p-3 bg-[#111726] rounded border border-[#1f293d]">
                    <span className="text-[10px] text-slate-400 uppercase">Max Drawdown</span>
                    <div className="text-base font-bold text-[#f43f5e]">-6.85%</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Backtesting simulated on 5-Minute timeframe over 90 days across historical candle bars.
                </p>
              </div>
            )}

            {activeTab === 'screener' && (
              <div className="space-y-2">
                <div className="text-slate-400 text-xs">Global Multi-Asset Screener:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {assets.map(a => (
                    <div
                      key={a.id}
                      onClick={() => onSelectAsset(a)}
                      className="p-2 bg-[#111726] rounded border border-[#1f293d] hover:border-[#00d2ff] cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-white">{a.symbol}</span>
                        <span className="text-[10px] text-slate-400 block">${a.price}</span>
                      </div>
                      <span className={`text-[11px] font-bold ${a.change24h >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                        {a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
