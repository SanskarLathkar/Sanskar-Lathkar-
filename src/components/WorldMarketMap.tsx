import React, { useState } from 'react';
import { WorldMarketIndex } from '../types/trading';
import { 
  Globe2, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Building2, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface WorldMarketMapProps {
  indices: WorldMarketIndex[];
}

export const WorldMarketMap: React.FC<WorldMarketMapProps> = ({ indices }) => {
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>('nyse');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedExchange = indices.find(i => i.id === selectedExchangeId) || indices[0];

  const filteredIndices = indices.filter(idx => {
    const matchesRegion = filterRegion === 'all' || idx.region.toLowerCase() === filterRegion.toLowerCase();
    const matchesStatus = filterStatus === 'all' || idx.status === filterStatus;
    return matchesRegion && matchesStatus;
  });

  // Convert lat/lng to stylized SVG coordinate space (Equirectangular 1000x500)
  const mapCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Header and Macro Regional Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1f293d]">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#00d2ff]" />
            <h2 className="text-xl font-bold text-white font-display">
              Live Global Stock Market World Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time equity market sessions, international exchange statuses, and global capital flows.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#101625] p-1 rounded border border-[#1f293d] text-xs">
            {['all', 'Americas', 'Europe', 'Asia-Pacific'].map((reg) => (
              <button
                key={reg}
                onClick={() => setFilterRegion(reg)}
                className={`px-2.5 py-1 rounded capitalize font-mono text-[11px] transition-colors ${
                  filterRegion === reg
                    ? 'bg-[#1a2336] text-[#00d2ff] font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#101625] p-1 rounded border border-[#1f293d] text-xs">
            {['all', 'open', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded capitalize font-mono text-[11px] transition-colors ${
                  filterStatus === st
                    ? 'bg-[#1a2336] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Global Map Canvas Section */}
      <div className="relative bg-[#0b0f19] border border-[#1f293d] rounded-xl overflow-hidden shadow-2xl p-4 lg:p-6">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00d2ff 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />

        {/* Global Continental Outlines & Node Markers SVG */}
        <div className="relative w-full aspect-[2/1] min-h-[360px] max-h-[540px]">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* World Landmass Silhouettes (Simplified clean stylized polygons) */}
            {/* North America */}
            <path
              d="M140,110 L280,100 L300,160 L240,240 L190,260 L180,310 L160,300 L130,220 L90,170 Z"
              fill="#131a2a"
              stroke="#1f293d"
              strokeWidth="1"
            />
            {/* South America */}
            <path
              d="M270,300 L350,330 L380,420 L330,480 L290,440 L260,360 Z"
              fill="#131a2a"
              stroke="#1f293d"
              strokeWidth="1"
            />
            {/* Europe */}
            <path
              d="M470,120 L570,110 L590,180 L520,200 L470,180 Z"
              fill="#131a2a"
              stroke="#1f293d"
              strokeWidth="1"
            />
            {/* Africa */}
            <path
              d="M480,220 L580,220 L610,310 L560,420 L500,410 L470,290 Z"
              fill="#131a2a"
              stroke="#1f293d"
              strokeWidth="1"
            />
            {/* Asia */}
            <path
              d="M590,110 L840,120 L870,220 L820,310 L700,320 L640,250 L600,170 Z"
              fill="#131a2a"
              stroke="#1f293d"
              strokeWidth="1"
            />
            {/* Australia */}
            <path
              d="M770,370 L870,360 L890,430 L800,440 Z"
              fill="#131a2a"
              stroke="#1f293d"
              strokeWidth="1"
            />

            {/* Connecting Trade Route Arcs */}
            <path
              d="M 230 180 Q 360 80 500 150"
              fill="none"
              stroke="#00d2ff"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              opacity="0.3"
            />
            <path
              d="M 500 150 Q 640 100 780 180"
              fill="none"
              stroke="#00d2ff"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              opacity="0.3"
            />
            <path
              d="M 230 180 Q 520 300 830 390"
              fill="none"
              stroke="#00d2ff"
              strokeWidth="1"
              strokeDasharray="3 6"
              opacity="0.2"
            />

            {/* Exchange Nodes on Map */}
            {filteredIndices.map((exchange) => {
              const { x, y } = mapCoords(exchange.lat, exchange.lng);
              const isSelected = exchange.id === selectedExchangeId;
              const isUp = exchange.change >= 0;
              const isOpen = exchange.status === 'open';

              const ringColor = isOpen 
                ? (isUp ? '#10b981' : '#f43f5e') 
                : '#64748b';

              return (
                <g
                  key={exchange.id}
                  onClick={() => setSelectedExchangeId(exchange.id)}
                  className="cursor-pointer group"
                >
                  {/* Ping Animation Ring if Open */}
                  {isOpen && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="1"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer selection ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "9" : "6"}
                    fill={ringColor}
                    fillOpacity={isSelected ? "0.3" : "0.15"}
                    stroke={isSelected ? "#00d2ff" : ringColor}
                    strokeWidth={isSelected ? "2" : "1.2"}
                    className="transition-all duration-200"
                  />

                  {/* Core Pinpoint */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "4" : "3"}
                    fill={ringColor}
                  />

                  {/* Exchange Code Label */}
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily='"JetBrains Mono", monospace'
                    className="select-none pointer-events-none drop-shadow"
                  >
                    {exchange.code}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Overlay Inspector for Selected Exchange */}
        {selectedExchange && (
          <div className="mt-4 p-4 bg-[#111726] border border-[#1f293d] rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm border ${
                selectedExchange.status === 'open'
                  ? selectedExchange.change >= 0 
                    ? 'bg-emerald-950/50 text-[#10b981] border-emerald-500/40' 
                    : 'bg-rose-950/50 text-[#f43f5e] border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {selectedExchange.code.slice(0, 3)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base font-display">
                    {selectedExchange.name}
                  </h3>
                  <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                    selectedExchange.status === 'open'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {selectedExchange.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>{selectedExchange.city}, {selectedExchange.country}</span>
                  <span>·</span>
                  <span className="font-mono">{selectedExchange.region}</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 flex-wrap font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Current Index</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {selectedExchange.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase">24h Change</span>
                <span className={`text-lg font-bold flex items-center tabular-nums ${
                  selectedExchange.change >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'
                }`}>
                  {selectedExchange.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1 inline" /> : <TrendingDown className="w-4 h-4 mr-1 inline" />}
                  {selectedExchange.change >= 0 ? '+' : ''}{selectedExchange.change.toFixed(2)}%
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Daily Volume</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedExchange.volumeToday}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Trading Session</span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {selectedExchange.tradingHours}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Global Exchanges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredIndices.map((idx) => {
          const isSelected = idx.id === selectedExchangeId;
          const isUp = idx.change >= 0;
          const isOpen = idx.status === 'open';

          return (
            <div
              key={idx.id}
              onClick={() => setSelectedExchangeId(idx.id)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#141d2d] border-[#00d2ff] shadow-lg shadow-cyan-950/30'
                  : 'bg-[#0c101a] border-[#1f293d] hover:border-[#2d3a54] hover:bg-[#101524]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white font-mono text-sm">{idx.code}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                  isOpen ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 truncate mb-2">
                {idx.name}
              </div>

              <div className="flex items-baseline justify-between font-mono pt-2 border-t border-[#172030]">
                <span className="text-slate-100 font-semibold tabular-nums">
                  {idx.value.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                </span>
                <span className={`text-xs font-bold tabular-nums ${isUp ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                  {isUp ? '+' : ''}{idx.change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
