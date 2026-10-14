import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  setDoc,
  getDocFromServer, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { BookingRequest, LocalBusiness, TourGuide, UserProfile } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Helper to detect if Firebase credentials are real production keys vs template placeholders
export function isRealFirebaseConfig(cfg: any): boolean {
  if (!cfg || typeof cfg !== 'object') return false;
  const { apiKey, projectId, appId } = cfg;
  if (!apiKey || !projectId || !appId) return false;

  const placeholders = ['placeholder', 'demo', 'todo', 'your_', 'example'];
  const hasPlaceholderKey = placeholders.some((p) => String(apiKey).toLowerCase().includes(p));
  const hasPlaceholderProject = placeholders.some((p) => String(projectId).toLowerCase().includes(p));
  const hasPlaceholderAppId = placeholders.some((p) => String(appId).toLowerCase().includes(p));

  return !hasPlaceholderKey && !hasPlaceholderProject && !hasPlaceholderAppId;
}

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let isConfigured = false;

if (isRealFirebaseConfig(firebaseConfig)) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    authInstance = getAuth(app);
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
    isConfigured = true;

    // Test connection as instructed in SKILL.md
    getDocFromServer(doc(dbInstance, 'test', 'connection')).catch((err) => {
      if (err instanceof Error && err.message.includes('the client is offline')) {
        console.info('Firebase client: Remote connectivity pending or offline. Local state active.');
      }
    });
  } catch (e) {
    console.warn('Firebase initialization encountered error, running in local persistence mode:', e);
    isConfigured = false;
    authInstance = null;
    dbInstance = null;
  }
} else {
  console.info('BharatExplore: Firebase credentials not configured or using placeholders. Operating in local persistence mode (dual-mode architecture).');
}

export interface FirebaseDiagnostics {
  isConfigured: boolean;
  isPlaceholder: boolean;
  projectId: string;
  authDomain: string;
  errorMessage: string | null;
}

export function getFirebaseDiagnostics(): FirebaseDiagnostics {
  const isPlaceholder = !isRealFirebaseConfig(firebaseConfig);
  let errorMessage: string | null = null;

  if (!firebaseConfig?.apiKey || !firebaseConfig?.projectId) {
    errorMessage = 'Firebase credentials are missing from firebase-applet-config.json.';
  } else if (isPlaceholder) {
    errorMessage = `firebase-applet-config.json contains template placeholder credentials (Project: "${firebaseConfig.projectId}").`;
  }

  return {
    isConfigured,
    isPlaceholder,
    projectId: firebaseConfig?.projectId || '',
    authDomain: firebaseConfig?.authDomain || '',
    errorMessage,
  };
}

export const isFirebaseConfigured = isConfigured;
export const auth = authInstance;
export const db = dbInstance;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = authInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}


// Helper to login with Google Popup
export async function loginWithGoogle() {
  if (!authInstance) {
    throw new Error('Firebase Authentication is not configured yet. Please review the setup instructions.');
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider);
}

// Helper to sign out
export async function logoutUser() {
  if (authInstance) {
    await fbSignOut(authInstance);
  }
}

// Save Booking directly to Firestore
export async function saveBookingToFirestore(booking: BookingRequest): Promise<void> {
  if (!dbInstance) {
    console.info('Firestore is in local fallback mode. Booking saved locally.');
    return;
  }
  try {
    const bookingRef = doc(dbInstance, 'bookings', booking.id);
    await setDoc(bookingRef, {
      ...booking,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not save booking to remote Firestore; falling back to local state:', error);
  }
}

// Cancel Booking in Firestore
export async function cancelBookingInFirestore(bookingId: string): Promise<void> {
  if (!dbInstance) return;
  try {
    const bookingRef = doc(dbInstance, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not update booking in remote Firestore; falling back to local state:', error);
  }
}

// Save Business Registration to Firestore
export async function saveBusinessToFirestore(business: LocalBusiness): Promise<void> {
  if (!dbInstance) {
    console.info('Firestore is in local fallback mode. Business saved locally.');
    return;
  }
  try {
    const bizRef = doc(dbInstance, 'businesses', business.id);
    await setDoc(bizRef, {
      ...business,
      businessName: business.name,
      state: business.stateName,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not save business to remote Firestore; falling back to local state:', error);
  }
}

// Update Business Approval or Availability in Firestore
export async function updateBusinessInFirestore(businessId: string, updates: Partial<LocalBusiness>): Promise<void> {
  if (!dbInstance) return;
  try {
    const bizRef = doc(dbInstance, 'businesses', businessId);
    await updateDoc(bizRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not update business in remote Firestore; falling back to local state:', error);
  }
}

// Save Tour Guide Registration to Firestore
export async function saveGuideToFirestore(guide: TourGuide): Promise<void> {
  if (!dbInstance) return;
  try {
    const guideRef = doc(dbInstance, 'tourGuides', guide.id);
    await setDoc(guideRef, {
      ...guide,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not save guide to remote Firestore; falling back to local state:', error);
  }
}

// Update Tour Guide Status in Firestore
export async function updateGuideInFirestore(guideId: string, updates: Partial<TourGuide>): Promise<void> {
  if (!dbInstance) return;
  try {
    const guideRef = doc(dbInstance, 'tourGuides', guideId);
    await updateDoc(guideRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not update guide in remote Firestore; falling back to local state:', error);
  }
}

// Delete Tour Guide from Firestore
export async function deleteGuideFromFirestore(guideId: string): Promise<void> {
  if (!dbInstance) return;
  try {
    const guideRef = doc(dbInstance, 'tourGuides', guideId);
    await deleteDoc(guideRef);
  } catch (error) {
    console.warn('Could not delete guide from remote Firestore; falling back to local state:', error);
  }
}

// Save or Update User Profile in Firestore
export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  if (!dbInstance) return;
  try {
    const userRef = doc(dbInstance, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      savedWishlist: user.savedWishlist || [],
      photoURL: user.photoURL || null,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.warn('Could not save user profile to remote Firestore; falling back to local state:', error);
  }
}

// Real-time Subscriptions when Firestore is configured and connected
export function subscribeToUserBookings(userId: string, callback: (bookings: BookingRequest[]) => void): () => void {
  if (!dbInstance || !userId) return () => {};
  try {
    const q = query(collection(dbInstance, 'bookings'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const results: BookingRequest[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as BookingRequest);
      });
      callback(results);
    }, (error) => {
      console.warn('Firestore bookings subscription warning:', error);
    });
  } catch (err) {
    console.warn('Error setting up bookings subscription:', err);
    return () => {};
  }
}

export function subscribeToBusinesses(callback: (businesses: LocalBusiness[]) => void): () => void {
  if (!dbInstance) return () => {};
  try {
    const q = collection(dbInstance, 'businesses');
    return onSnapshot(q, (snapshot) => {
      const results: LocalBusiness[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as LocalBusiness);
      });
      if (results.length > 0) {
        callback(results);
      }
    }, (error) => {
      console.warn('Firestore businesses subscription warning:', error);
    });
  } catch (err) {
    console.warn('Error setting up businesses subscription:', err);
    return () => {};
  }
}

export function subscribeToGuides(callback: (guides: TourGuide[]) => void): () => void {
  if (!dbInstance) return () => {};
  try {
    const q = collection(dbInstance, 'tourGuides');
    return onSnapshot(q, (snapshot) => {
      const results: TourGuide[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as TourGuide);
      });
      if (results.length > 0) {
        callback(results);
      }
    }, (error) => {
      console.warn('Firestore guides subscription warning:', error);
    });
  } catch (err) {
    console.warn('Error setting up guides subscription:', err);
    return () => {};
  }
}

