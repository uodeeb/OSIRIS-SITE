import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const TRANSITION: Record<string, Scene> = {
  // المشهد الانتقالي: من الواقع إلى المحاكاة
  'transition-real-to-sim': {
    id: 'transition-real-to-sim',
    title: "Entering the Simulation",
    arabicTitle: "دخول المحاكاة",
    part: 0,
    backgroundVideo: videoBg('cosmic_opening'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.server_room", "amb.low_hum"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya sat alone in his office, surrounded by computer screens flickering cold blue. He no longer saw the outside world, only numbers and data weaving an alternate reality.",
        arabicText: "كان يحيى يجلس وحيداً في مكتبه، محاطاً بشاشات الحاسوب التي تومض بلونها الأزرق البارد. لم يعد يرى العالم الخارجي، فقط الأرقام والبيانات التي كانت تنسج واقعاً بديلاً.",
        duration: 12800
      },
      {
        character: "Narrator",
        text: "Suddenly, the screens began to distort. Code intertwined with old images, as if time itself had started to collapse.",
        arabicText: "وفجأة، بدأت الشاشات تضطرب. تداخلت الأكواد البرمجية مع صور قديمة، وكأن الزمن بدأ ينهار.",
        duration: 8400
      },
      {
        character: "Narrator",
        text: "Yahya realized this was not a visual hallucination. It was OSIRIS pulling him inward.",
        arabicText: "أدرك يحيى أن هذه ليست مجرد هلوسة بصرية. إنه نظام (أوزيريس) الذي بدأ في سحبه إلى الداخل.",
        duration: 8800
      }
    ],
    choices: [
      {
        id: "transition-enter",
        text: "Step into the stream of data",
        arabicText: "خطوة داخل تدفق البيانات",
        nextSceneId: "zero-1-1-summons"
      }
    ],
    transitionType: 'glitch',
    transitionDuration: 1800,
    emotionalTone: 'intense',
  },

  // المشهد الانتقالي: الحلم قبل المعركة
  'transition-dream': {
    id: 'transition-dream',
    title: "The Dream Before the Battle",
    arabicTitle: "لقاء خارج الزمن",
    part: 4,
    backgroundImage: background('white_space'),
    ambientKeys: ["amb.breath_slow"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya opened his eyes. There was no pain. There was no blood. He was standing in an infinite white space. Before him stood Tarek. Not a voice recording, not a digital simulation. The real Tarek, smiling in peace.",
        arabicText: "فتح يحيى عينيه. لم يكن هناك ألم. لم يكن هناك دم. كان يقف في فضاء أبيض لا نهائي. أمامه، وقف طارق. لم يكن تسجيلاً صوتياً، ولم يكن محاكاة رقمية. كان طارق الحقيقي، يبتسم بسلام.",
        duration: 7000
      },
      {
        character: "Yahya",
        text: "Tarek?",
        arabicText: "طارق؟",
        duration: 2000
      },
      {
        character: "Tarek",
        text: "Welcome, brother.",
        arabicText: "مرحباً يا أخي.",
        duration: 2500
      },
      {
        character: "Yahya",
        text: "I am sorry. I am sorry I did not believe you. That I let you die alone.",
        arabicText: "أنا آسف. أنا آسف لأنني لم أصدقك. لأنني تركتك تموت وحدك.",
        duration: 4500
      },
      {
        character: "Tarek",
        text: "I was not alone, Yahya. And you did not kill me. I chose my path. And now... you must choose yours.",
        arabicText: "لم أكن وحدي يا يحيى. ولست أنت من قتلني. لقد اخترت طريقي. والآن... يجب أن تختار طريقك.",
        duration: 6000
      },
      {
        character: "Yahya",
        text: "How do I stop him? The First Engineer owns everything. He owns the data, the weapons, the minds.",
        arabicText: "كيف أوقفه؟ المهندس الأول يملك كل شيء. يملك البيانات، الأسلحة، العقول.",
        duration: 5000
      },
      {
        character: "Tarek",
        text: "He owns everything material. But he does not own the soul. The algorithm cannot calculate unconditional sacrifice. Sacrifice breaks the code, because it is a completely free act, devoid of the ego.",
        arabicText: "هو يملك كل شيء مادي. لكنه لا يملك الروح. الخوارزمية لا تستطيع حساب التضحية غير المشروطة. التضحية تكسر الكود، لأنها فعل حر تماماً، خالٍ من الأنا.",
        duration: 7000
      },
      {
        character: "Yahya",
        text: "Will I die?",
        arabicText: "هل سأموت؟",
        duration: 2500
      },
      {
        character: "Tarek",
        text: "We all die, Yahya. The question is: how do we live before we die? If you choose sacrifice... then I have a message for you: you are not just a data analyst. You are a witness. Be the witness who breaks the algorithm.",
        arabicText: "كلنا نموت يا يحيى. السؤال هو: كيف نعيش قبل أن نموت؟ إذا اخترت التضحية... فلدي رسالة لك: أنت لست مجرد محلل بيانات. أنت شاهد. كن الشاهد الذي يكسر الخوارزمية.",
        duration: 9000
      },
      {
        character: "Tarek",
        text: "Wake up, Yahya. Wake up... Karbala awaits you.",
        arabicText: "استيقظ يا يحيى. استيقظ... كربلاء تنتظرك.",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "Yahya opened his eyes in reality. He was in a small medical bed, and Laila sat beside him, holding his hand tightly.",
        arabicText: "فتح يحيى عينيه في الواقع. كان في سرير طبي صغير، وليلى تجلس بجانبه، ممسكة بيده بقوة.",
        duration: 5500
      },
      {
        character: "Laila",
        text: "You came back.",
        arabicText: "لقد عدت.",
        duration: 2500
      },
      {
        character: "Yahya",
        text: "Yes. Launch OSIRIS, Laila. It is time for the confrontation.",
        arabicText: "نعم. شغلي أوزيريس يا ليلى. حان وقت المواجهة.",
        duration: 4000
      }
    ],
    choices: [
      {
        id: "transition-dream-karbala",
        text: "Part Five: The Battle of Karbala",
        arabicText: "الجزء الخامس: معركة كربلاء",
        nextSceneId: "seven-10-1-karbala"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 3000,
    emotionalTone: 'contemplative',
  },
};
