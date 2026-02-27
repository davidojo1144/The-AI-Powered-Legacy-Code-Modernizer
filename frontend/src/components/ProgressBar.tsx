import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showPercentage?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  color = 'blue',
  showPercentage = false,
  animated = false,
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-400',
    green: 'bg-gradient-to-r from-green-500 to-green-400',
    red: 'bg-gradient-to-r from-red-500 to-red-400',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-400',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-400',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-white/10 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-2 text-sm text-white/70 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;