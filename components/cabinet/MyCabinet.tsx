import { useState } from "react";
import { motion } from "framer-motion";
import { Spirit } from "@/lib/utils/flavor-engine";
import GuestOverlay from "./GuestOverlay";
import CabinetSpiritCard from "./CabinetSpiritCard";
import AddSpiritCard from "./AddSpiritCard";

interface MyCabinetProps {
    spirits: Spirit[];
    profile: any;
    loading: boolean;
    onReviewClick: (e: React.MouseEvent, spirit: Spirit) => void;
    onInfoClick: (e: React.MouseEvent, spirit: Spirit) => void;
    onAddClick: () => void;
    dict?: any;
}

export default function MyCabinet({
    spirits,
    profile,
    loading,
    onReviewClick,
    onInfoClick,
    onAddClick,
    dict
}: MyCabinetProps) {
    const [filter, setFilter] = useState<'all' | 'owned' | 'wish'>('all');

    const filteredSpirits = spirits.filter(s => {
        if (filter === 'all') return true;
        if (filter === 'owned') return !s.isWishlist;
        if (filter === 'wish') return s.isWishlist;
        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            {/* Guest Overlay */}
            {!profile && !loading && (
                <GuestOverlay />
            )}

            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 bg-secondary/30 rounded-xl border border-border/50">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {dict?.all || "전체"}
                    </button>
                    <button
                        onClick={() => setFilter('owned')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'owned' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {dict?.cabinet || "보유 중"}
                    </button>
                    <button
                        onClick={() => setFilter('wish')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'wish' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {dict?.wishlist || "위시리스트"}
                    </button>
                </div>
            </div>

            {/* Spirits Grid */}
            <section className="mb-16">
                <div className="relative bg-[#0f172a] rounded-[2.5rem] px-3 py-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden">
                    {/* Neon Glow Effects */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: filteredSpirits.length > 50 ? 0.01 : 0.03 } }
                            }}
                            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3"
                        >
                            {filteredSpirits.map((spirit, index) => (
                                <CabinetSpiritCard
                                    key={spirit.id}
                                    spirit={spirit}
                                    index={index}
                                    onReviewClick={onReviewClick}
                                    onInfoClick={onInfoClick}
                                />
                            ))}

                            {/* Add Button */}
                            <AddSpiritCard onClick={onAddClick} />
                        </motion.div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
