"use client";
import { useState } from "react";
import { managerModels, type Manager } from "@/lib/admin-models";
export function RecordManager({
  type,
  initial,
}: {
  type: Manager;
  initial: Record<string, unknown>[];
}) {
  const model = managerModels[type];
  const [rows, setRows] = useState(initial);
  const empty = () =>
    Object.fromEntries(
      Object.entries(model.fields).map(([key, field]) => [
        key,
        field === "checkbox"
          ? true
          : field === "number"
            ? 0
            : field.includes(",")
              ? field.split(",")[0]
              : "",
      ]),
    );
  const [record, setRecord] = useState<Record<string, unknown>>(empty);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/manage/${type}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error);
      setRows((prev) =>
        record.id
          ? prev.map((row) => (row.id === record.id ? body : row))
          : [...prev, body],
      );
      setRecord(empty());
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: unknown) {
    if (!confirm("Delete this record?")) return;
    const r = await fetch(`/api/admin/manage/${type}/?id=${id}`, {
      method: "DELETE",
    });
    if (r.ok) {
      setRows(rows.filter((row) => row.id !== id));
      setMessage("Deleted.");
    } else setMessage((await r.json()).error);
  }
  return (
    <>
      {message && (
        <div className="admin-message" role="status">
          {message}
        </div>
      )}
      <div className="admin-panel">
        <h2>{record.id ? "Edit record" : "Add record"}</h2>
        <form onSubmit={submit}>
          <div className="form-grid">
            {Object.entries(model.fields).map(([key, field]) => (
              <label
                key={key}
                className={field === "checkbox" ? "inline-check" : ""}
              >
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase())}
                {field === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(record[key])}
                    onChange={(e) =>
                      setRecord({ ...record, [key]: e.target.checked })
                    }
                  />
                ) : field.includes(",") ? (
                  <select
                    value={String(record[key] || "")}
                    onChange={(e) =>
                      setRecord({ ...record, [key]: e.target.value })
                    }
                  >
                    {field.split(",").map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                ) : field === "textarea" ? (
                  <textarea
                    rows={3}
                    value={String(record[key] || "")}
                    onChange={(e) =>
                      setRecord({ ...record, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    type={field}
                    value={
                      field === "date"
                        ? String(record[key] || "").slice(0, 10)
                        : String(record[key] ?? "")
                    }
                    onChange={(e) =>
                      setRecord({ ...record, [key]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
          </div>
          <div className="button-row">
            <button className="button" disabled={busy}>
              Save record
            </button>
            {Boolean(record.id) && (
              <button
                className="button button-outline"
                type="button"
                onClick={() => setRecord(empty())}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="admin-panel table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {Object.keys(model.fields)
                .slice(0, 5)
                .map((key) => (
                  <th key={key}>{key}</th>
                ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                {Object.keys(model.fields)
                  .slice(0, 5)
                  .map((key) => (
                    <td key={key}>{String(row[key] ?? "")}</td>
                  ))}
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      setRecord(row);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>{" "}
                  <button type="button" onClick={() => remove(row.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="admin-empty">No records yet.</p>}
      </div>
    </>
  );
}
