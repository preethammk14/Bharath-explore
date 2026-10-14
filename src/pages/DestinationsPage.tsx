import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DESTINATIONS, ALL_STATES_AND_UTS } from '../data/indiaData';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { Landmark, Search, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

const DISCOVERY_CATEGORIES = [
  'All',
  'Historical Monuments',
  'Temples & Sacred',
  'Beach & Coastal',
  'Hill Stations & Mountains',
  'Nature & Wildlife',
  'Culture & Heritage',
  'Adventure',
];

export const DestinationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialState = searchParams.get('state') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState(initialState);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name' | 'duration'>('rating');

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = d.name.toLowerCase().includes(q);
        const matchState = d.stateName.toLowerCase().includes(q);
        const matchDesc = d.description.toLowerCase().includes(q);
        const matchTags = d.tags.some((t) => t.toLowerCase().includes(q));
        const matchCat = d.category.toLowerCase().includes(q);
        if (!matchName && !matchState && !matchDesc && !matchTags && !matchCat) {
          return false;
        }
      }

      // 2. State Filter
      if (selectedState !== 'All' && d.stateId !== selectedState) {
        return false;
      }

      // 3. Category Filter with intuitive mappings
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Historical Monuments') {
          return d.category === 'Historical' || d.tags.includes('UNESCO') || d.tags.includes('Monuments');
        } else if (selectedCategory === 'Temples & Sacred') {
          return d.category === 'Spiritual' || d.tags.includes('Temple') || d.tags.includes('Ghats') || d.tags.includes('Sacred');
        } else if (selectedCategory === 'Beach & Coastal') {
          return d.category === 'Beach & Coastal' || d.tags.includes('Beach') || d.tags.includes('Coastal') || d.tags.includes('Backwaters') || d.tags.includes('Coral');
        } else if (selectedCategory === 'Hill Stations & Mountains') {
          return d.category === 'Hill Station' || d.tags.includes('Tea') || d.tags.includes('Himalayas') || d.tags.includes('Mountain') || d.tags.includes('High Altitude');
        } else if (selectedCategory === 'Nature & Wildlife') {
          return d.category === 'Nature & Wildlife' || d.tags.includes('Safari') || d.tags.includes('National Park');
        } else if (selectedCategory === 'Culture & Heritage') {
          return d.category === 'Culture & Heritage' || d.tags.includes('Heritage') || d.tags.includes('Living Heritage');
        } else if (selectedCategory === 'Adventure') {
          return d.category === 'Adventure' || d.tags.includes('Trek') || d.tags.includes('Adventure');
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'duration') return a.idealDuration.localeCompare(b.idealDuration);
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, selectedState, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All');
    setSortBy('rating');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedState !== 'All';

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md mb-3 shadow-2xs">
            <Landmark className="w-3.5 h-3.5" />
            <span>Curated Subcontinent Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
            Indian Tourist Destinations
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Discover India’s historical monuments, ancient stone temples, palm-fringed beaches, misty tea valleys, wildlife sanctuaries, and living cultural heritage across every state and union territory.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E0D7C9] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by monument, city, temple, wildlife sanctuary, or tag..."
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-full pl-10 pr-9 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* State filter & Sort */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2.5 text-gray-800 font-medium cursor-pointer focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="All">All States & UTs ({ALL_STATES_AND_UTS.length})</option>
                {ALL_STATES_AND_UTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2.5 text-gray-800 font-medium cursor-pointer focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="duration">Ideal Duration</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-gray-500 hover:text-[#F07843] px-3 py-2 rounded-xl border border-transparent hover:border-[#E0D7C9] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold text-gray-500 mr-1 whitespace-nowrap">Filter by Category:</span>
            {DISCOVERY_CATEGORIES.map((c) => {
              const active = selectedCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer text-xs ${
                    active
                      ? 'bg-[#174A35] text-white font-bold shadow-xs'
                      : 'bg-[#FAF8F2] text-gray-700 hover:bg-[#EBF3EE] border border-[#E0D7C9]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Results Counter */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <strong className="text-[#174A35] font-bold">{filteredDestinations.length}</strong> of {DESTINATIONS.length} tourist destinations
            </span>
            {hasActiveFilters && (
              <span className="text-gray-400">
                Filtered view active
              </span>
            )}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        {/* Empty State */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E0D7C9] p-8 shadow-xs space-y-3 max-w-md mx-auto">
            <p className="text-base font-bold text-gray-700">No destinations found matching your criteria.</p>
            <p className="text-xs text-gray-500">Try broadening your search term or selecting 'All States & UTs'.</p>
            <button
              onClick={handleReset}
              className="mt-2 bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
