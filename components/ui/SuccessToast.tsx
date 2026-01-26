'use client';

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessToast({ 
  isVisible, 
  message, 
  onClose, 
  duration = 3000 
}: SuccessToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[200]"
        >
          <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3 min-w-[280px]">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <span className="text-sm font-bold text-gray-900">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
