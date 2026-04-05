import { ASSET_URLS } from '../assetUrls';
import type { Scene } from '../sceneSystem';

export const PART_TWO: Record<string, Scene> = {
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
        character: 'tarek',
        text: "كان يحيى يركض. جاره العجوز، السيد سميث، الذي كان يطعم قطته أحياناً، حاول طعنه بسكين مطبخ قبل دقائق. عينا العجوز كانتا فارغتين، كأنه منوّم مغناطيسياً. \"الأتباع الممسوحون دماغياً\"، هكذا أسماهم طارق في ملاحظاته.",
        arabicText: "كان يحيى يركض. جاره العجوز، السيد سميث، الذي كان يطعم قطته أحياناً، حاول طعنه بسكين مطبخ قبل دقائق. عينا العجوز كانتا فارغتين، كأنه منوّم مغناطيسياً. \"الأتباع الممسوحون دماغياً\"، هكذا أسماهم طارق في ملاحظاته.",
        duration: 13200
      },
      {
        character: 'yahya',
        text: "انعطف يحيى في زقاق ضيق، وفجأة امتدت يد من الظلام وسحبته إلى الداخل.",
        arabicText: "انعطف يحيى في زقاق ضيق، وفجأة امتدت يد من الظلام وسحبته إلى الداخل.",
        duration: 5200
      },
      {
        character: 'yahya',
        text: "كاد يحيى أن يصرخ، لكن يداً أخرى كتمت فمه.",
        arabicText: "كاد يحيى أن يصرخ، لكن يداً أخرى كتمت فمه.",
        duration: 3600
      },
      {
        character: 'yahya',
        text: "\"اصمت إذا كنت تريد أن تعيش، دكتور سليماني.\"",
        arabicText: "\"اصمت إذا كنت تريد أن تعيش، دكتور سليماني.\"",
        duration: 3200
      },
      {
        character: 'yahya',
        text: "كانت فتاة شابة، عيناها حادتان وذكيتان. قادته عبر ممرات تحت الأرض حتى وصلا إلى غرفة مليئة بالكتب القديمة والخوادم الحاسوبية المبردة.",
        arabicText: "كانت فتاة شابة، عيناها حادتان وذكيتان. قادته عبر ممرات تحت الأرض حتى وصلا إلى غرفة مليئة بالكتب القديمة والخوادم الحاسوبية المبردة.",
        duration: 8400
      },
      {
        character: 'yahya',
        text: "\"من أنتِ؟\" سأل يحيى وهو يلهث.",
        arabicText: "\"من أنتِ؟\" سأل يحيى وهو يلهث.",
        duration: 2500
      },
      {
        character: 'laila',
        text: "\"اسمي ليلى. باحثة في علم النفس الديني. وكنت أتابع عمل أخيك.\"",
        arabicText: "\"اسمي ليلى. باحثة في علم النفس الديني. وكنت أتابع عمل أخيك.\"",
        duration: 4400
      },
      {
        character: 'yahya',
        text: "نظر إليها يحيى بشك. \"علم نفس ديني؟ أنا رجل أرقام. لا أؤمن بالخرافات.\"",
        arabicText: "نظر إليها يحيى بشك. \"علم نفس ديني؟ أنا رجل أرقام. لا أؤمن بالخرافات.\"",
        duration: 5200
      },
      {
        character: 'laila',
        text: "ابتسمت ليلى ببرود. \"الأرقام التي تعبدها هي التي تحاول قتلك الآن. أخوك أدرك أن المشكلة ليست تقنية، بل روحية. الخوارزمية التي اكتشفها لا تخترق الحواسيب، بل تخترق النفوس. أنت تملك العقل لتحليل البيانات، لكنك تحتاج إلى بوصلة لتفهم معناها.\"",
        arabicText: "ابتسمت ليلى ببرود. \"الأرقام التي تعبدها هي التي تحاول قتلك الآن. أخوك أدرك أن المشكلة ليست تقنية، بل روحية. الخوارزمية التي اكتشفها لا تخترق الحواسيب، بل تخترق النفوس. أنت تملك العقل لتحليل البيانات، لكنك تحتاج إلى بوصلة لتفهم معناها.\"",
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
      {
        character: 'tarek',
        text: "جلس يحيى أمام الخوادم، وبدأ في إدخال كود طارق.",
        arabicText: "جلس يحيى أمام الخوادم، وبدأ في إدخال كود طارق.",
        duration: 3600
      },
      {
        character: 'laila',
        text: "\"ما هذا النظام بالضبط؟\" سألت ليلى وهي تراقب الشاشات تضيء واحدة تلو الأخرى.",
        arabicText: "\"ما هذا النظام بالضبط؟\" سألت ليلى وهي تراقب الشاشات تضيء واحدة تلو الأخرى.",
        duration: 5200
      },
      {
        character: 'first_engineer',
        text: "أجاب يحيى وعيناه مثبتتان على الشاشة: \"أوزيريس. نظام استشعار كمي. هو لا يعيد بناء الماضي من كتب التاريخ. هو يقرأ موجات الكم التي تُركت في الكون. كل حدث، كل جريمة، كل كلمة قيلت، تترك اهتزازة في نسيج الواقع، مثل تموجات في بركة ماء. أوزيريس يقرأ هذه الموجات، يترجمها إلى بيانات، ثم ينقلها إلى حواسنا كمحاكاة.\"",
        arabicText: "أجاب يحيى وعيناه مثبتتان على الشاشة: \"أوزيريس. نظام استشعار كمي. هو لا يعيد بناء الماضي من كتب التاريخ. هو يقرأ موجات الكم التي تُركت في الكون. كل حدث، كل جريمة، كل كلمة قيلت، تترك اهتزازة في نسيج الواقع، مثل تموجات في بركة ماء. أوزيريس يقرأ هذه الموجات، يترجمها إلى بيانات، ثم ينقلها إلى حواسنا كمحاكاة.\"",
        duration: 22000
      },
      {
        character: 'first_engineer',
        text: "\"إذن، نحن سنشهد التاريخ كما حدث فعلاً؟\"",
        arabicText: "\"إذن، نحن سنشهد التاريخ كما حدث فعلاً؟\"",
        duration: 2800
      },
      {
        character: 'first_engineer',
        text: "\"بل سنعيشه.\" ضغط يحيى على زر الإدخال (Enter). \"لنبدأ من حيث بدأ كل شيء. الجريمة الأولى.\"",
        arabicText: "\"بل سنعيشه.\" ضغط يحيى على زر الإدخال (Enter). \"لنبدأ من حيث بدأ كل شيء. الجريمة الأولى.\"",
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
