import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rounded?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  rounded = true,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    default: 'bg-white/10 text-white/90 border border-white/20',
    success: 'bg-green-500/20 text-green-300 border border-green-400/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30',
    error: 'bg-red-500/20 text-red-300 border border-red-400/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${roundedClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;