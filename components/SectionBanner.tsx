
import React, { useEffect, useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { Movie } from '../types';
import { fetchTrending } from '../services/tmdb';

interface SectionBannerProps {
    onPlay?: (movie: Movie) => void;
}

const SectionBanner: React.FC<SectionBannerProps> = ({ onPlay }) => {
  const [bannerMovie, setBannerMovie] = useState<Movie | null>(null);

  useEffect(() => {
      const loadBanner = async () => {
          const trending = await fetchTrending();
          // Pick the first one or a random high profile one
          if (trending && trending.length > 0) {
              setBannerMovie(trending[0]);
          }
      };
      loadBanner();
  }, []);

  const handlePlay = () => {
      if(onPlay && bannerMovie) onPlay(bannerMovie);
  };

  if (!bannerMovie) return null;

  return (
    <section className="relative w-full h-[500px] md:h-[600px] flex items-center overflow-hidden my-16 group">
      {/* Background Parallax-ish */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <img 
            src={bannerMovie.backdropUrl} 
            alt={bannerMovie.title}
            className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
        />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 w-full relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Content Left */}
        <div>
            <div className="flex items-center gap-2 mb-4">
                <img src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png" alt="crown" className="w-6 h-6 md:w-8 md:h-8 opacity-80 invert" />
                <span className="text-gray-300 text-xs md:text-sm tracking-wider uppercase font-serif italic">#1 Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 line-clamp-2">{bannerMovie.title}</h2>
            <p className="text-gray-300 text-sm md:text-lg max-w-md mb-6 md:mb-8 leading-relaxed line-clamp-3">
                {bannerMovie.description}
            </p>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={handlePlay}
                    className="bg-[#00bfff] text-white px-6 md:px-8 py-3 md:py-3.5 rounded font-bold text-xs md:text-sm tracking-wide uppercase hover:bg-[#009acd] transition-all shadow-lg shadow-blue-500/30"
                >
                    Watch Now
                </button>
                <button className="bg-black/50 border border-white/30 text-white px-6 md:px-6 py-3 md:py-3.5 rounded font-bold text-xs md:text-sm tracking-wide uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2">
                    <Plus size={16} />
                    Playlist
                </button>
            </div>
        </div>

        {/* Play Button Right */}
        <div className="hidden md:flex justify-center md:justify-end">
            <button 
                onClick={handlePlay}
                className="group/play relative w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/30 flex items-center justify-center hover:border-white transition-all duration-300"
            >
                 <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20"></div>
                 <Play size={40} fill="#00bfff" className="text-[#00bfff] ml-2 group-hover/play:scale-110 transition-transform duration-300" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default SectionBanner;
