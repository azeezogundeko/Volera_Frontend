import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="relative">
      {/* Outer ring */}
      <div
        className={cn(
          'absolute border-4 border-transparent border-t-emerald-500/30 rounded-full animate-spin',
          sizeClasses[size],
          className
        )}
      />
      {/* Inner ring */}
      <div
        className={cn(
          'border-4 border-transparent border-t-emerald-500 rounded-full animate-spin-slow',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
