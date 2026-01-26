'use client';

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useEffect } from "react";

// Toast z-index constant to avoid conflicts
const TOAST_Z_INDEX = 200;

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
  variant?: 'success' | 'error';
}

export default function SuccessToast({ 
  isVisible, 
  message, 
  onClose, 
  duration = 3000,
  variant = 'success' 
}: SuccessToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const Icon = variant === 'success' ? CheckCircle : AlertCircle;
  const iconColor = variant === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2"
          style={{ zIndex: TOAST_Z_INDEX }}
        >
          <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3 min-w-[280px]">
            <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
            <span className="text-sm font-bold text-gray-900">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
