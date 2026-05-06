export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 42);
}

export function createPageId(name: string) {
  const suffix = Math.random().toString(36).slice(2, 8);
  const slug = slugify(name) || "voice-page";
  return `${slug}-${suffix}`;
}
