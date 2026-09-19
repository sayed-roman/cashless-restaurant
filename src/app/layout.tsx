import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Cashless Restaurant", description: "Good food. Great moments. Explore our menu, order your favourites and plan your next visit." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
