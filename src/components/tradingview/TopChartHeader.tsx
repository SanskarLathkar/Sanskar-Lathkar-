import React, { useState } from 'react';
import { Asset, ChartType, Timeframe } from '../../types/trading';
import { 
  Search, 
  Plus, 
  CandlestickChart, 
  LineChart, 
  AreaChart, 
  SlidersHorizontal, 
  History, 
  Camera, 
  Maximize2, 
  Minimize2, 
  LayoutGrid, 
  ChevronDown,
  RotateCcw,
  Play,
  Pause,
  FastForward,
  Layers,
  Sparkles
} from 'lucide-react';

interface TopChartHeaderProps {
  asset: Asset;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  onOpenIndicators: () => void;
  compareSymbol: string | null;
  setCompareSymbol: (sym: string | null) => void;
  isReplayMode: boolean;
  setIsReplayMode: (val: boolean) => void;
  isReplayPlaying: boolean;
  setIsReplayPlaying: (val: boolean | ((v: boolean) => boolean)) => void;
  onStepReplay: () => void;
  chartLayout: 'single' | 'split-v' | 'split-h' | 'quad';
  setChartLayout: (layout: 'single' | 'split-v' | 'split-h' | 'quad') => void;
  onSnapshot: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
}

export const TopChartHeader: React.FC<TopChartHeaderProps> = ({
  asset,
  assets,
  onSelectAsset,
  timeframe,
  setTimeframe,
  chartType,
  setChartType,
  onOpenIndicators,
  compareSymbol,
  setCompareSymbol,
  isReplayMode,
  setIsReplayMode,
  isReplayPlaying,
  setIsReplayPlaying,
  onStepReplay,
  chartLayout,
  setChartLayout,
  onSnapshot,
  isFullscreen,
  setIsFullscreen,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [isCandleMenuOpen, setIsCandleMenuOpen] = useState(false);

  const filteredAssets = assets.filter(a => 
    a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-11 bg-[#0c101a] border-b border-[#1f293d] px-3 flex items-center justify-between gap-3 text-xs select-none">
      {/* Left Zone: Symbol search + Compare + Timeframe + Candle Style + Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {/* Symbol Search Button */}
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#131b2a] hover:bg-[#192438] text-white border border-[#1f293d] transition-colors font-mono"
          >
            <Search className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span className="font-bold">{asset.symbol}</span>
            <span className="text-slate-400 hidden xl:inline text-[11px] truncate max-w-[90px]">{asset.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">D</span>
          </button>

          {/* Quick Symbol Modal */}
          {isSearchOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl w-full max-w-md shadow-2xl p-4 font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-[#1f293d] mb-3">
                  <span className="font-bold text-white text-sm">Symbol Search</span>
                  <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search symbols (e.g. BTC, NVDA, AAPL, EUR)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none mb-3"
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredAssets.map(a => (
                    <button
                      key={a.id}
                      onClick={() => {
                        onSelectAsset(a);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-[#141d2d] text-left transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white mr-2">{a.symbol}</span>
                        <span className="text-slate-400 text-[11px]">{a.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase">{a.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compare / Add Symbol Button */}
        <div className="relative">
          <button
            onClick={() => setIsCompareMenuOpen(!isCompareMenuOpen)}
            title="Compare or Add Symbol Overlay"
            className={`p-1.5 rounded transition-colors ${
              compareSymbol ? 'bg-[#00d2ff]/20 text-[#00d2ff]' : 'text-slate-400 hover:text-slate-200 hover:bg-[#141b2a]'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>

          {isCompareMenuOpen && (
            <div className="absolute left-0 top-full mt-1 bg-[#111726] border border-[#1f293d] rounded-lg shadow-2xl p-2 w-48 z-50 font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase block px-2 mb-1">Compare Overlay</span>
              {['SPY (S&P 500)', 'QQQ (Nasdaq 100)', 'BTC/USD (Bitcoin)', 'GLD (Gold)'].map(sym => {
                const cleanSym = sym.split(' ')[0];
                const isSelected = compareSymbol === cleanSym;

                return (
                  <button
                    key={sym}
                    onClick={() => {
                      setCompareSymbol(isSelected ? null : cleanSym);
                      setIsCompareMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors ${
                      isSelected ? 'bg-[#1a2336] text-[#00d2ff] font-semibold' : 'text-slate-300 hover:bg-[#161f30]'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
              {compareSymbol && (
                <button
                  onClick={() => { setCompareSymbol(null); setIsCompareMenuOpen(false); }}
                  className="w-full text-left px-2 py-1.5 rounded text-rose-400 hover:bg-rose-950/30 mt-1 border-t border-[#1f293d]"
                >
                  Remove Compare Overlay
                </button>
              )}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[#1f293d]" />

        {/* Timeframe Selectors */}
        <div className="flex items-center gap-0.5 font-mono">
          {(['1m', '5m', '15m', '1h', '4h', '1d', '1w'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-1.5 py-1 rounded text-[11px] transition-colors ${
                timeframe === tf
                  ? 'text-[#00d2ff] font-bold bg-[#141d2d]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121927]'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[#1f293d]" />

        {/* Chart Style Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsCandleMenuOpen(!isCandleMenuOpen)}
            className="flex items-center gap-1 px-2 py-1 text-slate-300 hover:text-white rounded hover:bg-[#131b2a] transition-colors"
          >
            <CandlestickChart className="w-3.5 h-3.5 text-[#00d2ff]" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {isCandleMenuOpen && (
            <div className="absolute left-0 top-full mt-1 bg-[#111726] border border-[#1f293d] rounded-lg shadow-2xl p-1.5 w-36 z-50 font-mono text-xs">
              {(['candles', 'line', 'area'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setChartType(type);
                    setIsCandleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded capitalize transition-colors ${
                    chartType === type ? 'bg-[#1a2336] text-[#00d2ff] font-semibold' : 'text-slate-300 hover:bg-[#151d2f]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Indicators FX Button */}
        <button
          onClick={onOpenIndicators}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#131b2a] hover:bg-[#192438] text-slate-200 border border-[#1f293d] transition-colors font-mono"
        >
          <span className="font-bold text-[#00d2ff] italic font-serif">fx</span>
          <span>Indicators</span>
        </button>

        {/* Bar Replay Simulator */}
        <div className="flex items-center gap-1 bg-[#131b2a] p-0.5 rounded border border-[#1f293d] font-mono">
          <button
            onClick={() => setIsReplayMode(!isReplayMode)}
            title="Bar Replay Simulator"
            className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
              isReplayMode ? 'bg-[#00d2ff] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden lg:inline">Replay</span>
          </button>

          {isReplayMode && (
            <>
              <button
                onClick={() => setIsReplayPlaying(p => !p)}
                className="p-1 text-slate-300 hover:text-white"
              >
                {isReplayPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-[#10b981]" />}
              </button>
              <button
                onClick={onStepReplay}
                className="p-1 text-slate-300 hover:text-white"
                title="Forward 1 Bar"
              >
                <FastForward className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Zone: Multi-Chart Layout + Camera Screenshot + Fullscreen */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Layout dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
            title="Select Chart Grid Layout"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#141b2a] transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {isLayoutMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[#111726] border border-[#1f293d] rounded-lg shadow-2xl p-1.5 w-44 z-50 font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase block px-2 mb-1">Select Grid Layout</span>
              {[
                { id: 'single', label: 'Single Chart' },
                { id: 'split-v', label: '2 Charts (Vertical)' },
                { id: 'split-h', label: '2 Charts (Horizontal)' },
                { id: 'quad', label: '4 Charts (Quad Grid)' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setChartLayout(l.id as 'single' | 'split-v' | 'split-h' | 'quad');
                    setIsLayoutMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                    chartLayout === l.id ? 'bg-[#1a2336] text-[#00d2ff] font-semibold' : 'text-slate-300 hover:bg-[#151d2f]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Camera Snapshot */}
        <button
          onClick={onSnapshot}
          title="Take Chart Snapshot"
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#141b2a] transition-colors"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Chart"}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#141b2a] transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
