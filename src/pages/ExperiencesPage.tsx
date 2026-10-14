import React, { useState } from 'react';
import { EXPERIENCES, ALL_STATES_AND_UTS } from '../data/indiaData';
import { Sparkles, MapPin, Heart, Star, Clock, Users, CheckCircle2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { onImageError, FALLBACK_HERITAGE_IMAGE } from '../utils/imageFallback';

export const ExperiencesPage: React.FC = () => {
  const { toggleWishlist, isInWishlist, openBookingModal } = useApp();

  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['All', 'Heritage Walk', 'Culinary Trail', 'Art & Craft Workshop', 'Adventure Trek'];

  const filteredExperiences = EXPERIENCES.filter((exp) => {
    const matchType = selectedType === 'All' || exp.type === selectedType;
    const matchSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3.5 py-1 rounded-md mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F07843]" />
            <span>Living Traditions & Tours</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
            Curated Local Experiences
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Step beyond typical sightseeing. Row past ancient riverside ghats at dawn, paint silk with Padmashree Rogan masters, kayak through quiet backwater canals, and savor heirloom culinary recipes.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E0D7C9] shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experiences by title, craft, or host name..."
                className="w-full bg-[#FAF8F2] border border-[#E0D7C9] rounded-full pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold text-gray-500 mr-2 whitespace-nowrap">Experience Style:</span>
            {types.map((t) => {
              const active = selectedType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#174A35] text-white font-bold shadow-xs'
                      : 'bg-[#FAF8F2] text-gray-700 hover:bg-[#EBF3EE] border border-[#E0D7C9]'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-[#E0D7C9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-gray-900">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => onImageError(e, FALLBACK_HERITAGE_IMAGE)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-[#174A35]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                    {exp.type}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                    {exp.duration}
                  </span>
                  <button
                    onClick={() => toggleWishlist(exp.id, exp.title)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-[#F07843] transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(exp.id) ? 'fill-[#F07843] text-[#F07843]' : ''}`} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-lg text-[#1E232A] group-hover:text-[#F07843] transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#F07843] bg-[#FEF2EC] px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-[#F07843]" />
                      <span>{exp.rating.toFixed(1)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#174A35]" />
                    <span>{exp.stateName}</span>
                    <span className="text-gray-300">•</span>
                    <span>{exp.groupSize}</span>
                  </p>

                  <p className="text-xs text-gray-600 mb-3">
                    Hosted by <strong>{exp.hostName}</strong> ({exp.hostRole})
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {exp.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 bg-[#FAF8F2] border-t border-[#E8E1D5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Price per guest</span>
                  <p className="text-base font-extrabold text-[#174A35]">
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
                  className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  Book Experience
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E0D7C9] p-8 shadow-xs max-w-md mx-auto">
            <p className="text-base font-bold text-gray-700">No experiences found for your search.</p>
            <p className="text-xs text-gray-500 mt-1">Try switching categories or searching for crafts.</p>
          </div>
        )}
      </div>
    </div>
  );
};
