import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Asset, Timeframe, ChartType, TechnicalIndicatorConfig, Candle } from '../types/trading';
import { ChartDrawing, DrawingToolType } from '../types/drawings';
import { 
  calculateEMA, 
  calculateBollingerBands, 
  calculateRSI, 
  calculateMACD, 
  calculateATR 
} from '../utils/indicators';

interface TradingChartProps {
  asset: Asset;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  indicators: TechnicalIndicatorConfig;
  setIndicators: React.Dispatch<React.SetStateAction<TechnicalIndicatorConfig>>;
  onOpenAlertModal: (asset: Asset) => void;
  activeTool?: DrawingToolType;
  drawings?: ChartDrawing[];
  onAddDrawing?: (drawing: ChartDrawing) => void;
  isDrawingsLocked?: boolean;
  isDrawingsHidden?: boolean;
  compareSymbol?: string | null;
  compareAsset?: Asset;
  isReplayMode?: boolean;
  replayIndex?: number;
  chartType?: ChartType;
  onQuickTrade?: (side: 'buy' | 'sell', amount: number) => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  asset,
  indicators,
  activeTool = 'crosshair',
  drawings = [],
  onAddDrawing,
  isDrawingsHidden = false,
  compareSymbol = null,
  compareAsset,
  isReplayMode = false,
  replayIndex,
  chartType = 'candles',
  onQuickTrade,
}) => {
  const [activeSubIndicator, setActiveSubIndicator] = useState<'rsi' | 'macd' | 'volume' | 'atr'>('rsi');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [drawingStart, setDrawingStart] = useState<{ index: number; price: number } | null>(null);
  const [quickQty, setQuickQty] = useState<number>(10);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subCanvasRef = useRef<HTMLCanvasElement>(null);

  // If replay mode, slice historical candles up to replay index
  const candles = useMemo(() => {
    if (isReplayMode && replayIndex !== undefined && replayIndex < asset.candles.length) {
      return asset.candles.slice(0, Math.max(10, replayIndex));
    }
    return asset.candles;
  }, [asset.candles, isReplayMode, replayIndex]);

  // Compute indicators
  const ema20 = useMemo(() => calculateEMA(candles, 20), [candles]);
  const ema50 = useMemo(() => calculateEMA(candles, 50), [candles]);
  const ema200 = useMemo(() => calculateEMA(candles, 200), [candles]);
  const bBands = useMemo(() => calculateBollingerBands(candles, 20, 2), [candles]);
  const rsi = useMemo(() => calculateRSI(candles, 14), [candles]);
  const macdData = useMemo(() => calculateMACD(candles, 12, 26, 9), [candles]);
  const atr = useMemo(() => calculateATR(candles, 14), [candles]);

  // Main canvas renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const rightMargin = 72; // Price axis
    const bottomMargin = 24; // Time axis
    const chartWidth = width - rightMargin;
    const chartHeight = height - bottomMargin;

    // Background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    if (candles.length === 0) return;

    // Price bounds
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    candles.forEach((c, idx) => {
      minPrice = Math.min(minPrice, c.low);
      maxPrice = Math.max(maxPrice, c.high);

      if (indicators.showBollinger) {
        if (bBands.lower[idx] !== null) minPrice = Math.min(minPrice, bBands.lower[idx] as number);
        if (bBands.upper[idx] !== null) maxPrice = Math.max(maxPrice, bBands.upper[idx] as number);
      }
      if (indicators.showEMA20 && ema20[idx] !== null) {
        minPrice = Math.min(minPrice, ema20[idx] as number);
        maxPrice = Math.max(maxPrice, ema20[idx] as number);
      }
      if (indicators.showEMA50 && ema50[idx] !== null) {
        minPrice = Math.min(minPrice, ema50[idx] as number);
        maxPrice = Math.max(maxPrice, ema50[idx] as number);
      }
      if (indicators.showEMA200 && ema200[idx] !== null) {
        minPrice = Math.min(minPrice, ema200[idx] as number);
        maxPrice = Math.max(maxPrice, ema200[idx] as number);
      }
    });

    const pricePadding = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    const getY = (price: number) => {
      return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    };

    const getPriceAtY = (y: number) => {
      return maxPrice - (y / chartHeight) * priceRange;
    };

    const candleWidth = Math.max(2, chartWidth / candles.length);
    const candleGap = Math.max(1, candleWidth * 0.25);
    const bodyWidth = Math.max(1, candleWidth - candleGap);

    // 1. Grid lines
    ctx.strokeStyle = '#141c2b';
    ctx.lineWidth = 1;
    const gridSteps = 6;
    for (let i = 0; i <= gridSteps; i++) {
      const y = (chartHeight / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      const priceAtY = maxPrice - (i / gridSteps) * priceRange;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        priceAtY < 10 ? priceAtY.toFixed(4) : priceAtY.toFixed(2),
        chartWidth + 8,
        y + 3.5
      );
    }

    // Vertical time grid lines
    const timeSteps = 6;
    for (let i = 0; i < timeSteps; i++) {
      const idx = Math.floor((candles.length - 1) * (i / (timeSteps - 1)));
      const x = (idx + 0.5) * candleWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();

      const timeStr = new Date(candles[idx].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(timeStr, x, chartHeight + 16);
    }

    // 2. Bollinger Bands
    if (indicators.showBollinger) {
      ctx.beginPath();
      let first = true;
      for (let i = 0; i < candles.length; i++) {
        const up = bBands.upper[i];
        if (up !== null) {
          const x = (i + 0.5) * candleWidth;
          const y = getY(up);
          if (first) { ctx.moveTo(x, y); first = false; } else { ctx.lineTo(x, y); }
        }
      }
      for (let i = candles.length - 1; i >= 0; i--) {
        const low = bBands.lower[i];
        if (low !== null) {
          const x = (i + 0.5) * candleWidth;
          ctx.lineTo(x, getY(low));
        }
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 210, 255, 0.04)';
      ctx.fill();

      // Band lines
      const drawBand = (arr: (number | null)[], col: string) => {
        ctx.strokeStyle = col;
        ctx.beginPath();
        let f = true;
        for (let i = 0; i < candles.length; i++) {
          const v = arr[i];
          if (v !== null) {
            const x = (i + 0.5) * candleWidth;
            const y = getY(v);
            if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
          }
        }
        ctx.stroke();
      };

      drawBand(bBands.upper, 'rgba(0, 210, 255, 0.35)');
      drawBand(bBands.lower, 'rgba(0, 210, 255, 0.35)');
      drawBand(bBands.middle, 'rgba(255, 255, 255, 0.2)');
    }

    // 3. EMAs
    const drawLine = (data: (number | null)[], color: string, w = 1.5) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.beginPath();
      let f = true;
      for (let i = 0; i < candles.length; i++) {
        const val = data[i];
        if (val !== null) {
          const x = (i + 0.5) * candleWidth;
          const y = getY(val);
          if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();
    };

    if (indicators.showEMA20) drawLine(ema20, '#00d2ff', 1.5);
    if (indicators.showEMA50) drawLine(ema50, '#f59e0b', 1.5);
    if (indicators.showEMA200) drawLine(ema200, '#a855f7', 1.5);

    // 4. Compare Symbol Overlay
    if (compareSymbol && compareAsset && compareAsset.candles.length > 0) {
      const compCandles = compareAsset.candles;
      const baseClose = compCandles[0]?.close || 1;
      const targetBaseClose = candles[0]?.close || 1;

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      let f = true;

      for (let i = 0; i < candles.length; i++) {
        const compIdx = Math.min(i, compCandles.length - 1);
        const compClose = compCandles[compIdx].close;
        const compPct = (compClose - baseClose) / baseClose;
        const normalizedPrice = targetBaseClose * (1 + compPct);

        const x = (i + 0.5) * candleWidth;
        const y = getY(normalizedPrice);
        if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(`vs ${compareSymbol}`, chartWidth - 80, 20);
    }

    // 5. Candles or Line / Area
    if (chartType === 'candles') {
      candles.forEach((c, idx) => {
        const x = idx * candleWidth + candleGap / 2;
        const centerX = x + bodyWidth / 2;
        const isUp = c.close >= c.open;
        const color = isUp ? '#10b981' : '#f43f5e';

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(centerX, getY(c.high));
        ctx.lineTo(centerX, getY(c.low));
        ctx.stroke();

        // Body
        const topY = getY(Math.max(c.open, c.close));
        const bottomY = getY(Math.min(c.open, c.close));
        const h = Math.max(1, bottomY - topY);

        ctx.fillStyle = color;
        ctx.fillRect(x, topY, bodyWidth, h);
      });
    } else {
      ctx.beginPath();
      let f = true;
      candles.forEach((c, idx) => {
        const x = (idx + 0.5) * candleWidth;
        const y = getY(c.close);
        if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
      });

      if (chartType === 'area') {
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.lineTo((candles.length - 0.5) * candleWidth, chartHeight);
        ctx.lineTo(0.5 * candleWidth, chartHeight);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
        gradient.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 210, 255, 0.0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      } else {
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 6. Drawings Overlays (TradingView style lines, zones, Fibonacci & R:R positions)
    if (!isDrawingsHidden && drawings.length > 0) {
      drawings.forEach(d => {
        if (d.type === 'horizontal' && d.points[0]) {
          const y = getY(d.points[0].price);
          ctx.strokeStyle = d.color || '#00d2ff';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(chartWidth, y);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = d.color || '#00d2ff';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`Level: $${d.points[0].price.toFixed(2)}`, 8, y - 4);
        } else if (d.type === 'trendline' && d.points.length >= 2) {
          const p1 = d.points[0];
          const p2 = d.points[1];
          const x1 = (p1.index + 0.5) * candleWidth;
          const y1 = getY(p1.price);
          const x2 = (p2.index + 0.5) * candleWidth;
          const y2 = getY(p2.price);

          ctx.strokeStyle = d.color || '#00d2ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        } else if (d.type === 'fibonacci' && d.points.length >= 2) {
          const highP = Math.max(d.points[0].price, d.points[1].price);
          const lowP = Math.min(d.points[0].price, d.points[1].price);
          const diff = highP - lowP;

          const fibRatios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
          const fibColors = ['#94a3b8', '#00d2ff', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#94a3b8'];

          fibRatios.forEach((ratio, rIdx) => {
            const p = highP - diff * ratio;
            const y = getY(p);
            ctx.strokeStyle = fibColors[rIdx];
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 2]);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(chartWidth, y);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = fibColors[rIdx];
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillText(`Fib ${ratio} ($${p.toFixed(2)})`, 8, y - 2);
          });
        } else if (d.type === 'long_position' && d.points[0]) {
          const entryPrice = d.points[0].price;
          const tpPrice = entryPrice * 1.06;
          const slPrice = entryPrice * 0.97;
          const entryX = (d.points[0].index + 0.5) * candleWidth;
          const boxW = Math.min(180, chartWidth - entryX);

          // Profit Zone (Green)
          const tpY = getY(tpPrice);
          const entryY = getY(entryPrice);
          const slY = getY(slPrice);

          ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.fillRect(entryX, tpY, boxW, entryY - tpY);
          ctx.strokeStyle = '#10b981';
          ctx.strokeRect(entryX, tpY, boxW, entryY - tpY);

          // Stop Zone (Red)
          ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
          ctx.fillRect(entryX, entryY, boxW, slY - entryY);
          ctx.strokeStyle = '#f43f5e';
          ctx.strokeRect(entryX, entryY, boxW, slY - entryY);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText(`Long R:R 2.0 (TP: $${tpPrice.toFixed(2)} | SL: $${slPrice.toFixed(2)})`, entryX + 4, entryY - 4);
        } else if (d.type === 'rectangle' && d.points.length >= 2) {
          const p1 = d.points[0];
          const p2 = d.points[1];
          const x1 = Math.min(p1.index, p2.index) * candleWidth;
          const x2 = (Math.max(p1.index, p2.index) + 1) * candleWidth;
          const y1 = getY(Math.max(p1.price, p2.price));
          const y2 = getY(Math.min(p1.price, p2.price));

          ctx.fillStyle = 'rgba(0, 210, 255, 0.12)';
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          ctx.strokeStyle = '#00d2ff';
          ctx.lineWidth = 1;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        }
      });
    }

    // 7. Current Price dashed line
    const lastCandle = candles[candles.length - 1];
    const currentY = getY(lastCandle.close);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = lastCandle.close >= lastCandle.open ? '#10b981' : '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(chartWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price tag
    ctx.fillStyle = lastCandle.close >= lastCandle.open ? '#10b981' : '#f43f5e';
    ctx.fillRect(chartWidth, currentY - 9, rightMargin - 4, 18);
    ctx.fillStyle = '#0a0d14';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      lastCandle.close < 10 ? lastCandle.close.toFixed(4) : lastCandle.close.toFixed(2),
      chartWidth + (rightMargin - 4) / 2,
      currentY + 3.5
    );

    // 8. Crosshair
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candles.length) {
      const c = candles[hoverIndex];
      const hX = (hoverIndex + 0.5) * candleWidth;
      const hY = getY(c.close);

      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.8;

      ctx.beginPath();
      ctx.moveTo(hX, 0);
      ctx.lineTo(hX, chartHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, hY);
      ctx.lineTo(chartWidth, hY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [candles, indicators, chartType, bBands, ema20, ema50, ema200, hoverIndex, drawings, isDrawingsHidden, compareSymbol, compareAsset]);

  // Sub-Indicator renderer (RSI / MACD / Volume / ATR)
  useEffect(() => {
    const canvas = subCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const rightMargin = 72;
    const chartWidth = width - rightMargin;

    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    if (candles.length === 0) return;
    const candleWidth = Math.max(2, chartWidth / candles.length);

    if (activeSubIndicator === 'rsi') {
      const getY = (v: number) => height - (v / 100) * height;

      ctx.fillStyle = 'rgba(244, 63, 94, 0.05)';
      ctx.fillRect(0, 0, chartWidth, getY(70));
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.fillRect(0, getY(30), chartWidth, height - getY(30));

      ctx.strokeStyle = '#f43f5e88';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, getY(70));
      ctx.lineTo(chartWidth, getY(70));
      ctx.stroke();

      ctx.strokeStyle = '#10b98188';
      ctx.beginPath();
      ctx.moveTo(0, getY(30));
      ctx.lineTo(chartWidth, getY(30));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      let f = true;
      for (let i = 0; i < candles.length; i++) {
        const val = rsi[i];
        if (val !== null) {
          const x = (i + 0.5) * candleWidth;
          const y = getY(val);
          if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();

      const lastRSI = rsi[rsi.length - 1];
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(`RSI(14): ${lastRSI ? lastRSI.toFixed(1) : '50.0'}`, chartWidth + 6, height / 2 + 3);

    } else if (activeSubIndicator === 'macd') {
      let maxAbs = 0.01;
      macdData.histogram.forEach(h => { if (h !== null) maxAbs = Math.max(maxAbs, Math.abs(h)); });
      const zeroY = height / 2;
      const scale = (height * 0.45) / maxAbs;
      const getY = (val: number) => zeroY - val * scale;

      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(chartWidth, zeroY);
      ctx.stroke();

      const barWidth = Math.max(1, candleWidth * 0.6);
      for (let i = 0; i < candles.length; i++) {
        const h = macdData.histogram[i];
        if (h !== null) {
          const x = i * candleWidth + (candleWidth - barWidth) / 2;
          const barY = getY(h);
          ctx.fillStyle = h >= 0 ? '#10b981aa' : '#f43f5eaa';
          ctx.fillRect(x, Math.min(zeroY, barY), barWidth, Math.abs(zeroY - barY));
        }
      }

      ctx.strokeStyle = '#00d2ff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      let f = true;
      for (let i = 0; i < candles.length; i++) {
        const val = macdData.macd[i];
        if (val !== null) {
          const x = (i + 0.5) * candleWidth;
          const y = getY(val);
          if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      f = true;
      for (let i = 0; i < candles.length; i++) {
        const val = macdData.signal[i];
        if (val !== null) {
          const x = (i + 0.5) * candleWidth;
          const y = getY(val);
          if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`MACD`, chartWidth + 6, height / 2 + 3);

    } else if (activeSubIndicator === 'volume') {
      let maxVol = 1;
      candles.forEach(c => maxVol = Math.max(maxVol, c.volume));
      const barWidth = Math.max(1, candleWidth * 0.7);

      for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        const barHeight = (c.volume / maxVol) * (height - 10);
        const x = i * candleWidth + (candleWidth - barWidth) / 2;
        const y = height - barHeight;
        ctx.fillStyle = c.close >= c.open ? '#10b981aa' : '#f43f5eaa';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`VOL`, chartWidth + 6, height / 2 + 3);

    } else if (activeSubIndicator === 'atr') {
      let minA = Infinity, maxA = -Infinity;
      atr.forEach(a => { if (a !== null) { minA = Math.min(minA, a); maxA = Math.max(maxA, a); } });
      const range = (maxA - minA) || 1;
      const getY = (val: number) => height - 10 - ((val - minA) / range) * (height - 20);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let f = true;
      for (let i = 0; i < candles.length; i++) {
        const val = atr[i];
        if (val !== null) {
          const x = (i + 0.5) * candleWidth;
          const y = getY(val);
          if (f) { ctx.moveTo(x, y); f = false; } else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();

      const lastATR = atr[atr.length - 1];
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(`ATR: ${lastATR ? lastATR.toFixed(3) : '0'}`, chartWidth + 6, height / 2 + 3);
    }
  }, [candles, activeSubIndicator, rsi, macdData, atr]);

  // Click & drawing handler on chart canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onAddDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const rightMargin = 72;
    const bottomMargin = 24;
    const chartWidth = rect.width - rightMargin;
    const chartHeight = rect.height - bottomMargin;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > chartWidth || y < 0 || y > chartHeight) return;

    let minP = Infinity, maxP = -Infinity;
    candles.forEach(c => { minP = Math.min(minP, c.low); maxP = Math.max(maxP, c.high); });
    const pad = (maxP - minP) * 0.08 || 1;
    minP -= pad;
    maxP += pad;
    const pRange = maxP - minP;

    const candleWidth = chartWidth / candles.length;
    const index = Math.max(0, Math.min(candles.length - 1, Math.floor(x / candleWidth)));
    const price = maxP - (y / chartHeight) * pRange;

    if (activeTool === 'horizontal') {
      onAddDrawing({
        id: `draw-${Date.now()}`,
        type: 'horizontal',
        points: [{ index, price }],
        color: '#00d2ff'
      });
    } else if (activeTool === 'long_position') {
      onAddDrawing({
        id: `draw-${Date.now()}`,
        type: 'long_position',
        points: [{ index, price }],
        color: '#10b981'
      });
    } else if (activeTool === 'trendline' || activeTool === 'fibonacci' || activeTool === 'rectangle') {
      if (!drawingStart) {
        setDrawingStart({ index, price });
      } else {
        onAddDrawing({
          id: `draw-${Date.now()}`,
          type: activeTool,
          points: [drawingStart, { index, price }],
          color: activeTool === 'fibonacci' ? '#f59e0b' : '#00d2ff'
        });
        setDrawingStart(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rightMargin = 72;
    const chartWidth = rect.width - rightMargin;
    const x = e.clientX - rect.left;

    if (x < 0 || x > chartWidth) {
      setHoverIndex(null);
      return;
    }

    const candleWidth = chartWidth / candles.length;
    const idx = Math.floor(x / candleWidth);
    setHoverIndex(Math.max(0, Math.min(candles.length - 1, idx)));
  };

  const currentCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0d14] overflow-hidden select-none">
      {/* Telemetry Bar (TradingView style OHLCV + Indicators readout) */}
      {currentCandle && (
        <div className="flex items-center gap-4 px-3 py-1 bg-[#0a0d14] border-b border-[#141c2c] text-[11px] font-mono text-slate-400 overflow-x-auto shrink-0">
          <span className="font-bold text-white">{asset.symbol}</span>
          <span>O: <span className="text-slate-200">{currentCandle.open}</span></span>
          <span>H: <span className="text-slate-200">{currentCandle.high}</span></span>
          <span>L: <span className="text-slate-200">{currentCandle.low}</span></span>
          <span>C: <span className={currentCandle.close >= currentCandle.open ? 'text-[#10b981]' : 'text-[#f43f5e]'}>{currentCandle.close}</span></span>
          <span>Vol: <span className="text-slate-300">{currentCandle.volume.toLocaleString()}</span></span>

          {indicators.showEMA20 && ema20[hoverIndex ?? ema20.length - 1] && (
            <span className="text-[#00d2ff]">EMA 20: {ema20[hoverIndex ?? ema20.length - 1]?.toFixed(2)}</span>
          )}
          {indicators.showEMA50 && ema50[hoverIndex ?? ema50.length - 1] && (
            <span className="text-amber-400">EMA 50: {ema50[hoverIndex ?? ema50.length - 1]?.toFixed(2)}</span>
          )}
          {indicators.showBollinger && bBands.upper[hoverIndex ?? bBands.upper.length - 1] && (
            <span className="text-cyan-300">BB (20,2)</span>
          )}
          {drawingStart && (
            <span className="text-amber-400 animate-pulse">Click 2nd point to finish {activeTool}</span>
          )}
        </div>
      )}

      {/* Main Canvas */}
      <div className="relative flex-1 bg-[#0a0d14] min-h-[300px]">
        {/* TradingView Signature Floating Buy/Sell Quick Bar */}
        <div className="absolute top-3 left-3 z-20 flex items-center bg-[#0c101a]/90 backdrop-blur-md border border-[#1f293d] rounded-lg shadow-2xl font-mono text-xs overflow-hidden">
          {/* Sell Market Button */}
          <button
            onClick={() => onQuickTrade?.('sell', quickQty)}
            title="Execute Sell Order at Bid"
            className="flex flex-col items-center px-3 py-1.5 bg-[#dc2626]/20 hover:bg-[#dc2626]/35 text-rose-300 border-r border-[#1f293d] transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-rose-400">SELL</span>
            <span className="font-bold tabular-nums">
              ${(asset.price * 0.9998) < 10 ? (asset.price * 0.9998).toFixed(4) : (asset.price * 0.9998).toFixed(2)}
            </span>
          </button>

          {/* Quick Quantity Input & Spread */}
          <div className="flex flex-col items-center px-2.5 py-1 bg-[#080b12] text-slate-300">
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                value={quickQty}
                onChange={(e) => setQuickQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 bg-[#141d2d] border border-[#1f293d] rounded px-1.5 py-0.5 text-center text-xs text-white outline-none font-bold"
              />
            </div>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5">Spread 0.04</span>
          </div>

          {/* Buy Market Button */}
          <button
            onClick={() => onQuickTrade?.('buy', quickQty)}
            title="Execute Buy Order at Ask"
            className="flex flex-col items-center px-3 py-1.5 bg-[#2563eb]/20 hover:bg-[#2563eb]/35 text-blue-300 border-l border-[#1f293d] transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-blue-400">BUY</span>
            <span className="font-bold tabular-nums">
              ${(asset.price * 1.0002) < 10 ? (asset.price * 1.0002).toFixed(4) : (asset.price * 1.0002).toFixed(2)}
            </span>
          </button>
        </div>

        {/* Bar Replay Badge */}
        {isReplayMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#f59e0b]/20 border border-[#f59e0b]/50 px-3.5 py-1 rounded-full text-amber-300 font-mono text-xs backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold">BAR REPLAY ACTIVE</span>
            <span className="text-[11px] text-amber-200/80">(Bar #{replayIndex ?? 35} of {asset.candles.length})</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="w-full h-full block cursor-crosshair"
        />
      </div>

      {/* Sub-Oscillators Toolbar */}
      <div className="h-6 px-3 bg-[#0d121e] border-t border-b border-[#1f293d] flex items-center justify-between text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 uppercase">Sub-Oscillator:</span>
          {(['rsi', 'macd', 'volume', 'atr'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubIndicator(sub)}
              className={`px-1.5 py-0.2 rounded uppercase transition-colors ${
                activeSubIndicator === sub ? 'bg-[#182236] text-[#00d2ff] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Oscillator Canvas */}
      <div className="h-24 bg-[#0a0d14] shrink-0 border-b border-[#1f293d]">
        <canvas ref={subCanvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
