import { ProductGrid } from "@/components/menu/product-grid";
export function OrderSection() {
  return (
    <section id="order" className="section wrap">
      <div className="center">
        <p className="eyebrow">Freshly prepared</p>
        <h2 className="section-title">Order Online</h2>
        <p className="section-subtitle">Your favourites, ready for pickup.</p>
      </div>
      <ProductGrid />
    </section>
  );
}
