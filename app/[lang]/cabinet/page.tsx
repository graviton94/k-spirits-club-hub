import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import CabinetClient from "@/components/cabinet/CabinetClient";
import { getCanonicalUrl, getHreflangAlternates } from "@/lib/utils/seo-url";

export const runtime = 'edge';

interface CabinetPageProps {
  params: Promise<{ lang: string }>;
}

import { Metadata } from 'next';

export async function generateMetadata({ params }: CabinetPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const canonicalUrl = getCanonicalUrl(`/${lang}/cabinet`);
  const hreflangAlternates = getHreflangAlternates('/cabinet');

  return {
    title: dict.meta.cabinet,
    description: dict.meta.description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
  };
}

export default async function CabinetPage({ params }: CabinetPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <CabinetClient lang={lang as Locale} dict={dictionary.cabinet} />;
}
