"use client";
import { useState } from "react";
type Media = {
  id: string;
  url: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
};
export function MediaManager({ initial }: { initial: Media[] }) {
  const [media, setMedia] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/media/", {
        method: "POST",
        body: new FormData(form),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      setMedia([data, ...media]);
      setMessage("Image uploaded and converted to WebP.");
      form.reset();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {message && (
        <p role="status" className="admin-message">
          {message}
        </p>
      )}
      <form className="admin-panel" onSubmit={upload}>
        <h2>Upload an image</h2>
        <div className="form-grid">
          <label>
            JPEG, PNG or WebP · maximum 8 MB
            <input
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
          </label>
          <label>
            Descriptive alt text
            <input name="alt" maxLength={500} required />
          </label>
          <label>
            Title
            <input name="title" maxLength={200} />
          </label>
          <label>
            Caption
            <input name="caption" maxLength={1000} />
          </label>
        </div>
        <button className="button" disabled={busy}>
          {busy ? "Optimising…" : "Upload image"}
        </button>
      </form>
      <div className="media-grid">
        {media.map((item) => (
          <div className="media-card" key={item.id}>
            <img
              src={item.url}
              alt={item.alt}
              width={item.width}
              height={item.height}
            />
            <p>
              <code>{item.url}</code>
              <br />
              <span className="small muted">
                {item.width} × {item.height} · {Math.round(item.bytes / 1024)}{" "}
                KB · {item.format}
              </span>
            </p>
            {(["alt", "title", "caption"] as const).map((key) => (
              <label key={key}>
                {key}
                <input
                  value={item[key]}
                  onChange={(e) =>
                    setMedia(
                      media.map((m) =>
                        m.id === item.id ? { ...m, [key]: e.target.value } : m,
                      ),
                    )
                  }
                />
              </label>
            ))}
            <div className="button-row">
              <button
                className="button button-small"
                onClick={async () => {
                  try {
                    const r = await fetch("/api/admin/media/", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: item.id,
                        alt: item.alt,
                        title: item.title,
                        caption: item.caption,
                      }),
                    });
                    setMessage(
                      r.ok ? "Metadata saved." : (await r.json()).error,
                    );
                  } catch {
                    setMessage("Unable to save.");
                  }
                }}
              >
                Save
              </button>
              <button
                className="button button-small button-outline"
                onClick={async () => {
                  if (
                    !confirm(
                      "Delete this image? Referenced images cannot be removed.",
                    )
                  )
                    return;
                  try {
                    const r = await fetch(`/api/admin/media/?id=${item.id}`, {
                      method: "DELETE",
                    });
                    if (r.ok) {
                      setMedia(media.filter((m) => m.id !== item.id));
                      setMessage("Image deleted.");
                    } else setMessage((await r.json()).error);
                  } catch {
                    setMessage("Unable to delete.");
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
