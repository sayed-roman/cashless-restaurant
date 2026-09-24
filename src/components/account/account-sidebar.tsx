"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./dashboard.module.css";

export function AccountSidebar({ name }: { name: string }) {
  const path = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const initials = name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase() || "C";
  return <aside className={styles.sidebar}>
    <div className={styles.profile}><span className={styles.avatar} aria-hidden="true">{initials}</span><h2>{name}</h2><p>My account</p></div>
    <nav className={styles.nav} aria-label="Your account">
      {[["Overview", "/account"], ["My Orders", "/account/orders"], ["My Reservations", "/reservations"]].map(([label, href]) =>
        <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>)}
    </nav>
    <button className={styles.logout} disabled={busy} onClick={async () => {
      setBusy(true); setError("");
      try {
        const result = await authClient.signOut();
        if (result.error) throw new Error("Sign-out failed");
        router.replace("/"); router.refresh();
      } catch { setError("Unable to log out. Please try again."); }
      finally { setBusy(false); }
    }}>{busy ? "Logging out…" : "Log out"}</button>
    {error && <p role="alert">{error}</p>}
    <p className={styles.sidebarNote}>Good food.<br />Better company.</p>
  </aside>;
}
