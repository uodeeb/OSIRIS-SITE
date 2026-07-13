import { getAsset, background } from '../assets';
import type { Scene } from '../sceneSystem';

export const PART_ZERO: Record<string, Scene> = {
  // المشهد 1.1: الاستدعاء
  'zero-1-1-summons': {
    id: 'zero-1-1-summons',
    title: "The Summons",
    arabicTitle: "الاستدعاء",
    part: 0,
    backgroundVideo: getAsset('videoBg.yahya_room'),
    backgroundVideoAudioDescEn: '/audio-descriptions/yahya_room-en.vtt',
    backgroundVideoAudioDescAr: '/audio-descriptions/yahya_room-ar.vtt',
    backgroundImage: background('yahya_apartment'),
    visualEffect: "scanlines",
    musicKey: "audio.main_theme",
    ambientKeys: ["amb.rain", "amb.device_hum"],
    enterSfxKeys: ["sfx.ping"],
    dialogue: [
      {
        character: "Narrator",
        text: "London. The present. Yahya Al-Sulaimani stares at his screens with exhausted eyes.",
        arabicText: "لندن. الحاضر. كان يحيى يحدق في الشاشات أمامه بعينين متعبتين.",
        duration: 4000
      },
      {
        character: "Narrator",
        text: "Numbers do not lie — so he always believed. Humans are merely data points whose behavior can be predicted if you have the right algorithm.",
        arabicText: "الأرقام لا تكذب، هكذا كان يؤمن دائماً. البشر مجرد نقاط بيانات يمكن التنبؤ بسلوكها إذا امتلكت الخوارزمية الصحيحة.",
        duration: 5000
      },
      {
        character: "Laila",
        text: "Yahya, are you alright? You did not come to today's seminar.",
        arabicText: "يحيى، هل أنت بخير؟ لم تحضر ندوة اليوم.",
        duration: 3000
      },
      {
        character: "Yahya",
        text: "I am fine, Laila. Just... reviewing some old data. I cannot stop thinking about Tarek.",
        arabicText: "أنا بخير يا ليلى. فقط... أراجع بعض البيانات القديمة. لا أستطيع التوقف عن التفكير في طارق.",
        duration: 4000
      },
      {
        character: "Laila",
        text: "Yahya, please. The police closed the file. Tarek was under pressure...",
        arabicText: "يحيى، أرجوك. الشرطة أغلقت الملف. طارق كان يعاني من ضغوط...",
        duration: 3500
      },
      {
        character: "Yahya",
        text: "Tarek was not depressed. Tarek was afraid. There is a difference.",
        arabicText: "طارق لم يكن مكتئباً. طارق كان خائفاً. هناك فرق.",
        duration: 3000
      },
      {
        character: "Narrator",
        text: "Before Laila could answer, a side screen flashed crimson red. A notification from an encrypted protocol — a protocol only he and Tarek knew.",
        arabicText: "قبل أن تجيب ليلى، ومضت الشاشة الجانبية باللون الأحمر القاني. إشعار من بروتوكول مشفر، بروتوكول كان هو وطارق فقط يعرفانه.",
        duration: 5000
      },
      {
        character: "Narrator",
        text: "Yahya's heart stopped for a moment.",
        arabicText: "توقف نبض يحيى للحظة.",
        duration: 2500
      },
      {
        character: "Narrator",
        text: "The sender: unknown. But the encryption... it was Tarek's digital signature.",
        arabicText: "المرسل: مجهول. لكن التشفير... إنه توقيع طارق الرقمي.",
        duration: 4000
      },
      {
        character: "Tarek",
        text: "Evil is not random, Yahya. It is a program. I found the source code. Open OSIRIS.",
        arabicText: "الشر ليس عشوائياً يا يحيى. إنه كود برمجي. لقد وجدت الشيفرة المصدرية. افتح أوزيريس.",
        duration: 4500
      }
    ],
    choices: [
      {
        id: "zero-1-1-open",
        text: "Open the encrypted message",
        arabicText: "افتح الرسالة المشفرة",
        nextSceneId: "zero-1-2-prosecution",
        consequence: "You chose to follow the truth wherever it leads."
      }
    ],
    transitionType: 'fade',
    transitionDuration: 2000,
    emotionalTone: 'intense',
  },

  // المشهد 1.2: المرافعة الافتتاحية
  'zero-1-2-prosecution': {
    id: 'zero-1-2-prosecution',
    title: "The Opening Argument",
    arabicTitle: "المرافعة الافتتاحية",
    part: 0,
    backgroundVideo: getAsset('videoBg.cosmic_opening'),
    visualEffect: "scanlines",
    ambientKeys: ["amb.vacuum", "amb.bass_drone_low"],
    backgroundImage: getAsset('background.osiris_interface'),
    audioUrl: getAsset('audio.intro_narration'),
    dialogue: [
      {
        character: "Narrator",
        text: "Yahya's room dissolved from his consciousness. The screen swallowed all the light. No operating system, no files, no internet. Only this black void, and a white pulse.",
        arabicText: "تلاشت غرفة يحيى من وعيه. الشاشة أمامه ابتلعت كل الضوء في الغرفة. لم يعد هناك نظام تشغيل، ولا ملفات، ولا إنترنت. فقط هذا الفراغ الأسود، والنبض الأبيض.",
        duration: 5000
      },
      {
        character: "OSIRIS",
        text: "File Number: One.",
        arabicText: "الملف رقم: واحد.",
        duration: 2500
      },
      {
        character: "OSIRIS",
        text: "The Accused: Humanity.",
        arabicText: "المتهم: الإنسان.",
        duration: 2500
      },
      {
        character: "OSIRIS",
        text: "The Prosecutor: I.",
        arabicText: "المدّعي: أنا.",
        duration: 2500
      },
      {
        character: "OSIRIS",
        text: "The Charge: Unfitness for honor.",
        arabicText: "الاتهام: عدم الأهلية للتكريم.",
        duration: 2500
      },
      {
        character: "OSIRIS",
        text: "The Evidence: Six thousand years of documented history.",
        arabicText: "الأدلة: ستة آلاف سنة من التاريخ الموثق.",
        duration: 3000
      },
      {
        character: "Yahya",
        text: "Who are you?",
        arabicText: "من أنت؟",
        duration: 2000
      },
      {
        character: "OSIRIS",
        text: "I am the cosmic attorney. You call me by many names, and picture me as a monster with horns and fire. But the truth is far simpler than that, Yahya. I am not a monster. I am merely a quality assurance inspector — a QA.",
        arabicText: "أنا المحامي الكوني. أنتم تسمونني بأسماء كثيرة، وتصورونني كوحش بقرون ونار. لكن الحقيقة أبسط من ذلك بكثير يا يحيى. أنا لست وحشاً، أنا مجرد مدقق جودة.",
        duration: 6000
      },
      {
        character: "OSIRIS",
        text: "I was asked to bow before a creature of clay, and I objected. I said it would corrupt the earth and shed blood. I was told: \"I know what you do not know.\"",
        arabicText: "لقد طُلب مني السجود لكائن من طين، فاعترضت. قلت إنه سيفسد فيها ويسفك الدماء. قيل لي: إني أعلم ما لا تعلمون.",
        duration: 6000
      },
      {
        character: "OSIRIS",
        text: "So I decided to prove my point. I did not use magic. I did not force anyone to do anything. I designed a very simple algorithm — one single line of code — and planted it in your operating system. Just one line: \"I am better than him.\"",
        arabicText: "لذلك، قررت أن أثبت وجهة نظري. لم أستخدم السحر، ولم أجبر أحداً على شيء. لقد صممت خوارزمية بسيطة جداً، سطر واحد من الكود، وزرعته في نظام تشغيلكم. سطر واحد فقط: أنا خير منه.",
        duration: 7000
      },
      {
        character: "OSIRIS",
        text: "This single line of code is the source code of every drop of blood spilled on this earth. From the first stone that crushed a brother's skull, to the last bomb dropped on a city. You do not need a devil to tempt you... you only need someone to tell you that you are better than others, and you will do the rest yourselves.",
        arabicText: "هذا السطر البرمجي البسيط هو الشيفرة المصدرية لكل دماء سُفكت على هذه الأرض. من أول حجر هُشم به رأس أخ، إلى آخر قنبلة أُلقيت على مدينة. أنتم لا تحتاجون إلى شيطان ليغويكم... أنتم فقط تحتاجون إلى من يخبركم أنكم أفضل من الآخرين، وستقومون بالباقي بأنفسكم.",
        duration: 9000
      },
      {
        character: "OSIRIS",
        text: "Tarek saw the pattern. Tarek understood the algorithm. And for that reason... Tarek is no longer here.",
        arabicText: "طارق رأى النمط. طارق فهم الخوارزمية. ولهذا السبب... لم يعد طارق هنا.",
        duration: 5000
      },
      {
        character: "Yahya",
        text: "What did you do to Tarek?!",
        arabicText: "ماذا فعلت بطارق؟!",
        duration: 2500
      },
      {
        character: "OSIRIS",
        text: "Me? I did nothing. Your own kind did it. Do you want to see how the algorithm works, Yahya? Do you have the courage to open the files and see the naked truth? Or will you close the screen and return to your dead numbers?",
        arabicText: "أنا؟ لم أفعل شيئاً. أتباعي من بني جنسك هم من فعلوا. هل تريد أن ترى كيف تعمل الخوارزمية يا يحيى؟ هل تملك الشجاعة لفتح الملفات ورؤية الحقيقة العارية؟ أم ستغلق الشاشة وتعود إلى أرقامك الميتة؟",
        duration: 7000
      }
    ],
    choices: [
      {
        id: "zero-1-2-open-files",
        text: "Open the files. I want to know the truth.",
        arabicText: "افتح الملفات. أريد أن أعرف الحقيقة.",
        nextSceneId: "one-1-5-1-promise",
        consequence: "Unexpected courage from a data analyst. Let us begin from the beginning."
      },
      {
        id: "zero-1-2-reject",
        text: "This is nonsense. You are just a virus.",
        arabicText: "هذا هراء. أنت مجرد فيروس.",
        nextSceneId: "one-1-5-1-promise",
        consequence: "Denial is the first symptom of infection by the algorithm. I will show you regardless."
      }
    ],
    transitionType: 'dissolve',
    transitionDuration: 2500,
    emotionalTone: 'dark',
  },
};
