import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  Palette, 
  Sliders, 
  Monitor, 
  DollarSign, 
  Clock, 
  Check, 
  Volume2 
} from 'lucide-react';
import { playChime } from '../../utils/security';

export interface ChartSettingsConfig {
  showCountdown: boolean;
  showBuySellButtons: boolean;
  showVolumeProfile: boolean;
  showGridLines: boolean;
  showWatermark: boolean;
  bullColor: string;
  bearColor: string;
  themeBackground: 'obsidian' | 'charcoal' | 'midnight';
}

interface ChartSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChartSettingsConfig;
  setSettings: React.Dispatch<React.SetStateAction<ChartSettingsConfig>>;
}

export const ChartSettingsModal: React.FC<ChartSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'symbol' | 'scales' | 'appearance' | 'trading'>('symbol');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-[#00d2ff]" />
            <h3 className="font-bold text-white text-base font-display">
              Chart Settings & Supercharts Properties
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2336] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Layout: Sidebar tabs + Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1f293d] min-h-[320px]">
          {/* Tabs */}
          <div className="p-3 bg-[#090c14] space-y-1 font-mono">
            {[
              { id: 'symbol', label: 'Symbol / Candles', icon: Palette },
              { id: 'scales', label: 'Scales & Ticker', icon: Sliders },
              { id: 'appearance', label: 'Canvas Appearance', icon: Monitor },
              { id: 'trading', label: 'Trading & Executions', icon: DollarSign },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left transition-colors text-xs ${
                    isActive ? 'bg-[#182236] text-[#00d2ff] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="md:col-span-3 p-5 bg-[#0c101a] space-y-4 font-mono text-xs">
            {activeTab === 'symbol' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f293d]">
                  <span className="font-bold text-white">Candlestick Palette</span>
                  <span className="text-[10px] text-slate-500">TradingView Pro Colors</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bullish Candle Body</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.bullColor}
                        onChange={(e) => setSettings(p => ({ ...p, bullColor: e.target.value }))}
                        className="w-8 h-8 rounded border border-[#1f293d] bg-transparent cursor-pointer"
                      />
                      <span className="text-white uppercase">{settings.bullColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bearish Candle Body</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.bearColor}
                        onChange={(e) => setSettings(p => ({ ...p, bearColor: e.target.value }))}
                        className="w-8 h-8 rounded border border-[#1f293d] bg-transparent cursor-pointer"
                      />
                      <span className="text-white uppercase">{settings.bearColor}</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-center justify-between p-2.5 rounded bg-[#111726] border border-[#1f293d] cursor-pointer">
                  <div>
                    <span className="text-white block font-medium">Volume Profile (Fixed Range)</span>
                    <span className="text-[10px] text-slate-500">Horizontal volume distribution with POC line</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showVolumeProfile}
                    onChange={(e) => setSettings(p => ({ ...p, showVolumeProfile: e.target.checked }))}
                    className="accent-[#00d2ff]"
                  />
                </label>
              </div>
            )}

            {activeTab === 'scales' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f293d]">
                  <span className="font-bold text-white">Price Scales & Timers</span>
                  <span className="text-[10px] text-slate-500">Right Axis Elements</span>
                </div>

                <label className="flex items-center justify-between p-2.5 rounded bg-[#111726] border border-[#1f293d] cursor-pointer">
                  <div>
                    <span className="text-white block font-medium">Countdown to Bar Close</span>
                    <span className="text-[10px] text-slate-500">Displays real-time countdown timer next to price</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showCountdown}
                    onChange={(e) => setSettings(p => ({ ...p, showCountdown: e.target.checked }))}
                    className="accent-[#00d2ff]"
                  />
                </label>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f293d]">
                  <span className="font-bold text-white">Canvas Tone & Background</span>
                  <span className="text-[10px] text-slate-500">Dark Mode Contrast</span>
                </div>

                <label className="flex items-center justify-between p-2.5 rounded bg-[#111726] border border-[#1f293d] cursor-pointer">
                  <div>
                    <span className="text-white block font-medium">Horizontal & Vertical Grid Lines</span>
                    <span className="text-[10px] text-slate-500">Subtle background coordinate lines</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showGridLines}
                    onChange={(e) => setSettings(p => ({ ...p, showGridLines: e.target.checked }))}
                    className="accent-[#00d2ff]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded bg-[#111726] border border-[#1f293d] cursor-pointer">
                  <div>
                    <span className="text-white block font-medium">Symbol Watermark</span>
                    <span className="text-[10px] text-slate-500">Large background symbol name on canvas</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showWatermark}
                    onChange={(e) => setSettings(p => ({ ...p, showWatermark: e.target.checked }))}
                    className="accent-[#00d2ff]"
                  />
                </label>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f293d]">
                  <span className="font-bold text-white">In-Chart Execution Controls</span>
                  <span className="text-[10px] text-slate-500">1-Click Fast Trading</span>
                </div>

                <label className="flex items-center justify-between p-2.5 rounded bg-[#111726] border border-[#1f293d] cursor-pointer">
                  <div>
                    <span className="text-white block font-medium">Buy/Sell Buttons on Chart</span>
                    <span className="text-[10px] text-slate-500">Floating 1-click execution widget in top left of canvas</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showBuySellButtons}
                    onChange={(e) => setSettings(p => ({ ...p, showBuySellButtons: e.target.checked }))}
                    className="accent-[#00d2ff]"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1f293d] bg-[#0f1422] flex items-center justify-between">
          <button
            onClick={() => {
              setSettings({
                showCountdown: true,
                showBuySellButtons: true,
                showVolumeProfile: true,
                showGridLines: true,
                showWatermark: true,
                bullColor: '#10b981',
                bearColor: '#f43f5e',
                themeBackground: 'obsidian'
              });
              playChime('trade');
            }}
            className="text-slate-400 hover:text-white font-mono text-[11px]"
          >
            Reset to Defaults
          </button>

          <button
            onClick={() => {
              playChime('success');
              onClose();
            }}
            className="px-4 py-1.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold font-mono rounded text-xs transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
