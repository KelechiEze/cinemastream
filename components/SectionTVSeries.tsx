
import React, { useState, useMemo } from 'react';
import TVCard from './TVCard';
import { Movie } from '../types';

type TVFilter = 'Today' | 'This week' | 'Last 30 days';

interface SectionTVSeriesProps {
    onPlay?: (movie: Movie) => void;
    movies: Movie[];
}

const SectionTVSeries: React.FC<SectionTVSeriesProps> = ({ onPlay, movies }) => {
  const [activeFilter, setActiveFilter] = useState<TVFilter>('Today');

  const displayedSeries = useMemo(() => {
    const list = [...movies];
    if (activeFilter === 'This week') {
        return list.reverse();
    } else if (activeFilter === 'Last 30 days') {
        return list.sort((a, b) => a.title.length - b.title.length);
    }
    return list;
  }, [activeFilter, movies]);

  return (
    <section id="tv-shows" className="w-full bg-[#111] py-20">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-1/4 shrink-0 pt-8">
            <div className="w-12 h-1 bg-gray-700 mb-6"></div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Popular TV Series <br/> Right Now
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Discover the most trending TV series across all genres. Updated daily to keep you in the loop with what's hot in the streaming world.
            </p>
          </div>

          <div className="lg:w-3/4">
            <div className="flex gap-8 mb-10 text-sm font-medium text-gray-500 border-b border-gray-800 pb-4">
                {['Today', 'This week', 'Last 30 days'].map((filter) => (
                    <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter as TVFilter)}
                        className={`transition-colors relative ${
                            activeFilter === filter 
                            ? "text-[#00bfff] after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:w-full after:h-[2px] after:bg-[#00bfff]" 
                            : "hover:text-white"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 animate-fadeIn">
                {displayedSeries.map((show, idx) => (
                    <TVCard key={`${show.id}-${activeFilter}-${idx}`} movie={show} onPlay={onPlay} />
                ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SectionTVSeries;
