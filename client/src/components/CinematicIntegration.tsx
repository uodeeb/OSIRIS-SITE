/**
 * OSIRIS Cinematic Integration System
 * Complete integration of cinematic experience with existing OSIRIS application
 * DB-first approach with scene system integration and narrative data connection
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { EnhancedCinematicPlayer } from '@/components/EnhancedCinematicPlayer';
import { CinematicCompositionEngine } from '@/lib/cinematicCompositionEngine';
import { CulturalAudioEngine } from '@/lib/culturalAudioEngine';
import { Scene, SceneSystem } from '@/lib/sceneSystem';
import { useRTL } from '@/hooks/useRTL';
import { useSettings } from '@/hooks/useSettings';

/**
 * Cinematic Integration Manager
 * Manages the complete cinematic experience integration
 */
export class CinematicIntegrationManager {
  private static instance: CinematicIntegrationManager;
  private compositionEngine: CinematicCompositionEngine;
  private audioEngine: CulturalAudioEngine;
  private sceneSystem: SceneSystem;
  private isInitialized = false;
  private currentComposition: any = null;
  private audioProfile: any = null;

  private constructor() {
    this.compositionEngine = CinematicCompositionEngine.getInstance();
    this.audioEngine = CulturalAudioEngine.getInstance();
    this.sceneSystem = SceneSystem.getInstance();
  }

  static getInstance(): CinematicIntegrationManager {
    if (!CinematicIntegrationManager.instance) {
      CinematicIntegrationManager.instance = new CinematicIntegrationManager();
    }
    return CinematicIntegrationManager.instance;
  }

  /**
   * Initialize the complete cinematic integration system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize cultural audio engine
      await this.audioEngine.initialize();
      
      // Initialize scene system if not already done
      await this.sceneSystem.initialize();

      this.isInitialized = true;
      console.log('🎬 Cinematic Integration Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Cinematic Integration Manager:', error);
      throw error;
    }
  }

  /**
   * Generate cinematic experience for a scene using DB-first approach
   */
  async generateCinematicExperience(scene: Scene): Promise<CinematicExperience> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Analyze scene content and extract cultural context
      const culturalContext = this.analyzeSceneCulturalContext(scene);
      const emotionalContext = this.analyzeSceneEmotionalContext(scene);
      
      // Generate cinematic composition using DB-first approach
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

      // Create complete cinematic experience
      const experience: CinematicExperience = {
        scene,
        composition,
        audioProfile,
        culturalContext,
        emotionalContext,
        duration: this.estimateSceneDuration(scene),
        id: `cinematic-${scene.id}-${Date.now()}`,
      };

      this.currentComposition = composition;
      this.audioProfile = audioProfile;

      return experience;
    } catch (error) {
      console.error('Failed to generate cinematic experience:', error);
      throw error;
    }
  }

  /**
   * Analyze scene for Arabic cultural context
   */
  private analyzeSceneCulturalContext(scene: Scene): any {
    const dialogueText = scene.dialogue.map(d => d.text + ' ' + (d.arabicText || '')).join(' ');
    
    // Determine cultural setting based on content analysis
    const setting = this.determineCulturalSetting(dialogueText);
    const timeOfDay = this.determineTimeOfDay(dialogueText);
    const historicalPeriod = this.determineHistoricalPeriod(dialogueText);
    const religiousSignificance = this.determineReligiousSignificance(dialogueText);
    const socialContext = this.determineSocialContext(dialogueText);

    return {
      setting,
      timeOfDay,
      historicalPeriod,
      religiousSignificance,
      socialContext,
      arabicAuthenticity: this.calculateArabicAuthenticity(scene),
      culturalDepth: this.calculateCulturalDepth(scene),
    };
  }

  /**
   * Analyze scene for emotional context
   */
  private analyzeSceneEmotionalContext(scene: Scene): string {
    const dialogueText = scene.dialogue.map(d => d.text).join(' ');
    
    // Simple emotional analysis based on keywords
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
   * Estimate scene duration based on dialogue length
   */
  private estimateSceneDuration(scene: Scene): number {
    const totalWords = scene.dialogue.reduce((acc, d) => {
      const englishWords = d.text.split(' ').length;
      const arabicWords = (d.arabicText || '').split(' ').length;
      return acc + Math.max(englishWords, arabicWords);
    }, 0);

    // Average reading speed: 150 words per minute for contemplative Arabic content
    const baseDuration = (totalWords / 150) * 60;
    
    // Add extra time for cultural immersion and reflection
    return Math.max(baseDuration * 1.5, 30); // Minimum 30 seconds
  }

  /**
   * Determine cultural setting from text analysis
   */
  private determineCulturalSetting(text: string): string {
    const settingKeywords = {
      'mosque': ['mosque', 'masjid', 'prayer', 'imam', 'minaret', 'allah', 'prayer'],
      'market': ['market', 'souk', 'bazaar', 'merchant', 'trade', 'buy', 'sell'],
      'home': ['home', 'house', 'family', 'mother', 'father', 'children', 'domestic'],
      'desert': ['desert', 'sand', 'dunes', 'oasis', 'camel', 'bedouin', 'nomad'],
      'library': ['library', 'books', 'knowledge', 'wisdom', 'scholar', 'learn', 'study'],
      'court': ['court', 'judge', 'justice', 'law', 'trial', 'ruler', 'king'],
      'cosmic': ['cosmic', 'universe', 'stars', 'heaven', 'divine', 'eternal', 'infinite'],
      'historical': ['ancient', 'historical', 'past', 'centuries', 'ancestors', 'heritage'],
    };

    let maxScore = 0;
    let primarySetting = 'historical';

    for (const [setting, keywords] of Object.entries(settingKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = text.match(regex);
        return acc + (matches ? matches.length : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        primarySetting = setting;
      }
    }

    return primarySetting;
  }

  /**
   * Determine time of day from text analysis
   */
  private determineTimeOfDay(text: string): string {
    const timeKeywords = {
      'dawn': ['dawn', 'sunrise', 'morning', 'early', 'fajr', 'sunrise'],
      'morning': ['morning', 'forenoon', 'am', 'sunrise', 'early'],
      'afternoon': ['afternoon', 'midday', 'noon', 'zuhr', 'dhuhr'],
      'evening': ['evening', 'sunset', 'maghrib', 'dusk', 'twilight'],
      'night': ['night', 'midnight', 'dark', 'isha', 'stars', 'moon'],
    };

    let maxScore = 0;
    let primaryTime = 'night';

    for (const [time, keywords] of Object.entries(timeKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = text.match(regex);
        return acc + (matches ? matches.length : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        primaryTime = time;
      }
    }

    return primaryTime;
  }

  /**
   * Determine historical period from text analysis
   */
  private determineHistoricalPeriod(text: string): string {
    const periodKeywords = {
      'ancient': ['ancient', 'pharaoh', 'egypt', 'pyramid', 'hieroglyph'],
      'medieval': ['medieval', 'crusade', 'knight', 'castle', 'feudal'],
      'islamic-golden': ['islamic', 'golden', 'abbasid', 'umayyad', 'caliph'],
      'ottoman': ['ottoman', 'turkish', 'sultan', 'empire', 'constantinople'],
      'modern': ['modern', 'contemporary', 'current', 'today', 'recent'],
    };

    let maxScore = 0;
    let primaryPeriod = 'medieval';

    for (const [period, keywords] of Object.entries(periodKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = text.match(regex);
        return acc + (matches ? matches.length : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        primaryPeriod = period;
      }
    }

    return primaryPeriod;
  }

  /**
   * Determine religious significance from text analysis
   */
  private determineReligiousSignificance(text: string): 'sacred' | 'secular' | 'ceremonial' {
    const sacredKeywords = ['allah', 'god', 'prophet', 'quran', 'bible', 'prayer', 'holy', 'sacred', 'divine'];
    const ceremonialKeywords = ['ceremony', 'ritual', 'wedding', 'funeral', 'celebration', 'festival'];
    
    const sacredScore = sacredKeywords.reduce((acc, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);

    const ceremonialScore = ceremonialKeywords.reduce((acc, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);

    if (sacredScore > 2) return 'sacred';
    if (ceremonialScore > 1) return 'ceremonial';
    return 'secular';
  }

  /**
   * Determine social context from text analysis
   */
  private determineSocialContext(text: string): 'private' | 'public' | 'intimate' | 'communal' {
    const privateKeywords = ['private', 'secret', 'personal', 'alone', 'individual', 'confidential'];
    const publicKeywords = ['public', 'crowd', 'people', 'society', 'community', 'gathering'];
    const intimateKeywords = ['intimate', 'close', 'beloved', 'lover', 'heart', 'soul'];
    const communalKeywords = ['communal', 'shared', 'together', 'unity', 'collective', 'group'];
    
    const scores = {
      private: this.calculateKeywordScore(text, privateKeywords),
      public: this.calculateKeywordScore(text, publicKeywords),
      intimate: this.calculateKeywordScore(text, intimateKeywords),
      communal: this.calculateKeywordScore(text, communalKeywords),
    };

    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b) as any;
  }

  /**
   * Calculate keyword score for text analysis
   */
  private calculateKeywordScore(text: string, keywords: string[]): number {
    return keywords.reduce((acc, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
  }

  /**
   * Calculate Arabic authenticity score
   */
  private calculateArabicAuthenticity(scene: Scene): number {
    let score = 0;
    
    // Check for Arabic text presence
    const hasArabicText = scene.dialogue.some(d => d.arabicText && d.arabicText.length > 0);
    if (hasArabicText) score += 0.3;
    
    // Check for cultural references
    const culturalReferences = ['islamic', 'arabic', 'muslim', 'middle-east', 'mediterranean'];
    const hasCulturalReferences = scene.dialogue.some(d => 
      culturalReferences.some(ref => d.text.toLowerCase().includes(ref))
    );
    if (hasCulturalReferences) score += 0.2;
    
    // Check for historical depth
    const historicalReferences = ['ancient', 'medieval', 'historical', 'centuries', 'heritage'];
    const hasHistoricalReferences = scene.dialogue.some(d => 
      historicalReferences.some(ref => d.text.toLowerCase().includes(ref))
    );
    if (hasHistoricalReferences) score += 0.2;
    
    // Check for religious content
    const religiousReferences = ['allah', 'god', 'prophet', 'sacred', 'divine', 'holy'];
    const hasReligiousReferences = scene.dialogue.some(d => 
      religiousReferences.some(ref => d.text.toLowerCase().includes(ref))
    );
    if (hasReligiousReferences) score += 0.3;
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate cultural depth score
   */
  private calculateCulturalDepth(scene: Scene): number {
    let score = 0;
    
    // Check dialogue complexity and depth
    const avgWordCount = scene.dialogue.reduce((acc, d) => acc + d.text.split(' ').length, 0) / scene.dialogue.length;
    if (avgWordCount > 20) score += 0.2;
    if (avgWordCount > 50) score += 0.2;
    
    // Check for philosophical content
    const philosophicalKeywords = ['wisdom', 'truth', 'meaning', 'existence', 'purpose', 'destiny'];
    const hasPhilosophicalContent = scene.dialogue.some(d => 
      philosophicalKeywords.some(keyword => d.text.toLowerCase().includes(keyword))
    );
    if (hasPhilosophicalContent) score += 0.3;
    
    // Check for emotional complexity
    const emotionalKeywords = ['feel', 'emotion', 'heart', 'soul', 'passion', 'love', 'fear', 'hope'];
    const hasEmotionalContent = scene.dialogue.some(d => 
      emotionalKeywords.some(keyword => d.text.toLowerCase().includes(keyword))
    );
    if (hasEmotionalContent) score += 0.3;
    
    return Math.min(score, 1.0);
  }

  /**
   * Get current cinematic composition
   */
  getCurrentComposition(): any {
    return this.currentComposition;
  }

  /**
   * Get current audio profile
   */
  getCurrentAudioProfile(): any {
    return this.audioProfile;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.audioEngine.cleanup();
    this.isInitialized = false;
  }
}

/**
 * Cinematic Experience interface
 */
export interface CinematicExperience {
  id: string;
  scene: Scene;
  composition: any;
  audioProfile: any;
  culturalContext: any;
  emotionalContext: string;
  duration: number;
}

/**
 * Main Cinematic Integration Component
 * Integrates the complete cinematic system into the OSIRIS application
 */
export const CinematicIntegration: React.FC = () => {
  const [location] = useLocation();
  const { isRTL } = useRTL();
  const { settings } = useSettings();
  
  const [cinematicManager] = useState(() => CinematicIntegrationManager.getInstance());
  const [currentExperience, setCurrentExperience] = useState<CinematicExperience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize cinematic system
   */
  useEffect(() => {
    const initializeCinematic = async () => {
      try {
        setIsLoading(true);
        await cinematicManager.initialize();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize cinematic system:', error);
        setError('Failed to initialize cinematic experience');
        setIsLoading(false);
      }
    };

    initializeCinematic();

    return () => {
      cinematicManager.cleanup();
    };
  }, [cinematicManager]);

  /**
   * Generate cinematic experience for current scene
   */
  const generateExperience = useCallback(async (sceneId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get scene from scene system
      const scene = await cinematicManager.sceneSystem.getScene(sceneId);
      if (!scene) {
        throw new Error(`Scene not found: ${sceneId}`);
      }

      // Generate cinematic experience
      const experience = await cinematicManager.generateCinematicExperience(scene);
      setCurrentExperience(experience);
      setIsLoading(false);
      
      console.log('🎬 Cinematic experience generated:', experience.id);
    } catch (error) {
      console.error('Failed to generate cinematic experience:', error);
      setError('Failed to generate cinematic experience');
      setIsLoading(false);
    }
  }, [cinematicManager]);

  /**
   * Handle scene navigation
   */
  useEffect(() => {
    const sceneId = extractSceneIdFromLocation(location);
    if (sceneId && !isLoading) {
      generateExperience(sceneId);
    }
  }, [location, generateExperience, isLoading]);

  if (isLoading) {
    return (
      <div className="cinematic-loading-container">
        <div className="islamic-loading-spinner">
          <div className="loading-text" dir="rtl">
            جاري تحميل التجربة السينمائية...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cinematic-error-container">
        <div className="error-content">
          <h2 className="error-title" dir="rtl">حدث خطأ في التجربة السينمائية</h2>
          <p className="error-message">{error}</p>
          <button 
            className="error-retry-button"
            onClick={() => generateExperience(extractSceneIdFromLocation(location))}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!currentExperience) {
    return null;
  }

  return (
    <div className="cinematic-integration-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <EnhancedCinematicPlayer
        initialSceneId={currentExperience.scene.id}
        cinematicMode={settings?.cinematicMode ?? true}
      />
      
      {/* Cinematic experience metadata */}
      <div className="cinematic-metadata">
        <div className="cultural-context-info">
          <span className="context-label">السياق الثقافي:</span>
          <span className="context-value">{currentExperience.culturalContext.setting}</span>
        </div>
        <div className="emotional-context-info">
          <span className="context-label">السياق العاطفي:</span>
          <span className="context-value">{currentExperience.emotionalContext}</span>
        </div>
        <div className="duration-info">
          <span className="context-label">المدة:</span>
          <span className="context-value">{Math.round(currentExperience.duration)}s</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Extract scene ID from location
 */
function extractSceneIdFromLocation(location: string): string {
  // Parse location to extract scene ID
  const match = location.match(/\/scene\/([^\/]+)/);
  return match ? match[1] : 'zero-1-1-summons'; // Default scene
}

export default CinematicIntegration;