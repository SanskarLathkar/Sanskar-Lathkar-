import React, { useState, useEffect, useRef } from 'react';
import { NEWS_FEED, STREAMING_NEWS_POOL, NewsItem } from '../../data/tradingViewFeeds';
import { 
  Newspaper, 
  Radio, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronRight, 
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { playChime } from '../../utils/security';

interface LiveMarketNewsSidebarProps {
  onOpenSupercharts: (symbolOrAssetId?: string) => void;
  className?: string;
}

type NewsCategory = 'all' | 'stocks' | 'crypto' | 'forex' | 'commodities' | 'tech';

export const LiveMarketNewsSidebar: React.FC<LiveMarketNewsSidebarProps> = ({
  onOpenSupercharts,
  className = '',
}) => {
  const [newsList, setNewsList] = useState<NewsItem[]>(NEWS_FEED);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [poolIndex, setPoolIndex] = useState(0);

  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Periodic simulated live news updates
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setPoolIndex(prevIndex => {
        const template = STREAMING_NEWS_POOL[prevIndex % STREAMING_NEWS_POOL.length];
        const newId = `stream-${Date.now()}`;
        
        const freshNews: NewsItem = {
          ...template,
          id: newId,
          timeAgo: 'Just now',
          timestamp: Date.now(),
        };

        setNewsList(prev => [freshNews, ...prev.slice(0, 30)]); // Keep top 30
        setNewlyAddedId(newId);

        if (soundEnabled) {
          playChime('trade');
        }

        setTimeout(() => {
          setNewlyAddedId(null);
        }, 3500);

        return prevIndex + 1;
      });
    }, 18000); // New headline every 18 seconds

    return () => clearInterval(interval);
  }, [isLiveStreaming, soundEnabled]);

  // Manual trigger to simulate breaking headline
  const handleSimulateFlash = () => {
    const template = STREAMING_NEWS_POOL[poolIndex % STREAMING_NEWS_POOL.length];
    const newId = `manual-${Date.now()}`;
    const freshNews: NewsItem = {
      ...template,
      id: newId,
      timeAgo: 'Just now',
      importance: 'breaking',
      timestamp: Date.now(),
    };

    setNewsList(prev => [freshNews, ...prev]);
    setNewlyAddedId(newId);
    setPoolIndex(prev => prev + 1);

    if (soundEnabled) {
      playChime('trade');
    }

    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(() => {
      setNewlyAddedId(null);
    }, 4000);
  };

  // Filter logic
  const filteredNews = newsList.filter(item => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      item.category === selectedCategory ||
      (selectedCategory === 'stocks' && item.category === 'tech');

    const matchesSearch = 
      searchQuery === '' ||
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.relatedSymbols.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <aside className={`bg-[#0c101a] border border-[#1f293d] rounded-2xl flex flex-col overflow-hidden shadow-2xl font-sans ${className}`}>
      {/* 1. Header Toolbar */}
      <div className="p-4 bg-[#0f1422] border-b border-[#1f293d] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm font-display tracking-tight">
                  Live Market News
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isLiveStreaming ? 'animate-ping' : ''}`} />
                  {isLiveStreaming ? 'LIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Institutional wire & sub-minute headlines
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Sound Mute/Unmute */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
              className={`p-1.5 rounded-lg border transition-colors ${
                soundEnabled 
                  ? 'bg-[#151e2e] text-[#00d2ff] border-[#00d2ff]/30' 
                  : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-[#1f293d]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Pause / Resume stream */}
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              title={isLiveStreaming ? 'Pause Real-Time Stream' : 'Resume Real-Time Stream'}
              className="p-1.5 rounded-lg bg-[#151e2e] hover:bg-[#1a2538] text-slate-300 border border-[#1f293d] transition-colors"
            >
              {isLiveStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Simulate Flash news */}
            <button
              onClick={handleSimulateFlash}
              title="Fetch / Simulate Latest Wire Alert"
              className="p-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Omnibox */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter headlines or tickers (NVDA, Fed, BTC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080b12] border border-[#1f293d] hover:border-slate-600 focus:border-[#00d2ff] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-[10px] text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none font-mono text-[11px] pt-0.5">
          {[
            { id: 'all' as NewsCategory, label: 'All' },
            { id: 'stocks' as NewsCategory, label: 'Stocks & Tech' },
            { id: 'crypto' as NewsCategory, label: 'Crypto' },
            { id: 'forex' as NewsCategory, label: 'Macro & FX' },
            { id: 'commodities' as NewsCategory, label: 'Energy & Metals' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#182338] text-[#00d2ff] font-bold border border-[#00d2ff]/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121926]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Scrollable News Feed List */}
      <div 
        ref={feedContainerRef}
        className="flex-1 overflow-y-auto max-h-[640px] divide-y divide-[#162030] p-2 space-y-2 scrollbar-thin scrollbar-thumb-[#1f293d]"
      >
        {filteredNews.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No market news matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredNews.map(item => {
            const isFresh = item.id === newlyAddedId;
            const isBreaking = item.importance === 'breaking';

            return (
              <article
                key={item.id}
                className={`p-3.5 rounded-xl transition-all font-sans relative group ${
                  isFresh 
                    ? 'bg-[#00d2ff]/10 border border-[#00d2ff] animate-fadeIn' 
                    : isBreaking 
                    ? 'bg-[#111827] border border-amber-500/30 hover:border-amber-500/60' 
                    : 'bg-[#090d16] border border-[#162030] hover:border-slate-600 hover:bg-[#0e1422]'
                }`}
              >
                {/* Top Meta Line: Source, Time, Sentiment */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isBreaking && (
                      <span className="px-1.5 py-0.2 rounded font-bold uppercase text-[9px] bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-rose-400" /> BREAKING
                      </span>
                    )}
                    <span className="font-semibold text-slate-300">{item.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timeAgo}
                    </span>

                    <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                      item.sentiment === 'bullish'
                        ? 'bg-emerald-950/80 text-emerald-400'
                        : item.sentiment === 'bearish'
                        ? 'bg-rose-950/80 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.sentiment === 'bullish' ? '▲ Bullish' : item.sentiment === 'bearish' ? '▼ Bearish' : '● Neutral'}
                    </span>
                  </div>
                </div>

                {/* Headline Title */}
                <h4 
                  onClick={() => onOpenSupercharts(item.relatedSymbols[0]?.toLowerCase().replace('/', ''))}
                  className="font-semibold text-slate-100 text-xs sm:text-sm leading-snug cursor-pointer group-hover:text-[#00d2ff] transition-colors mb-1.5"
                >
                  {item.headline}
                </h4>

                {/* Summary snippet */}
                {item.summary && (
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2 line-clamp-2">
                    {item.summary}
                  </p>
                )}

                {/* Footer: Related Symbols Chips & Read Time */}
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.relatedSymbols.map(sym => (
                      <button
                        key={sym}
                        onClick={(e) => {
                          e.stopPropagation();
                          const cleanId = sym.toLowerCase().replace('/', '');
                          onOpenSupercharts(cleanId);
                        }}
                        title={`Open ${sym} in Supercharts`}
                        className="px-2 py-0.5 rounded bg-[#131d2e] hover:bg-[#00d2ff] hover:text-slate-950 text-[#00d2ff] border border-[#1f293d] transition-all flex items-center gap-0.5 font-bold"
                      >
                        <span>${sym}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>

                  {item.readTime && (
                    <span className="text-slate-500 text-[10px]">
                      {item.readTime}
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* 3. Footer Bar */}
      <div className="p-2.5 bg-[#0a0d14] border-t border-[#1f293d] flex items-center justify-between text-[11px] font-mono text-slate-400 px-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
          <span>{newsList.length} updates logged</span>
        </span>

        <button
          onClick={() => onOpenSupercharts()}
          className="text-[#00d2ff] hover:underline flex items-center gap-1"
        >
          <span>Open News Terminal</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
