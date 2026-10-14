import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ALL_STATES_AND_UTS, DESTINATIONS, STAYS } from '../../data/indiaData';
import { Destination, StateUT, DestinationCategory } from '../../types';
import { 
  MapPin, 
  Compass, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Maximize2, 
  RotateCcw,
  Landmark,
  Trees,
  Flame,
  Waves,
  Mountain,
  Heart,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { onImageError, FALLBACK_HERITAGE_IMAGE } from '../../utils/imageFallback';

// Helper component to control map programmatic camera moves
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
}

// Icon generator based on category
const createCustomMarkerIcon = (category: DestinationCategory | 'stay', isSelected: boolean) => {
  let bgColor = '#D9531E'; // Saffron default
  let iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

  if (category === 'Historical') {
    bgColor = '#A84423'; // Terracotta
    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6a3 3 0 0 1 6 0v6"/></svg>';
  } else if (category === 'Nature & Wildlife') {
    bgColor = '#143D24'; // Deep forest
    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-4 4.3a1 1 0 0 0 .8 1.7H10l-3 3.3a1 1 0 0 0 .7 1.7H10"/></svg>';
  } else if (category === 'Spiritual') {
    bgColor = '#D97706'; // Golden amber
    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  } else if (category === 'Beach & Coastal') {
    bgColor = '#0284C7'; // Ocean blue
    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>';
  } else if (category === 'Hill Station' || category === 'Adventure') {
    bgColor = '#4F46E5'; // Indigo/Mountain
    iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>';
  }

  const pulseRing = isSelected ? `
    <div style="position: absolute; top: -6px; left: -6px; width: 44px; height: 44px; border-radius: 50%; border: 2px solid ${bgColor}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>
  ` : '';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        ${pulseRing}
        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${bgColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

interface IndiaMapProps {
  onSelectState?: (state: StateUT) => void;
  initialStateId?: string;
  selectedCategory?: string;
  height?: string;
  showNearbyPanel?: boolean;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  onSelectState,
  initialStateId,
  selectedCategory: initialCategory = 'All',
  height = 'h-[580px] lg:h-[680px]',
  showNearbyPanel = true,
}) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedStateId, setSelectedStateId] = useState<string>(initialStateId || '');
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);

  // Map center & zoom: Default pan over all of India
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(5);

  // Handle selected state updates
  useEffect(() => {
    if (selectedStateId) {
      const matched = ALL_STATES_AND_UTS.find((s) => s.id === selectedStateId);
      if (matched) {
        setMapCenter(matched.coordinates);
        setMapZoom(7);
        if (onSelectState) onSelectState(matched);
      }
    }
  }, [selectedStateId, onSelectState]);

  // Filtered destinations
  const visibleDestinations = useMemo(() => {
    return DESTINATIONS.filter((dest) => {
      const matchState = !selectedStateId || dest.stateId === selectedStateId;
      const matchCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Historical' && dest.category === 'Historical') ||
        (activeCategory === 'Nature' && dest.category === 'Nature & Wildlife') ||
        (activeCategory === 'Spiritual' && dest.category === 'Spiritual') ||
        (activeCategory === 'Beach' && dest.category === 'Beach & Coastal') ||
        (activeCategory === 'Hills' && (dest.category === 'Hill Station' || dest.category === 'Adventure'));
      return matchState && matchCategory;
    });
  }, [selectedStateId, activeCategory]);

  // Nearby attractions calculation when a destination is selected
  const nearbyAttractions = useMemo(() => {
    if (!activeDestination) return [];
    return DESTINATIONS.filter(
      (d) => d.id !== activeDestination.id && (d.stateId === activeDestination.stateId || Math.abs(d.coordinates[0] - activeDestination.coordinates[0]) < 2.5)
    ).slice(0, 4);
  }, [activeDestination]);

  const resetIndiaView = () => {
    setSelectedStateId('');
    setActiveDestination(null);
    setMapCenter([22.5937, 78.9629]);
    setMapZoom(5);
  };

  const selectedStateObj = useMemo(() => {
    return ALL_STATES_AND_UTS.find((s) => s.id === selectedStateId);
  }, [selectedStateId]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-[#E8E1D5] bg-[#FAF8F5]">
      {/* Top Filter & Region Navigation Header */}
      <div className="bg-[#FAF8F5] border-b border-[#E8E1D5] p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 z-20 relative">
        {/* Left: Region / State Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#143D24]">
            <Compass className="w-4 h-4 text-[#D9531E]" />
            <span>Select Region:</span>
          </div>

          <select
            value={selectedStateId}
            onChange={(e) => {
              setSelectedStateId(e.target.value);
            }}
            className="text-xs sm:text-sm bg-white border border-[#D5CEBF] rounded-md px-3 py-1.5 font-medium text-[#1E232A] shadow-xs focus:ring-2 focus:ring-[#D9531E] focus:outline-hidden"
          >
            <option value="">All India (28 States & 8 UTs)</option>
            <optgroup label="States">
              {ALL_STATES_AND_UTS.filter((s) => s.type === 'state').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.region})
                </option>
              ))}
            </optgroup>
            <optgroup label="Union Territories">
              {ALL_STATES_AND_UTS.filter((s) => s.type === 'ut').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          </select>

          {selectedStateId && (
            <button
              onClick={resetIndiaView}
              className="text-xs bg-[#EBF3EE] hover:bg-[#DCEAE1] text-[#143D24] px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
              title="Reset View to all India"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Full India</span>
            </button>
          )}
        </div>

        {/* Right: Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'All', label: 'All Sights', icon: Layers },
            { id: 'Historical', label: 'Heritage', icon: Landmark },
            { id: 'Nature', label: 'Wild & Nature', icon: Trees },
            { id: 'Spiritual', label: 'Spiritual', icon: Flame },
            { id: 'Beach', label: 'Coastal', icon: Waves },
            { id: 'Hills', label: 'Himalayas & Hills', icon: Mountain },
          ].map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 whitespace-nowrap transition-all shadow-2xs ${
                  active
                    ? 'bg-[#143D24] text-white shadow-sm'
                    : 'bg-white hover:bg-[#F3EFEA] text-[#4A5568] border border-[#E8E1D5]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#E89E28]' : 'text-gray-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Box */}
      <div className={`relative w-full ${height}`}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          minZoom={4}
          maxZoom={12}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Clean, high-performance OpenStreetMap Carto tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Destination Markers */}
          {visibleDestinations.map((dest) => {
            const isSelected = activeDestination?.id === dest.id;
            return (
              <Marker
                key={dest.id}
                position={dest.coordinates}
                icon={createCustomMarkerIcon(dest.category, isSelected)}
                eventHandlers={{
                  click: () => {
                    setActiveDestination(dest);
                  },
                }}
              >
                <Popup className="custom-destination-popup">
                  <div className="w-[260px] sm:w-[280px] p-0 font-sans">
                    <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {dest.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(dest.id, dest.name);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-[#D9531E] transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${isInWishlist(dest.id) ? 'fill-[#D9531E] text-[#D9531E]' : ''}`}
                        />
                      </button>
                    </div>

                    <div className="p-3">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="font-bold text-sm text-[#1E232A] leading-snug">
                          {dest.name}
                        </h4>
                        <span className="flex items-center gap-1 text-xs font-bold text-[#D9531E] shrink-0 bg-[#FDEEE9] px-1.5 py-0.5 rounded-sm">
                          <Star className="w-3 h-3 fill-[#D9531E]" />
                          <span>{dest.rating.toFixed(1)}</span>
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-[#143D24]" />
                        <span>{dest.stateName}</span>
                      </p>

                      <p className="text-[11px] text-gray-600 line-clamp-2 mb-3">
                        {dest.description}
                      </p>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => navigate(`/destinations/${dest.id}`)}
                          className="flex-1 bg-[#D9531E] hover:bg-[#C84B16] text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Explore Sights</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStateId(dest.stateId);
                          }}
                          className="text-xs bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#143D24] border border-[#D5CEBF] font-medium py-1.5 px-2 rounded-lg text-center transition-colors"
                          title="View all in this State"
                        >
                          State Hub
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Quick Stats Over Map */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-3 border border-[#E8E1D5] shadow-lg max-w-[280px] hidden sm:block">
          <div className="flex items-center gap-2 text-xs font-bold text-[#143D24] mb-1">
            <Sparkles className="w-4 h-4 text-[#E89E28]" />
            <span>Interactive Map Active</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-tight">
            Showing <strong className="text-[#D9531E]">{visibleDestinations.length}</strong> verified cultural sights across India. Click any marker to view details and nearby activities.
          </p>
        </div>

        {/* Selected State Banner Overlay if state selected */}
        {selectedStateObj && (
          <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-[#143D24]/20 shadow-lg max-w-xs sm:max-w-sm animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9531E] bg-[#FDEEE9] px-2 py-0.5 rounded-md">
                  {selectedStateObj.region} India • {selectedStateObj.type.toUpperCase()}
                </span>
                <h3 className="font-bold text-base text-[#143D24] mt-1 font-display">
                  {selectedStateObj.name}
                </h3>
                <p className="text-xs text-gray-500">Capital: {selectedStateObj.capital}</p>
              </div>
              <button
                onClick={() => navigate(`/states/${selectedStateObj.id}`)}
                className="shrink-0 text-xs bg-[#143D24] hover:bg-[#0D2B1A] text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
              >
                <span>State Guide</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-gray-600 mt-2 line-clamp-2">
              {selectedStateObj.description}
            </p>
          </div>
        )}
      </div>

      {/* Nearby Attractions Companion Bar */}
      {showNearbyPanel && activeDestination && nearbyAttractions.length > 0 && (
        <div className="bg-[#FAF8F5] border-t border-[#E8E1D5] p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D9531E]" />
              <h4 className="text-xs sm:text-sm font-bold text-[#143D24]">
                Nearby Sights & Experiences around {activeDestination.name}
              </h4>
            </div>
            <button
              onClick={() => setActiveDestination(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {nearbyAttractions.map((nearby) => (
              <div
                key={nearby.id}
                onClick={() => {
                  setActiveDestination(nearby);
                  setMapCenter(nearby.coordinates);
                  setMapZoom(9);
                }}
                className="group cursor-pointer bg-white rounded-lg p-2 border border-[#E8E1D5] hover:border-[#D9531E] transition-all flex items-center gap-2 shadow-2xs"
              >
                <img
                  src={nearby.image}
                  alt={nearby.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                  className="w-10 h-10 rounded-md object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-[#1E232A] truncate group-hover:text-[#D9531E]">
                    {nearby.name}
                  </h5>
                  <p className="text-[10px] text-gray-500 truncate">{nearby.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
