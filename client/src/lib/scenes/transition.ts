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
