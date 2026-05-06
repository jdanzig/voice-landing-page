import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/storage";
import { TrackEvent } from "@/lib/types";

export const runtime = "nodejs";

const events: TrackEvent[] = ["page_view", "audio_play", "share_click", "cta_click"];

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: string; event?: TrackEvent };

  if (!body.id || !body.event || !events.includes(body.event)) {
    return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  }

  const metrics = await trackEvent(body.id, body.event);
  if (!metrics) {
    return NextResponse.json({ error: "Page not found." }, { status: 404 });
  }

  return NextResponse.json({ metrics });
}
