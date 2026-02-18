
import React, { useEffect, useState, useRef } from 'react';
import { 
    X, Play, Calendar, Star, Clock, ThumbsUp, Layers, 
    ChevronRight, Tag, Bookmark, Check, Sword, Ghost, 
    Laugh, Rocket, Drama as DramaIcon, Film, Users,
    Info, User, MapPin, Cake
} from 'lucide-react';
import { Movie, Episode, CastMember } from '../types';
import { 
    fetchCredits, fetchSimilarMovies, fetchMovieDetails, 
    fetchTVSeason, fetchTVDetails, fetchPersonDetails 
} from '../services/tmdb';

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onOpenDetail?: (movie: Movie) => void;
  onToggleWatchlist?: (movie: Movie) => void;
  isInWatchlist?: boolean;
}

const getGenreMetadata = (genre: string) => {
    const g = genre.toLowerCase();
    if (g.includes('action')) return { 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
        icon: <Sword size={12} />, 
        label: 'Action' 
    };
    if (g.includes('horror')) return { 
        color: 'bg-red-500/20 text-red-400 border-red-500/30', 
        icon: <Ghost size={12} />, 
        label: 'Horror' 
    };
    if (g.includes('comedy')) return { 
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
        icon: <Laugh size={12} />, 
        label: 'Comedy' 
    };
    if (g.includes('drama')) return { 
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', 
        icon: <DramaIcon size={12} />, 
        label: 'Drama' 
    };
    if (g.includes('sci-fi') || g.includes('science fiction')) return { 
        color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', 
        icon: <Rocket size={12} />, 
        label: 'Sci-Fi' 
    };
    return { 
        color: 'bg-white/10 text-white/70 border-white/20', 
        icon: <Film size={12} />, 
        label: genre 
    };
};

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ 
    movie, isOpen, onClose, onPlay, onToggleWatchlist, isInWatchlist 
}) => {
  const [extendedMovie, setExtendedMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [totalSeasons, setTotalSeasons] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEpisodesLoading, setIsEpisodesLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cast Bio States
  const [selectedCastMember, setSelectedCastMember] = useState<CastMember | null>(null);
  const [castBio, setCastBio] = useState<any | null>(null);
  const [isBioLoading, setIsBioLoading] = useState(false);

  // Determine if it's a TV show or movie for credits fetching
  const isTVSeries = movie ? (movie.year.includes('-') || (movie.tmdbId && parseInt(movie.tmdbId) > 500)) : false;

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        if (modalRef.current) modalRef.current.scrollTop = 0;
    } else {
        document.body.style.overflow = '';
        setSelectedCastMember(null);
        setCastBio(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const loadDetails = async () => {
        if (movie && isOpen) {
            setIsLoading(true);
            const idToUse = movie.tmdbId || movie.id;
            const type = isTVSeries ? 'tv' : 'movie';
            
            try {
                const [credits, details, similar] = await Promise.all([
                    fetchCredits(idToUse, type),
                    fetchMovieDetails(idToUse, type),
                    fetchSimilarMovies(idToUse, type)
                ]);
                
                const updated = { ...movie, ...details, ...credits };
                setExtendedMovie(updated);
                setSimilarMovies(similar);
                
                if (isTVSeries) {
                    const tvFull = await fetchTVDetails(idToUse);
                    if (tvFull?.seasons) {
                        const realSeasons = tvFull.seasons.filter((s: any) => s.season_number > 0);
                        setTotalSeasons(realSeasons.length);
                        const initialSeason = realSeasons[0]?.season_number || 1;
                        setSelectedSeason(initialSeason);
                        loadEpisodes(idToUse, initialSeason);
                    }
                }
            } catch (err) { 
                console.error("Failed to load movie details:", err); 
            } finally { 
                setIsLoading(false); 
            }
        }
    };
    loadDetails();
  }, [movie, isOpen, isTVSeries]);

  const loadEpisodes = async (tmdbId: string, seasonNum: number) => {
      setIsEpisodesLoading(true);
      const eps = await fetchTVSeason(tmdbId, seasonNum);
      setEpisodes(eps);
      setIsEpisodesLoading(false);
  };

  const handleViewBio = async (person: CastMember) => {
      setSelectedCastMember(person);
      setIsBioLoading(true);
      try {
          const details = await fetchPersonDetails(person.id);
          setCastBio(details);
      } catch (err) {
          console.error("Failed to load bio:", err);
      } finally {
          setIsBioLoading(false);
      }
  };

  if (!isOpen || !movie) return null;
  const displayMovie = extendedMovie || movie;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:px-4 md:py-10">
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} />
      <div ref={modalRef} className="relative w-full h-full md:h-auto md:max-h-[92vh] max-w-7xl bg-[#111] md:rounded-3xl overflow-y-auto shadow-2xl border-t md:border border-white/10 animate-[slow-zoom_0.4s_ease-out] scrollbar-hide">
        
        {/* Close Button */}
        <button onClick={onClose} className="fixed md:absolute top-6 right-6 z-50 bg-black/60 p-3 rounded-full text-white hover:bg-[#00bfff] transition-all border border-white/20">
          <X size={24} />
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-[50vh] md:h-[550px] shrink-0">
             <img src={displayMovie.backdropUrl || displayMovie.imageUrl} alt={displayMovie.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg ${isTVSeries ? 'bg-purple-600' : 'bg-[#00bfff]'}`}>
                        {isTVSeries ? 'TV Collection' : 'Cinema Original'}
                    </span>
                    {displayMovie.rating && (
                        <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-yellow-400 font-black text-xs border border-white/10">
                            <Star size={14} fill="currentColor" /> {displayMovie.rating}
                        </span>
                    )}
                </div>
                
                <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] drop-shadow-2xl uppercase tracking-tighter">
                    {displayMovie.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    <div className="flex items-center gap-2 text-white/40 font-black text-[9px] uppercase tracking-[0.3em] mr-2">
                        <Tag size={12} /> Category Identifiers
                    </div>
                    {displayMovie.genre?.map((g, i) => {
                        const meta = getGenreMetadata(g);
                        return (
                            <div key={i} className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl border transition-all uppercase tracking-widest ${meta.color}`}>
                                {meta.icon}
                                <span>{meta.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => onPlay(displayMovie)} className="bg-[#00bfff] text-white hover:bg-white hover:text-black px-12 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,191,255,0.4)]">
                        <Play fill="currentColor" size={24} /> WATCH NOW
                    </button>
                    <button 
                        onClick={() => onToggleWatchlist?.(displayMovie)}
                        className={`px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 border backdrop-blur-md
                            ${isInWatchlist 
                                ? 'bg-[#00bfff]/20 border-[#00bfff] text-[#00bfff]' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                        {isInWatchlist ? <Check size={24} /> : <Bookmark size={24} />}
                        {isInWatchlist ? 'SAVED TO LIST' : 'SAVE TO LIST'}
                    </button>
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-16 bg-[#111]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-20">
                    {/* Synopsis */}
                    <section>
                        <h3 className="text-white font-black text-xl uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                            <div className="w-10 h-1 bg-[#00bfff]" /> Synopsis
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-lg md:text-xl font-light selection:bg-[#00bfff]">
                            {displayMovie.description || "In a world where every choice has a consequence, witness the beginning of an epic saga that defies time and space. Prepare for a cinematic journey like no other."}
                        </p>
                    </section>

                    {/* TOP CAST GALLERY */}
                    <section className="animate-fadeIn">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-white font-black text-xl uppercase tracking-[0.2em] flex items-center gap-4">
                                <div className="w-10 h-1 bg-yellow-500" /> Starring Cast
                            </h3>
                            {isLoading && <div className="text-[10px] text-[#00bfff] animate-pulse font-black uppercase tracking-widest">Identifying Talent...</div>}
                        </div>
                        
                        {isLoading ? (
                            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="shrink-0 w-32 md:w-44 space-y-4">
                                        <div className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                                        <div className="h-4 bg-white/5 rounded w-3/4 mx-auto animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : displayMovie.cast && displayMovie.cast.length > 0 ? (
                            <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide -mx-2 px-2">
                                {displayMovie.cast.map((person) => (
                                    <div key={person.id} className="group shrink-0 w-32 md:w-44 text-center">
                                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-[#00bfff] transition-all mb-4 shadow-2xl bg-gray-900">
                                            <img 
                                                src={person.imageUrl} 
                                                alt={person.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop';
                                                    e.currentTarget.classList.add('opacity-40');
                                                }}
                                            />
                                            {/* Hover info overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                <button 
                                                    onClick={() => handleViewBio(person)}
                                                    className="w-full bg-[#00bfff] text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors"
                                                >
                                                    <Info size={12} /> View Bio
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="text-white font-black text-[11px] md:text-sm uppercase tracking-tight line-clamp-1 mb-1 group-hover:text-[#00bfff] transition-colors">
                                            {person.name}
                                        </h4>
                                        <p className="text-[#00bfff] text-[9px] md:text-[10px] font-black uppercase tracking-tighter line-clamp-1 opacity-70 group-hover:opacity-100 italic">
                                            as {person.character}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center">
                                <Users size={32} className="text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Cast Information Coming Soon</p>
                            </div>
                        )}
                    </section>

                    {/* TV Seasons Section */}
                    {isTVSeries && totalSeasons > 0 && (
                        <section className="animate-fadeIn">
                             <h3 className="text-white font-black text-xl uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                                <div className="w-10 h-1 bg-purple-500" /> Seasons & Episodes
                             </h3>
                             <div className="flex gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide border-b border-white/5">
                                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                                    <button 
                                        key={s} 
                                        onClick={() => { setSelectedSeason(s); loadEpisodes(movie.tmdbId || movie.id, s); }}
                                        className={`shrink-0 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                                            selectedSeason === s ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        Season {s}
                                    </button>
                                ))}
                             </div>
                             {isEpisodesLoading ? <div className="flex justify-center py-12 animate-spin text-[#00bfff]"><Layers /></div> : (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {episodes.map((ep) => (
                                        <div key={ep.id} className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => onPlay({...displayMovie, title: `${displayMovie.title} - ${ep.number}`})}>
                                            <div className="aspect-video relative bg-gray-900">
                                                <img src={ep.imageUrl} alt={ep.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play fill="white" size={24} /></div>
                                            </div>
                                            <div className="p-4"><h4 className="text-white font-bold text-sm mb-1 group-hover:text-purple-400 truncate">{ep.title}</h4><p className="text-gray-500 text-[10px] font-black uppercase tracking-tighter">{ep.number}</p></div>
                                        </div>
                                    ))}
                                 </div>
                             )}
                        </section>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-8 shadow-2xl backdrop-blur-md">
                        <div>
                            <h4 className="text-[#00bfff] font-black uppercase text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2">
                                <User size={12} /> Director
                            </h4>
                            <p className="text-white font-bold text-lg">{displayMovie.director || 'N/A'}</p>
                        </div>
                        <div>
                            <h4 className="text-[#00bfff] font-black uppercase text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2">
                                <Calendar size={12} /> Release Window
                            </h4>
                            <p className="text-white font-bold text-lg">{displayMovie.year}</p>
                        </div>
                        <div>
                            <h4 className="text-[#00bfff] font-black uppercase text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2">
                                <Clock size={12} /> Runtime
                            </h4>
                            <p className="text-white font-bold text-lg">{displayMovie.duration || '2h 14m'}</p>
                        </div>
                        <div>
                            <h4 className="text-[#00bfff] font-black uppercase text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2">
                                <Star size={12} /> Cinema Grade
                            </h4>
                            <div className="flex items-center gap-2"><Star size={16} className="text-yellow-400" fill="currentColor" /><p className="text-white font-bold text-lg">{displayMovie.rating || '8.4'} <span className="text-gray-600 text-sm">/ 10</span></p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* BIO OVERLAY MODAL */}
        {selectedCastMember && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10 animate-fadeIn">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedCastMember(null)} />
                <div className="relative w-full max-w-4xl bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col md:flex-row transform transition-all duration-500 scale-100">
                    
                    <button onClick={() => setSelectedCastMember(null)} className="absolute top-6 right-6 z-[90] bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors">
                        <X size={20} />
                    </button>

                    <div className="w-full md:w-2/5 shrink-0 bg-gray-900 border-r border-white/5">
                        <img 
                            src={selectedCastMember.imageUrl} 
                            alt={selectedCastMember.name} 
                            className="w-full h-full object-cover md:max-h-full max-h-[40vh]" 
                        />
                    </div>

                    <div className="flex-1 p-8 md:p-12 overflow-y-auto scrollbar-hide bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{selectedCastMember.name}</h2>
                            <p className="text-[#00bfff] font-black text-xs uppercase tracking-[0.2em]">{isTVSeries ? 'Cast Member' : 'Cinema Artist'}</p>
                        </div>

                        {isBioLoading ? (
                            <div className="space-y-4 py-10">
                                <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                                <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                                <div className="h-4 bg-white/5 rounded w-4/6 animate-pulse" />
                            </div>
                        ) : castBio ? (
                            <div className="space-y-10 animate-fadeIn">
                                <div className="grid grid-cols-2 gap-6">
                                    {castBio.birthday && (
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Cake size={12} /> Born</h4>
                                            <p className="text-white font-bold">{castBio.birthday}</p>
                                        </div>
                                    )}
                                    {castBio.place_of_birth && (
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={12} /> Location</h4>
                                            <p className="text-white font-bold">{castBio.place_of_birth}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-[#00bfff] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-6 h-[1px] bg-[#00bfff]" /> The Journey
                                    </h4>
                                    <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
                                        {castBio.biography || `${selectedCastMember.name} is a dedicated professional in the entertainment industry, known for compelling performances and a versatile range across major productions.`}
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-white/5 flex items-center gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Known For</p>
                                        <p className="text-white font-bold">{castBio.known_for_department || 'Acting'}</p>
                                    </div>
                                    <div className="w-[1px] h-8 bg-white/10" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Fan Grade</p>
                                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                                            <Star size={12} fill="currentColor" /> {castBio.popularity?.toFixed(1) || '85.0'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic py-10">Biography details are currently being updated.</p>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal;
