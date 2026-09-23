"use client";
import { useMenu } from "@/components/menu/menu-provider";
import { MenuStatus } from "@/components/menu/menu-status";
import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/data/menu";
import { validPhone } from "@/lib/validation";
type Confirmation = { name: string; total: number; reference: string };
export function Checkout() {
  const { dishes, status } = useMenu();
  const { lines, total, dispatch, setOpen } = useCart();
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  if (confirmation)
    return (
      <div className="checkout-success">
        <p className="eyebrow">Order received</p>
        <h1 className="section-title">Thank you, {confirmation.name}.</h1>
        <p>Your order total is {formatPrice(confirmation.total)}.</p>
        <p>Reference: {confirmation.reference}</p>
        <p className="muted">
          Your order is pending confirmation. No payment has been collected.
        </p>
        <Link href="/" className="button">
          Back to Home
        </Link>
      </div>
    );
  if (status !== "ready") return <MenuStatus />;
  if (!lines.length)
    return (
      <div className="empty-state center">
        <h1 className="section-title">Your cart is empty</h1>
        <p className="section-subtitle">
          Choose a few favourites before checking out.
        </p>
        <Link href="/#order" className="button">
          Explore dishes
        </Link>
      </div>
    );
  return (
    <>
      <p className="eyebrow">One more step</p>
      <h1 className="section-title">Checkout</h1>
      <div className="checkout-grid">
        <form
          className="checkout-form"
          onSubmit={async (event) => {
            event.preventDefault();
            if (submitLock.current) return;
            const data = new FormData(event.currentTarget);
            const name = String(data.get("name")).trim();
            if (name.length < 2) {
              setError("Please enter your name.");
              return;
            }
            if (!validPhone(String(data.get("phone")))) {
              setError("Please enter a valid phone number.");
              return;
            }
            submitLock.current = true;
            setSubmitting(true);
            setError("");
            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone: data.get("phone"), notes: data.get("notes"), lines }),
              });
              const result = await response.json().catch(() => null);
              if (!response.ok) throw new Error(result?.error ?? "Unable to place order.");
              if (!result || typeof result.id !== "string" || !Number.isSafeInteger(result.totalMinor)) {
                throw new Error("Unable to confirm your order. Please contact the restaurant before ordering again.");
              }
              setConfirmation({
                name,
                total: result.totalMinor / 100,
                reference: result.id,
              });
              dispatch({ type: "clear" });
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : "Unable to place order.");
            } finally {
              submitLock.current = false;
              setSubmitting(false);
            }
          }}
        >
          <h2>Pickup details</h2>
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
          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={20}
            />
          </label>
          <label>
            Order notes <span className="muted">(optional)</span>
            <textarea
              name="notes"
              rows={3}
              maxLength={300}
              placeholder="Any requests for your order?"
            />
          </label>
          <div className="demo-callout">
            Place your pickup order. No online payment will be collected at this step.
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button full" type="submit" disabled={submitting}>
            {submitting ? "Placing order…" : `Place Order · ${formatPrice(total)}`}
          </button>
        </form>
        <aside className="order-summary">
          <h2>Your order</h2>
          {lines.map((line) => {
            const dish = dishes.find((d) => d.slug === line.slug)!;
            return (
              <div className="summary-line" key={line.slug}>
                <span>
                  {line.quantity} × {dish.name}
                </span>
                <strong>{formatPrice(dish.price * line.quantity)}</strong>
              </div>
            );
          })}
          <div className="summary-line">
            <span>Pickup</span>
            <span>Free</span>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button className="button outline full" onClick={() => setOpen(true)}>
            Edit Cart
          </button>
        </aside>
      </div>
    </>
  );
}
