import { promises as fs } from "fs";
import path from "path";
import { VoiceId } from "./types";

export const voices: Record<VoiceId, { label: string; elevenLabsId: string; style: string }> = {
  rachel: {
    label: "Rachel",
    elevenLabsId: "21m00Tcm4TlvDq8ikWAM",
    style: "Warm narrator"
  },
  bella: {
    label: "Bella",
    elevenLabsId: "EXAVITQu4vr4xnSDxMaL",
    style: "Bright creator"
  },
  josh: {
    label: "Josh",
    elevenLabsId: "TxGEqnHWrfWFTfGW9XjX",
    style: "Confident founder"
  }
};

export async function generateVoiceover(script: string, voiceId: VoiceId, pageId: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const voice = voices[voiceId] ?? voices.rachel;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice.elevenLabsId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg"
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.42,
          similarity_boost: 0.78,
          style: 0.35,
          use_speaker_boost: true
        }
      })
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`ElevenLabs request failed: ${response.status} ${message}`);
  }

  const audio = Buffer.from(await response.arrayBuffer());
  const audioDir = path.join(process.cwd(), "public", "audio");
  await fs.mkdir(audioDir, { recursive: true });
  const filename = `${pageId}.mp3`;
  await fs.writeFile(path.join(audioDir, filename), audio);
  return `/audio/${filename}`;
}
