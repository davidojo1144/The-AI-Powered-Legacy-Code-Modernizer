import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
  leftIcon,
  rightIcon,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white/30 border border-white/20',
    outline: 'bg-transparent text-white hover:bg-white/10 focus:ring-white/30 border border-white/40 hover:border-white/60',
    ghost: 'bg-transparent text-white hover:bg-white/10 focus:ring-white/30',
    danger: 'bg-gradient-to-r from-red-500 to-red-400 text-white hover:from-red-600 hover:to-red-500 focus:ring-red-500',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  const fullWidthClasses = fullWidth ? 'w-full' : '';
  const loadingClasses = loading ? 'relative' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? disabledClasses : ''
      } ${fullWidthClasses} ${loadingClasses} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;