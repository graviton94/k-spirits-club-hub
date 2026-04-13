'use client';

import { motion } from "framer-motion";
import FlavorView from "@/components/cabinet/FlavorView";
import GuestOverlay from "./GuestOverlay";
import { Spirit } from "@/lib/utils/flavor-engine";

interface PreferenceExplorationProps {
    flavorAnalysis: any;
    spirits: Spirit[];
    profile: any;
    loading: boolean;
    dict?: any;
}

export default function PreferenceExploration({
    flavorAnalysis,
    spirits,
    profile,
    loading,
    dict
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
            <FlavorView dict={dict} spirits={spirits} />
        </motion.div>
    );
}
