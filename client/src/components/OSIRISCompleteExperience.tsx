/**
 * OSIRIS Complete Cinematic & Music Integration
 * Final integration of all cinematic components with music tracks from MUSIC-BG
 * Creates the complete immersive Arabic multimedia novel experience
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { EnhancedCinematicIntegration } from '@/components/EnhancedCinematicIntegration';
import { CinematicCompositionEngine } from '@/lib/cinematicCompositionEngine';
import { CulturalAudioEngine } from '@/lib/culturalAudioEngine';
import { MusicIntegrationEngine } from '@/lib/musicIntegrationEngine';
import { useRTL } from '@/hooks/useRTL';
import { useSettings } from '@/hooks/useSettings';
import '@/styles/cinematic.css';
import '@/styles/enhanced-cinematic-music.css';

/**
 * Complete OSIRIS Experience Manager
 * Manages the full cinematic and musical experience
 */
export class OSIRISExperienceManager {
  private static instance: OSIRISExperienceManager;
  private compositionEngine: CinematicCompositionEngine;
  private audioEngine: CulturalAudioEngine;
  private musicEngine: MusicIntegrationEngine;
  private isInitialized = false;
  private currentExperience: any = null;
  private musicVolume = 0.8;
  private cinematicVolume = 0.7;

  private constructor() {
    this.compositionEngine = CinematicCompositionEngine.getInstance();
    this.audioEngine = CulturalAudioEngine.getInstance();
    this.musicEngine = MusicIntegrationEngine.getInstance();
  }

  static getInstance(): OSIRISExperienceManager {
    if (!OSIRISExperienceManager.instance) {
      OSIRISExperienceManager.instance = new OSIRISExperienceManager();
    }
    return OSIRISExperienceManager.instance;
  }

  /**
   * Initialize the complete OSIRIS experience
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🎬🎵 Initializing OSIRIS Complete Experience System...');
      
      // Initialize all engines
      await Promise.all([
        this.audioEngine.initialize(),
        this.musicEngine.initialize()
      ]);

      // Set initial volumes
      this.audioEngine.setMasterVolume(this.cinematicVolume);
      this.musicEngine.setMasterVolume(this.musicVolume);

      this.isInitialized = true;
      console.log('✅ OSIRIS Complete Experience System ready');
    } catch (error) {
      console.error('❌ Failed to initialize OSIRIS Experience:', error);
      throw error;
    }
  }

  /**
   * Create complete experience for a scene
   */
  async createCompleteExperience(sceneData: any): Promise<CompleteOSIRISExperience> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log(`🎬 Creating complete experience for scene: ${sceneData.id}`);

      // Generate cinematic composition
      const composition = await this.compositionEngine.generateComposition(
        sceneData,
        sceneData.emotionalContext || 'contemplative',
        sceneData.culturalContext || { setting: 'historical', timeOfDay: 'night' }
      );

      // Generate cultural audio
      const audioProfile = await this.audioEngine.generateCulturalAudio(
        sceneData.emotionalContext || 'contemplative',
        sceneData.culturalContext || { setting: 'historical', timeOfDay: 'night' },
        sceneData.duration || 60
      );

      // Get music mapping
      const musicMapping = this.musicEngine.getSceneMusicMapping(sceneData.id);

      // Create complete experience
      const experience: CompleteOSIRISExperience = {
        id: `osiris-complete-${sceneData.id}-${Date.now()}`,
        scene: sceneData,
        composition,
        audioProfile,
        musicMapping,
        musicAssets: this.getMusicAssetsForScene(sceneData.id),
        voiceAssets: this.getVoiceAssetsForScene(sceneData.id),
        culturalContext: sceneData.culturalContext,
        emotionalContext: sceneData.emotionalContext,
        duration: sceneData.duration || 60,
        timestamp: Date.now()
      };

      this.currentExperience = experience;
      return experience;
    } catch (error) {
      console.error('Failed to create complete OSIRIS experience:', error);
      throw error;
    }
  }

  /**
   * Get music assets for scene
   */
  private getMusicAssetsForScene(sceneId: string): Record<string, string> {
    const musicAssets: Record<string, string> = {};
    
    // Map scene IDs to music tracks from MUSIC-BG folder
    const sceneMusicMap: Record<string, string[]> = {
      // Opening scenes
      'zero-1-1-summons': ['courtroom-cosmic', 'main-theme'],
      'zero-1-2-opening-statement': ['main-theme'],
      
      // Tariq scenes
      'part-1-tariq-promise': ['tariq-tragedy', 'main-theme'],
      'part-1-tariq-discovery': ['tariq-tragedy'],
      
      // Golden Calf scenes
      'sinai-desert-scenes': ['golden-calf-desert', 'main-theme'],
      'golden-calf-mass-hysteria': ['golden-calf-desert'],
      
      // Nicaea scenes
      'nicaea-council-scenes': ['nicaea-byzantine', 'main-theme'],
      'constantine-manipulation': ['nicaea-byzantine'],
      
      // Andalus scenes
      'andalus-scenes': ['andalus-elegy', 'main-theme'],
      'abu-abdullah-granada': ['andalus-elegy'],
      
      // Karbala scenes
      'karbala-scenes': ['karbala-spiritual', 'main-theme'],
      'hussein-sacrifice': ['karbala-spiritual'],
      
      // Final confrontation
      'final-confrontation': ['digital-confrontation', 'action-escape'],
      'yahya-choice': ['digital-confrontation'],
      
      // Resolution
      'resolution-scenes': ['bittersweet-resolution', 'main-theme'],
      'credits-finale': ['credits-finale', 'main-theme']
    };

    const tracks = sceneMusicMap[sceneId] || ['main-theme'];
    
    tracks.forEach(trackId => {
      const trackUrl = this.getMusicTrackUrl(trackId);
      if (trackUrl) {
        musicAssets[trackId] = trackUrl;
      }
    });

    return musicAssets;
  }

  /**
   * Get voice assets for scene
   */
  private getVoiceAssetsForScene(sceneId: string): Record<string, string> {
    const voiceAssets: Record<string, string> = {};
    
    // Map specific scenes to voice files
    if (sceneId.includes('opening-statement')) {
      voiceAssets['opening-statement'] = '/music/VOICE%2001%20%E2%80%94%20%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D9%81%D8%B9%D8%A9%20%D8%A7%D9%84%D8%A7%D9%81%D8%AA%D8%AA%D8%A7%D8%AD%D9%8A%D8%A9%20(%D8%A7%D9%84%D8%A3%D9%8A%D9%82%D9%88%D9%86%D9%8A%D8%A9%20%D8%A7%D9%84%D9%83%D8%A8%D8%B1%D9%89).wav';
    }
    
    if (sceneId.includes('iblis')) {
      voiceAssets['iblis-voice'] = '/music/devil-voice-to-clone.wav';
    }

    return voiceAssets;
  }

  /**
   * Get music track URL
   */
  private getMusicTrackUrl(trackId: string): string | null {
    const musicTrackMap: Record<string, string> = {
      'main-theme': '/music/TRACK%2001%20%E2%80%94%20%D8%A7%D9%84%D8%AB%D9%8A%D9%85%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%20%D9%84%D9%84%D8%B1%D9%88%D8%A7%D9%8A%D8%A9.mp3',
      'courtroom-cosmic': '/music/TRACK%2002%20%E2%80%94%20%D8%A7%D9%84%D8%AC%D8%B2%D8%A1%20%D8%A7%D9%84%D8%B5%D9%81%D8%B1-%D8%BA%D8%B1%D9%81%D8%A9%20%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%83%D9%85%D8%A9%20%D8%A7%D9%84%D9%83%D9%88%D9%86%D9%8A%D8%A9.m4a',
      'iblis-theme': '/music/devil-voice-to-clone.m4a',
      'tariq-tragedy': '/music/TRACK-04.m4a',
      'golden-calf-desert': '/music/TRACK%2005.m4a',
      'nicaea-byzantine': '/music/TRACK%2006.m4a',
      'andalus-elegy': '/music/TRACK%2007.m4a',
      'totalitarian-horror': '/music/TRACK%2008.m4a',
      'karbala-spiritual': '/music/TRACK%2009.m4a',
      'digital-confrontation': '/music/TRACK%2010.m4a',
      'bittersweet-resolution': '/music/TRACK%2011.m4a',
      'action-escape': '/music/TRACK%2012.m4a',
      'dream-before-battle': '/music/TRACK%2013.m4a',
      'credits-finale': '/music/TRACK%2011.m4a'
    };

    return musicTrackMap[trackId] || null;
  }

  /**
   * Play complete experience
   */
  async playCompleteExperience(experience: CompleteOSIRISExperience): Promise<void> {
    console.log(`🎬🎵 Playing complete OSIRIS experience: ${experience.id}`);

    // Play music for the scene
    if (experience.musicMapping) {
      await this.musicEngine.playSceneMusic(experience.scene.id);
    }

    // Play cultural audio
    if (experience.audioProfile) {
      await this.audioEngine.playCulturalAudio(experience.audioProfile);
    }

    console.log('✅ Complete OSIRIS experience playing');
  }

  /**
   * Stop all audio
   */
  stopAllAudio(): void {
    this.musicEngine.stopAllMusic();
    this.audioEngine.stopAllAudio();
    console.log('🛑 All OSIRIS audio stopped');
  }

  /**
   * Set volume levels
   */
  setVolume(musicVolume: number, cinematicVolume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, musicVolume));
    this.cinematicVolume = Math.max(0, Math.min(1, cinematicVolume));
    
    this.musicEngine.setMasterVolume(this.musicVolume);
    this.audioEngine.setMasterVolume(this.cinematicVolume);
  }

  /**
   * Get current experience
   */
  getCurrentExperience(): CompleteOSIRISExperience | null {
    return this.currentExperience;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.stopAllAudio();
    
    await Promise.all([
      this.audioEngine.cleanup(),
      this.musicEngine.cleanup()
    ]);
    
    this.isInitialized = false;
    this.currentExperience = null;
  }
}

/**
 * Complete OSIRIS Experience interface
 */
export interface CompleteOSIRISExperience {
  id: string;
  scene: any;
  composition: any;
  audioProfile: any;
  musicMapping: any;
  musicAssets: Record<string, string>;
  voiceAssets: Record<string, string>;
  culturalContext: any;
  emotionalContext: string;
  duration: number;
  timestamp: number;
}

/**
 * Main OSIRIS Complete Experience Component
 */
export const OSIRISCompleteExperience: React.FC = () => {
  const [location] = useLocation();
  const { isRTL } = useRTL();
  const { settings } = useSettings();
  
  const [experienceManager] = useState(() => OSIRISExperienceManager.getInstance());
  const [currentExperience, setCurrentExperience] = useState<CompleteOSIRISExperience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.8);
  const [cinematicVolume, setCinematicVolume] = useState(0.7);

  /**
   * Initialize complete OSIRIS experience
   */
  useEffect(() => {
    const initializeExperience = async () => {
      try {
        setIsLoading(true);
        await experienceManager.initialize();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize OSIRIS experience:', error);
        setError('Failed to initialize complete OSIRIS experience');
        setIsLoading(false);
      }
    };

    initializeExperience();

    return () => {
      experienceManager.cleanup();
    };
  }, [experienceManager]);

  /**
   * Create complete experience for current scene
   */
  const createCompleteExperience = useCallback(async (sceneId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get scene data (mock for now, would come from scene system)
      const sceneData = {
        id: sceneId,
        title: `Scene ${sceneId}`,
        emotionalContext: getEmotionalContextForScene(sceneId),
        culturalContext: getCulturalContextForScene(sceneId),
        duration: getDurationForScene(sceneId),
        dialogue: [
          {
            character: 'Narrator',
            text: 'The cosmic courtroom awaits...',
            arabicText: 'قاعة المحكمة الكونية تنتظر...'
          }
        ]
      };

      // Create complete experience
      const experience = await experienceManager.createCompleteExperience(sceneData);
      setCurrentExperience(experience);
      setIsLoading(false);
      
      // Play the complete experience
      if (settings?.cinematicAudio !== false) {
        await experienceManager.playCompleteExperience(experience);
        setIsAudioPlaying(true);
      }
      
      console.log('🎬🎵 Complete OSIRIS experience created and playing');
    } catch (error) {
      console.error('Failed to create complete experience:', error);
      setError('Failed to create complete OSIRIS experience');
      setIsLoading(false);
    }
  }, [experienceManager, settings]);

  /**
   * Handle scene navigation
   */
  useEffect(() => {
    const sceneId = extractSceneIdFromLocation(location);
    if (sceneId && !isLoading) {
      createCompleteExperience(sceneId);
    }
  }, [location, createCompleteExperience, isLoading]);

  /**
   * Handle volume changes
   */
  const handleVolumeChange = useCallback((musicVol: number, cinematicVol: number) => {
    setMusicVolume(musicVol);
    setCinematicVolume(cinematicVol);
    experienceManager.setVolume(musicVol, cinematicVol);
  }, [experienceManager]);

  /**
   * Toggle audio playback
   */
  const toggleAudio = useCallback(async () => {
    if (isAudioPlaying) {
      experienceManager.stopAllAudio();
      setIsAudioPlaying(false);
    } else {
      if (currentExperience) {
        await experienceManager.playCompleteExperience(currentExperience);
        setIsAudioPlaying(true);
      }
    }
  }, [experienceManager, isAudioPlaying, currentExperience]);

  if (isLoading) {
    return (
      <div className="osiris-complete-loading" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="loading-container">
          <div className="osiris-logo-animation">
            <div className="islamic-geometric-logo"></div>
            <div className="cosmic-particles"></div>
          </div>
          <div className="loading-text-content">
            <h1 className="osiris-title" dir="rtl">
              المفسدون في الأرض
            </h1>
            <h2 className="loading-subtitle">
              OSIRIS - The Corruptors of the Earth
            </h2>
            <div className="loading-progress">
              <div className="progress-bar-container">
                <div className="progress-bar-fill"></div>
              </div>
              <p className="loading-status" dir="rtl">
                تهيئة التجربة السينمائية والموسيقية المتكاملة...
              </p>
              <div className="loading-features">
                <span>🎨 Islamic Geometric Patterns</span>
                <span>🎵 Traditional Arabic Music</span>
                <span>🎼 MUSIC-BG Integration</span>
                <span>📖 Interactive Narrative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="osiris-complete-error" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="error-content">
          <div className="error-cosmic-background"></div>
          <h1 className="error-title" dir="rtl">
            خطأ في نظام OSIRIS المتكامل
          </h1>
          <p className="error-subtitle">
            OSIRIS Complete System Error
          </p>
          <div className="error-message">
            <p>{error}</p>
            <p dir="rtl">حدث خطأ في تهيئة التجربة السينمائية والموسيقية المتكاملة</p>
          </div>
          <div className="error-actions">
            <button 
              className="error-retry-button"
              onClick={() => createCompleteExperience(extractSceneIdFromLocation(location))}
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

  return (
    <div className="osiris-complete-experience" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Cosmic background with music visualization */}
      <div className="osiris-cosmic-background">
        <div className="islamic-geometric-overlay"></div>
        <div className="arabic-calligraphy-overlay"></div>
        <div className="sacred-lighting-overlay"></div>
        
        {/* Audio visualization */}
        {isAudioPlaying && (
          <div className="audio-visualization-overlay">
            <div className="music-frequency-bars">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  className="frequency-bar"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
            <div className="cultural-audio-particles"></div>
          </div>
        )}
      </div>

      {/* Main enhanced cinematic integration */}
      <EnhancedCinematicIntegration />

      {/* Complete experience control panel */}
      <div className="osiris-control-panel">
        <div className="audio-controls">
          <div className="volume-control">
            <label dir="rtl">موسيقى:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value), cinematicVolume)}
              className="volume-slider"
            />
            <span>{Math.round(musicVolume * 100)}%</span>
          </div>
          <div className="volume-control">
            <label dir="rtl">صوت سينمائي:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={cinematicVolume}
              onChange={(e) => handleVolumeChange(musicVolume, parseFloat(e.target.value))}
              className="volume-slider"
            />
            <span>{Math.round(cinematicVolume * 100)}%</span>
          </div>
        </div>
        
        <div className="experience-controls">
          <button 
            className={`audio-toggle-button ${isAudioPlaying ? 'playing' : 'paused'}`}
            onClick={toggleAudio}
            aria-label={isAudioPlaying ? 'إيقاف الصوت' : 'تشغيل الصوت'}
          >
            <span className="audio-icon">{isAudioPlaying ? '🔊🎼' : '🔇'}</span>
            <span className="audio-text" dir="rtl">
              {isAudioPlaying ? 'الصوت يعمل' : 'تشغيل الصوت'}
            </span>
          </button>
        </div>
      </div>

      {/* Experience status indicators */}
      <div className="experience-status">
        <div className="status-item">
          <span className="status-icon">🎬</span>
          <span className="status-text" dir="rtl">سينمائي</span>
        </div>
        <div className="status-item">
          <span className="status-icon">🎵</span>
          <span className="status-text" dir="rtl">موسيقى عربية</span>
        </div>
        <div className="status-item">
          <span className="status-icon">🎼</span>
          <span className="status-text">MUSIC-BG</span>
        </div>
        {isAudioPlaying && (
          <div className="status-item active">
            <span className="status-icon">✨</span>
            <span className="status-text" dir="rtl">متكامل</span>
          </div>
        )}
      </div>

      {/* Cultural immersion info */}
      <div className="cultural-immersion-info">
        <h3 className="immersion-title" dir="rtl">التجربة العربية المتكاملة</h3>
        <div className="immersion-features">
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <span className="feature-text" dir="rtl">أنماط هندسية إسلامية تفاعلية</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🖋️</span>
            <span className="feature-text" dir="rtl">خط عربي تقليدي متحرك</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎵</span>
            <span className="feature-text" dir="rtl">موسيقى عربية أصيلة من ملفات MUSIC-BG</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎙️</span>
            <span className="feature-text" dir="rtl">أصوات شخصيات ثقافية</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📖</span>
            <span className="feature-text" dir="rtl">رواية تفاعلية عربية متعددة الوسائط</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper functions for scene analysis
 */
function extractSceneIdFromLocation(location: string): string {
  const match = location.match(/\/scene\/([^\/]+)/);
  return match ? match[1] : 'zero-1-1-summons';
}

function getEmotionalContextForScene(sceneId: string): string {
  const emotionalMap: Record<string, string> = {
    'zero-1-1-summons': 'dark-isolated',
    'zero-1-2-opening-statement': 'cosmic-mystery',
    'part-1-tariq-promise': 'hopeful-tragic',
    'sinai-desert-scenes': 'ancient-mass-hysteria',
    'nicaea-council-scenes': 'sacred-corrupted',
    'andalus-scenes': 'melancholic-beauty',
    'karbala-scenes': 'spiritual-sacrifice',
    'final-confrontation': 'epic-climax',
    'resolution-scenes': 'bittersweet-hope'
  };
  
  return emotionalMap[sceneId] || 'contemplative';
}

function getCulturalContextForScene(sceneId: string): any {
  const culturalMap: Record<string, any> = {
    'zero-1-1-summons': { setting: 'digital-courtroom', timeOfDay: 'night', historicalPeriod: 'modern' },
    'zero-1-2-opening-statement': { setting: 'cosmic-void', timeOfDay: 'eternal', historicalPeriod: 'prehistoric' },
    'part-1-tariq-promise': { setting: 'modern-lab', timeOfDay: 'night', historicalPeriod: 'contemporary' },
    'sinai-desert-scenes': { setting: 'desert', timeOfDay: 'dawn', historicalPeriod: 'ancient' },
    'nicaea-council-scenes': { setting: 'byzantine-court', timeOfDay: 'morning', historicalPeriod: 'medieval' },
    'andalus-scenes': { setting: 'granada-palace', timeOfDay: 'sunset', historicalPeriod: 'medieval' },
    'karbala-scenes': { setting: 'desert-battlefield', timeOfDay: 'noon', historicalPeriod: 'medieval' },
    'final-confrontation': { setting: 'digital-realm', timeOfDay: 'eternal', historicalPeriod: 'contemporary' },
    'resolution-scenes': { setting: 'global-awakening', timeOfDay: 'dawn', historicalPeriod: 'contemporary' }
  };
  
  return culturalMap[sceneId] || { setting: 'historical', timeOfDay: 'night', historicalPeriod: 'medieval' };
}

function getDurationForScene(sceneId: string): number {
  const durationMap: Record<string, number> = {
    'zero-1-1-summons': 45,
    'zero-1-2-opening-statement': 60,
    'part-1-tariq-promise': 90,
    'sinai-desert-scenes': 75,
    'nicaea-council-scenes': 80,
    'andalus-scenes': 85,
    'karbala-scenes': 95,
    'final-confrontation': 100,
    'resolution-scenes': 50
  };
  
  return durationMap[sceneId] || 60;
}

export default OSIRISCompleteExperience;