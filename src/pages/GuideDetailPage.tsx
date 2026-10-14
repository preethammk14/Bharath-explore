import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DESTINATIONS } from '../data/indiaData';
import { TourEnquiryForm } from '../components/guides/TourEnquiryForm';
import { onImageError, FALLBACK_GUIDE_IMAGE, FALLBACK_HERITAGE_IMAGE } from '../utils/imageFallback';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Languages, 
  Award, 
  Phone, 
  Mail, 
  MessageSquare, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  Star, 
  Info,
  Calendar,
  Users,
  Compass,
  Ticket
} from 'lucide-react';

export const GuideDetailPage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();
  const { tourGuides, showToast, openBookingModal } = useApp();

  const guide = tourGuides.find((g) => g.id === guideId);

  const [imgError, setImgError] = useState(false);

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-[#174A35]">Tour Guide Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">
          The requested tour guide profile "{guideId}" does not exist in our directory.
        </p>
        <Link
          to="/guides"
          className="mt-4 inline-block bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-5 py-2.5 rounded-md transition-colors"
        >
          Browse All Local Tour Guides
        </Link>
      </div>
    );
  }

  const displayImage = imgError || !guide.profileImage ? FALLBACK_GUIDE_IMAGE : guide.profileImage;

  // Resolve destinations served into objects
  const servedDestinationObjects = DESTINATIONS.filter((d) =>
    guide.destinationsServed.includes(d.id)
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Guide profile link copied to clipboard!', 'info');
    }
  };

  const handleDirectGuideBooking = () => {
    openBookingModal({
      id: guide.id,
      title: `${guide.displayName} (Local Guide)`,
      type: 'guide',
      price: guide.pricePerTour || (guide.pricePerHour ? guide.pricePerHour * 4 : 2500),
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between text-xs font-bold text-[#174A35]">
          <button
            onClick={() => navigate('/guides')}
            className="hover:text-[#F07843] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tour Guides</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#F07843] text-gray-600 transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
            title="Share Guide Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* SECTION A: PROFILE HEADER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative shrink-0">
              <img
                src={displayImage}
                alt={guide.displayName}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-[#FAF8F2] shadow-md"
              />
              {guide.verificationStatus === 'verified' && (
                <span 
                  className="absolute -bottom-2 -right-2 bg-[#174A35] text-white p-1.5 rounded-full shadow-md"
                  title="Verified Guide"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {guide.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 bg-[#EBF3EE] text-[#174A35] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Tour Guide</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    <span>Pending Verification</span>
                  </span>
                )}

                {guide.isSampleData && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                    Demonstration Profile
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#174A35] font-display">
                {guide.displayName}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#F07843] shrink-0" />
                <span>Base Service Area: <strong>{guide.city}, {guide.state}</strong></span>
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-700">
                <span className="inline-flex items-center gap-1 font-semibold bg-[#FAF8F2] border border-[#E0D7C9] px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-[#F07843]" />
                  <span>{guide.yearsOfExperience} Years Field Experience</span>
                </span>

                <span className="inline-flex items-center gap-1 font-semibold bg-[#FAF8F2] border border-[#E0D7C9] px-3 py-1 rounded-lg">
                  <Languages className="w-3.5 h-3.5 text-[#174A35]" />
                  <span>{guide.languages.join(', ')}</span>
                </span>

                {guide.rating && (
                  <span className="inline-flex items-center gap-1 font-bold text-[#F07843] bg-[#FEF2EC] px-3 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-[#F07843]" />
                    <span>{guide.rating.toFixed(1)} Rating ({guide.reviewCount} Reviews)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action in Header */}
            <div className="shrink-0 flex flex-col sm:items-end gap-2 pt-2 md:pt-0">
              <span className="text-xs text-gray-400">Guiding Rate</span>
              <p className="text-2xl font-extrabold text-[#174A35]">
                {guide.pricePerTour 
                  ? `₹${guide.pricePerTour.toLocaleString()}` 
                  : guide.pricePerHour 
                    ? `₹${guide.pricePerHour.toLocaleString()}/hr` 
                    : 'Custom Quotation'}
              </p>
              <button
                onClick={handleDirectGuideBooking}
                className="bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Book This Guide</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: ABOUT & DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            {/* SECTION B: ABOUT & EXPERTISE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#174A35] font-display flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#F07843]" />
                <span>About & Professional Heritage</span>
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {guide.fullBio || guide.shortBio}
              </p>

              {/* Specialisations Tags */}
              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Areas of Specialisation & Scholarship:
                </span>
                <div className="flex flex-wrap gap-2">
                  {guide.specialisations.map((spec, i) => (
                    <span
                      key={i}
                      className="bg-[#EBF3EE] text-[#174A35] text-xs font-semibold px-3 py-1 rounded-lg"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION C: DESTINATIONS SERVED */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#174A35] font-display flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F07843]" />
                <span>Destinations & Monuments Served</span>
              </h2>

              {servedDestinationObjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {servedDestinationObjects.map((dest) => (
                    <Link
                      key={dest.id}
                      to={`/destinations/${dest.id}`}
                      className="group p-3.5 rounded-2xl border border-[#E0D7C9] hover:border-[#F07843] bg-[#FAF8F2] flex items-center gap-3 transition-all hover:shadow-xs"
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                        className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#174A35] uppercase">
                          {dest.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E232A] group-hover:text-[#F07843] truncate">
                          {dest.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <span>{dest.stateName} •</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{dest.rating}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#FAF8F2] rounded-xl text-xs text-gray-600">
                  Operates tours across <strong>{guide.city}, {guide.state}</strong> and surrounding heritage belts.
                </div>
              )}
            </div>

            {/* SECTION D: TOUR OFFERINGS */}
            {guide.tourOfferings && guide.tourOfferings.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-5">
                <h2 className="text-xl font-bold text-[#174A35] font-display">
                  Signature Tour Offerings ({guide.tourOfferings.length})
                </h2>

                <div className="space-y-4">
                  {guide.tourOfferings.map((tour, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-[#E0D7C9] bg-[#FAF8F2] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="font-bold text-base text-[#174A35]">
                          {tour.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          {tour.price && (
                            <span className="text-base font-extrabold text-[#F07843]">
                              ₹{tour.price.toLocaleString()}
                            </span>
                          )}
                          <button
                            onClick={() =>
                              openBookingModal({
                                id: `${guide.id}-${tour.title.toLowerCase().replace(/\s+/g, '-')}`,
                                title: `${tour.title} (with ${guide.displayName})`,
                                type: 'tour',
                                price: tour.price || guide.pricePerTour || 2500,
                              })
                            }
                            className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                          >
                            Book Tour
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {tour.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#F07843]" />
                          <span>Duration: <strong>{tour.duration}</strong></span>
                        </span>
                        {tour.maxGroupSize && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#174A35]" />
                            <span>Up to <strong>{tour.maxGroupSize} participants</strong></span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: CONTACT & ENQUIRY FORM */}
          <div className="space-y-6">
            {/* BOOKING CTA CARD */}
            <div className="bg-[#174A35] text-white rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="font-bold text-lg font-display flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#F07843]" />
                <span>Reserve Guide Services</span>
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Choose your tour date, number of participants, and preferred language. Request is logged directly in our database without advance deposit.
              </p>
              <button
                onClick={handleDirectGuideBooking}
                className="w-full bg-[#F07843] hover:bg-[#DE632E] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Available Dates Now</span>
              </button>
            </div>

            {/* SECTION E: DIRECT CONTACT CHANNELS */}
            <div className="bg-white rounded-3xl p-6 border border-[#E0D7C9] shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#174A35] font-display flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F07843]" />
                <span>Direct Contact Options</span>
              </h3>

              {guide.isSampleData ? (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sample Demonstration Listing</span>
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Direct phone and WhatsApp links are disabled for demonstration profiles to prevent accidental contact. Please use the booking and enquiry form below.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {guide.contactPhone ? (
                    <a
                      href={`tel:${guide.contactPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#E0D7C9] hover:border-[#174A35] bg-[#FAF8F2] transition-colors font-medium text-gray-800"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Call: {guide.contactPhone}</span>
                    </a>
                  ) : null}

                  {guide.contactEmail ? (
                    <a
                      href={`mailto:${guide.contactEmail}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#E0D7C9] hover:border-[#174A35] bg-[#FAF8F2] transition-colors font-medium text-gray-800"
                    >
                      <Mail className="w-4 h-4 text-[#F07843]" />
                      <span>Email: {guide.contactEmail}</span>
                    </a>
                  ) : null}

                  {guide.preferredContactMethod === 'whatsapp' && guide.contactPhone ? (
                    <a
                      href={`https://wa.me/${guide.contactPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-900 transition-colors font-medium"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  ) : null}
                </div>
              )}

              <p className="text-[11px] text-gray-500">
                Preferred communication: <strong className="capitalize">{guide.preferredContactMethod.replace('_', ' ')}</strong>
              </p>
            </div>

            {/* SECTION F: ENQUIRY FORM */}
            <div id="enquire">
              <TourEnquiryForm guide={guide} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
