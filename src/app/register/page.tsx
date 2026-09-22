import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import styles from "@/components/auth/auth.module.css";
export const metadata = { title: "Register | Cashless Restaurant" };
export default function RegisterPage() {
  return (
    <main id="main" className={styles.shell}>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <AuthForm mode="register" />
      </Suspense>
    </main>
  );
}
