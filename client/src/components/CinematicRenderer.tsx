/**
 * OSIRIS Cinematic Renderer
 * Advanced visual component that renders cinematic compositions with 
 * Islamic geometric patterns, Arabic calligraphy, and cultural storytelling
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicComposition, CinematicLayer, ArabicCulturalContext } from '@/lib/cinematicCompositionEngine';
import { Scene, DialogueLine } from '@/lib/sceneSystem';
import { useRTL } from '@/hooks/useRTL';

interface CinematicRendererProps {
  composition: CinematicComposition;
  scene: Scene;
  currentDialogue: DialogueLine | null;
  isActive: boolean;
  onCompositionReady?: () => void;
  onLayerAnimationComplete?: (layerId: string) => void;
}

export const CinematicRenderer: React.FC<CinematicRendererProps> = ({
  composition,
  scene,
  currentDialogue,
  isActive,
  onCompositionReady,
  onLayerAnimationComplete,
}) => {
  const { isRTL } = useRTL();
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationStates, setAnimationStates] = useState<Record<string, boolean>>({});
  const [culturalEffects, setCulturalEffects] = useState<Record<string, any>>({});

  // Initialize cultural effects based on composition
  useEffect(() => {
    if (isActive && composition) {
      initializeCulturalEffects();
      onCompositionReady?.();
    }
  }, [isActive, composition]);

  /**
   * Initialize cultural effects based on Arabic cultural context
   */
  const initializeCulturalEffects = () => {
    const { culturalContext } = composition;
    
    // Generate Islamic geometric particles
    const particles = generateIslamicParticles(culturalContext);
    
    // Create Arabic calligraphy effects
    const calligraphyEffects = generateCalligraphyEffects(culturalContext);
    
    // Apply cultural lighting based on time of day and setting
    const lightingEffects = generateCulturalLighting(culturalContext);
    
    setCulturalEffects({
      particles,
      calligraphyEffects,
      lightingEffects,
    });
  };

  /**
   * Generate Islamic geometric particles
   */
  const generateIslamicParticles = (context: ArabicCulturalContext) => {
    const particleCount = context.emotionalTone === 'spiritual' ? 50 : 30;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const geometricShape = selectGeometricShape(context.emotionalTone);
      particles.push({
        id: `particle-${i}`,
        shape: geometricShape,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        color: selectSacredColor(context.emotionalTone),
        animation: generateParticleAnimation(context.emotionalTone),
      });
    }
    
    return particles;
  };

  /**
   * Generate Arabic calligraphy effects
   */
  const generateCalligraphyEffects = (context: ArabicCulturalContext) => {
    return {
      textShadow: generateArabicTextShadow(context.emotionalTone),
      textGlow: generateArabicTextGlow(context.emotionalTone),
      letterSpacing: generateArabicLetterSpacing(context.emotionalTone),
      lineHeight: generateArabicLineHeight(context.emotionalTone),
    };
  };

  /**
   * Generate cultural lighting effects
   */
  const generateCulturalLighting = (context: ArabicCulturalContext) => {
    const lighting = {
      ambient: selectAmbientLighting(context.timeOfDay, context.setting),
      directional: selectDirectionalLighting(context.emotionalTone),
      color: selectLightingColor(context.emotionalTone, context.timeOfDay),
      intensity: calculateLightingIntensity(context.emotionalTone),
    };
    
    return lighting;
  };

  /**
   * Render individual cinematic layer
   */
  const renderCinematicLayer = (layer: CinematicLayer, index: number) => {
    const layerVariants = {
      initial: {
        opacity: 0,
        scale: 0.8,
        x: isRTL ? 100 : -100,
      },
      animate: {
        opacity: layer.opacity,
        scale: 1,
        x: 0,
        transition: {
          duration: layer.animation.duration / 1000,
          delay: layer.animation.delay / 1000,
          ease: layer.animation.easing,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        x: isRTL ? -100 : 100,
        transition: {
          duration: 0.5,
        },
      },
    };

    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      left: typeof layer.positioning.x === 'string' ? layer.positioning.x : `${layer.positioning.x}px`,
      top: typeof layer.positioning.y === 'string' ? layer.positioning.y : `${layer.positioning.y}px`,
      width: typeof layer.positioning.width === 'string' ? layer.positioning.width : `${layer.positioning.width}px`,
      height: typeof layer.positioning.height === 'string' ? layer.positioning.height : `${layer.positioning.height}px`,
      zIndex: layer.zIndex,
      mixBlendMode: layer.blending as any,
      direction: isRTL ? 'rtl' : 'ltr',
      textAlign: isRTL ? 'right' : 'left',
    };

    return (
      <motion.div
        key={layer.id}
        className={`cinematic-layer cinematic-layer--${layer.type}`}
        variants={layerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={layerStyle}
        onAnimationComplete={() => onLayerAnimationComplete?.(layer.id)}
      >
        {renderLayerContent(layer)}
      </motion.div>
    );
  };

  /**
   * Render layer content based on type
   */
  const renderLayerContent = (layer: CinematicLayer) => {
    switch (layer.type) {
      case 'background':
        return renderBackgroundLayer(layer);
      case 'video':
        return renderVideoLayer(layer);
      case 'character':
        return renderCharacterLayer(layer);
      case 'pattern':
        return renderPatternLayer(layer);
      case 'calligraphy':
        return renderCalligraphyLayer(layer);
      case 'effect':
        return renderEffectLayer(layer);
      case 'overlay':
        return renderOverlayLayer(layer);
      case 'ui':
        return renderUILayer(layer);
      default:
        return null;
    }
  };

  /**
   * Render background layer
   */
  const renderBackgroundLayer = (layer: CinematicLayer) => {
    if (layer.asset.type === 'video') {
      return (
        <video
          src={layer.asset.url}
          autoPlay
          loop
          muted
          playsInline
          className="cinematic-background-video"
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            filter: 'brightness(0.7) contrast(1.1) saturate(0.9)',
          }}
        />
      );
    }

    return (
      <img
        src={layer.asset.url}
        alt={layer.asset.alt}
        title={layer.asset.title}
        className="cinematic-background-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.8) contrast(1.2) saturate(1.1)',
        }}
      />
    );
  };

  /**
   * Render video layer
   */
  const renderVideoLayer = (layer: CinematicLayer) => (
    <video
      src={layer.asset.url}
      autoPlay
      loop
      muted
      playsInline
      className="cinematic-video-layer"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        mixBlendMode: 'overlay',
      }}
    />
  );

  /**
   * Render character layer
   */
  const renderCharacterLayer = (layer: CinematicLayer) => (
    <div className="cinematic-character-container">
      <img
        src={layer.asset.url}
        alt={layer.asset.alt}
        title={layer.asset.title}
        className="cinematic-character-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 20px rgba(201,169,110,0.5))',
        }}
      />
      {layer.asset.culturalContext && (
        <div className="cinematic-character-context">
          <div className="cultural-indicator">
            {getCulturalIcon(layer.asset.culturalContext.setting)}
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Render Islamic geometric pattern layer
   */
  const renderPatternLayer = (layer: CinematicLayer) => (
    <div
      className="cinematic-pattern-layer"
      dangerouslySetInnerHTML={{ __html: layer.asset.url }}
      style={{
        width: '100%',
        height: '100%',
        opacity: layer.opacity,
        mixBlendMode: layer.blending as any,
      }}
    />
  );

  /**
   * Render Arabic calligraphy layer
   */
  const renderCalligraphyLayer = (layer: CinematicLayer) => (
    <div
      className="cinematic-calligraphy-layer"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'rtl',
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: layer.asset.url }}
        style={{
          ...culturalEffects.calligraphyEffects,
          fontFamily: 'var(--font-arabic-title)',
        }}
      />
    </div>
  );

  /**
   * Render effect layer
   */
  const renderEffectLayer = (layer: CinematicLayer) => (
    <div className="cinematic-effect-layer">
      {/* Render specific effect based on layer parameters */}
      {layer.asset.metadata?.culturalSignificance && (
        <div className="effect-cultural-meaning">
          {layer.asset.metadata.culturalSignificance}
        </div>
      )}
    </div>
  );

  /**
   * Render overlay layer
   */
  const renderOverlayLayer = (layer: CinematicLayer) => (
    <div className="cinematic-overlay-layer">
      {layer.asset.type === 'pattern' && renderPatternLayer(layer)}
      {layer.asset.type === 'calligraphy' && renderCalligraphyLayer(layer)}
    </div>
  );

  /**
   * Render UI layer
   */
  const renderUILayer = (layer: CinematicLayer) => (
    <div className="cinematic-ui-layer">
      {/* Render UI elements with Arabic cultural styling */}
      <div className="ui-cultural-frame">
        <div className="islamic-border"></div>
        <div className="arabic-ornament"></div>
      </div>
    </div>
  );

  /**
   * Render Islamic geometric particles
   */
  const renderIslamicParticles = () => (
    <div className="islamic-particles-container">
      {culturalEffects.particles?.map((particle) => (
        <motion.div
          key={particle.id}
          className={`islamic-particle particle-${particle.shape}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
          }}
          animate={particle.animation}
        />
      ))}
    </div>
  );

  /**
   * Render cultural lighting effects
   */
  const renderCulturalLighting = () => {
    const { lightingEffects } = culturalEffects;
    if (!lightingEffects) return null;

    return (
      <div className="cultural-lighting-container">
        <div
          className="ambient-lighting"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${lightingEffects.color} 0%, transparent 70%)`,
            opacity: lightingEffects.intensity,
          }}
        />
        <div
          className="directional-lighting"
          style={{
            background: `linear-gradient(${lightingEffects.directional}, ${lightingEffects.color}, transparent)`,
            opacity: lightingEffects.intensity * 0.5,
          }}
        />
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="cinematic-renderer"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* Cultural lighting effects */}
      {renderCulturalLighting()}
      
      {/* Cinematic composition layers */}
      <AnimatePresence mode="wait">
        {composition.layers.map((layer, index) => (
          <React.Fragment key={layer.id}>
            {renderCinematicLayer(layer, index)}
          </React.Fragment>
        ))}
      </AnimatePresence>
      
      {/* Islamic geometric particles */}
      {renderIslamicParticles()}
      
      {/* Cultural overlay effects */}
      <div className="cultural-overlay">
        <div className="manuscript-texture"></div>
        <div className="islamic-border-frame"></div>
        <div className="arabic-ornamentation"></div>
      </div>
      
      {/* Arabic cultural indicators */}
      <div className="cultural-indicators">
        <div className={`cultural-setting-indicator setting-${composition.culturalContext.setting}`}>
          {getCulturalSettingIcon(composition.culturalContext.setting)}
        </div>
        <div className={`cultural-time-indicator time-${composition.culturalContext.timeOfDay}`}>
          {getTimeOfDayIcon(composition.culturalContext.timeOfDay)}
        </div>
      </div>
    </div>
  );
};

/**
 * Helper functions for cultural rendering
 */

function selectGeometricShape(emotionalTone: string): string {
  const shapes = {
    contemplative: 'star',
    dramatic: 'hexagon',
    spiritual: 'octagon',
    tragic: 'triangle',
    hopeful: 'circle',
    mysterious: 'diamond',
  };
  return shapes[emotionalTone] || 'star';
}

function selectSacredColor(emotionalTone: string): string {
  const colors = {
    contemplative: '#c9a96e',
    dramatic: '#dc2626',
    spiritual: '#1e3a8a',
    tragic: '#7c2d12',
    hopeful: '#22c55e',
    mysterious: '#6b21a8',
  };
  return colors[emotionalTone] || '#c9a96e';
}

function generateParticleAnimation(emotionalTone: string): any {
  const animations = {
    contemplative: {
      y: [0, -20, 0],
      opacity: [0.2, 0.6, 0.2],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    dramatic: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    spiritual: {
      rotate: [0, 360],
      opacity: [0.1, 0.5, 0.1],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };
  return animations[emotionalTone] || animations.contemplative;
}

function generateArabicTextShadow(emotionalTone: string) {
  const shadows = {
    contemplative: '0 2px 4px rgba(201, 169, 110, 0.3)',
    dramatic: '0 4px 8px rgba(220, 38, 38, 0.4)',
    spiritual: '0 3px 6px rgba(30, 58, 138, 0.3)',
    tragic: '0 2px 4px rgba(124, 45, 18, 0.3)',
    hopeful: '0 2px 4px rgba(34, 197, 94, 0.3)',
    mysterious: '0 3px 6px rgba(107, 33, 168, 0.3)',
  };
  return { textShadow: shadows[emotionalTone] || shadows.contemplative };
}

function generateArabicTextGlow(emotionalTone: string) {
  const glows = {
    contemplative: '0 0 10px rgba(201, 169, 110, 0.5)',
    dramatic: '0 0 15px rgba(220, 38, 38, 0.6)',
    spiritual: '0 0 12px rgba(30, 58, 138, 0.5)',
    tragic: '0 0 10px rgba(124, 45, 18, 0.5)',
    hopeful: '0 0 10px rgba(34, 197, 94, 0.5)',
    mysterious: '0 0 12px rgba(107, 33, 168, 0.5)',
  };
  return { filter: `drop-shadow(${glows[emotionalTone] || glows.contemplative})` };
}

function generateArabicLetterSpacing(emotionalTone: string) {
  const spacing = {
    contemplative: '0.02em',
    dramatic: '0.03em',
    spiritual: '0.025em',
    tragic: '0.02em',
    hopeful: '0.02em',
    mysterious: '0.025em',
  };
  return { letterSpacing: spacing[emotionalTone] || spacing.contemplative };
}

function generateArabicLineHeight(emotionalTone: string) {
  const lineHeights = {
    contemplative: 1.8,
    dramatic: 1.9,
    spiritual: 1.85,
    tragic: 1.8,
    hopeful: 1.8,
    mysterious: 1.85,
  };
  return { lineHeight: lineHeights[emotionalTone] || lineHeights.contemplative };
}

function selectAmbientLighting(timeOfDay: string, setting: string) {
  const lighting = {
    dawn: 'radial-gradient(circle at 30% 20%, #fbbf24 0%, transparent 50%)',
    morning: 'radial-gradient(circle at 50% 30%, #f59e0b 0%, transparent 60%)',
    afternoon: 'radial-gradient(circle at 70% 50%, #d97706 0%, transparent 70%)',
    evening: 'radial-gradient(circle at 80% 70%, #b45309 0%, transparent 80%)',
    night: 'radial-gradient(circle at 50% 90%, #92400e 0%, transparent 90%)',
  };
  return lighting[timeOfDay] || lighting.night;
}

function selectDirectionalLighting(emotionalTone: string) {
  const directions = {
    contemplative: '135deg',
    dramatic: '45deg',
    spiritual: '90deg',
    tragic: '180deg',
    hopeful: '45deg',
    mysterious: '225deg',
  };
  return directions[emotionalTone] || directions.contemplative;
}

function selectLightingColor(emotionalTone: string, timeOfDay: string) {
  const colors = {
    contemplative: '#c9a96e',
    dramatic: '#dc2626',
    spiritual: '#1e3a8a',
    tragic: '#7c2d12',
    hopeful: '#22c55e',
    mysterious: '#6b21a8',
  };
  return colors[emotionalTone] || colors.contemplative;
}

function calculateLightingIntensity(emotionalTone: string) {
  const intensities = {
    contemplative: 0.3,
    dramatic: 0.7,
    spiritual: 0.5,
    tragic: 0.6,
    hopeful: 0.4,
    mysterious: 0.5,
  };
  return intensities[emotionalTone] || intensities.contemplative;
}

function getCulturalIcon(setting: string): string {
  const icons = {
    mosque: '🕌',
    market: '🏪',
    home: '🏠',
    desert: '🏜️',
    library: '📚',
    court: '⚖️',
    cosmic: '🌌',
    historical: '🏛️',
  };
  return icons[setting] || '🕌';
}

function getCulturalSettingIcon(setting: string): string {
  return getCulturalIcon(setting);
}

function getTimeOfDayIcon(timeOfDay: string): string {
  const icons = {
    dawn: '🌅',
    morning: '☀️',
    afternoon: '🌤️',
    evening: '🌇',
    night: '🌙',
  };
  return icons[timeOfDay] || '🌙';
}

export default CinematicRenderer;