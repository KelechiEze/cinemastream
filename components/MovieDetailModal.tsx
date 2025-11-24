
import React, { useEffect, useState } from 'react';
import { X, Play, Calendar, Star, Clock, Globe, ThumbsUp } from 'lucide-react';
import { Movie } from '../types';
import { fetchCredits, fetchSimilarMovies, fetchMovieDetails } from '../services/tmdb';

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, isOpen, onClose, onPlay }) => {
  const [extendedMovie, setExtendedMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const loadDetails = async () => {
        if (movie && isOpen) {
            setIsLoading(true);
            let updated = { ...movie };

            if (movie.tmdbId) {
                const { cast, director } = await fetchCredits(movie.tmdbId, movie.year.length > 4 ? 'tv' : 'movie');
                const details = await fetchMovieDetails(movie.tmdbId, movie.year.length > 4 ? 'tv' : 'movie');
                
                updated = {
                    ...updated,
                    ...details,
                    cast,
                    director,
                    voteCount: movie.voteCount || 0,
                    originalLanguage: movie.originalLanguage || 'en'
                };

                const similar = await fetchSimilarMovies(movie.tmdbId, movie.year.length > 4 ? 'tv' : 'movie');
                setSimilarMovies(similar);
            }
            setExtendedMovie(updated);
            setIsLoading(false);
        }
    };
    loadDetails();
  }, [movie, isOpen]);

  if (!isOpen || !movie) return null;

  const displayMovie = extendedMovie || movie;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:px-4 md:py-10">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content - Full screen on mobile, rounded on desktop */}
      <div className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-6xl bg-[#1a1a1a] md:rounded-2xl overflow-y-auto shadow-2xl border-t md:border border-white/10 flex flex-col animate-[slow-zoom_0.3s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed md:absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white hover:bg-[#00bfff] transition-colors border border-white/20"
        >
          <X size={24} />
        </button>

        {/* Hero Header */}
        <div className="relative w-full h-[50vh] md:h-[500px] shrink-0">
             <img 
                src={displayMovie.backdropUrl || displayMovie.imageUrl} 
                alt={displayMovie.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-3xl">
                <h2 className="text-3xl md:text-6xl font-black text-white mb-3 md:mb-4 leading-tight drop-shadow-xl line-clamp-2">
                    {displayMovie.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-300 mb-6 font-medium">
                    <span className="flex items-center gap-1 md:gap-2 text-[#00bfff] font-bold bg-[#00bfff]/10 px-2 py-1 md:px-3 rounded">
                        <Calendar size={14} className="md:w-4 md:h-4" /> {displayMovie.year}
                    </span>
                    {displayMovie.rating && (
                        <span className="flex items-center gap-1 md:gap-2 text-yellow-400 font-bold">
                            <Star size={14} fill="currentColor" className="md:w-4 md:h-4" /> {displayMovie.rating}
                        </span>
                    )}
                    {displayMovie.duration && (
                        <span className="flex items-center gap-1 md:gap-2">
                            <Clock size={14} className="md:w-4 md:h-4" /> {displayMovie.duration}
                        </span>
                    )}
                    <span className="border border-white/30 px-1.5 py-0.5 rounded text-[10px] md:text-xs uppercase font-bold">HD</span>
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => {
                            onClose();
                            onPlay(displayMovie);
                        }}
                        className="bg-[#00bfff] hover:bg-[#009acd] text-white px-6 py-3 md:py-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(0,191,255,0.3)] hover:scale-105 w-full md:w-auto"
                    >
                        <Play fill="white" size={20} />
                        Watch Now
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 md:py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-3 border border-white/10 w-full md:w-auto">
                        <ThumbsUp size={20} />
                        {displayMovie.voteCount ? `${displayMovie.voteCount} Votes` : 'Like'}
                    </button>
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 bg-[#1a1a1a]">
            
            {/* Left: Synopsis & Cast */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-4 border-l-4 border-[#00bfff] pl-3">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                        {displayMovie.description || "No description available for this title."}
                    </p>
                </div>

                {displayMovie.director && (
                    <div>
                        <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">Director</h4>
                        <p className="text-white font-medium text-lg">{displayMovie.director}</p>
                    </div>
                )}

                {displayMovie.cast && displayMovie.cast.length > 0 && (
                    <div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 border-l-4 border-[#00bfff] pl-3 flex items-center gap-2">
                             Top Cast
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700">
                            {displayMovie.cast.map((actor) => (
                                <div key={actor.id} className="min-w-[90px] md:min-w-[100px] text-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-white/10">
                                        <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h5 className="text-white font-bold text-xs md:text-sm leading-tight line-clamp-2">{actor.name}</h5>
                                    <p className="text-gray-500 text-[10px] md:text-xs mt-1 line-clamp-1">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Info & Similar */}
            <div className="space-y-8">
                <div>
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-4 border-l-4 border-[#00bfff] pl-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                        {displayMovie.genre && displayMovie.genre.length > 0 ? (
                            displayMovie.genre.map((g, i) => (
                                <span key={i} className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm hover:bg-[#00bfff] hover:text-white hover:border-[#00bfff] transition-colors cursor-default">
                                    {g}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 text-xs">N/A</span>
                        )}
                    </div>
                </div>

                {similarMovies.length > 0 && (
                     <div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 border-l-4 border-[#00bfff] pl-3">
                             You Might Like
                        </h3>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {similarMovies.slice(0, 4).map((m) => (
                                <div key={m.id} onClick={() => {
                                    onClose(); // Close current modal to trigger play on the similar one? Or maybe just switch details
                                    onPlay(m);
                                }} className="cursor-pointer group">
                                     <div className="aspect-[2/3] rounded overflow-hidden relative mb-2">
                                        <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Play fill="white" />
                                        </div>
                                     </div>
                                     <h5 className="text-xs font-bold text-gray-400 group-hover:text-white truncate">{m.title}</h5>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
