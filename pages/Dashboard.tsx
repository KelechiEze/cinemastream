
import React, { useEffect, useState } from 'react';
import { User, Movie, SubscriptionPlan } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { SUBSCRIPTION_PLANS, TV_SERIES } from '../constants';
import { fetchRealUserData, fetchUpcoming } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import PaymentModal from '../components/PaymentModal';
import { 
    Crown, 
    Download, 
    History, 
    Globe, 
    Trash2, 
    LogOut, 
    Power, 
    ChevronRight,
    ShieldCheck,
    Gem,
    Calendar,
    CreditCard,
    Newspaper,
    ArrowLeft,
    Check,
    Clock,
    AlertCircle,
    Bell
} from 'lucide-react';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
  onPlay?: (movie: Movie) => void;
}

// Define all possible views
type ViewState = 'dashboard' | 'news' | 'vip' | 'downloads' | 'history' | 'language' | 'privacy';

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onPlay }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [cacheSize, setCacheSize] = useState('949.2 MB');
  const [isClearingCache, setIsClearingCache] = useState(false);
  
  // View All States for Dashboard Home
  const [expandContinue, setExpandContinue] = useState(false);
  const [expandWatchlist, setExpandWatchlist] = useState(false);

  // Real Data State
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Movie[]>([]);

  // Payment State
  const [paymentPlan, setPaymentPlan] = useState<SubscriptionPlan | null>(null);
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle Initial View from Navigation State (e.g. from Upgrade Modal)
  useEffect(() => {
    if (location.state && (location.state as any).initialView) {
        setActiveView((location.state as any).initialView as ViewState);
        // Clear state so refresh doesn't keep reseting view if we navigate away later
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
      const loadData = async () => {
          const { continueWatching, watchlist } = await fetchRealUserData();
          const upcoming = await fetchUpcoming();
          
          setContinueWatching(continueWatching);
          setWatchlist(watchlist);
          setUpcomingEvents(upcoming);
      };
      loadData();
  }, []);

  if (!user) return null;

  const handleClearCache = () => {
      if (cacheSize === '0 B') return;
      setIsClearingCache(true);
      setTimeout(() => {
          setCacheSize('0 B');
          setIsClearingCache(false);
      }, 1500);
  };

  const handleDeleteAccount = () => {
      if(window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
          onLogout();
          navigate('/');
      }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
      if (plan.price === 'Free') {
          alert("You are already on the Free tier.");
      } else {
          setPaymentPlan(plan);
      }
  };

  const handlePaymentSuccess = () => {
      setIsVip(true);
      setActiveView('vip'); // Redirect to VIP view to show benefits
  };

  // --- SUB-PAGE RENDERER ---
  const renderSubPageContent = () => {
    switch (activeView) {
        case 'news':
            return <NewsView movies={upcomingEvents} onPreOrder={(m) => alert(`Pre-ordered ${m.title}`)} onSelectPlan={handlePlanSelect} />;
        case 'vip':
            return <VipView isVip={isVip} />;
        case 'downloads':
            return <DownloadsView onPlay={onPlay} />;
        case 'history':
            return <HistoryView onPlay={onPlay} watchlist={watchlist} />;
        case 'language':
            return <LanguageView />;
        case 'privacy':
            return <PrivacyView />;
        default:
            return null;
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#111] relative overflow-hidden">
      
      {/* MAIN SLIDING CONTAINER */}
      <div 
        className="flex w-[200%] transition-transform duration-500 ease-in-out"
        style={{ transform: activeView !== 'dashboard' ? 'translateX(-50%)' : 'translateX(0)' }}
      >
        {/* --- VIEW 1: USER PROFILE (DASHBOARD) --- */}
        <div className="w-1/2 min-h-screen pt-24 pb-20 px-4 md:px-6 flex justify-center box-border overflow-y-auto">
            <div className="w-full max-w-[1600px]">
                
                {/* Nav to News Page (Shortcut) */}
                <div className="flex justify-end mb-6 md:mb-8">
                    <button 
                        onClick={() => setActiveView('news')}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 group text-sm md:text-base"
                    >
                        <Newspaper size={18} />
                        <span>News & Events</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    {/* LEFT SIDEBAR (Stacks on mobile) */}
                    <div className="w-full lg:w-[350px] shrink-0 space-y-6 md:space-y-8">
                        {/* Profile Card */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-24 opacity-50 ${isVip ? 'bg-gradient-to-r from-yellow-600 to-red-600' : 'bg-gradient-to-r from-blue-900 to-purple-900'}`}></div>
                            <div className="relative z-10 flex items-center gap-4 mt-4">
                                <div className="relative">
                                    <img src={user.avatar} alt={user.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#1a1a1a] shadow-lg object-cover" />
                                    <div className={`absolute bottom-0 right-0 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#1a1a1a] ${isVip ? 'bg-yellow-500' : 'bg-[#00bfff]'}`}>
                                        {isVip ? 'VIP+' : user.plan || 'Basic'}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-white">{user.name}</h2>
                                    <p className="text-gray-400 text-xs mb-1">ID: 104140904</p>
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded w-fit">
                                        <Gem size={12} className={isVip ? "text-red-500" : "text-yellow-400"} fill="currentColor" />
                                        <span className="text-[10px] text-gray-300 uppercase tracking-wider font-bold">{isVip ? 'Platinum Member' : 'Member'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5">
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Universal General</h3>
                            </div>
                            <div className="divide-y divide-white/5">
                                <MenuItem icon={<Crown size={20} />} label="VIP Center" onClick={() => setActiveView('vip')} />
                                <MenuItem icon={<Download size={20} />} label="My Downloads" onClick={() => setActiveView('downloads')} />
                                <MenuItem icon={<History size={20} />} label="History" onClick={() => setActiveView('history')} />
                                <MenuItem icon={<Globe size={20} />} label="Language" value="English" onClick={() => setActiveView('language')} />
                                
                                {/* Actions (No Page Navigation) */}
                                <button onClick={handleClearCache} className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><Trash2 size={20} /></div>
                                        <span className="text-gray-200 font-medium">Clear cache</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isClearingCache ? <div className="w-4 h-4 border-2 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div> : <span className="text-gray-500 text-sm">{cacheSize}</span>}
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </div>
                                </button>
                                <button onClick={() => { onLogout(); navigate('/'); }} className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform"><LogOut size={20} /></div>
                                        <span className="text-gray-200 font-medium">Sign Out</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-600" />
                                </button>
                                <button onClick={handleDeleteAccount} className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-900/10 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform"><Power size={20} /></div>
                                        <span className="text-gray-200 font-medium">Delete Account</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                        
                         <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5"><h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">About</h3></div>
                            <MenuItem icon={<ShieldCheck size={20} />} label="Privacy Policy" onClick={() => setActiveView('privacy')} />
                        </div>
                    </div>

                    {/* RIGHT DASHBOARD CONTENT */}
                    <div className="flex-1 space-y-8 md:space-y-12 overflow-hidden">
                        {/* Continue Watching */}
                        <div>
                            <div className="flex items-end justify-between mb-4 md:mb-6 border-b border-white/10 pb-4">
                                <div><h2 className="text-xl md:text-2xl font-bold text-white mb-1">Continue Watching</h2><p className="text-xs md:text-sm text-gray-400">Pick up where you left off</p></div>
                                <button onClick={() => setExpandContinue(!expandContinue)} className="text-xs font-bold text-[#00bfff] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                    {expandContinue ? 'View Less' : 'View All'} <ChevronRight size={14} className={`transition-transform ${expandContinue ? 'rotate-90' : ''}`} />
                                </button>
                            </div>
                            {expandContinue ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                                    {[...continueWatching, ...continueWatching].map((movie, idx) => <MovieCard key={`${movie.id}-exp-${idx}`} movie={movie} onPlay={() => onPlay && onPlay(movie)} />)}
                                </div>
                            ) : (
                                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                    {continueWatching.map((movie) => (
                                        <div key={movie.id} className="min-w-[160px] md:min-w-[220px] flex-shrink-0">
                                            <MovieCard movie={movie} onPlay={() => onPlay && onPlay(movie)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Watchlist */}
                        <div>
                             <div className="flex items-end justify-between mb-4 md:mb-6 border-b border-white/10 pb-4">
                                <div><h2 className="text-xl md:text-2xl font-bold text-white mb-1">My Watchlist</h2><p className="text-xs md:text-sm text-gray-400">Saved movies and shows</p></div>
                                <button onClick={() => setExpandWatchlist(!expandWatchlist)} className="text-xs font-bold text-[#00bfff] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                    {expandWatchlist ? 'View Less' : 'View All'} <ChevronRight size={14} className={`transition-transform ${expandWatchlist ? 'rotate-90' : ''}`} />
                                </button>
                            </div>
                            {expandWatchlist ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                                    {[...watchlist, ...watchlist].map((movie, idx) => <MovieCard key={`${movie.id}-wl-${idx}`} movie={movie} onPlay={() => onPlay && onPlay(movie)} />)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {watchlist.slice(0, 4).map((movie) => <div key={movie.id}><MovieCard movie={movie} onPlay={() => onPlay && onPlay(movie)} /></div>)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- VIEW 2: DYNAMIC SUB-PAGE CONTENT --- */}
        <div className="w-1/2 min-h-screen pt-24 pb-20 px-4 md:px-6 flex justify-center shrink-0 bg-[#111] box-border overflow-y-auto">
            <div className="w-full max-w-[1600px]">
                
                {/* Common Back Button */}
                <button 
                    onClick={() => setActiveView('dashboard')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#00bfff] transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-bold">Back to Profile</span>
                </button>

                {/* Render the specific content for the active view */}
                <div className="animate-fadeIn w-full">
                    {renderSubPageContent()}
                </div>

            </div>
        </div>
      </div>

    </div>

    {/* Payment Modal */}
    <PaymentModal 
        isOpen={!!paymentPlan} 
        onClose={() => setPaymentPlan(null)} 
        plan={paymentPlan}
        user={user}
        onSuccess={handlePaymentSuccess}
    />
    </>
  );
};

// --- SUB-PAGE COMPONENTS ---

interface NewsViewProps {
    onPreOrder: (m: Movie) => void;
    onSelectPlan: (plan: SubscriptionPlan) => void;
    movies: Movie[];
}

const NewsView: React.FC<NewsViewProps> = ({ onPreOrder, onSelectPlan, movies }) => (
    <>
        {/* Hero News - Using Real TMDB Upcoming Data */}
        <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-6 md:mb-8 border-l-8 border-[#00bfff] pl-4 md:pl-6 flex items-center gap-3">
                <Bell size={24} className="text-[#00bfff] md:w-8 md:h-8" /> 
                Upcoming Events & Premieres
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Take the first 3 upcoming movies and style them as 'News' cards */}
                {movies.slice(0, 3).map((movie, index) => (
                    <div key={movie.id} className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 hover:border-[#00bfff] transition-colors">
                        <div className="aspect-video overflow-hidden relative">
                            <img 
                                src={movie.backdropUrl || movie.imageUrl} 
                                alt={movie.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute top-4 left-4 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm uppercase tracking-wider">
                                {index === 0 ? 'World Premiere' : 'Coming Soon'}
                            </div>
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="flex items-center gap-2 text-[#00bfff] text-xs font-bold mb-2">
                                <Calendar size={14} />
                                {movie.year} Release
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-[#00bfff] transition-colors line-clamp-1">{movie.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{movie.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Pre-orders */}
        <div className="mb-12 md:mb-16">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Pre-order Now</h2>
                    <span className="text-sm text-gray-500">Get exclusive access before global release</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* Use the next 4 movies for pre-orders */}
                {movies.slice(3, 7).map((movie) => (
                    <div key={movie.id} className="bg-[#1a1a1a] p-3 md:p-4 rounded-xl border border-white/10">
                        <div className="rounded overflow-hidden mb-2">
                            <MovieCard movie={{...movie, isFeatured: false}} />
                        </div>
                        <button 
                            onClick={() => onPreOrder(movie)}
                            className="w-full mt-4 bg-white/10 hover:bg-[#00bfff] text-white font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 text-xs md:text-sm"
                        >
                            <CreditCard size={14} />
                            Pre-order
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Subscriptions */}
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {SUBSCRIPTION_PLANS.map((plan) => (
                    <div 
                        key={plan.id} 
                        className={`relative bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border-2 flex flex-col ${plan.isPopular ? 'border-[#00bfff] shadow-[0_0_30px_rgba(0,191,255,0.2)] md:scale-105 z-10' : 'border-white/5 hover:border-white/20'}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00bfff] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-white mb-2 text-center">{plan.name}</h3>
                        <div className="text-center mb-8">
                            <span className="text-3xl md:text-4xl font-black text-white">{plan.price}</span>
                            <span className="text-gray-500 text-sm"> / {plan.period}</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                                    <ShieldCheck size={16} className="text-[#00bfff]" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => onSelectPlan(plan)}
                            className={`w-full py-3 rounded font-bold transition-colors ${plan.isPopular ? 'bg-[#00bfff] hover:bg-[#009acd] text-white' : 'bg-white/10 hover:bg-white hover:text-black text-white'}`}
                        >
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </>
);

const VipView: React.FC<{isVip: boolean}> = ({ isVip }) => (
    <div className="max-w-4xl mx-auto text-center">
        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(250,204,21,0.4)] ${isVip ? 'bg-gradient-to-br from-red-500 to-yellow-600' : 'bg-gradient-to-br from-yellow-400 to-yellow-600'}`}>
            <Crown size={40} className="text-white md:w-12 md:h-12" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">VIP Center</h2>
        <p className={`${isVip ? 'text-red-500' : 'text-yellow-500'} font-bold uppercase tracking-widest mb-12`}>{isVip ? 'Platinum Status' : 'Diamond Membership'}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12">
            {['Ad-Free Streaming', '8K Ultra HD', 'Early Access'].map((benefit, i) => (
                <div key={i} className={`bg-[#1a1a1a] p-6 md:p-8 rounded-xl border border-white/10 flex flex-col items-center ${isVip ? 'border-red-500/30' : ''}`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-[#00bfff]">
                        <Check size={20} className="md:w-6 md:h-6" />
                    </div>
                    <h3 className="font-bold text-white text-sm md:text-base">{benefit}</h3>
                </div>
            ))}
        </div>

        <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-xl border border-white/10 text-left">
            <div className="flex justify-between items-end mb-2">
                <h4 className="text-gray-400 font-bold uppercase text-xs tracking-wider">Membership Status</h4>
                <span className="text-[#00bfff] font-bold">Active</span>
            </div>
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
                <div className={`h-full w-[75%] bg-gradient-to-r ${isVip ? 'from-red-500 to-yellow-500' : 'from-blue-500 to-purple-500'}`}></div>
            </div>
            <p className="text-xs text-gray-500">Renews on October 24, 2025</p>
        </div>
    </div>
);

const DownloadsView: React.FC<{ onPlay?: (m: Movie) => void }> = ({ onPlay }) => {
    // Simulated downloads
    const downloads = TV_SERIES.slice(0, 4);
    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Download className="text-[#00bfff]" /> My Downloads
            </h2>
            <div className="space-y-4">
                {downloads.map((movie) => (
                    <div key={movie.id} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col md:flex-row gap-4 border border-white/5 hover:border-white/20 transition-colors">
                        <div className="w-full md:w-32 aspect-video bg-gray-800 rounded overflow-hidden shrink-0">
                            <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-white mb-1">{movie.title}</h3>
                            <p className="text-gray-500 text-xs">{movie.year} • 1.4 GB</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0 md:pr-4 justify-end">
                            <button 
                                onClick={() => onPlay && onPlay(movie)}
                                className="bg-[#00bfff] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#009acd] transition-colors"
                            >
                                Play
                            </button>
                            <button className="text-gray-500 hover:text-red-500 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HistoryView: React.FC<{ onPlay?: (m: Movie) => void, watchlist: Movie[] }> = ({ onPlay, watchlist }) => (
    <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <History className="text-[#00bfff]" /> Watch History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {watchlist.map((movie, i) => (
                 <div key={i} onClick={() => onPlay && onPlay(movie)} className="flex gap-4 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                     <div className="w-16 md:w-20 aspect-[2/3] rounded overflow-hidden shrink-0 relative">
                         <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-8 h-8 bg-[#00bfff] rounded-full flex items-center justify-center text-white"><Clock size={14} /></div>
                         </div>
                     </div>
                     <div>
                         <h4 className="text-white font-bold group-hover:text-[#00bfff] transition-colors text-sm md:text-base">{movie.title}</h4>
                         <p className="text-gray-500 text-xs mt-1">Watched 2 days ago</p>
                         <div className="w-full h-1 bg-gray-800 rounded-full mt-3">
                             <div className="h-full bg-gray-500 w-[90%] rounded-full"></div>
                         </div>
                     </div>
                 </div>
             ))}
        </div>
    </div>
);

const LanguageView: React.FC = () => (
    <div className="max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Globe className="text-[#00bfff]" /> Language Settings
        </h2>
        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
            {['English', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)', 'Japanese (日本語)'].map((lang, i) => (
                <button key={i} className="w-full flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 text-left">
                    <span className="text-gray-200 font-medium">{lang}</span>
                    {i === 0 && <Check size={20} className="text-[#00bfff]" />}
                </button>
            ))}
        </div>
    </div>
);

const PrivacyView: React.FC = () => (
    <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <ShieldCheck className="text-[#00bfff]" /> Privacy Policy
        </h2>
        <div className="prose prose-invert">
            <p className="text-gray-400 leading-relaxed mb-6">
                At CineStream, we take your privacy seriously. This policy describes how we collect, use, and handle your personal information when you use our streaming services.
            </p>
            <h3 className="text-xl font-bold text-white mb-4">1. Information We Collect</h3>
            <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
                <li>Account information (Name, Email, Payment details)</li>
                <li>Usage data (Watch history, Search queries)</li>
                <li>Device information (IP address, Browser type)</li>
            </ul>
            <h3 className="text-xl font-bold text-white mb-4">2. How We Use Your Data</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
                We use your data to provide personalized recommendations, process payments, and improve our platform's performance. We do not sell your personal data to third parties.
            </p>
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">Last updated: October 24, 2024. Please check back regularly for updates.</p>
            </div>
        </div>
    </div>
);

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; value?: string; onClick: () => void }> = ({ icon, label, value, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-[#00bfff] group-hover:text-white transition-all">{icon}</div>
            <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-gray-500 text-sm">{value}</span>}
            <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
        </div>
    </button>
);

export default Dashboard;
