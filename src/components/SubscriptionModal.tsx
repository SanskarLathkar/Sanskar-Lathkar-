import React, { useState } from 'react';
import { SubscriptionTier, PaymentMethod, UserAccount, BillingCycle } from '../types/trading';
import { 
  X, 
  Check, 
  CreditCard, 
  QrCode, 
  Building, 
  Send, 
  ShieldCheck, 
  Zap, 
  FileText,
  DollarSign,
  Copy,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { playChime } from '../utils/security';
import { SUBSCRIPTION_TIERS_CONFIG, BILLING_CYCLES_CONFIG } from '../data/subscriptionPlans';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
}) => {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(user.billingCycle || 'monthly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(user.tier === 'free' ? 'pro' : user.tier);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('crypto_usdt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [upiId, setUpiId] = useState('trader@okaxis');
  const [selectedBank, setSelectedBank] = useState('Chase Bank (USA)');

  if (!isOpen) return null;

  const currentTierConfig = SUBSCRIPTION_TIERS_CONFIG.find(t => t.id === selectedTier) || SUBSCRIPTION_TIERS_CONFIG[1];
  const activeCycleConfig = BILLING_CYCLES_CONFIG.find(c => c.id === selectedCycle) || BILLING_CYCLES_CONFIG[1];
  const currentPrice = currentTierConfig.pricing[selectedCycle];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setUser(prev => ({
        ...prev,
        tier: selectedTier,
        billingCycle: selectedCycle,
        subscriptionExpiresAt: Date.now() + activeCycleConfig.days * 24 * 3600 * 1000
      }));
      setPaymentSuccess(true);
      playChime('success');

      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-[#00d2ff]" />
            <div>
              <h3 className="font-bold text-white text-base font-display">
                REALTRADE VIEW Pro Subscription Gateway
              </h3>
              <p className="text-[11px] text-slate-400">
                Weekly, monthly, 3-month, 6-month, and annual passes for all trader tiers.
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

        {paymentSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[#10b981] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Subscription Successfully Activated!
            </h3>
            <p className="text-slate-300 max-w-md font-mono text-xs">
              Welcome to the <span className="text-[#00d2ff] font-bold uppercase">{selectedTier.replace('_', ' ')}</span> Tier ({activeCycleConfig.shortLabel} Pass). Your account credentials have been synchronized and all pro trading indicators and broker feeds are unlocked.
            </p>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto space-y-6">
            
            {/* 1. Five Billing Duration Options: Weekly, Monthly, 3 Months, 6 Months, Yearly */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  1. Select Duration / Cycle
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {activeCycleConfig.discountText || `${activeCycleConfig.days} Days Pass`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {BILLING_CYCLES_CONFIG.map((cycle) => (
                  <button
                    key={cycle.id}
                    type="button"
                    onClick={() => setSelectedCycle(cycle.id)}
                    className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all relative ${
                      selectedCycle === cycle.id
                        ? 'bg-[#00d2ff] text-slate-950 font-bold border-[#00d2ff] shadow-md shadow-cyan-950/40 scale-[1.02]'
                        : 'bg-[#101625] text-slate-300 border-[#1f293d] hover:text-white hover:bg-[#162136]'
                    }`}
                  >
                    {cycle.badge && (
                      <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.2 rounded font-bold shadow-sm ${
                        selectedCycle === cycle.id
                          ? 'bg-slate-950 text-cyan-300 border border-cyan-800'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {cycle.badge}
                      </span>
                    )}
                    <div className="font-semibold">{cycle.shortLabel}</div>
                    <div className={`text-[10px] ${selectedCycle === cycle.id ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {cycle.days} Days
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Subscription Tiers Comparison */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-3 font-bold">
                2. Select Trading Tier
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SUBSCRIPTION_TIERS_CONFIG.map((tier) => {
                  const price = tier.pricing[selectedCycle];
                  const isSelected = selectedTier === tier.id;

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-[#141d2d] border-[#00d2ff] shadow-lg shadow-cyan-950/40 ring-1 ring-[#00d2ff]/40'
                          : 'bg-[#0f1422] border-[#1f293d] hover:border-slate-600'
                      }`}
                    >
                      {tier.badge && (
                        <div className="absolute -top-2 right-2 px-2 py-0.2 rounded bg-[#00d2ff] text-slate-950 font-bold text-[9px] font-mono uppercase">
                          {tier.badge}
                        </div>
                      )}

                      <div>
                        <span className="text-xs font-mono font-bold text-white block mb-1">
                          {tier.name}
                        </span>
                        <div className="text-xl font-bold text-white font-mono">
                          ${price} <span className="text-xs text-slate-400 font-normal">{activeCycleConfig.periodLabel}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 min-h-[28px] leading-tight">
                          {tier.description}
                        </p>
                        
                        <ul className="mt-3 space-y-1.5 text-[10px] text-slate-300">
                          {tier.features.slice(0, 3).map((f, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button 
                        type="button"
                        className={`w-full mt-4 py-1.5 rounded font-mono text-[11px] transition-colors ${
                          isSelected ? 'bg-[#00d2ff] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {user.tier === tier.id ? 'Current Plan' : isSelected ? 'Selected' : 'Choose'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Payment Rails & Methods */}
            {selectedTier !== 'free' && (
              <div className="pt-4 border-t border-[#1f293d]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    3. Select Payment Gateway Rail
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Total Due: <span className="text-[#00d2ff]">${currentPrice}.00 USD</span> for {activeCycleConfig.name}
                  </span>
                </div>

                {/* Gateway Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 mb-4">
                  {[
                    { id: 'crypto_usdt', label: 'USDT / Crypto' },
                    { id: 'credit_card', label: 'Credit Card' },
                    { id: 'debit_card', label: 'Debit Card' },
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'net_banking', label: 'Net Banking' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'bank_transfer', label: 'Bank Wire' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`py-2 px-1 rounded text-center font-mono text-[11px] transition-colors border ${
                        paymentMethod === method.id
                          ? 'bg-[#1a2336] text-[#00d2ff] border-[#00d2ff]/40 font-semibold shadow-sm'
                          : 'bg-[#101625] text-slate-400 border-[#1f293d] hover:text-slate-200'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* Gateway Form Detail */}
                <form onSubmit={handleProcessPayment} className="p-4 bg-[#111726] border border-[#1f293d] rounded-xl space-y-4 font-mono text-xs">
                  {paymentMethod === 'crypto_usdt' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-white">Crypto Gateway: USDT (TRC-20 & ERC-20)</span>
                        <span className="text-emerald-400 text-[11px]">Instant Blockchain Confirmation</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#0a0d14] rounded-lg border border-[#1f293d]">
                        {/* Simulated QR Code */}
                        <div className="w-24 h-24 bg-white p-1 rounded flex items-center justify-center shrink-0">
                          <QrCode className="w-20 h-20 text-slate-900" />
                        </div>

                        <div className="flex-1 space-y-1.5 w-full">
                          <span className="text-[10px] text-slate-500 uppercase block">Deposit Address (TRC-20 / ERC-20)</span>
                          <div className="flex items-center justify-between p-2 bg-[#141c2c] rounded border border-[#1f293d] text-slate-200 text-[11px]">
                            <span className="truncate pr-2">TXyZ98RealTradeCryptoDepositUSDT8947b2c</span>
                            <button
                              type="button"
                              onClick={() => handleCopy('TXyZ98RealTradeCryptoDepositUSDT8947b2c')}
                              className="text-slate-400 hover:text-white shrink-0"
                            >
                              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            Send exactly <strong className="text-white">${currentPrice}.00 USDT</strong> to activate your {activeCycleConfig.shortLabel} pass.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-white">
                          {paymentMethod === 'credit_card' ? 'Credit Card Payment' : 'Debit Card Direct'}
                        </span>
                        <span className="text-slate-400 text-[11px]">256-Bit SSL Encrypted</span>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8892"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-[#0a0d14] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Expiration (MM/YY)</label>
                          <input
                            type="text"
                            placeholder="12/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-[#0a0d14] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Security Code (CVC)</label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full bg-[#0a0d14] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-white">Unified Payments Interface (UPI)</span>
                        <span className="text-emerald-400 text-[11px]">Instant Verification</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#0a0d14] rounded-lg border border-[#1f293d]">
                        <div className="w-24 h-24 bg-white p-1 rounded flex items-center justify-center shrink-0">
                          <QrCode className="w-20 h-20 text-slate-900" />
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">Enter UPI VPA ID</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full bg-[#141c2c] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-1.5 text-white outline-none"
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Supports Google Pay, PhonePe, Paytm, BHIM, and banking UPI apps.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'net_banking' && (
                    <div className="space-y-3">
                      <label className="block text-[11px] text-slate-400 mb-1">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-[#0a0d14] border border-[#1f293d] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                      >
                        <option value="Chase Bank (USA)">Chase Bank (USA)</option>
                        <option value="Bank of America (USA)">Bank of America (USA)</option>
                        <option value="Citibank Global">Citibank Global</option>
                        <option value="HDFC Bank (India)">HDFC Bank (India)</option>
                        <option value="ICICI Bank (India)">ICICI Bank (India)</option>
                        <option value="SBI (State Bank of India)">SBI (State Bank of India)</option>
                        <option value="HSBC Premier (UK/Global)">HSBC Premier (UK/Global)</option>
                        <option value="Barclays Corporate (UK)">Barclays Corporate (UK)</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-3 text-center py-2">
                      <p className="text-slate-300">
                        You will be authenticated via PayPal Express Checkout with 1-click subscription tokenization.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <div className="space-y-2 p-3 bg-[#0a0d14] rounded border border-[#1f293d] text-[11px] text-slate-300">
                      <div className="font-semibold text-white">Direct SWIFT / Wire Transfer Details:</div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                        <div>Bank Name: <span className="text-white">J.P. Morgan Securities LLC</span></div>
                        <div>SWIFT / BIC: <span className="text-white">CHASUS33XXX</span></div>
                        <div>IBAN: <span className="text-white">US92CHAS000192837482</span></div>
                        <div>Reference: <span className="text-[#00d2ff]">REALTRADE-{user.id.slice(0, 6)}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Submit Checkout Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold font-mono rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>Validating Transaction Rails...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>
                            AUTHORIZE ${currentPrice}.00 USD ({activeCycleConfig.shortLabel}) & ACTIVATE {selectedTier.replace('_', ' ').toUpperCase()}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
