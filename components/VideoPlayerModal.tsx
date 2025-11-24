
import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, FastForward, Rewind, Maximize, Volume2, VolumeX, Type, Globe, AlertTriangle, Film, CheckCircle, Unlock } from 'lucide-react';
import { Movie, VideoSource } from '../types';
import { getVideoSource } from '../services/tmdb';

interface VideoPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Custom Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('English');
  
  // Video Source Logic State
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine Source Logic
  useEffect(() => {
    const loadVideoSource = async () => {
        setIsLoading(true);
        if (movie) {
            const source = await getVideoSource(movie);
            setVideoSource(source);
        }
        setIsLoading(false);
    };
    loadVideoSource();
  }, [movie]);

  // --- CUSTOM PLAYER EFFECTS ---
  useEffect(() => {
    // Only auto-play if using custom HTML5 player (not iframe)
    if (videoSource?.source === 'custom' && !isLoading && videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Autoplay blocked", e));
    }
  }, [videoSource, isLoading]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (videoSource?.source !== 'custom') return; // Don't interfere with iframe keys
          if (e.code === 'Space') {
              e.preventDefault();
              togglePlay();
          } else if (e.code === 'ArrowRight') {
              skip(10);
          } else if (e.code === 'ArrowLeft') {
              skip(-10);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, videoSource]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
        setShowControls(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (!showSpeedMenu && !showLanguage && isPlaying && videoSource?.source === 'custom') {
                setShowControls(false);
            }
        }, 3000);
    };
    if (videoSource?.source === 'custom') {
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('click', resetTimer);
    }
    return () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('click', resetTimer);
        clearTimeout(timeout);
    };
  }, [showSpeedMenu, showLanguage, isPlaying, videoSource]);

  // --- CUSTOM PLAYER HANDLERS ---
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
      } else {
          videoRef.current.pause();
          setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
      if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(videoRef.current) {
          const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
          videoRef.current.currentTime = time;
          setProgress(parseFloat(e.target.value));
      }
  };

  const changeSpeed = (newSpeed: number) => {
      if(videoRef.current) {
          videoRef.current.playbackRate = newSpeed;
          setSpeed(newSpeed);
          setShowSpeedMenu(false);
      }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVol = parseFloat(e.target.value);
      setVolume(newVol);
      if (videoRef.current) {
          videoRef.current.volume = newVol;
          setIsMuted(newVol === 0);
      }
  };

  const toggleMute = () => {
      if (videoRef.current) {
          const newMutedState = !isMuted;
          setIsMuted(newMutedState);
          videoRef.current.muted = newMutedState;
          if (!newMutedState && volume === 0) {
              setVolume(0.5);
              videoRef.current.volume = 0.5;
          }
      }
  };

  const skip = (seconds: number) => {
      if(videoRef.current) videoRef.current.currentTime += seconds;
  };

  const toggleFullScreen = () => {
      if(videoRef.current) {
          if (document.fullscreenElement) document.exitFullscreen();
          else videoRef.current.requestFullscreen();
      }
  };

  const formatTime = (time: number) => {
      if (isNaN(time)) return "0:00";
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        
        {/* CLOSE BUTTON (Always visible) */}
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-[110] bg-black/50 p-2 rounded-full hover:bg-[#00bfff] text-white transition-colors border border-white/20"
        >
            <X size={24} />
        </button>

        {isLoading ? (
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 animate-pulse">Checking sources...</p>
            </div>
        ) : (
            <div className="w-full h-full max-w-[1600px] flex flex-col items-center justify-center bg-black relative">
                
                {/* STATUS BAR */}
                {videoSource?.type && (
                    <div className={`absolute top-0 left-0 right-0 px-6 py-3 text-center font-bold z-[105] flex items-center justify-center gap-2 backdrop-blur-md shadow-lg
                        ${videoSource.type === 'public_domain' ? 'bg-green-600/90 text-white' : 
                          videoSource.type === 'official_full' ? 'bg-blue-600/90 text-white' : 
                          'bg-yellow-600/90 text-white'}`}
                    >
                        {videoSource.type === 'public_domain' && <Unlock size={20} />}
                        {videoSource.type === 'official_full' && <CheckCircle size={20} />}
                        {videoSource.type === 'trailer_only' && <Film size={20} />}
                        
                        <span className="uppercase tracking-wide">
                            {videoSource.type === 'public_domain' ? 'Public Domain Full Movie' : 
                             videoSource.type === 'official_full' ? 'Official Full Content' : 
                             'Official Trailer'}
                        </span>
                        
                        {videoSource.warningMessage && (
                            <>
                                <span className="hidden md:inline text-white/50 text-sm font-normal mx-2">|</span>
                                <span className="text-xs md:text-sm font-normal opacity-90">{videoSource.warningMessage}</span>
                            </>
                        )}
                    </div>
                )}

                {videoSource?.source === 'youtube' || videoSource?.source === 'tmdb' ? (
                     /* --- YOUTUBE / TMDB EMBED --- */
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${videoSource.embedCode}?autoplay=1&rel=0&modestbranding=1`} 
                        title={movie.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="aspect-video max-h-screen shadow-2xl"
                    ></iframe>
                ) : videoSource?.source === 'archive.org' ? (
                     /* --- ARCHIVE.ORG EMBED --- */
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={videoSource.embedCode} 
                        title={movie.title} 
                        frameBorder="0" 
                        allow="fullscreen"
                        allowFullScreen
                        className="aspect-video max-h-screen shadow-2xl"
                    ></iframe>
                ) : (
                    /* --- CUSTOM HTML5 PLAYER --- */
                    <div className="relative w-full h-full group">
                        <video 
                            ref={videoRef}
                            src={videoSource?.videoUrl}
                            className="w-full h-full object-contain bg-black"
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onClick={togglePlay}
                        />

                        {/* Top Info Overlay */}
                        <div className={`absolute top-0 left-0 right-0 p-6 pt-16 flex justify-between items-start transition-opacity duration-300 bg-gradient-to-b from-black/80 to-transparent pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                            <div>
                                <h2 className="text-white text-xl font-bold drop-shadow-md">{movie.title}</h2>
                                <p className="text-gray-300 text-sm drop-shadow-md">{movie.year} • {movie.genre?.join(', ')}</p>
                            </div>
                        </div>

                        {/* Big Center Play Button (Paused) */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <button onClick={togglePlay} className="pointer-events-auto bg-black/60 p-6 rounded-full border-2 border-white/50 text-white hover:scale-110 transition-transform">
                                    <Play size={48} fill="white" />
                                </button>
                            </div>
                        )}
                        
                        {/* Language / Translation Overlay */}
                        {showLanguage && (
                            <div className="absolute top-20 right-6 bg-black/90 border border-white/10 rounded-lg p-4 w-64 z-20 animate-fadeIn">
                                <h4 className="text-[#00bfff] font-bold mb-3 flex items-center gap-2"><Globe size={16}/> Audio & Subtitles</h4>
                                <div className="space-y-2">
                                    {['English', 'Spanish', 'French', 'Japanese'].map(lang => (
                                        <button 
                                            key={lang}
                                            onClick={() => { setActiveLanguage(lang); setShowLanguage(false); }}
                                            className={`w-full text-left px-3 py-2 rounded text-sm ${activeLanguage === lang ? 'bg-[#00bfff] text-white' : 'text-gray-300 hover:bg-white/10'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Controls Bar */}
                        <div className={`absolute bottom-0 left-0 right-0 px-6 py-8 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/60 to-transparent ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                            
                            {/* Progress Bar */}
                            <div className="flex items-center gap-4 mb-4 group">
                                <span className="text-xs text-gray-300 font-mono">{formatTime(videoRef.current?.currentTime || 0)}</span>
                                <div className="relative flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group-hover:h-2 transition-all">
                                    <div className="absolute top-0 left-0 h-full bg-[#00bfff] rounded-full" style={{ width: `${progress}%` }}></div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={progress} 
                                        onChange={handleSeek}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                <span className="text-xs text-gray-300 font-mono">{formatTime(duration)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Left Controls */}
                                <div className="flex items-center gap-6">
                                    <button onClick={togglePlay} className="text-white hover:text-[#00bfff] transition-colors">
                                        {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                                    </button>
                                    
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => skip(-10)} className="text-gray-300 hover:text-white transition-colors flex flex-col items-center gap-0.5">
                                            <Rewind size={20} />
                                            <span className="text-[10px] font-bold">-10s</span>
                                        </button>
                                        <button onClick={() => skip(10)} className="text-gray-300 hover:text-white transition-colors flex flex-col items-center gap-0.5">
                                            <FastForward size={20} />
                                            <span className="text-[10px] font-bold">+10s</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 group relative w-32">
                                        <button onClick={toggleMute} className="text-gray-300 hover:text-white">
                                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>
                                        <div className="relative flex-1 h-1 bg-gray-600 rounded-full">
                                            <div className="absolute h-full bg-white rounded-full" style={{ width: `${isMuted ? 0 : volume * 100}%` }}></div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="1" 
                                                step="0.1"
                                                value={isMuted ? 0 : volume} 
                                                onChange={handleVolumeChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Controls */}
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={() => setShowLanguage(!showLanguage)}
                                        className="flex items-center gap-1 text-gray-300 hover:text-[#00bfff] transition-colors bg-white/10 px-3 py-1 rounded text-xs font-bold uppercase"
                                    >
                                        <Globe size={14} />
                                        {activeLanguage.substring(0, 2)}
                                    </button>

                                    <button className="text-gray-300 hover:text-white transition-colors border-b-2 border-dotted border-gray-500 hover:border-white pb-0.5">
                                        <Type size={20} />
                                    </button>

                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                            className="text-white font-bold text-sm w-8 text-center hover:text-[#00bfff] transition-colors"
                                        >
                                            {speed}x
                                        </button>
                                        {showSpeedMenu && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black/90 rounded-lg p-2 flex flex-col gap-1 border border-white/10 min-w-[60px] animate-fadeIn">
                                                {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                                                    <button 
                                                        key={s} 
                                                        onClick={() => changeSpeed(s)}
                                                        className={`px-3 py-2 text-xs font-bold hover:bg-white/20 rounded ${speed === s ? 'text-[#00bfff]' : 'text-white'}`}
                                                    >
                                                        {s}x
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={toggleFullScreen} className="text-white hover:text-[#00bfff] transition-colors">
                                        <Maximize size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default VideoPlayerModal;
