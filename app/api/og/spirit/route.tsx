import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// We fetch the font from Google Fonts or a local file.
// For dynamic Edge functions, fetching from a static URL is often most reliable.
const interRegular = fetch(
    new URL('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap').href
).then((res) => res.arrayBuffer()).catch(() => null);

const interBold = fetch(
    new URL('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap').href
).then((res) => res.arrayBuffer()).catch(() => null);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params passed via URL
        const title = searchParams.get('title') || 'K-Spirits Club';
        const category = searchParams.get('category') || 'Explore Spirits';
        const tags = searchParams.get('tags');
        const imageUrl = searchParams.get('image'); // Product image

        // Parse tags (comma separated)
        const tagsArray = tags ? tags.split(',').slice(0, 3) : [];

        const [regularFont, boldFont] = await Promise.all([interRegular, interBold]);

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
                        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.4) 0%, transparent 60%)',
                        padding: '60px',
                        fontFamily: 'Inter',
                    }}
                >
                    {/* Main Layout */}
                    <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>

                        {/* Left Content */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, paddingRight: '40px' }}>
                            <div
                                style={{
                                    color: '#d97706',
                                    fontSize: 32,
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    marginBottom: 16
                                }}
                            >
                                {category}
                            </div>

                            <div
                                style={{
                                    fontSize: 72,
                                    fontStyle: 'normal',
                                    fontWeight: 700,
                                    color: 'white',
                                    lineHeight: 1.1,
                                    whiteSpace: 'pre-wrap',
                                    marginBottom: 32,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                }}
                            >
                                {title.length > 30 ? title.substring(0, 30) + '...' : title}
                            </div>

                            {/* Tags Area */}
                            {tagsArray.length > 0 && (
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    {tagsArray.map((tag, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '12px 24px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '30px',
                                                color: 'white',
                                                fontSize: 24,
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

                        {/* Right Image */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '400px', height: '400px' }}>
                            {imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imageUrl}
                                    alt="bottle"
                                    style={{
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'
                                    }}
                                />
                            ) : (
                                <div style={{ fontSize: 120 }}>🥃</div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Branding */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', width: '100%' }}>
                        <div style={{ fontSize: 32, color: 'white', fontWeight: 700 }}>
                            K-Spirits Club
                        </div>
                        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', marginLeft: '16px' }}>
                            Global Spirits Platform
                        </div>
                    </div>

                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: (regularFont && boldFont) ? [
                    {
                        name: 'Inter',
                        data: regularFont,
                        style: 'normal',
                        weight: 400,
                    },
                    {
                        name: 'Inter',
                        data: boldFont,
                        style: 'normal',
                        weight: 700,
                    },
                ] : undefined,
            }
        );
    } catch (e: any) {
        console.error('[OG API] Failed to generate OG image', e);
        return new Response(`Failed to generate image`, {
            status: 500,
        });
    }
}
