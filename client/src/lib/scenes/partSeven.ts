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
    title: "The Unarmed Truth",
    arabicTitle: "كربلاء (مضاد الفيروسات)",
    part: 5,
    backgroundVideo: videoBg('karbala'),
    backgroundImage: background('desert'),
    ambientKeys: ["amb.desert_wind", "amb.distant_battle"],
    dialogue: [
      {
        character: "Narrator",
        text: "Karbala Desert. 680 AD. OSIRIS simulation. Yahya launched OSIRIS for the last time. This was not an academic exercise. This was the key to understanding how to break the algorithm.",
        arabicText: "صحراء كربلاء. 680م. محاكاة أوزيريس. شغّل يحيى أوزيريس للمرة الأخيرة. لم تكن هذه تمريناً أكاديمياً. كانت مفتاح فهم كيفية كسر الخوارزمية.",
        duration: 6000
      },
      {
        character: "Narrator",
        text: "They found themselves in the Karbala desert. The heat was suffocating even in the simulation. On one side, thousands of armed soldiers. On the other, a very small group of men, women, and children.",
        arabicText: "وجدا نفسيهما في صحراء كربلاء. الحرارة كانت خانقة حتى في المحاكاة. من جهة، جيش يزيد بالآلاف المدججين بالسلاح. من جهة أخرى، مجموعة صغيرة جداً من الرجال والنساء والأطفال.",
        duration: 7000
      },
      {
        character: "Laila",
        text: "Yazid's army represents \"the herd\" that has surrendered to the algorithm. They chose material survival and worldly gains over principle.",
        arabicText: "جيش يزيد يمثلون \"القطيع\" المستسلم للخوارزمية. اختاروا النجاة المادية والمكاسب الدنيوية على حساب المبدأ.",
        duration: 6000
      },
      {
        character: "Yahya",
        text: "OSIRIS analysis: military probability of survival: 0%. Inevitable outcome: death. Why did he not surrender? He could have prevented bloodshed. He could have waited for a better opportunity.",
        arabicText: "تحليلات أوزيريس: الاحتمالات العسكرية للنجاة: 0%. النتيجة الحتمية: الموت. لماذا لم يستسلم؟ كان يمكنه منع سفك الدماء. كان يمكنه الانتظار لفرصة أفضل.",
        duration: 6500
      },
      {
        character: "Laila",
        text: "Because surrendering to Yazid means giving \"legitimacy\" to injustice. Al-Hussein was not fighting to win militarily. He knew he would die. But he was fighting to record a stance that breaks \"false legitimacy.\" His sacrifice is what kept the truth alive.",
        arabicText: "لأن الاستسلام ليزيد يعني إعطاء \"الشرعية\" للظلم. الحسين لم يكن يقاتل لينتصر عسكرياً. كان يعرف أنه سيموت. لكنه كان يقاتل ليُسجل موقفاً يكسر \"الشرعية المزيفة\". تضحيته هي التي أبقت الحقيقة حية.",
        duration: 8000
      },
      {
        character: "Narrator",
        text: "Yahya watched Al-Hussein advancing alone. There was no fear in his eyes, only absolute certainty.",
        arabicText: "راقب يحيى الحسين وهو يتقدم وحيداً. لم يكن هناك خوف في عينيه، بل يقين مطلق.",
        duration: 5000
      },
      {
        character: "Yahya",
        text: "This is the antivirus. The algorithm depends on the ego, on the desire for survival and control. Unconditional sacrifice... choosing pain and death for the sake of principle... this is an act the algorithm cannot predict or understand. It breaks the code.",
        arabicText: "هذا هو مضاد الفيروسات. الخوارزمية تعتمد على \"الأنا\"، على الرغبة في البقاء والسيطرة. التضحية غير المشروطة... اختيار الألم والموت من أجل المبدأ... هذا فعل لا يمكن للخوارزمية أن تتوقعه أو تفهمه. إنه يكسر الكود.",
        duration: 9000
      }
    ],
    choices: [
      {
        id: "seven-10-1-continue",
        text: "The Digital Confrontation",
        arabicText: "المواجهة الرقمية",
        nextSceneId: "seven-11-1-temptation"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'intense',
  },

  // المشهد 11.1: إغراء المهندس
  'seven-11-1-temptation': {
    id: 'seven-11-1-temptation',
    title: "The Temptation of the Engineer",
    arabicTitle: "إغراء المهندس الأول",
    part: 5,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.electronic_hum"],
    dialogue: [
      {
        character: "Narrator",
        text: "Suddenly, the simulation froze. Karbala disappeared, and Yahya found himself alone in a white space.",
        arabicText: "فجأة، تجمدت المحاكاة. اختفت كربلاء، ووجد يحيى نفسه وحيداً في فضاء أبيض.",
        duration: 4500
      },
      {
        character: "Narrator",
        text: "Before him appeared an elegant, calm-featured man. The First Engineer.",
        arabicText: "أمامه، ظهر رجل أنيق، هادئ الملامح. المهندس الأول.",
        duration: 3500
      },
      {
        character: "First Engineer",
        text: "Welcome, Yahya. You have come further than I expected. Your brother was clever, but you are cleverer.",
        arabicText: "مرحباً يا يحيى. لقد وصلت أبعد مما توقعت. أخوك كان ذكياً، لكنك أذكى.",
        duration: 4500
      },
      {
        character: "Yahya",
        text: "You killed Tarek.",
        arabicText: "أنت من قتل طارق.",
        duration: 2500
      },
      {
        character: "First Engineer",
        text: "I did not kill him. He chose death because he could not bear the truth. The truth is that humans are unfit for freedom, Yahya. Look at the history you saw. Nicaea, Andalusia, the Holocaust. When you leave humans free, they kill each other in the name of a god, a race, or an ideology.",
        arabicText: "أنا لم أقتله. هو اختار الموت لأنه لم يستطع تحمل الحقيقة. الحقيقة هي أن البشر غير مؤهلين للحرية يا يحيى. انظر إلى التاريخ الذي رأيته. نيقية، الأندلس، الهولوكوست. عندما تترك البشر أحراراً، يقتلون بعضهم البعض باسم إله أو عرق أو أيديولوجيا.",
        duration: 9000
      },
      {
        character: "First Engineer",
        text: "I do not create hatred. I only manage it. The final update I will release tonight will eliminate this chaos. I will link human minds to one frequency. No more wars. No pain. Permanent peace.",
        arabicText: "أنا لا أصنع الكراهية. أنا فقط أديرها. التحديث النهائي الذي سأطلقه الليلة سيلغي هذه الفوضى. سأربط العقول البشرية بتردد واحد. لا حروب بعد اليوم. لا ألم. سلام دائم.",
        duration: 7000
      },
      {
        character: "Yahya",
        text: "The peace of slaves.",
        arabicText: "سلام العبيد.",
        duration: 2500
      },
      {
        character: "First Engineer",
        text: "Free will is an illusion! You are governed by your genes, your hormones, your environment. I offer reasonable management of these constraints. Join me, Yahya. I can restore Tarek's consciousness in the simulation. I can protect Laila. Be my partner in saving the world.",
        arabicText: "الإرادة الحرة وهم! أنت محكوم بجيناتك، بهرموناتك، ببيئتك. أنا أقدم إدارة معقولة لهذه القيود. انضم إليّ يا يحيى. يمكنني إعادة وعي طارق في المحاكاة. يمكنني حماية ليلى. كن شريكي في إنقاذ العالم.",
        duration: 9000
      }
    ],
    choices: [
      {
        id: "seven-11-1-join",
        text: "Join the First Engineer — save Tarek and Laila",
        arabicText: "انضم للمهندس الأول — أنقذ طارق وليلى",
        nextSceneId: "seven-11-2-decision"
      },
      {
        id: "seven-11-1-refuse",
        text: "Refuse — freedom that bleeds is better than painless slavery",
        arabicText: "ارفض — الحرية التي تنزف أفضل من عبودية لا تشعر بالألم",
        nextSceneId: "seven-11-2-decision"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 11.2: قرار يحيى
  'seven-11-2-decision': {
    id: 'seven-11-2-decision',
    title: "Yahya's Decision",
    arabicTitle: "قرار يحيى",
    part: 5,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.electronic_hum"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya looked at the First Engineer. The offer was tempting. Saving those he loved, and world peace, even if it were fake.",
        arabicText: "نظر يحيى إلى المهندس. العرض كان مغرياً. إنقاذ من يحب، وسلام عالمي، حتى لو كان مزيفاً.",
        duration: 5500
      },
      {
        character: "Narrator",
        text: "Yahya remembered Tarek's words in the dream: \"The algorithm cannot calculate sacrifice.\"",
        arabicText: "تذكر يحيى كلمات طارق في الحلم: \"الخوارزمية لا تستطيع حساب التضحية.\"",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "And he remembered Al-Hussein's stance in Karbala.",
        arabicText: "وتذكر وقفة الحسين في كربلاء.",
        duration: 3000
      },
      {
        character: "Yahya",
        text: "You are right about one thing. We are constrained by many things. But there is a difference between constraints we understand and try to overcome, and a prison you build in our minds without our knowledge.",
        arabicText: "أنت محق في شيء واحد. نحن مقيدون بأشياء كثيرة. لكن هناك فرق بين قيود نفهمها ونحاول التغلب عليها، وبين سجن تبنيه أنت في عقولنا دون علمنا.",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "Yahya raised his virtual hand. In reality, his real hand was typing the last lines of code on his computer.",
        arabicText: "رفع يحيى يده الافتراضية. في الواقع، كانت يده الحقيقية تكتب أسطر الكود الأخيرة على حاسوبه.",
        duration: 5000
      },
      {
        character: "Yahya",
        text: "I reject your false paradise. Freedom that bleeds is better than slavery that feels no pain.",
        arabicText: "أنا أرفض جنتك المزيفة. الحرية التي تنزف أفضل من عبودية لا تشعر بالألم.",
        duration: 5000
      },
      {
        character: "First Engineer",
        text: "If you do this, you will die. The system will burn your nervous system through the connection.",
        arabicText: "إذا فعلت هذا، ستموت. النظام سيحرق جهازك العصبي من خلال الاتصال.",
        duration: 4500
      },
      {
        character: "Yahya",
        text: "I know. But I am not here to survive. I am here to be a witness.",
        arabicText: "أعرف. لكنني لست هنا لأنجو. أنا هنا لأكون شاهداً.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "Yahya pressed Enter.",
        arabicText: "ضغط يحيى على زر Enter.",
        duration: 2500
      }
    ],
    choices: [
      {
        id: "seven-11-2-continue",
        text: "The Final Chapter",
        arabicText: "الفصل الأخير",
        nextSceneId: "seven-12-1-truth-leak"
      }
    ],
    transitionType: 'glitch',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // المشهد 12.1: حجر رشيد الرقمي — تسريب الحقيقة
  'seven-12-1-truth-leak': {
    id: 'seven-12-1-truth-leak',
    title: "The Rosetta Stone of the Digital Age",
    arabicTitle: "تسريب الحقيقة",
    part: 6,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "glitch",
    ambientKeys: ["amb.notification_swarm"],
    enterSfxKeys: ["sfx.electric_shock"],
    dialogue: [
      {
        character: "Narrator",
        text: "The moment Yahya pressed the button, OSIRIS began broadcasting the \"source code\" of the virus — the Digital Rosetta Stone — to every server, every phone, and every screen in the world.",
        arabicText: "بمجرد أن ضغط يحيى على الزر، بدأ أوزيريس في تفريغ \"الشيفرة المصدرية\" للفيروس (حجر رشيد الرقمي) إلى كل خادم، كل هاتف، وكل شاشة في العالم.",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "But the price was immediate. Yahya screamed in pain. The reverse current from the First Engineer's servers struck his nervous system through the connection interface.",
        arabicText: "لكن الثمن كان فورياً. صرخ يحيى من الألم. التيار العكسي من خوادم المهندس الأول ضرب جهازه العصبي عبر واجهة الاتصال.",
        duration: 6000
      },
      {
        character: "Narrator",
        text: "Yahya fell from his chair, writhing on the ground.",
        arabicText: "سقط يحيى من كرسيه، يتلوى على الأرض.",
        duration: 3500
      },
      {
        character: "Laila",
        text: "Yahya! Stop! You will die!",
        arabicText: "يحيى! توقف! ستموت!",
        duration: 2500
      },
      {
        character: "Yahya",
        text: "Do not disconnect it... let the code... reach.",
        arabicText: "لا تفصليه... دعي الكود... يصل.",
        duration: 3500
      },
      {
        character: "Narrator",
        text: "In his final moments, Yahya no longer felt physical pain. He heard a familiar voice — not from the simulation, but from the depths of his soul. Tarek's voice: \"You finally understood, Yahya. You were never an atheist... you were only searching for the truth.\"",
        arabicText: "في لحظاته الأخيرة، لم يعد يحيى يشعر بالألم المادي. سمع صوتاً مألوفاً، ليس من المحاكاة، بل في أعماق روحه. صوت طارق: \"لقد فهمت أخيراً يا يحيى. أنت لم تكن ملحداً أبداً... كنت تبحث عن الحقيقة فقط.\"",
        duration: 8000
      },
      {
        character: "Yahya",
        text: "Be... the witness.",
        arabicText: "كوني... الشاهدة.",
        duration: 3000
      },
      {
        character: "Narrator",
        text: "Yahya closed his eyes, and his breathing stopped. He died with a smile of contentment that never left his face.",
        arabicText: "أغمض يحيى عينيه، وتوقف تنفسه. مات بابتسامة رضا لم تفارق وجهه.",
        duration: 5500
      },
      {
        character: "Narrator",
        text: "In that moment, the phones of billions of humans around the world lit up with a single message, revealing to them how their minds had been manipulated, and exposing the algorithm of arrogance.",
        arabicText: "في تلك اللحظة، أضاءت هواتف مليارات البشر حول العالم برسالة واحدة، تكشف لهم كيف تم التلاعب بعقولهم، وتفضح خوارزمية الكبر.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "seven-12-1-continue",
        text: "The Awakening",
        arabicText: "الاستيقاظ",
        nextSceneId: "seven-13-1-awakening"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 3000,
    emotionalTone: 'tragic',
  },

  // Scene 21.1: Defense witness montage / The Witnesses Rise
  'seven-witnesses-intro': {
    id: 'seven-witnesses-intro',
    title: "The Witnesses Rise",
    arabicTitle: "استعراض سريع لشهود الدفاع",
    part: 6,
    backgroundVideo: videoBg('cosmic_opening'),
    backgroundImage: background('osiris_cosmic'),
    visualEffect: "montage",
    ambientKeys: ["amb.vacuum", "amb.low_hum"],
    dialogue: [
      {
        character: "Narrator",
        text: "But Iblis was wrong about one thing. Humanity did not fall completely. Some stood. Some refused. And their names are written in eternity.",
        arabicText: "بينما كانت ليلى تقوم برفع البيانات، عرض أوزيريس على شاشتها مشاهد سريعة، كأنها رسالة وداع من يحيى وطارق.",
        duration: 4000
      },
      {
        character: "Abraham",
        text: "I have turned my face to the One who created the heavens and the earth.",
        arabicText: "هؤلاء هم شهود الدفاع. هؤلاء من يثبتون أن الإنسان، رغم ضعفه، قادر على الارتقاء فوق طينه.",
        duration: 3000
      },
      {
        character: "Narrator",
        text: "Abraham stood alone. No army. No power. No influence. And that was enough.",
        arabicText: "إبراهيم عليه السلام يقف وحيداً أمام نار النمرود، لا يملك جيشاً، فقط يقين مطلق: إنني وجهت وجهي للذي فطر السماوات والأرض.",
        duration: 3500
      },
      {
        character: "Bilal",
        text: "One... One...",
        arabicText: "بلال بن رباح تحت شمس مكة الحارقة، الصخرة على صدره، والكبر المادي يسحقه، لكن روحه ترفرف حرة: أحد... أحد.",
        duration: 2000
      },
      {
        character: "Narrator",
        text: "Bilal was enslaved. Tortured. Broken. Under the sun, with a stone on his chest. Pride could crush his body. But it could never crush his soul.",
        arabicText: "صلاح الدين الأيوبي يدخل القدس عام 1187م، يرفض الانتقام، لا يقتل مدنياً واحداً، يعفو عن أعدائه، كاسراً دائرة الدم التي بدأها الصليبيون.",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "Saladin conquered Jerusalem. He could have slaughtered them all. But he chose mercy. And history remembers him as the noble one.",
        arabicText: "علماء بيت الحكمة في بغداد يترجمون علوم الإغريق والهنود، يضيفون إليها، ويحفظون نور المعرفة للبشرية.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "In the House of Wisdom, scholars translated Greek knowledge. They added to it. They preserved it for humanity.",
        arabicText: "علماء بيت الحكمة ترجموا المعرفة اليونانية، وأضافوا إليها، وحفظوها للإنسانية.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "They did not claim to be gods. They did not claim to be superior. They simply served knowledge. And knowledge served humanity.",
        arabicText: "لم يدّعوا الألوهية أو التفوق، بل خدموا المعرفة فخدمت المعرفة الإنسانية.",
        duration: 4500
      }
    ],
    choices: [
      {
        id: "seven-witnesses-to-awakening",
        text: "Witness the awakening",
        arabicText: "شاهد الاستيقاظ",
        nextSceneId: "seven-13-1-awakening"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'hopeful',
  },
  // المشهد 13.1: الاستيقاظ
  'seven-13-1-awakening': {
    id: 'seven-13-1-awakening',
    title: "The Awakening",
    arabicTitle: "الاستيقاظ",
    part: 6,
    backgroundImage: background('yahya_apartment'),
    ambientKeys: ["amb.city_day"],
    dialogue: [
      {
        character: "Narrator",
        text: "Laila stood in the street, looking at the people around her.",
        arabicText: "وقفت ليلى في الشارع، تنظر إلى الناس من حولها.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "There was no \"clean victory.\" The world did not suddenly turn into paradise.",
        arabicText: "لم يكن هناك \"نصر نظيف\". لم يتحول العالم إلى جنة فجأة.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "She saw a man reading the message on his phone, then throwing it in the trash in anger.",
        arabicText: "رأت رجلاً يقرأ الرسالة على هاتفه، ثم يلقي بالهاتف في سلة المهملات بغضب.",
        duration: 4500
      },
      {
        character: "Narrator",
        text: "She saw a young girl looking at the screen, crying, then hugging a friend she had been estranged from for years because of a political disagreement.",
        arabicText: "رأت فتاة شابة تنظر إلى الشاشة، تبكي، ثم تعانق صديقتها التي كانت تقاطعها منذ سنوات بسبب خلاف سياسي.",
        duration: 6000
      },
      {
        character: "Narrator",
        text: "And she saw others reading the message, shrugging with indifference, and returning to scrolling through their screens.",
        arabicText: "ورأت آخرين يقرؤون الرسالة، يهزون أكتافهم بلامبالاة، ويعودون للتمرير في شاشاتهم.",
        duration: 5000
      },
      {
        character: "Old Woman",
        text: "Now I only understand what was happening.",
        arabicText: "الآن فقط أفهم ما كان يحدث.",
        duration: 3500
      },
      {
        character: "Child",
        text: "Mama, is there artificial intelligence in my head?",
        arabicText: "أمي، هل هناك ذكاء اصطناعي في رأسي؟",
        duration: 3500
      },
      {
        character: "Narrator",
        text: "Laila smiled with sadness. Yahya had not saved the world by forcing it to be righteous. Yahya had restored to the world its \"freedom\" of choice. He revealed the prison to them, and left them the decision to leave it.",
        arabicText: "ابتسمت ليلى بحزن. يحيى لم ينقذ العالم بإجباره على الصلاح. يحيى أعاد للعالم \"حريته\" في الاختيار. كشف لهم السجن، وترك لهم قرار الخروج منه.",
        duration: 8000
      }
    ],
    choices: [
      {
        id: "seven-13-1-continue",
        text: "Closing the File",
        arabicText: "إغلاق الملف",
        nextSceneId: "seven-13-2-closing"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'contemplative',
  },

  // المشهد 13.2: إغلاق الملف
  'seven-13-2-closing': {
    id: 'seven-13-2-closing',
    title: "Closing the File",
    arabicTitle: "إغلاق الملف مؤقتاً",
    part: 6,
    backgroundImage: background('osiris_cosmic'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.vacuum"],
    dialogue: [
      {
        character: "Narrator",
        text: "The screen returned to the black void. The words appeared one by one, synchronized with the cosmic voice:",
        arabicText: "عادت الشاشة إلى الفراغ الأسود. ظهرت الكلمات تباعاً، متزامنة مع الصوت الكوني:",
        duration: 5000
      },
      {
        character: "OSIRIS",
        text: "The defense presented its witnesses.",
        arabicText: "الدفاع قدم شهوده.",
        duration: 3000
      },
      {
        character: "OSIRIS",
        text: "From Ibrahim who stood alone against an entire civilization, to Al-Hussein who chose death over humiliation.",
        arabicText: "من إبراهيم الذي وقف وحيداً ضد حضارة بأكملها، إلى الحسين الذي اختار الموت على المذلة.",
        duration: 5500
      },
      {
        character: "OSIRIS",
        text: "And from Tarek who refused silence, to Yahya who broke the algorithm with his blood.",
        arabicText: "ومن طارق الذي رفض الصمت، إلى يحيى الذي كسر الخوارزمية بدمه.",
        duration: 5000
      },
      {
        character: "OSIRIS",
        text: "And Laila... who carries the truth now.",
        arabicText: "وليلى... التي تحمل الحقيقة الآن.",
        duration: 3500
      },
      {
        character: "OSIRIS",
        text: "Free will bleeds, but it does not die.",
        arabicText: "الإرادة الحرة تنزف، لكنها لا تموت.",
        duration: 4000
      },
      {
        character: "OSIRIS",
        text: "The algorithm was not completely defeated, but it was exposed.",
        arabicText: "الخوارزمية لم تُهزم تماماً، لكنها فُضحت.",
        duration: 4000
      },
      {
        character: "OSIRIS",
        text: "File Number One... is temporarily closed.",
        arabicText: "الملف رقم واحد... يُغلق مؤقتاً.",
        duration: 4500
      },
      {
        character: "Narrator",
        text: "The words faded, and another sentence appeared in the center of the screen, directed at the reader directly:",
        arabicText: "تلاشت الكلمات، وظهرت جملة أخيرة في منتصف الشاشة، موجهة للقارئ مباشرة:",
        duration: 4500
      },
      {
        character: "OSIRIS",
        text: "The case continues... and the choice is now yours.",
        arabicText: "القضية مستمرة... والخيار الآن لك.",
        duration: 5000
      }
    ],
    transitionType: 'fade',
    transitionDuration: 5000,
    emotionalTone: 'hopeful',
  },
};
