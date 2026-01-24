'use client';

import { useState } from 'react';
import GoogleAd from './GoogleAd';
import { X } from 'lucide-react';

interface StickyFooterAdProps {
  /**
   * AdSense client ID
   */
  client: string;
  /**
   * Ad slot ID for sticky footer
   */
  slot: string;
}

/**
 * StickyFooterAd Component
 * Fixed-bottom ad unit with close button that remains visible during scrolling
 */
export default function StickyFooterAd({ client, slot }: StickyFooterAdProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-lg border-t border-white/10 shadow-2xl" style={{ bottom: '96px' }}>
      <div className="relative container mx-auto max-w-4xl px-4 py-2">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-white transition-colors z-10 bg-black/50 rounded-full"
          aria-label="Close ad"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ad Container */}
        <div className="flex items-center justify-center min-h-[50px]">
          <GoogleAd
            client={client}
            slot={slot}
            format="auto"
            responsive={true}
            style={{ display: 'block', width: '100%', minHeight: '50px' }}
          />
        </div>
      </div>
    </div>
  );
}
