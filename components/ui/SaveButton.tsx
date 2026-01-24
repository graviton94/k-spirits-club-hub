'use client';

import { useState } from 'react';

interface SaveButtonProps {
  spiritId: string;
}

export default function SaveButton({ spiritId }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // In production, this would call an API endpoint
    setTimeout(() => {
      setIsSaved(!isSaved);
      setIsLoading(false);
    }, 500);
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${isSaved
          ? 'bg-primary text-primary-foreground'
          : 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? '...' : isSaved ? '✓ 캐비닛에 저장됨' : '+ 캐비닛에 저장'}
    </button>
  );
}
