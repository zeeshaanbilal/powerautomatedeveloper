"use client";
import { useState } from "react";
import Link from "next/link";

export type ContentListItem = {
  id: string;
  title: string;
  slug: string;
  kind: string;
  statusString: string;
  sortOrder: number;
};

export function SortableContentList({ initialEntries }: { initialEntries: ContentListItem[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Only show the save button if the order actually changed
  const hasChanges = JSON.stringify(entries.map(e => e.id)) !== JSON.stringify(initialEntries.map(e => e.id));

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newEntries = [...entries];
    const draggedEntry = newEntries[draggedIdx];
    newEntries.splice(draggedIdx, 1);
    newEntries.splice(index, 0, draggedEntry);
    setDraggedIdx(index);
    setEntries(newEntries);
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    setMessage("");
    try {
      const updates = entries.map((e, index) => ({ id: e.id, sortOrder: index }));
      const res = await fetch("/api/admin/reorder/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error("Failed to save order");
      
      // Update local sortOrders
      setEntries(entries.map((e, index) => ({ ...e, sortOrder: index })));
      setMessage("Order saved successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to save new order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {hasChanges && (
        <div style={{ marginBottom: "15px", display: "flex", gap: "15px", alignItems: "center" }}>
          <button onClick={saveOrder} className="button button-small" disabled={saving}>
            {saving ? "Saving..." : "Save New Order"}
          </button>
          {message && <span style={{ color: "var(--teal)", fontSize: "14px" }}>{message}</span>}
          <span style={{ fontSize: "14px", color: "var(--muted)" }}>You have unsaved order changes.</span>
        </div>
      )}
      {!hasChanges && message && (
        <div style={{ marginBottom: "15px", color: "var(--teal)", fontSize: "14px" }}>
          {message}
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: "30px" }}></th>
            <th>Title / path</th>
            <th>Type</th>
            <th>Status</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, index) => (
            <tr 
              key={e.id}
              draggable
              onDragStart={(evt) => onDragStart(evt, index)}
              onDragOver={(evt) => onDragOver(evt, index)}
              onDragEnd={onDragEnd}
              style={{
                cursor: "grab",
                opacity: draggedIdx === index ? 0.5 : 1,
                backgroundColor: draggedIdx === index ? "rgba(0,0,0,0.02)" : "transparent"
              }}
            >
              <td style={{ cursor: "grab", color: "var(--muted)" }}>☰</td>
              <td>
                <Link href={`/admin/content/${e.id}/`}>{e.title}</Link>
                <br />
                <span className="small muted">
                  /{e.slug}
                  {e.slug ? "/" : ""}
                </span>
              </td>
              <td>{e.kind}</td>
              <td>
                <span className="status">
                  {e.statusString}
                </span>
              </td>
              <td>{hasChanges ? index : e.sortOrder}</td>
              <td>
                <Link href={`/admin/content/${e.id}/`}>Edit</Link> ·{" "}
                <Link href={`/admin/preview/${e.id}/`}>Preview</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!entries.length && (
        <p className="admin-empty">
          No content yet. Create a draft to get started.
        </p>
      )}
    </>
  );
}
