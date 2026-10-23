import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { SECTOR_DATA, SectorGroup, SectorItem } from '../data/mockSectors';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Layers, 
  ZoomIn, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

type TimeframeType = '1D' | '1W' | '1M' | 'YTD';
type FilterType = 'all' | 'gainers' | 'losers';

interface HierarchyDatum {
  name: string;
  id?: string;
  symbol?: string;
  marketCap?: number;
  perf?: number;
  sector?: string;
  subSector?: string;
  volume?: string;
  peRatio?: number;
  children?: HierarchyDatum[];
}

export const SectorPerformanceTreemap: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('1D');
  const [filterMode, setFilterMode] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{
    x: number;
    y: number;
    data: HierarchyDatum;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1000,
    height: 580
  });

  // Handle ResizeObserver for responsive SVG dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          // Maintain a balanced 16:9 - 2:1 aspect ratio with min height
          const computedHeight = Math.max(480, Math.min(680, width * 0.52));
          setDimensions({ width, height: computedHeight });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Performance extractor helper
  const getPerf = (item: { perf1D: number; perf1W: number; perf1M: number; perfYTD: number }): number => {
    switch (timeframe) {
      case '1W': return item.perf1W;
      case '1M': return item.perf1M;
      case 'YTD': return item.perfYTD;
      default: return item.perf1D;
    }
  };

  // Color generator for market performance
  const getColor = (perf: number): string => {
    if (perf >= 3.0) return '#059669'; // Emerald deep
    if (perf >= 1.5) return '#10b981'; // Green vibrant
    if (perf > 0.05) return '#15803d'; // Green soft
    if (perf >= -0.05 && perf <= 0.05) return '#334155'; // Neutral
    if (perf > -1.5) return '#b91c1c'; // Red soft
    if (perf > -3.0) return '#dc2626'; // Red medium
    return '#991b1b'; // Red deep
  };

  // Prepare D3 Hierarchy Data based on selected view & search
  const hierarchyData = useMemo<HierarchyDatum>(() => {
    let sectorsToInclude = SECTOR_DATA;

    if (selectedSectorId) {
      sectorsToInclude = sectorsToInclude.filter(s => s.id === selectedSectorId);
    }

    const root: HierarchyDatum = {
      name: 'Markets',
      children: sectorsToInclude.map(sec => {
        let items = sec.items;

        if (filterMode === 'gainers') {
          items = items.filter(it => getPerf(it) > 0);
        } else if (filterMode === 'losers') {
          items = items.filter(it => getPerf(it) < 0);
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          items = items.filter(it => 
            it.symbol.toLowerCase().includes(q) || 
            it.name.toLowerCase().includes(q) ||
            it.sector.toLowerCase().includes(q)
          );
        }

        return {
          name: sec.name,
          id: sec.id,
          perf: getPerf(sec),
          children: items.map(item => ({
            name: item.name,
            symbol: item.symbol,
            id: item.id,
            sector: item.sector,
            subSector: item.subSector,
            marketCap: item.marketCap,
            perf: getPerf(item),
            volume: item.volume,
            peRatio: item.peRatio
          }))
        };
      }).filter(sec => sec.children && sec.children.length > 0)
    };

    return root;
  }, [selectedSectorId, timeframe, filterMode, searchQuery]);

  // Compute Best & Worst Sectors for Top KPI Cards
  const sectorStats = useMemo(() => {
    const list = SECTOR_DATA.map(s => ({
      ...s,
      perf: getPerf(s)
    })).sort((a, b) => b.perf - a.perf);

    const best = list[0];
    const worst = list[list.length - 1];
    const advancing = list.filter(s => s.perf > 0).length;
    const declining = list.filter(s => s.perf < 0).length;
    const totalCap = list.reduce((acc, s) => acc + s.marketCap, 0);

    return { best, worst, advancing, declining, totalCap };
  }, [timeframe]);

  // Render D3 Treemap Layout
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (!hierarchyData.children || hierarchyData.children.length === 0) {
      svg.append('text')
        .attr('x', dimensions.width / 2)
        .attr('y', dimensions.height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '14px')
        .attr('font-family', '"JetBrains Mono", monospace')
        .text('No matching sectors or companies found.');
      return;
    }

    // 1. Build D3 Hierarchy
    const root = d3.hierarchy<HierarchyDatum>(hierarchyData)
      .sum(d => d.marketCap || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // 2. Compute Treemap coordinates
    const treemapLayout = d3.treemap<HierarchyDatum>()
      .size([dimensions.width, dimensions.height])
      .paddingTop(selectedSectorId ? 0 : 22)
      .paddingInner(2)
      .paddingOuter(2)
      .round(true);

    treemapLayout(root);

    // 3. Render Sector Group Containers (Headers)
    if (!selectedSectorId) {
      const sectorNodes = root.children || [];
      const sectorGroups = svg.selectAll('.sector-group')
        .data(sectorNodes)
        .enter()
        .append('g')
        .attr('class', 'sector-group');

      // Sector Header Text Bar
      sectorGroups.append('rect')
        .attr('x', d => (d as d3.HierarchyRectangularNode<HierarchyDatum>).x0)
        .attr('y', d => (d as d3.HierarchyRectangularNode<HierarchyDatum>).y0)
        .attr('width', d => Math.max(0, (d as d3.HierarchyRectangularNode<HierarchyDatum>).x1 - (d as d3.HierarchyRectangularNode<HierarchyDatum>).x0))
        .attr('height', 20)
        .attr('fill', '#0e1524')
        .attr('stroke', '#1f293d')
        .attr('stroke-width', 0.5)
        .attr('cursor', 'pointer')
        .on('click', (_, d) => {
          if (d.data.id) setSelectedSectorId(d.data.id);
        });

      sectorGroups.append('text')
        .attr('x', d => (d as d3.HierarchyRectangularNode<HierarchyDatum>).x0 + 6)
        .attr('y', d => (d as d3.HierarchyRectangularNode<HierarchyDatum>).y0 + 13)
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('font-family', '"Plus Jakarta Sans", sans-serif')
        .attr('cursor', 'pointer')
        .text(d => {
          const w = (d as d3.HierarchyRectangularNode<HierarchyDatum>).x1 - (d as d3.HierarchyRectangularNode<HierarchyDatum>).x0;
          if (w < 70) return '';
          const perf = d.data.perf ?? 0;
          const sign = perf >= 0 ? '+' : '';
          return `${d.data.name} (${sign}${perf.toFixed(2)}%)`;
        })
        .on('click', (_, d) => {
          if (d.data.id) setSelectedSectorId(d.data.id);
        });
    }

    // 4. Render Leaf Nodes (Individual Stocks)
    const leaves = root.leaves() as d3.HierarchyRectangularNode<HierarchyDatum>[];

    const leafGroups = svg.selectAll('.leaf-node')
      .data(leaves)
      .enter()
      .append('g')
      .attr('class', 'leaf-node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Leaf Background Rectangles
    leafGroups.append('rect')
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0))
      .attr('fill', d => getColor(d.data.perf ?? 0))
      .attr('stroke', '#0a0d14')
      .attr('stroke-width', 1.5)
      .attr('rx', 2)
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        setHoveredNode({
          x: mx,
          y: my,
          data: d.data
        });
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        setHoveredNode(prev => prev ? { ...prev, x: mx, y: my } : null);
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
      });

    // Leaf Text: Stock Symbol
    leafGroups.append('text')
      .attr('x', d => (d.x1 - d.x0) / 2)
      .attr('y', d => {
        const h = d.y1 - d.y0;
        return h > 45 ? (h / 2) - 4 : (h / 2) + 4;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', d => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w > 100 && h > 70) return '14px';
        if (w > 65 && h > 45) return '12px';
        if (w > 40 && h > 28) return '10px';
        return '8px';
      })
      .attr('font-weight', 'bold')
      .attr('font-family', '"JetBrains Mono", monospace')
      .attr('pointer-events', 'none')
      .text(d => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 32 || h < 20) return '';
        return d.data.symbol || '';
      });

    // Leaf Text: Performance Percentage
    leafGroups.append('text')
      .attr('x', d => (d.x1 - d.x0) / 2)
      .attr('y', d => (d.y1 - d.y0) / 2 + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('font-size', d => {
        const w = d.x1 - d.x0;
        return w > 70 ? '11px' : '9px';
      })
      .attr('font-weight', '600')
      .attr('font-family', '"JetBrains Mono", monospace')
      .attr('pointer-events', 'none')
      .text(d => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 45 || h < 40) return '';
        const perf = d.data.perf ?? 0;
        const sign = perf >= 0 ? '+' : '';
        return `${sign}${perf.toFixed(2)}%`;
      });
  }, [hierarchyData, dimensions, selectedSectorId]);

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1f293d]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00d2ff]" />
            <h2 className="text-xl font-bold text-white font-display">
              Sector Performance Heatmap
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            D3.js Market Treemap weighted by capitalization. Identify leading & lagging sectors instantly.
          </p>
        </div>

        {/* Timeframe & Filter Ribbon */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Breadcrumb zoom-out if drilled in */}
          {selectedSectorId && (
            <button
              onClick={() => setSelectedSectorId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141b2b] hover:bg-[#1a2336] text-[#00d2ff] border border-[#00d2ff]/40 rounded text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to All Sectors</span>
            </button>
          )}

          {/* Timeframe Selectors */}
          <div className="flex items-center gap-1 bg-[#101625] p-1 rounded border border-[#1f293d] text-xs">
            {(['1D', '1W', '1M', 'YTD'] as TimeframeType[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded font-mono text-[11px] transition-colors ${
                  timeframe === tf
                    ? 'bg-[#00d2ff] text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Direction Filter */}
          <div className="flex items-center gap-1 bg-[#101625] p-1 rounded border border-[#1f293d] text-xs">
            {(['all', 'gainers', 'losers'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilterMode(f)}
                className={`px-2.5 py-1 rounded capitalize font-mono text-[11px] transition-colors ${
                  filterMode === f
                    ? 'bg-[#1a2336] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ticker or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111726] border border-[#1f293d] focus:border-[#00d2ff] rounded pl-8 pr-2.5 py-1 text-slate-200 placeholder-slate-500 font-mono text-xs outline-none w-44"
            />
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 bg-[#0c101a] border border-[#1f293d] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Top Performing Sector ({timeframe})</span>
            <span className="text-base font-bold text-white mt-0.5 block">{sectorStats.best.name}</span>
          </div>
          <div className="flex items-center text-sm font-bold text-[#10b981] tabular-nums bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +{sectorStats.best.perf.toFixed(2)}%
          </div>
        </div>

        <div className="p-3.5 bg-[#0c101a] border border-[#1f293d] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Bottom Sector ({timeframe})</span>
            <span className="text-base font-bold text-white mt-0.5 block">{sectorStats.worst.name}</span>
          </div>
          <div className="flex items-center text-sm font-bold text-[#f43f5e] tabular-nums bg-rose-950/40 px-2 py-1 rounded border border-rose-800/40">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            {sectorStats.worst.perf.toFixed(2)}%
          </div>
        </div>

        <div className="p-3.5 bg-[#0c101a] border border-[#1f293d] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Advance / Decline Ratio</span>
            <span className="text-base font-bold text-slate-200 mt-0.5 block">
              <span className="text-[#10b981]">{sectorStats.advancing} Up</span> · <span className="text-[#f43f5e]">{sectorStats.declining} Down</span>
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {((sectorStats.advancing / (sectorStats.advancing + sectorStats.declining)) * 100).toFixed(0)}% Bullish
          </div>
        </div>

        <div className="p-3.5 bg-[#0c101a] border border-[#1f293d] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Total Monitored Cap</span>
            <span className="text-base font-bold text-white mt-0.5 block">
              ${(sectorStats.totalCap / 1000).toFixed(1)} Trillion
            </span>
          </div>
          <span className="text-[10px] text-[#00d2ff] bg-[#00d2ff]/10 px-2 py-0.5 rounded border border-[#00d2ff]/30 font-semibold uppercase">
            11 S&P Sectors
          </span>
        </div>
      </div>

      {/* Main Treemap Surface */}
      <div 
        ref={containerRef}
        className="relative bg-[#0c101a] border border-[#1f293d] rounded-xl p-3 shadow-2xl overflow-hidden min-h-[500px]"
      >
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#1f293d] text-xs font-mono text-slate-400">
          <button 
            onClick={() => setSelectedSectorId(null)}
            className="hover:text-[#00d2ff] transition-colors"
          >
            All S&P Sectors
          </button>
          {selectedSectorId && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#00d2ff] font-semibold">
                {SECTOR_DATA.find(s => s.id === selectedSectorId)?.name}
              </span>
            </>
          )}
          <span className="ml-auto text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Click any sector to drill down · Box size = Market Cap
          </span>
        </div>

        {/* SVG Container for D3 */}
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full block select-none"
        />

        {/* Hover Floating Tooltip */}
        {hoveredNode && (
          <div
            className="absolute z-50 pointer-events-none p-3 bg-[#111726] border border-[#1f293d] rounded-lg shadow-2xl text-xs font-mono space-y-1.5 transition-all duration-75"
            style={{
              left: `${Math.min(hoveredNode.x + 15, dimensions.width - 220)}px`,
              top: `${Math.min(hoveredNode.y + 15, dimensions.height - 140)}px`,
              width: '210px'
            }}
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#1f293d]">
              <span className="font-bold text-white text-sm">
                {hoveredNode.data.symbol || hoveredNode.data.name}
              </span>
              <span className={`font-bold tabular-nums text-xs ${
                (hoveredNode.data.perf ?? 0) >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'
              }`}>
                {(hoveredNode.data.perf ?? 0) >= 0 ? '+' : ''}{(hoveredNode.data.perf ?? 0).toFixed(2)}%
              </span>
            </div>

            <div className="text-[11px] text-slate-300 truncate">
              {hoveredNode.data.name}
            </div>

            {hoveredNode.data.subSector && (
              <div className="text-[10px] text-slate-400">
                Industry: <span className="text-slate-200">{hoveredNode.data.subSector}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1 border-t border-[#172030]">
              <div>
                <span>Market Cap:</span>
                <span className="text-white block font-semibold">${hoveredNode.data.marketCap}B</span>
              </div>
              {hoveredNode.data.peRatio ? (
                <div>
                  <span>P/E Ratio:</span>
                  <span className="text-white block font-semibold">{hoveredNode.data.peRatio}x</span>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Sector Quick Switcher Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
        {SECTOR_DATA.map((sec) => {
          const perf = getPerf(sec);
          const isUp = perf >= 0;
          const isSelected = sec.id === selectedSectorId;

          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSectorId(isSelected ? null : sec.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-[#141d2d] border-[#00d2ff] shadow-md shadow-cyan-950/30'
                  : 'bg-[#0c101a] border-[#1f293d] hover:bg-[#111726]'
              }`}
            >
              <div className="text-slate-300 font-semibold truncate text-[11px]">{sec.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-500">${(sec.marketCap / 1000).toFixed(1)}T</span>
                <span className={`text-[11px] font-bold tabular-nums ${isUp ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                  {isUp ? '+' : ''}{perf.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
