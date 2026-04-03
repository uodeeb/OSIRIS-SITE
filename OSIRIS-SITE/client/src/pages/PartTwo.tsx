import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useLocation } from 'wouter';
import { ASSET_URLS } from '@/lib/assetUrls';

type ChapterId = 'intro' | 'ramses-mirror' | 'mysterious-priest' | 'divine-claim' | 'moses-confrontation';

interface ChapterContent {
  id: ChapterId;
  title: string;
  arabicTitle: string;
  content: React.ReactNode;
  choices?: Choice[];
}

export default function PartTwo() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('intro');
  const [, setLocation] = useLocation();

  const chapters: Record<ChapterId, ChapterContent> = {
    'intro': {
      id: 'intro',
      title: 'Part Two: Pharaoh',
      arabicTitle: 'الجزء الثاني: فرعون',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-foreground">
            في مصر، حيث النيل يجري...
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            رجل يقف أمام مرآة الماء.
          </p>
          <p className="text-base text-muted-foreground italic">
            اسمه: رمسيس الثاني
          </p>
          <p className="text-foreground mt-6">
            عبقري. محارب. لكنه يحمل جرحاً عميقاً.
          </p>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-mirror',
          text: 'شاهد انعكاسه في المرآة',
          consequence: 'The reflection reveals...',
        },
      ],
    },
    'ramses-mirror': {
      id: 'ramses-mirror',
      title: 'The Mirror of the Nile',
      arabicTitle: 'مرآة النيل',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              ينظر رمسيس إلى انعكاسه.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              يرى ملكاً عظيماً.
            </p>
            <p className="text-primary font-semibold mt-4">
              لكنه يسأل كاهنه:
            </p>
            <p className="text-destructive italic mt-4">
              "لماذا يجب أن أموت؟"
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-priest',
          text: 'استمع إلى الكاهن الغامض',
          consequence: 'The mysterious priest speaks...',
        },
      ],
    },
    'mysterious-priest': {
      id: 'mysterious-priest',
      title: 'The Mysterious Priest',
      arabicTitle: 'الكاهن الغامض',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              الكاهن يهمس في الظلام:
            </p>
            <p className="text-destructive font-semibold mt-4 text-lg">
              "لأنهم يقولون إن فوقك رباً"
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              تلك الكلمات تزرع بذرة في قلب فرعون.
            </p>
            <p className="text-primary font-semibold mt-4">
              بذرة الكبر.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-divine',
          text: 'شاهد إعلان الألوهية',
          consequence: 'The declaration of divinity...',
        },
      ],
    },
    'divine-claim': {
      id: 'divine-claim',
      title: 'The Declaration of Divinity',
      arabicTitle: 'إعلان الألوهية',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-primary/10 border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              على جدران أبو سمبل، يُنقش:
            </p>
            <p className="text-primary font-bold mt-4 text-lg">
              "أنا الإله"
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              فرعون يعلن ألوهيته.
            </p>
            <p className="text-muted-foreground italic mt-4">
              لكن في الجهة الأخرى من النيل...
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-moses',
          text: 'موسى يأتي بالحق',
          consequence: 'Moses arrives with the truth...',
        },
      ],
    },
    'moses-confrontation': {
      id: 'moses-confrontation',
      title: 'The Confrontation',
      arabicTitle: 'المواجهة',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              موسى يقف أمام فرعون.
            </p>
            <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
              <p className="text-foreground italic">
                "أنا لا أدعي الألوهية."
              </p>
              <p className="text-primary font-semibold mt-4">
                "أنا فقط رسول من الله الحق."
              </p>
            </div>
            <p className="text-foreground leading-relaxed mt-6">
              وهنا يبدأ الصراع الحقيقي.
            </p>
            <p className="text-muted-foreground">
              الكبر ضد الحق.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'next-part',
          text: 'اذهب إلى الجزء الثالث: نيقية',
          consequence: 'Moving to Part Three...',
        },
      ],
    },
  };

  const currentChapterContent = chapters[activeChapter];

  const handleChapterChoice = (choiceId: string) => {
    if (choiceId === 'continue-mirror') {
      setActiveChapter('ramses-mirror');
    } else if (choiceId === 'continue-priest') {
      setActiveChapter('mysterious-priest');
    } else if (choiceId === 'continue-divine') {
      setActiveChapter('divine-claim');
    } else if (choiceId === 'continue-moses') {
      setActiveChapter('moses-confrontation');
    } else if (choiceId === 'next-part') {
      setLocation('/part-three');
    }
  };

  return (
    <CinemaMode
      backgroundImage={ASSET_URLS.backgrounds.pharaoh_temple}
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
          <span>Part Two: Pharaoh</span>
          <span>{Object.keys(chapters).indexOf(activeChapter) + 1} / {Object.keys(chapters).length}</span>
        </div>
      </motion.div>
    </CinemaMode>
  );
}
