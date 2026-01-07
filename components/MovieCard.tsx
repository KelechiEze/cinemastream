
import React from 'react';
import { Movie } from '../types';
import { Play, Info, Star, Trash2 } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
}

const getGenreStyle = (genre: string) => {
    const g = genre.toLowerCase();
    if (g.includes('action')) return 'text-blue-400';
    if (g.includes('horror')) return 'text-red-400';
    if (g.includes('comedy')) return 'text-yellow-400';
    if (g.includes('drama')) return 'text-purple-400';
    return 'text-white/40';
};

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay, onRemove }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
        onPlay(movie);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onRemove) onRemove(movie);
  };

  return (
    <div className="group flex flex-col gap-3 w-full cursor-pointer relative" onClick={handleCardClick}>
      {/* Container with fixed aspect ratio */}
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-[#1a1a1a] border border-white/5 group-hover:border-[#00bfff]/50 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(0,191,255,0.2)]">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <Star size={10} className="text-yellow-400" fill="currentColor" />
            <span className="text-[10px] font-black text-white">{movie.rating}</span>
          </div>
        )}

        {/* Remove Button Overlay - Only visible if onRemove is passed (e.g., in My List) */}
        {onRemove && (
            <button 
                onClick={handleRemove}
                className="absolute top-3 left-3 z-30 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 border border-white/10"
                title="Remove from My List"
            >
                <Trash2 size={16} />
            </button>
        )}

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-black/20">
             <div className="w-14 h-14 rounded-full bg-[#00bfff] flex items-center justify-center text-white shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-500 mb-4 hover:bg-white hover:text-[#00bfff]">
                 <Play size={24} fill="currentColor" className="ml-1" />
             </div>
             <div className="flex items-center gap-2 text-white font-black text-[9px] uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                 <Info size={12} /> View Details
             </div>
        </div>
        
        {/* Progress Bar */}
        {movie.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900/80 z-20">
                <div className="h-full bg-[#00bfff] shadow-[0_0_8px_rgba(0,191,255,1)]" style={{ width: `${movie.progress}%` }} />
            </div>
        )}
      </div>

      {/* Info Section */}
      <div className="px-1">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mb-1.5">
          <span className="text-[#00bfff]">{movie.year}</span>
          <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span className={getGenreStyle(movie.genre[0] || '')}>
              {movie.genre[0] || 'Feature'}
          </span>
        </div>
        <h3 className="text-white font-bold text-sm md:text-[15px] leading-tight group-hover:text-[#00bfff] transition-colors truncate uppercase tracking-tight">
          {movie.title}
        </h3>
      </div>
    </div>
  );
};

export default MovieCard;
