import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try adjusting your search criteria or resetting filters.',
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#E8E1D5] max-w-lg mx-auto shadow-xs">
      <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E1D5] text-gray-400 flex items-center justify-center mx-auto mb-4">
        {icon || <SearchX className="w-8 h-8 text-[#D9531E]" />}
      </div>
      <h3 className="text-xl font-bold text-[#143D24] font-display mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-[#143D24] hover:bg-[#0D2B1A] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-md transition-colors shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
