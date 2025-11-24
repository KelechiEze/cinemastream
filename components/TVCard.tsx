
import React from 'react';
import { Movie } from '../types';
import { Play } from 'lucide-react';

interface TVCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

const TVCard: React.FC<TVCardProps> = ({ movie, onPlay }) => {
  const handlePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onPlay) onPlay(movie);
  };

  return (
    <div className="group flex flex-col gap-2 w-full cursor-pointer" onClick={handlePlay}>
      <div className="relative overflow-hidden rounded-sm aspect-video bg-gray-800">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
        />
        
        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
             <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white">
                 <Play size={18} fill="currentColor" className="ml-1" />
             </div>
        </div>
      </div>

      <div className="mt-1 px-1">
        <div className="flex flex-wrap items-center gap-1 text-[10px] text-gray-400 mb-1">
            {movie.genre.slice(0, 2).join(', ')} 
            <span className="mx-1">•</span>
            <span>{movie.year}</span>
        </div>
        <h3 className="text-white font-bold text-sm leading-tight group-hover:text-[#00bfff] transition-colors line-clamp-1">
          {movie.title}
        </h3>
      </div>
    </div>
  );
};

export default TVCard;
