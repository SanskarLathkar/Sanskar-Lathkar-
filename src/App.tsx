/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Asset, 
  Broker, 
  ChartType, 
  Position, 
  PriceAlert, 
  TechnicalIndicatorConfig, 
  Timeframe, 
  UserAccount, 
  WorldMarketIndex 
} from './types/trading';
import { ChartDrawing, DrawingToolType } from './types/drawings';
import { 
  INITIAL_ASSETS, 
  INITIAL_BROKERS, 
  INITIAL_POSITIONS, 
  WORLD_MARKET_INDICES 
} from './data/mockMarkets';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { TradingChart } from './components/TradingChart';
import { OrderTicket } from './components/OrderTicket';
import { WorldMarketMap } from './components/WorldMarketMap';
import { WorldMonitorView } from './components/WorldMonitorView';
import { PortfolioView } from './components/PortfolioView';
import { SectorPerformanceTreemap } from './components/SectorPerformanceTreemap';
import { BrokersView } from './components/BrokersView';
import { TaxView } from './components/TaxView';
import { SecurityView } from './components/SecurityView';
import { PublishAndShareHub } from './components/PublishAndShareHub';
import { SubscriptionView } from './components/SubscriptionView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { BrokerConnectModal } from './components/BrokerConnectModal';
import { TaxReportingModal } from './components/TaxReportingModal';
import { SecurityVaultModal } from './components/SecurityVaultModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/AuthModal';
import { AlertsModal } from './components/AlertsModal';
import { BiometricLockScreen } from './components/BiometricLockScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LeftDrawingToolbar } from './components/tradingview/LeftDrawingToolbar';
import { TopChartHeader } from './components/tradingview/TopChartHeader';
import { RightWidgetBar, RightWidgetType } from './components/tradingview/RightWidgetBar';
import { BottomTradingDock } from './components/tradingview/BottomTradingDock';
import { IndicatorsModal } from './components/tradingview/IndicatorsModal';
import { TradingViewHomepage } from './components/tradingview/TradingViewHomepage';
import { playChime } from './utils/security';
import { Bell, WifiOff, X } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'explore' | 'terminal' | 'sectors' | 'worldmap' | 'worldmonitor' | 'portfolio' | 'brokers' | 'tax' | 'security' | 'publish' | 'subscription'>('explore');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Markets & Active Asset
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('nvda');
  const [secondaryAssetId, setSecondaryAssetId] = useState<string>('btc');
  const [timeframe, setTimeframe] = useState<Timeframe>('5m');
  const [chartType, setChartType] = useState<ChartType>('candles');

  // TradingView Drawing Tools
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingToolType>('crosshair');
  const [drawings, setDrawings] = useState<ChartDrawing[]>([
    {
      id: 'd-initial-1',
      type: 'horizontal',
      points: [{ index: 40, price: 135.00 }],
      color: '#00d2ff'
    }
  ]);
  const [isMagnetActive, setIsMagnetActive] = useState(false);
  const [isDrawingsLocked, setIsDrawingsLocked] = useState(false);
  const [isDrawingsHidden, setIsDrawingsHidden] = useState(false);

  // TradingView Widgets & Header
  const [activeRightWidget, setActiveRightWidget] = useState<RightWidgetType | null>('watchlist');
  const [compareSymbol, setCompareSymbol] = useState<string | null>(null);
  const [chartLayout, setChartLayout] = useState<'single' | 'split-v' | 'split-h' | 'quad'>('single');
  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Bar Replay Simulator State
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [isReplayPlaying, setIsReplayPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState<number>(35);

  // Indicators State
  const [indicators, setIndicators] = useState<TechnicalIndicatorConfig>({
    showEMA20: true,
    showEMA50: false,
    showEMA200: false,
    showBollinger: true,
    showRSI: true,
    showMACD: false,
    showVolume: true,
    showATR: false,
    showSuperTrend: false,
  });

  // User & Portfolio State
  const [user, setUser] = useState<UserAccount>({
    id: 'usr_88291f0',
    email: 'trader@realtrade.view',
    name: 'Alex Morgan',
    tier: 'pro',
    biometricRegistered: true,
    encryptedVaultActive: true,
    isOfflineMode: false,
    cashBalance: 42850.00,
    createdAt: Date.now() - 90 * 24 * 3600 * 1000,
    lastSyncTimestamp: Date.now(),
  });

  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [brokers, setBrokers] = useState<Broker[]>(INITIAL_BROKERS);
  const [worldIndices, setWorldIndices] = useState<WorldMarketIndex[]>(WORLD_MARKET_INDICES);
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt-1',
      assetId: 'nvda',
      symbol: 'NVDA',
      targetPrice: 142.00,
      direction: 'above',
      createdAt: Date.now() - 3600000,
      triggered: false,
      note: 'Key breakout level'
    },
    {
      id: 'alt-2',
      assetId: 'btc',
      symbol: 'BTC/USD',
      targetPrice: 69000.00,
      direction: 'above',
      createdAt: Date.now() - 7200000,
      triggered: false,
      note: 'All-time high retest'
    }
  ]);

  // Privacy & Lock Screen
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Active Modals
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertAssetTarget, setAlertAssetTarget] = useState<Asset>(INITIAL_ASSETS[0]);

  // Toast Notifications
  const [bannerAlert, setBannerAlert] = useState<{ title: string; message: string } | null>(null);
  const [offlineSyncToast, setOfflineSyncToast] = useState<string | null>(null);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
  const secondaryAsset = assets.find(a => a.id === secondaryAssetId) || assets[1];
  const compareAsset = compareSymbol ? assets.find(a => a.symbol.includes(compareSymbol)) : undefined;

  // Ref to track latest alerts and positions for interval loop
  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  // Bar Replay Simulator ticker
  useEffect(() => {
    if (!isReplayMode || !isReplayPlaying) return;

    const replayInterval = setInterval(() => {
      setReplayIndex(prev => {
        if (prev >= selectedAsset.candles.length) {
          setIsReplayPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(replayInterval);
  }, [isReplayMode, isReplayPlaying, selectedAsset.candles.length]);

  // Deep linking URL query parameters handler (e.g. ?ticker=BTCUSD&tab=terminal)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const ticker = searchParams.get('ticker');
      const tab = searchParams.get('tab');

      if (ticker) {
        const found = assets.find(
          a => a.symbol.toUpperCase() === ticker.toUpperCase() || 
               a.id.toLowerCase() === ticker.toLowerCase() ||
               a.symbol.replace('/', '').toUpperCase() === ticker.replace('/', '').toUpperCase()
        );
        if (found) {
          setSelectedAssetId(found.id);
        }
      }

      if (tab) {
        if (['subscription', 'pricing', 'plans'].includes(tab.toLowerCase())) {
          setActiveTab('subscription');
        } else if (['explore', 'terminal', 'sectors', 'worldmap', 'worldmonitor', 'portfolio', 'brokers', 'tax', 'security', 'publish'].includes(tab)) {
          setActiveTab(tab as any);
        }
      }
    } catch (e) {
      // safe fallback in SSR/test
    }
  }, []);

  // Real-time market tick engine
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setAssets(prevAssets => {
        return prevAssets.map(asset => {
          if (Math.random() > 0.45) return asset;

          const volatility = asset.category === 'crypto' ? 0.0025 : asset.category === 'forex' ? 0.0004 : 0.0012;
          const tickDelta = (Math.random() - 0.49) * 2 * (asset.price * volatility);
          const newPrice = Number(Math.max(asset.price + tickDelta, 0.001).toFixed(asset.price < 10 ? 4 : 2));
          const newChange = Number((asset.change24h + (tickDelta / asset.price) * 10).toFixed(2));
          const newHigh = Math.max(asset.high24h, newPrice);
          const newLow = Math.min(asset.low24h, newPrice);

          const updatedCandles = [...asset.candles];
          const lastCandle = updatedCandles[updatedCandles.length - 1];
          if (lastCandle) {
            const updatedLast = {
              ...lastCandle,
              close: newPrice,
              high: Math.max(lastCandle.high, newPrice),
              low: Math.min(lastCandle.low, newPrice),
              volume: lastCandle.volume + Math.floor(Math.random() * 200)
            };
            updatedCandles[updatedCandles.length - 1] = updatedLast;
          }

          alertsRef.current.forEach(alert => {
            if (!alert.triggered && alert.assetId === asset.id) {
              const triggeredAbove = alert.direction === 'above' && newPrice >= alert.targetPrice;
              const triggeredBelow = alert.direction === 'below' && newPrice <= alert.targetPrice;
              if (triggeredAbove || triggeredBelow) {
                setAlerts(curAlerts => curAlerts.map(a => a.id === alert.id ? { ...a, triggered: true, triggeredAt: Date.now() } : a));
                playChime('alert');
                setBannerAlert({
                  title: `PRICE ALERT TRIGGERED: ${asset.symbol}`,
                  message: `${asset.symbol} reached $${newPrice} (${alert.direction === 'above' ? '≥' : '≤'} $${alert.targetPrice}). ${alert.note || ''}`
                });
                setTimeout(() => setBannerAlert(null), 5000);
              }
            }
          });

          return {
            ...asset,
            price: newPrice,
            change24h: newChange,
            high24h: newHigh,
            low24h: newLow,
            candles: updatedCandles
          };
        });
      });

      // Update positions live P&L
      setPositions(prevPositions => {
        return prevPositions.map(pos => {
          if (pos.status !== 'open') return pos;
          const currentAsset = assets.find(a => a.id === pos.assetId);
          if (!currentAsset) return pos;

          const curPrice = currentAsset.price;
          const deltaPerUnit = pos.side === 'buy' ? (curPrice - pos.entryPrice) : (pos.entryPrice - curPrice);
          const unrealizedPnl = deltaPerUnit * pos.amount;
          const unrealizedPnlPercent = pos.totalCost > 0 ? (unrealizedPnl / pos.totalCost) * 100 : 0;

          return {
            ...pos,
            currentPrice: curPrice,
            unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
            unrealizedPnlPercent: Number(unrealizedPnlPercent.toFixed(2))
          };
        });
      });
    }, 1800);

    return () => clearInterval(tickInterval);
  }, [assets]);

  // Handle Trade Execution
  const handleExecuteTrade = (newTradeData: Omit<Position, 'id' | 'timestamp' | 'unrealizedPnl' | 'unrealizedPnlPercent' | 'status' | 'holdingPeriod' | 'taxYear'>) => {
    const newPosition: Position = {
      ...newTradeData,
      id: `pos-${Date.now()}`,
      timestamp: Date.now(),
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      status: 'open',
      holdingPeriod: 'short_term',
      taxYear: 2026,
    };

    setPositions(prev => [newPosition, ...prev]);

    if (newTradeData.side === 'buy') {
      setUser(prev => ({
        ...prev,
        cashBalance: Math.max(0, prev.cashBalance - newTradeData.totalCost - newTradeData.fees)
      }));
    } else {
      setUser(prev => ({
        ...prev,
        cashBalance: prev.cashBalance + newTradeData.totalCost - newTradeData.fees
      }));
    }

    if (user.isOfflineMode) {
      setOfflineSyncToast(`Trade logged locally in encrypted offline queue (${newPosition.symbol}).`);
      setTimeout(() => setOfflineSyncToast(null), 3000);
    }
  };

  // Quick execution from TradingChart floating BUY/SELL bar
  const handleQuickTrade = (side: 'buy' | 'sell', amount: number) => {
    const asset = selectedAsset;
    const executionPrice = side === 'buy' ? asset.price * 1.0002 : asset.price * 0.9998;
    const totalCost = amount * executionPrice;
    const fees = Math.max(1, totalCost * 0.0005);

    handleExecuteTrade({
      assetId: asset.id,
      symbol: asset.symbol,
      side,
      orderType: 'market',
      entryPrice: executionPrice,
      currentPrice: executionPrice,
      amount,
      totalCost,
      fees,
      broker: brokers.find(b => b.status === 'connected')?.name || 'Alpaca Markets',
    });
    playChime('trade');
    setBannerAlert({
      title: `Order Executed: ${side.toUpperCase()} ${amount} ${asset.symbol}`,
      message: `Filled at $${executionPrice.toFixed(2)} via Smart Broker Router.`
    });
    setTimeout(() => setBannerAlert(null), 4000);
  };

  // Close Open Position
  const handleClosePosition = (positionId: string) => {
    setPositions(prev => prev.map(pos => {
      if (pos.id === positionId) {
        const exitPrice = pos.currentPrice;
        const delta = pos.side === 'buy' ? (exitPrice - pos.entryPrice) : (pos.entryPrice - exitPrice);
        const realizedPnl = delta * pos.amount - pos.fees;

        setUser(u => ({
          ...u,
          cashBalance: u.cashBalance + (pos.currentPrice * pos.amount)
        }));

        return {
          ...pos,
          status: 'closed',
          exitPrice,
          exitTimestamp: Date.now(),
          realizedPnl: Number(realizedPnl.toFixed(2)),
          unrealizedPnl: 0,
          unrealizedPnlPercent: 0
        };
      }
      return pos;
    }));
  };

  // Toggle Offline Mode
  const toggleOfflineMode = () => {
    setUser(prev => {
      const nextOffline = !prev.isOfflineMode;
      if (!nextOffline) {
        setOfflineSyncToast('Cross-platform sync restored. Local encrypted queue reconciled with cloud.');
        playChime('success');
        setTimeout(() => setOfflineSyncToast(null), 3500);
      } else {
        setOfflineSyncToast('Switched to Offline Mode. All orders stored in local encrypted database.');
        playChime('warn');
        setTimeout(() => setOfflineSyncToast(null), 3500);
      }
      return { ...prev, isOfflineMode: nextOffline };
    });
  };

  // Toggle Broker Connection
  const handleToggleBrokerStatus = (brokerId: string) => {
    setBrokers(prev => prev.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          status: b.status === 'connected' ? 'disconnected' : 'connected'
        };
      }
      return b;
    }));
  };

  // Create Price Alert
  const handleCreateAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      createdAt: Date.now(),
      triggered: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleOpenAlertForAsset = (asset: Asset) => {
    setAlertAssetTarget(asset);
    setIsAlertModalOpen(true);
  };

  // Chart Drawings Handlers
  const handleAddDrawing = (drawing: ChartDrawing) => {
    if (isDrawingsLocked) return;
    setDrawings(prev => [...prev, drawing]);
    playChime('trade');
  };

  const handleClearAllDrawings = () => {
    setDrawings([]);
    playChime('warn');
  };

  // Chart Snapshot download
  const handleChartSnapshot = () => {
    playChime('success');
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `REALTRADE_VIEW_${selectedAsset.symbol}_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className={`min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans pb-16 md:pb-0 ${isFullscreen ? 'fixed inset-0 z-50 overflow-hidden' : ''}`}>
      {/* Biometric Lock Screen */}
      {isLocked && (
        <BiometricLockScreen
          userName={user.name}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        user={user}
        privacyMode={privacyMode}
        setPrivacyMode={setPrivacyMode}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        toggleOfflineMode={toggleOfflineMode}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
      />

      {/* Ticker Tape */}
      <TickerTape
        assets={assets}
        onSelectAsset={(asset) => {
          setSelectedAssetId(asset.id);
          setActiveTab('terminal');
        }}
        selectedAssetId={selectedAssetId}
      />

      {/* Live Alert Toast Banner */}
      {bannerAlert && (
        <div className="bg-[#00d2ff]/10 border-b border-[#00d2ff]/40 px-4 py-2 flex items-center justify-between text-xs font-mono animate-fadeIn">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00d2ff] animate-bounce" />
            <strong className="text-white">{bannerAlert.title}:</strong>
            <span className="text-[#00d2ff]">{bannerAlert.message}</span>
          </div>
          <button onClick={() => setBannerAlert(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Offline sync feedback notification */}
      {offlineSyncToast && (
        <div className="bg-amber-950/40 border-b border-amber-600/40 px-4 py-2 flex items-center justify-between text-xs font-mono text-amber-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>{offlineSyncToast}</span>
          </div>
          <button onClick={() => setOfflineSyncToast(null)} className="text-amber-400/80 hover:text-amber-200">✕</button>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'explore' && (
          <div className="flex-1 overflow-y-auto">
            <TradingViewHomepage
              assets={assets}
              onOpenSupercharts={(assetId) => {
                if (assetId) setSelectedAssetId(assetId);
                setActiveTab('terminal');
              }}
              onOpenSectors={() => setActiveTab('sectors')}
              onOpenWorldMap={() => setActiveTab('worldmap')}
              onOpenWorldMonitor={() => setActiveTab('worldmonitor')}
              onOpenSubscription={() => setIsSubscriptionOpen(true)}
              onOpenBrokers={() => setIsBrokerModalOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenPublish={() => setIsPublishModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* TradingView Top Chart Controls Header */}
            <TopChartHeader
              asset={selectedAsset}
              assets={assets}
              onSelectAsset={(a) => setSelectedAssetId(a.id)}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              chartType={chartType}
              setChartType={setChartType}
              onOpenIndicators={() => setIsIndicatorsModalOpen(true)}
              compareSymbol={compareSymbol}
              setCompareSymbol={setCompareSymbol}
              isReplayMode={isReplayMode}
              setIsReplayMode={setIsReplayMode}
              isReplayPlaying={isReplayPlaying}
              setIsReplayPlaying={setIsReplayPlaying}
              onStepReplay={() => setReplayIndex(prev => prev + 1)}
              chartLayout={chartLayout}
              setChartLayout={setChartLayout}
              onSnapshot={handleChartSnapshot}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />

            {/* Trading Station Stage: Left Toolbar + Chart Area + Right Widget Drawer */}
            <div className="flex-1 flex overflow-hidden min-h-[460px]">
              {/* Left Drawing Tools Toolbar */}
              <LeftDrawingToolbar
                activeTool={activeDrawingTool}
                setActiveTool={setActiveDrawingTool}
                isMagnetActive={isMagnetActive}
                setIsMagnetActive={setIsMagnetActive}
                isDrawingsLocked={isDrawingsLocked}
                setIsDrawingsLocked={setIsDrawingsLocked}
                isDrawingsHidden={isDrawingsHidden}
                setIsDrawingsHidden={setIsDrawingsHidden}
                onClearAllDrawings={handleClearAllDrawings}
              />

              {/* Chart Main Viewport */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0d14]">
                {chartLayout === 'single' ? (
                  <TradingChart
                    asset={selectedAsset}
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                    indicators={indicators}
                    setIndicators={setIndicators}
                    onOpenAlertModal={handleOpenAlertForAsset}
                    activeTool={activeDrawingTool}
                    drawings={drawings}
                    onAddDrawing={handleAddDrawing}
                    isDrawingsLocked={isDrawingsLocked}
                    isDrawingsHidden={isDrawingsHidden}
                    compareSymbol={compareSymbol}
                    compareAsset={compareAsset}
                    isReplayMode={isReplayMode}
                    replayIndex={replayIndex}
                    chartType={chartType}
                    onQuickTrade={handleQuickTrade}
                  />
                ) : chartLayout === 'split-v' ? (
                  <div className="flex-1 grid grid-cols-2 divide-x divide-[#1f293d] h-full">
                    <TradingChart
                      asset={selectedAsset}
                      timeframe={timeframe}
                      setTimeframe={setTimeframe}
                      indicators={indicators}
                      setIndicators={setIndicators}
                      onOpenAlertModal={handleOpenAlertForAsset}
                      activeTool={activeDrawingTool}
                      drawings={drawings}
                      onAddDrawing={handleAddDrawing}
                      chartType={chartType}
                      onQuickTrade={handleQuickTrade}
                    />
                    <TradingChart
                      asset={secondaryAsset}
                      timeframe={timeframe}
                      setTimeframe={setTimeframe}
                      indicators={indicators}
                      setIndicators={setIndicators}
                      onOpenAlertModal={handleOpenAlertForAsset}
                      chartType={chartType}
                      onQuickTrade={handleQuickTrade}
                    />
                  </div>
                ) : chartLayout === 'split-h' ? (
                  <div className="flex-1 grid grid-rows-2 divide-y divide-[#1f293d] h-full">
                    <TradingChart
                      asset={selectedAsset}
                      timeframe={timeframe}
                      setTimeframe={setTimeframe}
                      indicators={indicators}
                      setIndicators={setIndicators}
                      onOpenAlertModal={handleOpenAlertForAsset}
                      activeTool={activeDrawingTool}
                      drawings={drawings}
                      onAddDrawing={handleAddDrawing}
                      chartType={chartType}
                      onQuickTrade={handleQuickTrade}
                    />
                    <TradingChart
                      asset={secondaryAsset}
                      timeframe={timeframe}
                      setTimeframe={setTimeframe}
                      indicators={indicators}
                      setIndicators={setIndicators}
                      onOpenAlertModal={handleOpenAlertForAsset}
                      chartType={chartType}
                      onQuickTrade={handleQuickTrade}
                    />
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-2 grid-rows-2 divide-x divide-y divide-[#1f293d] h-full">
                    <TradingChart asset={assets[0]} timeframe={timeframe} setTimeframe={setTimeframe} indicators={indicators} setIndicators={setIndicators} onOpenAlertModal={handleOpenAlertForAsset} chartType={chartType} onQuickTrade={handleQuickTrade} />
                    <TradingChart asset={assets[1]} timeframe={timeframe} setTimeframe={setTimeframe} indicators={indicators} setIndicators={setIndicators} onOpenAlertModal={handleOpenAlertForAsset} chartType={chartType} onQuickTrade={handleQuickTrade} />
                    <TradingChart asset={assets[2]} timeframe={timeframe} setTimeframe={setTimeframe} indicators={indicators} setIndicators={setIndicators} onOpenAlertModal={handleOpenAlertForAsset} chartType={chartType} onQuickTrade={handleQuickTrade} />
                    <TradingChart asset={assets[3]} timeframe={timeframe} setTimeframe={setTimeframe} indicators={indicators} setIndicators={setIndicators} onOpenAlertModal={handleOpenAlertForAsset} chartType={chartType} onQuickTrade={handleQuickTrade} />
                  </div>
                )}
              </div>

              {/* Right Widget Bar (Watchlist / Order Ticket / Alerts / Technicals / News / Data Window / Hotlists / Calendar / Ideas / Order Book) */}
              <RightWidgetBar
                activeWidget={activeRightWidget}
                setActiveWidget={setActiveRightWidget}
                assets={assets}
                selectedAsset={selectedAsset}
                onSelectAsset={(a) => setSelectedAssetId(a.id)}
                alerts={alerts}
                onOpenAlertModal={handleOpenAlertForAsset}
                positions={positions}
                brokers={brokers}
                onExecuteTrade={handleExecuteTrade}
                cashBalance={user.cashBalance}
              />
            </div>

            {/* TradingView Bottom Dock (Pine Editor, Strategy Tester, Paper Trading, Time Ranges) */}
            <BottomTradingDock
              assets={assets}
              onSelectAsset={(a) => setSelectedAssetId(a.id)}
              positions={positions}
              onClosePosition={handleClosePosition}
              brokers={brokers}
              user={user}
              onApplyPineIndicator={() => {
                setIndicators(prev => ({ ...prev, showSuperTrend: true, showEMA20: true, showEMA50: true }));
              }}
            />
          </div>
        )}

        {/* D3.js Sector Performance Treemap */}
        {activeTab === 'sectors' && (
          <SectorPerformanceTreemap />
        )}

        {/* Live Global World Market Map */}
        {activeTab === 'worldmap' && (
          <WorldMarketMap indices={worldIndices} />
        )}

        {/* World Monitor OSINT Geopolitics & Military Surveillance Platform */}
        {activeTab === 'worldmonitor' && (
          <WorldMonitorView
            onSelectAsset={(asset) => {
              setSelectedAssetId(asset.id);
              setActiveTab('terminal');
            }}
            allAssets={assets}
          />
        )}

        {/* Portfolio & P&L Management */}
        {activeTab === 'portfolio' && (
          <PortfolioView
            positions={positions}
            assets={assets}
            cashBalance={user.cashBalance}
            privacyMode={privacyMode}
            onClosePosition={handleClosePosition}
            onOpenTaxReports={() => setIsTaxModalOpen(true)}
          />
        )}

        {/* Institutional Brokers Connect Hub */}
        {activeTab === 'brokers' && (
          <BrokersView
            brokers={brokers}
            onToggleBrokerStatus={handleToggleBrokerStatus}
            onOpenSupercharts={() => setActiveTab('terminal')}
          />
        )}

        {/* IRS Form 8949 Tax Reporting & Gain Audit Terminal */}
        {activeTab === 'tax' && (
          <TaxView
            positions={positions}
            onOpenSupercharts={() => setActiveTab('terminal')}
          />
        )}

        {/* Security, Encryption & Biometrics Command Center */}
        {activeTab === 'security' && (
          <SecurityView
            user={user}
            setUser={setUser}
            positions={positions}
            alerts={alerts}
            onOpenSupercharts={() => setActiveTab('terminal')}
          />
        )}

        {/* Play Store, App Store & Google Share Distribution Center */}
        {activeTab === 'publish' && (
          <div className="flex-1 overflow-y-auto">
            <PublishAndShareHub
              assets={assets}
              selectedAsset={selectedAsset}
              activeTab={activeTab}
            />
          </div>
        )}

        {/* Full Pro Subscriptions & Multi-Rail Gateway Station */}
        {activeTab === 'subscription' && (
          <SubscriptionView
            user={user}
            setUser={setUser}
            onOpenSupercharts={() => setActiveTab('terminal')}
          />
        )}
      </main>

      {/* Offline Status PWA Indicator */}
      <OfflineIndicator />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'brokers') setIsBrokerModalOpen(true);
          else if (tab === 'tax') setIsTaxModalOpen(true);
          else if (tab === 'security') setIsSecurityModalOpen(true);
          else setActiveTab(tab);
        }}
      />

      {/* Modals */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        user={user}
        setUser={setUser}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        setUser={setUser}
      />

      <BrokerConnectModal
        isOpen={isBrokerModalOpen}
        onClose={() => setIsBrokerModalOpen(false)}
        brokers={brokers}
        onToggleBrokerStatus={handleToggleBrokerStatus}
      />

      <TaxReportingModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        positions={positions}
      />

      <SecurityVaultModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        user={user}
        setUser={setUser}
        positions={positions}
        alerts={alerts}
      />

      <AlertsModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        asset={alertAssetTarget}
        alerts={alerts}
        onCreateAlert={handleCreateAlert}
        onDeleteAlert={handleDeleteAlert}
      />

      <IndicatorsModal
        isOpen={isIndicatorsModalOpen}
        onClose={() => setIsIndicatorsModalOpen(false)}
        indicators={indicators}
        setIndicators={setIndicators}
      />

      {/* Publish & App Stores Modal Dialog */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-[#0a0d14] rounded-2xl border border-slate-800 shadow-2xl">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Close Store Hub"
            >
              <X className="w-5 h-5" />
            </button>
            <PublishAndShareHub
              assets={assets}
              selectedAsset={selectedAsset}
              activeTab={activeTab}
              onClose={() => setIsPublishModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
