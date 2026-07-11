# Phase 1 - Canonical bilingual content

## Authority decision

- Arabic authority: `script/OSIRIS_Final_Interactive_Script.md`
- English recovery authority: `git:a232e22^:client/src/lib/sceneSystem.ts`
- Runtime scene modules and `narrativeData*.json` are reconciliation inputs, not canonical authorities.

The Arabic master is the most complete narrative source found in the repository. It contains clean UTF-8 Arabic, 22 chapter containers (21 numbered chapter headings plus one transition chapter container), and 35 numbered scenes.

The historical monolithic scene system at `a232e22^` is the strongest English recovery source. It contains clean paired English/Arabic dialogue, 31 runtime scene entries, and 262 English dialogue/text fields paired with 262 Arabic fields. The earlier candidate ref `95f75a14285a07d114fc5100159d5b78c65cef45` is rejected because it contains zero scene entries and zero bilingual text fields in `client/src/lib/sceneSystem.ts`.

## Non-negotiable rules

1. Never fill an English field with Arabic text.
2. Every localized field keeps source provenance.
3. Duplicate scene IDs and missing scene targets fail validation.
4. Runtime scenes, routes, sitemap entries, chapter navigation, and media binding must eventually be generated from one canonical manifest.
5. Existing runtime sources remain untouched until reconciliation reports all content gaps.

## Phase 1 artifacts

- `client/src/content/storySchema.ts`: canonical bilingual content types and integrity validation.
- `tools/audit-bilingual-sources.mjs`: deterministic source selection and source-quality audit.

## Current gap

Arabic master scenes: 35.
Historical bilingual runtime scenes: 31.
Known source gap before runtime generation: 4 scene entries.

## Next reconciliation step

Map historical scene IDs to Arabic master scene numbers, identify the four missing source scenes, and emit a reviewable gap report before generating the canonical story manifest.