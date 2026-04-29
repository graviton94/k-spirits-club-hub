'use client';

import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Extra padding override — defaults to var(--spacing-container) */
  noPad?: boolean;
}

/**
 * GlassCard — WOW Aesthetic glassmorphic surface.
 * Uses --color-surface + 0.6 alpha, blur(12px), invisible border (1px 10% white).
 * Background and border intentionally avoid pure #000/#fff per WOW bible rule 1.
 */
function GlassCard({ noPad = false, className = '', children, style, ...rest }: GlassCardProps) {
  return (
    <div
      className={[
        'glass-wow rounded-3xl',
        noPad ? '' : 'wow-container',
        className,
      ].join(' ')}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

export { GlassCard };
export type { GlassCardProps };
