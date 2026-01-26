'use client';

import { motion, AnimatePresence } from "framer-motion";

interface CabinetSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCabinet: () => void;
  onSelectWishlist: () => void;
}

export default function CabinetSelectionModal({
  isOpen,
  onClose,
  onSelectCabinet,
  onSelectWishlist
}: CabinetSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-background/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-b border-border/50">
            <h2 className="text-xl font-black text-white text-center">어디에 저장하시겠어요?</h2>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            <button
              onClick={() => {
                onSelectCabinet();
                onClose();
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🥃</span>
              <div className="flex flex-col items-start">
                <span className="text-base">내 술장에 담기</span>
                <span className="text-xs opacity-90 font-normal">즉시 저장하고 나중에 리뷰 작성</span>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectWishlist();
                onClose();
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-slate-900 hover:from-blue-700 hover:to-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🔖</span>
              <div className="flex flex-col items-start">
                <span className="text-base">위시리스트에 추가</span>
                <span className="text-xs opacity-90 font-normal">마시고 싶은 술 저장</span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-br from-background/95 to-background/80 border-t border-border/50 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white hover:text-white/80 transition-colors"
            >
              취소
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
