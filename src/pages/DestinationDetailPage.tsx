import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DESTINATIONS, STAYS, EXPERIENCES, ALL_STATES_AND_UTS } from '../data/indiaData';
import { 
  MapPin, 
  Heart, 
  Star, 
  Calendar, 
  Clock, 
  Ticket, 
  Plane, 
  CheckCircle2, 
  Sparkles, 
  Bed, 
  ArrowLeft, 
  Share2, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Utensils,
  Lightbulb,
  Sun,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { onImageError, FALLBACK_HERITAGE_IMAGE, FALLBACK_GUIDE_IMAGE, FALLBACK_STAY_IMAGE } from '../utils/imageFallback';

export const DestinationDetailPage: React.FC = () => {
  const { destId } = useParams<{ destId: string }>();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, openBookingModal, reviews, addReview, showToast, user, tourGuides } = useApp();

  const dest = DESTINATIONS.find((d) => d.id === destId);

  const [reviewAuthor, setReviewAuthor] = useState(user?.displayName || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  if (!dest) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-[#174A35]">Destination Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">The requested attraction could not be found.</p>
        <Link to="/destinations" className="mt-4 inline-block bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors">
          Browse All Destinations
        </Link>
      </div>
    );
  }

  // Resolve state metadata
  const stateData = ALL_STATES_AND_UTS.find((s) => s.id === dest.stateId);

  const nearbyStays = STAYS.filter((s) => s.stateId === dest.stateId || s.destinationId === dest.id);
  const nearbyExperiences = EXPERIENCES.filter((e) => e.stateId === dest.stateId || e.destinationId === dest.id);
  const destinationGuides = tourGuides.filter(
    (g) => g.destinationsServed.includes(dest.id) || dest.name.toLowerCase().includes(g.city.toLowerCase())
  );
  const destReviews = reviews.filter((r) => r.targetId === dest.id);

  // Nearby destinations in the same state or nearby states
  const nearbyDestinations = DESTINATIONS.filter(
    (d) => d.id !== dest.id && (d.stateId === dest.stateId || d.category === dest.category)
  ).slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    addReview({
      targetId: dest.id,
      targetType: 'destination',
      authorName: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewComment('');
    setIsReviewOpen(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Destination link copied to clipboard!', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/destinations')}
            className="text-xs font-bold text-[#174A35] hover:text-[#F07843] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Destinations</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#F07843] text-gray-600 hover:text-[#F07843] transition-colors cursor-pointer shadow-2xs"
              title="Share destination"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(dest.id, dest.name)}
              className="p-2 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#F07843] text-gray-600 transition-colors cursor-pointer shadow-2xs"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist(dest.id) ? 'fill-[#F07843] text-[#F07843]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-lg border border-[#E0D7C9]">
          <div className="md:col-span-2 h-[340px] sm:h-[460px] bg-gray-900 relative">
            <img
              src={dest.image}
              alt={dest.name}
              referrerPolicy="no-referrer"
              onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#174A35]/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
              {dest.category}
            </span>
          </div>
          <div className="hidden md:flex flex-col gap-4 h-[460px]">
            {dest.gallery && dest.gallery.length > 0 ? (
              dest.gallery.map((img, idx) => (
                <div key={idx} className="flex-1 bg-gray-900 overflow-hidden relative">
                  <img
                    src={img}
                    alt={`${dest.name} view ${idx}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex-1 bg-gradient-to-br from-[#174A35] to-[#1E232A] p-6 text-white flex flex-col justify-end">
                <Sparkles className="w-8 h-8 text-[#F07843] mb-2" />
                <h4 className="font-bold text-lg font-display">Incredible India Heritage</h4>
                <p className="text-xs text-white/80 mt-1">Preserved under the national cultural registry.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F07843] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-[#174A35]" />
                <Link to={`/states/${dest.stateId}`} className="hover:underline">
                  {dest.stateName}
                </Link>
                <span className="text-gray-300">•</span>
                <span>{dest.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174A35] font-display">
                {dest.name}
              </h1>

              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-bold text-[#F07843] bg-[#FEF2EC] px-2.5 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-[#F07843]" />
                  <span>{dest.rating.toFixed(1)}</span>
                </span>
                <span className="text-gray-500">
                  Based on <strong>{dest.reviewCount.toLocaleString()}</strong> verified traveler evaluations
                </span>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#174A35] font-display">
                Significance & Architectural Overview
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dest.description}
              </p>

              {/* Tags */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {dest.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FAF8F2] text-gray-700 border border-[#E0D7C9] text-xs font-medium px-3 py-1 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* 1. MAJOR ATTRACTIONS & HIGHLIGHTS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#174A35] font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F07843]" />
                <span>Major Attractions & Must-See Sights</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                {dest.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF8F2] border border-[#E0D7C9]/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-xs text-gray-800">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. AUTHENTIC LOCAL FOOD & REGIONAL CUISINE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#174A35] font-display flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#F07843]" />
                <span>Authentic Local Food & Culinary Specialties</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Savor the distinct flavours of {dest.stateName}. From age-old street stalls to authentic community thalis:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {stateData?.famousFor ? (
                  stateData.famousFor.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#F07843] shrink-0 mt-2" />
                      <div>
                        <h5 className="font-bold text-xs text-amber-950">{item}</h5>
                        <p className="text-[11px] text-gray-600 mt-0.5">Renowned regional gastronomic preparation and craft</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 text-xs text-amber-900 col-span-2">
                    Regional thalis, seasonal vegetable dishes, and traditional sweets made with pure jaggery and ghee.
                  </div>
                )}
              </div>
            </div>

            {/* 3. TRAVEL TIPS & CULTURAL GUIDANCE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#174A35] font-display flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#F07843]" />
                <span>Travel Tips & Practical Advice</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E0D7C9] space-y-1.5">
                  <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#174A35]" />
                    <span>Attire & Temple Etiquette</span>
                  </h5>
                  <p className="text-gray-600 leading-relaxed">
                    Wear breathable clothing covering shoulders and knees. Slip-on footwear is recommended as shoes must be removed before entering sanctums.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E0D7C9] space-y-1.5">
                  <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#F07843]" />
                    <span>Best Time for Sightseeing</span>
                  </h5>
                  <p className="text-gray-600 leading-relaxed">
                    Begin monument visits early around 7:00 AM to beat midday heat and capture golden lighting. Evening ceremonies generally begin at dusk (6:00 PM).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E0D7C9] space-y-1.5">
                  <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-[#174A35]" />
                    <span>Ticketing & Official Guides</span>
                  </h5>
                  <p className="text-gray-600 leading-relaxed">
                    Book ASI monument tickets online in advance. Hire verified guides with badge identification for historical epigraphy and verified narratives.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E0D7C9] space-y-1.5">
                  <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#F07843]" />
                    <span>Local Transport & Payments</span>
                  </h5>
                  <p className="text-gray-600 leading-relaxed">
                    UPI digital payments are accepted across most Indian stalls. Carry small cash notes (₹20 to ₹100) for auto-rickshaws, boats, and temple donations.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. NEARBY DESTINATIONS */}
            {nearbyDestinations.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#174A35] font-display flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#F07843]" />
                      <span>Nearby Destinations & Excursions</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Combine your visit with other sights in {dest.stateName} and neighboring belts.
                    </p>
                  </div>
                  <Link
                    to="/destinations"
                    className="text-xs font-bold text-[#F07843] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {nearbyDestinations.map((near) => (
                    <Link
                      key={near.id}
                      to={`/destinations/${near.id}`}
                      className="group block bg-[#FAF8F2] rounded-2xl border border-[#E0D7C9] overflow-hidden hover:border-[#F07843] transition-all hover:shadow-sm"
                    >
                      <div className="h-32 overflow-hidden bg-gray-900">
                        <img
                          src={near.image}
                          alt={near.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3">
                        <span className="text-[10px] font-bold text-[#174A35] uppercase">{near.category}</span>
                        <h4 className="font-bold text-xs text-[#1E232A] group-hover:text-[#F07843] transition-colors truncate">
                          {near.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{near.rating.toFixed(1)} • {near.idealDuration}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Local Tour Guides for this Destination */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#174A35] font-display flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#F07843]" />
                    <span>Local Tour Guides for {dest.name}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Connect directly with licensed regional specialists, archaeologists, and scholars.
                  </p>
                </div>
                <Link
                  to="/guides"
                  className="text-xs font-bold text-[#F07843] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Browse All Guides</span>
                </Link>
              </div>

              {destinationGuides.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinationGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="p-4 rounded-2xl border border-[#E0D7C9] bg-[#FAF8F2] flex flex-col justify-between group hover:border-[#F07843] transition-all hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3.5 mb-3">
                        <img
                          src={guide.profileImage || FALLBACK_GUIDE_IMAGE}
                          alt={guide.displayName}
                          referrerPolicy="no-referrer"
                          onError={(e) => onImageError(e, FALLBACK_GUIDE_IMAGE)}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-bold text-sm text-[#1E232A] group-hover:text-[#F07843] truncate">
                              {guide.displayName}
                            </h4>
                            {guide.verificationStatus === 'verified' && (
                              <span title="Verified Guide">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {guide.city}, {guide.state} • {guide.yearsOfExperience} yrs exp.
                          </p>
                          <p className="text-[11px] text-gray-600 line-clamp-1 mt-1">
                            {guide.specialisations.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
                        <span className="font-extrabold text-[#174A35]">
                          {guide.pricePerTour ? `₹${guide.pricePerTour.toLocaleString()}/tour` : 'Custom Rates'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/guides/${guide.id}`}
                            className="text-xs font-bold text-[#174A35] hover:underline"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() =>
                              openBookingModal({
                                id: guide.id,
                                title: `${guide.displayName} (${dest.name} Tour)`,
                                type: 'guide',
                                price: guide.pricePerTour || 2500,
                              })
                            }
                            className="bg-[#F07843] hover:bg-[#DE632E] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                          >
                            Book Guide
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#FAF8F2] rounded-xl border border-dashed border-[#E0D7C9] text-xs text-gray-600 space-y-2">
                  <p>
                    No verified local guides are currently registered exclusively for <strong>{dest.name}</strong>.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      to="/guides"
                      className="text-xs font-bold text-[#F07843] hover:underline"
                    >
                      Search Regional Guides in {dest.stateName} →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Nearby Stays in this area */}
            {nearbyStays.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
                <h3 className="text-xl font-bold text-[#174A35] font-display flex items-center gap-2">
                  <Bed className="w-5 h-5 text-[#F07843]" />
                  <span>Authentic Stays Near {dest.name}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyStays.map((stay) => (
                    <div
                      key={stay.id}
                      className="bg-[#FAF8F2] rounded-2xl border border-[#E0D7C9] p-4 flex gap-4 items-center shadow-xs hover:shadow-md transition-shadow"
                    >
                      <img
                        src={stay.image}
                        alt={stay.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => onImageError(e, FALLBACK_STAY_IMAGE)}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#174A35] uppercase">
                          {stay.type}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E232A] truncate">{stay.name}</h4>
                        <p className="text-xs text-[#F07843] font-bold mt-1">
                          ₹{stay.pricePerNight.toLocaleString()}{' '}
                          <span className="text-[10px] text-gray-500 font-normal">/ night</span>
                        </p>
                        <button
                          onClick={() =>
                            openBookingModal({
                              id: stay.id,
                              title: stay.name,
                              type: 'stay',
                              price: stay.pricePerNight,
                            })
                          }
                          className="mt-2 text-xs bg-[#174A35] hover:bg-[#0F3324] text-white px-3.5 py-1 rounded-xl font-semibold cursor-pointer shadow-2xs hover:shadow-xs transition-colors"
                        >
                          Request Stay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traveler Reviews & Feedback */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#174A35] font-display">
                    Traveler Reviews & Experiences
                  </h3>
                  <p className="text-xs text-gray-500">First-hand tips from verified travelers.</p>
                </div>
                <button
                  onClick={() => setIsReviewOpen(!isReviewOpen)}
                  className="bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Review Input Box */}
              {isReviewOpen && (
                <form onSubmit={handleReviewSubmit} className="p-5 bg-[#FAF8F2] rounded-2xl border border-[#E0D7C9] space-y-3">
                  <h4 className="font-bold text-xs text-[#174A35]">Share Your Experience at {dest.name}</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Ramesh Iyer"
                      className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReviewRating(r)}
                          className={`text-xs px-2.5 py-1 rounded-md font-bold cursor-pointer flex items-center gap-1 ${
                            reviewRating === r ? 'bg-[#F07843] text-white' : 'bg-white border border-[#E0D7C9] text-gray-700'
                          }`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span>{r}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Comment / Travel Advice</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share best timing, photo spots, or local food recommendations..."
                      className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewOpen(false)}
                      className="text-xs text-gray-500 px-3 py-1 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer shadow-xs"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {destReviews.length > 0 ? (
                  destReviews.map((r) => (
                    <div key={r.id} className="p-4 bg-[#FAF8F2] rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#174A35] text-white text-[10px] font-bold flex items-center justify-center">
                            {r.authorName.charAt(0)}
                          </span>
                          <span className="text-xs font-bold text-gray-800">{r.authorName}</span>
                        </div>
                        <span className="text-xs font-bold text-[#F07843] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#F07843]" />
                          <span>{r.rating}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                      <span className="text-[10px] text-gray-400 mt-2 block">{r.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">No reviews yet. Be the first traveler to write one!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Travel Quick Reference Guide & Actions */}
          <div className="space-y-6 sticky top-24">
            {/* Quick AI Planner Trigger for this Destination */}
            <div className="bg-gradient-to-br from-[#174A35] to-[#0F3324] text-white rounded-3xl p-6 shadow-md space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F07843] bg-white/10 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-[#F07843]" />
                <span>AI Itinerary</span>
              </span>
              <h4 className="font-bold text-base font-display">Plan a Trip to {dest.name}</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Generate a custom day-by-day plan with attractions, thalis, and cost breakdowns in seconds.
              </p>
              <Link
                to={`/planner?destination=${encodeURIComponent(dest.name)}`}
                className="w-full bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold py-2.5 px-4 rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95"
              >
                <span>Generate Itinerary for Here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Essential Logistics Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E0D7C9] shadow-xs space-y-6">
              <h3 className="text-base font-bold text-[#174A35] font-display border-b border-gray-100 pb-3">
                Essential Visitor Logistics
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#F07843] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-500 uppercase text-[10px] block">Best Time to Visit</span>
                    <p className="font-bold text-gray-800">{dest.bestTimeToVisit}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#174A35] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-500 uppercase text-[10px] block">Ideal Duration</span>
                    <p className="font-bold text-gray-800">{dest.idealDuration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-4 h-4 text-[#F07843] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-500 uppercase text-[10px] block">Entry Fee & Permits</span>
                    <p className="font-bold text-gray-800">{dest.entryFee}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Plane className="w-4 h-4 text-[#174A35] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-500 uppercase text-[10px] block">Nearest Transit Hub</span>
                    <p className="font-bold text-gray-800">{dest.nearestHub}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link
                  to={`/states/${dest.stateId}`}
                  className="w-full bg-[#FAF8F2] hover:bg-[#EBF3EE] border border-[#E0D7C9] text-[#174A35] hover:text-[#174A35] text-xs font-bold py-2.5 px-4 rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-2xs hover:shadow-xs"
                >
                  <span>Explore All {dest.stateName} Sights</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
