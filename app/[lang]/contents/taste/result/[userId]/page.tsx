import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TastePublicReport from '@/components/cabinet/TastePublicReport'
import { dbAdminGetUserProfile } from '@/lib/db/data-connect-admin'
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url'

export const revalidate = 3600

interface TasteResultPageProps {
    params: Promise<{ userId: string; lang: string }>
}

export async function generateMetadata({ params }: TasteResultPageProps): Promise<Metadata> {
    const { userId, lang } = await params
    const isEn = lang === 'en'
    
    // Fetch from User Profile JSONB field
    const user = await dbAdminGetUserProfile(userId)
    const profile: any = user?.tasteProfile

    const canonicalUrl = getCanonicalUrl(`/${lang}/contents/taste/result/${userId}`)
    const hreflangAlternates = getHreflangAlternates(`/contents/taste/result/${userId}`)

    if (!profile) {
        return {
            title: isEn ? 'Taste Report Not Found | K-Spirits Club' : '취향 리포트를 찾을 수 없습니다 | K-Spirits Club',
            robots: { index: false, follow: true },
            alternates: {
                canonical: canonicalUrl,
                languages: hreflangAlternates,
            },
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com'
    const personaTitle = profile.persona?.title || (isEn ? 'Taste DNA Report' : '취향 DNA 리포트')
    const keywords = Array.isArray(profile.persona?.keywords) ? profile.persona.keywords.join(' ') : ''
    const title = isEn ? `Taste DNA Report: ${personaTitle}` : `취향 DNA 리포트: ${personaTitle}`
    const description = isEn
        ? `${keywords} Explore this shared AI taste profile on K-Spirits Club.`.trim()
        : `${keywords} AI가 분석한 공유 취향 리포트를 확인해보세요.`.trim()
    const image = `${baseUrl}/cabinet.jpg?v=${encodeURIComponent(userId)}`

    return {
        title: `${personaTitle} | ${isEn ? 'Taste DNA Report' : '취향 DNA 리포트'}`,
        description,
        robots: { index: false, follow: true },
        alternates: {
            canonical: canonicalUrl,
            languages: hreflangAlternates,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: 'website',
            locale: isEn ? 'en_US' : 'ko_KR',
            siteName: 'K-Spirits Club',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: personaTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    }
}

export default async function TasteResultPage({ params }: TasteResultPageProps) {
    const { userId } = await params
    const user = await dbAdminGetUserProfile(userId)
    const profileData: any = user?.tasteProfile

    if (!profileData) {
        notFound()
    }

    const profile = {
        ...profileData,
        analyzedAt: new Date(profileData.analyzedAt),
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-5xl relative z-10 pt-10 md:pt-20">
                <TastePublicReport profile={profile} isPublic={true} />

                <div className="mt-20 text-center opacity-30">
                    <p className="text-[10px] text-neutral-500 font-bold tracking-[0.4em] uppercase">
                        k-spirits.club | Advanced AI Taste Analysis
                    </p>
                </div>
            </div>
        </div>
    )
}
