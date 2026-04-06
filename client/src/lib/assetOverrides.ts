import superjson from 'superjson';

type AssetRow = {
  key: string;
  url: string;
};

// Enhanced logging for debugging
const DEBUG = typeof window !== 'undefined' && (window.location.search.includes('debug=assets') || localStorage.getItem('debug_assets') === 'true');
const log = (...args: any[]) => DEBUG && console.log('[AssetProxy]', ...args);
const error = (...args: any[]) => console.error('[AssetProxy]', ...args);

let overrides: Record<string, string> = {};
let overridesLoaded = false;
let initPromise: Promise<void> | null = null;

export function setAssetOverrides(next: Record<string, string>) {
  overrides = { ...next };
}

export function getAssetOverride(key: string): string | undefined {
  // If overrides not loaded, trigger lazy initialization
  if (!overridesLoaded && !initPromise) {
    log('Starting lazy load for key:', key);
    // Start loading in background but don't block
    initPromise = initAssetOverrides({ timeoutMs: 3000 }).catch((err) => {
      error('Failed to load overrides:', err);
      // Don't reset initPromise on error - prevent infinite retry loops
    });
  }
  
  // If loading is in progress, check if we have any early data
  if (initPromise && !overridesLoaded) {
    // Return undefined to trigger fallback behavior in proxy
    log('Overrides still loading, returning undefined for:', key);
  }
  
  const override = overrides[key];
  if (override) {
    log('Found override:', key, '->', override.substring(0, 50) + '...');
  } else {
    log('No override found for:', key, 'Available keys:', Object.keys(overrides).slice(0, 5));
  }
  return override;
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
    'videoBgs': 'videoBg',
    'audios': 'audio',
    'sceneBg': 'sceneBg',
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
          log('Proxy intercepted:', key, '->', dbKey, '->', override.substring(0, 50) + '...');
          return override;
        }
        log('No override for:', key, '(dbKey:', dbKey, ')');
        
        // IMPORTANT: Check if this looks like an asset key (has dot notation)
        // If so, try to construct a direct tRPC URL that will work
        if (dbKey.includes('.') && !value.startsWith('http') && !value.startsWith('/')) {
          // Return a functional tRPC URL that will resolve on the server
          const fallbackUrl = `/api/trpc/media.getAsset?input=${encodeURIComponent(btoa(JSON.stringify({json:{key: dbKey},meta:{}})))}`;
          log('Returning tRPC fallback for:', dbKey);
          return fallbackUrl;
        }
        
        // Return the raw value if it's already a URL or path
        return value;
      }
      if (value && typeof value === "object") {
        return createAssetProxy(value, [...path, prop]);
      }
      return value;
    },
  });

  proxyCache.set(target, proxy);
  console.log('[AssetProxy] Created proxy for path:', path);
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
  return Array.isArray(assets) ? assets : [];
}

async function tryLoadJsonConfig() {
  try {
    const res = await fetch('/assets.json', { 
      cache: 'no-cache',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      log('assets.json not found, using empty config');
      return [];
    }
    const data = await res.json();
    if (data.assets && typeof data.assets === 'object') {
      log('Loaded assets.json with', Object.keys(data.assets).length, 'assets');
      return Object.entries(data.assets).map(([key, url]) => ({ key, url: url as string }));
    }
    return [];
  } catch (err) {
    error('Failed to load assets.json:', err);
    return [];
  }
}

async function tryLoadTrpcOverrides(controller?: AbortController) {
  try {
    const input = btoa(superjson.stringify({}));
    log('Fetching assets from API...');
    
    const res = await fetch(`/api/trpc/system.assets?input=${encodeURIComponent(input)}`, {
      credentials: "include",
      signal: controller?.signal,
    });
    
    if (!res.ok) {
      error('API request failed:', res.status, res.statusText);
      return [];
    }
    
    const json = await res.json().catch((err) => {
      error('Failed to parse API response:', err);
      return null;
    });
    
    if (!json) {
      error('Empty API response');
      return [];
    }

    const assets = extractAssetsFromTrpcResponse(json);
    if (!assets.length) {
      error('No assets found in API response');
      return [];
    }

    return assets;
  } catch (err) {
    error('Failed to load tRPC overrides:', err);
    return [];
  }
}

export async function initAssetOverrides(opts?: { timeoutMs?: number; eager?: boolean }) {
  // If already loaded, return immediately
  if (overridesLoaded) {
    log('Overrides already loaded, skipping');
    return;
  }
  
  // If loading is already in progress, wait for it
  if (initPromise) {
    log('Overrides loading in progress, waiting...');
    return initPromise;
  }

  const timeoutMs = opts?.timeoutMs ?? 5000;
  const controller = timeoutMs > 0 ? new AbortController() : undefined;
  const timer =
    controller && timeoutMs > 0
      ? setTimeout(() => {
          error('Asset override loading timed out after', timeoutMs, 'ms');
          controller.abort();
        }, timeoutMs)
      : undefined;

  initPromise = (async () => {
    try {
      log('Starting asset override initialization...');
      
      // Try loading from JSON config first (static, works on Vercel without DB)
      const jsonAssets = await tryLoadJsonConfig();
      for (const asset of jsonAssets) {
        if (asset.key && asset.url) {
          overrides[asset.key] = asset.url;
        }
      }
      
      // Try loading from tRPC/database (dynamic, overrides JSON if available)
      const trpcAssets = await tryLoadTrpcOverrides(controller);
      for (const asset of trpcAssets) {
        if (asset.key && asset.url) {
          overrides[asset.key] = asset.url;
        }
      }
      
      overridesLoaded = true;
      log('Asset overrides loaded:', Object.keys(overrides).length, 'assets');
    } catch (e) {
      error('Failed to initialize asset overrides:', e);
    } finally {
      if (timer) clearTimeout(timer);
    }
  })();

  await initPromise;
}
