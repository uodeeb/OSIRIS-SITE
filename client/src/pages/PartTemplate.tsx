import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinemaMode } from '@/components/CinemaMode';
import { InteractiveChoice, Choice } from '@/components/InteractiveChoice';
import { useLocation } from 'wouter';
import { background, character, videoBg, audio } from '@/lib/assets';

/**
 * Template for cinema-mode part pages
 * Replace PART_NAME, BACKGROUND_KEY, and AUDIO_KEY with actual values
 */

export default function PartTemplate() {
  const [activeChapter, setActiveChapter] = useState('intro');
  const [, setLocation] = useLocation();

  const handleChoice = (choiceId: string) => {
    if (choiceId === 'next-chapter') {
      // Navigate to next part
      setLocation('/part-next');
    }
  };

  const choices: Choice[] = [
    {
      id: 'next-chapter',
      text: 'اذهب إلى الفصل التالي',
      consequence: 'The story continues...',
    },
  ];

  return (
    <CinemaMode
      backgroundImage={background('osiris_cosmic')}
      audioUrl={audio('intro_narration')}
      autoPlayAudio={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 text-center"
      >
        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            الجزء
          </h1>
          <p className="text-2xl text-muted-foreground">
            Part Title
          </p>
          
          <div className="bg-card/80 backdrop-blur-sm border border-primary/40 rounded-lg p-8 max-w-2xl mx-auto">
            <p className="text-foreground leading-relaxed">
              Content goes here...
            </p>
          </div>
        </div>

        {/* Character or Image */}
        {false && (
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            src={character('yahya_main')}
            alt="Character"
            className="mx-auto max-w-xs h-auto"
          />
        )}

        {/* Interactive Choices */}
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
      </motion.div>
    </CinemaMode>
  );
}
