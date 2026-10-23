import React, { useState } from 'react';
import { DrawingToolType } from '../../types/drawings';
import { 
  Crosshair, 
  Slash, 
  Minus, 
  Grid, 
  Square, 
  TrendingUp, 
  TrendingDown, 
  Ruler, 
  Magnet, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Trash2, 
  ChevronRight,
  Brush,
  Type
} from 'lucide-react';

interface LeftDrawingToolbarProps {
  activeTool: DrawingToolType;
  setActiveTool: (tool: DrawingToolType) => void;
  isMagnetActive: boolean;
  setIsMagnetActive: (val: boolean | ((v: boolean) => boolean)) => void;
  isDrawingsLocked: boolean;
  setIsDrawingsLocked: (val: boolean | ((v: boolean) => boolean)) => void;
  isDrawingsHidden: boolean;
  setIsDrawingsHidden: (val: boolean | ((v: boolean) => boolean)) => void;
  onClearAllDrawings: () => void;
}

export const LeftDrawingToolbar: React.FC<LeftDrawingToolbarProps> = ({
  activeTool,
  setActiveTool,
  isMagnetActive,
  setIsMagnetActive,
  isDrawingsLocked,
  setIsDrawingsLocked,
  isDrawingsHidden,
  setIsDrawingsHidden,
  onClearAllDrawings,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const tools = [
    {
      id: 'crosshair',
      tool: 'crosshair' as DrawingToolType,
      icon: Crosshair,
      label: 'Crosshair',
      submenu: false
    },
    {
      id: 'lines',
      tool: 'trendline' as DrawingToolType,
      icon: Slash,
      label: 'Trend Line Tools',
      items: [
        { tool: 'trendline' as DrawingToolType, label: 'Trend Line', icon: Slash },
        { tool: 'horizontal' as DrawingToolType, label: 'Horizontal Line', icon: Minus }
      ]
    },
    {
      id: 'fib',
      tool: 'fibonacci' as DrawingToolType,
      icon: Grid,
      label: 'Fibonacci Retracement',
      submenu: false
    },
    {
      id: 'shapes',
      tool: 'rectangle' as DrawingToolType,
      icon: Square,
      label: 'Geometric Shapes',
      items: [
        { tool: 'rectangle' as DrawingToolType, label: 'Rectangle (Supply/Demand)', icon: Square },
        { tool: 'brush' as DrawingToolType, label: 'Freehand Brush', icon: Brush }
      ]
    },
    {
      id: 'projections',
      tool: 'long_position' as DrawingToolType,
      icon: TrendingUp,
      label: 'Prediction & Measurement',
      items: [
        { tool: 'long_position' as DrawingToolType, label: 'Long Position (R:R Box)', icon: TrendingUp },
        { tool: 'short_position' as DrawingToolType, label: 'Short Position (R:R Box)', icon: TrendingDown },
        { tool: 'measurement' as DrawingToolType, label: 'Price Range Ruler', icon: Ruler }
      ]
    }
  ];

  return (
    <div className="w-11 bg-[#0c101a] border-r border-[#1f293d] flex flex-col items-center py-2 justify-between shrink-0 select-none z-20">
      {/* Top Drawing Tools */}
      <div className="flex flex-col items-center gap-1 w-full">
        {tools.map((group) => {
          const Icon = group.icon;
          const isActive = activeTool === group.tool || (group.items && group.items.some(i => i.tool === activeTool));

          return (
            <div key={group.id} className="relative group w-full flex justify-center">
              <button
                onClick={() => {
                  setActiveTool(group.tool);
                  if (group.items) {
                    setOpenSubmenu(openSubmenu === group.id ? null : group.id);
                  } else {
                    setOpenSubmenu(null);
                  }
                }}
                title={group.label}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
                  isActive
                    ? 'bg-[#182236] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {group.items && (
                  <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-slate-500" />
                )}
              </button>

              {/* Flyout Submenu for tools */}
              {group.items && openSubmenu === group.id && (
                <div className="absolute left-11 top-0 bg-[#111726] border border-[#1f293d] rounded-lg shadow-2xl py-1.5 w-52 z-50 text-xs font-mono">
                  <div className="px-3 py-1 text-[10px] text-slate-500 uppercase tracking-wider border-b border-[#1f293d] mb-1">
                    {group.label}
                  </div>
                  {group.items.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeTool === subItem.tool;

                    return (
                      <button
                        key={subItem.tool}
                        onClick={() => {
                          setActiveTool(subItem.tool);
                          setOpenSubmenu(null);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors ${
                          isSubActive
                            ? 'bg-[#1a2336] text-[#00d2ff] font-semibold'
                            : 'text-slate-300 hover:bg-[#151d2f]'
                        }`}
                      >
                        <SubIcon className="w-4 h-4" />
                        <span>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Utility Controls */}
      <div className="flex flex-col items-center gap-1 w-full pt-2 border-t border-[#1f293d]">
        {/* Magnet Mode */}
        <button
          onClick={() => setIsMagnetActive(prev => !prev)}
          title={isMagnetActive ? "Magnet Mode ON (Snap to OHLC)" : "Magnet Mode OFF"}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
            isMagnetActive ? 'bg-[#00d2ff]/20 text-[#00d2ff]' : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2a]'
          }`}
        >
          <Magnet className="w-4 h-4" />
        </button>

        {/* Lock Drawings */}
        <button
          onClick={() => setIsDrawingsLocked(prev => !prev)}
          title={isDrawingsLocked ? "Drawings Locked" : "Lock All Drawings"}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
            isDrawingsLocked ? 'bg-amber-950/40 text-amber-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2a]'
          }`}
        >
          {isDrawingsLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>

        {/* Hide / Show Drawings */}
        <button
          onClick={() => setIsDrawingsHidden(prev => !prev)}
          title={isDrawingsHidden ? "Show All Drawings" : "Hide All Drawings"}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
            isDrawingsHidden ? 'bg-slate-800 text-rose-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2a]'
          }`}
        >
          {isDrawingsHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Remove All Drawings Trash */}
        <button
          onClick={onClearAllDrawings}
          title="Remove All Drawings"
          className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
