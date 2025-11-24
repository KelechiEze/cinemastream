
import React, { useState, useEffect, useRef } from 'react';
import { NAV_ITEMS, RECOMMENDATIONS, MOVIE_GENRES, TV_GENRES } from '../constants';
import { Search, User as UserIcon, ChevronDown, Menu, X, Play, LogOut, ChevronRight } from 'lucide-react';
import { Movie, User } from '../types';
import Logo from './Logo';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { searchMulti } from '../services/tmdb';

interface NavbarProps {
    user: User | null;
    onOpenSignIn: () => void;
    onLogout: () => void;
    onPlay?: (movie: Movie) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onOpenSignIn, onLogout, onPlay }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
      setIsMobileMenuOpen(false);
      setShowMobileSearch(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setShowResults(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (debounceRef.current) {
          clearTimeout(debounceRef.current);
      }

      if (query.length > 1) {
          setIsSearching(true);
          debounceRef.current = setTimeout(async () => {
             const results = await searchMulti(query);
             setSearchResults(results);
             setShowResults(true);
             setIsSearching(false);
          }, 500);
      } else {
          setSearchResults([]);
          setShowResults(false);
          setIsSearching(false);
      }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          if (searchResults.length === 0 && searchQuery.length > 0 && !isSearching) {
              setShowNoResultsModal(true);
              setShowResults(false);
          } else if (searchResults.length > 0) {
              setShowResults(true);
          }
      }
  };

  const handleSelectMovie = (movie: Movie) => {
      setSearchQuery('');
      setShowResults(false);
      if (onPlay) onPlay(movie);
  };

  const handleProfileClick = () => {
      if (user) {
          navigate('/dashboard');
      } else {
          onOpenSignIn();
      }
  };

  const handleGenreClick = (type: 'movies' | 'tv-shows', id: string, name: string) => {
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
      navigate(`/${type}?genre=${id}&name=${encodeURIComponent(name)}`);
  };

  return (
    <>
        <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            isScrolled ? 'bg-[#111]/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-4 md:py-6'
        }`}
        >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between relative">
            
            {/* Left Side: Logo & Menu Toggle */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-gray-300 hover:text-white lg:hidden"
                >
                    <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center gap-2">
                    <Logo className="w-8 h-8 md:w-12 md:h-12" />
                    <span className="sr-only">CineStream</span>
                </Link>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8">
                {NAV_ITEMS.map((item) => (
                <li 
                    key={item.label} 
                    className="relative group h-full py-2"
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <Link
                        to={item.href}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                        {item.label}
                        {item.hasDropdown && <ChevronDown size={12} />}
                    </Link>

                    {/* MEGA MENU DROPDOWN */}
                    {item.hasDropdown && activeDropdown === item.label && (
                         <div className="absolute top-full left-0 mt-0 w-[600px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 grid grid-cols-4 gap-4 animate-fadeIn origin-top-left overflow-hidden z-50">
                            <div className="col-span-4 mb-2 pb-2 border-b border-white/10">
                                <span className="text-white font-bold text-lg">{item.label} Genres</span>
                            </div>
                            
                            {(item.label === 'Movies' ? MOVIE_GENRES : TV_GENRES).map((genre) => (
                                <button 
                                    key={genre.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleGenreClick(item.label === 'Movies' ? 'movies' : 'tv-shows', genre.id, genre.name);
                                    }}
                                    className="text-left text-gray-400 hover:text-[#00bfff] hover:bg-white/5 px-3 py-2 rounded transition-colors text-sm font-medium"
                                >
                                    {genre.name}
                                </button>
                            ))}
                         </div>
                    )}
                </li>
                ))}
            </ul>

            {/* Right Side: Search & Actions */}
            <div className="flex items-center gap-4 md:gap-6">
                
                {/* Mobile Search Toggle */}
                <button 
                    className="md:hidden text-gray-300"
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                    <Search size={20} />
                </button>

                {/* Desktop/Visible Search */}
                <div className={`${showMobileSearch ? 'absolute top-full left-0 right-0 p-4 bg-[#111] border-b border-white/10' : 'hidden'} md:relative md:block md:bg-transparent md:p-0 md:border-none`} ref={searchContainerRef}>
                    <div className="flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/10 focus-within:border-blue-500 focus-within:bg-white/20 transition-all w-full md:w-64 relative z-10">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={handleSearchInput}
                            onKeyDown={handleSearchKeyDown}
                            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full"
                            autoFocus={showMobileSearch}
                        />
                        {isSearching ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : searchQuery ? (
                            <X 
                                size={16} 
                                className="text-gray-400 cursor-pointer hover:text-white" 
                                onClick={() => {
                                    setSearchQuery('');
                                    setShowResults(false);
                                }}
                            />
                        ) : (
                            <Search size={16} className="text-gray-400 hidden md:block" />
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full right-0 md:right-0 left-0 md:left-auto mt-2 md:mt-4 w-full md:w-[600px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl p-4 animate-fadeIn z-50">
                            <div className="flex items-center justify-between mb-3 px-2">
                                <span className="text-sm font-bold text-white">Results for "{searchQuery}"</span>
                                <span className="text-xs text-gray-500">{searchResults.length} found</span>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                {searchResults.map((movie) => (
                                    <div 
                                        key={movie.id} 
                                        className="flex-shrink-0 w-28 md:w-32 cursor-pointer group"
                                        onClick={() => handleSelectMovie(movie)}
                                    >
                                        <div className="relative aspect-[2/3] rounded overflow-hidden mb-2 bg-gray-800">
                                            <img src={movie.imageUrl || movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-8 h-8 bg-[#00bfff] rounded-full flex items-center justify-center text-white">
                                                    <Play size={12} fill="white" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-xs font-bold text-gray-200 truncate">{movie.title}</h4>
                                        <p className="text-[10px] text-gray-500">{movie.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Actions */}
                <div className="relative group">
                    <div 
                        onClick={handleProfileClick}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors overflow-hidden ${user ? 'border border-[#00bfff]' : 'bg-gray-700 text-gray-300 group-hover:bg-[#00bfff] group-hover:text-white'}`}>
                            {user ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={18} />
                            )}
                        </div>
                        <ChevronDown size={12} className="text-gray-400 group-hover:text-white hidden md:block" />
                    </div>

                    {user && (
                         <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="p-3 border-b border-white/10">
                                <p className="text-white text-sm font-bold truncate">{user.name}</p>
                                <p className="text-gray-500 text-xs truncate">{user.email}</p>
                            </div>
                            <button 
                                onClick={() => navigate('/dashboard')} 
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Dashboard
                            </button>
                            <button 
                                onClick={onLogout} 
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors flex items-center gap-2"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </nav>

        {/* MOBILE MENU DRAWER */}
        <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative w-[80%] max-w-sm h-full bg-[#111] shadow-2xl flex flex-col p-6">
                <div className="flex justify-between items-center mb-8">
                    <Logo className="w-10 h-10" />
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <ul className="space-y-4">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                {item.hasDropdown ? (
                                    <div>
                                        <button 
                                            onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                                            className="w-full flex justify-between items-center text-lg font-bold text-white py-2"
                                        >
                                            {item.label}
                                            <ChevronDown size={16} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                                        </button>
                                        {activeDropdown === item.label && (
                                            <div className="pl-4 mt-2 space-y-2 border-l border-white/10 ml-2">
                                                {(item.label === 'Movies' ? MOVIE_GENRES : TV_GENRES).map((genre) => (
                                                    <button 
                                                        key={genre.id}
                                                        onClick={() => handleGenreClick(item.label === 'Movies' ? 'movies' : 'tv-shows', genre.id, genre.name)}
                                                        className="block text-gray-400 text-sm py-1"
                                                    >
                                                        {genre.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link 
                                        to={item.href} 
                                        className="block text-lg font-bold text-white py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {user && (
                    <div className="border-t border-white/10 pt-6 mt-6">
                        <button 
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                onLogout();
                            }}
                            className="flex items-center gap-2 text-red-400 font-bold"
                        >
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>

        {showNoResultsModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setShowNoResultsModal(false)}
                />
                
                <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-3xl p-6 md:p-8 shadow-2xl transform transition-all duration-500 scale-100 animate-[slow-zoom_0.4s_ease-out]">
                    <button 
                        onClick={() => setShowNoResultsModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-6 md:mb-8">
                        <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                            Sorry, we couldn't find "{searchQuery}"
                        </h3>
                        <p className="text-sm md:text-base text-gray-400">
                            We don't have that movie currently, but here are some great recommendations for you.
                        </p>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                         <h4 className="text-xs md:text-sm font-bold text-[#00bfff] uppercase tracking-wider mb-4 text-center">Recommended for you</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {RECOMMENDATIONS.map((rec) => (
                                <div key={rec.id} className="group cursor-pointer" onClick={() => handleSelectMovie(rec)}>
                                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-gray-800">
                                        <img src={rec.imageUrl} alt={rec.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={32} className="text-white drop-shadow-lg" fill="white" />
                                        </div>
                                    </div>
                                    <h5 className="text-xs md:text-sm font-medium text-white text-center">{rec.title}</h5>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default Navbar;
