export class OrderError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "OrderError";
    this.status = status;
  }
}

type OrderInput = {
  name: string;
  phone: string;
  notes: string | null;
  lines: { slug: string; quantity: number }[];
};

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseOrder(input: unknown): OrderInput {
  if (!record(input)) throw new OrderError("Invalid order details.");
  if (typeof input.name !== "string" || input.name.trim().length < 2 || input.name.trim().length > 80)
    throw new OrderError("Enter a name between 2 and 80 characters.");
  if (typeof input.phone !== "string" || !/^\+?[\d ()-]{7,20}$/.test(input.phone.trim()) || input.phone.replace(/\D/g, "").length < 7)
    throw new OrderError("Enter a valid phone number.");
  if (input.notes != null && (typeof input.notes !== "string" || input.notes.length > 300))
    throw new OrderError("Order notes must be at most 300 characters.");
  if (!Array.isArray(input.lines) || input.lines.length === 0 || input.lines.length > 30)
    throw new OrderError("Choose between 1 and 30 dishes.");
  const slugs = new Set<string>();
  const lines = input.lines.map((line: unknown) => {
    if (!record(line) || typeof line.slug !== "string" || !line.slug.trim() || line.slug.length > 200 || typeof line.quantity !== "number" || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 20)
      throw new OrderError("Each dish must have a whole quantity between 1 and 20.");
    if (slugs.has(line.slug)) throw new OrderError("Duplicate dishes are not allowed.");
    slugs.add(line.slug);
    return { slug: line.slug, quantity: line.quantity };
  });
  return { name: input.name.trim(), phone: input.phone.trim(), notes: typeof input.notes === "string" ? input.notes.trim() || null : null, lines };
}

type PricedFood = { id: string; slug: string; name: string; priceMinor: number };
export function priceOrder(lines: OrderInput["lines"], foods: PricedFood[]) {
  const bySlug = new Map(foods.map((food) => [food.slug, food]));
  const items = lines.map((line) => {
    const food = bySlug.get(line.slug);
    if (!food) throw new OrderError("A dish is no longer available. Refresh the menu and update your cart.", 409);
    if (!Number.isSafeInteger(food.priceMinor) || food.priceMinor < 0)
      throw new Error("Invalid stored food price");
    return { foodId: food.id, nameSnapshot: food.name, priceMinor: food.priceMinor, quantity: line.quantity };
  });
  const totalMinor = items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);
  if (!Number.isSafeInteger(totalMinor) || totalMinor > 2147483647)
    throw new OrderError("Order total is too large. Reduce your quantities.");
  return { items, totalMinor };
}

export function orderFailure(error: unknown) {
  if (error instanceof OrderError) return { status: error.status, error: error.message };
  return { status: 500, error: "Unable to place your order right now. Please try again later." };
}
