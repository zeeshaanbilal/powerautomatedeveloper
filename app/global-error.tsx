"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
      </head>
      <body>
        <main>
          <h1>We couldn’t load the website.</h1>
          <p>Please try again in a moment.</p>
          <button onClick={reset}>Try again</button>
          <a href="/">Return home</a>
        </main>
      </body>
    </html>
  );
}
