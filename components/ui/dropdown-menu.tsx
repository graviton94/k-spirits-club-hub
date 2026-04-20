// components/ui/dropdown-menu.tsx

'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

export const DropdownMenuTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <button className={className}>
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ children, align = 'end', className = '' }: { children: React.ReactNode, align?: 'start' | 'end', className?: string }) => {
    // This is a simplified implementation. In a full shadcn/radix setup, this would be a portal.
    // For now, we'll use a simple absolute positioned div that shows on parent hover or focused trigger.
    return (
        <div className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} z-50 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none p-1 border border-border group-hover:block hidden ${className}`}>
            {children}
        </div>
    );
};

export const DropdownMenuItem = ({ 
    children, 
    onClick, 
    className = "" 
}: { 
    children: React.ReactNode, 
    onClick?: () => void, 
    className?: string 
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors ${className}`}
        >
            {children}
        </button>
    );
};
