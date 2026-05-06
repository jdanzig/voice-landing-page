import { promises as fs } from "fs";
import path from "path";
import { GeneratedPage, Metrics, TrackEvent } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "pages.json");

type Store = Record<string, GeneratedPage>;

const emptyMetrics: Metrics = {
  pageViews: 0,
  audioPlays: 0,
  shareClicks: 0,
  ctaClicks: 0
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify({}, null, 2));
  }
}

async function readStore(): Promise<Store> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw || "{}") as Store;
}

async function writeStore(store: Store) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2));
}

export function initialMetrics(): Metrics {
  return { ...emptyMetrics };
}

export async function savePage(page: GeneratedPage) {
  const store = await readStore();
  store[page.id] = page;
  await writeStore(store);
}

export async function getPage(id: string) {
  const store = await readStore();
  return store[id] ?? null;
}

export async function listPages() {
  const store = await readStore();
  return Object.values(store).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function deletePage(id: string) {
  const store = await readStore();
  const page = store[id];
  if (!page) return false;

  delete store[id];
  await writeStore(store);

  if (page.audioUrl?.startsWith("/audio/")) {
    const audioPath = path.join(process.cwd(), "public", page.audioUrl);
    try {
      await fs.unlink(audioPath);
    } catch {
      // Audio may already be gone; the page record is the source of truth.
    }
  }

  return true;
}

export async function trackEvent(id: string, event: TrackEvent) {
  const store = await readStore();
  const page = store[id];
  if (!page) return null;

  if (event === "page_view") page.metrics.pageViews += 1;
  if (event === "audio_play") page.metrics.audioPlays += 1;
  if (event === "share_click") page.metrics.shareClicks += 1;
  if (event === "cta_click") page.metrics.ctaClicks += 1;

  await writeStore(store);
  return page.metrics;
}
