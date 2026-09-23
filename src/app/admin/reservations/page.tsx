import Link from "next/link";
import { adminReservations } from "@/server/reservations/service";
import { reservationDate } from "@/lib/reservation-rules";
import { StatusControl } from "@/components/reservations/status-control";
import styles from "@/components/reservations/reservations.module.css";
export const metadata = { title: "Reservations | Cashless Admin" };
export default async function AdminReservations({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(
    1,
    Math.min(100000, Number.parseInt(query.page ?? "1", 10) || 1),
  );
  const { rows, total } = await adminReservations(page);
  return (
    <main id="main">
      <p className="eyebrow">Plan each visit</p>
      <h1>Reservations</h1>
      <p>
        Review booking requests before confirming a table. All times are in
        Bangladesh time.
      </p>
      <div className={styles.list}>
        {rows.map((booking) => (
          <article className={styles.card} key={booking.id}>
            <div className={styles.heading}>
              <h2>{reservationDate(booking.scheduledAt)}</h2>
              <span className={styles.status}>{booking.status}</span>
            </div>
            <dl>
              <div>
                <dt>Guest</dt>
                <dd>{booking.name}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{booking.phone}</dd>
              </div>
              <div>
                <dt>Party size</dt>
                <dd>{booking.guests}</dd>
              </div>
              <div>
                <dt>Account email</dt>
                <dd>{booking.user.email}</dd>
              </div>
            </dl>
            <p className={styles.reference}>Reference: {booking.id}</p>
            <StatusControl
              key={booking.status}
              id={booking.id}
              status={booking.status}
              future={booking.scheduledAt.getTime() > Date.now()}
            />
          </article>
        ))}
      </div>
      {!rows.length && <p>No reservations to show.</p>}
      <nav className={styles.pages} aria-label="Reservation pages">
        {page > 1 && (
          <Link href={`/admin/reservations?page=${page - 1}`}>← Previous</Link>
        )}
        <span>{total} reservations</span>
        {page * 20 < total && (
          <Link href={`/admin/reservations?page=${page + 1}`}>Next →</Link>
        )}
      </nav>
    </main>
  );
}
