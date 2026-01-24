import SpiritCard from "@/components/ui/SpiritCard";

export default function CabinetPage() {
  // In production, this would fetch user's saved spirits
  const savedSpirits: any[] = [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📚 My Cabinet</h1>
        <p className="text-muted-foreground">Your personal spirits collection</p>
      </header>

      {savedSpirits.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🥃</div>
          <h2 className="text-2xl font-semibold mb-4">Your cabinet is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring spirits and save your favorites!
          </p>
          <a
            href="/explore"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Explore Spirits
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
