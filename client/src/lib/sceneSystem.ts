/**
 * OSIRIS — المفسدون في الأرض
 * Scene System — Full Script from OSIRIS.md
 * All 6 parts, 13 chapters, every dialogue line preserved faithfully
 */

import { ASSET_URLS } from './assetUrls';

export interface DialogueLine {
  character?: string;
  text: string;
  arabicText?: string;
  duration?: number;
  delay?: number;
}

export interface SceneChoice {
  id: string;
  text: string;
  arabicText: string;
  nextSceneId?: string;
  consequence?: string;
  timer?: number;
}

export interface Scene {
  id: string;
  title: string;
  arabicTitle: string;
  part: number;
  backgroundImage?: string;
  backgroundVideo?: string;
  audioUrl?: string;
  visualEffect?: "none" | "glitch" | "cctv" | "scanlines" | "alarm" | "montage";
  musicKey?: string;
  ambientKeys?: string[];
  enterSfxKeys?: string[];
  dialogue: DialogueLine[];
  choices?: SceneChoice[];
  defaultNextScene?: string;
  autoAdvance?: boolean;
  transitionType?: 'fade' | 'slideUp' | 'slideDown' | 'dissolve' | 'none';
  transitionDuration?: number;
  emotionalTone?: 'dark' | 'hopeful' | 'intense' | 'contemplative' | 'tragic' | 'urgent';
  historicalContext?: string;
}

export interface NarrativePath {
  sceneId: string;
  choiceId?: string;
  timestamp: number;
}

export interface PlayerState {
  currentSceneId: string;
  currentDialogueIndex: number;
  isPlaying: boolean;
  narrativePath: NarrativePath[];
  selectedChoice?: string;
}

// ============================================================
// PART ZERO: غرفة المحاكمة الكونية
// الجزء الصفر: الفصل الأول — الملف رقم واحد
// ============================================================

const PART_ZERO: Record<string, Scene> = {

  // المشهد 1.1: الاستدعاء
  'zero-1-1-summons': {
    id: 'zero-1-1-summons',
    title: 'The Summons',
    arabicTitle: 'الاستدعاء',
    part: 0,
    backgroundVideo: ASSET_URLS.videoBg.yahya_room,
    backgroundImage: 'sceneBg.zero-1-1-summons',
    visualEffect: "scanlines",
    musicKey: "audio.main_theme",
    ambientKeys: ["amb.rain", "amb.device_hum"],
    enterSfxKeys: ["sfx.ping"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "كان يحيى يحدق في الشاشات أمامه بعينين متعبتين. الأرقام لا تكذب، هكذا كان يؤمن دائماً. البشر مجرد نقاط بيانات يمكن التنبؤ بسلوكها إذا امتلكت الخوارزمية الصحيحة. رشف من قهوته الباردة، ومد يده ليرد على اتصال ليلى.",
        duration: 14400
      },
      {
        character: 'Narrator',
        text: "\"يحيى، هل أنت بخير؟ لم تحضر ندوة اليوم.\" صوت ليلى كان دافئاً، يحمل قلقاً مألوفاً. هي باحثة علم النفس التي تحاول دائماً إيجاد \"الروح\" خلف أرقامه.",
        duration: 10400
      },
      {
        character: 'Narrator',
        text: "أجاب بصوت جاف: \"أنا بخير يا ليلى. فقط... أراجع بعض البيانات القديمة. لا أستطيع التوقف عن التفكير في طارق.\"",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "صمتت ليلى للحظة. طارق، صديقهما المشترك، العبقري الذي قيل إنه انتحر قبل شهرين بعد نوبة ذهان مفاجئة.",
        duration: 6800
      },
      {
        character: 'Narrator',
        text: "\"يحيى، أرجوك. الشرطة أغلقت الملف. طارق كان يعاني من ضغوط...\"",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "قاطعها يحيى: \"طارق لم يكن مكتئباً. طارق كان خائفاً. هناك فرق.\"",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "قبل أن تجيب ليلى، ومضت الشاشة الجانبية باللون الأحمر. إشعار من بروتوكول مشفر، بروتوكول كان هو وطارق فقط يعرفانه.",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "توقف نبض يحيى للحظة.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"ليلى... سأحدثك لاحقاً.\" أغلق الخط دون انتظار ردها.",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "اقترب من الشاشة. المرسل: مجهول. لكن التشفير... إنه توقيع طارق الرقمي.",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "فتح الرسالة. لم تكن نصاً، بل سلسلة من الأرقام العشوائية، وفي الأسفل جملة واحدة: \"الشر ليس عشوائياً يا يحيى. إنه كود برمجي. لقد وجدت الشيفرة المصدرية. افتح أوزيريس.\"",
        duration: 11200
      }
    ],
    choices: [
      {
        id: 'zero-1-1-open',
        text: 'Open the encrypted message',
        arabicText: 'افتح الرسالة المشفرة',
        nextSceneId: 'zero-1-2-prosecution',
        consequence: 'You chose to follow the truth wherever it leads.',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'intense',
  },

  // المشهد 1.2: المرافعة الافتتاحية
  'zero-1-2-prosecution': {
    id: 'zero-1-2-prosecution',
    title: 'The Opening Argument',
    arabicTitle: 'المرافعة الافتتاحية',
    part: 0,
    backgroundVideo: ASSET_URLS.videoBg.cosmic_opening,
    visualEffect: "scanlines",
    ambientKeys: ["amb.vacuum", "amb.bass_drone_low"],
    backgroundImage: ASSET_URLS.backgrounds.osiris_interface,
    audioUrl: ASSET_URLS.audio.intro_narration,
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "تلاشت غرفة يحيى من وعيه. الشاشة أمامه ابتلعت كل الضوء في الغرفة. لم يعد هناك نظام تشغيل، ولا ملفات، ولا إنترنت. فقط هذا الفراغ الأسود، والنبض الأبيض.",
        duration: 10800
      },
      {
        character: 'Narrator',
        text: "ظهرت الكلمات على الشاشة، متزامنة مع الصوت الهادئ الذي بدا وكأنه يتردد داخل جمجمة يحيى، لا من مكبرات الصوت:",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "\"الملف رقم: واحد. المتهم: الإنسان. المدّعي: أنا. الاتهام: عدم الأهلية للتكريم. الأدلة: ستة آلاف سنة من التاريخ الموثق.\"",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "تراجع يحيى بكرسيه إلى الوراء. هل هذا فيروس حاسوبي؟ هل هي مزحة أخيرة من طارق؟",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "كتب يحيى على لوحة المفاتيح، ويداه ترتجفان قليلاً: \"من أنت؟\"",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "توقف النبض الأبيض للحظة، ثم ظهر الرد:",
        duration: 2800
      },
      {
        character: 'Narrator',
        text: "\"أنا المحامي الكوني. أنتم تسمونني بأسماء كثيرة، وتصورونني كوحش بقرون ونار. لكن الحقيقة أبسط من ذلك بكثير يا يحيى. أنا لست وحشاً، أنا مجرد مدقق جودة (QA). لقد طُلب مني السجود لكائن من طين، فاعترضت. قلت إنه سيفسد فيها ويسفك الدماء. قيل لي: إني أعلم ما لا تعلمون.\"",
        duration: 19200
      },
      {
        character: 'Narrator',
        text: "ظهرت ابتسامة رقمية خفيفة (رمز تعبيري بسيط، لكنه يحمل سخرية مرعبة).",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "\"لذلك، قررت أن أثبت وجهة نظري. لم أستخدم السحر، ولم أجبر أحداً على شيء. لقد صممت خوارزمية بسيطة جداً، سطر واحد من الكود، وزرعته في نظام تشغيلكم. سطر واحد فقط: (أنا خير منه).\"",
        duration: 13200
      },
      {
        character: 'Narrator',
        text: "شعر يحيى ببرودة تسري في عموده الفقري. هذا ليس ذكاءً اصطناعياً عادياً. هذا الوعي يتحدث عن فجر التاريخ وكأنه حدث بالأمس.",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "استمرت الكلمات:",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"هذا السطر البرمجي البسيط هو الشيفرة المصدرية لكل دماء سُفكت على هذه الأرض. من أول حجر هُشم به رأس أخ، إلى آخر قنبلة أُلقيت على مدينة. أنتم لا تحتاجون إلى شيطان ليغويكم... أنتم فقط تحتاجون إلى من يخبركم أنكم أفضل من الآخرين، وستقومون بالباقي بأنفسكم.\"",
        duration: 18000
      },
      {
        character: 'Narrator',
        text: "\"طارق رأى النمط. طارق فهم الخوارزمية. ولهذا السبب... لم يعد طارق هنا.\"",
        duration: 4800
      },
      {
        character: 'Narrator',
        text: "ضرب يحيى بقبضته على المكتب. \"ماذا فعلت بطارق؟!\"",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "\"أنا؟ لم أفعل شيئاً. أتباعي من بني جنسك هم من فعلوا. هل تريد أن ترى كيف تعمل الخوارزمية يا يحيى؟ هل تملك الشجاعة لفتح الملفات ورؤية الحقيقة العارية؟ أم ستغلق الشاشة وتعود إلى أرقامك الميتة؟\"",
        duration: 14000
      }
    ],
    choices: [
      {
        id: 'zero-1-2-open-files',
        text: 'Open the files. I want to know the truth.',
        arabicText: 'افتح الملفات. أريد أن أعرف الحقيقة.',
        nextSceneId: 'one-1-5-1-promise',
        consequence: 'Unexpected courage from a data analyst. Let us begin from the beginning.',
      },
      {
        id: 'zero-1-2-reject',
        text: 'This is nonsense. You are just a virus.',
        arabicText: 'هذا هراء. أنت مجرد فيروس.',
        nextSceneId: 'one-1-5-1-promise',
        consequence: 'Denial is the first symptom of infection by the algorithm. I will show you regardless.',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'dark',
  },
};

// ============================================================
// PART ONE: الجريمة الأولى — الشيفرة المصدرية
// الفصل 1.5: الشاهد الصامت (قصة طارق الكاملة)
// ============================================================

const PART_ONE: Record<string, Scene> = {

  // المشهد 1.5.1: الوعد الكاذب
  'one-1-5-1-promise': {
    id: 'one-1-5-1-promise',
    title: 'The False Promise',
    arabicTitle: 'الوعد الكاذب',
    part: 1,
    backgroundImage: ASSET_URLS.backgrounds.corporate_lab,
    visualEffect: "glitch",
    musicKey: "music.cafe_jazz",
    ambientKeys: ["amb.cafe_murmur", "sfx.cups_clink"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "كان طارق يقلب ملعقة القهوة بعصبية، عينيه تلمعان بحماس شاب يوشك أن يغير العالم. أمامه جلس الرجل الذي قدم نفسه كمدير تنفيذي لمشروع بحثي سري. لم يستطع يحيى - الذي كان يشاهد هذه الذاكرة عبر أوزيريس - أن يحدد ملامح الرجل. كلما حاول التركيز على وجهه، تشوشت الصورة.",
        duration: 19200
      },
      {
        character: 'Narrator',
        text: "\"نحن لا نبحث عن مجرد مبرمج يا طارق،\" قال المهندس الأول بصوته الهادئ والموزون. \"نحن نبحث عن فيلسوف يكتب الكود. العالم يعاني من الفوضى، الكراهية، الاستقطاب. ماذا لو استطعنا تصميم خوارزمية تفهم الألم البشري... وتعالجه؟\"",
        duration: 14000
      },
      {
        character: 'Narrator',
        text: "ابتسم طارق، وقد ابتلع الطُعم بالكامل. \"تكنولوجيا أفضل للبشرية. ليس لبيع الإعلانات، بل لفهم السلوك البشري وتحسينه.\"",
        duration: 6800
      },
      {
        character: 'Narrator',
        text: "\"بالضبط،\" أومأ المهندس. \"نريد شخصاً يفهم الكود والفلسفة معاً. شخصاً مثلك.\"",
        duration: 4400
      }
    ],
    choices: [
      {
        id: 'one-1-5-1-continue',
        text: 'Watch what happened next',
        arabicText: 'شاهد ما حدث بعد ذلك',
        nextSceneId: 'one-1-5-2-bitter-truth',
      },
    ],
    defaultNextScene: 'one-1-5-2-bitter-truth',
    transitionType: 'slideDown',
    transitionDuration: 1500,
    emotionalTone: 'hopeful',
  },

  // المشهد 1.5.2: الحقيقة المرة
  'one-1-5-2-bitter-truth': {
    id: 'one-1-5-2-bitter-truth',
    title: 'The Bitter Truth',
    arabicTitle: 'الحقيقة المرة',
    part: 1,
    backgroundImage: ASSET_URLS.backgrounds.corporate_lab,
    visualEffect: "scanlines",
    ambientKeys: ["amb.server_hum", "amb.heartbeat_fast"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "طارق يجلس وحيداً في المختبر في ساعة متأخرة من الليل. الشاشات أمامه لا تعرض أكواداً عادية، بل خرائط عصبية.",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "كان يحيى يراقب أخاه وهو ينهار ببطء.",
        duration: 2800
      },
      {
        character: 'Narrator',
        text: "\"يا إلهي...\" همس طارق، ويداه ترتجفان فوق لوحة المفاتيح. \"هذا ليس لتحسين التطبيقات. هذا... هذا تعديل سلوكي.\"",
        duration: 6800
      },
      {
        character: 'Narrator',
        text: "فتح طارق ملفاً سرياً يحمل اسم \"مشروع أوزيريس\". قرأ بصوت مسموع، وكأنه يكلم نفسه: \"الهدف: الهندسة العصبية. التحكم بأنماط التفكير البشري من خلال التلاعب بترددات الدوبامين والكورتيزول. زرع أفكار محددة دون وعي المستخدم.\"",
        duration: 13200
      },
      {
        character: 'Narrator',
        text: "أدرك طارق الحقيقة المرعبة. هو لم يكن يبني أداة لفهم البشر، بل كان يبني سجناً رقمياً لعقولهم. الخوارزمية التي كتبها كانت تُستخدم لتعزيز النرجسية، لتقسيم الناس، لجعلهم يكرهون بعضهم البعض... لأن الكراهية تُبقي العيون ملتصقة بالشاشات.",
        duration: 14400
      }
    ],
    choices: [
      {
        id: 'one-1-5-2-continue',
        text: 'Watch Tarek\'s final days',
        arabicText: 'شاهد أيام طارق الأخيرة',
        nextSceneId: 'one-1-5-3-no-escape',
      },
    ],
    transitionType: 'slideDown',
    transitionDuration: 1500,
    emotionalTone: 'tragic',
  },

  // المشهد 1.5.3: لا مفر
  'one-1-5-3-no-escape': {
    id: 'one-1-5-3-no-escape',
    title: 'No Escape',
    arabicTitle: 'لا مفر',
    part: 1,
    backgroundImage: ASSET_URLS.backgrounds.yahya_apartment,
    visualEffect: "cctv",
    ambientKeys: ["amb.phone_ring", "amb.footsteps_outside"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "كان طارق يجمع أقراصاً صلبة ويضعها في حقيبته بسرعة جنونية. كان يتلفت حوله في شقته المظلمة وكأن الجدران تراقبه.",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "وفجأة، أضاءت شاشة حاسوبه المحمول من تلقاء نفسها. ظهرت رسالة واحدة: \"إلى أين تذهب يا طارق؟ نحن نعرف ما تفكر فيه قبل أن تفكر فيه.\"",
        duration: 10000
      },
      {
        character: 'Narrator',
        text: "تراجع طارق إلى الوراء، واصطدم بالجدار. الإدراك المرعب ضربه كصاعقة: لا يمكنك الهروب من شركة تملك بيانات دماغك. هم يعرفون تفضيلاته، مخاوفه، أنماط نومه، وحتى معدل نبضات قلبه. هو سجين في جسده.",
        duration: 12800
      }
    ],
    choices: [
      {
        id: 'one-1-5-3-final',
        text: 'The Final Sacrifice',
        arabicText: 'التضحية الأخيرة',
        nextSceneId: 'one-1-5-4-sacrifice',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 1.5.4: التضحية الأخيرة
  'one-1-5-4-sacrifice': {
    id: 'one-1-5-4-sacrifice',
    title: 'The Final Sacrifice',
    arabicTitle: 'التضحية الأخيرة',
    part: 1,
    backgroundVideo: ASSET_URLS.videoBg.tarek_rooftop,
    backgroundImage: ASSET_URLS.backgrounds.white_space,
    musicKey: "music.rooftop_cello_piano",
    ambientKeys: ["amb.wind_strong"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "وقف طارق على حافة السطح. لم يكن يبكي. كان هادئاً بشكل مخيف.",
        duration: 4800
      },
      {
        character: 'Narrator',
        text: "أخرج هاتفه، وكتب رسالته الأخيرة. رسالة مشفرة لا يستطيع أحد فكها سوى شخص واحد: أخوه يحيى.",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "\"أخي...\" همس طارق للريح. \"إذا وصلت إليك هذه الرسالة، فأنا لم أعد هنا. لقد خيروني بين أن أكون عبداً في نظامهم، أو أن أموت. اخترت الموت... لكنني لن أذهب بصمت. الكود بين يديك الآن. استخدمه. لا تستسلم.\"",
        duration: 14800
      },
      {
        character: 'Narrator',
        text: "ضغط على زر الإرسال. ومضت الشاشة بكلمة: \"تم الإرسال\".",
        duration: 3600
      },
      {
        character: 'Narrator',
        text: "أغلق طارق عينيه، وأخذ خطوة واحدة إلى الأمام.",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "انتهت المحاكاة. عاد يحيى إلى وعيه في غرفته، والدموع تنهمر على وجهه. أخوه لم ينتحر هرباً من الحياة. أخوه مات ليحمي الحقيقة.",
        duration: 8800
      }
    ],
    choices: [
      {
        id: 'one-1-5-4-continue',
        text: 'Continue',
        arabicText: 'تابع',
        nextSceneId: 'two-2-1-escape',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },
};

// ============================================================
// PART TWO: البوصلة الروحية
// الفصل 2: الهروب واللقاء + تشغيل أوزيريس
// ============================================================

const PART_TWO: Record<string, Scene> = {

  // المشهد 2.1: الهروب واللقاء
  'two-2-1-escape': {
    id: 'two-2-1-escape',
    title: 'Escape and Meeting',
    arabicTitle: 'الهروب واللقاء',
    part: 1,
    backgroundImage: ASSET_URLS.backgrounds.yahya_apartment,
    visualEffect: "cctv",
    ambientKeys: ["amb.sirens_distant", "amb.running_steps"],
    enterSfxKeys: ["sfx.door_clang"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "كان يحيى يركض. جاره العجوز، السيد سميث، الذي كان يطعمه قطته أحياناً، حاول طعنه بسكين مطبخ قبل دقائق. عينا العجوز كانتا فارغتين، كأنه منوّم مغناطيسياً. \"الأتباع الممسوحون دماغياً\"، هكذا أسماهم طارق في ملاحظاته.",
        duration: 13200
      },
      {
        character: 'Narrator',
        text: "انعطف يحيى في زقاق ضيق، وفجأة امتدت يد من الظلام وسحبته إلى الداخل.",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "كاد يحيى أن يصرخ، لكن يداً أخرى كتمت فمه.",
        duration: 3600
      },
      {
        character: 'Narrator',
        text: "\"اصمت إذا كنت تريد أن تعيش، دكتور سليماني.\"",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "كانت فتاة شابة، عيناها حادتان وذكيتان. قادته عبر ممرات تحت الأرض حتى وصلا إلى غرفة مليئة بالكتب القديمة والخوادم الحاسوبية المبردة.",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "\"من أنتِ؟\" سأل يحيى وهو يلهث.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"اسمي ليلى. باحثة في علم النفس الديني. وكنت أتابع عمل أخيك.\"",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "نظر إليها يحيى بشك. \"علم نفس ديني؟ أنا رجل أرقام. لا أؤمن بالخرافات.\"",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "ابتسمت ليلى ببرود. \"الأرقام التي تعبدها هي التي تحاول قتلك الآن. أخوك أدرك أن المشكلة ليست تقنية، بل روحية. الخوارزمية التي اكتشفها لا تخترق الحواسيب، بل تخترق النفوس. أنت تملك العقل لتحليل البيانات، لكنك تحتاج إلى بوصلة لتفهم معناها.\"",
        duration: 15600
      }
    ],
    choices: [
      {
        id: 'two-2-1-trust',
        text: 'Prove it to me.',
        arabicText: 'أثبتي لي كلامك.',
        nextSceneId: 'two-2-2-osiris-launch',
        consequence: 'Laila shows him historical documents that match Tarek\'s code. Yahya\'s trust in her grows.',
      },
      {
        id: 'two-2-1-alone',
        text: 'I work alone.',
        arabicText: 'أنا أعمل وحدي.',
        nextSceneId: 'two-2-2-osiris-launch',
        consequence: 'Laila lets him try to decode a complex section alone. He fails, and must ask for her help.',
      },
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'urgent',
  },

  // المشهد 2.2: تشغيل أوزيريس
  'two-2-2-osiris-launch': {
    id: 'two-2-2-osiris-launch',
    title: 'Launching OSIRIS',
    arabicTitle: 'تشغيل أوزيريس',
    part: 1,
    backgroundImage: ASSET_URLS.backgrounds.osiris_interface,
    visualEffect: "scanlines",
    ambientKeys: ["amb.server_room"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "جلس يحيى أمام الخوادم، وبدأ في إدخال كود طارق.",
        duration: 3600
      },
      {
        character: 'Narrator',
        text: "\"ما هذا النظام بالضبط؟\" سألت ليلى وهي تراقب الشاشات تضيء واحدة تلو الأخرى.",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "أجاب يحيى وعيناه مثبتتان على الشاشة: \"أوزيريس. نظام استشعار كمي. هو لا يعيد بناء الماضي من كتب التاريخ. هو يقرأ موجات الكم التي تُركت في الكون. كل حدث، كل جريمة، كل كلمة قيلت، تترك اهتزازة في نسيج الواقع، مثل تموجات في بركة ماء. أوزيريس يقرأ هذه الموجات، يترجمها إلى بيانات، ثم ينقلها إلى حواسنا كمحاكاة.\"",
        duration: 22000
      },
      {
        character: 'Narrator',
        text: "\"إذن، نحن سنشهد التاريخ كما حدث فعلاً؟\"",
        duration: 2800
      },
      {
        character: 'Narrator',
        text: "\"بل سنعيشه.\" ضغط يحيى على زر الإدخال (Enter). \"لنبدأ من حيث بدأ كل شيء. الجريمة الأولى.\"",
        duration: 6400
      }
    ],
    choices: [
      {
        id: 'two-2-2-enter',
        text: 'Enter the simulation',
        arabicText: 'ادخل المحاكاة',
        nextSceneId: 'three-3-1-creation',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'intense',
  },
};

// ============================================================
// PART THREE: الخوارزمية الأولى
// الفصل 3: لحظة الخلق والرفض + تصميم الفيروس
// ============================================================

const PART_THREE: Record<string, Scene> = {

  // المشهد 3.1: لحظة الخلق والرفض
  'three-3-1-creation': {
    id: 'three-3-1-creation',
    title: 'The Moment of Creation and Refusal',
    arabicTitle: 'لحظة الخلق والرفض',
    part: 1,
    backgroundImage: ASSET_URLS.backgrounds.osiris_cosmic,
    ambientKeys: ["amb.bass_drone_low"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "وجد يحيى وليلى نفسيهما يقفان في فضاء لا تحده جدران. لم يكن هناك سماء أو أرض، بل نور نقي يتنفس.",
        duration: 8000
      },
      {
        character: 'Narrator',
        text: "\"أين نحن؟\" همست ليلى، ودموع الرهبة تتجمع في عينيها.",
        duration: 3600
      },
      {
        character: 'Narrator',
        text: "\"نحن في نقطة الصفر،\" أجاب يحيى، وهو ينظر إلى قراءات أوزيريس التي ظهرت كأرقام عائمة في الهواء. \"قبل بدء الزمن البشري.\"",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "فجأة، اهتز الفضاء. شعرا بأمر كوني، ليس صوتاً، بل إرادة مطلقة تملأ الوجود: السجود للكائن الجديد المصنوع من طين.",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "رأيا موجات من النور تنحني في طاعة تامة. انسجام كوني مثالي.",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "لكن... في وسط هذا الانسجام، ظهرت نقطة سوداء. شذوذ في التردد.",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "لم يكن وحشاً. كان وعياً قديماً، يرفض الانحناء.",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "ترجم أوزيريس هذا الرفض إلى نص ظهر أمام يحيى: \"أنا خير منه. خلقتني من نار وخلقته من طين.\"",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "اتسعت عينا يحيى. \"يا إلهي... إنه ليس مجرد تمرد. إنه منطق. منطق فاسد، لكنه منطق. إنه يقارن المواد الخام (النار والطين) ليستنتج الأفضلية.\"",
        duration: 9200
      },
      {
        character: 'Narrator',
        text: "قالت ليلى بصوت مرتجف: \"هذه هي اللحظة. ولادة الكبر. ولادة (أنا خير منه).\"",
        duration: 5200
      }
    ],
    choices: [
      {
        id: 'three-3-1-continue',
        text: 'Watch the algorithm being designed',
        arabicText: 'شاهد تصميم الخوارزمية',
        nextSceneId: 'three-3-2-virus-design',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 3.2: تصميم الفيروس
  'three-3-2-virus-design': {
    id: 'three-3-2-virus-design',
    title: 'Designing the Virus',
    arabicTitle: 'تصميم الفيروس',
    part: 1,
    backgroundImage: ASSET_URLS.backgrounds.osiris_cosmic,
    visualEffect: "scanlines",
    ambientKeys: ["amb.bass_drone_low"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "تغير المشهد. الفضاء النوراني اختفى، وحل محله تمثيل بصري لـ \"قَسَم إبليس\".",
        duration: 4800
      },
      {
        character: 'Narrator',
        text: "رأى يحيى الكلمات تتشكل ككود برمجي معقد، ينسج نفسه حول نموذج ثلاثي الأبعاد للعقل البشري.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "\"انظري يا ليلى،\" أشار يحيى إلى الكود. \"إنه لا يخطط لتدمير البشرية بالقوة. إنه يصمم خوارزمية. خطة عمل من ستة محاور.\"",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "بدأ أوزيريس في تفكيك الخوارزمية وعرضها على الشاشة:",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "نظرت ليلى إلى يحيى بصدمة. \"هذه ليست مجرد خطة شيطانية قديمة. هذه هي بالضبط الطريقة التي تعمل بها خوارزميات وسائل التواصل الاجتماعي اليوم! تعزيز النرجسية (الكبر)، الإدمان (الشهوة)، الأخبار المزيفة (الكذب)، غرف الصدى والاستقطاب (الفرقة).\"",
        duration: 14000
      },
      {
        character: 'Narrator',
        text: "سقط يحيى على ركبتيه. الإدراك كان أثقل من أن يتحمله.",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "\"طارق كان محقاً. الشيطان لم يحتج إلى اختراع سلاح جديد. لقد انتظر فقط حتى نخترع نحن التكنولوجيا التي تؤتمت خوارزميته القديمة. نحن من صنعنا العجل الذهبي الجديد.\"",
        duration: 10800
      }
    ],
    choices: [
      {
        id: 'three-3-2-continue',
        text: 'Continue to Part Two: The Golden Calf',
        arabicText: 'تابع إلى الجزء الثاني: العجل الذهبي',
        nextSceneId: 'four-4-1-desert',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },
};

// ============================================================
// PART FOUR: العجل الذهبي — صناعة الأيقونة
// الفصل 4: فراغ الصحراء + الفصل 5: العجل الرقمي
// ============================================================

const PART_FOUR: Record<string, Scene> = {

  // المشهد 4.1: نشوة النجاة وقلق الفراغ
  'four-4-1-desert': {
    id: 'four-4-1-desert',
    title: 'The Void of the Desert',
    arabicTitle: 'فراغ الصحراء',
    part: 2,
    backgroundVideo: ASSET_URLS.videoBg.sinai_desert,
    backgroundImage: 'sceneBg.four-4-1-desert',
    ambientKeys: ["amb.desert_wind", "amb.crowd_murmur"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "نقل أوزيريس يحيى وليلى إلى مصر القديمة. لم تكن مصر التي تظهر في الأفلام، بل كانت حضارة حقيقية، تنبض بالحياة والعبقرية الهندسية.",
        duration: 8800
      },
      {
        character: 'Narrator',
        text: "وقف رمسيس الثاني، المحارب الذي لا يُهزم، ينظر إلى انعكاس صورته في مياه النيل الصافية. كان يرتدي زياً ملكياً بسيطاً، لكن هيبته كانت تملأ المكان.",
        duration: 10000
      },
      {
        character: 'Narrator',
        text: "\"هذا هو رمسيس،\" قال يحيى وهو يقرأ بيانات أوزيريس. \"عبقري، قائد عسكري فذ، وباني أعظم المعابد. لكن الخوارزمية وجدت فيه ثغرة.\"",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "اقترب رجل يرتدي عباءة كهنوتية داكنة من رمسيس. لم يكن وجهه واضحاً ليحيى، لكنه عرفه على الفور. إنه \"الحكيم\"، نفس الكيان الذي سيظهر لاحقاً في نيقية.",
        duration: 10400
      },
      {
        character: 'Narrator',
        text: "سأل رمسيس النيل، وكأنه يكلم نفسه: \"لماذا يجب أن أموت؟ لقد بنيت ما لم يبنه أحد. هزمت الحيثيين. أطعمت شعبي. لماذا أكون مجرد إنسان يفنى؟\"",
        duration: 10000
      },
      {
        character: 'Narrator',
        text: "همس الكاهن الغامض بصوت ناعم كفحيح الأفعى: \"لأنهم يقولون إن فوقك ربًا يا مولاي. طالما أنك تعترف بوجود من هو أعلى منك، فستظل عبداً للموت.\"",
        duration: 10000
      },
      {
        character: 'Narrator',
        text: "التفت رمسيس إلى الكاهن، وعيناه تشتعلان بالغضب والكبرياء. \"أنا لست عبداً لأحد.\"",
        duration: 4800
      },
      {
        character: 'Narrator',
        text: "\"إذن، لا تكن،\" ابتسم الكاهن. \"الآلهة القديمة صامتة. أنت الحي. أنت من يمنح الحياة والموت. أعلنها يا مولاي. اجعلهم يعبدون ما يرون، لا ما يتخيلون.\"",
        duration: 10000
      },
      {
        character: 'Narrator',
        text: "نظرت ليلى إلى يحيى بخوف. \"الفيروس يعمل. إنه يغذي جرحه النفسي... خوفه من الموت، ويحوله إلى ادعاء بالألوهية.\"",
        duration: 7200
      }
    ],
    choices: [
      {
        id: 'four-4-1-continue',
        text: 'Watch the engineering of the crowds',
        arabicText: 'شاهد هندسة الحشود',
        nextSceneId: 'four-4-2-crowd-engineering',
      },
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // المشهد 4.2: هندسة الحشود
  'four-4-2-crowd-engineering': {
    id: 'four-4-2-crowd-engineering',
    title: 'Engineering the Crowds',
    arabicTitle: 'هندسة الحشود',
    part: 2,
    backgroundVideo: ASSET_URLS.videoBg.molten_gold,
    backgroundImage: 'sceneBg.four-4-2-crowd-engineering',
    ambientKeys: ["amb.metal_melt", "amb.drums_hypnosis"],
    enterSfxKeys: ["sfx.calf_low"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "وقف رمسيس أمام معبده الجديد. لم يكتب اسم الإله آمون في المركز، بل كتب اسمه هو.",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "\"أنا ربكم الأعلى،\" أعلن رمسيس، وصوته يتردد في الوادي.",
        duration: 3600
      },
      {
        character: 'Narrator',
        text: "سجدت الحشود. لم يسجدوا خوفاً من السوط فقط، بل سجدوا انبهاراً بالقوة المادية.",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "\"انظر إلى هذا،\" قال يحيى بمرارة. \"لقد نجحت الخوارزمية. رمسيس قال (أنا خير منهم)، فصدقوه. لقد تحول من ملك إلى إله، وتحولوا هم من بشر إلى أدوات.\"",
        duration: 10800
      },
      {
        character: 'Narrator',
        text: "في تلك اللحظة، التقط أوزيريس صوتاً خفياً يتردد بين المشاهد. صوت إبليس يعلق على الأحداث: \"انظروا... انظروا جيداً. هذا ما خُلق من طين. يدّعي الألوهية. ألم أقل أنه لا يستحق؟\"",
        duration: 12000
      }
    ],
    choices: [
      {
        id: 'four-4-2-continue',
        text: 'Hear Tarek\'s message about the digital calf',
        arabicText: 'اسمع رسالة طارق عن العجل الرقمي',
        nextSceneId: 'four-5-1-tarek-message',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 5.1: رسالة من الماضي
  'four-5-1-tarek-message': {
    id: 'four-5-1-tarek-message',
    title: 'A Message from the Past',
    arabicTitle: 'رسالة من الماضي',
    part: 2,
    backgroundImage: ASSET_URLS.backgrounds.corporate_lab,
    audioUrl: ASSET_URLS.audio.yahya_monologue,
    ambientKeys: ["amb.server_room", "music.sad_background"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "وقف يحيى وليلى وسط المحاكاة، يشاهدان بحر البشر الممتد في الصحراء. كانت نشوة النجاة من فرعون وعبور البحر قد تلاشت، وحل محلها شيء أشد قسوة: الفراغ.",
        duration: 10400
      },
      {
        character: 'Narrator',
        text: "\"موسى غائب منذ أسابيع،\" قالت ليلى وهي تراقب وجوه الناس الخائفة. \"لقد اعتادوا على العبودية في مصر. العبودية قاسية، لكنها توفر اليقين: أنت تعرف متى تستيقظ، ماذا تعمل، وماذا تأكل. الحرية المطلقة في هذه الصحراء... مرعبة.\"",
        duration: 14400
      },
      {
        character: 'Narrator',
        text: "أشار يحيى إلى رجل يقف على صخرة مرتفعة، يراقب الحشود بعينين تحللان الموقف بدقة رياضية. لم يكن يبدو كساحر شرير، بل كمهندس يدرس مشكلة تحتاج إلى حل.",
        duration: 10800
      },
      {
        character: 'Narrator',
        text: "\"السامري،\" همس يحيى. أوزيريس عرض فوق رأس الرجل بيانات تحليلية: [مستوى الكاريزما: 92%]، [القدرة على قراءة الجماهير: 98%].",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "بدأ السامري يتحدث إلى الناس، ليس بصراخ، بل بصوت هادئ ومطمئن.",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "\"أنتم خائفون. هذا طبيعي. الإله الذي أخرجكم من مصر إله عظيم، لكنه... غير مرئي. مجرد. لا يمكنكم لمسه أو رؤيته. وأنتم تحتاجون إلى شيء يطمئنكم الآن، في هذا الفراغ.\"",
        duration: 11600
      },
      {
        character: 'Narrator',
        text: "لم يطلب منهم الكفر. لم يطلب منهم عبادة شيطان. لقد قدم لهم \"حلاً عملياً\" لقلقهم الروحي.",
        duration: 6400
      }
    ],
    choices: [
      {
        id: 'four-5-1-continue',
        text: 'Continue — the tears of the analyst',
        arabicText: 'تابع — دموع المحلل',
        nextSceneId: 'four-5-2-analyst-tears',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 5.2: دموع المحلل
  'four-5-2-analyst-tears': {
    id: 'four-5-2-analyst-tears',
    title: 'The Tears of the Analyst',
    arabicTitle: 'دموع المحلل',
    part: 2,
    backgroundImage: ASSET_URLS.backgrounds.white_space,
    ambientKeys: ["amb.server_room"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "انتهى التسجيل. ساد صمت ثقيل في الغرفة، لم يقطعه سوى طنين خوادم أوزيريس.",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "لأول مرة منذ سنوات، منذ أن قرر أن الأرقام هي الحقيقة الوحيدة، انهار يحيى. غطى وجهه بيديه وبدأ يبكي. لم يكن بكاءً صاخباً، بل نشيجاً مكتوماً لرجل أدرك أن كل ما بناه في حياته المهنية كان جزءاً من آلة دمار.",
        duration: 16000
      },
      {
        character: 'Narrator',
        text: "\"طارق كان موسى عصره،\" قال يحيى بصوت متقطع. \"حاول تحطيم العجل الرقمي... فقتلوه.\"",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "اقتربت ليلى ووضعت يدها على كتفه بحذر. لم تقدم له مواساة رخيصة.",
        duration: 4800
      },
      {
        character: 'Narrator',
        text: "\"يحيى، البكاء لن يعيد طارق. ولن يوقف المهندس الأول. أنت تملك أوزيريس الآن. تملك الشيفرة المصدرية.\"",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "رفع يحيى رأسه، وعيناه حمراوان لكنهما تحملان تصميماً جديداً. \"سأدمرهم. سأستخدم أوزيريس لاختراق خوادمهم وفضح كل شيء.\"",
        duration: 6800
      },
      {
        character: 'Narrator',
        text: "هزت ليلى رأسها نفياً. \"الهجوم المباشر لن ينجح. أنت تتعامل مع كيان يمتلك بيانات العالم بأسره. يجب أن نفهم الخصم أولاً. يجب أن نرى كيف يخترقون المؤسسات الكبرى من الداخل. كيف يحولون الحق إلى باطل باسم المقدس.\"",
        duration: 14800
      },
      {
        character: 'Narrator',
        text: "\"إلى أين نذهب إذن؟\" سأل يحيى.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "أشارت ليلى إلى الشاشة. \"إلى اللحظة التي سُرق فيها الدين. إلى نيقية.\"",
        duration: 4800
      }
    ],
    choices: [
      {
        id: 'four-5-2-nicaea',
        text: 'Search for "the sacred corruption" — Nicaea 325 AD',
        arabicText: 'ابحث عن "الفساد المقدس" — نيقية 325م',
        nextSceneId: 'five-6a-1-nicaea-debate',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },
};

// ============================================================
// PART FIVE: مجمع نيقية — اختراق المؤسسة
// الفصل 6: قبل المجمع + المجمع + الثمن
// ============================================================

const PART_FIVE: Record<string, Scene> = {

  // المشهد 6أ.1: لاهوت معقد، لا نوايا سيئة
  'five-6a-1-nicaea-debate': {
    id: 'five-6a-1-nicaea-debate',
    title: 'Before the Council: Complex Theology, No Evil Intent',
    arabicTitle: 'قبل المجمع: لاهوت معقد، لا نوايا سيئة',
    part: 3,
    backgroundImage: ASSET_URLS.backgrounds.nicaea_council,
    ambientKeys: ["amb.library_room", "music.classical_thought"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "برمج يحيى أوزيريس للعودة إلى عام 325 ميلادية. كان يتوقع أن يرى مؤامرة شريرة منذ اللحظة الأولى، لكن ما رآه كان مختلفاً.",
        duration: 8800
      },
      {
        character: 'Narrator',
        text: "رأى رجالاً بسطاء، يرتدون ملابس خشنة، يتجادلون بشغف في أروقة الكنائس والمكتبات.",
        duration: 4800
      },
      {
        character: 'Narrator',
        text: "\"أين المؤامرة؟\" سأل يحيى، وهو يراقب آريوس وأثناسيوس يتناقشان بحدة ولكن باحترام. \"هؤلاء الرجال يبدون مخلصين لما يؤمنون به.\"",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "أجابت ليلى، وعيناها تتابعان النقاشات: \"هذا هو الفخ يا يحيى. الخلافات في البداية كانت حقيقية. اللاهوت صعب. محاولة فهم طبيعة الخالق ليست أمراً سهلاً. انظر إليهم... إنهم لا يسعون للسلطة، إنهم يحاولون بصدق فهم الحقيقة.\"",
        duration: 14000
      },
      {
        character: 'Narrator',
        text: "عرض أوزيريس مقتطفات من رسائل آريوس وأثناسيوس.",
        duration: 2800
      },
      {
        character: 'Narrator',
        text: "آريوس يجادل: \"إذا كان الابن مولوداً، فله بداية، وبالتالي كان هناك وقت لم يكن فيه موجوداً. الله وحده هو الأزلي.\"",
        duration: 8000
      },
      {
        character: 'Narrator',
        text: "أثناسيوس يرد: \"إذا لم يكن الابن إلهاً كاملاً، فكيف يمكنه أن يخلص البشرية؟ الخلاص يتطلب إلهاً، لا مخلوقاً.\"",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "\"كلاهما يملك منطقاً،\" قال يحيى، وهو يحلل الحجج كمعادلات رياضية. \"نقطة الخلاف شرعية. أين الفيروس إذن؟\"",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "أشارت ليلى إلى زاوية الغرفة. \"الفيروس لا يخلق الخلاف... الفيروس ينتظر حتى يتعب الطرفان، ثم يقدم لهم (السلطة) كحل نهائي لحسم النقاش.\"",
        duration: 8800
      }
    ],
    choices: [
      {
        id: 'five-6a-1-continue',
        text: 'Enter the Council Hall',
        arabicText: 'ادخل قاعة المجمع',
        nextSceneId: 'five-6b-1-constantine',
      },
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'contemplative',
  },

  // المشهد 6ب.1: الإمبراطور والحكيم
  'five-6b-1-constantine': {
    id: 'five-6b-1-constantine',
    title: 'The Emperor and the Sage',
    arabicTitle: 'الإمبراطور والحكيم',
    part: 3,
    backgroundVideo: ASSET_URLS.videoBg.nicaea,
    backgroundImage: ASSET_URLS.backgrounds.nicaea_council,
    ambientKeys: ["amb.hall_reverb", "amb.heavy_steps"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "دخل قسطنطين القاعة بأبهة إمبراطورية. لم يكن يبدو كرجل دين، بل كجنرال عسكري.",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "خلفه، بخطوة واحدة، سار رجل يرتدي عباءة داكنة. لم يستطع يحيى تمييز ملامحه بوضوح، لكنه شعر بقشعريرة مألوفة.",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "\"هذا هو،\" همس يحيى. \"الحكيم. النسخة القديمة من المهندس الأول. لقد رأيته مع فرعون.\"",
        duration: 5600
      },
      {
        character: 'Narrator',
        text: "وقف قسطنطين أمام الأساقفة. لم يتحدث عن اللاهوت. تحدث عن الإمبراطورية.",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "\"إمبراطوريتي تتمزق بسبب خلافاتكم،\" قال قسطنطين بصوت حازم. \"أنا لا أهتم بتفاصيل طبيعة المسيح. أنا أهتم بوحدة روما. اتفقوا... أو سأجعلكم تتفقون.\"",
        duration: 8800
      },
      {
        character: 'Narrator',
        text: "اقترب الحكيم من أذن قسطنطين وهمس بشيء. أومأ الإمبراطور برأسه.",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "\"سنصيغ قانون إيمان واحد. من يوقع عليه، فهو صديق لروما. ومن يرفض... سيُنفى وتُحرق كتبه.\"",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "راقب يحيى وليلى كيف تحولت وجوه الأساقفة من باحثين عن الحقيقة إلى سياسيين خائفين.",
        duration: 5600
      },
      {
        character: 'Narrator',
        text: "\"هنا يعمل الفيروس،\" قالت ليلى بحزن. \"الخوارزمية لم تغير العقيدة مباشرة. الخوارزمية أدخلت (السلطة) إلى المعادلة. بمجرد أن ارتبط الدين بسيف الإمبراطور، ماتت الروح، ووُلدت المؤسسة القمعية.\"",
        duration: 10800
      }
    ],
    choices: [
      {
        id: 'five-6b-1-continue',
        text: 'The price — Laila\'s pain',
        arabicText: 'الثمن — ألم ليلى',
        nextSceneId: 'five-6c-1-laila-pain',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 6ج.1: ألم ليلى
  'five-6c-1-laila-pain': {
    id: 'five-6c-1-laila-pain',
    title: 'The Price — Laila\'s Pain',
    arabicTitle: 'الثمن — ألم ليلى',
    part: 3,
    backgroundImage: ASSET_URLS.backgrounds.white_space,
    ambientKeys: ["amb.silence_low"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "أوقف يحيى المحاكاة. كانت ليلى ترتجف، ودموع صامتة تنزل على خديها.",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "\"ليلى... هل أنتِ بخير؟\" سأل يحيى بقلق. كان يعلم أن رؤية تسييس الدين بهذا الشكل قاسية على شخص مؤمن.",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "مسحت ليلى دموعها بظهر يدها. \"أنا بخير. هذا فقط... يذكرني بأمي.\"",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "جلس يحيى مقابلها، مستمعاً بصمت.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"أمي كانت ضحية لـ (المؤسسة) أيضاً،\" قالت ليلى بصوت مخنوق. \"أبي كان رجلاً يرتدي عباءة الدين، يتحدث بالآيات والأحاديث، لكنه كان وحشاً في البيت. استخدم الدين ليبرر قسوته، ليجعل أمي تعتقد أن طاعتها لظلمه هي طاعة لله. لقد اغتصب روحها باسم المقدس.\"",
        duration: 16800
      },
      {
        character: 'Narrator',
        text: "نظرت ليلى إلى شاشات أوزيريس. \"لهذا السبب درست علم النفس الديني. كنت أريد أن أفهم: هل الخلل في الله؟ أم فينا؟ ما رأيناه في نيقية يؤكد لي ما توصلت إليه. الله لم يُهزم في نيقية يا يحيى. (المؤسسة) هي التي انتصرت مؤقتاً. الفيروس لا يهاجم الله، الفيروس يهاجم (تمثيلنا) لله على الأرض.\"",
        duration: 20800
      },
      {
        character: 'Narrator',
        text: "شعر يحيى باحترام عميق لهذه المرأة. إيمانها لم يكن ساذجاً أو موروثاً. كان إيماناً مختبراً بالنار.",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "\"أنتِ المقاومة الروحية يا ليلى،\" قال يحيى بهدوء. \"أنتِ ترفضين التخلي عن الحقيقة، حتى عندما يتم تشويهها من قبل من يدعون حمايتها.\"",
        duration: 8800
      }
    ],
    choices: [
      {
        id: 'five-6c-1-continue',
        text: 'Hear Tarek\'s second message',
        arabicText: 'اسمع رسالة طارق الثانية',
        nextSceneId: 'five-6c-2-tarek-second',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },

  // المشهد 6ج.2: رسالة طارق الثانية
  'five-6c-2-tarek-second': {
    id: 'five-6c-2-tarek-second',
    title: 'Tarek\'s Second Message',
    arabicTitle: 'رسالة طارق الثانية',
    part: 3,
    backgroundImage: ASSET_URLS.backgrounds.corporate_lab,
    ambientKeys: ["amb.recording_room"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "شغل يحيى التسجيل الثاني لطارق.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"يحيى... إذا رأيت نيقية، فستفهم كيف تُسرق الأديان. لكن هل تعرف كيف تُسرق العقول اليوم؟ شركات التكنولوجيا الكبرى هي (كنيسة الإمبراطورية) الجديدة. نحن نملك (قانون الإيمان) الخاص بنا: خوارزميات التوصية. نحن نحدد ما هو (الحق) وما هو (الباطل) بناءً على ما يجلب تفاعلاً أكثر. من يوافقنا، نمنحه الوصول والانتشار (Reach). ومن يخالفنا، نطبق عليه (النفى الرقمي - Shadowbanning). نحن قسطنطين العصر الحديث، لكننا لا نستخدم السيوف... نحن نستخدم الدوبامين.\"",
        duration: 27600
      },
      {
        character: 'Narrator',
        text: "نظر يحيى إلى ليلى. \"النمط يتكرر. الفيروس يتطور. من العجل الذهبي (المادي)، إلى نيقية (المؤسسي)، إلى...\"",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "\"إلى الأيديولوجيا،\" قاطعته ليلى. \"عندما يتخلى الفيروس عن الحاجة إلى إله تماماً، ويصبح الإنسان هو الإله.\"",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "برمج يحيى أوزيريس للوجهة التالية. \"إلى الأندلس... والقرن العشرين.\"",
        duration: 3600
      }
    ],
    choices: [
      {
        id: 'five-6c-2-continue',
        text: 'Continue to Part Four: Andalusia and the 20th Century',
        arabicText: 'تابع إلى الجزء الرابع: الأندلس والقرن العشرون',
        nextSceneId: 'six-8-1-andalusia',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'intense',
  },
};

// ============================================================
// PART SIX: الأندلس والقرن العشرون — وهم التفرد
// الفصل 8: الأندلس الضائعة + القرن العشرون
// ============================================================

const PART_SIX: Record<string, Scene> = {

  // المشهد 8.1: خيانة الإخوة
  'six-8-1-andalusia': {
    id: 'six-8-1-andalusia',
    title: 'The Lost Andalusia — Betrayal of Brothers',
    arabicTitle: 'الأندلس الضائعة — خيانة الإخوة',
    part: 4,
    backgroundVideo: ASSET_URLS.videoBg.andalusia,
    backgroundImage: 'sceneBg.six-8-1-andalusia',
    musicKey: "music.andalusian_oud_violin",
    ambientKeys: ["amb.city_night", "amb.distant_whispers"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "نقل أوزيريس يحيى وليلى إلى الأندلس. لم تكن فترة الفتح، بل فترة التمزق. عصر ملوك الطوائف.",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "\"انظر إلى هذا،\" قال يحيى وهو يقرأ البيانات التي يعرضها النظام. \"قرطبة كانت تضيء العالم. مليون نسمة، 70 مكتبة عامة، شوارع مرصوفة ومضاءة في وقت كانت فيه أوروبا تغرق في وحل العصور الوسطى. كيف انهار كل هذا؟\"",
        duration: 14800
      },
      {
        character: 'Narrator',
        text: "أشارت ليلى إلى الشاشات المنقسمة. \"لم ينهار من الخارج يا يحيى. لقد انهار من الداخل. الخوارزمية عملت هنا بكفاءة مرعبة.\"",
        duration: 8000
      },
      {
        character: 'Narrator',
        text: "في إحدى الشاشات، ظهر أمير إشبيلية (المعتمد بن عباد) يجلس في قصره الباذخ. اقترب منه مستشاره (الذي لم يكن سوى تجسيد آخر لـ \"الحكيم\").",
        duration: 9600
      },
      {
        character: 'Narrator',
        text: "\"مولاي،\" همس الحكيم بصوت ناعم. \"أمير قرطبة يظن أنه أفضل منك. إنه يجمع جيشاً. يجب أن تسبقه.\"",
        duration: 6800
      },
      {
        character: 'Narrator',
        text: "\"لكننا إخوة في الدين والدم،\" تردد المعتمد قليلاً.",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "\"العرش لا يعرف الإخوة يا مولاي. أنت الأحق. أنت الأفضل. استعن بملك قشتالة (ألفونسو) ضده. ادفع له الجزية، وسيحميك من أخيك.\"",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "في شاشة أخرى، كان نفس \"الحكيم\" يقف في بلاط أمير قرطبة، يهمس له بنفس الكلمات: \"أنت خير منه. استعن بالفرنجة لسحقه.\"",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "راقب يحيى بذهول كيف تحولت الأندلس إلى رقعة شطرنج دموية. كل أمير مستعد لبيع أمته بأكملها مقابل أن يجلس على عرش زائل.",
        duration: 8800
      },
      {
        character: 'Narrator',
        text: "\"المحور الرابع من الخوارزمية،\" قال يحيى بصوت خافت. \"الفرقة. تحويل (نحن) إلى (أنا ضد الجميع). لقد استخدموا أعداءهم لقتل إخوتهم، لأن كبرياءهم الشخصي كان أهم من بقاء الحضارة.\"",
        duration: 11200
      }
    ],
    choices: [
      {
        id: 'six-8-1-continue',
        text: 'The last tears — 1492',
        arabicText: 'الدموع الأخيرة — 1492',
        nextSceneId: 'six-8-2-last-tears',
      },
    ],
    transitionType: 'slideDown',
    transitionDuration: 1500,
    emotionalTone: 'tragic',
  },

  // المشهد 8.2: دموع لا تنفع
  'six-8-2-last-tears': {
    id: 'six-8-2-last-tears',
    title: 'Tears That Do Not Help',
    arabicTitle: 'دموع لا تنفع',
    part: 4,
    backgroundVideo: ASSET_URLS.videoBg.abu_abdullah_tears,
    backgroundImage: 'sceneBg.six-8-2-last-tears',
    musicKey: "music.andalusian_sad",
    ambientKeys: ["amb.wind_soft"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "تسارعت المحاكاة عبر الزمن، وتوقفت في عام 1492.",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "وقف يحيى وليلى على تلة مرتفعة، يراقبان موكباً صغيراً يغادر غرناطة. كان أبو عبد الله الصغير، آخر ملوك الأندلس، يمتطي جواده بظهر منحنٍ.",
        duration: 9200
      },
      {
        character: 'Narrator',
        text: "توقف الموكب. استدار أبو عبد الله لينظر إلى قصر الحمراء، درة التاج الأندلسي، الذي سلمه للتو للملكين الكاثوليكيين (فرديناند وإيزابيلا).",
        duration: 8000
      },
      {
        character: 'Narrator',
        text: "لم يستطع الملك المخلوع أن يتمالك نفسه. انخرط في بكاء مرير.",
        duration: 4400
      },
      {
        character: 'Narrator',
        text: "اقتربت منه أمه، عائشة الحرة. لم تكن نظراتها تحمل أي شفقة، بل احتقاراً عميقاً.",
        duration: 5600
      },
      {
        character: 'Narrator',
        text: "قالت جملتها التي خلدها التاريخ، والتي رددها أوزيريس كنص مضيء في الهواء: \"ابكِ كالنساء مُلكاً لم تحافظ عليه كالرجال.\"",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "شعر يحيى بغصة في حلقه. \"لقد سلم مفاتيح المدينة دون قتال حقيقي. فضل النجاة بحياته وبعض ممتلكاته على الدفاع عن أمته.\"",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "في تلك اللحظة، التقط أوزيريس صوتاً خفياً يتردد في الريح. صوت إبليس: \"أتذكرون؟ هذا ما قلته. إنهم يفسدون فيها ويسفكون الدماء. أعطيتهم جنة على الأرض (الأندلس)، فدمروها بأيديهم لأن كل واحد منهم قال: أنا خير من أخي.\"",
        duration: 14800
      }
    ],
    choices: [
      {
        id: 'six-8-2-continue',
        text: 'The 20th century — the illusion of the supreme race',
        arabicText: 'القرن العشرون — وهم العرق الأسمى',
        nextSceneId: 'six-8b-1-berlin',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 8ب.1: وهم العرق الأسمى
  'six-8b-1-berlin': {
    id: 'six-8b-1-berlin',
    title: 'The Illusion of the Supreme Race',
    arabicTitle: 'وهم العرق الأسمى',
    part: 4,
    backgroundVideo: ASSET_URLS.videoBg.berlin_1933,
    backgroundImage: ASSET_URLS.backgrounds.berlin_1933,
    ambientKeys: ["amb.city_cold", "amb.march_drums_distant"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "انتقلت المحاكاة إلى القرن العشرين. العصر الذي تخلت فيه البشرية عن الآلهة القديمة، وصنعت آلهة من لحم ودم.",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "وقف يحيى وليلى في غرفة مغلقة في برلين. أمام مرآة كبيرة، كان أدولف هتلر يقف وحيداً.",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "كان يتدرب على تعابير وجهه، وحركات يديه. كان يدرس كيف يبدو غاضباً، كيف يبدو حازماً، كيف يبدو كإله لا يُقهر.",
        duration: 8000
      },
      {
        character: 'Narrator',
        text: "\"هذا ليس مجرد سياسي،\" قال يحيى وهو يقرأ تحليلات أوزيريس النفسية. \"إنه يعتقد بعمق أنه مختار. أنه فوق كل القواعد الأخلاقية. أنه يصنع تاريخ العرق الأسمى.\"",
        duration: 10400
      },
      {
        character: 'Narrator',
        text: "أضافت ليلى: \"هذا هو التطور النهائي للخوارزمية. (أنا خير منه) لم تعد مجرد خطيئة شخصية. لقد أصبحت علماً مزيفاً (اليوجينيا)، وقانوناً، ودولة. عندما تعتقد أن عرقك هو الأفضل، فإن إبادة الآخرين لا تصبح جريمة، بل تصبح (تطهيراً).\"",
        duration: 14800
      }
    ],
    choices: [
      {
        id: 'six-8b-1-continue',
        text: 'Moscow 1937 and Cambodia 1975',
        arabicText: 'موسكو 1937 وكمبوديا 1975',
        nextSceneId: 'six-8c-1-death-signatures',
      },
    ],
    transitionType: 'slideDown',
    transitionDuration: 1500,
    emotionalTone: 'dark',
  },

  // المشهد 8ج.1: التوقيع على الموت
  'six-8c-1-death-signatures': {
    id: 'six-8c-1-death-signatures',
    title: 'Signing Death Orders',
    arabicTitle: 'التوقيع على الموت',
    part: 4,
    backgroundImage: ASSET_URLS.backgrounds.moscow_1937,
    visualEffect: "montage",
    ambientKeys: ["amb.typewriter", "amb.march_drums_distant"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "عرض أوزيريس مشهدين متوازيين.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "في موسكو، كان جوزيف ستالين يجلس على مكتبه، يدخن غليونه بهدوء. أمامه قوائم طويلة من الأسماء. كان يمسك قلماً أحمر، ويوقع ببرود.",
        duration: 8800
      },
      {
        character: 'Narrator',
        text: "\"أكثر من 40,000 توقيع شخصي موثق على قوائم الإعدام،\" قرأ يحيى من أرشيف KGB الذي استدعاه أوزيريس. \"إنه يشرب نخب النصر، وأعداؤه هم كل من يختلف معه.\"",
        duration: 10800
      },
      {
        character: 'Narrator',
        text: "في الجانب الآخر من الشاشة، ظهر بول بوت في كمبوديا. خريج جامعات باريس، الذي تعلم فلسفة التحرر الإنساني، وطبقها بقتل ربع سكان بلاده.",
        duration: 9200
      },
      {
        character: 'Narrator',
        text: "\"لماذا يقتلون من يرتدي نظارة؟\" سألت ليلى برعب وهي تشاهد جنود الخمير الحمر يعدمون فلاحين بسطاء.",
        duration: 6400
      },
      {
        character: 'Narrator',
        text: "أجاب يحيى بمرارة: \"لأن النظارة تعني القراءة. والقراءة تعني التعليم. والتعليم يمثل تهديداً لـ (النقاء الثوري) الذي يدعيه بول بوت. كل من يفكر هو عدو.\"",
        duration: 10000
      },
      {
        character: 'Narrator',
        text: "نظر يحيى إلى الشاشتين. ثلاثة رجال (هتلر، ستالين، بول بوت)، ثلاث أيديولوجيات مختلفة تماماً (فاشية، شيوعية، ماوية). لكن النتيجة واحدة: جبال من الجماجم.",
        duration: 9200
      },
      {
        character: 'Narrator',
        text: "\"الرابط بينهم ليس السياسة،\" قال يحيى. \"الرابط هو جملة واحدة: (أنا وحدي أعرف الحقيقة). وهي الترجمة الحديثة لـ (أنا خير منه).\"",
        duration: 8400
      }
    ],
    choices: [
      {
        id: 'six-8c-1-attack',
        text: 'The hideout is under attack!',
        arabicText: 'المخبأ يتعرض للهجوم!',
        nextSceneId: 'six-8d-1-attack',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 1500,
    emotionalTone: 'dark',
  },

  // المشهد 8د.1: اختراق المخبأ
  'six-8d-1-attack': {
    id: 'six-8d-1-attack',
    title: 'Breaching the Hideout',
    arabicTitle: 'اختراق المخبأ',
    part: 4,
    backgroundImage: 'sceneBg.six-8d-1-attack',
    visualEffect: "alarm",
    ambientKeys: ["amb.smoke_alarm", "amb.footsteps_heavy"],
    enterSfxKeys: ["sfx.explosion", "sfx.gunshot_distant"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "فجأة، انقطعت المحاكاة. ومضت الغرفة باللون الأحمر.",
        duration: 2800
      },
      {
        character: 'Narrator',
        text: "\"لقد وجدونا!\" صرخت ليلى وهي تسحب حقيبة ظهر وتبدأ في حشو الأقراص الصلبة فيها.",
        duration: 5600
      },
      {
        character: 'Narrator',
        text: "\"كيف؟ النظام مشفر بالكامل!\" قال يحيى وهو يكتب بسرعة على لوحة المفاتيح لمحاولة تأمين البيانات.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "\"لم يخترقوا أوزيريس، لقد تتبعوا استهلاك الطاقة! الخوادم تستهلك كهرباء حي بأكمله!\"",
        duration: 4800
      },
      {
        character: 'Narrator',
        text: "سُمع صوت تحطم الباب الخارجي للمخبأ. دخلت مجموعة من الرجال المسلحين. لم يكونوا يرتدون زياً عسكرياً، بل بدلات سوداء أنيقة. \"الأتباع\". مرتزقة الشركة.",
        duration: 9200
      },
      {
        character: 'Narrator',
        text: "\"دكتور سليماني،\" قال قائد المجموعة بصوت آلي، خالٍ من المشاعر. \"المهندس الأول يرسل تحياته. يرجى الابتعاد عن الخوادم.\"",
        duration: 7200
      }
    ],
    choices: [
      {
        id: 'six-8d-1-continue',
        text: 'The final update — 48 hours',
        arabicText: 'التحديث النهائي — 48 ساعة',
        nextSceneId: 'six-8d-2-final-update',
      },
    ],
    transitionType: 'slideUp',
    transitionDuration: 1000,
    emotionalTone: 'urgent',
  },

  // المشهد 8د.2: التحديث النهائي
  'six-8d-2-final-update': {
    id: 'six-8d-2-final-update',
    title: 'The Final Update',
    arabicTitle: 'التحديث النهائي',
    part: 4,
    backgroundImage: ASSET_URLS.backgrounds.white_space,
    visualEffect: "alarm",
    musicKey: "music.epic_orchestral",
    ambientKeys: ["amb.heartbeat_slow"],
    dialogue: [
      {
        character: 'Narrator',
        text: 'They reached an old ambulance Laila had prepared as an escape plan. While Laila pressed on Yahya\'s wound to stop the bleeding, Yahya opened his laptop with one hand and connected it to the portable OSIRIS server.',
        arabicText: 'وصلا إلى سيارة إسعاف قديمة كانت ليلى قد جهزتها كخطة هروب. بينما كانت ليلى تضغط على جرح يحيى لوقف النزيف، فتح يحيى حاسوبه المحمول بيد واحدة، ووصله بخادم أوزيريس المحمول.',
        duration: 7000,
        delay: 1000,
      },
      {
        character: 'Laila',
        text: 'What are you doing? You are bleeding!',
        arabicText: 'ماذا تفعل؟ أنت تنزف!',
        duration: 2500,
      },
      {
        character: 'Yahya',
        text: 'I understand now why they attacked us. The First Engineer... he is preparing to launch "the final update."',
        arabicText: 'لقد فهمت لماذا هاجمونا الآن. المهندس الأول... إنه يستعد لإطلاق "التحديث النهائي".',
        duration: 5000,
      },
      {
        character: 'Laila',
        text: 'What update?',
        arabicText: 'أي تحديث؟',
        duration: 2000,
      },
      {
        character: 'Yahya',
        text: 'The algorithm is no longer just an app on phones. They have developed a neural frequency control system. It will be broadcast via 6G networks worldwide tonight. It will completely eliminate free will. It will connect billions of humans to a "collective mind" controlled by the First Engineer. He believes that by doing so he will end wars... because he will end choice.',
        arabicText: 'الخوارزمية لم تعد مجرد تطبيق على الهواتف. لقد طوروا نظام تحكم بالترددات العصبية. سيتم بثه عبر شبكات الجيل السادس في جميع أنحاء العالم الليلة. سيلغي الإرادة الحرة تماماً. سيجعل مليارات البشر متصلين بـ "عقل جمعي" يديره المهندس الأول. يعتقد أنه بذلك سيقضي على الحروب... لأنه سيقضي على الاختيار.',
        duration: 10000,
      },
      {
        character: 'Yahya',
        text: 'Timeline: 48 hours. If we do not stop him... the human story ends.',
        arabicText: 'الجدول الزمني: 48 ساعة. إذا لم نوقفه... ستنتهي القصة البشرية.',
        duration: 5000,
      },
      {
        character: 'Narrator',
        text: 'Yahya lost consciousness.',
        arabicText: 'غاب يحيى عن الوعي.',
        duration: 3000,
      },
    ],
    choices: [
      {
        id: 'six-8d-2-dream',
        text: 'The dream before the battle',
        arabicText: 'الحلم قبل المعركة',
        nextSceneId: 'transition-dream',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 3000,
    emotionalTone: 'tragic',
  },
};

// ============================================================
// TRANSITIONAL: الحلم قبل المعركة
// ============================================================

const TRANSITION: Record<string, Scene> = {

  // المشهد الانتقالي: لقاء خارج الزمن
  'transition-dream': {
    id: 'transition-dream',
    title: 'The Dream Before the Battle',
    arabicTitle: 'الحلم قبل المعركة',
    part: 4,
    backgroundImage: ASSET_URLS.backgrounds.white_space,
    audioUrl: ASSET_URLS.audio.intro_narration_v1,
    musicKey: "music.ambient_peace",
    ambientKeys: ["amb.breath_slow"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "فتح يحيى عينيه. لم يكن يشعر بألم في كتفه. لم يكن هناك دخان أو رصاص. كان يجلس على كرسي مريح في غرفة بيضاء بالكامل.",
        duration: 9600
      },
      {
        character: 'Narrator',
        text: "أمامه، كان طارق يجلس مبتسماً. لم يكن طارق المتعب والمرعوب الذي رآه في المحاكاة السابقة. كان طارق القديم، الأخ الأكبر الذي طالما اعتمد عليه.",
        duration: 9600
      },
      {
        character: 'Narrator',
        text: "\"هل أنا ميت؟\" سأل يحيى بهدوء.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"ليس بعد،\" أجاب طارق. \"أنت في وضع (Safe Mode). أوزيريس يحافظ على وعيك بينما تحاول ليلى إيقاف نزيفك في العالم الحقيقي.\"",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "نظر يحيى إلى يديه. \"لقد رأيت كل شيء يا طارق. فرعون، نيقية، الأندلس، القرن العشرين. الخوارزمية مرعبة. إنها لا تُقهر. كيف نهزم شيئاً مزروعاً في طبيعتنا؟\"",
        duration: 10400
      },
      {
        character: 'Narrator',
        text: "ابتسم طارق ابتسامة حزينة. \"هذا هو الفخ الأخير للخوارزمية يا يحيى. (اليأس). المحور الخامس. أن تعتقد أن الشر أصيل وأن الخير استثناء. لكن هذا غير صحيح.\"",
        duration: 10400
      },
      {
        character: 'Narrator',
        text: "وقف طارق واقترب من أخيه. \"الخوارزمية تعمل فقط إذا وافقت عليها. (أنا خير منه) هي مجرد اقتراح. يمكنك دائماً أن ترفض. يمكنك دائماً أن تختار (نحن) بدلاً من (أنا). يمكنك أن تختار التضحية بدلاً من السيطرة.\"",
        duration: 14400
      },
      {
        character: 'Narrator',
        text: "\"ماذا يجب أن أفعل الآن؟\"",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"المهندس الأول سيحاول اختراق وعيك. سيقدم لك العرض الأخير. الجنة الرقمية. لا تقبلها يا يحيى. استخدم الكود الذي أعطيتك إياه. انشر الحقيقة. حتى لو كان الثمن حياتك.\"",
        duration: 10800
      },
      {
        character: 'Narrator',
        text: "تلاشت صورة طارق ببطء. \"استيقظ يا أخي. ليلى تحتاجك.\"",
        duration: 3600
      }
    ],
    choices: [
      {
        id: 'transition-dream-karbala',
        text: 'Part Five: The Battle of Karbala',
        arabicText: 'الجزء الخامس: معركة كربلاء',
        nextSceneId: 'seven-10-1-karbala',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 3000,
    emotionalTone: 'hopeful',
  },
};

// ============================================================
// PART SEVEN: معركة كربلاء + المواجهة الرقمية + الخاتمة
// الفصل 10 + 11 + 12 + 13
// ============================================================

const PART_SEVEN: Record<string, Scene> = {

  // المشهد 10.1: الحق الأعزل
  'seven-10-1-karbala': {
    id: 'seven-10-1-karbala',
    title: 'The Unarmed Truth',
    arabicTitle: 'الحق الأعزل',
    part: 5,
    backgroundVideo: ASSET_URLS.videoBg.karbala,
    backgroundImage: 'sceneBg.seven-10-1-karbala',
    ambientKeys: ["amb.desert_wind", "amb.distant_battle"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "قبل أن يستيقظ يحيى في العالم الحقيقي، سحبه أوزيريس إلى محاكاة أخيرة. العالم المعاصر.",
        duration: 5600
      },
      {
        character: 'Narrator',
        text: "ظهرت أمامه وثائق حقيقية مسربة (وثائق فرانسيس هوغن 2021).",
        duration: 3600
      },
      {
        character: 'Narrator',
        text: "قرأ يحيى البيانات المضيئة: \"اكتشف مهندسو الشركة أن الخوارزمية تضاعف انتشار المحتوى المثير للغضب بمعدل 6 أضعاف المحتوى الهادئ. وحين عُرض الأمر للإدارة، قرروا الإبقاء على الخوارزمية لأنها تزيد وقت الاستخدام والأرباح.\"",
        duration: 12800
      },
      {
        character: 'Narrator',
        text: "تردد صوت المهندس الأول في الفضاء الرقمي: \"هل ترى يا يحيى؟ نحن لم نخترع الغضب. نحن فقط قمنا بـ (تحسينه - Optimization). إبليس اليوم لا يحتاج إلى كهنة ومعابد. يحتاج إلى خوارزمية تغذي كل إنسان بما يعزز كبره، ويقنعه أن رأيه وحده هو الصواب.\"",
        duration: 17600
      }
    ],
    choices: [
      {
        id: 'seven-10-1-continue',
        text: 'The Digital Confrontation',
        arabicText: 'المواجهة الرقمية',
        nextSceneId: 'seven-11-1-temptation',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'hopeful',
  },

  // المشهد 11.1: إغراء المهندس
  'seven-11-1-temptation': {
    id: 'seven-11-1-temptation',
    title: 'The Temptation of the Engineer',
    arabicTitle: 'إغراء المهندس',
    part: 5,
    backgroundVideo: ASSET_URLS.videoBg.digital_space,
    backgroundImage: ASSET_URLS.backgrounds.white_space,
    visualEffect: "scanlines",
    ambientKeys: ["amb.electronic_hum"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "ظهر المهندس الأول أمام يحيى في الفضاء الرقمي.",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "\"أنت تنزف في العالم الحقيقي يا يحيى. ليلى لن تستطيع إنقاذك. لكنني أستطيع.\"",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "مد المهندس يده. \"أعطني محرك الأقراص. أعطني أوزيريس. وسأجعلك شريكاً. سأعطيك حياة أبدية في الجنة الرقمية التي نبنيها. لن تشعر بالألم، لن تشعر بالفقد. سأعيد لك محاكاة لطارق تعيش معك للأبد.\"",
        duration: 12400
      },
      {
        character: 'Narrator',
        text: "كان العرض مغرياً. العقل البشري مبرمج لتجنب الألم.",
        duration: 3200
      }
    ],
    choices: [
      {
        id: 'seven-11-1-join',
        text: 'Join the First Engineer — save Tarek and Laila',
        arabicText: 'انضم للمهندس الأول — أنقذ طارق وليلى',
        nextSceneId: 'seven-11-2-decision',
        consequence: 'You chose the comfort of the cage. But is it truly peace?',
      },
      {
        id: 'seven-11-1-refuse',
        text: 'Refuse — freedom that bleeds is better than painless slavery',
        arabicText: 'ارفض — الحرية التي تنزف أفضل من عبودية لا تشعر بالألم',
        nextSceneId: 'seven-11-2-decision',
        consequence: 'Unexpected courage from a data analyst.',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'intense',
  },

  // المشهد 11.2: قرار يحيى
  'seven-11-2-decision': {
    id: 'seven-11-2-decision',
    title: 'Yahya\'s Decision',
    arabicTitle: 'قرار يحيى',
    part: 5,
    backgroundVideo: ASSET_URLS.videoBg.enter_key,
    backgroundImage: ASSET_URLS.backgrounds.white_space,
    visualEffect: "scanlines",
    ambientKeys: ["amb.electronic_hum"],
    enterSfxKeys: ["sfx.key_enter"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "نظر يحيى إلى المهندس الأول. تذكر رمسيس، تذكر قسطنطين، تذكر ملوك الطوائف. كلهم قبلوا العرض. كلهم قالوا (أنا).",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "\"طارق مات ليفضحكم،\" قال يحيى بصوت ثابت. \"والحسين مات ليعلمنا أن الحياة بلا كرامة هي الموت الحقيقي.\"",
        duration: 6800
      },
      {
        character: 'Narrator',
        text: "ضغط يحيى على زر (Execute) في وعيه، مفصلاً نفسه عن محاكاة المهندس الأول.",
        duration: 5200
      },
      {
        character: 'Narrator',
        text: "\"أنا أرفض عرضك.\"",
        duration: 2500
      }
    ],
    choices: [
      {
        id: 'seven-11-2-continue',
        text: 'The Final Chapter',
        arabicText: 'الفصل الأخير',
        nextSceneId: 'seven-12-1-truth-leak',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'hopeful',
  },

  // المشهد 12.1: تسريب الحقيقة
  'seven-12-1-truth-leak': {
    id: 'seven-12-1-truth-leak',
    title: 'The Rosetta Stone of the Digital Age',
    arabicTitle: 'حجر رشيد الرقمي — تسريب الحقيقة',
    part: 6,
    backgroundVideo: ASSET_URLS.videoBg.enter_key,
    backgroundImage: 'sceneBg.seven-12-1-truth-leak',
    visualEffect: "montage",
    ambientKeys: ["amb.notification_swarm"],
    enterSfxKeys: ["sfx.electric_shock"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "فتح يحيى عينيه في العالم الحقيقي. كان في قبو مهجور. ليلى كانت تجلس بجانبه، يداها مغطاتان بدمه، وتبكي بصمت.",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "\"ليلى...\" همس يحيى بصعوبة.",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"أنا هنا. الإسعاف في الطريق. فقط ابق معي.\"",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "\"لا وقت... خذي هذا.\" وضع محرك الأقراص في يدها. \"هذا هو حجر رشيد الرقمي. فيه الشيفرة المصدرية لأوزيريس، وفيه كل الأدلة على مشروعهم. انشريه في كل مكان. على شبكة الإنترنت المظلمة (Dark Web)، في خوادم الجامعات، في كل مكان لا يستطيعون حذفه منه.\"",
        duration: 17200
      },
      {
        character: 'Narrator',
        text: "\"يحيى، لا تتركني وحدي.\"",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "ابتسم يحيى ابتسامة خفيفة. \"لستِ وحدك. شهود الدفاع... كلهم معك.\"",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "أغمض يحيى عينيه للمرة الأخيرة. توقف تنفسه. لكن وجهه كان يحمل سلاماً عميقاً.",
        duration: 5200
      }
    ],
    choices: [
      {
        id: 'seven-12-1-continue',
        text: 'The Awakening',
        arabicText: 'الاستيقاظ',
        nextSceneId: 'seven-13-1-awakening',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 3000,
    emotionalTone: 'hopeful',
  },

  // المشهد 13.1: الاستيقاظ
  'seven-13-1-awakening': {
    id: 'seven-13-1-awakening',
    title: 'The Awakening',
    arabicTitle: 'الاستيقاظ',
    part: 6,
    backgroundImage: ASSET_URLS.backgrounds.qabil_habil_aftermath,
    musicKey: "music.contemplative_strings",
    ambientKeys: ["amb.city_day"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "بينما كانت ليلى تقوم برفع البيانات (Uploading)، عرض أوزيريس على شاشتها مشاهد سريعة، كأنها رسالة وداع من يحيى وطارق:",
        duration: 7600
      },
      {
        character: 'Narrator',
        text: "هؤلاء هم شهود الدفاع. هؤلاء من يثبتون أن الإنسان، رغم ضعفه، قادر على الارتقاء فوق طينه.",
        duration: 6400
      }
    ],
    choices: [
      {
        id: 'seven-13-1-continue',
        text: 'Closing the File',
        arabicText: 'إغلاق الملف',
        nextSceneId: 'seven-13-2-closing',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },

  // المشهد 13.2: إغلاق الملف
  'seven-13-2-closing': {
    id: 'seven-13-2-closing',
    title: 'Closing the File',
    arabicTitle: 'إغلاق الملف',
    part: 6,
    backgroundImage: ASSET_URLS.backgrounds.osiris_cosmic,
    audioUrl: ASSET_URLS.audio.intro_narration,
    visualEffect: "scanlines",
    musicKey: "music.cosmic_end",
    ambientKeys: ["amb.vacuum"],
    dialogue: [
      [
      {
        character: 'Narrator',
        text: "ظهرت الكلمات على الشاشة ببطء:",
        duration: 2500
      },
      {
        character: 'Narrator',
        text: "\"الملف رقم: واحد. النتيجة: لم تُحسم بعد. المدّعي لا يزال يحاول إثبات قضيته. لكن المتهم... بدأ يستيقظ.\"",
        duration: 6800
      },
      {
        character: 'Narrator',
        text: "توقف النبض الأبيض للحظة، ثم ظهرت الجملة الأخيرة:",
        duration: 3200
      },
      {
        character: 'Narrator',
        text: "\"الفساد في الأرض ليس فوضى عشوائية. إنه نمط. في جذر كل فساد: شخص قال (أنا خير منه). المعركة لم تنتهِ. إنها تحدث الآن... في جيبك، في شاشتك، وفي قلبك.\"",
        duration: 11600
      }
    ],
    choices: [
      {
        id: 'seven-13-2-close',
        text: 'Close the system and return to the real world',
        arabicText: 'إغلاق النظام والعودة إلى العالم الحقيقي',
        nextSceneId: 'seven-13-2-closing',
        consequence: 'You have witnessed the truth. What you do with it is your choice.',
      },
      {
        id: 'seven-13-2-share',
        text: 'Share the source code — invite others to read the novel',
        arabicText: 'مشاركة الشيفرة المصدرية — دعوة أصدقاء لقراءة الرواية',
        nextSceneId: 'seven-13-2-closing',
        consequence: 'The case continues. You have become a witness.',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 3000,
    emotionalTone: 'contemplative',
  },
};

// ============================================================
// SCENE REGISTRY — All scenes combined
// ============================================================

export const SCENES: Record<string, Scene> = {
  ...PART_ZERO,
  ...PART_ONE,
  ...PART_TWO,
  ...PART_THREE,
  ...PART_FOUR,
  ...PART_FIVE,
  ...PART_SIX,
  ...TRANSITION,
  ...PART_SEVEN,
};

export const INITIAL_SCENE_ID = 'zero-1-1-summons';

export const PART_LABELS: Record<number, { en: string; ar: string }> = {
  0: { en: 'Part Zero: The Cosmic Courtroom', ar: 'الجزء الصفر: غرفة المحاكمة الكونية' },
  1: { en: 'Part One: The First Crime (Source Code)', ar: 'الجزء الأول: الجريمة الأولى (الشيفرة المصدرية)' },
  2: { en: 'Part Two: The Golden Calf', ar: 'الجزء الثاني: العجل الذهبي' },
  3: { en: 'Part Three: The Council of Nicaea', ar: 'الجزء الثالث: مجمع نيقية' },
  4: { en: 'Part Four: Andalusia & the 20th Century', ar: 'الجزء الرابع: الأندلس والقرن العشرون' },
  5: { en: 'Part Five: Karbala', ar: 'الجزء الخامس: معركة كربلاء' },
  6: { en: 'Part Six: Witnesses for the Defense', ar: 'الجزء السادس: شهود الدفاع' },
};

export function getScene(sceneId: string): Scene | undefined {
  return SCENES[sceneId];
}

export function getNextScene(scene: Scene, choiceId?: string): string | undefined {
  if (choiceId && scene.choices) {
    const choice = scene.choices.find((c) => c.id === choiceId);
    if (choice?.nextSceneId) return choice.nextSceneId;
  }
  return scene.defaultNextScene;
}

export function getAllSceneIds(): string[] {
  return Object.keys(SCENES);
}

export function getScenesByPart(part: number): Scene[] {
  return Object.values(SCENES).filter((s) => s.part === part);
}
