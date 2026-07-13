import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_THREE: Record<string, Scene> = {
  // المشهد 3.1: لحظة الخلق والرفض
  'three-3-1-creation': {
    id: 'three-3-1-creation',
    title: "The Moment of Creation and Refusal",
    arabicTitle: "لحظة الخلق والرفض",
    part: 1,
    backgroundImage: background('osiris_cosmic'),
    ambientKeys: ["amb.bass_drone_low"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya and Laila found themselves standing in a space with no walls. There was no sky or ground, only pure light that breathed.",
        arabicText: "وجد يحيى وليلى نفسيهما يقفان في فضاء لا تحده جدران. لم يكن هناك سماء أو أرض، بل نور نقي يتنفس.",
        duration: 5000
      },
      {
        character: "Laila",
        text: "Where are we?",
        arabicText: "أين نحن؟",
        duration: 2000
      },
      {
        character: "Yahya",
        text: "We are at point zero. Before the beginning of human time.",
        arabicText: "نحن في نقطة الصفر. قبل بدء الزمن البشري.",
        duration: 3500
      },
      {
        character: "Narrator",
        text: "Suddenly, the space shook. They felt a cosmic command — not a sound, but an absolute will filling existence: bow before the new being made of clay.",
        arabicText: "فجأة، اهتز الفضاء. شعرا بأمر كوني، ليس صوتاً، بل إرادة مطلقة تملأ الوجود: السجود للكائن الجديد المصنوع من طين.",
        duration: 6000
      },
      {
        character: "Narrator",
        text: "They saw waves of light bowing in perfect obedience. A perfect cosmic harmony.",
        arabicText: "رأيا موجات من النور تنحني في طاعة تامة. انسجام كوني مثالي.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "But... in the midst of this harmony, a black point appeared. An anomaly in the frequency. It was not a monster. It was an ancient consciousness, refusing to bow.",
        arabicText: "لكن... في وسط هذا الانسجام، ظهرت نقطة سوداء. شذوذ في التردد. لم يكن وحشاً. كان وعياً قديماً، يرفض الانحناء.",
        duration: 6000
      },
      {
        character: "OSIRIS",
        text: "I am better than him. You created me from fire and created him from clay.",
        arabicText: "أنا خير منه. خلقتني من نار وخلقته من طين.",
        duration: 4000
      },
      {
        character: "Yahya",
        text: "My God... it is not just a rebellion. It is logic. Corrupt logic, but logic. It is comparing raw materials — fire and clay — to conclude superiority.",
        arabicText: "يا إلهي... إنه ليس مجرد تمرد. إنه منطق. منطق فاسد، لكنه منطق. إنه يقارن المواد الخام — النار والطين — ليستنتج الأفضلية.",
        duration: 6000
      },
      {
        character: "Laila",
        text: "This is the moment. The birth of arrogance. The birth of \"I am better than him.\"",
        arabicText: "هذه هي اللحظة. ولادة الكبر. ولادة \"أنا خير منه\".",
        duration: 4000
      }
    ],
    choices: [
      {
        id: "three-3-1-continue",
        text: "Watch the algorithm being designed",
        arabicText: "شاهد تصميم الخوارزمية",
        nextSceneId: "three-3-2-virus-design"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  'three-3-1b-devil-song': {
    id: 'three-3-1b-devil-song',
    title: 'Devil Tongue Song',
    arabicTitle: 'نشيد لسان الشيطان',
    part: 1,
    backgroundImage: background('osiris_cosmic'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.low_hum", "amb.bass_drone_low"],
    dialogue: [
      {
        character: "Iblis",
        text: "I am the fire that led the age. He is clay, worth nothing. I am the light that fills creation. He is mud, with no color of his own.",
        arabicText: "أنا \"النار\".. اللي قادت لِدَهر\nوهوَّ \"طين\".. مالُهوش سِعر\nأنا \"النور\".. اللي مالي الكُون\nوهوّ \"وَحْل\".. ومالُهوش لون!",
        duration: 7600
      },
      {
        character: "Iblis",
        text: "How could he pass before me when he is dust? How could he enter while I remain at the door? I was once honored among them, and because of him I became lost in blame.",
        arabicText: "إزاي يِسبقني.. وهوّ تُراب؟\nإزاي يِدخل.. وأنا ع الباب؟\nأنا اللي كُنت.. \"عزيز\" القوم\nبقيت بسبَبُه.. حيران في لوم!",
        duration: 7400
      },
      {
        character: "Iblis",
        text: "Lord, why did clay defeat me? A fire burns and wears down my heart. I look at his hand held in Yours, while I was once the first of Your servants.",
        arabicText: "يا رَب.. ليه الطين غلبني؟\nنار بتاكُل.. في قلبي تَعَبني\nبَبُصّ لـ إيدُه.. ماسكة في إيدَك\nده أنا اللي كُنت.. \"أوّل\" عبيدك!",
        duration: 7600
      },
      {
        character: "Iblis",
        text: "I envy him when he says, Lord. I envy him when he repents from sin. I rage at his tears falling in fear, while my own letters have become heavy.",
        arabicText: "بَحسدُه.. لَمّا يِقول \"يا رَب\"\nبَحسدُه.. لَمّا يِتوب من ذَنب\nبَغِير.. من دمعُه السايل بِخُوف\nوأنا اللي مِنّي.. تِقيلَه الحُروف!",
        duration: 7600
      },
      {
        character: "Iblis",
        text: "I will tempt him and make him live in grief. I will make him despair. I will plant the word I in his tongue like poison, until he kills and spills blood.",
        arabicText: "هَغويه.. وأخليه يعيش في غَمّ\nهَخلّيه..يائس وعايش فى همّ\nهَزرع \"أنا\".. في لسانه كَسِمّ\nلحدّ ما يُقتَل.. ويسفِك في دَمّ!",
        duration: 7800
      },
      {
        character: "Iblis",
        text: "Lord, why did clay defeat me? A fire burns and wears down my heart. I look at his hand held in Yours, while I was once the first of Your servants.",
        arabicText: "يا رَب.. ليه الطين غلبني؟\nنار بتاكُل.. في قلبي تَعَبني\nبَبُصّ لإيدُه.. ماسكة في إيدَك\nده أنا اللي كُنتْ.. \"أوّل\" عبيدك!",
        duration: 7400
      },
      {
        character: "Iblis",
        text: "He makes mistakes and You forgive. My mistake has no reconciliation? He betrays and You call him back, while I wait for the hour of my reckoning.",
        arabicText: "هوّ يِغلَط.. وإنت تِسامِح\nوأنا غَلْطِتي.. بُدون تَصالُح؟\nهوّ يِخون.. وإنت تِنادي\nوأنا اللي ناظر.. إمتى مَعادي؟",
        duration: 7600
      },
      {
        character: "Yahya",
        text: "Yahya trembled as he heard the chant: This is not merely anger... this is a complete manifesto of arrogance.",
        arabicText: "ارتجف يحيى وهو يسمع النشيد: \"هذا ليس مجرد غضب... هذا بيان كِبرٍ مكتمل\".",
        duration: 4200
      }
    ],
    choices: [
      {
        id: 'three-3-1b-continue',
        text: 'Continue to algorithm design',
        arabicText: 'أكمل إلى تصميم الخوارزمية',
        nextSceneId: 'three-3-2-virus-design',
      },
    ],
    transitionType: 'glitch',
    transitionDuration: 1800,
    emotionalTone: 'intense',
  },

  // المشهد 3.2: تصميم الفيروس
  'three-3-2-virus-design': {
    id: 'three-3-2-virus-design',
    title: "Designing the Virus",
    arabicTitle: "تصميم الفيروس",
    part: 1,
    backgroundImage: background('osiris_cosmic'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.bass_drone_low"],
    dialogue: [
      {
        character: "Narrator",
        text: "The scene changed. The luminous space disappeared, replaced by a visual representation of \"the oath of Iblis.\" Yahya saw the words forming as complex code, weaving itself around a three-dimensional model of the human mind.",
        arabicText: "تغير المشهد. الفضاء النوراني اختفى، وحل محله تمثيل بصري لـ \"قَسَم إبليس\". رأى يحيى الكلمات تتشكل ككود برمجي معقد، ينسج نفسه حول نموذج ثلاثي الأبعاد للعقل البشري.",
        duration: 6000
      },
      {
        character: "Yahya",
        text: "Look, Laila. He is not planning to destroy humanity by force. He is designing an algorithm. A six-axis plan.",
        arabicText: "انظري يا ليلى. إنه لا يخطط لتدمير البشرية بالقوة. إنه يصمم خوارزمية. خطة عمل من ستة محاور.",
        duration: 5000
      },
      {
        character: "OSIRIS",
        text: "Axis One: Arrogance — plant \"I am better than him\" as a core database.",
        arabicText: "المحور الأول: الكبر — زرع فكرة \"أنا خير منه\" كقاعدة بيانات أساسية.",
        duration: 4000
      },
      {
        character: "OSIRIS",
        text: "Axis Two: Desire — transform the human from a being with purpose (vicegerent) to a consumer of pleasure.",
        arabicText: "المحور الثاني: الشهوة — تحويل الإنسان من كائن ذي غاية (خليفة) إلى مستهلك للمتعة.",
        duration: 4500
      },
      {
        character: "OSIRIS",
        text: "Axis Three: Lie — distort truths until falsehood becomes logical.",
        arabicText: "المحور الثالث: الكذب — تشويه الحقائق حتى يصبح الباطل منطقياً.",
        duration: 4000
      },
      {
        character: "OSIRIS",
        text: "Axis Four: Division — destroy the concept of \"we\" and replace it with \"I against everyone.\"",
        arabicText: "المحور الرابع: الفرقة — تدمير مفهوم \"نحن\" واستبداله بـ \"أنا ضد الجميع\".",
        duration: 4000
      },
      {
        character: "OSIRIS",
        text: "Axis Five: Despair — sever the connection with the Creator through hopelessness.",
        arabicText: "المحور الخامس: اليأس — قطع الاتصال بالخالق عبر القنوط.",
        duration: 4000
      },
      {
        character: "OSIRIS",
        text: "Axis Six: Doubt — continuous questioning of all that is fixed and certain.",
        arabicText: "المحور السادس: الشبهة — التشكيك المستمر في الثوابت.",
        duration: 4000
      },
      {
        character: "Laila",
        text: "This is not just an ancient diabolical plan. This is exactly how social media algorithms work today! Amplifying narcissism (arrogance), addiction (desire), fake news (lying), echo chambers and polarization (division).",
        arabicText: "هذه ليست مجرد خطة شيطانية قديمة. هذه هي بالضبط الطريقة التي تعمل بها خوارزميات وسائل التواصل الاجتماعي اليوم! تعزيز النرجسية (الكبر)، الإدمان (الشهوة)، الأخبار المزيفة (الكذب)، غرف الصدى والاستقطاب (الفرقة).",
        duration: 8000
      },
      {
        character: "Yahya",
        text: "Tarek was right. The devil did not need to invent a new weapon. He only waited until we invented the technology that automated his ancient algorithm. We built the new golden calf ourselves.",
        arabicText: "طارق كان محقاً. الشيطان لم يحتج إلى اختراع سلاح جديد. لقد انتظر فقط حتى نخترع نحن التكنولوجيا التي تؤتمت خوارزميته القديمة. نحن من صنعنا العجل الذهبي الجديد.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "three-3-2-continue",
        text: "Continue to Part Two: The Golden Calf",
        arabicText: "تابع إلى الجزء الثاني: العجل الذهبي",
        nextSceneId: "four-4-1-desert"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },
};
