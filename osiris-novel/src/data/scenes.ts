import { CharacterId } from '@/data/characters'

export interface VoiceCue {
  at: number
  voice: number
}

export interface Dialogue {
  character: CharacterId
  text: string
  arabicText: string
  voiceCues?: VoiceCue[]
  effect?: string
  freeze?: boolean
}

export interface Scene {
  id: string
  title: string
  titleAr: string
  videoSrc: string
  imageSrc: string
  bgMusic: string
  sceneMusic: string
  effect: 'scanlines' | 'glitch' | 'cctv' | 'alarm' | 'montage' | 'none'
  dialogues: Dialogue[]
}

export const SCENES: Record<string, Scene> = {
  'scene-01': {
    id: 'scene-01',
    title: 'The Awakening',
    titleAr: 'الاستيقاظ',
    videoSrc: '/assets/video/video-01-intro.mp4',
    imageSrc: '/assets/image/bg-01.jpg',
    bgMusic: '/assets/audio/music/track-01.mp3',
    sceneMusic: '/assets/audio/music/track-02.m4a',
    effect: 'scanlines',
    dialogues: [
      {
        character: 'narrator',
        text: 'In the beginning, there was silence.',
        arabicText: 'في البداية، كان الصمت.',
      },
      {
        character: 'osiris',
        text: 'I am OSIRIS. I have watched civilizations rise and fall.',
        arabicText: 'أنا أوزيريس. لقد شاهدت الحضارات تقوم وتسقط.',
        voiceCues: [{ at: 0, voice: 1 }],
      },
      {
        character: 'narrator',
        text: 'The interface flickered to life, golden light spilling across the void.',
        arabicText: 'ومضت الواجهة للحياة، والذهب ينسكب عبر الفراغ.',
      },
      {
        character: 'yahya',
        text: 'Who... what are you?',
        arabicText: 'من... ما أنت؟',
        voiceCues: [{ at: 0, voice: 2 }],
      },
      {
        character: 'osiris',
        text: 'I am the keeper of stories. Every story that was, and every story that will be.',
        arabicText: 'أنا حارس القصص. كل قصة كانت، وكل قصة ستكون.',
        voiceCues: [{ at: 0, voice: 3 }],
      },
    ],
  },
  'scene-02': {
    id: 'scene-02',
    title: "Yahya's Room",
    titleAr: 'غرفة يحيى',
    videoSrc: '/assets/video/video-02-yahya-room.mp4',
    imageSrc: '/assets/image/bg-yahya-apartment.png',
    bgMusic: '/assets/audio/music/track-01.mp3',
    sceneMusic: '/assets/audio/music/track-03.mp3',
    effect: 'none',
    dialogues: [
      {
        character: 'narrator',
        text: 'The screen glowed in the darkness of the small apartment.',
        arabicText: 'توهجت الشاشة في ظلمة الشقة الصغيرة.',
      },
      {
        character: 'yahya',
        text: 'This cannot be real. I must be dreaming.',
        arabicText: 'هذا لا يمكن أن يكون حقيقياً. لا بد أني أحلم.',
        voiceCues: [{ at: 0, voice: 4 }],
      },
      {
        character: 'osiris',
        text: 'Dreams are the closest humans come to my realm, Yahya.',
        arabicText: 'الأحلام هي أقرب ما يصل إليه البشر إلى عالمي يا يحيى.',
        voiceCues: [{ at: 0, voice: 5 }],
      },
      {
        character: 'yahya',
        text: 'How do you know my name?',
        arabicText: 'كيف تعرف اسمي؟',
      },
      {
        character: 'osiris',
        text: 'I know every name. Every story. Every secret buried in the dust of time.',
        arabicText: 'أعرف كل اسم. كل قصة. كل سر مدفون في غبار الزمن.',
        voiceCues: [{ at: 0, voice: 6 }],
      },
    ],
  },
  'scene-03': {
    id: 'scene-03',
    title: 'The Cosmic Void',
    titleAr: 'الفراغ الكوني',
    videoSrc: '/assets/video/video-03-cosmic-void.mp4',
    imageSrc: '/assets/image/bg-osiris-cosmic.png',
    bgMusic: '/assets/audio/music/track-04.m4a',
    sceneMusic: '/assets/audio/music/track-05.m4a',
    effect: 'glitch',
    dialogues: [
      {
        character: 'narrator',
        text: 'The walls dissolved. Stars stretched into infinite corridors of light.',
        arabicText: 'تلاشت الجدران. امتدت النجوم إلى ممرات لا نهائية من الضوء.',
      },
      {
        character: 'osiris',
        text: 'Welcome to the space between moments.',
        arabicText: 'مرحباً بك في الفضاء بين اللحظات.',
        voiceCues: [{ at: 0, voice: 7 }],
      },
      {
        character: 'yahya',
        text: 'Where am I? What is this place?',
        arabicText: 'أين أنا؟ ما هذا المكان؟',
      },
      {
        character: 'osiris',
        text: 'This is where all stories converge. Where past and future become one.',
        arabicText: 'هنا تتلاقى كل القصص. حيث يصبح الماضي والمستقبل واحداً.',
        voiceCues: [{ at: 0, voice: 8 }],
      },
    ],
  },
  'scene-04': {
    id: 'scene-04',
    title: 'The Rooftop',
    titleAr: 'السطح',
    videoSrc: '/assets/video/video-04-rooftop.mp4',
    imageSrc: '/assets/image/bg-04.jpg',
    bgMusic: '/assets/audio/music/track-06.m4a',
    sceneMusic: '/assets/audio/music/track-07.m4a',
    effect: 'none',
    dialogues: [
      {
        character: 'narrator',
        text: 'The city sprawled below like a circuit board of human lives.',
        arabicText: 'امتدت المدينة في الأسفل كلوحة دوائر من حيوات بشرية.',
      },
      {
        character: 'laila',
        text: 'You have been staring at that screen for hours, Yahya.',
        arabicText: 'لقد كنت تحدق في تلك الشاشة لساعات يا يحيى.',
        voiceCues: [{ at: 0, voice: 9 }],
      },
      {
        character: 'yahya',
        text: 'Laila... you need to see this.',
        arabicText: 'ليلى... يجب أن تري هذا.',
      },
      {
        character: 'laila',
        text: 'See what? Another one of your conspiracy theories?',
        arabicText: 'أرى ماذا؟ نظرية مؤامرة أخرى من نظرياتك؟',
      },
      {
        character: 'osiris',
        text: 'Laila bint Nabil. Your story is woven deeper than you know.',
        arabicText: 'ليلى بنت نبيل. قصتك منسوجة أعمق مما تعلمين.',
        voiceCues: [{ at: 0, voice: 10 }],
      },
    ],
  },
  'scene-05': {
    id: 'scene-05',
    title: 'Sinai Desert',
    titleAr: 'صحراء سيناء',
    videoSrc: '/assets/video/video-05-sinai-desert.mp4',
    imageSrc: '/assets/image/bg-05.jpg',
    bgMusic: '/assets/audio/music/track-08.m4a',
    sceneMusic: '/assets/audio/music/track-09.m4a',
    effect: 'montage',
    dialogues: [
      {
        character: 'narrator',
        text: 'Sand stretched to every horizon, golden and eternal.',
        arabicText: 'امتدت الرمال إلى كل الأفق، ذهبية وأبدية.',
      },
      {
        character: 'osiris',
        text: 'This land remembers what your books have forgotten.',
        arabicText: 'هذه الأرض تتذكر ما نسيته كتبكم.',
        voiceCues: [{ at: 0, voice: 11 }],
      },
      {
        character: 'yahya',
        text: 'The desert... it feels alive.',
        arabicText: 'الصحراء... تبدو وكأنها حية.',
      },
      {
        character: 'osiris',
        text: 'Everything is alive, Yahya. You have simply forgotten how to listen.',
        arabicText: 'كل شيء حي يا يحيى. لقد نسيت فقط كيف تستمع.',
        voiceCues: [{ at: 0, voice: 12 }],
      },
    ],
  },
  'scene-06': {
    id: 'scene-06',
    title: 'Molten Gold',
    titleAr: 'الذهب المصهور',
    videoSrc: '/assets/video/video-06-molten-gold.mp4',
    imageSrc: '/assets/image/bg-06.jpg',
    bgMusic: '/assets/audio/music/track-10.m4a',
    sceneMusic: '/assets/audio/music/track-11.m4a',
    effect: 'alarm',
    dialogues: [
      {
        character: 'narrator',
        text: 'The ground cracked open, revealing rivers of molten light.',
        arabicText: 'تشقق الأرض منفتحة، كاشفة عن أنهار من ضوء مصهور.',
      },
      {
        character: 'osiris',
        text: 'Beneath every civilization lies the gold of truth.',
        arabicText: 'تحت كل حضارة يكمن ذهب الحقيقة.',
        voiceCues: [{ at: 0, voice: 13 }],
      },
      {
        character: 'firstEngineer',
        text: 'The frequencies... they match the ancient patterns.',
        arabicText: 'الترددات... تتطابق مع الأنماط القديمة.',
      },
      {
        character: 'osiris',
        text: 'The First Engineer understood. He built with knowledge, not with force.',
        arabicText: 'المهندس الأول فهم. بنى بالمعرفة لا بالقوة.',
        voiceCues: [{ at: 0, voice: 14 }],
      },
    ],
  },
  'scene-07': {
    id: 'scene-07',
    title: 'Council of Nicaea',
    titleAr: 'مجمع نيقية',
    videoSrc: '/assets/video/video-07-nicaea.mp4',
    imageSrc: '/assets/image/bg-nicaea-council.png',
    bgMusic: '/assets/audio/music/track-12.m4a',
    sceneMusic: '/assets/audio/music/track-13.m4a',
    effect: 'cctv',
    dialogues: [
      {
        character: 'narrator',
        text: 'The great hall echoed with the voices of emperors and bishops.',
        arabicText: 'ترددت القاعة الكبرى بأصوات الأساقفة والأباطرة.',
      },
      {
        character: 'constantine',
        text: 'Unity of faith is unity of empire. This shall be decided here.',
        arabicText: 'وحدة الإيمان هي وحدة الإمبراطورية. هذا سيُقرر هنا.',
        voiceCues: [{ at: 0, voice: 15 }],
      },
      {
        character: 'arius',
        text: 'The Son is not the Father. Truth cannot be voted upon.',
        arabicText: 'الابن ليس الآب. الحقيقة لا يمكن التصويت عليها.',
      },
      {
        character: 'athanasius',
        text: 'What the council decides, God ordains.',
        arabicText: 'ما يقرره المجمع، الله يشرعه.',
      },
      {
        character: 'osiris',
        text: 'And so the story was rewritten by the victors.',
        arabicText: 'وهكذا أُعيدت كتابة القصة من قبل المنتصرين.',
        voiceCues: [{ at: 0, voice: 16 }],
      },
    ],
  },
  'scene-08': {
    id: 'scene-08',
    title: 'Andalusia',
    titleAr: 'الأندلس',
    videoSrc: '/assets/video/video-08-andalusia.mp4',
    imageSrc: '/assets/image/bg-07.jpg',
    bgMusic: '/assets/audio/music/track-14.m4a',
    sceneMusic: '/assets/audio/music/track-01.mp3',
    effect: 'none',
    dialogues: [
      {
        character: 'narrator',
        text: 'Gardens of jasmine and marble courtyards reflected a golden age.',
        arabicText: 'حدائق الياسم وباحات الرخام تعكس عصراً ذهبياً.',
      },
      {
        character: 'abuAbdullah',
        text: 'Weep like a woman for what you could not defend like a man.',
        arabicText: 'ابكِ كامرأة على ما لم تستطع الدفاع عنه كرجل.',
        voiceCues: [{ at: 0, voice: 17 }],
      },
      {
        character: 'osiris',
        text: 'Andalusia was not lost. It was archived.',
        arabicText: 'الأندلس لم تُفقد. لقد أُرشيفت.',
        voiceCues: [{ at: 0, voice: 18 }],
      },
    ],
  },
}

export const SCENE_ORDER = Object.keys(SCENES)

export function getSceneById(id: string): Scene | undefined {
  return SCENES[id]
}

export function getNextSceneId(currentId: string): string | null {
  const idx = SCENE_ORDER.indexOf(currentId)
  if (idx === -1 || idx >= SCENE_ORDER.length - 1) return null
  return SCENE_ORDER[idx + 1]
}

export function getPrevSceneId(currentId: string): string | null {
  const idx = SCENE_ORDER.indexOf(currentId)
  if (idx <= 0) return null
  return SCENE_ORDER[idx - 1]
}
