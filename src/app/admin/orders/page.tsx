import Link from "next/link";
import { listAdminOrders } from "@/server/orders/admin";
import { orderStatuses, orderStatusLabels } from "@/lib/order-status";
import { AdminOrderStatus } from "@/components/orders/admin-status-control";
import styles from "@/components/orders/admin-orders.module.css";
export const metadata = { title: "Orders | Cashless Admin" };
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" });
export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const query = await searchParams;
  const { orders, hasMore, page, filter } = await listAdminOrders(Number(query.page ?? 1), query.status);
  const pageUrl = (value: number) => `/admin/orders?page=${value}${filter ? `&status=${filter}` : ""}`;
  return <main id="main">
    <p className="eyebrow">Restaurant management</p><h1>Orders</h1>
    <p>Review pickup orders and keep customers updated. Times are shown in Bangladesh time.</p>
    <form className={styles.filter} action="/admin/orders">
      <label>Order status<select name="status" defaultValue={filter ?? ""} key={filter ?? "all"}>
        <option value="">All orders</option>{orderStatuses.map(status => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}
      </select></label><button className="button">Filter orders</button>
    </form>
    <div className={styles.list}>{orders.map(order => {
      const money = (amount: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: order.currency }).format(amount / 100);
      return <article className={styles.card} key={order.id}>
        <header className={styles.heading}><h2>{order.customerName}</h2><span className={styles.badge}>{orderStatusLabels[order.status]}</span></header>
        <p className={styles.reference}>Reference: {order.id}</p>
        <dl className={styles.details}>
          <div><dt>Placed</dt><dd>{dateFormat.format(order.createdAt)}</dd></div>
          <div><dt>Phone</dt><dd>{order.phone}</dd></div>
          <div><dt>Account email</dt><dd>{order.user.email}</dd></div>
        </dl>
        <ul className={styles.items}>{order.items.map(item => <li key={item.id}><span>{item.quantity} × {item.nameSnapshot}<small>{money(item.priceMinor)} each</small></span><strong>{money(item.quantity * item.priceMinor)}</strong></li>)}</ul>
        {order.notes && <p className={styles.notes}><strong>Customer notes:</strong> {order.notes}</p>}
        <div className={styles.total}><span>Order total</span><strong>{money(order.totalMinor)}</strong></div>
        <AdminOrderStatus key={order.status} id={order.id} status={order.status} />
      </article>;
    })}</div>
    {!orders.length && <p className={styles.card}>No orders match this page or filter.</p>}
    <nav className={styles.pages} aria-label="Order pages">{page > 1 && <Link href={pageUrl(page - 1)}>← Previous</Link>}<span>Page {page}</span>{hasMore && <Link href={pageUrl(page + 1)}>Next →</Link>}</nav>
  </main>;
}
