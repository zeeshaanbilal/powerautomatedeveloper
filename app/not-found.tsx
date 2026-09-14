import Link from "next/link";
export default function NotFound() {
  return (
    <main className="error-page">
      <span className="eyebrow">404 / Page not found</span>
      <h1>Let’s get you back on track.</h1>
      <p>This page may have moved, or the address may be incorrect.</p>
      <div className="button-row">
        <Link className="button" href="/">
          Back to home ↗
        </Link>
        <Link href="/services/" className="text-link">
          Explore services
        </Link>
        <Link href="/contact/" className="text-link">
          Contact HashTurn
        </Link>
      </div>
    </main>
  );
}
