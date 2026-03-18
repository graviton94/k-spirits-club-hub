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
          className="fixed top-4 left-1/2 w-full max-w-sm -translate-x-1/2 px-4"
          style={{ zIndex: TOAST_Z_INDEX }}
        >
          <div className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white/90 px-4 py-4 shadow-xl backdrop-blur-md min-[380px]:px-6">
            <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
            <span className="min-w-0 break-words text-sm font-bold text-gray-900">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
