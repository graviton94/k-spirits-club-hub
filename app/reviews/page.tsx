export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">✍️ Reviews</h1>
        <p className="text-muted-foreground">Community tasting notes and reviews</p>
      </header>

      <div className="text-center py-20">
        <div className="text-6xl mb-4">✍️</div>
        <h2 className="text-2xl font-semibold mb-4">Reviews coming soon</h2>
        <p className="text-muted-foreground mb-6">
          Browse spirits and add reviews on their detail pages.
        </p>
        <a
          href="/explore"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Explore Spirits
        </a>
      </div>
    </div>
  );
}
