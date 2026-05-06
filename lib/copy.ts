import { LandingCopy, LandingInput } from "./types";

const toneVerbs: Record<string, string[]> = {
  Professional: ["Streamline", "Organize", "Build confidence in"],
  Friendly: ["Make", "Simplify", "Bring clarity to"],
  Energetic: ["Launch", "Move faster with", "Turn momentum into"],
  Luxury: ["Elevate", "Refine", "Create a premium path for"],
  Funny: ["Stop wrestling with", "Finally tame", "Give yourself a break from"],
  Direct: ["Fix", "Improve", "Take control of"],
  Inspirational: ["Unlock", "Create momentum for", "Bring your vision to"]
};

const outcomeByTone: Record<string, string> = {
  Professional: "with a clearer, more reliable workflow.",
  Friendly: "without adding another complicated tool to your day.",
  Energetic: "so every next step feels obvious and achievable.",
  Luxury: "with a refined experience designed to feel effortless.",
  Funny: "before the sticky notes stage a full rebellion.",
  Direct: "so you can focus on outcomes instead of busywork.",
  Inspirational: "and turn intent into visible progress."
};

function sentenceCase(value: string) {
  const trimmed = value.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function compactDescription(description: string) {
  return description.trim().replace(/\.$/, "");
}

function sentenceFragment(value: string) {
  const trimmed = value.trim();
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function audienceHeadline(audience: string, verb: string) {
  const normalizedAudience = audience.toLowerCase();
  return `${verb} the next big step for ${normalizedAudience}.`;
}

export function generateCopy(input: LandingInput): LandingCopy {
  const verbs = toneVerbs[input.tone] ?? toneVerbs.Professional;
  const description = compactDescription(input.description);
  const descriptionFragment = sentenceFragment(description);
  const audience = input.audience.trim();
  const primaryVerb = verbs[0];
  const outcome = outcomeByTone[input.tone] ?? outcomeByTone.Professional;

  const headline =
    input.tone === "Direct"
      ? `${sentenceCase(input.name)} helps ${audience.toLowerCase()} move faster.`
      : audienceHeadline(audience, primaryVerb);

  const subheadline = `${input.name} is ${descriptionFragment}, built for ${audience.toLowerCase()} who want to move from idea to traction ${outcome}`;

  const voiceoverScript = [
    `Meet ${input.name}.`,
    `It is ${descriptionFragment}.`,
    `If you are ${audience.toLowerCase()}, you already know how much time gets lost between a good idea and a clear next action.`,
    `${input.name} gives you a sharper way to explain the offer, earn attention, and invite people to take the next step.`,
    `In less than a minute, you can turn the pitch into something polished, memorable, and ready to share.`,
    `Click "${input.cta.trim()}" today, and see how quickly the right message can start working for you.`
  ].join(" ");

  return {
    headline,
    subheadline,
    voiceoverScript,
    cta: input.cta.trim(),
    alternateHooks: [
      `${verbs[1]} ${audience.toLowerCase()} growth.`,
      `${sentenceCase(input.name)} turns your pitch into momentum.`,
      `${verbs[2]} ${descriptionFragment}.`
    ]
  };
}
