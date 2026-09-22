import { requireUser } from "@/server/auth/session";
import { Checkout } from "@/components/forms/checkout";
export const metadata = { title: "Checkout | Cashless Restaurant" };
export default async function CheckoutPage() {
  await requireUser("/checkout");
  return (
    <main className="section wrap" id="main">
      <Checkout />
    </main>
  );
}
