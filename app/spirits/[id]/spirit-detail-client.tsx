'use client';

import { useState } from "react";
import SaveButton from "@/components/ui/SaveButton";
import ReviewSection from "@/components/ui/ReviewSection";
import GoogleAd from "@/components/ui/GoogleAd";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Spirit {
    id: string;
    name: string;
    distillery: string;
    bottler: string | null;
    abv: number;
    volume: number | null;
    category: string;
    subcategory: string | null;
    country: string;
    region: string | null;
    imageUrl: string | null;
    metadata?: {
        nose_tags?: string[];
        palate_tags?: string[];
        finish_tags?: string[];
        [key: string]: any;
    };
}

interface SpiritDetailClientProps {
    spirit: Spirit;
    reviews: any[];
}

export default function SpiritDetailClient({ spirit, reviews }: SpiritDetailClientProps) {
    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl pb-32">
            {/* Header: Horizontal Layout */}
            <div className="flex gap-4 mb-6">
                {/* 120x120 Expandable Image */}
                <ExpandableImage imageUrl={spirit.imageUrl} name={spirit.name} />

                {/* Name/Distillery/ABV */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold mb-2 leading-tight">{spirit.name}</h1>
                    <div className="space-y-1 text-sm">
                        <p className="text-gray-400">{spirit.distillery}</p>
                        <p className="text-amber-400 font-semibold">{spirit.abv}% ABV</p>
                        {spirit.volume && <p className="text-gray-400">{spirit.volume}ml</p>}
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                <InfoItem label="카테고리" value={spirit.category} />
                {spirit.subcategory && <InfoItem label="종류" value={spirit.subcategory} />}
                <InfoItem label="원산지" value={spirit.country} />
                {spirit.region && <InfoItem label="지역" value={spirit.region} />}
                {spirit.bottler && <InfoItem label="박틀러" value={spirit.bottler} />}
            </div>

            {/* Flavor Profile: Compact Grid */}
            {(spirit.metadata?.nose_tags || spirit.metadata?.palate_tags || spirit.metadata?.finish_tags) && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Flavor Profile</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {spirit.metadata.nose_tags && (
                            <FlavorSection title="Nose" tags={spirit.metadata.nose_tags} />
                        )}
                        {spirit.metadata.palate_tags && (
                            <FlavorSection title="Palate" tags={spirit.metadata.palate_tags} />
                        )}
                        {spirit.metadata.finish_tags && (
                            <FlavorSection title="Finish" tags={spirit.metadata.finish_tags} />
                        )}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <ReviewSection spiritId={spirit.id} reviews={reviews} />

            {/* Bottom Ad - After Tasting Notes */}
            {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT && (
                <div className="mt-8 mb-6">
                    <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
                    <GoogleAd
                        client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                        slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT}
                        format="auto"
                        responsive={true}
                        style={{ display: 'block', minHeight: '100px' }}
                        className="rounded-lg overflow-hidden"
                    />
                </div>
            )}

            {/* Sticky Bottom CTA Buttons - Above BottomNav */}
            <div className="fixed bottom-28 left-0 right-0 bg-neutral-900/95 backdrop-blur-lg border-t border-white/10 p-4 z-50">
                <div className="container mx-auto max-w-4xl flex gap-3">
                    <button className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors">
                        내 술장에 담기
                    </button>
                    <button className="flex-1 py-3 px-4 border border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-colors">
                        위시리스트
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-3 bg-neutral-800/50 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-semibold text-white">{value}</p>
        </div>
    );
}

function FlavorSection({ title, tags }: { title: string; tags: string[] }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="text-xs px-3 py-1.5 rounded-full bg-neutral-800 text-gray-300 border border-white/10"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

function ExpandableImage({ imageUrl, name }: { imageUrl: string | null; name: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Thumbnail */}
            <motion.div
                className="flex-shrink-0 w-30 h-30 rounded-lg overflow-hidden bg-neutral-800 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsExpanded(true)}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                        🥃
                    </div>
                )}
            </motion.div>

            {/* Full Screen Overlay */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
                            onClick={() => setIsExpanded(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Expanded Image */}
                        <motion.div
                            className="max-w-2xl max-h-[80vh]"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            ) : (
                                <div className="w-96 h-96 flex items-center justify-center text-9xl bg-neutral-800 rounded-lg">
                                    🥃
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
