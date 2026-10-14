import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected issue while loading accommodation data.',
  onRetry,
}) => {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-red-200 max-w-lg mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 font-display mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-[#D9531E] hover:bg-[#C84B16] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
