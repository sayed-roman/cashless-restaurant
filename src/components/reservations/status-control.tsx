"use client";
import styles from "./status-control.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateReservationStatus } from "@/app/reservations/actions";
import type { ReservationState } from "@/lib/reservation-rules";
export function StatusControl({
  id,
  status,
  future,
}: {
  id: string;
  status: ReservationState;
  future: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const options: ReservationState[] =
    status === "PENDING"
      ? [...(future ? ["CONFIRMED" as const] : []), "CANCELLED"]
      : status === "CONFIRMED"
        ? [...(!future ? ["COMPLETED" as const] : []), "CANCELLED"]
        : [];
  if (!options.length) return <span>Closed</span>;
  return (
    <form
      className={styles.form}
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        const data = new FormData(event.currentTarget);
        if (
          data.get("status") === "CANCELLED" &&
          !window.confirm("Cancel this reservation?")
        )
          return;
        setBusy(true);
        setError("");
        try {
          const result = await updateReservationStatus(data);
          if (result.error) setError(result.error);
          else router.refresh();
        } catch {
          setError("Unable to update. Check your connection and login.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <label className={styles.field}>
        <span>Update booking status</span>
      <select
        name="status"
        aria-label="New reservation status"
        disabled={busy}
        defaultValue=""
        required
      >
        <option value="" disabled>
          Choose status
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0) + option.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      </label>
      <button className={styles.save} disabled={busy}>
        {busy ? "Saving…" : "Update status →"}
      </button>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}
