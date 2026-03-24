import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params passed via URL
        const title = searchParams.get('title') || 'K-Spirits Club';
        const category = searchParams.get('category') || 'Explore Spirits';
        const tags = searchParams.get('tags');
        const imageUrl = searchParams.get('image');      // Product image
        const rating = searchParams.get('rating');        // e.g. "4.3"
        const reviewCount = searchParams.get('reviews'); // e.g. "12"
        const abv = searchParams.get('abv');             // e.g. "43"

        // Parse tags (comma separated, max 3)
        const tagsArray = tags ? tags.split(',').slice(0, 3) : [];
        const hasRating = rating && parseFloat(rating) > 0;

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        backgroundImage:
                            'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.4) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(120, 53, 15, 0.25) 0%, transparent 50%)',
                        padding: '60px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Main Layout */}
                    <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>

                        {/* Left Content */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, paddingRight: '40px' }}>

                            {/* Category */}
                            <div
                                style={{
                                    color: '#d97706',
                                    fontSize: 26,
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    marginBottom: 12,
                                }}
                            >
                                {category}
                            </div>

                            {/* Title */}
                            <div
                                style={{
                                    fontSize: title.length > 22 ? 52 : 66,
                                    fontWeight: 700,
                                    color: 'white',
                                    lineHeight: 1.1,
                                    marginBottom: 28,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                }}
                            >
                                {title.length > 32 ? title.substring(0, 32) + '...' : title}
                            </div>

                            {/* Stats Row: ABV + Rating */}
                            <div style={{ display: 'flex', gap: '14px', marginBottom: 24, alignItems: 'center' }}>
                                {abv && (
                                    <div
                                        style={{
                                            padding: '8px 20px',
                                            backgroundColor: 'rgba(217, 119, 6, 0.2)',
                                            border: '1px solid rgba(217, 119, 6, 0.5)',
                                            borderRadius: '30px',
                                            color: '#fbbf24',
                                            fontSize: 22,
                                            fontWeight: 700,
                                            display: 'flex',
                                        }}
                                    >
                                        🔥 {abv}% ABV
                                    </div>
                                )}
                                {hasRating && (
                                    <div
                                        style={{
                                            padding: '8px 20px',
                                            backgroundColor: 'rgba(251, 191, 36, 0.15)',
                                            border: '1px solid rgba(251, 191, 36, 0.4)',
                                            borderRadius: '30px',
                                            color: '#fbbf24',
                                            fontSize: 22,
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        ★ {rating}
                                        {reviewCount && parseInt(reviewCount) > 0 && (
                                            <span
                                                style={{
                                                    color: 'rgba(255,255,255,0.5)',
                                                    fontSize: 18,
                                                    fontWeight: 400,
                                                }}
                                            >
                                                ({reviewCount} reviews)
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Flavor Tags */}
                            {tagsArray.length > 0 && (
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {tagsArray.map((tag, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '10px 20px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                borderRadius: '30px',
                                                color: 'rgba(255,255,255,0.85)',
                                                fontSize: 20,
                                                fontWeight: 400,
                                                display: 'flex',
                                            }}
                                        >
                                            #{tag}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Bottle Image */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '380px',
                                height: '420px',
                            }}
                        >
                            {imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imageUrl}
                                    alt="bottle"
                                    style={{
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
                                    }}
                                />
                            ) : (
                                <div style={{ fontSize: 140 }}>🥃</div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Branding */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: 'auto',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            paddingTop: '26px',
                            width: '100%',
                        }}
                    >
                        <div style={{ fontSize: 28, color: 'white', fontWeight: 700 }}>
                            K-Spirits Club
                        </div>
                        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', marginLeft: '14px' }}>
                            kspiritsclub.com
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
        console.error('[OG API] Failed to generate OG image', e);
        return new Response(`Failed to generate image`, { status: 500 });
    }
}
