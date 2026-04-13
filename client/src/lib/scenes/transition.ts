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

  // المشهد الانتقالي: الحلم قبل المعركة
  'transition-dream': {
    id: 'transition-dream',
    title: 'The Dream Before the Battle',
    arabicTitle: 'الحلم قبل المعركة',
    part: 4,
    backgroundImage: background('white_space'),
    ambientKeys: ["amb.breath_slow"],
    dialogue: [
      {
        character: 'Narrator',
        text: "فتح يحيى عينيه. لم يكن هناك ألم. لم يكن هناك دم. كان يقف في فضاء أبيض لا نهائي. أمامه، وقف طارق. لم يكن تسجيلاً صوتياً، بل كان حاضراً بكل جوارحه.",
        arabicText: "فتح يحيى عينيه. لم يكن هناك ألم. لم يكن هناك دم. كان يقف في فضاء أبيض لا نهائي. أمامه، وقف طارق. لم يكن تسجيلاً صوتياً، بل كان حاضراً بكل جوارحه.",
        duration: 9000
      },
      {
        character: 'yahya',
        text: "طارق؟",
        arabicText: "طارق؟",
        duration: 2000
      },
      {
        character: 'tarek',
        text: "مرحباً يا أخي.",
        arabicText: "مرحباً يا أخي.",
        duration: 2000
      },
      {
        character: 'yahya',
        text: "أنا آسف. أنا آسف لأنني لم أصدقك. لأنني تركتك تموت وحدك.",
        arabicText: "أنا آسف. أنا آسف لأنني لم أصدقك. لأنني تركتك تموت وحدك.",
        duration: 5000
      },
      {
        character: 'tarek',
        text: "لم أكن وحدي يا يحيى. ولست أنت من قتلني. لقد اخترت طريقي. والآن... يجب أن تختار طريقك.",
        arabicText: "لم أكن وحدي يا يحيى. ولست أنت من قتلني. لقد اخترت طريقي. والآن... يجب أن تختار طريقك.",
        duration: 6000
      },
      {
        character: 'yahya',
        text: "كيف أوقفه؟ المهندس الأول يملك كل شيء. يملك البيانات، الأسلحة، العقول.",
        arabicText: "كيف أوقفه؟ المهندس الأول يملك كل شيء. يملك البيانات، الأسلحة، العقول.",
        duration: 5000
      },
      {
        character: 'tarek',
        text: "هو يملك كل شيء مادي. لكنه لا يملك الروح. الخوارزمية لا تستطيع حساب التضحية غير المشروطة. التضحية تكسر الكود، لأنها فعل حر لا منطقي.",
        arabicText: "هو يملك كل شيء مادي. لكنه لا يملك الروح. الخوارزمية لا تستطيع حساب التضحية غير المشروطة. التضحية تكسر الكود، لأنها فعل حر لا منطقي.",
        duration: 7000
      },
      {
        character: 'yahya',
        text: "هل سأموت؟",
        arabicText: "هل سأموت؟",
        duration: 2000
      },
      {
        character: 'tarek',
        text: "كلنا نموت يا يحيى. السؤال هو: كيف نعيش قبل أن نموت؟ إذا اخترت التضحية... فلدي رسالة لك: أنت لست مجرد محلل بيانات. أنت شاهد. والشاهد لا يحتاج إلى أن ينجو. الشاهد يحتاج فقط إلى أن يرى، ويتحدث، ويخلد الحقيقة.",
        arabicText: "كلنا نموت يا يحيى. السؤال هو: كيف نعيش قبل أن نموت؟ إذا اخترت التضحية... فلدي رسالة لك: أنت لست مجرد محلل بيانات. أنت شاهد. والشاهد لا يحتاج إلى أن ينجو. الشاهد يحتاج فقط إلى أن يرى، ويتحدث، ويخلد الحقيقة.",
        duration: 10000
      },
      {
        character: 'tarek',
        text: "استيقظ يا يحيى. استيقظ... كربلاء تنتظرك.",
        arabicText: "استيقظ يا يحيى. استيقظ... كربلاء تنتظرك.",
        duration: 5000
      },
      {
        character: 'Narrator',
        text: "فتح يحيى عينيه في الواقع. كان في سرير طبي صغير، وليلى تجلس بجانبه، ممسكة بيده بقوة.",
        arabicText: "فتح يحيى عينيه في الواقع. كان في سرير طبي صغير، وليلى تجلس بجانبه، ممسكة بيده بقوة.",
        duration: 6000
      },
      {
        character: 'laila',
        text: "لقد عدت.",
        arabicText: "لقد عدت.",
        duration: 2000
      },
      {
        character: 'yahya',
        text: "نعم. شغلي أوزيريس يا ليلى. حان وقت المواجهة.",
        arabicText: "نعم. شغلي أوزيريس يا ليلى. حان وقت المواجهة.",
        duration: 4000
      }
    ],
    choices: [
      {
        id: 'transition-to-karbala',
        text: 'Enter the final simulation',
        arabicText: 'ادخل إلى المحاكاة النهائية',
        nextSceneId: 'seven-10-1-karbala',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 3000,
    emotionalTone: 'contemplative',
  },
};
