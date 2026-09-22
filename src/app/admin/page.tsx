import { requireAdmin } from "@/server/auth/session";
export const metadata = { title: "Admin | Cashless Restaurant" };
export default async function AdminPage() {
  await requireAdmin();
  return (
    <main id="main" className="section wrap">
      <p className="eyebrow">Restaurant management</p>
      <h1 className="section-title">Admin dashboard</h1>
      <p className="section-subtitle">
        Welcome to your restaurant administration area.
      </p>
    </main>
  );
}
