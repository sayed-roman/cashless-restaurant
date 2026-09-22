import test from "node:test";
import assert from "node:assert/strict";
import { safeReturnPath } from "../src/lib/auth-redirect.ts";
test("login preserves supported shopping and account destinations", () => {
  for (const path of ["/checkout", "/account", "/admin", "/#reservation"])
    assert.equal(safeReturnPath(path), path);
});
test("login rejects external and malformed redirects", () => {
  for (const path of [
    null,
    undefined,
    "",
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/checkout?next=https://evil.example",
    "javascript:alert(1)",
  ])
    assert.equal(safeReturnPath(path), "/account");
});
