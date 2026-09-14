import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { SettingsForm } from "@/components/admin/settings-form";
export default async function Settings() {
  await requireAdmin();
  return (
    <>
      <div className="admin-top">
        <h1>Site, SEO & tracking settings</h1>
      </div>
      <div className="notice">
        Only enter public business information here. Secrets belong in
        environment variables. Analytics loads after consent; form contents are
        never sent to analytics.
      </div>
      <SettingsForm initial={await getSettings()} />
    </>
  );
}
