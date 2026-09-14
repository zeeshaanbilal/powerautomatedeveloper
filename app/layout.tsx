import type { Metadata } from "next";
import "./globals.css";
import "./design-refresh.css";
import "./developer-cards.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://powerautomatedeveloper.com"),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
