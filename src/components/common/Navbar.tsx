import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Landmark, 
  Home, 
  Bed, 
  Sparkles, 
  Building2, 
  Info, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Ticket, 
  LogOut, 
  LogIn, 
  ChevronDown,
  Database,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SearchBar } from './SearchBar';

export const Navbar: React.FC = () => {
  const { user, wishlist, signIn, signOut, setFirebaseModalOpen, firebaseReady, switchUserRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setSearchModalOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'AI Planner', path: '/planner', icon: Sparkles },
    { name: 'Explore India', path: '/explore', icon: Compass },
    { name: 'States & UTs', path: '/states', icon: MapPin },
    { name: 'Destinations', path: '/destinations', icon: Landmark },
    { name: 'Stays', path: '/stays', icon: Bed },
    { name: 'Local Guides', path: '/guides', icon: Users },
    { name: 'Experiences', path: '/experiences', icon: Sparkles },
    { name: 'Local Businesses', path: '/businesses', icon: Building2 },
    { name: 'About Us', path: '/about', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
        {/* Top Announcement / Cultural Stripe */}
        <div className="bg-[#174A35] text-[#FAF8F2] text-[11px] font-medium py-1 px-4 text-center tracking-wide flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-[#FAF8F2]/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F07843]"></span>
            <span>National Tourism Discovery & Local Marketplace Platform</span>
          </div>
          <div className="mx-auto md:mx-0 flex items-center gap-3">
            <span>One India. Endless Experiences.</span>
            <span className="text-white/40">•</span>
            <span className="text-[#F07843] font-semibold">Supporting 120+ Local Artisans & Heritage Communities</span>
          </div>
          <button
            onClick={() => setFirebaseModalOpen(true)}
            className="hidden md:flex items-center gap-1 text-[10px] text-[#FAF8F2]/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-colors"
          >
            <Database className="w-3 h-3 text-[#F07843]" />
            <span>{firebaseReady ? 'Firebase Connected' : 'Cloud Setup'}</span>
          </button>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#F07843] to-[#174A35] flex items-center justify-center text-white shadow-md shadow-[#F07843]/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAF8F2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#174A35] flex items-center">
                  Bharat<span className="text-[#F07843]">Explore</span>
                </span>
                <span className="text-[10px] tracking-wider font-semibold text-gray-500 uppercase -mt-1 hidden sm:block">
                  One India • Endless Experiences
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (All 8 routes) */}
            <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium text-[#4A5568]">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'text-[#F07843] font-bold bg-[#FEF2EC]'
                        : 'hover:text-[#174A35] hover:bg-[#EBF3EE]'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Compact Desktop Link Fallback for Laptops (1024px to 1279px) */}
            <nav className="hidden lg:flex xl:hidden items-center gap-1 text-xs font-medium text-[#4A5568]">
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'text-[#F07843] font-bold bg-[#FEF2EC]' : 'hover:text-[#174A35]'}`
                }
              >
                Explore India
              </NavLink>
              <NavLink
                to="/destinations"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'text-[#F07843] font-bold bg-[#FEF2EC]' : 'hover:text-[#174A35]'}`
                }
              >
                Destinations
              </NavLink>
              <NavLink
                to="/states"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'text-[#F07843] font-bold bg-[#FEF2EC]' : 'hover:text-[#174A35]'}`
                }
              >
                States & UTs
              </NavLink>
              <NavLink
                to="/stays"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'text-[#F07843] font-bold bg-[#FEF2EC]' : 'hover:text-[#174A35]'}`
                }
              >
                Stays
              </NavLink>
              <NavLink
                to="/guides"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'text-[#F07843] font-bold bg-[#FEF2EC]' : 'hover:text-[#174A35]'}`
                }
              >
                Guides
              </NavLink>
              <NavLink
                to="/experiences"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'text-[#F07843] font-bold bg-[#FEF2EC]' : 'hover:text-[#174A35]'}`
                }
              >
                Experiences
              </NavLink>
              <NavLink
                to="/businesses"
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'text-[#F07843] font-bold bg-[#FEF2EC]' : 'hover:text-[#174A35]'}`
                }
              >
                Businesses
              </NavLink>
            </nav>

            {/* Right Action Icons: Search trigger, Wishlist, Profile/Auth, Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick AI Planner Button */}
              <Link
                to="/planner"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF2EC] hover:bg-[#F07843] text-[#F07843] hover:text-white border border-[#F07843]/30 hover:border-[#F07843] text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                title="AI-Powered Trip Planner"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F07843] group-hover:text-white" />
                <span>AI Planner</span>
              </Link>

              {/* Quick Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#F07843] flex items-center justify-center text-gray-600 hover:text-[#F07843] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                title="Search destinations, states, experiences"
                aria-label="Open search dialog"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#F07843] flex items-center justify-center text-gray-600 hover:text-[#F07843] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                title="View your saved Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F07843] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#FAF8F2]">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User Profile / Auth Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#174A35] text-[#1E232A] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                  aria-label="User account menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EBF3EE] text-[#174A35] font-bold text-xs flex items-center justify-center border border-[#C5DDD0] shrink-0">
                    {user?.displayName ? user.displayName.charAt(0) : <User className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold hidden md:inline truncate max-w-[100px]">
                    {user ? user.displayName.split(' ')[0] : 'Sign In'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8E1D5] py-2 z-50 animate-fade-in">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-bold text-[#174A35] truncate">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              user.role === 'admin' ? 'bg-[#174A35] text-white' : 'bg-[#EBF3EE] text-[#174A35]'
                            }`}>
                              Role: {user.role === 'admin' ? 'Administrator' : 'Verified Traveler'}
                            </span>
                            <button
                              onClick={() => switchUserRole(user.role === 'admin' ? 'traveler' : 'admin')}
                              className="text-[10px] text-[#F07843] hover:underline font-semibold cursor-pointer"
                            >
                              {user.role === 'admin' ? 'Switch to Traveler' : 'Switch to Admin'}
                            </button>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/guides"
                            className="px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF8F2] flex items-center gap-2"
                          >
                            <Users className="w-4 h-4 text-[#F07843]" />
                            <span>Tour Guide Directory</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            className="px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF8F2] flex items-center gap-2"
                          >
                            <Heart className="w-4 h-4 text-[#F07843]" />
                            <span>Saved Wishlist ({wishlist.length})</span>
                          </Link>
                          <Link
                            to="/bookings"
                            className="px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF8F2] flex items-center gap-2"
                          >
                            <Ticket className="w-4 h-4 text-[#174A35]" />
                            <span>My Trip Bookings & Enquiries</span>
                          </Link>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              setFirebaseModalOpen(true);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF8F2] flex items-center gap-2 cursor-pointer"
                          >
                            <Database className="w-4 h-4 text-[#F07843]" />
                            <span>Cloud Backend & Auth</span>
                          </button>
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={() => {
                              signOut();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs text-gray-600 mb-3">
                          Sign in to save destinations, submit booking requests, and leave verified reviews.
                        </p>
                        <button
                          onClick={() => {
                            signIn();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full bg-[#174A35] hover:bg-[#0F3324] text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Sign In / Demo Login</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E0D7C9] flex items-center justify-center text-gray-700 hover:text-[#F07843] transition-colors cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FAF8F2] border-b border-[#E8E1D5] px-4 pt-2 pb-6 animate-fade-in shadow-xl">
            <div className="mb-4 pt-2">
              <SearchBar compact={true} placeholder="Search destinations, states, crafts..." />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-colors ${
                        isActive
                          ? 'bg-[#174A35] text-white border-[#174A35] font-semibold'
                          : 'bg-white text-gray-700 border-[#E8E1D5] hover:border-[#F07843]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{link.name}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8E1D5] flex items-center justify-between text-xs">
              <Link
                to="/bookings"
                className="flex items-center gap-1.5 text-[#174A35] font-semibold"
              >
                <Ticket className="w-4 h-4" />
                <span>My Trip Bookings</span>
              </Link>
              <button
                onClick={() => setFirebaseModalOpen(true)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Database className="w-4 h-4 text-[#F07843]" />
                <span>Backend Status</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal Dialog */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#FAF8F2] rounded-3xl p-6 shadow-2xl border border-[#E8E1D5]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#F07843]" />
                <h3 className="font-bold text-lg text-[#174A35] font-display">
                  Explore Bharat Directory
                </h3>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <SearchBar
              placeholder="Search by destination, state/UT, heritage monument, experience, or business..."
              compact={false}
            />

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Popular Searches:</span>
              {['Varanasi Ghats', 'Hampi Ruins', 'Kerala Backwaters', 'Pangong Tso', 'Rann of Kutch', 'Golden Temple'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    navigate(`/destinations?search=${encodeURIComponent(term)}`);
                    setSearchModalOpen(false);
                  }}
                  className="bg-white hover:bg-[#FEF2EC] hover:text-[#F07843] hover:border-[#F07843] border border-[#E0D7C9] px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px]"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
