import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted' | 'error';
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-6 transition-all duration-200';
  
  const variantClasses = {
    default: 'hover:bg-white/10',
    highlighted: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30',
    error: 'bg-red-500/20 border-red-400/30',
  };

  const hoverClasses = hoverable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;