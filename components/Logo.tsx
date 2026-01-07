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
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="#1a1a1a" />
      
      <path 
        d="M 50 10 
           A 40 40 0 1 0 90 50 
           L 75 50 
           A 25 25 0 1 1 50 25 
           Z" 
        fill="url(#logoGradient)" 
      />

      <path 
        d="M 50 10 
           A 40 40 0 0 0 10 50 
           L 25 50 
           A 25 25 0 0 1 50 25 
           Z" 
        fill="white" 
        opacity="0.9"
      />
      
      <circle cx="50" cy="50" r="12" fill="#60A5FA" opacity="0.3">
        <animate attributeName="r" values="10;14;10" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export default Logo;