/**
 * Resource preloading utilities for performance optimization
 */

export interface PreloadOptions {
  priority?: 'high' | 'low' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
  referrerPolicy?: ReferrerPolicy;
  as?: string;
}

/**
 * Preloads a resource using link prefetch/preload
 */
export function preloadResource(
  url: string,
  options: PreloadOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    if (options.as) link.as = options.as;
    if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
    if (options.referrerPolicy) link.referrerPolicy = options.referrerPolicy;
    
    link.onload = () => {
      document.head.removeChild(link);
      resolve();
    };
    
    link.onerror = () => {
      document.head.removeChild(link);
      reject(new Error(`Failed to preload: ${url}`));
    };
    
    document.head.appendChild(link);
  });
}

/**
 * Preloads an image resource
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

/**
 * Preloads multiple images in parallel
 */
export async function preloadImages(
  sources: string[],
  concurrency: number = 3
): Promise<HTMLImageElement[]> {
  const results: HTMLImageElement[] = [];
  
  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(src => preloadImage(src))
    );
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });
  }
  
  return results;
}

/**
 * Preloads audio resources
 */
export function preloadAudio(src: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = () => reject(new Error(`Failed to preload audio: ${src}`));
    audio.src = src;
  });
}

/**
 * Preloads multiple audio files in parallel
 */
export async function preloadAudioSources(
  sources: string[],
  concurrency: number = 2
): Promise<HTMLAudioElement[]> {
  const results: HTMLAudioElement[] = [];
  
  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(src => preloadAudio(src))
    );
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });
  }
  
  return results;
}

/**
 * Intelligent preloading based on user interaction
 */
export class SmartPreloader {
  private preloadedAssets = new Set<string>();
  private observers: IntersectionObserver[] = [];
  
  constructor() {
    this.setupIntersectionObservers();
  }
  
  /**
   * Preload assets when they enter viewport
   */
  preloadOnIntersection(
    element: HTMLElement,
    assets: string[],
    options: PreloadOptions = {}
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.preloadAssets(assets, options);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(element);
    this.observers.push(observer);
  }
  
  /**
   * Preload assets on user idle
   */
  preloadOnIdle(assets: string[], options: PreloadOptions = {}) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadAssets(assets, options);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.preloadAssets(assets, options);
      }, 100);
    }
  }
  
  /**
   * Preload assets on hover (for navigation items)
   */
  preloadOnHover(
    element: HTMLElement,
    assets: string[],
    options: PreloadOptions = {},
    delay: number = 200
  ) {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseEnter = () => {
      timeoutId = setTimeout(() => {
        this.preloadAssets(assets, options);
      }, delay);
    };
    
    const handleMouseLeave = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
  }
  
  /**
   * Preload assets based on network conditions
   */
  async preloadAdaptively(
    assets: string[],
    options: PreloadOptions = {}
  ) {
    const connection = (navigator as any).connection;
    
    if (!connection) {
      // No network info, preload conservatively
      return this.preloadAssets(assets.slice(0, 3), options);
    }
    
    const { effectiveType, saveData } = connection;
    
    // Don't preload if user has data saver enabled
    if (saveData) {
      return;
    }
    
    // Adjust preload count based on connection quality
    let preloadCount = 3;
    switch (effectiveType) {
      case '4g':
        preloadCount = 10;
        break;
      case '3g':
        preloadCount = 5;
        break;
      case '2g':
        preloadCount = 2;
        break;
      case 'slow-2g':
        preloadCount = 1;
        break;
    }
    
    return this.preloadAssets(assets.slice(0, preloadCount), options);
  }
  
  private async preloadAssets(
    assets: string[],
    options: PreloadOptions = {}
  ) {
    const assetsToPreload = assets.filter(
      asset => !this.preloadedAssets.has(asset)
    );
    
    if (assetsToPreload.length === 0) return;
    
    // Determine asset type and preload accordingly
    const imageAssets = assetsToPreload.filter(asset => 
      /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(asset)
    );
    
    const audioAssets = assetsToPreload.filter(asset => 
      /\.(mp3|wav|ogg|m4a)$/i.test(asset)
    );
    
    const otherAssets = assetsToPreload.filter(asset => 
      !imageAssets.includes(asset) && !audioAssets.includes(asset)
    );
    
    // Preload in parallel with appropriate methods
    await Promise.allSettled([
      this.preloadImages(imageAssets),
      this.preloadAudios(audioAssets),
      this.preloadOthers(otherAssets, options)
    ]);
    
    // Mark all as preloaded
    assetsToPreload.forEach(asset => this.preloadedAssets.add(asset));
  }
  
  private async preloadImages(sources: string[]) {
    if (sources.length === 0) return;
    await preloadImages(sources);
  }
  
  private async preloadAudios(sources: string[]) {
    if (sources.length === 0) return;
    await preloadAudioSources(sources);
  }
  
  private async preloadOthers(sources: string[], options: PreloadOptions) {
    if (sources.length === 0) return;
    await Promise.all(sources.map(src => preloadResource(src, options)));
  }
  
  private setupIntersectionObservers() {
    // Clean up observers on page unload
    window.addEventListener('unload', () => {
      this.observers.forEach(observer => observer.disconnect());
    });
  }
  
  /**
   * Check if an asset is already preloaded
   */
  isPreloaded(url: string): boolean {
    return this.preloadedAssets.has(url);
  }
  
  /**
   * Clear preloaded assets cache
   */
  clearCache() {
    this.preloadedAssets.clear();
  }
  
  /**
   * Get statistics about preloaded assets
   */
  getStats() {
    return {
      totalPreloaded: this.preloadedAssets.size,
      preloadedAssets: Array.from(this.preloadedAssets)
    };
  }
}

/**
 * Global preloader instance
 */
export const globalPreloader = new SmartPreloader();

/**
 * Hook for using smart preloading in components
 */
export function useSmartPreloader() {
  return globalPreloader;
}
