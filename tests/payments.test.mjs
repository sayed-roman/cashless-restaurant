import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifySignature, matchesPayment } from "../src/lib/payment-verification.ts";
const secret = "test-secret";
const payload = '{"type":"checkout.session.completed"}';
const now = 1700000000000;
const sign = (t, body = payload) => createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
test("signature accepts a valid rotated signature and rejects tampering", () => {
  const t = now / 1000;
  assert.doesNotThrow(() => verifySignature(payload, `t=${t},v1=${"0".repeat(64)},v1=${sign(t)}`, secret, now));
  assert.throws(() => verifySignature(payload + " ", `t=${t},v1=${sign(t)}`, secret, now));
  assert.throws(() => verifySignature(payload, `t=${t},v1=bad`, secret, now));
});
test("signature rejects stale replay, future timestamp and missing timestamp", () => {
  for (const t of [now / 1000 - 301, now / 1000 + 301]) assert.throws(() => verifySignature(payload, `t=${t},v1=${sign(t)}`, secret, now));
  assert.throws(() => verifySignature(payload, "v1=bad", secret, now));
});
test("payment must match order ownership reference, total and currency", () => {
  const order = { id: "order1", totalMinor: 22000, currency: "bdt" };
  const session = { id: "cs_1", payment_status: "paid", amount_total: 22000, currency: "bdt", metadata: { orderId: "order1" } };
  assert.equal(matchesPayment(order, session), true);
  for (const changes of [{ amount_total: 220 }, { currency: "usd" }, { metadata: { orderId: "other" } }]) assert.equal(matchesPayment(order, { ...session, ...changes }), false);
});
