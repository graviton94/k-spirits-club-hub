export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
            <div className="flex flex-col items-center gap-6">
                {/* Animated Bottle Icon */}
                <div className="relative">
                    {/* Rotating outer ring */}
                    <div className="absolute inset-0 w-24 h-24 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />

                    {/* Pulsing inner circle */}
                    <div className="absolute inset-0 w-24 h-24 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse flex items-center justify-center">
                            <span className="text-3xl">🥃</span>
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-2">
                    <p className="text-xl font-bold text-gray-900 dark:text-white animate-pulse">
                        Loading...
                    </p>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
