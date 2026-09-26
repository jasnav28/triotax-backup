import React, { useRef, useEffect, useState } from "react";
import { Eye, EyeOff, Maximize2, Minimize2, Play, Pause, RotateCcw, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

// Custom Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`flex h-11 w-full rounded-xl border bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white border-gray-200 dark:border-zinc-700 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
      {...props}
    />
  );
};

// Canvas-Based Ultra-Smooth Frame Animation Player
const FrameAnimationPlayer = ({ isDarkMode }: { isDarkMode?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalFrames = 300;
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(performance.now());
  const fps = 30;
  const frameInterval = 1000 / fps;

  // Preload frames asynchronously into memory
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const paddedNum = String(i).padStart(5, "0");
      const img = new Image();
      img.src = `/frames/frame_${paddedNum}.webp`;

      const handleLoad = () => {
        if (isCancelled) return;
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / totalFrames) * 100));
        if (loadedCount >= Math.min(30, totalFrames)) {
          setIsLoaded(true);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad;
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, []);

  // Canvas GPU-Accelerated Un-cropped Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (now: number) => {
      if (isPlaying) {
        const elapsed = now - lastFrameTimeRef.current;
        if (elapsed >= frameInterval) {
          currentFrameRef.current = (currentFrameRef.current % totalFrames) + 1;
          lastFrameTimeRef.current = now - (elapsed % frameInterval);
        }
      }

      const currentImg = imagesRef.current[currentFrameRef.current - 1];
      const width = canvas.width;
      const height = canvas.height;

      // Seamless background fill matching frame color
      ctx.fillStyle = isDarkMode ? "#090d16" : "#f4f6f8";
      ctx.fillRect(0, 0, width, height);

      if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        // Use Math.min so the full 1280x720 video frame & logo are 100% visible without any cropping on left or right
        const imgW = currentImg.naturalWidth;
        const imgH = currentImg.naturalHeight;
        const scale = Math.min(width / imgW, height / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const x = (width - drawW) / 2;
        const y = (height - drawH) / 2;

        ctx.drawImage(currentImg, x, y, drawW, drawH);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isDarkMode, frameInterval]);

  // Handle ResizeObserver for HD Canvas Resolution
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const restartVideo = () => {
    currentFrameRef.current = 1;
    lastFrameTimeRef.current = performance.now();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Control Capsule [ ⛶ ⏯ ↺ ] */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-white">
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <div className="w-[1px] h-4 bg-white/20 my-auto" />

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause Animation" : "Play Animation"}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          type="button"
          onClick={restartVideo}
          title="Restart Animation"
          className="p-1 hover:bg-white/20 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Preloading Indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white z-10">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-300 font-medium">Loading smooth video frames... {loadingProgress}%</p>
        </div>
      )}
    </div>
  );
};

export const SignInCard = ({
  onLogin,
}: {
  onLogin?: (username: string, password: string) => void;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDark, setIsDark] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsLoading(true);
    setErrorMsg("");
    try {
      const getCleanApiUrl = (endpoint: string) => {
        let base = (import.meta as any).env?.VITE_API_URL || "https://triotax-backend-production.up.railway.app";
        base = base.trim().replace(/\/+$/, "");
        if (base.endsWith("/api")) {
          base = base.substring(0, base.length - 4);
        }
        const cleanEndpoint = endpoint.replace(/^\/+/, "");
        const finalEndpoint = cleanEndpoint.startsWith("api/") ? cleanEndpoint : `api/${cleanEndpoint}`;
        return `${base}/${finalEndpoint}`;
      };
      const resp = await fetch(getCleanApiUrl("login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (resp.ok) {
        if (onLogin) onLogin(username, password);
        return;
      } else {
        const data = await resp.json();
        setErrorMsg(data.message || "Invalid username or password");
        return;
      }
    } catch {
      // Offline local fallback check for admin-created profiles
      try {
        const localData = localStorage.getItem("triotax_stored_users");
        const localUsers = localData ? JSON.parse(localData) : [];
        const found = localUsers.find(
          (u: any) => u.username === username.toLowerCase().replace(/\s+/g, "") && u.password === password
        );
        if (found) {
          if (onLogin) onLogin(username, password);
          return;
        }
      } catch {}
      setErrorMsg("Network connection poor. Saved locally — try again or check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full h-[calc(100vh-72px)] min-h-[550px] overflow-hidden flex flex-col md:flex-row bg-white dark:bg-zinc-950 ${isDark ? "dark" : ""}`}>
      {/* Top-Right Theme Toggle */}
      <div className="absolute top-4 right-6 z-30">
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Left 50% Video Frame Panel */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-[#f4f6f8] dark:bg-slate-950">
        <FrameAnimationPlayer isDarkMode={isDark} />
      </div>

      {/* Right 50% Sign In Form Panel */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center bg-white dark:bg-zinc-900 overflow-y-auto relative">
        <div className="max-w-sm w-full mx-auto">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8">
            Sign in to your authorized profile
          </p>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Username / Email Address
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                />
                <span className="text-xs text-gray-600 dark:text-zinc-400">Remember me</span>
              </label>

              <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md text-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Index = ({ onLogin }: { onLogin?: (username: string, password: string) => void }) => {
  return <SignInCard onLogin={onLogin} />;
};

export default Index;
