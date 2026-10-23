import React, { useState } from 'react';
import { Asset, AssetCategory } from '../types/trading';
import { Search, Bell, TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface WatchlistProps {
  assets: Asset[];
  selectedAssetId: string;
  onSelectAsset: (asset: Asset) => void;
  onSetAlert: (asset: Asset) => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({
  assets,
  selectedAssetId,
  onSelectAsset,
  onSetAlert,
}) => {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = activeCategory === 'all' || asset.category === activeCategory;
    const matchesSearch = 
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0c101a] border border-[#1f293d] rounded-lg flex flex-col h-full text-xs font-sans overflow-hidden">
      {/* Watchlist Header */}
      <div className="p-3 border-b border-[#1f293d] bg-[#0f1422] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-white text-xs">
            <Layers className="w-4 h-4 text-[#00d2ff]" />
            <span>Market Watchlist</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {filteredAssets.length} Assets
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search symbols or pairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded pl-8 pr-2 py-1.5 text-slate-200 placeholder-slate-500 font-mono text-xs outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {(['all', 'stocks', 'crypto', 'forex', 'commodities'] as AssetCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 rounded text-[11px] font-mono capitalize whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#1a2336] text-[#00d2ff] font-semibold border border-[#00d2ff]/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141b2b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#151c2b]">
        {filteredAssets.map((asset) => {
          const isSelected = asset.id === selectedAssetId;
          const isUp = asset.change24h >= 0;

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`group flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#141d2d] border-l-2 border-[#00d2ff]'
                  : 'hover:bg-[#101624]'
              }`}
            >
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white font-mono text-xs">
                    {asset.symbol}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono px-1 rounded bg-[#172033]">
                    {asset.category}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                  {asset.name}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end">
                  <span className="font-mono text-slate-100 font-medium tabular-nums">
                    ${asset.price < 10 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`flex items-center text-[10px] font-mono font-semibold tabular-nums ${isUp ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                    {isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetAlert(asset);
                  }}
                  title="Create Price Alert"
                  className="p-1 rounded text-slate-500 hover:text-[#00d2ff] hover:bg-[#1a2336] opacity-60 group-hover:opacity-100 transition-all"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredAssets.length === 0 && (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No assets match &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
