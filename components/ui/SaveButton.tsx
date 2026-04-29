'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

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
    <Button
      variant={isSaved ? 'primary' : 'secondary'}
      onClick={handleSave}
      disabled={isLoading}
      className="w-full py-3"
    >
      {isLoading ? '...' : isSaved ? '✓ 캐비닛에 저장됨' : '+ 캐비닛에 저장'}
    </Button>
  );
}
