
import React, { useEffect, useRef, useState } from 'react';
import { Play, Plus, Info } from 'lucide-react';
import gsap from 'gsap';
import { Movie } from '../types';
import MovieDetailModal from './MovieDetailModal';

interface HeroSliderProps {
    onPlay?: (movie: Movie) => void;
    movies: Movie[];
    recommendations?: Movie[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onPlay, movies, recommendations = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Safety check
  if (!movies || movies.length === 0) return null;

  const currentMovie: Movie = movies[currentIndex] || movies[0];

  useEffect(() => {
    const interval = setInterval(() => {
      // Pause auto-slide if modal is open
      if (!isDetailModalOpen) {
          handleNext();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, movies.length, isDetailModalOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([contentRef.current?.children], { autoAlpha: 0, y: 30 });
      gsap.set(slideRef.current, { scale: 1.1, opacity: 0 });

      gsap.to(slideRef.current, {
        scale: 1,
        opacity: 0.6, // Slightly transparent
        duration: 1.5,
        ease: 'power2.out',
      });

      if (contentRef.current) {
          const children = Array.from(contentRef.current.children);
          gsap.to(children, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.3,
          });
      }
      
    }, containerRef);

    return () => ctx.revert();
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handleDotClick = (index: number) => {
      setCurrentIndex(index);
  }

  const handlePlayClick = () => {
      if (onPlay) onPlay(currentMovie);
  }
  
  const handleReadMore = () => {
      if (onPlay) onPlay(currentMovie); // Reusing onPlay to open detail in App.tsx
  }

  return (
    <div ref={containerRef} className="relative w-full min-h-[85vh] lg:min-h-screen flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-10" />
          
          <img
          ref={slideRef}
          key={currentMovie.imageUrl}
          src={currentMovie.backdropUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
          />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 md:mt-0">
          <div ref={contentRef} className="lg:col-span-7 flex flex-col justify-center">
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-tight md:leading-none drop-shadow-lg">
              {currentMovie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-300 text-xs md:text-sm md:text-base mb-6 md:mb-8 font-medium uppercase tracking-widest">
              <span className="text-[#00bfff] font-bold">{currentMovie.year}</span>
              {currentMovie.genre && currentMovie.genre.length > 0 && (
                  <>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{currentMovie.genre.slice(0, 2).join(', ')}</span>
                  </>
              )}
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] text-white border border-white/20">HD</span>
              {currentMovie.rating && (
                  <>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="text-yellow-400">★ {currentMovie.rating}</span>
                  </>
              )}
          </div>

          <p className="text-gray-400 text-sm md:text-lg max-w-xl mb-8 md:mb-10 leading-relaxed line-clamp-3 md:line-clamp-4 drop-shadow-md">
              {currentMovie.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button 
                  onClick={handlePlayClick}
                  className="w-full sm:w-auto bg-[#00bfff] text-white px-8 md:px-10 py-3 md:py-4 rounded font-bold text-sm tracking-widest uppercase hover:bg-[#009acd] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,191,255,0.3)] hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] transform hover:-translate-y-1"
              >
              <Play size={20} fill="white" />
              <span>Watch Now</span>
              </button>
              <button 
                  onClick={handleReadMore}
                  className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-3 md:py-4 rounded font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 hover:border-white"
              >
              <Info size={20} />
              <span>Read More</span>
              </button>
          </div>
          </div>

          {/* Recommendation Panel */}
          <div className="hidden lg:block lg:col-span-5 self-center">
          <h3 className="text-xl font-medium text-white mb-6 border-l-4 border-[#00bfff] pl-4">Today's Recommendation</h3>
          <div className="grid grid-cols-2 gap-4">
              {recommendations.slice(0, 4).map((rec) => (
              <div key={rec.id} className="relative group overflow-hidden rounded cursor-pointer aspect-video" onClick={() => onPlay && onPlay(rec)}>
                  <img
                  src={rec.imageUrl}
                  alt={rec.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#00bfff] text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                          <Play size={20} fill="white" className="ml-1" />
                      </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs font-bold truncate">{rec.title}</p>
                  </div>
              </div>
              ))}
          </div>
          </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {movies.map((_, idx) => (
              <button 
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#00bfff]' : 'w-4 bg-gray-600 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${idx + 1}`}
              />
          ))}
      </div>
    </div>
  );
};

export default HeroSlider;
