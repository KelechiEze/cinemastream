import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types';
import { fetchUpcoming } from '../services/tmdb';
import { Calendar } from 'lucide-react';

interface LatestPageProps {
  onPlay?: (movie: Movie) => void;
}

const LatestPage: React.FC<LatestPageProps> = ({ onPlay }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        const results = await fetchUpcoming();
        setMovies(results);
        setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#111] pt-24 px-6 pb-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <Calendar size={32} />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-1">Coming Soon</h1>
                <p className="text-gray-400">Be the first to watch upcoming blockbusters.</p>
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-fadeIn">
                {movies.map((movie) => (
                    <div key={movie.id} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-b from-transparent to-red-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MovieCard movie={movie} onPlay={onPlay} />
                        <div className="mt-2 text-center">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest border border-red-900/50 bg-red-900/10 px-2 py-1 rounded">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default LatestPage;