'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isBotClient } from '@/lib/utils/bot-detection';
import SuccessToast from '@/components/ui/SuccessToast';
import Image from 'next/image';

interface OnboardingModalProps {
    dict: {
        title: string;
        subtitle: string;
        year: string;
        month: string;
        day: string;
        birthDateLabel: string;
        enter: string;
        exit: string;
        footer: string;
        errorEmpty: string;
        errorInvalid: string;
        errorYear: string;
        errorMonth: string;
        errorDay: string;
        errorFuture: string;
        errorUnderage: string;
    };
}

export default function OnboardingModal({ dict }: OnboardingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('error');

    const triggerToast = (msg: string, variant: 'success' | 'error' = 'error') => {
        setToastMessage(msg);
        setToastVariant(variant);
        setShowToast(true);
    };

    useEffect(() => {
        // Bypass age verification for search engine crawlers (Googlebot, etc.)
        // This simulates a verified adult user (e.g. 2000-01-01 birthdate) entering the site.
        // The modal is suppressed so crawlers can access the main content (`children` in layout) immediately.
        // 
        // Note: This is safe from hydration mismatches because:
        // 1. Initial state (isOpen = false) is consistent on server and client
        // 2. Bot detection only runs client-side after hydration completes
        // 3. Modal state only changes after component mounts (post-hydration)
        if (isBotClient()) {
            return;
        }

        // Check if user has already verified their age
        const ageVerified = localStorage.getItem('kspirits_age_verified');
        if (!ageVerified) {
            setIsOpen(true);
        }
    }, []);

    const handleEnter = () => {
        // Validate inputs
        if (!birthYear || !birthMonth || !birthDay) {
            triggerToast(dict.errorEmpty);
            return;
        }

        const year = parseInt(birthYear, 10);
        const month = parseInt(birthMonth, 10);
        const day = parseInt(birthDay, 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            triggerToast(dict.errorInvalid);
            return;
        }

        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
            triggerToast(dict.errorYear);
            return;
        }
        if (month < 1 || month > 12) {
            triggerToast(dict.errorMonth);
            return;
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            triggerToast(dict.errorDay.replace('{month}', month.toString()).replace('{days}', daysInMonth.toString()));
            return;
        }

        const today = new Date();
        const birthDate = new Date(year, month - 1, day);

        if (birthDate > today) {
            triggerToast(dict.errorFuture);
            return;
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        const isAdult = age >= 19;

        if (!isAdult) {
            triggerToast(dict.errorUnderage);
            setTimeout(() => {
                window.location.replace('https://google.com');
            }, 1500);
        } else {
            localStorage.setItem('kspirits_age_verified', 'true');
            setIsOpen(false);
        }
    };

    const handleExit = () => {
        // Use replace() to prevent back button navigation
        window.location.replace('https://google.com');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="onboarding-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
                >
                    <motion.div
                        key="onboarding-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-500/20 to-transparent" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="inline-block p-1 bg-slate-50 rounded-full mb-6 border border-slate-100 shadow-sm">
                                    <div className="w-20 h-20 relative rounded-full overflow-hidden">
                                        <Image 
                                            src="/icons/icon-192.png" 
                                            alt="K-Spirits Club"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{dict.title}</h2>
                                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                                    {dict.subtitle}
                                </p>
                            </div>

                            {/* Birth Date Inputs */}
                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-3 ml-1 uppercase tracking-wider">
                                        {dict.birthDateLabel}
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Year */}
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="YYYY"
                                                value={birthYear}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 4) setBirthYear(value);
                                                }}
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-4 text-center font-black text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <p className="text-[10px] font-bold text-slate-400 text-center mt-2">{dict.year}</p>
                                        </div>
                                        {/* Month */}
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="MM"
                                                value={birthMonth}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 2) setBirthMonth(value);
                                                }}
                                                min="1"
                                                max="12"
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-4 text-center font-black text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <p className="text-[10px] font-bold text-slate-400 text-center mt-2">{dict.month}</p>
                                        </div>
                                        {/* Day */}
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="DD"
                                                value={birthDay}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 2) setBirthDay(value);
                                                }}
                                                min="1"
                                                max="31"
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-4 text-center font-black text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <p className="text-[10px] font-bold text-slate-400 text-center mt-2">{dict.day}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleEnter}
                                    className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                                >
                                    {dict.enter}
                                </button>

                                <button
                                    onClick={handleExit}
                                    className="w-full py-3.5 bg-transparent hover:bg-slate-50 text-slate-400 hover:text-slate-600 font-semibold rounded-2xl transition-all border border-slate-100 active:scale-[0.98]"
                                >
                                    {dict.exit}
                                </button>
                            </div>

                            {/* Footer notice */}
                            <p className="text-[11px] text-slate-400 text-center mt-8 leading-relaxed px-4">
                                {dict.footer}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                variant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </AnimatePresence>
    );
}
