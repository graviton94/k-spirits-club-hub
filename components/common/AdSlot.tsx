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
    const getPlaceholderStyle = () => {
        switch (variant) {
            case 'in-feed':
                return 'h-[120px] sm:h-[160px] w-full';
            case 'display':
                return 'h-[250px] w-[300px] mx-auto';
            default: // responsive
                return 'h-[100px] w-full';
        }
    };

    if (!showAds) {
        return (
            <div
                className={`bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs uppercase tracking-widest ${getPlaceholderStyle()} ${className}`}
                style={style}
            >
                <span>{label}</span>
                <span className="text-[10px] mt-1 opacity-50">(Sponsored Placeholder)</span>
            </div>
        );
    }

    return (
        <div className={`overflow-hidden my-4 flex justify-center ${className}`} style={{ minHeight: '100px', ...style }}>
            <div className="text-[10px] text-center text-gray-400 mb-1 uppercase tracking-wider">{label}</div>
            <GoogleAd
                client={client}
                slot={slot}
                format={variant === 'in-feed' ? 'fluid' : 'auto'}
                responsive={variant !== 'display'} // Display might be fixed size
                style={{ display: 'block', width: '100%' }}
            />
        </div>
    );
}
