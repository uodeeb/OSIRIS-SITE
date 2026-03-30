import fs from "node:fs";
import path from "node:path";

type AssetType = "video_bg" | "image_bg" | "music" | "ambience" | "sfx" | "ui";

type AssetTask = {
  id: string;
  scene: {
    num: string;
    arTitle: string;
    enTitle?: string;
    location?: string;
  };
  type: AssetType;
  suggestedFileName?: string;
  suggestedDbKey?: string;
  prompt?: string;
  notes?: string[];
};

type AssetPlan = {
  generatedAt: string;
  sourceGuidePath: string;
  tasks: AssetTask[];
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

function normalizeSceneNum(num: string) {
  return num.replace(/\s+/g, "").replace(/[.]/g, "_");
}

function stripQuotes(s: string) {
  const t = s.trim();
  if ((t.startsWith("“") && t.endsWith("”")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseSceneHeader(line: string) {
  const m = line.match(/^###\s*Scene\s+(.+?)\s+—\s+(.+?)(?:\s+\((.+?)\))?\s*$/);
  if (!m) return undefined;
  return {
    num: m[1].trim(),
    arTitle: m[2].trim(),
    enTitle: m[3]?.trim() || undefined,
  };
}

function parseGuide(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const scenes: Array<{
    num: string;
    arTitle: string;
    enTitle?: string;
    location?: string;
    assetBullets: string[];
    promptsByKind: Record<string, string[]>;
    notes: string[];
  }> = [];

  let current:
    | {
        num: string;
        arTitle: string;
        enTitle?: string;
        location?: string;
        assetBullets: string[];
        promptsByKind: Record<string, string[]>;
        notes: string[];
      }
    | undefined;

  let mode: "none" | "assets" | "prompt" = "none";
  let currentPromptKind: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const header = parseSceneHeader(line);
    if (header) {
      if (current) scenes.push(current);
      current = {
        ...header,
        assetBullets: [],
        promptsByKind: {},
        notes: [],
      };
      mode = "none";
      currentPromptKind = undefined;
      continue;
    }

    if (!current) continue;

    if (line.startsWith("### ")) {
      continue;
    }

    const loc = line.match(/^- Location:\s*(.+)\s*$/);
    if (loc) {
      current.location = loc[1].trim();
      continue;
    }

    if (line.trim() === "- Assets to generate:") {
      mode = "assets";
      currentPromptKind = undefined;
      continue;
    }

    const promptHeader = line.match(/^- Prompt\s*\((.+?)\):\s*$/);
    if (promptHeader) {
      mode = "prompt";
      currentPromptKind = promptHeader[1].trim();
      current.promptsByKind[currentPromptKind] ||= [];
      continue;
    }

    if (line.trim().startsWith("---")) {
      mode = "none";
      currentPromptKind = undefined;
      continue;
    }

    const bullet = line.match(/^\s*-\s+(.*)$/);
    if (bullet) {
      const value = bullet[1].trim();
      if (mode === "assets") {
        current.assetBullets.push(value);
      } else if (mode === "prompt" && currentPromptKind) {
        current.promptsByKind[currentPromptKind].push(stripQuotes(value));
      } else if (value && value.length) {
        current.notes.push(value);
      }
      continue;
    }
  }

  if (current) scenes.push(current);
  return scenes;
}

function guessTasksForScene(scene: {
  num: string;
  arTitle: string;
  enTitle?: string;
  location?: string;
  assetBullets: string[];
  promptsByKind: Record<string, string[]>;
  notes: string[];
}): AssetTask[] {
  const sceneKey = normalizeSceneNum(scene.num);
  const baseSlug = slugify(scene.enTitle ?? scene.arTitle);

  const promptVideo =
    (scene.promptsByKind["Video BG"]?.[0] ?? scene.promptsByKind["Video"]?.[0]) || undefined;
  const promptMusic = scene.promptsByKind["Music"]?.[0] || undefined;
  const promptSfx = scene.promptsByKind["SFX"]?.[0] || undefined;
  const promptVfx = scene.promptsByKind["VFX overlay"]?.[0] || undefined;

  const wantsVideo = scene.assetBullets.some(b => b.toLowerCase().includes("video bg"));
  const wantsImage = scene.assetBullets.some(b => b.toLowerCase().includes("still") || b.toLowerCase().includes("image"));
  const wantsMusic = scene.assetBullets.some(b => b.toLowerCase().includes("music"));
  const wantsAmb = scene.assetBullets.some(b => b.toLowerCase().includes("ambience") || b.toLowerCase().includes("ambient"));
  const wantsSfx = scene.assetBullets.some(b => b.toLowerCase().includes("sfx"));
  const wantsUi = scene.assetBullets.some(b => b.toLowerCase().includes("ui") || b.toLowerCase().includes("overlay") || b.toLowerCase().includes("transition"));

  const tasks: AssetTask[] = [];

  if (wantsVideo) {
    tasks.push({
      id: `scene_${sceneKey}_video_bg`,
      scene: { num: scene.num, arTitle: scene.arTitle, enTitle: scene.enTitle, location: scene.location },
      type: "video_bg",
      suggestedFileName: `vid_bg_scene_${sceneKey}_${baseSlug || "bg"}.mp4`,
      suggestedDbKey: `videoBg.scene_${sceneKey}`,
      prompt: promptVideo,
      notes: [
        "Loop 6–12s. Keep lower third clean/darker for dialogue UI.",
        "Avoid any watermark/logo in corners (esp. bottom-right).",
      ],
    });
  }

  if (wantsImage) {
    tasks.push({
      id: `scene_${sceneKey}_image_bg`,
      scene: { num: scene.num, arTitle: scene.arTitle, enTitle: scene.enTitle, location: scene.location },
      type: "image_bg",
      suggestedFileName: `bg_scene_${sceneKey}_${baseSlug || "bg"}.png`,
      suggestedDbKey: `backgrounds.scene_${sceneKey}`,
      prompt: undefined,
      notes: ["Still fallback variant; keep lower third darker/cleaner."],
    });
  }

  if (wantsMusic) {
    tasks.push({
      id: `scene_${sceneKey}_music`,
      scene: { num: scene.num, arTitle: scene.arTitle, enTitle: scene.enTitle, location: scene.location },
      type: "music",
      suggestedFileName: `mus_scene_${sceneKey}_${baseSlug || "theme"}.wav`,
      suggestedDbKey: `music.scene_${sceneKey}`,
      prompt: promptMusic,
      notes: ["Provide loopable stem + optional 1–3s intro sting."],
    });
  }

  if (wantsAmb) {
    tasks.push({
      id: `scene_${sceneKey}_ambience`,
      scene: { num: scene.num, arTitle: scene.arTitle, enTitle: scene.enTitle, location: scene.location },
      type: "ambience",
      suggestedFileName: `amb_scene_${sceneKey}_${baseSlug || "amb"}.wav`,
      suggestedDbKey: `amb.scene_${sceneKey}`,
      prompt: undefined,
      notes: ["10–30s seamless loop. Keep subtle under dialogue."],
    });
  }

  if (wantsSfx) {
    tasks.push({
      id: `scene_${sceneKey}_sfx`,
      scene: { num: scene.num, arTitle: scene.arTitle, enTitle: scene.enTitle, location: scene.location },
      type: "sfx",
      suggestedFileName: `sfx_scene_${sceneKey}_${baseSlug || "event"}.wav`,
      suggestedDbKey: `sfx.scene_${sceneKey}`,
      prompt: promptSfx,
      notes: ["Provide discrete one-shots (0.2–2.5s)."],
    });
  }

  if (wantsUi) {
    tasks.push({
      id: `scene_${sceneKey}_ui_fx`,
      scene: { num: scene.num, arTitle: scene.arTitle, enTitle: scene.enTitle, location: scene.location },
      type: "ui",
      suggestedFileName: undefined,
      suggestedDbKey: `ui.scene_${sceneKey}`,
      prompt: promptVfx,
      notes: ["Overlay/transition concept; implement as CSS/Framer Motion or shader later."],
    });
  }

  return tasks;
}

function toMarkdown(plan: AssetPlan) {
  const lines: string[] = [];
  lines.push(`# OSIRIS — Asset Generation Plan`);
  lines.push(``);
  lines.push(`- Generated: ${plan.generatedAt}`);
  lines.push(`- Source: ${plan.sourceGuidePath}`);
  lines.push(`- Tasks: ${plan.tasks.length}`);
  lines.push(``);
  for (const t of plan.tasks) {
    lines.push(`## ${t.scene.num} — ${t.scene.arTitle}${t.scene.enTitle ? ` (${t.scene.enTitle})` : ""}`);
    if (t.scene.location) lines.push(`- Location: ${t.scene.location}`);
    lines.push(`- Type: ${t.type}`);
    if (t.suggestedDbKey) lines.push(`- DB key: ${t.suggestedDbKey}`);
    if (t.suggestedFileName) lines.push(`- File: ${t.suggestedFileName}`);
    if (t.prompt) {
      lines.push(`- Prompt:`);
      lines.push(`  - ${t.prompt}`);
    }
    if (t.notes?.length) {
      lines.push(`- Notes:`);
      for (const n of t.notes) lines.push(`  - ${n}`);
    }
    lines.push(``);
  }
  return lines.join("\n");
}

async function main() {
  const root = process.cwd();
  const guidePath = path.resolve(root, "OSIRIS_ASSET_PROMPT_GUIDE.md");
  const guide = fs.readFileSync(guidePath, "utf8");

  const scenes = parseGuide(guide);
  const tasks = scenes.flatMap(s => guessTasksForScene(s));

  const plan: AssetPlan = {
    generatedAt: new Date().toISOString(),
    sourceGuidePath: guidePath,
    tasks,
  };

  const outDir = path.resolve(root, "generated");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "asset-plan.json"), JSON.stringify(plan, null, 2), "utf8");
  fs.writeFileSync(path.join(outDir, "asset-plan.md"), toMarkdown(plan), "utf8");

  console.log(`Wrote ${tasks.length} tasks to ${path.relative(root, outDir)}/asset-plan.{json,md}`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

