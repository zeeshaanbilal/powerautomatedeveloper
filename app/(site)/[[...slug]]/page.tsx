import { notFound } from "next/navigation";
import { getEntry, getPublished, getSettings } from "@/lib/content";
import { metadata, schemaFor } from "@/lib/seo";
import { JsonLd } from "@/components/content-blocks";
import { Home } from "@/components/home";
import { PageContent } from "@/components/page-content";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug?: string[] }> };
export async function generateMetadata({ params }: Props) {
  const entry = await getEntry((await params).slug?.join("/") || "");
  return entry
    ? metadata(entry, await getSettings())
    : {
        title: "Page not found | HashTurn",
        robots: { index: false, follow: false },
      };
}
export default async function Page({ params }: Props) {
  const entry = await getEntry((await params).slug?.join("/") || "");
  if (!entry || ["FAQ", "TESTIMONIAL"].includes(entry.kind)) notFound();
  const [entries, settings] = await Promise.all([
    getPublished(),
    getSettings(),
  ]);
  return (
    <>
      <JsonLd value={schemaFor(entry, settings)} />
      {entry.slug ? (
        <PageContent entry={entry} entries={entries} />
      ) : (
        <Home entry={entry} entries={entries} />
      )}
    </>
  );
}
