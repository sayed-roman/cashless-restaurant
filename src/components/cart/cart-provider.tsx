"use client";
import { createContext, useContext, useReducer, useState } from "react";
import { cartReducer, CartAction, CartLine } from "@/lib/cart";
import { MenuProvider, useMenu } from "@/components/menu/menu-provider";
type CartContextValue = {
  lines: CartLine[];
  dispatch: React.Dispatch<CartAction>;
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <MenuProvider>
      <CartState>{children}</CartState>
    </MenuProvider>
  );
}
function CartState({ children }: { children: React.ReactNode }) {
  const { dishes } = useMenu();
  const [storedLines, dispatch] = useReducer(cartReducer, []);
  const lines = storedLines.filter((line) =>
    dishes.some((dish) => dish.slug === line.slug),
  );
  const [open, setOpen] = useState(false);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce(
    (sum, line) =>
      sum +
      (dishes.find((d) => d.slug === line.slug)?.price ?? 0) * line.quantity,
    0,
  );
  return (
    <CartContext.Provider
      value={{ lines, dispatch, count, total, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
