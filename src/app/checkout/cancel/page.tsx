import Link from "next/link";
export default function PaymentCancelled() {
  return <main className="section wrap center">
    <p className="eyebrow">Checkout closed</p><h1 className="section-title">Your order is saved.</h1>
    <p>Your cart is still available. Open My Orders to check payment status and resume the same payment.</p>
    <Link className="button" href="/account/orders">View My Orders</Link>
  </main>;
}
