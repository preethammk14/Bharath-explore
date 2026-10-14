import React from 'react';
import { Destination } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Clock, ChevronRight, Sparkles } from 'lucide-react';

import { onImageError, FALLBACK_HERITAGE_IMAGE } from '../../utils/imageFallback';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useApp();

  return (
    <div className="group bg-white rounded-2xl border border-[#E0D7C9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Photo Container */}
        <div 
          className="relative h-56 sm:h-60 overflow-hidden bg-gray-900 cursor-pointer" 
          onClick={() => navigate(`/destinations/${destination.id}`)}
        >
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
          />
          <span className="absolute top-3 left-3 bg-[#174A35]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
            {destination.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(destination.id, destination.name);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-[#F07843] hover:scale-110 transition-all shadow-xs cursor-pointer"
            aria-label="Save to Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist(destination.id) ? 'fill-[#F07843] text-[#F07843]' : ''}`}
            />
          </button>
        </div>

        {/* Details Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 
              onClick={() => navigate(`/destinations/${destination.id}`)}
              className="font-bold text-lg text-[#1E232A] group-hover:text-[#F07843] transition-colors leading-snug cursor-pointer line-clamp-1"
            >
              {destination.name}
            </h3>
            <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#F07843] bg-[#FEF2EC] px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-[#F07843]" />
              <span>{destination.rating.toFixed(1)}</span>
            </span>
          </div>

          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#174A35] shrink-0" />
            <span className="truncate">{destination.stateName}</span>
            <span className="text-gray-300">•</span>
            <span className="shrink-0">{destination.idealDuration}</span>
          </p>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {destination.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-1">
            {destination.tags.slice(0, 3).map((t, idx) => (
              <span
                key={idx}
                className="bg-[#FAF8F2] text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#E8E1D5]"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 bg-[#FAF8F2] border-t border-[#E8E1D5] flex items-center justify-between">
        <span className="text-[11px] text-gray-500">
          Best: <strong className="text-gray-700">{destination.bestTimeToVisit.split('&')[0]}</strong>
        </span>
        <button
          onClick={() => navigate(`/destinations/${destination.id}`)}
          className="text-xs font-bold text-[#174A35] group-hover:text-[#F07843] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Explore Sights</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
