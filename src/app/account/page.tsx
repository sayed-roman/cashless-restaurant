import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/server/db/client";
import { requireUser } from "@/server/auth/session";
import styles from "./account.module.css";
export const metadata = { title: "My account | Cashless Restaurant" };
export default async function AccountPage() {
  const user = await requireUser();
  const current = await db.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (current?.role === "admin") redirect("/admin");
  return (
    <main id="main" className={styles.dashboard}>
      <header className={styles.welcome}>
        <div className={styles.avatar} aria-hidden="true">{user.name.trim().slice(0,1).toUpperCase() || "C"}</div>
        <div>
          <p className="eyebrow">Your Cashless account</p>
          <h1>Welcome, {user.name}</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
      </header>
      <p className={styles.intro}>Plan your next visit or find something delicious to order.</p>
      <div className={styles.grid}>
        <section className={styles.card}>
          <span className={styles.number} aria-hidden="true">01 / YOUR NEXT VISIT</span>
          <h2>Table bookings</h2>
          <p>Make time for good food and great company. Book your table and follow your reservation status.</p>
          <div className={styles.links}>
            <Link className="button" href="/#reservation">Book a Table →</Link>
            <Link className={styles.secondary} href="/reservations">My Reservations ↗</Link>
          </div>
        </section>
        <section className={styles.card}>
          <span className={styles.number} aria-hidden="true">02 / FRESHLY PREPARED</span>
          <h2>Your favourites, ready to order</h2>
          <p>Explore our dishes, choose your favourites and add them to your cart.</p>
          <div className={styles.links}>
            <Link className="button" href="/#order">Order Food →</Link>
            <Link className={styles.secondary} href="/account/orders">My Orders ↗</Link>
          </div>
        </section>
      </div>

    </main>
  );
}
