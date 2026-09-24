import { AccountShell } from "@/components/account/account-shell";
import { requireUser } from "@/server/auth/session";
import Link from "next/link";
import { myReservations } from "@/server/reservations/service";
import { reservationDate } from "@/lib/reservation-rules";
import styles from "@/components/reservations/reservations.module.css";
export const metadata = { title: "My Reservations | Cashless Restaurant" };
export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireUser("/reservations");
  const query = await searchParams;
  const page = Math.max(
    1,
    Math.min(100000, Number.parseInt(query.page ?? "1", 10) || 1),
  );
  const { rows, total } = await myReservations(page);
  return (
    <AccountShell name={user.name}><main id="main" className="section wrap">
      <p className="eyebrow">Your next visit</p>
      <h1 className="section-title">My Reservations</h1>
      <p className="section-subtitle">
        All times are in Bangladesh time. Pending requests need restaurant
        confirmation.
      </p>
      <Link className="button" href="/#reservation">
        Book a table
      </Link>
      <div className={styles.list}>
        {rows.map((booking) => (
          <article id={`reservation-${booking.id}`} className={styles.card} key={booking.id}>
            <div className={styles.heading}>
              <h2>{reservationDate(booking.scheduledAt)}</h2>
              <span className={styles.status}>{booking.status}</span>
            </div>
            <dl>
              <div>
                <dt>Name</dt>
                <dd>{booking.name}</dd>
              </div>
              <div>
                <dt>Guests</dt>
                <dd>{booking.guests}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{booking.phone}</dd>
              </div>
            </dl>
            <p className={styles.reference}>Reference: {booking.id}</p>
          </article>
        ))}
      </div>
      {!rows.length && (
        <p>No reservations to show. Plan your next visit by booking a table.</p>
      )}
      <nav className={styles.pages} aria-label="Reservation pages">
        {page > 1 && (
          <Link className="button outline" href={`/reservations?page=${page - 1}`}>Previous</Link>
        )}
        <span>{total} reservations</span>
        {page * 20 < total && (
          <Link className="button outline" href={`/reservations?page=${page + 1}`}>Next</Link>
        )}
      </nav>
    </main></AccountShell>
  );
}
