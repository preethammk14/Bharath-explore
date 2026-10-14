import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Ticket, 
  Calendar, 
  Users, 
  MapPin, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight, 
  Bed, 
  Sparkles, 
  Printer, 
  MessageSquare,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingsPage: React.FC = () => {
  const { bookings, cancelBooking, showToast, tourEnquiries, updateTourEnquiryStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'bookings' | 'enquiries'>('bookings');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const handlePrint = (title: string) => {
    window.print();
    showToast(`Print receipt initiated for "${title}".`, 'info');
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F07843] bg-[#FEF2EC] px-3 py-1 rounded-md mb-3 shadow-2xs">
              <Ticket className="w-3.5 h-3.5" />
              <span>Direct Reservations & Guide Bookings</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#174A35] font-display tracking-tight">
              My Trip Bookings & Enquiries
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Track live reservation requests with local hosts, verified tour guides, and heritage stays saved in the database.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#E0D7C9] shrink-0 shadow-2xs">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`text-xs px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#174A35] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#174A35]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>All Bookings ({bookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`text-xs px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-[#174A35] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#174A35]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#F07843]" />
              <span>Guide Enquiries ({tourEnquiries.length})</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E0D7C9] shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Bookings</span>
            <p className="text-2xl font-extrabold text-[#174A35] mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E0D7C9] shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Confirmed</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{confirmedCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E0D7C9] shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Approval</span>
            <p className="text-2xl font-extrabold text-[#F07843] mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E0D7C9] shadow-xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Guide Enquiries</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{tourEnquiries.length}</p>
          </div>
        </div>

        {/* Tab 1: Bookings List */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-gray-500 font-medium">Filter reservation requests:</span>
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E0D7C9] shadow-2xs">
                {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st as any)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      filterStatus === st
                        ? 'bg-[#174A35] text-white shadow-xs'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E0D7C9] max-w-xl mx-auto shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EBF3EE] text-[#174A35] flex items-center justify-center mx-auto">
                  <Ticket className="w-8 h-8 text-[#F07843]" />
                </div>
                <h3 className="text-xl font-bold text-[#174A35] font-display">
                  No Bookings Found
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                  Submit booking requests for heritage homestays, verified local tour guides, or cultural experiences to track them live right here.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Link
                    to="/guides"
                    className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Explore Local Guides
                  </Link>
                  <Link
                    to="/stays"
                    className="bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Browse Heritage Stays
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((bk) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" />
                      <span>Pending Host / Guide Confirmation</span>
                    </span>
                  );

                  if (bk.status === 'confirmed') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        <CheckCircle className="w-3 h-3" />
                        <span>Confirmed Booking</span>
                      </span>
                    );
                  } else if (bk.status === 'cancelled') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md">
                        <XCircle className="w-3 h-3" />
                        <span>Cancelled</span>
                      </span>
                    );
                  }

                  const isGuideBooking = bk.itemType === 'guide' || bk.itemType === 'tour';

                  return (
                    <div
                      key={bk.id}
                      className="bg-white rounded-2xl border border-[#E0D7C9] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Booking #{bk.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EBF3EE] text-[#174A35] px-2 py-0.5 rounded-md">
                            {bk.itemType.toUpperCase()}
                          </span>
                          {statusBadge}
                          <span className="text-[10px] font-semibold text-gray-400">
                            Logged {new Date(bk.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-[#1E232A] font-display">
                          {bk.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1 font-bold text-[#174A35]">
                            <Calendar className="w-3.5 h-3.5 text-[#F07843]" />
                            <span>
                              {bk.startDate} {bk.endDate ? `to ${bk.endDate}` : ''}
                            </span>
                          </span>

                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>{bk.guestsCount} Travelers</span>
                          </span>

                          <span className="text-gray-300">•</span>
                          <span>Lead Traveler: <strong>{bk.guestName}</strong> ({bk.guestPhone})</span>
                        </div>

                        {bk.specialRequests && (
                          <p className="text-xs text-gray-500 italic bg-[#FAF8F2] p-2.5 rounded-xl border border-[#E0D7C9]/60 max-w-xl">
                            "{bk.specialRequests}"
                          </p>
                        )}
                      </div>

                      {/* Actions & Tariff */}
                      <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-gray-400 block uppercase font-bold">Estimated Tariff</span>
                          <p className="text-xl font-extrabold text-[#F07843]">
                            ₹{bk.totalAmount.toLocaleString()}
                          </p>
                          <span className="text-[10px] text-gray-500">Pay directly to host/guide</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePrint(bk.title)}
                            className="p-2 rounded-xl border border-gray-200 hover:border-[#174A35] text-gray-600 hover:text-[#174A35] transition-colors cursor-pointer"
                            title="Print Trip Voucher / Confirmation"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {bk.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelBooking(bk.id)}
                              className="text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-1.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tour Guide Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {tourEnquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E0D7C9] max-w-xl mx-auto shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FEF2EC] text-[#F07843] flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#174A35] font-display">
                  No Guide Enquiries Yet
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                  Connect directly with verified local historians, epigraphists, and regional scholars across Hampi, Varanasi, Jaipur, Coorg, and beyond.
                </p>
                <div className="pt-2">
                  <Link
                    to="/guides"
                    className="bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs inline-block"
                  >
                    Explore Tour Guide Directory
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {tourEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-2xl border border-[#E0D7C9] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Enquiry #{enq.id}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                          enq.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          Status: {enq.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-[#1E232A] font-display">
                        Tour with {enq.guideName || 'Local Tour Guide'}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1 font-semibold text-[#174A35]">
                          <Calendar className="w-3.5 h-3.5 text-[#F07843]" />
                          <span>{enq.requestedDate}</span>
                        </span>

                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>{enq.groupSize} Travelers</span>
                        </span>

                        <span className="text-gray-300">•</span>
                        <span>Language: <strong>{enq.preferredLanguage}</strong></span>
                      </div>

                      {enq.message && (
                        <p className="text-xs text-gray-500 italic bg-[#FAF8F2] p-2.5 rounded-xl border border-[#E0D7C9]/60 max-w-xl">
                          "{enq.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <Link
                        to={`/guides/${enq.guideId}`}
                        className="text-xs font-bold text-[#174A35] hover:text-[#F07843] border border-[#E0D7C9] px-4 py-2 rounded-md transition-colors"
                      >
                        View Guide Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
