'use client';

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface AddSpiritCardProps {
    onClick: () => void;
}

export default function AddSpiritCard({ onClick }: AddSpiritCardProps) {
    const pathname = usePathname() || "";
    const isEn = pathname.split('/')[1] === 'en';
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="cursor-pointer group flex flex-col items-center justify-center aspect-[2/3] rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
            onClick={onClick}
        >
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                +
            </div>
            <span className="text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-primary text-center px-1">
                {isEn ? "Add" : "추가"}
            </span>
        </motion.div>
    );
}
