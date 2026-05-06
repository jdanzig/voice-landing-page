export type Tone =
  | "Professional"
  | "Friendly"
  | "Energetic"
  | "Luxury"
  | "Funny"
  | "Direct"
  | "Inspirational";

export type VoiceId = "rachel" | "bella" | "josh";

export type LandingInput = {
  name: string;
  description: string;
  audience: string;
  tone: Tone;
  cta: string;
  websiteUrl?: string;
  voiceId: VoiceId;
};

export type LandingCopy = {
  headline: string;
  subheadline: string;
  voiceoverScript: string;
  cta: string;
  alternateHooks: string[];
};

export type Metrics = {
  pageViews: number;
  audioPlays: number;
  shareClicks: number;
  ctaClicks: number;
};

export type GeneratedPage = {
  id: string;
  slug: string;
  createdAt: string;
  input: LandingInput;
  copy: LandingCopy;
  audioUrl?: string;
  audioProvider: "elevenlabs" | "browser-fallback";
  metrics: Metrics;
};

export type TrackEvent = "page_view" | "audio_play" | "share_click" | "cta_click";
