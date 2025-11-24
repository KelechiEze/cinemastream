
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MoviesPage from './pages/Movies';
import TVShowsPage from './pages/TVShows';
import LatestPage from './pages/Latest';
import BlogPage from './pages/Blog';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import UpgradePromptModal from './components/UpgradePromptModal';
import { User, Movie } from './types';

// Global styles hack for Tailwind specific animations that are hard to inline
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
    `}</style>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleLogout = () => {
      setUser(null);
  };

  const handlePlay = (movie: Movie) => {
      setPlayingMovie(movie);
  };

  const handleAuth = (u: User) => {
      setUser(u);
      // Trigger upgrade prompt after 2 seconds
      setTimeout(() => {
          setShowUpgradeModal(true);
      }, 2000);
  };

  return (
    <Router>
      <GlobalStyles />
      <div className="min-h-screen bg-[#111] text-white font-sans antialiased selection:bg-blue-500 selection:text-white">
        <Navbar 
            user={user} 
            onOpenSignIn={() => setIsSignInOpen(true)} 
            onLogout={handleLogout}
            onPlay={handlePlay}
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

        {playingMovie && (
            <VideoPlayerModal 
                movie={playingMovie} 
                onClose={() => setPlayingMovie(null)} 
            />
        )}

        <Routes>
          <Route path="/" element={<Home onPlay={handlePlay} />} />
          <Route path="/movies" element={<MoviesPage onPlay={handlePlay} />} />
          <Route path="/tv-shows" element={<TVShowsPage onPlay={handlePlay} />} />
          <Route path="/latest" element={<LatestPage onPlay={handlePlay} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/signup" element={<SignUp onSignUp={handleAuth} />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard user={user} onLogout={handleLogout} onPlay={handlePlay} />} 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
