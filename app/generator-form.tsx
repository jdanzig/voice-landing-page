"use client";

import { useState } from "react";

const tones = ["Professional", "Friendly", "Energetic", "Luxury", "Funny", "Direct", "Inspirational"];
const voices = [
  { id: "rachel", label: "Rachel", note: "Warm narrator" },
  { id: "bella", label: "Bella", note: "Bright creator" },
  { id: "josh", label: "Josh", note: "Confident founder" }
];

export default function GeneratorForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }

    window.location.href = result.previewUrl;
  }

  return (
    <form className="generator-card" onSubmit={onSubmit}>
      <div className="form-header">
        <p className="eyebrow">Generate your page</p>
        <h2>Describe the thing you want people to care about.</h2>
      </div>

      <label>
        <span>Product or project name</span>
        <input name="name" defaultValue="FounderFlow" required />
      </label>

      <label>
        <span>One-sentence description</span>
        <textarea
          name="description"
          defaultValue="A lightweight CRM for startup founders raising seed rounds."
          required
        />
      </label>

      <label>
        <span>Target audience</span>
        <input name="audience" defaultValue="Early-stage founders" required />
      </label>

      <div className="form-grid">
        <label>
          <span>Tone</span>
          <select name="tone" defaultValue="Energetic">
            {tones.map((tone) => (
              <option key={tone}>{tone}</option>
            ))}
          </select>
        </label>

        <label>
          <span>CTA text</span>
          <input name="cta" defaultValue="Join the waitlist" required />
        </label>
      </div>

      <label>
        <span>Optional website URL</span>
        <input name="websiteUrl" placeholder="https://example.com" type="url" />
      </label>

      <fieldset>
        <legend>Voice</legend>
        <div className="voice-options">
          {voices.map((voice) => (
            <label className="voice-choice" key={voice.id}>
              <input
                type="radio"
                name="voiceId"
                value={voice.id}
                defaultChecked={voice.id === "rachel"}
              />
              <span>
                <strong>{voice.label}</strong>
                <small>{voice.note}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {status === "error" ? <p className="error">{error}</p> : null}

      <button className="primary-button" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Generating voice page..." : "Generate voice landing page"}
      </button>
    </form>
  );
}
