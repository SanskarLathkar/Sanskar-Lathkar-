import React, { useState } from 'react';
import { Asset } from '../../types/trading';
import { Activity, Gauge } from 'lucide-react';

interface TechnicalGaugeProps {
  asset: Asset;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ asset }) => {
  const [selectedTf, setSelectedTf] = useState<'1m' | '5m' | '15m' | '1h' | '1d'>('1h');

  // Compute realistic technical bias score based on asset 24h change & price action (-100 to +100)
  const score = Math.max(-100, Math.min(100, asset.change24h * 18));
  
  // Calculate angle (-90 deg for Strong Sell to +90 deg for Strong Buy)
  const needleAngle = (score / 100) * 80;

  const getLabel = (s: number) => {
    if (s >= 50) return { text: 'STRONG BUY', color: '#10b981' };
    if (s >= 15) return { text: 'BUY', color: '#34d399' };
    if (s >= -15) return { text: 'NEUTRAL', color: '#94a3b8' };
    if (s >= -50) return { text: 'SELL', color: '#f87171' };
    return { text: 'STRONG SELL', color: '#ef4444' };
  };

  const label = getLabel(score);

  // Oscillators counts
  const oscBuy = score > 10 ? 3 : score > -10 ? 1 : 0;
  const oscNeutral = 8;
  const oscSell = score < -10 ? 3 : score < 10 ? 1 : 0;

  // Moving Averages counts
  const maBuy = score > 0 ? Math.min(14, Math.floor(8 + (score / 100) * 6)) : Math.floor(4 + (score / 100) * 4);
  const maNeutral = 1;
  const maSell = 15 - maBuy - maNeutral;

  return (
    <div className="p-4 flex flex-col font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#1f293d] mb-3">
        <span className="font-bold text-white text-xs flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-[#00d2ff]" />
          Technical Analysis Summary
        </span>
        <span className="text-[10px] text-slate-400 font-mono uppercase">{asset.symbol}</span>
      </div>

      {/* Timeframe Buttons */}
      <div className="flex items-center justify-center gap-1 mb-4 bg-[#111726] p-1 rounded-lg border border-[#1f293d]">
        {(['1m', '5m', '15m', '1h', '1d'] as const).map(tf => (
          <button
            key={tf}
            onClick={() => setSelectedTf(tf)}
            className={`px-2.5 py-0.5 rounded text-[10px] uppercase transition-colors ${
              selectedTf === tf ? 'bg-[#00d2ff] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Semicircular Speedometer Gauge SVG */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg viewBox="0 0 200 115" className="w-48 overflow-visible">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="75%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#151d2f"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Gradient Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Needle */}
          <g transform={`rotate(${needleAngle}, 100, 100)`}>
            <polygon
              points="100,95 97,35 103,35"
              fill="#ffffff"
              filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.8))"
            />
            <circle cx="100" cy="98" r="5" fill="#ffffff" />
          </g>
        </svg>

        {/* Rating text */}
        <div className="mt-1 text-center">
          <div
            className="text-sm font-bold tracking-wider"
            style={{ color: label.color }}
          >
            {label.text}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Composite Technical Rating
          </div>
        </div>
      </div>

      {/* Sub Breakdown Meters */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#1f293d]">
        {/* Oscillators */}
        <div className="p-2.5 bg-[#111726] rounded-lg border border-[#1f293d]">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Oscillators</span>
          <div className="text-xs font-bold text-slate-200">
            {oscBuy > oscSell ? 'BUY' : oscSell > oscBuy ? 'SELL' : 'NEUTRAL'}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
            <span className="text-rose-400">{oscSell} Sell</span>
            <span className="text-slate-400">{oscNeutral} Neu</span>
            <span className="text-emerald-400">{oscBuy} Buy</span>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="p-2.5 bg-[#111726] rounded-lg border border-[#1f293d]">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Moving Averages</span>
          <div className="text-xs font-bold text-slate-200">
            {maBuy > maSell ? 'STRONG BUY' : maSell > maBuy ? 'STRONG SELL' : 'NEUTRAL'}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
            <span className="text-rose-400">{maSell} Sell</span>
            <span className="text-slate-400">{maNeutral} Neu</span>
            <span className="text-emerald-400">{maBuy} Buy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
