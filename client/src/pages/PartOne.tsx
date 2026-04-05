import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useNavigation } from '@/contexts/NavigationContext';
import { useLocation } from 'wouter';
import { ASSET_URLS } from '@/lib/assetUrls';

type ChapterId = 'qabil-habil-intro' | 'qabil-habil-scene' | 'qabil-habil-aftermath' | 'iblis-plan-intro' | 'iblis-plan-six-axes';

interface ChapterContent {
  id: ChapterId;
  title: string;
  arabicTitle: string;
  subtitle?: string;
  content: React.ReactNode;
  choices?: Choice[];
}

export default function PartOne() {
  const { currentChapter, goToPart, markChapterComplete, recordChoice } = useNavigation();
  const [activeChapter, setActiveChapter] = useState<ChapterId>('qabil-habil-intro');
  const [, setLocation] = useLocation();

  const chapters: Record<ChapterId, ChapterContent> = {
    'qabil-habil-intro': {
      id: 'qabil-habil-intro',
      title: 'Qabil & Habil: The First Murder',
      arabicTitle: 'قابيل وهابيل: أول جريمة',
      subtitle: 'The pattern begins...',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-foreground">
            لم يكن إبليس يكره آدم.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            هذا ما يخطئ فيه الناس دائماً.
          </p>
          <p className="text-base text-muted-foreground italic">
            إبليس كان يكره الإجابة التي سيمثّلها آدم.
          </p>
          <p className="text-foreground mt-6">
            وهكذا بدأت الخطة.
          </p>
          <p className="text-foreground">
            خطة تمتد ستة آلاف سنة.
          </p>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-qabil',
          text: 'شاهد قصة قابيل وهابيل',
          consequence: 'The first murder unfolds...',
        },
      ],
    },
    'qabil-habil-scene': {
      id: 'qabil-habil-scene',
      title: 'The First Murder',
      arabicTitle: 'أول قتل في التاريخ',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              قابيل ينظر إلى هابيل.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              يرى الفرق بينهما.
            </p>
            <p className="text-primary font-semibold mt-4">
              "أنا خير منه"
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              وفي تلك اللحظة، يُرتكب أول قتل في التاريخ.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-aftermath',
          text: 'شاهد العواقب',
          consequence: 'The aftermath...',
        },
      ],
    },
    'qabil-habil-aftermath': {
      id: 'qabil-habil-aftermath',
      title: 'The Pattern',
      arabicTitle: 'النمط',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              صوت إبليس يهمس في الظلام:
            </p>
            <p className="text-destructive font-semibold mt-4 text-lg">
              "ألم أقل؟ هذا ما يفعله الإنسان."
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              جريمة واحدة. نمط واحد.
            </p>
            <p className="text-primary font-semibold mt-4">
              "أنا خير منه"
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-iblis-plan',
          text: 'اكتشف خطة إبليس',
          consequence: 'The six-axis plan...',
        },
      ],
    },
    'iblis-plan-intro': {
      id: 'iblis-plan-intro',
      title: "Iblis's Plan",
      arabicTitle: 'خطة إبليس',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              بعد الرفض من السجود، أقسم إبليس قسماً:
            </p>
            <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
              <p className="text-primary font-semibold italic">
                "لأغوينّهم أجمعين إلا عبادك منهم المخلصين"
              </p>
            </div>
            <p className="text-muted-foreground mt-6">
              وبدأ يخطط. ستة محاور. ستة طرق للفساد.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-six-axes',
          text: 'تعرف على المحاور الستة',
          consequence: 'The six axes of corruption...',
        },
      ],
    },
    'iblis-plan-six-axes': {
      id: 'iblis-plan-six-axes',
      title: 'The Six Axes of Corruption',
      arabicTitle: 'المحاور الستة للفساد',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-3xl text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { num: 1, title: 'الكبر', desc: 'زرع "أنا خير منه" في النفوس' },
              { num: 2, title: 'الشهوة', desc: 'تحويل الإنسان من خليفة إلى حيوان' },
              { num: 3, title: 'الكذب', desc: 'تشويه الحقيقة حتى تصبح الباطل جميلًا' },
              { num: 4, title: 'الفرقة', desc: 'تحويل "نحن" إلى "أنا ضد الجميع"' },
              { num: 5, title: 'اليأس', desc: 'قطع الإنسان عن ربه بالقنوط' },
              { num: 6, title: 'الشبهة', desc: 'التشكيك في كل ما هو ثابت' },
            ].map((axis) => (
              <motion.div
                key={axis.num}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: axis.num * 0.1 }}
                className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-4"
              >
                <p className="text-primary font-bold text-lg">{axis.num}. {axis.title}</p>
                <p className="text-sm text-muted-foreground mt-2">{axis.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-foreground mt-8">
            وهكذا بدأت رحلة الفساد التي تمتد عبر التاريخ...
          </p>
        </motion.div>
      ),
      choices: [
        {
          id: 'next-part',
          text: 'اذهب إلى الجزء الثاني: فرعون',
          consequence: 'Moving to Part Two...',
        },
      ],
    },
  };

  const currentChapterContent = chapters[activeChapter];

  const handleChapterChoice = (choiceId: string) => {
    const choice = currentChapterContent.choices?.find((c) => c.id === choiceId);
    // Choice recorded in navigation context
    if (choiceId === 'continue-qabil') {
      setActiveChapter('qabil-habil-scene');
    } else if (choiceId === 'continue-aftermath') {
      setActiveChapter('qabil-habil-aftermath');
    } else if (choiceId === 'continue-iblis-plan') {
      setActiveChapter('iblis-plan-intro');
    } else if (choiceId === 'continue-six-axes') {
      setActiveChapter('iblis-plan-six-axes');
    } else if (choiceId === 'next-part') {
      setLocation('/part-two');
    }
  };

  return (
    <CinemaMode
      backgroundImage={ASSET_URLS.backgrounds.qabil_habil_altar}
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
          {currentChapterContent.subtitle && (
            <p className="text-lg text-muted-foreground">
              {currentChapterContent.subtitle}
            </p>
          )}
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
          <span>Part One: The First Crime</span>
          <span>{Object.keys(chapters).indexOf(activeChapter) + 1} / {Object.keys(chapters).length}</span>
        </div>
      </motion.div>
    </CinemaMode>
  );
}
