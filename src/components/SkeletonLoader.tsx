import React from 'react';

interface SkeletonGridProps {
  columns?: number;
  columnsPC?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 4,
  columnsPC,
  columnsTablet,
  columnsMobile,
  count = 8,
}) => {
  const pc = columnsPC ?? columns ?? 4;
  const tablet = columnsTablet ?? 3;
  const mobile = columnsMobile ?? 2;

  const getMobileCol = (c: number) => {
    switch (c) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-2';
    }
  };

  const getTabletCol = (c: number) => {
    switch (c) {
      case 2: return 'sm:grid-cols-2 md:grid-cols-2';
      case 3: return 'sm:grid-cols-3 md:grid-cols-3';
      case 4: return 'sm:grid-cols-4 md:grid-cols-4';
      case 5: return 'sm:grid-cols-5 md:grid-cols-5';
      case 6: return 'sm:grid-cols-6 md:grid-cols-6';
      default: return 'sm:grid-cols-3 md:grid-cols-3';
    }
  };

  const getPCCol = (c: number) => {
    switch (c) {
      case 2: return 'lg:grid-cols-2';
      case 3: return 'lg:grid-cols-3';
      case 4: return 'lg:grid-cols-4';
      case 5: return 'lg:grid-cols-5';
      case 6: return 'lg:grid-cols-6';
      case 7: return 'lg:grid-cols-7';
      case 8: return 'lg:grid-cols-8';
      default: return 'lg:grid-cols-4';
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
      <div className={`grid ${getMobileCol(mobile)} ${getTabletCol(tablet)} ${getPCCol(pc)} gap-4 sm:gap-6`}>
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
