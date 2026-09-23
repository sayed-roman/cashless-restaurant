import Link from "next/link";
import { getMyOrders } from "@/server/orders/queries";
import styles from "@/components/orders/orders.module.css";

export const metadata = { title: "My Orders | Cashless Restaurant" };
const statusLabels = {
  PENDING: "Pending confirmation", CONFIRMED: "Confirmed", PREPARING: "Preparing",
  READY: "Ready for pickup", COMPLETED: "Completed", CANCELLED: "Cancelled",
};
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka",
});
function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(amount / 100);
}
export default async function MyOrdersPage({ searchParams }: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const { orders, hasMore, page } = await getMyOrders(Number(params.page ?? 1));
  return (
    <main id="main" className={`wrap ${styles.page}`}>
      <Link href="/account" className={styles.back}>← My account</Link>
      <header className={styles.header}>
        <div><p className="eyebrow">Your Cashless account</p><h1 className="section-title">My Orders</h1>
          <p>All your favourites, with their latest order status.</p></div>
        <Link href="/#order" className="button">Order Food →</Link>
      </header>
      {!orders.length ? (
        <section className={styles.empty}>
          <h2>{page === 1 ? "Your first order starts here" : "No orders on this page"}</h2>
          <p>{page === 1 ? "Choose something delicious and your orders will appear here." : "Return to your latest orders."}</p>
          <Link className="button" href={page === 1 ? "/#order" : "/account/orders"}>{page === 1 ? "Explore dishes" : "Latest orders"}</Link>
        </section>
      ) : (
        <div className={styles.list}>{orders.map(order => (
          <article className={styles.card} key={order.id}>
            <div className={styles.top}>
              <div><h2>Pickup order</h2><time dateTime={order.createdAt.toISOString()}>{dateFormat.format(order.createdAt)} (Dhaka)</time></div>
              <span className={styles.badge} data-status={order.status}>{statusLabels[order.status]}</span>
            </div>
            <p className={styles.reference}>Reference: {order.id}</p>
            <ul className={styles.items}>{order.items.map(item => (
              <li key={item.id}><div><strong>{item.nameSnapshot}</strong><small>{item.quantity} × {money(item.priceMinor, order.currency)}</small></div><span>{money(item.quantity * item.priceMinor, order.currency)}</span></li>
            ))}</ul>
            {order.notes && <p className={styles.notes}><strong>Your notes:</strong> {order.notes}</p>}
            <div className={styles.total}><span>Order total</span><strong>{money(order.totalMinor, order.currency)}</strong></div>
          </article>
        ))}</div>
      )}
      {(page > 1 || hasMore) && <nav className={styles.pagination} aria-label="Order pages">
        {page > 1 && <Link className="button outline" href={`/account/orders?page=${page - 1}`}>Previous</Link>}
        <span>Page {page}</span>
        {hasMore && <Link className="button outline" href={`/account/orders?page=${page + 1}`}>Next</Link>}
      </nav>}
    </main>
  );
}
