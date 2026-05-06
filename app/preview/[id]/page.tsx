import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/storage";
import PreviewActions from "./preview-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PreviewPage({ params }: Props) {
  const { id } = await params;
  const page = await getPage(id);
  if (!page) notFound();

  return (
    <main className="preview-shell">
      <section className="preview-hero">
        <div className="preview-content">
          <p className="eyebrow">{page.input.name}</p>
          <h1>{page.copy.headline}</h1>
          <p className="preview-subheadline">{page.copy.subheadline}</p>

          <PreviewActions page={page} />
        </div>

        <aside className="pitch-panel" aria-label="Voice pitch script">
          <div className="panel-topline">
            <span>45-60 sec pitch</span>
            <span>{page.audioProvider === "elevenlabs" ? "ElevenLabs audio" : "Demo speech"}</span>
          </div>
          <p>{page.copy.voiceoverScript}</p>
          <div className="hook-list">
            {page.copy.alternateHooks.map((hook) => (
              <span key={hook}>{hook}</span>
            ))}
          </div>
        </aside>
      </section>

      <footer className="preview-footer">
        <span>Generated with ElevenLabs</span>
        <Link href={`/dashboard/${page.id}`}>View analytics</Link>
      </footer>
    </main>
  );
}
