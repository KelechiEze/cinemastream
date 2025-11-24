
import React from 'react';
import { Movie } from '../types';
import { Play } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay }) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
        onPlay(movie);
    }
  };

  return (
    <div className="group flex flex-col gap-2 w-full cursor-pointer relative">
      <div className="relative overflow-hidden rounded-sm aspect-[2/3] bg-gray-800">
        {movie.isFeatured && (
          <div className="absolute top-0 left-4 z-20 bg-[#00bfff] text-white text-[10px] font-bold px-3 py-1 rounded-b shadow-md uppercase tracking-wider">
            Featured
          </div>
        )}
        
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
        />
        
        {/* Hover Overlay with Play Button */}
        <div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={handlePlayClick}
        >
             <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white shadow-lg transform hover:scale-110">
                 <Play fill="currentColor" className="ml-1" />
             </div>
        </div>
        
        {/* Bottom Gradient for text readability if needed */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Progress Bar for Continue Watching */}
        {movie.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 z-20">
                <div 
                    className="h-full bg-[#00bfff]" 
                    style={{ width: `${movie.progress}%` }}
                />
            </div>
        )}
      </div>

      <div className="mt-2 px-1">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
          <span>{movie.year}</span>
          {movie.genre && movie.genre.length > 0 && (
            <>
                <span>,</span>
                <span className="truncate">{movie.genre.join(', ')}</span>
            </>
          )}
        </div>
        <h3 className="text-white font-bold text-base leading-tight group-hover:text-[#00bfff] transition-colors">
          {movie.title}
        </h3>
        {movie.price && (
            <div className="mt-1 text-[#00bfff] text-xs font-bold">{movie.price} Pre-order</div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
