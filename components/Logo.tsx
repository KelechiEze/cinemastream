import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="CineStream Logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#60A5FA" /> {/* Light Blue */}
          <stop offset="100%" stopColor="#2563EB" /> {/* Darker Blue */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Main Blue Circle Body */}
      <circle cx="50" cy="50" r="45" fill="#111" /> {/* Background to match app theme if transparent */}
      
      {/* The Blue Ring/C-shape */}
      <path 
        d="M 50 10 
           A 40 40 0 1 0 90 50 
           L 75 50 
           A 25 25 0 1 1 50 25 
           Z" 
        fill="url(#logoGradient)" 
      />

      {/* The White Accent/Highlight matching the image provided */}
      <path 
        d="M 50 10 
           A 40 40 0 0 0 10 50 
           L 25 50 
           A 25 25 0 0 1 50 25 
           Z" 
        fill="white" 
        opacity="0.9"
      />
      
      {/* Optional slight gloss effect */}
      <circle cx="30" cy="30" r="5" fill="white" opacity="0.1" />
    </svg>
  );
};

export default Logo;