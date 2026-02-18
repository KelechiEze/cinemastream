
import React, { useState, useEffect } from 'react';
import { ExternalLink, SkipForward, Volume2, VolumeX, Info } from 'lucide-react';

interface VideoAdOverlayProps {
  onAdComplete: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const VideoAdOverlay: React.FC<VideoAdOverlayProps> = ({ onAdComplete, isMuted, onToggleMute }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      if (timeLeft <= 5) setCanSkip(true);
      return () => clearTimeout(timer);
    } else {
      onAdComplete();
    }
  }, [timeLeft]);

  return (
    <div className="absolute inset-0 z-[60] bg-black animate-fadeIn">
      {/* Simulated Ad Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 border border-white/20 animate-pulse">
            <ExternalLink size={48} className="text-[#00bfff]" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Experience CineStream Premium</h2>
        <p className="text-gray-300 text-lg max-w-xl mb-10 font-light">Unlimited access to 4K content, offline downloads, and zero ads for the price of a coffee. Level up your cinema game today.</p>
        <button className="bg-[#00bfff] text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,191,255,0.4)] hover:scale-105 transition-all">
            Get 3 Months Free
        </button>
      </div>

      {/* Ad UI Controls */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4">
        <button onClick={onToggleMute} className="bg-black/60 p-3 rounded-full text-white backdrop-blur-md border border-white/10">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="bg-black/60 px-4 py-2 rounded-xl text-white backdrop-blur-md border border-white/10 flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sponsored Ad</span>
            <div className="w-px h-3 bg-white/20" />
            <span className="text-xs font-mono font-bold">{timeLeft}s</span>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3">
        {canSkip ? (
            <button 
                onClick={onAdComplete}
                className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:bg-[#00bfff] hover:text-white transition-all animate-fadeIn"
            >
                Skip Ad <SkipForward size={18} />
            </button>
        ) : (
            <div className="bg-black/60 px-6 py-4 rounded-2xl text-white backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest">
                Skip in {timeLeft - 5}s
            </div>
        )}
        <button className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
            <Info size={12} /> Why this ad?
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div 
            className="h-full bg-[#00bfff] transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(0,191,255,1)]" 
            style={{ width: `${(10 - timeLeft) * 10}%` }} 
        />
      </div>
    </div>
  );
};

export default VideoAdOverlay;
