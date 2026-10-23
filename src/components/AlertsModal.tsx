import React, { useState } from 'react';
import { Asset, PriceAlert } from '../types/trading';
import { 
  X, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  CheckCircle2, 
  Volume2 
} from 'lucide-react';
import { playChime } from '../utils/security';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  alerts: PriceAlert[];
  onCreateAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (alertId: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  asset,
  alerts,
  onCreateAlert,
  onDeleteAlert,
}) => {
  const [targetPrice, setTargetPrice] = useState<string>((asset.price * 1.03).toFixed(2));
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [note, setNote] = useState<string>('Breakout resistance target');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPrice = asset.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (!priceNum || priceNum <= 0) return;

    onCreateAlert({
      assetId: asset.id,
      symbol: asset.symbol,
      targetPrice: priceNum,
      direction,
      note
    });

    playChime('alert');
    setFeedback(`Alert armed for ${asset.symbol} ${direction === 'above' ? '≥' : '≤'} $${priceNum}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const assetAlerts = alerts.filter(a => a.assetId === asset.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#00d2ff]" />
            <div>
              <h3 className="font-bold text-white text-base font-display">
                Custom Price Alert Desk
              </h3>
              <p className="text-[11px] text-slate-400">
                Trigger real-time threshold notifications and audio chimes for {asset.symbol}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2336] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {feedback && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-300 font-mono text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Current Asset Info */}
          <div className="flex items-center justify-between p-3 bg-[#111726] rounded-lg border border-[#1f293d] font-mono">
            <div>
              <span className="font-bold text-white text-sm">{asset.symbol}</span>
              <span className="text-[11px] text-slate-400 block">{asset.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-100">
                ${currentPrice < 10 ? currentPrice.toFixed(4) : currentPrice.toFixed(2)}
              </span>
              <span className={`text-[10px] block ${asset.change24h >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 font-mono">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('above')}
                className={`py-2 rounded font-semibold text-[11px] transition-colors border flex items-center justify-center gap-1.5 ${
                  direction === 'above'
                    ? 'bg-emerald-950/50 text-[#10b981] border-emerald-500/40'
                    : 'bg-[#111726] text-slate-400 border-[#1f293d]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Price Rises Above (≥)</span>
              </button>

              <button
                type="button"
                onClick={() => setDirection('below')}
                className={`py-2 rounded font-semibold text-[11px] transition-colors border flex items-center justify-center gap-1.5 ${
                  direction === 'below'
                    ? 'bg-rose-950/50 text-[#f43f5e] border-rose-500/40'
                    : 'bg-[#111726] text-slate-400 border-[#1f293d]'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Price Drops Below (≤)</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Target Price (USD)</label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Alert Note / Strategy Rationale</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Take partial profit at key Fibonacci resistance"
                className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Arm Alert with Audio Chime</span>
            </button>
          </form>

          {/* Active Alerts List for this asset */}
          <div className="pt-2 border-t border-[#1f293d]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Armed Alerts for {asset.symbol} ({assetAlerts.length})
            </span>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {assetAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-2 rounded bg-[#111726] border border-[#1f293d] text-[11px] font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className={alert.direction === 'above' ? 'text-[#10b981]' : 'text-[#f43f5e]'}>
                      {alert.direction === 'above' ? '≥' : '≤'} ${alert.targetPrice}
                    </span>
                    {alert.note && <span className="text-slate-400 text-[10px] truncate max-w-[160px]">· {alert.note}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase ${
                      alert.triggered ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {alert.triggered ? 'Triggered' : 'Armed'}
                    </span>
                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {assetAlerts.length === 0 && (
                <p className="text-[11px] text-slate-500 font-mono text-center py-2">
                  No alerts set for this asset.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
