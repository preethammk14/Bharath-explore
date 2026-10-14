import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Database, FileText, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#174A35]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#174A35] font-semibold">Privacy Policy</span>
          </nav>
          
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174A35] bg-[#EBF3EE] px-3 py-1 rounded-md mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F07843]" />
            <span>Legal Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174A35] font-display tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Last Updated: October 2026 • Compliant with the Digital Personal Data Protection Act (DPDP Act, 2023)
          </p>
        </div>

        {/* Overview Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#F07843]" />
            <span>1. Commitment to Traveler and Partner Privacy</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            BharatExplore ("we", "our", or "the Platform") is committed to protecting the privacy, confidentiality, and data sovereignty of all travelers, local tour guides, homestay hosts, and artisan cooperatives using our national tourism portal. This policy explains what information is collected, how it is processed to deliver verified tourism services, and your rights regarding personal data.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#F07843]" />
            <span>2. Categories of Information Collected</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700">
            <p>
              <strong>A. Traveler Information:</strong> When requesting a homestay reservation, experience booking, or tour guide enquiry, we collect your name, contact email, phone number, travel dates, guest count, and any optional special itinerary preferences.
            </p>
            <p>
              <strong>B. Tourism Enterprise and Guide Data:</strong> When registering a local tourism business or guide profile, we collect enterprise name, owner contact details, licensing credentials (ASI/State Tourism license numbers), physical address, photographs, and service listings.
            </p>
            <p>
              <strong>C. Technical and Session Data:</strong> Browser session state and wishlist selections are maintained in browser local storage or synced with Cloud Firestore when authenticated. We do not engage in third-party tracking or behavioral advertising.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#F07843]" />
            <span>3. How We Use and Share Collected Information</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700">
            <p>
              <strong>Direct Connection to Verified Hosts:</strong> Your booking requests are shared exclusively with the intended verified host, guide, or cooperative coordinator to confirm availability and logistics.
            </p>
            <p>
              <strong>No Data Selling or Advertising Networks:</strong> We never sell, lease, or monetize personal user data to advertisers, aggregators, or brokers.
            </p>
            <p>
              <strong>Zero-Trust Cloud Storage:</strong> Cloud Firestore data is secured using identity-based access rules. Only authenticated travelers may access their own bookings, while directory listings are public for tourism discovery.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F07843]" />
            <span>4. User Rights under Indian DPDP Act (2023)</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            As a user of BharatExplore, you retain full rights to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700">
            <li>Request a copy of personal information stored in our database.</li>
            <li>Correct or update inaccurate registration records or contact details.</li>
            <li>Request permanent erasure of booking records or enterprise listings.</li>
            <li>Revoke consent for notifications and communications at any time.</li>
          </ul>
        </div>

        {/* Section 5: Grievance Officer */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#F07843]" />
            <span>5. Grievance Redressal and Contact Details</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            In compliance with Information Technology Rules and the Digital Personal Data Protection Act, our designated Grievance Officer can be contacted directly:
          </p>
          <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#E0D7C9] space-y-2 text-xs text-gray-800">
            <p><strong>Grievance Officer:</strong> Preetham M. K.</p>
            <p><strong>Platform:</strong> BharatExplore National Tourism Discovery</p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#F07843]" />
              <span>privacy@bharatexplore.in</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#F07843]" />
              <span>+91 (080) 4920-5678</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#174A35]" />
              <span>Bangalore, Karnataka, Bharat</span>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#174A35] hover:bg-[#0F3324] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <span>Return to BharatExplore Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
