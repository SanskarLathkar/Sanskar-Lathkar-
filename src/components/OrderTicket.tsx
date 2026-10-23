import React, { useState } from 'react';
import { Asset, Broker, OrderSide, OrderType, Position } from '../types/trading';
import { playChime } from '../utils/security';
import { ShieldCheck, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

interface OrderTicketProps {
  asset: Asset;
  brokers: Broker[];
  onExecuteTrade: (position: Omit<Position, 'id' | 'timestamp' | 'unrealizedPnl' | 'unrealizedPnlPercent' | 'status' | 'holdingPeriod' | 'taxYear'>) => void;
  cashBalance: number;
}

export const OrderTicket: React.FC<OrderTicketProps> = ({
  asset,
  brokers,
  onExecuteTrade,
  cashBalance,
}) => {
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [amount, setAmount] = useState<string>('10');
  const [limitPrice, setLimitPrice] = useState<string>(asset.price.toString());
  const [enableSL, setEnableSL] = useState<boolean>(true);
  const [enableTP, setEnableTP] = useState<boolean>(true);
  const [stopLoss, setStopLoss] = useState<string>((asset.price * 0.96).toFixed(2));
  const [takeProfit, setTakeProfit] = useState<string>((asset.price * 1.08).toFixed(2));
  const [selectedBroker, setSelectedBroker] = useState<string>(
    brokers.find(b => b.status === 'connected')?.name || brokers[0]?.name || 'Alpaca Markets'
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const executionPrice = orderType === 'market' ? asset.price : (parseFloat(limitPrice) || asset.price);
  const totalCost = numAmount * executionPrice;
  const estimatedFee = Math.max(1, totalCost * 0.0005); // 0.05% fee

  const handlePercentageQuick = (pct: number) => {
    if (cashBalance <= 0 || executionPrice <= 0) return;
    const alloc = cashBalance * pct;
    const shares = asset.category === 'crypto' || asset.category === 'forex'
      ? Number((alloc / executionPrice).toFixed(4))
      : Math.floor(alloc / executionPrice);
    setAmount(shares.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      setFeedbackMessage('Please enter a valid trade amount.');
      return;
    }

    onExecuteTrade({
      assetId: asset.id,
      symbol: asset.symbol,
      side,
      orderType,
      entryPrice: executionPrice,
      currentPrice: executionPrice,
      amount: numAmount,
      totalCost,
      stopLoss: enableSL ? parseFloat(stopLoss) : undefined,
      takeProfit: enableTP ? parseFloat(takeProfit) : undefined,
      broker: selectedBroker,
      fees: estimatedFee
    });

    playChime('trade');
    setFeedbackMessage(`Executed ${side.toUpperCase()} ${numAmount} ${asset.symbol} via ${selectedBroker}`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Calculate Risk / Reward ratio
  const slVal = parseFloat(stopLoss);
  const tpVal = parseFloat(takeProfit);
  let rrRatio = '1 : 2.0';
  if (enableSL && enableTP && slVal && tpVal && executionPrice) {
    const risk = Math.abs(executionPrice - slVal);
    const reward = Math.abs(tpVal - executionPrice);
    if (risk > 0) {
      rrRatio = `1 : ${(reward / risk).toFixed(2)}`;
    }
  }

  return (
    <div className="bg-[#0c101a] border border-[#1f293d] rounded-lg p-4 flex flex-col text-xs font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-[#1f293d] mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00d2ff]" />
          <span className="font-bold text-white text-sm">Order Execution Ticket</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Paper Engine</span>
        </div>
      </div>

      {feedbackMessage && (
        <div className="mb-3 px-3 py-2 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-300 font-mono text-[11px] flex items-center justify-between animate-fadeIn">
          <span>{feedbackMessage}</span>
          <span className="text-[10px] text-emerald-400/80">Filled</span>
        </div>
      )}

      {/* Buy / Sell Side Switcher */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          type="button"
          onClick={() => {
            setSide('buy');
            setStopLoss((asset.price * 0.96).toFixed(2));
            setTakeProfit((asset.price * 1.08).toFixed(2));
          }}
          className={`py-2 rounded font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
            side === 'buy'
              ? 'bg-[#10b981] text-slate-950 shadow-md shadow-emerald-950'
              : 'bg-[#131b2a] text-slate-400 hover:text-slate-200 border border-[#1f293d]'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>BUY (LONG)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSide('sell');
            setStopLoss((asset.price * 1.04).toFixed(2));
            setTakeProfit((asset.price * 0.92).toFixed(2));
          }}
          className={`py-2 rounded font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
            side === 'sell'
              ? 'bg-[#f43f5e] text-slate-950 shadow-md shadow-rose-950'
              : 'bg-[#131b2a] text-slate-400 hover:text-slate-200 border border-[#1f293d]'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>SELL (SHORT)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Order Type Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOrderType('market')}
            className={`flex-1 py-1.5 rounded font-mono text-[11px] transition-colors border ${
              orderType === 'market'
                ? 'bg-[#1a2336] text-[#00d2ff] border-[#00d2ff]/40 font-semibold'
                : 'bg-[#0f1422] text-slate-400 border-[#1f293d] hover:text-slate-200'
            }`}
          >
            Market Order
          </button>
          <button
            type="button"
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-1.5 rounded font-mono text-[11px] transition-colors border ${
              orderType === 'limit'
                ? 'bg-[#1a2336] text-[#00d2ff] border-[#00d2ff]/40 font-semibold'
                : 'bg-[#0f1422] text-slate-400 border-[#1f293d] hover:text-slate-200'
            }`}
          >
            Limit Order
          </button>
        </div>

        {/* Limit Price Input if Limit Order */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Limit Price (USD)
            </label>
            <input
              type="number"
              step="any"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white font-mono outline-none"
            />
          </div>
        )}

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Amount ({asset.category === 'stocks' ? 'Shares' : 'Units'})</span>
            <span className="text-slate-500">Available: ${cashBalance.toLocaleString()}</span>
          </div>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white font-mono outline-none"
            placeholder="0.00"
          />

          {/* Quick % Allocations */}
          <div className="grid grid-cols-4 gap-1 mt-1.5">
            {[0.25, 0.50, 0.75, 1.0].map((pct) => (
              <button
                type="button"
                key={pct}
                onClick={() => handlePercentageQuick(pct)}
                className="py-1 bg-[#131b2a] hover:bg-[#1a2336] rounded text-[10px] font-mono text-slate-400 hover:text-slate-200 transition-colors border border-[#1f293d]"
              >
                {pct * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* SL & TP Settings */}
        <div className="p-2.5 bg-[#0f1422] rounded border border-[#1f293d] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium">Risk Management</span>
            <span className="font-mono text-[10px] text-slate-400">R:R Ratio: <span className="text-[#00d2ff]">{rrRatio}</span></span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-rose-400">Stop Loss</span>
                <input
                  type="checkbox"
                  checked={enableSL}
                  onChange={(e) => setEnableSL(e.target.checked)}
                  className="accent-rose-500"
                />
              </div>
              <input
                type="number"
                step="any"
                disabled={!enableSL}
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full bg-[#111726] border border-[#1f293d] focus:border-rose-500 rounded px-2 py-1 text-white font-mono text-[11px] disabled:opacity-40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-emerald-400">Take Profit</span>
                <input
                  type="checkbox"
                  checked={enableTP}
                  onChange={(e) => setEnableTP(e.target.checked)}
                  className="accent-emerald-500"
                />
              </div>
              <input
                type="number"
                step="any"
                disabled={!enableTP}
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full bg-[#111726] border border-[#1f293d] focus:border-emerald-500 rounded px-2 py-1 text-white font-mono text-[11px] disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* Broker Routing Selector */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            Broker Routing & Execution Bridge
          </label>
          <select
            value={selectedBroker}
            onChange={(e) => setSelectedBroker(e.target.value)}
            className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-2.5 py-1.5 text-white font-mono text-xs outline-none"
          >
            {brokers.map((b) => (
              <option key={b.id} value={b.name} disabled={b.status === 'disconnected'}>
                {b.name} ({b.accountType}) {b.status === 'connected' ? `· Balance: $${b.balance.toLocaleString()}` : '· Disconnected'}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Breakdown */}
        <div className="py-2 border-t border-[#1f293d] text-[11px] font-mono space-y-1 text-slate-400">
          <div className="flex justify-between">
            <span>Total Value:</span>
            <span className="text-white font-semibold">
              ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Est. Fee (0.05%):</span>
            <span>${estimatedFee.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Execution Button */}
        <button
          type="submit"
          className={`w-full py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
            side === 'buy'
              ? 'bg-[#10b981] hover:bg-[#059669] text-slate-950 shadow-emerald-950/50'
              : 'bg-[#f43f5e] hover:bg-[#e11d48] text-white shadow-rose-950/50'
          }`}
        >
          CONFIRM {side.toUpperCase()} ORDER
        </button>
      </form>
    </div>
  );
};
