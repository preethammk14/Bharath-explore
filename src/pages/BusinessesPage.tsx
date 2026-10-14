import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  Clock, 
  XCircle, 
  Ticket, 
  ChevronRight, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/ui/Modal';
import { ALL_STATES_AND_UTS } from '../data/indiaData';
import { Link } from 'react-router-dom';
import { onImageError, FALLBACK_CRAFT_IMAGE } from '../utils/imageFallback';

export const BusinessesPage: React.FC = () => {
  const { 
    businesses, 
    registerBusiness, 
    approveBusiness, 
    rejectBusiness, 
    deleteBusiness,
    openBookingModal, 
    user, 
    switchUserRole 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'directory' | 'admin_queue' | 'my_listings'>('directory');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  // New business form state
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState<'Certified Tour Guide' | 'Handicraft Cooperative' | 'Artisan Workshop' | 'Regional Cuisine' | 'Heritage Transport'>('Certified Tour Guide');
  const [bizState, setBizState] = useState('Karnataka');
  const [bizCity, setBizCity] = useState('');
  const [bizPhone, setBizPhone] = useState('+91 98');
  const [bizEmail, setBizEmail] = useState('');
  const [bizYear, setBizYear] = useState(2015);
  const [bizPriceRange, setBizPriceRange] = useState('₹800 - ₹3,500');
  const [bizFacilities, setBizFacilities] = useState('Artisan Demonstrations, UPI Digital Payments, Guided Walking Area, Restrooms');
  const [bizDesc, setBizDesc] = useState('');
  const [bizSpecialties, setBizSpecialties] = useState('');
  const [bizServices, setBizServices] = useState('Half-day Private Tour, Artisan Workshop Demonstration');

  const categories = ['All', 'Certified Tour Guide', 'Handicraft Cooperative', 'Artisan Workshop', 'Regional Cuisine', 'Heritage Transport'];

  const pendingBusinesses = useMemo(() => {
    return businesses.filter((b) => b.approvalStatus === 'pending');
  }, [businesses]);

  const approvedBusinesses = useMemo(() => {
    return businesses.filter((b) => b.approvalStatus === 'approved' || (b.verified && !b.approvalStatus));
  }, [businesses]);

  const myListings = useMemo(() => {
    const currentUid = user?.uid || 'user-demo-guest';
    return businesses.filter((b) => b.ownerId === currentUid);
  }, [businesses, user]);

  const filteredBusinesses = useMemo(() => {
    const sourceList = activeTab === 'admin_queue' 
      ? pendingBusinesses 
      : activeTab === 'my_listings' 
        ? myListings 
        : approvedBusinesses;

    return sourceList.filter((b) => {
      const matchCategory = selectedCategory === 'All' || b.category === selectedCategory;
      const matchState = selectedState === 'All' || b.stateName.toLowerCase() === selectedState.toLowerCase() || b.stateId === selectedState;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.stateName.toLowerCase().includes(q) ||
        b.specialties.some((s) => s.toLowerCase().includes(q)) ||
        b.servicesOffered.some((s) => s.toLowerCase().includes(q));

      return matchCategory && matchState && matchSearch;
    });
  }, [activeTab, pendingBusinesses, approvedBusinesses, myListings, selectedCategory, selectedState, searchQuery]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !bizCity || !bizEmail) return;

    await registerBusiness({
      name: bizName.trim(),
      category: bizCategory,
      stateId: bizState.toLowerCase().replace(/\s+/g, '-'),
      stateName: bizState,
      city: bizCity.trim(),
      coordinates: [20.5937, 78.9629],
      contactPhone: bizPhone.trim(),
      contactEmail: bizEmail.trim(),
      image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80',
      description: bizDesc.trim(),
      yearEstablished: Number(bizYear) || 2015,
      priceRange: bizPriceRange.trim(),
      facilities: bizFacilities.split(',').map((f) => f.trim()).filter(Boolean),
      specialties: bizSpecialties.split(',').map((s) => s.trim()).filter(Boolean),
      servicesOffered: bizServices.split(',').map((s) => s.trim()).filter(Boolean),
      availableServices: [
        {
          id: `srv-${Date.now()}-1`,
          name: `${bizCategory} Primary Experience`,
          price: 1200,
          duration: '2.5 Hours',
          description: `Customized heritage and service session with certified specialists from ${bizName.trim()}.`,
          bookingSupported: true
        }
      ]
    });

    setRegisterModalOpen(false);
    // Reset form
    setBizName('');
    setBizCity('');
    setBizDesc('');
    setBizSpecialties('');
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedState('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedState !== 'All' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md mb-3 shadow-2xs">
              <Building2 className="w-3.5 h-3.5" />
              <span>Smart Local Tourism Business Portal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
              Local Businesses, Cooperatives & Guides
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Connect directly with ASI-certified guides, GI-tagged artisan weaving cooperatives, regional culinary masters, and heritage workshops across India with verified administrator accreditation.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="bg-[#F07843] hover:bg-[#DE632E] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Your Tourism Business</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation: Directory vs Admin Approval Queue vs My Listings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[#E0D7C9] shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-[#174A35] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#174A35] hover:bg-[#FAF8F2]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Public Directory ({approvedBusinesses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_queue')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin_queue'
                  ? 'bg-[#174A35] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#174A35] hover:bg-[#FAF8F2]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F07843]" />
              <span>Administrator Review Queue</span>
              {pendingBusinesses.length > 0 && (
                <span className="bg-[#F07843] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-md">
                  {pendingBusinesses.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('my_listings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my_listings'
                  ? 'bg-[#174A35] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#174A35] hover:bg-[#FAF8F2]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>My Registered Listings ({myListings.length})</span>
            </button>
          </div>

          {/* Quick role indicator & switcher */}
          <div className="flex items-center gap-2 px-3 py-1 text-xs text-gray-500">
            <span>Role: <strong className="text-[#174A35] uppercase">{user?.role || 'traveler'}</strong></span>
            <button
              onClick={() => switchUserRole(user?.role === 'admin' ? 'traveler' : 'admin')}
              className="text-[#F07843] hover:underline font-bold text-[11px] cursor-pointer"
            >
              {user?.role === 'admin' ? 'Switch to Traveler' : 'Switch to Admin Demo'}
            </button>
          </div>
        </div>

        {/* Administrator Approval Information Callout */}
        {activeTab === 'admin_queue' && (
          <div className="bg-[#EBF3EE] border border-[#C5DDD0] rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-gray-800">
            <ShieldCheck className="w-5 h-5 text-[#174A35] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#174A35]">
                Administrator Approval Workflow (VTU Requirement)
              </h4>
              <p className="text-gray-600 leading-relaxed">
                When local tourism businesses and guides register, submissions enter this administrative queue for verification before becoming visible in the public directory. Administrators can verify credentials, approve verified partners, or reject incomplete submissions.
              </p>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E0D7C9] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by business name, city, craft, or specialty..."
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843]"
              />
            </div>

            {/* State Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2.5 text-gray-800 font-medium cursor-pointer focus:outline-hidden focus:border-[#F07843]"
              >
                <option value="All">All States & UTs ({ALL_STATES_AND_UTS.length})</option>
                {ALL_STATES_AND_UTS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-gray-500 hover:text-[#F07843] px-3 py-2 rounded-xl border border-transparent hover:border-[#E0D7C9] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold text-gray-500 mr-2 whitespace-nowrap">Service Category:</span>
            {categories.map((c) => {
              const active = selectedCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#174A35] text-white font-bold shadow-xs'
                      : 'bg-[#FAF8F2] text-gray-700 hover:bg-[#EBF3EE] border border-[#E0D7C9]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Result counter */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <strong className="text-[#174A35] font-bold">{filteredBusinesses.length}</strong> {activeTab === 'admin_queue' ? 'pending applications' : 'tourism businesses'}
            </span>
            {hasActiveFilters && (
              <span className="text-gray-400">Filters applied</span>
            )}
          </div>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBusinesses.map((biz) => {
            const isPending = biz.approvalStatus === 'pending';
            const isApproved = biz.approvalStatus === 'approved' || biz.verified;
            const isRejected = biz.approvalStatus === 'rejected';

            return (
              <div
                key={biz.id}
                className="bg-white rounded-3xl border border-[#E0D7C9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={biz.image}
                      alt={biz.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => onImageError(e, FALLBACK_CRAFT_IMAGE)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-[#E0D7C9] group-hover:scale-102 transition-transform"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-2.5 py-0.5 rounded-md">
                          {biz.category}
                        </span>

                        {isApproved && (
                          <span className="text-[10px] font-bold text-[#174A35] bg-[#EBF3EE] px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Approved</span>
                          </span>
                        )}

                        {isPending && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Approval</span>
                          </span>
                        )}

                        {isRejected && (
                          <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg sm:text-xl text-[#1E232A] group-hover:text-[#F07843] transition-colors leading-snug">
                        {biz.name}
                      </h3>

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#174A35] shrink-0" />
                        <span>{biz.city}, {biz.stateName} • Est. {biz.yearEstablished}</span>
                      </p>

                      {biz.priceRange && (
                        <p className="text-xs font-semibold text-gray-700">
                          Rates: <span className="text-[#174A35] font-bold">{biz.priceRange}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {biz.description}
                  </p>

                  {/* Specialties Pills */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Specialties & Craftsmanship:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {biz.specialties.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-[#FAF8F2] border border-[#E0D7C9] text-[11px] font-medium px-2.5 py-0.5 rounded-md text-gray-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Facilities preview */}
                  {biz.facilities && biz.facilities.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1 text-[11px] text-gray-500">
                      <span className="font-semibold text-gray-700 mr-1">Facilities:</span>
                      {biz.facilities.slice(0, 3).join(' • ')}
                      {biz.facilities.length > 3 && ` +${biz.facilities.length - 3} more`}
                    </div>
                  )}

                  {isRejected && biz.rejectionReason && (
                    <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                      <strong>Rejection Note:</strong> {biz.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Footer Controls & Direct Actions */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {/* Admin Approval Queue Actions */}
                  {activeTab === 'admin_queue' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-amber-900">Administrator Actions:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveBusiness(biz.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                        >
                          Approve Listing
                        </button>
                        <button
                          onClick={() => rejectBusiness(biz.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                        >
                          Reject Listing
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Public Contact & Booking Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#F07843]" />
                        <span>{biz.contactPhone}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/businesses/${biz.id}`}
                        className="bg-[#FAF8F2] hover:bg-[#EBF3EE] text-[#174A35] border border-[#E0D7C9] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() =>
                          openBookingModal({
                            id: biz.id,
                            title: biz.name,
                            type: 'business',
                            price: 1500,
                          })
                        }
                        className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                      >
                        <Ticket className="w-3.5 h-3.5 text-[#F07843]" />
                        <span>Book Service</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E0D7C9] p-8 shadow-xs max-w-md mx-auto space-y-3">
            <Building2 className="w-12 h-12 text-[#F07843] mx-auto" />
            <p className="text-base font-bold text-gray-700">
              {activeTab === 'admin_queue' 
                ? 'No pending business applications in the review queue.' 
                : activeTab === 'my_listings'
                  ? 'You have not registered any tourism business yet.'
                  : 'No businesses found matching your criteria.'}
            </p>
            <p className="text-xs text-gray-500">
              {activeTab === 'my_listings'
                ? 'Use the "Register Your Tourism Business" button above to submit your homestay, guild, or tour enterprise.'
                : 'Try adjusting your search keywords or switching category filters.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-2 bg-[#174A35] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Modal: Register Tourism Business */}
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          title="Register Your Tourism Business on BharatExplore"
          subtitle="Join India's premier discovery network. All submissions undergo administrator review and accreditation verification before public listing."
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Business / Enterprise Name *</label>
              <input
                type="text"
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="e.g. Madurai Temple Historians Guild, Coorg Spice Plantation Homestay..."
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={bizCategory}
                  onChange={(e) => setBizCategory(e.target.value as any)}
                  className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                >
                  <option value="Certified Tour Guide">Certified Tour Guide</option>
                  <option value="Handicraft Cooperative">Handicraft Cooperative</option>
                  <option value="Artisan Workshop">Artisan Workshop</option>
                  <option value="Regional Cuisine">Regional Cuisine</option>
                  <option value="Heritage Transport">Heritage Transport</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">State / UT *</label>
                <select
                  value={bizState}
                  onChange={(e) => setBizState(e.target.value)}
                  className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                >
                  {ALL_STATES_AND_UTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={bizCity}
                  onChange={(e) => setBizCity(e.target.value)}
                  placeholder="e.g. Madurai, Udaipur, Varanasi"
                  className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Year Established</label>
                <input
                  type="number"
                  value={bizYear}
                  onChange={(e) => setBizYear(Number(e.target.value))}
                  className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Indicative Price Range</label>
                <input
                  type="text"
                  value={bizPriceRange}
                  onChange={(e) => setBizPriceRange(e.target.value)}
                  placeholder="e.g. ₹500 - ₹3,000"
                  className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={bizPhone}
                  onChange={(e) => setBizPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={bizEmail}
                  onChange={(e) => setBizEmail(e.target.value)}
                  placeholder="coordinator@heritageguild.org"
                  className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Available Facilities & Infrastructure (comma separated)</label>
              <input
                type="text"
                value={bizFacilities}
                onChange={(e) => setBizFacilities(e.target.value)}
                placeholder="e.g. On-Site Lathe Studio, Restrooms, Drinking Water, Card Payments, Parking"
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Specialties & GI Crafts (comma separated)</label>
              <input
                type="text"
                value={bizSpecialties}
                onChange={(e) => setBizSpecialties(e.target.value)}
                placeholder="e.g. GI-Tagged Sarees, Sanskrit Epigraphy, Handloom Shawls"
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Bookable Services Offered (comma separated)</label>
              <input
                type="text"
                value={bizServices}
                onChange={(e) => setBizServices(e.target.value)}
                placeholder="e.g. Half-day Epigraphy Tour, 2-Hour Weaving Masterclass, Private Terrace Dinner"
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">About Your Tourism Enterprise & Heritage Background *</label>
              <textarea
                rows={3}
                required
                value={bizDesc}
                onChange={(e) => setBizDesc(e.target.value)}
                placeholder="Describe your artisan family lineage, ASI/Tourism credentials, safety measures, and what travelers experience..."
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-[#F07843]"
              />
            </div>

            {/* Verification Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Accreditation Process:</strong> Your submission will enter the <em>Administrator Review Queue</em> in <code>Pending</code> status. An administrator reviews licensing and heritage credentials prior to publishing.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Submit for Administrator Approval
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
