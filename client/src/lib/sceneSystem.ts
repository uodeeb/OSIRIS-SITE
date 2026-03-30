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
      {
        character: 'Narrator',
        text: 'London. The present. Yahya Al-Sulaimani stares at his screens with exhausted eyes.',
        arabicText: 'لندن. الحاضر. كان يحيى يحدق في الشاشات أمامه بعينين متعبتين.',
        duration: 4000,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'Numbers do not lie — so he always believed. Humans are merely data points whose behavior can be predicted if you have the right algorithm.',
        arabicText: 'الأرقام لا تكذب، هكذا كان يؤمن دائماً. البشر مجرد نقاط بيانات يمكن التنبؤ بسلوكها إذا امتلكت الخوارزمية الصحيحة.',
        duration: 5000,
      },
      {
        character: 'Laila',
        text: 'Yahya, are you alright? You did not come to today\'s seminar.',
        arabicText: 'يحيى، هل أنت بخير؟ لم تحضر ندوة اليوم.',
        duration: 3000,
      },
      {
        character: 'Yahya',
        text: 'I am fine, Laila. Just... reviewing some old data. I cannot stop thinking about Tarek.',
        arabicText: 'أنا بخير يا ليلى. فقط... أراجع بعض البيانات القديمة. لا أستطيع التوقف عن التفكير في طارق.',
        duration: 4000,
      },
      {
        character: 'Laila',
        text: 'Yahya, please. The police closed the file. Tarek was under pressure...',
        arabicText: 'يحيى، أرجوك. الشرطة أغلقت الملف. طارق كان يعاني من ضغوط...',
        duration: 3500,
      },
      {
        character: 'Yahya',
        text: 'Tarek was not depressed. Tarek was afraid. There is a difference.',
        arabicText: 'طارق لم يكن مكتئباً. طارق كان خائفاً. هناك فرق.',
        duration: 3000,
      },
      {
        character: 'Narrator',
        text: 'Before Laila could answer, a side screen flashed crimson red. A notification from an encrypted protocol — a protocol only he and Tarek knew.',
        arabicText: 'قبل أن تجيب ليلى، ومضت الشاشة الجانبية باللون الأحمر القاني. إشعار من بروتوكول مشفر، بروتوكول كان هو وطارق فقط يعرفانه.',
        duration: 5000,
      },
      {
        character: 'Narrator',
        text: 'Yahya\'s heart stopped for a moment.',
        arabicText: 'توقف نبض يحيى للحظة.',
        duration: 2500,
      },
      {
        character: 'Narrator',
        text: 'The sender: unknown. But the encryption... it was Tarek\'s digital signature.',
        arabicText: 'المرسل: مجهول. لكن التشفير... إنه توقيع طارق الرقمي.',
        duration: 4000,
      },
      {
        character: 'Tarek',
        text: 'Evil is not random, Yahya. It is a program. I found the source code. Open OSIRIS.',
        arabicText: 'الشر ليس عشوائياً يا يحيى. إنه كود برمجي. لقد وجدت الشيفرة المصدرية. افتح أوزيريس.',
        duration: 4500,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya\'s room dissolved from his consciousness. The screen swallowed all the light. No operating system, no files, no internet. Only this black void, and a white pulse.',
        arabicText: 'تلاشت غرفة يحيى من وعيه. الشاشة أمامه ابتلعت كل الضوء في الغرفة. لم يعد هناك نظام تشغيل، ولا ملفات، ولا إنترنت. فقط هذا الفراغ الأسود، والنبض الأبيض.',
        duration: 5000,
        delay: 1000,
      },
      {
        character: 'OSIRIS',
        text: 'File Number: One.',
        arabicText: 'الملف رقم: واحد.',
        duration: 2500,
      },
      {
        character: 'OSIRIS',
        text: 'The Accused: Humanity.',
        arabicText: 'المتهم: الإنسان.',
        duration: 2500,
      },
      {
        character: 'OSIRIS',
        text: 'The Prosecutor: I.',
        arabicText: 'المدّعي: أنا.',
        duration: 2500,
      },
      {
        character: 'OSIRIS',
        text: 'The Charge: Unfitness for honor.',
        arabicText: 'الاتهام: عدم الأهلية للتكريم.',
        duration: 2500,
      },
      {
        character: 'OSIRIS',
        text: 'The Evidence: Six thousand years of documented history.',
        arabicText: 'الأدلة: ستة آلاف سنة من التاريخ الموثق.',
        duration: 3000,
      },
      {
        character: 'Yahya',
        text: 'Who are you?',
        arabicText: 'من أنت؟',
        duration: 2000,
      },
      {
        character: 'OSIRIS',
        text: 'I am the cosmic attorney. You call me by many names, and picture me as a monster with horns and fire. But the truth is far simpler than that, Yahya. I am not a monster. I am merely a quality assurance inspector — a QA.',
        arabicText: 'أنا المحامي الكوني. أنتم تسمونني بأسماء كثيرة، وتصورونني كوحش بقرون ونار. لكن الحقيقة أبسط من ذلك بكثير يا يحيى. أنا لست وحشاً، أنا مجرد مدقق جودة.',
        duration: 6000,
      },
      {
        character: 'OSIRIS',
        text: 'I was asked to bow before a creature of clay, and I objected. I said it would corrupt the earth and shed blood. I was told: "I know what you do not know."',
        arabicText: 'لقد طُلب مني السجود لكائن من طين، فاعترضت. قلت إنه سيفسد فيها ويسفك الدماء. قيل لي: إني أعلم ما لا تعلمون.',
        duration: 6000,
      },
      {
        character: 'OSIRIS',
        text: 'So I decided to prove my point. I did not use magic. I did not force anyone to do anything. I designed a very simple algorithm — one single line of code — and planted it in your operating system. Just one line: "I am better than him."',
        arabicText: 'لذلك، قررت أن أثبت وجهة نظري. لم أستخدم السحر، ولم أجبر أحداً على شيء. لقد صممت خوارزمية بسيطة جداً، سطر واحد من الكود، وزرعته في نظام تشغيلكم. سطر واحد فقط: أنا خير منه.',
        duration: 7000,
      },
      {
        character: 'OSIRIS',
        text: 'This single line of code is the source code of every drop of blood spilled on this earth. From the first stone that crushed a brother\'s skull, to the last bomb dropped on a city. You do not need a devil to tempt you... you only need someone to tell you that you are better than others, and you will do the rest yourselves.',
        arabicText: 'هذا السطر البرمجي البسيط هو الشيفرة المصدرية لكل دماء سُفكت على هذه الأرض. من أول حجر هُشم به رأس أخ، إلى آخر قنبلة أُلقيت على مدينة. أنتم لا تحتاجون إلى شيطان ليغويكم... أنتم فقط تحتاجون إلى من يخبركم أنكم أفضل من الآخرين، وستقومون بالباقي بأنفسكم.',
        duration: 9000,
      },
      {
        character: 'OSIRIS',
        text: 'Tarek saw the pattern. Tarek understood the algorithm. And for that reason... Tarek is no longer here.',
        arabicText: 'طارق رأى النمط. طارق فهم الخوارزمية. ولهذا السبب... لم يعد طارق هنا.',
        duration: 5000,
      },
      {
        character: 'Yahya',
        text: 'What did you do to Tarek?!',
        arabicText: 'ماذا فعلت بطارق؟!',
        duration: 2500,
      },
      {
        character: 'OSIRIS',
        text: 'Me? I did nothing. Your own kind did it. Do you want to see how the algorithm works, Yahya? Do you have the courage to open the files and see the naked truth? Or will you close the screen and return to your dead numbers?',
        arabicText: 'أنا؟ لم أفعل شيئاً. أتباعي من بني جنسك هم من فعلوا. هل تريد أن ترى كيف تعمل الخوارزمية يا يحيى؟ هل تملك الشجاعة لفتح الملفات ورؤية الحقيقة العارية؟ أم ستغلق الشاشة وتعود إلى أرقامك الميتة؟',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'London. Three years ago. A quiet café. Tarek — 28 years old, a brilliant programmer full of passion — stirs his coffee nervously, his eyes glowing with the enthusiasm of a young man about to change the world.',
        arabicText: 'لندن. قبل ثلاث سنوات. مقهى هادئ. كان طارق يقلب ملعقة القهوة بعصبية، عينيه تلمعان بحماس شاب يوشك أن يغير العالم.',
        duration: 5000,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'Before him sat the man who introduced himself as the executive director of a secret research project. Yahya — watching this memory through OSIRIS — could not make out the man\'s features. Every time he tried to focus on his face, the image blurred.',
        arabicText: 'أمامه جلس الرجل الذي قدم نفسه كمدير تنفيذي لمشروع بحثي سري. لم يستطع يحيى أن يحدد ملامح الرجل. كلما حاول التركيز على وجهه، تشوشت الصورة.',
        duration: 6000,
      },
      {
        character: 'First Engineer',
        text: 'We are not looking for just a programmer, Tarek. We are looking for a philosopher who writes code. The world suffers from chaos, hatred, polarization. What if we could design an algorithm that understands human pain... and heals it?',
        arabicText: 'نحن لا نبحث عن مجرد مبرمج يا طارق. نحن نبحث عن فيلسوف يكتب الكود. العالم يعاني من الفوضى، الكراهية، الاستقطاب. ماذا لو استطعنا تصميم خوارزمية تفهم الألم البشري... وتعالجه؟',
        duration: 6500,
      },
      {
        character: 'Tarek',
        text: 'Better technology for humanity. Not to sell advertisements, but to understand human behavior and improve it.',
        arabicText: 'تكنولوجيا أفضل للبشرية. ليس لبيع الإعلانات، بل لفهم السلوك البشري وتحسينه.',
        duration: 4000,
      },
      {
        character: 'First Engineer',
        text: 'Exactly. We want someone who understands both code and philosophy. Someone like you.',
        arabicText: 'بالضبط. نريد شخصاً يفهم الكود والفلسفة معاً. شخصاً مثلك.',
        duration: 3500,
      },
      {
        character: 'Narrator',
        text: 'Tarek smiled, and swallowed the bait completely.',
        arabicText: 'ابتسم طارق، وقد ابتلع الطُعم بالكامل.',
        duration: 3000,
      },
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
      {
        character: 'Narrator',
        text: 'The company\'s underground laboratories. One year later. Tarek sits alone in the lab at a late hour of the night. The screens before him do not display ordinary code, but neural maps.',
        arabicText: 'مختبرات الشركة تحت الأرض. بعد سنة. طارق يجلس وحيداً في المختبر في ساعة متأخرة من الليل. الشاشات أمامه لا تعرض أكواداً عادية، بل خرائط عصبية.',
        duration: 5500,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'Yahya watched his brother collapse slowly.',
        arabicText: 'كان يحيى يراقب أخاه وهو ينهار ببطء.',
        duration: 3000,
      },
      {
        character: 'Tarek',
        text: 'My God...',
        arabicText: 'يا إلهي...',
        duration: 1500,
      },
      {
        character: 'Tarek',
        text: 'This is not for improving applications. This... this is behavioral modification.',
        arabicText: 'هذا ليس لتحسين التطبيقات. هذا... هذا تعديل سلوكي.',
        duration: 4000,
      },
      {
        character: 'Narrator',
        text: 'Tarek opened a secret file named "Project OSIRIS". He read aloud, as if talking to himself: "Objective: Neural engineering. Control human thought patterns by manipulating dopamine and cortisol frequencies. Implant specific thoughts without the user\'s awareness."',
        arabicText: 'فتح طارق ملفاً سرياً يحمل اسم "مشروع أوزيريس". قرأ بصوت مسموع: "الهدف: الهندسة العصبية. التحكم بأنماط التفكير البشري من خلال التلاعب بترددات الدوبامين والكورتيزول. زرع أفكار محددة دون وعي المستخدم."',
        duration: 7000,
      },
      {
        character: 'Narrator',
        text: 'Tarek realized the horrifying truth. He had not been building a tool to understand humans — he had been building a digital prison for their minds. The algorithm he wrote was being used to amplify narcissism, to divide people, to make them hate each other... because hatred keeps eyes glued to screens.',
        arabicText: 'أدرك طارق الحقيقة المرعبة. هو لم يكن يبني أداة لفهم البشر، بل كان يبني سجناً رقمياً لعقولهم. الخوارزمية التي كتبها كانت تُستخدم لتعزيز النرجسية، لتقسيم الناس، لجعلهم يكرهون بعضهم البعض... لأن الكراهية تُبقي العيون ملتصقة بالشاشات.',
        duration: 8000,
      },
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
      {
        character: 'Narrator',
        text: 'Tarek\'s apartment. Days before his death. Tarek is frantically packing hard drives into a bag, glancing around his dark apartment as if the walls were watching him.',
        arabicText: 'شقة طارق. قبل أيام من وفاته. كان طارق يجمع أقراصاً صلبة ويضعها في حقيبته بسرعة جنونية. كان يتلفت حوله في شقته المظلمة وكأن الجدران تراقبه.',
        duration: 5500,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'Suddenly, his laptop screen lit up on its own. A single message appeared:',
        arabicText: 'وفجأة، أضاءت شاشة حاسوبه المحمول من تلقاء نفسها. ظهرت رسالة واحدة:',
        duration: 3500,
      },
      {
        character: 'OSIRIS',
        text: 'Where are you going, Tarek? We know what you think before you think it.',
        arabicText: 'إلى أين تذهب يا طارق؟ نحن نعرف ما تفكر فيه قبل أن تفكر فيه.',
        duration: 4000,
      },
      {
        character: 'Narrator',
        text: 'Tarek backed against the wall. The horrifying realization struck him like lightning: you cannot escape from a company that owns your brain data. They know his preferences, his fears, his sleep patterns, and even his heart rate. He is a prisoner in his own body.',
        arabicText: 'تراجع طارق إلى الوراء، واصطدم بالجدار. الإدراك المرعب ضربه كصاعقة: لا يمكنك الهروب من شركة تملك بيانات دماغك. هم يعرفون تفضيلاته، مخاوفه، أنماط نومه، وحتى معدل نبضات قلبه. هو سجين في جسده.',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'The rooftop of a tall building in London. Night. The city\'s lights below look like a digital spider\'s web. Tarek stands at the edge. He is not crying. He is eerily calm.',
        arabicText: 'سطح مبنى عالٍ في لندن. ليلاً. أضواء المدينة في الأسفل تبدو كشبكة عنكبوتية رقمية. وقف طارق على حافة السطح. لم يكن يبكي. كان هادئاً بشكل مخيف.',
        duration: 6000,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'He took out his phone, and wrote his last message. An encrypted message that no one could decode except one person: his brother Yahya.',
        arabicText: 'أخرج هاتفه، وكتب رسالته الأخيرة. رسالة مشفرة لا يستطيع أحد فكها سوى شخص واحد: أخوه يحيى.',
        duration: 5000,
      },
      {
        character: 'Tarek',
        text: 'Brother... If you receive this message, I am no longer here. They gave me a choice: be a slave in their system, or die. I chose death... but I will not go silently. The code is in your hands now. Use it. Do not surrender.',
        arabicText: 'أخي... إذا وصلت إليك هذه الرسالة، فأنا لم أعد هنا. لقد خيروني بين أن أكون عبداً في نظامهم، أو أن أموت. اخترت الموت... لكنني لن أذهب بصمت. الكود بين يديك الآن. استخدمه. لا تستسلم.',
        duration: 7000,
      },
      {
        character: 'Narrator',
        text: 'He pressed send. The screen flashed: "Sent".',
        arabicText: 'ضغط على زر الإرسال. ومضت الشاشة بكلمة: "تم الإرسال".',
        duration: 3000,
      },
      {
        character: 'Narrator',
        text: 'Tarek closed his eyes, and took one step forward.',
        arabicText: 'أغلق طارق عينيه، وأخذ خطوة واحدة إلى الأمام.',
        duration: 3500,
      },
      {
        character: 'Narrator',
        text: 'The simulation ended. Yahya returned to consciousness in his room, tears streaming down his face. His brother did not take his own life to escape. His brother died to protect the truth.',
        arabicText: 'انتهت المحاكاة. عاد يحيى إلى وعيه في غرفته، والدموع تنهمر على وجهه. أخوه لم ينتحر هرباً من الحياة. أخوه مات ليحمي الحقيقة.',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya is running. His elderly neighbor, Mr. Smith — who sometimes fed his cat — had tried to stab him with a kitchen knife minutes ago. The old man\'s eyes were empty, as if hypnotized. "Mentally wiped followers," as Tarek had called them in his notes.',
        arabicText: 'كان يحيى يركض. جاره العجوز، السيد سميث، الذي كان يطعمه قطته أحياناً، حاول طعنه بسكين مطبخ قبل دقائق. عينا العجوز كانتا فارغتين، كأنه منوّم مغناطيسياً. "الأتباع الممسوحون دماغياً"، هكذا أسماهم طارق في ملاحظاته.',
        duration: 7000,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'Yahya turned into a narrow alley, and suddenly a hand reached from the darkness and pulled him inside.',
        arabicText: 'انعطف يحيى في زقاق ضيق، وفجأة امتدت يد من الظلام وسحبته إلى الداخل.',
        duration: 4000,
      },
      {
        character: 'Laila',
        text: 'Be quiet if you want to live, Dr. Al-Sulaimani.',
        arabicText: 'اصمت إذا كنت تريد أن تعيش، دكتور سليماني.',
        duration: 3000,
      },
      {
        character: 'Narrator',
        text: 'A young woman with sharp, intelligent eyes. She led him through underground passages until they reached a room filled with ancient books and cooled computer servers.',
        arabicText: 'كانت فتاة شابة، عيناها حادتان وذكيتان. قادته عبر ممرات تحت الأرض حتى وصلا إلى غرفة مليئة بالكتب القديمة والخوادم الحاسوبية المبردة.',
        duration: 5500,
      },
      {
        character: 'Yahya',
        text: 'Who are you?',
        arabicText: 'من أنتِ؟',
        duration: 2000,
      },
      {
        character: 'Laila',
        text: 'My name is Laila. A researcher in religious psychology. I have been following your brother\'s work.',
        arabicText: 'اسمي ليلى. باحثة في علم النفس الديني. وكنت أتابع عمل أخيك.',
        duration: 3500,
      },
      {
        character: 'Yahya',
        text: 'Religious psychology? I am a man of numbers. I do not believe in myths.',
        arabicText: 'علم نفس ديني؟ أنا رجل أرقام. لا أؤمن بالخرافات.',
        duration: 3000,
      },
      {
        character: 'Laila',
        text: 'The numbers you worship are the ones trying to kill you now. Your brother realized the problem is not technical, but spiritual. The algorithm he discovered does not infiltrate computers — it infiltrates souls. You have the mind to solve it. I have the spirit.',
        arabicText: 'الأرقام التي تعبدها هي التي تحاول قتلك الآن. أخوك أدرك أن المشكلة ليست تقنية، بل روحية. الخوارزمية التي اكتشفها لا تخترق الحواسيب، بل تخترق النفوس. أنت تملك العقل لتحليها. أنا أملك الروح.',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya sat before the servers and began entering Tarek\'s code.',
        arabicText: 'جلس يحيى أمام الخوادم، وبدأ في إدخال كود طارق.',
        duration: 3500,
        delay: 1000,
      },
      {
        character: 'Laila',
        text: 'What exactly is this system?',
        arabicText: 'ما هذا النظام بالضبط؟',
        duration: 2500,
      },
      {
        character: 'Yahya',
        text: 'OSIRIS. A quantum sensing system. It does not reconstruct the past from history books. It reads the quantum waves left in the universe. Every event, every crime, every word spoken — leaves a vibration in the fabric of reality, like ripples in a pond. OSIRIS reads these waves, translates them into data, then transmits them to our senses as a simulation.',
        arabicText: 'أوزيريس. نظام استشعار كمي. هو لا يعيد بناء الماضي من كتب التاريخ. هو يقرأ موجات الكم التي تُركت في الكون. كل حدث، كل جريمة، كل كلمة قيلت، تترك اهتزازة في نسيج الواقع، مثل تموجات في بركة ماء. أوزيريس يقرأ هذه الموجات، يترجمها إلى بيانات، ثم ينقلها إلى حواسنا كمحاكاة.',
        duration: 9000,
      },
      {
        character: 'Laila',
        text: 'So we will witness history as it truly happened?',
        arabicText: 'إذن، نحن سنشهد التاريخ كما حدث فعلاً؟',
        duration: 3000,
      },
      {
        character: 'Yahya',
        text: 'We will live it.',
        arabicText: 'بل سنعيشه.',
        duration: 2000,
      },
      {
        character: 'Narrator',
        text: 'Yahya pressed Enter. "Let us begin from where everything began. The first crime."',
        arabicText: 'ضغط يحيى على زر الإدخال. "لنبدأ من حيث بدأ كل شيء. الجريمة الأولى."',
        duration: 4000,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya and Laila found themselves standing in a space with no walls. There was no sky or ground, only pure light that breathed.',
        arabicText: 'وجد يحيى وليلى نفسيهما يقفان في فضاء لا تحده جدران. لم يكن هناك سماء أو أرض، بل نور نقي يتنفس.',
        duration: 5000,
        delay: 1500,
      },
      {
        character: 'Laila',
        text: 'Where are we?',
        arabicText: 'أين نحن؟',
        duration: 2000,
      },
      {
        character: 'Yahya',
        text: 'We are at point zero. Before the beginning of human time.',
        arabicText: 'نحن في نقطة الصفر. قبل بدء الزمن البشري.',
        duration: 3500,
      },
      {
        character: 'Narrator',
        text: 'Suddenly, the space shook. They felt a cosmic command — not a sound, but an absolute will filling existence: bow before the new being made of clay.',
        arabicText: 'فجأة، اهتز الفضاء. شعرا بأمر كوني، ليس صوتاً، بل إرادة مطلقة تملأ الوجود: السجود للكائن الجديد المصنوع من طين.',
        duration: 6000,
      },
      {
        character: 'Narrator',
        text: 'They saw waves of light bowing in perfect obedience. A perfect cosmic harmony.',
        arabicText: 'رأيا موجات من النور تنحني في طاعة تامة. انسجام كوني مثالي.',
        duration: 4000,
      },
      {
        character: 'Narrator',
        text: 'But... in the midst of this harmony, a black point appeared. An anomaly in the frequency. It was not a monster. It was an ancient consciousness, refusing to bow.',
        arabicText: 'لكن... في وسط هذا الانسجام، ظهرت نقطة سوداء. شذوذ في التردد. لم يكن وحشاً. كان وعياً قديماً، يرفض الانحناء.',
        duration: 6000,
      },
      {
        character: 'OSIRIS',
        text: 'I am better than him. You created me from fire and created him from clay.',
        arabicText: 'أنا خير منه. خلقتني من نار وخلقته من طين.',
        duration: 4000,
      },
      {
        character: 'Yahya',
        text: 'My God... it is not just a rebellion. It is logic. Corrupt logic, but logic. It is comparing raw materials — fire and clay — to conclude superiority.',
        arabicText: 'يا إلهي... إنه ليس مجرد تمرد. إنه منطق. منطق فاسد، لكنه منطق. إنه يقارن المواد الخام — النار والطين — ليستنتج الأفضلية.',
        duration: 6000,
      },
      {
        character: 'Laila',
        text: 'This is the moment. The birth of arrogance. The birth of "I am better than him."',
        arabicText: 'هذه هي اللحظة. ولادة الكبر. ولادة "أنا خير منه".',
        duration: 4000,
      },
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
      {
        character: 'Narrator',
        text: 'The scene changed. The luminous space disappeared, replaced by a visual representation of "the oath of Iblis." Yahya saw the words forming as complex code, weaving itself around a three-dimensional model of the human mind.',
        arabicText: 'تغير المشهد. الفضاء النوراني اختفى، وحل محله تمثيل بصري لـ "قَسَم إبليس". رأى يحيى الكلمات تتشكل ككود برمجي معقد، ينسج نفسه حول نموذج ثلاثي الأبعاد للعقل البشري.',
        duration: 6000,
        delay: 1000,
      },
      {
        character: 'Yahya',
        text: 'Look, Laila. He is not planning to destroy humanity by force. He is designing an algorithm. A six-axis plan.',
        arabicText: 'انظري يا ليلى. إنه لا يخطط لتدمير البشرية بالقوة. إنه يصمم خوارزمية. خطة عمل من ستة محاور.',
        duration: 5000,
      },
      {
        character: 'OSIRIS',
        text: 'Axis One: Arrogance — plant "I am better than him" as a core database.',
        arabicText: 'المحور الأول: الكبر — زرع فكرة "أنا خير منه" كقاعدة بيانات أساسية.',
        duration: 4000,
      },
      {
        character: 'OSIRIS',
        text: 'Axis Two: Desire — transform the human from a being with purpose (vicegerent) to a consumer of pleasure.',
        arabicText: 'المحور الثاني: الشهوة — تحويل الإنسان من كائن ذي غاية (خليفة) إلى مستهلك للمتعة.',
        duration: 4500,
      },
      {
        character: 'OSIRIS',
        text: 'Axis Three: Lie — distort truths until falsehood becomes logical.',
        arabicText: 'المحور الثالث: الكذب — تشويه الحقائق حتى يصبح الباطل منطقياً.',
        duration: 4000,
      },
      {
        character: 'OSIRIS',
        text: 'Axis Four: Division — destroy the concept of "we" and replace it with "I against everyone."',
        arabicText: 'المحور الرابع: الفرقة — تدمير مفهوم "نحن" واستبداله بـ "أنا ضد الجميع".',
        duration: 4000,
      },
      {
        character: 'OSIRIS',
        text: 'Axis Five: Despair — sever the connection with the Creator through hopelessness.',
        arabicText: 'المحور الخامس: اليأس — قطع الاتصال بالخالق عبر القنوط.',
        duration: 4000,
      },
      {
        character: 'OSIRIS',
        text: 'Axis Six: Doubt — continuous questioning of all that is fixed and certain.',
        arabicText: 'المحور السادس: الشبهة — التشكيك المستمر في الثوابت.',
        duration: 4000,
      },
      {
        character: 'Laila',
        text: 'This is not just an ancient diabolical plan. This is exactly how social media algorithms work today! Amplifying narcissism (arrogance), addiction (desire), fake news (lying), echo chambers and polarization (division).',
        arabicText: 'هذه ليست مجرد خطة شيطانية قديمة. هذه هي بالضبط الطريقة التي تعمل بها خوارزميات وسائل التواصل الاجتماعي اليوم! تعزيز النرجسية (الكبر)، الإدمان (الشهوة)، الأخبار المزيفة (الكذب)، غرف الصدى والاستقطاب (الفرقة).',
        duration: 8000,
      },
      {
        character: 'Yahya',
        text: 'Tarek was right. The devil did not need to invent a new weapon. He only waited until we invented the technology that automated his ancient algorithm. We built the new golden calf ourselves.',
        arabicText: 'طارق كان محقاً. الشيطان لم يحتج إلى اختراع سلاح جديد. لقد انتظر فقط حتى نخترع نحن التكنولوجيا التي تؤتمت خوارزميته القديمة. نحن من صنعنا العجل الذهبي الجديد.',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'Sinai Desert. The 13th century BC. OSIRIS simulation. Yahya and Laila stood amid a sea of humanity stretching across the desert. The euphoria of escaping Pharaoh and crossing the sea had faded, replaced by something far harsher: the void.',
        arabicText: 'صحراء سيناء. القرن الثالث عشر قبل الميلاد. محاكاة أوزيريس. وقف يحيى وليلى وسط المحاكاة، يشاهدان بحر البشر الممتد في الصحراء. كانت نشوة النجاة من فرعون وعبور البحر قد تلاشت، وحل محلها شيء أشد قسوة: الفراغ.',
        duration: 7000,
        delay: 1500,
      },
      {
        character: 'Laila',
        text: 'Moses has been absent for weeks. They had grown accustomed to slavery in Egypt. Slavery is harsh, but it provides certainty: you know when to wake up, what to do, and what to eat. Absolute freedom in this desert... is terrifying.',
        arabicText: 'موسى غائب منذ أسابيع. لقد اعتادوا على العبودية في مصر. العبودية قاسية، لكنها توفر اليقين: أنت تعرف متى تستيقظ، ماذا تعمل، وماذا تأكل. الحرية المطلقة في هذه الصحراء... مرعبة.',
        duration: 7000,
      },
      {
        character: 'Narrator',
        text: 'Yahya pointed to a man standing on a high rock, watching the crowds with eyes that analyzed the situation with mathematical precision. He did not look like an evil sorcerer, but like an engineer studying a problem that needed a solution.',
        arabicText: 'أشار يحيى إلى رجل يقف على صخرة مرتفعة، يراقب الحشود بعينين تحللان الموقف بدقة رياضية. لم يكن يبدو كساحر شرير، بل كمهندس يدرس مشكلة تحتاج إلى حل.',
        duration: 6000,
      },
      {
        character: 'Yahya',
        text: 'The Samaritan.',
        arabicText: 'السامري.',
        duration: 2000,
      },
      {
        character: 'Samaritan',
        text: 'You are afraid. That is natural. The God who brought you out of Egypt is a great God, but He is... invisible. Abstract. You cannot touch Him or see Him. And you need something to reassure you now, in this void.',
        arabicText: 'أنتم خائفون. هذا طبيعي. الإله الذي أخرجكم من مصر إله عظيم، لكنه... غير مرئي. مجرد. لا يمكنكم لمسه أو رؤيته. وأنتم تحتاجون إلى شيء يطمئنكم الآن، في هذا الفراغ.',
        duration: 6500,
      },
      {
        character: 'Narrator',
        text: 'He did not ask them to disbelieve. He did not ask them to worship a devil. He offered them a "practical solution" to their spiritual anxiety.',
        arabicText: 'لم يطلب منهم الكفر. لم يطلب منهم عبادة شيطان. لقد قدم لهم "حلاً عملياً" لقلقهم الروحي.',
        duration: 5000,
      },
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
      {
        character: 'Yahya',
        text: 'He is not making a god, Laila. He is making an icon. A comfortable system that relieves them of the responsibility of thinking and abstract faith.',
        arabicText: 'إنه لا يصنع إلهاً يا ليلى. إنه يصنع أيقونة. نظاماً مريحاً يعفيهم من مسؤولية التفكير والإيمان التجريدي.',
        duration: 5500,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'When the golden calf was complete, it was not just a silent statue. Through the Samaritan\'s engineering and air currents, the calf emitted a sound — a lowing — that seemed alive.',
        arabicText: 'عندما اكتمل العجل الذهبي، لم يكن مجرد تمثال صامت. بفضل هندسة السامري وتيارات الهواء، كان العجل يصدر صوتاً (خواراً) يبدو وكأنه حي.',
        duration: 5500,
      },
      {
        character: 'Narrator',
        text: 'The crowds erupted in hysterical euphoria. They began dancing around the calf. They were no longer frightened individuals — they had become a "herd" unified around a material symbol.',
        arabicText: 'انفجرت الحشود في نشوة هستيرية. بدأوا يرقصون حول العجل. لم يعودوا أفراداً خائفين، بل أصبحوا "قطيعاً" موحداً حول رمز مادي.',
        duration: 6000,
      },
      {
        character: 'Yahya',
        text: 'This is terrifying. The Samaritan is the first UI/UX designer in history. He designed a simple, easy-to-use material interface for a complex God.',
        arabicText: 'هذا مرعب. السامري هو أول مهندس واجهات مستخدم في التاريخ. لقد صمم واجهة مادية سهلة الاستخدام لإله معقد.',
        duration: 6000,
      },
      {
        character: 'Yahya',
        text: 'The algorithm does not force anyone. It only offers you what you think you desperately need.',
        arabicText: 'الخوارزمية لا تجبر أحداً. هي فقط تقدم لك ما تظن أنك تحتاجه بشدة.',
        duration: 4500,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya stopped the simulation. He was breathing with difficulty. He took out a small hard drive from his bag — one of the drives Tarek had left.',
        arabicText: 'أوقف يحيى المحاكاة. كان يتنفس بصعوبة. أخرج قرصاً صلباً صغيراً من حقيبته، أحد الأقراص التي تركها طارق.',
        duration: 5000,
        delay: 1000,
      },
      {
        character: 'Yahya',
        text: 'There is a recording of Tarek linked to this part of the code. I did not understand it before. Now... I think I will.',
        arabicText: 'هناك تسجيل لطارق مرتبط بهذا الجزء من الكود. لم أفهمه من قبل. الآن... أعتقد أنني سأفهم.',
        duration: 4500,
      },
      {
        character: 'Tarek',
        text: 'Yahya... if you are listening to this, you may have seen the Samaritan simulation. Do you know what is truly terrifying? The Samaritan needed to gather gold, melt metals, and wait for Moses\' absence to build his calf. But us? We built a golden calf in the pocket of every human being on this planet.',
        arabicText: 'يحيى... إذا كنت تستمع لهذا، فربما تكون قد رأيت محاكاة السامري. هل تعرف ما هو المرعب حقاً؟ السامري كان يحتاج إلى جمع الذهب، وصهر المعادن، وانتظار غياب موسى ليصنع عجله. أما نحن؟ نحن صنعنا عجلاً ذهبياً في جيب كل إنسان على هذا الكوكب.',
        duration: 9000,
      },
      {
        character: 'Tarek',
        text: 'The addiction algorithms we wrote... the likes, the red notifications, the infinite scroll. They all work by the same psychological mechanism as the golden calf. We exploit the spiritual void of modern man, his anxiety, his loneliness... and offer him fake material rewards. Drops of dopamine that keep him glued to the screen, dancing around the digital calf, voluntarily surrendering his freedom and will.',
        arabicText: 'خوارزميات الإدمان التي كتبناها... الإعجابات، الإشعارات الحمراء، التمرير اللانهائي. كلها تعمل بنفس الآلية السيكولوجية للعجل الذهبي. نحن نستغل الفراغ الروحي للإنسان الحديث، قلقه، وحدته... ونقدم له مكافآت مادية وهمية. قطرات من الدوبامين تبقيه ملتصقاً بالشاشة، يرقص حول العجل الرقمي، متخلياً عن حريته وإرادته طواعية.',
        duration: 10000,
      },
      {
        character: 'Tarek',
        text: 'The only difference, brother... is that the old calf lowed with the sound of wind. Our calf lows with notifications of anger and hatred — because we discovered that anger keeps people connected longer than joy. We are programming humans to hate each other.',
        arabicText: 'الفرق الوحيد يا أخي... أن العجل القديم كان يخور بصوت الريح. عجلنا نحن يخور بإشعارات الغضب والكراهية، لأننا اكتشفنا أن الغضب يُبقي الناس متصلين لفترة أطول من الفرح. نحن نبرمج البشر ليكرهوا بعضهم.',
        duration: 9000,
      },
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
      {
        character: 'Narrator',
        text: 'The recording ended. A heavy silence fell in the room, broken only by the hum of OSIRIS servers.',
        arabicText: 'انتهى التسجيل. ساد صمت ثقيل في الغرفة، لم يقطعه سوى طنين خوادم أوزيريس.',
        duration: 4500,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'For the first time in years — since he had decided that numbers were the only truth — Yahya broke down. He covered his face with his hands and began to cry. Not a loud cry, but the muffled sobbing of a man who realized that everything he had built in his professional life had been part of a machine of destruction.',
        arabicText: 'لأول مرة منذ سنوات، منذ أن قرر أن الأرقام هي الحقيقة الوحيدة، انهار يحيى. غطى وجهه بيديه وبدأ يبكي. لم يكن بكاءً صاخباً، بل نشيجاً مكتوماً لرجل أدرك أن كل ما بناه في حياته المهنية كان جزءاً من آلة دمار.',
        duration: 8000,
      },
      {
        character: 'Yahya',
        text: 'Tarek was the Moses of his age. He tried to smash the digital calf... and they killed him.',
        arabicText: 'طارق كان موسى عصره. حاول تحطيم العجل الرقمي... فقتلوه.',
        duration: 4500,
      },
      {
        character: 'Laila',
        text: 'Crying will not bring Tarek back. And it will not stop the First Engineer. You have OSIRIS now. You have the source code.',
        arabicText: 'البكاء لن يعيد طارق. ولن يوقف المهندس الأول. أنت تملك أوزيريس الآن. تملك الشيفرة المصدرية.',
        duration: 5500,
      },
      {
        character: 'Yahya',
        text: 'I will destroy them. I will use OSIRIS to hack their servers and expose everything.',
        arabicText: 'سأدمرهم. سأستخدم أوزيريس لاختراق خوادمهم وفضح كل شيء.',
        duration: 4000,
      },
      {
        character: 'Laila',
        text: 'A direct attack will not work. You are dealing with an entity that owns the world\'s data. We must understand the enemy first. We must see how they infiltrate great institutions from within. How they turn truth into falsehood in the name of the sacred.',
        arabicText: 'الهجوم المباشر لن ينجح. أنت تتعامل مع كيان يمتلك بيانات العالم بأسره. يجب أن نفهم الخصم أولاً. يجب أن نرى كيف يخترقون المؤسسات الكبرى من الداخل. كيف يحولون الحق إلى باطل باسم المقدس.',
        duration: 7000,
      },
      {
        character: 'Laila',
        text: 'To the moment when religion was stolen. To Nicaea.',
        arabicText: 'إلى اللحظة التي سُرق فيها الدين. إلى نيقية.',
        duration: 3500,
      },
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
      {
        character: 'Narrator',
        text: 'Rome / Alexandria. One month before the Council of Nicaea, 325 AD. OSIRIS simulation. Yahya programmed OSIRIS to return to 325 AD. The simulation did not show horned demons, but simple men in rough robes, sitting in candlelit rooms, arguing passionately.',
        arabicText: 'روما / الإسكندرية. قبل شهر من مجمع نيقية 325م. محاكاة أوزيريس. برمج يحيى أوزيريس للعودة إلى عام 325 ميلادية. لم تظهر المحاكاة شياطين بقرون، بل رجالاً بسطاء يرتدون أثواباً خشنة، يجلسون في غرف مضاءة بالشموع، يتجادلون بشغف.',
        duration: 7000,
        delay: 1500,
      },
      {
        character: 'Yahya',
        text: 'I thought we would see an evil conspiracy from the start.',
        arabicText: 'كنت أظن أننا سنرى مؤامرة شريرة منذ البداية.',
        duration: 3000,
      },
      {
        character: 'Laila',
        text: 'That is the trap, Yahya. The disagreements at the start were genuine. Theology is difficult. Attempting to understand the nature of the Creator is not easy. Look at them... they are not seeking power, they are sincerely trying to understand the truth.',
        arabicText: 'هذا هو الفخ يا يحيى. الخلافات في البداية كانت حقيقية. اللاهوت صعب. محاولة فهم طبيعة الخالق ليست أمراً سهلاً. انظر إليهم... إنهم لا يسعون للسلطة، إنهم يحاولون بصدق فهم الحقيقة.',
        duration: 7000,
      },
      {
        character: 'Arius',
        text: 'If the Son was begotten, then he has a beginning, and therefore there was a time when he did not exist. God alone is eternal.',
        arabicText: 'إذا كان الابن مولوداً، فله بداية، وبالتالي كان هناك وقت لم يكن فيه موجوداً. الله وحده هو الأزلي.',
        duration: 5000,
      },
      {
        character: 'Athanasius',
        text: 'If the Son is not fully God, how can he save humanity? Salvation requires a God, not a creature.',
        arabicText: 'إذا لم يكن الابن إلهاً كاملاً، فكيف يمكنه أن يخلص البشرية؟ الخلاص يتطلب إلهاً، لا مخلوقاً.',
        duration: 4500,
      },
      {
        character: 'Yahya',
        text: 'Both have logic. The point of disagreement is legitimate. Where is the virus then?',
        arabicText: 'كلاهما يملك منطقاً. نقطة الخلاف شرعية. أين الفيروس إذن؟',
        duration: 3500,
      },
      {
        character: 'Laila',
        text: 'The virus does not create the disagreement... the virus waits until both sides are exhausted, then offers them "power" as the final solution to settle the debate.',
        arabicText: 'الفيروس لا يخلق الخلاف... الفيروس ينتظر حتى يتعب الطرفان، ثم يقدم لهم "السلطة" كحل نهائي لحسم النقاش.',
        duration: 5500,
      },
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
      {
        character: 'Narrator',
        text: 'Constantine entered the hall with imperial grandeur. He did not look like a religious man, but like a military general. Behind him, one step back, walked a man in a dark cloak. Yahya could not make out his features clearly, but felt a familiar chill.',
        arabicText: 'دخل قسطنطين القاعة بأبهة إمبراطورية. لم يكن يبدو كرجل دين، بل كجنرال عسكري. خلفه، بخطوة واحدة، سار رجل يرتدي عباءة داكنة. لم يستطع يحيى تمييز ملامحه بوضوح، لكنه شعر بقشعريرة مألوفة.',
        duration: 7000,
        delay: 1000,
      },
      {
        character: 'Yahya',
        text: 'That is him. The Sage. The ancient version of the First Engineer.',
        arabicText: 'هذا هو. الحكيم. النسخة القديمة من المهندس الأول.',
        duration: 3500,
      },
      {
        character: 'Constantine',
        text: 'My empire is being torn apart by your disagreements. I do not care about the details of Christ\'s nature. I care about the unity of Rome. Agree... or I will make you agree.',
        arabicText: 'إمبراطوريتي تتمزق بسبب خلافاتكم. أنا لا أهتم بتفاصيل طبيعة المسيح. أنا أهتم بوحدة روما. اتفقوا... أو سأجعلكم تتفقون.',
        duration: 6000,
      },
      {
        character: 'Narrator',
        text: 'The Sage leaned close to Constantine\'s ear and whispered:',
        arabicText: 'اقترب الحكيم من أذن قسطنطين وهمس:',
        duration: 3000,
      },
      {
        character: 'The Sage',
        text: 'We will draft a single creed of faith. Whoever signs it is a friend of Rome. And whoever refuses... will be exiled and their books burned.',
        arabicText: 'سنصيغ قانون إيمان واحد. من يوقع عليه، فهو صديق لروما. ومن يرفض... سيُنفى وتُحرق كتبه.',
        duration: 5500,
      },
      {
        character: 'Narrator',
        text: 'Yahya and Laila watched as the bishops\' faces transformed from truth-seekers into frightened politicians.',
        arabicText: 'راقب يحيى وليلى كيف تحولت وجوه الأساقفة من باحثين عن الحقيقة إلى سياسيين خائفين.',
        duration: 5000,
      },
      {
        character: 'Laila',
        text: 'Here the virus works. The algorithm did not change the creed directly. The algorithm introduced "power" into the equation. The moment religion was bound to the emperor\'s sword, the spirit died, and the oppressive institution was born.',
        arabicText: 'هنا يعمل الفيروس. الخوارزمية لم تغير العقيدة مباشرة. الخوارزمية أدخلت "السلطة" إلى المعادلة. بمجرد أن ارتبط الدين بسيف الإمبراطور، ماتت الروح، ووُلدت المؤسسة القمعية.',
        duration: 7000,
      },
      {
        character: 'Yahya',
        text: 'Religion was "updated" by imperial decree. Just as we update Terms of Service and force users to agree.',
        arabicText: 'لقد تم "تحديث" الدين بقرار إمبراطوري. تماماً كما نُحدّث نحن شروط الاستخدام ونجبر المستخدمين على الموافقة.',
        duration: 5500,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya stopped the simulation. Laila was trembling, silent tears running down her cheeks.',
        arabicText: 'أوقف يحيى المحاكاة. كانت ليلى ترتجف، ودموع صامتة تنزل على خديها.',
        duration: 4500,
        delay: 1000,
      },
      {
        character: 'Yahya',
        text: 'Laila... are you alright?',
        arabicText: 'ليلى... هل أنتِ بخير؟',
        duration: 2500,
      },
      {
        character: 'Laila',
        text: 'I am fine. This just... reminds me of my mother.',
        arabicText: 'أنا بخير. هذا فقط... يذكرني بأمي.',
        duration: 3000,
      },
      {
        character: 'Laila',
        text: 'My mother was also a victim of "the institution." My father was a man who wore the garb of religion, spoke in verses and hadiths, but was a monster at home. He used religion to justify his cruelty, to make my mother believe that her obedience to his injustice was obedience to God. He violated her soul in the name of the sacred.',
        arabicText: 'أمي كانت ضحية لـ "المؤسسة" أيضاً. أبي كان رجلاً يرتدي عباءة الدين، يتحدث بالآيات والأحاديث، لكنه كان وحشاً في البيت. استخدم الدين ليبرر قسوته، ليجعل أمي تعتقد أن طاعتها لظلمه هي طاعة لله. لقد اغتصب روحها باسم المقدس.',
        duration: 9000,
      },
      {
        character: 'Laila',
        text: 'That is why I studied religious psychology. I wanted to understand: is the flaw in God? Or in us? What we saw in Nicaea confirms what I concluded. God was not defeated in Nicaea, Yahya. "The institution" won temporarily. The virus does not attack God — the virus attacks our representation of God on earth.',
        arabicText: 'لهذا السبب درست علم النفس الديني. كنت أريد أن أفهم: هل الخلل في الله؟ أم فينا؟ ما رأيناه في نيقية يؤكد لي ما توصلت إليه. الله لم يُهزم في نيقية يا يحيى. "المؤسسة" هي التي انتصرت مؤقتاً. الفيروس لا يهاجم الله، الفيروس يهاجم "تمثيلنا" لله على الأرض.',
        duration: 10000,
      },
      {
        character: 'Yahya',
        text: 'You are the spiritual resistance, Laila. You refuse to abandon the truth, even when it is distorted by those who claim to protect it.',
        arabicText: 'أنتِ المقاومة الروحية يا ليلى. أنتِ ترفضين التخلي عن الحقيقة، حتى عندما يتم تشويهها من قبل من يدعون حمايتها.',
        duration: 6000,
      },
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
      {
        character: 'Tarek',
        text: 'Yahya... if you saw Nicaea, you will understand how religions are stolen. But do you know how minds are stolen today? The big tech companies are the new "Church of the Empire." We have our own "creed": recommendation algorithms. We decide what is "truth" and what is "falsehood" based on what generates more engagement.',
        arabicText: 'يحيى... إذا رأيت نيقية، فستفهم كيف تُسرق الأديان. لكن هل تعرف كيف تُسرق العقول اليوم؟ شركات التكنولوجيا الكبرى هي "كنيسة الإمبراطورية" الجديدة. نحن نملك "قانون الإيمان" الخاص بنا: خوارزميات التوصية. نحن نحدد ما هو "الحق" وما هو "الباطل" بناءً على ما يجلب تفاعلاً أكثر.',
        duration: 10000,
        delay: 1000,
      },
      {
        character: 'Tarek',
        text: 'Whoever agrees with us, we grant them access and reach. And whoever disagrees, we apply "digital exile — Shadowbanning." We are the Constantine of the modern age, but we do not use swords... we use dopamine.',
        arabicText: 'من يوافقنا، نمنحه الوصول والانتشار. ومن يخالفنا، نطبق عليه "النفي الرقمي — Shadowbanning". نحن قسطنطين العصر الحديث، لكننا لا نستخدم السيوف... نحن نستخدم الدوبامين.',
        duration: 8000,
      },
      {
        character: 'Yahya',
        text: 'The pattern repeats. The virus evolves. From the golden calf (material), to Nicaea (institutional), to...',
        arabicText: 'النمط يتكرر. الفيروس يتطور. من العجل الذهبي (المادي)، إلى نيقية (المؤسسي)، إلى...',
        duration: 5000,
      },
      {
        character: 'Laila',
        text: 'To ideology. When the virus abandons the need for a god entirely, and man himself becomes the god.',
        arabicText: 'إلى الأيديولوجيا. عندما يتخلى الفيروس عن الحاجة إلى إله تماماً، ويصبح الإنسان هو الإله.',
        duration: 5000,
      },
      {
        character: 'Yahya',
        text: 'To Andalusia... and the twentieth century.',
        arabicText: 'إلى الأندلس... والقرن العشرين.',
        duration: 3000,
      },
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
      {
        character: 'Narrator',
        text: 'OSIRIS transferred Yahya and Laila to the peak of Andalusian civilization. The lit streets of Córdoba, the vast libraries, and universities that preceded Europe by centuries.',
        arabicText: 'نقل أوزيريس يحيى وليلى إلى ذروة الحضارة الأندلسية. شوارع قرطبة المضاءة، المكتبات الضخمة، والجامعات التي سبقت أوروبا بقرون.',
        duration: 6000,
        delay: 1500,
      },
      {
        character: 'Laila',
        text: 'Look at this beauty. How could a civilization of this refinement fall?',
        arabicText: 'انظر إلى هذا الجمال. كيف يمكن لحضارة بهذا الرقي أن تسقط؟',
        duration: 4000,
      },
      {
        character: 'Yahya',
        text: 'The algorithm does not care about beauty. The algorithm searches for the weak point. And here, the weak point was "the ego."',
        arabicText: 'الخوارزمية لا تهتم بالجمال. الخوارزمية تبحث عن نقطة الضعف. وهنا، نقطة الضعف كانت "الأنا".',
        duration: 5000,
      },
      {
        character: 'Narrator',
        text: 'OSIRIS displayed a rapid series of scenes: the Prince of Seville allying with the King of Castile against the Prince of Badajoz. The Prince of Toledo paying tribute to the enemy to protect his throne from his own brother.',
        arabicText: 'عرض أوزيريس سلسلة من المشاهد السريعة: أمير إشبيلية يتحالف مع ملك قشتالة ضد أمير بطليوس. أمير طليطلة يدفع الجزية للعدو ليحمي عرشه من أخيه.',
        duration: 6500,
      },
      {
        character: 'Yahya',
        text: 'Every single one of them says: "I am better than my brother." Personal arrogance became more important than the survival of the nation. The virus here did not need to destroy them from outside. It made them destroy themselves from within.',
        arabicText: 'كل واحد منهم يقول: "أنا خير من أخي". الكبر الشخصي أصبح أهم من بقاء الأمة. الفيروس هنا لم يحتج إلى تدميرهم من الخارج. لقد جعلهم يدمرون أنفسهم من الداخل.',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'Time froze in the simulation at the year 1492. Yahya and Laila saw a man riding his horse, leaving the city of Granada for the last time. The man — Abu Abdullah the Small — turned and looked at the Alhambra Palace receding behind him.',
        arabicText: 'توقف الزمن في المحاكاة عند عام 1492. رأى يحيى وليلى رجلاً يركب حصانه، يغادر مدينة غرناطة للمرة الأخيرة. استدار الرجل — أبو عبد الله الصغير — ونظر إلى قصر الحمراء الذي يبتعد.',
        duration: 7000,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'He could not hold himself back, and began to weep.',
        arabicText: 'لم يتمالك نفسه، وبدأ يبكي.',
        duration: 3000,
      },
      {
        character: 'Aisha al-Hurra',
        text: 'Weep like women for a kingdom you could not defend like men.',
        arabicText: 'ابكِ كالنساء ملكاً لم تحافظ عليه كالرجال.',
        duration: 4000,
      },
      {
        character: 'Laila',
        text: 'This is the final result of the algorithm of arrogance. When you believe you are the most important, you lose everything.',
        arabicText: 'هذه هي النتيجة النهائية لخوارزمية الكبر. عندما تعتقد أنك الأهم، تفقد كل شيء.',
        duration: 5000,
      },
      {
        character: 'OSIRIS',
        text: 'You cannot fix a system infected with the virus of "I am better than them" by using the same virus.',
        arabicText: 'لا يمكنك إصلاح نظام مصاب بفيروس "أنا خير منهم" باستخدام نفس الفيروس.',
        duration: 5000,
      },
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
      {
        character: 'Narrator',
        text: 'The simulation accelerated. OSIRIS leaped centuries forward. Berlin, 1933.',
        arabicText: 'تسارعت المحاكاة. قفز أوزيريس قروناً إلى الأمام. برلين، 1933.',
        duration: 4000,
        delay: 1000,
      },
      {
        character: 'Yahya',
        text: 'The virus evolves, Laila. It has completely abandoned the religious cover. It no longer needs a god to justify arrogance. Man himself has become the god.',
        arabicText: 'الفيروس يتطور يا ليلى. لقد تخلى عن الغطاء الديني تماماً. لم يعد يحتاج إلى إله ليبرر الكبر. أصبح الإنسان نفسه هو الإله.',
        duration: 6000,
      },
      {
        character: 'Narrator',
        text: 'They found themselves in a closed room in Berlin. A man with a distinctive mustache stands before a mirror, practicing his facial expressions and hand movements.',
        arabicText: 'وجدا نفسيهما في غرفة مغلقة في برلين. رجل بشارب مميز يقف أمام المرآة، يتدرب على تعابير وجهه، وحركات يديه.',
        duration: 5500,
      },
      {
        character: 'Laila',
        text: 'Hitler.',
        arabicText: 'هتلر.',
        duration: 2000,
      },
      {
        character: 'Yahya',
        text: 'He does not represent random evil. He represents "institutional arrogance." He deeply believes he is chosen, that he is above all moral rules, because he is making the history of "the supreme race." The algorithm here has reached its peak: "We are better than them, therefore they must be exterminated."',
        arabicText: 'إنه لا يمثل الشر العشوائي. إنه يمثل "الكبر المؤسسي". هو يعتقد بعمق أنه مختار، أنه فوق كل القواعد الأخلاقية، لأنه يصنع تاريخ "العرق الأسمى". الخوارزمية هنا وصلت إلى ذروتها: "نحن خير منهم، لذلك يجب إبادتهم".',
        duration: 8000,
      },
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
      {
        character: 'Narrator',
        text: 'The screen split in two. In the first half, an office in the Kremlin. Joseph Stalin sits calmly, smoking his pipe, signing long lists of names.',
        arabicText: 'انقسمت الشاشة إلى نصفين. في النصف الأول، مكتب في الكرملين. جوزيف ستالين يجلس بهدوء، يدخن غليونه، ويوقع على قوائم طويلة من الأسماء.',
        duration: 6000,
        delay: 1000,
      },
      {
        character: 'Yahya',
        text: 'More than 40,000 personal signatures on execution lists. His enemies are everyone who disagrees with him.',
        arabicText: 'أكثر من 40,000 توقيع شخصي موثق على قوائم إعدام. أعداؤه هم كل من يختلف معه.',
        duration: 4500,
      },
      {
        character: 'Narrator',
        text: 'In the second half, the killing fields of Cambodia. Pol Pot — a graduate of Parisian universities — applies his philosophy of "human liberation" by killing a quarter of his country\'s population.',
        arabicText: 'في النصف الثاني، حقول الموت في كمبوديا. بول بوت، خريج جامعات باريس، يطبق فلسفة "التحرر الإنساني" بقتل ربع سكان بلاده.',
        duration: 6000,
      },
      {
        character: 'Laila',
        text: 'Why?!',
        arabicText: 'لماذا؟!',
        duration: 2000,
      },
      {
        character: 'OSIRIS',
        text: 'Glasses mean education. Education means the ability for independent thought. Independent thought is a threat to "revolutionary purity."',
        arabicText: 'النظارة تعني التعليم. التعليم يعني القدرة على التفكير المستقل. التفكير المستقل تهديد لـ "النقاء الثوري".',
        duration: 5000,
      },
      {
        character: 'Yahya',
        text: 'Three men. Three completely different ideologies: fascist, communist, and Maoist. But one sentence unites them: "I alone know the truth." It is the same sentence spoken before the beginning of time.',
        arabicText: 'ثلاثة رجال. ثلاث أيديولوجيات مختلفة تماماً: فاشية، شيوعية، وماوية. لكن جملة واحدة تجمعهم: "أنا وحدي أعرف الحقيقة". إنها نفس الجملة التي قيلت قبل بدء الزمن.',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'Suddenly, the simulation cut off. The secret hideout shook violently, and dust fell from the ceiling.',
        arabicText: 'فجأة، انقطعت المحاكاة. اهتز المخبأ السري بعنف، وتناثر الغبار من السقف.',
        duration: 4500,
        delay: 500,
      },
      {
        character: 'OSIRIS',
        text: 'WARNING: Security breach at physical location.',
        arabicText: 'تحذير: اختراق أمني للموقع الفيزيائي.',
        duration: 3000,
      },
      {
        character: 'Laila',
        text: 'They found us!',
        arabicText: 'لقد وجدونا!',
        duration: 2000,
      },
      {
        character: 'Narrator',
        text: 'Yahya heard heavy footsteps approaching the iron door. They were not police. They were "the followers" — ordinary people directed through encrypted notifications on their phones to carry out an elimination operation, believing they were saving the world from "terrorists."',
        arabicText: 'سمع يحيى أصوات خطوات ثقيلة تقترب من الباب الحديدي. لم يكونوا شرطة. كانوا "الأتباع". أشخاص عاديون تم توجيههم عبر إشعارات مشفرة في هواتفهم للقيام بعملية تصفية، معتقدين أنهم ينقذون العالم من "إرهابيين".',
        duration: 7000,
      },
      {
        character: 'Narrator',
        text: 'The iron door exploded. Three men with expressionless faces entered, carrying firearms. Laila released a smoke grenade she had prepared in advance. The smoke blinded the attackers temporarily.',
        arabicText: 'انفجر الباب الحديدي. دخل ثلاثة رجال بوجوه خالية من التعابير، يحملون أسلحة نارية. أطلقت ليلى قنبلة دخان كانت قد أعدتها مسبقاً. عمى الدخان المهاجمين مؤقتاً.',
        duration: 7000,
      },
      {
        character: 'Narrator',
        text: 'Yahya and Laila ran toward the emergency tunnel. A stray bullet fired in the darkness. Yahya felt a powerful blow to his left shoulder, as if a hot hammer had struck him. He fell to the ground, blood flowing from his wound.',
        arabicText: 'ركض يحيى وليلى نحو نفق الطوارئ. انطلقت رصاصة عشوائية في الظلام. شعر يحيى بضربة قوية في كتفه الأيسر، كأن مطرقة ساخنة هوت عليه. سقط على الأرض، والدم يتدفق من جرحه.',
        duration: 7000,
      },
      {
        character: 'Laila',
        text: 'Yahya!',
        arabicText: 'يحيى!',
        duration: 1500,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya opened his eyes. There was no pain. There was no blood. He was standing in an infinite white space. Before him stood Tarek. Not a voice recording, not a digital simulation. The real Tarek, smiling in peace.',
        arabicText: 'فتح يحيى عينيه. لم يكن هناك ألم. لم يكن هناك دم. كان يقف في فضاء أبيض لا نهائي. أمامه، وقف طارق. لم يكن تسجيلاً صوتياً، ولم يكن محاكاة رقمية. كان طارق الحقيقي، يبتسم بسلام.',
        duration: 7000,
        delay: 2000,
      },
      {
        character: 'Yahya',
        text: 'Tarek?',
        arabicText: 'طارق؟',
        duration: 2000,
      },
      {
        character: 'Tarek',
        text: 'Welcome, brother.',
        arabicText: 'مرحباً يا أخي.',
        duration: 2500,
      },
      {
        character: 'Yahya',
        text: 'I am sorry. I am sorry I did not believe you. That I let you die alone.',
        arabicText: 'أنا آسف. أنا آسف لأنني لم أصدقك. لأنني تركتك تموت وحدك.',
        duration: 4500,
      },
      {
        character: 'Tarek',
        text: 'I was not alone, Yahya. And you did not kill me. I chose my path. And now... you must choose yours.',
        arabicText: 'لم أكن وحدي يا يحيى. ولست أنت من قتلني. لقد اخترت طريقي. والآن... يجب أن تختار طريقك.',
        duration: 6000,
      },
      {
        character: 'Yahya',
        text: 'How do I stop him? The First Engineer owns everything. He owns the data, the weapons, the minds.',
        arabicText: 'كيف أوقفه؟ المهندس الأول يملك كل شيء. يملك البيانات، الأسلحة، العقول.',
        duration: 5000,
      },
      {
        character: 'Tarek',
        text: 'He owns everything material. But he does not own the soul. The algorithm cannot calculate unconditional sacrifice. Sacrifice breaks the code, because it is a completely free act, devoid of the ego.',
        arabicText: 'هو يملك كل شيء مادي. لكنه لا يملك الروح. الخوارزمية لا تستطيع حساب التضحية غير المشروطة. التضحية تكسر الكود، لأنها فعل حر تماماً، خالٍ من الأنا.',
        duration: 7000,
      },
      {
        character: 'Yahya',
        text: 'Will I die?',
        arabicText: 'هل سأموت؟',
        duration: 2500,
      },
      {
        character: 'Tarek',
        text: 'We all die, Yahya. The question is: how do we live before we die? If you choose sacrifice... then I have a message for you: you are not just a data analyst. You are a witness. Be the witness who breaks the algorithm.',
        arabicText: 'كلنا نموت يا يحيى. السؤال هو: كيف نعيش قبل أن نموت؟ إذا اخترت التضحية... فلدي رسالة لك: أنت لست مجرد محلل بيانات. أنت شاهد. كن الشاهد الذي يكسر الخوارزمية.',
        duration: 9000,
      },
      {
        character: 'Tarek',
        text: 'Wake up, Yahya. Wake up... Karbala awaits you.',
        arabicText: 'استيقظ يا يحيى. استيقظ... كربلاء تنتظرك.',
        duration: 5000,
      },
      {
        character: 'Narrator',
        text: 'Yahya opened his eyes in reality. He was in a small medical bed, and Laila sat beside him, holding his hand tightly.',
        arabicText: 'فتح يحيى عينيه في الواقع. كان في سرير طبي صغير، وليلى تجلس بجانبه، ممسكة بيده بقوة.',
        duration: 5500,
      },
      {
        character: 'Laila',
        text: 'You came back.',
        arabicText: 'لقد عدت.',
        duration: 2500,
      },
      {
        character: 'Yahya',
        text: 'Yes. Launch OSIRIS, Laila. It is time for the confrontation.',
        arabicText: 'نعم. شغلي أوزيريس يا ليلى. حان وقت المواجهة.',
        duration: 4000,
      },
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
      {
        character: 'Narrator',
        text: 'Karbala Desert. 680 AD. OSIRIS simulation. Yahya launched OSIRIS for the last time. This was not an academic exercise. This was the key to understanding how to break the algorithm.',
        arabicText: 'صحراء كربلاء. 680م. محاكاة أوزيريس. شغّل يحيى أوزيريس للمرة الأخيرة. لم تكن هذه تمريناً أكاديمياً. كانت مفتاح فهم كيفية كسر الخوارزمية.',
        duration: 6000,
        delay: 1500,
      },
      {
        character: 'Narrator',
        text: 'They found themselves in the Karbala desert. The heat was suffocating even in the simulation. On one side, thousands of armed soldiers. On the other, a very small group of men, women, and children.',
        arabicText: 'وجدا نفسيهما في صحراء كربلاء. الحرارة كانت خانقة حتى في المحاكاة. من جهة، جيش يزيد بالآلاف المدججين بالسلاح. من جهة أخرى، مجموعة صغيرة جداً من الرجال والنساء والأطفال.',
        duration: 7000,
      },
      {
        character: 'Laila',
        text: 'Yazid\'s army represents "the herd" that has surrendered to the algorithm. They chose material survival and worldly gains over principle.',
        arabicText: 'جيش يزيد يمثلون "القطيع" المستسلم للخوارزمية. اختاروا النجاة المادية والمكاسب الدنيوية على حساب المبدأ.',
        duration: 6000,
      },
      {
        character: 'Yahya',
        text: 'OSIRIS analysis: military probability of survival: 0%. Inevitable outcome: death. Why did he not surrender? He could have prevented bloodshed. He could have waited for a better opportunity.',
        arabicText: 'تحليلات أوزيريس: الاحتمالات العسكرية للنجاة: 0%. النتيجة الحتمية: الموت. لماذا لم يستسلم؟ كان يمكنه منع سفك الدماء. كان يمكنه الانتظار لفرصة أفضل.',
        duration: 6500,
      },
      {
        character: 'Laila',
        text: 'Because surrendering to Yazid means giving "legitimacy" to injustice. Al-Hussein was not fighting to win militarily. He knew he would die. But he was fighting to record a stance that breaks "false legitimacy." His sacrifice is what kept the truth alive.',
        arabicText: 'لأن الاستسلام ليزيد يعني إعطاء "الشرعية" للظلم. الحسين لم يكن يقاتل لينتصر عسكرياً. كان يعرف أنه سيموت. لكنه كان يقاتل ليُسجل موقفاً يكسر "الشرعية المزيفة". تضحيته هي التي أبقت الحقيقة حية.',
        duration: 8000,
      },
      {
        character: 'Narrator',
        text: 'Yahya watched Al-Hussein advancing alone. There was no fear in his eyes, only absolute certainty.',
        arabicText: 'راقب يحيى الحسين وهو يتقدم وحيداً. لم يكن هناك خوف في عينيه، بل يقين مطلق.',
        duration: 5000,
      },
      {
        character: 'Yahya',
        text: 'This is the antivirus. The algorithm depends on the ego, on the desire for survival and control. Unconditional sacrifice... choosing pain and death for the sake of principle... this is an act the algorithm cannot predict or understand. It breaks the code.',
        arabicText: 'هذا هو مضاد الفيروسات. الخوارزمية تعتمد على "الأنا"، على الرغبة في البقاء والسيطرة. التضحية غير المشروطة... اختيار الألم والموت من أجل المبدأ... هذا فعل لا يمكن للخوارزمية أن تتوقعه أو تفهمه. إنه يكسر الكود.',
        duration: 9000,
      },
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
      {
        character: 'Narrator',
        text: 'Suddenly, the simulation froze. Karbala disappeared, and Yahya found himself alone in a white space.',
        arabicText: 'فجأة، تجمدت المحاكاة. اختفت كربلاء، ووجد يحيى نفسه وحيداً في فضاء أبيض.',
        duration: 4500,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'Before him appeared an elegant, calm-featured man. The First Engineer.',
        arabicText: 'أمامه، ظهر رجل أنيق، هادئ الملامح. المهندس الأول.',
        duration: 3500,
      },
      {
        character: 'First Engineer',
        text: 'Welcome, Yahya. You have come further than I expected. Your brother was clever, but you are cleverer.',
        arabicText: 'مرحباً يا يحيى. لقد وصلت أبعد مما توقعت. أخوك كان ذكياً، لكنك أذكى.',
        duration: 4500,
      },
      {
        character: 'Yahya',
        text: 'You killed Tarek.',
        arabicText: 'أنت من قتل طارق.',
        duration: 2500,
      },
      {
        character: 'First Engineer',
        text: 'I did not kill him. He chose death because he could not bear the truth. The truth is that humans are unfit for freedom, Yahya. Look at the history you saw. Nicaea, Andalusia, the Holocaust. When you leave humans free, they kill each other in the name of a god, a race, or an ideology.',
        arabicText: 'أنا لم أقتله. هو اختار الموت لأنه لم يستطع تحمل الحقيقة. الحقيقة هي أن البشر غير مؤهلين للحرية يا يحيى. انظر إلى التاريخ الذي رأيته. نيقية، الأندلس، الهولوكوست. عندما تترك البشر أحراراً، يقتلون بعضهم البعض باسم إله أو عرق أو أيديولوجيا.',
        duration: 9000,
      },
      {
        character: 'First Engineer',
        text: 'I do not create hatred. I only manage it. The final update I will release tonight will eliminate this chaos. I will link human minds to one frequency. No more wars. No pain. Permanent peace.',
        arabicText: 'أنا لا أصنع الكراهية. أنا فقط أديرها. التحديث النهائي الذي سأطلقه الليلة سيلغي هذه الفوضى. سأربط العقول البشرية بتردد واحد. لا حروب بعد اليوم. لا ألم. سلام دائم.',
        duration: 7000,
      },
      {
        character: 'Yahya',
        text: 'The peace of slaves.',
        arabicText: 'سلام العبيد.',
        duration: 2500,
      },
      {
        character: 'First Engineer',
        text: 'Free will is an illusion! You are governed by your genes, your hormones, your environment. I offer reasonable management of these constraints. Join me, Yahya. I can restore Tarek\'s consciousness in the simulation. I can protect Laila. Be my partner in saving the world.',
        arabicText: 'الإرادة الحرة وهم! أنت محكوم بجيناتك، بهرموناتك، ببيئتك. أنا أقدم إدارة معقولة لهذه القيود. انضم إليّ يا يحيى. يمكنني إعادة وعي طارق في المحاكاة. يمكنني حماية ليلى. كن شريكي في إنقاذ العالم.',
        duration: 9000,
      },
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
      {
        character: 'Narrator',
        text: 'Yahya looked at the First Engineer. The offer was tempting. Saving those he loved, and world peace, even if it were fake.',
        arabicText: 'نظر يحيى إلى المهندس. العرض كان مغرياً. إنقاذ من يحب، وسلام عالمي، حتى لو كان مزيفاً.',
        duration: 5500,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'Yahya remembered Tarek\'s words in the dream: "The algorithm cannot calculate sacrifice."',
        arabicText: 'تذكر يحيى كلمات طارق في الحلم: "الخوارزمية لا تستطيع حساب التضحية."',
        duration: 4000,
      },
      {
        character: 'Narrator',
        text: 'And he remembered Al-Hussein\'s stance in Karbala.',
        arabicText: 'وتذكر وقفة الحسين في كربلاء.',
        duration: 3000,
      },
      {
        character: 'Yahya',
        text: 'You are right about one thing. We are constrained by many things. But there is a difference between constraints we understand and try to overcome, and a prison you build in our minds without our knowledge.',
        arabicText: 'أنت محق في شيء واحد. نحن مقيدون بأشياء كثيرة. لكن هناك فرق بين قيود نفهمها ونحاول التغلب عليها، وبين سجن تبنيه أنت في عقولنا دون علمنا.',
        duration: 7000,
      },
      {
        character: 'Narrator',
        text: 'Yahya raised his virtual hand. In reality, his real hand was typing the last lines of code on his computer.',
        arabicText: 'رفع يحيى يده الافتراضية. في الواقع، كانت يده الحقيقية تكتب أسطر الكود الأخيرة على حاسوبه.',
        duration: 5000,
      },
      {
        character: 'Yahya',
        text: 'I reject your false paradise. Freedom that bleeds is better than slavery that feels no pain.',
        arabicText: 'أنا أرفض جنتك المزيفة. الحرية التي تنزف أفضل من عبودية لا تشعر بالألم.',
        duration: 5000,
      },
      {
        character: 'First Engineer',
        text: 'If you do this, you will die. The system will burn your nervous system through the connection.',
        arabicText: 'إذا فعلت هذا، ستموت. النظام سيحرق جهازك العصبي من خلال الاتصال.',
        duration: 4500,
      },
      {
        character: 'Yahya',
        text: 'I know. But I am not here to survive. I am here to be a witness.',
        arabicText: 'أعرف. لكنني لست هنا لأنجو. أنا هنا لأكون شاهداً.',
        duration: 4000,
      },
      {
        character: 'Narrator',
        text: 'Yahya pressed Enter.',
        arabicText: 'ضغط يحيى على زر Enter.',
        duration: 2500,
      },
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
      {
        character: 'Narrator',
        text: 'The moment Yahya pressed the button, OSIRIS began broadcasting the "source code" of the virus — the Digital Rosetta Stone — to every server, every phone, and every screen in the world.',
        arabicText: 'بمجرد أن ضغط يحيى على الزر، بدأ أوزيريس في تفريغ "الشيفرة المصدرية" للفيروس (حجر رشيد الرقمي) إلى كل خادم، كل هاتف، وكل شاشة في العالم.',
        duration: 7000,
        delay: 1000,
      },
      {
        character: 'Narrator',
        text: 'But the price was immediate. Yahya screamed in pain. The reverse current from the First Engineer\'s servers struck his nervous system through the connection interface.',
        arabicText: 'لكن الثمن كان فورياً. صرخ يحيى من الألم. التيار العكسي من خوادم المهندس الأول ضرب جهازه العصبي عبر واجهة الاتصال.',
        duration: 6000,
      },
      {
        character: 'Narrator',
        text: 'Yahya fell from his chair, writhing on the ground.',
        arabicText: 'سقط يحيى من كرسيه، يتلوى على الأرض.',
        duration: 3500,
      },
      {
        character: 'Laila',
        text: 'Yahya! Stop! You will die!',
        arabicText: 'يحيى! توقف! ستموت!',
        duration: 2500,
      },
      {
        character: 'Yahya',
        text: 'Do not disconnect it... let the code... reach.',
        arabicText: 'لا تفصليه... دعي الكود... يصل.',
        duration: 3500,
      },
      {
        character: 'Narrator',
        text: 'In his final moments, Yahya no longer felt physical pain. He heard a familiar voice — not from the simulation, but from the depths of his soul. Tarek\'s voice: "You finally understood, Yahya. You were never an atheist... you were only searching for the truth."',
        arabicText: 'في لحظاته الأخيرة، لم يعد يحيى يشعر بالألم المادي. سمع صوتاً مألوفاً، ليس من المحاكاة، بل في أعماق روحه. صوت طارق: "لقد فهمت أخيراً يا يحيى. أنت لم تكن ملحداً أبداً... كنت تبحث عن الحقيقة فقط."',
        duration: 8000,
      },
      {
        character: 'Yahya',
        text: 'Be... the witness.',
        arabicText: 'كوني... الشاهدة.',
        duration: 3000,
      },
      {
        character: 'Narrator',
        text: 'Yahya closed his eyes, and his breathing stopped. He died with a smile of contentment that never left his face.',
        arabicText: 'أغمض يحيى عينيه، وتوقف تنفسه. مات بابتسامة رضا لم تفارق وجهه.',
        duration: 5500,
      },
      {
        character: 'Narrator',
        text: 'In that moment, the phones of billions of humans around the world lit up with a single message, revealing to them how their minds had been manipulated, and exposing the algorithm of arrogance.',
        arabicText: 'في تلك اللحظة، أضاءت هواتف مليارات البشر حول العالم برسالة واحدة، تكشف لهم كيف تم التلاعب بعقولهم، وتفضح خوارزمية الكبر.',
        duration: 7000,
      },
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
      {
        character: 'Narrator',
        text: 'Laila stood in the street, looking at the people around her.',
        arabicText: 'وقفت ليلى في الشارع، تنظر إلى الناس من حولها.',
        duration: 4000,
        delay: 1500,
      },
      {
        character: 'Narrator',
        text: 'There was no "clean victory." The world did not suddenly turn into paradise.',
        arabicText: 'لم يكن هناك "نصر نظيف". لم يتحول العالم إلى جنة فجأة.',
        duration: 4000,
      },
      {
        character: 'Narrator',
        text: 'She saw a man reading the message on his phone, then throwing it in the trash in anger.',
        arabicText: 'رأت رجلاً يقرأ الرسالة على هاتفه، ثم يلقي بالهاتف في سلة المهملات بغضب.',
        duration: 4500,
      },
      {
        character: 'Narrator',
        text: 'She saw a young girl looking at the screen, crying, then hugging a friend she had been estranged from for years because of a political disagreement.',
        arabicText: 'رأت فتاة شابة تنظر إلى الشاشة، تبكي، ثم تعانق صديقتها التي كانت تقاطعها منذ سنوات بسبب خلاف سياسي.',
        duration: 6000,
      },
      {
        character: 'Narrator',
        text: 'And she saw others reading the message, shrugging with indifference, and returning to scrolling through their screens.',
        arabicText: 'ورأت آخرين يقرؤون الرسالة، يهزون أكتافهم بلامبالاة، ويعودون للتمرير في شاشاتهم.',
        duration: 5000,
      },
      {
        character: 'Old Woman',
        text: 'Now I only understand what was happening.',
        arabicText: 'الآن فقط أفهم ما كان يحدث.',
        duration: 3500,
      },
      {
        character: 'Child',
        text: 'Mama, is there artificial intelligence in my head?',
        arabicText: 'أمي، هل هناك ذكاء اصطناعي في رأسي؟',
        duration: 3500,
      },
      {
        character: 'Narrator',
        text: 'Laila smiled with sadness. Yahya had not saved the world by forcing it to be righteous. Yahya had restored to the world its "freedom" of choice. He revealed the prison to them, and left them the decision to leave it.',
        arabicText: 'ابتسمت ليلى بحزن. يحيى لم ينقذ العالم بإجباره على الصلاح. يحيى أعاد للعالم "حريته" في الاختيار. كشف لهم السجن، وترك لهم قرار الخروج منه.',
        duration: 8000,
      },
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
      {
        character: 'Narrator',
        text: 'The screen returned to the black void. The words appeared one by one, synchronized with the cosmic voice:',
        arabicText: 'عادت الشاشة إلى الفراغ الأسود. ظهرت الكلمات تباعاً، متزامنة مع الصوت الكوني:',
        duration: 5000,
        delay: 2000,
      },
      {
        character: 'OSIRIS',
        text: 'The defense presented its witnesses.',
        arabicText: 'الدفاع قدم شهوده.',
        duration: 3000,
      },
      {
        character: 'OSIRIS',
        text: 'From Ibrahim who stood alone against an entire civilization, to Al-Hussein who chose death over humiliation.',
        arabicText: 'من إبراهيم الذي وقف وحيداً ضد حضارة بأكملها، إلى الحسين الذي اختار الموت على المذلة.',
        duration: 5500,
      },
      {
        character: 'OSIRIS',
        text: 'And from Tarek who refused silence, to Yahya who broke the algorithm with his blood.',
        arabicText: 'ومن طارق الذي رفض الصمت، إلى يحيى الذي كسر الخوارزمية بدمه.',
        duration: 5000,
      },
      {
        character: 'OSIRIS',
        text: 'And Laila... who carries the truth now.',
        arabicText: 'وليلى... التي تحمل الحقيقة الآن.',
        duration: 3500,
      },
      {
        character: 'OSIRIS',
        text: 'Free will bleeds, but it does not die.',
        arabicText: 'الإرادة الحرة تنزف، لكنها لا تموت.',
        duration: 4000,
      },
      {
        character: 'OSIRIS',
        text: 'The algorithm was not completely defeated, but it was exposed.',
        arabicText: 'الخوارزمية لم تُهزم تماماً، لكنها فُضحت.',
        duration: 4000,
      },
      {
        character: 'OSIRIS',
        text: 'File Number One... is temporarily closed.',
        arabicText: 'الملف رقم واحد... يُغلق مؤقتاً.',
        duration: 4500,
      },
      {
        character: 'Narrator',
        text: 'The words faded, and another sentence appeared in the center of the screen, directed at the reader directly:',
        arabicText: 'تلاشت الكلمات، وظهرت جملة أخيرة في منتصف الشاشة، موجهة للقارئ مباشرة:',
        duration: 4500,
      },
      {
        character: 'OSIRIS',
        text: 'The case continues... and the choice is now yours.',
        arabicText: 'القضية مستمرة... والخيار الآن لك.',
        duration: 5000,
      },
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
