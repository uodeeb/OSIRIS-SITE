import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_FIVE: Record<string, Scene> = {
  // المشهد 6أ.1: مجمع نيقية - الجدال
  'five-6a-1-nicaea-debate': {
    id: 'five-6a-1-nicaea-debate',
    title: 'Nicaea: The Debate',
    arabicTitle: 'نيقية: الجدال',
    part: 3,
    backgroundVideo: videoBg('nicaea'),
    backgroundImage: background('nicaea_council'),
    ambientKeys: ["amb.church_reverb", "amb.crowd_whisper"],
    enterSfxKeys: ["sfx.gavel_strike"],
    dialogue: [
      {
        character: 'laila',
        text: "انتقلت المحاكاة إلى مدينة نيقية، عام 325 ميلادياً. كان المكان عبارة عن قاعة ملكية مهيبة، يعلوها صليب ذهبي ضخم، ويحيط بها مئات الأساقفة والرهبان القادمين من كل بقاع الأرض.",
        arabicText: "انتقلت المحاكاة إلى مدينة نيقية، عام 325 ميلادياً. كان المكان عبارة عن قاعة ملكية مهيبة، يعلوها صليب ذهبي ضخم، ويحيط بها مئات الأساقفة والرهبان القادمين من كل بقاع الأرض.",
        duration: 13200
      },
      {
        character: 'arius',
        text: "في وسط القاعة، وقف آريوس، شيخ وقور من الإسكندرية، يدافع عن التوحيد الخالص. صوته كان هادئاً، لكنه يحمل قوة الحق البسيط.",
        arabicText: "في وسط القاعة، وقف آريوس، شيخ وقور من الإسكندرية، يدافع عن التوحيد الخالص. صوته كان هادئاً، لكنه يحمل قوة الحق البسيط.",
        duration: 10400
      },
      {
        character: 'arius',
        text: "\"الله واحد، أحد، لا شريك له في أزليته،\" قال آريوس. \"المسيح هو كلمته وروحه، كائن مخلوق، عظيم، لكنه ليس إلهاً مساوياً للخالق.\"",
        arabicText: "\"الله واحد، أحد، لا شريك له في أزليته،\" قال آريوس. \"المسيح هو كلمته وروحه، كائن مخلوق، عظيم، لكنه ليس إلهاً مساوياً للخالق.\"",
        duration: 10000
      },
      {
        character: 'athanasius',
        text: "انفجر أثناسيوس، الشاب القوي والمنظم، في وجهه: \"كفر! هرطقة! المسيح هو الله المتجسد، مساوٍ للآب في الجوهر!\"",
        arabicText: "انفجر أثناسيوس، الشاب القوي والمنظم، في وجهه: \"كفر! هرطقة! المسيح هو الله المتجسد، مساوٍ للآب في الجوهر!\"",
        duration: 8800
      },
      {
        character: 'laila',
        text: "راقب يحيى المشهد بذهول. \"أوزيريس يحلل البيانات... الخلاف ليس لاهوتياً فقط يا ليلى. انظري إلى الإمبراطور قسطنطين الجالس هناك في الظل.\"",
        arabicText: "راقب يحيى المشهد بذهول. \"أوزيريس يحلل البيانات... الخلاف ليس لاهوتياً فقط يا ليلى. انظري إلى الإمبراطور قسطنطين الجالس هناك في الظل.\"",
        duration: 10800
      },
      {
        character: 'constantine',
        text: "كان قسطنطين يراقب الجدال بملل واضح. لم يكن يهتم بصحة أي من الرأيين، بل كان يبحث عن \"خوارزمية\" توحد إمبراطوريته الممزقة.",
        arabicText: "كان قسطنطين يراقب الجدال بملل واضح. لم يكن يهتم بصحة أي من الرأيين، بل كان يبحث عن \"خوارزمية\" توحد إمبراطوريته الممزقة.",
        duration: 10400
      },
      {
        character: 'constantine',
        text: "همس \"الحكيم\" (الكيان الذي ظهر لرمسيس) في أذن قسطنطين: \"التوحيد الخالص يمنح الناس مرجعاً أعلى منك يا مولاي. لكن إذا كان الإله يسكن في مؤسسة تملك أنت مفاتيحها، فستملك أنت أرواحهم كما تملك أجسادهم.\"",
        arabicText: "همس \"الحكيم\" (الكيان الذي ظهر لرمسيس) في أذن قسطنطين: \"التوحيد الخالص يمنح الناس مرجعاً أعلى منك يا مولاي. لكن إذا كان الإله يسكن في مؤسسة تملك أنت مفاتيحها، فستملك أنت أرواحهم كما تملك أجسادهم.\"",
        duration: 18400
      }
    ],
    choices: [
      {
        id: 'five-6a-1-continue',
        text: 'Witness the political decision',
        arabicText: 'شاهد القرار السياسي',
        nextSceneId: 'five-6b-1-constantine',
      },
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
        duration: 7000,
      },
      {
        character: "yahya",
        text: "That is him. The Sage. The ancient version of the First Engineer.",
        arabicText: "هذا هو. الحكيم. النسخة القديمة من المهندس الأول.",
        duration: 3500,
      },
      {
        character: "constantine",
        text: "My empire is being torn apart by your disagreements. I do not care about the details of Christ's nature. I care about the unity of Rome. Agree... or I will make you agree.",
        arabicText: "إمبراطوريتي تتمزق بسبب خلافاتكم. أنا لا أهتم بتفاصيل طبيعة المسيح. أنا أهتم بوحدة روما. اتفقوا... أو سأجعلكم تتفقون.",
        duration: 6000,
      },
      {
        character: "Narrator",
        text: "The Sage leaned close to Constantine's ear and whispered:",
        arabicText: "اقترب الحكيم من أذن قسطنطين وهمس:",
        duration: 3000,
      },
      {
        character: "The Sage",
        text: "We will draft a single creed of faith. Whoever signs it is a friend of Rome. And whoever refuses... will be exiled and their books burned.",
        arabicText: "سنصيغ قانون إيمان واحد. من يوقع عليه، فهو صديق لروما. ومن يرفض... سيُنفى وتُحرق كتبه.",
        duration: 5500,
      },
      {
        character: "Narrator",
        text: "Yahya and Laila watched as the bishops' faces transformed from truth-seekers into frightened politicians.",
        arabicText: "راقب يحيى وليلى كيف تحولت وجوه الأساقفة من باحثين عن الحقيقة إلى سياسيين خائفين.",
        duration: 5000,
      },
      {
        character: "laila",
        text: "Here the virus works. The algorithm did not change the creed directly. The algorithm introduced \"power\" into the equation. The moment religion was bound to the emperor's sword, the spirit died, and the oppressive institution was born.",
        arabicText: "هنا يعمل الفيروس. الخوارزمية لم تغير العقيدة مباشرة. الخوارزمية أدخلت \"السلطة\" إلى المعادلة. بمجرد أن ارتبط الدين بسيف الإمبراطور، ماتت الروح، ووُلدت المؤسسة القمعية.",
        duration: 7000,
      },
      {
        character: "yahya",
        text: "Religion was \"updated\" by imperial decree. Just as we update Terms of Service and force users to agree.",
        arabicText: "لقد تم \"تحديث\" الدين بقرار إمبراطوري. تماماً كما نُحدّث نحن شروط الاستخدام ونجبر المستخدمين على الموافقة.",
        duration: 5500,
      }
    ],
    choices: [
      {
        id: 'five-6b-1-continue',
        text: "The price — Laila's pain",
        arabicText: "الثمن — ألم ليلى",
        nextSceneId: 'five-6c-1-laila-pain',
      },
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
        duration: 4500,
      },
      {
        character: "yahya",
        text: "Laila... are you alright?",
        arabicText: "ليلى... هل أنتِ بخير؟",
        duration: 2500,
      },
      {
        character: "laila",
        text: "I am fine. This just... reminds me of my mother.",
        arabicText: "أنا بخير. هذا فقط... يذكرني بأمي.",
        duration: 3000,
      },
      {
        character: "laila",
        text: "My mother was also a victim of \"the institution.\" My father was a man who wore the garb of religion, spoke in verses and hadiths, but was a monster at home. He used religion to justify his cruelty, to make my mother believe that her obedience to his injustice was obedience to God. He violated her soul in the name of the sacred.",
        arabicText: "أمي كانت ضحية لـ \"المؤسسة\" أيضاً. أبي كان رجلاً يرتدي عباءة الدين، يتحدث بالآيات والأحاديث، لكنه كان وحشاً في البيت. استخدم الدين ليبرر قسوته، ليجعل أمي تعتقد أن طاعتها لظلمه هي طاعة لله. لقد اغتصب روحها باسم المقدس.",
        duration: 9000,
      },
      {
        character: "laila",
        text: "That is why I studied religious psychology. I wanted to understand: is the flaw in God? Or in us? What we saw in Nicaea confirms what I concluded. God was not defeated in Nicaea, Yahya. \"The institution\" won temporarily. The virus does not attack God — the virus attacks our representation of God on earth.",
        arabicText: "لهذا السبب درست علم النفس الديني. كنت أريد أن أفهم: هل الخلل في الله؟ أم فينا؟ ما رأيناه في نيقية يؤكد لي ما توصلت إليه. الله لم يُهزم في نيقية يا يحيى. \"المؤسسة\" هي التي انتصرت مؤقتاً. الفيروس لا يهاجم الله، الفيروس يهاجم \"تمثيلنا\" لله على الأرض.",
        duration: 10000,
      },
      {
        character: "yahya",
        text: "You are the spiritual resistance, Laila. You refuse to abandon the truth, even when it is distorted by those who claim to protect it.",
        arabicText: "أنتِ المقاومة الروحية يا ليلى. أنتِ ترفضين التخلي عن الحقيقة، حتى عندما يتم تشويهها من قبل من يدعون حمايتها.",
        duration: 6000,
      }
    ],
    choices: [
      {
        id: 'five-6c-1-continue',
        text: "Hear Tarek's second message",
        arabicText: "اسمع رسالة طارق الثانية",
        nextSceneId: 'five-6c-2-tarek-second',
      },
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
        character: "tarek_ghost",
        text: "Yahya... if you saw Nicaea, you will understand how religions are stolen. But do you know how minds are stolen today? The big tech companies are the new \"Church of the Empire.\" We have our own \"creed\": recommendation algorithms. We decide what is \"truth\" and what is \"falsehood\" based on what generates more engagement.",
        arabicText: "يحيى... إذا رأيت نيقية، فستفهم كيف تُسرق الأديان. لكن هل تعرف كيف تُسرق العقول اليوم؟ شركات التكنولوجيا الكبرى هي \"كنيسة الإمبراطورية\" الجديدة. نحن نملك \"قانون الإيمان\" الخاص بنا: خوارزميات التوصية. نحن نحدد ما هو \"الحق\" وما هو \"الباطل\" بناءً على ما يجلب تفاعلاً أكثر.",
        duration: 10000,
      },
      {
        character: "tarek_ghost",
        text: "Whoever agrees with us, we grant them access and reach. And whoever disagrees, we apply \"digital exile — Shadowbanning.\" We are the Constantine of the modern age, but we do not use swords... we use dopamine.",
        arabicText: "من يوافقنا، نمنحه الوصول والانتشار. ومن يخالفنا، نطبق عليه \"النفي الرقمي — Shadowbanning\". نحن قسطنطين العصر الحديث، لكننا لا نستخدم السيوف... نحن نستخدم الدوبامين.",
        duration: 8000,
      },
      {
        character: "yahya",
        text: "The pattern repeats. The virus evolves. From the golden calf (material), to Nicaea (institutional), to...",
        arabicText: "النمط يتكرر. الفيروس يتطور. من العجل الذهبي (المادي)، إلى نيقية (المؤسسي)، إلى...",
        duration: 5000,
      },
      {
        character: "laila",
        text: "To ideology. When the virus abandons the need for a god entirely, and man himself becomes the god.",
        arabicText: "إلى الأيديولوجيا. عندما يتخلى الفيروس عن الحاجة إلى إله تماماً، ويصبح الإنسان هو الإله.",
        duration: 5000,
      },
      {
        character: "yahya",
        text: "To Andalusia... and the twentieth century.",
        arabicText: "إلى الأندلس... والقرن العشرين.",
        duration: 3000,
      }
    ],
    choices: [
      {
        id: 'five-6c-2-continue',
        text: "Continue to Part Four: Andalusia and the 20th Century",
        arabicText: "تابع إلى الجزء الرابع: الأندلس والقرن العشرون",
        nextSceneId: 'six-8-1-andalusia',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 1500,
    emotionalTone: 'dark',
  },
};
