import React from 'react';
import { Stay } from '../../types';
import { ImageGallery } from './ImageGallery';
import { BookingRequestForm } from './BookingRequestForm';
import { 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  CheckCircle, 
  ShieldCheck, 
  Info, 
  Bed, 
  Compass, 
  Star,
  ExternalLink,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { onImageError, FALLBACK_GUIDE_IMAGE } from '../../utils/imageFallback';

interface AccommodationDetailsProps {
  stay: Stay;
  onClose?: () => void;
  isModal?: boolean;
}

export const AccommodationDetails: React.FC<AccommodationDetailsProps> = ({
  stay,
  onClose,
  isModal = false,
}) => {
  const { 
    toggleWishlist, 
    isInWishlist, 
    showToast, 
    stayAvailability, 
    toggleStayAvailability, 
    user 
  } = useApp();

  const isStayAvailable = stayAvailability[stay.id] !== false;
  const isAdminOrHost = user?.role === 'admin' || user?.role === 'host';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Accommodation link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="space-y-8 text-[#1E232A]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0D7C9] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174A35] bg-[#EBF3EE] px-2.5 py-0.5 rounded-md">
              {stay.category}
            </span>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
              isStayAvailable 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              ● {isStayAvailable ? 'Available for Bookings' : 'Currently Unavailable / Booked'}
            </span>

            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#F07843]" />
              <Link to={`/states/${stay.stateId}`} className="hover:underline font-semibold text-gray-700">
                {stay.destination}, {stay.state}
              </Link>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#174A35] font-display">
            {stay.name}
          </h2>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {isModal && (
            <Link
              to={`/stays/${stay.id}`}
              className="text-xs font-bold text-[#174A35] hover:text-[#F07843] flex items-center gap-1.5 border border-[#E0D7C9] px-3 py-1.5 rounded-lg bg-[#FAF8F2] transition-colors"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#FAF8F2] border border-[#E0D7C9] hover:border-[#F07843] text-gray-600 transition-colors cursor-pointer shadow-2xs"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleWishlist(stay.id, stay.name)}
            className="p-2 rounded-xl bg-[#FAF8F2] border border-[#E0D7C9] hover:border-[#F07843] text-gray-600 transition-colors cursor-pointer shadow-2xs"
            title="Save to Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist(stay.id) ? 'fill-[#F07843] text-[#F07843]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Host / Admin Availability Management Strip */}
      {isAdminOrHost && (
        <div className="bg-[#EBF3EE] border border-[#C5DDD0] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#174A35]" />
            <div>
              <span className="font-bold text-[#174A35]">
                {user?.role === 'admin' ? 'Administrator Availability Control' : 'Host Availability Management'}:
              </span>{' '}
              <span className="text-gray-700">
                Current status: <strong>{isStayAvailable ? 'Dates Open & Accepting Guests' : 'Marked as Unavailable'}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleStayAvailability(stay.id, !isStayAvailable)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              isStayAvailable 
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isStayAvailable ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-700" />
                <span>Mark Unavailable</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>Open Availability</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Image Gallery */}
      <ImageGallery images={stay.gallery && stay.gallery.length > 0 ? [stay.image, ...stay.gallery] : [stay.image]} title={stay.name} />

      {/* Main Grid: Info on left, Booking Form on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sample Data Disclaimer Note */}
          {stay.isSampleData && (
            <div className="bg-[#FAF8F2] border border-amber-300/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Sample Demonstration Record:</span> This accommodation listing is an illustrative sample created for testing and project demonstration. No real financial transactions are executed.
              </div>
            </div>
          )}

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F2] p-4 rounded-2xl border border-[#E0D7C9] text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Capacity</span>
              <p className="font-bold text-[#174A35] text-sm mt-0.5 flex items-center gap-1">
                <Users className="w-4 h-4 text-[#F07843]" />
                <span>Up to {stay.guestCapacity} Guests</span>
              </p>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Category</span>
              <p className="font-bold text-[#174A35] text-sm mt-0.5">{stay.category}</p>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Rate from</span>
              <p className="font-bold text-[#F07843] text-sm mt-0.5">₹{stay.pricePerNight.toLocaleString()} / night</p>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Geographic Spot</span>
              <p className="font-bold text-gray-800 text-xs mt-0.5 truncate">
                {stay.coordinates[0].toFixed(2)}°N, {stay.coordinates[1].toFixed(2)}°E
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#174A35] font-display">
              About the Accommodation
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {stay.description}
            </p>
          </div>

          {/* Room types */}
          {stay.roomTypes && stay.roomTypes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#174A35]">Room & Cottage Arrangements</h4>
              <div className="flex flex-wrap gap-2">
                {stay.roomTypes.map((rt, i) => (
                  <span
                    key={i}
                    className="bg-white border border-[#E0D7C9] text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-800"
                  >
                    {rt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Facilities & Amenities Grid */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="text-lg font-bold text-[#174A35] font-display">
              Available Facilities, Amenities & Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {stay.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E0D7C9] rounded-xl p-3 flex items-center gap-2 text-xs text-gray-700 shadow-2xs"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Story */}
          {stay.host && (
            <div className="bg-white rounded-2xl p-5 border border-[#E0D7C9] shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#174A35] font-display">
                Meet Your Host
              </h3>
              <div className="flex items-start gap-4">
                <img
                  src={stay.host.avatar || FALLBACK_GUIDE_IMAGE}
                  alt={stay.host.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => onImageError(e, FALLBACK_GUIDE_IMAGE)}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[#174A35]/15"
                />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-sm text-[#1E232A]">{stay.host.name}</h4>
                  <p className="text-gray-500 font-medium">{stay.host.role} • {stay.host.since}</p>
                  <p className="text-gray-600 leading-relaxed pt-1">{stay.host.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Request Form */}
        <div className="sticky top-24">
          {!isStayAvailable ? (
            <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-sm text-center space-y-3">
              <Calendar className="w-10 h-10 text-red-500 mx-auto" />
              <h4 className="text-base font-bold text-red-900">Dates Currently Unavailable</h4>
              <p className="text-xs text-gray-600">
                This accommodation is fully booked or temporarily seasonal. Please browse other verified stays in this destination or contact the host.
              </p>
              <Link
                to="/stays"
                className="inline-block bg-[#174A35] text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
              >
                Browse Alternative Stays
              </Link>
            </div>
          ) : (
            <BookingRequestForm stay={stay} />
          )}
        </div>
      </div>
    </div>
  );
};
