import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80';

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title,
  className = '',
}) => {
  const validImages = images && images.length > 0 ? images : [FALLBACK_IMAGE];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState(validImages[0]);

  useEffect(() => {
    setSelectedIndex(0);
    setImgSrc(validImages[0]);
  }, [images]);

  const handleThumbnailClick = (idx: number) => {
    setSelectedIndex(idx);
    setImgSrc(validImages[idx]);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % validImages.length;
    setSelectedIndex(nextIdx);
    setImgSrc(validImages[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (selectedIndex - 1 + validImages.length) % validImages.length;
    setSelectedIndex(prevIdx);
    setImgSrc(validImages[prevIdx]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Image Stage */}
      <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-900 border border-[#E8E1D5] group shadow-xs">
        <img
          src={imgSrc}
          alt={`${title} - view ${selectedIndex + 1}`}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#E89E28]" />
          <span>
            {selectedIndex + 1} / {validImages.length}
          </span>
        </div>

        {/* Arrow Navigation */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {validImages.map((thumb, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-[#D9531E] ring-2 ring-[#D9531E]/20 scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
