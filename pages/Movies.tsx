
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types';
import { fetchPopularMovies, discoverMovies } from '../services/tmdb';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';

interface MoviesPageProps {
  onPlay?: (movie: Movie) => void;
}

const MoviesPage: React.FC<MoviesPageProps> = ({ onPlay }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get('genre');
  const genreName = searchParams.get('name');
  const country = searchParams.get('country');
  const lang = searchParams.get('lang');
  const page = parseInt(searchParams.get('page') || '1');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
        setIsLoading(true);
        window.scrollTo(0, 0);
        try {
            if (genreId || country || lang) {
                const results = await discoverMovies(genreId || undefined, page, country || undefined, lang || undefined);
                setMovies(results);
            } else {
                const results = await fetchPopularMovies(page);
                setMovies(results);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    loadMovies();
  }, [genreId, country, lang, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#111] pt-24 px-6 pb-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 border-l-4 border-[#00bfff] pl-6 flex flex-col gap-2">
            <div className="flex items-center gap-3 text-[#00bfff] font-black text-xs uppercase tracking-[0.3em]">
                {country ? <Globe size={14} /> : null}
                {country ? 'Global Industry Discovery' : 'Movie Catalog'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                {genreName ? `${genreName}` : 'All Movies'}
            </h1>
            <p className="text-gray-400 text-lg">
                Page {page} • curated top-rated content.
            </p>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-24">
                <div className="w-12 h-12 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : movies.length === 0 ? (
            <div className="text-center py-24 text-gray-500">No movies found for this category.</div>
        ) : (
            <>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fadeIn">
                    {movies.map((movie) => (
                        <div key={movie.id} className="animate-fadeIn">
                            <MovieCard movie={movie} onPlay={onPlay} />
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex items-center justify-center gap-6">
                    <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-[#00bfff] disabled:opacity-30 transition-all">
                        <ChevronLeft size={20} /> Previous
                    </button>
                    <div className="text-lg font-black text-[#00bfff]">{page}</div>
                    <button onClick={() => handlePageChange(page + 1)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-[#00bfff] transition-all">
                        Next <ChevronRight size={20} />
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
