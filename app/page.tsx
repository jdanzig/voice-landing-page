import Link from "next/link";
import { listPages } from "@/lib/storage";
import GeneratorForm from "./generator-form";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export default async function Home() {
  const recentPages = (await listPages()).slice(0, 3);

  return (
    <main className="home-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ElevenLabs growth prototype</p>
          <h1>Create a voice-powered landing page in under a minute.</h1>
          <p className="hero-text">
            Turn a startup, creator project, newsletter, course, or app idea into a
            polished shareable page with narrated pitch audio and lightweight growth
            metrics.
          </p>
          <div className="proof-row" aria-label="Prototype flow">
            <span>Input</span>
            <span>Voice</span>
            <span>Share</span>
            <span>Measure</span>
          </div>
          <Link className="library-link" href="/library">
            View pitch library
          </Link>
          {recentPages.length ? (
            <section className="recent-pitches" aria-label="Recent generated pitches">
              <div className="recent-pitches-header">
                <span>Recent attempts</span>
                <Link href="/library">Manage all</Link>
              </div>
              <div className="recent-pitch-list">
                {recentPages.map((page) => (
                  <Link className="recent-pitch" href={`/preview/${page.id}`} key={page.id}>
                    <strong>{page.input.name}</strong>
                    <span>{formatDate(page.createdAt)} · {page.metrics.audioPlays} listens</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <GeneratorForm />
      </section>
    </main>
  );
}
