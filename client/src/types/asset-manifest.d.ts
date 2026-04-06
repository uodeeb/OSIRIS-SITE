/**
 * Asset Manifest TypeScript Declarations
 * 
 * Types for the static asset manifest system.
 * 
 * @see project_history/02_architecture_asset_plan.md
 */

export type AssetCategory = 'character' | 'background' | 'audio' | 'document' | 'ui';

export interface AssetEntry {
  /** Unique key (e.g., 'character.neferhotep') */
  key: string;
  /** Asset category */
  category: AssetCategory;
  /** Original filename */
  filename: string;
  /** File extension */
  extension: string;
  /** Absolute path on filesystem */
  localPath: string;
  /** Public URL path (e.g., '/assets/character/neferhotep.png') */
  publicPath: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes (optional) */
  size?: number;
  /** Width in pixels (for images) */
  width?: number;
  /** Height in pixels (for images) */
  height?: number;
  /** Fallback URL for CDN migration period */
  fallbackUrl?: string;
  /** Cloudfront URL (for migration period) */
  cloudfrontUrl?: string;
}

export interface AssetManifest {
  /** Manifest version */
  version: string;
  /** ISO timestamp when generated */
  generatedAt: string;
  /** Total number of assets */
  totalAssets: number;
  /** Map of key → asset entry */
  assets: Record<string, AssetEntry>;
  /** Assets grouped by category */
  categories: Record<AssetCategory, string[]>;
}

// Character asset variants
export type CharacterVariant = 'default' | 'smile' | 'concerned' | 'determined' | 
  'determined-smile' | 'neutral' | 'suspicious' | 'thinking' | 'candid' | 
  'focused' | 'tired' | 'pensive' | 'angry';

// Asset key patterns
export type CharacterAssetKey = `character.${string}`;
export type BackgroundAssetKey = `background.${string}`;
export type AudioAssetKey = `audio.${string}`;
export type DocumentAssetKey = `document.${string}`;
export type UIAssetKey = `ui.${string}`;
export type AssetKey = CharacterAssetKey | BackgroundAssetKey | AudioAssetKey | DocumentAssetKey | UIAssetKey;
