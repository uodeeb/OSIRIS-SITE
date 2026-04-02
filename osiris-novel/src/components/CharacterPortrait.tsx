import { motion, AnimatePresence } from 'framer-motion'
import { CHARACTERS, CHARACTER_COLORS, CharacterId } from '@/data/characters'

interface CharacterPortraitProps {
  characterId: CharacterId
  isVisible: boolean
}

export function CharacterPortrait({ characterId, isVisible }: CharacterPortraitProps) {
  const character = CHARACTERS[characterId]
  if (!character) return null

  const color = CHARACTER_COLORS[characterId] || '#888888'
  const initial = character.nameEn.charAt(0)
  const hasPortrait = character.portrait && character.portrait.length > 0

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: character.align === 'right' ? 40 : character.align === 'left' ? -40 : 0, y: character.align === 'center' ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: character.align === 'right' ? 40 : character.align === 'left' ? -40 : 0, y: character.align === 'center' ? 20 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`absolute z-15 pointer-events-none ${
            character.align === 'right'
              ? 'right-8 bottom-48'
              : character.align === 'left'
                ? 'left-8 bottom-48'
                : 'left-1/2 -translate-x-1/2 bottom-48'
          }`}
        >
          {hasPortrait ? (
            <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-osiris-border/50 shadow-2xl">
              <img
                src={character.portrait}
                alt={character.nameEn}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-osiris-border/50 shadow-2xl"
              style={{
                backgroundColor: `${color}22`,
                borderColor: `${color}66`,
                color: color,
              }}
            >
              {initial}
            </div>
          )}

          <p
            className="text-center text-xs mt-2 font-semibold tracking-wide"
            style={{ color }}
          >
            {character.nameAr}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
