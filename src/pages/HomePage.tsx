import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { IndiaMap } from '../components/map/IndiaMap';
import { 
  DESTINATIONS, 
  STAYS, 
  EXPERIENCES, 
  LOCAL_BUSINESSES, 
  ALL_STATES_AND_UTS 
} from '../data/indiaData';
import { AccommodationCard } from '../components/stays/AccommodationCard';
import { 
  Compass, 
  MapPin, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Landmark, 
  Bed, 
  Trees, 
  Star, 
  ExternalLink,
  ChevronRight,
  Award,
  Users,
  Shield,
  FileCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Languages,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { onImageError, FALLBACK_HERITAGE_IMAGE, FALLBACK_GUIDE_IMAGE } from '../utils/imageFallback';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, openBookingModal, tourGuides } = useApp();

  const featuredDestinations = DESTINATIONS.filter((d) => d.featured).slice(0, 6);
  // Pick 3 representative sample stays from different regions
  const featuredStays = STAYS.slice(0, 3);
  const featuredExperiences = EXPERIENCES.slice(0, 3);

  // Dedicated guide specialists from tour guide directory
  const displayedGuides = React.useMemo(() => {
    if (tourGuides && tourGuides.length > 0) {
      return tourGuides.filter((g) => g.verificationStatus === 'verified' && g.listingStatus === 'published').slice(0, 3);
    }
    return [];
  }, [tourGuides]);

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      {/* 1. HERO SECTION (verbatim requested text) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F2] via-[#F4EFE6] to-[#FAF8F2] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E8E1D5]">
        {/* Subtle Indian architectural ambient backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#F07843]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#174A35]/8 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-[#EBF3EE] border border-[#C5DDD0] text-[#174A35] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#F07843]" />
            <span>BharatExplore • One India. Endless Experiences.</span>
          </div>

          {/* Requested Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#174A35] tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Discover the <span className="text-[#F07843] relative inline-block">
              Soul of Incredible India
              <span className="absolute left-0 bottom-1 w-full h-2.5 bg-[#F07843]/20 -z-10 rounded-sm"></span>
            </span>
          </h1>

          {/* Requested Supporting text */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#3D4752] max-w-2xl mx-auto font-normal leading-relaxed">
            Find extraordinary destinations, welcoming homestays, local guides, and authentic cultural experiences across every corner of India.
          </p>

          {/* Prominent Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <SearchBar
              placeholder="Search by destination (e.g. Coorg, Munnar, Hampi), state/UT, or experience..."
            />

            {/* Quick thematic destination tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Popular Searches:</span>
              {[
                { label: 'Taj Mahal & Agra', path: '/destinations/taj-mahal-agra' },
                { label: 'Varanasi Dawn Ghats', path: '/destinations/varanasi-ghats' },
                { label: 'Coorg Coffee Estates', path: '/stays/stay-coorg-coffee-estate' },
                { label: 'Alleppey Backwaters', path: '/stays/stay-alleppey-backwater-homestay' },
                { label: 'Hampi Boulder Ruins', path: '/destinations/hampi-ruins' },
                { label: 'Munnar Tea Hills', path: '/stays/stay-munnar-tea-hills' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="bg-white/90 hover:bg-[#FEF2EC] hover:text-[#F07843] hover:border-[#F07843] border border-[#E0D7C9] px-3.5 py-1.5 rounded-lg transition-all text-xs font-medium cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric highlights */}
          <div className="mt-14 pt-8 border-t border-[#E8E1D5]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-[#E8E1D5]/80 shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#174A35] font-display">28 + 8</p>
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mt-1">States & Union Territories</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-[#E8E1D5]/80 shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#F07843] font-display">20 Stays</p>
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mt-1">Diverse Indian Regions</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-[#E8E1D5]/80 shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#174A35] font-display">100%</p>
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mt-1">Geographic Coordinates</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-[#E8E1D5]/80 shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#F07843] font-display">Verified</p>
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mt-1">Local Guide Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE BY REGION (Requested: North, South, East, West, Central, Northeast) */}
      <section className="py-14 bg-[#F4EFE6] border-b border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#174A35]">Regional Gateways</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#174A35] font-display mt-1">
                Explore India by Geographic Region
              </h2>
            </div>
            <Link
              to="/states"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F07843] hover:text-[#DE632E] transition-colors"
            >
              <span>View All 28 States & 8 UTs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              {
                name: 'North India',
                region: 'North',
                subtitle: 'Himalayas & Sacred Rivers',
                image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'South India',
                region: 'South',
                subtitle: 'Temples, Coasts & Ghats',
                image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'West India',
                region: 'West',
                subtitle: 'Thar Sands & Royal Forts',
                image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'East India',
                region: 'East',
                subtitle: 'Delta Heritage & Buddhism',
                image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'Central India',
                region: 'Central',
                subtitle: 'Heartland Tiger Corridors',
                image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'Northeast India',
                region: 'North-East',
                subtitle: 'Clouds, Roots & Tea Valleys',
                image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80',
              },
            ].map((realm) => (
              <div
                key={realm.region}
                onClick={() => navigate(`/explore?region=${realm.region}`)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={realm.image}
                  alt={realm.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3.5 text-white">
                  <h3 className="font-bold text-sm sm:text-base leading-tight group-hover:text-[#F07843] transition-colors">
                    {realm.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-300 leading-tight mt-1 line-clamp-1">
                    {realm.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE INDIA MAP (Preserved & verified working) */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md mb-3 shadow-2xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Real Geographic Data</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#174A35] font-display tracking-tight">
            Interactive Map of India
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Pan across the subcontinent, select any State or Union Territory, zoom into heritage coordinates, and discover nearby cultural attractions with OpenStreetMap tiles.
          </p>
        </div>

        {/* Leaflet Map Component */}
        <IndiaMap
          height="h-[520px] sm:h-[620px] lg:h-[700px]"
          showNearbyPanel={true}
        />
      </section>

      {/* AI TRAVEL PLANNER SHOWCASE */}
      <section className="py-12 bg-gradient-to-r from-[#174A35] via-[#1F5F45] to-[#174A35] text-white relative overflow-hidden shadow-xl mb-16 mx-4 sm:mx-6 lg:mx-8 rounded-3xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#F07843]/20 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FAF8F2] bg-white/10 px-3.5 py-1 rounded-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F07843]" />
              <span>AI-Powered Travel Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight text-white">
              Plan Your Dream Indian Journey with AI
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Tell us your starting point, destination, dates, budget, and travel style. Our Gemini-powered cultural planner crafts personalized day-by-day itineraries with monument timings, authentic regional food recommendations, and local transportation tips.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 justify-center md:justify-start">
              {['Family Vacations', 'Cultural Odysseys', 'Adventure Expeditions', 'Budget Backpacking'].map((tag) => (
                <span key={tag} className="text-[11px] bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-white/90 font-medium flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/planner"
              className="bg-[#F07843] hover:bg-[#DE632E] text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group text-center cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Launch AI Travel Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/destinations"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold px-5 py-3 rounded-xl transition-all text-center cursor-pointer"
            >
              Browse 40+ Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED DESTINATIONS */}
      <section className="py-16 bg-[#F4EFE6] border-y border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174A35] bg-white px-3.5 py-1 rounded-md mb-2 border border-[#E8E1D5] shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Iconic Monuments & Sanctuaries</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#174A35] font-display">
                Featured Indian Destinations
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Handpicked historical wonders, sacred riverfronts, and majestic landscapes.
              </p>
            </div>

            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F07843] hover:text-[#DE632E] transition-colors"
            >
              <span>Explore All Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group bg-white rounded-2xl border border-[#E0D7C9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 sm:h-60 overflow-hidden bg-gray-900 cursor-pointer" onClick={() => navigate(`/destinations/${dest.id}`)}>
                    <img
                      src={dest.image}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-[#174A35]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                      {dest.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(dest.id, dest.name);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-[#F07843] hover:scale-105 transition-all shadow-xs cursor-pointer"
                      aria-label="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${isInWishlist(dest.id) ? 'fill-[#F07843] text-[#F07843]' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 
                        onClick={() => navigate(`/destinations/${dest.id}`)}
                        className="font-bold text-lg text-[#1E232A] group-hover:text-[#F07843] transition-colors leading-snug cursor-pointer"
                      >
                        {dest.name}
                      </h3>
                      <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#F07843] bg-[#FEF2EC] px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-[#F07843]" />
                        <span>{dest.rating.toFixed(1)}</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#174A35]" />
                      <span>{dest.stateName}</span>
                      <span className="text-gray-300">•</span>
                      <span>{dest.idealDuration}</span>
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {dest.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-[#FAF8F2] border-t border-[#E8E1D5] flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">
                    Best: <strong className="text-gray-700">{dest.bestTimeToVisit.split('&')[0]}</strong>
                  </span>
                  <button
                    onClick={() => navigate(`/destinations/${dest.id}`)}
                    className="text-xs font-bold text-[#174A35] group-hover:text-[#F07843] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Destination</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED HOMESTAYS (Using new 20-stays data & AccommodationCard) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174A35] bg-[#EBF3EE] px-3.5 py-1 rounded-md mb-2 shadow-2xs">
              <Bed className="w-3.5 h-3.5 text-[#F07843]" />
              <span>Authentic Stays</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#174A35] font-display">
              Featured Homestays & Heritage Accommodations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Explore 20 diverse sample accommodations covering Coorg, Munnar, Hampi, Udaipur, and beyond.
            </p>
          </div>

          <Link
            to="/stays"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F07843] hover:text-[#DE632E] transition-colors"
          >
            <span>Explore All 20 Stays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStays.map((stay) => (
            <AccommodationCard
              key={stay.id}
              stay={stay}
              onViewDetails={(s) => navigate(`/stays/${s.id}`)}
              onRequestStay={(s) =>
                openBookingModal({
                  id: s.id,
                  title: s.name,
                  type: 'stay',
                  price: s.pricePerNight,
                })
              }
            />
          ))}
        </div>
      </section>

      {/* 6. MEET LOCAL GUIDES (Requested Feature 2.F) */}
      <section className="py-16 bg-[#F4EFE6] border-t border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174A35] bg-white px-3.5 py-1 rounded-md mb-2 border border-[#E8E1D5] shadow-2xs">
                <Users className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Scholarship & Living Heritage</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#174A35] font-display">
                Meet Certified Local Guides
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Archaeologists, scholars, and local historians bringing ancient monuments and river trails to life.
              </p>
            </div>

            <Link
              to="/guides"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F07843] hover:text-[#DE632E] transition-colors"
            >
              <span>View Guide Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-[#E0D7C9] p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={guide.profileImage}
                      alt={guide.displayName}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_GUIDE_IMAGE)}
                      className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[#174A35]/15 shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="font-bold text-base text-[#1E232A] group-hover:text-[#F07843] transition-colors">{guide.displayName}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F07843]" />
                        <span>{guide.city}, {guide.state}</span>
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-[#174A35] bg-[#EBF3EE] px-2 py-0.5 rounded-md">
                        {guide.yearsOfExperience} Years Guiding
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Specialisation:
                      </span>
                      <p className="font-semibold text-gray-800">{guide.specialisations.slice(0, 2).join(' • ')}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Languages:
                      </span>
                      <p className="text-gray-600">{guide.languages.join(' • ')}</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed pt-1 line-clamp-2">{guide.shortBio}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#174A35]">
                    {guide.pricePerTour ? `₹${guide.pricePerTour.toLocaleString()}/tour` : 'Verified Guide'}
                  </span>
                  <Link
                    to={`/guides/${guide.id}`}
                    className="text-xs font-bold text-[#F07843] hover:text-[#DE632E] hover:underline flex items-center gap-1"
                  >
                    <span>View & Enquire Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AUTHENTIC LOCAL EXPERIENCES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174A35] bg-[#EBF3EE] px-3.5 py-1 rounded-md mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F07843]" />
              <span>Living Cultural Heritage</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#174A35] font-display">
              Authentic Local Experiences
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Regional food trails, ancient temple ceremonies, traditional craft workshops, and river safaris.
            </p>
          </div>

          <Link
            to="/experiences"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F07843] hover:text-[#DE632E] transition-colors"
          >
            <span>Explore All Experiences</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-[#E0D7C9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-gray-900">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#F07843] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {exp.type}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                    {exp.duration}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base text-[#1E232A] group-hover:text-[#F07843] transition-colors mb-1.5 leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Led by <strong>{exp.hostName}</strong> ({exp.hostRole})
                  </p>
                  <ul className="text-[11px] text-gray-600 space-y-1 mb-4">
                    {exp.highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#F07843]">•</span>
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-[#FAF8F2] border-t border-[#E8E1D5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Price per person</span>
                  <p className="text-sm font-extrabold text-[#174A35]">
                    ₹{exp.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() =>
                    openBookingModal({
                      id: exp.id,
                      title: exp.title,
                      type: 'experience',
                      price: exp.price,
                    })
                  }
                  className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm"
                >
                  Book Experience
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TRUST AND SAFETY SECTION (Requested Feature 2.H) */}
      <section className="py-16 bg-[#174A35] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-white/10 px-3.5 py-1 rounded-md mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F07843]" />
              <span>Platform Integrity & Ethics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              Trust, Transparency & Responsible Tourism
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed">
              We operate with genuine respect for local communities, providing clear distinction between verified partners and demonstration records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F07843]">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white font-display">Listing Verification</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                We clearly separate verified local guides and cooperatives from demonstration sample records. Unapproved or prototype submissions are clearly labeled.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F07843]">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-base text-white font-display">Direct Booking Handling</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                All booking requests initiate in <strong>PENDING</strong> status. Dates and availability are directly confirmed with the host before finalizing arrangements.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white font-display">Responsible Tourism</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                By championing zero hidden commissions, our platform ensures economic benefits flow directly to indigenous weavers, local guides, and family homestays.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
