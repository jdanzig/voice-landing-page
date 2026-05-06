import GeneratorForm from "./generator-form";

export default function Home() {
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
        </div>
        <GeneratorForm />
      </section>
    </main>
  );
}
