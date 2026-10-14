import React from 'react';

interface LoadingStateProps {
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden p-0 shadow-xs">
          <div className="h-56 bg-[#FAF8F5] relative" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded-sm w-1/3" />
            <div className="h-6 bg-gray-200 rounded-sm w-3/4" />
            <div className="h-3 bg-gray-200 rounded-sm w-1/2" />
            <div className="h-10 bg-gray-100 rounded-md w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};
