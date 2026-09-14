"use client";
import { useEffect, useState } from "react";
import { track } from "./tracking";
export function ContactForm() {
  const [challenge, setChallenge] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    fetch("/api/contact/")
      .then((r) => r.json())
      .then((d) => {
        if (d.challenge) setChallenge(d.challenge);
        else
          setMessage(
            d.error ||
              "Enquiries are temporarily unavailable. Please try again later.",
          );
      })
      .catch(() => setMessage("Unable to connect. Please try again later."));
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const fd = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fd),
          services: fd.getAll("services"),
          challenge,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDone(true);
        track("contact_form_submission");
      } else setMessage(data.error || "Please check the form and try again.");
    } catch {
      setMessage("Your enquiry could not be sent. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="success-panel" role="status">
        <span aria-hidden="true">✓</span>
        <h2>Your enquiry has been received.</h2>
        <p>
          Thank you for sharing your project. The HashTurn team can now review
          your requirements.
        </p>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Name
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
          />
        </label>
        <label>
          Business / company
          <input
            name="company"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={150}
          />
        </label>
        <label>
          Work email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Phone <span>(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <label>
        What kind of help do you need?
        <select name="projectType" required defaultValue="">
          <option value="" disabled>
            Select a project type
          </option>
          {[
            "New automation project",
            "Improve existing workflows",
            "Hire a developer",
            "Hire a team",
            "Consulting or assessment",
            "Ongoing support",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>Services you’re interested in</legend>
        <div className="checkbox-grid">
          {[
            "Power Automate",
            "Power Apps",
            "SharePoint",
            "Dataverse",
            "API integrations",
            "AI automation",
          ].map((s) => (
            <label key={s}>
              <input type="checkbox" name="services" value={s} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Tell us about your process
        <textarea
          name="description"
          rows={6}
          required
          minLength={20}
          maxLength={10000}
          placeholder="What happens today, which systems are involved, and what would you like to improve?"
        />
      </label>
      <div className="form-grid">
        <label>
          Budget <span>(optional)</span>
          <input name="budget" maxLength={100} />
        </label>
        <label>
          Timeline <span>(optional)</span>
          <input name="timeline" maxLength={100} />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="small muted">
        Your details are used to review and respond to your enquiry. Please do
        not include confidential records. Read our{" "}
        <a href="/privacy-policy/">privacy information</a>.
      </p>
      {message && (
        <p role="alert" className="form-error">
          {message}
        </p>
      )}
      <button className="button" disabled={busy || !challenge}>
        {busy ? "Sending…" : "Discuss Your Automation Project"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
