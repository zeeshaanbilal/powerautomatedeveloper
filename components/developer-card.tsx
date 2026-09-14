import Image from "next/image";
import Link from "./safe-link";
import type { Entry } from "@/lib/types";

export function DeveloperCard({ entry }: { entry: Entry }) {
  return (
    <article className="developer-card">
      <Link
        href={`/${entry.slug}/`}
        className="developer-portrait"
        aria-label={`View ${entry.title}'s profile`}
      >
        {entry.featuredImage ? (
          <Image
            src={entry.featuredImage}
            alt={entry.imageAlt || `Portrait of ${entry.title}`}
            width={600}
            height={720}
            sizes="(max-width: 767px) 100vw, (max-width: 1190px) 50vw, 33vw"
            unoptimized={!entry.featuredImage.startsWith("/")}
          />
        ) : (
          <div className="portrait-placeholder">
            <svg viewBox="0 0 240 280" fill="none" aria-hidden="true">
              <circle cx="120" cy="94" r="47" fill="#adc5ed" />
              <path
                d="M28 280v-38c0-62 41-97 92-97s92 35 92 97v38"
                fill="#adc5ed"
              />
            </svg>
            <span>Portrait coming soon</span>
          </div>
        )}
        <span className="portrait-link" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="developer-card-body">
        <p className="developer-role">
          {entry.data.role || "Automation Team Member"}
        </p>
        <h3>
          <Link href={`/${entry.slug}/`}>{entry.title}</Link>
        </h3>
        <p className="developer-bio">{entry.excerpt}</p>
        {!!entry.data.skills?.length && (
          <ul className="developer-skills" aria-label="Skills">
            {entry.data.skills.slice(0, 4).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        )}
        <div className="developer-actions">
          <Link href={`/${entry.slug}/`} className="text-link">
            View profile <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DeveloperSection({ entries }: { entries: Entry[] }) {
  const people = entries.filter((entry) =>
    ["DEVELOPER", "TEAM"].includes(entry.kind),
  );
  if (!people.length) return null;
  return (
    <section className="container section hiring-developers">
      <div className="section-heading">
        <div>
          <span className="eyebrow">The people behind your workflows</span>
          <h2>Meet the HASHTURN team.</h2>
        </div>
        <Link href="/developers/" className="text-link">
          Explore the team ↗
        </Link>
      </div>
      <div className="developer-grid">
        {people.slice(0, 3).map((entry) => (
          <DeveloperCard key={entry.id} entry={entry} />
        ))}
      </div>
      <div className="button-row">
        <Link href="/contact/" className="button" data-conversion="hire_team_cta">
          Discuss Your Project
        </Link>
      </div>
    </section>
  );
}
