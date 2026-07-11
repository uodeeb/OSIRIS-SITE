import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_FOUR: Record<string, Scene> = {
  // Scene 5.1: The Mirror of the Nile (restored Ramses runtime material)
  'two-mirror-scene': {
    id: 'two-mirror-scene',
    title: "The Mirror of the Nile",
    arabicTitle: "مرآة النيل",
    part: 2,
    backgroundVideo: videoBg('egypt_nile_temple'),
    backgroundImage: background('pharaoh_temple'),
    ambientKeys: ["amb.desert_wind", "amb.crowd_murmur"],
    dialogue: [
      {
        character: "Narrator",
        text: "نقل أوزيريس يحيى وليلى إلى مصر القديمة. لم تكن مصر التي تظهر في الأفلام، بل كانت حضارة حقيقية، تنبض بالحياة والعبقرية الهندسية.",
        arabicText: "نقل أوزيريس يحيى وليلى إلى مصر القديمة. لم تكن مصر التي تظهر في الأفلام، بل كانت حضارة حقيقية، تنبض بالحياة والعبقرية الهندسية.",
        duration: 2000,
      },
      {
        character: "Narrator",
        text: "وقف رمسيس الثاني، المحارب الذي لا يُهزم، ينظر إلى انعكاس صورته في مياه النيل الصافية. كان يرتدي زياً ملكياً بسيطاً، لكن هيبته كانت تملأ المكان.",
        arabicText: "وقف رمسيس الثاني، المحارب الذي لا يُهزم، ينظر إلى انعكاس صورته في مياه النيل الصافية. كان يرتدي زياً ملكياً بسيطاً، لكن هيبته كانت تملأ المكان.",
        duration: 2000,
      },
      {
        character: "Narrator",
        text: "\"هذا هو رمسيس،\" قال يحيى وهو يقرأ بيانات أوزيريس. \"عبقري، قائد عسكري فذ، وباني أعظم المعابد. لكن الخوارزمية وجدت فيه ثغرة.\"",
        arabicText: "\"هذا هو رمسيس،\" قال يحيى وهو يقرأ بيانات أوزيريس. \"عبقري، قائد عسكري فذ، وباني أعظم المعابد. لكن الخوارزمية وجدت فيه ثغرة.\"",
        duration: 1500,
      },
      {
        character: "ramses",
        text: "اقترب رجل يرتدي عباءة كهنوتية داكنة من رمسيس. لم يكن وجهه واضحاً ليحيى، لكنه عرفه على الفور. إنه \"الحكيم\"، نفس الكيان الذي سيظهر لاحقاً في نيقية.",
        arabicText: "اقترب رجل يرتدي عباءة كهنوتية داكنة من رمسيس. لم يكن وجهه واضحاً ليحيى، لكنه عرفه على الفور. إنه \"الحكيم\"، نفس الكيان الذي سيظهر لاحقاً في نيقية.",
        duration: 2500,
      },
      {
        character: "Narrator",
        text: "سأل رمسيس النيل، وكأنه يكلم نفسه: \"لماذا يجب أن أموت؟ لقد بنيت ما لم يبنه أحد. هزمت الحيثيين. أطعمت شعبي. لماذا أكون مجرد إنسان يفنى؟\"",
        arabicText: "سأل رمسيس النيل، وكأنه يكلم نفسه: \"لماذا يجب أن أموت؟ لقد بنيت ما لم يبنه أحد. هزمت الحيثيين. أطعمت شعبي. لماذا أكون مجرد إنسان يفنى؟\"",
        duration: 2500,
      },
      {
        character: "ramses",
        text: "همس الكاهن الغامض بصوت ناعم كفحيح الأفعى: \"لأنهم يقولون إن فوقك ربًا يا مولاي. طالما أنك تعترف بوجود من هو أعلى منك، فستظل عبداً للموت.\"",
        arabicText: "همس الكاهن الغامض بصوت ناعم كفحيح الأفعى: \"لأنهم يقولون إن فوقك ربًا يا مولاي. طالما أنك تعترف بوجود من هو أعلى منك، فستظل عبداً للموت.\"",
        duration: 3000,
      }
    ],
    choices: [
      {
        id: 'two-mirror-continue',
        text: "Witness the Declaration",
        arabicText: "إعلان الألوهية",
        nextSceneId: 'two-divine-declaration',
      },
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // Scene 5.2: The Declaration of Divinity (recovered from Arabic master plus English candidate)
  'two-divine-declaration': {
    id: 'two-divine-declaration',
    title: "The Declaration of Divinity",
    arabicTitle: "إعلان الألوهية",
    part: 2,
    backgroundVideo: videoBg('egypt_nile_temple'),
    backgroundImage: background('pharaoh_temple'),
    ambientKeys: ["amb.desert_wind", "amb.crowd_murmur"],
    dialogue: [
      {
        character: "Narrator",
        text: "On the walls of Abu Simbel, it is carved:",
        arabicText: "وقف رمسيس أمام معبده الجديد. لم يكتب اسم الإله آمون في المركز، بل كتب اسمه هو.",
        duration: 2500,
      },
      {
        character: "Narrator",
        text: "'I am the God'",
        arabicText: "\"أنا ربكم الأعلى،\" أعلن رمسيس، وصوته يتردد في الوادي.",
        duration: 2500,
      },
      {
        character: "Narrator",
        text: "Pharaoh declares his divinity.",
        arabicText: "سجدت الحشود. لم يسجدوا خوفاً من السوط فقط، بل سجدوا انبهاراً بالقوة المادية.",
        duration: 2000,
      },
      {
        character: "Narrator",
        text: "But on the other side of the Nile, a child is born.",
        arabicText: "\"انظر إلى هذا،\" قال يحيى بمرارة. \"لقد نجحت الخوارزمية. رمسيس قال (أنا خير منهم)، فصدقوه. لقد تحول من ملك إلى إله، وتحولوا هم من بشر إلى أدوات.\"",
        duration: 2500,
      },
      {
        character: "Narrator",
        text: "A child who will prove to history that the true God needs no walls to prove His existence.",
        arabicText: "في تلك اللحظة، التقط أوزيريس صوتاً خفياً يتردد بين المشاهد. صوت إبليس يعلق على الأحداث:\n\"انظروا... انظروا جيداً. هذا ما خُلق من طين. يدّعي الألوهية. ألم أقل أنه لا يستحق؟\"",
        duration: 4000,
      }
    ],
    choices: [
      {
        id: 'two-divine-continue',
        text: "Enter the desert void",
        arabicText: "نشوة النجاة وقلق الفراغ",
        nextSceneId: 'four-4-1-desert',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 1500,
    emotionalTone: 'dark',
  },

  // Scene 6.1: The Void of the Desert (restored canonical Samiri scene)
  'four-4-1-desert': {
    id: 'four-4-1-desert',
    title: "The Void of the Desert",
    arabicTitle: "نشوة النجاة وقلق الفراغ",
    part: 2,
    backgroundVideo: videoBg('sinai_desert'),
    backgroundImage: background('desert'),
    ambientKeys: ["amb.desert_wind", "amb.crowd_murmur"],
    dialogue: [
      {
        character: "Narrator",
        text: "Sinai Desert. The 13th century BC. OSIRIS simulation. Yahya and Laila stood amid a sea of humanity stretching across the desert. The euphoria of escaping Pharaoh and crossing the sea had faded, replaced by something far harsher: the void.",
        arabicText: "صحراء سيناء. القرن الثالث عشر قبل الميلاد. محاكاة أوزيريس. وقف يحيى وليلى وسط المحاكاة، يشاهدان بحر البشر الممتد في الصحراء. كانت نشوة النجاة من فرعون وعبور البحر قد تلاشت، وحل محلها شيء أشد قسوة: الفراغ.",
        duration: 7000,
      },
      {
        character: "laila",
        text: "Moses has been absent for weeks. They had grown accustomed to slavery in Egypt. Slavery is harsh, but it provides certainty: you know when to wake up, what to do, and what to eat. Absolute freedom in this desert... is terrifying.",
        arabicText: "موسى غائب منذ أسابيع. لقد اعتادوا على العبودية في مصر. العبودية قاسية، لكنها توفر اليقين: أنت تعرف متى تستيقظ، ماذا تعمل، وماذا تأكل. الحرية المطلقة في هذه الصحراء... مرعبة.",
        duration: 7000,
      },
      {
        character: "Narrator",
        text: "Yahya pointed to a man standing on a high rock, watching the crowds with eyes that analyzed the situation with mathematical precision. He did not look like an evil sorcerer, but like an engineer studying a problem that needed a solution.",
        arabicText: "أشار يحيى إلى رجل يقف على صخرة مرتفعة، يراقب الحشود بعينين تحللان الموقف بدقة رياضية. لم يكن يبدو كساحر شرير، بل كمهندس يدرس مشكلة تحتاج إلى حل.",
        duration: 6000,
      },
      {
        character: "yahya",
        text: "The Samaritan.",
        arabicText: "السامري.",
        duration: 2000,
      },
      {
        character: "samiri",
        text: "You are afraid. That is natural. The God who brought you out of Egypt is a great God, but He is... invisible. Abstract. You cannot touch Him or see Him. And you need something to reassure you now, in this void.",
        arabicText: "أنتم خائفون. هذا طبيعي. الإله الذي أخرجكم من مصر إله عظيم، لكنه... غير مرئي. مجرد. لا يمكنكم لمسه أو رؤيته. وأنتم تحتاجون إلى شيء يطمئنكم الآن، في هذا الفراغ.",
        duration: 6500,
      },
      {
        character: "Narrator",
        text: "He did not ask them to disbelieve. He did not ask them to worship a devil. He offered them a \"practical solution\" to their spiritual anxiety.",
        arabicText: "لم يطلب منهم الكفر. لم يطلب منهم عبادة شيطان. لقد قدم لهم \"حلاً عملياً\" لقلقهم الروحي.",
        duration: 5000,
      }
    ],
    choices: [
      {
        id: 'four-4-1-continue',
        text: "Watch the engineering of the crowds",
        arabicText: "شاهد هندسة الحشود",
        nextSceneId: 'four-4-2-crowd-engineering',
      },
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // المشهد 4.2: هندسة الحشود
  'four-4-2-crowd-engineering': {
    id: 'four-4-2-crowd-engineering',
    title: 'Engineering the Crowds',
    arabicTitle: 'هندسة الحشود',
    part: 2,
    backgroundVideo: videoBg('molten_gold'),
    backgroundImage: background('pharaoh_temple'),
    ambientKeys: ["amb.metal_melt", "amb.drums_hypnosis"],
    enterSfxKeys: ["sfx.calf_low"],
    dialogue: [
      {
        character: 'samiri',
        text: "راقب يحيى بذهول كيف جمع السامري الذهب. \"إنه لا يصنع إلهاً يا ليلى. إنه يصنع أيقونة. نظاماً مريحاً يعفيهم من مسؤولية التفكير والإيمان التجريدي.\"",
        arabicText: "راقب يحيى بذهول كيف جمع السامري الذهب. \"إنه لا يصنع إلهاً يا ليلى. إنه يصنع أيقونة. نظاماً مريحاً يعفيهم من مسؤولية التفكير والإيمان التجريدي.\"",
        duration: 9600
      },
      {
        character: 'samiri_calf',
        text: "عندما اكتمل العجل الذهبي، لم يكن مجرد تمثال صامت. بفضل هندسة السامري وتيارات الهواء، كان العجل يصدر صوتاً (خواراً) يبدو وكأنه حي.",
        arabicText: "عندما اكتمل العجل الذهبي، لم يكن مجرد تمثال صامت. بفضل هندسة السامري وتيارات الهواء، كان العجل يصدر صوتاً (خواراً) يبدو وكأنه حي.",
        duration: 8800
      },
      {
        character: 'samiri_calf',
        text: "انفجرت الحشود في نشوة هستيرية. بدأوا يرقصون حول العجل. لم يعودوا أفراداً خائفين، بل أصبحوا \"قطيعاً\" موحداً حول رمز مادي.",
        arabicText: "انفجرت الحشود في نشوة هستيرية. بدأوا يرقصون حول العجل. لم يعودوا أفراداً خائفين، بل أصبحوا \"قطيعاً\" موحداً حول رمز مادي.",
        duration: 8000
      },
      {
        character: 'samiri_calf',
        text: "قرأ يحيى تحليل أوزيريس للمشهد: \"العملية: هندسة حشود ناجحة. الأداة: استغلال الفراغ الروحي. النتيجة: التخلي الطوعي عن الحرية مقابل الراحة المادية.\"",
        arabicText: "قرأ يحيى تحليل أوزيريس للمشهد: \"العملية: هندسة حشود ناجحة. الأداة: استغلال الفراغ الروحي. النتيجة: التخلي الطوعي عن الحرية مقابل الراحة المادية.\"",
        duration: 8400
      },
      {
        character: 'samiri',
        text: "\"هذا مرعب،\" قال يحيى، وعيناه تعكسان بريق النار الافتراضية. \"السامري هو أول (مهندس واجهات مستخدم - UI/UX Designer) في التاريخ. لقد صمم واجهة مادية سهلة الاستخدام لإله معقد.\"",
        arabicText: "\"هذا مرعب،\" قال يحيى، وعيناه تعكسان بريق النار الافتراضية. \"السامري هو أول (مهندس واجهات مستخدم - UI/UX Designer) في التاريخ. لقد صمم واجهة مادية سهلة الاستخدام لإله معقد.\"",
        duration: 11200
      }
    ],
    choices: [
      {
        id: 'four-4-2-continue',
        text: 'Hear Tarek\'s message about the digital calf',
        arabicText: 'اسمع رسالة طارق عن العجل الرقمي',
        nextSceneId: 'four-5-1-tarek-message',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 5.1: رسالة من الماضي
  'four-5-1-tarek-message': {
    id: 'four-5-1-tarek-message',
    title: 'A Message from the Past',
    arabicTitle: 'رسالة من الماضي',
    part: 2,
    backgroundImage: background('corporate_lab'),
    audioUrl: audio('yahya_monologue'),
    ambientKeys: ["amb.server_room"],
    dialogue: [
      {
        character: 'tarek_ghost',
        text: "أوقف يحيى المحاكاة. كان يتنفس بصعوبة. أخرج قرصاً صلباً صغيراً من حقيبته، أحد الأقراص التي تركها طارق.",
        arabicText: "أوقف يحيى المحاكاة. كان يتنفس بصعوبة. أخرج قرصاً صلباً صغيراً من حقيبته، أحد الأقراص التي تركها طارق.",
        duration: 6800
      },
      {
        character: 'tarek_ghost',
        text: "\"هناك تسجيل لطارق مرتبط بهذا الجزء من الكود. لم أفهمه من قبل. الآن... أعتقد أنني سأفهم.\"",
        arabicText: "\"هناك تسجيل لطارق مرتبط بهذا الجزء من الكود. لم أفهمه من قبل. الآن... أعتقد أنني سأفهم.\"",
        duration: 6400
      },
      {
        character: 'tarek_ghost',
        text: "شغل التسجيل. ملأ صوت طارق الغرفة:",
        arabicText: "شغل التسجيل. ملأ صوت طارق الغرفة:",
        duration: 2500
      },
      {
        character: 'samiri_calf',
        text: "\"يحيى... إذا كنت تستمع لهذا، فربما تكون قد رأيت محاكاة السامري. هل تعرف ما هو المرعب حقاً؟ السامري كان يحتاج إلى جمع الذهب، وصهر المعادن، وانتظار غياب موسى ليصنع عجله. أما نحن؟ نحن صنعنا عجلاً ذهبياً في جيب كل إنسان على هذا الكوكب.\"",
        arabicText: "\"يحيى... إذا كنت تستمع لهذا، فربما تكون قد رأيت محاكاة السامري. هل تعرف ما هو المرعب حقاً؟ السامري كان يحتاج إلى جمع الذهب، وصهر المعادن، وانتظار غياب موسى ليصنع عجله. أما نحن؟ نحن صنعنا عجلاً ذهبياً في جيب كل إنسان على هذا الكوكب.\"",
        duration: 17200
      },
      {
        character: 'tarek_ghost',
        text: "صمت طارق للحظة في التسجيل، يُسمع صوت تنهيدة عميقة.",
        arabicText: "صمت طارق للحظة في التسجيل، يُسمع صوت تنهيدة عميقة.",
        duration: 3600
      },
      {
        character: 'tarek_ghost',
        text: "\"خوارزميات الإدمان التي كتبناها... الإعجابات، الإشعارات الحمراء، التمرير اللانهائي (Infinite Scroll). كلها تعمل بنفس الآلية السيكولوجية للعجل الذهبي. نحن نستغل الفراغ الروحي للإنسان الحديث، قلقه، وحدته... ونقدم له مكافآت مادية وهمية. قطرات من الدوبامين تبقيه ملتصقاً بالشاشة، يرقص حول العجل الرقمي، متخلياً عن حريته وإرادته طواعية.\"",
        arabicText: "\"خوارزميات الإدمان التي كتبناها... الإعجابات، الإشعارات الحمراء، التمرير اللانهائي (Infinite Scroll). كلها تعمل بنفس الآلية السيكولوجية للعجل الذهبي. نحن نستغل الفراغ الروحي للإنسان الحديث، قلقه، وحدته... ونقدم له مكافآت مادية وهمية. قطرات من الدوبامين تبقيه ملتصقاً بالشاشة، يرقص حول العجل الرقمي، متخلياً عن حريته وإرادته طواعية.\"",
        duration: 18400
      },
      {
        character: 'laila',
        text: "نظرت ليلى إلى هاتفها الموضوع على الطاولة، ثم إلى يحيى.",
        arabicText: "نظرت ليلى إلى هاتفها الموضوع على الطاولة، ثم إلى يحيى.",
        duration: 4000
      },
      {
        character: 'tarek_ghost',
        text: "أكمل طارق: \"الفرق الوحيد يا أخي... أن العجل القديم كان يخور بصوت الريح. عجلنا نحن يخور بإشعارات الغضب والكراهية، لأننا اكتشفنا أن الغضب يُبقي الناس متصلين لفترة أطول من الفرح. نحن نبرمج البشر ليكرهوا بعضهم.\"",
        arabicText: "أكمل طارق: \"الفرق الوحيد يا أخي... أن العجل القديم كان يخور بصوت الريح. عجلنا نحن يخور بإشعارات الغضب والكراهية، لأننا اكتشفنا أن الغضب يُبقي الناس متصلين لفترة أطول من الفرح. نحن نبرمج البشر ليكرهوا بعضهم.\"",
        duration: 14000
      }
    ],
    choices: [
      {
        id: 'four-5-1-continue',
        text: 'Continue — the tears of the analyst',
        arabicText: 'تابع — دموع المحلل',
        nextSceneId: 'four-5-2-analyst-tears',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 5.2: دموع المحلل
  'four-5-2-analyst-tears': {
    id: 'four-5-2-analyst-tears',
    title: 'The Tears of the Analyst',
    arabicTitle: 'دموع المحلل',
    part: 2,
    backgroundImage: background('white_space'),
    ambientKeys: ["amb.server_room"],
    dialogue: [
      {
        character: 'yahya_breakdown',
        text: "انتهى التسجيل. ساد صمت ثقيل في الغرفة، لم يقطعه سوى طنين خوادم أوزيريس.",
        arabicText: "انتهى التسجيل. ساد صمت ثقيل في الغرفة، لم يقطعه سوى طنين خوادم أوزيريس.",
        duration: 5200
      },
      {
        character: 'yahya_breakdown',
        text: "لأول مرة منذ سنوات، منذ أن قرر أن الأرقام هي الحقيقة الوحيدة، انهار يحيى. غطى وجهه بيديه وبدأ يبكي. لم يكن بكاءً صاخباً، بل نشيجاً مكتوماً لرجل أدرك أن كل ما بناه في حياته المهنية كان جزءاً من آلة دمار.",
        arabicText: "لأول مرة منذ سنوات، منذ أن قرر أن الأرقام هي الحقيقة الوحيدة، انهار يحيى. غطى وجهه بيديه وبدأ يبكي. لم يكن بكاءً صاخباً، بل نشيجاً مكتوماً لرجل أدرك أن كل ما بناه في حياته المهنية كان جزءاً من آلة دمار.",
        duration: 16000
      },
      {
        character: 'tarek',
        text: "\"طارق كان موسى عصره،\" قال يحيى بصوت متقطع. \"حاول تحطيم العجل الرقمي... فقتلوه.\"",
        arabicText: "\"طارق كان موسى عصره،\" قال يحيى بصوت متقطع. \"حاول تحطيم العجل الرقمي... فقتلوه.\"",
        duration: 5200
      },
      {
        character: 'laila',
        text: "اقتربت ليلى ووضعت يدها على كتفه بحذر. لم تقدم له مواساة رخيصة.",
        arabicText: "اقتربت ليلى ووضعت يدها على كتفه بحذر. لم تقدم له مواساة رخيصة.",
        duration: 4800
      },
      {
        character: 'first_engineer',
        text: "\"يحيى، البكاء لن يعيد طارق. ولن يوقف المهندس الأول. أنت تملك أوزيريس الآن. تملك الشيفرة المصدرية.\"",
        arabicText: "\"يحيى، البكاء لن يعيد طارق. ولن يوقف المهندس الأول. أنت تملك أوزيريس الآن. تملك الشيفرة المصدرية.\"",
        duration: 6400
      },
      {
        character: 'yahya_breakdown',
        text: "رفع يحيى رأسه، وعيناه حمراوان لكنهما تحملان تصميماً جديداً. \"سأدمرهم. سأستخدم أوزيريس لاختراق خوادمهم وفضح كل شيء.\"",
        arabicText: "رفع يحيى رأسه، وعيناه حمراوان لكنهما تحملان تصميماً جديداً. \"سأدمرهم. سأستخدم أوزيريس لاختراق خوادمهم وفضح كل شيء.\"",
        duration: 6800
      },
      {
        character: 'laila',
        text: "هزت ليلى رأسها نفياً. \"الهجوم المباشر لن ينجح. أنت تتعامل مع كيان يمتلك بيانات العالم بأسره. يجب أن نفهم الخصم أولاً. يجب أن نرى كيف يخترقون المؤسسات الكبرى من الداخل. كيف يحولون الحق إلى باطل باسم المقدس.\"",
        arabicText: "هزت ليلى رأسها نفياً. \"الهجوم المباشر لن ينجح. أنت تتعامل مع كيان يمتلك بيانات العالم بأسره. يجب أن نفهم الخصم أولاً. يجب أن نرى كيف يخترقون المؤسسات الكبرى من الداخل. كيف يحولون الحق إلى باطل باسم المقدس.\"",
        duration: 14800
      },
      {
        character: 'yahya_breakdown',
        text: "\"إلى أين نذهب إذن؟\" سأل يحيى.",
        arabicText: "\"إلى أين نذهب إذن؟\" سأل يحيى.",
        duration: 2500
      },
      {
        character: 'laila',
        text: "أشارت ليلى إلى الشاشة. \"إلى اللحظة التي سُرق فيها الدين. إلى نيقية.\"",
        arabicText: "أشارت ليلى إلى الشاشة. \"إلى اللحظة التي سُرق فيها الدين. إلى نيقية.\"",
        duration: 4800
      }
    ],
    choices: [
      {
        id: 'four-5-2-nicaea',
        text: 'Search for "the sacred corruption" — Nicaea 325 AD',
        arabicText: 'ابحث عن "الفساد المقدس" — نيقية 325م',
        nextSceneId: 'five-6a-1-nicaea-debate',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },
};
