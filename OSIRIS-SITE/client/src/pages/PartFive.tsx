import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useLocation } from 'wouter';
import { ASSET_URLS } from '@/lib/assetUrls';

type ChapterId = 'intro' | 'hitler' | 'stalin' | 'polpot' | 'pattern';

interface ChapterContent {
  id: ChapterId;
  title: string;
  arabicTitle: string;
  content: React.ReactNode;
  choices?: Choice[];
}

export default function PartFive() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('intro');
  const [, setLocation] = useLocation();

  const chapters: Record<ChapterId, ChapterContent> = {
    'intro': {
      id: 'intro',
      title: 'Part Five: 20th Century',
      arabicTitle: 'الجزء الخامس: القرن العشرون',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-foreground">
            القرن الذي شهد أكثر الجرائم دموية.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            ثلاثة أنظمة. ثلاثة زعماء. نمط واحد.
          </p>
          <p className="text-base text-muted-foreground italic">
            "أنا وحدي أعرف الحقيقة"
          </p>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-hitler',
          text: 'برلين 1933: هتلر',
          consequence: 'Hitler rises...',
        },
      ],
    },
    'hitler': {
      id: 'hitler',
      title: 'Berlin 1933: Hitler',
      arabicTitle: 'برلين 1933: هتلر',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              هتلر يقف أمام المرآة.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              يُدرِّب نفسه على تعابير وجهه.
            </p>
            <p className="text-destructive font-semibold mt-4">
              يعتقد بعمق أنه مختار.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              أنه فوق كل القواعد الأخلاقية.
            </p>
            <p className="text-destructive font-bold mt-4">
              6 ملايين قتيل
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-stalin',
          text: 'موسكو 1937: ستالين',
          consequence: 'Stalin\'s terror...',
        },
      ],
    },
    'stalin': {
      id: 'stalin',
      title: 'Moscow 1937: Stalin',
      arabicTitle: 'موسكو 1937: ستالين',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              ستالين يوقّع قوائم الإعدام بيده.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              أكثر من 40,000 توقيع شخصي موثق.
            </p>
            <p className="text-destructive font-semibold mt-4">
              يشرب نخب "النصر على الأعداء"
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              وأعداؤه هم كل من يختلف معه.
            </p>
            <p className="text-destructive font-bold mt-4">
              20 مليون قتيل
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-polpot',
          text: 'كمبوديا 1975: بول بوت',
          consequence: 'Pol Pot\'s madness...',
        },
      ],
    },
    'polpot': {
      id: 'polpot',
      title: 'Cambodia 1975: Pol Pot',
      arabicTitle: 'كمبوديا 1975: بول بوت',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              بول بوت، خريج جامعات باريس.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              تعلّم فلسفة التحرر الإنساني.
            </p>
            <p className="text-destructive font-semibold mt-4">
              طبّقها بقتل ربع سكان بلاده
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              كل من يرتدي نظارة يُعتبر عدوّاً.
            </p>
            <p className="text-destructive font-bold mt-4">
              2 مليون قتيل
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
              ثلاثة رجال. ثلاث أيديولوجيات مختلفة.
            </p>
            <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
              <p className="text-primary font-bold text-lg">
                لكن جملة واحدة تجمعهم:
              </p>
              <p className="text-destructive font-bold mt-4 text-xl">
                "أنا وحدي أعرف الحقيقة"
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                = "أنا خير منهم"
              </p>
            </div>
            <p className="text-muted-foreground italic mt-6">
              النمط يتكرر عبر التاريخ.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'next-part',
          text: 'اذهب إلى الجزء السادس: الكبر الرقمي',
          consequence: 'Moving to Part Six...',
        },
      ],
    },
  };

  const currentChapterContent = chapters[activeChapter];

  const handleChapterChoice = (choiceId: string) => {
    if (choiceId === 'continue-hitler') {
      setActiveChapter('hitler');
    } else if (choiceId === 'continue-stalin') {
      setActiveChapter('stalin');
    } else if (choiceId === 'continue-polpot') {
      setActiveChapter('polpot');
    } else if (choiceId === 'continue-pattern') {
      setActiveChapter('pattern');
    } else if (choiceId === 'next-part') {
      setLocation('/part-six');
    }
  };

  return (
    <CinemaMode
      backgroundImage={ASSET_URLS.backgrounds.berlin_1933}
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
          <span>Part Five: 20th Century</span>
          <span>{Object.keys(chapters).indexOf(activeChapter) + 1} / {Object.keys(chapters).length}</span>
        </div>
      </motion.div>
    </CinemaMode>
  );
}
