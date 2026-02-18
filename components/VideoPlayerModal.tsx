
import React, { useEffect, useRef, useState } from 'react';
import { 
  X, Play, Pause, Maximize2, Minimize2,
  Volume2, VolumeX, Type, Settings, ChevronLeft, 
  RotateCcw, RotateCw, PlayCircle, Info, Check, 
  ListMusic, Film, Maximize, Minimize,
  PanelRightClose, PanelRightOpen
} from 'lucide-react';
import { Movie, Episode } from '../types';
import { fetchSimilarMovies, fetchTVSeason } from '../services/tmdb';

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
  // Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to fix namespace error in browser environment
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullHeight, setIsFullHeight] = useState(false);
  const [videoFit, setVideoFit] = useState<'contain' | 'cover'>('contain');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [upNextItems, setUpNextItems] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync Fullscreen state
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Control Hiding Logic
  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    
    // Only set timer to hide if video is playing
    if (isPlaying && !showSpeedMenu) {
        hideTimerRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }
  };

  // Trigger timer when isPlaying or showSpeedMenu changes
  useEffect(() => {
    resetHideTimer();
    return () => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying, showSpeedMenu]);

  useEffect(() => {
    const loadUpNext = async () => {
      if (!movie) return;
      setIsLoading(true);
      try {
        const isTV = movie.title.match(/S\d+E\d+/) || (movie.year && movie.year.includes('-'));
        if (isTV && movie.tmdbId) {
          const seasonNum = parseInt(movie.title.match(/S(\d+)/)?.[1] || '1');
          const currentEpNum = parseInt(movie.title.match(/E(\d+)/)?.[1] || '1');
          const episodes = await fetchTVSeason(movie.tmdbId, seasonNum);
          const nextEps = episodes.filter(ep => {
              const epMatch = ep.number.match(/E(\d+)/);
              return epMatch ? parseInt(epMatch[1]) > currentEpNum : false;
          }).slice(0, 6).map(ep => ({
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
          const similar = await fetchSimilarMovies(movie.tmdbId || movie.id, 'movie');
          setUpNextItems(similar.slice(0, 6));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUpNext();
  }, [movie]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const skip = (sec: number) => {
    if (videoRef.current) videoRef.current.currentTime += sec;
    resetHideTimer();
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

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleEnlarge = () => {
    setVideoFit(prev => prev === 'contain' ? 'cover' : 'contain');
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col md:flex-row overflow-hidden animate-fadeIn">
      <div 
        ref={playerRef} 
        onMouseMove={resetHideTimer}
        className={`relative transition-all duration-700 bg-black flex items-center justify-center ${isFullHeight ? 'h-full w-full' : 'h-[50vh] md:h-full w-full md:w-3/4'}`}
      >
        <video 
            ref={videoRef} 
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
            className={`w-full h-full transition-all duration-500 object-${videoFit}`} 
            onTimeUpdate={() => setProgress((videoRef.current!.currentTime / videoRef.current!.duration) * 100)} 
            onLoadedMetadata={() => setDuration(videoRef.current!.duration)} 
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)} 
            playsInline 
            autoPlay 
        />

        {/* UI Overlay */}
        <div className={`absolute inset-0 z-30 transition-all duration-500 flex flex-col justify-between ${showControls ? 'opacity-100 bg-black/40' : 'opacity-0 pointer-events-none'}`}>
          {/* Top Navbar */}
          <div className="p-6 md:p-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={onClose} className="p-3 text-white hover:bg-[#00bfff] rounded-full transition-all active:scale-75 shadow-lg"><ChevronLeft size={28} /></button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-[#00bfff] tracking-[0.4em] uppercase mb-1">CineStream Play</span>
              <h1 className="text-white font-black text-sm md:text-lg uppercase tracking-widest truncate max-w-[200px] text-center">{movie.title}</h1>
            </div>
            <button onClick={() => setIsFullHeight(!isFullHeight)} className={`p-3 rounded-full transition-all ${isFullHeight ? 'text-[#00bfff] bg-white/10' : 'text-white hover:bg-white/10'}`}>
              {isFullHeight ? <PanelRightOpen size={24} /> : <PanelRightClose size={24} />}
            </button>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center justify-center gap-10 md:gap-24">
            <button onClick={() => skip(-10)} className="group flex flex-col items-center gap-3 text-white/60 hover:text-white transform active:scale-50">
              <div className="relative"><RotateCcw size={48} /><span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">10</span></div>
            </button>
            <button onClick={handlePlayPause} className="w-20 h-20 md:w-28 md:h-28 bg-[#00bfff] text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,191,255,0.5)] transform hover:scale-110 transition-all">
              {isPlaying ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" className="ml-3" />}
            </button>
            <button onClick={() => skip(10)} className="group flex flex-col items-center gap-3 text-white/60 hover:text-white transform active:scale-50">
              <div className="relative"><RotateCw size={48} /><span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">10</span></div>
            </button>
          </div>

          {/* Bottom Bar */}
          <div className="p-6 md:p-12 space-y-6 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-black text-gray-400 w-12 text-right font-mono">{formatTime(videoRef.current?.currentTime || 0)}</span>
              <div className="group/seek relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer">
                <div className="absolute top-0 left-0 h-full bg-[#00bfff] rounded-full shadow-[0_0_15px_rgba(0,191,255,1)]" style={{ width: `${progress}%` }} />
                <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              </div>
              <span className="text-[11px] font-black text-gray-400 w-12 font-mono">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-8">
                <button onClick={() => { setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }} className="text-white/70 hover:text-[#00bfff] transition-colors">{isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}</button>
                <button onClick={() => setShowSubtitles(!showSubtitles)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${showSubtitles ? 'bg-[#00bfff] text-white' : 'border-white/10 text-white/40 hover:text-white'}`}><Type size={18} /> <span className="hidden sm:inline">Captions</span></button>
                <button onClick={toggleEnlarge} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${videoFit === 'cover' ? 'bg-[#00bfff] text-white' : 'border-white/10 text-white/40 hover:text-white'}`}>{videoFit === 'contain' ? <Maximize size={18} /> : <Minimize size={18} />} <span className="hidden sm:inline">{videoFit === 'contain' ? 'Enlarge' : 'Fit Screen'}</span></button>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                <div className="relative">
                  <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${speed > 1 ? 'text-[#00bfff] border-[#00bfff]' : 'text-white/40 border-white/10'}`}><Settings size={18} /> <span>{speed}x Speed</span></button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full mb-4 right-0 bg-[#0a0a0a]/95 border border-white/10 rounded-2xl p-2 min-w-[160px] shadow-2xl z-50">
                      {[1, 1.5, 2, 2.5].map((s) => (
                        <button key={s} onClick={() => handleSpeed(s)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition-all ${speed === s ? 'bg-[#00bfff] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{s === 1 ? 'Standard' : `${s}x`} {speed === s && <Check size={14} />}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={toggleFullscreen} className="text-white/40 hover:text-white transition-colors transform active:scale-90">
                  {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isFullHeight && (
        <div className="h-[50vh] md:h-full w-full md:w-1/4 bg-[#0a0a0a] border-t md:border-t-0 md:border-l border-white/5 flex flex-col overflow-hidden animate-fadeIn">
          <div className="p-8 md:p-10 shrink-0 border-b border-white/5 flex items-center gap-3">
                {upNextItems.length > 0 && upNextItems[0].title.includes(' - ') ? <ListMusic size={24} className="text-[#00bfff]" /> : <Film size={24} className="text-[#00bfff]" />}
                <div><h3 className="text-white font-black text-sm uppercase tracking-widest">Up Next</h3><span className="text-[#00bfff] text-[9px] font-black uppercase tracking-widest">Global Discovery</span></div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
            {isLoading ? <div className="h-full flex flex-col items-center justify-center opacity-30"><div className="w-10 h-10 border-4 border-t-[#00bfff] rounded-full animate-spin" /></div> : upNextItems.map((item) => (
              <div key={item.id} className="group flex gap-5 cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all" onClick={() => onSwitchMovie && onSwitchMovie(item)}>
                <div className="relative w-28 md:w-36 aspect-video shrink-0 bg-gray-900 rounded-xl overflow-hidden border border-white/10">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><PlayCircle size={28} className="text-[#00bfff]" /></div>
                </div>
                <div className="flex flex-col justify-center overflow-hidden"><h4 className="text-white font-black text-xs md:text-sm line-clamp-2 uppercase group-hover:text-[#00bfff]">{item.title}</h4><p className="text-gray-500 text-[9px] mt-1 font-bold">{item.year}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerModal;
