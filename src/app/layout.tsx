import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bodyFont = localFont({
  src: [
    {
      path: "../../public/fonts/dm-sans-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../../public/fonts/dm-sans-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
const headingFont = localFont({
  src: "../../public/fonts/cormorant-garamond-latin-600-normal.woff2",
  weight: "600",
  variable: "--font-heading",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Cashless Restaurant",
  description:
    "Good food. Great moments. Explore our menu, order your favourites and plan your next visit.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
