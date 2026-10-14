import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#F07843] hover:bg-[#DE632E] text-white shadow-sm hover:shadow-md focus:ring-[#F07843] active:scale-[0.98]',
    secondary: 'bg-[#174A35] hover:bg-[#0F3324] text-white shadow-sm hover:shadow-md focus:ring-[#174A35] active:scale-[0.98]',
    outline: 'border border-[#E0D7C9] bg-white hover:bg-[#FAF8F2] text-[#174A35] hover:border-[#174A35] focus:ring-[#174A35] active:scale-[0.98]',
    ghost: 'text-[#4A5568] hover:bg-[#EBF3EE] hover:text-[#174A35] focus:ring-[#174A35]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
