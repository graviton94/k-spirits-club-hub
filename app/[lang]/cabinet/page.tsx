import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import CabinetClient from "@/components/cabinet/CabinetClient";

export const runtime = 'edge';

interface CabinetPageProps {
  params: Promise<{ lang: string }>;
}

import { Metadata } from 'next';

export async function generateMetadata({ params }: CabinetPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.meta.cabinet,
    description: dict.meta.description,
  };
}

export default async function CabinetPage({ params }: CabinetPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <CabinetClient lang={lang as Locale} dict={dictionary.cabinet} />;
}
