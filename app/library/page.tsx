import Link from "next/link";
import { listPages } from "@/lib/storage";
import DeletePitchButton from "./delete-pitch-button";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export default async function LibraryPage() {
  const pages = await listPages();

  return (
    <main className="library-shell">
      <section className="library-header">
        <p className="eyebrow">Pitch library</p>
        <h1>Your generated voice pages.</h1>
        <p>
          Revisit previews, compare hooks, and jump back into analytics for every
          landing page you have generated on this machine.
        </p>
        <Link className="secondary-button" href="/">
          Generate a new page
        </Link>
      </section>

      {pages.length ? (
        <section className="library-grid" aria-label="Generated pitches">
          {pages.map((page) => (
            <article className="library-card" key={page.id}>
              <div>
                <span>{formatDate(page.createdAt)}</span>
                <h2>{page.input.name}</h2>
                <p>{page.copy.headline}</p>
              </div>

              <dl className="library-metrics">
                <div>
                  <dt>Views</dt>
                  <dd>{page.metrics.pageViews}</dd>
                </div>
                <div>
                  <dt>Listens</dt>
                  <dd>{page.metrics.audioPlays}</dd>
                </div>
                <div>
                  <dt>CTA</dt>
                  <dd>{page.metrics.ctaClicks}</dd>
                </div>
              </dl>

              <div className="button-row">
                <Link className="primary-button" href={`/preview/${page.id}`}>
                  Open preview
                </Link>
                <Link className="secondary-button" href={`/dashboard/${page.id}`}>
                  Analytics
                </Link>
                <DeletePitchButton id={page.id} name={page.input.name} />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-library">
          <h2>No pitches yet</h2>
          <p>Generate your first voice landing page and it will show up here.</p>
        </section>
      )}
    </main>
  );
}
