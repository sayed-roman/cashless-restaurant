import test from "node:test";
import assert from "node:assert/strict";
import { parseFood } from "../src/lib/food-validation.ts";
function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "Fresh pasta",
    slug: "fresh-pasta",
    category: "MAIN_COURSE",
    price: "220.25",
    image: "/images/pasta-warm.webp",
    description: "Freshly prepared pasta with herbs.",
    portion: "1 serving",
    ingredients: "Pasta, Herbs",
    allergens: "Wheat",
    available: "on",
    sortOrder: "0",
    ...overrides,
  }))
    data.set(key, value);
  return data;
}
test("prices use integer minor units and lists are normalized", () => {
  const food = parseFood(form());
  assert.equal(food.priceMinor, 22025);
  assert.deepEqual(food.ingredients, ["Pasta", "Herbs"]);
  assert.equal(food.available, true);
});
test("invalid prices, categories, slugs, image schemes and sort orders are rejected", () => {
  for (const input of [
    { price: "-1" },
    { price: "1.001" },
    { price: "Infinity" },
    { price: "100001" },
    { category: "OTHER" },
    { slug: "../food" },
    { image: "javascript:alert(1)" },
    { image: "//example.com/image.jpg" },
    { image: "/images/../secret.jpg" },
    { sortOrder: "1.5" },
    { sortOrder: "-1" },
    { description: "" },
  ])
    assert.throws(() => parseFood(form(input)));
});
test("unavailable foods and hosted HTTPS images are supported", () => {
  const food = parseFood(
    form({ available: "", image: "https://example.com/food.jpg" }),
  );
  assert.equal(food.available, false);
});
test("client submitted role and currency do not enter persisted food data", () => {
  const food = parseFood(
    form({ role: "admin", currency: "usd", id: "other-food" }),
  );
  assert.equal("role" in food, false);
  assert.equal("currency" in food, false);
  assert.equal("id" in food, false);
});
