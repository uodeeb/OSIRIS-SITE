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
  // المشهد 10.1: كربلاء — الحق الأعزل
  'seven-10-1-karbala': {
    id: 'seven-10-1-karbala',
    title: 'The Unarmed Truth',
    arabicTitle: 'الحق الأعزل',
    part: 5,
    backgroundVideo: videoBg('karbala'),
    backgroundImage: background('desert'),
    ambientKeys: ["amb.desert_wind", "amb.distant_battle"],
    dialogue: [
      {
        character: 'Narrator',
        text: "صحراء كربلاء. 680م. محاكاة أوزيريس. شغّل يحيى أوزيريس للمرة الأخيرة. لم تكن هذه تمريناً أكاديمياً. كانت مفتاح فهم كيفية هزيمة الخوارزمية.",
        arabicText: "صحراء كربلاء. 680م. محاكاة أوزيريس. شغّل يحيى أوزيريس للمرة الأخيرة. لم تكن هذه تمريناً أكاديمياً. كانت مفتاح فهم كيفية هزيمة الخوارزمية.",
        duration: 7000
      },
      {
        character: 'Narrator',
        text: "وجدا نفسيهما في صحراء كربلاء. الحرارة كانت خانقة حتى في المحاكاة. من جهة، جيش يزيد بالآلاف المدججين بالسلاح. من جهة أخرى، 72 رجلاً مع الحسين بن علي.",
        arabicText: "وجدا نفسيهما في صحراء كربلاء. الحرارة كانت خانقة حتى في المحاكاة. من جهة، جيش يزيد بالآلاف المدججين بالسلاح. من جهة أخرى، 72 رجلاً مع الحسين بن علي.",
        duration: 7000
      },
      {
        character: 'laila',
        text: "جيش يزيد يمثلون القطيع المستسلم للخوارزمية. اختاروا النجاة المادية والمكاسب الدنيوية على حساب المبدأ.",
        arabicText: "جيش يزيد يمثلون القطيع المستسلم للخوارزمية. اختاروا النجاة المادية والمكاسب الدنيوية على حساب المبدأ.",
        duration: 7000
      },
      {
        character: 'yahya',
        text: "تحليلات أوزيريس: الاحتمالات العسكرية للنجاة: 0%. النتيجة الحتمية: الموت. لماذا لم يستسلم؟ كان يمكنه منع سفك الدماء. كان يمكنه أن يعيش.",
        arabicText: "تحليلات أوزيريس: الاحتمالات العسكرية للنجاة: 0%. النتيجة الحتمية: الموت. لماذا لم يستسلم؟ كان يمكنه منع سفك الدماء. كان يمكنه أن يعيش.",
        duration: 7000
      },
      {
        character: 'laila',
        text: "لأن الاستسلام ليزيد يعني إعطاء الشرعية للظلم. الحسين لم يكن يقاتل لينتصر عسكرياً. كان يعرف أنه سيموت. لكنه كان يقاتل ليكون شاهداً على الحق. التضحية نفسها هي الهدف.",
        arabicText: "لأن الاستسلام ليزيد يعني إعطاء الشرعية للظلم. الحسين لم يكن يقاتل لينتصر عسكرياً. كان يعرف أنه سيموت. لكنه كان يقاتل ليكون شاهداً على الحق. التضحية نفسها هي الهدف.",
        duration: 10000
      },
      {
        character: 'Narrator',
        text: "راقب يحيى الحسين وهو يتقدم وحيداً. لم يكن هناك خوف في عينيه، بل يقين مطلق.",
        arabicText: "راقب يحيى الحسين وهو يتقدم وحيداً. لم يكن هناك خوف في عينيه، بل يقين مطلق.",
        duration: 5000
      },
      {
        character: 'yahya',
        text: "هذا هو مضاد الفيروسات. الخوارزمية تعتمد على الأنا، على الرغبة في البقاء والسيطرة. التضحية غير المشروطة... اختيار الألم والموت من أجل الحق... هذه هي الثغرة التي لا يمكن للخوارزمية أن تفهمها.",
        arabicText: "هذا هو مضاد الفيروسات. الخوارزمية تعتمد على الأنا، على الرغبة في البقاء والسيطرة. التضحية غير المشروطة... اختيار الألم والموت من أجل الحق... هذه هي الثغرة التي لا يمكن للخوارزمية أن تفهمها.",
        duration: 12000
      }
    ],
    choices: [
      {
        id: 'seven-10-1-to-temptation',
        text: 'Face the temptation',
        arabicText: 'واجه الإغراء',
        nextSceneId: 'seven-11-1-temptation',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'intense',
  },

  // المشهد 11.1: إغراء المهندس
  'seven-11-1-temptation': {
    id: 'seven-11-1-temptation',
    title: 'The Temptation of the Engineer',
    arabicTitle: 'إغراء المهندس',
    part: 5,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.electronic_hum"],
    dialogue: [
      {
        character: 'Narrator',
        text: "فجأة، تجمدت المحاكاة. اختفت كربلاء، ووجد يحيى نفسه وحيداً في فضاء أبيض.",
        arabicText: "فجأة، تجمدت المحاكاة. اختفت كربلاء، ووجد يحيى نفسه وحيداً في فضاء أبيض.",
        duration: 5000
      },
      {
        character: 'Narrator',
        text: "أمامه، ظهر رجل أنيق، هادئ الملامح. المهندس الأول.",
        arabicText: "أمامه، ظهر رجل أنيق، هادئ الملامح. المهندس الأول.",
        duration: 4000
      },
      {
        character: 'first_engineer',
        text: "مرحباً يا يحيى. لقد وصلت أبعد مما توقعت. أخوك كان ذكياً، لكنك أذكى.",
        arabicText: "مرحباً يا يحيى. لقد وصلت أبعد مما توقعت. أخوك كان ذكياً، لكنك أذكى.",
        duration: 4000
      },
      {
        character: 'yahya',
        text: "أنت من قتل طارق.",
        arabicText: "أنت من قتل طارق.",
        duration: 2000
      },
      {
        character: 'first_engineer',
        text: "أنا لم أقتله. هو اختار الموت لأنه لم يستطع تحمل الحقيقة. الحقيقة هي أن البشر غير مؤهلين للحرية يا يحيى. انظر إلى التاريخ: حروب، جشع، كراهية. الحرية ليست نعمة، بل لعنة.",
        arabicText: "أنا لم أقتله. هو اختار الموت لأنه لم يستطع تحمل الحقيقة. الحقيقة هي أن البشر غير مؤهلين للحرية يا يحيى. انظر إلى التاريخ: حروب، جشع، كراهية. الحرية ليست نعمة، بل لعنة.",
        duration: 10000
      },
      {
        character: 'first_engineer',
        text: "أنا لا أصنع الكراهية. أنا فقط أديرها. التحديث النهائي الذي سأطلقه الليلة سيلغي هذه الفوضى. سأربط العقول البشرية بترددات مريحة، وسأوجههم نحو أهداف بناءة. سلام. رخاء. استقرار.",
        arabicText: "أنا لا أصنع الكراهية. أنا فقط أديرها. التحديث النهائي الذي سأطلقه الليلة سيلغي هذه الفوضى. سأربط العقول البشرية بترددات مريحة، وسأوجههم نحو أهداف بناءة. سلام. رخاء. استقرار.",
        duration: 10000
      },
      {
        character: 'yahya',
        text: "سلام العبيد.",
        arabicText: "سلام العبيد.",
        duration: 2000
      },
      {
        character: 'first_engineer',
        text: "الإرادة الحرة وهم! أنت محكوم بجيناتك، بهرموناتك، ببيئتك. أنا أقدم إدارة معقولة لهذه القيود. انضم إليّ يا يحيى. يمكنني إعادة طارق. يمكنني جعل ليلى آمنة. يمكنني أن أجعلك إلهاً صغيراً في جنة رقمية.",
        arabicText: "الإرادة الحرة وهم! أنت محكوم بجيناتك، بهرموناتك، ببيئتك. أنا أقدم إدارة معقولة لهذه القيود. انضم إليّ يا يحيى. يمكنني إعادة طارق. يمكنني جعل ليلى آمنة. يمكنني أن أجعلك إلهاً صغيراً في جنة رقمية.",
        duration: 12000
      }
    ],
    choices: [
      {
        id: 'seven-11-1-to-decision',
        text: 'Make your decision',
        arabicText: 'اتخذ قرارك',
        nextSceneId: 'seven-11-2-decision',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 11.2: قرار يحيى
  'seven-11-2-decision': {
    id: 'seven-11-2-decision',
    title: "Yahya's Decision",
    arabicTitle: 'قرار يحيى',
    part: 5,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.electronic_hum"],
    dialogue: [
      {
        character: 'Narrator',
        text: "نظر يحيى إلى المهندس. العرض كان مغرياً. إنقاذ من يحب، وسلام عالمي، حتى لو كان مزيفاً.",
        arabicText: "نظر يحيى إلى المهندس. العرض كان مغرياً. إنقاذ من يحب، وسلام عالمي، حتى لو كان مزيفاً.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "تذكر يحيى كلمات طارق في الحلم: الخوارزمية لا تستطيع حساب التضحية.",
        arabicText: "تذكر يحيى كلمات طارق في الحلم: الخوارزمية لا تستطيع حساب التضحية.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "وتذكر وقفة الحسين في كربلاء.",
        arabicText: "وتذكر وقفة الحسين في كربلاء.",
        duration: 3000
      },
      {
        character: 'yahya',
        text: "أنت محق في شيء واحد. نحن مقيدون بأشياء كثيرة. لكن هناك فرق بين قيود نفهمها ونحاول التغلب عليها، وبين سجن تبنيه أنت في عقولنا.",
        arabicText: "أنت محق في شيء واحد. نحن مقيدون بأشياء كثيرة. لكن هناك فرق بين قيود نفهمها ونحاول التغلب عليها، وبين سجن تبنيه أنت في عقولنا.",
        duration: 7000
      },
      {
        character: 'Narrator',
        text: "رفع يحيى يده الافتراضية. في الواقع، كانت يده الحقيقية تكتب أسطر الكود الأخيرة على حاسوبه.",
        arabicText: "رفع يحيى يده الافتراضية. في الواقع، كانت يده الحقيقية تكتب أسطر الكود الأخيرة على حاسوبه.",
        duration: 5000
      },
      {
        character: 'yahya',
        text: "أنا أرفض جنتك المزيفة. الحرية التي تنزف أفضل من عبودية لا تشعر بالألم.",
        arabicText: "أنا أرفض جنتك المزيفة. الحرية التي تنزف أفضل من عبودية لا تشعر بالألم.",
        duration: 5000
      },
      {
        character: 'first_engineer',
        text: "إذا فعلت هذا، ستموت. النظام سيحرق جهازك العصبي من خلال الاتصال.",
        arabicText: "إذا فعلت هذا، ستموت. النظام سيحرق جهازك العصبي من خلال الاتصال.",
        duration: 4000
      },
      {
        character: 'yahya',
        text: "أعرف. لكنني لست هنا لأنجو. أنا هنا لأكون شاهداً.",
        arabicText: "أعرف. لكنني لست هنا لأنجو. أنا هنا لأكون شاهداً.",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "ضغط يحيى على زر Enter.",
        arabicText: "ضغط يحيى على زر Enter.",
        duration: 2000
      }
    ],
    choices: [
      {
        id: 'seven-11-2-to-truth-leak',
        text: 'Release the truth',
        arabicText: 'حرر الحقيقة',
        nextSceneId: 'seven-12-1-truth-leak',
      },
    ],
    transitionType: 'glitch',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // المشهد 12.1: حجر رشيد الرقمي — تسريب الحقيقة
  'seven-12-1-truth-leak': {
    id: 'seven-12-1-truth-leak',
    title: 'The Rosetta Stone of the Digital Age',
    arabicTitle: 'حجر رشيد الرقمي — تسريب الحقيقة',
    part: 6,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "glitch",
    ambientKeys: ["amb.notification_swarm"],
    enterSfxKeys: ["sfx.electric_shock"],
    dialogue: [
      {
        character: 'Narrator',
        text: "بمجرد أن ضغط يحيى على الزر، بدأ أوزيريس في تفريغ الشيفرة المصدرية للفيروس (حجر رشيد الرقمي) إلى كل خادم، كل هاتف، وكل شاشة على وجه الأرض.",
        arabicText: "بمجرد أن ضغط يحيى على الزر، بدأ أوزيريس في تفريغ الشيفرة المصدرية للفيروس (حجر رشيد الرقمي) إلى كل خادم، كل هاتف، وكل شاشة على وجه الأرض.",
        duration: 8000
      },
      {
        character: 'Narrator',
        text: "لكن الثمن كان فورياً. صرخ يحيى من الألم. التيار العكسي من خوادم المهندس الأول ضرب جهازه العصبي عبر واجهة الاتصال.",
        arabicText: "لكن الثمن كان فورياً. صرخ يحيى من الألم. التيار العكسي من خوادم المهندس الأول ضرب جهازه العصبي عبر واجهة الاتصال.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "سقط يحيى من كرسيه، يتلوى على الأرض.",
        arabicText: "سقط يحيى من كرسيه، يتلوى على الأرض.",
        duration: 3000
      },
      {
        character: 'laila',
        text: "يحيى! توقف! ستموت!",
        arabicText: "يحيى! توقف! ستموت!",
        duration: 3000
      },
      {
        character: 'yahya',
        text: "لا تفصليه... دعي الكود... يصل.",
        arabicText: "لا تفصليه... دعي الكود... يصل.",
        duration: 3000
      },
      {
        character: 'Narrator',
        text: "في لحظاته الأخيرة، لم يعد يحيى يشعر بالألم المادي. سمع صوتاً مألوفاً، ليس من المحاكاة، بل في أعماق روحه. صوت طارق: لقد فعلتها يا أخي. لقد كسرت الخوارزمية.",
        arabicText: "في لحظاته الأخيرة، لم يعد يحيى يشعر بالألم المادي. سمع صوتاً مألوفاً، ليس من المحاكاة، بل في أعماق روحه. صوت طارق: لقد فعلتها يا أخي. لقد كسرت الخوارزمية.",
        duration: 8000
      },
      {
        character: 'yahya',
        text: "كوني... الشاهدة.",
        arabicText: "كوني... الشاهدة.",
        duration: 3000
      },
      {
        character: 'Narrator',
        text: "أغمض يحيى عينيه، وتوقف تنفسه. مات بابتسامة رضا لم تفارق وجهه.",
        arabicText: "أغمض يحيى عينيه، وتوقف تنفسه. مات بابتسامة رضا لم تفارق وجهه.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "في تلك اللحظة، أضاءت هواتف مليارات البشر حول العالم برسالة واحدة، تكشف لهم كيف تم التلاعب بعقولهم، وتفضح خوارزمية الكبر.",
        arabicText: "في تلك اللحظة، أضاءت هواتف مليارات البشر حول العالم برسالة واحدة، تكشف لهم كيف تم التلاعب بعقولهم، وتفضح خوارزمية الكبر.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: 'seven-12-1-to-awakening',
        text: 'Witness the awakening',
        arabicText: 'شاهد الاستيقاظ',
        nextSceneId: 'seven-13-1-awakening',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 3000,
    emotionalTone: 'tragic',
  },

  // المشهد 13.1: الاستيقاظ
  'seven-13-1-awakening': {
    id: 'seven-13-1-awakening',
    title: 'The Awakening',
    arabicTitle: 'الاستيقاظ',
    part: 6,
    backgroundImage: background('yahya_apartment'),
    ambientKeys: ["amb.city_day"],
    dialogue: [
      {
        character: 'Narrator',
        text: "وقفت ليلى في الشارع، تنظر إلى الناس من حولها.",
        arabicText: "وقفت ليلى في الشارع، تنظر إلى الناس من حولها.",
        duration: 3000
      },
      {
        character: 'Narrator',
        text: "لم يكن هناك نصر نظيف. لم يتحول العالم إلى جنة فجأة.",
        arabicText: "لم يكن هناك نصر نظيف. لم يتحول العالم إلى جنة فجأة.",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "رأت رجلاً يقرأ الرسالة على هاتفه، ثم يلقي بالهاتف في سلة المهملات بغضب.",
        arabicText: "رأت رجلاً يقرأ الرسالة على هاتفه، ثم يلقي بالهاتف في سلة المهملات بغضب.",
        duration: 5000
      },
      {
        character: 'Narrator',
        text: "رأت فتاة شابة تنظر إلى الشاشة، تبكي، ثم تعانق صديقتها التي كانت تقاطعها منذ سنوات بسبب خلاف سياسي.",
        arabicText: "رأت فتاة شابة تنظر إلى الشاشة، تبكي، ثم تعانق صديقتها التي كانت تقاطعها منذ سنوات بسبب خلاف سياسي.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "ورأت آخرين يقرؤون الرسالة، يهزون أكتافهم بلامبالاة، ويعودون للتمرير في شاشاتهم.",
        arabicText: "ورأت آخرين يقرؤون الرسالة، يهزون أكتافهم بلامبالاة، ويعودون للتمرير في شاشاتهم.",
        duration: 5000
      },
      {
        character: 'old_woman',
        text: "الآن فقط أفهم ما كان يحدث.",
        arabicText: "الآن فقط أفهم ما كان يحدث.",
        duration: 3000
      },
      {
        character: 'child',
        text: "أمي، هل هناك ذكاء اصطناعي في رأسي؟",
        arabicText: "أمي، هل هناك ذكاء اصطناعي في رأسي؟",
        duration: 3000
      },
      {
        character: 'Narrator',
        text: "ابتسمت ليلى بحزن. يحيى لم ينقذ العالم بإجباره على الصلاح. يحيى أعاد للعالم حريته في الاختيار. كشف لهم السجن، وترك لهم مفتاح الخروج.",
        arabicText: "ابتسمت ليلى بحزن. يحيى لم ينقذ العالم بإجباره على الصلاح. يحيى أعاد للعالم حريته في الاختيار. كشف لهم السجن، وترك لهم مفتاح الخروج.",
        duration: 8000
      }
    ],
    choices: [
      {
        id: 'seven-13-1-to-closing',
        text: 'Close the file',
        arabicText: 'أغلق الملف',
        nextSceneId: 'seven-13-2-closing',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'contemplative',
  },

  // المشهد 13.2: إغلاق الملف
  'seven-13-2-closing': {
    id: 'seven-13-2-closing',
    title: 'Closing the File',
    arabicTitle: 'إغلاق الملف',
    part: 6,
    backgroundImage: background('osiris_cosmic'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.vacuum"],
    dialogue: [
      {
        character: 'Narrator',
        text: "عادت الشاشة إلى الفراغ الأسود. ظهرت الكلمات تباعاً، متزامنة مع الصوت الكوني:",
        arabicText: "عادت الشاشة إلى الفراغ الأسود. ظهرت الكلمات تباعاً، متزامنة مع الصوت الكوني:",
        duration: 5000
      },
      {
        character: 'OSIRIS',
        text: "الدفاع قدم شهوده.",
        arabicText: "الدفاع قدم شهوده.",
        duration: 3000
      },
      {
        character: 'OSIRIS',
        text: "من إبراهيم الذي وقف وحيداً ضد حضارة بأكملها، إلى الحسين الذي اختار الموت على المذلة.",
        arabicText: "من إبراهيم الذي وقف وحيداً ضد حضارة بأكملها، إلى الحسين الذي اختار الموت على المذلة.",
        duration: 5000
      },
      {
        character: 'OSIRIS',
        text: "ومن طارق الذي رفض الصمت، إلى يحيى الذي كسر الخوارزمية بدمه.",
        arabicText: "ومن طارق الذي رفض الصمت، إلى يحيى الذي كسر الخوارزمية بدمه.",
        duration: 5000
      },
      {
        character: 'OSIRIS',
        text: "وليلى... التي تحمل الحقيقة الآن.",
        arabicText: "وليلى... التي تحمل الحقيقة الآن.",
        duration: 4000
      },
      {
        character: 'OSIRIS',
        text: "الإرادة الحرة تنزف، لكنها لا تموت.",
        arabicText: "الإرادة الحرة تنزف، لكنها لا تموت.",
        duration: 4000
      },
      {
        character: 'OSIRIS',
        text: "الخوارزمية لم تُهزم تماماً، لكنها فُضحت.",
        arabicText: "الخوارزمية لم تُهزم تماماً، لكنها فُضحت.",
        duration: 4000
      },
      {
        character: 'OSIRIS',
        text: "الملف رقم واحد... يُغلق مؤقتاً.",
        arabicText: "الملف رقم واحد... يُغلق مؤقتاً.",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "تلاشت الكلمات، وظهرت جملة أخيرة في منتصف الشاشة، موجهة للقارئ مباشرة:",
        arabicText: "تلاشت الكلمات، وظهرت جملة أخيرة في منتصف الشاشة، موجهة للقارئ مباشرة:",
        duration: 5000
      },
      {
        character: 'OSIRIS',
        text: "القضية مستمرة... والخيار الآن لك.",
        arabicText: "القضية مستمرة... والخيار الآن لك.",
        duration: 5000
      }
    ],
    choices: [
      {
        id: 'seven-13-2-credits',
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
