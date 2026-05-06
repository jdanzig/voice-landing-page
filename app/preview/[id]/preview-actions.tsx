"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GeneratedPage, TrackEvent } from "@/lib/types";

type Props = {
  page: GeneratedPage;
};

function track(id: string, event: TrackEvent) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, event }),
    keepalive: true
  }).catch(() => undefined);
}

export default function PreviewActions({ page }: Props) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const hasTrackedPlay = useRef(false);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/preview/${page.id}`;
    return `${window.location.origin}/preview/${page.id}`;
  }, [page.id]);

  useEffect(() => {
    track(page.id, "page_view");
  }, [page.id]);

  function onAudioPlay() {
    if (hasTrackedPlay.current) return;
    hasTrackedPlay.current = true;
    track(page.id, "audio_play");
  }

  function playFallbackSpeech() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(page.copy.voiceoverScript);
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    onAudioPlay();
    window.speechSynthesis.speak(utterance);
  }

  async function sharePage() {
    track(page.id, "share_click");
    if (navigator.share) {
      await navigator.share({
        title: page.copy.headline,
        text: page.copy.subheadline,
        url: shareUrl
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function onCtaClick() {
    track(page.id, "cta_click");
    if (page.input.websiteUrl) {
      window.location.href = page.input.websiteUrl;
    }
  }

  return (
    <div className="action-stack">
      <div className="audio-card">
        <div>
          <span className="audio-label">Narrated pitch</span>
          <strong>{page.audioProvider === "elevenlabs" ? "Ready to play" : "Browser voice preview"}</strong>
        </div>
        {page.audioUrl ? (
          <audio controls onPlay={onAudioPlay} src={page.audioUrl}>
            Your browser does not support audio playback.
          </audio>
        ) : (
          <button className="secondary-button" onClick={playFallbackSpeech} type="button">
            {speaking ? "Playing..." : "Play voice pitch"}
          </button>
        )}
      </div>

      <div className="button-row">
        <button className="primary-button" onClick={onCtaClick} type="button">
          {page.copy.cta}
        </button>
        <button className="secondary-button" onClick={sharePage} type="button">
          {copied ? "Copied link" : "Share page"}
        </button>
      </div>
    </div>
  );
}
