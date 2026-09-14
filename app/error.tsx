"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <meta name="robots" content="noindex" />
      <span className="eyebrow">Something went wrong</span>
      <h1>We couldn’t load this page.</h1>
      <p>Please try again. If the problem continues, return to the homepage.</p>
      <div className="button-row">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <a href="/">Return home</a>
      </div>
    </main>
  );
}
