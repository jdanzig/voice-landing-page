import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/storage";

type Props = {
  params: Promise<{ id: string }>;
};

function percent(part: number, total: number) {
  if (!total) return "0.0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

export default async function DashboardPage({ params }: Props) {
  const { id } = await params;
  const page = await getPage(id);
  if (!page) notFound();

  const metrics = [
    { label: "Page Views", value: page.metrics.pageViews },
    { label: "Audio Plays", value: page.metrics.audioPlays },
    { label: "Audio Play Rate", value: percent(page.metrics.audioPlays, page.metrics.pageViews) },
    { label: "Share Clicks", value: page.metrics.shareClicks },
    { label: "CTA Clicks", value: page.metrics.ctaClicks },
    { label: "CTA Conversion Rate", value: percent(page.metrics.ctaClicks, page.metrics.pageViews) }
  ];

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Analytics</p>
        <h1>{page.input.name}</h1>
        <p>{page.copy.headline}</p>
        <div className="button-row">
          <Link className="secondary-button" href={`/preview/${page.id}`}>
            Open preview
          </Link>
          <Link className="secondary-button" href="/">
            Generate another
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="growth-note">
        <h2>Activation loop</h2>
        <p>
          This page measures the prototype loop: visitors land on the generated artifact,
          play the narrated pitch, share it, and click the creator&apos;s call to action.
        </p>
      </section>
    </main>
  );
}
