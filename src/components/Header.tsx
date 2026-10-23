import React from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Wifi, 
  WifiOff, 
  Fingerprint, 
  CreditCard, 
  User, 
  Globe2, 
  LineChart, 
  Briefcase, 
  FileText,
  Lock,
  Layers,
  LayoutGrid,
  Sparkles,
  Share2,
  Smartphone,
  Radio,
  Zap
} from 'lucide-react';
import { UserAccount } from '../types/trading';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'explore' | 'terminal' | 'sectors' | 'worldmap' | 'worldmonitor' | 'portfolio' | 'brokers' | 'tax' | 'security' | 'publish' | 'subscription';
  setActiveTab: (tab: 'explore' | 'terminal' | 'sectors' | 'worldmap' | 'worldmonitor' | 'portfolio' | 'brokers' | 'tax' | 'security' | 'publish' | 'subscription') => void;
  user: UserAccount;
  privacyMode: boolean;
  setPrivacyMode: (val: boolean) => void;
  isLocked: boolean;
  setIsLocked: (val: boolean) => void;
  onOpenSubscription: () => void;
  onOpenAuth: () => void;
  onOpenSecurity: () => void;
  toggleOfflineMode: () => void;
  onOpenPublishModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  privacyMode,
  setPrivacyMode,
  isLocked,
  setIsLocked,
  onOpenSubscription,
  onOpenAuth,
  onOpenSecurity,
  toggleOfflineMode,
  onOpenPublishModal,
}) => {
  return (
    <header className="border-b border-[#1f293d] bg-[#0c101a] sticky top-0 z-40">
      <div className="flex items-center justify-between gap-8 px-4 lg:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00d2ff]/20 to-[#10b981]/20 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff]">
              <LineChart className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white font-display uppercase whitespace-nowrap">
                REALTRADE <span className="text-[#00d2ff]">VIEW</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                TRADINGVIEW PLATFORM
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'explore' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'terminal' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Supercharts</span>
          </button>

          <button
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'sectors' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Sector Heatmap</span>
          </button>

          <button
            onClick={() => setActiveTab('worldmap')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'worldmap' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>World Market Map</span>
          </button>

          <button
            onClick={() => setActiveTab('worldmonitor')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'worldmonitor' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="flex items-center gap-1">
              <span>World Monitor</span>
              <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 px-1 rounded font-mono">
                OSINT
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'portfolio' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Portfolio & P&L</span>
          </button>

          <button
            onClick={() => setActiveTab('brokers')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'brokers' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Brokers Connect</span>
          </button>

          <button
            onClick={() => setActiveTab('tax')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'tax' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tax Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'security' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security & Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'publish' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span className="flex items-center gap-1">
              <span>Publish & Stores</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded font-mono">
                Store
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'subscription' 
                ? 'text-[#00d2ff] font-semibold border-b-2 border-[#00d2ff]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="flex items-center gap-1">
              <span>Subscriptions</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded font-mono font-bold">
                5 Passes
              </span>
            </span>
          </button>
        </nav>

        {/* Zone 3: Functional controls & primary profile action */}
        <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" onOpenPublishModal={onOpenPublishModal} />

          {/* Share on Google / Stores button */}
          <button
            onClick={onOpenPublishModal || (() => setActiveTab('publish'))}
            title="Publish to Play Store, App Store & Share on Google"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold text-slate-200 bg-[#162032] hover:bg-[#1e2c45] border border-slate-700 hover:border-[#00d2ff]/40 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span className="hidden xl:inline">Publish & Share</span>
          </button>

          {/* Offline / Online Mode Toggle */}
          <button
            onClick={toggleOfflineMode}
            title={user.isOfflineMode ? "Running in Offline Mode (Trades queued locally in encrypted store)" : "Live Online Cloud Sync Active"}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-mono transition-colors border ${
              user.isOfflineMode
                ? 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
            }`}
          >
            {user.isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{user.isOfflineMode ? 'Offline Queue' : 'Live Sync'}</span>
          </button>

          {/* Privacy Mask Toggle */}
          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            title={privacyMode ? "Reveal Portfolio Balances" : "Mask Portfolio Balances for Privacy"}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#1a2333] transition-colors border border-transparent hover:border-[#1f293d]"
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Biometric Quick Lock */}
          <button
            onClick={() => setIsLocked(!isLocked)}
            title={isLocked ? "Terminal Locked" : "Biometric Lock Terminal"}
            className={`p-1.5 rounded transition-colors border ${
              isLocked 
                ? 'bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2333] border-transparent hover:border-[#1f293d]'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
          </button>

          {/* Subscription Tier Button */}
          <button
            onClick={onOpenSubscription}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap border ${
              user.tier === 'institutional'
                ? 'bg-purple-950/40 text-purple-300 border-purple-700/60 hover:bg-purple-900/50'
                : user.tier === 'pro'
                ? 'bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/40 hover:bg-[#00d2ff]/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="capitalize">{user.tier} Plan</span>
          </button>

          {/* User Sign In / Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-[#00d2ff] hover:bg-[#00b8e6] rounded transition-colors whitespace-nowrap shrink-0 text-slate-950 font-bold"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{user.email ? user.name : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
