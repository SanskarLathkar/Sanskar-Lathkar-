import React, { useEffect, useState } from 'react';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-950/90 to-amber-900/90 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-amber-200 border border-amber-700/60 shadow-2xl animate-bounce">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Offline Mode — Cached local data & encrypted queue active.</span>
      <Database className="w-3.5 h-3.5 text-amber-300 ml-1" />
    </div>
  );
};
