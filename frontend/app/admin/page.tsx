import { Suspense } from "react";
import { AdminDashboard } from "./components/admin-dashboard";

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
