import SpiritCard from "@/components/ui/SpiritCard";

export default function CabinetPage() {
  // In production, this would fetch user's saved spirits
  const savedSpirits: any[] = [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📚 내 캐비닛</h1>
        <p className="text-muted-foreground">내가 저장한 나만의 주류 컬렉션</p>
      </header>

      {savedSpirits.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🥃</div>
          <h2 className="text-2xl font-semibold mb-4">캐비닛이 비어 있습니다</h2>
          <p className="text-muted-foreground mb-6">
            다양한 술을 탐색하고 마음에 드는 병을 저장해보세요!
          </p>
          <a
            href="/explore"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            주류 탐색하러 가기
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedSpirits.map((spirit) => (
            <SpiritCard key={spirit.id} spirit={spirit} />
          ))}
        </div>
      )}
    </div>
  );
}
