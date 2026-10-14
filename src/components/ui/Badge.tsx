import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'saffron' | 'forest' | 'amber' | 'blue' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className = '',
}) => {
  const variants = {
    saffron: 'bg-[#FDEEE9] text-[#D9531E] border border-[#F5C7B7]',
    forest: 'bg-[#EBF3EE] text-[#143D24] border border-[#C5DDD0]',
    amber: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]',
    blue: 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]',
    neutral: 'bg-white text-[#4A5568] border border-[#E8E1D5]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
