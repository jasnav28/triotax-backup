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

  // Canvas GPU-Accelerated Smooth Animation Loop
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

      // Draw background
      ctx.fillStyle = isDarkMode ? "#090d16" : "#f4f6f9";
      ctx.fillRect(0, 0, width, height);

      if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        // Calculate aspect-contain scale so the frame & TRIOTAX logo fit 100% cleanly without cropping
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

      {/* Floating Control Bar matching Image 2 top-left capsule buttons [ ⛶ ☀/⏯ ↺ ] */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-xl shadow-lg text-white">
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <div className="w-[1px] h-4 bg-white/20 my-auto" />

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause Animation" : "Play Animation"}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          type="button"
          onClick={restartVideo}
          title="Restart Animation"
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-gray-200 hover:text-white"
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

// Social Google & Github Icons
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current text-gray-800 dark:text-white" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

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
      // Offline local fallback check
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
    <div className={`flex w-full min-h-screen items-center justify-center p-4 md:p-8 bg-gray-900/60 backdrop-blur-sm ${isDark ? "dark" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[1020px] h-[640px] rounded-3xl overflow-hidden flex bg-white dark:bg-zinc-900 shadow-2xl border border-gray-100 dark:border-zinc-800 relative"
      >
        {/* Top-Right Theme Toggle matching Image 2 top right toggle icon */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Left Half: Smooth Frame Video Player */}
        <div className="hidden md:block w-1/2 h-full relative border-r border-gray-100 dark:border-zinc-800 bg-slate-950">
          <FrameAnimationPlayer isDarkMode={isDark} />
        </div>

        {/* Right Half: Sign In Form matching Image 2 */}
        <div className="w-full md:w-1/2 h-full p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-zinc-900 overflow-y-auto">
          <div className="max-w-sm w-full mx-auto">
            {/* Header */}
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold hover:underline">
                Sign up
              </a>
            </p>

            {errorMsg && (
              <div className="mb-5 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username */}
              <div>
                <label htmlFor="username" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email Address"
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
                    placeholder="Password"
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
              <div className="flex items-center justify-between pt-1 pb-1">
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

              {/* Or Divider */}
              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-3 text-xs text-gray-400 dark:text-zinc-500 font-medium">or</span>
                <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
              </div>

              {/* Social Login Buttons Side by Side matching Image 2 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-750 transition-all duration-200 shadow-sm text-xs font-semibold text-gray-700 dark:text-zinc-200 cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-750 transition-all duration-200 shadow-sm text-xs font-semibold text-gray-700 dark:text-zinc-200 cursor-pointer"
                >
                  <GithubIcon />
                  <span>Continue with GitHub</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Index = ({ onLogin }: { onLogin?: (username: string, password: string) => void }) => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage: 'url("/loginb.webp")',
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="z-10 w-full flex items-center justify-center relative">
        <SignInCard onLogin={onLogin} />
      </div>
    </div>
  );
};

export default Index;
