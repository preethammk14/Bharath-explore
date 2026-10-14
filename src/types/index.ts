export type RegionType = 'North' | 'South' | 'East' | 'West' | 'North-East' | 'Central';

export interface StateUT {
  id: string;
  name: string;
  type: 'state' | 'ut';
  capital: string;
  region: RegionType;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  bestTimeToVisit: string;
  languages: string[];
  keyAttractions: string[];
  famousFor: string[];
  heroImage: string;
  destinationCount?: number;
}

export type DestinationCategory = 
  | 'Historical' 
  | 'Nature & Wildlife' 
  | 'Spiritual' 
  | 'Beach & Coastal' 
  | 'Hill Station' 
  | 'Culture & Heritage'
  | 'Adventure';

export interface Destination {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  category: DestinationCategory;
  coordinates: [number, number];
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  idealDuration: string;
  entryFee: string;
  nearestHub: string;
  tags: string[];
  featured?: boolean;
}

export type StayCategory = 
  | 'Homestay' 
  | 'Heritage Stay' 
  | 'Eco-Stay' 
  | 'Plantation Stay' 
  | 'Beach Stay' 
  | 'Mountain Stay' 
  | 'Rural Stay' 
  | 'Guesthouse' 
  | 'Boutique Stay';

export type ListingStatus = 'sample' | 'submitted' | 'verified';

export interface Stay {
  id: string;
  name: string;
  destination: string;
  state: string;
  stateId: string;
  stateName: string;
  destinationId?: string;
  locationName: string;
  category: StayCategory;
  type: string;
  shortDescription: string;
  description: string;
  pricePerNight: number;
  guestCapacity: number;
  amenities: string[];
  image: string;
  gallery: string[];
  coordinates: [number, number];
  host?: {
    name: string;
    avatar?: string;
    bio?: string;
    role?: string;
    since?: string;
  };
  listingStatus: ListingStatus;
  isSampleData: boolean;
  dataSource: string;
  roomTypes?: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  isAvailable?: boolean;
  availabilityNotice?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Experience {
  id: string;
  title: string;
  type: 'Heritage Walk' | 'Culinary Trail' | 'Wildlife Safari' | 'Art & Craft Workshop' | 'Spiritual Ceremony' | 'Adventure Trek';
  stateId: string;
  stateName: string;
  destinationId?: string;
  coordinates: [number, number];
  duration: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  hostName: string;
  hostRole: string;
  highlights: string[];
  includes: string[];
  groupSize: string;
}

export type BusinessApprovalStatus = 'approved' | 'pending' | 'rejected';
export type BusinessAvailabilityStatus = 'available' | 'busy' | 'seasonal';

export interface BusinessServiceItem {
  id: string;
  name: string;
  price?: number;
  duration?: string;
  description?: string;
  bookingSupported?: boolean;
}

export interface LocalBusiness {
  id: string;
  name: string;
  category: 'Certified Tour Guide' | 'Handicraft Cooperative' | 'Artisan Workshop' | 'Regional Cuisine' | 'Heritage Transport';
  stateId: string;
  stateName: string;
  city: string;
  coordinates: [number, number];
  contactPhone: string;
  contactEmail: string;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  verified: boolean;
  yearEstablished: number;
  specialties: string[];
  servicesOffered: string[];
  // VTU Smart Tourism Business Portal Extensions
  approvalStatus?: BusinessApprovalStatus;
  ownerId?: string;
  facilities?: string[];
  priceRange?: string;
  availabilityStatus?: BusinessAvailabilityStatus;
  availableServices?: BusinessServiceItem[];
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingRequest {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'stay' | 'experience' | 'business' | 'guide' | 'tour';
  title: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  startDate: string;
  endDate?: string;
  guestsCount: number;
  totalAmount: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'destination' | 'stay' | 'experience' | 'business';
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'traveler' | 'host' | 'admin';
  savedWishlist: string[]; // IDs of destinations, stays, experiences
  homeState?: string;
}

export interface TourOffering {
  title: string;
  description: string;
  duration: string;
  price?: number;
  maxGroupSize?: number;
}

export type PreferredContactMethod = 'enquiry_form' | 'phone' | 'email' | 'whatsapp';
export type GuideVerificationStatus = 'verified' | 'unverified' | 'pending_review';
export type GuideListingStatus = 'published' | 'pending_review' | 'rejected' | 'sample';

export interface TourGuide {
  id: string;
  displayName: string;
  profileImage: string;
  shortBio: string;
  fullBio: string;
  state: string;
  city: string;
  destinationsServed: string[]; // destination IDs or destination names
  specialisations: string[];
  languages: string[];
  yearsOfExperience: number;
  tourTypes: string[];
  pricePerTour?: number;
  pricePerHour?: number;
  contactPhone?: string; // when consented
  contactEmail?: string; // when consented
  preferredContactMethod: PreferredContactMethod;
  availabilityInformation: string;
  verificationStatus: GuideVerificationStatus;
  listingStatus: GuideListingStatus;
  isSampleData: boolean;
  tourOfferings?: TourOffering[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'Pending' | 'Accepted' | 'Declined' | 'Cancelled';

export interface TourEnquiry {
  id: string;
  guideId: string;
  guideName?: string;
  touristUserId?: string; // if authenticated
  touristName: string;
  contactDetails: {
    email: string;
    phone: string;
  };
  destinationId: string;
  destinationName?: string;
  requestedDate: string;
  groupSize: number;
  preferredLanguage: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}
