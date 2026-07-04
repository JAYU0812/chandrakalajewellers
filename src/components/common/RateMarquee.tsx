import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RateMarqueeProps {
  liveSync?: boolean;
}

export const RateMarquee: React.FC<RateMarqueeProps> = ({ liveSync: _liveSync = true }) => {
  // Mock rates matching current Indian market rates for 1 gram of commodity
  const rates = [
    { name: 'Gold 24K', rate: '₹7,450.00', change: '+0.45%', up: true },
    { name: 'Gold 22K', rate: '₹6,830.00', change: '+0.38%', up: true },
    { name: 'Gold 18K', rate: '₹5,588.00', change: '+0.25%', up: true },
    { name: 'Fine Silver 999', rate: '₹92.50', change: '-0.12%', up: false },
  ];

  return (
    <div className="w-full bg-obsidian text-pearl border-b border-gold-primary/20 py-2.5 overflow-hidden select-none text-xs tracking-wider uppercase font-sans font-medium">
      <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Render twice for continuous loop */}
        {[...rates, ...rates, ...rates].map((item, index) => (
          <div key={index} className="inline-flex items-center gap-6 mx-8">
            <span className="text-gold-primary">{item.name}</span>
            <span>{item.rate} / g</span>
            <span className={`inline-flex items-center gap-1 text-[10px] ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
              {item.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {item.change}
            </span>
            <span className="text-gold-primary/20">|</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.33%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};
