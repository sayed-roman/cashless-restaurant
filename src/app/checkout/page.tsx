import { Checkout } from "@/components/forms/checkout";
export const metadata = { title: "Checkout | Cashless Restaurant" };
export default function CheckoutPage() {
  return (
    <main className="section wrap" id="main">
      <Checkout />
    </main>
  );
}
