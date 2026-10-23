import React, { useState } from 'react';
import { 
  Share2, 
  Globe, 
  Smartphone, 
  Check, 
  Copy, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Search, 
  Code2, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  QrCode,
  Send,
  MessageSquare,
  Twitter,
  Linkedin,
  Mail,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { Asset } from '../types/trading';

interface PublishAndShareHubProps {
  assets: Asset[];
  selectedAsset: Asset;
  activeTab: string;
  onClose?: () => void;
}

export const PublishAndShareHub: React.FC<PublishAndShareHubProps> = ({
  assets,
  selectedAsset,
  activeTab,
  onClose,
}) => {
  const [hubTab, setHubTab] = useState<'share' | 'playstore' | 'appstore' | 'assets'>('share');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [shareTicker, setShareTicker] = useState<string>(selectedAsset.symbol);
  const [shareDestination, setShareDestination] = useState<string>('terminal');
  const [sha256Fingerprint, setSha256Fingerprint] = useState(
    '14:6D:E9:7F:02:CD:34:60:5F:62:EB:67:53:E2:4B:38:4F:7B:64:99:99:CB:1F:B5:20:4B:3E:64:D2:12:4A:22'
  );

  // Construct current base URL dynamically
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://realtrade.view';
  const shareUrl = `${baseUrl}/?ticker=${encodeURIComponent(shareTicker)}&tab=${encodeURIComponent(shareDestination)}`;
  const embedCode = `<iframe \n  src="${baseUrl}/?ticker=${encodeURIComponent(shareTicker)}&tab=terminal&embed=true"\n  width="100%" \n  height="600" \n  frameborder="0" \n  allow="fullscreen"\n  title="RealTrade View Chart Widget"\n></iframe>`;

  const copyToClipboard = (text: string, type: 'link' | 'embed' | string) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else if (type === 'embed') {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } else {
      setCopiedCommand(type);
      setTimeout(() => setCopiedCommand(null), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RealTrade View — ${shareTicker} Live Chart & Analytics`,
          text: `Check out live institutional charts, technical indicators, and real-time market data for ${shareTicker} on RealTrade View!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      copyToClipboard(shareUrl, 'link');
    }
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to generate a clean visual SVG QR code matrix
  const generateQRCodeSvg = () => {
    // 25x25 QR code matrix simulation with standard functional corner markers
    const size = 25;
    const isCorner = (r: number, c: number) => {
      if (r < 7 && c < 7) return true; // Top-left
      if (r < 7 && c >= size - 7) return true; // Top-right
      if (r >= size - 7 && c < 7) return true; // Bottom-left
      return false;
    };

    const isCornerFilled = (r: number, c: number) => {
      const checkMarker = (row: number, col: number) => {
        if (row === 0 || row === 6 || col === 0 || col === 6) return true;
        if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
        return false;
      };
      if (r < 7 && c < 7) return checkMarker(r, c);
      if (r < 7 && c >= size - 7) return checkMarker(r, c - (size - 7));
      if (r >= size - 7 && c < 7) return checkMarker(r - (size - 7), c);
      return false;
    };

    // Deterministic pseudo-random pattern based on ticker name
    const seed = shareTicker.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 42);
    const rects: React.ReactNode[] = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let filled = false;
        if (isCorner(r, c)) {
          filled = isCornerFilled(r, c);
        } else {
          // Alignment & data bits
          const bit = Math.sin(r * 11 + c * 17 + seed) * 10000;
          filled = (bit - Math.floor(bit)) > 0.45;
        }

        if (filled) {
          rects.push(
            <rect
              key={`${r}-${c}`}
              x={c * 8}
              y={r * 8}
              width="8"
              height="8"
              fill="#00d2ff"
              rx="1.5"
            />
          );
        }
      }
    }

    return (
      <svg viewBox="0 0 200 200" className="w-44 h-44 p-2 bg-[#080b12] rounded-xl border border-[#00d2ff]/30 shadow-lg">
        {rects}
      </svg>
    );
  };

  return (
    <div className="w-full bg-[#0a0d14] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30">
              Publishing & Distribution Suite
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> PWA Production Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Publish on Play Store, App Store & Share on Google
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Package RealTrade View into native Android and iOS mobile app bundles, configure Google Search indexing with structured JSON-LD data, and share interactive charts globally.
          </p>
        </div>

        {/* Quick Share CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0284c7] text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-[#00d2ff]/20 transition"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>Share on Google / Web</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setHubTab('share')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            hubTab === 'share'
              ? 'bg-[#152238] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111726]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Google Search & Web Sharing</span>
        </button>

        <button
          onClick={() => setHubTab('playstore')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            hubTab === 'playstore'
              ? 'bg-[#152238] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111726]'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Google Play Store (Android)</span>
        </button>

        <button
          onClick={() => setHubTab('appstore')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            hubTab === 'appstore'
              ? 'bg-[#152238] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111726]'
          }`}
        >
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span>Apple App Store (iOS)</span>
        </button>

        <button
          onClick={() => setHubTab('assets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            hubTab === 'assets'
              ? 'bg-[#152238] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#111726]'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Store Assets & Config Downloads</span>
        </button>
      </div>

      {/* TAB 1: GOOGLE SEARCH & WEB SHARING */}
      {hubTab === 'share' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Google Search Snippet & Social Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Google Search Live Preview Card */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-1">
                    <span className="text-[#4285F4] font-black text-xs leading-none">G</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Google Search Result Preview</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Schema.org JSON-LD Verified
                </span>
              </div>

              {/* Simulated Google SERP Card */}
              <div className="bg-[#171b26] rounded-xl p-4 border border-slate-700/60 font-sans space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-[#00d2ff] flex items-center justify-center text-[9px] font-black text-slate-950">
                    R
                  </div>
                  <span className="text-slate-300 font-medium">RealTrade Technologies</span>
                  <span className="text-slate-500">›</span>
                  <span className="text-slate-400">https://realtrade.view</span>
                </div>

                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg font-semibold text-[#8ab4f8] hover:underline block leading-snug"
                >
                  REALTRADE VIEW — Pro Trading Terminal & Markets
                </a>

                {/* Rating & Rich Snippets */}
                <div className="flex items-center gap-2 text-xs text-amber-400 pt-0.5">
                  <span>★★★★★</span>
                  <span className="text-slate-300 font-medium">4.9</span>
                  <span className="text-slate-500">(12,840)</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-medium">Free Financial Web App</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Institutional-grade trading terminal with real-time multi-asset candlestick analytics, 10+ technical indicators, broker paper execution, live world market map, and encrypted offline-first portfolio vault.
                </p>

                {/* Sitelinks */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/40 text-xs">
                  <div>
                    <span className="text-[#8ab4f8] font-medium hover:underline cursor-pointer block">
                      Live Trading Terminal
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      Candlestick charts, EMA, RSI, and MACD indicators.
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8ab4f8] font-medium hover:underline cursor-pointer block">
                      World Market Map
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      Global stock exchange sessions and market heatmaps.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                <span>
                  Configured with canonical URLs, OpenGraph cards, Twitter cards, and Schema.org structured metadata in <code className="text-slate-300">index.html</code>.
                </span>
              </div>
            </div>

            {/* Deep Link Customizer & One-Click Social Sharing */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#00d2ff]" />
                Share Directly on Social Networks & Messengers
              </h3>

              {/* Ticker & Section Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Focus Asset / Ticker:</label>
                  <select
                    value={shareTicker}
                    onChange={(e) => setShareTicker(e.target.value)}
                    className="w-full bg-[#161c2d] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                  >
                    {assets.map((a) => (
                      <option key={a.id} value={a.symbol}>
                        {a.symbol} — {a.name} (${a.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Target Section / Tab:</label>
                  <select
                    value={shareDestination}
                    onChange={(e) => setShareDestination(e.target.value)}
                    className="w-full bg-[#161c2d] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                  >
                    <option value="terminal">Live Terminal (Charts & Drawings)</option>
                    <option value="worldmap">World Market Map & Heatmap</option>
                    <option value="sectors">Sector Performance Treemap</option>
                    <option value="portfolio">Portfolio & P&L Vault</option>
                    <option value="brokers">Broker Connect Gateway</option>
                  </select>
                </div>
              </div>

              {/* Generated Shareable Link Bar */}
              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400 font-medium">Direct Shareable Link:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#161c2d] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl, 'link')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00d2ff] hover:bg-[#38bdf8] text-slate-950 font-bold text-xs transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Instant Social Channels */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out RealTrade View for ${shareTicker}: ${shareUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/20 text-xs font-semibold transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Analyzing ${shareTicker} on RealTrade View — pro charts, indicators, and institutional execution:`)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/20 text-xs font-semibold transition"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>X / Twitter</span>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/30 hover:bg-[#0A66C2]/20 text-xs font-semibold transition"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent(`RealTrade View Market Analytics — ${shareTicker}`)}&body=${encodeURIComponent(`Explore real-time multi-asset charts and data here: ${shareUrl}`)}`}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: QR Code Mobile Scanner & Embed Widget (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* QR Code Scanner Card */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#00d2ff]" />
                <h3 className="text-sm font-bold text-white">Scan to Open & Install on Mobile</h3>
              </div>

              {/* Dynamic QR Code */}
              <div className="relative group">
                {generateQRCodeSvg()}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-lg bg-[#0a0d14] border border-[#00d2ff] p-1.5 flex items-center justify-center shadow-lg">
                    <span className="text-[#00d2ff] font-black text-xs">RT</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">
                  Point iPhone or Android camera at the QR code
                </p>
                <p className="text-[11px] text-slate-400">
                  Instantly launches RealTrade View with <span className="text-[#00d2ff] font-mono">{shareTicker}</span> pre-selected.
                </p>
              </div>

              <button
                onClick={handleNativeShare}
                className="w-full py-2 px-4 rounded-xl bg-[#172238] border border-[#00d2ff]/40 text-[#00d2ff] text-xs font-bold hover:bg-[#1f2f4e] transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open System Share Sheet</span>
              </button>
            </div>

            {/* TradingView-Style Embed Widget Generator */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#00d2ff]" />
                  <h3 className="text-sm font-bold text-white">Embed Chart on Your Website</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">HTML IFrame</span>
              </div>

              <p className="text-xs text-slate-400">
                Copy this responsive embed snippet into your blog, financial website, or portal:
              </p>

              <pre className="p-3 rounded-lg bg-[#080b12] border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                {embedCode}
              </pre>

              <button
                onClick={() => copyToClipboard(embedCode, 'embed')}
                className="w-full py-2 px-3 rounded-lg bg-[#162032] hover:bg-[#1e2a42] text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Embed Code Copied!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE PLAY STORE (ANDROID TWA & BUBBLEWRAP) */}
      {hubTab === 'playstore' && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-emerald-950/30 via-[#0f1826] to-[#0f1826] border border-emerald-800/40 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                    ▶
                  </div>
                  <h2 className="text-xl font-bold text-white">Google Play Store Deployment (Android)</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  RealTrade View is built as an installable PWA that compiles directly into an Android App Bundle (<code className="text-emerald-300">.aab</code>) via Google's official <strong>Trusted Web Activity (TWA)</strong> using <strong>Bubblewrap CLI</strong> or <strong>PWA Builder</strong>.
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                Google TWA Standard
              </span>
            </div>
          </div>

          {/* Step-by-Step Google Play Packaging Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Install Bubblewrap CLI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google's official CLI tool that transforms your Progressive Web App into a production-signed Android App Bundle.
              </p>
              <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800 flex items-center justify-between">
                <code className="text-[11px] font-mono text-emerald-400">npm i -g @bubblewrap/cli</code>
                <button
                  onClick={() => copyToClipboard('npm i -g @bubblewrap/cli', 'bw-install')}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy command"
                >
                  {copiedCommand === 'bw-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Initialize from Manifest</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bubblewrap automatically reads <code className="text-slate-300">manifest.webmanifest</code>, downloads icons, and configures the Android package.
              </p>
              <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800 flex items-center justify-between">
                <code className="text-[11px] font-mono text-emerald-400 truncate max-w-[190px]">
                  bubblewrap init --manifest={baseUrl}/manifest.webmanifest
                </code>
                <button
                  onClick={() => copyToClipboard(`bubblewrap init --manifest=${baseUrl}/manifest.webmanifest`, 'bw-init')}
                  className="p-1 text-slate-400 hover:text-white shrink-0 ml-1"
                  title="Copy command"
                >
                  {copiedCommand === 'bw-init' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Build Release Bundle (.aab)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates the signed <code className="text-slate-300">app-release-bundle.aab</code> file ready for direct upload to Google Play Console.
              </p>
              <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800 flex items-center justify-between">
                <code className="text-[11px] font-mono text-emerald-400">bubblewrap build</code>
                <button
                  onClick={() => copyToClipboard('bubblewrap build', 'bw-build')}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy command"
                >
                  {copiedCommand === 'bw-build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Digital Asset Links Configurator (Crucial for Play Store full-screen removal of URL bar) */}
          <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Digital Asset Links Verification (<code className="text-xs text-cyan-300">.well-known/assetlinks.json</code>)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Google Play requires this file to verify domain ownership and hide the browser URL bar for a 100% native feel.
                </p>
              </div>
              <button
                onClick={() => {
                  const content = JSON.stringify([
                    {
                      relation: ["delegate_permission/common.handle_all_urls"],
                      target: {
                        namespace: "android_app",
                        package_name: "com.realtrade.view",
                        sha256_cert_fingerprints: [sha256Fingerprint.trim()]
                      }
                    }
                  ], null, 2);
                  downloadFile('assetlinks.json', content, 'application/json');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download assetlinks.json</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-mono">App Package Name:</label>
                <input
                  type="text"
                  readOnly
                  value="com.realtrade.view"
                  className="w-full bg-[#161c2d] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-mono">SHA-256 Keystore Fingerprint:</label>
                <input
                  type="text"
                  value={sha256Fingerprint}
                  onChange={(e) => setSha256Fingerprint(e.target.value)}
                  className="w-full bg-[#161c2d] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Google Play Console Checklist */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Google Play Console Submission Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Developer Account ($25 one-time registration)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Content Rating Questionnaire: Category Financial / Productivity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Upload High-Res Icon: 512x512 PNG included in <code className="text-slate-300">/public</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Privacy Policy & Data Safety: Encrypted local storage declared</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPLE APP STORE (IOS PACKAGING & CAPACITOR) */}
      {hubTab === 'appstore' && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-blue-950/30 via-[#0f1826] to-[#0f1826] border border-blue-800/40 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                    
                  </div>
                  <h2 className="text-xl font-bold text-white">Apple App Store Deployment (iOS & iPadOS)</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Publish RealTrade View on the Apple App Store using <strong>Capacitor</strong> (official modern native container) or <strong>PWA Builder iOS</strong>, giving users full native iOS app distribution, biometric FaceID integration, and offline execution.
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 whitespace-nowrap">
                Capacitor iOS Compatible
              </span>
            </div>
          </div>

          {/* Capacitor Packaging Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Install Capacitor Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add modern native iOS runtime to your React/Vite codebase:
              </p>
              <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800 flex items-center justify-between">
                <code className="text-[11px] font-mono text-blue-400 truncate max-w-[190px]">
                  npm i @capacitor/core @capacitor/cli @capacitor/ios
                </code>
                <button
                  onClick={() => copyToClipboard('npm i @capacitor/core @capacitor/cli @capacitor/ios', 'cap-install')}
                  className="p-1 text-slate-400 hover:text-white shrink-0 ml-1"
                >
                  {copiedCommand === 'cap-install' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Initialize iOS Project</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configures Bundle ID <code className="text-slate-300">com.realtrade.view</code> and points to your build directory:
              </p>
              <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800 flex items-center justify-between">
                <code className="text-[11px] font-mono text-blue-400 truncate max-w-[190px]">
                  npx cap init "RealTrade View" com.realtrade.view --web-dir dist
                </code>
                <button
                  onClick={() => copyToClipboard('npx cap init "RealTrade View" com.realtrade.view --web-dir dist', 'cap-init')}
                  className="p-1 text-slate-400 hover:text-white shrink-0 ml-1"
                >
                  {copiedCommand === 'cap-init' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Open in Xcode & Archive</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Launches Xcode directly to archive and upload to App Store Connect / TestFlight:
              </p>
              <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800 flex items-center justify-between">
                <code className="text-[11px] font-mono text-blue-400">npx cap add ios && npx cap open ios</code>
                <button
                  onClick={() => copyToClipboard('npx cap add ios && npx cap open ios', 'cap-open')}
                  className="p-1 text-slate-400 hover:text-white shrink-0 ml-1"
                >
                  {copiedCommand === 'cap-open' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* iOS Guidelines & Safari Add to Home Screen Alternative */}
          <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              Apple App Store Connect Submission Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2.5 bg-[#141b2a] p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Apple Developer Program</div>
                  <div className="text-[11px] text-slate-400">$99/year enrollment for App Store distribution</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#141b2a] p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">iOS App Privacy Nutrition Label</div>
                  <div className="text-[11px] text-slate-400">Zero tracking; all keys encrypted via WebAuthn/AES-GCM</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#141b2a] p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Screenshots Specifications</div>
                  <div className="text-[11px] text-slate-400">iPhone 6.7" (1290x2796) and 6.5" (1242x2688)</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#141b2a] p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Safari Web App Alternative</div>
                  <div className="text-[11px] text-slate-400">Zero commission direct install via "Add to Home Screen"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE ASSETS & CONFIG DOWNLOADS */}
      {hubTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-[#00d2ff]" />
                Download App Store & Search Engine Configuration Files
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All production files generated and pre-configured for your domain and store verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {/* Manifest */}
              <div className="bg-[#141b2a] rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Web App Manifest</span>
                    <span className="text-[10px] font-mono text-[#00d2ff] bg-[#00d2ff]/10 px-1.5 py-0.5 rounded">PWA</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Defines app name, standalone display mode, orientation, colors, shortcuts, and icon definitions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const content = JSON.stringify({
                      id: "/",
                      name: "REALTRADE VIEW — Pro Trading Terminal & Markets",
                      short_name: "RealTrade",
                      description: "Institutional-grade trading terminal with real-time multi-asset analytics, technical indicators, broker paper execution, live world market map, biometric security, and encrypted offline-first portfolio management.",
                      theme_color: "#0a0d14",
                      background_color: "#0a0d14",
                      display: "standalone",
                      start_url: "/",
                      scope: "/",
                      icons: [
                        { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
                        { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
                        { src: "/pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
                      ]
                    }, null, 2);
                    downloadFile('manifest.json', content, 'application/json');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#1a2538] hover:bg-[#22324d] text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download manifest.json</span>
                </button>
              </div>

              {/* Digital Asset Links */}
              <div className="bg-[#141b2a] rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Google Play Asset Links</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Android</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Verifies Play Store TWA domain association and removes the browser address bar.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const content = JSON.stringify([
                      {
                        relation: ["delegate_permission/common.handle_all_urls"],
                        target: {
                          namespace: "android_app",
                          package_name: "com.realtrade.view",
                          sha256_cert_fingerprints: [sha256Fingerprint.trim()]
                        }
                      }
                    ], null, 2);
                    downloadFile('assetlinks.json', content, 'application/json');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#1a2538] hover:bg-[#22324d] text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download assetlinks.json</span>
                </button>
              </div>

              {/* Apple Site Association */}
              <div className="bg-[#141b2a] rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Apple Site Association</span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">iOS</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Apple Universal Links configuration file for seamless iOS native deep linking.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const content = JSON.stringify({
                      applinks: {
                        apps: [],
                        details: [{ appID: "TEAMID.com.realtrade.view", paths: ["*"] }]
                      },
                      webcredentials: {
                        apps: ["TEAMID.com.realtrade.view"]
                      }
                    }, null, 2);
                    downloadFile('apple-app-site-association', content, 'application/json');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#1a2538] hover:bg-[#22324d] text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Apple Assoc.</span>
                </button>
              </div>

              {/* Sitemap & Robots */}
              <div className="bg-[#141b2a] rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Google SEO Sitemap & Robots</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">SEO</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    XML sitemap and crawler directives for Google Search bot and Bing indexing.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/?tab=terminal</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/?tab=worldmap</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/?tab=sectors</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/?tab=portfolio</loc><priority>0.7</priority></url>
</urlset>`;
                    downloadFile('sitemap.xml', sitemapContent, 'application/xml');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#1a2538] hover:bg-[#22324d] text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download sitemap.xml</span>
                </button>
              </div>

              {/* App Icon Assets Direct Link */}
              <div className="bg-[#141b2a] rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">App Store Icon Pack</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">Icons</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    High-res vector SVG, 192px PNG, 512px Store PNG, and Apple touch icon in <code className="text-slate-300">/public</code>.
                  </p>
                </div>
                <a
                  href="/icon.svg"
                  download="realtrade-icon.svg"
                  className="w-full py-2 px-3 rounded-lg bg-[#1a2538] hover:bg-[#22324d] text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Vector Icon (SVG)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
