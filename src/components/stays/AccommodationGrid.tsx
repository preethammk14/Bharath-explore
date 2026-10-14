import React from 'react';
import { Stay } from '../../types';
import { AccommodationCard } from './AccommodationCard';
import { EmptyState } from '../ui/EmptyState';
import { LoadingState } from '../ui/LoadingState';

interface AccommodationGridProps {
  stays: Stay[];
  loading?: boolean;
  onViewDetails: (stay: Stay) => void;
  onRequestStay: (stay: Stay) => void;
  onResetFilters?: () => void;
}

export const AccommodationGrid: React.FC<AccommodationGridProps> = ({
  stays,
  loading = false,
  onViewDetails,
  onRequestStay,
  onResetFilters,
}) => {
  if (loading) {
    return <LoadingState count={6} />;
  }

  if (stays.length === 0) {
    return (
      <EmptyState
        title="No stays found matching your criteria"
        description="Try adjusting your destination search, expanding the price range, or clearing selected amenity filters."
        actionText="Clear All Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {stays.map((stay) => (
        <AccommodationCard
          key={stay.id}
          stay={stay}
          onViewDetails={onViewDetails}
          onRequestStay={onRequestStay}
        />
      ))}
    </div>
  );
};
