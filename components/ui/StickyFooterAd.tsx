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
      <div className="relative container mx-auto max-w-4xl px-2 py-1">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-1 p-1 text-gray-400 hover:text-white transition-colors z-[100] bg-neutral-800 rounded-full border border-white/20 shadow-lg"
          aria-label="Close ad"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ad Container: Force maximum height to prevent layout shift & covering the screen */}
        <div className="flex items-center justify-center w-full h-[60px] md:h-[90px] overflow-hidden">
          <GoogleAd
            client={client}
            slot={slot}
            format="horizontal"
            responsive={true}
            style={{ display: 'inline-block', width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
