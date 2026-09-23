import Link from "next/link";
import { listAdminFoods } from "@/server/admin/foods";
import styles from "@/components/admin/admin-shell.module.css";
export const metadata = { title: "Admin overview | Cashless Restaurant" };
export default async function AdminPage() {
  const foods = await listAdminFoods();
  const available = foods.filter((food) => food.available).length;
  return (
    <main id="main">
      <p className="eyebrow">Restaurant management</p>
      <h1>Overview</h1>
      <p className={styles.intro}>A fresh look at your restaurant menu.</p>
      <div className={styles.cards}>
        <div className={styles.card}>
          <span>Total dishes</span>
          <strong>{foods.length}</strong>
        </div>
        <div className={styles.card}>
          <span>Available to order</span>
          <strong>{available}</strong>
        </div>
        <div className={styles.card}>
          <span>Unavailable</span>
          <strong>{foods.length - available}</strong>
        </div>
      </div>
      <section className={styles.panel}>
        <h2>Keep your menu fresh</h2>
        <p>Add new dishes, update prices and choose what is available today.</p>
        <Link className="button" href="/admin/menu">
          Manage menu →
        </Link>
      </section>
    </main>
  );
}
