"use client";
import { useState } from "react";
import type { Settings } from "@/lib/types";
export function SettingsForm({ initial }: { initial: Settings }) {
  const [value, setValue] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const fields: Record<Exclude<keyof Settings, "socialLinks">, string> = {
    companyName: "Company name",
    email: "Contact email",
    phone: "Phone",
    address: "Business address (optional)",
    logo: "Logo URL",
    favicon: "Favicon URL",
    defaultTitle: "Default SEO title",
    defaultDescription: "Default meta description",
    defaultOgImage: "Default OG image URL",
    consultationLabel: "Consultation CTA label",
    consultationUrl: "Consultation booking URL",
    googleAnalyticsId: "Google Analytics measurement ID (G-...)",
    searchConsoleToken: "Google Search Console verification token",
    trackingNotes:
      "Other tracking IDs / implementation notes (not executed as code)",
  };
  return (
    <form
      className="admin-panel"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const r = await fetch("/api/admin/settings/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          });
          setMessage(r.ok ? "Settings saved." : (await r.json()).error);
        } catch {
          setMessage("Unable to save.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {message && (
        <p role="status" className="admin-message">
          {message}
        </p>
      )}
      <div className="form-grid">
        {Object.entries(fields).map(([key, label]) => (
          <label key={key}>
            {label}
            {["defaultDescription", "trackingNotes", "address"].includes(
              key,
            ) ? (
              <textarea
                rows={3}
                value={value[key as keyof Settings] as string}
                onChange={(e) => setValue({ ...value, [key]: e.target.value })}
              />
            ) : (
              <input
                value={value[key as keyof Settings] as string}
                onChange={(e) => setValue({ ...value, [key]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      <h2>Company social links</h2>
      {value.socialLinks.map((s, i) => (
        <div className="form-grid" key={i}>
          <label>
            Label
            <input
              value={s.label}
              onChange={(e) =>
                setValue({
                  ...value,
                  socialLinks: value.socialLinks.map((v, j) =>
                    j === i ? { ...v, label: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <label>
            HTTPS URL
            <input
              value={s.url}
              onChange={(e) =>
                setValue({
                  ...value,
                  socialLinks: value.socialLinks.map((v, j) =>
                    j === i ? { ...v, url: e.target.value } : v,
                  ),
                })
              }
            />
          </label>
          <button
            type="button"
            onClick={() =>
              setValue({
                ...value,
                socialLinks: value.socialLinks.filter((_, j) => i !== j),
              })
            }
          >
            Remove link
          </button>
        </div>
      ))}
      <div className="button-row">
        <button
          className="button button-outline"
          type="button"
          onClick={() =>
            setValue({
              ...value,
              socialLinks: [...value.socialLinks, { label: "", url: "" }],
            })
          }
        >
          Add social link
        </button>
        <button className="button" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
