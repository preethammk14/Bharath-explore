import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TourGuide, TourEnquiry, GuideListingStatus, GuideVerificationStatus } from '../../types';
import { DESTINATIONS } from '../../data/indiaData';
import { onImageError, FALLBACK_GUIDE_IMAGE } from '../../utils/imageFallback';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  Search, 
  Filter,
  User,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuideApprovalPanel: React.FC = () => {
  const { 
    user, 
    tourGuides, 
    updateTourGuideStatus, 
    deleteTourGuide, 
    tourEnquiries, 
    updateTourEnquiryStatus,
    switchUserRole 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'guides' | 'enquiries'>('guides');
  const [guideFilter, setGuideFilter] = useState<'all' | 'pending_review' | 'published' | 'rejected'>('all');
  const [selectedGuideForReview, setSelectedGuideForReview] = useState<TourGuide | null>(null);

  const isAdmin = user?.role === 'admin';

  const filteredGuides = tourGuides.filter((g) => {
    if (guideFilter === 'all') return true;
    return g.listingStatus === guideFilter;
  });

  const pendingGuidesCount = tourGuides.filter((g) => g.listingStatus === 'pending_review').length;
  const pendingEnquiriesCount = tourEnquiries.filter((e) => e.status === 'Pending').length;

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header & Role Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#143D24] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Admin Console</span>
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-600 font-medium">Local Guides Moderation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#143D24] font-display">
            Local Guide Directory & Enquiry Management
          </h2>
        </div>

        {/* Admin Role Toggle Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#FAF8F5] p-1.5 rounded-xl border border-[#D5CEBF]">
          <span className="text-[11px] font-semibold text-gray-500 pl-2">Current Mode:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            isAdmin ? 'bg-[#143D24] text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {isAdmin ? 'Administrator' : 'Traveler'}
          </span>
          <button
            onClick={() => switchUserRole(isAdmin ? 'traveler' : 'admin')}
            className="text-xs font-bold text-[#D9531E] hover:text-[#C84B16] px-2.5 py-1 rounded-lg border border-[#D9531E]/30 bg-white transition-colors"
          >
            {isAdmin ? 'Switch to Traveler' : 'Switch to Admin (Test Mode)'}
          </button>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Administrative Access Restricted</p>
            <p>
              You are currently viewing this application with traveler permissions. To test approving guide registrations, updating verification badges, or moderating listings, click <strong>"Switch to Admin"</strong> above.
            </p>
          </div>
        </div>
      )}

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('guides')}
          className={`text-xs sm:text-sm font-bold pb-2 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'guides'
              ? 'border-[#143D24] text-[#143D24]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>Guide Listings ({tourGuides.length})</span>
          {pendingGuidesCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingGuidesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`text-xs sm:text-sm font-bold pb-2 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-[#143D24] text-[#143D24]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>Tour Enquiries ({tourEnquiries.length})</span>
          {pendingEnquiriesCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#D9531E] text-white text-[10px] flex items-center justify-center font-bold">
              {pendingEnquiriesCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Guide Listings Moderation */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          {/* Status Sub-Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] text-xs">
              {(['all', 'pending_review', 'published', 'rejected'] as const).map((filter) => {
                const active = guideFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setGuideFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                      active ? 'bg-[#143D24] text-white shadow-2xs' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {filter.replace('_', ' ')}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-gray-500">
              Showing <strong>{filteredGuides.length}</strong> guide profiles
            </span>
          </div>

          {/* Table / Cards of Guides */}
          <div className="space-y-3">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  guide.listingStatus === 'pending_review'
                    ? 'bg-amber-50/50 border-amber-200'
                    : guide.listingStatus === 'rejected'
                    ? 'bg-red-50/30 border-red-200 opacity-75'
                    : 'bg-white border-[#E8E1D5]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <img
                    src={guide.profileImage || FALLBACK_GUIDE_IMAGE}
                    alt={guide.displayName}
                    referrerPolicy="no-referrer"
                    onError={(e) => onImageError(e, FALLBACK_GUIDE_IMAGE)}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#1E232A] truncate">
                        {guide.displayName}
                      </h4>
                      {guide.verificationStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {guide.verificationStatus.replace('_', ' ')}
                        </span>
                      )}
                      {guide.isSampleData && (
                        <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-sm">
                          Sample
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {guide.city}, {guide.state} • {guide.yearsOfExperience} yrs experience • Spoken: {guide.languages.slice(0, 3).join(', ')}
                    </p>
                    <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
                      Specialisations: {guide.specialisations.join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <Link
                    to={`/guides/${guide.id}`}
                    target="_blank"
                    className="text-xs font-bold text-gray-600 hover:text-[#143D24] p-2 rounded-lg hover:bg-gray-100"
                    title="View public profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {isAdmin && (
                    <>
                      {guide.listingStatus !== 'published' ? (
                        <button
                          onClick={() => updateTourGuideStatus(guide.id, 'published', 'verified')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTourGuideStatus(guide.id, 'rejected', 'unverified')}
                          className="bg-gray-100 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          Revoke / Unpublish
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Remove listing for ${guide.displayName}?`)) {
                            deleteTourGuide(guide.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tour Enquiries Workflow */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Tracking <strong>{tourEnquiries.length}</strong> visitor enquiries to guides</span>
            <span>Zero advance platform payments</span>
          </div>

          {tourEnquiries.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-500">
              No tour enquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {tourEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 rounded-2xl border border-[#E8E1D5] bg-[#FAF8F5] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Enquiry #{enq.id}
                      </span>
                      <h4 className="font-bold text-sm text-[#143D24]">
                        To: {enq.guideName || enq.guideId}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        enq.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enq.status === 'Declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Status: {enq.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>
                      <strong className="text-gray-800">Visitor:</strong> {enq.touristName}
                    </div>
                    <div>
                      <strong className="text-gray-800">Contact:</strong> {enq.contactDetails.email} • {enq.contactDetails.phone}
                    </div>
                    <div>
                      <strong className="text-gray-800">Target Date:</strong> {enq.requestedDate} ({enq.groupSize} Guests)
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200 italic">
                    "{enq.message}"
                  </p>

                  {isAdmin && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                      <span className="text-[11px] text-gray-500 mr-2">Update status:</span>
                      <button
                        onClick={() => updateTourEnquiryStatus(enq.id, 'Accepted')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-lg"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateTourEnquiryStatus(enq.id, 'Declined')}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-lg"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => updateTourEnquiryStatus(enq.id, 'Cancelled')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-1 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
