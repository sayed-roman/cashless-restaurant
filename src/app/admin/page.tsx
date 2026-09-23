import { listAdminFoods } from "@/server/admin/foods";
import { FoodManager } from "@/components/admin/food-manager";
export const metadata = { title: "Admin | Cashless Restaurant" };
export default async function AdminPage() {
  const foods = await listAdminFoods();
  return (
    <main id="main" className="section wrap">
      <p className="eyebrow">Restaurant management</p>
      <h1 className="section-title">Admin dashboard</h1>
      <p className="section-subtitle">Your menu, managed in one place.</p>
      <FoodManager foods={foods} />
    </main>
  );
}
