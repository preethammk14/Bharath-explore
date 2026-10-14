import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IndiaMap } from '../components/map/IndiaMap';
import { ALL_STATES_AND_UTS, DESTINATIONS } from '../data/indiaData';
import { RegionType, DestinationCategory } from '../types';
import { Compass, Filter, MapPin, Landmark, Heart, Star, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { onImageError, FALLBACK_HERITAGE_IMAGE } from '../utils/imageFallback';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useApp();

  const selectedRegion = (searchParams.get('region') as RegionType | 'All') || 'All';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedState = searchParams.get('state') || '';

  const regions: (RegionType | 'All')[] = ['All', 'North', 'South', 'East', 'West', 'North-East', 'Central'];
  const categories: string[] = ['All', 'Historical', 'Nature & Wildlife', 'Spiritual', 'Beach & Coastal', 'Hill Station', 'Adventure'];

  const filteredDestinations = DESTINATIONS.filter((d) => {
    const stateObj = ALL_STATES_AND_UTS.find((s) => s.id === d.stateId);
    const matchRegion = selectedRegion === 'All' || (stateObj && stateObj.region === selectedRegion);
    const matchCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchState = !selectedState || d.stateId === selectedState;
    return matchRegion && matchCategory && matchState;
  });

  const handleRegionChange = (r: RegionType | 'All') => {
    const params = new URLSearchParams(searchParams);
    if (r === 'All') params.delete('region');
    else params.set('region', r);
    params.delete('state');
    setSearchParams(params);
  };

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  const handleStateChange = (stateId: string) => {
    const params = new URLSearchParams(searchParams);
    if (!stateId) params.delete('state');
    else params.set('state', stateId);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D9531E] bg-[#FDEEE9] px-3 py-1 rounded-md mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Spatial Explorer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#143D24] font-display">
            Explore India Across All Regions
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Switch regions, filter by monument style or natural ecology, and explore real geographic coordinates across India.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-xs mb-8 space-y-4">
          {/* Region Tabs */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Filter by Geographical Region:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {regions.map((r) => {
                const active = selectedRegion === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRegionChange(r)}
                    className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#143D24] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-gray-700 hover:bg-[#F3EFEA] border border-[#E8E1D5]'
                    }`}
                  >
                    {r === 'All' ? 'All India' : `${r} India`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters: Category & State */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Type:</span>
              </span>
              {categories.map((c) => {
                const active = selectedCategory === c;
                return (
                  <button
                    key={c}
                    onClick={() => handleCategoryChange(c)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      active
                        ? 'bg-[#D9531E] text-white font-bold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Jump to State:</span>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="text-xs bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-2.5 py-1.5 text-gray-800 font-medium"
              >
                <option value="">All States & UTs</option>
                {ALL_STATES_AND_UTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Map Explorer Area */}
        <div className="mb-12">
          <IndiaMap
            initialStateId={selectedState}
            height="h-[500px] lg:h-[620px]"
            showNearbyPanel={true}
          />
        </div>

        {/* Matched Destinations Grid */}
        <div className="pt-4 border-t border-[#E8E1D5]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#143D24] font-display">
              Matching Destinations ({filteredDestinations.length})
            </h2>
            <span className="text-xs text-gray-500">
              Region: <strong>{selectedRegion}</strong> • Category: <strong>{selectedCategory}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-[#143D24]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                    {dest.category}
                  </span>
                  <button
                    onClick={() => toggleWishlist(dest.id, dest.name)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-[#D9531E]"
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist(dest.id) ? 'fill-[#D9531E] text-[#D9531E]' : ''}`}
                    />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base text-[#1E232A] group-hover:text-[#D9531E] transition-colors leading-snug">
                        {dest.name}
                      </h3>
                      <span className="shrink-0 text-xs font-bold text-[#D9531E] flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-[#D9531E]" />
                        <span>{dest.rating.toFixed(1)}</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-[#143D24]" />
                      <span>{dest.stateName}</span>
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{dest.idealDuration}</span>
                    <button
                      onClick={() => navigate(`/destinations/${dest.id}`)}
                      className="text-xs font-bold text-[#D9531E] hover:underline flex items-center gap-0.5"
                    >
                      <span>Explore Sights</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
