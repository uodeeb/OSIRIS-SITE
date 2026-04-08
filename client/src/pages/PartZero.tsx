import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useLocation } from 'wouter';
import { background, character, videoBg, audio } from '@/lib/assets';

export default function PartZero() {
  const [phase, setPhase] = useState<'intro' | 'case-file' | 'opening'>('intro');
  const [showChoices, setShowChoices] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setPhase('case-file'), 4000);
      return () => clearTimeout(timer);
    }
    if (phase === 'case-file') {
      const timer = setTimeout(() => {
        setPhase('opening');
        setShowChoices(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleChoice = (choiceId: string) => {
    if (choiceId === 'accept') {
      setLocation('/part-one');
    }
  };

  const choices: Choice[] = [
    {
      id: 'accept',
      text: 'قبول الملف والاستماع إلى الأدلة',
      consequence: 'Begin the trial...',
    },
    {
      id: 'refuse',
      text: 'رفض الحكم والخروج',
      consequence: 'The trial continues regardless...',
      locked: true,
    },
  ];

  return (
    <CinemaMode
      backgroundImage={background('osiris_cosmic')}
      audioUrl={audio('intro_narration')}
      autoPlayAudio={true}
    >
      {phase === 'intro' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center space-y-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mx-auto w-32 h-32 flex items-center justify-center"
          >
            <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/50">
              <span className="text-5xl">⚖️</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary">
              OSIRIS
            </h1>
            <p className="text-2xl text-primary/80 font-arabic">
              المفسدون في الأرض
            </p>
            <p className="text-lg text-muted-foreground">
              A Cosmic Trial Spanning 6,000 Years
            </p>
          </motion.div>
        </motion.div>
      )}

      {phase === 'case-file' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-2xl"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8 space-y-4">
            <p className="text-sm text-muted-foreground font-mono">
              ═══════════════════════════════════════
            </p>
            <p className="text-lg font-bold text-primary">الملف رقم: واحد</p>
            <p className="text-foreground">المتهم: الإنسان</p>
            <p className="text-foreground">المدّعي: إبليس</p>
            <p className="text-foreground">الاتهام: عدم الأهلية للتكريم</p>
            <p className="text-foreground">الأدلة: ستة آلاف سنة من التاريخ</p>
            <p className="text-foreground font-semibold text-primary">القاضي: الله وحده</p>
            <p className="text-sm text-muted-foreground font-mono">
              ═══════════════════════════════════════
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl text-primary italic"
          >
            افتح الملف...
          </motion.p>
        </motion.div>
      )}

      {phase === 'opening' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-12 text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              الغرفة الكونية
            </h2>
            <p className="text-xl text-muted-foreground">
              The Cosmic Trial Room
            </p>

            <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-foreground leading-relaxed">
                في مكان خارج الزمان والمكان، يجلس راوٍ غير مرئي.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                أمامه ملف ضخم. ملف القضية الكونية.
              </p>
              <p className="text-primary font-semibold mt-4">
                ستة آلاف سنة من الفساد والكبر والانحراف.
              </p>
              <p className="text-muted-foreground mt-4 italic">
                والآن، الحكم يبدأ...
              </p>
            </div>
          </motion.div>

          {showChoices && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <InteractiveChoice
                choices={choices}
                onChoose={handleChoice}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </CinemaMode>
  );
}
