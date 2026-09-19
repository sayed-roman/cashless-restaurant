"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
export function OrderDish({ slug }: { slug: string }) {
  const { dispatch, setOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="actions">
      <div className="quantity">
        <button
          aria-label="Decrease quantity"
          disabled={quantity === 1}
          onClick={() => setQuantity(quantity - 1)}
        >
          −
        </button>
        <span aria-live="polite">{quantity}</span>
        <button
          aria-label="Increase quantity"
          disabled={quantity === 20}
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
      <button
        className="button"
        onClick={() => {
          dispatch({ type: "add", slug, quantity });
          setOpen(true);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
