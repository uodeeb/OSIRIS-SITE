import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_SIX: Record<string, Scene> = {
  // المشهد 8.1: الأندلس الضائعة — خيانة الإخوة
  'six-8-1-andalusia': {
    id: 'six-8-1-andalusia',
    title: 'The Lost Andalusia — Betrayal of Brothers',
    arabicTitle: 'الأندلس الضائعة — خيانة الإخوة',
    part: 4,
    backgroundVideo: videoBg('andalus'),
    backgroundImage: background('granada_fall'),
    ambientKeys: ["amb.city_night", "amb.distant_whispers"],
    dialogue: [
      {
        character: 'Narrator',
        text: "نقل أوزيريس يحيى وليلى إلى ذروة الحضارة الأندلسية. شوارع قرطبة المضاءة، المكتبات الضخمة، والجامعات التي سبقت أوروبا بقرون.",
        arabicText: "نقل أوزيريس يحيى وليلى إلى ذروة الحضارة الأندلسية. شوارع قرطبة المضاءة، المكتبات الضخمة، والجامعات التي سبقت أوروبا بقرون.",
        duration: 7000
      },
      {
        character: 'laila',
        text: "انظر إلى هذا الجمال. كيف يمكن لحضارة بهذا الرقي أن تسقط؟",
        arabicText: "انظر إلى هذا الجمال. كيف يمكن لحضارة بهذا الرقي أن تسقط؟",
        duration: 4000
      },
      {
        character: 'yahya',
        text: "الخوارزمية لا تهتم بالجمال. الخوارزمية تبحث عن نقطة الضعف. وهنا، نقطة الضعف كانت (الأنا).",
        arabicText: "الخوارزمية لا تهتم بالجمال. الخوارزمية تبحث عن نقطة الضعف. وهنا، نقطة الضعف كانت (الأنا).",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "عرض أوزيريس سلسلة من المشاهد السريعة: أمير إشبيلية يتحالف مع ملك قشتالة ضد أمير بطليوس. أمير طليطلة يدفع الجزية للعدو ليحارب أخاه.",
        arabicText: "عرض أوزيريس سلسلة من المشاهد السريعة: أمير إشبيلية يتحالف مع ملك قشتالة ضد أمير بطليوس. أمير طليطلة يدفع الجزية للعدو ليحارب أخاه.",
        duration: 7000
      },
      {
        character: 'yahya',
        text: "كل واحد منهم يقول: أنا خير من أخي. الكبر الشخصي أصبح أهم من بقاء الأمة. الفيروس هنا لم يحتج إلى تدميرهم من الخارج. لقد جعلهم يدمرون أنفسهم.",
        arabicText: "كل واحد منهم يقول: أنا خير من أخي. الكبر الشخصي أصبح أهم من بقاء الأمة. الفيروس هنا لم يحتج إلى تدميرهم من الخارج. لقد جعلهم يدمرون أنفسهم.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: 'six-8-1-to-tears',
        text: 'Witness the final tears',
        arabicText: 'شاهد الدموع الأخيرة',
        nextSceneId: 'six-8-2-last-tears',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },

  // المشهد 8.2: دموع لا تنفع
  'six-8-2-last-tears': {
    id: 'six-8-2-last-tears',
    title: 'Tears That Do Not Help',
    arabicTitle: 'دموع لا تنفع',
    part: 4,
    backgroundVideo: videoBg('granada_fall'),
    backgroundImage: background('granada_fall'),
    ambientKeys: ["amb.wind_soft"],
    dialogue: [
      {
        character: 'Narrator',
        text: "توقف الزمن في المحاكاة عند عام 1492. رأى يحيى وليلى رجلاً يركب حصانه، يغادر مدينة غرناطة للمرة الأخيرة. استدار الرجل — أبو عبد الله الأصغر — ونظر إلى قصر الحمراء بعينين داميتين.",
        arabicText: "توقف الزمن في المحاكاة عند عام 1492. رأى يحيى وليلى رجلاً يركب حصانه، يغادر مدينة غرناطة للمرة الأخيرة. استدار الرجل — أبو عبد الله الأصغر — ونظر إلى قصر الحمراء بعينين داميتين.",
        duration: 8000
      },
      {
        character: 'Narrator',
        text: "لم يتمالك نفسه، وبدأ يبكي.",
        arabicText: "لم يتمالك نفسه، وبدأ يبكي.",
        duration: 3000
      },
      {
        character: 'aisha',
        text: "ابكِ كالنساء ملكاً لم تحافظ عليه كالرجال.",
        arabicText: "ابكِ كالنساء ملكاً لم تحافظ عليه كالرجال.",
        duration: 4000
      },
      {
        character: 'laila',
        text: "هذه هي النتيجة النهائية لخوارزمية الكبر. عندما تعتقد أنك الأهم، تفقد كل شيء.",
        arabicText: "هذه هي النتيجة النهائية لخوارزمية الكبر. عندما تعتقد أنك الأهم، تفقد كل شيء.",
        duration: 5000
      },
      {
        character: 'OSIRIS',
        text: "لا يمكنك إصلاح نظام مصاب بفيروس أنا خير منهم باستخدام نفس الفيروس.",
        arabicText: "لا يمكنك إصلاح نظام مصاب بفيروس أنا خير منهم باستخدام نفس الفيروس.",
        duration: 5000
      }
    ],
    choices: [
      {
        id: 'six-8-2-to-berlin',
        text: 'Continue to the 20th century',
        arabicText: 'استمر إلى القرن العشرين',
        nextSceneId: 'six-8b-1-berlin',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 8b.1: وهم العرق الأسمى (برلين 1933)
  'six-8b-1-berlin': {
    id: 'six-8b-1-berlin',
    title: 'The Illusion of the Supreme Race',
    arabicTitle: 'وهم العرق الأسمى',
    part: 4,
    backgroundVideo: videoBg('berlin_1933'),
    backgroundImage: background('berlin_1933'),
    ambientKeys: ["amb.city_cold", "amb.march_drums_distant"],
    dialogue: [
      {
        character: 'Narrator',
        text: "تسارعت المحاكاة. قفز أوزيريس قروناً إلى الأمام. برلين، 1933.",
        arabicText: "تسارعت المحاكاة. قفز أوزيريس قروناً إلى الأمام. برلين، 1933.",
        duration: 5000
      },
      {
        character: 'yahya',
        text: "الفيروس يتطور يا ليلى. لقد تخلى عن الغطاء الديني تماماً. لم يعد يحتاج إلى إله ليبرر الكبر. أصبح الإنسان نفسه هو الإله.",
        arabicText: "الفيروس يتطور يا ليلى. لقد تخلى عن الغطاء الديني تماماً. لم يعد يحتاج إلى إله ليبرر الكبر. أصبح الإنسان نفسه هو الإله.",
        duration: 6000
      },
      {
        character: 'Narrator',
        text: "وجدا نفسيهما في غرفة مغلقة في برلين. رجل بشارب مميز يقف أمام المرآة، يتدرب على تعابير وجهه، وحركات يديه.",
        arabicText: "وجدا نفسيهما في غرفة مغلقة في برلين. رجل بشارب مميز يقف أمام المرآة، يتدرب على تعابير وجهه، وحركات يديه.",
        duration: 6000
      },
      {
        character: 'laila',
        text: "هتلر.",
        arabicText: "هتلر.",
        duration: 2000
      },
      {
        character: 'yahya',
        text: "إنه لا يمثل الشر العشوائي. إنه يمثل الكبر المؤسسي. هو يعتقد بعمق أنه مختار، أنه فوق كل القواعد الأخلاقية، لأنه يصنع تاريخاً.",
        arabicText: "إنه لا يمثل الشر العشوائي. إنه يمثل الكبر المؤسسي. هو يعتقد بعمق أنه مختار، أنه فوق كل القواعد الأخلاقية، لأنه يصنع تاريخاً.",
        duration: 8000
      }
    ],
    choices: [
      {
        id: 'six-8b-1-to-signatures',
        text: 'Witness the death signatures',
        arabicText: 'شاهد توقيعات الموت',
        nextSceneId: 'six-8c-1-death-signatures',
      },
    ],
    transitionType: 'slideLeft',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // المشهد 8c.1: التوقيع على الموت (ستالين/بول بوت)
  'six-8c-1-death-signatures': {
    id: 'six-8c-1-death-signatures',
    title: 'Signing Death Orders',
    arabicTitle: 'التوقيع على الموت',
    part: 4,
    backgroundImage: background('moscow_1937'),
    visualEffect: "montage",
    ambientKeys: ["amb.typewriter", "amb.march_drums_distant"],
    dialogue: [
      {
        character: 'Narrator',
        text: "انقسمت الشاشة إلى نصفين. في النصف الأول، مكتب في الكرملين. جوزيف ستالين يجلس بهدوء، يدخن غليونه، ويوقع على قوائم طويلة من الأسماء.",
        arabicText: "انقسمت الشاشة إلى نصفين. في النصف الأول، مكتب في الكرملين. جوزيف ستالين يجلس بهدوء، يدخن غليونه، ويوقع على قوائم طويلة من الأسماء.",
        duration: 7000
      },
      {
        character: 'yahya',
        text: "أكثر من 40,000 توقيع شخصي موثق على قوائم إعدام. أعداؤه هم كل من يختلف معه.",
        arabicText: "أكثر من 40,000 توقيع شخصي موثق على قوائم إعدام. أعداؤه هم كل من يختلف معه.",
        duration: 4000
      },
      {
        character: 'Narrator',
        text: "في النصف الثاني، حقول الموت في كمبوديا. بول بوت، خريج جامعات باريس، يطبق فلسفة التحرر الإنساني بقتل ربع سكان بلاده.",
        arabicText: "في النصف الثاني، حقول الموت في كمبوديا. بول بوت، خريج جامعات باريس، يطبق فلسفة التحرر الإنساني بقتل ربع سكان بلاده.",
        duration: 6000
      },
      {
        character: 'laila',
        text: "لماذا؟!",
        arabicText: "لماذا؟!",
        duration: 2000
      },
      {
        character: 'OSIRIS',
        text: "النظارة تعني التعليم. التعليم يعني القدرة على التفكير المستقل. التفكير المستقل تهديد للنقاء الثوري.",
        arabicText: "النظارة تعني التعليم. التعليم يعني القدرة على التفكير المستقل. التفكير المستقل تهديد للنقاء الثوري.",
        duration: 6000
      },
      {
        character: 'yahya',
        text: "ثلاثة رجال. ثلاث أيديولوجيات مختلفة تماماً: فاشية، شيوعية، وماوية. لكن جملة واحدة تجمعهم: أنا وحدي أعرف الحقيقة. إنها خوارزمية الكبر.",
        arabicText: "ثلاثة رجال. ثلاث أيديولوجيات مختلفة تماماً: فاشية، شيوعية، وماوية. لكن جملة واحدة تجمعهم: أنا وحدي أعرف الحقيقة. إنها خوارزمية الكبر.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: 'six-8c-1-to-attack',
        text: 'Return to reality — The attack',
        arabicText: 'العودة إلى الواقع — الهجوم',
        nextSceneId: 'six-8d-1-attack',
      },
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 8d.1: اختراق المخبأ
  'six-8d-1-attack': {
    id: 'six-8d-1-attack',
    title: 'Breaching the Hideout',
    arabicTitle: 'اختراق المخبأ',
    part: 4,
    backgroundImage: background('qabil_habil_aftermath'),
    visualEffect: "alarm",
    ambientKeys: ["amb.smoke_alarm", "amb.footsteps_heavy"],
    enterSfxKeys: ["sfx.explosion", "sfx.gunshot_distant"],
    dialogue: [
      {
        character: 'Narrator',
        text: "فجأة، انقطعت المحاكاة. اهتز المخبأ السري بعنف، وتناثر الغبار من السقف.",
        arabicText: "فجأة، انقطعت المحاكاة. اهتز المخبأ السري بعنف، وتناثر الغبار من السقف.",
        duration: 5000
      },
      {
        character: 'OSIRIS',
        text: "تحذير: اختراق أمني للموقع الفيزيائي.",
        arabicText: "تحذير: اختراق أمني للموقع الفيزيائي.",
        duration: 3000
      },
      {
        character: 'laila',
        text: "لقد وجدونا!",
        arabicText: "لقد وجدونا!",
        duration: 2000
      },
      {
        character: 'Narrator',
        text: "سمع يحيى أصوات خطوات ثقيلة تقترب من الباب الحديدي. لم يكونوا شرطة. كانوا الأتباع. أشخاص عاديون تم توجيههم عبر إشعارات على هواتفهم.",
        arabicText: "سمع يحيى أصوات خطوات ثقيلة تقترب من الباب الحديدي. لم يكونوا شرطة. كانوا الأتباع. أشخاص عاديون تم توجيههم عبر إشعارات على هواتفهم.",
        duration: 7000
      },
      {
        character: 'Narrator',
        text: "انفجر الباب الحديدي. دخل ثلاثة رجال بوجوه خالية من التعابير، يحملون أسلحة نارية. أطلقت ليلى قنبلة دخان كانت قد أعدتها مسبقاً.",
        arabicText: "انفجر الباب الحديدي. دخل ثلاثة رجال بوجوه خالية من التعابير، يحملون أسلحة نارية. أطلقت ليلى قنبلة دخان كانت قد أعدتها مسبقاً.",
        duration: 7000
      },
      {
        character: 'Narrator',
        text: "ركض يحيى وليلى نحو نفق الطوارئ. انطلقت رصاصة عشوائية في الظلام. شعر يحيى بضربة قوية في كتفه الأيسر، كأن مطرقة ساخنة هوت عليه.",
        arabicText: "ركض يحيى وليلى نحو نفق الطوارئ. انطلقت رصاصة عشوائية في الظلام. شعر يحيى بضربة قوية في كتفه الأيسر، كأن مطرقة ساخنة هوت عليه.",
        duration: 7000
      },
      {
        character: 'laila',
        text: "يحيى!",
        arabicText: "يحيى!",
        duration: 2000
      }
    ],
    choices: [
      {
        id: 'six-8d-1-to-final-update',
        text: 'The final update',
        arabicText: 'التحديث النهائي',
        nextSceneId: 'six-8d-2-final-update',
      },
    ],
    transitionType: 'glitch',
    transitionDuration: 500,
    emotionalTone: 'intense',
  },

  // المشهد 8d.2: التحديث النهائي
  'six-8d-2-final-update': {
    id: 'six-8d-2-final-update',
    title: 'The Final Update',
    arabicTitle: 'التحديث النهائي',
    part: 4,
    backgroundImage: background('white_space'),
    visualEffect: "alarm",
    ambientKeys: ["amb.heartbeat_slow"],
    dialogue: [
      {
        character: 'Narrator',
        text: "وصلا إلى سيارة إسعاف قديمة كانت ليلى قد جهزتها كخطة هروب. بينما كانت ليلى تضغط على جرح يحيى لوقف النزيف، فتح يحيى حاسوبه المحمول.",
        arabicText: "وصلا إلى سيارة إسعاف قديمة كانت ليلى قد جهزتها كخطة هروب. بينما كانت ليلى تضغط على جرح يحيى لوقف النزيف، فتح يحيى حاسوبه المحمول.",
        duration: 8000
      },
      {
        character: 'laila',
        text: "ماذا تفعل؟ أنت تنزف!",
        arabicText: "ماذا تفعل؟ أنت تنزف!",
        duration: 3000
      },
      {
        character: 'yahya',
        text: "لقد فهمت لماذا هاجمونا الآن. المهندس الأول... إنه يستعد لإطلاق التحديث النهائي.",
        arabicText: "لقد فهمت لماذا هاجمونا الآن. المهندس الأول... إنه يستعد لإطلاق التحديث النهائي.",
        duration: 5000
      },
      {
        character: 'laila',
        text: "أي تحديث؟",
        arabicText: "أي تحديث؟",
        duration: 2000
      },
      {
        character: 'yahya',
        text: "الخوارزمية لم تعد مجرد تطبيق على الهواتف. لقد طوروا نظام تحكم بالترددات العصبية. سيتم بثه عبر شبكات الجيل السادس في جميع أنحاء العالم.",
        arabicText: "الخوارزمية لم تعد مجرد تطبيق على الهواتف. لقد طوروا نظام تحكم بالترددات العصبية. سيتم بثه عبر شبكات الجيل السادس في جميع أنحاء العالم.",
        duration: 7000
      },
      {
        character: 'yahya',
        text: "الجدول الزمني: 48 ساعة. إذا لم نوقفه... ستنتهي القصة البشرية.",
        arabicText: "الجدول الزمني: 48 ساعة. إذا لم نوقفه... ستنتهي القصة البشرية.",
        duration: 5000
      },
      {
        character: 'Narrator',
        text: "غاب يحيى عن الوعي.",
        arabicText: "غاب يحيى عن الوعي.",
        duration: 3000
      }
    ],
    choices: [
      {
        id: 'six-8d-2-to-dream',
        text: 'Enter the dream',
        arabicText: 'ادخل إلى الحلم',
        nextSceneId: 'transition-dream',
      },
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
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
        character: 'laila',
        text: "فجأة، تلاشت برلين، وحل محلها فضاء رقمي بارد. كانت هناك مليارات الخيوط النورانية التي تربط كل إنسان على الكوكب بشاشة واحدة ضخمة في المركز.",
        arabicText: "فجأة، تلاشت برلين، وحل محلها فضاء رقمي بارد. كانت هناك مليارات الخيوط النورانية التي تربط كل إنسان على الكوكب بشاشة واحدة ضخمة في المركز.",
        duration: 12400
      },
      {
        character: 'first_engineer',
        text: "\"مرحباً بك في عصرك يا دكتور يحيى،\" قال صوت المهندس الأول الذي بدأ يتجسد كطيف رقمي. \"نحن لم نعد بحاجة إلى دبابات أو معسكرات اعتقال. لقد بنينا سجناً لا يرى السجين جدرانه.\"",
        arabicText: "\"مرحباً بك في عصرك يا دكتور يحيى،\" قال صوت المهندس الأول الذي بدأ يتجسد كطيف رقمي. \"نحن لم نعد بحاجة إلى دبابات أو معسكرات اعتقال. لقد بنينا سجناً لا يرى السجين جدرانه.\"",
        duration: 15600
      },
      {
        character: 'first_engineer',
        text: "أشار المهندس الأول إلى الخيوط النورانية. \"كل خيط هو خوارزمية. كل إعجاب هو قطرة مخدر. نحن لا نتحكم بأجسادهم، بل نتحكم برغباتهم. نحن نجعلهم يكرهون من نشاء، ويحبون من نشاء، ويعبدون ما نشاء... وهم يظنون أنهم أحرار.\"",
        arabicText: "أشار المهندس الأول إلى الخيوط النورانية. \"كل خيط هو خوارزمية. كل إعجاب هو قطرة مخدر. نحن لا نتحكم بأجسادهم، بل نتحكم برغباتهم. نحن نجعلهم يكرهون من نشاء، ويحبون من نشاء، ويعبدون ما نشاء... وهم يظنون أنهم أحرار.\"",
        duration: 20400
      },
      {
        character: 'yahya',
        text: "صرخ يحيى بغضب: \"أنت لا تملكهم! الإنسان يملك إرادة حرة!\"",
        arabicText: "صرخ يحيى بغضب: \"أنت لا تملكهم! الإنسان يملك إرادة حرة!\"",
        duration: 5200
      },
      {
        character: 'first_engineer',
        text: "ضحك المهندس الأول بسخرية. \"الإرادة الحرة؟ هل تعتقد أن الشخص الذي يقضي 12 ساعة يومياً في التمرير اللانهائي يملك إرادة حرة؟ هو مجرد حلقة مفرغة في خوارزميتي. نحن نملك بياناتهم، ولهذا نحن نملك أرواحهم.\"",
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
