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
            <div className="flex justify-center mb-10">
                <div className="inline-flex p-1.5 bg-muted/20 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${filter === 'all' ? 'bg-primary text-primary-foreground shadow-[0_5px_15px_-3px_rgba(var(--primary-rgb),0.3)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                    >
                        {dict?.all || "전체"}
                    </button>
                    <button
                        onClick={() => setFilter('owned')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${filter === 'owned' ? 'bg-primary text-primary-foreground shadow-[0_5px_15px_-3px_rgba(var(--primary-rgb),0.3)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                    >
                        {dict?.cabinet || "보유 중"}
                    </button>
                    <button
                        onClick={() => setFilter('wish')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${filter === 'wish' ? 'bg-primary text-primary-foreground shadow-[0_5px_15px_-3px_rgba(var(--primary-rgb),0.3)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                    >
                        {dict?.wishlist || "위시리스트"}
                    </button>
                </div>
            </div>

            {/* Spirits Grid */}
            <section className="mb-20">
                <div className="relative bg-card/10 backdrop-blur-3xl rounded-[3rem] px-4 py-8 sm:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-white/5 overflow-hidden">
                    {/* Immersive Glow Effects */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: filteredSpirits.length > 50 ? 0.01 : 0.03 } }
                            }}
                            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-6"
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
