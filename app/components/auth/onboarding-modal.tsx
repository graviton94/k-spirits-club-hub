'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');

    useEffect(() => {
        // Check if user has already verified their age
        const ageVerified = localStorage.getItem('kspirits_age_verified');
        if (!ageVerified) {
            setIsOpen(true);
        }
    }, []);

    const handleEnter = () => {
        // Validate inputs
        if (!birthYear || !birthMonth || !birthDay) {
            alert('생년월일을 모두 입력해주세요.');
            return;
        }

        const year = parseInt(birthYear, 10);
        const month = parseInt(birthMonth, 10);
        const day = parseInt(birthDay, 10);

        // Check for NaN from parseInt
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            alert('올바른 숫자를 입력해주세요.');
            return;
        }

        // Basic validation
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
            alert('올바른 연도를 입력해주세요.');
            return;
        }
        if (month < 1 || month > 12) {
            alert('올바른 월을 입력해주세요. (1-12)');
            return;
        }

        // Validate day based on month and year (handles leap years and varying month lengths)
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            alert(`${month}월은 ${daysInMonth}일까지 있습니다.`);
            return;
        }

        // Calculate age with strict birth date comparison
        const today = new Date();
        const birthDate = new Date(year, month - 1, day);

        // Validate that the birth date is not in the future
        if (birthDate > today) {
            alert('미래의 날짜는 입력할 수 없습니다.');
            return;
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if birthday hasn't occurred this year yet
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        const isAdult = age >= 19;

        if (!isAdult) {
            alert('19세 미만은 접속할 수 없습니다.');
            // Use setTimeout to ensure alert is dismissed before redirect
            // Use replace() to prevent back button navigation
            setTimeout(() => {
                window.location.replace('https://google.com');
            }, 100);
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-gradient-to-br from-slate-900 to-slate-950 w-full max-w-md rounded-3xl p-8 shadow-2xl border-2 border-primary/30 relative overflow-hidden"
                    >
                        {/* Decorative background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-block p-4 bg-primary/20 rounded-full mb-4 border-2 border-primary/30">
                                    <span className="text-5xl">🔞</span>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2">Age Verification</h2>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    You must be 19 years or older to enter.
                                </p>
                            </div>

                            {/* Birth Date Inputs */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 ml-1">
                                        생년월일 입력 (Birth Date)
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
                                                className="w-full bg-slate-800/70 border-2 border-slate-700 rounded-xl px-3 py-3 text-center font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <p className="text-xs text-slate-500 text-center mt-1">년</p>
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
                                                className="w-full bg-slate-800/70 border-2 border-slate-700 rounded-xl px-3 py-3 text-center font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <p className="text-xs text-slate-500 text-center mt-1">월</p>
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
                                                className="w-full bg-slate-800/70 border-2 border-slate-700 rounded-xl px-3 py-3 text-center font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <p className="text-xs text-slate-500 text-center mt-1">일</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Legal Notice */}
                                <div className="bg-red-950/30 border-2 border-red-900/50 rounded-xl p-3">
                                    <p className="text-red-400 text-xs text-center leading-relaxed">
                                        ⚠️ 19세 미만은 접속하실 수 없습니다.
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleEnter}
                                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/50 active:scale-[0.98]"
                                >
                                    Enter
                                </button>

                                <button
                                    onClick={handleExit}
                                    className="w-full py-3 bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-300 font-semibold rounded-xl transition-all border-2 border-slate-700/50 active:scale-[0.98]"
                                >
                                    Exit
                                </button>
                            </div>

                            {/* Footer notice */}
                            <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
                                귀하의 정보는 연령 확인 목적으로만 사용되며 저장되지 않습니다.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
