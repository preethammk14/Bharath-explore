import React, { useState, useEffect } from 'react';
import { TourGuide } from '../../types';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS } from '../../data/indiaData';
import { 
  Send, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  User, 
  Languages, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ShieldCheck,
  MapPin
} from 'lucide-react';

interface TourEnquiryFormProps {
  guide: TourGuide;
  onSuccess?: (enquiryId: string) => void;
  className?: string;
  defaultDestinationId?: string;
}

export const TourEnquiryForm: React.FC<TourEnquiryFormProps> = ({
  guide,
  onSuccess,
  className = '',
  defaultDestinationId,
}) => {
  const { user, submitTourEnquiry, showToast } = useApp();

  const [touristName, setTouristName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 ');
  const [destinationId, setDestinationId] = useState(defaultDestinationId || guide.destinationsServed[0] || 'general');
  const [requestedDate, setRequestedDate] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [preferredLanguage, setPreferredLanguage] = useState(guide.languages[0] || 'English');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  // Set default requested date to 3 days in the future
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setRequestedDate(d.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (user) {
      if (!touristName && user.displayName) setTouristName(user.displayName);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  // Minimum date today
  const minDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!touristName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid contact email address.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Please provide a contact phone number.');
      return;
    }
    if (!requestedDate) {
      setErrorMessage('Please select your preferred tour date.');
      return;
    }
    if (groupSize < 1) {
      setErrorMessage('Group size must be at least 1 person.');
      return;
    }
    if (!message.trim() || message.length < 10) {
      setErrorMessage('Please share a few details about your tour preferences (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const destinationObj = DESTINATIONS.find((d) => d.id === destinationId);
      const destName = destinationObj ? `${destinationObj.name}, ${destinationObj.stateName}` : `${guide.city}, ${guide.state}`;

      const newId = await submitTourEnquiry({
        guideId: guide.id,
        guideName: guide.displayName,
        touristUserId: user?.uid,
        touristName,
        contactDetails: {
          email,
          phone,
        },
        destinationId,
        destinationName: destName,
        requestedDate,
        groupSize,
        preferredLanguage,
        message,
      });

      setSubmittedEnquiryId(newId);
      if (onSuccess) onSuccess(newId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedEnquiryId) {
    return (
      <div className={`bg-[#EBF3EE] border border-[#C5DDD0] rounded-2xl p-6 sm:p-8 text-center space-y-4 ${className}`}>
        <div className="w-14 h-14 rounded-full bg-[#143D24] text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h4 className="font-bold text-xl text-[#143D24] font-display">
          Tour Enquiry Submitted!
        </h4>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-md mx-auto">
          Your inquiry has been registered for <strong>{guide.displayName}</strong> with Reference ID{' '}
          <strong className="text-[#D9531E]">#{submittedEnquiryId}</strong>. Status is currently <strong>PENDING</strong>.
        </p>
        <div className="p-3 bg-white/80 rounded-xl border border-[#C5DDD0] text-xs text-gray-600 max-w-sm mx-auto text-left space-y-1">
          <p><strong>Next steps:</strong> The guide reviews schedule availability and responds via email or phone.</p>
          <p className="text-[11px] text-gray-500">No advance payment charged at this stage.</p>
        </div>
        <button
          onClick={() => {
            setSubmittedEnquiryId(null);
            setMessage('');
          }}
          className="text-xs font-bold text-[#143D24] hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-[#E8E1D5] p-5 sm:p-7 shadow-xs space-y-5 ${className}`}>
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-bold text-lg text-[#143D24] font-display flex items-center gap-2">
          <Send className="w-4 h-4 text-[#D9531E]" />
          <span>Send Tour Enquiry to {guide.displayName}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Direct inquiry with zero commission markups. Check availability for customized heritage tours.
        </p>
      </div>

      {/* Demonstration Notice */}
      {guide.isSampleData && (
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Demonstration Notice:</strong> This is a sample guide profile created for project illustration. Your enquiry will be saved in demonstration state without real dispatch.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Visitor Name */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Your Full Name *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={touristName}
                onChange={(e) => setTouristName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Visitor Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Contact Email *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact Phone */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Contact Phone / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Desired Destination */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Destination to Explore *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              >
                {guide.destinationsServed.map((destId) => {
                  const dObj = DESTINATIONS.find((d) => d.id === destId);
                  return (
                    <option key={destId} value={destId}>
                      {dObj ? dObj.name : destId} ({guide.city})
                    </option>
                  );
                })}
                <option value="custom-city">General city tour ({guide.city}, {guide.state})</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Preferred Date */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Preferred Date *
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                min={minDate}
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Participants *
            </label>
            <div className="relative">
              <Users className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min="1"
                max="25"
                required
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Language *
            </label>
            <div className="relative">
              <Languages className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              >
                {guide.languages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Message / Special Requests */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
            Tour Objectives & Specific Requests *
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the guide about your group's interests (e.g. photography, architectural details, slow walking pace, temple rituals)..."
            className="w-full p-3 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
          />
        </div>

        {/* Trust & Non-Binding Notice */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] flex items-start gap-2 text-[11px] text-gray-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Transparency Notice:</strong> Submitting this enquiry does not immediately charge your card or confirm the booking. The guide will review schedule availability and message you directly.
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#143D24] hover:bg-[#0D2818] text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Transmitting Request...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Tour Enquiry to {guide.displayName}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
