"use client";
import { useState } from "react";
type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  services: string[];
  description: string;
  budget: string;
  timeline: string;
  status: string;
  notes: string;
  createdAt: string;
};
export function LeadsManager({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [message, setMessage] = useState("");
  return (
    <>
      {message && (
        <p className="admin-message" role="status">
          {message}
        </p>
      )}
      {leads.map((lead) => (
        <details className="admin-panel" key={lead.id}>
          <summary>
            <strong>
              {lead.name} · {lead.company}
            </strong>{" "}
            <span className="status">{lead.status}</span>
            <br />
            <span className="small">
              {lead.projectType} ·{" "}
              {new Date(lead.createdAt).toLocaleDateString()}
            </span>
          </summary>
          <div style={{ marginTop: 25 }}>
            <p>
              <a href={`mailto:${lead.email}`}>{lead.email}</a>{" "}
              {lead.phone && ` · ${lead.phone}`}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{lead.description}</p>
            <p className="small">
              Services: {lead.services.join(", ") || "Not selected"}
              <br />
              Budget: {lead.budget || "Not supplied"} · Timeline:{" "}
              {lead.timeline || "Not supplied"}
            </p>
            <label>
              Status
              <select
                value={lead.status}
                onChange={(e) =>
                  setLeads(
                    leads.map((l) =>
                      l.id === lead.id ? { ...l, status: e.target.value } : l,
                    ),
                  )
                }
              >
                {["NEW", "REVIEWING", "CONTACTED", "QUALIFIED", "CLOSED"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Internal notes
              <textarea
                rows={3}
                value={lead.notes}
                onChange={(e) =>
                  setLeads(
                    leads.map((l) =>
                      l.id === lead.id ? { ...l, notes: e.target.value } : l,
                    ),
                  )
                }
              />
            </label>
            <div className="button-row">
              <button
                className="button button-small"
                onClick={async () => {
                  try {
                    const r = await fetch("/api/admin/leads/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: lead.id,
                        status: lead.status,
                        notes: lead.notes,
                      }),
                    });
                    setMessage(r.ok ? "Lead updated." : "Unable to save.");
                  } catch {
                    setMessage("Unable to connect.");
                  }
                }}
              >
                Save changes
              </button>
              <button
                className="button button-outline button-small"
                onClick={async () => {
                  if (
                    !confirm(
                      "Permanently delete this enquiry and its personal information?",
                    )
                  )
                    return;
                  const r = await fetch(`/api/admin/leads/?id=${lead.id}`, {
                    method: "DELETE",
                  });
                  if (r.ok) setLeads(leads.filter((l) => l.id !== lead.id));
                  else setMessage("Unable to delete.");
                }}
              >
                Delete enquiry
              </button>
            </div>
          </div>
        </details>
      ))}
      {!leads.length && (
        <div className="admin-panel">
          <p>No enquiries yet.</p>
        </div>
      )}
    </>
  );
}
