'use client';

import { useState, useEffect } from 'react';
import GoogleAd from '@/components/ui/GoogleAd';

type AdVariant = 'display' | 'in-feed' | 'responsive';

interface AdSlotProps {
    client?: string;
    slot: string;
    variant?: AdVariant;
    className?: string;
    style?: React.CSSProperties;
    label?: string; // "Advertisement" or custom label
}

export default function AdSlot({
    client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
    slot,
    variant = 'responsive',
    className = '',
    style,
    label = 'Advertisement'
}: AdSlotProps) {
    const [showAds, setShowAds] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if ads are enabled via env var
        const adsEnabled = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';
        setShowAds(adsEnabled);
    }, []);

    if (!isMounted) return null;

    // Placeholder styles based on variant
    // Base height classes to prevent CLS
    const getHeightClass = () => {
        switch (variant) {
            case 'display': return 'min-h-[280px]'; // Standard MPU height
            case 'in-feed': return 'min-h-[150px]'; // Typical Native Ad height
            case 'responsive': return 'min-h-[280px] sm:min-h-[90px]'; // Mobile box vs Desktop banner
            default: return 'min-h-[250px]';
        }
    };

    if (!showAds) {
        // ... (placeholder logic kept for dev/hidden mode) ...
        return null; // Or keep placeholder if you want dev feedback
    }

    return (
        <div
            className={`overflow-hidden my-4 w-full block bg-gray-50 dark:bg-slate-900/30 ${getHeightClass()} ${className}`}
            style={{ minWidth: '100%', ...style }}
        >
            <div className="text-[10px] text-center text-gray-300 dark:text-slate-600 mb-2 mt-1 uppercase tracking-wider select-none">
                {label} (Sponsored)
            </div>
            <div className="w-full block">
                <GoogleAd
                    client={client}
                    slot={slot}
                    format={variant === 'in-feed' ? 'fluid' : 'auto'}
                    responsive={variant !== 'display'}
                    style={{ display: 'block', width: '100%' }}
                />
            </div>
        </div>
    );
}
