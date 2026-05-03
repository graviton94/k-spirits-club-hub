'use client';

import { motion } from "framer-motion";

interface GuestOverlayProps {
    flavor?: boolean;
}

export default function GuestOverlay({ flavor = false }: GuestOverlayProps) {
    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-background/60 dark:bg-background/60 backdrop-blur-xl rounded-3xl" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-2xl border border-border dark:border-border max-w-md mx-4"
            >
                <div className="text-center space-y-6">
                    <motion.div
                        animate={flavor ? { rotate: [0, 10, -10, 0] } : { y: [0, -10, 0] }}
                        transition={{ duration: flavor ? 3 : 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-7xl"
                    >
                        {flavor ? '🌌' : '🗃️'}
                    </motion.div>

                    <h2 className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        {flavor ? '취향 탐색 잠금' : '회원 전용 공간'}
                    </h2>

                    <p className="text-muted-foreground dark:text-muted-foreground text-lg leading-relaxed">
                        {flavor ? '나만의 취향 분석을' : '나만의 술장을 만들고'}<br />
                        {flavor ? '시작 해보세요!' : '기록 해보세요!'}
                    </p>

                    <button
                        onClick={() => {
                            const loginButton = document.querySelector('[aria-label="Login"]') as HTMLElement;
                            if (loginButton) loginButton.click();
                        }}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                        회원가입하고 시작하기
                    </button>

                    {!flavor && (
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                            이미 회원이신가요? 로그인하세요
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
