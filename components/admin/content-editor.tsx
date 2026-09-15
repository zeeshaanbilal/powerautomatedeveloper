"use client";
import { useState } from "react";
import { adminKinds, type Entry, type SEO, type ContentData } from "@/lib/types";
import { RichEditor } from "./rich-editor";
import { homeCopy } from "@/lib/home-copy";
type Choice = Pick<Entry, "id" | "slug" | "title" | "seo" | "kind">;
export function ContentEditor({
  initial,
  entries,
}: {
  initial: Entry;
  entries: Choice[];
}) {
  const [entry, setEntry] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Entry>(key: K, value: Entry[K]) =>
    setEntry((e) => ({ ...e, [key]: value }));
  const seo = <K extends keyof SEO>(key: K, value: SEO[K]) =>
    setEntry((e) => ({ ...e, seo: { ...e.seo, [key]: value } }));
  const data = <K extends keyof ContentData>(key: K, value: ContentData[K]) =>
    setEntry((e) => ({ ...e, data: { ...e.data, [key]: value } }));
  const warn = [
    !entry.seo.title && "Meta title is missing.",
    !entry.seo.description && "Meta description is missing.",
    !entry.seo.canonical &&
      "Canonical is missing (the clean page URL will be used).",
    !entry.title && "H1 is missing.",
    !entry.slug &&
      entry.id !== "home" &&
      "Slug is empty: this is the homepage path.",
    !entry.seo.ogImage &&
      "Page OG image is missing (site default will be used).",
    entry.featuredImage &&
      !entry.imageAlt &&
      "Featured image alt text is missing.",
    entries.some((e) => e.id !== entry.id && e.slug === entry.slug) &&
      "Duplicate slug: choose a unique path.",
    entries.some(
      (e) =>
        e.id !== entry.id && e.seo.title === entry.seo.title && entry.seo.title,
    ) && "Another page uses this meta title.",
    [
      entry.excerpt,
      entry.body.replace(/<[^>]*>/g, ""),
      ...(entry.data.sections || []).map((s) => s.text),
    ]
      .join(" ")
      .split(/\s+/).length < 120 &&
      "Content is short. Check whether it is useful for a visitor.",
  ].filter(Boolean);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch("/api/admin/content/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entry,
          publishedAt: entry.publishedAt
            ? new Date(entry.publishedAt).toISOString()
            : null,
        }),
      });
      const response = await r.json();
      if (!r.ok) throw new Error(response.error || "Unable to save.");
      if (!entry.id) location.href = `/admin/content/${response.id}/`;
      else
        setMessage(
          "Saved. Public pages and sitemap use the updated publication state.",
        );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File, target: "featuredImage" | "gallery" = "featuredImage", galleryIndex?: number) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", entry.title || "Uploaded image");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/media/", {
        method: "POST",
        body: formData,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      
      if (target === "featuredImage") {
        setEntry((e) => ({ ...e, featuredImage: data.url }));
      } else if (target === "gallery" && galleryIndex !== undefined) {
        data("gallery", entry.data.gallery?.map((g, j) => j === galleryIndex ? { ...g, url: data.url } : g));
      }
      
      setMessage("Image uploaded successfully.");
    } catch (e) {
      setMessage("Image upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (
      !confirm(
        "Delete this content permanently? Existing links will need a redirect.",
      )
    )
      return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/admin/content/?id=${encodeURIComponent(entry.id)}`,
        { method: "DELETE" },
      );
      if (r.ok) location.href = "/admin/content/";
      else setMessage((await r.json()).error);
    } catch {
      setMessage("Unable to delete.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save}>
      {message && (
        <div role="status" className="admin-message">
          {message}
        </div>
      )}
      <div className="editor-layout">
        <div>
          <div className="admin-panel">
            <label>
              Title / H1
              <input
                value={entry.title}
                onChange={(e) => set("title", e.target.value)}
                required
                maxLength={200}
              />
            </label>
            <label>
              Path / slug{" "}
              <span>
                Full path without opening or closing slashes. Leave empty only
                for home.
              </span>
              <input
                value={entry.slug}
                onChange={(e) => set("slug", e.target.value)}
              />
            </label>
            <label>
              Introduction / excerpt
              <textarea
                value={entry.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={4}
              />
            </label>
            <h2>Article body</h2>
            <RichEditor
              value={entry.body}
              onChange={(value) => set("body", value)}
            />
          </div>
          <div className="admin-panel">
            <h2>Page sections</h2>
            {!entry.slug && (
              <details>
                <summary>Homepage section copy</summary>
                <p className="small muted">
                  The featured image is used in the hero. The first three
                  gallery images appear on the three capability cards. Upload
                  replacements in Media Library and paste their URLs into the
                  image fields below.
                </p>
                <p className="small muted">
                  Edit homepage labels, descriptions and calls to action. Empty
                  values use the original copy.
                </p>
                {Object.entries(homeCopy).map(([key, fallback]) => (
                  <label key={key}>
                    {fallback.slice(0, 75)}
                    <textarea
                      rows={2}
                      value={entry.data.homeCopy?.[key] || ""}
                      placeholder={fallback}
                      onChange={(e) =>
                        data("homeCopy", {
                          ...entry.data.homeCopy,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </label>
                ))}
              </details>
            )}
            {entry.data.sections?.map((section, i) => (
              <div className="section-editor" key={i}>
                <label>
                  Section heading
                  <input
                    value={section.title}
                    onChange={(e) =>
                      data(
                        "sections",
                        entry.data.sections?.map((s, j) =>
                          j === i ? { ...s, title: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  Text
                  <textarea
                    value={section.text}
                    rows={4}
                    onChange={(e) =>
                      data(
                        "sections",
                        entry.data.sections?.map((s, j) =>
                          j === i ? { ...s, text: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  List items (one per line)
                  <textarea
                    value={section.items?.join("\n") || ""}
                    onChange={(e) =>
                      data(
                        "sections",
                        entry.data.sections?.map((s, j) =>
                          j === i
                            ? { ...s, items: e.target.value.split("\n") }
                            : s,
                        ),
                      )
                    }
                  />
                </label>
                <div className="button-row">
                  <button
                    className="button button-outline"
                    type="button"
                    disabled={i === 0}
                    onClick={() => {
                      const sections = [...(entry.data.sections || [])];
                      [sections[i - 1], sections[i]] = [
                        sections[i],
                        sections[i - 1],
                      ];
                      data("sections", sections);
                    }}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() =>
                      data(
                        "sections",
                        entry.data.sections?.filter((_, j) => i !== j),
                      )
                    }
                  >
                    Remove section
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="button button-outline"
              onClick={() =>
                data("sections", [
                  ...(entry.data.sections || []),
                  { title: "", text: "" },
                ])
              }
            >
              Add section +
            </button>
          </div>
          <div className="admin-panel">
            <h2>FAQs</h2>
            {entry.data.faqs?.map((faq, i) => (
              <div className="section-editor" key={i}>
                <label>
                  Question
                  <input
                    value={faq.question}
                    onChange={(e) =>
                      data(
                        "faqs",
                        entry.data.faqs?.map((f, j) =>
                          j === i ? { ...f, question: e.target.value } : f,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  Answer
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) =>
                      data(
                        "faqs",
                        entry.data.faqs?.map((f, j) =>
                          j === i ? { ...f, answer: e.target.value } : f,
                        ),
                      )
                    }
                  />
                </label>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() =>
                    data(
                      "faqs",
                      entry.data.faqs?.filter((_, j) => i !== j),
                    )
                  }
                >
                  Remove FAQ
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button button-outline"
              onClick={() =>
                data("faqs", [
                  ...(entry.data.faqs || []),
                  { question: "", answer: "" },
                ])
              }
            >
              Add FAQ +
            </button>
          </div>
          {entry.kind === "CASE_STUDY" && (
            <div className="admin-panel">
              <h2>Case study details</h2>
              {(
                [
                  "client",
                  "industry",
                  "problem",
                  "solution",
                  "implementation",
                  "results",
                ] as const
              ).map((key) => (
                <label key={key} className="capitalize">
                  {key}
                  <textarea
                    rows={key === "client" || key === "industry" ? 1 : 4}
                    value={entry.data[key] || ""}
                    onChange={(e) => data(key, e.target.value)}
                  />
                </label>
              ))}
              <label>
                Technologies (one per line)
                <textarea
                  value={entry.data.technologies?.join("\n") || ""}
                  onChange={(e) =>
                    data("technologies", e.target.value.split("\n"))
                  }
                />
              </label>
            </div>
          )}
          <div className="admin-panel">
            <h2>SEO & sharing</h2>
            <label>
              Meta title
              <input
                value={entry.seo.title}
                onChange={(e) => seo("title", e.target.value)}
              />
            </label>
            <label>
              Meta description
              <textarea
                value={entry.seo.description}
                rows={3}
                onChange={(e) => seo("description", e.target.value)}
              />
            </label>
            <label>
              Canonical URL
              <input
                value={entry.seo.canonical}
                placeholder={`https://powerautomatedeveloper.com/${entry.slug}${entry.slug ? "/" : ""}`}
                onChange={(e) => seo("canonical", e.target.value)}
              />
            </label>
            {(
              [
                "ogTitle",
                "ogDescription",
                "ogImage",
                "twitterTitle",
                "twitterDescription",
                "twitterImage",
              ] as const
            ).map((key) => (
              <label key={key}>
                {
                  {
                    ogTitle: "OG title",
                    ogDescription: "OG description",
                    ogImage: "OG image URL",
                    twitterTitle: "Twitter/X title",
                    twitterDescription: "Twitter/X description",
                    twitterImage: "Twitter/X image URL",
                  }[key]
                }
                <input
                  value={entry.seo[key] || ""}
                  onChange={(e) => seo(key, e.target.value)}
                />
              </label>
            ))}
            <label className="inline-check">
              <input
                type="checkbox"
                checked={!!entry.seo.noindex}
                onChange={(e) => seo("noindex", e.target.checked)}
              />
              Noindex this page
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                checked={entry.seo.schemaEnabled !== false}
                onChange={(e) => seo("schemaEnabled", e.target.checked)}
              />
              Generate structured data from this page’s content
            </label>
          </div>
        </div>
        <aside>
          <div className="admin-panel">
            <h2>Publication</h2>
            <label className="inline-check">
              <input
                type="checkbox"
                checked={!!entry.data.sampleContent}
                onChange={(e) => data("sampleContent", e.target.checked)}
              />
              Sample content (labeled and excluded from search indexing)
            </label>
            <label>
              Type
              <select
                value={entry.kind}
                onChange={(e) => set("kind", e.target.value as Entry["kind"])}
              >
                {adminKinds.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={entry.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="DRAFT">Draft / unpublished</option>
                <option value="PUBLISHED">
                  Published (or scheduled below)
                </option>
              </select>
            </label>
            <label>
              Publication time (UTC)
              <input
                type="datetime-local"
                value={
                  entry.publishedAt
                    ? new Date(entry.publishedAt).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  set(
                    "publishedAt",
                    e.target.value ? e.target.value + ":00Z" : null,
                  )
                }
              />
            </label>
            <label>
              Display order
              <input
                type="number"
                value={entry.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
              />
            </label>
            {["CASE_STUDY", "TESTIMONIAL"].includes(entry.kind) && (
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={!!entry.data.verified}
                  onChange={(e) => data("verified", e.target.checked)}
                />
                Facts and publication permission verified
              </label>
            )}
            <div className="button-row">
              <button className="button" disabled={busy}>
                {busy ? "Saving…" : "Save content"}
              </button>
              {entry.id && (
                <a
                  className="text-link"
                  href={`/admin/preview/${entry.id}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview ↗
                </a>
              )}
            </div>
            {entry.id && (
              <button
                type="button"
                className="text-link"
                style={{
                  border: 0,
                  background: "none",
                  color: "#a1372c",
                  padding: 0,
                  marginTop: 15,
                }}
                onClick={remove}
              >
                Delete content
              </button>
            )}
          </div>
          <div className="admin-panel">
            <h2>SEO review</h2>
            {warn.length ? (
              <ul className="warning-list">
                {warn.map((w) => (
                  <li key={String(w)}>{w}</li>
                ))}
              </ul>
            ) : (
              <p className="small">
                No basic field warnings. Preview and audit the rendered page
                before publishing.
              </p>
            )}
          </div>
          <div className="admin-panel">
            <h2>Images</h2>
            <a
              href="/admin/media/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Open media library ↗
            </a>
            <label>
              Featured image URL
              {["DEVELOPER", "TEAM"].includes(entry.kind) && (
                <span className="small muted">
                  Use a real developer portrait. This photo appears on the
                  developer directory and hiring cards. Portrait orientation
                  works best; keep the face near the upper center.
                </span>
              )}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  style={{ flex: 1 }}
                  value={entry.featuredImage}
                  onChange={(e) => set("featuredImage", e.target.value)}
                />
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, "featuredImage");
                  }} 
                  style={{ flex: "none", width: "auto" }}
                />
              </div>
            </label>
            <label>
              Image alt text
              <input
                value={entry.imageAlt}
                onChange={(e) => set("imageAlt", e.target.value)}
              />
            </label>
            {(entry.data.gallery || []).map((img, i) => (
              <div className="section-editor" key={i}>
                <label>
                  Gallery image URL
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      style={{ flex: 1 }}
                      value={img.url}
                      onChange={(e) =>
                        data(
                          "gallery",
                          entry.data.gallery?.map((g, j) =>
                            j === i ? { ...g, url: e.target.value } : g,
                          ),
                        )
                      }
                    />
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp"
                      disabled={busy}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, "gallery", i);
                      }} 
                      style={{ flex: "none", width: "auto" }}
                    />
                  </div>
                </label>
                <label>
                  Alt text
                  <input
                    value={img.alt}
                    onChange={(e) =>
                      data(
                        "gallery",
                        entry.data.gallery?.map((g, j) =>
                          j === i ? { ...g, alt: e.target.value } : g,
                        ),
                      )
                    }
                  />
                </label>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() =>
                    data(
                      "gallery",
                      entry.data.gallery?.filter((_, j) => i !== j),
                    )
                  }
                >
                  Remove image
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button button-outline"
              onClick={() =>
                data("gallery", [
                  ...(entry.data.gallery || []),
                  { url: "", alt: "" },
                ])
              }
            >
              Add gallery image +
            </button>
          </div>
          <div className="admin-panel">
            <h2>Business content</h2>
            <label>
              Eyebrow
              <input
                value={entry.data.eyebrow || ""}
                onChange={(e) => data("eyebrow", e.target.value)}
              />
            </label>
            <label>
              Professional role
              <input
                value={entry.data.role || ""}
                onChange={(e) => data("role", e.target.value)}
              />
            </label>
            <label>
              Skills (one per line)
              <textarea
                value={entry.data.skills?.join("\n") || ""}
                rows={5}
                onChange={(e) => data("skills", e.target.value.split("\n"))}
              />
            </label>
            <label>
              Author name
              <input
                value={entry.data.authorName || ""}
                onChange={(e) => data("authorName", e.target.value)}
              />
            </label>
            <label>
              Categories (comma separated)
              <input
                value={entry.data.categoryNames?.join(", ") || ""}
                onChange={(e) =>
                  data(
                    "categoryNames",
                    e.target.value.split(",").map((s) => s.trim()),
                  )
                }
              />
            </label>
            <label>
              Tags (comma separated)
              <input
                value={entry.data.tagNames?.join(", ") || ""}
                onChange={(e) =>
                  data(
                    "tagNames",
                    e.target.value.split(",").map((s) => s.trim()),
                  )
                }
              />
            </label>
            {entry.kind === "GUIDE" && (
              <label>
                Resource collection
                <select
                  value={entry.data.resourceGroup || "general"}
                  onChange={(e) => data("resourceGroup", e.target.value)}
                >
                  <option value="general">General guides</option>
                  <option value="power-automate">Power Automate</option>
                  <option value="automation">Business automation</option>
                </select>
              </label>
            )}
            <label>
              Primary CTA text
              <input
                value={entry.data.primaryCta || ""}
                onChange={(e) => data("primaryCta", e.target.value)}
              />
            </label>
            <label>
              Secondary CTA text
              <input
                value={entry.data.secondaryCta || ""}
                onChange={(e) => data("secondaryCta", e.target.value)}
              />
            </label>
            <h3>Social links</h3>
            {entry.data.socials?.map((s, i) => (
              <div className="section-editor" key={i}>
                <label>
                  Label
                  <input
                    value={s.label}
                    onChange={(e) =>
                      data(
                        "socials",
                        entry.data.socials?.map((v, j) =>
                          j === i ? { ...v, label: e.target.value } : v,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  HTTPS URL
                  <input
                    value={s.url}
                    onChange={(e) =>
                      data(
                        "socials",
                        entry.data.socials?.map((v, j) =>
                          j === i ? { ...v, url: e.target.value } : v,
                        ),
                      )
                    }
                  />
                </label>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() =>
                    data(
                      "socials",
                      entry.data.socials?.filter((_, j) => j !== i),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button button-outline"
              onClick={() =>
                data("socials", [
                  ...(entry.data.socials || []),
                  { label: "", url: "" },
                ])
              }
            >
              Add social link
            </button>
          </div>
          <div className="admin-panel">
            <h2>Related content</h2>
            {entries
              .filter((e) => e.id !== entry.id && e.kind !== "TESTIMONIAL")
              .map((e) => (
                <label className="inline-check" key={e.id}>
                  <input
                    type="checkbox"
                    checked={entry.data.related?.includes(e.slug) || false}
                    onChange={(event) =>
                      data(
                        "related",
                        event.target.checked
                          ? [...(entry.data.related || []), e.slug]
                          : entry.data.related?.filter((s) => s !== e.slug),
                      )
                    }
                  />
                  {e.title}
                </label>
              ))}
          </div>
        </aside>
      </div>
    </form>
  );
}
