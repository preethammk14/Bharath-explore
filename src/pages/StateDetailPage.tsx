import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ALL_STATES_AND_UTS, DESTINATIONS, STAYS, EXPERIENCES, LOCAL_BUSINESSES } from '../data/indiaData';
import { IndiaMap } from '../components/map/IndiaMap';
import { 
  MapPin, 
  Compass, 
  Calendar, 
  Languages, 
  Sparkles, 
  Landmark, 
  Bed, 
  Building2, 
  ArrowLeft, 
  Heart,
  ChevronRight,
  Utensils,
  Users,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { onImageError, FALLBACK_HERITAGE_IMAGE, FALLBACK_GUIDE_IMAGE } from '../utils/imageFallback';

export const StateDetailPage: React.FC = () => {
  const { stateId } = useParams<{ stateId: string }>();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, tourGuides } = useApp();

  const stateData = ALL_STATES_AND_UTS.find((s) => s.id === stateId);

  if (!stateData) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-[#143D24]">State or Union Territory Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">The requested region ID "{stateId}" does not exist in our directory.</p>
        <Link to="/states" className="mt-4 inline-block bg-[#D9531E] text-white text-xs font-bold px-4 py-2 rounded-xl">
          Browse All States & UTs
        </Link>
      </div>
    );
  }

  // Related data
  const stateDestinations = DESTINATIONS.filter((d) => d.stateId === stateData.id);
  const stateStays = STAYS.filter((s) => s.stateId === stateData.id);
  const stateExperiences = EXPERIENCES.filter((e) => e.stateId === stateData.id);
  const stateBusinesses = LOCAL_BUSINESSES.filter((b) => b.stateId === stateData.id);
  const stateGuides = tourGuides.filter((g) => g.state.toLowerCase() === stateData.name.toLowerCase());

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Banner with Hero Photo */}
      <div className="relative h-[320px] sm:h-[420px] bg-gray-900 overflow-hidden">
        <img
          src={stateData.heroImage}
          alt={stateData.name}
          referrerPolicy="no-referrer"
          onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#143D24] via-[#143D24]/40 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate('/states')}
            className="bg-white/90 hover:bg-white text-[#143D24] text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All States & UTs</span>
          </button>
        </div>

        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 text-white max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-[#D9531E] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {stateData.region} India • {stateData.type.toUpperCase()}
            </span>
            <span className="bg-white/20 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-md">
              Capital: <strong>{stateData.capital}</strong>
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            {stateData.name}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
            {stateData.description}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Quick Facts Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-[#E8E1D5] shadow-xs">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#D9531E] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-500 font-semibold uppercase">Best Season</p>
              <p className="text-xs sm:text-sm font-bold text-gray-800">{stateData.bestTimeToVisit}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Languages className="w-5 h-5 text-[#143D24] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-500 font-semibold uppercase">Languages</p>
              <p className="text-xs sm:text-sm font-bold text-gray-800">{stateData.languages.join(', ')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#D9531E] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-500 font-semibold uppercase">State Capital</p>
              <p className="text-xs sm:text-sm font-bold text-gray-800">{stateData.capital}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#E89E28] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-500 font-semibold uppercase">Famous For</p>
              <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">{stateData.famousFor.slice(0, 2).join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Interactive Map Focused on State */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#143D24] font-display">
                Regional Map: {stateData.name}
              </h2>
              <p className="text-xs text-gray-500">
                Interactive geographic coordinate map highlighting sights and destinations in {stateData.name}.
              </p>
            </div>
          </div>

          <IndiaMap
            initialStateId={stateData.id}
            height="h-[440px] sm:h-[500px]"
            showNearbyPanel={false}
          />
        </div>

        {/* Tourist Destinations in this State */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#143D24] font-display flex items-center gap-2">
                <Landmark className="w-6 h-6 text-[#D9531E]" />
                <span>Destinations in {stateData.name} ({stateDestinations.length})</span>
              </h2>
              <p className="text-xs text-gray-500">Must-visit monuments, spiritual corridors, and scenic vistas.</p>
            </div>
          </div>

          {stateDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#143D24] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {dest.category}
                    </span>
                    <button
                      onClick={() => toggleWishlist(dest.id, dest.name)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-gray-700 hover:text-[#D9531E]"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(dest.id) ? 'fill-[#D9531E] text-[#D9531E]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="font-bold text-base text-[#1E232A] group-hover:text-[#D9531E] transition-colors">
                          {dest.name}
                        </h3>
                        <span className="shrink-0 text-xs font-bold text-[#D9531E] flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-[#D9531E]" />
                          <span>{dest.rating.toFixed(1)}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{dest.description}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">{dest.idealDuration}</span>
                      <button
                        onClick={() => navigate(`/destinations/${dest.id}`)}
                        className="text-xs font-bold text-[#D9531E] flex items-center gap-1 hover:underline"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-[#E8E1D5] text-center">
              <p className="text-xs text-gray-600">
                Key attractions in this region include: <strong>{stateData.keyAttractions.join(', ')}</strong>.
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Detailed directory cards being compiled by our verified local partners.</p>
            </div>
          )}
        </div>

        {/* Local Tour Guides in this State */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#143D24] font-display flex items-center gap-2">
                <Users className="w-6 h-6 text-[#D9531E]" />
                <span>Certified Local Guides in {stateData.name} ({stateGuides.length})</span>
              </h2>
              <p className="text-xs text-gray-500">
                Independent historians, naturalists, and scholars based in {stateData.name}.
              </p>
            </div>
            <Link
              to="/guides"
              className="text-xs font-bold text-[#D9531E] hover:underline flex items-center gap-1"
            >
              <span>Explore All Guides</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stateGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-xs hover:border-[#D9531E] transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <img
                      src={guide.profileImage || FALLBACK_GUIDE_IMAGE}
                      alt={guide.displayName}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_GUIDE_IMAGE)}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#1E232A] group-hover:text-[#D9531E] truncate">
                          {guide.displayName}
                        </h4>
                        {guide.verificationStatus === 'verified' && (
                          <span title="Verified Guide">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {guide.city} • {guide.yearsOfExperience} yrs exp.
                      </p>
                      <p className="text-[11px] text-[#143D24] font-medium mt-1">
                        {guide.languages.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                    {guide.shortBio}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#143D24]">
                      {guide.pricePerTour ? `₹${guide.pricePerTour.toLocaleString()}/tour` : 'Direct Enquiry'}
                    </span>
                    <Link
                      to={`/guides/${guide.id}`}
                      className="bg-[#143D24] hover:bg-[#0D2818] text-white text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-[#E8E1D5] text-center space-y-2">
              <p className="text-xs text-gray-600">
                No individual guide profiles are currently published directly for {stateData.name}.
              </p>
              <Link
                to="/guides"
                className="inline-block text-xs font-bold text-[#D9531E] hover:underline"
              >
                Browse national tour guide directory →
              </Link>
            </div>
          )}
        </div>

        {/* Culture, Craft & Cuisine Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F6F1EA] p-6 rounded-2xl border border-[#E8E1D5]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#D9531E]" />
              <h3 className="text-base font-bold text-[#143D24]">Living Crafts & Folk Heritage</h3>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              {stateData.name} has a profound heritage recognized worldwide. Traditional craftsmanship passed through families includes:
            </p>
            <div className="flex flex-wrap gap-2">
              {stateData.famousFor.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-[#D5CEBF] text-xs font-medium px-3 py-1 rounded-md text-gray-800"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-5 h-5 text-[#143D24]" />
              <h3 className="text-base font-bold text-[#143D24]">Regional Flavor & Experience</h3>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-2">
              Explore authentic local specialties, GI-tagged agricultural varieties, and community festivals celebrated in {stateData.name}.
            </p>
            <div className="p-3 bg-white rounded-xl border border-[#E8E1D5] text-xs text-gray-600">
              <p>Top Attractions: <strong>{stateData.keyAttractions.join(' • ')}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
