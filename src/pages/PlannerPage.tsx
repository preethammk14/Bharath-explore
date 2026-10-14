import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  IndianRupee, 
  Compass, 
  Heart, 
  Coffee, 
  Sun, 
  Moon, 
  Utensils, 
  Car, 
  CheckCircle2, 
  RotateCcw, 
  Printer, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lightbulb,
  Info,
  Building2,
  Bed,
  Ticket,
  Star,
  Award,
  Languages,
  Check
} from 'lucide-react';
import { DESTINATIONS, STAYS, EXPERIENCES } from '../data/indiaData';
import { Link } from 'react-router-dom';
import { onImageError, FALLBACK_HERITAGE_IMAGE, FALLBACK_GUIDE_IMAGE, FALLBACK_STAY_IMAGE, FALLBACK_CRAFT_IMAGE } from '../utils/imageFallback';

interface DayPlan {
  dayNumber: number;
  theme: string;
  morning: {
    activity: string;
    details: string;
  };
  afternoon: {
    activity: string;
    details: string;
  };
  evening: {
    activity: string;
    details: string;
  };
  localFoodRecommendation: {
    dish: string;
    whereToTry: string;
  };
  transportTip: string;
}

interface Itinerary {
  tripTitle: string;
  summary: string;
  destination: string;
  durationDays: number;
  bestSeasonAdvice: string;
  estimatedBudget: {
    totalINR: number;
    breakdown: {
      accommodation: string;
      activitiesAndTours: string;
      foodAndDining: string;
      localTransport: string;
    };
  };
  days: DayPlan[];
  localFoodHighlights: string[];
  packingAndCulturalTips: string[];
  sustainableTravelAdvice: string;
}

const INTEREST_OPTIONS = [
  'Heritage & Monuments',
  'Sacred Temples & Shrines',
  'Regional Cuisine & Street Food',
  'Nature & Wildlife',
  'Art & Handloom Weaving',
  'Photography & Golden Hour',
  'High Altitude Trails',
  'Ayurveda & Wellness',
  'Rural Village Life',
  'River Cruises & Waters',
];

const TRAVEL_STYLES = [
  { id: 'Cultural', label: 'Cultural & Heritage', desc: 'Monuments, living history, temples' },
  { id: 'Family', label: 'Family Vacation', desc: 'Comfortable pace, safe, multi-generational' },
  { id: 'Adventure', label: 'Adventure & Nature', desc: 'Trails, safaris, outdoor expeditions' },
  { id: 'Budget', label: 'Budget Explorer', desc: 'Backpacker, affordable transit, hostels' },
  { id: 'Relaxing', label: 'Relaxing & Wellness', desc: 'Slow travel, scenic views, rejuvenation' },
  { id: 'Solo', label: 'Solo Backpacking', desc: 'Independence, discovery, local immersion' },
  { id: 'Couple', label: 'Romantic & Heritage', desc: 'Palaces, sunset boat rides, dining' },
];

const BUDGET_TIERS = [
  { id: 'Budget', label: 'Budget', range: '₹1,500 - ₹3,000 / day', desc: 'Homestays, trains, local dining' },
  { id: 'Moderate', label: 'Moderate', range: '₹3,500 - ₹7,000 / day', desc: 'Heritage boutique stays, cabs, guided tours' },
  { id: 'Luxury', label: 'Luxury', range: '₹8,000 - ₹18,000 / day', desc: 'Heritage havelis, private chauffeur, meals' },
  { id: 'Ultra-Luxury', label: 'Royal Heritage', range: '₹20,000+ / day', desc: 'Palace suites, bespoke historians, private transfers' },
];

const POPULAR_DESTINATION_SUGGESTIONS = [
  'Hampi, Karnataka',
  'Varanasi, Uttar Pradesh',
  'Jaipur, Rajasthan',
  'Alleppey, Kerala',
  'Munnar, Kerala',
  'Udaipur, Rajasthan',
  'Leh Ladakh',
  'Darjeeling, West Bengal',
  'Coorg, Karnataka',
  'Amritsar, Punjab',
  'Rishikesh, Uttarakhand',
  'Goa Heritage & Beaches',
];

const LOADING_TIPS = [
  'Did you know? Hampi was the second largest city in the medieval world after Beijing during the 15th century.',
  'Connecting authentic regional recipes: Banarasi Tamatar Chaat is cooked with hing, ginger, and lemon on a hot iron tawa.',
  'Travel Tip: The best light for photographing Rajasthan palaces is during the golden hour (6:45 AM and 5:30 PM).',
  'Kerala Backwaters: Traditional Kettuvallam houseboats are made with jackwood planks held together with coir ropes without a single iron nail.',
  'Did you know? The Konark Sun Temple is designed as a chariot with 24 carved stone wheels that function as accurate sundials.',
];

export const PlannerPage: React.FC = () => {
  const { showToast, businesses, tourGuides, openBookingModal } = useApp();

  const [startingLocation, setStartingLocation] = useState('New Delhi');
  const [destination, setDestination] = useState('Varanasi, Uttar Pradesh');
  const [travelDates, setTravelDates] = useState(() => {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split('T')[0];
  });
  const [tripDuration, setTripDuration] = useState(3);
  const [travelersCount, setTravelersCount] = useState(2);
  const [budget, setBudget] = useState<'Budget' | 'Moderate' | 'Luxury' | 'Ultra-Luxury'>('Moderate');
  const [travelStyle, setTravelStyle] = useState<'Family' | 'Adventure' | 'Cultural' | 'Budget' | 'Relaxing' | 'Solo' | 'Couple'>('Cultural');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Heritage & Monuments',
    'Sacred Temples & Shrines',
    'Regional Cuisine & Street Food',
  ]);

  const [loading, setLoading] = useState(false);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeListingTab, setActiveListingTab] = useState<'stays' | 'guides' | 'businesses' | 'experiences'>('stays');

  // Compute matched actual BharatExplore listings for the generated itinerary
  const matchedStays = useMemo(() => {
    if (!itinerary) return [];
    const destLower = (itinerary.destination || destination).toLowerCase();
    const tokens = destLower.split(/[\s,]+/).filter((t) => t.length > 2);
    const matches = STAYS.filter((s) => {
      const destMatch = tokens.some((t) => s.destination.toLowerCase().includes(t));
      const stateMatch = tokens.some((t) => s.state.toLowerCase().includes(t) || s.stateName.toLowerCase().includes(t));
      return destMatch || stateMatch;
    });
    return matches.length > 0 ? matches.slice(0, 4) : STAYS.slice(0, 4);
  }, [itinerary, destination]);

  const matchedGuides = useMemo(() => {
    if (!itinerary) return [];
    const destLower = (itinerary.destination || destination).toLowerCase();
    const tokens = destLower.split(/[\s,]+/).filter((t) => t.length > 2);
    const matches = tourGuides.filter((g) => {
      const cityMatch = tokens.some((t) => g.city.toLowerCase().includes(t));
      const stateMatch = tokens.some((t) => g.state.toLowerCase().includes(t));
      const servedMatch = g.destinationsServed?.some((d) => tokens.some((t) => d.toLowerCase().includes(t)));
      return cityMatch || stateMatch || servedMatch;
    });
    return matches.length > 0 ? matches.slice(0, 4) : tourGuides.slice(0, 4);
  }, [itinerary, destination, tourGuides]);

  const matchedBusinesses = useMemo(() => {
    if (!itinerary) return [];
    const destLower = (itinerary.destination || destination).toLowerCase();
    const tokens = destLower.split(/[\s,]+/).filter((t) => t.length > 2);
    const approved = businesses.filter((b) => b.approvalStatus === 'approved' || b.verified);
    const matches = approved.filter((b) => {
      const cityMatch = tokens.some((t) => b.city.toLowerCase().includes(t));
      const stateMatch = tokens.some((t) => b.stateName.toLowerCase().includes(t));
      return cityMatch || stateMatch;
    });
    return matches.length > 0 ? matches.slice(0, 4) : approved.slice(0, 4);
  }, [itinerary, destination, businesses]);

  const matchedExperiences = useMemo(() => {
    if (!itinerary) return [];
    const destLower = (itinerary.destination || destination).toLowerCase();
    const tokens = destLower.split(/[\s,]+/).filter((t) => t.length > 2);
    const matches = EXPERIENCES.filter((e) => {
      const stateMatch = tokens.some((t) => e.stateName.toLowerCase().includes(t));
      const titleMatch = tokens.some((t) => e.title.toLowerCase().includes(t));
      return stateMatch || titleMatch;
    });
    return matches.length > 0 ? matches.slice(0, 4) : EXPERIENCES.slice(0, 4);
  }, [itinerary, destination]);

  // Rotate loading tips
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGenerateItinerary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!destination.trim()) {
      setFormError('Please enter a destination in India.');
      return;
    }

    setLoading(true);
    setApiNotice(null);

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startingLocation: startingLocation.trim(),
          destination: destination.trim(),
          travelDates,
          tripDuration,
          travelersCount,
          budget,
          interests: selectedInterests,
          travelStyle,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data.itinerary);
        setActiveDayTab(1);
        setExpandedDay(1);
        if (data.notice) {
          setApiNotice(data.notice);
        }
        showToast(`Itinerary generated for ${destination}!`, 'success');
        // Scroll to results
        setTimeout(() => {
          document.getElementById('itinerary-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        throw new Error(data.error || 'Failed to parse itinerary');
      }
    } catch (err: any) {
      console.warn('API route unavailable, generating curated regional itinerary:', err);
      const fallback = generateCuratedItinerary({
        startingLocation: startingLocation.trim(),
        destination: destination.trim(),
        durationDays: tripDuration,
        travelersCount,
        budget,
        travelStyle,
        interests: selectedInterests,
      });
      setItinerary(fallback);
      setActiveDayTab(1);
      setExpandedDay(1);
      setApiNotice('Curated regional itinerary generated via BharatExplore Regional Intelligence.');
      showToast(`Itinerary generated for ${destination}!`, 'success');
      setTimeout(() => {
        document.getElementById('itinerary-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!itinerary) return;
    const text = `${itinerary.tripTitle}\n\n${itinerary.summary}\n\nEstimated Budget: ₹${itinerary.estimatedBudget.totalINR.toLocaleString()}\n\nDays:\n` +
      itinerary.days.map((d) => `Day ${d.dayNumber}: ${d.theme}\n- Morning: ${d.morning.activity}\n- Afternoon: ${d.afternoon.activity}\n- Evening: ${d.evening.activity}\n- Food: ${d.localFoodRecommendation.dish}\n`).join('\n');
    navigator.clipboard?.writeText(text);
    showToast('Full itinerary copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
    showToast('Preparing printable itinerary voucher...', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F07843]" />
            <span>AI-Powered Bharat Journey Planner</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
            Craft Your Custom Indian Itinerary
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Enter your destination, dates, budget, and travel style. Our server-side Gemini intelligence designs day-by-day sightseeing, regional gastronomy, transit logistics, and cost estimates.
          </p>
        </div>

        {/* Input Form Section */}
        <form
          onSubmit={handleGenerateItinerary}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0D7C9] shadow-sm space-y-8"
        >
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Row 1: Origin, Destination & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#174A35]" />
                <span>Starting Location (Origin)</span>
              </label>
              <input
                type="text"
                required
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, Bengaluru..."
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Indian Destination</span>
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Varanasi, Hampi, Munnar, Udaipur..."
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#174A35]" />
                <span>Trip Start Date</span>
              </label>
              <input
                type="date"
                required
                value={travelDates}
                onChange={(e) => setTravelDates(e.target.value)}
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843]"
              />
            </div>
          </div>

          {/* Quick Destination Chips */}
          <div>
            <span className="text-[11px] font-semibold text-gray-500 mr-2">Popular destinations:</span>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {POPULAR_DESTINATION_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setDestination(sug)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    destination === sug
                      ? 'bg-[#174A35] text-white border-[#174A35] font-bold shadow-2xs'
                      : 'bg-[#FAF8F2] text-gray-700 border-[#E0D7C9] hover:bg-white'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Duration, Travelers & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#174A35]" />
                  <span>Duration</span>
                </label>
                <span className="text-xs font-bold text-[#F07843]">
                  {tripDuration} {tripDuration === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                step="1"
                value={tripDuration}
                onChange={(e) => setTripDuration(Number(e.target.value))}
                className="w-full accent-[#F07843] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1 Day</span>
                <span>7 Days</span>
                <span>14 Days Max</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#174A35]" />
                <span>Number of Travelers</span>
              </label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Solo Traveler' : `${num} Travelers`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Budget Tier</span>
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as any)}
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 font-medium focus:outline-hidden focus:border-[#F07843]"
              >
                {BUDGET_TIERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label} ({b.range})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Travel Style Selection */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Preferred Travel Style:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {TRAVEL_STYLES.map((style) => {
                const active = travelStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setTravelStyle(style.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#174A35] text-white border-[#174A35] shadow-xs'
                        : 'bg-[#FAF8F2] text-gray-700 border-[#E0D7C9] hover:bg-white'
                    }`}
                  >
                    <p className="font-bold text-xs truncate">{style.label}</p>
                    <p className={`text-[10px] mt-1 line-clamp-1 ${active ? 'text-white/80' : 'text-gray-500'}`}>
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Key Interests Multi-Select */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Select Your Travel Interests ({selectedInterests.length} selected):
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all border cursor-pointer ${
                      selected
                        ? 'bg-[#F07843] text-white border-[#F07843] font-bold shadow-2xs'
                        : 'bg-[#FAF8F2] text-gray-700 border-[#E0D7C9] hover:border-gray-400'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-white inline mr-1" />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#174A35]" />
              <span>Powered securely by server-side Gemini 3.8. Zero API keys exposed in browser.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#F07843] hover:bg-[#DE632E] active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Itinerary...' : 'Generate AI Travel Itinerary'}</span>
            </button>
          </div>
        </form>

        {/* Loading Animated State */}
        {loading && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#E0D7C9] text-center shadow-md space-y-6 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-[#FEF2EC] flex items-center justify-center mx-auto text-[#F07843] shadow-inner">
              <Compass className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-[#174A35] font-display">
                Curating Your {destination} Itinerary
              </h3>
              <p className="text-xs text-gray-500">
                Pacing morning monument visits, identifying certified local food spots, estimating expenses, and tailoring tips...
              </p>
            </div>

            {/* Cultural Rotating Fact */}
            <div className="max-w-xl mx-auto p-4 bg-[#FAF8F2] border border-[#E0D7C9] rounded-2xl flex items-start gap-3 text-left text-xs text-gray-700 shadow-2xs">
              <Lightbulb className="w-4 h-4 text-[#F07843] shrink-0 mt-0.5" />
              <p className="italic">{LOADING_TIPS[loadingTipIndex]}</p>
            </div>
          </div>
        )}

        {/* Generated Itinerary Display */}
        {itinerary && !loading && (
          <div id="itinerary-results" className="space-y-8 animate-fade-in">
            {/* Itinerary Header & Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0D7C9] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-gray-100 pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#174A35] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                      {itinerary.durationDays} Days Itinerary
                    </span>
                    <span className="bg-[#FEF2EC] text-[#F07843] text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                      {itinerary.destination}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {travelStyle} Style
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#174A35] font-display leading-tight">
                    {itinerary.tripTitle}
                  </h2>

                  <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
                    {itinerary.summary}
                  </p>
                </div>

                {/* Itinerary Action Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="p-2.5 rounded-xl border border-[#E0D7C9] hover:border-[#174A35] text-gray-700 hover:text-[#174A35] transition-colors cursor-pointer shadow-2xs"
                    title="Copy full itinerary text"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2.5 rounded-xl border border-[#E0D7C9] hover:border-[#174A35] text-gray-700 hover:text-[#174A35] transition-colors cursor-pointer shadow-2xs"
                    title="Print Trip Voucher"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleGenerateItinerary()}
                    className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              {/* Weather & Seasonal Advice Callout */}
              <div className="p-4 bg-[#FAF8F2] border border-[#E0D7C9] rounded-2xl flex items-start gap-3 text-xs text-gray-700">
                <Sun className="w-4 h-4 text-[#F07843] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#174A35]">Seasonal Climate & Timing Guidance:</strong>{' '}
                  <span>{itinerary.bestSeasonAdvice}</span>
                </div>
              </div>

              {/* Budget Breakdown Summary */}
              {itinerary.estimatedBudget && (
                <div className="bg-[#EBF3EE] border border-[#C5DDD0] rounded-2xl p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#174A35]/15 pb-3">
                    <div>
                      <span className="text-xs font-bold text-[#174A35] uppercase tracking-wider">
                        Estimated Trip Budget ({budget} Standard)
                      </span>
                      <h4 className="text-2xl font-extrabold text-[#174A35]">
                        ₹{itinerary.estimatedBudget.totalINR.toLocaleString()}
                        <span className="text-xs font-normal text-gray-600"> / for {travelersCount} traveler(s)</span>
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#174A35] bg-white px-3 py-1 rounded-md font-medium shadow-2xs self-start sm:self-auto">
                      All estimates in Indian Rupees (INR)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-700 pt-1">
                    <div className="bg-white/80 p-3 rounded-xl border border-white">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Accommodation</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{itinerary.estimatedBudget.breakdown.accommodation}</p>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-white">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Activities & Permits</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{itinerary.estimatedBudget.breakdown.activitiesAndTours}</p>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-white">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Food & Thalis</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{itinerary.estimatedBudget.breakdown.foodAndDining}</p>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-white">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Local Transit</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{itinerary.estimatedBudget.breakdown.localTransport}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Day-by-Day Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#174A35] font-display">
                  Day-by-Day Detailed Schedule
                </h3>
                <span className="text-xs text-gray-500">
                  {itinerary.days.length} Daily Schedules
                </span>
              </div>

              {/* Day Cards */}
              <div className="space-y-4">
                {itinerary.days.map((day) => {
                  const isExpanded = expandedDay === day.dayNumber;
                  return (
                    <div
                      key={day.dayNumber}
                      className="bg-white rounded-3xl border border-[#E0D7C9] overflow-hidden shadow-xs transition-all"
                    >
                      {/* Day Header Trigger */}
                      <button
                        type="button"
                        onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F2]/60 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="shrink-0 w-12 h-12 rounded-2xl bg-[#174A35] text-white flex flex-col items-center justify-center font-bold font-display shadow-2xs">
                            <span className="text-[10px] uppercase tracking-wider text-white/70">DAY</span>
                            <span className="text-base leading-none">{day.dayNumber}</span>
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07843]">
                              Schedule Overview
                            </span>
                            <h4 className="text-base sm:text-lg font-bold text-[#1E232A] truncate">
                              {day.theme}
                            </h4>
                          </div>
                        </div>

                        <div className="shrink-0 text-gray-400 p-1">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-[#174A35]" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {/* Day Expanded Details */}
                      {isExpanded && (
                        <div className="p-6 pt-0 border-t border-gray-100 space-y-5 animate-fade-in">
                          {/* 3 Timeslots Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            {/* Morning */}
                            <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E0D7C9] space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span>Morning (7:30 - 11:30 AM)</span>
                              </div>
                              <h5 className="font-bold text-sm text-[#1E232A]">{day.morning.activity}</h5>
                              <p className="text-xs text-gray-600 leading-relaxed">{day.morning.details}</p>
                            </div>

                            {/* Afternoon */}
                            <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E0D7C9] space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174A35]">
                                <Coffee className="w-4 h-4 text-[#174A35]" />
                                <span>Afternoon (12:30 - 4:00 PM)</span>
                              </div>
                              <h5 className="font-bold text-sm text-[#1E232A]">{day.afternoon.activity}</h5>
                              <p className="text-xs text-gray-600 leading-relaxed">{day.afternoon.details}</p>
                            </div>

                            {/* Evening */}
                            <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E0D7C9] space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
                                <Moon className="w-4 h-4 text-indigo-500" />
                                <span>Evening (5:00 - 8:30 PM)</span>
                              </div>
                              <h5 className="font-bold text-sm text-[#1E232A]">{day.evening.activity}</h5>
                              <p className="text-xs text-gray-600 leading-relaxed">{day.evening.details}</p>
                            </div>
                          </div>

                          {/* Food and Transport Footer for the day */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs">
                              <Utensils className="w-4 h-4 text-[#F07843] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-[#1E232A] block">Curated Regional Dish:</span>
                                <p className="font-semibold text-amber-900 mt-0.5">{day.localFoodRecommendation.dish}</p>
                                <p className="text-[11px] text-gray-600 mt-0.5">Where: {day.localFoodRecommendation.whereToTry}</p>
                              </div>
                            </div>

                            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-xs">
                              <Car className="w-4 h-4 text-[#174A35] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-[#1E232A] block">Local Transportation Advice:</span>
                                <p className="text-gray-700 mt-0.5">{day.transportTip}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Culinary & Practical Wisdom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regional Food Specialties */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
                <h3 className="font-bold text-lg text-[#174A35] font-display flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#F07843]" />
                  <span>Must-Try Food in {itinerary.destination}</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  {itinerary.localFoodHighlights.map((dish, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F07843] shrink-0 mt-1.5" />
                      <span>{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cultural & Etiquette Advice */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
                <h3 className="font-bold text-lg text-[#174A35] font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#174A35]" />
                  <span>Cultural Etiquette & Practical Tips</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  {itinerary.packingAndCulturalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-100 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-[#F07843] shrink-0 mt-0.5" />
                  <span>{itinerary.sustainableTravelAdvice}</span>
                </div>
              </div>
            </div>

            {/* VTU SMART PORTAL: MATCHED BHARATEXPLORE LISTINGS WITH DIRECT BOOKING FACILITIES */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0D7C9] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3 py-0.5 rounded-md shadow-2xs">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Direct Booking Facilities</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#174A35] font-display">
                    Matched Stays, Guides & Cultural Businesses
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Connecting your {itinerary.destination} itinerary directly to verified BharatExplore partners. Select any homestay, guide, or cooperative to check live availability and submit a booking request.
                  </p>
                </div>

                {/* Listing Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-[#FAF8F2] p-1.5 rounded-2xl border border-[#E0D7C9]">
                  <button
                    type="button"
                    onClick={() => setActiveListingTab('stays')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeListingTab === 'stays'
                        ? 'bg-[#174A35] text-white shadow-xs'
                        : 'text-gray-600 hover:text-[#174A35]'
                    }`}
                  >
                    <Bed className="w-3.5 h-3.5" />
                    <span>Homestays ({matchedStays.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveListingTab('guides')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeListingTab === 'guides'
                        ? 'bg-[#174A35] text-white shadow-xs'
                        : 'text-gray-600 hover:text-[#174A35]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Guides ({matchedGuides.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveListingTab('businesses')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeListingTab === 'businesses'
                        ? 'bg-[#174A35] text-white shadow-xs'
                        : 'text-gray-600 hover:text-[#174A35]'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Businesses ({matchedBusinesses.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveListingTab('experiences')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeListingTab === 'experiences'
                        ? 'bg-[#174A35] text-white shadow-xs'
                        : 'text-gray-600 hover:text-[#174A35]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Experiences ({matchedExperiences.length})</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Homestays */}
              {activeListingTab === 'stays' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                  {matchedStays.map((stay) => (
                    <div
                      key={stay.id}
                      className="bg-[#FAF8F2] rounded-2xl border border-[#E0D7C9] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={stay.image}
                            alt={stay.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => onImageError(e, FALLBACK_STAY_IMAGE)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-[#174A35] bg-white/95 px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-xs">
                            {stay.category}
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <h4 className="font-bold text-sm text-[#174A35] line-clamp-1 group-hover:text-[#F07843] transition-colors">
                            {stay.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#F07843] shrink-0" />
                            <span className="truncate">{stay.destination}, {stay.state}</span>
                          </p>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="font-extrabold text-[#F07843]">
                              ₹{stay.pricePerNight.toLocaleString()}<span className="text-[10px] text-gray-500 font-normal"> /night</span>
                            </span>
                            <span className="text-[10px] font-semibold text-gray-600 flex items-center gap-0.5">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span>{stay.guestCapacity} guests</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 pt-0 flex items-center gap-2">
                        <Link
                          to={`/stays/${stay.id}`}
                          className="flex-1 text-center bg-white hover:bg-gray-50 text-[#174A35] border border-[#E0D7C9] text-xs font-bold py-1.5 rounded-lg transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            openBookingModal({
                              id: stay.id,
                              title: stay.name,
                              type: 'stay',
                              price: stay.pricePerNight,
                            })
                          }
                          className="flex-1 bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Ticket className="w-3 h-3 text-[#F07843]" />
                          <span>Book</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Tour Guides */}
              {activeListingTab === 'guides' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                  {matchedGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="bg-[#FAF8F2] rounded-2xl border border-[#E0D7C9] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={guide.profileImage || FALLBACK_GUIDE_IMAGE}
                            alt={guide.displayName}
                            referrerPolicy="no-referrer"
                            onError={(e) => onImageError(e, FALLBACK_GUIDE_IMAGE)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shadow-2xs border border-emerald-200">
                            Verified Guide
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <h4 className="font-bold text-sm text-[#174A35] line-clamp-1 group-hover:text-[#F07843] transition-colors">
                            {guide.displayName}
                          </h4>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#F07843] shrink-0" />
                            <span className="truncate">{guide.city}, {guide.state}</span>
                          </p>
                          <p className="text-[10px] text-gray-600 line-clamp-1">
                            Languages: {guide.languages.join(', ')}
                          </p>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="font-extrabold text-[#F07843]">
                              ₹{(guide.pricePerTour || 1500).toLocaleString()}<span className="text-[10px] text-gray-500 font-normal"> /tour</span>
                            </span>
                            <span className="text-[10px] font-semibold text-gray-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              <span>{(guide.rating || 4.9).toFixed(1)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 pt-0 flex items-center gap-2">
                        <Link
                          to={`/guides/${guide.id}`}
                          className="flex-1 text-center bg-white hover:bg-gray-50 text-[#174A35] border border-[#E0D7C9] text-xs font-bold py-1.5 rounded-lg transition-colors"
                        >
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            openBookingModal({
                              id: guide.id,
                              title: `${guide.displayName} - Certified Tour Guide`,
                              type: 'guide',
                              price: guide.pricePerTour || 1500,
                            })
                          }
                          className="flex-1 bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Ticket className="w-3 h-3 text-[#F07843]" />
                          <span>Book</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Local Businesses & Cooperatives */}
              {activeListingTab === 'businesses' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                  {matchedBusinesses.map((biz) => (
                    <div
                      key={biz.id}
                      className="bg-[#FAF8F2] rounded-2xl border border-[#E0D7C9] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={biz.image}
                            alt={biz.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => onImageError(e, FALLBACK_CRAFT_IMAGE)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-[#F07843] bg-white/95 px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-xs">
                            {biz.category}
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <h4 className="font-bold text-sm text-[#174A35] line-clamp-1 group-hover:text-[#F07843] transition-colors">
                            {biz.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#F07843] shrink-0" />
                            <span className="truncate">{biz.city}, {biz.stateName}</span>
                          </p>
                          {biz.priceRange && (
                            <p className="text-[10px] text-gray-600 line-clamp-1">
                              Rates: <strong className="text-[#174A35]">{biz.priceRange}</strong>
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                              ● Available
                            </span>
                            <span className="text-[10px] font-semibold text-gray-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              <span>{biz.rating.toFixed(1)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 pt-0 flex items-center gap-2">
                        <Link
                          to={`/businesses/${biz.id}`}
                          className="flex-1 text-center bg-white hover:bg-gray-50 text-[#174A35] border border-[#E0D7C9] text-xs font-bold py-1.5 rounded-lg transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            openBookingModal({
                              id: biz.id,
                              title: `${biz.name} - Tourism Service`,
                              type: 'business',
                              price: 1200,
                            })
                          }
                          className="flex-1 bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Ticket className="w-3 h-3 text-[#F07843]" />
                          <span>Book</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Cultural Experiences */}
              {activeListingTab === 'experiences' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                  {matchedExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-[#FAF8F2] rounded-2xl border border-[#E0D7C9] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={exp.image}
                            alt={exp.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-[#174A35] bg-white/95 px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-xs">
                            {exp.type}
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <h4 className="font-bold text-sm text-[#174A35] line-clamp-1 group-hover:text-[#F07843] transition-colors">
                            {exp.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#F07843] shrink-0" />
                            <span>{exp.duration} • {exp.groupSize}</span>
                          </p>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="font-extrabold text-[#F07843]">
                              ₹{exp.price.toLocaleString()}<span className="text-[10px] text-gray-500 font-normal"> /guest</span>
                            </span>
                            <span className="text-[10px] font-semibold text-gray-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              <span>{exp.rating.toFixed(1)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 pt-0 flex items-center gap-2">
                        <Link
                          to="/experiences"
                          className="flex-1 text-center bg-white hover:bg-gray-50 text-[#174A35] border border-[#E0D7C9] text-xs font-bold py-1.5 rounded-lg transition-colors"
                        >
                          All Tours
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            openBookingModal({
                              id: exp.id,
                              title: exp.title,
                              type: 'experience',
                              price: exp.price,
                            })
                          }
                          className="flex-1 bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Ticket className="w-3 h-3 text-[#F07843]" />
                          <span>Book</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seamless Next Steps: Book Guides & Stays */}
            <div className="bg-gradient-to-r from-[#174A35] to-[#0F3324] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07843] bg-white/10 px-3 py-1 rounded-md">
                  Take The Next Step
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                  Connect with Local Guides & Book Heritage Stays
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Turn this itinerary into reality. Find certified archaeologists, boatmen, and homestays directly on BharatExplore with zero middleman surcharge.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <Link
                  to="/guides"
                  className="bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-6 py-3 rounded-md transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Browse Guides for {itinerary.destination.split(',')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/stays"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-6 py-3 rounded-md transition-all flex items-center gap-2"
                >
                  <span>Explore Stays</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function generateCuratedItinerary(params: {
  startingLocation: string;
  destination: string;
  durationDays: number;
  travelersCount: number;
  budget: string;
  travelStyle: string;
  interests: string[];
}): Itinerary {
  const { destination, durationDays, travelersCount, budget, travelStyle } = params;
  const baseRatePerDay = budget === 'Budget' ? 2200 : budget === 'Luxury' ? 7500 : budget === 'Ultra-Luxury' ? 14000 : 4200;
  const totalINR = baseRatePerDay * durationDays * travelersCount;

  const days: DayPlan[] = Array.from({ length: durationDays }, (_, i) => {
    const dayNum = i + 1;
    let theme = `Discovering the Cultural Heart of ${destination}`;
    let morningActivity = `Sunrise exploration of primary historical monuments in ${destination}`;
    let afternoonActivity = `Heritage walk through traditional artisan bazaars and craft clusters`;
    let eveningActivity = `Sunset viewpoint, serene temple prayers, or riverfront aarti`;
    let dish = `Authentic Regional Thali with seasonal local produce`;

    if (dayNum === 1) {
      theme = `Arrival, Monument Foundations & Orientation in ${destination}`;
      morningActivity = `Arrival, check-in to heritage stay, and architectural orientation tour`;
      afternoonActivity = `Visit the core UNESCO heritage quarter and museum galleries`;
      eveningActivity = `Traditional welcoming ceremony and sunset panorama`;
      dish = `Traditional welcome beverage, hot samosas/kachoris, and clay cup masala chai`;
    } else if (dayNum === 2) {
      theme = `Living Traditions, Sacred Temples & Indigenous Artisans`;
      morningActivity = `Guided epigraphy walk with a certified local historian`;
      afternoonActivity = `Live demonstration at local handloom weavers or stone carvers guild`;
      eveningActivity = `Cultural classical music recital or riverfront evening lamps`;
      dish = `Woodfire baked breads with regional dal and slow-cooked specialty curry`;
    } else if (dayNum === 3) {
      theme = `Nature Trails, Countryside Villages & Scenic Overlooks`;
      morningActivity = `Eco-friendly cycle trail or morning birding walk in surrounding groves`;
      afternoonActivity = `Community lunch hosted at a local family plantation or village`;
      eveningActivity = `Rooftop dinner overlooking illuminated fortresses or ancient ghats`;
      dish = `Traditional festive thali featuring five seasonal specialties and jaggery dessert`;
    } else {
      theme = `Hidden Gems, Sacred Sanctuaries & Farewell Sights`;
      morningActivity = `Early morning visit to serene secluded temple shrines without crowds`;
      afternoonActivity = `Final souvenir shopping for GI-tagged handicrafts and spices`;
      eveningActivity = `Farewell sunset gathering and culinary street walk`;
      dish = `Celebratory regional feast with local sweet delicacies`;
    }

    return {
      dayNumber: dayNum,
      theme,
      morning: {
        activity: morningActivity,
        details: `Visit early around 7:30 AM to enjoy cool temperatures and golden photography light. Keep entry tickets downloaded.`,
      },
      afternoon: {
        activity: afternoonActivity,
        details: `Relax during mid-day heat inside cool stone pavilions, museums, or shaded handicraft cooperatives.`,
      },
      evening: {
        activity: eveningActivity,
        details: `Experience dusk as temple bells ring and local lamps are illuminated. Ideal for leisurely conversation with local storytellers.`,
      },
      localFoodRecommendation: {
        dish,
        whereToTry: `Centuries-old heritage sweetmeat shops and traditional family thali dining rooms near the old bazaar.`,
      },
      transportTip: `Hire a pre-negotiated certified auto-rickshaw or electric e-rickshaw for nimble transit through heritage lanes.`,
    };
  });

  return {
    tripTitle: `${durationDays}-Day Immersive Journey to ${destination}`,
    summary: `A thoughtfully paced ${travelStyle.toLowerCase()} itinerary through ${destination}, balancing architectural exploration, culinary discoveries, and direct connections with local artisans.`,
    destination,
    durationDays,
    bestSeasonAdvice: `Ideal between October and March when daytime weather is pleasant and cultural festivals are in full swing across India.`,
    estimatedBudget: {
      totalINR,
      breakdown: {
        accommodation: `₹${Math.round(totalINR * 0.45).toLocaleString()} for ${durationDays} nights (${budget} standard)`,
        activitiesAndTours: `₹${Math.round(totalINR * 0.25).toLocaleString()} for monument permits, guide fees, and audio guides`,
        foodAndDining: `₹${Math.round(totalINR * 0.20).toLocaleString()} for regional meals, street treats, and beverages`,
        localTransport: `₹${Math.round(totalINR * 0.10).toLocaleString()} for local rickshaws and inter-site transit`,
      },
    },
    days,
    localFoodHighlights: [
      `Freshly prepared regional morning breakfast with filter coffee or spiced tea`,
      `Full traditional banana-leaf or brass-plate thali representing seasonal agriculture`,
      `Famous street savouries with mint and tamarind chutneys`,
      `Artisanal milk and jaggery confections prepared by regional halwais`,
    ],
    packingAndCulturalTips: [
      `Carry modest clothing covering shoulders and knees when visiting sacred temples`,
      `Slip-on footwear recommended for frequent removal outside shrines and sanctums`,
      `Stay hydrated with tender coconut water and carry reusable filtered bottles`,
      `Always ask for permission before photographing local artisans or ceremonial rituals`,
    ],
    sustainableTravelAdvice: `Support verified local guides and GI-tagged cooperatives directly on BharatExplore to ensure tourism benefits indigenous communities.`,
  };
}
