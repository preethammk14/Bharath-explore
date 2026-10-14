import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  BookingRequest, 
  LocalBusiness, 
  Review, 
  TourGuide, 
  TourEnquiry, 
  GuideListingStatus, 
  GuideVerificationStatus, 
  EnquiryStatus,
  BusinessAvailabilityStatus
} from '../types';
import { 
  isFirebaseConfigured, 
  auth, 
  loginWithGoogle, 
  logoutUser,
  saveBookingToFirestore,
  cancelBookingInFirestore,
  saveBusinessToFirestore,
  updateBusinessInFirestore,
  saveGuideToFirestore,
  getFirebaseDiagnostics,
  FirebaseDiagnostics
} from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { LOCAL_BUSINESSES as INITIAL_BUSINESSES } from '../data/indiaData';
import { SAMPLE_TOUR_GUIDES } from '../data/guidesData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  user: UserProfile | null;
  firebaseReady: boolean;
  firebaseDiagnostics: FirebaseDiagnostics;
  wishlist: string[];
  toggleWishlist: (id: string, name?: string) => void;
  isInWishlist: (id: string) => boolean;
  bookings: BookingRequest[];
  createBookingRequest: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'userId'>) => Promise<string>;
  cancelBooking: (bookingId: string) => void;
  businesses: LocalBusiness[];
  registerBusiness: (biz: Omit<LocalBusiness, 'id' | 'rating' | 'reviewCount' | 'verified'>) => Promise<string>;
  approveBusiness: (bizId: string) => void;
  rejectBusiness: (bizId: string, reason?: string) => void;
  deleteBusiness: (bizId: string) => void;
  updateBusinessAvailability: (bizId: string, status: BusinessAvailabilityStatus) => void;
  stayAvailability: Record<string, boolean>;
  toggleStayAvailability: (stayId: string, isAvailable: boolean) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'userId' | 'date'>) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  openBookingModal: (item: { id: string; title: string; type: 'stay' | 'experience' | 'business' | 'guide' | 'tour'; price?: number }) => void;
  activeBookingItem: { id: string; title: string; type: 'stay' | 'experience' | 'business' | 'guide' | 'tour'; price?: number } | null;
  closeBookingModal: () => void;
  checkBookingConflict: (itemId: string, date: string) => boolean;
  isFirebaseModalOpen: boolean;
  setFirebaseModalOpen: (open: boolean) => void;
  // Tour Guide Directory & Enquiry workflows
  tourGuides: TourGuide[];
  registerTourGuide: (guide: Omit<TourGuide, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'listingStatus' | 'isSampleData'>) => Promise<string>;
  updateTourGuideStatus: (guideId: string, listingStatus: GuideListingStatus, verificationStatus: GuideVerificationStatus) => void;
  deleteTourGuide: (guideId: string) => void;
  tourEnquiries: TourEnquiry[];
  submitTourEnquiry: (enquiry: Omit<TourEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateTourEnquiryStatus: (enquiryId: string, status: EnquiryStatus) => void;
  switchUserRole: (role: 'traveler' | 'host' | 'admin') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_WISHLIST = 'bharatexplore_wishlist_v1';
const LOCAL_STORAGE_KEY_BOOKINGS = 'bharatexplore_bookings_v1';
const LOCAL_STORAGE_KEY_BIZ = 'bharatexplore_businesses_v1';
const LOCAL_STORAGE_KEY_REVIEWS = 'bharatexplore_reviews_v1';
const LOCAL_STORAGE_KEY_USER = 'bharatexplore_user_v1';
const LOCAL_STORAGE_KEY_GUIDES = 'bharatexplore_tour_guides_v1';
const LOCAL_STORAGE_KEY_ENQUIRIES = 'bharatexplore_tour_enquiries_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseReady] = useState(isFirebaseConfigured);
  const [firebaseDiagnostics] = useState<FirebaseDiagnostics>(getFirebaseDiagnostics());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isFirebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [activeBookingItem, setActiveBookingItem] = useState<{ id: string; title: string; type: 'stay' | 'experience' | 'business' | 'guide' | 'tour'; price?: number } | null>(null);

  // User Profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Default demo user so users can immediately test bookings and wishlist
    return {
      uid: 'user-demo-guest',
      displayName: 'Aarav Sharma',
      email: 'aarav.sharma@example.in',
      role: 'traveler',
      savedWishlist: ['taj-mahal-agra', 'alleppey-backwaters', 'rohet-garh-haveli'],
    };
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WISHLIST);
    return saved ? JSON.parse(saved) : ['taj-mahal-agra', 'alleppey-backwaters', 'rohet-garh-haveli'];
  });

  // Bookings
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKINGS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'bk-sample-101',
        userId: 'user-demo-guest',
        itemId: 'rohet-garh-haveli',
        itemType: 'stay',
        title: 'Rawla Rohet Heritage Haveli',
        guestName: 'Aarav Sharma',
        guestEmail: 'aarav.sharma@example.in',
        guestPhone: '+91 98765 43210',
        startDate: '2026-11-14',
        endDate: '2026-11-17',
        guestsCount: 2,
        totalAmount: 19500,
        specialRequests: 'Courtyard view room if possible, arriving by road from Jodhpur.',
        status: 'confirmed',
        createdAt: '2026-10-01T10:30:00Z',
      }
    ];
  });

  // Local Businesses
  const [businesses, setBusinesses] = useState<LocalBusiness[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BIZ);
    if (saved) {
      try {
        const parsed: LocalBusiness[] = JSON.parse(saved);
        const custom = parsed.filter((p) => !INITIAL_BUSINESSES.some((s) => s.id === p.id));
        return [...INITIAL_BUSINESSES, ...custom];
      } catch { /* ignore */ }
    }
    return INITIAL_BUSINESSES;
  });

  // Stay Availability State
  const [stayAvailability, setStayAvailability] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('bharatexplore_stay_availability_v1');
    return saved ? JSON.parse(saved) : {};
  });

  // Tour Guides State (with 16 sample guides + persisted registered guides)
  const [tourGuides, setTourGuides] = useState<TourGuide[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GUIDES);
    if (saved) {
      try {
        const parsed: TourGuide[] = JSON.parse(saved);
        const customGuides = parsed.filter((p) => !SAMPLE_TOUR_GUIDES.some((s) => s.id === p.id));
        return [...SAMPLE_TOUR_GUIDES, ...customGuides];
      } catch { /* ignore */ }
    }
    return SAMPLE_TOUR_GUIDES;
  });

  // Tour Enquiries State
  const [tourEnquiries, setTourEnquiries] = useState<TourEnquiry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ENQUIRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'enq-sample-1',
        guideId: 'guide-hampi-manjunath',
        guideName: 'Manjunath Rao',
        touristUserId: 'user-demo-guest',
        touristName: 'Aarav Sharma',
        contactDetails: {
          email: 'aarav.sharma@example.in',
          phone: '+91 98765 43210',
        },
        destinationId: 'hampi-ruins',
        destinationName: 'Hampi, Karnataka',
        requestedDate: '2026-11-20',
        groupSize: 2,
        preferredLanguage: 'English',
        message: 'Interested in the Virupaksha to Vittala sacred architecture walking tour. We will arrive in Hosapete by early morning train.',
        status: 'Pending',
        createdAt: '2026-10-05T14:30:00Z',
        updatedAt: '2026-10-05T14:30:00Z',
      }
    ];
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REVIEWS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'rev-1',
        userId: 'user-1',
        targetId: 'taj-mahal-agra',
        targetType: 'destination',
        authorName: 'Priya Nambiar',
        rating: 5,
        comment: 'Witnessing sunrise over the white marble dome was an unforgettable spiritual experience. Early morning entry is definitely worth it!',
        date: '2026-09-18'
      },
      {
        id: 'rev-2',
        userId: 'user-2',
        targetId: 'alleppey-backwaters',
        targetType: 'destination',
        authorName: 'Rohan Mehra',
        rating: 5,
        comment: 'The canoe ride through the small village canals was heavenly. Friendly locals, fresh toddy, and coconut groves everywhere.',
        date: '2026-08-25'
      }
    ];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BIZ, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    }
  }, [user]);

  // Firebase auth state listener if auth is configured
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Traveler',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            role: 'traveler',
            savedWishlist: wishlist,
          });
        }
      });
      return () => unsubscribe();
    }
  }, [auth]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleWishlist = (id: string, name?: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(name ? `Removed "${name}" from your wishlist.` : 'Removed from wishlist.', 'info');
        return prev.filter((itemId) => itemId !== id);
      } else {
        showToast(name ? `Saved "${name}" to your wishlist!` : 'Saved to wishlist!', 'success');
        return [...prev, id];
      }
    });
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const checkBookingConflict = (itemId: string, date: string): boolean => {
    return bookings.some(
      (b) => b.itemId === itemId && b.startDate === date && b.status !== 'cancelled'
    );
  };

  const createBookingRequest = async (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'userId'>): Promise<string> => {
    const newId = `bk-${Date.now().toString(36)}`;
    const newBooking: BookingRequest = {
      ...bookingData,
      id: newId,
      userId: user?.uid || 'user-demo-guest',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    await saveBookingToFirestore(newBooking);
    if (firebaseReady) {
      showToast(`Booking request for "${bookingData.title}" submitted & saved to Cloud Firestore!`, 'success');
    } else {
      showToast(`Booking for "${bookingData.title}" saved in local demo storage. Note: Cloud Firestore is unconfigured.`, 'info');
    }
    return newId;
  };

  const cancelBooking = async (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    await cancelBookingInFirestore(bookingId);
    showToast('Booking request has been cancelled.', 'info');
  };

  const registerBusiness = async (bizData: Omit<LocalBusiness, 'id' | 'rating' | 'reviewCount' | 'verified' | 'approvalStatus'>): Promise<string> => {
    const newId = `biz-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const newBiz: LocalBusiness = {
      ...bizData,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
      verified: false,
      approvalStatus: 'pending',
      availabilityStatus: 'available',
      ownerId: user?.uid || 'user-demo-guest',
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newBiz, ...businesses];
    setBusinesses(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_BIZ, JSON.stringify(updated));
    await saveBusinessToFirestore(newBiz);
    if (firebaseReady) {
      showToast(`Business "${bizData.name}" submitted & saved to Cloud Firestore!`, 'success');
    } else {
      showToast(`Business "${bizData.name}" saved in local demo storage. Note: Cloud Firestore is unconfigured.`, 'info');
    }
    return newId;
  };

  const approveBusiness = async (bizId: string) => {
    const now = new Date().toISOString();
    const updated = businesses.map((b) =>
      b.id === bizId ? { ...b, approvalStatus: 'approved' as const, verified: true, updatedAt: now } : b
    );
    setBusinesses(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_BIZ, JSON.stringify(updated));
    await updateBusinessInFirestore(bizId, { approvalStatus: 'approved', verified: true });
    showToast('Business listing has been approved and published to the public portal!', 'success');
  };

  const rejectBusiness = async (bizId: string, reason?: string) => {
    const now = new Date().toISOString();
    const reasonText = reason || 'Application missing verified accreditation or tax registration documents.';
    const updated = businesses.map((b) =>
      b.id === bizId ? { 
        ...b, 
        approvalStatus: 'rejected' as const, 
        verified: false, 
        rejectionReason: reasonText, 
        updatedAt: now 
      } : b
    );
    setBusinesses(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_BIZ, JSON.stringify(updated));
    await updateBusinessInFirestore(bizId, { approvalStatus: 'rejected', verified: false, rejectionReason: reasonText });
    showToast('Business registration was rejected by administrator.', 'info');
  };

  const deleteBusiness = (bizId: string) => {
    const updated = businesses.filter((b) => b.id !== bizId);
    setBusinesses(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_BIZ, JSON.stringify(updated));
    showToast('Business listing removed.', 'info');
  };

  const updateBusinessAvailability = async (bizId: string, status: BusinessAvailabilityStatus) => {
    const now = new Date().toISOString();
    const updated = businesses.map((b) =>
      b.id === bizId ? { ...b, availabilityStatus: status, updatedAt: now } : b
    );
    setBusinesses(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_BIZ, JSON.stringify(updated));
    await updateBusinessInFirestore(bizId, { availabilityStatus: status });
    showToast(`Business availability status updated to "${status}".`, 'success');
  };

  const toggleStayAvailability = (stayId: string, isAvailable: boolean) => {
    const updated = { ...stayAvailability, [stayId]: isAvailable };
    setStayAvailability(updated);
    localStorage.setItem('bharatexplore_stay_availability_v1', JSON.stringify(updated));
    showToast(`Stay availability updated: ${isAvailable ? 'Available for bookings' : 'Marked as Unavailable'}`, 'info');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'userId' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      userId: user?.uid || 'user-demo-guest',
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Your verified review was posted. Thank you for helping other travelers!', 'success');
  };

  const signIn = async () => {
    if (auth && firebaseReady) {
      try {
        await loginWithGoogle();
        showToast('Successfully signed in with Google!', 'success');
      } catch (err) {
        showToast('Google sign-in error. Showing profile setup.', 'info');
        setFirebaseModalOpen(true);
      }
    } else {
      // Demo authentication switch with explicit notice
      setUser({
        uid: 'user-demo-guest',
        displayName: 'Aarav Sharma',
        email: 'aarav.sharma@example.in',
        role: 'traveler',
        savedWishlist: wishlist,
      });
      showToast('Firebase unconfigured. Operating as Demo Traveler (Aarav Sharma).', 'info');
      setFirebaseModalOpen(true);
    }
  };

  const signOut = async () => {
    if (auth) {
      await logoutUser();
    }
    setUser(null);
    showToast('Signed out of BharatExplore.', 'info');
  };

  const openBookingModal = (item: { id: string; title: string; type: 'stay' | 'experience' | 'business' | 'guide' | 'tour'; price?: number }) => {
    setActiveBookingItem(item);
  };

  const closeBookingModal = () => {
    setActiveBookingItem(null);
  };

  const registerTourGuide = async (guideData: Omit<TourGuide, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'listingStatus' | 'isSampleData'>): Promise<string> => {
    const id = `guide-reg-${Date.now()}`;
    const now = new Date().toISOString();
    const newGuide: TourGuide = {
      ...guideData,
      id,
      verificationStatus: 'pending_review',
      listingStatus: 'pending_review',
      isSampleData: false,
      rating: 5.0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newGuide, ...tourGuides];
    setTourGuides(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_GUIDES, JSON.stringify(updated));
    await saveGuideToFirestore(newGuide);
    if (firebaseReady) {
      showToast('Guide profile submitted & synced to Cloud Firestore! Currently Pending Review.', 'success');
    } else {
      showToast('Guide profile saved in local demo storage. Note: Cloud Firestore is unconfigured.', 'info');
    }
    return id;
  };

  const updateTourGuideStatus = (guideId: string, listingStatus: GuideListingStatus, verificationStatus: GuideVerificationStatus) => {
    const now = new Date().toISOString();
    const updated = tourGuides.map((g) =>
      g.id === guideId ? { ...g, listingStatus, verificationStatus, updatedAt: now } : g
    );
    setTourGuides(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_GUIDES, JSON.stringify(updated));
    showToast(`Guide listing updated: Status = ${listingStatus}, Badge = ${verificationStatus}`, 'success');
  };

  const deleteTourGuide = (guideId: string) => {
    const updated = tourGuides.filter((g) => g.id !== guideId);
    setTourGuides(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_GUIDES, JSON.stringify(updated));
    showToast('Guide listing removed from directory.', 'info');
  };

  const submitTourEnquiry = async (enquiryData: Omit<TourEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
    const id = `enq-${Date.now()}`;
    const now = new Date().toISOString();
    const newEnquiry: TourEnquiry = {
      ...enquiryData,
      id,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newEnquiry, ...tourEnquiries];
    setTourEnquiries(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_ENQUIRIES, JSON.stringify(updated));
    showToast('Tour enquiry submitted successfully! Status is Pending guide confirmation.', 'success');
    return id;
  };

  const updateTourEnquiryStatus = (enquiryId: string, status: EnquiryStatus) => {
    const now = new Date().toISOString();
    const updated = tourEnquiries.map((e) =>
      e.id === enquiryId ? { ...e, status, updatedAt: now } : e
    );
    setTourEnquiries(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_ENQUIRIES, JSON.stringify(updated));
    showToast(`Tour enquiry status updated to ${status}.`, 'info');
  };

  const switchUserRole = (role: 'traveler' | 'host' | 'admin') => {
    if (user) {
      const updatedUser: UserProfile = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } else {
      const newUser: UserProfile = {
        uid: 'user-demo-' + role,
        displayName: role === 'admin' ? 'Preetham (Administrator)' : 'Aarav Sharma',
        email: role === 'admin' ? 'admin@bharatexplore.in' : 'aarav.sharma@example.in',
        role,
        savedWishlist: wishlist,
      };
      setUser(newUser);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(newUser));
    }
    showToast(`Role switched to ${role.toUpperCase()} mode.`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseReady,
        firebaseDiagnostics,
        wishlist,
        toggleWishlist,
        isInWishlist,
        bookings,
        createBookingRequest,
        cancelBooking,
        businesses,
        registerBusiness,
        approveBusiness,
        rejectBusiness,
        deleteBusiness,
        updateBusinessAvailability,
        stayAvailability,
        toggleStayAvailability,
        reviews,
        addReview,
        toasts,
        showToast,
        removeToast,
        signIn,
        signOut,
        openBookingModal,
        activeBookingItem,
        closeBookingModal,
        checkBookingConflict,
        isFirebaseModalOpen,
        setFirebaseModalOpen,
        tourGuides,
        registerTourGuide,
        updateTourGuideStatus,
        deleteTourGuide,
        tourEnquiries,
        submitTourEnquiry,
        updateTourEnquiryStatus,
        switchUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
