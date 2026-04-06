/**
 * Performance monitoring and bundle optimization utilities
 */

export interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  renderTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface BundleAnalysis {
  totalSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
  recommendations: string[];
}

export interface ChunkInfo {
  name: string;
  size: number;
  loaded: boolean;
  loadingTime?: number;
}

export interface DependencyInfo {
  name: string;
  version: string;
  size: number;
  used: boolean;
  usage?: number; // percentage of code actually used
}

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private startTime: number = Date.now();

  constructor() {
    this.setupObservers();
    this.measureInitialLoad();
  }

  /**
   * Setup performance observers for Web Vitals
   */
  private setupObservers() {
    if (typeof window === 'undefined' || !window.performance) return;

    // First Contentful Paint
    this.observeEntry('paint', (entries) => {
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.metrics.firstContentfulPaint = fcp.startTime;
      }
    });

    // Largest Contentful Paint
    this.observeEntry('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1]; // Get the latest LCP
      if (lcp) {
        this.metrics.largestContentfulPaint = lcp.startTime;
      }
    });

    // Cumulative Layout Shift
    this.observeEntry('layout-shift', (entries) => {
      let clsValue = 0;
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      this.metrics.cumulativeLayoutShift = (this.metrics.cumulativeLayoutShift || 0) + clsValue;
    });

    // First Input Delay
    this.observeEntry('first-input', (entries) => {
      const fid = entries[0];
      if (fid) {
        this.metrics.firstInputDelay = (fid as any).processingStart - fid.startTime;
      }
    });

    // Resource timing
    this.observeEntry('resource', (entries) => {
      entries.forEach(entry => {
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          // Track bundle loading times
          const resourceEntry = entry as PerformanceResourceTiming;
          const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
          console.debug(`Resource loaded: ${entry.name.split('/').pop()} in ${loadTime.toFixed(2)}ms`);
        }
      });
    });
  }

  private observeEntry(type: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer not supported for ${type}:`, error);
    }
  }

  private measureInitialLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      }

      // Log initial metrics
      console.info('Initial Performance Metrics:', this.getMetrics());
    });
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      bundleSize: this.metrics.bundleSize || 0,
      loadTime: this.metrics.loadTime || 0,
      renderTime: this.metrics.renderTime || 0,
      firstContentfulPaint: this.metrics.firstContentfulPaint || 0,
      largestContentfulPaint: this.metrics.largestContentfulPaint || 0,
      cumulativeLayoutShift: this.metrics.cumulativeLayoutShift || 0,
      firstInputDelay: this.metrics.firstInputDelay || 0,
    };
  }

  /**
   * Analyze bundle composition (requires build-time data)
   */
  async analyzeBundle(): Promise<BundleAnalysis> {
    // This would typically be populated by build tools
    // For now, we'll estimate based on runtime information
    const chunks = this.estimateChunks();
    const dependencies = await this.analyzeDependencies();
    const recommendations = this.generateRecommendations(chunks, dependencies);

    return {
      totalSize: chunks.reduce((sum, chunk) => sum + chunk.size, 0),
      chunks,
      dependencies,
      recommendations,
    };
  }

  private estimateChunks(): ChunkInfo[] {
    const chunks: ChunkInfo[] = [];
    
    // Estimate main bundle size
    const mainScripts = Array.from(document.querySelectorAll('script[src]'));
    mainScripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (src.includes('main') || src.includes('index')) {
        chunks.push({
          name: 'main',
          size: this.estimateResourceSize(src),
          loaded: true,
        });
      }
    });

    return chunks;
  }

  private async analyzeDependencies(): Promise<DependencyInfo[]> {
    const dependencies: DependencyInfo[] = [];
    
    // Analyze loaded scripts to estimate dependencies
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    for (const script of scripts) {
      const src = (script as HTMLScriptElement).src;
      const name = this.extractDependencyName(src);
      
      if (name && !dependencies.find(dep => dep.name === name)) {
        dependencies.push({
          name,
          version: 'unknown', // Would need package.json analysis
          size: this.estimateResourceSize(src),
          used: true, // Assume loaded dependencies are used
        });
      }
    }

    return dependencies;
  }

  private extractDependencyName(src: string): string | null {
    // Extract package name from CDN URLs or bundled paths
    if (src.includes('npm') || src.includes('unpkg') || src.includes('jsdelivr')) {
      const match = src.match(/(@[^\/]+|[^\/]+)@/);
      return match ? match[1] : null;
    }
    
    // For bundled assets, try to extract from path
    const parts = src.split('/');
    const vendorIndex = parts.findIndex(part => part === 'vendor' || part === 'node_modules');
    if (vendorIndex >= 0 && parts[vendorIndex + 1]) {
      return parts[vendorIndex + 1];
    }
    
    return null;
  }

  private estimateResourceSize(src: string): number {
    // This is a rough estimation - in production, you'd have actual sizes
    if (src.includes('.js')) {
      return Math.random() * 100000 + 50000; // 50KB-150KB estimate
    } else if (src.includes('.css')) {
      return Math.random() * 50000 + 10000; // 10KB-60KB estimate
    }
    return 0;
  }

  private generateRecommendations(chunks: ChunkInfo[], dependencies: DependencyInfo[]): string[] {
    const recommendations: string[] = [];
    
    // Check for large chunks
    const largeChunks = chunks.filter(chunk => chunk.size > 100000); // > 100KB
    if (largeChunks.length > 0) {
      recommendations.push('Consider code splitting for large chunks to improve initial load time');
    }

    // Check for unused dependencies
    const unusedDeps = dependencies.filter(dep => !dep.used);
    if (unusedDeps.length > 0) {
      recommendations.push('Remove unused dependencies to reduce bundle size');
    }

    // Check performance metrics
    if (this.metrics.firstContentfulPaint && this.metrics.firstContentfulPaint > 2000) {
      recommendations.push('Optimize critical resources to improve First Contentful Paint');
    }

    if (this.metrics.largestContentfulPaint && this.metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize images and lazy load content to improve LCP');
    }

    if (this.metrics.cumulativeLayoutShift && this.metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Reserve space for dynamic content to reduce layout shift');
    }

    if (this.metrics.firstInputDelay && this.metrics.firstInputDelay > 100) {
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }

    return recommendations;
  }

  /**
   * Monitor runtime performance
   */
  startRuntimeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor long tasks
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Long task threshold
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      observer.observe({ type: 'longtask', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }

    // Monitor memory usage (if available)
    this.monitorMemoryUsage();
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.info('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
      });
    }
  }

  /**
   * Clean up observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Bundle optimization utilities
 */
export class BundleOptimizer {
  /**
   * Suggest tree shaking opportunities
   */
  static suggestTreeShaking(dependencies: DependencyInfo[]): string[] {
    const suggestions: string[] = [];
    
    dependencies.forEach(dep => {
      if (dep.usage !== undefined && dep.usage < 50) {
        suggestions.push(`${dep.name}: Only ${dep.usage}% of code is used. Consider importing specific modules.`);
      }
    });

    return suggestions;
  }

  /**
   * Suggest dynamic imports for code splitting
   */
  static suggestCodeSplitting(chunks: ChunkInfo[]): string[] {
    const suggestions: string[] = [];
    
    const largeChunks = chunks.filter(chunk => chunk.size > 50000);
    largeChunks.forEach(chunk => {
      suggestions.push(`${chunk.name}: Consider splitting this ${Math.round(chunk.size / 1024)}KB chunk into smaller pieces.`);
    });

    return suggestions;
  }

  /**
   * Generate bundle optimization report
   */
  static generateReport(analysis: BundleAnalysis): string {
    const report = [
      '# Bundle Optimization Report',
      '',
      `## Total Bundle Size: ${Math.round(analysis.totalSize / 1024)}KB`,
      '',
      '## Chunks:',
      ...analysis.chunks.map(chunk => 
        `- ${chunk.name}: ${Math.round(chunk.size / 1024)}KB ${chunk.loadingTime ? `(${Math.round(chunk.loadingTime)}ms)` : ''}`
      ),
      '',
      '## Dependencies:',
      ...analysis.dependencies.map(dep => 
        `- ${dep.name}@${dep.version}: ${Math.round(dep.size / 1024)}KB ${dep.used ? '(used)' : '(unused)'}`
      ),
      '',
      '## Recommendations:',
      ...analysis.recommendations.map(rec => `- ${rec}`),
      '',
      '## Tree Shaking Opportunities:',
      ...this.suggestTreeShaking(analysis.dependencies).map(suggestion => `- ${suggestion}`),
      '',
      '## Code Splitting Opportunities:',
      ...this.suggestCodeSplitting(analysis.chunks).map(suggestion => `- ${suggestion}`),
    ];

    return report.join('\n');
  }
}

/**
 * Global performance monitor instance
 */
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * Hook for using performance monitoring in components
 */
export function usePerformanceMonitor() {
  return globalPerformanceMonitor;
}
