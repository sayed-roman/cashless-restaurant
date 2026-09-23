"use client";
export default function OrdersError({ reset }: { reset: () => void }) {
  return <main id="main"><h1>Unable to load orders</h1><p role="alert">Please check your connection and try again.</p><button className="button" onClick={reset}>Try again</button></main>;
}
