/**
 * Privacy-Compliant Analytics
 * GDPR/CCPA compliant usage tracking with no third-party cookies
 */

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  path?: string;
  metadata?: Record<string, any>;
}

interface SessionData {
  id: string;
  startTime: number;
  lastActivity: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  language: string;
}

// Generate anonymous session ID
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get device type
function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Analytics storage key
const STORAGE_KEY = 'osiris_analytics_session';
const CONSENT_KEY = 'osiris_analytics_consent';

class PrivacyAnalytics {
  private session: SessionData | null = null;
  private queue: AnalyticsEvent[] = [];
  private isConsentGiven: boolean = false;
  private endpoint: string = '/api/analytics';

  constructor() {
    this.loadConsent();
    if (this.isConsentGiven) {
      this.initSession();
    }
  }

  // Check if user has given consent
  private loadConsent(): void {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      this.isConsentGiven = consent === 'true';
    } catch {
      this.isConsentGiven = false;
    }
  }

  // Request user consent
  requestConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      // Show consent modal
      const consentGiven = window.confirm(
        'Would you like to help improve OSIRIS by sharing anonymous usage data?\n\n' +
        'This data helps us understand how people use the app and improve the experience.\n' +
        'No personal information is collected.'
      );
      
      this.setConsent(consentGiven);
      resolve(consentGiven);
    });
  }

  // Set consent status
  setConsent(given: boolean): void {
    this.isConsentGiven = given;
    try {
      localStorage.setItem(CONSENT_KEY, given ? 'true' : 'false');
    } catch {
      // Storage not available
    }
    
    if (given && !this.session) {
      this.initSession();
    }
  }

  // Initialize session
  private initSession(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SessionData;
        // Session expires after 30 minutes of inactivity
        if (Date.now() - parsed.lastActivity < 30 * 60 * 1000) {
          this.session = parsed;
          this.session.lastActivity = Date.now();
          return;
        }
      }
    } catch {
      // Invalid or no stored session
    }

    // Create new session
    this.session = {
      id: generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      deviceType: getDeviceType(),
      language: navigator.language || 'en',
    };

    this.saveSession();
    
    // Track session start
    this.track('session_start', {
      deviceType: this.session.deviceType,
      language: this.session.language,
    });
  }

  private saveSession(): void {
    if (this.session) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
      } catch {
        // Storage not available
      }
    }
  }

  // Track an event
  track(event: string, metadata?: Record<string, any>): void {
    if (!this.isConsentGiven) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      sessionId: this.session?.id || 'anonymous',
      path: window.location.pathname,
      metadata: {
        ...metadata,
        deviceType: this.session?.deviceType,
        language: this.session?.language,
      },
    };

    this.queue.push(analyticsEvent);
    this.debouncedFlush();
  }

  // Debounced flush to batch events
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;

  private debouncedFlush(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
    }
    this.flushTimeout = setTimeout(() => this.flush(), 5000);
  }

  // Flush events to server
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // Send beacon if available (works even when page is unloading)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({ events })], {
          type: 'application/json',
        });
        navigator.sendBeacon(this.endpoint, blob);
      } else {
        // Fallback to fetch
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events }),
          keepalive: true,
        });
      }
    } catch {
      // Silently fail - analytics should never break the app
      // Re-add events to queue for retry
      this.queue.unshift(...events);
    }
  }

  // Track scene navigation
  trackSceneTransition(fromScene: string, toScene: string, choiceId?: string): void {
    this.track('scene_transition', {
      from: fromScene,
      to: toScene,
      choice: choiceId,
    });
  }

  // Track choice selection
  trackChoice(choiceId: string, sceneId: string, timerExpired: boolean): void {
    this.track('choice_made', {
      choiceId,
      sceneId,
      timerExpired,
    });
  }

  // Track audio interactions
  trackAudio(action: 'play' | 'pause' | 'volume_change', volume?: number): void {
    this.track('audio_interaction', {
      action,
      volume,
    });
  }

  // Track language switch
  trackLanguageSwitch(from: string, to: string): void {
    this.track('language_switch', { from, to });
  }

  // Track errors (anonymous)
  trackError(errorType: string, message: string): void {
    this.track('error', {
      type: errorType,
      message: message.substring(0, 100), // Truncate for privacy
    });
  }

  // Get session duration in seconds
  getSessionDuration(): number {
    if (!this.session) return 0;
    return Math.floor((Date.now() - this.session.startTime) / 1000);
  }

  // Update activity timestamp
  updateActivity(): void {
    if (this.session) {
      this.session.lastActivity = Date.now();
      this.saveSession();
    }
  }

  // Clear all data (GDPR right to be forgotten)
  clearAllData(): void {
    this.session = null;
    this.queue = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      // Storage not available
    }
  }
}

// Export singleton instance
export const analytics = new PrivacyAnalytics();

// React hook for analytics
export function useAnalytics() {
  return {
    track: (event: string, metadata?: Record<string, any>) => analytics.track(event, metadata),
    trackSceneTransition: (from: string, to: string, choiceId?: string) => 
      analytics.trackSceneTransition(from, to, choiceId),
    trackChoice: (choiceId: string, sceneId: string, timerExpired: boolean) => 
      analytics.trackChoice(choiceId, sceneId, timerExpired),
    trackAudio: (action: 'play' | 'pause' | 'volume_change', volume?: number) => 
      analytics.trackAudio(action, volume),
    trackLanguageSwitch: (from: string, to: string) => analytics.trackLanguageSwitch(from, to),
    requestConsent: () => analytics.requestConsent(),
    setConsent: (given: boolean) => analytics.setConsent(given),
    isConsentGiven: () => {
      try {
        return localStorage.getItem(CONSENT_KEY) === 'true';
      } catch {
        return false;
      }
    },
  };
}
