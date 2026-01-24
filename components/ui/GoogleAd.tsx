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
  const adRef = useRef<boolean>(false);

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad to AdSense queue
    try {
      if (!adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adRef.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [client]);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
