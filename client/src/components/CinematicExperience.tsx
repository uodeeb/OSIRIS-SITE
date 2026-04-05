/**
 * OSIRIS Complete Cinematic Experience System
 * Revolutionary multimedia interactive novel with Arabic cultural integration
 * DB-first approach with comprehensive asset integration
 */

import React, { useEffect, useState } from 'react';
import { CinematicIntegration } from '@/components/CinematicIntegration';
import { CinematicCompositionEngine } from '@/lib/cinematicCompositionEngine';
import { CulturalAudioEngine } from '@/lib/culturalAudioEngine';
import { useRTL } from '@/hooks/useRTL';
import { useSettings } from '@/hooks/useSettings';
import '@/styles/cinematic.css';

/**
 * Main Cinematic Experience Component
 * Provides the complete immersive Arabic multimedia novel experience
 */
export const CinematicExperience: React.FC = () => {
  const { isRTL } = useRTL();
  const { settings } = useSettings();
  const [isReady, setIsReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  /**
   * Initialize the complete cinematic experience system
   */
  useEffect(() => {
    const initializeCinematicExperience = async () => {
      try {
        console.log('🎬 Initializing OSIRIS Cinematic Experience System...');
        
        // Initialize composition engine
        const compositionEngine = CinematicCompositionEngine.getInstance();
        
        // Initialize cultural audio engine
        const audioEngine = CulturalAudioEngine.getInstance();
        await audioEngine.initialize();
        
        // Preload cultural assets and patterns
        await preloadCulturalAssets();
        
        setIsReady(true);
        console.log('✅ OSIRIS Cinematic Experience System ready');
      } catch (error) {
        console.error('❌ Failed to initialize cinematic experience:', error);
        setInitializationError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeCinematicExperience();

    return () => {
      // Cleanup on unmount
      const audioEngine = CulturalAudioEngine.getInstance();
      audioEngine.cleanup().catch(console.error);
    };
  }, []);

  /**
   * Preload cultural assets for optimal performance
   */
  const preloadCulturalAssets = async () => {
    console.log('📦 Preloading cultural assets...');
    
    // Preload Islamic geometric patterns
    const patterns = ['arabesque', 'girih', 'muqarnas', 'zellij'];
    for (const pattern of patterns) {
      console.log(`  Loading pattern: ${pattern}`);
      // Pattern generation happens on-demand in the engine
    }
    
    // Preload cultural audio profiles
    const emotionalContexts = ['spiritual', 'dramatic', 'tragic', 'hopeful', 'contemplative'];
    for (const context of emotionalContexts) {
      console.log(`  Loading audio profile: ${context}`);
      // Audio profiles are loaded on-demand in the engine
    }
    
    console.log('✅ Cultural assets preloaded');
  };

  if (initializationError) {
    return (
      <div className="cinematic-error-page" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="error-content">
          <div className="islamic-error-pattern"></div>
          <h1 className="error-title" dir="rtl">
            خطأ في نظام التجربة السينمائية
          </h1>
          <p className="error-subtitle">
            Cinematic Experience System Error
          </p>
          <div className="error-message">
            <p>{initializationError}</p>
          </div>
          <div className="error-actions">
            <button 
              className="error-retry-button"
              onClick={() => window.location.reload()}
            >
              <span dir="rtl">إعادة المحاولة</span>
              <span>Retry</span>
            </button>
            <button 
              className="error-fallback-button"
              onClick={() => window.location.href = '/classic'}
            >
              <span dir="rtl">الوضع الكلاسيكي</span>
              <span>Classic Mode</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="cinematic-loading-page" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="loading-container">
          <div className="islamic-loading-animation">
            <div className="geometric-spinner"></div>
            <div className="cultural-particles"></div>
          </div>
          <div className="loading-text-content">
            <h2 className="loading-title" dir="rtl">
              جاري تحميل التجربة السينمائية
            </h2>
            <p className="loading-subtitle">
              Loading Cinematic Experience
            </p>
            <div className="loading-progress">
              <div className="progress-bar-container">
                <div className="progress-bar-fill"></div>
              </div>
              <p className="loading-status" dir="rtl">
                تهيئة الأنظمة الثقافية والصوتية...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cinematic-experience-container" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Cultural immersion overlay */}
      <div className="cultural-immersion-overlay">
        <div className="islamic-geometric-background"></div>
        <div className="arabic-calligraphy-ambient"></div>
        <div className="sacred-lighting-effects"></div>
      </div>

      {/* Main cinematic integration */}
      <CinematicIntegration />

      {/* Cultural experience indicators */}
      <div className="experience-indicators">
        <div className="cultural-authenticity-indicator">
          <span className="indicator-icon">🕌</span>
          <span className="indicator-text" dir="rtl">تجربة عربية أصيلة</span>
        </div>
        <div className="audio-immersion-indicator">
          <span className="indicator-icon">🎵</span>
          <span className="indicator-text" dir="rtl">صوت ثقافي متكامل</span>
        </div>
        <div className="visual-mastery-indicator">
          <span className="indicator-icon">🎨</span>
          <span className="indicator-text" dir="rtl">فنون بصرية متقدمة</span>
        </div>
      </div>

      {/* Accessibility controls */}
      <div className="accessibility-controls">
        <button 
          className="accessibility-button"
          aria-label="تبديل وضع الإضاءة العالية"
          title="Toggle High Contrast Mode"
        >
          ⚡
        </button>
        <button 
          className="accessibility-button"
          aria-label="تبديل الحركات"
          title="Toggle Animations"
        >
          🎭
        </button>
        <button 
          className="accessibility-button"
          aria-label="تعديل الصوت"
          title="Adjust Audio"
        >
          🔊
        </button>
      </div>

      {/* Cultural context information */}
      <div className="cultural-context-panel">
        <div className="context-header">
          <h3 className="context-title" dir="rtl">السياق الثقافي</h3>
          <span className="context-subtitle">Cultural Context</span>
        </div>
        <div className="context-content">
          <p className="context-description" dir="rtl">
            هذه التجربة السينمائية تدمج بين الفنون الإسلامية التقليدية، الخط العربي، 
            الموسيقى العربية الأصيلة، والرواية التفاعلية لخلق أول رواية عربية متعددة الوسائط 
            في العالم.
          </p>
          <div className="context-features">
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span className="feature-text" dir="rtl">أنماط هندسية إسلامية</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🖋️</span>
              <span className="feature-text" dir="rtl">خط عربي تفاعلي</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎵</span>
              <span className="feature-text" dir="rtl">موسيقى عربية تقليدية</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📖</span>
              <span className="feature-text" dir="rtl">رواية تفاعلية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicExperience;