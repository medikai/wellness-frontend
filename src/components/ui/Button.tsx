import React from 'react';
import { borderRadius, typography } from '@/design-tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const sizeStyles = {
    sm: `h-8 px-3 text-sm ${typography.fontSize.sm}`,
    md: `h-10 px-4 text-base ${typography.fontSize.base}`,
    lg: `h-12 px-6 text-lg ${typography.fontSize.lg}`,
    xl: `h-14 px-8 text-xl font-semibold`,
  };

  const variantStyles = {
    primary: `
      bg-teal-primary text-white
      hover:bg-teal-dark
      focus:ring-teal-primary
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-orange-primary text-white
      hover:bg-orange-dark
      focus:ring-orange-primary
      shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-neutral-dark text-neutral-dark
      hover:bg-neutral-dark hover:text-white
      focus:ring-neutral-dark
    `,
    ghost: `
      text-neutral-dark
      hover:bg-neutral-light
      focus:ring-neutral-medium
    `,
    hero: `
      bg-white text-teal-primary
      hover:bg-teal-light
      focus:ring-teal-primary
      shadow-lg hover:shadow-xl
    `,
  };

  // Use arbitrary value to honor design token (Tailwind v4 supports this)
  const roundedStyles = `rounded-[${borderRadius.lg}]`;

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        // ${roundedStyles}
        rounded-lg
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;