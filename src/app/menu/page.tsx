import { Suspense } from "react";
import { MenuBrowser } from "@/components/menu/menu-browser";
export const metadata={title:"Our Menu | Cashless Restaurant"};
export default function MenuPage(){return <main id="main" className="section wrap"><div className="center"><p className="eyebrow">Something for every appetite</p><h1 className="section-title">Our Menu</h1><p className="section-subtitle">Find your next favourite.</p></div><Suspense fallback={<p className="center section">Loading the menu…</p>}><MenuBrowser/></Suspense></main>}
