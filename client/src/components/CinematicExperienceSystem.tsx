/**
 * OSIRIS — المفسدون في الأرض
 * Cinematic Experience System - Revolutionary Arabic Multimedia Novel Engine
 * 
 * DB-First Asset Composition System
 * - Intelligent asset layering based on emotional context
 * - Cultural Arabic multimedia integration
 * - Cinematic composition generation
 * - Revolutionary UX/UI for Arabic storytelling
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { background, character, videoBg, audio } from '@/lib/assets';
import { getAssetOverride } from '@/lib/assetOverrides';
import { useBandwidthStrategy } from '@/lib/mediaStrategy';
import { Scene, DialogueLine, ArabicCulturalContext } from '@/lib/sceneSystem';

// =============================================================================
// CINEMATIC COMPOSITION ENGINE - DB-First Asset Management
// =============================================================================

export interface CinematicAsset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'pattern' | 'calligraphy' | 'animation';
  url: string;
  culturalContext: ArabicCulturalContext;
  emotionalTone: string;
  priority: number; // 1-10 for layering order
  metadata: {
    duration?: number;
    loop?: boolean;
    opacity?: number;
    blendMode?: string;
    culturalSignificance?: string;
    religiousContext?: string;
  };
}

export interface CinematicComposition {
  id: string;
  sceneId: string;
  layers: CinematicLayer[];
  emotionalTone: string;
  culturalContext: ArabicCulturalContext;
  duration: number;
  transitions: CinematicTransition[];
  audioProfile: AudioProfile;
  visualEffects: VisualEffect[];
}

export interface CinematicLayer {
  id: string;
  asset: CinematicAsset;
  zIndex: number;
  animation: LayerAnimation;
  responsive: ResponsiveSettings;
  cultural: CulturalSettings;
}

export interface AudioProfile {
  backgroundMusic?: CinematicAsset;
  ambientSounds?: CinematicAsset[];
  voiceNarration?: CinematicAsset;
  soundEffects?: CinematicAsset[];
  culturalAudio?: CinematicAsset[];
  mixSettings: AudioMixSettings;
}

export interface AudioMixSettings {
  masterVolume: number;
  musicVolume: number;
  ambientVolume: number;
  voiceVolume: number;
  effectsVolume: number;
  culturalVolume: number;
  duckingEnabled: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
}

export interface VisualEffect {
  type: 'scanlines' | 'film-grain' | 'vignette' | 'color-grade' | 'islamic-pattern' | 'calligraphy-overlay';
  intensity: number;
  culturalContext?: string;
  animation?: EffectAnimation;
}

export interface EffectAnimation {
  type: 'pulse' | 'glow' | 'float' | 'rotate' | 'morph';
  duration: number;
  easing: string;
  culturalMeaning?: string;
}

export interface CinematicTransition {
  type: 'fade' | 'slide' | 'morph' | 'islamic-geometric' | 'arabesque' | 'calligraphy-flow';
  duration: number;
  easing: string;
  culturalContext: string;
}

export interface LayerAnimation {
  entrance: AnimationConfig;
  exit: AnimationConfig;
  idle: AnimationConfig;
  interactive?: AnimationConfig;
}

export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'morph' | 'islamic-pattern-reveal';
  duration: number;
  delay: number;
  easing: string;
  culturalSignificance?: string;
}

export interface ResponsiveSettings {
  mobile: { scale: number; opacity: number; position: string };
  tablet: { scale: number; opacity: number; position: string };
  desktop: { scale: number; opacity: number; position: string };
}

export interface CulturalSettings {
  religiousSensitivity?: string;
  historicalAccuracy?: string;
  regionalAuthenticity?: string;
  artisticTradition?: string;
}

// =============================================================================
// CINEMATIC COMPOSITION ENGINE
// =============================================================================

export class CinematicCompositionEngine {
  private compositions: Map<string, CinematicComposition> = new Map();
  private assetCache: Map<string, CinematicAsset> = new Map();
  private audioContext: AudioContext | null = null;
  private culturalPatternGenerator: IslamicPatternGenerator;
  private calligraphyRenderer: ArabicCalligraphyRenderer;

  constructor() {
    this.culturalPatternGenerator = new IslamicPatternGenerator();
    this.calligraphyRenderer = new ArabicCalligraphyRenderer();
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  /**
   * Generate cinematic composition based on scene emotional context
   * DB-First approach: Assets are intelligently layered based on cultural and emotional significance
   */
  async generateComposition(
    scene: Scene,
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): Promise<CinematicComposition> {
    const compositionId = `comp-${scene.id}-${Date.now()}`;
    
    // Phase 1: Asset Discovery and Curation
    const curatedAssets = await this.curateAssetsForScene(scene, emotionalContext, culturalContext);
    
    // Phase 2: Cultural Layering Strategy
    const layers = this.generateCulturalLayers(curatedAssets, emotionalContext, culturalContext);
    
    // Phase 3: Audio Profile Generation
    const audioProfile = await this.generateAudioProfile(scene, emotionalContext, culturalContext);
    
    // Phase 4: Visual Effects and Transitions
    const visualEffects = this.generateVisualEffects(emotionalContext, culturalContext);
    const transitions = this.generateCulturalTransitions(emotionalContext, culturalContext);
    
    // Phase 5: Cultural Authenticity Validation
    const validatedComposition = this.validateCulturalAuthenticity({
      id: compositionId,
      sceneId: scene.id,
      layers,
      emotionalTone: emotionalContext,
      culturalContext,
      duration: this.calculateDuration(scene),
      transitions,
      audioProfile,
      visualEffects
    });

    this.compositions.set(compositionId, validatedComposition);
    return validatedComposition;
  }

  private async curateAssetsForScene(
    scene: Scene,
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): Promise<CinematicAsset[]> {
    const assets: CinematicAsset[] = [];
    
    // Background Assets (Priority 1-3)
    if (scene.backgroundImage) {
      assets.push({
        id: `bg-${scene.id}`,
        type: 'image',
        url: getAssetOverride(scene.backgroundImage) || scene.backgroundImage,
        culturalContext,
        emotionalTone: emotionalContext,
        priority: 1,
        metadata: {
          opacity: 0.8,
          blendMode: 'multiply',
          culturalSignificance: 'Primary visual foundation'
        }
      });
    }

    if (scene.backgroundVideo) {
      assets.push({
        id: `video-${scene.id}`,
        type: 'video',
        url: getAssetOverride(scene.backgroundVideo) || scene.backgroundVideo,
        culturalContext,
        emotionalTone: emotionalContext,
        priority: 2,
        metadata: {
          opacity: 0.7,
          loop: true,
          culturalSignificance: 'Dynamic visual storytelling'
        }
      });
    }

    // Cultural Pattern Assets (Priority 4-6)
    const culturalPatterns = this.culturalPatternGenerator.generatePatterns({
      type: this.mapEmotionToPattern(emotionalContext),
      complexity: this.mapEmotionToComplexity(emotionalContext),
      culturalContext,
      count: 3
    });

    culturalPatterns.forEach((pattern, index) => {
      assets.push({
        id: `pattern-${scene.id}-${index}`,
        type: 'pattern',
        url: pattern.svg,
        culturalContext,
        emotionalTone: emotionalContext,
        priority: 4 + index,
        metadata: {
          opacity: 0.3 + (index * 0.1),
          blendMode: 'overlay',
          culturalSignificance: pattern.meaning,
          religiousContext: pattern.religiousContext
        }
      });
    });

    // Calligraphy Assets (Priority 7-9)
    if (scene.dialogue && scene.dialogue.length > 0) {
      const calligraphyElements = this.calligraphyRenderer.generateCalligraphy({
        text: this.extractArabicText(scene.dialogue),
        script: this.mapEmotionToScript(emotionalContext),
        style: this.mapEmotionToCalligraphyStyle(emotionalContext),
        culturalContext
      });

      calligraphyElements.forEach((element, index) => {
        assets.push({
          id: `calligraphy-${scene.id}-${index}`,
          type: 'calligraphy',
          url: element.svg,
          culturalContext,
          emotionalTone: emotionalContext,
          priority: 7 + index,
          metadata: {
            opacity: 0.6 + (index * 0.1),
            blendMode: 'soft-light',
            culturalSignificance: element.meaning,
            religiousContext: element.religiousContext
          }
        });
      });
    }

    return assets;
  }

  private generateCulturalLayers(
    assets: CinematicAsset[],
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): CinematicLayer[] {
    return assets.map((asset, index) => ({
      id: `layer-${asset.id}`,
      asset,
      zIndex: asset.priority,
      animation: this.generateLayerAnimation(asset, emotionalContext, culturalContext),
      responsive: this.generateResponsiveSettings(asset),
      cultural: this.generateCulturalSettings(asset, culturalContext)
    }));
  }

  private generateLayerAnimation(
    asset: CinematicAsset,
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): LayerAnimation {
    const baseAnimation = {
      entrance: {
        type: this.selectEntranceAnimation(asset.type, emotionalContext),
        duration: this.calculateAnimationDuration(asset.type, emotionalContext),
        delay: this.calculateAnimationDelay(asset.priority, emotionalContext),
        easing: 'ease-out',
        culturalSignificance: this.getCulturalAnimationMeaning(asset.type, culturalContext)
      },
      exit: {
        type: 'fade',
        duration: 800,
        delay: 0,
        easing: 'ease-in'
      },
      idle: {
        type: this.selectIdleAnimation(asset.type, emotionalContext),
        duration: this.calculateIdleDuration(emotionalContext),
        delay: 0,
        easing: 'linear'
      }
    };

    if (asset.type === 'calligraphy' || asset.type === 'pattern') {
      baseAnimation.interactive = {
        type: 'islamic-pattern-reveal',
        duration: 1200,
        delay: 0,
        easing: 'ease-out',
        culturalSignificance: 'Interactive revelation of sacred geometry'
      };
    }

    return baseAnimation;
  }

  private async generateAudioProfile(
    scene: Scene,
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): Promise<AudioProfile> {
    const mixSettings: AudioMixSettings = {
      masterVolume: 0.8,
      musicVolume: this.calculateMusicVolume(emotionalContext),
      ambientVolume: this.calculateAmbientVolume(emotionalContext),
      voiceVolume: 1.0,
      effectsVolume: 0.6,
      culturalVolume: 0.7,
      duckingEnabled: true,
      fadeInDuration: 1500,
      fadeOutDuration: 2000
    };

    const audioProfile: AudioProfile = {
      mixSettings
    };

    // Background Music
    if (scene.musicKey) {
      audioProfile.backgroundMusic = {
        id: `music-${scene.id}`,
        type: 'audio',
        url: getAssetOverride(scene.musicKey) || audio('main_theme'),
        culturalContext,
        emotionalTone: emotionalContext,
        priority: 1,
        metadata: {
          loop: true,
          culturalSignificance: 'Traditional Arabic musical accompaniment'
        }
      };
    }

    // Ambient Sounds
    if (scene.ambientKeys && scene.ambientKeys.length > 0) {
      audioProfile.ambientSounds = scene.ambientKeys.map((key, index) => ({
        id: `ambient-${scene.id}-${index}`,
        type: 'audio',
        url: getAssetOverride(key) || key,
        culturalContext,
        emotionalTone: emotionalContext,
        priority: 2 + index,
        metadata: {
          loop: true,
          culturalSignificance: 'Environmental Arabic soundscape'
        }
      }));
    }

    // Cultural Audio
    const culturalAudio = this.generateCulturalAudio(emotionalContext, culturalContext);
    if (culturalAudio.length > 0) {
      audioProfile.culturalAudio = culturalAudio;
    }

    return audioProfile;
  }

  private generateCulturalAudio(
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): CinematicAsset[] {
    const culturalAudio: CinematicAsset[] = [];

    // Traditional Arabic instruments based on emotional context
    const instruments = this.selectTraditionalInstruments(emotionalContext);
    
    instruments.forEach((instrument, index) => {
      culturalAudio.push({
        id: `cultural-audio-${instrument.name}-${index}`,
        type: 'audio',
        url: instrument.audioUrl,
        culturalContext,
        emotionalTone: emotionalContext,
        priority: 5 + index,
        metadata: {
          loop: instrument.shouldLoop,
          culturalSignificance: instrument.culturalSignificance,
          religiousContext: instrument.religiousContext
        }
      });
    });

    return culturalAudio;
  }

  private generateVisualEffects(
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): VisualEffect[] {
    const effects: VisualEffect[] = [];

    // Base cinematic effects
    effects.push({
      type: 'film-grain',
      intensity: 0.15,
      culturalContext: 'Traditional Arabic manuscript texture'
    });

    effects.push({
      type: 'vignette',
      intensity: 0.4,
      culturalContext: 'Focus attention on central narrative'
    });

    // Cultural effects based on emotional context
    if (emotionalContext === 'sacred' || emotionalContext === 'religious') {
      effects.push({
        type: 'islamic-pattern',
        intensity: 0.3,
        culturalContext: 'Sacred geometric patterns',
        animation: {
          type: 'glow',
          duration: 4000,
          easing: 'ease-in-out',
          culturalMeaning: 'Divine light revelation'
        }
      });
    }

    if (emotionalContext === 'dramatic' || emotionalContext === 'intense') {
      effects.push({
        type: 'calligraphy-overlay',
        intensity: 0.5,
        culturalContext: 'Arabic calligraphic emphasis',
        animation: {
          type: 'write-on',
          duration: 3000,
          easing: 'ease-out',
          culturalMeaning: 'Revelation of sacred words'
        }
      });
    }

    return effects;
  }

  private generateCulturalTransitions(
    emotionalContext: string,
    culturalContext: ArabicCulturalContext
  ): CinematicTransition[] {
    const transitions: CinematicTransition[] = [];

    // Islamic geometric transitions
    transitions.push({
      type: 'islamic-geometric',
      duration: 1800,
      easing: 'ease-in-out',
      culturalContext: 'Traditional Arabic architectural transition'
    });

    // Arabesque flow transitions
    transitions.push({
      type: 'arabesque',
      duration: 2200,
      easing: 'ease-out',
      culturalContext: 'Arabesque artistic tradition'
    });

    // Calligraphy flow for dramatic content
    if (emotionalContext === 'dramatic' || emotionalContext === 'sacred') {
      transitions.push({
        type: 'calligraphy-flow',
        duration: 2500,
        easing: 'ease-in-out',
        culturalContext: 'Arabic calligraphic storytelling'
      });
    }

    return transitions;
  }

  // =============================================================================
  // CULTURAL MAPPING FUNCTIONS
  // =============================================================================

  private mapEmotionToPattern(emotion: string): string {
    const patternMap: Record<string, string> = {
      'sacred': 'arabesque',
      'dramatic': 'girih',
      'contemplative': 'muqarnas',
      'hopeful': 'zellij',
      'tragic': 'mashrabiya',
      'intense': 'arabesque'
    };
    return patternMap[emotion] || 'arabesque';
  }

  private mapEmotionToComplexity(emotion: string): number {
    const complexityMap: Record<string, number> = {
      'sacred': 9,
      'dramatic': 7,
      'contemplative': 5,
      'hopeful': 6,
      'tragic': 8,
      'intense': 8
    };
    return complexityMap[emotion] || 6;
  }

  private mapEmotionToScript(emotion: string): string {
    const scriptMap: Record<string, string> = {
      'sacred': 'thuluth',
      'dramatic': 'diwani',
      'contemplative': 'naskh',
      'hopeful': 'ruqaa',
      'tragic': 'thuluth',
      'intense': 'diwani'
    };
    return scriptMap[emotion] || 'naskh';
  }

  private mapEmotionToCalligraphyStyle(emotion: string): string {
    const styleMap: Record<string, string> = {
      'sacred': 'monumental',
      'dramatic': 'flowing',
      'contemplative': 'measured',
      'hopeful': 'graceful',
      'tragic': 'dramatic',
      'intense': 'bold'
    };
    return styleMap[emotion] || 'measured';
  }

  private selectEntranceAnimation(type: string, emotion: string): string {
    const animationMap: Record<string, Record<string, string>> = {
      'image': {
        'sacred': 'fade',
        'dramatic': 'slide',
        'contemplative': 'fade',
        'hopeful': 'scale',
        'tragic': 'fade',
        'intense': 'morph'
      },
      'video': {
        'sacred': 'fade',
        'dramatic': 'slide',
        'contemplative': 'fade',
        'hopeful': 'fade',
        'tragic': 'fade',
        'intense': 'slide'
      },
      'pattern': {
        'sacred': 'islamic-pattern-reveal',
        'dramatic': 'rotate',
        'contemplative': 'fade',
        'hopeful': 'scale',
        'tragic': 'morph',
        'intense': 'rotate'
      },
      'calligraphy': {
        'sacred': 'islamic-pattern-reveal',
        'dramatic': 'write-on',
        'contemplative': 'fade',
        'hopeful': 'scale',
        'tragic': 'fade',
        'intense': 'write-on'
      }
    };
    return animationMap[type]?.[emotion] || 'fade';
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  private extractArabicText(dialogue: DialogueLine[]): string {
    return dialogue
      .filter(line => line.arabicText)
      .map(line => line.arabicText)
      .join(' ')
      .substring(0, 200); // Limit for calligraphy generation
  }

  private calculateDuration(scene: Scene): number {
    if (scene.dialogue && scene.dialogue.length > 0) {
      const totalDuration = scene.dialogue.reduce((sum, line) => 
        sum + (line.duration || 3000), 0
      );
      return Math.max(totalDuration, 10000); // Minimum 10 seconds
    }
    return 15000; // Default 15 seconds
  }

  private validateCulturalAuthenticity(composition: CinematicComposition): CinematicComposition {
    // Validate religious sensitivity
    composition.layers.forEach(layer => {
      if (layer.asset.type === 'calligraphy' || layer.asset.type === 'pattern') {
        if (layer.asset.metadata.religiousContext) {
          layer.cultural.religiousSensitivity = 'validated';
        }
      }
    });

    return composition;
  }

  // Additional helper methods for audio, animation, and cultural mapping...
  private calculateMusicVolume(emotion: string): number {
    const volumeMap: Record<string, number> = {
      'sacred': 0.4,
      'dramatic': 0.7,
      'contemplative': 0.3,
      'hopeful': 0.6,
      'tragic': 0.5,
      'intense': 0.8
    };
    return volumeMap[emotion] || 0.5;
  }

  private calculateAmbientVolume(emotion: string): number {
    const volumeMap: Record<string, number> = {
      'sacred': 0.6,
      'dramatic': 0.4,
      'contemplative': 0.7,
      'hopeful': 0.5,
      'tragic': 0.6,
      'intense': 0.3
    };
    return volumeMap[emotion] || 0.5;
  }

  private selectTraditionalInstruments(emotion: string): TraditionalInstrument[] {
    const instruments: Record<string, TraditionalInstrument[]> = {
      'sacred': [
        { name: 'Oud', audioUrl: '/audio/oud-sacred.mp3', shouldLoop: true, culturalSignificance: 'King of Arabic instruments', religiousContext: 'Appropriate for sacred content' },
        { name: 'Qanun', audioUrl: '/audio/qanun-sacred.mp3', shouldLoop: true, culturalSignificance: 'Angelic Arabic harp', religiousContext: 'Traditional sacred music' }
      ],
      'dramatic': [
        { name: 'Oud', audioUrl: '/audio/oud-dramatic.mp3', shouldLoop: true, culturalSignificance: 'Emotional Arabic lute' },
        { name: 'Ney', audioUrl: '/audio/ney-dramatic.mp3', shouldLoop: false, culturalSignificance: 'Soulful Arabic flute' }
      ],
      'contemplative': [
        { name: 'Oud', audioUrl: '/audio/oud-contemplative.mp3', shouldLoop: true, culturalSignificance: 'Meditative Arabic lute' },
        { name: 'Riq', audioUrl: '/audio/riq-contemplative.mp3', shouldLoop: true, culturalSignificance: 'Gentle Arabic tambourine' }
      ]
    };
    return instruments[emotion] || instruments['contemplative'];
  }

  private selectIdleAnimation(type: string, emotion: string): string {
    const idleMap: Record<string, Record<string, string>> = {
      'pattern': {
        'sacred': 'rotate',
        'dramatic': 'pulse',
        'contemplative': 'float',
        'hopeful': 'glow',
        'tragic': 'pulse',
        'intense': 'rotate'
      },
      'calligraphy': {
        'sacred': 'glow',
        'dramatic': 'pulse',
        'contemplative': 'float',
        'hopeful': 'glow',
        'tragic': 'pulse',
        'intense': 'glow'
      }
    };
    return idleMap[type]?.[emotion] || 'none';
  }

  private calculateAnimationDuration(type: string, emotion: string): number {
    const durationMap: Record<string, number> = {
      'sacred': 2000,
      'dramatic': 1200,
      'contemplative': 2500,
      'hopeful': 1500,
      'tragic': 2000,
      'intense': 800
    };
    return durationMap[emotion] || 1500;
  }

  private calculateAnimationDelay(priority: number, emotion: string): number {
    const baseDelay = priority * 200;
    const emotionMultiplier = {
      'sacred': 1.5,
      'dramatic': 0.8,
      'contemplative': 2.0,
      'hopeful': 1.0,
      'tragic': 1.3,
      'intense': 0.5
    };
    return baseDelay * (emotionMultiplier[emotion] || 1.0);
  }

  private calculateIdleDuration(emotion: string): number {
    const durationMap: Record<string, number> = {
      'sacred': 8000,
      'dramatic': 4000,
      'contemplative': 12000,
      'hopeful': 6000,
      'tragic': 10000,
      'intense': 3000
    };
    return durationMap[emotion] || 6000;
  }

  private generateResponsiveSettings(asset: CinematicAsset): ResponsiveSettings {
    return {
      mobile: { scale: 0.8, opacity: asset.metadata.opacity || 0.8, position: 'center' },
      tablet: { scale: 0.9, opacity: asset.metadata.opacity || 0.9, position: 'center' },
      desktop: { scale: 1.0, opacity: asset.metadata.opacity || 1.0, position: 'center' }
    };
  }

  private generateCulturalSettings(asset: CinematicAsset, culturalContext: ArabicCulturalContext): CulturalSettings {
    return {
      religiousSensitivity: asset.metadata.religiousContext || 'general',
      historicalAccuracy: 'validated',
      regionalAuthenticity: culturalContext.region || 'classical-arabic',
      artisticTradition: this.mapAssetToArtisticTradition(asset.type)
    };
  }

  private mapAssetToArtisticTradition(type: string): string {
    const traditionMap: Record<string, string> = {
      'pattern': 'Islamic geometric tradition',
      'calligraphy': 'Arabic calligraphic tradition',
      'image': 'Arabic manuscript illumination',
      'video': 'Arabic cinematic tradition',
      'audio': 'Arabic musical tradition'
    };
    return traditionMap[type] || 'Arabic artistic tradition';
  }

  private getCulturalAnimationMeaning(type: string, culturalContext: ArabicCulturalContext): string {
    const meaningMap: Record<string, string> = {
      'pattern': 'Revelation of divine geometric order',
      'calligraphy': 'Sacred word manifestation',
      'image': 'Visual narrative unfolding',
      'video': 'Cinematic story revelation'
    };
    return meaningMap[type] || 'Cultural artistic revelation';
  }

  private extractArabicText(dialogue: DialogueLine[]): string {
    return dialogue
      .filter(line => line.arabicText)
      .map(line => line.arabicText || '')
      .join(' ')
      .substring(0, 200);
  }
}

// =============================================================================
// ISLAMIC PATTERN GENERATOR
// =============================================================================

class IslamicPatternGenerator {
  generatePatterns(config: {
    type: string;
    complexity: number;
    culturalContext: ArabicCulturalContext;
    count: number;
  }): Array<{ svg: string; meaning: string; religiousContext?: string }> {
    const patterns = [];
    
    for (let i = 0; i < config.count; i++) {
      const pattern = this.createIslamicPattern({
        type: config.type,
        complexity: config.complexity,
        iteration: i,
        culturalContext: config.culturalContext
      });
      
      patterns.push(pattern);
    }
    
    return patterns;
  }

  private createIslamicPattern(config: {
    type: string;
    complexity: number;
    iteration: number;
    culturalContext: ArabicCulturalContext;
  }): { svg: string; meaning: string; religiousContext?: string } {
    const { type, complexity, iteration, culturalContext } = config;
    
    // Generate SVG based on pattern type and complexity
    const svg = this.generateSVGPattern(type, complexity, iteration);
    const meaning = this.getPatternMeaning(type, culturalContext);
    const religiousContext = this.getReligiousContext(type, culturalContext);
    
    return {
      svg,
      meaning,
      religiousContext
    };
  }

  private generateSVGPattern(type: string, complexity: number, iteration: number): string {
    // Implementation for generating Islamic geometric patterns as SVG
    const size = 400;
    const center = size / 2;
    const complexityFactor = complexity / 10;
    
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-${type}-${iteration}" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          ${this.generatePatternElements(type, complexityFactor, iteration)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-${type}-${iteration})" />
    </svg>`;
  }

  private generatePatternElements(type: string, complexityFactor: number, iteration: number): string {
    // Generate specific pattern elements based on type
    switch (type) {
      case 'arabesque':
        return this.generateArabesqueElements(complexityFactor, iteration);
      case 'girih':
        return this.generateGirihElements(complexityFactor, iteration);
      case 'muqarnas':
        return this.generateMuqarnasElements(complexityFactor, iteration);
      default:
        return this.generateArabesqueElements(complexityFactor, iteration);
    }
  }

  private generateArabesqueElements(complexityFactor: number, iteration: number): string {
    const elements = [];
    const count = Math.floor(6 + complexityFactor * 4);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const radius = 20 + complexityFactor * 15;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      
      elements.push(`
        <circle cx="${x}" cy="${y}" r="${5 + complexityFactor * 3}" 
                fill="none" stroke="currentColor" stroke-width="${0.5 + complexityFactor * 0.5}"/>
        <path d="M${x},${y} Q${x + 10},${y - 10} ${x + 20},${y}" 
              fill="none" stroke="currentColor" stroke-width="${0.3 + complexityFactor * 0.3}"/>
      `);
    }
    
    return elements.join('');
  }

  private generateGirihElements(complexityFactor: number, iteration: number): string {
    const elements = [];
    const polygons = Math.floor(5 + complexityFactor * 3);
    
    for (let i = 0; i < polygons; i++) {
      const sides = 5 + (i % 3); // 5, 6, 7 sided polygons
      const radius = 15 + complexityFactor * 10;
      const centerX = 50 + (i % 3 - 1) * 30;
      const centerY = 50 + (Math.floor(i / 3) - 1) * 30;
      
      const points = [];
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * 2 * Math.PI;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        points.push(`${x},${y}`);
      }
      
      elements.push(`
        <polygon points="${points.join(' ')}" 
                fill="none" stroke="currentColor" 
                stroke-width="${0.4 + complexityFactor * 0.4}"/>
      `);
    }
    
    return elements.join('');
  }

  private generateMuqarnasElements(complexityFactor: number, iteration: number): string {
    const elements = [];
    const tiers = Math.floor(3 + complexityFactor * 2);
    
    for (let tier = 0; tier < tiers; tier++) {
      const tierRadius = 40 - tier * 12;
      const elementsPerTier = 8 + tier * 2;
      
      for (let i = 0; i < elementsPerTier; i++) {
        const angle = (i / elementsPerTier) * 2 * Math.PI;
        const x = 50 + Math.cos(angle) * tierRadius;
        const y = 50 + Math.sin(angle) * tierRadius;
        
        elements.push(`
          <path d="M${x},${y} L${x + 8},${y - 8} L${x + 16},${y} Z" 
                  fill="none" stroke="currentColor" 
                  stroke-width="${0.3 + complexityFactor * 0.3}"/>
        `);
      }
    }
    
    return elements.join('');
  }

  private getPatternMeaning(type: string, culturalContext: ArabicCulturalContext): string {
    const meanings: Record<string, string> = {
      'arabesque': 'Infinite divine order and unity',
      'girih': 'Mathematical precision of creation',
      'muqarnas': 'Celestial vault architecture',
      'zellij': 'Colorful Moroccan ceramic tradition',
      'mashrabiya': 'Arabic architectural privacy and beauty'
    };
    return meanings[type] || 'Islamic geometric harmony';
  }

  private getReligiousContext(type: string, culturalContext: ArabicCulturalContext): string | undefined {
    if (culturalContext.setting === 'mosque' || culturalContext.socialContext === 'religious') {
      return `Appropriate for ${type} patterns in religious context`;
    }
    return undefined;
  }
}

// =============================================================================
// ARABIC CALLIGRAPHY RENDERER
// =============================================================================

class ArabicCalligraphyRenderer {
  generateCalligraphy(config: {
    text: string;
    script: string;
    style: string;
    culturalContext: ArabicCulturalContext;
  }): Array<{ svg: string; meaning: string; religiousContext?: string }> {
    const { text, script, style, culturalContext } = config;
    
    // Generate multiple calligraphy elements
    const elements = [];
    const words = text.split(' ').slice(0, 5); // Limit to first 5 words
    
    words.forEach((word, index) => {
      const calligraphy = this.createCalligraphyElement({
        text: word,
        script,
        style,
        iteration: index,
        culturalContext
      });
      
      elements.push(calligraphy);
    });
    
    return elements;
  }

  private createCalligraphyElement(config: {
    text: string;
    script: string;
    style: string;
    iteration: number;
    culturalContext: ArabicCulturalContext;
  }): { svg: string; meaning: string; religiousContext?: string } {
    const { text, script, style, iteration, culturalContext } = config;
    
    const svg = this.generateCalligraphySVG(text, script, style, iteration);
    const meaning = this.getCalligraphyMeaning(text, culturalContext);
    const religiousContext = this.getCalligraphyReligiousContext(text, culturalContext);
    
    return {
      svg,
      meaning,
      religiousContext
    };
  }

  private generateCalligraphySVG(text: string, script: string, style: string, iteration: number): string {
    const width = 400;
    const height = 150;
    
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" dir="rtl">
      <defs>
        <filter id="calligraphy-shadow-${iteration}">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="1" result="offsetblur"/>
          <feFlood flood-color="rgba(201,169,110,0.3)"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <text x="${width / 2}" y="${height / 2}" 
            text-anchor="middle" 
            dominant-baseline="middle"
            font-family="Aref Ruqaa Ink, Amiri, Noto Naskh Arabic, serif"
            font-size="${this.getFontSize(script, style)}"
            fill="url(#calligraphy-gradient-${iteration})"
            filter="url(#calligraphy-shadow-${iteration})"
            class="arabic-calligraphy ${script} ${style}">
        ${text}
      </text>
      
      <defs>
        <linearGradient id="calligraphy-gradient-${iteration}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#c9a96e;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#f0d080;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#c9a96e;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`;
  }

  private getFontSize(script: string, style: string): string {
    const sizeMap: Record<string, string> = {
      'thuluth': '48px',
      'diwani': '42px',
      'naskh': '36px',
      'ruqaa': '32px'
    };
    return sizeMap[script] || '36px';
  }

  private getCalligraphyMeaning(text: string, culturalContext: ArabicCulturalContext): string {
    // Analyze the Arabic text and provide cultural meaning
    return `Arabic calligraphy: "${text}" - Traditional ${culturalContext.setting || 'classical'} script`;
  }

  private getCalligraphyReligiousContext(text: string, culturalContext: ArabicCulturalContext): string | undefined {
    // Check if text contains religious references
    const religiousWords = ['الله', 'محمد', 'قرآن', 'إسلام', 'نبي'];
    const containsReligiousReference = religiousWords.some(word => text.includes(word));
    
    if (containsReligiousReference) {
      return 'Contains religious references - handle with appropriate respect';
    }
    
    return undefined;
  }
}

// =============================================================================
// TRADITIONAL ARABIC INSTRUMENTS INTERFACE
// =============================================================================

interface TraditionalInstrument {
  name: string;
  audioUrl: string;
  shouldLoop: boolean;
  culturalSignificance: string;
  religiousContext?: string;
}

interface ArabicCulturalContext {
  setting?: string;
  timeOfDay?: string;
  season?: string;
  socialContext?: string;
  region?: string;
}

// =============================================================================
// EXPORT HOOK FOR REACT COMPONENTS
// =============================================================================

export function useCinematicComposition(
  scene: Scene,
  emotionalContext: string,
  culturalContext: ArabicCulturalContext
) {
  const [composition, setComposition] = useState<CinematicComposition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<CinematicCompositionEngine | null>(null);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new CinematicCompositionEngine();
    }

    const generateComposition = async () => {
      if (!scene) return;

      setIsLoading(true);
      setError(null);

      try {
        const generatedComposition = await engineRef.current.generateComposition(
          scene,
          emotionalContext,
          culturalContext
        );
        setComposition(generatedComposition);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate composition');
      } finally {
        setIsLoading(false);
      }
    };

    generateComposition();
  }, [scene, emotionalContext, culturalContext]);

  return {
    composition,
    isLoading,
    error,
    regenerate: () => {
      if (engineRef.current && scene) {
        engineRef.current.generateComposition(scene, emotionalContext, culturalContext)
          .then(setComposition)
          .catch(setError);
      }
    }
  };
}

export default CinematicCompositionEngine;