/**
 * OSIRIS — المفسدون في الأرض
 * Main Player v2 — Refactored with Extracted Hooks
 * Cinema-Mode Multimedia Interactive Digital Novel
 * 
 * REFACTORING STATUS: Step 1 - Basic Structure + Hooks
 */

import { useEffect, useMemo, useRef, useState, useCallback, memo, type CSSProperties } from 'react';
import styles from './MainPlayer.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

// Scene System
import { PART_LABELS, SCENES as ALL_SCENES, type DialogueLine, type Scene, type SceneChoice } from '@/lib/sceneSystem';

// Utils
import { getAsset } from '@/lib/assets';
import { customStyles, choicePanelStyles, endSceneStyles, buttonStyles } from '@/lib/styleUtils';
import { useBandwidthStrategy } from '@/lib/mediaStrategy';
import { detectOsirisEffectId, preloadOsirisEffects, type OsirisEffectId } from "@/lib/osirisEffects";
import { checkVisualEffectTriggers, type VisualEffect } from "@/lib/visualEffects";
import { loadCanonicalDialogueMap } from '@/lib/canonicalScript.ts';

// Components
import { CinematicStage } from '@/components/CinematicStage';
import { OsirisEffectLayer } from "@/components/OsirisEffectLayer";
import { GlobalMediaLayer } from "@/components/GlobalMediaLayer";
import { CharacterDisplay } from '@/components/CharacterDisplay';
import { ChoicePanel } from '@/components/ChoicePanel';

// Contexts
import { useMediaState } from "@/contexts/MediaStateContext";
import { useMediaActions } from "@/contexts/MediaActionsContext";

// Hooks
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaLayer } from '@/hooks/useMediaLayer';

// Assets
import osirisLogo from '@/LOGO/new-logo/favicon-black-0.25.png';

// Hoisted regex patterns for performance
const CHARACTER_REGEX_PATTERNS = {
  yahya: /قال يحيى|أجاب يحيى|همس يحيى|صرخ يحيى|رد يحيى|يحيى/i,
  laila: /قالت ليلى|أجابت ليلى|همست ليلى|صرخت ليلى|ليلى/i,
  tarek: /قال طارق|أجاب طارق|همس طارق|صوت طارق|تسجيل طارق|طارق/i,
  engineer: /قال المهندس الأول|أجاب المهندس الأول|المهندس الأول|المهندس/i,
  arius: /قال آريوس|آريوس/i,
  athanasius: /قال أثناسيوس|أثناسيوس/i,
};

function normalizeArabicForMatch(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[.,!?؛:]/g, '')
    .trim();
}

// Character configuration
interface CharacterConfig {
  name: string;
  arabicName: string;
  color: string;
  glowColor: string;
}

const CHARACTER_CONFIGS: Record<string, CharacterConfig> = {
  default: { name: 'Unknown', arabicName: 'مجهول', color: '#c9a96e', glowColor: 'rgba(201,169,110,0.3)' },
  yahya: { name: 'Yahya', arabicName: 'يحيى', color: '#7dd3fc', glowColor: 'rgba(125,211,252,0.4)' },
  laila: { name: 'Laila', arabicName: 'ليلى', color: '#f0abfc', glowColor: 'rgba(240,171,252,0.4)' },
  tarek: { name: 'Tarek', arabicName: 'طارق', color: '#86efac', glowColor: 'rgba(134,239,172,0.4)' },
  engineer: { name: 'Engineer', arabicName: 'المهندس', color: '#fde047', glowColor: 'rgba(253,224,71,0.4)' },
  arius: { name: 'Arius', arabicName: 'آريوس', color: '#fca5a5', glowColor: 'rgba(252,165,165,0.4)' },
  athanasius: { name: 'Athanasius', arabicName: 'أثناسيوس', color: '#fdba74', glowColor: 'rgba(253,186,116,0.4)' },
};

// Voice scene anchor map
const VOICE_SCENE_ANCHORS: { voice: number; sceneId: string; anchor: string; fallbackAt: number }[] = [
  { voice: 1, sceneId: 'two-3-summit', anchor: 'عندما يرى البشر آلهتهم', fallbackAt: 1 },
  { voice: 2, sceneId: 'two-3-summit', anchor: 'رأيت إلهي يأكل من الأرض', fallbackAt: 4 },
  { voice: 3, sceneId: 'two-3-summit', anchor: 'من يهتم بالتاريخ إلا المؤرخون المجانين', fallbackAt: 5 },
  { voice: 4, sceneId: 'three-5-final', anchor: 'أنت في نيقية والعالم ينهار', fallbackAt: 5 },
  { voice: 5, sceneId: 'five-6c-1-laila-pain', anchor: 'الناس ليسوا أرقام', fallbackAt: 3 },
  { voice: 6, sceneId: 'five-6c-1-laila-pain', anchor: 'قصتي تحدث الآن', fallbackAt: 5 },
  { voice: 7, sceneId: 'seven-13-1-nicaea', anchor: 'هذه نيقية', fallbackAt: 2 },
  { voice: 8, sceneId: 'five-6c-1-laila-pain', anchor: 'سمعت صوتها', fallbackAt: 2 },
  { voice: 9, sceneId: 'five-6c-1-laila-pain', anchor: 'لم يكن يعرفها', fallbackAt: 5 },
  { voice: 10, sceneId: 'five-6c-1-laila-pain', anchor: 'في عام 2001', fallbackAt: 6 },
  { voice: 11, sceneId: 'five-6c-1-laila-pain', anchor: 'عندما يسقط النظام', fallbackAt: 4 },
  { voice: 12, sceneId: 'seven-13-2-closing', anchor: 'سُئلت يوما', fallbackAt: 3 },
  { voice: 13, sceneId: 'five-6c-1-laila-pain', anchor: 'في يوليو 2001', fallbackAt: 3 },
  { voice: 14, sceneId: 'two-3-summit', anchor: 'هل أنت المسيح ابن الله', fallbackAt: 1 },
  { voice: 15, sceneId: 'five-6c-1-laila-pain', anchor: 'امي كانت ضحية للمؤسسة ايضا', fallbackAt: 3 },
  { voice: 16, sceneId: 'five-6c-2-tarek-second', anchor: 'اذا رايت نيقية فستفهم كيف تسرق الاديان', fallbackAt: 2 },
  { voice: 17, sceneId: 'seven-13-2-closing', anchor: 'الملف رقم واحد يغلق مؤقتا', fallbackAt: 7 },
  { voice: 18, sceneId: 'seven-13-2-closing', anchor: 'القضية مستمرة والخيار الان لك', fallbackAt: 9 },
];

// Part label utilities
function getPartFromSceneId(sceneId: string): number {
  const m = sceneId.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
}

function getPartLabel(sceneId: string, isArabic: boolean): string {
  const idx = getPartFromSceneId(sceneId) - 1;
  return isArabic ? PART_LABELS[idx]?.ar : (PART_LABELS[idx]?.en || `Part ${idx + 1}`);
}

// Main Component
interface MainPlayerProps {
  initialSceneId?: string;
}

export function MainPlayerNew({ initialSceneId = 'intro' }: MainPlayerProps) {
  const [, setLocation] = useLocation();
  const globalMediaState = useMediaState();
  const { globalPlay, globalPause } = useMediaActions();
  const bandwidth = useBandwidthStrategy();
  const prefersReducedMotion = useReducedMotion();

  // Core State
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [currentSceneId, setCurrentSceneId] = useState<string>(initialSceneId);
  const [sceneHistory, setSceneHistory] = useState<string[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [displayedArabic, setDisplayedArabic] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Media Layer Hook (replaces ~25 lines of media state/refs)
  const media = useMediaLayer();

  // Media Controls
  const [bgLoaded, setBgLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [fxFlash, setFxFlash] = useState(0);
  const [fxShake, setFxShake] = useState(0);
  const [uiPulse, setUiPulse] = useState(0);

  // Audio enable
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  // Allow video based on bandwidth
  const allowVideo = useMemo(() => {
    return bandwidth.quality === 'high' || bandwidth.quality === 'auto';
  }, [bandwidth.quality]);

  // Derived State
  const currentScene = ALL_SCENES[currentSceneId];
  const isArabic = lang === 'ar';

  // Get current dialogue
  const currentDialogue = useMemo(() => {
    if (!currentScene?.dialogue) return undefined;
    return currentScene.dialogue[dialogueIndex];
  }, [currentScene, dialogueIndex]);

  // Character detection
  const currentCharConfig = useMemo((): CharacterConfig => {
    const name = currentDialogue?.character?.toLowerCase() || '';
    if (CHARACTER_REGEX_PATTERNS.yahya.test(name)) return CHARACTER_CONFIGS.yahya;
    if (CHARACTER_REGEX_PATTERNS.laila.test(name)) return CHARACTER_CONFIGS.laila;
    if (CHARACTER_REGEX_PATTERNS.tarek.test(name)) return CHARACTER_CONFIGS.tarek;
    if (CHARACTER_REGEX_PATTERNS.engineer.test(name)) return CHARACTER_CONFIGS.engineer;
    if (CHARACTER_REGEX_PATTERNS.arius.test(name)) return CHARACTER_CONFIGS.arius;
    if (CHARACTER_REGEX_PATTERNS.athanasius.test(name)) return CHARACTER_CONFIGS.athanasius;
    return CHARACTER_CONFIGS.default;
  }, [currentDialogue]);

  // Typewriter Effect (to be extracted to useDialoguePlayback)
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTypewriter = useCallback(() => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
      typewriterRef.current = null;
    }
  }, []);

  const startTypewriter = useCallback((text: string, arabicText: string, speed: number = 30) => {
    clearTypewriter();
    setIsTyping(true);
    setIsDialogueComplete(false);
    setDisplayedText('');
    setDisplayedArabic('');

    let index = 0;
    const maxLength = Math.max(text.length, arabicText.length);

    const typeNext = () => {
      if (index < maxLength) {
        setDisplayedText(text.slice(0, index + 1));
        setDisplayedArabic(arabicText.slice(0, index + 1));
        index++;
        typewriterRef.current = setTimeout(typeNext, speed);
      } else {
        setIsTyping(false);
        setIsDialogueComplete(true);
        typewriterRef.current = null;
      }
    };

    typeNext();
  }, [clearTypewriter]);

  // Scene Navigation
  const goToScene = useCallback((sceneId: string, recordHistory: boolean = true) => {
    if (!ALL_SCENES[sceneId]) {
      console.error(`Scene not found: ${sceneId}`);
      return;
    }

    if (recordHistory && currentSceneId) {
      setSceneHistory(prev => [...prev, currentSceneId]);
    }

    setCurrentSceneId(sceneId);
    setDialogueIndex(0);
    setShowChoices(false);
    setIsTransitioning(true);

    // Reset dialogue
    const newScene = ALL_SCENES[sceneId];
    if (newScene?.dialogue?.[0]) {
      startTypewriter(
        newScene.dialogue[0].text || '',
        newScene.dialogue[0].arabicText || ''
      );
    }

    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentSceneId, startTypewriter]);

  const goBack = useCallback(() => {
    if (sceneHistory.length > 0) {
      const previousScene = sceneHistory[sceneHistory.length - 1];
      setSceneHistory(prev => prev.slice(0, -1));
      setCurrentSceneId(previousScene);
      setDialogueIndex(0);
    }
  }, [sceneHistory]);

  const advanceDialogue = useCallback(() => {
    if (!currentScene?.dialogue) return;

    const nextIndex = dialogueIndex + 1;
    if (nextIndex < currentScene.dialogue.length) {
      setDialogueIndex(nextIndex);
      const nextDialogue = currentScene.dialogue[nextIndex];
      startTypewriter(nextDialogue.text || '', nextDialogue.arabicText || '');
    } else if (currentScene.choices?.length) {
      setShowChoices(true);
    }
  }, [currentScene, dialogueIndex, startTypewriter]);

  const handleChoice = useCallback((choice: SceneChoice) => {
    setShowChoices(false);
    if (choice.targetScene) {
      goToScene(choice.targetScene);
    }
  }, [goToScene]);

  // Initial load
  useEffect(() => {
    if (currentScene?.dialogue?.[0]) {
      startTypewriter(
        currentScene.dialogue[0].text || '',
        currentScene.dialogue[0].arabicText || ''
      );
    }
  }, []); // Run once on mount

  // Cleanup
  useEffect(() => {
    return () => {
      clearTypewriter();
    };
  }, [clearTypewriter]);

  if (!currentScene) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div>Scene not found: {currentSceneId}</div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${styles.mainPlayer}`}>
      {/* STEP 1: Basic structure with media hook */}
      {/* More components will be added incrementally */}
      
      {/* Cinematic Stage - Background Video/Image with Effects */}
      <CinematicStage
        scene={currentScene}
        sceneId={currentSceneId}
        bgImageSrc={getAsset(currentScene.backgroundImage)}
        bgVideoSrc={getAsset(currentScene.backgroundVideo)}
        audioDescSrcEn={currentScene.backgroundVideoAudioDescEn}
        audioDescSrcAr={currentScene.backgroundVideoAudioDescAr}
        allowVideo={allowVideo}
        bgLoaded={bgLoaded}
        setBgLoaded={setBgLoaded}
        videoReady={videoReady}
        setVideoReady={setVideoReady}
        overlay={''}
        mediaFilter={''}
        videoRef={media.bgVideo}
        fx={{ flash: fxFlash, shake: fxShake, uiPulse }}
      />

      {/* Osiris Effects Layer */}
      <OsirisEffectLayer 
        effectId={detectOsirisEffectId({ sceneId: currentSceneId, sceneTitle: currentScene.title, sceneArabicTitle: currentScene.arabicTitle, visualEffect: currentScene.visualEffect, text: currentDialogue?.text, arabicText: currentDialogue?.arabicText })} 
        allowVideo={allowVideo} 
      />

      {/* Character Display */}
      <CharacterDisplay
        name={currentCharConfig.name}
        arabicName={currentCharConfig.arabicName}
        color={currentCharConfig.color}
        glowColor={currentCharConfig.glowColor}
        position="left"
        isVisible={showCharacter && !!currentDialogue?.character}
        isArabic={isArabic}
      />

      {/* Dialogue Box */}
      <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-0 right-0 z-30 px-2 sm:px-4 md:px-6 lg:px-10 pb-2 sm:pb-4 max-h-[55%] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl"
        >
          <div
            onClick={advanceDialogue}
            className={`relative rounded-xl sm:rounded-2xl px-3 pt-3 pb-20 sm:px-5 sm:pt-4 sm:pb-24 md:px-7 md:pt-5 md:pb-28 lg:px-9 lg:pt-6 lg:pb-32 ${isArabic ? 'text-right' : ''} ${styles.dynamicDialogueBox} cursor-pointer select-none`}
            dir={isArabic ? 'rtl' : 'ltr'}
            style={{
              backgroundColor: currentScene.backgroundVideo ? 'rgba(0,0,0,0.56)' : 'rgba(0,0,0,0.66)',
              border: `1px solid ${currentCharConfig.color}18`,
              boxShadow: `0 10px 70px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 ${currentCharConfig.color}10`,
              backdropFilter: 'blur(18px) saturate(140%)',
            } as React.CSSProperties}
          >
            {/* Character badge */}
            {currentDialogue?.character && (
              <div className={`flex items-center gap-2 mb-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentCharConfig.color }} />
                <span className="text-xs sm:text-sm font-medium tracking-wider uppercase" style={{ color: currentCharConfig.color }}>
                  {isArabic ? currentCharConfig.arabicName : currentCharConfig.name}
                </span>
              </div>
            )}

            {/* Text */}
            <h2 className={`font-arabic leading-relaxed ${isArabic ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg md:text-xl opacity-90'}`} style={{ color: '#e8e6e3' }}>
              {isArabic ? displayedArabic : displayedText}
              {isTyping && <span className="inline-block w-0.5 h-5 sm:h-6 bg-amber-400 ml-1 animate-pulse" />}
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Choice Panel */}
      <ChoicePanel
        choices={currentScene.choices}
        show={showChoices}
        isArabic={isArabic}
        onSelect={handleChoice}
        accentColor={currentCharConfig.color}
      />

      {/* Navigation Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={goBack}
          disabled={sceneHistory.length === 0}
          className="px-3 py-2 rounded-lg bg-black/50 text-white/70 hover:text-white disabled:opacity-30 transition-opacity"
        >
          ←
        </button>
        <button
          onClick={() => setLocation('/')}
          className="px-3 py-2 rounded-lg bg-black/50 text-white/70 hover:text-white transition-opacity"
        >
          ✕
        </button>
      </div>

      {/* Language Toggle */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
          className="px-3 py-2 rounded-lg bg-black/50 text-white/70 hover:text-white transition-opacity"
        >
          {isArabic ? 'English' : 'العربية'}
        </button>
      </div>

      {/* Part Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="px-4 py-2 rounded-lg bg-black/50 text-white/70 text-sm">
          {getPartLabel(currentSceneId, isArabic)}
        </div>
      </div>
    </div>
  );
}

export default MainPlayerNew;
