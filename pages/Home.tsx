
import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import SectionPopular from '../components/SectionPopular';
import SectionComedy from '../components/SectionComedy';
import SectionBanner from '../components/SectionBanner';
import SectionTVSeries from '../components/SectionTVSeries';
import SectionSeasonFeature from '../components/SectionSeasonFeature';
import { Movie } from '../types';
import { HERO_SLIDES, POPULAR_MOVIES, COMEDY_MOVIES, TV_SERIES } from '../constants';
import { fetchTrending, fetchPopularMovies, fetchComedyMovies, fetchTVSeries } from '../services/tmdb';

interface HomeProps {
    onPlay?: (movie: Movie) => void;
}

const Home: React.FC<HomeProps> = ({ onPlay }) => {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [tvSeries, setTvSeries] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [trending, popular, comedy, tv] = await Promise.all([
                fetchTrending(),
                fetchPopularMovies(),
                fetchComedyMovies(),
                fetchTVSeries()
            ]);
            
            setHeroMovies(trending.length > 0 ? trending.slice(0, 5) : HERO_SLIDES);
            setRecommendations(trending.length > 0 ? trending.slice(5, 9) : []);
            setPopularMovies(popular.length > 0 ? popular : POPULAR_MOVIES);
            setComedyMovies(comedy.length > 0 ? comedy : COMEDY_MOVIES);
            setTvSeries(tv.length > 0 ? tv : TV_SERIES);
        } catch (e) {
            console.error("Home Data Fetch Error", e);
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,191,255,0.4)]" />
            <p className="text-[#00bfff] text-xs font-black uppercase tracking-[0.5em] animate-pulse">Initializing Cinema</p>
        </div>
    );
  }

  return (
    <div id="home" className="min-h-screen bg-[#111] overflow-x-hidden">
      
      {/* Hero Experience */}
      <HeroSlider 
          movies={heroMovies.length ? heroMovies : HERO_SLIDES} 
          recommendations={recommendations}
          onPlay={onPlay} 
      />
      
      {/* Primary Layout Wrapper */}
      <main className="max-w-[1600px] mx-auto px-6 space-y-24 md:space-y-32 py-16 md:py-24">
        
        {/* Popular Section with Expanded Capability */}
        <SectionPopular movies={popularMovies} onPlay={onPlay} />

        {/* Thematic Comedy Row */}
        <div id="comedy">
            <SectionComedy movies={comedyMovies} onPlay={onPlay} />
        </div>

        {/* Global TV Collection */}
        <SectionTVSeries movies={tvSeries} onPlay={onPlay} />

        {/* Interactive Feature Banner */}
        <div id="banner" className="relative -mx-6">
            <SectionBanner onPlay={onPlay} />
        </div>

        {/* Featured Season Deep-Dive */}
        <SectionSeasonFeature onPlay={onPlay} />

      </main>

    </div>
  );
};

export default Home;
