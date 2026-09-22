import Link from "next/link";
import { requireUser } from "@/server/auth/session";
export const metadata = { title: "My account | Cashless Restaurant" };
export default async function AccountPage() {
  const user = await requireUser();
  return (
    <main id="main" className="section wrap">
      <p className="eyebrow">Your account</p>
      <h1 className="section-title">Welcome, {user.name}</h1>
      <p className="section-subtitle">{user.email}</p>
      <div className="actions">
        <Link className="button" href="/menu">
          Explore menu
        </Link>
        {user.role === "admin" && (
          <Link className="button outline" href="/admin">
            Admin dashboard
          </Link>
        )}
      </div>
    </main>
  );
}
