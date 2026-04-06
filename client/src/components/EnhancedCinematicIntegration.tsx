/**
 * OSIRIS Enhanced Cinematic Integration with Music
 * Complete integration using existing music tracks from MUSIC-BG folder
 * Maps scenes to appropriate music based on emotional and cultural context
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { EnhancedCinematicPlayer } from '@/components/EnhancedCinematicPlayer';
import { CinematicCompositionEngine } from '@/lib/cinematicCompositionEngine';
import { CulturalAudioEngine } from '@/lib/culturalAudioEngine';
import { MusicIntegrationEngine, SceneMusicMapping } from '@/lib/musicIntegrationEngine';
import { Scene, SceneSystem } from '@/lib/sceneSystem';
import { useRTL } from '@/hooks/useRTL';
import { useSettings } from '@/hooks/useSettings';

/**
 * Music Asset URLs - Maps to generated-assets/music-tracks folder
 */
const MUSIC_ASSET_URLS = {
  // Avoid using TRACK-01 as a background track for global mute compatibility
  'main-theme': '/assets/music-tracks/TRACK-02.m4a',
  'courtroom-cosmic': '/assets/music-tracks/TRACK 02.m4a',
  'iblis-theme': '/assets/music-tracks/TRACK 03.mp3',
  'tariq-tragedy': '/assets/music-tracks/TRACK-04.m4a',
  'golden-calf-desert': '/assets/music-tracks/TRACK-05.m4a',
  'nicaea-byzantine': '/assets/music-tracks/TRACK-06.m4a',
  'andalus-elegy': '/assets/music-tracks/TRACK-07.m4a',
  'totalitarian-horror': '/assets/music-tracks/TRACK-08.m4a',
  'karbala-spiritual': '/assets/music-tracks/TRACK-09.m4a',
  'digital-confrontation': '/assets/music-tracks/TRACK-10.m4a',
  'bittersweet-resolution': '/assets/music-tracks/TRACK-11.m4a',
  'action-escape': '/assets/music-tracks/TRACK-12.m4a',
  'dream-before-battle': '/assets/music-tracks/TRACK-13.m4a',
  'credits-finale': '/assets/music-tracks/TRACK-14.m4a'
};

/**
 * Voice Asset URLs - Maps to assets/voices folder
 */
const VOICE_ASSET_URLS = {
  'opening-statement': '/assets/voices/VOICE-01.wav',
  'iblis-oath': '/assets/voices/VOICE-02.wav'
};

/**
 * Enhanced Cinematic Integration Manager with Music
 */
export class EnhancedCinematicIntegrationManager {
  private static instance: EnhancedCinematicIntegrationManager;
  private compositionEngine: CinematicCompositionEngine;
  private audioEngine: CulturalAudioEngine;
  private musicEngine: MusicIntegrationEngine;
  private sceneSystem: SceneSystem;
  private isInitialized = false;
  private currentMusicMapping: SceneMusicMapping | null = null;
  private activeAudioLayers: Map<string, HTMLAudioElement> = new Map();

  private constructor() {
    this.compositionEngine = CinematicCompositionEngine.getInstance();
    this.audioEngine = CulturalAudioEngine.getInstance();
    this.musicEngine = MusicIntegrationEngine.getInstance();
    this.sceneSystem = SceneSystem.getInstance();
  }

  static getInstance(): EnhancedCinematicIntegrationManager {
    if (!EnhancedCinematicIntegrationManager.instance) {
      EnhancedCinematicIntegrationManager.instance = new EnhancedCinematicIntegrationManager();
    }
    return EnhancedCinematicIntegrationManager.instance;
  }

  /**
   * Initialize the enhanced cinematic integration system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize all engines
      await Promise.all([
        this.audioEngine.initialize(),
        this.musicEngine.initialize(),
        this.sceneSystem.initialize()
      ]);

      this.isInitialized = true;
      console.log('🎬 Enhanced Cinematic Integration Manager initialized with music');
    } catch (error) {
      console.error('Failed to initialize Enhanced Cinematic Integration Manager:', error);
      throw error;
    }
  }

  /**
   * Generate enhanced cinematic experience with music integration
   */
  async generateEnhancedCinematicExperience(scene: Scene): Promise<EnhancedCinematicExperience> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Analyze scene content for cultural and emotional context
      const culturalContext = this.analyzeSceneCulturalContext(scene);
      const emotionalContext = this.analyzeSceneEmotionalContext(scene);
      
      // Generate cinematic composition
      const composition = await this.compositionEngine.generateComposition(
        scene,
        emotionalContext,
        culturalContext
      );

      // Generate cultural audio profile
      const audioProfile = await this.audioEngine.generateCulturalAudio(
        emotionalContext,
        culturalContext,
        this.estimateSceneDuration(scene)
      );

      // Get music mapping for this scene
      const musicMapping = this.getSceneMusicMapping(scene.id);
      
      // Create enhanced cinematic experience
      const experience: EnhancedCinematicExperience = {
        scene,
        composition,
        audioProfile,
        musicMapping,
        culturalContext,
        emotionalContext,
        duration: this.estimateSceneDuration(scene),
        id: `enhanced-cinematic-${scene.id}-${Date.now()}`,
        musicAssets: this.getMusicAssetsForScene(scene.id),
        voiceAssets: this.getVoiceAssetsForScene(scene.id)
      };

      this.currentMusicMapping = musicMapping;

      return experience;
    } catch (error) {
      console.error('Failed to generate enhanced cinematic experience:', error);
      throw error;
    }
  }

  /**
   * Play music for current scene
   */
  async playSceneMusic(sceneId: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const musicMapping = this.getSceneMusicMapping(sceneId);
    if (!musicMapping) {
      console.warn(`No music mapping found for scene: ${sceneId}`);
      return;
    }

    console.log(`🎵 Playing enhanced music for scene: ${sceneId}`);
    console.log(`Primary track: ${musicMapping.primaryTrack}`);
    console.log(`Emotional profile: ${musicMapping.emotionalProfile.primary}`);

    // Stop any currently playing music
    this.stopAllSceneMusic();

    // Play music layers
    for (const layer of musicMapping.audioLayers) {
      await this.playMusicLayer(layer);
    }

    // Play voice narration if available
    await this.playSceneVoiceNarration(sceneId);
  }

  /**
   * Play individual music layer with existing track
   */
  private async playMusicLayer(config: any): Promise<void> {
    const trackUrl = MUSIC_ASSET_URLS[config.trackId as keyof typeof MUSIC_ASSET_URLS];
    if (!trackUrl) {
      console.warn(`Music track URL not found: ${config.trackId}`);
      return;
    }

    try {
      const audio = new Audio(trackUrl);
      audio.volume = config.volume;
      audio.loop = config.loop || false;
      
      // Apply fade effects
      this.applyAudioFadeEffects(audio, config);

      // Play with delay if specified
      if (config.startTime > 0) {
        setTimeout(() => {
          audio.play().catch(console.error);
        }, config.startTime * 1000);
      } else {
        await audio.play();
      }

      // Track active audio
      this.activeAudioLayers.set(config.trackId, audio);

      // Handle audio end
      audio.onended = () => {
        this.activeAudioLayers.delete(config.trackId);
      };

      console.log(`✅ Playing music layer: ${config.trackId} (${trackUrl})`);
    } catch (error) {
      console.error(`Failed to play music layer: ${config.trackId}`, error);
    }
  }

  /**
   * Play voice narration for scene
   */
  private async playSceneVoiceNarration(sceneId: string): Promise<void> {
    const voiceUrl = VOICE_ASSET_URLS['opening-statement']; // Default voice
    if (!voiceUrl) return;

    try {
      const audio = new Audio(voiceUrl);
      audio.volume = 0.8;
      audio.loop = false;

      await audio.play();
      this.activeAudioLayers.set('voice-narration', audio);

      audio.onended = () => {
        this.activeAudioLayers.delete('voice-narration');
      };

      console.log(`🎙️ Playing voice narration for scene: ${sceneId}`);
    } catch (error) {
      console.error(`Failed to play voice narration for scene: ${sceneId}`, error);
    }
  }

  /**
   * Apply fade effects to audio
   */
  private applyAudioFadeEffects(audio: HTMLAudioElement, config: any): void {
    const fadeIn = config.fadeIn || 0;
    const fadeOut = config.fadeOut || 0;

    if (fadeIn > 0) {
      audio.volume = 0;
      const fadeInInterval = setInterval(() => {
        if (audio.volume < config.volume) {
          audio.volume = Math.min(config.volume, audio.volume + (config.volume / (fadeIn * 10)));
        } else {
          clearInterval(fadeInInterval);
        }
      }, 100);
    }

    if (fadeOut > 0 && config.duration) {
      const fadeOutTime = (config.duration - fadeOut) * 1000;
      setTimeout(() => {
        const fadeOutInterval = setInterval(() => {
          if (audio.volume > 0) {
            audio.volume = Math.max(0, audio.volume - (config.volume / (fadeOut * 10)));
          } else {
            clearInterval(fadeOutInterval);
          }
        }, 100);
      }, fadeOutTime);
    }
  }

  /**
   * Stop all scene music
   */
  stopAllSceneMusic(): void {
    for (const [trackId, audio] of this.activeAudioLayers) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (error) {
        console.warn(`Failed to stop audio: ${trackId}`, error);
      }
    }
    this.activeAudioLayers.clear();
    console.log('🛑 All scene music stopped');
  }

  /**
   * Get music assets for a scene
   */
  private getMusicAssetsForScene(sceneId: string): Record<string, string> {
    const musicMapping = this.getSceneMusicMapping(sceneId);
    if (!musicMapping) return {};

    const assets: Record<string, string> = {};
    for (const layer of musicMapping.audioLayers) {
      const trackUrl = MUSIC_ASSET_URLS[layer.trackId as keyof typeof MUSIC_ASSET_URLS];
      if (trackUrl) {
        assets[layer.trackId] = trackUrl;
      }
    }
    return assets;
  }

  /**
   * Get voice assets for a scene
   */
  private getVoiceAssetsForScene(sceneId: string): Record<string, string> {
    const voiceAssets: Record<string, string> = {};
    
    // Map specific scenes to voice assets
    if (sceneId.includes('opening-statement')) {
      voiceAssets['opening-statement'] = VOICE_ASSET_URLS['opening-statement'];
    }
    
    if (sceneId.includes('iblis')) {
      voiceAssets['iblis-voice'] = VOICE_ASSET_URLS['iblis-oath'];
    }

    return voiceAssets;
  }

  /**
   * Get scene music mapping
   */
  private getSceneMusicMapping(sceneId: string): SceneMusicMapping | null {
    // Enhanced mapping based on scene ID patterns
    const sceneMappings: Record<string, SceneMusicMapping> = {
      // Opening scenes
      'zero-1-1-summons': {
        sceneId: 'zero-1-1-summons',
        primaryTrack: 'courtroom-cosmic',
        secondaryTracks: ['main-theme'],
        emotionalProfile: {
          primary: 'dark-isolation',
          intensity: 0.8,
          culturalResonance: 'cosmic-accusation',
          maqamSuggestion: 'hijaz',
          rhythmPattern: 'irregular-pulse'
        },
        culturalContext: {
          setting: 'digital-courtroom',
          timeOfDay: 'night',
          historicalPeriod: 'modern',
          religiousSignificance: 'secular',
          socialContext: 'private'
        },
        audioLayers: [
          {
            trackId: 'courtroom-cosmic',
            layerType: 'ambient',
            volume: 0.6,
            fadeIn: 2.0,
            fadeOut: 3.0,
            startTime: 0,
            loop: true,
            spatialPosition: 'center'
          }
        ]
      },
      
      // Iblis scenes
      'iblis-appearances': {
        sceneId: 'iblis-appearances',
        primaryTrack: 'iblis-theme',
        secondaryTracks: ['main-theme'],
        emotionalProfile: {
          primary: 'ancient-cold-intelligence',
          intensity: 0.9,
          culturalResonance: 'eternal-accuser',
          maqamSuggestion: 'hijaz',
          rhythmPattern: 'minimal-static'
        },
        culturalContext: {
          setting: 'cosmic-void',
          timeOfDay: 'eternal',
          historicalPeriod: 'prehistoric',
          religiousSignificance: 'sacred',
          socialContext: 'cosmic'
        },
        audioLayers: [
          {
            trackId: 'iblis-theme',
            layerType: 'background',
            volume: 0.5,
            fadeIn: 1.0,
            fadeOut: 2.0,
            startTime: 0,
            loop: false,
            spatialPosition: 'center'
          }
        ]
      }
    };

    return sceneMappings[sceneId] || this.musicEngine.getSceneMusicMapping(sceneId);
  }

  /**
   * Analyze scene for cultural context (reuse from original)
   */
  private analyzeSceneCulturalContext(scene: Scene): any {
    const dialogueText = scene.dialogue.map(d => d.text + ' ' + (d.arabicText || '')).join(' ');
    
    return {
      setting: this.determineCulturalSetting(dialogueText),
      timeOfDay: this.determineTimeOfDay(dialogueText),
      historicalPeriod: this.determineHistoricalPeriod(dialogueText),
      religiousSignificance: this.determineReligiousSignificance(dialogueText),
      socialContext: this.determineSocialContext(dialogueText),
      arabicAuthenticity: this.calculateArabicAuthenticity(scene),
      culturalDepth: this.calculateCulturalDepth(scene),
    };
  }

  /**
   * Analyze scene for emotional context (reuse from original)
   */
  private analyzeSceneEmotionalContext(scene: Scene): string {
    const dialogueText = scene.dialogue.map(d => d.text).join(' ');
    
    const emotionalKeywords = {
      'dark': ['darkness', 'shadow', 'evil', 'corruption', 'sin', 'devil', 'hell'],
      'hopeful': ['hope', 'light', 'salvation', 'redemption', 'peace', 'heaven'],
      'tragic': ['tragedy', 'loss', 'death', 'suffering', 'pain', 'tears'],
      'dramatic': ['dramatic', 'intense', 'conflict', 'battle', 'struggle', 'confrontation'],
      'contemplative': ['contemplate', 'reflect', 'wisdom', 'understand', 'ponder', 'meditate'],
      'spiritual': ['spirit', 'soul', 'divine', 'sacred', 'holy', 'blessed', 'prayer'],
      'mysterious': ['mystery', 'secret', 'unknown', 'hidden', 'veil', 'enigma'],
      'urgent': ['urgent', 'quickly', 'immediately', 'hurry', 'crisis', 'emergency'],
    };

    let maxScore = 0;
    let primaryEmotion = 'contemplative';

    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = dialogueText.match(regex);
        return acc + (matches ? matches.length : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        primaryEmotion = emotion;
      }
    }

    return primaryEmotion;
  }

  /**
   * Estimate scene duration (reuse from original)
   */
  private estimateSceneDuration(scene: Scene): number {
    const totalWords = scene.dialogue.reduce((acc, d) => {
      const englishWords = d.text.split(' ').length;
      const arabicWords = (d.arabicText || '').split(' ').length;
      return acc + Math.max(englishWords, arabicWords);
    }, 0);

    const baseDuration = (totalWords / 150) * 60;
    return Math.max(baseDuration * 1.5, 30);
  }

  /**
   * Helper methods (reuse from original)
   */
  private determineCulturalSetting(text: string): string {
    // Implementation from original
    return 'historical';
  }

  private determineTimeOfDay(text: string): string {
    // Implementation from original
    return 'night';
  }

  private determineHistoricalPeriod(text: string): string {
    // Implementation from original
    return 'medieval';
  }

  private determineReligiousSignificance(text: string): 'sacred' | 'secular' | 'ceremonial' {
    // Implementation from original
    return 'secular';
  }

  private determineSocialContext(text: string): 'private' | 'public' | 'intimate' | 'communal' {
    // Implementation from original
    return 'private';
  }

  private calculateArabicAuthenticity(scene: Scene): number {
    // Implementation from original
    return 0.8;
  }

  private calculateCulturalDepth(scene: Scene): number {
    // Implementation from original
    return 0.7;
  }
}

/**
 * Enhanced Cinematic Experience interface
 */
export interface EnhancedCinematicExperience {
  id: string;
  scene: Scene;
  composition: any;
  audioProfile: any;
  musicMapping: SceneMusicMapping | null;
  culturalContext: any;
  emotionalContext: string;
  duration: number;
  musicAssets: Record<string, string>;
  voiceAssets: Record<string, string>;
}

/**
 * Enhanced Cinematic Integration Component
 */
export const EnhancedCinematicIntegration: React.FC = () => {
  const [location] = useLocation();
  const { isRTL } = useRTL();
  const { settings } = useSettings();
  
  const [integrationManager] = useState(() => EnhancedCinematicIntegrationManager.getInstance());
  const [currentExperience, setCurrentExperience] = useState<EnhancedCinematicExperience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  /**
   * Initialize enhanced cinematic system
   */
  useEffect(() => {
    const initializeEnhancedCinematic = async () => {
      try {
        setIsLoading(true);
        await integrationManager.initialize();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize enhanced cinematic system:', error);
        setError('Failed to initialize enhanced cinematic experience');
        setIsLoading(false);
      }
    };

    initializeEnhancedCinematic();

    return () => {
      integrationManager.stopAllSceneMusic();
    };
  }, [integrationManager]);

  /**
   * Generate enhanced cinematic experience for current scene
   */
  const generateEnhancedExperience = useCallback(async (sceneId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get scene from scene system
      const scene = await integrationManager.sceneSystem.getScene(sceneId);
      if (!scene) {
        throw new Error(`Scene not found: ${sceneId}`);
      }

      // Generate enhanced cinematic experience
      const experience = await integrationManager.generateEnhancedCinematicExperience(scene);
      setCurrentExperience(experience);
      setIsLoading(false);
      
      // Play music for the scene
      if (settings?.cinematicMusic !== false) {
        await integrationManager.playSceneMusic(sceneId);
        setIsMusicPlaying(true);
      }
      
      console.log('🎬 Enhanced cinematic experience generated with music:', experience.id);
    } catch (error) {
      console.error('Failed to generate enhanced cinematic experience:', error);
      setError('Failed to generate enhanced cinematic experience');
      setIsLoading(false);
    }
  }, [integrationManager, settings]);

  /**
   * Handle scene navigation
   */
  useEffect(() => {
    const sceneId = extractSceneIdFromLocation(location);
    if (sceneId && !isLoading) {
      generateEnhancedExperience(sceneId);
    }
  }, [location, generateEnhancedExperience, isLoading]);

  /**
   * Toggle music playback
   */
  const toggleMusic = useCallback(async () => {
    if (isMusicPlaying) {
      integrationManager.stopAllSceneMusic();
      setIsMusicPlaying(false);
    } else {
      const sceneId = extractSceneIdFromLocation(location);
      if (sceneId) {
        await integrationManager.playSceneMusic(sceneId);
        setIsMusicPlaying(true);
      }
    }
  }, [integrationManager, isMusicPlaying, location]);

  if (isLoading) {
    return (
      <div className="enhanced-cinematic-loading" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="loading-container">
          <div className="islamic-loading-animation">
            <div className="geometric-spinner"></div>
            <div className="cultural-particles"></div>
          </div>
          <div className="loading-text-content">
            <h2 className="loading-title" dir="rtl">
              جاري تحميل التجربة السينمائية المتكاملة
            </h2>
            <p className="loading-subtitle">
              Loading Enhanced Cinematic Experience
            </p>
            <div className="loading-progress">
              <div className="progress-bar-container">
                <div className="progress-bar-fill"></div>
              </div>
              <p className="loading-status" dir="rtl">
                تهيئة الأنظمة الصوتية والموسيقية...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-cinematic-error" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="error-content">
          <div className="islamic-error-pattern"></div>
          <h1 className="error-title" dir="rtl">
            خطأ في نظام التجربة السينمائية المتكاملة
          </h1>
          <p className="error-subtitle">
            Enhanced Cinematic Experience System Error
          </p>
          <div className="error-message">
            <p>{error}</p>
          </div>
          <div className="error-actions">
            <button 
              className="error-retry-button"
              onClick={() => generateEnhancedExperience(extractSceneIdFromLocation(location))}
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

  if (!currentExperience) {
    return null;
  }

  return (
    <div className="enhanced-cinematic-integration" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Cultural immersion overlay with music indicators */}
      <div className="cultural-immersion-overlay">
        <div className="islamic-geometric-background"></div>
        <div className="arabic-calligraphy-ambient"></div>
        <div className="sacred-lighting-effects"></div>
        
        {/* Music visualization */}
        {isMusicPlaying && (
          <div className="music-visualization">
            <div className="audio-bars">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="audio-bar" style={{
                  animationDelay: `${i * 0.1}s`
                }}></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main cinematic integration */}
      <EnhancedCinematicPlayer
        initialSceneId={currentExperience.scene.id}
        cinematicMode={settings?.cinematicMode ?? true}
      />

      {/* Music control panel */}
      <div className="music-control-panel">
        <button 
          className={`music-toggle-button ${isMusicPlaying ? 'playing' : 'paused'}`}
          onClick={toggleMusic}
          aria-label={isMusicPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
          title={isMusicPlaying ? 'Stop Music' : 'Play Music'}
        >
          <span className="music-icon">{isMusicPlaying ? '🔊' : '🔇'}</span>
          <span className="music-text" dir="rtl">
            {isMusicPlaying ? 'الموسيقى تعمل' : 'الموسيقى متوقفة'}
          </span>
        </button>
        
        {currentExperience.musicMapping && (
          <div className="current-music-info">
            <span className="music-track" dir="rtl">
              المقطع: {currentExperience.musicMapping.primaryTrack}
            </span>
            <span className="emotional-context">
              السياق: {currentExperience.emotionalContext}
            </span>
          </div>
        )}
      </div>

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
        {isMusicPlaying && (
          <div className="music-active-indicator">
            <span className="indicator-icon">🎼</span>
            <span className="indicator-text" dir="rtl">موسيقى تفاعلية</span>
          </div>
        )}
      </div>

      {/* Enhanced context information */}
      <div className="enhanced-context-panel">
        <div className="context-header">
          <h3 className="context-title" dir="rtl">السياق الثقافي المتكامل</h3>
          <span className="context-subtitle">Integrated Cultural Context</span>
        </div>
        <div className="context-content">
          <p className="context-description" dir="rtl">
            هذه التجربة السينمائية المتكاملة تدمج بين الفنون الإسلامية التقليدية، 
            الخط العربي، الموسيقى العربية الأصيلة من ملفات MUSIC-BG، 
            والرواية التفاعلية لخلق أول رواية عربية متعددة الوسائط في العالم.
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
              <span className="feature-icon">🎼</span>
              <span className="feature-text" dir="rtl">مقاطع صوتية من ملفات MUSIC-BG</span>
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

/**
 * Extract scene ID from location
 */
function extractSceneIdFromLocation(location: string): string {
  const match = location.match(/\/scene\/([^\/]+)/);
  return match ? match[1] : 'zero-1-1-summons';
}

export default EnhancedCinematicIntegration;
