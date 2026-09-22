// Only application-owned destinations are accepted after authentication.
export function safeReturnPath(value: string | null | undefined): string {
  return value &&
    ["/account", "/checkout", "/admin", "/#reservation"].includes(value)
    ? value
    : "/account";
}
