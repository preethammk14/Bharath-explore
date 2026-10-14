import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DESTINATIONS, STAYS, EXPERIENCES } from '../data/indiaData';
import { Heart, Trash2, ArrowRight, MapPin, Landmark, Bed, Sparkles, ExternalLink } from 'lucide-react';
import { onImageError, FALLBACK_HERITAGE_IMAGE, FALLBACK_STAY_IMAGE } from '../utils/imageFallback';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, openBookingModal } = useApp();
  const navigate = useNavigate();

  // Resolve items in wishlist
  const savedDestinations = DESTINATIONS.filter((d) => wishlist.includes(d.id));
  const savedStays = STAYS.filter((s) => wishlist.includes(s.id));
  const savedExperiences = EXPERIENCES.filter((e) => wishlist.includes(e.id));

  const totalSaved = savedDestinations.length + savedStays.length + savedExperiences.length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D9531E] bg-[#FDEEE9] px-3 py-1 rounded-md mb-3">
              <Heart className="w-3.5 h-3.5 fill-[#D9531E]" />
              <span>Personal Itinerary & Bucket List</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#143D24] font-display tracking-tight">
              My Saved Wishlist ({totalSaved})
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Your saved cultural wonders, heritage homestays, and regional experiences across India.
            </p>
          </div>

          {totalSaved > 0 && (
            <Link
              to="/explore"
              className="text-xs sm:text-sm font-bold text-[#D9531E] hover:underline flex items-center gap-1"
            >
              <span>Explore More Places on Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {totalSaved === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E1D5] max-w-xl mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FDEEE9] text-[#D9531E] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#143D24] font-display mb-2">
              Your Wishlist is Currently Empty
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Browse through our interactive India map, iconic historical monuments, or authentic backwater homestays and click the heart icon to save them here!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/explore"
                className="bg-[#143D24] hover:bg-[#0D2B1A] text-white text-xs font-bold px-5 py-2.5 rounded-md transition-colors"
              >
                Explore India Map
              </Link>
              <Link
                to="/destinations"
                className="bg-[#D9531E] hover:bg-[#C84B16] text-white text-xs font-bold px-5 py-2.5 rounded-md transition-colors"
              >
                Browse Destinations
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Saved Destinations */}
            {savedDestinations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#143D24] font-display mb-4 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#D9531E]" />
                  <span>Destinations & Monuments ({savedDestinations.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs p-4 flex gap-4 items-center group"
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#143D24] uppercase">
                          {dest.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E232A] truncate group-hover:text-[#D9531E]">
                          {dest.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">{dest.stateName}</p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/destinations/${dest.id}`)}
                            className="text-xs bg-[#143D24] text-white px-3 py-1 rounded-md font-semibold"
                          >
                            Explore Sights
                          </button>
                          <button
                            onClick={() => toggleWishlist(dest.id, dest.name)}
                            className="text-gray-400 hover:text-red-600 p-1"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Stays */}
            {savedStays.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#143D24] font-display mb-4 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-[#D9531E]" />
                  <span>Heritage Stays & Homestays ({savedStays.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedStays.map((stay) => (
                    <div
                      key={stay.id}
                      className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs p-4 flex gap-4 items-center group"
                    >
                      <img
                        src={stay.image}
                        alt={stay.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => onImageError(e, FALLBACK_STAY_IMAGE)}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#143D24] uppercase">
                          {stay.type}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E232A] truncate">
                          {stay.name}
                        </h4>
                        <p className="text-xs text-[#D9531E] font-bold mb-2">
                          ₹{stay.pricePerNight.toLocaleString()}{' '}
                          <span className="text-[10px] text-gray-500 font-normal">/ night</span>
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              openBookingModal({
                                id: stay.id,
                                title: stay.name,
                                type: 'stay',
                                price: stay.pricePerNight,
                              })
                            }
                            className="text-xs bg-[#D9531E] hover:bg-[#C84B16] text-white px-3 py-1 rounded-md font-semibold"
                          >
                            Request Stay
                          </button>
                          <button
                            onClick={() => toggleWishlist(stay.id, stay.name)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Experiences */}
            {savedExperiences.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#143D24] font-display mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E89E28]" />
                  <span>Local Experiences & Cultural Workshops ({savedExperiences.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs p-4 flex gap-4 items-center group"
                    >
                      <img
                        src={exp.image}
                        alt={exp.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#D9531E] uppercase">
                          {exp.type}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E232A] truncate">
                          {exp.title}
                        </h4>
                        <p className="text-xs text-[#143D24] font-bold mb-2">
                          ₹{exp.price.toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              openBookingModal({
                                id: exp.id,
                                title: exp.title,
                                type: 'experience',
                                price: exp.price,
                              })
                            }
                            className="text-xs bg-[#143D24] hover:bg-[#0D2B1A] text-white px-3 py-1 rounded-md font-semibold"
                          >
                            Book Experience
                          </button>
                          <button
                            onClick={() => toggleWishlist(exp.id, exp.title)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
