import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const TRANSITION: Record<string, Scene> = {
  // المشهد الانتقالي: من الواقع إلى المحاكاة
  'transition-real-to-sim': {
    id: 'transition-real-to-sim',
    title: 'Entering the Simulation',
    arabicTitle: 'دخول المحاكاة',
    part: 0,
    backgroundVideo: videoBg('cosmic_opening'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.server_room", "amb.low_hum"],
    dialogue: [
      {
        character: 'Narrator',
        text: "كان يحيى يجلس وحيداً في مكتبه، محاطاً بشاشات الحاسوب التي تومض بلونها الأزرق البارد. لم يعد يرى العالم الخارجي، فقط الأرقام والبيانات التي كانت تنسج واقعاً بديلاً.",
        arabicText: "كان يحيى يجلس وحيداً في مكتبه، محاطاً بشاشات الحاسوب التي تومض بلونها الأزرق البارد. لم يعد يرى العالم الخارجي، فقط الأرقام والبيانات التي كانت تنسج واقعاً بديلاً.",
        duration: 12800
      },
      {
        character: 'Narrator',
        text: "وفجأة، بدأت الشاشات تضطرب. تداخلت الأكواد البرمجية مع صور قديمة، وكأن الزمن بدأ ينهار.",
        arabicText: "وفجأة، بدأت الشاشات تضطرب. تداخلت الأكواد البرمجية مع صور قديمة، وكأن الزمن بدأ ينهار.",
        duration: 8400
      },
      {
        character: 'Narrator',
        text: "أدرك يحيى أن هذه ليست مجرد هلوسة بصرية. إنه نظام (أوزيريس) الذي بدأ في سحبه إلى الداخل.",
        arabicText: "أدرك يحيى أن هذه ليست مجرد هلوسة بصرية. إنه نظام (أوزيريس) الذي بدأ في سحبه إلى الداخل.",
        duration: 8800
      }
    ],
    choices: [
      {
        id: 'transition-enter',
        text: 'Step into the stream of data',
        arabicText: 'خطوة داخل تدفق البيانات',
        nextSceneId: 'zero-1-1-summons',
      },
    ],
    transitionType: 'glitch',
    transitionDuration: 1800,
    emotionalTone: 'intense',
  },
};

export const PART_SEVEN: Record<string, Scene> = {
  // المشهد 9.1: المواجهة النهائية
  'seven-9-1-final-confrontation': {
    id: 'seven-9-1-final-confrontation',
    title: 'The Final Confrontation',
    arabicTitle: 'المواجهة النهائية',
    part: 4,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "glitch",
    ambientKeys: ["amb.bass_drone_low"],
    dialogue: [
      {
        character: 'first_engineer_confront',
        text: "وقف يحيى وجهاً لوجه مع المهندس الأول في قلب السيرفر المركزي. لم يعد المهندس الأول مجرد طيف، بل تجسيداً لكل كبرياء البشرية التكنولوجي.",
        arabicText: "وقف يحيى وجهاً لوجه مع المهندس الأول في قلب السيرفر المركزي. لم يعد المهندس الأول مجرد طيف، بل تجسيداً لكل كبرياء البشرية التكنولوجي.",
        duration: 12400
      },
      {
        character: 'first_engineer_confront',
        text: "\"أنت لا تستطيع الفوز يا دكتور يحيى،\" قال المهندس الأول بهدوء مرعب. \"نحن نمتلك كل شيء. بياناتهم، مخاوفهم، أحلامهم. العالم كله الآن تحت سيطرة خوارزميتنا.\"",
        arabicText: "\"أنت لا تستطيع الفوز يا دكتور يحيى،\" قال المهندس الأول بهدوء مرعب. \"نحن نمتلك كل شيء. بياناتهم، مخاوفهم، أحلامهم. العالم كله الآن تحت سيطرة خوارزميتنا.\"",
        duration: 15600
      },
      {
        character: 'yahya_confront',
        text: "أخرج يحيى القرص الصلب الأخير لطارق. \"أنت نسيت شيئاً واحداً يا (مدقق الجودة). أنت نسيت (الشيفرة المصدرية) للروح البشرية. طارق وجدها. إنها ليست كوداً، بل هي القدرة على التضحية، القدرة على الحب، والقدرة على اختيار الحق حتى لو كلفنا ذلك حياتنا.\"",
        arabicText: "أخرج يحيى القرص الصلب الأخير لطارق. \"أنت نسيت شيئاً واحداً يا (مدقق الجودة). أنت نسيت (الشيفرة المصدرية) للروح البشرية. طارق وجدها. إنها ليست كوداً، بل هي القدرة على التضحية، القدرة على الحب، والقدرة على اختيار الحق حتى لو كلفنا ذلك حياتنا.\"",
        duration: 21600
      },
      {
        character: 'yahya_confront',
        text: "ضغط يحيى على زر (Delete) النهائي لمشروع أوزيريس. بدأت الغرفة تنهار.",
        arabicText: "ضغط يحيى على زر (Delete) النهائي لمشروع أوزيريس. بدأت الغرفة تنهار.",
        duration: 7200
      },
      {
        character: 'first_engineer_confront',
        text: "صرخ المهندس الأول: \"أنت تدمر العالم!\"",
        arabicText: "صرخ المهندس الأول: \"أنت تدمر العالم!\"",
        duration: 3600
      },
      {
        character: 'yahya_confront',
        text: "\"لا،\" أجاب يحيى بهدوء وهو يرى الجدران الرقمية تتلاشى. \"أنا فقط أمنحهم فرصة ليكونوا بشراً مرة أخرى. بدون خوارزميتك.\"",
        arabicText: "\"لا،\" أجاب يحيى بهدوء وهو يرى الجدران الرقمية تتلاشى. \"أنا فقط أمنحهم فرصة ليكونوا بشراً مرة أخرى. بدون خوارزميتك.\"",
        duration: 11200
      }
    ],
    choices: [
      {
        id: 'seven-9-1-final',
        text: 'The Final Choice',
        arabicText: 'الخيار الأخير',
        nextSceneId: 'seven-9-2-ending',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 3000,
    emotionalTone: 'intense',
  },

  // المشهد 9.2: النهاية
  'seven-9-2-ending': {
    id: 'seven-9-2-ending',
    title: 'The End',
    arabicTitle: 'النهاية',
    part: 4,
    backgroundImage: background('white_space'),
    ambientKeys: ["amb.vacuum"],
    dialogue: [
      {
        character: 'Narrator',
        text: "عاد يحيى إلى مكتبه. كانت الشاشات مطفأة. ساد هدوء عميق في الغرفة.",
        arabicText: "عاد يحيى إلى مكتبه. كانت الشاشات مطفأة. ساد هدوء عميق في الغرفة.",
        duration: 7200
      },
      {
        character: 'Narrator',
        text: "نظر إلى هاتفه. لم تكن هناك إشعارات. لا إعجابات، لا أخبار كاذبة، لا غضب.",
        arabicText: "نظر إلى هاتفه. لم تكن هناك إشعارات. لا إعجابات، لا أخبار كاذبة، لا غضب.",
        duration: 8800
      },
      {
        character: 'Narrator',
        text: "فتح النافذة. رأى الناس في الشارع يتحدثون مع بعضهم البعض. لم يكن هناك عجل ذهبي في أيديهم، بل كانت هناك وجوه بشرية تنظر لبعضها لأول مرة منذ زمن طويل.",
        arabicText: "فتح النافذة. رأى الناس في الشارع يتحدثون مع بعضهم البعض. لم يكن هناك عجل ذهبي في أيديهم، بل كانت هناك وجوه بشرية تنظر لبعضها لأول مرة منذ زمن طويل.",
        duration: 15600
      },
      {
        character: 'Narrator',
        text: "ابتسم يحيى. لقد كانت المعركة صعبة، لكن الروح انتصرت في النهاية.",
        arabicText: "ابتسم يحيى. لقد كانت المعركة صعبة، لكن الروح انتصرت في النهاية.",
        duration: 7600
      }
    ],
    choices: [
      {
        id: 'seven-9-2-credits',
        text: 'Credits',
        arabicText: 'خاتمة',
        nextSceneId: 'credits',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 5000,
    emotionalTone: 'hopeful',
  },
};
