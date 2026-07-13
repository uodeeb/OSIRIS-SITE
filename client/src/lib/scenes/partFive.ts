import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_FIVE: Record<string, Scene> = {
  // المشهد 6أ.1: مجمع نيقية - الجدال
  'five-6a-1-nicaea-debate': {
    id: 'five-6a-1-nicaea-debate',
    title: "Before the Council: Complex Theology, No Evil Intent",
    arabicTitle: "لاهوت معقد، لا نوايا سيئة",
    part: 3,
    backgroundVideo: videoBg('nicaea'),
    backgroundImage: background('nicaea_council'),
    ambientKeys: ["amb.church_reverb", "amb.crowd_whisper"],
    enterSfxKeys: ["sfx.gavel_strike"],
    dialogue: [
      {
        character: "Narrator",
        text: "Rome / Alexandria. One month before the Council of Nicaea, 325 AD. OSIRIS simulation. Yahya programmed OSIRIS to return to 325 AD. The simulation did not show horned demons, but simple men in rough robes, sitting in candlelit rooms, arguing passionately.",
        arabicText: "روما / الإسكندرية. قبل شهر من مجمع نيقية 325م. محاكاة أوزيريس. برمج يحيى أوزيريس للعودة إلى عام 325 ميلادية. لم تظهر المحاكاة شياطين بقرون، بل رجالاً بسطاء يرتدون أثواباً خشنة، يجلسون في غرف مضاءة بالشموع، يتجادلون بشغف.",
        duration: 7000
      },
      {
        character: "Yahya",
        text: "I thought we would see an evil conspiracy from the start.",
        arabicText: "كنت أظن أننا سنرى مؤامرة شريرة منذ البداية.",
        duration: 3000
      },
      {
        character: "Laila",
        text: "That is the trap, Yahya. The disagreements at the start were genuine. Theology is difficult. Attempting to understand the nature of the Creator is not easy. Look at them... they are not seeking power, they are sincerely trying to understand the truth.",
        arabicText: "هذا هو الفخ يا يحيى. الخلافات في البداية كانت حقيقية. اللاهوت صعب. محاولة فهم طبيعة الخالق ليست أمراً سهلاً. انظر إليهم... إنهم لا يسعون للسلطة، إنهم يحاولون بصدق فهم الحقيقة.",
        duration: 7000
      },
      {
        character: "Arius",
        text: "If the Son was begotten, then he has a beginning, and therefore there was a time when he did not exist. God alone is eternal.",
        arabicText: "إذا كان الابن مولوداً، فله بداية، وبالتالي كان هناك وقت لم يكن فيه موجوداً. الله وحده هو الأزلي.",
        duration: 5000
      },
      {
        character: "Athanasius",
        text: "If the Son is not fully God, how can he save humanity? Salvation requires a God, not a creature.",
        arabicText: "إذا لم يكن الابن إلهاً كاملاً، فكيف يمكنه أن يخلص البشرية؟ الخلاص يتطلب إلهاً، لا مخلوقاً.",
        duration: 4500
      },
      {
        character: "Yahya",
        text: "Both have logic. The point of disagreement is legitimate. Where is the virus then?",
        arabicText: "كلاهما يملك منطقاً. نقطة الخلاف شرعية. أين الفيروس إذن؟",
        duration: 3500
      },
      {
        character: "Laila",
        text: "The virus does not create the disagreement... the virus waits until both sides are exhausted, then offers them \"power\" as the final solution to settle the debate.",
        arabicText: "الفيروس لا يخلق الخلاف... الفيروس ينتظر حتى يتعب الطرفان، ثم يقدم لهم \"السلطة\" كحل نهائي لحسم النقاش.",
        duration: 5500
      }
    ],
    choices: [
      {
        id: "five-6a-1-continue",
        text: "Enter the Council Hall",
        arabicText: "ادخل قاعة المجمع",
        nextSceneId: "five-6b-1-constantine"
      }
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // Canonical scene 9.1: The Emperor and the Sage
  'five-6b-1-constantine': {
    id: 'five-6b-1-constantine',
    title: "The Emperor and the Sage",
    arabicTitle: "الإمبراطور والحكيم",
    part: 3,
    backgroundVideo: videoBg('nicaea'),
    backgroundImage: background('nicaea_council'),
    ambientKeys: ["amb.church_reverb", "amb.crowd_whisper"],
    dialogue: [
      {
        character: "Narrator",
        text: "Constantine entered the hall with imperial grandeur. He did not look like a religious man, but like a military general. Behind him, one step back, walked a man in a dark cloak. Yahya could not make out his features clearly, but felt a familiar chill.",
        arabicText: "دخل قسطنطين القاعة بأبهة إمبراطورية. لم يكن يبدو كرجل دين، بل كجنرال عسكري. خلفه، بخطوة واحدة، سار رجل يرتدي عباءة داكنة. لم يستطع يحيى تمييز ملامحه بوضوح، لكنه شعر بقشعريرة مألوفة.",
        duration: 7000
      },
      {
        character: "Yahya",
        text: "That is him. The Sage. The ancient version of the First Engineer.",
        arabicText: "هذا هو. الحكيم. النسخة القديمة من المهندس الأول.",
        duration: 3500
      },
      {
        character: "Constantine",
        text: "My empire is being torn apart by your disagreements. I do not care about the details of Christ's nature. I care about the unity of Rome. Agree... or I will make you agree.",
        arabicText: "إمبراطوريتي تتمزق بسبب خلافاتكم. أنا لا أهتم بتفاصيل طبيعة المسيح. أنا أهتم بوحدة روما. اتفقوا... أو سأجعلكم تتفقون.",
        duration: 6000
      },
      {
        character: "Narrator",
        text: "The Sage leaned close to Constantine's ear and whispered:",
        arabicText: "اقترب الحكيم من أذن قسطنطين وهمس:",
        duration: 3000
      },
      {
        character: "The Sage",
        text: "We will draft a single creed of faith. Whoever signs it is a friend of Rome. And whoever refuses... will be exiled and their books burned.",
        arabicText: "سنصيغ قانون إيمان واحد. من يوقع عليه، فهو صديق لروما. ومن يرفض... سيُنفى وتُحرق كتبه.",
        duration: 5500
      },
      {
        character: "Narrator",
        text: "Yahya and Laila watched as the bishops' faces transformed from truth-seekers into frightened politicians.",
        arabicText: "راقب يحيى وليلى كيف تحولت وجوه الأساقفة من باحثين عن الحقيقة إلى سياسيين خائفين.",
        duration: 5000
      },
      {
        character: "Laila",
        text: "Here the virus works. The algorithm did not change the creed directly. The algorithm introduced \"power\" into the equation. The moment religion was bound to the emperor's sword, the spirit died, and the oppressive institution was born.",
        arabicText: "هنا يعمل الفيروس. الخوارزمية لم تغير العقيدة مباشرة. الخوارزمية أدخلت \"السلطة\" إلى المعادلة. بمجرد أن ارتبط الدين بسيف الإمبراطور، ماتت الروح، ووُلدت المؤسسة القمعية.",
        duration: 7000
      },
      {
        character: "Yahya",
        text: "Religion was \"updated\" by imperial decree. Just as we update Terms of Service and force users to agree.",
        arabicText: "لقد تم \"تحديث\" الدين بقرار إمبراطوري. تماماً كما نُحدّث نحن شروط الاستخدام ونجبر المستخدمين على الموافقة.",
        duration: 5500
      }
    ],
    choices: [
      {
        id: "five-6b-1-continue",
        text: "The price — Laila's pain",
        arabicText: "الثمن — ألم ليلى",
        nextSceneId: "five-6c-1-laila-pain"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 1500,
    emotionalTone: 'dark',
  },

  // Canonical scene 10.1: The Price — Laila's Pain
  'five-6c-1-laila-pain': {
    id: 'five-6c-1-laila-pain',
    title: "The Price — Laila's Pain",
    arabicTitle: "ألم ليلى",
    part: 3,
    backgroundImage: background('white_space'),
    ambientKeys: ["amb.low_hum"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya stopped the simulation. Laila was trembling, silent tears running down her cheeks.",
        arabicText: "أوقف يحيى المحاكاة. كانت ليلى ترتجف، ودموع صامتة تنزل على خديها.",
        duration: 4500
      },
      {
        character: "Yahya",
        text: "Laila... are you alright?",
        arabicText: "ليلى... هل أنتِ بخير؟",
        duration: 2500
      },
      {
        character: "Laila",
        text: "I am fine. This just... reminds me of my mother.",
        arabicText: "أنا بخير. هذا فقط... يذكرني بأمي.",
        duration: 3000
      },
      {
        character: "Laila",
        text: "My mother was also a victim of \"the institution.\" My father was a man who wore the garb of religion, spoke in verses and hadiths, but was a monster at home. He used religion to justify his cruelty, to make my mother believe that her obedience to his injustice was obedience to God. He violated her soul in the name of the sacred.",
        arabicText: "أمي كانت ضحية لـ \"المؤسسة\" أيضاً. أبي كان رجلاً يرتدي عباءة الدين، يتحدث بالآيات والأحاديث، لكنه كان وحشاً في البيت. استخدم الدين ليبرر قسوته، ليجعل أمي تعتقد أن طاعتها لظلمه هي طاعة لله. لقد اغتصب روحها باسم المقدس.",
        duration: 9000
      },
      {
        character: "Laila",
        text: "That is why I studied religious psychology. I wanted to understand: is the flaw in God? Or in us? What we saw in Nicaea confirms what I concluded. God was not defeated in Nicaea, Yahya. \"The institution\" won temporarily. The virus does not attack God — the virus attacks our representation of God on earth.",
        arabicText: "لهذا السبب درست علم النفس الديني. كنت أريد أن أفهم: هل الخلل في الله؟ أم فينا؟ ما رأيناه في نيقية يؤكد لي ما توصلت إليه. الله لم يُهزم في نيقية يا يحيى. \"المؤسسة\" هي التي انتصرت مؤقتاً. الفيروس لا يهاجم الله، الفيروس يهاجم \"تمثيلنا\" لله على الأرض.",
        duration: 10000
      },
      {
        character: "Yahya",
        text: "You are the spiritual resistance, Laila. You refuse to abandon the truth, even when it is distorted by those who claim to protect it.",
        arabicText: "أنتِ المقاومة الروحية يا ليلى. أنتِ ترفضين التخلي عن الحقيقة، حتى عندما يتم تشويهها من قبل من يدعون حمايتها.",
        duration: 6000
      }
    ],
    choices: [
      {
        id: "five-6c-1-continue",
        text: "Hear Tarek's second message",
        arabicText: "اسمع رسالة طارق الثانية",
        nextSceneId: "five-6c-2-tarek-second"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 1500,
    emotionalTone: 'tragic',
  },

  // Canonical scene 10.2: Tarek's Second Message
  'five-6c-2-tarek-second': {
    id: 'five-6c-2-tarek-second',
    title: "Tarek's Second Message",
    arabicTitle: "رسالة طارق الثانية",
    part: 3,
    backgroundImage: background('corporate_lab'),
    audioUrl: audio('yahya_monologue'),
    ambientKeys: ["amb.server_room"],
    dialogue: [
      {
        character: "Tarek",
        text: "Yahya... if you saw Nicaea, you will understand how religions are stolen. But do you know how minds are stolen today? The big tech companies are the new \"Church of the Empire.\" We have our own \"creed\": recommendation algorithms. We decide what is \"truth\" and what is \"falsehood\" based on what generates more engagement.",
        arabicText: "يحيى... إذا رأيت نيقية، فستفهم كيف تُسرق الأديان. لكن هل تعرف كيف تُسرق العقول اليوم؟ شركات التكنولوجيا الكبرى هي \"كنيسة الإمبراطورية\" الجديدة. نحن نملك \"قانون الإيمان\" الخاص بنا: خوارزميات التوصية. نحن نحدد ما هو \"الحق\" وما هو \"الباطل\" بناءً على ما يجلب تفاعلاً أكثر.",
        duration: 10000
      },
      {
        character: "Tarek",
        text: "Whoever agrees with us, we grant them access and reach. And whoever disagrees, we apply \"digital exile — Shadowbanning.\" We are the Constantine of the modern age, but we do not use swords... we use dopamine.",
        arabicText: "من يوافقنا، نمنحه الوصول والانتشار. ومن يخالفنا، نطبق عليه \"النفي الرقمي — Shadowbanning\". نحن قسطنطين العصر الحديث، لكننا لا نستخدم السيوف... نحن نستخدم الدوبامين.",
        duration: 8000
      },
      {
        character: "Yahya",
        text: "The pattern repeats. The virus evolves. From the golden calf (material), to Nicaea (institutional), to...",
        arabicText: "النمط يتكرر. الفيروس يتطور. من العجل الذهبي (المادي)، إلى نيقية (المؤسسي)، إلى...",
        duration: 5000
      },
      {
        character: "Laila",
        text: "To ideology. When the virus abandons the need for a god entirely, and man himself becomes the god.",
        arabicText: "إلى الأيديولوجيا. عندما يتخلى الفيروس عن الحاجة إلى إله تماماً، ويصبح الإنسان هو الإله.",
        duration: 5000
      },
      {
        character: "Yahya",
        text: "To Andalusia... and the twentieth century.",
        arabicText: "إلى الأندلس... والقرن العشرين.",
        duration: 3000
      }
    ],
    choices: [
      {
        id: "five-6c-2-continue",
        text: "Continue to Part Four: Andalusia and the 20th Century",
        arabicText: "تابع إلى الجزء الرابع: الأندلس والقرن العشرون",
        nextSceneId: "six-8-1-andalusia"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 1500,
    emotionalTone: 'dark',
  },
};
