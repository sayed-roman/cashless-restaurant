import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/server/db/client";
import { requireUser } from "@/server/auth/session";
import { accountOverview } from "@/server/account/overview";
import { AccountShell } from "@/components/account/account-shell";
import { orderStatusLabels } from "@/lib/order-status";
import styles from "@/components/account/dashboard.module.css";
export const metadata = { title: "My account | Cashless Restaurant" };
const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" });
const paymentLabels = { PAID: "Payment confirmed", PENDING: "Payment pending", UNPAID: "Not paid", FAILED: "Payment unsuccessful", REFUNDED: "Payment refunded" };
export default async function AccountPage() {
  const user = await requireUser();
  const current = await db.user.findUnique({ where: { id: user.id }, select: { role: true } });
  if (current?.role === "admin") redirect("/admin");
  const data = await accountOverview(user.id);
  const order = data.recentOrder;
  const booking = data.reservation;
  const firstItem = order?.items[0];
  return <AccountShell name={user.name}><main id="main" className={styles.overview}>
    <header className={styles.welcome}><p className="eyebrow">Your account</p><h1>Welcome back, {user.name.trim().split(/\s+/)[0] || "friend"}.</h1><p>Good food. Your plans. All in one place.</p></header>
    <div className={styles.stats}>
      <div className={styles.stat}><span>Active orders</span><strong>{data.activeOrders}</strong><small>Awaiting pickup or confirmation</small></div>
      <div className={styles.stat}><span>Upcoming reservations</span><strong>{data.upcomingReservations}</strong><small>Your next visits</small></div>
      <div className={styles.stat}><span>Past orders</span><strong>{data.pastOrders}</strong><small>Completed or cancelled</small></div>
    </div>
    <div className={styles.panels}>
      <section className={styles.panel} aria-labelledby="recent-orders"><div className={styles.panelHeader}><h2 id="recent-orders">Recent order</h2><Link className={styles.secondary} href="/account/orders" aria-label="View all orders">View All</Link></div>
        {order && firstItem ? <div className={styles.orderCard}>
          <Image className={styles.foodImage} src={firstItem.food.image} alt={firstItem.nameSnapshot} width={220} height={200} unoptimized />
          <div className={styles.orderInfo}><h3>{firstItem.nameSnapshot}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}</h3>
            <p>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {new Intl.NumberFormat("en-BD", { style: "currency", currency: order.currency }).format(order.totalMinor / 100)}</p>
            <span className={styles.badge} data-status={order.status}>{orderStatusLabels[order.status]}</span><p className={styles.payment}>{paymentLabels[order.paymentStatus]}</p>
            <Link className={styles.secondary} href={`/account/orders#order-${order.id}`}>View Order</Link>
          </div></div> : <div className={styles.empty}><h3>Your first order starts here</h3><p>Choose your favourites and track them here.</p><Link className={styles.primary} href="/#order">Order Food</Link></div>}
      </section>
      <section className={styles.panel} aria-labelledby="next-reservation"><div className={styles.panelHeader}><h2 id="next-reservation">Upcoming reservation</h2></div>
        {booking ? <div className={styles.booking}><span className={styles.dateTile} aria-hidden="true">{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "Asia/Dhaka" }).format(booking.scheduledAt)}</span>
          <div><h3>Table for {booking.guests}</h3><p>{date.format(booking.scheduledAt)}</p><small>Bangladesh time</small><p><span className={styles.badge} data-status={booking.status}>{booking.status === "CONFIRMED" ? "Confirmed" : "Pending confirmation"}</span></p><Link className={styles.secondary} href={`/reservations?page=${data.reservationPage}#reservation-${booking.id}`}>View Reservation</Link></div>
        </div> : <div className={styles.empty}><h3>A table for your next occasion</h3><p>Your upcoming booking will appear here.</p><Link className={styles.secondary} href="/#reservation">Book a Table</Link></div>}
      </section>
    </div>
    <section className={styles.banner}><div><h2>Make your next visit memorable.</h2><p>From your favourite dishes to a table with good company.</p><div className={styles.actions}><Link className={styles.primary} href="/#order">Order Food</Link><Link className={styles.secondary} href="/#reservation">Book a Table</Link></div></div><div className={styles.bannerImage} aria-hidden="true" /></section>
  </main></AccountShell>;
}
