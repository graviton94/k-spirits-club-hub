'use client';

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
}

export default function MyCabinet({
    spirits,
    profile,
    loading,
    onReviewClick,
    onInfoClick,
    onAddClick
}: MyCabinetProps) {
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
                                visible: { transition: { staggerChildren: 0.05 } }
                            }}
                            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3"
                        >
                            {spirits.map((spirit) => (
                                <CabinetSpiritCard
                                    key={spirit.id}
                                    spirit={spirit}
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
