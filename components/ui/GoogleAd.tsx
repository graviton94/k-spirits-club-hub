'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdProps {
  /**
   * AdSense client ID (e.g., "ca-pub-XXXXXXXXXXXXXXXX")
   */
  client: string;
  /**
   * Ad slot ID
   */
  slot: string;
  /**
   * Ad format (default: "auto")
   */
  format?: string;
  /**
   * Enable responsive ads (default: true)
   */
  responsive?: boolean;
  /**
   * Custom style object
   */
  style?: React.CSSProperties;
  /**
   * Custom className
   */
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * GoogleAd Component
 * Reusable component for displaying Google AdSense ads
 */
export default function GoogleAd({
  client,
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = '',
}: GoogleAdProps) {
  const adRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad to AdSense queue after a short delay to ensure element is mounted
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !adRef.current.hasAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [client, slot]);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
