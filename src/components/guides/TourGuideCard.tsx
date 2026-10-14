import React, { useState } from 'react';
import { TourGuide } from '../../types';
import { 
  MapPin, 
  Award, 
  Languages, 
  Clock, 
  ShieldCheck, 
  IndianRupee, 
  ExternalLink, 
  MessageSquare, 
  Star, 
  Info,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Ticket
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface TourGuideCardProps {
  guide: TourGuide;
  onEnquire?: (guide: TourGuide) => void;
}

import { FALLBACK_GUIDE_IMAGE } from '../../utils/imageFallback';

export const TourGuideCard: React.FC<TourGuideCardProps> = ({ guide, onEnquire }) => {
  const navigate = useNavigate();
  const { openBookingModal } = useApp();
  const [imgError, setImgError] = useState(false);

  const displayImage = imgError || !guide.profileImage ? FALLBACK_GUIDE_IMAGE : guide.profileImage;

  return (
    <div className="bg-white rounded-2xl border border-[#E0D7C9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header & Photo Banner */}
        <div className="p-5 pb-4 border-b border-gray-100 flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={displayImage}
              alt={guide.displayName}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#174A35]/15 shadow-2xs group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {guide.verificationStatus === 'verified' ? (
              <span 
                className="absolute -bottom-1.5 -right-1.5 bg-[#174A35] text-white p-1 rounded-full shadow-xs"
                title="Verified Local Guide"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            ) : (
              <span 
                className="absolute -bottom-1.5 -right-1.5 bg-amber-600 text-white p-1 rounded-full shadow-xs"
                title="Unverified / Pending Review"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-200" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              {guide.verificationStatus === 'verified' ? (
                <span className="inline-flex items-center gap-1 bg-[#EBF3EE] text-[#174A35] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  <UserCheck className="w-3 h-3 text-[#174A35]" />
                  <span>Verified Guide</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  <span>Community Listing</span>
                </span>
              )}

              {guide.isSampleData && (
                <span className="bg-amber-100 text-amber-800 text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
                  Sample
                </span>
              )}
            </div>

            <h3 
              onClick={() => navigate(`/guides/${guide.id}`)}
              className="font-bold text-lg text-[#1E232A] group-hover:text-[#F07843] transition-colors leading-snug truncate cursor-pointer"
            >
              {guide.displayName}
            </h3>

            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#F07843] shrink-0" />
              <span className="truncate">{guide.city}, {guide.state}</span>
            </p>

            {guide.rating && (
              <div className="flex items-center gap-1 mt-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-[#F07843] text-[#F07843]" />
                <span className="font-bold text-gray-800">{guide.rating.toFixed(1)}</span>
                <span className="text-gray-400">({guide.reviewCount} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5">
          {/* Short Bio */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {guide.shortBio || guide.fullBio}
          </p>

          {/* Experience & Languages Pill Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#174A35] bg-[#FAF8F2] border border-[#E8E1D5] px-2.5 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-[#F07843]" />
              <span>{guide.yearsOfExperience} Years Guiding</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-[#FAF8F2] border border-[#E8E1D5] px-2.5 py-1 rounded-lg">
              <Languages className="w-3 h-3 text-[#174A35]" />
              <span className="truncate max-w-[140px]">{guide.languages.slice(0, 2).join(', ')}{guide.languages.length > 2 ? ` +${guide.languages.length - 2}` : ''}</span>
            </span>
          </div>

          {/* Specialisations Tags */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Areas of Specialisation:
            </span>
            <div className="flex flex-wrap gap-1">
              {guide.specialisations.slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-[#EBF3EE] text-[#174A35] font-medium px-2 py-0.5 rounded-md"
                >
                  {spec}
                </span>
              ))}
              {guide.specialisations.length > 3 && (
                <span className="text-[10px] text-gray-400 font-medium px-1 py-0.5">
                  +{guide.specialisations.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Demonstration Notice */}
          {guide.isSampleData && (
            <div className="p-2 bg-amber-50/80 border border-amber-200/60 rounded-lg flex items-center gap-1.5 text-[10px] text-amber-800">
              <Info className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Sample profile: contact details are demonstration samples.</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 bg-[#FAF8F2] border-t border-[#E8E1D5] flex items-center justify-between gap-2">
        <div>
          {guide.pricePerTour ? (
            <div>
              <span className="text-[10px] text-gray-400 block">Rate from</span>
              <p className="text-sm font-extrabold text-[#174A35]">
                ₹{guide.pricePerTour.toLocaleString()}
                <span className="text-[11px] font-normal text-gray-500"> / tour</span>
              </p>
            </div>
          ) : guide.pricePerHour ? (
            <div>
              <span className="text-[10px] text-gray-400 block">Rate from</span>
              <p className="text-sm font-extrabold text-[#174A35]">
                ₹{guide.pricePerHour.toLocaleString()}
                <span className="text-[11px] font-normal text-gray-500"> / hr</span>
              </p>
            </div>
          ) : (
            <span className="text-xs font-semibold text-gray-500">Custom Rates</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Link
            to={`/guides/${guide.id}`}
            className="text-xs font-bold text-[#174A35] hover:text-[#F07843] px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#E8E1D5] bg-white sm:bg-transparent cursor-pointer"
          >
            Profile
          </Link>

          <button
            onClick={() => onEnquire ? onEnquire(guide) : navigate(`/guides/${guide.id}#enquire`)}
            className="text-xs font-bold text-gray-700 hover:text-[#174A35] px-2.5 py-1.5 rounded-lg transition-colors border border-[#E0D7C9] bg-white hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 text-[#F07843]" />
            <span>Enquire</span>
          </button>

          <button
            onClick={() => openBookingModal({
              id: guide.id,
              title: `${guide.displayName} (Local Tour Guide)`,
              type: 'guide',
              price: guide.pricePerTour || (guide.pricePerHour ? guide.pricePerHour * 4 : 2500),
            })}
            className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Book this guide for a tour"
          >
            <Ticket className="w-3 h-3 text-[#F07843]" />
            <span>Book Tour</span>
          </button>
        </div>
      </div>
    </div>
  );
};
