import { useEffect, useState } from 'react';
import { assetManager, Asset, AssetCategory, OSIRIS_ASSETS } from '@/lib/assetManager';

/**
 * Hook to access assets with loading state and error handling
 */
export function useAssets() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Preload critical assets on mount
    assetManager
      .preloadCriticalAssets()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to preload critical assets:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  /**
   * Get asset URL by ID
   */
  const getAsset = async (assetId: string): Promise<string> => {
    try {
      return await assetManager.getAsset(assetId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Failed to get asset ${assetId}:`, message);
      setError(message);
      return '';
    }
  };

  /**
   * Get asset by category and key
   */
  const getAssetByKey = (
    category: keyof AssetCategory,
    key: string
  ): Asset | null => {
    return assetManager.getAssetByKey(category, key);
  };

  /**
   * Get all assets in a category
   */
  const getCategory = (category: keyof AssetCategory): Record<string, Asset> => {
    return OSIRIS_ASSETS[category] as Record<string, Asset>;
  };

  /**
   * Get asset stats
   */
  const getStats = () => {
    return assetManager.getStats();
  };

  return {
    isLoading,
    error,
    getAsset,
    getAssetByKey,
    getCategory,
    getStats,
  };
}

/**
 * Hook to get a single asset with loading state
 */
export function useSingleAsset(assetId: string) {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    assetManager
      .getAsset(assetId)
      .then((assetUrl) => {
        setUrl(assetUrl);
        setIsLoading(false);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Failed to load asset ${assetId}:`, message);
        setError(message);
        setIsLoading(false);
      });
  }, [assetId]);

  return { url, isLoading, error };
}

/**
 * Hook to get multiple assets
 */
export function useMultipleAssets(assetIds: string[]) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.allSettled(
      assetIds.map((id) =>
        assetManager.getAsset(id).then((url) => ({ id, url }))
      )
    )
      .then((results) => {
        const newUrls: Record<string, string> = {};
        let hasError = false;

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            newUrls[result.value.id] = result.value.url;
          } else {
            hasError = true;
            console.error('Failed to load asset:', result.reason);
          }
        });

        setUrls(newUrls);
        if (hasError) {
          setError('Some assets failed to load');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to load assets:', message);
        setError(message);
        setIsLoading(false);
      });
  }, [assetIds.join(',')]); // Join to prevent infinite loops

  return { urls, isLoading, error };
}
