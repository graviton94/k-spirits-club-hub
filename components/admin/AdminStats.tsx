export default function AdminStats() {
  // In production, these would be fetched from the database
  const stats = {
    totalSpirits: 1234567,
    published: 950000,
    pendingReview: 284567,
    sources: {
      foodSafetyKorea: 450000,
      whiskybase: 500000,
      manual: 284567,
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Spirits"
        value={stats.totalSpirits.toLocaleString()}
        icon="🥃"
        color="bg-blue-50 dark:bg-blue-950"
      />
      <StatCard
        title="Published"
        value={stats.published.toLocaleString()}
        icon="✓"
        color="bg-green-50 dark:bg-green-950"
      />
      <StatCard
        title="Pending Review"
        value={stats.pendingReview.toLocaleString()}
        icon="⏳"
        color="bg-yellow-50 dark:bg-yellow-950"
      />
      <StatCard
        title="Data Sources"
        value="3"
        icon="📊"
        color="bg-purple-50 dark:bg-purple-950"
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <div className={`p-6 rounded-lg border border-border ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
