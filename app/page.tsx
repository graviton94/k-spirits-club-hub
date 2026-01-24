import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          🥃 K-Spirits Club
        </h1>
        <p className="text-lg text-muted-foreground">
          전 세계 1M+ 주류 데이터베이스 | Global Liquor Database
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 mb-12">
        <Link 
          href="/explore" 
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">🔍 탐색하기</h2>
          <p className="text-muted-foreground">
            Explore spirits from distilleries worldwide
          </p>
        </Link>

        <Link 
          href="/cabinet" 
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">📚 내 캐비닛</h2>
          <p className="text-muted-foreground">
            Your personal spirits collection
          </p>
        </Link>

        <Link 
          href="/reviews" 
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">✍️ 리뷰</h2>
          <p className="text-muted-foreground">
            Share your tasting experiences
          </p>
        </Link>

        <Link 
          href="/admin" 
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">⚙️ 관리</h2>
          <p className="text-muted-foreground">
            Admin dashboard (검수 & publishing)
          </p>
        </Link>
      </section>

      <section className="text-center bg-secondary p-8 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Features</h3>
        <ul className="space-y-2 text-left max-w-2xl mx-auto">
          <li>✅ 1M+ spirits from Food Safety Korea, Whiskybase & more</li>
          <li>✅ Mobile-optimized bottom navigation</li>
          <li>✅ Save bottles to your personal cabinet</li>
          <li>✅ Write and read community reviews</li>
          <li>✅ Admin dashboard for data curation</li>
          <li>✅ PWA-ready for offline access</li>
          <li>✅ Cloudflare Pages deployment</li>
        </ul>
      </section>
    </div>
  );
}
