import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'card';
  onOpenPublishModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'header',
  onOpenPublishModal 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledNotice(true);
        setTimeout(() => setInstalledNotice(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else if (onOpenPublishModal) {
      onOpenPublishModal();
    }
  };

  if (isInstalled && !installedNotice) {
    if (variant === 'header') {
      return (
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-800/40 text-[11px] font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>App Installed</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-gradient-to-r from-[#00d2ff] to-[#0284c7] text-slate-950 hover:brightness-110 shadow-sm transition-all transform active:scale-95"
          title="Install RealTrade View on your Android, iOS, or Desktop PC"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0c1424] via-[#101b33] to-[#0c1424] border border-[#00d2ff]/30 rounded-xl p-3 sm:p-4 text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#00d2ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Get RealTrade View on Mobile & Desktop</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Offline-Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Install as native app for Google Play Store, App Store, or direct home screen access with zero latency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenPublishModal && (
              <button
                onClick={onOpenPublishModal}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162032] hover:bg-[#1d2a42] text-slate-300 border border-slate-700 transition"
              >
                Store Guides
              </button>
            )}
            <button
              onClick={handleInstallClick}
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#00d2ff] text-slate-950 hover:bg-[#38bdf8] transition shadow-md whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isIOS ? 'Install on iPhone' : 'Install RealTrade'}</span>
            </button>
          </div>
        </div>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1320] border border-[#1e293b] p-6 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#00d2ff]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Install on iPhone & iPad</h3>
                  <p className="text-xs text-slate-400">Apple iOS Safari Home Screen App</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="flex items-start gap-3 bg-[#131b2e] p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    Tap the Safari Share Button <Share2 className="w-3.5 h-3.5 text-[#00d2ff]" />
                  </div>
                  <p className="text-slate-400 mt-0.5">
                    At the bottom of your Safari browser window, tap the square icon with an upward arrow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#131b2e] p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-[#00d2ff]" />
                  </div>
                  <p className="text-slate-400 mt-0.5">
                    Scroll down through the actions and select <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#131b2e] p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white">Tap "Add" in Top-Right</div>
                  <p className="text-slate-400 mt-0.5">
                    RealTrade View will now launch directly in full standalone native app mode without browser URL bars!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#00d2ff] text-slate-950 font-bold text-xs hover:bg-[#38bdf8] transition shadow-md"
            >
              Got it, let's trade
            </button>
          </div>
        </div>
      )}
    </>
  );
};
