// High-availability verified fallbacks for Indian destinations, stays, and guides
export const FALLBACK_HERITAGE_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'; // Taj Mahal
export const FALLBACK_STAY_IMAGE = 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80'; // Heritage Stay
export const FALLBACK_GUIDE_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'; // Guide portrait
export const FALLBACK_CRAFT_IMAGE = 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80'; // Handicrafts

export function onImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = FALLBACK_HERITAGE_IMAGE
) {
  const img = e.currentTarget;
  if (img.src !== fallback) {
    img.onerror = null; // Prevent infinite loop if fallback fails
    img.src = fallback;
  }
}
