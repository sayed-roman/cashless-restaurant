"use client";
import { useMenu } from "@/components/menu/menu-provider";
import { MenuStatus } from "@/components/menu/menu-status";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories, formatPrice, Category } from "@/data/menu";
import { useCart } from "@/components/cart/cart-provider";
export function ProductGrid({
  initialCategory = "All",
  order = true,
}: {
  initialCategory?: Category | "All";
  order?: boolean;
}) {
  const { dishes, status } = useMenu();
  const [category, setCategory] = useState<Category | "All">(initialCategory);
  const [notice, setNotice] = useState("");
  const { dispatch } = useCart();
  const filtered =
    category === "All" ? dishes : dishes.filter((d) => d.category === category);
  if (status !== "ready") return <MenuStatus />;
  return (
    <>
      <div className="category-filters" aria-label="Filter dishes">
        {(["All", ...categories] as const).map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            className={category === item ? "filter active" : "filter"}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="cart-notice" role="status">
        {notice || "Freshly prepared, made for you."}
      </p>
      {filtered.length === 0 && (
        <p className="empty-state center">
          No dishes are available in this category yet.
        </p>
      )}
      <div className="product-grid">
        {filtered.map((dish) => (
          <article className="product-card" key={dish.slug}>
            <Link
              href={`/menu/${dish.slug}/`}
              className="product-photo"
              aria-label={`View ${dish.name} details`}
            >
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                sizes="(max-width: 700px) 100vw, 33vw"
              />
            </Link>
            <div className="product-copy">
              <Link href={`/menu/${dish.slug}/`}>
                <h3>{dish.name}</h3>
              </Link>
              <p>{dish.description}</p>
              <div className="product-bottom">
                <strong>{formatPrice(dish.price)}</strong>
                <span>{dish.portion}</span>
              </div>
              {order ? (
                <button
                  className="button full"
                  onClick={() => {
                    dispatch({ type: "add", slug: dish.slug });
                    setNotice(`${dish.name} added to your cart.`);
                  }}
                >
                  Add to Cart <span aria-hidden>+</span>
                </button>
              ) : (
                <Link
                  className="button outline full"
                  href={`/menu/${dish.slug}/`}
                >
                  View Details
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
