"use client";
import { useEffect, useState } from "react";
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(name: string) {
  if (localStorage.getItem("hashturn-analytics") === "yes")
    window.gtag?.("event", name, { event_category: "engagement" });
}
export function Analytics({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const activate = () => {
      if (
        !/^G-[A-Z0-9]+$/.test(id) ||
        document.getElementById("ga-script") ||
        localStorage.getItem("hashturn-analytics") !== "yes"
      )
        return;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", id, { send_page_view: false });
      const s = document.createElement("script");
      s.id = "ga-script";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
    };
    activate();
    if (id && !localStorage.getItem("hashturn-analytics")) setOpen(true);
    const preference = () => setOpen(true);
    const button = document.getElementById("analytics-preferences");
    button?.addEventListener("click", preference);
    const click = (e: MouseEvent) => {
      const element = (e.target as Element).closest("[data-conversion]");
      const event = element?.getAttribute("data-conversion");
      if (event) track(event);
    };
    document.addEventListener("click", click);
    return () => {
      button?.removeEventListener("click", preference);
      document.removeEventListener("click", click);
    };
  }, [id]);
  function choose(allow: boolean) {
    localStorage.setItem("hashturn-analytics", allow ? "yes" : "no");
    if (!allow) {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      document.cookie.split(";").forEach((c) => {
        const name = c.trim().split("=")[0];
        if (name.startsWith("_ga")) {
          document.cookie = `${name}=; Max-Age=0; path=/`;
          document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;
        }
      });
    }
    setOpen(false);
    location.reload();
  }
  return open ? (
    <aside className="consent" aria-label="Analytics preferences">
      <strong>Optional analytics</strong>
      <p>
        {id
          ? "Help us understand which services interest visitors. We only enable analytics with your permission and do not send form contents."
          : "Optional analytics is currently disabled."}
      </p>
      <div className="button-row">
        <button className="button" onClick={() => choose(false)}>
          Essential only
        </button>
        {id && (
          <button
            className="button button-outline"
            onClick={() => choose(true)}
          >
            Allow analytics
          </button>
        )}
      </div>
      <a href="/cookie-policy/">Cookie policy</a>
    </aside>
  ) : null;
}
