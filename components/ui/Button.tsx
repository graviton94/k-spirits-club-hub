'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110',
  secondary:
    'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80',
  ghost:
    'bg-transparent text-foreground hover:bg-muted',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-7 py-3.5 text-lg rounded-2xl',
};

/**
 * WOW Button — encapsulates 7% scale-down haptic + 0.3s cubic-bezier easing.
 * Never use hardcoded hex colors here; all colors derive from CSS token variables.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center gap-2 font-semibold',
          'transition-[transform,opacity,filter] duration-300',
          'active:scale-[0.93]',
          'disabled:opacity-50 disabled:pointer-events-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        style={{ transitionTimingFunction: 'var(--ease-wow)' }}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize };
