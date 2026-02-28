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
   * Ad format (default: "auto", or "fluid" for in-feed ads)
   */
  format?: string;
  /**
   * Layout key for in-feed ads (e.g., "-fb+5w+4e-db+86")
   */
  layoutKey?: string;
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
  layoutKey,
  responsive = true,
  style = { display: 'block' },
  className = '',
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 1. Load AdSense script once globally
    const scriptId = 'google-adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // 2. Push ad initialization exactly once per component instance
    const timer = setTimeout(() => {
      if (adRef.current && !adRef.current.getAttribute('data-ad-pushed')) {
        try {
          adRef.current.setAttribute('data-ad-pushed', 'true');
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense push error:', error);
          adRef.current.removeAttribute('data-ad-pushed');
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [client, slot, format, layoutKey]);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
