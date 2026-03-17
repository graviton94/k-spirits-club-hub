const SPIRIT_EMOJIS = ['🍶', '🥃', '🍷', '🍸', '🍺', '🍻', '🍾', '🥂', '🫗'];

export default function Loading() {
    const emoji = SPIRIT_EMOJIS[0];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black">
            <div className="flex flex-col items-center gap-12">
                <div className="relative flex h-64 w-64 items-center justify-center">
                    <div className="absolute h-40 w-40 rounded-full bg-amber-500/10 blur-2xl dark:bg-amber-500/5" />
                    <div className="relative z-10 flex h-32 w-32 items-center justify-center">
                        <span className="select-none text-7xl" aria-hidden="true">
                            {emoji}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"
                            style={{
                                animationDelay: `${i * 0.16}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
