import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Landmark, Sparkles, Building2, Bed, Users, X, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_STATES_AND_UTS, DESTINATIONS, EXPERIENCES, LOCAL_BUSINESSES, STAYS, SAMPLE_TOUR_GUIDES } from '../../data/indiaData';
import { onImageError, FALLBACK_HERITAGE_IMAGE, FALLBACK_GUIDE_IMAGE, FALLBACK_STAY_IMAGE, FALLBACK_CRAFT_IMAGE } from '../../utils/imageFallback';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search destinations, states (e.g. Rajasthan, Kerala), homestays, experiences or guides...',
  className = '',
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const results = React.useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < 2) return null;

    // 1. Destinations
    const matchedDestinations = DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(normalizedQuery) ||
        d.stateName.toLowerCase().includes(normalizedQuery) ||
        d.category.toLowerCase().includes(normalizedQuery) ||
        d.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
    ).slice(0, 3);

    // 2. Stays (20 curated listings)
    const matchedStays = STAYS.filter(
      (s) =>
        s.name.toLowerCase().includes(normalizedQuery) ||
        s.destination.toLowerCase().includes(normalizedQuery) ||
        s.state.toLowerCase().includes(normalizedQuery) ||
        s.category.toLowerCase().includes(normalizedQuery)
    ).slice(0, 3);

    // 3. States & UTs
    const matchedStates = ALL_STATES_AND_UTS.filter(
      (s) =>
        s.name.toLowerCase().includes(normalizedQuery) ||
        s.region.toLowerCase().includes(normalizedQuery) ||
        s.famousFor.some((f) => f.toLowerCase().includes(normalizedQuery))
    ).slice(0, 3);

    // 4. Experiences
    const matchedExperiences = EXPERIENCES.filter(
      (e) =>
        e.title.toLowerCase().includes(normalizedQuery) ||
        e.type.toLowerCase().includes(normalizedQuery) ||
        e.stateName.toLowerCase().includes(normalizedQuery)
    ).slice(0, 2);

    // 5. Local Businesses
    const matchedBusinesses = LOCAL_BUSINESSES.filter(
      (b) =>
        b.name.toLowerCase().includes(normalizedQuery) ||
        b.category.toLowerCase().includes(normalizedQuery) ||
        b.city.toLowerCase().includes(normalizedQuery) ||
        b.stateName.toLowerCase().includes(normalizedQuery)
    ).slice(0, 2);

    // 6. Local Tour Guides
    const matchedGuides = SAMPLE_TOUR_GUIDES.filter(
      (g) =>
        g.displayName.toLowerCase().includes(normalizedQuery) ||
        g.city.toLowerCase().includes(normalizedQuery) ||
        g.state.toLowerCase().includes(normalizedQuery) ||
        g.specialisations.some((sp) => sp.toLowerCase().includes(normalizedQuery)) ||
        g.languages.some((l) => l.toLowerCase().includes(normalizedQuery))
    ).slice(0, 3);

    const totalCount =
      matchedDestinations.length +
      matchedStays.length +
      matchedStates.length +
      matchedExperiences.length +
      matchedBusinesses.length +
      matchedGuides.length;

    return {
      totalCount,
      destinations: matchedDestinations,
      stays: matchedStays,
      states: matchedStates,
      experiences: matchedExperiences,
      businesses: matchedBusinesses,
      guides: matchedGuides,
    };
  }, [normalizedQuery]);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Bar Input */}
      <div
        className={`flex items-center gap-3 bg-white border border-[#E0D7C9] rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-[#F07843] focus-within:ring-2 focus-within:ring-[#F07843]/20 ${
          compact ? 'px-3 py-1.5' : 'px-4 sm:px-6 py-3 sm:py-3.5'
        }`}
      >
        <Search className={`text-[#F07843] shrink-0 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[#1E232A] text-xs sm:text-sm placeholder-gray-400 focus:outline-hidden"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {!compact && (
          <button
            onClick={() => {
              if (normalizedQuery) {
                navigate(`/destinations?search=${encodeURIComponent(normalizedQuery)}`);
                setIsOpen(false);
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs hover:shadow-sm"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results && results.totalCount > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E8E1D5] overflow-hidden z-50 max-h-[460px] overflow-y-auto animate-fade-in">
          <div className="p-3 bg-[#FAF8F2] border-b border-[#E8E1D5] flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Found {results.totalCount} matching results across India</span>
            <span className="text-[11px] text-[#F07843] font-semibold">Instant Directory Search</span>
          </div>

          {/* Destinations Category */}
          {results.destinations.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="px-3 py-1 text-[11px] font-bold text-[#174A35] uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Tourist Destinations & Heritage</span>
              </div>
              {results.destinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => handleSelect(`/destinations/${dest.id}`)}
                  className="px-3 py-2 rounded-xl hover:bg-[#FAF8F2] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E232A] group-hover:text-[#F07843]">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#174A35]" />
                        <span>{dest.stateName} • {dest.category}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#F07843] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#F07843]" />
                    <span>{dest.rating}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Stays Category */}
          {results.stays.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="px-3 py-1 text-[11px] font-bold text-[#174A35] uppercase tracking-wider flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Homestays & Heritage Stays</span>
              </div>
              {results.stays.map((stay) => (
                <div
                  key={stay.id}
                  onClick={() => handleSelect(`/stays/${stay.id}`)}
                  className="px-3 py-2 rounded-xl hover:bg-[#FAF8F2] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_STAY_IMAGE)}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E232A] group-hover:text-[#F07843]">
                        {stay.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#174A35]" />
                        <span>{stay.destination}, {stay.state} • {stay.category}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#174A35]">₹{stay.pricePerNight.toLocaleString()}/night</span>
                </div>
              ))}
            </div>
          )}

          {/* States & UTs Category */}
          {results.states.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="px-3 py-1 text-[11px] font-bold text-[#174A35] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#174A35]" />
                <span>States & Union Territories</span>
              </div>
              {results.states.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleSelect(`/states/${st.id}`)}
                  className="px-3 py-2 rounded-xl hover:bg-[#FAF8F2] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={st.heroImage}
                      alt={st.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E232A] group-hover:text-[#F07843]">
                        {st.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {st.region} India • Capital: {st.capital}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 capitalize">{st.type}</span>
                </div>
              ))}
            </div>
          )}

          {/* Experiences Category */}
          {results.experiences.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="px-3 py-1 text-[11px] font-bold text-[#174A35] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Local Experiences & Cultural Trails</span>
              </div>
              {results.experiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => handleSelect(`/experiences`)}
                  className="px-3 py-2 rounded-xl hover:bg-[#FAF8F2] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E232A] group-hover:text-[#F07843]">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-gray-500">{exp.stateName} • {exp.duration}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#174A35]">₹{exp.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* Local Tour Guides Category */}
          {results.guides.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="px-3 py-1 text-[11px] font-bold text-[#174A35] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#F07843]" />
                  <span>Local Tour Guides</span>
                </span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {results.guides.length} found
                </span>
              </div>
              {results.guides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => handleSelect(`/guides/${guide.id}`)}
                  className="px-3 py-2 rounded-xl hover:bg-[#FAF8F2] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={guide.profileImage || FALLBACK_GUIDE_IMAGE}
                      alt={guide.displayName}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_GUIDE_IMAGE)}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E232A] group-hover:text-[#F07843]">
                        {guide.displayName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {guide.city}, {guide.state} • {guide.specialisations[0]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#174A35]">
                      {guide.pricePerTour ? `₹${guide.pricePerTour}` : 'Guide'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      {guide.verificationStatus === 'verified' ? 'Verified' : 'Local'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Local Businesses Category */}
          {results.businesses.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1 text-[11px] font-bold text-[#174A35] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#174A35]" />
                <span>Local Guides & Artisan Cooperatives</span>
              </div>
              {results.businesses.map((biz) => (
                <div
                  key={biz.id}
                  onClick={() => handleSelect(`/businesses`)}
                  className="px-3 py-2 rounded-xl hover:bg-[#FAF8F2] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={biz.image}
                      alt={biz.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_CRAFT_IMAGE)}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E232A] group-hover:text-[#F07843]">
                        {biz.name}
                      </h4>
                      <p className="text-xs text-gray-500">{biz.city}, {biz.stateName} • {biz.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#EBF3EE] text-[#174A35] px-2 py-0.5 rounded-md font-bold">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && normalizedQuery.length >= 2 && results?.totalCount === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E8E1D5] p-6 text-center z-50">
          <p className="text-sm text-gray-600 font-medium">
            No matching destinations or businesses found for "{query}".
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try searching for states like "Kerala", monuments like "Hampi", or "Tea Plucking".
          </p>
        </div>
      )}
    </div>
  );
};
