'use client';

import { motion } from "framer-motion";
import FlavorView from "@/components/cabinet/FlavorView";
import GuestOverlay from "./GuestOverlay";

interface PreferenceExplorationProps {
    flavorAnalysis: any;
    profile: any;
    loading: boolean;
}

export default function PreferenceExploration({
    flavorAnalysis, // Not used in new FlavorView, kept for interface compat for now
    profile,
    loading
}: PreferenceExplorationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            {!profile && !loading && (
                <GuestOverlay flavor />
            )}

            {/* New Taste Analysis View */}
            <FlavorView />
        </motion.div>
    );
}
