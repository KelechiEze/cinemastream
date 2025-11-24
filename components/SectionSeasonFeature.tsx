
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Play } from 'lucide-react';
import { Movie, Episode } from '../types';
import { fetchTVDetails, fetchTVSeason } from '../services/tmdb';

interface SectionSeasonFeatureProps {
    onPlay?: (movie: Movie) => void;
}

const SectionSeasonFeature: React.FC<SectionSeasonFeatureProps> = ({ onPlay }) => {
  const episodeContainerRef = useRef<HTMLDivElement>(null);
  const [activeSeason, setActiveSeason] = useState(6); // Vikings has 6 seasons
  const [showDetails, setShowDetails] = useState<Movie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Vikings TMDB ID: 44217
  const VIKINGS_ID = '44217'; 
  const bgImage = showDetails?.backdropUrl || "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1920&auto=format&fit=crop";
  const seasons = [6, 5, 4, 3, 2, 1];

  useEffect(() => {
      const loadShow = async () => {
          const details = await fetchTVDetails(VIKINGS_ID);
          if (details) setShowDetails(details);
      };
      loadShow();
  }, []);

  useEffect(() => {
      const loadSeason = async () => {
          setIsLoading(true);
          const eps = await fetchTVSeason(VIKINGS_ID, activeSeason);
          setEpisodes(eps);
          setIsLoading(false);
      };
      loadSeason();
  }, [activeSeason]);

  const handlePlayEpisode = (ep: Episode) => {
      if (onPlay) {
          const tempMovie: Movie = {
              id: ep.id,
              tmdbId: VIKINGS_ID, // Link back to show
              title: `${ep.number} - ${ep.title}`,
              imageUrl: ep.imageUrl,
              year: ep.airDate ? ep.airDate.split('-')[0] : 'N/A',
              genre: ['Action', 'History'],
              duration: '45m',
              backdropUrl: bgImage,
              description: ep.overview
          };
          onPlay(tempMovie);
      }
  };

  if (!showDetails) return null;

  return (
    <section id="vikings" className="relative w-full py-24 min-h-[700px] flex flex-col justify-center overflow-hidden bg-gray-900">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
            src={bgImage}
            alt="Show Background"
            className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-6 w-full flex flex-col items-center">
        
        {/* Title Area */}
        <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">{showDetails.title}</h2>
            <p className="text-xl text-gray-200 font-light mb-2">Dive into Season {activeSeason}</p>
            <p className="text-xl text-white font-medium">Watch and Debate</p>
        </div>

        {/* Season Tabs */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12 border-b border-white/20 pb-2 w-full max-w-4xl">
            {seasons.map((season) => (
                <button 
                    key={season} 
                    onClick={() => setActiveSeason(season)}
                    className={`text-lg font-bold transition-colors pb-4 relative ${
                        activeSeason === season 
                        ? 'text-[#00bfff] after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[3px] after:bg-[#00bfff]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Season {season}
                </button>
            ))}
        </div>

        {/* Episodes Carousel */}
        <div className="w-full overflow-x-auto pb-8 scrollbar-hide" ref={episodeContainerRef}>
            {isLoading ? (
                <div className="flex justify-center w-full py-10">
                    <div className="w-10 h-10 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex gap-6 justify-start md:justify-center min-w-max px-6 animate-fadeIn">
                    {episodes.map((ep) => (
                        <div key={ep.id} className="group w-[280px] cursor-pointer" onClick={() => handlePlayEpisode(ep)}>
                            <div className="relative aspect-video bg-gray-800 overflow-hidden rounded-sm mb-3">
                                <img 
                                    src={ep.imageUrl} 
                                    alt={ep.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Play Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Play fill="white" size={32} className="text-white" />
                                </div>
                            </div>
                            <div className="px-1">
                                <p className="text-[#00bfff] text-xs font-bold mb-1">{ep.number}</p>
                                <h4 className="text-white font-bold text-sm group-hover:text-[#00bfff] transition-colors truncate">{ep.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default SectionSeasonFeature;
