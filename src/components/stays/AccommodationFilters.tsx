import React, { useState } from 'react';
import { StayCategory } from '../../types';
import { ALL_STATES_AND_UTS } from '../../data/indiaData';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  X,
  IndianRupee,
  Users,
  Check
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  selectedState: string;
  selectedCategory: string;
  maxPrice: number;
  guestCapacity: number;
  selectedAmenities: string[];
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'popular';
}

interface AccommodationFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResultsCount: number;
  availableAmenities: string[];
}

export const CATEGORIES_LIST: (StayCategory | 'All')[] = [
  'All',
  'Homestay',
  'Heritage Stay',
  'Eco-Stay',
  'Plantation Stay',
  'Beach Stay',
  'Mountain Stay',
  'Rural Stay',
  'Guesthouse',
  'Boutique Stay',
];

export const AccommodationFilters: React.FC<AccommodationFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResultsCount,
  availableAmenities,
}) => {
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const handleSearchChange = (val: string) => {
    onChange({ ...filters, searchQuery: val });
  };

  const handleCategoryChange = (cat: string) => {
    onChange({ ...filters, selectedCategory: cat });
  };

  const handleStateChange = (st: string) => {
    onChange({ ...filters, selectedState: st });
  };

  const handlePriceChange = (price: number) => {
    onChange({ ...filters, maxPrice: price });
  };

  const handleCapacityChange = (cap: number) => {
    onChange({ ...filters, guestCapacity: cap });
  };

  const handleSortChange = (sort: FilterState['sortBy']) => {
    onChange({ ...filters, sortBy: sort });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.selectedAmenities.includes(amenity);
    const updated = exists
      ? filters.selectedAmenities.filter((a) => a !== amenity)
      : [...filters.selectedAmenities, amenity];
    onChange({ ...filters, selectedAmenities: updated });
  };

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.selectedState !== 'All' ? 1 : 0) +
    (filters.selectedCategory !== 'All' ? 1 : 0) +
    (filters.maxPrice < 15000 ? 1 : 0) +
    (filters.guestCapacity > 0 ? 1 : 0) +
    filters.selectedAmenities.length;

  return (
    <div className="space-y-4">
      {/* Top Search & Mobile Trigger Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Destination Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by destination (e.g. Coorg, Munnar, Udaipur) or accommodation name..."
              className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843]"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Selects: Sort & Mobile Expand Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span className="font-semibold hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="bg-[#FAF8F2] border border-[#E0D7C9] rounded-lg px-2.5 py-2 text-xs font-medium text-gray-800 focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="popular">Most Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button
              onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
              className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                mobilePanelOpen || activeFilterCount > 0
                  ? 'bg-[#174A35] text-white border-[#174A35]'
                  : 'bg-[#FAF8F2] text-gray-700 border-[#E0D7C9]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Pills (Desktop & Tablet) */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-semibold text-gray-500 mr-1 whitespace-nowrap">Category:</span>
          {CATEGORIES_LIST.map((cat) => {
            const active = filters.selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shadow-2xs ${
                  active
                    ? 'bg-[#174A35] text-white font-bold'
                    : 'bg-[#FAF8F2] text-gray-700 hover:bg-[#EBF3EE] border border-[#E0D7C9]'
                }`}
              >
                {cat === 'All' ? 'All Stays' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Multi-Filter Box (Desktop always visible, Mobile toggleable) */}
      <div
        className={`bg-white rounded-2xl p-5 border border-[#E0D7C9] shadow-xs space-y-5 ${
          mobilePanelOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Location / State Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              State / Union Territory
            </label>
            <select
              value={filters.selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-lg px-3 py-2 text-xs font-medium text-gray-800 focus:outline-hidden focus:border-[#F07843]"
            >
              <option value="All">All Indian States</option>
              {ALL_STATES_AND_UTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Capacity Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Guest Capacity
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[0, 2, 4, 5].map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => handleCapacityChange(cap)}
                  className={`py-1.5 text-xs rounded-lg font-semibold border transition-all text-center ${
                    filters.guestCapacity === cap
                      ? 'bg-[#174A35] text-white border-[#174A35]'
                      : 'bg-[#FAF8F2] text-gray-700 border-[#E0D7C9] hover:bg-gray-100'
                  }`}
                >
                  {cap === 0 ? 'Any' : `${cap}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              <span>Max Nightly Tariff</span>
              <span className="text-[#F07843] font-extrabold normal-case">
                ₹{filters.maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2500}
              max={15000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full accent-[#F07843] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>₹2,500</span>
              <span>₹8,000</span>
              <span>₹15,000+</span>
            </div>
          </div>

          {/* Clear Filters Button & Results Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2">
            <span className="text-xs text-gray-500 font-medium">
              Showing <strong>{totalResultsCount}</strong> stays
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Amenities Checklist Chips */}
        {availableAmenities.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Filter by Special Amenities:
              </span>
              {availableAmenities.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="text-[11px] font-bold text-[#F07843] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{showAllAmenities ? 'Show Less' : `Show All (${availableAmenities.length})`}</span>
                  {showAllAmenities ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(showAllAmenities ? availableAmenities : availableAmenities.slice(0, 8)).map((amenity) => {
                const selected = filters.selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all border cursor-pointer ${
                      selected
                        ? 'bg-[#174A35] text-white border-[#174A35] shadow-2xs font-bold'
                        : 'bg-[#FAF8F2] text-gray-600 border-[#E0D7C9] hover:border-gray-400'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-white inline mr-1" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
