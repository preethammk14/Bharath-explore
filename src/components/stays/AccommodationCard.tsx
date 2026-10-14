import React, { useState } from 'react';
import { Stay } from '../../types';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../ui/PriceDisplay';
import { FALLBACK_IMAGE } from './ImageGallery';
import { 
  MapPin, 
  Users, 
  Heart, 
  ExternalLink, 
  CalendarCheck, 
  Sparkles, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface AccommodationCardProps {
  stay: Stay;
  onViewDetails?: (stay: Stay) => void;
  onRequestStay?: (stay: Stay) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  stay,
  onViewDetails,
  onRequestStay,
}) => {
  const { toggleWishlist, isInWishlist } = useApp();
  const [imgError, setImgError] = useState(false);

  const displayImage = imgError || !stay.image ? FALLBACK_IMAGE : stay.image;

  return (
    <div className="bg-white rounded-2xl border border-[#E0D7C9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Photo Container */}
        <div 
          onClick={() => onViewDetails && onViewDetails(stay)}
          className="relative h-56 sm:h-60 overflow-hidden bg-gray-900 cursor-pointer"
        >
          <img
            src={displayImage}
            alt={stay.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[80%]">
            <span className="bg-[#174A35]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
              {stay.category || stay.type}
            </span>

            {stay.isSampleData && (
              <span className="bg-amber-900/80 backdrop-blur-xs text-amber-200 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-amber-500/30">
                Sample Record
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(stay.id, stay.name);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-[#F07843] hover:scale-110 transition-all shadow-xs cursor-pointer"
            aria-label="Save to Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist(stay.id) ? 'fill-[#F07843] text-[#F07843]' : ''}`}
            />
          </button>

          {/* Capacity Pill bottom right of photo */}
          <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#F07843]" />
            <span>Up to {stay.guestCapacity} Guests</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Location & Destination */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#174A35] shrink-0" />
            <span className="font-semibold text-gray-700">{stay.destination}</span>
            <span className="text-gray-300">•</span>
            <span>{stay.state}</span>
          </div>

          {/* Name */}
          <h3
            onClick={() => onViewDetails && onViewDetails(stay)}
            className="font-bold text-lg text-[#1E232A] group-hover:text-[#F07843] transition-colors leading-snug cursor-pointer line-clamp-1 mb-2"
          >
            {stay.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {stay.shortDescription || stay.description}
          </p>

          {/* Amenities Pills */}
          <div className="space-y-1 mb-2">
            <div className="flex flex-wrap gap-1">
              {stay.amenities.slice(0, 3).map((a, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-[#FAF8F2] text-gray-700 border border-[#E8E1D5] px-2 py-0.5 rounded-md font-medium"
                >
                  {a}
                </span>
              ))}
              {stay.amenities.length > 3 && (
                <span className="text-[10px] text-gray-400 font-medium px-1 py-0.5">
                  +{stay.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-4 bg-[#FAF8F2] border-t border-[#E8E1D5] flex items-center justify-between gap-2">
        <PriceDisplay amount={stay.pricePerNight} size="lg" />

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(stay)}
              className="text-xs font-bold text-[#174A35] hover:text-[#F07843] px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#E8E1D5] bg-white sm:bg-transparent cursor-pointer"
            >
              Details
            </button>
          )}

          {onRequestStay && (
            <button
              onClick={() => onRequestStay(stay)}
              className="bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
            >
              Request Stay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
