import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TourGuide } from '../types';
import { TourGuideFilters, GuideFilterState } from '../components/guides/TourGuideFilters';
import { TourGuideGrid } from '../components/guides/TourGuideGrid';
import { GuideRegistrationModal } from '../components/guides/GuideRegistrationModal';
import { GuideApprovalPanel } from '../components/guides/GuideApprovalPanel';
import { Modal } from '../components/ui/Modal';
import { TourEnquiryForm } from '../components/guides/TourEnquiryForm';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  PlusCircle, 
  Info, 
  MapPin, 
  Award, 
  CheckCircle,
  Settings,
  HelpCircle
} from 'lucide-react';

export const GuidesPage: React.FC = () => {
  const { tourGuides, user } = useApp();

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedGuideForEnquiry, setSelectedGuideForEnquiry] = useState<TourGuide | null>(null);
  const [showAdminConsole, setShowAdminConsole] = useState(false);

  const defaultFilters: GuideFilterState = {
    searchQuery: '',
    selectedState: 'All',
    selectedCity: 'All',
    selectedDestination: 'All',
    selectedLanguage: 'All',
    selectedSpecialisation: 'All',
    maxPrice: 5000,
    verifiedOnly: false,
  };

  const [filters, setFilters] = useState<GuideFilterState>(defaultFilters);

  // Extract unique filter choices across available guides
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    tourGuides.forEach((g) => set.add(g.state));
    return Array.from(set).sort();
  }, [tourGuides]);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    tourGuides.forEach((g) => {
      if (filters.selectedState === 'All' || g.state === filters.selectedState) {
        set.add(g.city);
      }
    });
    return Array.from(set).sort();
  }, [tourGuides, filters.selectedState]);

  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    tourGuides.forEach((g) => g.languages.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [tourGuides]);

  const availableSpecialisations = useMemo(() => {
    const set = new Set<string>();
    tourGuides.forEach((g) => g.specialisations.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [tourGuides]);

  // Filtered and sorted guides
  const filteredGuides = useMemo(() => {
    return tourGuides.filter((guide) => {
      // Ignore unapproved / rejected listings unless admin is inspecting
      if (guide.listingStatus === 'rejected') return false;

      // 1. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchName = guide.displayName.toLowerCase().includes(q);
        const matchCity = guide.city.toLowerCase().includes(q);
        const matchState = guide.state.toLowerCase().includes(q);
        const matchBio = guide.shortBio.toLowerCase().includes(q) || guide.fullBio.toLowerCase().includes(q);
        const matchSpecs = guide.specialisations.some((s) => s.toLowerCase().includes(q));
        const matchLangs = guide.languages.some((l) => l.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchState && !matchBio && !matchSpecs && !matchLangs) {
          return false;
        }
      }

      // 2. State
      if (filters.selectedState !== 'All' && guide.state !== filters.selectedState) {
        return false;
      }

      // 3. City
      if (filters.selectedCity !== 'All' && guide.city !== filters.selectedCity) {
        return false;
      }

      // 4. Specific Destination
      if (filters.selectedDestination !== 'All') {
        const servesDest = guide.destinationsServed.includes(filters.selectedDestination);
        if (!servesDest) return false;
      }

      // 5. Language
      if (filters.selectedLanguage !== 'All' && !guide.languages.includes(filters.selectedLanguage)) {
        return false;
      }

      // 6. Specialisation
      if (filters.selectedSpecialisation !== 'All' && !guide.specialisations.includes(filters.selectedSpecialisation)) {
        return false;
      }

      // 7. Max Price
      if (filters.maxPrice < 5000) {
        const guidePrice = guide.pricePerTour || (guide.pricePerHour ? guide.pricePerHour * 4 : 2000);
        if (guidePrice > filters.maxPrice) {
          return false;
        }
      }

      // 8. Verified Only
      if (filters.verifiedOnly && guide.verificationStatus !== 'verified') {
        return false;
      }

      return true;
    });
  }, [tourGuides, filters]);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md mb-3 shadow-2xs">
              <Users className="w-3.5 h-3.5" />
              <span>Living Scholarship & Local Lore</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
              Local Tour Guide Directory
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Connect directly with verified local guides, archaeologists, and cultural experts across India’s historical monuments, wildlife reserves, and ancient cities.
            </p>

            {/* Transparency Note */}
            <div className="mt-4 p-3 bg-white border border-[#E0D7C9] rounded-xl flex items-start gap-2.5 text-xs text-gray-600 shadow-2xs">
              <Info className="w-4 h-4 text-[#F07843] shrink-0 mt-0.5" />
              <span>
                <strong>Directory Integrity:</strong> Guides marked with <strong>Verified</strong> have demonstrated regional expertise or official credentials. Demonstration samples are explicitly indicated. Enquiries connect you directly with zero middleman commissions.
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAdminConsole(!showAdminConsole)}
              className="bg-white hover:bg-[#FAF8F2] text-gray-700 border border-[#E0D7C9] text-xs font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#174A35]" />
              <span>{showAdminConsole ? 'Hide Admin Console' : 'Admin Moderation'}</span>
            </button>

            <button
              onClick={() => setRegisterModalOpen(true)}
              className="bg-[#F07843] hover:bg-[#DE632E] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register as a Guide</span>
            </button>
          </div>
        </div>

        {/* Administrator Moderation Panel (Conditionally visible or toggled) */}
        {showAdminConsole && (
          <div className="animate-fade-in">
            <GuideApprovalPanel />
          </div>
        )}

        {/* Filters */}
        <TourGuideFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalResultsCount={filteredGuides.length}
          availableStates={availableStates}
          availableCities={availableCities}
          availableLanguages={availableLanguages}
          availableSpecialisations={availableSpecialisations}
        />

        {/* Guides Grid */}
        <TourGuideGrid
          guides={filteredGuides}
          onEnquire={(guide) => setSelectedGuideForEnquiry(guide)}
          onResetFilters={handleResetFilters}
        />

        {/* Trust & Verification Information Section */}
        <div className="bg-[#174A35] text-white rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-white/10 px-3 py-1 rounded-md mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F07843]" />
              <span>Platform Ethics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Why Book Directly Through BharatExplore Guides?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
              Mainstream travel agencies often deduct 30% to 50% in commissions from local guides. BharatExplore facilitates transparent, direct connections so the full financial benefit remains with indigenous hosts, scholars, and storytellers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-[#F07843]">Direct Contact</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Send personalized tour objectives and negotiate customized itineraries directly without intermediate agents.
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-[#F07843]">Living Heritage</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Learn from epigraphists, naturalists, and local elders who have grown up within the monuments and forest trails.
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-[#F07843]">Fair Compensation</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Zero hidden booking surcharges ensure fair livelihoods for licensed guides and regional storytellers.
              </p>
            </div>
          </div>
        </div>

        {/* Modals */}
        <GuideRegistrationModal
          isOpen={isRegisterModalOpen}
          onClose={() => setRegisterModalOpen(false)}
        />

        {selectedGuideForEnquiry && (
          <Modal
            isOpen={!!selectedGuideForEnquiry}
            onClose={() => setSelectedGuideForEnquiry(null)}
            title={`Enquire with ${selectedGuideForEnquiry.displayName}`}
            subtitle={`${selectedGuideForEnquiry.city}, ${selectedGuideForEnquiry.state}`}
            maxWidth="max-w-xl"
          >
            <TourEnquiryForm
              guide={selectedGuideForEnquiry}
              onSuccess={() => {
                setTimeout(() => setSelectedGuideForEnquiry(null), 2500);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};
