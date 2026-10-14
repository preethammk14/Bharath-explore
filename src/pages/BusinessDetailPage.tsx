import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { onImageError, FALLBACK_CRAFT_IMAGE } from '../utils/imageFallback';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Ticket, 
  ArrowLeft, 
  Share2, 
  AlertCircle,
  Sparkles,
  Info,
  DollarSign,
  User,
  ExternalLink
} from 'lucide-react';

export const BusinessDetailPage: React.FC = () => {
  const { bizId } = useParams<{ bizId: string }>();
  const navigate = useNavigate();
  const { 
    businesses, 
    user, 
    openBookingModal, 
    approveBusiness, 
    rejectBusiness, 
    updateBusinessAvailability, 
    showToast 
  } = useApp();

  const business = businesses.find((b) => b.id === bizId);

  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (!business) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <Building2 className="w-12 h-12 text-[#F07843] mx-auto" />
          <h2 className="text-2xl font-bold text-[#174A35]">Business Listing Not Found</h2>
          <p className="text-xs text-gray-500">The requested local tourism enterprise or guide guild could not be found.</p>
          <Link
            to="/businesses"
            className="inline-block bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Back to Business Directory
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.uid && business.ownerId === user.uid;
  const isApproved = business.approvalStatus === 'approved' || business.verified;
  const isPending = business.approvalStatus === 'pending';
  const isRejected = business.approvalStatus === 'rejected';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Business link copied to clipboard!', 'info');
    }
  };

  const handleBookService = (serviceName: string, servicePrice?: number) => {
    openBookingModal({
      id: business.id,
      title: `${business.name} - ${serviceName}`,
      type: 'business',
      price: servicePrice || 1500,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/businesses')}
            className="text-xs font-bold text-[#174A35] hover:text-[#F07843] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Local Businesses & Cooperatives</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#F07843] text-gray-600 transition-colors cursor-pointer shadow-2xs"
            title="Share Business Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Administrator / Owner Management Banner */}
        {(isAdmin || isOwner) && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0D7C9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#174A35] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#F07843]" />
                  <span>{isAdmin ? 'Administrator Control Panel' : 'Business Owner Dashboard'}</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isApproved 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : isPending 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  Status: {business.approvalStatus ? business.approvalStatus.toUpperCase() : 'APPROVED'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {isAdmin 
                  ? 'As an administrator, you have permission to review accreditation and approve or reject this listing.'
                  : 'Manage your listing availability status and review visitor booking requests.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && isPending && (
                <>
                  <button
                    onClick={() => approveBusiness(business.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Listing</span>
                  </button>
                  <button
                    onClick={() => rejectBusiness(business.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Reject</span>
                  </button>
                </>
              )}

              {/* Availability Selector */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-500 font-semibold">Availability:</span>
                <select
                  value={business.availabilityStatus || 'available'}
                  onChange={(e) => updateBusinessAvailability(business.id, e.target.value as any)}
                  className="bg-[#FAF8F2] border border-[#E0D7C9] rounded-lg px-2.5 py-1 text-xs font-bold text-[#174A35] cursor-pointer"
                >
                  <option value="available">Available for Bookings</option>
                  <option value="busy">High Demand / Busy</option>
                  <option value="seasonal">Seasonal Operation</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Hero Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0D7C9] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <img
              src={business.image}
              alt={business.name}
              referrerPolicy="no-referrer"
              onError={(e) => onImageError(e, FALLBACK_CRAFT_IMAGE)}
              className="w-full md:w-56 h-56 rounded-2xl object-cover border border-[#E0D7C9] shadow-md shrink-0"
            />

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3 py-1 rounded-md shadow-2xs">
                  {business.category}
                </span>

                {isApproved && (
                  <span className="inline-flex items-center gap-1 bg-[#EBF3EE] text-[#174A35] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Tourism Enterprise</span>
                  </span>
                )}

                {isPending && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pending Admin Approval</span>
                  </span>
                )}

                <span className="text-xs font-semibold text-gray-500 bg-[#FAF8F2] border border-[#E0D7C9] px-2.5 py-1 rounded-md">
                  Est. {business.yearEstablished}
                </span>

                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  business.availabilityStatus === 'busy'
                    ? 'bg-amber-100 text-amber-900'
                    : business.availabilityStatus === 'seasonal'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-emerald-100 text-emerald-900'
                }`}>
                  ● {business.availabilityStatus === 'busy' 
                      ? 'Limited Slots / Busy' 
                      : business.availabilityStatus === 'seasonal' 
                        ? 'Seasonal Schedule' 
                        : 'Open for Bookings'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174A35] font-display">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                <span className="flex items-center gap-1 font-semibold text-[#174A35]">
                  <MapPin className="w-4 h-4 text-[#F07843]" />
                  <span>{business.city}, {business.stateName}</span>
                </span>

                <span className="text-gray-300">•</span>

                <span className="flex items-center gap-1 font-bold text-[#F07843] bg-[#FEF2EC] px-2.5 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-[#F07843]" />
                  <span>{business.rating.toFixed(1)} Rating ({business.reviewCount} Reviews)</span>
                </span>

                {business.priceRange && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="font-semibold text-gray-700">
                      Rates from: <strong>{business.priceRange}</strong>
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed pt-2">
                {business.description}
              </p>

              {/* Specialties */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                  Core Specialties & GI Heritage:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {business.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FAF8F2] text-gray-800 border border-[#E0D7C9] text-xs font-semibold px-3 py-1 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout: Services & Facilities on Left, Contact & Reservation on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: CATALOGUE OF SERVICES & FACILITIES */}
          <div className="lg:col-span-2 space-y-8">
            {/* Supported Bookable Services Catalogue */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#174A35] font-display flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[#F07843]" />
                    <span>Bookable Services & Artisan Masterclasses</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Direct reservation requests with verified enterprise coordinators • Zero commission surcharge
                  </p>
                </div>
              </div>

              {business.availableServices && business.availableServices.length > 0 ? (
                <div className="space-y-4">
                  {business.availableServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#E0D7C9] hover:border-[#F07843] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[#1E232A]">{srv.name}</h4>
                          {srv.duration && (
                            <span className="text-[10px] font-semibold text-[#174A35] bg-[#EBF3EE] px-2 py-0.5 rounded-md">
                              {srv.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{srv.description}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        {srv.price && (
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-gray-400 block">Tariff</span>
                            <span className="text-lg font-extrabold text-[#F07843]">
                              ₹{srv.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => handleBookService(srv.name, srv.price)}
                          className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Request Booking</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">
                    This business offers custom bespoke services tailored to group sizes and visitor requirements:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {business.servicesOffered.map((srv, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E0D7C9] flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-gray-800">{srv}</span>
                        <button
                          onClick={() => handleBookService(srv, 1500)}
                          className="text-xs font-bold text-[#F07843] hover:underline cursor-pointer"
                        >
                          Enquire Service
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Facilities & Infrastructure Offered */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-[#174A35] font-display flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Available Facilities & Amenities</span>
              </h3>
              <p className="text-xs text-gray-600">
                Verified on-site infrastructure available to visiting travelers and study groups:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(business.facilities || [
                  'Direct Artisan Retail Counter',
                  'On-Site Demonstration Space',
                  'UPI & Card Digital Payments',
                  'Drinking Water & Sanitized Restrooms',
                  'English & Regional Language Guides'
                ]).map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F2] border border-[#E0D7C9]/70 text-xs font-medium text-gray-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT COORDINATION & DIRECT BOOKING */}
          <div className="space-y-6">
            {/* Quick Booking Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E0D7C9] shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-2.5 py-0.5 rounded-md">
                  Direct Coordination
                </span>
                <h3 className="text-lg font-bold text-[#174A35] font-display mt-2">
                  Request Service with Host
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Choose an available date and specify your group requirements.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E0D7C9] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Service Area:</span>
                  <strong className="text-gray-800">{business.city}, {business.stateName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Booking Status:</span>
                  <strong className="text-emerald-700">Accepting Online Requests</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Cancellation:</span>
                  <span className="text-gray-700 font-medium">Free cancellation up to 24h</span>
                </div>
              </div>

              <button
                onClick={() => handleBookService(business.servicesOffered[0] || 'General Tour/Service', 1500)}
                className="w-full bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                <span>Submit Direct Booking Request</span>
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                Payment is arranged directly with the enterprise upon arrival.
              </p>
            </div>

            {/* Direct Host Contact Box */}
            <div className="bg-white rounded-3xl p-6 border border-[#E0D7C9] shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-[#174A35] uppercase tracking-wider">
                Direct Contact Information
              </h4>

              <div className="space-y-3 text-xs">
                <a
                  href={`tel:${business.contactPhone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#EBF3EE] transition-colors text-gray-700 border border-[#E0D7C9]"
                >
                  <Phone className="w-4 h-4 text-[#F07843] shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Telephone</span>
                    <span className="font-bold text-[#174A35]">{business.contactPhone}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${business.contactEmail}?subject=Inquiry via BharatExplore: ${encodeURIComponent(business.name)}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F2] hover:bg-[#EBF3EE] transition-colors text-gray-700 border border-[#E0D7C9]"
                >
                  <Mail className="w-4 h-4 text-[#174A35] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 block">Email Address</span>
                    <span className="font-bold text-[#174A35] truncate block">{business.contactEmail}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
