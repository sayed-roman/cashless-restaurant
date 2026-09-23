"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./admin-shell.module.css";

function Navigation({ close }: { close: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin navigation" className={styles.nav}>
      {[
        ["Overview", "/admin"],
        ["Menu Management", "/admin/menu"],
      ].map(([label, href]) => (
        <Link
          key={href}
          href={href}
          onClick={close}
          className={pathname === href ? styles.active : undefined}
          aria-current={pathname === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
export function AdminShell({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const title = pathname.startsWith("/admin/menu")
    ? "Menu Management"
    : "Overview";
  function close() {
    dialog.current?.close();
  }
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error();
      close();
      router.replace("/");
      router.refresh();
    } catch {
      setError("Unable to log out. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const brand = (
    <Link href="/admin" className={styles.brand} onClick={close}>
      Cashless<span>RESTAURANT ADMIN</span>
    </Link>
  );
  const bottom = (
    <div className={styles.bottom}>
      <Link href="/" onClick={close}>
        View website ↗
      </Link>
      <button type="button" onClick={() => void logout()} disabled={busy}>
        {busy ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
  return (
    <div className={styles.shell}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className={styles.sidebar}>
        {brand}
        <p className={styles.label}>WORKSPACE</p>
        <Navigation close={close} />
        {bottom}
      </aside>
      <dialog
        ref={dialog}
        className={styles.drawer}
        aria-label="Admin navigation"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={styles.drawerContent}>
          {brand}
          <button className={styles.close} type="button" onClick={close}>
            Close menu ×
          </button>
          <Navigation close={close} />
          {bottom}
        </div>
      </dialog>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => dialog.current?.showModal()}
            aria-label="Open admin navigation"
          >
            ☰ Menu
          </button>
          <span>{title}</span>
          <div className={styles.identity}>
            <strong>{name}</strong>
            <small>Administrator</small>
          </div>
        </header>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
