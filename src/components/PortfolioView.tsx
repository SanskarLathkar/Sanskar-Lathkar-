import React, { useState } from 'react';
import { Position, Asset } from '../types/trading';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Clock, 
  XCircle, 
  FileText,
  Shield,
  Layers
} from 'lucide-react';
import { playChime } from '../utils/security';

interface PortfolioViewProps {
  positions: Position[];
  assets: Asset[];
  cashBalance: number;
  privacyMode: boolean;
  onClosePosition: (positionId: string) => void;
  onOpenTaxReports: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  positions,
  assets,
  cashBalance,
  privacyMode,
  onClosePosition,
  onOpenTaxReports,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'open' | 'closed' | 'allocation'>('open');

  const openPositions = positions.filter(p => p.status === 'open');
  const closedPositions = positions.filter(p => p.status === 'closed');

  // Compute live portfolio metrics
  const positionsCurrentValue = openPositions.reduce((acc, p) => {
    return acc + (p.currentPrice * p.amount);
  }, 0);

  const totalPortfolioValue = positionsCurrentValue + cashBalance;

  const totalUnrealizedPnl = openPositions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalCostBasis = openPositions.reduce((acc, p) => acc + p.totalCost, 0);
  const totalUnrealizedPnlPct = totalCostBasis > 0 ? (totalUnrealizedPnl / totalCostBasis) * 100 : 0;

  const totalRealizedPnl = closedPositions.reduce((acc, p) => acc + (p.realizedPnl ?? 0), 0);

  // Asset category allocation
  const allocation = {
    stocks: 0,
    crypto: 0,
    forex: 0,
    commodities: 0,
    cash: cashBalance
  };

  openPositions.forEach(pos => {
    const asset = assets.find(a => a.id === pos.assetId);
    const cat = asset?.category || 'stocks';
    allocation[cat] += pos.currentPrice * pos.amount;
  });

  const formatCurrency = (val: number) => {
    if (privacyMode) return '••••••••';
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1f293d]">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#00d2ff]" />
            <h2 className="text-xl font-bold text-white font-display">
              Portfolio Management & Equity Overview
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time equity tracking, multi-broker position reconciliation, and risk monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTaxReports}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141b2b] hover:bg-[#1a2336] text-[#00d2ff] border border-[#00d2ff]/40 rounded text-xs font-mono transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Tax Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-[#0c101a] border border-[#1f293d] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Net Equity</span>
            <DollarSign className="w-4 h-4 text-[#00d2ff]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {formatCurrency(totalPortfolioValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Includes cash & live open positions
          </div>
        </div>

        <div className="p-4 bg-[#0c101a] border border-[#1f293d] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Unrealized P&L</span>
            {totalUnrealizedPnl >= 0 ? <TrendingUp className="w-4 h-4 text-[#10b981]" /> : <TrendingDown className="w-4 h-4 text-[#f43f5e]" />}
          </div>
          <div className={`text-2xl font-bold tabular-nums tracking-tight ${totalUnrealizedPnl >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
            {privacyMode ? '••••••••' : `${totalUnrealizedPnl >= 0 ? '+' : ''}${formatCurrency(totalUnrealizedPnl)}`}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {privacyMode ? '••••' : `${totalUnrealizedPnlPct >= 0 ? '+' : ''}${totalUnrealizedPnlPct.toFixed(2)}% return on active capital`}
          </div>
        </div>

        <div className="p-4 bg-[#0c101a] border border-[#1f293d] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Realized P&L (All-Time)</span>
            {totalRealizedPnl >= 0 ? <TrendingUp className="w-4 h-4 text-[#10b981]" /> : <TrendingDown className="w-4 h-4 text-[#f43f5e]" />}
          </div>
          <div className={`text-2xl font-bold tabular-nums tracking-tight ${totalRealizedPnl >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
            {privacyMode ? '••••••••' : `${totalRealizedPnl >= 0 ? '+' : ''}${formatCurrency(totalRealizedPnl)}`}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            From {closedPositions.length} closed trades
          </div>
        </div>

        <div className="p-4 bg-[#0c101a] border border-[#1f293d] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Available Cash</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums tracking-tight">
            {formatCurrency(cashBalance)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Ready for instant execution
          </div>
        </div>
      </div>

      {/* Asset Allocation Breakdown Bar */}
      <div className="p-4 bg-[#0c101a] border border-[#1f293d] rounded-xl flex flex-col gap-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-bold flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#00d2ff]" />
            Multi-Asset Capital Allocation
          </span>
          <span className="text-[11px] text-slate-500">100% Account Utilization</span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="h-3 w-full bg-[#141c2b] rounded-full overflow-hidden flex">
          {totalPortfolioValue > 0 && (
            <>
              <div 
                style={{ width: `${(allocation.stocks / totalPortfolioValue) * 100}%` }}
                className="bg-blue-500 h-full"
                title={`Equities: ${((allocation.stocks / totalPortfolioValue) * 100).toFixed(1)}%`}
              />
              <div 
                style={{ width: `${(allocation.crypto / totalPortfolioValue) * 100}%` }}
                className="bg-purple-500 h-full"
                title={`Crypto: ${((allocation.crypto / totalPortfolioValue) * 100).toFixed(1)}%`}
              />
              <div 
                style={{ width: `${(allocation.commodities / totalPortfolioValue) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`Commodities: ${((allocation.commodities / totalPortfolioValue) * 100).toFixed(1)}%`}
              />
              <div 
                style={{ width: `${(allocation.cash / totalPortfolioValue) * 100}%` }}
                className="bg-emerald-500 h-full"
                title={`Cash: ${((allocation.cash / totalPortfolioValue) * 100).toFixed(1)}%`}
              />
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 flex-wrap text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
            <span>Equities: {totalPortfolioValue > 0 ? ((allocation.stocks / totalPortfolioValue) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
            <span>Crypto: {totalPortfolioValue > 0 ? ((allocation.crypto / totalPortfolioValue) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
            <span>Commodities: {totalPortfolioValue > 0 ? ((allocation.commodities / totalPortfolioValue) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span>Cash Reserve: {totalPortfolioValue > 0 ? ((allocation.cash / totalPortfolioValue) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Tabs: Open Positions vs Closed Trades */}
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-1 p-2 bg-[#0e1320] border-b border-[#1f293d] text-xs">
          <button
            onClick={() => setActiveSubTab('open')}
            className={`px-3 py-1.5 rounded font-mono transition-colors ${
              activeSubTab === 'open'
                ? 'bg-[#1a2336] text-[#00d2ff] font-semibold border border-[#00d2ff]/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Positions ({openPositions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('closed')}
            className={`px-3 py-1.5 rounded font-mono transition-colors ${
              activeSubTab === 'closed'
                ? 'bg-[#1a2336] text-[#00d2ff] font-semibold border border-[#00d2ff]/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trade History ({closedPositions.length})
          </button>
        </div>

        {/* Positions / Trades Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1f293d] bg-[#0f1422] text-slate-400 text-[11px]">
                <th className="py-2.5 px-4 font-semibold">Symbol</th>
                <th className="py-2.5 px-4 font-semibold">Side</th>
                <th className="py-2.5 px-4 font-semibold">Size</th>
                <th className="py-2.5 px-4 font-semibold">Entry</th>
                <th className="py-2.5 px-4 font-semibold">{activeSubTab === 'open' ? 'Current' : 'Exit'}</th>
                <th className="py-2.5 px-4 font-semibold">P&L ($)</th>
                <th className="py-2.5 px-4 font-semibold">P&L (%)</th>
                <th className="py-2.5 px-4 font-semibold">Broker</th>
                {activeSubTab === 'open' ? (
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                ) : (
                  <th className="py-2.5 px-4 font-semibold">Tax Classification</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c2b] text-slate-200">
              {activeSubTab === 'open' ? (
                openPositions.map((pos) => {
                  const isProfit = pos.unrealizedPnl >= 0;

                  return (
                    <tr key={pos.id} className="hover:bg-[#111726] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {pos.symbol}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-1.5 py-0.5 rounded uppercase text-[10px] font-bold ${
                          pos.side === 'buy' ? 'bg-emerald-950 text-[#10b981]' : 'bg-rose-950 text-[#f43f5e]'
                        }`}>
                          {pos.side}
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        {pos.amount}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        ${pos.entryPrice < 10 ? pos.entryPrice.toFixed(4) : pos.entryPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        ${pos.currentPrice < 10 ? pos.currentPrice.toFixed(4) : pos.currentPrice.toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 font-bold tabular-nums ${isProfit ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                        {privacyMode ? '••••' : `${isProfit ? '+' : ''}$${pos.unrealizedPnl.toFixed(2)}`}
                      </td>
                      <td className={`py-3 px-4 font-bold tabular-nums ${isProfit ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                        {privacyMode ? '••%' : `${isProfit ? '+' : ''}${pos.unrealizedPnlPercent.toFixed(2)}%`}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {pos.broker}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            onClosePosition(pos.id);
                            playChime('trade');
                          }}
                          className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px] transition-colors"
                        >
                          Close Position
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                closedPositions.map((pos) => {
                  const pnl = pos.realizedPnl ?? 0;
                  const isProfit = pnl >= 0;

                  return (
                    <tr key={pos.id} className="hover:bg-[#111726] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {pos.symbol}
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-400">
                        {pos.side}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        {pos.amount}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        ${pos.entryPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        ${(pos.exitPrice ?? pos.currentPrice).toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 font-bold tabular-nums ${isProfit ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                        {privacyMode ? '••••' : `${isProfit ? '+' : ''}$${pnl.toFixed(2)}`}
                      </td>
                      <td className={`py-3 px-4 font-bold tabular-nums ${isProfit ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                        {privacyMode ? '••%' : `${isProfit ? '+' : ''}${((pnl / pos.totalCost) * 100).toFixed(2)}%`}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {pos.broker}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          pos.holdingPeriod === 'long_term' 
                            ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {pos.holdingPeriod === 'long_term' ? 'Long-Term Capital Gain' : 'Short-Term Ordinary'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {((activeSubTab === 'open' && openPositions.length === 0) || (activeSubTab === 'closed' && closedPositions.length === 0)) && (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No positions recorded in this view yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
