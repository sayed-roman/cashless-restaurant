"use client";
import { useMenu } from "./menu-provider";
export function MenuStatus() {
  const { status, reload } = useMenu();
  if (status === "ready") return null;
  return (
    <div className="empty-state center" role="status">
      <p>
        {status === "loading"
          ? "Loading fresh favourites…"
          : "Our menu is temporarily unavailable. Please try again."}
      </p>
      {status === "error" && (
        <button className="button outline" onClick={reload}>
          Try again
        </button>
      )}
    </div>
  );
}
