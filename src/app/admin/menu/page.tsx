import { listAdminFoods } from "@/server/admin/foods";
import { FoodManager } from "@/components/admin/food-manager";
import styles from "@/components/admin/admin-shell.module.css";
export const metadata = { title: "Menu management | Cashless Restaurant" };
export default async function MenuManagementPage() {
  const foods = await listAdminFoods();
  return (
    <main id="main">
      <p className="eyebrow">Your restaurant menu</p>
      <h1>Menu Management</h1>
      <p className={styles.intro}>
        Create dishes, adjust prices and manage availability.
      </p>
      <FoodManager foods={foods} />
    </main>
  );
}
