"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { safeReturnPath } from "@/lib/auth-redirect";
import styles from "./auth.module.css";
export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const params = useSearchParams();
  const destination = safeReturnPath(params.get("next"));
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className={styles.card}>
      <p className="eyebrow">Welcome to Cashless</p>
      <h1 className="section-title">
        {registering ? "Create an account" : "Welcome back"}
      </h1>
      <p className="section-subtitle">
        {registering
          ? "Good food and great moments start here."
          : "Sign in to continue your visit."}
      </p>
      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();
          if (pending) return;
          const data = new FormData(event.currentTarget);
          const email = String(data.get("email")).trim().toLowerCase();
          const password = String(data.get("password"));
          const name = String(data.get("name") ?? "").trim();
          if (registering && name.length < 2) {
            setError("Please enter at least two characters for your name.");
            return;
          }
          setPending(true);
          setError("");
          try {
            const result = registering
              ? await authClient.signUp.email({ name, email, password })
              : await authClient.signIn.email({ email, password });
            if (result.error) {
              setError(
                result.error.status === 429
                  ? "Too many attempts. Please wait a minute and try again."
                  : registering
                    ? "Unable to create this account. Check your details or try logging in."
                    : "Unable to sign in. Check your email and password, then try again.",
              );
              return;
            }
            router.replace(destination);
            router.refresh();
          } catch {
            setError("Unable to connect. Please try again.");
          } finally {
            setPending(false);
          }
        }}
      >
        {registering && (
          <label>
            Full name
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
            />
          </label>
        )}
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={registering ? "new-password" : "current-password"}
            required
            minLength={registering ? 10 : 1}
            maxLength={128}
          />
          {registering && (
            <span className="muted small">Use 10–128 characters.</span>
          )}
        </label>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button className="button full" disabled={pending}>
          {pending ? "Please wait…" : registering ? "Create account" : "Log in"}
        </button>
      </form>
      <p className={styles.footer}>
        {registering ? "Already have an account? " : "New to Cashless? "}
        <Link
          href={`/${registering ? "login" : "register"}?next=${encodeURIComponent(destination)}`}
        >
          {registering ? "Log in" : "Create account"}
        </Link>
      </p>
    </div>
  );
}
