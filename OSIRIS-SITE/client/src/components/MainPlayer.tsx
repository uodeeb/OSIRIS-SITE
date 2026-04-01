import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { SCENES as ALL_SCENES, PART_LABELS, type DialogueLine } from '@/lib/sceneSystem';
import { ASSET_URLS } from '@/lib/assetUrls';
import { getAssetOverride } from '@/lib/assetOverrides';
import { CinematicStage } from '@/components/CinematicStage';
import { OsirisEffectLayer } from "@/components/OsirisEffectLayer";
import { GlobalMediaLayer } from "@/components/GlobalMediaLayer";
import { useMediaController } from "@/contexts/MediaControllerContext";
import { detectOsirisEffectId, type OsirisEffectId } from '@/lib/osirisEffects';
import osirisLogo from '@/LOGO/new-logo/favicon-black-0.25.png';

// =============================================================================
// ENGINE3 SYNC SYSTEM - COMPLETE OVERHAUL
// =============================================================================

// =============================================================================
// 1. VOICE SYNC WITH TIMING
// Based on OSIRIS_CINEMATIC_TIMELINE.md and OSIRIS_ASSET_PROMPTS.md
// Voice plays when dialogueIndex reaches 'at', after typing finishes + dialogueStartMs
// =============================================================================
interface VoiceCue {
  voice: number;
  at: number;
  lock?: boolean;
  dialogueStartMs?: number;
}

const SCENE_VOICE_CUES: Record<string, VoiceCue[]> = {
  // Part 0 - NO VOICE CUES (narration only)
  'zero-1-1-summons': [],
  
  // VOICE 01 - The Opening Argument (cosmic narrator: "الملف رقم واحد")
  'zero-1-2-prosecution': [
    { voice: 1, at: 2, lock: true, dialogueStartMs: 500 },  // OSIRIS speaks "الملف رقم: واحد"
    { voice: 1, at: 9, lock: true, dialogueStartMs: 500 },  // OSIRIS continues with accusation
  ],
  
  // Part 1 - Tariq's Story
  // NO VOICE - one-1-5-1-promise (café narration)
  // NO VOICE - one-1-5-2-bitter-truth (lab narration)
  'one-1-5-3-no-escape': [],  // Paranoia scene - NO voice
  
  // VOICE 04 - Tarek's Final Farewell on Rooftop
  'one-1-5-4-sacrifice': [
    { voice: 4, at: 3, lock: true, dialogueStartMs: 500 },  // Tarek's message to Yahya
  ],
  
  // Part 2 - NO VOICE CUES (narration only for escape scenes)
  'two-2-1-escape': [],
  'two-2-2-osiris-launch': [],
  
  // Part 3 - NO VOICE - three-3-1-creation (narration only)
  
  // VOICE 02 - Devil's Oath / Algorithm Explanation
  'three-3-1b-devil-song': [
    { voice: 2, at: 2, lock: true, dialogueStartMs: 500 },  // OSIRIS explains the algorithm
  ],
  'three-3-2-virus-design': [
    { voice: 2, at: 3, lock: true, dialogueStartMs: 500 },  // OSIRIS: 6 axes
    { voice: 5, at: 9, lock: true, dialogueStartMs: 500 },  // VOICE 05: Yahya's realization
  ],
  
  // Part 4 - NO VOICE (narration only for desert scenes)
  'four-4-1-desert': [],
  'four-4-2-crowd-engineering': [],
  
  // VOICE 03 - Tarek's Recorded Message
  'four-5-1-tarek-message': [
    { voice: 3, at: 3, lock: true, dialogueStartMs: 500 },  // Tarek's recording
  ],
  'four-5-2-analyst-tears': [],  // NO voice - emotional narration
  
  // Part 5 - Nicaea
  'five-6a-1-nicaea-debate': [],  // NO voice - debate narration
  'five-6b-1-constantine': [],    // NO voice - emperor/sage narration
  'five-6c-1-laila-pain': [
    { voice: 15, at: 4, lock: true, dialogueStartMs: 500 },  // VOICE 15: Laila's pain
  ],
  'five-6c-2-tarek-second': [],   // NO explicit voice cue in timeline
  
  // Part 6 - Andalusia / 20th Century
  'six-8-1-andalusia': [],       // NO voice - narration
  'six-8-2-last-tears': [
    { voice: 6, at: 3, lock: true, dialogueStartMs: 500 },  // VOICE 06: "ابكِ كالنساء..."
  ],
  'six-8b-1-berlin': [],          // NO voice - narration
  'six-8c-1-death-signatures': [], // NO voice - narration
  'six-8d-1-attack': [],         // NO voice - narration
  'six-8d-2-final-update': [],   // NO voice - narration
  
  // Transition - VOICE 09 - Tarek in Dream
  'transition-dream': [
    { voice: 9, at: 3, lock: true, dialogueStartMs: 500 },  // Tarek's final message
  ],
  
  // Part 7 - Karbala & Resolution
  'seven-10-1-karbala': [
    { voice: 13, at: 5, lock: true, dialogueStartMs: 500 },  // VOICE 13: Laila explains Hussein
    { voice: 8, at: 7, lock: true, dialogueStartMs: 500 },  // VOICE 08: The antivirus
  ],
  'seven-11-1-temptation': [
    { voice: 14, at: 3, lock: true, dialogueStartMs: 500 },  // VOICE 14: Engineer's offer
  ],
  'seven-11-2-decision': [
    { voice: 10, at: 4, lock: true, dialogueStartMs: 500 },  // VOICE 10: Yahya's choice
  ],
  'seven-11-3-yahya-death': [],  // NO voice - narration
  
  // VOICE 12 - Yahya's Dying Words / VOICE 11 - Closing
  'seven-12-1-truth-leak': [
    { voice: 12, at: 5, lock: true, dialogueStartMs: 500 },  // VOICE 12: "كوني الشاهدة"
    { voice: 11, at: 7, lock: true, dialogueStartMs: 500 },  // VOICE 11: OSIRIS closing
  ],
  'seven-13-1-awakening': [],     // NO voice - narration
  'seven-13-2-closing': [
    { voice: 11, at: 2, lock: true, dialogueStartMs: 500 },  // VOICE 11: The verdict
  ],
};

// =============================================================================
// 2. IMAGE OVERLAY WITH CINEMATIC ANIMATIONS
// Animation types: 'fade', 'zoom', 'glitch', 'pulse', 'scan', 'warp'
// =============================================================================
type ImageAnimationType = 'fade' | 'zoom' | 'glitch' | 'pulse' | 'scan' | 'warp';

interface ImageCue {
  src: string;
  points: number[];
  opacity?: number;
  blend?: string;
  token: string;
  animation?: ImageAnimationType;
  overlayOpacity?: number;
}

const SCENE_IMAGE_CUES: Record<string, ImageCue> = {
  'zero-1-1-summons': { 
    src: '/generated-assets/images/01.jpg', 
    points: [0, 4], 
    opacity: 0.3, 
    blend: 'screen', 
    token: 'cue-01',
    animation: 'pulse'
  },
  'zero-1-2-prosecution': { 
    src: '/generated-assets/images/01.jpg', 
    points: [2, 6], 
    opacity: 0.2, 
    blend: 'overlay', 
    token: 'cue-01b',
    animation: 'scan'
  },
  'one-1-5-1-promise': { 
    src: '/generated-assets/images/02.jpg', 
    points: [0, 2], 
    opacity: 0.25, 
    blend: 'screen', 
    token: 'cue-02',
    animation: 'fade'
  },
  'one-1-5-2-bitter-truth': { 
    src: '/generated-assets/images/02.jpg', 
    points: [1, 3], 
    opacity: 0.25, 
    blend: 'overlay', 
    token: 'cue-02b',
    animation: 'glitch'
  },
  'one-1-5-3-no-escape': { 
    src: '/generated-assets/images/02.jpg', 
    points: [0, 2], 
    opacity: 0.35, 
    blend: 'multiply', 
    token: 'cue-02c',
    animation: 'scan'
  },
  'one-1-5-4-sacrifice': { 
    src: '/generated-assets/images/03.jpg', 
    points: [2, 5], 
    opacity: 0.3, 
    blend: 'screen', 
    token: 'cue-03',
    animation: 'zoom'
  },
  'two-2-1-escape': { 
    src: '/generated-assets/images/03.jpg', 
    points: [1, 4], 
    opacity: 0.25, 
    blend: 'overlay', 
    token: 'cue-03b',
    animation: 'scan'
  },
  'two-2-2-osiris-launch': { 
    src: '/generated-assets/images/01.jpg', 
    points: [0, 3], 
    opacity: 0.2, 
    blend: 'screen', 
    token: 'cue-01c',
    animation: 'pulse'
  },
  'three-3-1-creation': { 
    src: '/generated-assets/images/04.jpg', 
    points: [3, 7], 
    opacity: 0.25, 
    blend: 'screen', 
    token: 'cue-04',
    animation: 'fade'
  },
  'three-3-1b-devil-song': { 
    src: '/generated-assets/images/04.jpg', 
    points: [0, 4], 
    opacity: 0.35, 
    blend: 'overlay', 
    token: 'cue-04b',
    animation: 'glitch'
  },
  'three-3-2-virus-design': { 
    src: '/generated-assets/images/04.jpg', 
    points: [2, 5], 
    opacity: 0.25, 
    blend: 'screen', 
    token: 'cue-04c',
    animation: 'warp'
  },
  'four-4-1-desert': { 
    src: '/generated-assets/images/02.jpg', 
    points: [0, 5], 
    opacity: 0.3, 
    blend: 'screen', 
    token: 'cue-02d',
    animation: 'fade'
  },
  'four-4-2-crowd-engineering': { 
    src: '/generated-assets/images/03.jpg', 
    points: [1, 3], 
    opacity: 0.35, 
    blend: 'overlay', 
    token: 'cue-03c',
    animation: 'glitch'
  },
  'four-5-1-tarek-message': { 
    src: '/generated-assets/images/05.jpg', 
    points: [2, 4], 
    opacity: 0.25, 
    blend: 'screen', 
    token: 'cue-05',
    animation: 'pulse'
  },
  'four-5-2-analyst-tears': { 
    src: '/generated-assets/images/05.jpg', 
    points: [1, 3], 
    opacity: 0.2, 
    blend: 'overlay', 
    token: 'cue-05b',
    animation: 'fade'
  },
  'five-6a-1-nicaea-debate': { 
    src: '/generated-assets/images/06.jpg', 
    points: [2, 5], 
    opacity: 0.25, 
    blend: 'screen', 
    token: 'cue-06',
    animation: 'fade'
  },
  'five-6b-1-constantine': { 
    src: '/generated-assets/images/06.jpg', 
    points: [1, 4], 
    opacity: 0.3, 
    blend: 'overlay', 
    token: 'cue-06b',
    animation: 'zoom'
  },
  'five-6c-1-laila-pain': { 
    src: '/generated-assets/images/05.jpg', 
    points: [0, 3], 
    opacity: 0.2, 
    blend: 'screen', 
    token: 'cue-05c',
    animation: 'fade'
  },
  'five-6c-2-tarek-second': { 
    src: '/generated-assets/images/06.jpg', 
    points: [1, 3], 
    opacity: 0.25, 
    blend: 'overlay', 
    token: 'cue-06c',
    animation: 'pulse'
  },
  'six-8-1-andalusia': { 
    src: '/generated-assets/images/04.jpg', 
    points: [0, 6], 
    opacity: 0.3, 
    blend: 'screen', 
    token: 'cue-04d',
    animation: 'fade'
  },
  'six-8-2-last-tears': { 
    src: '/generated-assets/images/04.jpg', 
    points: [2, 5], 
    opacity: 0.35, 
    blend: 'overlay', 
    token: 'cue-04e',
    animation: 'glitch'
  },
  'six-8b-1-berlin': { 
    src: '/generated-assets/images/07.jpg', 
    points: [1, 3], 
    opacity: 0.25, 
    blend: 'multiply', 
    token: 'cue-07',
    animation: 'scan'
  },
  'six-8c-1-death-signatures': { 
    src: '/generated-assets/images/07.jpg', 
    points: [0, 4], 
    opacity: 0.3, 
    blend: 'overlay', 
    token: 'cue-07b',
    animation: 'warp'
  },
  'six-8d-1-attack': { 
    src: '/generated-assets/images/07.jpg', 
    points: [0, 2], 
    opacity: 0.4, 
    blend: 'screen', 
    token: 'cue-07c',
    animation: 'glitch'
  },
  'six-8d-2-final-update': { 
    src: '/generated-assets/images/05.jpg', 
    points: [3, 6], 
    opacity: 0.25, 
    blend: 'overlay', 
    token: 'cue-05d',
    animation: 'pulse'
  },
  'transition-dream': { 
    src: '/generated-assets/images/01.jpg', 
    points: [1, 5], 
    opacity: 0.15, 
    blend: 'screen', 
    token: 'cue-01d',
    animation: 'fade'
  },
  'seven-10-1-karbala': { 
    src: '/generated-assets/images/05.jpg', 
    points: [0, 6], 
    opacity: 0.3, 
    blend: 'screen', 
    token: 'cue-05e',
    animation: 'zoom'
  },
  'seven-11-1-temptation': { 
    src: '/generated-assets/images/06.jpg', 
    points: [1, 3], 
    opacity: 0.25, 
    blend: 'overlay', 
    token: 'cue-06d',
    animation: 'fade'
  },
  'seven-11-2-decision': { 
    src: '/generated-assets/images/06.jpg', 
    points: [0, 2], 
    opacity: 0.2, 
    blend: 'screen', 
    token: 'cue-06e',
    animation: 'pulse'
  },
  'seven-11-3-yahya-death': { 
    src: '/generated-assets/images/05.jpg', 
    points: [2, 5], 
    opacity: 0.3, 
    blend: 'overlay', 
    token: 'cue-05f',
    animation: 'fade'
  },
  'seven-12-1-truth-leak': { 
    src: '/generated-assets/images/06.jpg', 
    points: [1, 4], 
    opacity: 0.35, 
    blend: 'screen', 
    token: 'cue-06f',
    animation: 'glitch'
  },
  'seven-13-1-awakening': { 
    src: '/generated-assets/images/01.jpg', 
    points: [0, 3], 
    opacity: 0.2, 
    blend: 'screen', 
    token: 'cue-01e',
    animation: 'fade'
  },
  'seven-13-2-closing': { 
    src: '/generated-assets/images/04.jpg', 
    points: [2, 6], 
    opacity: 0.25, 
    blend: 'overlay', 
    token: 'cue-04f',
    animation: 'zoom'
  },
};

// =============================================================================
// 3. CHARACTER EMOTION STATES (based on script analysis)
// Maps scene to character emotional state for visual effects
// =============================================================================
type CharacterEmotion = 'neutral' | 'fearful' | 'sad' | 'angry' | 'shocked' | 'dying' | 'determined' | 'ghost' | 'breakdown';
type CharacterEffect = 'pulse' | 'glitch' | 'flash' | 'ghost' | 'none';

interface CharacterState {
  emotion: CharacterEmotion;
  effect: CharacterEffect;
  filter?: string;
}

const SCENE_CHARACTER_STATES: Record<string, CharacterState> = {
  'zero-1-1-summons': { emotion: 'fearful', effect: 'pulse' },
  'zero-1-2-prosecution': { emotion: 'shocked', effect: 'glitch' },
  'one-1-5-1-promise': { emotion: 'neutral', effect: 'none' },
  'one-1-5-2-bitter-truth': { emotion: 'fearful', effect: 'pulse' },
  'one-1-5-3-no-escape': { emotion: 'fearful', effect: 'glitch' },
  'one-1-5-4-sacrifice': { emotion: 'sad', effect: 'ghost' },
  'two-2-1-escape': { emotion: 'fearful', effect: 'flash' },
  'two-2-2-osiris-launch': { emotion: 'determined', effect: 'pulse' },
  'three-3-1-creation': { emotion: 'shocked', effect: 'glitch' },
  'three-3-1b-devil-song': { emotion: 'fearful', effect: 'glitch' },
  'three-3-2-virus-design': { emotion: 'shocked', effect: 'glitch' },
  'four-4-1-desert': { emotion: 'neutral', effect: 'none' },
  'four-4-2-crowd-engineering': { emotion: 'angry', effect: 'pulse' },
  'four-5-1-tarek-message': { emotion: 'ghost', effect: 'ghost' },
  'four-5-2-analyst-tears': { emotion: 'breakdown', effect: 'pulse' },
  'five-6a-1-nicaea-debate': { emotion: 'neutral', effect: 'none' },
  'five-6b-1-constantine': { emotion: 'angry', effect: 'pulse' },
  'five-6c-1-laila-pain': { emotion: 'sad', effect: 'none' },
  'five-6c-2-tarek-second': { emotion: 'ghost', effect: 'ghost' },
  'six-8-1-andalusia': { emotion: 'sad', effect: 'none' },
  'six-8-2-last-tears': { emotion: 'sad', effect: 'pulse' },
  'six-8b-1-berlin': { emotion: 'fearful', effect: 'glitch' },
  'six-8c-1-death-signatures': { emotion: 'shocked', effect: 'flash' },
  'six-8d-1-attack': { emotion: 'angry', effect: 'glitch' },
  'six-8d-2-final-update': { emotion: 'shocked', effect: 'flash' },
  'transition-dream': { emotion: 'ghost', effect: 'ghost' },
  'seven-10-1-karbala': { emotion: 'sad', effect: 'none' },
  'seven-11-1-temptation': { emotion: 'angry', effect: 'pulse' },
  'seven-11-2-decision': { emotion: 'determined', effect: 'none' },
  'seven-11-3-yahya-death': { emotion: 'dying', effect: 'ghost' },
  'seven-12-1-truth-leak': { emotion: 'determined', effect: 'pulse' },
  'seven-13-1-awakening': { emotion: 'neutral', effect: 'none' },
  'seven-13-2-closing': { emotion: 'sad', effect: 'pulse' },
};

// Character emotion-based filter effects
const CHARACTER_FILTERS: Record<CharacterEmotion, string> = {
  neutral: 'none',
  fearful: 'brightness(0.9) contrast(1.1)',
  sad: 'saturate(0.7) brightness(0.85)',
  angry: 'brightness(1.1) contrast(1.2) saturate(1.2)',
  shocked: 'brightness(1.3) contrast(1.3)',
  dying: 'saturate(0.5) brightness(0.7) sepia(0.3)',
  determined: 'brightness(1.05) contrast(1.1)',
  ghost: 'saturate(0.3) brightness(1.2) opacity(0.7)',
  breakdown: 'saturate(0.6) brightness(0.8) blur(0.5px)',
};

const SCENE_CHARACTER_TIMELINE: Record<string, string> = {
  'zero-1-1-summons': 'Narrator', 'zero-1-2-prosecution': 'Narrator',
  'one-1-5-1-promise': 'tarek', 'one-1-5-2-bitter-truth': 'tarek',
  'one-1-5-3-no-escape': 'tarek', 'one-1-5-4-sacrifice': 'tarek',
  'two-2-1-escape': 'yahya', 'two-2-2-osiris-launch': 'yahya',
  'three-3-1-creation': 'yahya', 'three-3-1b-devil-song': 'Narrator',
  'three-3-2-virus-design': 'first_engineer',
  'four-4-1-desert': 'samiri', 'four-4-2-crowd-engineering': 'samiri_calf',
  'four-5-1-tarek-message': 'tarek_ghost', 'four-5-2-analyst-tears': 'yahya_breakdown',
  'five-6a-1-nicaea-debate': 'arius', 'five-6b-1-constantine': 'constantine',
  'five-6c-1-laila-pain': 'laila_faith', 'five-6c-2-tarek-second': 'tarek_dream',
  'six-8-1-andalusia': 'Narrator', 'six-8-2-last-tears': 'Narrator',
  'six-8b-1-berlin': 'Narrator', 'six-8c-1-death-signatures': 'Narrator',
  'six-8d-1-attack': 'yahya_confront', 'six-8d-2-final-update': 'first_engineer_exposed',
  'transition-dream': 'tarek_dream',
  'seven-10-1-karbala': 'Narrator', 'seven-11-1-temptation': 'first_engineer',
  'seven-11-2-decision': 'constantine', 'seven-11-3-yahya-death': 'yahya_dying',
  'seven-12-1-truth-leak': 'laila_witness', 'seven-13-1-awakening': 'yahya',
  'seven-13-2-closing': 'Narrator',
};

const CHARACTER_MAP: Record<string, { name: string; arabicName: string; color: string; position: 'left' | 'right'; imageUrl?: string }> = {
  yahya: { name: 'Yahya', arabicName: 'يحيى', color: '#78e6ff', position: 'left', imageUrl: ASSET_URLS.characters.yahya },
  laila: { name: 'Laila', arabicName: 'ليلى', color: '#ffb2e6', position: 'right', imageUrl: ASSET_URLS.characters.laila_witness },
  samiri: { name: 'Al-Samiri', arabicName: 'السامري', color: '#d4af37', position: 'right', imageUrl: ASSET_URLS.characters.samiri },
  Narrator: { name: 'Narrator', arabicName: 'الراوي', color: '#c9a96e', position: 'left' },
  tarek: { name: 'Tarek', arabicName: 'طارق', color: '#a78bfa', position: 'left', imageUrl: ASSET_URLS.characters.tarek },
  first_engineer: { name: 'The Engineer', arabicName: 'المهندس', color: '#f87171', position: 'right', imageUrl: ASSET_URLS.characters.first_engineer },
  tarek_ghost: { name: 'Tarek (Ghost)', arabicName: 'طارق (الشبح)', color: '#a78bfa', position: 'left', imageUrl: ASSET_URLS.characters.tarek_ghost },
  samiri_calf: { name: 'Al-Samiri', arabicName: 'السامري', color: '#d4af37', position: 'right', imageUrl: ASSET_URLS.characters.samiri_calf },
  yahya_breakdown: { name: 'Yahya', arabicName: 'يحيى', color: '#78e6ff', position: 'left', imageUrl: ASSET_URLS.characters.yahya_breakdown },
  arius: { name: 'Arius', arabicName: 'آريوس', color: '#fbbf24', position: 'left', imageUrl: ASSET_URLS.characters.arius },
  athanasius: { name: 'Athanasius', arabicName: 'أثناسيوس', color: '#34d399', position: 'right', imageUrl: ASSET_URLS.characters.athanasius },
  constantine: { name: 'Constantine', arabicName: 'قسطنطين', color: '#f59e0b', position: 'right', imageUrl: ASSET_URLS.characters.constantine },
  laila_faith: { name: 'Laila', arabicName: 'ليلى', color: '#ffb2e6', position: 'right', imageUrl: ASSET_URLS.characters.laila_faith },
  tarek_dream: { name: 'Tarek (Dream)', arabicName: 'طارق (الحلم)', color: '#a78bfa', position: 'left', imageUrl: ASSET_URLS.characters.tarek_dream },
  yahya_confront: { name: 'Yahya', arabicName: 'يحيى', color: '#78e6ff', position: 'left', imageUrl: ASSET_URLS.characters.yahya_confront },
  first_engineer_exposed: { name: 'The Engineer', arabicName: 'المهندس', color: '#f87171', position: 'right', imageUrl: ASSET_URLS.characters.first_engineer_exposed },
  yahya_dying: { name: 'Yahya', arabicName: 'يحيى', color: '#78e6ff', position: 'left', imageUrl: ASSET_URLS.characters.yahya_dying },
  laila_witness: { name: 'Laila', arabicName: 'ليلى', color: '#ffb2e6', position: 'right', imageUrl: ASSET_URLS.characters.laila_witness },
  first_engineer_2: { name: 'The Engineer', arabicName: 'المهندس', color: '#f87171', position: 'right', imageUrl: ASSET_URLS.characters.first_engineer_2 },
  first_engineer_confront: { name: 'The Engineer', arabicName: 'المهندس', color: '#f87171', position: 'right', imageUrl: ASSET_URLS.characters.first_engineer_confront },
};

// =============================================================================
// 4. MUSIC BG OVERLAY PER SCENE
// Scene-specific music tracks for immersive experience
// =============================================================================
interface MusicTrack {
  primary: string;
  secondary?: string[];
  volume?: number;
  fadeDuration?: number;
}

// =============================================================================
// 4. MUSIC TRACKS PER SCENE
// Based on OSIRIS_ASSET_PROMPTS.md
// BG music TRACK-01.mp3 plays underneath ALL scenes as constant layer
// =============================================================================
const SCENE_MUSIC_TRACKS: Record<string, MusicTrack> = {
  // Part Zero - Cosmic Courtroom
  'zero-1-1-summons': { 
    primary: '/generated-assets/music-tracks/TRACK 02.m4a',
    volume: 0.25,
    fadeDuration: 2000
  },
  'zero-1-2-prosecution': { 
    primary: '/generated-assets/music-tracks/TRACK 02.m4a',
    volume: 0.30,
    fadeDuration: 3000
  },
  
  // Part One - Tariq's Story
  'one-1-5-1-promise': { 
    primary: '/generated-assets/music-tracks/TRACK-04.m4a',
    volume: 0.35,
    fadeDuration: 2000
  },
  'one-1-5-2-bitter-truth': { 
    primary: '/generated-assets/music-tracks/TRACK-04.m4a',
    volume: 0.35,
    fadeDuration: 2000
  },
  'one-1-5-3-no-escape': { 
    primary: '/generated-assets/music-tracks/TRACK 02.m4a',
    volume: 0.35,
    fadeDuration: 1500
  },
  'one-1-5-4-sacrifice': { 
    primary: '/generated-assets/music-tracks/TRACK-04.m4a',
    volume: 0.45,
    fadeDuration: 3000
  },
  
  // Part Two - Escape
  'two-2-1-escape': { 
    primary: '/generated-assets/music-tracks/TRACK-12.m4a',
    volume: 0.40,
    fadeDuration: 1500
  },
  'two-2-2-osiris-launch': { 
    primary: '/generated-assets/music-tracks/TRACK 02.m4a',
    volume: 0.30,
    fadeDuration: 2000
  },
  
  // Part Three - Cosmic/Algorithm
  'three-3-1-creation': { 
    primary: '/generated-assets/music-tracks/TRACK 02.m4a',
    volume: 0.35,
    fadeDuration: 3000
  },
  'three-3-1b-devil-song': { 
    primary: '/generated-assets/music-tracks/TRACK 03.mp3',
    volume: 0.40,
    fadeDuration: 2000
  },
  'three-3-2-virus-design': { 
    primary: '/generated-assets/music-tracks/TRACK 03.mp3',
    volume: 0.40,
    fadeDuration: 2000
  },
  
  // Part Four - Pharaoh/Golden Calf
  'four-4-1-desert': { 
    primary: '/generated-assets/music-tracks/TRACK-05.m4a',
    volume: 0.40,
    fadeDuration: 2000
  },
  'four-4-2-crowd-engineering': { 
    primary: '/generated-assets/music-tracks/TRACK-05.m4a',
    volume: 0.45,
    fadeDuration: 1500
  },
  'four-5-1-tarek-message': { 
    primary: '/generated-assets/music-tracks/TRACK-04.m4a',
    volume: 0.30,
    fadeDuration: 2000
  },
  'four-5-2-analyst-tears': { 
    primary: '/generated-assets/music-tracks/TRACK-04.m4a',
    volume: 0.25,
    fadeDuration: 2000
  },
  
  // Part Five - Nicaea
  'five-6a-1-nicaea-debate': { 
    primary: '/generated-assets/music-tracks/TRACK-06.m4a',
    volume: 0.35,
    fadeDuration: 2000
  },
  'five-6b-1-constantine': { 
    primary: '/generated-assets/music-tracks/TRACK-06.m4a',
    volume: 0.40,
    fadeDuration: 2500
  },
  'five-6c-1-laila-pain': { 
    primary: '/generated-assets/music-tracks/TRACK-06.m4a',
    volume: 0.30,
    fadeDuration: 2000
  },
  'five-6c-2-tarek-second': { 
    primary: '/generated-assets/music-tracks/TRACK-06.m4a',
    volume: 0.30,
    fadeDuration: 2000
  },
  
  // Part Six - Andalusia/20th Century
  'six-8-1-andalusia': { 
    primary: '/generated-assets/music-tracks/TRACK-07.m4a',
    volume: 0.40,
    fadeDuration: 2000
  },
  'six-8-2-last-tears': { 
    primary: '/generated-assets/music-tracks/TRACK-07.m4a',
    volume: 0.45,
    fadeDuration: 3000
  },
  'six-8b-1-berlin': { 
    primary: '/generated-assets/music-tracks/TRACK-08.m4a',
    volume: 0.35,
    fadeDuration: 2000
  },
  'six-8c-1-death-signatures': { 
    primary: '/generated-assets/music-tracks/TRACK-08.m4a',
    volume: 0.40,
    fadeDuration: 2000
  },
  'six-8d-1-attack': { 
    primary: '/generated-assets/music-tracks/TRACK-08.m4a',
    volume: 0.50,
    fadeDuration: 1000
  },
  'six-8d-2-final-update': { 
    primary: '/generated-assets/music-tracks/TRACK-12.m4a',
    volume: 0.40,
    fadeDuration: 2000
  },
  
  // Transition - Dream
  'transition-dream': { 
    primary: '/generated-assets/music-tracks/TRACK-13.m4a',
    volume: 0.35,
    fadeDuration: 3000
  },
  
  // Part Seven - Karbala/Resolution
  'seven-10-1-karbala': { 
    primary: '/generated-assets/music-tracks/TRACK-09.m4a',
    volume: 0.50,
    fadeDuration: 3000
  },
  'seven-11-1-temptation': { 
    primary: '/generated-assets/music-tracks/TRACK-10.m4a',
    volume: 0.35,
    fadeDuration: 2000
  },
  'seven-11-2-decision': { 
    primary: '/generated-assets/music-tracks/TRACK-10.m4a',
    volume: 0.45,
    fadeDuration: 2000
  },
  'seven-11-3-yahya-death': { 
    primary: '/generated-assets/music-tracks/TRACK-09.m4a',
    volume: 0.40,
    fadeDuration: 3000
  },
  'seven-12-1-truth-leak': { 
    primary: '/generated-assets/music-tracks/TRACK-10.m4a',
    volume: 0.45,
    fadeDuration: 2000
  },
  'seven-13-1-awakening': { 
    primary: '/generated-assets/music-tracks/TRACK-11.m4a',
    volume: 0.35,
    fadeDuration: 2000
  },
  'seven-13-2-closing': { 
    primary: '/generated-assets/music-tracks/TRACK-14.m4a',
    volume: 0.40,
    fadeDuration: 4000
  },
};

type AutoSpeed = 'veryslow' | 'slow' | 'standard';

const AUTO_SPEED_MS: Record<AutoSpeed, number> = {
  veryslow: 80,
  slow: 50,
  standard: 30,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MainPlayer({ initialSceneId = 'zero-1-1-summons' }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);

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
  const [autoMode, setAutoMode] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState<AutoSpeed>('standard');
  const [autoProgress, setAutoProgress] = useState(0);
  const [voiceSyncLock, setVoiceSyncLock] = useState(false);
  const [activeVoiceNumber, setActiveVoiceNumber] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumePanel, setShowVolumePanel] = useState(false);
  const [bgVolume, setBgVolume] = useState(0.15);
  const [sceneVolume, setSceneVolume] = useState(0.25);
  const [voiceVolume, setVoiceVolume] = useState(0.85);
  const [currentMusicTrack, setCurrentMusicTrack] = useState<string | null>(null);
  const [sceneTrack, setSceneTrack] = useState<string | null>(null);
  const [voiceTrack, setVoiceTrack] = useState<string | null>(null);
  const [musicFadeProgress, setMusicFadeProgress] = useState(1);
  const [osirisEffectId, setOsirisEffectId] = useState<OsirisEffectId | null>(null);
  const [characterEffectActive, setCharacterEffectActive] = useState(false);
  const [controlsLocked, setControlsLocked] = useState(false);
  const [novelPaused, setNovelPaused] = useState(false);
  
  // BG Music is now managed by GlobalMediaLayer; avoid hardcoded TRACK-01 as a local background track
  const BG_MUSIC_TRACK = '';
  const [bgMusicTrack, setBgMusicTrack] = useState<string>(BG_MUSIC_TRACK);

  const [, setLocation] = useLocation();
  const { state: mediaState, play: globalPlay, pause: globalPause } = useMediaController();

  const currentScene = ALL_SCENES[currentSceneId];
  const dialogueLines = useMemo(() => currentScene?.dialogue || [], [currentScene]);
  const currentDialogue = dialogueLines[dialogueIndex];
  const isArabic = mediaState.uiLang === 'ar';

  // Refs for stable access inside callbacks (must be after dialogueLines/currentDialogue/currentScene)
  const autoModeRef = useRef(autoMode);
  const voiceSyncLockRef = useRef(voiceSyncLock);
  const isTypingRef = useRef(isTyping);
  const isDialogueCompleteRef = useRef(isDialogueComplete);
  const showChoicesRef = useRef(showChoices);
  const sceneTransitioningRef = useRef(sceneTransitioning);
  const dialogueLinesRef = useRef(dialogueLines);
  const currentDialogueRef = useRef(currentDialogue);
  const currentSceneRef = useRef(currentScene);
  const dialogueIndexRef = useRef(dialogueIndex);
  const audioEnabledRef = useRef(audioEnabled);
  const currentMusicTrackRef = useRef<string | null>(null);
  const isMutedRef = useRef(isMuted);
  const controlsLockedRef = useRef(controlsLocked);
  const novelPausedRef = useRef(novelPaused);

  useEffect(() => { autoModeRef.current = autoMode; }, [autoMode]);
  useEffect(() => { voiceSyncLockRef.current = voiceSyncLock; }, [voiceSyncLock]);
  useEffect(() => { isTypingRef.current = isTyping; }, [isTyping]);
  useEffect(() => { isDialogueCompleteRef.current = isDialogueComplete; }, [isDialogueComplete]);
  useEffect(() => { showChoicesRef.current = showChoices; }, [showChoices]);
  useEffect(() => { sceneTransitioningRef.current = sceneTransitioning; }, [sceneTransitioning]);
  useEffect(() => { dialogueLinesRef.current = dialogueLines; }, [dialogueLines]);
  useEffect(() => { currentDialogueRef.current = currentDialogue; }, [currentDialogue]);
  useEffect(() => { currentSceneRef.current = currentScene; }, [currentScene]);
  useEffect(() => { dialogueIndexRef.current = dialogueIndex; }, [dialogueIndex]);
  useEffect(() => { audioEnabledRef.current = audioEnabled; }, [audioEnabled]);
  useEffect(() => { currentMusicTrackRef.current = currentMusicTrack; }, [currentMusicTrack]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { controlsLockedRef.current = controlsLocked; }, [controlsLocked]);
  useEffect(() => { novelPausedRef.current = novelPaused; }, [novelPaused]);
  
  // Sync controlsLocked with voiceSyncLock AND novelPaused
  useEffect(() => {
    setControlsLocked(voiceSyncLock || novelPaused);
  }, [voiceSyncLock, novelPaused]);

  const resolveAsset = useCallback((key: string | undefined): string => {
    if (!key) return '';
    return key.includes('://') || key.startsWith('/') ? key : (getAssetOverride(key) || '');
  }, []);

  const normalize = useCallback((url: string): string => {
    try { return new URL(url, window.location.href).href; }
    catch { return url; }
  }, []);

  // =============================================================================
  // MUSIC BG OVERLAY - Scene-specific music with crossfade
  // Triggers on scene load/entry, not just on change
  // Sets scene track for GlobalMediaLayer
  // =============================================================================
  useEffect(() => {
    const sceneMusic = SCENE_MUSIC_TRACKS[currentSceneId];
    if (!sceneMusic) {
      setSceneTrack(null);
      return;
    }
    
    const newTrack = normalize(sceneMusic.primary);
    
    // Always update track on scene change (including first load)
    console.log(`🎵 Scene track for ${currentSceneId}: ${newTrack}`);
    setSceneTrack(newTrack);
    setCurrentMusicTrack(newTrack);
    
    // Ensure music plays when audio is enabled
    if (audioEnabledRef.current) {
      console.log('🎵 Starting music playback for scene');
      globalPlay();
    }
  }, [currentSceneId, normalize, globalPlay]);

  // Ensure music starts when audio is enabled (handles initial enable)
  useEffect(() => {
    if (audioEnabled && !mediaState.isPlaying) {
      console.log('🎵 Audio enabled, starting music playback');
      globalPlay();
    }
  }, [audioEnabled]);

  // =============================================================================
  // OSIRIS EFFECT DETECTION - Auto-detect based on scene content
  // =============================================================================
  useEffect(() => {
    const detectedEffect = detectOsirisEffectId({
      sceneId: currentSceneId,
      sceneTitle: currentScene?.title,
      sceneArabicTitle: currentScene?.arabicTitle,
      visualEffect: currentScene?.visualEffect,
      text: currentDialogue?.text,
      arabicText: currentDialogue?.arabicText,
    });
    setOsirisEffectId(detectedEffect);
  }, [currentSceneId, currentScene, currentDialogue]);

  // =============================================================================
  // CHARACTER EFFECT TRIGGER - Based on character emotion state
  // =============================================================================
  useEffect(() => {
    const charState = SCENE_CHARACTER_STATES[currentSceneId];
    if (charState?.effect && charState.effect !== 'none') {
      setCharacterEffectActive(true);
      const timer = setTimeout(() => setCharacterEffectActive(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setCharacterEffectActive(false);
    }
  }, [currentSceneId, dialogueIndex]);

  // Default main theme as fallback
  const primaryAudioSources = useMemo(() => {
    return currentMusicTrack ? [currentMusicTrack] : [normalize(ASSET_URLS.audio.main_theme)];
  }, [currentMusicTrack, normalize]);
  
  const stageFx = useMemo(() => ({ flash: 0, shake: 0, uiPulse: 0 }), []);

  // =============================================================================
  // VOICE SYNC WITH TIMING - Proper sync based on dialogue duration
  // Voice plays after dialogue finishes typing + dialogueStartMs offset
  // Uses GlobalMediaLayer's voice audio for layered audio
  // =============================================================================
  const lastVoiceCueRef = useRef<string | null>(null);
  const dialogueStartTimeRef = useRef<number>(0); // Track when current dialogue started displaying
  
  // Track when dialogue index changes (dialogue just started displaying)
  useEffect(() => {
    dialogueStartTimeRef.current = Date.now();
  }, [dialogueIndex]);
  
  // Voice playback handler
  const handleVoiceEnded = useCallback(() => {
    setVoiceSyncLock(false);
    setActiveVoiceNumber(null);
    setVoiceTrack(null);
    if (autoModeRef.current) {
      setDialogueIndex(d => {
        const next = d + 1;
        const lines = dialogueLinesRef.current;
        if (next < lines.length) {
          setIsDialogueComplete(false);
          setAutoProgress(0);
          return next;
        }
        const scene = currentSceneRef.current;
        if (scene?.choices?.length) setShowChoices(true);
        else if (scene?.defaultNextScene) {
          goToScene(scene.defaultNextScene);
        }
        return d;
      });
    }
  }, []);
  
  useEffect(() => {
    if (!audioEnabled || !currentSceneId) return;
    
    const cues = SCENE_VOICE_CUES[currentSceneId];
    const match = cues?.find(c => c.at === dialogueIndex);
    
    // Create a unique key for this cue to avoid re-triggering
    const cueKey = match ? `${currentSceneId}-${dialogueIndex}-${match.voice}` : null;
    
      if (match && cueKey !== lastVoiceCueRef.current) {
      lastVoiceCueRef.current = cueKey;
      
      // Calculate typing duration based on text length
      // Arabic text: ~50ms per character, English: ~30ms per character
      const text = currentDialogue?.text || '';
      const textLength = text.length;
      const isArabic = /[\u0600-\u06FF]/.test(text);
      const typingSpeedMs = isArabic ? 50 : 30;
      const typingDuration = textLength * typingSpeedMs;
      
      // Minimum display time before voice (give user time to read)
      const minDisplayTime = 1500;
      
      // Voice timing: after typing finishes + dialogueStartMs offset
      const delayAfterTyping = match.dialogueStartMs || 0;
      const totalDelay = Math.max(minDisplayTime, typingDuration) + delayAfterTyping;
      
      console.log(`🎙️ Voice cue detected: ${match.voice} at dialogue ${dialogueIndex}`);
      console.log(`   Text length: ${textLength} chars, Typing: ${typingDuration}ms, Delay: ${totalDelay}ms`);
      
      // Set up delayed voice playback
      const delayTimer = setTimeout(() => {
        const vNum = match.voice;
        setActiveVoiceNumber(vNum);
        if (match.lock) setVoiceSyncLock(true);

        const voiceUrl = `/generated-assets/voices/VOICE-${vNum.toString().padStart(2, '0')}.wav`;
        
        console.log(`🎙️ Setting voice track: ${voiceUrl}`);
        setVoiceTrack(voiceUrl);
        
        // Start playback if not already playing
        if (!mediaState.isPlaying) {
          globalPlay();
        }
        // Freeze the timeline while voice is about to start
        setNovelPaused(true);
      }, totalDelay);
       
      return () => clearTimeout(delayTimer);
    } else if (!match) {
      lastVoiceCueRef.current = null;
      setActiveVoiceNumber(null);
      setVoiceSyncLock(false);
    }
  }, [dialogueIndex, currentSceneId, audioEnabled, currentDialogue, mediaState.isPlaying, globalPlay]);

  // Voice ended should unfreeze the timeline
  useEffect(() => {
    // If there is no active voice track, ensure novel isn't paused by voice
    if (!voiceTrack) {
      // Do not interfere with user-initiated pauses
      if (!novelPaused) return;
      // If voice ended, unpause automatically
      setNovelPaused(false);
    }
  }, [voiceTrack]);

  // =============================================================================
  // IMAGE OVERLAY WITH CINEMATIC ANIMATIONS
  // =============================================================================
  const activeImageCue = useMemo(() => {
    const cue = SCENE_IMAGE_CUES[currentSceneId];
    if (cue && cue.points.includes(dialogueIndex)) return cue;
    return null;
  }, [currentSceneId, dialogueIndex]);

  // Get character filter based on emotion state
  const characterFilter = useMemo(() => {
    const charState = SCENE_CHARACTER_STATES[currentSceneId];
    if (charState?.emotion) {
      return CHARACTER_FILTERS[charState.emotion] || 'none';
    }
    return 'none';
  }, [currentSceneId]);

  // Character effect animation
  const characterEffectAnimation = useMemo(() => {
    const charState = SCENE_CHARACTER_STATES[currentSceneId];
    if (!charState?.effect || charState.effect === 'none') return {};
    
    switch (charState.effect) {
      case 'pulse':
        return { opacity: [0.7, 1, 0.7], scale: [0.98, 1.02, 0.98] };
      case 'glitch':
        return { x: [0, -3, 3, -2, 2, 0], opacity: [1, 0.8, 1] };
      case 'flash':
        return { opacity: [1, 0.5, 1], scale: [1, 1.05, 1] };
      case 'ghost':
        return { opacity: [0.5, 0.8, 0.5], scale: [0.98, 1.01, 0.98] };
      default:
        return {};
    }
  }, [currentSceneId]);

  const handleAdvance = useCallback(() => {
    if (!audioEnabledRef.current) { setAudioEnabled(true); setShowAudioPrompt(false); globalPlay(); return; }
    // Block if paused OR voice is playing
    if (showChoicesRef.current || sceneTransitioningRef.current || voiceSyncLockRef.current || novelPausedRef.current) return;
    if (isTypingRef.current) { setIsTyping(false); setDisplayedText(currentDialogueRef.current?.text || ''); setDisplayedArabic(currentDialogueRef.current?.arabicText || ''); setIsDialogueComplete(true); return; }
    if (isDialogueCompleteRef.current) {
      const d = dialogueIndexRef.current;
      const lines = dialogueLinesRef.current;
      const scene = currentSceneRef.current;
      if (d < lines.length - 1) {
        setDialogueIndex(d + 1);
        setIsDialogueComplete(false);
        setAutoProgress(0);
      }
      else if (scene?.choices?.length) setShowChoices(true);
      else if (scene?.defaultNextScene) goToScene(scene.defaultNextScene);
    }
  }, [globalPlay]);

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Block if paused OR voice is playing
    if (dialogueIndexRef.current > 0 && !voiceSyncLockRef.current && !novelPausedRef.current) {
      setDialogueIndex(d => d - 1);
      setIsDialogueComplete(true);
      setIsTyping(false);
      setAutoProgress(0);
      setActiveVoiceNumber(null);
    }
  }, []);

  // Play/Stop freezes entire novel - no advance/back possible when paused
  const handlePlayPause = useCallback(() => {
    if (!audioEnabledRef.current) { setAudioEnabled(true); setShowAudioPrompt(false); globalPlay(); setNovelPaused(false); return; }
    if (novelPausedRef.current) {
      // Resume - continue from where we stopped
      setNovelPaused(false);
      globalPlay();
    } else {
      // Pause - freeze everything
      setNovelPaused(true);
      globalPause();
    }
  }, [globalPlay, globalPause]);

  // Auto-advance timer - stops when paused
  useEffect(() => {
    if (!autoMode || !isDialogueComplete || showChoices || sceneTransitioning || voiceSyncLock || novelPaused) {
      setAutoProgress(0);
      return;
    }
    const charLen = currentDialogue?.text?.length || 0;
    const msPerChar = AUTO_SPEED_MS[autoSpeed];
    const duration = Math.max(3500, charLen * msPerChar);
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setAutoProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Inline advance to avoid stale closure
          setDialogueIndex(d => {
            const lines = dialogueLinesRef.current;
            const scene = currentSceneRef.current;
            if (d < lines.length - 1) {
              setIsDialogueComplete(false);
              setAutoProgress(0);
              return d + 1;
            }
            if (scene?.choices?.length) setShowChoices(true);
            else if (scene?.defaultNextScene) goToScene(scene.defaultNextScene);
            return d;
          });
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoMode, isDialogueComplete, dialogueIndex, showChoices, sceneTransitioning, voiceSyncLock, novelPaused, autoSpeed, currentDialogue?.text?.length]);

  // Typewriter - pauses when novel is paused
  useEffect(() => {
    if (!currentDialogue || showChoices || novelPaused) return;
    let i = 0; setIsTyping(true); setIsDialogueComplete(false);
    const text = currentDialogue.text || ''; const arabic = currentDialogue.arabicText || '';
    const interval = setInterval(() => {
      i++; setDisplayedText(text.slice(0, i)); setDisplayedArabic(arabic.slice(0, i));
      if (i >= Math.max(text.length, arabic.length)) { clearInterval(interval); setIsTyping(false); setIsDialogueComplete(true); }
    }, 35);
    return () => clearInterval(interval);
  }, [currentDialogue, showChoices, novelPaused]);

  const goToScene = useCallback((id: string) => {
    setSceneTransitioning(true);
    setTimeout(() => { setCurrentSceneId(id); setDialogueIndex(0); setShowChoices(false); setSceneTransitioning(false); setAutoProgress(0); }, 1200);
  }, []);

  const handleChoice = useCallback((c: { nextSceneId?: string }) => {
    if (c.nextSceneId) goToScene(c.nextSceneId);
  }, [goToScene]);
  const enableAudio = () => { setAudioEnabled(true); setShowAudioPrompt(false); globalPlay(); };

  const charKey = currentDialogue?.character as keyof typeof CHARACTER_MAP || 'Narrator';
  const char = CHARACTER_MAP[charKey] || CHARACTER_MAP.Narrator;
  const part = currentScene?.part || 0;
  const textProgress = currentDialogue ? (Math.max(displayedText.length, displayedArabic.length) / Math.max(currentDialogue.text?.length || 1, currentDialogue.arabicText?.length || 1)) * 100 : 0;

  // Focus handling: pause on blur to avoid drift when tab is hidden
  useEffect(() => {
    const onBlur = () => setNovelPaused(true);
    const onFocus = () => { /* no auto-resume; user controls resume */ };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <motion.div className="relative w-screen h-screen overflow-hidden bg-black font-novel select-none" onClick={handleAdvance}>

      {/* BACKDROP */}
      <CinematicStage
        scene={currentScene} sceneId={currentSceneId}
        bgImageSrc={resolveAsset(currentScene?.backgroundImage)}
        bgVideoSrc={resolveAsset(currentScene?.backgroundVideo)}
        allowVideo={true} bgLoaded={bgLoaded} setBgLoaded={setBgLoaded} videoReady={videoReady} setVideoReady={setVideoReady}
        overlay="rgba(0,0,0,0.4)" mediaFilter="none" videoRef={videoRef} fx={stageFx}
      />
      
      {/* OSIRIS AI EFFECT LAYER - Now syncs with scene content */}
      <OsirisEffectLayer effectId={osirisEffectId} allowVideo={true} />
      
      {/* MUSIC FADE OVERLAY */}
      <motion.div 
        className="absolute inset-0 z-[6] pointer-events-none bg-black"
        animate={{ opacity: 1 - musicFadeProgress }}
        transition={{ duration: 0.3 }}
        style={{ opacity: 1 - musicFadeProgress }}
      />
      
      <GlobalMediaLayer 
        primaryAudioSources={[BG_MUSIC_TRACK]} 
        sceneTrack={sceneTrack}
        voiceTrack={voiceTrack}
        onVoiceEnded={handleVoiceEnded}
        isMuted={isMuted}
        bgVolume={bgVolume}
        sceneVolume={sceneVolume}
        voiceVolume={voiceVolume}
        isPaused={novelPaused}
        onMuteChange={(muted) => setIsMuted(muted)}
        onBgVolumeChange={(v) => setBgVolume(v)}
        onSceneVolumeChange={(v) => setSceneVolume(v)}
        onVoiceVolumeChange={(v) => setVoiceVolume(v)}
      />

      {/* IMAGE CUE OVERLAY WITH CINEMATIC ANIMATIONS */}
      <AnimatePresence>
        {activeImageCue && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: activeImageCue.opacity || 0.4,
              scale: activeImageCue.animation === 'zoom' ? [1, 1.05, 1] : 1,
              x: activeImageCue.animation === 'glitch' ? [0, -5, 5, -3, 3, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: activeImageCue.animation === 'zoom' ? 3 : 0.8, repeat: Infinity },
              x: { duration: 0.5, ease: 'easeInOut' },
            }}
          >
            <img
              src={activeImageCue.src} 
              className="w-full h-full object-cover grayscale"
              style={{ mixBlendMode: (activeImageCue.blend as any) || 'screen' }}
            />
            {/* Overlay glow for cinematic effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: activeImageCue.animation === 'scan' 
                  ? 'repeating-linear-gradient(to bottom, transparent 0px, rgba(201,169,110,0.03) 1px, transparent 3px)'
                  : 'none',
                animation: activeImageCue.animation === 'scan' ? 'scanline 4s linear infinite' : 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAV */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button onClick={(e) => { e.stopPropagation(); setLocation('/'); }} className="group flex items-center gap-3 pointer-events-auto">
          <img src={osirisLogo} className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:rotate-12" />
          <div className="hidden sm:block text-left">
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/40">{isArabic ? 'خروج' : 'EXIT'}</div>
            <div className="text-sm font-bold text-amber-500/80 tracking-widest uppercase italic">Osiris</div>
          </div>
        </button>
        <div className="hidden md:block">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">{isArabic ? PART_LABELS[part]?.ar : PART_LABELS[part]?.en}</div>
          <div className="text-xs text-white/70 font-medium tracking-wider uppercase italic">{isArabic ? currentScene?.arabicTitle : currentScene?.title}</div>
        </div>
      </div>

      {/* START PROMPT */}
      <AnimatePresence>
        {showAudioPrompt && (
          <motion.div className="absolute inset-0 z-[100] bg-black/98 flex items-center justify-center pointer-events-auto" exit={{ opacity: 0, scale: 1.1 }}>
            <div className="text-center" onClick={e => e.stopPropagation()}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="w-32 h-32 mx-auto mb-8 border border-amber-500/10 rounded-full flex items-center justify-center">
                <img src={osirisLogo} className="w-16 h-16 opacity-60" />
              </motion.div>
              <h2 className="text-5xl text-amber-500 mb-2 tracking-[0.6em] font-thin uppercase italic">Osiris</h2>
              <p className="text-white/20 text-[9px] tracking-[0.4em] mb-12 uppercase">{isArabic ? 'تهيئة الذاكرة الكونية' : 'Initializing Cosmic Memory'}</p>
              <button
                onClick={enableAudio}
                className="group relative px-20 py-6 bg-transparent border border-amber-600/30 text-amber-500 font-light rounded-sm tracking-[0.4em] overflow-hidden hover:text-black transition-colors"
              >
                <div className="absolute inset-0 bg-amber-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <span className="relative z-10 italic">SYNC ARCHIVE</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIALOGUE INTERFACE — ALL CONTROLS INSIDE THE BOX */}
      <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-end p-4 sm:p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-5xl mx-auto relative pointer-events-none">

          {/* PORTRAIT WITH EMOTION EFFECTS */}
          <AnimatePresence>
            {!showChoices && currentDialogue && char.imageUrl && (
              <motion.div
                key={charKey} 
                initial={{ opacity: 0, x: char.position === 'left' ? -30 : 30 }}
                animate={{
                  opacity: 1, 
                  x: 0,
                  ...characterEffectAnimation,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  x: { duration: 0.6, ease: 'easeOut' },
                }}
                className={`absolute bottom-[105%] ${char.position === 'left' ? 'left-4 sm:left-8' : 'right-4 sm:right-8'} z-10 hidden sm:block`}
              >
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                  <img 
                    src={char.imageUrl} 
                    alt={char.name} 
                    className="w-full h-full object-cover grayscale brightness-90"
                    style={{ 
                      filter: characterFilter !== 'none' ? characterFilter : 'none',
                      transition: 'filter 0.5s ease',
                    }}
                  />
                  {/* Character emotion glow effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{
                      boxShadow: characterEffectActive 
                        ? `inset 0 0 30px ${char.color}40, 0 0 60px ${char.color}20`
                        : 'none',
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DIALOGUE PANEL WITH ALL CONTROLS */}
          <AnimatePresence mode="wait">
            {!showChoices && currentDialogue && (
              <motion.div
                key={currentSceneId + dialogueIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-auto"
              >
                <div className="bg-black/90 backdrop-blur-3xl rounded-[32px] sm:rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden" dir={isArabic ? 'rtl' : 'ltr'}>

                  {/* PAUSED BANNER - Shows when novel is paused */}
                  <AnimatePresence>
                    {novelPaused && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 border-b border-red-500/20 overflow-hidden"
                      >
                        <div className="px-6 sm:px-10 md:px-12 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"
                            />
                            <span className="text-red-300 text-xs sm:text-sm tracking-[0.3em] font-bold uppercase">
                              {isArabic ? '⏸️ متوقف مؤقتاً — اضغط تشغيل للمتابعة' : '⏸️ PAUSED — PRESS PLAY TO CONTINUE'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-400/60" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* VOICE PLAYING BANNER - PROMINENT INDICATOR */}
                  <AnimatePresence>
                    {voiceSyncLock && activeVoiceNumber && !novelPaused && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-r from-amber-900/40 via-amber-700/30 to-amber-900/40 border-b border-amber-500/20 overflow-hidden"
                      >
                        <div className="px-6 sm:px-10 md:px-12 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"
                            />
                            <span className="text-amber-300 text-xs sm:text-sm tracking-[0.3em] font-bold uppercase">
                              {isArabic ? '🎙️ التسجيل الصوتي يعمل — انتظر حتى ينتهي' : '🎙️ VOICE PLAYING — WAIT TO FINISH'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400/60 text-[10px] tracking-wider">
                              VOICE {activeVoiceNumber}
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: [8, 16, 8] }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                                  className="w-1 bg-amber-400/60 rounded-full"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CHARACTER LABEL */}
                  <div className={`px-6 sm:px-10 md:px-12 pt-6 sm:pt-8 flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="text-[10px] sm:text-[11px] italic tracking-[0.3em] font-bold uppercase" style={{ color: char.color }}>
                      {isArabic ? char.arabicName : char.name}
                    </div>
                    <div className="h-px flex-1 bg-white/[0.05]" />
                    {/* PROGRESS BAR: from character name to end of text box */}
                    <div className="h-0.5 w-16 sm:w-24 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: char.color }}
                        animate={{ width: `${textProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* DIALOGUE TEXT */}
                  <div className="px-6 sm:px-10 md:px-12 py-6 sm:py-8">
                    <p className={`${isArabic ? "text-2xl sm:text-3xl md:text-4xl font-arabic leading-[1.8]" : "text-lg sm:text-xl md:text-[28px] font-extralight leading-relaxed tracking-wide"} text-white/95`}>
                      {isArabic ? displayedArabic : displayedText}
                    </p>
                  </div>

                  {/* ALL CONTROLS ROW — inside the box */}
                  <div className={`px-6 sm:px-10 md:px-12 pb-4 sm:pb-6 flex flex-wrap items-center gap-3 sm:gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>

                    {/* 1. Audio Control Button with Volume Panel Toggle */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowVolumePanel(!showVolumePanel); }}
                        disabled={voiceSyncLock}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${voiceSyncLock ? 'bg-white/5 opacity-40 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 cursor-pointer'}`}
                      >
                        {isMuted ? (
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                        ) : (
                          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                        )}
                        <span className={`text-[9px] tracking-[0.2em] uppercase ${isMuted ? 'text-red-400/60' : 'text-amber-400/80'}`}>
                          {isMuted ? (isArabic ? 'صامت' : 'MUTED') : (isArabic ? 'صوت' : 'AUDIO')}
                        </span>
                      </button>

                      {/* Volume Panel Dropdown */}
                      <AnimatePresence>
                        {showVolumePanel && !voiceSyncLock && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Mute All Toggle */}
                            <button
                              onClick={() => setIsMuted(!isMuted)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-3 transition-colors ${isMuted ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                            >
                              <span className="text-[10px] tracking-wider uppercase text-white/60">
                                {isMuted ? (isArabic ? 'إلغاء الصمت' : 'UNMUTE ALL') : (isArabic ? 'كتم الكل' : 'MUTE ALL')}
                              </span>
                              {isMuted ? (
                                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4L9.91 6.09 12 8.18V4zm7 10c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-3.5 0c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z"/></svg>
                              ) : (
                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                              )}
                            </button>

                            {/* Background Music Volume */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] tracking-wider uppercase text-white/40">BG Music</span>
                                <span className="text-[9px] text-white/30">{Math.round(bgVolume * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={bgVolume * 100}
                                onChange={(e) => setBgVolume(Number(e.target.value) / 100)}
                                disabled={isMuted}
                                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer disabled:[&::-webkit-slider-thumb]:opacity-30"
                              />
                            </div>

                            {/* Scene Music Volume */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] tracking-wider uppercase text-white/40">Scene Music</span>
                                <span className="text-[9px] text-white/30">{Math.round(sceneVolume * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={sceneVolume * 100}
                                onChange={(e) => setSceneVolume(Number(e.target.value) / 100)}
                                disabled={isMuted}
                                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer disabled:[&::-webkit-slider-thumb]:opacity-30"
                              />
                            </div>

                            {/* Voice Volume */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] tracking-wider uppercase text-white/40">Voice</span>
                                <span className="text-[9px] text-white/30">{Math.round(voiceVolume * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={voiceVolume * 100}
                                onChange={(e) => setVoiceVolume(Number(e.target.value) / 100)}
                                disabled={isMuted}
                                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer disabled:[&::-webkit-slider-thumb]:opacity-30"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 2. Auto Speed Selector */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5">
                      {(['veryslow', 'slow', 'standard'] as AutoSpeed[]).map(speed => (
                        <button
                          key={speed}
                          onClick={(e) => { e.stopPropagation(); setAutoSpeed(speed); }}
                          disabled={voiceSyncLock || novelPaused}
                          className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] tracking-[0.15em] uppercase transition-all ${autoSpeed === speed ? 'bg-amber-500/30 text-amber-400' : 'text-white/30 hover:text-white/60'} ${voiceSyncLock || novelPaused ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {speed === 'veryslow' ? (isArabic ? 'بطيء جداً' : 'V.Slow') : speed === 'slow' ? (isArabic ? 'بطيء' : 'Slow') : (isArabic ? 'عادي' : 'Std')}
                        </button>
                      ))}
                    </div>

                    {/* Stream Archive Bar moved inside script box below dialogue text */}
                    <div className="px-0 sm:px-0 w-full">
                      <div className="flex items-center gap-2 px-6 sm:px-10 md:px-12 pb-2">
                        <div className="flex-1 min-w-[80px] sm:min-w-[120px] h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: char.color }}
                            animate={{ width: `${((dialogueIndex + 1) / (dialogueLines.length || 1)) * 100}%` }}
                          />
                        </div>
                        <div className="text-[8px] tracking-[0.2em] text-white/30 font-mono">
                          {dialogueIndex + 1}/{dialogueLines.length}
                        </div>
                      </div>
                    </div>

                    {/* 4. Play/Stop - Always enabled to toggle pause state */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${novelPaused ? 'bg-green-500/30 text-green-400 hover:bg-green-500/40' : mediaState.isPlaying ? 'bg-amber-500/30 text-amber-400' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      {novelPaused ? (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      ) : mediaState.isPlaying ? (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>

                    {/* 5. Auto Toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setAutoMode(!autoMode); }}
                      disabled={voiceSyncLock || novelPaused}
                      className={`px-3 py-1.5 rounded-lg border text-[9px] tracking-[0.2em] font-bold transition-all ${voiceSyncLock || novelPaused ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/5' : autoMode ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60'}`}
                    >
                      {isArabic ? (autoMode ? 'تلقائي' : 'يدوي') : (autoMode ? 'AUTO' : 'MANUAL')}
                    </button>

                    {/* 6. Back / Next */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBack}
                        disabled={dialogueIndex === 0 || voiceSyncLock || novelPaused}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${dialogueIndex === 0 || voiceSyncLock || novelPaused ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdvance(); }}
                        disabled={voiceSyncLock || novelPaused}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${voiceSyncLock || novelPaused ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* AUTO TIMER BAR (bottom edge) */}
                  {autoMode && isDialogueComplete && !voiceSyncLock && !novelPaused && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-500/40"
                        initial={{ width: 0 }} animate={{ width: `${autoProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHOICES */}
          <AnimatePresence>
            {showChoices && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 pointer-events-auto max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <div className="text-[10px] uppercase tracking-[1em] text-amber-500/30 italic">Timeline Branch</div>
                </div>
                {currentScene?.choices?.map(c => (
                  <button key={c.id} onClick={() => handleChoice(c)} className="group relative p-6 sm:p-10 bg-black/80 backdrop-blur-3xl border border-white/5 rounded-2xl text-center hover:border-amber-500/30 transition-all shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 text-lg sm:text-2xl text-white/60 group-hover:text-white group-hover:italic transition-all tracking-[0.1em]">{isArabic ? (c.arabicText || c.text) : c.text}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NODE INFO */}
      <div className="absolute bottom-4 left-0 right-0 z-50 flex items-center justify-center pointer-events-none px-4">
        <div className="flex items-center gap-4 sm:gap-6 bg-black/60 py-1.5 px-6 sm:px-8 rounded-full border border-white/5 backdrop-blur-md">
          <div className="text-[8px] sm:text-[9px] tracking-[0.3em] font-mono text-white/20 uppercase">ID</div>
          <div className="text-[9px] sm:text-[10px] font-mono text-amber-500/60 font-bold uppercase truncate max-w-[120px] sm:max-w-none">{currentSceneId}</div>
          <div className="w-1 h-1 rounded-full bg-amber-500/40" />
          {activeVoiceNumber && (
            <>
              <div className="text-[8px] sm:text-[9px] tracking-[0.2em] font-mono text-white/20 uppercase">VOICE</div>
              <div className="text-[9px] sm:text-[10px] font-mono text-amber-400/60 font-bold">{activeVoiceNumber}</div>
              <div className="w-1 h-1 rounded-full bg-amber-500/40" />
            </>
          )}
          {novelPaused && activeVoiceNumber && (
            <div className="ml-2 text-xs text-white/80 bg-red-600/60 px-2 py-1 rounded-full">VOICE RUNNING</div>
          )}
          <div className="text-[8px] sm:text-[9px] tracking-[0.3em] font-mono text-white/20 uppercase">{isArabic ? 'تيار' : 'STREAM'}</div>
          <div className="text-[9px] sm:text-[10px] font-mono text-white/40">{dialogueIndex + 1}/{dialogueLines.length}</div>
        </div>
      </div>

      {/* SCENE TRANSITION */}
      <AnimatePresence>
        {sceneTransitioning && (
          <motion.div
            className="absolute inset-0 bg-black z-[120] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="text-amber-500/10 font-bold tracking-[3em] text-[120px] sm:text-[180px] uppercase pointer-events-none italic">OSIRIS</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Scene Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-60 flex justify-center gap-4 p-2 bg-black/40 backdrop-blur-md pointer-events-none" aria-label="scene-controls">
        <button onClick={() => { globalPlay(); }} className="pointer-events-auto px-4 py-2 rounded-lg bg-amber-500/40 hover:bg-amber-500/60 text-white text-sm">Play Scene</button>
        <button onClick={() => { globalPause(); }} className="pointer-events-auto px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm">Stop Scene</button>
      </div>
    </motion.div>
  );
}

// Focus handling block removed (moved inside component if needed)

export default MainPlayer;
