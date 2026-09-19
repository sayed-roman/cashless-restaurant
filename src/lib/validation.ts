export function localDateValue(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join("-");
}
export function validPhone(value: string): boolean {
  return (
    /^\+?[\d\s()-]{7,20}$/.test(value.trim()) &&
    value.replace(/\D/g, "").length >= 7
  );
}
export function futureReservation(
  date: string,
  time: string,
  now = Date.now(),
): boolean {
  const timestamp = Date.parse(`${date}T${time}:00+06:00`);
  return Number.isFinite(timestamp) && timestamp > now;
}
