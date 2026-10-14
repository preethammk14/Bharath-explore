import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { BookingModal } from './components/common/BookingModal';
import { FirebaseSetupModal } from './components/common/FirebaseSetupModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { StatesPage } from './pages/StatesPage';
import { StateDetailPage } from './pages/StateDetailPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { StaysPage } from './pages/StaysPage';
import { StayDetailPage } from './pages/StayDetailPage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { BusinessesPage } from './pages/BusinessesPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { BookingsPage } from './pages/BookingsPage';
import { AboutPage } from './pages/AboutPage';
import { PlannerPage } from './pages/PlannerPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#FAF8F2] text-[#1E232A]">
          {/* Main Global Navbar */}
          <Navbar />

          {/* Router Viewport */}
          <main className="flex-1">
            <Routes>
              {/* 1. Home */}
              <Route path="/" element={<HomePage />} />

              {/* 2. Explore India */}
              <Route path="/explore" element={<ExplorePage />} />

              {/* 3. States & UTs */}
              <Route path="/states" element={<StatesPage />} />
              <Route path="/states/:stateId" element={<StateDetailPage />} />

              {/* 4. Destinations */}
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/destinations/:destId" element={<DestinationDetailPage />} />

              {/* 5. Stays */}
              <Route path="/stays" element={<StaysPage />} />
              <Route path="/stays/:stayId" element={<StayDetailPage />} />

              {/* 6. Local Guides */}
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/guides/:guideId" element={<GuideDetailPage />} />

              {/* 7. Experiences */}
              <Route path="/experiences" element={<ExperiencesPage />} />

              {/* 8. Local Businesses */}
              <Route path="/businesses" element={<BusinessesPage />} />
              <Route path="/businesses/:bizId" element={<BusinessDetailPage />} />

              {/* 9. About Us */}
              <Route path="/about" element={<AboutPage />} />

              {/* User Itinerary & Dashboard */}
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/bookings" element={<BookingsPage />} />

              {/* Legal Documentation */}
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Global Dialogs & Alerts */}
          <BookingModal />
          <FirebaseSetupModal />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
