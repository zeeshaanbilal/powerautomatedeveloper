import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Brand } from "@/components/brand";
import { Logout } from "@/components/admin/logout";
export const dynamic = "force-dynamic";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const nav = [
    ["Overview", ""],
    ["Pages", "content?kind=PAGE"],
    ["Services", "content?kind=SERVICE"],
    ["Hire Pages", "content?kind=HIRE"],
    ["Industries", "content?kind=INDUSTRY"],
    ["Team", "content?kind=TEAM"],
    ["Case Studies", "content?kind=CASE_STUDY"],
    ["Blog", "content?kind=BLOG"],
    ["Guides", "content?kind=GUIDE"],
    ["FAQs", "content?kind=FAQ"],
    ["Testimonials", "content?kind=TESTIMONIAL"],
    ["Categories", "manage/categories"],
    ["Tags", "manage/tags"],
    ["Media Library", "media"],
    ["Navigation", "manage/navigation"],
    ["SEO audit", "seo-audit"],
    ["Redirects", "manage/redirects"],
    ["Site & SEO Settings", "settings"],
    ["Contact Leads", "leads"],
    ["SEO / Growth", "manage/growth"],
  ];
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/admin/">
          <Brand light />
        </Link>
        <nav aria-label="Admin navigation">
          {nav.map(([label, path]) => (
            <Link
              key={label}
              href={`/admin/${path.includes("?") ? path.replace("?", "/?") : path ? path + "/" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="small">
          <Link href="/">View website ↗</Link>
        </p>
        <Logout />
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
