import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { ALL_STATES_AND_UTS, DESTINATIONS } from '../../data/indiaData';
import { 
  UserCheck, 
  MapPin, 
  Award, 
  Languages, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Mail, 
  IndianRupee, 
  Clock, 
  Plus, 
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface GuideRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideRegistrationModal: React.FC<GuideRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerTourGuide, showToast } = useApp();

  const [displayName, setDisplayName] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [fullBio, setFullBio] = useState('');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['hampi-ruins']);
  const [languagesInput, setLanguagesInput] = useState('English, Hindi, Kannada');
  const [specialisationsInput, setSpecialisationsInput] = useState('Heritage & Monument Tours, Vijayanagara History');
  const [tourTypesInput, setTourTypesInput] = useState('Heritage Walk, Cycling Tour');
  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [pricePerTour, setPricePerTour] = useState(2000);
  const [pricePerHour, setPricePerHour] = useState(400);
  const [contactPhone, setContactPhone] = useState('+91 ');
  const [contactEmail, setContactEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'enquiry_form' | 'phone' | 'email' | 'whatsapp'>('enquiry_form');
  const [availabilityInformation, setAvailabilityInformation] = useState('Available daily mornings and afternoons with 24h advance inquiry.');
  const [consentPublicContact, setConsentPublicContact] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');

  // Tour offering item
  const [tourTitle, setTourTitle] = useState('Signature Heritage Walking Tour');
  const [tourDesc, setTourDesc] = useState('Deep architectural and historical exploration of iconic monuments and cultural heritage.');
  const [tourDuration, setTourDuration] = useState('3 Hours');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!displayName.trim()) {
      setErrorMessage('Please provide your full guide display name.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please provide your base operating city.');
      return;
    }
    if (!shortBio.trim()) {
      setErrorMessage('Please provide a brief professional introduction.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setErrorMessage('Please provide a valid official email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const languages = languagesInput.split(',').map((l) => l.trim()).filter(Boolean);
      const specialisations = specialisationsInput.split(',').map((s) => s.trim()).filter(Boolean);
      const tourTypes = tourTypesInput.split(',').map((t) => t.trim()).filter(Boolean);

      await registerTourGuide({
        displayName,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        shortBio,
        fullBio: fullBio || shortBio,
        state,
        city,
        destinationsServed: selectedDestinations,
        specialisations: specialisations.length > 0 ? specialisations : ['Heritage & Culture'],
        languages: languages.length > 0 ? languages : ['English', 'Hindi'],
        yearsOfExperience,
        tourTypes: tourTypes.length > 0 ? tourTypes : ['Walking Tour'],
        pricePerTour,
        pricePerHour,
        contactPhone: consentPublicContact ? contactPhone : undefined,
        contactEmail: consentPublicContact ? contactEmail : undefined,
        preferredContactMethod,
        availabilityInformation,
        tourOfferings: [
          {
            title: tourTitle,
            description: tourDesc,
            duration: tourDuration,
            price: pricePerTour,
            maxGroupSize: 10,
          },
        ],
      });

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register as a Local Tour Guide"
      subtitle="Connect directly with domestic and international travelers across India"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-gray-700 max-h-[75vh] overflow-y-auto pr-1">
        {/* Verification Policy Disclaimer */}
        <div className="p-3 bg-[#EBF3EE] border border-[#C5DDD0] rounded-xl flex items-start gap-2.5 text-xs text-[#143D24]">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong>Manual Verification Standard:</strong> Newly submitted guide listings are marked <strong>Pending Review</strong>. Verified badges are only awarded by administrators following verification of regional credentials.
          </span>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Display Name */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Full Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Verma"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Years of Guiding Experience *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* State */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Base Operating State *
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              >
                {ALL_STATES_AND_UTS.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Base City / Town *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hampi, Varanasi, Jaipur, Madurai"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Short Professional Introduction (Max 250 characters) *
            </label>
            <input
              type="text"
              required
              maxLength={250}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="e.g. ASI-licensed archaeologist guiding walking and cycling explorations among Hampi’s 14th-century temple ruins."
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
            />
          </div>

          {/* Full Bio */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Detailed Background & Philosophy
            </label>
            <textarea
              rows={3}
              value={fullBio}
              onChange={(e) => setFullBio(e.target.value)}
              placeholder="Share details about your education, storytelling approach, community involvement, and local insights..."
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Languages */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Spoken Languages (Comma separated) *
              </label>
              <input
                type="text"
                required
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="e.g. English, Hindi, Kannada, French"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>

            {/* Specialisations */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Specialisations (Comma separated) *
              </label>
              <input
                type="text"
                required
                value={specialisationsInput}
                onChange={(e) => setSpecialisationsInput(e.target.value)}
                placeholder="e.g. Mughal Architecture, Sunset Walks, Epigraphy"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Base Price per Tour (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={pricePerTour}
                onChange={(e) => setPricePerTour(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                Base Price per Hour (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
            </div>
          </div>

          {/* Contact Details & Consent */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E1D5] space-y-3">
            <h4 className="text-xs font-bold text-[#143D24] uppercase tracking-wider">
              Contact Channels & Public Consent
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="guide@example.in"
                  className="w-full p-2 bg-white border border-[#D5CEBF] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                  Official Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2 bg-white border border-[#D5CEBF] rounded-lg text-xs"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentPublicContact}
                onChange={(e) => setConsentPublicContact(e.target.checked)}
                className="w-4 h-4 rounded text-[#143D24] focus:ring-[#143D24] border-gray-300 mt-0.5"
              />
              <span className="text-xs text-gray-700">
                I give consent to publish my phone and email directly on my profile card. (If unchecked, visitors will contact me exclusively through the private enquiry form).
              </span>
            </label>
          </div>

          {/* Verification Supporting Info */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
              Credentials / License for Verification Review
            </label>
            <input
              type="text"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="e.g. ASI Regional Guide License #KA-2016-8942 / State Tourism Dept ID"
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D5CEBF] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
            />
            <span className="text-[10px] text-gray-400 block mt-1">
              Do not enter sensitive government identity numbers (like Aadhaar). Enter only publicly verifiable guide credentials.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#143D24] hover:bg-[#0D2818] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Guide Application'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
