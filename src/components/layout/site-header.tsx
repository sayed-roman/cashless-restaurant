"use client";
import Link from "next/link";
import { useState } from "react";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><div className="wrap header-inner"><Link href="/" className="brand" aria-label="Cashless Restaurant home">Cashless<span>RESTAURANT</span></Link><button className="mobile-toggle" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button><nav id="navigation" className={open ? "nav open" : "nav"} aria-label="Main navigation">{[["Home","/"],["About","/#about"],["Menu","/#menu"],["Order","/#order"]].map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav><Link className="button gold header-book" href="/#reservation">Book a Table</Link></div></header></>;
}
