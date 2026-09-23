"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createReservation } from "@/app/reservations/actions";
import { reservationTimes } from "@/lib/reservation-rules";
import { authClient } from "@/lib/auth-client";
import {
  futureReservation,
  localDateValue,
  validPhone,
} from "@/lib/validation";
const times = reservationTimes;
export function Reservation() {
  const {
    data: session,
    isPending,
    error: sessionError,
    refetch,
  } = authClient.useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const loginUrl = "/login?next=%2F%23reservation";
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  return (
    <section className="reservation-section" id="reservation">
      <div className="wrap reservation-grid">
        <div className="reservation-photo">
          <Image
            src="/images/interior.jpg"
            alt="A comfortable dining space ready for your next visit"
            fill
            sizes="(max-width:700px) 100vw,45vw"
          />
          <div className="reservation-photo-copy">
            Good food.
            <br />
            Better company.
          </div>
        </div>
        <div className="reservation-form">
          <p className="eyebrow">Plan your visit</p>
          <h2 className="section-title">Table Reservation</h2>
          <p className="section-subtitle">A seat for every special moment.</p>
          {isPending ? (
            <p role="status">Checking your account…</p>
          ) : sessionError ? (
            <div>
              <p role="alert">
                Unable to check your account. Please try again.
              </p>
              <button className="button outline" onClick={() => void refetch()}>
                Try again
              </button>
            </div>
          ) : !session ? (
            <div>
              <p className="section-subtitle">
                Please log in to book your table.
              </p>
              <Link className="button" href={loginUrl}>
                Log in to book a table
              </Link>
            </div>
          ) : confirmation ? (
            <div role="status" className="success-panel">
              <h3>Reservation request received.</h3>
              <p>Reference: {confirmation}</p>
              <Link className="button" href="/reservations">
                My Reservations
              </Link>
              <p>
                Your reservation request is saved and awaiting restaurant
                confirmation.
              </p>
              <button
                className="button outline"
                onClick={() => setConfirmation("")}
              >
                Make another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (submitting) return;
                const data = new FormData(event.currentTarget);
                const name = String(data.get("name")).trim();
                if (name.length < 2) {
                  setError("Please enter your name (at least 2 characters).");
                  return;
                }
                if (!validPhone(String(data.get("phone")))) {
                  setError("Please enter a valid phone number.");
                  return;
                }
                if (
                  !futureReservation(
                    String(data.get("date")),
                    String(data.get("time")),
                  )
                ) {
                  setError(
                    "Choose a date and time in the future (Bangladesh time).",
                  );
                  return;
                }
                setError("");
                setSubmitting(true);
                try {
                  const result = await createReservation(data);
                  if (result.loginRequired) {
                    router.push(loginUrl);
                    return;
                  }
                  if (result.error) {
                    setError(result.error);
                    return;
                  }
                  if (result.id) setConfirmation(result.id);
                } catch {
                  setError("Unable to connect. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="form-grid">
                <label>
                  Name
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Phone
                  <input
                    name="phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    placeholder="Your phone number"
                  />
                </label>
                <label>
                  Date
                  <input
                    name="date"
                    required
                    type="date"
                    min={localDateValue()}
                  />
                </label>
                <label>
                  Time
                  <select name="time" required defaultValue="">
                    <option value="" disabled>
                      Select time
                    </option>
                    {times.map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Guests
                  <select name="guests" required defaultValue="">
                    <option value="" disabled>
                      Select guests
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button booking-submit"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Booking…" : "Book a Table"}
                </button>
              </div>
              <p className="form-note">
                Bookings require restaurant confirmation. Times are in
                Bangladesh time.
              </p>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
