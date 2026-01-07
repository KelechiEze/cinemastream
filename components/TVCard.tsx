
import React from 'react';
import { Movie } from '../types';
import { Play, Info, Layers } from 'lucide-react';

interface TVCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

const TVCard: React.FC<TVCardProps> = ({ movie, onPlay }) => {
  const handleCardClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onPlay) onPlay(movie);
  };

  return (
    <div className="group flex flex-col gap-2 w-full cursor-pointer relative" onClick={handleCardClick}>
      {/* Standardized Aspect Ratio for TV Landscape View */}
      <div className="relative overflow-hidden rounded-2xl aspect-video bg-[#0a0a0a] border border-white/5 group-hover:border-[#00bfff]/50 transition-all duration-500 shadow-xl">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-40"
          loading="lazy"
        />
        
        {/* Hover Interaction Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-black/40 backdrop-blur-[2px]">
             <div className="w-14 h-14 rounded-full bg-[#00bfff] flex items-center justify-center text-white shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-500 mb-3 hover:bg-white hover:text-[#00bfff]">
                 <Play size={24} fill="currentColor" className="ml-1" />
             </div>
             <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 px-4 py-2 bg-black/40 rounded-full border border-white/10">
                 <Layers size={14} /> Full Season
             </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-[#00bfff] text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg border border-white/20">
            TV Series
        </div>
      </div>

      <div className="mt-3 px-1">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00bfff] mb-2">
            <span className="text-white/60">{movie.year}</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
            <span className="truncate max-w-[100px]">{movie.genre.slice(0, 1).join(', ')}</span>
        </div>
        <h3 className="text-white font-bold text-base leading-tight group-hover:text-[#00bfff] transition-colors line-clamp-1">
          {movie.title}
        </h3>
      </div>
    </div>
  );
};

export default TVCard;
