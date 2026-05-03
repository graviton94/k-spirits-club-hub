import { db } from "@/lib/db";
import { useEffect, useState } from "react";

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalSpirits: 0,
    published: 0,
    pendingReview: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { total } = await db.getSpirits({}, { page: 1, pageSize: 1 });
      const { total: published } = await db.getSpirits({ isPublished: true }, { page: 1, pageSize: 1 });
      const { total: pending } = await db.getSpirits({ isReviewed: false }, { page: 1, pageSize: 1 });

      setStats({
        totalSpirits: total,
        published: published,
        pendingReview: pending,
      });
    }
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="전체 주류"
        value={stats.totalSpirits.toLocaleString()}
        icon="🥃"
        color="bg-accent/10"
      />
      <StatCard
        title="발행됨"
        value={stats.published.toLocaleString()}
        icon="✓"
        color="bg-primary/10"
      />
      <StatCard
        title="검수 대기"
        value={stats.pendingReview.toLocaleString()}
        icon="⏳"
        color="bg-muted"
      />
      <StatCard
        title="데이터 소스"
        value="3"
        icon="📊"
        color="bg-accent/10"
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
