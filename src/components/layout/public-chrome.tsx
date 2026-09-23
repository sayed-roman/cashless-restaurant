"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function PublicChrome({
  children,
  header,
  footer,
  cart,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  cart: ReactNode;
}) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  return (
    <>
      {!admin && header}
      {children}
      {!admin && footer}
      {!admin && cart}
    </>
  );
}
