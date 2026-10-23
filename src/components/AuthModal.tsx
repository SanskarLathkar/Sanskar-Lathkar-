import React, { useState } from 'react';
import { UserAccount } from '../types/trading';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Fingerprint, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { promptBiometricAuth, playChime } from '../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(user.email || 'trader@realtrade.view');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState(user.name || 'Alex Morgan');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      email,
      name: name || 'Pro Trader',
      lastSyncTimestamp: Date.now()
    }));

    playChime('success');
    setFeedback(`${isSignUp ? 'Account registered' : 'Signed in'} successfully! Cloud sync active.`);
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1200);
  };

  const handleBiometricLogin = async () => {
    const res = await promptBiometricAuth(name || 'Trader');
    if (res.success) {
      setUser(prev => ({
        ...prev,
        biometricRegistered: true,
        lastSyncTimestamp: Date.now()
      }));
      playChime('success');
      setFeedback('Biometric authentication verified! Access granted.');
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#00d2ff]" />
            <h3 className="font-bold text-white text-base font-display">
              {isSignUp ? 'Create REALTRADE Account' : 'Sign In to Terminal'}
            </h3>
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

          {/* Quick Biometric 1-Click Login Button */}
          <button
            type="button"
            onClick={handleBiometricLogin}
            className="w-full py-2.5 px-3 bg-[#111726] hover:bg-[#172033] border border-[#00d2ff]/40 rounded text-slate-200 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Fingerprint className="w-4 h-4 text-[#00d2ff]" />
            <span>1-Click Biometric Login (TouchID / FaceID)</span>
          </button>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-[10px]">
            <div className="flex-1 h-px bg-[#1f293d]"></div>
            <span>OR EMAIL CREDENTIALS</span>
            <div className="flex-1 h-px bg-[#1f293d]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 font-mono">
            {isSignUp && (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Trader Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded pl-8 pr-3 py-1.5 text-white outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@realtrade.view"
                  className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded pl-8 pr-3 py-1.5 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Passphrase / Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded pl-8 pr-3 py-1.5 text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSignUp ? 'CREATE ACCOUNT & SYNC' : 'SIGN IN & CONNECT'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-slate-400 hover:text-[#00d2ff] font-mono text-[11px] transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
