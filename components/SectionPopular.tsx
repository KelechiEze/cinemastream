
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import SectionHeader from './SectionHeader';
import { Movie } from '../types';
import gsap from 'gsap';

interface SectionPopularProps {
    onPlay?: (movie: Movie) => void;
    movies: Movie[];
}

const SectionPopular: React.FC<SectionPopularProps> = ({ onPlay, movies }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // If expanded, use the full list directly (or duplicate if list is small to fill grid)
  const gridMovies = movies.length < 10 && isExpanded 
    ? [...movies, ...movies, ...movies].map((m, i) => ({...m, id: `${m.id}-dup-${i}`})) 
    : movies;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.75; 
      
      const targetScroll = direction === 'left' 
        ? Math.max(0, current.scrollLeft - scrollAmount)
        : Math.min(current.scrollWidth - current.clientWidth, current.scrollLeft + scrollAmount);
      
      gsap.to(current, {
        scrollLeft: targetScroll,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };

  return (
    <section id="movies" className="mb-24">
      <SectionHeader 
        title="Popular Movies to Watch Now" 
        subtitle="Most watched movies by days" 
        actionText={isExpanded ? "VIEW LESS" : "VIEW ALL"}
        onActionClick={() => setIsExpanded(!isExpanded)}
      />
      
      <div className="relative min-h-[400px] transition-all duration-500 ease-in-out">
        {isExpanded ? (
          /* GRID VIEW */
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-8 animate-fadeIn">
            {gridMovies.map((movie) => (
              <div key={movie.id} className="animate-[fadeIn_0.5s_ease-out]">
                 <MovieCard movie={movie} onPlay={onPlay} />
              </div>
            ))}
          </div>
        ) : (
          /* SLIDER VIEW */
          <div className="group relative">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-[#00bfff] text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-6"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-[#00bfff] text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-6"
            >
              <ChevronRight size={24} />
            </button>

            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-12 pt-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {movies.map((movie) => (
                <div key={movie.id} className="min-w-[130px] md:min-w-[160px] flex-shrink-0 transform transition-transform hover:-translate-y-2 duration-300">
                  <MovieCard movie={movie} onPlay={onPlay} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionPopular;
