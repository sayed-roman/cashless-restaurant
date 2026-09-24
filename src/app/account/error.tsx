"use client";
export default function AccountError({ reset }: { reset: () => void }) {
  return <main id="main" className="section wrap" style={{ paddingTop: 160 }}><h1 className="section-title">Unable to load your account</h1><p>Please try again in a moment.</p><button className="button" onClick={reset}>Try again</button></main>;
}
