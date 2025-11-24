import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types';
import { fetchPopularMovies, discoverMovies } from '../services/tmdb';

interface MoviesPageProps {
  onPlay?: (movie: Movie) => void;
}

const MoviesPage: React.FC<MoviesPageProps> = ({ onPlay }) => {
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('genre');
  const genreName = searchParams.get('name');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
        setIsLoading(true);
        try {
            if (genreId) {
                const results = await discoverMovies(genreId);
                setMovies(results);
            } else {
                const results = await fetchPopularMovies();
                setMovies(results);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    loadMovies();
  }, [genreId]);

  return (
    <div className="min-h-screen bg-[#111] pt-24 px-6 pb-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 border-l-4 border-[#00bfff] pl-6">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                {genreName ? `${genreName} Movies` : 'Explore Movies'}
            </h1>
            <p className="text-gray-400 text-lg">
                {genreName ? `Browse our collection of ${genreName} films.` : 'Discover the most popular movies trending right now.'}
            </p>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fadeIn">
                {movies.map((movie) => (
                    <div key={movie.id} className="animate-fadeIn">
                        <MovieCard movie={movie} onPlay={onPlay} />
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;