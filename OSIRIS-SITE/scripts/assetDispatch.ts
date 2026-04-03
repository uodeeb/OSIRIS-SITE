import fs from "node:fs";
import path from "node:path";

type AssetType = "video_bg" | "image_bg" | "music" | "ambience" | "sfx" | "ui";

type AssetTask = {
  id: string;
  type: AssetType;
  suggestedFileName?: string;
  prompt?: string;
};

type AssetPlan = {
  tasks: AssetTask[];
};

type GeneratorResponse = {
  url?: string;
  base64?: string;
};

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = timeoutMs > 0 ? new AbortController() : undefined;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
  try {
    const res = await fetch(url, { ...init, signal: controller?.signal });
    return res;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function main() {
  const endpoint = process.env.ASSET_GEN_ENDPOINT;
  const apiKey = process.env.ASSET_GEN_API_KEY;
  const timeoutMs = parseInt(process.env.ASSET_GEN_TIMEOUT_MS ?? "60000", 10);

  if (!endpoint) {
    console.error("Missing ASSET_GEN_ENDPOINT env var");
    process.exitCode = 1;
    return;
  }

  const root = process.cwd();
  const planPath = path.resolve(root, "generated", "asset-plan.json");
  const plan = JSON.parse(fs.readFileSync(planPath, "utf8")) as AssetPlan;

  const outDir = path.resolve(root, "generated-assets");
  fs.mkdirSync(outDir, { recursive: true });

  const tasks = plan.tasks.filter(t => t.prompt && t.suggestedFileName);
  if (!tasks.length) {
    console.log("No tasks with prompts+filenames. Generate plan first, then add prompts.");
    return;
  }

  for (const task of tasks) {
    const filePath = path.join(outDir, task.suggestedFileName!);
    if (fs.existsSync(filePath)) {
      console.log(`Skip existing: ${task.id} -> ${path.relative(root, filePath)}`);
      continue;
    }

    const payload = {
      id: task.id,
      type: task.type,
      prompt: task.prompt,
      fileName: task.suggestedFileName,
    };

    const res = await fetchWithTimeout(
      endpoint,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
      },
      timeoutMs
    );

    if (!res.ok) {
      console.error(`Failed ${task.id}: ${res.status} ${res.statusText}`);
      const txt = await res.text().catch(() => "");
      if (txt) console.error(txt.slice(0, 800));
      continue;
    }

    const json = (await res.json().catch(() => null)) as GeneratorResponse | null;
    if (!json) {
      console.error(`Bad JSON response for ${task.id}`);
      continue;
    }

    if (json.base64) {
      fs.writeFileSync(filePath, Buffer.from(json.base64, "base64"));
      console.log(`Wrote: ${path.relative(root, filePath)}`);
      continue;
    }

    if (json.url) {
      const fileRes = await fetchWithTimeout(json.url, { method: "GET" }, timeoutMs);
      if (!fileRes.ok) {
        console.error(`Failed download ${task.id}: ${fileRes.status} ${fileRes.statusText}`);
        continue;
      }
      const buf = Buffer.from(await fileRes.arrayBuffer());
      fs.writeFileSync(filePath, buf);
      console.log(`Wrote: ${path.relative(root, filePath)}`);
      continue;
    }

    console.error(`No url/base64 in response for ${task.id}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

