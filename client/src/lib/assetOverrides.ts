import superjson from 'superjson';

type AssetRow = {
  key: string;
  url: string;
};

let overrides: Record<string, string> = {};
let overridesLoaded = false;
let initPromise: Promise<void> | null = null;

export function setAssetOverrides(next: Record<string, string>) {
  overrides = { ...next };
}

export function getAssetOverride(key: string): string | undefined {
  // Lazy initialization: only load overrides when first accessed (async-defer-await best practice)
  if (!overridesLoaded && !initPromise) {
    // Start loading in background but don't block
    initPromise = initAssetOverrides({ timeoutMs: 2000 }).catch(() => {
      // Silently fail, will use fallback
    });
  }
  return overrides[key];
}

const proxyCache = new WeakMap<object, any>();

export function createAssetProxy<T extends object>(target: T, path: string[] = []): T {
  const existing = proxyCache.get(target);
  if (existing) return existing as T;

  // Mapping from client plural names to database singular names
  const pluralToSingular: Record<string, string> = {
    'characters': 'character',
    'backgrounds': 'background',
    'documents': 'document',
    'videoBgs': 'videoBg',  // Just in case
    'audios': 'audio',      // Just in case
  };

  const proxy = new Proxy(target as any, {
    get(obj, prop) {
      if (typeof prop === "symbol") return obj[prop];
      const value = obj[prop];
      if (typeof value === "string") {
        const key = [...path, prop].join(".");
        // Map plural to singular for database key compatibility
        const parts = key.split('.');
        if (parts.length >= 2 && pluralToSingular[parts[0]]) {
          parts[0] = pluralToSingular[parts[0]];
        }
        const dbKey = parts.join('.');
        const override = getAssetOverride(dbKey);
        if (override) {
          console.log(`[AssetProxy] Found override for ${dbKey}:`, override.substring(0, 50) + '...');
          return override;
        }
        console.log(`[AssetProxy] No override for ${dbKey}, using raw value:`, value.substring(0, 50) + '...');
        return value;
      }
      if (value && typeof value === "object") {
        return createAssetProxy(value, [...path, prop]);
      }
      return value;
    },
  });

  proxyCache.set(target, proxy);
  return proxy as T;
}

function extractAssetsFromTrpcResponse(payload: any): AssetRow[] {
  const candidates = [
    payload?.result?.data?.json?.assets,
    payload?.result?.data?.assets,
    payload?.result?.data?.json,
    payload?.result?.data,
    payload?.assets,
  ];
  
  const assets = candidates.find(Array.isArray);
  console.log('[AssetOverrides] Found array at path:', candidates.indexOf(assets), 'Length:', assets?.length || 0);
  return Array.isArray(assets) ? assets : [];
}

async function tryLoadLocalOverrides(controller?: AbortController) {
  const res = await fetch(`/generated-assets/overrides.json`, {
    credentials: "include",
    signal: controller?.signal,
  }).catch(() => null);
  if (!res || !("ok" in res) || !res.ok) return;
  const json = await res.json().catch(() => null);
  if (!json || typeof json !== "object") return;
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries(json as Record<string, unknown>)) {
    if (typeof k !== "string") continue;
    if (typeof v !== "string") continue;
    next[k] = v;
  }
  if (Object.keys(next).length) setAssetOverrides(next);
}

export async function initAssetOverrides(opts?: { timeoutMs?: number }) {
  // If already loaded or loading, return the existing promise
  if (overridesLoaded) return;
  if (initPromise) return initPromise;

  const timeoutMs = opts?.timeoutMs ?? 800;
  const controller = timeoutMs > 0 ? new AbortController() : undefined;
  const timer =
    controller && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : undefined;

  initPromise = (async () => {
    try {
      // Use proper superjson format like apiCall does
      const input = btoa(superjson.stringify({}));
      console.log('[AssetOverrides] Fetching with input:', input);
      const res = await fetch(`/api/trpc/system.assets?input=${encodeURIComponent(input)}`, {
        credentials: "include",
        signal: controller?.signal,
      });
      console.log('[AssetOverrides] Response status:', res.status);
      if (!res.ok) {
        console.warn('[AssetOverrides] Failed to fetch, trying local overrides');
        await tryLoadLocalOverrides(controller);
        return;
      }
      const json = await res.json().catch(() => null);
      console.log('[AssetOverrides] Response JSON:', json);
      console.log('[AssetOverrides] Response structure check:', {
        'result?.data?.json?.assets': json?.result?.data?.json?.assets,
        'result?.data?.assets': json?.result?.data?.assets,
        'result?.data?.json': json?.result?.data?.json,
        'result?.data': json?.result?.data,
        'assets': json?.assets,
      });
      if (!json) {
        await tryLoadLocalOverrides(controller);
        return;
      }

      const assets = extractAssetsFromTrpcResponse(json);
      console.log('[AssetOverrides] Extracted assets:', assets);
      if (!assets.length) {
        await tryLoadLocalOverrides(controller);
        return;
      }

      const next: Record<string, string> = {};
      for (const a of assets) {
        if (!a || typeof a !== "object") continue;
        if (typeof a.key !== "string") continue;
        if (typeof a.url !== "string") continue;
        next[a.key] = a.url;
      }
      console.log('[AssetOverrides] Setting overrides:', next);
      if (Object.keys(next).length) setAssetOverrides(next);
      overridesLoaded = true;
    } catch (e) {
      console.error('[AssetOverrides] Error:', e);
      await tryLoadLocalOverrides(controller);
    } finally {
      if (timer) clearTimeout(timer);
      initPromise = null;
    }
  })();

  await initPromise;
}
