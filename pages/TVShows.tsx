import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TVCard from '../components/TVCard';
import { Movie } from '../types';
import { fetchTVSeries, discoverTV } from '../services/tmdb';

interface TVShowsPageProps {
  onPlay?: (movie: Movie) => void;
}

const TVShowsPage: React.FC<TVShowsPageProps> = ({ onPlay }) => {
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('genre');
  const genreName = searchParams.get('name');
  
  const [shows, setShows] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
        setIsLoading(true);
        try {
            if (genreId) {
                const results = await discoverTV(genreId);
                setShows(results);
            } else {
                const results = await fetchTVSeries();
                setShows(results);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    loadShows();
  }, [genreId]);

  return (
    <div className="min-h-screen bg-[#111] pt-24 px-6 pb-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 border-l-4 border-purple-500 pl-6">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                {genreName ? `${genreName} Series` : 'TV Shows'}
            </h1>
            <p className="text-gray-400 text-lg">
                {genreName ? `Binge-worthy ${genreName} TV shows.` : 'Catch up on the latest and greatest television series.'}
            </p>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fadeIn">
                {shows.map((show) => (
                    <div key={show.id} className="animate-fadeIn">
                        <TVCard movie={show} onPlay={onPlay} />
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default TVShowsPage;