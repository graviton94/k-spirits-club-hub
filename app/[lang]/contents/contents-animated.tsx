'use client';

import { motion } from "framer-motion";

export function ContentsHeaderAnimated({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {children}
        </motion.div>
    );
}

export function ContentsCardAnimated({ children, delay }: { children: React.ReactNode; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
        >
            {children}
        </motion.div>
    );
}
