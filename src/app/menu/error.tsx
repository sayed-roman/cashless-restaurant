"use client";
export default function MenuError({ retry }: { retry: () => void }) {
  return (
    <main id="main" className="section wrap center">
      <h1 className="section-title">Menu temporarily unavailable</h1>
      <p className="section-subtitle">Please try again in a moment.</p>
      <button className="button" onClick={() => retry()}>
        Try again
      </button>
    </main>
  );
}
