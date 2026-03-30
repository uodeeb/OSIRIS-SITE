import fs from "node:fs";
import path from "node:path";
import { SCENES } from "../client/src/lib/sceneSystem";
import { ASSET_URLS } from "../client/src/lib/assetUrls";

type GuideScene = {
  num: string;
  arTitle: string;
  promptVideo?: string;
};

function parseGuide(markdown: string): GuideScene[] {
  const lines = markdown.split(/\r?\n/);
  const scenes: GuideScene[] = [];

  let current: GuideScene | undefined;
  let inPromptVideo = false;

  for (const line of lines) {
    const header = line.match(/^###\s*Scene\s+(.+?)\s+—\s+(.+?)(?:\s+\(.+?\))?\s*$/);
    if (header) {
      if (current) scenes.push(current);
      current = { num: header[1].trim(), arTitle: header[2].trim() };
      inPromptVideo = false;
      continue;
    }

    if (!current) continue;

    if (line.match(/^- Prompt\s*\(Video BG\):\s*$/)) {
      inPromptVideo = true;
      continue;
    }

    if (line.startsWith("- Prompt (") && !line.includes("Video BG")) {
      inPromptVideo = false;
      continue;
    }

    const bullet = line.match(/^\s*-\s+“(.+)”\s*$/) || line.match(/^\s*-\s+"(.+)"\s*$/) || line.match(/^\s*-\s+(.+)\s*$/);
    if (inPromptVideo && bullet) {
      const p = bullet[1].trim();
      if (p && !current.promptVideo) current.promptVideo = p;
    }
  }

  if (current) scenes.push(current);
  return scenes;
}

function buildUrlToKeyMap(category: "backgrounds" | "videoBg" | "audio" | "ui") {
  const root = (ASSET_URLS as any)[category] as Record<string, string>;
  const map = new Map<string, string>();
  if (!root || typeof root !== "object") return map;
  for (const [k, v] of Object.entries(root)) {
    if (typeof v !== "string") continue;
    map.set(v, `${category}.${k}`);
  }
  return map;
}

async function fetchImage(prompt: string, width: number, height: number) {
  const base = process.env.POLLINATIONS_IMAGE_BASE ?? "https://image.pollinations.ai";
  const url =
    `${base}/prompt/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&model=flux`;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`Pollinations image failed: ${res.status} ${res.statusText}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (attempt === maxAttempts) throw e;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error("Pollinations image failed");
}

async function main() {
  const root = process.cwd();
  const guidePath = path.resolve(root, "OSIRIS_ASSET_PROMPT_GUIDE.md");
  const guide = fs.readFileSync(guidePath, "utf8");

  const guideScenes = parseGuide(guide);
  const byArabicTitle = new Map<string, GuideScene>();
  for (const s of guideScenes) byArabicTitle.set(s.arTitle, s);

  const bgMap = buildUrlToKeyMap("backgrounds");

  const outDir = path.resolve(root, "generated-assets");
  fs.mkdirSync(outDir, { recursive: true });

  const overrides: Record<string, string> = {};
  const skipped: string[] = [];

  const width = 1920;
  const height = 1080;

  for (const scene of Object.values(SCENES)) {
    const ref = byArabicTitle.get(scene.arabicTitle);
    if (!ref?.promptVideo) continue;

    if (scene.backgroundImage) {
      const key = bgMap.get(scene.backgroundImage);
      if (!key) continue;

      const fileName = `bg_${key.replace(/[.]/g, "_")}.png`;
      const filePath = path.join(outDir, fileName);
      if (!fs.existsSync(filePath)) {
        const buf = await fetchImage(ref.promptVideo, width, height);
        fs.writeFileSync(filePath, buf);
      }
      overrides[key] = `/generated-assets/${encodeURI(fileName)}`;
      continue;
    }

    if (scene.backgroundVideo) {
      skipped.push(`${scene.id} (${scene.arabicTitle}) video_bg`);
    }
  }

  fs.writeFileSync(path.join(outDir, "overrides.json"), JSON.stringify(overrides, null, 2), "utf8");
  fs.writeFileSync(path.join(outDir, "skipped.txt"), skipped.join("\n"), "utf8");

  console.log(
    `Generated ${Object.keys(overrides).length} background overrides from guide prompts. Skipped ${skipped.length} video scenes.`
  );
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
