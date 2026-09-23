import { NextResponse } from "next/server";
import { createOrder } from "@/server/orders/service";
import { OrderError, orderFailure } from "@/lib/order-validation";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const expectedOrigin = new URL(process.env.BETTER_AUTH_URL ?? request.url).origin;
    if (origin && origin !== expectedOrigin) throw new OrderError("Request origin is not allowed.", 403);
    if (!request.headers.get("content-type")?.includes("application/json"))
      throw new OrderError("Send order details as JSON.", 415);
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new OrderError("Invalid JSON order details.");
    }
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const failure = orderFailure(error);
    if (failure.status === 500) console.error("Order creation failed.");
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }
}
