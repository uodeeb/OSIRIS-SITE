import fs from "node:fs";
import path from "node:path";

type AssetTask = {
  type: string;
  suggestedFileName?: string;
  suggestedDbKey?: string;
  scene?: {
    num?: string;
  };
};

type AssetPlan = {
  tasks: AssetTask[];
};

const VIDEO_BG_KEY_BY_SCENE_NUM: Record<string, string> = {
  "1.1": "videoBg.yahya_room",
  "1.2": "videoBg.cosmic_opening",
  "1.5.4": "videoBg.tarek_rooftop",
  "4.1": "videoBg.sinai_desert",
  "4.2": "videoBg.molten_gold",
  "6ب.1": "videoBg.nicaea",
  "8.1": "videoBg.andalusia",
  "8.2": "videoBg.abu_abdullah_tears",
  "8ب.1": "videoBg.berlin_1933",
  "10.1": "videoBg.karbala",
  "11.1": "videoBg.digital_space",
  "11.2": "videoBg.enter_key",
  "12.1": "videoBg.enter_key",
};

function main() {
  const root = process.cwd();
  const planPath = path.resolve(root, "generated", "asset-plan.json");
  const plan = JSON.parse(fs.readFileSync(planPath, "utf8")) as AssetPlan;

  const outDir = path.resolve(root, "generated-assets");
  fs.mkdirSync(outDir, { recursive: true });

  const overrides: Record<string, string> = {};

  for (const task of plan.tasks) {
    if (!task.suggestedFileName) continue;
    const filePath = path.join(outDir, task.suggestedFileName);
    if (!fs.existsSync(filePath)) continue;
    const url = `/generated-assets/${encodeURI(task.suggestedFileName)}`;

    if (task.type === "video_bg") {
      const sceneNum = task.scene?.num;
      if (sceneNum && VIDEO_BG_KEY_BY_SCENE_NUM[sceneNum]) {
        overrides[VIDEO_BG_KEY_BY_SCENE_NUM[sceneNum]] = url;
        continue;
      }
    }

    if (task.suggestedDbKey) {
      overrides[task.suggestedDbKey] = url;
    }
  }

  const outPath = path.join(outDir, "overrides.json");
  fs.writeFileSync(outPath, JSON.stringify(overrides, null, 2), "utf8");
  console.log(`Wrote ${Object.keys(overrides).length} overrides to ${path.relative(root, outPath)}`);
}

main();
