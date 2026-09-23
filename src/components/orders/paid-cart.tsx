"use client";
import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function PaidCart({ orderId }: { orderId: string }) {
  const { lines, dispatch } = useCart();
  useEffect(() => {
    const key = `checkout-cart:${orderId}`;
    const snapshot = sessionStorage.getItem(key);
    // Do not clear a different cart that was edited in another tab or after checkout.
    if (snapshot === JSON.stringify(lines)) {
      dispatch({ type: "clear" });
      sessionStorage.removeItem(key);
    }
  }, [orderId, lines, dispatch]);
  return null;
}
