"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { AdminFood } from "@/server/admin/foods";
import { foodCategories } from "@/lib/food-validation";
import { changeFood } from "@/app/admin/actions";
import { useMenu } from "@/components/menu/menu-provider";
import styles from "./food-manager.module.css";

const labels = {
  STARTERS: "Starters",
  MAIN_COURSE: "Main Course",
  DESSERTS: "Desserts",
  DRINKS: "Drinks",
};
export function FoodManager({ foods }: { foods: AdminFood[] }) {
  const [editing, setEditing] = useState<AdminFood | "new" | null>(null);
  const [deleting, setDeleting] = useState<AdminFood | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const editorRef = useRef<HTMLFormElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = editing ? editorRef.current : deleting ? deleteRef.current : null;
    if (panel) {
      panel.style.scrollMarginTop = "150px";
      panel.scrollIntoView({ block: "start", behavior: "instant" });
      panel.focus({ preventScroll: true });
    }
  }, [editing, deleting]);
  const router = useRouter();
  const { reload } = useMenu();
  const item = editing && editing !== "new" ? editing : null;
  const visible = foods.filter(
    (f) =>
      (!category || f.category === category) &&
      f.name.toLowerCase().includes(search.toLowerCase()),
  );
  async function submit(data: FormData) {
    if (pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const result = await changeFood(data);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage(result.success ?? "Changes saved.");
      setEditing(null);
      setDeleting(null);
      reload();
      router.refresh();
    } catch {
      setError(
        "Unable to complete this action. Check your connection and sign in again if your session expired.",
      );
    } finally {
      setPending(false);
    }
  }
  function open(food: AdminFood | "new") {
    setEditing(food);
    setDeleting(null);
    setError("");
    setMessage("");
  }
  return (
    <div className={styles.root}>
      <div className={styles.stats}>
        <div>
          <span>Total dishes</span>
          <strong>{foods.length}</strong>
        </div>
        <div>
          <span>Available</span>
          <strong>{foods.filter((f) => f.available).length}</strong>
        </div>
        <div>
          <span>Unavailable</span>
          <strong>{foods.filter((f) => !f.available).length}</strong>
        </div>
      </div>
      <div className={styles.toolbar}>
        <h2>Food management</h2>
        <button
          className="button"
          disabled={pending}
          onClick={() => open("new")}
        >
          + Add food
        </button>
      </div>
      {message && (
        <p className={styles.success} role="status">
          {message}
        </p>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {deleting && (
        <div
          ref={deleteRef}
          tabIndex={-1}
          className={styles.confirm}
          role="region"
          aria-label="Confirm food deletion"
        >
          <h3>Delete {deleting.name}?</h3>
          <p>
            This permanently removes the food. You can mark it unavailable by
            editing it instead.
          </p>
          <div className={styles.buttons}>
            <button
              className={styles.danger}
              disabled={pending}
              onClick={() => {
                const data = new FormData();
                data.set("operation", "delete");
                data.set("id", deleting.id);
                void submit(data);
              }}
            >
              {pending ? "Deleting…" : "Delete food"}
            </button>
            <button
              className="button outline"
              disabled={pending}
              onClick={() => setDeleting(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {editing && (
        <form
          key={item?.id ?? "new"}
          ref={editorRef}
          tabIndex={-1}
          aria-label={item ? "Edit food" : "Add food"}
          className={styles.editor}
          onSubmit={(event) => {
            event.preventDefault();
            void submit(new FormData(event.currentTarget));
          }}
        >
          <h3>{item ? "Edit food" : "Add a new dish"}</h3>
          <input
            type="hidden"
            name="operation"
            value={item ? "update" : "create"}
          />
          <input type="hidden" name="id" value={item?.id ?? ""} />
          <fieldset disabled={pending} className={styles.fields}>
            <label>
              Name
              <input
                name="name"
                required
                minLength={2}
                maxLength={80}
                defaultValue={item?.name}
              />
            </label>
            <label>
              URL slug
              <input
                name="slug"
                required
                minLength={2}
                maxLength={100}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="grilled-chicken"
                defaultValue={item?.slug}
              />
            </label>
            <label>
              Category
              <select
                name="category"
                defaultValue={item?.category ?? "STARTERS"}
              >
                {foodCategories.map((c) => (
                  <option key={c} value={c}>
                    {labels[c]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Price (BDT)
              <input
                name="price"
                type="number"
                min="0.01"
                max="100000"
                step="0.01"
                required
                defaultValue={item ? item.priceMinor / 100 : ""}
              />
            </label>
            <label className={styles.wide}>
              Image URL or path
              <input
                name="image"
                required
                maxLength={1000}
                placeholder="/images/chicken-warm.webp or https://…"
                defaultValue={item?.image}
              />
              <small>
                Use an existing image in /images/ or a hosted HTTPS image URL.
              </small>
            </label>
            <label className={styles.wide}>
              Description
              <textarea
                name="description"
                required
                minLength={10}
                maxLength={1500}
                rows={3}
                defaultValue={item?.description}
              />
            </label>
            <label>
              Portion
              <input
                name="portion"
                required
                maxLength={100}
                placeholder="1 serving"
                defaultValue={item?.portion}
              />
            </label>
            <label>
              Display order
              <input
                name="sortOrder"
                type="number"
                required
                min={0}
                max={99999}
                step={1}
                defaultValue={item?.sortOrder ?? 0}
              />
            </label>
            <label>
              Ingredients (comma separated)
              <input
                name="ingredients"
                maxLength={1000}
                defaultValue={item?.ingredients.join(", ")}
              />
            </label>
            <label>
              Allergens (comma separated)
              <input
                name="allergens"
                maxLength={1000}
                defaultValue={item?.allergens.join(", ")}
              />
            </label>
            <label className={styles.check}>
              <input
                name="available"
                type="checkbox"
                defaultChecked={item?.available ?? true}
              />
              Available to order
            </label>
          </fieldset>
          <div className={styles.buttons}>
            <button className="button" disabled={pending}>
              {pending ? "Saving…" : "Save food"}
            </button>
            <button
              className="button outline"
              type="button"
              disabled={pending}
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className={styles.filters}>
        <label>
          Search dishes
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {foodCategories.map((c) => (
              <option key={c} value={c}>
                {labels[c]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            Restaurant menu · {visible.length} dishes
          </caption>
          <thead>
            <tr>
              <th scope="col">Dish</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((food) => (
              <tr key={food.id}>
                <td>
                  <div className={styles.dish}>
                    <Image
                      src={food.image}
                      alt=""
                      width={64}
                      height={52}
                      unoptimized
                    />
                    <div>
                      <strong>{food.name}</strong>
                      <small>{food.portion}</small>
                    </div>
                  </div>
                </td>
                <td>{labels[food.category]}</td>
                <td>৳{(food.priceMinor / 100).toFixed(2)}</td>
                <td>
                  <span
                    className={
                      food.available ? styles.available : styles.unavailable
                    }
                  >
                    {food.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td>
                  <div className={styles.buttons}>
                    <button
                      disabled={pending}
                      onClick={() => open(food)}
                      aria-label={`Edit ${food.name}`}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteLink}
                      disabled={pending}
                      onClick={() => {
                        setDeleting(food);
                        setEditing(null);
                        setError("");
                        setMessage("");
                      }}
                      aria-label={`Delete ${food.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <p className={styles.empty}>
            No dishes found. Add a dish or adjust your filters.
          </p>
        )}
      </div>
    </div>
  );
}
