import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";

export const NetworkIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Measure network ping periodically
    const checkSpeed = async () => {
      if (!navigator.onLine) return;
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        await fetch("https://triotax-backend-production.up.railway.app/api/health", {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeoutId);
        const duration = performance.now() - start;
        setIsSlow(duration > 2500);
      } catch {
        setIsSlow(true);
      }
    };

    const interval = setInterval(checkSpeed, 15000);
    checkSpeed();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline ? (
        <div className="flex items-center gap-3 bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-red-500 animate-pulse">
          <WifiOff size={16} />
          <span>Offline Mode Active &bull; Local Sync Enabled</span>
          <button onClick={() => setDismissed(true)} className="ml-2 text-white/80 hover:text-white font-bold">&times;</button>
        </div>
      ) : isSlow ? (
        <div className="flex items-center gap-3 bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-amber-400">
          <AlertTriangle size={16} />
          <span>Slow Network &bull; Running with Offline Fallback</span>
          <button onClick={() => setDismissed(true)} className="ml-2 text-white/80 hover:text-white font-bold">&times;</button>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-slate-900/90 dark:bg-zinc-800/90 text-emerald-400 text-xs font-medium px-3.5 py-2 rounded-xl shadow-md backdrop-blur border border-slate-700 dark:border-zinc-700">
          <Wifi size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-slate-200 dark:text-slate-300">Network Connected</span>
        </div>
      )}
    </div>
  );
};
