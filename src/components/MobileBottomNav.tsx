import React from 'react';
import { 
  LineChart, 
  LayoutGrid,
  Globe2, 
  Briefcase, 
  Layers, 
  FileText, 
  Shield,
  Sparkles,
  Share2,
  Radio,
  Zap
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'explore' | 'terminal' | 'sectors' | 'worldmap' | 'worldmonitor' | 'portfolio' | 'brokers' | 'tax' | 'security' | 'publish' | 'subscription';
  setActiveTab: (tab: 'explore' | 'terminal' | 'sectors' | 'worldmap' | 'worldmonitor' | 'portfolio' | 'brokers' | 'tax' | 'security' | 'publish' | 'subscription') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'terminal', label: 'Charts', icon: LineChart },
    { id: 'subscription', label: 'Plans', icon: Zap },
    { id: 'worldmonitor', label: 'Monitor', icon: Radio },
    { id: 'worldmap', label: 'World', icon: Globe2 },
    { id: 'sectors', label: 'Sectors', icon: LayoutGrid },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'publish', label: 'Stores', icon: Share2 },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c101a] border-t border-[#1f293d] px-2 py-1 flex items-center justify-around text-[10px] font-mono">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-1 px-2 rounded transition-colors ${
              isActive ? 'text-[#00d2ff] font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
