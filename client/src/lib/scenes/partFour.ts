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
        text: "Ramses looks at his reflection.",
        arabicText: "نقل أوزيريس يحيى وليلى إلى مصر القديمة. لم تكن مصر التي تظهر في الأفلام، بل كانت حضارة حقيقية، تنبض بالحياة والعبقرية الهندسية.",
        duration: 2000
      },
      {
        character: "Narrator",
        text: "He sees a great king.",
        arabicText: "وقف رمسيس الثاني، المحارب الذي لا يُهزم، ينظر إلى انعكاس صورته في مياه النيل الصافية. كان يرتدي زياً ملكياً بسيطاً، لكن هيبته كانت تملأ المكان.",
        duration: 2000
      },
      {
        character: "Narrator",
        text: "But he asks his priest:",
        arabicText: "\"هذا هو رمسيس،\" قال يحيى وهو يقرأ بيانات أوزيريس. \"عبقري، قائد عسكري فذ، وباني أعظم المعابد. لكن الخوارزمية وجدت فيه ثغرة.\"",
        duration: 1500
      },
      {
        character: "Ramses",
        text: "'Why must I die?'",
        arabicText: "اقترب رجل يرتدي عباءة كهنوتية داكنة من رمسيس. لم يكن وجهه واضحاً ليحيى، لكنه عرفه على الفور. إنه \"الحكيم\"، نفس الكيان الذي سيظهر لاحقاً في نيقية.",
        duration: 2500
      },
      {
        character: "Narrator",
        text: "The mysterious priest emerges from the shadows.",
        arabicText: "سأل رمسيس النيل، وكأنه يكلم نفسه: \"لماذا يجب أن أموت؟ لقد بنيت ما لم يبنه أحد. هزمت الحيثيين. أطعمت شعبي. لماذا أكون مجرد إنسان يفنى؟\"",
        duration: 2500
      },
      {
        character: "Priest",
        text: "'Because they say there is a God above you'",
        arabicText: "همس الكاهن الغامض بصوت ناعم كفحيح الأفعى: \"لأنهم يقولون إن فوقك ربًا يا مولاي. طالما أنك تعترف بوجود من هو أعلى منك، فستظل عبداً للموت.\"",
        duration: 3000
      }
    ],
    choices: [
      {
        id: "two-mirror-continue",
        text: "Witness the Declaration",
        arabicText: "إعلان الألوهية",
        nextSceneId: "two-divine-declaration"
      }
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
        duration: 2500
      },
      {
        character: "Narrator",
        text: "'I am the God'",
        arabicText: "\"أنا ربكم الأعلى،\" أعلن رمسيس، وصوته يتردد في الوادي.",
        duration: 2500
      },
      {
        character: "Narrator",
        text: "Pharaoh declares his divinity.",
        arabicText: "سجدت الحشود. لم يسجدوا خوفاً من السوط فقط، بل سجدوا انبهاراً بالقوة المادية.",
        duration: 2000
      },
      {
        character: "Narrator",
        text: "But on the other side of the Nile, a child is born.",
        arabicText: "\"انظر إلى هذا،\" قال يحيى بمرارة. \"لقد نجحت الخوارزمية. رمسيس قال (أنا خير منهم)، فصدقوه. لقد تحول من ملك إلى إله، وتحولوا هم من بشر إلى أدوات.\"",
        duration: 2500
      },
      {
        character: "Narrator",
        text: "A child who will prove to history that the true God needs no walls to prove His existence.",
        arabicText: "في تلك اللحظة، التقط أوزيريس صوتاً خفياً يتردد بين المشاهد. صوت إبليس يعلق على الأحداث:\n\"انظروا... انظروا جيداً. هذا ما خُلق من طين. يدّعي الألوهية. ألم أقل أنه لا يستحق؟\"",
        duration: 4000
      }
    ],
    choices: [
      {
        id: "two-divine-continue",
        text: "Enter the desert void",
        arabicText: "نشوة النجاة وقلق الفراغ",
        nextSceneId: "four-4-1-desert"
      }
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
        duration: 7000
      },
      {
        character: "Laila",
        text: "Moses has been absent for weeks. They had grown accustomed to slavery in Egypt. Slavery is harsh, but it provides certainty: you know when to wake up, what to do, and what to eat. Absolute freedom in this desert... is terrifying.",
        arabicText: "موسى غائب منذ أسابيع. لقد اعتادوا على العبودية في مصر. العبودية قاسية، لكنها توفر اليقين: أنت تعرف متى تستيقظ، ماذا تعمل، وماذا تأكل. الحرية المطلقة في هذه الصحراء... مرعبة.",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "Yahya pointed to a man standing on a high rock, watching the crowds with eyes that analyzed the situation with mathematical precision. He did not look like an evil sorcerer, but like an engineer studying a problem that needed a solution.",
        arabicText: "أشار يحيى إلى رجل يقف على صخرة مرتفعة، يراقب الحشود بعينين تحللان الموقف بدقة رياضية. لم يكن يبدو كساحر شرير، بل كمهندس يدرس مشكلة تحتاج إلى حل.",
        duration: 6000
      },
      {
        character: "Yahya",
        text: "The Samaritan.",
        arabicText: "السامري.",
        duration: 2000
      },
      {
        character: "Samaritan",
        text: "You are afraid. That is natural. The God who brought you out of Egypt is a great God, but He is... invisible. Abstract. You cannot touch Him or see Him. And you need something to reassure you now, in this void.",
        arabicText: "أنتم خائفون. هذا طبيعي. الإله الذي أخرجكم من مصر إله عظيم، لكنه... غير مرئي. مجرد. لا يمكنكم لمسه أو رؤيته. وأنتم تحتاجون إلى شيء يطمئنكم الآن، في هذا الفراغ.",
        duration: 6500
      },
      {
        character: "Narrator",
        text: "He did not ask them to disbelieve. He did not ask them to worship a devil. He offered them a \"practical solution\" to their spiritual anxiety.",
        arabicText: "لم يطلب منهم الكفر. لم يطلب منهم عبادة شيطان. لقد قدم لهم \"حلاً عملياً\" لقلقهم الروحي.",
        duration: 5000
      }
    ],
    choices: [
      {
        id: "four-4-1-continue",
        text: "Watch the engineering of the crowds",
        arabicText: "شاهد هندسة الحشود",
        nextSceneId: "four-4-2-crowd-engineering"
      }
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'intense',
  },

  // المشهد 4.2: هندسة الحشود
  'four-4-2-crowd-engineering': {
    id: 'four-4-2-crowd-engineering',
    title: "Engineering the Crowds",
    arabicTitle: "هندسة الحشود",
    part: 2,
    backgroundVideo: videoBg('molten_gold'),
    backgroundImage: background('pharaoh_temple'),
    ambientKeys: ["amb.metal_melt", "amb.drums_hypnosis"],
    enterSfxKeys: ["sfx.calf_low"],
    dialogue: [
      {
        character: "Yahya",
        text: "He is not making a god, Laila. He is making an icon. A comfortable system that relieves them of the responsibility of thinking and abstract faith.",
        arabicText: "إنه لا يصنع إلهاً يا ليلى. إنه يصنع أيقونة. نظاماً مريحاً يعفيهم من مسؤولية التفكير والإيمان التجريدي.",
        duration: 5500
      },
      {
        character: "Narrator",
        text: "When the golden calf was complete, it was not just a silent statue. Through the Samaritan's engineering and air currents, the calf emitted a sound — a lowing — that seemed alive.",
        arabicText: "عندما اكتمل العجل الذهبي، لم يكن مجرد تمثال صامت. بفضل هندسة السامري وتيارات الهواء، كان العجل يصدر صوتاً (خواراً) يبدو وكأنه حي.",
        duration: 5500
      },
      {
        character: "Narrator",
        text: "The crowds erupted in hysterical euphoria. They began dancing around the calf. They were no longer frightened individuals — they had become a \"herd\" unified around a material symbol.",
        arabicText: "انفجرت الحشود في نشوة هستيرية. بدأوا يرقصون حول العجل. لم يعودوا أفراداً خائفين، بل أصبحوا \"قطيعاً\" موحداً حول رمز مادي.",
        duration: 6000
      },
      {
        character: "Yahya",
        text: "This is terrifying. The Samaritan is the first UI/UX designer in history. He designed a simple, easy-to-use material interface for a complex God.",
        arabicText: "هذا مرعب. السامري هو أول مهندس واجهات مستخدم في التاريخ. لقد صمم واجهة مادية سهلة الاستخدام لإله معقد.",
        duration: 6000
      },
      {
        character: "Yahya",
        text: "The algorithm does not force anyone. It only offers you what you think you desperately need.",
        arabicText: "الخوارزمية لا تجبر أحداً. هي فقط تقدم لك ما تظن أنك تحتاجه بشدة.",
        duration: 4500
      }
    ],
    choices: [
      {
        id: "four-4-2-continue",
        text: "Hear Tarek's message about the digital calf",
        arabicText: "اسمع رسالة طارق عن العجل الرقمي",
        nextSceneId: "four-5-1-tarek-message"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'dark',
  },

  // المشهد 5.1: رسالة من الماضي
  'four-5-1-tarek-message': {
    id: 'four-5-1-tarek-message',
    title: "A Message from the Past",
    arabicTitle: "رسالة من الماضي",
    part: 2,
    backgroundImage: background('corporate_lab'),
    audioUrl: audio('yahya_monologue'),
    ambientKeys: ["amb.server_room"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya stopped the simulation. He was breathing with difficulty. He took out a small hard drive from his bag — one of the drives Tarek had left.",
        arabicText: "أوقف يحيى المحاكاة. كان يتنفس بصعوبة. أخرج قرصاً صلباً صغيراً من حقيبته، أحد الأقراص التي تركها طارق.",
        duration: 5000
      },
      {
        character: "Yahya",
        text: "There is a recording of Tarek linked to this part of the code. I did not understand it before. Now... I think I will.",
        arabicText: "هناك تسجيل لطارق مرتبط بهذا الجزء من الكود. لم أفهمه من قبل. الآن... أعتقد أنني سأفهم.",
        duration: 4500
      },
      {
        character: "Tarek",
        text: "Yahya... if you are listening to this, you may have seen the Samaritan simulation. Do you know what is truly terrifying? The Samaritan needed to gather gold, melt metals, and wait for Moses' absence to build his calf. But us? We built a golden calf in the pocket of every human being on this planet.",
        arabicText: "يحيى... إذا كنت تستمع لهذا، فربما تكون قد رأيت محاكاة السامري. هل تعرف ما هو المرعب حقاً؟ السامري كان يحتاج إلى جمع الذهب، وصهر المعادن، وانتظار غياب موسى ليصنع عجله. أما نحن؟ نحن صنعنا عجلاً ذهبياً في جيب كل إنسان على هذا الكوكب.",
        duration: 9000
      },
      {
        character: "Tarek",
        text: "The addiction algorithms we wrote... the likes, the red notifications, the infinite scroll. They all work by the same psychological mechanism as the golden calf. We exploit the spiritual void of modern man, his anxiety, his loneliness... and offer him fake material rewards. Drops of dopamine that keep him glued to the screen, dancing around the digital calf, voluntarily surrendering his freedom and will.",
        arabicText: "خوارزميات الإدمان التي كتبناها... الإعجابات، الإشعارات الحمراء، التمرير اللانهائي. كلها تعمل بنفس الآلية السيكولوجية للعجل الذهبي. نحن نستغل الفراغ الروحي للإنسان الحديث، قلقه، وحدته... ونقدم له مكافآت مادية وهمية. قطرات من الدوبامين تبقيه ملتصقاً بالشاشة، يرقص حول العجل الرقمي، متخلياً عن حريته وإرادته طواعية.",
        duration: 10000
      },
      {
        character: "Tarek",
        text: "The only difference, brother... is that the old calf lowed with the sound of wind. Our calf lows with notifications of anger and hatred — because we discovered that anger keeps people connected longer than joy. We are programming humans to hate each other.",
        arabicText: "الفرق الوحيد يا أخي... أن العجل القديم كان يخور بصوت الريح. عجلنا نحن يخور بإشعارات الغضب والكراهية، لأننا اكتشفنا أن الغضب يُبقي الناس متصلين لفترة أطول من الفرح. نحن نبرمج البشر ليكرهوا بعضهم.",
        duration: 9000
      }
    ],
    choices: [
      {
        id: "four-5-1-continue",
        text: "Continue — the tears of the analyst",
        arabicText: "تابع — دموع المحلل",
        nextSceneId: "four-5-2-analyst-tears"
      }
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'tragic',
  },

  // المشهد 5.2: دموع المحلل
  'four-5-2-analyst-tears': {
    id: 'four-5-2-analyst-tears',
    title: "The Tears of the Analyst",
    arabicTitle: "دموع المحلل",
    part: 2,
    backgroundImage: background('white_space'),
    ambientKeys: ["amb.server_room"],
    dialogue: [
      {
        character: "Narrator",
        text: "The recording ended. A heavy silence fell in the room, broken only by the hum of OSIRIS servers.",
        arabicText: "انتهى التسجيل. ساد صمت ثقيل في الغرفة، لم يقطعه سوى طنين خوادم أوزيريس.",
        duration: 4500
      },
      {
        character: "Narrator",
        text: "For the first time in years — since he had decided that numbers were the only truth — Yahya broke down. He covered his face with his hands and began to cry. Not a loud cry, but the muffled sobbing of a man who realized that everything he had built in his professional life had been part of a machine of destruction.",
        arabicText: "لأول مرة منذ سنوات، منذ أن قرر أن الأرقام هي الحقيقة الوحيدة، انهار يحيى. غطى وجهه بيديه وبدأ يبكي. لم يكن بكاءً صاخباً، بل نشيجاً مكتوماً لرجل أدرك أن كل ما بناه في حياته المهنية كان جزءاً من آلة دمار.",
        duration: 8000
      },
      {
        character: "Yahya",
        text: "Tarek was the Moses of his age. He tried to smash the digital calf... and they killed him.",
        arabicText: "طارق كان موسى عصره. حاول تحطيم العجل الرقمي... فقتلوه.",
        duration: 4500
      },
      {
        character: "Laila",
        text: "Crying will not bring Tarek back. And it will not stop the First Engineer. You have OSIRIS now. You have the source code.",
        arabicText: "البكاء لن يعيد طارق. ولن يوقف المهندس الأول. أنت تملك أوزيريس الآن. تملك الشيفرة المصدرية.",
        duration: 5500
      },
      {
        character: "Yahya",
        text: "I will destroy them. I will use OSIRIS to hack their servers and expose everything.",
        arabicText: "سأدمرهم. سأستخدم أوزيريس لاختراق خوادمهم وفضح كل شيء.",
        duration: 4000
      },
      {
        character: "Laila",
        text: "A direct attack will not work. You are dealing with an entity that owns the world's data. We must understand the enemy first. We must see how they infiltrate great institutions from within. How they turn truth into falsehood in the name of the sacred.",
        arabicText: "الهجوم المباشر لن ينجح. أنت تتعامل مع كيان يمتلك بيانات العالم بأسره. يجب أن نفهم الخصم أولاً. يجب أن نرى كيف يخترقون المؤسسات الكبرى من الداخل. كيف يحولون الحق إلى باطل باسم المقدس.",
        duration: 7000
      },
      {
        character: "Laila",
        text: "To the moment when religion was stolen. To Nicaea.",
        arabicText: "إلى اللحظة التي سُرق فيها الدين. إلى نيقية.",
        duration: 3500
      }
    ],
    choices: [
      {
        id: "four-5-2-nicaea",
        text: "Search for \"the sacred corruption\" — Nicaea 325 AD",
        arabicText: "ابحث عن \"الفساد المقدس\" — نيقية 325م",
        nextSceneId: "five-6a-1-nicaea-debate"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2000,
    emotionalTone: 'contemplative',
  },
};
