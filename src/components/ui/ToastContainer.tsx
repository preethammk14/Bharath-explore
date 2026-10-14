import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[2000] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        let borderClass = 'border-emerald-200';
        let bgClass = 'bg-white';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />;
          borderClass = 'border-red-200';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-[#D9531E] shrink-0" />;
          borderClass = 'border-[#F5C7B7]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg ${borderClass} ${bgClass} transition-all transform translate-y-0`}
          >
            {icon}
            <div className="flex-1 text-xs text-[#1E232A] font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
