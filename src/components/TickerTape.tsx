import React from 'react';
import { Asset } from '../types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  selectedAssetId: string;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  assets,
  onSelectAsset,
  selectedAssetId,
}) => {
  return (
    <div className="bg-[#080b11] border-b border-[#172030] overflow-x-auto whitespace-nowrap scrollbar-none py-1.5 px-3 flex items-center gap-6 text-xs font-mono">
      <div className="flex items-center gap-1.5 text-[11px] text-[#00d2ff] font-bold uppercase tracking-wider shrink-0 pr-2 border-r border-[#1f293d]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse"></span>
        <span>MARKETS 24/7</span>
      </div>

      <div className="flex items-center gap-5">
        {assets.map((asset) => {
          const isUp = asset.change24h >= 0;
          const isSelected = asset.id === selectedAssetId;

          return (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all shrink-0 text-left ${
                isSelected 
                  ? 'bg-[#151d2d] border border-[#00d2ff]/40 text-white' 
                  : 'hover:bg-[#111723] text-slate-300'
              }`}
            >
              <span className="font-semibold text-slate-200">{asset.symbol}</span>
              <span className="tabular-nums font-mono text-slate-100">
                ${asset.price < 10 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-[11px] font-semibold tabular-nums ${isUp ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
