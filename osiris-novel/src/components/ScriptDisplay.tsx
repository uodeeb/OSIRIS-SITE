import { motion, AnimatePresence } from 'framer-motion'
import { CHARACTER_COLORS, CHARACTERS, CharacterId } from '@/data/characters'
import { Lock } from 'lucide-react'

interface ScriptDisplayProps {
  character: CharacterId
  text: string
  arabicText: string
  displayedText: string
  displayedArabic: string
  isTyping: boolean
  isDialogueComplete: boolean
  isFrozen: boolean
  voiceLocked: boolean
  onClick: () => void
}

export function ScriptDisplay({
  character,
  text,
  arabicText,
  displayedText,
  displayedArabic,
  isTyping,
  isDialogueComplete,
  isFrozen,
  voiceLocked,
  onClick,
}: ScriptDisplayProps) {
  const charColor = CHARACTER_COLORS[character] || '#888888'
  const charData = CHARACTERS[character]
  const align = charData?.align || 'center'
  const isArabicSpeaker = align === 'right'
  const displayText = isArabicSpeaker ? displayedArabic : displayedText
  const fullText = isArabicSpeaker ? arabicText : text

  const justifyClass =
    align === 'right'
      ? 'items-end text-right'
      : align === 'left'
        ? 'items-start text-left'
        : 'items-center text-center'

  const maxWidthClass =
    align === 'center' ? 'max-w-3xl' : align === 'right' ? 'max-w-2xl ml-auto' : 'max-w-2xl mr-auto'

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-end pb-32 z-20 ${justifyClass} px-8`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className={`w-full ${maxWidthClass}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${character}-${text.slice(0, 20)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-lg backdrop-blur-sm ${
              isArabicSpeaker ? 'bg-osiris-surface/60' : 'bg-osiris-surface/40'
            } border border-osiris-border/50`}
            dir={isArabicSpeaker ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: charColor }}
              />
              <span
                className="text-sm font-semibold tracking-wide uppercase"
                style={{ color: charColor }}
              >
                {charData?.nameAr || character}
              </span>
              {voiceLocked && (
                <Lock className="w-3.5 h-3.5 text-osiris-gold voice-lock-pulse" />
              )}
            </div>

            <div className="relative">
              <p
                className={`text-xl leading-relaxed font-arabic ${
                  isArabicSpeaker ? 'text-right' : 'text-left'
                } ${isTyping ? 'typewriter-cursor' : ''}`}
                style={{ color: '#e5e5e5' }}
              >
                {displayText}
              </p>
            </div>

            {isDialogueComplete && !isTyping && !isFrozen && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-osiris-text-dim mt-3"
                dir="rtl"
              >
                انقر للمتابعة
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
