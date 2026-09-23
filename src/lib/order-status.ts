export const orderStatuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"] as const;
export type OrderState = typeof orderStatuses[number];
export const orderStatusLabels: Record<OrderState, string> = {
  PENDING: "Pending confirmation", CONFIRMED: "Confirmed", PREPARING: "Preparing",
  READY: "Ready for pickup", COMPLETED: "Completed", CANCELLED: "Cancelled",
};
export const orderTransitions: Record<OrderState, readonly OrderState[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"], READY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [], CANCELLED: [],
};
export function isOrderState(value: unknown): value is OrderState {
  return typeof value === "string" && orderStatuses.some(status => status === value);
}
export function canTransitionOrder(from: unknown, to: unknown): boolean {
  return isOrderState(from) && isOrderState(to) && orderTransitions[from].includes(to);
}
