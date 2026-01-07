
import React from 'react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { Bookmark, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MyListPageProps {
  watchlist: Movie[];
  onPlay?: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
}

const MyListPage: React.FC<MyListPageProps> = ({ watchlist, onPlay, onRemove }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111] pt-32 px-6 pb-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-16 flex items-center justify-between">
            <div className="border-l-4 border-[#00bfff] pl-6">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter uppercase">My List</h1>
                <p className="text-gray-400 text-lg">Your curated collection of must-watch cinema.</p>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                <Bookmark className="text-[#00bfff]" />
                <span className="text-white font-bold">{watchlist.length} SAVED TITLES</span>
            </div>
        </div>

        {watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-fadeIn">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                    <Bookmark size={48} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Your list is currently empty</h2>
                <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
                    Start adding your favorite movies and shows here to keep track of what you want to watch next.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-[#00bfff] text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-white hover:text-black transition-all shadow-lg"
                >
                    <Search size={20} /> BROWSE CATALOG <ChevronRight size={20} />
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-fadeIn">
                {watchlist.map((movie) => (
                    <div key={movie.id} className="animate-fadeIn">
                        <MovieCard movie={movie} onPlay={onPlay} onRemove={onRemove} />
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
