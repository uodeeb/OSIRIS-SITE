import { background, character, videoBg, audio } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_TWO: Record<string, Scene> = {
  // المشهد 2.1: الهروب واللقاء
  'two-2-1-escape': {
    id: 'two-2-1-escape',
    title: "Escape and Meeting",
    arabicTitle: "الهروب واللقاء",
    part: 1,
    backgroundImage: background('yahya_apartment'),
    visualEffect: "cctv",
    ambientKeys: ["amb.sirens_distant", "amb.running_steps"],
    enterSfxKeys: ["sfx.door_clang"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya is running. His elderly neighbor, Mr. Smith — who sometimes fed his cat — had tried to stab him with a kitchen knife minutes ago. The old man's eyes were empty, as if hypnotized. \"Mentally wiped followers,\" as Tarek had called them in his notes.",
        arabicText: "كان يحيى يركض. جاره العجوز، السيد سميث، الذي كان يطعمه قطته أحياناً، حاول طعنه بسكين مطبخ قبل دقائق. عينا العجوز كانتا فارغتين، كأنه منوّم مغناطيسياً. \"الأتباع الممسوحون دماغياً\"، هكذا أسماهم طارق في ملاحظاته.",
        duration: 7000
      },
      {
        character: "Narrator",
        text: "Yahya turned into a narrow alley, and suddenly a hand reached from the darkness and pulled him inside.",
        arabicText: "انعطف يحيى في زقاق ضيق، وفجأة امتدت يد من الظلام وسحبته إلى الداخل.",
        duration: 4000
      },
      {
        character: "Laila",
        text: "Be quiet if you want to live, Dr. Al-Sulaimani.",
        arabicText: "اصمت إذا كنت تريد أن تعيش، دكتور سليماني.",
        duration: 3000
      },
      {
        character: "Narrator",
        text: "A young woman with sharp, intelligent eyes. She led him through underground passages until they reached a room filled with ancient books and cooled computer servers.",
        arabicText: "كانت فتاة شابة، عيناها حادتان وذكيتان. قادته عبر ممرات تحت الأرض حتى وصلا إلى غرفة مليئة بالكتب القديمة والخوادم الحاسوبية المبردة.",
        duration: 5500
      },
      {
        character: "Yahya",
        text: "Who are you?",
        arabicText: "من أنتِ؟",
        duration: 2000
      },
      {
        character: "Laila",
        text: "My name is Laila. A researcher in religious psychology. I have been following your brother's work.",
        arabicText: "اسمي ليلى. باحثة في علم النفس الديني. وكنت أتابع عمل أخيك.",
        duration: 3500
      },
      {
        character: "Yahya",
        text: "Religious psychology? I am a man of numbers. I do not believe in myths.",
        arabicText: "علم نفس ديني؟ أنا رجل أرقام. لا أؤمن بالخرافات.",
        duration: 3000
      },
      {
        character: "Laila",
        text: "The numbers you worship are the ones trying to kill you now. Your brother realized the problem is not technical, but spiritual. The algorithm he discovered does not infiltrate computers — it infiltrates souls. You have the mind to solve it. I have the spirit.",
        arabicText: "الأرقام التي تعبدها هي التي تحاول قتلك الآن. أخوك أدرك أن المشكلة ليست تقنية، بل روحية. الخوارزمية التي اكتشفها لا تخترق الحواسيب، بل تخترق النفوس. أنت تملك العقل لتحليها. أنا أملك الروح.",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "two-2-1-trust",
        text: "Prove it to me.",
        arabicText: "أثبتي لي كلامك.",
        nextSceneId: "two-2-2-osiris-launch",
        consequence: "Laila shows him historical documents that match Tarek's code. Yahya's trust in her grows."
      },
      {
        id: "two-2-1-alone",
        text: "I work alone.",
        arabicText: "أنا أعمل وحدي.",
        nextSceneId: "two-2-2-osiris-launch",
        consequence: "Laila lets him try to decode a complex section alone. He fails, and must ask for her help."
      }
    ],
    transitionType: 'slideUp',
    transitionDuration: 1500,
    emotionalTone: 'urgent',
  },

  // المشهد 2.2: تشغيل أوزيريس
  'two-2-2-osiris-launch': {
    id: 'two-2-2-osiris-launch',
    title: "Launching OSIRIS",
    arabicTitle: "تشغيل أوزيريس",
    part: 1,
    backgroundImage: background('osiris_interface'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.server_room"],
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya sat before the servers and began entering Tarek's code.",
        arabicText: "جلس يحيى أمام الخوادم، وبدأ في إدخال كود طارق.",
        duration: 3500
      },
      {
        character: "Laila",
        text: "What exactly is this system?",
        arabicText: "ما هذا النظام بالضبط؟",
        duration: 2500
      },
      {
        character: "Yahya",
        text: "OSIRIS. A quantum sensing system. It does not reconstruct the past from history books. It reads the quantum waves left in the universe. Every event, every crime, every word spoken — leaves a vibration in the fabric of reality, like ripples in a pond. OSIRIS reads these waves, translates them into data, then transmits them to our senses as a simulation.",
        arabicText: "أوزيريس. نظام استشعار كمي. هو لا يعيد بناء الماضي من كتب التاريخ. هو يقرأ موجات الكم التي تُركت في الكون. كل حدث، كل جريمة، كل كلمة قيلت، تترك اهتزازة في نسيج الواقع، مثل تموجات في بركة ماء. أوزيريس يقرأ هذه الموجات، يترجمها إلى بيانات، ثم ينقلها إلى حواسنا كمحاكاة.",
        duration: 9000
      },
      {
        character: "Laila",
        text: "So we will witness history as it truly happened?",
        arabicText: "إذن، نحن سنشهد التاريخ كما حدث فعلاً؟",
        duration: 3000
      },
      {
        character: "Yahya",
        text: "We will live it.",
        arabicText: "بل سنعيشه.",
        duration: 2000
      },
      {
        character: "Narrator",
        text: "Yahya pressed Enter. \"Let us begin from where everything began. The first crime.\"",
        arabicText: "ضغط يحيى على زر الإدخال. \"لنبدأ من حيث بدأ كل شيء. الجريمة الأولى.\"",
        duration: 4000
      }
    ],
    choices: [
      {
        id: "two-2-2-enter",
        text: "Enter the simulation",
        arabicText: "ادخل المحاكاة",
        nextSceneId: "three-3-1-creation"
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'intense',
  },
};
