import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle,
  CreditCard,
  Compass
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    activeBookingItem, 
    closeBookingModal, 
    createBookingRequest, 
    user, 
    bookings, 
    checkBookingConflict,
    showToast 
  } = useApp();

  const [guestName, setGuestName] = useState(user?.displayName || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('+91 98765 43210');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.displayName);
      if (!guestEmail) setGuestEmail(user.email);
    }
  }, [user]);

  // Set default dates: 1 week from now
  useEffect(() => {
    if (activeBookingItem) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextWeekPlus3 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
      setStartDate(nextWeek.toISOString().split('T')[0]);
      setEndDate(nextWeekPlus3.toISOString().split('T')[0]);
      setFormError(null);
    }
  }, [activeBookingItem]);

  if (!activeBookingItem) return null;

  const basePrice = activeBookingItem.price || 2500;
  const isStay = activeBookingItem.type === 'stay';
  const isGuide = activeBookingItem.type === 'guide' || activeBookingItem.type === 'tour';
  const isBusiness = activeBookingItem.type === 'business';

  // Calculate nights for stays
  let nights = 1;
  let isValidDates = true;
  if (isStay && startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) {
      isValidDates = false;
    } else {
      nights = diff;
    }
  }

  const estimatedTotal = isStay 
    ? basePrice * nights 
    : (isGuide || isBusiness)
      ? basePrice
      : basePrice * guestsCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName.trim() || !guestEmail.trim() || !startDate) {
      setFormError('Please fill in all required guest information and travel date.');
      return;
    }

    if (isStay && !isValidDates) {
      setFormError('Check-out date must be strictly after the check-in date.');
      return;
    }

    // Check for conflicting reservation on the same date
    const hasConflict = checkBookingConflict(activeBookingItem.id, startDate);
    if (hasConflict) {
      setFormError('This date is unavailable or already has an active reservation request for this guide/stay. Please select another date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createBookingRequest({
        itemId: activeBookingItem.id,
        itemType: activeBookingItem.type,
        title: activeBookingItem.title,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        startDate,
        endDate: isStay ? endDate : undefined,
        guestsCount,
        totalAmount: estimatedTotal,
        specialRequests: isGuide 
          ? `Language: ${preferredLanguage}. ${specialRequests}`.trim()
          : specialRequests.trim(),
      });
      closeBookingModal();
    } catch (err: any) {
      setFormError(err.message || 'Error submitting booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={!!activeBookingItem}
      onClose={closeBookingModal}
      title={`Book ${isGuide ? 'Local Tour Guide' : activeBookingItem.type === 'experience' ? 'Cultural Experience' : 'Heritage Stay'}: ${activeBookingItem.title}`}
      subtitle="Direct reservation request saved in Firestore database • Zero hidden booking fees"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Item Summary Banner */}
        <div className="bg-[#FAF8F2] border border-[#E0D7C9] rounded-2xl p-4 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#174A35] uppercase tracking-wider text-[10px] bg-[#EBF3EE] px-2 py-0.5 rounded-md">
              {activeBookingItem.type.toUpperCase()}
            </span>
            <h4 className="font-bold text-[#1E232A] text-sm mt-1">{activeBookingItem.title}</h4>
            <p className="text-[11px] text-gray-500">Official verified booking arrangement</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">
              {isStay ? 'Per Night' : isGuide ? 'Tour Rate' : 'Per Person'}
            </span>
            <p className="text-base font-extrabold text-[#F07843]">₹{basePrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Dates & Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F07843]" />
              <span>{isStay ? 'Check-in Date' : 'Preferred Tour Date'}</span>
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
            />
          </div>

          {isStay ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Check-out Date</span>
              </label>
              <input
                type="date"
                required
                min={startDate || new Date().toISOString().split('T')[0]}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#174A35]" />
                <span>Number of Travelers</span>
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {isStay && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#174A35]" />
              <span>Guests Count</span>
            </label>
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
            >
              {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'} ({nights} {nights === 1 ? 'night' : 'nights'})
                </option>
              ))}
            </select>
          </div>
        )}

        {isGuide && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#174A35]" />
              <span>Preferred Tour Language</span>
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
            >
              {['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Malayalam', 'Gujarati', 'French', 'German'].map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        )}

        {/* Guest Details */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>Primary Traveler / Guest Name</span>
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
              <span>Special Requests, Timing or Interests</span>
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Arriving by morning express train, interested in temple epigraphy and architecture, senior citizen assistance..."
              className="w-full bg-white border border-[#E0D7C9] rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#F07843]/30 focus:border-[#F07843] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-[#EBF3EE] border border-[#C5DDD0] rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between text-gray-800">
            <span className="font-medium">Estimated Booking Tariff:</span>
            <span className="font-extrabold text-base text-[#174A35]">₹{estimatedTotal.toLocaleString()}</span>
          </div>

          {/* Transparent Payment Integration Notice */}
          <div className="flex items-start gap-2 pt-2 border-t border-[#174A35]/10 text-[11px] text-[#174A35]">
            <CreditCard className="w-4 h-4 shrink-0 text-[#F07843] mt-0.5" />
            <div>
              <p className="font-semibold">Direct Arrangement • Online Payment Unavailable</p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Payment gateway is currently not configured. You will coordinate and settle payment directly with the host or guide upon arrival with zero commission fees.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={closeBookingModal}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting to Database...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Submit Booking Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
