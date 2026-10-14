import React from 'react';
import { TourGuide } from '../../types';
import { TourGuideCard } from './TourGuideCard';
import { Users, RotateCcw } from 'lucide-react';

interface TourGuideGridProps {
  guides: TourGuide[];
  onEnquire?: (guide: TourGuide) => void;
  onResetFilters?: () => void;
}

export const TourGuideGrid: React.FC<TourGuideGridProps> = ({
  guides,
  onEnquire,
  onResetFilters,
}) => {
  if (guides.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#E8E1D5] max-w-xl mx-auto shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#FDEEE9] text-[#D9531E] flex items-center justify-center mx-auto">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#143D24] font-display">
          No Tour Guides Found
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
          We couldn't find any guides matching your active filters. Try broadening the state or language criteria, or clearing specialisations.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 bg-[#143D24] hover:bg-[#0D2818] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {guides.map((guide) => (
        <TourGuideCard
          key={guide.id}
          guide={guide}
          onEnquire={onEnquire}
        />
      ))}
    </div>
  );
};
