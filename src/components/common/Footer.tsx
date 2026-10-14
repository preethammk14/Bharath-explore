import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  ExternalLink, 
  Database,
  Phone,
  Mail,
  Building2,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setFirebaseModalOpen } = useApp();

  return (
    <footer className="bg-[#174A35] text-[#FAF8F2] pt-14 pb-8 border-t-4 border-[#F07843]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F07843] to-[#E89E28] flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Bharat<span className="text-[#F07843]">Explore</span>
                </span>
                <span className="text-[11px] tracking-widest font-semibold text-white/70 uppercase">
                  One India • Endless Experiences
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#FAF8F2]/80 leading-relaxed max-w-sm">
              An India-first tourism discovery and local marketplace platform uniting 28 States and 8 Union Territories. Empowering travelers, certified regional guides, traditional homestays, and indigenous craft collectives.
            </p>

            {/* Contact Details */}
            <div className="space-y-1.5 text-xs text-white/75 pt-2">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F07843]" />
                <span>support@bharatexplore.in • guides@bharatexplore.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Helpline: +91 (080) 4920-5678 (Mon–Sat, 9AM–7PM IST)</span>
              </p>
              <p className="flex items-center gap-2 text-[11px] text-white/60">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bangalore & New Delhi, Bharat</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Fair-Trade Tourism</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#F07843]" />
                <span>Zero Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F07843] mb-4">
              Explore India
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Interactive India Map
                </Link>
              </li>
              <li>
                <Link to="/states" className="hover:text-white transition-colors">
                  All 28 States & 8 UTs
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors">
                  Heritage Monuments
                </Link>
              </li>
              <li>
                <Link to="/stays" className="hover:text-white transition-colors font-semibold text-[#F07843]">
                  20 Stays Directory
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-white transition-colors font-semibold text-[#FAF8F2]">
                  Local Tour Guides
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-white transition-colors">
                  Cultural Workshops & Safaris
                </Link>
              </li>
              <li>
                <Link to="/businesses" className="hover:text-white transition-colors">
                  Local Artisans & Crafts
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F07843] mb-4">
              Regions of Bharat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <Link to="/explore?region=North" className="hover:text-white transition-colors">
                  North India (Himalayas & Plains)
                </Link>
              </li>
              <li>
                <Link to="/explore?region=South" className="hover:text-white transition-colors">
                  South India (Ghats & Backwaters)
                </Link>
              </li>
              <li>
                <Link to="/explore?region=West" className="hover:text-white transition-colors">
                  West India (Thar Sands & Konkan)
                </Link>
              </li>
              <li>
                <Link to="/explore?region=East" className="hover:text-white transition-colors">
                  East India (Delta & Buddhism)
                </Link>
              </li>
              <li>
                <Link to="/explore?region=North-East" className="hover:text-white transition-colors">
                  Northeast India (Rainforests)
                </Link>
              </li>
              <li>
                <Link to="/explore?region=Central" className="hover:text-white transition-colors">
                  Central India (Tiger Reserves)
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F07843] mb-4">
              Trust & Architecture
            </h4>
            <p className="text-xs text-white/70 leading-relaxed mb-3">
              Built with React, TypeScript, Leaflet OpenStreetMap, Tailwind CSS, and Cloud Firestore.
            </p>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link to="/about" className="hover:text-white flex items-center gap-1">
                  <span>About BharatExplore</span>
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white flex items-center gap-1">
                  <span>Saved Itinerary</span>
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-white flex items-center gap-1">
                  <span>My Trip Bookings</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white flex items-center gap-1 text-white/80">
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white flex items-center gap-1 text-white/80">
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setFirebaseModalOpen(true)}
                  className="text-left text-[#F07843] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Database className="w-3 h-3" />
                  <span>Cloud Backend Setup</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Legal and Fair-Trade Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} BharatExplore. One India. Endless Experiences.</span>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white underline">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white underline">Terms</Link>
          </div>
          <div className="flex items-center gap-4 text-center sm:text-right">
            <span className="flex items-center gap-1">
              <span>Supporting Sustainable & Fair-Trade Tourism</span>
              <Heart className="w-3 h-3 text-[#F07843] fill-[#F07843]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
