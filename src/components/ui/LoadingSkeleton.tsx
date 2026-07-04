import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'detail';
  lines?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  lines = 1,
  className = '',
}) => {
  const baseClasses = 'relative overflow-hidden bg-gradient-to-r from-pearl/20 via-gold-light/40 to-pearl/20 animate-pulse rounded-luxury-sm';

  if (variant === 'card') {
    return (
      <div className={`flex flex-col gap-4 w-full p-4 border border-gold-primary/10 rounded-luxury-md ${className}`}>
        <div className={`h-48 w-full ${baseClasses}`} />
        <div className={`h-6 w-3/4 ${baseClasses}`} />
        <div className={`h-4 w-1/2 ${baseClasses}`} />
      </div>
    );
  }

  if (variant === 'circle') {
    return <div className={`rounded-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'detail') {
    return (
      <div className={`flex flex-col gap-6 w-full ${className}`}>
        <div className={`h-96 w-full md:w-1/2 ${baseClasses}`} />
        <div className="flex-1 flex flex-col gap-4">
          <div className={`h-8 w-3/4 ${baseClasses}`} />
          <div className={`h-6 w-1/4 ${baseClasses}`} />
          <div className="flex flex-col gap-2">
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className={`h-4 w-4/5 ${baseClasses}`} />
          </div>
        </div>
      </div>
    );
  }

  // Text variant default
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 ${baseClasses}`}
          style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
};
