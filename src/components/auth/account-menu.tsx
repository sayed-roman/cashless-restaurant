"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "./auth.module.css";
export function AccountMenu() {
  const { data: session, isPending, error } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const router = useRouter();
  if (isPending)
    return (
      <span className="small" role="status">
        Account…
      </span>
    );
  if (!session)
    return (
      <Link
        href="/login"
        className={styles.loginLink}
        title={error ? "Sign in to check your account" : undefined}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
        </svg>
        <span>Log in</span>
      </Link>
    );
  return (
    <details className={styles.account}>
      <summary>Account ▾</summary>
      <div className={styles.dropdown}>
        <Link href="/account">My account</Link>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setFailure("");
            try {
              const result = await authClient.signOut();
              if (result.error) {
                setFailure("Could not log out. Try again.");
                return;
              }
              router.replace("/");
              router.refresh();
            } catch {
              setFailure("Could not log out. Try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Logging out…" : "Log out"}
        </button>
        {failure && (
          <p role="alert" className={styles.error}>
            {failure}
          </p>
        )}
      </div>
    </details>
  );
}
