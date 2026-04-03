/**
 * OSIRIS Choice Panel Component
 * Handles choice selection with countdown timer
 */

import { motion, AnimatePresence } from 'framer-motion';
import styles from '../MainPlayer.module.css';
import type { ChoicePanelProps } from '../types';

export function ChoicePanel({
  choices,
  isArabic,
  choiceProgress,
  accentColor,
  timerSeconds,
  lang,
  onChoice,
}: ChoicePanelProps) {
  if (!choices || choices.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="choices-panel"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 28 }}
        transition={{ duration: 0.9 }}
        className={`max-w-4xl mx-auto ${isArabic ? 'text-right' : ''}`}
        dir={isArabic ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Timer Progress Bar */}
        <div className={`mb-4 flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1 h-0.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${styles.dynamicProgressBar}`}
              style={{
                '--progress-background': choiceProgress > 55
                  ? `linear-gradient(to right, ${accentColor}80, ${accentColor})`
                  : choiceProgress > 22
                    ? 'linear-gradient(to right, #f97316, #fbbf24)'
                    : 'linear-gradient(to right, #ef4444, #f97316)',
                width: `${choiceProgress}%`,
                transition: 'width 0.05s linear'
              } as React.CSSProperties}
            />
          </div>
          
          {/* Countdown Number */}
          <motion.span
            className={`text-[11px] font-mono tabular-nums flex-shrink-0 w-6 ${styles.dynamicCountdown} ${isArabic ? 'text-left' : 'text-right'}`}
            style={{
              '--countdown-color': choiceProgress > 55 ? `${accentColor}90`
                : choiceProgress > 22 ? '#fbbf2490'
                : '#ef444490'
            } as React.CSSProperties}
            animate={{ scale: timerSeconds <= 5 ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timerSeconds <= 5 ? Infinity : 0 }}
          >
            {timerSeconds}
          </motion.span>
        </div>

        {/* Choice Buttons */}
        <div className="grid gap-3">
          {choices.map((choice, idx) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -28 : 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              onClick={() => onChoice(choice)}
              className={`group relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] ${isArabic ? 'text-right' : 'text-left'} ${styles.dynamicChoicePanel}`}
              style={{
                '--choice-bg': 'rgba(0,0,0,0.72)',
                '--choice-border': `1px solid ${accentColor}20`,
                '--choice-shadow': '0 4px 30px rgba(0,0,0,0.5)',
                '--choice-backdrop': 'blur(14px)'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.setProperty('--choice-border', `1px solid ${accentColor}55`);
                el.style.setProperty('--choice-bg', `${accentColor}0a`);
                el.style.setProperty('--choice-shadow', `0 4px 40px ${accentColor}15`);
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.setProperty('--choice-border', `1px solid ${accentColor}20`);
                el.style.setProperty('--choice-bg', 'rgba(0,0,0,0.72)');
                el.style.setProperty('--choice-shadow', '0 4px 30px rgba(0,0,0,0.5)');
              }}
            >
              <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0 ${styles.dynamicChoiceNumber}`}
                  style={{
                    '--choice-num-bg': `${accentColor}15`,
                    '--choice-num-color': accentColor,
                    '--choice-num-border': `1px solid ${accentColor}30`
                  } as React.CSSProperties}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {lang === 'en' ? (
                    <p className="text-white/88 text-base md:text-lg font-light leading-snug">{choice.text}</p>
                  ) : (
                    <p className="text-white/93 text-base md:text-lg leading-relaxed text-right font-arabic" dir="rtl">
                      {choice.arabicText || choice.text}
                    </p>
                  )}
                </div>

                <span
                  className={`text-base mx-1 flex-shrink-0 opacity-0 group-hover:opacity-70 transition-all duration-300 ${styles.dynamicCountdown} ${isArabic ? 'order-first' : ''}`}
                  style={{ '--countdown-color': accentColor } as React.CSSProperties}
                >
                  {isArabic ? '←' : '→'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Auto-continue hint */}
        {lang === 'ar' ? (
          <p className="text-center text-white/30 text-[11px] mt-3 font-arabic-ui" dir="rtl">
            {`سيتابع تلقائياً خلال ${timerSeconds} ثانية`}
          </p>
        ) : (
          <p className="text-center text-white/30 text-[10px] mt-3 font-mono tracking-wider">
            {`Auto-continuing in ${timerSeconds}s`}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
