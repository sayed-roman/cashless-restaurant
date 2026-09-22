import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import styles from "@/components/auth/auth.module.css";
export const metadata = { title: "Login | Cashless Restaurant" };
export default function LoginPage() {
  return (
    <main id="main" className={styles.shell}>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}
