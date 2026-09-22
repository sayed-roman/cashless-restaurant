import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "./auth";
import { db } from "@/server/db/client";
import { safeReturnPath } from "@/lib/auth-redirect";
export async function requireUser(destination = "/account") {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session)
    redirect(`/login?next=${encodeURIComponent(safeReturnPath(destination))}`);
  return session.user;
}
export async function requireAdmin() {
  const user = await requireUser("/admin");
  // Read the current role from the database; never trust a browser-supplied role.
  const current = await db.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (current?.role !== "admin") redirect("/account");
  return user;
}
