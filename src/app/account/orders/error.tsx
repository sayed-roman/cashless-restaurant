"use client";
import Link from "next/link";
export default function OrdersError({ reset }: { reset: () => void }) {
  return <main id="main" className="section wrap"><h1 className="section-title">Unable to load your orders</h1><p role="alert">Please try again in a moment.</p><button className="button" onClick={reset}>Try again</button><p><Link href="/account">Back to my account</Link></p></main>;
}
