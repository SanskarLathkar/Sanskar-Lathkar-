import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Award, 
  Layers, 
  FileText, 
  Clock, 
  Shield, 
  ChevronDown,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserAccount, SubscriptionTier, BillingCycle, PaymentMethod } from '../types/trading';
import { 
  SUBSCRIPTION_TIERS_CONFIG, 
  BILLING_CYCLES_CONFIG, 
  SUPPORTED_CURRENCIES, 
  PlanTierConfig 
} from '../data/subscriptionPlans';
import { playChime } from '../utils/security';

interface SubscriptionViewProps {
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  onOpenSupercharts?: () => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  user,
  setUser,
  onOpenSupercharts
}) => {
  // Billing cycle state: weekly, monthly, 3months, 6months, yearly
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(user.billingCycle || 'monthly');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');
  const [selectedTierId, setSelectedTierId] = useState<SubscriptionTier>(user.tier === 'free' ? 'pro' : user.tier);
  
  // Checkout & Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('crypto_usdt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // Form Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [upiId, setUpiId] = useState('trader@okaxis');
  const [selectedBank, setSelectedBank] = useState('Chase Bank (USA)');

  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrencyCode) || SUPPORTED_CURRENCIES[0];
  const activeCycleConfig = BILLING_CYCLES_CONFIG.find(c => c.id === selectedCycle) || BILLING_CYCLES_CONFIG[1];
  const activePlanConfig = SUBSCRIPTION_TIERS_CONFIG.find(t => t.id === selectedTierId) || SUBSCRIPTION_TIERS_CONFIG[1];

  const formatPrice = (usdAmount: number) => {
    if (usdAmount === 0) return 'Free';
    const converted = usdAmount * currentCurrency.rate;
    if (currentCurrency.code === 'INR') {
      return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${converted.toFixed(converted % 1 === 0 ? 0 : 2)}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSelectPlan = (tier: PlanTierConfig) => {
    setSelectedTierId(tier.id);
    if (tier.id === 'free') {
      // Free is instant
      setUser(prev => ({
        ...prev,
        tier: 'free',
        billingCycle: undefined
      }));
      playChime('success');
    } else {
      setShowCheckoutForm(true);
      // Smooth scroll to checkout form
      const checkoutEl = document.getElementById('checkout-anchor');
      if (checkoutEl) {
        checkoutEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAuthorizePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const expirationDays = activeCycleConfig.days;
      setUser(prev => ({
        ...prev,
        tier: selectedTierId,
        billingCycle: selectedCycle,
        subscriptionExpiresAt: Date.now() + expirationDays * 24 * 3600 * 1000
      }));
      setPaymentSuccess(true);
      playChime('success');

      setTimeout(() => {
        setPaymentSuccess(false);
        setShowCheckoutForm(false);
      }, 3500);
    }, 1400);
  };

  return (
    <div className="flex flex-col flex-1 bg-[#070b12] text-slate-200 overflow-y-auto pb-20">
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-b from-[#0f172a] via-[#090d18] to-[#070b12] border-b border-[#1c273c] px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>REALTRADE VIEW SUBSCRIPTION STATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Institutional Charting & Multi-Rail Plans
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm font-sans leading-relaxed">
            Choose your flexible trading rhythm: weekly sprint passes, monthly agility, 3-month & 6-month seasonal packages, or the maximum-discount annual VIP license.
          </p>

          {/* Current User Active Plan Status Strip */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="bg-[#0e1626] border border-[#1f2d47] rounded-xl p-3 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  user.tier === 'institutional' 
                    ? 'bg-purple-950/60 text-purple-400 border border-purple-700/50' 
                    : user.tier === 'pro' || user.tier === 'pro_plus'
                    ? 'bg-cyan-950/60 text-[#00d2ff] border border-cyan-800/50' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Current Account Status:</span>
                    <span className="text-xs font-mono font-bold text-white uppercase bg-[#162136] px-2 py-0.5 rounded border border-[#233352]">
                      {user.tier.replace('_', ' ')} Plan
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Cycle: <strong className="text-slate-200 capitalize">{user.billingCycle || 'Active'}</strong> • All connected brokers & indicators synchronized.
                  </p>
                </div>
              </div>

              {onOpenSupercharts && (
                <button
                  onClick={onOpenSupercharts}
                  className="hidden sm:flex items-center gap-1 text-xs font-mono text-[#00d2ff] hover:underline"
                >
                  <span>Launch Charts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 space-y-10">

        {/* 2. Controls: Billing Cycle Selector (Weekly / Monthly / 3 Months / 6 Months / Yearly) & Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-[#1e2a40] p-4 rounded-2xl shadow-xl">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
              Select Subscription Duration:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {BILLING_CYCLES_CONFIG.map(cycle => (
                <button
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle.id)}
                  className={`px-3 py-2 rounded-xl text-center font-mono text-xs transition-all relative ${
                    selectedCycle === cycle.id
                      ? 'bg-[#00d2ff] text-slate-950 font-bold shadow-lg shadow-cyan-950/50 scale-[1.02]'
                      : 'bg-[#131b2b] text-slate-300 hover:text-white hover:bg-[#1a2538] border border-[#1f293d]'
                  }`}
                >
                  {cycle.badge && (
                    <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.2 rounded-full font-bold whitespace-nowrap shadow-sm ${
                      selectedCycle === cycle.id
                        ? 'bg-slate-950 text-cyan-300 border border-cyan-800'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {cycle.badge}
                    </span>
                  )}
                  <div className="font-semibold text-xs">{cycle.shortLabel}</div>
                  <div className={`text-[10px] ${selectedCycle === cycle.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {cycle.days} Days
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
              Display Currency:
            </span>
            <div className="flex items-center gap-1 bg-[#131b2b] p-1 rounded-xl border border-[#1f293d]">
              {SUPPORTED_CURRENCIES.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => setSelectedCurrencyCode(curr.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    selectedCurrencyCode === curr.code
                      ? 'bg-[#1b263b] text-[#00d2ff] font-bold border border-[#00d2ff]/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Subscription Cards Grid (Free, Pro, Pro+, Institutional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUBSCRIPTION_TIERS_CONFIG.map(tier => {
            const rawPrice = tier.pricing[selectedCycle];
            const isCurrentPlan = user.tier === tier.id;
            const isSelected = selectedTierId === tier.id;

            // Equivalent monthly rate calculation for multi-month plans
            let equivalentMonthly = rawPrice;
            if (selectedCycle === '3months') equivalentMonthly = rawPrice / 3;
            if (selectedCycle === '6months') equivalentMonthly = rawPrice / 6;
            if (selectedCycle === 'yearly') equivalentMonthly = rawPrice / 12;

            return (
              <div
                key={tier.id}
                className={`rounded-2xl border transition-all flex flex-col justify-between p-5 relative ${
                  tier.popular
                    ? 'bg-[#0f172a] border-[#00d2ff] shadow-2xl shadow-cyan-950/40 ring-1 ring-[#00d2ff]/50'
                    : isSelected
                    ? 'bg-[#0d1424] border-slate-500 shadow-xl'
                    : 'bg-[#0b101b] border-[#1d273c] hover:border-slate-600'
                }`}
              >
                {/* Popular / Enterprise Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#00d2ff] text-slate-950 font-bold text-[10px] font-mono uppercase tracking-wide shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div>
                  {/* Tier Title */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-base font-display">{tier.name}</h3>
                    {isCurrentPlan && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 min-h-[32px] leading-tight mb-4">
                    {tier.description}
                  </p>

                  {/* Price Block */}
                  <div className="bg-[#080d17] p-3.5 rounded-xl border border-[#1a253a] mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                        {formatPrice(rawPrice)}
                      </span>
                      {rawPrice > 0 && (
                        <span className="text-xs text-slate-400 font-mono">
                          {activeCycleConfig.periodLabel}
                        </span>
                      )}
                    </div>

                    {/* Multi-month breakdown note */}
                    {rawPrice > 0 && selectedCycle !== 'weekly' && selectedCycle !== 'monthly' && (
                      <div className="text-[10px] font-mono text-cyan-400 mt-1">
                        Equivalent to ~{formatPrice(equivalentMonthly)}/mo
                      </div>
                    )}

                    {rawPrice > 0 && selectedCycle === 'yearly' && (
                      <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        🎉 Save 25% + 2 Months Free
                      </div>
                    )}
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-4 border-t border-[#172033]">
                  <button
                    onClick={() => handleSelectPlan(tier)}
                    className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCurrentPlan
                        ? 'bg-[#182338] text-slate-300 border border-[#233352] hover:bg-[#202e48]'
                        : tier.popular
                        ? 'bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 shadow-lg shadow-cyan-950/50 hover:scale-[1.02]'
                        : tier.id === 'institutional'
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/50 hover:scale-[1.02]'
                        : 'bg-[#162136] hover:bg-[#1e2c45] text-white border border-[#233352]'
                    }`}
                  >
                    <span>
                      {isCurrentPlan ? 'Current Active Plan' : tier.id === 'free' ? 'Downgrade to Free' : `Choose ${tier.name}`}
                    </span>
                    {!isCurrentPlan && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Interactive Checkout Anchor & Payment Rail Gateway */}
        <div id="checkout-anchor" className="scroll-mt-6">
          {(showCheckoutForm || selectedTierId !== 'free') && (
            <div className="bg-[#0b101b] border border-[#1e2a40] rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b273d]">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#00d2ff]" />
                    <h2 className="text-lg font-bold text-white font-display">
                      Multi-Rail Checkout Gateway
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Order for <strong className="text-white">{activePlanConfig.name}</strong> on the <strong className="text-cyan-300 uppercase">{activeCycleConfig.name}</strong> ({activeCycleConfig.days} Days).
                  </p>
                </div>

                <div className="bg-[#080d17] p-3 rounded-xl border border-[#1a253a] text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">TOTAL AMOUNT DUE:</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {formatPrice(activePlanConfig.pricing[selectedCycle])}
                  </span>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="p-10 text-center flex flex-col items-center justify-center space-y-3 bg-[#080d17] rounded-xl border border-emerald-500/40">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Payment Confirmed & License Activated!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md font-mono">
                    Your <span className="text-[#00d2ff] font-bold uppercase">{activePlanConfig.name}</span> ({activeCycleConfig.shortLabel}) has been activated. Sub-millisecond data feeds and unlocked indicators are now live.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Payment Method Switcher */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                      Choose Your Payment Method:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {[
                        { id: 'crypto_usdt', label: 'USDT / Crypto', icon: QrCode },
                        { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                        { id: 'debit_card', label: 'Debit Card', icon: CreditCard },
                        { id: 'upi', label: 'UPI / QR', icon: QrCode },
                        { id: 'net_banking', label: 'Net Banking', icon: FileText },
                        { id: 'paypal', label: 'PayPal', icon: ExternalLink },
                        { id: 'bank_transfer', label: 'Bank Wire', icon: Building2Icon }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                          className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all flex flex-col items-center gap-1 ${
                            paymentMethod === method.id
                              ? 'bg-[#172236] text-[#00d2ff] border-[#00d2ff]/60 font-bold shadow-md'
                              : 'bg-[#0f1523] text-slate-400 border-[#1c273a] hover:text-white'
                          }`}
                        >
                          <method.icon className="w-4 h-4" />
                          <span className="text-[11px] truncate w-full">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form detail based on method */}
                  <form onSubmit={handleAuthorizePayment} className="p-5 bg-[#080d17] border border-[#1a253a] rounded-xl space-y-4 font-mono text-xs">
                    {paymentMethod === 'crypto_usdt' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold text-white">USDT Crypto Rail (TRC-20 & ERC-20)</span>
                          <span className="text-emerald-400 text-[11px]">Instant Blockchain Confirmation</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#050810] rounded-xl border border-[#192336]">
                          <div className="w-24 h-24 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                            <QrCode className="w-20 h-20 text-slate-900" />
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <span className="text-[10px] text-slate-400 uppercase block">Deposit Address</span>
                            <div className="flex items-center justify-between p-2.5 bg-[#0e1626] rounded border border-[#1c273c] text-slate-200 text-xs">
                              <span className="truncate pr-2 font-mono">TXyZ98RealTradeCryptoDepositUSDT8947b2c</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('TXyZ98RealTradeCryptoDepositUSDT8947b2c')}
                                className="text-slate-400 hover:text-white shrink-0 p-1"
                              >
                                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <span className="text-[11px] text-slate-400 block">
                              Send <strong className="text-white">{formatPrice(activePlanConfig.pricing[selectedCycle])}</strong> to instantly unlock your account for {activeCycleConfig.days} days.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold text-white">
                            {paymentMethod === 'credit_card' ? 'Credit Card Rail' : 'Debit Card Direct'}
                          </span>
                          <span className="text-slate-400 text-[11px]">256-Bit TLS Bank Encryption</span>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                          <input
                            type="text"
                            placeholder="4532 •••• •••• 8892"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-[#050810] border border-[#1a253a] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
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
                              className="w-full bg-[#050810] border border-[#1a253a] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Security Code (CVC)</label>
                            <input
                              type="password"
                              placeholder="•••"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full bg-[#050810] border border-[#1a253a] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold text-white">Unified Payments Interface (UPI)</span>
                          <span className="text-emerald-400 text-[11px]">Instant UPI Autopay / One-time</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#050810] rounded-xl border border-[#192336]">
                          <div className="w-24 h-24 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                            <QrCode className="w-20 h-20 text-slate-900" />
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Enter UPI VPA ID</label>
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full bg-[#0e1626] border border-[#1c273c] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              Accepts Google Pay, PhonePe, Paytm, BHIM, Cred, and bank UPI.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'net_banking' && (
                      <div className="space-y-3">
                        <label className="block text-[11px] text-slate-400 mb-1">Select Institution</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-[#050810] border border-[#1a253a] focus:border-[#00d2ff] rounded px-3 py-2 text-white outline-none"
                        >
                          <option value="Chase Bank (USA)">Chase Bank (USA)</option>
                          <option value="Bank of America (USA)">Bank of America (USA)</option>
                          <option value="Citibank Global">Citibank Global</option>
                          <option value="HDFC Bank (India)">HDFC Bank (India)</option>
                          <option value="ICICI Bank (India)">ICICI Bank (India)</option>
                          <option value="SBI (State Bank of India)">SBI (State Bank of India)</option>
                          <option value="Barclays Corporate (UK)">Barclays Corporate (UK)</option>
                          <option value="HSBC Global">HSBC Global</option>
                        </select>
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="p-4 bg-[#050810] rounded-lg text-slate-300 text-center">
                        PayPal 1-click tokenization will authorize recurring or one-time license for {activeCycleConfig.name}.
                      </div>
                    )}

                    {paymentMethod === 'bank_transfer' && (
                      <div className="p-4 bg-[#050810] rounded-lg space-y-1 text-slate-300 text-[11px]">
                        <div>Bank: J.P. Morgan Securities LLC</div>
                        <div>SWIFT: CHASUS33XXX</div>
                        <div>IBAN: US92CHAS000192837482</div>
                        <div>Reference: REALTRADE-{user.id.slice(0, 6)}</div>
                      </div>
                    )}

                    {/* Authorize Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold font-mono rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 cursor-pointer"
                      >
                        {isProcessing ? (
                          <span>Verifying Payment Rails...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>
                              AUTHORIZE {formatPrice(activePlanConfig.pricing[selectedCycle])} & ACTIVATE {activePlanConfig.name.toUpperCase()} ({activeCycleConfig.shortLabel})
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

        {/* 5. Complete Feature Comparison Matrix */}
        <div className="bg-[#0b101b] border border-[#1e2a40] rounded-2xl p-5 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1a253a]">
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Feature Comparison Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Detailed breakdown across Free, Pro, Pro+, and Institutional tiers.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              Selected Cycle: <strong>{activeCycleConfig.name}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1e2a40] text-slate-400">
                  <th className="py-3 px-3">Capability</th>
                  <th className="py-3 px-3">Free</th>
                  <th className="py-3 px-3 text-[#00d2ff]">Pro</th>
                  <th className="py-3 px-3 text-[#38bdf8]">Pro+</th>
                  <th className="py-3 px-3 text-purple-400">Institutional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151e30] text-slate-200">
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Charts per layout</td>
                  <td className="py-3 px-3">1</td>
                  <td className="py-3 px-3 font-bold text-[#00d2ff]">4</td>
                  <td className="py-3 px-3 font-bold text-[#38bdf8]">8</td>
                  <td className="py-3 px-3 font-bold text-purple-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Technical Indicators per chart</td>
                  <td className="py-3 px-3">3</td>
                  <td className="py-3 px-3 text-emerald-400">Unlimited</td>
                  <td className="py-3 px-3 text-emerald-400">Unlimited</td>
                  <td className="py-3 px-3 text-emerald-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Custom Price Alerts</td>
                  <td className="py-3 px-3">3</td>
                  <td className="py-3 px-3 text-emerald-400">Unlimited</td>
                  <td className="py-3 px-3 text-emerald-400">Unlimited</td>
                  <td className="py-3 px-3 text-emerald-400">Zero-Latency Webhook</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Connected Broker Bridges</td>
                  <td className="py-3 px-3">1</td>
                  <td className="py-3 px-3">5 Brokers</td>
                  <td className="py-3 px-3">10 Brokers</td>
                  <td className="py-3 px-3 text-purple-400 font-bold">Unlimited Direct FIX</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Bar Replay Historical Simulator</td>
                  <td className="py-3 px-3 text-slate-600"><X className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Order Book Depth</td>
                  <td className="py-3 px-3">Level 1</td>
                  <td className="py-3 px-3">Level 2 (10 Bids)</td>
                  <td className="py-3 px-3">Level 2 (25 Bids)</td>
                  <td className="py-3 px-3 text-purple-400 font-bold">Level 3 + Dark Pools</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Pine Script Custom Editor</td>
                  <td className="py-3 px-3 text-slate-600"><X className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">IRS Form 8949 Tax CSV Reports</td>
                  <td className="py-3 px-3 text-slate-600"><X className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-medium">Client-Side AES-GCM Encrypted Vault</td>
                  <td className="py-3 px-3 text-slate-600"><X className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-emerald-400"><Check className="w-4 h-4" /></td>
                  <td className="py-3 px-3 text-purple-400 font-bold">Multi-Key HSM Support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Frequently Asked Questions */}
        <div className="bg-[#0b101b] border border-[#1e2a40] rounded-2xl p-5 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white font-display mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#00d2ff]" />
            <span>Subscription FAQ & Billing Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 bg-[#080d17] rounded-xl border border-[#182338]">
              <h4 className="font-bold text-white mb-1.5 font-mono">
                Can I switch between weekly, monthly, 3-months, 6-months, and yearly?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Yes! You can upgrade, downgrade, or switch durations at any time. When upgrading, unused time on your existing billing cycle is prorated and credited automatically.
              </p>
            </div>

            <div className="p-4 bg-[#080d17] rounded-xl border border-[#182338]">
              <h4 className="font-bold text-white mb-1.5 font-mono">
                How does the 30-Day Money-Back Guarantee work?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                All monthly, 3-month, 6-month, and annual plans include a no-questions-asked 30-day refund window. Weekly passes can be refunded within 48 hours of purchase.
              </p>
            </div>

            <div className="p-4 bg-[#080d17] rounded-xl border border-[#182338]">
              <h4 className="font-bold text-white mb-1.5 font-mono">
                Which payment methods are accepted?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                We accept USDT crypto (TRC-20 & ERC-20), Visa, Mastercard, American Express, UPI (GPay, PhonePe, Paytm), Net Banking, PayPal, and SWIFT wires.
              </p>
            </div>

            <div className="p-4 bg-[#080d17] rounded-xl border border-[#182338]">
              <h4 className="font-bold text-white mb-1.5 font-mono">
                Are tax invoices provided for business deductions?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Yes, official digital receipts with GST/VAT/EIN numbers and tax expense classifications are generated instantly after checkout for tax accounting.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper icon
const Building2Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
