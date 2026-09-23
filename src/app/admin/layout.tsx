import { requireAdmin } from "@/server/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return <AdminShell name={user.name}>{children}</AdminShell>;
}
