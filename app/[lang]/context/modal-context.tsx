'use client';

import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';

interface ModalContextType {
    openModal: () => void;
    closeModal: () => void;
    isAnyModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType>({
    openModal: () => {},
    closeModal: () => {},
    isAnyModalOpen: false,
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [count, setCount] = useState(0);

    const openModal = useCallback(() => setCount(c => c + 1), []);
    const closeModal = useCallback(() => setCount(c => Math.max(0, c - 1)), []);

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isAnyModalOpen: count > 0 }}>
            {children}
        </ModalContext.Provider>
    );
}
