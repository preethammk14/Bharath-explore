import React, { useState, useEffect } from 'react';
import { Stay } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PriceDisplay } from '../ui/PriceDisplay';

interface BookingRequestFormProps {
  stay: Stay;
  onSuccess?: (bookingId: string) => void;
  className?: string;
}

export const BookingRequestForm: React.FC<BookingRequestFormProps> = ({
  stay,
  onSuccess,
  className = '',
}) => {
  const { user, createBookingRequest, bookings, showToast } = useApp();

  const [guestName, setGuestName] = useState(user?.displayName || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('+91 98765 43210');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);

  // Set default dates: 1 week from now
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextWeekPlus2 = new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000);
    setCheckIn(nextWeek.toISOString().split('T')[0]);
    setCheckOut(nextWeekPlus2.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (user) {
      if (!guestName && user.displayName) setGuestName(user.displayName);
      if (!guestEmail && user.email) setGuestEmail(user.email);
    }
  }, [user]);

  // Calculate nights
  let nights = 1;
  let isValidDateRange = false;
  if (checkIn && checkOut) {
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      nights = diffDays;
      isValidDateRange = true;
    }
  }

  const estimatedTotal = stay.pricePerNight * nights;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!guestName.trim()) {
      setErrorMessage('Please provide your full guest name.');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setErrorMessage('Please provide a valid contact email address.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 8) {
      setErrorMessage('Please provide a valid telephone number.');
      return;
    }
    if (!isValidDateRange) {
      setErrorMessage('Check-out date must be strictly after the check-in date.');
      return;
    }
    if (guestCount > stay.guestCapacity) {
      setErrorMessage(`Maximum guest capacity for this property is ${stay.guestCapacity} persons.`);
      return;
    }

    // Check duplicate booking submission in existing bookings
    const isDuplicate = bookings.some(
      (b) =>
        b.itemId === stay.id &&
        b.startDate === checkIn &&
        b.endDate === checkOut &&
        b.status !== 'cancelled'
    );

    if (isDuplicate) {
      setErrorMessage(
        'You already have an active reservation request for this property on these dates. Check "My Trip Bookings".'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const newId = await createBookingRequest({
        itemId: stay.id,
        itemType: 'stay',
        title: stay.name,
        guestName,
        guestEmail,
        guestPhone,
        startDate: checkIn,
        endDate: checkOut,
        guestsCount: guestCount,
        totalAmount: estimatedTotal,
        specialRequests,
      });

      setSubmittedBookingId(newId);
      if (onSuccess) onSuccess(newId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit reservation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedBookingId) {
    return (
      <div className={`bg-[#EBF3EE] border border-[#C5DDD0] rounded-2xl p-6 text-center space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-[#143D24] text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-base text-[#143D24] font-display">
          Reservation Request Submitted!
        </h4>
        <p className="text-xs text-gray-700 leading-relaxed max-w-sm mx-auto">
          Your request for <strong>{stay.name}</strong> has been registered with status <strong className="text-amber-800">PENDING</strong> (Ref #{submittedBookingId}). The host will review and verify availability before confirming.
        </p>
        <div className="pt-2">
          <span className="text-[11px] text-gray-500 block">
            No advance payments charged • Transparent regional booking
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-2xl border border-[#E8E1D5] p-5 sm:p-6 shadow-sm space-y-4 ${className}`}>
      {/* Header and Pricing */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9531E]">
            Reservation Request
          </span>
          <h4 className="font-bold text-base text-[#143D24] font-display leading-tight">
            Request to Book Stay
          </h4>
        </div>
        <div className="text-right">
          <PriceDisplay amount={stay.pricePerNight} size="lg" />
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Dates row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>Check-in</span>
          </label>
          <input
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>Check-out</span>
          </label>
          <input
            type="date"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
          />
        </div>
      </div>

      {/* Guests count */}
      <div>
        <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-[#143D24]" />
          <span>Number of Guests (Max {stay.guestCapacity})</span>
        </label>
        <select
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-3 py-2 text-xs text-gray-800 font-medium focus:outline-hidden"
        >
          {Array.from({ length: stay.guestCapacity }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      {/* Guest Name & Contact */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-gray-500" />
            <span>Guest Full Name</span>
          </label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. Aarav Sharma"
            className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>Contact Phone</span>
            </label>
            <input
              type="tel"
              required
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
            <span>Special Requests or Notes for Host</span>
          </label>
          <textarea
            rows={2}
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="e.g. Vegetarian breakfast preference, early train arrival, quiet room requested..."
            className="w-full bg-[#FAF8F5] border border-[#D5CEBF] rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
          />
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#E8E1D5] text-xs space-y-1.5">
        <div className="flex items-center justify-between text-gray-600">
          <span>₹{stay.pricePerNight.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}:</span>
          <span className="font-semibold text-gray-900">₹{estimatedTotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Host Direct Fee:</span>
          <span className="text-emerald-700 font-semibold">₹0 (Zero Markup)</span>
        </div>
        <div className="pt-1.5 border-t border-[#E8E1D5] flex items-center justify-between font-bold text-[#143D24]">
          <span>Estimated Total:</span>
          <span className="text-base text-[#D9531E]">₹{estimatedTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Honest Status Note */}
      <div className="flex items-start gap-2 text-[10px] text-gray-500">
        <Clock className="w-3.5 h-3.5 text-[#D9531E] shrink-0 mt-0.5" />
        <span>
          Submission initiates a <strong>PENDING</strong> booking request. Payment is arranged directly with the host upon verified confirmation.
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#D9531E] hover:bg-[#C84B16] text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <span>Sending Request...</span>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Send Booking Request</span>
          </>
        )}
      </button>
    </form>
  );
};
