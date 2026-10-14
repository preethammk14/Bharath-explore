import React from 'react';
import { Compass, ShieldCheck, Code, Layers, Sparkles, Heart, Globe, Users, ExternalLink, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { setFirebaseModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md mb-3 shadow-2xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Platform Vision & Engineering Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
            About BharatExplore
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-serif-royal italic">
            "One India. Endless Experiences."
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E0D7C9] shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-[#174A35] font-display">
            The Purpose of BharatExplore
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            India is an extraordinary mosaic of 28 States and 8 Union Territories, boasting thousands of years of continuous civilization, 40+ UNESCO World Heritage sites, and countless indigenous art forms. Yet traditional travel portals often commodify travel into generic hotel booking packages, completely bypassing local tour guides, rural homestays, and handicraft cooperatives.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            <strong>BharatExplore</strong> was built as a practical, production-grade tourism discovery platform that puts India first. It allows travelers from across the world and domestic travelers to explore every region through an accurate interactive geographic map, discover living cultural traditions, plan trips with AI, and submit booking requests directly to verified local hosts and guides without exploitative commission markups.
          </p>
        </div>

        {/* Project Suitability: Academic, Practical & Business */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E0D7C9] p-6 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3EE] text-[#174A35] flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-base text-[#174A35] font-display mb-2">
              Engineering Capstone
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Designed with strict software engineering disciplines: typed schemas, Leaflet GIS integration, Gemini API server proxy, ABAC Firebase security rules, and responsive design systems.
            </p>
          </div>

          <div className="bg-white border border-[#E0D7C9] p-6 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF2EC] text-[#F07843] flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-base text-[#F07843] font-display mb-2">
              Practical Discovery
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Real geographic coordinates, authentic state divisions, curated historical insights, AI itinerary planner, and direct booking request workflows for travelers.
            </p>
          </div>

          <div className="bg-white border border-[#E0D7C9] p-6 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-base text-[#174A35] font-display mb-2">
              Scalable Public Venture
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Equipped with a self-service registration portal for verified ASI guides, homestays, and handicraft cooperatives to scale into a national tourism marketplace.
            </p>
          </div>
        </div>

        {/* Technology Architecture */}
        <div className="bg-[#174A35] text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F07843]">
            <Code className="w-4 h-4" />
            <span>Modern Web Stack</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Built on Battle-Tested Technologies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-sm text-[#F07843]">Frontend Architecture</h4>
              <p className="text-xs text-white/80 mt-1">React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-sm text-[#F07843]">AI Itinerary Planner</h4>
              <p className="text-xs text-white/80 mt-1">Server-side Gemini 3.8 Flash API proxy with cultural logistics</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-sm text-[#F07843]">Backend & Database</h4>
              <p className="text-xs text-white/80 mt-1">Cloud Firestore, Firebase Authentication, Zero-Trust Rules</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-sm text-[#F07843]">Spatial GIS Mapping</h4>
              <p className="text-xs text-white/80 mt-1">Leaflet, React Leaflet, OpenStreetMap geographic tiles</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-white/70">Need to inspect or deploy Firestore rules and configuration?</span>
            <button
              onClick={() => setFirebaseModalOpen(true)}
              className="bg-[#F07843] hover:bg-[#DE632E] text-white font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Open Cloud Setup Panel</span>
            </button>
          </div>
        </div>

        {/* Ethical Travel & Artisan Support */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E0D7C9] shadow-xs text-center space-y-4">
          <Heart className="w-10 h-10 text-[#F07843] fill-[#F07843] mx-auto" />
          <h2 className="text-2xl font-bold text-[#174A35] font-display">
            Committed to Sustainable & Indigenous Tourism
          </h2>
          <p className="text-sm text-gray-700 max-w-2xl mx-auto leading-relaxed">
            By spotlighting direct village homestays and GI-tagged handicraft guilds, BharatExplore ensures that tourism expenditure benefits local communities directly, preserving age-old arts and keeping India’s cultural soul vibrant.
          </p>
        </div>
      </div>
    </div>
  );
};
