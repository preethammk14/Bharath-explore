import React from 'react';

interface PriceDisplayProps {
  amount: number;
  period?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  period = '/ night',
  size = 'md',
  className = '',
}) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-bold',
    lg: 'text-lg font-extrabold',
    xl: 'text-2xl font-extrabold',
  };

  return (
    <div className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className={`text-[#D9531E] tracking-tight ${sizeClasses[size]}`}>
        {formatted}
      </span>
      {period && (
        <span className="text-[11px] font-normal text-gray-500">
          {period}
        </span>
      )}
    </div>
  );
};
