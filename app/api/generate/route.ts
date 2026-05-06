import { NextResponse } from "next/server";
import { generateCopy } from "@/lib/copy";
import { createPageId, slugify } from "@/lib/id";
import { generateVoiceover } from "@/lib/voice";
import { initialMetrics, savePage } from "@/lib/storage";
import { GeneratedPage, LandingInput, Tone, VoiceId } from "@/lib/types";

export const runtime = "nodejs";

const tones: Tone[] = [
  "Professional",
  "Friendly",
  "Energetic",
  "Luxury",
  "Funny",
  "Direct",
  "Inspirational"
];

const voiceIds: VoiceId[] = ["rachel", "bella", "josh"];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validate(body: Record<string, unknown>): LandingInput {
  const input = {
    name: asString(body.name),
    description: asString(body.description),
    audience: asString(body.audience),
    tone: tones.includes(body.tone as Tone) ? (body.tone as Tone) : "Energetic",
    cta: asString(body.cta) || "Join the waitlist",
    websiteUrl: asString(body.websiteUrl),
    voiceId: voiceIds.includes(body.voiceId as VoiceId) ? (body.voiceId as VoiceId) : "rachel"
  };

  if (!input.name || !input.description || !input.audience) {
    throw new Error("Product name, description, and audience are required.");
  }

  return input;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = validate(body);
    const id = createPageId(input.name);
    const copy = generateCopy(input);

    let audioUrl: string | undefined;
    let audioProvider: GeneratedPage["audioProvider"] = "browser-fallback";

    try {
      const generatedAudio = await generateVoiceover(copy.voiceoverScript, input.voiceId, id);
      if (generatedAudio) {
        audioUrl = generatedAudio;
        audioProvider = "elevenlabs";
      }
    } catch (error) {
      console.error(error);
    }

    const page: GeneratedPage = {
      id,
      slug: slugify(input.name),
      createdAt: new Date().toISOString(),
      input,
      copy,
      audioUrl,
      audioProvider,
      metrics: initialMetrics()
    };

    await savePage(page);

    return NextResponse.json({
      id,
      previewUrl: `/preview/${id}`,
      dashboardUrl: `/dashboard/${id}`,
      audioProvider
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate page." },
      { status: 400 }
    );
  }
}
