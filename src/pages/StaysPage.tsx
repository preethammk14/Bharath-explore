import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAYS } from '../data/indiaData';
import { Stay } from '../types';
import { AccommodationFilters, FilterState } from '../components/stays/AccommodationFilters';
import { AccommodationGrid } from '../components/stays/AccommodationGrid';
import { Modal } from '../components/ui/Modal';
import { AccommodationDetails } from '../components/stays/AccommodationDetails';
import { Bed, Sparkles, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StaysPage: React.FC = () => {
  const navigate = useNavigate();
  const { openBookingModal } = useApp();

  // Selected stay for quick modal details view
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);

  // Filter state
  const defaultFilters: FilterState = {
    searchQuery: '',
    selectedState: 'All',
    selectedCategory: 'All',
    maxPrice: 15000,
    guestCapacity: 0,
    selectedAmenities: [],
    sortBy: 'popular',
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Extract all unique amenities across all 20 stays
  const availableAmenities = useMemo(() => {
    const set = new Set<string>();
    STAYS.forEach((s) => s.amenities.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, []);

  // Filtered and sorted stays
  const filteredStays = useMemo(() => {
    return STAYS.filter((stay) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = stay.name.toLowerCase().includes(q);
        const matchesDest = stay.destination.toLowerCase().includes(q);
        const matchesState = stay.state.toLowerCase().includes(q);
        const matchesDesc = stay.description.toLowerCase().includes(q);
        const matchesCategory = stay.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDest && !matchesState && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // 2. State Filter
      if (filters.selectedState !== 'All' && stay.state !== filters.selectedState) {
        return false;
      }

      // 3. Category Filter
      if (filters.selectedCategory !== 'All' && stay.category !== filters.selectedCategory) {
        return false;
      }

      // 4. Max Price Filter
      if (stay.pricePerNight > filters.maxPrice) {
        return false;
      }

      // 5. Guest Capacity Filter
      if (filters.guestCapacity > 0 && stay.guestCapacity < filters.guestCapacity) {
        return false;
      }

      // 6. Amenities Filter
      if (filters.selectedAmenities.length > 0) {
        const hasAllAmenities = filters.selectedAmenities.every((a) =>
          stay.amenities.includes(a)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (filters.sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (filters.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleViewDetails = (stay: Stay) => {
    setSelectedStay(stay);
  };

  const handleRequestStay = (stay: Stay) => {
    openBookingModal({
      id: stay.id,
      title: stay.name,
      type: 'stay',
      price: stay.pricePerNight,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Heading & Intro */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md mb-3 shadow-2xs">
            <Bed className="w-3.5 h-3.5" />
            <span>20 Curated Stays Across India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
            Homestays & Heritage Accommodations
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Discover a diverse selection of 20 sample accommodations across 10+ Indian states: from Coorg coffee estates and Rajasthani havelis to Alleppey coastal homestays and Himalayan cedar cottages.
          </p>

          {/* Academic Transparency Note */}
          <div className="mt-4 p-3 bg-white border border-[#E0D7C9] rounded-xl flex items-start gap-2.5 text-xs text-gray-600 shadow-2xs">
            <Info className="w-4 h-4 text-[#F07843] shrink-0 mt-0.5" />
            <span>
              <strong>Demonstration Notice:</strong> Accommodation records presented in this section are illustrative demonstration samples inspired by real Indian travel destinations. All booking requests are processed in demonstration mode without financial transactions.
            </span>
          </div>
        </div>

        {/* Accommodation Filters */}
        <AccommodationFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalResultsCount={filteredStays.length}
          availableAmenities={availableAmenities}
        />

        {/* Accommodation Grid */}
        <AccommodationGrid
          stays={filteredStays}
          onViewDetails={handleViewDetails}
          onRequestStay={handleRequestStay}
          onResetFilters={handleResetFilters}
        />

        {/* Quick Modal for Stay Details */}
        <Modal
          isOpen={!!selectedStay}
          onClose={() => setSelectedStay(null)}
          title={selectedStay?.name}
          subtitle={`${selectedStay?.destination}, ${selectedStay?.state} • ${selectedStay?.category}`}
          maxWidth="max-w-4xl"
        >
          {selectedStay && (
            <AccommodationDetails
              stay={selectedStay}
              isModal={true}
              onClose={() => setSelectedStay(null)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};
