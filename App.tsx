
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import MoviesPage from './pages/Movies';
import TVShowsPage from './pages/TVShows';
import LatestPage from './pages/Latest';
import BlogPage from './pages/Blog';
import MyListPage from './pages/MyList';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import UpgradePromptModal from './components/UpgradePromptModal';
import MovieDetailModal from './components/MovieDetailModal';
import { User, Movie } from './types';

// Global styles hack
const GlobalStyles = () => (
    <style>{`
      @keyframes slow-zoom {
        0% { transform: scale(1.05); }
        100% { transform: scale(1.15); }
      }
      .animate-slow-zoom {
        animation: slow-zoom 20s infinite alternate ease-in-out;
      }
      html {
        scroll-behavior: smooth;
      }
      .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
      }
      @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
      }
      .scrollbar-hide::-webkit-scrollbar {
          display: none;
      }
    `}</style>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  // Load watchlist from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cinestream_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Watchlist load error", e);
      }
    }
  }, []);

  // Persist watchlist changes
  useEffect(() => {
    localStorage.setItem('cinestream_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleLogout = () => {
      setUser(null);
  };

  const handlePlay = (movie: Movie) => {
      setDetailMovie(null); 
      setPlayingMovie(movie);
  };

  const handleOpenDetail = (movie: Movie) => {
      setDetailMovie(movie);
  };

  const toggleWatchlist = (movie: Movie) => {
      setWatchlist(prev => {
          const exists = prev.find(m => m.id === movie.id);
          if (exists) {
              return prev.filter(m => m.id !== movie.id);
          }
          return [...prev, movie];
      });
  };

  const handleAuth = (u: User) => {
      setUser(u);
      setTimeout(() => {
          setShowUpgradeModal(true);
      }, 2000);
  };

  return (
    <Router>
      <GlobalStyles />
      <div className="min-h-screen bg-[#111] text-white font-sans antialiased selection:bg-[#00bfff] selection:text-white">
        <Navbar 
            user={user} 
            onOpenSignIn={() => setIsSignInOpen(true)} 
            onLogout={handleLogout}
            onPlay={handleOpenDetail}
        />
        
        <SignInModal 
            isOpen={isSignInOpen} 
            onClose={() => setIsSignInOpen(false)} 
            onSignIn={handleAuth} 
        />

        <UpgradePromptModal 
            isOpen={showUpgradeModal} 
            onClose={() => setShowUpgradeModal(false)} 
        />

        <MovieDetailModal 
            movie={detailMovie} 
            isOpen={!!detailMovie} 
            onClose={() => setDetailMovie(null)} 
            onPlay={handlePlay}
            onToggleWatchlist={toggleWatchlist}
            isInWatchlist={detailMovie ? watchlist.some(m => m.id === detailMovie.id) : false}
        />

        {playingMovie && (
            <VideoPlayerModal 
                movie={playingMovie} 
                onClose={() => setPlayingMovie(null)} 
                onSwitchMovie={(m) => setPlayingMovie(m)}
            />
        )}

        <Routes>
          <Route path="/" element={<Home onPlay={handleOpenDetail} />} />
          <Route path="/movies" element={<MoviesPage onPlay={handleOpenDetail} />} />
          <Route path="/tv-shows" element={<TVShowsPage onPlay={handleOpenDetail} />} />
          <Route path="/my-list" element={<MyListPage watchlist={watchlist} onPlay={handleOpenDetail} onRemove={toggleWatchlist} />} />
          <Route path="/latest" element={<LatestPage onPlay={handleOpenDetail} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/signup" element={<SignUp onSignUp={handleAuth} />} />
          <Route path="/signin" element={<SignIn onSignIn={handleAuth} />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard user={user} onLogout={handleLogout} onPlay={handleOpenDetail} />} 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
