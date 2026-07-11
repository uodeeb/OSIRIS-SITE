/**
 * Debug Logger Utility
 * Prevents repeated console logs from polluting the console
 * and enables better debugging control.
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info';

interface LogEntry {
  message: string;
  timestamp: number;
  count: number;
}

class DebugLogger {
  private static instance: DebugLogger;
  private logCache = new Map<string, LogEntry>();
  private enabled = true;
  private throttleMs = 5000; // 5 seconds default throttle
  private maxCacheSize = 100;

  private constructor() {}

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  /**
   * Enable or disable all logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Set throttle time between repeated logs (in milliseconds)
   */
  setThrottle(ms: number): void {
    this.throttleMs = ms;
  }

  /**
   * Clear the log cache
   */
  clearCache(): void {
    this.logCache.clear();
  }

  /**
   * Generate a cache key from arguments
   */
  private getCacheKey(level: LogLevel, ...args: unknown[]): string {
    return `${level}:${args.map(a => String(a)).join(' ')}`;
  }

  /**
   * Check if a log message should be shown
   */
  private shouldLog(key: string): boolean {
    if (!this.enabled) return false;

    const entry = this.logCache.get(key);
    if (!entry) return true;

    const now = Date.now();
    const elapsed = now - entry.timestamp;

    // Allow if throttled duration has passed
    if (elapsed > this.throttleMs) {
      return true;
    }

    // Increment counter but don't log
    entry.count++;
    return false;
  }

  /**
   * Store log entry in cache
   */
  private storeEntry(key: string, message: string): void {
    // Evict old entries if cache is full
    if (this.logCache.size >= this.maxCacheSize) {
      const oldestKey = this.logCache.keys().next().value;
      if (oldestKey) {
        this.logCache.delete(oldestKey);
      }
    }

    this.logCache.set(key, {
      message,
      timestamp: Date.now(),
      count: 1,
    });
  }

  /**
   * Generic log method with throttling
   */
  private write(level: LogLevel, ...args: unknown[]): void {
    const key = this.getCacheKey(level, ...args);
    const message = args.map(a => String(a)).join(' ');

    if (!this.shouldLog(key)) {
      return;
    }

    this.storeEntry(key, message);

    // Use the appropriate console method
    console[level](...args);
  }

  /**
   * Log a message (throttled)
   */
  log(...args: unknown[]): void {
    this.write('log', ...args);
  }

  /**
   * Log a warning (throttled)
   */
  warn(...args: unknown[]): void {
    this.write('warn', ...args);
  }

  /**
   * Log an error (throttled)
   */
  error(...args: unknown[]): void {
    this.write('error', ...args);
  }

  /**
   * Log an info message (throttled)
   */
  info(...args: unknown[]): void {
    this.write('info', ...args);
  }

  /**
   * Log without throttling (always shows)
   */
  force(level: LogLevel = 'log', ...args: unknown[]): void {
    console[level](...args);
  }

  /**
   * Get cache statistics for debugging
   */
  getStats(): { size: number; entries: LogEntry[] } {
    return {
      size: this.logCache.size,
      entries: Array.from(this.logCache.values()),
    };
  }

  /**
   * Print suppressed log summary
   */
  printSummary(): void {
    const suppressed = Array.from(this.logCache.entries())
      .filter(([_, entry]) => entry.count > 1)
      .map(([key, entry]) => `${key}: suppressed ${entry.count - 1} logs`);

    if (suppressed.length > 0) {
      console.group('📊 Debug Logger Summary');
      suppressed.forEach(msg => console.log(msg));
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const debugLogger = DebugLogger.getInstance();

// Export convenience functions
export const log = (...args: unknown[]) => debugLogger.log(...args);
export const warn = (...args: unknown[]) => debugLogger.warn(...args);
export const error = (...args: unknown[]) => debugLogger.error(...args);
export const info = (...args: unknown[]) => debugLogger.info(...args);
export const forceLog = (...args: unknown[]) => debugLogger.force('log', ...args);

// Export class for advanced usage
export { DebugLogger };

export default debugLogger;
