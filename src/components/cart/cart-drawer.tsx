"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { dishes, formatPrice } from "@/data/menu";
export function CartDrawer() {
  const { lines, dispatch, total, open, setOpen } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
        dialog.close();
      };
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="cart-drawer"
      onCancel={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      aria-labelledby="cart-title"
    >
      <div className="cart-content">
        <div className="section-heading">
          <h2 id="cart-title">Your Order</h2>
          <button
            className="icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is waiting for something delicious.</p>
            <Link
              href="/#order"
              className="button"
              onClick={() => setOpen(false)}
            >
              Explore dishes
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => {
                const dish = dishes.find((d) => d.slug === line.slug)!;
                return (
                  <div className="cart-line" key={line.slug}>
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={80}
                      height={85}
                    />
                    <div>
                      <h3>{dish.name}</h3>
                      <p>{formatPrice(dish.price)}</p>
                      <div className="quantity">
                        <button
                          aria-label={`Decrease ${dish.name} quantity`}
                          disabled={line.quantity === 1}
                          onClick={() =>
                            dispatch({
                              type: "quantity",
                              slug: line.slug,
                              quantity: line.quantity - 1,
                            })
                          }
                        >
                          −
                        </button>
                        <span aria-live="polite">{line.quantity}</span>
                        <button
                          aria-label={`Increase ${dish.name} quantity`}
                          disabled={line.quantity === 20}
                          onClick={() =>
                            dispatch({
                              type: "quantity",
                              slug: line.slug,
                              quantity: line.quantity + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() =>
                        dispatch({ type: "remove", slug: line.slug })
                      }
                      aria-label={`Remove ${dish.name}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="cart-total">
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="muted small">Pickup only · no delivery charge</p>
            <Link
              className="button full"
              href="/checkout/"
              onClick={() => setOpen(false)}
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
    </dialog>
  );
}
export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      className="cart-toggle"
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} items`}
    >
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path
          d="M2 3h3l3 13h11l3-9H6M9 20h.01M18 20h.01"
          strokeLinecap="round"
        />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      <span>{count}</span>
    </button>
  );
}
