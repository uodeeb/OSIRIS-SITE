/**
 * useAsset Hook - React hook for loading assets from database
 * 
 * Provides a simple interface to fetch asset URLs from the database
 * with loading states and error handling.
 * 
 * Usage:
 *   const { url, isLoading, error } = useAsset('character.yahya');
 *   if (isLoading) return <Skeleton />;
 *   if (error) return <Error />;
 *   return <img src={url} alt="Yahya" />;
 */

import { useState, useEffect } from 'react';
import { getAssetUrl, getAssetUrls } from '@/lib/assetUrls';

export interface UseAssetResult {
  url: string;
  isLoading: boolean;
  error: string | null;
}

export interface UseAssetsResult {
  urls: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch a single asset URL from the database
 * 
 * @param key - Asset key (e.g., 'character.yahya', 'videoBg.intro')
 * @returns Object with url, isLoading, and error
 */
export function useAsset(key: string): UseAssetResult {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAsset = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const assetUrl = await getAssetUrl(key);
        if (isMounted) {
          setUrl(assetUrl);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (isMounted) {
          setError(message);
          console.error(`Failed to load asset ${key}:`, err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAsset();

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { url, isLoading, error };
}

/**
 * Hook to fetch multiple asset URLs in parallel
 * 
 * @param keys - Array of asset keys
 * @returns Object with urls (key->url mapping), isLoading, and error
 */
export function useAssets(keys: string[]): UseAssetsResult {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const assetUrls = await getAssetUrls(keys);
        if (isMounted) {
          setUrls(assetUrls);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (isMounted) {
          setError(message);
          console.error('Failed to load assets:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (keys.length > 0) {
      loadAssets();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [keys.join(',')]); // Join to prevent infinite loops with array deps

  return { urls, isLoading, error };
}

/**
 * Hook to preload assets into cache
 * Useful for loading screens and predictive preloading
 * 
 * @param keys - Array of asset keys to preload
 */
export function useAssetPreload(keys: string[]) {
  useEffect(() => {
    const preload = async () => {
      try {
        await getAssetUrls(keys);
      } catch (err) {
        console.error('Failed to preload assets:', err);
      }
    };

    if (keys.length > 0) {
      preload();
    }
  }, [keys.join(',')]);
}
