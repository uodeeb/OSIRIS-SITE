import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useLocation } from 'wouter';
import { background, character, videoBg, audio } from '@/lib/assets';

type ChapterId = 'intro' | 'cordoba' | 'taifas' | 'granada' | 'twentieth';

interface ChapterContent {
  id: ChapterId;
  title: string;
  arabicTitle: string;
  content: React.ReactNode;
  choices?: Choice[];
}

export default function PartFour() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('intro');
  const [, setLocation] = useLocation();

  const chapters: Record<ChapterId, ChapterContent> = {
    'intro': {
      id: 'intro',
      title: 'Part Four: Andalusia & 20th Century',
      arabicTitle: 'الجزء الرابع: الأندلس والقرن العشرون',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-foreground">
            في الأندلس، حيث الحضارة الإسلامية تلمع...
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            وفي أوروبا، حيث الكبر يصبح أيديولوجية...
          </p>
          <p className="text-base text-muted-foreground italic">
            نرى النمط ينتقل من الفرد إلى المؤسسة إلى النظام.
          </p>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-cordoba',
          text: 'شاهد مجد قرطبة',
          consequence: 'The glory of Cordoba...',
        },
      ],
    },
    'cordoba': {
      id: 'cordoba',
      title: 'Cordoba: The Jewel',
      arabicTitle: 'قرطبة: الجوهرة',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              في القرن الحادي عشر...
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              بينما أوروبا في ظلام العصور الوسطى...
            </p>
            <p className="text-primary font-semibold mt-4 text-lg">
              قرطبة تضيء العالم
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <p className="text-2xl font-bold text-primary">1,000,000</p>
                <p className="text-xs text-muted-foreground">السكان</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">70</p>
                <p className="text-xs text-muted-foreground">مكتبة عامة</p>
              </div>
            </div>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-taifas',
          text: 'عصر الطوائف: الانقسام',
          consequence: 'The division begins...',
        },
      ],
    },
    'taifas': {
      id: 'taifas',
      title: 'The Age of Taifas',
      arabicTitle: 'عصر الطوائف',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              لكن الكبر يدخل إلى قلوب الأمراء.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              كل أمير يقول:
            </p>
            <p className="text-destructive font-bold mt-4 text-lg">
              "أنا خير من أخي"
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              فينقسمون. ويستعينون بالأعداء ضد بعضهم.
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-granada',
          text: 'سقوط غرناطة 1492',
          consequence: 'The fall...',
        },
      ],
    },
    'granada': {
      id: 'granada',
      title: 'The Fall of Granada',
      arabicTitle: 'سقوط غرناطة',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8">
            <p className="text-foreground leading-relaxed">
              1492. آخر معقل إسلامي في الأندلس.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              أبو عبد الله الصغير يغادر المدينة.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              يستدير ينظر إليها ويبكي.
            </p>
            <p className="text-muted-foreground italic mt-4">
              أمه تقول له: "ابكِ كالنساء ملكاً لم تحافظ عليه كالرجال"
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'continue-twentieth',
          text: 'القرن العشرون: الكبر يصبح نظاماً',
          consequence: 'The twentieth century...',
        },
      ],
    },
    'twentieth': {
      id: 'twentieth',
      title: '20th Century: Pride as System',
      arabicTitle: 'القرن العشرون: الكبر نظام',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl text-center"
        >
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              ثلاثة رجال. ثلاث أيديولوجيات.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'هتلر', year: '1933', city: 'برلين' },
                { name: 'ستالين', year: '1937', city: 'موسكو' },
                { name: 'بول بوت', year: '1975', city: 'كمبوديا' },
              ].map((dictator) => (
                <motion.div
                  key={dictator.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-destructive/10 border border-destructive/40 rounded-lg p-4"
                >
                  <p className="font-bold text-destructive">{dictator.name}</p>
                  <p className="text-xs text-muted-foreground">{dictator.city} {dictator.year}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-primary font-semibold mt-4">
              جملة واحدة تجمعهم جميعاً:
            </p>
            <p className="text-destructive font-bold text-lg">
              "أنا وحدي أعرف الحقيقة"
            </p>
          </div>
        </motion.div>
      ),
      choices: [
        {
          id: 'next-part',
          text: 'اذهب إلى الجزء الخامس: القرن العشرون',
          consequence: 'Moving to Part Five...',
        },
      ],
    },
  };

  const currentChapterContent = chapters[activeChapter];

  const handleChapterChoice = (choiceId: string) => {
    if (choiceId === 'continue-cordoba') {
      setActiveChapter('cordoba');
    } else if (choiceId === 'continue-taifas') {
      setActiveChapter('taifas');
    } else if (choiceId === 'continue-granada') {
      setActiveChapter('granada');
    } else if (choiceId === 'continue-twentieth') {
      setActiveChapter('twentieth');
    } else if (choiceId === 'next-part') {
      setLocation('/part-five');
    }
  };

  return (
    <CinemaMode
      backgroundImage={background('granada_fall')}
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
          <span>Part Four: Andalusia & 20th Century</span>
          <span>{Object.keys(chapters).indexOf(activeChapter) + 1} / {Object.keys(chapters).length}</span>
        </div>
      </motion.div>
    </CinemaMode>
  );
}
