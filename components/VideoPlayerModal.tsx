import React, { useEffect, useRef, useState } from 'react';
import { 
  X, Play, Pause, Maximize2, Minimize2,
  Volume2, VolumeX, Type, Settings, ChevronLeft, 
  RotateCcw, RotateCw, PlayCircle, Info, Check, 
  ListMusic, Film, MoreVertical
} from 'lucide-react';
import { Movie, Episode } from '../types';
import { getVideoSource, fetchSimilarMovies, fetchTVSeason } from '../services/tmdb';

// Helper to format time in seconds to MM:SS or HH:MM:SS
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface VideoPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSwitchMovie?: (movie: Movie) => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ movie, onClose, onSwitchMovie }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullHeight, setIsFullHeight] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [upNextItems, setUpNextItems] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Content Detection & Up Next Logic
  useEffect(() => {
    const loadUpNext = async () => {
      if (!movie) return;
      setIsLoading(true);
      
      try {
        const isTV = movie.title.match(/S\d+E\d+/) || movie.year.includes('-');
        
        if (isTV && movie.tmdbId) {
          // TV Mode: Fetch exactly 6 next episodes
          const seasonNum = parseInt(movie.title.match(/S(\d+)/)?.[1] || '1');
          const currentEpNum = parseInt(movie.title.match(/E(\d+)/)?.[1] || '1');
          const episodes = await fetchTVSeason(movie.tmdbId, seasonNum);
          
          const nextEps = episodes
            .filter(ep => {
                const epMatch = ep.number.match(/E(\d+)/);
                return epMatch ? parseInt(epMatch[1]) > currentEpNum : false;
            })
            .slice(0, 6)
            .map(ep => ({
              id: ep.id,
              tmdbId: movie.tmdbId,
              title: `${ep.number} - ${ep.title}`,
              imageUrl: ep.imageUrl,
              year: movie.year,
              genre: movie.genre,
              duration: '45m',
              backdropUrl: movie.backdropUrl,
              description: ep.overview
            }));
            
          setUpNextItems(nextEps);
        } else {
          // Movie Mode: Fetch similar titles / sequels
          const similar = await fetchSimilarMovies(movie.tmdbId || movie.id, 'movie');
          setUpNextItems(similar.slice(0, 6));
        }
      } catch (e) {
        console.error("Player data error", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUpNext();
  }, [movie]);

  // Auto-hide UI
  useEffect(() => {
    let t: any;
    if (showControls && isPlaying && !showSpeedMenu) {
        t = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(t);
  }, [showControls, isPlaying, showSpeedMenu]);

  // Handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skip = (sec: number) => {
    if (videoRef.current) videoRef.current.currentTime += sec;
    setShowControls(true);
  };

  const handleSpeed = (s: number) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
    setShowSpeedMenu(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
        videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
        setProgress(val);
    }
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col md:flex-row overflow-hidden animate-fadeIn">
      {/* LEFT: VIDEO ENGINE */}
      <div 
        ref={playerRef}
        className={`relative transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] bg-black flex items-center justify-center 
          ${isFullHeight ? 'h-full w-full' : 'h-[50vh] md:h-full w-full md:w-3/4'}`}
        onClick={() => setShowControls(true)}
      >
        <video 
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          className="w-full h-full object-contain"
          onTimeUpdate={() => setProgress((videoRef.current!.currentTime / videoRef.current!.duration) * 100)}
          onLoadedMetadata={() => setDuration(videoRef.current!.duration)}
          onEnded={() => setIsPlaying(false)}
          playsInline
          autoPlay
        />

        {/* Captions */}
        {showSubtitles && isPlaying && (
            <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none z-20 px-10">
                <p className="bg-black/60 text-white px-6 py-2 rounded-xl text-lg md:text-xl font-bold backdrop-blur-md border border-white/10 text-center shadow-2xl">
                    Experience cinematic storytelling at your fingertips.
                </p>
            </div>
        )}

        {/* OVERLAY CONTROLS */}
        <div 
          className={`absolute inset-0 z-30 transition-all duration-500 flex flex-col justify-between 
          ${showControls ? 'opacity-100 bg-black/30' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Top Navbar */}
          <div className="p-6 md:p-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={onClose} className="p-3 text-white hover:bg-[#00bfff] rounded-full transition-all active:scale-75 shadow-lg">
              <ChevronLeft size={28} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-[#00bfff] tracking-[0.4em] uppercase mb-1">CineStream Play</span>
              <h1 className="text-white font-black text-sm md:text-lg uppercase tracking-widest truncate max-w-[200px] md:max-w-2xl text-center">
                {movie.title}
              </h1>
            </div>
            <button 
              onClick={() => setIsFullHeight(!isFullHeight)} 
              className={`p-3 rounded-full transition-all active:scale-75 shadow-lg ${isFullHeight ? 'text-[#00bfff] bg-white/10' : 'text-white hover:bg-white/10'}`}
            >
              {isFullHeight ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
          </div>

          {/* Central Playback */}
          <div className="flex items-center justify-center gap-10 md:gap-24">
            <button onClick={() => skip(-10)} className="group flex flex-col items-center gap-3 text-white/60 hover:text-white transition-all transform active:scale-50">
              <div className="relative">
                <RotateCcw size={48} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">10</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Rewind</span>
            </button>
            
            <button 
              onClick={handlePlayPause} 
              className="w-20 h-20 md:w-28 md:h-28 bg-[#00bfff] text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,191,255,0.5)] transform hover:scale-110 active:scale-90 transition-all"
            >
              {isPlaying ? <Pause size={40} md:size={48} fill="white" /> : <Play size={40} md:size={48} fill="white" className="ml-3" />}
            </button>

            <button onClick={() => skip(10)} className="group flex flex-col items-center gap-3 text-white/60 hover:text-white transition-all transform active:scale-50">
              <div className="relative">
                <RotateCw size={48} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">10</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Forward</span>
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="p-6 md:p-12 space-y-6 bg-gradient-to-t from-black/90 to-transparent">
            {/* Scrubber */}
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-black text-gray-400 w-12 text-right font-mono">{formatTime(videoRef.current?.currentTime || 0)}</span>
              <div className="group/seek relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer">
                <div className="absolute top-0 left-0 h-full bg-[#00bfff] rounded-full shadow-[0_0_15px_rgba(0,191,255,1)]" style={{ width: `${progress}%` }} />
                <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-2xl scale-0 group-hover/seek:scale-100 transition-transform pointer-events-none" style={{ left: `${progress}%`, marginLeft: '-8px' }} />
              </div>
              <span className="text-[11px] font-black text-gray-400 w-12 font-mono">{formatTime(duration)}</span>
            </div>

            {/* Sub Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <button onClick={() => { setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }} className="text-white/70 hover:text-[#00bfff] transition-colors">
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button 
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${showSubtitles ? 'bg-[#00bfff] border-[#00bfff] text-white shadow-lg' : 'border-white/10 text-white/40 hover:border-white hover:text-white'}`}
                >
                  <Type size={18} /> <span className="hidden sm:inline">Captions</span>
                </button>
              </div>

              <div className="flex items-center gap-8">
                <div className="relative">
                  <button 
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all
                      ${speed > 1 ? 'text-[#00bfff] border-[#00bfff]' : 'text-white/40 border-white/10 hover:border-white hover:text-white'}`}
                  >
                    <Settings size={18} className={showSpeedMenu ? 'rotate-90 transition-transform duration-300' : ''} />
                    <span>{speed}x Speed</span>
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full mb-4 right-0 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 min-w-[160px] shadow-2xl animate-fadeIn z-50">
                      {[1, 1.5, 2, 2.5].map((s) => (
                        <button key={s} onClick={() => handleSpeed(s)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition-all ${speed === s ? 'bg-[#00bfff] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                          {s === 1 ? 'Standard' : `${s}x`}
                          {speed === s && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => playerRef.current?.requestFullscreen()} className="text-white/40 hover:text-white transition-colors">
                  <Maximize2 size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: UP NEXT SIDEBAR */}
      {!isFullHeight && (
        <div className="h-[50vh] md:h-full w-full md:w-1/4 bg-[#0a0a0a] border-t md:border-t-0 md:border-l border-white/5 flex flex-col overflow-hidden animate-fadeIn">
          <div className="p-8 md:p-10 shrink-0 border-b border-white/5 flex items-center gap-3">
                {upNextItems.length > 0 && upNextItems[0].title.includes(' - ') ? <ListMusic size={24} className="text-[#00bfff]" /> : <Film size={24} className="text-[#00bfff]" />}
                <div>
                   <h3 className="text-white font-black text-sm uppercase tracking-widest">Up Next</h3>
                   <span className="text-[#00bfff] text-[9px] font-black uppercase tracking-widest">{upNextItems.length > 0 && upNextItems[0].title.includes(' - ') ? 'Season Episodes' : 'Similar Movies'}</span>
                </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-thin">
            {isLoading ? (
               <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6">
                 <div className="w-10 h-10 border-4 border-white/10 border-t-[#00bfff] rounded-full animate-spin" />
               </div>
            ) : upNextItems.map((item) => (
              <div 
                key={item.id} 
                className="group flex gap-5 cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                onClick={() => onSwitchMovie && onSwitchMovie(item)}
              >
                <div className="relative w-28 md:w-36 aspect-video shrink-0 bg-gray-900 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={28} className="text-[#00bfff]" />
                  </div>
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                   <h4 className="text-white font-black text-xs md:text-sm line-clamp-2 leading-tight uppercase group-hover:text-[#00bfff] transition-colors">{item.title}</h4>
                   <p className="text-gray-500 text-[9px] mt-1 font-bold">{item.year} • {item.duration || '4K'}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-8 bg-[#0d0d0d] border-t border-white/5">
             <div className="flex items-center justify-between mb-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <span>Autoplay</span>
                <div className="w-8 h-4 bg-[#00bfff] rounded-full relative p-1 cursor-pointer"><div className="w-2 h-2 bg-white rounded-full absolute right-1 top-1" /></div>
             </div>
             <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-[#00bfff] w-[60%] animate-pulse" /></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerModal;