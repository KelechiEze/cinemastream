
import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../types';
import gsap from 'gsap';

type FilterType = 'Today' | 'This week' | 'Last 30 days';

interface SectionComedyProps {
    onPlay?: (movie: Movie) => void;
    movies: Movie[];
}

const SectionComedy: React.FC<SectionComedyProps> = ({ onPlay, movies }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Today');
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedMovies = useMemo(() => {
    // If we have API data, we can just sort/slice it differently to simulate filters
    const allMovies = [...movies];
    let baseList = [];
    
    if (activeFilter === 'This week') {
      baseList = allMovies.reverse();
    } else if (activeFilter === 'Last 30 days') {
      baseList = allMovies.sort((a, b) => a.title.length - b.title.length);
    } else {
       baseList = allMovies;
    }

    if (isExpanded && baseList.length < 10) {
        return [...baseList, ...baseList, ...baseList].map((m, i) => ({...m, id: `${m.id}-exp-${i}`}));
    }
    return baseList;
  }, [activeFilter, isExpanded, movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
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
    <section className="w-full bg-[#111] py-16 border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-1/4 flex flex-col justify-center items-start shrink-0">
            <div className="w-12 h-1 bg-gray-700 mb-6"></div>
            <h2 className="text-4xl font-bold text-white mb-2 leading-tight">
              Funniest Comedy <br/> Movies
            </h2>
            
            {!isExpanded && (
                <div className="flex gap-4 mt-8">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-[#00bfff] hover:text-[#00bfff] transition-colors active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-[#00bfff] hover:text-[#00bfff] transition-colors active:scale-95"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
            
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-12 text-xs font-bold text-gray-500 hover:text-[#00bfff] uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
                {isExpanded ? 'View Less' : 'View All'} 
                <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="lg:w-3/4 overflow-hidden relative">
            <div className="flex gap-8 mb-8 text-sm font-medium text-gray-500 border-b border-gray-800 pb-4">
                {['Today', 'This week', 'Last 30 days'].map((filter) => (
                    <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter as FilterType)}
                        className={`relative transition-colors ${
                            activeFilter === filter 
                            ? "text-[#00bfff] after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:w-full after:h-[2px] after:bg-[#00bfff]" 
                            : "hover:text-white"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div 
                ref={scrollContainerRef}
                className={
                    isExpanded 
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn"
                    : "flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
                }
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {displayedMovies.map((movie, index) => (
                    <div 
                        key={`${movie.id}-${activeFilter}-${index}`} 
                        className={isExpanded ? "" : "min-w-[180px] md:min-w-[200px] animate-fadeIn"}
                    >
                        <MovieCard movie={movie} onPlay={onPlay} />
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionComedy;
