import React from 'react';

interface SkeletonGridProps {
  columns?: number;
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ columns = 4, count = 8 }) => {
  // Compute column class
  const getColClass = (cols: number) => {
    switch (cols) {
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 sm:grid-cols-3';
      case 4:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
      case 5:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center justify-center mb-8 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-white/40 backdrop-blur-md shadow-md mb-4" />
        <div className="h-7 w-64 bg-white/50 rounded-lg mb-2" />
        <div className="h-5 w-48 bg-white/40 rounded-lg" />
      </div>

      {/* Grid of Square Cards Skeleton */}
      <div className={`grid ${getColClass(columns)} gap-4 sm:gap-6`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="aspect-square rounded-3xl bg-white/40 backdrop-blur-md p-4 flex flex-col items-center justify-center shadow-lg border border-white/50 animate-pulse relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/30 to-transparent animate-shimmer" />
            <div className="w-16 h-16 rounded-2xl bg-slate-200/60 mb-3" />
            <div className="h-4 w-3/4 bg-slate-200/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
