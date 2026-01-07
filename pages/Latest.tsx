
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
    <div className="min-h-screen bg-[#111] pt-32 px-6 pb-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-16 flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] transform -rotate-3">
                <Calendar size={32} />
            </div>
            <div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">Coming Soon</h1>
                <p className="text-gray-400 text-lg">Be the first to watch upcoming global blockbusters.</p>
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-fadeIn">
                {movies.map((movie) => (
                    <div key={movie.id} className="group relative">
                        <MovieCard movie={movie} onPlay={onPlay} />
                        <div className="mt-3">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-red-600 px-3 py-1 rounded">
                                PRE-RELEASE
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
