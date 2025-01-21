import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#111111] flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 blur-3xl rounded-full" />
        
        {/* Logo and content */}
        <div className="flex flex-col items-center gap-8 z-10 animate-fade-in">
          {/* Logo
          <div className="w-24 h-24 relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl transform rotate-45" />
            <div className="absolute inset-2 bg-white dark:bg-[#111111] rounded-xl transform rotate-45 flex items-center justify-center">
              <span className="text-3xl font-bold text-emerald-500 transform -rotate-45">V</span>
            </div>
          </div> */}

          {/* Brand name */}
          <div className="text-center opacity-0 animate-fade-in-delay-200">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-transparent bg-clip-text mb-2">
              Volera
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Shop with Artificial Intelligience
            </p>
          </div>

          {/* Loading spinner */}
          <div className="mt-8 opacity-0 animate-fade-in-delay-400">
            <LoadingSpinner size="xl" />
          </div>

          {/* Loading text */}
          <div className="flex flex-col items-center gap-2 opacity-0 animate-fade-in-delay-600">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              Loading your experience
            </p>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
