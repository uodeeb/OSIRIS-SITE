import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useLocation } from 'wouter';
import { background, character, videoBg, audio } from '@/lib/assets';

type ChapterId = 'intro' | 'facebook' | 'algorithm' | 'digital-pride' | 'reflection';

interface ChapterContent {
  id: ChapterId;
  title: string;
  arabicTitle: string;
  content: React.ReactNode;
  choices?: Choice[];
}

export default function PartSix() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('intro');
  const [, setLocation] = useLocation();

  const chapters: Record<ChapterId, ChapterContent> = {
    'intro': {
      id: 'intro',
      title: 'Part Six: Digital Pride',
      arabicTitle: 'الجزء السادس: الكبر الرقمي',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-foreground">
            إبليس اليوم لا يحتاج إلى كهنة ومعابد.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            يحتاج إلى خوارزمية.
          </p>
          <p className="text-base text-muted-foreground italic">
            تُغذي كل إنسان بما يُعزز كبره.
          </p>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-facebook',
          text: 'فيسبوك: الوثيقة المسرّبة',
          consequence: 'The leaked document...',
        },
      ],
    },
    'facebook': {
      id: 'facebook',
      title: 'Facebook: The Leaked Document',
      arabicTitle: 'فيسبوك: الوثيقة المسرّبة',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              2021: وثيقة داخلية من فيسبوك تُسرّب.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              مهندسو فيسبوك اكتشفوا:
            </p>
            <p className="text-primary font-semibold mt-4 text-lg">
              الخوارزمية تُضاعف انتشار المحتوى المثير للغضب
            </p>
            <p className="text-destructive font-bold">
              بمعدل 6 أضعاف المحتوى الهادئ
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-algorithm',
          text: 'القرار الإداري',
          consequence: 'The decision...',
        },
      ],
    },
    'algorithm': {
      id: 'algorithm',
      title: 'The Decision',
      arabicTitle: 'القرار',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              حين عُرض الأمر على الإدارة...
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              قرّروا:
            </p>
            <p className="text-destructive font-bold mt-4 text-lg">
              الإبقاء على الخوارزمية
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              لأنها تزيد وقت الاستخدام والأرباح.
            </p>
            <p className="text-muted-foreground italic mt-4">
              الكبر الرقمي. الربح على حساب الإنسانية.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-digital',
          text: 'الكبر الرقمي',
          consequence: 'Digital pride emerges...',
        },
      ],
    },
    'digital-pride': {
      id: 'digital-pride',
      title: 'Digital Pride',
      arabicTitle: 'الكبر الرقمي',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              صوت إبليس يهمس عبر الشاشات:
            </p>
            <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
              <p className="text-primary font-semibold italic">
                "كل شخص يعتقد أنه محق."
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                الخوارزمية تُغذيه بما يؤمن به.
              </p>
              <p className="text-destructive font-bold mt-4">
                "أنا خير منهم"
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                وهكذا ينقسم المجتمع.
              </p>
            </div>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-reflection',
          text: 'الانعكاس',
          consequence: 'The reflection...',
        },
      ],
    },
    'reflection': {
      id: 'reflection',
      title: 'The Reflection',
      arabicTitle: 'الانعكاس',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              من قابيل إلى فرعون...
            </p>
            <p className="text-lg text-foreground">
              من قسطنطين إلى الأمراء المنقسمين...
            </p>
            <p className="text-lg text-foreground">
              من الديكتاتوريين إلى الخوارزميات...
            </p>
            <div className="bg-primary/10 border border-primary/40 rounded-lg p-8 mt-6">
              <p className="text-primary font-bold text-lg">
                النمط واحد.
              </p>
              <p className="text-destructive font-bold mt-4">
                "أنا خير منهم"
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                ستة آلاف سنة. نفس الجريمة. نفس الكبر.
              </p>
            </div>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'next-part',
          text: 'اذهب إلى الجزء السابع: شهود الدفاع',
          consequence: 'Moving to Part Seven...',
        },
      ],
    },
  };

  const currentChapterContent = chapters[activeChapter];

  const handleChapterChoice = (choiceId: string) => {
    if (choiceId === 'continue-facebook') {
      setActiveChapter('facebook');
    } else if (choiceId === 'continue-algorithm') {
      setActiveChapter('algorithm');
    } else if (choiceId === 'continue-digital') {
      setActiveChapter('digital-pride');
    } else if (choiceId === 'continue-reflection') {
      setActiveChapter('reflection');
    } else if (choiceId === 'next-part') {
      setLocation('/');
    }
  };

  return (
    <CinemaMode
      backgroundImage={background('corporate_lab')}
      audioUrl={audio('intro_narration')}
      autoPlayAudio={true}
    >
      <motion.div
        key={activeChapter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {currentChapterContent.title}
          </h1>
          <p className="text-2xl text-primary/80 font-arabic">
            {currentChapterContent.arabicTitle}
          </p>
        </div>

        <div>{currentChapterContent.content}</div>

        {currentChapterContent.choices && (
          <div className="mt-12">
            <InteractiveChoice
              choices={currentChapterContent.choices}
              onChoose={handleChapterChoice}
            />
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-muted-foreground pt-8 border-t border-primary/20">
          <span>Part Six: Digital Pride</span>
          <span>{Object.keys(chapters).indexOf(activeChapter) + 1} / {Object.keys(chapters).length}</span>
        </div>
      </motion.div>
    </CinemaMode>
  );
}
