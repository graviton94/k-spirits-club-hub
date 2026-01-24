import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          🥃 K-Spirits Club
        </h1>
        <p className="text-lg text-muted-foreground">
          전 세계 100만 개 이상의 주류 데이터베이스
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 mb-12">
        <Link
          href="/explore"
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">🔍 탐색하기</h2>
          <p className="text-muted-foreground">
            전 세계 증류소의 다양한 술을 탐색해보세요
          </p>
        </Link>

        <Link
          href="/cabinet"
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">📚 내 캐비닛</h2>
          <p className="text-muted-foreground">
            내가 저장하고 수집한 술 목록을 확인하세요
          </p>
        </Link>

        <Link
          href="/reviews"
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">✍️ 리뷰</h2>
          <p className="text-muted-foreground">
            나만의 시음 노트를 작성하고 공유해보세요
          </p>
        </Link>

        <Link
          href="/admin"
          className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">⚙️ 관리</h2>
          <p className="text-muted-foreground">
            데이터 검수 및 관리자 대시보드
          </p>
        </Link>
      </section>

      <section className="text-center bg-secondary p-8 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">주요 기능</h3>
        <ul className="space-y-2 text-left max-w-2xl mx-auto">
          <li>✅ 식품안전나라, Whiskybase 등 100만 개 이상의 주류 데이터</li>
          <li>✅ 모바일에 최적화된 하단 네비게이션</li>
          <li>✅ 마음에 드는 병을 내 캐비닛에 저장</li>
          <li>✅ 커뮤니티 리뷰 작성 및 확인</li>
          <li>✅ 데이터 큐레이션을 위한 관리자 기능</li>
          <li>✅ 오프라인 접근이 가능한 PWA 지원</li>
          <li>✅ 빠르고 안정적인 Cloudflare Pages 배포</li>
        </ul>
      </section>
    </div>
  );
}
