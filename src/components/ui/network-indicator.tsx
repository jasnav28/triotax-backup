import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";

export const NetworkIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isServerDown, setIsServerDown] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setIsServerDown(false);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodically verify server connectivity without misinterpreting API response time as bad client internet
    const checkServerHealth = async () => {
      if (!navigator.onLine) return;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch("https://triotax-backend-production.up.railway.app/api/health", {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          setIsServerDown(false);
        } else {
          setIsServerDown(true);
        }
      } catch (err) {
        // If fetch fails while browser IS online, server is unavailable (NOT poor client internet)
        if (navigator.onLine) {
          setIsServerDown(true);
        }
      }
    };

    const interval = setInterval(checkServerHealth, 30000);
    checkServerHealth();

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
          <span>No Internet Connection &bull; Local Mode Active</span>
          <button onClick={() => setDismissed(true)} className="ml-2 text-white/80 hover:text-white font-bold">&times;</button>
        </div>
      ) : isServerDown ? (
        <div className="flex items-center gap-3 bg-amber-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-amber-500">
          <AlertTriangle size={16} />
          <span>Server Unavailable &bull; Retrying Connection</span>
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

export default NetworkIndicator;
