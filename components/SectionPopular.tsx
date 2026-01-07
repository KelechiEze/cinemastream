
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Grid, LayoutList } from 'lucide-react';
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

  const gridMovies = movies.length < 12 && isExpanded 
    ? [...movies, ...movies].map((m, i) => ({...m, id: `${m.id}-dup-${i}`})) 
    : movies;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8; 
      
      const targetScroll = direction === 'left' 
        ? Math.max(0, current.scrollLeft - scrollAmount)
        : Math.min(current.scrollWidth - current.clientWidth, current.scrollLeft + scrollAmount);
      
      gsap.to(current, {
        scrollLeft: targetScroll,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  };

  return (
    <section id="movies" className="mb-24 animate-fadeIn">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <SectionHeader 
          title="Trending Global Hits" 
          subtitle="The most watched blockbusters of the week" 
          actionText={isExpanded ? "Show Slider" : "Show All"}
          onActionClick={() => setIsExpanded(!isExpanded)}
        />
        
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
            <button 
                onClick={() => setIsExpanded(false)}
                className={`p-2 rounded-lg transition-all ${!isExpanded ? 'bg-[#00bfff] text-white' : 'text-gray-500 hover:text-white'}`}
            >
                <LayoutList size={18} />
            </button>
            <button 
                onClick={() => setIsExpanded(true)}
                className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-[#00bfff] text-white' : 'text-gray-500 hover:text-white'}`}
            >
                <Grid size={18} />
            </button>
        </div>
      </div>
      
      <div className="relative min-h-[350px]">
        {isExpanded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-10 animate-fadeIn">
            {gridMovies.map((movie) => (
              <div key={movie.id} className="transition-all duration-500 hover:scale-105">
                 <MovieCard movie={movie} onPlay={onPlay} />
              </div>
            ))}
          </div>
        ) : (
          <div className="group relative">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-black/60 hover:bg-[#00bfff] text-white rounded-full flex items-center justify-center backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-7 shadow-2xl border border-white/10 active:scale-90"
            >
              <ChevronLeft size={28} />
            </button>

            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-black/60 hover:bg-[#00bfff] text-white rounded-full flex items-center justify-center backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-7 shadow-2xl border border-white/10 active:scale-90"
            >
              <ChevronRight size={28} />
            </button>

            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-12 pt-4 scrollbar-hide px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {movies.map((movie) => (
                <div key={movie.id} className="min-w-[150px] md:min-w-[200px] flex-shrink-0">
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
