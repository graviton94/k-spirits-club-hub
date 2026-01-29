'use client';

import Image from 'next/image';

// Avatar options - user (1).jpg is the default
const AVATAR_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    path: `/icons/user/user (${i + 1}).jpg`,
    alt: `Avatar ${i + 1}`
}));

export const DEFAULT_AVATAR = AVATAR_OPTIONS[0].path; // user (1).jpg

interface AvatarSelectorProps {
    selectedAvatar: string;
    onSelect: (avatarPath: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
    return (
        <div>
            <label className="text-xs text-muted-foreground block mb-3 text-left">
                프로필 아바타 선택
            </label>

            <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((avatar) => (
                    <button
                        key={avatar.id}
                        type="button"
                        onClick={() => onSelect(avatar.path)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedAvatar === avatar.path
                                ? 'border-primary ring-2 ring-primary/50'
                                : 'border-border hover:border-primary/50'
                            }`}
                    >
                        <Image
                            src={avatar.path}
                            alt={avatar.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 25vw, 10vw"
                        />
                        {selectedAvatar === avatar.path && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
