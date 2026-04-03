import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useLocation } from 'wouter';
import { ASSET_URLS } from '@/lib/assetUrls';

type ChapterId = 'intro' | 'constantine' | 'council' | 'decree' | 'pattern';

interface ChapterContent {
  id: ChapterId;
  title: string;
  arabicTitle: string;
  content: React.ReactNode;
  choices?: Choice[];
}

export default function PartThree() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('intro');
  const [, setLocation] = useLocation();

  const chapters: Record<ChapterId, ChapterContent> = {
    'intro': {
      id: 'intro',
      title: 'Part Three: Nicaea',
      arabicTitle: 'الجزء الثالث: نيقية',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-foreground">
            روما، سنة 325 ميلادية.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            الإمبراطور قسطنطين يجمع الأساقفة.
          </p>
          <p className="text-base text-muted-foreground italic">
            حين يُسرق الدين من قبل السلطة.
          </p>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-constantine',
          text: 'التقِ بقسطنطين',
          consequence: 'Constantine speaks...',
        },
      ],
    },
    'constantine': {
      id: 'constantine',
      title: 'Constantine',
      arabicTitle: 'قسطنطين',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              قسطنطين لا يهتم بعقيدة المسيح.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              يهتم فقط بوحدة الإمبراطورية.
            </p>
            <p className="text-destructive font-semibold mt-4 text-lg">
              "اتفقوا — أو سأجعلكم تتفقون"
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-council',
          text: 'شاهد مجمع نيقية',
          consequence: 'The council convenes...',
        },
      ],
    },
    'council': {
      id: 'council',
      title: 'The Council of Nicaea',
      arabicTitle: 'مجمع نيقية',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-primary/10 border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              في ليلة واحدة...
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              يجتمع الأساقفة والعلماء.
            </p>
            <p className="text-primary font-semibold mt-4">
              يناقشون. يجادلون. يصرخون.
            </p>
            <p className="text-muted-foreground italic mt-4">
              لكن السلطة تقرر.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-decree',
          text: 'المرسوم الإمبراطوري',
          consequence: 'The decree is issued...',
        },
      ],
    },
    'decree': {
      id: 'decree',
      title: 'The Decree',
      arabicTitle: 'المرسوم',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              قسطنطين يوقّع المرسوم.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              ما قُرِّر في نيقية...
            </p>
            <p className="text-destructive font-semibold mt-4 text-lg">
              سيؤمن به مئات الملايين
            </p>
            <p className="text-muted-foreground italic mt-4">
              لألفي سنة قادمة.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-pattern',
          text: 'اكتشف النمط',
          consequence: 'The pattern emerges...',
        },
      ],
    },
    'pattern': {
      id: 'pattern',
      title: 'The Pattern',
      arabicTitle: 'النمط',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              صوت إبليس يهمس:
            </p>
            <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
              <p className="text-primary font-semibold italic">
                "أتذكرون؟ هذا ما قلته:"
              </p>
              <p className="text-destructive font-bold mt-4">
                "أنا خير منهم"
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                الآن، السلطة تقول ذلك.
              </p>
            </div>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'next-part',
          text: 'اذهب إلى الجزء الرابع: الأندلس',
          consequence: 'Moving to Part Four...',
        },
      ],
    },
  };

  const currentChapterContent = chapters[activeChapter];

  const handleChapterChoice = (choiceId: string) => {
    if (choiceId === 'continue-constantine') {
      setActiveChapter('constantine');
    } else if (choiceId === 'continue-council') {
      setActiveChapter('council');
    } else if (choiceId === 'continue-decree') {
      setActiveChapter('decree');
    } else if (choiceId === 'continue-pattern') {
      setActiveChapter('pattern');
    } else if (choiceId === 'next-part') {
      setLocation('/part-four');
    }
  };

  return (
    <CinemaMode
      backgroundImage={ASSET_URLS.backgrounds.nicaea_council}
      audioUrl={ASSET_URLS.audio.intro_narration}
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
          <span>Part Three: Nicaea</span>
          <span>{Object.keys(chapters).indexOf(activeChapter) + 1} / {Object.keys(chapters).length}</span>
        </div>
      </motion.div>
    </CinemaMode>
  );
}
