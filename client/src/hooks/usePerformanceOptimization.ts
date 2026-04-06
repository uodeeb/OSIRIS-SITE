import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Performance optimization hooks for Phase 3 implementation
 * Addresses memoization, code splitting, and bundle optimization
 */

/**
 * Memoizes inline objects to prevent unnecessary re-renders
 * Use for style objects, configuration objects, etc.
 */
export function useStableObject<T extends Record<string, any>>(obj: T): T {
  const ref = useRef<T>(obj);
  
  // Only update if the object actually changed (deep comparison)
  if (JSON.stringify(ref.current) !== JSON.stringify(obj)) {
    ref.current = obj;
  }
  
  return ref.current;
}

/**
 * Memoizes event handlers with proper dependency tracking
 * Prevents recreation of functions on every render
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps?: React.DependencyList
): T {
  const callbackRef = useRef(callback);
  const depsRef = useRef(deps);

  // Update callback if dependencies change
  if (!deps || JSON.stringify(depsRef.current) !== JSON.stringify(deps)) {
    callbackRef.current = callback;
    depsRef.current = deps;
  }

  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

/**
 * Preloads critical resources for better performance
 */
export function useResourcePreloader(resources: string[]) {
  const preloadedResources = useRef<Set<string>>(new Set());

  useEffect(() => {
    resources.forEach(resource => {
      if (!preloadedResources.current.has(resource)) {
        // Preload images
        if (resource.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const img = new Image();
          img.src = resource;
        }
        // Preload audio
        else if (resource.match(/\.(mp3|wav|ogg)$/i)) {
          const audio = new Audio();
          audio.src = resource;
        }
        // Preload video
        else if (resource.match(/\.(mp4|webm)$/i)) {
          const video = document.createElement('video');
          video.src = resource;
        }
        
        preloadedResources.current.add(resource);
      }
    });
  }, [resources]);

  return preloadedResources.current;
}

/**
 * Debounces rapid function calls for performance
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as T, [callback, delay]);
}

/**
 * Throttles function calls to limit execution frequency
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  return useCallback(((...args: any[]) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }) as T, [callback, delay]);
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    handleScroll,
    offsetY: visibleItems.startIndex * itemHeight
  };
}

// Import useState for useVirtualScrolling
import { useState } from 'react';
