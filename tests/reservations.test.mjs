import test from "node:test";
import assert from "node:assert/strict";
import { tsImport } from "tsx/esm/api";
const { parseReservation, canChangeReservation } = await tsImport(
  "../src/lib/reservation-rules.ts",
  import.meta.url,
);
const now = Date.parse("2026-09-23T00:00:00Z");
function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "Test Guest",
    phone: "01712345678",
    date: "2026-09-24",
    time: "12:00",
    guests: "2",
    ...overrides,
  }))
    data.set(key, value);
  return data;
}
test("reservation time is interpreted in Bangladesh and user input cannot set ownership", () => {
  const result = parseReservation(
    form({ userId: "another-user", status: "CONFIRMED" }),
    now,
  );
  assert.equal(result.scheduledAt.toISOString(), "2026-09-24T06:00:00.000Z");
  assert.equal(result.guests, 2);
  assert.equal("userId" in result, false);
  assert.equal("status" in result, false);
});
test("invalid calendar dates, past slots, distant dates and invalid guests are rejected", () => {
  for (const change of [
    { date: "2026-02-30" },
    { date: "2026-09-22" },
    { time: "02:00" },
    { date: "2027-09-24" },
    { guests: "9" },
    { guests: "1.5" },
    { guests: "0" },
    { phone: "invalid" },
    { name: "A" },
  ])
    assert.throws(() => parseReservation(form(change), now));
});
test("status transitions reject reopening closed bookings or prematurely completing visits", () => {
  const future = new Date(now + 3600000),
    past = new Date(now - 3600000);
  assert.equal(canChangeReservation("PENDING", "CONFIRMED", future, now), true);
  assert.equal(canChangeReservation("PENDING", "CONFIRMED", past, now), false);
  assert.equal(
    canChangeReservation("CONFIRMED", "COMPLETED", future, now),
    false,
  );
  assert.equal(canChangeReservation("CONFIRMED", "COMPLETED", past, now), true);
  assert.equal(canChangeReservation("PENDING", "CANCELLED", future, now), true);
  assert.equal(
    canChangeReservation("CANCELLED", "CONFIRMED", future, now),
    false,
  );
  assert.equal(canChangeReservation("COMPLETED", "PENDING", past, now), false);
});
