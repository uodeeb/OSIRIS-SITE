/**
 * OSIRIS Music Integration System
 * Integrates existing music tracks from MUSIC-BG folder with scene emotional context
 * Maps tracks to scenes based on Arabic cultural emotional analysis
 */

export interface MusicTrack {
  id: string;
  filename: string;
  arabicTitle: string;
  englishTitle: string;
  emotionalContext: string[];
  sceneMapping: string[];
  culturalSignificance: string;
  audioType: 'background' | 'narration' | 'ambient' | 'climactic';
  duration?: number;
  volume?: number;
  loop?: boolean;
}

export interface SceneMusicMapping {
  sceneId: string;
  primaryTrack: string;
  secondaryTracks: string[];
  emotionalProfile: EmotionalProfile;
  culturalContext: CulturalMusicContext;
  audioLayers: AudioLayerConfig[];
}

export interface EmotionalProfile {
  primary: string;
  intensity: number; // 0-1
  culturalResonance: string;
  maqamSuggestion: string;
  rhythmPattern: string;
}

export interface CulturalMusicContext {
  setting: string;
  timeOfDay: string;
  historicalPeriod: string;
  religiousSignificance: 'sacred' | 'secular' | 'ceremonial';
  socialContext: 'private' | 'public' | 'intimate' | 'communal';
}

export interface AudioLayerConfig {
  trackId: string;
  layerType: 'background' | 'ambient' | 'narration' | 'effect';
  volume: number;
  fadeIn: number;
  fadeOut: number;
  startTime: number;
  duration?: number;
  spatialPosition?: 'center' | 'left' | 'right' | 'surround';
}

/**
 * OSIRIS Music Tracks Database
 * Based on existing music files in generated-assets/music-tracks/ folder
 */
const OSIRIS_MUSIC_TRACKS: Record<string, MusicTrack> = {
  // Main Theme Tracks
  'main-theme': {
    id: 'main-theme',
    filename: 'TRACK-01.mp3',
    arabicTitle: 'الثيم الرئيسي للرواية',
    englishTitle: 'Main Theme of the Novel',
    emotionalContext: ['epic', 'cosmic', 'mysterious', 'contemplative', 'spiritual'],
    sceneMapping: ['intro', 'loading', 'transitions', 'main-menu'],
    culturalSignificance: 'Represents the cosmic scope of the 6000-year case',
    audioType: 'background',
    loop: true,
    volume: 0.7
  },
  
  'courtroom-cosmic': {
    id: 'courtroom-cosmic',
    filename: 'TRACK 02.m4a',
    arabicTitle: 'غرفة المحاكمة الكونية',
    englishTitle: 'Cosmic Courtroom',
    emotionalContext: ['dark', 'isolated', 'digital', 'paranoid', 'cold'],
    sceneMapping: ['zero-1-1-summons', 'zero-1-2-opening-statement'],
    culturalSignificance: 'The moment of cosmic accusation and digital paranoia',
    audioType: 'ambient',
    loop: true,
    volume: 0.6
  },
  
  'iblis-theme': {
    id: 'iblis-theme',
    filename: 'TRACK 03.mp3',
    arabicTitle: 'ثيم إبليس',
    englishTitle: 'Iblis Theme',
    emotionalContext: ['ancient', 'cold', 'intelligent', 'menacing', 'philosophical'],
    sceneMapping: ['iblis-appearances', 'algorithm-revelations', 'cosmic-entity'],
    culturalSignificance: 'The voice of the eternal accuser, ancient and calculating',
    audioType: 'background',
    loop: false,
    volume: 0.5
  },
  
  'tariq-tragedy': {
    id: 'tariq-tragedy',
    filename: 'TRACK-04.m4a',
    arabicTitle: 'مأساة طارق',
    englishTitle: 'Tariq\'s Tragedy',
    emotionalContext: ['hopeful', 'tragic', 'sacrifice', 'emotional', 'nostalgic'],
    sceneMapping: ['part-1-scenes', 'tariq-moments', 'sacrifice-scenes'],
    culturalSignificance: 'The journey from hope to tragic sacrifice',
    audioType: 'climactic',
    loop: false,
    volume: 0.8
  },
  
  'golden-calf-desert': {
    id: 'golden-calf-desert',
    filename: 'TRACK-05.m4a',
    arabicTitle: 'العجل الذهبي في الصحراء',
    englishTitle: 'Golden Calf in the Desert',
    emotionalContext: ['ancient', 'tribal', 'frenetic', 'spiritual-void', 'mass-hysteria'],
    sceneMapping: ['sinai-desert', 'golden-calf', 'crowd-manipulation'],
    culturalSignificance: 'Ancient mass manipulation and spiritual void',
    audioType: 'background',
    loop: true,
    volume: 0.7
  },
  
  'nicaea-byzantine': {
    id: 'nicaea-byzantine',
    filename: 'TRACK-06.m4a',
    arabicTitle: 'مجمع نيقية البيزنطي',
    englishTitle: 'Byzantine Council of Nicaea',
    emotionalContext: ['sacred', 'political', 'corrupted', 'theological', 'imperial'],
    sceneMapping: ['nicaea-council', 'constantine-scenes', 'religious-politics'],
    culturalSignificance: 'The moment religion became a political weapon',
    audioType: 'ambient',
    loop: true,
    volume: 0.6
  },
  
  'andalus-elegy': {
    id: 'andalus-elegy',
    filename: 'TRACK-07.m4a',
    arabicTitle: 'رثاء الأندلس',
    englishTitle: 'Andalusian Elegy',
    emotionalContext: ['andulasian', 'melancholic', 'beauty-fading', 'civilization-loss', 'nostalgic'],
    sceneMapping: ['andalus-scenes', 'abu-abdullah', 'granada-fall'],
    culturalSignificance: 'The fading beauty of Andalusian civilization',
    audioType: 'background',
    loop: false,
    volume: 0.7
  },
  
  'totalitarian-horror': {
    id: 'totalitarian-horror',
    filename: 'TRACK-08.m4a',
    arabicTitle: 'رعب التوتاليتارية',
    englishTitle: 'Totalitarian Horror',
    emotionalContext: ['cold-war', 'industrial', 'bureaucratic', 'mechanical', 'horror'],
    sceneMapping: ['20th-century', 'hitler-stalin-polpot', 'bureaucratic-evil'],
    culturalSignificance: 'The banality of evil in modern totalitarian systems',
    audioType: 'climactic',
    loop: false,
    volume: 0.8
  },
  
  'karbala-spiritual': {
    id: 'karbala-spiritual',
    filename: 'TRACK-09.m4a',
    arabicTitle: 'كربلاء الروحية',
    englishTitle: 'Karbala Spiritual',
    emotionalContext: ['spiritual', 'sacrifice', 'desert-heat', 'transcendent', 'martyr'],
    sceneMapping: ['karbala-scenes', 'hussein-moments', 'spiritual-climax'],
    culturalSignificance: 'The ultimate sacrifice for principle over survival',
    audioType: 'climactic',
    loop: false,
    volume: 0.9
  },
  
  'digital-confrontation': {
    id: 'digital-confrontation',
    filename: 'TRACK-10.m4a',
    arabicTitle: 'المواجهة الرقمية',
    englishTitle: 'Digital Confrontation',
    emotionalContext: ['epic', 'electronic', 'orchestral', 'climax', 'sacrifice'],
    sceneMapping: ['final-confrontation', 'yahya-choice', 'digital-sacrifice'],
    culturalSignificance: 'The ultimate choice between freedom and comfortable slavery',
    audioType: 'climactic',
    loop: false,
    volume: 1.0
  },
  
  'bittersweet-resolution': {
    id: 'bittersweet-resolution',
    filename: 'TRACK-11.m4a',
    arabicTitle: 'الختام الحلو-المر',
    englishTitle: 'Bittersweet Resolution',
    emotionalContext: ['bittersweet', 'hope', 'uncertainty', 'resolution', 'continuation'],
    sceneMapping: ['final-scenes', 'truth-revealed', 'world-waking'],
    culturalSignificance: 'The story ends but the struggle continues',
    audioType: 'background',
    loop: false,
    volume: 0.7
  },
  
  'action-escape': {
    id: 'action-escape',
    filename: 'TRACK-12.m4a',
    arabicTitle: 'الهروب والأكشن',
    englishTitle: 'Action and Escape',
    emotionalContext: ['urgent', 'thriller', 'adrenaline', 'danger', 'race-against-time'],
    sceneMapping: ['action-scenes', 'escape-sequences', 'urgent-moments'],
    culturalSignificance: 'Physical danger and adrenaline in critical moments',
    audioType: 'effect',
    loop: false,
    volume: 0.9
  },
  
  'dream-before-battle': {
    id: 'dream-before-battle',
    filename: 'TRACK-13.m4a',
    arabicTitle: 'الحلم قبل المعركة',
    englishTitle: 'Dream Before Battle',
    emotionalContext: ['ethereal', 'peaceful', 'beyond-death', 'spiritual', 'farewell'],
    sceneMapping: ['transitional-dream', 'tariq-meeting', 'beyond-time'],
    culturalSignificance: 'The peaceful space beyond death and time',
    audioType: 'ambient',
    loop: true,
    volume: 0.5
  },
  
  'credits-finale': {
    id: 'credits-finale',
    filename: 'TRACK-14.m4a',
    arabicTitle: 'الثيم الختامي',
    englishTitle: 'Credits Finale',
    emotionalContext: ['epic', 'arabic-orchestral', 'fusion', 'continuation', 'open-ended'],
    sceneMapping: ['credits', 'sharing', 'final-message'],
    culturalSignificance: 'The case remains open, the choice is yours',
    audioType: 'background',
    loop: false,
    volume: 0.8
  }
};

/**
 * Scene-to-Music Mapping System
 * Maps OSIRIS scenes to appropriate music tracks based on emotional and cultural context
 */
const SCENE_MUSIC_MAPPINGS: Record<string, SceneMusicMapping> = {
  // Part Zero: The Summons
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
  
  'zero-1-2-opening-statement': {
    sceneId: 'zero-1-2-opening-statement',
    primaryTrack: 'main-theme',
    secondaryTracks: ['courtroom-cosmic'],
    emotionalProfile: {
      primary: 'cosmic-mystery',
      intensity: 0.9,
      culturalResonance: 'ancient-authority',
      maqamSuggestion: 'rast',
      rhythmPattern: 'slow-build'
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
        trackId: 'main-theme',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 3.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'surround'
      }
    ]
  },
  
  // Part One: Tariq's Story
  'zero-1-2-prosecution': {
    sceneId: 'zero-1-2-prosecution',
    primaryTrack: 'main-theme',
    secondaryTracks: ['courtroom-cosmic'],
    emotionalProfile: {
      primary: 'cosmic-mystery',
      intensity: 0.9,
      culturalResonance: 'ancient-authority',
      maqamSuggestion: 'rast',
      rhythmPattern: 'slow-build'
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
        trackId: 'main-theme',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 3.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'one-1-5-1-promise': {
    sceneId: 'one-1-5-1-promise',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'hopeful-tragic',
      intensity: 0.6,
      culturalResonance: 'genius-discovering-truth',
      maqamSuggestion: 'bayati',
      rhythmPattern: 'emotional-build'
    },
    culturalContext: {
      setting: 'modern-lab',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'background',
        volume: 0.5,
        fadeIn: 2.0,
        fadeOut: 4.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'one-1-5-2-bitter-truth': {
    sceneId: 'one-1-5-2-bitter-truth',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['courtroom-cosmic'],
    emotionalProfile: {
      primary: 'tragic-revelation',
      intensity: 0.8,
      culturalResonance: 'truth-discovered',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'tension-build'
    },
    culturalContext: {
      setting: 'corporate-lab',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'background',
        volume: 0.6,
        fadeIn: 2.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'one-1-5-3-no-escape': {
    sceneId: 'one-1-5-3-no-escape',
    primaryTrack: 'action-escape',
    secondaryTracks: ['courtroom-cosmic'],
    emotionalProfile: {
      primary: 'paranoid-urgent',
      intensity: 0.9,
      culturalResonance: 'no-escape',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'frantic'
    },
    culturalContext: {
      setting: 'trapped-apartment',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'private'
    },
    audioLayers: [
      {
        trackId: 'action-escape',
        layerType: 'effect',
        volume: 0.7,
        fadeIn: 1.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'one-1-5-4-sacrifice': {
    sceneId: 'one-1-5-4-sacrifice',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'tragic-sacrifice',
      intensity: 1.0,
      culturalResonance: 'ultimate-sacrifice',
      maqamSuggestion: 'saba',
      rhythmPattern: 'elegiac'
    },
    culturalContext: {
      setting: 'rooftop',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'sacred',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'climactic',
        volume: 0.8,
        fadeIn: 3.0,
        fadeOut: 5.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'two-2-1-escape': {
    sceneId: 'two-2-1-escape',
    primaryTrack: 'action-escape',
    secondaryTracks: ['courtroom-cosmic'],
    emotionalProfile: {
      primary: 'urgent-danger',
      intensity: 0.9,
      culturalResonance: 'escape-survival',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'frantic-chase'
    },
    culturalContext: {
      setting: 'dark-alley',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'private'
    },
    audioLayers: [
      {
        trackId: 'action-escape',
        layerType: 'effect',
        volume: 0.8,
        fadeIn: 0.5,
        fadeOut: 1.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'two-2-2-osiris-launch': {
    sceneId: 'two-2-2-osiris-launch',
    primaryTrack: 'main-theme',
    secondaryTracks: ['courtroom-cosmic'],
    emotionalProfile: {
      primary: 'techno-revelation',
      intensity: 0.8,
      culturalResonance: 'system-awakening',
      maqamSuggestion: 'rast',
      rhythmPattern: 'building-momentum'
    },
    culturalContext: {
      setting: 'server-room',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'main-theme',
        layerType: 'background',
        volume: 0.6,
        fadeIn: 3.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'center'
      }
    ]
  },
  
  'three-3-1-creation': {
    sceneId: 'three-3-1-creation',
    primaryTrack: 'iblis-theme',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'cosmic-ancient',
      intensity: 0.9,
      culturalResonance: 'first-refusal',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'eternal-stillness'
    },
    culturalContext: {
      setting: 'cosmic-void',
      timeOfDay: 'before-time',
      historicalPeriod: 'prehistoric',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'iblis-theme',
        layerType: 'ambient',
        volume: 0.5,
        fadeIn: 4.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'three-3-1b-devil-song': {
    sceneId: 'three-3-1b-devil-song',
    primaryTrack: 'iblis-theme',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'ancient-defiance',
      intensity: 1.0,
      culturalResonance: 'first-pride',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'rhythmic-chant'
    },
    culturalContext: {
      setting: 'cosmic-rebellion',
      timeOfDay: 'before-time',
      historicalPeriod: 'prehistoric',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'iblis-theme',
        layerType: 'climactic',
        volume: 0.7,
        fadeIn: 2.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'three-3-2-virus-design': {
    sceneId: 'three-3-2-virus-design',
    primaryTrack: 'iblis-theme',
    secondaryTracks: ['courtroom-cosmic'],
    emotionalProfile: {
      primary: 'algorithmic-evil',
      intensity: 0.8,
      culturalResonance: 'code-as-sin',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'mechanical-build'
    },
    culturalContext: {
      setting: 'digital-cosmos',
      timeOfDay: 'eternal',
      historicalPeriod: 'prehistoric',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'iblis-theme',
        layerType: 'ambient',
        volume: 0.6,
        fadeIn: 3.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'four-4-1-desert': {
    sceneId: 'four-4-1-desert',
    primaryTrack: 'golden-calf-desert',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'ancient-mass-hysteria',
      intensity: 0.8,
      culturalResonance: 'spiritual-void',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'tribal-build'
    },
    culturalContext: {
      setting: 'desert',
      timeOfDay: 'dawn',
      historicalPeriod: 'ancient',
      religiousSignificance: 'sacred',
      socialContext: 'communal'
    },
    audioLayers: [
      {
        trackId: 'golden-calf-desert',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 1.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'four-4-2-crowd-engineering': {
    sceneId: 'four-4-2-crowd-engineering',
    primaryTrack: 'golden-calf-desert',
    secondaryTracks: ['action-escape'],
    emotionalProfile: {
      primary: 'mass-hypnosis',
      intensity: 0.9,
      culturalResonance: 'idol-engineering',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'hypnotic-drum'
    },
    culturalContext: {
      setting: 'desert-camp',
      timeOfDay: 'night',
      historicalPeriod: 'ancient',
      religiousSignificance: 'sacred',
      socialContext: 'communal'
    },
    audioLayers: [
      {
        trackId: 'golden-calf-desert',
        layerType: 'background',
        volume: 0.8,
        fadeIn: 1.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'four-5-1-tarek-message': {
    sceneId: 'four-5-1-tarek-message',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'haunting-revelation',
      intensity: 0.7,
      culturalResonance: 'voice-from-beyond',
      maqamSuggestion: 'saba',
      rhythmPattern: 'mournful'
    },
    culturalContext: {
      setting: 'hideout',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'background',
        volume: 0.5,
        fadeIn: 3.0,
        fadeOut: 4.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'four-5-2-analyst-tears': {
    sceneId: 'four-5-2-analyst-tears',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'grief-resolution',
      intensity: 0.6,
      culturalResonance: 'human-fragility',
      maqamSuggestion: 'saba',
      rhythmPattern: 'stillness'
    },
    culturalContext: {
      setting: 'hideout',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'ambient',
        volume: 0.4,
        fadeIn: 4.0,
        fadeOut: 5.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'five-6a-1-nicaea-debate': {
    sceneId: 'five-6a-1-nicaea-debate',
    primaryTrack: 'nicaea-byzantine',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'intellectual-tension',
      intensity: 0.6,
      culturalResonance: 'theological-debate',
      maqamSuggestion: 'rast',
      rhythmPattern: 'scholarly'
    },
    culturalContext: {
      setting: 'library-corridors',
      timeOfDay: 'day',
      historicalPeriod: 'medieval',
      religiousSignificance: 'sacred',
      socialContext: 'public'
    },
    audioLayers: [
      {
        trackId: 'nicaea-byzantine',
        layerType: 'ambient',
        volume: 0.5,
        fadeIn: 3.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'center'
      }
    ]
  },
  
  'five-6b-1-constantine': {
    sceneId: 'five-6b-1-constantine',
    primaryTrack: 'nicaea-byzantine',
    secondaryTracks: ['action-escape'],
    emotionalProfile: {
      primary: 'imperial-oppression',
      intensity: 0.8,
      culturalResonance: 'power-corrupts',
      maqamSuggestion: 'rast',
      rhythmPattern: 'stately-oppressive'
    },
    culturalContext: {
      setting: 'council-hall',
      timeOfDay: 'morning',
      historicalPeriod: 'medieval',
      religiousSignificance: 'ceremonial',
      socialContext: 'public'
    },
    audioLayers: [
      {
        trackId: 'nicaea-byzantine',
        layerType: 'ambient',
        volume: 0.6,
        fadeIn: 3.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'center'
      }
    ]
  },
  
  'five-6c-1-laila-pain': {
    sceneId: 'five-6c-1-laila-pain',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'vulnerable-confession',
      intensity: 0.5,
      culturalResonance: 'personal-trauma',
      maqamSuggestion: 'saba',
      rhythmPattern: 'stillness'
    },
    culturalContext: {
      setting: 'hideout',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'ambient',
        volume: 0.3,
        fadeIn: 5.0,
        fadeOut: 5.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'five-6c-2-tarek-second': {
    sceneId: 'five-6c-2-tarek-second',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['iblis-theme'],
    emotionalProfile: {
      primary: 'pattern-recognition',
      intensity: 0.7,
      culturalResonance: 'history-repeats',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'building-realization'
    },
    culturalContext: {
      setting: 'hideout',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'background',
        volume: 0.5,
        fadeIn: 3.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'six-8-1-andalusia': {
    sceneId: 'six-8-1-andalusia',
    primaryTrack: 'andalus-elegy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'melancholic-beauty',
      intensity: 0.8,
      culturalResonance: 'civilization-loss',
      maqamSuggestion: 'bayati',
      rhythmPattern: 'elegiac-rubato'
    },
    culturalContext: {
      setting: 'granada-palace',
      timeOfDay: 'sunset',
      historicalPeriod: 'medieval',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'andalus-elegy',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 2.0,
        fadeOut: 5.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'six-8-2-last-tears': {
    sceneId: 'six-8-2-last-tears',
    primaryTrack: 'andalus-elegy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'devastating-loss',
      intensity: 0.9,
      culturalResonance: 'last-sigh',
      maqamSuggestion: 'saba',
      rhythmPattern: 'funereal'
    },
    culturalContext: {
      setting: 'granada-hill',
      timeOfDay: 'dusk',
      historicalPeriod: 'medieval',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'andalus-elegy',
        layerType: 'climactic',
        volume: 0.8,
        fadeIn: 2.0,
        fadeOut: 6.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'six-8b-1-berlin': {
    sceneId: 'six-8b-1-berlin',
    primaryTrack: 'totalitarian-horror',
    secondaryTracks: ['action-escape'],
    emotionalProfile: {
      primary: 'industrial-evil',
      intensity: 0.9,
      culturalResonance: 'systematic-hatred',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'mechanical-march'
    },
    culturalContext: {
      setting: 'berlin-office',
      timeOfDay: 'day',
      historicalPeriod: '20th-century',
      religiousSignificance: 'secular',
      socialContext: 'public'
    },
    audioLayers: [
      {
        trackId: 'totalitarian-horror',
        layerType: 'climactic',
        volume: 0.7,
        fadeIn: 2.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'six-8c-1-death-signatures': {
    sceneId: 'six-8c-1-death-signatures',
    primaryTrack: 'totalitarian-horror',
    secondaryTracks: ['iblis-theme'],
    emotionalProfile: {
      primary: 'bureaucratic-murder',
      intensity: 0.8,
      culturalResonance: 'banality-of-evil',
      maqamSuggestion: 'nahawand',
      rhythmPattern: 'cold-mechanical'
    },
    culturalContext: {
      setting: 'moscow-office',
      timeOfDay: 'night',
      historicalPeriod: '20th-century',
      religiousSignificance: 'secular',
      socialContext: 'private'
    },
    audioLayers: [
      {
        trackId: 'totalitarian-horror',
        layerType: 'ambient',
        volume: 0.6,
        fadeIn: 3.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'six-8d-1-attack': {
    sceneId: 'six-8d-1-attack',
    primaryTrack: 'action-escape',
    secondaryTracks: ['totalitarian-horror'],
    emotionalProfile: {
      primary: 'sudden-violence',
      intensity: 1.0,
      culturalResonance: 'hideout-breach',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'chaotic-assault'
    },
    culturalContext: {
      setting: 'underground-hideout',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'private'
    },
    audioLayers: [
      {
        trackId: 'action-escape',
        layerType: 'effect',
        volume: 0.9,
        fadeIn: 0.3,
        fadeOut: 1.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'six-8d-2-final-update': {
    sceneId: 'six-8d-2-final-update',
    primaryTrack: 'action-escape',
    secondaryTracks: ['digital-confrontation'],
    emotionalProfile: {
      primary: 'desperate-transfer',
      intensity: 0.9,
      culturalResonance: 'data-escape',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'countdown-urgency'
    },
    culturalContext: {
      setting: 'escape-tunnel',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'private'
    },
    audioLayers: [
      {
        trackId: 'action-escape',
        layerType: 'effect',
        volume: 0.8,
        fadeIn: 1.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'transition-dream': {
    sceneId: 'transition-dream',
    primaryTrack: 'dream-before-battle',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'ethereal-farewell',
      intensity: 0.4,
      culturalResonance: 'beyond-death',
      maqamSuggestion: 'rast',
      rhythmPattern: 'peaceful-stillness'
    },
    culturalContext: {
      setting: 'white-infinity',
      timeOfDay: 'beyond-time',
      historicalPeriod: 'eternal',
      religiousSignificance: 'sacred',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'dream-before-battle',
        layerType: 'ambient',
        volume: 0.4,
        fadeIn: 5.0,
        fadeOut: 5.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'center'
      }
    ]
  },
  
  'seven-10-1-karbala': {
    sceneId: 'seven-10-1-karbala',
    primaryTrack: 'karbala-spiritual',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'spiritual-sacrifice',
      intensity: 0.9,
      culturalResonance: 'martyr-transcendence',
      maqamSuggestion: 'rast',
      rhythmPattern: 'spiritual-stillness'
    },
    culturalContext: {
      setting: 'desert-battlefield',
      timeOfDay: 'noon',
      historicalPeriod: 'medieval',
      religiousSignificance: 'sacred',
      socialContext: 'communal'
    },
    audioLayers: [
      {
        trackId: 'karbala-spiritual',
        layerType: 'climactic',
        volume: 0.9,
        fadeIn: 4.0,
        fadeOut: 6.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'seven-11-1-temptation': {
    sceneId: 'seven-11-1-temptation',
    primaryTrack: 'digital-confrontation',
    secondaryTracks: ['iblis-theme'],
    emotionalProfile: {
      primary: 'seductive-offer',
      intensity: 0.8,
      culturalResonance: 'comfortable-cage',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'tension'
    },
    culturalContext: {
      setting: 'digital-realm',
      timeOfDay: 'eternal',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'digital-confrontation',
        layerType: 'background',
        volume: 0.6,
        fadeIn: 3.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'seven-11-2-decision': {
    sceneId: 'seven-11-2-decision',
    primaryTrack: 'digital-confrontation',
    secondaryTracks: ['karbala-spiritual'],
    emotionalProfile: {
      primary: 'defiant-choice',
      intensity: 0.9,
      culturalResonance: 'freedom-over-comfort',
      maqamSuggestion: 'rast',
      rhythmPattern: 'decisive-strike'
    },
    culturalContext: {
      setting: 'digital-realm',
      timeOfDay: 'eternal',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'digital-confrontation',
        layerType: 'climactic',
        volume: 0.8,
        fadeIn: 2.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'seven-11-3-yahya-death': {
    sceneId: 'seven-11-3-yahya-death',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['karbala-spiritual'],
    emotionalProfile: {
      primary: 'martyr-peace',
      intensity: 1.0,
      culturalResonance: 'truth-costs-life',
      maqamSuggestion: 'saba',
      rhythmPattern: 'transcendent'
    },
    culturalContext: {
      setting: 'digital-realm',
      timeOfDay: 'eternal',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'climactic',
        volume: 0.8,
        fadeIn: 3.0,
        fadeOut: 6.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'seven-12-1-truth-leak': {
    sceneId: 'seven-12-1-truth-leak',
    primaryTrack: 'digital-confrontation',
    secondaryTracks: ['action-escape'],
    emotionalProfile: {
      primary: 'truth-released',
      intensity: 0.9,
      culturalResonance: 'digital-rosetta',
      maqamSuggestion: 'rast',
      rhythmPattern: 'notification-cascade'
    },
    culturalContext: {
      setting: 'abandoned-basement',
      timeOfDay: 'dawn',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'digital-confrontation',
        layerType: 'climactic',
        volume: 0.8,
        fadeIn: 2.0,
        fadeOut: 4.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  'seven-13-1-awakening': {
    sceneId: 'seven-13-1-awakening',
    primaryTrack: 'bittersweet-resolution',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'global-awakening',
      intensity: 0.7,
      culturalResonance: 'consciousness-born',
      maqamSuggestion: 'rast',
      rhythmPattern: 'gentle-resolution'
    },
    culturalContext: {
      setting: 'global-screens',
      timeOfDay: 'dawn',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'communal'
    },
    audioLayers: [
      {
        trackId: 'bittersweet-resolution',
        layerType: 'background',
        volume: 0.6,
        fadeIn: 3.0,
        fadeOut: 5.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  'seven-13-2-closing': {
    sceneId: 'seven-13-2-closing',
    primaryTrack: 'credits-finale',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'cosmic-closure',
      intensity: 0.6,
      culturalResonance: 'case-remains-open',
      maqamSuggestion: 'rast',
      rhythmPattern: 'finality'
    },
    culturalContext: {
      setting: 'cosmic-courtroom',
      timeOfDay: 'eternal',
      historicalPeriod: 'prehistoric',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'credits-finale',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 4.0,
        fadeOut: 8.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },

  // Legacy mappings (keep for backward compatibility)
  'part-1-tariq-promise': {
    sceneId: 'part-1-tariq-promise',
    primaryTrack: 'tariq-tragedy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'hopeful-tragic',
      intensity: 0.6,
      culturalResonance: 'genius-discovering-truth',
      maqamSuggestion: 'bayati',
      rhythmPattern: 'emotional-build'
    },
    culturalContext: {
      setting: 'modern-lab',
      timeOfDay: 'night',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'tariq-tragedy',
        layerType: 'background',
        volume: 0.5,
        fadeIn: 2.0,
        fadeOut: 4.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  // Part Two: The Golden Calf
  'sinai-desert-scenes': {
    sceneId: 'sinai-desert-scenes',
    primaryTrack: 'golden-calf-desert',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'ancient-mass-hysteria',
      intensity: 0.8,
      culturalResonance: 'spiritual-void',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'tribal-build'
    },
    culturalContext: {
      setting: 'desert',
      timeOfDay: 'dawn',
      historicalPeriod: 'ancient',
      religiousSignificance: 'sacred',
      socialContext: 'communal'
    },
    audioLayers: [
      {
        trackId: 'golden-calf-desert',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 1.0,
        fadeOut: 2.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'surround'
      }
    ]
  },
  
  // Part Three: Council of Nicaea
  'nicaea-council-scenes': {
    sceneId: 'nicaea-council-scenes',
    primaryTrack: 'nicaea-byzantine',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'sacred-corrupted',
      intensity: 0.7,
      culturalResonance: 'religion-politicized',
      maqamSuggestion: 'rast',
      rhythmPattern: 'stately-oppressive'
    },
    culturalContext: {
      setting: 'byzantine-court',
      timeOfDay: 'morning',
      historicalPeriod: 'medieval',
      religiousSignificance: 'ceremonial',
      socialContext: 'public'
    },
    audioLayers: [
      {
        trackId: 'nicaea-byzantine',
        layerType: 'ambient',
        volume: 0.6,
        fadeIn: 3.0,
        fadeOut: 3.0,
        startTime: 0,
        loop: true,
        spatialPosition: 'center'
      }
    ]
  },
  
  // Part Four: Lost Andalus
  'andalus-scenes': {
    sceneId: 'andalus-scenes',
    primaryTrack: 'andalus-elegy',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'melancholic-beauty',
      intensity: 0.8,
      culturalResonance: 'civilization-loss',
      maqamSuggestion: 'bayati',
      rhythmPattern: 'elegiac-rubato'
    },
    culturalContext: {
      setting: 'granada-palace',
      timeOfDay: 'sunset',
      historicalPeriod: 'medieval',
      religiousSignificance: 'secular',
      socialContext: 'intimate'
    },
    audioLayers: [
      {
        trackId: 'andalus-elegy',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 2.0,
        fadeOut: 5.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  },
  
  // Part Five: Karbala
  'karbala-scenes': {
    sceneId: 'karbala-scenes',
    primaryTrack: 'karbala-spiritual',
    secondaryTracks: ['main-theme'],
    emotionalProfile: {
      primary: 'spiritual-sacrifice',
      intensity: 0.9,
      culturalResonance: 'martyr-transcendence',
      maqamSuggestion: 'rast',
      rhythmPattern: 'spiritual-stillness'
    },
    culturalContext: {
      setting: 'desert-battlefield',
      timeOfDay: 'noon',
      historicalPeriod: 'medieval',
      religiousSignificance: 'sacred',
      socialContext: 'communal'
    },
    audioLayers: [
      {
        trackId: 'karbala-spiritual',
        layerType: 'climactic',
        volume: 0.9,
        fadeIn: 4.0,
        fadeOut: 6.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      }
    ]
  },
  
  // Final Confrontation
  'final-confrontation': {
    sceneId: 'final-confrontation',
    primaryTrack: 'digital-confrontation',
    secondaryTracks: ['main-theme', 'action-escape'],
    emotionalProfile: {
      primary: 'epic-climax',
      intensity: 1.0,
      culturalResonance: 'freedom-vs-slavery',
      maqamSuggestion: 'hijaz',
      rhythmPattern: 'climactic-build'
    },
    culturalContext: {
      setting: 'digital-realm',
      timeOfDay: 'eternal',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'sacred',
      socialContext: 'cosmic'
    },
    audioLayers: [
      {
        trackId: 'digital-confrontation',
        layerType: 'climactic',
        volume: 1.0,
        fadeIn: 2.0,
        fadeOut: 4.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'surround'
      },
      {
        trackId: 'action-escape',
        layerType: 'effect',
        volume: 0.4,
        fadeIn: 0.5,
        fadeOut: 1.0,
        startTime: 30,
        loop: false,
        spatialPosition: 'left'
      }
    ]
  },
  
  // Resolution and Credits
  'resolution-scenes': {
    sceneId: 'resolution-scenes',
    primaryTrack: 'bittersweet-resolution',
    secondaryTracks: ['main-theme', 'credits-finale'],
    emotionalProfile: {
      primary: 'bittersweet-hope',
      intensity: 0.7,
      culturalResonance: 'struggle-continues',
      maqamSuggestion: 'rast',
      rhythmPattern: 'gentle-resolution'
    },
    culturalContext: {
      setting: 'global-awakening',
      timeOfDay: 'dawn',
      historicalPeriod: 'contemporary',
      religiousSignificance: 'secular',
      socialContext: 'communal'
    },
    audioLayers: [
      {
        trackId: 'bittersweet-resolution',
        layerType: 'background',
        volume: 0.7,
        fadeIn: 3.0,
        fadeOut: 8.0,
        startTime: 0,
        loop: false,
        spatialPosition: 'center'
      }
    ]
  }
};

/**
 * Music Integration Engine
 * Manages music playback and scene mapping for OSIRIS
 */
export class MusicIntegrationEngine {
  private static instance: MusicIntegrationEngine;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeTracks: Map<string, AudioBufferSourceNode> = new Map();
  private musicLibrary: Record<string, MusicTrack> = OSIRIS_MUSIC_TRACKS;
  private sceneMappings: Record<string, SceneMusicMapping> = SCENE_MUSIC_MAPPINGS;
  private isInitialized = false;

  static getInstance(): MusicIntegrationEngine {
    if (!MusicIntegrationEngine.instance) {
      MusicIntegrationEngine.instance = new MusicIntegrationEngine();
    }
    return MusicIntegrationEngine.instance;
  }

  /**
   * Initialize the music integration engine
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.8;

      this.isInitialized = true;
      console.log('🎵 OSIRIS Music Integration Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Music Integration Engine:', error);
      throw error;
    }
  }

  /**
   * Get music mapping for a specific scene
   */
  getSceneMusicMapping(sceneId: string): SceneMusicMapping | null {
    return this.sceneMappings[sceneId] || null;
  }

  /**
   * Get music track by ID
   */
  getMusicTrack(trackId: string): MusicTrack | null {
    return this.musicLibrary[trackId] || null;
  }

  /**
   * Play music for a specific scene
   */
  async playSceneMusic(sceneId: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const mapping = this.getSceneMusicMapping(sceneId);
    if (!mapping) {
      console.warn(`No music mapping found for scene: ${sceneId}`);
      return;
    }

    console.log(`🎵 Playing music for scene: ${sceneId}`);
    console.log(`Primary track: ${mapping.primaryTrack}`);
    console.log(`Emotional profile: ${mapping.emotionalProfile.primary}`);

    // Stop any currently playing tracks
    this.stopAllMusic();

    // Play primary track
    await this.playMusicTrack(mapping.primaryTrack, mapping.audioLayers[0]);

    // Play secondary tracks if available
    for (let i = 1; i < mapping.audioLayers.length; i++) {
      const layer = mapping.audioLayers[i];
      setTimeout(() => {
        this.playMusicTrack(layer.trackId, layer);
      }, layer.startTime * 1000);
    }
  }

  /**
   * Play individual music track
   */
  private async playMusicTrack(trackId: string, config: AudioLayerConfig): Promise<void> {
    const track = this.getMusicTrack(trackId);
    if (!track) {
      console.warn(`Music track not found: ${trackId}`);
      return;
    }

    if (!this.audioContext || !this.masterGain) return;

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      // Load the audio file
      const audioPath = `/generated-assets/music-tracks/${track.filename}`;
      const response = await fetch(audioPath);
      if (!response.ok) {
        console.warn(`Failed to load audio file: ${audioPath}`);
        return;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Create audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = config.loop ?? track.loop ?? false;
      
      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = config.volume;

      // Create panner node for spatial positioning
      const pannerNode = this.audioContext.createPanner();
      pannerNode.panningModel = 'equalpower';
      
      // Set spatial position
      this.setSpatialPosition(pannerNode, config.spatialPosition || 'center');

      // Connect audio graph
      source.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(this.masterGain);

      // Apply fade in/out
      this.applyFadeEffects(gainNode, config);

      // Start playback
      source.start(this.audioContext.currentTime + config.startTime);
      
      // Track active source
      this.activeTracks.set(trackId, source);

      // Handle track end
      source.onended = () => {
        this.activeTracks.delete(trackId);
      };

      console.log(`✅ Playing track: ${track.arabicTitle} (${trackId})`);
    } catch (error) {
      console.error(`Error playing track ${trackId}:`, error);
    }
  }

  /**
   * Set spatial audio position
   */
  private setSpatialPosition(panner: PannerNode, position: string): void {
    switch (position) {
      case 'left':
        panner.positionX.setValueAtTime(-1, this.audioContext!.currentTime);
        break;
      case 'right':
        panner.positionX.setValueAtTime(1, this.audioContext!.currentTime);
        break;
      case 'center':
        panner.positionX.setValueAtTime(0, this.audioContext!.currentTime);
        break;
      case 'surround':
        // Create surround effect with multiple positions
        panner.positionX.setValueAtTime(0, this.audioContext!.currentTime);
        panner.positionZ.setValueAtTime(-1, this.audioContext!.currentTime);
        break;
    }
  }

  /**
   * Apply fade in/out effects
   */
  private applyFadeEffects(gainNode: GainNode, config: AudioLayerConfig): void {
    const now = this.audioContext!.currentTime;
    
    // Fade in
    if (config.fadeIn > 0) {
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(config.volume, now + config.fadeIn);
    }

    // Fade out
    if (config.fadeOut > 0 && config.duration) {
      const fadeOutStart = now + config.duration - config.fadeOut;
      gainNode.gain.linearRampToValueAtTime(0, fadeOutStart + config.fadeOut);
    }
  }

  /**
   * Stop all currently playing music
   */
  stopAllMusic(): void {
    for (const [trackId, source] of this.activeTracks) {
      try {
        source.stop();
      } catch (error) {
        // Source might already be stopped
      }
    }
    this.activeTracks.clear();
    console.log('🛑 All music stopped');
  }

  /**
   * Get emotional music suggestions for a scene
   */
  getEmotionalMusicSuggestions(emotionalContext: string, culturalContext: any): string[] {
    const suggestions: string[] = [];
    
    // Find tracks that match the emotional context
    for (const [trackId, track] of Object.entries(this.musicLibrary)) {
      if (track.emotionalContext.some(emotion => 
        emotionalContext.toLowerCase().includes(emotion) || 
        emotion.includes(emotionalContext.toLowerCase())
      )) {
        suggestions.push(trackId);
      }
    }

    // Find scenes with similar emotional profiles
    for (const [sceneId, mapping] of Object.entries(this.sceneMappings)) {
      if (mapping.emotionalProfile.primary.includes(emotionalContext.toLowerCase()) ||
          emotionalContext.toLowerCase().includes(mapping.emotionalProfile.primary)) {
        suggestions.push(mapping.primaryTrack);
      }
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Analyze scene content and suggest appropriate music
   */
  analyzeSceneForMusic(sceneContent: string): string[] {
    const emotionalKeywords = {
      'dark': ['darkness', 'shadow', 'evil', 'corruption', 'sin', 'devil', 'hell'],
      'hopeful': ['hope', 'light', 'salvation', 'redemption', 'peace', 'heaven'],
      'tragic': ['tragedy', 'loss', 'death', 'suffering', 'pain', 'tears'],
      'epic': ['epic', 'cosmic', 'eternal', 'ultimate', 'climax', 'sacrifice'],
      'spiritual': ['spirit', 'soul', 'divine', 'sacred', 'holy', 'prayer'],
      'ancient': ['ancient', 'historical', 'medieval', 'pharaoh', 'pyramid'],
      'digital': ['digital', 'algorithm', 'code', 'technology', 'cyber'],
      'desert': ['desert', 'sand', 'sun', 'heat', 'oasis', 'nomad'],
      'tribal': ['tribal', 'crowd', 'mass', 'collective', 'community'],
      'andulasian': ['andalus', 'granada', 'spain', 'moorish', 'alhambra']
    };

    const foundEmotions: string[] = [];
    
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = sceneContent.match(regex);
        return acc + (matches ? matches.length : 0);
      }, 0);

      if (score > 0) {
        foundEmotions.push(emotion);
      }
    }

    // Get music suggestions for found emotions
    const suggestions: string[] = [];
    for (const emotion of foundEmotions) {
      suggestions.push(...this.getEmotionalMusicSuggestions(emotion, {}));
    }

    return [...new Set(suggestions)];
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get music library overview
   */
  getMusicLibraryOverview(): any {
    const overview = {
      totalTracks: Object.keys(this.musicLibrary).length,
      byAudioType: {} as Record<string, number>,
      byEmotionalContext: {} as Record<string, number>,
      sceneMappings: Object.keys(this.sceneMappings).length
    };

    // Count by audio type
    for (const track of Object.values(this.musicLibrary)) {
      overview.byAudioType[track.audioType] = (overview.byAudioType[track.audioType] || 0) + 1;
    }

    // Count by emotional context
    for (const track of Object.values(this.musicLibrary)) {
      for (const emotion of track.emotionalContext) {
        overview.byEmotionalContext[emotion] = (overview.byEmotionalContext[emotion] || 0) + 1;
      }
    }

    return overview;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.stopAllMusic();
    
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isInitialized = false;
  }
}

/**
 * Utility functions for music integration
 */
export function getMusicPath(trackId: string): string {
  const track = OSIRIS_MUSIC_TRACKS[trackId];
  if (!track) {
    throw new Error(`Music track not found: ${trackId}`);
  }
  return `/generated-assets/music-tracks/${track.filename}`;
}

export function getSceneMusic(sceneId: string): SceneMusicMapping | null {
  return SCENE_MUSIC_MAPPINGS[sceneId] || null;
}

export function suggestMusicForEmotion(emotion: string): string[] {
  const engine = MusicIntegrationEngine.getInstance();
  return engine.getEmotionalMusicSuggestions(emotion, {});
}

/**
 * Initialize music integration system
 */
export async function initializeMusicIntegration(): Promise<MusicIntegrationEngine> {
  const engine = MusicIntegrationEngine.getInstance();
  await engine.initialize();
  return engine;
}

export default MusicIntegrationEngine;