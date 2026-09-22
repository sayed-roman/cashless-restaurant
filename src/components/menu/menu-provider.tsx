"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Dish } from "@/data/menu";
type MenuState = {
  dishes: Dish[];
  status: "loading" | "ready" | "error";
  reload: () => void;
};
const MenuContext = createContext<MenuState | null>(null);
export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<MenuState, "reload">>({
    dishes: [],
    status: "loading",
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/menu/", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Menu request failed");
        const data: { dishes: Dish[] } = await response.json();
        if (!Array.isArray(data.dishes))
          throw new Error("Invalid menu response");
        if (active) setState({ dishes: data.dishes, status: "ready" });
      } catch {
        if (active) setState({ dishes: [], status: "error" });
      } finally {
        clearTimeout(timeout);
      }
    }
    void load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);
  function reload() {
    setState({ dishes: [], status: "loading" });
    setAttempt((value) => value + 1);
  }
  return (
    <MenuContext.Provider value={{ ...state, reload }}>
      {children}
    </MenuContext.Provider>
  );
}
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu requires MenuProvider");
  return context;
}
