import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone, ExternalLink, Sparkles } from "lucide-react";

export interface AdItem {
  id: string | number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
}

export const DEFAULT_ADS: AdItem[] = [
  {
    id: "1",
    title: "Special Offer: Get 30% Off On Annual GST & Income Tax Filing Services!",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    linkUrl: "#"
  },
  {
    id: "2",
    title: "Upgrade to TrioTax Premium Compliance Suite - 24/7 Dedicated Accountant",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    linkUrl: "#"
  },
  {
    id: "3",
    title: "Fast-Track Trademark & Company Registration - Protect Your Brand Today",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    linkUrl: "#"
  }
];

export const getAdsConfig = () => {
  try {
    const data = localStorage.getItem("triotax_ads_config");
    if (data) return JSON.parse(data);
  } catch {}
  return { isAdsEnabled: true, adList: DEFAULT_ADS };
};

export const ScrollingAdBanner: React.FC = () => {
  const [adsConfig, setAdsConfig] = useState(getAdsConfig());
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setAdsConfig(getAdsConfig());
    };
    window.addEventListener("triotax_ads_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("triotax_ads_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const { isAdsEnabled, adList } = adsConfig;
  const activeAds = adList && adList.length > 0 ? adList : DEFAULT_ADS;

  useEffect(() => {
    if (!isAdsEnabled || activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeAds.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAdsEnabled, activeAds.length]);

  if (!isAdsEnabled) return null;

  const rawAd = activeAds[currentIdx % activeAds.length];
  // Sanitize any emojis for a clean classic design
  const cleanTitle = (rawAd?.title || "").replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();

  return (
    <div className="w-full my-6 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-zinc-800 bg-slate-900 text-white relative group">
      {/* Banner Image with overlay gradient */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden">
        <img
          key={rawAd.id}
          src={rawAd.imageUrl}
          alt={cleanTitle}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-all duration-700 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent flex flex-col justify-center px-6 sm:px-10">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-3 shadow-sm backdrop-blur-sm">
            <Sparkles size={12} /> Sponsored Announcement
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-white max-w-2xl leading-tight drop-shadow-md">
            {cleanTitle}
          </h3>

          <div className="mt-4 flex items-center gap-4">
            {rawAd.linkUrl && (
              <a
                href={rawAd.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Learn More <ExternalLink size={13} />
              </a>
            )}
            
            {/* Carousel indicator dots */}
            <div className="flex gap-1.5 ml-auto">
              {activeAds.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIdx ? "w-6 bg-blue-500" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ticker at the bottom */}
      <div className="bg-blue-600 text-white text-xs font-semibold py-2 px-4 flex items-center gap-3 overflow-hidden">
        <Megaphone size={14} className="flex-shrink-0" />
        <div className="overflow-hidden whitespace-nowrap w-full">
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="inline-block"
          >
            FEATURED ANNOUNCEMENT: {cleanTitle} &bull; Contact Admin to feature your business here!
          </motion.div>
        </div>
      </div>
    </div>
  );
};
