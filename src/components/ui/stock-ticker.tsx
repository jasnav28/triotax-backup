import React from "react";
import { motion } from "framer-motion";

const STOCKS = [
  { symbol: "RELIANCE", price: "3050.25", change: "+12.40", percent: "+0.41%", isUp: true },
  { symbol: "TCS", price: "4120.00", change: "-15.50", percent: "-0.37%", isUp: false },
  { symbol: "HDFCBANK", price: "1645.10", change: "+5.20", percent: "+0.32%", isUp: true },
  { symbol: "INFY", price: "1580.75", change: "+8.90", percent: "+0.57%", isUp: true },
  { symbol: "ICICIBANK", price: "1150.30", change: "-2.10", percent: "-0.18%", isUp: false },
  { symbol: "SBIN", price: "790.60", change: "+1.20", percent: "+0.15%", isUp: true },
  { symbol: "BHARTIARTL", price: "1280.90", change: "+18.30", percent: "+1.45%", isUp: true },
  { symbol: "ITC", price: "435.50", change: "-0.80", percent: "-0.18%", isUp: false },
];

export const StockTicker = () => {
  return (
    <div className="w-full bg-zinc-900 text-white overflow-hidden py-2 border-b border-zinc-800 rounded-t-xl">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex gap-8 px-4 items-center"
        >
          {/* Double the array for seamless infinite scrolling */}
          {[...STOCKS, ...STOCKS].map((stock, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-sm">
              <span className="font-bold text-gray-300">{stock.symbol}</span>
              <span>₹{stock.price}</span>
              <span className={`flex items-center ${stock.isUp ? "text-green-500" : "text-red-500"}`}>
                {stock.isUp ? "▲" : "▼"}
                <span className="ml-1">{stock.percent}</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
