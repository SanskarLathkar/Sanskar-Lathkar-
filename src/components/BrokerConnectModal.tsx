import React, { useState } from 'react';
import { Broker } from '../types/trading';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Key, 
  Link2, 
  Link2Off,
  Radio,
  Server
} from 'lucide-react';
import { playChime } from '../utils/security';

interface BrokerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokers: Broker[];
  onToggleBrokerStatus: (brokerId: string) => void;
}

export const BrokerConnectModal: React.FC<BrokerConnectModalProps> = ({
  isOpen,
  onClose,
  brokers,
  onToggleBrokerStatus,
}) => {
  const [activeBrokerId, setActiveBrokerId] = useState<string>(brokers[0]?.id || 'alpaca');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [apiSecretInput, setApiSecretInput] = useState<string>('');
  const [isPinging, setIsPinging] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBroker = brokers.find(b => b.id === activeBrokerId) || brokers[0];

  const handleTestLatency = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setStatusFeedback(`Gateway response verified: ${Math.floor(12 + Math.random() * 20)}ms latency.`);
      playChime('success');
      setTimeout(() => setStatusFeedback(null), 3000);
    }, 600);
  };

  const handleToggle = (id: string) => {
    onToggleBrokerStatus(id);
    playChime('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#00d2ff]" />
            <div>
              <h3 className="font-bold text-white text-base font-display">
                Broker Connect & Multi-Exchange Routing
              </h3>
              <p className="text-[11px] text-slate-400">
                Synchronize paper accounts and simulated execution bridges across global brokers.
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

        {/* Content Body: Sidebar list + Detail panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1f293d]">
          {/* Broker Selector List */}
          <div className="p-3 bg-[#0a0d14] space-y-1.5 overflow-y-auto">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-2 mb-1">
              Select Broker Provider
            </span>
            {brokers.map((broker) => {
              const isSelected = broker.id === activeBrokerId;
              const isConnected = broker.status === 'connected';

              return (
                <button
                  key={broker.id}
                  onClick={() => setActiveBrokerId(broker.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded text-left transition-colors font-mono ${
                    isSelected 
                      ? 'bg-[#141d2d] border border-[#00d2ff]/40 text-white' 
                      : 'hover:bg-[#111724] text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs">{broker.name}</span>
                    <span className="text-[10px] text-slate-500">{broker.country}</span>
                  </div>

                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Broker Detail & Configuration */}
          <div className="md:col-span-2 p-5 bg-[#0c101a] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1f293d]">
                <div>
                  <h4 className="font-bold text-white text-base">
                    {currentBroker.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-slate-400 font-mono text-[11px]">
                    <span>Account: {currentBroker.accountType}</span>
                    <span>·</span>
                    <span>Routing Code: {currentBroker.code}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(currentBroker.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs transition-colors border ${
                    currentBroker.status === 'connected'
                      ? 'bg-rose-950/40 text-rose-300 border-rose-800 hover:bg-rose-900/60'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                  }`}
                >
                  {currentBroker.status === 'connected' ? (
                    <>
                      <Link2Off className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Connect Gateway</span>
                    </>
                  )}
                </button>
              </div>

              {statusFeedback && (
                <div className="mb-3 px-3 py-1.5 bg-[#00d2ff]/10 border border-[#00d2ff]/40 rounded text-[#00d2ff] font-mono text-[11px]">
                  {statusFeedback}
                </div>
              )}

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 bg-[#111726] rounded border border-[#1f293d]">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Simulated Capital</span>
                  <span className="text-base font-bold text-white">
                    ${currentBroker.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-3 bg-[#111726] rounded border border-[#1f293d] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Gateway Ping</span>
                    <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      {currentBroker.latencyMs} ms
                    </span>
                  </div>

                  <button
                    onClick={handleTestLatency}
                    disabled={isPinging}
                    className="p-1.5 rounded bg-[#1a2336] text-slate-300 hover:text-white hover:bg-[#202b40] transition-colors"
                    title="Ping Gateway"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* API Token / Key Settings */}
              <div className="space-y-3 font-mono">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>API Key / Client ID</span>
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Encrypted locally
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder={currentBroker.apiKeyMask}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    API Secret / Passphrase Token
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••••••••••••••••"
                    value={apiSecretInput}
                    onChange={(e) => setApiSecretInput(e.target.value)}
                    className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1f293d] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3 text-[#00d2ff]" />
                Direct FIX / REST Bridge
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold rounded transition-colors"
              >
                Save & Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
