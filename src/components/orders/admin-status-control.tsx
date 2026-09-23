"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/orders/actions";
import { orderStatusLabels, orderTransitions, type OrderState } from "@/lib/order-status";
import styles from "./admin-orders.module.css";
export function AdminOrderStatus({ id, status }: { id: string; status: OrderState }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const router = useRouter();
  const options = orderTransitions[status];
  if (!options.length) return <p className={styles.closed}>This order is closed.</p>;
  return <form className={styles.controls} onSubmit={async event => {
    event.preventDefault();
    if (lock.current) return;
    const data = new FormData(event.currentTarget);
    if (data.get("status") === "CANCELLED" && !window.confirm("Cancel this order? This cannot be undone.")) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const result = await updateOrderStatus(data);
      if (result.error) setError(result.error);
      else router.refresh();
    } catch {
      setError("Unable to update. Check your connection and admin login.");
    } finally { lock.current = false; setBusy(false); }
  }}>
    <input type="hidden" name="id" value={id} /><input type="hidden" name="from" value={status} />
    <label>Next status<select name="status" required defaultValue="" disabled={busy}>
      <option value="" disabled>Choose status</option>
      {options.map(option => <option key={option} value={option}>{orderStatusLabels[option]}</option>)}
    </select></label>
    <button className="button" disabled={busy}>{busy ? "Saving…" : "Update status →"}</button>
    {error && <p className={styles.error} role="alert">{error}</p>}
  </form>;
}
