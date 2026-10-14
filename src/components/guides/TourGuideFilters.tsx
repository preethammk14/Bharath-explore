import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  X,
  Languages,
  Award,
  MapPin,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';
import { DESTINATIONS } from '../../data/indiaData';

export interface GuideFilterState {
  searchQuery: string;
  selectedState: string;
  selectedCity: string;
  selectedDestination: string;
  selectedLanguage: string;
  selectedSpecialisation: string;
  maxPrice: number;
  verifiedOnly: boolean;
}

interface TourGuideFiltersProps {
  filters: GuideFilterState;
  onChange: (newFilters: GuideFilterState) => void;
  onReset: () => void;
  totalResultsCount: number;
  availableStates: string[];
  availableCities: string[];
  availableLanguages: string[];
  availableSpecialisations: string[];
}

export const TourGuideFilters: React.FC<TourGuideFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResultsCount,
  availableStates,
  availableCities,
  availableLanguages,
  availableSpecialisations,
}) => {
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.selectedState !== 'All' ? 1 : 0) +
    (filters.selectedCity !== 'All' ? 1 : 0) +
    (filters.selectedDestination !== 'All' ? 1 : 0) +
    (filters.selectedLanguage !== 'All' ? 1 : 0) +
    (filters.selectedSpecialisation !== 'All' ? 1 : 0) +
    (filters.maxPrice < 5000 ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0D7C9] shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
              placeholder="Search by guide name, city, destination, or specialty..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onChange({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Dropdowns on Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {/* State Filter */}
            <select
              value={filters.selectedState}
              onChange={(e) => onChange({ ...filters, selectedState: e.target.value, selectedCity: 'All' })}
              className="text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2.5 text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
            >
              <option value="All">All States ({availableStates.length})</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={filters.selectedLanguage}
              onChange={(e) => onChange({ ...filters, selectedLanguage: e.target.value })}
              className="text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2.5 text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
            >
              <option value="All">All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            {/* Specialisation Filter */}
            <select
              value={filters.selectedSpecialisation}
              onChange={(e) => onChange({ ...filters, selectedSpecialisation: e.target.value })}
              className="text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2.5 text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843] max-w-[170px] truncate"
            >
              <option value="All">All Specialisations</option>
              {availableSpecialisations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Toggle & Clear Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                mobilePanelOpen || activeFilterCount > 0
                  ? 'bg-[#174A35] text-white border-[#174A35]'
                  : 'bg-white text-gray-700 border-[#E0D7C9] hover:bg-[#FAF8F2]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F07843] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="text-xs font-semibold text-gray-500 hover:text-[#F07843] px-3 py-2.5 rounded-xl hover:bg-[#FEF2EC] flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Verified Filter Pill */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Showing <strong className="text-[#174A35] font-bold">{totalResultsCount}</strong> local tour guides</span>
            {activeFilterCount > 0 && <span className="text-gray-400">• {activeFilterCount} active filters</span>}
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
              className="w-4 h-4 rounded text-[#174A35] focus:ring-[#174A35] border-gray-300 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Guides Only</span>
            </span>
          </label>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {mobilePanelOpen && (
        <div className="bg-white rounded-2xl p-5 border border-[#E0D7C9] shadow-md animate-fade-in space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h4 className="font-bold text-sm text-[#174A35] font-display flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F07843]" />
              <span>Advanced Guide Search Filters</span>
            </h4>
            <button
              onClick={() => setMobilePanelOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. State Filter */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                Indian State
              </label>
              <select
                value={filters.selectedState}
                onChange={(e) => onChange({ ...filters, selectedState: e.target.value, selectedCity: 'All' })}
                className="w-full text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl p-2.5 text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="All">All States ({availableStates.length})</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* 2. City Filter */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                City / Region
              </label>
              <select
                value={filters.selectedCity}
                onChange={(e) => onChange({ ...filters, selectedCity: e.target.value })}
                className="w-full text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl p-2.5 text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="All">All Cities ({availableCities.length})</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* 3. Destination Filter */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                Specific Destination
              </label>
              <select
                value={filters.selectedDestination}
                onChange={(e) => onChange({ ...filters, selectedDestination: e.target.value })}
                className="w-full text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl p-2.5 text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="All">All Supported Destinations</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.stateName})</option>
                ))}
              </select>
            </div>

            {/* 4. Language Filter */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                Guide Spoken Language
              </label>
              <select
                value={filters.selectedLanguage}
                onChange={(e) => onChange({ ...filters, selectedLanguage: e.target.value })}
                className="w-full text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl p-2.5 text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="All">Any Language</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            {/* Specialisation Pills */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Specialisation Category
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                <button
                  onClick={() => onChange({ ...filters, selectedSpecialisation: 'All' })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    filters.selectedSpecialisation === 'All'
                      ? 'bg-[#174A35] text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {availableSpecialisations.map((spec) => {
                  const active = filters.selectedSpecialisation === spec;
                  return (
                    <button
                      key={spec}
                      onClick={() => onChange({ ...filters, selectedSpecialisation: spec })}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#F07843] text-white font-bold'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Maximum Tour Budget
                </label>
                <span className="text-xs font-bold text-[#174A35]">
                  {filters.maxPrice >= 5000 ? 'Any Budget' : `Up to ₹${filters.maxPrice.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="250"
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-[#F07843] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹1,000</span>
                <span>₹2,500</span>
                <span>₹5,000+</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={onReset}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setMobilePanelOpen(false)}
              className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Apply & View ({totalResultsCount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
