import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Key, 
  Fingerprint, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  encryptData, 
  decryptData, 
  promptBiometricAuth, 
  playChime, 
  EncryptedPayload 
} from '../utils/security';
import { Position, PriceAlert, UserAccount } from '../types/trading';

interface SecurityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  positions: Position[];
  alerts: PriceAlert[];
  onRestoreData?: (positions: Position[], alerts: PriceAlert[]) => void;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
  positions,
  alerts,
  onRestoreData,
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [vaultStatusMessage, setVaultStatusMessage] = useState<string | null>(null);
  const [isBiometricTesting, setIsBiometricTesting] = useState(false);
  const [lastEncryptedBackup, setLastEncryptedBackup] = useState<EncryptedPayload | null>(null);

  if (!isOpen) return null;

  // Encrypt and download local database backup
  const handleCreateEncryptedVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase || passphrase.length < 6) {
      setVaultStatusMessage('Master passphrase must be at least 6 characters.');
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setVaultStatusMessage('Passphrases do not match.');
      return;
    }

    try {
      const payloadToEncrypt = {
        user,
        positions,
        alerts,
        exportedAt: Date.now()
      };

      const encrypted = await encryptData(payloadToEncrypt, passphrase);
      setLastEncryptedBackup(encrypted);
      
      setUser(prev => ({ ...prev, encryptedVaultActive: true }));
      playChime('success');
      setVaultStatusMessage('AES-GCM 256-bit encrypted database vault generated successfully!');
      
      // Auto trigger encrypted backup file download
      const blob = new Blob([JSON.stringify(encrypted, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `REALTRADE_VIEW_Vault_${new Date().toISOString().split('T')[0]}.enc.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setVaultStatusMessage('Encryption error occurred. Please try again.');
    }
  };

  // Test Biometric WebAuthn
  const handleTestBiometrics = async () => {
    setIsBiometricTesting(true);
    const result = await promptBiometricAuth(user.name);
    setIsBiometricTesting(false);

    if (result.success) {
      setUser(prev => ({ ...prev, biometricRegistered: true }));
      playChime('success');
      setVaultStatusMessage('Biometric fingerprint / FaceID credential registered and active!');
      setTimeout(() => setVaultStatusMessage(null), 3500);
    } else {
      setVaultStatusMessage('Biometric authentication failed or canceled.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#00d2ff]" />
            <div>
              <h3 className="font-bold text-white text-base font-display">
                Local Database Encryption & Biometric Security
              </h3>
              <p className="text-[11px] text-slate-400">
                Client-side AES-GCM 256 hardware vault & WebAuthn touch verification.
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

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {vaultStatusMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-300 font-mono text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{vaultStatusMessage}</span>
            </div>
          )}

          {/* Section 1: Biometric Verification */}
          <div className="p-4 bg-[#111726] border border-[#1f293d] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-[#00d2ff]" />
                <div>
                  <h4 className="font-bold text-white text-xs">Biometric Authentication</h4>
                  <p className="text-[11px] text-slate-400">TouchID, FaceID & Windows Hello passkey login.</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                user.biometricRegistered ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {user.biometricRegistered ? 'Enrolled' : 'Not Enrolled'}
              </span>
            </div>

            <p className="text-slate-300 text-[11px]">
              Protects sensitive portfolio balances, API secrets, and quick-trade verification with device biometric hardware.
            </p>

            <button
              onClick={handleTestBiometrics}
              disabled={isBiometricTesting}
              className="w-full py-2 bg-[#1a2336] hover:bg-[#202b42] text-white font-mono rounded text-xs transition-colors flex items-center justify-center gap-2 border border-[#1f293d]"
            >
              <Fingerprint className="w-4 h-4 text-[#00d2ff]" />
              <span>{isBiometricTesting ? 'Scanning Authenticator...' : user.biometricRegistered ? 'Test / Re-enroll Biometrics' : 'Enroll Device Biometrics'}</span>
            </button>
          </div>

          {/* Section 2: Local Database AES-GCM 256 Encryption */}
          <div className="p-4 bg-[#111726] border border-[#1f293d] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-white text-xs">Local Database Encryption (AES-GCM 256)</h4>
                  <p className="text-[11px] text-slate-400">PBKDF2 100,000 rounds key derivation with authenticated salt.</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                user.encryptedVaultActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {user.encryptedVaultActive ? 'Active' : 'Unencrypted'}
              </span>
            </div>

            <form onSubmit={handleCreateEncryptedVault} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Master Vault Passphrase
                </label>
                <input
                  type="password"
                  placeholder="Enter strong passphrase (min. 6 chars)..."
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white font-mono text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Confirm Master Passphrase
                </label>
                <input
                  type="password"
                  placeholder="Confirm passphrase..."
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white font-mono text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold font-mono rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Lock className="w-4 h-4" />
                <span>Encrypt Database & Export Secure Backup</span>
              </button>
            </form>
          </div>

          {/* Offline & Cross-Platform Sync Notice */}
          <div className="p-3 bg-[#0d121e] rounded border border-[#1f293d] text-[11px] text-slate-400 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
            <p>
              Your local encrypted database runs offline-first. Even without internet connectivity, paper trades and portfolio modifications are safely stored in your encrypted local store.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f293d] bg-[#0f1422] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#141b2b] hover:bg-[#1a2336] text-white font-mono rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
