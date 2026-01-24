import { Suspense } from "react";
import AdminContent from "@/components/admin/AdminContent";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <AdminContent />
    </Suspense>
  );
}
