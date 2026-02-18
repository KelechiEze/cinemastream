
import React, { useState, useEffect, useRef } from 'react';
import { NAV_ITEMS, RECOMMENDATIONS, MOVIE_GENRES, TV_GENRES, INDUSTRIES } from '../constants';
import { Search, User as UserIcon, ChevronDown, Menu, X, Play, LogOut, Globe, Film } from 'lucide-react';
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
             try {
                const results = await searchMulti(query);
                setSearchResults(results.slice(0, 8)); // Limit to top 8
                setShowResults(true);
             } catch (err) {
                console.error("Search error:", err);
             } finally {
                setIsSearching(false);
             }
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
          if (searchResults.length > 0) {
              setShowResults(true);
          }
      }
  };

  const handleSelectMovie = (movie: Movie) => {
      setSearchQuery('');
      setShowResults(false);
      setSearchResults([]);
      if (onPlay) onPlay(movie);
  };

  const handleProfileClick = () => {
      if (user) {
          navigate('/dashboard');
      } else {
          navigate('/signin');
      }
  };

  const handleGenreClick = (type: 'movies' | 'tv-shows', id: string, name: string) => {
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
      navigate(`/${type}?genre=${id}&name=${encodeURIComponent(name)}`);
  };

  const handleIndustryClick = (industry: typeof INDUSTRIES[0]) => {
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
      navigate(`/movies?country=${industry.country}&lang=${industry.lang}&name=${encodeURIComponent(industry.name)}`);
  };

  return (
    <>
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[#111]/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-white lg:hidden"><Menu size={24} /></button>
                <Link to="/" className="flex items-center gap-2"><Logo className="w-8 h-8 md:w-12 md:h-12" /><span className="sr-only">CineStream</span></Link>
            </div>

            <ul className="hidden lg:flex items-center gap-8">
                {NAV_ITEMS.map((item) => (
                <li key={item.label} className="relative group h-full py-2" onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                    <Link to={item.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                        {item.label}
                        {item.hasDropdown && <ChevronDown size={12} />}
                    </Link>

                    {item.hasDropdown && activeDropdown === item.label && (
                         <div className="absolute top-full left-0 mt-0 w-[600px] bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 grid grid-cols-4 gap-4 animate-fadeIn origin-top-left overflow-hidden z-50">
                            {item.label === 'Regions' ? (
                                <>
                                    <div className="col-span-4 mb-2 pb-2 border-b border-white/10 flex items-center gap-2 text-white font-bold text-lg"><Globe size={20} className="text-[#00bfff]" /> Global Industries</div>
                                    {INDUSTRIES.map((ind) => (
                                        <button key={ind.id} onClick={() => handleIndustryClick(ind)} className="text-left text-gray-400 hover:text-[#00bfff] hover:bg-white/5 px-3 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-widest">{ind.name}</button>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="col-span-4 mb-2 pb-2 border-b border-white/10"><span className="text-white font-bold text-lg">{item.label} Genres</span></div>
                                    {(item.label === 'Movies' ? MOVIE_GENRES : TV_GENRES).map((genre) => (
                                        <button key={genre.id} onClick={(e) => { e.preventDefault(); handleGenreClick(item.label === 'Movies' ? 'movies' : 'tv-shows', genre.id, genre.name); }} className="text-left text-gray-400 hover:text-[#00bfff] hover:bg-white/5 px-3 py-2 rounded transition-colors text-sm font-medium">{genre.name}</button>
                                    ))}
                                </>
                            )}
                         </div>
                    )}
                </li>
                ))}
            </ul>

            <div className="flex items-center gap-4 md:gap-6">
                <button className="md:hidden text-gray-300" onClick={() => setShowMobileSearch(!showMobileSearch)}><Search size={20} /></button>
                <div className={`${showMobileSearch ? 'absolute top-full left-0 right-0 p-4 bg-[#111] border-b border-white/10' : 'hidden'} md:relative md:block`} ref={searchContainerRef}>
                    <div className="flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/10 focus-within:border-[#00bfff] transition-all w-full md:w-64 relative z-10">
                        <input 
                            type="text" 
                            placeholder="Search titles..." 
                            value={searchQuery} 
                            onChange={handleSearchInput} 
                            onKeyDown={handleSearchKeyDown} 
                            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full" 
                        />
                        {isSearching ? <div className="w-4 h-4 border-2 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div> : <Search size={16} className="text-gray-400" />}
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && searchQuery.length > 1 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[450px] overflow-y-auto z-50 animate-fadeIn min-w-[300px]">
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    <div className="px-4 py-2 bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Film size={12} /> Found {searchResults.length} Matches
                                    </div>
                                    {searchResults.map((movie) => (
                                        <div 
                                            key={movie.id}
                                            onClick={() => handleSelectMovie(movie)}
                                            className="flex items-center gap-4 p-4 hover:bg-[#00bfff]/10 cursor-pointer transition-all group"
                                        >
                                            <div className="w-12 h-16 rounded overflow-hidden shrink-0 border border-white/10">
                                                <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-white text-sm font-bold truncate group-hover:text-[#00bfff] transition-colors">{movie.title}</span>
                                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{movie.year}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-3 text-center">
                                        <button 
                                            onClick={() => navigate(`/movies?query=${encodeURIComponent(searchQuery)}`)}
                                            className="text-[10px] font-black text-[#00bfff] uppercase tracking-widest hover:underline"
                                        >
                                            View all results
                                        </button>
                                    </div>
                                </div>
                            ) : !isSearching && (
                                <div className="p-10 text-center">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Search size={20} className="text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No results for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <div onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-all ${user ? 'border-2 border-[#00bfff] hover:scale-110' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                            {user ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon size={18} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </nav>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
             <div className="fixed inset-0 z-[100] bg-black animate-fadeIn lg:hidden">
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <Logo className="w-10 h-10" />
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={32} /></button>
                </div>
                <div className="p-8 space-y-8">
                    {NAV_ITEMS.map((item) => (
                        <Link 
                            key={item.label} 
                            to={item.href} 
                            className="block text-3xl font-black text-white uppercase tracking-tighter"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-8 border-t border-white/10">
                        {user ? (
                            <button onClick={onLogout} className="text-red-500 font-bold text-xl flex items-center gap-3"><LogOut /> Sign Out</button>
                        ) : (
                            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signin'); }} className="text-[#00bfff] font-bold text-xl">Sign In</button>
                        )}
                    </div>
                </div>
             </div>
        )}
    </>
  );
};

export default Navbar;
