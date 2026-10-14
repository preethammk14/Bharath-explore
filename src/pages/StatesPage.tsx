import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ALL_STATES_AND_UTS, DESTINATIONS } from '../data/indiaData';
import { StateUT, RegionType } from '../types';
import { MapPin, Search, ExternalLink, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { onImageError, FALLBACK_HERITAGE_IMAGE } from '../utils/imageFallback';

export const StatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'state' | 'ut'>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegions = ALL_STATES_AND_UTS.filter((item) => {
    const matchTab = activeTab === 'all' || item.type === activeTab;
    const matchRegion = selectedRegion === 'all' || item.region === selectedRegion;
    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.famousFor.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.keyAttractions.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTab && matchRegion && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D9531E] bg-[#FDEEE9] px-3 py-1 rounded-md mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Sovereign Subdivisions of Bharat</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#143D24] font-display tracking-tight">
            28 States & 8 Union Territories
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            From the Himalayan snow valleys of Ladakh and Kashmir to the emerald shores of Kerala and Tamil Nadu. Discover the authentic cultural heritage, capital cities, traditional arts, and top attractions of every region.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E1D5] shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Primary Type Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'all' ? 'bg-[#143D24] text-white shadow-2xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                All Regions ({ALL_STATES_AND_UTS.length})
              </button>
              <button
                onClick={() => setActiveTab('state')}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'state' ? 'bg-[#143D24] text-white shadow-2xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                28 States
              </button>
              <button
                onClick={() => setActiveTab('ut')}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'ut' ? 'bg-[#143D24] text-white shadow-2xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                8 Union Territories
              </button>
            </div>

            {/* State Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state by name, capital, or craft (e.g. Silk, Tea, Sandalwood)..."
                className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-full pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Region Tabs */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-semibold text-gray-500 mr-2 whitespace-nowrap">Region:</span>
            {['all', 'North', 'South', 'East', 'West', 'North-East', 'Central'].map((r) => {
              const active = selectedRegion === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r as any)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#D9531E] text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r === 'all' ? 'All India' : `${r} India`}
                </button>
              );
            })}
          </div>
        </div>

        {/* States Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegions.map((item) => {
            const destCount = DESTINATIONS.filter((d) => d.stateId === item.id).length;
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/states/${item.id}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Hero photo */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.heroImage}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#143D24] text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {item.region} India • {item.type.toUpperCase()}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-xl font-display leading-tight group-hover:text-[#E89E28] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-white/80">Capital: {item.capital}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Famous for craft pills */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Renowned Heritage & Crafts:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.famousFor.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="bg-[#FAF8F5] text-gray-700 border border-[#E8E1D5] text-[11px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Attractions */}
                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Top Attractions:
                      </span>
                      <p className="text-xs text-gray-700 line-clamp-1 font-medium">
                        {item.keyAttractions.join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#E8E1D5] flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Best: <strong className="text-gray-700">{item.bestTimeToVisit.split('&')[0]}</strong>
                  </span>
                  <span className="text-xs font-bold text-[#D9531E] group-hover:underline flex items-center gap-1">
                    <span>Explore State Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRegions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E1D5] p-8">
            <p className="text-base font-bold text-gray-700">No states or UTs found for "{searchQuery}".</p>
            <p className="text-xs text-gray-500 mt-1">Try clearing your search query or switching regions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
