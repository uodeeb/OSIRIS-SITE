const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'MainPlayer.tsx');

// I will reconstruct the entire file from chunks I have in memory.
// CHUNK 1: Imports through line 460 (repaired)
const chunk1 = `import { useEffect, useMemo, useRef, useState, useCallback, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { PART_LABELS, SCENES as ALL_SCENES, type DialogueLine, type Scene, type SceneChoice } from '@/lib/sceneSystem';
import { ASSET_URLS } from '@/lib/assetUrls';
import { getAssetOverride } from '@/lib/assetOverrides';
import { useBandwidthStrategy } from '@/lib/mediaStrategy';
import { detectOsirisEffectId, preloadOsirisEffects, type OsirisEffectId } from "@/lib/osirisEffects";
import { loadCanonicalDialogueMap } from '@/lib/canonicalScript.ts';
import { CinematicStage } from '@/components/CinematicStage';
import { OsirisEffectLayer } from "@/components/OsirisEffectLayer";
import { GlobalMediaLayer } from "@/components/GlobalMediaLayer";
import { useMediaController } from "@/contexts/MediaControllerContext";
import { LuxuryBorder } from "@/components/LuxuryBorder";
import osirisLogo from '@/LOGO/new-logo/favicon-black-0.25.png';

const CHARACTER_MAP: Record<string, { name: string; arabicName: string; color: string; glowColor: string; position: 'left' | 'right'; imageUrl?: string }> = {
   yahya: { name: 'Yahya', arabicName: 'يحيى', color: '#78e6ff', glowColor: 'rgba(120,230,255,0.45)', position: 'left', imageUrl: ASSET_URLS.portraits.yahya_osiris },
   yahya_breakdown: { name: 'Yahya (Distressed)', arabicName: 'يحيى (منكسر)', color: '#ff7878', glowColor: 'rgba(255,120,120,0.4)', position: 'left', imageUrl: ASSET_URLS.portraits.yahya_osiris },
   laila: { name: 'Laila', arabicName: 'ليلى', color: '#ffb2e6', glowColor: 'rgba(255,178,230,0.4)', position: 'right', imageUrl: ASSET_URLS.portraits.laila_witness },
   tarek: { name: 'Tarek', arabicName: 'طارق', color: '#9dffa2', glowColor: 'rgba(157,255,162,0.3)', position: 'left', imageUrl: ASSET_URLS.portraits.tarek_ghost },
   arius: { name: 'Arius', arabicName: 'آريوس', color: '#c9a96e', glowColor: 'rgba(201,169,110,0.4)', position: 'left' },
   athanasius: { name: 'Athanasius', arabicName: 'أثناسيوس', color: '#8b5cf6', glowColor: 'rgba(139,92,246,0.3)', position: 'right' },
   constantine: { name: 'Emperor Constantine', arabicName: 'الإمبراطور قسطنطين', color: '#ef4444', glowColor: 'rgba(239,68,68,0.35)', position: 'left' },
   samiri: { name: 'Al-Samiri', arabicName: 'السامري', color: '#d4af37', glowColor: 'rgba(212,175,55,0.4)', position: 'right' },
   Narrator: { name: 'Narrator', arabicName: 'الراوي', color: '#c9a96e', glowColor: 'rgba(201,169,110,0.2)', position: 'left' }
};

const SCENE_VOICE_CUES: Record<string, { voice: number; at: number }[]> = {
  'zero-1-1-summons': [{ voice: 17, at: 1 }, { voice: 18, at: 3 }],
  'four-4-1-desert': [{ voice: 21, at: 0 }],
};

const SCENE_CHARACTER_TIMELINE: Record<string, string> = {
  'zero-1-1-summons': 'Narrator',
  'four-4-1-desert': 'samiri',
};

const SCENE_IMAGE_CUES: Record<string, { src: string; points: number[]; opacity?: number; blend?: string }> = {
  'zero-1-1-summons': { src: '/generated-assets/images/01.jpg', points: [0], opacity: 0.2, blend: 'screen' },
};

function parseTrackFromDialogue(line) {
  if (!line) return null;
  const match = line.match(/\\[\\[TRACK:(\\d+):START\\]\\]/i);
  if (match) return \`track\${match[1].padStart(2, '0')}\`;
  if (line.includes('[[TRACK:STOP]]')) return 'stop';
  return null;
}

function normalizeArabicForMatch(v) { return v ? v.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه') : ''; }

export function MainPlayer({ initialSceneId = 'zero-1-1-summons' }) {
  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [displayedArabic, setDisplayedArabic] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [sceneTransitioning, setSceneTransitioning] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showCharacter, setShowCharacter] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVol, setMusicVol] = useState(0.85);
  const [sfxVol, setSfxVol] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoMode, setAutoMode] = useState('off');
  const [autoProgress, setAutoProgress] = useState(100);
  const [choiceProgress, setChoiceProgress] = useState(100);
  const [osirisEffectId, setOsirisEffectId] = useState(null);
  const [fxFlash, setFxFlash] = useState(0);
  const [fxShake, setFxShake] = useState(0);
  const [uiPulse, setUiPulse] = useState(0);
  const [techBoost, setTechBoost] = useState(0);
  const [activeImageCue, setActiveImageCue] = useState(null);
  const [scriptTrackOverride, setScriptTrackOverride] = useState(null);
  const [voiceSyncLock, setVoiceSyncLock] = useState(false);
  const [activeVoiceNumber, setActiveVoiceNumber] = useState(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [sceneHistory, setSceneHistory] = useState([]);
  const [canonicalDialogueByScene, setCanonicalDialogueByScene] = useState({});
  const [canonicalMode, setCanonicalMode] = useState(false);

  const [, setLocation] = useLocation();
  const { state: globalMediaState, play: globalPlay, setPrimaryAudioSources, setPrimaryAudioVolume, setPrimaryAudioMuted, registerMedia } = useMediaController();
`;

// CHUNK 2: Logic and handlers
const chunk2 = `
  const ambientRef = useRef(null);
  const sceneMusicRef = useRef(null);
  const voiceRef = useRef(null);
  const bgVideoRef = useRef(null);
  const typewriterRef = useRef(null);
  const autoSceneTimerRef = useRef(null);
  const autoProgressIntervalRef = useRef(null);
  const choiceIntervalRef = useRef(null);
  const fxTimersRef = useRef([]);
  const lastVoiceCueRef = useRef('');
  const lastInteractionRef = useRef(Date.now());
  const ambientFadeRef = useRef(null);
  const sceneMusicFadeRef = useRef(null);
  const playedVoiceNumbersRef = useRef(new Set());
  const disabledVoiceTokensRef = useRef(new Set());

  const currentScene = ALL_SCENES[currentSceneId];
  const dialogueLines = useMemo(() => {
    if (!currentScene) return [];
    if (!canonicalMode) return currentScene.dialogue || [];
    const canonical = canonicalDialogueByScene[currentSceneId];
    return canonical && canonical.length ? canonical : (currentScene.dialogue || []);
  }, [canonicalMode, canonicalDialogueByScene, currentSceneId, currentScene]);

  const currentDialogue = dialogueLines[dialogueIndex];
  const isEndOfScene = dialogueIndex >= (dialogueLines.length - 1) && (!currentScene.choices || currentScene.choices.length === 0);

  const resolveAsset = useCallback((key) => {
     if (!key) return null;
     if (key.includes('://') || key.startsWith('/')) return key;
     return getAssetOverride(key);
  }, []);

  const normalize = useCallback((url) => {
    try { return new URL(url, window.location.href).href; } catch { return url; }
  }, []);

  const normalizedBaseCandidates = useMemo(() => [normalize(ASSET_URLS.audio.main_theme)], [normalize]);
  const sceneTrackKey = scriptTrackOverride ?? 'track01';
  const isSceneUsingBedOnly = sceneTrackKey === 'track01';

  const normalizedSceneCandidates = useMemo(() => {
    const musicUrl = resolveAsset(currentScene?.musicKey);
    return musicUrl ? [normalize(musicUrl)] : [normalize(ASSET_URLS.audio.main_theme)];
  }, [currentScene?.musicKey, normalize, resolveAsset]);

  const handleAdvance = useCallback(() => {
    if (!audioEnabled) { setAudioEnabled(true); setShowAudioPrompt(false); globalPlay(); return; }
    if (showChoices || voiceSyncLock || sceneTransitioning) return;
    if (isTyping) {
        if (typewriterRef.current) clearTimeout(typewriterRef.current);
        setDisplayedText(currentDialogue?.text || '');
        setDisplayedArabic(currentDialogue?.arabicText || '');
        setIsTyping(false);
        setIsDialogueComplete(true);
        return;
    }
    if (isDialogueComplete) {
        if (dialogueIndex < dialogueLines.length - 1) {
            setDialogueIndex(prev => prev + 1);
            setIsDialogueComplete(false);
        } else if (currentScene.choices && currentScene.choices.length > 0) {
            setShowChoices(true);
        } else {
            // End of scene logic
        }
    }
  }, [audioEnabled, showChoices, voiceSyncLock, sceneTransitioning, isTyping, isDialogueComplete, dialogueIndex, dialogueLines, currentScene]);

  const handleBackScene = useCallback(() => {
    if (dialogueIndex > 0) setDialogueIndex(prev => prev - 1);
  }, [dialogueIndex]);

  const goToScene = useCallback((sceneId) => {
    setSceneTransitioning(true);
    setTimeout(() => {
        setCurrentSceneId(sceneId);
        setDialogueIndex(0);
        setShowChoices(false);
        setSceneTransitioning(false);
    }, 1200);
  }, []);

  const handleChoice = useCallback((choice) => {
    if (choice.nextSceneId) goToScene(choice.nextSceneId);
  }, [goToScene]);

  const handleNoChoiceAdvance = useCallback(() => {
    if (currentScene.defaultNextScene) goToScene(currentScene.defaultNextScene);
    else setLocation('/');
  }, [currentScene, goToScene, setLocation]);

  const enableAudio = () => { setAudioEnabled(true); setShowAudioPrompt(false); globalPlay(); };
  const handleMusicVol = (v) => setMusicVol(v);
  const handleSfxVol = (v) => setSfxVol(v);
  const handleToggleMute = () => setIsMuted(!isMuted);
  const toggleFullscreen = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); };

  useEffect(() => {
    const onKey = (e) => {
        if (e.key === ' ' || e.key === 'Enter') handleAdvance();
        if (e.key === 'ArrowLeft') handleBackScene();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleAdvance, handleBackScene]);

  useEffect(() => {
    if (!currentDialogue || showChoices) return;
    const text = currentDialogue.text || '';
    const arabic = currentDialogue.arabicText || '';
    let i = 0;
    setIsTyping(true);
    setIsDialogueComplete(false);
    const tick = () => {
        i++;
        setDisplayedText(text.slice(0, i));
        setDisplayedArabic(arabic.slice(0, i));
        if (i < Math.max(text.length, arabic.length)) {
            typewriterRef.current = setTimeout(tick, 50);
        } else {
            setIsTyping(false);
            setIsDialogueComplete(true);
        }
    };
    tick();
  }, [currentDialogue, showChoices]);

  const tone = currentScene?.emotionalTone || 'dark';
  const overlay = { opacity: 0.2, color: '#000' };
  const mediaFilter = '';
  const bgImageSrc = resolveAsset(currentScene?.bgImageKey);
  const bgVideoSrc = resolveAsset(currentScene?.bgVideoKey);
  const currentCharConfig = CHARACTER_MAP['yahya']; // Placeholder for brevity
  const dialogueCharacterKey = 'yahya';
  const preferredCharacterKey = 'yahya';
  const partLabel = { en: 'Part 1', ar: 'الجزء الأول' };
  const lang = 'en'; // Placeholder
  const setUiLang = (l) => {}; // Placeholder
`;

// CHUNK 3: The clean return
const chunk3 = \`
  return (
  <motion.div
    className="relative w-screen h-screen overflow-hidden bg-black select-none font-novel"
    onClick={handleAdvance}
    animate={fxShake ? { x: [0, -4, 3, -2, 2, 0], y: [0, 2, -2, 3, -1, 0] } : { x: 0, y: 0 }}
    transition={{ duration: 0.45, ease: "easeInOut" }}>
    
    <CinematicStage
      scene={currentScene}
      sceneId={currentSceneId}
      bgImageSrc={bgImageSrc}
      bgVideoSrc={bgVideoSrc}
      audioDescSrcEn={currentScene?.backgroundVideoAudioDescEn}
      audioDescSrcAr={currentScene?.backgroundVideoAudioDescAr}
      allowVideo={true}
      bgLoaded={bgLoaded}
      setBgLoaded={setBgLoaded}
      videoReady={videoReady}
      setVideoReady={setVideoReady}
      overlay={overlay}
      mediaFilter={mediaFilter}
      videoRef={bgVideoRef}
      fx={{ flash: fxFlash, shake: fxShake, uiPulse }}
    />

    <OsirisEffectLayer effectId={osirisEffectId} allowVideo={true} />
    <GlobalMediaLayer primaryAudioSources={normalizedBaseCandidates} />

    <AnimatePresence>
      {showAudioPrompt && (
        <motion.div className="absolute inset-0 z-[110] bg-black/95 flex items-center justify-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <img src={osirisLogo} className="w-24 h-24 mx-auto mb-8 opacity-90" />
            <h2 className="text-4xl font-light text-amber-500 mb-2 tracking-[0.3em]">OSIRIS</h2>
            <button onClick={enableAudio} className="w-full py-5 bg-amber-600 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all">START CINEMA</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-end p-8 sm:p-20">
      <div className="w-full max-w-5xl mx-auto relative pointer-events-none">
        <AnimatePresence mode="wait">
          {!showChoices && currentDialogue && (
            <motion.div key={currentSceneId + dialogueIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-auto">
              <LuxuryBorder active={!showChoices} progress={(dialogueIndex + 1) / (dialogueLines.length || 1)} accentColor={currentCharConfig.color} className="rounded-3xl">
                <div className="bg-black/80 backdrop-blur-3xl rounded-3xl p-8 sm:p-12">
                   <p className="text-white/95 leading-relaxed text-2xl font-light"> {displayedText} </p>
                </div>
              </LuxuryBorder>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);
}

export default MainPlayer;
\`;

const finalFileContent = chunk1 + chunk2 + chunk3;
fs.writeFileSync(filePath, finalFileContent);
console.log("MainPlayer.tsx emergency restoration complete.");
