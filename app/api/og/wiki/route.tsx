import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const COLOR_MAP: Record<string, string> = {
    orange: '#ea580c',  // amber-600 mostly
    amber: '#d97706',
    yellow: '#ca8a04',
    emerald: '#059669',
    sky: '#0284c7',
    rose: '#e11d48',
    stone: '#57534e',
    zinc: '#52525b',
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params passed via URL
        const title = searchParams.get('title') || 'Spirits Encyclopedia';
        const emoji = searchParams.get('emoji') || '📚';
        const tagline = searchParams.get('tagline') || 'Explore the world of spirits';
        const colorName = searchParams.get('color') || 'amber';
        const themeColor = COLOR_MAP[colorName] || '#d97706';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        backgroundImage: `radial-gradient(circle at 50% 120%, ${themeColor}66 0%, transparent 60%), radial-gradient(circle at 50% -20%, ${themeColor}33 0%, transparent 40%)`,
                        padding: '80px',
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                    }}
                >
                    {/* Top Accent Bar */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '12px',
                            backgroundColor: themeColor,
                        }}
                    />

                    {/* Emoji Bubble */}
                    <div
                        style={{
                            width: '180px',
                            height: '180px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '100px',
                            marginBottom: '40px',
                            border: `2px solid ${themeColor}44`,
                            boxShadow: `0 0 40px ${themeColor}33`,
                        }}
                    >
                        {emoji}
                    </div>

                    {/* Main Title */}
                    <div
                        style={{
                            fontSize: title.length > 15 ? '72px' : '96px',
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            marginBottom: '24px',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        {title}
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: '32px',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.4,
                            maxWidth: '900px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        {tagline}
                    </div>

                    {/* Branding */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                color: themeColor,
                                fontSize: '24px',
                                fontWeight: 800,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}
                        >
                            K-Spirits Club
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '24px' }}>|</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px', fontWeight: 500 }}>
                            Encyclopedia
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate image`, {
            status: 500,
        });
    }
}
