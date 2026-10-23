import React, { useMemo } from 'react';
import { Asset } from '../types/trading';

interface OrderBookProps {
  asset: Asset;
}

export const OrderBook: React.FC<OrderBookProps> = ({ asset }) => {
  const currentPrice = asset.price;

  // Generate simulated dynamic order book ladder based on current price
  const { asks, bids, spread } = useMemo(() => {
    const askList = [];
    const bidList = [];
    const tick = currentPrice > 1000 ? 5 : currentPrice > 10 ? 0.05 : 0.0001;

    let cumulativeAskVol = 0;
    for (let i = 5; i >= 1; i--) {
      const price = currentPrice + i * tick;
      const size = Math.floor(50 + Math.random() * 250);
      cumulativeAskVol += size;
      askList.push({ price, size, total: cumulativeAskVol });
    }

    let cumulativeBidVol = 0;
    for (let i = 1; i <= 5; i++) {
      const price = currentPrice - i * tick;
      const size = Math.floor(50 + Math.random() * 250);
      cumulativeBidVol += size;
      bidList.push({ price, size, total: cumulativeBidVol });
    }

    const calculatedSpread = (askList[askList.length - 1].price - bidList[0].price);

    return { asks: askList, bids: bidList, spread: calculatedSpread };
  }, [currentPrice]);

  const maxTotal = Math.max(
    ...asks.map(a => a.total),
    ...bids.map(b => b.total)
  );

  return (
    <div className="bg-[#0c101a] border border-[#1f293d] rounded-lg p-3 flex flex-col text-xs font-mono">
      <div className="flex items-center justify-between pb-2 border-b border-[#1f293d] mb-2 text-slate-400">
        <span className="font-bold text-slate-200">Level 2 Depth</span>
        <span className="text-[10px]">Spread: <span className="text-[#00d2ff]">${spread < 0.01 ? spread.toFixed(4) : spread.toFixed(2)}</span></span>
      </div>

      <div className="grid grid-cols-3 text-[10px] text-slate-500 pb-1 border-b border-[#151c2b]">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells - Red) */}
      <div className="flex flex-col gap-0.5 py-1">
        {asks.map((ask, idx) => {
          const depthPct = Math.min(100, (ask.total / maxTotal) * 100);
          return (
            <div key={idx} className="relative grid grid-cols-3 text-[11px] py-0.5 text-slate-300">
              <div 
                className="absolute right-0 top-0 bottom-0 bg-rose-500/10 pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-[#f43f5e] font-semibold">
                {ask.price < 10 ? ask.price.toFixed(4) : ask.price.toFixed(2)}
              </span>
              <span className="text-right text-slate-400">{ask.size}</span>
              <span className="text-right text-slate-400">{ask.total}</span>
            </div>
          );
        })}
      </div>

      {/* Mid Market Current Price Strip */}
      <div className="py-1.5 px-2 bg-[#121927] rounded my-1 flex items-center justify-between border border-[#1f293d]">
        <span className="text-sm font-bold text-white tabular-nums">
          ${currentPrice < 10 ? currentPrice.toFixed(4) : currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`text-[10px] font-semibold ${asset.change24h >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
          {asset.change24h >= 0 ? '▲' : '▼'} {asset.change24h.toFixed(2)}%
        </span>
      </div>

      {/* Bids (Buys - Green) */}
      <div className="flex flex-col gap-0.5 py-1">
        {bids.map((bid, idx) => {
          const depthPct = Math.min(100, (bid.total / maxTotal) * 100);
          return (
            <div key={idx} className="relative grid grid-cols-3 text-[11px] py-0.5 text-slate-300">
              <div 
                className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-[#10b981] font-semibold">
                {bid.price < 10 ? bid.price.toFixed(4) : bid.price.toFixed(2)}
              </span>
              <span className="text-right text-slate-400">{bid.size}</span>
              <span className="text-right text-slate-400">{bid.total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
