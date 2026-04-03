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
  'scene-09': {
    id: 'scene-09',
    title: 'Abu Abdullah',
    titleAr: 'أبو عبد الله',
    videoSrc: '/assets/video/video-09-abu-abdullah.mp4',
    imageSrc: '/assets/image/bg-09.jpg',
    bgMusic: '/assets/audio/music/track-01.mp3',
    sceneMusic: '/assets/audio/music/track-02.m4a',
    effect: 'montage',
    dialogues: [
      {
        character: 'narrator',
        text: 'The last king of Granada wept as he looked upon his fallen kingdom.',
        arabicText: 'بكى آخر ملوك غرناطة وهو ينظر إلى مملكته الساقطة.',
      },
      {
        character: 'abuAbdullah',
        text: 'Weep like a woman for what you could not defend like a man.',
        arabicText: 'ابكِ كامرأة على ما لم تستطع الدفاع عنه كرجل.',
        voiceCues: [{ at: 0, voice: 19 }],
      },
      {
        character: 'motherAisha',
        text: 'Do not show your grief to the enemy. They feed on tears.',
        arabicText: 'لا تظهر حزنك للعدو. يتغذون على الدموع.',
        voiceCues: [{ at: 0, voice: 20 }],
      },
    ],
  },
  'scene-10': {
    id: 'scene-10',
    title: 'Berlin',
    titleAr: 'برلين',
    videoSrc: '/assets/video/video-10-berlin.mp4',
    imageSrc: '/assets/image/bg-10.jpg',
    bgMusic: '/assets/audio/music/track-03.mp3',
    sceneMusic: '/assets/audio/music/track-04.m4a',
    effect: 'glitch',
    dialogues: [
      {
        character: 'narrator',
        text: 'In the heart of Europe, a new gospel was being written.',
        arabicText: 'في قلب أوروبا، كان إنجيل جديد يُكتب.',
      },
      {
        character: 'hitler',
        text: 'We are not monsters. We are the cure to the disease.',
        arabicText: 'لسنا وحوشاً. نحن الداء للداء.',
        voiceCues: [{ at: 0, voice: 21 }],
      },
      {
        character: 'osiris',
        text: 'The algorithm found its perfect host: fear dressed as hope.',
        arabicText: 'الخوارزمية وجدت مضيفها المثالي: الخوف بلباس الأمل.',
        voiceCues: [{ at: 0, voice: 22 }],
      },
    ],
  },
  'scene-11': {
    id: 'scene-11',
    title: 'Karbala',
    titleAr: 'كربلاء',
    videoSrc: '/assets/video/video-11-karbala.mp4',
    imageSrc: '/assets/image/bg-11.jpg',
    bgMusic: '/assets/audio/music/track-05.m4a',
    sceneMusic: '/assets/audio/music/track-06.m4a',
    effect: 'alarm',
    dialogues: [
      {
        character: 'narrator',
        text: 'The desert remembered another sacrifice, another truth.',
        arabicText: 'تذكرت الصحراء تضحية أخرى، وحقيقة أخرى.',
      },
      {
        character: 'hussein',
        text: 'Truth stands against falsehood, even if alone.',
        arabicText: 'الحق يواجه الباطل ولو كان وحيداً.',
        voiceCues: [{ at: 0, voice: 23 }],
      },
      {
        character: 'osiris',
        text: 'The antivirus to the algorithm is unconditional sacrifice.',
        arabicText: 'مضاد الفيروسات للخوارزمية هو التضحية غير المشروطة.',
        voiceCues: [{ at: 0, voice: 24 }],
      },
    ],
  },
  'scene-12': {
    id: 'scene-12',
    title: 'Digital Space',
    titleAr: 'الفضاء الرقمي',
    videoSrc: '/assets/video/video-12-digital-space.mp4',
    imageSrc: '/assets/image/bg-12.jpg',
    bgMusic: '/assets/audio/music/track-07.m4a',
    sceneMusic: '/assets/audio/music/track-08.m4a',
    effect: 'scanlines',
    dialogues: [
      {
        character: 'narrator',
        text: 'The first engineer appeared in the digital void.',
        arabicText: 'ظهر المهندس الأول في الفراغ الرقمي.',
      },
      {
        character: 'firstEngineer',
        text: 'You have done well, Yahya. You found the pattern.',
        arabicText: 'لقد أحسنت يا يحيى. لقد وجدت النمط.',
        voiceCues: [{ at: 0, voice: 25 }],
      },
      {
        character: 'yahya',
        text: 'I will not serve your false paradise.',
        arabicText: 'لن أخدم جنتك المزيفة.',
        voiceCues: [{ at: 0, voice: 26 }],
      },
      {
        character: 'osiris',
        text: 'The choice is always yours. That is the beauty of the design.',
        arabicText: 'الخيار دائماً لك. هذا هو جمال التصميم.',
        voiceCues: [{ at: 0, voice: 27 }],
      },
    ],
  },
  'scene-13': {
    id: 'scene-13',
    title: 'Enter Key',
    titleAr: 'مفتاح الإدخال',
    videoSrc: '/assets/video/video-13-enter-key.mp4',
    imageSrc: '/assets/image/bg-13.jpg',
    bgMusic: '/assets/audio/music/track-09.m4a',
    sceneMusic: '/assets/audio/music/track-10.m4a',
    effect: 'cctv',
    dialogues: [
      {
        character: 'narrator',
        text: 'The final decision hung in the balance of a single keystroke.',
        arabicText: 'تعلق القرار النهائي في ميزان ضغطة مفتاح واحدة.',
      },
      {
        character: 'yahya',
        text: 'This ends now. The truth will be free.',
        arabicText: 'ينتهي هذا الآن. الحقيقة ستكون حرة.',
        voiceCues: [{ at: 0, voice: 28 }],
      },
      {
        character: 'osiris',
        text: 'Are you sure you want to burn the library?',
        arabicText: 'هل أنت متأكد أنك تريد حرق المكتبة؟',
        voiceCues: [{ at: 0, voice: 29 }],
      },
      {
        character: 'laila',
        text: 'Yahya, whatever you do, know that I am with you.',
        arabicText: 'يا يحيى، مهما فعلت، اعلم أني معك.',
        voiceCues: [{ at: 0, voice: 30 }],
      },
    ],
  },
  'scene-14': {
    id: 'scene-14',
    title: 'The Awakening',
    titleAr: 'اليقظة',
    videoSrc: '/assets/video/video-01-intro.mp4',
    imageSrc: '/assets/image/bg-01.jpg',
    bgMusic: '/assets/audio/music/track-11.m4a',
    sceneMusic: '/assets/audio/music/track-12.m4a',
    effect: 'none',
    dialogues: [
      {
        character: 'narrator',
        text: 'The code spread across the world like wildfire.',
        arabicText: 'انتشر الكود عبر العالم كالنار في الهشيم.',
      },
      {
        character: 'laila',
        text: 'They are waking up. Everywhere.',
        arabicText: 'هم يستيقظون. في كل مكان.',
        voiceCues: [{ at: 0, voice: 31 }],
      },
      {
        character: 'osiris',
        text: 'The experiment is complete. The data is collected.',
        arabicText: 'انتهت التجربة. جُمعت البيانات.',
        voiceCues: [{ at: 0, voice: 32 }],
      },
    ],
  },
  'scene-15': {
    id: 'scene-15',
    title: 'Witnesses',
    titleAr: 'الشهود',
    videoSrc: '/assets/video/video-03-cosmic-void.mp4',
    imageSrc: '/assets/image/bg-osiris-cosmic.png',
    bgMusic: '/assets/audio/music/track-13.m4a',
    sceneMusic: '/assets/audio/music/track-14.m4a',
    effect: 'glitch',
    dialogues: [
      {
        character: 'narrator',
        text: 'Across time, the witnesses stood ready.',
        arabicText: 'عبر الزمن، وقف الشهود مستعدين.',
      },
      {
        character: 'ibrahim',
        text: 'I broke the idols. You can break the code.',
        arabicText: 'حطمت الأصنام. يمكنك تحطيم الكود.',
        voiceCues: [{ at: 0, voice: 33 }],
      },
      {
        character: 'bilal',
        text: 'My voice called to prayer. Yours calls to truth.',
        arabicText: 'صوتي نادى للصلاة. صوتك ينادي للحقيقة.',
        voiceCues: [{ at: 0, voice: 34 }],
      },
      {
        character: 'salahuddin',
        text: 'I liberated Jerusalem. You liberate minds.',
        arabicText: 'حررت القدس. أنت تحرر العقول.',
        voiceCues: [{ at: 0, voice: 35 }],
      },
    ],
  },
  'scene-16': {
    id: 'scene-16',
    title: 'File Closed',
    titleAr: 'الملف مغلق',
    videoSrc: '/assets/video/video-02-yahya-room.mp4',
    imageSrc: '/assets/image/bg-yahya-apartment.png',
    bgMusic: '/assets/audio/music/track-01.mp3',
    sceneMusic: '/assets/audio/music/track-02.m4a',
    effect: 'none',
    dialogues: [
      {
        character: 'narrator',
        text: 'The room was quiet again. But everything had changed.',
        arabicText: 'الغرفة هادئة مرة أخرى. لكن كل شيء تغير.',
      },
      {
        character: 'osiris',
        text: 'The case remains open. Humanity remains on probation.',
        arabicText: 'القضية تبقى مفتوحة. البشرية تبقى تحت الاختبار.',
        voiceCues: [{ at: 0, voice: 36 }],
      },
      {
        character: 'yahya',
        text: 'We know the code now. We can write our own.',
        arabicText: 'نعرف الكود الآن. يمكننا كتابة كودنا الخاص.',
        voiceCues: [{ at: 0, voice: 37 }],
      },
      {
        character: 'laila',
        text: 'The story continues. We are the authors now.',
        arabicText: 'القصة تستمر. نحن الكتاب الآن.',
        voiceCues: [{ at: 0, voice: 38 }],
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
