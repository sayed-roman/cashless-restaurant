export type CartLine = { slug: string; quantity: number };
export type CartAction =
  | { type: "add"; slug: string; quantity?: number }
  | { type: "quantity"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };
export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "clear":
      return [];
    case "remove":
      return state.filter((line) => line.slug !== action.slug);
    case "quantity":
      return state.map((line) =>
        line.slug === action.slug
          ? {
              ...line,
              quantity: Math.max(
                1,
                Math.min(20, Math.floor(action.quantity) || 1),
              ),
            }
          : line,
      );
    case "add": {
      const amount = Math.max(
        1,
        Math.min(20, Math.floor(action.quantity ?? 1) || 1),
      );
      const existing = state.find((line) => line.slug === action.slug);
      return existing
        ? state.map((line) =>
            line.slug === action.slug
              ? { ...line, quantity: Math.min(20, line.quantity + amount) }
              : line,
          )
        : [...state, { slug: action.slug, quantity: amount }];
    }
  }
}
