type AssetRow = {
  key: string;
  url: string;
};

let overrides: Record<string, string> = {};

export function setAssetOverrides(next: Record<string, string>) {
  overrides = { ...next };
}

export function getAssetOverride(key: string): string | undefined {
  return overrides[key];
}

const proxyCache = new WeakMap<object, any>();

export function createAssetProxy<T extends object>(target: T, path: string[] = []): T {
  const existing = proxyCache.get(target);
  if (existing) return existing as T;

  const proxy = new Proxy(target as any, {
    get(obj, prop) {
      if (typeof prop === "symbol") return obj[prop];
      const value = obj[prop];
      if (typeof value === "string") {
        const key = [...path, prop].join(".");
        return getAssetOverride(key) ?? value;
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
    payload?.assets,
  ];
  const assets = candidates.find(Array.isArray);
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
  const timeoutMs = opts?.timeoutMs ?? 800;
  const controller = timeoutMs > 0 ? new AbortController() : undefined;
  const timer =
    controller && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : undefined;

  try {
    const input = encodeURIComponent("{}");
    const res = await fetch(`/api/trpc/system.assets?input=${input}`, {
      credentials: "include",
      signal: controller?.signal,
    });
    if (!res.ok) {
      await tryLoadLocalOverrides(controller);
      return;
    }
    const json = await res.json().catch(() => null);
    if (!json) {
      await tryLoadLocalOverrides(controller);
      return;
    }

    const assets = extractAssetsFromTrpcResponse(json);
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
    if (Object.keys(next).length) setAssetOverrides(next);
  } catch {
    await tryLoadLocalOverrides(controller);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
