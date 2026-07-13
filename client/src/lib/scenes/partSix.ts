import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_SIX: Record<string, Scene> = {
  // المشهد 8.1: الأندلس الضائعة — خيانة الإخوة
  'six-8-1-andalusia': {
    id: 'six-8-1-andalusia',
    title: "The Lost Andalusia — Betrayal of Brothers",
    arabicTitle: "ملوك الطوائف (أنا خير من أخي)",
    part: 4,
    backgroundVideo: videoBg('andalus'),
    backgroundImage: background('granada_fall'),
    ambientKeys: ["amb.city_night", "amb.distant_whispers"],
    dialogue: [
      {
        character: "Narrator",
        text: "OSIRIS transferred Yahya and Laila to the peak of Andalusian civilization. The lit streets of Córdoba, the vast libraries, and universities that preceded Europe by centuries.",
        arabicText: "نقل أوزيريس يحيى وليلى إلى ذروة الحضارة الأندلسية. شوارع قرطبة المضاءة، المكتبات الضخمة، والجامعات التي سبقت أوروبا بقرون.",
        duration: 6000
      },
      {
        character: "Laila",
        text: "Look at this beauty. How could a civilization of this refinement fall?",
        arabicText: "انظر إلى هذا الجمال. كيف يمكن لحضارة بهذا الرقي أن تسقط؟",
        duration: 4000
      },
      {
        character: "Yahya",
        text: "The algorithm does not care about beauty. The algorithm searches for the weak point. And here, the weak point was \"the ego.\"",
        arabicText: "الخوارزمية لا تهتم بالجمال. الخوارزمية تبحث عن نقطة الضعف. وهنا، نقطة الضعف كانت \"الأنا\".",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "OSIRIS displayed a rapid series of scenes: the Prince of Seville allying with the King of Castile against the Prince of Badajoz. The Prince of Toledo paying tribute to the enemy to protect his throne from his own brother.",
        arabicText: "عرض أوزيريس سلسلة من المشاهد السريعة: أمير إشبيلية يتحالف مع ملك قشتالة ضد أمير بطليوس. أمير طليطلة يدفع الجزية للعدو ليحمي عرشه من أخيه.",
        duration: 6500
      },
      {
        character: "Yahya",
        text: "Every single one of them says: \"I am better than my brother.\" Personal arrogance became more important than the survival of the nation. The virus here did not need to destroy them from outside. It made them destroy themselves from within.",
        arabicText: "كل واحد منهم يقول: \"أنا خير من أخي\". الكبر الشخصي أصبح أهم من بقاء الأمة. الفيروس هنا لم يحتج إلى تدميرهم من الخارج. لقد جعلهم يدمرون أنفسهم من الداخل.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "six-8-1-continue",
        text: "The last tears — 1492",
        arabicText: "الدموع الأخيرة — 1492",
        nextSceneId: "six-8-2-last-tears"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },

  // المشهد 8.2: دموع لا تنفع
  'six-8-2-last-tears': {
    id: 'six-8-2-last-tears',
    title: "Tears That Do Not Help",
    arabicTitle: "زفرة العربي الأخيرة",
    part: 4,
    backgroundVideo: videoBg('granada_fall'),
    backgroundImage: background('granada_fall'),
    ambientKeys: ["amb.wind_soft"],
    dialogue: [
      {
        character: "Narrator",
        text: "Time froze in the simulation at the year 1492. Yahya and Laila saw a man riding his horse, leaving the city of Granada for the last time. The man — Abu Abdullah the Small — turned and looked at the Alhambra Palace receding behind him.",
        arabicText: "توقف الزمن في المحاكاة عند عام 1492. رأى يحيى وليلى رجلاً يركب حصانه، يغادر مدينة غرناطة للمرة الأخيرة. استدار الرجل — أبو عبد الله الصغير — ونظر إلى قصر الحمراء الذي يبتعد.",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "He could not hold himself back, and began to weep.",
        arabicText: "لم يتمالك نفسه، وبدأ يبكي.",
        duration: 3000
      },
      {
        character: "Aisha al-Hurra",
        text: "Weep like women for a kingdom you could not defend like men.",
        arabicText: "ابكِ كالنساء ملكاً لم تحافظ عليه كالرجال.",
        duration: 4000
      },
      {
        character: "Laila",
        text: "This is the final result of the algorithm of arrogance. When you believe you are the most important, you lose everything.",
        arabicText: "هذه هي النتيجة النهائية لخوارزمية الكبر. عندما تعتقد أنك الأهم، تفقد كل شيء.",
        duration: 5000
      },
      {
        character: "OSIRIS",
        text: "You cannot fix a system infected with the virus of \"I am better than them\" by using the same virus.",
        arabicText: "لا يمكنك إصلاح نظام مصاب بفيروس \"أنا خير منهم\" باستخدام نفس الفيروس.",
        duration: 5000
      }
    ],
    choices: [
      {
        id: "six-8-2-continue",
        text: "The 20th century — the illusion of the supreme race",
        arabicText: "القرن العشرون — وهم العرق الأسمى",
        nextSceneId: "six-8b-1-berlin"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 8b.1: وهم العرق الأسمى (برلين 1933)
  'six-8b-1-berlin': {
    id: 'six-8b-1-berlin',
    title: "The Illusion of the Supreme Race",
    arabicTitle: "هتلر أمام المرآة",
    part: 4,
    backgroundVideo: videoBg('berlin_1933'),
    backgroundImage: background('berlin_1933'),
    ambientKeys: ["amb.city_cold", "amb.march_drums_distant"],
    dialogue: [
      {
        character: "Narrator",
        text: "The simulation accelerated. OSIRIS leaped centuries forward. Berlin, 1933.",
        arabicText: "تسارعت المحاكاة. قفز أوزيريس قروناً إلى الأمام. برلين، 1933.",
        duration: 4000
      },
      {
        character: "Yahya",
        text: "The virus evolves, Laila. It has completely abandoned the religious cover. It no longer needs a god to justify arrogance. Man himself has become the god.",
        arabicText: "الفيروس يتطور يا ليلى. لقد تخلى عن الغطاء الديني تماماً. لم يعد يحتاج إلى إله ليبرر الكبر. أصبح الإنسان نفسه هو الإله.",
        duration: 6000
      },
      {
        character: "Narrator",
        text: "They found themselves in a closed room in Berlin. A man with a distinctive mustache stands before a mirror, practicing his facial expressions and hand movements.",
        arabicText: "وجدا نفسيهما في غرفة مغلقة في برلين. رجل بشارب مميز يقف أمام المرآة، يتدرب على تعابير وجهه، وحركات يديه.",
        duration: 5500
      },
      {
        character: "Laila",
        text: "Hitler.",
        arabicText: "هتلر.",
        duration: 2000
      },
      {
        character: "Yahya",
        text: "He does not represent random evil. He represents \"institutional arrogance.\" He deeply believes he is chosen, that he is above all moral rules, because he is making the history of \"the supreme race.\" The algorithm here has reached its peak: \"We are better than them, therefore they must be exterminated.\"",
        arabicText: "إنه لا يمثل الشر العشوائي. إنه يمثل \"الكبر المؤسسي\". هو يعتقد بعمق أنه مختار، أنه فوق كل القواعد الأخلاقية، لأنه يصنع تاريخ \"العرق الأسمى\". الخوارزمية هنا وصلت إلى ذروتها: \"نحن خير منهم، لذلك يجب إبادتهم\".",
        duration: 8000
      }
    ],
    choices: [
      {
        id: "six-8b-1-continue",
        text: "Moscow 1937 and Cambodia 1975",
        arabicText: "موسكو 1937 وكمبوديا 1975",
        nextSceneId: "six-8c-1-death-signatures"
      }
    ],
    transitionType: 'slideLeft',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // المشهد 8c.1: التوقيع على الموت (ستالين/بول بوت)
  'six-8c-1-death-signatures': {
    id: 'six-8c-1-death-signatures',
    title: "Signing Death Orders",
    arabicTitle: "بيروقراطية القتل",
    part: 4,
    backgroundImage: background('moscow_1937'),
    visualEffect: "montage",
    ambientKeys: ["amb.typewriter", "amb.march_drums_distant"],
    dialogue: [
      {
        character: "Narrator",
        text: "The screen split in two. In the first half, an office in the Kremlin. Joseph Stalin sits calmly, smoking his pipe, signing long lists of names.",
        arabicText: "انقسمت الشاشة إلى نصفين. في النصف الأول، مكتب في الكرملين. جوزيف ستالين يجلس بهدوء، يدخن غليونه، ويوقع على قوائم طويلة من الأسماء.",
        duration: 6000
      },
      {
        character: "Yahya",
        text: "More than 40,000 personal signatures on execution lists. His enemies are everyone who disagrees with him.",
        arabicText: "أكثر من 40,000 توقيع شخصي موثق على قوائم إعدام. أعداؤه هم كل من يختلف معه.",
        duration: 4500
      },
      {
        character: "Narrator",
        text: "In the second half, the killing fields of Cambodia. Pol Pot — a graduate of Parisian universities — applies his philosophy of \"human liberation\" by killing a quarter of his country's population.",
        arabicText: "في النصف الثاني، حقول الموت في كمبوديا. بول بوت، خريج جامعات باريس، يطبق فلسفة \"التحرر الإنساني\" بقتل ربع سكان بلاده.",
        duration: 6000
      },
      {
        character: "Laila",
        text: "Why?!",
        arabicText: "لماذا؟!",
        duration: 2000
      },
      {
        character: "OSIRIS",
        text: "Glasses mean education. Education means the ability for independent thought. Independent thought is a threat to \"revolutionary purity.\"",
        arabicText: "النظارة تعني التعليم. التعليم يعني القدرة على التفكير المستقل. التفكير المستقل تهديد لـ \"النقاء الثوري\".",
        duration: 5000
      },
      {
        character: "Yahya",
        text: "Three men. Three completely different ideologies: fascist, communist, and Maoist. But one sentence unites them: \"I alone know the truth.\" It is the same sentence spoken before the beginning of time.",
        arabicText: "ثلاثة رجال. ثلاث أيديولوجيات مختلفة تماماً: فاشية، شيوعية، وماوية. لكن جملة واحدة تجمعهم: \"أنا وحدي أعرف الحقيقة\". إنها نفس الجملة التي قيلت قبل بدء الزمن.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "six-8c-1-attack",
        text: "The hideout is under attack!",
        arabicText: "المخبأ يتعرض للهجوم!",
        nextSceneId: "six-8d-1-attack"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 8d.1: اختراق المخبأ
  'six-8d-1-attack': {
    id: 'six-8d-1-attack',
    title: "Breaching the Hideout",
    arabicTitle: "اختراق المخبأ",
    part: 4,
    backgroundImage: background('qabil_habil_aftermath'),
    visualEffect: "alarm",
    ambientKeys: ["amb.smoke_alarm", "amb.footsteps_heavy"],
    enterSfxKeys: ["sfx.explosion", "sfx.gunshot_distant"],
    dialogue: [
      {
        character: "Narrator",
        text: "Suddenly, the simulation cut off. The secret hideout shook violently, and dust fell from the ceiling.",
        arabicText: "فجأة، انقطعت المحاكاة. اهتز المخبأ السري بعنف، وتناثر الغبار من السقف.",
        duration: 4500
      },
      {
        character: "OSIRIS",
        text: "WARNING: Security breach at physical location.",
        arabicText: "تحذير: اختراق أمني للموقع الفيزيائي.",
        duration: 3000
      },
      {
        character: "Laila",
        text: "They found us!",
        arabicText: "لقد وجدونا!",
        duration: 2000
      },
      {
        character: "Narrator",
        text: "Yahya heard heavy footsteps approaching the iron door. They were not police. They were \"the followers\" — ordinary people directed through encrypted notifications on their phones to carry out an elimination operation, believing they were saving the world from \"terrorists.\"",
        arabicText: "سمع يحيى أصوات خطوات ثقيلة تقترب من الباب الحديدي. لم يكونوا شرطة. كانوا \"الأتباع\". أشخاص عاديون تم توجيههم عبر إشعارات مشفرة في هواتفهم للقيام بعملية تصفية، معتقدين أنهم ينقذون العالم من \"إرهابيين\".",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "The iron door exploded. Three men with expressionless faces entered, carrying firearms. Laila released a smoke grenade she had prepared in advance. The smoke blinded the attackers temporarily.",
        arabicText: "انفجر الباب الحديدي. دخل ثلاثة رجال بوجوه خالية من التعابير، يحملون أسلحة نارية. أطلقت ليلى قنبلة دخان كانت قد أعدتها مسبقاً. عمى الدخان المهاجمين مؤقتاً.",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "Yahya and Laila ran toward the emergency tunnel. A stray bullet fired in the darkness. Yahya felt a powerful blow to his left shoulder, as if a hot hammer had struck him. He fell to the ground, blood flowing from his wound.",
        arabicText: "ركض يحيى وليلى نحو نفق الطوارئ. انطلقت رصاصة عشوائية في الظلام. شعر يحيى بضربة قوية في كتفه الأيسر، كأن مطرقة ساخنة هوت عليه. سقط على الأرض، والدم يتدفق من جرحه.",
        duration: 7000
      },
      {
        character: "Laila",
        text: "Yahya!",
        arabicText: "يحيى!",
        duration: 1500
      }
    ],
    choices: [
      {
        id: "six-8d-1-continue",
        text: "The final update — 48 hours",
        arabicText: "التحديث النهائي — 48 ساعة",
        nextSceneId: "six-8d-2-final-update"
      }
    ],
    transitionType: 'glitch',
    transitionDuration: 500,
    emotionalTone: 'intense',
  },

  // المشهد 8d.2: التحديث النهائي
  'six-8d-2-final-update': {
    id: 'six-8d-2-final-update',
    title: "The Final Update",
    arabicTitle: "التحديث النهائي (إصابة يحيى والهروب)",
    part: 4,
    backgroundImage: background('white_space'),
    visualEffect: "alarm",
    ambientKeys: ["amb.heartbeat_slow"],
    dialogue: [
      {
        character: "Narrator",
        text: "They reached an old ambulance Laila had prepared as an escape plan. While Laila pressed on Yahya's wound to stop the bleeding, Yahya opened his laptop with one hand and connected it to the portable OSIRIS server.",
        arabicText: "وصلا إلى سيارة إسعاف قديمة كانت ليلى قد جهزتها كخطة هروب. بينما كانت ليلى تضغط على جرح يحيى لوقف النزيف، فتح يحيى حاسوبه المحمول بيد واحدة، ووصله بخادم أوزيريس المحمول.",
        duration: 7000
      },
      {
        character: "Laila",
        text: "What are you doing? You are bleeding!",
        arabicText: "ماذا تفعل؟ أنت تنزف!",
        duration: 2500
      },
      {
        character: "Yahya",
        text: "I understand now why they attacked us. The First Engineer... he is preparing to launch \"the final update.\"",
        arabicText: "لقد فهمت لماذا هاجمونا الآن. المهندس الأول... إنه يستعد لإطلاق \"التحديث النهائي\".",
        duration: 5000
      },
      {
        character: "Laila",
        text: "What update?",
        arabicText: "أي تحديث؟",
        duration: 2000
      },
      {
        character: "Yahya",
        text: "The algorithm is no longer just an app on phones. They have developed a neural frequency control system. It will be broadcast via 6G networks worldwide tonight. It will completely eliminate free will. It will connect billions of humans to a \"collective mind\" controlled by the First Engineer. He believes that by doing so he will end wars... because he will end choice.",
        arabicText: "الخوارزمية لم تعد مجرد تطبيق على الهواتف. لقد طوروا نظام تحكم بالترددات العصبية. سيتم بثه عبر شبكات الجيل السادس في جميع أنحاء العالم الليلة. سيلغي الإرادة الحرة تماماً. سيجعل مليارات البشر متصلين بـ \"عقل جمعي\" يديره المهندس الأول. يعتقد أنه بذلك سيقضي على الحروب... لأنه سيقضي على الاختيار.",
        duration: 10000
      },
      {
        character: "Yahya",
        text: "Timeline: 48 hours. If we do not stop him... the human story ends.",
        arabicText: "الجدول الزمني: 48 ساعة. إذا لم نوقفه... ستنتهي القصة البشرية.",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "Yahya lost consciousness.",
        arabicText: "غاب يحيى عن الوعي.",
        duration: 3000
      }
    ],
    choices: [
      {
        id: "six-8d-2-dream",
        text: "The dream before the battle",
        arabicText: "الحلم قبل المعركة",
        nextSceneId: "transition-dream"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // Scene 17.1: Facebook leaked documents / The New Priesthood
  'six-digital-intro': {
    id: 'six-digital-intro',
    title: "The New Priesthood",
    arabicTitle: "وثائق فيسبوك المسرّبة",
    part: 5,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.notification_swarm", "amb.server_room"],
    dialogue: [
      {
        character: "Narrator",
        text: "Today, Iblis does not need temples. He needs algorithms. Engineers discovered that outrage spreads six times faster than truth. And they chose to feed it anyway. Because engagement means profit.",
        arabicText: "قبل أن يستيقظ يحيى في العالم الحقيقي، سحبه أوزيريس إلى محاكاة أخيرة. العالم المعاصر.",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "The engineers knew. They discovered that anger spreads six times faster than truth. Outrage keeps people online. Outrage generates profit.",
        arabicText: "اكتشف مهندسو الشركة أن الخوارزمية تضاعف انتشار المحتوى المثير للغضب بمعدل 6 أضعاف المحتوى الهادئ. وحين عُرض الأمر للإدارة، قرروا الإبقاء على الخوارزمية لأنها تزيد وقت الاستخدام والأرباح.",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "They had a choice. They chose profit over humanity.",
        arabicText: "هل ترى يا يحيى؟ نحن لم نخترع الغضب. نحن فقط قمنا بتحسينه. إبليس اليوم لا يحتاج إلى كهنة ومعابد. يحتاج إلى خوارزمية تغذي كل إنسان بما يعزز كبره، ويقنعه أن رأيه وحده هو الصواب.",
        duration: 3000
      }
    ],
    choices: [
      {
        id: "six-digital-to-karbala",
        text: "Move to the unarmed truth",
        arabicText: "انتقل إلى الحق الأعزل",
        nextSceneId: "seven-10-1-karbala"
      }
    ],
    transitionType: 'glitch',
    transitionDuration: 1800,
    emotionalTone: 'dark',
  },
  // المشهد 9.1: السجن الرقمي (المواجهة النهائية مع المهندس)
  'six-9-1-digital-cage': {
    id: 'six-9-1-digital-cage',
    title: 'The Digital Cage',
    arabicTitle: 'السجن الرقمي',
    part: 4,
    backgroundVideo: videoBg('digital_space'),
    backgroundImage: background('osiris_interface'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.server_room"],
    dialogue: [
      {
        character: "Narrator",
        text: "Suddenly, Berlin faded away and a cold digital space replaced it. Billions of luminous threads connected every human on the planet to one enormous screen at the center.",
        arabicText: "فجأة، تلاشت برلين، وحل محلها فضاء رقمي بارد. كانت هناك مليارات الخيوط النورانية التي تربط كل إنسان على الكوكب بشاشة واحدة ضخمة في المركز.",
        duration: 12400
      },
      {
        character: "first_engineer",
        text: "Welcome to your age, Dr. Yahya, said the First Engineer as he began to take shape as a digital phantom. We no longer need tanks or concentration camps. We built a prison whose walls the prisoner cannot see.",
        arabicText: "\"مرحباً بك في عصرك يا دكتور يحيى،\" قال صوت المهندس الأول الذي بدأ يتجسد كطيف رقمي. \"نحن لم نعد بحاجة إلى دبابات أو معسكرات اعتقال. لقد بنينا سجناً لا يرى السجين جدرانه.\"",
        duration: 15600
      },
      {
        character: "first_engineer",
        text: "The First Engineer pointed at the luminous threads. Every thread is an algorithm. Every like is a drop of anesthetic. We do not control their bodies; we control their desires. We make them hate whom we choose, love whom we choose, and worship what we choose... while they believe they are free.",
        arabicText: "أشار المهندس الأول إلى الخيوط النورانية. \"كل خيط هو خوارزمية. كل إعجاب هو قطرة مخدر. نحن لا نتحكم بأجسادهم، بل نتحكم برغباتهم. نحن نجعلهم يكرهون من نشاء، ويحبون من نشاء، ويعبدون ما نشاء... وهم يظنون أنهم أحرار.\"",
        duration: 20400
      },
      {
        character: "Yahya",
        text: "Yahya shouted in anger: You do not own them! Human beings have free will!",
        arabicText: "صرخ يحيى بغضب: \"أنت لا تملكهم! الإنسان يملك إرادة حرة!\"",
        duration: 5200
      },
      {
        character: "first_engineer",
        text: "The First Engineer laughed mockingly. Free will? Do you think someone who spends twelve hours a day in infinite scrolling has free will? He is only a loop inside my algorithm. We own their data, and therefore we own their souls.",
        arabicText: "ضحك المهندس الأول بسخرية. \"الإرادة الحرة؟ هل تعتقد أن الشخص الذي يقضي 12 ساعة يومياً في التمرير اللانهائي يملك إرادة حرة؟ هو مجرد حلقة مفرغة في خوارزميتي. نحن نملك بياناتهم، ولهذا نحن نملك أرواحهم.\"",
        duration: 18400
      }
    ],
    choices: [
      {
        id: 'six-9-1-to-karbala',
        text: 'Prepare for the final confrontation',
        arabicText: 'استعد للمواجهة النهائية',
        nextSceneId: 'seven-10-1-karbala',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'dark',
  },
};
