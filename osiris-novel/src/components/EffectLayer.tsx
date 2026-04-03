import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type EffectType = 'scanlines' | 'glitch' | 'cctv' | 'alarm' | 'montage' | 'none'

interface EffectLayerProps {
  effect: EffectType
  isFrozen: boolean
}

export function EffectLayer({ effect, isFrozen }: EffectLayerProps) {
  const [glitchKey, setGlitchKey] = useState(0)

  useEffect(() => {
    if (effect !== 'glitch' || isFrozen) return

    const interval = setInterval(() => {
      setGlitchKey((k) => k + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [effect, isFrozen])

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {effect === 'scanlines' && (
        <div className="scanlines absolute inset-0" />
      )}

      {effect === 'glitch' && (
        <motion.div
          key={glitchKey}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            x: [0, -4, 3, -2, 0],
            y: [0, 2, -1, 1, 0],
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'linear-gradient(90deg, rgba(255,0,0,0.03) 0%, rgba(0,255,0,0.03) 50%, rgba(0,0,255,0.03) 100%)',
          }}
        />
      )}

      {effect === 'cctv' && (
        <>
          <div className="scanlines absolute inset-0" />
          <div className="vignette absolute inset-0" />
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded text-xs text-red-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              REC
            </div>
          </div>
        </>
      )}

      {effect === 'alarm' && (
        <div className="alarm-pulse absolute inset-0 border-4 border-osiris-red/30 rounded-none" />
      )}

      {effect === 'montage' && (
        <motion.div
          className="absolute inset-0 bg-white/5"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />
      )}

      <div className="film-grain absolute inset-0" />
      <div className="vignette absolute inset-0" />
    </div>
  )
}
