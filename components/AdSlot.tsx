
import React from 'react';
import { ExternalLink, Info } from 'lucide-react';

interface AdSlotProps {
  type: 'leaderboard' | 'sidebar' | 'native';
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ type, className = "" }) => {
  const isLeaderboard = type === 'leaderboard';
  
  return (
    <div className={`relative group overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] transition-all hover:border-[#00bfff]/30 ${className} ${
      isLeaderboard ? 'w-full h-32 md:h-48' : 'w-full aspect-square md:aspect-auto md:h-64'
    }`}>
      {/* Ad Background Decoration */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00bfff]/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute top-3 left-4 flex items-center gap-2">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] bg-black/40 px-2 py-0.5 rounded border border-white/5">Sponsored</span>
            <Info size={10} className="text-gray-600 cursor-help" />
        </div>

        {isLeaderboard ? (
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:rotate-6 transition-transform">
               <ExternalLink size={32} className="text-white" />
            </div>
            <div className="text-left">
               <h4 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">Upgrade to Premium</h4>
               <p className="text-gray-400 text-sm md:text-base font-medium">Watch all movies in 4K without interruptions. Starting at $12.99/mo.</p>
            </div>
            <button className="bg-white text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#00bfff] hover:text-white transition-all">
                Learn More
            </button>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[#00bfff]">
                <ExternalLink size={24} />
             </div>
             <h4 className="text-white font-bold text-sm uppercase tracking-widest">Your Ad Here</h4>
             <p className="text-gray-500 text-xs">Monetize your traffic with CineStream's premium ad network.</p>
             <button className="text-[#00bfff] text-[10px] font-black uppercase tracking-widest hover:underline">Apply Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdSlot;
