"use client";

import { useState } from "react";
import type { Entry } from "@/lib/types";
import Link from "next/link";
import "./services-master-detail.css";
import { ServiceIcon } from "./service-icon";

const publicPath = (slug: string) => (slug ? `/${slug}/` : "/");

export function ServicesMasterDetail({ entries }: { entries: Entry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!entries || entries.length === 0) return null;

  const activeEntry = entries[activeIndex];

  return (
    <div className="services-master-detail">
      <div className="smd-sidebar">
        {entries.map((entry, index) => (
          <button
            key={entry.id}
            className={`smd-tab ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {entry.title}
          </button>
        ))}
      </div>
      <div className="smd-content">
        <div className="smd-icon-box">
          <ServiceIcon slug={activeEntry.slug} />
        </div>
        <h3 className="smd-title">{activeEntry.title}</h3>
        <p className="smd-desc">{activeEntry.excerpt}</p>
        <Link href={publicPath(activeEntry.slug)} className="smd-button">
          Explore Service <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
