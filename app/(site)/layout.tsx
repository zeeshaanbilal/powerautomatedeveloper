import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getSettings } from "@/lib/content";
export async function generateMetadata() {
  const s = await getSettings();
  return {
    verification: { google: s.searchConsoleToken || undefined },
    icons: { icon: s.favicon || "/icon.svg" },
  };
}
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
