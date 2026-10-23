import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Radio, 
  ShieldAlert, 
  Plane, 
  Anchor, 
  Activity, 
  ExternalLink, 
  AlertTriangle, 
  Flame, 
  Pizza, 
  Layers, 
  Search, 
  RefreshCw, 
  Maximize2, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  Zap, 
  Wifi, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Info,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  CONFLICT_ZONES, 
  MILITARY_AIRCRAFT, 
  NAVAL_VESSELS, 
  EARTHQUAKES, 
  CYBER_THREATS, 
  PIZZA_INDEX_FACILITIES, 
  INTELLIGENCE_FEED, 
  WORLD_MONITOR_DASHBOARDS 
} from '../data/worldMonitorData';
import { 
  ConflictZone, 
  MilitaryAircraft, 
  NavalVessel, 
  EarthquakeIncident, 
  CyberThreat, 
  IntelligenceItem,
  ThreatSeverity 
} from '../types/worldMonitor';
import { Asset } from '../types/trading';

interface WorldMonitorViewProps {
  onSelectAsset?: (asset: Asset) => void;
  allAssets?: Asset[];
}

export const WorldMonitorView: React.FC<WorldMonitorViewProps> = ({
  onSelectAsset,
  allAssets = []
}) => {
  // Navigation & Sub-views
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'feed' | 'pizza' | 'markets' | 'web'>('map');
  
  // Layer toggles on map
  const [showConflicts, setShowConflicts] = useState(true);
  const [showAircraft, setShowAircraft] = useState(true);
  const [showNaval, setShowNaval] = useState(true);
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [showCyber, setShowCyber] = useState(true);

  // Selected item modal / drawer
  const [selectedConflict, setSelectedConflict] = useState<ConflictZone | null>(CONFLICT_ZONES[0]);
  const [selectedAircraft, setSelectedAircraft] = useState<MilitaryAircraft | null>(null);
  const [selectedNaval, setSelectedNaval] = useState<NavalVessel | null>(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeIncident | null>(null);

  // News feed filters
  const [newsFilter, setNewsFilter] = useState<'all' | 'geopolitics' | 'military' | 'cyber' | 'energy' | 'disaster' | 'polymarket'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioAlerts, setAudioAlerts] = useState(false);

  // Embedded Web portal controls
  const [selectedDashboardUrl, setSelectedDashboardUrl] = useState('https://www.worldmonitor.app/');
  const [iframeError, setIframeError] = useState(false);

  // Convert lat/lng to SVG 1000x500 coordinates
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const filteredFeed = INTELLIGENCE_FEED.filter(item => {
    const matchesCategory = newsFilter === 'all' || item.category === newsFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSeverityBadgeClass = (severity: ThreatSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse';
      case 'high':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      case 'elevated':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-[#070b12] text-slate-200 overflow-y-auto">
      {/* 1. Global Surveillance Command Top Bar */}
      <div className="bg-[#0b101b] border-b border-[#1c273c] px-4 py-3 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-red-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-950/40">
              <Globe2 className="w-5 h-5 text-[#00d2ff]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide font-display flex items-center gap-1.5">
                  <span>WORLD MONITOR</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-[#00d2ff] border border-cyan-800/40 uppercase">
                    OSINT Radar
                  </span>
                </h1>
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>435+ FEEDS ONLINE</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Global intelligence platform aggregating geopolitical hot spots, military ADS-B, naval tracking & DEFCON analysis.
              </p>
            </div>
          </div>

          {/* Right Action & External Link to worldmonitor.app */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
            {/* DEFCON Indicator */}
            <div className="flex items-center gap-2 bg-[#121826] border border-[#23314a] px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-slate-400">DEFCON:</span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                LEVEL 3 (ROUND HOUSE)
              </span>
            </div>

            {/* Direct Official World Monitor App Launcher */}
            <a
              href="https://www.worldmonitor.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs font-mono transition-all shadow-md shadow-cyan-950/50 hover:scale-[1.02]"
              title="Visit official World Monitor app"
            >
              <span>worldmonitor.app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none pt-3 mt-1 border-t border-[#172033]">
          <button
            onClick={() => setActiveSubTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeSubTab === 'map'
                ? 'bg-[#1b263b] text-[#00d2ff] font-bold border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#121826]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tactical Radar Map</span>
          </button>

          <button
            onClick={() => setActiveSubTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeSubTab === 'feed'
                ? 'bg-[#1b263b] text-[#00d2ff] font-bold border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#121826]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span>435+ Live Intelligence Feeds</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-1 rounded">LIVE</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pizza')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeSubTab === 'pizza'
                ? 'bg-[#1b263b] text-[#00d2ff] font-bold border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#121826]'
            }`}
          >
            <Pizza className="w-3.5 h-3.5 text-amber-400" />
            <span>Pentagon Pizza Index</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded">+245%</span>
          </button>

          <button
            onClick={() => setActiveSubTab('markets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeSubTab === 'markets'
                ? 'bg-[#1b263b] text-[#00d2ff] font-bold border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#121826]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Geopolitics & Market Impact</span>
          </button>

          <button
            onClick={() => setActiveSubTab('web')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeSubTab === 'web'
                ? 'bg-[#1b263b] text-[#00d2ff] font-bold border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#121826]'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Live World Monitor Web Portal</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 flex flex-col gap-6">

        {/* ======================================================== */}
        {/* SUB-TAB 1: TACTICAL RADAR MAP                           */}
        {/* ======================================================== */}
        {activeSubTab === 'map' && (
          <div className="flex flex-col gap-5">
            {/* Layer Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d131f] border border-[#1e2a40] p-3 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Layers className="w-4 h-4 text-[#00d2ff]" />
                <span className="font-semibold text-white">Active Map Radar Layers:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowConflicts(!showConflicts)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    showConflicts 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                      : 'bg-[#141b2b] text-slate-500 border border-transparent'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Conflicts ({CONFLICT_ZONES.length})</span>
                </button>

                <button
                  onClick={() => setShowAircraft(!showAircraft)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    showAircraft 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'bg-[#141b2b] text-slate-500 border border-transparent'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Military ADS-B ({MILITARY_AIRCRAFT.length})</span>
                </button>

                <button
                  onClick={() => setShowNaval(!showNaval)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    showNaval 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                      : 'bg-[#141b2b] text-slate-500 border border-transparent'
                  }`}
                >
                  <Anchor className="w-3.5 h-3.5" />
                  <span>Naval CSG & Chokepoints ({NAVAL_VESSELS.length})</span>
                </button>

                <button
                  onClick={() => setShowEarthquakes(!showEarthquakes)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    showEarthquakes 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-[#141b2b] text-slate-500 border border-transparent'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>USGS Quakes ({EARTHQUAKES.length})</span>
                </button>

                <button
                  onClick={() => setShowCyber(!showCyber)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    showCyber 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                      : 'bg-[#141b2b] text-slate-500 border border-transparent'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Cyber APTs ({CYBER_THREATS.length})</span>
                </button>
              </div>
            </div>

            {/* Tactical World Map Display */}
            <div className="relative bg-[#080d17] border border-[#1e2a40] rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4">
              {/* Radar Grid Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, #00d2ff 1px, transparent 1px), linear-gradient(to bottom, #00d2ff 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Coordinates HUD */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0d1424]/90 backdrop-blur border border-[#1f2b42] px-3 py-1.5 rounded-lg text-[11px] font-mono text-cyan-400">
                <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
                <span>GLOBAL SITUATION HUD: 360° EQUIRECTANGULAR PROJECTION</span>
              </div>

              {/* SVG Map Canvas */}
              <div className="w-full aspect-[2/1] relative">
                <svg
                  viewBox="0 0 1000 500"
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,210,255,0.05))' }}
                >
                  {/* Continental land silhouettes */}
                  <g fill="#131b2e" stroke="#1d2840" strokeWidth="1">
                    {/* North America */}
                    <path d="M 120 70 Q 180 50 250 80 Q 280 120 270 180 Q 220 220 180 230 Q 150 180 130 140 Z" />
                    {/* South America */}
                    <path d="M 260 260 Q 320 270 340 330 Q 330 400 290 460 Q 250 420 250 340 Z" />
                    {/* Europe */}
                    <path d="M 460 90 Q 540 80 560 140 Q 520 180 460 160 Q 440 120 460 90 Z" />
                    {/* Africa */}
                    <path d="M 460 190 Q 560 180 580 260 Q 560 380 510 400 Q 450 330 440 250 Z" />
                    {/* Asia */}
                    <path d="M 570 80 Q 750 60 850 110 Q 890 200 800 250 Q 680 230 620 180 Z" />
                    {/* Australia */}
                    <path d="M 760 320 Q 850 310 870 380 Q 820 430 760 400 Z" />
                  </g>

                  {/* Latitude / Longitude Guide lines */}
                  <line x1="0" y1="250" x2="1000" y2="250" stroke="#1e2a40" strokeWidth="0.8" strokeDasharray="4 4" />
                  <line x1="500" y1="0" x2="500" y2="500" stroke="#1e2a40" strokeWidth="0.8" strokeDasharray="4 4" />

                  {/* 1. Conflict Hotspots (Red pulsing rings) */}
                  {showConflicts && CONFLICT_ZONES.map(zone => {
                    const { x, y } = projectCoords(zone.lat, zone.lng);
                    const isSelected = selectedConflict?.id === zone.id;

                    return (
                      <g 
                        key={zone.id} 
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => {
                          setSelectedConflict(zone);
                          setSelectedAircraft(null);
                          setSelectedNaval(null);
                          setSelectedEarthquake(null);
                        }}
                      >
                        <circle cx={x} cy={y} r="16" fill="rgba(239, 68, 68, 0.15)">
                          <animate attributeName="r" values="8;24;8" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={x} cy={y} r={isSelected ? "7" : "5"} fill={isSelected ? "#ff2222" : "#ef4444"} stroke="#fff" strokeWidth="1.5" />
                        <text x={x + 10} y={y + 4} fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          {zone.title.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* 2. Military Aircraft ADS-B Tracking (Cyan aircraft symbols) */}
                  {showAircraft && MILITARY_AIRCRAFT.map(plane => {
                    const { x, y } = projectCoords(plane.lat, plane.lng);
                    const isSelected = selectedAircraft?.id === plane.id;

                    return (
                      <g
                        key={plane.id}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => {
                          setSelectedAircraft(plane);
                          setSelectedConflict(null);
                          setSelectedNaval(null);
                          setSelectedEarthquake(null);
                        }}
                      >
                        <circle cx={x} cy={y} r="12" fill="rgba(0, 210, 255, 0.15)">
                          <animate attributeName="r" values="6;16;6" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                        <polygon
                          points={`${x},${y - 6} ${x + 5},${y + 5} ${x - 5},${y + 5}`}
                          fill={isSelected ? "#ffffff" : "#00d2ff"}
                          stroke="#082f49"
                          strokeWidth="1"
                          transform={`rotate(${plane.heading}, ${x}, ${y})`}
                        />
                        <text x={x + 8} y={y - 2} fill="#67e8f9" fontSize="9" fontFamily="monospace">
                          {plane.callsign}
                        </text>
                      </g>
                    );
                  })}

                  {/* 3. Naval CSGs & Strategic Chokepoints (Blue anchors) */}
                  {showNaval && NAVAL_VESSELS.map(vessel => {
                    const { x, y } = projectCoords(vessel.lat, vessel.lng);
                    const isSelected = selectedNaval?.id === vessel.id;

                    return (
                      <g
                        key={vessel.id}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => {
                          setSelectedNaval(vessel);
                          setSelectedConflict(null);
                          setSelectedAircraft(null);
                          setSelectedEarthquake(null);
                        }}
                      >
                        <rect x={x - 4} y={y - 4} width="8" height="8" fill={isSelected ? "#93c5fd" : "#3b82f6"} stroke="#1e3a8a" strokeWidth="1" />
                        <text x={x + 7} y={y + 8} fill="#93c5fd" fontSize="9" fontFamily="monospace">
                          {vessel.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* 4. USGS Earthquakes (Amber rings) */}
                  {showEarthquakes && EARTHQUAKES.map(eq => {
                    const { x, y } = projectCoords(eq.lat, eq.lng);
                    const isSelected = selectedEarthquake?.id === eq.id;

                    return (
                      <g
                        key={eq.id}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => {
                          setSelectedEarthquake(eq);
                          setSelectedConflict(null);
                          setSelectedAircraft(null);
                          setSelectedNaval(null);
                        }}
                      >
                        <circle cx={x} cy={y} r="10" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                        <circle cx={x} cy={y} r="3" fill="#f59e0b" />
                        <text x={x + 6} y={y - 4} fill="#fcd34d" fontSize="8" fontFamily="monospace">
                          M{eq.magnitude}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Map Footer Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1e2a40] text-xs font-mono text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Conflict Hotspots</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff]"></span>
                    <span>ADS-B Recon Flight</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Naval Strike Group</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>USGS Seismology</span>
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400">
                  Data latency: &lt;1.8s • Global ADS-B & AIS feeds verified
                </div>
              </div>
            </div>

            {/* Selected Target Intelligence Detail Drawer */}
            {selectedConflict && (
              <div className="bg-[#0e1626] border border-red-500/30 rounded-xl p-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f2d47]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white font-mono">{selectedConflict.title}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${getSeverityBadgeClass(selectedConflict.severity)}`}>
                          {selectedConflict.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Region: <span className="text-slate-200">{selectedConflict.region}</span> • DEFCON {selectedConflict.defcon} • Updated {selectedConflict.lastUpdate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Involved Factions:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {selectedConflict.parties.map((p, idx) => (
                        <span key={idx} className="text-[10px] bg-[#162136] text-slate-300 px-2 py-0.5 rounded border border-[#233352]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                  <div className="md:col-span-2">
                    <span className="text-slate-400 font-mono block mb-1">Operational Situation Summary:</span>
                    <p className="text-slate-200 leading-relaxed bg-[#0a0f1a] p-3 rounded-lg border border-[#1a263c]">
                      {selectedConflict.summary}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 bg-[#0a0f1a] p-3 rounded-lg border border-[#1a263c]">
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Market & Commodity Impact:</span>
                    </span>
                    <p className="text-amber-300 font-mono text-[11px] leading-relaxed">
                      {selectedConflict.marketImpact}
                    </p>
                    <div className="pt-2 border-t border-[#1a263c]">
                      <span className="text-[11px] text-slate-400 block mb-1.5">Correlated Tickers:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {selectedConflict.affectedAssets.map(sym => {
                          const matching = allAssets.find(a => a.symbol.toLowerCase() === sym.toLowerCase() || a.id.toLowerCase() === sym.toLowerCase());
                          return (
                            <button
                              key={sym}
                              onClick={() => matching && onSelectAsset && onSelectAsset(matching)}
                              className="px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-[#00d2ff] border border-cyan-800/40 text-[10px] font-mono font-bold transition-all flex items-center gap-1"
                            >
                              <span>{sym}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Aircraft Detail */}
            {selectedAircraft && (
              <div className="bg-[#0e1626] border border-cyan-500/30 rounded-xl p-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/30">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">
                        {selectedAircraft.callsign} — {selectedAircraft.model}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Operator: <span className="text-cyan-300">{selectedAircraft.operator}</span> • Mission: <span className="text-white">{selectedAircraft.mission}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono bg-[#090f1c] px-3 py-2 rounded-lg border border-[#1b273d]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">ALTITUDE</span>
                      <span className="text-[#00d2ff] font-bold">{selectedAircraft.altitudeFt.toLocaleString()} FT</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">SPEED</span>
                      <span className="text-emerald-400 font-bold">{selectedAircraft.speedKts} KTS</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">SQUAWK</span>
                      <span className="text-amber-400 font-bold">{selectedAircraft.squawk}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: 435+ LIVE INTELLIGENCE FEEDS WIRE            */}
        {/* ======================================================== */}
        {activeSubTab === 'feed' && (
          <div className="flex flex-col gap-4">
            {/* Control Bar: Categories & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0d131f] border border-[#1e2a40] p-3.5 rounded-xl">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {[
                  { id: 'all', label: 'All Feeds (435+)' },
                  { id: 'military', label: 'Military & Defense' },
                  { id: 'geopolitics', label: 'Geopolitics' },
                  { id: 'cyber', label: 'Cyber Threat Intel' },
                  { id: 'energy', label: 'Energy & Commodities' },
                  { id: 'polymarket', label: 'Polymarket Geopolitics' },
                  { id: 'disaster', label: 'USGS & Disasters' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNewsFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                      newsFilter === cat.id
                        ? 'bg-[#00d2ff] text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                        : 'bg-[#131b2b] text-slate-400 hover:text-white hover:bg-[#1a2538]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar & Audio Alert Toggle */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 435+ live feeds..."
                    className="w-full bg-[#080d17] border border-[#1e2a40] focus:border-[#00d2ff] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={() => setAudioAlerts(!audioAlerts)}
                  className={`p-2 rounded-lg border transition-colors ${
                    audioAlerts 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-[#080d17] text-slate-400 border-[#1e2a40] hover:text-white'
                  }`}
                  title={audioAlerts ? 'Audio alert chime enabled' : 'Enable audio alerts'}
                >
                  {audioAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Feed List */}
            <div className="flex flex-col gap-3">
              {filteredFeed.map(item => (
                <div 
                  key={item.id}
                  className="bg-[#0b101b] border border-[#1d273c] hover:border-cyan-500/40 rounded-xl p-4 transition-all hover:bg-[#0e1524] shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#172133]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${getSeverityBadgeClass(item.severity)}`}>
                        {item.severity}
                      </span>
                      <span className="text-xs font-mono font-semibold text-cyan-400">
                        {item.source}
                      </span>
                      {item.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>OSINT VERIFIED</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {item.summary}
                    </p>

                    {item.marketAssetImpact && (
                      <div className="flex items-center gap-2 bg-[#060a12] p-2.5 rounded-lg border border-[#162136] text-xs font-mono">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-slate-400">Market Correlation:</span>
                        <span className="text-amber-300 font-semibold">{item.marketAssetImpact}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 3: PENTAGON PIZZA INDEX & DEFCON WATCH           */}
        {/* ======================================================== */}
        {activeSubTab === 'pizza' && (
          <div className="flex flex-col gap-6">
            {/* Pizza Index Intelligence Brief */}
            <div className="bg-gradient-to-r from-[#17130a] via-[#1c160b] to-[#141d2e] border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0">
                    <Pizza className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white font-display">
                        The Pentagon Pizza Index — DEFCON Operational Tempo
                      </h2>
                      <span className="text-xs font-mono bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded animate-pulse">
                        SURGE ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      Historically tracked by OSINT analysts, sudden late-night delivery surges at pizza franchises surrounding the Pentagon, White House, and Langley frequently precede major military operations and geopolitical crisis responses.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 bg-[#0b0f19] p-4 rounded-xl border border-amber-500/30">
                  <span className="text-[10px] font-mono text-slate-400">AGGREGATE D.C. SURGE RATE</span>
                  <span className="text-3xl font-black text-amber-400 font-mono">+245%</span>
                  <span className="text-[10px] font-mono text-emerald-400">BASELINE EXCEEDED 3.4X</span>
                </div>
              </div>
            </div>

            {/* Monitored Intelligence Campuses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PIZZA_INDEX_FACILITIES.map(facility => (
                <div 
                  key={facility.id}
                  className="bg-[#0b101b] border border-[#1e2a40] hover:border-amber-500/40 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#182338]">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">{facility.name}</h3>
                      <p className="text-xs text-slate-400">{facility.location}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      facility.deliveryLevel.includes('SURGE') 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {facility.deliveryLevel}
                    </span>
                  </div>

                  <div className="pt-3 flex flex-col gap-3">
                    {/* Meter bar */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">Night Delivery Volume</span>
                        <span className="text-amber-400 font-bold">{facility.activePizzaOrders} boxes / hr (Norm: {facility.normalBaseline})</span>
                      </div>
                      <div className="w-full bg-[#141c2c] h-3 rounded-full overflow-hidden border border-[#202d44]">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-1000"
                          style={{ width: `${Math.min(100, (facility.activePizzaOrders / 90) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>DEFCON Level Link: <strong className="text-white">DEFCON {facility.defconCorrelation}</strong></span>
                      <span>Telemetry checked: {facility.lastChecked}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 4: GEOPOLITICS & MARKET IMPACT CORRELATIONS     */}
        {/* ======================================================== */}
        {activeSubTab === 'markets' && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#0b101b] border border-[#1e2a40] rounded-xl p-5">
              <h2 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Geopolitical Risk Premia & Asset Cross-Correlations</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Real-time tracking of how defense posture, maritime choke points, and energy supplies drive global pricing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0e1626] border border-[#1d2a42] p-4 rounded-xl">
                  <span className="text-xs font-mono text-slate-400 block mb-1">BRENT CRUDE OIL</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-white">$86.85</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+1.82%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Catalyst: Red Sea & Bab el-Mandeb rerouting risk
                  </span>
                </div>

                <div className="bg-[#0e1626] border border-[#1d2a42] p-4 rounded-xl">
                  <span className="text-xs font-mono text-slate-400 block mb-1">GOLD (XAU/USD)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-white">$2,682.40</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+0.94%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Catalyst: Flight to sovereign safety & central bank reserves
                  </span>
                </div>

                <div className="bg-[#0e1626] border border-[#1d2a42] p-4 rounded-xl">
                  <span className="text-xs font-mono text-slate-400 block mb-1">US DOLLAR INDEX (DXY)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-white">104.28</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+0.25%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Catalyst: Macro safe-haven dollar liquidity demand
                  </span>
                </div>

                <div className="bg-[#0e1626] border border-[#1d2a42] p-4 rounded-xl">
                  <span className="text-xs font-mono text-slate-400 block mb-1">DEFENSE AEROSPACE (ITA)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-white">$142.10</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+1.65%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Catalyst: NATO defense spending budget increases
                  </span>
                </div>
              </div>
            </div>

            {/* Polymarket Geopolitical Odds Panel */}
            <div className="bg-[#0b101b] border border-[#1e2a40] rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#182338] mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white font-mono">Polymarket Live Geopolitical Prediction Odds</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Total volume: $48.2M</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#080d17] p-3.5 rounded-xl border border-[#1b263b]">
                  <p className="text-xs text-slate-200 font-mono font-medium mb-2">
                    Red Sea commercial shipping normalized before July?
                  </p>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald-400 font-bold">YES: 28%</span>
                    <span className="text-red-400 font-bold">NO: 72%</span>
                  </div>
                </div>

                <div className="bg-[#080d17] p-3.5 rounded-xl border border-[#1b263b]">
                  <p className="text-xs text-slate-200 font-mono font-medium mb-2">
                    US-China bilateral security summit in Q2?
                  </p>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald-400 font-bold">YES: 74%</span>
                    <span className="text-red-400 font-bold">NO: 26%</span>
                  </div>
                </div>

                <div className="bg-[#080d17] p-3.5 rounded-xl border border-[#1b263b]">
                  <p className="text-xs text-slate-200 font-mono font-medium mb-2">
                    Global crude oil to breach $95 before year-end?
                  </p>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald-400 font-bold">YES: 61%</span>
                    <span className="text-red-400 font-bold">NO: 39%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 5: OFFICIAL WORLD MONITOR WEB PORTAL            */}
        {/* ======================================================== */}
        {activeSubTab === 'web' && (
          <div className="flex flex-col gap-5">
            {/* Direct Suite Navigation Cards */}
            <div>
              <h2 className="text-sm font-bold text-white font-mono mb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#00d2ff]" />
                <span>World Monitor Official Dashboards Suite (worldmonitor.app)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {WORLD_MONITOR_DASHBOARDS.map(dash => (
                  <div 
                    key={dash.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      selectedDashboardUrl === dash.url
                        ? 'bg-[#152033] border-[#00d2ff] shadow-lg shadow-cyan-950/40'
                        : 'bg-[#0d131f] border-[#1e2a40] hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e2c45] text-cyan-300">
                          {dash.badge}
                        </span>
                        <a 
                          href={dash.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white"
                          title="Open in new window"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1">{dash.name}</h3>
                      <p className="text-[11px] text-slate-400 leading-tight mb-3">{dash.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#1a253a]">
                      <button
                        onClick={() => {
                          setSelectedDashboardUrl(dash.url);
                          setIframeError(false);
                        }}
                        className="flex-1 py-1 rounded bg-[#1b263b] hover:bg-[#23324d] text-cyan-300 text-[10px] font-mono font-semibold transition-colors"
                      >
                        Embed View
                      </button>
                      <a
                        href={dash.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 text-[10px] font-mono font-bold transition-colors flex items-center gap-0.5"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Web Viewer & Iframe Fallback Cockpit */}
            <div className="bg-[#0b101b] border border-[#1e2a40] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              {/* Browser-style address bar header */}
              <div className="bg-[#101726] border-b border-[#1c273c] px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#080d17] border border-[#1e2a40] px-3 py-1 rounded-lg text-xs font-mono text-cyan-300 w-72 sm:w-96 truncate">
                    <Globe2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedDashboardUrl}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedDashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold px-3 py-1 rounded-lg text-xs font-mono transition-colors shadow-sm"
                  >
                    <span>Launch Full Window</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Iframe with automatic security fallback */}
              <div className="relative w-full h-[650px] bg-[#060a12]">
                <iframe
                  src={selectedDashboardUrl}
                  title="World Monitor App"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  onError={() => setIframeError(true)}
                />

                {/* Overlaid quick launch bar at bottom */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0a0f1c]/95 backdrop-blur-md border border-[#1e2c45] p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-[#00d2ff]">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-mono">
                        Direct Connection to {selectedDashboardUrl}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        If your browser security settings restrict embedding due to domain X-Frame policies, click the launch button.
                      </p>
                    </div>
                  </div>

                  <a
                    href={selectedDashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold text-xs font-mono transition-all shrink-0"
                  >
                    <span>Open {new URL(selectedDashboardUrl).hostname}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
