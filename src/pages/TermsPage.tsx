import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, FileText, CheckCircle2, AlertCircle, ChevronRight, Mail, Compass } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#174A35]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#174A35] font-semibold">Terms & Conditions</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#174A35] bg-[#EBF3EE] px-3 py-1 rounded-md mb-3">
            <Scale className="w-3.5 h-3.5 text-[#F07843]" />
            <span>Terms of Service</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#174A35] font-display tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Effective Date: October 2026 • Governing Use of BharatExplore Discovery Portal & Local Marketplace
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F07843]" />
            <span>1. Acceptance of Terms & Platform Scope</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            By accessing or using the BharatExplore platform, website, interactive maps, or booking facilities, you agree to comply with and be bound by these Terms & Conditions. BharatExplore is an Indian cultural tourism discovery and local marketplace designed to connect travelers directly with certified local guides, authentic heritage homestays, and traditional artisan workshops without intermediary commission markups.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#F07843]" />
            <span>2. Direct Booking Workflow & Host Confirmations</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>Status of Booking Requests:</strong> All reservations submitted through BharatExplore initiate in <strong>PENDING</strong> status. A reservation becomes confirmed only once the host or guide reviews their seasonal calendar and approves the request.
            </p>
            <p>
              <strong>Direct Financial Transactions:</strong> BharatExplore charges zero commission to local artisans and guides. Any monetary deposits or payments for stays and guided tours are transacted directly between the traveler and the certified service provider under their documented terms.
            </p>
            <p>
              <strong>Cancellations:</strong> Travelers may cancel pending or confirmed requests at any time via the "My Bookings" portal. Hosts reserve the right to cancel bookings in cases of extreme weather, heritage site closures, or seasonal disruptions.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F07843]" />
            <span>3. Partner Accreditation & Business Registration</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>Administrator Review Queue:</strong> All local business registrations and guide profiles enter an administrative verification queue. Submissions remain unpublished until reviewed by an administrator for authentic credentials, government licensing (e.g. Archaeological Survey of India badges or State Tourism certificates), and safety protocols.
            </p>
            <p>
              <strong>Honesty of Representations:</strong> Enterprise owners warrant that all photographs, facilities descriptions, pricing, and contact information provided are genuine and up to date. Misleading or fraudulent listings are promptly removed.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#F07843]" />
            <span>4. Traveler Etiquette & Heritage Preservation</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Travelers utilizing BharatExplore agree to observe responsible and culturally respectful tourism practices:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700">
            <li>Adhere to ASI regulations at protected monuments, including footwear guidelines and photography restrictions.</li>
            <li>Respect local traditions, dress codes, and sacred ceremonies in temples, mosques, gurdwaras, and monastery complexes.</li>
            <li>Support fair-trade pricing with local handloom weavers and artisans without aggressive price suppression.</li>
            <li>Maintain an eco-friendly footprint by minimizing single-use plastics and preserving fragile Himalayan and coastal ecologies.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D7C9] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#174A35] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#F07843]" />
            <span>5. Limitation of Liability & Contact</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            BharatExplore acts as an informational directory and direct discovery facilitator. While we rigorously verify guide licenses and host profiles, travelers undertake activities, excursions, and travel at their own discretion. For legal inquiries or dispute notices, contact our legal desk:
          </p>
          <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#E0D7C9] text-xs text-gray-800 space-y-1">
            <p><strong>Legal & Operations Desk:</strong> legal@bharatexplore.in</p>
            <p><strong>Registered Portal:</strong> BharatExplore National Tourism Discovery</p>
            <p><strong>Jurisdiction:</strong> Bangalore, Karnataka, India</p>
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
