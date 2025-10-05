import React from 'react';
// import { colors } from '@/design-tokens';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'teal' | 'orange' | 'primary';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'teal',
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorStyles = {
    teal: 'bg-teal-primary',
    orange: 'bg-orange-primary',
    primary: 'bg-primary',
  };

  const bgColorStyles = {
    teal: 'bg-teal-light',
    orange: 'bg-orange-light',
    primary: 'bg-neutral-light',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-dark">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-neutral-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`
          w-full rounded-full overflow-hidden
          ${sizeStyles[size]}
          ${bgColorStyles[color]}
        `}
      >
        <div
          className={`
            h-full transition-all duration-300 ease-out
            ${colorStyles[color]}
            ${sizeStyles[size]}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;