import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="brand">
            Cashless<span>RESTAURANT</span>
          </Link>
          <p>Good Food. Great Moments.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/#about">About us</Link>
          <Link href="/menu/">Our menu</Link>
          <Link href="/#order">Order online</Link>
        </div>
        <div>
          <h3>Plan your visit</h3>
          <Link href="/#reservation">Book a table</Link>
          <p>Dhaka, Bangladesh</p>
          <p className="footer-note">Opening hours & contact coming soon.</p>
        </div>
        <div className="footer-motto">
          Good food.
          <br />
          Better company.
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 Cashless Restaurant.</span>
        <span>A restaurant website demonstration.</span>
      </div>
    </footer>
  );
}
