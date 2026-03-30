import { ASSET_URLS } from "../client/src/lib/assetUrls";
import * as db from "./db";

function guessMime(url: string): string | null {
  const clean = url.split("?")[0]?.toLowerCase() ?? "";
  if (clean.endsWith(".mp3")) return "audio/mpeg";
  if (clean.endsWith(".wav")) return "audio/wav";
  if (clean.endsWith(".m4a")) return "audio/mp4";
  if (clean.endsWith(".mp4")) return "video/mp4";
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  if (clean.endsWith(".webp")) return "image/webp";
  return null;
}

async function main() {
  const entries: Array<{ key: string; kind: any; url: string; mime: string | null }> = [];

  (Object.entries(ASSET_URLS.audio) as Array<[string, string]>).forEach(([k, url]) =>
    entries.push({ key: `audio.${k}`, kind: "audio", url, mime: guessMime(url) })
  );
  (Object.entries(ASSET_URLS.video) as Array<[string, string]>).forEach(([k, url]) =>
    entries.push({ key: `video.${k}`, kind: "video", url, mime: guessMime(url) })
  );
  (Object.entries(ASSET_URLS.videoBg) as Array<[string, string]>).forEach(([k, url]) =>
    entries.push({ key: `videoBg.${k}`, kind: "video", url, mime: guessMime(url) })
  );
  (Object.entries(ASSET_URLS.backgrounds) as Array<[string, string]>).forEach(([k, url]) =>
    entries.push({ key: `background.${k}`, kind: "background", url, mime: guessMime(url) })
  );
  (Object.entries(ASSET_URLS.characters) as Array<[string, string]>).forEach(([k, url]) =>
    entries.push({ key: `character.${k}`, kind: "character", url, mime: guessMime(url) })
  );
  (Object.entries(ASSET_URLS.documents) as Array<[string, string]>).forEach(([k, url]) =>
    entries.push({ key: `document.${k}`, kind: "document", url, mime: guessMime(url) })
  );
  (Object.entries(ASSET_URLS.ui) as Array<[string, string]>).forEach(([k, url]) =>
    entries.push({ key: `ui.${k}`, kind: "ui", url, mime: guessMime(url) })
  );

  for (const entry of entries) {
    await db.upsertAsset({
      key: entry.key,
      kind: entry.kind,
      url: entry.url,
      mime: entry.mime,
    });
  }

  console.log(`Seeded ${entries.length} assets`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
