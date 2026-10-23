import React, { useState } from 'react';
import { TechnicalIndicatorConfig } from '../../types/trading';
import { 
  X, 
  Search, 
  Star, 
  Check, 
  TrendingUp, 
  Activity, 
  BarChart2, 
  SlidersHorizontal 
} from 'lucide-react';

interface IndicatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicators: TechnicalIndicatorConfig;
  setIndicators: React.Dispatch<React.SetStateAction<TechnicalIndicatorConfig>>;
}

interface IndicatorItem {
  id: keyof TechnicalIndicatorConfig;
  name: string;
  category: 'Trend' | 'Oscillators' | 'Volatility' | 'Volume';
  author: string;
  popular: boolean;
  description: string;
}

export const IndicatorsModal: React.FC<IndicatorsModalProps> = ({
  isOpen,
  onClose,
  indicators,
  setIndicators,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const indicatorList: IndicatorItem[] = [
    { id: 'showEMA20', name: 'EMA 20 (Exponential Moving Average)', category: 'Trend', author: 'TradingView Built-in', popular: true, description: 'Fast moving average smoothing recent price action.' },
    { id: 'showEMA50', name: 'EMA 50 (Medium Trend Baseline)', category: 'Trend', author: 'TradingView Built-in', popular: true, description: 'Intermediate trend guidance line.' },
    { id: 'showEMA200', name: 'EMA 200 (Macro Institutional Line)', category: 'Trend', author: 'TradingView Built-in', popular: true, description: 'Primary institutional bull/bear demarcation.' },
    { id: 'showBollinger', name: 'Bollinger Bands (20, 2)', category: 'Volatility', author: 'John Bollinger', popular: true, description: 'Volatility envelope with 2 standard deviation upper/lower bands.' },
    { id: 'showRSI', name: 'Relative Strength Index (RSI 14)', category: 'Oscillators', author: 'J. Welles Wilder', popular: true, description: 'Momentum oscillator with 70 overbought & 30 oversold thresholds.' },
    { id: 'showMACD', name: 'MACD (12, 26, 9)', category: 'Oscillators', author: 'Gerald Appel', popular: true, description: 'Moving average convergence/divergence with signal line & histogram.' },
    { id: 'showVolume', name: 'Volume & Liquidity Profile', category: 'Volume', author: 'TradingView Built-in', popular: true, description: 'Dynamic volume bars color-coded by candle close.' },
    { id: 'showATR', name: 'Average True Range (ATR 14)', category: 'Volatility', author: 'J. Welles Wilder', popular: true, description: 'Measures market volatility by decomposing range of an asset.' },
    { id: 'showSuperTrend', name: 'Supertrend Trend Following', category: 'Trend', author: 'Olivier Seban', popular: true, description: 'Dynamic ATR trailing stop loss indicator.' },
  ];

  const filtered = indicatorList.filter(ind => {
    const matchesCat = activeCategory === 'all' || ind.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || ind.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleIndicator = (id: keyof TechnicalIndicatorConfig) => {
    setIndicators(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#00d2ff]" />
            <h3 className="font-bold text-white text-base font-display">
              Indicators, Metrics & Strategies
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2336] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-3 bg-[#0a0d14] border-b border-[#1f293d] space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search indicators (e.g. RSI, MACD, Bollinger, EMA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded pl-9 pr-3 py-2 text-white font-mono text-xs outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none font-mono text-[11px]">
            {['all', 'Trend', 'Oscillators', 'Volatility', 'Volume'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded capitalize transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#182236] text-[#00d2ff] font-semibold border border-[#00d2ff]/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Indicator List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#151c2b] p-1">
          {filtered.map(ind => {
            const isActive = indicators[ind.id];

            return (
              <div
                key={ind.id}
                onClick={() => toggleIndicator(ind.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive ? 'bg-[#121c2e]' : 'hover:bg-[#101625]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 border ${
                    isActive ? 'bg-[#00d2ff] border-[#00d2ff] text-slate-950 font-bold' : 'border-[#1f293d] text-transparent'
                  }`}>
                    {isActive ? <Check className="w-3.5 h-3.5" /> : null}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ind.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase px-1 rounded bg-[#172033]">
                        {ind.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ind.description}</p>
                    <span className="text-[10px] text-slate-500 font-mono">By {ind.author}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-950/40 text-rose-300 border border-rose-800'
                      : 'bg-[#141b2b] text-[#00d2ff] border border-[#00d2ff]/40'
                  }`}
                >
                  {isActive ? 'Active' : '+ Add'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1f293d] bg-[#0f1422] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold font-mono rounded text-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
