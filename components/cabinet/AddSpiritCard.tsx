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
            className="cursor-pointer group flex flex-col items-center justify-center aspect-[2/3] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all"
            onClick={onClick}
        >
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                +
            </div>
            <span className="text-[10px] sm:text-sm font-bold text-gray-500 group-hover:text-amber-600 dark:text-gray-400 text-center px-1">
                {isEn ? "Add" : "추가"}
            </span>
        </motion.div>
    );
}
