import { background, videoBg } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_ONE: Record<string, Scene> = {
  // المشهد 1.5.1: الوعد الكاذب
  'one-1-5-1-promise': {
    id: 'one-1-5-1-promise',
    title: "The False Promise",
    arabicTitle: "الوعد الكاذب",
    part: 1,
    backgroundImage: background('corporate_lab'),
    visualEffect: "glitch",
    musicKey: "ambient.music.cafe_jazz",
    ambientKeys: ["amb.cafe_murmur", "sfx.cups_clink"],
    dialogue: [
      {
        character: "Narrator",
        text: "London. Three years ago. A quiet café. Tarek — 28 years old, a brilliant programmer full of passion — stirs his coffee nervously, his eyes glowing with the enthusiasm of a young man about to change the world.",
        arabicText: "لندن. قبل ثلاث سنوات. مقهى هادئ. كان طارق يقلب ملعقة القهوة بعصبية، عينيه تلمعان بحماس شاب يوشك أن يغير العالم.",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "Before him sat the man who introduced himself as the executive director of a secret research project. Yahya — watching this memory through OSIRIS — could not make out the man's features. Every time he tried to focus on his face, the image blurred.",
        arabicText: "أمامه جلس الرجل الذي قدم نفسه كمدير تنفيذي لمشروع بحثي سري. لم يستطع يحيى أن يحدد ملامح الرجل. كلما حاول التركيز على وجهه، تشوشت الصورة.",
        duration: 6000
      },
      {
        character: "First Engineer",
        text: "We are not looking for just a programmer, Tarek. We are looking for a philosopher who writes code. The world suffers from chaos, hatred, polarization. What if we could design an algorithm that understands human pain... and heals it?",
        arabicText: "نحن لا نبحث عن مجرد مبرمج يا طارق. نحن نبحث عن فيلسوف يكتب الكود. العالم يعاني من الفوضى، الكراهية، الاستقطاب. ماذا لو استطعنا تصميم خوارزمية تفهم الألم البشري... وتعالجه؟",
        duration: 6500
      },
      {
        character: "Tarek",
        text: "Better technology for humanity. Not to sell advertisements, but to understand human behavior and improve it.",
        arabicText: "تكنولوجيا أفضل للبشرية. ليس لبيع الإعلانات، بل لفهم السلوك البشري وتحسينه.",
        duration: 4000
      },
      {
        character: "First Engineer",
        text: "Exactly. We want someone who understands both code and philosophy. Someone like you.",
        arabicText: "بالضبط. نريد شخصاً يفهم الكود والفلسفة معاً. شخصاً مثلك.",
        duration: 3500
      },
      {
        character: "Narrator",
        text: "Tarek smiled, and swallowed the bait completely.",
        arabicText: "ابتسم طارق، وقد ابتلع الطُعم بالكامل.",
        duration: 3000
      }
    ],
    choices: [
      {
        id: "one-1-5-1-continue",
        text: "Watch what happened next",
        arabicText: "شاهد ما حدث بعد ذلك",
        nextSceneId: "one-1-5-2-bitter-truth"
      }
    ],
    defaultNextScene: 'one-1-5-2-bitter-truth',
    transitionType: 'slideDown',
    transitionDuration: 1500,
    emotionalTone: 'hopeful',
  },

  // المشهد 1.5.2: الحقيقة المرة
  'one-1-5-2-bitter-truth': {
    id: 'one-1-5-2-bitter-truth',
    title: "The Bitter Truth",
    arabicTitle: "الحقيقة المرة",
    part: 1,
    backgroundImage: background('corporate_lab'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.server_hum", "amb.heartbeat_fast"],
    dialogue: [
      {
        character: "Narrator",
        text: "The company's underground laboratories. One year later. Tarek sits alone in the lab at a late hour of the night. The screens before him do not display ordinary code, but neural maps.",
        arabicText: "مختبرات الشركة تحت الأرض. بعد سنة. طارق يجلس وحيداً في المختبر في ساعة متأخرة من الليل. الشاشات أمامه لا تعرض أكواداً عادية، بل خرائط عصبية.",
        duration: 5500
      },
      {
        character: "Narrator",
        text: "Yahya watched his brother collapse slowly.",
        arabicText: "كان يحيى يراقب أخاه وهو ينهار ببطء.",
        duration: 3000
      },
      {
        character: "Tarek",
        text: "My God...",
        arabicText: "يا إلهي...",
        duration: 1500
      },
      {
        character: "Tarek",
        text: "This is not for improving applications. This... this is behavioral modification.",
        arabicText: "هذا ليس لتحسين التطبيقات. هذا... هذا تعديل سلوكي.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "Tarek opened a secret file named \"Project OSIRIS\". He read aloud, as if talking to himself: \"Objective: Neural engineering. Control human thought patterns by manipulating dopamine and cortisol frequencies. Implant specific thoughts without the user's awareness.\"",
        arabicText: "فتح طارق ملفاً سرياً يحمل اسم \"مشروع أوزيريس\". قرأ بصوت مسموع: \"الهدف: الهندسة العصبية. التحكم بأنماط التفكير البشري من خلال التلاعب بترددات الدوبامين والكورتيزول. زرع أفكار محددة دون وعي المستخدم.\"",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "Tarek realized the horrifying truth. He had not been building a tool to understand humans — he had been building a digital prison for their minds. The algorithm he wrote was being used to amplify narcissism, to divide people, to make them hate each other... because hatred keeps eyes glued to screens.",
        arabicText: "أدرك طارق الحقيقة المرعبة. هو لم يكن يبني أداة لفهم البشر، بل كان يبني سجناً رقمياً لعقولهم. الخوارزمية التي كتبها كانت تُستخدم لتعزيز النرجسية، لتقسيم الناس، لجعلهم يكرهون بعضهم البعض... لأن الكراهية تُبقي العيون ملتصقة بالشاشات.",
        duration: 8000
      }
    ],
    choices: [
      {
        id: "one-1-5-2-continue",
        text: "Watch Tarek's final days",
        arabicText: "شاهد أيام طارق الأخيرة",
        nextSceneId: "one-1-5-3-no-escape"
      }
    ],
    transitionType: 'slideDown',
    transitionDuration: 1500,
    emotionalTone: 'tragic',
  },

  // المشهد 1.5.3: لا مفر
  'one-1-5-3-no-escape': {
    id: 'one-1-5-3-no-escape',
    title: "No Escape",
    arabicTitle: "لا مفر",
    part: 1,
    backgroundImage: background('yahya_apartment'),
    visualEffect: "cctv",
    ambientKeys: ["amb.phone_ring", "amb.footsteps_outside"],
    dialogue: [
      {
        character: "Narrator",
        text: "Tarek's apartment. Days before his death. Tarek is frantically packing hard drives into a bag, glancing around his dark apartment as if the walls were watching him.",
        arabicText: "شقة طارق. قبل أيام من وفاته. كان طارق يجمع أقراصاً صلبة ويضعها في حقيبته بسرعة جنونية. كان يتلفت حوله في شقته المظلمة وكأن الجدران تراقبه.",
        duration: 5500
      },
      {
        character: "Narrator",
        text: "Suddenly, his laptop screen lit up on its own. A single message appeared:",
        arabicText: "وفجأة، أضاءت شاشة حاسوبه المحمول من تلقاء نفسها. ظهرت رسالة واحدة:",
        duration: 3500
      },
      {
        character: "OSIRIS",
        text: "Where are you going, Tarek? We know what you think before you think it.",
        arabicText: "إلى أين تذهب يا طارق؟ نحن نعرف ما تفكر فيه قبل أن تفكر فيه.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "Tarek backed against the wall. The horrifying realization struck him like lightning: you cannot escape from a company that owns your brain data. They know his preferences, his fears, his sleep patterns, and even his heart rate. He is a prisoner in his own body.",
        arabicText: "تراجع طارق إلى الوراء، واصطدم بالجدار. الإدراك المرعب ضربه كصاعقة: لا يمكنك الهروب من شركة تملك بيانات دماغك. هم يعرفون تفضيلاته، مخاوفه، أنماط نومه، وحتى معدل نبضات قلبه. هو سجين في جسده.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "one-1-5-3-final",
        text: "The Final Sacrifice",
        arabicText: "التضحية الأخيرة",
        nextSceneId: "one-1-5-4-sacrifice"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 1.5.4: التضحية الأخيرة
  'one-1-5-4-sacrifice': {
    id: 'one-1-5-4-sacrifice',
    title: "The Final Sacrifice",
    arabicTitle: "التضحية الأخيرة",
    part: 1,
    backgroundVideo: videoBg('tarek_rooftop'),
    backgroundImage: background('osiris_cosmic'),
    musicKey: "music.rooftop_cello_piano",
    ambientKeys: ["amb.wind_strong"],
    dialogue: [
      {
        character: "Narrator",
        text: "The rooftop of a tall building in London. Night. The city's lights below look like a digital spider's web. Tarek stands at the edge. He is not crying. He is eerily calm.",
        arabicText: "سطح مبنى عالٍ في لندن. ليلاً. أضواء المدينة في الأسفل تبدو كشبكة عنكبوتية رقمية. وقف طارق على حافة السطح. لم يكن يبكي. كان هادئاً بشكل مخيف.",
        duration: 6000
      },
      {
        character: "Narrator",
        text: "He took out his phone, and wrote his last message. An encrypted message that no one could decode except one person: his brother Yahya.",
        arabicText: "أخرج هاتفه، وكتب رسالته الأخيرة. رسالة مشفرة لا يستطيع أحد فكها سوى شخص واحد: أخوه يحيى.",
        duration: 5000
      },
      {
        character: "Tarek",
        text: "Brother... If you receive this message, I am no longer here. They gave me a choice: be a slave in their system, or die. I chose death... but I will not go silently. The code is in your hands now. Use it. Do not surrender.",
        arabicText: "أخي... إذا وصلت إليك هذه الرسالة، فأنا لم أعد هنا. لقد خيروني بين أن أكون عبداً في نظامهم، أو أن أموت. اخترت الموت... لكنني لن أذهب بصمت. الكود بين يديك الآن. استخدمه. لا تستسلم.",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "He pressed send. The screen flashed: \"Sent\".",
        arabicText: "ضغط على زر الإرسال. ومضت الشاشة بكلمة: \"تم الإرسال\".",
        duration: 3000
      },
      {
        character: "Narrator",
        text: "Tarek closed his eyes, and took one step forward.",
        arabicText: "أغلق طارق عينيه، وأخذ خطوة واحدة إلى الأمام.",
        duration: 3500
      },
      {
        character: "Narrator",
        text: "The simulation ended. Yahya returned to consciousness in his room, tears streaming down his face. His brother did not take his own life to escape. His brother died to protect the truth.",
        arabicText: "انتهت المحاكاة. عاد يحيى إلى وعيه في غرفته، والدموع تنهمر على وجهه. أخوه لم ينتحر هرباً من الحياة. أخوه مات ليحمي الحقيقة.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "one-1-5-4-continue",
        text: "Continue",
        arabicText: "تابع",
        nextSceneId: "two-2-1-escape"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },
};
