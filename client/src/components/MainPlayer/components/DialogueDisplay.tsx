/**
 * OSIRIS Dialogue Display Component
 * Handles typewriter text display, character badges, and dialogue progress
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { DialogueDisplayProps } from '../types';
import styles from '../MainPlayer.module.css';

export function DialogueDisplay({
  dialogue,
  characterConfig,
  displayedText,
  displayedArabic,
  isTyping,
  isArabic,
  currentCharConfig,
  isVoiceModeActive,
  isAutoRunning,
  dialogueIndex,
  totalDialogues,
  currentIdx,
  sceneKeys,
  accentColor,
  autoTop,
  autoRight,
  autoBottom,
  autoLeft,
  isDialogueComplete,
  lang,
  onBack,
  onForward,
  canGoBack,
  autoMode,
  onAutoModeChange,
  musicVol,
  sfxVol,
  isMuted,
  onMusicVolChange,
  onSfxVolChange,
  onToggleMute,
}: DialogueDisplayProps) {
  const uiGlow = 0.5; // Simplified from parent

  return (
    <AnimatePresence mode="wait">
      {dialogue && (
        <motion.div
          key={`dlg-${dialogueIndex}`}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Character Name Badge */}
          {dialogue.character && (
            <motion.div
              initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`mb-3 flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`h-px flex-1 max-w-[50px] ${styles.dynamicAutoLine}`}
                style={{ '--auto-line': isArabic 
                  ? `linear-gradient(to left, transparent, ${currentCharConfig.color}70)` 
                  : `linear-gradient(to right, transparent, ${currentCharConfig.color}70)` 
                } as React.CSSProperties}
              />
              <span
                className={lang === 'ar'
                  ? "text-[14px] font-arabic-title px-4 py-1.5 rounded-full border"
                  : "text-[10px] font-mono tracking-[0.22em] uppercase px-3 py-1 rounded-full border"
                }
                style={{
                  color: currentCharConfig.color,
                  borderColor: `${currentCharConfig.color}28`,
                  background: `linear-gradient(90deg, ${currentCharConfig.color}18, rgba(0,0,0,0.25))`,
                  textShadow: `0 0 16px ${currentCharConfig.glowColor}`
                }}
              >
                {lang === 'ar' ? currentCharConfig.arabicName : currentCharConfig.name}
              </span>
              <div 
                className={`h-px flex-1 max-w-[50px] ${styles.dynamicAutoLine}`} 
                style={{ '--auto-line': isArabic 
                  ? `linear-gradient(to right, transparent, ${currentCharConfig.color}70)` 
                  : `linear-gradient(to left, transparent, ${currentCharConfig.color}70)` 
                } as React.CSSProperties} 
              />
            </motion.div>
          )}

          {/* Dialogue Box */}
          <div
            className={`relative rounded-2xl px-4 py-4 sm:px-7 sm:py-6 md:px-9 md:py-7 ${isArabic ? 'text-right' : ''} ${styles.dynamicDialogueBox}`}
            dir={isArabic ? 'rtl' : 'ltr'}
            style={{
              '--dialogue-bg': 'rgba(0,0,0,0.66)',
              '--dialogue-border': isAutoRunning 
                ? '1px solid rgba(0,0,0,0)' 
                : `1px solid ${currentCharConfig.color}18`,
              '--dialogue-shadow': `0 10px 70px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 ${currentCharConfig.color}10`,
              '--dialogue-backdrop': 'blur(18px)'
            } as React.CSSProperties}
          >
            {/* Gradient overlays */}
            <div
              className={`absolute inset-0 rounded-2xl pointer-events-none ${styles.dynamicGradientOverlay}`}
              style={{
                '--gradient-overlay': `linear-gradient(180deg, ${currentCharConfig.color}10, rgba(0,0,0,0) 45%, rgba(0,0,0,0.25))`
              } as React.CSSProperties}
            />
            <div
              className={`absolute inset-0 rounded-2xl pointer-events-none ${styles.dynamicRadialGlow}`}
              style={{
                '--radial-glow': `radial-gradient(circle at 20% 20%, ${currentCharConfig.color}33, rgba(0,0,0,0) 55%)`,
                '--blend-mode': 'screen',
                opacity: uiGlow * 0.7
              } as React.CSSProperties}
            />

            {/* Progress line */}
            <motion.div
              className={`absolute top-0 left-0 h-[2px] rounded-t-2xl ${styles.dynamicProgressLine}`}
              style={{ '--progress-line': `linear-gradient(to right, ${accentColor}30, ${accentColor}95)` } as React.CSSProperties}
              animate={{ width: `${((currentIdx + 1) / sceneKeys.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Auto-running border animation */}
            {isAutoRunning && (
              <>
                <motion.div
                  className={`absolute top-0 left-0 h-px rounded-t-2xl ${styles.dynamicAutoLine}`}
                  style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                  animate={{ width: `${autoTop * 100}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                />
                <motion.div
                  className={`absolute top-0 right-0 w-px rounded-r-2xl ${styles.dynamicAutoLine}`}
                  style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                  animate={{ height: `${autoRight * 100}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                />
                <motion.div
                  className={`absolute bottom-0 right-0 h-px rounded-b-2xl ${styles.dynamicAutoLine}`}
                  style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                  animate={{ width: `${autoBottom * 100}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                />
                <motion.div
                  className={`absolute bottom-0 left-0 w-px rounded-l-2xl ${styles.dynamicAutoLine}`}
                  style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                  animate={{ height: `${autoLeft * 100}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                />
              </>
            )}

            {/* Text Content */}
            {lang === 'en' ? (
              <p
                className={`text-white/93 text-[20px] md:text-[26px] font-light ${styles.dynamicDialogueText}`}
                style={{
                  '--text-shadow': '0 1px 8px rgba(0,0,0,0.98)',
                  '--letter-spacing': '0.012em',
                  '--line-height': '1.75'
                } as React.CSSProperties}
              >
                {displayedText}
                {isTyping && (
                  <motion.span
                    className={`inline-block w-0.5 h-6 ml-1 align-middle ${styles.dynamicAutoLine}`}
                    style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                  />
                )}
              </p>
            ) : (
              <p
                className={`text-white/93 text-[22px] md:text-[30px] text-right font-arabic ${styles.dynamicArabicText}`}
                dir="rtl"
                style={{
                  '--text-shadow': '0 1px 8px rgba(0,0,0,0.98)',
                  '--line-height': '2.1'
                } as React.CSSProperties}
              >
                {displayedArabic}
                {isTyping && (
                  <motion.span
                    className={`inline-block w-0.5 h-6 mr-1 align-middle ${styles.dynamicAutoLine}`}
                    style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                  />
                )}
              </p>
            )}

            {/* Dialogue Progress Dots */}
            {totalDialogues > 1 && (
              <div className="flex items-center justify-center gap-2 mt-5">
                {Array.from({ length: totalDialogues }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="rounded-full"
                    animate={{
                      width: idx === dialogueIndex ? 24 : 5,
                      opacity: idx === dialogueIndex ? 1 : idx < dialogueIndex ? 0.45 : 0.15,
                    }}
                    transition={{ duration: 0.35 }}
                    style={{
                      height: 3,
                      background: idx === dialogueIndex
                        ? currentCharConfig.color
                        : idx < dialogueIndex
                          ? `${currentCharConfig.color}65`
                          : 'rgba(255,255,255,0.12)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Navigation Controls */}
            {!isVoiceModeActive && (
              <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onBack(); }}
                    disabled={!canGoBack}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed ${styles.dynamicColor} ${styles.dynamicBorder} ${styles.dynamicBg}`}
                    style={{
                      '--dynamic-color': 'rgba(201,169,110,0.75)',
                      '--dynamic-border': 'rgba(201,169,110,0.22)',
                      '--dynamic-bg': 'rgba(0,0,0,0.35)'
                    } as React.CSSProperties}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points={isArabic ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
                    </svg>
                    <span className="text-[9px] font-mono tracking-wider">{isArabic ? 'السابق' : 'BACK'}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onForward(); }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-white/10 ${styles.dynamicColor} ${styles.dynamicBorder} ${styles.dynamicBg}`}
                    style={{
                      '--dynamic-color': 'rgba(201,169,110,0.78)',
                      '--dynamic-border': 'rgba(201,169,110,0.26)',
                      '--dynamic-bg': 'rgba(0,0,0,0.35)'
                    } as React.CSSProperties}
                  >
                    <span className="text-[9px] font-mono tracking-wider">{isArabic ? 'التالي' : 'NEXT'}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points={isArabic ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
                    </svg>
                  </button>
                </div>

                {/* Auto Mode Controls */}
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`flex items-center rounded-lg overflow-hidden ${isArabic ? 'flex-row-reverse' : ''} ${styles.dynamicBorder} ${styles.dynamicBg}`}
                    style={{
                      '--dynamic-border': 'rgba(201,169,110,0.22)',
                      '--dynamic-bg': 'rgba(0,0,0,0.35)'
                    } as React.CSSProperties}
                  >
                    {(['off', 'very-slow', 'slow', 'normal'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => onAutoModeChange(mode)}
                        className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicBg} ${styles.dynamicColor}`}
                        style={{
                          '--dynamic-bg': autoMode === mode ? 'rgba(201,169,110,0.25)' : 'transparent',
                          '--dynamic-color': autoMode === mode ? '#c9a96e' : 'rgba(255,255,255,0.4)'
                        } as React.CSSProperties}
                      >
                        {isArabic 
                          ? mode === 'off' ? 'إيقاف' : mode === 'very-slow' ? 'بطيء جداً' : mode === 'slow' ? 'بطيء' : 'عادي'
                          : mode === 'off' ? 'AUTO OFF' : mode === 'very-slow' ? 'VSLOW' : mode === 'slow' ? 'SLOW' : 'NORMAL'
                        }
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
