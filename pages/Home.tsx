
import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import SectionPopular from '../components/SectionPopular';
import SectionComedy from '../components/SectionComedy';
import SectionBanner from '../components/SectionBanner';
import SectionTVSeries from '../components/SectionTVSeries';
import SectionSeasonFeature from '../components/SectionSeasonFeature';
import { Movie } from '../types';
import { HERO_SLIDES, POPULAR_MOVIES, COMEDY_MOVIES, TV_SERIES } from '../constants'; // Fallbacks
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
            console.error("Failed to load TMDB data", e);
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, []);

  return (
    <div id="home" className="min-h-screen bg-[#111]">
      {/* Pass fetched movies and recommendations to HeroSlider */}
      <HeroSlider 
          movies={heroMovies.length ? heroMovies : HERO_SLIDES} 
          recommendations={recommendations}
          onPlay={onPlay} 
      />
      
      <main className="max-w-[1600px] mx-auto px-6 mt-16 md:mt-24">
        
        <SectionPopular movies={popularMovies.length ? popularMovies : POPULAR_MOVIES} onPlay={onPlay} />

      </main>

      <div id="comedy">
          <SectionComedy movies={comedyMovies.length ? comedyMovies : COMEDY_MOVIES} onPlay={onPlay} />
      </div>

      <SectionTVSeries movies={tvSeries.length ? tvSeries : TV_SERIES} onPlay={onPlay} />

      <div id="banner">
        <SectionBanner onPlay={onPlay} />
      </div>

      <SectionSeasonFeature onPlay={onPlay} />

    </div>
  );
};

export default Home;
