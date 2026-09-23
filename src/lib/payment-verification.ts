import { createHmac, timingSafeEqual } from "node:crypto";

export function verifySignature(payload: string, header: string, secret: string, now = Date.now()) {
  const parts = header.split(",").map(part => part.trim().split("="));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  if (!timestamp || !/^\d+$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300)
    throw new Error("Invalid webhook timestamp.");
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest();
  const valid = parts.some(([key, value]) => key === "v1" && /^[a-f0-9]{64}$/i.test(value ?? "") && timingSafeEqual(expected, Buffer.from(value, "hex")));
  if (!valid) throw new Error("Invalid webhook signature.");
}

export type PaymentSession = {
  id: string; payment_status: string; amount_total: number | null;
  currency: string | null; metadata?: { orderId?: string } | null;
};
export function matchesPayment(order: { id: string; totalMinor: number; currency: string }, session: PaymentSession) {
  return session.metadata?.orderId === order.id && session.amount_total === order.totalMinor && session.currency === order.currency;
}
