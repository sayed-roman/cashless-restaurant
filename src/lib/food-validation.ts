export const foodCategories = [
  "STARTERS",
  "MAIN_COURSE",
  "DESSERTS",
  "DRINKS",
] as const;
export type FoodInput = {
  name: string;
  slug: string;
  category: (typeof foodCategories)[number];
  priceMinor: number;
  image: string;
  description: string;
  portion: string;
  ingredients: string[];
  allergens: string[];
  available: boolean;
  sortOrder: number;
};
export function parseFood(form: FormData): FoodInput {
  function field(key: string, min: number, max: number) {
    const raw = form.get(key);
    if (typeof raw !== "string") throw new Error(`Please enter ${key}.`);
    const value = raw.trim();
    if (value.length < min || value.length > max)
      throw new Error(`${key} must contain ${min}–${max} characters.`);
    return value;
  }
  const name = field("name", 2, 80);
  const slug = field("slug", 2, 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error(
      "Use lowercase letters, numbers and hyphens for the URL slug.",
    );
  const category = field("category", 1, 30);
  if (!foodCategories.includes(category as FoodInput["category"]))
    throw new Error("Choose a valid category.");
  const price = field("price", 1, 12);
  if (!/^\d+(?:\.\d{1,2})?$/.test(price))
    throw new Error(
      "Price must be a positive amount with at most two decimal places.",
    );
  const priceMinor = Math.round(Number(price) * 100);
  if (
    !Number.isSafeInteger(priceMinor) ||
    priceMinor < 1 ||
    priceMinor > 10000000
  )
    throw new Error("Price must be between ৳0.01 and ৳100,000.");
  const image = field("image", 1, 1000);
  const localImage =
    /^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/i.test(image) &&
    !image.includes("..");
  let remoteImage = false;
  try {
    const url = new URL(image);
    remoteImage = url.protocol === "https:" && !url.username && !url.password;
  } catch {}
  if (!localImage && !remoteImage)
    throw new Error("Use an /images/ file path or an HTTPS image URL.");
  const sort = field("sortOrder", 1, 6);
  if (!/^\d+$/.test(sort) || Number(sort) > 99999)
    throw new Error("Display order must be a whole number from 0 to 99999.");
  function list(key: string) {
    const values = field(key, 0, 1000)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length > 30 || values.some((v) => v.length > 100))
      throw new Error(`Keep ${key} to 30 entries of at most 100 characters.`);
    return values;
  }
  return {
    name,
    slug,
    category: category as FoodInput["category"],
    priceMinor,
    image,
    description: field("description", 10, 1500),
    portion: field("portion", 1, 100),
    ingredients: list("ingredients"),
    allergens: list("allergens"),
    available: form.get("available") === "on",
    sortOrder: Number(sort),
  };
}
