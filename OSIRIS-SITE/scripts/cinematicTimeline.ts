import fs from "node:fs";
import path from "node:path";
import { INITIAL_SCENE_ID, SCENES, type Scene } from "../client/src/lib/sceneSystem";

function msToClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function pickNext(scene: Scene) {
  if (scene.choices && scene.choices.length) {
    return scene.choices[0].nextSceneId || scene.defaultNextScene;
  }
  return scene.defaultNextScene;
}

function walkTimeline() {
  const order: string[] = [];
  const seen = new Set<string>();
  let id: string | undefined = INITIAL_SCENE_ID;
  let guard = 0;
  while (id && guard++ < 200) {
    if (seen.has(id)) break;
    seen.add(id);
    order.push(id);
    const s = SCENES[id];
    if (!s) break;
    id = pickNext(s);
  }
  return order;
}

function suggestBeats(text: string) {
  const t = text.toLowerCase();
  const beats: string[] = [];

  if (t.includes("warning") || t.includes("تحذير")) beats.push("alarm_pulse", "ui_red_flash", "micro_shake");
  if (t.includes("enter") || (t.includes("ضغط") && t.includes("enter"))) beats.push("white_flash", "glitch_burst", "ui_focus");
  if (t.includes("explod") || t.includes("انفجر")) beats.push("impact_flash", "shake", "smoke_overlay");
  if (t.includes("crimson") || t.includes("red") || t.includes("الأحمر") || t.includes("الاحمر")) beats.push("red_flash");
  if (t.includes("osiris") || t.includes("أوزيريس") || t.includes("اوزيريس")) beats.push("scanline_pulse");
  if (t.includes("notification") || t.includes("إشعار") || t.includes("اشعار")) beats.push("notif_swarm_overlay");
  if (t.includes("algorithm") || t.includes("خوارزم")) beats.push("subtle_code_overlay");

  return Array.from(new Set(beats));
}

function sceneHeader(sceneId: string, s: Scene) {
  return `## ${sceneId} — ${s.arabicTitle}${s.title ? ` (${s.title})` : ""}`;
}

function main() {
  const root = process.cwd();
  const outPath = path.resolve(root, "OSIRIS_CINEMATIC_TIMELINE.md");

  const order = walkTimeline();
  const lines: string[] = [];
  lines.push("# OSIRIS — Cinematic Timeline Guide");
  lines.push("");
  lines.push("- This file is auto-generated from sceneSystem dialogue timing.");
  lines.push("- Use it to decide where to swap BG, trigger FX, and align audio stings.");
  lines.push("");

  for (const sceneId of order) {
    const s = SCENES[sceneId];
    if (!s) continue;

    lines.push(sceneHeader(sceneId, s));
    lines.push(`- Part: ${s.part}`);
    if (s.backgroundVideo) lines.push(`- BG video: ${s.backgroundVideo}`);
    if (s.backgroundImage) lines.push(`- BG image: ${s.backgroundImage}`);
    if (s.visualEffect) lines.push(`- FX preset: ${s.visualEffect}`);
    if (s.musicKey) lines.push(`- Music key: ${s.musicKey}`);
    if (s.audioUrl) lines.push(`- VO/audioUrl: ${s.audioUrl}`);
    if (s.ambientKeys?.length) lines.push(`- Ambient keys: ${s.ambientKeys.join(", ")}`);
    if (s.enterSfxKeys?.length) lines.push(`- Enter SFX keys: ${s.enterSfxKeys.join(", ")}`);
    lines.push("");

    let cursor = 0;
    for (let i = 0; i < s.dialogue.length; i++) {
      const d = s.dialogue[i];
      const delay = d.delay ?? 0;
      const dur = d.duration ?? 0;
      cursor += delay;
      const start = cursor;
      const end = cursor + dur;
      cursor = end;

      const combined = `${d.text || ""} ${d.arabicText || ""}`.trim();
      const beats = suggestBeats(combined);
      const who = d.character ? String(d.character) : "Narrator";
      const textPreview = (d.arabicText || d.text || "").replace(/\s+/g, " ").slice(0, 120);

      lines.push(`- [${msToClock(start)}–${msToClock(end)}] L${i + 1} ${who}: ${textPreview}`);
      if (beats.length) lines.push(`  - Beats: ${beats.join(", ")}`);
    }

    lines.push("");
  }

  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Wrote ${path.relative(root, outPath)}`);
}

main();

