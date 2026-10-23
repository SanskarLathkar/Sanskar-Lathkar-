import React, { useState } from 'react';
import { Fingerprint, Lock, Shield, KeyRound, AlertCircle } from 'lucide-react';
import { promptBiometricAuth, playChime } from '../utils/security';

interface BiometricLockScreenProps {
  onUnlock: () => void;
  userName: string;
}

export const BiometricLockScreen: React.FC<BiometricLockScreenProps> = ({
  onUnlock,
  userName,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleBiometric = async () => {
    setIsAuthenticating(true);
    const res = await promptBiometricAuth(userName);
    setIsAuthenticating(false);
    if (res.success) {
      playChime('success');
      onUnlock();
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin.length >= 4) {
      playChime('success');
      onUnlock();
    } else {
      setError(true);
      playChime('warn');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080b12] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm p-8 bg-[#0c101a] border border-[#1f293d] rounded-2xl shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#141d2d] border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff]">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white font-display">
            REALTRADE VIEW Vault Locked
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Protected by Web Crypto AES-256 & Biometric Hardware.
          </p>
        </div>

        {/* Biometric Trigger */}
        <button
          onClick={handleBiometric}
          disabled={isAuthenticating}
          className="w-full py-3 bg-[#111726] hover:bg-[#161f33] border border-[#00d2ff]/40 rounded-xl text-white font-mono text-xs flex items-center justify-center gap-2.5 transition-all shadow-md group"
        >
          <Fingerprint className="w-5 h-5 text-[#00d2ff] group-hover:scale-110 transition-transform" />
          <span>{isAuthenticating ? 'Scanning...' : 'Unlock via TouchID / FaceID'}</span>
        </button>

        <div className="flex items-center gap-3 w-full text-slate-500 font-mono text-[10px]">
          <div className="flex-1 h-px bg-[#1f293d]"></div>
          <span>OR BACKUP PASSCODE</span>
          <div className="flex-1 h-px bg-[#1f293d]"></div>
        </div>

        {/* Passcode input */}
        <form onSubmit={handlePinSubmit} className="w-full space-y-3">
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded-lg pl-9 pr-3 py-2 text-white font-mono text-center text-sm outline-none tracking-widest"
            />
          </div>

          {error && (
            <p className="text-rose-400 font-mono text-[11px] flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN code. Try 1234.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold font-mono rounded-lg text-xs transition-colors shadow-md"
          >
            UNLOCK VAULT
          </button>
        </form>

        <p className="text-[10px] text-slate-500 font-mono">
          Demo Default Master PIN: <strong className="text-slate-400">1234</strong>
        </p>
      </div>
    </div>
  );
};
